# Spatial Experience Discovery 001

## 结论

本轮把地图从“诗意封面 + 地点按钮”改成一条贯穿学习过程的空间认知线：

`中国 → 长江与鄱阳湖之间 → 庐山 / 诗人眼前 → 黄鹤楼（西北方向）`

地图仍保留青绿山水的情绪价值，但明确标注为“关系图 · 非导航地图”。古诗仍是 Primary Content；空间信息只在正常文档流中出现，不覆盖诗句、拼音或输入。

## 1. 原地图概念弱的根因

- 首屏只有气氛和四个按钮，没有可迁移的尺度、方向或相邻水系，孩子离开地图后就失去“我在哪里”。
- 地图、庐山阅读和下一站分别是三个互不共享空间状态的画面；“回到山河”只能返回，不能维持认知。
- 下一站只是推荐 CTA，且原文案“江水向东 / 水路向东”与庐山到黄鹤楼的现代地理关系相反。
- 诗意构图曾把洞庭湖放在庐山东侧，说明视觉位置没有事实约束。
- 数据层只有地点名称，没有坐标精度、有效时间、来源、置信度和“非历史路线”的边界。
- 过去 evaluator 只确认页面没有崩溃或遮挡，没有检查空间语义是否真实、连续、可读。

## 2. 地图在产品中的角色

地图不是 GIS 工具，也不是景点菜单。它承担三个阶段性的角色：

1. **进入前：建立尺度。** 让孩子知道庐山在中国东南、长江与鄱阳湖之间。
2. **阅读中：维持方位。** 用三层空间锚保持“中国 → 江湖之间 → 庐山”，随后把注意力还给诗。
3. **完成后：组织旅程。** 把个人发现、足迹和下一站放回同一空间关系，明确方向、距离及事实边界。

## 3. 比较过的三个方向

### A. 渐进空间镜头（采用）

同一套三层尺度在地图与阅读页重复出现；完成后再展开下一程。优势是三个学习阶段都能回答“我在哪里”，且可以在矮屏折叠成一行。

### B. 长江旅程线

用一条持续可见的江流连接庐山与黄鹤楼。完成态的旅行感强，但阅读时容易让“下一站”抢走诗的注意力；若把曲线画成真实路线，还会制造未经核验的航路或李白行程。

### C. 我的山河记忆卷

让“我来过”印章和足迹成为地图主体。个人记忆强，但第一次进入时空间教学能力较弱，也容易过早转向收集/游戏化。

最终采用 A 作为骨架，吸收 B 的完成态旅程桥；C 只保留现有“我来过”反馈。

## 4. 改变判断的资料、项目与 Skills

### 开源与数据

- MapLibre GL JS：适合完整交互地图，但当前只有两个核心地点，依赖、地图操作和瓦片样式会增加不必要认知负担。
  - https://github.com/maplibre/maplibre-gl-js
- MapLibre Storymaps / Knight Lab StoryMapJS：证明“地点章节 + 镜头连续”是成熟模式，但当前不需要固定地图、滚动章节或全套 authoring runtime。
  - https://github.com/opengeos/maplibre-gl-storymaps
  - https://github.com/NUKnightLab/StoryMapJS
- D3-geo：适合未来从真实 GeoJSON 投影轮廓、河流和点位；当前两个点先保留 provenance schema，避免为一个关系引入渲染依赖。
  - https://d3js.org/d3-geo
- Natural Earth、OpenStreetMap、Wikidata：分别提供公共领域底图、ODbL 众包地图和 CC0 结构化事实。它们适合未来制图，但许可证和 attribution 不能混为一谈。
  - https://www.naturalearthdata.com/about/terms-of-use/
  - https://www.openstreetmap.org/copyright
  - https://www.wikidata.org/wiki/Wikidata:Licensing
- CHGIS Temporal Gazetteer：其 `placename + year + feature type + parent + source` 模型直接影响了本轮 `validTime / precision / confidence / sources` 的数据结构。CHGIS 的历史数据许可需要在商业化前单独复核，本轮没有把其数据打包进产品。
  - https://maps.cga.harvard.edu/tgaz/
  - https://chgis.fas.harvard.edu/pages/database

### 儿童空间认知

National Geographic 的 K–5 空间思维综述强调：儿童的地图学习不应只是“flashy software”，而应围绕空间概念、关系、表示和推理设计。由此本轮只保留三层尺度、两个核心地点、一个方向和一种距离。

- https://media.nationalgeographic.org/assets/file/SpatialThinkingK-5FullReport.pdf

### Skills

本轮使用 Product Design（真实页面审计、三概念图、视觉选择）、Frontend Design、Software UI/UX Design 和 in-app Browser 做实现与实测。扫描本地 Skill 后没有发现专用 GIS / cartography skill；Plugin Management 的判断是现有 Web research + 浏览器 + 本地数据校验已经覆盖当前需要，因此没有引入外部插件。

## 5. 最终体验假设

> 如果空间信息以“逐步拉近的镜头”出现，并在完成学习后用同一套空间语言展开下一程，孩子会把地图理解为诗所在的世界，而不是一张需要操作的工具。

采用原因：

- 在阅读前、阅读中、完成后三个状态都能传递空间信息。
- 三层信息可压缩，手机和矮屏不必牺牲整首诗。
- 不要求孩子理解比例尺、图层或地图手势。
- 可以把现代地理事实与历史叙事分开。
- 未来可替换为真实 GeoJSON 投影，而不推翻交互层级。

## 6. 地理 provenance、时间与不确定性

本节记录旧的 Spatial Discovery 001 实验。旧事实快照集中在 `content/spatial-lushan-yellow-crane.js`；当前运行时真相源已由 Full Build 替换为 `content/spatial-system.js`：

