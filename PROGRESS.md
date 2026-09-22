# PROGRESS.md — 个人网页项目进度

> progress 会话快照（Δ 增量）。静态基线见 CLAUDE.md；未决事项见 TODO.md；更早快照见 `docs/archive/`。

**当前**：v3-full 主线（v2 基础版已冻结）；**线上正式入口 = https://zhouzzw.online（Cloudflare Pages，2026-09-22 绑定自定义域名）**，GH Pages 为海外镜像

## 📋 快照索引

| 日期 | 主题 | 摘要 | 状态 |
|------|------|------|------|
| 09-22 | CTA 箭头字形修正（字体自托管连带影响） | Geist 的 `↗` 是方头粗短造型 → 箭头显式改用自托管 Noto Sans SC + 去描边 + 24px 补偿；三态与页高三档零回归 | ✅ 完成 |
| 09-22 | 自有域名上线：zhouzzw.online 全链路打通 | 注册局 NS → CF zone → Pages 双域名 HTTPS 200；顺带修 7 处硬编码 github.io、og:image 404、部署脚本缺 `--branch=main` | ✅ 完成 |
| 09-22 | 国内可达性攻坚：外链清零 + Cloudflare 上线 | 字体/图标自托管（外链 5→0，Geist 首次真正生效）+ CF Pages 部署（34 文件 / 89MB / 全量通过）；CloudBase 默认域名实测否决；域名 `zhouzzw.online` 待绑 | ✅ 完成 |
| 09-21 | 移动端视频黑屏修复与 v3 二次上线 | 封面改 `poster` 静帧（封面阶段 mp4 请求 0；弱网出图 12.6s→0.31s）+ 弹层覆盖层（点击播放/加载中 x%）；v2 合并点 8403a10 已上线 | ✅ 完成 |
| 09-21 | 标签近距磁吸替代跟随高光 | `.project-tag` 近距磁吸（R=140 / 8px，回弹 + 橙色）；同日移除 B5 跟随高光与 `--spot-x/--spot-y`；令牌 62/61 | ✅ 完成 |

> 检索归档：`grep -n "#tag: <关键词>" docs/archive/*.md`。09-12「项目卡片分隔线」只提交未写快照（git `72254f6`）。

## 🏷️ 2026-09-22 · CTA 箭头字形修正：自托管字体的连带影响

**结论**：用户反馈「CTA 箭头变粗短，要恢复之前修长的样子」→ 排查确认**根因不是 CSS 参数，而是字体**：09-22 字体自托管后 Geist 的 `↗`（U+2197）字形首次真正生效，而它是「方头、笔画粗、箭杆短」造型（此前页面一直 fallback 到系统字体的细长斜箭头）。修法 = 给箭头**显式指定自托管 Noto Sans SC** + 移除 `-webkit-text-stroke` 描边 + 字号 22→24 补偿 Noto 较小的光学尺寸（移动端 20→22）。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `v3-full`：CTA 箭头恢复细长斜箭头（**动效逻辑一字未动**） |
| commit | 见 git log |
| 遗留 | 观感已由用户看三态图拍板确认；其余待办见 TODO |

### ✅ 完成（Δ 自域名上线批）

| 项 | 位置 | 说明 |
|----|------|------|
| 箭头字形修正 | `assets/css/style.css` | `.cta-split__right` 加 `font-family: 'Noto Sans SC', sans-serif`、删 `-webkit-text-stroke: 0.5px`、`font-size: 22px → 24px` |
| 移动端同步 | `assets/css/mobile.css` | 20px → 22px（同口径补偿） |
| 验证 | `/tmp/probe/{arrow-compare.html,arrow-cta.mjs,cta.mjs}` | 11 字形 × 配置对比 → Noto 24/700 最优；三态截图：两态箭头同形同位置、动效读数 `(-40,40) → (-5.4,5.4) → (0,0)` 正常；页高三档 **15634 / 15968 / 16011** 零回归；令牌 62/61（仅 `--radius-full`） |
| 文档 | `CLAUDE.md` 交互设计 · CTA 条目 | 标注「箭头字形必须锁定 Noto Sans SC」+ 原因与改法（改字号前先跑 arrow-cta.mjs 对比） |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 箭头突然从「细长斜箭头」变成「粗短方头」 | **符号字形随字体变化**：自托管让 Geist 的 `↗` 首次真正生效，此前一直 fallback 到系统字体（09-17 定稿时看到的是系统字形） | 符号类元素（箭头 ↗ / 度量符等）**显式指定字体族**，不依赖继承；换字体后回归检查所有符号字符 | #tag: css |
| headless 下 hover 不触发（读数恒为初始位移） | `@media (hover:hover) and (pointer:fine)` 门控在 headless 默认 `(hover:none)` 下整段失效 | 探针启动加 `--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4`（已写入 `cta.mjs`） | #tag: 视觉验证 |

