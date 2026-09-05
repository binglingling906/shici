# Spatial System Full Build · Intelligence & Facts

> 研究冻结日 / retrieved: **2026-09-01**
> 范围：庐山—九江—鄱阳湖—长江、黄鹤楼—武汉—蛇山—长江南岸、庐山到黄鹤楼的当代地理关系，以及适合静态前端的空间数据与儿童空间学习依据。
> 本文件是研究与事实边界，不是产品代码，也不是法律意见。所有“精确”均必须带有 `precision`、`confidence`、`validTime` 与来源。

## 先给结论

1. **庐山的安全地理表述**：庐山位于江西省九江市；从区域景观关系看，北邻长江、南接鄱阳湖。这个结论用于建立“江—山—湖”的区域骨架，不等于庐山山体的每一个位置都与河岸或湖岸相接。
2. **黄鹤楼的安全地理表述**：现黄鹤楼位于武汉武昌蛇山、长江南岸。现楼是现代建筑（1985 年重建）；现楼坐标不能当作唐代楼址或李白曾见到的楼址。
3. **庐山到黄鹤楼**：以“庐山山体代表点” `[115.973333, 29.5725]` 和“现黄鹤楼建筑点” `[114.296944, 30.546944]` 计算，球面距离约 **194.34 km**，初始方位角约 **304.3°**，儿童端显示为“**约 195 公里（直线距离）**”“**西北方向，略偏西**”。这是代表点之间的当代直线关系，不是水路距离、驾车距离或李白路线。
4. **上下游只能作带边界的空间提示**：长江总体由西向东；武汉/黄鹤楼位于九江更靠西、较上游的一侧。但庐山不是长江主河道上的点，不能写成“从庐山沿江乘船到黄鹤楼”，也不能把两点连线画成历史行程。
5. **诗作史实不能假精确**：《望庐山瀑布》的常见编年有开元十四年（726）前后等说法，也存在其他编年或不编年处理；“香炉峰”及具体瀑布的指认有争议。儿童端只需要“李白在庐山观瀑布、写下这首诗”的安全层；不画李白站立点、精确瀑布点或旅行路线。
6. **数据建议**：当前两地点切片无需瓦片地图。未来要画中国轮廓，可优先用 Natural Earth 的低分辨率公版几何；要画长江/鄱阳湖，离线提取并简化 HydroSHEDS 的河流/湖泊数据，再用人工核验的权威名称补齐。渲染优先考虑 D3-geo + SVG/Canvas；MapLibre 只在地点、图层和镜头复杂到值得引入时再采用。
7. **儿童空间学习原则**：地图必须服务于“看见关系—说出关系—记住关系”，不能把 GIS 操作、闪烁图层或 AI 对话变成学习目标。诗是 Primary Content；地图、提示、回答、下一站必须在正常文档流或明确的非遮挡区域渐进出现。

## 1. 重新核验的地理事实

### 1.1 庐山—九江—鄱阳湖—长江

| 事实 | 核验与边界 | confidence | UI 精度建议 |
| --- | --- | --- | --- |
| 庐山在江西九江区域 | UNESCO 庐山提名档案直接写明 Mount Lushan 位于江西省九江市；地方政府页面可作行政语境交叉核对。 | high | “江西九江 · 庐山”；不要显示到街道级。 |
| 庐山北邻长江、南接鄱阳湖 | UNESCO 档案把长江、鄱阳湖作为庐山景观的北/南边界关系；这是区域景观关系，不是一条可以沿岸行走的边界。 | high | 显示“北邻长江 / 南接鄱阳湖”；不画成庐山穿过两水系。 |
| 九江与长江相连 | 国家发展改革委长江专题资料及九江官方资料把九江置于长江沿线；可作为城市—江段语境。 | high | “九江在长江沿线”；不需要城市边界多边形。 |
| 鄱阳湖与长江相连 | 鄱阳湖水经北部湖口注入长江；江西人大、九江及中央资料均有同一水系表述。 | high | 河流关系可标“鄱阳湖 → 湖口 → 长江”；不要把鄱阳湖画成庐山脚下的一个小池塘。 |
| “庐山—九江—鄱阳湖—长江”是江湖系统 | 它是多要素的区域关系网，不是四个地点的直线游览路线。水文连接与文化观看关系要分开建模。 | high | 关系图使用不同语义：水文线、地域锚点、文化关联；禁止默认一条“旅程线”。 |

可给孩子的一句话：

> 庐山在江西九江，北边望着长江，南边接近鄱阳湖；鄱阳湖的水从湖口汇入长江。这里是一片“山、湖、江”相遇的地方。

“南边接近”比“南接”更适合口语层；事实注释仍可以保留 UNESCO 的“south by Poyang Lake”区域关系。地图应明确标注“关系图 · 非导航地图”。

### 1.2 黄鹤楼—武汉—蛇山—长江南岸

| 事实 | 核验与边界 | confidence | UI 精度建议 |
| --- | --- | --- | --- |
| 黄鹤楼在武汉武昌 | 武汉市政府、武昌区政府与湖北省政府资料均把黄鹤楼置于武汉武昌。 | high | “湖北武汉 · 武昌”；不需要行政边界。 |
| 黄鹤楼位于蛇山 | 武汉市政府明确称其位于长江南岸的蛇山峰岭之上；湖北文旅资料进一步说明在蛇山西端黄鹄矶一带。 | high | “蛇山”；儿童端不必展示黄鹄矶、旧址等细节。 |
| 黄鹤楼在长江南岸 | 武汉市政府官方页面直接使用“长江南岸的蛇山峰岭”；湖北省政府资料称北面临长江。 | high | “长江南岸”；南北岸是关系提示，不应被地图装饰遮住。 |
| 现楼不是历史楼址的同一建筑 | 湖北省政府资料说明现楼为重建建筑，位置距历史旧址约 1,000 m；现黄鹤楼于 1985 年重建完成的说法见地方/官方资料。 | medium_high | 现楼点 `precision=current_building_pin`；旁注“当前建筑（1985 年重建）”，不写“唐代黄鹤楼就在此点”。 |
| 黄鹤楼的历史沿革很长 | 官方资料常以约 1,700 年历史概括，但历代楼址、建筑和文献叙述不是一个现代坐标点。 | medium_high | 用“历史悠久”即可；不要把“约 1,700 年”转换成历史路线或坐标精度。 |

