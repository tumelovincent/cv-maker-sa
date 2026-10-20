/* Cover letter: details, an automatic first draft written from the CV, and an A4 page in the CV's design */
(function () {
  'use strict';
  var D = window.CVData, TP = window.CVTemplates;
  var esc = TP.esc;

  function blank() {
    return { position: '', company: '', ref: '', source: '', recipient: '', recipientTitle: '', address: '', paras: null, edited: false };
  }
  function get(cv) {
    if (!cv.letter) cv.letter = blank();
    return cv.letter;
  }
  function lcFirst(s) { s = String(s || '').trim(); return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function noDot(s) { return String(s || '').trim().replace(/[.;,]+$/, ''); }
  function listText(arr) {
    arr = arr.filter(Boolean);
    if (arr.length < 2) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }
  // turns common CV phrases into words that fit inside a sentence
  var SKILL_WORDS = { 'computer literate (ms office)': 'computer literacy (MS Office)', 'computer literate (ms word, excel)': 'computer literacy (MS Word and Excel)',
    'computer literate': 'computer literacy', 'good communication': 'good communication skills' };
  var ATTR_WORDS = { 'team player': 'a good team player', 'fast learner': 'a fast learner', 'good communicator': 'a good communicator',
    'works well under pressure': 'able to work well under pressure', 'hard-working': 'hard-working', 'hard working': 'hard-working' };
  function skillWord(x) {
    var k = noDot(x).toLowerCase();
    if (SKILL_WORDS[k]) return SKILL_WORDS[k];
    return /^[A-Z]{2,}/.test(x) ? noDot(x) : lcFirst(noDot(x));
  }
  function attrWord(x) {
    var k = noDot(x).toLowerCase();
    if (ATTR_WORDS[k]) return ATTR_WORDS[k];
    if (/^works?\s/i.test(k)) return 'able to ' + k.replace(/^works?/, 'work');
    if (/^(good|great|strong)\s/i.test(k)) return 'a ' + k;
    return k;
  }
  // "Retail Merchandiser" -> "retail merchandiser" (keeps acronyms such as HR or IT)
  function plain(s) { return noDot(s).split(/\s+/).map(function (w) { return /^[A-Z0-9]{2,}$/.test(w) ? w : w.toLowerCase(); }).join(' '); }
  function an(word) { return /^[aeiou]/i.test(word || '') ? 'an' : 'a'; }
  function monthsOf(w) {
    var a = /^(\d{4})-(\d{2})/.exec(w.start || ''), e = w.current ? null : /^(\d{4})-(\d{2})/.exec(w.end || '');
    if (!a) return 0;
    var now = new Date(), ey = e ? +e[1] : now.getFullYear(), em = e ? +e[2] : now.getMonth() + 1;
    return Math.max(0, (ey - +a[1]) * 12 + (em - +a[2]) + 1);
  }
  function durText(n) {
    var y = Math.floor(n / 12), m = n % 12, out = [];
    if (y) out.push(y + (y === 1 ? ' year' : ' years'));
    if (m && y < 3) out.push(m + (m === 1 ? ' month' : ' months'));
    return out.join(' and ');
  }

  // first draft of the four paragraphs, written from the CV and the job details
  function draft(cv) {
    var L = get(cv), p = cv.personal || {}, c = cv.contact || {};
    var pos = noDot(L.position) || 'the advertised position';
    var p1 = 'I wish to apply for the position of ' + pos + (L.company ? ' at ' + noDot(L.company) : '') +
      (L.source ? ', as advertised on ' + noDot(L.source) : '') + (L.ref ? ' (reference number ' + noDot(L.ref) + ')' : '') + '.';
    if (p.headline) p1 += ' I am ' + an(plain(p.headline)) + ' ' + plain(p.headline) + ', and I believe my experience and attitude make me a good fit for this role.';
    else p1 += ' I believe my skills and attitude make me a good fit for this role.';

    var work = (cv.work || []).filter(function (w) { return w.company || w.position; });
    var p2;
    if (work.length) {
      var months = work.reduce(function (t, w) { return t + monthsOf(w); }, 0);
      var w0 = work[0];
      p2 = 'I have ' + (months >= 3 ? durText(months) + ' of ' : '') + 'work experience' +
        (w0.position ? (w0.current ? ', and I currently work as ' : ', most recently as ') + an(w0.position) + ' ' + noDot(w0.position) + (w0.company ? ' at ' + noDot(w0.company) : '') : '') + '.';
      var duties = D.lines(w0.duties).slice(0, 3).map(function (x) { return lcFirst(noDot(x)); });
      if (duties.length) p2 += ' My main duties ' + (w0.current ? 'are' : 'were') + ': ' + duties.join('; ') + '.';
      if (work.length > 1 && work[1].position) p2 += ' Before that I worked as ' + an(work[1].position) + ' ' + noDot(work[1].position) + (work[1].company ? ' at ' + noDot(work[1].company) : '') + '.';
    } else {
      p2 = 'I am eager to start my career, and I am ready to learn quickly and work hard to gain experience.';
    }

    var p3 = '', ter = (cv.tertiary || []).filter(function (x) { return x.qualification; }), s = cv.school || {};
    if (ter.length) {
      var t0 = ter[0];
      p3 = t0.status === 'In progress' ? 'I am currently studying towards ' + noDot(t0.qualification) + (t0.institution ? ' at ' + noDot(t0.institution) : '') + '.' :
        'I hold ' + (/^(a|an|the)\s/i.test(t0.qualification) ? '' : an(t0.qualification) + ' ') + noDot(t0.qualification) + (t0.institution ? ' from ' + noDot(t0.institution) : '') + '.';
    } else if (s.grade || s.name) {
      p3 = 'I passed ' + noDot(s.grade || 'Grade 12') + (s.name ? ' at ' + noDot(s.name) : '') + (s.year ? ' in ' + s.year : '') + '.';
    }
    var skills = D.lines(cv.skills).slice(0, 4).map(skillWord);
    var attrs = D.lines(cv.attributes).slice(0, 3).map(attrWord);
    if (skills.length) p3 += (p3 ? ' ' : '') + 'My skills include ' + listText(skills) + '.';
    if (attrs.length) p3 += (p3 ? ' ' : '') + 'I am ' + listText(attrs) + '.';

    var contact = [c.phone ? 'on ' + c.phone : '', c.email ? 'by email at ' + c.email : ''].filter(Boolean).join(' or ');
    var p4 = 'Please find my CV' + ((cv.docs || []).length ? ' and supporting documents' : '') + ' attached. I am available for an interview at your convenience' +
      (contact ? ' and can be contacted ' + contact : '') + '. Thank you for considering my application.';
    return [p1, p2, p3, p4].filter(function (x) { return x && x.trim(); });
  }
  function paras(cv) {
    var L = get(cv);
    return L.edited && L.paras ? L.paras.filter(function (x) { return String(x || '').trim(); }) : draft(cv);
  }
  function salutation(L) { return L.recipient ? 'Dear ' + noDot(L.recipient) + ',' : 'Dear Sir/Madam,'; }
  function closing(L) { return L.recipient ? 'Yours sincerely,' : 'Yours faithfully,'; }
  function reLine(L) {
    return 'RE: APPLICATION FOR THE POSITION OF ' + (noDot(L.position) || 'THE ADVERTISED POSITION').toUpperCase() + (L.ref ? ' (REF: ' + noDot(L.ref).toUpperCase() + ')' : '');
  }
  function enclosures(cv) {
    var list = ['Curriculum vitae'];
    (cv.docs || []).forEach(function (d) { if (d.type && list.indexOf(d.type) < 0) list.push(d.type); });
    return list;
  }
  function todayLong() { return TP.todayText(); }

  /* ---------- A4 page ---------- */
  function render(cv) {
    var base = TP.get(cv.templateId), t = TP.effective(base, cv), L = get(cv), m = TP.model(cv);
    var classic = t.family === 'classic', k = t.k || 1;
    var lt = { id: 'letter', family: 'letter', fonts: classic ? { name: 'carlito', head: 'pagella', body: 'pagella' } : t.fonts,
      c: t.c, k: k, page: { mt: 70, mb: 70 }, decor: function () { return []; } };
    var contacts = m.contacts.map(function (x) { return x.t; });
    var h = '<div class="col">';
    if (classic) {
      h += '<div class="blk lt-hd lt-classic"><div class="lt-nm">' + esc((TP.displayName(cv) || 'Your Name').toUpperCase()) + '</div>' +
        '<div class="lt-ct">' + contacts.map(esc).join('<span class="lt-sep">|</span>') + '</div></div>';
    } else {
      h += '<div class="blk lt-hd"><div class="lt-nm">' + esc(m.name) + '</div>' + (m.headline ? '<div class="lt-ttl">' + esc(m.headline) + '</div>' : '') +
        '<div class="lt-ct">' + contacts.map(esc).join('<span class="lt-sep">•</span>') + '</div></div>';
    }
    h += '<div class="blk lt-date">' + esc(todayLong()) + '</div>';
    var to = [L.recipient, L.recipientTitle, L.company].filter(Boolean).concat(D.lines(L.address));
    if (to.length) h += '<div class="blk lt-to">' + to.map(function (x) { return '<div>' + esc(x) + '</div>'; }).join('') + '</div>';
    h += '<div class="blk lt-sal">' + esc(salutation(L)) + '</div>';
    h += '<div class="blk lt-re">' + esc(reLine(L)) + '</div>';
    paras(cv).forEach(function (x) { h += '<div class="blk lt-p">' + esc(x) + '</div>'; });
    h += '<div class="blk lt-close">' + esc(closing(L)) + '</div>';
    h += '<div class="blk lt-sign">' + (cv.signature ? '<img class="lt-sig" src="' + cv.signature + '" alt="">' : '<div class="lt-sig-gap"></div>') +
      '<div class="lt-sn">' + esc(D.fullName(cv) || m.name) + '</div></div>';
    h += '<div class="blk lt-enc"><b>Enclosures:</b> ' + esc(enclosures(cv).join('; ')) + '</div>';
    h += '</div>';
    var style = TP.styleVars(Object.assign({}, t, { k: k }));
    return { cls: 'cv f-letter' + (classic ? ' lt-is-classic' : ''), style: style, html: h, tpl: lt };
  }

  window.CVLetter = { get: get, blank: blank, draft: draft, paras: paras, salutation: salutation, closing: closing, reLine: reLine,
    enclosures: enclosures, render: render, today: todayLong };
})();
