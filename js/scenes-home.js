/* 首页：选年级 + 家长中心 */
(function () {
  var MX = window.MX, U = MX.util;
  MX.scenes = MX.scenes || {};

  MX.scenes.home = function () {
    var root = U.el('div', 'screen bg-home');
    MX.addClouds(root);
    root.appendChild(U.el('div', 'home-title', '数学冒险'));
    root.appendChild(U.el('div', 'home-sub', '和小淘淘一起快乐学数学 · 1-5 年级'));

    MX.mascot.detach();
    var mWrap = MX.mascot.mount(root, true);
    mWrap.style.marginTop = '2vh';
    MX.mascot.mood('happy');
    setTimeout(function () { MX.mascot.act('wave', 'once'); }, 600);

    var grid = U.el('div', 'grade-grid');
    MX.curriculum.grades.forEach(function (g) {
      var st = MX.App.gradeStats(g);
      var card = U.el('button', 'grade-card');
      card.style.background = 'linear-gradient(160deg,' + g.color + ',' + g.deep + ')';
      card.innerHTML = '<div class="g-emoji">' + g.emoji + '</div>' +
        '<div class="g-name">' + g.name + '</div>' +
        '<div class="g-stars">⭐ ' + st.stars + ' / ' + (g.chapters.length * 3) + ' · 闯关 ' + st.done + '/' + g.chapters.length + '</div>';
      card.addEventListener('click', function () {
        MX.audio.tap();
        MX.App.go('map', { grade: g });
      });
      grid.appendChild(card);
    });
    root.appendChild(grid);

    var foot = U.el('div', 'home-foot');
    var parentBtn = U.el('button', 'btn', '👨‍👩‍👧 家长中心');
    parentBtn.style.fontSize = '19px';
    parentBtn.addEventListener('click', function () { MX.audio.tap(); openParentPanel(root); });
    foot.appendChild(parentBtn);
    root.appendChild(foot);
    return root;
  };

  function openParentPanel(root) {
    var mask = U.el('div', 'modal-mask');
    var box = U.el('div', 'modal');
    box.appendChild(U.el('h2', null, '👨‍👩‍👧 家长中心'));

    function toggleRow(label, isOn, onChange) {
      var row = U.el('div', 'row');
      row.appendChild(U.el('span', null, label));
      var t = U.el('button', 'toggle' + (isOn ? ' on' : ''));
      t.addEventListener('click', function () {
        var on = !t.classList.contains('on');
        t.classList.toggle('on', on);
        MX.audio.tap();
        onChange(on);
      });
      row.appendChild(t);
      return row;
    }
    box.appendChild(toggleRow('🔊 音效', MX.audio.sfxOn, function (on) { MX.audio.setSfx(on); }));
    box.appendChild(toggleRow('🗣️ 语音朗读', MX.audio.voiceOn, function (on) { MX.audio.setVoice(on); }));

    var resetBtn = U.el('button', 'btn', '清除全部学习进度');
    resetBtn.style.fontSize = '18px';
    resetBtn.style.background = '#FFEBEE';
    resetBtn.style.color = '#C62828';
    var armed = false;
    resetBtn.addEventListener('click', function () {
      if (!armed) {
        armed = true;
        resetBtn.textContent = '再点一次确认清除';
        setTimeout(function () { armed = false; resetBtn.textContent = '清除全部学习进度'; }, 2500);
      } else {
        MX.App.resetProgress();
        mask.remove();
        MX.App.go('home');
      }
    });
    box.appendChild(resetBtn);

    var closeBtn = U.el('button', 'btn primary', '关闭');
    closeBtn.addEventListener('click', function () { MX.audio.tap(); mask.remove(); });
    box.appendChild(closeBtn);

    mask.appendChild(box);
    root.appendChild(mask);
  }
})();
