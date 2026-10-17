# 数学冒险 🐵

一个仿「洪恩数学」风格的儿童数学学习 Web App：**动画故事导入 + 互动练习 + 星星奖励 + 关卡地图**。包含 1–5 年级课程与独立的「思维训练」赛道（图形与逻辑思维为主），纯 HTML5 实现，无任何构建依赖。

- **在线使用**：https://nore1030.github.io/math-adventure/ （任意设备浏览器打开即用；iPad Safari「添加到主屏幕」后可像 App 一样全屏使用）

## ✨ 功能

- **🧠 思维训练赛道（8 章）**——图形与逻辑思维为主：
  分类找不同 / 图形找规律 / 数字找规律 / 数图形（网格正方形、分割三角形）/
  天平等量代换 / 排队问题 / 逻辑推理（比较传递）/ 图形与空间（轴对称、立方体计数）
- **5 个年级 × 每年级 4 章**（依据义务教育数学课程标准知识点组织，内容全部原创）：
  - 一年级：10以内加减法 / 20以内加减法 / 比较大小 / 认识图形
  - 二年级：100以内加减法 / 乘法口诀 / 认识时钟 / 平均分与除法
  - 三年级：万以内加减法 / 多位数乘除法 / 分数初步 / 周长与面积
  - 四年级：大数的认识 / 三位数乘两位数 / 两位数除法 / 角的认识
  - 五年级：小数四则运算 / 简易方程 / 多边形面积 / 分数加减法
- **动画课程**：吉祥物「小淘淘」讲故事，配合 emoji 场景、SVG 钟面/饼图/图形动画和中文语音朗读（系统 TTS）
- **4 种互动题型**：大按钮选择、儿童数字键盘输入（含小数点）、比大小（＞＜＝）、算式配对
- **题目由程序生成**：每次练习数字都不同，可以无限刷
- **激励系统**：答对动画 + 音效庆祝、1–3 星评级、关卡地图进度记录；所有关卡默认全部开放，可自由选择任意章节学习
- 进度保存在 `localStorage`，无账号、无网络依赖（本地服务除外）

## 📱 安装到 iPad

在线版最简单：iPad Safari 打开 https://nore1030.github.io/math-adventure/ → 分享 → **添加到主屏幕**。

本地局域网版（不需要外网）：

```bash
# 1. 在项目目录启动本地服务
cd math-adventure
python3 -m http.server 8765

# 2. 查看你 Mac 的局域网 IP
ipconfig getifaddr en0
```

3. 在 iPad 的 **Safari** 打开 `http://<Mac的IP>:8765`（例如 `http://192.168.1.5:8765`）
4. 点 Safari 底部 **分享按钮 → 添加到主屏幕**
5. 主屏幕出现「数学冒险」图标，点开后即全屏运行，和原生 App 体验一致

> 说明：这种方式不需要 Apple 开发者账号（99 美元/年），但使用时需要 Mac 上的服务在运行。
> 想彻底离线 / 上架 App Store，见下面「进阶路线」。

## 🚀 进阶路线

| 目标 | 方案 |
| --- | --- |
| 部署/更新线上版 | 推送到 `main` 分支即可，GitHub Pages 自动发布（见下） |
| 离线可用 | 加 Service Worker 预缓存（PWA 完整形态） |
| 真正的原生 App | 用 [Capacitor](https://capacitorjs.com/) 把本目录包成 iOS 壳（改动最小），或逐步迁移到 **Cocos Creator**（开源引擎，国内儿童教育 App 主流） |
| 上架 App Store | 需要 Apple Developer 账号；用 Capacitor/Cocos 打包出 Xcode 工程后提交 |
| 更精细的动画 | 用 [Lottie](https://lottiefiles.com/)（AE 导出的动画 JSON，Web/原生都支持）替换 CSS/emoji 动画 |
| 更多题库 | 在 `js/curriculum.js` 按现有 spec 格式加章节；在 `js/generators.js` 加题型生成器 |

## 🌐 部署（GitHub Pages）

仓库已通过 GitHub Pages 发布到 `https://nore1030.github.io/math-adventure/`。以后更新只需：

```bash
git add -A && git commit -m "更新内容" && git push
```

约 1 分钟后自动生效。如果是重新部署到自己的账号：

```bash
gh repo create math-adventure --public --source=. --remote=origin --push
gh api -X POST repos/<你的用户名>/math-adventure/pages -f "source[branch]=main" -f "source[path]=/"
```

## 📂 目录结构

```
math-adventure/
├── index.html            入口（iPad 主屏幕安装配置都在 meta 里）
├── manifest.webmanifest  PWA 清单
├── icon-180.png / icon-512.png  应用图标
├── css/style.css         儿童卡通风格样式（大按钮/立体投影/动画）
└── js/
    ├── util.js           DOM 与随机工具
    ├── audio.js          WebAudio 合成音效 + 语音朗读
    ├── mascot.js         吉祥物 SVG（表情/跳跃/挥手）
    ├── curriculum.js     ★ 课程数据：5 年级 × 4 章，故事脚本 + 练习配置
    ├── generators.js     ★ 题目生成器 + 钟面/饼图/角度等 SVG 视觉
    ├── scenes-*.js       各场景：首页 / 关卡地图 / 动画课 / 练习 / 结算
    └── app.js            场景路由 + localStorage 进度
```

## 🔓 开源参考

调研结论：目前**没有**「洪恩数学」级别的完整开源克隆，可借鉴的主要是：

- [GCompris (KDE)](https://kde.org/zh-cn/for/kids) —— 最接近的开源儿童教育套件（2–10 岁，100+ 互动活动，其中大量数学活动），适合**借鉴活动玩法设计**
- [Khan Academy Perseus](https://github.com/Khan/perseus) —— 可汗学院的开源互动习题渲染框架（TypeScript/React），适合**借鉴习题交互模型**
- [Cocos Engine](https://github.com/cocos/cocos-engine) —— 开源跨平台引擎，国内儿童教育 App 的主流技术栈，适合**做正式产品时迁移**
- GitHub 上其余 kids-math 项目（`topic:math-game` 等）多为几十 star 的练习小工具，参考价值有限

⚠️ 版权说明：本项目**不包含**洪恩/iHuman 的任何素材（角色、动画、音频、题目）。角色「小淘淘」、故事与题目均为原创，知识点结构参照公开的《义务教育数学课程标准》。
