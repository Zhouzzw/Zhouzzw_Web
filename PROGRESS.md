# PROGRESS.md — 个人网页项目进度

> 本文件为 progress 会话快照（Δ 增量）。静态基线见 CLAUDE.md；跨会话未决事项见 TODO.md。
> 恢复上下文：读下方索引 + 最近 1-2 快照即可（~3KB）。历史归档可 grep `docs/archive/`。

**当前**：v3-full 主线（v2 基础版已冻结；线上仍为 v2.4 https://zhouzzw.github.io/Zhouzzw_Web/）

## 📋 快照索引

| 日期 | 主题 | 摘要 | 状态 |
|------|------|------|------|
| 09-12 | 终端分隔条延长 + 导航锚点顺序修正 | 终端条改两端对等外延（距视口 32px、比正文外扩 48px）；修 nav/footer「实习↔技术栈」顺序与页面相反 | ✅ 完成 |
| 09-12 | v3-full 独立化：v2/v3 并列 | `v3-rig-style` 改名 `v3-full` 并覆盖为当前全部成果，删除 `feature/g1d-industry-and-resume`；远程已同步 | ✅ 完成 |
| 09-12 | 暗带→实习终端提示符分隔落地 | 三方案对比页供选，用户选定终端提示符；位置移至**项目模块→技术栈模块**间 | ✅ 完成 |

> 更早快照已归档 → `docs/archive/INDEX.md`，检索 `grep -n "#tag: <关键词>" docs/archive/*.md`。
> 09-12「项目卡片分隔线 + 标题下移」当年只提交未写快照，见 git `72254f6`。

## 🏷️ 2026-09-12 · 终端分隔条延长 + 导航锚点顺序修正

**结论**：终端分隔符由「内容宽度圆角浮窗」改为「两端对等外延的圆角条」——桌面两侧各距视口 32px、比正文列外扩 48px，不再与段首平齐，读作分隔物而非一行正文；顺带修掉导航栏/页脚「实习↔技术栈」顺序与页面相反的 bug。

| 维度 | 状态 |
|------|------|
| 主线 | `v3-full` |
| commit | 与本次快照同批提交 |
| 遗留 | 🟡 分隔条延伸量可再微调 · 素材类待办见 TODO.md P2 |

### ✅ 完成（Δ 自 v3-full 独立化）

| 项 | 位置 | 说明 |
|----|------|------|
| 形态三轮迭代 | `assets/css/style.css` | ①通栏黑带（**用户称违和，否决**）→ ②圆角 + 仅右端外延 → ③两端对等外延，定稿 |
| 两端对等外延 | `assets/css/style.css` | ≥1024px：`margin-left/right: calc(var(--space-8) - var(--gutter-desktop))`，左侧 80→32px、右侧外扩 48px；移动端 `calc(var(--space-2) - var(--gutter-mobile))`（8px） |
| `max-width` 覆盖 | `assets/css/style.css` | `.term-divider { max-width: none }` —— 全局 `p{max-width:65ch}` 会把宽度压在 ~665px |
| 命令拆包 + 窄屏降级 | `index.html` `mobile.css` | 路径段独立为 `.term-divider__path`，<768px `display:none` 回退 `$ cd techstack`；`.term-divider__cmd` 加 `white-space: nowrap` |
| 导航/页脚顺序修正 | `index.html` | 实习↔技术栈 两个 `<li>` 互换（nav 69-71 / footer 944-946），与 section DOM 顺序对齐 |

### 🧭 决策

| 决策 | 结论 | 是否沉淀 CLAUDE.md |
|------|------|-------------------|
| 分隔条是否通栏 | **否决**通栏黑带（用户称违和）；定稿 = 圆角面板 + 两端对等外延 + 比正文列更宽 | 否 |
| 分隔物与正文的关系 | 不能与段首平齐，须比正文列外扩，否则被读成一行正文 | 否 |
| 长命令窄屏处理 | 路径打包成独立 span，窄屏隐藏回退短命令；不做字号硬压 | 否 |
| 通栏组件须 `max-width:none` | 拟写入 CLAUDE.md「开发规范」，**待用户确认** | ⏳ 待确认 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 分隔条左侧通栏生效、右侧不延伸，宽度卡死 665px | 全局 `p { max-width: 65ch }`（17px mono 下 ≈665px）压住了宽度 | `.term-divider { max-width: none }` | #tag: css |
| 无头 Chrome 截图停在首屏，hash 锚点不生效 | `--virtual-time-budget` 跳过平滑滚动，页面没滚到目标区块 | iframe 探针：同源 `contentWindow.scrollTo({behavior:'instant'})` 后再读数/截图 | #tag: 视觉验证 |
| 390px 下长路径命令换行，三圆点被挤到第二行且右侧被裁 | 37 字符命令 + 圆点超出面板内容宽 | 路径 span 窄屏 `display:none`，回退短命令 | #tag: design |
| 导航栏「实习」排在「技术栈」前，与页面顺序相反 | 09-12 实习区块重排时只改 body，nav/footer 锚点未同步 | 两处 `<li>` 互换；`main.js` scrollspy 取 section DOM 顺序，不受影响 | #tag: docs |

### 💡 关键发现

- #tag: css — 给 `<p>` 做的通栏组件必须显式 `max-width: none`，项目全局 `p{max-width:65ch}` 会静默截断宽度
- #tag: css — `margin: 0 X var(--space-10)` 三值写法 = top / 左右同值 / bottom，适合两端对称外扩
- #tag: 视觉验证 — 验证首屏以外元素：临时 iframe 探针页（同源可读 `getComputedStyle`/`getBoundingClientRect` + `scrollTo`），比 hash 导航与超大 `--window-size` 都可靠（后者会被 hero `min-height:100svh` 撑坏）
- #tag: design — 分隔物要读成「分隔」，必须比正文列宽；与段首平齐会被读成一行正文
- #tag: docs — 区块重排后必须同步 nav/footer 锚点顺序；scrollspy 按 section DOM 顺序工作，所以 bug 只错在 HTML 排列

