/* Screens: PDF tools hub, My files, PDF viewer, merge, pages (organise / split), compress,
   protect ID copy, password, PDF to photos, Word to PDF, files opened from other apps. */
(function () {
  'use strict';
  var A = window.App, PT = window.CVPdfTools, F = window.CVFiles, D = window.CVData;
  var $ = A.$, esc = A.esc, T = A.T, S = A.S, NATIVE = window.AndroidBridge || null;

  /* ---------- outlined icons for the PDF tools ---------- */
  var IC = {
    plus: 'M12 5v14 M5 12h14', back: 'M19 12H5 M11 5l-7 7 7 7', close: 'M6 6l12 12 M18 6L6 18', search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z M20 20l-4.8-4.8',
    scan: 'M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8 M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8 M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16 M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16 M7 12h10',
    photos: 'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z M4 16l4.5-4.5 4 4 2.5-2.5L20 18 M15.5 8.5h.01',
    word: 'M7.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z M14 3v5h5 M9 12l1.2 5 1.8-4 1.8 4 1.2-5',
    eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z',
    fill: 'M4 20h16 M14.5 4.5l3 3L9 16H6v-3z', sign: 'M3 16c2.5 0 3.5-9 6-9s0 9 3 9 3-5 5-5 2 3 4 3 M3 20.5h18',
    merge: 'M7 3v5a5 5 0 0 0 10 0V3 M12 13v8 M9 18l3 3 3-3',
    scissors: 'M6 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z M6 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z M8.2 7.4L20 17 M8.2 16.6L20 7',
    grid: 'M4.5 4.5h6v6h-6z M13.5 4.5h6v6h-6z M4.5 13.5h6v6h-6z M13.5 13.5h6v6h-6z', compress: 'M4 14h6v6 M20 10h-6V4 M14 10l6-6 M4 20l6-6',
    topics: 'M4 7.5A2.5 2.5 0 0 1 6.5 5H12 M20 12v5.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-10 M4 16.5l4.5-4.5 4 4 2.5-2.5 5 4.5 M18 3v6 M15 6l3 3 3-3',
    shield: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z M8.8 12.2l2.2 2.2 4.2-4.4',
    lock: 'M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V12a1.5 1.5 0 0 1 1.5-1.5z M8 10.5v-3a4 4 0 0 1 8 0v3 M12 14.5v2.5',
    unlock: 'M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5V12a1.5 1.5 0 0 1 1.5-1.5z M8 10.5v-3a4 4 0 0 1 7.7-1.5 M12 14.5v2.5',
    dots: 'M5 12h.01 M12 12h.01 M19 12h.01', 'dots-v': 'M12 5h.01 M12 12h.01 M12 19h.01',
    flash: 'M13 2.5L5 13.5h6l-1 8 8-11h-6z', check: 'M5 12.5l4.5 4.5L19 7.5',
    crop: 'M6.5 2.5v13a2 2 0 0 0 2 2h13 M2.5 6.5h13a2 2 0 0 1 2 2v13', rotate: 'M19.5 11.5a7.5 7.5 0 1 0-2.2 5.3 M19.5 4.5v7h-7',
    trash: 'M4 7h16 M9 7V4.5h6V7 M6.5 7l1 13h9l1-13 M10 11v5 M14 11v5',
    camera: 'M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.5-2.5h5.4L16.2 7h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z M12 9.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
    attach: 'M20 11.5l-7.6 7.6a5 5 0 0 1-7.1-7.1l8-8a3.3 3.3 0 0 1 4.7 4.7l-8 8a1.7 1.7 0 0 1-2.4-2.4l7.4-7.4', save: 'M12 4v11 M7 10l5 5 5-5 M5 20h14',
    share: 'M17.5 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z M6.5 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z M17.5 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z M8.7 13.3l6.6 3.4 M15.3 7.3l-6.6 3.4',
    undo: 'M9 14L4 9l5-5 M4 9h10.5a5.5 5.5 0 0 1 0 11H11', text: 'M5 7V5h14v2 M12 5v14 M9 19h6',
    cal: 'M5 5.5h14a1 1 0 0 1 1 1v12.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1z M4 10h16 M8 3v4.5 M16 3v4.5',
    draw: 'M3.5 17.5c2-3 4-4.5 5.5-4.5s1.5 4 3.5 4 3.5-5.5 8-9', erase: 'M8.5 20H20 M5.6 14.4l8-8a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8l-8.6 8.6H8.4l-2.8-2.8a2 2 0 0 1 0-2.8z',
    info: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z M12 11v5 M12 8h.01',
    out: 'M14 4h6v6 M20 4l-9 9 M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10',
    copy: 'M9 9h10.5v11.5H9z M5 15.5V4.5A1 1 0 0 1 6 3.5h9.5', swap: 'M7 4L3.5 7.5 7 11 M3.5 7.5H17 M17 13l3.5 3.5L17 20 M20.5 16.5H7',
    file: 'M7.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z M14 3v5h5',
    folder: 'M3.5 7A1.5 1.5 0 0 1 5 5.5h4l2 2h8A1.5 1.5 0 0 1 20.5 9v8.5A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z',
    print: 'M7 9V3.5h10V9 M7 17H4.5A1.5 1.5 0 0 1 3 15.5v-5A1.5 1.5 0 0 1 4.5 9h15a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H17 M7 14h10v6.5H7z',
    edit: 'M4 20h4l10.5-10.5-4-4L4 16z M13.5 6.5l4 4', left: 'M15 5l-7 7 7 7', right: 'M9 5l7 7-7 7', up: 'M5 15l7-7 7 7', down: 'M5 9l7 7 7-7',
    zoomin: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z M20 20l-4.8-4.8 M10.5 7.5v6 M7.5 10.5h6', id: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z M8.5 9.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z M6 16c.5-1.5 1.5-2.2 2.5-2.2s2 .7 2.5 2.2 M13.5 10h4 M13.5 13.5h3'
  };
  function ic(k, cls, style) {
    var thick = /^(dots|dots-v)$/.test(k);
    return '<svg class="ico' + (thick ? ' thick' : '') + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24"' + (style ? ' style="' + style + '"' : '') + '><path d="' + IC[k] + '"/></svg>';
  }
  function toast(m, ms) { A.toast(m, ms); }
  function fmtSize(n) { return F.fmtSize(n); }
  function base(name) { return String(name || 'Document').replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[\\\/:*?"<>|]+/g, '').trim() || 'Document'; }
  // name for a new file made from another: drops the tool words added before, e.g. "CV - merged - small" -> "CV"
  function stem(name) {
    var b = base(name), re = /\s+-\s+(merged|edited|signed|small|protected|locked|no password|pages [\d,\-]+|page \d+)(\s+\(\d+\))?$/i;
    while (re.test(b)) b = b.replace(re, '');
    return b || 'Document';
  }
  function today() { var d = new Date(); return d.getDate() + ' ' + A.MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear(); }
  function failMsg(e) { A.done(); toast(e && e.message && !/^(need|wrong)-password$/.test(e.message) ? e.message : T('Something went wrong:') + ' ' + (e && e.message ? e.message : e), 5000); }
  function busy(m) { A.busy(m); }
  function top() { return S.stack[S.stack.length - 1]; }

  /* ---------- My files (kept on this phone) ---------- */
  var KEY = 'cvmaker.pdffiles.v1';
  var Files = {
    list: function () { try { var l = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; } },
    save: function (l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) { toast(T('Could not save - phone storage may be full')); } },
    get: function (id) { return Files.list().filter(function (f) { return f.id === id; })[0] || null; },
    uniqueName: function (name) {
      var names = {}; Files.list().forEach(function (f) { names[f.name.toLowerCase()] = 1; });
      if (!names[name.toLowerCase()]) return name;
      var b = base(name), ext = (/\.[a-z0-9]+$/i.exec(name) || ['.pdf'])[0];
      for (var i = 2; i < 999; i++) { var n = b + ' (' + i + ')' + ext; if (!names[n.toLowerCase()]) return n; }
      return name;
    },
    add: function (bytes, name, pages) {
      var id = 'pf' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      var meta = { id: id, fileId: 'pf-' + id, name: Files.uniqueName(name), size: bytes.length, pages: pages || 0, created: Date.now(), opened: Date.now() };
      return F.store.put(meta.fileId, bytes).then(function () {
        return meta.pages ? meta : PT.pageCount(bytes).then(function (n) { meta.pages = n; return meta; });
      }).then(function () { var l = Files.list(); l.unshift(meta); Files.save(l); return meta; });
    },
    bytes: function (meta) {
      return F.store.get(meta.fileId).then(function (b) { if (!b) throw new Error(T('This file is no longer on the phone.')); return b; });
    },
    update: function (id, fn) { var l = Files.list(); l.forEach(function (f) { if (f.id === id) fn(f); }); Files.save(l); },
    touch: function (id) { Files.update(id, function (f) { f.opened = Date.now(); }); },
    remove: function (id) {
      var f = Files.get(id); if (!f) return Promise.resolve();
      Files.save(Files.list().filter(function (x) { return x.id !== id; }));
      return F.store.del(f.fileId).catch(function () {});
    }
  };
  A.hooks.fileInUse = function (k) { return Files.list().some(function (f) { return f.fileId === k; }); };
  function recent(n) { return Files.list().slice().sort(function (a, b) { return (b.opened || b.created) - (a.opened || a.created); }).slice(0, n); }
  function fileRow(f, attrs, extra) {
    return '<button class="frow" ' + attrs + '><div class="pdfb">PDF</div><div class="fmeta"><b>' + esc(f.name) + '</b><span>' +
      (f.pages ? T(f.pages === 1 ? '1 page' : '{n} pages', { n: f.pages }) + ' · ' : '') + fmtSize(f.size) + ' · ' + esc(A.fmtWhen(f.created)) + '</span></div>' + (extra || '') + '</button>';
  }

  /* ---------- picking files ---------- */
  var inputs = {};
  function pickFiles(accept, multiple, capture) {
    return new Promise(function (res) {
      var k = accept + (multiple ? '|m' : '') + (capture ? '|c' : ''), inp = inputs[k];
      if (!inp) {
        inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept; inp.hidden = true;
        if (multiple) inp.multiple = true;
        if (capture) inp.setAttribute('capture', 'environment');
        document.body.appendChild(inp); inputs[k] = inp;
      }
      inp.onchange = function () { var fs = Array.prototype.slice.call(inp.files || []); inp.value = ''; if (fs.length) res(fs); };
      inp.click();
    });
  }
  var DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  function kindOf(name, mime, bytes) {
    if (bytes && PT.isPdf(bytes)) return 'pdf';
    if (/\.docx$/i.test(name || '') || mime === DOCX) return 'docx';
    if (/^image\//.test(mime || '') || /\.(jpe?g|png|webp|gif|bmp)$/i.test(name || '')) return 'image';
    if (/\.doc$/i.test(name || '')) return 'doc';
    return 'other';
  }
  function fromFile(file) {
    return PT.readBytes(file).then(function (bytes) {
      var name = file.name || 'Document';
      return { name: name, bytes: bytes, mime: file.type || '', kind: kindOf(name, file.type, bytes), size: bytes.length };
    });
  }
  function fromMeta(meta) { return { name: meta.name, kind: 'pdf', meta: meta, size: meta.size }; }
  function bytesOf(src) {
    if (src.bytes) return Promise.resolve(src.bytes);
    return Files.bytes(src.meta).then(function (b) { src.bytes = b; return b; });
  }
  /* sheet: choose a PDF from My files or from the phone. opts: { title, photos, multiple, cvDocs } */
  function choose(opts) {
    opts = opts || {};
    return new Promise(function (res) {
      var rec = recent(5);
      var h = '<h3>' + esc(opts.title || T('Choose a PDF')) + '</h3>';
      h += '<button class="sheet-item" data-c="phone">' + ic('folder') + '<span>' + T('Choose from phone') + '<small>' + T(opts.photos ? 'PDF or photo from your files or gallery' : 'A PDF from Downloads, WhatsApp or Drive') + '</small></span></button>';
      if (opts.photos) h += '<button class="sheet-item" data-c="cam">' + ic('camera') + '<span>' + T('Take a photo') + '</span></button>';
      if (opts.cvDocs && cvDocList().length) h += '<button class="sheet-item" data-c="cv">' + ic('attach') + '<span>' + T('From my CV documents') + '<small>' + T('ID copy and certificates you attached to a CV') + '</small></span></button>';
      if (rec.length) h += '<div class="sheet-sec">' + T('My files') + '</div>' + rec.map(function (f) { return fileRow(f, 'data-pf="' + f.id + '"'); }).join('');
      h += '<div class="sheet-foot"><button class="btn ghost" data-c="cancel">' + T('Cancel') + '</button></div>';
      var sh = A.openSheet(h);
      sh.onclick = function (e) {
        var b = e.target.closest('[data-c],[data-pf]'); if (!b) return;
        A.closeSheet();
        var pf = b.getAttribute('data-pf'), c = b.getAttribute('data-c');
        if (pf) { var m = Files.get(pf); if (m) res([fromMeta(m)]); return; }
        if (c === 'phone') pickFiles(opts.accept || (opts.photos ? 'application/pdf,image/*' : 'application/pdf'), !!opts.multiple).then(function (fs) { busy(T('Opening…')); Promise.all(fs.map(fromFile)).then(function (l) { A.done(); res(l); }, failMsg); });
        if (c === 'cam') pickFiles('image/*', false, true).then(function (fs) { fromFile(fs[0]).then(function (x) { res([x]); }); });
        if (c === 'cv') chooseCvDoc().then(function (x) { if (x) res([x]); });
      };
    });
  }
  function choosePdf(title) {
    return choose({ title: title }).then(function (l) {
      var s = l[0];
      if (s.kind !== 'pdf') { toast(T('Please choose a PDF file.')); throw new Error('cancel'); }
      return s;
    });
  }
  // supporting documents already attached to the person's CVs
  function cvDocList() {
    var out = [];
    S.list.forEach(function (cv) { (cv.docs || []).forEach(function (d) { out.push({ cv: cv, d: d }); }); });
    return out;
  }
  function chooseCvDoc() {
    var list = cvDocList();
    return new Promise(function (res) {
      var h = '<h3>' + T('From my CV documents') + '</h3>' + list.map(function (x, i) {
        return '<button class="sheet-item" data-i="' + i + '">' + ic(x.d.kind === 'pdf' ? 'file' : 'photos') + '<span>' + esc(x.d.type ? T(x.d.type) : x.d.name) + '<small>' + esc(A.cvTitle(x.cv)) + '</small></span></button>';
      }).join('') + '<div class="sheet-foot"><button class="btn ghost" data-i="-1">' + T('Cancel') + '</button></div>';
      var sh = A.openSheet(h);
      sh.onclick = function (e) {
        var b = e.target.closest('[data-i]'); if (!b) return; A.closeSheet();
        var x = list[+b.getAttribute('data-i')]; if (!x) { res(null); return; }
        var name = (x.d.type || base(x.d.name)) + (x.d.kind === 'pdf' ? '.pdf' : '.jpg');
        if (x.d.kind === 'pdf') F.store.get(x.d.fileId).then(function (b2) { res({ name: name, bytes: b2, kind: 'pdf', size: b2.length }); });
        else F.exportImage(x.d, false, 0).then(function (b3) { res({ name: name, bytes: b3, mime: 'image/jpeg', kind: 'image', size: b3.length }); });
      };
    });
  }

  /* ---------- password prompt ---------- */
  function askPassword(name, wrong) {
    return new Promise(function (res, rej) {
      var sh = A.openSheet('<h3>' + T('This PDF has a password') + '</h3><p>' + esc(name) + '</p>' +
        (wrong ? '<p style="color:#C0392B;font-weight:700">' + T('Wrong password. Try again.') + '</p>' : '') +
        '<div class="inp-wrap"><input class="inp" type="password" id="pw-in" autocomplete="off" placeholder="' + esc(T('Password')) + '"></div>' +
        '<div class="sheet-foot"><button class="btn ghost" data-p="no">' + T('Cancel') + '</button><button class="btn" data-p="ok">' + T('Open') + '</button></div>');
      var inp = $('#pw-in'); setTimeout(function () { inp.focus(); }, 250);
      function go(ok) { var v = inp.value; A.closeSheet(); if (ok && v) res(v); else rej(new Error('cancel')); }
      sh.onclick = function (e) { var b = e.target.closest('[data-p]'); if (b) go(b.getAttribute('data-p') === 'ok'); };
      inp.onkeydown = function (e) { if (e.key === 'Enter') go(true); };
    });
  }
  // open with pdf.js, asking for the password when needed
  function openDoc(bytes, name, pw) {
    return PT.open(bytes, pw).then(function (doc) { return { doc: doc, pw: pw || '' }; }, function (e) {
      if (e.code === 'need-password' || e.code === 'wrong-password') return askPassword(name, e.code === 'wrong-password').then(function (p) { return openDoc(bytes, name, p); });
      throw e;
    });
  }
  // tools that change a PDF need it without a password: offer a copy without it
  function needUnlocked(src, e) {
    if (!e || e.code !== 'locked') { failMsg(e); return; }
    A.done();
    var sh = A.openSheet('<h3>' + T('This PDF is locked with a password.') + '</h3><p>' + T('To change it, the app can make a copy without the password. You need to know the password.') + '</p>' +
      '<div class="sheet-foot"><button class="btn ghost" data-u="no">' + T('Cancel') + '</button><button class="btn" data-u="ok">' + T('Make a copy') + '</button></div>');
    sh.onclick = function (ev) {
      var b = ev.target.closest('[data-u]'); if (!b) return; A.closeSheet();
      if (b.getAttribute('data-u') !== 'ok') return;
      bytesOf(src).then(function (bytes) {
        return askPassword(src.name).then(function (pw) {
          busy(T('Making a copy without the password…'));
          return PT.unlock(bytes, pw).catch(function (er) { if (er.code === 'wrong-password') { A.done(); toast(T('Wrong password. Try again.')); throw new Error('cancel'); } throw er; });
        });
      }).then(function (out) { return Files.add(out, stem(src.name) + ' - no password.pdf'); }).then(function (meta) { A.done(); resultSheet(meta, T('Copy without the password is ready')); })
        .catch(function (er) { if (er.message !== 'cancel') failMsg(er); });
    };
  }

  /* ---------- results ---------- */
  function deliver(meta, mode) {
    return Files.bytes(meta).then(function (b) { A.setLastSize(b.length); A.deliverMany([{ bytes: b, name: meta.name, mime: 'application/pdf' }], mode); }, failMsg);
  }
  function resultSheet(meta, title) {
    var h = '<div class="res-h"><span class="ok">' + ic('check') + '</span><b>' + esc(title || T('Your PDF is ready')) + '</b></div>' +
      fileRow(meta, 'data-r="open"') +
      '<div class="btns two"><button class="btn gold" data-r="save">' + ic('save') + ' ' + T('Save to phone') + '</button><button class="btn soft" data-r="share">' + ic('share') + ' ' + T('Share') + '</button></div>' +
      '<button class="sheet-item" data-r="open">' + ic('eye') + '<span>' + T('Open') + '</span></button>' +
      (S.list.length ? '<button class="sheet-item" data-r="cv">' + ic('attach') + '<span>' + T('Add to my CV') + '<small>' + T('As a supporting document') + '</small></span></button>' : '') +
      '<div class="res-note">' + T('It is also kept in My files on this phone.') + '</div>';
    var sh = A.openSheet(h);
    sh.querySelectorAll('.btns .ico').forEach(function (s) { s.style.marginRight = '6px'; });
    sh.onclick = function (e) {
      var b = e.target.closest('[data-r]'); if (!b) return;
      var r = b.getAttribute('data-r'); A.closeSheet();
      if (r === 'save' || r === 'share') deliver(meta, r);
      if (r === 'open') openFile(meta);
      if (r === 'cv') Files.bytes(meta).then(function (bytes) { addToCv(bytes, meta.name); });
    };
  }
  // put a PDF into one of the person's CVs as a supporting document
  function addToCv(bytes, name) {
    if (!S.list.length) { toast(T('Make a CV first, then add documents to it.')); return; }
    function into(cv) {
      busy(T('Adding document…'));
      F.importFile(new File([bytes], name, { type: 'application/pdf' })).then(function (d) {
        A.docsOf(cv).push(d); cv.updated = Date.now(); A.saveNow(); A.done();
        toast(T('Added to {name}', { name: A.cvTitle(cv) }));
        if (!d.type) {
          var keep = S.cur; S.cur = cv;
          A.pickDocType(d, function () { S.cur = keep; A.saveNow(); });
        }
      }, failMsg);
    }
    if (S.list.length === 1) { into(S.list[0]); return; }
    var names = S.list.map(function (cv) { return A.cvTitle(cv); });
    A.choicePicker(T('Which CV?'), { choices: names }, '', false, function (v) { var cv = S.list[names.indexOf(v)]; if (cv) into(cv); });
  }

  /* ---------- the tools ---------- */
  var TOOLS = {
    scan: ['scan', 'c-green', 'Scan to PDF', 'Camera, finds the page edges', 'Scan'],
    photos: ['photos', 'c-green', 'Photos to PDF', 'From your gallery', 'Photos to PDF'],
    word: ['word', 'c-green', 'Word to PDF', '.docx letters and CVs', 'Word to PDF'],
    open: ['eye', 'c-blue', 'Open PDF', 'Read any PDF', 'Open PDF'],
    sign: ['fill', 'c-blue', 'Fill & sign', 'Type on forms, sign, tick', 'Fill & sign'],
    tophotos: ['topics', 'c-blue', 'PDF to photos', 'Pages as JPG for WhatsApp', 'PDF to photos'],
    merge: ['merge', 'c-purple', 'Merge', 'Join PDFs into one', 'Merge'],
    split: ['scissors', 'c-purple', 'Split', 'Take out pages', 'Split'],
    organise: ['grid', 'c-purple', 'Organise', 'Move, rotate, delete', 'Organise'],
    compress: ['compress', 'c-orange', 'Compress', 'Smaller for email', 'Compress'],
    protect: ['shield', 'c-red', 'Protect ID copy', 'Add a watermark', 'Protect ID copy'],
    lock: ['lock', 'c-red', 'Password', 'Lock a PDF', 'Password'],
    more: ['dots', 'c-gold', 'More tools', '', 'More tools']
  };
  function tile(k, small) {
    var t = TOOLS[k];
    return '<button class="tool ' + t[1] + '" data-tool="' + k + '"><div class="ic">' + ic(t[0]) + '</div><b>' + T(small ? t[4] : t[2]) + '</b>' + (small || !t[3] ? '' : '<small>' + T(t[3]) + '</small>') + '</button>';
  }
  function runTool(k) {
    if (k === 'more') { A.go('pdftools'); return; }
    if (k === 'files') { A.go('myfiles'); return; }
    if (k === 'scan') { if (A.PDF.startScan) A.PDF.startScan('camera'); return; }
    if (k === 'photos') { if (A.PDF.startScan) A.PDF.startScan('photos'); return; }
    if (k === 'word') { wordFlow(); return; }
    if (k === 'merge') { M.items = []; A.go('merge'); return; }
    if (k === 'protect') { P.src = null; A.go('protect'); return; }
    var titles = { open: 'Open PDF', sign: 'Fill & sign', tophotos: 'PDF to photos', split: 'Split', organise: 'Organise pages', compress: 'Compress', lock: 'Password' };
    choose({ title: T(titles[k]), photos: k === 'sign' }).then(function (l) {
      var src = l[0];
      if (k === 'sign' && src.kind === 'image') { photoToPdf(src).then(function (s2) { if (A.PDF.startSign) A.PDF.startSign(s2); }); return; }
      if (src.kind !== 'pdf') { toast(T('Please choose a PDF file.')); return; }
      if (k === 'open') { keepAndOpen(src); return; }
      if (k === 'sign') { if (A.PDF.startSign) A.PDF.startSign(src); return; }
      if (k === 'tophotos') { photosSheet(src); return; }
      if (k === 'split' || k === 'organise') { startPages(src, k); return; }
      if (k === 'compress') { C.src = src; C.res = null; A.go('compress'); return; }
      if (k === 'lock') { K.src = src; A.go('lock'); return; }
    });
  }
  function photoToPdf(src) {
    busy(T('Opening…'));
    return PT.photoJpg(src.bytes, src.mime).then(function (j) { return PT.imagesToPdf([{ bytes: j, fit: 'auto' }], base(src.name)); })
      .then(function (pdf) { A.done(); return { name: base(src.name) + '.pdf', bytes: pdf, kind: 'pdf', size: pdf.length }; }, function (e) { failMsg(e); throw e; });
  }
  // a PDF chosen from the phone is kept in My files so it shows up again next time
  function keepAndOpen(src) {
    if (src.meta) { openFile(src.meta); return; }
    busy(T('Opening…'));
    Files.add(src.bytes, src.name).then(function (meta) { A.done(); openFile(meta); }, failMsg);
  }
  A.hooks.homeTools = function () {
    return '<section class="block" style="margin-top:20px"><div class="block-h"><h2>' + T('PDF tools') + '<span class="new-pill">' + T('NEW') + '</span></h2><button class="see-all" data-tool="more">' + T('See all {n}', { n: 12 }) + '</button></div>' +
      '<div class="tg four">' + (window.innerWidth >= 1400 ? ['scan', 'photos', 'word', 'open', 'sign', 'tophotos', 'merge', 'split', 'organise', 'compress', 'protect', 'lock']
        : ['scan', 'photos', 'open', 'sign', 'merge', 'compress', 'protect', 'more']).map(function (k) { return tile(k, true); }).join('') + '</div></section>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tool]'); if (!b || !$('#sheet').hidden && b.closest('#sheet')) return;
    if (!b.closest('#v-home') && !b.closest('#v-pdftools')) return;
    runTool(b.getAttribute('data-tool'));
  });
  // buttons that views put in the top bar
  $('#bar-extra').addEventListener('click', function (e) {
    var b = e.target.closest('[data-bar]'); if (!b) return;
    var v = A.VIEWS[top()]; if (v && v.onBar) v.onBar(b.getAttribute('data-bar'), b);
  });
  function refreshBar() { var v = A.VIEWS[top()]; $('#bar-extra').innerHTML = v && v.bar ? v.bar() : ''; }

  /* ---------- hub ---------- */
  A.VIEWS.pdftools = {
    noMenu: true,
    title: function () { return T('PDF tools'); },
    actions: function () { return ''; },
    render: function (el) {
      var h = '<div class="grp">' + T('Make a PDF') + '</div><div class="tg">' + tile('scan') + tile('photos') + tile('word') + '</div>' +
        '<div class="grp">' + T('View & edit') + '</div><div class="tg">' + tile('open') + tile('sign') + tile('tophotos') + '</div>' +
        '<div class="grp">' + T('Pages') + '</div><div class="tg">' + tile('merge') + tile('split') + tile('organise') + '</div>' +
        '<div class="grp">' + T('Size & safety') + '</div><div class="tg">' + tile('compress') + tile('protect') + tile('lock') + '</div>';
      var rec = recent(3);
      h += '<section class="block"><div class="block-h"><h2>' + T('Recent files') + '</h2><button class="see-all" data-tool="files">' + T('My files') + '</button></div>';
      h += rec.length ? rec.map(function (f) { return fileRow(f, 'data-open="' + f.id + '"'); }).join('') :
        '<div class="empty-box">' + ic('folder') + '<div>' + T('PDFs you make or open here are kept in My files.') + '</div></div>';
      el.innerHTML = h + '</section>';
    }
  };
  A.viewEl('pdftools').addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]'); if (b) { var m = Files.get(b.getAttribute('data-open')); if (m) openFile(m); }
  });

  /* ---------- My files ---------- */
  A.VIEWS.myfiles = {
    noMenu: true,
    title: function () { return T('My files'); },
    actions: function () { return ''; },
    render: function (el) {
      var l = Files.list();
      var h = '<p class="docs-intro">' + T('PDFs you made or opened with the PDF tools. They are kept only on this phone.') + '</p>';
      if (!l.length) h += '<div class="empty-box">' + ic('folder') + '<div>' + T('No files yet.') + '</div></div>';
      h += l.map(function (f) { return fileRow(f, 'data-open="' + f.id + '"', '<span class="ibtn" data-fm="' + f.id + '">' + ic('dots-v') + '</span>'); }).join('');
      if (l.length) h += '<p class="res-note" style="text-align:center;color:var(--muted);font-size:13px">' + T('{n} files · {size}', { n: l.length, size: fmtSize(l.reduce(function (t, f) { return t + (f.size || 0); }, 0)) }) + '</p>';
      h += '<button class="btn soft block" data-tool2="open" style="margin-top:8px">' + ic('folder', '', 'margin-right:8px') + T('Open a PDF from the phone') + '</button>';
      el.innerHTML = h;
    }
  };
  A.viewEl('myfiles').addEventListener('click', function (e) {
    var m = e.target.closest('[data-fm]');
    if (m) { e.stopPropagation(); fileMenu(Files.get(m.getAttribute('data-fm'))); return; }
    var o = e.target.closest('[data-open]'); if (o) { var f = Files.get(o.getAttribute('data-open')); if (f) openFile(f); return; }
    if (e.target.closest('[data-tool2]')) runTool('open');
  });
  function fileMenu(f) {
    if (!f) return;
    var sh = A.openSheet('<h3>' + esc(f.name) + '</h3>' +
      '<button class="sheet-item" data-fa="open">' + ic('eye') + '<span>' + T('Open') + '</span></button>' +
      '<button class="sheet-item" data-fa="save">' + ic('save') + '<span>' + T('Save to phone') + '<small>' + T('Downloads or another folder') + '</small></span></button>' +
      '<button class="sheet-item" data-fa="share">' + ic('share') + '<span>' + T('Share') + '<small>' + T('WhatsApp, email…') + '</small></span></button>' +
      '<button class="sheet-item" data-fa="rename">' + ic('edit') + '<span>' + T('Rename') + '</span></button>' +
      (S.list.length ? '<button class="sheet-item" data-fa="cv">' + ic('attach') + '<span>' + T('Add to my CV') + '</span></button>' : '') +
      '<button class="sheet-item danger" data-fa="del">' + ic('trash') + '<span>' + T('Delete') + '</span></button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-fa]'); if (!b) return;
      var a = b.getAttribute('data-fa'); A.closeSheet();
      if (a === 'open') openFile(f);
      if (a === 'save' || a === 'share') deliver(f, a);
      if (a === 'rename') renameFile(f);
      if (a === 'cv') Files.bytes(f).then(function (bytes) { addToCv(bytes, f.name); });
      if (a === 'del') deleteFile(f);
    };
  }
  function deleteFile(f) {
    A.confirmSheet(T('Delete this file?'), T('{name} will be removed from this phone. This cannot be undone.', { name: f.name }), T('Delete'), true).then(function (ok) {
      if (!ok) return;
      Files.remove(f.id).then(function () {
        toast(T('File deleted'));
        if (V.file && V.file.id === f.id) { closeDoc(); V.file = null; if (top() === 'pdfview') { A.back(); return; } }
        A.render();
      });
    });
  }
  function renameFile(f, after) {
    var sh = A.openSheet('<h3>' + T('Rename') + '</h3><div class="inp-wrap"><input class="inp" id="rn-in" value="' + esc(base(f.name)) + '" autocomplete="off"></div>' +
      '<div class="sheet-foot"><button class="btn ghost" data-rn="no">' + T('Cancel') + '</button><button class="btn" data-rn="ok">' + T('Save') + '</button></div>');
    var inp = $('#rn-in'); setTimeout(function () { inp.focus(); inp.select(); }, 250);
    function ok() {
      var v = base(inp.value); A.closeSheet(); if (!v) return;
      var name = v + '.pdf';
      if (name.toLowerCase() !== f.name.toLowerCase()) name = Files.uniqueName(name);
      Files.update(f.id, function (x) { x.name = name; }); f.name = name;
      A.render(); if (after) after();
    }
    sh.onclick = function (e) { var b = e.target.closest('[data-rn]'); if (!b) return; if (b.getAttribute('data-rn') === 'ok') ok(); else A.closeSheet(); };
    inp.onkeydown = function (e) { if (e.key === 'Enter') ok(); };
  }

  /* ---------- PDF viewer ---------- */
  var V = { file: null, doc: null, bytes: null, info: null, pw: '', zoom: 1, obs: null, job: 0 };
  function closeDoc() { if (V.doc) { try { V.doc.destroy(); } catch (e) { /* ignore */ } } V.doc = null; V.bytes = null; V.info = null; V.pw = ''; if (V.obs) { V.obs.disconnect(); V.obs = null; } }
  function openFile(meta) {
    if (!V.file || V.file.id !== meta.id) { closeDoc(); V.zoom = 1; }
    V.file = meta; Files.touch(meta.id);
    if (top() === 'pdfview') A.render(); else A.go('pdfview');
  }
  function ensureDoc() {
    if (V.doc) return Promise.resolve(V.doc);
    var f = V.file;
    return Files.bytes(f).then(function (bytes) {
      return openDoc(bytes, f.name, V.pw).then(function (r) {
        if (V.file !== f) { r.doc.destroy(); throw new Error('cancel'); }
        V.doc = r.doc; V.bytes = bytes; V.pw = r.pw;
        return PT.allPageInfo(r.doc).then(function (info) { V.info = info; if (!f.pages || f.pages !== info.length) Files.update(f.id, function (x) { x.pages = info.length; }); return r.doc; });
      });
    });
  }
  A.VIEWS.pdfview = {
    title: function () { return V.file ? V.file.name : T('Open PDF'); },
    actions: function () { return ''; },
    menu: function () { viewerMenu(); },
    render: function (el) {
      if (!V.file) { S.stack.pop(); A.render(); return; }
      el.innerHTML = '<div class="vw" id="vw"><div class="vw-pages" id="vw-pages"><div class="busy-card" style="box-shadow:none;background:none;color:#DDE6E2"><div class="spin"></div>' + T('Opening…') + '</div></div></div>' +
        '<div class="pchip" id="vw-chip" hidden></div><div class="zoom"><button data-vz="1" aria-label="' + esc(T('Zoom in')) + '">+</button><button data-vz="-1" aria-label="' + esc(T('Zoom out')) + '">&minus;</button></div>' +
        '<div class="tbar"><button data-vt="sign">' + ic('fill') + T('Fill & sign') + '</button><button data-vt="pages">' + ic('grid') + T('Pages') + '</button>' +
        '<button data-vt="compress">' + ic('compress') + T('Compress') + '</button><button data-vt="photos">' + ic('topics') + T('To photos') + '</button><button data-vt="share">' + ic('share') + T('Share') + '</button></div>';
      var job = ++V.job;
      ensureDoc().then(function () { if (job === V.job && top() === 'pdfview') layoutPages(); }).catch(function (e) {
        if (e.message === 'cancel') { if (top() === 'pdfview') A.back(); return; }
        var box = $('#vw-pages'); if (box) box.innerHTML = '<div class="pv-empty" style="margin-top:30px">' + ic('file') + '<b>' + T('This file could not be opened as a PDF') + '</b><p>' + esc(e.message || '') + '</p></div>';
      });
    }
  };
  var ZOOMS = [1, 1.5, 2, 3];
  function layoutPages() {
    var box = $('#vw-pages'), vw = $('#vw'); if (!box || !V.info) return;
    var avail = Math.min(vw.clientWidth - 24, 900), w = Math.round(avail * V.zoom);
    box.style.width = w + 'px';
    box.innerHTML = V.info.map(function (p, i) { return '<div class="vw-page" data-i="' + i + '" style="width:' + w + 'px;height:' + Math.round(w * p.h / p.w) + 'px"><span class="pg-load">' + (i + 1) + '</span></div>'; }).join('');
    if (V.obs) V.obs.disconnect();
    var job = V.job;
    if ('IntersectionObserver' in window) {
      V.obs = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          var el = en.target;
          if (en.isIntersecting) drawPage(el, job);
          else if (el.firstChild && el.firstChild.tagName === 'CANVAS') { el.innerHTML = '<span class="pg-load">' + (+el.getAttribute('data-i') + 1) + '</span>'; el.removeAttribute('data-z'); }
        });
      }, { rootMargin: '900px 0px' });
      Array.prototype.forEach.call(box.children, function (el) { V.obs.observe(el); });
    } else Array.prototype.forEach.call(box.children, function (el) { drawPage(el, job); });
    updateChip();
  }
  function drawPage(el, job) {
    var z = String(V.zoom);
    if (el.getAttribute('data-z') === z || el.getAttribute('data-busy')) return;
    el.setAttribute('data-busy', '1');
    var i = +el.getAttribute('data-i');
    PT.renderPage(V.doc, i, el.clientWidth, Math.min(2, window.devicePixelRatio || 1)).then(function (cv) {
      el.removeAttribute('data-busy');
      if (job !== V.job || !el.isConnected) return;
      el.innerHTML = ''; el.appendChild(cv); el.setAttribute('data-z', z);
    }).catch(function () { el.removeAttribute('data-busy'); });
  }
  var chipTimer;
  function updateChip() {
    var chip = $('#vw-chip'), box = $('#vw-pages'); if (!chip || !box || !V.info) return;
    var mid = window.innerHeight / 2, cur = 1;
    Array.prototype.forEach.call(box.children, function (el, i) { var r = el.getBoundingClientRect(); if (r.top < mid) cur = i + 1; });
    chip.textContent = cur + ' / ' + V.info.length; chip.hidden = false; chip.style.opacity = 1;
    clearTimeout(chipTimer); chipTimer = setTimeout(function () { chip.style.opacity = 0.35; }, 1500);
  }
  window.addEventListener('scroll', function () { if (top() === 'pdfview') updateChip(); }, { passive: true });
  A.viewEl('pdfview').addEventListener('click', function (e) {
    var z = e.target.closest('[data-vz]');
    if (z) {
      var k = ZOOMS.indexOf(V.zoom) + (+z.getAttribute('data-vz'));
      if (k < 0 || k >= ZOOMS.length) return;
      var frac = (window.scrollY + window.innerHeight / 2) / Math.max(1, document.body.scrollHeight);
      V.zoom = ZOOMS[k]; V.job++; layoutPages();
      window.scrollTo(0, frac * document.body.scrollHeight - window.innerHeight / 2);
      return;
    }
    var t = e.target.closest('[data-vt]'); if (!t || !V.file) return;
    var a = t.getAttribute('data-vt'), src = { name: V.file.name, kind: 'pdf', meta: V.file, bytes: V.bytes, pw: V.pw };
    if (a === 'sign') { if (A.PDF.startSign) A.PDF.startSign(src); }
    if (a === 'pages') startPages(src, 'organise');
    if (a === 'compress') { C.src = src; C.res = null; A.go('compress'); }
    if (a === 'photos') photosSheet(src);
    if (a === 'share') deliver(V.file, 'share');
  });
  function viewerMenu() {
    var f = V.file; if (!f) return;
    var sh = A.openSheet('<h3>' + esc(f.name) + '</h3>' +
      '<button class="sheet-item" data-vm="save">' + ic('save') + '<span>' + T('Save to phone') + '<small>' + T('Downloads or another folder') + '</small></span></button>' +
      '<button class="sheet-item" data-vm="print">' + ic('print') + '<span>' + T('Print') + '</span></button>' +
      '<button class="sheet-item" data-vm="rename">' + ic('edit') + '<span>' + T('Rename') + '</span></button>' +
      '<button class="sheet-item" data-vm="split">' + ic('scissors') + '<span>' + T('Split') + '<small>' + T('Take out pages') + '</small></span></button>' +
      '<button class="sheet-item" data-vm="lock">' + ic('lock') + '<span>' + T('Add a password') + '</span></button>' +
      (S.list.length ? '<button class="sheet-item" data-vm="cv">' + ic('attach') + '<span>' + T('Add to my CV') + '</span></button>' : '') +
      '<button class="sheet-item danger" data-vm="del">' + ic('trash') + '<span>' + T('Delete') + '</span></button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-vm]'); if (!b) return;
      var a = b.getAttribute('data-vm'); A.closeSheet();
      var src = { name: f.name, kind: 'pdf', meta: f, bytes: V.bytes };
      if (a === 'save') deliver(f, 'save');
      if (a === 'print') deliver(f, 'print');
      if (a === 'rename') renameFile(f, function () { $('#bar-title').textContent = f.name; });
      if (a === 'split') startPages(src, 'split');
      if (a === 'lock') { K.src = src; A.go('lock'); }
      if (a === 'cv') Files.bytes(f).then(function (bytes) { addToCv(bytes, f.name); });
      if (a === 'del') deleteFile(f);
    };
  }

  /* ---------- PDF to photos ---------- */
  function photosSheet(src) {
    var q = 'normal';
    bytesOf(src).then(function (bytes) { return openDoc(bytes, src.name, src.pw); }).then(function (r) {
      var doc = r.doc, n = doc.numPages;
      function body() {
        return '<h3>' + T('PDF to photos') + '</h3><p>' + T(n === 1 ? 'The page becomes a JPG photo you can send on WhatsApp.' : 'Each of the {n} pages becomes a JPG photo you can send on WhatsApp.', { n: n }) + '</p>' +
          '<div class="inp-wrap"><div class="seg" data-q="1"><button class="' + (q === 'normal' ? 'on' : '') + '" data-v="normal">' + T('Normal') + '</button><button class="' + (q === 'sharp' ? 'on' : '') + '" data-v="sharp">' + T('Sharp (for printing)') + '</button></div></div>' +
          '<div class="btns two"><button class="btn soft" data-ph="save">' + T('Save photos') + '</button><button class="btn gold" data-ph="share">' + T('Share photos') + '</button></div><div style="height:10px"></div>';
      }
      var sh = A.openSheet(body());
      sh.onclick = function (e) {
        var s = e.target.closest('[data-q] [data-v]'); if (s) { q = s.getAttribute('data-v'); sh.innerHTML = '<div class="grab"></div>' + body(); return; }
        var b = e.target.closest('[data-ph]'); if (!b) return;
        var mode = b.getAttribute('data-ph'); A.closeSheet();
        busy(T('Making photos…'));
        var pages = []; for (var i = 0; i < n; i++) pages.push(i);
        PT.toPhotos(doc, pages, q === 'sharp' ? 2480 : 1240).then(function (list) {
          A.done();
          var files = list.map(function (x) { return { bytes: x.bytes, name: base(src.name) + (n > 1 ? ' - page ' + (x.page + 1) : '') + '.jpg', mime: 'image/jpeg' }; });
          A.setLastSize(files.reduce(function (t, f) { return t + f.bytes.length; }, 0));
          A.deliverMany(files, mode);
          doc.destroy();
        }, failMsg);
      };
    }).catch(function (e) { if (e.message !== 'cancel') failMsg(e); });
  }

  /* ---------- merge ---------- */
  var M = { items: [] };
  A.VIEWS.merge = {
    noMenu: true,
    title: function () { return T('Merge PDFs'); },
    render: function (el) {
      var h = '<p class="docs-intro">' + T('Put the files in the order you want, then join them into one PDF. Photos can be added too.') + '</p>';
      M.items.forEach(function (it, i) {
        h += '<div class="frow"><div class="pdfb' + (it.kind === 'image' ? ' img' : '') + '">' + (it.kind === 'image' ? 'JPG' : 'PDF') + '</div><div class="fmeta"><b>' + esc(it.name) + '</b><span>' +
          (it.pages ? T(it.pages === 1 ? '1 page' : '{n} pages', { n: it.pages }) + ' · ' : '') + fmtSize(it.size) + '</span></div>' +
          '<span class="ibtn" data-mm="' + i + ':-1"' + (i ? '' : ' style="opacity:.3"') + '>' + ic('up') + '</span><span class="ibtn" data-mm="' + i + ':1"' + (i < M.items.length - 1 ? '' : ' style="opacity:.3"') + '>' + ic('down') + '</span>' +
          '<span class="ibtn" data-mx="' + i + '">' + ic('close') + '</span></div>';
      });
      if (!M.items.length) h += '<div class="empty-box">' + ic('merge') + '<div>' + T('Add two or more files.') + '</div></div>';
      h += '<button class="btn ghost block" data-madd="1" style="margin-top:4px">' + ic('plus', '', 'margin-right:8px') + T(M.items.length ? 'Add more files' : 'Add files') + '</button>';
      var pages = M.items.reduce(function (t, x) { return t + (x.pages || 1); }, 0), size = M.items.reduce(function (t, x) { return t + (x.size || 0); }, 0);
      if (M.items.length > 1) h += '<div class="note tip-g" style="margin-top:14px">' + ic('info') + '<span>' + T('New PDF: {n} pages, about {size}. Your files stay as they are - a new one is made.', { n: pages, size: fmtSize(size) }) + '</span></div>';
      el.innerHTML = h;
    },
    actions: function () { return M.items.length > 1 ? '<button class="btn gold" data-act="merge">' + ic('merge', '', 'margin-right:8px;width:20px;height:20px') + T('Merge into one PDF') + '</button>' : ''; },
    onAction: function (a) { if (a === 'merge') { doMerge(); return true; } }
  };
  A.viewEl('merge').addEventListener('click', function (e) {
    var mv = e.target.closest('[data-mm]'), x = e.target.closest('[data-mx]');
    if (mv) { var p = mv.getAttribute('data-mm').split(':'), i = +p[0], j = i + (+p[1]); if (j < 0 || j >= M.items.length) return; var t = M.items[i]; M.items[i] = M.items[j]; M.items[j] = t; A.render(); return; }
    if (x) { M.items.splice(+x.getAttribute('data-mx'), 1); A.render(); return; }
    if (e.target.closest('[data-madd]')) {
      choose({ title: T('Add files'), photos: true, multiple: true }).then(function (l) {
        var ch = Promise.resolve();
        l.forEach(function (s) {
          ch = ch.then(function () { return bytesOf(s); }).then(function (b) {
            if (s.kind === 'pdf') return PT.pageCount(b).then(function (n) { s.pages = n; M.items.push(s); });
            if (s.kind === 'image') { s.pages = 1; M.items.push(s); return; }
            toast(T('{name} is not a PDF or photo', { name: s.name }));
          });
        });
        ch.then(function () { A.render(); });
      });
    }
  });
  function doMerge() {
    busy(T('Joining your files…'));
    Promise.all(M.items.map(bytesOf)).then(function () {
      return PT.merge(M.items.map(function (s) { return { bytes: s.bytes, name: s.name, kind: s.kind, mime: s.mime }; }), 'Merged');
    }).then(function (out) { return Files.add(out, stem(M.items[0].name) + ' - merged.pdf'); })
      .then(function (meta) { A.done(); M.items = []; A.back(); resultSheet(meta, T('Files joined into one PDF')); })
      .catch(function (e) { if (e.code === 'locked') { A.done(); toast(e.message, 5000); } else failMsg(e); });
  }

  /* ---------- pages: organise and split ---------- */
  var G = { src: null, doc: null, order: [], sel: [], mode: 'organise', dirty: false, thumbs: {}, job: 0 };
  function startPages(src, mode) {
    busy(T('Opening…'));
    bytesOf(src).then(function (bytes) { return openDoc(bytes, src.name, src.pw); }).then(function (r) {
      A.done();
      if (G.doc && G.doc !== V.doc) try { G.doc.destroy(); } catch (e) { /* ignore */ }
      G.src = src; G.doc = r.doc; G.mode = mode; G.dirty = false; G.sel = []; G.thumbs = {}; G.job++;
      G.order = []; for (var i = 0; i < r.doc.numPages; i++) G.order.push({ p: i, r: 0 });
      A.go('pages');
    }).catch(function (e) { if (e.message !== 'cancel') failMsg(e); });
  }
  A.VIEWS.pages = {
    noMenu: true,
    title: function () { return T(G.mode === 'split' ? 'Split PDF' : 'Organise pages'); },
    actions: function () { return ''; },
    bar: function () {
      return G.mode === 'organise' ? '<button class="bar-act gold" data-bar="save"' + (G.dirty ? '' : ' disabled') + '>' + T('Save') + '</button>' :
        '<button class="bar-act" data-bar="all">' + T(G.sel.length === G.order.length ? 'Select none' : 'Select all') + '</button>';
    },
    onBar: function (a) {
      if (a === 'save') savePages();
      if (a === 'all') { G.sel = G.sel.length === G.order.length ? [] : G.order.map(function (o, k) { return k; }); A.render(); }
    },
    beforeBack: function () {
      if (G.mode !== 'organise' || !G.dirty) return false;
      A.confirmSheet(T('Leave without saving?'), T('Your changes to the pages will be lost.'), T('Leave'), true).then(function (ok) { if (ok) { G.dirty = false; A.back(); } });
      return true;
    },
    render: function (el) {
      if (!G.doc) { S.stack.pop(); A.render(); return; }
      var h = '<p class="docs-intro" style="margin-bottom:10px"><b>' + esc(G.src.name) + '</b> · ' + T(G.order.length === 1 ? '1 page' : '{n} pages', { n: G.order.length }) + '<br><span style="color:var(--muted);font-size:13.5px">' +
        T(G.mode === 'split' ? 'Tap the pages you want, then save them as a new PDF.' : 'Tap pages to choose them, then rotate, move, copy or delete.') + '</span></p><div class="ogrid">';
      G.order.forEach(function (o, k) {
        var on = G.sel.indexOf(k) >= 0, th = G.thumbs[o.p];
        h += '<button class="og' + (on ? ' on' : '') + '" data-k="' + k + '"><div class="pp">' + (th ? '<img src="' + th + '" class="' + (o.r ? 'rot' + o.r : '') + '" alt="">' : '') +
          '<span class="ck">' + (on ? ic('check') : '') + '</span></div><span class="n">' + (k + 1) + '</span></button>';
      });
      h += '</div><div style="height:90px"></div>' + selbar();
      el.innerHTML = h;
      loadThumbs();
    }
  };
  function selbar() {
    var n = G.sel.length;
    if (!n) {
      return '<div class="selbar idle"><div class="selcount">' + T('Tap pages to choose them') + '</div>' +
        (G.mode === 'split' && G.order.length > 1 ? '<div class="bt"><button data-pa="each" style="color:var(--green)">' + ic('scissors') + T('Every page as its own PDF') + '</button></div>' : '') + '</div>';
    }
    var head = '<div class="selbar"><div class="selcount">' + T(n === 1 ? '1 page selected' : '{n} pages selected', { n: n }) + '</div><div class="bt">';
    if (G.mode === 'split') return head + '<button data-pa="extract">' + ic('out') + T('Save as new PDF') + '</button><button data-pa="clear">' + ic('close') + T('Clear') + '</button></div></div>';
    var one = n === 1, k = G.sel[0];
    return head + '<button data-pa="rot">' + ic('rotate') + T('Rotate') + '</button>' +
      '<button data-pa="left"' + (one && k > 0 ? '' : ' disabled') + '>' + ic('left') + T('Move') + '</button>' +
      '<button data-pa="right"' + (one && k < G.order.length - 1 ? '' : ' disabled') + '>' + ic('right') + T('Move') + '</button>' +
      '<button data-pa="copy">' + ic('copy') + T('Copy') + '</button>' +
      '<button data-pa="del" class="del"' + (n >= G.order.length ? ' disabled' : '') + '>' + ic('trash') + T('Delete') + '</button></div></div>';
  }
  function loadThumbs() {
    var job = G.job, need = [];
    G.order.forEach(function (o) { if (!G.thumbs[o.p] && need.indexOf(o.p) < 0) need.push(o.p); });
    var ch = Promise.resolve();
    need.forEach(function (p) {
      ch = ch.then(function () {
        if (job !== G.job || top() !== 'pages') return;
        return PT.thumb(G.doc, p, 130).then(function (url) {
          G.thumbs[p] = url;
          Array.prototype.forEach.call(document.querySelectorAll('#v-pages .og'), function (el) {
            var o = G.order[+el.getAttribute('data-k')];
            if (o && o.p === p && !el.querySelector('img')) el.querySelector('.pp').insertAdjacentHTML('afterbegin', '<img src="' + url + '" class="' + (o.r ? 'rot' + o.r : '') + '" alt="">');
          });
        });
      });
    });
  }
  A.viewEl('pages').addEventListener('click', function (e) {
    var og = e.target.closest('.og');
    if (og) { var k = +og.getAttribute('data-k'), i = G.sel.indexOf(k); if (i >= 0) G.sel.splice(i, 1); else G.sel.push(k); G.sel.sort(function (a, b) { return a - b; }); A.render(); return; }
    var b = e.target.closest('[data-pa]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-pa');
    if (a === 'clear') { G.sel = []; A.render(); return; }
    if (a === 'rot') { G.sel.forEach(function (k) { G.order[k].r = (G.order[k].r + 90) % 360; }); G.dirty = true; }
    if (a === 'left' || a === 'right') {
      var k1 = G.sel[0], k2 = k1 + (a === 'left' ? -1 : 1), t = G.order[k1]; G.order[k1] = G.order[k2]; G.order[k2] = t; G.sel = [k2]; G.dirty = true;
    }
    if (a === 'copy') {
      var add = 0; G.sel.slice().forEach(function (k) { G.order.splice(k + 1 + add, 0, { p: G.order[k + add].p, r: G.order[k + add].r }); add++; });
      G.sel = []; G.dirty = true;
    }
    if (a === 'del') { G.order = G.order.filter(function (o, k) { return G.sel.indexOf(k) < 0; }); G.sel = []; G.dirty = true; }
    if (a === 'extract') { splitSave(G.sel.map(function (k) { return G.order[k]; }), stem(G.src.name) + ' - pages ' + rangeText(G.sel) + '.pdf'); return; }
    if (a === 'each') { splitEach(); return; }
    A.render();
  });
  function rangeText(list) {
    var out = [], s = null, p = null;
    list.map(function (k) { return k + 1; }).forEach(function (n) { if (s === null) { s = p = n; } else if (n === p + 1) p = n; else { out.push(s === p ? s : s + '-' + p); s = p = n; } });
    if (s !== null) out.push(s === p ? s : s + '-' + p);
    return out.join(',');
  }
  function savePages() {
    busy(T('Saving…'));
    bytesOf(G.src).then(function (bytes) { return PT.organise(bytes, G.order); })
      .then(function (out) { return Files.add(out, stem(G.src.name) + ' - edited.pdf', G.order.length); })
      .then(function (meta) { A.done(); G.dirty = false; A.back(); resultSheet(meta, T('Pages saved as a new PDF')); })
      .catch(function (e) { needUnlocked(G.src, e); });
  }
  function splitSave(order, name) {
    busy(T('Saving…'));
    bytesOf(G.src).then(function (bytes) { return PT.organise(bytes, order); })
      .then(function (out) { return Files.add(out, name, order.length); })
      .then(function (meta) { A.done(); G.sel = []; A.render(); resultSheet(meta, T('Pages saved as a new PDF')); })
      .catch(function (e) { needUnlocked(G.src, e); });
  }
  function splitEach() {
    busy(T('Saving…'));
    var made = 0, ch = bytesOf(G.src);
    G.order.forEach(function (o, k) {
      ch = ch.then(function (bytes) {
        return PT.organise(bytes, [o]).then(function (out) { return Files.add(out, stem(G.src.name) + ' - page ' + (k + 1) + '.pdf', 1); }).then(function () { made++; return bytes; });
      });
    });
    ch.then(function () { A.done(); toast(T('{n} PDFs saved in My files', { n: made })); A.go('myfiles'); }).catch(function (e) { needUnlocked(G.src, e); });
  }

  /* ---------- compress ---------- */
  var C = { src: null, level: 'small', res: null };
  A.VIEWS.compress = {
    noMenu: true,
    title: function () { return T('Compress PDF'); },
    render: function (el) {
      if (!C.src) { S.stack.pop(); A.render(); return; }
      var h = '<div class="frow"><div class="pdfb">PDF</div><div class="fmeta"><b>' + esc(C.src.name) + '</b><span>' + fmtSize(C.src.size || (C.src.bytes && C.src.bytes.length)) + '</span></div></div>';
      if (!C.res) {
        h += '<span class="lab">' + T('How small?') + '</span><div class="optc">' + [['small', 'Small', 'Best for email and job portals'], ['medium', 'Medium', 'Good balance'], ['high', 'High quality', 'For printing']].map(function (o) {
          return '<button class="opt' + (C.level === o[0] ? ' on' : '') + '" data-lv="' + o[0] + '"><span class="mk"></span><span class="ot">' + T(o[1]) + '<small>' + T(o[2]) + '</small></span></button>';
        }).join('') + '</div>' +
          '<div class="note">' + ic('info') + '<span>' + T('Some job portals only accept small files. If an upload fails, choose Small.') + '</span></div>';
      } else {
        var before = C.res.before, after = C.res.after, pct = Math.max(0, Math.round((1 - after / before) * 100));
        h += '<div class="sizebar"><div class="lbl"><span>' + T('Before') + '</span><span>' + T('After') + '</span></div><div class="tr"><i style="width:' + Math.max(3, Math.round(after / before * 100)) + '%"></i></div>' +
          '<div class="big"><s>' + fmtSize(before) + '</s><b>' + fmtSize(after) + '</b><em>' + T('{n}% smaller', { n: pct }) + '</em></div></div>';
        if (C.res.method === 'pictures') h += '<div class="note">' + ic('info') + '<span>' + T('The pages were saved as pictures to make the file small. The text can still be read, but not copied.') + '</span></div>';
        h += '<button class="btn soft block" data-cagain="1">' + T('Try another size') + '</button>';
      }
      el.innerHTML = h;
    },
    actions: function () { return C.res ? '<button class="btn gold" data-act="copen">' + T('Open the small PDF') + '</button>' : '<button class="btn gold" data-act="compress">' + ic('compress', '', 'margin-right:8px;width:20px;height:20px') + T('Compress') + '</button>'; },
    onAction: function (a) {
      if (a === 'compress') { doCompress(); return true; }
      if (a === 'copen' && C.res) { openFile(C.res.meta); return true; }
    }
  };
  A.viewEl('compress').addEventListener('click', function (e) {
    var o = e.target.closest('[data-lv]'); if (o) { C.level = o.getAttribute('data-lv'); A.render(); return; }
    if (e.target.closest('[data-cagain]')) { C.res = null; A.render(); }
  });
  function doCompress() {
    busy(T('Making it smaller…'));
    var before;
    bytesOf(C.src).then(function (bytes) {
      before = bytes.length;
      return PT.compress(bytes, C.level, function (f) { $('#busy-msg').textContent = T('Making it smaller…') + ' ' + Math.round(f * 100) + '%'; });
    }).then(function (r) {
      if (r.method === 'none' || r.bytes.length >= before * 0.97) { A.done(); toast(T('This PDF is already as small as it can be.'), 4000); return; }
      return Files.add(r.bytes, stem(C.src.name) + ' - small.pdf').then(function (meta) {
        A.done(); C.res = { before: before, after: r.bytes.length, method: r.method, meta: meta }; A.render(); resultSheet(meta, T('Your smaller PDF is ready'));
      });
    }).catch(function (e) { needUnlocked(C.src, e); });
  }

  /* ---------- protect an ID copy (watermark) ---------- */
  var COLORS = [[0.6, 0.12, 0.12], [0.33, 0.33, 0.33], [0.12, 0.34, 0.72]];
  var STRENGTH = [0.18, 0.3, 0.45];
  var P = { src: null, text: 'For job applications only', date: true, color: 0, strength: 1, prev: null, job: 0 };
  function wmText() { return (P.text || '').trim() + (P.date ? ' · ' + today() : ''); }
  A.VIEWS.protect = {
    noMenu: true,
    title: function () { return T('Protect ID copy'); },
    render: function (el) {
      var h = '<p class="docs-intro">' + T('Write on your ID copy what it is for. If someone steals it, they cannot easily use it for anything else.') + '</p>';
      if (!P.src) {
        h += '<div class="empty-box">' + ic('id') + '<div>' + T('Choose your ID copy: a PDF or a photo.') + '</div></div>' +
          '<button class="btn block" data-pr="choose">' + ic('folder', '', 'margin-right:8px') + T('Choose file') + '</button>';
        el.innerHTML = h; return;
      }
      var c = COLORS[P.color], rgb = 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + STRENGTH[P.strength] + ')';
      h += '<div class="wm-prev">' + (P.prev ? '<img src="' + P.prev + '" alt="">' : '<div class="busy-card" style="box-shadow:none;background:none"><div class="spin"></div></div>') + '<div class="wm" id="wm-ov"></div></div>' +
        '<div class="hint" style="text-align:center;margin-bottom:8px">' + esc(P.src.name) + '</div>' +
        '<span class="lab">' + T('Text on the copy') + '</span><input class="inp" id="wm-text" value="' + esc(P.text) + '" autocomplete="off">' +
        '<label class="chk" style="margin-top:10px"><input type="checkbox" id="wm-date"' + (P.date ? ' checked' : '') + '><span>' + T("Add today's date ({date})", { date: today() }) + '</span></label>' +
        '<span class="lab">' + T('Colour') + '</span><div class="swatches">' + COLORS.map(function (k, i) { return '<button class="' + (P.color === i ? 'on' : '') + '" data-wc="' + i + '" style="background:rgb(' + k.map(function (v) { return Math.round(v * 255); }).join(',') + ')"></button>'; }).join('') + '</div>' +
        '<span class="lab">' + T('Strength') + '</span><div class="seg">' + ['Light', 'Medium', 'Strong'].map(function (s, i) { return '<button class="' + (P.strength === i ? 'on' : '') + '" data-ws="' + i + '">' + T(s) + '</button>'; }).join('') + '</div>';
      el.innerHTML = h;
      drawOverlay(rgb);
      if (!P.prev) loadPreview();
    },
    actions: function () { return P.src ? '<button class="btn soft" data-act="wmchoose">' + T('Choose another') + '</button><button class="btn gold" data-act="wmsave">' + ic('save', '', 'margin-right:8px;width:20px;height:20px') + T('Save copy') + '</button>' : ''; },
    onAction: function (a) { if (a === 'wmchoose') { chooseProtect(); return true; } if (a === 'wmsave') { saveProtect(); return true; } }
  };
  function drawOverlay(rgb) {
    var ov = $('#wm-ov'), box = ov && ov.parentNode; if (!ov) return;
    var w = box.clientWidth || 320, fs = Math.max(9, w * 0.034), t = esc(wmText()) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', line = '';
    for (var i = 0; i < 8; i++) line += t;
    var rows = Math.ceil((box.clientHeight || w) * 2 / (fs * 5)) + 2, h = '';
    for (var r = 0; r < rows; r++) h += '<div style="font-size:' + fs.toFixed(1) + 'px;color:' + rgb + '">' + line + '</div>';
    ov.innerHTML = h;
  }
  function loadPreview() {
    var job = ++P.job, src = P.src;
    bytesOf(src).then(function (bytes) {
      if (src.kind === 'image') return PT.photoJpg(bytes, src.mime, 1000, 0.8).then(function (j) { return URL.createObjectURL(new Blob([j], { type: 'image/jpeg' })); });
      return openDoc(bytes, src.name, src.pw).then(function (r) { return PT.renderPage(r.doc, 0, 600, 1).then(function (cv) { r.doc.destroy(); return cv.toDataURL('image/jpeg', 0.8); }); });
    }).then(function (url) { if (job !== P.job) return; P.prev = url; if (top() === 'protect') A.render(); }).catch(function (e) { if (e.message !== 'cancel') failMsg(e); });
  }
  function chooseProtect() {
    choose({ title: T('Choose your ID copy'), photos: true, cvDocs: true }).then(function (l) {
      var s = l[0];
      if (s.kind !== 'pdf' && s.kind !== 'image') { toast(T('Please choose a PDF or a photo.')); return; }
      P.src = s; P.prev = null; A.render();
    });
  }
  A.viewEl('protect').addEventListener('click', function (e) {
    if (e.target.closest('[data-pr]')) { chooseProtect(); return; }
    var c = e.target.closest('[data-wc]'); if (c) { P.color = +c.getAttribute('data-wc'); A.render(); return; }
    var s = e.target.closest('[data-ws]'); if (s) { P.strength = +s.getAttribute('data-ws'); A.render(); }
  });
  A.viewEl('protect').addEventListener('input', function (e) {
    if (e.target.id === 'wm-text') { P.text = e.target.value; var c = COLORS[P.color]; drawOverlay('rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + STRENGTH[P.strength] + ')'); }
  });
  A.viewEl('protect').addEventListener('change', function (e) { if (e.target.id === 'wm-date') { P.date = e.target.checked; A.render(); } });
  function saveProtect() {
    if (!(P.text || '').trim()) { toast(T('Write the text to put on the copy')); return; }
    busy(T('Protecting your copy…'));
    bytesOf(P.src).then(function (bytes) {
      if (P.src.kind === 'image') return PT.photoJpg(bytes, P.src.mime).then(function (j) { return PT.imagesToPdf([{ bytes: j, fit: 'auto' }], base(P.src.name)); });
      return bytes;
    }).then(function (pdf) { return PT.watermark(pdf, { text: wmText(), color: COLORS[P.color], opacity: STRENGTH[P.strength] }); })
      .then(function (out) { return Files.add(out, stem(P.src.name) + ' - protected.pdf'); })
      .then(function (meta) { A.done(); resultSheet(meta, T('Your protected copy is ready')); })
      .catch(function (e) { needUnlocked(P.src, e); });
  }

  /* ---------- password ---------- */
  var K = { src: null };
  A.VIEWS.lock = {
    noMenu: true,
    title: function () { return T('Add a password'); },
    render: function (el) {
      if (!K.src) { S.stack.pop(); A.render(); return; }
      el.innerHTML = '<div class="frow"><div class="pdfb">PDF</div><div class="fmeta"><b>' + esc(K.src.name) + '</b><span>' + fmtSize(K.src.size || (K.src.bytes && K.src.bytes.length)) + '</span></div></div>' +
        '<span class="lab">' + T('Password') + '</span><div class="pw-row"><input class="inp" type="password" id="pw1" autocomplete="new-password"><span class="ibtn" data-show="1">' + ic('eye') + '</span></div>' +
        '<span class="lab">' + T('Type it again') + '</span><input class="inp" type="password" id="pw2" autocomplete="new-password">' +
        '<div class="note" style="margin-top:16px">' + ic('info') + '<span>' + T('Write the password down. Nobody can open the PDF without it - not even this app. Many job portals do not accept PDFs with a password.') + '</span></div>';
    },
    actions: function () { return '<button class="btn gold" data-act="lock">' + ic('lock', '', 'margin-right:8px;width:20px;height:20px') + T('Lock PDF') + '</button>'; },
    onAction: function (a) { if (a === 'lock') { doLock(); return true; } }
  };
  A.viewEl('lock').addEventListener('click', function (e) {
    if (e.target.closest('[data-show]')) { ['pw1', 'pw2'].forEach(function (id) { var i = $('#' + id); i.type = i.type === 'password' ? 'text' : 'password'; }); }
  });
  function doLock() {
    var a = $('#pw1').value, b = $('#pw2').value;
    if (a.length < 4) { toast(T('Use at least 4 letters or numbers.')); return; }
    if (a !== b) { toast(T('The two passwords are not the same.')); return; }
    if (/[^\x20-\x7e]/.test(a)) { toast(T('Use only letters, numbers and simple signs.')); return; }
    busy(T('Locking…'));
    bytesOf(K.src).then(function (bytes) { return PT.protect(bytes, a); })
      .then(function (out) { return Files.add(out, stem(K.src.name) + ' - locked.pdf'); })
      .then(function (meta) { A.done(); A.back(); resultSheet(meta, T('Your PDF now has a password')); })
      .catch(function (e) { needUnlocked(K.src, e); });
  }

  /* ---------- Word to PDF ---------- */
  function wordFlow(src) {
    var p = src ? Promise.resolve(src) : pickFiles('.docx,' + DOCX).then(function (fs) { return fromFile(fs[0]); });
    p.then(function (s) {
      if (s.kind === 'doc') { toast(T('Old .doc files cannot be read. Open it in Word or WPS and save it as .docx first.'), 6000); return; }
      if (s.kind !== 'docx') { toast(T('Please choose a Word (.docx) file.')); return; }
      busy(T('Turning your Word file into a PDF…'));
      return window.CVWord.toPdf(s.bytes).then(function (r) { return Files.add(r.bytes, base(s.name) + '.pdf', r.pages); })
        .then(function (meta) { A.done(); resultSheet(meta, T('Your PDF is ready')); });
    }).catch(failMsg);
  }

  /* ---------- files opened from other apps ("Open with CV Maker SA") ---------- */
  function incoming() {
    if (!NATIVE || !NATIVE.incoming) return;
    var info; try { info = JSON.parse(NATIVE.incoming() || 'null'); } catch (e) { info = null; }
    if (!info || !info.size) return;
    var chunks = [], off = 0, CH = 512 * 1024;
    try {
      while (off < info.size) {
        var b = NATIVE.readIncoming(off, CH); if (!b) break;
        var s = atob(b), u = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        chunks.push(u); off += u.length; if (!u.length) break;
      }
    } catch (e) { NATIVE.clearIncoming(); toast(T('That file could not be opened')); return; }
    NATIVE.clearIncoming();
    var bytes = new Uint8Array(off), p = 0; chunks.forEach(function (c) { bytes.set(c, p); p += c.length; });
    var src = { name: info.name || 'Document', bytes: bytes, mime: info.mime || '', kind: kindOf(info.name, info.mime, bytes), size: bytes.length };
    while (S.stack.length > 1) S.stack.pop();
    S.cur = null;
    if (src.kind === 'pdf') keepAndOpen(src);
    else if (src.kind === 'image' && A.PDF.startScan) { A.render(); A.PDF.startScan('photos', [src]); }
    else if (src.kind === 'docx' || src.kind === 'doc') { A.render(); wordFlow(src); }
    else toast(T('That file could not be opened'));
  }
  window.onIncomingFile = function () { setTimeout(incoming, 50); };
  setTimeout(incoming, 700);
  if (top() === 'home') A.renderHome();

  A.PDF = {
    IC: IC, ic: ic, Files: Files, pickFiles: pickFiles, fromFile: fromFile, choose: choose, bytesOf: bytesOf, base: base, today: today,
    resultSheet: resultSheet, addToCv: addToCv, openFile: openFile, openDoc: openDoc, askPassword: askPassword, needUnlocked: needUnlocked,
    failMsg: failMsg, refreshBar: refreshBar, runTool: runTool, kindOf: kindOf, stem: stem
  };
})();
