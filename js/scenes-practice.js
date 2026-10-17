/* 互动练习：选择 / 键盘输入 / 比大小 / 配对，即时动画反馈 */
(function () {
  var MX = window.MX, U = MX.util;
  MX.scenes = MX.scenes || {};

  MX.scenes.practice = function (params) {
    var ch = params.chapter, grade = params.grade;
    var qs = ch.practice.map(function (s) { return MX.gen(s); });
    var total = qs.length;
    var idx = 0, wrongCount = 0, results = [];
    var finished = false;

    var root = U.el('div', 'screen bg-play');

    var bar = U.el('div', 'top-bar');
    var back = U.el('button', 'btn round', '🗺️');
    back.addEventListener('click', function () { MX.audio.stopSpeak(); MX.audio.tap(); MX.App.go('map', { grade: grade }); });
    var dots = U.el('div', 'progress-dots');
    var score = U.el('div', 'say', '⭐ 0');
    bar.appendChild(back); bar.appendChild(dots); bar.appendChild(score);
    root.appendChild(bar);

    var main = U.el('div', 'play-main');
    var card = U.el('div', 'q-card');
    var vis = U.el('div', 'q-visual');
    var hint = U.el('div', 'hint-chip');
    var zone = U.el('div');
    zone.style.cssText = 'display:flex;flex-direction:column;align-items:center;width:100%;';
    main.appendChild(card); main.appendChild(vis); main.appendChild(hint); main.appendChild(zone);
    root.appendChild(main);

    MX.mascot.detach();
    var mWrap = MX.mascot.mount(root);
    mWrap.style.cssText = 'position:absolute;left:10px;bottom:calc(8px + env(safe-area-inset-bottom));width:104px;height:104px;pointer-events:none;z-index:5;';
    root.appendChild(mWrap);

    var fbLayer = U.el('div', 'feedback-layer');
    root.appendChild(fbLayer);

    // —— 反馈 ——
    function feedback(good, text) {
      fbLayer.innerHTML = '<div class="fb-stack"><div class="fb-icon">' + (good ? '✅' : '❌') + '</div>' +
        (text ? '<div class="fb-text">' + text + '</div>' : '') + '</div>';
      setTimeout(function () { fbLayer.innerHTML = ''; }, good ? 950 : 700);
    }
    function cheer() {
      MX.audio.correct();
      MX.mascot.mood('happy');
      MX.mascot.act('jump', 'once');
      feedback(true, U.pick(['真棒！', '太厉害了！', '答对啦！', '你真聪明！']));
    }
    function oops() {
      MX.audio.wrong();
      MX.mascot.mood('sad');
      MX.mascot.act('shake', 'once');
      feedback(false, U.pick(['再想一想～', '差一点点！', '没关系，再试一次']));
      setTimeout(function () { MX.mascot.mood('idle'); }, 1300);
    }

    function record(okFirstTry) {
      results.push(okFirstTry);
      score.textContent = '⭐ ' + results.filter(function (r) { return r; }).length;
    }

    function next() {
      if (finished) return;
      idx++;
      if (idx >= total) { finish(); return; }
      renderQ();
    }
    function solved(okFirst) {
      record(okFirst);
      cheer();
      var my = idx;
      setTimeout(function () { if (my === idx && !finished) next(); }, 1150);
    }
    function failed() {
      record(false);
      var q = qs[idx];
      var ansText = q.kind === 'choice' ? q.choices[q.answerIndex] : (q.kind === 'input' ? q.answer : (q.kind === 'compare' ? q.answer : ''));
      feedback(false, '正确答案：' + ansText);
      var my = idx;
      setTimeout(function () { if (my === idx && !finished) next(); }, 1900);
    }

    function finish() {
      finished = true;
      var first = results.filter(function (r) { return r; }).length;
      var ratio = first / total;
      var stars = ratio >= 0.9 ? 3 : (ratio >= 0.55 ? 2 : 1);
      MX.App.saveChapter(ch.id, stars);
      MX.App.go('result', { chapter: ch, grade: grade, first: first, total: total, stars: stars });
    }

    // —— 渲染 ——
    function renderDots() {
      U.clear(dots);
      for (var i = 0; i < total; i++) {
        var d = U.el('span', 'p-dot' + (i < results.length ? (results[i] ? ' ok' : ' bad') : (i === idx ? ' now' : '')));
        dots.appendChild(d);
      }
    }

    function renderVisual(q) {
      U.clear(vis);
      hint.style.display = 'none';
      if (!q.visual) return;
      var v = q.visual;
      if (v.type === 'emoji') {
        var line1 = U.el('div'); line1.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:4px;width:100%;';
        var count = v.groups ? v.groups[1] : (v.n1 || 0);
        var rows = v.groups ? v.groups[0] : (v.n2 != null ? 2 : 1);
        if (v.tail) count = v.n1;
        for (var i = 0; i < count; i++) {
          (function (k) {
            setTimeout(function () { var sp = U.el('span', 'q-emoji', v.e); line1.appendChild(sp); }, k * 70);
          })(i);
        }
        vis.appendChild(line1);
        if (rows === 2) {
          var line2 = U.el('div'); line2.style.cssText = line1.style.cssText;
          for (var j = 0; j < v.n2; j++) {
            (function (k) {
              setTimeout(function () { var sp = U.el('span', 'q-emoji', v.e); line2.appendChild(sp); }, 300 + k * 70);
            })(j);
          }
          vis.appendChild(line2);
        }
        if (v.tail) {
          var sep = U.el('div', null, '⬇️');
          sep.style.cssText = 'width:100%;text-align:center;font-size:20px;';
          vis.appendChild(sep);
          var line3 = U.el('div'); line3.style.cssText = line1.style.cssText;
          for (var t = 0; t < v.tail.length; t++) line3.appendChild(U.el('span', 'q-emoji', v.tail[t]));
          vis.appendChild(line3);
        }
      } else if (v.type === 'svg') {
        vis.innerHTML = v.html;
      } else if (v.type === 'chips') {
        var row = U.el('div', 'chip-row');
        v.items.forEach(function (it) {
          row.appendChild(U.el('span', 'chip' + (it.q ? ' q' : '') + (it.hi ? ' hi' : ''), it.t));
        });
        vis.appendChild(row);
      } else if (v.type === 'blocks') {
        vis.innerHTML = MX.vis.blocks(v.heights);
      }
      if (q.hint) { hint.textContent = '💡 ' + q.hint; hint.style.display = 'inline-block'; }
    }

    function lockUI() { zone.style.pointerEvents = 'none'; }

    function renderQ() {
      wrongCount = 0;
      zone.style.pointerEvents = '';
      renderDots();
      var q = qs[idx];
      U.clear(zone);
      card.textContent = q.stem;
      renderVisual(q);
      MX.audio.speak(q.spoken || q.stem);

      if (q.kind === 'choice') renderChoice(q);
      else if (q.kind === 'input') renderInput(q);
      else if (q.kind === 'compare') renderCompare(q);
      else if (q.kind === 'match') renderMatch(q);
    }

    function renderChoice(q) {
      var grid = U.el('div', 'choice-grid');
      q.choices.forEach(function (c, i) {
        var b = U.el('button', 'choice', String(c));
        b.addEventListener('click', function () {
          if (i === q.answerIndex) {
            b.classList.add('good'); lockUI(); solved(wrongCount === 0);
          } else {
            b.classList.add('err'); oops(); wrongCount++;
            setTimeout(function () { b.classList.remove('err'); }, 600);
            if (wrongCount >= 2) {
              lockUI();
              var good = zone.children[q.answerIndex];
              if (good) good.classList.add('reveal');
              setTimeout(function () { failed(); }, 1500);
            }
          }
        });
        grid.appendChild(b);
      });
      zone.appendChild(grid);
    }

    function renderInput(q) {
      var buf = '';
      var row = U.el('div', 'answer-row');
      var box = U.el('div', 'answer-box', '<span style="opacity:.3">?</span>');
      row.appendChild(box);
      zone.appendChild(row);

      var pad = U.el('div', 'keypad');
      function refresh() {
        box.textContent = buf || '?';
        box.firstChild && (box.style.opacity = buf ? 1 : .999);
        if (!buf) box.innerHTML = '<span style="opacity:.3">?</span>';
      }
      var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
      keys.forEach(function (k) {
        var b = U.el('button', 'key' + (k === '⌫' ? ' del-key' : ''), k);
        b.addEventListener('click', function () {
          MX.audio.tap();
          if (k === '⌫') buf = buf.slice(0, -1);
          else {
            if (k === '.' && (q.decimal !== true || buf.indexOf('.') >= 0)) return;
            if (buf.replace('.', '').length >= 7) return;
            buf += k;
          }
          refresh();
        });
        pad.appendChild(b);
      });
      var ok = U.el('button', 'key ok-key', '✔ 确定');
      ok.addEventListener('click', function () {
        if (!buf) return;
        var val = parseFloat(buf);
        var good = q.decimal ? Math.abs(val - q.answer) < 0.001 : (parseInt(buf, 10) === q.answer);
        if (good) { box.classList.add('ok'); lockUI(); solved(wrongCount === 0); }
        else {
          box.classList.add('err'); oops(); wrongCount++;
          setTimeout(function () { box.classList.remove('err'); }, 600);
          if (wrongCount >= 2) { lockUI(); setTimeout(function () { failed(); }, 1200); }
        }
      });
      pad.appendChild(ok);
      zone.appendChild(pad);
      refresh();
    }

    function renderCompare(q) {
      var row = U.el('div', 'compare-row');
      row.appendChild(U.el('div', 'cmp-card', q.compare.l));
      var btns = U.el('div', 'cmp-btns');
      var doneFlag = false;
      ['＞', '＜', '＝'].forEach(function (sym) {
        var b = U.el('button', 'cmp-btn', sym);
        b.addEventListener('click', function () {
          if (doneFlag) return;
          if (sym === q.answer) {
            doneFlag = true; b.classList.add('good'); lockUI(); solved(wrongCount === 0);
          } else {
            b.classList.add('err'); oops(); wrongCount++;
            setTimeout(function () { b.classList.remove('err'); }, 600);
            if (wrongCount >= 2) {
              doneFlag = true; lockUI();
              setTimeout(function () { failed(); }, 1200);
            }
          }
        });
        btns.appendChild(b);
      });
      row.appendChild(btns);
      row.appendChild(U.el('div', 'cmp-card', q.compare.r));
      zone.appendChild(row);
    }

    function renderMatch(q) {
      var wrap = U.el('div', 'match-wrap');
      var leftCol = U.el('div', 'match-col');
      var rightCol = U.el('div', 'match-col');
      var rights = U.shuffle(q.pairs.map(function (p) { return p[1]; }));
      var selLeft = -1, matched = 0, doneFlag = false;

      q.pairs.forEach(function (p, i) {
        var li = U.el('button', 'match-item', p[0]);
        li.addEventListener('click', function () {
          if (li.classList.contains('good')) return;
          MX.audio.tap();
          selLeft = i;
          Array.prototype.forEach.call(leftCol.children, function (c) { c.classList.remove('sel'); });
          li.classList.add('sel');
        });
        leftCol.appendChild(li);
      });
      rights.forEach(function (val) {
        var ri = U.el('button', 'match-item', val);
        ri.addEventListener('click', function () {
          if (ri.classList.contains('good') || selLeft < 0 || doneFlag) {
            if (selLeft < 0 && !ri.classList.contains('good')) { MX.audio.tap(); }
            return;
          }
          if (q.pairs[selLeft][1] === val) {
            li2good();
            function li2good() {
              leftCol.children[selLeft].classList.remove('sel');
              leftCol.children[selLeft].classList.add('good');
              ri.classList.add('good');
              MX.audio.pop();
              selLeft = -1;
              matched++;
              if (matched === q.pairs.length) { doneFlag = true; lockUI(); solved(wrongCount === 0); }
            }
          } else {
            ri.classList.add('err');
            var lEl = leftCol.children[selLeft];
            oops(); wrongCount++;
            setTimeout(function () { ri.classList.remove('err'); if (lEl) lEl.classList.remove('sel'); }, 600);
            selLeft = -1;
          }
        });
        rightCol.appendChild(ri);
      });
      wrap.appendChild(leftCol);
      wrap.appendChild(rightCol);
      var tip = U.el('div', 'tap-hint', '先点算式，再点答案');
      zone.appendChild(wrap);
      zone.appendChild(tip);
    }

    renderQ();
    return root;
  };
})();
