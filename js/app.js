/* 应用入口：场景路由 + 进度存档 */
(function () {
  var MX = window.MX, U = MX.util;

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem('mx.progress') || '{}'); } catch (e) { return {}; }
  }

  MX.App = {
    container: null,
    progress: loadProgress(),

    go: function (scene, params) {
      MX.audio.stopSpeak();
      U.clear(this.container);
      var fn = MX.scenes[scene];
      if (!fn) return;
      var root = fn(params || {});
      this.container.appendChild(root);
    },

    chapterStars: function (id) {
      return (this.progress[id] && this.progress[id].stars) || 0;
    },
    saveChapter: function (id, stars) {
      var prev = this.chapterStars(id);
      if (stars > prev) this.progress[id] = { stars: stars };
      try { localStorage.setItem('mx.progress', JSON.stringify(this.progress)); } catch (e) {}
    },
    resetProgress: function () {
      this.progress = {};
      try { localStorage.removeItem('mx.progress'); } catch (e) {}
    },
    gradeStats: function (grade) {
      var done = 0, stars = 0;
      grade.chapters.forEach(function (ch) {
        var s = MX.App.chapterStars(ch.id);
        if (s > 0) done++;
        stars += s;
      });
      return { done: done, stars: stars };
    },

    toast: function (root, text) {
      var t = U.el('div', 'say', text);
      t.style.cssText = 'position:absolute;top:18%;left:50%;transform:translateX(-50%);z-index:60;box-shadow:0 4px 0 rgba(0,0,0,.15);';
      root.appendChild(t);
      setTimeout(function () { if (t.parentNode) t.remove(); }, 1500);
    },

    init: function () {
      this.container = document.getElementById('app');
      var self = this;
      // iOS 首次触摸后才能播放音频
      var unlock = function () {
        MX.audio.ensure();
        if (window.speechSynthesis) { try { window.speechSynthesis.getVoices(); } catch (e) {} }
        document.removeEventListener('pointerdown', unlock);
      };
      document.addEventListener('pointerdown', unlock);
      this.go('home');
    }
  };

  MX.addClouds = function (root) {
    ['c1', 'c2', 'c3'].forEach(function (c) { root.appendChild(U.el('div', 'cloud ' + c)); });
  };

  document.addEventListener('DOMContentLoaded', function () { MX.App.init(); });
})();
