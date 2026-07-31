# DESIGN SPEC — v2.1 视觉增强设计规格

> 版本：v2.1（视觉增强迭代）
> 定位：在 v2 米白/纯黑/橙编辑设计语言基础上，融入终端极客美学（环形文字、芯片隐喻、ASCII 艺术、代码窗口）。
> **约束：不改变信息架构、不增删内容、不引入新依赖**，纯 HTML + CSS + 少量 JS 增量实现。
> 本规格所有数值可直接照抄，供无视觉参考的文本模型按参数精确实现。

---

## 1. 设计令牌（Design Tokens）

### 1.1 色彩

| 令牌 | 值 | 用途 |
|------|-----|------|
| `--color-off-white` | `#F1EEE7` | 浅色页面背景（米白） |
| `--color-black` | `#232323` | 深色 section 背景（深灰黑） |
| `--color-black-deep` | `#000000` | 纯黑（导航/CTA/卡片/页脚） |
| `--color-white` | `#FFFFFF` | 深色上的主文字 |
| `--color-text` | `#1A1A1A` | 浅色上的主文字 |
| `--color-dark-grey` | `#5B5A56` | 浅色上的次级文字 |
| `--color-ghost-grey` | `#DEDEDE` | 深色上的次级文字 |
| `--color-accent` | `#FF9100` | 橙色点缀（唯一的强调色） |
| `--color-ok` | `#3DBE4B` | 状态脉冲点绿色（新增） |
| `--color-border` | `rgba(0,0,0,0.08)` | 浅底边框 |
| `--color-border-dark` | `rgba(255,255,255,0.12)` | 深底边框 |
| 语法关键字 | `#FF9100` | IDE 代码窗口关键字 |
| 语法注释 | `#6A9955` | IDE 代码窗口注释 |
| 语法字符串 | `#CE9178` | IDE 代码窗口字符串 |
| 语法函数 | `#DCDCAA` | IDE 代码窗口函数名 |
| 语法默认 | `#D4D4D4` | IDE 代码窗口正文 |

### 1.2 字体

| 令牌 | 值 |
|------|-----|
| `--font-sans` | `'Geist','Noto Sans SC',system-ui,sans-serif` |
| `--font-mono` | `'Geist Mono','JetBrains Mono','Fira Code',monospace` |

### 1.3 间距 / 圆角 / 阴影（沿用现有令牌）

- 间距网格 4px 基数：`--space-1..40`（4px×n）
- 圆角：`--radius-2:2px` / `--radius-4:4px` / `--radius-8:8px` / `--radius-full:9999px`
- 阴影：`--shadow-card` / `--shadow-raised` / `--shadow-dark`（沿用）

### 1.4 过渡与动画（沿用现有令牌）

| 令牌 | 值 |
|------|-----|
| `--ease-out` | `cubic-bezier(0.23,1,0.32,1)` |
| `--ease-standard` | `cubic-bezier(0.4,0,0.2,1)` |
| `--duration-fast` | `150ms` |
| `--duration-base` | `280ms` |
| `--duration-slow` | `500ms` |

---

## 2. 导航栏规格（所有 4 页统一改）

### 2.1 结构

```html
<header class="nav" id="navbar">
  <a href="index.html" class="nav__brand-link" aria-label="首页">
    <svg class="nav__brand" viewBox="0 0 24 24" fill="none" width="20" height="20">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="#FF9100" stroke-width="1.5"/>
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="#FF9100" stroke-width="1.5"/>
      <rect x="9.5" y="9.5" width="5" height="5" fill="#FF9100"/>
    </svg>
  </a>
  <span class="nav__logo">Zhou Ziwei</span>
  <nav>
    <ul class="nav__links">
      <li><a href="index.html" class="nav--active">首页</a></li>
      <li><a href="projects.html">项目</a></li>
      <li><a href="techstack.html">技术栈</a></li>
      <li><a href="about.html">关于</a></li>
    </ul>
  </nav>
  <button class="nav__toggle" aria-label="菜单"><span></span><span></span><span></span></button>
</header>
```

