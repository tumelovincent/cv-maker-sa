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
