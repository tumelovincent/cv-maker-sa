/* App screens in English, Sesotho, isiZulu and Afrikaans.
   The English text is the key; the word lists are in i18n-dict.js as { "English": ["Sesotho", "isiZulu", "Afrikaans"] }.
   Only the app screens change. CVs, cover letters and Z83 forms stay in English, as employers expect. */
(function () {
  'use strict';
  var LANGS = [['en', 'English', 'en-ZA'], ['st', 'Sesotho', 'st-ZA'], ['zu', 'isiZulu', 'zu-ZA'], ['af', 'Afrikaans', 'af-ZA']];
  var COL = { st: 0, zu: 1, af: 2 };
  var KEY = 'cvmaker.lang';
  var DICT = window.CVi18nDict || {};
  var cur = 'en';
  try { var saved = localStorage.getItem(KEY); if (saved === 'en' || COL[saved] !== undefined) cur = saved; } catch (e) { /* private mode */ }

  // test builds can collect every text the screens ask for
  var seen = typeof window.__i18nPush === 'function' ? {} : null;

  function t(s) {
    if (s === null || s === undefined || s === '') return s;
    if (seen && !seen[s]) { seen[s] = 1; try { window.__i18nPush(String(s)); } catch (e) { /* ignore */ } }
    if (cur === 'en') return s;
    var row = DICT[s];
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

  function set(code) {
    if (code !== 'en' && COL[code] === undefined) code = 'en';
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
