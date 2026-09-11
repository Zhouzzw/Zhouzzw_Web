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

> **主线 v2**：仓库 `v2` 分支为开发主线（当前线上）。`v3-rig-style` 分支是 rig.ai 红黑风格实验，仅供查看不同风格效果参考，**不作为开发主线，不排期**。

## 页面结构（单页长滚动）

```
/
├── index.html              # 单页站点 — 5 个 section 长滚动
│                           #   #hero(螺旋) → #intro(简介) → #projects(项目)
│                           #   → #techstack(技术栈) → #about(关于)
├── vite.config.js          # 单入口构建配置（base: '/Zhouzzw_Web/'，勿删）
├── package.json
├── .github/
│   └── workflows/deploy.yml  # push 到 v2 → 构建 → 部署到 GitHub Pages
└── assets/
    ├── css/
    │   ├── style.css       # 全局变量 + 重置 + 组件基类 + 关键帧
    │   ├── desktop.css     # ≥1024px 桌面布局
    │   └── mobile.css      # <768px / <480px 移动端适配
    ├── js/
    │   ├── main.js         # scrollspy + 滑动指示器 + 视频弹窗 + 技术栈筛选
    │   ├── animations.js   # IntersectionObserver（当前入场动画已禁用）
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

## 交互设计

- 导航栏 scrollspy 滚动高亮当前模块（只观察有导航链接的 section）
- 导航滑动指示器平滑过渡（`translateX` + `width` 跟随当前链接）
- 点击导航锚点平滑跳转，`scroll-margin-top: 96px` 防标题被导航遮挡
- 导航滚动微缩（`.nav--scrolled`）
- 项目卡片 hover 微动效
- 技术栈分类标签筛选 (纯 JS)
- 视频点击弹窗播放（封面首帧截取）
- 移动端导航内联横排（无汉堡折叠，`<480px` 隐藏"首页"项）

## 开发规范

- **HTML**: 语义化标签 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`)，section 用 `id` 做锚点
- **CSS**: BEM-like 命名 + CSS 自定义属性做主题变量
- **JS**: 模块化分文件，`type="module"` 引入，避免全局污染
- **图片**: 当前为压缩后的 JPEG（长边 ≤1920 + `-q:v 3`）；`<picture>` + WebP 是待办的可选优化
- **视频**: 用 YouTube/Bilibili iframe embed 或 `<video>` 标签 + poster 封面

## 构建 & 部署

```bash
npm run dev      # 开发（热更新）
npm run build    # 构建到 dist/（单页）
npm run preview  # 本地预览构建产物 → http://localhost:4173/Zhouzzw_Web/
```

**线上地址**：https://zhouzzw.github.io/Zhouzzw_Web/

部署是自动的：push 到 `v2` 会触发 `.github/workflows/deploy.yml`（`npm ci` → `npm run build` → `actions/deploy-pages`）。不需要手动跑部署命令，`dist/` 也不提交进仓库。

- ⚠️ **`vite.config.js` 的 `base: '/Zhouzzw_Web/'` 不能删**。仓库名是 `Zhouzzw_Web`，项目站点带子路径；少了这个 base，所有 `/assets/...` 都会 404。
- ⚠️ **大文件进不了 git**：GitHub 单文件 100MB 硬限制。新增视频请先压到 10MB 以内再入库（现有 3 个是 4K60 HEVC 转出来的 1080p H.264 CRF 26，共 16MB）。原始素材备份在仓库外 `d:/DSEKTOP/原始素材备份/`。
- ⚠️ 项目用 `type="module"`，`index.html` **不能直接双击打开**（file:// 下 CORS 拦截模块脚本），必须通过 Vite 服务器或构建后部署。
- 方案已按 Vite 定型，不要再提议改造成纯静态 HTML。

## 内存 / 项目状态

- 设计稿和配色方案在记忆文件中维护。
- 组件变体和设计评审记录在记忆文件中。
- 所有记忆文件位于 `D:\.claude\projects\d--DSEKTOP-----\memory\`。