### 💡 关键发现

- #tag: css — **换字体 = 换字形**：自托管字体全面生效后，必须回归检查**符号 / 图标类字符**的观感（它们此前可能是系统字体在渲染，而设计评审时的"好看"未必来自目标字体）
- #tag: design — 「修长 vs 臃肿」不只由字号决定：`font-family` 的字形设计 + `-webkit-text-stroke` 描边共同决定视觉重量（描边对细笔画符号的"增肥"效果尤其明显）

### 🚀 下会话指令

> 承接箭头修正：已确认，等与域名上线批一起提交

1. 提交（见 git status；建议 `feat` 域名元数据 / `fix` 箭头字形 / `docs` 文档 三个 commit，或按需合并）
2. 待拍板：v3 回滚 v2 · 其余 7 段视频瘦身（~89MB）· I4 `muted` 自动播
3. 已否决（勿再提）：**箭头回退到「依赖系统字体」方案**（跨设备不一致，违背自托管初衷）· CloudBase 默认域名 · 域名转注册商
4. 复现：`node /tmp/probe/arrow-cta.mjs`（字号/字重候选对比，注入式）· `cta.mjs`（三态）· `probe.mjs`（页高）
5. 基线：页高 **15634 / 15968 / 16011** · 令牌 62/61 · 箭头 = **Noto 24px/700**（移动端 22px）

## 🏷️ 2026-09-22 · 自有域名上线：zhouzzw.online 全链路打通

**结论**：`zhouzzw.online`（阿里云首年 ¥1）完成 **注册局 → Cloudflare → Pages** 全链路绑定 —— 实名通过当天改 NS，注册局 1–2h 内同步，zone 转 Active 后 **根域 + www 双入口 HTTPS 200**（证书 GTS，至 12-21）。顺带修掉 3 个「绑域名必然暴露」的问题：**7 处硬编码 `github.io` 元数据**、**og:image 指向 404 路径**（分享缩略图长期拉不到）、**部署脚本缺 `--branch=main`**（`v3-full` 分支部署只落预览环境）。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `https://zhouzzw.online` + `www` 双入口 200；生产已部署 |
| commit | 见 git log（元数据 + 分享图 + 脚本 + 文档） |
| 遗留 | 国内实测 → 定备案 · v3 回滚 v2 决策 · 其余 7 段视频瘦身 |

### ✅ 完成（Δ 自可达性攻坚批）

