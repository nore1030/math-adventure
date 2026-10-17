/* 工具函数 */
window.MX = window.MX || {};
MX.util = {
  // [a, b] 闭区间随机整数
  ri: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
  pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  shuffle: function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  },
  // 创建 DOM 元素
  el: function (tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  },
  clear: function (node) { while (node.firstChild) node.removeChild(node.firstChild); },
  fmt: function (n) { return String(n); }
};
