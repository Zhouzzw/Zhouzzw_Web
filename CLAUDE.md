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
| 部署 | GitHub Pages / Vercel / Netlify | 静态导出 |

> **不引入**任何重型框架或 UI 库。保持纯静态，方便调优和快速部署。

## 页面结构（单页长滚动）

```
/
├── index.html              # 单页站点 — 5 个 section 长滚动
│                           #   #hero(螺旋) → #intro(简介) → #projects(项目)
│                           #   → #techstack(技术栈) → #about(关于)
├── vite.config.js          # 单入口构建配置
├── package.json
└── assets/
    ├── css/
    │   ├── style.css       # 全局变量 + 重置 + 组件基类 + 关键帧
    │   ├── desktop.css     # ≥1024px 桌面布局
    │   └── mobile.css      # <768px / <480px 移动端适配
    ├── js/
    │   ├── main.js         # scrollspy + 滑动指示器 + 视频弹窗 + 技术栈筛选
    │   └── animations.js   # IntersectionObserver（当前入场动画已禁用）
    ├── images/             # 图片资源
    └── videos/             # 演示视频
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
- **图片**: 一律输出 WebP + 同路径 jpg/png fallback（部署前处理）
- **视频**: 用 YouTube/Bilibili iframe embed 或 `<video>` 标签 + poster 封面

## 构建 & 部署

```bash
npm run dev      # 开发（热更新）
npm run build    # 构建到 dist/（单页）
```

- 部署到 GitHub Pages：`npm run build` 后 push `dist/` 到 `gh-pages` 分支。
- ⚠️ 项目用 `type="module"`，`index.html` **不能直接双击打开**（file:// 下 CORS 拦截模块脚本），必须通过 Vite 服务器或构建后部署。
- 当前处于**开发阶段，保持 Vite 方案**；部署前再统一优化：图片/视频压缩、构建配置、资源路径策略。

## 内存 / 项目状态

- 设计稿和配色方案在记忆文件中维护。
- 组件变体和设计评审记录在记忆文件中。
- 所有记忆文件位于 `D:\.claude\projects\d--DSEKTOP-----\memory\`。