| 项 | 位置 | 说明 |
|----|------|------|
| NS 切换 + zone 接入 | 阿里云 / CF | 「DNS 修改」填 `april`/`yoxall.ns.cloudflare.com` → CF「**Connect a domain**」建 zone → Pages Custom domains 加根域 + www（自动 CNAME + 证书） |
| 终验（线上） | — | 双域名 200（title 正确）· HTTP→HTTPS 301 · 证书 GTS 至 12-21 · 28 条资源 200 · 8 段视频 **206 + video/mp4**（可拖拽） |
| 元数据切域名 | `index.html` `public/*` | **7 处** `github.io` → `zhouzzw.online`：canonical · og:url · og:image · twitter:image · JSON-LD · sitemap · robots |
| 分享图重建 | `public/og-cover.jpg` | 原 og:image 指向 `assets/images/比赛人物照.jpg`，产物里是 **hash 名** → 两个入口都 404；改 `public/` 稳定路径 + 1200×630（107KB） |
| 部署脚本修复 | `tools/deploy-cloudflare.sh` | 补 `--branch=main`（`v3-full` ≠ `main` 时只更新 `<分支>.pages.dev`） |
| 生产部署 | CF Pages | 增量 4 文件 / 2.15s；meta / sitemap / robots / og-cover 全部复验 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 域名接入方式 | CF「**Connect a domain**」做 DNS 托管（免费）；**不**用「Transfer a domain」转注册商（付费续一年，无必要） | ✅ CLAUDE 硬约束 #5 + TODO 已否决 |
| 分享图策略 | `og:image` 一律放 `public/`（现 `og-cover.jpg`，1200×630），**禁止引用构建产物 hash 路径** | ✅ CLAUDE 硬约束 #5 |
| 元数据一致性 | 换域名时 canonical / og / sitemap / robots / JSON-LD **7 处同步改**，正式域名即规范 URL | ✅ CLAUDE 硬约束 #5 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 本机 dig / nslookup 一律返回 `198.18.0.x` | 代理 fake-IP 劫持 UDP/53 | DNS 走 **DoH** 并多源交叉 | #tag: 视觉验证 |
| 实名通过后仍 NXDOMAIN | 注册局数据未下发（控制台显示的 NS 仅是账户侧记录） | 等 1–2h（激活 → 吸收 NS 变更），DoH 观察 | #tag: 部署 |
| CF 提示 "Transfer DNS management" | zone 不在账户 / 处于 `Pending Nameserver Update` | 先 Connect a domain 建 zone → 等 Active → 再加 Custom domains | #tag: 部署 |
| 绑域名后返回 **522** | CF 边缘未把 hostname 路由到 Pages 项目（Verifying 过渡态） | 等 5–15 分钟转 Active；`pages.dev` 200 证项目正常 | #tag: 部署 |
| 探针报「资源全回退成 HTML（200 + 102KB）」 | ① 手拼 URL 带进 `find` 的 `./` 前缀（`/assets./css/…`）② 产物是 **hash 名**，dev 期路径线上不存在 | 用**线上 HTML 里原样引用的 URL** 逐条验证，别手拼 | #tag: 视觉验证 |

### 💡 关键发现

- #tag: 部署 — **og:image 不能用构建产物路径**（Vite hash → 必然 404）；元数据是「绑域名」的隐藏工作量：**站点能访问 ≠ 完整上线**，canonical / og / sitemap / robots 决定收录与分享卡片
- #tag: 部署 — CF 语义：`Connect a domain`（DNS 托管，免费，要的）vs `Transfer a domain`（注册商转移，付费，不要）；Pages 自定义域名必须 **zone 先 Active**

### 🚀 下会话指令

> 承接域名上线：链路已通，等国内实测结论

1. **P0 国内实测**：手机流量（不挂代理）打开 `https://zhouzzw.online` + itdog.cn 全国测速 → 满意则**不备案**收工；慢则评估备案（¥80–160 + 1–3 周）
2. 待拍板：v3 是否回滚 v2（`git checkout v2 && git revert -m 1 8403a10 && git push origin v2`）· 其余 7 段视频瘦身（~89MB）
3. 待办：文案改写 D1–D14 回填
4. 已否决（勿再提）：**转注册商到 Cloudflare Registrar（付费）** · CloudBase 默认域名 · EdgeOne 大陆免备案 · B5 跟随高光 · CTA 箭头 ↘
5. 复现：`/tmp/domain-verify.sh`（链路验证）· `/tmp/check-domain.sh`（NS 进度）· `~/.cf_token`（部署凭据，勿入库）
6. 基线：页高 **15634 / 15968 / 16011** · 令牌 62/61 · 双入口 `zhouzzw.online`（正式）+ `zhouzzw.github.io/Zhouzzw_Web/`（镜像）

## 🏷️ 2026-09-22 · 国内可达性攻坚：外链清零 + Cloudflare Pages 上线

