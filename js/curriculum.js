/* 课程数据：1-5 年级 × 4 章（依据义务教育数学课程标准知识点组织，内容原创） */
(function () {
  var MX = window.MX;

  var grades = [
    {
      grade: 0, name: '思维训练', emoji: '🧠', color: '#26C6DA', deep: '#00838F',
      chapters: [
        {
          id: 't1', title: '分类与找不同', icon: '🧩',
          beats: [
            { t: '欢迎来到思维训练营！我是教练小淘淘。', wave: true },
            { t: '把同类的东西放在一起，就叫分类。', e: '🍎', n: 4 },
            { t: '苹果、香蕉都是水果，小狗可不是——把它找出来！', e: '🐶', n: 1 },
            { t: '找不同的小秘诀：先想一想它们都是干什么用的？' }
          ],
          practice: [
            { k: 'category' }, { k: 'category' }, { k: 'category' }, { k: 'category' },
            { k: 'category' }, { k: 'category' }, { k: 'shape', ask: 'name' }, { k: 'shape', ask: 'name' }
          ]
        },
        {
          id: 't2', title: '图形找规律', icon: '🔁',
          beats: [
            { t: '看一看，图里藏着什么规律？', groups: [2, 2, '🔵'] },
            { t: '🔵 🔺 🔵 🔺 ……下一个应该是什么？', f: '规律：两个一组轮流出现' },
            { t: '找到重复出现的那一组，规律就破解啦！', e: '💡', n: 1 }
          ],
          practice: [
            { k: 'pattern-shape' }, { k: 'pattern-shape' }, { k: 'pattern-shape' }, { k: 'pattern-shape' },
            { k: 'pattern-shape' }, { k: 'pattern-shape' }, { k: 'pattern-shape' }, { k: 'pattern-shape' }
          ]
        },
        {
          id: 't3', title: '数字找规律', icon: '🔢',
          beats: [
            { t: '数字也会排队：2、4、6、8……', f: '每次多 2' },
            { t: '那么后面藏着的数字就是 10！', f: '2、4、6、8、10' },
            { t: '先看相邻两个数相差几，再往下算。', e: '💡', n: 1 }
          ],
          practice: [
            { k: 'pattern-num' }, { k: 'pattern-num' }, { k: 'pattern-num' }, { k: 'pattern-num' },
            { k: 'pattern-num' }, { k: 'pattern-num' }, { k: 'pattern-shape' }, { k: 'pattern-shape' }
          ]
        },
        {
          id: 't4', title: '数图形', icon: '🔷',
          beats: [
            { t: '一个正方形里，藏着几个正方形？', shape: 'square' },
            { t: '田字格里：4 个小的，加上 1 个大的，一共 5 个！', f: '2×2 → 5 个正方形' },
            { t: '数图形要不重不漏：先数小的，再数组合成的大的。', e: '💡', n: 1 }
          ],
          practice: [
            { k: 'count-grid' }, { k: 'count-grid' }, { k: 'count-tri' }, { k: 'count-tri' },
            { k: 'count-grid' }, { k: 'count-tri' }, { k: 'count-grid' }, { k: 'count-tri' }
          ]
        },
        {
          id: 't5', title: '天平推理', icon: '⚖️',
          beats: [
            { t: '1 个西瓜和 2 个菠萝一样重。', f: '西瓜 = 菠萝 × 2' },
            { t: '1 个菠萝和 3 个桃子一样重。', f: '菠萝 = 桃子 × 3' },
            { t: '那么 1 个西瓜 = 2 × 3 = 6 个桃子！', f: '西瓜 = 桃子 × 6' },
            { t: '换一换、代一代，等量代换是解题的法宝！' }
          ],
          practice: [
            { k: 'balance' }, { k: 'balance' }, { k: 'balance' }, { k: 'balance' },
            { k: 'balance' }, { k: 'balance' }, { k: 'balance' }, { k: 'balance' }
          ]
        },
        {
          id: 't6', title: '排队数学', icon: '🚸',
          beats: [
            { t: '小朋友排队做操，小明前面有 3 人，后面有 4 人。', e: '🧒', n: 7 },
            { t: '3 + 4 + 1 = 8，别忘了小明自己哦！', f: '3 + 4 + 1 = 8' },
            { t: '数队形时，别把报数的人漏掉，也别数两遍。', e: '💡', n: 1 }
          ],
          practice: [
            { k: 'queue' }, { k: 'queue' }, { k: 'queue' }, { k: 'queue' },
            { k: 'queue' }, { k: 'queue' }, { k: 'queue' }, { k: 'queue' }
          ]
        },
        {
          id: 't7', title: '逻辑推理', icon: '🕵️',
          beats: [
            { t: '小红比小明高，小明比小刚高。', e: '🧒', n: 3 },
            { t: '一个比一个，最高的就是小红！', f: '小红 ＞ 小明 ＞ 小刚' },
            { t: '把关系排成一条线，答案就自己跳出来。', e: '💡', n: 1 }
          ],
          practice: [
            { k: 'logic-rank' }, { k: 'logic-rank' }, { k: 'logic-rank' }, { k: 'logic-rank' },
            { k: 'logic-rank' }, { k: 'logic-rank' }, { k: 'logic-rank' }, { k: 'logic-rank' }
          ]
        },
        {
          id: 't8', title: '图形与空间', icon: '🧊',
          beats: [
            { t: '沿一条线对折，两边完全重合——这叫轴对称。', shape: 'triangle' },
            { t: '蝴蝶、树叶、脸谱……生活里到处有对称美。', e: '🦋', n: 2 },
            { t: '小正方体搭高高，一层一层数清楚！', e: '🧊', n: 4 }
          ],
          practice: [
            { k: 'symmetry' }, { k: 'symmetry' }, { k: 'sym-axis' }, { k: 'sym-axis' },
            { k: 'blocks' }, { k: 'blocks' }, { k: 'blocks' }, { k: 'symmetry' }
          ]
        }
      ]
    },
    {
      grade: 1, name: '一年级', emoji: '🌱', color: '#FF7043', deep: '#E64A19',
      chapters: [
        {
          id: 'g1c1', title: '10以内的加减法', icon: '🍎',
          beats: [
            { t: '你好呀，我是小淘淘！今天我们一起去果园摘苹果～', wave: true },
            { t: '看，篮子里有 3 个苹果。', e: '🍎', n: 3 },
            { t: '淘淘又摘了 5 个苹果。', e: '🍎', n: 5 },
            { t: '3 + 5 = 8，一共有 8 个苹果！', f: '3 + 5 = 8' },
            { t: '把两部分合起来，就用加法；从一共里去掉一部分，就用减法。' }
          ],
          practice: [
            { k: 'count', e: '🍎', max: 5 },
            { k: 'count', e: '🐥', max: 4 },
            { k: 'choice', op: '+', max: 10 },
            { k: 'choice', op: '+', max: 10 },
            { k: 'choice', op: '-', max: 10 },
            { k: 'choice', op: '-', max: 10 },
            { k: 'match', op: '+', max: 10, n: 3 },
            { k: 'choice', op: 'addsub', max: 10 }
          ]
        },
        {
          id: 'g1c2', title: '20以内的加减法', icon: '🚌',
          beats: [
            { t: '小淘淘坐校车去春游啦！', wave: true },
            { t: '车上有 9 个小朋友。', e: '🧒', n: 9 },
            { t: '车站又上来 4 个小朋友。', e: '🧒', n: 4 },
            { t: '凑十法：把 4 拆成 1 和 3，9 加 1 等于 10，再加 3 就是 13！', f: '9 + 4 = 9 + 1 + 3 = 13' },
            { t: '个位不够减，也可以“破十”：10 − 4 = 6，6 + 5 = 11。' }
          ],
          practice: [
            { k: 'input', op: '+', max: 20 }, { k: 'input', op: '+', max: 20 },
            { k: 'input', op: '+', max: 20 }, { k: 'input', op: '-', max: 20 },
            { k: 'input', op: '-', max: 20 }, { k: 'input', op: '-', max: 20 },
            { k: 'choice', op: '+', max: 20 }, { k: 'choice', op: '-', max: 20 }
          ]
        },
        {
          id: 'g1c3', title: '比较大小', icon: '🍪',
          beats: [
            { t: '小淘淘和小兔子分饼干咯！', wave: true },
            { t: '小淘淘有 7 块饼干。', e: '🍪', n: 7 },
            { t: '小兔子有 4 块饼干。', e: '🍪', n: 4 },
            { t: '7 比 4 大，写成 7 ＞ 4。开口朝大数，尖角朝小数！', f: '7 ＞ 4' },
            { t: '比大小的时候，先数一数，再用 ＞ ＜ ＝ 来连接。' }
          ],
          practice: [
            { k: 'compare', mode: 'num', max: 20 }, { k: 'compare', mode: 'num', max: 20 },
            { k: 'compare', mode: 'num', max: 20 }, { k: 'compare', mode: 'num', max: 20 },
            { k: 'compare', mode: 'num', max: 20 }, { k: 'compare', mode: 'num', max: 20 },
            { k: 'compare', mode: 'sum', max: 10 }, { k: 'compare', mode: 'sum', max: 10 }
          ]
        },
        {
          id: 'g1c4', title: '认识图形', icon: '🏰',
          beats: [
            { t: '我们来搭积木城堡！', wave: true },
            { t: '圆圆的球滚来滚去——这是圆形！', shape: 'circle' },
            { t: '尖尖的屋顶有三条边——这是三角形！', shape: 'triangle' },
            { t: '方方正正的积木，四条边一样长是正方形，对边一样长是长方形。', shape: 'square' },
            { t: '城堡搭好啦！生活中到处都有图形，找找看～', e: '🏰', n: 1 }
          ],
          practice: [
            { k: 'shape', ask: 'name' }, { k: 'shape', ask: 'name' }, { k: 'shape', ask: 'name' },
            { k: 'shape', ask: 'name' }, { k: 'shape', ask: 'sides' }, { k: 'shape', ask: 'sides' },
            { k: 'shape', ask: 'name' }, { k: 'shape', ask: 'name' }
          ]
        }
      ]
    },
    {
      grade: 2, name: '二年级', emoji: '🎈', color: '#29B6F6', deep: '#0277BD',
      chapters: [
        {
          id: 'g2c1', title: '100以内的加减法', icon: '✏️',
          beats: [
            { t: '小淘淘帮妈妈看文具店！', wave: true },
            { t: '铅笔盒里一共有 45 支铅笔。', e: '✏️', n: 12 },
            { t: '进来一位顾客，买走了 28 支。' },
            { t: '45 − 28 = 17，还剩 17 支！个位不够减，向十位借 1。', f: '45 − 28 = 17' },
            { t: '两位数加减法：相同数位对齐，从个位算起，满十进一、退一作十。' }
          ],
          practice: [
            { k: 'input', mode: 'add100' }, { k: 'input', mode: 'add100' }, { k: 'input', mode: 'add100' },
            { k: 'input', mode: 'sub100' }, { k: 'input', mode: 'sub100' }, { k: 'input', mode: 'sub100' },
            { k: 'choice', op: 'addsub', max: 100 }, { k: 'choice', op: 'addsub', max: 100 }
          ]
        },
        {
          id: 'g2c2', title: '乘法口诀', icon: '🍡',
          beats: [
            { t: '冰糖葫芦串好啦！', wave: true },
            { t: '每串 4 颗山楂，一共 3 串。', groups: [3, 4, '🍡'] },
            { t: '4 + 4 + 4 = 12，还可以写成乘法：3 × 4 = 12。', f: '3 × 4 = 12' },
            { t: '口诀“三四十二”要记牢！乘法是相同加数连加的简便算法。' }
          ],
          practice: [
            { k: 'groups', e: '🍡' }, { k: 'groups', e: '🍓' },
            { k: 'choice', op: '×' }, { k: 'choice', op: '×' }, { k: 'choice', op: '×' },
            { k: 'choice', op: '×' }, { k: 'choice', op: '×' }, { k: 'choice', op: '×' }
          ]
        },
        {
          id: 'g2c3', title: '认识时钟', icon: '⏰',
          beats: [
            { t: '早上 7 点，小闹钟响啦！', wave: true },
            { t: '分针指着 12，时针指着 7，就是 7 点整。', clock: [7, 0], f: '7:00' },
            { t: '再过半小时，分针走到 6，就是 7 点半咯！', clock: [7, 30], f: '7:30' },
            { t: '时针短短的走得慢，分针长长的走得快，一起来认时间吧！' }
          ],
          practice: [
            { k: 'clock' }, { k: 'clock' }, { k: 'clock' }, { k: 'clock' },
            { k: 'clock' }, { k: 'clock' }, { k: 'clock' }, { k: 'clock' }
          ]
        },
        {
          id: 'g2c4', title: '平均分与除法', icon: '🐿️',
          beats: [
            { t: '小松鼠们摘了满满 12 颗松果！', wave: true, e: '🌰', n: 12 },
            { t: '要平均分给 3 只小松鼠，每只一样多。', e: '🐿️', n: 3 },
            { t: '12 ÷ 3 = 4，每只小松鼠分到 4 颗！', f: '12 ÷ 3 = 4' },
            { t: '平均分就是每份分得同样多，用除法来算。' }
          ],
          practice: [
            { k: 'share' }, { k: 'share' }, { k: 'share' }, { k: 'share' }, { k: 'share' },
            { k: 'choice', op: '÷' }, { k: 'choice', op: '÷' }, { k: 'choice', op: '÷' }
          ]
        }
      ]
    },
    {
      grade: 3, name: '三年级', emoji: '🧩', color: '#66BB6A', deep: '#2E7D32',
      chapters: [
        {
          id: 'g3c1', title: '万以内加减法', icon: '📚',
          beats: [
            { t: '图书馆到了一批新书！', wave: true },
            { t: '故事书有 2360 本。', e: '📖', n: 10 },
            { t: '科技书有 1480 本。', e: '🚀', n: 8 },
            { t: '2360 + 1480 = 3840，一共 3840 本！', f: '2360 + 1480 = 3840' },
            { t: '万以内加减法：数位对齐、从个位算起，进位退位别忘记。' }
          ],
          practice: [
            { k: 'input', mode: 'add1000' }, { k: 'input', mode: 'add1000' },
            { k: 'input', mode: 'add1000' }, { k: 'input', mode: 'add1000' },
            { k: 'input', mode: 'sub1000' }, { k: 'input', mode: 'sub1000' },
            { k: 'input', mode: 'sub1000' }, { k: 'input', mode: 'sub1000' }
          ]
        },
        {
          id: 'g3c2', title: '多位数乘除法', icon: '🍞',
          beats: [
            { t: '面包工坊开张啦！', wave: true },
            { t: '每盘放 4 个面包，摆了 24 盘。', e: '🍞', n: 12 },
            { t: '4 × 24 = 96，一共烤了 96 个面包！', f: '4 × 24 = 96' },
            { t: '装进 8 个袋子刚好分完：96 ÷ 8 = 12，每袋 12 个！', f: '96 ÷ 8 = 12' },
            { t: '乘除法互为逆运算，可以互相验算哦。' }
          ],
          practice: [
            { k: 'input', mode: 'mul2d1' }, { k: 'input', mode: 'mul2d1' },
            { k: 'input', mode: 'mul2d1' }, { k: 'input', mode: 'mul2d1' },
            { k: 'input', mode: 'div2d' }, { k: 'input', mode: 'div2d' },
            { k: 'input', mode: 'div2d' }, { k: 'input', mode: 'div2d' }
          ]
        },
        {
          id: 'g3c3', title: '分数初步认识', icon: '🍕',
          beats: [
            { t: '一个大披萨，平均切成 4 块！', wave: true, pie: [4, 0] },
            { t: '小淘淘吃了 1 块，就是四分之一，写作 1/4。', pie: [4, 1], f: '1/4' },
            { t: '要是吃了 3 块，就是四分之三：3/4。', pie: [4, 3], f: '3/4' },
            { t: '分母表示平均分成几份，分子表示取了几份。' }
          ],
          practice: [
            { k: 'fraction' }, { k: 'fraction' }, { k: 'fraction' }, { k: 'fraction' },
            { k: 'fraction' }, { k: 'fraction' }, { k: 'fraction' }, { k: 'fraction' }
          ]
        },
        {
          id: 'g3c4', title: '周长与面积', icon: '🌷',
          beats: [
            { t: '小淘淘要给花园围栅栏！', wave: true },
            { t: '花园是长方形，长 6 米、宽 4 米。', rect: [6, 4] },
            { t: '围一圈的长度叫周长：(6 + 4) × 2 = 20 米。', f: '(6 + 4) × 2 = 20（米）' },
            { t: '铺满草皮的大小叫面积：6 × 4 = 24 平方米。', f: '6 × 4 = 24（平方米）' },
            { t: '周长是一条线，面积是一片面，别弄混哦！' }
          ],
          practice: [
            { k: 'rect', ask: 'perim' }, { k: 'rect', ask: 'perim' },
            { k: 'rect', ask: 'perim' }, { k: 'rect', ask: 'perim' },
            { k: 'rect', ask: 'area' }, { k: 'rect', ask: 'area' },
            { k: 'rect', ask: 'area' }, { k: 'rect', ask: 'area' }
          ]
        }
      ]
    },
    {
      grade: 4, name: '四年级', emoji: '🔭', color: '#AB47BC', deep: '#7B1FA2',
      chapters: [
        {
          id: 'g4c1', title: '大数的认识', icon: '🚀',
          beats: [
            { t: '小淘淘坐上火箭去看星星！', wave: true, e: '🚀', n: 1 },
            { t: '地球到月球大约 384400 千米，好大的数！', e: '🌕', n: 1 },
            { t: '384400 由 3 个十万、8 个万、4 个千、4 个百组成。', f: '384400' },
            { t: '读大数从高位读起，先分级（个级、万级），再一级一级读。' }
          ],
          practice: [
            { k: 'bignum-compare' }, { k: 'bignum-compare' }, { k: 'bignum-compare' }, { k: 'bignum-compare' },
            { k: 'bignum-compose' }, { k: 'bignum-compose' }, { k: 'bignum-compose' }, { k: 'bignum-compose' }
          ]
        },
        {
          id: 'g4c2', title: '三位数乘两位数', icon: '⚽',
          beats: [
            { t: '运动会开幕啦！', wave: true, e: '⚽', n: 6 },
            { t: '每个方阵 125 人，一共有 24 个方阵。' },
            { t: '125 × 24：先算 125 × 4，再算 125 × 20，最后把两次结果加起来。', f: '125 × 24 = 3000' },
            { t: '三位数乘两位数，积可能是四位数，也可能是五位数。' }
          ],
          practice: [
            { k: 'input', mode: 'mul3d2' }, { k: 'input', mode: 'mul3d2' }, { k: 'input', mode: 'mul3d2' },
            { k: 'input', mode: 'mul3d2' }, { k: 'input', mode: 'mul3d2' }, { k: 'input', mode: 'mul3d2' },
            { k: 'input', mode: 'mul3d2' }, { k: 'input', mode: 'mul3d2' }
          ]
        },
        {
          id: 'g4c3', title: '除数是两位数的除法', icon: '🧺',
          beats: [
            { t: '全班一起去野餐！', wave: true, e: '🧺', n: 6 },
            { t: '312 名同学，每 24 人分成一组。' },
            { t: '312 ÷ 24 = 13，正好分成 13 组！', f: '312 ÷ 24 = 13' },
            { t: '试商小妙招：把 24 当作 20 来试，商大了再调小。' }
          ],
          practice: [
            { k: 'input', mode: 'div2dbig' }, { k: 'input', mode: 'div2dbig' }, { k: 'input', mode: 'div2dbig' },
            { k: 'input', mode: 'div2dbig' }, { k: 'input', mode: 'div2dbig' }, { k: 'input', mode: 'div2dbig' },
            { k: 'input', mode: 'div2dbig' }, { k: 'input', mode: 'div2dbig' }
          ]
        },
        {
          id: 'g4c4', title: '角的认识', icon: '📐',
          beats: [
            { t: '欢迎来到量角器公园！', wave: true, e: '📐', n: 1 },
            { t: '小于 90° 的角是锐角，像滑梯一样斜斜的。', angle: 40 },
            { t: '正好 90° 的角是直角，方方正正站得直！', angle: 90, f: '90°' },
            { t: '大于 90° 而小于 180° 的角是钝角，张得开开的。', angle: 130 },
            { t: '角的大小与边的长短无关，只看两条边张开的程度。' }
          ],
          practice: [
            { k: 'angle' }, { k: 'angle' }, { k: 'angle' }, { k: 'angle' },
            { k: 'angle' }, { k: 'angle' }, { k: 'angle-degree' }, { k: 'angle-degree' }
          ]
        }
      ]
    },
    {
      grade: 5, name: '五年级', emoji: '🎓', color: '#FFCA28', deep: '#F9A825',
      chapters: [
        {
          id: 'g5c1', title: '小数四则运算', icon: '🧾',
          beats: [
            { t: '小淘淘帮妈妈核对超市小票！', wave: true, e: '🧾', n: 1 },
            { t: '一支笔 3.5 元，一块橡皮 2.4 元。', e: '✏️', n: 4 },
            { t: '3.5 + 2.4 = 5.9，小数点一定要对齐！', f: '3.5 + 2.4 = 5.9' },
            { t: '小数乘整数：先按整数算出 25 × 4 = 100，再点上小数点得 10。', f: '2.5 × 4 = 10' },
            { t: '计算小数时，小数点的位置就是关键！' }
          ],
          practice: [
            { k: 'input', mode: 'dec-add' }, { k: 'input', mode: 'dec-add' },
            { k: 'input', mode: 'dec-sub' }, { k: 'input', mode: 'dec-sub' },
            { k: 'input', mode: 'dec-mul' }, { k: 'input', mode: 'dec-mul' },
            { k: 'input', mode: 'dec-mul' }, { k: 'input', mode: 'dec-mul' }
          ]
        },
        {
          id: 'g5c2', title: '简易方程', icon: '⚖️',
          beats: [
            { t: '天平左边放着 x + 5 克的砝码，右边是 12 克。', wave: true, e: '⚖️', n: 1 },
            { t: '天平平衡，就可以写成方程：x + 5 = 12。', f: 'x + 5 = 12' },
            { t: '两边同时减去 5：x = 12 − 5 = 7，解方程成功！', f: 'x = 12 − 5 = 7' },
            { t: '等式两边同时加减乘除同一个数（除数不为 0），天平仍然平衡。' }
          ],
          practice: [
            { k: 'equation' }, { k: 'equation' }, { k: 'equation' }, { k: 'equation' },
            { k: 'equation' }, { k: 'equation' }, { k: 'equation' }, { k: 'equation' }
          ]
        },
        {
          id: 'g5c3', title: '多边形的面积', icon: '🎨',
          beats: [
            { t: '小淘淘是小小粉刷匠！', wave: true, e: '🎨', n: 4 },
            { t: '平行四边形面积 = 底 × 高。底 6 米、高 4 米，面积 24 平方米。', f: 'S = a × h' },
            { t: '三角形面积 = 底 × 高 ÷ 2。底 6、高 4，面积就是 12。', f: 'S = a × h ÷ 2' },
            { t: '梯形面积 = (上底 + 下底) × 高 ÷ 2，公式里藏着两个底！', f: 'S = (a + b) × h ÷ 2' },
            { t: '数格子、割补、拼一拼，面积公式都是这样推导出来的。' }
          ],
          practice: [
            { k: 'poly-area', shape: 'para' }, { k: 'poly-area', shape: 'tri' },
            { k: 'poly-area', shape: 'trap' }, { k: 'poly-area', shape: 'para' },
            { k: 'poly-area', shape: 'tri' }, { k: 'poly-area', shape: 'trap' },
            { k: 'poly-area', shape: 'tri' }, { k: 'poly-area', shape: 'trap' }
          ]
        },
        {
          id: 'g5c4', title: '分数的加减法', icon: '🍰',
          beats: [
            { t: '蛋糕工坊的大蛋糕平均切成 8 块！', wave: true, pie: [8, 0] },
            { t: '爸爸吃了 3/8，妈妈吃了 2/8。', pie: [8, 5] },
            { t: '他们一共吃了 3/8 + 2/8 = 5/8。', f: '3/8 + 2/8 = 5/8' },
            { t: '同分母分数相加减：分母不变，分子相加减。' }
          ],
          practice: [
            { k: 'frac-add' }, { k: 'frac-add' }, { k: 'frac-add' }, { k: 'frac-add' },
            { k: 'frac-add' }, { k: 'frac-add' }, { k: 'frac-add' }, { k: 'frac-add' }
          ]
        }
      ]
    }
  ];

  MX.curriculum = {
    grades: grades,
    findChapter: function (id) {
      for (var g = 0; g < grades.length; g++) {
        var cs = grades[g].chapters;
        for (var c = 0; c < cs.length; c++) if (cs[c].id === id) return { grade: grades[g], chapter: cs[c] };
      }
      return null;
    }
  };
})();
