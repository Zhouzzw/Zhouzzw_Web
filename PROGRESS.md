# PROGRESS.md — 个人网页项目进度

> 本文件为 progress 会话快照（Δ 增量）。静态基线见 CLAUDE.md；跨会话未决事项见 TODO.md。
> 恢复上下文：读下方索引 + 最近 1-2 快照即可（~3KB）。历史归档可 grep `docs/archive/`。

**当前**：v2 主线 · v2.4 已上线（https://zhouzzw.github.io/Zhouzzw_Web/）

## 📋 快照索引

| 日期 | 主题 | 摘要 | 状态 |
|------|------|------|------|
| 09-11 | 文档体系 v2 主线化 + TODO 建立 | 建 TODO.md、v3 降为风格实验分支、PROGRESS 快照化、设计令牌迁 CLAUDE | ✅ 完成 |

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