**结论**：查清国内访客打不开/看着烂的**三层叠加**原因 —— ① `github.io` 域名 DNS 被污染（打不开）② 3 个**阻塞渲染**的墙外样式表（白屏数秒）③ jsdelivr 字体 CSS **一直是 404**、Geist 从未生效（观感降级）。据此完成**外链 5→0 的字体/图标自托管**，并把站点部署到 **Cloudflare Pages**（34 文件 / 89MB / 全量验证通过）；CloudBase 路线经浏览器实测**否决**（默认域名被强制「测试域名」中间页）；域名 `zhouzzw.online` 已购（阿里云 ¥1 活动），等实名通过后绑定。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `v3-full`：字体/图标自托管 + Cloudflare Pages 线上 |
| commit | `feat` + `docs`（本次同步），见 git log |
| 遗留 | `zhouzzw.online` 实名审核中（阿里云锁 DNS 修改）· 文案改写 D1–D14 待回填 · 其余 7 段视频未瘦身 |

### ✅ 完成（Δ 自移动端 poster 批）

| 项 | 位置 | 说明 |
|----|------|------|
| 外链清零 | `index.html` `style.css` | 5 条外链（Google Fonts 3 + jsdelivr 2）+ 9 个图标 CDN → **0** |
| 字体自托管 | `assets/fonts/` | Geist + Geist Mono 可变（115KB）+ Noto Sans SC 子集（17.7MB → 259KB / 903 汉字）；README 记来源、许可、子集更新法 |
| 图标本地化 | `assets/icons/` | 9 个 devicon（44KB）；Linux 换 2.8KB 单色版 + 白底衬（原 193KB 深灰 Tux 在深色底上几乎不可见） |
| 视频瘦身（1 段） | `assets/videos/` | 视觉伺服动态抓卡 32.7MB → 19.9MB（CRF 29）—— 为过 CF 的 **25 MiB 单文件上限** |
| CloudBase 部署 | 腾讯云环境 | 34 文件上传成功、curl 全 200、上海节点 —— 但默认域名有中间页，**不可投放**（见坑） |
| **Cloudflare Pages** | 项目 `zhouzzw-web` | 34 文件 / 89MB / 18.95s；8 视频（`video/mp4`）+ 3 字体 + 图片 + CSS/JS 全量 200 |
| 部署工具链 | `tools/deploy-cloudflare.sh` `wrangler.toml` | `npm run build:cf`（base=/）/ `deploy:cf`（含 25MiB 预校验） |
| 文档 | `README.md`（新建） | 三入口状态表 + base 双路径 + 部署注意事项 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 国内入口 | **Cloudflare Pages + 自有域名**（免备案，走海外节点；速度待域名绑好后实测） | ✅ CLAUDE 部署章节 |
| 备案路线 | 暂缓（¥80–160 + 1–3 周）；先看 CF 实测效果再定 | — |
| CloudBase | 默认域名**不可投放**；环境保留（体验版至 2027-03-21），备案后可启用 | ✅ CLAUDE 部署章节 |
| 字体策略 | **一律自托管，禁止外链字体/图标 CDN** | ✅ CLAUDE 红线 #7 ③ |
| base 双路径 | GH Pages `--base=/Zhouzzw_Web/`；CF / CloudBase `--base=/` | ✅ CLAUDE 构建章节 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| jsdelivr 字体 CSS 一直 404 | `geist@1.3.1` 包内**没有任何 .css**，原路径根本不存在 → **Geist 从未生效**（页面一直用系统字体渲染拉丁/数字） | 字体全部自托管；页高基线随之更新 | #tag: css |
| CloudBase 默认域名被「风险提醒」页拦截 | 腾讯云对默认域名强制中间页（"测试域名、内容未审核"）+ 访问量风控，官方定位「仅用于测试」 | 需备案 + 绑自定义域名；本项目改用 CF | #tag: 部署 |
| CF 部署报"项目不存在"（刚创建成功） | 创建项目后的 API **最终一致性延迟** | 等 10–15s 重试 | #tag: 部署 |
| CF 未匹配路径返回 **200 + index.html** | Pages 的 **SPA 回退**行为 | 判断资源是否真缺失要看 `content_type`，别只看状态码 | #tag: 部署 |
| wrangler 部署成功但生产域名仍 404 | 当前 git 分支 `v3-full` ≠ 项目 production branch `main` → 被当作**预览部署** | 加 `--branch=main` | #tag: 部署 |
| 探针报"中文资源全部 404/HTML" | 探针把 HTML 里**已 percent-encoded** 的路径**又编码一次** | Vite 产物里中文路径已是 `%E6%AF%94…`，直接用 | #tag: 视觉验证 |

