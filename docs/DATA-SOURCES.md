# 数据源与 Provenance 决策（2026-09-01）

本页的课程、诗文与空间数据记录统一于 **2026-09-01** 检索/核验。项目把“来源许可”和“事实可信度”分开记录：许可决定能否随包分发，`confidence`/`disputes` 决定孩子端能说到什么程度。

## 当前结论

项目不把几十万首母库打包进儿童端。构建阶段以明确许可证的语料作候选召回，运行时只发布 100 首学习目录；其中 10 首是人工完成的 Gold Standard。Natural Earth 50m 的中国轮廓、河流与湖泊几何已转换成项目内静态资产。它是一张用于中国—区域尺度认知的真实地理骨架，不是导航地图，也不依赖在线瓦片或第三方地图账号。

课程框架采用 6-3 学制、2024 修订统编小学/初中语文（逐年换用）与 2023 统编高中五册。教育部目录只证明书系与版本框架；单首诗的年级/学期必须另有逐项证据。当前有 100 条明确标记的 `candidate` 和 34 条由人教社逐项目录或官方教材选篇文章支持的 `source-verified` 历史教材声明。具体边界见 [`CURRICULUM-CONCEPT-SYSTEM.md`](./CURRICULUM-CONCEPT-SYSTEM.md) 与 [`research/corpus-source-report.md`](./research/corpus-source-report.md)。

当前数据组合为：

