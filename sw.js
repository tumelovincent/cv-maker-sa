/* CV Maker SA - keeps the app on the phone so it opens and works without internet. Made by web/build.sh. */
var VERSION = '20261113-46bdf384';
var CACHE = 'cvmaker-' + VERSION;
// FILES: what the first screen and the CV form need. Kept as soon as the page has opened.
var FILES = [
"./",
"manifest.webmanifest",
"privacy.html",
"css/app.css",
"css/cv-mod.css",
"css/cv.css",
"css/fonts.css",
"fonts/carlito-400.ttf",
"fonts/carlito-700.ttf",
"fonts/dmsans-400.ttf",
"fonts/dmsans-700.ttf",
"fonts/montserrat-700.ttf",
"fonts/pagella-400.ttf",
"fonts/pagella-700.ttf",
"img/logo.png",
"img/icons/apple-touch-icon.png",
"img/icons/favicon-32.png",
"img/icons/favicon-48.png",
"img/icons/icon-192.png",
"img/icons/icon-512.png",
"img/icons/maskable-192.png",
"img/icons/maskable-512.png",
"js/app.fdae9f9b.js"
];
// MORE: the PDF and Word makers, the PDF viewer and the fonts of the other templates (about three quarters of the
// download). Fetched when the person first taps or types (the page sends 'more', see web.js), so someone who only
// looks at the page does not pay for it. Anything here that is needed sooner is fetched and kept at that moment.
var MORE = [
"js/lib/pdf-lib.min.js",
"js/lib/docx-preview.min.js",
"js/lib/fontkit.umd.min.js",
"js/lib/jszip.min.js",
"js/lib/pdfjs.min.js",
"js/lib/pdfjs.worker.min.js",
"fonts/caladea-400.ttf",
"fonts/caladea-400i.ttf",
"fonts/caladea-700.ttf",
"fonts/caladea-700i.ttf",
"fonts/carlito-400i.ttf",
"fonts/carlito-700i.ttf",
"fonts/garamond-400.ttf",
"fonts/garamond-700.ttf",
"fonts/lato-300.ttf",
"fonts/lato-400.ttf",
"fonts/lato-700.ttf",
"fonts/libsans-400.ttf",
"fonts/libsans-400i.ttf",
"fonts/libsans-700.ttf",
"fonts/libsans-700i.ttf",
"fonts/libserif-400.ttf",
"fonts/libserif-400i.ttf",
"fonts/libserif-700.ttf",
"fonts/libserif-700i.ttf",
"fonts/merriweather-300.ttf",
"fonts/merriweather-400.ttf",
"fonts/merriweather-700.ttf",
"fonts/montserrat-300.ttf",
"fonts/montserrat-400.ttf",
"fonts/nunito-400.ttf",
"fonts/nunito-700.ttf",
"fonts/opensans-400.ttf",
"fonts/opensans-700.ttf",
"fonts/oswald-400.ttf",
"fonts/oswald-600.ttf",
"fonts/playfair-400.ttf",
"fonts/playfair-700.ttf",
"fonts/poppins-300.ttf",
"fonts/poppins-400.ttf",
"fonts/poppins-600.ttf",
"fonts/raleway-300.ttf",
"fonts/raleway-400.ttf",
"fonts/raleway-700.ttf",
"fonts/roboto-400.ttf",
"fonts/roboto-400i.ttf",
"fonts/roboto-700.ttf",
"fonts/roboto-700i.ttf",
"fonts/sourcesans-400.ttf",
"fonts/sourcesans-700.ttf"
];
// Not downloaded until someone uses them (to save people's data), then kept like the rest: the word list for Sesotho,
// isiZulu and Afrikaans. If this phone already has it, an update brings its new copy along, so the language keeps
// working without internet.
var IF_USED = ['js/i18n-dict.js'];
self.addEventListener('install', function (e) {
  // first visit: the page has just downloaded many of these files, so take them from the browser's own cache
  // instead of using the person's data twice. Updates: always fetch fresh copies.
  e.waitUntil(caches.keys().then(function (keys) {
    var update = keys.some(function (k) { return k.indexOf('cvmaker-') === 0; });
    // an update keeps a phone that had everything complete: it gets the new copy of everything in one go
    return (update ? caches.match(MORE[0]) : Promise.resolve(null)).then(function (hadMore) {
      var list = hadMore ? FILES.concat(MORE) : FILES;
      return caches.open(CACHE).then(function (c) {
        return c.addAll(list.map(function (f) { return new Request(f, { cache: update ? 'reload' : 'default' }); })).then(function () { return c; });
      });
    }).then(function (c) {
      return Promise.resolve().then(function () {
        return Promise.all(IF_USED.map(function (f) {
          return caches.match(f).then(function (had) {
            if (had) return c.add(new Request(f, { cache: 'reload' })).catch(function () { return c.put(f, had); });
          });
        }));
      });
    });
  }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('cvmaker-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// the rest of the offline copy, one file at a time (gentle on a slow connection); files already kept are skipped
var moreRun = null;
function more() {
  if (!moreRun) {
    moreRun = caches.open(CACHE).then(function (c) {
      return MORE.reduce(function (p, f) {
        return p.then(function () { return c.match(f); }).then(function (hit) { if (!hit) return c.add(f).catch(function () {}); });
      }, Promise.resolve());
    }).then(function () { moreRun = null; }, function () { moreRun = null; });
  }
  return moreRun;
}
self.addEventListener('message', function (e) {
  if (e.data === 'skip') self.skipWaiting();
  if (e.data === 'more') e.waitUntil(more());
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    var scope = new URL(self.registration.scope), home = new URL('./', scope).href;
    var isApp = url.pathname === scope.pathname || url.pathname === scope.pathname + 'index.html';
    if (isApp) {
      // the app is one page: answer with the saved copy (works without internet)
      e.respondWith(caches.open(CACHE).then(function (c) {
        return c.match(home).then(function (saved) {
          if (saved) return saved;
          return fetch(req);
        });
      }));
      return;
    }
    // other pages (privacy policy, guides): from the internet, or a saved copy when offline
    e.respondWith(fetch(req).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match(home); });
    }));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      if (res && res.ok && res.type === 'basic') { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  }));
});
