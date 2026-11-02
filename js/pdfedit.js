/* Edit PDF engine (no screens here): changing the text that is already in a PDF, and page operations.
   - eraseText: takes the original words out of a page's content, so a replaced line is really gone
     (not only covered): job websites and anyone copying the text get the new words only.
   - editPages: rotate, delete, add a blank page, move a page.
   - lines / paragraphs: the text on a page (pdf.js), with position, size and font, for "Edit text" and PDF to Word.
   - eraseArea / paintBoxes: black-out takes out every letter under a box, and finds pictures or drawings under it.
   Everything happens on the phone. */
(function () {
  'use strict';
  var L = function () { return window.PDFLib; };

  /* ---------- matrices (PDF order: [a b c d e f], points are row vectors) ---------- */
  function mul(m, n) {
    return [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3],
      m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5]];
  }
  function apply(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
  var ID = [1, 0, 0, 1, 0, 0];

  /* ---------- reading a content stream ---------- */
  var WS = { 0: 1, 9: 1, 10: 1, 12: 1, 13: 1, 32: 1 };
  var DELIM = { 40: 1, 41: 1, 60: 1, 62: 1, 91: 1, 93: 1, 123: 1, 125: 1, 47: 1, 37: 1 };
  // splits the content into operators: [{ op, args, start, end }] (start/end are byte offsets of the whole operator with its operands)
  function parse(b) {
    var i = 0, n = b.length, ops = [], args = [], argStart = -1, stack = [];
    function push(v, at) { if (stack.length) stack[stack.length - 1].push(v); else { if (argStart < 0) argStart = at; args.push(v); } }
    while (i < n) {
      var c = b[i];
      if (WS[c]) { i++; continue; }
      if (c === 37) { while (i < n && b[i] !== 10 && b[i] !== 13) i++; continue; } // % comment
      var at = i;
      if (c === 40) { // (literal string)
        var out = [], depth = 1; i++;
        while (i < n && depth) {
          var d = b[i++];
          if (d === 92) {
            var e = b[i++];
            if (e === 110) out.push(10); else if (e === 114) out.push(13); else if (e === 116) out.push(9); else if (e === 98) out.push(8); else if (e === 102) out.push(12);
            else if (e >= 48 && e <= 55) { var o = e - 48, k = 0; while (k < 2 && b[i] >= 48 && b[i] <= 55) { o = o * 8 + b[i++] - 48; k++; } out.push(o & 255); }
            else if (e === 13) { if (b[i] === 10) i++; } else if (e === 10) { /* line continuation */ } else out.push(e);
          } else if (d === 40) { depth++; out.push(d); } else if (d === 41) { depth--; if (depth) out.push(d); } else out.push(d);
        }
        push({ s: out }, at); continue;
      }
      if (c === 60 && b[i + 1] !== 60) { // <hex string>
        i++; var hx = '';
        while (i < n && b[i] !== 62) { var h = b[i++]; if (!WS[h]) hx += String.fromCharCode(h); }
        i++; if (hx.length % 2) hx += '0';
        var hb = []; for (var j = 0; j < hx.length; j += 2) hb.push(parseInt(hx.substr(j, 2), 16) || 0);
        push({ s: hb }, at); continue;
      }
      if (c === 60 || c === 91) { // << dict or [ array
        var arr = []; arr.dict = c === 60; push(arr, at); stack.push(arr); i += c === 60 ? 2 : 1; continue;
      }
      if ((c === 62 && b[i + 1] === 62) || c === 93) { stack.pop(); i += c === 93 ? 1 : 2; continue; }
      if (c === 47) { // /Name
        i++; var nm = ''; while (i < n && !WS[b[i]] && !DELIM[b[i]]) nm += String.fromCharCode(b[i++]);
        push({ n: nm }, at); continue;
      }
      if (c === 123 || c === 125 || c === 41 || c === 62) { i++; continue; } // stray delimiters
      var w = ''; while (i < n && !WS[b[i]] && !DELIM[b[i]]) w += String.fromCharCode(b[i++]);
      if (/^[+\-]?(\d+\.?\d*|\.\d+)$/.test(w)) { push(+w, at); continue; }
      if (w === 'true' || w === 'false' || w === 'null') { push(w, at); continue; }
      if (stack.length) { stack = []; } // an operator inside an unclosed array: give up on that array
      if (w === 'BI') { // inline image: skip its data up to EI
        var s0 = argStart < 0 ? at : argStart, idp = findId(b, i), p = idp < 0 ? n : findEI(b, idp);
        ops.push({ op: 'BI', args: [], start: s0, end: p }); i = p; args = []; argStart = -1; continue;
      }
      ops.push({ op: w, args: args, start: argStart < 0 ? at : argStart, end: i });
      args = []; argStart = -1;
    }
    return ops;
  }
  function findId(b, i) { for (; i < b.length - 1; i++) if (b[i] === 73 && b[i + 1] === 68 && WS[b[i - 1]] && (WS[b[i + 2]] || i + 2 >= b.length)) return i + 3; return -1; }
  function findEI(b, i) { for (; i < b.length - 1; i++) if (b[i] === 69 && b[i + 1] === 73 && WS[b[i - 1]] && (i + 2 >= b.length || WS[b[i + 2]])) return i + 2; return b.length; }

  /* ---------- font widths, to know how far each piece of text moves on ---------- */
  var STD14 = { Helvetica: 'Helvetica', 'Helvetica-Bold': 'Helvetica-Bold', 'Helvetica-Oblique': 'Helvetica-Oblique', 'Helvetica-BoldOblique': 'Helvetica-BoldOblique',
    'Times-Roman': 'Times-Roman', 'Times-Bold': 'Times-Bold', 'Times-Italic': 'Times-Italic', 'Times-BoldItalic': 'Times-BoldItalic',
    Courier: 'Courier', 'Courier-Bold': 'Courier-Bold', 'Courier-Oblique': 'Courier-Oblique', 'Courier-BoldOblique': 'Courier-BoldOblique',
    Arial: 'Helvetica', 'Arial,Bold': 'Helvetica-Bold', 'Arial,Italic': 'Helvetica-Oblique', 'Arial,BoldItalic': 'Helvetica-BoldOblique',
    TimesNewRoman: 'Times-Roman', 'TimesNewRoman,Bold': 'Times-Bold', 'TimesNewRoman,Italic': 'Times-Italic', 'TimesNewRoman,BoldItalic': 'Times-BoldItalic' };
  // Windows-1252 letters 128-159
  var WIN = ['\u20AC', '', '\u201A', '\u0192', '\u201E', '\u2026', '\u2020', '\u2021', '\u02C6', '\u2030', '\u0160', '\u2039', '\u0152', '', '\u017D', '',
    '', '\u2018', '\u2019', '\u201C', '\u201D', '\u2022', '\u2013', '\u2014', '\u02DC', '\u2122', '\u0161', '\u203A', '\u0153', '', '\u017E', '\u0178'];
  function num(v) { var P = L(); if (v instanceof P.PDFNumber) return v.asNumber(); return typeof v === 'number' ? v : null; }
  function fontInfo(doc, res, name, cache) {
    if (cache[name]) return cache[name];
    var P = L(), info = { ok: false };
    try {
      var fonts = res && res.lookup(P.PDFName.of('Font'), P.PDFDict);
      var f = fonts && fonts.lookup(P.PDFName.of(name), P.PDFDict);
      if (f) {
        var sub = f.lookup(P.PDFName.of('Subtype'));
        sub = sub ? sub.toString() : '';
        if (sub === '/Type0') {
          var enc = f.lookup(P.PDFName.of('Encoding'));
          var df = f.lookup(P.PDFName.of('DescendantFonts'), P.PDFArray);
          var cid = df && df.lookup(0, P.PDFDict);
          if (enc && /Identity-[HV]/.test(enc.toString()) && cid) {
            var W = {}, dw = num(cid.lookup(P.PDFName.of('DW'))) || 1000, warr = cid.lookupMaybe(P.PDFName.of('W'), P.PDFArray);
            if (warr) {
              var a = warr.asArray(), k = 0;
              while (k < a.length) {
                var c0 = num(warr.lookup(k)), nx = warr.lookup(k + 1);
                if (nx instanceof P.PDFArray) { for (var j = 0; j < nx.size(); j++) W[c0 + j] = num(nx.lookup(j)); k += 2; }
                else { var c1 = num(nx), wv = num(warr.lookup(k + 2)); for (var cc = c0; cc <= c1 && cc - c0 < 65536; cc++) W[cc] = wv; k += 3; }
              }
            }
            info = { ok: true, two: true, W: W, dw: dw };
          }
        } else if (sub !== '/Type3') {
          var first = num(f.lookup(P.PDFName.of('FirstChar'))), wa = f.lookupMaybe(P.PDFName.of('Widths'), P.PDFArray);
          var bf = String(f.lookup(P.PDFName.of('BaseFont')) || '').replace(/^\//, '');
          if (!wa && STD14[bf] && P.StandardFontEmbedder) {
            // the 14 standard fonts often come without widths: they are built into pdf-lib
            var em = P.StandardFontEmbedder.for(STD14[bf]), ws0 = [];
            for (var cc0 = 0; cc0 < 256; cc0++) { var ch = cc0 >= 128 && cc0 < 160 ? (WIN[cc0 - 128] || '') : String.fromCharCode(cc0); var w0 = 0; try { w0 = ch ? em.widthOfTextAtSize(ch, 1000) : 0; } catch (e) { w0 = 500; } ws0.push(w0); }
            info = { ok: true, two: false, first: 0, ws: ws0, miss: 500 };
          } else if (first != null && wa) {
            var ws = []; for (var q = 0; q < wa.size(); q++) ws.push(num(wa.lookup(q)) || 0);
            var md = 0; try { var fd = f.lookupMaybe(P.PDFName.of('FontDescriptor'), P.PDFDict); md = fd ? num(fd.lookup(P.PDFName.of('MissingWidth'))) || 0 : 0; } catch (e) { md = 0; }
            info = { ok: true, two: false, first: first, ws: ws, miss: md };
          }
        }
      }
    } catch (e) { info = { ok: false }; }
    cache[name] = info;
    return info;
  }
  // how far a piece of text moves the text position, in text space units (null when the widths are unknown)
  function advance(str, st, font) {
    if (!font || !font.ok) return null;
    var tx = 0, bytes = str.s;
    if (font.two) {
      for (var i = 0; i + 1 < bytes.length; i += 2) {
        var cid = bytes[i] * 256 + bytes[i + 1], w = font.W[cid];
        tx += ((w == null ? font.dw : w) / 1000) * st.fs + st.tc;
      }
    } else {
      for (var k = 0; k < bytes.length; k++) {
        var code = bytes[k], idx = code - font.first, w2 = idx >= 0 && idx < font.ws.length ? font.ws[idx] : font.miss;
        tx += (w2 / 1000) * st.fs + st.tc + (code === 32 ? st.tw : 0);
      }
    }
    return tx * st.th;
  }

  /* ---------- taking text out of a page ---------- */
  function decodeContents(page) {
    var P = L(), c = page.node.Contents();
    if (!c) return null;
    var streams = c instanceof P.PDFArray ? c.asArray().map(function (r) { return page.doc.context.lookup(r); }) : [c];
    var parts = [], total = 0;
    for (var i = 0; i < streams.length; i++) {
      var s = streams[i], bytes;
      if (s instanceof P.PDFRawStream) bytes = P.decodePDFRawStream(s).decode();
      else if (s && s.getContents) bytes = s.getContents();
      else return null;
      parts.push(bytes); total += bytes.length + 1;
    }
    var out = new Uint8Array(total), at = 0;
    parts.forEach(function (p) { out.set(p, at); at += p.length; out[at++] = 10; });
    return out;
  }
  function enc(s) { var o = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) o[i] = s.charCodeAt(i) & 255; return o; }
  var MOVE = { Td: 1, TD: 1, Tm: 1, 'T*': 1, BT: 1, ET: 1 };
  /* boxes: [[x, y, w, h], ...] in points on the page as shown (top-left origin): the band around the baseline of each
     line to take out. A piece of text goes when the point where it starts lies in a band. t: the page's view
     transform (pdf.js). Returns how many pieces of text were taken out. */
  // stats (optional array): stats[k] = { removed, kept } for box k - kept: text that starts in the band but had to stay
  function eraseText(doc, pageIndex, boxes, t, stats) {
    var P = L(), page = doc.getPages()[pageIndex];
    if (!page || !boxes.length) return 0;
    var b; try { b = decodeContents(page); } catch (e) { return 0; }
    if (!b) return 0;
    var ops = parse(b), res = page.node.Resources(), fcache = {};
    function inside(x, y, fs) {
      var p = apply(t, x, y), tx = Math.max(0.6, Math.abs(fs) * 0.3);
      for (var k = 0; k < boxes.length; k++) { var r = boxes[k]; if (p[0] >= r[0] - tx && p[0] <= r[0] + r[2] + tx && p[1] >= r[1] - 0.6 && p[1] <= r[1] + r[3] + 0.6) return k; }
      return -1;
    }
    if (stats) boxes.forEach(function (bx, k) { stats[k] = { removed: 0, kept: 0 }; });
    var ctm = ID.slice(), gs = [], st = null, inText = false, known = true;
    var edits = []; // { op, rep (string), adv } per removed operator, in order
    var block = []; // show operators of the current BT block: { o, removed, known(before), unknownAdv }
    var blocks = [];
    function newState() { return { tm: ID.slice(), tlm: ID.slice(), fs: 0, font: null, tc: 0, tw: 0, th: 1, tl: 0, rise: 0 }; }
    var tstate = newState(); // text state survives BT/ET (except the matrices)
    function td(x, y) { tstate.tlm = mul([1, 0, 0, 1, x, y], tstate.tlm); tstate.tm = tstate.tlm.slice(); known = true; }
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i], a = o.args, op = o.op;
      if (op === 'q') gs.push([ctm.slice(), tstate.font, tstate.fs, tstate.tc, tstate.tw, tstate.th, tstate.tl, tstate.rise]);
      else if (op === 'Q') { var g = gs.pop(); if (g) { ctm = g[0]; tstate.font = g[1]; tstate.fs = g[2]; tstate.tc = g[3]; tstate.tw = g[4]; tstate.th = g[5]; tstate.tl = g[6]; tstate.rise = g[7]; } else ctm = ID.slice(); }
      else if (op === 'cm' && a.length === 6) ctm = mul(a, ctm);
      else if (op === 'BT') { inText = true; tstate.tm = ID.slice(); tstate.tlm = ID.slice(); known = true; block = []; }
      else if (op === 'ET') { inText = false; if (block.length) blocks.push(block); block = []; }
      else if (op === 'Tf' && a.length === 2) { tstate.font = fontInfo(doc, res, a[0] && a[0].n, fcache); tstate.fs = +a[1] || 0; }
      else if (op === 'Tc') tstate.tc = +a[0] || 0;
      else if (op === 'Tw') tstate.tw = +a[0] || 0;
      else if (op === 'Tz') tstate.th = (+a[0] || 100) / 100;
      else if (op === 'TL') tstate.tl = +a[0] || 0;
      else if (op === 'Ts') tstate.rise = +a[0] || 0;
      else if (op === 'Td' && a.length === 2) td(+a[0], +a[1]);
      else if (op === 'TD' && a.length === 2) { tstate.tl = -a[1]; td(+a[0], +a[1]); }
      else if (op === 'Tm' && a.length === 6) { tstate.tlm = a.slice(); tstate.tm = a.slice(); known = true; }
      else if (op === 'T*') td(0, -tstate.tl);
      else if (inText && (op === 'Tj' || op === 'TJ' || op === "'" || op === '"')) {
        var pre = '';
        if (op === "'") { td(0, -tstate.tl); pre = 'T* '; }
        if (op === '"') { tstate.tw = +a[0] || 0; tstate.tc = +a[1] || 0; td(0, -tstate.tl); pre = a[0] + ' Tw ' + a[1] + ' Tc T* '; }
        var trm = mul(tstate.tm, ctm), start = apply(trm, 0, tstate.rise), fsz = tstate.fs * Math.hypot(trm[2], trm[3]);
        // how far this piece moves on
        var adv = 0;
        if (op === 'TJ') {
          var arr = a[0] || [];
          for (var k = 0; k < arr.length && adv != null; k++) {
            var el = arr[k];
            if (typeof el === 'number') adv += -(el / 1000) * tstate.fs * tstate.th;
            else if (el && el.s) { var w = advance(el, tstate, tstate.font); adv = w == null ? null : adv + w; }
          }
        } else { var sArg = a[a.length - 1]; adv = sArg && sArg.s ? advance(sArg, tstate, tstate.font) : null; }
        var rec = { o: o, pre: pre, adv: adv, removed: false, fsTh: tstate.fs * tstate.th, box: inside(start[0], start[1], fsz) };
        if (known && rec.box >= 0) rec.removed = true;
        block.push(rec);
        if (adv == null) known = false; else tstate.tm = mul([1, 0, 0, 1, adv, 0], tstate.tm);
      } else if (op === 'Tj' || op === 'TJ') { /* text outside BT: ignore */ }
      if (MOVE[op] && op !== 'BT' && op !== 'ET' && block.length) block.push({ move: true });
    }
    if (block.length) blocks.push(block);
    // safety: a removed piece whose width is unknown may only go when no kept piece follows it on the same run
    blocks.forEach(function (bl) {
      for (var k = 0; k < bl.length; k++) {
        var r = bl[k]; if (!r.removed || r.adv != null) continue;
        for (var j = k + 1; j < bl.length; j++) {
          if (bl[j].move) break;
          if (!bl[j].removed) { r.removed = false; break; }
        }
      }
      bl.forEach(function (r) {
        if (stats && r.box >= 0 && stats[r.box]) stats[r.box][r.removed ? 'removed' : 'kept']++;
        if (!r.removed) return;
        var rep = r.pre;
        // an empty TJ that moves on by the same width keeps the rest of the line in place
        // (TJ numbers are thousandths of the font size × horizontal scale)
        if (r.adv != null && Math.abs(r.adv) > 1e-6 && Math.abs(r.fsTh) > 1e-6) rep += '[' + (-r.adv * 1000 / r.fsTh).toFixed(3) + '] TJ';
        edits.push({ o: r.o, rep: rep });
      });
    });
    if (!edits.length) return 0;
    // rebuild the content: unchanged bytes are copied as they are
    edits.sort(function (x, y) { return x.o.start - y.o.start; });
    var chunks = [], pos = 0;
    edits.forEach(function (e) { chunks.push(b.subarray(pos, e.o.start)); chunks.push(enc(' ' + e.rep + ' ')); pos = e.o.end; });
    chunks.push(b.subarray(pos));
    var len = chunks.reduce(function (s, c) { return s + c.length; }, 0), out = new Uint8Array(len), at = 0;
    chunks.forEach(function (c) { out.set(c, at); at += c.length; });
    var stream = doc.context.flateStream(out);
    page.node.set(P.PDFName.of('Contents'), doc.context.register(stream));
    return edits.length;
  }
  /* ---------- pages ---------- */
  // op: { kind: 'rotate', page, deg } | { kind: 'delete', page } | { kind: 'blank', page } (adds one after it) | { kind: 'move', page, to }
  //     | { kind: 'insert', page, docs: [bytes] } (the pages of other PDFs, after page)
  async function editPages(bytes, op, title) {
    var P = L();
    var doc = await P.PDFDocument.load(bytes, { updateMetadata: false });
    var pages = doc.getPages(), p = pages[op.page];
    if (!p) throw new Error('page');
    if (op.kind === 'rotate') p.setRotation(P.degrees(((p.getRotation().angle + op.deg) % 360 + 360) % 360));
    else if (op.kind === 'delete') { if (pages.length < 2) throw new Error('last'); doc.removePage(op.page); }
    else if (op.kind === 'blank') {
      var sz = p.getSize(), np = doc.insertPage(op.page + 1, [sz.width, sz.height]);
      np.setRotation(P.degrees(p.getRotation().angle));
    } else if (op.kind === 'insert') {
      // op.docs: the bytes of PDFs whose pages go in after op.page, in order
      var at = op.page + 1;
      for (var d = 0; d < op.docs.length; d++) {
        var other = await P.PDFDocument.load(op.docs[d], { updateMetadata: false });
        if (other.isEncrypted) throw new Error('locked');
        var cps = await doc.copyPages(other, other.getPageIndices());
        cps.forEach(function (cp2) { doc.insertPage(at++, cp2); });
      }
    } else if (op.kind === 'move') {
      var to = Math.max(0, Math.min(pages.length - 1, op.to));
      if (to !== op.page) { var cp = (await doc.copyPages(doc, [op.page]))[0]; doc.removePage(op.page); doc.insertPage(to, cp); }
    }
    if (title) try { doc.setTitle(title); } catch (e) { /* ignore */ }
    return doc.save({ useObjectStreams: true });
  }

  /* ---------- fonts: which of the app's fonts looks most like the one in the PDF ---------- */
  // the CV template fonts the app has (exact match), then look-alikes: Liberation Sans (Arial), Liberation Serif (Times),
  // Carlito (Calibri), Caladea (Cambria), TeX Gyre Pagella (Palatino)
  var TPL_FONTS = ['montserrat', 'lato', 'opensans', 'raleway', 'playfair', 'merriweather', 'poppins', 'nunito', 'oswald', 'sourcesans', 'dmsans'];
  function cleanName(nm) { return String(nm || '').replace(/^[A-Z]{6}\+/, ''); }
  function fontId(nm, fam) {
    var n = cleanName(nm).toLowerCase().replace(/[^a-z]/g, ''), have = window.CV_FONTS || {};
    if (/calibri|carlito/.test(n)) return 'carlito';
    if (/cambria|caladea|georgia|century/.test(n)) return 'caladea';
    if (/roboto/.test(n)) return 'roboto';
    for (var k = 0; k < TPL_FONTS.length; k++) if (n.indexOf(TPL_FONTS[k]) >= 0 && have[TPL_FONTS[k]]) return TPL_FONTS[k];
    if (/garamond/.test(n) && have.garamond) return 'garamond';
    if (/pagella|palatino|bookantiqua/.test(n) && have.pagella) return 'pagella';
    if (/arial|helvetica|arimo|liberationsans|nimbussans|freesans|verdana|tahoma|segoe|trebuchet|dejavusans/.test(n)) return 'libsans';
    if (/times|tinos|liberationserif|nimbusrom|freeserif|minion|bookman|dejavuserif/.test(n)) return 'libserif';
    if ((/serif/.test(n) && !/sans/.test(n)) || (fam === 'serif' && !/sans/.test(n))) return 'libserif';
    return 'libsans';
  }
  function isBold(nm, obj) { return !!(obj && (obj.bold || obj.black)) || /bold|black|heavy|semibold|demi|[-,](bd|bi|boldit)$/i.test(cleanName(nm)); }
  function isItalic(nm, obj) { return !!(obj && obj.italic) || /italic|oblique|[-,](it|bi|boldit)$|ital$/i.test(cleanName(nm)); }
  // the name Word knows the font by: "ABCDEF+TimesNewRomanPS-BoldMT" -> "Times New Roman"
  function wordFont(nm, id) {
    var n = cleanName(nm).replace(/[-,].*$/, '').replace(/(PS)?MT$/, '').replace(/PS$/, '');
    var known = { arial: 'Arial', helvetica: 'Arial', timesnewroman: 'Times New Roman', times: 'Times New Roman', calibri: 'Calibri', cambria: 'Cambria',
      georgia: 'Georgia', verdana: 'Verdana', tahoma: 'Tahoma', garamond: 'Garamond', bookantiqua: 'Book Antiqua', centurygothic: 'Century Gothic',
      roboto: 'Roboto', carlito: 'Calibri', caladea: 'Cambria', liberationsans: 'Arial', liberationserif: 'Times New Roman', arimo: 'Arial', tinos: 'Times New Roman' };
    var key = n.toLowerCase().replace(/[^a-z]/g, '');
    if (known[key]) return known[key];
    if (/symbol|wingding|dingbat/.test(key)) return 'Arial';
    if (/^[A-Za-z][A-Za-z0-9 ]{1,30}$/.test(n)) return n.replace(/([a-z])([A-Z])/g, '$1 $2');
    return { libserif: 'Times New Roman', caladea: 'Cambria', carlito: 'Calibri' }[id] || 'Arial';
  }

  // bullets that symbol fonts keep in the private-use area (Symbol, Wingdings, OpenSymbol) become a normal bullet
  var PUA_BULLET = /[\uF0B7\uF0A7\uF06C\uF06E\uF0D8\uF076\uF0FC\uF0A8\uF09F\uE00A]/g;
  /* ---------- the lines of text on a page (pdf.js), for "Edit text" ---------- */
  /* returns [{ i, x, y, w, h, base, size, str, font, bold, italic, runs }] in points on the page as shown.
     font: one of the app's fonts (see fontId); runs: the pieces of the line with their own style (for PDF to Word). */
  function lines(page, vt) {
    // the operator list loads the page's fonts, so their real names (bold, italic, family) are known
    return page.getOperatorList().catch(function () { /* names unknown: look-alikes by default */ }).then(function () { return page.getTextContent(); }).then(function (tc) {
      var Util = window.pdfjsLib.Util, items = [];
      tc.items.forEach(function (it) {
        if (!it.str || !it.str.trim()) return;
        var str = it.str.replace(PUA_BULLET, '\u2022');
        var m = Util.transform(vt, it.transform), size = Math.hypot(m[2], m[3]);
        if (size < 2 || Math.abs(Math.atan2(m[1], m[0])) > 0.02) return; // only text that runs left to right on the page
        var st = tc.styles[it.fontName] || {}, w = Math.abs(it.width) * (Math.hypot(m[0], m[1]) / (Math.hypot(it.transform[0], it.transform[1]) || 1));
        var name = '', obj = null;
        try { if (page.commonObjs.has(it.fontName)) { obj = page.commonObjs.get(it.fontName); name = obj.name || ''; } } catch (e) { name = ''; }
        var fam = st.fontFamily || '';
        items.push({ x: m[4], base: m[5], w: w, size: size, str: str, asc: st.ascent || 0.8, desc: st.descent || -0.2, name: name, fam: fam,
          font: fontId(name, fam), bold: isBold(name, obj), italic: isItalic(name, obj) });
      });
      items.sort(function (p, q) { return Math.abs(p.base - q.base) > Math.min(p.size, q.size) * 0.3 ? p.base - q.base : p.x - q.x; });
      var out = [];
      items.forEach(function (it) {
        var ln = out[out.length - 1];
        var run = { str: it.str, x: it.x, w: it.w, size: it.size, font: it.font, bold: it.bold, italic: it.italic, word: wordFont(it.name, it.font) };
        if (ln && Math.abs(ln.base - it.base) < ln.size * 0.3 && Math.abs(ln.size - it.size) < ln.size * 0.25 &&
            it.x - (ln.x + ln.w) < ln.size * 0.9 && it.x - (ln.x + ln.w) > -ln.size) {
          var gap = it.x - (ln.x + ln.w), sp = gap > ln.size * 0.15 && !/\s$/.test(ln.str) && !/^\s/.test(it.str);
          ln.str += (sp ? ' ' : '') + it.str;
          if (sp) run.str = ' ' + run.str;
          ln.runs.push(run);
          ln.w = Math.max(ln.w, it.x + it.w - ln.x);
          return;
        }
        out.push({ x: it.x, base: it.base, w: it.w, size: it.size, str: it.str, asc: Math.max(0.7, Math.min(1.05, it.asc)), desc: Math.min(-0.15, Math.max(-0.35, it.desc)),
          font: it.font, bold: it.bold, italic: it.italic, runs: [run] });
      });
      return out.map(function (l, i) {
        var top = l.base - l.size * l.asc, bottom = l.base - l.size * l.desc;
        // the style most of the line is in
        var cnt = { b: 0, i: 0, n: 0 }; l.runs.forEach(function (r) { var k = r.str.length; cnt.n += k; if (r.bold) cnt.b += k; if (r.italic) cnt.i += k; });
        return { i: i, x: l.x, y: top, w: l.w, h: bottom - top, base: l.base, size: l.size, str: l.str.replace(/\s+/g, ' ').trim(), font: l.font,
          bold: cnt.b > cnt.n / 2, italic: cnt.i > cnt.n / 2, runs: l.runs };
      });
    });
  }

  /* ---------- paragraphs: lines that belong together ---------- */
  // lines from lines(); pageW: the page width as shown. Returns [{ lines: [index...], x, y, w, h, size, lh, font, bold, italic, str, align }]
  function centred(x, w, pageW) { return Math.abs(x + w / 2 - pageW / 2) < Math.max(3, pageW * 0.02) && x > pageW * 0.12; }
  function paragraphs(ls, pageW) {
    var order = ls.slice().sort(function (a, b) { return a.base - b.base || a.x - b.x; }), out = [], used = {};
    var BULLET = /^\s*([•●▪–—\-*·]|\d{1,2}[.)]|[a-z][.)])\s/;
    order.forEach(function (l) {
      if (used[l.i]) return;
      var p = { lines: [l.i], x: l.x, y: l.y, w: l.w, h: l.h, size: l.size, font: l.font, bold: l.bold, italic: l.italic, last: l, gap: 0, right: l.x + l.w };
      used[l.i] = 1;
      for (;;) {
        var prev = p.last, nx = null;
        order.forEach(function (c) {
          if (used[c.i] || nx) return;
          var d = c.base - prev.base;
          if (d < prev.size * 0.9 || d > prev.size * 1.9) return;
          if (Math.abs(c.size - p.size) > p.size * 0.15 || c.bold !== p.bold) return;
          if (c.x < p.x - p.size * 0.6 || c.x > p.x + p.size * 3) return;
          if (p.gap && Math.abs(d - p.gap) > p.gap * 0.25) return;
          if (BULLET.test(c.str)) return;
          // the line before was short: that was the end of a paragraph
          if (prev.x + prev.w < Math.max(p.right, c.x + c.w) - p.size * 3.5) return;
          nx = c;
        });
        if (!nx) break;
        p.gap = p.gap || nx.base - prev.base;
        p.lines.push(nx.i); used[nx.i] = 1; p.last = nx;
        p.x = Math.min(p.x, nx.x); p.right = Math.max(p.right, nx.x + nx.w); p.h = nx.y + nx.h - p.y;
      }
      var lsP = p.lines.map(function (k) { return ls.filter(function (x) { return x.i === k; })[0]; });
      var str = '';
      lsP.forEach(function (x, k) { str += (k && !/-$/.test(str) ? ' ' : '') + x.str; });
      var allC = lsP.length > 1 ? lsP.every(function (x) { return centred(x.x, x.w, pageW); }) && lsP.some(function (x) { return Math.abs(x.x - lsP[0].x) > 2; }) : centred(l.x, l.w, pageW);
      out.push({ lines: p.lines, x: p.x, y: p.y, w: p.right - p.x, h: p.h, size: p.size, lh: p.gap ? p.gap / p.size : 1.15, font: p.font, bold: p.bold, italic: p.italic,
        str: str, align: allC ? 'center' : 'left', base: l.base });
    });
    return out;
  }

  /* ---------- black-out: taking out every letter under a box, and finding what else is under it ---------- */
  function hexStr(bytes) { var h = '<'; for (var i = 0; i < bytes.length; i++) h += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16); return h + '>'; }
  function hits(r, boxes) { return boxes.some(function (b) { return r[0] < b[0] + b[2] && r[0] + r[2] > b[0] && r[1] < b[1] + b[3] && r[1] + r[3] > b[1]; }); }
  function boxOf(m, t, x0, y0, x1, y1) {
    var ps = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(function (p) { var q = apply(m, p[0], p[1]); return apply(t, q[0], q[1]); });
    var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
    var a = Math.min.apply(null, xs), b = Math.min.apply(null, ys);
    return [a, b, Math.max.apply(null, xs) - a, Math.max.apply(null, ys) - b];
  }
  /* boxes: [[x, y, w, h]] on the page as shown. Every letter that touches a box is taken out of the page content (the rest of
     the line stays where it was). Returns { removed, unsure }: unsure = some text under a box could not be measured, so the
     page should be saved as a picture. */
  function eraseArea(doc, pageIndex, boxes, t) {
    var P = L(), page = doc.getPages()[pageIndex], res0 = { removed: 0, unsure: false };
    if (!page || !boxes.length) return res0;
    var b; try { b = decodeContents(page); } catch (e) { return { removed: 0, unsure: true }; }
    if (!b) return res0;
    var ops = parse(b), res = page.node.Resources(), fcache = {}, edits = [], unsure = false, removed = 0;
    var ctm = ID.slice(), gs = [], st = { tm: ID.slice(), tlm: ID.slice(), fs: 0, font: null, tc: 0, tw: 0, th: 1, tl: 0, rise: 0 }, lost = false;
    function td(x, y) { st.tlm = mul([1, 0, 0, 1, x, y], st.tlm); st.tm = st.tlm.slice(); lost = false; }
    function glyphs(str) { // [{ bytes, w }] for one string, w in text space × th
      var f = st.font, out = [], bs = str.s;
      if (!f || !f.ok) return null;
      if (f.two) for (var i = 0; i + 1 < bs.length; i += 2) { var cid = bs[i] * 256 + bs[i + 1], w = f.W[cid]; out.push({ b: [bs[i], bs[i + 1]], w: (((w == null ? f.dw : w) / 1000) * st.fs + st.tc) * st.th }); }
      else for (var k = 0; k < bs.length; k++) { var c = bs[k], ix = c - f.first, w2 = ix >= 0 && ix < f.ws.length ? f.ws[ix] : f.miss; out.push({ b: [c], w: ((w2 / 1000) * st.fs + st.tc + (c === 32 ? st.tw : 0)) * st.th }); }
      return out;
    }
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i], a = o.args, op = o.op;
      if (op === 'q') gs.push([ctm.slice(), st.font, st.fs, st.tc, st.tw, st.th, st.tl, st.rise]);
      else if (op === 'Q') { var g = gs.pop(); if (g) { ctm = g[0]; st.font = g[1]; st.fs = g[2]; st.tc = g[3]; st.tw = g[4]; st.th = g[5]; st.tl = g[6]; st.rise = g[7]; } else ctm = ID.slice(); }
      else if (op === 'cm' && a.length === 6) ctm = mul(a, ctm);
      else if (op === 'BT') { st.tm = ID.slice(); st.tlm = ID.slice(); lost = false; }
      else if (op === 'Tf' && a.length === 2) { st.font = fontInfo(doc, res, a[0] && a[0].n, fcache); st.fs = +a[1] || 0; }
      else if (op === 'Tc') st.tc = +a[0] || 0;
      else if (op === 'Tw') st.tw = +a[0] || 0;
      else if (op === 'Tz') st.th = (+a[0] || 100) / 100;
      else if (op === 'TL') st.tl = +a[0] || 0;
      else if (op === 'Ts') st.rise = +a[0] || 0;
      else if (op === 'Td' && a.length === 2) td(+a[0], +a[1]);
      else if (op === 'TD' && a.length === 2) { st.tl = -a[1]; td(+a[0], +a[1]); }
      else if (op === 'Tm' && a.length === 6) { st.tlm = a.slice(); st.tm = a.slice(); lost = false; }
      else if (op === 'T*') td(0, -st.tl);
      else if (op === 'Tj' || op === 'TJ' || op === "'" || op === '"') {
        var pre = '';
        if (op === "'") { td(0, -st.tl); pre = 'T* '; }
        if (op === '"') { st.tw = +a[0] || 0; st.tc = +a[1] || 0; td(0, -st.tl); pre = a[0] + ' Tw ' + a[1] + ' Tc T* '; }
        var parts = op === 'TJ' ? (a[0] || []) : [a[a.length - 1]], trm = mul(st.tm, ctm), lo = -0.25 * st.fs + st.rise, hi = 0.95 * st.fs + st.rise;
        var x = 0, newArr = [], cur = [], gap = 0, changed = false, fsTh = st.fs * st.th, bad = false;
        var flush = function () { if (cur.length) { newArr.push(hexStr(cur)); cur = []; } if (Math.abs(gap) > 1e-6) { newArr.push((-gap * 1000 / (fsTh || 1)).toFixed(3)); gap = 0; } };
        if (lost) bad = true;
        for (var k = 0; k < parts.length && !bad; k++) {
          var el = parts[k];
          if (typeof el === 'number') { var dx = -(el / 1000) * st.fs * st.th; flush(); newArr.push(String(el)); x += dx; continue; }
          if (!el || !el.s) continue;
          var gl = glyphs(el);
          if (!gl) { bad = true; break; }
          gl.forEach(function (gy) {
            var r = boxOf(trm, t, x, lo, x + Math.max(gy.w, st.fs * 0.2), hi);
            if (hits(r, boxes)) { if (cur.length) { newArr.push(hexStr(cur)); cur = []; } gap += gy.w; changed = true; removed++; }
            else { if (Math.abs(gap) > 1e-6) { newArr.push((-gap * 1000 / (fsTh || 1)).toFixed(3)); gap = 0; } cur.push.apply(cur, gy.b); }
            x += gy.w;
          });
        }
        if (bad) {
          // widths unknown: when the start of the text could be near a box, the page has to become a picture
          var r0 = boxOf(trm, t, lost ? -st.fs * 400 : 0, lo, st.fs * 400, hi);
          if (hits(r0, boxes)) unsure = true;
          lost = true;
        } else {
          flush();
          if (changed) edits.push({ o: o, rep: pre + '[' + newArr.join(' ') + '] TJ' });
          st.tm = mul([1, 0, 0, 1, x, 0], st.tm);
        }
      }
    }
    if (edits.length) {
      edits.sort(function (p, q) { return p.o.start - q.o.start; });
      var chunks = [], pos = 0;
      edits.forEach(function (e) { chunks.push(b.subarray(pos, e.o.start)); chunks.push(enc(' ' + e.rep + ' ')); pos = e.o.end; });
      chunks.push(b.subarray(pos));
      var len = chunks.reduce(function (s2, c) { return s2 + c.length; }, 0), out = new Uint8Array(len), at = 0;
      chunks.forEach(function (c) { out.set(c, at); at += c.length; });
      page.node.set(P.PDFName.of('Contents'), doc.context.register(doc.context.flateStream(out)));
    }
    return { removed: removed, unsure: unsure };
  }
  /* what is drawn on a page apart from text: pictures, shapes and lines (not white fills), and embedded drawings,
     as boxes on the page as shown. Used to know whether a black-out covers more than text. */
  function paintBoxes(doc, pageIndex, t) {
    var P = L(), page = doc.getPages()[pageIndex], out = [];
    if (!page) return out;
    var b; try { b = decodeContents(page); } catch (e) { return null; }
    if (!b) return out;
    var ops = parse(b), res = page.node.Resources(), xo = null;
    try { xo = res && res.lookup(P.PDFName.of('XObject'), P.PDFDict); } catch (e) { xo = null; }
    var ctm = ID.slice(), gs = [], pts = [], white = false, lw = 1;
    function add(x0, y0, x1, y1, kind) { var r = boxOf(ctm, t, x0, y0, x1, y1); r.kind = kind || 'draw'; out.push(r); }
    function grow(r, d) { return [r[0] - d, r[1] - d, r[2] + 2 * d, r[3] + 2 * d]; }
    function isWhite(args, n) { return args.length === n && args.every(function (v, k) { return n === 4 ? +v === 0 : +v >= 0.99; }); }
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i], a = o.args, op = o.op;
      if (op === 'q') gs.push([ctm.slice(), white, lw]);
      else if (op === 'Q') { var g = gs.pop(); if (g) { ctm = g[0]; white = g[1]; lw = g[2]; } }
      else if (op === 'cm' && a.length === 6) ctm = mul(a, ctm);
      else if (op === 'w') lw = +a[0] || 0;
      else if (op === 'rg' || op === 'g' || op === 'k') white = isWhite(a, op === 'rg' ? 3 : op === 'g' ? 1 : 4);
      else if (op === 'sc' || op === 'scn') white = isWhite(a.filter(function (v) { return typeof v === 'number'; }), a.length) && (a.length === 1 || a.length === 3);
      else if (op === 'm' || op === 'l') pts.push([+a[0], +a[1]]);
      else if (op === 'c') pts.push([+a[0], +a[1]], [+a[2], +a[3]], [+a[4], +a[5]]);
      else if (op === 'v' || op === 'y') pts.push([+a[0], +a[1]], [+a[2], +a[3]]);
      else if (op === 're') pts.push([+a[0], +a[1]], [+a[0] + +a[2], +a[1] + +a[3]]);
      else if (/^(f|F|f\*|B|B\*|b|b\*|S|s)$/.test(op)) {
        if (pts.length) {
          var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
          var stroke = /^(S|s|B|B\*|b|b\*)$/.test(op);
          if (stroke || !white) {
            var r = boxOf(ctm, t, Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys));
            out.push(stroke ? grow(r, Math.max(0.5, lw)) : r);
          }
        }
        pts = [];
      } else if (op === 'n') pts = [];
      else if (op === 'BI') add(0, 0, 1, 1, 'img');
      else if (op === 'sh') out.push([-1e5, -1e5, 2e5, 2e5]);
      else if (op === 'Do' && a[0] && a[0].n) {
        var x = null; try { x = xo && xo.lookup(P.PDFName.of(a[0].n)); } catch (e) { x = null; }
        var sub = x && x.dict ? String(x.dict.get(P.PDFName.of('Subtype'))) : '';
        if (sub === '/Image') add(0, 0, 1, 1, 'img');
        else {
          // an embedded drawing: its whole box counts
          var bb = null; try { bb = x && x.dict.lookup(P.PDFName.of('BBox'), P.PDFArray); } catch (e) { bb = null; }
          var mx = null; try { mx = x && x.dict.lookup(P.PDFName.of('Matrix'), P.PDFArray); } catch (e) { mx = null; }
          if (bb) {
            var v = [0, 1, 2, 3].map(function (k) { return num(bb.lookup(k)) || 0; }), save = ctm;
            if (mx) ctm = mul([0, 1, 2, 3, 4, 5].map(function (k) { return num(mx.lookup(k)) || 0; }), ctm);
            add(v[0], v[1], v[2], v[3]); ctm = save;
          } else out.push([-1e5, -1e5, 2e5, 2e5]);
        }
      }
    }
    // form fields and other annotations on the page
    try {
      var annots = page.node.Annots();
      if (annots) for (var j = 0; j < annots.size(); j++) {
        var an = annots.lookup(j, P.PDFDict), rc = an && an.lookup(P.PDFName.of('Rect'), P.PDFArray);
        var sb = an && String(an.get(P.PDFName.of('Subtype')));
        if (!rc || sb === '/Link' || sb === '/Popup') continue;
        var q = [0, 1, 2, 3].map(function (k) { return num(rc.lookup(k)) || 0; }), sv = ctm; ctm = ID.slice();
        add(Math.min(q[0], q[2]), Math.min(q[1], q[3]), Math.max(q[0], q[2]), Math.max(q[1], q[3]), 'annot'); ctm = sv;
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  window.CVPdfEdit = { parse: parse, eraseText: eraseText, eraseArea: eraseArea, paintBoxes: paintBoxes, editPages: editPages, lines: lines,
    paragraphs: paragraphs, fontId: fontId, wordFont: wordFont, centred: centred };
  if (window.CVLibs) window.CVLibs.wrap(window.CVPdfEdit, ['editPages'], 'pdf');
})();
