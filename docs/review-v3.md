# v3-full 全站 Review — 未决事项与决策台账（2026-09-16 瘦身版）

> **定位**：只保留**未决事项 / 已否决方向 / 已确认结论 / 复现环境**。已完成项的细节（原 A/B/I/J/K 各节）已于 2026-09-16 随进度同步移除 —— 回溯用 `git log -- docs/review-v3.md`，落地 Δ 见 `PROGRESS.md` 快照。**历史快照中出现的「见 J 节 / K3 / K4 / K5」等指针指向已移除章节，同法回溯。**
> 原始覆盖：桌面 1440×900 逐屏 20 张 + 移动 390×844 + 断点 11 档（360–1440）+ 4 个参考站正文核验 + 全源码通读。
> 状态标记：🟡 部分已修 · 🚫 已否决（勿再提）· 未标记 = 未动手。**优先级权威源在 TODO.md，本文件提供根因与处置依据。**

## 一、待处理（按建议执行顺序）

### 1. A8（**需先定形态**）

- A8 移动端筛选器无滚动提示（<768px `overflow-x:auto` + nowrap）→ 右侧渐隐遮罩，露出下一项一角（强度待定）
- ✅ A9 页脚 ASCII 品牌字不可读 —— 2026-09-16 已修：6px 灰字符画改为**橙色投影像素字 SVG**（`ZHOU ZIWEI`，8×9 点阵路径 + 右下暗橙投影），移动端不再隐藏

### 2. A3 工具箱图标底衬（**需重新定方向**）

现状：仅 GitHub / ROS2 有白底块，其余 7 个裸 logo。**🚫「9 个统一白底衬」已实现后被用户看效果否决并退回（2026-09-16）**。可选新方向：只调那 2 枚白底块的尺寸/圆角；或给裸 logo 加**暗色**衬。

### 3. A7 / C2（与 TODO P3/P4「摘要 + 详情弹窗」同向，可合并推进）

- A7 项目区占全站 42.9%（约 6790px），纵向铺开滚动成本高 → 摘要栅格 + 点击展开详情
- C2 G1-D 项目时间轴（2026.03→2026.10），把 003/004 两条路线串成「实习 → 落地」主线（E 节实证：里程碑在宇树/智元/云深处均为独立模块）

### 4. C1 能力数字面板 metrics strip

4 项（2 款竞赛机器人 / 8 大技术域 / 90.9% 到位率 / 3 项国奖），置于简介之后、技术栈之前。**E 节实证：智元、云深处官网均无数字看板 → 无行业先例，属差异化尝试**。

### 5. C4 / C5（需确认信息架构）

- ✅ C3 技能掌握度条 —— 2026-09-16 已落地定稿：**F 方案（双行小卡片：名称 + 进度条 + 档位文字，两列网格）+ 暖米灰条色 `#C8C1B2`**，`data-lv` 驱动 5 熟练 / 3 熟悉 / 1 了解。迭代记录：橙条与 E 五格刻度均因「花哨」被否 → 柔化配色后 F 重新采纳。⚠️ 档位数据仍为占位待用户给定；ROS 卡 DDS 超长条目在 F 下截断（处置待拍板）
- C4 经历/荣誉合并为纵向时间线（导航 5 项降为 4 项，改 IA）

### 6. I 节遗留（交互 / 无障碍 / 性能）

| # | 事项 | 现状 / 处置 |
|---|------|------|
| I4 🟡 | 视频弹窗自动播放策略 | `playsinline` 已补；点封面后视频 `paused=true` 需再点一次 play（**浏览器自动播放策略，代码无错**）。二选一：加 `muted` 自动播（但演示视频多半要声音）/ 接受现状。**待拍板** |
| I11 | 移动端 Hero 底部约 198px 空白 | 根因：`.hero__status-bar` 已从 HTML 删除但 3 个文件仍留死样式，且 <1024 时底部无锚定元素。处置：删死样式 + 调低 `min-height`，或补一个底部元素 |
| I12 ✅ | 首屏即下载 ≈4.2MB 视频（**生产产物同样复现**，数据见下） | **2026-09-17 已修**：`initVideoCovers()` 改 IntersectionObserver 门控（rootMargin 300px 预热，进视口才 `load()` 截帧）+ video `preload` metadata→none。实测首屏零 mp4 请求（3 个视频 `netState=IDLE`/`buffered=0`），滚到项目区正常截帧（`currentTime=0.5`、封面画面正常） |
| I13 | 20/20 图片无 `width`/`height` | 实测 **CLS＝0**（图片均在定比容器内）→ 预防性，优先级低 |
| I14 🟡 | 等宽字体跨平台不一致 | Geist / Geist Mono 走 `cdn.jsdelivr.net`（本沙箱不可达），字体加载成败直接改变全站等宽字与**螺旋字形**（fallback 字体宽度不同 → 曾因 `spacingAndGlyphs` 被压缩成不同变形）。2026-09-17 已缓解最坏情形：螺旋 `lengthAdjust` 改 `spacing`（字形恒不变形、只差字距）。根治方向 = **字体自托管 + 子集化**（螺旋仅约 30 个唯一字符，woff2 子集可压到几 KB）；另 **Noto Sans SC 19 个 woff2 子集 = 1082KB** 为第二大可优化项 |
| I15 | 字体样式表渲染阻塞 | 生产 DCL 839ms / FCP 1004ms；已有 `preconnect` ✓，可自托管或 `media="print" onload` 异步化。优先级低于 I12 与 Noto 体积 |

