# STORYBOARD.md — 分镜

> 帧率 30fps。素材路径相对 `marketing-video/assets/`。
> "真实"=直接使用站点截图或图片,只做缩放/裁切/位移;"动画"=制作的装饰与动效。

## 横屏主版 · 1920×1080 · 30s(900 帧)

### L1 钩子 · 0–3s(0–90f)
- **目的**:3 秒内点出痛点,制造共鸣。
- **画面**:`website/photos/transformations/bob-before.webp` 居中大图,轻微犹豫式左右小幅摆动;大字 "Not sure about that haircut?" 逐词上浮。
- **动画**:图缓慢推近 4%;文字自下而上入场。
- **转场**:推近 + 交叉淡化(8f)到 L2。
- **文案**:Not sure about that haircut?
- **素材依赖**:bob-before.webp;Plus Jakarta Sans。
- **验收**:文字在 30f 内全部可读;人脸不被文字遮挡;文字位于标题安全框内。

### L2 上传 · 3–7s(90–210f)
- **目的**:证明起步简单。
- **画面**:`website/screens-desktop/studio-empty.png` 在浮动卡片中出现;自拍图从下方飞入,过渡到 `studio-photo.png`(两张图交叉淡化,第二张已含"已选照片"状态)。
- **动画**:光标从右下移入 → 点击上传区 → 照片落入;涟漪;卡片轻微 3D 倾斜 3°。
- **转场**:卡片向左平移 + 淡化,L3 面板从右入。
- **文案**:Upload a selfie.
- **素材依赖**:studio-empty.png、studio-photo.png。
- **验收**:截图内容与文案不被改动;光标点击与照片出现相差 ≤ 6f;不出现虚构上传进度。

### L3 选择 · 7–12s(210–360f)
- **目的**:展示三种输入方式,强调自由度。
- **画面**:依次 `studio-tab-styles.png` → `studio-tab-photo.png` → `studio-tab-describe.png`(各约 40f);最后回到 `studio-photo.png` 并聚焦按钮 "Change hairstyle — 10 credits"。
- **动画**:光标依次点击三个标签,对应标签高亮;最后光标移到按钮并点击,按钮短暂按压(缩放 0.97)。
- **转场**:按钮点击后紫色柔光擦除(10f)进入 L4(不展示生成过程)。
- **文案**:Pick a style, a photo, or just describe it.
- **素材依赖**:studio-tab-styles/photo/describe.png、studio-photo.png。
- **验收**:三个标签均真实出现;按钮文案完整可读 ≥ 18f;不出现加载条或虚构中间图。

### L4 揭晓 · 12–21s(360–630f)· 本片核心
- **目的**:用真实效果建立信任,明确"脸不变"。
- **画面**:3 组前后对比,每组 90f:
  1. bob:`bob-before.webp` → `bob-after.webp`,角标 `Before` / `After · French bob`
  2. curls:`curls-before.webp` → `curls-after.webp`,角标 `Defined curls`
  3. pixie:`pixie-before.webp` → `pixie-after.webp`,角标 `Textured pixie`
- **动画**:滑块从左扫到右(约 40f,`power2.inOut`),停留 ≥ 36f;第一组出现后叠加大字 "Your face. New hair."(自下而上,停留到本镜头末)。
- **转场**:组与组之间用滑块把手收回 + 推近交叉淡化(8f)。
- **文案**:Your face. New hair.
- **素材依赖**:transformations 下 6 张图;角标样式按 DESIGN.md §4。
- **验收**:每组 before/after 是同一张脸的真实成对图;滑块停留足够读清差异;大字不遮挡面部;角标文案与线上一致。

### L5 快闪 · 21–26s(630–780f)
- **目的**:展示广度:65 款发型 + 免费工具。
- **画面**(音乐 120 BPM,1 拍 = 15f;总长 150f):
  1. 发型图 60f(4 拍):`photos/hairstyles/` 下 8 张发型图,每 15f 换 2 张(pixie-cut、copper-bob、curtain-bangs、wolf-cut、long-curls、box-braids、afro、silver-quiff)
  2. `screens-desktop/page-face-shape-detector.png`,30f(2 拍)
  3. `screens-desktop/page-skin-tone-analyzer.png`,30f
  4. `screens-desktop/page-ai-clothes-changer.png`,30f
