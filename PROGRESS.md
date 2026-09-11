# PROGRESS.md — 个人网页项目进度

> 本文件为 progress 会话快照（Δ 增量）。静态基线见 CLAUDE.md；跨会话未决事项见 TODO.md。
> 恢复上下文：读下方索引 + 最近 1-2 快照即可（~3KB）。历史归档可 grep `docs/archive/`。

**当前**：v2 主线 · v2.4 已上线（https://zhouzzw.github.io/Zhouzzw_Web/）

## 📋 快照索引

| 日期 | 主题 | 摘要 | 状态 |
|------|------|------|------|
| 09-11 | P2 清一轮：字符矩阵 + SEO（竖版修复被否决退回） | char-matrix 接入技术栈区、SEO meta/OG/JSON-LD、CLAUDE 路径修正；竖版视频适配经预览后退回原样 | ✅ 完成 |
| 09-11 | G1-D 工业项目区 + 实习模块落地 | 工业项目区 003/004、实习骨架、技术栈 6→8 分类、全站方向偏移为嵌软+ROS 全栈 | ✅ 完成 |
| 09-11 | 文档体系 v2 主线化 + TODO 建立 | 建 TODO.md、v3 降为风格实验分支、PROGRESS 快照化、设计令牌迁 CLAUDE | ✅ 完成 |

## 🏷️ 2026-09-11 · P2 清一轮：char-matrix 接入 + SEO meta（竖版视频修复被否决退回）

**结论**：TODO 四项中三项落地（char-matrix 接入、SEO meta、CLAUDE 记忆路径）；竖版视频修复经用户预览后被否决退回，原样保留。实习内容与分支合并仍待用户。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ 完成 代码改动 — 仍在分支 `feature/g1d-industry-and-resume`，未合并、未推送 |
| commit | 本快照对应最后一个 feat 提交（见 git log） |
| 遗留 | 🟡 实习内容待补 · 工业卡片素材待补 · 分支待合并（需用户确认） |

### ✅ 完成（Δ 自 G1-D 工业项目区落地）

| 项 | 位置 | 说明 |
|----|------|------|
| ~~竖版视频裁切修复~~ → 已退回 | `index.html` + CSS + JS | 用户预览后决定保留原 16:9 三列并列展示，竖版适配代码全部移除（见「决策」与 TODO [-] 条目） |
| char-matrix 接入 | `index.html` + `style.css` + `main.js` | 技术分类深色 section 换 `char-matrix-section` + `<canvas id="charMatrix">`，替代静态 SVG 水印；`main.js` 顶部 `import './char-matrix.js'`（该模块导入即自初始化，勿重复调用） |
| SEO meta | `index.html` `<head>` | description/keywords/author/canonical + Open Graph 7 项 + Twitter Card + Person JSON-LD；OG 图用比赛人物照 |
| CLAUDE 路径修正 | `CLAUDE.md` | 记忆路径 `D:\...`（Windows 残留）→ `/home/qskj-2/.zcode/cli/memories/projects/personal_web-4ea9280a70183293/memory/` |
| TODO 对账 | `TODO.md` | 已完成四条移除；剩余 P1 实习内容、P2 素材两类 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 竖版封面布局 | ~~不让竖版挤 3 列等宽网格~~ → **用户预览后退回**：三视频恢复 16:9 三列并列原样（含弹窗 16:9），接受竖版裁切 | ✅ 用户拍板，TODO 记 [-] |
| 弹窗适配方式 | JS 读封面类切换弹窗容器类（已随退回移除）；若未来再做，此思路仍可用 | 留档 |
| char-matrix 接入方式 | 导入即用（模块自带 DOMContentLoaded 自初始化），不显式调用 `initCharMatrix()` 防双实例双 rAF | 本次生效 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 字符矩阵 canvas 只画满 section 顶部 ~640px，下方全空 | `.char-matrix-section > *`（`position: relative`）与 `.char-matrix-bg`（`position: absolute`）同为 (0,1,0) 特异性，声明在后把背景层打回文档流，`inset: 0` 失效 | 加 `.char-matrix-section .char-matrix-bg { position: absolute; z-index: 0; }`（0,2,0）压回 | #tag: css |
| 无头 Chrome `--virtual-time-budget` 下截图时序不确定：同页面 8s/15s/30s 三次截图 canvas 覆盖范围不一致 | 虚拟时间会加速/跳过 rAF 与 ResizeObserver 回调，不适合验证「多帧后才稳定」的 canvas | 用探针法验尺寸：`setTimeout` 5s 后把 `canvas.width/parent.clientHeight` 写进 DOM，`--virtual-time-budget` + `--dump-dom` 读数值（尺寸确定）；视觉效果再配合截图 | #tag: 视觉验证 |

