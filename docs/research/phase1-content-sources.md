# Phase 1 内容、拼音与来源研究记录

更新时间：2026-09-01

这份记录对应五个完整地点、十首完整诗和 100 首儿童核心候选目录。目标不是把一个大诗库直接搬进儿童端，而是让每一条可呈现内容都能回到一个可追溯的来源快照，再经过独立的人工整理层。

## 结论先行

- 完整体验固定为 5 个地点 × 2 首诗：庐山、黄鹤楼/武汉、杭州西湖、成都、长安。
- 十首诗的正文、换行、逐字拼音、儿童解释、问题、提示、空间关系和下一站都在 `content/phase1/poems.js`，不是写在页面脚本里。
- 拼音目标明确为汉字上方的 ruby（`presentation: "ruby-above-character"`）。每个汉字是一个 token，标点是无拼音 token；UI 可以切换显示而不重排正文。
- 自动拼音只作为候选生成器。十首完整诗全部由项目层人工确认，并将多音字、变调、古典词语和专名写入作品级 path override。
- 100 首目录的原始快照与人工 shortlist 分离：`raw-candidates.json` 只保存源记录，`curated-selection.js` 保存稳定 ID、地点候选、主题、适龄、教材常见度、优先级和审核状态，`curated-overrides.js` 保存正文或题名修订。
- 自动评分只用于排序，不会把候选自动标成“已审核”。当前只有十首完整单元为 `approved_full_experience`；其余为 `catalog_candidate`，需要未来逐首完成文本、拼音、背景和儿童体验审核。

## 来源与许可证

### 古诗原文候选源

