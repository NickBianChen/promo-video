# REVIEW.md — 阶段 6 检查与评审记录

评审对象:横屏 `index.html`(30s)、竖屏 `compositions/portrait.html`(24s)。HyperFrames CLI 0.8.186。

## 1. 自动检查

| 项 | 横屏 | 竖屏 |
| --- | --- | --- |
| `check`(lint / layout / motion / contrast / craft) | 0 错误 | 0 错误 |
| 警告 | 1 条:`index.html` 357 行偏长(建议拆分,不影响渲染) | 单独当根渲染时 1 条,同上 |
| 信息级提示 | 2 条,镜头切换瞬间的交叠 | 4 条,对比组切换瞬间的角标交叠 |
| 草稿渲染 | 1920×1080、30s、有音轨 | 1080×1920、24s、有音轨 |

说明:在项目目录里直接跑 `lint`,会把 `compositions/portrait.html` 当成子合成,对它的 14 个音效报"起始时间基准不明"。竖屏按根渲染(临时根)时没有这类警告。**`render -c compositions/portrait.html` 这条正式命令尚未实际跑过,阶段 7 渲染时需确认音效时间正确。**

## 2. 对照 SCRIPT.md「禁止出现」

逐帧目检(横屏 `snapshot --review` 的 17 个关键帧与 14 个接缝;竖屏 0.5/3.2/6/9.5/19/20.4/22.8 秒)后的问题:

| # | 问题 | 位置 | 处理 |
| --- | --- | --- | --- |
| 1 | 肤色分析、脸型检测截图里有角标 "100% free · No sign-up · Photo stays on your device",违反"不得出现 no sign-up" | 横屏 L5、竖屏 P4 | 已改为只保留大标题的裁切图(`title-*.png`、`title-narrow-*.png`),角标和说明已去掉 |
| 2 | 脸型检测截图的说明文字含 "glasses frames"(眼镜) | 横屏 L5 | 同上,说明文字已去掉 |
| 3 | L5 第三屏是 "AI clothes changer" 页面:不在事实白名单内,也不是脸型/肤色这类"免费脸部工具" | 横屏 L5 | 已删除这一屏;L5 变为脸型检测(2.0s)→ 肤色分析(3.5s 起保持);对应一个 whoosh 音效删除、一个后移到 24.5s |
| 4 | 竖屏 P4 的页面卡片改小后需保持居中 | 竖屏 P4 | 卡片 top 从 680 调到 715 |

其余项:无发色页、眼镜试戴、Hair Filters、`/filter/*`;无"free forever / 免费无限";无虚构生成画面、进度数字、评价或使用量数据;无第三方 "featured on" 徽章;3 组示例未被说成"所有结果"。

## 3. 对照 SCRIPT.md「事实白名单」

| 屏显文案 | 依据 | 结论 |
| --- | --- | --- |
| 65 styles | 首页 Hero | 通过 |
| Styles / Photo / Describe 三种输入 | Studio 标签页(L3、P2 截图) | 通过 |
| Your face. New hair. | "You stay you" | 通过 |
| 20 free credits · No card needed | 首页 Hero 徽标 | 通过 |
| Change hairstyle — 10 credits | 按钮截图 | 通过 |
| Results vary by photo. | 对比区免责声明 | 通过,L6 与 P5 均可见 |
| Free face tools | 脸型检测、肤色分析(P4/L5) | 通过 |
| Before / After · French bob、Defined curls、Textured pixie | 真实标签 | 通过 |

与 SCRIPT.md 逐镜文案的差异(都是有意的,不算错误):
- 竖屏 P5 的主标题是 "Try it free.",与脚本一致;横屏 L6 按钮文字为 "Try an AI hairstyle"(脚本未规定按钮文字)。
- 横屏 L5 现为两屏页面截图(脸型检测、肤色分析)加 8 张发型图快闪。

## 4. 未解决 / 需要你决定

1. **音乐商用授权条款未核实**(`bgm_002`,来自 HyperFrames 素材库,目录只写 royalty-free)。发布前请你确认。
2. 横屏 L6 里 "20 free credits" 徽章与按钮上下间隔仅约 10px,偏紧(不影响可读,也未被 check 报错)。如需更松,再调。
3. 响度:草稿 -15.9 LUFS、真峰值 -2.0 dBFS、无削波;比社媒常见的 -14 LUFS 低约 2 dB,可按需上调音乐音量。
4. 草稿成片在 `output/drafts/`,只用于预览,不是交付文件。