> 说明：品牌图标包在一个 `<a>` 里，指向首页，位于 logo 文字左侧。原 `.nav__logo` 从 `<a>` 改为 `<span>`（保留文字样式，不再重复链接）。

### 2.2 参数（覆盖 desktop.css 原 `.nav` 规则）

| 属性 | 桌面 ≥1024px | 移动 <768px |
|------|-------------|-------------|
| 定位 | `fixed; top:32px; left:50%; translateX(-50%)` | `fixed; top:16px; left:50%; translateX(-50%)` |
| 总高度 | `52px` | `44px` |
| 内边距 | `8px 20px 8px 12px` | `6px 14px 6px 10px` |
| 背景 | `#000000` + 点阵纹理（4px 网点） | 同左 |
| 边框 | `1px solid rgba(255,255,255,0.12)` | 同左 |
| 圆角 | `9999px`（完美药丸） | `9999px` |
| 阴影 | `0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)` | 同左 |
| 间距 | 品牌图标与 logo `12px`；logo 与链接 `24px` | 同左 8px / 16px |
| 滚动态 `.nav--scrolled` | `scale(0.96); opacity:0.92` | 同左 |

### 2.3 品牌图标 `.nav__brand`

- 尺寸：`20 × 20px`（SVG viewBox `0 0 24 24`）
- 样式：`display:block`，圆形边框 stroke `#FF9100`，中心小方块 fill `#FF9100`
- 移动端保持 `20px` 不缩

### 2.4 logo `.nav__logo`

- `font-family: var(--font-mono)`；`font-size: 13px`；`font-weight: 500`
- `color:#FFFFFF`；`letter-spacing:0.01em`；`text-transform:uppercase`；`white-space:nowrap`
- 移动端：`font-size:11px`

### 2.5 链接 `.nav__links a`

| 状态 | 样式 |
|------|------|
| default | `font-family:var(--font-mono); font-size:11px; color:rgba(255,255,255,0.55); text-transform:uppercase; letter-spacing:0.02em; padding:8px 12px; border-radius:9999px; white-space:nowrap` |
| hover | `color:#FFFFFF; background:rgba(255,255,255,0.08)` |
| active `.nav--active` | `color:#FFFFFF; background:rgba(255,255,255,0.14)`（内嵌小药丸） |
| 过渡 | `color var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)` |
| 移动端 | `font-size:10px; padding:6px 8px` |

### 2.6 移动端汉堡 `.nav__toggle`

保持现有（桌面 `display:none`，移动显示 3 条线）。移动端菜单展开逻辑沿用 v2 现状；若 v2 无展开逻辑，则小屏仍显示内联链接（≤480px 隐藏"首页"项，逻辑沿用现有 mobile.css）。

---

## 3. 首页 Hero 规格

### 3.1 布局（desktop.css 覆盖 `.hero`）

- `min-height:100svh`；`grid-template-columns:repeat(12,1fr)`（≥1024px）
- 文字区 `.hero__content`：`grid-column:1 / span 7`
- **新增** 视觉区 `.hero__visual`：`grid-column:8 / span 5`；`display:flex; align-items:center; justify-content:center`
- **新增** 状态栏 `.hero__status-bar`：`grid-column:1 / span 7`；`align-self:end`；`margin-bottom:48px`
- 滚动指示器 `.hero__scroll-indicator`：保持现有（absolute 右下）

### 3.2 环形文字装饰 `.hero__visual`

#### HTML 结构