安全文案：

> 今天的黄鹤楼，在武汉武昌的蛇山上，位于长江南岸，北望长江。

若要谈历史，使用“历代黄鹤楼曾多次重建，今天看到的是现楼”而不是“李白站在现楼这个点”。

### 1.3 庐山到黄鹤楼：方向、距离与上下游

#### 计算依据

- 庐山山体代表点：`[115.973333, 29.5725]`（GeoJSON 顺序 `[longitude, latitude]`），来源为 Wikidata `Q622616` 的山体坐标；它不是瀑布观景台，也不是李白站立点。
- 黄鹤楼现楼代表点：`[114.296944, 30.546944]`，来源为 Wikidata `Q462372`；它对应当前楼体，不能代表唐代旧址。
- Haversine 球面距离：地球平均半径 `6371.0088 km`，得到 `194.33939880503263 km`。
- 初始方位角：从庐山点指向黄鹤楼点约 `304.303137940724°`；落在西北区间，且比正西略偏北。

#### 推荐表达

> 黄鹤楼在庐山的西北方向，直线约 195 公里。<br>
> 如果顺着长江这条大水脉去寻找，它在更靠上游的一侧。<br>
> 这是今天的地理关系，不代表李白真实行程。

“上游一侧”是帮助孩子理解长江方向的空间提示，不是交通指引。长江总体由西向东流，武汉在九江更靠西的一侧；但是庐山位于江南山地，不能把“庐山 → 黄鹤楼”自动等同于长江主槽上的水路。

#### 不可用表达

- “沿江水路 195 公里”：把直线距离偷换成水路距离。
- “从庐山坐船到黄鹤楼”：没有本轮核验的历史/现代行程依据。
- “李白沿长江从庐山去了黄鹤楼”：把文化关联写成传记事实。
- “黄鹤楼在长江上游”：缺少相对参照；应说“相对九江，在长江更靠上游的一侧”。
- 以曲线箭头、船图标或脚印把两个点连成李白路线：会制造历史假精确。

#### 精度与置信度

| 项目 | 建议值 | 原因 |
| --- | --- | --- |
| 庐山点 | `precision=mountain_representative_point`，`confidence=medium` | 山体是面状区域，代表点由外部实体坐标提供；不能支撑观景台级精度。 |
| 黄鹤楼点 | `precision=current_building_pin`，`confidence=medium_high` | 现楼是可定位建筑，但当前点和历史楼址的有效时间不同。 |
| 距离 | `precision=representative_point_geodesic_5km`，`confidence=medium` | 代表点误差和地点语义误差远大于小数点后的数字；儿童端取整到 5 km。 |
| 方向 | `precision=initial_bearing_from_representatives`，`confidence=medium` | 方向是两代表点的计算结果；显示“西北”即可，不显示度数。 |
| 上下游 | `precision=river-system-orientation`，`confidence=medium_high` | 长江总体东西流向可靠，但庐山不在主槽；必须配相对参照和免责声明。 |
| 历史路线 | `status=unknown`，`confidence=none` | 本轮没有足以建模的路线证据，产品中不生成路线。 |

## 2. 《望庐山瀑布》的事实边界

### 2.1 已知、可说与不可说

| 问题 | 研究结论 | confidence | 儿童端安全表达 |
| --- | --- | --- | --- |
| 题目中的地点 | 题目明确写“庐山”；这只确定作品的题目关联，不等于精确观景点。 | high | “李白在庐山观瀑布，写下这首诗。” |
| 具体瀑布 | 庐山有多个瀑布；“开先瀑布”“秀峰瀑布”等指认在地方叙事和研究中并不完全一致。没有足够依据把一个景点作为唯一答案。 | low_medium | “庐山的瀑布”；如展示候选，必须写“一种说法/有研究认为”。首版不展示候选点。 |
| “香炉峰”位置 | 文献和研究对南、北香炉峰或具体峰位有讨论；诗中意象不应被转成精确坐标。 | medium | 让孩子观察“香炉”与云烟意象，不画峰顶针点。 |
| 作品作年 | 常见编年把作品放在开元十四年（726）前后；也有至德元年（756）等说法，部分整理不编年。 | low_medium | “常见研究认为可能在 726 年前后，但并不只有一种说法。”儿童主流程可省略年份。 |
| 李白当时所在位置 | “遥看”说明诗内有远观关系，但无法反推出站立平台或视线坐标。 | low | “诗里的人从远处望见瀑布”；不要把 `遥看` 画成 GPS 视点。 |
| 李白旅行路线 | 本轮没有可靠路线证据；庐山与黄鹤楼的当代关系不能证明李白曾经这样走。 | none | `historicalRoute=unknown`；不显示脚印、船线或路线动画。 |
| “三千尺” | 是诗歌夸张与视觉尺度，不是瀑布实测高度。 | high | “诗人用‘三千尺’来写瀑布飞落的气势。” |

### 2.2 版本与文本处理

当前切片的教学文本采用：

```text
日照香炉生紫烟，
遥看瀑布挂前川。
飞流直下三千尺，
疑是银河落九天。
```

研究资料记录了“日照/日暮”“挂前川/挂长川”“三千尺/三千丈”“落九天/落半天”等异文或相关争论。首版选择一套面向小学阅读的整理文本是合理的编辑决策，但不能在研究层宣称“所有版本都只有这一写法”。

规则：

- 主流程保持单一、稳定、可朗读的儿童版文本；异文进入“版本说明”而不是 AI 临时改写。
- 如果将来展示异文，标签写“版本异文”，同时给出版本/出处，不把异文当作孩子必须背诵的第二答案。
- `遥看`、`直下`、`落九天`可以作为诗内空间与想象的教学切口；它们不提供现代地理坐标。
- 作品地点、作年、具体瀑布、李白路线分别建模，不能由标题或诗句自动推断。

### 2.3 研究来源与安全用法

