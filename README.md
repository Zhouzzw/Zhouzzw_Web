# Zhouzzw_Web — 周子惟个人网站

嵌入式 & ROS 机器人开发工程师的个人品牌站点。单页长滚动，Vanilla HTML + CSS + JS，Vite 构建。

## 线上地址

| 入口 | 地址 | 状态 | 说明 |
|------|------|------|------|
| **Cloudflare Pages** | https://zhouzzw-web.pages.dev | ✅ 已部署 | 89MB / 34 文件。⚠️ **`pages.dev` 在国内被 DNS 污染**，正式投放必须绑自定义域名 |
| GitHub Pages | https://zhouzzw.github.io/Zhouzzw_Web/ | ✅ 线上 | 推送 `v2` 分支由 Actions 自动构建（海外入口） |
| CloudBase（腾讯云） | https://zhouzzw-web-d4gqooq50469f893d-1493094617.tcloudbaseapp.com/ | ⚠️ 不可投放 | 文件已上传、服务端 curl 全 200，但**腾讯云对默认域名强制"测试域名"中间页 + 风控**，须备案后绑自定义域名才可用 |

> 三个入口的**资源根路径不同**，构建命令也因此不同（见下），切勿混用。

### Cloudflare Pages 部署

```bash
export CLOUDFLARE_API_TOKEN=<Pages:Edit 权限的 Token>
npm run deploy:cf     # = build:cf（base=/ → dist-cb/）+ wrangler pages deploy
```

- 项目名 `zhouzzw-web`，产物目录 `dist-cb/`
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
npm run build                  # 产物 → dist/

# CloudBase 静态托管（base 必须是 /，站点挂在域名根路径）
npx vite build --base=/ --outDir dist-cb   # 产物 → dist-cb/
```

部署到 CloudBase 用 `manageHosting`（上传 `dist-cb/` 内容到托管根目录）：

- `action=upload`，`files[]` 逐项传 `{localPath, cloudPath}`
- ⚠️ **不要一次传整个目录** —— 全量约 100MB 会触发 API 网络超时。按「核心文件 → 小视频 → 大视频」分批（单批 ≤ 30MB 稳妥）
- 上传后 `action=setWebsiteDocument`，`indexDocument=index.html`
- 静态域名：`zhouzzw-web-d4gqooq50469f893d-1493094617.tcloudbaseapp.com`（域名根路径）

### 本仓库的 CloudBase 资源

| 资源 | 值 |
|------|-----|
| 环境 ID | `zhouzzw-web-d4gqooq50469f893d`（别名 `zhouzzw-web`） |
| 地域 | `ap-shanghai` |
| 套餐 | 体验版 `baas_trial`（到期 2027-03-21） |
| AppId | `1493094617` |
| 静态托管 Bucket | `6e3b-static-zhouzzw-web-d4gqooq50469f893d-1493094617` |
| 托管文件 | 34 个（8 段视频 ~95MB + 17 张图 + 字体 + HTML/CSS/JS） |

数据库（PostgreSQL）随环境开通但**本站不使用**。

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
├── public/                 # robots.txt / sitemap.xml（原样拷贝进构建产物）
└── vite.config.js
```

> ⚠️ `vite.config.js` 的 `base: '/Zhouzzw_Web/'` 是 GitHub Pages 必需（仓库名即子路径），**不能删**；CloudBase 构建通过命令行 `--base=/` 覆盖。
