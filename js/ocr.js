/* Reading the words on a scanned page (Tesseract OCR, English), all on the phone, so "Edit text", white-out, black-out
   and find work on scans too. The engine and the English data (about 6 MB) are in the app; the website downloads them
   the first time they are needed and keeps them for offline use. */
(function () {
  'use strict';
  var BASE = 'js/ocr/', worker = null, ready = null, jobs = {}, next = 1;
  function T(s, v) { var A = window.App; return A && A.T ? A.T(s, v) : s; }
  function get(url, kind) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error(T('The word reader did not load. Check your internet connection and try again.')); return kind === 'text' ? r.text() : r.arrayBuffer(); });
  }
  function gunzip(buf) {
    if (typeof DecompressionStream === 'undefined') return Promise.reject(new Error(T('This phone\'s web browser is too old to read scanned pages. Update Android System WebView or Chrome.')));
    return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  function start() {
    if (ready) return ready;
    ready = Promise.all([get(BASE + 'tesseract-core-lstm.js', 'text'), get(BASE + 'ocr-worker.js', 'text'), get(BASE + 'tesseract-core-lstm.wasm'), get(BASE + 'eng.traineddata.gz')]).then(function (r) {
      return gunzip(r[3]).then(function (data) {
        var url = URL.createObjectURL(new Blob([r[0], '\n;\n', r[1]], { type: 'application/javascript' }));
        worker = new Worker(url);
        return new Promise(function (res, rej) {
          worker.onmessage = function (e) {
            var m = e.data;
            if (m.type === 'ready') { res(); return; }
            var job = m.id && jobs[m.id];
            if (!job) { if (m.type === 'error') rej(new Error(m.message)); return; }
            delete jobs[m.id];
            if (m.type === 'done') job.res(m.tsv); else job.rej(new Error(m.message));
          };
          worker.onerror = function (e) { rej(new Error(e.message || 'OCR')); };
          worker.postMessage({ type: 'init', wasm: r[2], data: data }, [r[2], data.buffer]);
        });
      });
    });
    ready.catch(function () { ready = null; if (worker) { worker.terminate(); worker = null; } });
    return ready;
  }
  function png(cv) {
    return new Promise(function (res) { cv.toBlob(function (b) { b.arrayBuffer().then(function (a) { res(new Uint8Array(a)); }); }, 'image/png'); });
  }
  // the words on a picture of a page: [{ text, conf, x0, y0, x1, y1, key }] in pixels
  function read(cv, progress) {
    var first = !ready;
    if (progress && first) progress(T(window.AndroidBridge ? 'Getting the word reader ready…' : 'Downloading the word reader (about 6 MB, only the first time)…'));
    return start().then(function () {
      if (progress) progress(T('Reading the words on this page… This can take a minute.'));
      return png(cv);
    }).then(function (bytes) {
      return new Promise(function (res, rej) { var id = next++; jobs[id] = { res: res, rej: rej }; worker.postMessage({ type: 'read', id: id, png: bytes }, [bytes.buffer]); });
    }).then(function (tsv) {
      var out = [];
      String(tsv || '').split('\n').forEach(function (row) {
        var c = row.split('\t');
        if (c[0] !== '5' || c.length < 12) return;
        var text = c.slice(11).join(' ').trim(), conf = +c[10];
        if (!text || conf < 20) return;
        var x = +c[6], y = +c[7], w = +c[8], h = +c[9];
        out.push({ text: text, conf: conf, x0: x, y0: y, x1: x + w, y1: y + h, key: c[2] + ':' + c[3] + ':' + c[4] });
      });
      return out;
    });
  }
  function median(a) { if (!a.length) return 0; var s = a.slice().sort(function (p, q) { return p - q; }); return s[Math.floor(s.length / 2)]; }
  // words grouped into lines, in points on the page as shown (sc: pixels per point), like CVPdfEdit.lines()
  function toLines(words, sc) {
    var groups = {}, order = [];
    words.forEach(function (w) { if (!groups[w.key]) { groups[w.key] = []; order.push(w.key); } groups[w.key].push(w); });
    var out = [];
    order.forEach(function (k) {
      var ws = groups[k].sort(function (a, b) { return a.x0 - b.x0; });
      var noDesc = ws.filter(function (w) { return !/[gjpqyQ,;()\[\]{}|@$]/.test(w.text); });
      var base = noDesc.length ? median(noDesc.map(function (w) { return w.y1; })) : median(ws.map(function (w) { return w.y1 - (w.y1 - w.y0) * 0.2; }));
      var tall = ws.filter(function (w) { return /[A-Z0-9bdfhklt]/.test(w.text); });
      var size = tall.length ? (base - median(tall.map(function (w) { return w.y0; }))) / 0.72 : (base - median(ws.map(function (w) { return w.y0; }))) / 0.52;
      var x0 = Math.min.apply(null, ws.map(function (w) { return w.x0; })), x1 = Math.max.apply(null, ws.map(function (w) { return w.x1; }));
      var y0 = Math.min.apply(null, ws.map(function (w) { return w.y0; }));
      if (size < 4) return;
      var l = { x: x0 / sc, y: Math.min(y0, base - size * 0.95) / sc, w: (x1 - x0) / sc, base: base / sc, size: size / sc, str: ws.map(function (w) { return w.text; }).join(' '),
        font: 'libsans', bold: false, italic: false, ocr: true };
      l.h = l.base + l.size * 0.25 - l.y;
      l.runs = [{ str: l.str, x: l.x, w: l.w, size: l.size, font: 'libsans', bold: false, italic: false, word: 'Arial' }];
      out.push(l);
    });
    out.sort(function (a, b) { return a.base - b.base || a.x - b.x; });
    out.forEach(function (l, i) { l.i = i; });
    return out;
  }
  window.CVOcr = { read: read, toLines: toLines, ready: function () { return !!ready; } };
})();