- **动画**:发型图错峰弹入;三张页面截图轻微推近;底部叠 "65 styles · Free face tools"。
- **转场**:硬切对齐节拍,最后一帧淡化到 L6。
- **文案**:65 styles · Free face tools
- **素材依赖**:hairstyles 8 张;三张页面截图;节拍点(`beats/assets/audio/bgm-main.wav.json`)。
- **验收**:切换点落在拍点上(误差 ≤ 2f);不出现发色页、眼镜或滤镜;页面截图每个可读 ≥ 24f。

### L6 行动号召 · 26–30s(780–900f)
- **目的**:给出明确下一步并降低门槛。
- **画面**:白底紫光;大字 "See your next haircut before the salon does.";下方 "20 free credits · No card needed";logo + stylemirrorai.com;底部小字 "Results vary by photo."
- **动画**:大字逐词入场;紫色胶囊按钮"Try an AI hairstyle"轻微呼吸缩放(不循环,单次);星形火花点缀。
- **转场**:无,结尾定格 ≥ 30f。
- **文案**:见 SCRIPT.md。
- **素材依赖**:logo(`/icon.svg`,待复制)、Plus Jakarta Sans、Martian Mono。
- **验收**:域名可读 ≥ 60f;小字 ≥ 24px;文字在标题安全框内;结尾定格不被截断。

---

## 竖屏版 · 1080×1920 · 24s(720 帧)

> 顶/底各留 15%(≈288px)不放文字。UI 使用 `website/screens-mobile/` 竖向截图。

### P1 钩子 · 0–2s(0–60f)
- **目的**:前 2 秒抓留存。
- **画面**:bob-before 全宽大图;大字 "Haircut regret?"。
- **动画**:轻微推近 + 抖动;文字弹入。
- **转场**:快速推近交叉淡化(6f)。
- **验收**:文字在 20f 内可读;脸不被遮挡。

### P2 上传与选择 · 2–8s(60–240f)
- **目的**:把"上传→选择→点击"压缩成一个镜头。
- **画面**:`screens-mobile/studio-photo.png` 竖向局部放大(照片区 + 发型卡片);光标点选 Styles / Photo / Describe 标签(`studio-tab-*.png`);最后按下 "Change hairstyle — 10 credits"。
- **动画**:裁切框随光标平移跟随;点击涟漪。
- **转场**:紫色柔光擦除(10f)。
- **文案**:Upload. Pick a style. Done.
- **素材依赖**:screens-mobile 下 studio-photo / tab-styles / tab-photo / tab-describe。
- **验收**:关键按钮文案完整出现;截图内容未被改动;文字不进入上下 15% 区域。

### P3 揭晓 · 8–17s(240–510f)
- **目的**:同 L4。
- **画面**:3 组对比图各占满宽度(原图竖构图适配度高),每组 90f;大字 "Your face. New hair." 位于图下方安全区。
- **动画**:同 L4。
- **验收**:同 L4;字幕不压住面部。

### P4 快闪 · 17–21s(510–630f)
- **画面**:发型网格 60f → face-shape-detector 竖屏截图 30f → skin-tone-analyzer 竖屏截图 30f(共 120f,卡拍)。
- **文案**:65 styles · Free face tools
- **验收**:切点落在拍点上(误差 ≤ 2f);无未上线功能。

### P5 行动号召 · 21–24s(630–720f)
- **画面**:"Try it free." + "20 free credits · No card needed" + stylemirrorai.com + 小字 "Results vary by photo."
- **验收**:域名可读 ≥ 45f;结尾定格 ≥ 24f;所有文字在中间 70% 区域内。

---

## 素材与镜头对照

| 素材 | 使用镜头 |
| --- | --- |
| transformations/*(6 张) | L1 L4 P1 P3 |
| screens-desktop/studio-*(5 张) | L2 L3 |
| screens-desktop/page-*(3 张) | L5 |
| screens-mobile/studio-*、page-* | P2 P4 |
| photos/hairstyles/*(8 张用到) | L5 P4 |
| fonts/*、logo | 全片 |
