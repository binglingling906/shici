# Curriculum Corpus + Concept Tutor（2026-09-01）

这是当前 Agent 继续扩展语料、概念和诗词地理关系时的运行时说明。任何统计都必须从 `content/curriculum/index.js` 与 `content/catalog/phase1-runtime.json` 重新计算，不在 UI 中手写。

## 版本边界

- 默认研究框架：6-3 学制、2024 修订统编小学/初中语文（按起始年级逐年换用）与 2023 统编高中五册。
- 2024 教材目录只能作为书系和过渡框架，不能自动证明单首诗属于某年级或学期。
- 当前 100 首均保留一条 `candidate` 关系；另有 10 条来自人教社逐项目录页的 `source-verified` 历史教材声明。
- 10 条已核声明分别来自 2016 一年级上、2017 二年级上、2016 七年级上和 2019 高中必修上目录。它们不会自动继承到 2024 修订教材。
- 当前是一个 100 首可运行学习目录，不等同于“统编教材全部 230 首左右古诗词已经逐项核完”。Coverage Dashboard 必须持续显示这个缺口。

## 内容成熟度

```text
Mother corpus / source snapshot
  → curriculum claim（candidate 或 source-verified）
    → 100 standard pages
      → 75 guided-capable pages
        → 30 immersive scenes
```

- 10 首 Gold Standard 保留完整逐字拼音、人工解释、年龄问题、朗读与空间体验。
- 其余标准页必须有规范原文、作者、朝代、体裁、分行、年龄入口、基础解释、概念与地理状态；机器拼音未审核时显示“拼音待审”。
- `maturityPath` 是继承关系：沉浸式内容也必须具备引导式能力。

## 30 首沉浸式诗境

1. 望庐山瀑布
2. 题西林壁
3. 黄鹤楼
4. 黄鹤楼送孟浩然之广陵
5. 饮湖上初晴后雨·其二
6. 晓出净慈寺送林子方
7. 春夜喜雨
8. 绝句（两个黄鹂鸣翠柳）
9. 春望
10. 子夜吴歌·秋歌
11. 登鹳雀楼
12. 小池
13. 赠汪伦
14. 早发白帝城
15. 独坐敬亭山
16. 望天门山
17. 长歌行
18. 敕勒歌
19. 回乡偶书
20. 凉州词
21. 出塞
22. 从军行·其四
23. 送元二使安西
24. 九月九日忆山东兄弟
25. 使至塞上
26. 渡荆门送别
27. 望岳
28. 登高
29. 闻官军收河南河北
30. 枫桥夜泊

## 地理横轴

8 条文化探索路线：长江中游·山楼江天、江南·湖上晴雨、巴蜀·峡江入画、关中·古都与故园、河西与边塞·风雪关山、黄河与关隘·大河向东、东部山海·登高望远、荆楚与江南·故人相逢。

`GEO_NODES` 当前有 42 个节点，其中 40 个有现代概略参照点，2 个为 `unknown`。坐标只表达今天的区域参照，不证明诗人写作站位。关系类型只能使用 `written_at`、`describes`、`mentions`、`poet_present`、`imagined`、`historical_allusion`、`cultural_association`、`journey_suggestion`、`unknown`。

地图同时提供去重后的可见标记和完整文字列表。不能为了“多”而恢复重叠 Pin，也不能给 unknown 造坐标。

## Concept Tutor

`CONCEPTS` 当前有 17 个本地审核概念，`POEM_CONCEPTS`/运行时生成关系把每首诗连接到 1–3 个概念。概念数据至少包含正式定义、三年龄层解释、发现步骤、诗例、反例、常见误解、继续追问、来源和审核状态。

Concept Tutor 的两层边界：

1. 本地结构化概念先工作；在线模型不可用时，数数、比较、追问和“不懂”路径仍完整。
2. 继续追问必须受当前概念与审核内容约束；找不到依据时回答“这个问题需要再查一查”。

《望庐山瀑布》的七言绝句流程按年龄提供不同步骤。7–8 岁先数第一句 7 字、发现 4 句、复述“七言”、再问绝句/押韵；9–10 岁增加五言比较和韵脚；11–12 岁增加近体诗、入韵位置与格律边界。概念面板始终处于文档流，手机端显示当前诗句证据，不覆盖正文。

## 关键代码

- `content/curriculum/index.js`：课程声明、成熟度、区域、地理节点、概念与关系生成器。
- `core/concept-tutor.js`：三年龄层本地概念课和 source-bound 追问。
- `app.js`：统一学习目录、多入口关系、地图去重标记、概念交互与 Coverage Dashboard。
- `evaluation/experience-evaluator.js`：浏览器里的布局、术语、课程、语料、地理、成熟度与 console 检查。
- `scripts/check-curriculum-system.mjs`：课程/地理/概念数据契约。
- `scripts/check-experience-contract.mjs`：Evaluator 的数据侧 CI 契约。
- `docs/research/corpus-source-report.md`：教材版本和开源语料研究。

## 审核与构建规则

- 外部仓库数据只能进入 `licensed raw/source snapshot`；AI 候选、人工 override 和 runtime 必须分层。
- `chinese-poetry` 只做 MIT 候选召回与公版原文比对，不把仓库标签当教材事实。
- 无许可证或来源不清的仓库不得复制进产品。
- 每次改课程声明时同时核对版本、出版社、学段、年级、学期、课内/课外、性质、来源、有效期和审核状态。
- 每次改地理关系时同时核对关系类型、证据、现代/历史时间层、精度、置信度和 unknown 行为。
- 自动生成内容不能覆盖人工修正。

## 必跑检查

```bash
npm run check
```

浏览器至少跑：1440×900、1024×768、390×844、390×500（输入/键盘代理）、`qaTextScale=150`、`qaTutorUnavailable=1`。检查输出在 `#experience-evaluator-output`，也可在控制台调用 `window.__SHANHE_EVALUATOR__.run()`。
