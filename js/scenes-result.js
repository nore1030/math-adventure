/* 结算：星星 + 彩带 + 庆祝 */
(function () {
  var MX = window.MX, U = MX.util;
  MX.scenes = MX.scenes || {};

  MX.scenes.result = function (params) {
    var ch = params.chapter, grade = params.grade;
    var stars = params.stars, first = params.first, total = params.total;

    var root = U.el('div', 'screen bg-party');

    var canvas = U.el('canvas');
    canvas.id = 'confetti-canvas';
    root.appendChild(canvas);

    var box = U.el('div');
    box.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-top:6vh;z-index:2;';
    box.appendChild(U.el('div', 'result-title', stars === 3 ? '🎉 太棒了，全部通关！' : (stars === 2 ? '😊 完成得很好！' : '💪 挑战成功！')));
    box.appendChild(U.el('div', 'result-sub', ch.icon + ' ' + ch.title));

    var starRow = U.el('div', 'result-stars');
    for (var i = 0; i < 3; i++) {
      var s = U.el('span', 'big-star', '⭐');
      starRow.appendChild(s);
      if (i < stars) {
        (function (el, delay) {
          setTimeout(function () {
            el.classList.add('lit');
            MX.audio.star(delay);
          }, 500 + delay * 450);
        })(s, i);
      }
    }
    box.appendChild(starRow);

    var stats = U.el('div', 'result-stats');
    stats.appendChild(U.el('div', 'stat-chip', '首次答对 ' + first + '/' + total));
    stats.appendChild(U.el('div', 'stat-chip', '获得 ⭐ × ' + stars));
    box.appendChild(stats);

    var btns = U.el('div', 'result-btns');
    var again = U.el('button', 'btn green', '🔁 再练一次');
    again.addEventListener('click', function () { MX.audio.tap(); MX.App.go('practice', { chapter: ch, grade: grade }); });
    var book = U.el('button', 'btn', '🎬 再看一次讲解');
    book.addEventListener('click', function () { MX.audio.tap(); MX.App.go('lesson', { chapter: ch, grade: grade }); });
    var mapBtn = U.el('button', 'btn primary', '🗺️ 返回地图');
    mapBtn.addEventListener('click', function () { MX.audio.tap(); MX.App.go('map', { grade: grade }); });
    btns.appendChild(again); btns.appendChild(book); btns.appendChild(mapBtn);
    box.appendChild(btns);
    root.appendChild(box);

    MX.mascot.detach();
    var mWrap = MX.mascot.mount(root, true);
    mWrap.style.cssText = 'position:absolute;right:6%;bottom:calc(4% + env(safe-area-inset-bottom));width:150px;height:150px;z-index:2;';
    MX.mascot.mood('happy');
    var dance = setInterval(function () { MX.mascot.act('jump', 'once'); }, 1100);
    root.addEventListener('DOMNodeRemoved', function () {}, false);
    // 离开场景时停止舞蹈
    var observer = new MutationObserver(function () {
      if (!root.isConnected) { clearInterval(dance); observer.disconnect(); }
    });
    observer.observe(document.getElementById('app'), { childList: true });

    if (stars >= 2) MX.audio.fanfare();

    confetti(canvas);

    return root;
  };

  function confetti(canvas) {
    var ctx = canvas.getContext('2d');
    var colors = ['#FF7043', '#FFD54F', '#4FC3F7', '#81C784', '#BA68C8', '#F06292'];
    var parts = [];
    function resize() {
      canvas.width = canvas.clientWidth || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight;
    }
    resize();
    for (var i = 0; i < 130; i++) {
      parts.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height * 0.5,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        c: colors[Math.floor(Math.random() * colors.length)],
        vy: 1.6 + Math.random() * 2.6,
        vx: -1 + Math.random() * 2,
        rot: Math.random() * Math.PI,
        vr: -0.1 + Math.random() * 0.2
      });
    }
    var t = 0;
    (function draw() {
      if (!canvas.isConnected) return;
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function (p) {
        p.y += p.vy; p.x += p.vx + Math.sin((p.y + t) / 40); p.rot += p.vr;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t < 900) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    })();
  }
})();