### 💡 关键发现

- #tag: 部署 — 云厂商「默认域名」普遍带安全策略（腾讯云中间页、`pages.dev` 国内 DNS 污染）→ **自有域名 + 免备案平台**是零成本最优解；「国内快 + 无警告页」只能备案
- #tag: 性能 — 国内不可达是三层叠加（域名污染 + 阻塞渲染的墙外 CSS + 字体 404），只修一层都不够；外链清零后，站点在**任何能连通的网络下都是完整版**
- #tag: 测量 — 排查线上资源要用「内容类型 + 字节数」双重比对：单看状态码会被 SPA 回退、中间页、双重编码三类假象同时骗过

### 🚀 下会话指令

> 承接可达性攻坚：等域名实名通过 → 改 NS → 绑 Pages → 国内实测

1. **P0 域名链路收尾**：`zhouzzw.online` 实名通过后 → 阿里云「DNS 修改」换成 `april.ns.cloudflare.com` / `yoxall.ns.cloudflare.com` → 检测生效 → 绑 Pages + 开 HTTPS → **国内实测速度**（据此决定是否还要备案）
2. 文案改写落地：等用户回填 D1–D14（实习"三个月"与起止矛盾、"完程度"错别字、职位口径、成果数字确认）
3. 待拍板：其余 7 段视频是否统一瘦身（现 89MB，可再压 ~20MB；CF 走海外节点，对播放体验影响直接）
4. 已否决（勿再提）：CloudBase 默认域名投放 · EdgeOne 大陆区免备案 · 备案路线（本轮暂缓，可重启）
5. 复现：`README.md`（部署路径）· `tools/deploy-cloudflare.sh` · `wrangler.toml`
6. 基线：页高 **15634 / 15968 / 16011** · 令牌 62/61 · 域名 `zhouzzw.online`（实名审核中）

## 🏷️ 2026-09-21 · 移动端视频黑屏修复（poster + 弹层覆盖层）与 v3 二次上线

**结论**：朋友反馈「视频是黑的、播不了」→ 线上实测定位为**体量大 + 弱网 + 移动端自动播放拦截**三者叠加（文件与代码均正常）；修复 = **封面改用 `poster` 静帧**（封面阶段 mp4 请求数 0；弱网出画面 12.6s → **0.31s**）+ **弹层 poster 与覆盖层**（`点击播放` / `加载中 x%`），并把 v3 预览**第二次上线**（`8403a10`，Actions run #4）。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `v3-full`：封面 poster + 弹层覆盖层；生产环境为 v3 预览第二版 |
| commit | `feat` + `docs`（两次），见 git log；v2 侧合并点 `8403a10`，tag `v3-preview-2` |
| 遗留 | **起播仍慢**（7.5s @1.5Mbps，根因是 15–33MB 体积）→ 视频瘦身待拍板 · `muted` 自动播待拍板 · v3 待回滚 v2 |

### ✅ 完成（Δ 自磁吸批）

