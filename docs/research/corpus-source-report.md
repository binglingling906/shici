# 「山河诗境」教材目录与诗词语料来源研究报告

> 检索日期：2026-09-01（Asia/Shanghai）
> 范围：教材目录、课程标准、诗词数据仓库及概念问答知识图谱。
> 说明：本报告只做来源、版本和许可证核验，没有把任何候选仓库的诗词、注释或模型文件复制进项目。许可证判断是工程风险判断，不构成法律意见。

## 一、可落地的默认主版本

建议把“大陆普通学校、6-3学制、教育部统编语文”设为产品的默认教材索引；“教材版本”与“课程标准背诵推荐篇目”必须是两层数据，不能混成一张“全教材诗词表”。

| 学段 | 默认目录方案 | 可以可靠声明的范围 | 不应直接声明 |
| --- | --- | --- | --- |
| 小学 | 义务教育统编《语文》人民教育出版社，2024修订/按2022版课标修订；一年级上、下至六年级上、下，共12册 | 1–6年级、上下册、统编系列、人民教育出版社；2024目录同时列出5-4学制版本，默认应明确采用6-3 | 不能仅凭目录断言每册的诗词课文、课外背诵篇目或全国所有学校都在同一学期使用；不能把“推荐篇目”称为“教材必背” |
| 初中 | 同一套义务教育统编《语文》，七年级上、下至九年级上、下，共6册 | 7–9年级、上下册、统编系列、人民教育出版社；2024目录说明新教材按2022版课标修订 | 不能把课标推荐篇目等同于课文目录；不能忽略5-4学制和地区换用节奏 |
| 高中 | 普通高中统编《语文》，按2017年版课标（2020年修订）编写，2023国家课程教学用书目录：必修上、下，选择性必修上、中、下，共5册 | 普通高中语文学科、5册书名/卷册和统编系列；课程标准附录的“古诗文背诵推荐篇目”共72项，其中文言文32篇、诗词曲40首 | 不能称全部72项为同一套教材的“必背课文”；“选修”课程由学校和省份决定，不能做全国统一覆盖承诺 |

### 当前册次证据台账

- 书系骨架：23/23 册已登记并由官方国家课程教学用书目录支持，分布为小学 12、初中 6、高中 5。
- 逐首证据：4/23 册存在历史官方目录的部分篇目证据，分别是 2016 一年级上、2017 二年级上、2016 七年级上、2019 高中必修上。
- 证据边界：上述 4 册的逐首证据只适用于对应历史快照；其余 19 册目前只有册名/书系证据。任何册次都不能仅凭书系目录生成“这首诗在本册”的正式断言。
- 高中册次不绑定固定高一/高二/高三学期。产品可按年龄浏览候选内容，但不能把学校课程实施节奏伪装成全国统一映射。

### 课程标准锚点

- 2022版义务教育语文课标附录的“优秀诗文背诵推荐篇目”覆盖1–9年级，共135篇（段）；其中1–6年级75篇、7–9年级60篇（段）。标准明确这些篇目主要供学生读读背背，教材可作不同安排，不必全部编成课文。因此产品字段应写 `recommended_memorization`，不要写 `mandatory_textbook`。
- 普通高中语文课程标准（2017年版2020年修订）附录一为“古诗文背诵推荐篇目”：文言文32篇、诗词曲40首，共72项；其中必修、选择性必修、选修的分组不能反推某一省/校的实际授课安排。
- 更稳妥的主键不是“诗名+年级”，而是 `curriculumFramework + schoolSystem + bookSeries + editionYear + grade + term + lessonKind`。同一首诗可能同时出现在课文、课后背诵、课标推荐和课外阅读中。

## 二、可直接引用的权威来源

