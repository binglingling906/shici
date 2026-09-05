# 山河诗境：Agent 工作约定

## North Star

孩子打开产品后，不觉得自己进入了古诗数据库，而是进入一个会回应他的中国文明世界。他会自然地想点一个地方，发现山河、人物、历史与诗词之间的关系，并愿意继续探索。

首要结果不是背诵数量，而是形成探索欲、空间记忆、历史时间感、语言感觉、人物认知和主动表达。

## 当前阶段

当前是 `Experience Discovery`，不是 MVP 工程化阶段。最大的未知是“什么体验会让孩子主动探索”，而不是数据库、账号、支付、权限或大规模架构。当前空间垂直切片与 Curriculum Corpus + Concept Tutor 已完成一次 Full Build，系统边界见 `docs/SPATIAL-SYSTEM-FULL-BUILD.md`、`docs/CURRICULUM-CONCEPT-SYSTEM.md` 和 `design-qa.md`。

当前基础互动实验见 `docs/EXPERIMENT-001.md`；空间体验决策与验收见 `docs/SPATIAL-DISCOVERY-001.md`。

## 决策原则

- 忠于目标，不忠于既有方案；低成本、可逆的决策直接实验。
- Acquire Intelligence Before Writing Code：先调查已有数据、工具、研究和失败经验，再决定复用、改造或自建。
- 不因过去提到过某个框架就默认采用它；架构跟随已验证的需要。
- 代码不是资产，Validated Learning 才是资产。允许主动推翻和删除无效原型。
- 首屏探索欲优先于功能数量；产品首先是一个可进入、游历、发现的世界。
- AI 应融入世界的反馈、引导和组织机制，不做独立悬浮聊天框。
- 儿童学习顺序优先采用：感受 → 观察 → 猜测 → 提问 → 微提示 → 再猜 → 表达 → 最后解释。
- 孩子答错或不知道时，不立即纠正或公布标准答案。

## Taste

东方、古典、安静、高级、有文化感。参考宋画、青绿山水、宣纸、水墨、留白、古籍、印章、博物馆和优秀现代数字产品。

避免廉价国潮、页游/商城感、满屏金色、卷轴边框堆砌、满屏毛笔字、祥云装饰、低幼卡通和模板化“中国风”。“古”主要来自空间、构图、比例、色彩、材质、声音、节奏、运动与叙事。

## 数据与事实

- 不把底层模型锁死为 `Poem → Location`；长期实体可能包含诗、人物、地点、山川、城市、朝代、事件、典故、建筑、文化和路线。
- LLM 推测不等于历史事实。重要关系必须保留 `source`、`confidence`、`verificationStatus` 等 provenance。
- 对每个外部数据源检查 license、provenance、reliability、coverage、structure、maintenance 和 composability。
- 不确定的写作时间、地点、人物动机、路线或事件关联，不得作为确定事实展示。
- 课程框架、课标推荐、教材课文与课外诵读是不同声明；旧版逐项已核目录不能自动继承到 2024 修订教材。
- 当前运行时是 100 首可学习目录（100 standard / 75 guided-capable / 30 immersive），不是统编教材全部诗词已逐项核完。100 条候选与 10 条 item-level source-verified 声明必须继续分开统计。
- Concept Tutor 的正式术语必须有三年龄层解释、当前诗证据、来源和本地离线路径；无依据时明确说需要再查。

## Evaluation

“能运行”不等于完成。每轮至少检查：首个可点击线索是否自然、信息密度、儿童是否被过早告知答案、视觉是否像值得探索的世界、运动节奏、声音价值、事实来源与下一站动机。

任何 secondary interaction 都不能遮挡、裁切或削弱 primary learning content。视觉验收必须同时检查：Primary Content Visibility、Occlusion、Reading Comfort、Information Hierarchy、Text Legibility、Touch / Input Interference 与 Child Cognitive Load。几何检查通过后仍必须在真实截图中主动 critique；庐山场景可运行 `window.__SHANHE_EVALUATOR__.run()`，具体门槛见 `docs/EXPERIENCE-REFINEMENT-001.md`。

空间体验还必须检查：Spatial Grounding、Macro-to-Micro Continuity、Geographic Meaning、Relative Position、Journey Continuity、Information Density、Mobile Legibility、Historical Accuracy、Primary Content Protection 与 Artistic Spatial Integrity。任何地图上的位置、方向、距离和路线都必须来自带有 `validTime`、`precision`、`confidence` 与 `sources` 的数据；现代地理关系不得伪装成诗人的历史行程。

界面需支持键盘操作、清晰焦点和 `prefers-reduced-motion`。不要收集或外传儿童自由表达内容，除非未来有明确的隐私设计与监护人同意机制。

新增课程、概念或地理数据后必须运行 `npm run check`，并在 1440×900、1024×768、390×844、矮屏/键盘代理和 150% 大字号下读取 `#experience-evaluator-output`。地图标记需要通过 overlap 检查，完整地点仍可通过文字列表访问。

## 工作区提示

实际 GitHub 仓库位于当前目录。它的父目录曾被单独初始化为 Git 仓库；不要在父目录执行项目提交。
