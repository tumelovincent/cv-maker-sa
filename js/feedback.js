/* "Send feedback": an email to the developer with a few short questions and the app details already filled in.
   Nothing is sent by the app itself - the person's own email app opens and they decide what to send. */
(function () {
  'use strict';
  var A = window.App, $ = A.$, esc = A.esc, svg = A.svg, T = A.T;
  var NATIVE = window.AndroidBridge || null;
  var EMAIL = 'tumelovincent558@gmail.com';
  var CARD = 'cvmaker.feedback.card'; // '' = no download yet, 'show' = ask on the front page, 'done' = sent or dismissed
  A.ICON.feedback = 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z';

  function get(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  // which app, version, phone system and language - helps to find a problem, contains nothing personal
  function details() {
    var ua = navigator.userAgent, m = /Android (\d+(?:\.\d+)?)/.exec(ua);
    var os = m ? 'Android ' + m[1] : /iPhone|iPad|iPod/.test(ua) ? 'iPhone/iPad' : /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'Mac' : /Linux/.test(ua) ? 'Linux' : '';
    return 'CV Maker SA ' + A.VERSION + ' - ' + (NATIVE ? 'Android app' : 'website') + (os ? ' - ' + os : '') +
      ' - ' + (window.CVi18n ? window.CVi18n.name() : 'English');
  }
  function mailto() {
    var nl = '\r\n';
    var body = T('Hi Tumelo,') + nl + nl +
      '1. ' + T('What did you make with the app? (CV, cover letter, Z83...)') + nl + nl + nl +
      '2. ' + T('Was anything hard or confusing?') + nl + nl + nl +
      '3. ' + T('Did anything not work? What happened?') + nl + nl + nl +
      '4. ' + T('What should we add or change?') + nl + nl + nl +
      '5. ' + T('Would you tell a friend about CV Maker SA? (Yes / Maybe / No)') + nl + nl + nl +
      '---' + nl + details();
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('CV Maker SA feedback') + '&body=' + encodeURIComponent(body);
  }
  function copy(text) {
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { }
      t.remove(); return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  }

  function open() {
    var sh = A.openSheet('<div class="fb">' +
      '<div class="fb-ic">' + svg('feedback') + '</div>' +
      '<h3>' + T('Send feedback') + '</h3>' +
      '<p>' + T('Tell Tumelo what was hard, what did not work or what you would like added. Your email app opens with a few short questions.') + '</p>' +
      '<a class="btn block" data-fb="mail" href="' + esc(mailto()) + '">' + svg('mail') + T('Write an email') + '</a>' +
      '<div class="fb-or">' + T('Or send an email to:') + '</div>' +
      '<div class="fb-addr"><span>' + EMAIL + '</span><button type="button" class="btn small soft" data-fb="copy">' + svg('copy') + T('Copy') + '</button></div>' +
      '<p class="fb-note">' + T('Please do not send your ID number or other private details.') + '</p></div>' +
      '<div class="sheet-foot"><button type="button" class="btn ghost" data-fb="close">' + T('Close') + '</button></div>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-fb]'); if (!b) return;
      var k = b.getAttribute('data-fb');
      if (k === 'close') { A.closeSheet(); return; }
      if (k === 'mail') { set(CARD, 'done'); setTimeout(A.closeSheet, 300); refresh(); return; } // the link itself opens the email app
      if (k === 'copy') copy(EMAIL).then(function (ok) { A.toast(ok ? T('Email address copied') : EMAIL); });
    };
  }
  A.hooks.feedback = open;

  // the privacy policy (same page as on the website), shown inside the app so it also opens without internet
  A.hooks.privacy = function () {
    fetch('privacy.html').then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var main = doc.querySelector('main'), date = doc.querySelector('header p');
      var sh = A.openSheet('<div class="policy pp"><h3>' + T('Privacy policy') + '</h3>' + (date ? '<p class="muted">' + esc(date.textContent) + '</p>' : '') +
        (main ? main.innerHTML : '') + '</div><div class="sheet-foot"><button type="button" class="btn ghost" data-pp="close">' + T('Close') + '</button></div>');
      sh.onclick = function (e) { if (e.target.closest('[data-pp="close"]')) A.closeSheet(); };
    }).catch(function () { A.toast(T('Could not open the privacy policy')); });
  };

  // after the first CV is saved or shared, the front page asks once how it went
  A.hooks.delivered = function (mode) { if (mode !== 'print' && !get(CARD)) set(CARD, 'show'); };
  A.hooks.homeFeedback = function () {
    if (get(CARD) !== 'show') return '';
    return '<section class="install-card fb-card"><div class="ins-ic fb-card-ic">' + svg('feedback') + '</div><div class="ins-t"><b>' + T('How did it go?') + '</b><span>' +
      T('Tell us what was hard or what to add. It helps make CV Maker SA better for everyone.') + '</span><div class="ins-b">' +
      '<button class="btn small" data-fbc="go">' + T('Send feedback') + '</button><button class="btn small ins-no" data-fbc="no">' + T('Not now') + '</button></div></div></section>';
  };
  function refresh() { if (A.S.stack[A.S.stack.length - 1] === 'home') A.renderHome(); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-fbc]'); if (!b) return;
    if (b.getAttribute('data-fbc') === 'go') { open(); return; }
    set(CARD, 'done'); refresh();
  });
})();