### 💡 关键发现

- #tag: css — 给 section 直接子元素统一提 z-index 时，若其中混有绝对定位背景层，`> *` 通配规则会覆盖其 `position`；背景层必须用更高特异性显式压回 `absolute`
- #tag: 视觉验证 — headless 截图对 canvas 动画页面不可靠（rAF 时序不定），先探针验几何尺寸、后截图看质感；探针需写入 DOM 再 `--dump-dom` 读取
- #tag: mp4 — 无 ffmpeg/ffprobe 环境下可用 python 读 mp4 `tkhd` box 解析宽高（ver0: off=box+4+4+20+52，ver1: +32，宽高为 16.16 定点数）

### 🚀 下会话指令

> 承接 G1-D 工业项目区：P2 可自主项已清空，剩余全部依赖用户输入或确认

1. 实习经历内容待用户补充（职责 / 起止时间 / 产出）→ 填充 `#internship` → TODO.md P1
2. 分支 `feature/g1d-industry-and-resume` 现含工业项目区 + 本次 P2 清理两批改动，待用户确认后 `--no-ff` 合入 v2 并 push（push 后线上自动更新）
3. 工业卡片素材（实拍图/演示视频）与全向轮视频待用户提供 → TODO.md P2
4. 已否决项 — 竖版视频不采用 `object-fit: contain`（会留黑边），选了容器自适应方案；char-matrix 未做显式初始化调用（防双实例）

## 🏷️ 2026-09-11 · G1-D 工业项目区 + 实习模块落地（方向偏移为嵌软 + ROS 全栈）

**结论**：P1 三件落地两件 —— 新增工业项目区块（003 Tesseract / 004 Isaac RL）与实习经历骨架；全站文案从纯嵌软偏移为「嵌软 + ROS 上下位机全栈」。实习条目内容仍待用户补充，分支待合并。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ 完成 代码改动 — 分支 `feature/g1d-industry-and-resume`，**未合并 v2、未推送** |
| commit | ff9fa39（分支内，v2 主线未动） |
| 遗留 | 🟡 实习内容待补 · 工业卡片缺演示视频 · 分支待 `--no-ff` 合入 |

### ✅ 完成（Δ 自 文档体系 v2 主线化）

| 项 | 位置 | 说明 |
|----|------|------|
| 工业项目区块 | `index.html` | 新增独立深色区块「同一个抓卡任务，两条技术路线」：003 G1-D Tesseract 双臂运动控制、004 G1-D Isaac RL 端到端到位控制（内容取自两份工程 README） |
| 实习经历 section | `index.html` `#internship` | 骨架：武汉晴山科技 · ROS 开发工程师 + 时间线条目；导航栏与页脚同步加「实习」锚点 |
| 技术栈扩容 | `index.html` | 6 → 8 分类：新增 004 ROS 机器人开发、006 具身智能 / 强化学习；筛选钮加「ROS 开发」「具身智能」；工具箱加 ROS2 图标（8→9 个，网格 8 列改 9 列） |
| 全站方向偏移 | `index.html` `style.css` | hero 标题改「上下位机全栈工程师」、kicker `Embedded · ROS2 · Embodied AI`、简介加入晴山科技经历、title/meta、螺旋关键词 MATLAB→ROS2（20 处）、深色水印、页脚标语 |
| 图片素材 | `assets/images/` | 2 张 G1-D 图入库（1920×1080，各 173 KB） |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 工业项目呈现方式 | 新建独立区块（非追加进 RoboMaster 区），与军备项目形成两个簇 | 本次生效 |
| 缺失展示图处理 | 用现有 Mujoco G1 渲染图兜底入库，待实拍/演示素材到位后替换 | 本次生效 |
| 实习模块节奏 | 先落 section 骨架占位，内容待用户补充后填充（不编造） | 本次生效 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 工具箱 ROS 图标"消失"——URL 返回 200 且浏览器已缓存，画面却无图标 | devicon `ros-original.svg` 填充色 `#22314e` 深蓝（亮度 48），与深色底 `#242423`（亮度 37）对比度极低，肉眼不可辨 | 套用项目现成的 `.tool-icon--light` 白底衬类（GitHub 图标同款） | #tag: design |
| 无头 Chrome 整页截图在折叠线以下全空白，误判为"区块未渲染" | hero `min-height: 100svh` 撑满视口高度，`--window-size` 的大高度未生效 | 临时 CSS `main > section:nth-of-type(N){display:block}` 隔离单区块逐段截图 | #tag: 视觉验证 |

### 💡 关键发现