```html
<div class="hero__visual" aria-hidden="true">
  <svg class="radial-text__svg" viewBox="0 0 420 420" fill="none">
    <defs>
      <path id="ring-outer" d="M 210 210 m -190 0 a 190 190 0 1 1 380 0 a 190 190 0 1 1 -380 0"/>
      <path id="ring-mid"   d="M 210 210 m -150 0 a 150 150 0 1 1 300 0 a 150 150 0 1 1 -300 0"/>
      <path id="ring-inner" d="M 210 210 m -105 0 a 105 105 0 1 1 210 0 a 105 105 0 1 1 -210 0"/>
    </defs>

    <g class="radial-text__ring radial-text__ring--outer">
      <text font-family="Geist Mono, monospace" font-size="10" letter-spacing="3" fill="rgba(0,0,0,0.32)">
        <textPath href="#ring-outer" textLength="1194" lengthAdjust="spacingAndGlyphs">
          ZHOU ZIWEI · STM32 · LQR · VMC · CAN · FREERTOS · MATLAB · ROBOMASTER ·
          ZHOU ZIWEI · STM32 · LQR · VMC · CAN · FREERTOS · MATLAB · ROBOMASTER ·
          ZHOU ZIWEI · STM32 · LQR · VMC · CAN · FREERTOS · MATLAB · ROBOMASTER ·
        </textPath>
      </text>
    </g>

    <g class="radial-text__ring radial-text__ring--mid">
      <text font-family="Geist Mono, monospace" font-size="11" letter-spacing="2" fill="rgba(0,0,0,0.5)">
        <textPath href="#ring-mid" textLength="942" lengthAdjust="spacingAndGlyphs">
          EMBEDDED · ROBOTICS · CONTROL · EMBEDDED · ROBOTICS · CONTROL ·
          EMBEDDED · ROBOTICS · CONTROL · EMBEDDED · ROBOTICS · CONTROL ·
        </textPath>
      </text>
    </g>

    <g class="radial-text__ring radial-text__ring--inner">
      <text font-family="Geist Mono, monospace" font-size="12" letter-spacing="1.5" fill="rgba(0,0,0,0.6)">
        <textPath href="#ring-inner" textLength="660" lengthAdjust="spacingAndGlyphs">
          EST. 2024 · WUST · ROBOMASTER · EST. 2024 · WUST · ROBOMASTER · EST. 2024 · WUST · ROBOMASTER ·
        </textPath>
      </text>
    </g>

    <!-- 中心芯片 monogram -->
    <circle cx="210" cy="210" r="40" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text x="210" y="219" text-anchor="middle" font-family="Geist Mono, monospace" font-size="22" letter-spacing="2" fill="#FF9100">ZW</text>
  </svg>
</div>
```

#### 参数速查

| 元素 | 参数 |
|------|------|
| SVG viewBox | `0 0 420 420`，圆心 `(210,210)` |
| 外环 | 半径 `190`，周长 `1194`，`font-size:10`，`letter-spacing:3`，fill `rgba(0,0,0,0.32)` |
| 中环 | 半径 `150`，周长 `942`，`font-size:11`，`letter-spacing:2`，fill `rgba(0,0,0,0.5)` |
| 内环 | 半径 `105`，周长 `660`，`font-size:12`，`letter-spacing:1.5`，fill `rgba(0,0,0,0.6)` |
| 中心 | 虚线圆 `r=40`（`stroke-dasharray:3 3`）+ `ZW` 文字 `font-size:22` 橙色 |
| 关键点 | 每个 `<textPath>` 必须设 `textLength` 等于对应圆周长、`lengthAdjust="spacingAndGlyphs"`，文字自动拉伸填满圆周 |

#### CSS

```css
.hero__visual {
  grid-column: 8 / span 5;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  max-width: 440px;
  margin: 0 auto;
}

.radial-text__svg { width: 100%; height: 100%; }

.radial-text__ring { transform-origin: 50% 50%; transform-box: fill-box; }
.radial-text__ring--outer { animation: radialSpin 40s linear infinite; }
.radial-text__ring--mid   { animation: radialSpin 55s linear infinite reverse; }
.radial-text__ring--inner { animation: radialSpin 70s linear infinite; }

@keyframes radialSpin { to { transform: rotate(360deg); } }
```

- **移动端 <768px**：`.hero__visual { display:none }`
- **平板 768–1024px**：`.hero__visual { display:none }`（简化为单栏，避免拥挤）

### 3.3 状态栏 `.hero__status-bar`

#### HTML

