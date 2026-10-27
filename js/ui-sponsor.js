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
})();
