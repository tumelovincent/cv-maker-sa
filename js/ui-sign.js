/* Edit PDF (and Fill & sign, the same screen): change the text that is already in a PDF (a line or a whole paragraph),
   find and replace, fill in the PDF's own form boxes, add text, pictures, drawings, highlights, boxes, lines and arrows,
   white-out and black-out, ticks, dates and a signature, and rotate, move, add, number or delete pages.
   Scanned pages can be read (CVOcr) so their words can be changed too.
   Marks are kept in points on the page as shown; pdfcore and pdfedit write them into the PDF. What was added stays
   changeable: the PDF before the changes and the list of marks are kept with the saved file in My files. */
(function () {
  'use strict';
  var A = window.App, PT = window.CVPdfTools, PDF = A.PDF, PE = window.CVPdfEdit;
  var $ = A.$, esc = A.esc, T = A.T, S = A.S, ic = PDF.ic;
  var COLORS = ['#111111', '#555555', '#1B3C8C', '#1565C0', '#C62828', '#AD1457', '#1E7A4C', '#6A1B9A', '#E65100', '#795548', '#FFFFFF'];
  var HL = ['#FFE14D', '#8BEA7B', '#FF9EC4', '#8FD3FF', '#FFB74D', '#CE93D8'];
  // the fonts you can choose (look-alikes of common fonts); a font matched from the PDF may be another of the app's fonts
  var FONT_ORDER = ['roboto', 'libsans', 'carlito', 'libserif', 'caladea'];
  var FONT_NAME = { roboto: 'Roboto', libsans: 'Arial', carlito: 'Calibri', libserif: 'Times', caladea: 'Cambria', pagella: 'Palatino', garamond: 'Garamond',
    opensans: 'Open Sans', sourcesans: 'Source Sans', dmsans: 'DM Sans', playfair: 'Playfair' };
  function fontName(f) { return FONT_NAME[f] || (f ? f.charAt(0).toUpperCase() + f.slice(1) : 'Roboto'); }
  var SIGKEY = 'cvmaker.pdfsig.v1';
  var E = { mode: 'edit', src: null, doc: null, info: null, marks: [], undo: [], tool: null, sel: -1, zoom: 1, color: COLORS[2], dirty: false, sig: null, fmt: 0, job: 0, obs: null,
    lines: {}, paras: {}, fields: {}, form: {}, pnum: null, hasFields: false, target: null, cvs: {}, sub: '' };

  function sigStore() { try { return JSON.parse(localStorage.getItem(SIGKEY) || '{}') || {}; } catch (e) { return {}; } }
  function setSig(kind, v) { var s = sigStore(); s[kind] = v; try { localStorage.setItem(SIGKEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }

  // where the text baseline sits inside a line (as a share of the font size), measured once per font
  var ASC = {};
  function asc(font) {
    font = font || 'roboto';
    if (ASC[font]) return ASC[font];
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:-9999px;top:0;font:400 100px/1.15 "F-' + font + '";white-space:nowrap';
    d.innerHTML = '<span>Hxg</span><i style="display:inline-block;width:1px;height:0;vertical-align:baseline"></i>';
    document.body.appendChild(d);
    var v = (d.lastChild.getBoundingClientRect().top - d.getBoundingClientRect().top) / 100;
    d.remove();
    v = v > 0.5 && v < 1.3 ? v : 0.92;
    var ready = true; try { ready = !document.fonts || document.fonts.check('400 16px "F-' + font + '"'); } catch (e) { ready = true; }
    if (ready) ASC[font] = v;
    return v;
  }
  function ascMap() {
    var o = {};
    FONT_ORDER.concat(E.marks.map(function (m) { return m.font; })).forEach(function (f) { if (f && !o[f]) o[f] = asc(f); });
    return o;
  }
  function loadFont(f) { if (document.fonts && document.fonts.load && f) ['400', '700'].forEach(function (w) { document.fonts.load(w + ' 16px "F-' + f + '"').catch(function () {}); document.fonts.load('italic ' + w + ' 16px "F-' + f + '"').catch(function () {}); }); }

  // mode: 'edit' (Edit PDF) or 'sign' (Fill & sign) - the same tools, in a different order
  function startSign(src, mode) {
    // a PDF saved by this editor: the things added can still be changed
    if (src.meta && src.meta.edit && PDF.Files.editData) {
      var sh = A.openSheet('<h3>' + T('This PDF was edited in CV Maker SA') + '</h3>' +
        '<button class="sheet-item" data-ag="again">' + ic('edit') + '<span>' + T('Change what you added') + '<small>' + T('Move, change or delete the text, pictures and other things you added') + '</small></span></button>' +
        '<button class="sheet-item" data-ag="new">' + ic('pdfedit') + '<span>' + T('Edit it as it is now') + '<small>' + T('Start fresh from this file') + '</small></span></button>');
      sh.onclick = function (e) {
        var b = e.target.closest('[data-ag]'); if (!b) return;
        A.closeSheet();
        if (b.getAttribute('data-ag') === 'new') { open(src, mode, null); return; }
        A.busy(T('Opening…'));
        PDF.Files.editData(src.meta).then(function (d) {
          A.done();
          open({ name: src.meta.name, kind: 'pdf', bytes: d.base }, d.data.mode || mode, { meta: src.meta, data: d.data });
        }).catch(function () { A.done(); open(src, mode, null); });
      };
      return;
    }
    open(src, mode, null);
  }
  function open(src, mode, again) {
    A.busy(T('Opening…'));
    FONT_ORDER.forEach(loadFont);
    PDF.bytesOf(src).then(function (bytes) { return PDF.openDoc(bytes, src.name, src.pw); }).then(function (r) {
      return PT.allPageInfo(r.doc).then(function (info) {
        A.done();
        if (E.doc) try { E.doc.destroy(); } catch (e) { /* ignore */ }
        E.mode = mode === 'sign' ? 'sign' : 'edit';
        E.src = src; E.src.pw = r.pw; E.doc = r.doc; E.info = info; E.undo = []; E.tool = null; E.sel = -1; E.zoom = 1; E.dirty = false; E.paged = false;
        E.lines = {}; E.paras = {}; E.fields = {}; E.cvs = {}; E.hasFields = false; E.sub = ''; E.job++;
        E.marks = again ? again.data.marks || [] : []; E.form = again ? again.data.form || {} : {}; E.pnum = again ? again.data.pnum || null : null;
        E.target = again ? again.meta : null;
        E.marks.forEach(function (m) { loadFont(m.font); });
        E.color = E.mode === 'sign' ? COLORS[2] : COLORS[0];
        A.go('pdfsign');
      });
    }).catch(function (e) { if (e.message !== 'cancel') PDF.failMsg(e); });
  }

  /* ---------- screen ---------- */
  var TOOL = {
    edittext: ['edtext', 'Edit text'], text: ['text', 'Add text'], find: ['search', 'Find'], image: ['photos', 'Picture'], draw: ['draw', 'Draw'],
    hl: ['hl', 'Highlight'], white: ['erase', 'White-out'], redact: ['redact', 'Black-out'], rect: ['rect', 'Box'], line: ['line', 'Line'],
    sign: ['sign', 'Signature'], check: ['check', 'Tick'], cross: ['close', 'Cross'], date: ['cal', 'Date'], pages: ['grid', 'Pages']
  };
  var ORDER = {
    edit: ['edittext', 'text', 'find', 'image', 'draw', 'hl', 'white', 'redact', 'rect', 'line', 'sign', 'check', 'cross', 'date', 'pages'],
    sign: ['text', 'check', 'cross', 'date', 'sign', 'draw', 'white', 'edittext', 'find', 'image', 'hl', 'redact', 'rect', 'line', 'pages']
  };
  var HINTS = {
    '': 'Choose a tool, then tap on the page.', edittext: 'Tap the text you want to change.', text: 'Tap where the text should go.',
    check: 'Tap each box to tick it.', cross: 'Tap where the cross should go.', date: 'Tap where the date should go.', sign: 'Tap where you want to sign.',
    draw: 'Draw with your finger. Choose Draw again to stop.', white: 'Tap text to remove it, or tap anywhere to cover with white.',
    hl: 'Tap a line of text to highlight it.', rect: 'Tap where the box should go.', line: 'Tap where the line should go.',
    redact: 'Tap text to black it out, or tap anywhere for a black box. Nothing under it can be recovered.'
  };
  var NEEDS_LINES = { edittext: 1, hl: 1, white: 1, redact: 1 };
  function changed() { return E.marks.length || E.paged || Object.keys(E.form).length || !!E.pnum; }
  A.VIEWS.pdfsign = {
    title: function () { return T(E.mode === 'sign' ? 'Fill & sign' : 'Edit PDF'); },
    noMenu: true,
    actions: function () { return ''; },
    bar: function () {
      return '<button class="bar-icon" data-bar="undo"' + (E.undo.length ? '' : ' disabled') + ' aria-label="' + esc(T('Undo')) + '">' + ic('undo') + '</button>' +
        '<button class="bar-act gold" data-bar="save"' + (changed() ? '' : ' disabled') + '>' + T('Save') + '</button>';
    },
    onBar: function (a) { if (a === 'undo') undo(); if (a === 'save') save(); },
    beforeBack: function () {
      hideFtb();
      if (!E.dirty) return false;
      A.confirmSheet(T('Leave without saving?'), T('Your changes to the PDF will be lost.'), T('Leave'), true).then(function (ok) { if (ok) { E.dirty = false; A.back(); } });
      return true;
    },
    render: function (el) {
      if (!E.doc) { S.stack.pop(); A.render(); return; }
      el.innerHTML = '<div class="ed' + (E.tool === 'draw' ? ' drawing' : '') + '" id="ed"><div id="ed-pages"></div></div>' +
        '<div class="zoom" style="bottom:120px"><button data-ez="1">+</button><button data-ez="-1">&minus;</button></div>' +
        '<div class="etools"><div class="row1">' + ORDER[E.mode].map(function (k) { var t = TOOL[k]; return '<button data-et="' + k + '" class="' + (E.tool === k ? 'on' : '') + '">' + ic(t[0]) + T(t[1]) + '</button>'; }).join('') + '</div>' +
        '<div class="hint2" id="ed-hint"></div></div>';
      layout(); hint();
    }
  };
  function scaleOf(i) { var pg = document.querySelector('#ed-pages .ed-page[data-i="' + i + '"]'); return pg ? pg.clientWidth / E.info[i].w : 1; }
  function layout() {
    var box = $('#ed-pages'), ed = $('#ed'); if (!box) return;
    var avail = Math.min(ed.clientWidth - 24, 900), w = Math.round(avail * E.zoom);
    box.style.width = w + 'px'; box.style.margin = '0 auto';
    box.innerHTML = E.info.map(function (p, i) { return '<div class="ed-page" data-i="' + i + '" style="width:' + w + 'px;height:' + Math.round(w * p.h / p.w) + 'px"><div class="ed-layer" data-i="' + i + '"></div></div>'; }).join('');
    var job = ++E.job;
    if (E.obs) E.obs.disconnect();
    if ('IntersectionObserver' in window) {
      E.obs = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) draw(en.target, job); }); }, { rootMargin: '800px 0px' });
      Array.prototype.forEach.call(box.children, function (el) { E.obs.observe(el); });
    } else Array.prototype.forEach.call(box.children, function (el) { draw(el, job); });
    for (var i = 0; i < E.info.length; i++) paintMarks(i);
  }
  function draw(el, job) {
    if (el.getAttribute('data-done')) return;
    el.setAttribute('data-done', '1');
    var i = +el.getAttribute('data-i');
    PT.renderPage(E.doc, i, el.clientWidth, Math.min(2, window.devicePixelRatio || 1), 0, { forms: true }).then(function (cv) {
      if (job !== E.job || !el.isConnected) return;
      el.insertBefore(cv, el.firstChild);
      if (NEEDS_LINES[E.tool]) ensureLines(i);
      ensureFields(i);
    }).catch(function () { el.removeAttribute('data-done'); });
  }

  /* ---------- the text already on the page ---------- */
  // loaded after the page is drawn, so the real font names are known
  function ensureLines(i) {
    if (E.lines[i] || !E.doc) return Promise.resolve(Array.isArray(E.lines[i]) ? E.lines[i] : []);
    E.lines[i] = 'loading';
    var doc = E.doc;
    return doc.getPage(i + 1).then(function (page) { return PE.lines(page, E.info[i].t); }).then(function (ls) {
      if (doc !== E.doc) return [];
      E.lines[i] = ls; delete E.paras[i];
      ls.forEach(function (l) { loadFont(l.font); });
      if (NEEDS_LINES[E.tool]) { paintMarks(i); hint(); }
      return ls;
    }).catch(function () { if (doc === E.doc) E.lines[i] = []; return []; });
  }
  function allLines() {
    var ch = Promise.resolve();
    E.info.forEach(function (p, i) { ch = ch.then(function () { if (Array.isArray(E.lines[i])) return; E.lines[i] = null; return ensureLines(i); }); });
    return ch;
  }
  function parasOf(i) {
    if (!Array.isArray(E.lines[i])) return [];
    if (!E.paras[i]) E.paras[i] = E.lines[i].ocr ? E.lines[i].map(function (l) { return { lines: [l.i], x: l.x, y: l.y, w: l.w, h: l.h, size: l.size, lh: 1.15, font: l.font, bold: l.bold, italic: l.italic, str: l.str, align: 'left' }; }) : PE.paragraphs(E.lines[i], E.info[i].w);
    return E.paras[i];
  }
  function lineAt(i, x, y) {
    var ls = E.lines[i]; if (!Array.isArray(ls)) return null;
    var best = null;
    ls.forEach(function (l) {
      if (x >= l.x - 2 && x <= l.x + l.w + 2 && y >= l.y - 2 && y <= l.y + l.h + 2 && (!best || l.h < best.h)) best = l;
    });
    return best;
  }
  function edited(i, l) { return E.marks.some(function (m) { return m.page === i && m.key === 'L' + l.i; }); }
  function hint() {
    var h = $('#ed-hint'); if (!h) return;
    var c = curPage(), ls = E.lines[c], txt = T(HINTS[E.tool || '']), btn = '';
    if (!E.tool && E.hasFields) txt = T('This PDF has boxes to fill in. Tap a box to type in it.');
    if (NEEDS_LINES[E.tool] && Array.isArray(ls) && !ls.length) {
      txt = T('This page is a picture (a scan), so its words cannot be changed yet.');
      if (window.CVOcr) btn = ' <button class="hint-btn" data-ocr="' + c + '">' + T('Read the words on this page') + '</button>';
    }
    h.innerHTML = esc(txt) + btn;
  }
  // the colours under a line of text: the background around it, and the text itself
  function pageCanvas(i) {
    var pg = document.querySelector('#ed-pages .ed-page[data-i="' + i + '"] canvas');
    if (pg) return Promise.resolve(pg);
    if (E.cvs[i]) return E.cvs[i];
    E.cvs[i] = PT.renderPage(E.doc, i, 1000, 1, 0, { forms: true });
    return E.cvs[i];
  }
  function colorsIn(pg, i, l) {
    var out = { bg: '#ffffff', fg: '#111111' };
    if (!pg) return out;
    try {
      var sc = pg.width / E.info[i].w, x0 = Math.max(0, Math.floor((l.x - 3) * sc)), y0 = Math.max(0, Math.floor((l.y - 3) * sc));
      var x1 = Math.min(pg.width, Math.ceil((l.x + l.w + 3) * sc)), y1 = Math.min(pg.height, Math.ceil((l.y + l.h + 3) * sc));
      if (x1 - x0 < 3 || y1 - y0 < 3) return out;
      var d = pg.getContext('2d').getImageData(x0, y0, x1 - x0, y1 - y0), W = x1 - x0, H = y1 - y0, px = d.data, buckets = {}, edge = Math.max(1, Math.round(sc * 1.5));
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        if (x >= edge && y >= edge && x < W - edge && y < H - edge) continue;
        var k = ((px[(y * W + x) * 4] >> 4) << 8) | ((px[(y * W + x) * 4 + 1] >> 4) << 4) | (px[(y * W + x) * 4 + 2] >> 4);
        var bk = buckets[k] || (buckets[k] = [0, 0, 0, 0]); bk[0]++; bk[1] += px[(y * W + x) * 4]; bk[2] += px[(y * W + x) * 4 + 1]; bk[3] += px[(y * W + x) * 4 + 2];
      }
      var top = null; Object.keys(buckets).forEach(function (k) { if (!top || buckets[k][0] > top[0]) top = buckets[k]; });
      var bg = [top[1] / top[0], top[2] / top[0], top[3] / top[0]], far = [], max = 0;
      for (var j = 0; j < px.length; j += 4) { var dd = Math.abs(px[j] - bg[0]) + Math.abs(px[j + 1] - bg[1]) + Math.abs(px[j + 2] - bg[2]); if (dd > max) max = dd; far.push(dd); }
      var s = [0, 0, 0, 0];
      for (var q = 0; q < far.length; q++) if (far[q] > max * 0.7) { s[0]++; s[1] += px[q * 4]; s[2] += px[q * 4 + 1]; s[3] += px[q * 4 + 2]; }
      out.bg = hex(bg);
      if (max > 90 && s[0]) out.fg = hex([s[1] / s[0], s[2] / s[0], s[3] / s[0]]);
      else out.fg = (bg[0] + bg[1] + bg[2]) / 3 < 110 ? '#FFFFFF' : '#111111';
    } catch (e) { /* keep the defaults */ }
    return out;
  }
  function colorsAt(i, l) { return colorsIn(document.querySelector('#ed-pages .ed-page[data-i="' + i + '"] canvas'), i, l); }
  function hex(c) { return '#' + c.map(function (v) { var h = Math.max(0, Math.min(255, Math.round(v))).toString(16); return h.length < 2 ? '0' + h : h; }).join(''); }
  // a cover over each line, then the new text: on one line, or wrapped over the width of the paragraph
  function coverLines(i, ls, col) {
    ls.forEach(function (l) { E.marks.push(coverOf(i, l, col)); });
  }
  // a cover just over the letters of a line (not the table lines or boxes around it); a scan's line is covered a bit more
  function coverOf(i, l, col) {
    var pad = l.size * 0.08, top = l.ocr ? l.y - pad : l.base - l.size * 0.86, bot = l.ocr ? l.y + l.h + pad : l.base + l.size * 0.24;
    return { page: i, type: 'white', x: l.x - pad, y: top, w: l.w + 2 * pad, h: bot - top, fill: col.bg,
      eb: l.ocr ? undefined : [l.x, l.base - l.size * 0.35, l.w, l.size * 0.7], key: 'L' + l.i };
  }
  function newText(i, l, txt, col, para) {
    var m = { page: i, type: 'text', size: l.size, color: col.fg, text: txt, font: l.font, bold: l.bold, italic: l.italic, key: 'L' + l.i };
    if (para && para.lines.length > 1) {
      m.lh = Math.max(1, Math.min(2.2, para.lh)); m.x = para.x; m.w = para.w + l.size * 0.3; m.wrap = true;
      if (para.align === 'center') m.align = 'center';
    } else {
      m.x = l.x;
      if (!l.ocr && PE.centred(l.x, l.w, E.info[i].w)) { m.align = 'center'; m.w = l.w; }
    }
    m.y = l.base - l.size * (asc(l.font) + ((m.lh || 1.15) - 1.15) / 2);
    return m;
  }
  function editLine(i, l) {
    var para = parasOf(i).filter(function (p) { return p.lines.indexOf(l.i) >= 0; })[0];
    var multi = para && para.lines.length > 1 && !para.lines.some(function (k) { var x = lineByI(i, k); return !x || (k !== l.i && edited(i, x)); });
    var opts = { title: T('Change text'), empty: true, note: T('Leave it empty to remove the text.') };
    if (multi) opts.choice = { labels: [T('Whole paragraph ({n} lines)', { n: para.lines.length }), T('This line only')], texts: [para.str, l.str], at: 0 };
    askText(multi ? para.str : l.str, function (txt, which) {
      snapshot();
      var whole = multi && which === 0, ls = whole ? para.lines.map(function (k) { return lineByI(i, k); }) : [l];
      var col = colorsAt(i, l);
      coverLines(i, ls, col);
      if (txt) { E.marks.push(newText(i, ls[0], txt, col, whole ? para : null)); loadFont(l.font); }
      E.sel = txt ? E.marks.length - 1 : -1;
      refresh(i);
    }, opts);
  }
  function lineByI(i, k) { return (E.lines[i] || []).filter(function (x) { return x.i === k; })[0]; }

  /* ---------- the PDF's own form boxes ---------- */
  function ensureFields(i) {
    if (E.fields[i] || !E.doc) return;
    E.fields[i] = 'loading';
    var doc = E.doc;
    doc.getPage(i + 1).then(function (page) { return page.getAnnotations({ intent: 'display' }); }).then(function (anns) {
      if (doc !== E.doc) return;
      var t = E.info[i].t, out = [];
      anns.forEach(function (a) {
        if (a.annotationType !== 20 || !a.fieldName || a.hidden || a.pushButton || a.fieldType === 'Sig' || !a.rect) return;
        var p1 = apply(t, a.rect[0], a.rect[1]), p2 = apply(t, a.rect[2], a.rect[3]);
        var r = [Math.min(p1[0], p2[0]), Math.min(p1[1], p2[1]), Math.abs(p2[0] - p1[0]), Math.abs(p2[1] - p1[1])];
        if (r[2] < 3 || r[3] < 3) return;
        var f = { name: a.fieldName, x: r[0], y: r[1], w: r[2], h: r[3], ro: !!a.readOnly, label: a.alternativeText || a.fieldName.split('.').pop().replace(/\[\d+\]$/, '').replace(/[_]+/g, ' '),
          size: (a.defaultAppearanceData && a.defaultAppearanceData.fontSize) || 0 };
        if (a.fieldType === 'Tx') { f.type = 'text'; f.value = a.fieldValue == null ? '' : String(a.fieldValue); f.multi = !!a.multiLine; f.max = a.maxLen || 0; f.comb = !!a.comb; }
        else if (a.checkBox) { f.type = 'check'; f.value = !!a.fieldValue && a.fieldValue !== 'Off'; f.on = a.exportValue || 'Yes'; }
        else if (a.radioButton) { f.type = 'radio'; f.value = a.fieldValue || ''; f.on = a.buttonValue; }
        else if (a.fieldType === 'Ch') { f.type = 'choice'; f.value = Array.isArray(a.fieldValue) ? (a.fieldValue[0] || '') : (a.fieldValue || ''); f.options = (a.options || []).map(function (o) { return { v: o.exportValue, d: o.displayValue }; }); }
        else return;
        out.push(f);
      });
      E.fields[i] = out;
      if (out.length && !E.hasFields) { E.hasFields = true; hint(); }
      paintMarks(i);
    }).catch(function () { if (doc === E.doc) E.fields[i] = []; });
  }
  function apply(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
  function fieldVal(f) { return Object.prototype.hasOwnProperty.call(E.form, f.name) ? E.form[f.name] : f.value; }
  function fieldAt(i, x, y) {
    var fs = E.fields[i]; if (!Array.isArray(fs)) return null;
    return fs.filter(function (f) { return x >= f.x - 1 && x <= f.x + f.w + 1 && y >= f.y - 1 && y <= f.y + f.h + 1; })[0] || null;
  }
  function setField(f, v) { snapshot(); E.form[f.name] = v; refresh(); }
  function fieldTap(i, f) {
    if (f.ro) { A.toast(T('This box cannot be changed.')); return; }
    var v = fieldVal(f);
    if (f.type === 'check') { setField(f, !v); return; }
    if (f.type === 'radio') { setField(f, f.on); return; }
    if (f.type === 'choice') {
      var sh = A.openSheet('<h3>' + esc(f.label) + '</h3>' + f.options.map(function (o, k) { return '<button class="opt' + (o.v === v || o.d === v ? ' on' : '') + '" data-fo="' + k + '"><span class="mk"></span><span class="ot">' + esc(o.d) + '</span></button>'; }).join(''));
      sh.onclick = function (e) { var b = e.target.closest('[data-fo]'); if (!b) return; A.closeSheet(); var o = f.options[+b.getAttribute('data-fo')]; setField(f, o.d || o.v); };
      return;
    }
    askText(v, function (txt) { setField(f, f.max ? txt.slice(0, f.max) : txt); }, { title: f.label, empty: true, max: f.max });
  }
  function fieldHTML(f, s) {
    var v = fieldVal(f), st = 'left:' + (f.x * s).toFixed(1) + 'px;top:' + (f.y * s).toFixed(1) + 'px;width:' + (f.w * s).toFixed(1) + 'px;height:' + (f.h * s).toFixed(1) + 'px;';
    var fs = (f.multi ? (f.size && f.size <= 14 ? f.size : 10) : f.size ? Math.min(f.size, f.h * 0.85) : Math.min(f.h * 0.68, 11)) * s, inner = '';
    if (f.type === 'check') inner = v ? '<svg viewBox="0 0 100 100"><path d="M18 52 L42 76 L84 24" fill="none" stroke="#111" stroke-width="12" stroke-linecap="round"/></svg>' : '';
    else if (f.type === 'radio') inner = v && v === f.on ? '<i class="rdot"></i>' : '';
    else inner = '<span style="font-size:' + fs.toFixed(1) + 'px' + (f.comb && f.max ? ';letter-spacing:' + ((f.w / f.max - fs / s * 0.55) * s).toFixed(1) + 'px' : '') + '">' + esc(v || '') + '</span>' + (f.type === 'choice' ? '<b>&#9662;</b>' : '');
    return '<div class="ff ff-' + f.type + (f.multi ? ' multi' : '') + (f.ro ? ' ro' : '') + '" style="' + st + '">' + inner + '</div>';
  }
  // what the form values look like as marks, for locked files that are saved as pictures
  function formMarks() {
    var out = [];
    Object.keys(E.fields).forEach(function (i) {
      if (!Array.isArray(E.fields[i])) return;
      E.fields[i].forEach(function (f) {
        if (!Object.prototype.hasOwnProperty.call(E.form, f.name)) return;
        var v = E.form[f.name], p = +i;
        if (f.type === 'check' && v) out.push({ page: p, type: 'check', x: f.x + f.w * 0.1, y: f.y + f.h * 0.1, w: Math.min(f.w, f.h) * 0.8, h: Math.min(f.w, f.h) * 0.8, color: '#111111' });
        else if (f.type === 'radio' && v === f.on) out.push({ page: p, type: 'check', x: f.x + f.w * 0.1, y: f.y + f.h * 0.1, w: Math.min(f.w, f.h) * 0.8, h: Math.min(f.w, f.h) * 0.8, color: '#111111' });
        else if ((f.type === 'text' || f.type === 'choice') && v) { var sz = f.size || Math.min(f.h * 0.68, 11); out.push({ page: p, type: 'text', x: f.x + 2, y: f.y + (f.h - sz * 1.15) / 2, size: sz, color: '#111111', text: String(v), font: 'libsans', w: f.w - 4, wrap: f.multi }); }
      });
    });
    return out;
  }

  /* ---------- marks on the screen ---------- */
  function textStyle(m, s) {
    var st = 'font-family:\'F-' + (m.font || 'roboto') + '\',sans-serif;font-size:' + (m.size * s).toFixed(2) + 'px;color:' + m.color + ';line-height:' + (m.lh || 1.15) + ';';
    if (m.bold) st += 'font-weight:700;';
    if (m.italic) st += 'font-style:italic;';
    if (m.u || m.s) st += 'text-decoration:' + (m.u ? 'underline ' : '') + (m.s ? 'line-through' : '') + ';';
    if (m.wrap && m.w) st += 'width:' + (m.w * s).toFixed(1) + 'px;white-space:pre-wrap;overflow-wrap:break-word;' + (m.align === 'center' ? 'text-align:center;' : '');
    else if (m.align === 'center' && m.w) st += 'transform:translateX(-50%);text-align:center;';
    return st;
  }
  function markHTML(m, k, s) {
    var sel = k === E.sel ? ' sel' : '', st = 'left:' + (m.x * s).toFixed(1) + 'px;top:' + (m.y * s).toFixed(1) + 'px;';
    if (m.type === 'text') {
      if (m.align === 'center' && m.w && !m.wrap) st = 'left:' + ((m.x + m.w / 2) * s).toFixed(1) + 'px;top:' + (m.y * s).toFixed(1) + 'px;';
      return '<div class="mk t' + sel + '" data-k="' + k + '" style="' + st + textStyle(m, s) + '">' + esc(m.text) + (m.wrap ? '<span class="rs"></span>' : '') + '</div>';
    }
    var wh = 'width:' + (m.w * s).toFixed(1) + 'px;height:' + (m.h * s).toFixed(1) + 'px;';
    if (m.type === 'img') return '<div class="mk' + sel + '" data-k="' + k + '" style="' + st + wh + '"><img src="' + m.src + '" alt=""><span class="rs"></span></div>';
    if (m.type === 'white') return '<div class="mk white' + sel + '" data-k="' + k + '" style="' + st + wh + (m.fill ? 'background:' + m.fill + ';' : '') + '"><span class="rs"></span></div>';
    if (m.type === 'redact') return '<div class="mk redact' + sel + '" data-k="' + k + '" style="' + st + wh + '"><span class="rs"></span></div>';
    if (m.type === 'hl') return '<div class="mk hl' + sel + '" data-k="' + k + '" style="' + st + wh + 'background:' + (m.color || HL[0]) + '"><span class="rs"></span></div>';
    if (m.type === 'rect') return '<div class="mk' + sel + '" data-k="' + k + '" style="' + st + wh + 'box-shadow:inset 0 0 0 ' + ((m.lw || 1.5) * s).toFixed(2) + 'px ' + m.color + '"><span class="rs"></span></div>';
    if (m.type === 'line') {
      var pad = 10 / s, bx = Math.min(m.x, m.x + m.w) - pad, by = Math.min(m.y, m.y + m.h) - pad, bw = Math.abs(m.w) + 2 * pad, bh = Math.abs(m.h) + 2 * pad;
      var x1 = (m.x - bx) * s, y1 = (m.y - by) * s, x2 = (m.x + m.w - bx) * s, y2 = (m.y + m.h - by) * s, lw = (m.lw || 1.5) * s, head = '';
      if (m.arrow) {
        var ang = Math.atan2(m.h, m.w), hl = Math.max(6, (m.lw || 1.5) * 4) * s;
        head = [ang + Math.PI - 0.5, ang + Math.PI + 0.5].map(function (a) { return '<line x1="' + x2.toFixed(1) + '" y1="' + y2.toFixed(1) + '" x2="' + (x2 + Math.cos(a) * hl).toFixed(1) + '" y2="' + (y2 + Math.sin(a) * hl).toFixed(1) + '"/>'; }).join('');
      }
      return '<div class="mk ln' + sel + '" data-k="' + k + '" style="left:' + (bx * s).toFixed(1) + 'px;top:' + (by * s).toFixed(1) + 'px;width:' + (bw * s).toFixed(1) + 'px;height:' + (bh * s).toFixed(1) + 'px">' +
        '<svg><g stroke="' + m.color + '" stroke-width="' + lw.toFixed(2) + '" stroke-linecap="round"><line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>' + head + '</g></svg>' +
        '<span class="rs" style="left:' + (x2 - 14).toFixed(1) + 'px;top:' + (y2 - 14).toFixed(1) + 'px;right:auto;bottom:auto"></span></div>';
    }
    if (m.type === 'ink') {
      var b = inkBox(m), d = m.pts.map(function (p, j) { return (j ? 'L' : 'M') + ((p[0] - b.x) * s).toFixed(1) + ' ' + ((p[1] - b.y) * s).toFixed(1); }).join(' ');
      return '<div class="mk' + sel + '" data-k="' + k + '" style="left:' + (b.x * s).toFixed(1) + 'px;top:' + (b.y * s).toFixed(1) + 'px;width:' + Math.max(8, b.w * s).toFixed(1) + 'px;height:' + Math.max(8, b.h * s).toFixed(1) + 'px">' +
        '<svg><path d="' + d + '" fill="none" stroke="' + m.color + '" stroke-width="' + ((m.lw || 1.6) * s).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    }
    var path = m.type === 'check' ? 'M10 55 L38 84 L92 14' : 'M14 14 L86 86 M86 14 L14 86';
    return '<div class="mk' + sel + '" data-k="' + k + '" style="' + st + wh + '"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + path + '" fill="none" stroke="' + m.color + '" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="rs"></span></div>';
  }
  function inkBox(m) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    m.pts.forEach(function (p) { if (p[0] < x0) x0 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[0] > x1) x1 = p[0]; if (p[1] > y1) y1 = p[1]; });
    var pad = (m.lw || 1.6) / 2 + 1;
    return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad };
  }
  function pnumHTML(i, s) {
    var pn = E.pnum; if (!pn) return '';
    var txt = PT.pnumText ? PT.pnumText(pn, i, E.info.length) : ''; if (!txt) return '';
    var pos = pn.pos || 'bc', y = pos[0] === 't' ? 30 - 10 * 0.9 : E.info[i].h - 24 - 10 * 0.9;
    var st = 'top:' + (y * s).toFixed(1) + 'px;font-size:' + (10 * s).toFixed(1) + 'px;';
    st += pos[1] === 'l' ? 'left:' + (36 * s).toFixed(1) + 'px;' : pos[1] === 'r' ? 'right:' + (36 * s).toFixed(1) + 'px;' : 'left:0;right:0;text-align:center;';
    return '<div class="pnum" style="' + st + '">' + esc(txt) + '</div>';
  }
  function paintMarks(i) {
    var layer = document.querySelector('#ed-pages .ed-layer[data-i="' + i + '"]'); if (!layer) return;
    var s = scaleOf(i), h = '';
    if (Array.isArray(E.fields[i])) E.fields[i].forEach(function (f) { h += fieldHTML(f, s); });
    // dotted outlines on the lines of text that can be changed or highlighted
    if (NEEDS_LINES[E.tool] && Array.isArray(E.lines[i])) {
      E.lines[i].forEach(function (l) {
        if (edited(i, l)) return;
        h += '<div class="txh" data-l="' + l.i + '" style="left:' + (l.x * s - 2).toFixed(1) + 'px;top:' + (l.y * s - 1).toFixed(1) + 'px;width:' + (l.w * s + 4).toFixed(1) + 'px;height:' + (l.h * s + 2).toFixed(1) + 'px"></div>';
      });
    }
    E.marks.forEach(function (m, k) { if (m.page === i) h += markHTML(m, k, s); });
    h += pnumHTML(i, s);
    layer.innerHTML = h;
  }
  function refresh(page) {
    if (page == null) for (var i = 0; i < E.info.length; i++) paintMarks(i); else paintMarks(page);
    PDF.refreshBar(); showFtb();
  }
  // undo keeps the marks, form values and page numbers, and after a page change also the PDF as it was before
  function state() { return JSON.stringify({ m: E.marks, f: E.form, p: E.pnum }); }
  function snapshot(src) {
    E.undo.push({ s: state(), src: src || null });
    if (E.undo.length > 60) E.undo.shift();
    var withSrc = E.undo.filter(function (u) { return u.src; }).length;
    while (withSrc > 4) { var u = E.undo.shift(); if (u.src) withSrc--; }
    E.dirty = true;
  }
  function restore(s) { var o = JSON.parse(s); E.marks = o.m || []; E.form = o.f || {}; E.pnum = o.p || null; }
  function undo() {
    if (!E.undo.length) return;
    var u = E.undo.pop();
    E.sel = -1; E.dirty = true; E.sub = ''; hideFtb();
    if (u.src) { reopen(u.src).then(function () { restore(u.s); refresh(); }); return; }
    restore(u.s); refresh();
  }
  function setTool(t) {
    if (t === 'image') { pickImage(); return; }
    if (t === 'pages') { pagesSheet(); return; }
    if (t === 'find') { findSheet(); return; }
    E.tool = E.tool === t ? null : t; E.sel = -1; E.sub = '';
    var ed = $('#ed'); if (ed) ed.classList.toggle('drawing', E.tool === 'draw');
    Array.prototype.forEach.call(document.querySelectorAll('.etools [data-et]'), function (b) { b.classList.toggle('on', b.getAttribute('data-et') === E.tool); });
    hint();
    if (NEEDS_LINES[E.tool]) Array.prototype.forEach.call(document.querySelectorAll('#ed-pages .ed-page'), function (el) { if (el.querySelector('canvas')) ensureLines(+el.getAttribute('data-i')); });
    refresh();
    if (E.tool === 'sign') chooseSig(function (ok) { if (!ok) setTool('sign'); });
    if (E.tool === 'date') chooseDate();
  }
  // the page that takes up most of the screen
  function curPage() {
    var best = 0, most = -1, vh = window.innerHeight;
    Array.prototype.forEach.call(document.querySelectorAll('#ed-pages .ed-page'), function (el) {
      var r = el.getBoundingClientRect(), v = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (v > most) { most = v; best = +el.getAttribute('data-i'); }
    });
    return best;
  }
  var hintPage = -1;
  window.addEventListener('scroll', function () { if (S.stack[S.stack.length - 1] === 'pdfsign' && E.tool) { var c = curPage(); if (c !== hintPage) { hintPage = c; hint(); } } }, { passive: true });

  /* ---------- placing and moving ---------- */
  function today(fmt) {
    var d = new Date(), dd = ('0' + d.getDate()).slice(-2), mm = ('0' + (d.getMonth() + 1)).slice(-2);
    if (fmt === 1) return d.getDate() + ' ' + A.MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    if (fmt === 2) return d.getFullYear() + '-' + mm + '-' + dd;
    return dd + '/' + mm + '/' + d.getFullYear();
  }
  function place(i, x, y) {
    var m = null, info = E.info[i], ln;
    if (E.tool === 'edittext') { ln = lineAt(i, x, y); if (ln && !edited(i, ln)) editLine(i, ln); else if (!ln) A.toast(T('Tap on a line of text.')); return; }
    if (E.tool === 'text') { askText('', function (txt) { snapshot(); E.marks.push({ page: i, type: 'text', x: x, y: y - 11 * 0.6, size: 11, color: E.color, text: txt, font: 'roboto' }); E.sel = E.marks.length - 1; refresh(i); }); return; }
    if (E.tool === 'date') m = { page: i, type: 'text', x: x, y: y - 11 * 0.6, size: 11, color: E.color, text: today(E.fmt), font: 'roboto' };
    if (E.tool === 'check' || E.tool === 'cross') m = { page: i, type: E.tool, x: x - 7, y: y - 7, w: 14, h: 14, color: E.color };
    if (E.tool === 'white') {
      ln = lineAt(i, x, y);
      if (ln) m = coverOf(i, ln, colorsAt(i, ln)); // white-out on a line of text takes the text out of the PDF too
      else m = { page: i, type: 'white', x: x - 55, y: y - 9, w: 110, h: 18 };
    }
    if (E.tool === 'redact') {
      ln = lineAt(i, x, y);
      m = ln ? { page: i, type: 'redact', x: ln.x - 1.5, y: ln.y - 0.5, w: ln.w + 3, h: ln.h + 1 } : { page: i, type: 'redact', x: x - 55, y: y - 9, w: 110, h: 18 };
    }
    if (E.tool === 'hl') {
      ln = lineAt(i, x, y);
      m = ln ? { page: i, type: 'hl', x: ln.x - 1, y: ln.y, w: ln.w + 2, h: ln.h, color: HL[0] } : { page: i, type: 'hl', x: x - 55, y: y - 7, w: 110, h: 14, color: HL[0] };
    }
    if (E.tool === 'rect') m = { page: i, type: 'rect', x: x - 60, y: y - 35, w: 120, h: 70, color: E.color, lw: 1.5 };
    if (E.tool === 'line') m = { page: i, type: 'line', x: x - 60, y: y, w: 120, h: 0, color: E.color, lw: 1.5, arrow: false };
    if (E.tool === 'sign') {
      if (!E.sig) { chooseSig(); return; }
      var w = Math.min(130, info.w * 0.3), h = w / (E.sig.ar || 3);
      m = { page: i, type: 'img', x: x - w / 2, y: y - h / 2, w: w, h: h, src: E.sig.src };
    }
    if (!m) return;
    m.x = Math.max(-m.w || 0, Math.min(info.w - 4, m.x)); m.y = Math.max(0, Math.min(info.h - 4, m.y));
    snapshot(); E.marks.push(m); E.sel = E.marks.length - 1; refresh(i);
  }
  var G = null; // the gesture in progress
  function layerOf(t) { return t.closest('.ed-layer'); }
  function ptIn(layer, e) { var r = layer.getBoundingClientRect(), i = +layer.getAttribute('data-i'), s = r.width / E.info[i].w; return [(e.clientX - r.left) / s, (e.clientY - r.top) / s, s]; }
  document.addEventListener('pointerdown', function (e) {
    if (S.stack[S.stack.length - 1] !== 'pdfsign') return;
    var layer = layerOf(e.target); if (!layer) return;
    var i = +layer.getAttribute('data-i'), p = ptIn(layer, e), mk = e.target.closest('.mk');
    if (mk) {
      var k = +mk.getAttribute('data-k'), m = E.marks[k];
      e.preventDefault();
      if (E.sel !== k) { E.sel = k; E.sub = ''; refresh(i); }
      G = { kind: e.target.classList.contains('rs') ? 'size' : 'move', k: k, start: p, orig: JSON.parse(JSON.stringify(m)), moved: false, layer: layer, page: i };
      return;
    }
    if (E.tool === 'draw') {
      e.preventDefault();
      G = { kind: 'ink', page: i, layer: layer, pts: [[p[0], p[1]]], s: p[2] };
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'ink-svg');
      svg.innerHTML = '<path fill="none" stroke="' + E.color + '" stroke-width="' + (1.6 * p[2]).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/>';
      layer.appendChild(svg); G.svg = svg;
      return;
    }
    G = { kind: 'tap', page: i, layer: layer, start: p, x: e.clientX, y: e.clientY };
  }, { passive: false });
  document.addEventListener('pointermove', function (e) {
    if (!G) return;
    if (G.kind === 'tap') { if (Math.abs(e.clientX - G.x) + Math.abs(e.clientY - G.y) > 10) G = null; return; }
    var p = ptIn(G.layer, e);
    if (G.kind === 'ink') {
      G.pts.push([p[0], p[1]]);
      G.svg.firstChild.setAttribute('d', G.pts.map(function (q, j) { return (j ? 'L' : 'M') + (q[0] * G.s).toFixed(1) + ' ' + (q[1] * G.s).toFixed(1); }).join(' '));
      e.preventDefault(); return;
    }
    var m = E.marks[G.k], dx = p[0] - G.start[0], dy = p[1] - G.start[1], o = G.orig;
    if (!G.moved && Math.abs(dx) + Math.abs(dy) < 1.5) return;
    if (!G.moved) { snapshot(); G.moved = true; hideFtb(); }
    if (G.kind === 'move') {
      if (m.type === 'ink') m.pts = o.pts.map(function (q) { return [q[0] + dx, q[1] + dy]; });
      else { m.x = o.x + dx; m.y = o.y + dy; }
    } else {
      if (m.type === 'img') { var nw = Math.max(20, o.w + dx); m.w = nw; m.h = nw * o.h / o.w; }
      else if (m.type === 'text') { m.w = Math.max(20, o.w + dx); }
      else if (m.type === 'check' || m.type === 'cross') { var sz = Math.max(6, Math.max(o.w + dx, o.h + dy)); m.w = m.h = sz; }
      else if (m.type === 'line') { m.w = o.w + dx; m.h = o.h + dy; }
      else { m.w = Math.max(6, o.w + dx); m.h = Math.max(4, o.h + dy); }
    }
    var el = G.layer.querySelector('.mk[data-k="' + G.k + '"]');
    if (el) el.outerHTML = markHTML(m, G.k, p[2]);
    e.preventDefault();
  }, { passive: false });
  function end(e) {
    if (!G) return;
    var g = G; G = null;
    if (g.kind === 'ink') {
      g.svg.remove();
      if (g.pts.length > 1) { snapshot(); E.marks.push({ page: g.page, type: 'ink', pts: g.pts, lw: 1.6, color: E.color }); E.sel = -1; refresh(g.page); }
      return;
    }
    if (g.kind === 'tap') {
      if (e.type === 'pointercancel') return;
      if (E.sel >= 0 && !E.tool) { E.sel = -1; E.sub = ''; refresh(); return; }
      if (E.sel >= 0) { E.sel = -1; E.sub = ''; refresh(); }
      if (E.tool && E.tool !== 'draw') { place(g.page, g.start[0], g.start[1]); return; }
      if (!E.tool) { var f = fieldAt(g.page, g.start[0], g.start[1]); if (f) fieldTap(g.page, f); }
      return;
    }
    if (g.moved) refresh(g.page); else showFtb();
  }
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
  // on a computer: the arrow keys move what is selected (with Shift: 10 points), Delete removes it
  document.addEventListener('keydown', function (e) {
    if (S.stack[S.stack.length - 1] !== 'pdfsign' || E.sel < 0 || !$('#sheet').hidden) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '')) return;
    var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (d) { e.preventDefault(); nudge(d[0] * (e.shiftKey ? 10 : 1), d[1] * (e.shiftKey ? 10 : 1), true); return; }
    if (e.key === 'Delete') { e.preventDefault(); snapshot(); E.marks.splice(E.sel, 1); E.sel = -1; refresh(); }
  });
  var nudgeAt = 0;
  function nudge(dx, dy, merge) {
    var m = E.marks[E.sel]; if (!m) return;
    if (!merge || Date.now() - nudgeAt > 1500) snapshot();
    nudgeAt = Date.now();
    if (m.type === 'ink') m.pts = m.pts.map(function (q) { return [q[0] + dx, q[1] + dy]; }); else { m.x += dx; m.y += dy; }
    refresh(m.page);
  }

  /* ---------- the small toolbar above a selected mark ---------- */
  function hideFtb() { var f = $('#ftb'); if (f) f.remove(); }
  function showFtb() {
    hideFtb();
    if (E.sel < 0 || S.stack[S.stack.length - 1] !== 'pdfsign') return;
    var m = E.marks[E.sel], el = document.querySelector('.mk[data-k="' + E.sel + '"]'); if (!m || !el) return;
    var b = [], sub = E.sub;
    if (sub === 'color') {
      (m.type === 'hl' ? HL : COLORS).forEach(function (c) { b.push(['c:' + c, '<i class="dot' + (c.toLowerCase() === String(m.color).toLowerCase() ? ' on' : '') + '" style="background:' + c + '"></i>']); });
      if (m.type !== 'hl') b.push(['pick', '<label class="cpick" aria-label="' + esc(T('More colours')) + '">+<input type="color" value="' + esc(/^#[0-9a-f]{6}$/i.test(m.color) ? m.color : '#111111') + '"></label>']);
    } else if (sub === 'style') {
      b.push(['bold', '<b>B</b>', m.bold], ['italic', '<i style="font-family:serif">I</i>', m.italic], ['u', '<u>U</u>', m.u], ['s', '<s>S</s>', m.s], ['font', esc(fontName(m.font))], ['back', '&#10003;']);
    } else if (sub === 'more') {
      b.push(['copy', T('Copy')], ['n:-1:0', '&#8592;'], ['n:0:-1', '&#8593;'], ['n:0:1', '&#8595;'], ['n:1:0', '&#8594;'], ['back', '&#10003;']);
    } else {
      if (m.type === 'text') b.push(['smaller', 'A−'], ['bigger', 'A+'], ['style', 'Aa']);
      if (m.type === 'check' || m.type === 'cross' || m.type === 'ink' || m.type === 'rect' || m.type === 'line') b.push(['smaller', '−'], ['bigger', '+']);
      if (m.type === 'line') b.push(['arrow', T(m.arrow ? 'Line' : 'Arrow')]);
      if (m.type !== 'white' && m.type !== 'img' && m.type !== 'redact') b.push(['color', '<i class="dot" style="background:' + m.color + '"></i>']);
      if (m.type === 'text') b.push(['edit', T('Edit')]);
      b.push(['more', '&#8943;'], ['del', T('Delete')]);
    }
    var f = document.createElement('div'); f.className = 'ftb'; f.id = 'ftb';
    f.innerHTML = b.map(function (x) { return '<button data-fa="' + x[0] + '"' + (x[2] ? ' class="on"' : '') + '>' + x[1] + '</button>'; }).join('');
    document.body.appendChild(f);
    var r = el.getBoundingClientRect(), fw = f.offsetWidth, fh = f.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - fw - 8, r.left + r.width / 2 - fw / 2)), topY = r.top - fh - 14;
    if (topY < 64) topY = r.bottom + 16;
    f.style.left = left + 'px'; f.style.top = topY + 'px';
    var cp = f.querySelector('.cpick input');
    if (cp) cp.addEventListener('change', function () { snapshot(); m.color = cp.value.toUpperCase(); E.color = m.color; refresh(m.page); });
  }
  window.addEventListener('scroll', function () { if (S.stack[S.stack.length - 1] === 'pdfsign' && $('#ftb')) showFtb(); }, { passive: true });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#ftb [data-fa]'); if (!b) return;
    var a = b.getAttribute('data-fa'), m = E.marks[E.sel]; if (!m) return;
    if (a === 'pick') return;
    if (a === 'del') { snapshot(); E.marks.splice(E.sel, 1); E.sel = -1; E.sub = ''; refresh(); return; }
    if (a === 'edit') { askText(m.text, function (txt) { snapshot(); m.text = txt; refresh(m.page); }); return; }
    if (a === 'color' || a === 'style' || a === 'more') { E.sub = a; showFtb(); return; }
    if (a === 'back') { E.sub = ''; showFtb(); return; }
    if (a.indexOf('n:') === 0) { var d = a.split(':'); nudge(+d[1], +d[2], true); return; }
    if (a === 'copy') {
      snapshot();
      var c2 = JSON.parse(JSON.stringify(m)); delete c2.key;
      if (c2.type === 'ink') c2.pts = c2.pts.map(function (q) { return [q[0] + 10, q[1] + 10]; }); else { c2.x += 10; c2.y += 10; }
      E.marks.push(c2); E.sel = E.marks.length - 1; E.sub = ''; refresh(c2.page); return;
    }
    snapshot();
    if (a.indexOf('c:') === 0) { m.color = a.slice(2); if (m.type !== 'hl') E.color = m.color; }
    if (a === 'bold') m.bold = !m.bold;
    if (a === 'italic') m.italic = !m.italic;
    if (a === 'u') m.u = !m.u;
    if (a === 's') m.s = !m.s;
    if (a === 'font') { var at = FONT_ORDER.indexOf(m.font); m.font = FONT_ORDER[(at + 1) % FONT_ORDER.length]; loadFont(m.font); }
    if (a === 'arrow') m.arrow = !m.arrow;
    var f = a === 'bigger' ? 1.15 : (a === 'smaller' ? 1 / 1.15 : 1);
    if (m.type === 'text') m.size = Math.max(4, Math.min(72, m.size * f));
    if (m.type === 'check' || m.type === 'cross') { var c = [m.x + m.w / 2, m.y + m.h / 2]; m.w = m.h = Math.max(6, Math.min(60, m.w * f)); m.x = c[0] - m.w / 2; m.y = c[1] - m.h / 2; }
    if (m.type === 'ink' || m.type === 'rect' || m.type === 'line') m.lw = Math.max(0.5, Math.min(12, (m.lw || 1.5) * (f === 1 ? 1 : (f > 1 ? 1.35 : 1 / 1.35))));
    refresh(m.page);
    if (a === 'font') setTimeout(function () { refresh(m.page); }, 400); // when the font has loaded
  });

  /* ---------- sheets: text, date format, signature ---------- */
  // quick answers from the person's CV (name, ID, cell…) for filling in forms
  function cvAnswers() {
    var cv = S.list.slice().sort(function (a, b) { return (b.updated || 0) - (a.updated || 0); })[0]; if (!cv) return [];
    var p = cv.personal || {}, c = cv.contact || {}, out = [];
    function add(label, v) { if (v && String(v).trim()) out.push([label, String(v).trim()]); }
    add('Full name', [p.firstNames, p.surname].filter(Boolean).join(' '));
    add('Surname', p.surname); add('First names', p.firstNames); add('ID number', p.idNumber);
    add('Cell', c.phone); add('Email', c.email);
    var lines = String(c.address || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    if (lines.length) add('Address', lines.join(', '));
    return out;
  }
  /* opts: { title, empty (an empty answer is allowed), note, max (most letters),
     choice: { labels, texts, at } two ways to answer (e.g. the whole paragraph or one line): done(text, which) } */
  function askText(value, done, opts) {
    opts = opts || {};
    var ans = cvAnswers(), ch = opts.choice, which = ch ? ch.at || 0 : 0;
    var sh = A.openSheet('<h3>' + esc(opts.title || T('Text')) + '</h3>' +
      (ch ? '<div class="seg2">' + ch.labels.map(function (l, k) { return '<button data-ch="' + k + '" class="' + (k === which ? 'on' : '') + '">' + esc(l) + '</button>'; }).join('') + '</div>' : '') +
      '<div class="inp-wrap"><textarea class="inp" id="ed-txt" rows="' + (ch ? 5 : 2) + '" autocomplete="off"' + (opts.max ? ' maxlength="' + opts.max + '"' : '') + '>' + esc(value || '') + '</textarea>' +
      (opts.note ? '<div class="hint">' + esc(opts.note) + '</div>' : '') + '</div>' +
      (ans.length ? '<div class="sheet-sec">' + T('From my CV') + '</div><div class="inp-wrap"><div class="achips" style="margin:0;padding:0;flex-wrap:wrap">' + ans.map(function (a, i) { return '<button class="achip" data-ans="' + i + '">' + esc(T(a[0])) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div class="sheet-foot"><button class="btn ghost" data-tx="no">' + T('Cancel') + '</button><button class="btn" data-tx="ok">' + T('Done') + '</button></div>');
    var ta = $('#ed-txt'); setTimeout(function () { ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) { /* ignore */ } }, 250);
    sh.onclick = function (e) {
      var c = e.target.closest('[data-ans]'); if (c) { ta.value = ans[+c.getAttribute('data-ans')][1]; ta.focus(); return; }
      var s2 = e.target.closest('[data-ch]');
      if (s2) { which = +s2.getAttribute('data-ch'); ta.value = ch.texts[which]; sh.querySelectorAll('[data-ch]').forEach(function (x) { x.classList.toggle('on', x === s2); }); ta.focus(); return; }
      var b = e.target.closest('[data-tx]'); if (!b) return;
      var v = ta.value.replace(/\s+$/, ''); A.closeSheet();
      if (b.getAttribute('data-tx') === 'ok' && (v || opts.empty)) done(v, which);
    };
  }
  function chooseDate() {
    var sh = A.openSheet('<h3>' + T('Date') + '</h3>' + [0, 1, 2].map(function (f) { return '<button class="opt' + (E.fmt === f ? ' on' : '') + '" data-df="' + f + '"><span class="mk"></span><span class="ot">' + esc(today(f)) + '</span></button>'; }).join(''));
    sh.onclick = function (e) { var b = e.target.closest('[data-df]'); if (!b) return; E.fmt = +b.getAttribute('data-df'); A.closeSheet(); };
  }
  function imgAspect(src, cb) { var im = new Image(); im.onload = function () { cb(im.naturalWidth / Math.max(1, im.naturalHeight)); }; im.onerror = function () { cb(3); }; im.src = src; }
  function chooseSig(after) {
    var st = sigStore(), list = [];
    if (st.sig) list.push(['My signature', st.sig]);
    if (st.ini) list.push(['My initials', st.ini]);
    S.list.forEach(function (cv) {
      if (cv.signature && !list.some(function (x) { return x[1] === cv.signature; })) list.push([T('Signature from CV: {name}', { name: A.cvTitle(cv) }), cv.signature]);
      if (cv.initials && !list.some(function (x) { return x[1] === cv.initials; })) list.push([T('Initials from CV: {name}', { name: A.cvTitle(cv) }), cv.initials]);
    });
    var h = '<h3>' + T('Signature') + '</h3>' + list.map(function (x, i) { return '<button class="sig-pick" data-sg="' + i + '"><img src="' + x[1] + '" alt=""><span>' + esc(T(x[0])) + '</span></button>'; }).join('') +
      '<button class="sheet-item" data-sn="sig">' + ic('sign') + '<span>' + T('Draw a new signature') + '</span></button>' +
      '<button class="sheet-item" data-sn="ini">' + ic('text') + '<span>' + T('Draw your initials') + '</span></button>';
    var sh = A.openSheet(h);
    sh.onclick = function (e) {
      var g = e.target.closest('[data-sg]');
      if (g) { var src = list[+g.getAttribute('data-sg')][1]; A.closeSheet(); imgAspect(src, function (ar) { E.sig = { src: src, ar: ar }; if (after) after(true); }); return; }
      var n = e.target.closest('[data-sn]'); if (!n) return;
      var kind = n.getAttribute('data-sn');
      A.signPad(kind === 'ini' ? 'initials' : 'signature', function (v) {
        if (!v) { if (after) after(false); return; }
        imgAspect(v, function (ar) { E.sig = { src: v, ar: ar }; if (after) after(true); });
      }, { get: function () { return sigStore()[kind]; }, set: function (v) { setSig(kind, v); }, text: T('Sign with your finger in the box. It is kept on this phone for your PDFs.') });
    };
  }

  /* ---------- find and replace ---------- */
  function rx(find, cs, word) {
    var e = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    return new RegExp(word ? '(^|[^\\p{L}\\p{N}])(' + e + ')(?=$|[^\\p{L}\\p{N}])' : '()(' + e + ')', 'g' + (cs ? '' : 'i') + 'u');
  }
  // every place the words are: lines not changed yet, and text added or changed in the editor
  function findAll(find, cs, word) {
    var out = [], re = rx(find, cs, word);
    E.info.forEach(function (p, i) {
      (Array.isArray(E.lines[i]) ? E.lines[i] : []).forEach(function (l) { if (!edited(i, l)) { re.lastIndex = 0; var n = (l.str.match(re) || []).length; if (n) out.push({ page: i, line: l, n: n, str: l.str }); } });
    });
    E.marks.forEach(function (m, k) { if (m.type === 'text') { re.lastIndex = 0; var n = (String(m.text).match(re) || []).length; if (n) out.push({ page: m.page, mark: k, n: n, str: m.text }); } });
    return out.sort(function (a, b) { return a.page - b.page || (a.line ? a.line.y : E.marks[a.mark].y) - (b.line ? b.line.y : E.marks[b.mark].y); });
  }
  function findSheet() {
    hideFtb(); E.sel = -1;
    var sh = A.openSheet('<h3>' + T('Find and replace') + '</h3><div class="inp-wrap"><input class="inp" id="fr-f" placeholder="' + esc(T('Find')) + '" autocomplete="off">' +
      '<input class="inp" id="fr-r" placeholder="' + esc(T('Replace with')) + '" autocomplete="off" style="margin-top:8px">' +
      '<div class="fr-opts"><label><input type="checkbox" id="fr-c"> ' + T('Match case') + '</label><label><input type="checkbox" id="fr-w"> ' + T('Whole words') + '</label></div></div>' +
      '<div id="fr-res" class="fr-res"></div>' +
      '<div class="sheet-foot"><button class="btn ghost" data-fr="close">' + T('Close') + '</button><button class="btn" data-fr="all" disabled>' + T('Replace all') + '</button></div>');
    var fi = $('#fr-f'), ri = $('#fr-r'), res = $('#fr-res'), cs = $('#fr-c'), ww = $('#fr-w'), all = sh.querySelector('[data-fr="all"]'), hits = [], ready = false, timer = 0;
    res.innerHTML = '<div class="fr-note">' + T('Looking at the text on every page…') + '</div>';
    allLines().then(function () { ready = true; run(); });
    setTimeout(function () { fi.focus(); }, 250);
    function run() {
      if (!ready) return;
      var q = fi.value; hits = q.trim() ? findAll(q, cs.checked, ww.checked) : [];
      var total = hits.reduce(function (s, h) { return s + h.n; }, 0);
      all.disabled = !total;
      if (!q.trim()) { res.innerHTML = '<div class="fr-note">' + T('Type the words to look for.') + '</div>'; return; }
      if (!total) { res.innerHTML = '<div class="fr-note">' + T('Not found. Scanned pages need "Read the words" first.') + '</div>'; return; }
      res.innerHTML = '<div class="fr-note"><b>' + T(total === 1 ? 'Found once' : 'Found {n} times', { n: total }) + '</b></div>' +
        hits.slice(0, 30).map(function (h, k) { return '<button class="fr-hit" data-fh="' + k + '"><b>' + T('Page {n}', { n: h.page + 1 }) + '</b><span>' + esc(h.str.length > 90 ? h.str.slice(0, 90) + '…' : h.str) + '</span></button>'; }).join('');
    }
    fi.oninput = cs.onchange = ww.onchange = function () { clearTimeout(timer); timer = setTimeout(run, 150); };
    sh.onclick = function (e) {
      var h = e.target.closest('[data-fh]');
      if (h) { var x = hits[+h.getAttribute('data-fh')]; A.closeSheet(); showHit(x); return; }
      var b = e.target.closest('[data-fr]'); if (!b || b.disabled) return;
      if (b.getAttribute('data-fr') === 'close') { A.closeSheet(); return; }
      var q = fi.value, rep = ri.value, list = hits.slice(), re = rx(q, cs.checked, ww.checked);
      A.closeSheet(); replaceAll(list, re, rep);
    };
  }
  function showHit(x) {
    var pg = document.querySelector('#ed-pages .ed-page[data-i="' + x.page + '"]'); if (!pg) return;
    var s = scaleOf(x.page), y = x.line ? x.line.y : E.marks[x.mark].y, r = pg.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + r.top + y * s - window.innerHeight / 3);
    if (x.mark != null) { E.sel = x.mark; refresh(x.page); return; }
    var l = x.line, fl = document.createElement('div');
    fl.className = 'txh flash'; fl.style.cssText = 'left:' + (l.x * s - 3) + 'px;top:' + (l.y * s - 2) + 'px;width:' + (l.w * s + 6) + 'px;height:' + (l.h * s + 4) + 'px';
    var layer = pg.querySelector('.ed-layer'); if (layer) { layer.appendChild(fl); setTimeout(function () { fl.remove(); }, 2600); }
  }
  function replaceAll(list, re, rep) {
    if (!list.length) return;
    A.busy(T('Replacing…'));
    var sub = function (s) { re.lastIndex = 0; return s.replace(re, function (all, pre) { return pre + rep; }); };
    var pages = {}; list.forEach(function (h) { if (h.line) pages[h.page] = 1; });
    var cvs = {}, ch = Promise.resolve();
    Object.keys(pages).forEach(function (p) { ch = ch.then(function () { return pageCanvas(+p).then(function (cv) { cvs[p] = cv; }); }); });
    ch.then(function () {
      snapshot();
      var n = 0;
      list.forEach(function (h) {
        if (h.mark != null) { var m = E.marks[h.mark]; if (m) { m.text = sub(m.text); n += h.n; } return; }
        var l = h.line, col = colorsIn(cvs[h.page], h.page, l), txt = sub(l.str);
        coverLines(h.page, [l], col);
        if (txt.trim()) E.marks.push(newText(h.page, l, txt, col, null));
        n += h.n;
      });
      A.done(); E.sel = -1; refresh();
      A.toast(T(n === 1 ? 'Replaced once' : 'Replaced {n} times', { n: n }));
    }).catch(PDF.failMsg);
  }

  /* ---------- scanned pages: reading the words ---------- */
  function readPage(i) {
    if (!window.CVOcr) return;
    A.busy(T('Reading the words on this page… This can take a minute.'));
    var w = Math.min(2400, Math.round(E.info[i].w * 200 / 72));
    PT.renderPage(E.doc, i, w, 1, 0, { forms: true }).then(function (cv) {
      return window.CVOcr.read(cv, function (msg) { A.busy(msg); }).then(function (words) { return { cv: cv, words: words }; });
    }).then(function (r) {
      A.done();
      var sc = r.cv.width / E.info[i].w, ls = window.CVOcr.toLines(r.words, sc);
      ls.ocr = true; E.lines[i] = ls; delete E.paras[i];
      r.cv.width = r.cv.height = 1;
      refresh(i); hint();
      A.toast(ls.length ? T('Found {n} lines of text. Tap one to change it.', { n: ls.length }) : T('No words were found on this page.'), 4000);
    }).catch(function (e) { A.done(); PDF.failMsg(e); });
  }

  /* ---------- pictures ---------- */
  var imgInput = null;
  function pickImage() {
    if (!imgInput) {
      imgInput = document.createElement('input'); imgInput.type = 'file'; imgInput.accept = 'image/*'; imgInput.hidden = true;
      document.body.appendChild(imgInput);
      imgInput.addEventListener('change', function () { var f = imgInput.files && imgInput.files[0]; imgInput.value = ''; if (f) addImage(f); });
    }
    imgInput.click();
  }
  function addImage(file) {
    A.busy(T('Adding picture…'));
    PT.readBytes(file).then(function (bytes) { return PT.loadImage(bytes, file.type); }).then(function (im) {
      // smaller copy (at most 1600 pixels), PNG for pictures with see-through parts, otherwise JPEG
      var sc = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.max(1, Math.round(im.naturalWidth * sc)), h = Math.max(1, Math.round(im.naturalHeight * sc));
      var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      var g = cv.getContext('2d'); g.drawImage(im, 0, 0, w, h);
      var png = /png|gif|webp/i.test(file.type) && hasClear(g, w, h), src = png ? cv.toDataURL('image/png') : (g.globalCompositeOperation = 'destination-over', g.fillStyle = '#fff', g.fillRect(0, 0, w, h), cv.toDataURL('image/jpeg', 0.88));
      A.done();
      var i = curPage(), info = E.info[i], pw = Math.min(info.w * 0.45, w * 0.75), ph = pw * h / w;
      if (ph > info.h * 0.6) { ph = info.h * 0.6; pw = ph * w / h; }
      var pg = document.querySelector('#ed-pages .ed-page[data-i="' + i + '"]'), s = scaleOf(i), r = pg.getBoundingClientRect();
      var cy = (Math.max(r.top, 60) + Math.min(r.bottom, window.innerHeight - 140)) / 2 - r.top;
      snapshot();
      E.marks.push({ page: i, type: 'img', x: (info.w - pw) / 2, y: Math.max(0, Math.min(info.h - ph, cy / s - ph / 2)), w: pw, h: ph, src: src });
      E.sel = E.marks.length - 1; refresh(i);
    }).catch(function () { A.done(); A.toast(T('That picture could not be opened')); });
  }
  function hasClear(g, w, h) { try { var d = g.getImageData(0, 0, w, h).data; for (var k = 3; k < d.length; k += 16) if (d[k] < 250) return true; } catch (e) { /* ignore */ } return false; }

  /* ---------- pages ---------- */
  function pagesSheet() {
    var i = curPage(), n = E.info.length;
    var it = function (k, icon, label, off, sub) { return '<button class="sheet-item" data-pg="' + k + '"' + (off ? ' disabled' : '') + '>' + ic(icon) + '<span>' + T(label) + (sub ? '<small>' + sub + '</small>' : '') + '</span></button>'; };
    var sh = A.openSheet('<h3>' + T('Page {n} of {total}', { n: i + 1, total: n }) + '</h3>' +
      it('rr', 'rotate', 'Turn right') + it('rl', 'rotate', 'Turn left') + it('up', 'up', 'Move up', i === 0) + it('down', 'down', 'Move down', i === n - 1) +
      it('blank', 'plus', 'Add a blank page after it') + it('ins', 'addpage', 'Add pages from a PDF or photos', false, T('They go in after this page')) +
      it('pnum', 'pnum', 'Page numbers', false, E.pnum ? esc(PT.pnumText(E.pnum, E.pnum.skip ? 1 : 0, n)) : '') + it('del', 'trash', 'Delete this page', n < 2));
    var rl = sh.querySelector('[data-pg="rl"] .ico'); if (rl) rl.style.transform = 'scaleX(-1)';
    sh.onclick = function (e) {
      var b = e.target.closest('[data-pg]'); if (!b || b.disabled) return;
      var k = b.getAttribute('data-pg'); A.closeSheet();
      if (k === 'pnum') { pnumSheet(); return; }
      if (k === 'ins') { insertPages(i); return; }
      var op = k === 'rr' ? { kind: 'rotate', page: i, deg: 90 } : k === 'rl' ? { kind: 'rotate', page: i, deg: -90 } : k === 'up' ? { kind: 'move', page: i, to: i - 1 } :
        k === 'down' ? { kind: 'move', page: i, to: i + 1 } : k === 'blank' ? { kind: 'blank', page: i } : { kind: 'delete', page: i };
      if (op.kind === 'delete') A.confirmSheet(T('Delete this page?'), T('Page {n} will be taken out of the PDF.', { n: i + 1 }), T('Delete'), true).then(function (ok) { if (ok) pageOp(op); });
      else pageOp(op);
    };
  }
  function insertPages(i) {
    PDF.choose({ title: T('Add pages'), photos: true, multiple: true }).then(function (list) {
      A.busy(T('Adding pages…'));
      var imgs = list.filter(function (s) { return s.kind === 'image'; }), pdfs = list.filter(function (s) { return s.kind === 'pdf'; });
      var other = list.filter(function (s) { return s.kind !== 'image' && s.kind !== 'pdf'; });
      if (other.length) A.toast(T('Only PDFs and photos can be added. Skipped: {name}', { name: other.map(function (s) { return s.name; }).join(', ') }), 4500);
      var docs = [];
      var ch = Promise.all(pdfs.map(PDF.bytesOf)).then(function (bs) { docs = bs; });
      if (imgs.length) ch = ch.then(function () {
        return Promise.all(imgs.map(function (s) { return PT.photoJpg(s.bytes, s.mime).then(function (j) { return { bytes: j, fit: 'auto' }; }); }))
          .then(function (js) { return PT.imagesToPdf(js, 'Photos'); }).then(function (pdf) { docs.push(pdf); });
      });
      return ch.then(function () { A.done(); if (docs.length) pageOp({ kind: 'insert', page: i, docs: docs }); });
    }).catch(function (e) { if (e && e.message !== 'cancel') PDF.failMsg(e); });
  }
  function pnumSheet() {
    var pn = E.pnum || { pos: 'bc', fmt: 0, start: 1, skip: false }, n = E.info.length;
    var POS = [['bc', 'Bottom centre'], ['br', 'Bottom right'], ['bl', 'Bottom left'], ['tc', 'Top centre'], ['tr', 'Top right'], ['tl', 'Top left']];
    var sample = function (f) { return PT.pnumText({ fmt: f, start: 1 }, 0, Math.max(2, n)); };
    var sh = A.openSheet('<h3>' + T('Page numbers') + '</h3><div class="sheet-sec">' + T('Where') + '</div><div class="pn-pos">' +
      POS.map(function (p) { return '<button data-pp="' + p[0] + '" class="' + (pn.pos === p[0] ? 'on' : '') + '">' + T(p[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="sheet-sec">' + T('How they look') + '</div>' + [0, 1, 2, 3].map(function (f) { return '<button class="opt' + (pn.fmt === f ? ' on' : '') + '" data-pf="' + f + '"><span class="mk"></span><span class="ot">' + esc(sample(f)) + '</span></button>'; }).join('') +
      '<div class="inp-wrap pn-row"><label>' + T('Start at') + ' <input class="inp" id="pn-s" type="number" min="0" max="9999" value="' + (pn.start == null ? 1 : pn.start) + '" style="width:90px"></label>' +
      '<label><input type="checkbox" id="pn-k"' + (pn.skip ? ' checked' : '') + '> ' + T('Not on the first page') + '</label></div>' +
      '<div class="sheet-foot">' + (E.pnum ? '<button class="btn ghost" data-pn="off">' + T('Remove') + '</button>' : '<button class="btn ghost" data-pn="no">' + T('Cancel') + '</button>') + '<button class="btn" data-pn="ok">' + T('Done') + '</button></div>');
    sh.onclick = function (e) {
      var p = e.target.closest('[data-pp]'); if (p) { pn.pos = p.getAttribute('data-pp'); sh.querySelectorAll('[data-pp]').forEach(function (x) { x.classList.toggle('on', x === p); }); return; }
      var f = e.target.closest('[data-pf]'); if (f) { pn.fmt = +f.getAttribute('data-pf'); sh.querySelectorAll('[data-pf]').forEach(function (x) { x.classList.toggle('on', x === f); }); return; }
      var b = e.target.closest('[data-pn]'); if (!b) return;
      var a = b.getAttribute('data-pn');
      if (a === 'ok') { snapshot(); pn.start = Math.max(0, Math.min(9999, parseInt($('#pn-s').value, 10) || 0)); pn.skip = $('#pn-k').checked; E.pnum = pn; }
      if (a === 'off') { snapshot(); E.pnum = null; }
      A.closeSheet(); refresh();
    };
  }
  // the page moves; what was added stays where it is on its page (turning a page puts it into the PDF first)
  function remap(op, added) {
    var out = [];
    E.marks.forEach(function (m) {
      var p = m.page;
      if (op.kind === 'delete') { if (p === op.page) return; if (p > op.page) p--; }
      else if (op.kind === 'blank' || op.kind === 'insert') { if (p > op.page) p += added; }
      else if (op.kind === 'move') {
        if (p === op.page) p = op.to;
        else if (op.page < op.to && p > op.page && p <= op.to) p--;
        else if (op.page > op.to && p >= op.to && p < op.page) p++;
      }
      m.page = p; out.push(m);
    });
    E.marks = out;
  }
  function pageOp(op) {
    hideFtb(); A.busy(T('Working…'));
    var before = E.src, burn = op.kind === 'rotate' || !!E.src.pw, oldN = E.info.length, keep = state();
    PDF.bytesOf(E.src).then(function (bytes) {
      if (!burn || (!E.marks.length && !Object.keys(E.form).length && !E.src.pw)) return bytes;
      return PT.addMarks(bytes, E.marks, infoCopy(), { asc: ascMap(), password: E.src.pw, form: E.form, formMarks: formMarks() }).then(function (r) { return r.bytes; });
    }).then(function (bytes) { return PE.editPages(bytes, op, PDF.base(E.src.name)); }).then(function (out) {
      E.undo.push({ s: keep, src: before }); E.dirty = true;
      return reopen({ name: E.src.name, kind: 'pdf', bytes: out, pw: '' }).then(function () {
        if (burn) { E.marks = []; E.form = {}; } else remap(op, E.info.length - oldN);
        E.paged = true; A.done(); refresh();
        var show = op.kind === 'move' ? op.to : op.kind === 'blank' || op.kind === 'insert' ? op.page + 1 : Math.min(op.page, E.info.length - 1);
        var pg = document.querySelector('#ed-pages .ed-page[data-i="' + show + '"]'); if (pg) pg.scrollIntoView({ block: 'center' });
      });
    }).catch(function (e) { if (e && e.message === 'locked') { A.done(); A.toast(T('A PDF you chose is locked with a password. Remove the password first, then try again.'), 4500); return; } PDF.failMsg(e); });
  }
  function reopen(src) {
    return PDF.bytesOf(src).then(function (bytes) { return PT.open(bytes, src.pw); }).then(function (doc) {
      return PT.allPageInfo(doc).then(function (info) {
        if (E.doc) try { E.doc.destroy(); } catch (e) { /* ignore */ }
        E.src = src; E.doc = doc; E.info = info; E.lines = {}; E.paras = {}; E.fields = {}; E.cvs = {}; E.sel = -1;
        layout();
      });
    });
  }
  function infoCopy() { return E.info.map(function (p) { return { w: p.w, h: p.h, rotate: p.rotate, t: p.t.slice() }; }); }

  /* ---------- buttons ---------- */
  A.viewEl('pdfsign').addEventListener('click', function (e) {
    var t = e.target.closest('[data-et]'); if (t) { setTool(t.getAttribute('data-et')); return; }
    var o = e.target.closest('[data-ocr]'); if (o) { readPage(+o.getAttribute('data-ocr')); return; }
    var z = e.target.closest('[data-ez]');
    if (z) {
      var zs = [1, 1.5, 2], k = zs.indexOf(E.zoom) + (+z.getAttribute('data-ez'));
      if (k < 0 || k >= zs.length) return;
      E.zoom = zs[k]; E.sel = -1; hideFtb(); layout();
    }
  });

  /* ---------- save ---------- */
  function save() {
    if (!changed()) return;
    hideFtb();
    A.busy(T('Saving…'));
    var suffix = E.mode === 'sign' ? ' - signed.pdf' : ' - edited.pdf', base = null, target = E.target;
    var data = { v: 1, mode: E.mode, marks: E.marks, form: E.form, pnum: E.pnum };
    PDF.bytesOf(E.src).then(function (bytes) {
      base = bytes;
      if (!E.marks.length && !Object.keys(E.form).length && !E.pnum) return { bytes: bytes, flat: false, pictured: [] };
      return PT.addMarks(bytes, E.marks, infoCopy(), { asc: ascMap(), password: E.src.pw, title: PDF.base(E.src.name), form: E.form, formMarks: formMarks(), pnum: E.pnum });
    }).then(function (r) {
      var kept = target && PDF.Files.get(target.id) ? PDF.Files.replace(target, r.bytes, E.info.length) : PDF.Files.add(r.bytes, PDF.stem(E.src.name) + suffix, E.info.length);
      return kept.then(function (meta) {
        return (PDF.Files.setEdit ? PDF.Files.setEdit(meta, base, data).catch(function () {}) : Promise.resolve()).then(function () {
          A.done(); E.dirty = false;
          if (r.flat) A.toast(T('This PDF was locked, so its pages were saved as pictures.'), 4500);
          else if (r.pictured && r.pictured.length) A.toast(T(r.pictured.length === 1 ? 'Black-out: page {list} was saved as a picture, so nothing under the black box can be recovered.' : 'Black-out: pages {list} were saved as pictures, so nothing under the black boxes can be recovered.', { list: r.pictured.map(function (k) { return k + 1; }).join(', ') }), 6000);
          A.back(); PDF.resultSheet(meta, T(E.mode === 'sign' ? 'Your signed PDF is ready' : 'Your edited PDF is ready'));
        });
      });
    }).catch(PDF.failMsg);
  }
  window.addEventListener('resize', function () { if (S.stack[S.stack.length - 1] === 'pdfsign' && E.doc && !document.body.classList.contains('typing')) { hideFtb(); } });

  A.PDF.startSign = function (src) { startSign(src, 'sign'); };
  A.PDF.startEdit = function (src) { startSign(src, 'edit'); };
  A.PDF.editorState = function () { return E; }; // for tests
})();
