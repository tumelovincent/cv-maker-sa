/* Fill & sign: type on a PDF form, tick boxes, add the date, sign, draw, white-out.
   Marks are kept in points on the page as shown; pdfcore writes them into the PDF. */
(function () {
  'use strict';
  var A = window.App, PT = window.CVPdfTools, PDF = A.PDF;
  var $ = A.$, esc = A.esc, T = A.T, S = A.S, ic = PDF.ic;
  var COLORS = ['#1B3C8C', '#111111', '#C62828'];
  var SIGKEY = 'cvmaker.pdfsig.v1';
  var E = { src: null, doc: null, info: null, marks: [], undo: [], tool: null, sel: -1, zoom: 1, color: COLORS[0], dirty: false, sig: null, fmt: 0, job: 0, obs: null };

  function sigStore() { try { return JSON.parse(localStorage.getItem(SIGKEY) || '{}') || {}; } catch (e) { return {}; } }
  function setSig(kind, v) { var s = sigStore(); s[kind] = v; try { localStorage.setItem(SIGKEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }

  // where the text baseline sits inside a line (as a share of the font size), measured once
  var ASC = null;
  function asc() {
    if (ASC) return ASC;
    var d = document.createElement('div');
    d.style.cssText = 'position:absolute;left:-9999px;top:0;font:400 100px/1.15 "F-roboto";white-space:nowrap';
    d.innerHTML = '<span>Hxg</span><i style="display:inline-block;width:1px;height:0;vertical-align:baseline"></i>';
    document.body.appendChild(d);
    var v = (d.lastChild.getBoundingClientRect().top - d.getBoundingClientRect().top) / 100;
    d.remove();
    ASC = v > 0.5 && v < 1.3 ? v : 0.92;
    return ASC;
  }

  function startSign(src) {
    A.busy(T('Opening…'));
    if (document.fonts && document.fonts.load) document.fonts.load('400 16px "F-roboto"').catch(function () {});
    PDF.bytesOf(src).then(function (bytes) { return PDF.openDoc(bytes, src.name, src.pw); }).then(function (r) {
      return PT.allPageInfo(r.doc).then(function (info) {
        A.done();
        if (E.doc) try { E.doc.destroy(); } catch (e) { /* ignore */ }
        E.src = src; E.src.pw = r.pw; E.doc = r.doc; E.info = info; E.marks = []; E.undo = []; E.tool = null; E.sel = -1; E.zoom = 1; E.dirty = false; E.job++;
        A.go('pdfsign');
      });
    }).catch(function (e) { if (e.message !== 'cancel') PDF.failMsg(e); });
  }

  /* ---------- screen ---------- */
  var TOOLS = [['text', 'text', 'Text'], ['check', 'check', 'Tick'], ['cross', 'close', 'Cross'], ['date', 'cal', 'Date'], ['sign', 'sign', 'Signature'], ['draw', 'draw', 'Draw'], ['white', 'erase', 'White-out']];
  var HINTS = {
    '': 'Choose a tool, then tap on the page.', text: 'Tap where the text should go.', check: 'Tap each box to tick it.', cross: 'Tap where the cross should go.',
    date: 'Tap where the date should go.', sign: 'Tap where you want to sign.', draw: 'Draw with your finger. Choose Draw again to stop.', white: 'Tap to cover something with white.'
  };
  A.VIEWS.pdfsign = {
    title: function () { return T('Fill & sign'); },
    noMenu: true,
    actions: function () { return ''; },
    bar: function () {
      return '<button class="bar-icon" data-bar="undo"' + (E.undo.length ? '' : ' disabled') + ' aria-label="' + esc(T('Undo')) + '">' + ic('undo') + '</button>' +
        '<button class="bar-act gold" data-bar="save"' + (E.marks.length ? '' : ' disabled') + '>' + T('Save') + '</button>';
    },
    onBar: function (a) { if (a === 'undo') undo(); if (a === 'save') save(); },
    beforeBack: function () {
      hideFtb();
      if (!E.dirty) return false;
      A.confirmSheet(T('Leave without saving?'), T('What you added to the PDF will be lost.'), T('Leave'), true).then(function (ok) { if (ok) { E.dirty = false; A.back(); } });
      return true;
    },
    render: function (el) {
      if (!E.doc) { S.stack.pop(); A.render(); return; }
      el.innerHTML = '<div class="ed' + (E.tool === 'draw' ? ' drawing' : '') + '" id="ed"><div id="ed-pages"></div></div>' +
        '<div class="zoom" style="bottom:120px"><button data-ez="1">+</button><button data-ez="-1">&minus;</button></div>' +
        '<div class="etools"><div class="row1">' + TOOLS.map(function (t) { return '<button data-et="' + t[0] + '" class="' + (E.tool === t[0] ? 'on' : '') + '">' + ic(t[1]) + T(t[2]) + '</button>'; }).join('') + '</div>' +
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
    }).catch(function () { el.removeAttribute('data-done'); });
  }
  function markHTML(m, k, s) {
    var sel = k === E.sel ? ' sel' : '', st = 'left:' + (m.x * s).toFixed(1) + 'px;top:' + (m.y * s).toFixed(1) + 'px;';
    if (m.type === 'text') return '<div class="mk t' + sel + '" data-k="' + k + '" style="' + st + 'font-size:' + (m.size * s).toFixed(2) + 'px;color:' + m.color + '">' + esc(m.text) + '</div>';
    var wh = 'width:' + (m.w * s).toFixed(1) + 'px;height:' + (m.h * s).toFixed(1) + 'px;';
    if (m.type === 'img') return '<div class="mk' + sel + '" data-k="' + k + '" style="' + st + wh + '"><img src="' + m.src + '" alt=""><span class="rs"></span></div>';
    if (m.type === 'white') return '<div class="mk white' + sel + '" data-k="' + k + '" style="' + st + wh + '"><span class="rs"></span></div>';
    if (m.type === 'ink') {
      var b = inkBox(m), d = m.pts.map(function (p, j) { return (j ? 'L' : 'M') + ((p[0] - b.x) * s).toFixed(1) + ' ' + ((p[1] - b.y) * s).toFixed(1); }).join(' ');
      return '<div class="mk' + sel + '" data-k="' + k + '" style="left:' + (b.x * s).toFixed(1) + 'px;top:' + (b.y * s).toFixed(1) + 'px;width:' + Math.max(8, b.w * s).toFixed(1) + 'px;height:' + Math.max(8, b.h * s).toFixed(1) + 'px">' +
        '<svg><path d="' + d + '" fill="none" stroke="' + m.color + '" stroke-width="' + ((m.lw || 1.6) * s).toFixed(2) + '" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    }
    var path = m.type === 'check' ? 'M10 55 L38 84 L92 14' : 'M14 14 L86 86 M86 14 L14 86';
    return '<div class="mk' + sel + '" data-k="' + k + '" style="' + st + wh + '"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + path + '" fill="none" stroke="' + m.color + '" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" vector-effect="none"/></svg><span class="rs"></span></div>';
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
    E.marks.forEach(function (m, k) { if (m.page === i) h += markHTML(m, k, s); });
    layer.innerHTML = h;
  }
  function refresh(page) {
    if (page == null) for (var i = 0; i < E.info.length; i++) paintMarks(i); else paintMarks(page);
    PDF.refreshBar(); showFtb();
  }
  function snapshot() { E.undo.push(JSON.stringify(E.marks)); if (E.undo.length > 60) E.undo.shift(); E.dirty = true; }
  function undo() { if (!E.undo.length) return; E.marks = JSON.parse(E.undo.pop()); E.sel = -1; E.dirty = true; refresh(); }
  function setTool(t) {
    E.tool = E.tool === t ? null : t; E.sel = -1;
    var ed = $('#ed'); if (ed) ed.classList.toggle('drawing', E.tool === 'draw');
    Array.prototype.forEach.call(document.querySelectorAll('.etools [data-et]'), function (b) { b.classList.toggle('on', b.getAttribute('data-et') === E.tool); });
    var h = $('#ed-hint'); if (h) h.textContent = T(HINTS[E.tool || '']);
    refresh();
    if (E.tool === 'sign') chooseSig(function (ok) { if (!ok) setTool('sign'); });
    if (E.tool === 'date') chooseDate();
  }

  /* ---------- placing and moving ---------- */
  function today(fmt) {
    var d = new Date(), dd = ('0' + d.getDate()).slice(-2), mm = ('0' + (d.getMonth() + 1)).slice(-2);
    if (fmt === 1) return d.getDate() + ' ' + A.MONTHS[d.getMonth()] + ' ' + d.getFullYear();
    if (fmt === 2) return d.getFullYear() + '-' + mm + '-' + dd;
    return dd + '/' + mm + '/' + d.getFullYear();
  }
  function place(i, x, y) {
    var m = null, info = E.info[i];
    if (E.tool === 'text') { askText('', function (txt) { snapshot(); E.marks.push({ page: i, type: 'text', x: x, y: y - 11 * 0.6, size: 11, color: E.color, text: txt }); E.sel = E.marks.length - 1; refresh(i); }); return; }
    if (E.tool === 'date') m = { page: i, type: 'text', x: x, y: y - 11 * 0.6, size: 11, color: E.color, text: today(E.fmt) };
    if (E.tool === 'check' || E.tool === 'cross') m = { page: i, type: E.tool, x: x - 7, y: y - 7, w: 14, h: 14, color: E.color };
    if (E.tool === 'white') m = { page: i, type: 'white', x: x - 55, y: y - 9, w: 110, h: 18 };
    if (E.tool === 'sign') {
      if (!E.sig) { chooseSig(); return; }
      var w = Math.min(130, info.w * 0.3), h = w / (E.sig.ar || 3);
      m = { page: i, type: 'img', x: x - w / 2, y: y - h / 2, w: w, h: h, src: E.sig.src };
    }
    if (!m) return;
    m.x = Math.max(0, Math.min(info.w - 4, m.x)); m.y = Math.max(0, Math.min(info.h - 4, m.y));
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
  function showFtb() {
    hideFtb();
    if (E.sel < 0 || S.stack[S.stack.length - 1] !== 'pdfsign') return;
    var m = E.marks[E.sel], el = document.querySelector('.mk[data-k="' + E.sel + '"]'); if (!m || !el) return;
    var b = [];
    if (m.type === 'text') b.push(['smaller', 'A−'], ['bigger', 'A+']);
    if (m.type === 'check' || m.type === 'cross') b.push(['smaller', '−'], ['bigger', '+']);
    if (m.type !== 'white' && m.type !== 'img') b.push(['color', '<i class="dot" style="background:' + m.color + '"></i>']);
    if (m.type === 'text') b.push(['edit', T('Edit')]);
    b.push(['del', T('Delete')]);
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
    snapshot();
    if (a === 'color') { m.color = COLORS[(COLORS.indexOf(m.color) + 1) % COLORS.length]; E.color = m.color; }
    var f = a === 'bigger' ? 1.15 : (a === 'smaller' ? 1 / 1.15 : 1);
    if (m.type === 'text') m.size = Math.max(5, Math.min(48, m.size * f));
    if (m.type === 'check' || m.type === 'cross') { var c = [m.x + m.w / 2, m.y + m.h / 2]; m.w = m.h = Math.max(6, Math.min(60, m.w * f)); m.x = c[0] - m.w / 2; m.y = c[1] - m.h / 2; }
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
  function askText(value, done) {
    var ans = cvAnswers();
    var sh = A.openSheet('<h3>' + T('Text') + '</h3><div class="inp-wrap"><textarea class="inp" id="ed-txt" rows="2" autocomplete="off">' + esc(value || '') + '</textarea></div>' +
      (ans.length ? '<div class="sheet-sec">' + T('From my CV') + '</div><div class="inp-wrap"><div class="chips" style="margin:0;padding:0;flex-wrap:wrap">' + ans.map(function (a, i) { return '<button class="chip" data-ans="' + i + '" style="margin-bottom:6px">' + esc(T(a[0])) + '</button>'; }).join('') + '</div></div>' : '') +
      '<div class="sheet-foot"><button class="btn ghost" data-tx="no">' + T('Cancel') + '</button><button class="btn" data-tx="ok">' + T('Done') + '</button></div>');
    var ta = $('#ed-txt'); setTimeout(function () { ta.focus(); }, 250);
    sh.onclick = function (e) {
      var c = e.target.closest('[data-ans]'); if (c) { ta.value = ans[+c.getAttribute('data-ans')][1]; ta.focus(); return; }
      var b = e.target.closest('[data-tx]'); if (!b) return;
      var v = ta.value.replace(/\s+$/, ''); A.closeSheet();
      if (b.getAttribute('data-tx') === 'ok' && v) done(v);
    };
  }
  function chooseDate() {
    var sh = A.openSheet('<h3>' + T('Date') + '</h3>' + [0, 1, 2].map(function (f) { return '<button class="opt' + (E.fmt === f ? ' on' : '') + '" data-df="' + f + '"><span class="mk"></span><span class="ot">' + esc(today(f)) + '</span></button>'; }).join('') + '<div style="height:12px"></div>');
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
    var sh = A.openSheet(h), picked = false;
    sh.onclick = function (e) {
      var g = e.target.closest('[data-sg]');
      if (g) { var src = list[+g.getAttribute('data-sg')][1]; picked = true; A.closeSheet(); imgAspect(src, function (ar) { E.sig = { src: src, ar: ar }; if (after) after(true); }); return; }
      var n = e.target.closest('[data-sn]'); if (!n) return;
      var kind = n.getAttribute('data-sn'); picked = true;
      A.signPad(kind === 'ini' ? 'initials' : 'signature', function (v) {
        if (!v) { if (after) after(false); return; }
        imgAspect(v, function (ar) { E.sig = { src: v, ar: ar }; if (after) after(true); });
      }, { get: function () { return sigStore()[kind]; }, set: function (v) { setSig(kind, v); }, text: T('Sign with your finger in the box. It is kept on this phone for your PDFs.') });
    };
  }

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
    if (!E.marks.length) return;
    hideFtb();
    A.busy(T('Saving…'));
    var info = E.info.map(function (p) { return { w: p.w, h: p.h, rotate: p.rotate, t: p.t.slice() }; });
    PDF.bytesOf(E.src).then(function (bytes) { return PT.addMarks(bytes, E.marks, info, { asc: asc(), password: E.src.pw, title: PDF.base(E.src.name) }); })
      .then(function (r) {
        return PDF.Files.add(r.bytes, PDF.stem(E.src.name) + ' - signed.pdf', E.info.length).then(function (meta) {
          A.done(); E.dirty = false;
          if (r.flat) A.toast(T('This PDF was locked, so its pages were saved as pictures.'), 4500);
          A.back(); PDF.resultSheet(meta, T('Your signed PDF is ready'));
        });
      }).catch(PDF.failMsg);
  }
  window.addEventListener('resize', function () { if (S.stack[S.stack.length - 1] === 'pdfsign' && E.doc && !document.body.classList.contains('typing')) { hideFtb(); } });

  A.PDF.startSign = startSign;
})();
