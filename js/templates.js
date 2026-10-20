/* CV templates: definitions, data -> view model, HTML rendering, page decoration */
(function () {
  'use strict';
  var D = window.CVData;
  var PW = 794, PH = 1123; // A4 at 96 css px per inch

  /* ---------- template catalogue ---------- */
  // fonts: keys from fonts.css (F-<key>). docx: Office font names used in the Word file.
  var T = [
    { id: 'classic', name: 'Classic SA', family: 'classic', tags: ['classic', 'ats'],
      desc: 'Traditional South African CV with bordered page and boxed headings',
      fonts: { name: 'carlito', head: 'pagella', body: 'pagella' }, docx: { name: 'Calibri', head: 'Book Antiqua', body: 'Book Antiqua' },
      c: { accent: '#000000', ink: '#000000' }, page: { mt: 96, mb: 80 } },
    { id: 'classic-shade', name: 'Classic SA Shaded', family: 'classic', tags: ['classic', 'ats'], shade: true,
      desc: 'Classic layout with grey-shaded section boxes',
      fonts: { name: 'carlito', head: 'pagella', body: 'pagella' }, docx: { name: 'Calibri', head: 'Book Antiqua', body: 'Book Antiqua' },
      c: { accent: '#000000', ink: '#000000', shade: '#D9D9D9' }, page: { mt: 96, mb: 80 } },

    { id: 'navy', name: 'Navy Executive', family: 'sidebar', side: 'left', hs: 'rule', tags: ['modern', 'photo'],
      fonts: { name: 'montserrat', head: 'montserrat', body: 'opensans' }, nameW: 700, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#1F3A5F', accent2: '#3D6A9E', ink: '#1E2530', muted: '#5F6B7A', line: '#D5DCE5', sideBg: '#1F3A5F', sideInk: '#FFFFFF', sideMuted: '#B7C6D9', sideAccent: '#8FB8E6', sideLine: '#3F5C82' } },
    { id: 'teal', name: 'Teal Fresh', family: 'sidebar', side: 'left', hs: 'bar', tags: ['modern', 'photo'],
      fonts: { name: 'poppins', head: 'poppins', body: 'lato' }, nameW: 600, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#0F766E', accent2: '#0F766E', ink: '#1C2B2A', muted: '#5D6E6C', line: '#D2E3E1', sideBg: '#0F766E', sideInk: '#FFFFFF', sideMuted: '#BFE0DC', sideAccent: '#9FE3DA', sideLine: '#3B918A' } },
    { id: 'charcoal', name: 'Charcoal & Gold', family: 'sidebar', side: 'right', hs: 'short', tags: ['modern', 'photo'],
      fonts: { name: 'raleway', head: 'raleway', body: 'lato' }, nameW: 300, nameUpper: true, nameLs: 3, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#B8892B', accent2: '#8C6A22', ink: '#222326', muted: '#6A6B70', line: '#E3DCCB', sideBg: '#2B2D31', sideInk: '#F3F1EC', sideMuted: '#A9A7A2', sideAccent: '#D4A537', sideLine: '#4A4C52' } },
    { id: 'royal', name: 'Royal Blue', family: 'sidebar', side: 'left', hs: 'dot', photoShape: 'rounded', tags: ['modern', 'photo'],
      fonts: { name: 'nunito', head: 'nunito', body: 'nunito' }, nameW: 700, docx: { name: 'Calibri', head: 'Calibri', body: 'Calibri' },
      c: { accent: '#283593', accent2: '#3949AB', ink: '#1F2333', muted: '#5D6275', line: '#D9DCF0', sideBg: '#283593', sideInk: '#FFFFFF', sideMuted: '#C2C8EE', sideAccent: '#FFD54F', sideLine: '#4652A8' } },
    { id: 'sunset', name: 'Sunset Light', family: 'sidebar', side: 'left', hs: 'rule', tags: ['modern', 'photo'],
      fonts: { name: 'dmsans', head: 'dmsans', body: 'dmsans' }, nameW: 700, docx: { name: 'Calibri', head: 'Calibri', body: 'Calibri' },
      c: { accent: '#D9480F', accent2: '#B23A0B', ink: '#2E211A', muted: '#7A6558', line: '#F1DDD0', sideBg: '#FFF1E6', sideInk: '#3D2A1E', sideMuted: '#8A6F5E', sideAccent: '#D9480F', sideLine: '#EBCDB8' } },
    { id: 'mint', name: 'Mint Clean', family: 'sidebar', side: 'right', hs: 'bar', tags: ['modern', 'photo'],
      fonts: { name: 'sourcesans', head: 'sourcesans', body: 'sourcesans' }, nameW: 700, docx: { name: 'Calibri', head: 'Calibri', body: 'Calibri' },
      c: { accent: '#1B7F5B', accent2: '#1B7F5B', ink: '#18261F', muted: '#5C6E65', line: '#D4E8DE', sideBg: '#E8F5EF', sideInk: '#183A2E', sideMuted: '#5E7C6F', sideAccent: '#1B7F5B', sideLine: '#C6E2D4' } },

    { id: 'ocean', name: 'Ocean Banner', family: 'banner', hs: 'rule', tags: ['modern', 'photo'],
      fonts: { name: 'lato', head: 'lato', body: 'lato' }, nameW: 700, docx: { name: 'Calibri', head: 'Calibri', body: 'Calibri' },
      c: { accent: '#1565C0', accent2: '#1565C0', ink: '#1B2430', muted: '#5E6A78', line: '#D6E2F2', banner: '#1565C0', bannerInk: '#FFFFFF', bannerSub: '#CFE2FA', tint: '#EAF2FC' } },
    { id: 'maroon', name: 'Maroon Classic', family: 'banner', hs: 'short', tags: ['modern', 'photo'],
      fonts: { name: 'merriweather', head: 'merriweather', body: 'lato' }, nameW: 700, docx: { name: 'Georgia', head: 'Georgia', body: 'Calibri' },
      c: { accent: '#7A1F2B', accent2: '#7A1F2B', ink: '#2A1D1F', muted: '#6F5F61', line: '#EBDADC', banner: '#7A1F2B', bannerInk: '#FFFFFF', bannerSub: '#F0CDD2', tint: '#F8EEEF' } },
    { id: 'emerald', name: 'Emerald', family: 'banner', hs: 'fill', tags: ['modern', 'photo'],
      fonts: { name: 'raleway', head: 'raleway', body: 'opensans' }, nameW: 700, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#0B6E4F', accent2: '#0B6E4F', ink: '#1A2622', muted: '#5B6B65', line: '#D3E6DF', banner: '#0B6E4F', bannerInk: '#FFFFFF', bannerSub: '#C3E6D9', tint: '#E8F4EF' } },
    { id: 'mzansi', name: 'Mzansi Pride', family: 'banner', hs: 'bar', stripe: true, tags: ['modern', 'photo'],
      desc: 'Dark banner with a South African flag-colour stripe',
      fonts: { name: 'montserrat', head: 'montserrat', body: 'opensans' }, nameW: 700, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#007A4D', accent2: '#007A4D', ink: '#1C1F1E', muted: '#5D6461', line: '#DDE3E0', banner: '#1D1F1E', bannerInk: '#FFFFFF', bannerSub: '#FFB612', tint: '#E9F4EF' } },
    { id: 'bold', name: 'Bold Black', family: 'banner', hs: 'bar', tags: ['modern', 'photo'],
      fonts: { name: 'oswald', head: 'oswald', body: 'roboto' }, nameW: 600, nameUpper: true, nameLs: 2, headUpper: true, docx: { name: 'Arial Narrow', head: 'Arial Narrow', body: 'Arial' },
      c: { accent: '#E0A400', accent2: '#111111', ink: '#151515', muted: '#5C5C5C', line: '#E6E6E6', banner: '#111111', bannerInk: '#FFFFFF', bannerSub: '#F2B705', tint: '#FFF6D9' } },

    { id: 'minimal', name: 'Minimal Grey', family: 'leftcol', tags: ['modern', 'ats'],
      fonts: { name: 'lato', head: 'lato', body: 'lato' }, nameW: 300, docx: { name: 'Calibri Light', head: 'Calibri', body: 'Calibri' },
      c: { accent: '#3A3A3A', accent2: '#3A3A3A', ink: '#222222', muted: '#6E6E6E', line: '#DADADA' } },
    { id: 'swiss', name: 'Swiss Red', family: 'leftcol', edge: true, tags: ['modern', 'ats'],
      fonts: { name: 'roboto', head: 'roboto', body: 'roboto' }, nameW: 700, docx: { name: 'Arial', head: 'Arial', body: 'Arial' },
      c: { accent: '#D62828', accent2: '#D62828', ink: '#1D1D1D', muted: '#666666', line: '#E3E3E3' } },

    { id: 'elegant', name: 'Elegant Serif', family: 'centered', align: 'center', hs: 'lines', tags: ['modern'],
      fonts: { name: 'playfair', head: 'playfair', body: 'lato' }, nameW: 700, docx: { name: 'Georgia', head: 'Georgia', body: 'Calibri' },
      c: { accent: '#9C7A34', accent2: '#9C7A34', ink: '#222222', muted: '#6B6B6B', line: '#D9CBA9' } },
    { id: 'garamond', name: 'Garamond Navy', family: 'centered', align: 'center', hs: 'lines', frame: true, nameUpper: true, nameLs: 3, tags: ['modern', 'ats'],
      fonts: { name: 'garamond', head: 'garamond', body: 'garamond' }, nameW: 400, bodySize: 14, docx: { name: 'Garamond', head: 'Garamond', body: 'Garamond' },
      c: { accent: '#1F3A5F', accent2: '#1F3A5F', ink: '#1A1A1A', muted: '#5C6470', line: '#AEB9C8' } },
    { id: 'ats', name: 'ATS Simple', family: 'centered', align: 'left', hs: 'rule', tags: ['modern', 'ats'],
      desc: 'Plain single column that job-portal systems read easily',
      fonts: { name: 'carlito', head: 'carlito', body: 'carlito' }, nameW: 700, bodySize: 14, docx: { name: 'Calibri', head: 'Calibri', body: 'Calibri' },
      c: { accent: '#000000', accent2: '#000000', ink: '#000000', muted: '#444444', line: '#000000' } },

    { id: 'timeline', name: 'Timeline Blue', family: 'timeline', hs: 'rule', photoShape: 'rounded', tags: ['modern', 'photo'],
      fonts: { name: 'montserrat', head: 'montserrat', body: 'opensans' }, nameW: 700, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#2563EB', accent2: '#1D4ED8', ink: '#1A2233', muted: '#5D6779', line: '#D6E0F5', tint: '#EEF3FD' } },
    { id: 'coral', name: 'Coral Timeline', family: 'timeline', hs: 'dot', tags: ['modern', 'photo'],
      fonts: { name: 'poppins', head: 'poppins', body: 'nunito' }, nameW: 600, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#E76F51', accent2: '#C4553A', ink: '#2B2220', muted: '#6E625F', line: '#F3D8D0', tint: '#FDF1EC' } },

    { id: 'purple', name: 'Purple Split', family: 'split', hs: 'rule', tags: ['modern'],
      fonts: { name: 'montserrat', head: 'montserrat', body: 'opensans' }, nameW: 700, docx: { name: 'Century Gothic', head: 'Century Gothic', body: 'Calibri' },
      c: { accent: '#5B2A86', accent2: '#5B2A86', ink: '#221B29', muted: '#665D6E', line: '#E3D9EC', tint: '#F4EFF9' } },
    { id: 'slate', name: 'Slate Split', family: 'split', hs: 'short', tags: ['modern'],
      fonts: { name: 'dmsans', head: 'dmsans', body: 'dmsans' }, nameW: 700, docx: { name: 'Calibri', head: 'Calibri', body: 'Calibri' },
      c: { accent: '#0E8C8A', accent2: '#334155', ink: '#1E2733', muted: '#5F6B7B', line: '#DCE3EA', tint: '#F1F5F9' } }
  ];
  var BY_ID = {};
  T.forEach(function (t) {
    t.page = t.page || { mt: 48, mb: 48 };
    t.c = Object.assign({ accent2: t.c.accent, muted: '#555555', line: '#DDDDDD', tint: '#F4F4F4' }, t.c);
    BY_ID[t.id] = t;
  });
  function get(id) { return BY_ID[id] || BY_ID.classic; }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var ICONS = {
    phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    mail: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'
  };
  function icon(k) {
    return '<svg class="ic" viewBox="0 0 24 24"><path d="' + ICONS[k] + '"/></svg>';
  }
  function fmtID(s) {
    s = String(s || '').replace(/\s+/g, '');
    return /^\d{13}$/.test(s) ? s.slice(0, 6) + ' ' + s.slice(6, 10) + ' ' + s.slice(10) : s;
  }
  function initials(name) {
    return name.split(/\s+/).filter(Boolean).map(function (w) { return w.charAt(0).toUpperCase(); }).slice(0, 1)
      .concat(name.split(/\s+/).filter(Boolean).slice(-1).map(function (w) { return w.charAt(0).toUpperCase(); })).join('');
  }

  // name shown at the top: the user's choice, else first name + surname (as on traditional SA CVs)
  function displayName(cv) {
    var p = cv.personal || {};
    if ((p.displayName || '').trim()) return p.displayName.trim();
    var first = (p.firstNames || '').trim().split(/\s+/)[0] || '';
    return [first, (p.surname || '').trim()].filter(Boolean).join(' ');
  }

  /* ---------- view model ---------- */
  function model(cv) {
    var p = cv.personal || {}, c = cv.contact || {}, s = cv.school || {};
    var m = {};
    m.name = displayName(cv) || 'Your Name';
    m.headline = (p.headline || '').trim();
    m.photo = cv.showPhoto !== false && cv.photo ? cv.photo : '';
    m.contacts = [];
    if (c.phone) m.contacts.push({ i: 'phone', k: 'Phone', t: c.phone });
    if (c.altPhone) m.contacts.push({ i: 'phone', k: 'Alternative', t: c.altPhone });
    if (c.email) m.contacts.push({ i: 'mail', k: 'Email', t: c.email });
    var addr = D.lines(c.address);
    if (addr.length) m.contacts.push({ i: 'pin', k: 'Address', t: addr.join(', ') });
    if (c.linkedin) m.contacts.push({ i: 'link', k: 'LinkedIn', t: c.linkedin });
    m.personal = [];
    function kv(k, v) { if (v && String(v).trim()) m.personal.push([k, String(v).trim()]); }
    kv('Date of Birth', D.fmtDate(p.dob)); kv('ID Number', fmtID(p.idNumber)); kv('Gender', p.gender);
    kv('Nationality', p.nationality); kv('Race', p.race); kv('Marital Status', p.maritalStatus);
    kv("Driver's Licence", p.licence); kv('Health', p.healthStatus); kv('Criminal Record', p.criminalRecord); kv('Disability', p.disability);
    m.profile = (cv.profile || '').trim();
    m.work = (cv.work || []).filter(function (w) { return w.company || w.position; }).map(function (w) {
      return { title: w.position || w.company, org: w.position ? w.company : '', period: D.workPeriod(w) || w.duration || '',
        bullets: D.lines(w.duties), extra: w.reason ? 'Reason for leaving: ' + w.reason : '' };
    });
    m.edu = [];
    (cv.tertiary || []).forEach(function (t) {
      if (!t.institution && !t.qualification) return;
      var per = [t.year, t.status && t.status !== 'Completed' ? t.status : ''].filter(Boolean).join(' • ');
      m.edu.push({ title: t.qualification || t.institution, org: t.qualification ? t.institution : '', period: per, bullets: [], note: '' });
    });
    var subj = D.lines(s.subjects);
    if (s.name || s.grade) {
      m.edu.push({ title: s.grade || 'Secondary School', org: s.name || '', period: s.year || '', bullets: [],
        note: subj.length ? 'Subjects: ' + subj.join(', ') : '' });
    }
    m.courses = (cv.courses || []).filter(function (x) { return x.name; }).map(function (x) {
      return { title: x.name, org: x.provider || '', period: x.year || '', bullets: [], note: '' };
    });
    m.skills = D.lines(cv.skills); m.attributes = D.lines(cv.attributes); m.hobbies = D.lines(cv.hobbies);
    m.languages = D.languagesList(cv);
    m.references = (cv.references || []).filter(function (r) { return r.name; });
    m.refsOnRequest = !!cv.refsOnRequest && !m.references.length;
    m.declaration = !!cv.declaration;
    m.annexures = D.annexures(cv);
    var hid = function (k) { return D.isHidden(cv, k); };
    if (hid('profile')) m.profile = '';
    if (hid('personal')) m.personal = [];
    if (hid('work')) m.work = [];
    if (hid('education')) m.edu = [];
    if (hid('courses')) m.courses = [];
    if (hid('skills')) { m.skills = []; m.attributes = []; }
    if (hid('languages')) m.languages = [];
    if (hid('hobbies')) m.hobbies = [];
    if (hid('references')) { m.references = []; m.refsOnRequest = false; }
    if (hid('annexures')) m.annexures = [];
    if (hid('declaration')) m.declaration = false;
    m.order = D.sectionOrder(cv, 'modern');
    m.signature = cv.signature || '';
    return m;
  }

  /* ---------- generic items ---------- */
  // item: {c: class, h: inner html, k: keep-with-next}
  function it(c, h, k) { return { c: c, h: h, k: !!k }; }
  function wrapStd(items) {
    return items.map(function (x) { return '<div class="blk ' + x.c + (x.k ? ' kwn' : '') + '">' + x.h + '</div>'; }).join('');
  }
  function H(title) {
    return '<div class="blk kwn h"><span class="h-l"></span><span class="h-mark"></span><span class="h-t">' + esc(title) +
      '</span><span class="h-r"></span></div>';
  }
  function entryItems(e) {
    var head = '<div class="ent-top"><div class="ent-t">' + esc(e.title) + '</div>' +
      (e.period ? '<div class="ent-dt">' + esc(e.period) + '</div>' : '') + '</div>' +
      (e.org ? '<div class="ent-s">' + esc(e.org) + '</div>' : '') +
      (e.note ? '<div class="ent-n">' + esc(e.note) + '</div>' : '');
    var more = e.bullets.length || e.extra;
    var out = [it('ent', head, more)];
    e.bullets.forEach(function (b) { out.push(it('bul', '<span class="b">•</span><span class="bt">' + esc(b) + '</span>')); });
    if (e.extra) out.push(it('ent-x', esc(e.extra)));
    return out;
  }
  function kvRows(pairs, cols) {
    var out = [];
    for (var i = 0; i < pairs.length; i += cols) {
      var row = '';
      for (var j = 0; j < cols; j++) {
        var p = pairs[i + j];
        row += p ? '<div class="kv"><span class="k">' + esc(p[0]) + '</span><span class="v">' + esc(p[1]) + '</span></div>' : '<div class="kv"></div>';
      }
      out.push(it('kvrow', row));
    }
    return out;
  }
  function chipsItem(list) {
    return it('chips', list.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join(''));
  }
  function langChips(langs) {
    return chipsItem(langs.map(function (l) { return l.name + (l.note ? ' (' + l.note + ')' : ''); }));
  }
  function refCard(r) {
    var role = [r.relationship, r.company].filter(Boolean).join(', ');
    return '<div class="ref"><div class="ref-n">' + esc(r.name) + '</div>' + (role ? '<div class="ref-r">' + esc(role) + '</div>' : '') +
      (r.phone ? '<div class="ref-c">' + esc(r.phone) + '</div>' : '') + (r.email ? '<div class="ref-c">' + esc(r.email) + '</div>' : '') + '</div>';
  }
  function refItems(m, cols) {
    if (m.refsOnRequest) return [it('p', 'Available on request.')];
    var out = [];
    for (var i = 0; i < m.references.length; i += cols) {
      var row = '';
      for (var j = 0; j < cols; j++) row += m.references[i + j] ? refCard(m.references[i + j]) : '<div class="ref"></div>';
      out.push(it('refrow', row));
    }
    return out;
  }
  function todayText() { var d = new Date(); return D.fmtDate(d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)); }
  function sigImg(cv) { return cv && cv.signature ? '<img class="sig-img" src="' + cv.signature + '" alt="">' : ''; }
  function declItem(m) {
    return it('decl', '<div class="p">I, ' + esc(m.name) + ', declare that the information in this CV is true and correct to the best of my knowledge.</div>' +
      '<div class="sig"><span class="sig-k">Signature</span><span class="sig-l">' + (m.signature ? '<img class="sig-img" src="' + m.signature + '" alt="">' : '') + '</span>' +
      '<span class="sig-k">Date</span><span class="sig-l sig-d">' + (m.signature ? esc(todayText()) : '') + '</span></div>');
  }
  function bulletItems(list) {
    return list.map(function (b) { return it('bul', '<span class="b">•</span><span class="bt">' + esc(b) + '</span>'); });
  }
  function twoColBullets(list) {
    var out = [];
    for (var i = 0; i < list.length; i += 2) {
      out.push(it('bul2', '<div class="bul"><span class="b">•</span><span class="bt">' + esc(list[i]) + '</span></div>' +
        (list[i + 1] ? '<div class="bul"><span class="b">•</span><span class="bt">' + esc(list[i + 1]) + '</span></div>' : '<div class="bul"></div>')));
    }
    return out;
  }

  // the list of main sections for single-column layouts
  // opts: {personal: bool, skills: 'chips'|'bullets', side: bool (skip side-only sections)}
  function mainSections(m, o) {
    var S = [];
    if (m.profile) S.push({ key: 'profile', t: 'Profile', items: [it('p', esc(m.profile))] });
    if (o.personal && m.personal.length) S.push({ key: 'personal', t: 'Personal Details', items: kvRows(m.personal, o.kvCols || 2) });
    if (m.work.length) S.push({ key: 'work', t: 'Work Experience', items: [].concat.apply([], m.work.map(entryItems)), entries: m.work });
    if (m.edu.length) S.push({ key: 'education', t: 'Education', items: [].concat.apply([], m.edu.map(entryItems)), entries: m.edu });
    if (m.courses.length) S.push({ key: 'courses', t: 'Courses & Certificates', items: [].concat.apply([], m.courses.map(entryItems)), entries: m.courses });
    if (o.skills) {
      if (m.skills.length) S.push({ key: 'skills', t: 'Skills', items: o.skills === 'chips' ? [chipsItem(m.skills)] : twoColBullets(m.skills) });
      if (m.attributes.length) S.push({ key: 'skills', t: 'Personal Attributes', items: o.skills === 'chips' ? [chipsItem(m.attributes)] : twoColBullets(m.attributes) });
      if (m.languages.length && !o.noLang) S.push({ key: 'languages', t: 'Languages', items: [o.langText ? it('p', esc(m.languages.map(function (l) { return l.name + (l.note ? ' (' + l.note + ')' : ''); }).join(', '))) : langChips(m.languages)] });
      if (m.hobbies.length) S.push({ key: 'hobbies', t: 'Hobbies & Interests', items: [it('p', esc(m.hobbies.join(', ')))] });
    }
    if (m.references.length || m.refsOnRequest) S.push({ key: 'references', t: 'References', items: refItems(m, o.refCols || 2) });
    if (m.annexures.length) S.push({ key: 'annexures', t: 'Supporting Documents', items: m.annexures.map(function (a) {
      return it('bul', '<span class="b">\u2022</span><span class="bt"><b>' + esc(a.key) + ':</b> ' + esc(a.type) + '</span>');
    }) });
    if (m.declaration) S.push({ key: 'declaration', t: 'Declaration', items: [declItem(m)] });
    return m.order ? D.orderBy(S, m.order) : S;
  }
  function stdSections(S) {
    return S.map(function (s) { return H(s.t) + wrapStd(s.items); }).join('');
  }

  // sidebar column pieces (each a block)
  function sideBlocks(m, o) {
    o = o || {};
    var h = '';
    function SH(t) { return '<div class="blk kwn sh"><span class="sh-t">' + esc(t) + '</span></div>'; }
    if (m.contacts.length) {
      h += SH('Contact');
      m.contacts.forEach(function (c) { h += '<div class="blk si">' + icon(c.i) + '<span class="st">' + esc(c.t) + '</span></div>'; });
    }
    if (m.personal.length) {
      h += SH('Personal Details');
      m.personal.forEach(function (p) { h += '<div class="blk skv"><div class="sk">' + esc(p[0]) + '</div><div class="sv">' + esc(p[1]) + '</div></div>'; });
    }
    if (m.languages.length) {
      h += SH('Languages');
      m.languages.forEach(function (l) { h += '<div class="blk sl"><span class="sln">' + esc(l.name) + '</span>' + (l.note ? '<span class="slx">' + esc(l.note) + '</span>' : '') + '</div>'; });
    }
    [['Skills', m.skills], ['Attributes', m.attributes], ['Hobbies', m.hobbies]].forEach(function (g) {
      if (!g[1].length || o.lite) return;
      h += SH(g[0]);
      g[1].forEach(function (x) { h += '<div class="blk sb"><span class="b">•</span><span class="bt">' + esc(x) + '</span></div>'; });
    });
    return h;
  }

  function photoHTML(m, t, cls) {
    if (!m.photo) return '';
    return '<img class="photo ' + (cls || '') + ' ps-' + (t.photoShape || 'circle') + '" src="' + m.photo + '" alt="">';
  }
  function nameBlock(m, cls) {
    return '<div class="nm">' + esc(m.name) + '</div>' + (m.headline ? '<div class="ttl">' + esc(m.headline) + '</div>' : '');
  }
  function contactLine(m, sep) {
    return m.contacts.map(function (c) { return '<span class="ci">' + icon(c.i) + '<span class="ct">' + esc(c.t) + '</span></span>'; })
      .join(sep ? '<span class="sep">' + sep + '</span>' : '');
  }

  /* ---------- family renderers ---------- */
  function classic(cv, t) {
    var p = cv.personal || {}, c = cv.contact || {}, s = cv.school || {};
    var h = '';
    function head(title) { return '<div class="blk kwn c-h"><span class="u">' + esc(title) + '</span></div>'; }
    function row(label, value, gap) {
      return '<div class="blk c-row' + (gap ? ' c-gap' : '') + '"><div class="c-l">' + esc(label) + '</div><div class="c-v">: ' + esc(value) + '</div></div>';
    }
    function rows(label, value, gap) {
      var ls = Array.isArray(value) ? value : D.lines(value);
      if (!ls.length) return '';
      return ls.map(function (v, i) { return row(i ? '' : label, v, gap && !i); }).join('');
    }
    function group(pairs, gap) { // pairs: [label, value]; first visible gets gap
      var out = '', first = true;
      pairs.forEach(function (pv) {
        var r = rows(pv[0], pv[1], gap && first);
        if (r) { out += r; first = false; }
      });
      return out;
    }
    h += '<div class="blk c-title"><div class="c-cv"><span class="u">CURRICULUM VITAE</span></div><div class="c-of"><span class="u">OF</span></div>' +
      '<div class="c-name">' + esc((displayName(cv) || 'YOUR NAME').toUpperCase()) + '</div></div>';
    var con = group([['Contact Number', c.phone], ['Alternative Number', c.altPhone], ['Email Address', c.email],
      ['Physical Address', D.lines(c.address).map(function (x) { return x.toUpperCase(); })], ['Postal Address', c.postal], ['LinkedIn', c.linkedin]]);
    if (con) h += head('CONTACT DETAILS') + con;
    var hid = function (k) { return D.isHidden(cv, k); }, secs = [];
    function add(key, html) { if (html && !hid(key)) secs.push({ key: key, html: html }); }
    var noLang = hid('languages');
    var per = group([['Surname', p.surname], ['First Name(s)', p.firstNames], ['Date of Birth', D.fmtDate(p.dob)], ['Identity Number', fmtID(p.idNumber)],
      ['Race', p.race], ['Gender', p.gender], ['Nationality', p.nationality], ['Marital Status', p.maritalStatus], ['Health Status', p.healthStatus],
      ['Home Language', noLang ? '' : p.homeLanguage], ['Alternative Languages', noLang ? '' : p.otherLanguages], ['Criminal Record', p.criminalRecord],
      ["Driver's Licence", p.licence], ['Disability', p.disability]]);
    if (per) add('personal', head('PERSONAL DETAILS') + per);
    if ((cv.profile || '').trim()) add('profile', head('CAREER OBJECTIVE') + '<div class="blk c-p">' + esc(cv.profile.trim()) + '</div>');
    var eh = '';
    var edu = group([['School Attended', s.name], ['Highest Grade Passed', s.grade], ['Subjects Passed', s.subjects], ['Year Obtained', s.year]]);
    if (edu) eh += head('EDUCATIONAL HISTORY') + edu;
    var ter = (cv.tertiary || []).filter(function (x) { return x.institution || x.qualification; });
    if (ter.length) {
      eh += head('TERTIARY EDUCATION');
      ter.forEach(function (x, i) {
        eh += group([['Institution', x.institution], ['Qualification', x.qualification], ['Year Obtained', x.year], ['Status', x.status]], i > 0);
      });
    }
    add('education', eh);
    var crs = (cv.courses || []).filter(function (x) { return x.name; });
    if (crs.length) add('courses', head('SHORT COURSES & CERTIFICATES') + crs.map(function (x, i) { return group([['Course', x.name], ['Institution', x.provider], ['Year', x.year]], i > 0); }).join(''));
    var wk = (cv.work || []).filter(function (w) { return w.company || w.position; });
    if (wk.length) add('work', head('WORK EXPERIENCE') + wk.map(function (w, i) {
      return group([['Company Name', w.company], ['Occupation', w.position], ['Duration', D.workPeriodLong(w)],
        ['Duties', w.duties], ['Reason for Leaving', w.reason]], i > 0);
    }).join(''));
    var sk = group([['Skills', cv.skills], ['Personal Attributes', cv.attributes]]);
    if (sk) add('skills', head('SKILLS & ATTRIBUTES') + sk);
    var hb = rows('Hobbies', cv.hobbies);
    if (hb) add('hobbies', head('HOBBIES & INTERESTS') + hb);
    var refs = (cv.references || []).filter(function (r) { return r.name; });
    if (refs.length) {
      add('references', head('REFERENCES') + refs.map(function (r, i) {
        return group([['Contact Person', r.name], ['Relationship', r.relationship], ['Company', r.company], ['Contact Number', r.phone], ['Email Address', r.email]], i > 0);
      }).join(''));
    } else if (cv.refsOnRequest) {
      add('references', head('REFERENCES') + '<div class="blk c-p">Available on request.</div>');
    }
    var anx = D.annexures(cv);
    if (anx.length) add('annexures', head('SUPPORTING DOCUMENTS') + anx.map(function (a) { return row(a.key, a.type); }).join(''));
    if (cv.declaration) {
      add('declaration', head('DECLARATION') + '<div class="blk c-p">I, ' + esc(D.fullName(cv)) + ', hereby declare that the information contained in this CV is true and correct to the best of my knowledge.</div>' +
        '<div class="blk c-sig"><span>Signature: </span><span class="c-sl">' + sigImg(cv) + '</span><span>Date: </span><span class="c-sl c-sd">' + (cv.signature ? esc(todayText()) : '') + '</span></div>');
    }
    D.orderBy(secs, D.sectionOrder(cv, 'classic')).forEach(function (x) { h += x.html; });
    return '<div class="col">' + h + '</div>';
  }

  function sidebar(cv, t, m, o) {
    var side = '';
    side += '<div class="blk ph">' + (m.photo ? photoHTML(m, t) : '<div class="mono"><span>' + esc(initials(m.name)) + '</span></div>') + '</div>';
    side += sideBlocks(m, { lite: o.lite });
    var S = mainSections(m, { personal: false, skills: o.lite ? 'bullets' : false, noLang: true });
    var main = '<div class="blk hdr">' + nameBlock(m) + '</div>' + stdSections(S);
    return '<div class="wrap"><div class="col side">' + side + '</div><div class="col main">' + main + '</div></div>';
  }

  function banner(cv, t, m) {
    var top = '<div class="blk topw"><div class="top">' + (m.photo ? photoHTML(m, t) : '') +
      '<div class="top-t">' + nameBlock(m) + (m.contacts.length ? '<div class="cts">' + contactLine(m) + '</div>' : '') + '</div></div>' +
      (t.stripe ? '<div class="stripe"><i class="s1"></i><i class="s2"></i><i class="s3"></i><i class="s4"></i><i class="s5"></i></div>' : '') + '</div>';
    var S = mainSections(m, { personal: true, skills: 'chips' });
    return '<div class="col">' + top + '<div class="body">' + stdSections(S) + '</div></div>';
  }

  function leftcol(cv, t, m) {
    var hd = '<div class="blk hd">' + nameBlock(m) + (m.contacts.length ? '<div class="cts">' + contactLine(m) + '</div>' : '') + '</div>';
    var S = mainSections(m, { personal: true, skills: 'bullets', kvCols: 2 });
    var body = S.map(function (s) {
      return s.items.map(function (x, i) {
        return '<div class="blk lr' + (i === 0 ? ' first' : '') + (x.k ? ' kwn' : '') + '"><div class="lh">' + (i === 0 ? esc(s.t) : '') +
          '</div><div class="lc ' + x.c + '">' + x.h + '</div></div>';
      }).join('');
    }).join('');
    return '<div class="col">' + hd + '<div class="body">' + body + '</div></div>';
  }

  function centered(cv, t, m) {
    var hd = '<div class="blk hd">' + nameBlock(m) + (m.contacts.length ? '<div class="cts">' + contactLine(m, t.align === 'left' ? '|' : '•') + '</div>' : '') + '</div>';
    var S = mainSections(m, { personal: true, skills: 'bullets', langText: t.align === 'left' });
    return '<div class="col">' + hd + '<div class="body">' + stdSections(S) + '</div></div>';
  }

  function timeline(cv, t, m) {
    var hd = '<div class="blk hd"><div class="hd-t">' + nameBlock(m) +
      (m.contacts.length ? '<div class="cts">' + contactLine(m) + '</div>' : '') + '</div>' + (m.photo ? photoHTML(m, t) : '') + '</div>';
    var S = mainSections(m, { personal: true, skills: 'chips' });
    var body = S.map(function (s) {
      if (!s.entries) return H(s.t) + wrapStd(s.items);
      var h = H(s.t);
      s.entries.forEach(function (e) {
        var rows = [];
        rows.push({ d: e.period, h: '<span class="tl-dot"></span><div class="ent-t">' + esc(e.title) + '</div>' + (e.org ? '<div class="ent-s">' + esc(e.org) + '</div>' : '') +
          (e.note ? '<div class="ent-n">' + esc(e.note) + '</div>' : '') });
        e.bullets.forEach(function (b) { rows.push({ d: '', h: '<div class="bul"><span class="b">•</span><span class="bt">' + esc(b) + '</span></div>' }); });
        if (e.extra) rows.push({ d: '', h: '<div class="ent-x">' + esc(e.extra) + '</div>' });
        rows.forEach(function (r, i) {
          var last = i === rows.length - 1;
          h += '<div class="blk tl' + (last ? ' tl-end' : '') + (i === 0 && rows.length > 1 ? ' kwn' : '') + '"><div class="tl-d">' + esc(r.d) + '</div><div class="tl-c">' + r.h + '</div></div>';
        });
      });
      return h;
    }).join('');
    return '<div class="col">' + hd + '<div class="body">' + body + '</div></div>';
  }

  function split(cv, t, m, o) {
    var hd = '<div class="hdw"><div class="hd"><div class="hd-t">' + nameBlock(m) + '</div>' +
      (m.contacts.length ? '<div class="cts">' + m.contacts.map(function (c) {
        return '<div class="ci"><span class="ct">' + esc(c.t) + '</span>' + icon(c.i) + '</div>';
      }).join('') + '</div>' : '') + '</div></div>';
    var S = mainSections(m, { personal: false, skills: o.lite ? 'bullets' : false, noLang: true, refCols: 1 });
    var main = stdSections(S);
    var side = '';
    function box(title, inner) { return '<div class="blk sbox"><div class="sbh">' + esc(title) + '</div>' + inner + '</div>'; }
    if (m.personal.length) side += box('Personal Details', m.personal.map(function (p) {
      return '<div class="bk"><div class="bkk">' + esc(p[0]) + '</div><div class="bkv">' + esc(p[1]) + '</div></div>';
    }).join(''));
    if (m.languages.length) side += box('Languages', m.languages.map(function (l) {
      return '<div class="bl"><span class="bln">' + esc(l.name) + '</span>' + (l.note ? '<span class="blx"> – ' + esc(l.note) + '</span>' : '') + '</div>';
    }).join(''));
    [['Skills', m.skills], ['Attributes', m.attributes], ['Hobbies', m.hobbies]].forEach(function (g) {
      if (g[1].length && !o.lite) side += box(g[0], g[1].map(function (x) { return '<div class="bul"><span class="b">•</span><span class="bt">' + esc(x) + '</span></div>'; }).join(''));
    });
    return hd + '<div class="wrap"><div class="col main">' + main + '</div><div class="col side">' + side + '</div></div>';
  }

  var FAMILIES = { classic: classic, sidebar: sidebar, banner: banner, leftcol: leftcol, centered: centered, timeline: timeline, split: split };

  function fontVar(k, fallback) { return "'F-" + k + "', " + fallback; }

  /* ---------- design: chosen colour and text size ---------- */
  var ACCENTS = [['#1F3A5F', 'Navy'], ['#1565C0', 'Blue'], ['#0F766E', 'Teal'], ['#0B6E4F', 'Green'], ['#7A1F2B', 'Maroon'], ['#C62828', 'Red'],
    ['#5B2A86', 'Purple'], ['#C2410C', 'Orange'], ['#9C7A34', 'Gold'], ['#7B4B2A', 'Brown'], ['#333A44', 'Charcoal'], ['#000000', 'Black']];
  function rgbOf(h) { var n = parseInt(String(h).replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function hexOf(r) { return '#' + r.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join('').toUpperCase(); }
  function mix(a, b, t) { var x = rgbOf(a), y = rgbOf(b); return hexOf([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); }
  function lum(h) { var c = rgbOf(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  // returns a copy of the template with the CV's colour and text size applied
  function effective(t, cv) {
    var d = (cv && cv.design) || {}, A = d.accent, k = D.textScale(cv || {});
    if (!A && k === 1) return t;
    var e = Object.assign({}, t, { c: Object.assign({}, t.c), k: k });
    if (A) {
      var c = e.c;
      c.accent = A; c.accent2 = A;
      if (c.tint) c.tint = mix(A, '#FFFFFF', 0.91);
      if (t.family === 'classic') { c.accent = A; }
      if (t.family === 'sidebar') {
        if (lum(t.c.sideBg) < 0.3) { c.sideBg = A; c.sideAccent = mix(A, '#FFFFFF', 0.62); c.sideLine = mix(A, '#FFFFFF', 0.22); c.sideMuted = mix(A, '#FFFFFF', 0.68); }
        else { c.sideBg = mix(A, '#FFFFFF', 0.9); c.sideAccent = A; c.sideLine = mix(A, '#FFFFFF', 0.72); }
      }
      if (t.family === 'banner') {
        if (lum(t.c.banner) < 0.02) { c.bannerSub = mix(A, '#FFFFFF', 0.35); }
        else { c.banner = A; c.bannerSub = mix(A, '#FFFFFF', 0.75); }
      }
      if (t.family === 'timeline' || t.family === 'split') c.line = mix(A, '#FFFFFF', 0.8);
    }
    return e;
  }
  function styleVars(t) {
    var c = t.c, v = [];
    Object.keys(c).forEach(function (k) { v.push('--' + k + ':' + c[k]); });
    v.push('--nf:' + fontVar(t.fonts.name, 'sans-serif'));
    v.push('--hf:' + fontVar(t.fonts.head, 'sans-serif'));
    v.push('--bf:' + fontVar(t.fonts.body, 'sans-serif'));
    v.push('--nw:' + (t.nameW || 700));
    v.push('--ntt:' + (t.nameUpper ? 'uppercase' : 'none'));
    v.push('--nls:' + (t.nameLs || 0) + 'px');
    v.push('--htt:' + (t.headUpper === false ? 'none' : 'uppercase'));
    v.push('--k:' + (t.k || 1));
    v.push('--fs:' + ((t.bodySize || 13) * (t.k || 1)).toFixed(2) + 'px');
    return v.join(';');
  }

  // returns the inner html of a CV (not paginated) and the wrapper class/style
  function render(cv, tplId, opts) {
    opts = opts || {};
    var t = opts.plain ? get(tplId) : effective(get(tplId), cv);
    var m = model(cv);
    var inner = FAMILIES[t.family](cv, t, m, opts);
    var cls = 'cv f-' + t.family + ' t-' + t.id + (t.hs ? ' hs-' + t.hs : '') + (t.side ? ' side-' + t.side : '') +
      (t.align ? ' al-' + t.align : '') + (t.shade ? ' shade' : '') + (m.photo ? ' has-photo' : '');
    return { cls: cls, style: styleVars(t), html: inner, tpl: t };
  }

  /* page decoration drawn on every page (behind content). Coordinates in css px. */
  function decor(t, pageIndex) {
    if (t.decor) return t.decor(pageIndex);
    var d = [], c = t.c;
    if (t.family === 'classic') d.push({ x: 32, y: 34, w: PW - 64, h: PH - 68, stroke: '#000000', sw: 1 });
    if (t.family === 'sidebar') d.push({ x: t.side === 'right' ? PW - 262 : 0, y: 0, w: 262, h: PH, fill: c.sideBg });
    if (t.family === 'banner' && pageIndex > 0) {
      if (t.stripe) stripeDecor(d, 0, 8); else d.push({ x: 0, y: 0, w: PW, h: 8, fill: c.banner });
    }
    if (t.family === 'leftcol' && t.edge) d.push({ x: 0, y: 0, w: 10, h: PH, fill: c.accent });
    if (t.family === 'centered' && t.frame) d.push({ x: 26, y: 26, w: PW - 52, h: PH - 52, stroke: c.line, sw: 1 });
    if (t.family === 'split') d.push({ x: 0, y: 0, w: PW, h: 10, fill: c.accent });
    if (t.family === 'timeline' && pageIndex > 0) d.push({ x: 0, y: 0, w: PW, h: 6, fill: c.accent });
    return d;
  }
  var FLAG = ['#007A4D', '#FFB612', '#DE3831', '#002395', '#000000'];
  function stripeDecor(d, y, h) {
    var w = PW / FLAG.length;
    FLAG.forEach(function (col, i) { d.push({ x: i * w, y: y, w: w + 0.5, h: h, fill: col }); });
  }

  window.CVTemplates = { displayName: displayName, effective: effective, ACCENTS: ACCENTS, mix: mix, styleVars: styleVars, fontVar: fontVar, todayText: todayText, list: T, get: get, render: render, decor: decor, model: model, fmtID: fmtID, PW: PW, PH: PH, esc: esc, FLAG: FLAG, ICONS: ICONS };
})();
