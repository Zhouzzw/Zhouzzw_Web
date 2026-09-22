# 自托管字体（2026-09-21）

原先站点从 **fonts.googleapis.com**（Noto Sans SC）与 **cdn.jsdelivr.net**（Geist / Geist Mono）加载字体。
这三个域名在国内均不可达或极不稳定，且都是**阻塞渲染**的样式表 —— 无代理访问时首屏会白屏数秒。
现全部本地化，站点不再依赖任何墙外资源。

## 文件清单

| 文件 | 字体 | 体积 | 来源 | 许可 |
|------|------|------|------|------|
| `Geist-Variable.woff2` | Geist Sans（可变，wght 100–900） | 56 KB | npm `geist@1.3.1` → `dist/fonts/geist-sans/` | SIL OFL 1.1 |
| `GeistMono-Variable.woff2` | Geist Mono（可变，wght 100–900） | 58 KB | npm `geist@1.3.1` → `dist/fonts/geist-mono/` | SIL OFL 1.1 |
| `NotoSansSC-subset.woff2` | Noto Sans SC 子集（可变，wght 100–900） | 259 KB | Google Fonts `ofl/notosanssc/NotoSansSC[wght].ttf`（17.7 MB） | SIL OFL 1.1 |

`assets/icons/` 内的 9 个图标来自 [devicon](https://github.com/devicons/devicon)（MIT）。
其中 Linux 用 `linux-plain`（2.8 KB）—— `linux-original` 是 193 KB 的深灰黑 Tux，
既超重又在深色背景上几乎不可见，故改单色版并加 `.tool-icon--light` 白底衬。

## 子集更新方法

页面新增文字后若出现「个别字回退到系统字体」，重跑一次子集即可：

```bash
cd <项目根>
# 1. 取完整可变字体（约 17.7 MB，仅需一次）
curl -sSL -o /tmp/NotoSansSC-VF.ttf \
  "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"

# 2. 从页面 + CSS + JS 提取实际用字（当前 1037 个字符，含 903 个汉字）
python3 -c "
import pathlib
chars=set()
files=[pathlib.Path('index.html')]+[p for p in pathlib.Path('assets').rglob('*') if p.suffix in {'.css','.js'}]
for p in files: chars |= set(p.read_text(encoding='utf-8'))
chars={c for c in chars if c.isprintable()}
extra='0123456789%×°·—–、。，；：！？（）「」《》…“”‘’+-=/\|@#\$&*~^<>[]{}_'
pathlib.Path('/tmp/subset.txt').write_text(''.join(sorted(chars|set(extra))), encoding='utf-8')
print('subset chars:', len(chars|set(extra)))
"

# 3. 生成子集（需 fonttools + brotli）
python3 -m fontTools.subset /tmp/NotoSansSC-VF.ttf \
  --text-file=/tmp/subset.txt --flavor=woff2 \
  --output-file=assets/fonts/NotoSansSC-subset.woff2
```

## 为什么用可变字体

单个 woff2 覆盖全部字重（`font-weight: 100 900`），比按字重拆成 400 / 500 / 700 三个静态子集更省：
静态三份合计约 390 KB，可变单文件 259 KB。页面实际用到的中文只有 400（正文）/ 500（标题）/ 700（`<strong>`）。

⚠️ `@font-face` 的 `font-display: swap` 不要改成 `block` —— swap 让文本先用系统字体渲染、字体到位后替换，
避免字体加载期间文本不可见。