```html
<div class="hero__status-bar" aria-label="技术栈状态">
  <div class="status-bar__item">
    <span class="status-bar__dot"></span>
    <span class="status-bar__label">MCU :</span>
    <span class="status-bar__value">STM32F4 / G4</span>
  </div>
  <div class="status-bar__item">
    <span class="status-bar__label">RTOS :</span>
    <span class="status-bar__value">FREERTOS</span>
  </div>
  <div class="status-bar__item">
    <span class="status-bar__label">CONTROL :</span>
    <span class="status-bar__value">LQR / VMC / PID</span>
  </div>
</div>
```

#### 参数

| 属性 | 值 |
|------|-----|
| 容器 | `display:inline-flex; align-items:center; gap:0`；`background:#000000` + 点阵纹理；`border:1px solid rgba(255,255,255,0.12)`；`border-radius:9999px`；`padding:10px 24px`；`box-shadow:var(--shadow-dark)` |
| item | `display:flex; align-items:center; gap:8px; padding:0 20px`；`font-family:var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:0.02em` |
| 分隔线 | `.status-bar__item + .status-bar__item { border-left:1px solid rgba(255,255,255,0.15) }` |
| label | `color:rgba(255,255,255,0.55)` |
| value | `color:#DEDEDE` |
| 脉冲点 `.status-bar__dot` | `width:8px; height:8px; border-radius:50%; background:#3DBE4B` + `position:relative` |
| 脉冲动画 | `@keyframes statusPing { 0%{opacity:0.6;transform:scale(1)} 100%{opacity:0;transform:scale(2.4)} }`；`animation:statusPing 2s ease-out infinite`；需用 `::after` 伪元素做扩散层：`.status-bar__dot::after{content:'';position:absolute;inset:0;border-radius:50%;background:#3DBE4B;animation:statusPing 2s ease-out infinite}` |
| 移动端 <768px | `flex-wrap:wrap; padding:12px 16px; border-radius:12px; gap:8px`；item `padding:6px 0; width:100%`（纵向堆叠，分隔线改为 `border-top`） |

---

## 4. 深色 section 背景水印 `.text-watermark`

### 4.1 用法

在需要水印的深色 section 上追加类：`<section class="section section--dark text-watermark">`。

### 4.2 CSS（style.css 新增）

```css
.text-watermark {
  position: relative;
  overflow: hidden;
}

.text-watermark::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300'%3E%3Cg transform='rotate(-15 300 150)' fill='white' fill-opacity='0.045' font-family='monospace' font-size='16'%3E%3Ctext x='0' y='48'%3EEMBEDDED · ROBOTICS · CONTROL · ZHOU ZIWEI ·%3C/text%3E%3Ctext x='0' y='96'%3EEMBEDDED · ROBOTICS · CONTROL · ZHOU ZIWEI ·%3C/text%3E%3Ctext x='0' y='144'%3EEMBEDDED · ROBOTICS · CONTROL · ZHOU ZIWEI ·%3C/text%3E%3Ctext x='0' y='192'%3EEMBEDDED · ROBOTICS · CONTROL · ZHOU ZIWEI ·%3C/text%3E%3Ctext x='0' y='240'%3EEMBEDDED · ROBOTICS · CONTROL · ZHOU ZIWEI ·%3C/text%3E%3C/g%3E%3C/svg%3E");
  background-size: 600px 300px;
  background-repeat: repeat;
  pointer-events: none;
  z-index: 0;
}

.text-watermark > * {
  position: relative;
  z-index: 1;
}
```

### 4.3 参数速查

| 属性 | 值 |
|------|-----|
| SVG 尺寸 | `600 × 300`（平铺） |
| 文字 | `EMBEDDED · ROBOTICS · CONTROL · ZHOU ZIWEI ·`（每行重复，5 行，行距 `48px`） |
| 字体 | `monospace; font-size:16` |
| 颜色 | `fill='white' fill-opacity='0.045'` |
| 旋转 | 整个 `<g>` `rotate(-15 300 150)` |
| 层级 | 伪元素 `z-index:0`，内容强制 `z-index:1` |

