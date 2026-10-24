/* PDF tools engine (no screens here).
   Reading and drawing PDF pages uses pdf.js (loaded only when a PDF tool is opened).
   Making new PDFs uses pdf-lib: photos to PDF, merge, pages, compress, watermark, password, fill & sign.
   Everything happens on the phone - files are never uploaded. */
(function () {
  'use strict';
  // the PDF library may arrive after this file (website), so look it up each time it is used
  var L = window.PDFLib || new Proxy({}, { get: function (t, k) { return window.PDFLib[k]; } });
  var A4 = [595.28, 841.89];
  function tr(s, vars) { var A = window.App; if (A && A.T) return A.T(s, vars); Object.keys(vars || {}).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); }); return s; }
  function err(msg, code) { var e = new Error(msg); if (code) e.code = code; return e; }

  /* ---------- loading the page drawing library only when needed ---------- */
  var scripts = {};
  function loadScript(src) {
    if (!scripts[src]) {
      scripts[src] = new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.onload = res;
        s.onerror = function () { delete scripts[src]; rej(err('Could not load ' + src)); };
        document.head.appendChild(s);
      });
    }
    return scripts[src];
  }
  function pdfjs() {
    return loadScript('js/lib/pdfjs.min.js').then(function () {
      var P = window.pdfjsLib;
      if (!P.GlobalWorkerOptions.workerSrc) P.GlobalWorkerOptions.workerSrc = 'js/lib/pdfjs.worker.min.js';
      return P;
    });
  }

  /* ---------- small helpers ---------- */
  function isPdf(bytes) {
    for (var i = 0; i < Math.min(1024, bytes.length - 4); i++) if (bytes[i] === 0x25 && bytes[i + 1] === 0x50 && bytes[i + 2] === 0x44 && bytes[i + 3] === 0x46) return true;
    return false;
  }
  function readBytes(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(new Uint8Array(r.result)); };
      r.onerror = function () { rej(r.error); };
      r.readAsArrayBuffer(blob);
    });
  }
  function canvasJpg(cv, q) {
    return new Promise(function (res) {
      if (cv.toBlob) cv.toBlob(function (b) { readBytes(b).then(res); }, 'image/jpeg', q);
      else {
        var s = atob(cv.toDataURL('image/jpeg', q).split(',')[1]), u = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        res(u);
      }
    });
  }
  function dataUrlBytes(url) {
    var m = /^data:([^;,]+)?(;base64)?,(.*)$/.exec(url || '');
    if (!m) return null;
    var bin = atob(m[3]), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function loadImage(bytes, mime) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(new Blob([bytes], { type: mime || 'image/jpeg' }));
      var im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(err('image')); };
      im.src = url;
    });
  }
  var fontCache = {};
  function fontBytes(id) {
    if (!fontCache[id]) fontCache[id] = fetch((window.CVPdf ? window.CVPdf.fontBase : 'fonts/') + id + '.ttf').then(function (r) { return r.arrayBuffer(); });
    return fontCache[id];
  }
  function stampMeta(doc, title) {
    try {
      if (title) doc.setTitle(title);
      doc.setCreator('CV Maker SA');
      doc.setProducer('CV Maker SA by Tumelo Vincent Tau');
    } catch (e) { /* ignore */ }
  }
  // pdf-lib copy of a PDF we are allowed to change
  function loadEditable(bytes) {
    return L.PDFDocument.load(bytes, { updateMetadata: false }).catch(function (e) {
      if (/encrypt/i.test(String(e && e.message))) throw err(tr('This PDF is locked with a password.'), 'locked');
      throw err(tr('This file could not be opened as a PDF'), 'bad');
    });
  }

  /* ---------- reading PDFs (pdf.js) ---------- */
  function open(bytes, password) {
    return pdfjs().then(function (P) {
      var task = P.getDocument({ data: bytes.slice(0), password: password || undefined, isEvalSupported: false, useSystemFonts: true, stopAtErrors: false });
      return task.promise.catch(function (e) {
        if (e && e.name === 'PasswordException') throw err(e.code === P.PasswordResponses.INCORRECT_PASSWORD ? 'wrong-password' : 'need-password', e.code === P.PasswordResponses.INCORRECT_PASSWORD ? 'wrong-password' : 'need-password');
        throw err(tr('This file could not be opened as a PDF'), 'bad');
      });
    });
  }
  // page size in points as it is shown (rotation applied), plus the matrix that maps PDF points to that view
  function pageInfo(doc, i) {
    return doc.getPage(i + 1).then(function (page) {
      var vp = page.getViewport({ scale: 1 });
      return { w: vp.width, h: vp.height, rotate: vp.rotation, t: vp.transform.slice() };
    });
  }
  function allPageInfo(doc) {
    var out = [], ch = Promise.resolve();
    for (var i = 0; i < doc.numPages; i++) (function (k) { ch = ch.then(function () { return pageInfo(doc, k).then(function (p) { out[k] = p; }); }); })(i);
    return ch.then(function () { return out; });
  }
  var MAXPX = 12e6;
  // draws page i (0-based) onto a new canvas; width = CSS width, ratio = pixel density, extra = extra rotation
  function renderPage(doc, i, width, ratio, extra) {
    return doc.getPage(i + 1).then(function (page) {
      var rot = (page.rotate + (extra || 0)) % 360;
      var base = page.getViewport({ scale: 1, rotation: rot });
      var scale = (width / base.width) * (ratio || 1);
      if (base.width * base.height * scale * scale > MAXPX) scale = Math.sqrt(MAXPX / (base.width * base.height));
      var vp = page.getViewport({ scale: scale, rotation: rot });
      var cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.floor(vp.width)); cv.height = Math.max(1, Math.floor(vp.height));
      var g = cv.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
      return page.render({ canvasContext: g, viewport: vp }).promise.then(function () { page.cleanup(); return cv; });
    });
  }
  function thumb(doc, i, width, extra) {
    return renderPage(doc, i, width || 150, Math.min(2, window.devicePixelRatio || 1), extra).then(function (cv) { return cv.toDataURL('image/jpeg', 0.72); });
  }
  function pageCount(bytes) {
    return L.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false }).then(function (d) { return d.getPageCount(); }).catch(function () { return 0; });
  }

  /* ---------- photos to PDF ---------- */
  // one page per picture; pictures shaped like a page fill it, others sit at the top with a margin
  function placeImage(out, img, fit) {
    var land = img.width > img.height * 1.05, W = land ? A4[1] : A4[0], H = land ? A4[0] : A4[1];
    var full = fit === 'page' || (fit !== 'margin' && Math.abs((img.height / img.width) / (H / W) - 1) < 0.12);
    var M = full ? 0 : 28;
    var s = Math.min((W - 2 * M) / img.width, (H - 2 * M) / img.height);
    var w = img.width * s, h = img.height * s;
    var page = out.addPage([W, H]);
    page.drawImage(img, { x: (W - w) / 2, y: full ? (H - h) / 2 : H - M - h, width: w, height: h });
  }
  // items: [{ bytes (jpeg or png), png: bool, fit: 'auto'|'page'|'margin' }]
  function imagesToPdf(items, title) {
    return L.PDFDocument.create().then(function (out) {
      var ch = Promise.resolve();
      items.forEach(function (it) {
        ch = ch.then(function () { return it.png ? out.embedPng(it.bytes) : out.embedJpg(it.bytes); }).then(function (img) { placeImage(out, img, it.fit); });
      });
      return ch.then(function () { stampMeta(out, title); return out.save({ useObjectStreams: true }); });
    });
  }
  // any photo file -> JPEG bytes no bigger than maxSide
  function photoJpg(bytes, mime, maxSide, q) {
    return loadImage(bytes, mime).then(function (im) {
      var s = Math.min(1, (maxSide || 2200) / Math.max(im.naturalWidth, im.naturalHeight));
      var cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(im.naturalWidth * s)); cv.height = Math.max(1, Math.round(im.naturalHeight * s));
      var g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(im, 0, 0, cv.width, cv.height);
      return canvasJpg(cv, q || 0.85);
    });
  }

  /* ---------- merge ---------- */
  // list: [{ bytes, name, kind: 'pdf'|'image', mime }]
  function merge(list, title) {
    var out;
    return L.PDFDocument.create().then(function (d) {
      out = d;
      var ch = Promise.resolve();
      list.forEach(function (f) {
        ch = ch.then(function () {
          if (f.kind === 'image') return photoJpg(f.bytes, f.mime).then(function (j) { return out.embedJpg(j); }).then(function (img) { placeImage(out, img, 'auto'); });
          return L.PDFDocument.load(f.bytes, { updateMetadata: false }).catch(function (e) {
            if (/encrypt/i.test(String(e && e.message))) throw err(tr('{name} is locked with a password. Remove the password first, then try again.', { name: f.name }), 'locked');
            throw err(tr('{name} could not be opened as a PDF', { name: f.name }), 'bad');
          }).then(function (src) { return out.copyPages(src, src.getPageIndices()); }).then(function (pages) { pages.forEach(function (p) { out.addPage(p); }); });
        });
      });
      return ch;
    }).then(function () { stampMeta(out, title); return out.save({ useObjectStreams: true }); });
  }

  /* ---------- pages: reorder, rotate, delete, copy, take out ---------- */
  // order: [{ p: original page index, r: extra rotation (90/180/270) }]
  function organise(bytes, order, title) {
    return loadEditable(bytes).then(function (doc) {
      var pages = doc.getPages(), used = {}, list = [];
      var ch = Promise.resolve();
      order.forEach(function (o) {
        ch = ch.then(function () {
          if (!used[o.p]) { used[o.p] = 1; list.push(pages[o.p]); return; }
          return doc.copyPages(doc, [o.p]).then(function (c) { list.push(c[0]); });
        });
      });
      return ch.then(function () {
        for (var i = doc.getPageCount() - 1; i >= 0; i--) doc.removePage(i);
        list.forEach(function (pg, k) {
          var r = order[k].r || 0;
          if (r) pg.setRotation(L.degrees(((pg.getRotation().angle || 0) + r) % 360));
          doc.addPage(pg);
        });
        if (title) stampMeta(doc, title);
        return doc.save({ useObjectStreams: true });
      });
    });
  }
  // a new PDF with only some pages (copies, so the original stays as it is)
  function extract(bytes, indices, title) {
    return loadEditable(bytes).then(function (src) {
      return L.PDFDocument.create().then(function (out) {
        return out.copyPages(src, indices).then(function (pages) {
          pages.forEach(function (p) { out.addPage(p); });
          stampMeta(out, title);
          return out.save({ useObjectStreams: true });
        });
      });
    });
  }

  /* ---------- compress ---------- */
  var LEVELS = {
    small: { side: 1300, q: 0.55, dpi: 110, raster: true },
    medium: { side: 1800, q: 0.7, dpi: 150, raster: true },
    high: { side: 2600, q: 0.82, dpi: 0, raster: false }
  };
  function num(o) { return o && o.asNumber ? o.asNumber() : (o && o.numberValue != null ? o.numberValue : NaN); }
  // makes the pictures inside the PDF smaller; text and lines stay as they are
  async function shrinkImages(bytes, o, progress) {
    var doc = await loadEditable(bytes);
    var N = L.PDFName, ctx = doc.context;
    var jobs = ctx.enumerateIndirectObjects().filter(function (x) {
      var s = x[1];
      return s instanceof L.PDFRawStream && s.dict.get(N.of('Subtype')) === N.of('Image');
    });
    for (var k = 0; k < jobs.length; k++) {
      if (progress) progress(k / jobs.length);
      var ref = jobs[k][0], s = jobs[k][1], d = s.dict;
      try {
        if (d.get(N.of('ImageMask')) || d.get(N.of('Decode')) || d.get(N.of('Mask'))) continue;
        var w = num(d.get(N.of('Width'))), h = num(d.get(N.of('Height'))), bpc = num(d.lookup(N.of('BitsPerComponent')));
        if (!(w > 0 && h > 0)) continue;
        var filt = d.lookup(N.of('Filter')), fname = filt instanceof L.PDFArray ? (filt.size() === 1 ? filt.lookup(0) : null) : filt;
        var csObj = d.lookup(N.of('ColorSpace')), comps = 0;
        if (csObj === N.of('DeviceRGB')) comps = 3;
        else if (csObj === N.of('DeviceGray')) comps = 1;
        else if (csObj instanceof L.PDFArray && csObj.lookup(0) === N.of('ICCBased')) { var icc = csObj.lookup(1); var nn = icc && icc.dict ? num(icc.dict.get(N.of('N'))) : 0; if (nn === 1 || nn === 3) comps = nn; }
        if (!comps) continue;
        var scale = Math.min(1, o.side / Math.max(w, h));
        var cv;
        if (fname === N.of('DCTDecode')) {
          if (scale === 1 && s.contents.length < w * h * comps * 0.06) continue; // already small
          var im = await loadImage(s.contents, 'image/jpeg');
          cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(w * scale)); cv.height = Math.max(1, Math.round(h * scale));
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
        } else if (fname === N.of('FlateDecode') && bpc === 8 && !d.get(N.of('DecodeParms'))) {
          if (w * h < 250000) continue; // small pictures and icons: leave them sharp
          var raw = L.decodePDFRawStream(s).decode();
          if (raw.length < w * h * comps) continue;
          var full = document.createElement('canvas'); full.width = w; full.height = h;
          var fg = full.getContext('2d'), id = fg.createImageData(w, h), px = id.data;
          for (var p = 0, q = 0; p < w * h; p++) {
            if (comps === 3) { px[q] = raw[p * 3]; px[q + 1] = raw[p * 3 + 1]; px[q + 2] = raw[p * 3 + 2]; }
            else { px[q] = px[q + 1] = px[q + 2] = raw[p]; }
            px[q + 3] = 255; q += 4;
          }
          fg.putImageData(id, 0, 0);
          cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(w * scale)); cv.height = Math.max(1, Math.round(h * scale));
          cv.getContext('2d').drawImage(full, 0, 0, cv.width, cv.height);
        } else continue;
        var jpg = await canvasJpg(cv, o.q);
        if (jpg.length >= s.contents.length * 0.92) continue;
        var nd = ctx.obj({ Type: 'XObject', Subtype: 'Image', Width: cv.width, Height: cv.height, ColorSpace: 'DeviceRGB', BitsPerComponent: 8, Filter: 'DCTDecode' });
        var sm = d.get(N.of('SMask')); if (sm) nd.set(N.of('SMask'), sm);
        var intent = d.get(N.of('Intent')); if (intent) nd.set(N.of('Intent'), intent);
        ctx.assign(ref, L.PDFRawStream.of(nd, jpg));
      } catch (e) { /* leave this picture as it was */ }
    }
    if (progress) progress(1);
    return doc.save({ useObjectStreams: true });
  }
  // every page becomes one picture (for scans and very heavy files)
  async function rasterize(bytes, o, progress, password) {
    var src = await open(bytes, password);
    var out = await L.PDFDocument.create();
    for (var i = 0; i < src.numPages; i++) {
      if (progress) progress(i / src.numPages);
      var info = await pageInfo(src, i);
      var cv = await renderPage(src, i, info.w * o.dpi / 72, 1);
      var img = await out.embedJpg(await canvasJpg(cv, o.q));
      var pg = out.addPage([info.w, info.h]);
      pg.drawImage(img, { x: 0, y: 0, width: info.w, height: info.h });
      cv.width = cv.height = 1;
    }
    src.destroy();
    stampMeta(out);
    return out.save({ useObjectStreams: true });
  }
  // a copy without the password: every page is kept as a picture
  function unlock(bytes, password, progress) { return rasterize(bytes, { dpi: 170, q: 0.85 }, progress, password); }
  // returns { bytes, method: 'images' | 'pictures' | 'none' }
  async function compress(bytes, level, progress) {
    var o = LEVELS[level] || LEVELS.medium;
    var best = { bytes: bytes, method: 'none' };
    var a = null;
    try { a = await shrinkImages(bytes, o, function (f) { if (progress) progress(f * (o.raster ? 0.5 : 1)); }); } catch (e) { if (e.code === 'locked') throw e; }
    if (a && a.length < best.bytes.length) best = { bytes: a, method: 'images' };
    if (o.raster && best.bytes.length > bytes.length * 0.7) {
      try {
        var b = await rasterize(bytes, o, function (f) { if (progress) progress(0.5 + f * 0.5); });
        if (b.length < best.bytes.length * 0.8) best = { bytes: b, method: 'pictures' };
      } catch (e2) { if (!a) throw e2; }
    }
    if (progress) progress(1);
    return best;
  }

  /* ---------- watermark (protect an ID copy) ---------- */
  // o: { text, color: [r,g,b] 0-1, opacity, size: 'light'|'medium'|'strong' }
  async function watermark(bytes, o) {
    var doc = await loadEditable(bytes);
    doc.registerFontkit(window.fontkit);
    var font = await doc.embedFont(await fontBytes('dmsans-700'), { subset: true });
    var col = L.rgb(o.color[0], o.color[1], o.color[2]);
    var line = String(o.text || '').trim() + '      ';
    doc.getPages().forEach(function (page) {
      var mb = page.getMediaBox(), W = mb.width, H = mb.height;
      var fs = Math.max(9, Math.min(W, H) / 30);
      var unit = font.widthOfTextAtSize(line, fs) || 100;
      var diag = Math.sqrt(W * W + H * H);
      var full = new Array(Math.ceil(diag * 1.3 / unit) + 1).join(line);
      var len = font.widthOfTextAtSize(full, fs);
      var ang = 30 * Math.PI / 180, dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx;
      var step = fs * 5, n = Math.ceil(diag / step / 2) + 1, cx = mb.x + W / 2, cy = mb.y + H / 2;
      for (var k = -n; k <= n; k++) {
        var x = cx + px * k * step - dx * len / 2, y = cy + py * k * step - dy * len / 2;
        page.drawText(full, { x: x, y: y, size: fs, font: font, color: col, opacity: o.opacity, rotate: L.degrees(30) });
      }
    });
    return doc.save({ useObjectStreams: true });
  }

  /* ---------- password (AES-128, opens in every PDF reader) ---------- */
  var MD5K = (function () { var k = []; for (var i = 0; i < 64; i++) k[i] = (Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0; return k; })();
  var MD5S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  function md5(msg) {
    var n = msg.length, padLen = Math.ceil((n + 9) / 64) * 64;
    var buf = new Uint8Array(padLen); buf.set(msg); buf[n] = 0x80;
    var dv = new DataView(buf.buffer), bits = n * 8;
    dv.setUint32(padLen - 8, bits >>> 0, true); dv.setUint32(padLen - 4, Math.floor(bits / 4294967296), true);
    var a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476, M = new Uint32Array(16);
    for (var off = 0; off < padLen; off += 64) {
      for (var j = 0; j < 16; j++) M[j] = dv.getUint32(off + j * 4, true);
      var A = a0, B = b0, C = c0, D = d0;
      for (var i = 0; i < 64; i++) {
        var F, g;
        if (i < 16) { F = (B & C) | (~B & D); g = i; }
        else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
        else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
        else { F = C ^ (B | ~D); g = (7 * i) % 16; }
        F = (F + A + MD5K[i] + M[g]) >>> 0;
        A = D; D = C; C = B;
        var sh = MD5S[(i >> 4) * 4 + (i % 4)];
        B = (B + ((F << sh) | (F >>> (32 - sh)))) >>> 0;
      }
      a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
    }
    var out = new Uint8Array(16), ov = new DataView(out.buffer);
    ov.setUint32(0, a0, true); ov.setUint32(4, b0, true); ov.setUint32(8, c0, true); ov.setUint32(12, d0, true);
    return out;
  }
  function rc4(key, data) {
    var s = new Uint8Array(256), i, j = 0, t;
    for (i = 0; i < 256; i++) s[i] = i;
    for (i = 0; i < 256; i++) { j = (j + s[i] + key[i % key.length]) & 255; t = s[i]; s[i] = s[j]; s[j] = t; }
    var out = new Uint8Array(data.length); i = 0; j = 0;
    for (var k = 0; k < data.length; k++) { i = (i + 1) & 255; j = (j + s[i]) & 255; t = s[i]; s[i] = s[j]; s[j] = t; out[k] = data[k] ^ s[(s[i] + s[j]) & 255]; }
    return out;
  }
  function cat() { var n = 0, i; for (i = 0; i < arguments.length; i++) n += arguments[i].length; var o = new Uint8Array(n), p = 0; for (i = 0; i < arguments.length; i++) { o.set(arguments[i], p); p += arguments[i].length; } return o; }
  var PAD = new Uint8Array([0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41, 0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08, 0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80, 0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A]);
  function padPw(pw) {
    var b = []; for (var i = 0; i < pw.length && b.length < 32; i++) { var c = pw.charCodeAt(i); b.push(c < 256 ? c : 63); }
    var out = new Uint8Array(32); out.set(b); out.set(PAD.subarray(0, 32 - b.length), b.length); return out;
  }
  function hex(b) { var s = ''; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16); return s; }
  function rand(n) { var b = new Uint8Array(n); crypto.getRandomValues(b); return b; }
  function md5x50(h, n) { for (var i = 0; i < 50; i++) h = md5(h.subarray(0, n)); return h; }
  function rc4x20(key, data) { var out = rc4(key, data); for (var i = 1; i <= 19; i++) { var k = new Uint8Array(key.length); for (var j = 0; j < key.length; j++) k[j] = key[j] ^ i; out = rc4(k, out); } return out; }

  async function protect(bytes, userPw) {
    var N = L.PDFName;
    var first = await loadEditable(bytes);
    if (first.isEncrypted) throw err(tr('This PDF is locked with a password.'), 'locked');
    var plain = await first.save({ useObjectStreams: false, updateFieldAppearances: false });
    var doc = await L.PDFDocument.load(plain, { updateMetadata: false });
    var ctx = doc.context;
    var id = rand(16), P = -4;
    var ownerPw = hex(rand(12));
    // owner entry (algorithm 3) and file key (algorithm 2), user entry (algorithm 5)
    var okey = md5x50(md5(padPw(ownerPw)), 16);
    var O = rc4x20(okey, padPw(userPw));
    var pb = new Uint8Array(4); new DataView(pb.buffer).setInt32(0, P, true);
    var key = md5x50(md5(cat(padPw(userPw), O, pb, id)), 16);
    var U = cat(rc4x20(key, md5(cat(PAD, id))), rand(16));
    var subtle = window.crypto && window.crypto.subtle;
    if (!subtle) throw err(tr('This phone cannot add a password to a PDF.'));
    var SALT = new Uint8Array([0x73, 0x41, 0x6C, 0x54]);
    function objKey(ref) {
      var b = new Uint8Array(5), n = ref.objectNumber, g = ref.generationNumber;
      b[0] = n & 255; b[1] = (n >> 8) & 255; b[2] = (n >> 16) & 255; b[3] = g & 255; b[4] = (g >> 8) & 255;
      return md5(cat(key, b, SALT));
    }
    async function aes(k, data) {
      var iv = rand(16);
      var ck = await subtle.importKey('raw', k, { name: 'AES-CBC' }, false, ['encrypt']);
      var enc = new Uint8Array(await subtle.encrypt({ name: 'AES-CBC', iv: iv }, ck, data));
      return cat(iv, enc);
    }
    async function strings(obj, k) {
      if (obj instanceof L.PDFString || obj instanceof L.PDFHexString) return L.PDFHexString.of(hex(await aes(k, obj.asBytes())));
      if (obj instanceof L.PDFDict) {
        var ents = obj.entries();
        for (var i = 0; i < ents.length; i++) { var nv = await strings(ents[i][1], k); if (nv !== ents[i][1]) obj.set(ents[i][0], nv); }
        return obj;
      }
      if (obj instanceof L.PDFArray) {
        for (var j = 0; j < obj.size(); j++) { var v = obj.get(j), nv2 = await strings(v, k); if (nv2 !== v) obj.set(j, nv2); }
        return obj;
      }
      return obj;
    }
    var list = ctx.enumerateIndirectObjects();
    for (var i = 0; i < list.length; i++) {
      var ref = list[i][0], obj = list[i][1], k = objKey(ref);
      if (obj instanceof L.PDFRawStream) {
        var t = obj.dict.get(N.of('Type'));
        if (t === N.of('XRef')) continue;
        await strings(obj.dict, k);
        ctx.assign(ref, L.PDFRawStream.of(obj.dict, await aes(k, obj.contents)));
      } else if (obj instanceof L.PDFStream) {
        await strings(obj.dict, k);
        ctx.assign(ref, L.PDFRawStream.of(obj.dict, await aes(k, obj.getContents())));
      } else {
        await strings(obj, k);
      }
    }
    var enc = ctx.obj({
      Filter: 'Standard', V: 4, R: 4, Length: 128, P: P,
      CF: { StdCF: { AuthEvent: 'DocOpen', CFM: 'AESV2', Length: 16 } }, StmF: 'StdCF', StrF: 'StdCF'
    });
    enc.set(N.of('O'), L.PDFHexString.of(hex(O)));
    enc.set(N.of('U'), L.PDFHexString.of(hex(U)));
    ctx.trailerInfo.Encrypt = ctx.register(enc);
    ctx.trailerInfo.ID = ctx.obj([L.PDFHexString.of(hex(id)), L.PDFHexString.of(hex(id))]);
    return doc.save({ useObjectStreams: false, updateFieldAppearances: false });
  }

  /* ---------- fill & sign ---------- */
  function invert(t) {
    var a = t[0], b = t[1], c = t[2], d = t[3], e = t[4], f = t[5], det = a * d - b * c;
    return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
  }
  function apply(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
  /* marks: [{ page, type: 'text'|'check'|'cross'|'img'|'white'|'ink', x, y, w, h, size, color, text, src, pts, lw }]
     All positions are in points on the page as it is shown (top-left origin).
     info: page info from pageInfo() for every page; asc: text baseline as a share of the font size. */
  async function addMarks(bytes, marks, info, opt) {
    opt = opt || {};
    var doc = null, flat = false;
    try { doc = await loadEditable(bytes); if (doc.isEncrypted) doc = null; } catch (e) { doc = null; }
    if (!doc) {
      // locked or damaged files: rebuild from pictures of the pages, then add the marks
      flat = true;
      var src = await open(bytes, opt.password);
      doc = await L.PDFDocument.create();
      for (var pi = 0; pi < src.numPages; pi++) {
        var inf = info[pi], cv = await renderPage(src, pi, inf.w * 200 / 72, 1);
        var img = await doc.embedJpg(await canvasJpg(cv, 0.85));
        doc.addPage([inf.w, inf.h]).drawImage(img, { x: 0, y: 0, width: inf.w, height: inf.h });
        info[pi] = { w: inf.w, h: inf.h, rotate: 0, t: [1, 0, 0, -1, 0, inf.h] };
      }
      src.destroy();
    }
    doc.registerFontkit(window.fontkit);
    var fonts = {};
    async function font(w) { if (!fonts[w]) fonts[w] = await doc.embedFont(await fontBytes('roboto-' + w), { subset: true }); return fonts[w]; }
    var pages = doc.getPages();
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i], page = pages[m.page], pinf = info[m.page];
      if (!page || !pinf) continue;
      var inv = invert(pinf.t), rot = L.degrees(pinf.rotate || 0);
      var c = hexColor(m.color || '#1B3C8C');
      var P = function (x, y) { return apply(inv, x, y); };
      if (m.type === 'text') {
        var f = await font(m.bold ? 700 : 400), lines = String(m.text || '').split('\n'), lh = m.size * 1.15;
        for (var li = 0; li < lines.length; li++) {
          if (!lines[li]) continue;
          var o = P(m.x, m.y + li * lh + m.size * (opt.asc || 0.92));
          page.drawText(lines[li], { x: o[0], y: o[1], size: m.size, font: f, color: c, rotate: rot });
        }
      } else if (m.type === 'img') {
        var data = dataUrlBytes(m.src);
        if (!data) continue;
        var emb = /^data:image\/png/.test(m.src) ? await doc.embedPng(data) : await doc.embedJpg(data);
        var bl = P(m.x, m.y + m.h);
        page.drawImage(emb, { x: bl[0], y: bl[1], width: m.w, height: m.h, rotate: rot });
      } else if (m.type === 'white') {
        var b2 = P(m.x, m.y + m.h);
        page.drawRectangle({ x: b2[0], y: b2[1], width: m.w, height: m.h, color: L.rgb(1, 1, 1), rotate: rot });
      } else {
        var pts = m.type === 'check' ? [[[0.1, 0.55], [0.38, 0.84], [0.92, 0.14]]] :
          m.type === 'cross' ? [[[0.14, 0.14], [0.86, 0.86]], [[0.86, 0.14], [0.14, 0.86]]] : [m.pts];
        var lw = m.type === 'ink' ? (m.lw || 1.6) : Math.max(1, Math.min(m.w, m.h) * 0.13);
        pts.forEach(function (stroke) {
          var d = '';
          stroke.forEach(function (p, k) {
            var x = m.type === 'ink' ? p[0] : m.x + p[0] * m.w, y = m.type === 'ink' ? p[1] : m.y + p[1] * m.h;
            var q = P(x, y);
            d += (k ? ' L ' : 'M ') + q[0].toFixed(2) + ' ' + (-q[1]).toFixed(2);
          });
          if (stroke.length === 1) { var q1 = P(stroke[0][0], stroke[0][1]); d += ' L ' + (q1[0] + 0.1).toFixed(2) + ' ' + (-q1[1]).toFixed(2); }
          page.drawSvgPath(d, { x: 0, y: 0, borderColor: c, borderWidth: lw, borderLineCap: L.LineCapStyle.Round });
        });
      }
    }
    if (opt.title) stampMeta(doc, opt.title);
    var out = await doc.save({ useObjectStreams: true });
    return { bytes: out, flat: flat };
  }
  function hexColor(h) {
    var m = /^#?([0-9a-f]{6})$/i.exec(h) || [0, '1B3C8C'], n = parseInt(m[1], 16);
    return L.rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  }

  /* ---------- PDF to photos ---------- */
  // returns [{ bytes, page }] JPEG pictures, width in pixels
  async function toPhotos(doc, pages, width, progress) {
    var out = [];
    for (var k = 0; k < pages.length; k++) {
      if (progress) progress(k / pages.length);
      var info = await pageInfo(doc, pages[k]);
      var w = info.w > info.h ? Math.round(width * 1.414) : width;
      var cv = await renderPage(doc, pages[k], w, 1);
      out.push({ bytes: await canvasJpg(cv, 0.88), page: pages[k] });
      cv.width = cv.height = 1;
    }
    if (progress) progress(1);
    return out;
  }

  window.CVPdfTools = {
    pdfjs: pdfjs, loadScript: loadScript, isPdf: isPdf, readBytes: readBytes, canvasJpg: canvasJpg, loadImage: loadImage,
    open: open, pageInfo: pageInfo, allPageInfo: allPageInfo, renderPage: renderPage, thumb: thumb, pageCount: pageCount,
    imagesToPdf: imagesToPdf, photoJpg: photoJpg, merge: merge, organise: organise, extract: extract,
    compress: compress, unlock: unlock, watermark: watermark, protect: protect, addMarks: addMarks, toPhotos: toPhotos,
    md5: md5, rc4: rc4, A4: A4
  };
  if (window.CVLibs) window.CVLibs.wrap(window.CVPdfTools, ['pageCount', 'imagesToPdf', 'merge', 'organise', 'extract', 'compress', 'unlock',
    'watermark', 'protect', 'addMarks', 'toPhotos'], 'pdf');
})();
