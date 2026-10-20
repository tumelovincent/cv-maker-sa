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
    else if (p.firstNames === p.firstNames.toLowerCase() || p.surname === p.surname.toLowerCase()) tip('Start your names with capital letters (for example Thabo Mokoena).', 'personal');
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
