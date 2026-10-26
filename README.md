# promo-video

给网站批量制作营销视频的套件 + Claude Code skill。基于 [HyperFrames](https://hyperframes.heygen.com)，
从 StyleMirror 的成片项目抽离而来。

- **流程**：调研线上功能 → 截图 → 脚本/分镜 → 搭建横竖屏 → 音乐音效 → 检查 → 渲染 → 验收（[SKILL.md](SKILL.md)）
- **组件**：大字幕 `caption-rise`、前后对比 `compare`、结尾 `cta`、光标点击、背景（[references/components.md](references/components.md)）
- **风格主题**：`soft-light`（白底柔光）、`bold-dark`（深色强对比），一条命令切换（[references/iterate.md](references/iterate.md)）
- **踩坑清单**：[references/pitfalls.md](references/pitfalls.md)

## 安装（每台机器一次）

```bash
git clone git@github.com:NickBianChen/promo-video.git
cd promo-video && scripts/install.sh   # 软链到 ~/.claude/skills 和 ~/.agents/skills，安装 Playwright + Chromium
```

需要：Node 18+、ffmpeg/ffprobe、HyperFrames skills（`npx hyperframes skills update`）。

## 使用

在任一网站项目里对 Claude 说：**"给这个网站做一支营销视频"**，skill 会按流程推进，并在开工前确认时长、风格和音乐。

手动命令：

| 做什么 | 命令 |
| --- | --- |
| 新建视频项目 | `scripts/new-video.sh <网站仓库>/marketing-video --theme soft-light` |
| 截图 | 编辑项目里的 `capture.json`，然后 `node scripts/capture.mjs <项目>` |
| 换风格 | `scripts/set-theme.sh <项目> bold-dark` |
| 套件更新同步到项目 | `scripts/sync-kit.sh <项目>`（预览），加 `--apply` 执行 |
| 成片验收 | `node scripts/verify.mjs out.mp4 --expect 1920x1080@30:30 --frames 6` |

## 目录

```
SKILL.md            skill 入口（流程、硬性规则）
kit/                新项目拷贝的内容：组件、base.css、motion.js、音效、字体、演示根
themes/             风格主题 theme.css
templates/          SCRIPT / DESIGN / STORYBOARD / TASKS / REVIEW 模板、capture.json
scripts/            new-video / set-theme / sync-kit / capture / verify / install
references/         组件说明、迭代方法、踩坑清单
examples/stylemirror/   完整成片项目的文档与场景代码（不含素材）
```

## 每个视频项目的约定

- 放在网站仓库内的 `marketing-video/`，随网站代码一起用 git 管理；`output/` 不入库。
- 品牌色写在 `assets/css/brand.css`，风格在 `assets/css/theme.css`，场景只引用变量。
- 每次交付打 tag `video/<版本>`；文件名 `<站点>-<版本>-<landscape|portrait>-<秒>s.mp4`。
- `promo-video.json` 记录主题、套件版本和 HyperFrames 版本。