- [Wikidata](https://www.wikidata.org/wiki/Wikidata:Licensing)：CC0 结构化实体、别名、坐标、外部 ID 和声明引用。
- [GeoNames](https://www.geonames.org/export/)：CC BY 4.0 的现代地名、WGS84 坐标与多语言名称。
- [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/)：公版、低精度底图，适合世界/中国尺度的原型。
- [D3-geo](https://github.com/d3/d3-geo)：BSD-3-Clause 地理投影与路径生成库；它是构建工具依赖，不是地图数据来源。
- [chinese-poetry](https://github.com/chinese-poetry/chinese-poetry)：仅作为诗文候选索引，不作为权威版本、人物消歧或地点关系来源。
- [教育部 2024 年义务教育国家课程教学用书目录](https://www.moe.gov.cn/srcsite/A26/s8001/202408/W020250418502592948423.pdf)：小学/初中 2024 修订书系与过渡框架，不直接证明单首诗归属。
- [教育部 2023 年普通高中国家课程教学用书目录](https://www.moe.gov.cn/srcsite/A26/s8001/202305/t20230506_1058493.html)：高中五册书系框架。
- 人教社一年级上、二年级上、七年级上下、八年级上和高中必修上逐项目录页，以及2019统编小学教材选篇官方文章：当前 34 条 item-level 教材声明的直接证据；未写明课内/课外位置的条目保持 `unspecified`，有效期与新版继承关系分开记录。

OpenStreetMap 可在需要现代 POI/道路/水系时评估，但必须遵守 ODbL、署名及 API/瓦片使用政策。CHGIS、CBDB 等高价值历史数据目前存在非商业或独家商业授权限制，只用于研究核对，不打包进产品。

## 关键数据源判断

| 数据源 | 许可与覆盖 | 现阶段用途 | 主要边界 |
| --- | --- | --- | --- |
| [chinese-poetry](https://github.com/chinese-poetry/chinese-poetry) | 仓库顶层 MIT；约 5.5 万唐诗、26 万宋诗、2.1 万宋词 | 发现候选文本 | README 称数据来自互联网且采集过程未完整记录；不能假定所有现代整理均已授权；文本有错误、繁简转换和同名作者风险 |
| [Wikidata](https://www.wikidata.org/wiki/Wikidata:Licensing) | 结构化数据 CC0 | 稳定实体 ID、别名、坐标、外部引用 | 单条声明质量不一，必须检查引用与修订版本；不复制百科正文 |
| [GeoNames](https://www.geonames.org/about.html) | CC BY 4.0；约 1,200 万地理要素 | 现代坐标、别名、多语言名称 | 历史地名不系统；社区数据按现状提供，必须署名 |
| [Natural Earth](https://www.naturalearthdata.com/downloads/) | 公版；1:10m / 1:50m / 1:110m | 低精度底图 | 不适合城市级精度或历史行政关系 |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | ODbL 1.0 | 未来的现代 POI、道路和水系 | 署名、衍生数据库及公共服务使用政策需单独设计 |
| [CHGIS V6](https://chgis.fas.harvard.edu/data/chgis/v6/) | 免费学术研究；禁止商业使用、转售和再分发 | 历史行政地理研究核对 | 许可证不允许直接进入商业产品；中国境内使用还有额外许可要求 |
| [CBDB](https://cbdb.hsites.harvard.edu/coverage-cbdb) | 学术分支 CC BY-NC-SA；中国大陆商业使用另有独家授权 | 人物生平/地址/关系研究核对 | 不直接用于商业产品；来源记录可能保留互相矛盾的断言 |
| [国家地名信息库](https://app.gjzwfw.gov.cn/jmopen/webapp/html5/lsdmcx/index.html) | 官方未给出开放数据许可 | 标准地名与历史地名人工核对 | 不默认允许批量下载、缓存或再分发 |
| [World Historical Gazetteer](https://whgazetteer.org/licenses/) | 聚合层 CC BY-NC；上游各自保留许可 | 历史地名发现与 reconciliation 研究 | 商业使用和每个上游源需分别审核 |
| [Chinese Text Project](https://ctext.org/faq) | 站内内容许可不统一 | 文本、段落与来源核对 | 不复制未确认授权的翻译、注释或整库内容 |

## 本轮 Spatial System 的实际数据包

### Natural Earth 50m（底图几何）

构建脚本 [`scripts/build-map-data.mjs`](../scripts/build-map-data.mjs) 每次运行时从 Natural Earth 官方 S3 下载并解压以下三个 ZIP 到临时目录：

- [50m admin-0 countries](https://naturalearth.s3.amazonaws.com/5.1.2/50m_cultural/ne_50m_admin_0_countries.zip)：筛出中国国界轮廓，生成北向上的 `landPath`。
- [50m rivers lake centerlines](https://naturalearth.s3.amazonaws.com/5.1.2/50m_physical/ne_50m_rivers_lake_centerlines.zip)：筛出中国范围内有名称的河流线。
- [50m lakes](https://naturalearth.s3.amazonaws.com/5.1.2/50m_physical/ne_50m_lakes.zip)：筛出中国范围内有名称的湖泊面。

Natural Earth 许可页明确其数据为 public domain，项目只提交生成后的轻量 JSON，不提交 ZIP、SHP 或 DBF。50m 是中国整体方向感的概略尺度，不用于城市级导航或历史边界判断。Natural Earth 可能省略或简化鄱阳湖；因此产品保留人工核验的鄱阳湖代表点，但不凭空补画湖面多边形。

生成资产：[`content/generated/china-physical-map.json`](../content/generated/china-physical-map.json)。它包含 `viewBox`、`layers.landPath/rivers/lakes`、`scopes.china/middleYangtze/lushan` 和由同一投影计算的 `projectedEntities`。

### D3-geo（投影与 SVG path）

[D3-geo](https://github.com/d3/d3-geo) 按 BSD-3-Clause 发布。本项目仅使用 `geoMercator`、`geoPath` 与 `geoBounds` 做一次性构建，不把 d3-geo 的代码或许可混写成地理事实；运行时页面只读取生成的 JSON。

### Wikidata（实体身份与 CC0）

[Wikidata Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing) 将结构化数据按 CC0 提供。本轮只把稳定实体链接用于身份/坐标上下文核对（例如[庐山](https://www.wikidata.org/wiki/Q622616)、[黄鹤楼](https://www.wikidata.org/wiki/Q462372)、[李白](https://www.wikidata.org/wiki/Q497)），不复制百科正文。单条声明仍需保留来源与人工复核，不因为 CC0 就自动视为正确。

### 官方地理与历史来源

- [UNESCO 庐山国家公园](https://whc.unesco.org/en/list/778/)及[提名档案](https://whc.unesco.org/document/217255)：庐山所处九江、长江北侧/鄱阳湖南侧的区域语境与遗产参考。
- [庐山市人民政府·庐山概况](https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html)：行政与历史名称上下文。
- [武汉市园林和林业局·黄鹤楼](https://ylj.wuhan.gov.cn/zwgk/zwxxgkzl_12298/jggk_12304/xsdwszjzz_12308/202001/t20200110_726398.shtml)及[武昌区人民政府·黄鹤楼](https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_3624646.html)：当前建筑/现址、1985 年重建及长江语境。
- [国家发展改革委·长江流域](https://cjjjd.ndrc.gov.cn/zoujinchangjiang/jingjishehuifazhan/201907/t20190713_941469.htm)：长江水系的现代区域语境。

上述官方页面没有被当作“开放数据许可”直接转售。产品只保留必要的事实摘要、来源链接与检索日期；来源许可未明确时，`license` 使用 `source-defined`，不作 CC0 或 public domain 推断。

### 现代城市级出发点

宁波、北京、成都、广州、上海仅作为可选的城市级空间参照，使用近似市中心坐标，精度标为 `city_center_approximation`、置信度标为 `medium`。数据层规定 UI 只能存城市 ID：不读取 GPS、不保存地址、可以跳过并可以清除。城市数据的坐标上下文来自 [GeoNames](https://www.geonames.org/about.html)，其许可为 CC BY 4.0；页面若展示归因，需保留 GeoNames 署名。

## 可复现检查

```bash
npm run build:map
npm run check
```

`check-spatial-system.mjs` 会核验实体类型与几何 position kind、来源 URL/许可/validTime、关系端点和关系类型、庐山—黄鹤楼的 Haversine 距离/方位、上下游措辞与历史路线免责声明，以及生成地图的路径、投影实体相对位置和三个 scope。它不会把人工艺术性或儿童理解程度伪装成自动化通过。

## 最小内容记录

每个“地点—作品”锚点至少保留：

```json
{
  "placeId": "stable external or project id",
  "placeNameCurrent": "",
  "placeNameHistorical": "",
  "coordinates": null,
  "coordinateSource": null,
  "poemTitle": "",
  "authorDisplay": "",
  "textOriginal": [],
  "relationType": "title_named_place",
  "evidenceSourceUrl": "",
  "confidence": "verified",
  "verificationStatus": "human_reviewed",
  "validTime": null,
  "licenseNotes": ""
}
```

允许的最小关系词表：

- `title_named_place`：地点明确出现在题目中。
- `text_named_place`：地点明确出现在正文中。
- `historical_source_attested`：外部史料有明确证据。
- `interpretive_association`：仅为解释或探索关联，界面中不能写成确定事实。

## 绝不由 LLM 补全的关系

- 诗是否写于某地，以及诗中地点是实见、典故、想象还是泛指。
- 同名作者究竟对应哪个历史人物。
- 人物生卒年、籍贯、出生地、任职地、居住地、旅行路线和到访事实。
- 古代地名与现代地点、古代行政单位与现代行政区的对应。
- 地点在某一时期是否存在及其当时隶属。
- 作品确切年代、版本、作者归属、异文和创作因果。
- 历史坐标精度，以及数据是否允许商业使用。

LLM 可在已核验事实边界内生成儿童友好的解释、追问和比喻；事实关系由数据记录、来源、时间范围与置信度决定。

## 公开发布前的门槛

真实地图骨架已经进入本地原型；若后续公开发布或扩充数据，仍必须重新完成：源数据版本与 hash 锁定、许可证和署名复核、中国地图公开发布的适用合规与审图要求复核、边界表达人工检查、地点关系人工核验，以及真实儿童的空间理解测试。当前资产只支持概略方向与相对关系，不升级为导航、城市精确测量或历史路线证据。
