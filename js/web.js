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

  /* ---------- keep the saved CVs (ask the browser not to clear them when space runs low) ---------- */
  var ASKED = 'cvmaker.persist.asked';
  function keep() {
    if (!navigator.storage || !navigator.storage.persist) return;
    try { if (localStorage.getItem(ASKED)) return; localStorage.setItem(ASKED, '1'); } catch (e) { return; }
    navigator.storage.persist().catch(function () {});
  }
  if (S.list.length) keep();
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#new-cv, #try-sample, [data-start]')) setTimeout(keep, 500); }, true);

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
      }).catch(function () {});
    });
    function showUpdate(reg) {
      if (document.getElementById('upd')) return;
      var el = document.createElement('div'); el.id = 'upd'; el.className = 'upd';
      el.innerHTML = '<span>' + T('A new version of CV Maker SA is ready.') + '</span><button class="btn small gold">' + T('Update') + '</button>';
      el.querySelector('button').onclick = function () {
        A.saveNow(); wantReload = true;
        if (reg.waiting) reg.waiting.postMessage('skip'); else location.reload();
      };
      document.body.appendChild(el);
    }
  }
})();