**I12 生产复测数据（2026-09-16）**：3 条封面视频在用户交互前已缓冲 3.2–4.0s，按时长折算 ≈ **4.2MB**；生产首屏可测总字节 **2320.8KB**（jpeg 1118 / woff2 1082 / css 98.6 / js 2.9）· CLS 0。
**视频字节测量口径（勿踩）**：Resource Timing 对 mp4 记 `transferSize=300 / decodedBodySize=0`；CDP `encodedDataLength` 对被 abort 的 206 range 记 0 → **只能读 `video.duration` + `video.buffered` 时间区间按比例折算**。

### 7. 跨浏览器（唯一未完成的验证维度）

本环境 Firefox 为 snap 包（受沙箱限制、无法用自定义 profile），未强行启动 → **需在你自己机器上补 Safari / Firefox 两档**。重点看：等宽字体渲染（I14）· 断点档字号与留白连续性（A11/A12 已修，复核 clamp 流式与 `3rem` 收敛）· `svh` 单位降级（hero `min-height: 100svh / 90svh` 在旧 Safari 上不支持需确认降级）。

## 二、已否决（勿再提）

🚫 通栏黑带分隔条 · 全站统一暗色背景 · 竖版视频 16:9 裁切修复 · char-matrix 接入技术栈 · **B6 锚点落点描边**（2026-09-15 实现后否决）· **B7 Hero SCROLL 刻度**（同日实现后否决）· **A3「9 图标统一白底衬」**（2026-09-16 实现后否决）· **A4 简介区 12 栅格「文字 6 列 + 照片 5 列右偏」**（同日实现后经用户看效果否决并退回原版，勿再提该方向）· **C3 旧配色与旧形态**（橙条 —— 高饱和强调色铺 40 项 → 花哨、E 五格刻度尾标 —— 仍显乱、参考图蓝绿像素字配色 —— 2026-09-16 均经用户看效果否决；F 形态换**暖米灰**条色后已重新采纳，见第一节 C3）

## 三、已确认结论（勿重做 / 勿误判）

**已完成清单（细节见 PROGRESS 快照与 git 历史）**：A1 · A2 · A5（复核不成立）· **A6**（2026-09-16 项目卡并排 + 成果字号同级；A4 同日实现后被否决退回）· **A9**（页脚橙色投影像素品牌字）· A10 · **A11 / A12 / A15**（同日断点族）· A13 · A14 · A16 · **B1–B5 全部** · **C3**（技能掌握度 F 方案 + 暖米灰条色；档位占位待定）· I1–I3 · I5–I10 · J1–J8 · K1 / K4 / K5 全部落地。

- **全站文本达 AA**：217 条逐条扫描后仅 10 条不达标，集中在 3 个 token 复用点（I7 / I8 / I9），已全部修复（I7 方案：新增 `--color-accent-deep: #A05200`，4.90:1）
- **复核通过项（勿误修）**：锚点跳转落点 · DOM 语义基础（`lang` / 单一 h1 / alt 全齐 / 无失效锚点）· CLS 0 · 视频弹层开关与焦点管理 · 技术栈筛选逻辑 · 360px 微信行零溢出 · `prefers-reduced-motion` 全局覆盖 · **JS 不引用任何设计令牌**
- **断点三档（2026-09-16 落地，勿回退）**：`--gutter` 统一入口 —— <768 16px ｜ 769–1023 流式 `clamp(1rem, 25vw - 176px, 5rem)`（实测 16.25→49→79.75px）｜ ≥1024 80px；平板档 `.section`/`#techstack` 顶部 `clamp(6rem, 12.5vw, 8rem)`；hero 标题在 1023px 与 1024px 同为 48px（`<1024` 公式第三项 `3rem` 即此值）。断点边界统一 `1023.98px` / `769px`
- **J7 刻意保留的可复用原语**（0 命中但勿删）：`.sr-only` · `.container` · `.text-balance` · `.char-matrix*` · `.mono-label--accent` · `.stagger-1/3/4` · `.tok-*` 色板 · 关键帧 `cursorBlink`（已被 B3 消费）
- **令牌基线**：声明 / 引用 **62 / 61**（2026-09-21：B5 跟随高光移除，`--spot-x` / `--spot-y` 删除；差集余额仅 `--radius-full`，见 TODO P3）
- **页高基线（CDP 实测）**：1440×900＝**15315** · 390×844＝**15113** · 360×844＝**15181**（C3 F 方案 + 暖米灰条色 + 页脚像素品牌字 640px，2026-09-16；相对旧基线 15120 / 14407 / 14633 增 +195 / +706 / +548px，移动端增量来自 F 卡片在单列下的双行高度）。⚠️ hero 用 `svh`，**跨 `--h` 比较无意义**；只信同 run 内 base↔cur 差值
- **E 节参考站结论**：宇树/智元/云深处均以「Hero 强主张 + 里程碑独立模块」为惯例（支持 C2）；**数字看板无行业先例**（C1 属差异化）；纯双色大字排版牺牲可用性（Awwwards SOTD 可用性 6.99）→ 本项目保留橙色点缀与骨架导航更稳

