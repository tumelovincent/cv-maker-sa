/* The big libraries (pdf-lib + fontkit for PDFs, JSZip for Word files) are about 560 KB.
   On the website they load after the first screen appears (web/finish.py takes their tags out of the page),
   and every function that needs them waits for them first. In the Android app they are already on the page,
   so waiting costs nothing. */
(function () {
  'use strict';
  var SETS = {
    pdf: [['PDFLib', 'js/lib/pdf-lib.min.js'], ['fontkit', 'js/lib/fontkit.umd.min.js']],
    zip: [['JSZip', 'js/lib/jszip.min.js']]
  };
  var loading = {};
  function load(src) {
    if (!loading[src]) {
      loading[src] = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.async = false;
        s.onload = function () { res(); };
        s.onerror = function () {
          delete loading[src]; if (s.parentNode) s.parentNode.removeChild(s);
          var A = window.App, msg = 'Part of CV Maker SA did not load. Check your internet connection and try again.';
          rej(new Error(A && A.T ? A.T(msg) : msg));
        };
        document.head.appendChild(s);
      });
    }
    return loading[src];
  }
  // need('pdf'), need('zip') or need('pdf zip'): resolves when those libraries are on the page
  function need(which) {
    var list = [];
    String(which || 'pdf zip').split(' ').forEach(function (k) {
      (SETS[k] || []).forEach(function (p) { if (!window[p[0]]) list.push(load(p[1])); });
    });
    return Promise.all(list).then(function () {});
  }
  // makes obj[name]() wait for the libraries before it runs (the functions already return promises)
  function wrap(obj, names, which) {
    names.forEach(function (n) {
      var fn = obj && obj[n]; if (typeof fn !== 'function') return;
      obj[n] = function () { var self = this, a = arguments; return need(which).then(function () { return fn.apply(self, a); }); };
    });
  }
  window.CVLibs = { need: need, wrap: wrap };
})();