### 4.4 应用范围

| 页面 | section |
|------|---------|
| index.html | `#skills-preview`（核心能力深色区） |
| projects.html | 项目列表深色区 |
| techstack.html | 技术栈深色区 |
| about.html | 教育背景 + 联系方式两个深色区 |

---

## 5. 双药丸 CTA 按钮 `.cta-split`

### 5.1 HTML

```html
<a href="projects.html" class="hero__cta cta-split">
  <span class="cta-split__left">查看项目</span>
  <span class="cta-split__right" aria-hidden="true">→</span>
</a>
```

> 现有 `.hero__cta` 的定位/动画（fadeUp 0.5s 延迟）保留，仅内部结构换成左右两半。

### 5.2 参数

| 属性 | 值 |
|------|-----|
| 整体 | `display:inline-flex; align-items:stretch; height:48px; background:#000000` + 点阵纹理；`border:1px solid rgba(255,255,255,0.12)`；`border-radius:9999px`；`overflow:hidden`；`box-shadow:var(--shadow-card)` |
| 左半 `.cta-split__left` | `display:flex; align-items:center; padding:0 28px; font-family:var(--font-mono); font-size:12px; letter-spacing:0.02em; text-transform:uppercase; color:#FFFFFF` |
| 右半 `.cta-split__right` | `display:flex; align-items:center; justify-content:center; width:48px; font-size:18px; color:#FF9100` |
| 分隔缝 | `.cta-split__right { border-left:1px solid rgba(255,255,255,0.15) }` |
| hover | `.cta-split:hover { transform:translateY(-2px); box-shadow:var(--shadow-raised) }` |
| hover 细节 | `.cta-split:hover .cta-split__right { background:rgba(255,255,255,0.06) }` |

---

## 6. 芯片引脚风格卡片 `.chip-card`

### 6.1 HTML 用法（projects.html）

每个 `.project-item` 外层包一层 `.chip-card`：

```html
<div class="chip-card">
  <article class="project-item animate-on-scroll">
    <!-- 现有项目内容不变 -->
  </article>
</div>
```

### 6.2 参数

| 属性 | 值 |
|------|-----|
| 容器 | `position:relative; background:#000000; border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:40px 48px` |
| 凹口数量 | 左右各 3 个（上 15% / 中 50% / 下 85% 高度处） |
| 凹口半径 | `11px` |
| 凹口颜色 | 露出的背景色 `#232323`（`.section--dark` 背景） |
| 间距 | 相邻 `.chip-card` 之间 `margin-bottom:80px` |

### 6.3 凹口实现（左右各一个伪元素）

```css
.chip-card::before,
.chip-card::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 22px;                 /* 覆盖半径 + 2px */
  background-color: transparent;
}

.chip-card::before { left: -1px; }
.chip-card::after  { right: -1px; }

/* 3 个半圆凹口，圆心在 -5px（卡片外），露出页面背景色 #232323 */
.chip-card::before,
.chip-card::after {
  background-image:
    radial-gradient(circle at -5px 15%, #232323 0 11px, transparent 11.5px),
    radial-gradient(circle at -5px 50%, #232323 0 11px, transparent 11.5px),
    radial-gradient(circle at -5px 85%, #232323 0 11px, transparent 11.5px);
  background-repeat: no-repeat;
}
```

> 关键：伪元素底色透明，仅 3 个半圆用 `#232323` 填充（= section 背景色），在卡片边缘形成"挖槽"视觉。若 section 背景不同，替换 `#232323` 为对应背景色。

### 6.4 响应式

- **<768px**：`padding:32px 20px`；凹口保留（左右各 2 个，删中间那个）或整体隐藏：`.chip-card::before,.chip-card::after{display:none}`（推荐保留 2 个凹口，视觉更完整）

---

## 7. 代码编辑器窗口 `.ide-window`

### 7.1 HTML（projects.html，串联腿项目"成果"区块之后插入）

