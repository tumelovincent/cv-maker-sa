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
    var sect = '<w:sectPr>' + hdrRefs + '<w:pgSz w:w="' + PGW + '" w:h="' + PGH + '"/>' +
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

  window.CVDocx = { make: makeDocx, letter: makeLetterDocx };
  if (window.CVLibs) window.CVLibs.wrap(window.CVDocx, ['make', 'letter'], 'zip');
})();
