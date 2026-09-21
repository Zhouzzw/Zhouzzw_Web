# PROGRESS.md — 个人网页项目进度

> progress 会话快照（Δ 增量）。静态基线见 CLAUDE.md；未决事项见 TODO.md；更早快照见 `docs/archive/`。

**当前**：v3-full 主线（v2 基础版已冻结；线上仍为 v2.4 https://zhouzzw.github.io/Zhouzzw_Web/）

## 📋 快照索引

| 日期 | 主题 | 摘要 | 状态 |
|------|------|------|------|
| 09-21 | 标签近距磁吸替代跟随高光 | `.project-tag` 近距磁吸（R=140 / 8px，回弹 + 橙色）；同日移除 B5 跟随高光与 `--spot-x/--spot-y`；令牌 62/61 | ✅ 完成 |
| 09-21 | 播放键 hover 光圈画圆与暗区水印关键词 | 封面 hover 改「橙色光圈自 12 点顺时针画圆」；水印换成 ROS2 · LQR · VMC · ROBOTICS · RL · FREERTOS；CTA 方向维持 ↗ | ✅ 完成 |
| 09-21 | G1-D 演示视频挂载与弹层比例修复 | 5 段视频入库（1080p30 CRF 26）；003 大卡+小卡3格、004 视频占整卡位；弹层按视频真实比例自适应；页高 15698 / 15968 / 15986 | ✅ 完成 |
| 09-17 | CTA 画面切换动效与螺旋性能优化 | CTA 定稿：画面自左下沿 ↗ 推入（箭头随画面、位置零跳变）+ 8px 圆角；螺旋 A 档：删每帧滤镜/延迟启动/不可见暂停 → 加载 12→32 FPS、稳态 17→42.5 | ✅ 完成 |

> 检索归档：`grep -n "#tag: <关键词>" docs/archive/*.md`。09-12「项目卡片分隔线」只提交未写快照（git `72254f6`）。

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

## 🏷️ 2026-09-21 · 播放键 hover 光圈画圆与暗区水印关键词

**结论**：视频封面 hover 反馈由「播放键整圈变橙」改为**橙色光圈自 12 点顺时针画圆**（SVG `stroke-dashoffset` 194.78 → 0，0.65s `--ease-standard`）；暗区水印 5 行文案换成 `ROS2 · LQR · VMC · ROBOTICS · RL · FREERTOS ·`；**CTA 箭头 ↘ 方向改动已按用户要求撤回**，维持 ↗ 与「左下 → 右上」推入。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `v3-full`：hover 光圈 + 水印文案（CTA 未改） |
| commit | `feat` + `docs`，见 git log |
| 遗留 | 光圈观感待用户确认（时长 / 线宽 / 旋向可调）· 体积策略与终日子可读性仍待拍板 · 线上仍为 v2.4 |

### ✅ 完成（Δ 自视频挂载批）