```html
<div class="project-item__section">
  <p class="mono-label mono-label--dark" style="margin-bottom: var(--space-4);">控制代码</p>
  <div class="ide-window animate-on-scroll">
    <div class="ide-window__tabs">
      <span class="ide-window__tab is-active">main.c</span>
      <span class="ide-window__tab">lqr_control.c</span>
      <span class="ide-window__tab">pid.h</span>
    </div>
    <div class="ide-window__body">
      <div class="ide-window__sidebar">
        <span class="ide-window__dir">Src/</span>
        <span class="ide-window__file is-current">main.c</span>
        <span class="ide-window__file">lqr_control.c</span>
        <span class="ide-window__file">can_bus.c</span>
        <span class="ide-window__dir">Drivers/</span>
        <span class="ide-window__file">stm32g4xx_hal.c</span>
        <span class="ide-window__dir">Inc/</span>
        <span class="ide-window__file">pid.h</span>
        <span class="ide-window__file">imu_filter.h</span>
      </div>
      <pre class="ide-window__code"><code><span class="tok-c">/* LQR 平衡控制器 · 每 1ms 中断调用 */</span>
<span class="tok-k">void</span> <span class="tok-f">lqr_balance_loop</span>(<span class="tok-k">void</span>)
{
    <span class="tok-f">update_sensors</span>();              <span class="tok-c">// IMU + 编码器</span>
    x_k[<span class="tok-n">0</span>] = gimbal_pitch;              <span class="tok-c">// 俯仰角</span>
    x_k[<span class="tok-n">1</span>] = pitch_rate;               <span class="tok-c">// 俯仰角速度</span>
    x_k[<span class="tok-n">2</span>] = wheel_vel;                <span class="tok-c">// 轮速</span>

    u_k = <span class="tok-f">K_lqr</span> · x_k;                 <span class="tok-c">// LQR 最优控制律</span>
    <span class="tok-f">set_motor_duty</span>(&amp;motor[<span class="tok-n">0</span>], u_k);
    <span class="tok-f">set_motor_duty</span>(&amp;motor[<span class="tok-n">1</span>], -u_k);
}</code></pre>
    </div>
    <div class="ide-window__footer">
      <span>UTF-8 · C99</span>
      <span>Ln 12, Col 4</span>
      <span>SPACES: 4</span>
    </div>
  </div>
</div>
```

### 7.2 参数

| 区域 | 值 |
|------|-----|
| 整体 | `border:1px solid rgba(255,255,255,0.12)`；`border-radius:8px`；`overflow:hidden`；`background:#0A0A0A`；`box-shadow:var(--shadow-dark)`；`max-width:720px` |
| 点阵边框 | 用 `.ide-window { position:relative }` + `::after` 全屏 `var(--dotted-bg)`（`background-size:4px 4px`，`opacity:0.5`，`pointer-events:none`）盖在窗口上模拟网格质感 |
| 标签栏 `.ide-window__tabs` | `height:40px; display:flex; align-items:flex-end; gap:0; padding:0 8px; background:#0D0D0D; border-bottom:1px solid rgba(255,255,255,0.1)` |
| Tab `.ide-window__tab` | `padding:10px 16px; font-family:var(--font-mono); font-size:11px; color:rgba(255,255,255,0.5); border-top:2px solid transparent` |
| Tab active | `color:#FFFFFF; background:#0A0A0A; border-top-color:#FF9100` |
| 主体 `.ide-window__body` | `display:flex; min-height:220px` |
| 侧栏 `.ide-window__sidebar` | `width:160px; padding:12px 0; background:#0D0D0D; border-right:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column` |
| 目录 `.ide-window__dir` | `padding:4px 16px; font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.35); text-transform:uppercase` |
| 文件 `.ide-window__file` | `padding:4px 16px; font-family:var(--font-mono); font-size:11px; color:rgba(255,255,255,0.55)` |
| 当前文件 `.is-current` | `color:#FFFFFF; background:rgba(255,255,255,0.08); border-left:2px solid #FF9100` |
| 代码区 `.ide-window__code` | `flex:1; margin:0; padding:16px 20px; font-family:var(--font-mono); font-size:12px; line-height:1.7; color:#D4D4D4; overflow:auto` |
| 语法色 | `.tok-k`（关键字）`#FF9100`；`.tok-c`（注释）`#6A9955`；`.tok-s`（字符串）`#CE9178`；`.tok-f`（函数）`#DCDCAA`；`.tok-n`（数字）`#B5CEA8` |
| 底部状态栏 `.ide-window__footer` | `height:28px; display:flex; align-items:center; justify-content:flex-end; gap:24px; padding:0 16px; background:#0D0D0D; border-top:1px solid rgba(255,255,255,0.1); font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.4)` |
| 响应式 <768px | 侧栏 `.ide-window__sidebar{display:none}`；标签栏横向滚动 |

