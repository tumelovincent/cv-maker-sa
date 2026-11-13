/* CV Maker SA - (c) 2026 Tumelo Vincent Tau. All rights reserved. Made by web/bundle.py from www/js. */
/* js/fontmanifest.js */
try {
window.CV_FONTS={"caladea": [400, 700], "carlito": [400, 700], "dmsans": [400, 700], "garamond": [400, 700], "lato": [300, 400, 700], "merriweather": [300, 400, 700], "montserrat": [300, 400, 700], "nunito": [400, 700], "opensans": [400, 700], "oswald": [400, 600], "pagella": [400, 700], "playfair": [400, 700], "poppins": [300, 400, 600], "raleway": [300, 400, 700], "roboto": [400, 700], "sourcesans": [400, 700]};
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/data.js */
try {
/* Data model, South African field options, storage and helpers */
(function () {
  'use strict';

  var SA = {
    languages: ['English', 'Afrikaans', 'isiNdebele', 'isiXhosa', 'isiZulu', 'Sepedi', 'Sesotho', 'Setswana',
      'siSwati', 'Tshivenda', 'Xitsonga', 'South African Sign Language'],
    race: ['African (Black)', 'Coloured', 'Indian', 'White', 'Asian'],
    gender: ['Male', 'Female'],
    marital: ['Single', 'Married', 'Engaged', 'Divorced', 'Widowed'],
    health: ['Excellent', 'Good'],
    criminal: ['None'],
    disability: ['None'],
    nationality: ['South African', 'Permanent Resident'],
    licence: ['None', "Learner's Licence", 'Code A (Motorcycle)', 'Code B', 'Code EB (Code 08)', 'Code C1',
      'Code EC1 (Code 10)', 'Code C', 'Code EC (Code 14)'],
    grade: ['Grade 12', 'Grade 12 (Matric)', 'Grade 11', 'Grade 10', 'Grade 9', 'Grade 8', 'NQF Level 4 (NC(V))', 'Senior Certificate (Amended)'],
    status: ['Completed', 'In progress', 'Incomplete'],
    relationship: ['Manager', 'Former Manager', 'Supervisor', 'Employer', 'Colleague', 'Principal', 'Teacher', 'Lecturer',
      'Pastor', 'Ward Councillor', 'Community Leader', 'Family', 'Neighbour'],
    subjects: ['English', 'Afrikaans', 'Sesotho', 'isiZulu', 'isiXhosa', 'Setswana', 'Sepedi', 'Xitsonga', 'Tshivenda', 'siSwati', 'isiNdebele',
      'Mathematics', 'Mathematical Literacy', 'Technical Mathematics', 'Life Orientation', 'Life Sciences', 'Physical Sciences',
      'Technical Sciences', 'Agricultural Sciences', 'Geography', 'History', 'Accounting', 'Business Studies', 'Economics', 'Tourism',
      'Consumer Studies', 'Hospitality Studies', 'Computer Applications Technology', 'Information Technology',
      'Engineering Graphics and Design', 'Civil Technology', 'Electrical Technology', 'Mechanical Technology',
      'Dramatic Arts', 'Visual Arts', 'Music', 'Religion Studies']
  };

  function uid() { return 'cv' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function blankCV() {
    return {
      id: uid(), updated: Date.now(), templateId: 'classic', showPhoto: true, photo: '',
      personal: { surname: '', firstNames: '', headline: '', dob: '', idNumber: '', gender: '', race: '',
        nationality: '', maritalStatus: '', healthStatus: '', homeLanguage: '', otherLanguages: '',
        criminalRecord: '', licence: '', disability: '' },
      contact: { phone: '', altPhone: '', email: '', address: '', postal: '', linkedin: '' },
      profile: '',
      school: { name: '', grade: '', subjects: '', year: '' },
      tertiary: [], courses: [], work: [], references: [],
      skills: '', attributes: '', hobbies: '',
      refsOnRequest: false, declaration: false,
      docs: [], docOpts: { labels: true, listOnCV: true, small: false },
      design: { accent: '', size: 'normal', order: null, hidden: {} },
      letter: null, z83: null, signature: '', initials: ''
    };
  }

  // The made-up sample person: shown in pictures and previews (template strip, empty-CV preview, website gallery) and
  // opened by "Open a sample CV" to edit as your own. Everything about him is invented - no real person's name, numbers
  // or email. The ID number passes the app's own check (so the CV check stays clean), but its sequence part (9999) is one
  // Home Affairs would only reach after 5 000 boys registered with the same birthday, so it should not be anyone's real number.
  function sampleCV() {
    var c = blankCV();
    c.templateId = 'classic';
    c.personal = { surname: 'Mokoena', firstNames: 'Thabo Sipho', headline: 'Retail Merchandiser',
      dob: '1998-05-14', idNumber: '9805149999081', gender: 'Male', race: 'African (Black)',
      nationality: 'South African', maritalStatus: 'Single', healthStatus: 'Good', homeLanguage: 'Sesotho',
      otherLanguages: 'English, isiZulu, Afrikaans', criminalRecord: 'None', licence: 'Code EB (Code 08)', disability: '' };
    c.contact = { phone: '072 123 4567', altPhone: '057 000 1234', email: 'thabo.mokoena@example.com',
      address: '1234 Mothusi Street\nThabong\nWelkom\n9463', postal: '', linkedin: '' };
    c.profile = 'Reliable and hard-working merchandiser with three years of retail experience. I keep shelves stocked, ' +
      'priced and presentable, and I work well with store teams and suppliers. Looking for a role where I can grow into stock control or supervision.';
    c.school = { name: 'Thabong Secondary School', grade: 'Grade 12 (Matric)',
      subjects: 'English (First Additional Language)\nSesotho (Home Language)\nMathematical Literacy\nBusiness Studies\nAccounting\nGeography\nLife Orientation', year: '2016' };
    c.tertiary = [{ institution: 'Goldfields TVET College', qualification: 'National Certificate N4: Business Management', year: '2019', status: 'Completed' }];
    c.courses = [{ name: 'Computer Literacy (MS Word, Excel, Outlook)', provider: 'Goldfields TVET College', year: '2018' },
      { name: 'First Aid Level 1', provider: 'Red Cross', year: '2022' }];
    c.work = [
      { company: 'Freedom Retail Stores (Pty) Ltd', position: 'Merchandiser', start: '2023-03', end: '', current: true, duration: '',
        duties: 'Pack and face shelves according to planograms\nCheck stock levels and place orders with suppliers\nSet up promotional displays and price tickets\nRotate stock and remove expired products', reason: '' },
      { company: 'Sizwe Cleaning Services', position: 'General Worker', start: '2021-01', end: '2023-02', current: false, duration: '',
        duties: 'Cleaned offices and public areas\nKept stock records of cleaning materials', reason: 'Contract ended' }
    ];
    c.skills = 'Computer literate (MS Office)\nStock control\nCustomer service\nCash handling';
    c.attributes = 'Punctual and reliable\nWorks well under pressure\nGood communicator\nTeam player';
    c.hobbies = 'Soccer\nReading';
    c.references = [
      { name: 'Mr P. Nkosi', relationship: 'Store Manager', company: 'Freedom Retail Stores', phone: '057 123 4567', email: '' },
      { name: 'Mrs L. Dlamini', relationship: 'Principal', company: 'Thabong Secondary School', phone: '057 765 4321', email: '' }
    ];
    c.declaration = false;
    return c;
  }

  /* ---------- SA ID number ---------- */
  function luhnOk(s) {
    var tot = 0;
    for (var i = 0; i < s.length; i++) {
      var d = +s.charAt(s.length - 1 - i);
      if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
      tot += d;
    }
    return tot % 10 === 0;
  }
  function parseSAID(raw) {
    var s = String(raw || '').replace(/\s+/g, '');
    if (!/^\d{13}$/.test(s)) return { valid: false, reason: s.length ? 'ID number must be 13 digits' : '' };
    var yy = +s.substr(0, 2), mm = +s.substr(2, 2), dd = +s.substr(4, 2);
    var nowYY = new Date().getFullYear() % 100;
    var year = (yy > nowYY ? 1900 : 2000) + yy;
    var dt = new Date(year, mm - 1, dd);
    if (dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return { valid: false, reason: 'Date part of the ID is not a real date' };
    if (!luhnOk(s)) return { valid: false, reason: 'Check digit does not match - please re-check the ID number' };
    var g = +s.substr(6, 4);
    var c = s.charAt(10);
    return { valid: true, dob: year + '-' + pad(mm) + '-' + pad(dd), gender: g < 5000 ? 'Female' : 'Male',
      nationality: c === '0' ? 'South African' : (c === '1' ? 'Permanent Resident' : '') };
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- formatting ---------- */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmtDate(iso) { // 1998-05-14 -> 14 May 1998
    if (!iso) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    return (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1];
  }
  function fmtMonth(ym) { // 2023-03 -> Mar 2023
    if (!ym) return '';
    var m = /^(\d{4})-(\d{2})/.exec(ym);
    if (!m) return ym;
    return MONTHS[+m[2] - 1].slice(0, 3) + ' ' + m[1];
  }
  function monthsBetween(a, b) {
    var ma = /^(\d{4})-(\d{2})/.exec(a), mb = /^(\d{4})-(\d{2})/.exec(b);
    if (!ma || !mb) return null;
    return (+mb[1] - +ma[1]) * 12 + (+mb[2] - +ma[2]) + 1;
  }
  function durationText(n) {
    if (n == null || n < 1) return '';
    var y = Math.floor(n / 12), m = n % 12, out = [];
    if (y) out.push(y + (y === 1 ? ' year' : ' years'));
    if (m) out.push(m + (m === 1 ? ' month' : ' months'));
    return out.join(' ');
  }
  function nowYM() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  // "Mar 2023 - Present"
  function workPeriod(w) {
    var s = fmtMonth(w.start), e = w.current ? 'Present' : fmtMonth(w.end);
    if (s && e) return s + ' – ' + e;
    return s || e || '';
  }
  function workDuration(w) {
    if (w.duration) return w.duration;
    var n = monthsBetween(w.start, w.current ? nowYM() : w.end);
    return durationText(n);
  }
  // Classic: "Mar 2023 - Present (1 year 7 months)" or the free-text duration
  function workPeriodLong(w) {
    var p = workPeriod(w), d = workDuration(w);
    if (p && d) return p + ' (' + d + ')';
    return p || d;
  }

  function lines(s) {
    return String(s || '').split(/\r?\n/).map(function (x) { return x.replace(/^\s*[-•*]\s*/, '').trim(); })
      .filter(function (x) { return x.length; });
  }
  function fullName(cv) {
    return [cv.personal.firstNames, cv.personal.surname].map(function (x) { return (x || '').trim(); }).filter(Boolean).join(' ');
  }
  function languagesList(cv) {
    var out = [];
    if (cv.personal.homeLanguage) out.push({ name: cv.personal.homeLanguage, note: 'Home language' });
    String(cv.personal.otherLanguages || '').split(/[,;\n]/).forEach(function (l) {
      l = l.trim(); if (l && out.every(function (o) { return o.name.toLowerCase() !== l.toLowerCase(); })) out.push({ name: l, note: '' });
    });
    return out;
  }

  // "Annexure A: Certified copy of ID" list shown on the CV (when switched on)
  function annexures(cv) {
    var docs = cv.docs || [], o = cv.docOpts || {};
    if (o.listOnCV === false || !docs.length) return [];
    return docs.map(function (d, i) {
      var n = i + 1, s = '';
      while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
      return { key: 'Annexure ' + s, type: d.type || 'Supporting document' };
    });
  }

  /* ---------- design: section order and hiding ---------- */
  var SECTIONS = [
    ['profile', 'Profile / career objective'], ['personal', 'Personal details'], ['work', 'Work experience'],
    ['education', 'Education'], ['courses', 'Courses & certificates'], ['skills', 'Skills & attributes'],
    ['languages', 'Languages'], ['hobbies', 'Hobbies & interests'], ['references', 'References'],
    ['annexures', 'Supporting documents'], ['declaration', 'Declaration']
  ];
  var ORDER_CLASSIC = ['personal', 'profile', 'education', 'courses', 'work', 'skills', 'hobbies', 'references', 'annexures', 'declaration'];
  var ORDER_MODERN = ['profile', 'personal', 'work', 'education', 'courses', 'skills', 'languages', 'hobbies', 'references', 'annexures', 'declaration'];
  function sectionOrder(cv, family) {
    var def = family === 'classic' ? ORDER_CLASSIC : ORDER_MODERN;
    var o = (cv.design && cv.design.order) || [];
    var out = o.filter(function (k) { return def.indexOf(k) >= 0; });
    def.forEach(function (k, i) {
      if (out.indexOf(k) >= 0) return;
      // put a missing key right after its default predecessor
      var prev = i ? def[i - 1] : null, at = prev ? out.indexOf(prev) : -1;
      out.splice(at + 1, 0, k);
    });
    return out;
  }
  function isHidden(cv, key) { return !!(cv.design && cv.design.hidden && cv.design.hidden[key]); }
  function orderBy(list, order) { // list of {key}
    return list.map(function (x, i) { return { x: x, i: i, o: order.indexOf(x.key) }; })
      .sort(function (a, b) { var ao = a.o < 0 ? 999 : a.o, bo = b.o < 0 ? 999 : b.o; return ao - bo || a.i - b.i; })
      .map(function (y) { return y.x; });
  }
  var SIZES = { small: 0.93, normal: 1, large: 1.08 };
  function textScale(cv) { return SIZES[(cv.design && cv.design.size) || 'normal'] || 1; }

  /* ---------- storage ---------- */
  var KEY = 'cvmaker.cvs.v1';
  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function loadAll() {
    var raw = safeGet(KEY);
    if (!raw) return [];
    try { var arr = JSON.parse(raw); return Array.isArray(arr) ? arr.map(normalise) : []; } catch (e) { return []; }
  }
  function saveAll(list) { return safeSet(KEY, JSON.stringify(list)); }
  // fill any missing keys (older saves / imported backups)
  function normalise(cv) {
    var b = blankCV();
    var out = Object.assign({}, b, cv);
    ['personal', 'contact', 'school'].forEach(function (k) { out[k] = Object.assign({}, b[k], cv[k] || {}); });
    ['tertiary', 'courses', 'work', 'references', 'docs'].forEach(function (k) { if (!Array.isArray(out[k])) out[k] = []; });
    out.docOpts = Object.assign({}, b.docOpts, cv.docOpts || {});
    out.design = Object.assign({}, b.design, cv.design || {});
    if (!out.design.hidden || typeof out.design.hidden !== 'object') out.design.hidden = {};
    // v1.2 photo documents had one image; later versions keep a list of pages
    out.docs.forEach(function (d) {
      if (d.kind === 'image' && !Array.isArray(d.parts)) d.parts = [{ fileId: d.fileId, w: d.w, h: d.h, size: d.size, thumb: d.thumb }];
    });
    if (!out.id) out.id = uid();
    return out;
  }

  window.CVData = {
    SA: SA, blankCV: blankCV, sampleCV: sampleCV, parseSAID: parseSAID, uid: uid,
    fmtDate: fmtDate, fmtMonth: fmtMonth, workPeriod: workPeriod, workDuration: workDuration, workPeriodLong: workPeriodLong,
    lines: lines, fullName: fullName, languagesList: languagesList, annexures: annexures,
    SECTIONS: SECTIONS, sectionOrder: sectionOrder, isHidden: isHidden, orderBy: orderBy, textScale: textScale,
    loadAll: loadAll, saveAll: saveAll, normalise: normalise, safeGet: safeGet, safeSet: safeSet
  };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/templates.js */
try {
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
  // extra gallery filters for the built-in designs
  var MORE_TAGS = { sidebar: ['two', 'bold'], split: ['two'], banner: ['bold'], leftcol: ['minimal'], centered: ['minimal'] };
  function normalise(t) {
    t.page = t.page || { mt: 48, mb: 48 };
    (MORE_TAGS[t.family] || []).forEach(function (k) { if (t.tags.indexOf(k) < 0) t.tags.push(k); });
    t.c = Object.assign({ accent2: t.c.accent, muted: '#555555', line: '#DDDDDD', tint: '#F4F4F4' }, t.c);
    BY_ID[t.id] = t;
  }
  T.forEach(normalise);
  // more templates (templates-mod.js) are added after the built-in ones
  function addTemplates(list) { list.forEach(function (t) { if (BY_ID[t.id]) return; normalise(t); T.push(t); }); }
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
    // "Label ........ : value": the dot leader joins each label to its value, so job-portal systems (ATS)
    // read "Date of Birth ... : 14 May 1998" on one line instead of a column of labels and a column of values
    var LEAD = new Array(90).join('.');
    function row(label, value, gap) {
      var l = label ? '<span class="c-lt">' + esc(label) + '</span><span class="lead" aria-hidden="true">' + LEAD + '</span>' : '';
      return '<div class="blk c-row' + (gap ? ' c-gap' : '') + '"><div class="c-l">' + l + '</div><div class="c-v">: ' + esc(value) + '</div></div>';
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
  function addFamily(name, fn) { FAMILIES[name] = fn; }

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
    if (A && t.recolor) { e.c = t.recolor(A); return e; }
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
    if (t.vars) Object.keys(t.vars).forEach(function (k) { v.push('--' + k + ':' + t.vars[k]); });
    return v.join(';');
  }

  // returns the inner html of a CV (not paginated) and the wrapper class/style
  function render(cv, tplId, opts) {
    opts = opts || {};
    var t = opts.plain ? get(tplId) : effective(get(tplId), cv);
    var m = model(cv);
    var inner = FAMILIES[t.family](cv, t, m, opts);
    var cls = 'cv f-' + t.family + ' t-' + t.id + (t.hs ? ' hs-' + t.hs : '') + (t.side ? ' side-' + t.side : '') +
      (t.align ? ' al-' + t.align : '') + (t.shade ? ' shade' : '') + (m.photo ? ' has-photo' : '') + (t.cls ? ' ' + t.cls : '') + (t.ats ? ' ats-safe' : '');
    return { cls: cls, style: styleVars(t), html: inner, tpl: t };
  }

  /* page decoration drawn on every page (behind content). Coordinates in css px. */
  function decor(t, pageIndex) {
    if (t.decor) return t.decor(pageIndex, t);
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

  window.CVTemplates = { addTemplates: addTemplates, addFamily: addFamily,
    _x: { it: it, wrapStd: wrapStd, entryItems: entryItems, kvRows: kvRows, chipsItem: chipsItem, refItems: refItems, declItem: declItem, bulletItems: bulletItems,
      twoColBullets: twoColBullets, icon: icon, photoHTML: photoHTML, initials: initials, contactLine: contactLine, lum: lum, rgbOf: rgbOf, hexOf: hexOf },
    displayName: displayName, effective: effective, ACCENTS: ACCENTS, mix: mix, styleVars: styleVars, fontVar: fontVar, todayText: todayText, list: T, get: get, render: render, decor: decor, model: model, fmtID: fmtID, PW: PW, PH: PH, esc: esc, FLAG: FLAG, ICONS: ICONS };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/templates-mod.js */
try {
/* More modern CV templates (version 1.5). One flexible layout ("mod") whose parts are chosen per template:
   page layout, header, section headings, how skills and contact details look, and page shapes.
   Every part uses only boxes, borders, text, photos and simple shapes, so the PDF writer can redraw it exactly. */
(function () {
  'use strict';
  var TP = window.CVTemplates, X = TP._x, D = window.CVData, esc = TP.esc, it = X.it;
  var PW = 794, PH = 1123;
  var P_CHECK = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z', P_CHEV = 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z';
  function svgI(d, cls) { return '<svg class="' + cls + '" viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; }

  /* ---------- colours ---------- */
  var mix = TP.mix;
  // a: accent, d: dark colour (header band / dark side column), ink, side: 'dark' | 'light', hd: 'dark' | 'light' | 'tint'
  // light enough to read on a dark band or column
  function light(a) { return X.lum(a) > 0.2 ? a : mix(a, '#FFFFFF', 0.55); }
  // o: a accent (text and lines), d dark band/column colour, hd 'dark'|'light' header, side 'dark'|'light' column,
  //    sa side accent, sd side colour, sb light side colour, hs2 header sub-colour, a2 second accent, t tint, ink
  // A: a colour chosen in Design (replaces the accent; the dark colour follows it unless the template fixes it)
  function palette(o, A) {
    var a = A || o.a, keep = !!o.d && !A ? true : !!(o.d && o.keepD);
    var d = keep ? o.d : (A ? mix(A, '#000000', 0.38) : (o.d || mix(o.a, '#000000', 0.38)));
    var ink = o.ink || '#1D2229', c = {
      accent: a, accent2: o.a2 && !A ? o.a2 : a, ink: ink, muted: o.mu || '#5D6570',
      line: mix(a, '#FFFFFF', 0.78), tint: o.t && !A ? o.t : mix(a, '#FFFFFF', 0.91)
    };
    if (o.hd === 'light') { c.hdBg = c.tint; c.hdInk = ink; c.hdSub = a; c.hdIc = a; }
    else { c.hdBg = d; c.hdInk = '#FFFFFF'; c.hdSub = o.hs2 && !A ? o.hs2 : light(mix(a, '#FFFFFF', 0.25)); c.hdIc = c.hdSub; }
    if (o.side === 'dark') {
      var sd = o.sd && !A ? o.sd : d;
      c.sideBg = sd; c.sideInk = '#FFFFFF'; c.sideMuted = mix(sd, '#FFFFFF', 0.62); c.sideAccent = o.sa && !A ? o.sa : light(mix(a, '#FFFFFF', 0.35)); c.sideLine = mix(sd, '#FFFFFF', 0.22);
    } else {
      c.sideBg = o.sb && !A ? o.sb : mix(a, '#FFFFFF', 0.9); c.sideInk = ink; c.sideMuted = '#66707B'; c.sideAccent = a; c.sideLine = mix(a, '#FFFFFF', 0.7);
    }
    return c;
  }

  /* ---------- small pieces ---------- */
  var secNo = 0;
  function MH(title) {
    secNo++;
    return '<div class="blk kwn h"><span class="h-n">' + (secNo < 10 ? '0' : '') + secNo + '</span><span class="h-l"></span><span class="h-mark"></span>' +
      svgI(P_CHEV, 'h-ic') + '<span class="h-t">' + esc(title) + '</span><span class="h-p">.</span><span class="h-r"></span></div>';
  }
  function photoOr(m, t, cls, mono) {
    if (m.photo) return X.photoHTML(m, t, cls);
    return mono ? '<div class="mono ' + (cls || '') + ' ps-' + (t.photoShape || 'circle') + '"><span>' + esc(X.initials(m.name)) + '</span></div>' : '';
  }
  function nameHTML(m, t) {
    var n;
    if (t.nameSplit) {
      var w = m.name.split(/\s+/), last = w.length > 1 ? w.pop() : '';
      n = '<div class="nm nm-split"><span class="nm-a">' + esc(w.join(' ')) + '</span>' + (last ? '<span class="nm-b">' + esc(last) + '</span>' : '') + '</div>';
    } else n = '<div class="nm">' + esc(m.name) + '</div>';
    return n + (m.headline ? '<div class="ttl">' + esc(m.headline) + '</div>' : '');
  }
  function contactsHTML(m, t) {
    if (!m.contacts.length) return '';
    var ct = t.ct || 'icons';
    var parts = m.contacts.map(function (c) {
      var ic = ct === 'text' ? '' : (ct === 'circles' ? '<span class="ib">' + X.icon(c.i) + '</span>' : X.icon(c.i));
      return '<span class="ci">' + ic + '<span class="ct">' + esc(c.t) + '</span></span>';
    });
    return '<div class="cts ct-' + ct + '">' + (ct === 'text' ? parts.join('<span class="sep">|</span>') : parts.join('')) + '</div>';
  }

  // skills, attributes and languages in the chosen style
  function listItems(list, sk) {
    if (!list.length) return [];
    if (sk === 'bullets') return X.twoColBullets(list);
    if (sk === 'checks' || sk === 'dots') {
      var out = [], n = sk === 'checks' ? 3 : 2;
      for (var i = 0; i < list.length; i += n) {
        var row = '';
        for (var j = 0; j < n; j++) {
          var x = list[i + j];
          row += '<div class="lc-i">' + (x ? (sk === 'checks' ? svgI(P_CHECK, 'ck') : '<span class="sq"></span>') + '<span class="lt">' + esc(x) + '</span>' : '') + '</div>';
        }
        out.push(it('lrow lrow-' + sk, row));
      }
      return out;
    }
    if (sk === 'inline') return [it('p inl', list.map(esc).join('<span class="dsep">•</span>'))];
    return [it('chips ch-' + sk, list.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join(''))];
  }
  function langNames(m) { return m.languages.map(function (l) { return l.name + (l.note ? ' (' + l.note + ')' : ''); }); }

  // the sections of the main column; o.side: personal, languages and skills are in the side column instead
  function sections(m, t, o) {
    var S = [], sk = t.sk || 'chips';
    function ents(list) { return [].concat.apply([], list.map(t.lay === 'tl' ? tlItems : X.entryItems)); }
    if (m.profile) S.push({ key: 'profile', t: 'Profile', items: [it('p', esc(m.profile))] });
    if (!o.side && m.personal.length) S.push({ key: 'personal', t: 'Personal Details', items: X.kvRows(m.personal, t.lay === 'lcol' ? 2 : 2) });
    if (m.work.length) S.push({ key: 'work', t: 'Work Experience', items: ents(m.work) });
    if (m.edu.length) S.push({ key: 'education', t: 'Education', items: ents(m.edu) });
    if (m.courses.length) S.push({ key: 'courses', t: 'Courses & Certificates', items: ents(m.courses) });
    if (!o.side || o.lite) {
      var msk = o.side ? 'bullets' : sk;
      if (m.skills.length) S.push({ key: 'skills', t: 'Skills', items: listItems(m.skills, msk) });
      if (m.attributes.length) S.push({ key: 'skills', t: 'Personal Attributes', items: listItems(m.attributes, msk) });
      if (m.hobbies.length) S.push({ key: 'hobbies', t: 'Hobbies & Interests', items: [it('p', esc(m.hobbies.join(', ')))] });
    }
    if (!o.side && m.languages.length) S.push({ key: 'languages', t: 'Languages', items: sk === 'bullets' ? [it('p', esc(langNames(m).join(', ')))] : listItems(langNames(m), sk === 'checks' ? 'dots' : sk) });
    if (m.references.length || m.refsOnRequest) S.push({ key: 'references', t: 'References', items: X.refItems(m, o.refCols || 2) });
    if (m.annexures.length) S.push({ key: 'annexures', t: 'Supporting Documents', items: m.annexures.map(function (a) {
      return it('bul', '<span class="b">•</span><span class="bt"><b>' + esc(a.key) + ':</b> ' + esc(a.type) + '</span>');
    }) });
    if (m.declaration) S.push({ key: 'declaration', t: 'Declaration', items: [X.declItem(m)] });
    return m.order ? D.orderBy(S, m.order) : S;
  }
  // timeline rows for one entry
  function tlItems(e) {
    var rows = [], pill = e.period ? '<span class="tlp">' + esc(e.period) + '</span>' : '';
    rows.push({ d: e.period, h: '<span class="tl-dot"></span>' + '<div class="tl-pw">' + pill + '</div><div class="ent-t">' + esc(e.title) + '</div>' + (e.org ? '<div class="ent-s">' + esc(e.org) + '</div>' : '') +
      (e.note ? '<div class="ent-n">' + esc(e.note) + '</div>' : '') });
    e.bullets.forEach(function (b) { rows.push({ d: '', h: '<div class="bul"><span class="b">•</span><span class="bt">' + esc(b) + '</span></div>' }); });
    if (e.extra) rows.push({ d: '', h: '<div class="ent-x">' + esc(e.extra) + '</div>' });
    return rows.map(function (r, i) {
      var last = i === rows.length - 1;
      return it('tl' + (last ? ' tl-end' : '') + (i === 0 ? ' tl-first' : ''), '<div class="tl-d">' + esc(r.d) + '</div><div class="tl-c">' + r.h + '</div>', i === 0 && rows.length > 1);
    });
  }

  // a section as blocks: heading + items (cards wrap every item so page breaks stay clean)
  function sectionHTML(s, t) {
    var h = MH(s.t);
    if (t.lay === 'cards') {
      return h + s.items.map(function (x, i) {
        return '<div class="blk cdb' + (i === s.items.length - 1 ? ' cdl' : '') + (x.k ? ' kwn' : '') + '"><div class="cdi ' + x.c + '">' + x.h + '</div></div>';
      }).join('');
    }
    return h + X.wrapStd(s.items);
  }
  // left-heading rows (lcol layout)
  function lcolHTML(S, t) {
    secNo = 0;
    return S.map(function (s) {
      secNo++;
      return s.items.map(function (x, i) {
        var lh = i === 0 ? '<span class="lh-n">' + (secNo < 10 ? '0' : '') + secNo + '</span><span class="lh-t">' + esc(s.t) + '</span>' : '';
        return '<div class="blk lr' + (i === 0 ? ' first' : '') + (i === s.items.length - 1 ? ' last' : '') + (x.k ? ' kwn' : '') + '"><div class="lh">' + lh +
          '</div><div class="lc"><div class="lci ' + x.c + '">' + x.h + '</div></div></div>';
      }).join('');
    }).join('');
  }

  // side column (side, hside and two layouts)
  function sideHTML(m, t, o) {
    var groups = [];
    function SH(title) { return '<div class="blk kwn sh"><span class="sh-mark"></span><span class="sh-t">' + esc(title) + '</span><span class="sh-r"></span></div>'; }
    if (o.contacts && m.contacts.length) groups.push(SH('Contact') + m.contacts.map(function (c) {
      return '<div class="blk si">' + (t.ct === 'circles' ? '<span class="ib">' + X.icon(c.i) + '</span>' : X.icon(c.i)) + '<span class="st">' + esc(c.t) + '</span></div>';
    }).join(''));
    if (m.personal.length) groups.push(SH('Personal Details') + m.personal.map(function (p) {
      return '<div class="blk skv"><div class="sk">' + esc(p[0]) + '</div><div class="sv">' + esc(p[1]) + '</div></div>';
    }).join(''));
    if (m.languages.length) groups.push(SH('Languages') + m.languages.map(function (l) {
      return '<div class="blk sl"><span class="sln">' + esc(l.name) + '</span>' + (l.note ? '<span class="slx">' + esc(l.note) + '</span>' : '') + '</div>';
    }).join(''));
    if (!o.lite) [['Skills', m.skills], ['Attributes', m.attributes], ['Hobbies', m.hobbies]].forEach(function (g) {
      if (!g[1].length) return;
      if (t.ssk === 'chips' && g[0] !== 'Hobbies') groups.push(SH(g[0]) + '<div class="blk schips">' + g[1].map(function (x) { return '<span class="schip">' + esc(x) + '</span>'; }).join('') + '</div>');
      else groups.push(SH(g[0]) + g[1].map(function (x) { return '<div class="blk sb"><span class="b">' + (t.ssk === 'dots' ? '<span class="sq"></span>' : '•') + '</span><span class="bt">' + esc(x) + '</span></div>'; }).join(''));
    });
    var h = o.photo ? '<div class="blk ph">' + photoOr(m, t, '', true) + '</div>' : '';
    if (!t.sbox) return h + groups.join('');
    // boxed groups: every block carries the box colour, the first and last round the corners
    return h + groups.map(function (g) {
      var parts = g.split('<div class="blk ');
      parts.shift();
      return parts.map(function (p, i) { return '<div class="blk sbx' + (i === 0 ? ' sbx-f' : '') + (i === parts.length - 1 ? ' sbx-l' : '') + ' ' + p; }).join('');
    }).join('');
  }

  /* ---------- headers ---------- */
  function header(m, t, o) {
    var hd = t.hd, nm = nameHTML(m, t), cts = o.noContacts ? '' : contactsHTML(m, t);
    var pic = function (mono) { return photoOr(m, t, 'hph', mono); };
    var inner;
    switch (hd) {
      case 'band': case 'diag': case 'wave':
        inner = '<div class="hdb">' + (m.photo ? pic(false) : '') + '<div class="hdt">' + nm + cts + '</div></div>' +
          (hd === 'diag' ? '<svg class="hd-cut" viewBox="0 0 794 44" preserveAspectRatio="none"><path d="M0 0 H794 V6 L0 44 Z"/></svg>' : '') +
          (hd === 'wave' ? '<svg class="hd-cut" viewBox="0 0 794 44" preserveAspectRatio="none"><path d="M0 0 H794 V14 C620 52 420 4 230 22 C130 31 60 40 0 30 Z"/></svg>' : '');
        break;
      case 'split2':
        inner = '<div class="s2"><div class="s2a">' + pic(true) + '</div><div class="s2b">' + nm + cts + '</div></div>';
        break;
      case 'inverse':
        inner = '<div class="inv"><div class="inv-a">' + nm + '</div><div class="inv-b">' + cts + '</div></div>';
        break;
      case 'right':
        inner = '<div class="rgt">' + (m.photo ? pic(false) : '') + '<div class="rgt-a">' + nm + '</div><div class="rgt-b">' + cts + '</div></div>';
        break;
      case 'badge':
        inner = '<div class="bdg">' + pic(true) + '<div class="bdg-t">' + nm + '</div></div>' + cts;
        break;
      case 'boxed':
        inner = '<div class="bx">' + '<div class="bx-t">' + nm + cts + '</div>' + (m.photo ? pic(false) : '') + '</div>';
        break;
      case 'frame':
        inner = '<div class="frm"><div class="frm-n">' + nm + '</div></div>' + cts;
        break;
      default: // plain, center, tag, under, big, minimal
        inner = '<div class="hdp">' + (m.photo && !o.noPhoto ? pic(false) : '') + '<div class="hdt">' + nm + (hd === 'under' ? '<div class="nm-bar"></div>' : '') + cts + '</div></div>';
    }
    return '<div class="blk hdr hd-' + hd + '">' + inner + '</div>';
  }

  /* ---------- the layout ---------- */
  function mod(cv, t, m, o) {
    secNo = 0;
    if (t.noPhoto) m = Object.assign({}, m, { photo: '' });
    var lay = t.lay;
    if (lay === 'side') {
      var side = sideHTML(m, t, { photo: true, contacts: true, lite: o.lite });
      var main = header(m, t, { noContacts: true, noPhoto: true }) + sections(m, t, { side: true, lite: o.lite, refCols: 2 }).map(function (s) { return sectionHTML(s, t); }).join('');
      return '<div class="wrap"><div class="col side">' + side + '</div><div class="col main">' + main + '</div></div>';
    }
    if (lay === 'hside' || lay === 'two') {
      var hs = lay === 'hside';
      var sd = sideHTML(m, t, { photo: false, contacts: false, lite: o.lite });
      var mn = sections(m, t, { side: true, lite: o.lite, refCols: 1 }).map(function (s) { return sectionHTML(s, t); }).join('');
      return '<div class="col hdc">' + header(m, t, {}) + '</div><div class="wrap"><div class="col side">' + sd + '</div><div class="col main">' + mn + '</div></div>';
    }
    var S = sections(m, t, { side: false });
    var body = lay === 'lcol' ? lcolHTML(S, t) : S.map(function (s) { return sectionHTML(s, t); }).join('');
    return '<div class="col">' + header(m, t, {}) + '<div class="body">' + body + '</div></div>';
  }
  TP.addFamily('mod', mod);

  /* ---------- page shapes ---------- */
  function decorFor(t) {
    return function (pi, tt) {
      var c = (tt || t).c, d = [], sw = (t.sw || 250);
      if (t.pageBg) d.push({ x: 0, y: 0, w: PW, h: PH, fill: c.page });
      if (t.lay === 'side' || t.lay === 'hside') d.push({ x: t.side === 'right' ? PW - sw : 0, y: 0, w: sw, h: PH, fill: c.sideBg });
      (t.deco || []).forEach(function (k) {
        if (k === 'top' && pi > 0) d.push({ x: 0, y: 0, w: PW, h: 10, fill: c.hdBg });
        if (k === 'topall') d.push({ x: 0, y: 0, w: PW, h: 10, fill: c.accent });
        if (k === 'bottom') d.push({ x: 0, y: PH - 14, w: PW, h: 14, fill: c.accent });
        if (k === 'edge') d.push({ x: 0, y: 0, w: 12, h: PH, fill: c.accent });
        if (k === 'edge-r') d.push({ x: PW - 12, y: 0, w: 12, h: PH, fill: c.accent });
        if (k === 'frame') d.push({ x: 22, y: 22, w: PW - 44, h: PH - 44, stroke: c.accent, sw: 1.5 });
        if (k === 'circles' && pi === 0) { d.push({ x: PW - 170, y: -90, w: 260, h: 260, r: 130, fill: c.tint }); d.push({ x: PW - 90, y: 110, w: 120, h: 120, r: 60, fill: c.line, op: 0.6 }); }
        if (k === 'corner') d.push({ path: 'M' + PW + ' ' + (PH - 120) + ' L' + PW + ' ' + PH + ' L' + (PW - 120) + ' ' + PH + ' Z', fill: c.accent });
        if (k === 'corner-tl' && pi === 0) d.push({ path: 'M0 0 L150 0 L0 150 Z', fill: c.tint });
        if (k === 'dots' && pi === 0) for (var r = 0; r < 4; r++) for (var q = 0; q < 6; q++) d.push({ x: PW - 150 + q * 20, y: 30 + r * 20, w: 6, h: 6, r: 3, fill: c.line });
      });
      return d;
    };
  }

  /* ---------- catalogue ---------- */
  // f: [name font, heading font, body font]; nw: name weight
  var DOCX = { montserrat: 'Century Gothic', raleway: 'Century Gothic', poppins: 'Century Gothic', dmsans: 'Calibri', nunito: 'Calibri', lato: 'Calibri', opensans: 'Calibri',
    sourcesans: 'Calibri', roboto: 'Arial', oswald: 'Arial Narrow', merriweather: 'Georgia', playfair: 'Georgia', garamond: 'Garamond', pagella: 'Book Antiqua', caladea: 'Cambria', carlito: 'Calibri' };
  function make(x) {
    var t = {
      id: x.id, name: x.name, family: 'mod', lay: x.lay, side: x.side || 'left', hd: x.hd, hs: x.hs, sk: x.sk || 'chips', ct: x.ct || 'icons', ssk: x.ssk || 'list',
      sbox: !!x.sbox, deco: x.deco || [], sw: x.sw || (x.lay === 'two' ? 230 : 250), nameSplit: !!x.split, photoShape: x.ps || 'circle',
      fonts: { name: x.f[0], head: x.f[1], body: x.f[2] }, nameW: x.nw || 700, nameUpper: !!x.up, nameLs: x.ls || 0, headUpper: x.hu === false ? false : undefined,
      bodySize: x.bs || 13, pageBg: !!x.pageBg, noPhoto: x.photo === false,
      docx: { name: DOCX[x.f[0]] || 'Calibri', head: DOCX[x.f[1]] || 'Calibri', body: DOCX[x.f[2]] || 'Calibri' },
      page: { mt: 48, mb: (x.deco || []).indexOf('bottom') >= 0 || (x.deco || []).indexOf('corner') >= 0 ? 70 : 48 },
      tags: ['modern', 'new'].concat(x.tags || [])
    };
    var pal = Object.assign({}, x.p);
    t.c = palette(pal);
    t.recolor = function (A) { return palette(pal, A); };
    t.vars = { sw: t.sw + 'px' };
    t.cls = 'lay-' + t.lay + ' hd-' + t.hd + ' sk-' + t.sk + ' ct-' + t.ct + ' ssk-' + t.ssk + (t.sbox ? ' sbox' : '') + (x.tl ? x.tl.split(' ').map(function (k) { return ' tl-' + k; }).join('') : '') + (x.lh ? ' lh-' + x.lh : '') + (x.shs ? ' shs-' + x.shs : ' shs-line') +
      (t.nameSplit ? ' nsplit' : '') + (x.cls ? ' ' + x.cls : '') + (x.deco || []).map(function (k) { return ' dk-' + k; }).join('');
    if (['side', 'hside', 'two'].indexOf(t.lay) >= 0) t.tags.push('two');
    if (['band', 'diag', 'wave', 'split2', 'inverse'].indexOf(t.hd) >= 0 || t.lay === 'side' || t.lay === 'hside') t.tags.push('bold');
    if (['plain', 'center', 'minimal', 'under', 'tag', 'frame', 'right', 'big'].indexOf(t.hd) >= 0 && ['one', 'lcol', 'two', 'tl'].indexOf(t.lay) >= 0 && !(x.deco || []).length) t.tags.push('minimal');
    if (t.lay === 'one' && ['plain', 'center', 'minimal', 'under', 'tag'].indexOf(t.hd) >= 0 && ['bullets', 'inline'].indexOf(t.sk) >= 0) t.tags.push('ats');
    if (x.photo !== false) t.tags.push('photo');
    t.decor = decorFor(t);
    return t;
  }

  /* ---------- the 78 new templates ---------- */
  var MOD = [
    // one column
    { id: 'aurora', name: 'Aurora', lay: 'one', hd: 'band', hs: 'pill', sk: 'chips', f: ['poppins', 'poppins', 'opensans'], nw: 600, p: { a: '#B7791F', d: '#14213D', hs2: '#F6C453' } },
    { id: 'horizon', name: 'Horizon', lay: 'one', hd: 'diag', hs: 'under', sk: 'outline', ct: 'circles', f: ['montserrat', 'montserrat', 'lato'], p: { a: '#1D4ED8' } },
    { id: 'karoo', name: 'Karoo', lay: 'one', hd: 'wave', hs: 'tint', sk: 'solid', f: ['nunito', 'nunito', 'nunito'], p: { a: '#C2410C' } },
    { id: 'summit', name: 'Summit', lay: 'one', hd: 'plain', hs: 'num', sk: 'bullets', ct: 'text', deco: ['edge'], f: ['raleway', 'raleway', 'sourcesans'], p: { a: '#166534' }, photo: false },
    { id: 'meridian', name: 'Meridian', lay: 'one', hd: 'center', hs: 'double', sk: 'inline', ct: 'text', f: ['playfair', 'playfair', 'lato'], p: { a: '#7F1D1D' } },
    { id: 'protea', name: 'Protea', lay: 'one', hd: 'boxed', hs: 'dash', sk: 'chips', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#BE185D' }, ps: 'rounded' },
    { id: 'baobab', name: 'Baobab', lay: 'one', hd: 'tag', hs: 'box', sk: 'checks', f: ['merriweather', 'merriweather', 'opensans'], p: { a: '#78350F' } },
    { id: 'jacaranda', name: 'Jacaranda', lay: 'one', hd: 'badge', hs: 'ring', sk: 'outline', ct: 'circles', f: ['poppins', 'poppins', 'nunito'], nw: 600, p: { a: '#6D28D9' } },
    { id: 'graphite', name: 'Graphite', lay: 'one', hd: 'right', hs: 'ink', sk: 'square', f: ['oswald', 'oswald', 'roboto'], nw: 600, up: true, ls: 2, p: { a: '#C2410C', ink: '#111827' }, ps: 'square' },
    { id: 'sapphire', name: 'Sapphire', lay: 'one', hd: 'big', split: true, hs: 'spaced', sk: 'dots', deco: ['circles'], f: ['montserrat', 'montserrat', 'opensans'], p: { a: '#0369A1' }, photo: false },
    { id: 'copper', name: 'Copper', lay: 'one', hd: 'under', hs: 'over', sk: 'inline', f: ['lato', 'lato', 'lato'], p: { a: '#B45309' } },
    { id: 'ivory', name: 'Ivory', lay: 'one', hd: 'minimal', hs: 'liner', sk: 'bullets', ct: 'text', f: ['garamond', 'garamond', 'garamond'], bs: 14, p: { a: '#57534E', ink: '#1C1917' }, photo: false },
    { id: 'onyx', name: 'Onyx', lay: 'one', hd: 'inverse', hs: 'tab', sk: 'chips', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#0F766E', d: '#0F172A', hs2: '#5EEAD4' }, photo: false },
    { id: 'saffron', name: 'Saffron', lay: 'one', hd: 'frame', hs: 'period', sk: 'outline', ct: 'text', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#B45309', a2: '#92400E' }, photo: false },
    { id: 'lagoon', name: 'Lagoon', lay: 'one', hd: 'split2', hs: 'pills', sk: 'chips', f: ['nunito', 'nunito', 'nunito'], p: { a: '#0E7490' } },
    { id: 'pulse', name: 'Pulse', lay: 'one', hd: 'band', hs: 'arrow', sk: 'checks', ct: 'circles', deco: ['top', 'bottom'], f: ['roboto', 'roboto', 'roboto'], p: { a: '#DC2626', d: '#1F2937', hs2: '#F87171' } },
    { id: 'metro', name: 'Metro', lay: 'one', hd: 'plain', hs: 'fill', sk: 'solid', deco: ['frame'], f: ['sourcesans', 'sourcesans', 'sourcesans'], p: { a: '#4338CA' } },
    { id: 'atlas', name: 'Atlas', lay: 'one', hd: 'center', hs: 'rule', sk: 'inline', ct: 'text', f: ['opensans', 'opensans', 'opensans'], p: { a: '#1E3A8A' }, photo: false },
    // sections in cards
    { id: 'pebble', name: 'Pebble', lay: 'cards', hd: 'boxed', hs: 'liner', sk: 'solid', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#475569' } },
    { id: 'citrus', name: 'Citrus', lay: 'cards', hd: 'band', hs: 'pills', sk: 'solid', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#4D7C0F', d: '#1A2E05', hs2: '#BEF264' } },
    { id: 'lavender', name: 'Lavender', lay: 'cards', hd: 'center', hs: 'dash', sk: 'outline', f: ['nunito', 'nunito', 'nunito'], p: { a: '#7C3AED' } },
    { id: 'harbour', name: 'Harbour', lay: 'cards', hd: 'diag', hs: 'over', sk: 'outline', ct: 'circles', f: ['montserrat', 'montserrat', 'opensans'], p: { a: '#1E40AF' } },
    { id: 'clay', name: 'Clay', lay: 'cards', hd: 'wave', hs: 'under', sk: 'chips', f: ['raleway', 'raleway', 'lato'], p: { a: '#9A3412' } },
    { id: 'spearmint', name: 'Spearmint', lay: 'cards', hd: 'badge', hs: 'num', sk: 'checks', f: ['sourcesans', 'sourcesans', 'sourcesans'], p: { a: '#047857' }, ps: 'rounded' },
    { id: 'velvet', name: 'Velvet', lay: 'cards', hd: 'inverse', hs: 'box', sk: 'square', f: ['playfair', 'playfair', 'lato'], p: { a: '#881337', d: '#3B0A1A', hs2: '#FDA4AF' }, photo: false },
    { id: 'linen', name: 'Linen', lay: 'cards', hd: 'minimal', hs: 'spaced', sk: 'inline', f: ['garamond', 'garamond', 'lato'], p: { a: '#A16207', t: '#F7F1E3' }, photo: false },
    // full-height coloured column
    { id: 'midnight', name: 'Midnight', lay: 'side', hd: 'plain', hs: 'under', shs: 'pill', f: ['montserrat', 'montserrat', 'opensans'], p: { a: '#0369A1', d: '#0F172A', side: 'dark', sa: '#38BDF8' } },
    { id: 'forest', name: 'Forest', lay: 'side', side: 'right', hd: 'tag', hs: 'num', shs: 'caps', f: ['raleway', 'raleway', 'lato'], p: { a: '#15803D', d: '#14532D', side: 'dark', sa: '#86EFAC' } },
    { id: 'plum', name: 'Plum', lay: 'side', hd: 'big', split: true, hs: 'pill', shs: 'under', ps: 'rounded', f: ['poppins', 'poppins', 'nunito'], nw: 600, p: { a: '#A21CAF', d: '#4A044E', side: 'dark', sa: '#F0ABFC' } },
    { id: 'sage', name: 'Sage', lay: 'side', hd: 'under', hs: 'dash', shs: 'bar', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#4D7C0F', side: 'light', sb: '#ECF1E4' } },
    { id: 'steel', name: 'Steel', lay: 'side', side: 'right', hd: 'plain', hs: 'box', shs: 'line', ssk: 'chips', ps: 'square', f: ['roboto', 'roboto', 'roboto'], p: { a: '#334155', side: 'light', sb: '#E8EBEF' } },
    { id: 'ember', name: 'Ember', lay: 'side', hd: 'plain', hs: 'tab', shs: 'caps', f: ['oswald', 'oswald', 'roboto'], nw: 600, up: true, ls: 1, p: { a: '#C2410C', d: '#2A0F05', side: 'dark', sa: '#FB923C' } },
    { id: 'cobalt', name: 'Cobalt', lay: 'side', sw: 225, hd: 'under', hs: 'ring', shs: 'under', ps: 'square', f: ['nunito', 'nunito', 'nunito'], p: { a: '#1D4ED8', d: '#1E3A8A', side: 'dark', sa: '#93C5FD' } },
    { id: 'reef', name: 'Reef', lay: 'side', side: 'right', hd: 'plain', hs: 'over', shs: 'bar', ct: 'circles', f: ['lato', 'lato', 'lato'], p: { a: '#BE123C', d: '#134E4A', side: 'dark', sa: '#FDA4AF' } },
    { id: 'ruby', name: 'Ruby', lay: 'side', hd: 'big', split: true, hs: 'double', shs: 'line', f: ['raleway', 'raleway', 'opensans'], p: { a: '#BE123C', d: '#4C0519', side: 'dark', sa: '#FDA4AF' } },
    { id: 'goldfields', name: 'Goldfields', lay: 'side', hd: 'plain', hs: 'spaced', shs: 'caps', ssk: 'dots', f: ['raleway', 'raleway', 'lato'], nw: 300, up: true, ls: 3, p: { a: '#8A6A12', d: '#1C1917', side: 'dark', sa: '#D4A017' } },
    { id: 'lilac', name: 'Lilac', lay: 'side', side: 'right', hd: 'tag', hs: 'pills', shs: 'pill', ps: 'rounded', f: ['nunito', 'nunito', 'nunito'], p: { a: '#9333EA', side: 'light', sb: '#F3E8FF' } },
    { id: 'sandstone', name: 'Sandstone', lay: 'side', hd: 'plain', hs: 'tint', shs: 'line', ssk: 'dots', f: ['merriweather', 'merriweather', 'opensans'], p: { a: '#9A3412', side: 'light', sb: '#F5EBDD' } },
    { id: 'carbon', name: 'Carbon', lay: 'side', hd: 'under', hs: 'arrow', shs: 'bar', ssk: 'chips', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#0E7490', d: '#18181B', side: 'dark', sa: '#22D3EE' } },
    { id: 'umhlanga', name: 'Umhlanga', lay: 'side', side: 'right', hd: 'big', split: true, hs: 'num', shs: 'pill', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#0369A1', d: '#075985', side: 'dark', sa: '#FCD34D' } },
    // header across the top, then a coloured column
    { id: 'highveld', name: 'Highveld', lay: 'hside', hd: 'band', hs: 'under', f: ['montserrat', 'montserrat', 'opensans'], p: { a: '#3B5B8C', d: '#1E293B', side: 'light', sb: '#EEF1F5', hs2: '#A5B9D8' } },
    { id: 'lowveld', name: 'Lowveld', lay: 'hside', side: 'right', hd: 'band', hs: 'pill', ssk: 'chips', f: ['nunito', 'nunito', 'nunito'], p: { a: '#15803D', d: '#14532D', side: 'light', hs2: '#86EFAC' } },
    { id: 'kalahari', name: 'Kalahari', lay: 'hside', hd: 'diag', hs: 'dash', ssk: 'dots', f: ['raleway', 'raleway', 'lato'], p: { a: '#B45309', d: '#78350F', side: 'light', sb: '#F6EBDD', hs2: '#FCD34D' } },
    { id: 'zambezi', name: 'Zambezi', lay: 'hside', side: 'right', hd: 'wave', hs: 'tab', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#0369A1', d: '#0C4A6E', side: 'light' } },
    { id: 'limpopo', name: 'Limpopo', lay: 'hside', hd: 'band', hs: 'over', shs: 'bar', f: ['sourcesans', 'sourcesans', 'sourcesans'], p: { a: '#4D7C0F', d: '#365314', side: 'dark', sa: '#BEF264', hs2: '#BEF264' } },
    { id: 'jozi', name: 'Jozi', lay: 'hside', hd: 'band', hs: 'box', shs: 'caps', f: ['oswald', 'oswald', 'roboto'], nw: 600, up: true, ls: 1, p: { a: '#A16207', d: '#0A0A0A', side: 'dark', sd: '#262626', sa: '#FACC15', hs2: '#FACC15' } },
    { id: 'capebreeze', name: 'Cape Breeze', lay: 'hside', hd: 'band', hs: 'ring', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#0369A1', hd: 'light', side: 'light', sb: '#F0F7FC' } },
    { id: 'vaal', name: 'Vaal', lay: 'hside', side: 'right', hd: 'diag', hs: 'num', f: ['lato', 'lato', 'lato'], p: { a: '#4338CA', d: '#312E81', side: 'light' } },
    { id: 'kimberley', name: 'Kimberley', lay: 'hside', hd: 'wave', hs: 'double', shs: 'under', f: ['raleway', 'raleway', 'opensans'], p: { a: '#1D4ED8', d: '#1F2937', side: 'dark', sa: '#93C5FD', hs2: '#93C5FD' } },
    { id: 'fynbos', name: 'Fynbos', lay: 'hside', hd: 'band', hs: 'spaced', shs: 'bar', f: ['playfair', 'playfair', 'lato'], p: { a: '#9D174D', d: '#831843', side: 'light', sb: '#FCE7F3', hs2: '#FBCFE8' } },
    // header across the top, then main text and a light column
    { id: 'skyline', name: 'Skyline', lay: 'two', hd: 'plain', hs: 'under', ssk: 'chips', f: ['montserrat', 'montserrat', 'opensans'], p: { a: '#1D4ED8', side: 'light' }, side: 'right' },
    { id: 'nova', name: 'Nova', lay: 'two', side: 'left', hd: 'center', hs: 'pill', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#DB2777', side: 'light' } },
    { id: 'vertex', name: 'Vertex', lay: 'two', side: 'right', hd: 'right', hs: 'box', sbox: true, f: ['roboto', 'roboto', 'roboto'], p: { a: '#0D9488', side: 'light' } },
    { id: 'prism', name: 'Prism', lay: 'two', side: 'right', hd: 'badge', hs: 'dash', ssk: 'dots', f: ['nunito', 'nunito', 'nunito'], p: { a: '#9333EA', side: 'light' } },
    { id: 'compass', name: 'Compass', lay: 'two', side: 'left', hd: 'under', hs: 'num', sbox: true, f: ['sourcesans', 'sourcesans', 'sourcesans'], p: { a: '#C2410C', side: 'light' } },
    { id: 'beacon', name: 'Beacon', lay: 'two', side: 'right', hd: 'band', hs: 'over', f: ['lato', 'lato', 'lato'], p: { a: '#B91C1C', d: '#450A0A', side: 'light', hs2: '#FCA5A5' } },
    { id: 'pearl', name: 'Pearl', lay: 'two', side: 'right', hd: 'boxed', hs: 'ring', sbox: true, f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#64748B', side: 'light' } },
    { id: 'dusk', name: 'Dusk', lay: 'two', side: 'left', hd: 'diag', hs: 'tint', f: ['raleway', 'raleway', 'opensans'], p: { a: '#4338CA', d: '#1E1B4B', side: 'light', hs2: '#A5B4FC' } },
    { id: 'dawn', name: 'Dawn', lay: 'two', side: 'right', hd: 'wave', hs: 'pills', ssk: 'chips', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#C2410C', d: '#7C2D12', side: 'light', hs2: '#FDBA74' } },
    { id: 'monarch', name: 'Monarch', lay: 'two', side: 'right', hd: 'inverse', hs: 'tab', f: ['oswald', 'oswald', 'roboto'], nw: 600, up: true, ls: 1, p: { a: '#B45309', d: '#111111', side: 'light', hs2: '#FBBF24' }, photo: false },
    { id: 'marigold', name: 'Marigold', lay: 'two', side: 'left', hd: 'split2', hs: 'double', ssk: 'dots', f: ['nunito', 'nunito', 'nunito'], p: { a: '#B45309', d: '#78350F', side: 'light', hs2: '#FCD34D' } },
    { id: 'urban', name: 'Urban', lay: 'two', side: 'right', hd: 'big', split: true, hs: 'arrow', sbox: true, f: ['montserrat', 'montserrat', 'lato'], p: { a: '#047857', ink: '#111827', side: 'light' }, photo: false },
    // headings in a left column
    { id: 'stone', name: 'Stone', lay: 'lcol', lh: 'plain', hd: 'plain', sk: 'bullets', ct: 'text', f: ['lato', 'lato', 'lato'], nw: 300, p: { a: '#44403C' }, photo: false },
    { id: 'cedar', name: 'Cedar', lay: 'lcol', lh: 'tab', hd: 'tag', sk: 'chips', f: ['merriweather', 'merriweather', 'opensans'], p: { a: '#3F6212' } },
    { id: 'platinum', name: 'Platinum', lay: 'lcol', lh: 'right', hd: 'minimal', sk: 'inline', ct: 'text', f: ['raleway', 'raleway', 'raleway'], p: { a: '#475569' }, photo: false },
    { id: 'mustard', name: 'Mustard', lay: 'lcol', lh: 'line', hd: 'band', sk: 'outline', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#A16207', d: '#422006', hs2: '#FCD34D' } },
    { id: 'orchid', name: 'Orchid', lay: 'lcol', lh: 'pill', hd: 'boxed', sk: 'solid', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#A21CAF' } },
    { id: 'deepsea', name: 'Deep Sea', lay: 'lcol', lh: 'line', hd: 'diag', sk: 'checks', f: ['montserrat', 'montserrat', 'opensans'], p: { a: '#0C4A6E' } },
    { id: 'olivegrove', name: 'Olive Grove', lay: 'lcol', lh: 'num', hd: 'under', sk: 'dots', f: ['sourcesans', 'sourcesans', 'sourcesans'], p: { a: '#4D7C0F' } },
    { id: 'pinstripe', name: 'Pinstripe', lay: 'lcol', lh: 'tab', hd: 'right', sk: 'square', deco: ['frame'], f: ['garamond', 'garamond', 'garamond'], bs: 14, p: { a: '#1E3A8A' }, photo: false },
    // timeline
    { id: 'milestone', name: 'Milestone', lay: 'tl', tl: 'ring', hd: 'plain', hs: 'under', f: ['lato', 'lato', 'lato'], p: { a: '#0E7490' } },
    { id: 'journey', name: 'Journey', lay: 'tl', tl: 'pill', hd: 'band', hs: 'pill', f: ['poppins', 'poppins', 'poppins'], nw: 600, p: { a: '#5B21B6', d: '#2E1065', hs2: '#C4B5FD' } },
    { id: 'pathway', name: 'Pathway', lay: 'tl', tl: 'sq', hd: 'center', hs: 'double', sk: 'outline', f: ['playfair', 'playfair', 'lato'], p: { a: '#BE123C' } },
    { id: 'progress', name: 'Progress', lay: 'tl', tl: 'pill ring', hd: 'badge', hs: 'dash', f: ['nunito', 'nunito', 'nunito'], p: { a: '#15803D' } },
    { id: 'heritage', name: 'Heritage', lay: 'tl', hd: 'minimal', hs: 'liner', sk: 'inline', f: ['garamond', 'garamond', 'garamond'], bs: 14, p: { a: '#92400E' }, photo: false },
    { id: 'roadmap', name: 'Roadmap', lay: 'tl', tl: 'pill sq', hd: 'diag', hs: 'num', f: ['montserrat', 'montserrat', 'opensans'], p: { a: '#1D4ED8' } },
    { id: 'chapter', name: 'Chapter', lay: 'tl', tl: 'ring', hd: 'split2', hs: 'over', sk: 'solid', f: ['dmsans', 'dmsans', 'dmsans'], p: { a: '#0F766E' } },
    { id: 'momentum', name: 'Momentum', lay: 'tl', tl: 'pill', hd: 'wave', hs: 'tab', sk: 'outline', f: ['raleway', 'raleway', 'lato'], p: { a: '#E11D48', d: '#4C0519', hs2: '#FDA4AF' } }
  ];
  TP.addTemplates(MOD.map(make));

  /* ---------- ATS-friendly: the 20 designs that job-portal systems (ATS) read correctly ----------
     One column, normal reading order, name/email/phone kept whole, headings without wide letter spacing.
     Checked by extracting the text of each PDF the way those systems do. */
  var ATS = ['classic', 'classic-shade', 'ats', 'minimal', 'swiss', 'garamond', 'elegant', 'ocean', 'maroon', 'emerald', 'summit', 'meridian',
    'copper', 'ivory', 'atlas', 'horizon', 'protea', 'baobab', 'metro', 'stone', 'saffron', 'aurora'];
  TP.list.forEach(function (t) {
    t.tags = t.tags.filter(function (k) { return k !== 'ats'; });
    t.ats = ATS.indexOf(t.id) >= 0;
    if (t.ats) t.tags.push('ats');
  });
  TP.ATS = ATS;
  window.CVTemplatesMod = { make: make, palette: palette, list: MOD };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/paginate.js */
try {
/* Lays a CV out on A4 pages: moves whole blocks to the next page instead of cutting them,
   then builds scaled page previews from the laid-out stage. */
(function () {
  'use strict';
  var PW = 794, PH = 1123;

  function fontsFor(t) {
    var keys = {}; keys[t.fonts.name] = 1; keys[t.fonts.head] = 1; keys[t.fonts.body] = 1;
    if (t.family === 'classic') { keys.pagella = 1; keys.carlito = 1; }
    var loads = [];
    Object.keys(keys).forEach(function (k) {
      (window.CV_FONTS[k] || [400]).forEach(function (w) {
        if (document.fonts && document.fonts.load) loads.push(document.fonts.load(w + ' 16px "F-' + k + '"').catch(function () {}));
      });
    });
    return Promise.all(loads).then(function () { return document.fonts ? document.fonts.ready : null; });
  }

  // stage: an unscaled, off-screen container that holds the real-size CV
  function getStage() {
    var s = document.getElementById('cv-stage');
    if (!s) {
      s = document.createElement('div');
      s.id = 'cv-stage';
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'position:absolute;left:-12000px;top:0;width:' + PW + 'px;overflow:visible;pointer-events:none;';
      document.body.appendChild(s);
    }
    return s;
  }

  function put(cv, tplId, opts) {
    var r = window.CVTemplates.render(cv, tplId, opts);
    var stage = getStage();
    stage.innerHTML = '<div class="' + r.cls + '" style="' + r.style + '">' + r.html + '</div>';
    return { r: r, root: stage.firstChild };
  }
  function layout(cv, tplId) {
    var x = put(cv, tplId, {}), opts = {};
    var t = x.r.tpl; // template with the CV's chosen colour and text size
    return waitImages(x.root).then(function () { return fontsFor(t); }).then(function () {
      // two-column designs: if the side column is much longer than the main one, move skills,
      // attributes and hobbies into the main column so both columns end at a similar height
      var side = x.root.querySelector('.col.side'), main = x.root.querySelector('.col.main');
      if (side && main && side.scrollHeight > main.scrollHeight + 40 && side.scrollHeight > PH - t.page.mb) {
        opts = { lite: true };
        x = put(cv, tplId, opts);
        return waitImages(x.root);
      }
    }).then(function () {
      var n = paginate(x.root, t);
      return { root: x.root, pages: n, tpl: t, opts: opts };
    });
  }

  function layoutDoc(r) {
    var stage = getStage();
    stage.innerHTML = '<div class="' + r.cls + '" style="' + r.style + '">' + r.html + '</div>';
    var root = stage.firstChild;
    return waitImages(root).then(function () { return fontsFor(r.tpl); }).then(function () {
      var n = paginate(root, r.tpl);
      if (r.footer) {
        for (var i = 0; i < n; i++) {
          var f = document.createElement('div');
          f.className = 'pg-foot';
          f.style.cssText = 'position:absolute;left:0;right:0;top:' + (i * PH + PH - (r.tpl.page.footAt || 40)) + 'px;';
          f.innerHTML = r.footer(i, n);
          root.appendChild(f);
        }
      }
      return { root: root, pages: n, tpl: r.tpl, opts: {} };
    });
  }

  function waitImages(root) {
    var imgs = root.querySelectorAll('img');
    return Promise.all(Array.prototype.map.call(imgs, function (im) {
      if (im.complete) return Promise.resolve();
      return new Promise(function (res) { im.onload = im.onerror = res; });
    }));
  }

  function paginate(root, t) {
    var mt = t.page.mt, mb = t.page.mb;
    var cols = root.querySelectorAll('.col');
    var base = root.getBoundingClientRect().top;
    function rel(el) { var r = el.getBoundingClientRect(); return { top: r.top - base, bottom: r.bottom - base, h: r.height }; }
    function pushTo(b, target) {
      var sp = document.createElement('div');
      sp.className = 'pg-spacer';
      sp.style.height = '0px';
      b.parentNode.insertBefore(sp, b);
      var h = 0;
      for (var k = 0; k < 4; k++) {
        var d = target - rel(b).top;
        if (Math.abs(d) < 0.25) break;
        h = Math.max(0, h + d);
        sp.style.height = h + 'px';
      }
    }
    Array.prototype.forEach.call(cols, function (col) {
      var blocks = Array.prototype.slice.call(col.querySelectorAll('.blk'));
      for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i], r = rel(b);
        if (r.h <= 0) continue;
        var page = Math.floor(r.top / PH), pageTop = page * PH;
        if (page > 0 && r.top < pageTop + mt - 0.5) { pushTo(b, pageTop + mt); r = rel(b); page = Math.floor(r.top / PH); pageTop = page * PH; }
        var limit = pageTop + PH - mb;
        var bottom = r.bottom;
        if (b.classList.contains('kwn') && blocks[i + 1]) {
          var nx = rel(blocks[i + 1]);
          if (nx.h < PH / 3) bottom = Math.max(bottom, nx.bottom);
        }
        if (bottom > limit + 0.5 && r.h < PH - mt - mb) pushTo(b, (page + 1) * PH + mt);
      }
    });
    var maxBottom = 0;
    Array.prototype.forEach.call(root.querySelectorAll('.blk'), function (b) { var r = rel(b); if (r.h > 0) maxBottom = Math.max(maxBottom, r.bottom); });
    var n = Math.max(1, Math.ceil((maxBottom - 2) / PH));
    root.style.height = (n * PH) + 'px';
    root.style.overflow = 'hidden';
    return n;
  }

  function decorHTML(t, i) {
    return window.CVTemplates.decor(t, i).map(function (d) {
      if (d.path) return '<svg style="position:absolute;left:0;top:0;width:' + PW + 'px;height:' + PH + 'px" viewBox="0 0 ' + PW + ' ' + PH + '"><path d="' + d.path + '" fill="' + d.fill + '"' + (d.op != null ? ' fill-opacity="' + d.op + '"' : '') + '/></svg>';
      var s = 'position:absolute;left:' + d.x + 'px;top:' + d.y + 'px;width:' + d.w + 'px;height:' + d.h + 'px;';
      if (d.r) s += 'border-radius:' + d.r + 'px;';
      if (d.op != null) s += 'opacity:' + d.op + ';';
      if (d.fill) s += 'background:' + d.fill + ';';
      if (d.stroke) s += 'border:' + d.sw + 'px solid ' + d.stroke + ';box-sizing:border-box;';
      return '<div style="' + s + '"></div>';
    }).join('');
  }

  // Build preview pages (scaled clones of the stage)
  function renderPages(result, container, width) {
    var scale = width / PW;
    container.innerHTML = '';
    for (var i = 0; i < result.pages; i++) {
      var outer = document.createElement('div');
      outer.className = 'pg-sheet';
      outer.style.width = Math.round(PW * scale) + 'px';
      outer.style.height = Math.round(PH * scale) + 'px';
      var inner = document.createElement('div');
      inner.className = 'sheet-in';
      inner.style.cssText = 'position:absolute;left:0;top:0;width:' + PW + 'px;height:' + PH + 'px;overflow:hidden;background:#fff;transform-origin:0 0;transform:scale(' + scale + ')';
      inner.innerHTML = decorHTML(result.tpl, i);
      var clone = result.root.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = '0';
      clone.style.top = (-i * PH) + 'px';
      inner.appendChild(clone);
      outer.appendChild(inner);
      var no = document.createElement('div');
      no.className = 'pg-no';
      no.textContent = 'Page ' + (i + 1) + ' of ' + result.pages;
      container.appendChild(outer);
      container.appendChild(no);
    }
  }

  // Thumbnail of the first page only (no pagination needed)
  function thumb(cv, tplId, width, plain) {
    var r = window.CVTemplates.render(cv, tplId, { plain: !!plain });
    var scale = width / PW;
    return '<div class="thumb" style="width:' + Math.round(PW * scale) + 'px;height:' + Math.round(PH * scale) + 'px">' +
      '<div style="position:absolute;left:0;top:0;width:' + PW + 'px;height:' + PH + 'px;overflow:hidden;background:#fff;transform-origin:0 0;transform:scale(' + scale + ')">' +
      decorHTML(r.tpl, 0) + '<div class="' + r.cls + '" style="' + r.style + ';position:absolute;left:0;top:0">' + r.html + '</div></div></div>';
  }

  window.CVPaginate = { layout: layout, layoutDoc: layoutDoc, renderPages: renderPages, thumb: thumb, decorHTML: decorHTML, PW: PW, PH: PH, fontsFor: fontsFor };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/libs.js */
try {
/* The big libraries (pdf-lib + fontkit for PDFs, JSZip for Word files) are about 560 KB.
   On the website they load after the first screen appears (web/finish.py takes their tags out of the page),
   and every function that needs them waits for them first. In the Android app they are already on the page,
   so waiting costs nothing. */
(function () {
  'use strict';
  var SETS = {
    pdf: [['PDFLib', 'js/lib/pdf-lib.min.js'], ['fontkit', 'js/lib/fontkit.umd.min.js']],
    zip: [['JSZip', 'js/lib/jszip.min.js']]
  };
  var loading = {};
  function load(src) {
    if (!loading[src]) {
      loading[src] = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.async = false;
        s.onload = function () { res(); };
        s.onerror = function () {
          delete loading[src]; if (s.parentNode) s.parentNode.removeChild(s);
          var A = window.App, msg = 'Part of CV Maker SA did not load. Check your internet connection and try again.';
          rej(new Error(A && A.T ? A.T(msg) : msg));
        };
        document.head.appendChild(s);
      });
    }
    return loading[src];
  }
  // need('pdf'), need('zip') or need('pdf zip'): resolves when those libraries are on the page
  function need(which) {
    var list = [];
    String(which || 'pdf zip').split(' ').forEach(function (k) {
      (SETS[k] || []).forEach(function (p) { if (!window[p[0]]) list.push(load(p[1])); });
    });
    return Promise.all(list).then(function () {});
  }
  // makes obj[name]() wait for the libraries before it runs (the functions already return promises)
  function wrap(obj, names, which) {
    names.forEach(function (n) {
      var fn = obj && obj[n]; if (typeof fn !== 'function') return;
      obj[n] = function () { var self = this, a = arguments; return need(which).then(function () { return fn.apply(self, a); }); };
    });
  }
  window.CVLibs = { need: need, wrap: wrap };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/pdf.js */
try {
/* Writes a real (vector, selectable-text) A4 PDF from the laid-out CV.
   It walks the page DOM and redraws every box, border, image, icon and line of text
   at the exact position the browser put it, using the same embedded fonts. */
(function () {
  'use strict';
  var PW = 794, PH = 1123;
  var A4W = 595.28, A4H = 841.89, S = A4W / PW;

  var fontBytesCache = {};
  function fontBytes(key, w) {
    var id = key + '-' + w;
    if (!fontBytesCache[id]) {
      fontBytesCache[id] = fetch(window.CVPdf.fontBase + id + '.ttf').then(function (r) {
        if (!r.ok) throw new Error('font ' + id);
        return r.arrayBuffer();
      });
    }
    return fontBytesCache[id];
  }
  function pickWeight(key, want) {
    var ws = (window.CV_FONTS[key] || [400]).slice().sort(function (a, b) { return a - b; });
    if (ws.indexOf(want) >= 0) return want;
    // CSS font matching: >=500 looks heavier first, otherwise lighter first
    var heavier = ws.filter(function (w) { return w > want; }), lighter = ws.filter(function (w) { return w < want; }).reverse();
    var order = want >= 500 ? heavier.concat(lighter) : lighter.concat(heavier);
    return order[0] || ws[0];
  }
  function familyKey(ff) {
    var m = /F-([a-z0-9]+)/i.exec(ff || '');
    return m && window.CV_FONTS[m[1]] ? m[1] : 'carlito';
  }
  function parseColor(s) {
    if (!s) return null;
    var m = /rgba?\(([^)]+)\)/.exec(s);
    if (!m) return null;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    var a = p.length > 3 ? p[3] : 1;
    if (a <= 0.001) return null;
    return { c: PDFLib.rgb(p[0] / 255, p[1] / 255, p[2] / 255), a: a };
  }
  function px(v) { return parseFloat(v) || 0; }

  function dataUrlBytes(url) {
    var m = /^data:([^;,]+)?(;base64)?,(.*)$/.exec(url);
    if (!m) return null;
    var bin = atob(m[3]);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return { type: m[1] || '', bytes: out };
  }

  async function makePdf(result, meta) {
    var L = window.PDFLib;
    var doc = await L.PDFDocument.create();
    doc.registerFontkit(window.fontkit);
    meta = meta || {};
    doc.setTitle(meta.title || 'Curriculum Vitae');
    if (meta.author) doc.setAuthor(meta.author);
    doc.setCreator('CV Maker SA');
    doc.setProducer('CV Maker SA by Tumelo Vincent Tau');
    doc.setSubject('Curriculum Vitae');

    var pages = [];
    for (var i = 0; i < result.pages; i++) pages.push(doc.addPage([A4W, A4H]));

    var root = result.root;
    var org = root.getBoundingClientRect();
    var ox = org.left, oy = org.top;

    var fonts = {};
    async function font(key, w) {
      var id = key + '-' + w;
      if (!fonts[id]) fonts[id] = doc.embedFont(await fontBytes(key, w), { subset: true });
      return fonts[id];
    }

    // baseline offset per font/size, measured by the browser itself
    var baseCache = {};
    var probeHost = document.createElement('div');
    probeHost.style.cssText = 'position:absolute;left:0;top:0;white-space:nowrap;font-kerning:none;font-synthesis:none;';
    root.appendChild(probeHost);
    function baseline(ff, fw, fs) {
      var id = ff + '|' + fw + '|' + fs;
      if (baseCache[id] != null) return baseCache[id];
      probeHost.innerHTML = '<span style="font-family:' + ff.replace(/"/g, "'") + ';font-weight:' + fw + ';font-size:' + fs + 'px;line-height:normal">Hxg<i style="display:inline-block;width:1px;height:0;vertical-align:baseline"></i></span>';
      var span = probeHost.firstChild, txt = span.firstChild, mark = span.lastChild;
      var rg = document.createRange(); rg.setStart(txt, 0); rg.setEnd(txt, 1);
      var off = mark.getBoundingClientRect().top - rg.getBoundingClientRect().top;
      baseCache[id] = off;
      return off;
    }

    // ---- primitive drawing (css px in, pdf points out) ----
    function pageAt(y) { return Math.max(0, Math.min(pages.length - 1, Math.floor(y / PH))); }
    function fillRect(x, y, w, h, col) {
      if (w <= 0 || h <= 0) return;
      var y0 = y, y1 = y + h;
      for (var p = pageAt(y0); p <= pageAt(y1 - 0.01); p++) {
        var a = Math.max(y0, p * PH), b = Math.min(y1, (p + 1) * PH);
        if (b - a <= 0) continue;
        pages[p].drawRectangle({ x: x * S, y: A4H - (b - p * PH) * S, width: w * S, height: (b - a) * S, color: col.c, opacity: col.a });
      }
    }
    // r: one radius, or [top-left, top-right, bottom-right, bottom-left]
    function roundPath(w, h, r) {
      var q = (Array.isArray(r) ? r : [r, r, r, r]).map(function (v) { return Math.max(0, Math.min(v, w / 2, h / 2)); });
      var a = q[0], b = q[1], c = q[2], d = q[3], K = 0.5523;
      return 'M' + a + ' 0 L' + (w - b) + ' 0 C' + (w - b + K * b) + ' 0 ' + w + ' ' + (b - K * b) + ' ' + w + ' ' + b +
        ' L' + w + ' ' + (h - c) + ' C' + w + ' ' + (h - c + K * c) + ' ' + (w - c + K * c) + ' ' + h + ' ' + (w - c) + ' ' + h +
        ' L' + d + ' ' + h + ' C' + (d - K * d) + ' ' + h + ' 0 ' + (h - d + K * d) + ' 0 ' + (h - d) +
        ' L0 ' + a + ' C0 ' + (a - K * a) + ' ' + (a - K * a) + ' 0 ' + a + ' 0 Z';
    }
    function shape(x, y, w, h, r, fill, stroke, sw) {
      var p = pageAt(y + h / 2), ly = y - p * PH;
      var opts = {};
      if (fill) { opts.color = fill.c; opts.opacity = fill.a; }
      if (stroke) { opts.borderColor = stroke.c; opts.borderWidth = sw * S; opts.borderOpacity = stroke.a; }
      if (Array.isArray(r)) { if (Math.max.apply(null, r) - Math.min.apply(null, r) < 0.5) r = r[0]; }
      if (!Array.isArray(r) && r >= Math.min(w, h) / 2 - 0.5 && Math.abs(w - h) < 1) {
        opts.x = (x + w / 2) * S; opts.y = A4H - (ly + h / 2) * S; opts.xScale = (w / 2) * S; opts.yScale = (h / 2) * S;
        pages[p].drawEllipse(opts);
      } else {
        opts.x = x * S; opts.y = A4H - ly * S; opts.scale = S;
        pages[p].drawSvgPath(roundPath(w, h, r), opts);
      }
    }
    function clipOps(x, y, w, h, r) { // returns operators building a clip path (pdf coords)
      var X = x * S, Y = A4H - (y + h) * S, W = w * S, H = h * S, R = Math.min(r * S, W / 2, H / 2), k = 0.5523 * R;
      return [L.moveTo(X + R, Y), L.lineTo(X + W - R, Y), L.appendBezierCurve(X + W - R + k, Y, X + W, Y + R - k, X + W, Y + R),
        L.lineTo(X + W, Y + H - R), L.appendBezierCurve(X + W, Y + H - R + k, X + W - R + k, Y + H, X + W - R, Y + H),
        L.lineTo(X + R, Y + H), L.appendBezierCurve(X + R - k, Y + H, X, Y + H - R + k, X, Y + H - R),
        L.lineTo(X, Y + R), L.appendBezierCurve(X, Y + R - k, X + R - k, Y, X + R, Y), L.closePath(), L.clip(), L.endPath()];
    }

    function radiusOf(cs, w, h) {
      var v = cs.borderTopLeftRadius || '0';
      if (/%/.test(v)) return px(v) / 100 * Math.min(w, h);
      return px(v);
    }
    // all four corners [top-left, top-right, bottom-right, bottom-left]
    function radiiOf(cs, w, h) {
      return ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'].map(function (k) {
        var v = cs[k] || '0'; return /%/.test(v) ? px(v) / 100 * Math.min(w, h) : px(v);
      });
    }

    var images = [];
    var texts = [];

    function walk(el, blk) {
      if (el === probeHost) return;
      if (el.classList && el.classList.contains('blk')) blk = el;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (el.classList && el.classList.contains('pg-spacer')) return;
      var rc = el.getBoundingClientRect();
      var x = rc.left - ox, y = rc.top - oy, w = rc.width, h = rc.height;
      var tag = el.tagName.toLowerCase();
      if (w > 0 && h > 0) {
        var r = radiusOf(cs, w, h), rr = radiiOf(cs, w, h), rmax = Math.max.apply(null, rr);
        var bg = parseColor(cs.backgroundColor);
        var bw = [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)];
        var bs = [cs.borderTopStyle, cs.borderRightStyle, cs.borderBottomStyle, cs.borderLeftStyle];
        var bc = [parseColor(cs.borderTopColor), parseColor(cs.borderRightColor), parseColor(cs.borderBottomColor), parseColor(cs.borderLeftColor)];
        var has = function (i) { return bw[i] > 0 && bs[i] !== 'none' && bs[i] !== 'hidden' && bc[i]; };
        if (rmax > 0.5) {
          if (bg && tag !== 'img') shape(x, y, w, h, rr, bg, null, 0);
          if (has(0) && bw[0] === bw[1] && bw[0] === bw[2] && bw[0] === bw[3] && tag !== 'img') shape(x + bw[0] / 2, y + bw[0] / 2, w - bw[0], h - bw[0], rr.map(function (v) { return Math.max(0, v - bw[0] / 2); }), null, bc[0], bw[0]);
        } else {
          if (bg && tag !== 'img') fillRect(x, y, w, h, bg);
          if (has(0)) fillRect(x, y, w, bw[0], bc[0]);
          if (has(2)) fillRect(x, y + h - bw[2], w, bw[2], bc[2]);
          if (has(3)) fillRect(x, y, bw[3], h, bc[3]);
          if (has(1)) fillRect(x + w - bw[1], y, bw[1], h, bc[1]);
        }
        if (tag === 'img') { images.push({ el: el, x: x, y: y, w: w, h: h, r: r, bw: bw[0], bc: has(0) ? bc[0] : null }); return; }
        if (tag === 'svg') {
          var path = el.querySelector('path');
          if (path) {
            var vb = (el.getAttribute('viewBox') || '0 0 24 24').split(/\s+/).map(parseFloat);
            var col = parseColor(getComputedStyle(path).fill) || parseColor(cs.color);
            var p = pageAt(y + h / 2);
            if (col) pages[p].drawSvgPath(path.getAttribute('d'), { x: x * S, y: A4H - (y - p * PH) * S, scale: (w / vb[2]) * S, color: col.c, opacity: col.a });
          }
          return;
        }
      }
      // leader (dots or spaces between a label and its value): drawn as real characters up to the box's right edge,
      // so the label and the value read as one line in job-portal systems (ATS)
      var lead = el.classList && el.classList.contains('lead') ? { l: rc.left - ox, r: rc.right - ox } : null;
      for (var c = el.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) texts.push({ node: c, cs: cs, clip: lead, blk: blk || null });
        else if (c.nodeType === 1) walk(c, blk);
      }
    }

    // ---- page decoration first (behind) ----
    for (var pi = 0; pi < pages.length; pi++) {
      window.CVTemplates.decor(result.tpl, pi).forEach(function (d) {
        var op = d.op != null ? d.op : 1;
        // shapes: a path in page coordinates, or a box with rounded corners / a circle
        if (d.path) { var pc = parseColor(hexToRgb(d.fill)); pages[pi].drawSvgPath(d.path, { x: 0, y: A4H, scale: S, color: pc.c, opacity: op }); return; }
        if (d.r && d.fill) {
          var rc = parseColor(hexToRgb(d.fill));
          if (d.r >= Math.min(d.w, d.h) / 2 - 0.5 && Math.abs(d.w - d.h) < 1) pages[pi].drawEllipse({ x: (d.x + d.w / 2) * S, y: A4H - (d.y + d.h / 2) * S, xScale: d.w / 2 * S, yScale: d.h / 2 * S, color: rc.c, opacity: op });
          else pages[pi].drawSvgPath(roundPath(d.w, d.h, d.r), { x: d.x * S, y: A4H - d.y * S, scale: S, color: rc.c, opacity: op });
          return;
        }
        if (d.fill && op < 1) { var oc = parseColor(hexToRgb(d.fill)); pages[pi].drawRectangle({ x: d.x * S, y: A4H - (d.y + d.h) * S, width: d.w * S, height: d.h * S, color: oc.c, opacity: op }); return; }
        if (d.fill) { var c = parseColor(hexToRgb(d.fill)); pages[pi].drawRectangle({ x: d.x * S, y: A4H - (d.y + d.h) * S, width: d.w * S, height: d.h * S, color: c.c }); }
        if (d.stroke) { var s = parseColor(hexToRgb(d.stroke)), sw = d.sw * S; pages[pi].drawRectangle({ x: d.x * S + sw / 2, y: A4H - (d.y + d.h) * S + sw / 2, width: d.w * S - sw, height: d.h * S - sw, borderColor: s.c, borderWidth: sw }); }
      });
    }

    walk(root);

    // ---- images ----
    for (var ii = 0; ii < images.length; ii++) {
      var im = images[ii];
      var src = im.el.currentSrc || im.el.src;
      var data = /^data:/.test(src) ? dataUrlBytes(src) : null;
      if (!data) continue;
      var emb;
      try { emb = /png/i.test(data.type) ? await doc.embedPng(data.bytes) : await doc.embedJpg(data.bytes); } catch (e) { continue; }
      var pg = pages[pageAt(im.y + im.h / 2)], ly = im.y - pageAt(im.y + im.h / 2) * PH;
      pg.pushOperators(L.pushGraphicsState());
      pg.pushOperators.apply(pg, clipOps(im.x, ly, im.w, im.h, im.r));
      pg.drawImage(emb, { x: im.x * S, y: A4H - (ly + im.h) * S, width: im.w * S, height: im.h * S });
      pg.pushOperators(L.popGraphicsState());
      if (im.bc && im.bw > 0) shape(im.x + im.bw / 2, im.y + im.bw / 2, im.w - im.bw, im.h - im.bw, Math.max(0, im.r - im.bw / 2), null, im.bc, im.bw);
    }

    // ---- text ----
    var range = document.createRange(), pieces = [];
    for (var ti = 0; ti < texts.length; ti++) {
      var t = texts[ti], node = t.node, cs = t.cs, str = node.nodeValue, clip = t.clip;
      if (clip == null && !/\S/.test(str)) continue;
      var col = parseColor(cs.color);
      if (!col) continue;
      var fs = px(cs.fontSize), fwRaw = parseInt(cs.fontWeight, 10) || 400;
      var key = familyKey(cs.fontFamily), fw = pickWeight(key, fwRaw);
      var pdfFont = await font(key, fw);
      var asc = baseline(cs.fontFamily, cs.fontWeight, fs);
      var upper = cs.textTransform === 'uppercase';
      var ls = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing);
      var underline = /underline/.test(cs.textDecorationLine || cs.textDecoration || '');
      var lines = [], cur = null;
      for (var i2 = 0; i2 < str.length; i2++) {
        var ch = str.charAt(i2);
        // keep surrogate pairs together
        var len = (ch >= '\uD800' && ch <= '\uDBFF') ? 2 : 1;
        range.setStart(node, i2); range.setEnd(node, i2 + len);
        var rr = range.getClientRects();
        var rect = rr.length ? rr[0] : null;
        var piece = str.substr(i2, len);
        i2 += len - 1;
        if (!rect) continue;
        if (clip != null) { // leader: every character kept (spaces too), none past the box edge
          var top0 = rect.top - oy, left0 = rect.left - ox;
          if (left0 < clip.l - 0.5 || rect.right - ox > clip.r + 0.5 || rect.width < 0.01) continue;
          if (!cur) { cur = { top: top0, left: left0, right: left0, s: '', xs: [], cs: [], keep: true }; lines.push(cur); }
          var g0 = piece === '\u00a0' ? ' ' : piece; cur.s += g0; cur.xs.push(left0); cur.cs.push(g0);
          cur.left = Math.min(cur.left, left0); cur.right = Math.max(cur.right, rect.right - ox);
          continue;
        }
        var ws = /\s/.test(piece);
        if (ws && rect.width < 0.01) continue;
        var top = rect.top - oy, left = rect.left - ox;
        if (!cur || Math.abs(top - cur.top) > fs * 0.5 || left < cur.right - 1) {
          if (ws) continue;
          cur = { top: top, left: left, right: left, s: '', xs: [], cs: [] };
          lines.push(cur);
        }
        if (ws) { if (cur.s.slice(-1) !== ' ') { cur.s += ' '; cur.xs.push(left); cur.cs.push(' '); } }
        else { var g = upper ? piece.toUpperCase() : piece; cur.s += g; cur.xs.push(left); cur.cs.push(g); }
        cur.right = rect.right - ox;
      }
      for (var li = 0; li < lines.length; li++) {
        var ln = lines[li];
        var s2 = ln.keep ? ln.s : ln.s.replace(/\s+$/, '');
        if (!s2) continue;
        var p2 = pageAt(ln.top + fs / 2), ly2 = ln.top - p2 * PH;
        pieces.push({ s: s2, p: p2, top: ly2, left: ln.left, right: ln.right, by: A4H - (ly2 + asc) * S, asc: asc, fs: fs, ls: ls,
          font: pdfFont, col: col, underline: underline, blk: t.blk, lead: clip != null });
      }
    }

    // ATS-friendly templates: a wide empty gap inside one row (label ... value, job title ... dates) is filled with
    // ordinary spaces. They are invisible, but systems that rebuild lines from the page (ATS layout readers) then read
    // the row as one line instead of moving the right-hand part somewhere else.
    var fill = {};
    if (result.tpl && result.tpl.ats) {
      var rows = [];
      pieces.forEach(function (pc, i) {
        if (!pc.blk) return;
        var g = null;
        for (var k = 0; k < rows.length && !g; k++) {
          var r0 = rows[k][0];
          if (r0.p !== pc.p || r0.blk !== pc.blk) continue;
          var ov = Math.min(r0.top + r0.fs, pc.top + pc.fs) - Math.max(r0.top, pc.top);
          if (ov > 0.5 * Math.min(r0.fs, pc.fs) && Math.max(r0.fs, pc.fs) / Math.min(r0.fs, pc.fs) < 1.4) g = rows[k];
        }
        pc.i = i;
        if (g) g.push(pc); else rows.push([pc]);
      });
      var edge = new Map(); // left edge of each block's content
      function blkLeft(b) {
        if (!edge.has(b)) { var bc = getComputedStyle(b); edge.set(b, b.getBoundingClientRect().left - ox + px(bc.paddingLeft) + px(bc.borderLeftWidth)); }
        return edge.get(b);
      }
      rows.forEach(function (row) {
        row.sort(function (a, b) { return a.left - b.left; });
        // a centred line (headings) starts from the block's left edge too, so it is read before the lines under it
        var f0 = row[0], lead0 = f0.left - blkLeft(f0.blk);
        if (lead0 > 2 * f0.fs && !f0.lead) {
          var adv0 = f0.font.widthOfTextAtSize(' ', f0.fs);
          if (adv0 > 0) { var n0 = Math.max(1, Math.round(lead0 / adv0)); f0.pre = { x: f0.left - lead0, n: n0, tc: (lead0 - n0 * adv0) / n0 }; }
        }
        if (row.length < 2) return;
        for (var k = 0; k + 1 < row.length; k++) {
          var a = row[k], b = row[k + 1], gap = b.left - a.right;
          if (gap < 0.6 * a.fs) continue;
          var adv = a.font.widthOfTextAtSize(' ', a.fs);
          if (!(adv > 0)) continue;
          var n = Math.max(1, Math.round(gap / adv));
          (fill[a.i] = fill[a.i] || []).push({ x: a.right, n: n, tc: (gap - n * adv) / n });
        }
      });
    }

    pieces.forEach(function (pc, i) {
      var pgx = pages[pc.p];
      if (pc.pre) {
        pgx.pushOperators(L.setCharacterSpacing(pc.pre.tc * S));
        pgx.drawText(new Array(pc.pre.n + 1).join(' '), { x: pc.pre.x * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
        pgx.pushOperators(L.setCharacterSpacing(0));
      }
      if (pc.ls > 0.05) {
        // spaced-out text (headings) stays one piece of text, using the PDF's own character spacing,
        // so job-portal systems (ATS) read "WORK EXPERIENCE" and not "W O R K  E X P E R I E N C E"
        pgx.pushOperators(L.setCharacterSpacing(pc.ls * S));
        pgx.drawText(pc.s, { x: pc.left * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
        pgx.pushOperators(L.setCharacterSpacing(0));
      } else {
        pgx.drawText(pc.s, { x: pc.left * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
      }
      (fill[i] || []).forEach(function (f) {
        pgx.pushOperators(L.setCharacterSpacing(f.tc * S));
        pgx.drawText(new Array(f.n + 1).join(' '), { x: f.x * S, y: pc.by, size: pc.fs * S, font: pc.font, color: pc.col.c, opacity: pc.col.a });
        pgx.pushOperators(L.setCharacterSpacing(0));
      });
      if (pc.underline) {
        var uy = pc.top + pc.asc + Math.max(1, pc.fs * 0.11);
        fillRect(pc.left, pc.p * PH + uy, pc.right - pc.left, Math.max(0.8, pc.fs * 0.055), pc.col);
      }
    });
    probeHost.remove();
    return doc.save();
  }

  function hexToRgb(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(h);
    if (!m) return h;
    var n = parseInt(m[1], 16);
    return 'rgb(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ')';
  }

  window.CVPdf = { make: makePdf, fontBase: 'fonts/' };
  if (window.CVLibs) window.CVLibs.wrap(window.CVPdf, ['make'], 'pdf');
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/files.js */
try {
/* Supporting documents: on-phone file store (IndexedDB), photo/PDF import, and the "CV + documents" PDF */
(function () {
  'use strict';
  function tr(s, vars) { var A = window.App; if (A && A.T) return A.T(s, vars); Object.keys(vars || {}).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); }); return s; }

  /* ---------- file store ---------- */
  var DBNAME = 'cvmaker-files', STORE = 'files';
  var dbp = null, memory = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      if (!window.indexedDB) { rej(new Error('no indexedDB')); return; }
      var rq = indexedDB.open(DBNAME, 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore(STORE); };
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { rej(rq.error || new Error('indexedDB open failed')); };
    }).catch(function (e) {
      memory = memory || {};
      Store.persistent = false;
      return null;
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      if (!d) return fn(null);
      return new Promise(function (res, rej) {
        var t = d.transaction(STORE, mode), st = t.objectStore(STORE), out;
        var r = fn(st);
        if (r) r.onsuccess = function () { out = r.result; };
        t.oncomplete = function () { res(out); };
        t.onerror = t.onabort = function () { rej(t.error || new Error('storage error')); };
      });
    });
  }
  var Store = {
    persistent: true,
    put: function (id, bytes) {
      return tx('readwrite', function (st) { if (!st) { memory[id] = bytes; return null; } return st.put(bytes, id); });
    },
    get: function (id) {
      return tx('readonly', function (st) { if (!st) return memory[id]; return st.get(id); }).then(function (v) {
        if (!v) return null;
        return v instanceof Uint8Array ? v : new Uint8Array(v);
      });
    },
    del: function (id) {
      return tx('readwrite', function (st) { if (!st) { delete memory[id]; return null; } return st.delete(id); });
    },
    keys: function () {
      return tx('readonly', function (st) { if (!st) return Object.keys(memory); return st.getAllKeys ? st.getAllKeys() : null; })
        .then(function (k) { return k || (memory ? Object.keys(memory) : []); });
    }
  };

  /* ---------- helpers ---------- */
  function uid() { return 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function readBytes(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(new Uint8Array(r.result)); };
      r.onerror = function () { rej(r.error); };
      r.readAsArrayBuffer(blob);
    });
  }
  function loadImage(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error('image')); };
      im.src = src;
    });
  }
  function bytesURL(bytes, mime) { return URL.createObjectURL(new Blob([bytes], { type: mime || 'image/jpeg' })); }
  function canvasBytes(cv, q) {
    return new Promise(function (res) {
      if (cv.toBlob) cv.toBlob(function (b) { readBytes(b).then(res); }, 'image/jpeg', q);
      else {
        var s = atob(cv.toDataURL('image/jpeg', q).split(',')[1]), u = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        res(u);
      }
    });
  }
  // grey "scanned document" look: greyscale, paper pushed to white, ink darkened
  function enhance(ctx, w, h) {
    var img = ctx.getImageData(0, 0, w, h), d = img.data, n = w * h, hist = new Uint32Array(256), i;
    for (i = 0; i < d.length; i += 4) { var g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0; d[i] = g; hist[g]++; }
    function pct(p) { var c = 0, t = n * p; for (var v = 0; v < 256; v++) { c += hist[v]; if (c >= t) return v; } return 255; }
    var lo = pct(0.02), hi = Math.max(lo + 30, pct(0.55) - 6);
    var lut = new Uint8ClampedArray(256);
    for (var v = 0; v < 256; v++) { var x = (v - lo) / (hi - lo); x = x < 0 ? 0 : (x > 1 ? 1 : x); lut[v] = Math.round(255 * Math.pow(x, 1.35)); }
    for (i = 0; i < d.length; i += 4) { var o = lut[d[i]]; d[i] = d[i + 1] = d[i + 2] = o; }
    ctx.putImageData(img, 0, 0);
  }
  // draw bytes onto a canvas, optionally rotated (deg), limited to maxSide, optionally enhanced
  function render(bytes, opt) {
    opt = opt || {};
    var url = bytesURL(bytes, opt.mime);
    return loadImage(url).then(function (im) {
      URL.revokeObjectURL(url);
      var rot = ((opt.rotate || 0) % 360 + 360) % 360, sx = 0, sy = 0, sw = im.naturalWidth, sh = im.naturalHeight;
      if (opt.crop) {
        sx = Math.round(opt.crop.x * im.naturalWidth); sy = Math.round(opt.crop.y * im.naturalHeight);
        sw = Math.max(1, Math.round(opt.crop.w * im.naturalWidth)); sh = Math.max(1, Math.round(opt.crop.h * im.naturalHeight));
      }
      var scale = Math.min(1, (opt.maxSide || 99999) / Math.max(sw, sh));
      var w = Math.max(1, Math.round(sw * scale)), h = Math.max(1, Math.round(sh * scale));
      var cv = document.createElement('canvas');
      cv.width = rot % 180 ? h : w; cv.height = rot % 180 ? w : h;
      var g = cv.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
      g.translate(cv.width / 2, cv.height / 2); g.rotate(rot * Math.PI / 180);
      g.drawImage(im, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (opt.enhance) enhance(g, cv.width, cv.height);
      return cv;
    });
  }
  function thumbOf(cv) {
    var s = Math.min(1, 240 / Math.max(cv.width, cv.height));
    var t = document.createElement('canvas');
    t.width = Math.max(1, Math.round(cv.width * s)); t.height = Math.max(1, Math.round(cv.height * s));
    t.getContext('2d').drawImage(cv, 0, 0, t.width, t.height);
    return t.toDataURL('image/jpeg', 0.7);
  }

  var GUESS = [
    [/\b(id|identity|smart.?card|green.?book)\b/i, 'Certified copy of ID'],
    [/matric|nsc|grade.?12|senior.?cert/i, 'Matric certificate (NSC)'],
    [/transcript|academic.?record|statement.?of.?results|results/i, 'Academic record'],
    [/degree|bachelor|honours|masters/i, 'Degree certificate'],
    [/diploma/i, 'Diploma certificate'],
    [/\bn[1-6]\b|nated|ncv|higher.?cert/i, 'Higher / N certificate'],
    [/licen[cs]e|driver/i, "Driver's licence"],
    [/address|municipal|utility|bill/i, 'Proof of address'],
    [/reference|testimonial|recommend/i, 'Reference letter'],
    [/police|clearance/i, 'Police clearance certificate']
  ];
  function guessType(name) {
    for (var i = 0; i < GUESS.length; i++) if (GUESS[i][0].test(name || '')) return GUESS[i][1];
    return '';
  }

  // turn a picked File into a stored document record
  function importFile(file) {
    var name = file.name || 'document';
    var isPdf = /pdf/i.test(file.type) || /\.pdf$/i.test(name);
    return readBytes(file).then(function (bytes) {
      if (isPdf) {
        if (bytes.length > 25 * 1024 * 1024) throw new Error(tr('{name} is larger than 25 MB', { name: name }));
        return PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false }).then(function (pdf) {
          var id = uid();
          return Store.put(id, bytes).then(function () {
            return { id: uid(), fileId: id, kind: 'pdf', type: guessType(name), name: name, pages: pdf.getPageCount(),
              size: bytes.length, locked: !!pdf.isEncrypted, enhance: false, added: Date.now() };
          });
        }, function () { throw new Error(tr('{name} could not be opened as a PDF', { name: name })); });
      }
      // photos: straighten size, re-save as JPEG (keeps files small)
      return importPart(bytes, file.type, name).then(function (part) {
        return { id: uid(), fileId: part.fileId, kind: 'image', type: guessType(name), name: name, pages: 1, parts: [part],
          w: part.w, h: part.h, size: part.size, thumb: part.thumb, enhance: false, added: Date.now() };
      });
    });
  }
  function importPart(bytes, mime, name) {
    return render(bytes, { mime: mime || 'image/jpeg', maxSide: 2000 }).then(function (cv) {
      return canvasBytes(cv, 0.85).then(function (jpg) {
        var id = uid();
        return Store.put(id, jpg).then(function () { return { fileId: id, w: cv.width, h: cv.height, size: jpg.length, thumb: thumbOf(cv) }; });
      });
    }, function () { throw new Error(tr('{name} could not be opened. Choose a JPG, PNG or PDF file.', { name: name || tr('This file') })); });
  }
  function partsOf(doc) {
    if (doc.kind !== 'image') return [];
    if (!Array.isArray(doc.parts) || !doc.parts.length) doc.parts = [{ fileId: doc.fileId, w: doc.w, h: doc.h, size: doc.size, thumb: doc.thumb }];
    return doc.parts;
  }
  // keep the old single-page fields in step with page 1 (older app versions read them)
  function sync(doc) {
    var ps = partsOf(doc);
    if (!ps.length) return doc;
    doc.fileId = ps[0].fileId; doc.w = ps[0].w; doc.h = ps[0].h; doc.thumb = ps[0].thumb;
    doc.pages = ps.length; doc.size = ps.reduce(function (t, p) { return t + (p.size || 0); }, 0);
    return doc;
  }
  function fileIds(doc) { return doc.kind === 'image' ? partsOf(doc).map(function (p) { return p.fileId; }) : [doc.fileId]; }
  // add another photographed page to the same document (e.g. page 2 of an academic record)
  function addPage(doc, file) {
    return readBytes(file).then(function (bytes) { return importPart(bytes, file.type, file.name); }).then(function (part) {
      if (doc.enhance) return Store.get(part.fileId).then(function (b) { return render(b, { maxSide: 480, enhance: true }); }).then(function (cv) { part.thumb = thumbOf(cv); return part; });
      return part;
    }).then(function (part) { partsOf(doc).push(part); return sync(doc); });
  }
  function removePage(doc, j) {
    var ps = partsOf(doc), gone = ps.splice(j, 1)[0];
    sync(doc);
    return gone ? gone.fileId : null;
  }
  function movePage(doc, j, dir) {
    var ps = partsOf(doc), k = j + dir;
    if (k < 0 || k >= ps.length) return;
    var t = ps[j]; ps[j] = ps[k]; ps[k] = t; sync(doc);
  }
  function rewrite(doc, j, opt) {
    var part = partsOf(doc)[j || 0];
    return Store.get(part.fileId).then(function (bytes) {
      return render(bytes, opt).then(function (cv) {
        return canvasBytes(cv, 0.9).then(function (jpg) {
          return Store.put(part.fileId, jpg).then(function () {
            part.w = cv.width; part.h = cv.height; part.size = jpg.length;
            return render(jpg, { maxSide: 480, enhance: doc.enhance }).then(function (t) { part.thumb = thumbOf(t); sync(doc); return doc; });
          });
        });
      });
    });
  }
  // rotate one page 90 degrees clockwise (replaces the stored file)
  function rotate(doc, j) { return rewrite(doc, j, { rotate: 90 }); }
  // crop one page; r = {x, y, w, h} as fractions of the picture
  function crop(doc, j, r) { return rewrite(doc, j, { crop: r }); }
  function refreshThumb(doc) {
    var chain = Promise.resolve();
    partsOf(doc).forEach(function (part) {
      chain = chain.then(function () {
        return Store.get(part.fileId).then(function (bytes) {
          return render(bytes, { maxSide: 480, enhance: doc.enhance }).then(function (cv) { part.thumb = thumbOf(cv); });
        });
      });
    });
    return chain.then(function () { sync(doc); return doc; });
  }
  // image bytes of page j as they will go into the PDF
  function exportImage(doc, small, j) {
    var part = partsOf(doc)[j || 0] || {};
    return Store.get(part.fileId).then(function (bytes) {
      if (!bytes) throw new Error(tr('A document file is missing: {name}', { name: doc.type || doc.name }));
      if (!small && !doc.enhance) return bytes;
      return render(bytes, { maxSide: small ? 1400 : 2000, enhance: doc.enhance }).then(function (cv) { return canvasBytes(cv, small ? 0.62 : 0.85); });
    });
  }
  // finds the document (the bright paper or card) in a photo and suggests a crop box
  function detectCrop(doc, j) {
    var part = partsOf(doc)[j || 0];
    return Store.get(part.fileId).then(function (bytes) { return render(bytes, { maxSide: 180 }); }).then(function (cv) {
      var w = cv.width, h = cv.height, d = cv.getContext('2d').getImageData(0, 0, w, h).data, n = w * h;
      var g = new Uint8Array(n), hist = new Uint32Array(256), i;
      for (i = 0; i < n; i++) { var v = (d[i * 4] * 299 + d[i * 4 + 1] * 587 + d[i * 4 + 2] * 114) / 1000 | 0; g[i] = v; hist[v]++; }
      // Otsu threshold between paper and background
      var sum = 0; for (i = 0; i < 256; i++) sum += i * hist[i];
      var sB = 0, wB = 0, best = 0, th = 128;
      for (i = 0; i < 256; i++) {
        wB += hist[i]; if (!wB) continue; var wF = n - wB; if (!wF) break;
        sB += i * hist[i]; var mB = sB / wB, mF = (sum - sB) / wF, between = wB * wF * (mB - mF) * (mB - mF);
        if (between > best) { best = between; th = i; }
      }
      var seen = new Uint8Array(n), bestBox = null, bestArea = 0, stack = new Int32Array(n);
      for (i = 0; i < n; i++) {
        if (seen[i] || g[i] <= th) continue;
        var top = 0, area = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
        stack[top++] = i; seen[i] = 1;
        while (top) {
          var q = stack[--top], x = q % w, y = (q - x) / w; area++;
          if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          var nb = [q - 1, q + 1, q - w, q + w];
          for (var k = 0; k < 4; k++) {
            var r = nb[k];
            if (r < 0 || r >= n || seen[r] || g[r] <= th) continue;
            if ((k === 0 && x === 0) || (k === 1 && x === w - 1)) continue;
            seen[r] = 1; stack[top++] = r;
          }
        }
        if (area > bestArea) { bestArea = area; bestBox = [x0, y0, x1, y1]; }
      }
      if (!bestBox || bestArea < n * 0.08) return null;
      var m = 0.015, bx = Math.max(0, bestBox[0] / w - m), by = Math.max(0, bestBox[1] / h - m);
      var bw = Math.min(1, (bestBox[2] + 1) / w + m) - bx, bh = Math.min(1, (bestBox[3] + 1) / h + m) - by;
      if (bw > 0.96 && bh > 0.96) return null;
      return { x: bx, y: by, w: bw, h: bh };
    });
  }

  function letter(i) {
    var s = '';
    i = i + 1;
    while (i > 0) { var r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); }
    return s;
  }
  function label(doc, i) { return 'Annexure ' + letter(i) + ': ' + (doc.type || 'Supporting document'); }

  var fontCache = null;
  function labelFont() {
    if (!fontCache) fontCache = fetch((window.CVPdf ? window.CVPdf.fontBase : 'fonts/') + 'dmsans-400.ttf').then(function (r) { return r.arrayBuffer(); });
    return fontCache;
  }

  /* Build one PDF: the CV (bytes, optional) followed by every document as an annexure.
     opts: { labels: bool, small: bool, title, author } */
  function bundle(cvBytes, docs, opts) {
    opts = opts || {};
    var L = window.PDFLib, out, font;
    var bases = !cvBytes ? [] : (Array.isArray(cvBytes) ? cvBytes : [cvBytes]);
    return (bases.length === 1 ? L.PDFDocument.load(bases[0]) : L.PDFDocument.create()).then(function (d) {
      out = d;
      if (bases.length < 2) return;
      var ch = Promise.resolve();
      bases.forEach(function (b) {
        ch = ch.then(function () { return L.PDFDocument.load(b); }).then(function (src) { return out.copyPages(src, src.getPageIndices()); })
          .then(function (pages) { pages.forEach(function (p) { out.addPage(p); }); });
      });
      return ch;
    }).then(function () {
      out.registerFontkit(window.fontkit);
      return labelFont().then(function (fb) { return out.embedFont(fb, { subset: true }); });
    }).then(function (f) {
      font = f;
      var chain = Promise.resolve();
      docs.forEach(function (doc, i) {
        chain = chain.then(function () { return addDoc(doc, i); });
      });
      return chain;
    }).then(function () {
      if (opts.title) out.setTitle(opts.title);
      if (opts.author) out.setAuthor(opts.author);
      out.setCreator('CV Maker SA');
      out.setProducer('CV Maker SA by Tumelo Vincent Tau');
      return out.save({ useObjectStreams: true });
    });

    function addDoc(doc, i) {
      if (doc.kind === 'pdf') {
        return Store.get(doc.fileId).then(function (bytes) {
          if (!bytes) throw new Error(tr('A document file is missing: {name}', { name: doc.type || doc.name }));
          return L.PDFDocument.load(bytes, { ignoreEncryption: true });
        }).then(function (src) {
          return out.copyPages(src, src.getPageIndices());
        }).then(function (pages) {
          pages.forEach(function (p, k) {
            out.addPage(p);
            if (opts.labels && k === 0) stamp(p, label(doc, i));
          });
        });
      }
      var ch = Promise.resolve();
      partsOf(doc).forEach(function (part, j) { ch = ch.then(function () { return addPhotoPage(doc, i, j); }); });
      return ch;
    }
    function addPhotoPage(doc, i, j) {
      return exportImage(doc, opts.small, j).then(function (jpg) { return out.embedJpg(jpg); }).then(function (img) {
        var lab = opts.labels && j === 0;
        var land = img.width > img.height * 1.05;
        var W = land ? 841.89 : 595.28, H = land ? 595.28 : 841.89, M = 32, top = lab ? 30 : 0;
        var page = out.addPage([W, H]);
        var s = Math.min((W - 2 * M) / img.width, (H - 2 * M - top) / img.height);
        var w = img.width * s, h = img.height * s;
        page.drawImage(img, { x: (W - w) / 2, y: M + (H - 2 * M - top - h) / 2, width: w, height: h });
        if (lab) {
          page.drawText(label(doc, i), { x: M, y: H - M - 10, size: 10, font: font, color: L.rgb(0.25, 0.29, 0.27) });
          page.drawRectangle({ x: M, y: H - M - 18, width: W - 2 * M, height: 0.6, color: L.rgb(0.8, 0.83, 0.82) });
        }
      });
    }
    // small label in a white box at the top-left of the first page of a PDF document
    function stamp(page, text) {
      var sz = page.getSize(), size = 9, tw = font.widthOfTextAtSize(text, size);
      var x = 14, y = sz.height - 22;
      page.drawRectangle({ x: x - 5, y: y - 5, width: tw + 10, height: size + 9, color: L.rgb(1, 1, 1), opacity: 0.92 });
      page.drawText(text, { x: x, y: y, size: size, font: font, color: L.rgb(0.25, 0.29, 0.27) });
    }
  }

  function fmtSize(n) {
    if (n == null) return '';
    if (n < 1024 * 1024) return Math.max(1, Math.round(n / 1024)) + ' KB';
    return (n / 1024 / 1024).toFixed(1) + ' MB';
  }
  function estimate(docs, small) {
    return docs.reduce(function (t, d) {
      var sz = d.kind === 'pdf' ? d.size : partsOf(d).reduce(function (a, p) { return a + (p.size || 0); }, 0);
      return t + (d.kind === 'pdf' ? sz : Math.round(sz * (small ? 0.4 : (d.enhance ? 0.9 : 1))));
    }, 0);
  }

  window.CVFiles = {
    store: Store, importFile: importFile, rotate: rotate, crop: crop, detectCrop: detectCrop, addPage: addPage, removePage: removePage,
    movePage: movePage, partsOf: partsOf, fileIds: fileIds, sync: sync, refreshThumb: refreshThumb, bundle: bundle, letter: letter, label: label,
    fmtSize: fmtSize, estimate: estimate, bytesURL: bytesURL, exportImage: exportImage, ready: db
  };
  if (window.CVLibs) window.CVLibs.wrap(window.CVFiles, ['importFile', 'bundle'], 'pdf');
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/letter.js */
try {
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
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/z83.js */
try {
/* Z83 Application for Employment (public service, effective 01 January 2021), filled in from the CV.
   Field labels follow the gazetted form. */
(function () {
  'use strict';
  var D = window.CVData, TP = window.CVTemplates;
  var esc = TP.esc;

  var YN = ['disability', 'citizen', 'permit', 'convicted', 'pending', 'dismissed', 'discPending', 'resigned', 'discharged', 'business', 'relinquish', 'condition'];

  function get(cv) {
    if (!cv.z83) cv.z83 = { langs: null, edu: null };
    return cv.z83;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dmy(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; }
  function my(ym) { var m = /^(\d{4})-(\d{2})/.exec(ym || ''); return m ? m[2] + '/' + m[1].slice(2) : ''; }
  function months(w) {
    var a = /^(\d{4})-(\d{2})/.exec(w.start || ''), e = w.current ? null : /^(\d{4})-(\d{2})/.exec(w.end || '');
    if (!a) return 0;
    var now = new Date(), ey = e ? +e[1] : now.getFullYear(), em = e ? +e[2] : now.getMonth() + 1;
    return Math.max(0, (ey - +a[1]) * 12 + (em - +a[2]) + 1);
  }

  // answer for a field: what the person chose, otherwise a sensible value taken from the CV
  function auto(cv, k) {
    var p = cv.personal || {}, c = cv.contact || {};
    switch (k) {
      case 'disability': return !p.disability || /^(none|no)$/i.test(p.disability) ? 'No' : 'Yes';
      case 'citizen': return !p.nationality || /south african/i.test(p.nationality) ? 'Yes' : 'No';
      case 'nationality': return p.nationality && !/south african/i.test(p.nationality) && !/permanent/i.test(p.nationality) ? p.nationality : '';
      case 'convicted': return !p.criminalRecord || /^(none|no|no criminal record|clear)$/i.test(p.criminalRecord) ? 'No' : '';
      case 'pending': case 'dismissed': case 'discPending': case 'resigned': case 'discharged': case 'business': case 'condition': return 'No';
      case 'permit': case 'relinquish': return '';
      case 'expPrivate': {
        var m = (cv.work || []).reduce(function (t, w) { return t + months(w); }, 0);
        return m ? String(Math.round(m / 12 * 10) / 10).replace(/\.0$/, '') : '';
      }
      case 'expPublic': return '0';
      case 'prefLang': return 'English';
      case 'method': return c.email ? 'E-mail' : 'Telephone';
      case 'contactDetail': {
        var meth = val(cv, 'method');
        if (meth === 'E-mail') return c.email || '';
        if (meth === 'Post') return D.lines(c.postal || c.address).join(', ');
        return [c.phone, c.altPhone].filter(Boolean).join(' / ');
      }
      case 'currentStudy': {
        var t = (cv.tertiary || []).filter(function (x) { return x.status === 'In progress'; })[0];
        return t ? [t.institution, t.qualification].filter(Boolean).join(' - ') : '';
      }
      case 'start': return 'Immediately';
    }
    return '';
  }
  function val(cv, k) {
    var z = get(cv);
    return z[k] !== undefined && z[k] !== null ? z[k] : auto(cv, k);
  }
  function langs(cv) {
    var z = get(cv);
    if (Array.isArray(z.langs)) return z.langs;
    return D.languagesList(cv).slice(0, 4).map(function (l) { return { name: l.name, speak: 'Good', write: 'Good' }; });
  }
  function quals(cv) {
    var out = (cv.tertiary || []).filter(function (t) { return (t.qualification || t.institution) && t.status !== 'In progress'; })
      .map(function (t) { return { school: t.institution, qual: t.qualification, year: t.year }; });
    (cv.courses || []).filter(function (x) { return x.name; }).forEach(function (x) { out.push({ school: x.provider, qual: x.name, year: x.year }); });
    var s = cv.school || {};
    if (s.name || s.grade) out.push({ school: s.name, qual: s.grade, year: s.year });
    return out;
  }
  function jobs(cv) {
    return (cv.work || []).filter(function (w) { return w.company || w.position; }).map(function (w) {
      return { employer: w.company, post: w.position, from: my(w.start), to: w.current ? 'Current' : my(w.end), reason: w.current ? '' : (w.reason || ''),
        dur: !w.start && w.duration ? w.duration : '' };
    });
  }
  function refs(cv) { return (cv.references || []).filter(function (r) { return r.name; }); }

  // things the applicant still needs to fill in (the form must be complete)
  function missing(cv) {
    var out = [], z = get(cv), p = cv.personal || {};
    if (!z.position) out.push(['position', 'Position you are applying for']);
    if (!z.department) out.push(['department', 'Department that advertised the post']);
    if (!z.ref) out.push(['ref', 'Reference number from the advert']);
    if (!p.surname || !p.firstNames) out.push(['name', 'Surname and full names (in your CV)']);
    if (!p.idNumber && !z.passport) out.push(['idNumber', 'ID number (in your CV) or passport number']);
    if (!p.race) out.push(['race', 'Race (in your CV)']);
    if (!p.gender) out.push(['gender', 'Gender (in your CV)']);
    YN.forEach(function (k) {
      if (k === 'permit' && val(cv, 'citizen') !== 'No') return;
      if (k === 'relinquish' && val(cv, 'business') !== 'Yes') return;
      if (!val(cv, k)) out.push([k, QTEXT[k]]);
    });
    if (!refs(cv).length) out.push(['refs', 'At least one reference (in your CV)']);
    if (!cv.signature) out.push(['signature', 'Your signature']);
    if (!cv.initials) out.push(['initials', 'Your initials (each page must be initialled)']);
    return out;
  }

  var QTEXT = {
    disability: 'Do you have a disability?',
    citizen: 'Are you a South African citizen?',
    permit: 'Do you have a valid work permit? (only if non-South African)',
    convicted: 'Have you been convicted or found guilty of a criminal offence (including an admission of guilt)?',
    pending: 'Do you have any pending criminal case against you?',
    dismissed: 'Have you ever been dismissed for misconduct from the Public Service?',
    discPending: 'Do you have any pending disciplinary case against you?',
    resigned: 'Have you resigned from a recent job pending any disciplinary proceeding against you?',
    discharged: 'Have you been discharged or retired from the Public Service on grounds of Ill-health or on condition that your cannot be re-employed?',
    business: 'Are you conducting business with the State or are you a Director of a Public or Private company conducting business with the State?',
    relinquish: 'In the event that you are employed in the Public Service, will you immediately relinquish such business interests?',
    condition: 'If you were previously employed in the Public Service, is there any condition that prevents your reappointment?'
  };
  var DETAILS = { convicted: 'If yes (provide the details)', pending: 'If yes, (provide the details)', dismissed: 'If yes (provide the details)',
    discPending: 'If yes, (provide the details)', resigned: 'If yes, (please note that the provisions of the Public Service Act shall apply).',
    business: 'If yes, (provide the details)', condition: 'If yes, Provide the name of the previous employing department and indicate the nature of the condition.' };

  /* ---------- the form pages ---------- */
  function box(on) { return '<span class="zb">' + (on ? 'X' : '') + '</span>'; }
  function opts(list, chosen) {
    return '<span class="zopts">' + list.map(function (o) { return '<span class="zo">' + esc(o) + ' ' + box(chosen === o) + '</span>'; }).join('') + '</span>';
  }
  function row(label, value, cls) {
    return '<div class="blk zr' + (cls ? ' ' + cls : '') + '"><div class="zl">' + label + '</div><div class="zv">' + value + '</div></div>';
  }
  function txt(v) { return esc(v || ''); }
  function yn(cv, k) { return opts(['Yes', 'No'], val(cv, k)); }
  function head(letter, title, note) {
    return '<div class="blk kwn zh"><b>' + letter + '. ' + esc(title) + '</b>' + (note ? ' <span class="zn">' + esc(note) + '</span>' : '') + '</div>';
  }
  function table(cols, widths, rows, minRows) {
    var h = '<div class="blk zt kwn"><div class="ztr zth">' + cols.map(function (c, i) { return '<div class="ztc" style="width:' + widths[i] + '%">' + c + '</div>'; }).join('') + '</div></div>';
    var n = Math.max(rows.length, minRows || 0);
    for (var r = 0; r < n; r++) {
      var cells = rows[r] || cols.map(function () { return ''; });
      h += '<div class="blk zt"><div class="ztr">' + cells.map(function (c, i) { return '<div class="ztc" style="width:' + widths[i] + '%">' + esc(c || '') + '</div>'; }).join('') + '</div></div>';
    }
    return h;
  }

  function render(cv) {
    var p = cv.personal || {}, z = get(cv);
    var tpl = { id: 'z83', family: 'z83', fonts: { name: 'carlito', head: 'carlito', body: 'carlito' }, c: {}, page: { mt: 48, mb: 74, footAt: 50 },
      decor: function () { return []; } };
    var h = '<div class="col">';
    h += '<div class="blk zt-title"><div class="zt-l"><div class="zt-rsa">REPUBLIC OF SOUTH AFRICA</div><div class="zt-ae">APPLICATION FOR EMPLOYMENT</div></div>' +
      '<div class="zt-r"><div class="zt-z">Z83</div><div class="zt-eff">Effective 01 January 2021</div></div></div>';
    h += '<div class="blk zinfo"><div class="zi"><b>WHAT IS THE PURPOSE OF THIS FORM</b><span>To assist a government department in selecting a person for an advertised post.</span></div>' +
      '<div class="zi"><b>WHO SHOULD COMPLETE THIS FORM</b><span>Only persons wishing to apply for an advertised position in a government department.</span></div>' +
      '<div class="zi"><b>ADDITIONAL INFORMATION</b><span>This form requires basic information. Candidates who are selected for interviews will be requested to furnish additional certified information that may be required to make a final selection.</span></div></div>';
    h += '<div class="blk znotes"><b>SPECIAL NOTES</b><div class="zol">' + [
      'All information will be treated with the strictest confidentiality and will not be disclosed or used for any other purpose than to assess the suitability of a person, except in so far as it may be required and permitted by law. Your personal details must correspond with the details in your ID or passport.',
      'Passport number in the case of non-South Africans.',
      'This information is required to enable the department to comply with the Employment Equity Act, 1998.',
      'This information will only be taken into account if it directly relates to the requirements of the position.',
      'The Executive Authority shall consider the criminal record (s) against the nature of the job functions in line with internal information security and disciplinary code.',
      'The applicant may submit additional information separately where the space provided is not sufficient.',
      'Departments must accept certified documents that accompany the application(s) with certification that is up to 6 months, unless the advert prescribes a longer period.',
      'Each application for employment form must be duly signed and initialed by the applicant.'
    ].map(function (n, i) { return '<div class="zli"><span class="zlin">' + (i + 1) + ' \u2013</span><span>' + esc(n) + '</span></div>'; }).join('') + '</div></div>';

    h += head('A', 'THE ADVERTISED POST');
    h += row('Position for which you are applying (as advertised)', txt(z.position));
    h += row('Department where the position was advertised', txt(z.department));
    h += row('Reference number (as stated in the advert)', txt(z.ref));
    h += row('If you are offered the position, when can you start OR how much notice must you serve with your current employer?', txt(val(cv, 'start')));

    h += head('B', 'PERSONAL INFORMATION');
    h += row('Surname and Full names', txt([p.surname, p.firstNames].filter(Boolean).join(', ')));
    h += row('Date of Birth DD/MM/YY', txt(dmy(p.dob)));
    h += row('Identity Number', txt(String(p.idNumber || '').replace(/\s+/g, '')));
    h += row('Passport number', txt(z.passport));
    var race = /african/i.test(p.race || '') ? 'African' : (/^white/i.test(p.race || '') ? 'White' : (/coloured/i.test(p.race || '') ? 'Coloured' : (/indian/i.test(p.race || '') ? 'Indian' : (p.race ? 'Other' : ''))));
    h += row('Race', opts(['African', 'White', 'Coloured', 'Indian', 'Other'], race));
    h += row('Gender', opts(['Female', 'Male'], p.gender));
    h += row(QTEXT.disability, yn(cv, 'disability'));
    h += row(QTEXT.citizen, yn(cv, 'citizen'));
    h += row('If no, what is your nationality?', txt(val(cv, 'citizen') === 'No' ? val(cv, 'nationality') : ''));
    h += row(QTEXT.permit, val(cv, 'citizen') === 'No' ? yn(cv, 'permit') : opts(['Yes', 'No'], ''));
    ['convicted', 'pending', 'dismissed', 'discPending', 'resigned'].forEach(function (k) {
      h += row(QTEXT[k], yn(cv, k));
      h += row(DETAILS[k], txt(val(cv, k) === 'Yes' ? z[k + 'Details'] : ''), 'zsub');
    });
    h += row(QTEXT.discharged, yn(cv, 'discharged'));
    h += row(QTEXT.business, yn(cv, 'business'));
    h += row(DETAILS.business, txt(val(cv, 'business') === 'Yes' ? z.businessDetails : ''), 'zsub');
    h += row(QTEXT.relinquish, val(cv, 'business') === 'Yes' ? yn(cv, 'relinquish') : opts(['Yes', 'No'], ''));
    h += row('Please specify the total number of years of experience you have', '<span class="zpair"><span>Private Sector: <b>' + txt(val(cv, 'expPrivate')) + '</b></span><span>Public Sector: <b>' + txt(val(cv, 'expPublic')) + '</b></span></span>');
    h += row('If your profession or occupation requires official registration, provide date and particulars of registration', '<span class="zpair"><span>Date: <b>' + txt(z.regDate) + '</b></span><span>Reg. No: <b>' + txt(z.regNo) + '</b></span></span>');

    h += head('C', 'CONTACT DETAILS AND MEDIUM OF COMMUNICATIONS');
    h += row('Preferred language for correspondence', txt(val(cv, 'prefLang')));
    h += row('Method for correspondence', opts(['Post', 'E-mail', 'Fax', 'Telephone'], val(cv, 'method')));
    h += row('Contact details (in terms of the above)', txt(val(cv, 'contactDetail')));

    h += head('D', 'SOUTH AFRICAN OFFICIAL LANGUAGE PROFICIENCY', "(state 'good', 'fair', or 'poor')");
    h += table(['Languages (specify)', 'Speak', 'Write or read'], [50, 25, 25], langs(cv).map(function (l) { return [l.name, (l.speak || '').toLowerCase(), (l.write || '').toLowerCase()]; }), 3);

    h += head('E', 'FORMAL QUALIFICATION', '(from highest to the lowest)');
    h += table(['Name of School/Technical College', 'Name of qualification obtained', 'Year obtained'], [42, 42, 16], quals(cv).map(function (q) { return [q.school, q.qual, q.year]; }), 3);
    h += row('Current study (institution and qualification)', txt(val(cv, 'currentStudy')));

    h += head('F', 'WORK EXPERIENCE', '(Also attach a detailed CV)');
    h += table(['Employer (including current employer)', 'Post held', 'From MM/YY', 'To MM/YY', 'Reason for leaving'], [27, 21, 12, 12, 28],
      jobs(cv).map(function (j) { return [j.employer, j.post, j.from || j.dur, j.to, j.reason]; }), 3);
    h += row(QTEXT.condition, yn(cv, 'condition'));
    h += row(DETAILS.condition, txt(val(cv, 'condition') === 'Yes' ? z.conditionDetails : ''), 'zsub');

    h += head('G', 'REFERENCES');
    h += table(['Name', 'Relationship to you', 'Tel. No. (office hours)'], [40, 30, 30], refs(cv).map(function (r) { return [r.name, r.relationship, r.phone]; }), 3);

    h += '<div class="blk kwn zh"><b>DECLARATION</b></div>';
    h += '<div class="blk zdecl">I declare that all the information provided (including any attachments) is complete and correct to the best of my knowledge. ' +
      'I understand that any false information provided will result in my application being disqualified or disciplinary action taken against me if I am appointed.</div>';
    h += '<div class="blk zsig"><span class="zsl">Signature:</span><span class="zsv">' + (cv.signature ? '<img src="' + cv.signature + '" alt="">' : '') + '</span>' +
      '<span class="zsl">Date:</span><span class="zsv zsd">' + (cv.signature ? esc(dmy(today())) : '') + '</span></div>';
    h += '</div>';
    var footer = function (i, n) {
      return '<div class="zfoot"><span>Z83 (81/971431)</span><span class="zfr">Page ' + (i + 1) + ' of ' + n + '&nbsp;&nbsp;&nbsp;Initial ' +
        (cv.initials ? '<img class="zini" src="' + cv.initials + '" alt="">' : '<span class="zline"></span>') + '</span></div>';
    };
    return { cls: 'cv f-z83', style: '--ink:#000000', html: h, tpl: tpl, footer: footer };
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  window.CVZ83 = { get: get, val: val, auto: auto, langs: langs, quals: quals, jobs: jobs, missing: missing, render: render, QTEXT: QTEXT, DETAILS: DETAILS, YN: YN };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/docx.js */
try {
/* Builds a Word .docx file (Office Open XML) for every template family.
   Word does its own page layout, so each design is rebuilt from tables, borders and shading. */
(function () {
  'use strict';
  var D = window.CVData, TP = window.CVTemplates;
  var PGW = 11906, PGH = 16838; // A4 in twips
  function TW(px) { return Math.round(px * 15); }
  var SCALE = 1; // text size chosen in the design screen
  function HP(px) { return Math.round(px * 1.5 * SCALE); }
  function SZ(halfPts) { return Math.round(halfPts * SCALE); }
  function EMU(px) { return Math.round(px * 9525); }
  function hex(c) { return String(c || '#000000').replace('#', '').toUpperCase(); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  }

  /* ---------- tiny OOXML builder ---------- */
  function R(text, o) {
    o = o || {};
    var p = '';
    if (o.font) p += '<w:rFonts w:ascii="' + esc(o.font) + '" w:hAnsi="' + esc(o.font) + '" w:cs="' + esc(o.font) + '" w:eastAsia="' + esc(o.font) + '"/>';
    if (o.b) p += '<w:b/><w:bCs/>';
    if (o.i) p += '<w:i/><w:iCs/>';
    if (o.strike) p += '<w:strike/>';
    if (o.caps) p += '<w:caps/>';
    if (o.color) p += '<w:color w:val="' + hex(o.color) + '"/>';
    if (o.sp) p += '<w:spacing w:val="' + Math.round(o.sp) + '"/>';
    if (o.sz) p += '<w:sz w:val="' + o.sz + '"/><w:szCs w:val="' + o.sz + '"/>';
    if (o.u) p += '<w:u w:val="single"/>';
    var body = String(text == null ? '' : text).split(/(\t|\n)/).map(function (part) {
      if (part === '\t') return '<w:tab/>';
      if (part === '\n') return '<w:br/>';
      return part ? '<w:t xml:space="preserve">' + esc(part) + '</w:t>' : '';
    }).join('');
    return '<w:r>' + (p ? '<w:rPr>' + p + '</w:rPr>' : '') + body + '</w:r>';
  }
  function bdr(side, b) {
    return '<w:' + side + ' w:val="' + (b.val || 'single') + '" w:sz="' + (b.sz || 6) + '" w:space="' + (b.space == null ? 1 : b.space) + '" w:color="' + hex(b.color) + '"/>';
  }
  var FRAME = null; // when set, every paragraph built goes into this Word text frame
  function P(runs, o) {
    o = o || {};
    var p = '';
    if (o.keepNext) p += '<w:keepNext/>';
    if (o.keepLines) p += '<w:keepLines/>';
    if (o.pbb) p += '<w:pageBreakBefore/>';
    if (FRAME && !o.noFrame) p += FRAME;
    if (o.bdr) {
      p += '<w:pBdr>' + ['top', 'left', 'bottom', 'right'].map(function (s) { return o.bdr[s] ? bdr(s, o.bdr[s]) : ''; }).join('') + '</w:pBdr>';
    }
    if (o.shd) p += '<w:shd w:val="clear" w:color="auto" w:fill="' + hex(o.shd) + '"/>';
    if (o.tabs) p += '<w:tabs>' + o.tabs.map(function (t) { return '<w:tab w:val="' + (t.val || 'left') + '"' + (t.leader ? ' w:leader="' + t.leader + '"' : '') + ' w:pos="' + t.pos + '"/>'; }).join('') + '</w:tabs>';
    var sp = o.sp || {};
    if (sp.before != null || sp.after != null || sp.line != null) {
      p += '<w:spacing w:before="' + (sp.before || 0) + '" w:after="' + (sp.after || 0) + '"' +
        (sp.line ? ' w:line="' + sp.line + '" w:lineRule="' + (sp.rule || 'auto') + '"' : '') + '/>';
    }
    if (o.ind) p += '<w:ind w:left="' + (o.ind.left || 0) + '" w:right="' + (o.ind.right || 0) + '"' +
      (o.ind.hanging ? ' w:hanging="' + o.ind.hanging + '"' : '') + (o.ind.firstLine ? ' w:firstLine="' + o.ind.firstLine + '"' : '') + '/>';
    if (o.jc) p += '<w:jc w:val="' + o.jc + '"/>';
    if (o.rpr) p += '<w:rPr>' + o.rpr + '</w:rPr>';
    return '<w:p>' + (p ? '<w:pPr>' + p + '</w:pPr>' : '') + (Array.isArray(runs) ? runs.join('') : (runs || '')) + '</w:p>';
  }
  // table: cols = [twips...], rows = [{cells:[{c: xml, shd, bdr:{}, mar:{}, va, span}], h, hRule, cantSplit}]
  function TBL(cols, rows, o) {
    o = o || {};
    var w = cols.reduce(function (a, b) { return a + b; }, 0);
    var pr = '<w:tblW w:w="' + w + '" w:type="dxa"/>';
    if (o.jc) pr += '<w:jc w:val="' + o.jc + '"/>';
    pr += '<w:tblInd w:w="' + (o.ind || 0) + '" w:type="dxa"/>';
    pr += '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>';
    pr += '<w:tblLayout w:type="fixed"/>';
    var m = o.mar || { top: 0, left: 0, bottom: 0, right: 0 };
    pr += '<w:tblCellMar><w:top w:w="' + (m.top || 0) + '" w:type="dxa"/><w:left w:w="' + (m.left || 0) + '" w:type="dxa"/><w:bottom w:w="' + (m.bottom || 0) +
      '" w:type="dxa"/><w:right w:w="' + (m.right || 0) + '" w:type="dxa"/></w:tblCellMar>';
    pr += '<w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="1" w:noVBand="1"/>';
    var grid = '<w:tblGrid>' + cols.map(function (c) { return '<w:gridCol w:w="' + c + '"/>'; }).join('') + '</w:tblGrid>';
    var body = rows.map(function (row) {
      var trp = '';
      if (row.cantSplit) trp += '<w:cantSplit/>';
      if (row.h) trp += '<w:trHeight w:val="' + row.h + '" w:hRule="' + (row.hRule || 'atLeast') + '"/>';
      var ci = 0;
      var cells = row.cells.map(function (cell) {
        var span = cell.span || 1, cw = 0;
        for (var k = 0; k < span; k++) cw += cols[ci + k];
        ci += span;
        var tp = '<w:tcW w:w="' + cw + '" w:type="dxa"/>';
        if (span > 1) tp += '<w:gridSpan w:val="' + span + '"/>';
        if (cell.bdr) tp += '<w:tcBorders>' + ['top', 'left', 'bottom', 'right'].map(function (s) { return cell.bdr[s] ? bdr(s, cell.bdr[s]) : ''; }).join('') + '</w:tcBorders>';
        if (cell.shd) tp += '<w:shd w:val="clear" w:color="auto" w:fill="' + hex(cell.shd) + '"/>';
        if (cell.mar) {
          tp += '<w:tcMar>' + ['top', 'left', 'bottom', 'right'].map(function (s) { return cell.mar[s] != null ? '<w:' + s + ' w:w="' + cell.mar[s] + '" w:type="dxa"/>' : ''; }).join('') + '</w:tcMar>';
        }
        tp += '<w:vAlign w:val="' + (cell.va || 'top') + '"/>';
        var c = cell.c || '';
        if (!c || /<\/w:tbl>$/.test(c)) c += P('', { sp: { before: 0, after: 0, line: 20, rule: 'exact' }, rpr: '<w:sz w:val="2"/>' });
        return '<w:tc><w:tcPr>' + tp + '</w:tcPr>' + c + '</w:tc>';
      }).join('');
      return '<w:tr>' + (trp ? '<w:trPr>' + trp + '</w:trPr>' : '') + cells + '</w:tr>';
    }).join('');
    return '<w:tbl><w:tblPr>' + pr + '</w:tblPr>' + grid + body + '</w:tbl>';
  }
  var TINY = P('', { sp: { before: 0, after: 0, line: 20, rule: 'exact' }, rpr: '<w:sz w:val="2"/><w:szCs w:val="2"/>' });

  /* ---------- images ---------- */
  function photoRun(ctx, sizePx, shape, line) {
    if (!ctx.m.photo) return '';
    var id = ctx.addImage(ctx.m.photo);
    if (!id) return '';
    var e = EMU(sizePx);
    var ln = line ? '<a:ln w="' + EMU(line.w) + '"><a:solidFill><a:srgbClr val="' + hex(line.color) + '"/></a:solidFill></a:ln>' : '';
    var geom = shape === 'rounded' ? 'roundRect' : (shape === 'square' ? 'rect' : 'ellipse');
    var adj = geom === 'roundRect' ? '<a:avLst><a:gd name="adj" fmla="val 10000"/></a:avLst>' : '<a:avLst/>';
    var n = ++ctx.drawingId;
    return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + e + '" cy="' + e + '"/><wp:effectExtent l="0" t="0" r="0" b="0"/>' +
      '<wp:docPr id="' + n + '" name="Photo ' + n + '"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>' +
      '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="' + n + '" name="photo.jpg"/><pic:cNvPicPr/></pic:nvPicPr>' +
      '<pic:blipFill><a:blip r:embed="' + id + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + e + '" cy="' + e + '"/></a:xfrm><a:prstGeom prst="' + geom + '">' + adj + '</a:prstGeom>' + ln + '</pic:spPr></pic:pic>' +
      '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
  }
  // page-anchored rectangle (VML, understood by Word, LibreOffice and WPS) placed in a header so it repeats on every page
  function vmlRect(xPx, yPx, wPx, hPx, color, n) {
    var pt = function (v) { return (v * 0.75).toFixed(2) + 'pt'; };
    return '<w:r><w:pict><v:rect id="decor' + n + '" o:spid="_x0000_s10' + n + '" style="position:absolute;margin-left:' + pt(xPx) + ';margin-top:' + pt(yPx) +
      ';width:' + pt(wPx) + ';height:' + pt(hPx) + ';z-index:-' + (251658240 - n) + ';mso-position-horizontal-relative:page;mso-position-vertical-relative:page" fillcolor="#' + hex(color) +
      '" stroked="f"><w10:wrap anchorx="page" anchory="page"/></v:rect></w:pict></w:r>';
  }

  /* ---------- shared modern pieces ---------- */
  function fontSet(t) { var d = t.docx || {}; return { name: d.name || 'Calibri', head: d.head || 'Calibri', body: d.body || 'Calibri' }; }

  function heading(title, t, ctx, o) {
    o = o || {};
    var c = t.c, f = fontSet(t), hs = o.hs || t.hs || 'rule';
    var run = { font: f.head, b: true, sz: HP(o.size || 14), color: c.accent, caps: t.headUpper !== false, sp: TW(1.5) * 0.75 };
    var po = { keepNext: true, sp: { before: TW(o.before == null ? 22 : o.before), after: TW(10) } };
    if (hs === 'rule' || hs === 'short') po.bdr = { bottom: { sz: hs === 'short' ? 18 : 8, color: hs === 'short' ? c.accent : c.line, space: 4 } };
    if (hs === 'bar') po.bdr = { left: { sz: 36, color: c.accent, space: 8 } };
    if (hs === 'fill') { po.shd = c.accent; run.color = '#FFFFFF'; po.ind = { left: 100, right: 100 }; }
    if (hs === 'lines') { po.jc = 'center'; po.bdr = { bottom: { sz: 4, color: c.line, space: 3 } }; }
    if (t.id === 'bold') run.color = c.ink;
    if (t.id === 'elegant') { run.caps = false; run.sz = HP(16); }
    if (t.id === 'garamond') { run.b = false; run.sz = HP(15); run.sp = TW(3) * 0.75; }
    if (t.id === 'ats') { run.sz = HP(15); run.color = '#000000'; po.bdr = { bottom: { sz: 6, color: '#000000', space: 2 } }; }
    var runs = [];
    if (hs === 'dot') runs.push(R('■  ', { font: 'Arial', sz: HP(11), color: c.accent }));
    runs.push(R(title, run));
    return P(runs, po);
  }
  function entry(e, t, ctx, width, first) {
    var c = t.c, f = fontSet(t), out = '';
    var more = e.org || e.note || e.bullets.length || e.extra;
    out += P([R(e.title, { font: f.body, b: true, sz: HP(14), color: c.ink }), e.period ? R('\t' + e.period, { font: f.body, sz: HP(12), color: c.muted }) : ''],
      { keepNext: !!more, tabs: [{ val: 'right', pos: width }], sp: { before: first ? 0 : TW(12), after: 0 } });
    if (e.org) out += P(R(e.org, { font: f.body, sz: HP(13), color: c.accent2 }), { keepNext: !!(e.note || e.bullets.length || e.extra), sp: { after: 0 } });
    if (e.note) out += P(R(e.note, { font: f.body, sz: HP(12), color: c.muted }), { keepNext: !!(e.bullets.length || e.extra), sp: { before: 30, after: 0 } });
    e.bullets.forEach(function (b, i) { out += bullet(b, t, i === 0 ? 60 : 30); });
    if (e.extra) out += P(R(e.extra, { font: f.body, sz: HP(12), color: c.muted }), { sp: { before: 40, after: 0 } });
    return out;
  }
  function bullet(text, t, before, o) {
    o = o || {};
    var f = fontSet(t);
    return P([R('•', { font: f.body, sz: HP(o.size || 13), color: o.bc || t.c.accent }), R('\t' + text, { font: f.body, sz: HP(o.size || 13), color: o.color || t.c.ink })],
      { ind: { left: 284, hanging: 284 }, tabs: [{ pos: 284 }], sp: { before: before == null ? 30 : before, after: 0 } });
  }
  function para(text, t, o) {
    o = o || {};
    var f = fontSet(t);
    return P(R(text, { font: f.body, sz: HP(o.size || 13), color: o.color || t.c.ink }), { sp: { before: o.before || 0, after: 0, line: o.line || 276, rule: 'auto' }, jc: o.jc });
  }
  function kvTable(pairs, t, width, cols) {
    var f = fontSet(t), c = t.c;
    var kw = Math.round(width / cols * 0.42), vw = Math.round(width / cols) - kw;
    var colw = []; for (var i = 0; i < cols; i++) colw.push(kw, vw);
    var rows = [];
    for (var r = 0; r < pairs.length; r += cols) {
      var cells = [];
      for (var j = 0; j < cols; j++) {
        var p = pairs[r + j];
        cells.push({ c: P(R(p ? p[0] : '', { font: f.body, sz: HP(12.5), color: c.muted }), { sp: { before: 40, after: 0 } }) });
        cells.push({ c: P(R(p ? p[1] : '', { font: f.body, sz: HP(12.5), color: c.ink }), { sp: { before: 40, after: 0 } }) });
      }
      rows.push({ cells: cells, cantSplit: true });
    }
    return TBL(colw, rows);
  }
  function refsTable(refs, t, width, cols) {
    var f = fontSet(t), c = t.c, cw = Math.floor(width / cols), rows = [];
    for (var i = 0; i < refs.length; i += cols) {
      var cells = [];
      for (var j = 0; j < cols; j++) {
        var r = refs[i + j], x = '';
        if (r) {
          var role = [r.relationship, r.company].filter(Boolean).join(', ');
          x += P(R(r.name, { font: f.body, b: true, sz: HP(13), color: c.ink }), { sp: { before: 60, after: 0 } });
          if (role) x += P(R(role, { font: f.body, sz: HP(12.5), color: c.accent2 }), { sp: { after: 0 } });
          if (r.phone) x += P(R(r.phone, { font: f.body, sz: HP(12.5), color: c.muted }), { sp: { after: 0 } });
          if (r.email) x += P(R(r.email, { font: f.body, sz: HP(12.5), color: c.muted }), { sp: { after: 0 } });
        }
        cells.push({ c: x, mar: { right: 200 } });
      }
      rows.push({ cells: cells, cantSplit: true });
    }
    var colw = []; for (var k = 0; k < cols; k++) colw.push(cw);
    return TBL(colw, rows);
  }
  function inlineList(list, t) {
    var f = fontSet(t), runs = [];
    list.forEach(function (x, i) {
      if (i) runs.push(R('   •   ', { font: f.body, sz: HP(13), color: t.c.accent }));
      runs.push(R(x, { font: f.body, sz: HP(13), color: t.c.ink }));
    });
    return P(runs, { sp: { before: 0, after: 0, line: 300, rule: 'auto' } });
  }
  function declaration(m, t, ctx) {
    var f = fontSet(t);
    var sig = ctx && m.signature ? sigRun(ctx, m.signature, 38) : '';
    return para('I, ' + m.name + ', declare that the information in this CV is true and correct to the best of my knowledge.', t, { size: 12.5 }) +
      (sig ? P([R('Signature:  ', { font: f.body, sz: HP(12.5), color: t.c.muted }), sig, R('        Date: ' + TP.todayText(), { font: f.body, sz: HP(12.5), color: t.c.muted })], { sp: { before: TW(18), after: 0 } }) :
        P([R('Signature: ______________________________        Date: ____________________', { font: f.body, sz: HP(12.5), color: t.c.muted })], { sp: { before: TW(26), after: 0 } }));
  }
  // drawn signature as an inline picture, heightPx tall
  function sigRun(ctx, dataUrl, heightPx) {
    var id = ctx.addImage(dataUrl);
    if (!id) return '';
    var asp = sigAspect(dataUrl);
    var h = EMU(heightPx), w = Math.round(h * asp), n = ++ctx.drawingId;
    return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + w + '" cy="' + h + '"/><wp:effectExtent l="0" t="0" r="0" b="0"/>' +
      '<wp:docPr id="' + n + '" name="Signature ' + n + '"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>' +
      '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="' + n + '" name="signature.png"/><pic:cNvPicPr/></pic:nvPicPr>' +
      '<pic:blipFill><a:blip r:embed="' + id + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + w + '" cy="' + h + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>' +
      '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
  }
  // reads width/height from a PNG data URL header
  function sigAspect(dataUrl) {
    try {
      var b = atob(dataUrl.split(',')[1].slice(0, 44));
      var w = (b.charCodeAt(16) << 24) | (b.charCodeAt(17) << 16) | (b.charCodeAt(18) << 8) | b.charCodeAt(19);
      var h = (b.charCodeAt(20) << 24) | (b.charCodeAt(21) << 16) | (b.charCodeAt(22) << 8) | b.charCodeAt(23);
      return w > 0 && h > 0 ? w / h : 3;
    } catch (e) { return 3; }
  }
  function twoColBullets(list, t, width) {
    var rows = [];
    for (var i = 0; i < list.length; i += 2) {
      rows.push({ cells: [{ c: bullet(list[i], t, 30) }, { c: list[i + 1] ? bullet(list[i + 1], t, 30) : '' }], cantSplit: true });
    }
    return TBL([Math.floor(width / 2), Math.floor(width / 2)], rows);
  }

  // body sections for single-column modern layouts
  function mainSections(m, t, ctx, width, o) {
    var secs = [];
    function add(key, title, body) { secs.push({ key: key, title: title, body: body }); }
    if (m.profile) add('profile', 'Profile', para(m.profile, t, { line: 288 }));
    if (o.personal && m.personal.length) add('personal', 'Personal Details', kvTable(m.personal, t, width, o.kvCols || 2));
    [['work', 'Work Experience', m.work], ['education', 'Education', m.edu], ['courses', 'Courses & Certificates', m.courses]].forEach(function (g) {
      if (!g[2].length) return;
      add(g[0], g[1], g[2].map(function (e, i) { return o.entry ? o.entry(e, i === 0) : entry(e, t, ctx, width, i === 0); }).join(''));
    });
    if (o.skills) {
      if (m.skills.length) add('skills', 'Skills', o.skills === 'inline' ? inlineList(m.skills, t) : twoColBullets(m.skills, t, width));
      if (m.attributes.length) add('skills', 'Personal Attributes', o.skills === 'inline' ? inlineList(m.attributes, t) : twoColBullets(m.attributes, t, width));
      if (m.languages.length && !o.noLang) add('languages', 'Languages', inlineList(m.languages.map(function (l) { return l.name + (l.note ? ' (' + l.note + ')' : ''); }), t));
      if (m.hobbies.length) add('hobbies', 'Hobbies & Interests', para(m.hobbies.join(', '), t));
    }
    if (m.references.length) add('references', 'References', refsTable(m.references, t, width, o.refCols || 2));
    else if (m.refsOnRequest) add('references', 'References', para('Available on request.', t));
    if (m.annexures.length) add('annexures', 'Supporting Documents', m.annexures.map(function (a, i) { return bullet(a.key + ': ' + a.type, t, i ? 30 : 0); }).join(''));
    if (m.declaration) add('declaration', 'Declaration', declaration(m, t, ctx));
    var first = !!o.firstTight;
    return D.orderBy(secs, m.order || []).map(function (x) {
      var h = heading(x.title, t, ctx, { before: first ? 6 : 22 }); first = false;
      return h + x.body;
    }).join('');
  }
  function contactText(m, sep) { return m.contacts.map(function (c) { return c.t; }).join(sep); }

  /* ---------- families ---------- */
  function classic(cv, t, ctx) {
    var p = cv.personal, c = cv.contact, s = cv.school;
    var BA = 'Book Antiqua', out = '';
    // labelled rows get a dot leader up to the colon (same as the PDF), so systems read the label with its value
    var row = { tabs: [{ val: 'left', pos: 4305 }], lead: [{ val: 'left', pos: 4305, leader: 'dot' }], ind: { left: 4425, hanging: 4305 } };
    var AC = t.c.accent || '#000000', LN = SZ(264);
    function head(title, first) {
      return P(R(title, { b: true, u: true, font: BA, color: AC, sz: SZ(22) }), { keepNext: true, jc: 'center', shd: t.shade ? t.c.shade : null,
        bdr: { top: { sz: 6, color: AC, space: 1 }, left: { sz: 6, color: AC, space: 4 }, bottom: { sz: 6, color: AC, space: 1 }, right: { sz: 6, color: AC, space: 4 } },
        sp: { before: first ? 0 : SZ(315), after: SZ(270), line: LN, rule: 'exact' } });
    }
    function rows(label, value, gap, keep) {
      var ls = Array.isArray(value) ? value : D.lines(value);
      return ls.map(function (v, i) {
        var lab = !i && label;
        return P([R(i ? '' : label, { font: BA, sz: SZ(22) }), R('\t', { font: BA, sz: SZ(22), color: lab ? '#8A8A8A' : null }), R(': ' + v, { font: BA, sz: SZ(22) })],
          { keepNext: keep, tabs: lab ? row.lead : row.tabs, ind: row.ind, sp: { before: gap && !i ? LN : 0, after: 0, line: LN, rule: 'exact' } });
      }).join('');
    }
    // rows of one group (one job, one reference...) are kept together on a page when they are short
    function group(pairs, gap) {
      var o = '', first = true, list = [];
      pairs.forEach(function (pv) { var ls = Array.isArray(pv[1]) ? pv[1] : D.lines(pv[1]); if (ls.length) list.push([pv[0], ls]); });
      var total = list.reduce(function (a, b) { return a + b[1].length; }, 0);
      list.forEach(function (pv, idx) {
        var keep = total <= 12 && idx < list.length - 1;
        o += rows(pv[0], pv[1], gap && first, keep);
        first = false;
      });
      return o;
    }
    function text(s2) { return P(R(s2, { font: BA, sz: SZ(22) }), { ind: { left: 120, right: 120 }, sp: { before: 0, after: 0, line: LN, rule: 'exact' } }); }
    out += P(R('CURRICULUM VITAE', { b: true, u: true, font: BA, sz: SZ(24), color: AC }), { jc: 'center', sp: { before: 0, after: 165 } });
    out += P(R('OF', { b: true, u: true, font: BA, sz: SZ(24), color: AC }), { jc: 'center', sp: { before: 0, after: 135 } });
    out += P(R((TP.displayName(cv) || 'YOUR NAME').toUpperCase(), { font: 'Calibri', sz: SZ(40), color: AC }), { jc: 'center', sp: { before: 0, after: 330 } });
    var firstHead = true, secs = [], hid = function (k) { return D.isHidden(cv, k); }, curKey = null;
    function section(title, body) {
      if (!body) return;
      if (!curKey) { out += head(title, firstHead) + body; firstHead = false; return; } // contact details stay first
      if (hid(curKey)) return;
      var last = secs.length && secs[secs.length - 1].key === curKey ? secs[secs.length - 1] : null;
      if (last) last.parts.push([title, body]); else secs.push({ key: curKey, parts: [[title, body]] });
    }
    section('CONTACT DETAILS', group([['Contact Number', c.phone], ['Alternative Number', c.altPhone], ['Email Address', c.email],
      ['Physical Address', D.lines(c.address).map(function (x) { return x.toUpperCase(); })], ['Postal Address', c.postal], ['LinkedIn', c.linkedin]]));
    var noLang = hid('languages');
    curKey = 'personal';
    section('PERSONAL DETAILS', group([['Surname', p.surname], ['First Name(s)', p.firstNames], ['Date of Birth', D.fmtDate(p.dob)], ['Identity Number', TP.fmtID(p.idNumber)],
      ['Race', p.race], ['Gender', p.gender], ['Nationality', p.nationality], ['Marital Status', p.maritalStatus], ['Health Status', p.healthStatus],
      ['Home Language', noLang ? '' : p.homeLanguage], ['Alternative Languages', noLang ? '' : p.otherLanguages], ['Criminal Record', p.criminalRecord], ["Driver's Licence", p.licence], ['Disability', p.disability]]));
    curKey = 'profile';
    if ((cv.profile || '').trim()) section('CAREER OBJECTIVE', text(cv.profile.trim()));
    curKey = 'education';
    section('EDUCATIONAL HISTORY', group([['School Attended', s.name], ['Highest Grade Passed', s.grade], ['Subjects Passed', s.subjects], ['Year Obtained', s.year]]));
    var ter = (cv.tertiary || []).filter(function (x) { return x.institution || x.qualification; });
    if (ter.length) section('TERTIARY EDUCATION', ter.map(function (x, i) { return group([['Institution', x.institution], ['Qualification', x.qualification], ['Year Obtained', x.year], ['Status', x.status]], i > 0); }).join(''));
    curKey = 'courses';
    var crs = (cv.courses || []).filter(function (x) { return x.name; });
    if (crs.length) section('SHORT COURSES & CERTIFICATES', crs.map(function (x, i) { return group([['Course', x.name], ['Institution', x.provider], ['Year', x.year]], i > 0); }).join(''));
    curKey = 'work';
    var wk = (cv.work || []).filter(function (w) { return w.company || w.position; });
    if (wk.length) section('WORK EXPERIENCE', wk.map(function (w, i) {
      return group([['Company Name', w.company], ['Occupation', w.position], ['Duration', D.workPeriodLong(w)], ['Duties', w.duties], ['Reason for Leaving', w.reason]], i > 0);
    }).join(''));
    curKey = 'skills';
    section('SKILLS & ATTRIBUTES', group([['Skills', cv.skills], ['Personal Attributes', cv.attributes]]));
    curKey = 'hobbies';
    section('HOBBIES & INTERESTS', rows('Hobbies', cv.hobbies));
    curKey = 'references';
    var refs = (cv.references || []).filter(function (r) { return r.name; });
    if (refs.length) section('REFERENCES', refs.map(function (r, i) {
      return group([['Contact Person', r.name], ['Relationship', r.relationship], ['Company', r.company], ['Contact Number', r.phone], ['Email Address', r.email]], i > 0);
    }).join(''));
    else if (cv.refsOnRequest) section('REFERENCES', text('Available on request.'));
    curKey = 'annexures';
    var anx = D.annexures(cv);
    if (anx.length) section('SUPPORTING DOCUMENTS', anx.map(function (a) { return rows(a.key, [a.type]); }).join(''));
    curKey = 'declaration';
    if (cv.declaration) section('DECLARATION', text('I, ' + D.fullName(cv) + ', hereby declare that the information contained in this CV is true and correct to the best of my knowledge.') +
      (cv.signature ? P([R('Signature:  ', { font: BA, sz: SZ(22) }), sigRun(ctx, cv.signature, 40), R('        Date: ' + TP.todayText(), { font: BA, sz: SZ(22) })], { ind: { left: 120 }, sp: { before: 300, after: 0 } }) :
        P(R('Signature: ____________________________        Date: ____________________', { font: BA, sz: SZ(22) }), { ind: { left: 120 }, sp: { before: 450, after: 0 } })));
    D.orderBy(secs, D.sectionOrder(cv, 'classic')).forEach(function (x) {
      x.parts.forEach(function (pt) { out += head(pt[0], firstHead) + pt[1]; firstHead = false; });
    });
    ctx.sect = { mar: { top: 1474, right: 1275, bottom: 1200, left: 1275, header: 709, footer: 709 },
      pgBorders: '<w:pgBorders w:offsetFrom="page"><w:top w:val="single" w:sz="6" w:space="25" w:color="000000"/><w:left w:val="single" w:sz="6" w:space="24" w:color="000000"/>' +
        '<w:bottom w:val="single" w:sz="6" w:space="25" w:color="000000"/><w:right w:val="single" w:sz="6" w:space="24" w:color="000000"/></w:pgBorders>' };
    ctx.defaults = { font: BA, sz: SZ(22) };
    return out;
  }

  function sidebar(cv, t, ctx, m) {
    var c = t.c, f = fontSet(t), L = t.side !== 'right';
    var SIDE = TW(262), PAD = TW(26);
    var marL = L ? SIDE + TW(38) : TW(38), marR = L ? TW(40) : SIDE + TW(40);
    var mainInner = PGW - marL - marR;
    // side column: a Word text frame fixed to the top of page 1 (the coloured band is drawn in the header)
    FRAME = '<w:framePr w:w="' + (SIDE - 2 * PAD) + '" w:hSpace="0" w:wrap="around" w:vAnchor="page" w:hAnchor="page" w:x="' + (L ? PAD : PGW - SIDE + PAD) + '" w:y="' + TW(40) + '"/>';
    var s = '';
    var photo = photoRun(ctx, 150, t.photoShape, { w: 4, color: c.sideLine });
    s += photo ? P(photo, { jc: 'center', sp: { after: 60 } }) :
      P(R(initialsOf(m.name), { font: f.name, b: true, sz: HP(40), color: c.sideInk, sp: 40 }), { jc: 'center', sp: { before: 200, after: 120 } });
    function SH(title) {
      return P(R(title, { font: f.head, b: true, caps: true, sz: HP(13), color: c.sideInk, sp: 30 }),
        { keepNext: true, bdr: { bottom: { sz: 6, color: c.sideLine, space: 4 } }, sp: { before: TW(20), after: TW(6) } });
    }
    function sv(text, o) { o = o || {}; return P(R(text, { font: f.body, sz: HP(o.size || 12.5), color: o.color || c.sideInk, caps: o.caps, sp: o.sp }), { keepNext: o.keepNext, sp: { before: o.before || 0, after: 0 } }); }
    if (m.contacts.length) { s += SH('Contact'); m.contacts.forEach(function (x) { s += sv(x.t, { before: 80 }); }); }
    if (m.personal.length) {
      s += SH('Personal Details');
      m.personal.forEach(function (p) { s += sv(p[0], { size: 10.5, color: c.sideMuted, caps: true, sp: 15, before: 80, keepNext: true }) + sv(p[1]); });
    }
    if (m.languages.length) { s += SH('Languages'); m.languages.forEach(function (l) { s += sv(l.name + (l.note ? ' (' + l.note + ')' : ''), { before: 60 }); }); }
    FRAME = null;
    // main column: ordinary page text, so Word keeps headings with their content
    var mm = P(R(m.name, { font: f.name, b: (t.nameW || 700) >= 600, sz: HP(t.id === 'charcoal' ? 31 : 33), color: c.ink, caps: !!t.nameUpper, sp: (t.nameLs || 0) * 15 }), { sp: { before: 0, after: 0 } });
    if (m.headline) mm += P(R(m.headline, { font: f.head, caps: true, sz: HP(14), color: c.accent, sp: 30 }), { sp: { before: 80, after: 0 } });
    mm += mainSections(m, t, ctx, mainInner, { personal: false, skills: 'bullets', noLang: true });
    ctx.sect = { mar: { top: TW(46), right: marR, bottom: TW(40), left: marL, header: 0, footer: 0 } };
    ctx.headerDecor = vmlRect(L ? 0 : 794 - 262, 0, 262, 1123, c.sideBg, 1);
    return s + mm;
  }
  function initialsOf(name) {
    var w = name.split(/\s+/).filter(Boolean);
    return ((w[0] || '').charAt(0) + (w.length > 1 ? w[w.length - 1].charAt(0) : '')).toUpperCase();
  }

  function fullBleedBanner(inner, fill, ctx, margin, photoCell) {
    // a full-width shaded table that reaches the page edges
    var cells = [], cols = [];
    if (photoCell) { cols.push(margin + TW(154)); cells.push({ c: photoCell, shd: fill, mar: { top: TW(36), left: margin, bottom: TW(30), right: TW(30) }, va: 'center' }); }
    cols.push(PGW - (photoCell ? cols[0] : 0));
    cells.push({ c: inner, shd: fill, mar: { top: TW(40), left: photoCell ? 0 : margin, bottom: TW(32), right: margin }, va: 'center' });
    return TBL(cols, [{ cells: cells }], { ind: -margin });
  }

  function banner(cv, t, ctx, m) {
    var c = t.c, f = fontSet(t), MARG = TW(56), width = PGW - 2 * MARG;
    var inner = P(R(m.name, { font: f.name, b: (t.nameW || 700) >= 600, caps: !!t.nameUpper, sp: (t.nameLs || 0) * 15, sz: HP(36), color: c.bannerInk }), { sp: { after: 0 } });
    if (m.headline) inner += P(R(m.headline, { font: f.head, caps: true, sp: 30, sz: HP(14), color: c.bannerSub }), { sp: { before: 60, after: 0 } });
    if (m.contacts.length) inner += P(R(contactText(m, '     |     '), { font: f.body, sz: HP(12.5), color: c.bannerInk }), { sp: { before: 160, after: 0, line: 300 } });
    var ph = photoRun(ctx, 124, t.photoShape, { w: 3, color: c.bannerInk });
    var out = fullBleedBanner(inner, c.banner, ctx, MARG, ph ? P(ph, { jc: 'left' }) : '');
    if (t.stripe) {
      var w = Math.floor(PGW / 5);
      out += TBL([w, w, w, w, PGW - 4 * w], [{ h: 120, hRule: 'exact', cells: TP.FLAG.map(function (col) { return { c: TINY, shd: col }; }) }], { ind: -MARG });
    }
    out += mainSections(m, t, ctx, width, { personal: true, skills: 'inline' });
    ctx.sect = { mar: { top: 0, right: MARG, bottom: 900, left: MARG, header: 0, footer: 400 }, titlePg: true };
    ctx.firstHeader = TINY;
    ctx.header = P('', { shd: t.stripe ? '#007A4D' : c.banner, ind: { left: -MARG, right: -MARG }, sp: { before: 0, after: 600, line: 120, rule: 'exact' }, rpr: '<w:sz w:val="4"/>' });
    return out;
  }

  function leftcol(cv, t, ctx, m) {
    var c = t.c, f = fontSet(t), L = TW(t.edge ? 64 : 60), R2 = TW(60), width = PGW - L - R2;
    var HW = TW(150), CW = width - HW;
    var out = P(R(m.name, { font: f.name, b: (t.nameW || 700) >= 600, sz: HP(38), color: c.ink }), { sp: { before: 0, after: 0 } });
    if (m.headline) out += P(R(m.headline, { font: f.head, caps: true, sp: 30, sz: HP(14), color: c.accent }), { sp: { before: 60, after: 0 } });
    if (m.contacts.length) out += P(R(contactText(m, '     '), { font: f.body, sz: HP(12.5), color: c.muted }), { sp: { before: 140, after: 0, line: 300 }, bdr: { bottom: { sz: 16, color: c.accent, space: 14 } } });
    // sections as two-column tables
    var sections = [];
    function add(key, title, body) { var x = [title, body]; x.key = key; sections.push(x); }
    if (m.profile) add('profile', 'Profile', para(m.profile, t, { line: 288 }));
    if (m.personal.length) add('personal', 'Personal Details', kvTable(m.personal, t, CW, 2));
    [['work', 'Work Experience', m.work], ['education', 'Education', m.edu], ['courses', 'Courses & Certificates', m.courses]].forEach(function (g) {
      if (g[2].length) add(g[0], g[1], g[2].map(function (e, i) { return entry(e, t, ctx, CW, i === 0); }).join(''));
    });
    if (m.skills.length) add('skills', 'Skills', twoColBullets(m.skills, t, CW));
    if (m.attributes.length) add('skills', 'Personal Attributes', twoColBullets(m.attributes, t, CW));
    if (m.languages.length) add('languages', 'Languages', inlineList(m.languages.map(function (l) { return l.name + (l.note ? ' (' + l.note + ')' : ''); }), t));
    if (m.hobbies.length) add('hobbies', 'Hobbies & Interests', para(m.hobbies.join(', '), t));
    if (m.references.length) add('references', 'References', refsTable(m.references, t, CW, 2));
    else if (m.refsOnRequest) add('references', 'References', para('Available on request.', t));
    if (m.annexures.length) add('annexures', 'Supporting Documents', m.annexures.map(function (a, i) { return bullet(a.key + ': ' + a.type, t, i ? 30 : 0); }).join(''));
    if (m.declaration) add('declaration', 'Declaration', declaration(m, t, ctx));
    sections = D.orderBy(sections, m.order || []);
    sections.forEach(function (s, i) {
      var hcell = P(R(s[0], { font: f.head, b: true, caps: true, sp: 22, sz: HP(11.5), color: c.accent }), { sp: { before: 0, after: 0 } });
      var top = i ? { top: { sz: 4, color: c.line, space: 0 } } : null;
      out += TBL([HW, CW], [{ cells: [{ c: hcell, bdr: top, mar: { top: TW(14), right: TW(16) } }, { c: s[1], bdr: top, mar: { top: TW(14) } }] }]);
      out += P('', { sp: { before: 0, after: 0, line: TW(14), rule: 'exact' }, rpr: '<w:sz w:val="4"/>' });
    });
    ctx.sect = { mar: { top: TW(54), right: R2, bottom: TW(48), left: L, header: 0, footer: 400 } };
    if (t.edge) ctx.headerDecor = vmlRect(0, 0, 10, 1123, c.accent, 1);
    return out;
  }

  function centered(cv, t, ctx, m) {
    var c = t.c, f = fontSet(t), MARG = TW(64), width = PGW - 2 * MARG, left = t.align === 'left';
    var jc = left ? 'left' : 'center';
    var out = P(R(m.name, { font: f.name, b: (t.nameW || 700) >= 600, caps: !!t.nameUpper, sp: (t.nameLs || 0) * 15, sz: HP(left ? 30 : (t.id === 'garamond' ? 36 : 40)), color: c.ink }), { jc: jc, sp: { after: 0 } });
    if (m.headline) out += P(R(m.headline, left ? { font: f.body, sz: HP(15), color: c.ink } : { font: f.head, caps: true, sp: 30, sz: HP(14), color: c.accent }), { jc: jc, sp: { before: left ? 20 : 100, after: 0 } });
    if (m.contacts.length) out += P(R(contactText(m, left ? '   |   ' : '   •   '), { font: f.body, sz: HP(12.5), color: c.muted }), { jc: jc, sp: { before: 160, after: 0, line: 300 } });
    out += mainSections(m, t, ctx, width, { personal: true, skills: 'bullets', firstTight: false });
    ctx.sect = { mar: { top: TW(left ? 50 : 58), right: MARG, bottom: TW(50), left: MARG, header: 0, footer: 400 } };
    if (t.frame) ctx.sect.pgBorders = '<w:pgBorders w:offsetFrom="page"><w:top w:val="single" w:sz="6" w:space="20" w:color="' + hex(c.line) + '"/><w:left w:val="single" w:sz="6" w:space="20" w:color="' + hex(c.line) +
      '"/><w:bottom w:val="single" w:sz="6" w:space="20" w:color="' + hex(c.line) + '"/><w:right w:val="single" w:sz="6" w:space="20" w:color="' + hex(c.line) + '"/></w:pgBorders>';
    return out;
  }

  function timeline(cv, t, ctx, m) {
    var c = t.c, f = fontSet(t), MARG = TW(50), width = PGW - 2 * MARG;
    var inner = P(R(m.name, { font: f.name, b: (t.nameW || 700) >= 600, sz: HP(36), color: c.ink }), { sp: { after: 0 } });
    if (m.headline) inner += P(R(m.headline, { font: f.head, caps: true, sp: 30, sz: HP(14), color: c.accent }), { sp: { before: 60, after: 0 } });
    if (m.contacts.length) inner += P(R(contactText(m, '     |     '), { font: f.body, sz: HP(12.5), color: c.ink }), { sp: { before: 160, after: 0, line: 300 } });
    var ph = photoRun(ctx, 120, t.photoShape);
    var out;
    if (ph) {
      var pw = TW(150) + MARG;
      out = TBL([PGW - pw, pw], [{ cells: [{ c: inner, shd: c.tint, mar: { top: TW(40), left: MARG, bottom: TW(30), right: TW(20) }, va: 'center' },
        { c: P(ph, { jc: 'right' }), shd: c.tint, mar: { top: TW(30), left: 0, bottom: TW(26), right: MARG }, va: 'center' }] }], { ind: -MARG });
    } else out = fullBleedBanner(inner, c.tint, ctx, MARG, '');
    var DW = TW(118), CW = width - DW;
    function tlEntry(e) {
      var rows = [];
      var head = P([R('● ', { font: 'Arial', sz: HP(12), color: c.accent }), R(e.title, { font: f.body, b: true, sz: HP(14), color: c.ink })], { keepNext: true, ind: { left: 0, hanging: 0 }, sp: { after: 0 } });
      if (e.org) head += P(R(e.org, { font: f.body, sz: HP(13), color: c.accent2 }), { sp: { after: 0 } });
      if (e.note) head += P(R(e.note, { font: f.body, sz: HP(12), color: c.muted }), { sp: { before: 30, after: 0 } });
      e.bullets.forEach(function (b, i) { head += bullet(b, t, i === 0 ? 60 : 30); });
      if (e.extra) head += P(R(e.extra, { font: f.body, sz: HP(12), color: c.muted }), { sp: { before: 40, after: 0 } });
      rows.push({ cells: [{ c: P(R(e.period, { font: f.body, sz: HP(12), color: c.muted }), { jc: 'right', sp: { after: 0 } }), mar: { right: TW(16), top: 30 } },
        { c: head, bdr: { left: { sz: 12, color: c.line, space: 0 } }, mar: { left: TW(18), bottom: TW(14), top: 0 } }] });
      return TBL([DW, CW], rows);
    }
    out += mainSections(m, t, ctx, width, { personal: true, skills: 'inline', entry: function (e) { return tlEntry(e); } });
    ctx.sect = { mar: { top: 0, right: MARG, bottom: 900, left: MARG, header: 0, footer: 400 }, titlePg: true };
    ctx.firstHeader = TINY;
    ctx.header = P('', { shd: c.accent, ind: { left: -MARG, right: -MARG }, sp: { before: 0, after: 600, line: 90, rule: 'exact' }, rpr: '<w:sz w:val="4"/>' });
    return out;
  }

  function split(cv, t, ctx, m) {
    var c = t.c, f = fontSet(t), MARG = TW(50), width = PGW - 2 * MARG;
    var SW = TW(236), GAP = TW(26), marR = MARG + SW + GAP, mainInner = PGW - MARG - marR;
    var left = P(R(m.name, { font: f.name, b: (t.nameW || 700) >= 600, sz: HP(36), color: c.ink }), { sp: { after: 0 } });
    if (m.headline) left += P(R(m.headline, { font: f.head, caps: true, sp: 30, sz: HP(14), color: c.accent }), { sp: { before: 60, after: 0 } });
    var right = m.contacts.map(function (x) { return P(R(x.t, { font: f.body, sz: HP(12.5), color: c.ink }), { jc: 'right', sp: { before: 40, after: 0 } }); }).join('');
    // header spans the full width (it reaches into the wider right margin)
    var out = TBL([width - TW(300), TW(300)], [{ cells: [{ c: left, va: 'bottom', bdr: { bottom: { sz: 24, color: c.accent, space: 0 } }, mar: { bottom: TW(18) } },
      { c: right, va: 'bottom', bdr: { bottom: { sz: 24, color: c.accent, space: 0 } }, mar: { bottom: TW(18) } }] }]);
    // side boxes: a text frame placed beside the main text, just under the header
    FRAME = '<w:framePr w:w="' + SW + '" w:hSpace="0" w:wrap="around" w:vAnchor="text" w:hAnchor="page" w:x="' + (PGW - MARG - SW) + '" w:y="' + TW(22) + '"/>';
    var BOX = { top: { sz: 4, color: c.tint, space: 6 }, left: { sz: 4, color: c.tint, space: 7 }, bottom: { sz: 4, color: c.tint, space: 6 }, right: { sz: 4, color: c.tint, space: 7 } };
    var IND = { left: 150, right: 150 };
    function bp(runs, o) { o = o || {}; return P(runs, { keepNext: true, bdr: BOX, shd: c.tint, ind: IND, sp: { before: o.before || 0, after: 0 } }); }
    function box(title, items) {
      return bp(R(title, { font: f.head, b: true, caps: true, sp: 22, sz: HP(12), color: c.accent })) + items.join('') +
        P('', { sp: { before: 0, after: 0, line: TW(16), rule: 'exact' }, rpr: '<w:sz w:val="4"/>' });
    }
    var side = '';
    if (m.personal.length) side += box('Personal Details', m.personal.map(function (p) {
      return bp(R(p[0], { font: f.body, caps: true, sp: 12, sz: HP(10.5), color: c.muted }), { before: 70 }) + bp(R(p[1], { font: f.body, sz: HP(12.5), color: c.ink }));
    }));
    if (m.languages.length) side += box('Languages', m.languages.map(function (l) {
      return bp(R(l.name + (l.note ? ' – ' + l.note : ''), { font: f.body, sz: HP(12.5), color: c.ink }), { before: 50 });
    }));
    FRAME = null;
    var main = mainSections(m, t, ctx, mainInner, { personal: false, skills: 'bullets', noLang: true, refCols: 1 });
    ctx.sect = { mar: { top: TW(46), right: marR, bottom: TW(46), left: MARG, header: 0, footer: 400 } };
    ctx.headerDecor = vmlRect(0, 0, 794, 10, c.accent, 1);
    return out + side + main;
  }

  var FAM = { classic: classic, sidebar: sidebar, banner: banner, leftcol: leftcol, centered: centered, timeline: timeline, split: split };

  /* ---------- package ---------- */
  var NS = 'xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
    'xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
    'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" ' +
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" ' +
    'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" ' +
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';

  function stylesXml(def) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="' + esc(def.font) + '" w:hAnsi="' + esc(def.font) + '" w:cs="' + esc(def.font) + '" w:eastAsia="' + esc(def.font) + '"/>' +
      '<w:sz w:val="' + def.sz + '"/><w:szCs w:val="' + def.sz + '"/><w:lang w:val="en-ZA" w:eastAsia="en-ZA" w:bidi="ar-SA"/></w:rPr></w:rPrDefault>' +
      '<w:pPrDefault><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
      '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
      '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/>' +
      '<w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>' +
      '</w:styles>';
  }
  function hdrXml(body) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr ' + NS + '>' + body + '</w:hdr>';
  }

  function newCtx(m) {
    var images = [];
    return {
      m: m, drawingId: 100, images: images,
      addImage: function (dataUrl) {
        var mm = /^data:image\/(jpeg|jpg|png);base64,(.*)$/.exec(dataUrl || '');
        if (!mm) return null;
        var id = 'rIdImg' + (images.length + 1);
        images.push({ id: id, ext: mm[1] === 'png' ? 'png' : 'jpeg', b64: mm[2] });
        return id;
      }
    };
  }

  // the newer modern templates (family "mod") are written with the Word layout closest to their design
  var HS_WORD = { pill: 'fill', pills: 'fill', tab: 'fill', fill: 'fill', ink: 'fill', under: 'rule', liner: 'rule', double: 'rule', rule: 'rule', over: 'short',
    num: 'rule', period: 'rule', dash: 'bar', bar: 'bar', tint: 'bar', arrow: 'bar', ring: 'dot', dot: 'dot', spaced: 'dot', box: 'dot', short: 'short', lines: 'lines' };
  function wordTwin(t) {
    if (t.family !== 'mod') return t;
    var c = Object.assign({}, t.c), dark = ['band', 'diag', 'wave', 'split2', 'inverse'].indexOf(t.hd) >= 0, fam, x = {};
    if (t.lay === 'side') fam = 'sidebar';
    else if (t.lay === 'two') fam = 'split';
    else if (t.lay === 'lcol') fam = 'leftcol';
    else if (t.lay === 'tl') fam = 'timeline';
    else if (t.lay === 'hside' || dark) { fam = 'banner'; c.banner = c.hdBg; c.bannerInk = c.hdInk; c.bannerSub = c.hdSub; }
    else { fam = 'centered'; x.align = ['center', 'minimal', 'frame'].indexOf(t.hd) >= 0 ? 'center' : 'left'; }
    if (t.hs === 'ink') c = Object.assign(c, { accent: c.ink });
    return Object.assign({}, t, { family: fam, c: c, hs: HS_WORD[t.hs] || 'rule', stripe: false, frame: (t.deco || []).indexOf('frame') >= 0, edge: (t.deco || []).indexOf('edge') >= 0 }, x);
  }

  async function makeDocx(cv, tplId, opts) {
    var t = wordTwin(TP.effective(TP.get(tplId), cv)), m = TP.model(cv);
    if (t.noPhoto) m = Object.assign({}, m, { photo: '' });
    SCALE = t.k || 1;
    var ctx = newCtx(m);
    var f = fontSet(t);
    ctx.defaults = { font: f.body, sz: 20 };
    FRAME = null;
    var body = FAM[t.family](cv, t, ctx, m, opts || {});
    return pack(body, ctx, 'Curriculum Vitae - ' + m.name, m.name);
  }

  // cover letter as a Word document, in the CV's fonts and colour
  async function makeLetterDocx(cv) {
    var L = window.CVLetter, Lt = L.get(cv);
    var base = TP.get(cv.templateId), t = wordTwin(TP.effective(base, cv)), m = TP.model(cv);
    SCALE = t.k || 1;
    FRAME = null;
    var ctx = newCtx(m), classic = t.family === 'classic';
    var f = classic ? { name: 'Calibri', head: 'Book Antiqua', body: 'Book Antiqua' } : fontSet(t);
    var c = t.c, body = '', MARG = TW(80);
    var contacts = m.contacts.map(function (x) { return x.t; }).join(classic ? '   |   ' : '   •   ');
    if (classic) {
      body += P(R((TP.displayName(cv) || m.name).toUpperCase(), { font: 'Calibri', b: true, sz: HP(26), color: c.accent || '#000000' }), { jc: 'center', sp: { after: 60 } });
      body += P(R(contacts, { font: f.body, sz: HP(12.5), color: '#333333' }), { jc: 'center', bdr: { bottom: { sz: 6, color: c.accent || '#000000', space: 10 } }, sp: { after: TW(26) } });
    } else {
      body += P(R(m.name, { font: f.name, b: (t.nameW || 700) >= 600, caps: !!t.nameUpper, sz: HP(30), color: c.ink }), { sp: { after: 0 } });
      if (m.headline) body += P(R(m.headline, { font: f.head, caps: true, sp: 30, sz: HP(12.5), color: c.accent }), { sp: { before: 60, after: 0 } });
      body += P(R(contacts, { font: f.body, sz: HP(12.5), color: c.muted }), { bdr: { bottom: { sz: 16, color: c.accent, space: 12 } }, sp: { before: 120, after: TW(26) } });
    }
    var bodyRun = function (text, o) { return R(text, Object.assign({ font: f.body, sz: HP(14), color: c.ink || '#000000' }, o || {})); };
    var para = function (text, o, po) { return P(bodyRun(text, o), Object.assign({ sp: { after: TW(12), line: 312, rule: 'auto' } }, po || {})); };
    body += para(L.today(), null, { sp: { after: TW(18) } });
    var to = [Lt.recipient, Lt.recipientTitle, Lt.company].filter(Boolean).concat(D.lines(Lt.address));
    to.forEach(function (x, i) { body += para(x, null, { sp: { after: i === to.length - 1 ? TW(20) : 0, line: 312, rule: 'auto' } }); });
    body += para(L.salutation(Lt));
    body += para(L.reLine(Lt), { b: true, u: classic });
    L.paras(cv).forEach(function (x) { body += para(x); });
    body += para(L.closing(Lt), null, { sp: { before: TW(8), after: 0 } });
    body += cv.signature ? P(sigRun(ctx, cv.signature, 52), { sp: { before: 40, after: 20 } }) : P('', { sp: { before: 0, after: TW(40) } });
    body += para(D.fullName(cv) || m.name, { b: true });
    body += P([bodyRun('Enclosures: ', { b: true, sz: HP(12.5), color: c.muted }), bodyRun(L.enclosures(cv).join('; '), { sz: HP(12.5), color: c.muted })], { sp: { before: TW(24) } });
    ctx.sect = { mar: { top: TW(70), right: MARG, bottom: TW(60), left: MARG, header: 400, footer: 400 } };
    ctx.defaults = { font: f.body, sz: HP(14) };
    return pack(body, ctx, 'Cover letter - ' + m.name, m.name);
  }

  function pack(body, ctx, title, author) {
    var s = ctx.sect, images = ctx.images;
    var rels = [];
    var hdrRefs = '';
    var zip = new JSZip();
    var defHeader = (ctx.header || '') + (ctx.headerDecor ? P(ctx.headerDecor, { sp: { before: 0, after: 0, line: 20, rule: 'exact' }, rpr: '<w:sz w:val="2"/>' }) : '');
    if (defHeader) {
      zip.file('word/header1.xml', hdrXml(defHeader));
      rels.push('<Relationship Id="rIdH1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>');
      hdrRefs += '<w:headerReference w:type="default" r:id="rIdH1"/>';
    }
    if (ctx.firstHeader) {
      zip.file('word/header2.xml', hdrXml(ctx.firstHeader + (ctx.headerDecorFirst || '')));
      rels.push('<Relationship Id="rIdH2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header2.xml"/>');
      hdrRefs += '<w:headerReference w:type="first" r:id="rIdH2"/>';
    }
    var pw = ctx.pgw || PGW, ph = ctx.pgh || PGH;
    var sect = '<w:sectPr>' + hdrRefs + '<w:pgSz w:w="' + pw + '" w:h="' + ph + '"' + (pw > ph ? ' w:orient="landscape"' : '') + '/>' +
      '<w:pgMar w:top="' + s.mar.top + '" w:right="' + s.mar.right + '" w:bottom="' + s.mar.bottom + '" w:left="' + s.mar.left + '" w:header="' + s.mar.header + '" w:footer="' + s.mar.footer + '" w:gutter="0"/>' +
      (s.pgBorders || '') + '<w:cols w:space="708"/>' + (s.titlePg ? '<w:titlePg/>' : '') + '<w:docGrid w:linePitch="360"/></w:sectPr>';
    // Word needs a paragraph after a final table
    if (/<\/w:tbl>$/.test(body)) body += TINY;
    var doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ' + NS + '><w:body>' + body + sect + '</w:body></w:document>';
    images.forEach(function (im, i) {
      zip.file('word/media/image' + (i + 1) + '.' + im.ext, im.b64, { base64: true });
      rels.push('<Relationship Id="' + im.id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image' + (i + 1) + '.' + im.ext + '"/>');
    });
    zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
      '<Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="png" ContentType="image/png"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
      '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>' +
      (defHeader ? '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>' : '') +
      (ctx.firstHeader ? '<Override PartName="/word/header2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>' : '') +
      '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
      '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');
    zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>');
    var now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    zip.file('docProps/core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" ' +
      'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      '<dc:title>' + esc(title) + '</dc:title><dc:creator>' + esc(author) + '</dc:creator><cp:lastModifiedBy>' + esc(author) + '</cp:lastModifiedBy>' +
      '<dcterms:created xsi:type="dcterms:W3CDTF">' + now + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + now + '</dcterms:modified></cp:coreProperties>');
    zip.file('docProps/app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>CV Maker SA by Tumelo Vincent Tau</Application></Properties>');
    zip.file('word/document.xml', doc);
    zip.file('word/styles.xml', stylesXml(ctx.defaults));
    zip.file('word/settings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>');
    zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '<Relationship Id="rIdSet" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>' + rels.join('') + '</Relationships>');
    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }

  /* ---------- a plain Word file from blocks (PDF to Word) ----------
     blocks: [{ type: 'p', runs: [{ t, b, i, u, s, sz (points), font, color }], jc, before (points), line (share of single spacing),
                ind (points from the left margin), tabs: [points], pbb (starts a new page) }
              | { type: 'img', src (JPEG or PNG data URL), w, h (points), jc, before, ind, pbb }]
     page: { w, h, top, right, bottom, left } in points */
  function imageRun(ctx, id, wPt, hPt) {
    var cx = Math.round(wPt * 12700), cy = Math.round(hPt * 12700), n = ++ctx.drawingId;
    return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + cx + '" cy="' + cy + '"/><wp:effectExtent l="0" t="0" r="0" b="0"/>' +
      '<wp:docPr id="' + n + '" name="Picture ' + n + '"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>' +
      '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="' + n + '" name="picture' + n + '"/><pic:cNvPicPr/></pic:nvPicPr>' +
      '<pic:blipFill><a:blip r:embed="' + id + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>' +
      '</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>';
  }
  async function plain(blocks, page, title) {
    var ctx = newCtx({}), body = '', tw = function (pt) { return Math.max(0, Math.round(pt * 20)); };
    FRAME = null; SCALE = 1;
    blocks.forEach(function (b) {
      var po = { jc: b.jc && b.jc !== 'left' ? b.jc : null, pbb: !!b.pbb, sp: { before: tw(b.before || 0), after: 0 } };
      if (b.ind) po.ind = { left: tw(b.ind) };
      if (b.type === 'img') {
        var id = ctx.addImage(b.src); if (!id) return;
        body += P(imageRun(ctx, id, b.w, b.h), po);
        return;
      }
      if (b.line) po.sp.line = Math.max(200, Math.round(240 * b.line));
      if (b.tabs && b.tabs.length) po.tabs = b.tabs.map(function (x) { return { pos: tw(x) }; });
      body += P(b.runs.map(function (r) { return R(r.t, { font: r.font, b: r.b, i: r.i, u: r.u, strike: r.s, sz: Math.max(2, Math.round(r.sz * 2)), color: r.color }); }), po);
    });
    if (!body) body = P('');
    ctx.pgw = tw(page.w); ctx.pgh = tw(page.h);
    ctx.sect = { mar: { top: tw(page.top), right: tw(page.right), bottom: tw(page.bottom), left: tw(page.left), header: 360, footer: 360 } };
    ctx.defaults = { font: page.font || 'Calibri', sz: 22 };
    return pack(body, ctx, title || 'Document', 'CV Maker SA');
  }

  window.CVDocx = { make: makeDocx, letter: makeLetterDocx, plain: plain };
  if (window.CVLibs) window.CVLibs.wrap(window.CVDocx, ['make', 'letter', 'plain'], 'zip');
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/pdfcore.js */
try {
/* PDF tools engine (no screens here).
   Reading and drawing PDF pages uses pdf.js (loaded only when a PDF tool is opened).
   Making new PDFs uses pdf-lib: photos to PDF, merge, pages, compress, watermark, password, fill & sign.
   Everything happens on the phone - files are never uploaded. */
(function () {
  'use strict';
  // the PDF library may arrive after this file (website), so look it up each time it is used
  var L = window.PDFLib || new Proxy({}, { get: function (t, k) { return window.PDFLib[k]; } });
  var A4 = [595.28, 841.89];
  function tr(s, vars) { var A = window.App; if (A && A.T) return A.T(s, vars); Object.keys(vars || {}).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); }); return s; }
  function err(msg, code) { var e = new Error(msg); if (code) e.code = code; return e; }

  /* ---------- loading the page drawing library only when needed ---------- */
  var scripts = {};
  function loadScript(src) {
    if (!scripts[src]) {
      scripts[src] = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.onload = res;
        s.onerror = function () { delete scripts[src]; rej(err('Could not load ' + src)); };
        document.head.appendChild(s);
      });
    }
    return scripts[src];
  }
  function pdfjs() {
    return loadScript('js/lib/pdfjs.min.js').then(function () {
      var P = window.pdfjsLib;
      if (!P.GlobalWorkerOptions.workerSrc) P.GlobalWorkerOptions.workerSrc = 'js/lib/pdfjs.worker.min.js';
      return P;
    });
  }

  /* ---------- small helpers ---------- */
  function isPdf(bytes) {
    for (var i = 0; i < Math.min(1024, bytes.length - 4); i++) if (bytes[i] === 0x25 && bytes[i + 1] === 0x50 && bytes[i + 2] === 0x44 && bytes[i + 3] === 0x46) return true;
    return false;
  }
  function readBytes(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(new Uint8Array(r.result)); };
      r.onerror = function () { rej(r.error); };
      r.readAsArrayBuffer(blob);
    });
  }
  function canvasJpg(cv, q) {
    return new Promise(function (res) {
      if (cv.toBlob) cv.toBlob(function (b) { readBytes(b).then(res); }, 'image/jpeg', q);
      else {
        var s = atob(cv.toDataURL('image/jpeg', q).split(',')[1]), u = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        res(u);
      }
    });
  }
  function dataUrlBytes(url) {
    var m = /^data:([^;,]+)?(;base64)?,(.*)$/.exec(url || '');
    if (!m) return null;
    var bin = atob(m[3]), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function loadImage(bytes, mime) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(new Blob([bytes], { type: mime || 'image/jpeg' }));
      var im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(err('image')); };
      im.src = url;
    });
  }
  var fontCache = {};
  function fontBytes(id) {
    if (!fontCache[id]) fontCache[id] = fetch((window.CVPdf ? window.CVPdf.fontBase : 'fonts/') + id + '.ttf').then(function (r) { return r.arrayBuffer(); });
    return fontCache[id];
  }
  function stampMeta(doc, title) {
    try {
      if (title) doc.setTitle(title);
      doc.setCreator('CV Maker SA');
      doc.setProducer('CV Maker SA by Tumelo Vincent Tau');
    } catch (e) { /* ignore */ }
  }
  // pdf-lib copy of a PDF we are allowed to change
  function loadEditable(bytes) {
    return L.PDFDocument.load(bytes, { updateMetadata: false }).catch(function (e) {
      if (/encrypt/i.test(String(e && e.message))) throw err(tr('This PDF is locked with a password.'), 'locked');
      throw err(tr('This file could not be opened as a PDF'), 'bad');
    });
  }

  /* ---------- reading PDFs (pdf.js) ---------- */
  function open(bytes, password) {
    return pdfjs().then(function (P) {
      var task = P.getDocument({ data: bytes.slice(0), password: password || undefined, isEvalSupported: false, useSystemFonts: true, stopAtErrors: false });
      return task.promise.catch(function (e) {
        if (e && e.name === 'PasswordException') throw err(e.code === P.PasswordResponses.INCORRECT_PASSWORD ? 'wrong-password' : 'need-password', e.code === P.PasswordResponses.INCORRECT_PASSWORD ? 'wrong-password' : 'need-password');
        throw err(tr('This file could not be opened as a PDF'), 'bad');
      });
    });
  }
  // page size in points as it is shown (rotation applied), plus the matrix that maps PDF points to that view
  function pageInfo(doc, i) {
    return doc.getPage(i + 1).then(function (page) {
      var vp = page.getViewport({ scale: 1 });
      return { w: vp.width, h: vp.height, rotate: vp.rotation, t: vp.transform.slice() };
    });
  }
  function allPageInfo(doc) {
    var out = [], ch = Promise.resolve();
    for (var i = 0; i < doc.numPages; i++) (function (k) { ch = ch.then(function () { return pageInfo(doc, k).then(function (p) { out[k] = p; }); }); })(i);
    return ch.then(function () { return out; });
  }
  var MAXPX = 12e6;
  // draws page i (0-based) onto a new canvas; width = CSS width, ratio = pixel density, extra = extra rotation
  // opts.forms: leave form fields out (the editor shows them itself, so they can be filled in)
  function renderPage(doc, i, width, ratio, extra, opts) {
    return doc.getPage(i + 1).then(function (page) {
      var rot = (page.rotate + (extra || 0)) % 360;
      var base = page.getViewport({ scale: 1, rotation: rot });
      var scale = (width / base.width) * (ratio || 1);
      if (base.width * base.height * scale * scale > MAXPX) scale = Math.sqrt(MAXPX / (base.width * base.height));
      var vp = page.getViewport({ scale: scale, rotation: rot });
      var cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.floor(vp.width)); cv.height = Math.max(1, Math.floor(vp.height));
      var g = cv.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
      var AM = window.pdfjsLib && window.pdfjsLib.AnnotationMode, rp = { canvasContext: g, viewport: vp };
      if (AM) rp.annotationMode = opts && opts.forms ? AM.ENABLE_FORMS : AM.ENABLE;
      return page.render(rp).promise.then(function () { page.cleanup(); return cv; });
    });
  }
  function thumb(doc, i, width, extra) {
    return renderPage(doc, i, width || 150, Math.min(2, window.devicePixelRatio || 1), extra).then(function (cv) { return cv.toDataURL('image/jpeg', 0.72); });
  }
  function pageCount(bytes) {
    return L.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false }).then(function (d) { return d.getPageCount(); }).catch(function () { return 0; });
  }

  /* ---------- photos to PDF ---------- */
  // one page per picture; pictures shaped like a page fill it, others sit at the top with a margin
  function placeImage(out, img, fit) {
    var land = img.width > img.height * 1.05, W = land ? A4[1] : A4[0], H = land ? A4[0] : A4[1];
    var full = fit === 'page' || (fit !== 'margin' && Math.abs((img.height / img.width) / (H / W) - 1) < 0.12);
    var M = full ? 0 : 28;
    var s = Math.min((W - 2 * M) / img.width, (H - 2 * M) / img.height);
    var w = img.width * s, h = img.height * s;
    var page = out.addPage([W, H]);
    page.drawImage(img, { x: (W - w) / 2, y: full ? (H - h) / 2 : H - M - h, width: w, height: h });
  }
  // items: [{ bytes (jpeg or png), png: bool, fit: 'auto'|'page'|'margin' }]
  function imagesToPdf(items, title) {
    return L.PDFDocument.create().then(function (out) {
      var ch = Promise.resolve();
      items.forEach(function (it) {
        ch = ch.then(function () { return it.png ? out.embedPng(it.bytes) : out.embedJpg(it.bytes); }).then(function (img) { placeImage(out, img, it.fit); });
      });
      return ch.then(function () { stampMeta(out, title); return out.save({ useObjectStreams: true }); });
    });
  }
  // any photo file -> JPEG bytes no bigger than maxSide
  function photoJpg(bytes, mime, maxSide, q) {
    return loadImage(bytes, mime).then(function (im) {
      var s = Math.min(1, (maxSide || 2200) / Math.max(im.naturalWidth, im.naturalHeight));
      var cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(im.naturalWidth * s)); cv.height = Math.max(1, Math.round(im.naturalHeight * s));
      var g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(im, 0, 0, cv.width, cv.height);
      return canvasJpg(cv, q || 0.85);
    });
  }

  /* ---------- merge ---------- */
  // list: [{ bytes, name, kind: 'pdf'|'image', mime }]
  function merge(list, title) {
    var out;
    return L.PDFDocument.create().then(function (d) {
      out = d;
      var ch = Promise.resolve();
      list.forEach(function (f) {
        ch = ch.then(function () {
          if (f.kind === 'image') return photoJpg(f.bytes, f.mime).then(function (j) { return out.embedJpg(j); }).then(function (img) { placeImage(out, img, 'auto'); });
          return L.PDFDocument.load(f.bytes, { updateMetadata: false }).catch(function (e) {
            if (/encrypt/i.test(String(e && e.message))) throw err(tr('{name} is locked with a password. Remove the password first, then try again.', { name: f.name }), 'locked');
            throw err(tr('{name} could not be opened as a PDF', { name: f.name }), 'bad');
          }).then(function (src) { return out.copyPages(src, src.getPageIndices()); }).then(function (pages) { pages.forEach(function (p) { out.addPage(p); }); });
        });
      });
      return ch;
    }).then(function () { stampMeta(out, title); return out.save({ useObjectStreams: true }); });
  }

  /* ---------- pages: reorder, rotate, delete, copy, take out ---------- */
  // order: [{ p: original page index, r: extra rotation (90/180/270) }]
  function organise(bytes, order, title) {
    return loadEditable(bytes).then(function (doc) {
      var pages = doc.getPages(), used = {}, list = [];
      var ch = Promise.resolve();
      order.forEach(function (o) {
        ch = ch.then(function () {
          if (!used[o.p]) { used[o.p] = 1; list.push(pages[o.p]); return; }
          return doc.copyPages(doc, [o.p]).then(function (c) { list.push(c[0]); });
        });
      });
      return ch.then(function () {
        for (var i = doc.getPageCount() - 1; i >= 0; i--) doc.removePage(i);
        list.forEach(function (pg, k) {
          var r = order[k].r || 0;
          if (r) pg.setRotation(L.degrees(((pg.getRotation().angle || 0) + r) % 360));
          doc.addPage(pg);
        });
        if (title) stampMeta(doc, title);
        return doc.save({ useObjectStreams: true });
      });
    });
  }
  // a new PDF with only some pages (copies, so the original stays as it is)
  function extract(bytes, indices, title) {
    return loadEditable(bytes).then(function (src) {
      return L.PDFDocument.create().then(function (out) {
        return out.copyPages(src, indices).then(function (pages) {
          pages.forEach(function (p) { out.addPage(p); });
          stampMeta(out, title);
          return out.save({ useObjectStreams: true });
        });
      });
    });
  }

  /* ---------- compress ---------- */
  var LEVELS = {
    small: { side: 1300, q: 0.55, dpi: 110, raster: true },
    medium: { side: 1800, q: 0.7, dpi: 150, raster: true },
    high: { side: 2600, q: 0.82, dpi: 0, raster: false }
  };
  function num(o) { return o && o.asNumber ? o.asNumber() : (o && o.numberValue != null ? o.numberValue : NaN); }
  // makes the pictures inside the PDF smaller; text and lines stay as they are
  async function shrinkImages(bytes, o, progress) {
    var doc = await loadEditable(bytes);
    var N = L.PDFName, ctx = doc.context;
    var jobs = ctx.enumerateIndirectObjects().filter(function (x) {
      var s = x[1];
      return s instanceof L.PDFRawStream && s.dict.get(N.of('Subtype')) === N.of('Image');
    });
    for (var k = 0; k < jobs.length; k++) {
      if (progress) progress(k / jobs.length);
      var ref = jobs[k][0], s = jobs[k][1], d = s.dict;
      try {
        if (d.get(N.of('ImageMask')) || d.get(N.of('Decode')) || d.get(N.of('Mask'))) continue;
        var w = num(d.get(N.of('Width'))), h = num(d.get(N.of('Height'))), bpc = num(d.lookup(N.of('BitsPerComponent')));
        if (!(w > 0 && h > 0)) continue;
        var filt = d.lookup(N.of('Filter')), fname = filt instanceof L.PDFArray ? (filt.size() === 1 ? filt.lookup(0) : null) : filt;
        var csObj = d.lookup(N.of('ColorSpace')), comps = 0;
        if (csObj === N.of('DeviceRGB')) comps = 3;
        else if (csObj === N.of('DeviceGray')) comps = 1;
        else if (csObj instanceof L.PDFArray && csObj.lookup(0) === N.of('ICCBased')) { var icc = csObj.lookup(1); var nn = icc && icc.dict ? num(icc.dict.get(N.of('N'))) : 0; if (nn === 1 || nn === 3) comps = nn; }
        if (!comps) continue;
        var scale = Math.min(1, o.side / Math.max(w, h));
        var cv;
        if (fname === N.of('DCTDecode')) {
          if (scale === 1 && s.contents.length < w * h * comps * 0.06) continue; // already small
          var im = await loadImage(s.contents, 'image/jpeg');
          cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(w * scale)); cv.height = Math.max(1, Math.round(h * scale));
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        } else if (fname === N.of('FlateDecode') && bpc === 8 && !d.get(N.of('DecodeParms'))) {
          if (w * h < 250000) continue; // small pictures and icons: leave them sharp
          var raw = L.decodePDFRawStream(s).decode();
          if (raw.length < w * h * comps) continue;
          var full = document.createElement('canvas'); full.width = w; full.height = h;
          var fg = full.getContext('2d'), id = fg.createImageData(w, h), px = id.data;
          for (var p = 0, q = 0; p < w * h; p++) {
            if (comps === 3) { px[q] = raw[p * 3]; px[q + 1] = raw[p * 3 + 1]; px[q + 2] = raw[p * 3 + 2]; }
            else { px[q] = px[q + 1] = px[q + 2] = raw[p]; }
            px[q + 3] = 255; q += 4;
          }
          fg.putImageData(id, 0, 0);
          cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(w * scale)); cv.height = Math.max(1, Math.round(h * scale));
          cv.getContext('2d').drawImage(full, 0, 0, cv.width, cv.height);
        } else continue;
        var jpg = await canvasJpg(cv, o.q);
        if (jpg.length >= s.contents.length * 0.92) continue;
        var nd = ctx.obj({ Type: 'XObject', Subtype: 'Image', Width: cv.width, Height: cv.height, ColorSpace: 'DeviceRGB', BitsPerComponent: 8, Filter: 'DCTDecode' });
        var sm = d.get(N.of('SMask')); if (sm) nd.set(N.of('SMask'), sm);
        var intent = d.get(N.of('Intent')); if (intent) nd.set(N.of('Intent'), intent);
        ctx.assign(ref, L.PDFRawStream.of(nd, jpg));
      } catch (e) { /* leave this picture as it was */ }
    }
    if (progress) progress(1);
    return doc.save({ useObjectStreams: true });
  }
  // every page becomes one picture (for scans and very heavy files)
  async function rasterize(bytes, o, progress, password) {
    var src = await open(bytes, password);
    var out = await L.PDFDocument.create();
    for (var i = 0; i < src.numPages; i++) {
      if (progress) progress(i / src.numPages);
      var info = await pageInfo(src, i);
      var cv = await renderPage(src, i, info.w * o.dpi / 72, 1);
      var img = await out.embedJpg(await canvasJpg(cv, o.q));
      var pg = out.addPage([info.w, info.h]);
      pg.drawImage(img, { x: 0, y: 0, width: info.w, height: info.h });
      cv.width = cv.height = 1;
    }
    src.destroy();
    stampMeta(out);
    return out.save({ useObjectStreams: true });
  }
  // a copy without the password: every page is kept as a picture
  function unlock(bytes, password, progress) { return rasterize(bytes, { dpi: 170, q: 0.85 }, progress, password); }
  // returns { bytes, method: 'images' | 'pictures' | 'none' }
  async function compress(bytes, level, progress) {
    var o = LEVELS[level] || LEVELS.medium;
    var best = { bytes: bytes, method: 'none' };
    var a = null;
    try { a = await shrinkImages(bytes, o, function (f) { if (progress) progress(f * (o.raster ? 0.5 : 1)); }); } catch (e) { if (e.code === 'locked') throw e; }
    if (a && a.length < best.bytes.length) best = { bytes: a, method: 'images' };
    if (o.raster && best.bytes.length > bytes.length * 0.7) {
      try {
        var b = await rasterize(bytes, o, function (f) { if (progress) progress(0.5 + f * 0.5); });
        if (b.length < best.bytes.length * 0.8) best = { bytes: b, method: 'pictures' };
      } catch (e2) { if (!a) throw e2; }
    }
    if (progress) progress(1);
    return best;
  }

  /* ---------- watermark (protect an ID copy) ---------- */
  // o: { text, color: [r,g,b] 0-1, opacity, size: 'light'|'medium'|'strong' }
  async function watermark(bytes, o) {
    var doc = await loadEditable(bytes);
    doc.registerFontkit(window.fontkit);
    var font = await doc.embedFont(await fontBytes('dmsans-700'), { subset: true });
    var col = L.rgb(o.color[0], o.color[1], o.color[2]);
    var line = String(o.text || '').trim() + '      ';
    doc.getPages().forEach(function (page) {
      var mb = page.getMediaBox(), W = mb.width, H = mb.height;
      var fs = Math.max(9, Math.min(W, H) / 30);
      var unit = font.widthOfTextAtSize(line, fs) || 100;
      var diag = Math.sqrt(W * W + H * H);
      var full = new Array(Math.ceil(diag * 1.3 / unit) + 1).join(line);
      var len = font.widthOfTextAtSize(full, fs);
      var ang = 30 * Math.PI / 180, dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx;
      var step = fs * 5, n = Math.ceil(diag / step / 2) + 1, cx = mb.x + W / 2, cy = mb.y + H / 2;
      for (var k = -n; k <= n; k++) {
        var x = cx + px * k * step - dx * len / 2, y = cy + py * k * step - dy * len / 2;
        page.drawText(full, { x: x, y: y, size: fs, font: font, color: col, opacity: o.opacity, rotate: L.degrees(30) });
      }
    });
    return doc.save({ useObjectStreams: true });
  }

  /* ---------- password (AES-128, opens in every PDF reader) ---------- */
  var MD5K = (function () { var k = []; for (var i = 0; i < 64; i++) k[i] = (Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0; return k; })();
  var MD5S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  function md5(msg) {
    var n = msg.length, padLen = Math.ceil((n + 9) / 64) * 64;
    var buf = new Uint8Array(padLen); buf.set(msg); buf[n] = 0x80;
    var dv = new DataView(buf.buffer), bits = n * 8;
    dv.setUint32(padLen - 8, bits >>> 0, true); dv.setUint32(padLen - 4, Math.floor(bits / 4294967296), true);
    var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476, M = new Uint32Array(16);
    for (var off = 0; off < padLen; off += 64) {
      for (var j = 0; j < 16; j++) M[j] = dv.getUint32(off + j * 4, true);
      var A = a0, B = b0, C = c0, D = d0;
      for (var i = 0; i < 64; i++) {
        var F, g;
        if (i < 16) { F = (B & C) | (~B & D); g = i; }
        else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * i) % 16; }
        F = (F + A + MD5K[i] + M[g]) >>> 0;
        A = D; D = C; C = B;
        var sh = MD5S[(i >> 4) * 4 + (i % 4)];
        B = (B + ((F << sh) | (F >>> (32 - sh)))) >>> 0;
      }
      a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
    }
    var out = new Uint8Array(16), ov = new DataView(out.buffer);
    ov.setUint32(0, a0, true); ov.setUint32(4, b0, true); ov.setUint32(8, c0, true); ov.setUint32(12, d0, true);
    return out;
  }
  function rc4(key, data) {
    var s = new Uint8Array(256), i, j = 0, t;
    for (i = 0; i < 256; i++) s[i] = i;
    for (i = 0; i < 256; i++) { j = (j + s[i] + key[i % key.length]) & 255; t = s[i]; s[i] = s[j]; s[j] = t; }
    var out = new Uint8Array(data.length); i = 0; j = 0;
    for (var k = 0; k < data.length; k++) { i = (i + 1) & 255; j = (j + s[i]) & 255; t = s[i]; s[i] = s[j]; s[j] = t; out[k] = data[k] ^ s[(s[i] + s[j]) & 255]; }
    return out;
  }
  function cat() { var n = 0, i; for (i = 0; i < arguments.length; i++) n += arguments[i].length; var o = new Uint8Array(n), p = 0; for (i = 0; i < arguments.length; i++) { o.set(arguments[i], p); p += arguments[i].length; } return o; }
  var PAD = new Uint8Array([0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41, 0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08, 0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80, 0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A]);
  function padPw(pw) {
    var b = []; for (var i = 0; i < pw.length && b.length < 32; i++) { var c = pw.charCodeAt(i); b.push(c < 256 ? c : 63); }
    var out = new Uint8Array(32); out.set(b); out.set(PAD.subarray(0, 32 - b.length), b.length); return out;
  }
  function hex(b) { var s = ''; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16); return s; }
  function rand(n) { var b = new Uint8Array(n); crypto.getRandomValues(b); return b; }
  function md5x50(h, n) { for (var i = 0; i < 50; i++) h = md5(h.subarray(0, n)); return h; }
  function rc4x20(key, data) { var out = rc4(key, data); for (var i = 1; i <= 19; i++) { var k = new Uint8Array(key.length); for (var j = 0; j < key.length; j++) k[j] = key[j] ^ i; out = rc4(k, out); } return out; }

  async function protect(bytes, userPw) {
    var N = L.PDFName;
    var first = await loadEditable(bytes);
    if (first.isEncrypted) throw err(tr('This PDF is locked with a password.'), 'locked');
    var plain = await first.save({ useObjectStreams: false, updateFieldAppearances: false });
    var doc = await L.PDFDocument.load(plain, { updateMetadata: false });
    var ctx = doc.context;
    var id = rand(16), P = -4;
    var ownerPw = hex(rand(12));
    // owner entry (algorithm 3) and file key (algorithm 2), user entry (algorithm 5)
    var okey = md5x50(md5(padPw(ownerPw)), 16);
    var O = rc4x20(okey, padPw(userPw));
    var pb = new Uint8Array(4); new DataView(pb.buffer).setInt32(0, P, true);
    var key = md5x50(md5(cat(padPw(userPw), O, pb, id)), 16);
    var U = cat(rc4x20(key, md5(cat(PAD, id))), rand(16));
    var subtle = window.crypto && window.crypto.subtle;
    if (!subtle) throw err(tr('This phone cannot add a password to a PDF.'));
    var SALT = new Uint8Array([0x73, 0x41, 0x6C, 0x54]);
    function objKey(ref) {
      var b = new Uint8Array(5), n = ref.objectNumber, g = ref.generationNumber;
      b[0] = n & 255; b[1] = (n >> 8) & 255; b[2] = (n >> 16) & 255; b[3] = g & 255; b[4] = (g >> 8) & 255;
      return md5(cat(key, b, SALT));
    }
    async function aes(k, data) {
      var iv = rand(16);
      var ck = await subtle.importKey('raw', k, { name: 'AES-CBC' }, false, ['encrypt']);
      var enc = new Uint8Array(await subtle.encrypt({ name: 'AES-CBC', iv: iv }, ck, data));
      return cat(iv, enc);
    }
    async function strings(obj, k) {
      if (obj instanceof L.PDFString || obj instanceof L.PDFHexString) return L.PDFHexString.of(hex(await aes(k, obj.asBytes())));
      if (obj instanceof L.PDFDict) {
        var ents = obj.entries();
        for (var i = 0; i < ents.length; i++) { var nv = await strings(ents[i][1], k); if (nv !== ents[i][1]) obj.set(ents[i][0], nv); }
        return obj;
      }
      if (obj instanceof L.PDFArray) {
        for (var j = 0; j < obj.size(); j++) { var v = obj.get(j), nv2 = await strings(v, k); if (nv2 !== v) obj.set(j, nv2); }
        return obj;
      }
      return obj;
    }
    var list = ctx.enumerateIndirectObjects();
    for (var i = 0; i < list.length; i++) {
      var ref = list[i][0], obj = list[i][1], k = objKey(ref);
      if (obj instanceof L.PDFRawStream) {
        var t = obj.dict.get(N.of('Type'));
        if (t === N.of('XRef')) continue;
        await strings(obj.dict, k);
        ctx.assign(ref, L.PDFRawStream.of(obj.dict, await aes(k, obj.contents)));
      } else if (obj instanceof L.PDFStream) {
        await strings(obj.dict, k);
        ctx.assign(ref, L.PDFRawStream.of(obj.dict, await aes(k, obj.getContents())));
      } else {
        await strings(obj, k);
      }
    }
    var enc = ctx.obj({
      Filter: 'Standard', V: 4, R: 4, Length: 128, P: P,
      CF: { StdCF: { AuthEvent: 'DocOpen', CFM: 'AESV2', Length: 16 } }, StmF: 'StdCF', StrF: 'StdCF'
    });
    enc.set(N.of('O'), L.PDFHexString.of(hex(O)));
    enc.set(N.of('U'), L.PDFHexString.of(hex(U)));
    ctx.trailerInfo.Encrypt = ctx.register(enc);
    ctx.trailerInfo.ID = ctx.obj([L.PDFHexString.of(hex(id)), L.PDFHexString.of(hex(id))]);
    return doc.save({ useObjectStreams: false, updateFieldAppearances: false });
  }

  /* ---------- fill & sign ---------- */
  function invert(t) {
    var a = t[0], b = t[1], c = t[2], d = t[3], e = t[4], f = t[5], det = a * d - b * c;
    return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
  }
  function apply(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
  /* marks: [{ page, type: 'text'|'check'|'cross'|'img'|'white'|'ink'|'hl'|'rect'|'line'|'redact', x, y, w, h, size, color, text, src, pts, lw }]
     All positions are in points on the page as it is shown (top-left origin).
     text: font (any of the app's fonts), bold, italic, u (underline), s (strike-through), lh (line height as a share of the size),
     w (box width), wrap (lines wrap at w), align ('center': each line centred in the box).
     white: fill (colour of the cover), eb (band of a line of text to take out of the PDF, see CVPdfEdit.eraseText).
     line: from (x, y) to (x + w, y + h), arrow. redact: a black box; every letter under it is taken out of the PDF, and when it
     also covers a picture, a drawing, a form field or text that cannot be measured, that page is saved as a picture.
     info: page info from pageInfo() for every page; asc: text baseline as a share of the font size (a number, or one per font).
     opt.form: { field name: value } for the PDF's own form fields (text, true/false for tick boxes, the option for the others);
     opt.formMarks: marks that show those values when the file has to be rebuilt from pictures (locked files).
     opt.pnum: page numbers { pos: 'bc'|'br'|'bl'|'tc'|'tr'|'tl', fmt: 0-3, start, skip (none on the first page) }.
     opt.report: an object that gets the number of pieces of original text taken out ({ erased }).
     Returns { bytes, flat, pictured: [indexes of pages saved as pictures because of a black-out] }. */
  var EDIT_FONTS = { libsans: [400, 700], libserif: [400, 700] }, ITALIC = { roboto: 1, carlito: 1, caladea: 1, libsans: 1, libserif: 1 };
  function fontFile(fam, bold, italic) {
    var have = (window.CV_FONTS || {})[fam] || EDIT_FONTS[fam];
    if (!have) { fam = 'roboto'; have = [400, 700]; }
    var want = bold ? 700 : 400, w = have.slice().sort(function (a, b) { return Math.abs(a - want) - Math.abs(b - want) || b - a; })[0];
    var it = !!italic && !!ITALIC[fam];
    return { id: fam + '-' + w + (it ? 'i' : ''), skew: !!italic && !it };
  }
  // the lines a text mark is written on: its own lines, and when it wraps, broken between words to fit the box
  function textRows(m, measure) {
    var rows = [];
    String(m.text || '').replace(/\t/g, '    ').split('\n').forEach(function (para) {
      if (!m.wrap || !m.w) { rows.push(para); return; }
      var line = '';
      para.split(' ').forEach(function (word) {
        var t = line ? line + ' ' + word : word;
        if (!line || measure(t) <= m.w + 0.01) { line = t; }
        else { rows.push(line); line = word; }
        // a word longer than the box is broken
        while (measure(line) > m.w + 0.01 && line.length > 1) {
          var k = line.length - 1; while (k > 1 && measure(line.slice(0, k)) > m.w) k--;
          rows.push(line.slice(0, k)); line = line.slice(k);
        }
      });
      rows.push(line);
    });
    return rows;
  }
  function overlap(a, b) { return a[0] < b[0] + b[2] && a[0] + a[2] > b[0] && a[1] < b[1] + b[3] && a[1] + a[3] > b[1]; }
  function markBox(m) {
    if (m.type === 'ink') { var xs = m.pts.map(function (p) { return p[0]; }), ys = m.pts.map(function (p) { return p[1]; }); return [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs) - Math.min.apply(null, xs), Math.max.apply(null, ys) - Math.min.apply(null, ys)]; }
    if (m.type === 'text') { var n = String(m.text || '').split('\n'), lw = Math.max.apply(null, n.map(function (x) { return x.length; })) * m.size * 0.62; return [m.align === 'center' && !m.wrap ? m.x + (m.w || 0) / 2 - lw / 2 : m.x, m.y, m.wrap && m.w ? m.w : lw, m.size * (m.lh || 1.15) * (n.length + (m.wrap ? 6 : 0))]; }
    if (m.type === 'line') return [Math.min(m.x, m.x + m.w), Math.min(m.y, m.y + m.h), Math.abs(m.w), Math.abs(m.h)];
    return [m.x, m.y, m.w, m.h];
  }
  var PNUM = ['{n}', 'Page {n} of {total}', '{n} / {total}', 'Page {n}'];
  function pnumText(pn, k, count) {
    var first = pn.skip ? 1 : 0; if (k < first) return '';
    var start = Math.max(0, Math.round(+pn.start || 1)), n = start + k - first, total = start + count - first - 1;
    return (PNUM[pn.fmt] || PNUM[0]).replace('{n}', n).replace('{total}', total);
  }
  async function addMarks(bytes, marks, info, opt) {
    opt = opt || {};
    marks = marks.slice();
    var doc = null, flat = false;
    try { doc = await loadEditable(bytes); if (doc.isEncrypted) doc = null; } catch (e) { doc = null; }
    if (!doc) {
      // locked or damaged files: rebuild from pictures of the pages, then add the marks
      flat = true;
      var src = await open(bytes, opt.password);
      doc = await L.PDFDocument.create();
      for (var pi = 0; pi < src.numPages; pi++) {
        var inf = info[pi], cv = await renderPage(src, pi, inf.w * 200 / 72, 1);
        var img = await doc.embedJpg(await canvasJpg(cv, 0.85));
        doc.addPage([inf.w, inf.h]).drawImage(img, { x: 0, y: 0, width: inf.w, height: inf.h });
        info[pi] = { w: inf.w, h: inf.h, rotate: 0, t: [1, 0, 0, -1, 0, inf.h] };
      }
      src.destroy();
    }
    doc.registerFontkit(window.fontkit);
    var fonts = {};
    async function font(id, full) {
      var k = id + (full ? '*' : '');
      if (!fonts[k]) fonts[k] = await doc.embedFont(await fontBytes(id), { subset: !full });
      return fonts[k];
    }
    var pages = doc.getPages(), PE = window.CVPdfEdit;
    // the PDF's own form fields
    var formVals = opt.form && Object.keys(opt.form).length ? opt.form : null;
    if (formVals && flat) marks = marks.concat(opt.formMarks || []);
    if (formVals && !flat) {
      var form = null; try { form = doc.getForm(); } catch (e) { form = null; }
      if (form) {
        Object.keys(formVals).forEach(function (name) {
          var v = formVals[name], f = null;
          try { f = form.getField(name); } catch (e) { return; }
          try {
            if (f instanceof L.PDFTextField) {
              var tv = String(v == null ? '' : v), ml = f.getMaxLength(); if (ml != null && tv.length > ml) tv = tv.slice(0, ml);
              // a box for several lines with "automatic" size would get one huge line: use a normal size
              if (f.isMultiline()) { var da = ''; try { da = f.acroField.getDefaultAppearance() || ''; } catch (e) { da = ''; } var dm = /(\d+(?:\.\d+)?)\s+Tf/.exec(da); if (!dm || +dm[1] === 0 || +dm[1] > 14) f.setFontSize(10); }
              f.setText(tv);
            }
            else if (f instanceof L.PDFCheckBox) { if (v) f.check(); else f.uncheck(); }
            else if (f instanceof L.PDFRadioGroup) {
              // pdf.js names a radio button by its appearance; with an option list that is its place in the list
              var ro = f.getOptions(), rv = String(v || '');
              if (ro.indexOf(rv) < 0 && /^\d+$/.test(rv) && ro[+rv] != null) rv = ro[+rv];
              if (rv) f.select(rv); else f.clear();
            }
            else if (f instanceof L.PDFDropdown || f instanceof L.PDFOptionList) { if (v) f.select(String(v)); else f.clear(); }
          } catch (e) { /* this field keeps what it had */ }
        });
        try { form.updateFieldAppearances(await font('roboto-400', true)); } catch (e) { /* the viewer draws them */ }
      }
    }
    // replaced lines: take the original words out of the page first (not on pictures of locked files)
    // when the words really came out, the white cover is not needed (it would also hide lines and colours under it)
    var erased = 0, clean = [];
    if (!flat && PE) {
      var bands = {};
      marks.forEach(function (m) { if (m.type === 'white' && m.eb) (bands[m.page] = bands[m.page] || []).push(m); });
      Object.keys(bands).forEach(function (pg) {
        if (!info[pg]) return;
        var st = [];
        try { erased += PE.eraseText(doc, +pg, bands[pg].map(function (m) { return m.eb; }), info[pg].t, st); } catch (e) { st = []; /* the cover still hides it */ }
        bands[pg].forEach(function (m, k) { if (m.key && st[k] && st[k].removed && !st[k].kept) clean.push(m); });
      });
    }
    // black-out: every letter under a box goes; pages where it covers more than text become pictures
    var red = {}, pictured = [];
    marks.forEach(function (m) { if (m.type === 'redact' && pages[m.page]) (red[m.page] = red[m.page] || []).push([m.x, m.y, m.w, m.h]); });
    Object.keys(red).forEach(function (pg) {
      var k = +pg, boxes = red[pg], pic = flat;
      if (!pic && PE) {
        var r = { unsure: true }, pb = null;
        try { r = PE.eraseArea(doc, k, boxes, info[k].t); erased += r.removed; } catch (e) { r = { unsure: true }; }
        try { pb = PE.paintBoxes(doc, k, info[k].t); } catch (e) { pb = null; }
        pic = r.unsure || !pb || pb.some(function (b) { return boxes.some(function (x) { return overlap(b, x); }); });
      } else if (!PE) pic = true;
      // things added in the editor under a black box
      if (!pic) pic = marks.some(function (m) { return m.page === k && m.type !== 'redact' && m.type !== 'white' && m.type !== 'hl' && boxes.some(function (x) { return overlap(markBox(m), x); }); });
      if (pic) pictured.push(k);
    });
    if (opt.report) opt.report.erased = erased;
    function ascOf(f) { var a = opt.asc; return typeof a === 'object' && a ? (a[f || 'roboto'] || a.roboto || 0.92) : (a || 0.92); }
    var order = marks.filter(function (m) { return m.type !== 'redact'; }).concat(marks.filter(function (m) { return m.type === 'redact'; }));
    for (var i = 0; i < order.length; i++) {
      var m = order[i], page = pages[m.page], pinf = info[m.page];
      if (!page || !pinf) continue;
      var inv = invert(pinf.t), rot = L.degrees(pinf.rotate || 0);
      var c = hexColor(m.color || '#1B3C8C');
      var P = function (x, y) { return apply(inv, x, y); };
      if (m.type === 'text') {
        var ff = fontFile(m.font, m.bold, m.italic), f = await font(ff.id), lhf = m.lh || 1.15, lh = m.size * lhf;
        var meas = function (t) { return f.widthOfTextAtSize(t, m.size); }, rows = textRows(m, meas);
        var base0 = m.y + m.size * (ascOf(m.font) + (lhf - 1.15) / 2);
        for (var li = 0; li < rows.length; li++) {
          var row = rows[li]; if (!row) continue;
          var tw = meas(row), x0 = m.align === 'center' ? m.x + ((m.w || tw) - tw) / 2 : m.x, by = base0 + li * lh, o = P(x0, by);
          var dopt = { x: o[0], y: o[1], size: m.size, font: f, color: c, rotate: rot };
          if (ff.skew) dopt.ySkew = L.degrees(12);
          page.drawText(row, dopt);
          [[m.u, m.size * 0.13], [m.s, -m.size * 0.27]].forEach(function (d) {
            if (!d[0]) return;
            var a1 = P(x0, by + d[1]), a2 = P(x0 + tw, by + d[1]);
            page.drawLine({ start: { x: a1[0], y: a1[1] }, end: { x: a2[0], y: a2[1] }, thickness: Math.max(0.4, m.size * 0.06), color: c });
          });
        }
      } else if (m.type === 'img') {
        var data = dataUrlBytes(m.src);
        if (!data) continue;
        var emb = /^data:image\/png/.test(m.src) ? await doc.embedPng(data) : await doc.embedJpg(data);
        var bl = P(m.x, m.y + m.h);
        page.drawImage(emb, { x: bl[0], y: bl[1], width: m.w, height: m.h, rotate: rot });
      } else if (m.type === 'white' || m.type === 'redact') {
        if (clean.indexOf(m) >= 0) continue;
        var b2 = P(m.x, m.y + m.h);
        page.drawRectangle({ x: b2[0], y: b2[1], width: m.w, height: m.h, color: m.type === 'redact' ? L.rgb(0, 0, 0) : m.fill ? hexColor(m.fill) : L.rgb(1, 1, 1), rotate: rot });
      } else if (m.type === 'hl') {
        var b3 = P(m.x, m.y + m.h);
        page.drawRectangle({ x: b3[0], y: b3[1], width: m.w, height: m.h, color: hexColor(m.color || '#FFE14D'), opacity: 0.42, blendMode: L.BlendMode.Multiply, rotate: rot });
      } else if (m.type === 'rect') {
        var b4 = P(m.x, m.y + m.h), lw4 = m.lw || 1.5;
        page.drawRectangle({ x: b4[0], y: b4[1], width: m.w, height: m.h, borderColor: c, borderWidth: lw4, rotate: rot });
      } else if (m.type === 'line') {
        var lw5 = m.lw || 1.5, a1 = P(m.x, m.y), a2 = P(m.x + m.w, m.y + m.h);
        page.drawLine({ start: { x: a1[0], y: a1[1] }, end: { x: a2[0], y: a2[1] }, thickness: lw5, color: c, lineCap: L.LineCapStyle.Round });
        if (m.arrow) {
          // two short lines at the end make the arrow head (worked out on the page as shown, then turned into PDF points)
          var ang = Math.atan2(m.h, m.w), hl = Math.max(6, lw5 * 4);
          [ang + Math.PI - 0.5, ang + Math.PI + 0.5].forEach(function (aa) {
            var e = P(m.x + m.w + Math.cos(aa) * hl, m.y + m.h + Math.sin(aa) * hl);
            page.drawLine({ start: { x: a2[0], y: a2[1] }, end: { x: e[0], y: e[1] }, thickness: lw5, color: c, lineCap: L.LineCapStyle.Round });
          });
        }
      } else {
        var pts = m.type === 'check' ? [[[0.1, 0.55], [0.38, 0.84], [0.92, 0.14]]] :
          m.type === 'cross' ? [[[0.14, 0.14], [0.86, 0.86]], [[0.86, 0.14], [0.14, 0.86]]] : [m.pts];
        var lw = m.type === 'ink' ? (m.lw || 1.6) : Math.max(1, Math.min(m.w, m.h) * 0.13);
        pts.forEach(function (stroke) {
          var d = '';
          stroke.forEach(function (p, k) {
            var x = m.type === 'ink' ? p[0] : m.x + p[0] * m.w, y = m.type === 'ink' ? p[1] : m.y + p[1] * m.h;
            var q = P(x, y);
            d += (k ? ' L ' : 'M ') + q[0].toFixed(2) + ' ' + (-q[1]).toFixed(2);
          });
          if (stroke.length === 1) { var q1 = P(stroke[0][0], stroke[0][1]); d += ' L ' + (q1[0] + 0.1).toFixed(2) + ' ' + (-q1[1]).toFixed(2); }
          page.drawSvgPath(d, { x: 0, y: 0, borderColor: c, borderWidth: lw, borderLineCap: L.LineCapStyle.Round });
        });
      }
    }
    // page numbers
    if (opt.pnum) {
      var pn = opt.pnum, pfont = await font('libsans-400'), pos = pn.pos || 'bc', grey = L.rgb(0.27, 0.27, 0.27);
      for (var k = 0; k < pages.length; k++) {
        var txt = pnumText(pn, k, pages.length), pinf2 = info[k] || { w: pages[k].getWidth(), h: pages[k].getHeight(), rotate: 0, t: [1, 0, 0, -1, 0, pages[k].getHeight()] };
        if (!txt) continue;
        var tw2 = pfont.widthOfTextAtSize(txt, 10), mx = 36;
        var px = pos[1] === 'l' ? mx : pos[1] === 'r' ? pinf2.w - mx - tw2 : (pinf2.w - tw2) / 2, py = pos[0] === 't' ? 30 : pinf2.h - 24;
        var q2 = apply(invert(pinf2.t), px, py);
        pages[k].drawText(txt, { x: q2[0], y: q2[1], size: 10, font: pfont, color: grey, rotate: L.degrees(pinf2.rotate || 0) });
      }
    }
    if (opt.title) stampMeta(doc, opt.title);
    var out = await doc.save({ useObjectStreams: true });
    if (pictured.length) out = await picturePages(out, pictured, info);
    return { bytes: out, flat: flat, pictured: pictured };
  }
  // pages saved as one picture each (after a black-out), with their form fields taken out of the file
  async function picturePages(bytes, list, info) {
    var src = await open(bytes), d2 = await L.PDFDocument.load(bytes, { updateMetadata: false }), form = null;
    try { form = d2.getForm(); } catch (e) { form = null; }
    for (var j = 0; j < list.length; j++) {
      var k = list[j], inf = info[k], cv = await renderPage(src, k, inf.w * 200 / 72, 1);
      var img = await d2.embedJpg(await canvasJpg(cv, 0.88));
      cv.width = cv.height = 1;
      if (form) {
        var page = d2.getPage(k), annots = page.node.Annots(), set = [];
        if (annots) for (var a = 0; a < annots.size(); a++) set.push(annots.lookup(a));
        form.getFields().forEach(function (f) {
          try { if (f.acroField.getWidgets().some(function (w) { return set.indexOf(w.dict) >= 0; })) form.removeField(f); } catch (e) { /* ignore */ }
        });
      }
      var np = d2.insertPage(k, [inf.w, inf.h]);
      np.drawImage(img, { x: 0, y: 0, width: inf.w, height: inf.h });
      d2.removePage(k + 1);
      info[k] = { w: inf.w, h: inf.h, rotate: 0, t: [1, 0, 0, -1, 0, inf.h] };
    }
    src.destroy();
    return d2.save({ useObjectStreams: true });
  }
  function hexColor(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(h) || [0, '1B3C8C'], n = parseInt(m[1], 16);
    return L.rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  }

  /* ---------- PDF to photos ---------- */
  // returns [{ bytes, page }] JPEG pictures, width in pixels
  async function toPhotos(doc, pages, width, progress) {
    var out = [];
    for (var k = 0; k < pages.length; k++) {
      if (progress) progress(k / pages.length);
      var info = await pageInfo(doc, pages[k]);
      var w = info.w > info.h ? Math.round(width * 1.414) : width;
      var cv = await renderPage(doc, pages[k], w, 1);
      out.push({ bytes: await canvasJpg(cv, 0.88), page: pages[k] });
      cv.width = cv.height = 1;
    }
    if (progress) progress(1);
    return out;
  }

  window.CVPdfTools = {
    pdfjs: pdfjs, loadScript: loadScript, isPdf: isPdf, readBytes: readBytes, canvasJpg: canvasJpg, loadImage: loadImage,
    open: open, pageInfo: pageInfo, allPageInfo: allPageInfo, renderPage: renderPage, thumb: thumb, pageCount: pageCount,
    imagesToPdf: imagesToPdf, photoJpg: photoJpg, merge: merge, organise: organise, extract: extract,
    compress: compress, unlock: unlock, watermark: watermark, protect: protect, addMarks: addMarks, toPhotos: toPhotos,
    fontFile: fontFile, textRows: textRows, pnumText: pnumText,
    md5: md5, rc4: rc4, A4: A4
  };
  if (window.CVLibs) window.CVLibs.wrap(window.CVPdfTools, ['pageCount', 'imagesToPdf', 'merge', 'organise', 'extract', 'compress', 'unlock',
    'watermark', 'protect', 'addMarks', 'toPhotos'], 'pdf');
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/pdfedit.js */
try {
/* Edit PDF engine (no screens here): changing the text that is already in a PDF, and page operations.
   - eraseText: takes the original words out of a page's content, so a replaced line is really gone
     (not only covered): job websites and anyone copying the text get the new words only.
   - editPages: rotate, delete, add a blank page, move a page.
   - lines / paragraphs: the text on a page (pdf.js), with position, size and font, for "Edit text" and PDF to Word.
   - eraseArea / paintBoxes: black-out takes out every letter under a box, and finds pictures or drawings under it.
   Everything happens on the phone. */
(function () {
  'use strict';
  var L = function () { return window.PDFLib; };

  /* ---------- matrices (PDF order: [a b c d e f], points are row vectors) ---------- */
  function mul(m, n) {
    return [m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3], m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3],
      m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5]];
  }
  function apply(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
  var ID = [1, 0, 0, 1, 0, 0];

  /* ---------- reading a content stream ---------- */
  var WS = { 0: 1, 9: 1, 10: 1, 12: 1, 13: 1, 32: 1 };
  var DELIM = { 40: 1, 41: 1, 60: 1, 62: 1, 91: 1, 93: 1, 123: 1, 125: 1, 47: 1, 37: 1 };
  // splits the content into operators: [{ op, args, start, end }] (start/end are byte offsets of the whole operator with its operands)
  function parse(b) {
    var i = 0, n = b.length, ops = [], args = [], argStart = -1, stack = [];
    function push(v, at) { if (stack.length) stack[stack.length - 1].push(v); else { if (argStart < 0) argStart = at; args.push(v); } }
    while (i < n) {
      var c = b[i];
      if (WS[c]) { i++; continue; }
      if (c === 37) { while (i < n && b[i] !== 10 && b[i] !== 13) i++; continue; } // % comment
      var at = i;
      if (c === 40) { // (literal string)
        var out = [], depth = 1; i++;
        while (i < n && depth) {
          var d = b[i++];
          if (d === 92) {
            var e = b[i++];
            if (e === 110) out.push(10); else if (e === 114) out.push(13); else if (e === 116) out.push(9); else if (e === 98) out.push(8); else if (e === 102) out.push(12);
            else if (e >= 48 && e <= 55) { var o = e - 48, k = 0; while (k < 2 && b[i] >= 48 && b[i] <= 55) { o = o * 8 + b[i++] - 48; k++; } out.push(o & 255); }
            else if (e === 13) { if (b[i] === 10) i++; } else if (e === 10) { /* line continuation */ } else out.push(e);
          } else if (d === 40) { depth++; out.push(d); } else if (d === 41) { depth--; if (depth) out.push(d); } else out.push(d);
        }
        push({ s: out }, at); continue;
      }
      if (c === 60 && b[i + 1] !== 60) { // <hex string>
        i++; var hx = '';
        while (i < n && b[i] !== 62) { var h = b[i++]; if (!WS[h]) hx += String.fromCharCode(h); }
        i++; if (hx.length % 2) hx += '0';
        var hb = []; for (var j = 0; j < hx.length; j += 2) hb.push(parseInt(hx.substr(j, 2), 16) || 0);
        push({ s: hb }, at); continue;
      }
      if (c === 60 || c === 91) { // << dict or [ array
        var arr = []; arr.dict = c === 60; push(arr, at); stack.push(arr); i += c === 60 ? 2 : 1; continue;
      }
      if ((c === 62 && b[i + 1] === 62) || c === 93) { stack.pop(); i += c === 93 ? 1 : 2; continue; }
      if (c === 47) { // /Name
        i++; var nm = ''; while (i < n && !WS[b[i]] && !DELIM[b[i]]) nm += String.fromCharCode(b[i++]);
        push({ n: nm }, at); continue;
      }
      if (c === 123 || c === 125 || c === 41 || c === 62) { i++; continue; } // stray delimiters
      var w = ''; while (i < n && !WS[b[i]] && !DELIM[b[i]]) w += String.fromCharCode(b[i++]);
      if (/^[+\-]?(\d+\.?\d*|\.\d+)$/.test(w)) { push(+w, at); continue; }
      if (w === 'true' || w === 'false' || w === 'null') { push(w, at); continue; }
      if (stack.length) { stack = []; } // an operator inside an unclosed array: give up on that array
      if (w === 'BI') { // inline image: skip its data up to EI
        var s0 = argStart < 0 ? at : argStart, idp = findId(b, i), p = idp < 0 ? n : findEI(b, idp);
        ops.push({ op: 'BI', args: [], start: s0, end: p }); i = p; args = []; argStart = -1; continue;
      }
      ops.push({ op: w, args: args, start: argStart < 0 ? at : argStart, end: i });
      args = []; argStart = -1;
    }
    return ops;
  }
  function findId(b, i) { for (; i < b.length - 1; i++) if (b[i] === 73 && b[i + 1] === 68 && WS[b[i - 1]] && (WS[b[i + 2]] || i + 2 >= b.length)) return i + 3; return -1; }
  function findEI(b, i) { for (; i < b.length - 1; i++) if (b[i] === 69 && b[i + 1] === 73 && WS[b[i - 1]] && (i + 2 >= b.length || WS[b[i + 2]])) return i + 2; return b.length; }

  /* ---------- font widths, to know how far each piece of text moves on ---------- */
  var STD14 = { Helvetica: 'Helvetica', 'Helvetica-Bold': 'Helvetica-Bold', 'Helvetica-Oblique': 'Helvetica-Oblique', 'Helvetica-BoldOblique': 'Helvetica-BoldOblique',
    'Times-Roman': 'Times-Roman', 'Times-Bold': 'Times-Bold', 'Times-Italic': 'Times-Italic', 'Times-BoldItalic': 'Times-BoldItalic',
    Courier: 'Courier', 'Courier-Bold': 'Courier-Bold', 'Courier-Oblique': 'Courier-Oblique', 'Courier-BoldOblique': 'Courier-BoldOblique',
    Arial: 'Helvetica', 'Arial,Bold': 'Helvetica-Bold', 'Arial,Italic': 'Helvetica-Oblique', 'Arial,BoldItalic': 'Helvetica-BoldOblique',
    TimesNewRoman: 'Times-Roman', 'TimesNewRoman,Bold': 'Times-Bold', 'TimesNewRoman,Italic': 'Times-Italic', 'TimesNewRoman,BoldItalic': 'Times-BoldItalic' };
  // Windows-1252 letters 128-159
  var WIN = ['\u20AC', '', '\u201A', '\u0192', '\u201E', '\u2026', '\u2020', '\u2021', '\u02C6', '\u2030', '\u0160', '\u2039', '\u0152', '', '\u017D', '',
    '', '\u2018', '\u2019', '\u201C', '\u201D', '\u2022', '\u2013', '\u2014', '\u02DC', '\u2122', '\u0161', '\u203A', '\u0153', '', '\u017E', '\u0178'];
  function num(v) { var P = L(); if (v instanceof P.PDFNumber) return v.asNumber(); return typeof v === 'number' ? v : null; }
  function fontInfo(doc, res, name, cache) {
    if (cache[name]) return cache[name];
    var P = L(), info = { ok: false };
    try {
      var fonts = res && res.lookup(P.PDFName.of('Font'), P.PDFDict);
      var f = fonts && fonts.lookup(P.PDFName.of(name), P.PDFDict);
      if (f) {
        var sub = f.lookup(P.PDFName.of('Subtype'));
        sub = sub ? sub.toString() : '';
        if (sub === '/Type0') {
          var enc = f.lookup(P.PDFName.of('Encoding'));
          var df = f.lookup(P.PDFName.of('DescendantFonts'), P.PDFArray);
          var cid = df && df.lookup(0, P.PDFDict);
          if (enc && /Identity-[HV]/.test(enc.toString()) && cid) {
            var W = {}, dw = num(cid.lookup(P.PDFName.of('DW'))) || 1000, warr = cid.lookupMaybe(P.PDFName.of('W'), P.PDFArray);
            if (warr) {
              var a = warr.asArray(), k = 0;
              while (k < a.length) {
                var c0 = num(warr.lookup(k)), nx = warr.lookup(k + 1);
                if (nx instanceof P.PDFArray) { for (var j = 0; j < nx.size(); j++) W[c0 + j] = num(nx.lookup(j)); k += 2; }
                else { var c1 = num(nx), wv = num(warr.lookup(k + 2)); for (var cc = c0; cc <= c1 && cc - c0 < 65536; cc++) W[cc] = wv; k += 3; }
              }
            }
            info = { ok: true, two: true, W: W, dw: dw };
          }
        } else if (sub !== '/Type3') {
          var first = num(f.lookup(P.PDFName.of('FirstChar'))), wa = f.lookupMaybe(P.PDFName.of('Widths'), P.PDFArray);
          var bf = String(f.lookup(P.PDFName.of('BaseFont')) || '').replace(/^\//, '');
          if (!wa && STD14[bf] && P.StandardFontEmbedder) {
            // the 14 standard fonts often come without widths: they are built into pdf-lib
            var em = P.StandardFontEmbedder.for(STD14[bf]), ws0 = [];
            for (var cc0 = 0; cc0 < 256; cc0++) { var ch = cc0 >= 128 && cc0 < 160 ? (WIN[cc0 - 128] || '') : String.fromCharCode(cc0); var w0 = 0; try { w0 = ch ? em.widthOfTextAtSize(ch, 1000) : 0; } catch (e) { w0 = 500; } ws0.push(w0); }
            info = { ok: true, two: false, first: 0, ws: ws0, miss: 500 };
          } else if (first != null && wa) {
            var ws = []; for (var q = 0; q < wa.size(); q++) ws.push(num(wa.lookup(q)) || 0);
            var md = 0; try { var fd = f.lookupMaybe(P.PDFName.of('FontDescriptor'), P.PDFDict); md = fd ? num(fd.lookup(P.PDFName.of('MissingWidth'))) || 0 : 0; } catch (e) { md = 0; }
            info = { ok: true, two: false, first: first, ws: ws, miss: md };
          }
        }
      }
    } catch (e) { info = { ok: false }; }
    cache[name] = info;
    return info;
  }
  // how far a piece of text moves the text position, in text space units (null when the widths are unknown)
  function advance(str, st, font) {
    if (!font || !font.ok) return null;
    var tx = 0, bytes = str.s;
    if (font.two) {
      for (var i = 0; i + 1 < bytes.length; i += 2) {
        var cid = bytes[i] * 256 + bytes[i + 1], w = font.W[cid];
        tx += ((w == null ? font.dw : w) / 1000) * st.fs + st.tc;
      }
    } else {
      for (var k = 0; k < bytes.length; k++) {
        var code = bytes[k], idx = code - font.first, w2 = idx >= 0 && idx < font.ws.length ? font.ws[idx] : font.miss;
        tx += (w2 / 1000) * st.fs + st.tc + (code === 32 ? st.tw : 0);
      }
    }
    return tx * st.th;
  }

  /* ---------- taking text out of a page ---------- */
  function decodeContents(page) {
    var P = L(), c = page.node.Contents();
    if (!c) return null;
    var streams = c instanceof P.PDFArray ? c.asArray().map(function (r) { return page.doc.context.lookup(r); }) : [c];
    var parts = [], total = 0;
    for (var i = 0; i < streams.length; i++) {
      var s = streams[i], bytes;
      if (s instanceof P.PDFRawStream) bytes = P.decodePDFRawStream(s).decode();
      else if (s && s.getContents) bytes = s.getContents();
      else return null;
      parts.push(bytes); total += bytes.length + 1;
    }
    var out = new Uint8Array(total), at = 0;
    parts.forEach(function (p) { out.set(p, at); at += p.length; out[at++] = 10; });
    return out;
  }
  function enc(s) { var o = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) o[i] = s.charCodeAt(i) & 255; return o; }
  var MOVE = { Td: 1, TD: 1, Tm: 1, 'T*': 1, BT: 1, ET: 1 };
  /* boxes: [[x, y, w, h], ...] in points on the page as shown (top-left origin): the band around the baseline of each
     line to take out. A piece of text goes when the point where it starts lies in a band. t: the page's view
     transform (pdf.js). Returns how many pieces of text were taken out. */
  // stats (optional array): stats[k] = { removed, kept } for box k - kept: text that starts in the band but had to stay
  function eraseText(doc, pageIndex, boxes, t, stats) {
    var P = L(), page = doc.getPages()[pageIndex];
    if (!page || !boxes.length) return 0;
    var b; try { b = decodeContents(page); } catch (e) { return 0; }
    if (!b) return 0;
    var ops = parse(b), res = page.node.Resources(), fcache = {};
    function inside(x, y, fs) {
      var p = apply(t, x, y), tx = Math.max(0.6, Math.abs(fs) * 0.3);
      for (var k = 0; k < boxes.length; k++) { var r = boxes[k]; if (p[0] >= r[0] - tx && p[0] <= r[0] + r[2] + tx && p[1] >= r[1] - 0.6 && p[1] <= r[1] + r[3] + 0.6) return k; }
      return -1;
    }
    if (stats) boxes.forEach(function (bx, k) { stats[k] = { removed: 0, kept: 0 }; });
    var ctm = ID.slice(), gs = [], st = null, inText = false, known = true;
    var edits = []; // { op, rep (string), adv } per removed operator, in order
    var block = []; // show operators of the current BT block: { o, removed, known(before), unknownAdv }
    var blocks = [];
    function newState() { return { tm: ID.slice(), tlm: ID.slice(), fs: 0, font: null, tc: 0, tw: 0, th: 1, tl: 0, rise: 0 }; }
    var tstate = newState(); // text state survives BT/ET (except the matrices)
    function td(x, y) { tstate.tlm = mul([1, 0, 0, 1, x, y], tstate.tlm); tstate.tm = tstate.tlm.slice(); known = true; }
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i], a = o.args, op = o.op;
      if (op === 'q') gs.push([ctm.slice(), tstate.font, tstate.fs, tstate.tc, tstate.tw, tstate.th, tstate.tl, tstate.rise]);
      else if (op === 'Q') { var g = gs.pop(); if (g) { ctm = g[0]; tstate.font = g[1]; tstate.fs = g[2]; tstate.tc = g[3]; tstate.tw = g[4]; tstate.th = g[5]; tstate.tl = g[6]; tstate.rise = g[7]; } else ctm = ID.slice(); }
      else if (op === 'cm' && a.length === 6) ctm = mul(a, ctm);
      else if (op === 'BT') { inText = true; tstate.tm = ID.slice(); tstate.tlm = ID.slice(); known = true; block = []; }
      else if (op === 'ET') { inText = false; if (block.length) blocks.push(block); block = []; }
      else if (op === 'Tf' && a.length === 2) { tstate.font = fontInfo(doc, res, a[0] && a[0].n, fcache); tstate.fs = +a[1] || 0; }
      else if (op === 'Tc') tstate.tc = +a[0] || 0;
      else if (op === 'Tw') tstate.tw = +a[0] || 0;
      else if (op === 'Tz') tstate.th = (+a[0] || 100) / 100;
      else if (op === 'TL') tstate.tl = +a[0] || 0;
      else if (op === 'Ts') tstate.rise = +a[0] || 0;
      else if (op === 'Td' && a.length === 2) td(+a[0], +a[1]);
      else if (op === 'TD' && a.length === 2) { tstate.tl = -a[1]; td(+a[0], +a[1]); }
      else if (op === 'Tm' && a.length === 6) { tstate.tlm = a.slice(); tstate.tm = a.slice(); known = true; }
      else if (op === 'T*') td(0, -tstate.tl);
      else if (inText && (op === 'Tj' || op === 'TJ' || op === "'" || op === '"')) {
        var pre = '';
        if (op === "'") { td(0, -tstate.tl); pre = 'T* '; }
        if (op === '"') { tstate.tw = +a[0] || 0; tstate.tc = +a[1] || 0; td(0, -tstate.tl); pre = a[0] + ' Tw ' + a[1] + ' Tc T* '; }
        var trm = mul(tstate.tm, ctm), start = apply(trm, 0, tstate.rise), fsz = tstate.fs * Math.hypot(trm[2], trm[3]);
        // how far this piece moves on
        var adv = 0;
        if (op === 'TJ') {
          var arr = a[0] || [];
          for (var k = 0; k < arr.length && adv != null; k++) {
            var el = arr[k];
            if (typeof el === 'number') adv += -(el / 1000) * tstate.fs * tstate.th;
            else if (el && el.s) { var w = advance(el, tstate, tstate.font); adv = w == null ? null : adv + w; }
          }
        } else { var sArg = a[a.length - 1]; adv = sArg && sArg.s ? advance(sArg, tstate, tstate.font) : null; }
        var rec = { o: o, pre: pre, adv: adv, removed: false, fsTh: tstate.fs * tstate.th, box: inside(start[0], start[1], fsz) };
        if (known && rec.box >= 0) rec.removed = true;
        block.push(rec);
        if (adv == null) known = false; else tstate.tm = mul([1, 0, 0, 1, adv, 0], tstate.tm);
      } else if (op === 'Tj' || op === 'TJ') { /* text outside BT: ignore */ }
      if (MOVE[op] && op !== 'BT' && op !== 'ET' && block.length) block.push({ move: true });
    }
    if (block.length) blocks.push(block);
    // safety: a removed piece whose width is unknown may only go when no kept piece follows it on the same run
    blocks.forEach(function (bl) {
      for (var k = 0; k < bl.length; k++) {
        var r = bl[k]; if (!r.removed || r.adv != null) continue;
        for (var j = k + 1; j < bl.length; j++) {
          if (bl[j].move) break;
          if (!bl[j].removed) { r.removed = false; break; }
        }
      }
      bl.forEach(function (r) {
        if (stats && r.box >= 0 && stats[r.box]) stats[r.box][r.removed ? 'removed' : 'kept']++;
        if (!r.removed) return;
        var rep = r.pre;
        // an empty TJ that moves on by the same width keeps the rest of the line in place
        // (TJ numbers are thousandths of the font size × horizontal scale)
        if (r.adv != null && Math.abs(r.adv) > 1e-6 && Math.abs(r.fsTh) > 1e-6) rep += '[' + (-r.adv * 1000 / r.fsTh).toFixed(3) + '] TJ';
        edits.push({ o: r.o, rep: rep });
      });
    });
    if (!edits.length) return 0;
    // rebuild the content: unchanged bytes are copied as they are
    edits.sort(function (x, y) { return x.o.start - y.o.start; });
    var chunks = [], pos = 0;
    edits.forEach(function (e) { chunks.push(b.subarray(pos, e.o.start)); chunks.push(enc(' ' + e.rep + ' ')); pos = e.o.end; });
    chunks.push(b.subarray(pos));
    var len = chunks.reduce(function (s, c) { return s + c.length; }, 0), out = new Uint8Array(len), at = 0;
    chunks.forEach(function (c) { out.set(c, at); at += c.length; });
    var stream = doc.context.flateStream(out);
    page.node.set(P.PDFName.of('Contents'), doc.context.register(stream));
    return edits.length;
  }
  /* ---------- pages ---------- */
  // op: { kind: 'rotate', page, deg } | { kind: 'delete', page } | { kind: 'blank', page } (adds one after it) | { kind: 'move', page, to }
  //     | { kind: 'insert', page, docs: [bytes] } (the pages of other PDFs, after page)
  async function editPages(bytes, op, title) {
    var P = L();
    var doc = await P.PDFDocument.load(bytes, { updateMetadata: false });
    var pages = doc.getPages(), p = pages[op.page];
    if (!p) throw new Error('page');
    if (op.kind === 'rotate') p.setRotation(P.degrees(((p.getRotation().angle + op.deg) % 360 + 360) % 360));
    else if (op.kind === 'delete') { if (pages.length < 2) throw new Error('last'); doc.removePage(op.page); }
    else if (op.kind === 'blank') {
      var sz = p.getSize(), np = doc.insertPage(op.page + 1, [sz.width, sz.height]);
      np.setRotation(P.degrees(p.getRotation().angle));
    } else if (op.kind === 'insert') {
      // op.docs: the bytes of PDFs whose pages go in after op.page, in order
      var at = op.page + 1;
      for (var d = 0; d < op.docs.length; d++) {
        var other = await P.PDFDocument.load(op.docs[d], { updateMetadata: false });
        if (other.isEncrypted) throw new Error('locked');
        var cps = await doc.copyPages(other, other.getPageIndices());
        cps.forEach(function (cp2) { doc.insertPage(at++, cp2); });
      }
    } else if (op.kind === 'move') {
      var to = Math.max(0, Math.min(pages.length - 1, op.to));
      if (to !== op.page) { var cp = (await doc.copyPages(doc, [op.page]))[0]; doc.removePage(op.page); doc.insertPage(to, cp); }
    }
    if (title) try { doc.setTitle(title); } catch (e) { /* ignore */ }
    return doc.save({ useObjectStreams: true });
  }

  /* ---------- fonts: which of the app's fonts looks most like the one in the PDF ---------- */
  // the CV template fonts the app has (exact match), then look-alikes: Liberation Sans (Arial), Liberation Serif (Times),
  // Carlito (Calibri), Caladea (Cambria), TeX Gyre Pagella (Palatino)
  var TPL_FONTS = ['montserrat', 'lato', 'opensans', 'raleway', 'playfair', 'merriweather', 'poppins', 'nunito', 'oswald', 'sourcesans', 'dmsans'];
  function cleanName(nm) { return String(nm || '').replace(/^[A-Z]{6}\+/, ''); }
  function fontId(nm, fam) {
    var n = cleanName(nm).toLowerCase().replace(/[^a-z]/g, ''), have = window.CV_FONTS || {};
    if (/calibri|carlito/.test(n)) return 'carlito';
    if (/cambria|caladea|georgia|century/.test(n)) return 'caladea';
    if (/roboto/.test(n)) return 'roboto';
    for (var k = 0; k < TPL_FONTS.length; k++) if (n.indexOf(TPL_FONTS[k]) >= 0 && have[TPL_FONTS[k]]) return TPL_FONTS[k];
    if (/garamond/.test(n) && have.garamond) return 'garamond';
    if (/pagella|palatino|bookantiqua/.test(n) && have.pagella) return 'pagella';
    if (/arial|helvetica|arimo|liberationsans|nimbussans|freesans|verdana|tahoma|segoe|trebuchet|dejavusans/.test(n)) return 'libsans';
    if (/times|tinos|liberationserif|nimbusrom|freeserif|minion|bookman|dejavuserif/.test(n)) return 'libserif';
    if ((/serif/.test(n) && !/sans/.test(n)) || (fam === 'serif' && !/sans/.test(n))) return 'libserif';
    return 'libsans';
  }
  function isBold(nm, obj) { return !!(obj && (obj.bold || obj.black)) || /bold|black|heavy|semibold|demi|[-,](bd|bi|boldit)$/i.test(cleanName(nm)); }
  function isItalic(nm, obj) { return !!(obj && obj.italic) || /italic|oblique|[-,](it|bi|boldit)$|ital$/i.test(cleanName(nm)); }
  // the name Word knows the font by: "ABCDEF+TimesNewRomanPS-BoldMT" -> "Times New Roman"
  function wordFont(nm, id) {
    var n = cleanName(nm).replace(/[-,].*$/, '').replace(/(PS)?MT$/, '').replace(/PS$/, '');
    var known = { arial: 'Arial', helvetica: 'Arial', timesnewroman: 'Times New Roman', times: 'Times New Roman', calibri: 'Calibri', cambria: 'Cambria',
      georgia: 'Georgia', verdana: 'Verdana', tahoma: 'Tahoma', garamond: 'Garamond', bookantiqua: 'Book Antiqua', centurygothic: 'Century Gothic',
      roboto: 'Roboto', carlito: 'Calibri', caladea: 'Cambria', liberationsans: 'Arial', liberationserif: 'Times New Roman', arimo: 'Arial', tinos: 'Times New Roman' };
    var key = n.toLowerCase().replace(/[^a-z]/g, '');
    if (known[key]) return known[key];
    if (/symbol|wingding|dingbat/.test(key)) return 'Arial';
    if (/^[A-Za-z][A-Za-z0-9 ]{1,30}$/.test(n)) return n.replace(/([a-z])([A-Z])/g, '$1 $2');
    return { libserif: 'Times New Roman', caladea: 'Cambria', carlito: 'Calibri' }[id] || 'Arial';
  }

  // bullets that symbol fonts keep in the private-use area (Symbol, Wingdings, OpenSymbol) become a normal bullet
  var PUA_BULLET = /[\uF0B7\uF0A7\uF06C\uF06E\uF0D8\uF076\uF0FC\uF0A8\uF09F\uE00A]/g;
  /* ---------- the lines of text on a page (pdf.js), for "Edit text" ---------- */
  /* returns [{ i, x, y, w, h, base, size, str, font, bold, italic, runs }] in points on the page as shown.
     font: one of the app's fonts (see fontId); runs: the pieces of the line with their own style (for PDF to Word). */
  function lines(page, vt) {
    // the operator list loads the page's fonts, so their real names (bold, italic, family) are known
    return page.getOperatorList().catch(function () { /* names unknown: look-alikes by default */ }).then(function () { return page.getTextContent(); }).then(function (tc) {
      var Util = window.pdfjsLib.Util, items = [];
      tc.items.forEach(function (it) {
        if (!it.str || !it.str.trim()) return;
        var str = it.str.replace(PUA_BULLET, '\u2022');
        var m = Util.transform(vt, it.transform), size = Math.hypot(m[2], m[3]);
        if (size < 2 || Math.abs(Math.atan2(m[1], m[0])) > 0.02) return; // only text that runs left to right on the page
        var st = tc.styles[it.fontName] || {}, w = Math.abs(it.width) * (Math.hypot(m[0], m[1]) / (Math.hypot(it.transform[0], it.transform[1]) || 1));
        var name = '', obj = null;
        try { if (page.commonObjs.has(it.fontName)) { obj = page.commonObjs.get(it.fontName); name = obj.name || ''; } } catch (e) { name = ''; }
        var fam = st.fontFamily || '';
        items.push({ x: m[4], base: m[5], w: w, size: size, str: str, asc: st.ascent || 0.8, desc: st.descent || -0.2, name: name, fam: fam,
          font: fontId(name, fam), bold: isBold(name, obj), italic: isItalic(name, obj) });
      });
      items.sort(function (p, q) { return Math.abs(p.base - q.base) > Math.min(p.size, q.size) * 0.3 ? p.base - q.base : p.x - q.x; });
      var out = [];
      items.forEach(function (it) {
        var ln = out[out.length - 1];
        var run = { str: it.str, x: it.x, w: it.w, size: it.size, font: it.font, bold: it.bold, italic: it.italic, word: wordFont(it.name, it.font) };
        if (ln && Math.abs(ln.base - it.base) < ln.size * 0.3 && Math.abs(ln.size - it.size) < ln.size * 0.25 &&
            it.x - (ln.x + ln.w) < ln.size * 0.9 && it.x - (ln.x + ln.w) > -ln.size) {
          var gap = it.x - (ln.x + ln.w), sp = gap > ln.size * 0.15 && !/\s$/.test(ln.str) && !/^\s/.test(it.str);
          ln.str += (sp ? ' ' : '') + it.str;
          if (sp) run.str = ' ' + run.str;
          ln.runs.push(run);
          ln.w = Math.max(ln.w, it.x + it.w - ln.x);
          return;
        }
        out.push({ x: it.x, base: it.base, w: it.w, size: it.size, str: it.str, asc: Math.max(0.7, Math.min(1.05, it.asc)), desc: Math.min(-0.15, Math.max(-0.35, it.desc)),
          font: it.font, bold: it.bold, italic: it.italic, runs: [run] });
      });
      return out.map(function (l, i) {
        var top = l.base - l.size * l.asc, bottom = l.base - l.size * l.desc;
        // the style most of the line is in
        var cnt = { b: 0, i: 0, n: 0 }; l.runs.forEach(function (r) { var k = r.str.length; cnt.n += k; if (r.bold) cnt.b += k; if (r.italic) cnt.i += k; });
        return { i: i, x: l.x, y: top, w: l.w, h: bottom - top, base: l.base, size: l.size, str: l.str.replace(/\s+/g, ' ').trim(), font: l.font,
          bold: cnt.b > cnt.n / 2, italic: cnt.i > cnt.n / 2, runs: l.runs };
      });
    });
  }

  /* ---------- paragraphs: lines that belong together ---------- */
  // lines from lines(); pageW: the page width as shown. Returns [{ lines: [index...], x, y, w, h, size, lh, font, bold, italic, str, align }]
  function centred(x, w, pageW) { return Math.abs(x + w / 2 - pageW / 2) < Math.max(3, pageW * 0.02) && x > pageW * 0.12; }
  function paragraphs(ls, pageW) {
    var order = ls.slice().sort(function (a, b) { return a.base - b.base || a.x - b.x; }), out = [], used = {};
    var BULLET = /^\s*([•●▪–—\-*·]|\d{1,2}[.)]|[a-z][.)])\s/;
    order.forEach(function (l) {
      if (used[l.i]) return;
      var p = { lines: [l.i], x: l.x, y: l.y, w: l.w, h: l.h, size: l.size, font: l.font, bold: l.bold, italic: l.italic, last: l, gap: 0, right: l.x + l.w };
      used[l.i] = 1;
      for (;;) {
        var prev = p.last, nx = null;
        order.forEach(function (c) {
          if (used[c.i] || nx) return;
          var d = c.base - prev.base;
          if (d < prev.size * 0.9 || d > prev.size * 1.9) return;
          if (Math.abs(c.size - p.size) > p.size * 0.15 || c.bold !== p.bold) return;
          if (c.x < p.x - p.size * 0.6 || c.x > p.x + p.size * 3) return;
          if (p.gap && Math.abs(d - p.gap) > p.gap * 0.25) return;
          if (BULLET.test(c.str)) return;
          // the line before was short: that was the end of a paragraph
          if (prev.x + prev.w < Math.max(p.right, c.x + c.w) - p.size * 3.5) return;
          nx = c;
        });
        if (!nx) break;
        p.gap = p.gap || nx.base - prev.base;
        p.lines.push(nx.i); used[nx.i] = 1; p.last = nx;
        p.x = Math.min(p.x, nx.x); p.right = Math.max(p.right, nx.x + nx.w); p.h = nx.y + nx.h - p.y;
      }
      var lsP = p.lines.map(function (k) { return ls.filter(function (x) { return x.i === k; })[0]; });
      var str = '';
      lsP.forEach(function (x, k) { str += (k && !/-$/.test(str) ? ' ' : '') + x.str; });
      var allC = lsP.length > 1 ? lsP.every(function (x) { return centred(x.x, x.w, pageW); }) && lsP.some(function (x) { return Math.abs(x.x - lsP[0].x) > 2; }) : centred(l.x, l.w, pageW);
      out.push({ lines: p.lines, x: p.x, y: p.y, w: p.right - p.x, h: p.h, size: p.size, lh: p.gap ? p.gap / p.size : 1.15, font: p.font, bold: p.bold, italic: p.italic,
        str: str, align: allC ? 'center' : 'left', base: l.base });
    });
    return out;
  }

  /* ---------- black-out: taking out every letter under a box, and finding what else is under it ---------- */
  function hexStr(bytes) { var h = '<'; for (var i = 0; i < bytes.length; i++) h += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16); return h + '>'; }
  function hits(r, boxes) { return boxes.some(function (b) { return r[0] < b[0] + b[2] && r[0] + r[2] > b[0] && r[1] < b[1] + b[3] && r[1] + r[3] > b[1]; }); }
  function boxOf(m, t, x0, y0, x1, y1) {
    var ps = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(function (p) { var q = apply(m, p[0], p[1]); return apply(t, q[0], q[1]); });
    var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
    var a = Math.min.apply(null, xs), b = Math.min.apply(null, ys);
    return [a, b, Math.max.apply(null, xs) - a, Math.max.apply(null, ys) - b];
  }
  /* boxes: [[x, y, w, h]] on the page as shown. Every letter that touches a box is taken out of the page content (the rest of
     the line stays where it was). Returns { removed, unsure }: unsure = some text under a box could not be measured, so the
     page should be saved as a picture. */
  function eraseArea(doc, pageIndex, boxes, t) {
    var P = L(), page = doc.getPages()[pageIndex], res0 = { removed: 0, unsure: false };
    if (!page || !boxes.length) return res0;
    var b; try { b = decodeContents(page); } catch (e) { return { removed: 0, unsure: true }; }
    if (!b) return res0;
    var ops = parse(b), res = page.node.Resources(), fcache = {}, edits = [], unsure = false, removed = 0;
    var ctm = ID.slice(), gs = [], st = { tm: ID.slice(), tlm: ID.slice(), fs: 0, font: null, tc: 0, tw: 0, th: 1, tl: 0, rise: 0 }, lost = false;
    function td(x, y) { st.tlm = mul([1, 0, 0, 1, x, y], st.tlm); st.tm = st.tlm.slice(); lost = false; }
    function glyphs(str) { // [{ bytes, w }] for one string, w in text space × th
      var f = st.font, out = [], bs = str.s;
      if (!f || !f.ok) return null;
      if (f.two) for (var i = 0; i + 1 < bs.length; i += 2) { var cid = bs[i] * 256 + bs[i + 1], w = f.W[cid]; out.push({ b: [bs[i], bs[i + 1]], w: (((w == null ? f.dw : w) / 1000) * st.fs + st.tc) * st.th }); }
      else for (var k = 0; k < bs.length; k++) { var c = bs[k], ix = c - f.first, w2 = ix >= 0 && ix < f.ws.length ? f.ws[ix] : f.miss; out.push({ b: [c], w: ((w2 / 1000) * st.fs + st.tc + (c === 32 ? st.tw : 0)) * st.th }); }
      return out;
    }
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i], a = o.args, op = o.op;
      if (op === 'q') gs.push([ctm.slice(), st.font, st.fs, st.tc, st.tw, st.th, st.tl, st.rise]);
      else if (op === 'Q') { var g = gs.pop(); if (g) { ctm = g[0]; st.font = g[1]; st.fs = g[2]; st.tc = g[3]; st.tw = g[4]; st.th = g[5]; st.tl = g[6]; st.rise = g[7]; } else ctm = ID.slice(); }
      else if (op === 'cm' && a.length === 6) ctm = mul(a, ctm);
      else if (op === 'BT') { st.tm = ID.slice(); st.tlm = ID.slice(); lost = false; }
      else if (op === 'Tf' && a.length === 2) { st.font = fontInfo(doc, res, a[0] && a[0].n, fcache); st.fs = +a[1] || 0; }
      else if (op === 'Tc') st.tc = +a[0] || 0;
      else if (op === 'Tw') st.tw = +a[0] || 0;
      else if (op === 'Tz') st.th = (+a[0] || 100) / 100;
      else if (op === 'TL') st.tl = +a[0] || 0;
      else if (op === 'Ts') st.rise = +a[0] || 0;
      else if (op === 'Td' && a.length === 2) td(+a[0], +a[1]);
      else if (op === 'TD' && a.length === 2) { st.tl = -a[1]; td(+a[0], +a[1]); }
      else if (op === 'Tm' && a.length === 6) { st.tlm = a.slice(); st.tm = a.slice(); lost = false; }
      else if (op === 'T*') td(0, -st.tl);
      else if (op === 'Tj' || op === 'TJ' || op === "'" || op === '"') {
        var pre = '';
        if (op === "'") { td(0, -st.tl); pre = 'T* '; }
        if (op === '"') { st.tw = +a[0] || 0; st.tc = +a[1] || 0; td(0, -st.tl); pre = a[0] + ' Tw ' + a[1] + ' Tc T* '; }
        var parts = op === 'TJ' ? (a[0] || []) : [a[a.length - 1]], trm = mul(st.tm, ctm), lo = -0.25 * st.fs + st.rise, hi = 0.95 * st.fs + st.rise;
        var x = 0, newArr = [], cur = [], gap = 0, changed = false, fsTh = st.fs * st.th, bad = false;
        var flush = function () { if (cur.length) { newArr.push(hexStr(cur)); cur = []; } if (Math.abs(gap) > 1e-6) { newArr.push((-gap * 1000 / (fsTh || 1)).toFixed(3)); gap = 0; } };
        if (lost) bad = true;
        for (var k = 0; k < parts.length && !bad; k++) {
          var el = parts[k];
          if (typeof el === 'number') { var dx = -(el / 1000) * st.fs * st.th; flush(); newArr.push(String(el)); x += dx; continue; }
          if (!el || !el.s) continue;
          var gl = glyphs(el);
          if (!gl) { bad = true; break; }
          gl.forEach(function (gy) {
            var r = boxOf(trm, t, x, lo, x + Math.max(gy.w, st.fs * 0.2), hi);
            if (hits(r, boxes)) { if (cur.length) { newArr.push(hexStr(cur)); cur = []; } gap += gy.w; changed = true; removed++; }
            else { if (Math.abs(gap) > 1e-6) { newArr.push((-gap * 1000 / (fsTh || 1)).toFixed(3)); gap = 0; } cur.push.apply(cur, gy.b); }
            x += gy.w;
          });
        }
        if (bad) {
          // widths unknown: when the start of the text could be near a box, the page has to become a picture
          var r0 = boxOf(trm, t, lost ? -st.fs * 400 : 0, lo, st.fs * 400, hi);
          if (hits(r0, boxes)) unsure = true;
          lost = true;
        } else {
          flush();
          if (changed) edits.push({ o: o, rep: pre + '[' + newArr.join(' ') + '] TJ' });
          st.tm = mul([1, 0, 0, 1, x, 0], st.tm);
        }
      }
    }
    if (edits.length) {
      edits.sort(function (p, q) { return p.o.start - q.o.start; });
      var chunks = [], pos = 0;
      edits.forEach(function (e) { chunks.push(b.subarray(pos, e.o.start)); chunks.push(enc(' ' + e.rep + ' ')); pos = e.o.end; });
      chunks.push(b.subarray(pos));
      var len = chunks.reduce(function (s2, c) { return s2 + c.length; }, 0), out = new Uint8Array(len), at = 0;
      chunks.forEach(function (c) { out.set(c, at); at += c.length; });
      page.node.set(P.PDFName.of('Contents'), doc.context.register(doc.context.flateStream(out)));
    }
    return { removed: removed, unsure: unsure };
  }
  /* what is drawn on a page apart from text: pictures, shapes and lines (not white fills), and embedded drawings,
     as boxes on the page as shown. Used to know whether a black-out covers more than text. */
  function paintBoxes(doc, pageIndex, t) {
    var P = L(), page = doc.getPages()[pageIndex], out = [];
    if (!page) return out;
    var b; try { b = decodeContents(page); } catch (e) { return null; }
    if (!b) return out;
    var ops = parse(b), res = page.node.Resources(), xo = null;
    try { xo = res && res.lookup(P.PDFName.of('XObject'), P.PDFDict); } catch (e) { xo = null; }
    var ctm = ID.slice(), gs = [], pts = [], white = false, lw = 1;
    function add(x0, y0, x1, y1, kind) { var r = boxOf(ctm, t, x0, y0, x1, y1); r.kind = kind || 'draw'; out.push(r); }
    function grow(r, d) { return [r[0] - d, r[1] - d, r[2] + 2 * d, r[3] + 2 * d]; }
    function isWhite(args, n) { return args.length === n && args.every(function (v, k) { return n === 4 ? +v === 0 : +v >= 0.99; }); }
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i], a = o.args, op = o.op;
      if (op === 'q') gs.push([ctm.slice(), white, lw]);
      else if (op === 'Q') { var g = gs.pop(); if (g) { ctm = g[0]; white = g[1]; lw = g[2]; } }
      else if (op === 'cm' && a.length === 6) ctm = mul(a, ctm);
      else if (op === 'w') lw = +a[0] || 0;
      else if (op === 'rg' || op === 'g' || op === 'k') white = isWhite(a, op === 'rg' ? 3 : op === 'g' ? 1 : 4);
      else if (op === 'sc' || op === 'scn') white = isWhite(a.filter(function (v) { return typeof v === 'number'; }), a.length) && (a.length === 1 || a.length === 3);
      else if (op === 'm' || op === 'l') pts.push([+a[0], +a[1]]);
      else if (op === 'c') pts.push([+a[0], +a[1]], [+a[2], +a[3]], [+a[4], +a[5]]);
      else if (op === 'v' || op === 'y') pts.push([+a[0], +a[1]], [+a[2], +a[3]]);
      else if (op === 're') pts.push([+a[0], +a[1]], [+a[0] + +a[2], +a[1] + +a[3]]);
      else if (/^(f|F|f\*|B|B\*|b|b\*|S|s)$/.test(op)) {
        if (pts.length) {
          var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
          var stroke = /^(S|s|B|B\*|b|b\*)$/.test(op);
          if (stroke || !white) {
            var r = boxOf(ctm, t, Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys));
            out.push(stroke ? grow(r, Math.max(0.5, lw)) : r);
          }
        }
        pts = [];
      } else if (op === 'n') pts = [];
      else if (op === 'BI') add(0, 0, 1, 1, 'img');
      else if (op === 'sh') out.push([-1e5, -1e5, 2e5, 2e5]);
      else if (op === 'Do' && a[0] && a[0].n) {
        var x = null; try { x = xo && xo.lookup(P.PDFName.of(a[0].n)); } catch (e) { x = null; }
        var sub = x && x.dict ? String(x.dict.get(P.PDFName.of('Subtype'))) : '';
        if (sub === '/Image') add(0, 0, 1, 1, 'img');
        else {
          // an embedded drawing: its whole box counts
          var bb = null; try { bb = x && x.dict.lookup(P.PDFName.of('BBox'), P.PDFArray); } catch (e) { bb = null; }
          var mx = null; try { mx = x && x.dict.lookup(P.PDFName.of('Matrix'), P.PDFArray); } catch (e) { mx = null; }
          if (bb) {
            var v = [0, 1, 2, 3].map(function (k) { return num(bb.lookup(k)) || 0; }), save = ctm;
            if (mx) ctm = mul([0, 1, 2, 3, 4, 5].map(function (k) { return num(mx.lookup(k)) || 0; }), ctm);
            add(v[0], v[1], v[2], v[3]); ctm = save;
          } else out.push([-1e5, -1e5, 2e5, 2e5]);
        }
      }
    }
    // form fields and other annotations on the page
    try {
      var annots = page.node.Annots();
      if (annots) for (var j = 0; j < annots.size(); j++) {
        var an = annots.lookup(j, P.PDFDict), rc = an && an.lookup(P.PDFName.of('Rect'), P.PDFArray);
        var sb = an && String(an.get(P.PDFName.of('Subtype')));
        if (!rc || sb === '/Link' || sb === '/Popup') continue;
        var q = [0, 1, 2, 3].map(function (k) { return num(rc.lookup(k)) || 0; }), sv = ctm; ctm = ID.slice();
        add(Math.min(q[0], q[2]), Math.min(q[1], q[3]), Math.max(q[0], q[2]), Math.max(q[1], q[3]), 'annot'); ctm = sv;
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  window.CVPdfEdit = { parse: parse, eraseText: eraseText, eraseArea: eraseArea, paintBoxes: paintBoxes, editPages: editPages, lines: lines,
    paragraphs: paragraphs, fontId: fontId, wordFont: wordFont, centred: centred };
  if (window.CVLibs) window.CVLibs.wrap(window.CVPdfEdit, ['editPages'], 'pdf');
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/pdfword.js */
try {
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
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/ocr.js */
try {
/* Reading the words on a scanned page (Tesseract OCR, English), all on the phone, so "Edit text", white-out, black-out
   and find work on scans too. The engine and the English data (about 6 MB) are in the app; the website downloads them
   the first time they are needed and keeps them for offline use. */
(function () {
  'use strict';
  var BASE = 'js/ocr/', worker = null, ready = null, jobs = {}, next = 1;
  function T(s, v) { var A = window.App; return A && A.T ? A.T(s, v) : s; }
  function get(url, kind) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(T('The word reader did not load. Check your internet connection and try again.')); return kind === 'text' ? r.text() : r.arrayBuffer(); });
  }
  function gunzip(buf) {
    if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error(T('This phone\'s web browser is too old to read scanned pages. Update Android System WebView or Chrome.')));
    return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  function start() {
    if (ready) return ready;
    // the Android app's packaging unpacks .gz files, so there the data is plain eng.traineddata
    var app = !!window.AndroidBridge;
    ready = Promise.all([get(BASE + 'tesseract-core-lstm.js', 'text'), get(BASE + 'ocr-worker.js', 'text'), get(BASE + 'tesseract-core-lstm.wasm'), get(BASE + (app ? 'eng.traineddata' : 'eng.traineddata.gz'))]).then(function (r) {
      return (app ? Promise.resolve(new Uint8Array(r[3])) : gunzip(r[3])).then(function (data) {
        var url = URL.createObjectURL(new Blob([r[0], '\n;\n', r[1]], { type: 'application/javascript' }));
        worker = new Worker(url);
        return new Promise(function (res, rej) {
          worker.onmessage = function (e) {
            var m = e.data;
            if (m.type === 'ready') { res(); return; }
            var job = m.id && jobs[m.id];
            if (!job) { if (m.type === 'error') rej(new Error(m.message)); return; }
            delete jobs[m.id];
            if (m.type === 'done') job.res(m.tsv); else job.rej(new Error(m.message));
          };
          worker.onerror = function (e) { rej(new Error(e.message || 'OCR')); };
          worker.postMessage({ type: 'init', wasm: r[2], data: data }, [r[2], data.buffer]);
        });
      });
    });
    ready.catch(function () { ready = null; if (worker) { worker.terminate(); worker = null; } });
    return ready;
  }
  function png(cv) {
    return new Promise(function (res) { cv.toBlob(function (b) { b.arrayBuffer().then(function (a) { res(new Uint8Array(a)); }); }, 'image/png'); });
  }
  // the words on a picture of a page: [{ text, conf, x0, y0, x1, y1, key }] in pixels
  function read(cv, progress) {
    var first = !ready;
    if (progress && first) progress(T(window.AndroidBridge ? 'Getting the word reader ready…' : 'Downloading the word reader (about 6 MB, only the first time)…'));
    return start().then(function () {
      if (progress) progress(T('Reading the words on this page… This can take a minute.'));
      return png(cv);
    }).then(function (bytes) {
      return new Promise(function (res, rej) { var id = next++; jobs[id] = { res: res, rej: rej }; worker.postMessage({ type: 'read', id: id, png: bytes }, [bytes.buffer]); });
    }).then(function (tsv) {
      var out = [];
      String(tsv || '').split('\n').forEach(function (row) {
        var c = row.split('\t');
        if (c[0] !== '5' || c.length < 12) return;
        var text = c.slice(11).join(' ').trim(), conf = +c[10];
        if (!text || conf < 20) return;
        var x = +c[6], y = +c[7], w = +c[8], h = +c[9];
        out.push({ text: text, conf: conf, x0: x, y0: y, x1: x + w, y1: y + h, key: c[2] + ':' + c[3] + ':' + c[4] });
      });
      return out;
    });
  }
  function median(a) { if (!a.length) return 0; var s = a.slice().sort(function (p, q) { return p - q; }); return s[Math.floor(s.length / 2)]; }
  // words grouped into lines, in points on the page as shown (sc: pixels per point), like CVPdfEdit.lines()
  function toLines(words, sc) {
    var groups = {}, order = [];
    words.forEach(function (w) { if (!groups[w.key]) { groups[w.key] = []; order.push(w.key); } groups[w.key].push(w); });
    var out = [];
    order.forEach(function (k) {
      var ws = groups[k].sort(function (a, b) { return a.x0 - b.x0; });
      var noDesc = ws.filter(function (w) { return !/[gjpqyQ,;()\[\]{}|@$]/.test(w.text); });
      var base = noDesc.length ? median(noDesc.map(function (w) { return w.y1; })) : median(ws.map(function (w) { return w.y1 - (w.y1 - w.y0) * 0.2; }));
      var tall = ws.filter(function (w) { return /[A-Z0-9bdfhklt]/.test(w.text); });
      var size = tall.length ? (base - median(tall.map(function (w) { return w.y0; }))) / 0.72 : (base - median(ws.map(function (w) { return w.y0; }))) / 0.52;
      var x0 = Math.min.apply(null, ws.map(function (w) { return w.x0; })), x1 = Math.max.apply(null, ws.map(function (w) { return w.x1; }));
      var y0 = Math.min.apply(null, ws.map(function (w) { return w.y0; }));
      if (size < 4) return;
      var l = { x: x0 / sc, y: Math.min(y0, base - size * 0.95) / sc, w: (x1 - x0) / sc, base: base / sc, size: size / sc, str: ws.map(function (w) { return w.text; }).join(' '),
        font: 'libsans', bold: false, italic: false, ocr: true };
      l.h = l.base + l.size * 0.25 - l.y;
      l.runs = [{ str: l.str, x: l.x, w: l.w, size: l.size, font: 'libsans', bold: false, italic: false, word: 'Arial' }];
      out.push(l);
    });
    out.sort(function (a, b) { return a.base - b.base || a.x - b.x; });
    out.forEach(function (l, i) { l.i = i; });
    return out;
  }
  window.CVOcr = { read: read, toLines: toLines, ready: function () { return !!ready; } };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/duties.js */
try {
/* Typical duties and skills for common South African jobs, used to suggest CV lines */
(function () {
  'use strict';
  var JOBS = [
    { t: 'General Worker', m: /general work|labou?rer|handyman|grounds/i,
      d: ['Load and offload deliveries', 'Clean and maintain work areas, tools and equipment', 'Assist artisans and supervisors with daily tasks', 'Move stock and materials safely by hand and with trolleys', 'Dig, carry and prepare materials on site', 'Follow health and safety rules and wear PPE', 'Report damaged equipment and hazards to the supervisor'],
      s: ['Physical fitness', 'Health and safety awareness', 'Basic tool handling', 'Teamwork'] },
    { t: 'Cashier', m: /cashier|till|teller(?!.*bank)/i,
      d: ['Process cash, card and voucher payments accurately', 'Scan items and give customers the correct change', 'Balance the till at the start and end of each shift', 'Handle refunds, exchanges and lay-bys according to store policy', 'Pack customer purchases and offer store promotions', 'Keep the till area clean and stocked with packets', 'Report shortages and suspicious transactions to the supervisor'],
      s: ['Cash handling', 'Customer service', 'Point-of-sale (POS) systems', 'Basic maths'] },
    { t: 'Merchandiser', m: /merchandis/i,
      d: ['Pack and face shelves according to planograms', 'Check stock levels and place orders with suppliers', 'Set up promotional displays and price tickets', 'Rotate stock and remove expired or damaged products', 'Build good relationships with store managers', 'Report on competitor activity and stock problems', 'Take photos of displays for head office reports'],
      s: ['Stock control', 'Planogram compliance', 'Time management', 'Driving'] },
    { t: 'Shop Assistant / Sales Assistant', m: /shop assist|sales assist|sales consultant|sales rep|retail assist|store assist/i,
      d: ['Greet customers and help them find products', 'Explain product features, prices and promotions', 'Receive stock and pack shelves neatly', 'Do stock counts and report shortages', 'Keep the store clean, neat and well displayed', 'Process sales and returns on the till when needed', 'Meet daily and monthly sales targets'],
      s: ['Customer service', 'Sales', 'Product knowledge', 'Communication'] },
    { t: 'Security Officer', m: /security|guard|patrol/i,
      d: ['Control access at gates and keep the visitors register', 'Patrol the premises and check doors, windows and fences', 'Monitor CCTV cameras and alarm systems', 'Search vehicles and people according to company procedure', 'Write occurrence book (OB) entries and incident reports', 'Respond to alarms and emergencies and call the police when needed', 'Hand over shifts with a full report'],
      s: ['PSIRA registration', 'Access control', 'Report writing', 'Conflict handling'] },
    { t: 'Cleaner', m: /clean|janitor|housekeep/i,
      d: ['Clean offices, toilets, kitchens and public areas', 'Sweep, mop, vacuum and polish floors', 'Empty bins and take out refuse', 'Restock toilet paper, soap and hygiene products', 'Use cleaning chemicals safely and correctly', 'Report damage and maintenance problems', 'Keep a record of cleaning materials used'],
      s: ['Attention to detail', 'Safe use of cleaning chemicals', 'Time management', 'Reliability'] },
    { t: 'Domestic Worker', m: /domestic|nanny|au pair|childminder/i,
      d: ['Clean the house, wash and iron clothes', 'Prepare meals for the family', 'Look after children and help with homework', 'Do grocery shopping and run errands', 'Care for pets and the garden', 'Keep the household safe and secure'],
      s: ['Childcare', 'Cooking', 'Housekeeping', 'Trustworthiness'] },
    { t: 'Admin Clerk / Administrator', m: /admin|clerk|office assist|secretary|personal assist/i,
      d: ['Answer phones and direct calls and messages', 'Type letters, reports and minutes of meetings', 'File documents and keep records up to date', 'Capture data on the computer system', 'Manage diaries and book meetings', 'Order and control office stationery', 'Receive and send post, emails and couriers'],
      s: ['Computer literate (MS Word, Excel)', 'Filing and record keeping', 'Data capturing', 'Telephone etiquette'] },
    { t: 'Receptionist', m: /reception|front desk|switchboard/i,
      d: ['Welcome visitors and direct them to the right person', 'Answer and transfer calls on the switchboard', 'Take messages and pass them on accurately', 'Book appointments and manage the visitors register', 'Receive and send deliveries and post', 'Keep the reception area neat'],
      s: ['Telephone etiquette', 'Customer service', 'Computer literate (MS Office)', 'Professional appearance'] },
    { t: 'Data Capturer', m: /data captur|data entry|data typist/i,
      d: ['Capture information accurately on the computer system', 'Check data for errors and correct them', 'Scan and file source documents', 'Prepare simple reports from the captured data', 'Keep information confidential', 'Meet daily capturing targets'],
      s: ['Fast and accurate typing', 'Microsoft Excel', 'Attention to detail', 'Confidentiality'] },
    { t: 'Call Centre Agent', m: /call cent|contact cent|customer service agent|telesales|customer care/i,
      d: ['Answer inbound calls and help customers with queries', 'Make outbound sales and follow-up calls', 'Capture customer details and notes on the system', 'Resolve complaints or escalate them to a team leader', 'Meet call quality and sales targets', 'Follow scripts and compliance rules'],
      s: ['Communication', 'Customer service', 'Computer literate', 'Patience'] },
    { t: 'Driver', m: /driver|chauffeur|courier|delivery/i,
      d: ['Deliver goods to customers safely and on time', 'Check the vehicle before every trip (tyres, oil, lights)', 'Load and offload goods and check them against invoices', 'Plan routes and keep a trip logbook', 'Collect proof of delivery and payments', 'Report vehicle faults and accidents immediately'],
      s: ["Valid driver's licence and PrDP", 'Route planning', 'Vehicle checks', 'Time management'] },
    { t: 'Waiter / Waitress', m: /waiter|waitress|waitron|barista|bartender|server/i,
      d: ['Welcome guests and show them to their tables', 'Take food and drink orders accurately', 'Serve meals and drinks promptly', 'Explain the menu and specials to guests', 'Process bills and payments', 'Clear and set tables and keep the section clean'],
      s: ['Customer service', 'Teamwork', 'Working under pressure', 'Cash handling'] },
    { t: 'Chef / Cook', m: /chef|cook|kitchen|food prep|baker/i,
      d: ['Prepare and cook meals according to recipes and standards', 'Prepare ingredients and portion food', 'Keep the kitchen clean and follow food safety rules', 'Store food correctly and check expiry dates', 'Help with stock taking and ordering', 'Plate food neatly and on time'],
      s: ['Food safety and hygiene', 'Food preparation', 'Working under pressure', 'Teamwork'] },
    { t: 'Packer / Warehouse Assistant', m: /pack|warehouse|picker|dispatch|storeman|store ?person|stores/i,
      d: ['Pick and pack orders accurately', 'Receive deliveries and check them against delivery notes', 'Label, wrap and store goods in the right place', 'Do cycle counts and stock takes', 'Load trucks for dispatch', 'Keep the warehouse clean and safe'],
      s: ['Stock control', 'Attention to detail', 'Forklift operation', 'Physical fitness'] },
    { t: 'Forklift Operator', m: /forklift|reach truck|machine operator/i,
      d: ['Operate the forklift safely to load and offload trucks', 'Move and stack pallets in the warehouse', 'Do daily pre-use checks on the forklift', 'Keep aisles clear and follow safety rules', 'Record stock movements', 'Report damage and faults'],
      s: ['Valid forklift licence', 'Health and safety', 'Stock handling', 'Concentration'] },
    { t: 'Stock Controller', m: /stock control|inventory|buyer|procurement|stores controller/i,
      d: ['Keep accurate stock records on the system', 'Do monthly stock takes and investigate variances', 'Place orders with suppliers and follow up deliveries', 'Check deliveries against orders and invoices', 'Report on slow-moving and damaged stock', 'Help prevent losses and theft'],
      s: ['Stock control', 'Microsoft Excel', 'Attention to detail', 'Problem solving'] },
    { t: 'Teacher / Teacher Assistant', m: /teach|educator|tutor|lecturer|practitioner|ecd|creche/i,
      d: ['Plan and present lessons according to CAPS', 'Prepare, mark and record assessments', 'Manage the classroom and learner discipline', 'Support learners who struggle and report progress to parents', 'Take part in extra-mural activities', 'Keep learner records up to date'],
      s: ['Lesson planning', 'Classroom management', 'Communication', 'Patience'] },
    { t: 'Caregiver / Nursing Assistant', m: /care ?giver|carer|nursing assist|home based|community health|nurse/i,
      d: ['Help patients with bathing, dressing and eating', 'Take and record temperature, pulse and blood pressure', 'Give medication as prescribed and record it', 'Keep patients comfortable, clean and safe', 'Report changes in a patient\'s condition', 'Support patients and their families'],
      s: ['Basic first aid', 'Patient care', 'Compassion', 'Record keeping'] },
    { t: 'Electrician', m: /electric/i,
      d: ['Install and repair wiring, plugs, lights and distribution boards', 'Find and fix electrical faults', 'Read electrical drawings and plans', 'Test installations and issue COCs where qualified', 'Follow SANS 10142 and safety rules', 'Keep tools and equipment in good order'],
      s: ['Fault finding', 'Reading electrical drawings', 'Health and safety', 'Problem solving'] },
    { t: 'Plumber', m: /plumb/i,
      d: ['Install and repair pipes, taps, toilets and geysers', 'Find and fix leaks and blockages', 'Read plans and measure for materials', 'Install drainage and water supply systems', 'Follow building regulations and safety rules', 'Give customers quotes and advice'],
      s: ['Pipe fitting', 'Fault finding', 'Customer service', 'Health and safety'] },
    { t: 'Builder / Construction Worker', m: /build|brick|construct|plaster|tiler|carpent|painter|welder|boilermaker/i,
      d: ['Lay bricks, plaster walls and lay tiles', 'Mix concrete and mortar', 'Read and follow building plans', 'Set up and use scaffolding safely', 'Use hand and power tools correctly', 'Keep the site clean and follow safety rules'],
      s: ['Bricklaying', 'Reading plans', 'Health and safety', 'Teamwork'] },
    { t: 'Mine Worker', m: /mine|mining|miner|underground|rock drill|winch/i,
      d: ['Do underground work safely according to mine standards', 'Operate mining equipment such as drills and winches', 'Support and barricade workplaces', 'Do pre-shift safety checks', 'Report unsafe conditions immediately', 'Work as part of a production team to meet targets'],
      s: ['Mine health and safety', 'Equipment operation', 'Teamwork', 'Physical fitness'] },
    { t: 'Petrol Attendant', m: /petrol|fuel|forecourt|pump attendant/i,
      d: ['Fill vehicles with fuel safely and accurately', 'Check oil, water and tyre pressure for customers', 'Clean windscreens and keep the forecourt tidy', 'Process cash and card payments', 'Follow fuel safety and emergency procedures', 'Sell shop products and promotions'],
      s: ['Customer service', 'Cash handling', 'Safety awareness', 'Friendliness'] },
    { t: 'Hairdresser / Beautician', m: /hair|beaut|nail|salon|barber|stylist|makeup/i,
      d: ['Wash, cut, style and colour hair', 'Advise clients on treatments and products', 'Book appointments and keep client records', 'Keep tools and work stations clean and hygienic', 'Sell salon products', 'Stay up to date with new styles and trends'],
      s: ['Hair styling', 'Customer service', 'Hygiene', 'Creativity'] },
    { t: 'Bookkeeper / Accounts Clerk', m: /bookkeep|account|creditor|debtor|payroll|finance clerk/i,
      d: ['Capture invoices and payments on Pastel or Sage', 'Reconcile bank statements and accounts', 'Process creditors and debtors and follow up payments', 'Prepare VAT and payroll information', 'File financial documents', 'Help prepare month-end reports'],
      s: ['Pastel / Sage accounting', 'Microsoft Excel', 'Reconciliations', 'Attention to detail'] },
    { t: 'Farm Worker', m: /farm|agric|harvest|livestock|garden|landscap/i,
      d: ['Plant, water and harvest crops', 'Feed and care for livestock', 'Operate and maintain farm equipment', 'Apply fertiliser and pesticides safely', 'Repair fences and farm structures', 'Sort and pack produce'],
      s: ['Crop and livestock care', 'Tractor driving', 'Physical fitness', 'Reliability'] },
    { t: 'EPWP / Community Worker', m: /epwp|community|volunteer|ngo|youth|outreach/i,
      d: ['Take part in community projects and programmes', 'Keep attendance registers and reports', 'Help organise community meetings and events', 'Share health and safety information with community members', 'Clean and maintain public spaces', 'Work with ward committees and local leaders'],
      s: ['Community engagement', 'Communication', 'Report writing', 'Teamwork'] },
    { t: 'Intern / Learnership', m: /intern|learner|graduate|trainee|apprentice/i,
      d: ['Learn and assist with daily tasks in the department', 'Complete workplace assignments and logbooks', 'Attend training sessions and workshops', 'Help with filing, data capturing and reports', 'Work with mentors and team members on projects', 'Apply theory from my studies in the workplace'],
      s: ['Willingness to learn', 'Computer literate', 'Teamwork', 'Time management'] }
  ];
  function match(title) {
    if (!title) return null;
    for (var i = 0; i < JOBS.length; i++) if (JOBS[i].m.test(title)) return JOBS[i];
    return null;
  }
  function skillsFor(cv) {
    var out = [];
    (cv.work || []).forEach(function (w) { var j = match(w.position); if (j) j.s.forEach(function (s) { if (out.indexOf(s) < 0) out.push(s); }); });
    return out;
  }
  window.CVDuties = { JOBS: JOBS, match: match, skillsFor: skillsFor };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/checker.js */
try {
/* CV check: finds gaps and mistakes before the CV is sent. level 'fix' = should be fixed, 'tip' = would make it better */
(function () {
  'use strict';
  var D = window.CVData;
  var ROUGH = /(sexy|babe|baby|cutie|hottie|lover|princess|thug|gangst|swag|booty|dollface|sweetie|bae\b|naughty|devil|420|69|killer|hunny|honey|fluffy|cuddl|playboy|bad ?boy|bad ?girl)/i;

  function phoneOk(p) {
    var d = String(p || '').replace(/[\s()\-.]/g, '');
    return /^0\d{9}$/.test(d) || /^\+?27\d{9}$/.test(d);
  }
  function run(cv, pages) {
    var out = [], p = cv.personal || {}, c = cv.contact || {};
    function fix(t, sec, vars) { out.push({ level: 'fix', text: t, sec: sec, vars: vars }); }
    function tip(t, sec, vars) { out.push({ level: 'tip', text: t, sec: sec, vars: vars }); }

    if (!p.firstNames || !p.surname) fix('Add your first name and surname.', 'personal');
    else if (p.firstNames === p.firstNames.toLowerCase() || p.surname === p.surname.toLowerCase()) tip('Start your names with capital letters (for example Tumelo Tau).', 'personal');
    if (p.idNumber && !D.parseSAID(p.idNumber).valid) fix('Your ID number does not look right. Check all 13 digits.', 'personal');

    if (!c.phone) fix('Add a cell number so employers can call you.', 'contact');
    else if (!phoneOk(c.phone)) fix('Check your cell number. South African numbers have 10 digits, for example 072 123 4567.', 'contact');
    if (c.altPhone && !phoneOk(c.altPhone)) tip('Check your alternative number. It should have 10 digits.', 'contact');
    if (!c.email) tip('Add an email address. Many employers reply by email.', 'contact');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) fix('Your email address does not look right. Check it for typing mistakes.', 'contact');
    else if (ROUGH.test(c.email)) tip('Use a simple, professional email address, such as your name (for example thabo.mokoena@gmail.com).', 'contact');
    if (!D.lines(c.address).length) tip('Add your physical address. South African employers usually expect it.', 'contact');

    var s = cv.school || {}, ter = (cv.tertiary || []).filter(function (t) { return t.qualification || t.institution; });
    if (!s.name && !s.grade && !ter.length) fix('Add your school or highest qualification.', 'school');
    else if ((s.name || s.grade) && !s.year) tip('Add the year you finished school.', 'school');
    if (s.grade && /12|matric/i.test(s.grade) && !D.lines(s.subjects).length) tip('List the subjects you passed in Matric.', 'school');
    ter.forEach(function (t) { if (!t.year && t.status !== 'In progress') tip('Add the year for {name}.', 'tertiary', { name: t.qualification || t.institution }); });

    var work = (cv.work || []).filter(function (w) { return w.company || w.position; });
    work.forEach(function (w) {
      var name = w.position || w.company;
      if (!w.start && !w.duration) tip('Add dates (or how long you worked) for {name}.', 'work', { name: name });
      if (!w.current && w.start && w.end && w.end < w.start) fix('The end month for {name} is before the start month.', 'work', { name: name });
      if (!D.lines(w.duties).length) tip('Add 3 or 4 duties for {name} so employers know what you did. Tap "Suggest duties" for ideas.', 'work', { name: name });
      if (!w.company) tip('Add the company name for {name}.', 'work', { name: name });
    });

    var refs = (cv.references || []).filter(function (r) { return r.name; });
    if (!refs.length && !cv.refsOnRequest) fix('Add 2 or 3 references. Most South African employers expect them.', 'refs');
    else if (refs.length === 1) tip('Add one or two more references.', 'refs');
    refs.forEach(function (r) { if (!r.phone) fix('Add a contact number for your reference {name}.', 'refs', { name: r.name }); });
    if (refs.some(function (r) { return /family|mother|father|brother|sister|uncle|aunt|cousin/i.test(r.relationship || ''); }) && refs.length < 3)
      tip('Employers prefer references from a manager, teacher or pastor rather than family.', 'refs');

    if (!D.lines(cv.skills).length) tip('Add a few skills, for example computer literacy or customer service.', 'skills');
    if (!(cv.profile || '').trim()) tip('Add a short career objective (two or three sentences about you).', 'profile');
    else if (cv.profile.length > 650) tip('Your career objective is long. Two or three sentences is enough.', 'profile');
    else if (cv.profile === cv.profile.toUpperCase() && /[A-Z]{6}/.test(cv.profile)) tip('Write your career objective in normal letters, not CAPITALS.', 'profile');

    if (pages && pages > 3) tip('Your CV is {n} pages. Two or three pages is best. Keep recent and relevant jobs, or choose smaller text in Design.', 'design', { n: pages });

    var docs = cv.docs || [];
    if (docs.length) {
      if (!docs.some(function (d) { return /\bid\b|identity/i.test(d.type || ''); })) tip('Most applications ask for a certified copy of your ID. Attach it under Supporting documents.', 'docs');
      if (docs.some(function (d) { return !d.type; })) tip('Name all your documents so the annexure list is clear.', 'docs');
    }
    return out;
  }
  window.CVCheck = { run: run, phoneOk: phoneOk };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/i18n.js */
try {
/* App screens in English, Sesotho, isiZulu and Afrikaans.
   The English text is the key; the word lists are in i18n-dict.js as { "English": ["Sesotho", "isiZulu", "Afrikaans"] }.
   Only the app screens change. CVs, cover letters and Z83 forms stay in English, as employers expect. */
(function () {
  'use strict';
  var LANGS = [['en', 'English', 'en-ZA'], ['st', 'Sesotho', 'st-ZA'], ['zu', 'isiZulu', 'zu-ZA'], ['af', 'Afrikaans', 'af-ZA']];
  var COL = { st: 0, zu: 1, af: 2 };
  var KEY = 'cvmaker.lang';
  // The word list is on the page in the Android app. The website leaves it off the first page load (about 140 KB that
  // English screens never use) and fetches it when someone picks another language - see web/bundle.py and load() below.
  function dict() { return window.CVi18nDict || {}; }
  var cur = 'en';
  try { var saved = localStorage.getItem(KEY); if (saved === 'en' || COL[saved] !== undefined) cur = saved; } catch (e) { /* private mode */ }

  // test builds can collect every text the screens ask for
  var seen = typeof window.__i18nPush === 'function' ? {} : null;

  function t(s) {
    if (s === null || s === undefined || s === '') return s;
    if (seen && !seen[s]) { seen[s] = 1; try { window.__i18nPush(String(s)); } catch (e) { /* ignore */ } }
    if (cur === 'en') return s;
    var row = dict()[s];
    return (row && row[COL[cur]]) || s;
  }
  function info(code) { return LANGS.filter(function (l) { return l[0] === code; })[0] || LANGS[0]; }
  function name() { return info(cur)[1]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // texts that are in index.html rather than drawn by the app
  function applyDoc() {
    document.documentElement.lang = info(cur)[2];
    var back = document.getElementById('btn-back'), menu = document.getElementById('btn-menu');
    if (back) back.setAttribute('aria-label', t('Back'));
    if (menu) menu.setAttribute('aria-label', t('Menu'));
  }

  // website: fetch the word list the first time another language is chosen (the offline helper then keeps it)
  var loading = null;
  function load() {
    if (window.CVi18nDict) return Promise.resolve();
    if (!loading) {
      loading = new Promise(function (res, rej) {
        var el = document.createElement('script'); el.src = 'js/i18n-dict.js';
        el.onload = function () { res(); };
        el.onerror = function () { loading = null; if (el.parentNode) el.parentNode.removeChild(el); rej(new Error('no word list')); };
        document.head.appendChild(el);
      });
    }
    return loading;
  }
  function set(code) {
    if (code !== 'en' && COL[code] === undefined) code = 'en';
    if (code !== 'en' && !window.CVi18nDict) {
      load().then(function () { set(code); }, function () {
        var A = window.App; if (A) A.toast('That language could not be loaded. Check your internet connection and try again.', 5000);
      });
      return;
    }
    var changed = code !== cur;
    cur = code;
    try { localStorage.setItem(KEY, code); } catch (e) { /* private mode */ }
    applyDoc();
    var A = window.App;
    if (A && changed) { A.render(); A.toast(t('The app is now in {name}').replace('{name}', name())); }
  }

  function picker() {
    var A = window.App; if (!A) return;
    var h = '<h3>' + esc(t('Language')) + '</h3><p>' + esc(t('This changes the app screens. Your CV, cover letter and Z83 stay in English, as employers expect.')) + '</p><div class="opts">';
    LANGS.forEach(function (l) {
      h += '<button type="button" class="opt' + (l[0] === cur ? ' on' : '') + '" data-lang="' + l[0] + '"><span class="mk"></span><span class="ot">' + l[1] + '</span></button>';
    });
    h += '</div><p class="lang-note">' + esc(t('The translations are new. If a word reads wrong, please let the developer know.')) + '</p>' +
      '<div class="sheet-foot"><button type="button" class="btn ghost" data-a="cancel">' + esc(t('Cancel')) + '</button></div>';
    var sh = A.openSheet(h);
    sh.onclick = function (e) {
      var b = e.target.closest('[data-lang]');
      if (b) { A.closeSheet(); set(b.getAttribute('data-lang')); return; }
      if (e.target.closest('[data-a="cancel"]')) A.closeSheet();
    };
  }

  window.CVi18n = { t: t, set: set, name: name, picker: picker, lang: function () { return cur; }, LANGS: LANGS, chosen: function () { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyDoc); else applyDoc();
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/app.js */
try {
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
  function cvTitle(cv) { var h = cv && cv.personal && cv.personal.headline; return D.fullName(cv) || (h ? T('{job} CV', { job: h }) : T('Untitled CV')); }
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
  // tapping "CV Maker SA" at the top of the front page refreshes it (everything is saved first)
  $('#bar-title').addEventListener('click', function (e) {
    if (!e.target.closest('#brand')) return;
    saveNow();
    if (App.hooks.refresh) App.hooks.refresh(); else location.reload();
  });

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
      $('#bar-title').innerHTML = '<button type="button" class="brand" id="brand"><img src="img/logo.png" alt="" class="brand-ic"><span class="brand-t"><b>CV Maker SA</b><small>' + T('by {name}', { name: DEVELOPER }) + '</small></span></button>';
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
        (App.hooks.tellFriend ? '<button class="sheet-item" data-m="friend">' + svg('share') + '<span>' + T('Tell a friend') + '<small>' + T('Send CV Maker SA to someone looking for work') + '</small></span></button>' : '') +
        '<button class="sheet-item" data-m="feedback">' + svg('feedback') + '<span>' + T('Send feedback') + '<small>' + T('Tell us what to fix or add') + '</small></span></button>' +
        '<button class="sheet-item" data-m="about">' + svg('info') + '<span>' + T('About') + '</span></button>');
      sh.onclick = function (e) {
        var b = e.target.closest('[data-m]'); if (!b) return; closeSheet();
        var m = b.getAttribute('data-m');
        if (m === 'backup') backup();
        if (m === 'restore') $('#file-restore').click();
        if (m === 'sample') { var c = D.sampleCV(); S.cur = c; S.list.unshift(c); saveNow(); S.stack = ['home', 'edit']; render(); }
        if (m === 'about') about();
        if (m === 'feedback' && App.hooks.feedback) App.hooks.feedback();
        if (m === 'friend' && App.hooks.tellFriend) App.hooks.tellFriend();
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
      '<div class="credit-copy">© ' + new Date().getFullYear() + ' ' + DEVELOPER + '. ' + T('All rights reserved.') + '</div>' +
      (App.hooks.privacy ? '<button type="button" class="about-pp" data-a="privacy">' + T('Privacy policy') + '</button>' : '') + '</div>' +
      '<div class="sheet-foot">' + (App.hooks.feedback ? '<button type="button" class="btn soft" data-a="fb">' + T('Send feedback') + '</button>' : '') +
      '<button type="button" class="btn ghost" data-a="close">' + T('Close') + '</button></div>');
    $('#sheet').onclick = function (e) {
      if (e.target.closest('[data-a="close"]')) closeSheet();
      if (e.target.closest('[data-a="fb"]')) { closeSheet(); App.hooks.feedback(); }
      if (e.target.closest('[data-a="privacy"]')) { closeSheet(); App.hooks.privacy(); }
    };
  }

  /* ---------- home ---------- */
  var APP_VERSION = '2.1';
  var DEVELOPER = 'Tumelo Vincent Tau';
  var SHOWCASE = ['classic', 'aurora', 'mzansi', 'midnight', 'horizon', 'lagoon', 'kalahari', 'roadmap'];
  var SHOWCASE_WIDE = ['navy', 'ats', 'protea', 'timeline']; // 4 more on big screens, so the row has 12 smaller pictures
  var sampleForShow = null;
  function showcaseCV() { if (!sampleForShow) sampleForShow = D.sampleCV(true); return sampleForShow; }
  function renderHome() {
    var n = TP.list.length;
    var sorted = S.list.slice().sort(function (a, b) { return b.updated - a.updated; });
    var h = '<section class="hero">' +
      (window.CVi18n ? '<div class="hero-top"><button class="hero-lang" id="hero-lang" aria-label="' + esc(T('Language') + ': ' + window.CVi18n.name()) + '">' + svg('globe') + '<span>' + esc(window.CVi18n.name()) + '</span></button></div>' : '') +
      '<h1>' + T('Your CV, ready for South African employers') + '</h1>' +
      '<p class="hero-sub">' + T('Make your CV, cover letter and Z83 - and now edit any PDF for free.') + '</p>' +
      '<button class="btn gold block hero-cta" id="new-cv">' + svg('plus') + T('Create new CV') + '</button>' +
      (sorted.length ? '' : '<button class="hero-link" id="try-sample">' + T('Open a sample CV') + '</button>') +
      // two CV pages beside the text on wide screens (hidden on phones)
      '<div class="hero-art" aria-hidden="true"><div class="ha-pg ha2" data-art="navy"></div><div class="ha-pg ha1" data-art="mzansi"></div></div>' +
      '<div class="flagline">' + TP.FLAG.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</div></section>';
    if (App.hooks && App.hooks.homeInstall) h += App.hooks.homeInstall();
    if (App.hooks && App.hooks.homeBackup) h += App.hooks.homeBackup();
    if (App.hooks && App.hooks.homeFeedback) h += App.hooks.homeFeedback();
    if (App.hooks && App.hooks.homeShare) h += App.hooks.homeShare();
    if (sorted.length) {
      h += '<section class="block"><div class="block-h"><h2>' + T('My CVs') + '</h2><span class="count">' + sorted.length + '</span></div><div class="cv-list">';
      sorted.forEach(function (cv) {
        h += '<div class="cv-card" data-id="' + cv.id + '"><div class="mini" data-thumb="' + cv.id + '"></div><div class="meta"><div class="nm2">' + esc(cvTitle(cv)) + '</div>' +
          '<div class="sub">' + esc(T(TP.get(cv.templateId).name)) + '</div><div class="sub">' + T('Edited {date}', { date: fmtWhen(cv.updated) }) + '</div></div>' +
          '<button class="icon-btn" data-quick="' + cv.id + '" aria-label="Download">' + svg('pdf') + '</button>' +
          '<button class="icon-btn" data-more="' + cv.id + '" aria-label="More">' + svg('more') + '</button></div>';
      });
      h += '</div></section>';
    }
    // returning users see their own CVs first, then the PDF tools
    if (App.hooks && App.hooks.homeTools) h += App.hooks.homeTools();
    if (App.hooks && App.hooks.homeApps) h += App.hooks.homeApps();
    if (App.hooks && App.hooks.homeSponsor) h += App.hooks.homeSponsor();
    h += '<section class="block"><div class="block-h"><h2>' + T('Templates') + '</h2><button class="see-all" id="see-all">' + T('See all {n}', { n: n }) + '</button></div>' +
      '<div class="strip">' + (window.innerWidth >= 1400 ? SHOWCASE.concat(SHOWCASE_WIDE) : SHOWCASE).map(function (id) {
        return '<button class="strip-it" data-start="' + id + '"><div class="strip-pg" data-show="' + id + '" aria-hidden="true"></div>' + atsBadge(TP.get(id), 'ats-tw') + '<span>' + esc(T(TP.get(id).name)) + '</span></button>';
      }).join('') + '</div></section>';
    if (App.hooks && App.hooks.homeGuides) h += App.hooks.homeGuides();
    h += '<section class="block"><div class="block-h"><h2>' + T('How it works') + '</h2></div><ol class="steps">' +
      '<li><b>' + T('Fill in your details') + '</b><span>' + T('Personal details, school, work experience and references. Your SA ID number fills in your date of birth for you.') + '</span></li>' +
      '<li><b>' + T('Choose a template') + '</b><span>' + T('Classic SA for traditional employers, or a modern design. You can switch at any time.') + '</span></li>' +
      '<li><b>' + T('Add a cover letter and documents') + '</b><span>' + T('The cover letter is written for you. Take photos of your ID copy and certificates. Government jobs get a Z83 form.') + '</span></li>' +
      '<li><b>' + T('Save or share') + '</b><span>' + T('Download everything as one PDF, or send it straight to WhatsApp or email. The tracker reminds you of closing dates.') + '</span></li></ol></section>';
    h += creditHTML();
    var v = $('#v-home'); v.innerHTML = h;
    // real page previews
    var cvs = showcaseCV();
    // The built website has a ready-made picture of every template (cv-templates/img, made by tools/gallery-shots.js):
    // one small file, where drawing the page here fetches that template's fonts (about 20 font files for the front page).
    // If the picture cannot be fetched (no internet yet), the page is drawn instead. The Android app always draws.
    var pics = !NATIVE && !!document.querySelector('meta[name="cvm-offline"]');
    var showIn = function (el, id, w) {
      var url = pics ? 'cv-templates/img/' + encodeURIComponent(id) + '.webp' : '';
      if (!url) { el.innerHTML = PG.thumb(cvs, id, w); return; }
      var im = new Image(); im.alt = ''; im.className = 'show-pic'; im.decoding = 'async';
      im.onerror = function () { if (el.parentNode) el.innerHTML = PG.thumb(cvs, id, w); };
      el.innerHTML = ''; el.appendChild(im); im.src = url;
    };
    // the template pictures are below the first screen on a phone: draw them when the row comes near the screen
    var drawShows = function () {
      Array.prototype.forEach.call(v.querySelectorAll('[data-show]'), function (el) {
        if (!el.firstChild) showIn(el, el.getAttribute('data-show'), el.clientWidth || 120);
      });
    };
    var strip = v.querySelector('.strip');
    if (strip && window.IntersectionObserver) {
      var io = new IntersectionObserver(function (list) {
        if (list.some(function (en) { return en.isIntersecting; })) { io.disconnect(); drawShows(); }
      }, { rootMargin: '120px 0px' });
      io.observe(strip);
    } else drawShows();
    Array.prototype.forEach.call(v.querySelectorAll('[data-art]'), function (el) {
      if (el.clientWidth) showIn(el, el.getAttribute('data-art'), el.clientWidth);
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
      '<div class="credit-copy">© ' + new Date().getFullYear() + ' ' + DEVELOPER + '. ' + T('All rights reserved.') + '</div>' +
      // website only: links to the site's own pages (templates, examples, guides, about, privacy policy)
      (App.hooks && App.hooks.homeFoot ? App.hooks.homeFoot() : '') + '</footer>';
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
      f: [['personal.firstNames', 'First name(s)', 'text', { ph: 'e.g. Tumelo Vincent' }], ['personal.surname', 'Surname', 'text', {}],
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
  var FILTERS = [['all', 'All'], ['ats', 'ATS-friendly'], ['new', 'New'], ['classic', 'Classic SA'], ['modern', 'Modern'], ['two', 'Two columns'], ['bold', 'Colourful'],
    ['minimal', 'Minimal'], ['photo', 'With photo']];
  // small "ATS" label for designs that job-application websites read correctly
  function atsBadge(t, cls) { return t.ats ? '<span class="ats-b ' + (cls || '') + '">' + svg('check') + 'ATS</span>' : ''; }
  var tplObserver = null;
  function renderTemplates() {
    var c = S.cur || { templateId: '', photo: '', showPhoto: true, personal: {} };
    var data = hasContent(c) ? c : Object.assign(D.sampleCV(true), { photo: c.photo, showPhoto: c.showPhoto });
    if (!c.photo && !hasContent(c)) data.photo = '';
    // phones 2 columns, tablets 3, computers 5 (the gallery is wider there, see "Larger screens" in app.css)
    var wide = window.matchMedia && matchMedia('(min-width: 1000px)').matches;
    var cw = Math.min(document.documentElement.clientWidth, wide ? 1132 : 720), cols = wide ? 5 : (cw >= 560 ? 3 : 2);
    var w = Math.max(120, Math.floor((cw - 28 + 14) / cols - 14));
    var h = '<div class="filters">' + FILTERS.map(function (f) { return '<button class="fchip' + (S.filter === f[0] ? ' on' : '') + '" data-f="' + f[0] + '">' + T(f[1]) + '</button>'; }).join('') + '</div>';
    h += '<div class="ats-note">' + atsBadge({ ats: true }) + '<span>' + T('Templates marked ATS are ATS-friendly: job websites and online application systems read them correctly. Use one of them when you apply online.') + '</span></div>';
    h += '<div class="tgrid">';
    TP.list.forEach(function (t) {
      if (S.filter !== 'all' && t.tags.indexOf(S.filter) < 0) return;
      var on = c.templateId === t.id;
      h += '<button class="tcard' + (on ? ' on' : '') + '" data-t="' + t.id + '"><div class="tw" data-th="' + t.id + '" style="height:' + Math.round(w * 1123 / 794) + 'px">' + (on ? '<span class="badge">' + T('Selected') + '</span>' : '') + atsBadge(t, 'ats-tw') + '</div>' +
        '<div class="tn">' + esc(t.name) + '</div><div class="tt">' + esc(T(t.tags.indexOf('classic') >= 0 ? 'Classic' : (t.tags.indexOf('photo') >= 0 ? 'Modern · photo' : 'Modern'))) + '</div></button>';
    });
    h += '</div>';
    var v = $('#v-tpl'); v.innerHTML = h;
    var cards = Array.prototype.slice.call(v.querySelectorAll('[data-th]'));
    function fill(el) { if (el.getAttribute('data-done')) return; el.setAttribute('data-done', '1'); el.insertAdjacentHTML('beforeend', PG.thumb(data, el.getAttribute('data-th'), w)); }
    // with 100 designs, only draw the ones that are (nearly) on screen
    if (window.IntersectionObserver) {
      if (tplObserver) tplObserver.disconnect();
      tplObserver = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { tplObserver.unobserve(e.target); fill(e.target); } });
      }, { rootMargin: '700px 0px' });
      cards.forEach(function (el) { tplObserver.observe(el); });
      return;
    }
    // older phones: a few at a time so the screen stays responsive
    var i = 0;
    (function step() {
      if (S.stack[S.stack.length - 1] !== 'tpl') return;
      for (var k = 0; k < 3 && i < cards.length; k++, i++) fill(cards[i]);
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
        '<button class="btn soft small" data-pv="tpl">' + T('Template') + '</button></div><div id="pv-check"></div>' +
        (t.ats ? '<div class="pv-warn good pv-ats">' + svg('check') + '<span><b>' + T('ATS-friendly') + '</b><small>' + T('Safe for online job applications.') + '</small></span></div>' :
          '<button class="pv-warn pv-ats" data-pv="ats">' + svg('info') + '<span><b>' + T('Not ATS-friendly') + '</b><small>' +
          T('Job websites may read this design wrongly. Tap to see the {n} ATS-friendly templates.', { n: TP.ATS.length }) + '</small></span></button>');
    } else if (tab === 'letter') {
      if (!hasLetter(c)) {
        v.innerHTML = h + emptyCard('letter'); return;
      }
      h += '<div class="pv-info"><div class="tname">' + esc(T('Cover letter')) + '</div><button class="btn soft small" data-pv="letter">' + svg('edit') + T('Edit letter') + '</button></div>';
    } else {
      if (!hasZ83(c)) { v.innerHTML = h + emptyCard('z83'); return; }
      h += '<div class="pv-info"><div class="tname">' + esc(T('Z83 form')) + '</div><button class="btn soft small" data-pv="z83">' + svg('edit') + T('Edit Z83') + '</button></div><div id="pv-z83miss"></div>';
    }
    h += '<div class="pages" id="pages"><div class="busy-card" style="box-shadow:none;background:none"><div class="spin"></div>' + T('Preparing preview…') + '</div></div><div id="pv-docs"></div>' +
      (App.hooks && App.hooks.pvSponsor ? '<div id="pv-sponsor">' + App.hooks.pvSponsor() + '</div>' : '');
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
    if (k === 'ats') { S.filter = 'ats'; go('tpl'); }
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
    if (!TP.get(c.templateId).ats) h += '<button class="pv-warn sheet-warn" data-x="go-ats">' + svg('info') + '<span><b>' + T('Applying on a job website?') + '</b><small>' +
      T('This design is not ATS-friendly. Choose a template marked ATS.') + '</small></span></button>';
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
      if (x === 'go-ats') { S.filter = 'ats'; go('tpl'); return; }
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
    if (App.hooks && App.hooks.delivered) App.hooks.delivered(mode);
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
      if (App.hooks.backedUp) App.hooks.backedUp(); // the website's backup reminder
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
    MONTHS: MONTHS, VERSION: APP_VERSION, backup: function () { backup(); }
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
  // turning a tablet or resizing a computer window: redraw the screens whose layout depends on the width
  var lastW = window.innerWidth, rsTimer;
  window.addEventListener('resize', function () {
    if (Math.abs(window.innerWidth - lastW) < 40) return; // the keyboard opening only changes the height
    lastW = window.innerWidth; clearTimeout(rsTimer);
    rsTimer = setTimeout(function () { var v = S.stack[S.stack.length - 1]; if (v === 'home') renderHome(); if (v === 'tpl') renderTemplates(); }, 250);
  });
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
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/ui-apply.js */
try {
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
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/ui-more.js */
try {
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
  function statusCls(s) { return 'ast-' + STATUS.indexOf(s); }
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
      return '<button class="app-card" data-app="' + a.id + '"><div class="app-top"><b>' + esc(a.position || T('Untitled job')) + '</b><span class="ast ' + statusCls(a.status) + '">' + esc(T(a.status)) + '</span></div>' +
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
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/word.js */
try {
/* Word to PDF: reads a .docx (docx-preview), lays it out on A4 pages, and writes a PDF with real text
   using the same page-drawing code as the CVs (pdf.js in this app). */
(function () {
  'use strict';
  var PW = 794, PH = 1123;
  // Word fonts -> the open fonts bundled with the app (same shape and width where possible)
  var FONTMAP = [
    [/calibri|carlito|aptos/i, 'carlito'], [/cambria|caladea/i, 'caladea'], [/garamond/i, 'garamond'],
    [/times|georgia|book antiqua|palatino|pagella|century schoolbook|bookman/i, 'pagella'],
    [/arial|helvetica|liberation sans|segoe|verdana|tahoma|trebuchet|roboto|franklin|corbel|candara|gill/i, 'roboto'],
    [/century gothic|montserrat|futura|avenir/i, 'montserrat'], [/open sans/i, 'opensans'], [/lato/i, 'lato'], [/poppins/i, 'poppins'],
    [/raleway/i, 'raleway'], [/oswald|impact|bebas/i, 'oswald'], [/nunito/i, 'nunito'], [/merriweather/i, 'merriweather'],
    [/playfair/i, 'playfair'], [/source sans/i, 'sourcesans'], [/dm sans/i, 'dmsans']
  ];
  function mapFont(ff) {
    var first = String(ff || '').split(',')[0].replace(/["']/g, '').trim();
    for (var i = 0; i < FONTMAP.length; i++) if (FONTMAP[i][0].test(first)) return FONTMAP[i][1];
    return /serif/i.test(first) && !/sans/i.test(first) ? 'pagella' : 'carlito';
  }

  /* ---- list numbers and bullets: Word draws them with CSS counters, which a PDF cannot copy, so make them real text ---- */
  function roman(n) { var r = '', v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], s = ['m', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i']; for (var i = 0; i < v.length; i++) while (n >= v[i]) { r += s[i]; n -= v[i]; } return r; }
  function alpha(n) { var s = ''; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(97 + r) + s; n = Math.floor((n - 1) / 26); } return s; }
  function fmtNum(n, f) {
    f = (f || 'decimal').trim();
    if (f === 'lower-alpha' || f === 'lower-latin') return alpha(n);
    if (f === 'upper-alpha' || f === 'upper-latin') return alpha(n).toUpperCase();
    if (f === 'lower-roman') return roman(n);
    if (f === 'upper-roman') return roman(n).toUpperCase();
    if (f === 'decimal-leading-zero') return (n < 10 ? '0' : '') + n;
    return String(n);
  }
  function unescapeCss(s) {
    return s.replace(/\\([0-9a-fA-F]{1,6})\s?/g, function (m, h) { return String.fromCodePoint(parseInt(h, 16)); }).replace(/\\(.)/g, '$1');
  }
  function numberingRules(styleHost) {
    var rules = {};
    Array.prototype.forEach.call(styleHost.querySelectorAll('style'), function (st) {
      var list; try { list = st.sheet.cssRules; } catch (e) { return; }
      Array.prototype.forEach.call(list, function (r) {
        var m = /^p\.([\w-]+-num-\d+-\d+)::?before$/.exec(r.selectorText || '');
        if (m) rules[m[1]] = { content: r.style.content || '', font: r.style.fontFamily || '' };
        var m2 = /^p\.([\w-]+-num-\d+-\d+)$/.exec(r.selectorText || '');
        if (m2 && r.style.counterReset) (rules[m2[1] + '|reset'] = r.style.counterReset);
      });
    });
    return rules;
  }
  function makeMarkers(root, rules) {
    var counters = {};
    Array.prototype.forEach.call(root.querySelectorAll('p'), function (p) {
      var cls = Array.prototype.filter.call(p.classList, function (c) { return /-num-\d+-\d+$/.test(c); })[0];
      if (!cls || !rules[cls]) return;
      var mm = /-num-(\d+)-(\d+)$/.exec(cls), id = mm[1], lvl = +mm[2], prefix = cls.replace(/-\d+-\d+$/, '');
      counters[cls] = (counters[cls] || 0) + 1;
      for (var l = lvl + 1; l < 10; l++) delete counters[prefix + '-' + id + '-' + l];
      var text = '', re = /"((?:[^"\\]|\\.)*)"|counters?\(\s*([\w-]+)\s*(?:,\s*(?:"[^"]*"\s*,\s*)?([\w-]+))?\s*\)/g, t;
      var content = rules[cls].content;
      while ((t = re.exec(content))) {
        if (t[1] !== undefined) text += unescapeCss(t[1]);
        else text += fmtNum(counters[t[2]] || 1, t[3]);
      }
      text = text.replace(/\t/g, ' ').replace(/\s+$/, '');
      var sym = /symbol|wingdings/i.test(rules[cls].font);
      if (!/[0-9A-Za-z]/.test(text) || sym) {
        var ch = text.trim();
        text = ch === 'o' ? '◦' : (/[§▪■]/.test(ch) ? '▪' : '•');
      }
      if (!text) return;
      p.classList.add('wp-nomark');
      var sp = document.createElement('span');
      sp.className = 'wp-mk';
      sp.textContent = text;
      p.insertBefore(sp, p.firstChild);
    });
  }

  function fontsReady(keys) {
    var loads = [];
    Object.keys(keys).forEach(function (k) {
      (window.CV_FONTS[k] || [400]).forEach(function (w) { if (document.fonts && document.fonts.load) loads.push(document.fonts.load(w + ' 16px "F-' + k + '"').catch(function () {})); });
    });
    return Promise.all(loads).then(function () { return document.fonts ? document.fonts.ready : null; });
  }

  function toPdf(bytes) {
    var stage = document.getElementById('word-stage');
    if (stage) stage.remove();
    stage = document.createElement('div'); stage.id = 'word-stage';
    var styleHost = document.createElement('div'), src = document.createElement('div'), out = document.createElement('div');
    out.className = 'wp-root';
    out.style.cssText = 'position:relative;width:' + PW + 'px;background:#fff;';
    stage.appendChild(styleHost); stage.appendChild(src); stage.appendChild(out);
    document.body.appendChild(stage);
    if (!document.getElementById('word-css')) {
      var extra = document.createElement('style'); extra.id = 'word-css';
      extra.textContent = '#word-stage .wp-nomark::before{content:none!important}#word-stage .wp-mk{display:inline-block;min-width:18pt;text-indent:0;white-space:pre}#word-stage .dx{hyphens:manual!important}';
      document.head.appendChild(extra);
    }
    return (window.CVLibs ? window.CVLibs.need('zip') : Promise.resolve()).then(function () {
      return window.CVPdfTools.loadScript('js/lib/docx-preview.min.js');
    }).then(function () {
      return window.docx.renderAsync(new Blob([bytes]), src, styleHost, {
        className: 'dx', inWrapper: false, ignoreWidth: false, ignoreHeight: false, ignoreFonts: true, breakPages: true,
        ignoreLastRenderedPageBreak: true, useBase64URL: true, renderHeaders: true, renderFooters: true, renderFootnotes: true, renderEndnotes: true, experimental: false
      });
    }).catch(function () { throw new Error(window.App.T('This Word file could not be read.')); }).then(function () {
      makeMarkers(src, numberingRules(styleHost));
      // fonts: use the matching bundled font for every piece of text
      var used = { carlito: 1 };
      Array.prototype.forEach.call(src.querySelectorAll('*'), function (el) {
        if (el.tagName === 'svg' || el.closest('svg')) return;
        var k = mapFont(getComputedStyle(el).fontFamily); used[k] = 1;
        el.style.fontFamily = '"F-' + k + '"';
      });
      return fontsReady(used);
    }).then(function () { return paginate(src, out); }).then(function (n) {
      var res = { root: out, pages: n, tpl: { decor: function () { return []; }, family: 'word', page: { mt: 0, mb: 0 } } };
      return window.CVPdf.make(res, { title: 'Document' }).then(function (pdf) { stage.remove(); return { bytes: pdf, pages: n }; });
    }).catch(function (e) { stage.remove(); throw e; });
  }

  // moves the blocks of each Word section onto A4 pages, splitting long tables by rows
  function paginate(src, out) {
    var pages = 0;
    function newPage(sec) {
      var pg = document.createElement('section');
      pg.className = sec.className + ' wp-page';
      var cs = getComputedStyle(sec);
      pg.style.cssText = 'position:absolute;left:0;top:' + (pages * PH) + 'px;width:' + PW + 'px;height:' + PH + 'px;min-height:0;overflow:hidden;box-sizing:border-box;background:#fff;' +
        'padding:' + cs.paddingTop + ' ' + cs.paddingRight + ' ' + cs.paddingBottom + ' ' + cs.paddingLeft + ';';
      Array.prototype.forEach.call(sec.children, function (c) {
        if (c.tagName === 'ARTICLE') { var a = document.createElement('article'); a.className = c.className; a.setAttribute('style', c.getAttribute('style') || ''); pg.appendChild(a); pg.art = a; }
        else pg.appendChild(c.cloneNode(true));
      });
      if (!pg.art) { pg.art = document.createElement('article'); pg.appendChild(pg.art); }
      out.appendChild(pg); pages++;
      out.style.height = (pages * PH) + 'px';
      return pg;
    }
    function over(pg) { return pg.scrollHeight > PH + 0.5; }
    Array.prototype.forEach.call(src.querySelectorAll('section'), function (sec) {
      if (sec.parentNode !== src && !sec.parentNode.classList.contains('dx-wrapper')) return;
      var art = sec.querySelector('article'), blocks = art ? Array.prototype.slice.call(art.children) : [];
      var pg = newPage(sec);
      blocks.forEach(function (b) {
        pg.art.appendChild(b);
        if (!over(pg) || pg.art.children.length === 1) return;
        if (b.tagName === 'TABLE' && b.rows && b.rows.length > 1) {
          // keep the rows that fit, carry the rest to the next page(s)
          var rest = b;
          while (true) {
            var rows = Array.prototype.slice.call(rest.rows), shell = rest.cloneNode(false);
            Array.prototype.forEach.call(rest.children, function (c) { if (c.tagName === 'COLGROUP') shell.appendChild(c.cloneNode(true)); });
            var body = document.createElement('tbody'); shell.appendChild(body);
            rest.parentNode.replaceChild(shell, rest);
            var k = 0;
            for (; k < rows.length; k++) { body.appendChild(rows[k]); if (over(pg)) { body.removeChild(rows[k]); break; } }
            if (k === 0) { shell.remove(); } // nothing fitted: start the table on a new page
            if (k >= rows.length) break;
            var next = shell.cloneNode(false);
            Array.prototype.forEach.call(shell.children, function (c) { if (c.tagName === 'COLGROUP') next.appendChild(c.cloneNode(true)); });
            var nb = document.createElement('tbody'); next.appendChild(nb);
            for (var j = k; j < rows.length; j++) nb.appendChild(rows[j]);
            pg = newPage(sec); pg.art.appendChild(next);
            if (!over(pg) || next.rows.length === 1) break;
            rest = next;
          }
          return;
        }
        pg.art.removeChild(b);
        pg = newPage(sec); pg.art.appendChild(b);
      });
    });
    if (!pages) { var empty = document.createElement('section'); empty.className = 'dx wp-page'; empty.style.cssText = 'position:absolute;left:0;top:0;width:' + PW + 'px;height:' + PH + 'px'; out.appendChild(empty); pages = 1; out.style.height = PH + 'px'; }
    src.innerHTML = '';
    return pages;
  }

  window.CVWord = { toPdf: toPdf };
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/ui-pdf.js */
try {
/* Screens: PDF tools hub, My files, PDF viewer, merge, pages (organise / split), compress,
   protect ID copy, password, PDF to photos, Word to PDF, files opened from other apps. */
(function () {
  'use strict';
  var A = window.App, PT = window.CVPdfTools, F = window.CVFiles, D = window.CVData;
  var $ = A.$, esc = A.esc, T = A.T, S = A.S, NATIVE = window.AndroidBridge || null;

  /* ---------- outlined icons for the PDF tools ---------- */
  var IC = {
    redact: 'M4 6h16v5H4z M4 14h9 M4 18h12 M16 14h4', pnum: 'M6.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z M9.5 17h5 M12 15v4',
    addpage: 'M7.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z M12.5 11v6 M9.5 14h6',
    ocr: 'M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8 M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8 M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16 M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16 M8 9h8 M12 9v7',
    toword: 'M7.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z M14 3v5h5 M8.5 12l1.2 5 1.8-4 1.8 4 1.2-5',
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
    edit: 'M4 20h4l10.5-10.5-4-4L4 16z M13.5 6.5l4 4',
    edtext: 'M3.5 6.5V4.5h11v2 M9 4.5v12 M6.5 16.5h5 M13 20.5v-2.6l5.6-5.6 2.6 2.6-5.6 5.6z',
    pdfedit: 'M7.5 3H14l5 5v3 M14 3v5h5 M6 19.5v-15A1.5 1.5 0 0 1 7.5 3 M6 19.5A1.5 1.5 0 0 0 7.5 21H11 M9 9h3 M9 12.5h4 M14 21v-2.6l5.4-5.4 2.6 2.6-5.4 5.4z',
    hl: 'M9.5 18.5l-4 1 1-4L15.8 6.2a2.1 2.1 0 0 1 3 3z M14 8l3 3 M3.5 21.5h17', rect: 'M4.5 6h15v12h-15z', line: 'M5 19L19 5 M12 5h7v7', left: 'M15 5l-7 7 7 7', right: 'M9 5l7 7-7 7', up: 'M5 15l7-7 7 7', down: 'M5 9l7 7 7-7',
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
      if (f.edit) { F.store.del(f.edit.base).catch(function () {}); F.store.del(f.edit.data).catch(function () {}); }
      return F.store.del(f.fileId).catch(function () {});
    },
    // a file saved again after "Change what you added": same name, new contents
    replace: function (meta, bytes, pages) {
      return F.store.put(meta.fileId, bytes).then(function () {
        var out = null;
        Files.update(meta.id, function (f) { f.size = bytes.length; f.pages = pages || f.pages; f.opened = Date.now(); f.created = Date.now(); out = f; });
        return out || meta;
      });
    },
    // what the editor needs to change the added things later: the PDF before the changes, and the list of changes
    setEdit: function (meta, base, data) {
      var e = { base: 'pfe-' + meta.id + '-b', data: 'pfe-' + meta.id + '-d' }, json = new TextEncoder().encode(JSON.stringify(data));
      return F.store.put(e.base, base).then(function () { return F.store.put(e.data, json); }).then(function () {
        Files.update(meta.id, function (f) { f.edit = e; }); meta.edit = e; return meta;
      });
    },
    editData: function (meta) {
      var e = meta.edit;
      return Promise.all([F.store.get(e.base), F.store.get(e.data)]).then(function (r) {
        if (!r[0] || !r[1]) throw new Error('gone');
        return { base: r[0], data: JSON.parse(new TextDecoder().decode(r[1])) };
      });
    }
  };
  A.hooks.fileInUse = function (k) { return Files.list().some(function (f) { return f.fileId === k || (f.edit && (f.edit.base === k || f.edit.data === k)); }); };
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
    edit: ['pdfedit', 'c-blue', 'Edit PDF', 'Change text, add pictures, sign', 'Edit PDF'],
    scan: ['scan', 'c-green', 'Scan to PDF', 'Camera, finds the page edges', 'Scan'],
    photos: ['photos', 'c-green', 'Photos to PDF', 'From your gallery', 'Photos to PDF'],
    word: ['word', 'c-green', 'Word to PDF', '.docx letters and CVs', 'Word to PDF'],
    open: ['eye', 'c-blue', 'Open PDF', 'Read any PDF', 'Open PDF'],
    sign: ['fill', 'c-blue', 'Fill & sign', 'Type on forms, sign, tick', 'Fill & sign'],
    tophotos: ['topics', 'c-blue', 'PDF to photos', 'Pages as JPG for WhatsApp', 'PDF to photos'],
    toword: ['toword', 'c-blue', 'PDF to Word', 'Editable Word file', 'PDF to Word'],
    merge: ['merge', 'c-purple', 'Merge', 'Join PDFs into one', 'Merge'],
    split: ['scissors', 'c-purple', 'Split', 'Take out pages', 'Split'],
    organise: ['grid', 'c-purple', 'Organise', 'Move, rotate, delete', 'Organise'],
    compress: ['compress', 'c-orange', 'Compress', 'Smaller for email', 'Compress'],
    protect: ['shield', 'c-red', 'Protect ID copy', 'Add a watermark', 'Protect ID copy'],
    lock: ['lock', 'c-red', 'Password', 'Lock a PDF', 'Password'],
    more: ['dots', 'c-gold', 'More tools', '', 'More tools']
  };
  // the big "Edit PDF" card, first in the PDF tools
  function feature() {
    return '<button class="tool-feat" data-tool="edit"><span class="tf-ic">' + ic('pdfedit') + '</span><span class="tf-t"><b>' + T('Edit PDF') + '<em>' + T('FREE') + '</em></b><span>' +
      T('Change the text in any PDF, fill in forms, add text, pictures and your signature, black out private details. No watermark, and your file stays on your phone.') + '</span></span>' + ic('right', 'tf-go') + '</button>';
  }
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
    var titles = { edit: 'Edit PDF', open: 'Open PDF', sign: 'Fill & sign', tophotos: 'PDF to photos', toword: 'PDF to Word', split: 'Split', organise: 'Organise pages', compress: 'Compress', lock: 'Password' };
    choose({ title: T(titles[k]), photos: k === 'sign' || k === 'edit' }).then(function (l) {
      var src = l[0];
      if (k === 'sign' && src.kind === 'image') { photoToPdf(src).then(function (s2) { if (A.PDF.startSign) A.PDF.startSign(s2); }); return; }
      if (k === 'edit' && src.kind === 'image') { photoToPdf(src).then(function (s2) { if (A.PDF.startEdit) A.PDF.startEdit(s2); }); return; }
      if (src.kind !== 'pdf') { toast(T('Please choose a PDF file.')); return; }
      if (k === 'open') { keepAndOpen(src); return; }
      if (k === 'sign') { if (A.PDF.startSign) A.PDF.startSign(src); return; }
      if (k === 'edit') { if (A.PDF.startEdit) A.PDF.startEdit(src); return; }
      if (k === 'tophotos') { photosSheet(src); return; }
      if (k === 'toword') { toWord(src); return; }
      if (k === 'split' || k === 'organise') { startPages(src, k); return; }
      if (k === 'compress') { C.src = src; C.res = null; A.go('compress'); return; }
      if (k === 'lock') { K.src = src; A.go('lock'); return; }
    });
  }
  // PDF to Word: an editable .docx made on the phone
  var DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  function toWord(src) {
    busy(T('Making a Word file…'));
    var name = stem(src.name) + '.docx';
    bytesOf(src).then(function (bytes) {
      return openDoc(bytes, src.name, src.pw).then(function (r) {
        return window.CVPdfWord.convert(r.doc, bytes, stem(src.name), function (f) { busy(T('Making a Word file…') + ' ' + Math.round(f * 100) + '%'); })
          .then(function (out) { r.doc.destroy(); return out; }, function (e) { r.doc.destroy(); throw e; });
      });
    }).then(function (out) {
      A.done();
      var h = '<div class="res-h"><span class="ok">' + ic('check') + '</span><b>' + T('Your Word file is ready') + '</b></div>' +
        '<div class="frow" style="pointer-events:none"><div class="pdfb" style="background:#1B5EBE">W</div><div class="fmeta"><b>' + esc(name) + '</b><span>' + fmtSize(out.length) + '</span></div></div>' +
        '<div class="btns two"><button class="btn gold" data-w="save">' + ic('save') + ' ' + T('Save to phone') + '</button><button class="btn soft" data-w="share">' + ic('share') + ' ' + T('Share') + '</button></div>' +
        '<div class="res-note">' + T('Check it before you send it: tables and special layouts may need tidying in Word. Scanned pages come in as pictures.') + '</div>';
      var sh = A.openSheet(h);
      sh.querySelectorAll('.btns .ico').forEach(function (x) { x.style.marginRight = '6px'; });
      sh.onclick = function (e) {
        var b = e.target.closest('[data-w]'); if (!b) return;
        A.setLastSize(out.length); A.deliverMany([{ bytes: out, name: name, mime: DOCX_MIME }], b.getAttribute('data-w'));
      };
    }).catch(function (e) { if (e && e.message !== 'cancel') failMsg(e); });
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
    return '<section class="block" style="margin-top:20px"><div class="block-h"><h2>' + T('PDF tools') + '<span class="new-pill">' + T('NEW') + '</span></h2><button class="see-all" data-tool="more">' + T('See all {n}', { n: 14 }) + '</button></div>' +
      feature() + '<div class="tg four">' + (window.innerWidth >= 1400 ? ['scan', 'photos', 'word', 'toword', 'open', 'sign', 'tophotos', 'merge', 'split', 'organise', 'compress', 'protect', 'lock']
        : ['scan', 'photos', 'toword', 'sign', 'merge', 'compress', 'protect', 'more']).map(function (k) { return tile(k, true); }).join('') + '</div></section>';
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
      var h = feature() + '<div class="grp">' + T('Make a PDF') + '</div><div class="tg">' + tile('scan') + tile('photos') + tile('word') + '</div>' +
        '<div class="grp">' + T('View & edit') + '</div><div class="tg">' + tile('open') + tile('sign') + tile('tophotos') + tile('toword') + '</div>' +
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
        '<div class="tbar"><button data-vt="edit">' + ic('pdfedit') + T('Edit') + '</button><button data-vt="sign">' + ic('fill') + T('Fill & sign') + '</button><button data-vt="pages">' + ic('grid') + T('Pages') + '</button>' +
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
    if (a === 'edit') { if (A.PDF.startEdit) A.PDF.startEdit(src); }
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
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/ui-scan.js */
try {
/* Scan to PDF and Photos to PDF: live camera that finds the page edges, ID card (both sides on one page),
   corner adjustment, scanner looks, and the "check your scan" screen. */
(function () {
  'use strict';
  var A = window.App, PT = window.CVPdfTools, PDF = A.PDF;
  var $ = A.$, esc = A.esc, T = A.T, S = A.S, ic = PDF.ic;

  /* ================= image maths ================= */
  // finds the page or card in a photo; returns 4 corners (0-1) TL, TR, BR, BL, or null.
  // First it compares every spot with the colour of the table around the edges of the photo (finds dark headers too);
  // if that does not give a clear shape it looks for the brightest area instead.
  function findQuad(src, sw, sh) {
    var s = 220 / Math.max(sw, sh), w = Math.max(8, Math.round(sw * s)), h = Math.max(8, Math.round(sh * s)), n = w * h;
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var g = cv.getContext('2d'); g.drawImage(src, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data, i, x, y;
    // light blur (3x3) on each colour so print inside the page does not break it up
    var R = new Float32Array(n), G2 = new Float32Array(n), B = new Float32Array(n);
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var tr = 0, tg = 0, tb = 0, c = 0;
      for (var yy = Math.max(0, y - 1); yy <= Math.min(h - 1, y + 1); yy++) for (var xx = Math.max(0, x - 1); xx <= Math.min(w - 1, x + 1); xx++) { var k = (yy * w + xx) * 4; tr += d[k]; tg += d[k + 1]; tb += d[k + 2]; c++; }
      R[y * w + x] = tr / c; G2[y * w + x] = tg / c; B[y * w + x] = tb / c;
    }
    function shapeFrom(mask) {
      var seen = new Uint8Array(n), stack = new Int32Array(n), bestArea = 0, bestPix = null;
      for (var a = 0; a < n; a++) {
        if (seen[a] || !mask[a]) continue;
        var top = 0, area = 0, pix = [];
        stack[top++] = a; seen[a] = 1;
        while (top) {
          var q = stack[--top], qx = q % w; area++; pix.push(q);
          if (qx > 0 && !seen[q - 1] && mask[q - 1]) { seen[q - 1] = 1; stack[top++] = q - 1; }
          if (qx < w - 1 && !seen[q + 1] && mask[q + 1]) { seen[q + 1] = 1; stack[top++] = q + 1; }
          if (q >= w && !seen[q - w] && mask[q - w]) { seen[q - w] = 1; stack[top++] = q - w; }
          if (q < n - w && !seen[q + w] && mask[q + w]) { seen[q + w] = 1; stack[top++] = q + w; }
        }
        if (area > bestArea) { bestArea = area; bestPix = pix; }
      }
      if (!bestPix || bestArea < n * 0.06 || bestArea > n * 0.95) return null;
      var tl = [0, 0, 1e9], trc = [0, 0, -1e9], br = [0, 0, -1e9], blc = [0, 0, 1e9];
      for (var j = 0; j < bestPix.length; j++) {
        var p = bestPix[j], px = p % w, py = (p - px) / w;
        if (px + py < tl[2]) tl = [px, py, px + py];
        if (px + py > br[2]) br = [px, py, px + py];
        if (px - py > trc[2]) trc = [px, py, px - py];
        if (px - py < blc[2]) blc = [px, py, px - py];
      }
      var quad = [tl, trc, br, blc].map(function (c2) { return [c2[0] + 0.5, c2[1] + 0.5]; });
      var qa = Math.abs(polyArea(quad));
      if (qa < n * 0.05 || bestArea / qa < 0.78) return null;
      return quad;
    }
    // 1) differs from the table colour (taken from a strip around the edges)
    var edge = [], m = Math.max(2, Math.round(Math.min(w, h) * 0.04));
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) if (x < m || y < m || x >= w - m || y >= h - m) edge.push(y * w + x);
    function med(arr) { var a = arr.slice().sort(function (p, q) { return p - q; }); return a[a.length >> 1]; }
    var er = [], eg = [], eb = [];
    edge.forEach(function (k) { er.push(R[k]); eg.push(G2[k]); eb.push(B[k]); });
    var mr = med(er), mg = med(eg), mb = med(eb);
    var ed = edge.map(function (k) { var a = R[k] - mr, b = G2[k] - mg, c2 = B[k] - mb; return Math.sqrt(a * a + b * b + c2 * c2); }).sort(function (p, q) { return p - q; });
    var thr = Math.max(38, ed[Math.floor(ed.length * 0.9)] * 1.6);
    var mask = new Uint8Array(n);
    for (i = 0; i < n; i++) { var a1 = R[i] - mr, b1 = G2[i] - mg, c1 = B[i] - mb; mask[i] = Math.sqrt(a1 * a1 + b1 * b1 + c1 * c1) > thr ? 1 : 0; }
    var quad = shapeFrom(mask);
    // 2) the brightest area (Otsu threshold on brightness)
    if (!quad) {
      var lum = new Uint8Array(n), hist = new Uint32Array(256);
      for (i = 0; i < n; i++) { lum[i] = (R[i] * 299 + G2[i] * 587 + B[i] * 114) / 1000 | 0; hist[lum[i]]++; }
      var sum = 0; for (i = 0; i < 256; i++) sum += i * hist[i];
      var sB = 0, wB = 0, best = 0, th = 128;
      for (i = 0; i < 256; i++) {
        wB += hist[i]; if (!wB) continue; var wF = n - wB; if (!wF) break;
        sB += i * hist[i]; var mB = sB / wB, mF = (sum - sB) / wF, between = wB * wF * (mB - mF) * (mB - mF);
        if (between > best) { best = between; th = i; }
      }
      for (i = 0; i < n; i++) mask[i] = lum[i] > th ? 1 : 0;
      quad = shapeFrom(mask);
    }
    if (!quad) return null;
    var cx = (quad[0][0] + quad[1][0] + quad[2][0] + quad[3][0]) / 4, cy = (quad[0][1] + quad[1][1] + quad[2][1] + quad[3][1]) / 4;
    return quad.map(function (c3) {
      var x2 = cx + (c3[0] - cx) * 1.012, y2 = cy + (c3[1] - cy) * 1.012;
      return [Math.max(0, Math.min(1, x2 / w)), Math.max(0, Math.min(1, y2 / h))];
    });
  }
  function polyArea(q) { var a = 0; for (var i = 0; i < q.length; i++) { var j = (i + 1) % q.length; a += q[i][0] * q[j][1] - q[j][0] * q[i][1]; } return a / 2; }
  function dist(a, b) { return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])); }
  // square (0..1) -> quad (Heckbert)
  function sq2quad(q) {
    var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
    var dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
    var den = dx1 * dy2 - dx2 * dy1, a13 = 0, a23 = 0;
    if (Math.abs(den) > 1e-9) { a13 = (dx3 * dy2 - dx2 * dy3) / den; a23 = (dx1 * dy3 - dx3 * dy1) / den; }
    return { a11: x1 - x0 + a13 * x1, a21: x3 - x0 + a23 * x3, a31: x0, a12: y1 - y0 + a13 * y1, a22: y3 - y0 + a23 * y3, a32: y0, a13: a13, a23: a23 };
  }
  // straightens the part of the picture inside the quad into a flat rectangle
  function warp(img, iw, ih, quad, maxSide, aspect) {
    var s = Math.min(1, 2600 / Math.max(iw, ih)), sw = Math.round(iw * s), sh = Math.round(ih * s);
    var sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
    var sg = sc.getContext('2d'); sg.drawImage(img, 0, 0, sw, sh);
    var sd = sg.getImageData(0, 0, sw, sh).data;
    var q = quad.map(function (p) { return [p[0] * sw, p[1] * sh]; });
    var W = (dist(q[0], q[1]) + dist(q[3], q[2])) / 2, H = (dist(q[0], q[3]) + dist(q[1], q[2])) / 2;
    if (aspect) { if (W >= H) H = W / aspect; else W = H / aspect; }
    var k = Math.min(1, maxSide / Math.max(W, H)), ow = Math.max(2, Math.round(W * k)), oh = Math.max(2, Math.round(H * k));
    var m = sq2quad(q), out = document.createElement('canvas'); out.width = ow; out.height = oh;
    var og = out.getContext('2d'), od = og.createImageData(ow, oh), o = od.data, sw4 = sw * 4;
    for (var y = 0; y < oh; y++) {
      var v = (y + 0.5) / oh;
      for (var x = 0; x < ow; x++) {
        var u = (x + 0.5) / ow, den = m.a13 * u + m.a23 * v + 1;
        var X = (m.a11 * u + m.a21 * v + m.a31) / den - 0.5, Y = (m.a12 * u + m.a22 * v + m.a32) / den - 0.5;
        if (X < 0) X = 0; if (Y < 0) Y = 0; if (X > sw - 1.001) X = sw - 1.001; if (Y > sh - 1.001) Y = sh - 1.001;
        var x0 = X | 0, y0 = Y | 0, fx = X - x0, fy = Y - y0, i00 = y0 * sw4 + x0 * 4, i10 = i00 + 4, i01 = i00 + sw4, i11 = i01 + 4, oi = (y * ow + x) * 4;
        for (var c = 0; c < 3; c++) {
          var a = sd[i00 + c] + (sd[i10 + c] - sd[i00 + c]) * fx, b = sd[i01 + c] + (sd[i11 + c] - sd[i01 + c]) * fx;
          o[oi + c] = a + (b - a) * fy;
        }
        o[oi + 3] = 255;
      }
    }
    og.putImageData(od, 0, 0);
    return out;
  }
  function rotateCanvas(cv, deg) {
    deg = ((deg || 0) % 360 + 360) % 360;
    if (!deg) return cv;
    var out = document.createElement('canvas');
    out.width = deg % 180 ? cv.height : cv.width; out.height = deg % 180 ? cv.width : cv.height;
    var g = out.getContext('2d'); g.translate(out.width / 2, out.height / 2); g.rotate(deg * Math.PI / 180); g.drawImage(cv, -cv.width / 2, -cv.height / 2);
    return out;
  }
  function pct(hist, n, p) { var c = 0, t = n * p; for (var v = 0; v < 256; v++) { c += hist[v]; if (c >= t) return v; } return 255; }
  // background brightness map (text removed) used to even out shadows
  function background(lum, w, h) {
    var bw = Math.max(2, Math.ceil(w / 14)), bh = Math.max(2, Math.ceil(h / 14)), small = new Float32Array(bw * bh), x, y;
    for (y = 0; y < bh; y++) for (x = 0; x < bw; x++) {
      var mx = 0;
      for (var yy = y * 14; yy < Math.min(h, y * 14 + 14); yy += 2) for (var xx = x * 14; xx < Math.min(w, x * 14 + 14); xx += 2) { var v = lum[yy * w + xx]; if (v > mx) mx = v; }
      small[y * bw + x] = mx;
    }
    for (var pass = 0; pass < 2; pass++) {
      var copy = small.slice();
      for (y = 0; y < bh; y++) for (x = 0; x < bw; x++) {
        var m2 = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var ax = x + dx, ay = y + dy; if (ax >= 0 && ay >= 0 && ax < bw && ay < bh && copy[ay * bw + ax] > m2) m2 = copy[ay * bw + ax]; }
        small[y * bw + x] = m2;
      }
    }
    return function (px, py) {
      var fx = Math.min(bw - 1.001, Math.max(0, px / 14 - 0.5)), fy = Math.min(bh - 1.001, Math.max(0, py / 14 - 0.5)), x0 = fx | 0, y0 = fy | 0, ax = fx - x0, ay = fy - y0;
      var a = small[y0 * bw + x0] + (small[y0 * bw + x0 + 1] - small[y0 * bw + x0]) * ax, b = small[(y0 + 1) * bw + x0] + (small[(y0 + 1) * bw + x0 + 1] - small[(y0 + 1) * bw + x0]) * ax;
      return a + (b - a) * ay;
    };
  }
  // looks: original, scan (clean colour), grey, bw (black & white)
  function applyFilter(cv, f) {
    if (!f || f === 'original') return cv;
    var w = cv.width, h = cv.height, g = cv.getContext('2d'), img = g.getImageData(0, 0, w, h), d = img.data, n = w * h, i;
    var lum = new Uint8Array(n), hist = new Uint32Array(256);
    for (i = 0; i < n; i++) { var l = (d[i * 4] * 299 + d[i * 4 + 1] * 587 + d[i * 4 + 2] * 114) / 1000 | 0; lum[i] = l; hist[l]++; }
    if (f === 'scan') {
      var lo = pct(hist, n, 0.03), hi = Math.max(lo + 40, pct(hist, n, 0.8));
      var sr = 0, sg = 0, sb = 0, sc = 0;
      for (i = 0; i < n; i++) if (lum[i] >= hi) { sr += d[i * 4]; sg += d[i * 4 + 1]; sb += d[i * 4 + 2]; sc++; }
      var pr = sc ? sr / sc : 255, pg = sc ? sg / sc : 255, pb = sc ? sb / sc : 255, pm = Math.max(1, (pr + pg + pb) / 3);
      var kr = pm / Math.max(1, pr), kg = pm / Math.max(1, pg), kb = pm / Math.max(1, pb);
      var lut = new Uint8ClampedArray(256);
      for (var v = 0; v < 256; v++) { var x = (v - lo) / (hi - lo); x = x < 0 ? 0 : (x > 1 ? 1 : x); lut[v] = Math.round(255 * Math.pow(x, 1.15)); }
      for (i = 0; i < n; i++) {
        var j = i * 4;
        d[j] = lut[Math.min(255, d[j] * kr | 0)]; d[j + 1] = lut[Math.min(255, d[j + 1] * kg | 0)]; d[j + 2] = lut[Math.min(255, d[j + 2] * kb | 0)];
      }
    } else if (f === 'grey') {
      var lo2 = pct(hist, n, 0.02), hi2 = Math.max(lo2 + 30, pct(hist, n, 0.55) - 6), lut2 = new Uint8ClampedArray(256);
      for (var v2 = 0; v2 < 256; v2++) { var x2 = (v2 - lo2) / (hi2 - lo2); x2 = x2 < 0 ? 0 : (x2 > 1 ? 1 : x2); lut2[v2] = Math.round(255 * Math.pow(x2, 1.35)); }
      for (i = 0; i < n; i++) { var o2 = lut2[lum[i]]; d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = o2; }
    } else if (f === 'bw') {
      var bg = background(lum, w, h);
      for (var y = 0; y < h; y++) for (var xx = 0; xx < w; xx++) {
        var k = y * w + xx, r = lum[k] / Math.max(24, bg(xx, y));
        var o3 = r > 0.86 ? 255 : (r < 0.62 ? 0 : Math.round((r - 0.62) / 0.24 * 255));
        d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = o3;
      }
    }
    g.putImageData(img, 0, 0);
    return cv;
  }

  /* ================= pages being scanned ================= */
  var ID_ASPECT = 85.6 / 54;
  var SC = { from: 'camera', mode: 'doc', name: '', filter: 'scan', pages: [], ver: 0, saved: false, seq: 0 };
  function newSide(src, quad) { return { src: src, quad: quad || null, auto: quad || null, rot: 0 }; }
  function loadSide(side) {
    if (side.img) return Promise.resolve(side.img);
    return PT.loadImage(side.src.bytes, side.src.mime || 'image/jpeg').then(function (im) { side.img = im; side.src.w = im.naturalWidth; side.src.h = im.naturalHeight; return im; });
  }
  function sideCanvas(side, maxSide, aspect) {
    return loadSide(side).then(function (im) {
      var w = im.naturalWidth, h = im.naturalHeight, cv;
      if (side.quad) cv = warp(im, w, h, side.quad, maxSide, aspect);
      else {
        var k = Math.min(1, maxSide / Math.max(w, h));
        cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
      }
      return rotateCanvas(cv, side.rot);
    });
  }
  // both sides of an ID card at real size on one A4 page (200 dpi)
  function composeId(front, back, filter) {
    var mm = 200 / 25.4, W = 1654, H = 2339, cw = Math.round(85.6 * mm), ch = Math.round(54 * mm);
    var out = document.createElement('canvas'); out.width = W; out.height = H;
    var g = out.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    [front, back].forEach(function (c, i) {
      if (!c) return;
      var land = c.width >= c.height, w = land ? cw : ch, h = land ? ch : cw, x = Math.round((W - w) / 2), y = Math.round(22 * mm + i * (ch + 14 * mm));
      applyFilter(c, filter);
      g.drawImage(c, x, y, w, h);
      g.strokeStyle = '#C9CFCC'; g.lineWidth = 2; g.strokeRect(x - 1, y - 1, w + 2, h + 2);
    });
    return out;
  }
  function pageCanvas(p, maxSide, filter) {
    if (p.kind === 'id') {
      return Promise.all([sideCanvas(p.front, Math.max(700, maxSide * 0.6), p.front.quad ? ID_ASPECT : 0), p.back ? sideCanvas(p.back, Math.max(700, maxSide * 0.6), p.back.quad ? ID_ASPECT : 0) : null])
        .then(function (cs) {
          var page = composeId(cs[0], cs[1], filter);
          if (maxSide >= page.height) return page;
          var k = maxSide / page.height, sm = document.createElement('canvas'); sm.width = Math.round(page.width * k); sm.height = Math.round(page.height * k);
          sm.getContext('2d').drawImage(page, 0, 0, sm.width, sm.height); return sm;
        });
    }
    return sideCanvas(p.front, maxSide, 0).then(function (cv) { return applyFilter(cv, filter); });
  }
  function addPhoto(src, auto) {
    // auto: find the page edges straight away (camera scans); photos from the gallery stay whole
    return PT.loadImage(src.bytes, src.mime).then(function (im) {
      src.w = im.naturalWidth; src.h = im.naturalHeight;
      var q = auto ? findQuad(im, src.w, src.h) : null;
      var side = newSide(src, q); side.img = im; if (!auto) side.auto = findQuad(im, src.w, src.h);
      return side;
    });
  }
  function resetScan(from, mode) {
    SC.from = from; SC.mode = mode || 'doc'; SC.pages = []; SC.saved = false; SC.ver++;
    SC.filter = from === 'photos' ? 'original' : 'scan';
    SC.name = (from === 'photos' ? 'Photos' : 'Scan') + ' - ' + PDF.today();
  }

  /* ================= start ================= */
  function startScan(from, preload) {
    if (from === 'photos') {
      resetScan('photos');
      var p = preload ? Promise.resolve(preload) : PDF.pickFiles('image/*', true).then(function (fs) { return Promise.all(fs.map(PDF.fromFile)); });
      p.then(function (list) { return addSources(list, false); }).then(function () { if (SC.pages.length) A.go('scanpages'); });
      return;
    }
    resetScan('camera');
    openCamera('doc');
  }
  function addSources(list, auto) {
    A.busy(T('Opening…'));
    var ch = Promise.resolve(), bad = 0;
    list.forEach(function (s) {
      ch = ch.then(function () {
        if (s.kind !== 'image') { bad++; return; }
        return addPhoto({ bytes: s.bytes, mime: s.mime || 'image/jpeg' }, auto).then(function (side) { SC.pages.push({ id: ++SC.seq, kind: 'page', front: side }); }, function () { bad++; });
      });
    });
    return ch.then(function () { A.done(); if (bad) A.toast(T('Some files could not be opened. Choose JPG or PNG photos.'), 4000); });
  }

  /* ================= live camera ================= */
  var CAM = null;
  A.hooks.overlayBack = function () {
    if ($('.crop4')) { closeCrop(); return true; }
    if (CAM) { closeCamera(true); return true; }
    return false;
  };
  function openCamera(mode) {
    SC.mode = mode || 'doc';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { nativeCamera(); return; }
    var el = document.createElement('div'); el.className = 'cam';
    el.innerHTML = '<div class="cam-view"><video playsinline muted autoplay></video><svg class="edge" id="cam-edge"></svg><div class="cam-flash"></div>' +
      '<div class="cam-top"><button class="bar-icon" data-cm="close" aria-label="' + esc(T('Close')) + '">' + ic('close') + '</button><div class="t">' + T('Scan to PDF') + '</div>' +
      '<button class="cam-chip" data-cm="torch" hidden>' + ic('flash') + T('Light') + '</button></div>' +
      '<div class="cam-msg" id="cam-msg">' + T('Looking for the page…') + '</div></div>' +
      '<div class="cam-bot"><div class="modes">' + [['doc', 'Document'], ['id', 'ID card (2 sides)'], ['many', 'Many pages']].map(function (m) { return '<button data-mode="' + m[0] + '" class="' + (SC.mode === m[0] ? 'on' : '') + '">' + T(m[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="shut"><button class="stack" data-cm="done" id="cam-stack"></button><button class="shutter" data-cm="shoot" aria-label="' + esc(T('Take photo')) + '"><i></i></button><button class="done-btn" data-cm="done" id="cam-done" disabled>' + T('Done') + '</button></div>' +
      '<div class="cam-hint" id="cam-hint"></div></div>';
    document.body.appendChild(el);
    CAM = { el: el, video: el.querySelector('video'), stream: null, quad: null, timer: null, torch: false, idSide: 0, idPage: null, shots: 0, busy: false };
    hint();
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 2560 }, height: { ideal: 1920 } } }).then(function (stream) {
      if (!CAM) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
      CAM.stream = stream; CAM.video.srcObject = stream;
      var p = CAM.video.play(); if (p && p.catch) p.catch(function () {});
      var track = stream.getVideoTracks()[0], caps = track && track.getCapabilities ? track.getCapabilities() : {};
      if (caps && caps.torch) el.querySelector('[data-cm="torch"]').hidden = false;
      loop();
    }).catch(function () {
      closeCamera(false);
      A.toast(T('The live camera is not available. Using the camera app instead.'), 3500);
      nativeCamera();
    });
    el.addEventListener('click', camClick);
  }
  function hint() {
    if (!CAM) return;
    var h = '', n = SC.pages.length;
    if (SC.mode === 'id') h = T(CAM.idSide ? 'Now turn the card over and take the back' : 'Take the front of the ID card');
    else if (SC.mode === 'many') h = T('Take each page, then tap Done');
    else h = T('Put the page on a dark, flat surface');
    $('#cam-hint').textContent = h;
    var stack = $('#cam-stack'), last = SC.pages[n - 1];
    stack.innerHTML = last && last.thumb ? '<img src="' + last.thumb + '" alt=""><span class="n">' + n + '</span>' : (n ? '<span class="n">' + n + '</span>' : '');
    $('#cam-done').disabled = !n;
  }
  function loop() {
    if (!CAM) return;
    var v = CAM.video;
    if (v.videoWidth && !CAM.busy) {
      var q = findQuad(v, v.videoWidth, v.videoHeight);
      if (q && CAM.quad) q = q.map(function (c, i) { return [c[0] * 0.6 + CAM.quad[i][0] * 0.4, c[1] * 0.6 + CAM.quad[i][1] * 0.4]; });
      CAM.quad = q;
      drawEdge();
    }
    CAM.timer = setTimeout(loop, 220);
  }
  function drawEdge() {
    var svg = $('#cam-edge'), msg = $('#cam-msg'), v = CAM.video; if (!svg) return;
    var cw = v.clientWidth, ch = v.clientHeight, vw = v.videoWidth, vh = v.videoHeight;
    svg.setAttribute('viewBox', '0 0 ' + cw + ' ' + ch);
    if (!CAM.quad || !vw) { svg.innerHTML = ''; msg.className = 'cam-msg'; msg.textContent = T('Looking for the page…'); return; }
    var k = Math.max(cw / vw, ch / vh), ox = (cw - vw * k) / 2, oy = (ch - vh * k) / 2;
    var pts = CAM.quad.map(function (p) { return [ox + p[0] * vw * k, oy + p[1] * vh * k]; });
    svg.innerHTML = '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="rgba(46,204,113,.16)" stroke="#2ECC71" stroke-width="3" stroke-linejoin="round"/>' +
      pts.map(function (p) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="8" fill="#fff" stroke="#2ECC71" stroke-width="3"/>'; }).join('');
    msg.className = 'cam-msg found';
    msg.innerHTML = ic('check') + esc(T(SC.mode === 'id' ? 'ID card found - hold still' : 'Page found - hold still'));
  }
  function camClick(e) {
    var m = e.target.closest('[data-mode]');
    if (m) {
      if (SC.pages.length && CAM.idSide) return;
      SC.mode = m.getAttribute('data-mode'); CAM.idSide = 0;
      Array.prototype.forEach.call(CAM.el.querySelectorAll('[data-mode]'), function (b) { b.classList.toggle('on', b === m); });
      hint(); return;
    }
    var b = e.target.closest('[data-cm]'); if (!b) return;
    var a = b.getAttribute('data-cm');
    if (a === 'close') closeCamera(true);
    if (a === 'done') { if (SC.pages.length) closeCamera(true); }
    if (a === 'torch') {
      var track = CAM.stream && CAM.stream.getVideoTracks()[0]; if (!track) return;
      CAM.torch = !CAM.torch;
      track.applyConstraints({ advanced: [{ torch: CAM.torch }] }).catch(function () {});
      b.classList.toggle('on', CAM.torch);
    }
    if (a === 'shoot') shoot(b);
  }
  function shoot(btn) {
    if (!CAM || CAM.busy) return;
    var v = CAM.video; if (!v.videoWidth) return;
    CAM.busy = true; btn.disabled = true;
    var fl = CAM.el.querySelector('.cam-flash'); fl.classList.add('on'); setTimeout(function () { fl.classList.remove('on'); }, 60);
    var cv = document.createElement('canvas'); cv.width = v.videoWidth; cv.height = v.videoHeight;
    cv.getContext('2d').drawImage(v, 0, 0);
    var q = findQuad(cv, cv.width, cv.height) || CAM.quad;
    PT.canvasJpg(cv, 0.92).then(function (bytes) {
      var side = newSide({ bytes: bytes, mime: 'image/jpeg', w: cv.width, h: cv.height }, q);
      var p;
      if (SC.mode === 'id') {
        if (!CAM.idSide) { p = { id: ++SC.seq, kind: 'id', front: side, back: null }; SC.pages.push(p); CAM.idPage = p; CAM.idSide = 1; }
        else { CAM.idPage.back = side; p = CAM.idPage; CAM.idSide = 0; }
      } else { p = { id: ++SC.seq, kind: 'page', front: side }; SC.pages.push(p); }
      p.thumb = null; SC.ver++;
      return pageCanvas(p, 220, SC.filter).then(function (t) { p.thumb = t.toDataURL('image/jpeg', 0.7); });
    }).then(function () {
      CAM.busy = false; btn.disabled = false; hint();
      var last = SC.pages[SC.pages.length - 1];
      if (SC.mode === 'doc' || (SC.mode === 'id' && last.kind === 'id' && last.back)) setTimeout(function () { closeCamera(true); }, 250);
    }).catch(function () { CAM.busy = false; btn.disabled = false; });
  }
  function closeCamera(toReview) {
    if (!CAM) return;
    clearTimeout(CAM.timer);
    if (CAM.stream) CAM.stream.getTracks().forEach(function (t) { t.stop(); });
    CAM.el.remove(); CAM = null;
    if (toReview && SC.pages.length) { if (S.stack[S.stack.length - 1] === 'scanpages') A.render(); else A.go('scanpages'); }
  }
  // phones without the live camera: the normal camera app, then the edges are found in the photo
  function nativeCamera() {
    PDF.pickFiles('image/*', false, true).then(function (fs) { return Promise.all(fs.map(PDF.fromFile)); }).then(function (list) {
      return addSources(list, true);
    }).then(function () { if (SC.pages.length) { if (S.stack[S.stack.length - 1] === 'scanpages') A.render(); else A.go('scanpages'); } });
  }

  /* ================= corner adjustment ================= */
  var CROP = null;
  function closeCrop() { if (CROP) { CROP.el.remove(); CROP = null; } }
  function openCrop(side, aspect, done) {
    loadSide(side).then(function (im) {
      var el = document.createElement('div'); el.className = 'crop4';
      el.innerHTML = '<div class="crop4-t"><span>' + T('Adjust the corners') + '<small>' + T('Drag the corners to the edges of the document.') + '</small></span></div>' +
        '<div class="crop4-area" id="c4a"><img alt=""><svg></svg>' + [0, 1, 2, 3].map(function (i) { return '<div class="crop4-h" data-h="' + i + '"></div>'; }).join('') + '</div>' +
        '<div class="crop4-bar"><button class="btn soft small" data-c4="whole">' + T('Whole photo') + '</button>' + (side.auto ? '<button class="btn soft small" data-c4="auto">' + T('Auto') + '</button>' : '') +
        '<button class="btn soft small" data-c4="cancel">' + T('Cancel') + '</button><button class="btn gold small" data-c4="ok">' + T('Done') + '</button></div>';
      document.body.appendChild(el);
      var area = el.querySelector('#c4a'), img = el.querySelector('img'), svg = el.querySelector('svg');
      img.src = URL.createObjectURL(new Blob([side.src.bytes], { type: side.src.mime || 'image/jpeg' }));
      var q = (side.quad || [[0, 0], [1, 0], [1, 1], [0, 1]]).map(function (p) { return p.slice(); });
      CROP = { el: el };
      var box = {};
      function layout() {
        var aw = area.clientWidth - 40, ah = area.clientHeight - 40, iw = im.naturalWidth, ih = im.naturalHeight, k = Math.min(aw / iw, ah / ih);
        box = { x: (area.clientWidth - iw * k) / 2, y: (area.clientHeight - ih * k) / 2, w: iw * k, h: ih * k };
        img.style.left = box.x + 'px'; img.style.top = box.y + 'px'; img.style.width = box.w + 'px'; img.style.height = box.h + 'px';
        draw();
      }
      function draw() {
        svg.setAttribute('viewBox', '0 0 ' + area.clientWidth + ' ' + area.clientHeight);
        var pts = q.map(function (p) { return [box.x + p[0] * box.w, box.y + p[1] * box.h]; });
        svg.innerHTML = '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="rgba(46,204,113,.14)" stroke="#2ECC71" stroke-width="2.5"/>';
        Array.prototype.forEach.call(el.querySelectorAll('.crop4-h'), function (h, i) { h.style.left = pts[i][0] + 'px'; h.style.top = pts[i][1] + 'px'; });
      }
      var drag = -1;
      function pos(e) { var r = area.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return [(t.clientX - r.left - box.x) / box.w, (t.clientY - r.top - box.y) / box.h]; }
      function down(e) { var h = e.target.closest('.crop4-h'); if (!h) return; e.preventDefault(); drag = +h.getAttribute('data-h'); }
      function move(e) { if (drag < 0) return; e.preventDefault(); var p = pos(e); q[drag] = [Math.max(0, Math.min(1, p[0])), Math.max(0, Math.min(1, p[1]))]; draw(); }
      function up() { drag = -1; }
      area.addEventListener('touchstart', down, { passive: false }); area.addEventListener('touchmove', move, { passive: false }); area.addEventListener('touchend', up);
      area.addEventListener('mousedown', down); window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-c4]'); if (!b) return;
        var a = b.getAttribute('data-c4');
        if (a === 'whole') { q = [[0, 0], [1, 0], [1, 1], [0, 1]]; draw(); }
        if (a === 'auto' && side.auto) { q = side.auto.map(function (p) { return p.slice(); }); draw(); }
        if (a === 'cancel') closeCrop();
        if (a === 'ok') {
          var whole = q[0][0] < 0.005 && q[0][1] < 0.005 && q[1][0] > 0.995 && q[2][1] > 0.995 && q[3][0] < 0.005;
          side.quad = whole ? null : q;
          closeCrop(); done();
        }
      });
      if (img.complete) layout(); else img.onload = layout;
      setTimeout(layout, 60);
    });
  }

  /* ================= check your scan ================= */
  var FILTERS = [['original', 'Original'], ['scan', 'Scanner look'], ['grey', 'Grey'], ['bw', 'Black & white']];
  A.VIEWS.scanpages = {
    title: function () { return T(SC.from === 'photos' ? 'Photos to PDF' : 'Check your scan'); },
    bar: function () { return '<span class="bar-act" style="font-weight:700">' + T(SC.pages.length === 1 ? '1 page' : '{n} pages', { n: SC.pages.length }) + '</span>'; },
    noMenu: true,
    beforeBack: function () {
      if (SC.saved || !SC.pages.length) return false;
      A.confirmSheet(T('Leave without saving?'), T('The pages you scanned will be lost.'), T('Leave'), true).then(function (ok) { if (ok) { SC.saved = true; A.back(); } });
      return true;
    },
    render: function (el) {
      if (!SC.pages.length) { el.innerHTML = '<div class="empty-box">' + ic('scan') + '<div>' + T('No pages yet.') + '</div></div>'; return; }
      var h = '<div class="fld"><label for="sc-name">' + T('File name') + '</label><input type="text" id="sc-name" value="' + esc(SC.name) + '" autocomplete="off"></div>' +
        '<div class="achips">' + FILTERS.map(function (f) { return '<button class="achip' + (SC.filter === f[0] ? ' on' : '') + '" data-flt="' + f[0] + '">' + T(f[1]) + '</button>'; }).join('') + '</div><div class="pgrid">';
      SC.pages.forEach(function (p, i) {
        h += '<div class="pg" data-pi="' + i + '"><div class="a4" data-pv="' + i + '">' + (p.kind === 'id' ? '<span class="badge-id">' + T(p.back ? 'ID front + back' : 'ID front') + '</span>' : '') +
          (p.thumb && p.tver === SC.ver ? '<img src="' + p.thumb + '" alt="">' : '<div class="spin"></div>') + '</div>' +
          '<div class="pg-bar"><b>' + T('Page {n}', { n: i + 1 }) + '</b><button class="ibtn" data-pa="crop" aria-label="' + esc(T('Crop')) + '">' + ic('crop') + '</button>' +
          '<button class="ibtn" data-pa="rot" aria-label="' + esc(T('Rotate')) + '">' + ic('rotate') + '</button><button class="ibtn" data-pa="more" aria-label="' + esc(T('More')) + '">' + ic('dots-v') + '</button></div></div>';
      });
      h += '<button class="pg add" data-add="1"><div class="a4"><div class="in">' + ic('plus') + T('Add page') + '</div></div></button></div>';
      el.innerHTML = h;
      thumbs();
    },
    actions: function () {
      if (!SC.pages.length) return '';
      return (S.list.length ? '<button class="btn soft" data-act="sccv">' + T('Add to my CV') + '</button>' : '') + '<button class="btn gold" data-act="scsave">' + T('Save PDF') + '</button>';
    },
    onAction: function (a) { if (a === 'scsave') { saveScan(false); return true; } if (a === 'sccv') { saveScan(true); return true; } }
  };
  var thumbJob = 0;
  function thumbs() {
    var job = ++thumbJob, ver = SC.ver, ch = Promise.resolve();
    SC.pages.forEach(function (p, i) {
      if (p.thumb && p.tver === ver) return;
      ch = ch.then(function () {
        if (job !== thumbJob || S.stack[S.stack.length - 1] !== 'scanpages') return;
        return pageCanvas(p, 420, SC.filter).then(function (cv) {
          p.thumb = cv.toDataURL('image/jpeg', 0.75); p.tver = ver;
          var box = document.querySelector('#v-scanpages [data-pv="' + SC.pages.indexOf(p) + '"]');
          if (box) { var sp = box.querySelector('.spin'); if (sp) sp.remove(); var im = box.querySelector('img'); if (im) im.src = p.thumb; else box.insertAdjacentHTML('beforeend', '<img src="' + p.thumb + '" alt="">'); }
        });
      });
    });
  }
  function bump(p) { p.tver = -1; SC.ver++; SC.pages.forEach(function (x) { if (x !== p) x.tver = SC.ver; }); }
  A.viewEl('scanpages').addEventListener('input', function (e) { if (e.target.id === 'sc-name') SC.name = e.target.value; });
  A.viewEl('scanpages').addEventListener('click', function (e) {
    var f = e.target.closest('[data-flt]');
    if (f) { SC.filter = f.getAttribute('data-flt'); SC.ver++; A.render(); return; }
    if (e.target.closest('[data-add]')) { addPageSheet(); return; }
    var pg = e.target.closest('[data-pi]'); if (!pg) return;
    var i = +pg.getAttribute('data-pi'), p = SC.pages[i], b = e.target.closest('[data-pa]');
    var a = b ? b.getAttribute('data-pa') : 'more';
    if (a === 'rot') { p.front.rot = (p.front.rot + 90) % 360; if (p.back) p.back.rot = (p.back.rot + 90) % 360; bump(p); A.render(); }
    if (a === 'crop') cropPage(p);
    if (a === 'more') pageMenu(i);
  });
  function cropPage(p) {
    if (p.kind !== 'id' || !p.back) { openCrop(p.front, p.kind === 'id' ? ID_ASPECT : 0, function () { bump(p); A.render(); }); return; }
    var sh = A.openSheet('<h3>' + T('Adjust the corners') + '</h3><button class="sheet-item" data-side="front">' + ic('id') + '<span>' + T('Front of the card') + '</span></button>' +
      '<button class="sheet-item" data-side="back">' + ic('id') + '<span>' + T('Back of the card') + '</span></button>');
    sh.onclick = function (e) { var b = e.target.closest('[data-side]'); if (!b) return; A.closeSheet(); openCrop(p[b.getAttribute('data-side')], ID_ASPECT, function () { bump(p); A.render(); }); };
  }
  function pageMenu(i) {
    var p = SC.pages[i], n = SC.pages.length;
    var sh = A.openSheet('<h3>' + T('Page {n}', { n: i + 1 }) + '</h3>' +
      '<button class="sheet-item" data-pm="crop">' + ic('crop') + '<span>' + T('Adjust the corners') + '</span></button>' +
      '<button class="sheet-item" data-pm="rot">' + ic('rotate') + '<span>' + T('Rotate') + '</span></button>' +
      (i > 0 ? '<button class="sheet-item" data-pm="up">' + ic('left') + '<span>' + T('Move earlier') + '</span></button>' : '') +
      (i < n - 1 ? '<button class="sheet-item" data-pm="down">' + ic('right') + '<span>' + T('Move later') + '</span></button>' : '') +
      '<button class="sheet-item danger" data-pm="del">' + ic('trash') + '<span>' + T('Delete page') + '</span></button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-pm]'); if (!b) return; A.closeSheet();
      var a = b.getAttribute('data-pm');
      if (a === 'crop') cropPage(p);
      if (a === 'rot') { p.front.rot = (p.front.rot + 90) % 360; if (p.back) p.back.rot = (p.back.rot + 90) % 360; bump(p); }
      if (a === 'up' || a === 'down') { var j = i + (a === 'up' ? -1 : 1), t = SC.pages[i]; SC.pages[i] = SC.pages[j]; SC.pages[j] = t; }
      if (a === 'del') SC.pages.splice(i, 1);
      A.render();
    };
  }
  function addPageSheet() {
    var sh = A.openSheet('<h3>' + T('Add page') + '</h3>' +
      '<button class="sheet-item" data-ap="cam">' + ic('camera') + '<span>' + T('Scan with the camera') + '</span></button>' +
      '<button class="sheet-item" data-ap="id">' + ic('id') + '<span>' + T('ID card (2 sides)') + '</span></button>' +
      '<button class="sheet-item" data-ap="gal">' + ic('photos') + '<span>' + T('Choose photos') + '</span></button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-ap]'); if (!b) return; A.closeSheet();
      var a = b.getAttribute('data-ap');
      if (a === 'cam') openCamera('many');
      if (a === 'id') openCamera('id');
      if (a === 'gal') PDF.pickFiles('image/*', true).then(function (fs) { return Promise.all(fs.map(PDF.fromFile)); }).then(function (l) { return addSources(l, SC.from !== 'photos'); }).then(function () { SC.ver++; A.render(); });
    };
  }
  function buildPdf() {
    var items = [], ch = Promise.resolve();
    SC.pages.forEach(function (p, i) {
      ch = ch.then(function () {
        $('#busy-msg').textContent = T('Making your PDF…') + ' ' + (i + 1) + '/' + SC.pages.length;
        return pageCanvas(p, 2200, SC.filter).then(function (cv) { return PT.canvasJpg(cv, SC.filter === 'bw' ? 0.8 : 0.85); }).then(function (j) { items.push({ bytes: j, fit: p.kind === 'id' ? 'page' : 'auto' }); });
      });
    });
    return ch.then(function () { return PT.imagesToPdf(items, SC.name); });
  }
  function saveScan(toCv) {
    var name = PDF.base(SC.name || 'Scan') + '.pdf';
    A.busy(T('Making your PDF…'));
    buildPdf().then(function (bytes) {
      return PDF.Files.add(bytes, name, SC.pages.length).then(function (meta) {
        A.done(); SC.saved = true;
        if (toCv) PDF.addToCv(bytes, meta.name); else PDF.resultSheet(meta, T('Your PDF is ready'));
      });
    }).catch(PDF.failMsg);
  }

  A.PDF.startScan = startScan;
  A.PDF.findQuad = findQuad;
  A.PDF.applyFilter = applyFilter;
  A.PDF.warp = warp;
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/ui-sign.js */
try {
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
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/feedback.js */
try {
/* "Send feedback": an email to the developer with a few short questions and the app details already filled in.
   Nothing is sent by the app itself - the person's own email app opens and they decide what to send. */
(function () {
  'use strict';
  var A = window.App, $ = A.$, esc = A.esc, svg = A.svg, T = A.T;
  var NATIVE = window.AndroidBridge || null;
  var EMAIL = 'tumelovincent558@gmail.com';
  var CARD = 'cvmaker.feedback.card'; // '' = no download yet, 'show' = ask on the front page, 'done' = sent or dismissed
  A.ICON.feedback = 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z';

  function get(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  // which app, version, phone system and language - helps to find a problem, contains nothing personal
  function details() {
    var ua = navigator.userAgent, m = /Android (\d+(?:\.\d+)?)/.exec(ua);
    var os = m ? 'Android ' + m[1] : /iPhone|iPad|iPod/.test(ua) ? 'iPhone/iPad' : /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : '';
    return 'CV Maker SA ' + A.VERSION + ' - ' + (NATIVE ? 'Android app' : 'website') + (os ? ' - ' + os : '') +
      ' - ' + (window.CVi18n ? window.CVi18n.name() : 'English');
  }
  function mailto() {
    var nl = '\r\n';
    var body = T('Hi Tumelo,') + nl + nl +
      '1. ' + T('What did you make with the app? (CV, cover letter, Z83...)') + nl + nl + nl +
      '2. ' + T('Was anything hard or confusing?') + nl + nl + nl +
      '3. ' + T('Did anything not work? What happened?') + nl + nl + nl +
      '4. ' + T('What should we add or change?') + nl + nl + nl +
      '5. ' + T('Would you tell a friend about CV Maker SA? (Yes / Maybe / No)') + nl + nl + nl +
      '---' + nl + details();
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('CV Maker SA feedback') + '&body=' + encodeURIComponent(body);
  }
  function copy(text) {
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { }
      t.remove(); return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  }

  function open() {
    var sh = A.openSheet('<div class="fb">' +
      '<div class="fb-ic">' + svg('feedback') + '</div>' +
      '<h3>' + T('Send feedback') + '</h3>' +
      '<p>' + T('Tell Tumelo what was hard, what did not work or what you would like added. Your email app opens with a few short questions.') + '</p>' +
      '<a class="btn block" data-fb="mail" href="' + esc(mailto()) + '">' + svg('mail') + T('Write an email') + '</a>' +
      '<div class="fb-or">' + T('Or send an email to:') + '</div>' +
      '<div class="fb-addr"><span>' + EMAIL + '</span><button type="button" class="btn small soft" data-fb="copy">' + svg('copy') + T('Copy') + '</button></div>' +
      '<p class="fb-note">' + T('Please do not send your ID number or other private details.') + '</p></div>' +
      '<div class="sheet-foot"><button type="button" class="btn ghost" data-fb="close">' + T('Close') + '</button></div>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-fb]'); if (!b) return;
      var k = b.getAttribute('data-fb');
      if (k === 'close') { A.closeSheet(); return; }
      if (k === 'mail') { set(CARD, 'done'); setTimeout(A.closeSheet, 300); refresh(); return; } // the link itself opens the email app
      if (k === 'copy') copy(EMAIL).then(function (ok) { A.toast(ok ? T('Email address copied') : EMAIL); });
    };
  }
  A.hooks.feedback = open;

  // the privacy policy (same page as on the website), shown inside the app so it also opens without internet
  A.hooks.privacy = function () {
    fetch('privacy.html').then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var main = doc.querySelector('main'), date = doc.querySelector('header p');
      var sh = A.openSheet('<div class="policy pp"><h3>' + T('Privacy policy') + '</h3>' + (date ? '<p class="muted">' + esc(date.textContent) + '</p>' : '') +
        (main ? main.innerHTML : '') + '</div><div class="sheet-foot"><button type="button" class="btn ghost" data-pp="close">' + T('Close') + '</button></div>');
      sh.onclick = function (e) { if (e.target.closest('[data-pp="close"]')) A.closeSheet(); };
    }).catch(function () { A.toast(T('Could not open the privacy policy')); });
  };

  // after the first CV is saved or shared, the front page asks once how it went
  A.hooks.delivered = function (mode) { if (mode !== 'print' && !get(CARD)) set(CARD, 'show'); };
  A.hooks.homeFeedback = function () {
    if (get(CARD) !== 'show') return '';
    return '<section class="install-card fb-card"><div class="ins-ic fb-card-ic">' + svg('feedback') + '</div><div class="ins-t"><b>' + T('How did it go?') + '</b><span>' +
      T('Tell us what was hard or what to add. It helps make CV Maker SA better for everyone.') + '</span><div class="ins-b">' +
      '<button class="btn small" data-fbc="go">' + T('Send feedback') + '</button><button class="btn small ins-no" data-fbc="no">' + T('Not now') + '</button></div></div></section>';
  };
  function refresh() { if (A.S.stack[A.S.stack.length - 1] === 'home') A.renderHome(); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-fbc]'); if (!b) return;
    if (b.getAttribute('data-fbc') === 'go') { open(); return; }
    set(CARD, 'done'); refresh();
  });
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/sponsors.js */
try {
/* Sponsor cards - the businesses shown in the small "Sponsored" card (front page and under the CV preview).
   Edit only this list to add, change or remove a sponsor. One card shows at a time, taking turns.
   Fields:
     id      short unique word
     name    business name
     line    one sentence about what they offer (keep it under about 100 characters)
     area    optional: where they work
     actions the buttons, main one first (up to two fit nicely), each { cta: 'button text', action: 'link' }. A link can be:
               WhatsApp  https://wa.me/27721234567?text=Hi%2C%20I%20saw%20you%20on%20CV%20Maker%20SA
               phone     tel:0721234567
               email     mailto:name@example.com?subject=...
               website   https://...
             (older entries may instead have one button as cta + action)
     logo    optional: a small square picture in www/img/sponsors/ (e.g. 'img/sponsors/shop.png'); otherwise initials
     ini     optional: the letters in the circle when there is no logo (otherwise taken from the name)
     color   optional: colour of the initials circle
     from, until  optional: first and last day to show it ('2026-11-01')
   Sponsor cards never appear on the CV, the PDF or the Word file, and the app sends nothing when they are shown. */
window.CV_SPONSORS = [
  {
    id: 'naynayjuju',
    name: 'Nay Nay and Juju Trading',
    line: 'Starting a business? Company and NPC registration, tax returns, tax certificates, B-BBEE and COIDA.',
    area: 'Welkom and Kutlwanong',
    actions: [
      { cta: 'WhatsApp', action: 'https://wa.me/27684042600?text=' + encodeURIComponent('Hi, I saw Nay Nay and Juju Trading on CV Maker SA. I would like help with ') },
      { cta: 'Email', action: 'mailto:tumelovincent558@gmail.com?subject=' + encodeURIComponent('Business services enquiry (from CV Maker SA)') }
    ],
    ini: 'NJ',
    color: '#0B5D4B'
  },
  {
    id: 'advertise',
    name: 'Advertise here',
    line: 'Reach people looking for work with a card like this. WhatsApp 068 404 2600 for prices.',
    actions: [
      { cta: 'WhatsApp', action: 'https://wa.me/27684042600?text=' + encodeURIComponent('Hi Tumelo, I would like to advertise my business on CV Maker SA. What are the prices?') },
      { cta: 'Email', action: 'mailto:tumelovincent558@gmail.com?subject=' + encodeURIComponent('Advertising on CV Maker SA') }
    ],
    ini: '+',
    color: '#C98A00'
  }
];
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/ui-sponsor.js */
try {
/* The sponsor card: small, clearly labelled cards from window.CV_SPONSORS (js/sponsors.js).
   Shown on the front page (after "My CVs") and under the CV preview, never while typing a CV, never in a file.
   When there is more than one sponsor, the cards take turns in the same place every few seconds (no page reload,
   no jump: the space fits the tallest card). Turning pauses while the card is touched and when it is off screen.
   Showing a card sends nothing. In the app, a button only opens the sponsor's own link (WhatsApp, phone, email,
   website); on the website the tap goes through a short page first so the visitor counter can count it
   (js/web.js, web/go.template.html). */
(function () {
  'use strict';
  var A = window.App, esc = A.esc, T = A.T;
  var EVERY = 7000;      // how long each card shows
  var PAUSE = 12000;     // how long turning waits after the card is touched
  var CHAT = 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z';
  function today() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
  // a sponsor's buttons: actions: [{ cta, action }, ...] (first = main button), or the older single cta + action
  function actionsOf(s) {
    var list = Array.isArray(s.actions) ? s.actions : [{ cta: s.cta, action: s.action }];
    return list.filter(function (a) { return a && /^(https?:|mailto:|tel:)/i.test(a.action || ''); });
  }
  function kindOf(url) {
    return /^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(url) ? 'whatsapp' : /^mailto:/i.test(url) ? 'email' : /^tel:/i.test(url) ? 'phone' : 'web';
  }
  function live() {
    var t = today();
    return (window.CV_SPONSORS || []).filter(function (s) {
      return s && s.name && actionsOf(s).length && (!s.from || s.from <= t) && (!s.until || s.until >= t);
    });
  }
  var start = null; // which sponsor this visit starts with (they take turns between visits too)
  function first() {
    if (start === null) {
      var k = 'cvmaker.sponsor.turn', n = 0;
      try { n = (+localStorage.getItem(k) || 0) + 1; localStorage.setItem(k, String(n)); } catch (e) { n = Math.floor(Math.random() * 1000); }
      start = n;
    }
    return start;
  }
  var shown = { home: null, pv: null }; // the card on screen in each place, kept when the screen is drawn again
  function initials(name) {
    return String(name).split(/\s+/).filter(function (w) { return /^[A-Za-z0-9]/.test(w) && !/^(and|of|the|&)$/i.test(w); })
      .slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  function logo(s) {
    if (s.logo) return '<img class="sp-logo" src="' + esc(s.logo) + '" alt="">';
    return '<div class="sp-logo sp-ini" style="background:' + esc(s.color || '#0B5D4B') + '">' + esc(s.ini || initials(s.name)) + '</div>';
  }
  function icon(kind) {
    var d = kind === 'whatsapp' ? CHAT : kind === 'email' ? A.ICON.mail : '';
    return d ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>' : '';
  }
  function link(s, a, cls) {
    var kind = kindOf(a.action), ext = /^https?:/i.test(a.action);
    return '<a class="' + cls + '" href="' + esc(a.action) + '" data-sp="' + esc(s.id || '') + '" data-kind="' + kind + '"' +
      (ext ? ' target="_blank" rel="noopener"' : '') + '>' + icon(kind) + '<span>' + esc(a.cta || T('Contact')) + '</span></a>';
  }
  function dots(n, on) {
    if (n < 2) return '';
    var h = '<span class="sp-dots" aria-hidden="true">';
    for (var i = 0; i < n; i++) h += '<i' + (i === on ? ' class="on"' : '') + '></i>';
    return h + '</span>';
  }
  // all cards in one place; only the one marked "on" is visible
  function rotator(where, list, offset, item) {
    if (shown[where] === null || shown[where] >= list.length) shown[where] = (first() + offset) % list.length;
    var on = shown[where];
    return '<div class="sp-rot" data-where="' + where + '">' + list.map(function (s, i) {
      return '<div class="sp-it' + (i === on ? ' on' : '') + '"' + (i === on ? '' : ' aria-hidden="true"') + '>' + item(s) + '</div>';
    }).join('') + '</div>';
  }

  A.hooks.homeSponsor = function () {
    var list = live(); if (!list.length) return '';
    var html = rotator('home', list, 0, function (s) {
      return '<div class="sp-body">' + logo(s) + '<div class="sp-t"><b>' + esc(s.name) + '</b><span>' + esc(s.line || '') + '</span>' +
        (s.area ? '<small>' + esc(s.area) + '</small>' : '') + '</div></div>' +
        '<div class="sp-btns">' + actionsOf(s).map(function (a, i) { return link(s, a, 'btn small ' + (i ? 'ghost' : 'soft') + ' sp-cta'); }).join('') + '</div>';
    });
    return '<section class="sp-card" aria-label="' + esc(T('Sponsored')) + '"><div class="sp-tag"><span>' + T('Sponsored') + '</span>' + T('Helps keep CV Maker SA free') +
      dots(list.length, shown.home) + '</div>' + html + '</section>';
  };
  // under the CV preview: a slim version, after the pages
  A.hooks.pvSponsor = function () {
    var list = live(); if (!list.length) return '';
    var html = rotator('pv', list, 1, function (s) {
      return '<div class="sp-slim-in">' + logo(s) + '<div class="sp-t"><small class="sp-lbl">' + T('Sponsored') + '</small><b>' + esc(s.name) + '</b>' +
        '<span>' + esc(s.line || '') + '</span></div><div class="sp-gos">' + actionsOf(s).map(function (a) { return link(s, a, 'sp-go'); }).join('') + '</div></div>';
    });
    return '<div class="sp-slim" aria-label="' + esc(T('Sponsored')) + '">' + html + '</div>';
  };

  /* ---------- taking turns ---------- */
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var holdUntil = 0;
  function onScreen(el) {
    if (!el.offsetParent) return false;
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight);
  }
  function step() {
    if (REDUCE || document.hidden || Date.now() < holdUntil) return;
    Array.prototype.forEach.call(document.querySelectorAll('.sp-rot'), function (rot) {
      var items = rot.children; if (items.length < 2 || !onScreen(rot)) return;
      var where = rot.getAttribute('data-where'), cur = 0;
      for (var i = 0; i < items.length; i++) if (items[i].classList.contains('on')) cur = i;
      var next = (cur + 1) % items.length;
      items[cur].classList.remove('on'); items[cur].setAttribute('aria-hidden', 'true');
      items[next].classList.add('on'); items[next].removeAttribute('aria-hidden');
      if (where) shown[where] = next;
      var d = rot.parentNode.querySelectorAll('.sp-dots i');
      for (var j = 0; j < d.length; j++) d[j].classList.toggle('on', j === next);
    });
  }
  setInterval(step, EVERY);
  // someone touching or pointing at a card is about to tap it: hold still for a while
  ['pointerdown', 'mouseover', 'focusin'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest('.sp-rot')) holdUntil = Date.now() + PAUSE; }, true);
  });
  // the front page was drawn before this file loaded: draw it again so the card is there on the very first screen
  if (A.S.stack[A.S.stack.length - 1] === 'home') A.renderHome();
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
/* js/web.js */
try {
/* Web version only (does nothing inside the Android app): the phone's back button, "install to home screen",
   working without internet (service worker) and asking the browser to keep the saved CVs. */
(function () {
  'use strict';
  var A = window.App;
  if (window.AndroidBridge || !A) return;
  var T = A.T, S = A.S;
  var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function standalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  document.documentElement.classList.add('is-web');

  /* ---------- phone back button ----------
     The browser history mirrors how deep the app is (screen, open sheet, camera, corner editor).
     Pressing back steps the app back one level instead of leaving the site; at the front page it leaves as usual. */
  var depth = 0, suppress = 0, timer = 0;
  function appDepth() {
    var lock = document.getElementById('lock');
    if (lock && !lock.hidden && lock.innerHTML) return 0;
    var d = S.stack.length - 1;
    if (!document.getElementById('sheet').hidden) d++;
    if (document.querySelector('.cam')) d++;
    if (document.querySelector('.crop4')) d++;
    return Math.max(0, d);
  }
  try { history.replaceState({ cvm: 0 }, ''); } catch (e) { return; }
  function sync() {
    var t = appDepth();
    if (t > depth) { while (depth < t) { depth++; history.pushState({ cvm: depth }, ''); } }
    else if (t < depth) { var n = depth - t; depth = t; suppress++; history.go(-n); }
  }
  function later() { clearTimeout(timer); timer = setTimeout(sync, 40); }
  ['click', 'change', 'keyup', 'pointerup'].forEach(function (ev) { document.addEventListener(ev, later, true); });
  // screens that change on their own (after a PDF is made, a photo is read…)
  if (window.MutationObserver) {
    new MutationObserver(later).observe(document.getElementById('sheet'), { attributes: true, attributeFilter: ['hidden'] });
    new MutationObserver(later).observe(document.body, { childList: true });
    new MutationObserver(later).observe(document.getElementById('main'), { attributes: true, subtree: true, attributeFilter: ['hidden'] });
  }
  window.addEventListener('popstate', function (e) {
    var s = e.state && typeof e.state.cvm === 'number' ? e.state.cvm : 0;
    if (suppress) { suppress--; depth = s; return; }
    var steps = depth - s; depth = s;
    if (steps <= 0) { later(); return; } // forward button: put the history back in step
    for (var i = 0; i < steps; i++) if (!window.appBack()) break;
    later();
  });

  /* ---------- install to home screen ---------- */
  var prompt = null, HIDE = 'cvmaker.install.hide';
  function dismissed() { try { return +(localStorage.getItem(HIDE) || 0) > Date.now(); } catch (e) { return false; } }
  function refreshHome() { if (S.stack[S.stack.length - 1] === 'home') A.renderHome(); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); prompt = e; refreshHome(); });
  window.addEventListener('appinstalled', function () { prompt = null; A.toast(T('CV Maker SA was added to your home screen')); refreshHome(); });
  // links to the guide pages on the website (the guides are web pages, so only on the website)
  A.hooks.homeGuides = function () {
    var G = [['../cv-examples/', 'CV examples for 29 jobs'], ['how-to-fill-in-z83-form', 'How to fill in the Z83 form'], ['cv-with-no-experience', 'A CV with no work experience'],
      ['how-to-apply-for-learnerships', 'How to apply for learnerships'], ['how-to-write-a-cover-letter', 'How to write a cover letter'],
      ['job-interview-tips', 'Job interview tips'], ['after-matric', 'Matric results: what next?'], ['z83-form-download', 'Z83 form download']];
    return '<section class="block"><div class="block-h"><h2>' + T('Help with your application') + '</h2><a class="see-all" href="guides/">' + T('All guides') + '</a></div>' +
      '<div class="guide-list">' + G.map(function (g) { return '<a class="guide-it" href="' + (g[0].indexOf('../') === 0 ? g[0].slice(3) : 'guides/' + g[0] + '.html') + '">' + A.esc(g[1]) + '</a>'; }).join('') + '</div></section>';
  };
  // links at the bottom of the front page to the website's own pages (people, Google and ad reviewers all look for these)
  A.hooks.homeFoot = function () {
    if (!document.querySelector('meta[name="cvm-offline"]')) return ''; // only the built website has these pages
    return '<nav class="site-links" aria-label="CV Maker SA">' +
      [['cv-templates/', 'CV templates'], ['cv-examples/', 'CV examples'], ['guides/', 'Guides'], ['about/', T('About')], ['advertise/', 'Advertise'], ['privacy.html', T('Privacy policy')]]
        .map(function (l) { return '<a href="' + l[0] + '">' + A.esc(l[1]) + '</a>'; }).join('') + '</nav>';
  };
  A.hooks.homeInstall = function () {
    if (standalone() || dismissed() || (!prompt && !IOS)) return '';
    return '<section class="install-card"><img src="img/icons/icon-192.png" alt="" class="ins-ic"><div class="ins-t"><b>' + T('Install CV Maker SA') + '</b><span>' +
      (prompt ? T('Add it to your home screen. It opens like an app and works without internet.') : T('On iPhone: tap the Share button, then "Add to Home Screen".')) +
      '</span><div class="ins-b">' + (prompt ? '<button class="btn small gold" data-inst="go">' + T('Install') + '</button>' : '') +
      '<button class="btn small ins-no" data-inst="no">' + T('Not now') + '</button></div></div></section>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-inst]'); if (!b) return;
    if (b.getAttribute('data-inst') === 'go' && prompt) {
      var p = prompt; prompt = null;
      p.prompt(); (p.userChoice || Promise.resolve()).then(function () { refreshHome(); });
      return;
    }
    try { localStorage.setItem(HIDE, String(Date.now() + 14 * 864e5)); } catch (er) {}
    refreshHome();
  });

  /* ---------- tell a friend: send the website link (WhatsApp first - that is how most people share) ---------- */
  var SHARE = 'cvmaker.share.card'; // '' = not yet, a date = hidden until then, 'done' = shared
  var MADE = 'cvmaker.delivered';    // how many times a CV, letter or Z83 was saved or shared
  function get(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  function siteLink() {
    var c = document.querySelector('link[rel="canonical"]');
    return c ? c.href : location.href.split('#')[0].split('?')[0].replace(/index\.html$/, '');
  }
  function message() { return T('Make your CV, cover letter and Z83 for free on your phone with CV Maker SA:') + ' ' + siteLink(); }
  function copy(text) {
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { }
      t.remove(); return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return true; }, fallback);
    return Promise.resolve(fallback());
  }
  function shared() { set(SHARE, 'done'); refreshHome(); }
  A.hooks.tellFriend = function () {
    var wa = 'https://wa.me/?text=' + encodeURIComponent(message());
    var sh = A.openSheet('<div class="fb">' +
      '<div class="fb-ic">' + A.svg('share') + '</div>' +
      '<h3>' + T('Tell a friend') + '</h3>' +
      '<p>' + T('Know someone looking for work? Send them CV Maker SA. It is free and works on any phone.') + '</p>' +
      '<div class="tf-msg">' + A.esc(message()) + '</div>' +
      '<a class="btn block tf-wa" data-tf="wa" href="' + A.esc(wa) + '" target="_blank" rel="noopener">' + A.svg('share') + 'WhatsApp</a>' +
      '<div class="tf-row">' + (navigator.share ? '<button type="button" class="btn soft" data-tf="more">' + T('More apps') + '</button>' : '') +
      '<button type="button" class="btn soft" data-tf="copy">' + A.svg('copy') + T('Copy link') + '</button></div></div>' +
      '<div class="sheet-foot"><button type="button" class="btn ghost" data-tf="close">' + T('Close') + '</button></div>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-tf]'); if (!b) return;
      var k = b.getAttribute('data-tf');
      if (k === 'close') { A.closeSheet(); return; }
      if (k === 'wa') { shared(); setTimeout(A.closeSheet, 300); return; } // the link itself opens WhatsApp
      if (k === 'more') {
        navigator.share({ title: 'CV Maker SA', text: T('Make your CV, cover letter and Z83 for free on your phone with CV Maker SA:'), url: siteLink() })
          .then(function () { shared(); A.closeSheet(); }, function () { });
        return;
      }
      if (k === 'copy') copy(message()).then(function (ok) { if (ok) shared(); A.toast(ok ? T('Link copied') : siteLink()); });
    };
  };
  /* ---------- backup reminder ----------
     On a website the CVs live only in the browser: clearing its data removes them, and Safari on iPhone can remove a
     website's data after about a week without a visit (not when it is on the Home Screen). So once a CV is worth keeping
     (after a download, or two days of work), the front page suggests saving a backup file - again two weeks after the
     last backup if the CVs changed since. */
  var BACK = 'cvmaker.backup.last', BSNOOZE = 'cvmaker.backup.snooze', FIRST = 'cvmaker.first.cv';
  var justBackedUp = false;
  function today() { return new Date().toISOString().slice(0, 10); }
  function backupDue() {
    if (!S.list.length) return false;
    if (!get(FIRST)) set(FIRST, String(Date.now()));
    var last = +get(BACK) || 0;
    var edited = S.list.reduce(function (m, c) { return Math.max(m, c.updated || 0); }, 0);
    if (last >= edited) return false;                          // nothing new since the last backup
    if (last && Date.now() - last < 14 * 864e5) return false; // backed up in the last two weeks
    var snooze = get(BSNOOZE); if (snooze && snooze > today()) return false;
    return +get(MADE) > 0 || Date.now() - (+get(FIRST) || Date.now()) > 2 * 864e5;
  }
  A.hooks.backedUp = function () { set(BACK, String(Date.now())); justBackedUp = true; setTimeout(refreshHome, 0); };
  A.hooks.homeBackup = function () {
    if (!backupDue()) return '';
    return '<section class="install-card fb-card bk-card"><div class="ins-ic fb-card-ic">' + A.svg('backup') + '</div><div class="ins-t"><b>' + T('Keep a safe copy of your CVs') + '</b><span>' +
      T('Your CVs are saved only in this browser. If its data is cleared, they are gone. Save a backup file on your phone - you can load it again with "Restore from backup".') +
      (IOS && !standalone() ? ' ' + T('On iPhone, also add CV Maker SA to your Home Screen so Safari keeps your CVs.') : '') + '</span><div class="ins-b">' +
      '<button class="btn small" data-bk="go">' + T('Back up now') + '</button><button class="btn small ins-no" data-bk="no">' + T('Not now') + '</button></div></div></section>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-bk]'); if (!b) return;
    if (b.getAttribute('data-bk') === 'go') { A.backup(); return; }
    set(BSNOOZE, new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)); refreshHome(); // ask again in a week
  });
  // one card at a time: keeping the CVs safe comes before "How did it go?" and "Tell a friend"
  var prevFeedbackCard = A.hooks.homeFeedback;
  if (prevFeedbackCard) A.hooks.homeFeedback = function () { return backupDue() ? '' : prevFeedbackCard(); };

  // after a CV has been saved or shared (and the "How did it go?" card is finished), the front page suggests sharing once
  var prevDelivered = A.hooks.delivered;
  A.hooks.delivered = function (mode) {
    if (justBackedUp) { justBackedUp = false; return; } // a backup file is not a CV download
    if (prevDelivered) prevDelivered(mode);
    if (mode !== 'print') set(MADE, String((+get(MADE) || 0) + 1));
  };
  A.hooks.homeShare = function () {
    if (backupDue()) return '';
    var st = get(SHARE);
    if (!(+get(MADE) > 0) || st === 'done' || (st && st > new Date().toISOString().slice(0, 10))) return '';
    if (A.hooks.homeFeedback && A.hooks.homeFeedback()) return ''; // one card at a time
    return '<section class="install-card fb-card"><div class="ins-ic fb-card-ic">' + A.svg('share') + '</div><div class="ins-t"><b>' + T('Help a friend find work') + '</b><span>' +
      T('Know someone looking for work? Send them CV Maker SA. It is free and works on any phone.') + '</span><div class="ins-b">' +
      '<button class="btn small" data-tfc="go">' + T('Share') + '</button><button class="btn small ins-no" data-tfc="no">' + T('Not now') + '</button></div></div></section>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-tfc]'); if (!b) return;
    if (b.getAttribute('data-tfc') === 'go') { A.hooks.tellFriend(); return; }
    set(SHARE, new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10)); refreshHome(); // ask again in a month
  });

  /* ---------- links from the website's pages that open the app ready to go ----------
     ?job=cashier       a new CV for that job (its code, as on the CV example pages): job title and usual skills filled in
                        (add &template=aurora to start it in that design)
     ?template=aurora   use that design, for a new CV or for one already saved
     ?start=z83         a new Z83 form
     ?start=editpdf     the PDF tools, with the Edit PDF file chooser open
     ?start=toword      the PDF tools, with the PDF to Word file chooser open
     The link is then cleaned up, so refreshing the page does not start another CV. */
  (function () {
    var q; try { q = new URLSearchParams(location.search); } catch (e) { return; }
    var job = (q.get('job') || '').slice(0, 60), tpl = q.get('template') || '', start = q.get('start') || '';
    if (!job && !tpl && !start) return;
    try { history.replaceState({ cvm: 0 }, '', location.pathname); } catch (e) { }
    var D = window.CVData, TP = window.CVTemplates;
    function fresh(templateId) {
      var c = D.blankCV(); if (templateId) c.templateId = templateId;
      S.list.unshift(c); S.cur = c; S.open = { personal: true }; return c;
    }
    function show(stack) { A.saveNow(); S.stack = stack; A.render(); window.scrollTo(0, 0); }
    if (job) {
      // the job's code (e.g. bookkeeper-accounts-clerk) picks it exactly; any other text is matched by name
      var CD = window.CVDuties, slug = function (t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
      // with &template=<id> (the CV example pages send the design shown in their picture) the new CV starts in that design
      var jt = tpl && TP && TP.list.filter(function (x) { return x.id === tpl; })[0];
      var j = CD && (CD.JOBS.filter(function (x) { return slug(x.t) === slug(job); })[0] || CD.match(job)), c = fresh(jt ? jt.id : '');
      c.personal.headline = j ? j.t.split(' / ')[0] : job;
      if (j) c.skills = j.s.join('\n');
      show(['home', 'edit']);
      A.toast(T('Your {job} CV is started. Fill in your details.', { job: c.personal.headline }), 5000);
      return;
    }
    if (start === 'z83') { fresh(); show(['home', 'edit', 'z83']); return; }
    if (start === 'editpdf' || start === 'toword') { show(['home', 'pdftools']); if (A.PDF && A.PDF.runTool) setTimeout(function () { A.PDF.runTool(start === 'toword' ? 'toword' : 'edit'); }, 250); return; }
    var t = tpl && TP && TP.list.filter(function (x) { return x.id === tpl; })[0];
    if (!t) return;
    if (!S.list.length) { fresh(t.id); show(['home', 'edit']); A.toast(T('{name} is your design. Fill in your details.', { name: t.name }), 5000); return; }
    // CVs already saved: ask which one gets the design
    var sh = A.openSheet('<div class="sheet-sec">' + T('Use {name} for:', { name: A.esc(t.name) }) + '</div>' +
      S.list.map(function (c) { return '<button class="sheet-item" data-usetpl="' + c.id + '">' + A.svg('file') + '<span>' + A.esc(A.cvTitle(c)) + '</span></button>'; }).join('') +
      '<button class="sheet-item" data-usetpl="new">' + A.svg('plus') + '<span>' + T('A new CV') + '</span></button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-usetpl]'); if (!b) return;
      A.closeSheet();
      var id = b.getAttribute('data-usetpl');
      if (id === 'new') { fresh(t.id); show(['home', 'edit']); return; }
      var c = S.list.filter(function (x) { return x.id === id; })[0]; if (!c) return;
      c.templateId = t.id; c.updated = Date.now(); S.cur = c; show(['home', 'edit', 'prev']);
    };
  })();

  /* ---------- sponsor taps are counted on the website ----------
     The built website has a small page go/<id>.html for each sponsor (web/finish.py): the visitor counter counts it,
     then it opens the sponsor's link. Without internet the link opens directly, as in the app. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-sp]'); if (!a) return;
    var id = a.getAttribute('data-sp'), kind = a.getAttribute('data-kind');
    if (!id || !navigator.onLine || !document.querySelector('meta[name="cvm-offline"]')) return;
    e.preventDefault();
    window.open('go/' + encodeURIComponent(id) + (kind ? '-' + kind : '') + '.html', '_blank', 'noopener');
  });

  /* ---------- keep the saved CVs (ask the browser not to clear them when space runs low) ---------- */
  var ASKED = 'cvmaker.persist.asked';
  function keep() {
    if (!navigator.storage || !navigator.storage.persist) return;
    try { if (localStorage.getItem(ASKED)) return; localStorage.setItem(ASKED, '1'); } catch (e) { return; }
    navigator.storage.persist().catch(function () {});
  }
  if (S.list.length) keep();
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#new-cv, #try-sample, [data-start]')) setTimeout(keep, 500); }, true);

  /* ---------- the PDF and Word makers load in the background, after the first screen ----------
     (web/finish.py takes them off the first page load, so the front page appears sooner on slow data).
     With the offline helper, wait until it has saved its copies, so nothing is downloaded twice. */
  // They start on the first tap or key press, when the phone is idle, so the front page stays quick to use.
  var warmed = false, ready = false, touched = false;
  function idle(fn) { if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 2500 }); else setTimeout(fn, 300); }
  function go() {
    if (warmed || !ready || !touched || !window.CVLibs) return; warmed = true;
    idle(function () { window.CVLibs.need('pdf zip').catch(function () { warmed = false; }); });
  }
  function warm() { ready = true; go(); }
  // The offline helper keeps only what the first screen needs at first (web/finish.py). On the first real tap or key
  // press it is asked for the rest (the other templates' fonts, the PDF viewer), so someone who only looks at the page
  // does not pay for about 1.5 MB they never use. Asked again on later visits; it skips what it already has.
  var askedMore = false;
  function more() {
    if (askedMore || !('serviceWorker' in navigator)) return; askedMore = true;
    navigator.serviceWorker.ready.then(function (reg) { if (reg.active) reg.active.postMessage('more'); }).catch(function () { askedMore = false; });
  }
  function poke(e) {
    if (e && e.target && e.target.closest && e.target.closest('#upd')) return;
    more();
    touched = true; go();
  }
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, poke, { capture: true, passive: true }); });
  // (there was also a 10-second timer here; it made everyone who only looked at the page download the PDF and Word makers.
  // Nothing needs them before a first tap, and every function that uses them waits for them - js/libs.js.)

  A.hooks.refresh = function () {
    var upd = document.querySelector('#upd button');
    if (upd) upd.click(); else location.reload();
  };

  /* ---------- works without internet: service worker, with a gentle "update ready" note ---------- */
  // only the built website has sw.js (web/build.sh adds the marker); the plain www folder and the APK do not
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && document.querySelector('meta[name="cvm-offline"]')) {
    var wantReload = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (wantReload) location.reload(); });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        function ready() { if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg); }
        ready();
        reg.addEventListener('updatefound', function () {
          var nw = reg.installing; if (!nw) return;
          nw.addEventListener('statechange', function () { if (nw.state === 'installed') ready(); });
        });
        // look for a new version when the app comes back to the front
        document.addEventListener('visibilitychange', function () { if (!document.hidden) reg.update().catch(function () {}); });
        navigator.serviceWorker.ready.then(warm);
      }).catch(warm);
    });
    function showUpdate(reg) {
      if (document.getElementById('upd')) return;
      var el = document.createElement('div'); el.id = 'upd'; el.className = 'upd';
      el.innerHTML = '<span>' + T('A new version of CV Maker SA is ready.') + '</span><button class="btn small gold">' + T('Update') + '</button>';
      el.querySelector('button').onclick = function () {
        A.saveNow(); wantReload = true;
        if (!reg.waiting) { location.reload(); return; }
        // ask the new version to take over. If a file was still loading, Chrome can put the switch off for up to
        // half a minute, so ask again every second until it happens (the page then reloads by itself)
        var tries = 0;
        (function ask() {
          if (!reg.waiting) return;
          if (tries++ >= 8) { location.reload(); return; }
          reg.waiting.postMessage('skip'); setTimeout(ask, 1000);
        })();
      };
      document.body.appendChild(el);
    }
  } else {
    window.addEventListener('load', function () { setTimeout(warm, 1200); });
  }

  // the front page was drawn before this file added its parts (guides, install, backup and share cards, footer links):
  // draw it once more, so they are there on the very first screen and not only after coming back to it
  refreshHome();
})();
} catch (e) { setTimeout(function () { throw e; }, 0); }