| 项 | 位置 | 说明 |
|----|------|------|
| 封面 poster 静帧 | `assets/posters/` `index.html` | 8 张 0.5s 静帧（长边 ≤1280 / 68–278KB）；8 个封面 `<video>` 加 `poster` |
| 封面不再拉流 | `main.js` | 删 `initVideoCovers()` 的 IO 门控 seek 截帧 → `initVideoRings()` 只注入光圈环：**封面阶段 mp4 请求 0** |
| 弹层覆盖层 | `main.js` `desktop.css` | 弹层视频带 `poster` + 覆盖层（`▶ 播放` 按钮 + mono 状态行）：被拦截 → `点击播放`；缓冲 → `加载中 x%`（`buffered/duration`）；`playing` 后隐藏 |
| v3 二次上线 | `v2` 分支 | 合并点 `8403a10` 推送 → run #4 success；线上：https://zhouzzw.github.io/Zhouzzw_Web/ |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 封面方案 | **一律 `poster` 静帧，不再 JS seek 截帧** —— JS 截帧每张要拉数 MB（弱网 12.6s 才出图），poster 0 请求、无 JS 也出图、微信内置浏览器同样可靠 | ✅ CLAUDE.md 交互设计 + 红线 #7 |
| 弹层播放策略 | 暂不 `muted`（保留原声），改用覆盖层把「被拦截 / 在缓冲」讲清楚；`muted` 自动播仍待拍板 | ✅ TODO I4 改 `[~]` |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 排查时"8 个视频全部 404" | 我自己把基址拼重（`$base` + 已含 `/Zhouzzw_Web` 的 src） | 拼 URL 前先断言（同一 src 至少一条 200）；`HEAD` 不带 Range 不能验分段 | #tag: 视觉验证 |
| 弱网复现跑两遍结果差 20 倍 | 第二遍命中浏览器缓存（同一 profile） | 弱网测量必须**冷 profile**（`--user-data-dir` 带时间戳） | #tag: 视觉验证 |
| 探针等 `readyState=complete` 超时后读到空页面 | 弱网 + 冷缓存下站点（图片多）30s 内不达 complete | 改为**等 DOM 特征**（`.project-item` 数量）再操作 | #tag: 视觉验证 |

### 💡 关键发现

- #tag: 性能 — 封面阶段的媒体请求是「隐形流量」：每张封面几 MB（8 张 ≈ 数十 MB 潜在流量）。**先量化弱网下的"看不见/播不了"时长，再决定兜底方案**（poster 是投入产出比最高的一档）
- #tag: 视觉验证 — 弱网量化口径：`Network.emulateNetworkConditions`（1.5Mbps / 400ms）+ 手机仿真 + 冷 profile；这组参数能稳定复现用户投诉，且改动前后可比

### 🚀 下会话指令

> 承接移动端修复：线上已是修好的 v3 预览版，等回滚决策与体积拍板

1. **待拍板**：视频瘦身（CRF 28 ≈ 降到 1/3 → 起播 ~2–3s；或 720p 代理；或维持现状）· `muted` 自动播 · v3 是否达标回滚 v2（回滚：`git checkout v2 && git revert -m 1 8403a10 && git push origin v2`）
2. 待办（承接前批）：弹层终日子可读性 · C3 档位数据 · 未使用令牌 `--radius-full`
3. 已否决（勿再提）：B5 跟随高光（已移除）· CTA 箭头改 ↘ · 封面 9:16 不裁切 · A4 简介区 12 栅格 · A3 统一白底衬 · 全站暗色 · char-matrix · B6/B7
4. 复现：`/tmp/probe/live-after.mjs`（修复后线上弱网复测）· `live-slow.mjs`（修复前基线）· `poster-blocked.mjs`（拦截场景）· node 需先 export PATH
5. 基线：页高 **15698 / 15968 / 15986**（未变）· 令牌 **62 声明 / 61 引用** · 视频 8 段 ~99MB + 封面 8 张 ~1.1MB

## 🏷️ 2026-09-21 · 标签近距磁吸替代跟随高光

**结论**：项目关键词标签（`.project-tag`）落地「近距磁吸」——指针进入 R=140px 后被拉向指针、最强 8px，离开回弹；**同日彻底移除 B5 卡片跟随高光**（`::after` radial-gradient 叠加层 + `--spot-x/--spot-y` + `initSpotlight()`），用户判定「光标高亮区域冗余」。页高三档未变，令牌基线 64/63 → **62/61**。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `v3-full`：磁吸标签 + 跟随高光移除 |
| commit | `feat` + `docs`，见 git log |
| 遗留 | `--radius-full` 仍无引用（差集唯一余额）· 磁吸是否扩展到技术栈 / 联系方式 chip 待定 · 线上仍为 v2.4 |

