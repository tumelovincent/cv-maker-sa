/* Screens: cover letter, Z83 form, signature pad */
(function () {
  'use strict';
  var A = window.App, D = window.CVData, L = window.CVLetter, Z = window.CVZ83;
  var $ = A.$, esc = A.esc, svg = A.svg, T = A.T, S = A.S;

  /* ---------- signature / initials pad ---------- */
  // target (optional): where the drawing is kept - { get(), set(v), text } - by default the open CV
  function signPad(kind, after, target) {
    var isSig = kind !== 'initials';
    target = target || { get: function () { return S.cur[kind]; }, set: function (v) { S.cur[kind] = v; A.saveNow(); } };
    var sh = A.openSheet('<h3>' + T(isSig ? 'Your signature' : 'Your initials') + '</h3><p>' +
      (target.text || T(isSig ? 'Sign with your finger in the box. It is added to your declaration, cover letter and Z83.' : 'Write your initials with your finger. They are added at the bottom of every Z83 page.')) + '</p>' +
      '<div class="pad-wrap"><canvas class="pad" id="pad"></canvas><div class="pad-line"></div></div>' +
      '<div class="sheet-foot"><button class="btn ghost" data-s="clear">' + T('Clear') + '</button>' +
      (target.get() ? '<button class="btn ghost" data-s="remove">' + T('Remove') + '</button>' : '') +
      '<button class="btn" data-s="save">' + T('Save') + '</button></div>');
    var cv = $('#pad'), wrap = sh.querySelector('.pad-wrap');
    var W = wrap.clientWidth, H = isSig ? 190 : 150, R = Math.min(3, window.devicePixelRatio || 2);
    cv.width = W * R; cv.height = H * R; cv.style.height = H + 'px';
    var g = cv.getContext('2d');
    g.scale(R, R); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#13286B'; g.lineWidth = 2.6;
    var drawing = false, last = null, inked = false;
    function pt(e) { var r = cv.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; }
    function down(e) { e.preventDefault(); drawing = true; last = pt(e); g.beginPath(); g.arc(last.x, last.y, 1.2, 0, 7); g.fillStyle = '#13286B'; g.fill(); inked = true; }
    function move(e) {
      if (!drawing) return; e.preventDefault();
      var p = pt(e); g.beginPath(); g.moveTo(last.x, last.y);
      g.quadraticCurveTo(last.x, last.y, (last.x + p.x) / 2, (last.y + p.y) / 2); g.lineTo(p.x, p.y); g.stroke(); last = p;
    }
    function up() { drawing = false; }
    cv.addEventListener('touchstart', down, { passive: false }); cv.addEventListener('touchmove', move, { passive: false }); cv.addEventListener('touchend', up);
    cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    sh.onclick = function (e) {
      var b = e.target.closest('[data-s]'); if (!b) return;
      var a = b.getAttribute('data-s');
      if (a === 'clear') { g.clearRect(0, 0, W, H); inked = false; return; }
      if (a === 'remove') { target.set(''); A.closeSheet(); if (after) after(''); return; }
      if (a === 'save') {
        if (!inked) { A.toast(T('Draw in the box first')); return; }
        var v = trim(cv); target.set(v); A.closeSheet(); A.toast(T(isSig ? 'Signature saved' : 'Initials saved')); if (after) after(v);
      }
    };
  }
  // cut away the empty space around the drawing
  function trim(cv) {
    var g = cv.getContext('2d'), w = cv.width, h = cv.height, d = g.getImageData(0, 0, w, h).data;
    var x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 10) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return '';
    var pad = 8, cw = Math.min(w, x1 - x0 + 1 + pad * 2), ch = Math.min(h, y1 - y0 + 1 + pad * 2);
    var out = document.createElement('canvas'); out.width = cw; out.height = ch;
    out.getContext('2d').drawImage(cv, Math.max(0, x0 - pad), Math.max(0, y0 - pad), cw, ch, 0, 0, cw, ch);
    return out.toDataURL('image/png');
  }
  function sigRow(kind, label, hint) {
    var v = S.cur[kind];
    return '<div class="sig-row"><div class="sig-prev">' + (v ? '<img src="' + v + '" alt="">' : '<span>' + T('Not added') + '</span>') + '</div>' +
      '<div class="sig-m"><b>' + T(label) + '</b><small>' + T(hint) + '</small><button class="btn soft small" data-sign="' + kind + '">' + svg('pen') + T(v ? 'Change' : 'Add') + '</button></div></div>';
  }
  A.signPad = signPad;
  A.sigRow = sigRow;

  function fld(key, label, value, o) {
    o = o || {};
    var id = 'lf-' + key;
    var lab = '<label for="' + id + '">' + esc(T(label)) + (o.opt ? ' <span class="optional">(' + T('optional') + ')</span>' : '') + '</label>';
    var attrs = ' id="' + id + '" data-lf="' + key + '"' + (o.ph ? ' placeholder="' + esc(T(o.ph)) + '"' : '') + ' autocomplete="off"' + (o.mode ? ' inputmode="' + o.mode + '"' : '');
    var input = o.area ? '<textarea' + attrs + ' rows="' + (o.rows || 3) + '">' + esc(value || '') + '</textarea>' : '<input type="text"' + attrs + ' value="' + esc(value || '') + '">';
    return '<div class="fld">' + lab + input + (o.hint ? '<div class="hint">' + esc(T(o.hint)) + '</div>' : '') + '</div>';
  }
  function pickFld(key, label, value, o) {
    o = o || {};
    return '<div class="fld"><label>' + esc(T(label)) + (o.opt ? ' <span class="optional">(' + T('optional') + ')</span>' : '') + '</label>' +
      '<button type="button" class="pick' + (value ? '' : ' empty') + '" data-lpick="' + key + '"><span class="pv">' + esc(value || T('Choose')) + '</span>' +
      '<svg class="pk-ch" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></button></div>';
  }
  function card(title, body, sub) {
    return '<div class="fcard"><div class="fcard-h"><b>' + esc(T(title)) + '</b>' + (sub ? '<small>' + esc(T(sub)) + '</small>' : '') + '</div>' + body + '</div>';
  }

  /* ---------- cover letter ---------- */
  var SOURCES = ['PNet', 'Careers24', 'Indeed', 'LinkedIn', 'the company website', 'the DPSA vacancy circular', 'Facebook', 'a newspaper', 'the SAYouth platform', 'a notice board'];
  function renderLetter(el) {
    var c = S.cur, Lt = L.get(c);
    var paras = L.paras(c);
    while (paras.length < 4) paras.push('');
    var h = '<p class="docs-intro">' + T('Fill in the job details. Your letter is written for you from your CV, and you can change any of it.') + '</p>';
    h += card('The job', fld('position', 'Job title', Lt.position, { ph: 'e.g. Stock Controller' }) + fld('company', 'Company or department', Lt.company, { opt: 1 }) +
      '<div class="row2"><div class="cell">' + fld('ref', 'Reference number', Lt.ref, { opt: 1 }) + '</div><div class="cell">' + pickFld('source', 'Where you saw the job', Lt.source, { opt: 1 }) + '</div></div>');
    h += card('Who the letter goes to', fld('recipient', 'Name', Lt.recipient, { opt: 1, ph: 'e.g. Ms N. Dlamini', hint: 'Leave empty to start with "Dear Sir/Madam".' }) +
      fld('recipientTitle', 'Their job title', Lt.recipientTitle, { opt: 1, ph: 'e.g. The HR Manager' }) + fld('address', 'Address', Lt.address, { opt: 1, area: 1, rows: 3 }));
    h += card('Your letter', '<div class="lt-tools"><span class="hint">' + T(Lt.edited ? 'You have changed the text. Tap "Write it again" to start over from your CV.' : 'Written from your CV. It updates as you fill in the job details.') + '</span>' +
      '<button class="btn soft small" data-l="redraft">' + T('Write it again') + '</button></div>' +
      paras.map(function (p, i) { return '<div class="fld"><label for="lp-' + i + '">' + T('Paragraph {n}', { n: i + 1 }) + '</label><textarea id="lp-' + i + '" data-lpara="' + i + '" rows="5">' + esc(p) + '</textarea></div>'; }).join(''));
    h += card('Signature', sigRow('signature', 'Signature', 'Shown above your name'));
    el.innerHTML = h;
  }
  function refreshDraft(el) {
    var c = S.cur, Lt = L.get(c);
    if (Lt.edited) return;
    var ps = L.draft(c);
    Array.prototype.forEach.call(el.querySelectorAll('[data-lpara]'), function (ta, i) { if (document.activeElement !== ta) ta.value = ps[i] || ''; });
  }
  function letterEvents() {
    var el = document.getElementById('v-letter');
    el.addEventListener('input', function (e) {
      var t = e.target, c = S.cur; if (!c) return;
      var Lt = L.get(c);
      if (t.hasAttribute('data-lf')) { Lt[t.getAttribute('data-lf')] = t.value; A.saveSoon(); refreshDraft(el); return; }
      if (t.hasAttribute('data-lpara')) {
        if (!Lt.edited) { Lt.paras = L.draft(c); while (Lt.paras.length < 4) Lt.paras.push(''); Lt.edited = true; }
        Lt.paras[+t.getAttribute('data-lpara')] = t.value; A.saveSoon();
      }
    });
    el.addEventListener('click', function (e) {
      var c = S.cur, Lt = L.get(c);
      var sg = e.target.closest('[data-sign]');
      if (sg) { signPad(sg.getAttribute('data-sign'), function () { A.render(); }); return; }
      var pk = e.target.closest('[data-lpick]');
      if (pk) {
        A.choicePicker(T('Where you saw the job'), { choices: SOURCES, other: true }, Lt.source, false, function (v) { Lt.source = v; A.saveNow(); A.render(); });
        return;
      }
      if (e.target.closest('[data-l="redraft"]')) {
        var go = function () { Lt.edited = false; Lt.paras = null; A.saveNow(); A.render(); A.toast(T('Letter written again from your CV')); };
        if (Lt.edited) A.confirmSheet(T('Write the letter again?'), T('Your changes to the letter text will be replaced.'), T('Write again'), true).then(function (ok) { if (ok) go(); });
        else go();
      }
    });
  }

  /* ---------- Z83 ---------- */
  var START = ['Immediately', '1 month notice', '2 weeks notice', '3 months notice'];
  function seg(key, options, value) {
    return '<div class="seg" data-zseg="' + key + '">' + options.map(function (o) { return '<button type="button" class="' + (value === o ? 'on' : '') + '" data-v="' + esc(o) + '">' + esc(T(o)) + '</button>'; }).join('') + '</div>';
  }
  function zq(c, k, extra) {
    var v = Z.val(c, k);
    var h = '<div class="zq"><div class="zq-t">' + esc(T(Z.QTEXT[k])) + '</div>' + seg(k, ['Yes', 'No'], v);
    if (Z.DETAILS[k] && v === 'Yes') h += '<textarea class="zq-d" data-zf="' + k + 'Details" rows="2" placeholder="' + esc(T('Give the details')) + '">' + esc(Z.get(c)[k + 'Details'] || '') + '</textarea>';
    return h + (extra || '') + '</div>';
  }
  function zfld(c, key, label, o) {
    o = o || {};
    var z = Z.get(c), v = z[key] !== undefined && z[key] !== null ? z[key] : Z.auto(c, key);
    return '<div class="fld"><label>' + esc(T(label)) + (o.opt ? ' <span class="optional">(' + T('optional') + ')</span>' : '') + '</label><input type="text" data-zf="' + key + '" value="' + esc(v || '') + '"' +
      (o.ph ? ' placeholder="' + esc(T(o.ph)) + '"' : '') + (o.mode ? ' inputmode="' + o.mode + '"' : '') + ' autocomplete="off"></div>';
  }
  function fromCV(title, lines, sec) {
    return '<div class="zcv"><div class="zcv-h"><span>' + esc(T(title)) + '</span><button class="link" data-zcv="' + sec + '">' + T('Edit in CV') + '</button></div>' +
      (lines.length ? lines.map(function (x) { return '<div class="zcv-l">' + esc(x) + '</div>'; }).join('') : '<div class="zcv-l empty">' + T('Nothing in your CV yet') + '</div>') + '</div>';
  }
  function renderZ83(el) {
    var c = S.cur, z = Z.get(c), p = c.personal || {};
    var miss = Z.missing(c);
    var h = '<p class="docs-intro">' + T('The Z83 is required for public service (government) jobs. Details from your CV are already filled in. Answer every question: incomplete forms may not be considered.') + '</p>';
    if (miss.length) h += '<div class="zmiss"><b>' + T('Still to complete ({n})', { n: miss.length }) + '</b>' + miss.map(function (m) { return '<span>' + esc(T(m[1])) + '</span>'; }).join('') + '</div>';
    else h += '<div class="zok">' + svg('check') + T('Every question is answered.') + '</div>';
    h += card('A. The advertised post', zfld(c, 'position', 'Position for which you are applying (as advertised)', { ph: 'e.g. Administration Clerk' }) +
      zfld(c, 'department', 'Department where the position was advertised', { ph: 'e.g. Department of Health' }) +
      zfld(c, 'ref', 'Reference number (as stated in the advert)') +
      '<div class="fld"><label>' + esc(T('When can you start?')) + '</label>' + seg('start', START, Z.val(c, 'start')) + '</div>');
    var personLines = [[p.surname, p.firstNames].filter(Boolean).join(', '), p.dob ? T('Born') + ' ' + A.fmtDate(p.dob) : '', p.idNumber ? T('ID') + ' ' + p.idNumber : '',
      [p.race, p.gender].filter(Boolean).join(', ')].filter(Boolean);
    var b = fromCV('From your CV', personLines, 'personal') + zfld(c, 'passport', 'Passport number (non-South Africans only)', { opt: 1 });
    b += zq(c, 'disability');
    b += zq(c, 'citizen', Z.val(c, 'citizen') === 'No' ? zfld(c, 'nationality', 'If no, what is your nationality?') + '<div class="zq-sub">' + esc(T(Z.QTEXT.permit)) + seg('permit', ['Yes', 'No'], Z.val(c, 'permit')) + '</div>' : '');
    ['convicted', 'pending', 'dismissed', 'discPending', 'resigned', 'discharged'].forEach(function (k) { b += zq(c, k); });
    b += zq(c, 'business', Z.val(c, 'business') === 'Yes' ? '<div class="zq-sub">' + esc(T(Z.QTEXT.relinquish)) + seg('relinquish', ['Yes', 'No'], Z.val(c, 'relinquish')) + '</div>' : '');
    b += '<div class="fld"><label>' + esc(T('Total years of experience')) + '</label><div class="row2"><div class="cell">' + zfld(c, 'expPrivate', 'Private sector', { mode: 'decimal' }) + '</div><div class="cell">' + zfld(c, 'expPublic', 'Public sector', { mode: 'decimal' }) + '</div></div></div>';
    b += '<div class="fld"><label>' + esc(T('Professional registration (only if your job requires it)')) + '</label><div class="row2"><div class="cell">' + zfld(c, 'regDate', 'Date', { opt: 1 }) + '</div><div class="cell">' + zfld(c, 'regNo', 'Reg. No', { opt: 1 }) + '</div></div></div>';
    h += card('B. Personal information', b);
    h += card('C. Contact details', '<div class="fld"><label>' + esc(T('Preferred language for correspondence')) + '</label><button type="button" class="pick" data-zpick="prefLang"><span class="pv">' + esc(Z.val(c, 'prefLang')) + '</span>' +
      '<svg class="pk-ch" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg></button></div>' +
      '<div class="fld"><label>' + esc(T('Method for correspondence')) + '</label>' + seg('method', ['Post', 'E-mail', 'Fax', 'Telephone'], Z.val(c, 'method')) + '</div>' +
      zfld(c, 'contactDetail', 'Contact details (in terms of the above)'));
    var lg = Z.langs(c);
    h += card('D. Official language proficiency', lg.map(function (l, i) {
      return '<div class="zlang" data-li="' + i + '"><div class="zlang-h"><button type="button" class="pick" data-zlang="' + i + '"><span class="pv">' + esc(l.name || T('Choose')) + '</span></button>' +
        '<button class="icon-btn danger" data-zlrm="' + i + '" aria-label="Remove">' + svg('del') + '</button></div>' +
        '<div class="zlang-r"><span>' + T('Speak') + '</span>' + seg('L' + i + 's', ['Good', 'Fair', 'Poor'], l.speak) + '</div>' +
        '<div class="zlang-r"><span>' + T('Write or read') + '</span>' + seg('L' + i + 'w', ['Good', 'Fair', 'Poor'], l.write) + '</div></div>';
    }).join('') + '<button class="btn soft block add" data-zladd="1">' + svg('plus') + T('Add a language') + '</button>');
    h += card('E. Formal qualifications', fromCV('From your CV (highest first)', Z.quals(c).map(function (q) { return [q.qual, q.school, q.year].filter(Boolean).join(', '); }), 'tertiary') +
      zfld(c, 'currentStudy', 'Current study (institution and qualification)', { opt: 1 }));
    h += card('F. Work experience', fromCV('From your CV', Z.jobs(c).map(function (j) { return [j.post, j.employer, [j.from, j.to].filter(Boolean).join(' - ')].filter(Boolean).join(', '); }), 'work') + zq(c, 'condition'));
    h += card('G. References', fromCV('From your CV', (c.references || []).filter(function (r) { return r.name; }).map(function (r) { return [r.name, r.relationship, r.phone].filter(Boolean).join(', '); }), 'refs'));
    h += card('Declaration', '<p class="zdecl-t">' + esc(T('I declare that all the information provided (including any attachments) is complete and correct to the best of my knowledge.')) + '</p>' +
      sigRow('signature', 'Signature', 'Required') + sigRow('initials', 'Initials', 'Each page must be initialled'));
    el.innerHTML = h;
  }
  function z83Events() {
    var el = document.getElementById('v-z83');
    el.addEventListener('input', function (e) {
      var t = e.target, c = S.cur; if (!c || !t.hasAttribute('data-zf')) return;
      Z.get(c)[t.getAttribute('data-zf')] = t.value; A.saveSoon();
    });
    el.addEventListener('click', function (e) {
      var c = S.cur, z = Z.get(c), y = window.scrollY;
      function redraw() { A.saveNow(); A.render(); window.scrollTo(0, y); }
      var sb = e.target.closest('[data-zseg] [data-v]');
      if (sb) {
        var k = sb.parentNode.getAttribute('data-zseg'), v = sb.getAttribute('data-v');
        var m = /^L(\d+)([sw])$/.exec(k);
        if (m) { var lg = Z.langs(c).slice(); lg[+m[1]] = Object.assign({}, lg[+m[1]]); lg[+m[1]][m[2] === 's' ? 'speak' : 'write'] = v; z.langs = lg; }
        else z[k] = Z.val(c, k) === v && k !== 'start' && k !== 'method' ? '' : v;
        if (k === 'method') delete z.contactDetail;
        redraw(); return;
      }
      var sg = e.target.closest('[data-sign]');
      if (sg) { signPad(sg.getAttribute('data-sign'), redraw); return; }
      var pk = e.target.closest('[data-zpick]');
      if (pk) { A.choicePicker(T('Preferred language for correspondence'), A.PICK.lang, Z.val(c, 'prefLang'), false, function (v) { z.prefLang = v; redraw(); }); return; }
      var lp = e.target.closest('[data-zlang]');
      if (lp) {
        var i = +lp.getAttribute('data-zlang');
        A.choicePicker(T('Language'), A.PICK.lang, Z.langs(c)[i].name, false, function (v) { var lg = Z.langs(c).slice(); lg[i] = Object.assign({}, lg[i], { name: v }); z.langs = lg; redraw(); });
        return;
      }
      var lr = e.target.closest('[data-zlrm]');
      if (lr) { var lg2 = Z.langs(c).slice(); lg2.splice(+lr.getAttribute('data-zlrm'), 1); z.langs = lg2; redraw(); return; }
      if (e.target.closest('[data-zladd]')) { var lg3 = Z.langs(c).slice(); lg3.push({ name: '', speak: 'Good', write: 'Good' }); z.langs = lg3; redraw(); return; }
      var cvl = e.target.closest('[data-zcv]');
      if (cvl) { var sec = cvl.getAttribute('data-zcv'); S.open = {}; S.open[sec] = true; A.go('edit'); setTimeout(function () { var s2 = document.querySelector('[data-sec="' + sec + '"]'); if (s2) s2.scrollIntoView({ block: 'start' }); }, 60); }
    });
  }

  var actions = function () {
    return '<button class="btn soft" data-act="prev">' + svg('eye') + T('Preview') + '</button><button class="btn gold" data-act="dl">' + svg('pdf') + T('Download') + '</button>';
  };
  A.VIEWS.letter = { title: function () { return T('Cover letter'); }, render: renderLetter, actions: actions, needsCV: true,
    onAction: function (act) { if (act === 'prev') { S.pvTab = 'letter'; } } };
  A.VIEWS.z83 = { title: function () { return T('Z83 form'); }, render: renderZ83, actions: actions, needsCV: true,
    onAction: function (act) { if (act === 'prev') { S.pvTab = 'z83'; } } };
  // the views' elements exist once registered
  ['letter', 'z83'].forEach(function (k) { if (!document.getElementById('v-' + k)) { var s = document.createElement('section'); s.className = 'view'; s.id = 'v-' + k; s.hidden = true; $('#main').appendChild(s); } });
  letterEvents(); z83Events();
})();
