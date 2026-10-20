/* Scan to PDF and Photos to PDF: live camera that finds the page edges, ID card (both sides on one page),
   corner adjustment, scanner looks, and the "check your scan" screen. */
(function () {
  'use strict';
  var A = window.App, PT = window.CVPdfTools, PDF = A.PDF;
  var $ = A.$, esc = A.esc, T = A.T, S = A.S, ic = PDF.ic;

  /* ================= image maths ================= */
  // finds the page or card in a photo; returns 4 corners (0-1) TL, TR, BR, BL, or null.
  // First it compares every spot with the colour of the table around the edges of the photo (finds dark headers too);
  // if that does not give a clear shape it looks for the brightest area instead.
  function findQuad(src, sw, sh) {
    var s = 220 / Math.max(sw, sh), w = Math.max(8, Math.round(sw * s)), h = Math.max(8, Math.round(sh * s)), n = w * h;
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    var g = cv.getContext('2d'); g.drawImage(src, 0, 0, w, h);
    var d = g.getImageData(0, 0, w, h).data, i, x, y;
    // light blur (3x3) on each colour so print inside the page does not break it up
    var R = new Float32Array(n), G2 = new Float32Array(n), B = new Float32Array(n);
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var tr = 0, tg = 0, tb = 0, c = 0;
      for (var yy = Math.max(0, y - 1); yy <= Math.min(h - 1, y + 1); yy++) for (var xx = Math.max(0, x - 1); xx <= Math.min(w - 1, x + 1); xx++) { var k = (yy * w + xx) * 4; tr += d[k]; tg += d[k + 1]; tb += d[k + 2]; c++; }
      R[y * w + x] = tr / c; G2[y * w + x] = tg / c; B[y * w + x] = tb / c;
    }
    function shapeFrom(mask) {
      var seen = new Uint8Array(n), stack = new Int32Array(n), bestArea = 0, bestPix = null;
      for (var a = 0; a < n; a++) {
        if (seen[a] || !mask[a]) continue;
        var top = 0, area = 0, pix = [];
        stack[top++] = a; seen[a] = 1;
        while (top) {
          var q = stack[--top], qx = q % w; area++; pix.push(q);
          if (qx > 0 && !seen[q - 1] && mask[q - 1]) { seen[q - 1] = 1; stack[top++] = q - 1; }
          if (qx < w - 1 && !seen[q + 1] && mask[q + 1]) { seen[q + 1] = 1; stack[top++] = q + 1; }
          if (q >= w && !seen[q - w] && mask[q - w]) { seen[q - w] = 1; stack[top++] = q - w; }
          if (q < n - w && !seen[q + w] && mask[q + w]) { seen[q + w] = 1; stack[top++] = q + w; }
        }
        if (area > bestArea) { bestArea = area; bestPix = pix; }
      }
      if (!bestPix || bestArea < n * 0.06 || bestArea > n * 0.95) return null;
      var tl = [0, 0, 1e9], trc = [0, 0, -1e9], br = [0, 0, -1e9], blc = [0, 0, 1e9];
      for (var j = 0; j < bestPix.length; j++) {
        var p = bestPix[j], px = p % w, py = (p - px) / w;
        if (px + py < tl[2]) tl = [px, py, px + py];
        if (px + py > br[2]) br = [px, py, px + py];
        if (px - py > trc[2]) trc = [px, py, px - py];
        if (px - py < blc[2]) blc = [px, py, px - py];
      }
      var quad = [tl, trc, br, blc].map(function (c2) { return [c2[0] + 0.5, c2[1] + 0.5]; });
      var qa = Math.abs(polyArea(quad));
      if (qa < n * 0.05 || bestArea / qa < 0.78) return null;
      return quad;
    }
    // 1) differs from the table colour (taken from a strip around the edges)
    var edge = [], m = Math.max(2, Math.round(Math.min(w, h) * 0.04));
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) if (x < m || y < m || x >= w - m || y >= h - m) edge.push(y * w + x);
    function med(arr) { var a = arr.slice().sort(function (p, q) { return p - q; }); return a[a.length >> 1]; }
    var er = [], eg = [], eb = [];
    edge.forEach(function (k) { er.push(R[k]); eg.push(G2[k]); eb.push(B[k]); });
    var mr = med(er), mg = med(eg), mb = med(eb);
    var ed = edge.map(function (k) { var a = R[k] - mr, b = G2[k] - mg, c2 = B[k] - mb; return Math.sqrt(a * a + b * b + c2 * c2); }).sort(function (p, q) { return p - q; });
    var thr = Math.max(38, ed[Math.floor(ed.length * 0.9)] * 1.6);
    var mask = new Uint8Array(n);
    for (i = 0; i < n; i++) { var a1 = R[i] - mr, b1 = G2[i] - mg, c1 = B[i] - mb; mask[i] = Math.sqrt(a1 * a1 + b1 * b1 + c1 * c1) > thr ? 1 : 0; }
    var quad = shapeFrom(mask);
    // 2) the brightest area (Otsu threshold on brightness)
    if (!quad) {
      var lum = new Uint8Array(n), hist = new Uint32Array(256);
      for (i = 0; i < n; i++) { lum[i] = (R[i] * 299 + G2[i] * 587 + B[i] * 114) / 1000 | 0; hist[lum[i]]++; }
      var sum = 0; for (i = 0; i < 256; i++) sum += i * hist[i];
      var sB = 0, wB = 0, best = 0, th = 128;
      for (i = 0; i < 256; i++) {
        wB += hist[i]; if (!wB) continue; var wF = n - wB; if (!wF) break;
        sB += i * hist[i]; var mB = sB / wB, mF = (sum - sB) / wF, between = wB * wF * (mB - mF) * (mB - mF);
        if (between > best) { best = between; th = i; }
      }
      for (i = 0; i < n; i++) mask[i] = lum[i] > th ? 1 : 0;
      quad = shapeFrom(mask);
    }
    if (!quad) return null;
    var cx = (quad[0][0] + quad[1][0] + quad[2][0] + quad[3][0]) / 4, cy = (quad[0][1] + quad[1][1] + quad[2][1] + quad[3][1]) / 4;
    return quad.map(function (c3) {
      var x2 = cx + (c3[0] - cx) * 1.012, y2 = cy + (c3[1] - cy) * 1.012;
      return [Math.max(0, Math.min(1, x2 / w)), Math.max(0, Math.min(1, y2 / h))];
    });
  }
  function polyArea(q) { var a = 0; for (var i = 0; i < q.length; i++) { var j = (i + 1) % q.length; a += q[i][0] * q[j][1] - q[j][0] * q[i][1]; } return a / 2; }
  function dist(a, b) { return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])); }
  // square (0..1) -> quad (Heckbert)
  function sq2quad(q) {
    var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
    var dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
    var den = dx1 * dy2 - dx2 * dy1, a13 = 0, a23 = 0;
    if (Math.abs(den) > 1e-9) { a13 = (dx3 * dy2 - dx2 * dy3) / den; a23 = (dx1 * dy3 - dx3 * dy1) / den; }
    return { a11: x1 - x0 + a13 * x1, a21: x3 - x0 + a23 * x3, a31: x0, a12: y1 - y0 + a13 * y1, a22: y3 - y0 + a23 * y3, a32: y0, a13: a13, a23: a23 };
  }
  // straightens the part of the picture inside the quad into a flat rectangle
  function warp(img, iw, ih, quad, maxSide, aspect) {
    var s = Math.min(1, 2600 / Math.max(iw, ih)), sw = Math.round(iw * s), sh = Math.round(ih * s);
    var sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
    var sg = sc.getContext('2d'); sg.drawImage(img, 0, 0, sw, sh);
    var sd = sg.getImageData(0, 0, sw, sh).data;
    var q = quad.map(function (p) { return [p[0] * sw, p[1] * sh]; });
    var W = (dist(q[0], q[1]) + dist(q[3], q[2])) / 2, H = (dist(q[0], q[3]) + dist(q[1], q[2])) / 2;
    if (aspect) { if (W >= H) H = W / aspect; else W = H / aspect; }
    var k = Math.min(1, maxSide / Math.max(W, H)), ow = Math.max(2, Math.round(W * k)), oh = Math.max(2, Math.round(H * k));
    var m = sq2quad(q), out = document.createElement('canvas'); out.width = ow; out.height = oh;
    var og = out.getContext('2d'), od = og.createImageData(ow, oh), o = od.data, sw4 = sw * 4;
    for (var y = 0; y < oh; y++) {
      var v = (y + 0.5) / oh;
      for (var x = 0; x < ow; x++) {
        var u = (x + 0.5) / ow, den = m.a13 * u + m.a23 * v + 1;
        var X = (m.a11 * u + m.a21 * v + m.a31) / den - 0.5, Y = (m.a12 * u + m.a22 * v + m.a32) / den - 0.5;
        if (X < 0) X = 0; if (Y < 0) Y = 0; if (X > sw - 1.001) X = sw - 1.001; if (Y > sh - 1.001) Y = sh - 1.001;
        var x0 = X | 0, y0 = Y | 0, fx = X - x0, fy = Y - y0, i00 = y0 * sw4 + x0 * 4, i10 = i00 + 4, i01 = i00 + sw4, i11 = i01 + 4, oi = (y * ow + x) * 4;
        for (var c = 0; c < 3; c++) {
          var a = sd[i00 + c] + (sd[i10 + c] - sd[i00 + c]) * fx, b = sd[i01 + c] + (sd[i11 + c] - sd[i01 + c]) * fx;
          o[oi + c] = a + (b - a) * fy;
        }
        o[oi + 3] = 255;
      }
    }
    og.putImageData(od, 0, 0);
    return out;
  }
  function rotateCanvas(cv, deg) {
    deg = ((deg || 0) % 360 + 360) % 360;
    if (!deg) return cv;
    var out = document.createElement('canvas');
    out.width = deg % 180 ? cv.height : cv.width; out.height = deg % 180 ? cv.width : cv.height;
    var g = out.getContext('2d'); g.translate(out.width / 2, out.height / 2); g.rotate(deg * Math.PI / 180); g.drawImage(cv, -cv.width / 2, -cv.height / 2);
    return out;
  }
  function pct(hist, n, p) { var c = 0, t = n * p; for (var v = 0; v < 256; v++) { c += hist[v]; if (c >= t) return v; } return 255; }
  // background brightness map (text removed) used to even out shadows
  function background(lum, w, h) {
    var bw = Math.max(2, Math.ceil(w / 14)), bh = Math.max(2, Math.ceil(h / 14)), small = new Float32Array(bw * bh), x, y;
    for (y = 0; y < bh; y++) for (x = 0; x < bw; x++) {
      var mx = 0;
      for (var yy = y * 14; yy < Math.min(h, y * 14 + 14); yy += 2) for (var xx = x * 14; xx < Math.min(w, x * 14 + 14); xx += 2) { var v = lum[yy * w + xx]; if (v > mx) mx = v; }
      small[y * bw + x] = mx;
    }
    for (var pass = 0; pass < 2; pass++) {
      var copy = small.slice();
      for (y = 0; y < bh; y++) for (x = 0; x < bw; x++) {
        var m2 = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var ax = x + dx, ay = y + dy; if (ax >= 0 && ay >= 0 && ax < bw && ay < bh && copy[ay * bw + ax] > m2) m2 = copy[ay * bw + ax]; }
        small[y * bw + x] = m2;
      }
    }
    return function (px, py) {
      var fx = Math.min(bw - 1.001, Math.max(0, px / 14 - 0.5)), fy = Math.min(bh - 1.001, Math.max(0, py / 14 - 0.5)), x0 = fx | 0, y0 = fy | 0, ax = fx - x0, ay = fy - y0;
      var a = small[y0 * bw + x0] + (small[y0 * bw + x0 + 1] - small[y0 * bw + x0]) * ax, b = small[(y0 + 1) * bw + x0] + (small[(y0 + 1) * bw + x0 + 1] - small[(y0 + 1) * bw + x0]) * ax;
      return a + (b - a) * ay;
    };
  }
  // looks: original, scan (clean colour), grey, bw (black & white)
  function applyFilter(cv, f) {
    if (!f || f === 'original') return cv;
    var w = cv.width, h = cv.height, g = cv.getContext('2d'), img = g.getImageData(0, 0, w, h), d = img.data, n = w * h, i;
    var lum = new Uint8Array(n), hist = new Uint32Array(256);
    for (i = 0; i < n; i++) { var l = (d[i * 4] * 299 + d[i * 4 + 1] * 587 + d[i * 4 + 2] * 114) / 1000 | 0; lum[i] = l; hist[l]++; }
    if (f === 'scan') {
      var lo = pct(hist, n, 0.03), hi = Math.max(lo + 40, pct(hist, n, 0.8));
      var sr = 0, sg = 0, sb = 0, sc = 0;
      for (i = 0; i < n; i++) if (lum[i] >= hi) { sr += d[i * 4]; sg += d[i * 4 + 1]; sb += d[i * 4 + 2]; sc++; }
      var pr = sc ? sr / sc : 255, pg = sc ? sg / sc : 255, pb = sc ? sb / sc : 255, pm = Math.max(1, (pr + pg + pb) / 3);
      var kr = pm / Math.max(1, pr), kg = pm / Math.max(1, pg), kb = pm / Math.max(1, pb);
      var lut = new Uint8ClampedArray(256);
      for (var v = 0; v < 256; v++) { var x = (v - lo) / (hi - lo); x = x < 0 ? 0 : (x > 1 ? 1 : x); lut[v] = Math.round(255 * Math.pow(x, 1.15)); }
      for (i = 0; i < n; i++) {
        var j = i * 4;
        d[j] = lut[Math.min(255, d[j] * kr | 0)]; d[j + 1] = lut[Math.min(255, d[j + 1] * kg | 0)]; d[j + 2] = lut[Math.min(255, d[j + 2] * kb | 0)];
      }
    } else if (f === 'grey') {
      var lo2 = pct(hist, n, 0.02), hi2 = Math.max(lo2 + 30, pct(hist, n, 0.55) - 6), lut2 = new Uint8ClampedArray(256);
      for (var v2 = 0; v2 < 256; v2++) { var x2 = (v2 - lo2) / (hi2 - lo2); x2 = x2 < 0 ? 0 : (x2 > 1 ? 1 : x2); lut2[v2] = Math.round(255 * Math.pow(x2, 1.35)); }
      for (i = 0; i < n; i++) { var o2 = lut2[lum[i]]; d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = o2; }
    } else if (f === 'bw') {
      var bg = background(lum, w, h);
      for (var y = 0; y < h; y++) for (var xx = 0; xx < w; xx++) {
        var k = y * w + xx, r = lum[k] / Math.max(24, bg(xx, y));
        var o3 = r > 0.86 ? 255 : (r < 0.62 ? 0 : Math.round((r - 0.62) / 0.24 * 255));
        d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = o3;
      }
    }
    g.putImageData(img, 0, 0);
    return cv;
  }

  /* ================= pages being scanned ================= */
  var ID_ASPECT = 85.6 / 54;
  var SC = { from: 'camera', mode: 'doc', name: '', filter: 'scan', pages: [], ver: 0, saved: false, seq: 0 };
  function newSide(src, quad) { return { src: src, quad: quad || null, auto: quad || null, rot: 0 }; }
  function loadSide(side) {
    if (side.img) return Promise.resolve(side.img);
    return PT.loadImage(side.src.bytes, side.src.mime || 'image/jpeg').then(function (im) { side.img = im; side.src.w = im.naturalWidth; side.src.h = im.naturalHeight; return im; });
  }
  function sideCanvas(side, maxSide, aspect) {
    return loadSide(side).then(function (im) {
      var w = im.naturalWidth, h = im.naturalHeight, cv;
      if (side.quad) cv = warp(im, w, h, side.quad, maxSide, aspect);
      else {
        var k = Math.min(1, maxSide / Math.max(w, h));
        cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
      }
      return rotateCanvas(cv, side.rot);
    });
  }
  // both sides of an ID card at real size on one A4 page (200 dpi)
  function composeId(front, back, filter) {
    var mm = 200 / 25.4, W = 1654, H = 2339, cw = Math.round(85.6 * mm), ch = Math.round(54 * mm);
    var out = document.createElement('canvas'); out.width = W; out.height = H;
    var g = out.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
    [front, back].forEach(function (c, i) {
      if (!c) return;
      var land = c.width >= c.height, w = land ? cw : ch, h = land ? ch : cw, x = Math.round((W - w) / 2), y = Math.round(22 * mm + i * (ch + 14 * mm));
      applyFilter(c, filter);
      g.drawImage(c, x, y, w, h);
      g.strokeStyle = '#C9CFCC'; g.lineWidth = 2; g.strokeRect(x - 1, y - 1, w + 2, h + 2);
    });
    return out;
  }
  function pageCanvas(p, maxSide, filter) {
    if (p.kind === 'id') {
      return Promise.all([sideCanvas(p.front, Math.max(700, maxSide * 0.6), p.front.quad ? ID_ASPECT : 0), p.back ? sideCanvas(p.back, Math.max(700, maxSide * 0.6), p.back.quad ? ID_ASPECT : 0) : null])
        .then(function (cs) {
          var page = composeId(cs[0], cs[1], filter);
          if (maxSide >= page.height) return page;
          var k = maxSide / page.height, sm = document.createElement('canvas'); sm.width = Math.round(page.width * k); sm.height = Math.round(page.height * k);
          sm.getContext('2d').drawImage(page, 0, 0, sm.width, sm.height); return sm;
        });
    }
    return sideCanvas(p.front, maxSide, 0).then(function (cv) { return applyFilter(cv, filter); });
  }
  function addPhoto(src, auto) {
    // auto: find the page edges straight away (camera scans); photos from the gallery stay whole
    return PT.loadImage(src.bytes, src.mime).then(function (im) {
      src.w = im.naturalWidth; src.h = im.naturalHeight;
      var q = auto ? findQuad(im, src.w, src.h) : null;
      var side = newSide(src, q); side.img = im; if (!auto) side.auto = findQuad(im, src.w, src.h);
      return side;
    });
  }
  function resetScan(from, mode) {
    SC.from = from; SC.mode = mode || 'doc'; SC.pages = []; SC.saved = false; SC.ver++;
    SC.filter = from === 'photos' ? 'original' : 'scan';
    SC.name = (from === 'photos' ? 'Photos' : 'Scan') + ' - ' + PDF.today();
  }

  /* ================= start ================= */
  function startScan(from, preload) {
    if (from === 'photos') {
      resetScan('photos');
      var p = preload ? Promise.resolve(preload) : PDF.pickFiles('image/*', true).then(function (fs) { return Promise.all(fs.map(PDF.fromFile)); });
      p.then(function (list) { return addSources(list, false); }).then(function () { if (SC.pages.length) A.go('scanpages'); });
      return;
    }
    resetScan('camera');
    openCamera('doc');
  }
  function addSources(list, auto) {
    A.busy(T('Opening…'));
    var ch = Promise.resolve(), bad = 0;
    list.forEach(function (s) {
      ch = ch.then(function () {
        if (s.kind !== 'image') { bad++; return; }
        return addPhoto({ bytes: s.bytes, mime: s.mime || 'image/jpeg' }, auto).then(function (side) { SC.pages.push({ id: ++SC.seq, kind: 'page', front: side }); }, function () { bad++; });
      });
    });
    return ch.then(function () { A.done(); if (bad) A.toast(T('Some files could not be opened. Choose JPG or PNG photos.'), 4000); });
  }

  /* ================= live camera ================= */
  var CAM = null;
  A.hooks.overlayBack = function () {
    if ($('.crop4')) { closeCrop(); return true; }
    if (CAM) { closeCamera(true); return true; }
    return false;
  };
  function openCamera(mode) {
    SC.mode = mode || 'doc';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { nativeCamera(); return; }
    var el = document.createElement('div'); el.className = 'cam';
    el.innerHTML = '<div class="cam-view"><video playsinline muted autoplay></video><svg class="edge" id="cam-edge"></svg><div class="cam-flash"></div>' +
      '<div class="cam-top"><button class="bar-icon" data-cm="close" aria-label="' + esc(T('Close')) + '">' + ic('close') + '</button><div class="t">' + T('Scan to PDF') + '</div>' +
      '<button class="cam-chip" data-cm="torch" hidden>' + ic('flash') + T('Light') + '</button></div>' +
      '<div class="cam-msg" id="cam-msg">' + T('Looking for the page…') + '</div></div>' +
      '<div class="cam-bot"><div class="modes">' + [['doc', 'Document'], ['id', 'ID card (2 sides)'], ['many', 'Many pages']].map(function (m) { return '<button data-mode="' + m[0] + '" class="' + (SC.mode === m[0] ? 'on' : '') + '">' + T(m[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="shut"><button class="stack" data-cm="done" id="cam-stack"></button><button class="shutter" data-cm="shoot" aria-label="' + esc(T('Take photo')) + '"><i></i></button><button class="done-btn" data-cm="done" id="cam-done" disabled>' + T('Done') + '</button></div>' +
      '<div class="cam-hint" id="cam-hint"></div></div>';
    document.body.appendChild(el);
    CAM = { el: el, video: el.querySelector('video'), stream: null, quad: null, timer: null, torch: false, idSide: 0, idPage: null, shots: 0, busy: false };
    hint();
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 2560 }, height: { ideal: 1920 } } }).then(function (stream) {
      if (!CAM) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
      CAM.stream = stream; CAM.video.srcObject = stream;
      var p = CAM.video.play(); if (p && p.catch) p.catch(function () {});
      var track = stream.getVideoTracks()[0], caps = track && track.getCapabilities ? track.getCapabilities() : {};
      if (caps && caps.torch) el.querySelector('[data-cm="torch"]').hidden = false;
      loop();
    }).catch(function () {
      closeCamera(false);
      A.toast(T('The live camera is not available. Using the camera app instead.'), 3500);
      nativeCamera();
    });
    el.addEventListener('click', camClick);
  }
  function hint() {
    if (!CAM) return;
    var h = '', n = SC.pages.length;
    if (SC.mode === 'id') h = T(CAM.idSide ? 'Now turn the card over and take the back' : 'Take the front of the ID card');
    else if (SC.mode === 'many') h = T('Take each page, then tap Done');
    else h = T('Put the page on a dark, flat surface');
    $('#cam-hint').textContent = h;
    var stack = $('#cam-stack'), last = SC.pages[n - 1];
    stack.innerHTML = last && last.thumb ? '<img src="' + last.thumb + '" alt=""><span class="n">' + n + '</span>' : (n ? '<span class="n">' + n + '</span>' : '');
    $('#cam-done').disabled = !n;
  }
  function loop() {
    if (!CAM) return;
    var v = CAM.video;
    if (v.videoWidth && !CAM.busy) {
      var q = findQuad(v, v.videoWidth, v.videoHeight);
      if (q && CAM.quad) q = q.map(function (c, i) { return [c[0] * 0.6 + CAM.quad[i][0] * 0.4, c[1] * 0.6 + CAM.quad[i][1] * 0.4]; });
      CAM.quad = q;
      drawEdge();
    }
    CAM.timer = setTimeout(loop, 220);
  }
  function drawEdge() {
    var svg = $('#cam-edge'), msg = $('#cam-msg'), v = CAM.video; if (!svg) return;
    var cw = v.clientWidth, ch = v.clientHeight, vw = v.videoWidth, vh = v.videoHeight;
    svg.setAttribute('viewBox', '0 0 ' + cw + ' ' + ch);
    if (!CAM.quad || !vw) { svg.innerHTML = ''; msg.className = 'cam-msg'; msg.textContent = T('Looking for the page…'); return; }
    var k = Math.max(cw / vw, ch / vh), ox = (cw - vw * k) / 2, oy = (ch - vh * k) / 2;
    var pts = CAM.quad.map(function (p) { return [ox + p[0] * vw * k, oy + p[1] * vh * k]; });
    svg.innerHTML = '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="rgba(46,204,113,.16)" stroke="#2ECC71" stroke-width="3" stroke-linejoin="round"/>' +
      pts.map(function (p) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="8" fill="#fff" stroke="#2ECC71" stroke-width="3"/>'; }).join('');
    msg.className = 'cam-msg found';
    msg.innerHTML = ic('check') + esc(T(SC.mode === 'id' ? 'ID card found - hold still' : 'Page found - hold still'));
  }
  function camClick(e) {
    var m = e.target.closest('[data-mode]');
    if (m) {
      if (SC.pages.length && CAM.idSide) return;
      SC.mode = m.getAttribute('data-mode'); CAM.idSide = 0;
      Array.prototype.forEach.call(CAM.el.querySelectorAll('[data-mode]'), function (b) { b.classList.toggle('on', b === m); });
      hint(); return;
    }
    var b = e.target.closest('[data-cm]'); if (!b) return;
    var a = b.getAttribute('data-cm');
    if (a === 'close') closeCamera(true);
    if (a === 'done') { if (SC.pages.length) closeCamera(true); }
    if (a === 'torch') {
      var track = CAM.stream && CAM.stream.getVideoTracks()[0]; if (!track) return;
      CAM.torch = !CAM.torch;
      track.applyConstraints({ advanced: [{ torch: CAM.torch }] }).catch(function () {});
      b.classList.toggle('on', CAM.torch);
    }
    if (a === 'shoot') shoot(b);
  }
  function shoot(btn) {
    if (!CAM || CAM.busy) return;
    var v = CAM.video; if (!v.videoWidth) return;
    CAM.busy = true; btn.disabled = true;
    var fl = CAM.el.querySelector('.cam-flash'); fl.classList.add('on'); setTimeout(function () { fl.classList.remove('on'); }, 60);
    var cv = document.createElement('canvas'); cv.width = v.videoWidth; cv.height = v.videoHeight;
    cv.getContext('2d').drawImage(v, 0, 0);
    var q = findQuad(cv, cv.width, cv.height) || CAM.quad;
    PT.canvasJpg(cv, 0.92).then(function (bytes) {
      var side = newSide({ bytes: bytes, mime: 'image/jpeg', w: cv.width, h: cv.height }, q);
      var p;
      if (SC.mode === 'id') {
        if (!CAM.idSide) { p = { id: ++SC.seq, kind: 'id', front: side, back: null }; SC.pages.push(p); CAM.idPage = p; CAM.idSide = 1; }
        else { CAM.idPage.back = side; p = CAM.idPage; CAM.idSide = 0; }
      } else { p = { id: ++SC.seq, kind: 'page', front: side }; SC.pages.push(p); }
      p.thumb = null; SC.ver++;
      return pageCanvas(p, 220, SC.filter).then(function (t) { p.thumb = t.toDataURL('image/jpeg', 0.7); });
    }).then(function () {
      CAM.busy = false; btn.disabled = false; hint();
      var last = SC.pages[SC.pages.length - 1];
      if (SC.mode === 'doc' || (SC.mode === 'id' && last.kind === 'id' && last.back)) setTimeout(function () { closeCamera(true); }, 250);
    }).catch(function () { CAM.busy = false; btn.disabled = false; });
  }
  function closeCamera(toReview) {
    if (!CAM) return;
    clearTimeout(CAM.timer);
    if (CAM.stream) CAM.stream.getTracks().forEach(function (t) { t.stop(); });
    CAM.el.remove(); CAM = null;
    if (toReview && SC.pages.length) { if (S.stack[S.stack.length - 1] === 'scanpages') A.render(); else A.go('scanpages'); }
  }
  // phones without the live camera: the normal camera app, then the edges are found in the photo
  function nativeCamera() {
    PDF.pickFiles('image/*', false, true).then(function (fs) { return Promise.all(fs.map(PDF.fromFile)); }).then(function (list) {
      return addSources(list, true);
    }).then(function () { if (SC.pages.length) { if (S.stack[S.stack.length - 1] === 'scanpages') A.render(); else A.go('scanpages'); } });
  }

  /* ================= corner adjustment ================= */
  var CROP = null;
  function closeCrop() { if (CROP) { CROP.el.remove(); CROP = null; } }
  function openCrop(side, aspect, done) {
    loadSide(side).then(function (im) {
      var el = document.createElement('div'); el.className = 'crop4';
      el.innerHTML = '<div class="crop4-t"><span>' + T('Adjust the corners') + '<small>' + T('Drag the corners to the edges of the document.') + '</small></span></div>' +
        '<div class="crop4-area" id="c4a"><img alt=""><svg></svg>' + [0, 1, 2, 3].map(function (i) { return '<div class="crop4-h" data-h="' + i + '"></div>'; }).join('') + '</div>' +
        '<div class="crop4-bar"><button class="btn soft small" data-c4="whole">' + T('Whole photo') + '</button>' + (side.auto ? '<button class="btn soft small" data-c4="auto">' + T('Auto') + '</button>' : '') +
        '<button class="btn soft small" data-c4="cancel">' + T('Cancel') + '</button><button class="btn gold small" data-c4="ok">' + T('Done') + '</button></div>';
      document.body.appendChild(el);
      var area = el.querySelector('#c4a'), img = el.querySelector('img'), svg = el.querySelector('svg');
      img.src = URL.createObjectURL(new Blob([side.src.bytes], { type: side.src.mime || 'image/jpeg' }));
      var q = (side.quad || [[0, 0], [1, 0], [1, 1], [0, 1]]).map(function (p) { return p.slice(); });
      CROP = { el: el };
      var box = {};
      function layout() {
        var aw = area.clientWidth - 40, ah = area.clientHeight - 40, iw = im.naturalWidth, ih = im.naturalHeight, k = Math.min(aw / iw, ah / ih);
        box = { x: (area.clientWidth - iw * k) / 2, y: (area.clientHeight - ih * k) / 2, w: iw * k, h: ih * k };
        img.style.left = box.x + 'px'; img.style.top = box.y + 'px'; img.style.width = box.w + 'px'; img.style.height = box.h + 'px';
        draw();
      }
      function draw() {
        svg.setAttribute('viewBox', '0 0 ' + area.clientWidth + ' ' + area.clientHeight);
        var pts = q.map(function (p) { return [box.x + p[0] * box.w, box.y + p[1] * box.h]; });
        svg.innerHTML = '<polygon points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="rgba(46,204,113,.14)" stroke="#2ECC71" stroke-width="2.5"/>';
        Array.prototype.forEach.call(el.querySelectorAll('.crop4-h'), function (h, i) { h.style.left = pts[i][0] + 'px'; h.style.top = pts[i][1] + 'px'; });
      }
      var drag = -1;
      function pos(e) { var r = area.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return [(t.clientX - r.left - box.x) / box.w, (t.clientY - r.top - box.y) / box.h]; }
      function down(e) { var h = e.target.closest('.crop4-h'); if (!h) return; e.preventDefault(); drag = +h.getAttribute('data-h'); }
      function move(e) { if (drag < 0) return; e.preventDefault(); var p = pos(e); q[drag] = [Math.max(0, Math.min(1, p[0])), Math.max(0, Math.min(1, p[1]))]; draw(); }
      function up() { drag = -1; }
      area.addEventListener('touchstart', down, { passive: false }); area.addEventListener('touchmove', move, { passive: false }); area.addEventListener('touchend', up);
      area.addEventListener('mousedown', down); window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-c4]'); if (!b) return;
        var a = b.getAttribute('data-c4');
        if (a === 'whole') { q = [[0, 0], [1, 0], [1, 1], [0, 1]]; draw(); }
        if (a === 'auto' && side.auto) { q = side.auto.map(function (p) { return p.slice(); }); draw(); }
        if (a === 'cancel') closeCrop();
        if (a === 'ok') {
          var whole = q[0][0] < 0.005 && q[0][1] < 0.005 && q[1][0] > 0.995 && q[2][1] > 0.995 && q[3][0] < 0.005;
          side.quad = whole ? null : q;
          closeCrop(); done();
        }
      });
      if (img.complete) layout(); else img.onload = layout;
      setTimeout(layout, 60);
    });
  }

  /* ================= check your scan ================= */
  var FILTERS = [['original', 'Original'], ['scan', 'Scanner look'], ['grey', 'Grey'], ['bw', 'Black & white']];
  A.VIEWS.scanpages = {
    title: function () { return T(SC.from === 'photos' ? 'Photos to PDF' : 'Check your scan'); },
    bar: function () { return '<span class="bar-act" style="font-weight:700">' + T(SC.pages.length === 1 ? '1 page' : '{n} pages', { n: SC.pages.length }) + '</span>'; },
    noMenu: true,
    beforeBack: function () {
      if (SC.saved || !SC.pages.length) return false;
      A.confirmSheet(T('Leave without saving?'), T('The pages you scanned will be lost.'), T('Leave'), true).then(function (ok) { if (ok) { SC.saved = true; A.back(); } });
      return true;
    },
    render: function (el) {
      if (!SC.pages.length) { el.innerHTML = '<div class="empty-box">' + ic('scan') + '<div>' + T('No pages yet.') + '</div></div>'; return; }
      var h = '<div class="fld"><label for="sc-name">' + T('File name') + '</label><input type="text" id="sc-name" value="' + esc(SC.name) + '" autocomplete="off"></div>' +
        '<div class="chips">' + FILTERS.map(function (f) { return '<button class="chip' + (SC.filter === f[0] ? ' on' : '') + '" data-flt="' + f[0] + '">' + T(f[1]) + '</button>'; }).join('') + '</div><div class="pgrid">';
      SC.pages.forEach(function (p, i) {
        h += '<div class="pg" data-pi="' + i + '"><div class="a4" data-pv="' + i + '">' + (p.kind === 'id' ? '<span class="badge-id">' + T(p.back ? 'ID front + back' : 'ID front') + '</span>' : '') +
          (p.thumb && p.tver === SC.ver ? '<img src="' + p.thumb + '" alt="">' : '<div class="spin"></div>') + '</div>' +
          '<div class="pg-bar"><b>' + T('Page {n}', { n: i + 1 }) + '</b><button class="ibtn" data-pa="crop" aria-label="' + esc(T('Crop')) + '">' + ic('crop') + '</button>' +
          '<button class="ibtn" data-pa="rot" aria-label="' + esc(T('Rotate')) + '">' + ic('rotate') + '</button><button class="ibtn" data-pa="more" aria-label="' + esc(T('More')) + '">' + ic('dots-v') + '</button></div></div>';
      });
      h += '<button class="pg add" data-add="1"><div class="a4"><div class="in">' + ic('plus') + T('Add page') + '</div></div></button></div>';
      el.innerHTML = h;
      thumbs();
    },
    actions: function () {
      if (!SC.pages.length) return '';
      return (S.list.length ? '<button class="btn soft" data-act="sccv">' + T('Add to my CV') + '</button>' : '') + '<button class="btn gold" data-act="scsave">' + T('Save PDF') + '</button>';
    },
    onAction: function (a) { if (a === 'scsave') { saveScan(false); return true; } if (a === 'sccv') { saveScan(true); return true; } }
  };
  var thumbJob = 0;
  function thumbs() {
    var job = ++thumbJob, ver = SC.ver, ch = Promise.resolve();
    SC.pages.forEach(function (p, i) {
      if (p.thumb && p.tver === ver) return;
      ch = ch.then(function () {
        if (job !== thumbJob || S.stack[S.stack.length - 1] !== 'scanpages') return;
        return pageCanvas(p, 420, SC.filter).then(function (cv) {
          p.thumb = cv.toDataURL('image/jpeg', 0.75); p.tver = ver;
          var box = document.querySelector('#v-scanpages [data-pv="' + SC.pages.indexOf(p) + '"]');
          if (box) { var sp = box.querySelector('.spin'); if (sp) sp.remove(); var im = box.querySelector('img'); if (im) im.src = p.thumb; else box.insertAdjacentHTML('beforeend', '<img src="' + p.thumb + '" alt="">'); }
        });
      });
    });
  }
  function bump(p) { p.tver = -1; SC.ver++; SC.pages.forEach(function (x) { if (x !== p) x.tver = SC.ver; }); }
  A.viewEl('scanpages').addEventListener('input', function (e) { if (e.target.id === 'sc-name') SC.name = e.target.value; });
  A.viewEl('scanpages').addEventListener('click', function (e) {
    var f = e.target.closest('[data-flt]');
    if (f) { SC.filter = f.getAttribute('data-flt'); SC.ver++; A.render(); return; }
    if (e.target.closest('[data-add]')) { addPageSheet(); return; }
    var pg = e.target.closest('[data-pi]'); if (!pg) return;
    var i = +pg.getAttribute('data-pi'), p = SC.pages[i], b = e.target.closest('[data-pa]');
    var a = b ? b.getAttribute('data-pa') : 'more';
    if (a === 'rot') { p.front.rot = (p.front.rot + 90) % 360; if (p.back) p.back.rot = (p.back.rot + 90) % 360; bump(p); A.render(); }
    if (a === 'crop') cropPage(p);
    if (a === 'more') pageMenu(i);
  });
  function cropPage(p) {
    if (p.kind !== 'id' || !p.back) { openCrop(p.front, p.kind === 'id' ? ID_ASPECT : 0, function () { bump(p); A.render(); }); return; }
    var sh = A.openSheet('<h3>' + T('Adjust the corners') + '</h3><button class="sheet-item" data-side="front">' + ic('id') + '<span>' + T('Front of the card') + '</span></button>' +
      '<button class="sheet-item" data-side="back">' + ic('id') + '<span>' + T('Back of the card') + '</span></button>');
    sh.onclick = function (e) { var b = e.target.closest('[data-side]'); if (!b) return; A.closeSheet(); openCrop(p[b.getAttribute('data-side')], ID_ASPECT, function () { bump(p); A.render(); }); };
  }
  function pageMenu(i) {
    var p = SC.pages[i], n = SC.pages.length;
    var sh = A.openSheet('<h3>' + T('Page {n}', { n: i + 1 }) + '</h3>' +
      '<button class="sheet-item" data-pm="crop">' + ic('crop') + '<span>' + T('Adjust the corners') + '</span></button>' +
      '<button class="sheet-item" data-pm="rot">' + ic('rotate') + '<span>' + T('Rotate') + '</span></button>' +
      (i > 0 ? '<button class="sheet-item" data-pm="up">' + ic('left') + '<span>' + T('Move earlier') + '</span></button>' : '') +
      (i < n - 1 ? '<button class="sheet-item" data-pm="down">' + ic('right') + '<span>' + T('Move later') + '</span></button>' : '') +
      '<button class="sheet-item danger" data-pm="del">' + ic('trash') + '<span>' + T('Delete page') + '</span></button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-pm]'); if (!b) return; A.closeSheet();
      var a = b.getAttribute('data-pm');
      if (a === 'crop') cropPage(p);
      if (a === 'rot') { p.front.rot = (p.front.rot + 90) % 360; if (p.back) p.back.rot = (p.back.rot + 90) % 360; bump(p); }
      if (a === 'up' || a === 'down') { var j = i + (a === 'up' ? -1 : 1), t = SC.pages[i]; SC.pages[i] = SC.pages[j]; SC.pages[j] = t; }
      if (a === 'del') SC.pages.splice(i, 1);
      A.render();
    };
  }
  function addPageSheet() {
    var sh = A.openSheet('<h3>' + T('Add page') + '</h3>' +
      '<button class="sheet-item" data-ap="cam">' + ic('camera') + '<span>' + T('Scan with the camera') + '</span></button>' +
      '<button class="sheet-item" data-ap="id">' + ic('id') + '<span>' + T('ID card (2 sides)') + '</span></button>' +
      '<button class="sheet-item" data-ap="gal">' + ic('photos') + '<span>' + T('Choose photos') + '</span></button>');
    sh.onclick = function (e) {
      var b = e.target.closest('[data-ap]'); if (!b) return; A.closeSheet();
      var a = b.getAttribute('data-ap');
      if (a === 'cam') openCamera('many');
      if (a === 'id') openCamera('id');
      if (a === 'gal') PDF.pickFiles('image/*', true).then(function (fs) { return Promise.all(fs.map(PDF.fromFile)); }).then(function (l) { return addSources(l, SC.from !== 'photos'); }).then(function () { SC.ver++; A.render(); });
    };
  }
  function buildPdf() {
    var items = [], ch = Promise.resolve();
    SC.pages.forEach(function (p, i) {
      ch = ch.then(function () {
        $('#busy-msg').textContent = T('Making your PDF…') + ' ' + (i + 1) + '/' + SC.pages.length;
        return pageCanvas(p, 2200, SC.filter).then(function (cv) { return PT.canvasJpg(cv, SC.filter === 'bw' ? 0.8 : 0.85); }).then(function (j) { items.push({ bytes: j, fit: p.kind === 'id' ? 'page' : 'auto' }); });
      });
    });
    return ch.then(function () { return PT.imagesToPdf(items, SC.name); });
  }
  function saveScan(toCv) {
    var name = PDF.base(SC.name || 'Scan') + '.pdf';
    A.busy(T('Making your PDF…'));
    buildPdf().then(function (bytes) {
      return PDF.Files.add(bytes, name, SC.pages.length).then(function (meta) {
        A.done(); SC.saved = true;
        if (toCv) PDF.addToCv(bytes, meta.name); else PDF.resultSheet(meta, T('Your PDF is ready'));
      });
    }).catch(PDF.failMsg);
  }

  A.PDF.startScan = startScan;
  A.PDF.findQuad = findQuad;
  A.PDF.applyFilter = applyFilter;
  A.PDF.warp = warp;
})();
