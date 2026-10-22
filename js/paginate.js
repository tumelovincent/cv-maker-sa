/* Lays a CV out on A4 pages: moves whole blocks to the next page instead of cutting them,
   then builds scaled page previews from the laid-out stage. */
(function () {
  'use strict';
  var PW = 794, PH = 1123;

  function fontsFor(t) {
    var keys = {}; keys[t.fonts.name] = 1; keys[t.fonts.head] = 1; keys[t.fonts.body] = 1;
    if (t.family === 'classic') { keys.pagella = 1; keys.carlito = 1; }
    var loads = [];
    Object.keys(keys).forEach(function (k) {
      (window.CV_FONTS[k] || [400]).forEach(function (w) {
        if (document.fonts && document.fonts.load) loads.push(document.fonts.load(w + ' 16px "F-' + k + '"').catch(function () {}));
      });
    });
    return Promise.all(loads).then(function () { return document.fonts ? document.fonts.ready : null; });
  }

  // stage: an unscaled, off-screen container that holds the real-size CV
  function getStage() {
    var s = document.getElementById('cv-stage');
    if (!s) {
      s = document.createElement('div');
      s.id = 'cv-stage';
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'position:absolute;left:-12000px;top:0;width:' + PW + 'px;overflow:visible;pointer-events:none;';
      document.body.appendChild(s);
    }
    return s;
  }

  function put(cv, tplId, opts) {
    var r = window.CVTemplates.render(cv, tplId, opts);
    var stage = getStage();
    stage.innerHTML = '<div class="' + r.cls + '" style="' + r.style + '">' + r.html + '</div>';
    return { r: r, root: stage.firstChild };
  }
  function layout(cv, tplId) {
    var x = put(cv, tplId, {}), opts = {};
    var t = x.r.tpl; // template with the CV's chosen colour and text size
    return waitImages(x.root).then(function () { return fontsFor(t); }).then(function () {
      // two-column designs: if the side column is much longer than the main one, move skills,
      // attributes and hobbies into the main column so both columns end at a similar height
      var side = x.root.querySelector('.col.side'), main = x.root.querySelector('.col.main');
      if (side && main && side.scrollHeight > main.scrollHeight + 40 && side.scrollHeight > PH - t.page.mb) {
        opts = { lite: true };
        x = put(cv, tplId, opts);
        return waitImages(x.root);
      }
    }).then(function () {
      var n = paginate(x.root, t);
      return { root: x.root, pages: n, tpl: t, opts: opts };
    });
  }

  function layoutDoc(r) {
    var stage = getStage();
    stage.innerHTML = '<div class="' + r.cls + '" style="' + r.style + '">' + r.html + '</div>';
    var root = stage.firstChild;
    return waitImages(root).then(function () { return fontsFor(r.tpl); }).then(function () {
      var n = paginate(root, r.tpl);
      if (r.footer) {
        for (var i = 0; i < n; i++) {
          var f = document.createElement('div');
          f.className = 'pg-foot';
          f.style.cssText = 'position:absolute;left:0;right:0;top:' + (i * PH + PH - (r.tpl.page.footAt || 40)) + 'px;';
          f.innerHTML = r.footer(i, n);
          root.appendChild(f);
        }
      }
      return { root: root, pages: n, tpl: r.tpl, opts: {} };
    });
  }

  function waitImages(root) {
    var imgs = root.querySelectorAll('img');
    return Promise.all(Array.prototype.map.call(imgs, function (im) {
      if (im.complete) return Promise.resolve();
      return new Promise(function (res) { im.onload = im.onerror = res; });
    }));
  }

  function paginate(root, t) {
    var mt = t.page.mt, mb = t.page.mb;
    var cols = root.querySelectorAll('.col');
    var base = root.getBoundingClientRect().top;
    function rel(el) { var r = el.getBoundingClientRect(); return { top: r.top - base, bottom: r.bottom - base, h: r.height }; }
    function pushTo(b, target) {
      var sp = document.createElement('div');
      sp.className = 'pg-spacer';
      sp.style.height = '0px';
      b.parentNode.insertBefore(sp, b);
      var h = 0;
      for (var k = 0; k < 4; k++) {
        var d = target - rel(b).top;
        if (Math.abs(d) < 0.25) break;
        h = Math.max(0, h + d);
        sp.style.height = h + 'px';
      }
    }
    Array.prototype.forEach.call(cols, function (col) {
      var blocks = Array.prototype.slice.call(col.querySelectorAll('.blk'));
      for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i], r = rel(b);
        if (r.h <= 0) continue;
        var page = Math.floor(r.top / PH), pageTop = page * PH;
        if (page > 0 && r.top < pageTop + mt - 0.5) { pushTo(b, pageTop + mt); r = rel(b); page = Math.floor(r.top / PH); pageTop = page * PH; }
        var limit = pageTop + PH - mb;
        var bottom = r.bottom;
        if (b.classList.contains('kwn') && blocks[i + 1]) {
          var nx = rel(blocks[i + 1]);
          if (nx.h < PH / 3) bottom = Math.max(bottom, nx.bottom);
        }
        if (bottom > limit + 0.5 && r.h < PH - mt - mb) pushTo(b, (page + 1) * PH + mt);
      }
    });
    var maxBottom = 0;
    Array.prototype.forEach.call(root.querySelectorAll('.blk'), function (b) { var r = rel(b); if (r.h > 0) maxBottom = Math.max(maxBottom, r.bottom); });
    var n = Math.max(1, Math.ceil((maxBottom - 2) / PH));
    root.style.height = (n * PH) + 'px';
    root.style.overflow = 'hidden';
    return n;
  }

  function decorHTML(t, i) {
    return window.CVTemplates.decor(t, i).map(function (d) {
      if (d.path) return '<svg style="position:absolute;left:0;top:0;width:' + PW + 'px;height:' + PH + 'px" viewBox="0 0 ' + PW + ' ' + PH + '"><path d="' + d.path + '" fill="' + d.fill + '"' + (d.op != null ? ' fill-opacity="' + d.op + '"' : '') + '/></svg>';
      var s = 'position:absolute;left:' + d.x + 'px;top:' + d.y + 'px;width:' + d.w + 'px;height:' + d.h + 'px;';
      if (d.r) s += 'border-radius:' + d.r + 'px;';
      if (d.op != null) s += 'opacity:' + d.op + ';';
      if (d.fill) s += 'background:' + d.fill + ';';
      if (d.stroke) s += 'border:' + d.sw + 'px solid ' + d.stroke + ';box-sizing:border-box;';
      return '<div style="' + s + '"></div>';
    }).join('');
  }

  // Build preview pages (scaled clones of the stage)
  function renderPages(result, container, width) {
    var scale = width / PW;
    container.innerHTML = '';
    for (var i = 0; i < result.pages; i++) {
      var outer = document.createElement('div');
      outer.className = 'pg-sheet';
      outer.style.width = Math.round(PW * scale) + 'px';
      outer.style.height = Math.round(PH * scale) + 'px';
      var inner = document.createElement('div');
      inner.className = 'sheet-in';
      inner.style.cssText = 'position:absolute;left:0;top:0;width:' + PW + 'px;height:' + PH + 'px;overflow:hidden;background:#fff;transform-origin:0 0;transform:scale(' + scale + ')';
      inner.innerHTML = decorHTML(result.tpl, i);
      var clone = result.root.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = '0';
      clone.style.top = (-i * PH) + 'px';
      inner.appendChild(clone);
      outer.appendChild(inner);
      var no = document.createElement('div');
      no.className = 'pg-no';
      no.textContent = 'Page ' + (i + 1) + ' of ' + result.pages;
      container.appendChild(outer);
      container.appendChild(no);
    }
  }

  // Thumbnail of the first page only (no pagination needed)
  function thumb(cv, tplId, width, plain) {
    var r = window.CVTemplates.render(cv, tplId, { plain: !!plain });
    var scale = width / PW;
    return '<div class="thumb" style="width:' + Math.round(PW * scale) + 'px;height:' + Math.round(PH * scale) + 'px">' +
      '<div style="position:absolute;left:0;top:0;width:' + PW + 'px;height:' + PH + 'px;overflow:hidden;background:#fff;transform-origin:0 0;transform:scale(' + scale + ')">' +
      decorHTML(r.tpl, 0) + '<div class="' + r.cls + '" style="' + r.style + ';position:absolute;left:0;top:0">' + r.html + '</div></div></div>';
  }

  window.CVPaginate = { layout: layout, layoutDoc: layoutDoc, renderPages: renderPages, thumb: thumb, decorHTML: decorHTML, PW: PW, PH: PH, fontsFor: fontsFor };
})();
