# PROGRESS.md — 个人网页项目进度

## 当前状态

**阶段**: v2.2 单页化改造完成  
**分支**: `v2`（领先 `main` 7 个 commit）  
**最后更新**: 2026-08-02

---

## 已完成

### 项目基础设施
- [x] Vite + Vanilla HTML/CSS/JS 项目初始化
- [x] 全局 CSS 变量体系（米白/纯黑/橙 三色 + 流体排版 + 4px 间距网格）
- [x] 字体：Geist + Geist Mono + Noto Sans SC
- [x] Git 仓库初始化 + `.gitignore`
- [x] `CLAUDE.md` 项目背景文档
- [x] `DESIGN_SPEC.md` v2.1 设计规格文档
- [x] `PROGRESS.md` 进度文档

### 页面开发（单页化）
- [x] **单页** (`index.html`) — 5 个 section 长滚动：Hero + 个人简介 + 项目经历 + 技术栈 + 关于
- [x] **Hero 区块** — 左右分屏（左米白/右水泥灰 `#242423` + 噪点纹理）+ 16 圈螺旋文字（每圈不同文案 + 横线占位 + clip-path 截断）+ CTA 双药丸
- [x] **项目经历区块** — 串联腿平衡步兵 + 全向轮步兵 + IDE 代码窗口 + 3 个演示视频（原 projects.html 内容）
- [x] **技术栈区块** — 分类筛选 + 6 大技术领域（原 techstack.html 内容）
- [x] **关于区块** — 证件照 + 教育背景 + 6 项荣誉 + 联系方式（原 about.html 内容）

### v2.2 单页化改造
- [x] **长滚动单页** — 4 个独立页合并为 1 个 `index.html`，滚轮依次浏览各模块
- [x] **scrollspy 导航高亮** — 滚动实时高亮当前模块（只观察有导航链接的 section）
- [x] **导航滑动指示器** — 高亮药丸平滑滑动过渡，终端风 10px 圆角
- [x] **锚点平滑跳转** — 导航/CTA/页脚改 `#锚点`，`scroll-margin-top: 96px` 防标题遮挡
- [x] **删除旧页面** — 移除 projects/techstack/about 三个独立页，vite 改单入口
- [x] 首页精简 — 移除「核心能力」区块（与技术栈页内容重叠）

### v2.1 视觉增强（本次迭代）
- [x] **导航栏** — 悬浮 `top:32px`，纯黑 + 点阵纹理 + 终端风 10px 圆角 + 品牌芯片 SVG 图标 + 滑动指示器高亮
- [x] **Hero 螺旋文字** — 16 圈 `<textPath>` 同向差速旋转（160s→40s），每圈不同句子 + `-` 横线占位（文字 70% / 横线 30%），纯白文字、背景水泥灰 `#242423`，左侧由 `clip-path` 按深色区边界截断
- [x] **状态栏** — 药丸形 MCU/RTOS/CONTROL 标签 + 绿色脉冲扩散点
- [x] **CTA 双药丸** — 左侧文字 + 右侧橙色箭头，hover 上移 + 箭头区高亮
- [x] **芯片卡片** — 项目包裹层，左右各 3 个径向渐变凹口模拟芯片引脚，纯黑底
- [x] **IDE 代码窗口** — 标签栏 + 文件树侧栏 + 语法高亮代码（5 色）+ 底部状态栏
- [x] **背景水印** — 深色 section 添加 SVG 旋转文字 `EMBEDDED · ROBOTICS · CONTROL · ZHOU ZIWEI ·`
- [x] **页脚升级** — ASCII 艺术字 + 双列 grid（CTA + 导航链接） + 底部信息栏

### 交互功能
- [x] 导航栏滚动缩放（`.nav--scrolled` → `scale(0.96); opacity:0.92`）
- [x] IntersectionObserver 滚动入场动画
- [x] 项目卡片 hover 微动效
- [x] 技术栈分类筛选
- [x] 视频封面首帧截取 + 点击弹窗播放
- [x] `prefers-reduced-motion` 适配
- [x] 16 圈螺旋文字持续旋转动画（外圈 160s → 内圈 40s，同向卷入）
- [x] 状态栏绿色脉冲点呼吸动画
- [x] scrollspy 滚动高亮当前模块
- [x] 导航滑动指示器平滑过渡
- [x] 锚点平滑滚动 + `scroll-margin-top` 偏移补偿

### 内容填充
- [x] 真实姓名、学校、经历
- [x] RoboMaster 项目详情 + 荣誉奖项
- [x] 个人证件照 + 比赛照片
- [x] 3 个演示视频嵌入
- [x] 视频裁剪/缩放/首帧抓取逻辑
- [x] 视频文件加入 `.gitignore`
- [x] Home 比赛人物照布局优化
- [x] 证件照比例 + 焦点调整

