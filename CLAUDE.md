# CLAUDE.md — 个人网页项目

## 项目概述

嵌入式工程师 & 具身智能开发工程师的个人品牌网站。用于展示项目经历、技术栈、博客/作品。

## 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 构建工具 | Vite | 快速 HMR，零配置起步 |
| 框架 | Vanilla HTML + CSS + JS | 单页长滚动站点，不需 React/Vue |
| 样式 | PostCSS / 原生 CSS | 嵌套、变量、媒体查询 |
| 动画 | CSS 过渡 + IntersectionObserver | scrollspy 高亮 + 滑动指示器 |
| 图标 | 内联 SVG (Lucide 风格) | 按需加载 |
| 字体 | Google Fonts CDN | Geist + Geist Mono + Noto Sans SC |
| 部署 | GitHub Pages + GitHub Actions | push 到 `v2` 自动构建部署 |

> **不引入**任何重型框架或 UI 库。保持纯静态，方便调优和快速部署。

> **双分支并列**：`v2` 与 `v3-full` 为两个并列独立分支。`v2` = 修改前的基础版（v2.4 线上状态）；`v3-full` = 完整版（2026-09-12 由 `v3-rig-style` 改名，覆盖为当前全部开发成果），承载所有后续改动。原开发分支 `feature/g1d-industry-and-resume` 已删除。

## 页面结构（单页长滚动）

```
/
├── index.html              # 单页站点 — 5 个 section 长滚动
│                           #   #hero(首页) → #intro(简介, 归属首页) → #techstack(技术栈)
│                           #   → #projects(项目) → #internship(实习竞赛: 实习+荣誉)
│                           #   → #life(关于: 工作之外的我) → #contact(联系) → footer
├── vite.config.js          # 单入口构建配置（base: '/Zhouzzw_Web/'，勿删）
├── package.json
├── public/                 # Vite 原样拷进 dist 根（robots.txt / sitemap.xml）
├── .github/
│   └── workflows/deploy.yml  # push 到 v2 → 构建 → 部署到 GitHub Pages
└── assets/
    ├── css/
    │   ├── style.css       # 全局变量 + 重置 + 组件基类 + 关键帧
    │   ├── desktop.css     # ≥1024px 桌面布局
    │   └── mobile.css      # <768px / <480px 移动端适配
    ├── js/
    │   ├── main.js         # scrollspy + 滑动指示器 + 视频弹窗 + 技术栈筛选 + 卡片跟随高光（B5）
    │   ├── animations.js   # IntersectionObserver 入场动画（2026-09-15 恢复启用）+ 数字滚动计数 .js-count（B4）+ Hero 打字机 .hero__term（B3），均 2026-09-16
    │   └── char-matrix.js  # Canvas 字符矩阵（备用，未接入页面）
    ├── images/             # 图片资源（长边 ≤1920 已压缩）
    └── videos/             # 演示视频（1080p H.264，共 16MB，已入库）
```

> 已删除 projects.html / techstack.html / about.html，全部内容合并进 index.html。

## 设计原则

1. **嵌入式工程师美学** — 干净、精准、克制。深色/浅色双主题可选。
2. **桌面优先** — 先完成 1024px+ 布局，再适配 <768px 移动端。
3. **渐进增强** — 核心内容无 JS 可访问，动画是增强而非依赖。
4. **性能敏感** — 图片懒加载 + WebP，视频用封面图占位，CSS 动画利用 GPU 合成。

## 设计令牌

| 类别 | 值 |
|------|-----|
| **配色** | 米白 `#F1EEE7` / 深灰黑 `#232323` / 纯黑 `#000000` / 橙色 `#FF9100` · **全部暗区统一走 `--color-black`（`#242423` 已废弃，勿再引入）** · 浅色底上的橙色正文与焦点环改用深一档 `--color-accent-deep: #A05200` |
| **字体** | Geist + Geist Mono + Noto Sans SC |
| **间距** | 4px 基数：`--space-2..40` |
| **水平边距** | 统一走 `--gutter`（三档，元素不再各自写断点）：<768 移动 16px ｜ 769–1023 平板**流式** `clamp(1rem, 25vw - 176px, 5rem)`（768px→16px、1024px→80px）｜ ≥1024 桌面 80px。档位切换只在 `style.css` 顶部两个媒体查询（`min-width: 769px` / `1024px`）里发生 |
| **圆角** | 4px / 8px / 9999px |
| **过渡** | `cubic-bezier(0.23,1,0.32,1)` / `cubic-bezier(0.4,0,0.2,1)` |
| **设计参考** | contentarchitecture.dev + 终端极客美学 |

## 交互设计

