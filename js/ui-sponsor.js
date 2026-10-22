/* The sponsor card: one small, clearly labelled card from window.CV_SPONSORS (js/sponsors.js).
   Shown on the front page (after "My CVs") and under the CV preview, never while typing a CV, never in a file.
   Nothing is counted or sent: tapping the button only opens the sponsor's own link (WhatsApp, phone, email, website). */
(function () {
  'use strict';
  var A = window.App, esc = A.esc, T = A.T;
  function today() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
  function live() {
    var t = today();
    return (window.CV_SPONSORS || []).filter(function (s) {
      return s && s.name && s.action && (!s.from || s.from <= t) && (!s.until || s.until >= t);
    });
  }
  var start = null; // which sponsor this visit starts with (they take turns between visits)
  function pick(offset) {
    var list = live(); if (!list.length) return null;
    if (start === null) {
      var k = 'cvmaker.sponsor.turn', n = 0;
      try { n = (+localStorage.getItem(k) || 0) + 1; localStorage.setItem(k, String(n)); } catch (e) { n = Math.floor(Math.random() * 1000); }
      start = n;
    }
    return list[(start + (offset || 0)) % list.length];
  }
  function initials(name) {
    return String(name).split(/\s+/).filter(function (w) { return /^[A-Za-z0-9]/.test(w) && !/^(and|of|the|&)$/i.test(w); })
      .slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  function logo(s) {
    if (s.logo) return '<img class="sp-logo" src="' + esc(s.logo) + '" alt="">';
    return '<div class="sp-logo sp-ini" style="background:' + esc(s.color || '#0B5D4B') + '">' + esc(s.ini || initials(s.name)) + '</div>';
  }
  function link(s, cls) {
    var ext = /^https?:/i.test(s.action);
    return '<a class="' + cls + '" href="' + esc(s.action) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(s.cta || T('Contact')) + '</a>';
  }
  function tag() { return '<div class="sp-tag"><span>' + T('Sponsored') + '</span>' + T('Helps keep CV Maker SA free') + '</div>'; }

  A.hooks.homeSponsor = function () {
    var s = pick(0); if (!s) return '';
    return '<section class="sp-card" aria-label="' + esc(T('Sponsored')) + '">' + tag() +
      '<div class="sp-body">' + logo(s) + '<div class="sp-t"><b>' + esc(s.name) + '</b><span>' + esc(s.line || '') + '</span>' +
      (s.area ? '<small>' + esc(s.area) + '</small>' : '') + '</div></div>' + link(s, 'btn small soft sp-cta') + '</section>';
  };
  // under the CV preview: a slim one-line version, after the pages
  A.hooks.pvSponsor = function () {
    var s = pick(1); if (!s) return '';
    return '<div class="sp-slim" aria-label="' + esc(T('Sponsored')) + '">' + logo(s) + '<div class="sp-t"><small class="sp-lbl">' + T('Sponsored') + '</small><b>' + esc(s.name) + '</b>' +
      '<span>' + esc(s.line || '') + '</span></div>' + link(s, 'sp-go') + '</div>';
  };
})();