| 项 | 位置 | 说明 |
|----|------|------|
| 播放键光圈画圆 | `main.js` `desktop.css` | JS 向每个 `.video-cover__play-icon` 注入 SVG 圆环（`r=31`，周长 194.78）；未 hover `dashoffset:194.78`（不可见）→ hover `0`（0.65s `--ease-standard`）；SVG `rotate(-90deg)` 使起笔在 12 点、顺时针；移出 0.22s 收笔；减动效下瞬时显示不画 |
| 去掉旧 hover 高亮 | `desktop.css` | 删 `.video-cover:hover .video-cover__play-icon { border-color: var(--color-accent) }`（整圈变橙的旧行为），保留 scale(1.1) 与遮罩变暗 |
| 水印文案替换 | `style.css` | data-URI 内 5 个 `<text>` 换成 `ROS2 · LQR · VMC · ROBOTICS · RL · FREERTOS ·`（保留行尾 ` · ` 维持平铺）；填充 `fill='white'` / `fill-opacity='0.045'` / `rotate(-15)` / `600×300` 均未动 |
| 令牌基线复核 | — | 双向差集重跑：**声明 64 / 引用 63**，唯一差额 `--radius-full`（09-17 CTA 圆角改 8px 后失去引用，属历史遗留） |
| 验证 | 探针 `/tmp/probe/{ring,watermark}.mjs` | 光圈：未 hover 194.78 → 120ms 119.17（≈39%，可见起笔）→ 920ms 0（满环）→ 移出回 194.78 · 水印：`::before` 背景串已含 FREERTOS，2× 截图节奏正常 · `npm run build` + lint 通过 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| hover 反馈语言 | 画圆光圈（`stroke-dashoffset` 驱动）替代整圈变橙；缓动取 `--ease-standard`（`ease-out` 起笔太快，缺圆规感） | ✅ CLAUDE.md 交互设计 |
| 水印词表 | 采用用户给定 6 词；`FREEROTS` 按正字法写为 **`FREERTOS`**（与项目卡标签一致） | ✅ 本快照 |
| CTA 箭头方向 | **维持 ↗ + 左下 → 右上推入，不改成 ↘**（用户本轮提出后撤回） | ✅ 本快照，勿再提 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 探针读数恒不变 | ① 全局 smooth 滚动下 `scrollIntoView` 后立即取 rect 拿到旧坐标；② 读的元素不是被 hover 的那个 | ① `behavior:'instant'` + 等停稳再取几何；② 用同一选择器取「被 hover 元素」内部目标 | #tag: 视觉验证 |
| `captureScreenshot` 的 clip 截出空白 | clip 走**页面坐标**，未叠加 `scrollY` | clip 的 y 加 `window.scrollY` | #tag: 视觉验证 |
| 两步 mouseMoved 才触发 hover | headless 下单次瞬时移动不刷新 hover | 先落在附近再移到目标 + `pointerType:'mouse'` | #tag: 视觉验证 |
| 换快照时吞掉下一个快照的标题 | `replace_in_file` 的 old_str 只匹配了下一个快照的标题行，new_str 未把它带回 | 用「下一个标题行」当锚点时，new_str 末尾必须原样带回该行；改完用 `grep -n '^## '` 点验标题数（本轮已发生并修复 09-17 快照） | #tag: docs |

### 💡 关键发现

- #tag: css — 「沿边缘画圆」最稳的实现是 SVG `stroke-dashoffset` 过渡（全浏览器可动画）；`conic-gradient` + `@property` 需较新版本，跨浏览器风险更高
- #tag: design — 同一条 hover 反馈的观感由缓动决定：`ease-out` 前段过快，肉眼看不到「画」的过程

### 🚀 下会话指令

> 承接光圈与水印批：视觉部分待用户确认；CTA 方向已定不改成 ↘

1. 待确认：光圈观感（0.65s / 2px 线宽 / 顺时针；可调时长·线宽·逆时针）
2. 待拍板（承接上批）：视频体积策略（8 段 ~99MB）· 弹层终日子可读性 · I4 视频自动播放 · C3 档位数据 · v3-full 上线
3. 已否决（勿再提）：**CTA 箭头改 ↘（本轮）** · 封面 9:16 不裁切 · A4 简介区 12 栅格 · A3 统一白底衬 · 全站暗色 · char-matrix · B6/B7 · CTA 旧动效
4. 复现：`/tmp/probe/ring.mjs`（光圈三态）· `watermark.mjs`（水印放大截图）· `probe.mjs`（页高/封面/弹层）· node 需先 export PATH
5. 基线：页高 **15698 / 15968 / 15986**（本批未变）· 令牌 **64 声明 / 63 引用**

## 🏷️ 2026-09-21 · G1-D 演示视频挂载与弹层比例修复

**结论**：G1-D 的 5 段演示视频（4 段完整版源共 613MB + 10s 竖版抓放卡）按站点规范转码入库并挂到 003 / 004；003 定为「大卡 Tesseract 双臂到位运控 + 小卡 3 格」，004 改为视频占整卡位（弃占位图）；修掉弹层竖版视频溢出（960×1707 偏移）并确立「**封面统一 16:9 裁切 / 弹层按真实比例自适应不裁切**」口径；页高基线最终 **15698 / 15968 / 15986**。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `v3-full`：视频挂载 + 弹层比例修复 |
| commit | `feat`（视频挂载与弹层修复）+ `docs`（本快照与对账），见 git log |
| 遗留 | 体积突破「≤10MB」约定（单段最大 32.7MB / 共 ~99MB）待拍板 · 弹层 960px 下终日子可读性待拍板 · 003/004 实拍图仍缺 · 线上仍为 v2.4 |

