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
  window.CVTemplatesMod = { make: make, palette: palette, list: MOD };
})();
