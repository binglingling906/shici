# 山河诗境 · Phase 1 Design QA

最新书卷式 UI 与学习体验升级验收（2026-09-20）：见 [UI-READING-UPGRADE-2026-09-20.md](docs/UI-READING-UPGRADE-2026-09-20.md)。下文保留 9 月 1 日历史记录，不代表新版当前截图。

验收日期：2026-09-01

## Source / implementation comparison

- 视觉源：`docs/audits/phase1/before/01-world-1440x900.png`、`docs/audits/phase1/before/02-reading-pinyin-below-1440x900.png`
- 最终实现：`docs/audits/phase1/after/01-world-1440x900.png`、`docs/audits/phase1/after/02-reading-lushan-1440x900.png`
- 同输入对照：`docs/audits/phase1/after/13-source-implementation-comparison.png`

判断：最终实现保留了原有宣纸、宋画、低饱和青绿、博物馆式留白和安静节奏；把单点原型扩成 5 地点世界时，没有改成卡片商城或儿童题库。阅读页的诗仍是最大、最清晰的 Primary Content，AI 变成独立流式学习区；桌面为不重叠侧栏，手机在诗后出现。

## Functional and content QA

- 5 个地点、10 首完整诗境、100 首候选目录检查通过。
- 10 首诗共 54 行、388 个逐字/标点 token；声调符号、路径级读音 override、来源和人工审核字段检查通过。
- 唐、宋诗、山河、城市、诗人六种筛选均运行；唐/宋数量按作品朝代计算，不把宋诗误写成宋词。
- 7–8、9–10、11–12 三种模式真实改变拼音默认值、解释、问题、提示预算和完成标准。
- 全诗朗读、逐句朗读、停止、当前句高亮、切页停止和不可用降级已运行。
- Tutor 的空输入、不知道、偏题、部分证据、命中证据和远端不可用降级已运行；不会直接揭底，不持久化自由输入。
- 今日一诗按本地日期稳定；挑战、足迹、地点完成状态、下一站、版本化本地进度和旧状态迁移已运行。

## Responsive and accessibility QA

浏览器 evaluator 全部通过：

- 1440×900 地图
- 1440×720 八句诗
- 1024×768 阅读
- 768×1024 地图
- 430×932 八句诗
- 390×844 四句诗
- 390×600 短屏阅读
- 390×500 输入/键盘代理
- 320×700 窄屏
- 125% 与 150% 文本缩放
- reduced motion

自动检查覆盖：Primary Content Visibility、secondary occlusion、ruby 配对、拼音位于汉字上方、拼音/汉字字号、阅读舒适度、水平溢出、44px 触控目标、键盘视口、儿童首屏可见控制数量、地图标记重叠、地图文字回退、内容注册表、Provider 和隐私字段。

## Human critique

- 桌面四句诗与八句诗均保持整首可见；1440×720 的八句诗通过收紧元信息与句间节奏完整留在首屏。
- 390×844 将诗提前到地点说明之前，四句和八句都可完整阅读，拼音在字上方且最小 10.88px。
- 768×1024 原先地图落在首屏下方；已把地图调整为平板/手机的第一内容块。
- 地图五个标记原先在长江中下游区域互相压住；已按准确锚点附近的标签方向错开，并用 evaluator 阻止回归。
- 150% 文本缩放曾产生 10px 诗卡内部溢出；已消除，正文与拼音仍保持一一对应。
- 仍需未来真实儿童测试验证问题难度和画面偏好；这不阻塞本轮工程与体验验收。

## Final result

passed
