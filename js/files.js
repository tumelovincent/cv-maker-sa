/* Supporting documents: on-phone file store (IndexedDB), photo/PDF import, and the "CV + documents" PDF */
(function () {
  'use strict';
  function tr(s, vars) { var A = window.App; if (A && A.T) return A.T(s, vars); Object.keys(vars || {}).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); }); return s; }

  /* ---------- file store ---------- */
  var DBNAME = 'cvmaker-files', STORE = 'files';
  var dbp = null, memory = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise(function (res, rej) {
      if (!window.indexedDB) { rej(new Error('no indexedDB')); return; }
      var rq = indexedDB.open(DBNAME, 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore(STORE); };
      rq.onsuccess = function () { res(rq.result); };
      rq.onerror = function () { rej(rq.error || new Error('indexedDB open failed')); };
    }).catch(function (e) {
      memory = memory || {};
      Store.persistent = false;
      return null;
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      if (!d) return fn(null);
      return new Promise(function (res, rej) {
        var t = d.transaction(STORE, mode), st = t.objectStore(STORE), out;
        var r = fn(st);
        if (r) r.onsuccess = function () { out = r.result; };
        t.oncomplete = function () { res(out); };
        t.onerror = t.onabort = function () { rej(t.error || new Error('storage error')); };
      });
    });
  }
  var Store = {
    persistent: true,
    put: function (id, bytes) {
      return tx('readwrite', function (st) { if (!st) { memory[id] = bytes; return null; } return st.put(bytes, id); });
    },
    get: function (id) {
      return tx('readonly', function (st) { if (!st) return memory[id]; return st.get(id); }).then(function (v) {
        if (!v) return null;
        return v instanceof Uint8Array ? v : new Uint8Array(v);
      });
    },
    del: function (id) {
      return tx('readwrite', function (st) { if (!st) { delete memory[id]; return null; } return st.delete(id); });
    },
    keys: function () {
      return tx('readonly', function (st) { if (!st) return Object.keys(memory); return st.getAllKeys ? st.getAllKeys() : null; })
        .then(function (k) { return k || (memory ? Object.keys(memory) : []); });
    }
  };

  /* ---------- helpers ---------- */
  function uid() { return 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function readBytes(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(new Uint8Array(r.result)); };
      r.onerror = function () { rej(r.error); };
      r.readAsArrayBuffer(blob);
    });
  }
  function loadImage(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error('image')); };
      im.src = src;
    });
  }
  function bytesURL(bytes, mime) { return URL.createObjectURL(new Blob([bytes], { type: mime || 'image/jpeg' })); }
  function canvasBytes(cv, q) {
    return new Promise(function (res) {
      if (cv.toBlob) cv.toBlob(function (b) { readBytes(b).then(res); }, 'image/jpeg', q);
      else {
        var s = atob(cv.toDataURL('image/jpeg', q).split(',')[1]), u = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
        res(u);
      }
    });
  }
  // grey "scanned document" look: greyscale, paper pushed to white, ink darkened
  function enhance(ctx, w, h) {
    var img = ctx.getImageData(0, 0, w, h), d = img.data, n = w * h, hist = new Uint32Array(256), i;
    for (i = 0; i < d.length; i += 4) { var g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0; d[i] = g; hist[g]++; }
    function pct(p) { var c = 0, t = n * p; for (var v = 0; v < 256; v++) { c += hist[v]; if (c >= t) return v; } return 255; }
    var lo = pct(0.02), hi = Math.max(lo + 30, pct(0.55) - 6);
    var lut = new Uint8ClampedArray(256);
    for (var v = 0; v < 256; v++) { var x = (v - lo) / (hi - lo); x = x < 0 ? 0 : (x > 1 ? 1 : x); lut[v] = Math.round(255 * Math.pow(x, 1.35)); }
    for (i = 0; i < d.length; i += 4) { var o = lut[d[i]]; d[i] = d[i + 1] = d[i + 2] = o; }
    ctx.putImageData(img, 0, 0);
  }
  // draw bytes onto a canvas, optionally rotated (deg), limited to maxSide, optionally enhanced
  function render(bytes, opt) {
    opt = opt || {};
    var url = bytesURL(bytes, opt.mime);
    return loadImage(url).then(function (im) {
      URL.revokeObjectURL(url);
      var rot = ((opt.rotate || 0) % 360 + 360) % 360, sx = 0, sy = 0, sw = im.naturalWidth, sh = im.naturalHeight;
      if (opt.crop) {
        sx = Math.round(opt.crop.x * im.naturalWidth); sy = Math.round(opt.crop.y * im.naturalHeight);
        sw = Math.max(1, Math.round(opt.crop.w * im.naturalWidth)); sh = Math.max(1, Math.round(opt.crop.h * im.naturalHeight));
      }
      var scale = Math.min(1, (opt.maxSide || 99999) / Math.max(sw, sh));
      var w = Math.max(1, Math.round(sw * scale)), h = Math.max(1, Math.round(sh * scale));
      var cv = document.createElement('canvas');
      cv.width = rot % 180 ? h : w; cv.height = rot % 180 ? w : h;
      var g = cv.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
      g.translate(cv.width / 2, cv.height / 2); g.rotate(rot * Math.PI / 180);
      g.drawImage(im, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
      g.setTransform(1, 0, 0, 1, 0, 0);
      if (opt.enhance) enhance(g, cv.width, cv.height);
      return cv;
    });
  }
  function thumbOf(cv) {
    var s = Math.min(1, 240 / Math.max(cv.width, cv.height));
    var t = document.createElement('canvas');
    t.width = Math.max(1, Math.round(cv.width * s)); t.height = Math.max(1, Math.round(cv.height * s));
    t.getContext('2d').drawImage(cv, 0, 0, t.width, t.height);
    return t.toDataURL('image/jpeg', 0.7);
  }

  var GUESS = [
    [/\b(id|identity|smart.?card|green.?book)\b/i, 'Certified copy of ID'],
    [/matric|nsc|grade.?12|senior.?cert/i, 'Matric certificate (NSC)'],
    [/transcript|academic.?record|statement.?of.?results|results/i, 'Academic record'],
    [/degree|bachelor|honours|masters/i, 'Degree certificate'],
    [/diploma/i, 'Diploma certificate'],
    [/\bn[1-6]\b|nated|ncv|higher.?cert/i, 'Higher / N certificate'],
    [/licen[cs]e|driver/i, "Driver's licence"],
    [/address|municipal|utility|bill/i, 'Proof of address'],
    [/reference|testimonial|recommend/i, 'Reference letter'],
    [/police|clearance/i, 'Police clearance certificate']
  ];
  function guessType(name) {
    for (var i = 0; i < GUESS.length; i++) if (GUESS[i][0].test(name || '')) return GUESS[i][1];
    return '';
  }

  // turn a picked File into a stored document record
  function importFile(file) {
    var name = file.name || 'document';
    var isPdf = /pdf/i.test(file.type) || /\.pdf$/i.test(name);
    return readBytes(file).then(function (bytes) {
      if (isPdf) {
        if (bytes.length > 25 * 1024 * 1024) throw new Error(tr('{name} is larger than 25 MB', { name: name }));
        return PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false }).then(function (pdf) {
          var id = uid();
          return Store.put(id, bytes).then(function () {
            return { id: uid(), fileId: id, kind: 'pdf', type: guessType(name), name: name, pages: pdf.getPageCount(),
              size: bytes.length, locked: !!pdf.isEncrypted, enhance: false, added: Date.now() };
          });
        }, function () { throw new Error(tr('{name} could not be opened as a PDF', { name: name })); });
      }
      // photos: straighten size, re-save as JPEG (keeps files small)
      return importPart(bytes, file.type, name).then(function (part) {
        return { id: uid(), fileId: part.fileId, kind: 'image', type: guessType(name), name: name, pages: 1, parts: [part],
          w: part.w, h: part.h, size: part.size, thumb: part.thumb, enhance: false, added: Date.now() };
      });
    });
  }
  function importPart(bytes, mime, name) {
    return render(bytes, { mime: mime || 'image/jpeg', maxSide: 2000 }).then(function (cv) {
      return canvasBytes(cv, 0.85).then(function (jpg) {
        var id = uid();
        return Store.put(id, jpg).then(function () { return { fileId: id, w: cv.width, h: cv.height, size: jpg.length, thumb: thumbOf(cv) }; });
      });
    }, function () { throw new Error(tr('{name} could not be opened. Choose a JPG, PNG or PDF file.', { name: name || tr('This file') })); });
  }
  function partsOf(doc) {
    if (doc.kind !== 'image') return [];
    if (!Array.isArray(doc.parts) || !doc.parts.length) doc.parts = [{ fileId: doc.fileId, w: doc.w, h: doc.h, size: doc.size, thumb: doc.thumb }];
    return doc.parts;
  }
  // keep the old single-page fields in step with page 1 (older app versions read them)
  function sync(doc) {
    var ps = partsOf(doc);
    if (!ps.length) return doc;
    doc.fileId = ps[0].fileId; doc.w = ps[0].w; doc.h = ps[0].h; doc.thumb = ps[0].thumb;
    doc.pages = ps.length; doc.size = ps.reduce(function (t, p) { return t + (p.size || 0); }, 0);
    return doc;
  }
  function fileIds(doc) { return doc.kind === 'image' ? partsOf(doc).map(function (p) { return p.fileId; }) : [doc.fileId]; }
  // add another photographed page to the same document (e.g. page 2 of an academic record)
  function addPage(doc, file) {
    return readBytes(file).then(function (bytes) { return importPart(bytes, file.type, file.name); }).then(function (part) {
      if (doc.enhance) return Store.get(part.fileId).then(function (b) { return render(b, { maxSide: 480, enhance: true }); }).then(function (cv) { part.thumb = thumbOf(cv); return part; });
      return part;
    }).then(function (part) { partsOf(doc).push(part); return sync(doc); });
  }
  function removePage(doc, j) {
    var ps = partsOf(doc), gone = ps.splice(j, 1)[0];
    sync(doc);
    return gone ? gone.fileId : null;
  }
  function movePage(doc, j, dir) {
    var ps = partsOf(doc), k = j + dir;
    if (k < 0 || k >= ps.length) return;
    var t = ps[j]; ps[j] = ps[k]; ps[k] = t; sync(doc);
  }
  function rewrite(doc, j, opt) {
    var part = partsOf(doc)[j || 0];
    return Store.get(part.fileId).then(function (bytes) {
      return render(bytes, opt).then(function (cv) {
        return canvasBytes(cv, 0.9).then(function (jpg) {
          return Store.put(part.fileId, jpg).then(function () {
            part.w = cv.width; part.h = cv.height; part.size = jpg.length;
            return render(jpg, { maxSide: 480, enhance: doc.enhance }).then(function (t) { part.thumb = thumbOf(t); sync(doc); return doc; });
          });
        });
      });
    });
  }
  // rotate one page 90 degrees clockwise (replaces the stored file)
  function rotate(doc, j) { return rewrite(doc, j, { rotate: 90 }); }
  // crop one page; r = {x, y, w, h} as fractions of the picture
  function crop(doc, j, r) { return rewrite(doc, j, { crop: r }); }
  function refreshThumb(doc) {
    var chain = Promise.resolve();
    partsOf(doc).forEach(function (part) {
      chain = chain.then(function () {
        return Store.get(part.fileId).then(function (bytes) {
          return render(bytes, { maxSide: 480, enhance: doc.enhance }).then(function (cv) { part.thumb = thumbOf(cv); });
        });
      });
    });
    return chain.then(function () { sync(doc); return doc; });
  }
  // image bytes of page j as they will go into the PDF
  function exportImage(doc, small, j) {
    var part = partsOf(doc)[j || 0] || {};
    return Store.get(part.fileId).then(function (bytes) {
      if (!bytes) throw new Error(tr('A document file is missing: {name}', { name: doc.type || doc.name }));
      if (!small && !doc.enhance) return bytes;
      return render(bytes, { maxSide: small ? 1400 : 2000, enhance: doc.enhance }).then(function (cv) { return canvasBytes(cv, small ? 0.62 : 0.85); });
    });
  }
  // finds the document (the bright paper or card) in a photo and suggests a crop box
  function detectCrop(doc, j) {
    var part = partsOf(doc)[j || 0];
    return Store.get(part.fileId).then(function (bytes) { return render(bytes, { maxSide: 180 }); }).then(function (cv) {
      var w = cv.width, h = cv.height, d = cv.getContext('2d').getImageData(0, 0, w, h).data, n = w * h;
      var g = new Uint8Array(n), hist = new Uint32Array(256), i;
      for (i = 0; i < n; i++) { var v = (d[i * 4] * 299 + d[i * 4 + 1] * 587 + d[i * 4 + 2] * 114) / 1000 | 0; g[i] = v; hist[v]++; }
      // Otsu threshold between paper and background
      var sum = 0; for (i = 0; i < 256; i++) sum += i * hist[i];
      var sB = 0, wB = 0, best = 0, th = 128;
      for (i = 0; i < 256; i++) {
        wB += hist[i]; if (!wB) continue; var wF = n - wB; if (!wF) break;
        sB += i * hist[i]; var mB = sB / wB, mF = (sum - sB) / wF, between = wB * wF * (mB - mF) * (mB - mF);
        if (between > best) { best = between; th = i; }
      }
      var seen = new Uint8Array(n), bestBox = null, bestArea = 0, stack = new Int32Array(n);
      for (i = 0; i < n; i++) {
        if (seen[i] || g[i] <= th) continue;
        var top = 0, area = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
        stack[top++] = i; seen[i] = 1;
        while (top) {
          var q = stack[--top], x = q % w, y = (q - x) / w; area++;
          if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          var nb = [q - 1, q + 1, q - w, q + w];
          for (var k = 0; k < 4; k++) {
            var r = nb[k];
            if (r < 0 || r >= n || seen[r] || g[r] <= th) continue;
            if ((k === 0 && x === 0) || (k === 1 && x === w - 1)) continue;
            seen[r] = 1; stack[top++] = r;
          }
        }
        if (area > bestArea) { bestArea = area; bestBox = [x0, y0, x1, y1]; }
      }
      if (!bestBox || bestArea < n * 0.08) return null;
      var m = 0.015, bx = Math.max(0, bestBox[0] / w - m), by = Math.max(0, bestBox[1] / h - m);
      var bw = Math.min(1, (bestBox[2] + 1) / w + m) - bx, bh = Math.min(1, (bestBox[3] + 1) / h + m) - by;
      if (bw > 0.96 && bh > 0.96) return null;
      return { x: bx, y: by, w: bw, h: bh };
    });
  }

  function letter(i) {
    var s = '';
    i = i + 1;
    while (i > 0) { var r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); }
    return s;
  }
  function label(doc, i) { return 'Annexure ' + letter(i) + ': ' + (doc.type || 'Supporting document'); }

  var fontCache = null;
  function labelFont() {
    if (!fontCache) fontCache = fetch((window.CVPdf ? window.CVPdf.fontBase : 'fonts/') + 'dmsans-400.ttf').then(function (r) { return r.arrayBuffer(); });
    return fontCache;
  }

  /* Build one PDF: the CV (bytes, optional) followed by every document as an annexure.
     opts: { labels: bool, small: bool, title, author } */
  function bundle(cvBytes, docs, opts) {
    opts = opts || {};
    var L = window.PDFLib, out, font;
    var bases = !cvBytes ? [] : (Array.isArray(cvBytes) ? cvBytes : [cvBytes]);
    return (bases.length === 1 ? L.PDFDocument.load(bases[0]) : L.PDFDocument.create()).then(function (d) {
      out = d;
      if (bases.length < 2) return;
      var ch = Promise.resolve();
      bases.forEach(function (b) {
        ch = ch.then(function () { return L.PDFDocument.load(b); }).then(function (src) { return out.copyPages(src, src.getPageIndices()); })
          .then(function (pages) { pages.forEach(function (p) { out.addPage(p); }); });
      });
      return ch;
    }).then(function () {
      out.registerFontkit(window.fontkit);
      return labelFont().then(function (fb) { return out.embedFont(fb, { subset: true }); });
    }).then(function (f) {
      font = f;
      var chain = Promise.resolve();
      docs.forEach(function (doc, i) {
        chain = chain.then(function () { return addDoc(doc, i); });
      });
      return chain;
    }).then(function () {
      if (opts.title) out.setTitle(opts.title);
      if (opts.author) out.setAuthor(opts.author);
      out.setCreator('CV Maker SA');
      out.setProducer('CV Maker SA by Tumelo Vincent Tau');
      return out.save({ useObjectStreams: true });
    });

    function addDoc(doc, i) {
      if (doc.kind === 'pdf') {
        return Store.get(doc.fileId).then(function (bytes) {
          if (!bytes) throw new Error(tr('A document file is missing: {name}', { name: doc.type || doc.name }));
          return L.PDFDocument.load(bytes, { ignoreEncryption: true });
        }).then(function (src) {
          return out.copyPages(src, src.getPageIndices());
        }).then(function (pages) {
          pages.forEach(function (p, k) {
            out.addPage(p);
            if (opts.labels && k === 0) stamp(p, label(doc, i));
          });
        });
      }
      var ch = Promise.resolve();
      partsOf(doc).forEach(function (part, j) { ch = ch.then(function () { return addPhotoPage(doc, i, j); }); });
      return ch;
    }
    function addPhotoPage(doc, i, j) {
      return exportImage(doc, opts.small, j).then(function (jpg) { return out.embedJpg(jpg); }).then(function (img) {
        var lab = opts.labels && j === 0;
        var land = img.width > img.height * 1.05;
        var W = land ? 841.89 : 595.28, H = land ? 595.28 : 841.89, M = 32, top = lab ? 30 : 0;
        var page = out.addPage([W, H]);
        var s = Math.min((W - 2 * M) / img.width, (H - 2 * M - top) / img.height);
        var w = img.width * s, h = img.height * s;
        page.drawImage(img, { x: (W - w) / 2, y: M + (H - 2 * M - top - h) / 2, width: w, height: h });
        if (lab) {
          page.drawText(label(doc, i), { x: M, y: H - M - 10, size: 10, font: font, color: L.rgb(0.25, 0.29, 0.27) });
          page.drawRectangle({ x: M, y: H - M - 18, width: W - 2 * M, height: 0.6, color: L.rgb(0.8, 0.83, 0.82) });
        }
      });
    }
    // small label in a white box at the top-left of the first page of a PDF document
    function stamp(page, text) {
      var sz = page.getSize(), size = 9, tw = font.widthOfTextAtSize(text, size);
      var x = 14, y = sz.height - 22;
      page.drawRectangle({ x: x - 5, y: y - 5, width: tw + 10, height: size + 9, color: L.rgb(1, 1, 1), opacity: 0.92 });
      page.drawText(text, { x: x, y: y, size: size, font: font, color: L.rgb(0.25, 0.29, 0.27) });
    }
  }

  function fmtSize(n) {
    if (n == null) return '';
    if (n < 1024 * 1024) return Math.max(1, Math.round(n / 1024)) + ' KB';
    return (n / 1024 / 1024).toFixed(1) + ' MB';
  }
  function estimate(docs, small) {
    return docs.reduce(function (t, d) {
      var sz = d.kind === 'pdf' ? d.size : partsOf(d).reduce(function (a, p) { return a + (p.size || 0); }, 0);
      return t + (d.kind === 'pdf' ? sz : Math.round(sz * (small ? 0.4 : (d.enhance ? 0.9 : 1))));
    }, 0);
  }

  window.CVFiles = {
    store: Store, importFile: importFile, rotate: rotate, crop: crop, detectCrop: detectCrop, addPage: addPage, removePage: removePage,
    movePage: movePage, partsOf: partsOf, fileIds: fileIds, sync: sync, refreshThumb: refreshThumb, bundle: bundle, letter: letter, label: label,
    fmtSize: fmtSize, estimate: estimate, bytesURL: bytesURL, exportImage: exportImage, ready: db
  };
})();
