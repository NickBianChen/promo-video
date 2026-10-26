# TASKS.md — 执行任务清单

> `[x]` 已完成,`[ ]` 待办。按顺序执行,每个阶段末有验收点。
> 当前阶段:**全部完成,成片已导出。唯一待办:你确认音乐商用授权后再发布。**

## 待确认项(开工前)

- [x] 音乐来源:使用 HyperFrames(HeyGen 目录)的无版权资源,已选定 `bgm_002`。
- [x] 揭晓段的滑块"拖拽扫动"动画:已做(L4、P3)。
- [x] 片尾保留小字 "Results vary by photo.":已保留,成片可见。
- [x] 横屏、竖屏的导出命名与存放位置:`output/stylemirror-landscape-30s.mp4`、`output/stylemirror-portrait-24s.mp4`。

## 阶段 0 · 调研与素材(已完成)

- [x] 分析线上站点与本地源码,区分已上线/未上线功能。
- [x] 在线上同款界面截取横屏截图 16 张、竖屏截图 16 张(已去掉开发角标与未上线入口)。
- [x] 复制真实对比图 6 张、发型图 11 张、工具图标 3 个、字体 2 个到 `assets/`。
- [x] logo:源码与线上的 `icon.svg` 都是旧版青柠绿圆形,不是现行品牌,**不使用**;已按页头组件(紫色圆角方块 + 白色八角星)重建为 `assets/ui/logo.svg`。
- [ ] 逐张目检截图(特别是 `page-*` 与 `steps`、`why`、`pricing`),剔除不可用的。(成片实际用到的画面已全部目检;素材库里没用到的截图未逐张检查。)

## 阶段 1 · 项目搭建

- [x] 初始化 HyperFrames 项目:在临时目录 init 后合并,未覆盖任何现有文档与素材(新增 `hyperframes.json`、`package.json`、`meta.json`、`AGENTS.md`、`CLAUDE.md`)。
- [x] 横屏根 composition:`index.html`(1920×1080 / 30fps / 30s),背景为子 composition `compositions/bg-landscape.html`。
- [x] 竖屏根 composition:`compositions/portrait.html`(1080×1920 / 24s),背景 `compositions/bg-portrait.html`。
  - 一个项目只允许一个根 `index.html`,所以竖屏根放在 `compositions/` 下,用 `render -c compositions/portrait.html` 渲染。
- [x] `@font-face` 与设计变量统一放在 `assets/css/tokens.css`(Plus Jakarta Sans、Martian Mono、品牌色、卡片圆角与阴影)。
- [x] 横屏:`lint` 0 错误 0 警告,`check --json` 返回 `ok: true`,快照确认背景正常。
- [x] 竖屏:`lint` 通过;草稿渲染验证为 1080×1920、24 秒。
- [x] 变量字重:已在各文字场景和成片中验证,字重显示正常。
- [x] ffprobe 与 heygen CLI 已由你安装并登录(免费套餐)。
- 备注:`~/.npm/_npx` 里有一个残留的半成品缓存目录(`702923228c2ce1e6`),会让普通 `npx hyperframes` 报 ENOTEMPTY。绕开方式:运行前设置 `npm_config_cache` 指向一个新目录,并使用 `npx --yes hyperframes@0.8.186`(与项目 `package.json` 固定的版本一致)。该目录没有被删除,需要你自己清理。

## 阶段 2 · 共用组件

registry 搜索结果:`per-word-rise`、`before-after-wipe` 可改造使用;`press-ripple`(只能点一个固定按钮)和 `tilt-card`(深色文字卡)不适合,已不采用。

- [x] 背景:`compositions/bg-landscape.html`、`bg-portrait.html`(阶段 1 已完成)。
- [x] 浮动 UI 卡片:`.ui-card`(圆角、描边、柔和阴影),在 `assets/css/tokens.css`。倾斜、缩放、平移在各场景的时间线里做,不放进组件。
- [x] 字幕:`compositions/caption-rise.html`,基于 `per-word-rise` 的副本。改动:背景透明;增加 `ink` 墨色选项;增加 `size` 字号变量(宽度百分比,0 为自动);内部时长改为 30 秒以便任意挂载时长。
- [x] 光标与点击涟漪:`.cursor`、`.ripple` 样式在 `assets/css/tokens.css`,光标 SVG 与动画写在各场景里,可以连续点多个位置。
- [x] 前后对比:`compositions/compare.html`,基于 `before-after-wipe` 的副本。改动:Before 在左、After 在右,与站点一致;两个角标样式照站点(深色 "Before"、白色 "After · …");把手改为白色圆形加 `<>`;图片由变量 `before_src` / `after_src` 传入;内部时长改为 30 秒。
- [x] 契约变量:`--bg`、`--fg`、`--surface`、`--muted`、`--accent`、`--accent-2`、`--font-body`、`--radius` 已映射到品牌色,registry 组件直接读取。
- [x] 转场:没有做成独立组件,在各场景里用淡入淡出加 1.03 倍推近实现(相邻场景宿主重叠 0.2 秒)。
- **验收**:用临时测试根渲染草稿并逐帧查看:字体为 Plus Jakarta Sans、对比图持续显示、截图相框与光标正常。`lint` 0 错误 0 警告。
- 备注:`tokens.css` 里字体路径已修正为 `../fonts/`(相对 CSS 文件位置)。已知问题:Studio 截图里发型列表底部 "Bobs" 与 "Hair color" 标题重叠,场景里用到该截图时需要裁切或避开。