- 北京大学机构库文章《李白〈望庐山瀑布〉的真伪、优劣及异文》记录了文本异文及真伪、优劣讨论：<br>https://ir.pku.edu.cn/handle/20.500.11897/581009
- 《中华读书报》关于诗中“香炉峰”与瀑布位置的讨论：<br>https://epaper.gmw.cn/zhdsb/html/2016-04/20/nw.D110000zhdsb_2016-04-20_2-05.htm
- 澎湃新闻关于编年与“瀑布水”题名材料的整理：<br>https://m.thepaper.cn/newsDetail_forward_16725758
- 现有教学文本的参考页面（人民教育出版社页面，作为文本编辑依据，不等于历史地理证据）：<br>https://www.pep.com.cn/xw/zt/hd/ywsd/sfsd/2s/201901/t20190103_1934779.shtml

以上文学资料多为研究/出版物页面，不以开放数据许可证提供；仅引用观点与链接，不复制整段文章、注释或图片。对“具体瀑布、作年、路线”的产品结论，应按 `low_medium` 或 `unknown` 处理。

## 3. 静态前端可用的中国轮廓、河流与湖泊数据

### 3.1 候选数据源决策表

| 来源 | 可提供什么 | 许可证/条款（研究日核验） | 适合本项目的部分 | 不应直接采用的部分 | 几何/事实精度判断 |
| --- | --- | --- | --- | --- | --- |
| [Natural Earth Terms](https://www.naturalearthdata.com/about/terms-of-use/) + [Vector README](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/README.md) | 中国/世界轮廓、低分辨率河流与湖泊、制图属性 | 网站上的矢量/栅格数据为 public domain；README 标明 1:10m、1:50m、1:110m 可自由用于项目。来源不保证无误，建议保留署名。 | 当前中国尺度关系图的底图；优先 1:50m 或 1:110m，静态构建后本地化。 | 城市级定位、历史边界、精确水文连接、争议边界的自动呈现。 | 低/中比例尺概化几何；适合“看中国在哪里”，不适合测距。 |
| [HydroRIVERS](https://www.hydrosheds.org/products/hydrorivers) + [Technical Documentation](https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf) | 全球河流线、上下游拓扑字段（`NEXT_DOWN`、`DIST_UP_KM` 等） | HydroSHEDS License Agreement；产品页允许科研、教育、商业使用但附限制；不得默认整库再分发，需遵守许可与引用要求。 | 构建阶段裁出长江相关河段，验证水系方向和拓扑；只打包裁切/简化派生层。 | 把 `HYRIV_ID` 当作河名；直接把 8.5M 条全球河网塞进前端；把线当作航路。 | 河网/拓扑中高；官方字段没有河名，名称需另行核验。亚洲文件约 91 MB，必须离线裁剪。 |
| [HydroLAKES](https://www.hydrosheds.org/products/hydrolakes) + [Technical Documentation](https://data.hydrosheds.org/file/technical-documentation/HydroLAKES_TechDoc_v10.pdf) | 全球 ≥10 ha 湖泊岸线面、湖泊属性 | CC BY 4.0；技术文档另有“不得未经书面许可把完整原始格式再发布到其他网站”等限制。需署名、保留来源与变更说明。 | 离线提取鄱阳湖面并简化，作为江湖关系图的真实几何底层。 | 发布整个 1.4M 湖泊/820 MB 全球文件；把湖面边缘当作儿童导航或历史疆界。 | 水面面状关系中高；来源混合、比例尺约 1:100k–1:250k（部分更粗），UI 取概略形状。 |
| [HydroBASINS](https://www.hydrosheds.org/products/hydrobasins) + [HydroSHEDS technical docs](https://data.hydrosheds.org/file/technical-documentation/HydroSHEDS_TechDoc_v1_4.pdf) | 分级流域、Pfafstetter 编码、上下游关系 | HydroSHEDS License Agreement；可作为派生产品的一部分使用，禁止把整套数据当独立可下载数据库再分发。 | 后台验证“鄱阳湖—湖口—长江”的流域关系；未来做空间推理。 | 儿童端显示复杂流域编码、直接把流域边界当行政/文化边界。 | 水文拓扑中高；视觉层只保留必要的水系线索。 |
| [geoBoundaries](https://www.geoboundaries.org/) + [repository](https://github.com/wmgeolab/geoBoundaries) | 行政区边界，多级简化文件 | 产品页面为 CC BY 4.0；仓库和单文件 metadata 可能记录上游许可，必须逐文件查看。需要署名与链接。 | 仅作为后台行政地名核对或极淡的省级定位辅助。 | 让省界成为儿童地图主视觉；把现代行政区投射为古代空间；忽略单文件 metadata。 | 行政边界中高（现状）；不是历史边界，也不是河湖几何。 |
| [OpenStreetMap Copyright](https://www.openstreetmap.org/copyright) | 现代道路、POI、河湖及地名 | ODbL 1.0；数据库衍生作品有 share-alike/署名义务。OSM 不提供免费的第三方地图 API/瓦片许可。 | 需要现代 POI 名称时，离线抽取少量要素并审查 ODbL；作为事实交叉核对。 | 在静态页面直接调用公共瓦片、API 或 Nominatim；把众包现状当历史事实；引入大量道路/POI。 | 现代要素可用但质量不一；对儿童地图来说通常过密。 |
| [天地图版权声明](https://guangdong.tianditu.gov.cn/index/page/copyrightNotice.html) + [国家地理信息公共服务平台](https://www.webmap.cn/main.do?method=index1) | 官方底图、地名、水系及公共地理服务目录 | 官方权威不等于开放许可证；内容/数据权利归提供方，服务通常需要 key、条款和合规审查。不得默认抓取、缓存、打包 GeoJSON。 | 作为权威核验/地图审查入口；如生产使用，走官方服务授权和发布审核。 | 把网页瓦片下载后嵌入静态产品；无 key 复制数据；将服务结果再分发为开放 GeoJSON。 | 权威性高，但可再分发性低；当前研究不把它当可直接打包数据源。 |
| [Wikidata Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing) | 稳定实体 ID、坐标、别名、声明引用 | 主命名空间结构化数据 CC0；页面正文等文字通常 CC BY-SA 4.0，许可边界需区分。 | 作为“庐山代表点/现楼代表点”的实体和引用索引，必须保存外部来源、时间和精度。 | 复制页面正文、图片或无引用声明；把单个坐标当官方测量或历史地点。 | 点位可作为中等置信度参考；山体/历史建筑必须降低 precision。 |
| [GeoNames](https://www.geonames.org/about.html) / [export](https://www.geonames.org/export/) | 现代地名、别名、多语言名称、WGS84 点 | GeoNames 数据以 CC BY 4.0 提供，需署名；各下载文件与服务条款仍需核对。 | 作为地名拼写/别名辅助，不承担诗作史实或河流拓扑。 | 不经人工核验直接作为儿童文案；把 GeoNames 点当观景台或古代地点。 | 地名辅助中等；历史地名覆盖不足。 |

### 3.2 推荐的静态构建路线

1. **当前垂直切片**：继续使用少量人工核验的实体与关系，不为两个地点引入远程瓦片、在线地图 API 或全球数据包。
2. **中国轮廓**：离线使用 Natural Earth `1:50m` 或 `1:110m` 几何，固定版本并记录下载提交/文件 hash；只保留需要的中国轮廓和极少量语义层。
3. **长江与鄱阳湖**：构建阶段从 HydroRIVERS/HydroLAKES/HydroBASINS 提取所需要素，拓扑简化后输出小型 GeoJSON；名称由官方资料或人工审校的词典加入，而不是从 HydroRIVERS ID 猜名。
4. **投影与绘制**：D3-geo + SVG/Canvas 足够完成静态、北向上、可访问文本替代的关系图。GeoJSON 遵守 RFC 7946 与 WGS84 `[longitude, latitude]`；检查多边形 winding order、反经线和无效几何。
5. **发布包**：每个派生文件带 `sourceUrl`、`sourceLicense`、`retrievedAt`、`sourceVersion`、`transform`、`attribution`；仓库保存 NOTICE/许可文本。对 HydroSHEDS、OSM、geoBoundaries 等按各自条款处理，不能以“都是 GeoJSON”混同许可证。
6. **中国地图合规**：公开发布含中国轮廓/重要地理信息的地图前，进行最新法规、数据来源、地图审查与发布地域要求的复核。当前用关系示意图时，应避开无必要的省界、争议边界和未经审查的精确行政表现。

### 3.3 不可由数据自动生成的事实

- 数据点不能自动证明“李白到过这里”“诗在这里写成”或“这是诗中瀑布”。
- 水系线不能自动变成古代交通线、诗人路线或推荐路线。
- 现楼坐标不能自动变成历史楼址坐标。
- 行政边界不能自动代表唐代行政区、文化区域或作品语境。
- 开放许可证不能替代数据质量、地图审查、儿童可读性和来源引用。

## 4. 渲染库、叙事地图项目与采用边界

| 项目 | 许可证/能力 | 适合本项目的用途 | 不应直接采用 |
| --- | --- | --- | --- |
| [D3-geo](https://d3js.org/d3-geo) / [GitHub](https://github.com/d3/d3-geo) | ISC；提供球面 GeoJSON 投影、path/stream、SVG/Canvas 几何处理，不提供数据。 | 静态中国轮廓、江湖关系图、确定性的自定义儿童视觉；可在正常 DOM 文档流旁提供文字关系。 | 把投影库当数据源；忽略 GeoJSON RFC 7946 与 D3 spherical winding-order 注意事项；用投影结果暗示测绘精度。 |
| [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js) / [GeoJSONSource API](https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/) | MapLibre 代码 BSD-3-Clause，另含第三方 notices；浏览器/WebView GPU 矢量地图，支持 GeoJSONSource、相机和数据驱动图层。 | 未来地点/图层大幅增加、需要连续相机、矢量瓦片、许多关系时；版本固定、自托管样式/数据。 | 当前两地点切片直接引入公开瓦片或“latest”；把交互地图当儿童必须操作的工具；遗漏第三方许可、归因、网络失败和可访问替代。 |
| [MapLibre Storymaps](https://github.com/opengeos/maplibre-gl-storymaps) | MIT；以章节驱动地图镜头的参考实现。 | 研究“同一地图在章节间保持连续”的叙事模式。 | 直接复制滚动运行时；让滚动、镜头动画或地图手势支配诗歌阅读；未审查其依赖与生产可访问性。 |
| [Knight Lab StoryMapJS](https://github.com/NUKnightLab/StoryMapJS) | 主项目 MPL-2.0；仓库还包含第三方瓦片/资源归因（历史版本中含 Stamen、OSM 等条款）。 | 研究“地点章节 + 叙事上下文”结构。 | 直接复用打包瓦片/资源或运行时而不逐项保留许可；把儿童体验变成滚动叙事播放器。 |
| [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) | Public domain 数据；小比例尺概化制图。 | 底图几何与制图属性。 | 误当成城市级或历史级测绘资料；不检查边界表示与数据版本。 |

MapLibre 的 BSD-3-Clause 允许改作与发布，但其发行包的第三方代码/许可通知仍须随发布包保留。D3-geo 的 ISC 只覆盖代码许可，不覆盖输入 GeoJSON 的数据许可。库的“能画出来”不等于数据“能发布”，更不等于事实“已核验”。

## 5. CHGIS 与历史地理：借模型，不直接装数据

[CHGIS Database Design](https://chgis.fas.harvard.edu/pages/database/) 的价值主要在数据模型：历史行政单元以时间序列记录，名称、边界、类型和隶属关系发生变化时建立新的有效时间实例；行政辖区多边形与治所点分开；来源注释、编辑者、坐标与底图 provenance 单独保存。

[CHGIS V6](https://chgis.fas.harvard.edu/data/chgis/v6/) 明确写出“free for academic research”，禁止商业使用、转售或再分发；CHGIS 页面还说明来源注释/评注的版权归研究者与 CHG，复用需直接取得许可。因此：

- **可以借鉴**：`validTime`、`nameVariants`、`geometryKind`、`point vs region`、`partOf`、`sources`、历史实例与不确定性字段。
- **不能直接做**：把 CHGIS V6 的 shapefile/CSV、来源注释或历史行政面打包进儿童产品；把古代行政面作为李白站立点、瀑布位置或现代旅行地图。
- **若未来需要**：先获得明确的商业/再分发授权，再逐条核验古今地名对应关系；公开 UI 中仍应显示“历史推定/证据层级”，而不是默认确定坐标。

CHGIS 数据模型论文中关于“替换一条空间实例、保留有效时间和 source”的设计，可直接影响本项目的概念数据合同；许可和事实判断不可因此被省略：

https://chgis.fas.harvard.edu/work/docs/papers/v2_chgis_data_model.pdf

## 6. 儿童空间学习与叙事地图的可用 intelligence

### 6.1 研究结论

| 来源 | 研究 intelligence | 对本项目的直接含义 |
| --- | --- | --- |
| [National Geographic · Spatial Thinking K–5 Full Report](https://media.nationalgeographic.org/assets/file/SpatialThinkingK-5FullReport.pdf) | K–5 空间思维不是“好玩的软件”本身，而是空间概念/关系、表示工具与空间推理的组合；资源要围绕这些学习目标设计。 | 每个状态只引入少量关系：所在区域、江湖相邻、一个方向/距离；不让闪烁、缩放、图层管理成为学习目标。 |
| [National Academies · Learning to Think Spatially](https://www.nationalacademies.org/read/11019) | 空间思维由空间概念、表示工具、推理过程构成；不同媒介都可表达关系，但工具要服务思考。 | 同一地理状态用地图、文字、朗读和问题互相校验；始终提供线性文本替代，避免“只看图才懂”。 |
| [Abel & Kulhavy, AERJ (1986)](https://doi.org/10.3102/00028312023002263) | 与文章内容逻辑组织的图示有助于儿童记住与图示直接相关的文本；地图不是装饰，布局/关系会影响理解。 | 江、湖、山的相对位置须跟文案一致；无关景点、装饰和 AI 卡片不能挤占诗或改变关系。 |
| [Jirout, 2014, Mind, Brain, and Education](https://doi.org/10.1111/mbe.12048) | 幼儿使用地图和尺度化地图解决迷宫的能力与空间缩放表现相关；这是“适度操作/游戏可支持空间能力”的证据，不是要求产品变成 GIS。 | 若以后教距离，用简单比较/比例提示和熟悉对象做 scaffold；当前显示“约 195 公里”时不追加伪精确旅行时间。 |
| [Liben, 2017, maps in children’s literature](https://doi.org/10.1075/clcc.7.02lib) | 儿童不会自动读懂地图中的尺度、方向、象征与视角；文学地图的使用需要明确教学语境。 | 每次地图出现都给“你现在看的是中国/江湖/地点”标签；不要假设孩子理解投影、北向上或曲线箭头。 |

以上论文/报告用于产品研究，不把受版权保护的全文、图表或图片复制到产品；confidence 表示研究结论对设计判断的可信度，不表示数据许可证。

### 6.2 推荐的叙事节奏

把空间体验拆成“看见—找到—比较—说出—记住”五个动作，每个动作只有一个主要问题：

1. **看见（World）**：完整中国轮廓和极少量江河语境；孩子知道“这是中国的哪一片”。
2. **找到（Lens）**：镜头缩到长江—鄱阳湖—九江—庐山；文本说明当前尺度，不要求孩子拖动地图。
3. **比较（Reading / spatial cue）**：诗页旁或诗页之后出现不遮挡的单一问题，如“庐山的北边是什么水？”；诗句仍是首要阅读对象。
4. **说出（AI / answer）**：AI 提问在正常文档流、底部或下一阶段出现；不作为悬浮客服面板盖住诗；输入和键盘状态必须保留诗的可回看路径。
5. **记住（Memory / next place）**：完成后地图再展开，显示“黄鹤楼在西北、约 195 公里”；明确是今天的空间关系，不把线画成李白脚印。

这是一种 interaction architecture 原则，不是要求每个状态都显示地图：阅读状态可以让地图退居为小型、非交互空间锚；任何 secondary interaction 都必须在诗文 bounding box 外。

### 6.3 空间与 AI 的架构边界

- AI 是引导者，不是浮在 Primary Content 之上的常驻窗口。
- 提问、回答、解释和下一站采用 progressive disclosure；一次只出现一个 secondary task。
- 诗句的汉字、拼音、标点和朗读控件应有独立阅读区域；地图/AI 与它们共享状态但不共享遮挡层。
- 手机键盘出现时，使用 visual viewport 重新排布回答区；诗句必须可以向上滚动回看，不能被输入面板固定盖住。
- 矮屏时先折叠说明和装饰层，再压缩空间锚；不缩小诗字到不可读。
- 触控地图只做“选一个地点/看一层关系”，不要求儿童连续拖拽、旋转、缩放或管理图层。

## 7. 概念数据合同（不绑定实现）

### 7.1 Entity

```json
{
  "id": "lushan",
  "name": "庐山",
  "alternateNames": [],
  "type": "mountain",
  "geometry": { "type": "Point", "coordinates": [115.973333, 29.5725] },
  "geometryKind": "representative_point",
  "coordinateSource": "https://www.wikidata.org/wiki/Q622616",
  "precision": "mountain_representative_point",
  "confidence": "medium",
  "validTime": { "kind": "contemporary_reference", "asOf": "2026-09-01" },
  "sources": [],
  "disputes": [],
  "uiRole": "regional_anchor"
}
```

要求：

- `geometryKind` 必须区分 `point`、`representative_point`、`region`、`current_building`、`historical_candidate`、`unknown`。
- `precision` 描述“这个坐标能支持什么”，而不是给坐标附带虚假的米级精度。
- `validTime` 分开现代地点、现楼和历史候选；没有证据时写 `unknown`。
- `sources[]` 每条写 `url`、标题、支持的 claim、检索日、许可/使用限制。
- `disputes[]` 保存“多个观点存在”的事实，不让生成模型在缺字段时补一个答案。

### 7.2 Relation

```json
{
  "id": "lushan-to-yellow-crane",
  "from": "lushan",
  "to": "yellow-crane",
  "type": "present_day_spatial_relation",
  "validTime": { "kind": "contemporary_reference", "asOf": "2026-09-01" },
  "distance": {
    "valueKm": 194.33939880503263,
    "method": "haversine",
    "display": "约195公里（直线距离）",
    "precision": "representative_point_geodesic_5km"
  },
  "direction": {
    "bearingDegrees": 304.303137940724,
    "display": "西北方向，略偏西",
    "basis": "initial_bearing_from_representatives"
  },
  "hydrology": {
    "display": "相对九江，在长江更靠上游的一侧",
    "notAPath": true
  },
  "historicalRoute": { "status": "unknown", "notModeled": true },
  "confidence": "medium",
  "sources": []
}
```

关系类型建议至少区分：

- `hydrological_connection`：江、湖、流域之间的水文关系。
- `regional_context`：山、城、江、湖的当代区域关系。
- `present_day_spatial_relation`：代表点之间的现代距离/方位。
- `cultural_association`：作品、人物、地点的文化关联，需证据等级。
- `historical_route`：只有来源明确、时间有效、路线证据足够才允许；本切片为 `unknown`。

## 8. Evaluator 应如何从“截图没报错”升级

### 8.1 必须自动检查的项目

每个状态、视口和输入阶段至少检查：

- **Primary Content Visibility**：诗题、作者、四句汉字、拼音（若开启）完整存在且不被裁切。
- **Occlusion**：AI、提示、按钮、地图、输入面板的可见 bounding box 与诗文/拼音 bounding box 不得重叠；必要时用 `elementFromPoint` 取样验证真实层级。
- **Reading Comfort**：正文有足够行高、字高、对比度与左右留白；不靠缩小字体来“塞进首屏”。
- **Information Hierarchy**：当前状态只有一个 primary task；下一站/历史说明/证据层不抢主视觉。
- **Text Legibility**：中文、拼音声调、标点和换行不重叠；系统字体 fallback 后仍不横向溢出。
- **Touch / Input Interference**：触控目标至少约 48 px；AI 输入聚焦、键盘弹出后，诗仍可滚动回看；没有透明层截获 marker 点击。
- **Child Cognitive Load**：地图层、地点标签、问题和操作数量有上限；需要人工 review，不能只依赖 console 或 layout pass。
- **Spatial Semantics**：北向、相对位置、上下游、距离单位与来源一致；不把水系线显示成历史路线。
- **Historical Boundary**：现楼/现代坐标与古代地点、作年、诗人路线分离；缺证据的字段必须是 `unknown` 而不是猜测。
- **Responsive states**：桌面、平板、390×844、矮屏；提问前、提问后、输入聚焦、键盘、完成态分别截图。

### 8.2 半自动规则建议

```text
for each viewport/state:
  assert poem.visibleLines === 4
  assert every poemLine.clientRects.length > 0
  assert overlap(secondaryRects, poemAndRubyRects) === 0
  assert noHorizontalOverflow(document)
  assert focusedInput.isReachableInVisualViewport()
  assert map.labelCount <= configuredChildLayerBudget
  assert relation.notAnHistoricalRoute === true
  assert distance.display contains "直线"
  assert every entity has precision/confidence/validTime/sources
```

自动规则只报告“是否遮挡、是否溢出、是否缺来源”；“地图是否让孩子理解”“文字是否过密”“视觉隐喻是否造成误读”仍需有人在真实设备上主动 critique。

## 9. 决策清单：采用 / 暂缓 / 禁止

### 采用

- 当代地理事实与历史/文学解释分层；每个点都带有效时间、精度、置信度和来源。
- Natural Earth 低分辨率公版轮廓作为未来静态总览底图。
- HydroSHEDS 离线裁切的江湖几何作为未来真实水系层，名称由人工核验词典补齐。
- D3-geo + SVG/Canvas 作为轻量静态渲染路线；给地图旁边提供线性文本关系。
- “西北方向 + 约 195 公里（直线距离）+ 上游一侧（相对九江）”的带免责声明表达。
- “庐山的瀑布”“作年有不同说法”“历史路线未知”等安全文案。

### 暂缓

- MapLibre GL JS：等地点数量、图层和相机连续性真正需要时再引入。
- StoryMapJS/MapLibre Storymaps：只借鉴章节/镜头模式，不把完整运行时放进当前切片。
- geoBoundaries/OSM：仅在行政/现代 POI 需求明确且完成许可证、归因与地图合规后使用。
- CHGIS：只借鉴历史时间序列 schema；商业/再分发授权前不进入构建产物。

### 禁止

- 在线公共瓦片/API 未审查就嵌入静态产品。
- 用代表点生成李白路线、古代楼址、瀑布站立点或水路距离。
- 用“精确到米”的坐标、曲线箭头、脚印或船线制造未经证实的历史叙事。
- 用 AI 自动 character-to-place、character-to-pinyin 或 title-to-route 推断地理史实。
- 把 secondary interaction 叠在诗、拼音、朗读或输入控件上。

## 10. 来源注册表（license / retrieved / confidence / precision）

除特别说明外，以下页面均按 `retrieved: 2026-09-01` 记录。网页内容、数据版本和许可可能变化；真正发布时应锁定下载版本/hash并再次审查。

### 10.1 地理事实

| ID | URL | 内容/许可 | confidence | precision 建议 |
| --- | --- | --- | --- | --- |
| GEO-01 | https://whc.unesco.org/document/217255 | UNESCO 庐山提名/档案；官方出版物，未假定开放数据许可；用于事实引用，不复制整页素材。 | high | 区域景观关系；非观景点坐标。 |
| GEO-02 | https://whc.unesco.org/en/list/778/ | UNESCO 世界遗产条目；官方页面，未假定开放数据许可。 | high | 庐山世界遗产/区域语境。 |
| GEO-03 | https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html | 庐山政府概况；官方页面，未假定开放数据许可。 | medium_high | 行政/旅游语境交叉核验。 |
| GEO-04 | https://www.lushan.gov.cn/zwgk_194695/zfxxgkzl_194696/fdzdgknr_194705/ghxx/fzgh/202112/t20211210_5336539.html | 庐山地方规划/水系语境；官方页面，未假定开放数据许可。 | medium_high | 区域系统背景，不做坐标源。 |
| GEO-05 | https://www.wuhan.gov.cn/ztzl/25zt/qiao/whzjdq/index.shtml | 武汉市政府；明确“黄鹤楼位于长江南岸蛇山峰岭”。官方页面，未假定开放数据许可。 | high | 现址区域关系。 |
| GEO-06 | https://www.fohb.gov.cn/info/2022-08/20220810161400_204.html | 湖北省政府资料；蛇山、临江、现楼与历史旧址距离/重建语境。官方页面，未假定开放数据许可。 | high | 现楼与旧址分离；不生成历史点。 |
| GEO-07 | https://wlt.hubei.gov.cn/bmdt/ztzl/zshb/201912/t20191226_1799611.shtml | 湖北文旅资料；黄鹤楼在长江南岸、蛇山西端的文化地理叙述。官方页面，未假定开放数据许可。 | high | 文化地理背景。 |
| GEO-08 | https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_1241541.html | 武昌区政府；现楼重建与武昌/蛇山语境。官方页面，未假定开放数据许可。 | medium_high | 现址区域交叉核验。 |
| GEO-09 | https://www.wikidata.org/wiki/Q622616 | Wikidata 庐山实体与坐标；结构化数据 CC0，页面文字另按 Wikidata Licensing 处理。 | medium | `[115.973333,29.5725]` 仅作山体代表点。 |
| GEO-10 | https://www.wikidata.org/wiki/Q462372 | Wikidata 黄鹤楼实体与当前建筑坐标；结构化数据 CC0，页面文字另按 Wikidata Licensing 处理。 | medium_high | `[114.296944,30.546944]` 仅作现楼建筑点。 |
| GEO-11 | https://cjjjd.ndrc.gov.cn/zoujinchangjiang/jingjishehuifazhan/201907/t20190713_941469.htm | 国家发展改革委长江流域资料；官方页面，未假定开放数据许可。 | high | 长江总体流向/流域背景。 |
| GEO-12 | https://cjjjd.ndrc.gov.cn/gongzuodongtai/yanjiangyaowen/hubei/201911/t20191121_1204283.htm | 国家发展改革委湖北沿江资料；武汉处于长江中游、河流总体西东向语境。官方页面，未假定开放数据许可。 | high | 上下游相对提示，非路线。 |
| GEO-13 | https://cjjjd.ndrc.gov.cn/gongzuodongtai/yanjiangyaowen/jiangxi/202107/t20210722_1292248.htm | 国家发展改革委江西沿江资料；鄱阳湖/湖口/长江关系语境。官方页面，未假定开放数据许可。 | medium_high | 水文关系背景。 |
| GEO-14 | https://www.jxrd.gov.cn/system/2012/05/28/011994183.shtml | 江西人大水系资料；鄱阳湖汇集多水系并经湖口入长江。官方页面，未假定开放数据许可。 | high | 鄱阳湖—湖口—长江关系。 |
| GEO-15 | https://www.ccdi.gov.cn/lswhn/shijian/202007/t20200724_29707.html | 中央纪委文化资料；鄱阳湖经湖口入长江的历史地理叙述。官方页面，未假定开放数据许可。 | medium_high | 交叉核验，不作几何源。 |

### 10.2 开放/受限空间数据与库

| ID | URL | 内容/许可证 | confidence | precision / 发布建议 |
| --- | --- | --- | --- | --- |
| DATA-01 | https://www.naturalearthdata.com/about/terms-of-use/ | Natural Earth Terms：数据 public domain；无强制署名，但建议 credit；有精度/准确性免责声明。 | high | 1:50m/1:110m 总览；不可作城市级测量。 |
| DATA-02 | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/README.md | Natural Earth Vector README：1:10m/1:50m/1:110m、面向小比例尺制图、可自由用于项目。 | high | 锁定 release/commit；保存数据版本。 |
| DATA-03 | https://www.hydrosheds.org/products/hydrorivers | HydroRIVERS；HydroSHEDS License Agreement，允许范围与限制见协议。 | high | 离线裁切长江；不得整库前端发布。 |
| DATA-04 | https://data.hydrosheds.org/file/technical-documentation/HydroRIVERS_TechDoc_v10.pdf | HydroRIVERS 技术文档；字段、WGS84、无河名字段等。 | high | 用拓扑/距离字段，名称另核。 |
| DATA-05 | https://www.hydrosheds.org/products/hydrolakes | HydroLAKES；CC BY 4.0，产品页给出全球规模与用途。 | high | 离线裁切鄱阳湖，带署名和变更说明。 |
| DATA-06 | https://data.hydrosheds.org/file/technical-documentation/HydroLAKES_TechDoc_v10.pdf | HydroLAKES 技术文档；混合来源、WGS84、字段和全量格式再分发限制。 | high | 不发布全量原始格式；只发布合法派生。 |
| DATA-07 | https://www.hydrosheds.org/products/hydrobasins | HydroBASINS；HydroSHEDS License Agreement，提供分级流域/拓扑。 | high | 后台验证水文关系；UI 不显示编码。 |
| DATA-08 | https://data.hydrosheds.org/file/technical-documentation/HydroSHEDS_TechDoc_v1_4.pdf | HydroSHEDS 技术文档/Appendix A；允许的派生/分发范围、引用和无担保条款。 | high | 发布前让法务/合规复核派生包。 |
| DATA-09 | https://www.geoboundaries.org/ | geoBoundaries；产品 CC BY 4.0，需署名和链接。 | high | 仅行政辅助；逐文件检查上游 metadata。 |
| DATA-10 | https://github.com/wmgeolab/geoBoundaries | geoBoundaries 仓库；README/metadata 可能混有上游许可与数据级说明。 | medium_high | 不因仓库许可而跳过单文件核验。 |
| DATA-11 | https://www.openstreetmap.org/copyright | OSM；ODbL 1.0，文档 CC BY-SA 2.0；无免费第三方瓦片/API保证。 | high | 只在自托管/离线合规方案明确后使用。 |
| DATA-12 | https://guangdong.tianditu.gov.cn/index/page/copyrightNotice.html | 天地图版权/使用说明；官方内容权利与使用条件，不是开放数据许可。 | high | 权威核验/授权入口，禁止未经许可抓取打包。 |
| DATA-13 | https://www.webmap.cn/main.do?method=index1 | 国家地理信息公共服务平台目录；具体数据、下载与条款按产品核验。 | medium_high | 作为目录/标准数据入口，不默认 GeoJSON 可再分发。 |
| DATA-14 | https://www.wikidata.org/wiki/Wikidata:Licensing | Wikidata：结构化数据 CC0；页面正文/媒体的许可不同，需区分。 | high | 只取结构化声明与外部引用；保存 revision/source。 |
| DATA-15 | https://www.geonames.org/about.html | GeoNames；数据 CC BY 4.0，需署名。 | medium_high | 仅现代地名/别名辅助，不作历史事实源。 |

### 10.3 历史、文学与学习研究

| ID | URL | 内容/许可证 | confidence | precision / 使用边界 |
| --- | --- | --- | --- | --- |
| HIST-01 | https://chgis.fas.harvard.edu/pages/database/ | CHGIS 数据库设计；时间序列、valid dates、名称/边界/隶属变化；学术资料，未假定数据开放。 | high | 借 schema，不复制数据/来源注释。 |
| HIST-02 | https://chgis.fas.harvard.edu/data/chgis/v6/ | CHGIS V6；明确学术研究免费，禁止商业使用、转售、再分发。 | high | 不进产品构建产物。 |
| HIST-03 | https://chgis.fas.harvard.edu/work/docs/papers/v2_chgis_data_model.pdf | CHGIS 数据模型论文；点/面、时间实例、别名与来源建模。 | high | 借鉴字段与不确定性。 |
| POEM-01 | https://ir.pku.edu.cn/handle/20.500.11897/581009 | 北大机构库论文；异文、真伪与优劣讨论。出版物内容受其权利约束。 | high | 证明存在版本讨论，不锁定单一历史答案。 |
| POEM-02 | https://epaper.gmw.cn/zhdsb/html/2016-04/20/nw.D110000zhdsb_2016-04-20_2-05.htm | 《中华读书报》；香炉峰/瀑布位置的学术文化讨论。 | medium | 证明位置有争议，不生成观景点。 |
| POEM-03 | https://m.thepaper.cn/newsDetail_forward_16725758 | 澎湃文章；编年、题名与瀑布指认材料的整理。 | medium | 只做线索与交叉阅读，不当唯一证据。 |
| POEM-04 | https://www.pep.com.cn/xw/zt/hd/ywsd/sfsd/2s/201901/t20190103_1934779.shtml | 人教相关教学文本页面；文本编辑参考，非历史地理证据；未假定开放数据许可。 | medium_high | 作为当前儿童版底本；异文另记。 |
| LEARN-01 | https://media.nationalgeographic.org/assets/file/SpatialThinkingK-5FullReport.pdf | National Geographic K–5 空间思维报告；研究出版物，未假定可再分发许可。 | high | 设计原则：空间概念/关系/表示/推理。 |
| LEARN-02 | https://www.nationalacademies.org/read/11019 | National Academies 报告；版权页标明著作权，研究引用。 | high | 工具服务空间推理，不复制全文/图表。 |
| LEARN-03 | https://doi.org/10.3102/00028312023002263 | AERJ 研究论文；出版社版权/访问条款。 | medium_high | 图示与文章关系需逻辑一致。 |
| LEARN-04 | https://doi.org/10.1111/mbe.12048 | Jirout (2014)；研究论文，出版社版权/访问条款。 | medium_high | 适度尺度游戏可作为后续假设，不等于必须 GIS 化。 |
| LEARN-05 | https://doi.org/10.1075/clcc.7.02lib | Liben (2017)；学术章节，出版社版权/访问条款。 | high | 儿童不会自动读懂尺度/符号/视角，需显式引导。 |

### 10.4 项目与许可证

| ID | URL | 许可证 | 采用边界 |
| --- | --- | --- | --- |
| LIB-01 | https://github.com/maplibre/maplibre-gl-js | BSD-3-Clause；发行包含第三方 notices。 | 未来复杂地图可用；当前切片暂缓。 |
| LIB-02 | https://raw.githubusercontent.com/maplibre/maplibre-gl-js/main/LICENSE.txt | BSD-3-Clause 及第三方许可文本。 | 发布时保留 notices。 |
| LIB-03 | https://d3js.org/d3-geo | ISC。 | 适合静态投影/路径；不提供数据。 |
| LIB-04 | https://github.com/opengeos/maplibre-gl-storymaps | MIT。 | 借鉴章节/镜头，不直接套运行时。 |
| LIB-05 | https://github.com/NUKnightLab/StoryMapJS | MPL-2.0，仓库还需处理第三方资源归因。 | 只研究叙事模式；不得无审计复制瓦片/依赖。 |

## 11. 发布前的事实与合规闸门

在把真实中国轮廓/河湖 GeoJSON 或历史叙事加入公开产品前，必须重新完成：

1. 锁定源数据版本、下载日期、hash、裁切/简化脚本与输出文件。
2. 逐文件确认 license、attribution、share-alike、禁止独立再分发等条件。
3. 核验中国地图公开发布适用的最新地图管理/审查要求；[国务院《地图管理条例》](https://www.gov.cn/zhengce/zhengceku/2015-12/14/content_10403.htm) 只能作为法规入口，不是本文件的法律意见。
4. 对 Natural Earth/OSM/geoBoundaries 的边界表示做人工 review，避免把未经处理的争议边界呈现为产品立场。
5. 对长江、鄱阳湖、湖口、九江、武汉、蛇山、黄鹤楼逐项做“地名—几何—有效时间—来源”核对。
6. 对儿童端做真实桌面、平板、390×844、矮屏、键盘和完成态验收；任何 secondary layer 与诗/拼音 bounding box 有交集即失败。
7. 最后做主动 critique：孩子能否在不操作地图的情况下说出“我在哪里、旁边有什么、下一处在哪个方向”；若不能，减少层和文案，而不是再叠加 AI 提示。

本轮研究的底线是：**事实先于镜头，关系先于装饰，孩子读诗先于地图操作，证据不足就明确说不知道。**