- 导航栏 scrollspy 滚动高亮当前模块（只观察有导航链接的 section）
- 导航滑动指示器平滑过渡（`translateX` + `width` 跟随当前链接）
- 点击导航锚点平滑跳转：区块顶边与视口顶边**严格对齐**（`scroll-margin-top: 0`），避免上一区块颜色残留在视口顶部；**仅 `#projects` 保留 `96px`** —— 它的 `padding-top` 为 0、顶边就是终端分隔条，需让出浮动药丸导航的高度。导航是居中浮动药丸，区块 `padding-top` ≥64px 且标题靠左，故不会被遮挡
- 滚动入场：`.animate-on-scroll` → `html.anim` 下隐藏、`.is-visible` 时 `fadeUp` 入场（`animations.js` 的 IntersectionObserver 驱动）；`html.anim` 由 `<head>` 内联脚本同步添加，无 JS 时正文照常可见
- 顶部滚动进度条（`.scroll-progress`，JS 注入，`scaleX` 驱动）
- 导航滚动微缩（`.nav--scrolled`）
- 项目卡片 hover 微动效
- 技术栈分类标签筛选 (纯 JS)
- 区块留白节奏：桌面端 `.section` **顶部 128px / 底部 160px**（顶部刻意收一档）—— 浮动药丸导航底边在 84px 处压着这段留白，等值 160px 时「导航底边 → kicker」净空达 76px，收到 128px 后为 44px，与 `#techstack` 观感齐平
- 平板档留白（769–1023px）：`.section` 与 `#techstack` 顶部走 `clamp(6rem, 12.5vw, 8rem)`（96px@768 → 128px@1024 流式）—— 基线 80px / #techstack 64px 都会被导航（底边 84px）压住；此档同时把断点边界写为 `1023.98px`（与 `min-width:1024px` 互补，堵分数宽度缺口）
- Hero 标题字号两档**严格连续**：双列档（≥1024）`min(--text-headline-2, (50vw − gutter)/9)`；单列档（<1024）`min(--text-headline-2, (100vw − 2·gutter − 16px)/9, 3rem)` —— `3rem(48px)` 恰为桌面档在 1024px 的取值，1023px 与 1024px 同为 48px（消除原 −33% 反向跳变）；列宽约束保证「上下位机全栈工程师」9 个全角字永不孤行（扣 16px 为滚动条余量）
- 视频弹窗播放：封面是 **`<button>`**（键盘可达，Enter / Space 由平台原生触发）+ `aria-label`，内部 `<video preload="metadata">` 由 `main.js` 截 0.5s 首帧作静帧；封面只负责打开弹层
- 联系方式：微信行提供「二维码」弹层与「复制微信号」两枚 chip；微信号必须明文常显（可读屏/可复制/无 JS 也能拿到），二维码只是补充
- 弹层统一走 `main.js` 的 `openDialog` / `closeDialog`：`role="dialog"` + `aria-modal`、打开前记住触发元素关闭后还原焦点、ESC 与点遮罩关闭、Tab 焦点陷阱；关闭收尾动作（如清空 `<video>`）通过 `openDialog` 的第三个参数注册，避免某条关闭路径漏执行
- 卡片鼠标跟随高光（B5）：`@media (hover:hover) and (pointer:fine)` 门控（JS 同口径，触屏零监听）；`pointermove` 经 rAF 写 `--spot-x/--spot-y`，`::after` 的 radial-gradient 跟随指针；叠加层自带卡片同款圆角 + `pointer-events:none`，不裁剪既有 img scale hover
- 简介区布局：单列（正文靠左 + 下接满宽 4:3 大图、`object-position: 20% 35%`）。**A4 的 12 栅格方案（文字 6 列 + 照片 5 列右偏）已于 2026-09-16 实现后经用户看效果否决并退回**，勿再提
- 项目卡布局（A6，≥1024）：`.project-item` 三列 `132px | 1fr | 1fr` —— 编号列 + **描述左列 + 成果右列并排**（成果段挂 `.project-item__section--results` 占第 3 列）；标题 / 标签 / 图片 / 视频段仍跨 `2 / -1`；**成果列表与描述同级字号**（`--text-body-large`）。`--results` 的 `grid-column` 须写在 `.project-item__section` 基类**之后**（同特异性靠顺序取胜）；<1024 为 flex 竖排，`grid-column` 不参与
- 移动端导航内联横排（无汉堡折叠，`<480px` 隐藏"首页"项）

## 开发规范

