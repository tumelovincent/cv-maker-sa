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
    return window.CVPdfTools.loadScript('js/lib/docx-preview.min.js').then(function () {
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
