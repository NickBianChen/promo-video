# TASKS.md — 执行任务清单

> `[x]` 已完成,`[ ]` 待办。按顺序执行,每个阶段末有验收点。
> 当前阶段:**阶段 0**

## 待确认项(开工前)

- [ ] 版本与时长:<横屏 30s / 竖屏 24s / 其他>
- [ ] 风格主题:<soft-light / bold-dark / 新主题>
- [ ] 音乐来源与授权
- [ ] 导出命名:`output/<站点>-<版本>-<landscape|portrait>-<时长>s.mp4`

## 阶段 0 · 调研与素材
- [ ] 读源码与线上站点,列出已上线 / 未上线功能(写进 SCRIPT.md §4 §5)
- [ ] 填 `capture.json`,运行 `capture.mjs`;横竖屏截图
- [ ] 复制真实图片、logo、字体到 `assets/`
- [ ] 逐张目检要用到的截图:开发角标、加载占位、未上线入口、版面重叠
- **验收**:SCRIPT.md 的白名单每条都有依据

## 阶段 1 · 文档
- [ ] SCRIPT.md、DESIGN.md、STORYBOARD.md;brand.css 填入站点真实色值
- **验收**:你确认文案与分镜后再动手搭建

## 阶段 2 · 搭建与场景
- [ ] 横屏根 `index.html`,竖屏根 `compositions/portrait.html`
- [ ] 每个镜头一个场景文件(从 `scene-demo.html` 复制),组件用变量挂载并传 `duration`
- [ ] `npm run check` 0 错误
- **验收**:关键帧快照目检,无重叠、无越界

## 阶段 3 · 音频
- [ ] 选音乐(`/media-use`),`beats . --json` 取节拍,切点对齐拍点
- [ ] 音效对齐点击、揭晓、弹入、CTA
- [ ] 草稿渲染测响度:目标约 -14 LUFS,真峰值 ≤ -1 dBFS
- **验收**:静音可读;音乐不压音效;结尾淡出不突兀

## 阶段 4 · 检查与评审
- [ ] `check` + `snapshot --review`,对照 SCRIPT.md 白名单与禁止项逐条核对,输出 REVIEW.md
- **验收**:无未解决错误;无未上线功能;免责声明可见

## 阶段 5 · 渲染与验收
- [ ] 渲染横屏 / 竖屏(`render -c compositions/portrait.html`)
- [ ] `node <kit>/scripts/verify.mjs <mp4> --expect WxH@30:秒 --frames 6`
- [ ] git commit + tag `<版本名>`
- **验收**:分辨率、时长正确;无黑帧;声音正常

## 风险

| 风险 | 对策 |
| --- | --- |
