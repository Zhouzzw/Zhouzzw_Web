#!/usr/bin/env bash
# 一键部署到 Cloudflare Pages（国内可达入口）
#
# 用法：
#   export CLOUDFLARE_API_TOKEN=<Pages:Edit 权限的 Token>
#   npm run deploy:cf
#
# 首次运行会在 Cloudflare 账号下自动创建 Pages 项目 `zhouzzw-web`，
# 并返回 https://zhouzzw-web.pages.dev 访问地址。
#
# ⚠️ 两个必须知道的约束：
#   1. base 必须是 /（Cloudflare Pages 挂在域名根路径）→ 用 build:cf，不要用 build
#   2. 单文件 ≤ 25 MiB：assets/videos/视觉伺服动态抓卡.mp4 已从 32.7MB 压到 19.9MB，
#      若日后替换为大素材，需先用 ffmpeg 转码（CRF 29，命令见 docs/运维手册.md 第三节）再构建

set -euo pipefail
cd "$(dirname "$0")/.."

PROJECT_NAME="zhouzzw-web"
OUT_DIR="dist-cf"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  cat <<'EOF'
❌ 缺少 CLOUDFLARE_API_TOKEN

创建方式（2 分钟）：
  1. 登录 https://dash.cloudflare.com/ → 右上头像 → My Profile
  2. 左侧 API Tokens → Create Token
  3. 选模板「Edit Cloudflare Workers」，或自定义权限：
       Account · Cloudflare Pages · Edit
  4. Create → 复制 Token（只显示一次）

然后：export CLOUDFLARE_API_TOKEN=<粘贴 Token>
EOF
  exit 1
fi

echo "▶ 构建（base=/，产物 → $OUT_DIR）"
npx vite build --base=/ --outDir "$OUT_DIR" 2>&1 | tail -3

echo "▶ 校验 Cloudflare Pages 单文件限制（25 MiB）"
OVER=$(find "$OUT_DIR" -type f -size +25M | wc -l)
if [ "$OVER" -ne 0 ]; then
  echo "❌ 有 $OVER 个文件超过 25 MiB，Cloudflare Pages 会拒绝部署："
  find "$OUT_DIR" -type f -size +25M -exec ls -lh {} \;
  echo "   处理：用 ffmpeg 重新转码（CRF 29 可把 1080p30 文本类素材压到约 1.2 Mbps）"
  exit 1
fi
echo "  ✓ 全部文件合规"

echo "▶ 部署到 Cloudflare Pages（项目：$PROJECT_NAME）"
# ⚠️ --branch=main 不能省：wrangler 以「当前分支 vs 项目 production branch」判定生产/预览。
#    当前开发分支是 v3-full ≠ main，缺这个参数只会更新 <分支>.zhouzzw-web.pages.dev（预览），
#    自定义域名 zhouzzw.online 绑的是生产环境，看不到任何变化。
npx wrangler pages deploy "$OUT_DIR" \
  --project-name="$PROJECT_NAME" \
  --branch=main \
  --commit-dirty=true

echo
echo "✅ 部署完成。若已绑定自定义域名，直接访问即可；否则用上面输出的 pages.dev 地址。"
echo "   注意：*.pages.dev 在国内被 DNS 污染，正式投放必须绑定自定义域名。"