### CSS 架构
- [x] `style.css` — 全局变量 + Reset + 排版 + 工具类 + 关键帧 + v2.1 组件基础样式
- [x] `desktop.css` — 桌面端布局 + 导航 + Hero + Section + 项目卡片 + 技术栈 + 时间线 + 页脚
- [x] `mobile.css` — `<768px` 移动端 + `<480px` 小屏适配

---

## 待完成

### 高优先级
- [ ] **图片压缩** — 项目照片 3.8MB/5.7MB，视频 113MB/206MB 过大，需转 WebP/压缩
- [ ] **部署** — GitHub Pages / Vercel

### 中优先级
- [ ] 全向轮步兵项目添加演示视频（如有）
- [ ] 视频封面首帧截取在移动端的效果验证
- [ ] SEO meta 标签优化

### 低优先级
- [ ] 项目卡片点击弹出详情弹窗（目前仅视频弹窗）
- [ ] 博客页（第 5 页，可选）
- [ ] `<picture>` + WebP + fallback 图片格式

---

## 设计令牌

| 类别 | 值 |
|------|-----|
| **配色** | 米白 `#F1EEE7` / 水泥灰 `#242423` / 深灰黑 `#232323` / 纯黑 `#000000` / 橙色 `#FF9100` |
| **字体** | Geist + Geist Mono + Noto Sans SC |
| **间距** | 4px 基数：`--space-1..40` |
| **圆角** | 2px / 4px / 8px / 9999px |
| **过渡** | `cubic-bezier(0.23,1,0.32,1)` / `cubic-bezier(0.4,0,0.2,1)` |
| **设计参考** | contentarchitecture.dev + 终端极客美学 |

---

## 文件结构

```
d:/DSEKTOP/个人网页/
├── index.html                    # 单页站点（Hero/项目/技术栈/关于 长滚动）
├── package.json
├── vite.config.js
├── CLAUDE.md                     # 项目说明
├── PROGRESS.md                   # 进度文档
├── DESIGN_SPEC.md                # v2.1 设计规格
├── .gitignore
├── assets/
│   ├── css/
│   │   ├── style.css             # 全局变量 + 重置 + 组件基类 + 关键帧
│   │   ├── desktop.css           # ≥1024px 桌面布局
│   │   └── mobile.css            # <768px / <480px 移动端适配
│   ├── js/
│   │   ├── main.js               # scrollspy + 视频弹窗 + 筛选 + 视频封面
│   │   └── animations.js         # IntersectionObserver 滚动入场
│   ├── images/
│   │   ├── 白底证件照.jpg
│   │   ├── 比赛人物照.jpg
│   │   ├── 全向轮机器人项目照片.jpg
│   │   └── 平衡轮腿机器人项目照片1.jpg
│   └── videos/
│       ├── 串联腿小跳上台阶演示视频.mp4    (113MB)
│       ├── 串联腿跳跃演示视频.mp4          (18MB)
│       └── 串联腿飞坡演示视频.mp4          (206MB)
├── docs/
│   └── rig-style-design-spec.md   # 早期设计探索
└── dist/                          # 构建输出 (git ignored)
```

---

## 遇到的问题

| 问题 | 状态 | 解决方案 |
|------|------|----------|
| `create-vite` 在非空目录下取消 | 已解决 | 手动创建 `package.json` + `vite.config.js` |
| HTML 中 `<` 字符导致 Vite 解析失败 | 已解决 | 改为 `&lt;` |
| 项目图片过大（最大 5.7MB） | 待处理 | 后续压缩为 WebP |
| 证件照裁剪人物 | 已解决 | `cover` + `object-position: center 15%` + `3:4` |
| 视频封面显示为黑色 | 已解决 | JS seek 到 0.5s 截取首帧 |
| 视频文件过大（最大 205MB）纳入 git | 已解决 | `.gitignore` + `git rm --cached` |
| 螺旋左圆弧越过深色背景边界 | 已解决 | `clip-path: inset(0 0 0 calc(...))` 按屏幕中分线裁切左侧溢出圆弧 |
| 螺旋每圈文案雷同 | 已解决 | 关键词池循环取词生成每圈不同句子，长短错落 + 横线占位 |

---

## Git 提交历史

```
65b2404 v2.2: 单页化改造 — 四页合并为长滚动单页 + scrollspy 导航
94ff45a v2.1: 项目页背景统一水泥灰 + 首页细节调整
a24b1aa v2.1: 首页分屏升级 — 水泥灰背景 + 16 圈螺旋文字复刻参考图
75cd22b docs: 更新 PROGRESS.md，同步 v2.1 当前进度
930340a v2.1: 视觉增强迭代 — 导航药丸化 + 环形文字 + 芯片卡片 + IDE 窗口 + 页脚升级
bf2c5a4 v2: 全站视觉迭代，对齐 contentarchitecture.dev 设计语言
d650b72 docs: 更新 PROGRESS.md，同步当前进度
cd66d1a chore: 视频文件加入 .gitignore，不再跟踪
1e8ef3e feat: 添加真实图片、视频封面、文案调整
87f0c74 init: 个人网站初版
```