### ✅ 完成（Δ 自 CTA/螺旋批次）

| 项 | 位置 | 说明 |
|----|------|------|
| 4 段完整版视频转码入库 | `assets/videos/` | 源 `/home/qskj-2/视频/最终演示视频/`（4K/1080p，共 613MB）→ 1080p30 H.264 CRF 26 + aac + faststart：32.7 / 17.2 / 16.2 / 14.9MB |
| 抓放卡片段入库 | 同上 | 源 10s 竖版 720×1280 HEVC 494KB → 1080×1920 H.264 CRF 26，1.8MB |
| 003 挂载结构 | `index.html` | 大卡 = Tesseract 双臂到位运控（占位图下架）；小卡 3 格 = 视觉识别抓放卡演示 / 视觉伺服动态抓卡 / 伺服鲁棒性测试 |
| 004 挂载结构 | `index.html` | 删占位图与独立视频段，视频直接占整卡位（新增 `.project-item__video`，与 `.project-item__image` 同尺寸 16:9） |
| 弹层比例修复 | `main.js` `desktop.css` | ① `.video-modal__content` 补定高（缺它时内层 video 的 `height:100%` 失效 → 按竖版内在比例溢出到 960×1707）；② `.video-modal__inner { min-height: 0 }` + `max-height: calc(100svh - 2*space-8)`；③ `fitModalTo()` 按 `loadedmetadata` 的真实比例算盒（上限 960 宽 / 视口高 −64），竖版实测 470×836 居中不溢出 |
| 验证 | 探针 `/tmp/probe/{probe,geom}.mjs` | 封面截帧 8/8（rs=4 / t=0.5s / paused）· 弹层竖版 470×836、横版 960×540 · 关闭后清空 · 首屏 mp4 请求 0（I12 未回归）· `npm run build` + lint 通过 |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| 转码规格 | 统一 1080p30 CRF 26 + faststart（沿用既有视频规格与 SOP 的 26–28 档） | ✅ CLAUDE.md 资源清单（体积待拍板） |
| 视频归属 | 脏数据段终端为 `[visual_servo_node]`（球壳限位 + 速度钳制）→ 归 003 视觉伺服层，非 004 RL 路线 | — 会话内有效 |
| 封面 vs 弹层口径 | **封面一律 16:9 居中裁切（竖版同样裁切，保网格统一）；弹层按真实比例自适应、完整不裁切** —— 中途试过的「封面 9:16 不裁切」被用户否决 | ✅ CLAUDE.md 交互设计 |
| 004 视频=大卡 | 弃「占位图 + 独立视频段」两层，视频直接占整卡位 | ✅ CLAUDE.md 交互设计（`--image` / `--video` 同尺寸） |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| 弹层竖版视频「画面严重偏移」 | `.video-modal__content` 无高度 → 内层 video `height:100%` 失效、退回内在比例（960×1707）溢出弹层与视口 | content 定高 + `min-height: 0` + `fitModalTo()` 自适应 | #tag: css |
| 竖版封面被裁切（用户先报） | `.video-cover video` 恒 `aspect-ratio: 16/9` + `object-fit: cover` | 口径定为**接受裁切**（网格统一优先），完整画面放弹层 | #tag: design |
| 新素材被直接当成「替换品」用错位置 | 语义相近（抓卡 demo vs 视觉伺服抓卡）→ 误判为替换关系 | **新素材默认「新增」，除用户明说替换**（本轮已回退并并列两格） | #tag: docs |
| 用户报「标签没改」实为页面缓存 | 源码与 dev server 已生效，浏览器用旧渲染 | 先 `curl` 服务端回包自证，再谈缓存（让对方 `Ctrl+Shift+R`） | #tag: 视觉验证 |

### 💡 关键发现

