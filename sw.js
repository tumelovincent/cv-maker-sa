/* CV Maker SA - keeps the app on the phone so it opens and works without internet. Made by web/build.sh. */
var VERSION = '20261022-660c687b';
var CACHE = 'cvmaker-' + VERSION;
var FILES = [
"./",
"manifest.webmanifest",
"css/app.css",
"css/cv-mod.css",
"css/cv.css",
"css/fonts.css",
"fonts/caladea-400.ttf",
"fonts/caladea-700.ttf",
"fonts/carlito-400.ttf",
"fonts/carlito-700.ttf",
"fonts/dmsans-400.ttf",
"fonts/dmsans-700.ttf",
"fonts/garamond-400.ttf",
"fonts/garamond-700.ttf",
"fonts/lato-300.ttf",
"fonts/lato-400.ttf",
"fonts/lato-700.ttf",
"fonts/merriweather-300.ttf",
"fonts/merriweather-400.ttf",
"fonts/merriweather-700.ttf",
"fonts/montserrat-300.ttf",
"fonts/montserrat-400.ttf",
"fonts/montserrat-700.ttf",
"fonts/nunito-400.ttf",
"fonts/nunito-700.ttf",
"fonts/opensans-400.ttf",
"fonts/opensans-700.ttf",
"fonts/oswald-400.ttf",
"fonts/oswald-600.ttf",
"fonts/pagella-400.ttf",
"fonts/pagella-700.ttf",
"fonts/playfair-400.ttf",
"fonts/playfair-700.ttf",
"fonts/poppins-300.ttf",
"fonts/poppins-400.ttf",
"fonts/poppins-600.ttf",
"fonts/raleway-300.ttf",
"fonts/raleway-400.ttf",
"fonts/raleway-700.ttf",
"fonts/roboto-400.ttf",
"fonts/roboto-700.ttf",
"fonts/sourcesans-400.ttf",
"fonts/sourcesans-700.ttf",
"img/logo.png",
"img/icons/apple-touch-icon.png",
"img/icons/favicon-32.png",
"img/icons/favicon-48.png",
"img/icons/icon-192.png",
"img/icons/icon-512.png",
"img/icons/maskable-192.png",
"img/icons/maskable-512.png",
"js/app.js",
"js/checker.js",
"js/data.js",
"js/docx.js",
"js/duties.js",
"js/files.js",
"js/fontmanifest.js",
"js/i18n-dict.js",
"js/i18n.js",
"js/letter.js",
"js/paginate.js",
"js/pdf.js",
"js/pdfcore.js",
"js/templates-mod.js",
"js/templates.js",
"js/ui-apply.js",
"js/ui-more.js",
"js/ui-pdf.js",
"js/ui-scan.js",
"js/ui-sign.js",
"js/web.js",
"js/word.js",
"js/z83.js",
"js/lib/docx-preview.min.js",
"js/lib/fontkit.umd.min.js",
"js/lib/jszip.min.js",
"js/lib/pdf-lib.min.js",
"js/lib/pdfjs.min.js",
"js/lib/pdfjs.worker.min.js"
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); })); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('cvmaker-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('message', function (e) { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // the app is one page: always answer with it (fresh from the internet when possible, otherwise the saved copy)
    var home = new URL('./', self.registration.scope).href;
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(home).then(function (saved) {
        if (saved) return saved;
        return fetch(req);
      });
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
