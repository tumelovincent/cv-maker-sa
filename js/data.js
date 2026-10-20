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

  function sampleCV() {
    var c = blankCV();
    c.templateId = 'classic';
    c.personal = { surname: 'Mokoena', firstNames: 'Thabo Sipho', headline: 'Retail Merchandiser',
      dob: '1998-05-14', idNumber: '9805145123082', gender: 'Male', race: 'African (Black)',
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
