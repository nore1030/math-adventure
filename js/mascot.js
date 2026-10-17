/* 吉祥物「小淘淘」—— SVG 卡通小猴，支持表情与动作 */
(function () {
  var MX = window.MX;
  var mouths = {
    idle:  '<path d="M86,112 Q100,124 114,112" stroke="#6D4C41" stroke-width="4" fill="none" stroke-linecap="round"/>',
    happy: '<path d="M82,110 Q100,134 118,110 Q100,120 82,110 Z" fill="#6D4C41"/><path d="M90,124 Q100,132 110,124" stroke="#F48FB1" stroke-width="4" fill="none" stroke-linecap="round"/>',
    sad:   '<path d="M86,120 Q100,108 114,120" stroke="#6D4C41" stroke-width="4" fill="none" stroke-linecap="round"/>',
    wow:   '<ellipse cx="100" cy="116" rx="8" ry="10" fill="#6D4C41"/>'
  };
  var eyes = {
    open: '<circle class="eye-pupil" cx="81" cy="82" r="6.5" fill="#3E2723"/><circle cx="84" cy="79" r="2.2" fill="#fff"/>' +
          '<circle class="eye-pupil" cx="119" cy="82" r="6.5" fill="#3E2723"/><circle cx="122" cy="79" r="2.2" fill="#fff"/>',
    happy: '<path d="M72,82 Q81,72 90,82" stroke="#3E2723" stroke-width="5" fill="none" stroke-linecap="round"/>' +
           '<path d="M110,82 Q119,72 128,82" stroke="#3E2723" stroke-width="5" fill="none" stroke-linecap="round"/>'
  };

  var svgStr =
    '<svg class="mascot-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
    // 尾巴
    '<path d="M158,150 Q185,140 180,116 Q176,100 162,104" stroke="#E65100" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    // 耳朵
    '<circle cx="56" cy="52" r="19" fill="#E65100"/><circle cx="56" cy="52" r="9" fill="#FFCC80"/>' +
    '<circle cx="144" cy="52" r="19" fill="#E65100"/><circle cx="144" cy="52" r="9" fill="#FFCC80"/>' +
    // 身体
    '<rect x="66" y="126" width="68" height="58" rx="28" fill="#FF9800"/>' +
    '<ellipse cx="100" cy="162" rx="24" ry="18" fill="#FFE0B2"/>' +
    // 手
    '<ellipse class="arm-l" cx="62" cy="150" rx="11" ry="16" fill="#FF9800" transform="rotate(18 62 150)"/>' +
    '<ellipse class="arm-r" cx="138" cy="150" rx="11" ry="16" fill="#FF9800" transform="rotate(-18 138 150)"/>' +
    // 头
    '<circle cx="100" cy="86" r="52" fill="#FFB74D"/>' +
    '<path d="M60,74 Q70,58 84,62 M116,62 Q130,58 140,74" stroke="#E65100" stroke-width="0" fill="none"/>' +
    '<ellipse cx="100" cy="96" rx="30" ry="24" fill="#FFE0B2"/>' +
    // 眼睛容器 / 腮红 / 嘴（由 JS 填充）
    '<g class="m-eyes">' + eyes.open + '</g>' +
    '<circle cx="64" cy="100" r="8" fill="#FF8A80" opacity="0.55"/>' +
    '<circle cx="136" cy="100" r="8" fill="#FF8A80" opacity="0.55"/>' +
    '<g class="m-mouth">' + mouths.idle + '</g>' +
    '</svg>';

  var wrap = null;

  MX.mascot = {
    mount: function (parent, big) {
      wrap = MX.util.el('div', 'mascot-wrap' + (big ? ' big' : ''));
      wrap.innerHTML = svgStr;
      parent.appendChild(wrap);
      return wrap;
    },
    detach: function () { if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap); wrap = null; },
    node: function () { return wrap; },
    mood: function (m) {
      if (!wrap) return;
      var e = wrap.querySelector('.m-eyes'), mo = wrap.querySelector('.m-mouth');
      if (e) e.innerHTML = (m === 'happy') ? eyes.happy : eyes.open;
      if (mo) mo.innerHTML = mouths[m] || mouths.idle;
    },
    act: function (name, cls) {
      if (!wrap) return;
      wrap.classList.remove('jump', 'shake', 'wave');
      // 强制重排以重启动画
      void wrap.offsetWidth;
      if (name) wrap.classList.add(name);
      if (cls === 'once' && name) {
        setTimeout(function () { wrap.classList.remove(name); }, 700);
      }
    },
    talking: function (on) {
      if (!wrap) return;
      wrap.classList.toggle('talking', !!on);
    }
  };
})();