### 🚀 下会话指令

> 承接 v3-full 独立化：本次的未提交改动已与快照同批提交

1. 分隔条延伸量可再调 —— 现「距视口 32px / 外扩 48px」；更夸张改 `var(--space-6)`（24px）或 `-var(--gutter-desktop)`（贴边）
2. 素材类待办（工业卡片图/视频、全向轮视频）→ TODO.md P2，等用户提供
3. v3-full 上线方案（workflow 只监听 v2）→ TODO.md P4，等用户决策
4. 已否决项 — 通栏黑带形态（用户称违和）；勿再做成与正文等宽、或左侧与段首平齐
5. 归档 — 本次把 7 个旧快照移入 `docs/archive/`，检索 `grep -n "#tag: <关键词>" docs/archive/*.md`

## 🏷️ 2026-09-12 · v3-full 独立化：v2/v3 并列

**结论**：用户决定重组分支结构——`v3-rig-style` 改名 `v3-full` 并整体覆盖为当前开发成果（`reset --hard` feature 内容），随后删除 `feature/g1d-industry-and-resume`，全部改动独立到 `v3-full`。仓库从此是 **v2（基础版）与 v3-full（完整版）并列** 结构，两分支并行开发、不合并。远程已同步：`v3-full` 推送上线，`v3-rig-style` 删除，git 远程切至 SSH。

| 维度 | 状态 |
|------|------|
| 分支 | `v3-full`（本地=远程）7faeb7c，承载全部改动；`v2` 仍为 b00dae8 基础版，不接受 v3 内容 |
| 远程 | ✅ `origin/v3-full` 已推送；`origin/v3-rig-style` 已删除；remote URL 已切 SSH（HTTPS 有 TLS 故障） |
| 遗留 | 🟡 v2 线上更新待用户决策（默认 v2 保持基础版不更新） |

### ✅ 完成

| 项 | 说明 |
|----|------|
| 分支改名 | `v3-rig-style` → `v3-full` |
| 内容覆盖 | `reset --hard feature/g1d-industry-and-resume`，原 v3 红黑风格内容全部舍弃 |
| 删除 feature | `feature/g1d-industry-and-resume` 删除，改动归 v3-full 独有 |
| 远程同步 | `git push -u origin v3-full` + `git push origin --delete v3-rig-style`；认证方式 HTTPS → SSH（`git@github.com:Zhouzzw/Zhouzzw_Web.git`，SSH 已验证通过） |
| 文档同步 | CLAUDE.md / TODO.md 定位改为「v2/v3 并列」；PROGRESS 快照更新 |

### 🧭 决策

| 决策 | 结论 |
|------|------|
| 分支结构 | v2（基础）与 v3-full（完整版）并列，后续改动在 v3-full；原 feature 删除；**两分支不合并** |
| 旧 v3 内容 | 用户明确舍弃（红黑 brutalist 实验），本地对象库留有副本可恢复 |
| 远程认证 | HTTPS（TLS 握手失败）→ SSH，稳定性更好 |

### 🚀 下会话指令

1. v2 线上更新 — 已定 v2 保持基础版、不接收 v3；如需线上展示完整版，改走 v3-full 单独部署（另议）
2. 素材类待办（工业卡片图/视频、全向轮视频）仍在 TODO.md P2

## 🏷️ 2026-09-12 · 暗带→实习终端提示符分隔落地

**结论**：用户要求正式分隔方案，做三候选对比页（A datasheet 标尺线 / B 电路走线+过孔 / C 终端提示符）渲染供选，**用户选定 C**。首次实现放在技术栈→实习之间，用户指正后**移至项目模块与技术栈模块之间**（工业项目区 004 之后、techstack 头部之前），命令改为 `$ cd techstack`，并适配暗色背景（浅灰文字 + 橙色 `$`/光标）。实习区恢复明暗切换干净开头。

### ✅ 完成（Δ 自 页面明暗节奏调整）

| 项 | 位置 | 说明 |
|----|------|------|
| 方案对比页 | `dist/dividers.html`（临时，已删） | 三种分隔各自渲染在「暗带→浅色」过渡里供真实预览对比 |
| 分隔符落地（修正后） | `index.html` `#techstack` 顶部 + `style.css` | `.term-divider`：mono 字体、橙色 `$` + `cd techstack` + 橙色闪烁光标（1.1s steps）；`.section--dark .term-divider` 用 `--color-ghost-grey` 适配暗→暗模块间隔 |
| #internship 还原 | `index.html` | 移除分隔符，恢复 `section__header` 开头；浅色区顶部无多余元素 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 分隔位置 | 用户两次指正：分隔的是**模块**（项目 vs 技术栈），不是明暗过渡处（技术栈 vs 实习） | 本次生效 |
| 暗色内分隔配色 | 分隔符夹在两个暗色模块间时，文字用浅灰 `--color-ghost-grey`，`$`/光标保持橙色 | 本次生效 |

### 💡 关键发现

- #tag: 视觉验证 — 无头 Chrome 截图页面高度超出视口会截断；用「找最后非白内容行」的像素检测不可靠（背景是米白 #F1EEE7 并非纯白），应直接用超大 `--window-size` 高度 + 视觉确认，或用 JS 输出 `scrollHeight`