## 阶段 3 · 横屏场景 L1–L6(已完成,待你预览)

结构:`index.html` 挂 6 个场景宿主(`land-l1/l2/l3/l5/l6`)、3 个 `compare` 对比宿主(组成 L4)、6 个 `caption-rise` 字幕宿主和音乐。相邻场景重叠 0.2 秒做淡入淡出,切点都在 120 BPM 的拍上(3、7、12、21、26 秒)。

- [x] L1 钩子:`land-l1.html`。第 0 帧就有人像(社媒封面),左右摇摆表现犹豫。
- [x] L2 上传:`land-l2.html`。自拍被光标拖进上传区,再替换为真实的"已选照片"状态。
- [x] L3 选择:`land-l3.html`。光标依次点 Photo、Describe 标签,然后点 "Change hairstyle — 10 credits"。
- [x] L4 揭晓:3 个 `compare` 宿主(bob / curls / pixie,各 3.2 秒)+ 字幕 "Your face. New hair."。
- [x] L5 快闪:`land-l5.html`。8 张发型图按拍弹入,再依次切 3 张真实页面裁切图。
- [x] L6 行动号召:`land-l6.html`。logo、标题、20 积分徽章、按钮、域名、免责小字。
- [x] `check --json`:lint / layout / contrast / craft 全部 0 错误 0 警告(layout 余 2 条信息级提示,为镜头切换瞬间的交叠)。
- [x] 横屏、竖屏根草稿渲染成功:横屏 1920×1080 / 30s,竖屏 1080×1920 / 24s,均含音轨;横屏音频 -15.9 LUFS、真峰值 -2 dB、无削波。
- [x] GSAP 改为本地 `assets/vendor/gsap.min.js`,渲染不再依赖 CDN。

本阶段发现并处理的问题:
- `studio-tab-describe.png` 的输入框占位符含本地开发模拟模式文字(`mock mode: include FAIL...`),线上没有;已重拍,改为真实输入站点自己的示例 "Short curly bob, copper red"。
- `studio-tab-photo.png`、整张 `studio-photo.png` 的发型列表底部有版面重叠。所有 Studio 画面都改为裁切干净的真实像素(`assets/website/ui-crops/`)。
- 脸型检测、肤色分析页截图里有 "Loading face analyzer…" 加载占位,已裁成只含徽章、标题、说明的上半部分。
- `caption-rise` 和 `compare` 按组件内部写死的时长退场(字幕在 3.5 秒后消失),已增加 `duration` 变量,由挂载处传入。
- `compare` 的底层背景不透明,切换对比组时会闪白,已改透明。
- craft 检查:第 0 帧空白、对比角标 23px、结尾域名与小字停留不足 2 秒,均已修正。

验收对照(STORYBOARD.md):
- 文案与 SCRIPT.md 一致;无发色页、眼镜、滤镜等未上线内容;免责小字可见。
- 快闪切点落在拍点上;其中 L5 的发型图是"每 15 帧加入 2 张"而不是"替换",最后一屏 8 张同时可见约 0.3 秒。
- 未做:转场没有独立的"紫色柔光擦除",全片只用淡入淡出加轻微推近(DESIGN.md 允许最多两种转场)。

## 阶段 4 · 竖屏场景 P1–P5

- [x] P1 钩子:`portrait-p1.html`,自拍 + "Haircut regret?"。
- [x] P2 上传与选择:`portrait-p2.html`。上传卡片下移并缩小(top 700、521×900,底部 1600 仍在下 15% 安全区之上),与顶部标题不再重叠;同时修了涟漪在 0 秒就显示在按钮位置的多余小圆环。
- [x] P3 揭晓:3 个 `compare` 宿主(8.0/11.0/14.0 秒,各 3.2 秒)+ 字幕 "Your face. New hair."。
- [x] P4 快闪:`portrait-p4.html`,6 张发型图 + 肤色分析页裁切图,字幕 "65 styles · Free face tools"。
- [x] P5 行动号召:`portrait-p5.html`,logo、"Try it free."、20 积分徽章、按钮、域名、免责小字。
- 竖屏 `check`:0 错误 0 警告(4 条信息级提示,均为对比组切换瞬间的角标交叠);对比度 23/23 通过。关键帧目检(0.5/3.2/6/9.5/19/20.4/22.8 秒)无重叠、无越界。
- **验收**:上下 15% 无文字;文字位于中间 70%–80% 内;与横屏的色彩、字体、转场一致。

