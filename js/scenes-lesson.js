/* 动画课：小淘淘讲故事（逐拍播放 + 语音朗读） */
(function () {
  var MX = window.MX, U = MX.util;
  MX.scenes = MX.scenes || {};

  MX.scenes.lesson = function (params) {
    var ch = params.chapter, grade = params.grade;
    var root = U.el('div', 'screen bg-book');
    MX.addClouds(root);

    var bar = U.el('div', 'top-bar');
    var back = U.el('button', 'btn round', '🗺️');
    back.addEventListener('click', function () { MX.audio.stopSpeak(); MX.audio.tap(); MX.App.go('map', { grade: grade }); });
    bar.appendChild(back);
    bar.appendChild(U.el('div', 'map-title', ch.icon + ' ' + ch.title));
    var skip = U.el('button', 'btn', '去练习 ▶');
    skip.style.fontSize = '19px';
    skip.addEventListener('click', function (e) {
      e.stopPropagation();
      MX.audio.stopSpeak(); MX.audio.tap();
      MX.App.go('practice', { chapter: ch, grade: grade });
    });
    bar.appendChild(skip);
    root.appendChild(bar);

    var stage = U.el('div', 'book-stage');
    var visual = U.el('div', 'story-visual');
    var bubble = U.el('div', 'speech-bubble');
    bubble.innerHTML = '<span class="bubble-text"></span><span class="tail"></span>';
    stage.appendChild(visual);
    stage.appendChild(bubble);
    root.appendChild(stage);

    var foot = U.el('div', 'book-foot');
    MX.mascot.detach();
    var mWrap = MX.mascot.mount(foot);
    foot.appendChild(mWrap);
    foot.appendChild(U.el('div', 'tap-hint', '👆 点一点，继续故事'));
    root.appendChild(foot);

    var beats = ch.beats;
    var idx = -1, token = 0, busy = false, done = false;

    function goPractice() {
      if (done) return;
      done = true;
      MX.audio.stopSpeak();
      MX.App.go('practice', { chapter: ch, grade: grade });
    }

    function renderVisual(b) {
      U.clear(visual);
      visual.style.display = 'flex';
      if (b.e && b.n) {
        for (var i = 0; i < b.n; i++) {
          (function (k) {
            setTimeout(function () {
              var sp = U.el('span', 'story-emoji', b.e);
              visual.appendChild(sp);
              MX.audio.pop();
            }, 120 + k * 160);
          })(i);
        }
      } else if (b.groups) {
        for (var g = 0; g < b.groups[0]; g++) {
          var row = U.el('div', null);
          row.style.cssText = 'display:flex;gap:4px;width:100%;justify-content:center;';
          for (var n = 0; n < b.groups[1]; n++) {
            (function (gg, nn) {
              setTimeout(function () {
                var sp = U.el('span', 'story-emoji', b.groups[2]);
                sp.style.fontSize = 'clamp(30px,6vw,48px)';
                row.appendChild(sp);
                MX.audio.pop();
              }, 120 + (gg * b.groups[1] + nn) * 110);
            })(g, n);
          }
          visual.appendChild(row);
        }
      } else if (b.clock) {
        visual.innerHTML = MX.vis.clock(b.clock[0], b.clock[1]);
      } else if (b.pie) {
        visual.innerHTML = MX.vis.pie(b.pie[0], b.pie[1]);
      } else if (b.rect) {
        visual.innerHTML = MX.vis.rect(b.rect[0], b.rect[1]);
      } else if (b.angle != null) {
        visual.innerHTML = MX.vis.angle(b.angle);
      } else if (b.shape) {
        visual.innerHTML = MX.vis.shapeSvg(b.shape);
      } else {
        visual.style.display = 'none';
      }
      if (b.f) {
        var fc = U.el('div', 'story-formula', b.f);
        visual.appendChild(fc);
      }
    }

    function showBeat(i) {
      if (i >= beats.length) { goPractice(); return; }
      idx = i; token++;
      var my = token;
      var b = beats[i];
      busy = true;
      renderVisual(b);
      var txtEl = bubble.querySelector('.bubble-text');
      txtEl.textContent = b.t;
      MX.mascot.mood('happy');
      MX.mascot.talking(true);
      if (b.wave) MX.mascot.act('wave', 'once');
      MX.audio.speak(b.t, function () {
        if (my !== token) return;
        MX.mascot.talking(false);
        busy = false;
        setTimeout(function () { if (my === token) showBeat(i + 1); }, 700);
      });
    }

    root.addEventListener('click', function (e) {
      if (e.target === skip || skip.contains(e.target) || e.target === back || back.contains(e.target)) return;
      if (done) return;
      MX.audio.stopSpeak();
      MX.mascot.talking(false);
      busy = false;
      showBeat(idx + 1);
    });

    showBeat(0);
    return root;
  };
})();
