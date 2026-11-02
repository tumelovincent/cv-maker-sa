/* CV Maker SA - the word reader's worker. It runs in a Worker made from tesseract-core-lstm.js followed by this file,
   so nothing is fetched from inside the worker: the page sends the engine and the English data. */
var OCR_M = null, OCR_API = null;
self.onmessage = function (e) {
  var m = e.data;
  if (m.type === 'init') {
    TesseractCore({ wasmBinary: m.wasm, locateFile: function (f) { return f; }, print: function () {}, printErr: function () {} }).then(function (mod) {
      OCR_M = mod;
      OCR_M.FS.writeFile('/eng.traineddata', m.data);
      OCR_API = new OCR_M.TessBaseAPI();
      if (OCR_API.Init(null, 'eng', 1) !== 0) throw new Error('The word reader could not start');
      self.postMessage({ type: 'ready' });
    }).catch(function (err) { self.postMessage({ type: 'error', message: String((err && err.message) || err) }); });
  } else if (m.type === 'read') {
    try {
      OCR_M.FS.writeFile('/input', m.png);
      OCR_API.SetImageFile(1, 0);
      OCR_API.Recognize(null);
      var tsv = OCR_API.GetTSVText(0);
      self.postMessage({ type: 'done', id: m.id, tsv: tsv });
    } catch (err) { self.postMessage({ type: 'error', id: m.id, message: String((err && err.message) || err) }); }
  }
};
