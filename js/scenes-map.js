/* 关卡地图：一条蜿蜒小路 + 章节节点（支持任意章节数） */
(function () {
  var MX = window.MX, U = MX.util;
  MX.scenes = MX.scenes || {};

  var POS4 = [{ x: 24, y: 14 }, { x: 74, y: 34 }, { x: 26, y: 60 }, { x: 72, y: 86 }];

  function posFor(i, n) {
    if (n === 4) return POS4[i];
    var y = 9 + 82 * i / (n - 1);
    return { x: i % 2 === 0 ? 26 : 74, y: y };
  }

  // Catmull-Rom 平滑曲线
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + pts[0].x + ',' + pts[0].y;
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i],
          p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2.x.toFixed(1) + ',' + p2.y.toFixed(1);
    }
    return d;
  }

  MX.scenes.map = function (params) {
    var grade = params.grade;
    var root = U.el('div', 'screen bg-map');
    MX.addClouds(root);

    var bar = U.el('div', 'top-bar');
    var back = U.el('button', 'btn round', '🏠');
    back.addEventListener('click', function () { MX.audio.tap(); MX.App.go('home'); });
    var title = U.el('div', 'map-title', grade.emoji + ' ' + grade.name + ' · 选择关卡');
    bar.appendChild(back);
    bar.appendChild(title);
    bar.appendChild(U.el('div', null, '&nbsp;'));
    root.appendChild(bar);

    var n = grade.chapters.length;
    var wrap = U.el('div', 'map-wrap');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'map-path');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', smoothPath(grade.chapters.map(function (ch, i) { return posFor(i, n); })));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#FFFFFF');
    path.setAttribute('stroke-width', '7');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-dasharray', '0.1 4');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.style.opacity = '0.9';
    svg.appendChild(path);
    wrap.appendChild(svg);

    grade.chapters.forEach(function (ch, i) {
      var stars = MX.App.chapterStars(ch.id);
      var done = stars > 0;
      var prevId = i > 0 ? grade.chapters[i - 1].id : null;
      var locked = prevId ? MX.App.chapterStars(prevId) === 0 : false;
      var pos = posFor(i, n);

      var node = U.el('div', 'map-node' + (locked ? ' locked' : '') + (done ? ' done' : ''));
      node.style.left = pos.x + '%';
      node.style.top = pos.y + '%';

      var btn = U.el('button', 'node-btn', locked ? '🔒' : ch.icon);
      if (!locked && !done) btn.classList.add('node-pulse');
      node.appendChild(btn);
      node.appendChild(U.el('div', 'node-name', ch.title));
      node.appendChild(U.el('div', 'node-stars', done ? '⭐'.repeat(stars) + '☆'.repeat(3 - stars) : (locked ? '未解锁' : '点击开始')));

      btn.addEventListener('click', function () {
        if (locked) {
          MX.audio.wrong();
          node.classList.add('shake');
          setTimeout(function () { node.classList.remove('shake'); }, 500);
          MX.App.toast(root, '先完成上一关吧！');
          return;
        }
        MX.audio.tap();
        MX.App.go('lesson', { chapter: ch, grade: grade });
      });
      wrap.appendChild(node);
    });

    root.appendChild(wrap);
    return root;
  };
})();