- #tag: 视觉验证 — 网页渲染核验可行路径：`google-chrome --headless=new --virtual-time-budget=8000 --window-size=W,H` + 临时 CSS 隔离目标 section；**验证后必须重新 `npm run build`** —— `dist/` 未被 git 跟踪，`git checkout` 无法还原被改写的构建产物
- #tag: design — 深色图标在深色背景上的可见性要靠底衬解决，项目内已有 `.tool-icon--light` 现成方案，新增图标先查该类的适用性
- #tag: docs — 原 `index.html` 技术栈区存在多余 `</div>`（HEAD 既有问题，非本次引入）；两个新增区块的 div 收支已实测平衡

### 🚀 下会话指令

> 承接文档体系 v2 主线化：P1 三件中 ✅ 两项已落地、🟡 实习内容仍在等素材

1. 实习经历内容待用户补充（岗位职责 / 起止时间 / 产出）→ 填充 `#internship` section → TODO.md P1
2. 分支 `feature/g1d-industry-and-resume` 待 `--no-ff` 合入 v2 + push（**合入与推送需用户确认**）
3. 工业项目两张卡片缺演示视频、展示图为第三方渲染图兜底 → 素材到位后补齐 → TODO.md P2
4. 观察项 — 线上 v2.4 仍为偏移前版本；本次改动合并推送后线上才会更新
5. 已否决项 — 未把工业项目追加进 RoboMaster 区块（保持「军备 + 工业」两个项目簇的信息层次）

## 🏷️ 2026-09-11 · 文档体系 v2 主线化 + TODO 清单建立

**结论**：确立 v2 为唯一开发主线，建立项目级 TODO.md（去重合并 + P0-P4 分组），并将 PROGRESS.md 从旧式长文档迁移到快照格式。本次为纯文档治理，无代码改动。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ 完成 文档治理（TODO 建立 + v2 主线化 + PROGRESS 快照化） |
| commit | 16eaabe / 4106a4c / f39268f / af99f52 |
| 遗留 | 🔴 P1 网页新增三件仍待素材（实习经历 + G1-D Tesseract / Isaac RL 两项目卡片） |

### ✅ 完成（Δ 自 v2.4 上线）

| 项 | 位置 | 说明 |
|----|------|------|
| 新增 TODO.md | `TODO.md` | 项目级待办唯一住所：P0-P4 分组 + 风险清单（filter-repo SHA 失效警示） |
| v2 主线化 | `CLAUDE.md` | `v3-rig-style` 标注为风格实验分支、不排期（见 CLAUDE.md「项目概述」） |
| 待办归口 | `PROGRESS.md` | 移除旧「待完成」长清单，改指向 TODO.md，防双份维护 |
| PROGRESS 快照化 | `PROGRESS.md` | 旧式长文档→快照格式；旧全文归档 docs/archive/ |
| 设计令牌迁移 | `CLAUDE.md` | 静态令牌表从 PROGRESS 迁入 CLAUDE「设计令牌」节 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| v2 / v3 双线取舍 | v2 为唯一主线；v3 定位风格实验、仅供查看效果、不排期 | ✅ CLAUDE.md |
| 待办归口 | 未决事项统一收进 TODO.md，PROGRESS/CLAUDE 不再各自维护清单 | ✅ 本次生效 |

### 💡 关键发现

- #tag: docs — 三层文档分工（CLAUDE 静态 / PROGRESS 快照 / TODO 未决）确立后，恢复成本降至 ~3KB：读索引 + 最近 1 快照
- #tag: git — `v2`（单人模式）即全局 Git 规则主分支；文档类小改动直接 commit 主分支，push / 合主需确认（全局 CLAUDE.md 第 7/9 条）

### 🚀 下会话指令

> 承接 v2.4 上线：遗留项 = P1 网页新增三件稍后开工（素材到位即做）

1. P1 网页新增（实习经历模块 + G1-D Tesseract / Isaac RL 两项目卡片）等素材 — 素材齐后按既有 section 风格实现 → TODO.md P1
2. 素材到位前可推进 P2 — 旋转跳跃视频竖版裁切（[!]）、char-matrix 接入技术栈区、全向轮视频、SEO → TODO.md P2
3. 观察项 — 设计令牌已迁 CLAUDE.md；若发现 CSS 令牌与 CLAUDE 表不一致，以实际 CSS 为准并回填
4. 已否决项 — v3-rig-style 不当主线，勿为其排期（定位固定于 CLAUDE.md「项目概述」）
5. 恢复步骤 — 开发机 `npm run dev`（http://localhost:5173）；构建调优 `npm run build`。`index.html` 不能双击直开（file:// 拦模块脚本）