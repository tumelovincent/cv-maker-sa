/* Edit PDF engine (no screens here): changing the text that is already in a PDF, and page operations.
   - eraseText: takes the original words out of a page's content, so a replaced line is really gone
     (not only covered): job websites and anyone copying the text get the new words only.
   - editPages: rotate, delete, add a blank page, move a page.
   - lines: the lines of text on a page (pdf.js), with their position, size and font, for "Edit text".
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
            var W = {}, dw = num(cid.lookup(P.PDFName.of('DW'))) || 1000, warr = cid.lookup(P.PDFName.of('W'), P.PDFArray);
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
          var first = num(f.lookup(P.PDFName.of('FirstChar'))), wa = f.lookup(P.PDFName.of('Widths'), P.PDFArray);
          if (first != null && wa) {
            var ws = []; for (var q = 0; q < wa.size(); q++) ws.push(num(wa.lookup(q)) || 0);
            var md = 0; try { var fd = f.lookup(P.PDFName.of('FontDescriptor'), P.PDFDict); md = fd ? num(fd.lookup(P.PDFName.of('MissingWidth'))) || 0 : 0; } catch (e) { md = 0; }
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
  function eraseText(doc, pageIndex, boxes, t) {
    var P = L(), page = doc.getPages()[pageIndex];
    if (!page || !boxes.length) return 0;
    var b; try { b = decodeContents(page); } catch (e) { return 0; }
    if (!b) return 0;
    var ops = parse(b), res = page.node.Resources(), fcache = {};
    function inside(x, y, fs) {
      var p = apply(t, x, y), tx = Math.max(0.6, Math.abs(fs) * 0.3);
      return boxes.some(function (r) { return p[0] >= r[0] - tx && p[0] <= r[0] + r[2] + tx && p[1] >= r[1] - 0.6 && p[1] <= r[1] + r[3] + 0.6; });
    }
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
        var rec = { o: o, pre: pre, adv: adv, removed: false, fsTh: tstate.fs * tstate.th };
        if (known && inside(start[0], start[1], fsz)) rec.removed = true;
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
    } else if (op.kind === 'move') {
      var to = Math.max(0, Math.min(pages.length - 1, op.to));
      if (to !== op.page) { var cp = (await doc.copyPages(doc, [op.page]))[0]; doc.removePage(op.page); doc.insertPage(to, cp); }
    }
    if (title) try { doc.setTitle(title); } catch (e) { /* ignore */ }
    return doc.save({ useObjectStreams: true });
  }

  /* ---------- the lines of text on a page (pdf.js), for "Edit text" ---------- */
  // returns [{ x, y, w, h, base, size, str, font: 'roboto'|'carlito'|'caladea', bold }] in points on the page as shown
  function lines(page, vt) {
    return page.getTextContent().then(function (tc) {
      var Util = window.pdfjsLib.Util, items = [];
      tc.items.forEach(function (it) {
        if (!it.str || !it.str.trim()) return;
        var m = Util.transform(vt, it.transform), size = Math.hypot(m[2], m[3]);
        if (size < 2 || Math.abs(Math.atan2(m[1], m[0])) > 0.02) return; // only text that runs left to right on the page
        var st = tc.styles[it.fontName] || {}, w = Math.abs(it.width) * (Math.hypot(m[0], m[1]) / (Math.hypot(it.transform[0], it.transform[1]) || 1));
        var name = '';
        try { if (page.commonObjs.has(it.fontName)) name = page.commonObjs.get(it.fontName).name || ''; } catch (e) { name = ''; }
        items.push({ x: m[4], base: m[5], w: w, size: size, str: it.str, asc: st.ascent || 0.8, desc: st.descent || -0.2, name: name, fam: st.fontFamily || '' });
      });
      items.sort(function (p, q) { return Math.abs(p.base - q.base) > Math.min(p.size, q.size) * 0.3 ? p.base - q.base : p.x - q.x; });
      var out = [];
      items.forEach(function (it) {
        var ln = out[out.length - 1];
        if (ln && Math.abs(ln.base - it.base) < ln.size * 0.3 && Math.abs(ln.size - it.size) < ln.size * 0.25 &&
            it.x - (ln.x + ln.w) < ln.size * 0.9 && it.x - (ln.x + ln.w) > -ln.size) {
          var gap = it.x - (ln.x + ln.w);
          ln.str += (gap > ln.size * 0.15 && !/\s$/.test(ln.str) && !/^\s/.test(it.str) ? ' ' : '') + it.str;
          ln.w = Math.max(ln.w, it.x + it.w - ln.x);
          return;
        }
        out.push({ x: it.x, base: it.base, w: it.w, size: it.size, str: it.str, asc: Math.max(0.7, Math.min(1.05, it.asc)), desc: Math.min(-0.15, Math.max(-0.35, it.desc)), name: it.name, fam: it.fam });
      });
      return out.map(function (l, i) {
        var nm = l.name.replace(/^[A-Z]{6}\+/, '');
        var font = /calibri|carlito/i.test(nm) ? 'carlito' :
          (/times|cambria|caladea|garamond|georgia|book|minion|palatino|serif/i.test(nm) && !/sans/i.test(nm)) || (!nm && /^serif$/i.test(l.fam)) ? 'caladea' : 'roboto';
        var top = l.base - l.size * l.asc, bottom = l.base - l.size * l.desc;
        return { i: i, x: l.x, y: top, w: l.w, h: bottom - top, base: l.base, size: l.size, str: l.str.replace(/\s+/g, ' ').trim(), font: font,
          bold: /bold|black|heavy|semibold|demi/i.test(nm) };
      });
    });
  }

  window.CVPdfEdit = { parse: parse, eraseText: eraseText, editPages: editPages, lines: lines };
  if (window.CVLibs) window.CVLibs.wrap(window.CVPdfEdit, ['editPages'], 'pdf');
})();