主要候选源是 [chinese-poetry/chinese-poetry](https://github.com/chinese-poetry/chinese-poetry)。仓库 README 说明其以 JSON 分发唐诗、宋诗、宋词等大型集合，仓库许可证为 [MIT](https://github.com/chinese-poetry/chinese-poetry/blob/master/LICENSE)。本项目只保留 100 条 Phase 1 选择的 source snapshot，不 clone、不把几十万首原始数据打包进浏览器，也不把上游“采集自互联网”的字段当成已经完成的儿童内容审核。

原始古典诗文作者已逝世多年，正文通常属于公版文本；但版本、标点、异文和现代整理仍需逐条核对。项目因此在每项 runtime 目录记录 `sourceSnapshot` 与 `curation` 两层，不把来源仓库的 MIT 许可证误写成所有二次整理、解释和音频资产的许可证。

### 文本版本与地点事实

- [北京大学古诗文文本异文研究索引](https://ir.pku.edu.cn/handle/20.500.11897/581009)：用于提醒项目保留版本差异，不把某个网络版本自动当成唯一底本。
- [UNESCO 庐山国家公园](https://whc.unesco.org/en/list/778/)与[庐山市人民政府 · 庐山概况](https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html)：支持庐山的山水区域、长江北侧、鄱阳湖南侧、九江语境和历史别名，不支持把代表点当成李白确切站位。
- [武汉市园林和林业局 · 黄鹤楼](https://ylj.wuhan.gov.cn/zwgk/zwxxgkzl_12298/jggk_12304/xsdwszjzz_12308/202001/t20200110_726398.shtml)与[武昌区人民政府 · 黄鹤楼](https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_3624646.html)：支持当前黄鹤楼现址、1985 年重建和长江南岸的现代参照；历史楼址与唐代位置保持开放说明。
- [国家发展改革委 · 长江流域](https://cjjjd.ndrc.gov.cn/zoujinchangjiang/jingjishehuifazhan/201907/t20190713_941469.htm)：支持长江水系的现代区域背景；诗中水路或旅程不因此变成诗人真实路线。
- [杭州市人民政府](https://www.hangzhou.gov.cn/)：作为杭州、西湖的现代城市来源入口；诗中的净慈寺、六月西湖和天气观察关系仍在作品层单独标注。
- [成都市人民政府](https://www.chengdu.gov.cn/)与[西安市人民政府](https://www.xa.gov.cn/)：作为城市级现代参考；成都草堂、长安城界和诗人确切写作点不被本数据层过度精确化。

官方网页的文字和图片权利按各页面声明处理。项目只保存支持关系的 URL、标题、能力和检索日期，不抓取或重新分发官方页面素材。

### 拼音候选方案

考察过的方向：

| 候选 | 可借鉴能力 | 本项目处理 |
| --- | --- | --- |
| [pinyin-pro](https://github.com/zh-lx/pinyin-pro) | MIT；支持数组输出、带调符号、分词、姓氏模式、自定义拼音和 HTML ruby | 选为候选生成器（锁定 `3.29.3`），不作为最终审核者 |
| [hotoo/pinyin](https://github.com/hotoo/pinyin) | 轻量汉字转拼音，生态成熟 | 可作为未来离线候选对照；当前不承担古诗语境判断 |
| [OpenCC](https://github.com/BYVoid/OpenCC) | MIT；简繁转换和词语级转换 | 只适合未来 source normalization，不解决多音字和古典语境 |
| 浏览器直接生成 ruby | 无构建依赖 | 不采用 naive 字符逐一转换；会丢掉词语语境和人工审核痕迹 |

最终选择 `pinyin-pro@3.29.3` 的原因是它能在构建期生成可比较的带调候选、能保留数组位置，也支持自定义拼音；但它的候选结果仍可能把古典语境读音判错。例如 `不复` 的变调、`花重` 的 `zhòng`、`不胜簪` 的 `shēng`、`一行` 的 `háng`，都必须由作品级 override 纠正或确认。项目不会使用数字声调，不会把整句字符串塞到汉字下面。

## 十首完整学习单元

| 地点 | 稳定 ID | 作品 | 作者／朝代 | 主要空间学习关系 | 地点关系类型 |
| --- | --- | --- | --- | --- | --- |
| 庐山 | `lushan-wang-lushan-pubu` | 《望庐山瀑布》 | 李白／唐 | 远近、高低、夸张尺度 | `cultural_association`、`regional_context` |
| 庐山 | `lushan-ti-xi-lin-bi` | 《题西林壁》 | 苏轼／宋 | 观察位置改变，看到的山不同 | `depicts_place` |
| 黄鹤楼／武汉 | `yellow-crane-huang-he-lou` | 《黄鹤楼》 | 崔颢／唐 | 临江远望、时间与乡愁 | `depicts_place`、`regional_context` |
| 黄鹤楼／武汉 | `yellow-crane-song-meng-hao-ran` | 《黄鹤楼送孟浩然之广陵》 | 李白／唐 | 起点、方向、孤帆变远 | `departure_place`、`destination_mentioned`、`river_imagery` |
| 杭州西湖 | `west-lake-yin-hu-shang` | 《饮湖上初晴后雨·其二》 | 苏轼／宋 | 晴雨改变同一湖面的感受 | `depicts_place`、`city_context` |
| 杭州西湖 | `west-lake-xiao-chu-jing-ci-si` | 《晓出净慈寺送林子方》 | 杨万里／宋 | 从寺门近景推向接天荷叶 | `depicts_place`、`viewpoint_reference` |
| 成都 | `chengdu-chun-ye-xi-yu` | 《春夜喜雨》 | 杜甫／唐 | 夜雨、声音、江船、到晓 | `written_at_context`、`regional_context` |
| 成都 | `chengdu-jueju-two-orioles` | 《绝句》（两个黄鹂鸣翠柳） | 杜甫／唐 | 窗门取景、近处与远山水路 | `written_at_context`、`landscape_mentioned` |
| 长安 | `chang-an-chun-wang` | 《春望》 | 杜甫／唐 | 城市、山河、时代与个人身体 | `historical_association`、`regional_context` |
| 长安 | `chang-an-zi-ye-wu-ge-qiu-ge` | 《子夜吴歌·秋歌》 | 李白／唐 | 城市月光到远方玉关的情感距离 | `mentions_place`、`imagined_frontier` |

选择这十首，是因为它们覆盖唐／宋、山／楼／湖／城、水路、天气、季节、观察和送别等不同学习关系，并且让李白、苏轼、杜甫在多个地点形成可比较的作品网络。它们不是把“地点写在题目里”就自动当作写作地点：每首的 `placeRelations[].type` 明确区分描写、提及、文化关联、写作语境和想象边关。

## 数据层与可重复管线

```text
raw-candidates.json
        ↓  source snapshot / NFC / newline normalize
curated-selection.js ── curated-overrides.js
        ↓  stable ID + relation candidates + automatic suitability scores
phase1-runtime.json
```

运行：

```bash
npm run build:catalog
npm run check:content
```

当前仓库若未在 `package.json` 接入别名，也可直接运行：

```bash
node scripts/build-phase1-catalog.mjs
node scripts/check-phase1-content.mjs
```

构建脚本只写 `content/catalog/phase1-runtime.json`，不回写 `raw-candidates.json`、`curated-selection.js`、`curated-overrides.js` 或完整诗词模块。运行时记录：

- `places`：5 个完整地点，含现代城市、经纬度顺序、精度、有效时间、置信度、周边关系、来源和争议。
- `poems`：10 个完整学习单元，含逐行逐字 token、带调拼音、年龄层解释／问题／提示／追问、空间关系、来源、审核状态和 override。
- `catalog`：100 个候选，含规范化正文、作者朝代、体裁、地点候选、关系类型、主题、适龄、字符／行数、六维自动评分、教材常见度、原始快照、curation、优先级。
- `pinyinAudit`：54 个诗句候选结果，可用于审阅自动候选和人工 override 的差异。

评分维度为篇幅、语言清晰度、画面清晰度、地点清晰度、教材熟悉度、空间学习价值、文化代表性。评分算法版本写入 runtime，且标注“只用于排序，不能代替人工审核”。

## 仍需人工核验的边界

1. 十首之外的 90 首只有候选目录状态，不能在儿童端直接当作已审核学习单元。
2. 古诗版本仍可能因教材、底本和标点传统出现异文；新增作品必须通过同样的逐字、逐行和 override 检查。
3. `pinyin-pro` 是候选生成器，不保证古典词义、多音字、变调、姓氏和地名在所有作品中正确；人工审核必须保留具体 path 和理由。
4. “写于成都”“长安历史语境”“黄鹤楼古今位置”等关系需要按作品与地点事实分别审阅，不能从题名或现代坐标直接推导。
5. 未来如果加入音频或第三方讲解，必须另建 asset provenance 与许可证字段；本轮没有把外部音频伪装成已存在资源。
