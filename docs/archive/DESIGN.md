# DESIGN.md — 周子惟 个人网页设计系统

基于现有实现（index.html + assets/css）逆向记录的视觉系统。风格参考 contentarchitecture.dev + 终端极客美学。

## 设计语言

嵌入式工程师美学：干净、精准、克制。深色水泥灰与米白的分屏对比 + 橙色极克制点缀 + 等宽字体贯穿，营造"硬件工程师工作台"的质感。

## Tokens

### 配色
| 令牌 | 值 | 用途 |
|------|-----|------|
| `--color-off-white` | `#F1EEE7` | 浅色背景（米白） |
| 水泥灰 | `#242423` | 深色区背景（Hero 右半/项目区） |
| `--color-black` | `#232323` | 深灰黑（深色 section） |
| `--color-black-deep` | `#000000` | 纯黑（导航/卡片叠加） |
| `--color-accent` | `#FF9100` | 橙色点缀（极克制） |
| `--color-ok` | `#3DBE4B` | 状态绿 |
| `--color-white` | `#FFFFFF` | 深色上文字 |
| `--color-ghost-grey` | `#DEDEDE` | 深色上次级文字 |
| `--color-dark-grey` | `#5B5A56` | 浅色上次级文字 |

### 字体
- 无衬线：`Geist` + `Noto Sans SC`
- 等宽：`Geist Mono`（kicker、标签、代码、编号）

### 排版
- `--text-headline-2`: `clamp(2.5rem, 7vw, 5rem)` — Hero 大标题
- `--text-headline-1`: `clamp(1.875rem, 5vw, 3.5rem)` — Section 标题
- `--text-body-large`: `clamp(1rem, 1.4vw, 1.25rem)` — 大正文
- 等宽标签：`--text-mono` 系列

### 其他
- 间距：4px 网格（`--space-1..40`）
- 圆角：2 / 4 / 8 / 9999（导航栏用 10px 终端圆角）
- 过渡：`cubic-bezier(0.23,1,0.32,1)`（out）/ `(0.4,0,0.2,1)`（standard）
- 纹理：点阵（`repeating-conic-gradient`）、SVG 噪点、背景水印

## 核心组件

1. **导航栏** — 悬浮胶囊（纯黑 + 点阵 + 10px 圆角），scrollspy 滑动指示器高亮
2. **Hero** — 左右分屏（米白/水泥灰）+ 16 圈螺旋文字（每圈不同文案 + 横线占位）+ CTA 双药丸
3. **Section 标题** — 等宽 kicker + 大标题（不对称排版，12 列栅格）
4. **项目卡片** — 水泥灰底上大标题 + 标签 + 视频网格 + IDE 代码窗口
5. **技术栈** — 等宽筛选器 + 波浪错落分类卡
6. **关于** — 时间线列表（大号日期 + 标题）+ 联系方式大条目
7. **页脚** — ASCII 艺术字 + 双列 grid + 底部信息栏

## 模式

- 深色 section 用 `text-watermark` 背景水印（旋转的 SVG 关键词文字）
- 编号系统（001/002…）贯穿技能、项目、技术栈，形成工程师式秩序
- CTA 用双药丸（文字 + 橙色箭头）
- 滚动交互：scrollspy 高亮 + 锚点平滑跳转（简单滚动，无入场动画）