| 来源 | 核验到的事实 | 使用建议 |
| --- | --- | --- |
| [教育部：义务教育课程方案和课程标准（2022年版）发布](https://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html?fromColId=194) | 2022版义务教育课程标准由教育部发布，作为义务教育语文课标的版本锚点 | 记录 `curriculumFramework=义务教育语文课程标准（2022年版）`；页面本身是政策来源，不是教材正文授权 |
| [义务教育语文课程标准（2022年版）PDF（内容核对镜像）](https://www.hnwu.edu.cn/ewebeditor/uploadfile/20231006195355939.pdf) | 附录一给出1–6年级75篇、7–9年级60篇（段），并说明“推荐/读背”与课文编排不是一回事 | 只提取目录级元数据；该链接是镜像，不能据此获得教材正文再发布权 |
| [教育部：2024年义务教育国家课程教学用书目录（官方PDF）](https://www.moe.gov.cn/srcsite/A26/s8001/202408/W020250418502592948423.pdf) / [北京教委镜像](https://jw.beijing.gov.cn/xxgk/2024zcwj/2024qtwj/202408/W020240905543232813376.pdf) | 语文目录列出统编人民教育出版社1–6年级上下册、7–9年级上下册，并另列5-4学制等目录；新教材依据2022版课标修订 | 作为默认 `bookSeries/grade/term/editionYear` 的目录来源；不要把国家目录理解成复制许可 |
| [人教社：人教版十二套中小学教材纵览（第十二套）](https://m.pep.com.cn/gyrj/jc/202409/t20240902_1994544.shtml) | 人民教育出版社说明依据2022版课标修订的新一套教材自2024年秋季起在起始年级使用 | 用于标注“2024修订、逐年换用”的出版方信息；仍需保留学校/地区版本差异 |
| [教育部：普通高中课程方案和语文等学科课程标准（2017年版2020年修订）](https://hudong.moe.gov.cn/srcsite/A26/s8001/202006/t20200603_462199.html) | 高中课标版本锚点为2017年版、2020年修订 | 记录 `curriculumFramework=普通高中语文课程标准（2017年版2020年修订）` |
| [普通高中语文课程标准PDF（中国教育科学研究院文件）](https://www.ictr.edu.cn/Uploads/File/2022/04/28/%E6%99%AE%E9%80%9A%E9%AB%98%E4%B8%AD%E8%AF%AD%E6%96%87%E8%AF%BE%E7%A8%8B%E6%A0%87%E5%87%86%EF%BC%882017%E5%B9%B4%E7%89%882020%E5%B9%B4%E4%BF%AE%E8%AE%82%EF%BC%89.20220428173837.pdf) | 附录一列出高中72项古诗文背诵推荐篇目（文言文32、诗词曲40） | 作为推荐目录锚点，标签用 `recommended_memorization`，不要改写成统一“必背课文” |
| [教育部：2023年普通高中国家课程教学用书目录](https://www.moe.gov.cn/srcsite/A26/s8001/202305/t20230506_1058493.html) / [目录PDF镜像](https://jyj.chengde.gov.cn/attach/0/b78ad81e871c4a4b9b4e0f589ccd3f0a.pdf) | 2023目录按2017版课标修订，列出普通高中统编语文必修上/下、选择性必修上/中/下；选修教材由学校、省级教育部门按实际需要安排 | 建立高中5册主目录；选修内容必须标注地区/学校上下文 |
| [教育部：中小学教材管理办法](https://www.moe.gov.cn/srcsite/A26/moe_714/202001/t20200107_414578.html?tt_force_outside=1) | 国家课程教材应从教育部公布的目录中选用，教材编写、审核、选用有管理要求 | 说明“目录核验”和“正文复制授权”是两件事；正文应走出版社/权利人授权或独立创作流程 |

## 三、候选仓库核验（截至2026-09-01）

结论中的“可商用”指在当前证据下能否作为本产品直接分发的安全默认，不等同于法律意见。未见 `LICENSE` 不代表作者一定反对使用，而是代表我们没有获得足够的再分发授权证据。

| 仓库 | 许可证与数据来源证据 | 字段/可用价值 | 产品决策与风险 |
| --- | --- | --- | --- |
| [chinese-poetry/chinese-poetry](https://github.com/chinese-poetry/chinese-poetry) | 根目录显示MIT；[MIT文本](https://github.com/chinese-poetry/chinese-poetry/blob/master/LICENSE)。README称数据来自互联网，收集过程因规模大未记录 | 唐诗、宋诗、宋词等JSON；常见字段包括 `author`、`dynasty`、`title`、`paragraphs`、`notes`、`preface`、`id` | 可作为机器召回/候选索引和字段参考；MIT不能自动清除每条上游诗文、整理文本、注释的权利问题；无教材年级/册次和儿童级审校，不作为默认教材正文或导师事实源 |
| [leslieyin/shici](https://github.com/leslieyin/shici) | 根目录和[教科书选诗目录](https://github.com/leslieyin/shici/tree/master/data/%E6%95%99%E7%A7%91%E4%B9%A6%E9%80%89%E8%AF%97)未见许可证；目录含“教科书选诗”、小学1–6上下、初中7–9课内/课外、高中各年级文件 | JSON示例字段 `title`、`notes`、`author`、`paragraphs`、`dynasty` | 只能作为人工查找线索。缺少出版社、版次、年份、学制和逐条来源；“课内/课外”混用，不能据此声明当前2024小学/初中或2023高中目录；无许可证，不复制或再分发 |
| [yxcs/poems-db](https://github.com/yxcs/poems-db) | README称约22万首，来源为“古诗文网”，并声称“个人整理、可以随意使用”；仓库未见LICENSE。其个人声明不是上游网站或注释作者的授权证明 | `poems1–4.json` 分片；另有作者、分类、词牌、朝代、单诗JSON；含注释/赏析等扩展内容 | 不用于商业产品正文、翻译、注释或赏析。上游来源、抓取链路和现代编辑内容权利未清；最多用于字段设计/召回实验，且不应把“随意使用”写入项目权利结论 |
| [happy-xlf/Poem_Knowledge](https://github.com/happy-xlf/Poem_Knowledge) | README只有“古诗词知识图谱”，根目录未见LICENSE；代码含Neo4j问答模板及`pome.rar`、`.pkl`模型，数据/模型来源未说明 | 图谱代码展示作者、诗、朝代、形式、词牌、背景、译文等关系/字段；问答意图包括作者、创作背景、诗意等 | 可借鉴概念导师的意图分类和图谱关系，不导入其图数据、模型或事实。无来源/许可/事实置信度，儿童解释可能把未核验关系当定论；模型文件还存在第三方依赖风险 |
| [waysguo-rgb/shici-shanhe](https://github.com/waysguo-rgb/shici-shanhe) | 根目录未见LICENSE；[poems.csv](https://raw.githubusercontent.com/waysguo-rgb/shici-shanhe/master/poems.csv)字段为 `location,lon,lat,dynasty,year,author,title,lines,source_file`；[年份清单](https://github.com/waysguo-rgb/shici-shanhe/blob/master/poem_years_checklist.md)明确大量年份为“估”或待标注 | 适合参考诗—地点地图数据结构；`source_file`命名看起来像外部诗库文件，但仓库没有足够的授权/归因链 | 只作UX/字段启发，不复制CSV、诗文、坐标和年份。位置归属和年份有待考证，不能当作历史事实；无教材层级和许可证 |

### 许可证判断的共同依据

[GitHub官方许可证说明](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)明确：公开仓库没有许可证时，默认仍受版权保护，公众不因“能看到/能Fork”而获得复制、分发或制作衍生作品的普遍许可。因此，上表四个未见许可证的仓库一律不作为可再分发语料源。GitHub的[许可证检测API说明](https://docs.github.com/en/rest/licenses/licenses)也提醒，检测只是一种尝试，不能替代对数据和依赖的逐项核验。

## 四、“更优替代”与取舍

1. **首选不是再找一个大而全的GitHub仓库，而是官方目录 + 授权/自建内容管线。** 用教育部课标与国家教材目录建立目录层；教材正文、课文注释、现代译文和儿童解释从人民教育出版社或其他权利人取得明确授权，或由项目重新编写。原始诗文的公版状态也应逐首核验，不能因为作者已逝就自动推定现代整理版可复制。
2. [yaonphy/PoetryLibrary](https://github.com/yaonphy/PoetryLibrary)根目录显示MIT，README给出约827,108首CSV及 `number,title,dynasty,author,content` 五字段，适合作为比无许可证仓库更清晰的机器召回候选。但README没有充分记录827,108首的上游来源；MIT仓库许可不等于上游文本权利已清理，不能直接作为商业教材库。
3. [THUNLP-AIPoet/CCPM](https://github.com/THUNLP-AIPoet/CCPM)是约27,218条古诗文语义匹配数据集，字段为 `translation`、四个 `choices`、`answer`，适合做“诗意理解选择题/评测”方案参考，不是教材语料替代；仓库未见LICENSE，不能直接随产品分发。
4. [chinese-poetry/chinese-poetry](https://github.com/chinese-poetry/chinese-poetry)仍可保留在离线候选召回层，因为它有MIT声明和较完整的传统诗词字段；进入发布层前，必须为每条内容补齐 `sourceUrl`、`sourceSnapshot`、`rightsStatus`、`textVersion` 和人工审核记录。

## 五、建议的数据与发布闸门

目录和语料建议至少拆成以下字段，避免把“教材”“课标推荐”“课外阅读”“第三方大库”混成一个来源：

```text
id
textOriginal
author / dynasty
curriculumFramework
schoolSystem              # 6-3 / 5-4
bookSeries / publisher
editionYear / grade / term
lessonKind                # in_textbook / recommended_memorization / outside_class
sourceUrl / sourceSnapshot / sourceRetrievedAt
textVersion / variantNote
rightsStatus               # unknown / review / cleared / restricted
rightsEvidence
reviewStatus / confidence
pinyinOverride             # 仅保存人工校正，不覆盖自动生成器
meaningSource / historicalClaims[]
```

发布前的最低闸门：`rightsStatus=cleared`、有可追溯来源快照、教材映射经过人工核对、拼音/异文经过中文编辑审校；任何 `unknown` 的第三方正文、注释、译文、赏析或模型文件不进入生产包。概念导师只回答有 `source + confidence` 的事实；“寓意/感受”作为年龄分层的项目编辑内容保存，并标注它是解释而非史实。

## 六、最终决策摘要

- 默认主版本：**义务教育6-3学制、2024修订统编小学/初中语文（人教社）+ 普通高中2017/2020课标下的2023统编高中语文五册**。
- 目录级可声明：学段、年级、上下册、书系、出版社、课标版本和“课标推荐篇目”标签。
- 暂不可声明：全国所有学校完全一致、所有推荐篇目都是课文/必背、选修内容全国统一、任何GitHub仓库的整库文本可直接商用。
- 本轮候选库结论：不复制无许可证或来源不清的诗文/注释/模型；先做官方目录清单，再补授权或自建、可审计的内容。
