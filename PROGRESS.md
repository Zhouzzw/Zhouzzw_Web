# PROGRESS.md — 个人网页项目进度

## 当前状态

**阶段**: v2.4 已上线（GitHub Pages 自动部署）
**分支**: `v2`
**线上地址**: https://zhouzzw.github.io/Zhouzzw_Web/
**最后更新**: 2026-09-10

---

## 已完成

### 项目基础设施
- [x] Vite + Vanilla HTML/CSS/JS 项目初始化
- [x] 全局 CSS 变量体系（米白/纯黑/橙 三色 + 流体排版 + 4px 间距网格）
- [x] 字体：Geist + Geist Mono + Noto Sans SC
- [x] Git 仓库初始化 + `.gitignore`
- [x] `CLAUDE.md` 项目背景文档
- [x] `DESIGN_SPEC.md` v2.1 设计规格文档
- [x] `DESIGN.md` v2 设计系统文档
- [x] `PRODUCT.md` 产品定位文档
- [x] `PROGRESS.md` 进度文档

### 页面开发（单页化）
- [x] **单页** (`index.html`) — 5 个 section 长滚动：Hero + 个人简介 + 项目经历 + 技术栈 + 关于
- [x] **Hero 区块** — 左右分屏（左米白/右水泥灰 `#242423`）+ 16 圈螺旋文字 + CTA 双药丸
- [x] **项目经历区块** — 串联腿平衡步兵 + 全向轮步兵 + 3 个演示视频
- [x] **技术栈区块** — 芯片框图（SoC 外观 + 6 个功能模块 + 引脚）+ **开发工具箱（8 个官方品牌图标）**，筛选器淡化高亮
- [x] **关于区块** — 6 项荣誉 + 生活侧写（终端档案 life.txt + 生活照片墙）+ 联系方式

### v2.2 单页化改造
- [x] 4 个独立页合并为 1 个 `index.html` 长滚动
- [x] scrollspy 导航高亮 + 滑动指示器
- [x] 锚点平滑跳转 + `scroll-margin-top: 96px`
- [x] 删除 projects/techstack/about 三个独立页

### v2.1 视觉增强
- [x] 导航栏悬浮胶囊（纯黑 + 点阵 + 10px 圆角 + 品牌芯片 SVG）
- [x] Hero 16 圈螺旋文字（同向差速旋转 160s→40s）
- [x] CTA 双药丸
- [x] 芯片卡片（引脚凹口设计）
- [x] 深色 section 背景水印
- [x] 页脚 ASCII 艺术字 + 双列 grid

### v2.3 视觉丰富（已完成）
- [x] **开发工具箱** — 芯片框图下方新增图标墙，8 个官方品牌图标（MATLAB / Python / VS Code / Visual Studio / Git / GitHub / Linux / Raspberry Pi），devicon CDN
- [x] `char-matrix.js` — Canvas 动态字符矩阵背景（备用，未接入页面）
- [x] 生活照 2 张接入生活侧写（左列终端下方竖版排列，左右等高对齐）

### v2.4 部署上线（2026-09-10）
- [x] **GitHub Actions 自动部署** — `.github/workflows/deploy.yml`，push 到 `v2` 即自动构建并发布到 Pages，无需手动跑部署命令
- [x] **适配 Pages 子路径** — `vite.config.js` 加 `base: '/Zhouzzw_Web/'`；少了这个，所有 `/assets/...` 在项目站点下都会 404
- [x] **修复视频弹窗路径 bug** — 原先读 `data-video-src`，但 Vite 会重写 `<video src>` 却不会碰自定义 data 属性，构建后弹窗必然指向不存在的文件；改为读内部 `<video>` 已重写好的 `src`
- [x] **媒体压缩** — 视频 322MB→16MB（4K60 HEVC 转 1080p H.264 CRF 26），图片 58MB→3.8MB（长边 ≤1920 + `-q:v 3`）；`dist` 从 378MB 降到 20MB
- [x] 压缩质量用 SSIM/PSNR 对照近无损上限验证，确认损失可忽略
- [x] 视频纳入版本控制（体积已可入库，且 Actions 构建需要这些文件）
- [x] **线上生效** — https://zhouzzw.github.io/Zhouzzw_Web/ 及全部 14 个资源均返回 200