- #tag: 性能 — 4K 源转 1080p 用 `-vf scale=1920:1080:flags=lanczos,fps=30` 一次到位；20 核并行 4 段（270s 素材）约 1 分钟。文本 / 终端类素材 CRF 26 实测 1.6–2.6Mbps（体积随内容浮动，10MB 门槛对长片不现实）
- #tag: 视觉验证 — 弹层类改动要测「元素盒」而非只看外壳：本次外壳（inner）一直正常，真正溢出的是中间未定高的 `.video-modal__content`
- #tag: docs — 视觉改动按红线 #5 先出截图再收尾：本轮 4 次迭代（竖版封面 → 回退 → 大卡结构 → 标签）全部由用户看截图驱动，量化验证没发现问题

### 🚀 下会话指令

> 承接视频挂载：素材已全挂，待用户决定体积口径与终日子可读性

1. 待拍板：**视频体积策略**（8 段 ~99MB，单段最大 32.7MB；可选 CRF 28 → ~63MB / 裁 45–60s 精华版 / 维持现状）· **弹层终日子可读性**（终端层占画面 37%，需全屏播放）· I4 视频自动播放 · C3 档位数据 · v3-full 上线
2. 未做：003/004 实拍图（仍为第三方渲染图兜底；`g1d-arm-*.jpg` 已无引用，待定是否删）· 全向轮步兵演示视频（无素材）
3. 已否决（勿再提）：封面 9:16 不裁切 · A4 简介区 12 栅格 · A3 统一白底衬 · 全站暗色 · char-matrix · B6/B7 · CTA 旧动效
4. 复现：`/tmp/probe/probe.mjs`（页高 / 封面 / 弹层）· `geom.mjs`（卡片栅格几何）· node 需先 export PATH
5. 基线：页高 **15698 / 15968 / 15986** · 令牌 64/64 · 视频 8 段 ~99MB

## 🏷️ 2026-09-17 · CTA 画面切换动效与首页螺旋性能优化

**结论**：CTA 按钮按用户三轮反馈定稿为**画面切换式动效**（带箭头的新画面自按钮**左下角沿 ↗ 推入**、箭头随画面滑入、两态相对位置零跳变、退出沿 ↙ 退回）；首页螺旋动画完成 A 档性能优化（**加载期 12 → 32 FPS、稳态 17 → 42.5 FPS**）+ **跨设备字形修复**（`lengthAdjust` 改 `spacing`，fallback 字体不再压扁字形）；**I12 首屏视频流量归零**（封面截帧改 IO 门控）。页高基线 15315 不变。

| 维度 | 状态 |
|------|------|
| 主线 | ✅ `v3-full`：CTA 定稿 + 螺旋 A 档与跨设备修复 + I12 |
| commit | `feat`/`perf` + `docs` 多笔，见 git log |
| 遗留 | 螺旋 B/C 档（稳态 42.5 上限来自 16 圈旋转本身）· 字体自托管（I14 根治方向）· 移动端螺旋方案未定 · 线上仍为 v2.4 · C3 档位仍占位 |

### ✅ 完成（Δ 自 C3/CTA 批次）

| 项 | 位置 | 说明 |
|----|------|------|
| CTA 动效定稿 | `style.css` `mobile.css` | 录屏逐帧像素分析（13 帧追踪）→ 画面切换式：新画面（橙块+黑箭头）自左下沿 ↗ 推入（块 0.18s / 箭头 0.26s，超出画面被裁剪非淡入）；退出沿 ↙（箭头 0.16s 加速飞出、块 0.22s 延迟 0.05s）；两态箭头 bbox 逐像素一致（47×47 同中心）；圆角 9999→8px；文字 14px/600；箭头 22px/700 + 0.5px 描边 |
| 螺旋 A1 删滤镜 | `style.css` | `filter: drop-shadow(0 0 60px)` 删除 —— 停转后 A/B 像素 diff **0.000%**（视觉贡献为零）；稳态 17→44 FPS |
| 螺旋 A2 延迟启动 | `index.html` `style.css` | `html.spiral-on` 门控（load+600ms）；无 JS 时静态不转（零退化） |
| 螺旋 A3 不可见暂停 | `animations.js` `style.css` | 滚出视口 / 切后台 → `.is-paused` → `animation-play-state: paused` |
| 螺旋 A4 减动效 | `style.css` | `prefers-reduced-motion` 停转（原缺失） |
| 螺旋跨设备修复（P0） | `index.html` | `lengthAdjust` spacingAndGlyphs→spacing ×16：字形恒不变形，字体 fallback 时只差字距 —— 修「不同设备呈现变化 / 效果差」的最坏路径（A/B 截图：字形正常、圆周填充完好） |
| I12 首屏视频门控 | `main.js` `index.html` | 封面截帧改 IntersectionObserver（300px 预热，进视口才 `load()`）+ `preload` metadata→none；实测首屏零 mp4 请求（3 视频 IDLE）、滚到项目区正常截帧（`currentTime=0.5`、封面显示正常） |

