/* CV Maker SA - app screens */
(function () {
  'use strict';
  var D = window.CVData, TP = window.CVTemplates, PG = window.CVPaginate;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = TP.esc;
  var NATIVE = window.AndroidBridge || null;

  var ICON = {
    plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    up: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
    down: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z',
    del: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z',
    copy: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
    pdf: 'M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z',
    word: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1.6 16h-1.3l-1.2-4.5L8.7 18H7.4L5.6 11h1.5l1.1 4.6 1.2-4.6h1.3l1.2 4.6 1.1-4.6h1.5l-1.8 7zM13 9V3.5L18.5 9H13z',
    share: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z',
    print: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z',
    palette: 'M12 3a9 9 0 000 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    backup: 'M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z',
    restore: 'M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    chev: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z',
    camera: 'M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    attach: 'M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z',
    rotate: 'M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11a7.906 7.906 0 00-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z',
    file: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
    list: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',
    mail: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    form: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
    pen: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
    lock: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
    globe: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
    track: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    sample: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24"><path d="' + ICON[k] + '"/></svg>'; }
  // translation of app text (English is the key); filled in by i18n.js
  function T(s, vars) { var r = (window.CVi18n && window.CVi18n.t) ? window.CVi18n.t(s) : s; if (vars) Object.keys(vars).forEach(function (k) { r = r.split('{' + k + '}').join(vars[k]); }); return r; }

  /* ---------- state ---------- */
  var S = { list: D.loadAll(), cur: null, stack: ['home'], open: { personal: true }, filter: 'all', layout: null };
  function cur() { return S.cur; }
  var saveTimer = null;
  function saveSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 350);
  }
  function saveNow() {
    clearTimeout(saveTimer);
    if (S.cur) {
      S.cur.updated = Date.now();
      var i = S.list.findIndex(function (x) { return x.id === S.cur.id; });
      if (i < 0) S.list.unshift(S.cur); else S.list[i] = S.cur;
    }
    if (!D.saveAll(S.list)) toast(T('Could not save - phone storage may be full'));
  }

  /* ---------- ui helpers ---------- */
  var toastTimer;
  function toast(msg, ms) {
    var t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, ms || 2600);
  }
  function busy(msg) { $('#busy-msg').textContent = msg; $('#busy').hidden = false; }
  function done() { $('#busy').hidden = true; }
  function openSheet(html) {
    var sh = $('#sheet');
    sh.innerHTML = '<div class="grab"></div>' + html;
    sh.hidden = false; $('#scrim').hidden = false;
    return sh;
  }
  function closeSheet() { $('#sheet').hidden = true; $('#scrim').hidden = true; if (typeof cropCleanup === 'function') cropCleanup(); }
  $('#scrim').addEventListener('click', closeSheet);
  function confirmSheet(title, text, okLabel, danger) {
    return new Promise(function (res) {
      var sh = openSheet('<h3>' + esc(title) + '</h3><p>' + esc(text) + '</p><div class="btns"><button class="btn ghost" data-a="no">' + T('Cancel') + '</button>' +
        '<button class="btn' + (danger ? '' : '') + '" data-a="yes" style="' + (danger ? 'background:#C0392B' : '') + '">' + esc(okLabel) + '</button></div>');
      sh.onclick = function (e) {
        var b = e.target.closest('[data-a]'); if (!b) return;
        closeSheet(); sh.onclick = null; res(b.getAttribute('data-a') === 'yes');
      };
    });
  }
  function fmtWhen(ts) {
    var d = new Date(ts);
    var full = MONTHS[d.getMonth()], tr = T(full);
    return d.getDate() + ' ' + (tr === full ? full.slice(0, 3) : tr) + ' ' + d.getFullYear();
  }
  function cvTitle(cv) { return D.fullName(cv) || T('Untitled CV'); }
  function hasContent(cv) { return !!(cv && cv.personal && (cv.personal.firstNames || cv.personal.surname)); }

  /* ---------- navigation ---------- */
  function go(view, replace) {
    if (replace) S.stack[S.stack.length - 1] = view; else if (S.stack[S.stack.length - 1] !== view) S.stack.push(view);
    render();
    window.scrollTo(0, 0);
  }
  function back() {
    if (!$('#sheet').hidden) { closeSheet(); return true; }
    if (!$('#busy').hidden) return true;
    if (App.hooks.overlayBack && App.hooks.overlayBack()) return true;
    var top = S.stack[S.stack.length - 1];
    if (VIEWS[top] && VIEWS[top].beforeBack && VIEWS[top].beforeBack() === true) return true;
    if (S.stack.length > 1) {
      S.stack.pop();
      if (S.stack[S.stack.length - 1] === 'home') { saveNow(); S.cur = null; }
      if (S.stack[S.stack.length - 1] === 'edit' && !S.cur) S.stack = ['home'];
      render(); window.scrollTo(0, 0);
      return true;
    }
    return false;
  }
  window.appBack = function () { return back(); };
  $('#btn-back').addEventListener('click', back);
  $('#btn-menu').addEventListener('click', menu);

  // screens added by other files (cover letter, Z83, tracker, design…) register here
  var VIEWS = {};
  function viewEl(k) {
    var el = document.getElementById('v-' + k);
    if (!el) { el = document.createElement('section'); el.className = 'view'; el.id = 'v-' + k; el.hidden = true; $('#main').appendChild(el); }
    return el;
  }
  function render() {
    var v = S.stack[S.stack.length - 1];
    ['home', 'edit', 'tpl', 'prev', 'docs'].concat(Object.keys(VIEWS)).forEach(function (k) { viewEl(k).hidden = k !== v; });
    if (VIEWS[v] && VIEWS[v].needsCV && !S.cur) { S.stack = ['home']; render(); return; }
    $('#btn-back').hidden = v === 'home';
    document.body.classList.toggle('at-home', v === 'home');
    document.body.setAttribute('data-view', v);
    $('#bar-extra').innerHTML = VIEWS[v] && VIEWS[v].bar ? VIEWS[v].bar() : '';
    $('#btn-menu').hidden = !!(VIEWS[v] && VIEWS[v].noMenu);
    if (v === 'home') {
      $('#bar-title').innerHTML = '<span class="brand"><img src="img/logo.png" alt="" class="brand-ic"><span class="brand-t"><b>CV Maker SA</b><small>' + T('by {name}', { name: DEVELOPER }) + '</small></span></span>';
    } else {
      $('#bar-title').textContent = VIEWS[v] ? VIEWS[v].title() : T({ edit: S.cur ? cvTitle(S.cur) : 'Edit CV', tpl: 'Choose a template', prev: 'Preview', docs: 'Supporting documents' }[v]);
    }
    if (VIEWS[v]) VIEWS[v].render(viewEl(v));
    if (v === 'home') renderHome();
    if (v === 'edit') renderEditor();
    if (v === 'tpl') renderTemplates();
    if (v === 'prev') renderPreview();
    if (v === 'docs') renderDocs();
    renderActions(v);
  }
  function renderActions(v) {
    var a = $('#actions');
    var h = '';
    if (v === 'edit') h = '<button class="btn soft" data-act="tpl">' + svg('palette') + T('Template') + '</button><button class="btn" data-act="prev">' + svg('eye') + T('Preview') + '</button>';
    if (v === 'tpl' && S.cur) h = '<button class="btn soft" data-act="edit">' + svg('edit') + T('Edit details') + '</button><button class="btn" data-act="prev">' + svg('eye') + T('Preview') + '</button>';
    if (v === 'prev') h = '<button class="btn soft" data-act="edit">' + svg('edit') + T('Edit') + '</button><button class="btn soft" data-act="docs">' + svg('attach') + T('Documents') + '</button><button class="btn gold" data-act="dl">' + svg('pdf') + T('Download') + '</button>';
    if (v === 'docs') h = '<button class="btn soft" data-act="prev">' + svg('eye') + T('Preview') + '</button><button class="btn gold" data-act="dl">' + svg('pdf') + T('Download') + '</button>';
    if (VIEWS[v]) h = VIEWS[v].actions ? VIEWS[v].actions() : '';
    a.innerHTML = h; a.hidden = !h;
    // three buttons: icon above a smaller label, so long words (e.g. "Amadokhumenti") still fit
    a.classList.toggle('n3', (h.match(/data-act=/g) || []).length >= 3);
  }
  $('#actions').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var act = b.getAttribute('data-act');
    saveNow();
    var v0 = S.stack[S.stack.length - 1];
    if (VIEWS[v0] && VIEWS[v0].onAction && VIEWS[v0].onAction(act, b) === true) return;
    if (act === 'tpl') go('tpl');
    if (act === 'prev') {
      var top = S.stack[S.stack.length - 1], below = S.stack[S.stack.length - 2];
      if (top !== 'edit' && top !== 'home' && below === 'prev') back(); else go('prev');
    }
    if (act === 'edit') { var i = S.stack.lastIndexOf('edit'); if (i >= 0) { S.stack = S.stack.slice(0, i + 1); render(); window.scrollTo(0, 0); } else go('edit'); }
    if (act === 'dl') downloadSheet();
    if (act === 'docs') go('docs');
    if (EXTRA_ACTIONS[act]) EXTRA_ACTIONS[act](b);
  });
  var EXTRA_ACTIONS = {};

  function menu() {
    var v = S.stack[S.stack.length - 1];
    if (VIEWS[v] && VIEWS[v].menu) { VIEWS[v].menu(); return; }
    if (v === 'home') {
      var sh = openSheet('<button class="sheet-item" data-m="backup">' + svg('backup') + '<span>' + T('Back up all CVs') + '<small>' + T('Save one file with every CV - keep it safe or move it to a new phone') + '</small></span></button>' +
        '<button class="sheet-item" data-m="restore">' + svg('restore') + '<span>' + T('Restore from backup') + '<small>' + T('Load CVs from a backup file') + '</small></span></button>' +
        '<button class="sheet-item" data-m="apps">' + svg('track') + '<span>' + T('Application tracker') + '<small>' + T('Jobs you applied for and closing dates') + '</small></span></button>' +
        '<button class="sheet-item" data-m="pin">' + svg('lock') + '<span>' + T('PIN lock') + '<small>' + T(App.hooks.pinOn && App.hooks.pinOn() ? 'On' : 'Off') + '</small></span></button>' +
        '<button class="sheet-item" data-m="lang">' + svg('globe') + '<span>' + T('Language') + '<small>' + esc(window.CVi18n ? window.CVi18n.name() : 'English') + '</small></span></button>' +
        '<button class="sheet-item" data-m="sample">' + svg('sample') + '<span>' + T('Create a sample CV') + '<small>' + T('See how a finished CV looks') + '</small></span></button>' +
        '<button class="sheet-item" data-m="about">' + svg('info') + '<span>' + T('About') + '</span></button>');
      sh.onclick = function (e) {
        var b = e.target.closest('[data-m]'); if (!b) return; closeSheet();
        var m = b.getAttribute('data-m');
        if (m === 'backup') backup();
        if (m === 'restore') $('#file-restore').click();
        if (m === 'sample') { var c = D.sampleCV(); S.cur = c; S.list.unshift(c); saveNow(); S.stack = ['home', 'edit']; render(); }
        if (m === 'about') about();
        if (m === 'apps') go('apps');
        if (m === 'pin' && App.hooks.pinMenu) App.hooks.pinMenu();
        if (m === 'lang' && window.CVi18n) window.CVi18n.picker();
      };
    } else if (v === 'prev') {
      downloadSheet();
    } else if (S.cur) {
      cvMenu(S.cur);
    }
  }
  function about() {
    openSheet('<div class="about"><img src="img/logo.png" alt="" class="about-logo"><h3>CV Maker SA</h3>' +
      '<div class="about-ver">' + T('Version') + ' ' + APP_VERSION + '</div>' +
      '<p>' + T('Make South African CVs, cover letters and Z83 forms on your phone and save them as PDF or Word. {n} templates, including the traditional Classic SA layout.', { n: TP.list.length }) + '</p>' +
      '<div class="about-dev"><span>' + T('Designed and developed by') + '</span><b>' + DEVELOPER + '</b></div>' +
      '<p>' + T('Your CVs are saved only on this phone. Use "Back up all CVs" in the menu to keep a copy.') + '</p>' +
      '<div class="credit-copy">© ' + new Date().getFullYear() + ' ' + DEVELOPER + '. ' + T('All rights reserved.') + '</div></div>' +
      '<div class="sheet-foot"><button type="button" class="btn ghost" data-a="close">' + T('Close') + '</button></div>');
    $('#sheet').onclick = function (e) { if (e.target.closest('[data-a="close"]')) closeSheet(); };
  }

  /* ---------- home ---------- */
  var APP_VERSION = '1.4';
  var DEVELOPER = 'Tumelo Vincent Tau';
  var SHOWCASE = ['classic', 'navy', 'mzansi', 'timeline', 'elegant', 'teal', 'swiss', 'purple'];
  var sampleForShow = null;
  function showcaseCV() { if (!sampleForShow) sampleForShow = D.sampleCV(); return sampleForShow; }
  function renderHome() {
    var n = TP.list.length;
    var sorted = S.list.slice().sort(function (a, b) { return b.updated - a.updated; });
    var h = '<section class="hero">' +
      (window.CVi18n ? '<div class="hero-top"><button class="hero-lang" id="hero-lang" aria-label="' + esc(T('Language')) + '">' + svg('globe') + '<span>' + esc(window.CVi18n.name()) + '</span></button></div>' : '') +
      '<h1>' + T('Your CV, ready for South African employers') + '</h1>' +
      '<p class="hero-sub">' + T('Make your CV, cover letter and Z83 - and now scan, sign and fix any PDF.') + '</p>' +
      '<button class="btn gold block hero-cta" id="new-cv">' + svg('plus') + T('Create new CV') + '</button>' +
      (sorted.length ? '' : '<button class="hero-link" id="try-sample">' + T('Open a sample CV') + '</button>') +
      '<div class="flagline">' + TP.FLAG.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</div></section>';
    if (App.hooks && App.hooks.homeInstall) h += App.hooks.homeInstall();
    if (App.hooks && App.hooks.homeTools) h += App.hooks.homeTools();
    if (sorted.length) {
      h += '<section class="block"><div class="block-h"><h2>' + T('My CVs') + '</h2><span class="count">' + sorted.length + '</span></div>';
      sorted.forEach(function (cv) {
        h += '<div class="cv-card" data-id="' + cv.id + '"><div class="mini" data-thumb="' + cv.id + '"></div><div class="meta"><div class="nm2">' + esc(cvTitle(cv)) + '</div>' +
          '<div class="sub">' + esc(T(TP.get(cv.templateId).name)) + '</div><div class="sub">' + T('Edited {date}', { date: fmtWhen(cv.updated) }) + '</div></div>' +
          '<button class="icon-btn" data-quick="' + cv.id + '" aria-label="Download">' + svg('pdf') + '</button>' +
          '<button class="icon-btn" data-more="' + cv.id + '" aria-label="More">' + svg('more') + '</button></div>';
      });
      h += '</section>';
    }
    if (App.hooks && App.hooks.homeApps) h += App.hooks.homeApps();
    h += '<section class="block"><div class="block-h"><h2>' + T('Templates') + '</h2><button class="see-all" id="see-all">' + T('See all {n}', { n: n }) + '</button></div>' +
      '<div class="strip">' + SHOWCASE.map(function (id) {
        return '<button class="strip-it" data-start="' + id + '"><div class="strip-pg" data-show="' + id + '"></div><span>' + esc(T(TP.get(id).name)) + '</span></button>';
      }).join('') + '</div></section>';
    h += '<section class="block"><div class="block-h"><h2>' + T('How it works') + '</h2></div><ol class="steps">' +
      '<li><b>' + T('Fill in your details') + '</b><span>' + T('Personal details, school, work experience and references. Your SA ID number fills in your date of birth for you.') + '</span></li>' +
      '<li><b>' + T('Choose a template') + '</b><span>' + T('Classic SA for traditional employers, or a modern design. You can switch at any time.') + '</span></li>' +
      '<li><b>' + T('Add a cover letter and documents') + '</b><span>' + T('The cover letter is written for you. Take photos of your ID copy and certificates. Government jobs get a Z83 form.') + '</span></li>' +
      '<li><b>' + T('Save or share') + '</b><span>' + T('Download everything as one PDF, or send it straight to WhatsApp or email. The tracker reminds you of closing dates.') + '</span></li></ol></section>';
    h += creditHTML();
    var v = $('#v-home'); v.innerHTML = h;
    // real page previews
    var cvs = showcaseCV();
    Array.prototype.forEach.call(v.querySelectorAll('[data-show]'), function (el) {
      el.innerHTML = PG.thumb(cvs, el.getAttribute('data-show'), el.clientWidth || 120);
    });
    sorted.forEach(function (cv) {
      var el = v.querySelector('[data-thumb="' + cv.id + '"]');
      if (el) el.innerHTML = PG.thumb(cv, cv.templateId, 58);
    });
  }
  function creditHTML() {
    return '<footer class="credit"><img src="img/logo.png" alt="" class="credit-logo">' +
      '<div class="credit-name">CV Maker SA</div><div class="credit-ver">' + T('Version') + ' ' + APP_VERSION + '</div>' +
      '<div class="credit-by">' + T('Designed and developed by') + '<br><b>' + DEVELOPER + '</b></div>' +
      '<div class="credit-note">' + T(NATIVE ? 'Your CVs are saved only on this phone.' : 'Your CVs stay on this phone, in this browser. Nothing is sent over the internet.') + '</div>' +
      '<div class="credit-copy">© ' + new Date().getFullYear() + ' ' + DEVELOPER + '. ' + T('All rights reserved.') + '</div></footer>';
  }
  function startCV(templateId) {
    var c = D.blankCV(); if (templateId) c.templateId = templateId;
    S.cur = c; S.list.unshift(c); S.open = { personal: true }; saveNow();
    S.stack = ['home', 'edit']; render(); window.scrollTo(0, 0);
    if (templateId) toast(T('{name} chosen. Now fill in your details.', { name: TP.get(templateId).name }));
  }
  $('#v-home').addEventListener('click', function (e) {
    if (e.target.closest('#hero-lang')) { window.CVi18n.picker(); return; }
    if (e.target.closest('#new-cv')) { startCV(); return; }
    if (e.target.closest('#try-sample')) { var s = D.sampleCV(); S.cur = s; S.list.unshift(s); saveNow(); S.open = {}; go('edit'); return; }
    if (e.target.closest('#see-all')) { S.cur = null; go('tpl'); return; }
    if (e.target.closest('[data-home="apps"]')) { go('apps'); return; }
    var ap = e.target.closest('[data-app]');
    if (ap) { go('apps'); setTimeout(function () { var c2 = document.querySelector('#v-apps [data-app="' + ap.getAttribute('data-app') + '"]'); if (c2) c2.click(); }, 30); return; }
    var st = e.target.closest('[data-start]');
    if (st) { startCV(st.getAttribute('data-start')); return; }
    var q = e.target.closest('[data-quick]');
    if (q) { S.cur = S.list.find(function (x) { return x.id === q.getAttribute('data-quick'); }); S.stack = ['home', 'edit', 'prev']; render(); window.scrollTo(0, 0); return; }
    var more = e.target.closest('[data-more]');
    if (more) { var cv = S.list.find(function (x) { return x.id === more.getAttribute('data-more'); }); if (cv) cvMenu(cv); return; }
    var card = e.target.closest('.cv-card');
    if (card) { S.cur = S.list.find(function (x) { return x.id === card.getAttribute('data-id'); }); S.open = {}; go('edit'); }
  });
  function cvMenu(cv) {
    var sh = openSheet('<h3>' + esc(cvTitle(cv)) + '</h3>' +
      '<button class="sheet-item" data-m="edit">' + svg('edit') + T('Edit details') + '</button>' +
      '<button class="sheet-item" data-m="prev">' + svg('eye') + T('Preview & download') + '</button>' +
      '<button class="sheet-item" data-m="dup">' + svg('copy') + '<span>' + T('Duplicate') + '<small>' + T('Make a copy to change for a different job') + '</small></span></button>' +
      '<button class="sheet-item danger" data-m="del">' + svg('del') + T('Delete') + '</button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-m]'); if (!b) return; closeSheet();
      var m = b.getAttribute('data-m');
      if (m === 'edit') { S.cur = cv; S.stack = ['home', 'edit']; render(); }
      if (m === 'prev') { S.cur = cv; S.stack = ['home', 'edit', 'prev']; render(); }
      if (m === 'dup') {
        var c = JSON.parse(JSON.stringify(cv)); c.id = D.uid(); c.updated = Date.now();
        S.list.unshift(c); D.saveAll(S.list); toast(T('Copy made')); if (S.stack.length > 1) { S.cur = c; render(); } else renderHome();
      }
      if (m === 'del') {
        confirmSheet(T('Delete this CV?'), T('{name} will be removed from this phone. This cannot be undone.', { name: cvTitle(cv) }), T('Delete'), true).then(function (ok) {
          if (!ok) return;
          S.list = S.list.filter(function (x) { return x.id !== cv.id; }); D.saveAll(S.list); dropFiles(cv.docs || []);
          S.cur = null; S.stack = ['home']; render(); toast(T('CV deleted'));
        });
      }
    };
  }

  /* ---------- editor ---------- */
  var SA = D.SA;
  // option lists for the pickers; "other" lets people type their own answer
  var PICK = {
    gender: { tr: 1, choices: SA.gender, other: true }, nationality: { tr: 1, choices: SA.nationality, other: true },
    race: { tr: 1, choices: SA.race, other: true }, marital: { tr: 1, choices: SA.marital, other: true },
    lang: { choices: SA.languages, other: true }, langs: { choices: SA.languages, other: true },
    health: { tr: 1, choices: SA.health, other: true }, criminal: { tr: 1, choices: SA.criminal, other: true },
    disability: { tr: 1, choices: SA.disability, other: true }, licence: { tr: 1, choices: SA.licence, other: true },
    grade: { tr: 1, choices: SA.grade, other: true }, status: { tr: 1, choices: SA.status, other: true },
    rel: { tr: 1, choices: SA.relationship, other: true }, subjects: { choices: SA.subjects, other: true },
    doctype: { tr: 1, choices: ['Certified copy of ID', 'Matric certificate (NSC)', 'Academic record', 'Degree certificate', 'Diploma certificate',
      'Higher / N certificate', 'Short course certificate', "Driver's licence", 'Proof of address', 'Reference letter',
      'Police clearance certificate', 'Professional registration'], other: true },
    dob: { from: new Date().getFullYear() - 14, to: 1940 }, workMonth: { from: new Date().getFullYear(), to: 1960 },
    schoolYear: { from: new Date().getFullYear() + 1, to: 1960 }, studyYear: { from: new Date().getFullYear() + 5, to: 1960 }
  };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var SKILL_IDEAS = ['Computer literate (MS Word, Excel)', 'Customer service', 'Cash handling', 'Good communication', 'Teamwork', 'Time management',
    'Problem solving', 'Stock control', 'Data capturing', 'Driving', 'Basic first aid', 'Bookkeeping'];
  var ATTR_IDEAS = ['Honest and trustworthy', 'Punctual and reliable', 'Hard-working', 'Fast learner', 'Works well under pressure', 'Team player',
    'Friendly and respectful', 'Able to work without supervision'];
  var OBJ_IDEAS = ['I am a hard-working, honest and reliable person who is eager to learn and grow.',
    'I work well under pressure and get along with people from all backgrounds.',
    'I am looking for a position where I can use my skills and gain more experience.',
    'I am punctual, disciplined and able to work with little supervision.'];

  // field: [path, label, type, opts]
  var SECTIONS = [
    { id: 'personal', t: 'Personal details', s: 'Name, ID number and other details', done: function (c) { return c.personal.firstNames && c.personal.surname; },
      f: [['personal.firstNames', 'First name(s)', 'text', { ph: 'e.g. Thabo Sipho' }], ['personal.surname', 'Surname', 'text', {}],
        ['personal.displayName', 'Name at the top of the CV', 'text', { opt: 1, ph: 'Leave blank to use first name + surname' }],
        ['personal.headline', 'Job title or what you do', 'text', { opt: 1, ph: 'e.g. General Worker, Cashier, Electrician', hint: 'Shown under your name on the modern templates' }],
        ['personal.idNumber', 'SA ID number', 'id', { opt: 1, ph: '13-digit ID number' }],
        ['personal.dob', 'Date of birth', 'date', { opt: 1, pick: 'dob' }],
        [['personal.gender', 'Gender', 'pick', { opt: 1, pick: 'gender' }], ['personal.nationality', 'Nationality', 'pick', { opt: 1, pick: 'nationality' }]],
        [['personal.race', 'Race', 'pick', { opt: 1, pick: 'race' }], ['personal.maritalStatus', 'Marital status', 'pick', { opt: 1, pick: 'marital' }]],
        [['personal.homeLanguage', 'Home language', 'pick', { opt: 1, pick: 'lang' }], ['personal.otherLanguages', 'Other languages', 'multi', { opt: 1, pick: 'langs' }]],
        [['personal.healthStatus', 'Health status', 'pick', { opt: 1, pick: 'health' }], ['personal.criminalRecord', 'Criminal record', 'pick', { opt: 1, pick: 'criminal' }]],
        [['personal.licence', "Driver's licence", 'pick', { opt: 1, pick: 'licence' }], ['personal.disability', 'Disability', 'pick', { opt: 1, pick: 'disability' }]]] },
    { id: 'contact', t: 'Contact details', s: 'Phone, email and address', done: function (c) { return c.contact.phone; },
      f: [['contact.phone', 'Cell number', 'tel', { ph: 'e.g. 072 123 4567' }], ['contact.altPhone', 'Alternative number', 'tel', { opt: 1 }],
        ['contact.email', 'Email address', 'email', { opt: 1 }],
        ['contact.address', 'Physical address', 'textarea', { opt: 1, ph: 'One line per row, e.g.\n5114 K6\nKutlwanong\nOdendaalsrus\n9480', rows: 4 }],
        ['contact.postal', 'Postal address', 'textarea', { opt: 1, rows: 3, ph: 'Only if different' }],
        ['contact.linkedin', 'LinkedIn or website', 'text', { opt: 1 }]] },
    { id: 'profile', t: 'Career objective', s: 'A few lines about you (optional)', done: function (c) { return c.profile; },
      f: [['profile', 'Career objective / profile', 'textarea', { opt: 1, rows: 5, ph: 'Two or three sentences about you and the work you are looking for', ideas: OBJ_IDEAS, ideaMode: 'sentence' }]] },
    { id: 'school', t: 'School (Matric)', s: 'High school and subjects', done: function (c) { return c.school.name; },
      f: [['school.name', 'School attended', 'text', { ph: 'e.g. Rearabetswe Secondary School' }],
        [['school.grade', 'Highest grade passed', 'pick', { pick: 'grade' }], ['school.year', 'Year obtained', 'year', { pick: 'schoolYear' }]],
        ['school.subjects', 'Subjects passed', 'textarea', { opt: 1, rows: 6, ph: 'One subject per line', listPick: 'subjects', listLabel: 'Choose subjects' }]] },
    { id: 'tertiary', t: 'Tertiary & courses', s: 'University, college, TVET, short courses', done: function (c) { return c.tertiary.length || c.courses.length; },
      lists: [
        { key: 'tertiary', label: 'Qualification', add: 'Add qualification', title: function (x) { return x.qualification || x.institution; },
          blank: { institution: '', qualification: '', year: '', status: '' },
          f: [['institution', 'Institution', 'text', { ph: 'e.g. Goldfields TVET College' }], ['qualification', 'Qualification', 'text', { ph: 'e.g. N4 Business Management' }],
            [['year', 'Year', 'year', { pick: 'studyYear' }], ['status', 'Status', 'pick', { pick: 'status' }]]] },
        { key: 'courses', label: 'Course or certificate', add: 'Add short course', title: function (x) { return x.name; },
          blank: { name: '', provider: '', year: '' },
          f: [['name', 'Course or certificate', 'text', { ph: 'e.g. First Aid Level 1' }], [['provider', 'Provider', 'text', { opt: 1 }], ['year', 'Year', 'year', { opt: 1, pick: 'studyYear' }]]] }] },
    { id: 'work', t: 'Work experience', s: 'Jobs, learnerships, volunteer work', done: function (c) { return c.work.length; },
      lists: [{ key: 'work', label: 'Job', add: 'Add a job', title: function (x) { return [x.position, x.company].filter(Boolean).join(' at '); },
        blank: { company: '', position: '', start: '', end: '', current: false, duration: '', duties: '', reason: '' },
        f: [['company', 'Company name', 'text', {}], ['position', 'Job title / occupation', 'text', {}],
          [['start', 'Start month', 'month', { opt: 1, pick: 'workMonth' }], ['end', 'End month', 'month', { opt: 1, pick: 'workMonth' }]],
          ['current', 'I still work here', 'check', {}],
          ['duration', 'Duration', 'text', { opt: 1, ph: 'e.g. 8 months', hint: 'Only needed if you do not know the dates' }],
          ['duties', 'Duties', 'textarea', { opt: 1, rows: 4, ph: 'One duty per line', listPick: 'duties', listLabel: 'Suggest duties' }],
          ['reason', 'Reason for leaving', 'text', { opt: 1, ph: 'e.g. Contract ended' }]] }],
      note: 'Start with your most recent job. Learnerships, internships and volunteer work count too.' },
    { id: 'skills', t: 'Skills & attributes', s: 'What you are good at', done: function (c) { return c.skills || c.attributes; },
      f: [['skills', 'Skills', 'textarea', { opt: 1, rows: 4, ph: 'One skill per line', ideas: SKILL_IDEAS, listPick: 'jobskills', listLabel: 'More skills for my jobs' }],
        ['attributes', 'Personal attributes', 'textarea', { opt: 1, rows: 4, ph: 'One per line', ideas: ATTR_IDEAS }],
        ['hobbies', 'Hobbies & interests', 'textarea', { opt: 1, rows: 2, ph: 'One per line' }]] },
    { id: 'refs', t: 'References', s: 'People who can vouch for you', done: function (c) { return c.references.length || c.refsOnRequest; },
      lists: [{ key: 'references', label: 'Reference', add: 'Add a reference', title: function (x) { return x.name; },
        blank: { name: '', relationship: '', company: '', phone: '', email: '' },
        f: [['name', 'Name', 'text', { ph: 'e.g. Mr P. Nkosi' }], [['relationship', 'Relationship / position', 'pick', { pick: 'rel' }], ['company', 'Company', 'text', { opt: 1 }]],
          [['phone', 'Contact number', 'tel', {}], ['email', 'Email', 'email', { opt: 1 }]]] }],
      after: [['refsOnRequest', 'Write "Available on request" when no references are listed', 'check', {}]] },
    { id: 'extras', t: 'Photo & declaration', s: 'Optional extras', done: function (c) { return c.photo || c.declaration; }, extras: true },
    { id: 'docs', t: 'Supporting documents', s: 'ID copy, matric and other certificates', done: function (c) { return c.docs && c.docs.length; }, docsSec: true }
  ];

  function get(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function set(obj, path, v) { var ks = path.split('.'), o = obj; for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = v; }

  var PICKER_TYPES = { pick: 1, multi: 1, date: 1, month: 1, year: 1 };
  // dates on screen use the app language; the CV itself keeps English month names
  var MONTH_RE = /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g;
  function trMonths(str) {
    return String(str || '').replace(MONTH_RE, function (m) {
      if (m.length > 3 || m === 'May') return T(m);
      var full = MONTHS.filter(function (x) { return x.slice(0, 3) === m; })[0], t = T(full);
      return t === full ? m : t;
    });
  }
  function fmtDateT(v) { return trMonths(D.fmtDate(v)); }
  function pickDisplay(type, v, def) {
    if (!v) return '';
    if (type === 'date') return fmtDateT(v);
    if (type === 'month') return D.fmtMonth(v); // short "Jan 2023" fits the half-width boxes in every language
    var tr = PICK[def] && PICK[def].tr;
    if (tr && type === 'multi') return String(v).split(/,\s*/).map(function (x) { return T(x); }).join(', ');
    return tr ? T(String(v)) : String(v);
  }
  var CHEV = '<svg class="pk-ch" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>';
  function pickBtnHTML(type, o, value, attrs, id, label, item) {
    var locked = item && type === 'month' && /data-k="end"/.test(attrs) && item.current;
    var shown = locked ? T('Present') : pickDisplay(type, value, o.pick);
    var ph = T({ date: 'Choose date', month: 'Choose month', year: 'Choose year', multi: 'Choose', pick: 'Choose' }[type]);
    return '<button type="button" class="pick' + (shown ? '' : ' empty') + '" id="' + id + '" ' + attrs + ' data-kind="' + type + '" data-def="' + (o.pick || '') +
      '" data-label="' + esc(label) + '"' + (locked ? ' disabled' : '') + '><span class="pv">' + esc(shown || ph) + '</span>' + CHEV + '</button>';
  }
  function fieldHTML(f, value, attrs, item) {
    var path = f[0], label = f[1], type = f[2], o = f[3] || {};
    var id = 'f-' + attrs.replace(/[^a-z0-9]+/gi, '-');
    if (type === 'check') {
      return '<label class="chk"><input type="checkbox" id="' + id + '" ' + attrs + (value ? ' checked' : '') + '><span>' + esc(T(label)) + '</span></label>';
    }
    var lab = '<label for="' + id + '">' + esc(T(label)) + (o.opt ? ' <span class="optional">(' + T('optional') + ')</span>' : '') + '</label>';
    if (PICKER_TYPES[type]) return '<div class="fld">' + lab + pickBtnHTML(type, o, value, attrs, id, label, item) + '</div>';
    var common = ' id="' + id + '" ' + attrs + (o.ph ? ' placeholder="' + esc(T(o.ph)) + '"' : '') +
      (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') + ' autocomplete="off"';
    var input;
    if (type === 'textarea') input = '<textarea' + common + ' rows="' + (o.rows || 3) + '">' + esc(value || '') + '</textarea>';
    else {
      var t = type === 'id' ? 'text' : type;
      input = '<input type="' + t + '"' + common + (type === 'id' ? ' inputmode="numeric" maxlength="16"' : '') + ' value="' + esc(value || '') + '">';
    }
    var hint = '';
    if (type === 'id') { var r = D.parseSAID(value); hint = '<div class="hint ' + (value ? (r.valid ? 'good' : 'bad') : '') + '" data-idhint>' + idHint(value) + '</div>'; }
    else if (o.hint) hint = '<div class="hint">' + esc(T(o.hint)) + '</div>';
    var ideas = '';
    if (o.ideas) {
      var have = D.lines(value);
      ideas = '<div class="chips-in">' + o.ideas.map(function (x) {
        var on = o.ideaMode !== 'sentence' && have.indexOf(x) >= 0;
        return '<button type="button" class="chip-in' + (on ? ' on' : '') + '" data-idea="' + esc(x) + '" data-target="' + id + '" data-mode="' + (o.ideaMode || 'line') + '">' +
          (on ? '\u2713 ' : '+ ') + esc(x.length > 46 ? x.slice(0, 44) + '\u2026' : x) + '</button>';
      }).join('') + '</div>';
    }
    if (o.listPick) ideas += '<button type="button" class="btn soft small listpick" data-listpick="' + o.listPick + '" data-target="' + id + '" data-label="' + esc(label) + '">' + svg('list') + esc(T(o.listLabel || 'Choose from list')) + '</button>';
    return '<div class="fld">' + lab + input + hint + ideas + '</div>';
  }
  function idHint(v) {
    if (!v) return T('Fills in your date of birth, gender and nationality for you');
    var r = D.parseSAID(v);
    return r.valid ? T('Valid ID number') : esc(T(r.reason));
  }
  function fieldsHTML(fields, getVal, attrFor, item) {
    return fields.map(function (f) {
      if (Array.isArray(f[0])) return '<div class="row2">' + f.map(function (g) { return '<div class="cell">' + fieldHTML(g, getVal(g[0]), attrFor(g[0]), item) + '</div>'; }).join('') + '</div>';
      return fieldHTML(f, getVal(f[0]), attrFor(f[0]), item);
    }).join('');
  }

  function sectionBody(sec) {
    var c = S.cur, h = '';
    if (sec.note) h += '<div class="fld"><div class="hint">' + esc(T(sec.note)) + '</div></div>';
    if (sec.f) h += fieldsHTML(sec.f, function (p) { return get(c, p); }, function (p) { return 'data-p="' + p + '"'; });
    (sec.lists || []).forEach(function (L) {
      var arr = c[L.key];
      arr.forEach(function (item, i) {
        h += '<div class="item"><div class="item-h"><div class="it">' + esc(L.title(item) || (T(L.label) + ' ' + (i + 1))) + '</div>' +
          '<button class="icon-btn" data-mv="' + L.key + ':' + i + ':-1" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>' + svg('up') + '</button>' +
          '<button class="icon-btn" data-mv="' + L.key + ':' + i + ':1" aria-label="Move down"' + (i === arr.length - 1 ? ' disabled' : '') + '>' + svg('down') + '</button>' +
          '<button class="icon-btn danger" data-rm="' + L.key + ':' + i + '" aria-label="Remove">' + svg('del') + '</button></div>' +
          fieldsHTML(L.f, function (k) { return item[k]; }, function (k) { return 'data-l="' + L.key + '" data-i="' + i + '" data-k="' + k + '"'; }, item) + '</div>';
      });
      h += '<button class="btn soft block add" data-add="' + L.key + '">' + svg('plus') + esc(T(L.add)) + '</button>';
    });
    if (sec.after) h += fieldsHTML(sec.after, function (p) { return get(c, p); }, function (p) { return 'data-p="' + p + '"'; });
    if (sec.docsSec) {
      var docs = c.docs || [];
      h += '<div class="fld"><div class="hint">' + T('Attach copies of your ID, matric certificate and qualifications. They are added after your CV in one PDF.') + '</div></div>';
      if (docs.length) h += '<ul class="doc-sum">' + docs.map(function (d, i) { return '<li><b>' + esc(window.CVFiles.letter(i)) + '</b>' + esc(d.type ? T(d.type) : T('Not named yet')) + '</li>'; }).join('') + '</ul>';
      h += '<button class="btn soft block add" data-go="docs">' + svg('attach') + T(docs.length ? 'Add or change documents' : 'Attach documents') + '</button>';
    }
    if (sec.extras) {
      h += '<div class="photo-row"><div class="photo-prev" style="' + (c.photo ? 'background-image:url(' + c.photo + ')' : '') + '">' + (c.photo ? '' : T('No photo')) + '</div>' +
        '<div><button class="btn soft small" data-photo="pick">' + T(c.photo ? 'Change photo' : 'Add a photo') + '</button>' +
        (c.photo ? ' <button class="btn ghost small" data-photo="remove">' + T('Remove') + '</button>' : '') + '</div></div>' +
        '<div class="fld"><div class="hint">' + T('A photo is optional in South Africa. It is shown on templates marked "photo". Use a clear, front-facing photo.') + '</div></div>' +
        fieldsHTML([['showPhoto', 'Show my photo on the CV', 'check', {}], ['declaration', 'Add a signed declaration at the end', 'check', {}]],
          function (p) { return get(c, p); }, function (p) { return 'data-p="' + p + '"'; }) +
        (App.sigRow ? '<div class="fld">' + App.sigRow('signature', 'Signature', 'Used on your declaration, cover letter and Z83') + '</div>' : '');
    }
    return h;
  }
  function sectionHTML(sec, n) {
    var isOpen = !!S.open[sec.id], ok = !!sec.done(S.cur);
    return '<div class="fsec' + (isOpen ? ' open' : '') + '" data-sec="' + sec.id + '"><button class="fsec-h" data-tog="' + sec.id + '">' +
      '<span class="num' + (ok ? ' done' : '') + '">' + (ok ? '✓' : n) + '</span><span class="t">' + esc(T(sec.t)) + '<span class="st">' + esc(T(sec.s)) + '</span></span>' +
      '<svg class="chev" viewBox="0 0 24 24"><path d="' + ICON.chev + '"/></svg></button><div class="fsec-b">' + (isOpen ? sectionBody(sec) : '') + '</div></div>';
  }
  function progressHTML() {
    var n = SECTIONS.filter(function (s) { return s.done(S.cur); }).length;
    return '<div class="progress"><div class="track"><div class="fill" style="width:' + Math.round(n / SECTIONS.length * 100) + '%"></div></div><span>' + T('{n} of {total} sections', { n: n, total: SECTIONS.length }) + '</span></div>';
  }
  function renderEditor() {
    if (!S.cur) { S.stack = ['home']; render(); return; }
    var h = '<div id="prog">' + progressHTML() + '</div>' + SECTIONS.map(function (s, i) { return sectionHTML(s, i + 1); }).join('');
    var c = S.cur, lt = c.letter && c.letter.position, zz = c.z83 && c.z83.position, nd = (c.docs || []).length;
    h += '<div class="apply-card"><b>' + T('Complete your application') + '</b>' +
      '<button data-go="letter">' + svg('mail') + '<span>' + T('Cover letter') + '<small>' + esc(lt ? T('For: {job}', { job: c.letter.position }) : T('Written for you from your CV')) + '</small></span>' + (lt ? '<i class="ok">' + svg('check') + '</i>' : '') + '</button>' +
      '<button data-go="z83">' + svg('form') + '<span>' + T('Z83 form') + '<small>' + esc(zz ? T('For: {job}', { job: c.z83.position }) : T('Needed for government jobs')) + '</small></span>' + (zz ? '<i class="ok">' + svg('check') + '</i>' : '') + '</button>' +
      '<button data-go="docs">' + svg('attach') + '<span>' + T('Supporting documents') + '<small>' + esc(nd ? T('{n} attached', { n: nd }) : T('ID copy, matric certificate, qualifications')) + '</small></span>' + (nd ? '<i class="ok">' + svg('check') + '</i>' : '') + '</button></div>';
    $('#v-edit').innerHTML = h;
  }
  function refreshSection(id, keepOpen) {
    var sec = SECTIONS.filter(function (s) { return s.id === id; })[0];
    var el = $('#v-edit [data-sec="' + id + '"]');
    if (!sec || !el) return;
    var n = SECTIONS.indexOf(sec) + 1;
    var tmp = document.createElement('div'); tmp.innerHTML = sectionHTML(sec, n);
    el.parentNode.replaceChild(tmp.firstChild, el);
    $('#prog').innerHTML = progressHTML();
  }
  function refreshStatus() {
    SECTIONS.forEach(function (sec, i) {
      var el = $('#v-edit [data-sec="' + sec.id + '"] .num'); if (!el) return;
      var ok = !!sec.done(S.cur); el.className = 'num' + (ok ? ' done' : ''); el.textContent = ok ? '✓' : (i + 1);
    });
    var p = $('#prog'); if (p) p.innerHTML = progressHTML();
    $('#bar-title').textContent = cvTitle(S.cur);
  }

  var ed = $('#v-edit');
  ed.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tog]');
    if (t) {
      var id = t.getAttribute('data-tog'); S.open[id] = !S.open[id]; refreshSection(id);
      if (S.open[id]) { var el = $('#v-edit [data-sec="' + id + '"]'); setTimeout(function () { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 30); }
      return;
    }
    var add = e.target.closest('[data-add]');
    if (add) {
      var key = add.getAttribute('data-add'), L = findList(key);
      S.cur[key].push(JSON.parse(JSON.stringify(L.blank))); saveSoon(); refreshSection(secOfList(key));
      var items = $('#v-edit [data-sec="' + secOfList(key) + '"]').querySelectorAll('.item');
      var last = items[items.length - 1]; if (last) { last.scrollIntoView({ block: 'center' }); var inp = last.querySelector('input'); if (inp) inp.focus(); }
      return;
    }
    var rm = e.target.closest('[data-rm]');
    if (rm) {
      var pr = rm.getAttribute('data-rm').split(':');
      confirmSheet(T('Remove this entry?'), T('The details in this entry will be deleted.'), T('Remove'), true).then(function (ok) {
        if (!ok) return; S.cur[pr[0]].splice(+pr[1], 1); saveSoon(); refreshSection(secOfList(pr[0]));
      });
      return;
    }
    var mv = e.target.closest('[data-mv]');
    if (mv) {
      var q = mv.getAttribute('data-mv').split(':'), arr = S.cur[q[0]], i = +q[1], j = i + (+q[2]);
      if (j < 0 || j >= arr.length) return;
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; saveSoon(); refreshSection(secOfList(q[0]));
      return;
    }
    var gto = e.target.closest('[data-go]');
    if (gto) { saveNow(); go(gto.getAttribute('data-go')); return; }
    var sgn = e.target.closest('[data-sign]');
    if (sgn && App.signPad) { App.signPad(sgn.getAttribute('data-sign'), function () { refreshSection('extras'); }); return; }
    var pk = e.target.closest('.pick');
    if (pk && !pk.disabled) { openPicker(pk); return; }
    var lp = e.target.closest('[data-listpick]');
    if (lp) { openListPicker(lp); return; }
    var idea = e.target.closest('[data-idea]');
    if (idea) {
      var ta = document.getElementById(idea.getAttribute('data-target')), txt = idea.getAttribute('data-idea');
      if (idea.getAttribute('data-mode') === 'sentence') ta.value = (ta.value.trim() ? ta.value.trim() + ' ' : '') + txt;
      else {
        var ls = D.lines(ta.value), at = ls.indexOf(txt);
        if (at >= 0) ls.splice(at, 1); else ls.push(txt);
        ta.value = ls.join('\n');
        idea.classList.toggle('on', at < 0);
        idea.textContent = (at < 0 ? '\u2713 ' : '+ ') + (txt.length > 46 ? txt.slice(0, 44) + '\u2026' : txt);
      }
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    var ph = e.target.closest('[data-photo]');
    if (ph) {
      if (ph.getAttribute('data-photo') === 'pick') $('#file-photo').click();
      else { S.cur.photo = ''; saveSoon(); refreshSection('extras'); }
    }
  });
  function findList(key) { var r; SECTIONS.forEach(function (s) { (s.lists || []).forEach(function (L) { if (L.key === key) r = L; }); }); return r; }
  function secOfList(key) { var r; SECTIONS.forEach(function (s) { (s.lists || []).forEach(function (L) { if (L.key === key) r = s.id; }); }); return r; }

  // writes a value from any field element (input, textarea, checkbox or picker button) into the CV
  function writeField(el, v) {
    var p = el.getAttribute('data-p');
    if (p) {
      set(S.cur, p, v);
      if (p === 'personal.idNumber') idChanged(el);
    } else if (el.hasAttribute('data-l')) {
      var item = S.cur[el.getAttribute('data-l')][+el.getAttribute('data-i')];
      if (!item) return;
      var k = el.getAttribute('data-k');
      item[k] = v;
      var box = el.closest('.item');
      if (k === 'current' && box) {
        if (v) item.end = '';
        var endEl = box.querySelector('.pick[data-k="end"]');
        if (endEl) { endEl.disabled = !!v; setPickBtn(endEl, v ? 'Present' : item.end); }
      }
      var L = findList(el.getAttribute('data-l'));
      if (box && L) box.querySelector('.it').textContent = L.title(item) || L.label;
    } else return;
    saveSoon(); refreshStatus();
  }
  function onField(e) {
    var el = e.target;
    if (el.classList && el.classList.contains('pick')) return;
    writeField(el, el.type === 'checkbox' ? el.checked : el.value);
  }
  function setPickBtn(btn, v) {
    var type = btn.getAttribute('data-kind');
    var shown = v === 'Present' ? T(v) : pickDisplay(type, v, btn.getAttribute('data-def'));
    var ph = T({ date: 'Choose date', month: 'Choose month', year: 'Choose year' }[type] || 'Choose');
    btn.querySelector('.pv').textContent = shown || ph;
    btn.classList.toggle('empty', !shown);
  }
  function fieldValue(btn) {
    var p = btn.getAttribute('data-p');
    if (p) return get(S.cur, p) || '';
    var item = S.cur[btn.getAttribute('data-l')][+btn.getAttribute('data-i')];
    return (item && item[btn.getAttribute('data-k')]) || '';
  }

  /* ---------- pickers (bottom sheets; no reliance on the phone's own dropdowns) ---------- */
  function openPicker(btn) {
    var kind = btn.getAttribute('data-kind'), def = PICK[btn.getAttribute('data-def')] || {}, label = btn.getAttribute('data-label');
    var value = fieldValue(btn);
    function apply(v) { writeField(btn, v); setPickBtn(btn, v); }
    if (kind === 'pick') choicePicker(label, def, value, false, apply);
    else if (kind === 'multi') choicePicker(label, def, value, true, apply);
    else datePicker(label, kind, def, value, apply);
  }
  function splitList(v, multiLines) {
    return multiLines ? D.lines(v) : String(v || '').split(/[,;\n]/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  // single or multiple choice. For multi, value is "a, b, c" (or lines when asLines)
  function choicePicker(title, def, value, multi, apply, asLines) {
    var choices = (def.choices || []).slice();
    var picked = multi ? splitList(value, asLines) : (value ? [value] : []);
    // answers typed earlier that are not in the list are shown first
    picked.forEach(function (v) { if (choices.indexOf(v) < 0) choices.unshift(v); });
    function body() {
      var h = '<h3>' + esc(T(title)) + '</h3>' + (multi ? '<p>' + T('Tap all that apply, then tap Done.') + '</p>' : '') + '<div class="opts">';
      choices.forEach(function (c, i) {
        var on = picked.indexOf(c) >= 0;
        h += '<button type="button" class="opt' + (on ? ' on' : '') + (multi ? ' multi' : '') + '" data-i="' + i + '"><span class="mk"></span><span class="ot">' + esc(def.tr ? T(c) : c) + '</span></button>';
      });
      h += '</div>';
      if (def.other) h += '<div class="other"><input type="text" id="pk-other" placeholder="' + T(multi ? 'Add another' : 'Type your own answer') + '" autocomplete="off">' +
        '<button type="button" class="btn small" data-a="other">' + T(multi ? 'Add' : 'Use') + '</button></div>';
      h += '<div class="sheet-foot">' + (value ? '<button type="button" class="btn ghost" data-a="clear">' + T('Clear') + '</button>' : '') +
        (multi ? '<button type="button" class="btn" data-a="done">' + T('Done') + '</button>' : '<button type="button" class="btn ghost" data-a="cancel">' + T('Cancel') + '</button>') + '</div>';
      return h;
    }
    var sh = openSheet(body());
    function finish(v) { closeSheet(); sh.onclick = null; apply(v); }
    function joined() { return asLines ? picked.join('\n') : picked.join(', '); }
    sh.onclick = function (e) {
      var o = e.target.closest('.opt');
      if (o) {
        var c = choices[+o.getAttribute('data-i')];
        if (!multi) { finish(c); return; }
        var at = picked.indexOf(c);
        if (at >= 0) picked.splice(at, 1); else picked.push(c);
        o.classList.toggle('on', at < 0);
        return;
      }
      var a = e.target.closest('[data-a]'); if (!a) return;
      var act = a.getAttribute('data-a');
      if (act === 'cancel') { closeSheet(); sh.onclick = null; }
      if (act === 'clear') finish('');
      if (act === 'done') finish(joined());
      if (act === 'other') {
        var inp = $('#pk-other'), t = inp.value.trim();
        if (!t) { inp.focus(); return; }
        if (!multi) { finish(t); return; }
        if (choices.indexOf(t) < 0) choices.unshift(t);
        if (picked.indexOf(t) < 0) picked.push(t);
        sh.innerHTML = '<div class="grab"></div>' + body();
      }
    };
    sh.onkeydown = function (e) { if (e.key === 'Enter' && e.target.id === 'pk-other') { e.preventDefault(); var b = sh.querySelector('[data-a="other"]'); if (b) b.click(); } };
  }
  // textarea list picker (subjects): keeps lines typed by hand, adds/removes the ticked ones
  function openListPicker(btn) {
    var ta = document.getElementById(btn.getAttribute('data-target'));
    var kind = btn.getAttribute('data-listpick');
    if (kind === 'duties' && App.hooks.dutiesPicker) { App.hooks.dutiesPicker(btn, ta); return; }
    if (kind === 'jobskills' && App.hooks.skillsPicker) { App.hooks.skillsPicker(btn, ta); return; }
    var def = PICK[btn.getAttribute('data-listpick')] || {};
    choicePicker(btn.getAttribute('data-label'), def, ta.value, true, function (v) {
      ta.value = v; ta.dispatchEvent(new Event('input', { bubbles: true }));
    }, true);
  }
  // date (year -> month -> day), month (year -> month) or year
  function datePicker(title, kind, def, value, apply) {
    var m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(value || '');
    var st = { y: m ? +m[1] : 0, m: m && m[2] ? +m[2] : 0, d: m && m[3] ? +m[3] : 0 };
    st.step = kind === 'year' || !st.y ? 'y' : (kind === 'month' || !st.m ? 'm' : 'd');
    if (kind === 'date' && st.y && st.m && st.d) st.step = 'd';
    var from = def.from || new Date().getFullYear(), to = def.to || 1950;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function result() {
      if (kind === 'year') return st.y ? String(st.y) : '';
      if (kind === 'month') return st.y && st.m ? st.y + '-' + pad(st.m) : '';
      return st.y && st.m && st.d ? st.y + '-' + pad(st.m) + '-' + pad(st.d) : '';
    }
    function body() {
      var h = '<h3>' + esc(T(title)) + '</h3>';
      if (kind !== 'year') {
        h += '<div class="dp-tabs">' +
          '<button type="button" class="dp-tab' + (st.step === 'y' ? ' on' : '') + '" data-step="y">' + (st.y || T('Year')) + '</button>' +
          '<button type="button" class="dp-tab' + (st.step === 'm' ? ' on' : '') + '" data-step="m"' + (st.y ? '' : ' disabled') + '>' + (st.m ? T(MONTHS[st.m - 1]) : T('Month')) + '</button>' +
          (kind === 'date' ? '<button type="button" class="dp-tab' + (st.step === 'd' ? ' on' : '') + '" data-step="d"' + (st.m ? '' : ' disabled') + '>' + (st.d || T('Day')) + '</button>' : '') + '</div>';
      }
      h += '<div class="dp-grid g-' + st.step + '">';
      if (st.step === 'y') for (var y = from; y >= to; y--) h += '<button type="button" class="dp-c' + (y === st.y ? ' on' : '') + '" data-y="' + y + '">' + y + '</button>';
      if (st.step === 'm') MONTHS.forEach(function (n, i) { var tn = T(n); h += '<button type="button" class="dp-c' + (tn === n ? '' : ' long') + (i + 1 === st.m ? ' on' : '') + '" data-m="' + (i + 1) + '">' + esc(tn === n ? n.slice(0, 3) : tn) + '</button>'; });
      if (st.step === 'd') { var dim = new Date(st.y, st.m, 0).getDate(); for (var d = 1; d <= dim; d++) h += '<button type="button" class="dp-c' + (d === st.d ? ' on' : '') + '" data-d="' + d + '">' + d + '</button>'; }
      h += '</div><div class="sheet-foot">' + (value ? '<button type="button" class="btn ghost" data-a="clear">' + T('Clear') + '</button>' : '') +
        '<button type="button" class="btn ghost" data-a="cancel">' + T('Cancel') + '</button></div>';
      return h;
    }
    var sh = openSheet(body());
    function redraw() {
      sh.innerHTML = '<div class="grab"></div>' + body();
      var on = sh.querySelector('.dp-c.on'); if (on) on.scrollIntoView({ block: 'center' });
    }
    redraw();
    function finish(v) { closeSheet(); sh.onclick = null; apply(v); }
    sh.onclick = function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.hasAttribute('data-step')) { st.step = b.getAttribute('data-step'); redraw(); return; }
      if (b.hasAttribute('data-y')) {
        st.y = +b.getAttribute('data-y');
        if (kind === 'year') { finish(result()); return; }
        st.step = 'm'; redraw(); return;
      }
      if (b.hasAttribute('data-m')) {
        st.m = +b.getAttribute('data-m');
        if (kind === 'month') { finish(result()); return; }
        var dim = new Date(st.y, st.m, 0).getDate(); if (st.d > dim) st.d = 0;
        st.step = 'd'; redraw(); return;
      }
      if (b.hasAttribute('data-d')) { st.d = +b.getAttribute('data-d'); finish(result()); return; }
      var a = b.getAttribute('data-a');
      if (a === 'clear') finish('');
      if (a === 'cancel') { closeSheet(); sh.onclick = null; }
    };
  }
  ed.addEventListener('input', onField);
  ed.addEventListener('change', onField);
  function idChanged(el) {
    var r = D.parseSAID(el.value), hint = el.parentNode.querySelector('[data-idhint]');
    if (hint) { hint.innerHTML = idHint(el.value); hint.className = 'hint ' + (el.value ? (r.valid ? 'good' : 'bad') : ''); }
    if (!r.valid) return;
    // fill empty fields, and update fields that still hold an earlier auto-filled value
    var p = S.cur.personal, auto = S.cur._auto || {}, changed = false;
    ['dob', 'gender', 'nationality'].forEach(function (k) {
      if (!r[k]) return;
      if ((!p[k] || p[k] === auto[k]) && p[k] !== r[k]) { p[k] = r[k]; changed = true; }
      auto[k] = r[k];
    });
    S.cur._auto = auto;
    if (changed) {
      ['dob', 'gender', 'nationality'].forEach(function (k) { var x = ed.querySelector('.pick[data-p="personal.' + k + '"]'); if (x) setPickBtn(x, p[k] || ''); });
      toast(T('Date of birth, gender and nationality filled in from your ID'));
    }
  }

  /* photo: crop to a centred square and shrink */
  $('#file-photo').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f || !S.cur) return;
    var rd = new FileReader();
    rd.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(img.width, img.height), N = 420;
        var cv = document.createElement('canvas'); cv.width = N; cv.height = N;
        var g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, N, N);
        g.drawImage(img, (img.width - s) / 2, (img.height - s) / 2 * 0.6, s, s, 0, 0, N, N);
        S.cur.photo = cv.toDataURL('image/jpeg', 0.85); S.cur.showPhoto = true; saveNow(); refreshSection('extras');
        toast(T('Photo added'));
      };
      img.onerror = function () { toast(T('That image could not be opened')); };
      img.src = rd.result;
    };
    rd.readAsDataURL(f);
  });

  /* ---------- templates ---------- */
  var FILTERS = [['all', 'All'], ['classic', 'Classic SA'], ['modern', 'Modern'], ['photo', 'With photo'], ['ats', 'Simple / job portals']];
  function renderTemplates() {
    var c = S.cur || { templateId: '', photo: '', showPhoto: true, personal: {} };
    var data = hasContent(c) ? c : Object.assign(D.sampleCV(), { photo: c.photo, showPhoto: c.showPhoto });
    if (!c.photo && !hasContent(c)) data.photo = '';
    var cw = Math.min(document.documentElement.clientWidth, 720), cols = cw >= 560 ? 3 : 2;
    var w = Math.max(120, Math.floor((cw - 28 + 14) / cols - 14));
    var h = '<div class="filters">' + FILTERS.map(function (f) { return '<button class="fchip' + (S.filter === f[0] ? ' on' : '') + '" data-f="' + f[0] + '">' + T(f[1]) + '</button>'; }).join('') + '</div>';
    h += '<div class="tgrid">';
    TP.list.forEach(function (t) {
      if (S.filter !== 'all' && t.tags.indexOf(S.filter) < 0) return;
      var on = c.templateId === t.id;
      h += '<button class="tcard' + (on ? ' on' : '') + '" data-t="' + t.id + '"><div class="tw" data-th="' + t.id + '" style="height:' + Math.round(w * 1123 / 794) + 'px">' + (on ? '<span class="badge">' + T('Selected') + '</span>' : '') + '</div>' +
        '<div class="tn">' + esc(t.name) + '</div><div class="tt">' + esc(T(t.tags.indexOf('classic') >= 0 ? 'Classic' : (t.tags.indexOf('photo') >= 0 ? 'Modern · photo' : 'Modern'))) + '</div></button>';
    });
    h += '</div>';
    var v = $('#v-tpl'); v.innerHTML = h;
    // draw thumbnails a few at a time so the screen stays responsive
    var cards = Array.prototype.slice.call(v.querySelectorAll('[data-th]'));
    var i = 0;
    (function step() {
      if (S.stack[S.stack.length - 1] !== 'tpl') return;
      for (var k = 0; k < 3 && i < cards.length; k++, i++) {
        var el = cards[i]; el.insertAdjacentHTML('beforeend', PG.thumb(data, el.getAttribute('data-th'), w));
        el.style.width = '';
      }
      if (i < cards.length) setTimeout(step, 16);
    })();
  }
  $('#v-tpl').addEventListener('click', function (e) {
    var f = e.target.closest('[data-f]');
    if (f) { S.filter = f.getAttribute('data-f'); renderTemplates(); return; }
    var t = e.target.closest('[data-t]');
    if (t && !S.cur) { startCV(t.getAttribute('data-t')); return; }
    if (t && S.cur) {
      S.cur.templateId = t.getAttribute('data-t'); saveNow();
      toast(T('{name} selected', { name: TP.get(S.cur.templateId).name }));
      if (S.stack[S.stack.length - 2] === 'prev') back(); else go('prev', true);
    }
  });

  /* ---------- supporting documents ---------- */
  var F = window.CVFiles;
  function docsOf(cv) { if (!cv.docs) cv.docs = []; if (!cv.docOpts) cv.docOpts = { labels: true, listOnCV: true, small: false }; return cv.docs; }
  function fileInUse(fileId) {
    if (App.hooks.fileInUse && App.hooks.fileInUse(fileId)) return true;
    return S.list.some(function (cv) { return (cv.docs || []).some(function (d) { return F.fileIds(d).indexOf(fileId) >= 0; }); });
  }
  function dropFiles(docs) { docs.forEach(function (d) { F.fileIds(d).forEach(dropFile); }); }
  function dropFile(id) { if (id && !fileInUse(id)) F.store.del(id).catch(function () {}); }
  function renderDocs() {
    var c = S.cur; if (!c) { S.stack = ['home']; render(); return; }
    var docs = docsOf(c), o = c.docOpts, v = $('#v-docs');
    var h = '<p class="docs-intro">' + T('Attach copies of your ID, matric certificate and qualifications. They are added after your CV in one PDF, labelled Annexure A, B, C…') + '</p>' +
      '<div class="docs-add"><button class="btn" data-d="cam">' + svg('camera') + T('Take a photo') + '</button><button class="btn soft" data-d="files">' + svg('file') + T('Choose files') + '</button></div>' +
      '<div class="docs-tip">' + T('Many employers ask for certified copies (stamped at a police station, not older than 3 months). Photograph or scan the stamped copy, flat and in good light.') + '</div>';
    if (!F.store.persistent) h += '<div class="docs-warn">' + T('This phone cannot keep documents after the app closes. Download your PDF before closing the app.') + '</div>';
    if (!docs.length) {
      h += '<div class="docs-empty">' + T('No documents yet. Photos (JPG, PNG) and PDF files can be added.') + '</div>';
    } else {
      h += '<div class="docs-list">';
      docs.forEach(function (d, i) {
        var np = d.kind === 'pdf' ? d.pages : F.partsOf(d).length;
        var th = d.kind === 'pdf' ? '<div class="doc-pdf"><b>PDF</b><span>' + T(np === 1 ? '1 page' : '{n} pages', { n: np }) + '</span></div>' :
          '<img src="' + F.partsOf(d)[0].thumb + '" alt="">' + (np > 1 ? '<span class="doc-np">' + np + '</span>' : '');
        var meta = (d.kind === 'pdf' ? T('PDF') : T(np === 1 ? 'Photo' : '{n} photo pages', { n: np })) + ', ' + F.fmtSize(F.estimate([d], false));
        h += '<div class="doc" data-i="' + i + '"><button class="doc-th" data-d="view" aria-label="View">' + th + '</button><div class="doc-m">' +
          '<div class="doc-k"><span>' + T('Annexure') + ' ' + F.letter(i) + '</span><button class="icon-btn danger" data-d="del" aria-label="Remove">' + svg('del') + '</button></div>' +
          '<button class="doc-type' + (d.type ? '' : ' unset') + '" data-d="type"><span>' + esc(d.type ? T(d.type) : T('Choose what this is')) + '</span>' + CHEV + '</button>' +
          '<div class="doc-s">' + esc(meta) + '</div>' +
          (d.locked ? '<div class="doc-lock">' + T('This PDF is password-protected and may come out blank. Add a photo of it instead.') + '</div>' : '') +
          '<div class="doc-acts">' +
          '<button class="icon-btn" data-d="up" aria-label="Move up"' + (i ? '' : ' disabled') + '>' + svg('up') + '</button>' +
          '<button class="icon-btn" data-d="down" aria-label="Move down"' + (i < docs.length - 1 ? '' : ' disabled') + '>' + svg('down') + '</button>' +
          (d.kind === 'image' ? '<button class="scan" data-d="pages">' + T('Pages, rotate, crop') + '</button>' +
            '<button class="scan' + (d.enhance ? ' on' : '') + '" data-d="scan">' + (d.enhance ? '\u2713 ' : '') + T('Scanner look') + '</button>' : '') +
          '</div></div></div>';
      });
      h += '</div>';
      var est = F.estimate(docs, o.small) + 60 * 1024;
      h += '<div class="docs-opts">' +
        '<label class="chk"><input type="checkbox" data-o="labels"' + (o.labels ? ' checked' : '') + '><span>' + T('Label each document (Annexure A, B…)') + '</span></label>' +
        '<label class="chk"><input type="checkbox" data-o="listOnCV"' + (o.listOnCV ? ' checked' : '') + '><span>' + T('List the documents at the end of my CV') + '</span></label>' +
        '<label class="chk"><input type="checkbox" data-o="small"' + (o.small ? ' checked' : '') + '><span>' + T('Make the PDF smaller (for email and job portals)') + '</span></label>' +
        '<div class="docs-size">' + T('CV and documents together: about {size}, {n} pages', { size: F.fmtSize(est), n: cvPagesGuess() + docs.reduce(function (t, d) { return t + (d.pages || 1); }, 0) }) + '</div></div>';
    }
    v.innerHTML = h;
  }
  function cvPagesGuess() { return S.layout && S.layout.pages ? S.layout.pages : 2; }
  $('#v-docs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-d]'); if (!b || b.disabled) return;
    var act = b.getAttribute('data-d'), c = S.cur, docs = docsOf(c);
    if (act === 'cam') { $('#file-cam').click(); return; }
    if (act === 'files') { $('#file-docs').click(); return; }
    var card = b.closest('.doc'); if (!card) return;
    var i = +card.getAttribute('data-i'), d = docs[i]; if (!d) return;
    if (act === 'type') { pickDocType(d); return; }
    if (act === 'up' || act === 'down') {
      var j = act === 'up' ? i - 1 : i + 1; if (j < 0 || j >= docs.length) return;
      docs[i] = docs[j]; docs[j] = d; saveNow(); renderDocs(); return;
    }
    if (act === 'pages') { pagesSheet(i); return; }
    if (act === 'scan') {
      d.enhance = !d.enhance; busy(T('Updating…'));
      F.refreshThumb(d).then(function () { done(); saveNow(); renderDocs(); }, function () { done(); saveNow(); renderDocs(); });
      return;
    }
    if (act === 'view') { viewDoc(d, i); return; }
    if (act === 'del') {
      confirmSheet(T('Remove this document?'), T('{name} will be removed from this CV.', { name: d.type ? T(d.type) : T('This document') }), T('Remove'), true).then(function (ok) {
        if (!ok) return;
        docs.splice(i, 1); saveNow(); dropFiles([d]); renderDocs(); toast(T('Document removed'));
      });
    }
  });
  $('#v-docs').addEventListener('change', function (e) {
    var k = e.target.getAttribute('data-o'); if (!k || !S.cur) return;
    S.cur.docOpts[k] = e.target.checked; saveNow(); renderDocs();
  });
  function pickDocType(d, after) {
    choicePicker(T('What is this document?'), PICK.doctype, d.type, false, function (v) {
      d.type = v; saveNow(); if (S.stack[S.stack.length - 1] === 'docs') renderDocs(); if (after) after();
    });
  }
  /* pages of one photo document: add, rotate, crop, reorder, remove */
  var pageTarget = null;
  function pagesSheet(i) {
    var d = docsOf(S.cur)[i]; if (!d) return;
    var ps = F.partsOf(d);
    var h = '<h3>' + esc(T('Annexure') + ' ' + F.letter(i) + ': ' + (d.type || T('Document'))) + '</h3><p>' + T('Each photo becomes one page of this document.') + '</p><div class="pg-list">';
    ps.forEach(function (p, j) {
      h += '<div class="pg-row" data-j="' + j + '"><img src="' + p.thumb + '" alt=""><div class="pg-rm"><b>' + T('Page {n}', { n: j + 1 }) + '</b><div class="pg-acts">' +
        '<button class="icon-btn" data-p="rot" aria-label="Rotate">' + svg('rotate') + '</button>' +
        '<button class="scan" data-p="crop">' + T('Crop') + '</button>' +
        '<button class="icon-btn" data-p="up"' + (j ? '' : ' disabled') + ' aria-label="Move up">' + svg('up') + '</button>' +
        '<button class="icon-btn" data-p="down"' + (j < ps.length - 1 ? '' : ' disabled') + ' aria-label="Move down">' + svg('down') + '</button>' +
        (ps.length > 1 ? '<button class="icon-btn danger" data-p="del" aria-label="Remove page">' + svg('del') + '</button>' : '') + '</div></div></div>';
    });
    h += '</div><div class="docs-add pg-add"><button class="btn soft" data-p="addcam">' + svg('camera') + T('Add page (camera)') + '</button><button class="btn soft" data-p="addfile">' + svg('file') + T('Add page (photo)') + '</button></div>' +
      '<div class="sheet-foot"><button type="button" class="btn ghost" data-p="close">' + T('Done') + '</button></div>';
    var sh = openSheet(h);
    sh.onclick = function (e) {
      var b = e.target.closest('[data-p]'); if (!b || b.disabled) return;
      var a = b.getAttribute('data-p'), row = b.closest('.pg-row'), j = row ? +row.getAttribute('data-j') : -1;
      if (a === 'close') { closeSheet(); renderDocs(); return; }
      if (a === 'addcam' || a === 'addfile') { pageTarget = d; closeSheet(); $(a === 'addcam' ? '#file-pagecam' : '#file-page').click(); return; }
      if (a === 'rot') { busy(T('Rotating…')); F.rotate(d, j).then(function () { done(); saveNow(); pagesSheet(i); }, function (err) { done(); toast(err.message); }); return; }
      if (a === 'crop') { closeSheet(); cropSheet(d, i, j); return; }
      if (a === 'up' || a === 'down') { F.movePage(d, j, a === 'up' ? -1 : 1); saveNow(); pagesSheet(i); return; }
      if (a === 'del') { var gone = F.removePage(d, j); saveNow(); dropFile(gone); pagesSheet(i); toast(T('Page removed')); }
    };
  }
  function addPagesFrom(list) {
    var d = pageTarget, files = Array.prototype.slice.call(list || []);
    pageTarget = null;
    if (!d || !files.length) return;
    var i = docsOf(S.cur).indexOf(d);
    busy(T('Adding page…'));
    var chain = Promise.resolve();
    files.forEach(function (f) {
      chain = chain.then(function () {
        if (/pdf/i.test(f.type) || /\.pdf$/i.test(f.name || '')) throw new Error(T('Add PDF files with "Choose files" on the documents screen.'));
        return F.addPage(d, f);
      });
    });
    chain.then(function () { done(); saveNow(); renderDocs(); if (i >= 0) pagesSheet(i); toast(T('Page added')); },
      function (err) { done(); saveNow(); renderDocs(); toast(err.message, 5000); });
  }
  $('#file-page').addEventListener('change', function (e) { var f = e.target.files; addPagesFrom(f); e.target.value = ''; });
  $('#file-pagecam').addEventListener('change', function (e) { var f = e.target.files; addPagesFrom(f); e.target.value = ''; });

  /* crop one page: drag the corners, or use the box the app found automatically */
  var cropCleanup = null;
  function cropSheet(d, i, j) {
    var url = null, box = { x: 0, y: 0, w: 1, h: 1 }, found = null;
    busy(T('Finding the document edges…'));
    Promise.all([F.exportImage(d, false, j), F.detectCrop(d, j).catch(function () { return null; })]).then(function (r) {
      done();
      url = F.bytesURL(r[0]); found = r[1];
      if (found) box = Object.assign({}, found);
      var sh = openSheet('<h3>' + T('Crop page {n}', { n: j + 1 }) + '</h3><p>' + (found ? T('The app found the document edges. Drag the corners to adjust.') : T('Drag the corners to the edges of the document.')) + '</p>' +
        '<div class="crop-host"><div class="crop-wrap"><img src="' + url + '" alt="" draggable="false"><div class="crop-shade"></div><div class="crop-box"><i class="ch tl"></i><i class="ch tr"></i><i class="ch bl"></i><i class="ch br"></i></div></div></div>' +
        '<div class="sheet-foot">' + (found ? '<button class="btn ghost" data-c="auto">' + T('Auto') + '</button>' : '') + '<button class="btn ghost" data-c="full">' + T('Whole photo') + '</button><button class="btn" data-c="ok">' + T('Crop') + '</button></div>');
      var wrap = sh.querySelector('.crop-wrap'), bx = sh.querySelector('.crop-box'), sd = sh.querySelector('.crop-shade');
      function draw() {
        bx.style.left = box.x * 100 + '%'; bx.style.top = box.y * 100 + '%'; bx.style.width = box.w * 100 + '%'; bx.style.height = box.h * 100 + '%';
        var L = box.x * 100, Tp = box.y * 100, R = (box.x + box.w) * 100, B = (box.y + box.h) * 100;
        sd.style.clipPath = 'polygon(0 0,100% 0,100% 100%,0 100%,0 0,' + L + '% ' + Tp + '%,' + L + '% ' + B + '%,' + R + '% ' + B + '%,' + R + '% ' + Tp + '%,' + L + '% ' + Tp + '%)';
      }
      draw();
      var drag = null;
      function pos(e) { var rc = wrap.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return { x: (t.clientX - rc.left) / rc.width, y: (t.clientY - rc.top) / rc.height }; }
      function start(e) {
        var hd = e.target.closest('.ch'), inBox = e.target.closest('.crop-box');
        if (!hd && !inBox) return;
        e.preventDefault();
        drag = { kind: hd ? hd.className.replace('ch ', '') : 'move', p: pos(e), b: Object.assign({}, box) };
      }
      function moveTo(e) {
        if (!drag) return;
        e.preventDefault();
        var p = pos(e), dx = p.x - drag.p.x, dy = p.y - drag.p.y, b = drag.b, MIN = 0.08;
        var x0 = b.x, y0 = b.y, x1 = b.x + b.w, y1 = b.y + b.h;
        if (drag.kind === 'move') { box = { x: Math.max(0, Math.min(1 - b.w, b.x + dx)), y: Math.max(0, Math.min(1 - b.h, b.y + dy)), w: b.w, h: b.h }; draw(); return; }
        if (/l/.test(drag.kind)) x0 = Math.max(0, Math.min(x1 - MIN, x0 + dx));
        if (/r/.test(drag.kind)) x1 = Math.min(1, Math.max(x0 + MIN, x1 + dx));
        if (/t/.test(drag.kind)) y0 = Math.max(0, Math.min(y1 - MIN, y0 + dy));
        if (/b/.test(drag.kind)) y1 = Math.min(1, Math.max(y0 + MIN, y1 + dy));
        box = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; draw();
      }
      function end() { drag = null; }
      wrap.addEventListener('touchstart', start, { passive: false }); wrap.addEventListener('mousedown', start);
      window.addEventListener('touchmove', moveTo, { passive: false }); window.addEventListener('mousemove', moveTo);
      window.addEventListener('touchend', end); window.addEventListener('mouseup', end);
      cropCleanup = function () {
        window.removeEventListener('touchmove', moveTo); window.removeEventListener('mousemove', moveTo);
        window.removeEventListener('touchend', end); window.removeEventListener('mouseup', end);
        if (url) URL.revokeObjectURL(url); url = null; cropCleanup = null;
      };
      sh.onclick = function (e) {
        var b = e.target.closest('[data-c]'); if (!b) return;
        var a = b.getAttribute('data-c');
        if (a === 'auto' && found) { box = Object.assign({}, found); draw(); return; }
        if (a === 'full') { box = { x: 0, y: 0, w: 1, h: 1 }; draw(); return; }
        if (a === 'ok') {
          if (cropCleanup) cropCleanup(); closeSheet();
          if (box.w > 0.995 && box.h > 0.995) { pagesSheet(i); return; }
          busy(T('Cropping…'));
          F.crop(d, j, box).then(function () { done(); saveNow(); renderDocs(); pagesSheet(i); toast(T('Page cropped')); }, function (err) { done(); toast(err.message); });
        }
      };
    }, function (err) { done(); toast(err.message); });
  }

  function viewDoc(d, i) {
    if (d.kind === 'pdf') { toast(T('PDF files are added to your CV exactly as they are')); return; }
    if (F.partsOf(d).length > 1) { pagesSheet(i); return; }
    F.exportImage(d, false).then(function (bytes) {
      var url = F.bytesURL(bytes);
      var sh = openSheet('<h3>' + T('Annexure') + ' ' + F.letter(i) + ': ' + esc(d.type ? T(d.type) : T('Document')) + '</h3><div class="doc-view"><img src="' + url + '" alt=""></div>' +
        '<div class="sheet-foot"><button type="button" class="btn ghost" data-a="close">' + T('Close') + '</button></div>');
      sh.onclick = function (e) { if (e.target.closest('[data-a="close"]')) { closeSheet(); URL.revokeObjectURL(url); } };
    });
  }
  function addFiles(list) {
    var files = Array.prototype.slice.call(list || []);
    if (!files.length || !S.cur) return;
    var docs = docsOf(S.cur), added = [], errors = [];
    busy(files.length > 1 ? T('Adding {n} documents…', { n: files.length }) : T('Adding document…'));
    var chain = Promise.resolve();
    files.forEach(function (f) {
      chain = chain.then(function () {
        return F.importFile(f).then(function (d) { docs.push(d); added.push(d); }, function (err) { errors.push(err.message); });
      });
    });
    chain.then(function () {
      done(); saveNow(); renderDocs();
      if (errors.length) toast(errors[0], 5000);
      else if (added.length) toast(added.length === 1 ? T('Document added') : T('{n} documents added', { n: added.length }));
      var unnamed = added.filter(function (d) { return !d.type; });
      if (unnamed.length === 1) pickDocType(unnamed[0]);
    });
  }
  $('#file-docs').addEventListener('change', function (e) { var f = e.target.files; addFiles(f); e.target.value = ''; });
  $('#file-cam').addEventListener('change', function (e) { var f = e.target.files; addFiles(f); e.target.value = ''; });

  /* ---------- preview & export ---------- */
  var layoutSeq = 0, previewURLs = [];
  var TABS = [['cv', 'CV'], ['letter', 'Cover letter'], ['z83', 'Z83 form']];
  function hasLetter(c) { return !!(c.letter && c.letter.position); }
  function hasZ83(c) { return !!(c.z83 && c.z83.position); }
  function renderPreview() {
    var c = S.cur; if (!c) return;
    var t = TP.get(c.templateId), v = $('#v-prev'), tab = S.pvTab || 'cv';
    previewURLs.forEach(function (u) { URL.revokeObjectURL(u); }); previewURLs = [];
    var h = '<div class="pv-tabs">' + TABS.map(function (x) {
      var dot = (x[0] === 'letter' && hasLetter(c)) || (x[0] === 'z83' && hasZ83(c));
      return '<button class="pv-tab' + (tab === x[0] ? ' on' : '') + '" data-tab="' + x[0] + '">' + esc(T(x[1])) + (dot ? '<i class="pv-dot"></i>' : '') + '</button>';
    }).join('') + '</div>';
    if (tab === 'cv') {
      h += '<div class="pv-info"><div class="tname">' + esc(T(t.name)) + '</div><button class="btn soft small" data-pv="design">' + svg('palette') + T('Design') + '</button>' +
        '<button class="btn soft small" data-pv="tpl">' + T('Template') + '</button></div><div id="pv-check"></div>';
    } else if (tab === 'letter') {
      if (!hasLetter(c)) {
        v.innerHTML = h + emptyCard('letter'); return;
      }
      h += '<div class="pv-info"><div class="tname">' + esc(T('Cover letter')) + '</div><button class="btn soft small" data-pv="letter">' + svg('edit') + T('Edit letter') + '</button></div>';
    } else {
      if (!hasZ83(c)) { v.innerHTML = h + emptyCard('z83'); return; }
      h += '<div class="pv-info"><div class="tname">' + esc(T('Z83 form')) + '</div><button class="btn soft small" data-pv="z83">' + svg('edit') + T('Edit Z83') + '</button></div><div id="pv-z83miss"></div>';
    }
    h += '<div class="pages" id="pages"><div class="busy-card" style="box-shadow:none;background:none"><div class="spin"></div>' + T('Preparing preview…') + '</div></div><div id="pv-docs"></div>';
    v.innerHTML = h;
    var seq = ++layoutSeq;
    var job = tab === 'cv' ? PG.layout(c, c.templateId) : PG.layoutDoc(tab === 'letter' ? window.CVLetter.render(c) : window.CVZ83.render(c));
    job.then(function (res) {
      if (seq !== layoutSeq) return;
      if (tab === 'cv') S.layout = res;
      var w = Math.min($('#v-prev').clientWidth || 360, 620);
      PG.renderPages(res, $('#pages'), w);
      if (tab === 'cv') { previewDocs(c, w, seq); if (App.hooks.checkCard) App.hooks.checkCard($('#pv-check'), c, res.pages); }
      if (tab === 'z83') z83Missing(c);
    }).catch(function (err) { $('#pages').textContent = T('Could not show the preview:') + ' ' + err.message; });
  }
  function emptyCard(kind) {
    if (kind === 'letter') return '<div class="pv-empty">' + svg('mail') + '<b>' + T('Add a cover letter') + '</b><p>' +
      T('Most employers ask for a cover letter. Fill in the job details and the letter is written for you from your CV. You can change every word.') + '</p>' +
      '<button class="btn" data-pv="letter">' + T('Write cover letter') + '</button></div>';
    return '<div class="pv-empty">' + svg('form') + '<b>' + T('Z83 for government jobs') + '</b><p>' +
      T('Public service (government) jobs need the Z83 application form. Most answers are filled in from your CV. You add the job details and answer the yes/no questions.') + '</p>' +
      '<button class="btn" data-pv="z83">' + T('Fill in Z83') + '</button></div>';
  }
  function z83Missing(c) {
    var el = $('#pv-z83miss'); if (!el) return;
    var miss = window.CVZ83.missing(c);
    el.innerHTML = miss.length ? '<button class="pv-warn" data-pv="z83">' + svg('info') + '<span><b>' + T('{n} things still to complete', { n: miss.length }) + '</b><small>' +
      esc(miss.slice(0, 3).map(function (m) { return T(m[1]); }).join(', ')) + (miss.length > 3 ? '…' : '') + '</small></span></button>' : '';
  }
  function previewDocs(c, w, seq) {
    var box = $('#pv-docs'), docs = docsOf(c);
    if (!box) return;
    if (!docs.length) {
      box.innerHTML = '<button class="pv-attach" data-pv="docs">' + svg('attach') + '<span><b>' + T('Attach supporting documents') + '</b><small>' + T('ID copy, matric certificate, qualifications') + '</small></span></button>';
      return;
    }
    var o = c.docOpts, h = '<div class="pv-dh"><b>' + T('Supporting documents') + '</b><button class="btn soft small" data-pv="docs">' + T('Change') + '</button></div><div class="pages">';
    var jobs = [];
    docs.forEach(function (d, i) {
      var lab = F.label(d, i);
      if (d.kind === 'pdf') {
        h += '<div class="pv-pdf" style="width:' + w + 'px">' + svg('file') + '<span><b>' + esc(lab) + '</b><small>' + T('PDF, {n} pages, added exactly as it is', { n: d.pages }) + '</small></span></div>';
        return;
      }
      (d.parts || []).forEach(function (pt, j) {
        var land = pt.w > pt.h * 1.05, pw = w, ph = Math.round(w * (land ? 595.28 / 841.89 : 841.89 / 595.28)), k = pw / (land ? 841.89 : 595.28);
        var showLab = o.labels && j === 0;
        h += '<div class="pg-sheet pv-doc" style="width:' + pw + 'px;height:' + ph + 'px">' +
          (showLab ? '<div class="pv-lab" style="left:' + Math.round(32 * k) + 'px;top:' + Math.round(26 * k) + 'px;font-size:' + Math.max(6, 10 * k).toFixed(1) + 'px;right:' + Math.round(32 * k) + 'px">' + esc(lab) + '</div>' : '') +
          '<div class="pv-img" data-k="' + i + '-' + j + '" style="left:' + Math.round(32 * k) + 'px;right:' + Math.round(32 * k) + 'px;top:' + Math.round((32 + (showLab ? 30 : 0)) * k) + 'px;bottom:' + Math.round(32 * k) + 'px"></div></div>' +
          '<div class="pg-no">' + T('Annexure') + ' ' + F.letter(i) + ((d.parts || []).length > 1 ? ' – ' + T('page {n}', { n: j + 1 }) : '') + '</div>';
        jobs.push([d, j, i]);
      });
    });
    box.innerHTML = h + '</div>';
    jobs.forEach(function (x) {
      F.exportImage(x[0], false, x[1]).then(function (bytes) {
        if (seq !== layoutSeq) return;
        var u = F.bytesURL(bytes); previewURLs.push(u);
        var el = box.querySelector('.pv-img[data-k="' + x[2] + '-' + x[1] + '"]'); if (el) el.innerHTML = '<img src="' + u + '" alt="">';
      }).catch(function () {});
    });
  }
  $('#v-prev').addEventListener('click', function (e) {
    var tb = e.target.closest('[data-tab]');
    if (tb) { S.pvTab = tb.getAttribute('data-tab'); renderPreview(); return; }
    var b = e.target.closest('[data-pv]'); if (!b) return;
    var k = b.getAttribute('data-pv');
    if (k === 'tpl') go('tpl');
    if (k === 'docs') go('docs');
    if (k === 'design' || k === 'letter' || k === 'z83') go(k);
  });

  function fileBase(cv) {
    var n = (TP.displayName(cv) || 'My').replace(/[\\\/:*?"<>|]+/g, '').trim();
    return 'CV - ' + n;
  }
  function personName(cv) { return fileBase(cv).slice(5); }
  function safeFile(s) { return String(s || '').replace(/[\\\/:*?"<>|]+/g, '').trim(); }

  /* the download sheet: choose what goes into the application, then save/share/print */
  function packParts(c) {
    var parts = [];
    if (hasZ83(c)) parts.push(['z83', 'Z83 form']);
    if (hasLetter(c)) parts.push(['letter', 'Cover letter']);
    parts.push(['cv', 'CV']);
    if (docsOf(c).length) parts.push(['docs', 'Supporting documents']);
    return parts;
  }
  function packSel(c) {
    if (!c.pack) c.pack = {};
    var sel = {};
    packParts(c).forEach(function (p) { sel[p[0]] = c.pack[p[0]] !== false; });
    if (!Object.keys(sel).some(function (k) { return sel[k]; })) sel.cv = true;
    return sel;
  }
  function downloadSheet() {
    if (!S.cur) return;
    var c = S.cur, parts = packParts(c), sel = packSel(c), docs = docsOf(c);
    var job = (hasLetter(c) && c.letter) || (hasZ83(c) && c.z83) || null;
    var h = '<h3>' + T('Download') + '</h3>';
    if (App.hooks.checkRow) h += App.hooks.checkRow(c);
    if (parts.length > 1) {
      h += '<div class="sheet-sec">' + T('Put together in this order') + '</div><div class="pack">' + parts.map(function (p, i) {
        var sub = p[0] === 'docs' ? T('{n} documents', { n: docs.length }) : (p[0] === 'z83' ? T('For government jobs') : '');
        return '<label class="pack-row"><input type="checkbox" data-part="' + p[0] + '"' + (sel[p[0]] ? ' checked' : '') + '><span class="pack-n">' + (i + 1) + '</span><span><b>' + T(p[1]) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></label>';
      }).join('') + '</div>';
    }
    h += '<div class="btns"><button class="btn" data-x="save">' + svg('pdf') + T('Save PDF') + '</button><button class="btn soft" data-x="share">' + svg('share') + T('Share') + '</button></div>';
    if (parts.length > 1) h += '<button class="sheet-item" data-x="split">' + svg('attach') + '<span>' + T('Share as separate files') + '<small>' + T('One PDF for each part you ticked') + '</small></span></button>';
    h += '<button class="sheet-item" data-x="print">' + svg('print') + '<span>' + T('Print') + '</span></button>';
    h += '<div class="sheet-sec">' + T('Word files (to edit later)') + '</div>' +
      '<button class="sheet-item" data-x="docx-cv">' + svg('word') + '<span>' + T('CV as Word (.docx)') + '</span></button>' +
      (hasLetter(c) ? '<button class="sheet-item" data-x="docx-letter">' + svg('word') + '<span>' + T('Cover letter as Word (.docx)') + '</span></button>' : '');
    if (job && App.hooks.trackApply) h += '<label class="chk pack-track"><input type="checkbox" id="pk-track"' + (c.trackOff ? '' : ' checked') + '><span>' + T('Add this job to my application tracker') + '</span></label>';
    var adds = [];
    if (!hasLetter(c)) adds.push('<button class="sheet-item" data-x="go-letter">' + svg('mail') + '<span>' + T('Add a cover letter') + '</span></button>');
    if (!docs.length) adds.push('<button class="sheet-item" data-x="go-docs">' + svg('attach') + '<span>' + T('Attach supporting documents') + '</span></button>');
    if (!hasZ83(c)) adds.push('<button class="sheet-item" data-x="go-z83">' + svg('form') + '<span>' + T('Fill in a Z83 (government jobs)') + '</span></button>');
    if (adds.length) h += '<div class="sheet-sec">' + T('Add to your application') + '</div>' + adds.join('');
    var sh = openSheet(h);
    sh.onchange = function (e) {
      var k = e.target.getAttribute('data-part');
      if (k) { c.pack[k] = e.target.checked; saveSoon(); }
      if (e.target.id === 'pk-track') { c.trackOff = !e.target.checked; saveSoon(); }
    };
    sh.onclick = function (e) {
      var b = e.target.closest('[data-x]'); if (!b) return;
      var x = b.getAttribute('data-x');
      if (x === 'check') { closeSheet(); if (App.hooks.checkSheet) App.hooks.checkSheet(c); return; }
      closeSheet();
      if (x.indexOf('go-') === 0) { go(x.slice(3)); return; }
      var track = $('#pk-track') ? $('#pk-track').checked : false;
      exportPack(x, packSel(c), job && !c.trackOff);
    };
  }
  function buildPart(c, k, meta) {
    if (k === 'cv') return PG.layout(c, c.templateId).then(function (res) { S.layout = res; return window.CVPdf.make(res, meta); });
    if (k === 'letter') return PG.layoutDoc(window.CVLetter.render(c)).then(function (res) { return window.CVPdf.make(res, { title: 'Cover letter - ' + TP.displayName(c), author: meta.author }); });
    if (k === 'z83') return PG.layoutDoc(window.CVZ83.render(c)).then(function (res) { return window.CVPdf.make(res, { title: 'Z83 - ' + TP.displayName(c), author: meta.author }); });
    return Promise.resolve(null);
  }
  var PART_FILE = { z83: 'Z83', letter: 'Cover letter', cv: 'CV', docs: 'Supporting documents' };
  function exportPack(mode, sel, track) {
    var c = S.cur; saveNow();
    var docs = docsOf(c), o = c.docOpts, name = personName(c);
    var meta = { title: 'Curriculum Vitae - ' + TP.displayName(c), author: D.fullName(c), labels: o.labels, small: o.small };
    var MIME_DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    var order = ['z83', 'letter', 'cv', 'docs'].filter(function (k) { return sel[k]; });
    if (mode === 'docx-cv' || mode === 'docx-letter') {
      busy(T('Creating Word file…'));
      var p = mode === 'docx-cv' ? PG.layout(c, c.templateId).then(function (res) { return window.CVDocx.make(c, c.templateId, res.opts); }) : window.CVDocx.letter(c);
      p.then(function (bytes) {
        done(); lastSize = bytes.length;
        deliverMany([{ bytes: bytes, name: (mode === 'docx-cv' ? 'CV' : 'Cover letter') + ' - ' + name + '.docx', mime: MIME_DOCX }], 'save');
      }).catch(fail);
      return;
    }
    busy(order.length > 1 ? T('Putting your application together…') : T('Creating PDF…'));
    var built = {}, chain = Promise.resolve();
    order.forEach(function (k) {
      if (k === 'docs') return;
      chain = chain.then(function () { return buildPart(c, k, meta).then(function (b) { built[k] = b; }); });
    });
    chain.then(function () {
      if (mode === 'split') {
        var files = [], ch2 = Promise.resolve();
        order.forEach(function (k) {
          ch2 = ch2.then(function () {
            if (k === 'docs') return F.bundle(null, docs, meta).then(function (b) { files.push({ bytes: b, name: PART_FILE[k] + ' - ' + name + '.pdf', mime: 'application/pdf' }); });
            files.push({ bytes: built[k], name: PART_FILE[k] + ' - ' + name + '.pdf', mime: 'application/pdf' });
          });
        });
        return ch2.then(function () { return files; });
      }
      var bases = order.filter(function (k) { return k !== 'docs'; }).map(function (k) { return built[k]; });
      var fname = order.length === 1 ? PART_FILE[order[0]] + ' - ' + name + '.pdf' :
        'Application - ' + name + (jobTitle(c) ? ' - ' + safeFile(jobTitle(c)) : '') + '.pdf';
      return F.bundle(bases, sel.docs ? docs : [], meta).then(function (all) { return [{ bytes: all, name: fname, mime: 'application/pdf' }]; });
    }).then(function (files) {
      lastSize = files.reduce(function (t, f) { return t + f.bytes.length; }, 0);
      deliverMany(files, mode === 'split' ? 'share' : mode);
      done();
      if (track && App.hooks.trackApply) App.hooks.trackApply(c);
      if (S.stack[S.stack.length - 1] === 'prev' && (S.pvTab || 'cv') === 'cv' && S.layout) { var w = Math.min($('#v-prev').clientWidth || 360, 620); PG.renderPages(S.layout, $('#pages'), w); }
    }).catch(fail);
    function fail(err) { done(); toast(T('Something went wrong:') + ' ' + (err && err.message ? err.message : err), 5000); }
  }
  function jobTitle(c) { return (c.letter && c.letter.position) || (c.z83 && c.z83.position) || ''; }
  var lastSize = 0;
  function b64(bytes) {
    var s = '', CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    return btoa(s);
  }
  // hands a file to the Android app in pieces, so large PDFs pass safely
  function sendNative(f) {
    var CH = 192 * 1024;
    NATIVE.begin(f.name);
    for (var off = 0; off < f.bytes.length; off += CH) NATIVE.append(f.name, b64(f.bytes.subarray(off, off + CH)));
  }
  function deliver(bytes, name, mime, mode) { deliverMany([{ bytes: bytes, name: name, mime: mime }], mode); }
  function deliverMany(files, mode) {
    if (NATIVE && NATIVE.begin) {
      files.forEach(sendNative);
      if (mode === 'share') NATIVE.share(JSON.stringify(files.map(function (f) { return f.name; })));
      else if (mode === 'print') NATIVE.print(files[0].name);
      else if (files.length > 1 && NATIVE.saveMany) NATIVE.saveMany(JSON.stringify(files.map(function (f) { return f.name; })));
      else NATIVE.save(files[0].name, files[0].mime);
      return;
    }
    // iPhones keep downloads poorly (especially from the home-screen app), so "save" opens the share sheet there ("Save to Files")
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if ((mode === 'share' || (mode === 'save' && ios)) && navigator.canShare) {
      var list = files.map(function (f) { return new File([f.bytes], f.name, { type: f.mime }); });
      if (navigator.canShare({ files: list })) { navigator.share({ files: list, title: files[0].name }).catch(function () {}); return; }
    }
    if (mode === 'print' && files[0].mime === 'application/pdf') {
      var url = URL.createObjectURL(new Blob([files[0].bytes], { type: 'application/pdf' })); var w = window.open(url); if (w) return;
    }
    files.forEach(function (f) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([f.bytes], { type: f.mime })); a.download = f.name;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    });
    toast(T('Downloaded {name}', { name: files.map(function (f) { return f.name; }).join(', ') }) + ' (' + F.fmtSize(lastSize) + ')');
  }
  // called by the Android app after saving / sharing
  window.onNativeResult = function (ok, msg) {
    if (!msg) return;
    var to = /^Saved to (.*)$/.exec(msg), many = /^Saved (\d+) files$/.exec(msg), tm = /^Saved (.*)$/.exec(msg);
    var shown = to ? T('Saved to {where}', { where: to[1] }) : many ? T('Saved {n} files', { n: many[1] }) : tm ? T('Saved {name}', { name: tm[1] }) : T(msg);
    toast(ok && tm && lastSize ? shown + ' (' + F.fmtSize(lastSize) + ')' : shown, ok ? 3000 : 4500);
  };

  /* ---------- backup (CVs and their documents) ---------- */
  function backup() {
    saveNow();
    if (!S.list.length) { toast(T('There are no CVs to back up yet')); return; }
    var ids = {};
    S.list.forEach(function (cv) { (cv.docs || []).forEach(function (d) { F.fileIds(d).forEach(function (id) { ids[id] = 1; }); }); });
    var files = {}, keys = Object.keys(ids);
    busy(T('Preparing backup…'));
    var chain = Promise.resolve();
    keys.forEach(function (k) { chain = chain.then(function () { return F.store.get(k).then(function (b) { if (b) files[k] = b64(b); }); }); });
    chain.then(function () {
      var d = new Date(), stamp = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      var json = JSON.stringify({ app: 'cv-maker-sa', version: 2, exported: d.toISOString(), cvs: S.list, files: files });
      var bytes = new TextEncoder().encode(json);
      lastSize = bytes.length; done();
      deliver(bytes, 'CV Maker backup ' + stamp + '.json', 'application/json', 'save');
    }, function (err) { done(); toast(T('Backup failed: ') + err.message); });
  }
  $('#file-restore').addEventListener('change', function (e) {
    var f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var data, arr;
      try {
        data = JSON.parse(rd.result);
        arr = Array.isArray(data) ? data : data.cvs;
        if (!Array.isArray(arr)) throw new Error('not a backup');
      } catch (err) { toast(T('That file is not a CV Maker backup')); return; }
      busy(T('Restoring…'));
      var files = (data && data.files) || {}, chain = Promise.resolve();
      Object.keys(files).forEach(function (k) {
        chain = chain.then(function () {
          var s = atob(files[k]), u = new Uint8Array(s.length);
          for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
          return F.store.put(k, u);
        });
      });
      chain.then(function () {
        var n = 0;
        arr.forEach(function (raw) {
          var cv = D.normalise(raw), i = S.list.findIndex(function (x) { return x.id === cv.id; });
          if (i < 0) { S.list.push(cv); n++; } else if ((cv.updated || 0) > (S.list[i].updated || 0)) { S.list[i] = cv; n++; }
        });
        D.saveAll(S.list); done(); renderHome(); toast(n ? T(n === 1 ? 'Restored 1 CV' : 'Restored {n} CVs', { n: n }) : T('Nothing new in that backup'));
      }, function (err) { done(); toast(T('Restore failed: ') + err.message); });
    };
    rd.readAsText(f);
  });

  // remove stored document files that no CV uses any more
  function cleanFiles() {
    if (!S.list.length && !(App.hooks.fileInUse)) return;
    F.store.keys().then(function (keys) {
      keys.forEach(function (k) { if (!fileInUse(k)) F.store.del(k).catch(function () {}); });
    }).catch(function () {});
  }

  window.App = {
    S: S, $: $, esc: esc, svg: svg, ICON: ICON, T: T, toast: toast, busy: busy, done: done, openSheet: openSheet, closeSheet: closeSheet,
    confirmSheet: confirmSheet, choicePicker: choicePicker, datePicker: datePicker, go: go, back: back, render: render, saveNow: saveNow,
    saveSoon: saveSoon, deliverMany: deliverMany, fileBase: fileBase, b64: b64, PICK: PICK, VIEWS: VIEWS, ACTIONS: EXTRA_ACTIONS, cvTitle: cvTitle,
    renderHome: renderHome, docsOf: docsOf, fmtDate: fmtDateT, setLastSize: function (n) { lastSize = n; }, fileInUse: fileInUse, dropFiles: dropFiles,
    pickDocType: pickDocType, refreshSection: function (id) { refreshSection(id); }, hooks: {}, fmtWhen: fmtWhen, viewEl: viewEl, renderDocs: function () { renderDocs(); },
    MONTHS: MONTHS
  };

  // hide the bottom buttons while the on-screen keyboard is open (the screen gets shorter)
  var baseH = window.innerHeight;
  function kbCheck() {
    var h = window.innerHeight; if (h > baseH) baseH = h;
    var a = document.activeElement;
    var editing = a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && a.type !== 'checkbox'));
    document.body.classList.toggle('typing', !!editing && h < baseH * 0.8);
  }
  window.addEventListener('resize', kbCheck);
  window.addEventListener('orientationchange', function () { setTimeout(function () { baseH = window.innerHeight; kbCheck(); }, 400); });
  document.addEventListener('focusin', function () { setTimeout(kbCheck, 350); });
  document.addEventListener('focusout', function () { setTimeout(kbCheck, 100); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) saveNow(); });
  window.addEventListener('pagehide', saveNow);
  render();
  // warm up fonts used by the app and the classic template
  PG.fontsFor(TP.get('classic'));
  setTimeout(cleanFiles, 4000);
})();