---

## 8. 页脚升级 `.footer`

### 8.1 HTML 结构（所有 4 页统一替换）

```html
<footer class="footer">
  <!-- 顶部 ASCII 艺术 -->
  <pre class="footer__ascii" aria-hidden="true">██╗  ██╗███████╗ ██████╗ ██╗   ██╗
██║  ██║╚══███╔╝██╔═══██╗██║   ██║
███████║  ███╔╝ ██║   ██║██║   ██║
██╔══██║ ███╔╝  ██║   ██║██║   ██║
██║  ██║███████║╚██████╔╝╚██████╔╝
╚═╝  ╚═╝╚══════╝ ╚═════╝  ╚═════╝
██╗    ██╗██╗███████╗███████╗
██║    ██║██║██╔════╝██╔════╝
██║ █╗ ██║██║█████╗  █████╗
██║███╗██║██║██╔══╝  ██╔══╝
╚███╔███╔╝██║██║     ██║
 ╚══╝╚══╝ ╚═╝╚═╝     ╚═╝</pre>

  <div class="footer__grid">
    <!-- 左：联系入口 -->
    <div class="footer__cta">
      <p class="footer__cta-title">有想法一起做机器人？</p>
      <a href="about.html" class="cta-split">
        <span class="cta-split__left">联系我</span>
        <span class="cta-split__right" aria-hidden="true">→</span>
      </a>
    </div>

    <!-- 右：两列链接，右对齐 -->
    <nav class="footer__nav">
      <ul class="footer__col">
        <li><a href="index.html">首页</a></li>
        <li><a href="projects.html">项目</a></li>
        <li><a href="techstack.html">技术栈</a></li>
        <li><a href="about.html">关于</a></li>
      </ul>
      <ul class="footer__col">
        <li><a href="https://github.com/Zhouzzw" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="mailto:2661762781@qq.com">Email</a></li>
      </ul>
    </nav>
  </div>

  <!-- 底部信息 -->
  <div class="footer__bottom">
    <span>&copy; 2026 周子惟. All rights reserved.</span>
    <span>BUILT WITH VITE · EMBEDDED · ROBOTICS · CONTROL</span>
  </div>
</footer>
```

### 8.2 参数

| 元素 | 值 |
|------|-----|
| `.footer` | `background:#000000`；`padding:96px var(--gutter-desktop) 48px`（移动端 `64px 20px 32px`）；`display:flex; flex-direction:column; gap:48px` |
| `.footer__ascii` | `margin:0; font-family:var(--font-mono); font-size:6px; line-height:1.0; color:rgba(255,255,255,0.12); user-select:none` |
| `.footer__grid` | `display:grid; grid-template-columns:1fr 1fr; gap:48px`（移动端单列） |
| `.footer__cta-title` | `font-size:20px; font-weight:500; color:#FFFFFF; margin-bottom:16px` |
| `.footer__nav` | `display:flex; justify-content:flex-end; gap:64px`（移动端 `justify-content:flex-start`，列宽等分） |
| `.footer__col` | `list-style:none; display:flex; flex-direction:column; gap:12px; margin:0; padding:0` |
| `.footer__col a` | `font-family:var(--font-mono); font-size:12px; color:#DEDEDE; text-align:right; transition:color var(--duration-fast)`；hover `color:#FFFFFF` |
| `.footer__bottom` | `display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.1)` |
| `.footer__bottom span` | `font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:0.02em` |
| 响应式 <768px | `.footer__ascii{font-size:3px; overflow:hidden}`（或 `display:none`）；`.footer__grid{grid-template-columns:1fr}`；`.footer__nav{justify-content:flex-start}`；链接 `text-align:left` |

