# CLAUDE.md — 个人网页项目

## 项目概述

嵌入式工程师 & 具身智能开发工程师的个人品牌网站。用于展示项目经历、技术栈、博客/作品。

## 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 构建工具 | Vite | 快速 HMR，零配置起步 |
| 框架 | Vanilla HTML + CSS + JS | 3-5 页静态站，不需 React/Vue |
| 样式 | PostCSS / 原生 CSS | 嵌套、变量、媒体查询 |
| 动画 | CSS `@keyframes` + IntersectionObserver | 滚动入场动画，轻量 |
| 图标 | Lucide Icons (SVG) / Font Awesome | 按需加载 |
| 字体 | Google Fonts 自托管或 CDN | 中文字体注意体积 |
| 部署 | GitHub Pages / Vercel / Netlify | 静态导出 |

> 初始阶段**不引入**任何重型框架或 UI 库。保持纯静态，方便调优和快速部署。

## 页面结构 (MVP 4 页)

```
/
├── index.html              # 首页 — Hero + 个人简介 + 技能概览
├── projects.html           # 项目经历 — 卡片列表 + 详情弹窗
├── techstack.html          # 技术栈 — 可视化分类展示
├── about.html              # 关于我 — 经历时间线 + 联系方式
└── assets/
    ├── css/
    │   ├── style.css       # 全局样式
    │   ├── desktop.css     # 桌面端布局 (>1024px)
    │   └── mobile.css      # 移动端布局 (<768px)
    ├── js/
    │   ├── main.js         # 全局 JS (导航、主题)
    │   ├── animations.js   # 滚动动画 (IntersectionObserver)
    │   └── components.js   # 可复用组件逻辑
    ├── images/             # 图片资源 (WebP + fallback)
    └── videos/             # 视频嵌入 / 封面图
```

## 设计原则

1. **嵌入式工程师美学** — 干净、精准、克制。深色/浅色双主题可选。
2. **桌面优先** — 先完成 1024px+ 布局，再适配 <768px 移动端。
3. **渐进增强** — 核心内容无 JS 可访问，动画是增强而非依赖。
4. **性能敏感** — 图片懒加载 + WebP，视频用封面图占位，CSS 动画利用 GPU 合成。

## 交互设计

- 滚动触发入场动画 (fade-up / slide-in)
- 导航栏滚动变色 + 平滑锚点滚动
- 项目卡片 hover 微动效
- 技术栈分类标签筛选 (纯 JS)
- 移动端汉堡菜单

## 开发规范

- **HTML**: 语义化标签 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`)
- **CSS**: BEM-like 命名 + CSS 自定义属性做主题变量
- **JS**: 模块化分文件，`type="module"` 引入，避免全局污染
- **图片**: 一律输出 WebP + 同路径 jpg/png fallback
- **视频**: 用 YouTube/Bilibili iframe embed 或 `<video>` 标签 + poster 封面

## 构建 & 部署

```bash
npm create vite@latest . -- --template vanilla    # 初始化
npm run dev      # 开发
npm run build    # 构建到 dist/
```

部署到 GitHub Pages：`npm run build` 后 push `dist/` 到 `gh-pages` 分支。

## 内存 / 项目状态

- 设计稿和配色方案在记忆文件中维护。
- 组件变体和设计评审记录在记忆文件中。
- 所有记忆文件位于 `D:\.claude\projects\d--DSEKTOP-----\memory\`。
