/* 音效(WebAudio 合成) + 中文语音朗读(Web Speech) */
(function () {
  var MX = window.MX;
  var store = null;
  try { store = JSON.parse(localStorage.getItem('mx.sound') || 'null'); } catch (e) {}
  var state = { sfx: !store || store.sfx !== false, voice: !store || store.voice !== false, ctx: null };

  function save() { try { localStorage.setItem('mx.sound', JSON.stringify({ sfx: state.sfx, voice: state.voice })); } catch (e) {} }

  function ensure() {
    if (!state.ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) state.ctx = new AC();
    }
    if (state.ctx && state.ctx.state === 'suspended') state.ctx.resume();
    return state.ctx;
  }

  function tone(freq, dur, type, vol, delay, slideTo) {
    if (!state.sfx) return;
    var ctx = ensure(); if (!ctx) return;
    var t0 = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.05);
  }

  MX.audio = {
    ensure: ensure,
    get sfxOn() { return state.sfx; },
    get voiceOn() { return state.voice; },
    setSfx: function (on) { state.sfx = on; save(); },
    setVoice: function (on) { if (!on) this.stopSpeak(); state.voice = on; save(); },

    tap: function () { tone(620, 0.07, 'square', 0.12); },
    pop: function () { tone(480, 0.09, 'sine', 0.18, 0, 900); },
    correct: function () {
      tone(659, 0.12, 'sine', 0.22, 0);
      tone(880, 0.22, 'sine', 0.22, 0.1);
      tone(1319, 0.25, 'sine', 0.12, 0.2);
    },
    wrong: function () { tone(220, 0.28, 'sawtooth', 0.14, 0, 130); },
    star: function (i) { tone([784, 988, 1319][i % 3], 0.3, 'triangle', 0.22); tone(1568, 0.25, 'sine', 0.1, 0.08); },
    fanfare: function () {
      var seq = [[523, 0], [659, 0.12], [784, 0.24], [1047, 0.38]];
      for (var i = 0; i < seq.length; i++) { tone(seq[i][0], 0.22, 'triangle', 0.22, seq[i][1]); tone(seq[i][0] / 2, 0.22, 'sine', 0.12, seq[i][1]); }
      tone(1319, 0.5, 'triangle', 0.18, 0.55);
    },

    // 中文语音朗读
    speak: function (text, onend) {
      this.stopSpeak();
      if (!state.voice || !window.speechSynthesis || !text) { if (onend) setTimeout(onend, 900); return; }
      try {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        u.rate = 0.95; u.pitch = 1.1;
        var voices = window.speechSynthesis.getVoices() || [];
        for (var i = 0; i < voices.length; i++) {
          if (/zh[-_]CN/i.test(voices[i].lang)) { u.voice = voices[i]; break; }
        }
        var done = false;
        var finish = function () { if (!done) { done = true; if (onend) onend(); } };
        u.onend = finish;
        u.onerror = finish;
        window.speechSynthesis.speak(u);
        // 兜底：部分浏览器 onend 不可靠
        setTimeout(finish, Math.min(9000, 1600 + text.length * 320));
      } catch (e) { if (onend) setTimeout(onend, 900); }
    },
    stopSpeak: function () {
      if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    }
  };
})();