---

## 9. 动画规格汇总

| 动画 | 应用 | 关键帧 |
|------|------|--------|
| `radialSpin` | 环形文字外/中/内圈 | `to { transform: rotate(360deg) }`；外 40s、中 55s reverse、内 70s，均 `linear infinite` |
| `statusPing` | 状态栏脉冲点 `::after` | `0%{opacity:0.6;transform:scale(1)} 100%{opacity:0;transform:scale(2.4)}`；`2s ease-out infinite` |
| `fadeUp`（沿用） | Hero 各元素入场 | 现有 `style.css` 已定义 |
| `.animate-on-scroll`（沿用） | 新组件入场 | 现有 `desktop.css` 已定义；新组件加类即可 |
| 导航滚动缩放（沿用） | `#navbar` | 现有 `main.js` + `.nav--scrolled` |

> `@keyframes radialSpin` 和 `statusPing` 若 `style.css` 中已有同名关键帧，直接复用；`statusPing` 现有定义可覆盖升级。

---

## 10. 响应式规格

| 断点 | 规则 |
|------|------|
| **<768px** | 环形文字 `.hero__visual{display:none}`；状态栏纵向堆叠（分隔线改 border-top）；导航高度 44px；芯片卡片 `padding:32px 20px` 凹口减为 2 个或隐藏；IDE 侧栏隐藏；页脚 ASCII 缩至 3px 或隐藏；页脚 grid 单列；CTA 双药丸保持 |
| **768–1024px** | 环形文字隐藏；状态栏保持横向可换行 |
| **≥1024px** | 完整桌面布局，见各组件规格 |

---

## 11. 各页面改动清单

| 文件 | 改动 |
|------|------|
| `assets/css/style.css` | 新增变量 `--color-ok`、语法色；新增 `.text-watermark`、`.cta-split`、`.chip-card`、`.ide-window`、`.radial-text`、`.status-bar`、`.footer__*` 相关的基础/关键帧（或全部集中到 desktop.css） |
| `assets/css/desktop.css` | 导航药丸化重写；Hero 双栏 + 环形文字 + 状态栏；深色 section 加水印类样式；CTA 双药丸；芯片卡片凹口；IDE 窗口；页脚升级 |
| `assets/css/mobile.css` | 上述新组件的移动端适配规则 |
| `index.html` | 导航（品牌图标）；Hero 新增 `.hero__visual` 环形 SVG + `.hero__status-bar`；CTA 改双药丸；`#skills-preview` 加 `text-watermark`；页脚替换 |
| `projects.html` | 导航；`text-watermark`；项目卡片包 `.chip-card`；串联腿项目加 `.ide-window`；页脚替换 |
| `techstack.html` | 导航；`text-watermark`；页脚替换 |
| `about.html` | 导航；两个深色区 `text-watermark`；页脚替换 |

---

## 12. 验证清单

1. `npm run dev` 启动，逐个检查 4 页。
2. **首页**：环形文字 3 圈反向旋转、状态栏脉冲点闪烁、CTA 双药丸 hover 上移 + 箭头高亮、核心能力区水印隐约可见。
3. **项目页**：芯片卡片左右 6 个凹口清晰、IDE 窗口语法高亮与文件树正常、代码可读。
4. **技术栈页**：筛选器点选正常、水印正常。
5. **关于页**：水印正常、页脚 ASCII 显示。
6. **导航**：4 页跳转正确、active 药丸高亮正确、滚动缩放效果保留。
7. **移动端**（DevTools 375px）：环形文字/IDE 侧栏隐藏、状态栏堆叠、页脚单列、无横向滚动条。
8. **滚动动画**：新组件均触发入场动画一次。
9. `npm run build` 构建无报错。
