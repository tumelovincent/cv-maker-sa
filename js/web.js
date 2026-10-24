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
    var G = [['how-to-fill-in-z83-form', 'How to fill in the Z83 form'], ['cv-with-no-experience', 'A CV with no work experience'],
      ['how-to-apply-for-learnerships', 'How to apply for learnerships'], ['how-to-write-a-cover-letter', 'How to write a cover letter'],
      ['job-interview-tips', 'Job interview tips'], ['south-african-cv-format', 'The South African CV format']];
    return '<section class="block"><div class="block-h"><h2>' + T('Help with your application') + '</h2><a class="see-all" href="guides/">' + T('All guides') + '</a></div>' +
      '<div class="guide-list">' + G.map(function (g) { return '<a class="guide-it" href="guides/' + g[0] + '.html">' + A.esc(g[1]) + '</a>'; }).join('') + '</div></section>';
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
  if (S.stack[S.stack.length - 1] === 'home' && IOS) refreshHome();

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
  // after a CV has been saved or shared (and the "How did it go?" card is finished), the front page suggests sharing once
  var prevDelivered = A.hooks.delivered;
  A.hooks.delivered = function (mode) {
    if (prevDelivered) prevDelivered(mode);
    if (mode !== 'print') set(MADE, String((+get(MADE) || 0) + 1));
  };
  A.hooks.homeShare = function () {
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

  /* ---------- sponsor taps are counted on the website ----------
     The built website has a small page go/<id>.html for each sponsor (web/finish.py): the visitor counter counts it,
     then it opens the sponsor's link. Without internet the link opens directly, as in the app. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-sp]'); if (!a) return;
    var id = a.getAttribute('data-sp');
    if (!id || !navigator.onLine || !document.querySelector('meta[name="cvm-offline"]')) return;
    e.preventDefault();
    window.open('go/' + encodeURIComponent(id) + '.html', '_blank', 'noopener');
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
  // They start on the first tap or key press (or after 10 seconds), when the phone is idle, so the front page stays quick to use.
  var warmed = false, ready = false, touched = false;
  function idle(fn) { if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 2500 }); else setTimeout(fn, 300); }
  function go() {
    if (warmed || !ready || !touched || !window.CVLibs) return; warmed = true;
    idle(function () { window.CVLibs.need('pdf zip').catch(function () { warmed = false; }); });
  }
  function warm() { ready = true; go(); }
  function poke(e) { if (e && e.target && e.target.closest && e.target.closest('#upd')) return; touched = true; go(); }
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, poke, { capture: true, passive: true }); });
  setTimeout(poke, 10000);

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
})();