### 🧭 决策

| 决策 | 结论 | 沉淀 |
|------|------|------|
| CTA 动效语言 | 弃「底块生长 + 箭头跳跃」→ **画面切换**：新画面连带箭头整体位移、箭头恒居中；推入方向 = 左下沿 ↗（用户口径：顺箭头指示方向更新） | ✅ CLAUDE.md |
| 螺旋滤镜 | 先停转 A/B 像素 diff 再决定删/替代 —— 实测 0.000% → 直接删（无需 radial 替代） | ✅ CLAUDE.md 红线 #6 |
| 螺旋首屏策略 | 延迟启动（load+600ms）换加载期 +167%；「稍后开转」作为既定取舍 | ✅ CLAUDE.md 红线 #6 |

### 🔴 坑（勿重踩）

| 现象 | 根因 | 解决 | tag |
|------|------|------|-----|
| A/B 截图 diff 10.57% 误读为「滤镜有视觉贡献」 | 两次独立加载的旋转**相位不同**，diff 混入内容位移噪声 | 对比动画元素必须先停转/同相位再截图（停转后 diff 0.000%） | #tag: 视觉验证 |
| `fps-profile.mjs` 输出 `undefined` | `Runtime.evaluate` 表达式带顶层 `return` 未包裹 | 与探针约定一致包 async IIFE | #tag: 视觉验证 |

### 💡 关键发现

- #tag: 性能 — `drop-shadow` 挂在动画根上：静止几乎零成本、叠加动画即每帧重算 60px 模糊（17 FPS）。正交 A/B（停转留滤镜 / 去滤镜留动画）可一次分离「滤镜」与「动画」两个因素
- #tag: 性能 — 16 圈 `textPath`（约 3 万字形 + `lengthAdjust=spacingAndGlyphs`）旋转本身把上限压在 ~44 FPS；彻底解决需 B/C 档（少转几圈 / 文字转路径 / 分层合成 / Canvas）
- #tag: 视觉验证 — 加载期残余长帧（max ~840ms）来自字体（1082KB/20 子集）与图片解码，与螺旋无关

### 🚀 下会话指令

> 承接 C3/CTA 批次：CTA 已定稿；螺旋 A 档落地，B/C 档待做

1. 螺旋后续：B/C 档（B1 只转内 6–8 圈 · B2 精简不可见文本 · C1 分层合成 · C3 Canvas）· **字体自托管 + 子集化**（I14 根治，螺旋约 30 字符、子集几 KB）· 移动端轻量版（当前 <1024 隐藏为既定行为，非 bug）
2. 待拍板：**C3 档位数据**（40 项占位）· ROS 卡 DDS 条目截断 · <768 kicker 遮挡 · A3 / A8 形态 · I4 视频自动播放 · v3-full 上线
3. 已否决（勿再提）：A3 统一白底衬 · A4 简介区 12 栅格 · 通栏黑带 · 全站暗色 · 竖版视频 · char-matrix · B6 / B7 · CTA 旧动效（生长 / 跳跃）
4. 基线：页高 **15315 / 15113 / 15181** · 令牌 64/64 · 螺旋性能：加载 32 / 稳态 42.5 FPS
5. 复现：`fps-profile.mjs <preset>`（baseline/no-filter/no-spin/hide-visual/no-both）· `check-spiral.js`（启动/暂停/减动效三态）· node 需先 export PATH
