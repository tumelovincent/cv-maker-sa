/* Edit PDF (and Fill & sign, the same screen): change the text that is already in a PDF, add text, pictures,
   drawings, highlights, boxes, lines and arrows, white-out, ticks, dates and a signature, and rotate, move,
   add or delete pages. Marks are kept in points on the page as shown; pdfcore and pdfedit write them into the PDF. */
(function () {
  'use strict';
  var A = window.App, PT = window.CVPdfTools, PDF = A.PDF, PE = window.CVPdfEdit;
  var $ = A.$, esc = A.esc, T = A.T, S = A.S, ic = PDF.ic;
  var COLORS = ['#111111', '#1B3C8C', '#C62828', '#1E7A4C', '#E65100', '#FFFFFF'];
  var HL = ['#FFE14D', '#8BEA7B', '#FF9EC4', '#8FD3FF'];
  var FONTS = { roboto: 'Sans', carlito: 'Calibri', caladea: 'Serif' }, FONT_ORDER = ['roboto', 'carlito', 'caladea'];
  var SIGKEY = 'cvmaker.pdfsig.v1';
  var E = { mode: 'edit', src: null, doc: null, info: null, marks: [], undo: [], tool: null, sel: -1, zoom: 1, color: COLORS[1], dirty: false, sig: null, fmt: 0, job: 0, obs: null, lines: {} };

  function sigStore() { try { return JSON.parse(localStorage.getItem(SIGKEY) || '{}') || {}; } catch (e) { return {}; } }
  function setSig(kind, v) { var s = sigStore(); s[kind] = v; try { localStorage.setItem(SIGKEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }

  // where the text baseline sits inside a line (as a share of the font size), measured once per font
  var ASC = {};
  function asc(font) {
    font = FONTS[font] ? font : 'roboto';
    if (ASC[font]) return ASC[font];
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:-9999px;top:0;font:400 100px/1.15 "F-' + font + '";white-space:nowrap';
    d.innerHTML = '<span>Hxg</span><i style="display:inline-block;width:1px;height:0;vertical-align:baseline"></i>';
    document.body.appendChild(d);
    var v = (d.lastChild.getBoundingClientRect().top - d.getBoundingClientRect().top) / 100;
    d.remove();
    return (ASC[font] = v > 0.5 && v < 1.3 ? v : 0.92);
  }
  function ascMap() { var o = {}; FONT_ORDER.forEach(function (f) { o[f] = asc(f); }); return o; }

  // mode: 'edit' (Edit PDF) or 'sign' (Fill & sign) - the same tools, in a different order
  function startSign(src, mode) {
    A.busy(T('Opening…'));
    if (document.fonts && document.fonts.load) FONT_ORDER.forEach(function (f) { document.fonts.load('400 16px "F-' + f + '"').catch(function () {}); });
    PDF.bytesOf(src).then(function (bytes) { return PDF.openDoc(bytes, src.name, src.pw); }).then(function (r) {
      return PT.allPageInfo(r.doc).then(function (info) {
        A.done();
        if (E.doc) try { E.doc.destroy(); } catch (e) { /* ignore */ }
        E.mode = mode === 'sign' ? 'sign' : 'edit';
        E.src = src; E.src.pw = r.pw; E.doc = r.doc; E.info = info; E.marks = []; E.undo = []; E.tool = null; E.sel = -1; E.zoom = 1; E.dirty = false; E.paged = false; E.lines = {}; E.job++;
        E.color = E.mode === 'sign' ? COLORS[1] : COLORS[0];
        A.go('pdfsign');
      });
    }).catch(function (e) { if (e.message !== 'cancel') PDF.failMsg(e); });
  }

  /* ---------- screen ---------- */
  var TOOL = {
    edittext: ['edtext', 'Edit text'], text: ['text', 'Add text'], image: ['photos', 'Picture'], draw: ['draw', 'Draw'], hl: ['hl', 'Highlight'],
    white: ['erase', 'White-out'], rect: ['rect', 'Box'], line: ['line', 'Line'], sign: ['sign', 'Signature'], check: ['check', 'Tick'],
    cross: ['close', 'Cross'], date: ['cal', 'Date'], pages: ['grid', 'Pages']
  };
  var ORDER = {
    edit: ['edittext', 'text', 'image', 'draw', 'hl', 'white', 'rect', 'line', 'sign', 'check', 'cross', 'date', 'pages'],
    sign: ['text', 'check', 'cross', 'date', 'sign', 'draw', 'white', 'edittext', 'image', 'hl', 'rect', 'line', 'pages']
  };
  var HINTS = {
    '': 'Choose a tool, then tap on the page.', edittext: 'Tap the text you want to change.', text: 'Tap where the text should go.',
    check: 'Tap each box to tick it.', cross: 'Tap where the cross should go.', date: 'Tap where the date should go.', sign: 'Tap where you want to sign.',
    draw: 'Draw with your finger. Choose Draw again to stop.', white: 'Tap text to remove it, or tap anywhere to cover with white.',
    hl: 'Tap a line of text to highlight it.', rect: 'Tap where the box should go.', line: 'Tap where the line should go.'
  };
  var NEEDS_LINES = { edittext: 1, hl: 1, white: 1 };
  A.VIEWS.pdfsign = {
    title: function () { return T(E.mode === 'sign' ? 'Fill & sign' : 'Edit PDF'); },
    noMenu: true,
    actions: function () { return ''; },
    bar: function () {
      return '<button class="bar-icon" data-bar="undo"' + (E.undo.length ? '' : ' disabled') + ' aria-label="' + esc(T('Undo')) + '">' + ic('undo') + '</button>' +
        '<button class="bar-act gold" data-bar="save"' + (E.marks.length || E.paged ? '' : ' disabled') + '>' + T('Save') + '</button>';
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
        '<div class="hint2" id="ed-hint">' + T(HINTS[E.tool || '']) + '</div></div>';
      layout();
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
    PT.renderPage(E.doc, i, el.clientWidth, Math.min(2, window.devicePixelRatio || 1)).then(function (cv) {
      if (job !== E.job || !el.isConnected) return;
      el.insertBefore(cv, el.firstChild);
      if (NEEDS_LINES[E.tool]) ensureLines(i);
    }).catch(function () { el.removeAttribute('data-done'); });
  }

  /* ---------- the text already on the page ---------- */
  // loaded after the page is drawn, so the real font names are known
  function ensureLines(i) {
    if (E.lines[i] || !E.doc) return;
    E.lines[i] = 'loading';
    var doc = E.doc;
    doc.getPage(i + 1).then(function (page) { return PE.lines(page, E.info[i].t); }).then(function (ls) {
      if (doc !== E.doc) return;
      E.lines[i] = ls; if (NEEDS_LINES[E.tool]) { paintMarks(i); noTextHint(); }
    }).catch(function () { if (doc === E.doc) E.lines[i] = []; });
  }
  function lineAt(i, x, y) {
    var ls = E.lines[i]; if (!Array.isArray(ls)) return null;
    var best = null;
    ls.forEach(function (l) {
      if (x >= l.x - 2 && x <= l.x + l.w + 2 && y >= l.y - 2 && y <= l.y + l.h + 2 && (!best || l.h < best.h)) best = l;
    });
    return best;
  }
  function noTextHint() {
    var h = $('#ed-hint'); if (!h || E.tool !== 'edittext') return;
    var c = curPage(), ls = E.lines[c];
    h.textContent = Array.isArray(ls) && !ls.length ? T('This page has no text that can be changed (it may be a scan). Use White-out and Add text instead.') : T(HINTS.edittext);
  }
  // the colours under a line of text: the background around it, and the text itself
  function colorsAt(i, l) {
    var out = { bg: '#ffffff', fg: '#111111' };
    var pg = document.querySelector('#ed-pages .ed-page[data-i="' + i + '"] canvas'); if (!pg) return out;
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
  function hex(c) { return '#' + c.map(function (v) { var h = Math.max(0, Math.min(255, Math.round(v))).toString(16); return h.length < 2 ? '0' + h : h; }).join(''); }
  function editLine(i, l) {
    askText(l.str, function (txt) {
      snapshot();
      var col = colorsAt(i, l), pad = l.size * 0.08, key = i + ':' + l.i;
      E.marks.push({ page: i, type: 'white', x: l.x - pad, y: l.y - pad, w: l.w + 2 * pad, h: l.h + 2 * pad, fill: col.bg,
        eb: [l.x, l.base - l.size * 0.35, l.w, l.size * 0.7], key: key });
      if (txt) E.marks.push({ page: i, type: 'text', x: l.x, y: l.base - l.size * asc(l.font), size: l.size, color: col.fg, text: txt, font: l.font, bold: l.bold, key: key });
      E.sel = txt ? E.marks.length - 1 : -1;
      refresh(i);
    }, { title: T('Change text'), empty: true, note: T('Leave it empty to remove the text.') });
  }

  /* ---------- marks on the screen ---------- */
  function markHTML(m, k, s) {
    var sel = k === E.sel ? ' sel' : '', st = 'left:' + (m.x * s).toFixed(1) + 'px;top:' + (m.y * s).toFixed(1) + 'px;';
    if (m.type === 'text') {
      return '<div class="mk t f-' + (FONTS[m.font] ? m.font : 'roboto') + sel + '" data-k="' + k + '" style="' + st + 'font-size:' + (m.size * s).toFixed(2) + 'px;color:' + m.color +
        (m.bold ? ';font-weight:700' : '') + '">' + esc(m.text) + '</div>';
    }
    var wh = 'width:' + (m.w * s).toFixed(1) + 'px;height:' + (m.h * s).toFixed(1) + 'px;';
    if (m.type === 'img') return '<div class="mk' + sel + '" data-k="' + k + '" style="' + st + wh + '"><img src="' + m.src + '" alt=""><span class="rs"></span></div>';
    if (m.type === 'white') return '<div class="mk white' + sel + '" data-k="' + k + '" style="' + st + wh + (m.fill ? 'background:' + m.fill + ';' : '') + '"><span class="rs"></span></div>';
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
  function paintMarks(i) {
    var layer = document.querySelector('#ed-pages .ed-layer[data-i="' + i + '"]'); if (!layer) return;
    var s = scaleOf(i), h = '';
    // dotted outlines on the lines of text that can be changed or highlighted
    if (NEEDS_LINES[E.tool] && Array.isArray(E.lines[i])) {
      var done = {};
      E.marks.forEach(function (m) { if (m.key && m.page === i) done[m.key] = 1; });
      E.lines[i].forEach(function (l) {
        if (done[i + ':' + l.i]) return;
        h += '<div class="txh" style="left:' + (l.x * s - 2).toFixed(1) + 'px;top:' + (l.y * s - 1).toFixed(1) + 'px;width:' + (l.w * s + 4).toFixed(1) + 'px;height:' + (l.h * s + 2).toFixed(1) + 'px"></div>';
      });
    }
    E.marks.forEach(function (m, k) { if (m.page === i) h += markHTML(m, k, s); });
    layer.innerHTML = h;
  }
  function refresh(page) {
    if (page == null) for (var i = 0; i < E.info.length; i++) paintMarks(i); else paintMarks(page);
    PDF.refreshBar(); showFtb();
  }
  // undo keeps the marks, and after a page change also the PDF as it was before
  function snapshot(src) {
    E.undo.push({ m: JSON.stringify(E.marks), src: src || null });
    if (E.undo.length > 60) E.undo.shift();
    var withSrc = E.undo.filter(function (u) { return u.src; }).length;
    while (withSrc > 4) { var u = E.undo.shift(); if (u.src) withSrc--; }
    E.dirty = true;
  }
  function undo() {
    if (!E.undo.length) return;
    var u = E.undo.pop();
    E.sel = -1; E.dirty = true; hideFtb();
    if (u.src) { reopen(u.src).then(function () { E.marks = JSON.parse(u.m); refresh(); }); return; }
    E.marks = JSON.parse(u.m); refresh();
  }
  function setTool(t) {
    if (t === 'image') { pickImage(); return; }
    if (t === 'pages') { pagesSheet(); return; }
    E.tool = E.tool === t ? null : t; E.sel = -1;
    var ed = $('#ed'); if (ed) ed.classList.toggle('drawing', E.tool === 'draw');
    Array.prototype.forEach.call(document.querySelectorAll('.etools [data-et]'), function (b) { b.classList.toggle('on', b.getAttribute('data-et') === E.tool); });
    var h = $('#ed-hint'); if (h) h.textContent = T(HINTS[E.tool || '']);
    if (NEEDS_LINES[E.tool]) {
      Array.prototype.forEach.call(document.querySelectorAll('#ed-pages .ed-page'), function (el) { if (el.querySelector('canvas')) ensureLines(+el.getAttribute('data-i')); });
      noTextHint();
    }
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

  /* ---------- placing and moving ---------- */
  function today(fmt) {
    var d = new Date(), dd = ('0' + d.getDate()).slice(-2), mm = ('0' + (d.getMonth() + 1)).slice(-2);
    if (fmt === 1) return d.getDate() + ' ' + A.MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    if (fmt === 2) return d.getFullYear() + '-' + mm + '-' + dd;
    return dd + '/' + mm + '/' + d.getFullYear();
  }
  function place(i, x, y) {
    var m = null, info = E.info[i], ln;
    if (E.tool === 'edittext') { ln = lineAt(i, x, y); if (ln) editLine(i, ln); else A.toast(T('Tap on a line of text.')); return; }
    if (E.tool === 'text') { askText('', function (txt) { snapshot(); E.marks.push({ page: i, type: 'text', x: x, y: y - 11 * 0.6, size: 11, color: E.color, text: txt, font: 'roboto' }); E.sel = E.marks.length - 1; refresh(i); }); return; }
    if (E.tool === 'date') m = { page: i, type: 'text', x: x, y: y - 11 * 0.6, size: 11, color: E.color, text: today(E.fmt), font: 'roboto' };
    if (E.tool === 'check' || E.tool === 'cross') m = { page: i, type: E.tool, x: x - 7, y: y - 7, w: 14, h: 14, color: E.color };
    if (E.tool === 'white') {
      ln = lineAt(i, x, y);
      if (ln) { // white-out on a line of text takes the text out of the PDF too
        var col = colorsAt(i, ln), pad = ln.size * 0.08;
        m = { page: i, type: 'white', x: ln.x - pad, y: ln.y - pad, w: ln.w + 2 * pad, h: ln.h + 2 * pad, fill: col.bg, eb: [ln.x, ln.base - ln.size * 0.35, ln.w, ln.size * 0.7], key: i + ':' + ln.i };
      } else m = { page: i, type: 'white', x: x - 55, y: y - 9, w: 110, h: 18 };
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
      if (E.sel !== k) { E.sel = k; refresh(i); }
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
      if (E.sel >= 0 && !E.tool) { E.sel = -1; refresh(); return; }
      if (E.sel >= 0) { E.sel = -1; refresh(); }
      if (E.tool && E.tool !== 'draw') place(g.page, g.start[0], g.start[1]);
      return;
    }
    if (g.moved) refresh(g.page); else showFtb();
  }
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);

  /* ---------- the small toolbar above a selected mark ---------- */
  function hideFtb() { var f = $('#ftb'); if (f) f.remove(); }
  function showFtb(palette) {
    hideFtb();
    if (E.sel < 0 || S.stack[S.stack.length - 1] !== 'pdfsign') return;
    var m = E.marks[E.sel], el = document.querySelector('.mk[data-k="' + E.sel + '"]'); if (!m || !el) return;
    var b = [];
    if (palette) {
      (m.type === 'hl' ? HL : COLORS).forEach(function (c) { b.push(['c:' + c, '<i class="dot' + (c === m.color ? ' on' : '') + '" style="background:' + c + '"></i>']); });
    } else {
      if (m.type === 'text') b.push(['smaller', 'A−'], ['bigger', 'A+'], ['bold', '<b>B</b>'], ['font', esc(T(FONTS[m.font] || 'Sans'))]);
      if (m.type === 'check' || m.type === 'cross' || m.type === 'ink' || m.type === 'rect' || m.type === 'line') b.push(['smaller', '−'], ['bigger', '+']);
      if (m.type === 'line') b.push(['arrow', T(m.arrow ? 'Line' : 'Arrow')]);
      if (m.type !== 'white' && m.type !== 'img') b.push(['color', '<i class="dot" style="background:' + m.color + '"></i>']);
      if (m.type === 'text') b.push(['edit', T('Edit')]);
      b.push(['del', T('Delete')]);
    }
    var f = document.createElement('div'); f.className = 'ftb'; f.id = 'ftb';
    f.innerHTML = b.map(function (x) { return '<button data-fa="' + x[0] + '">' + x[1] + '</button>'; }).join('');
    document.body.appendChild(f);
    var r = el.getBoundingClientRect(), fw = f.offsetWidth, fh = f.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - fw - 8, r.left + r.width / 2 - fw / 2)), topY = r.top - fh - 14;
    if (topY < 64) topY = r.bottom + 16;
    f.style.left = left + 'px'; f.style.top = topY + 'px';
  }
  window.addEventListener('scroll', function () { if (S.stack[S.stack.length - 1] === 'pdfsign' && $('#ftb')) showFtb(); }, { passive: true });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#ftb [data-fa]'); if (!b) return;
    var a = b.getAttribute('data-fa'), m = E.marks[E.sel]; if (!m) return;
    if (a === 'del') { snapshot(); E.marks.splice(E.sel, 1); E.sel = -1; refresh(); return; }
    if (a === 'edit') { askText(m.text, function (txt) { snapshot(); m.text = txt; refresh(m.page); }); return; }
    if (a === 'color') { showFtb(true); return; }
    snapshot();
    if (a.indexOf('c:') === 0) { m.color = a.slice(2); if (m.type !== 'hl') E.color = m.color; }
    if (a === 'bold') m.bold = !m.bold;
    if (a === 'font') m.font = FONT_ORDER[(FONT_ORDER.indexOf(m.font || 'roboto') + 1) % FONT_ORDER.length];
    if (a === 'arrow') m.arrow = !m.arrow;
    var f = a === 'bigger' ? 1.15 : (a === 'smaller' ? 1 / 1.15 : 1);
    if (m.type === 'text') m.size = Math.max(4, Math.min(72, m.size * f));
    if (m.type === 'check' || m.type === 'cross') { var c = [m.x + m.w / 2, m.y + m.h / 2]; m.w = m.h = Math.max(6, Math.min(60, m.w * f)); m.x = c[0] - m.w / 2; m.y = c[1] - m.h / 2; }
    if (m.type === 'ink' || m.type === 'rect' || m.type === 'line') m.lw = Math.max(0.5, Math.min(12, (m.lw || 1.5) * (f === 1 ? 1 : (f > 1 ? 1.35 : 1 / 1.35))));
    refresh(m.page);
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
  // opts: { title, empty (an empty answer is allowed), note }
  function askText(value, done, opts) {
    opts = opts || {};
    var ans = cvAnswers();
    var sh = A.openSheet('<h3>' + esc(opts.title || T('Text')) + '</h3><div class="inp-wrap"><textarea class="inp" id="ed-txt" rows="2" autocomplete="off">' + esc(value || '') + '</textarea>' +
      (opts.note ? '<div class="hint">' + esc(opts.note) + '</div>' : '') + '</div>' +
      (ans.length ? '<div class="sheet-sec">' + T('From my CV') + '</div><div class="inp-wrap"><div class="achips" style="margin:0;padding:0;flex-wrap:wrap">' + ans.map(function (a, i) { return '<button class="achip" data-ans="' + i + '">' + esc(T(a[0])) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div class="sheet-foot"><button class="btn ghost" data-tx="no">' + T('Cancel') + '</button><button class="btn" data-tx="ok">' + T('Done') + '</button></div>');
    var ta = $('#ed-txt'); setTimeout(function () { ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) { /* ignore */ } }, 250);
    sh.onclick = function (e) {
      var c = e.target.closest('[data-ans]'); if (c) { ta.value = ans[+c.getAttribute('data-ans')][1]; ta.focus(); return; }
      var b = e.target.closest('[data-tx]'); if (!b) return;
      var v = ta.value.replace(/\s+$/, ''); A.closeSheet();
      if (b.getAttribute('data-tx') === 'ok' && (v || opts.empty)) done(v);
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
    var it = function (k, icon, label, off) { return '<button class="sheet-item" data-pg="' + k + '"' + (off ? ' disabled' : '') + '>' + ic(icon) + '<span>' + T(label) + '</span></button>'; };
    var sh = A.openSheet('<h3>' + T('Page {n} of {total}', { n: i + 1, total: n }) + '</h3>' +
      it('rr', 'rotate', 'Turn right') + it('rl', 'rotate', 'Turn left') + it('up', 'up', 'Move up', i === 0) + it('down', 'down', 'Move down', i === n - 1) +
      it('blank', 'plus', 'Add a blank page after it') + it('del', 'trash', 'Delete this page', n < 2));
    var rl = sh.querySelector('[data-pg="rl"] .ico'); if (rl) rl.style.transform = 'scaleX(-1)';
    sh.onclick = function (e) {
      var b = e.target.closest('[data-pg]'); if (!b || b.disabled) return;
      var k = b.getAttribute('data-pg'); A.closeSheet();
      var op = k === 'rr' ? { kind: 'rotate', page: i, deg: 90 } : k === 'rl' ? { kind: 'rotate', page: i, deg: -90 } : k === 'up' ? { kind: 'move', page: i, to: i - 1 } :
        k === 'down' ? { kind: 'move', page: i, to: i + 1 } : k === 'blank' ? { kind: 'blank', page: i } : { kind: 'delete', page: i };
      if (op.kind === 'delete') A.confirmSheet(T('Delete this page?'), T('Page {n} will be taken out of the PDF.', { n: i + 1 }), T('Delete'), true).then(function (ok) { if (ok) pageOp(op); });
      else pageOp(op);
    };
  }
  // what is on the pages so far goes into the PDF first, then the page is changed; undo brings both back
  function pageOp(op) {
    hideFtb(); A.busy(T('Working…'));
    var before = E.src;
    PDF.bytesOf(E.src).then(function (bytes) {
      if (!E.marks.length && !E.src.pw) return bytes;
      return PT.addMarks(bytes, E.marks, infoCopy(), { asc: ascMap(), password: E.src.pw }).then(function (r) { return r.bytes; });
    }).then(function (bytes) { return PE.editPages(bytes, op, PDF.base(E.src.name)); }).then(function (out) {
      snapshot(before);
      return reopen({ name: E.src.name, kind: 'pdf', bytes: out, pw: '' }).then(function () {
        E.marks = []; E.paged = true; A.done(); refresh();
        var show = op.kind === 'move' ? op.to : op.kind === 'blank' ? op.page + 1 : Math.min(op.page, E.info.length - 1);
        var pg = document.querySelector('#ed-pages .ed-page[data-i="' + show + '"]'); if (pg) pg.scrollIntoView({ block: 'center' });
      });
    }).catch(PDF.failMsg);
  }
  function reopen(src) {
    return PDF.bytesOf(src).then(function (bytes) { return PT.open(bytes, src.pw); }).then(function (doc) {
      return PT.allPageInfo(doc).then(function (info) {
        if (E.doc) try { E.doc.destroy(); } catch (e) { /* ignore */ }
        E.src = src; E.doc = doc; E.info = info; E.lines = {}; E.sel = -1;
        layout();
      });
    });
  }
  function infoCopy() { return E.info.map(function (p) { return { w: p.w, h: p.h, rotate: p.rotate, t: p.t.slice() }; }); }

  /* ---------- buttons ---------- */
  A.viewEl('pdfsign').addEventListener('click', function (e) {
    var t = e.target.closest('[data-et]'); if (t) { setTool(t.getAttribute('data-et')); return; }
    var z = e.target.closest('[data-ez]');
    if (z) {
      var zs = [1, 1.5, 2], k = zs.indexOf(E.zoom) + (+z.getAttribute('data-ez'));
      if (k < 0 || k >= zs.length) return;
      E.zoom = zs[k]; E.sel = -1; hideFtb(); layout();
    }
  });

  /* ---------- save ---------- */
  function save() {
    if (!E.marks.length && !E.paged) return;
    hideFtb();
    A.busy(T('Saving…'));
    var suffix = E.mode === 'sign' ? ' - signed.pdf' : ' - edited.pdf';
    PDF.bytesOf(E.src).then(function (bytes) {
      if (!E.marks.length) return { bytes: bytes, flat: false };
      return PT.addMarks(bytes, E.marks, infoCopy(), { asc: ascMap(), password: E.src.pw, title: PDF.base(E.src.name) });
    }).then(function (r) {
      return PDF.Files.add(r.bytes, PDF.stem(E.src.name) + suffix, E.info.length).then(function (meta) {
        A.done(); E.dirty = false;
        if (r.flat) A.toast(T('This PDF was locked, so its pages were saved as pictures.'), 4500);
        A.back(); PDF.resultSheet(meta, T(E.mode === 'sign' ? 'Your signed PDF is ready' : 'Your edited PDF is ready'));
      });
    }).catch(PDF.failMsg);
  }
  window.addEventListener('resize', function () { if (S.stack[S.stack.length - 1] === 'pdfsign' && E.doc && !document.body.classList.contains('typing')) { hideFtb(); } });

  A.PDF.startSign = function (src) { startSign(src, 'sign'); };
  A.PDF.startEdit = function (src) { startSign(src, 'edit'); };
})();