## 阶段 5 · 音频

- [x] 音乐:`assets/audio/bgm-main.wav`(来自 HyperFrames 素材库搜索(`/media-use`,provider `heygen.audio.sounds`),即 `.media` 里的 `bgm_002`,track id `0b58248c6b5747419b97947e8b70da27`;30 秒、120 BPM,目录描述为 royalty-free pop instrumental)。已用 `<audio id="bgm">` 挂入横竖屏两个根,`data-volume="0.8"`、淡出 1.5 秒。竖屏截到 24 秒。
- [x] 节拍:`beats . --json` 得到 120 BPM、58 个拍点,间隔 0.5 秒(15 帧),第一拍在 0 秒;3/7/12/21/26 秒的镜头切点都落在拍上。结果在 `beats/assets/audio/bgm-main.wav.json`。
- [x] 响度:加音效后的草稿渲染实测,横屏、竖屏均为 -15.9 LUFS、真峰值 -2.0 dBFS,无削波(原先不带 `data-volume` 时是 -13.9 LUFS、0 dB、9.0 秒削波)。社媒常见目标约 -14 LUFS,当前略低约 2 dB,需要的话可把音乐音量调到 0.95 以内再测。
- [ ] 许可:目录描述写明 royalty-free,但**商用授权条款没有核实**,发布前请你确认。
- [x] 添加点击、滑块、CTA 音效:用 media-use 自带库(Pixabay 内容许可,可商用、无需署名,许可文件在 `assets/sfx/CREDITS.md`)的 `click`、`pop`、`whoosh-short`、`chime` 四个文件,音量 0.4–0.5。横屏 16 处、竖屏 14 处,时间点对齐各场景的点击涟漪、对比扫动、发型图弹入和 CTA 出现。已核对混音:音效时间点的能量明显高于只有音乐时。
- [ ] `normalize-audio` 统一响度:横竖屏响度已一致(-15.9 LUFS),暂不需要;只有调整目标响度时才做。
- **验收**:静音观看时文案仍完整可懂;音乐不压过音效;结尾淡出不突兀。

## 阶段 6 · 检查与评审

- [x] `check`:横屏、竖屏均 0 错误;警告已评估(见 REVIEW.md)。
- [x] `snapshot --review`:横屏 17 个关键帧 + 接缝已目检;竖屏关键帧已目检。
- [x] 对照 SCRIPT.md 逐条核对:发现并修复 3 处("No sign-up" 角标、"glasses frames" 说明、AI clothes changer 页面),详见 REVIEW.md。
- [x] 已输出 `REVIEW.md`。
- **验收**:无未解决的错误;无未上线功能出现;免责声明可见。

## 阶段 7 · 预览与导出

- [x] 预览:你已看过 `output/drafts/` 的草稿并确认无问题。
- [x] 渲染横屏:`output/stylemirror-landscape-30s.mp4`(9.3 MB)。
- [x] 渲染竖屏:`output/stylemirror-portrait-24s.mp4`(7.8 MB),用 `render -c compositions/portrait.html` 成功。
- [x] `ffprobe`:横屏 1920×1080 / 30fps / 30.0s,竖屏 1080×1920 / 30fps / 24.0s,均为 h264 + aac;两者 -15.9 LUFS、真峰值 -2.0 dBFS;blackdetect 无黑帧。竖屏音效时间逐点核对,位置正确。
- [x] 抽帧检查成片:横屏 7 帧、竖屏 6 帧,画面与文案正确。
- **验收**:两个文件时长与分辨率正确;画面无黑帧;声音正常。

## 风险

| 风险 | 对策 |
| --- | --- |
| 示例仅 3 组真实对比 | 揭晓段只展示 3 组,不用 AI 虚构新结果 |
| 截图为本地开发环境所拍,个别细节可能与线上有微小差异 | 对照线上首页目检,有差异的重拍 |
| Studio 发型列表是内部滚动区,整块截图会裁切 | 分块使用,不整体展示列表 |
| 部分页面(glasses、free-tools、pricing)线上暂为 404 | 不出现在视频中 |
| `npx hyperframes capture` 在本机超时无产出 | 已改用 Playwright 截图,不依赖 capture |
| 音乐有削波、真峰值 0 dB,且只有 30 秒 | 横屏恰好 30 秒;竖屏截 24 秒;成片后复测响度 |
| 音乐商用授权条款未核实 | 发布前请你确认 |
