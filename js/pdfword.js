/* PDF to Word: the text of a PDF rebuilt as an editable Word file - paragraphs with their size, bold, italic and font,
   centred lines, text side by side on one line (with tab stops), pictures where they were, and scanned pages as pictures.
   Works best for simple documents such as letters, CVs and forms; tables come out as lines with tabs. Everything
   happens on the phone. */
(function () {
  'use strict';
  var PT = window.CVPdfTools, PE = window.CVPdfEdit;

  function jpegUrl(cv, q) { return cv.toDataURL('image/jpeg', q || 0.85); }
  // part of a page as a picture
  function crop(cv, scale, r) {
    var c = document.createElement('canvas'), w = Math.max(1, Math.round(r[2] * scale)), h = Math.max(1, Math.round(r[3] * scale));
    c.width = w; c.height = h;
    var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.drawImage(cv, Math.round(r[0] * scale), Math.round(r[1] * scale), w, h, 0, 0, w, h);
    var url = jpegUrl(c, 0.86); c.width = c.height = 1; return url;
  }
  function runsOf(lines) {
    var out = [];
    lines.forEach(function (l, k) {
      (l.runs || [{ str: l.str, size: l.size, bold: l.bold, italic: l.italic, word: 'Calibri' }]).forEach(function (r, j) {
        var t = r.str; if (k && !j && !/-$/.test(out.length ? out[out.length - 1].t : '')) t = ' ' + t.replace(/^\s+/, '');
        var last = out[out.length - 1];
        var st = { b: !!r.bold, i: !!r.italic, sz: Math.round(r.size * 2) / 2, font: r.word };
        if (last && last.b === st.b && last.i === st.i && last.sz === st.sz && last.font === st.font) last.t += t;
        else out.push({ t: t, b: st.b, i: st.i, sz: st.sz, font: st.font });
      });
    });
    return out;
  }

  /* doc: the PDF open in pdf.js; bytes: the same PDF (for finding its pictures); progress(share done) */
  async function convert(doc, bytes, title, progress) {
    var info = await PT.allPageInfo(doc), pl = null, pages = [];
    try { await window.CVLibs.need('pdf'); pl = await window.PDFLib.PDFDocument.load(bytes, { updateMetadata: false }); if (pl.isEncrypted) pl = null; } catch (e) { pl = null; }
    for (var i = 0; i < doc.numPages; i++) {
      if (progress) progress(i / doc.numPages * 0.6);
      var page = await doc.getPage(i + 1), ls = await PE.lines(page, info[i].t), pics = [];
      if (pl) { try { pics = (PE.paintBoxes(pl, i, info[i].t) || []).filter(function (b) { return b.kind === 'img' && b[2] >= 24 && b[3] >= 24; }); } catch (e) { pics = []; } }
      pages.push({ ls: ls, pics: pics });
    }
    // page size and margins from where the text is
    var p0 = info[0], minX = 1e9, maxR = 0, minY = 1e9;
    pages.forEach(function (pg, i) { pg.ls.forEach(function (l) { minX = Math.min(minX, l.x); maxR = Math.max(maxR, l.x + l.w); if (i === 0) minY = Math.min(minY, l.y); }); });
    if (minX > 1e8) { minX = 54; maxR = p0.w - 54; minY = 54; }
    var page = { w: p0.w, h: p0.h, left: Math.max(18, Math.min(100, minX)), right: Math.max(18, Math.min(100, p0.w - maxR - 2)), top: Math.max(18, Math.min(100, minY > 1e8 ? 54 : minY)), bottom: 36 };
    var textW = page.w - page.left - page.right, blocks = [];
    for (var k = 0; k < pages.length; k++) {
      if (progress) progress(0.6 + k / pages.length * 0.35);
      var pg = pages[k], inf = info[k], first = true;
      var push = function (b) { if (first && k) b.pbb = true; first = false; blocks.push(b); };
      if (!pg.ls.length) {
        // no text: a scan or a picture - the whole page comes in as a picture
        var cvs = await PT.renderPage(doc, k, Math.min(1700, inf.w * 150 / 72), 1);
        var w = textW, h = w * inf.h / inf.w, maxH = page.h - page.top - page.bottom - 6;
        if (h > maxH) { h = maxH; w = h * inf.w / inf.h; }
        push({ type: 'img', src: jpegUrl(cvs, 0.82), w: w, h: h, jc: 'center' });
        cvs.width = cvs.height = 1;
        continue;
      }
      // pictures that are not the background of the whole page
      var pics = pg.pics.filter(function (b) { return b[2] * b[3] < inf.w * inf.h * 0.6; }), pcv = null, sc = 0;
      if (pics.length) { pcv = await PT.renderPage(doc, k, Math.min(1700, inf.w * 150 / 72), 1); sc = pcv.width / inf.w; }
      // text side by side on one line (columns, tables): one paragraph with tab stops
      var rows = [];
      pg.ls.slice().sort(function (a, b) { return a.base - b.base || a.x - b.x; }).forEach(function (l) {
        var r = rows.filter(function (x) { return Math.abs(x.base - l.base) < Math.min(x.size, l.size) * 0.4; })[0];
        if (r) { r.ls.push(l); r.ls.sort(function (a, b) { return a.x - b.x; }); } else rows.push({ base: l.base, size: l.size, ls: [l] });
      });
      var multi = {}, single = [];
      rows.forEach(function (r) { if (r.ls.length > 1) r.ls.forEach(function (l) { multi[l.i] = r; }); else single.push(r.ls[0]); });
      var items = [];
      PE.paragraphs(single, inf.w).forEach(function (p) {
        var ls = p.lines.map(function (i) { return pg.ls.filter(function (x) { return x.i === i; })[0]; });
        items.push({ y: p.y, bottom: ls[ls.length - 1].base + p.size * 0.25, kind: 'p', p: p, ls: ls });
      });
      rows.forEach(function (r) { if (r.ls.length > 1) items.push({ y: Math.min.apply(null, r.ls.map(function (l) { return l.y; })), bottom: r.base + r.size * 0.25, kind: 'row', r: r }); });
      pics.forEach(function (b) { items.push({ y: b[1], bottom: b[1] + b[3], kind: 'img', b: b }); });
      items.sort(function (a, b) { return a.y - b.y; });
      var prev = page.top;
      items.forEach(function (it) {
        var before = Math.max(0, Math.min(200, it.y - prev));
        if (it.kind === 'img') {
          var bw = Math.min(it.b[2], textW), bh = it.b[3] * bw / it.b[2];
          push({ type: 'img', src: crop(pcv, sc, it.b), w: bw, h: bh, before: before, ind: Math.max(0, Math.min(textW - bw, it.b[0] - page.left)) });
        } else if (it.kind === 'p') {
          var p = it.p, centre = p.align === 'center';
          push({ type: 'p', runs: runsOf(it.ls), jc: centre ? 'center' : 'left', before: Math.max(0, before - p.size * 0.2), line: p.lines.length > 1 ? Math.max(1, Math.min(2.5, p.lh / 1.17)) : 0,
            ind: centre ? 0 : Math.max(0, Math.min(textW - 36, p.x - page.left)) });
        } else {
          var ls2 = it.r.ls, x0 = ls2[0].x, runs = [];
          ls2.forEach(function (l, j) { var rr = runsOf([l]); if (j) rr[0].t = '\t' + rr[0].t.replace(/^\s+/, ''); runs = runs.concat(rr); });
          push({ type: 'p', runs: runs, before: Math.max(0, before - it.r.size * 0.2), ind: Math.max(0, x0 - page.left),
            tabs: ls2.slice(1).map(function (l) { return Math.max(1, l.x - x0); }) });
        }
        prev = Math.max(prev, it.bottom);
      });
      if (pcv) pcv.width = pcv.height = 1;
    }
    page.font = (blocks.filter(function (b) { return b.runs && b.runs[0]; })[0] || { runs: [{ font: 'Calibri' }] }).runs[0].font;
    if (progress) progress(0.97);
    return window.CVDocx.plain(blocks, page, title);
  }

  window.CVPdfWord = { convert: convert };
})();