## 四、复现环境（探针在 `/tmp/probe/`，会被系统清理，丢失按本节重建）

- **node 不在默认 PATH**：先 `export PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH"`（node v22.23.1 / npm 10.9.8）
- 起服务：`npm run dev`（5173 常被占用，会自动跳 5174，读日志里的实际端口）；**动手前先 `curl` 一次确认端口** —— 端口猜错时所有探针会静默测到别的服务
- 探针清单：`cdp.mjs`（截屏 / 定点 / eval / 键鼠 / 媒体仿真）· `bp2.js`（断点巡检：gutter / hero 字号行分布 / kicker 遮挡判定 / 即时锚点落点）· `interact.mjs`（交互 + Tab + 无障碍）· `contrast.js`（逐条对比度）· `perf.js` / `perf2.mjs`（体积 / LCP / CLS）· `b5-diff.py`（像素差分）
- 用法：`node cdp.mjs --url http://localhost:<port>/Zhouzzw_Web/ --w 1440 --h 900 --wait 2600 [--eval x.js] [--shot out.png] [--scroll N] [--mouse x,y]`；**端口必须每档唯一**；`--viewport 1` 只截当前视口（fixed 元素才会出现）
- **cdp.mjs 开关（2026-09-16）**：`--mouse x,y`（真实鼠标事件 —— CSS `:hover` 只认真实输入，合成 PointerEvent 不触发）· `--scrollInstant 1`（smooth 滚动落定耗时不定，跨 run 截图比对会被残余位移污染出假 diff）· `--rm 1`（仿真 prefers-reduced-motion，页面内 stub matchMedia 做不到）· `--touch 1`（仿真触屏 hover:none）· `--inject f.js`（页面脚本前注入）· `--keys Tab,Enter`
- ⚠️ **headless 默认 `(hover:none)(pointer:none)`**：`@media (hover:hover) and (pointer:fine)` 类规则全部静默不生效（B5 首测假阴性；2026-09-21 标签磁吸再次踩到）。启动参数强制声明桌面指针：`--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4`；`--touch 1` 则反向仿真触屏。**`Emulation.setEmulatedMedia` 不支持 `hover` / `pointer` 两个特性**（传了也不生效），别走这条路
- ⚠️ **几何量 / 截图时序坑**：① `fadeUp` 含 `translateY(20px)`，IO 刚触发时读 `getBoundingClientRect()` 量到的是动画中间态（曾把 76px 读成 92px）→ 读几何量前等入场动画结束（≥2.5s，对比度探针同理）；② `Page.captureScreenshot` 走 `captureBeyondViewport + clip` 时**只重绘指定区域、不合成 fixed 图层**（导航药丸 / 进度条不出现在图里）；要拍含导航的对照图，需把 `.nav` 临时改 `position:absolute` 再按页面坐标 clip；③ 纯视口截图（不带 clip）在 `setDeviceMetricsOverride` 下会被当成整面捕获（实测 1440×8000），**别指望它给视口尺寸**；④ 锚点跳转读落点：hash + smooth 在长距离（如 #contact）下 1.8s 读不全、读数失真，改用 `scrollIntoView({behavior:'instant'})`；⑤ 截图前若图片仍在加载，无 `width/height` 的图会让上方内容位移（I13），reading 有 ~28px 漂移
- ⚠️ **页高依赖视口高**：`.hero` 桌面 `100svh` / 移动 `90svh` → `--h 900` 与 `--h 844` 差 56px，跨 `--h` 比绝对值无意义
- ⚠️ 探针旧坑：`--virtual-time-budget` 会跳过平滑滚动与 rAF；hero 的 `100svh` 会被超大 `--window-size` 撑坏 → 用 `captureBeyondViewport` 分段截（每段 ≤8000px）；锚点跳转用 `Runtime.evaluate` 触发后再读 `scrollY`
- 参考站**无需重抓**；复抓方式：`web_fetch` + 指定 `fetchInfo`（比 anysearch extract 省 token）
