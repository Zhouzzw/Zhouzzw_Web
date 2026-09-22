# Zhouzzw_Web — 周子惟个人网站

嵌入式 & ROS 机器人开发工程师的个人品牌站点。单页长滚动，Vanilla HTML + CSS + JS，Vite 构建。

## 线上地址

| 入口 | 地址 | 状态 | 说明 |
|------|------|------|------|
| **Cloudflare Pages（正式入口）** | **https://zhouzzw.online** | ✅ 线上 | 2026-09-22 绑定自有域名，根域 + `www` 双入口，HTTPS 自动签发（Google Trust Services）。备用：`https://zhouzzw-web.pages.dev`（⚠️ `pages.dev` 国内 DNS 污染） |
| GitHub Pages（海外镜像） | https://zhouzzw.github.io/Zhouzzw_Web/ | ✅ 线上 | 推送 `v2` 分支由 Actions 自动构建 |

> 两个入口的**资源根路径不同**（`/` 与 `/Zhouzzw_Web/`），构建命令也不同（见下），切勿混用。
> 上线结构 / 维护 / 费用 / 故障排查 → 见 **`docs/运维手册.md`**。

### Cloudflare Pages 部署

```bash
export CLOUDFLARE_API_TOKEN=<Pages:Edit 权限的 Token>
npm run deploy:cf     # = build:cf（base=/ → dist-cf/）+ wrangler pages deploy
```

- 项目名 `zhouzzw-web`，产物目录 `dist-cf/`
- **自定义域名**（2026-09-22 绑定）：`zhouzzw.online` + `www.zhouzzw.online`，绑在 Pages 项目**生产环境**；DNS 托管在 Cloudflare（zone NS = `april` / `yoxall.ns.cloudflare.com`，注册商仍为阿里云）
- ⚠️ **单文件上限 25 MiB**：部署脚本会自动预校验。`assets/videos/视觉伺服动态抓卡.mp4` 已从 32.7 MB 压到 **19.9 MB**（CRF 29）
- ⚠️ **分支决定生产/预览**：当前 git 分支不是 `main` 时，wrangler 会当作**预览部署**，只更新 `<分支>.zhouzzw-web.pages.dev`；要更新生产域名必须显式 `--branch=main`
- ⚠️ 未匹配的路径会被 **SPA 回退到 index.html（返回 200）** —— 排查资源 404 时别被"200 + text/html"骗了（用 `content_type` 判断）


## 开发

```bash
npm install
npm run dev        # → http://localhost:5173/Zhouzzw_Web/（base = /Zhouzzw_Web/）
```

## 构建与部署

```bash
# GitHub Pages（base = /Zhouzzw_Web/，由 vite.config.js 默认值提供）
npm run build        # 产物 → dist/

# Cloudflare Pages（base = /，站点挂在域名根路径）
npm run build:cf     # 产物 → dist-cf/（= vite build --base=/ --outDir dist-cf）
```

部署到 Cloudflare Pages 见上一节（项目名 `zhouzzw-web`，生产分支 `main`）。

## 关键约定

- **字体全部自托管**（Geist / Geist Mono / Noto Sans SC 子集），不引任何墙外 CDN —— 详见 `assets/fonts/README.md`
- **禁止引入外链字体 / 图标 CDN**：Google Fonts 国内不可达、jsdelivr 时通时断，且都阻塞首屏
- 站点结构、设计令牌、交互规范、工程红线 → 见 `CLAUDE.md`
- 会话进度快照 → `PROGRESS.md`；未决事项 → `TODO.md`

## 目录结构

```
├── index.html              # 单页站点（Hero → 简介 → 技术栈 → 项目 → 实习 → 荣誉 → 关于 → 联系）
├── assets/
│   ├── css/                # style.css（令牌+基类） / desktop.css / mobile.css
│   ├── js/                 # main.js（导航/弹层/筛选/磁吸） / animations.js（入场/计数/打字机）
│   ├── fonts/              # 自托管字体 3 个 woff2 + README（来源、许可、子集更新法）
│   ├── icons/              # 工具图标 9 个（devicon）
│   ├── images/ posters/    # 图片与视频封面静帧
│   └── videos/             # 演示视频 8 段
├── public/                 # robots.txt / sitemap.xml / og-cover.jpg（分享缩略图，原样拷贝进产物）
└── vite.config.js
```

> ⚠️ `vite.config.js` 的 `base: '/Zhouzzw_Web/'` 是 GitHub Pages 必需（仓库名即子路径），**不能删**；Cloudflare Pages 构建通过命令行 `--base=/` 覆盖（`npm run build:cf`）。