- **HTML**: 语义化标签 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`)，section 用 `id` 做锚点
- **CSS**: BEM-like 命名 + CSS 自定义属性做主题变量
- **JS**: 模块化分文件，`type="module"` 引入，避免全局污染
- **图片**: 当前为压缩后的 JPEG（长边 ≤1920 + `-q:v 3`）；`<picture>` + WebP 是待办的可选优化
- **视频**: 用 YouTube/Bilibili iframe embed 或 `<video>` 标签 + poster 封面

## 工程红线（历次踩坑沉淀 · 改动前必读）

1. **断点对必须互为补集，且两侧的连续量必须平滑衔接** —— `min-width: N` 与 `max-width: N` 会在宽度**正好为 N 时同时命中**，必须写 `N` / `N-1`（本项目用 `1023.98px` / `769px` 此类值，同时堵住 N±0.98 的分数宽度缺口）。历史上 `max-width: 1024px` 与 `min-width: 1024px` 撞车，让 1024px（iPad Pro 竖屏正好命中）成为唯一坏档。**同族问题：断点两侧的「连续量」（水平边距、流体字号）也必须平滑** —— 曾出现 768–1023px「无人接管」致正文贴边 16px（A12）、1023→1024px hero 标题 71.6→48px 反向跳变（A11）。处置：此类量统一走 `clamp()` 流式（如 `--gutter` 三档），并核对断点两侧取值相等（现 1023px 与 1024px 的 hero 标题同为 48px）。
2. **用 `var()` 前确认该变量已声明** —— 未声明的 CSS 自定义属性**不报错、不告警**，整条属性静默失效。改动后跑一次双向差集（**结果必须为空**）：
   ```bash
   grep -oh '\-\-[a-zA-Z0-9-]*[[:space:]]*:' assets/css/*.css | sed 's/[[:space:]]*:$//' | sort -u > /tmp/d.txt
   grep -oh 'var(--[a-zA-Z0-9-]*' assets/css/*.css index.html assets/js/*.js | sed 's/var(//' | sort -u > /tmp/r.txt
   comm -3 /tmp/d.txt /tmp/r.txt          # 空 = 通过
   ```
   当前基线：**声明 64 / 引用 64**（2026-09-16 B5 新增 `--spot-x` / `--spot-y`；断点族修复新增 `--gutter` / `--gutter-tablet`）。
3. **改样式前先清内联** —— 内联 `style` 优先级高于 class，会**静默压制**样式表里的规则（`.section--dark { background }` 就因此整轮没生效）。**布局重排必须排在清内联之后**；新代码不要写内联，重复的提成工具类（现有 `.text-lead` / `.text-lead--spaced` / `.object-bottom`）。
4. **页面高度依赖视口高度，跨 `--h` 不比较** —— `.hero` 用 `100svh`（桌面）/ `90svh`（移动），视口高 900 与 844 会让整页差 56px。回归比对必须**锁定同一 `--h`**，且只信「同一轮 run 内 base↔cur」的差值，跨版本 / 跨参数的绝对值一律不可比。
   当前高度基准（CDP 实测）：**1440×900＝15120px · 390×844＝14407px · 360×844＝14633px**（A4 退回 + A6 项目卡并排 + 成果字号放大后的值，2026-09-16）。
   配套验证手段：用 `git worktree add --detach <tmp> <旧 commit>` 另起一个 dev server，在同 run 内做**逐元素几何比对** —— 这是「清理 / 重构类改动零位移」最可靠的证明方式，别只看单页总高度。
5. **review 报告动手后必须回写状态标记** —— 任何一项落地后立刻回写 ✅ / 🟡 / 🚫 并同步 `TODO.md`，否则下一轮会把已完成项当待办重做（已多次发生）。`docs/review-v3.md` 已于 2026-09-16 瘦身为**「未决事项 + 已否决 + 已确认结论 + 复现环境」**：**已完成项不再往正文堆细节**（细节回落 PROGRESS/git），新增待办往「一、待处理」加，落地后从正文移除并同步 TODO.md。

## 构建 & 部署

```bash
npm run dev      # 开发（热更新）
npm run build    # 构建到 dist/（单页）
npm run preview  # 本地预览构建产物 → http://localhost:4173/Zhouzzw_Web/
```

**线上地址**：https://zhouzzw.github.io/Zhouzzw_Web/

部署是自动的：push 到 `v2` 会触发 `.github/workflows/deploy.yml`（`npm ci` → `npm run build` → `actions/deploy-pages`）。不需要手动跑部署命令，`dist/` 也不提交进仓库。`v3-full` 为并行完整版分支，**不**触发部署（workflow 只监听 v2）。

- ⚠️ **git 远程为 SSH**（`git@github.com:Zhouzzw/Zhouzzw_Web.git`）：HTTPS 在此环境有 TLS 握手故障，勿改回 https URL；SSH 密钥已配置且验证通过。

- ⚠️ **`vite.config.js` 的 `base: '/Zhouzzw_Web/'` 不能删**。仓库名是 `Zhouzzw_Web`，项目站点带子路径；少了这个 base，所有 `/assets/...` 都会 404。
- ⚠️ **大文件进不了 git**：GitHub 单文件 100MB 硬限制。新增视频请先压到 10MB 以内再入库（现有 3 个是 4K60 HEVC 转出来的 1080p H.264 CRF 26，共 16MB）。原始素材备份在仓库外 `d:/DSEKTOP/原始素材备份/`。
- ⚠️ 项目用 `type="module"`，`index.html` **不能直接双击打开**（file:// 下 CORS 拦截模块脚本），必须通过 Vite 服务器或构建后部署。
- 方案已按 Vite 定型，不要再提议改造成纯静态 HTML。

## 内存 / 项目状态

- 设计稿和配色方案在记忆文件中维护。
- 组件变体和设计评审记录在记忆文件中。
- 所有记忆文件位于 `/home/qskj-2/.zcode/cli/memories/projects/personal_web-4ea9280a70183293/memory/`。