### ✅ 完成（Δ 自光圈/水印批）

| 项 | 位置 | 说明 |
|----|------|------|
| 标签近距磁吸 | `main.js` `desktop.css` | `initMagneticTags()`：R=140 / MAX=8 / `k=(1−d/R)²`；rAF 节流、**先读完几何再统一写 transform**、视口外整组跳过；门控 `hover:hover & pointer:fine`、减动效不挂。CSS：`will-change: transform` + `transform .28s`，`.is-pulled` 转橙 |
| 移除 B5 跟随高光 | 三文件 | 删两处 `::after` radial-gradient 块 + `initSpotlight()` + `--spot-x/--spot-y` 声明 |
| 验证 | `/tmp/probe/magnetic.mjs` | 两处 `::after` 的 `content` 均 `none`；远离全 `none` → 近距 VMC `(−3.61,−2.58)`、LQR `(3.62,−1.94)`、更远 0.19px → 移开复位；build + lint 通过 |
| 强度迭代 | — | 首版 R=100 / 5px 用户判定偏弱 → R=140 / 8px 通过 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 光标交互取舍 | 只保留**携带距离维度**的磁吸；纯装饰的跟随高光（B5）删除 —— 它与 img scale、边框变色三处重复表达「可交互」，信息量零增量 | ✅ CLAUDE.md 交互设计（含「已移除」标注） |
| 磁吸参数 | R=140 / MAX=8（8px 是安全线：再大会让点击目标漂移、标签互相压字） | ✅ CLAUDE.md + TODO 已否决列表 |
| 光标交互实验室 | 只落地 C 方案；A/B/D/E 停留在原型（`/tmp/proto/cursor-lab.html`，未入库） | — 会话内有效 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 磁吸「完全没反应」（读数恒 `none`） | headless 默认 `(hover:none)(pointer:none)`，门控把 JS + CSS 一起关掉；**`Emulation.setEmulatedMedia` 传 `hover`/`pointer` 不生效** | 启动加 `--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4`（已写入 review-v3） | #tag: 视觉验证 |
| 探针读数与预期不符 | 选择器命中了同卡片内的**前一个**元素（大卡 vs 小卡） | 用同一选择器取被 hover 元素及其内部目标 | #tag: 视觉验证 |

### 💡 关键发现

- #tag: design — 「冗余」的判据不是好不好看，而是**反馈有没有信息增量**：同一个 hover 用三种方式说同一句话 = 冗余；换成「距离 → 位移」这条新维度后，一个效果就够
- #tag: 性能 — 跟随类光标效果守两条：rAF 节流 + 读写分离（先量完所有 `getBoundingClientRect` 再统一写 `transform`），并跳过视口外分组

### 🚀 下会话指令

> 承接磁吸批：效果已通过，代码与文档同批提交

1. 待确认：磁吸是否扩展到技术栈技能卡 / 联系方式 chip（**不建议全站铺** —— 两个以上光标效果会重新变冗余）
2. 待拍板（承接前批）：视频体积策略（8 段 ~99MB）· 弹层终日子可读性 · I4 视频自动播放 · C3 档位数据 · v3-full 上线
3. 已否决（勿再提）：**卡片跟随高光（B5，已移除）** · CTA 箭头改 ↘ · 封面 9:16 不裁切 · A4 简介区 12 栅格 · A3 统一白底衬 · 全站暗色 · char-matrix · B6/B7 · CTA 旧动效
4. 复现：`/tmp/probe/magnetic.mjs`（磁吸 + 高光残留自检）· `/tmp/proto/cursor-lab.html`（5 方案原型，未入库）· node 需先 export PATH
5. 基线：页高 **15698 / 15968 / 15986**（本批未变）· 令牌 **62 声明 / 61 引用**

