# PROGRESS.md — 个人网页项目进度

## 当前状态

**阶段**: 桌面端初版完成，细节迭代中  
**最后更新**: 2026-07-30

---

## 已完成

### 项目基础设施
- [x] Vite + Vanilla HTML/CSS/JS 项目初始化
- [x] 全局 CSS 变量体系（暗色冷调 4 色方案）
- [x] 设计系统确立：Taste Skill 三旋钮 (V=7, M=4, D=5)
- [x] Git 仓库初始化 + `.gitignore`
- [x] `CLAUDE.md` 项目背景文档

### 页面开发
- [x] **首页** (`index.html`) — Hero + 个人简介 + 核心能力概览 + 比赛人物照
- [x] **项目经历** (`projects.html`) — 串联腿平衡步兵 + 全向轮步兵卡片 + 3 个演示视频
- [x] **技术栈** (`techstack.html`) — 分类筛选 + 6 大技术领域
- [x] **关于我** (`about.html`) — 证件照 + 教育背景 + 6 项荣誉 + 联系方式

### 交互功能
- [x] 导航栏滚动变色（透明 → 毛玻璃）
- [x] IntersectionObserver 滚动入场动画
- [x] 项目卡片 hover 微动效
- [x] 技术栈分类筛选
- [x] 视频封面 + 点击弹窗播放
- [x] `prefers-reduced-motion` 适配

### 内容填充
- [x] 真实姓名、学校、经历
- [x] RoboMaster 项目详情 + 荣誉奖项
- [x] 个人证件照 + 比赛照片
- [x] 3 个演示视频嵌入

---

## 待完成

### 高优先级
- [ ] **移动端适配** (`mobile.css`) — 汉堡菜单、单列布局、响应式字体
- [ ] **视频封面首帧显示** — 目前部分视频封面为黑色，需用 JS seek 到首帧
- [ ] **图片压缩** — 项目照片 3.8MB/5.7MB 过大，需转 WebP 并压缩

### 中优先级
- [ ] Email 地址替换为真实邮箱（当前 `2661762781@qq.com` 仅首页已改）
- [ ] 全向轮步兵项目添加演示视频（如有）
- [ ] Hero 区域添加粒子/代码流背景动画（可选）
- [ ] 项目卡片点击弹出详情弹窗（目前仅视频弹窗）

### 低优先级
- [ ] 部署到 GitHub Pages / Vercel
- [ ] SEO meta 标签优化
- [ ] 暗色主题唯一化（当前无亮色切换，后期可加）
- [ ] 博客页（第 5 页，可选）

---

## 遇到的问题

| 问题 | 状态 | 解决方案 |
|------|------|----------|
| `create-vite` 在非空目录下取消 | 已解决 | 手动创建 `package.json` + `vite.config.js` |
| HTML 中 `<` 字符导致 Vite 解析失败 | 已解决 | 改为 `&lt;` |
| 项目图片过大（最大 5.7MB） | 待处理 | 后续压缩为 WebP |
| 证件照 `object-fit: cover` 裁剪人物 | 已解决 | 调为 `cover` + `object-position: center 15%`，比例 `3:4` |
| 视频封面显示为黑色 | 进行中 | 添加了 JS seek 首帧方案，待验证 |
| 视频文件过大（最大 205MB）纳入 git | 待决定 | 考虑加入 `.gitignore` 或使用 Git LFS |

---

## 文件结构

```
d:/DSEKTOP/个人网页/
├── index.html
├── projects.html
├── techstack.html
├── about.html
├── package.json
├── vite.config.js
├── CLAUDE.md
├── PROGRESS.md
├── .gitignore
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── desktop.css
│   │   └── mobile.css          ← 待完善
│   ├── js/
│   │   ├── main.js
│   │   └── animations.js
│   ├── images/
│   │   ├── 白底证件照.jpg
│   │   ├── 比赛人物照.jpg
│   │   ├── 全向轮机器人项目照片.jpg
│   │   ├── 平衡轮腿机器人项目照片1.jpg
│   │   └── 平衡轮腿机器人项目照片2.jpg
│   └── videos/
│       ├── 串联腿小跳上台阶演示视频.mp4    (113MB)
│       ├── 串联腿跳跃演示视频.mp4          (18MB)
│       └── 串联腿飞坡演示视频.mp4          (206MB)
└── dist/                         ← 构建输出 (git ignored)
```

---

## 设计备忘

- **配色**: `#0D0D0F` / `#1A1A1E` / `#EDEDF0` / `#0ABFB0`
- **字体**: Geist + Noto Sans SC + Geist Mono
- **Taste Skill**: DESIGN_VARIANCE=7, MOTION_INTENSITY=4, VISUAL_DENSITY=5
- **参考**: GTA VI 官网（暗底+大字体+克制留白）
