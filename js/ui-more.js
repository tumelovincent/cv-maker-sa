/* Screens and helpers: CV check, suggested duties, application tracker, design, PIN lock */
(function () {
  'use strict';
  var A = window.App, D = window.CVData, TP = window.CVTemplates, PG = window.CVPaginate;
  var $ = A.$, esc = A.esc, svg = A.svg, T = A.T, S = A.S;
  var NATIVE = window.AndroidBridge || null;
  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoToday() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function daysUntil(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); if (!m) return null;
    var t = new Date(+m[1], +m[2] - 1, +m[3]), n = new Date(); n = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    return Math.round((t - n) / 86400000);
  }

  /* ================= CV check ================= */
  function openSection(sec) {
    if (sec === 'docs') { A.go('docs'); return; }
    if (sec === 'design') { A.go('design'); return; }
    S.open = {}; S.open[sec] = true;
    var i = S.stack.lastIndexOf('edit');
    if (i >= 0) { S.stack = S.stack.slice(0, i + 1); A.render(); } else A.go('edit');
    setTimeout(function () { var el = document.querySelector('[data-sec="' + sec + '"]'); if (el) el.scrollIntoView({ block: 'start' }); }, 80);
  }
  function counts(items) { var f = 0, t = 0; items.forEach(function (x) { if (x.level === 'fix') f++; else t++; }); return { f: f, t: t }; }
  A.hooks.checkCard = function (el, cv, pages) {
    if (!el) return;
    var items = window.CVCheck.run(cv, pages), n = counts(items);
    if (!items.length) { el.innerHTML = '<div class="pv-warn good">' + svg('check') + '<span><b>' + T('CV check: looks good') + '</b><small>' + T('Nothing important is missing.') + '</small></span></div>'; return; }
    el.innerHTML = '<button class="pv-warn' + (n.f ? '' : ' good') + '" data-chk="1">' + svg(n.f ? 'info' : 'check') + '<span><b>' +
      (n.f ? T('CV check: {n} things to fix', { n: n.f }) : T('CV check: looks good')) + '</b><small>' +
      (n.t ? T('{n} tips to make it better', { n: n.t }) : '') + '</small></span></button>';
    el.firstChild.onclick = function () { A.hooks.checkSheet(cv); };
  };
  A.hooks.checkRow = function (cv) {
    var n = counts(window.CVCheck.run(cv, S.layout && S.layout.pages));
    if (!n.f) return '';
    return '<button class="pv-warn sheet-warn" data-x="check">' + svg('info') + '<span><b>' + T('CV check: {n} things to fix', { n: n.f }) + '</b><small>' + T('Tap to see them before you send your CV') + '</small></span></button>';
  };
  A.hooks.checkSheet = function (cv) {
    var items = window.CVCheck.run(cv, S.layout && S.layout.pages);
    var h = '<h3>' + T('CV check') + '</h3>';
    if (!items.length) h += '<p>' + T('Nothing important is missing.') + '</p>';
    h += '<div class="chk-list">' + items.map(function (x, i) {
      return '<div class="chk-it ' + x.level + '"><span class="chk-b">' + T(x.level === 'fix' ? 'Fix' : 'Tip') + '</span><span class="chk-t">' + esc(T(x.text, x.vars)) + '</span>' +
        '<button class="btn soft small" data-ci="' + i + '">' + T('Go') + '</button></div>';
    }).join('') + '</div><div class="sheet-foot"><button class="btn ghost" data-ci="close">' + T('Close') + '</button></div>';
    var sh = A.openSheet(h);
    sh.onclick = function (e) {
      var b = e.target.closest('[data-ci]'); if (!b) return;
      A.closeSheet();
      if (b.getAttribute('data-ci') !== 'close') openSection(items[+b.getAttribute('data-ci')].sec);
    };
  };

  /* ================= suggested duties and skills ================= */
  A.hooks.dutiesPicker = function (btn, ta) {
    var item = S.cur.work[+ta.getAttribute('data-i')] || {};
    var job = window.CVDuties.match(item.position);
    function pickFrom(j) {
      A.choicePicker(T('Duties for {job}', { job: T(j.t) }), { choices: j.d, other: true }, ta.value, true, function (v) {
        ta.value = v; ta.dispatchEvent(new Event('input', { bubbles: true }));
      }, true);
    }
    if (job) { pickFrom(job); return; }
    var names = window.CVDuties.JOBS.map(function (j) { return j.t; });
    A.choicePicker(T('Which job is closest to yours?'), { choices: names, other: false }, '', false, function (v) {
      var j = window.CVDuties.JOBS.filter(function (x) { return x.t === v; })[0];
      if (j) setTimeout(function () { pickFrom(j); }, 50);
    });
  };
  A.hooks.skillsPicker = function (btn, ta) {
    var list = window.CVDuties.skillsFor(S.cur);
    ['Computer literate (MS Word, Excel)', 'Customer service', 'Communication', 'Teamwork', 'Time management', 'Problem solving'].forEach(function (s) { if (list.indexOf(s) < 0) list.push(s); });
    A.choicePicker(T('Skills'), { choices: list, other: true }, ta.value, true, function (v) { ta.value = v; ta.dispatchEvent(new Event('input', { bubbles: true })); }, true);
  };

  /* ================= application tracker ================= */
  var KEY = 'cvmaker.apps.v1';
  var STATUS = ['Planning to apply', 'Applied', 'Interview', 'Offer', 'Not successful'];
  function apps() { try { var a = JSON.parse(safeGet(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function saveApps(list) { safeSet(KEY, JSON.stringify(list)); }
  function findApp(id) { return apps().filter(function (a) { return a.id === id; })[0]; }
  function putApp(a) { var l = apps(), i = l.findIndex(function (x) { return x.id === a.id; }); a.updated = Date.now(); if (i < 0) l.unshift(a); else l[i] = a; saveApps(l); schedule(a); }
  function delApp(id) { saveApps(apps().filter(function (a) { return a.id !== id; })); if (NATIVE && NATIVE.cancelRemind) NATIVE.cancelRemind(id); }
  function newApp() { return { id: 'a' + Date.now().toString(36), position: '', company: '', ref: '', source: '', closing: '', applied: '', status: 'Planning to apply', cvId: S.cur ? S.cur.id : '', notes: '', remind: true }; }
  // phone reminder at 09:00 two days before the closing date (or the day before)
  function remindAt(a) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(a.closing || ''); if (!m) return 0;
    var now = Date.now();
    for (var back = 2; back >= 1; back--) { var t = new Date(+m[1], +m[2] - 1, +m[3] - back, 9, 0, 0).getTime(); if (t > now + 60000) return t; }
    return 0;
  }
  function schedule(a) {
    if (!NATIVE || !NATIVE.remind) return;
    var when = a.remind && a.status === 'Planning to apply' ? remindAt(a) : 0;
    if (when) NATIVE.remind(a.id, String(when), T('Closing soon: {job}', { job: a.position || T('job application') }),
      T(a.company ? 'Applications for {job} at {company} close on {date}. Send your CV in time.' : 'Applications for {job} close on {date}. Send your CV in time.',
        { job: a.position || T('this job'), company: a.company || '', date: A.fmtDate(a.closing) }));
    else NATIVE.cancelRemind(a.id);
  }
  function closingText(a) {
    var n = daysUntil(a.closing); if (n === null) return '';
    if (n < 0) return T('Closed {date}', { date: A.fmtDate(a.closing) });
    if (n === 0) return T('Closes today');
    if (n === 1) return T('Closes tomorrow');
    return T('Closes in {n} days', { n: n });
  }
  function urgent() {
    return apps().filter(function (a) { var n = daysUntil(a.closing); return a.status === 'Planning to apply' && n !== null && n >= 0 && n <= 3; });
  }
  A.hooks.trackApply = function (cv) {
    var L = (cv.letter && cv.letter.position) ? cv.letter : null, Z = (cv.z83 && cv.z83.position) ? cv.z83 : null;
    var src = L || Z; if (!src) return;
    var pos = src.position, comp = L ? L.company : Z.department, ref = src.ref || '';
    var list = apps(), hit = list.filter(function (a) {
      return (ref && a.ref && a.ref.toLowerCase() === ref.toLowerCase()) || (a.position.toLowerCase() === pos.toLowerCase() && (a.company || '').toLowerCase() === (comp || '').toLowerCase());
    })[0];
    var a = hit || newApp();
    a.position = pos; a.company = comp || a.company; a.ref = ref || a.ref; a.source = (L && L.source) || a.source; a.cvId = cv.id;
    if (a.status === 'Planning to apply') { a.status = 'Applied'; a.applied = isoToday(); }
    putApp(a);
    setTimeout(function () { A.toast(T(hit ? 'Updated in your application tracker' : 'Added to your application tracker')); }, 1800);
  };
  A.hooks.homeApps = function () {
    var list = apps(), u = urgent();
    if (!list.length) return '';
    var h = '<section class="block"><div class="block-h"><h2>' + T('My applications') + '</h2><button class="see-all" data-home="apps">' + T('Open tracker') + '</button></div>';
    u.forEach(function (a) {
      h += '<button class="due" data-app="' + a.id + '">' + svg('bell') + '<span><b>' + esc(closingText(a)) + '</b><small>' + esc([a.position, a.company].filter(Boolean).join(' – ')) + '</small></span></button>';
    });
    var by = {}; list.forEach(function (a) { by[a.status] = (by[a.status] || 0) + 1; });
    h += '<div class="app-sum">' + STATUS.filter(function (s) { return by[s]; }).map(function (s) { return '<span><b>' + by[s] + '</b>' + esc(T(s)) + '</span>'; }).join('') + '</div></section>';
    return h;
  };
  function statusCls(s) { return 'st-' + STATUS.indexOf(s); }
  function renderApps(el) {
    var list = apps().sort(function (a, b) {
      var da = daysUntil(a.closing), db = daysUntil(b.closing);
      var oa = a.status === 'Planning to apply' && da !== null && da >= 0 ? da : 9999, ob = b.status === 'Planning to apply' && db !== null && db >= 0 ? db : 9999;
      return oa - ob || b.updated - a.updated;
    });
    var h = '<p class="docs-intro">' + T('Keep track of the jobs you apply for, with closing dates and reminders.') + '</p>' +
      '<button class="btn block" data-ap="new">' + svg('plus') + T('Add an application') + '</button>';
    if (!list.length) h += '<div class="docs-empty">' + T('No applications yet. When you download an application with a cover letter or Z83, it is added here for you.') + '</div>';
    else h += '<div class="app-list">' + list.map(function (a) {
      var ct = closingText(a), n = daysUntil(a.closing), hot = a.status === 'Planning to apply' && n !== null && n >= 0 && n <= 3;
      return '<button class="app-card" data-app="' + a.id + '"><div class="app-top"><b>' + esc(a.position || T('Untitled job')) + '</b><span class="st ' + statusCls(a.status) + '">' + esc(T(a.status)) + '</span></div>' +
        (a.company ? '<div class="app-co">' + esc(a.company) + '</div>' : '') +
        '<div class="app-meta">' + (ct ? '<span class="' + (hot ? 'hot' : '') + '">' + esc(ct) + '</span>' : '') + (a.applied ? '<span>' + T('Applied {date}', { date: A.fmtDate(a.applied) }) + '</span>' : '') + '</div></button>';
    }).join('') + '</div>';
    el.innerHTML = h;
  }
  var editing = null;
  function renderApp(el) {
    var a = editing || (editing = newApp());
    var cvName = (S.list.filter(function (c) { return c.id === a.cvId; })[0] || {});
    function f(k, label, ph) { return '<div class="fld"><label>' + esc(T(label)) + '</label><input type="text" data-af="' + k + '" value="' + esc(a[k] || '') + '"' + (ph ? ' placeholder="' + esc(T(ph)) + '"' : '') + ' autocomplete="off"></div>'; }
    function pk(k, label, shown) { return '<div class="fld"><label>' + esc(T(label)) + '</label><button type="button" class="pick' + (shown ? '' : ' empty') + '" data-apick="' + k + '"><span class="pv">' + esc(shown || T('Choose')) + '</span><svg class="pk-ch" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></button></div>'; }
    var h = '<div class="fcard">' + f('position', 'Job title', 'e.g. Admin Clerk') + f('company', 'Company or department') +
      '<div class="row2"><div class="cell">' + f('ref', 'Reference number') + '</div><div class="cell">' + f('source', 'Where advertised') + '</div></div></div>';
    h += '<div class="fcard">' + pk('status', 'Status', T(a.status)) +
      '<div class="row2"><div class="cell">' + pk('closing', 'Closing date', a.closing ? A.fmtDate(a.closing) : '') + '</div><div class="cell">' + pk('applied', 'Date applied', a.applied ? A.fmtDate(a.applied) : '') + '</div></div>' +
      '<label class="chk"><input type="checkbox" data-af="remind"' + (a.remind ? ' checked' : '') + (a.closing ? '' : ' disabled') + '><span>' + T('Remind me 2 days before the closing date') + '</span></label>' +
      '<div class="hint">' + T(NATIVE ? 'You get a phone notification, and a reminder on the front page.' : 'You see a reminder on the front page.') + '</div></div>';
    h += '<div class="fcard">' + pk('cvId', 'CV used', cvName.id ? A.cvTitle(cvName) : '') +
      '<div class="fld"><label>' + T('Notes') + '</label><textarea data-af="notes" rows="3" placeholder="' + esc(T('e.g. interview on Monday at 10:00, bring certified copies')) + '">' + esc(a.notes || '') + '</textarea></div></div>';
    h += '<button class="btn ghost block danger-ghost" data-ap="del">' + svg('del') + T('Delete this application') + '</button>';
    el.innerHTML = h;
  }
  function appsEvents() {
    var el = document.getElementById('v-apps');
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ap="new"]');
      if (b) { editing = newApp(); A.go('app'); return; }
      var c = e.target.closest('[data-app]');
      if (c) { editing = findApp(c.getAttribute('data-app')); if (editing) A.go('app'); }
    });
    var ed = document.getElementById('v-app');
    function persist() { if (editing && (editing.position || editing.company)) putApp(editing); }
    ed.addEventListener('input', function (e) { var k = e.target.getAttribute('data-af'); if (!k || !editing) return; editing[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; persist(); });
    ed.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-af'); if (!k || !editing) return;
      editing[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; persist();
      if (k === 'remind' && editing.remind && NATIVE && NATIVE.askNotify) NATIVE.askNotify();
    });
    ed.addEventListener('click', function (e) {
      var p = e.target.closest('[data-apick]');
      if (p) {
        var k = p.getAttribute('data-apick');
        var done = function (v) { editing[k] = v; if (k === 'closing' && v && editing.remind && NATIVE && NATIVE.askNotify) NATIVE.askNotify(); persist(); A.render(); };
        if (k === 'status') A.choicePicker(T('Status'), { tr: 1, choices: STATUS }, editing.status, false, function (v) { if (v === 'Applied' && !editing.applied) editing.applied = isoToday(); done(v); });
        if (k === 'closing') A.datePicker(T('Closing date'), 'date', { from: new Date().getFullYear() + 1, to: new Date().getFullYear() - 1 }, editing.closing, done);
        if (k === 'applied') A.datePicker(T('Date applied'), 'date', { from: new Date().getFullYear(), to: new Date().getFullYear() - 2 }, editing.applied, done);
        if (k === 'cvId') {
          var names = S.list.map(function (c) { return A.cvTitle(c); });
          A.choicePicker(T('CV used'), { choices: names }, '', false, function (v) { var c = S.list[names.indexOf(v)]; done(c ? c.id : ''); });
        }
        return;
      }
      if (e.target.closest('[data-ap="del"]')) {
        A.confirmSheet(T('Delete this application?'), T('It will be removed from your tracker.'), T('Delete'), true).then(function (ok) { if (ok) { delApp(editing.id); editing = null; A.back(); } });
      }
    });
  }
  A.VIEWS.apps = { title: function () { return T('Application tracker'); }, render: renderApps };
  A.VIEWS.app = { title: function () { return editing && editing.position ? editing.position : T('Application'); }, render: renderApp };
  // keep phone reminders in step (e.g. after the app was reinstalled)
  setTimeout(function () { apps().forEach(schedule); }, 3000);

  /* ================= design ================= */
  function designKeys(cv) {
    var fam = TP.get(cv.templateId).family;
    return D.sectionOrder(cv, fam === 'classic' ? 'classic' : 'modern');
  }
  function renderDesign(el) {
    var c = S.cur, d = c.design, t = TP.get(c.templateId);
    var names = {}; D.SECTIONS.forEach(function (x) { names[x[0]] = x[1]; });
    var h = '<div class="dz-prev"><div class="dz-pg" id="dz-pg"></div><div class="dz-cap">' + esc(T(t.name)) + '<button class="link" data-dz="tpl">' + T('Change template') + '</button></div></div>';
    h += '<div class="fcard"><div class="fcard-h"><b>' + T('Colour') + '</b></div><div class="sw">' +
      '<button class="swc def' + (!d.accent ? ' on' : '') + '" data-col="" aria-label="' + esc(T('Template colour')) + '"><span style="background:' + t.c.accent + '"></span><small>' + T('Original') + '</small></button>' +
      TP.ACCENTS.map(function (a) { return '<button class="swc' + (d.accent === a[0] ? ' on' : '') + '" data-col="' + a[0] + '" aria-label="' + esc(T(a[1])) + '"><span style="background:' + a[0] + '"></span><small>' + esc(T(a[1])) + '</small></button>'; }).join('') + '</div></div>';
    h += '<div class="fcard"><div class="fcard-h"><b>' + T('Text size') + '</b><small>' + T('Smaller text fits more on each page.') + '</small></div><div class="seg" data-dsize="1">' +
      [['small', 'Smaller'], ['normal', 'Normal'], ['large', 'Larger']].map(function (x) { return '<button class="' + ((d.size || 'normal') === x[0] ? 'on' : '') + '" data-v="' + x[0] + '">' + T(x[1]) + '</button>'; }).join('') + '</div></div>';
    var keys = designKeys(c);
    h += '<div class="fcard"><div class="fcard-h"><b>' + T('Sections') + '</b><small>' + T('Change the order, or hide a section you do not want on this CV.') + '</small></div><div class="dz-list">' +
      keys.map(function (k, i) {
        var hid = !!(d.hidden && d.hidden[k]);
        return '<div class="dz-row' + (hid ? ' off' : '') + '"><span class="dz-n">' + esc(T(names[k] || k)) + '</span>' +
          '<button class="icon-btn" data-dmv="' + i + ':-1"' + (i ? '' : ' disabled') + ' aria-label="Move up">' + svg('up') + '</button>' +
          '<button class="icon-btn" data-dmv="' + i + ':1"' + (i < keys.length - 1 ? '' : ' disabled') + ' aria-label="Move down">' + svg('down') + '</button>' +
          '<button class="eye' + (hid ? '' : ' on') + '" data-dhide="' + k + '">' + T(hid ? 'Hidden' : 'Shown') + '</button></div>';
      }).join('') + '</div></div>';
    h += '<button class="btn ghost block" data-dz="reset">' + T('Reset design') + '</button>';
    el.innerHTML = h;
    var pg = $('#dz-pg'); pg.innerHTML = PG.thumb(c, c.templateId, pg.clientWidth || 150);
  }
  function designEvents() {
    var el = document.getElementById('v-design');
    el.addEventListener('click', function (e) {
      var c = S.cur; if (!c) return;
      var d = c.design, y = window.scrollY;
      function redraw() { A.saveNow(); A.render(); window.scrollTo(0, y); }
      var col = e.target.closest('[data-col]'); if (col) { d.accent = col.getAttribute('data-col'); redraw(); return; }
      var sz = e.target.closest('[data-dsize] [data-v]'); if (sz) { d.size = sz.getAttribute('data-v'); redraw(); return; }
      var mv = e.target.closest('[data-dmv]');
      if (mv && !mv.disabled) {
        var q = mv.getAttribute('data-dmv').split(':'), keys = designKeys(c), i = +q[0], j = i + (+q[1]);
        var tmp = keys[i]; keys[i] = keys[j]; keys[j] = tmp; d.order = keys; redraw(); return;
      }
      var hd = e.target.closest('[data-dhide]');
      if (hd) { var k = hd.getAttribute('data-dhide'); d.hidden = d.hidden || {}; d.hidden[k] = !d.hidden[k]; redraw(); return; }
      var dz = e.target.closest('[data-dz]');
      if (dz && dz.getAttribute('data-dz') === 'tpl') { A.go('tpl'); return; }
      if (dz && dz.getAttribute('data-dz') === 'reset') { c.design = { accent: '', size: 'normal', order: null, hidden: {} }; redraw(); A.toast(T('Design reset')); }
    });
  }
  A.VIEWS.design = { title: function () { return T('Design'); }, render: renderDesign, needsCV: true,
    actions: function () { return '<button class="btn" data-act="prev">' + svg('eye') + T('Preview') + '</button>'; } };

  /* ================= PIN lock ================= */
  var PKEY = 'cvmaker.pin', hiddenAt = 0, wrong = 0, waitUntil = 0;
  function pinInfo() { try { return JSON.parse(safeGet(PKEY) || 'null'); } catch (e) { return null; } }
  function hash(pin, salt) {
    var text = salt + ':' + pin;
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (b) {
        return Array.prototype.map.call(new Uint8Array(b), function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
      });
    }
    var h = 0; for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
    return Promise.resolve('x' + h);
  }
  function lockScreen(mode, onDone) {
    // mode: 'unlock' | 'new' | 'verify'
    var el = $('#lock');
    if (!el) { el = document.createElement('div'); el.id = 'lock'; document.body.appendChild(el); }
    var entered = '', first = null, stage = mode;
    function title() {
      if (stage === 'unlock') return T('Enter your PIN');
      if (stage === 'verify') return T('Enter your current PIN');
      if (stage === 'new') return first === null ? T('Choose a 4-digit PIN') : T('Enter the same PIN again');
    }
    function draw(msg) {
      el.innerHTML = '<div class="lk"><img src="img/logo.png" alt="" class="lk-logo"><div class="lk-t">' + esc(title()) + '</div>' +
        '<div class="lk-dots">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (i < entered.length ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="lk-msg">' + esc(msg || '') + '</div><div class="lk-pad">' +
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'x', '0', '<'].map(function (k) {
          if (k === 'x') return mode === 'unlock' ? '<button class="lk-k lk-f" data-k="forgot">' + T('Forgot?') + '</button>' : '<button class="lk-k lk-f" data-k="cancel">' + T('Cancel') + '</button>';
          if (k === '<') return '<button class="lk-k lk-f" data-k="del" aria-label="Delete">⌫</button>';
          return '<button class="lk-k" data-k="' + k + '">' + k + '</button>';
        }).join('') + '</div></div>';
    }
    function close() { el.hidden = true; document.body.classList.remove('locked'); }
    el.hidden = false; document.body.classList.add('locked'); draw();
    el.onclick = function (e) {
      var b = e.target.closest('[data-k]'); if (!b) return;
      var k = b.getAttribute('data-k');
      if (k === 'cancel') { close(); return; }
      if (k === 'forgot') { forgot(); return; }
      if (k === 'del') { entered = entered.slice(0, -1); draw(); return; }
      if (Date.now() < waitUntil) { draw(T('Too many tries. Wait {n} seconds.', { n: Math.ceil((waitUntil - Date.now()) / 1000) })); return; }
      if (entered.length >= 4) return;
      entered += k; draw();
      if (entered.length < 4) return;
      var pin = entered;
      setTimeout(function () {
        if (stage === 'new') {
          if (first === null) { first = pin; entered = ''; draw(); return; }
          if (first !== pin) { first = null; entered = ''; draw(T('The PINs did not match. Try again.')); return; }
          var salt = Math.random().toString(36).slice(2);
          hash(pin, salt).then(function (h) { safeSet(PKEY, JSON.stringify({ salt: salt, hash: h })); close(); A.toast(T('PIN lock is on')); if (onDone) onDone(); });
          return;
        }
        var info = pinInfo();
        hash(pin, info.salt).then(function (h) {
          if (h === info.hash) { wrong = 0; close(); if (onDone) onDone(); return; }
          wrong++; entered = '';
          if (wrong >= 5) { waitUntil = Date.now() + 30000; wrong = 0; draw(T('Too many tries. Wait {n} seconds.', { n: 30 })); }
          else draw(T('Wrong PIN. Try again.'));
        });
      }, 120);
    };
  }
  function forgot() {
    var el = $('#lock');
    el.innerHTML = '<div class="lk"><img src="img/logo.png" alt="" class="lk-logo"><div class="lk-t">' + T('Forgot your PIN?') + '</div>' +
      '<p class="lk-p">' + T('For your safety the PIN cannot be recovered. You can erase everything in the app (all CVs, documents and applications) and start again. If you made a backup, you can restore it afterwards.') + '</p>' +
      '<button class="btn block lk-danger" data-f="erase">' + T('Erase everything and remove the PIN') + '</button><button class="btn ghost block lk-back" data-f="back">' + T('Back') + '</button></div>';
    el.onclick = function (e) {
      var b = e.target.closest('[data-f]'); if (!b) return;
      if (b.getAttribute('data-f') === 'back') { lockScreen('unlock'); return; }
      try { Object.keys(localStorage).forEach(function (k) { if (/^cvmaker\./.test(k)) localStorage.removeItem(k); }); } catch (err) { }
      var q = indexedDB.deleteDatabase('cvmaker-files');
      q.onsuccess = q.onerror = q.onblocked = function () { location.reload(); };
    };
  }
  A.hooks.pinMenu = function () {
    var on = !!pinInfo();
    var sh = A.openSheet('<h3>' + T('PIN lock') + '</h3><p>' + T('A PIN stops other people who use your phone from opening your CVs and ID documents.') + '</p>' +
      (on ? '<button class="sheet-item" data-pn="change">' + svg('lock') + '<span>' + T('Change PIN') + '</span></button><button class="sheet-item danger" data-pn="off">' + svg('lock') + '<span>' + T('Turn off PIN lock') + '</span></button>' :
        '<button class="sheet-item" data-pn="set">' + svg('lock') + '<span>' + T('Set up a PIN') + '<small>' + T('Asked when you open the app') + '</small></span></button>'));
    sh.onclick = function (e) {
      var b = e.target.closest('[data-pn]'); if (!b) return;
      A.closeSheet();
      var a = b.getAttribute('data-pn');
      if (a === 'set') lockScreen('new');
      if (a === 'change') lockScreen('verify', function () { lockScreen('new'); });
      if (a === 'off') lockScreen('verify', function () { try { localStorage.removeItem(PKEY); } catch (err) { } A.toast(T('PIN lock is off')); });
    };
  };
  A.hooks.pinOn = function () { return !!pinInfo(); };
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (pinInfo() && hiddenAt && Date.now() - hiddenAt > 30000 && ($('#lock') || {}).hidden !== false) lockScreen('unlock');
  });
  if (pinInfo()) lockScreen('unlock');

  /* ================= register views ================= */
  ['apps', 'app', 'design'].forEach(function (k) { if (!document.getElementById('v-' + k)) { var s = document.createElement('section'); s.className = 'view'; s.id = 'v-' + k; s.hidden = true; $('#main').appendChild(s); } });
  appsEvents(); designEvents();
})();