### 交互功能
- [x] 导航栏滚动缩放（`.nav--scrolled`）
- [x] 滚动入场动画已禁用
- [x] 项目卡片 hover 微动效
- [x] 技术栈分类筛选（淡化模式）
- [x] 视频封面首帧截取 + 点击弹窗播放
- [x] `prefers-reduced-motion` 适配
- [x] 16 圈螺旋文字持续旋转动画
- [x] 状态栏绿色脉冲点呼吸动画
- [x] scrollspy 滚动高亮 + 滑动指示器平滑过渡

### 内容填充
- [x] 真实姓名、学校、经历
- [x] RoboMaster 项目详情 + 荣誉奖项
- [x] 个人证件照 + 比赛照片
- [x] 3 个演示视频嵌入
- [x] 视频文件一度加入 `.gitignore`（v2.4 压到 16MB 后改为入库，因为 Actions 构建需要）
- [x] 生活照素材（徒步×2 / 攀岩 / 骑行 / 生活照×2）

### CSS 架构
- [x] `style.css` — 全局变量 + Reset + 排版 + 工具类 + 关键帧 + 组件基础样式
- [x] `desktop.css` — 桌面端布局 + 导航 + Hero + Section + 项目卡片 + 技术栈 + 时间线 + 页脚 + 开发工具箱
- [x] `mobile.css` — `<768px` 移动端 + `<480px` 小屏适配

---

## 待完成

> ⚠️ 项目级待办已迁至 [TODO.md](TODO.md)（唯一住所，P0-P4 分组）。本节不再双份维护。

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
├── index.html                    # 单页站点
├── package.json
├── vite.config.js
├── CLAUDE.md                     # 项目说明
├── PROGRESS.md                   # 进度文档
├── DESIGN.md                     # 设计系统
├── DESIGN_SPEC.md                # 设计规格
├── PRODUCT.md                    # 产品定位
├── .gitignore
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── desktop.css
│   │   └── mobile.css
│   ├── js/
│   │   ├── main.js               # scrollspy + 视频弹窗 + 筛选
│   │   ├── animations.js         # IntersectionObserver（已禁用入场）
│   │   └── char-matrix.js        # Canvas 字符矩阵（备用）
│   ├── images/                   # 证件照 / 比赛照 / 项目照 / 生活照（长边 ≤1920 压缩）
│   └── videos/                   # 3 个演示视频，1080p H.264，共 16MB（已入库）
├── .github/
│   └── workflows/deploy.yml      # push 到 v2 自动构建 + 部署到 Pages
└── dist/                         # 构建输出（git ignored）
```

---

## Git 提交历史

> ⚠️ 2026-09-10 为清除超限视频做过一次 `git filter-repo` 历史重写（`assets/videos/` 从全部历史中剥离），**所有提交的 SHA 都已改变**，之前文档里记录的旧 SHA 不再有效。

```
c0ba964 ci: configure-pages 开启 enablement，首次部署免手动开 Pages
5b0733d feat: 部署上线 — GitHub Pages 构建配置 + 自动部署 workflow
e04a321 feat: 生活侧写新增 2 张生活照（左列终端下方竖版排列，左右等高对齐）
7660e2e feat: 技术栈新增开发工具箱（8 个官方品牌图标） + char-matrix 备用 + 生活照素材入库
0f93efc feat: 关于页生活侧写完善 + 项目/联系方式细节调整
dbe6c69 feat: 技术栈芯片框图 + 关于页生活侧写
161b6bb feat: impeccable 优化 — 产品上下文 + 内容表达力打磨
70ac067 docs: 同步 CLAUDE.md/PROGRESS.md 到当前状态 + 禁用滚动入场动画
ad72010 docs: 更新 PROGRESS.md，同步单页化改造进度
d393ede v2.2: 单页化改造 — 四页合并为长滚动单页 + scrollspy 导航
65f7c50 v2.1: 项目页背景统一水泥灰 + 首页细节调整
d7870c6 v2.1: 首页分屏升级 — 水泥灰背景 + 16 圈螺旋文字复刻参考图
19be405 docs: 更新 PROGRESS.md，同步 v2.1 当前进度
a929a6f v2.1: 视觉增强迭代 — 导航药丸化 + 环形文字 + 芯片卡片 + IDE 窗口 + 页脚升级
d6fa4e5 v2: 全站视觉迭代，对齐 contentarchitecture.dev 设计语言
f3283f2 docs: 更新 PROGRESS.md，同步当前进度
```
