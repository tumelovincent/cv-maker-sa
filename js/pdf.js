/* Writes a real (vector, selectable-text) A4 PDF from the laid-out CV.
   It walks the page DOM and redraws every box, border, image, icon and line of text
   at the exact position the browser put it, using the same embedded fonts. */
(function () {
  'use strict';
  var PW = 794, PH = 1123;
  var A4W = 595.28, A4H = 841.89, S = A4W / PW;

  var fontBytesCache = {};
  function fontBytes(key, w) {
    var id = key + '-' + w;
    if (!fontBytesCache[id]) {
      fontBytesCache[id] = fetch(window.CVPdf.fontBase + id + '.ttf').then(function (r) {
        if (!r.ok) throw new Error('font ' + id);
        return r.arrayBuffer();
      });
    }
    return fontBytesCache[id];
  }
  function pickWeight(key, want) {
    var ws = (window.CV_FONTS[key] || [400]).slice().sort(function (a, b) { return a - b; });
    if (ws.indexOf(want) >= 0) return want;
    // CSS font matching: >=500 looks heavier first, otherwise lighter first
    var heavier = ws.filter(function (w) { return w > want; }), lighter = ws.filter(function (w) { return w < want; }).reverse();
    var order = want >= 500 ? heavier.concat(lighter) : lighter.concat(heavier);
    return order[0] || ws[0];
  }
  function familyKey(ff) {
    var m = /F-([a-z0-9]+)/i.exec(ff || '');
    return m && window.CV_FONTS[m[1]] ? m[1] : 'carlito';
  }
  function parseColor(s) {
    if (!s) return null;
    var m = /rgba?\(([^)]+)\)/.exec(s);
    if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    var a = p.length > 3 ? p[3] : 1;
    if (a <= 0.001) return null;
    return { c: PDFLib.rgb(p[0] / 255, p[1] / 255, p[2] / 255), a: a };
  }
  function px(v) { return parseFloat(v) || 0; }

  function dataUrlBytes(url) {
    var m = /^data:([^;,]+)?(;base64)?,(.*)$/.exec(url);
    if (!m) return null;
    var bin = atob(m[3]);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return { type: m[1] || '', bytes: out };
  }

  async function makePdf(result, meta) {
    var L = window.PDFLib;
    var doc = await L.PDFDocument.create();
    doc.registerFontkit(window.fontkit);
    meta = meta || {};
    doc.setTitle(meta.title || 'Curriculum Vitae');
    if (meta.author) doc.setAuthor(meta.author);
    doc.setCreator('CV Maker SA');
    doc.setProducer('CV Maker SA by Tumelo Vincent Tau');
    doc.setSubject('Curriculum Vitae');

    var pages = [];
    for (var i = 0; i < result.pages; i++) pages.push(doc.addPage([A4W, A4H]));

    var root = result.root;
    var org = root.getBoundingClientRect();
    var ox = org.left, oy = org.top;

    var fonts = {};
    async function font(key, w) {
      var id = key + '-' + w;
      if (!fonts[id]) fonts[id] = doc.embedFont(await fontBytes(key, w), { subset: true });
      return fonts[id];
    }

    // baseline offset per font/size, measured by the browser itself
    var baseCache = {};
    var probeHost = document.createElement('div');
    probeHost.style.cssText = 'position:absolute;left:0;top:0;white-space:nowrap;font-kerning:none;font-synthesis:none;';
    root.appendChild(probeHost);
    function baseline(ff, fw, fs) {
      var id = ff + '|' + fw + '|' + fs;
      if (baseCache[id] != null) return baseCache[id];
      probeHost.innerHTML = '<span style="font-family:' + ff.replace(/"/g, "'") + ';font-weight:' + fw + ';font-size:' + fs + 'px;line-height:normal">Hxg<i style="display:inline-block;width:1px;height:0;vertical-align:baseline"></i></span>';
      var span = probeHost.firstChild, txt = span.firstChild, mark = span.lastChild;
      var rg = document.createRange(); rg.setStart(txt, 0); rg.setEnd(txt, 1);
      var off = mark.getBoundingClientRect().top - rg.getBoundingClientRect().top;
      baseCache[id] = off;
      return off;
    }

    // ---- primitive drawing (css px in, pdf points out) ----
    function pageAt(y) { return Math.max(0, Math.min(pages.length - 1, Math.floor(y / PH))); }
    function fillRect(x, y, w, h, col) {
      if (w <= 0 || h <= 0) return;
      var y0 = y, y1 = y + h;
      for (var p = pageAt(y0); p <= pageAt(y1 - 0.01); p++) {
        var a = Math.max(y0, p * PH), b = Math.min(y1, (p + 1) * PH);
        if (b - a <= 0) continue;
        pages[p].drawRectangle({ x: x * S, y: A4H - (b - p * PH) * S, width: w * S, height: (b - a) * S, color: col.c, opacity: col.a });
      }
    }
    // r: one radius, or [top-left, top-right, bottom-right, bottom-left]
    function roundPath(w, h, r) {
      var q = (Array.isArray(r) ? r : [r, r, r, r]).map(function (v) { return Math.max(0, Math.min(v, w / 2, h / 2)); });
      var a = q[0], b = q[1], c = q[2], d = q[3], K = 0.5523;
      return 'M' + a + ' 0 L' + (w - b) + ' 0 C' + (w - b + K * b) + ' 0 ' + w + ' ' + (b - K * b) + ' ' + w + ' ' + b +
        ' L' + w + ' ' + (h - c) + ' C' + w + ' ' + (h - c + K * c) + ' ' + (w - c + K * c) + ' ' + h + ' ' + (w - c) + ' ' + h +
        ' L' + d + ' ' + h + ' C' + (d - K * d) + ' ' + h + ' 0 ' + (h - d + K * d) + ' 0 ' + (h - d) +
        ' L0 ' + a + ' C0 ' + (a - K * a) + ' ' + (a - K * a) + ' 0 ' + a + ' 0 Z';
    }
    function shape(x, y, w, h, r, fill, stroke, sw) {
      var p = pageAt(y + h / 2), ly = y - p * PH;
      var opts = {};
      if (fill) { opts.color = fill.c; opts.opacity = fill.a; }
      if (stroke) { opts.borderColor = stroke.c; opts.borderWidth = sw * S; opts.borderOpacity = stroke.a; }
      if (Array.isArray(r)) { if (Math.max.apply(null, r) - Math.min.apply(null, r) < 0.5) r = r[0]; }
      if (!Array.isArray(r) && r >= Math.min(w, h) / 2 - 0.5 && Math.abs(w - h) < 1) {
        opts.x = (x + w / 2) * S; opts.y = A4H - (ly + h / 2) * S; opts.xScale = (w / 2) * S; opts.yScale = (h / 2) * S;
        pages[p].drawEllipse(opts);
      } else {
        opts.x = x * S; opts.y = A4H - ly * S; opts.scale = S;
        pages[p].drawSvgPath(roundPath(w, h, r), opts);
      }
    }
    function clipOps(x, y, w, h, r) { // returns operators building a clip path (pdf coords)
      var X = x * S, Y = A4H - (y + h) * S, W = w * S, H = h * S, R = Math.min(r * S, W / 2, H / 2), k = 0.5523 * R;
      return [L.moveTo(X + R, Y), L.lineTo(X + W - R, Y), L.appendBezierCurve(X + W - R + k, Y, X + W, Y + R - k, X + W, Y + R),
        L.lineTo(X + W, Y + H - R), L.appendBezierCurve(X + W, Y + H - R + k, X + W - R + k, Y + H, X + W - R, Y + H),
        L.lineTo(X + R, Y + H), L.appendBezierCurve(X + R - k, Y + H, X, Y + H - R + k, X, Y + H - R),
        L.lineTo(X, Y + R), L.appendBezierCurve(X, Y + R - k, X + R - k, Y, X + R, Y), L.closePath(), L.clip(), L.endPath()];
    }

    function radiusOf(cs, w, h) {
      var v = cs.borderTopLeftRadius || '0';
      if (/%/.test(v)) return px(v) / 100 * Math.min(w, h);
      return px(v);
    }
    // all four corners [top-left, top-right, bottom-right, bottom-left]
    function radiiOf(cs, w, h) {
      return ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].map(function (k) {
        var v = cs[k] || '0'; return /%/.test(v) ? px(v) / 100 * Math.min(w, h) : px(v);
      });
    }

    var images = [];
    var texts = [];

    function walk(el, blk) {
      if (el === probeHost) return;
      if (el.classList && el.classList.contains('blk')) blk = el;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (el.classList && el.classList.contains('pg-spacer')) return;
      var rc = el.getBoundingClientRect();
      var x = rc.left - ox, y = rc.top - oy, w = rc.width, h = rc.height;
      var tag = el.tagName.toLowerCase();
      if (w > 0 && h > 0) {
        var r = radiusOf(cs, w, h), rr = radiiOf(cs, w, h), rmax = Math.max.apply(null, rr);
        var bg = parseColor(cs.backgroundColor);
        var bw = [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)];
        var bs = [cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle];
        var bc = [parseColor(cs.borderTopColor), parseColor(cs.borderRightColor), parseColor(cs.borderBottomColor), parseColor(cs.borderLeftColor)];
        var has = function (i) { return bw[i] > 0 && bs[i] !== 'none' && bs[i] !== 'hidden' && bc[i]; };
        if (rmax > 0.5) {
          if (bg && tag !== 'img') shape(x, y, w, h, rr, bg, null, 0);
          if (has(0) && bw[0] === bw[1] && bw[0] === bw[2] && bw[0] === bw[3] && tag !== 'img') shape(x + bw[0] / 2, y + bw[0] / 2, w - bw[0], h - bw[0], rr.map(function (v) { return Math.max(0, v - bw[0] / 2); }), null, bc[0], bw[0]);
        } else {
          if (bg && tag !== 'img') fillRect(x, y, w, h, bg);
          if (has(0)) fillRect(x, y, w, bw[0], bc[0]);
          if (has(2)) fillRect(x, y + h - bw[2], w, bw[2], bc[2]);
          if (has(3)) fillRect(x, y, bw[3], h, bc[3]);
          if (has(1)) fillRect(x + w - bw[1], y, bw[1], h, bc[1]);
        }
        if (tag === 'img') { images.push({ el: el, x: x, y: y, w: w, h: h, r: r, bw: bw[0], bc: has(0) ? bc[0] : null }); return; }
        if (tag === 'svg') {
          var path = el.querySelector('path');
          if (path) {
            var vb = (el.getAttribute('viewBox') || '0 0 24 24').split(/\s+/).map(parseFloat);
            var col = parseColor(getComputedStyle(path).fill) || parseColor(cs.color);
            var p = pageAt(y + h / 2);
            if (col) pages[p].drawSvgPath(path.getAttribute('d'), { x: x * S, y: A4H - (y - p * PH) * S, scale: (w / vb[2]) * S, color: col.c, opacity: col.a });
          }
          return;
        }
      }
      // leader (dots or spaces between a label and its value): drawn as real characters up to the box's right edge,
      // so the label and the value read as one line in job-portal systems (ATS)
      var lead = el.classList && el.classList.contains('lead') ? { l: rc.left - ox, r: rc.right - ox } : null;
      for (var c = el.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) texts.push({ node: c, cs: cs, clip: lead, blk: blk || null });
        else if (c.nodeType === 1) walk(c, blk);
      }
    }

    // ---- page decoration first (behind) ----
    for (var pi = 0; pi < pages.length; pi++) {
      window.CVTemplates.decor(result.tpl, pi).forEach(function (d) {
        var op = d.op != null ? d.op : 1;
        // shapes: a path in page coordinates, or a box with rounded corners / a circle
        if (d.path) { var pc = parseColor(hexToRgb(d.fill)); pages[pi].drawSvgPath(d.path, { x: 0, y: A4H, scale: S, color: pc.c, opacity: op }); return; }
        if (d.r && d.fill) {
          var rc = parseColor(hexToRgb(d.fill));
          if (d.r >= Math.min(d.w, d.h) / 2 - 0.5 && Math.abs(d.w - d.h) < 1) pages[pi].drawEllipse({ x: (d.x + d.w / 2) * S, y: A4H - (d.y + d.h / 2) * S, xScale: d.w / 2 * S, yScale: d.h / 2 * S, color: rc.c, opacity: op });
          else pages[pi].drawSvgPath(roundPath(d.w, d.h, d.r), { x: d.x * S, y: A4H - d.y * S, scale: S, color: rc.c, opacity: op });
          return;
        }
        if (d.fill && op < 1) { var oc = parseColor(hexToRgb(d.fill)); pages[pi].drawRectangle({ x: d.x * S, y: A4H - (d.y + d.h) * S, width: d.w * S, height: d.h * S, color: oc.c, opacity: op }); return; }
        if (d.fill) { var c = parseColor(hexToRgb(d.fill)); pages[pi].drawRectangle({ x: d.x * S, y: A4H - (d.y + d.h) * S, width: d.w * S, height: d.h * S, color: c.c }); }
        if (d.stroke) { var s = parseColor(hexToRgb(d.stroke)), sw = d.sw * S; pages[pi].drawRectangle({ x: d.x * S + sw / 2, y: A4H - (d.y + d.h) * S + sw / 2, width: d.w * S - sw, height: d.h * S - sw, borderColor: s.c, borderWidth: sw }); }
      });
    }

    walk(root);

    // ---- images ----
    for (var ii = 0; ii < images.length; ii++) {
      var im = images[ii];
      var src = im.el.currentSrc || im.el.src;
      var data = /^data:/.test(src) ? dataUrlBytes(src) : null;
      if (!data) continue;
      var emb;
      try { emb = /png/i.test(data.type) ? await doc.embedPng(data.bytes) : await doc.embedJpg(data.bytes); } catch (e) { continue; }
      var pg = pages[pageAt(im.y + im.h / 2)], ly = im.y - pageAt(im.y + im.h / 2) * PH;
      pg.pushOperators(L.pushGraphicsState());
      pg.pushOperators.apply(pg, clipOps(im.x, ly, im.w, im.h, im.r));
      pg.drawImage(emb, { x: im.x * S, y: A4H - (ly + im.h) * S, width: im.w * S, height: im.h * S });
      pg.pushOperators(L.popGraphicsState());
      if (im.bc && im.bw > 0) shape(im.x + im.bw / 2, im.y + im.bw / 2, im.w - im.bw, im.h - im.bw, Math.max(0, im.r - im.bw / 2), null, im.bc, im.bw);
    }

    // ---- text ----
    var range = document.createRange(), pieces = [];
    for (var ti = 0; ti < texts.length; ti++) {
      var t = texts[ti], node = t.node, cs = t.cs, str = node.nodeValue, clip = t.clip;
      if (clip == null && !/\S/.test(str)) continue;
      var col = parseColor(cs.color);
      if (!col) continue;
      var fs = px(cs.fontSize), fwRaw = parseInt(cs.fontWeight, 10) || 400;
      var key = familyKey(cs.fontFamily), fw = pickWeight(key, fwRaw);
      var pdfFont = await font(key, fw);
      var asc = baseline(cs.fontFamily, cs.fontWeight, fs);
      var upper = cs.textTransform === 'uppercase';
      var ls = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing);
      var underline = /underline/.test(cs.textDecorationLine || cs.textDecoration || '');
      var lines = [], cur = null;
      for (var i2 = 0; i2 < str.length; i2++) {
        var ch = str.charAt(i2);
        // keep surrogate pairs together
        var len = (ch >= '\uD800' && ch <= '\uDBFF') ? 2 : 1;
        range.setStart(node, i2); range.setEnd(node, i2 + len);
        var rr = range.getClientRects();
        var rect = rr.length ? rr[0] : null;
        var piece = str.substr(i2, len);
        i2 += len - 1;
        if (!rect) continue;
        if (clip != null) { // leader: every character kept (spaces too), none past the box edge
          var top0 = rect.top - oy, left0 = rect.left - ox;
          if (left0 < clip.l - 0.5 || rect.right - ox > clip.r + 0.5 || rect.width < 0.01) continue;
          if (!cur) { cur = { top: top0, left: left0, right: left0, s: '', xs: [], cs: [], keep: true }; lines.push(cur); }
          var g0 = piece === '\u00a0' ? ' ' : piece; cur.s += g0; cur.xs.push(left0); cur.cs.push(g0);
          cur.left = Math.min(cur.left, left0); cur.right = Math.max(cur.right, rect.right - ox);
          continue;
        }
        var ws = /\s/.test(piece);
        if (ws && rect.width < 0.01) continue;
        var top = rect.top - oy, left = rect.left - ox;
        if (!cur || Math.abs(top - cur.top) > fs * 0.5 || left < cur.right - 1) {
          if (ws) continue;
          cur = { top: top, left: left, right: left, s: '', xs: [], cs: [] };
          lines.push(cur);
        }
        if (ws) { if (cur.s.slice(-1) !== ' ') { cur.s += ' '; cur.xs.push(left); cur.cs.push(' '); } }
        else { var g = upper ? piece.toUpperCase() : piece; cur.s += g; cur.xs.push(left); cur.cs.push(g); }
        cur.right = rect.right - ox;
      }
      for (var li = 0; li < lines.length; li++) {
        var ln = lines[li];
        var s2 = ln.keep ? ln.s : ln.s.replace(/\s+$/, '');
        if (!s2) continue;
        var p2 = pageAt(ln.top + fs / 2), ly2 = ln.top - p2 * PH;
        pieces.push({ s: s2, p: p2, top: ly2, left: ln.left, right: ln.right, by: A4H - (ly2 + asc) * S, asc: asc, fs: fs, ls: ls,
          font: pdfFont, col: col, underline: underline, blk: t.blk, lead: clip != null });
      }
    }

    // ATS-friendly templates: a wide empty gap inside one row (label ... value, job title ... dates) is filled with
    // ordinary spaces. They are invisible, but systems that rebuild lines from the page (ATS layout readers) then read
    // the row as one line instead of moving the right-hand part somewhere else.
    var fill = {};
    if (result.tpl && result.tpl.ats) {
      var rows = [];
      pieces.forEach(function (pc, i) {
        if (!pc.blk) return;
        var g = null;
        for (var k = 0; k < rows.length && !g; k++) {
          var r0 = rows[k][0];
          if (r0.p !== pc.p || r0.blk !== pc.blk) continue;
          var ov = Math.min(r0.top + r0.fs, pc.top + pc.fs) - Math.max(r0.top, pc.top);
          if (ov > 0.5 * Math.min(r0.fs, pc.fs) && Math.max(r0.fs, pc.fs) / Math.min(r0.fs, pc.fs) < 1.4) g = rows[k];
        }
        pc.i = i;
        if (g) g.push(pc); else rows.push([pc]);
      });
      var edge = new Map(); // left edge of each block's content
      function blkLeft(b) {
        if (!edge.has(b)) { var bc = getComputedStyle(b); edge.set(b, b.getBoundingClientRect().left - ox + px(bc.paddingLeft) + px(bc.borderLeftWidth)); }
        return edge.get(b);
      }
      rows.forEach(function (row) {
        row.sort(function (a, b) { return a.left - b.left; });
        // a centred line (headings) starts from the block's left edge too, so it is read before the lines under it
        var f0 = row[0], lead0 = f0.left - blkLeft(f0.blk);
        if (lead0 > 2 * f0.fs && !f0.lead) {
          var adv0 = f0.font.widthOfTextAtSize(' ', f0.fs);
          if (adv0 > 0) { var n0 = Math.max(1, Math.round(lead0 / adv0)); f0.pre = { x: f0.left - lead0, n: n0, tc: (lead0 - n0 * adv0) / n0 }; }
        }
        if (row.length < 2) return;
        for (var k = 0; k + 1 < row.length; k++) {
          var a = row[k], b = row[k + 1], gap = b.left - a.right;
          if (gap < 0.6 * a.fs) continue;
          var adv = a.font.widthOfTextAtSize(' ', a.fs);
          if (!(adv > 0)) continue;
          var n = Math.max(1, Math.round(gap / adv));
          (fill[a.i] = fill[a.i] || []).push({ x: a.right, n: n, tc: (gap - n * adv) / n });
        }
      });
    }

    pieces.forEach(function (pc, i) {
      var pgx = pages[pc.p];
      if (pc.pre) {
        pgx.pushOperators(L.setCharacterSpacing(pc.pre.tc * S));
        pgx.drawText(new Array(pc.pre.n + 1).join(' '), { x: pc.pre.x * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
        pgx.pushOperators(L.setCharacterSpacing(0));
      }
      if (pc.ls > 0.05) {
        // spaced-out text (headings) stays one piece of text, using the PDF's own character spacing,
        // so job-portal systems (ATS) read "WORK EXPERIENCE" and not "W O R K  E X P E R I E N C E"
        pgx.pushOperators(L.setCharacterSpacing(pc.ls * S));
        pgx.drawText(pc.s, { x: pc.left * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
        pgx.pushOperators(L.setCharacterSpacing(0));
      } else {
        pgx.drawText(pc.s, { x: pc.left * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
      }
      (fill[i] || []).forEach(function (f) {
        pgx.pushOperators(L.setCharacterSpacing(f.tc * S));
        pgx.drawText(new Array(f.n + 1).join(' '), { x: f.x * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
        pgx.pushOperators(L.setCharacterSpacing(0));
      });
      if (pc.underline) {
        var uy = pc.top + pc.asc + Math.max(1, pc.fs * 0.11);
        fillRect(pc.left, pc.p * PH + uy, pc.right - pc.left, Math.max(0.8, pc.fs * 0.055), pc.col);
      }
    });
    probeHost.remove();
    return doc.save();
  }

  function hexToRgb(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(h);
    if (!m) return h;
    var n = parseInt(m[1], 16);
    return 'rgb(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ')';
  }

  window.CVPdf = { make: makePdf, fontBase: 'fonts/' };
})();
