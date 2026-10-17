/* 题目生成器 + SVG 视觉元素 */
(function () {
  var MX = window.MX;
  var U = MX.util;

  var OP = { '+': '+', '-': '−', '×': '×', '÷': '÷' };

  // 生成 3 个不重复的干扰项
  function distractNum(ans, cands) {
    var out = [], seen = {};
    seen[ans] = 1;
    for (var i = 0; i < cands.length && out.length < 3; i++) {
      var c = cands[i];
      if (c != null && !seen[c] && c >= 0) { seen[c] = 1; out.push(c); }
    }
    var k = 1;
    while (out.length < 3) { if (!seen[ans + k * 3 + 1]) { out.push(ans + k * 3 + 1); seen[ans + k * 3 + 1] = 1; } k++; }
    return out;
  }
  function distractStr(ans, cands) {
    var out = [], seen = {};
    seen[ans] = 1;
    for (var i = 0; i < cands.length && out.length < 3; i++) {
      var c = cands[i];
      if (c && !seen[c]) { seen[c] = 1; out.push(c); }
    }
    var k = 1;
    while (out.length < 3) { var s = ans + '＋' + k; if (!seen[s]) { out.push(s); seen[s] = 1; } k++; }
    return out;
  }
  function choiceQ(stem, ans, wrongs, extra) {
    var opts = U.shuffle([ans].concat(wrongs));
    var q = { kind: 'choice', stem: stem, choices: opts, answerIndex: opts.indexOf(ans) };
    if (extra) for (var kk in extra) q[kk] = extra[kk];
    return q;
  }
  // 两数运算题干，max 控制范围
  function operands(op, max) {
    var a, b;
    if (op === '+') {
      if (max <= 20) { a = U.ri(2, max - 1); b = U.ri(1, max - a); }
      else { a = U.ri(11, 79); b = U.ri(2, max - a); }
    } else { a = U.ri(2, max); b = U.ri(1, a - 1); }
    return [a, b];
  }
  function fracStr(a, b) { return a + '/' + b; }

  var gens = {
    // ▍看物计数（10以内加法）
    count: function (s) {
      var a = U.ri(2, s.max), b = U.ri(1, s.max);
      var ans = a + b;
      var q = choiceQ('一共有多少个？', ans, distractNum(ans, [ans + 1, ans - 1, ans + 2, a, b, ans + 3]));
      q.visual = { type: 'emoji', e: s.e, n1: a, n2: b };
      return q;
    },
    // ▍四则选择
    choice: function (s) {
      var op = s.op === 'addsub' ? U.pick(['+', '-']) : s.op;
      var p = operands(op, s.max), a = p[0], b = p[1];
      var ans = op === '+' ? a + b : a - b;
      return choiceQ(a + ' ' + OP[op] + ' ' + b + ' = ?', ans,
        distractNum(ans, [ans + 1, ans - 1, ans + 2, ans - 2, op === '+' ? a - b : a + b, ans + 10, ans - 10]));
    },
    // ▍键盘输入（按 mode/op 分派）
    input: function (s) {
      var q, stem, ans, decimal = false, hint;
      if (s.mode === 'add100') {
        var a = U.ri(13, 78), b = U.ri(4, 100 - a);
        for (var i = 0; i < 12 && (a % 10) + (b % 10) < 10; i++) b = U.ri(4, 100 - a);
        ans = a + b; stem = a + ' + ' + b + ' = ?'; hint = '满十进一';
      } else if (s.mode === 'sub100') {
        var a2 = U.ri(21, 99), b2 = U.ri(3, a2 - 3);
        for (var j = 0; j < 12 && (a2 % 10) >= (b2 % 10); j++) b2 = U.ri(3, a2 - 3);
        ans = a2 - b2; stem = a2 + ' − ' + b2 + ' = ?'; hint = '不够减，向十位借 1';
      } else if (s.mode === 'add1000') {
        var a3 = U.ri(1100, 8999), b3 = U.ri(120, 9999 - a3);
        ans = a3 + b3; stem = a3 + ' + ' + b3 + ' = ?'; hint = '数位对齐';
      } else if (s.mode === 'sub1000') {
        var a4 = U.ri(1200, 9999), b4 = U.ri(110, a4 - 100);
        ans = a4 - b4; stem = a4 + ' − ' + b4 + ' = ?'; hint = '退一作十';
      } else if (s.mode === 'mul2d1') {
        var a5 = U.ri(11, 49), b5 = U.ri(2, 9);
        ans = a5 * b5; stem = a5 + ' × ' + b5 + ' = ?'; hint = '先算个位，再算十位';
      } else if (s.mode === 'div2d') {
        var b6 = U.ri(2, 9), c6 = U.ri(11, 49);
        ans = c6; stem = (b6 * c6) + ' ÷ ' + b6 + ' = ?'; hint = '想乘法算除法';
      } else if (s.mode === 'mul3d2') {
        var a7 = U.ri(102, 899), b7 = U.ri(11, 49);
        ans = a7 * b7; stem = a7 + ' × ' + b7 + ' = ?'; hint = '分三步：×个位、×十位、再相加';
      } else if (s.mode === 'div2dbig') {
        var b8 = U.ri(12, 39), c8 = U.ri(3, 19);
        ans = c8; stem = (b8 * c8) + ' ÷ ' + b8 + ' = ?'; hint = '把除数看作整十数试商';
      } else if (s.mode === 'dec-add') {
        var a9 = U.ri(11, 499) / 10, b9 = U.ri(11, 499) / 10;
        ans = Math.round((a9 + b9) * 10) / 10; decimal = true;
        stem = a9 + ' + ' + b9 + ' = ?'; hint = '小数点对齐';
      } else if (s.mode === 'dec-sub') {
        var a10 = U.ri(20, 899) / 10, b10 = U.ri(11, a10 * 10 - 15) / 10;
        ans = Math.round((a10 - b10) * 10) / 10; decimal = true;
        stem = a10 + ' − ' + b10 + ' = ?'; hint = '小数点对齐，不够减退一';
      } else if (s.mode === 'dec-mul') {
        var a11 = U.ri(11, 499) / 10, b11 = U.ri(2, 9);
        ans = Math.round(a11 * b11 * 10) / 10; decimal = true;
        stem = a11 + ' × ' + b11 + ' = ?'; hint = '先按整数算，再点小数点';
      } else { // op+max 兜底（20以内）
        var op = U.pick(['+', '-']), p = operands(op, s.max || 20);
        ans = op === '+' ? p[0] + p[1] : p[0] - p[1];
        stem = p[0] + ' ' + OP[op] + ' ' + p[1] + ' = ?';
      }
      q = { kind: 'input', stem: stem, answer: ans, decimal: decimal, hint: hint };
      return q;
    },
    // ▍比较大小
    compare: function (s) {
      var l, r, lT, rT;
      if (s.mode === 'sum') {
        var a = U.ri(1, s.max), b = U.ri(1, s.max), c = U.ri(1, s.max), d = U.ri(1, s.max);
        if (a + b === c + d && Math.random() < 0.7) d = Math.max(1, d + 1);
        l = a + b; r = c + d; lT = a + ' + ' + b; rT = c + ' + ' + d;
      } else {
        l = U.ri(1, s.max); r = U.ri(1, s.max);
        if (Math.random() < 0.8 && r === l) r = ((l + U.ri(1, 9) - 1) % s.max) + 1;
        if (r === l) r = l + 1 <= s.max ? l + 1 : l - 1;
        lT = String(l); rT = String(r);
      }
      var sym = l > r ? '＞' : (l < r ? '＜' : '＝');
      return {
        kind: 'compare', stem: '在圆圈里填上 ＞、＜ 或 ＝',
        compare: { l: lT, r: rT }, answer: sym
      };
    },
    // ▍算式配对
    match: function (s) {
      var pairs = [], seen = {}, guard = 0;
      while (pairs.length < (s.n || 3) && guard++ < 200) {
        var op = s.op === '+' ? '+' : (s.op === '-' ? '-' : U.pick(['+', '-']));
        var p = operands(op, s.max);
        var v = op === '+' ? p[0] + p[1] : p[0] - p[1];
        if (seen[v]) continue;
        seen[v] = 1;
        pairs.push([p[0] + ' ' + OP[op] + ' ' + p[1], String(v)]);
      }
      return { kind: 'match', stem: '把算式和它的答案连起来', pairs: pairs };
    },
    // ▍几组几个（乘法初步）
    groups: function (s) {
      var g = U.ri(2, 6), n = U.ri(2, 6), ans = g * n;
      var q = choiceQ('每组有 ' + n + ' 个，共有 ' + g + ' 组，一共有多少个？', ans,
        distractNum(ans, [g + n, ans + n, ans - n, ans + 1, (g + 1) * n]));
      q.visual = { type: 'emoji', e: s.e, groups: [g, n] };
      return q;
    },
    // ▍认识时钟
    clock: function () {
      var h = U.ri(1, 12), m = U.pick([0, 0, 0, 30]);
      var right = m === 0 ? h + '点' : h + '点半';
      var wrongs = [];
      var hs = [h + 1, h + 11, h + 5, h + 3, h - 2];
      for (var i = 0; i < hs.length && wrongs.length < 3; i++) {
        var hh = ((hs[i] - 1) % 12 + 12) % 12 + 1;
        var t1 = m === 0 ? hh + '点' : hh + '点半';
        var t2 = m === 0 ? hh + '点半' : hh + '点';
        if (t1 !== right && wrongs.indexOf(t1) < 0) wrongs.push(t1);
        if (wrongs.length < 3 && t2 !== right && wrongs.indexOf(t2) < 0) wrongs.push(t2);
      }
      var q = choiceQ('钟面上是几点？', right, wrongs);
      q.visual = { type: 'svg', html: MX.vis.clock(h, m) };
      return q;
    },
    // ▍平均分
    share: function () {
      var k = U.ri(2, 5), each = U.ri(2, 6), total = k * each;
      return {
        kind: 'input', stem: total + ' 颗松果，平均分给 ' + k + ' 只小松鼠，每只分到几颗？',
        answer: each, hint: '平均分用除法：' + total + ' ÷ ' + k,
        visual: { type: 'emoji', e: '🌰', n1: Math.min(total, 12), tail: ('🐿️').repeat(Math.min(k, 5)) }
      };
    },
    // ▍分数初步
    fraction: function () {
      var den = U.pick([2, 3, 4, 5, 6, 8]);
      var num = U.ri(1, den - 1);
      var right = fracStr(num, den);
      var cands = [];
      [num + 1, num - 1, num + 2, den - num].forEach(function (n2) {
        if (n2 >= 1 && n2 <= den - 1) cands.push(fracStr(n2, den));
      });
      cands.push(fracStr(den, num));
      var q = choiceQ('涂色部分表示几分之几？', right, distractStr(right, cands));
      q.visual = { type: 'svg', html: MX.vis.pie(den, num) };
      return q;
    },
    // ▍认识图形
    shape: function (s) {
      var shapes = [
        { id: 'circle', name: '圆形', sides: 0 },
        { id: 'triangle', name: '三角形', sides: 3 },
        { id: 'square', name: '正方形', sides: 4 },
        { id: 'rect', name: '长方形', sides: 4 }
      ];
      var sh = U.pick(shapes);
      if (s.ask === 'sides' && sh.sides === 0) sh = U.pick([shapes[1], shapes[2], shapes[3]]);
      if (s.ask === 'sides') {
        var others = [3, 4, 5, 6].filter(function (x) { return x !== sh.sides; }).slice(0, 3);
        var q = choiceQ(sh.name + '有几条边？', sh.sides, others);
        q.visual = { type: 'svg', html: MX.vis.shapeSvg(sh.id) };
        return q;
      }
      var names = shapes.filter(function (x) { return x.id !== sh.id; }).map(function (x) { return x.name; });
      var q2 = choiceQ('这是什么图形？', sh.name, names);
      q2.visual = { type: 'svg', html: MX.vis.shapeSvg(sh.id) };
      return q2;
    },
    // ▍长方形周长/面积
    rect: function (s) {
      var w = U.ri(2, 12), h = U.ri(2, 9);
      var perim = s.ask === 'perim';
      var ans = perim ? (w + h) * 2 : w * h;
      return {
        kind: 'input', answer: ans,
        stem: '长方形长 ' + w + ' 厘米、宽 ' + h + ' 厘米，它的' + (perim ? '周长' : '面积') + '是多少' + (perim ? '厘米？' : '平方厘米？'),
        hint: perim ? '周长 = (长 + 宽) × 2' : '面积 = 长 × 宽',
        visual: { type: 'svg', html: MX.vis.rect(w, h) }
      };
    },
    // ▍大数比较 / 组成
    'bignum-compare': function () {
      var nums = [], seen = {}, guard = 0;
      while (nums.length < 4 && guard++ < 300) {
        var n = U.ri(1000, 9999);
        if (!seen[n]) { seen[n] = 1; nums.push(n); }
      }
      var wantMax = Math.random() < 0.5;
      var ans = wantMax ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
      return choiceQ('下面哪个数' + (wantMax ? '最大' : '最小') + '？', ans, nums.filter(function (x) { return x !== ans; }));
    },
    'bignum-compose': function () {
      var th = U.ri(1, 9), hu = U.ri(1, 9), te = U.ri(0, 9), un = U.ri(0, 9);
      var n = th * 1000 + hu * 100 + te * 10 + un;
      var parts = [];
      if (th) parts.push(th + ' 个千');
      if (hu) parts.push(hu + ' 个百');
      if (te) parts.push(te + ' 个十');
      if (un) parts.push(un + ' 个一');
      var stem = '由 ' + parts.join('、') + ' 组成的数是多少？';
      return choiceQ(stem, n, distractNum(n, [n + 100, n - 100, n + 1000, n - 1000, n + 10, n - 10]));
    },
    // ▍角
    angle: function () {
      var type = U.pick(['acute', 'right', 'obtuse']);
      var deg = type === 'acute' ? U.ri(25, 80) : (type === 'right' ? 90 : U.ri(100, 155));
      var names = ['锐角', '直角', '钝角'];
      var right = type === 'acute' ? '锐角' : (type === 'right' ? '直角' : '钝角');
      var q = choiceQ('这是什么角？', right, names.filter(function (x) { return x !== right; }));
      q.visual = { type: 'svg', html: MX.vis.angle(deg) };
      return q;
    },
    'angle-degree': function () {
      var bank = [
        { stem: '一个直角是多少度？', ans: 90, wrong: [45, 180, 360] },
        { stem: '一个平角是多少度？', ans: 180, wrong: [90, 45, 360] },
        { stem: '一个周角是多少度？', ans: 360, wrong: [90, 180, 45] }
      ];
      var b = U.pick(bank);
      return choiceQ(b.stem, b.ans, b.wrong);
    },
    // ▍多边形面积
    'poly-area': function (s) {
      var shape = s.shape || U.pick(['para', 'tri', 'trap']);
      var a, b, h, ans, stem, hint, unit = '米';
      if (shape === 'para') {
        a = U.ri(3, 12); h = U.ri(2, 9); ans = a * h;
        stem = '平行四边形的底是 ' + a + ' ' + unit + '、高是 ' + h + ' ' + unit + '，面积是多少平方' + unit + '？';
        hint = 'S = 底 × 高'; b = 0;
      } else if (shape === 'tri') {
        a = U.ri(2, 12); h = U.ri(2, 8);
        if ((a * h) % 2 !== 0) h += 1;
        ans = a * h / 2;
        stem = '三角形的底是 ' + a + ' ' + unit + '、高是 ' + h + ' ' + unit + '，面积是多少平方' + unit + '？';
        hint = 'S = 底 × 高 ÷ 2'; b = 0;
      } else {
        a = U.ri(2, 8); b = U.ri(a + 1, a + 9); h = U.ri(2, 8);
        if ((a + b) % 2 !== 0 && h % 2 !== 0) h += 1;
        ans = (a + b) * h / 2;
        stem = '梯形的上底是 ' + a + ' ' + unit + '、下底是 ' + b + ' ' + unit + '、高是 ' + h + ' ' + unit + '，面积是多少平方' + unit + '？';
        hint = 'S = (上底 + 下底) × 高 ÷ 2';
      }
      return {
        kind: 'input', stem: stem, answer: ans, hint: hint,
        visual: { type: 'svg', html: MX.vis.poly(shape, a, b, h) }
      };
    },
    // ▍同分母分数加减
    'frac-add': function () {
      var den = U.pick([4, 5, 6, 8, 9, 10, 12]);
      var plus = Math.random() < 0.5;
      var a, b, r;
      if (plus) { a = U.ri(1, den - 2); b = U.ri(1, den - 1 - a); r = a + b; }
      else { a = U.ri(2, den - 1); b = U.ri(1, a - 1); r = a - b; }
      var right = fracStr(r, den);
      var cands = [];
      [r + 1, r - 1, a, b, r + 2].forEach(function (n2) {
        if (n2 >= 1 && n2 <= den - 1) cands.push(fracStr(n2, den));
      });
      cands.push(fracStr(a + b, den));
      var q = choiceQ(a + '/' + den + (plus ? ' + ' : ' − ') + b + '/' + den + ' = ?', right, distractStr(right, cands));
      return q;
    },

    /* ==================== 思维训练 ==================== */
    // ▍分类找不同
    category: function () {
      var banks = [
        { name: '水果', items: ['🍎', '🍌', '🍇', '🍉', '🍓', '🍑', '🍍'] },
        { name: '动物', items: ['🐶', '🐱', '🐰', '🐼', '🐴', '🐔', '🐧'] },
        { name: '交通工具', items: ['🚗', '🚌', '🚲', '✈️', '🚂', '🚁', '🚕'] },
        { name: '球类运动', items: ['⚽', '🏀', '🏓', '🏸', '🏐', '🎾'] },
        { name: '文具', items: ['✏️', '📚', '✂️', '📏', '🖍️', '🖊️'] },
        { name: '天气', items: ['☀️', '🌧️', '⛅', '❄️', '🌈', '🌪️'] }
      ];
      var main = U.pick(banks), other = U.pick(banks.filter(function (b) { return b !== main; }));
      var three = U.shuffle(main.items).slice(0, 3);
      var odd = U.pick(other.items);
      var opts = U.shuffle(three.concat([odd]));
      return {
        kind: 'choice', stem: '下面哪一个和其他三个不是同一类？',
        choices: opts, answerIndex: opts.indexOf(odd),
        spoken: '下面哪一个和其他三个不是同一类？'
      };
    },
    // ▍图形找规律
    'pattern-shape': function () {
      var pool = ['🔺', '🟠', '🔷', '⭐', '🟢', '🟣', '⬛', '🔴', '🔶', '🌞', '☁️', '🍀', '❤️', '🌙'];
      var L = U.pick([2, 2, 3, 3, 4]);
      var cycle = U.shuffle(pool).slice(0, L);
      var shown = cycle.concat(cycle.slice(0, U.ri(1, L)));
      var ans = cycle[shown.length % L];
      var wrongs = U.shuffle(pool.filter(function (p) { return p !== ans; })).slice(0, 3);
      while (wrongs.length < 3) {
        var c = U.pick(pool);
        if (c !== ans && wrongs.indexOf(c) < 0) wrongs.push(c);
      }
      var q = choiceQ('按规律，下一个是什么？', ans, wrongs);
      var items = shown.map(function (s) { return { t: s }; });
      items.push({ t: '？', q: true });
      q.visual = { type: 'chips', items: items };
      q.spoken = '按规律，下一个是什么？';
      return q;
    },
    // ▍数字找规律
    'pattern-num': function () {
      var seq, ans;
      var mode = U.pick(['step', 'step', 'grow', 'double']);
      if (mode === 'grow') {
        var a = U.ri(1, 6), d = U.ri(1, 4), inc = d;
        seq = [a];
        for (var i = 0; i < 3; i++) { seq.push(seq[seq.length - 1] + inc); inc += 1; }
        ans = seq[3] + inc;
      } else if (mode === 'double') {
        var a2 = U.ri(1, 3);
        seq = [a2, a2 * 2, a2 * 4, a2 * 8];
        ans = a2 * 16;
      } else {
        var a3 = U.ri(1, 9), d3 = U.ri(2, 9);
        seq = [a3, a3 + d3, a3 + 2 * d3, a3 + 3 * d3];
        ans = a3 + 4 * d3;
      }
      var q = choiceQ('找规律，问号处应该填几？', ans,
        distractNum(ans, [ans + 1, ans - 1, ans - (seq[1] - seq[0]), ans + (seq[1] - seq[0]), ans + 2]));
      var items = seq.map(function (s) { return { t: String(s) }; });
      items.push({ t: '？', q: true });
      q.visual = { type: 'chips', items: items };
      q.spoken = '找规律，问号处应该填几？';
      return q;
    },
    // ▍数图形：网格正方形
    'count-grid': function () {
      var g = U.pick([2, 2, 3]);
      var ans = g === 2 ? 5 : 14;
      return {
        kind: 'input', answer: ans,
        stem: '图中一共有多少个正方形？（包含大的和小的）',
        hint: '先数 1×1 的小格，再数 2×2、3×3 的大格',
        visual: { type: 'svg', html: MX.vis.grid(g) },
        spoken: '图中一共有多少个正方形？包含大的和小的。'
      };
    },
    // ▍数图形：三角形分割
    'count-tri': function () {
      var n = U.ri(1, 3); // 内部线条数
      var ans = (n + 1) * (n + 2) / 2;
      return {
        kind: 'input', answer: ans,
        stem: '图中有多少个三角形？',
        hint: '从顶点出发，数一数每一小块和拼起来的',
        visual: { type: 'svg', html: MX.vis.splitTriangle(n) },
        spoken: '图中有多少个三角形？'
      };
    },
    // ▍天平等量代换
    balance: function () {
      var emojis = [
        { trio: ['🍉', '🍍', '🍊'], names: ['西瓜', '菠萝', '橘子'] },
        { trio: ['🐱', '🐰', '🐭'], names: ['小猫', '兔子', '老鼠'] },
        { trio: ['🍉', '🍎', '🍓'], names: ['西瓜', '苹果', '草莓'] },
        { trio: ['🏀', '⚽', '🏓'], names: ['篮球', '足球', '乒乓球'] },
        { trio: ['🎃', '🍋', '🍒'], names: ['南瓜', '柠檬', '樱桃'] }
      ];
      var set = U.pick(emojis);
      var c = U.ri(2, 3), e = U.ri(2, 4);
      var ans = c * e;
      var items = [
        { t: set.trio[0] + ' = ' + set.trio[1].repeat(c) },
        { t: set.trio[1] + ' = ' + set.trio[2].repeat(e) }
      ];
      return {
        kind: 'input', answer: ans,
        stem: '1 个' + set.names[0] + '等于几个' + set.names[2] + '？',
        hint: '把' + set.names[1] + '换掉：' + c + ' × ' + e,
        visual: { type: 'chips', items: items },
        spoken: '1 个' + set.names[0] + '等于几个' + set.names[2] + '？'
      };
    },
    // ▍排队问题
    queue: function () {
      var posForm = Math.random() < 0.4;
      var a, b, ans, stem, hint, markIdx;
      if (posForm) {
        a = U.ri(2, 9); b = U.ri(2, 6);
        ans = a + b - 1;
        stem = '排队时，小明从前往后数是第 ' + a + ' 个，从后往前数是第 ' + b + ' 个。这一队一共有多少人？';
        hint = '小明被数了两次，要减去 1';
      } else {
        a = U.ri(2, 9); b = U.ri(2, 9);
        ans = a + b + 1;
        stem = '排队时，小明前面有 ' + a + ' 人，后面有 ' + b + ' 人。这一队一共有多少人？';
        hint = '别忘了小明自己，最后要 +1';
      }
      var total = Math.min(ans, 12);
      markIdx = Math.min(a - 1, total - 1);
      var items = [];
      for (var i = 0; i < total; i++) items.push({ t: i === markIdx ? '👦' : '🧒', hi: i === markIdx });
      return {
        kind: 'input', answer: ans, stem: stem, hint: hint,
        visual: { type: 'chips', items: items },
        spoken: stem
      };
    },
    // ▍逻辑推理（比较传递）
    'logic-rank': function () {
      var names = U.shuffle(['小红', '小明', '小刚', '小丽', '小强', '小雨', '小天', '朵朵']).slice(0, U.pick([3, 3, 4]));
      var attrs = [
        { adj: '高', q: '谁最高', min: '谁最矮', sym: '比……高' },
        { adj: '重', q: '谁最重', min: '谁最轻', sym: '比……重' },
        { adj: '快', q: '谁最快', min: '谁最慢', sym: '比……跑得快' },
        { adj: '大', q: '谁的年龄最大', min: '谁的年龄最小', sym: '比……大' }
      ];
      var at = U.pick(attrs);
      var askMin = Math.random() < 0.4;
      // names[0] 最强 … names[n-1] 最弱
      var stmts = [];
      for (var i = 0; i < names.length - 1; i++) {
        stmts.push({ t: (i + 1) + '️⃣ ' + names[i] + at.sym.replace('……', names[i + 1]) + '。' });
      }
      var ans = askMin ? names[names.length - 1] : names[0];
      var q = choiceQ('他们中' + (askMin ? at.min : at.q) + '？', ans, names.filter(function (x) { return x !== ans; }));
      q.visual = { type: 'chips', items: stmts };
      q.spoken = '他们中' + (askMin ? at.min : at.q) + '？';
      return q;
    },
    // ▍轴对称判断
    symmetry: function () {
      var isSym = Math.random() < 0.55;
      var html = MX.vis.symShape(isSym);
      var q = choiceQ('下面的图形是轴对称图形吗？', isSym ? '是' : '不是', ['是', '不是'].filter(function (x) { return x !== (isSym ? '是' : '不是'); }));
      q.visual = { type: 'svg', html: html };
      q.spoken = '下面的图形是轴对称图形吗？';
      return q;
    },
    // ▍对称轴数量
    'sym-axis': function () {
      var bank = [
        { q: '圆形有多少条对称轴？', ans: '无数条', wrong: ['1 条', '2 条', '4 条'] },
        { q: '正方形有多少条对称轴？', ans: '4 条', wrong: ['2 条', '3 条', '8 条'] },
        { q: '长方形有多少条对称轴？', ans: '2 条', wrong: ['1 条', '4 条', '6 条'] },
        { q: '等边三角形有多少条对称轴？', ans: '3 条', wrong: ['1 条', '2 条', '6 条'] },
        { q: '等腰三角形有多少条对称轴？', ans: '1 条', wrong: ['2 条', '3 条', '4 条'] }
      ];
      var b = U.pick(bank);
      return choiceQ(b.q, b.ans, b.wrong);
    },
    // ▍正方体计数（正面视图堆叠）
    blocks: function () {
      var cols = U.ri(2, 4);
      var heights = [];
      for (var i = 0; i < cols; i++) heights.push(U.ri(1, 3));
      var total = heights.reduce(function (s, h) { return s + h; }, 0);
      return {
        kind: 'input', answer: total,
        stem: '用小正方体搭成下面的样子，一共有几个小正方体？',
        hint: '一列一列地数，再加起来',
        visual: { type: 'blocks', heights: heights },
        spoken: '一共有几个小正方体？'
      };
    }
  };

  MX.gen = function (spec) {
    var g = gens[spec.k];
    if (!g) return { kind: 'choice', stem: '1 + 1 = ?', choices: ['2', '3', '4', '5'], answerIndex: 0 };
    return g(spec);
  };

  /* ============ SVG 视觉元素 ============ */
  var P = 3.141592653589793;
  function pt(cx, cy, r, angDeg) {
    var rad = angDeg * P / 180;
    return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
  }
  MX.vis = {
    clock: function (h, m) {
      var s = '<svg class="svg-vis" viewBox="0 0 200 200">' +
        '<circle cx="100" cy="100" r="92" fill="#FFF8E1" stroke="#8D6E63" stroke-width="8"/>';
      for (var i = 0; i < 12; i++) {
        var p1 = pt(100, 100, 82, i * 30), p2 = pt(100, 100, 72, i * 30);
        s += '<line x1="' + p1[0].toFixed(1) + '" y1="' + p1[1].toFixed(1) + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '" stroke="#8D6E63" stroke-width="4" stroke-linecap="round"/>';
      }
      [[12, 100, 46], [3, 158, 106], [6, 100, 164], [9, 42, 106]].forEach(function (d) {
        s += '<text x="' + d[1] + '" y="' + d[2] + '" font-size="20" font-weight="800" fill="#5D4037" text-anchor="middle">' + d[0] + '</text>';
      });
      var ha = (h % 12) * 30 + m * 0.5, hp = pt(100, 100, 42, ha);
      var ma = m * 6, mp = pt(100, 100, 64, ma);
      s += '<line x1="100" y1="100" x2="' + hp[0].toFixed(1) + '" y2="' + hp[1].toFixed(1) + '" stroke="#37474F" stroke-width="9" stroke-linecap="round"/>';
      s += '<line x1="100" y1="100" x2="' + mp[0].toFixed(1) + '" y2="' + mp[1].toFixed(1) + '" stroke="#E53935" stroke-width="5" stroke-linecap="round"/>';
      s += '<circle cx="100" cy="100" r="6" fill="#37474F"/></svg>';
      return s;
    },
    pie: function (den, num) {
      var s = '<svg class="svg-vis" viewBox="0 0 200 200">';
      var R = 80;
      for (var i = 0; i < den; i++) {
        var a1 = i * 360 / den - 90, a2 = (i + 1) * 360 / den - 90;
        var p1 = pt(100, 100, R, a1), p2 = pt(100, 100, R, a2);
        var large = (a2 - a1) > 180 ? 1 : 0;
        s += '<path d="M100,100 L' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1) +
          ' A' + R + ',' + R + ' 0 ' + large + ' 1 ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1) + ' Z" ' +
          'fill="' + (i < num ? '#FFB74D' : '#FFF3E0') + '" stroke="#fff" stroke-width="3"/>';
      }
      s += '<circle cx="100" cy="100" r="' + R + '" fill="none" stroke="#8D6E63" stroke-width="5"/></svg>';
      return s;
    },
    shapeSvg: function (id) {
      var s = '<svg class="svg-vis" viewBox="0 0 200 200">';
      if (id === 'circle') s += '<circle cx="100" cy="100" r="72" fill="#4FC3F7" stroke="#0288D1" stroke-width="6"/>';
      else if (id === 'triangle') s += '<polygon points="100,22 178,168 22,168" fill="#81C784" stroke="#388E3C" stroke-width="6" stroke-linejoin="round"/>';
      else if (id === 'square') s += '<rect x="32" y="32" width="136" height="136" rx="6" fill="#FFB74D" stroke="#EF6C00" stroke-width="6"/>';
      else s += '<rect x="18" y="54" width="164" height="92" rx="6" fill="#BA68C8" stroke="#7B1FA2" stroke-width="6"/>';
      return s + '</svg>';
    },
    rect: function (w, h) {
      var u = Math.min(14, 170 / w, 100 / h);
      var W = w * u, H = h * u, x = 52, y = 20;
      var s = '<svg class="svg-vis" viewBox="0 0 220 170">' +
        '<rect x="' + x + '" y="' + y + '" width="' + W.toFixed(1) + '" height="' + H.toFixed(1) + '" rx="6" fill="#AED581" stroke="#558B2F" stroke-width="5"/>' +
        '<text x="' + (x + W / 2).toFixed(1) + '" y="' + (y + H + 24) + '" font-size="17" font-weight="800" fill="#558B2F" text-anchor="middle">长 ' + w + '</text>' +
        '<text x="' + (x - 12) + '" y="' + (y + H / 2 + 6).toFixed(1) + '" font-size="17" font-weight="800" fill="#558B2F" text-anchor="end">宽 ' + h + '</text></svg>';
      return s;
    },
    angle: function (deg) {
      // 顶点在底部，水平边向右；钝角时顶点右移避免第二条边出界
      var rad = deg * P / 180;
      var vx = 60 + Math.max(0, -Math.cos(rad)) * 110;
      var vy = 150;
      var len = 145;
      var p1 = [vx + len, vy];
      var p2 = [vx + len * Math.cos(rad), vy - len * Math.sin(rad)];
      var arc1 = [vx + 36, vy];
      var arc2 = [vx + 36 * Math.cos(rad), vy - 36 * Math.sin(rad)];
      var half = rad / 2;
      var bis = [vx + 58 * Math.cos(half), vy - 58 * Math.sin(half)];
      var s = '<svg class="svg-vis" viewBox="0 0 250 175">' +
        '<line x1="' + vx.toFixed(1) + '" y1="' + vy + '" x2="' + p1[0].toFixed(1) + '" y2="' + p1[1].toFixed(1) + '" stroke="#5D4037" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="' + vx.toFixed(1) + '" y1="' + vy + '" x2="' + p2[0].toFixed(1) + '" y2="' + p2[1].toFixed(1) + '" stroke="#5D4037" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M' + arc1[0].toFixed(1) + ',' + arc1[1].toFixed(1) + ' A36,36 0 0 0 ' + arc2[0].toFixed(1) + ',' + arc2[1].toFixed(1) + '" fill="none" stroke="#E53935" stroke-width="4"/>' +
        '<text x="' + bis[0].toFixed(1) + '" y="' + (bis[1] + 6).toFixed(1) + '" font-size="16" font-weight="800" fill="#E53935" text-anchor="middle">' + deg + '°</text>' +
        '<circle cx="' + vx.toFixed(1) + '" cy="' + vy + '" r="6" fill="#5D4037"/></svg>';
      return s;
    },
    poly: function (shape, a, b, h) {
      var u = Math.min(13, 150 / Math.max(a, b || 0, 1)), v = Math.min(10, 90 / Math.max(h, 1));
      var y0 = 148, yT = y0 - h * v;
      var s = '<svg class="svg-vis" viewBox="0 0 230 180">';
      var fill = 'fill="#B39DDB" stroke="#4527A0" stroke-width="5" stroke-linejoin="round"';
      if (shape === 'para') {
        var off = 36, x0 = 24;
        s += '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + a * u).toFixed(1) + ',' + y0 + ' ' + (x0 + a * u + off).toFixed(1) + ',' + yT.toFixed(1) + ' ' + (x0 + off) + ',' + yT.toFixed(1) + '" ' + fill + '/>';
        s += '<line x1="' + (x0 + off) + '" y1="' + yT.toFixed(1) + '" x2="' + (x0 + off) + '" y2="' + y0 + '" stroke="#E53935" stroke-width="3" stroke-dasharray="6,5"/>' +
          '<text x="' + (x0 + a * u / 2 + off / 2).toFixed(1) + '" y="170" font-size="16" font-weight="800" fill="#4527A0" text-anchor="middle">底 ' + a + '</text>' +
          '<text x="' + (x0 + off + 8) + '" y="' + ((y0 + yT) / 2 + 5).toFixed(1) + '" font-size="16" font-weight="800" fill="#E53935">高 ' + h + '</text>';
      } else if (shape === 'tri') {
        var x0 = 30;
        s += '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + a * u).toFixed(1) + ',' + y0 + ' ' + (x0 + a * u / 2 + 24).toFixed(1) + ',' + yT.toFixed(1) + '" ' + fill + '/>';
        s += '<line x1="' + (x0 + a * u / 2 + 24).toFixed(1) + '" y1="' + yT.toFixed(1) + '" x2="' + (x0 + a * u / 2 + 24).toFixed(1) + '" y2="' + y0 + '" stroke="#E53935" stroke-width="3" stroke-dasharray="6,5"/>' +
          '<text x="' + (x0 + a * u / 2).toFixed(1) + '" y="170" font-size="16" font-weight="800" fill="#4527A0" text-anchor="middle">底 ' + a + '</text>' +
          '<text x="' + (x0 + a * u / 2 + 32).toFixed(1) + '" y="' + ((y0 + yT) / 2 + 5).toFixed(1) + '" font-size="16" font-weight="800" fill="#E53935">高 ' + h + '</text>';
      } else {
        var bw = b * u, aw = a * u, x0 = 26;
        var tx = x0 + (bw - aw) / 2;
        s += '<polygon points="' + x0 + ',' + y0 + ' ' + (x0 + bw).toFixed(1) + ',' + y0 + ' ' + (tx + aw).toFixed(1) + ',' + yT.toFixed(1) + ' ' + tx.toFixed(1) + ',' + yT.toFixed(1) + '" ' + fill + '/>';
        s += '<line x1="' + (x0 + bw / 2).toFixed(1) + '" y1="' + yT.toFixed(1) + '" x2="' + (x0 + bw / 2).toFixed(1) + '" y2="' + y0 + '" stroke="#E53935" stroke-width="3" stroke-dasharray="6,5"/>' +
          '<text x="' + (x0 + bw / 2).toFixed(1) + '" y="170" font-size="16" font-weight="800" fill="#4527A0" text-anchor="middle">下底 ' + b + '</text>' +
          '<text x="' + (tx + aw / 2).toFixed(1) + '" y="' + (yT - 8).toFixed(1) + '" font-size="16" font-weight="800" fill="#4527A0" text-anchor="middle">上底 ' + a + '</text>' +
          '<text x="' + (x0 + bw / 2 + 8).toFixed(1) + '" y="' + ((y0 + yT) / 2 + 5).toFixed(1) + '" font-size="16" font-weight="800" fill="#E53935">高 ' + h + '</text>';
      }
      return s + '</svg>';
    },
    /* ===== 思维训练视觉 ===== */
    // g×g 网格（数正方形）
    grid: function (g) {
      var size = 160, x0 = 20, y0 = 20, u = size / g;
      var s = '<svg class="svg-vis" viewBox="0 0 200 200">' +
        '<rect x="' + x0 + '" y="' + y0 + '" width="' + size + '" height="' + size + '" fill="#FFF8E1" stroke="#8D6E63" stroke-width="6"/>';
      for (var i = 1; i < g; i++) {
        var p = x0 + i * u;
        s += '<line x1="' + p + '" y1="' + y0 + '" x2="' + p + '" y2="' + (y0 + size) + '" stroke="#8D6E63" stroke-width="4"/>';
        s += '<line x1="' + x0 + '" y1="' + (y0 + i * u) + '" x2="' + (x0 + size) + '" y2="' + (y0 + i * u) + '" stroke="#8D6E63" stroke-width="4"/>';
      }
      return s + '</svg>';
    },
    // 顶点出发分割的三角形（数三角形）
    splitTriangle: function (n) {
      var ax = 100, ay = 28, bx = 22, by = 168, cx = 178, cy = 168;
      var s = '<svg class="svg-vis" viewBox="0 0 200 190">' +
        '<polygon points="' + ax + ',' + ay + ' ' + bx + ',' + by + ' ' + cx + ',' + cy + '" fill="#B3E5FC" stroke="#0277BD" stroke-width="5" stroke-linejoin="round"/>';
      for (var k = 1; k <= n; k++) {
        var x = bx + (cx - bx) * k / (n + 1);
        s += '<line x1="' + ax + '" y1="' + ay + '" x2="' + x.toFixed(1) + '" y2="' + by + '" stroke="#0277BD" stroke-width="4"/>';
      }
      return s + '</svg>';
    },
    // 轴对称判断图形
    symShape: function (isSym) {
      var sym = [
        '<circle cx="100" cy="100" r="70" fill="#4DD0E1" stroke="#00838F" stroke-width="6"/>',
        '<rect x="38" y="38" width="124" height="124" rx="8" fill="#4DD0E1" stroke="#00838F" stroke-width="6"/>',
        '<polygon points="100,26 172,168 28,168" fill="#4DD0E1" stroke="#00838F" stroke-width="6" stroke-linejoin="round"/>',
        '<path d="M100,166 C42,114 32,66 66,50 C90,40 100,64 100,74 C100,64 110,40 134,50 C168,66 158,114 100,166 Z" fill="#F06292" stroke="#AD1457" stroke-width="6"/>'
      ];
      var asym = [
        '<polygon points="46,162 84,36 168,142" fill="#FFD54F" stroke="#F9A825" stroke-width="6" stroke-linejoin="round"/>',
        '<path d="M62,34 L150,34 L150,62 L94,62 L94,86 L138,86 L138,114 L94,114 L94,166 L62,166 Z" fill="#FFD54F" stroke="#F9A825" stroke-width="6" stroke-linejoin="round"/>',
        '<polygon points="112,22 58,102 94,102 70,170 152,76 110,76 138,22" fill="#FFD54F" stroke="#F9A825" stroke-width="6" stroke-linejoin="round"/>',
        '<path d="M60,30 L100,30 L100,96 L148,96 L148,132 L100,132 L100,170 L60,170 Z" fill="#FFD54F" stroke="#F9A825" stroke-width="6" stroke-linejoin="round"/>'
      ];
      var pick = isSym ? U.pick(sym) : U.pick(asym);
      return '<svg class="svg-vis" viewBox="0 0 200 195">' + pick + '</svg>';
    },
    // 正方体堆叠（正面视图）
    blocks: function (heights) {
      var u = 46, cols = heights.length;
      var maxH = Math.max.apply(null, heights);
      var s = '<svg class="svg-vis" viewBox="0 0 ' + (cols * u + 16) + ' ' + (maxH * u + 16) + '" style="max-width:' + Math.min(280, cols * 70) + 'px">';
      for (var i = 0; i < cols; i++) {
        for (var k = 0; k < heights[i]; k++) {
          var x = 8 + i * u, y = 8 + (maxH - 1 - k) * u;
          s += '<rect x="' + x + '" y="' + y + '" width="' + (u - 6) + '" height="' + (u - 6) + '" rx="6" fill="#FFB74D" stroke="#EF6C00" stroke-width="4"/>' +
            '<line x1="' + (x + (u - 6) / 2) + '" y1="' + (y + 6) + '" x2="' + (x + (u - 6) / 2) + '" y2="' + (y + u - 12) + '" stroke="#FFCC80" stroke-width="3"/>';
        }
      }
      return s + '</svg>';
    }
  };
})();