- 庐山：江西九江；UNESCO 区域参考点 `29.433333, 115.867`，精度为世界遗产区域参考，不是瀑布或李白站立点。
- 距离计算使用庐山山体代表点 `29.5725, 115.973333`，精度 `mountain_representative_point`、置信度 `medium`。
- 黄鹤楼：湖北武汉武昌蛇山、长江南岸；当前建筑代表点 `30.546944, 114.296944`，精度 `current_building_pin`。当前楼体 1985 年重建，不能自动等同唐代楼址。
- Haversine 计算为约 `194.34 km`，儿童 UI 舍入为“约 195 公里（直线距离）”。初始方位角约 `304.3°`，表达为“西北方向，略偏西”。
- 旅程显式标记 `notAnHistoricalRoute: true`，UI 显示“这是今天的地理关系，不代表李白真实行程”。

主要来源：

- https://whc.unesco.org/en/list/778/
- https://whc.unesco.org/document/217255
- https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html
- https://ylj.wuhan.gov.cn/zwgk/zwxxgkzl_12298/jggk_12304/xsdwszjzz_12308/202001/t20200110_726398.shtml
- https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_3624646.html
- https://www.wikidata.org/wiki/Q622616
- https://www.wikidata.org/wiki/Q462372
- https://cjjjd.ndrc.gov.cn/zoujinchangjiang/jingjishehuifazhan/201907/t20190713_941469.htm

## 7. 为什么庐山到黄鹤楼现在像一段旅程

- 完成学习前不出现路线，避免下一站抢注意力。
- “庐山记住你了”之后，同一空间组件从三层尺度自然展开为两个地点。
- 旅程桥同时提供出发点、目的地、相对方向、沿江上下游线索和约数距离。
- CTA 从泛推荐变成“沿着这条空间线”，但紧邻免责声明，不伪造李白真实行程。
- 打开下一站仍只进入未完待续 teaser，没有扩展黄鹤楼内容范围。

## 8. 实际视觉与交互验收

| 状态 | 视口 | 结果 |
| --- | --- | --- |
| 地图 + 空间镜头 | 1440×900 | 通过；三层镜头可读，黄鹤楼在庐山西北侧，艺术图明确为关系图 |
| 阅读态 | 1440×720 | 通过；四句与拼音完整在首屏，无 secondary occlusion |
| 地图 | 1024×768 | 通过；隐藏非本轮远景点，核心两点清楚 |
| 阅读态 | 1024×768 | 首轮第四句出屏；第二轮改为平板双栏后通过，四句完整可见 |
| 地图 | 390×844 | 通过；庐山标记 48px 触控目标，实际点击可进入 |
| 阅读态 | 390×844 | 通过；三层空间锚和四句诗完整可见，无横向溢出 |
| 完成态 | 390×844 | 通过；旅程桥、免责声明和 CTA 正常流显示 |
| 阅读态 | 390×600 | 首轮空间锚把第四句推下；第二轮折叠证据/说明后通过，四句与拼音完整可见 |
| 输入聚焦 | 390×844 | 通过；输入框在可视范围内，诗可向上回看 |
| 键盘代理 | 390×500 | 通过；输入框位于 `251–322px`，visual viewport 为 `500px`，回看全诗仍可触达 |

截图证据位于 `docs/audits/spatial-001/`。最终关键截图：

- `12-map-desktop-spatial-fixed.png`
- `14-lushan-reading-tablet-1024x768.png`
- `09-map-mobile-spatial.png`
- `08-lushan-complete-mobile-journey.png`
- `11-lushan-reading-390x600-fixed.png`
- `16-reflection-input-mobile-keyboard-proxy-390x500.png`

## 9. Spatial evaluator

浏览器 evaluator 新增十类 `spatialChecks`：

- Spatial Grounding
- Macro-to-Micro Continuity
- Geographic Meaning
- Relative Position
- Journey Continuity
- Information Density
- Mobile Legibility
- Historical Accuracy
- Primary Content Protection
- Artistic Spatial Integrity

可自动化项检查 active component、层级数量、方向/经纬度关系、距离与免责声明、标签数量、横向溢出、触控与遮挡。艺术空间完整性保留为 `review`，不伪装成机器通过；`spatialPass` 只在出现真实 `fail` 时失败。

`scripts/check-spatial.mjs` 保留为旧实验的可复现校验；当前 `npm run check` 与 `npm run check:spatial` 运行 `scripts/check-spatial-system.mjs`，校验 Full Build 的实体、关系、来源、生成地图、距离与方向。

## 10. 新发现的问题

本轮发现并已处理：

- 手机地图 copy 层曾截获庐山点击；改为背景与 copy 不接收指针，marker 单独接收并保持 48px 目标。
- 现有“江水向东”方向错误；已改为向西北、沿江往上游方向。
- 洞庭湖原相对位置错误；已移到西侧，并在平板/手机隐藏非本轮远景点，降低错误解读和认知负担。
- 新空间锚一度破坏 1024×768 和 390×600 的整诗首屏可见性；经第二轮平板双栏和矮屏折叠后恢复。
- evaluator 在地图态曾把隐藏的完成态旅程桥误判失败；已按 active view 修正。

仍保留的产品问题：

- 当前首屏仍是“有地理约束的关系图”，不是可扩展的全国真实投影；如果加入第三条以上真实旅程，应升级为基于 GeoJSON 的数据驱动制图，而不是继续手调 marker 百分比。
- “约 195 公里”是否真的帮助 8–12 岁儿童形成距离感仍是假设；在基础体验稳定后，可测试用熟悉距离类比或旅行时间替代，但不能在没有交通路线数据时展示伪精确时间。
- 李白写作时间、具体瀑布和真实行程仍没有进入 UI；这些需要版本学和历史资料的独立核验。
