# 「山河诗境」Phase 1 外部智能研究

> 研究日期：2026-09-01
>
> 研究范围：Phase 1 的 5 个完整地点、10 首完整诗境、100 首儿童核心候选目录，以及拼音、中文 TTS、年龄分层、Tutor、故事地图和体验验收。本文只记录外部情报、证据边界和对方案的实际影响。
>
> 方法：优先使用官方仓库、规范、浏览器文档、教育机构报告和同行评审论文；只把“借鉴”写成产品原则，不把第三方实现、文本或图片偷偷带入产品。
> 依赖状态：本轮没有安装依赖，也没有修改业务代码。

## 先给结论

1. `chinese-poetry/chinese-poetry` 适合做“候选发现/检索入口”，不适合未经校勘、来源标注和逐条许可检查就直接作为产品正文。它的顶层代码/仓库许可证是 MIT，但 README 明确说数据来自互联网且采集过程没有记录；仓库许可不能替第三方原始文本解决版权与可靠性问题。
2. 拼音采用“语义 ruby + 拼音在字上方”。这不是声称“拼音必须在上面”：W3C 规范承认中文教材中“下面”也很常见；本项目选择上方是基于低年级孩子的阅读支架和本次真实反馈。使用 `<ruby><rb>字</rb><rt>拼音</rt></ruby>`，配合 `ruby-position: over`，不再渲染一整行游离的拼音字符串。
3. `pinyin-pro` 适合当前工程做构建期候选生成（工程已锁定 3.29.3）；每首诗仍保留可审阅的词/字级 override。`pypinyin` 适合未来离线二次校验。两者都不能替代语境审校；拼音数据包的上游词典版权也必须单独核验。
4. Web Speech 只作为渐进增强：设备没有中文 voice、voice 尚未加载、浏览器不支持或播放出错时，诗文和拼音必须仍然完整可读，不能出现“朗读按钮有反馈但正文消失”的空状态。生产级稳定朗读应另行评估有授权的预录音或原生 TTS。
5. 7–12 岁不是可以机械套用的科学断点。产品分成低、中、高三个“支持强度”档，而不是改变诗文真相：先感受，再观察证据，再猜测，再追问，最后才解释；AI 追问必须绑定当前诗句/地图线索，不能变成泛化聊天窗口。
6. StoryMapJS、MapLibre Storymaps 和博物馆地图的可迁移部分是“章节/场景叙事、按镜头逐步显露信息、地图同时提供文字列表回退、按缩放改变信息密度”。本切片继续使用项目内 SVG 地理骨架，不引入在线图块、地图框架或 POI 海量控制。
7. 视觉验收升级为“自动结构检查 + 截图/人工批判”：WCAG 2.2 的 reflow、焦点不被遮挡、目标尺寸、对比度是底线；Primary Content Visibility、遮挡、阅读舒适度、儿童认知负荷不能由单一自动工具证明。浏览器截图回归和 axe-core 是未来 CI 候选，本轮不增依赖。

## 1. 诗词数据集：候选发现 ≠ 可信正文

### 1.1 候选比较

| 候选 | 主源确认的结构/质量 | 许可边界 | Phase 1 决定 | 对产品的真实影响 |
| --- | --- | --- | --- | --- |
| [`chinese-poetry/chinese-poetry`](https://github.com/chinese-poetry/chinese-poetry) | 官方 README 宣称约 5.5 万首唐诗、26 万首宋诗、2.1 万首宋词及其他文集；以 JSON 分目录发布。README 同时说明数据来自互联网，因站点限制/中断没有记录完整采集过程，并提醒接受贡献修正。不同集合是历史累积文件，不应假设一个已经规范化的统一 schema。 | 仓库顶层 [`LICENSE`](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/LICENSE) 为 MIT（JackeyGao，2016）；但 MIT 不等于对互联网转载文本逐条拥有版权或保证校勘。 | **只作候选索引/发现，不直接打包为权威正文。** | 未来导入时要保存 collection、原始 URL/版本、校勘状态和许可字段；入库前逐首核对作者、题名、正文、标点和适龄读音。当前《望庐山瀑布》不因该库自动替换已有 curated 文本。 |
| [`shiyun-corpus`](https://github.com/Cohenjikan/shiyun-corpus) | 近期的 provenance-first 语料库；README 给出 `data/poems.<朝代>.jsonl` 一行一首的 schema：`id/title/author/dynasty/body/genre/dup_group/provenance`，保留原始标点，并将 `curated/additions/corrections` 与正文分离；有 `build`/`validate` 报告。 | 代码、校勘标注和文档为 MIT；诗歌正文按各上游来源分别许可，公开 PD 层与 `_restricted` 隔离层明确分开，混合许可不能被一个总 LICENSE 覆盖。 | **只借鉴 provenance/schema/隔离层，不直接依赖。** | 为 100 首目录定义 `source`, `license`, `reviewStatus` 和版本快照；生僻字/现代在册作者不能悄悄混入公开层。Phase 1 的 10 首完整诗仍逐首人工审定，不引入其构建链。 |
| [Chinese Text Project（中国哲学书电子化计划）FAQ](https://ctext.org/faq) / [How texts are prepared](https://ctext.org/faq/ens) | 官方说明文本通常基于公版版本，并与印刷版本校正；正文按可管理段落组织，并在页面显示来源。也明确提醒：站点与内容受版权保护，禁止自动化大批量下载；站内 Wiki/翻译的权利和质量另有边界。 | 不是一个可把全站正文当公共数据下载的许可证；部分文本是公版，但需逐项判断，翻译有独立版权。 | **只作校勘/出处参考，不抓取、不复制站点内容。** | 如果将来核对版本，应记录具体页面/版本和人工判断；不把“有古籍”误写成“可任意再发布”。 |
| 公开网页古诗站点（如搜索结果中的聚合页） | 往往没有稳定版本、编校责任、来源字段或机器可验证许可。 | 许可不清。 | **拒绝作为数据源。** | 搜索只能发现线索；不得把网页抓取结果直接喂给儿童内容或训练/回答层。 |

### 1.2 质量和许可的落地规则

- `chinese-poetry` 的数量是召回优势，不是准确率证明。作者、题名、异文、断句、标点和重复项都要在内容管线中有可追溯的人工审阅状态。
- 产品内部 schema 应把正文、分句、地理实体、拼音和讲解拆开；拼音与讲解是派生/策展层，不能覆盖原始正文。建议最少保留：`text`, `lines`, `source`, `sourceUrl`, `sourceVersion`, `license`, `reviewStatus`, `pinyinSegments`, `pronunciationOverrides`。
- “MIT 仓库”只能覆盖该仓库声明覆盖的代码/文件。第三方文本、词典、图片、音频和翻译要逐项看其来源与许可；无法证明时只留外部链接和内部研究记录，不随产品发布。
- 当前切片的安全姿态：正文由策展人确认；机器只生成候选拼音/检索候选；发布前做逐字、逐句、逐来源 review。后续扩库先做数据治理，再做 UI 扩展。

## 2. 拼音候选、规范和 ruby

### 2.1 库的比较

| 库/主源 | 能力与边界 | 许可 | 决定 | 实际影响 |
| --- | --- | --- | --- | --- |
| [`pinyin-pro`](https://github.com/zh-lx/pinyin-pro) | JavaScript；支持声调、声母/韵母、数组/HTML 输出、词语匹配和多音字语境示例；官方仓库有测试与 API 文档。核心包规模不是零成本，适合构建期而不是每次设备端自由猜读音。 | [`LICENSE`](https://raw.githubusercontent.com/zh-lx/pinyin-pro/master/LICENSE) 为 MIT。 | **直接采用为构建期候选生成器。** | 当前工程已锁定 `3.29.3`；输出只进入内容校审或静态内容，不让运行时随意改掉已审定拼音。生成的值仍须逐诗 review。 |
| [`pinyin-pro-data`](https://github.com/chinese-data/pinyin-pro-data) | 扩展词典；README 提到 `modern.json` 来自《现代汉语词典（第 7 版）》、`complete.json` 来自 jieba 词典，并提供 `chars.json`。 | 仓库声明 MIT，但其中引用词典的原始出版物/数据权利不能由该声明自动覆盖。 | **暂不直接打包；只记录为候选。** | 若未来需要扩展词典，先核对每个文件的上游许可、版本和商业再分发条件；不为了提高召回而引入未确认的数据权利。 |
| [`pypinyin`](https://github.com/mozillazg/python-pinyin) | Python；词语智能匹配、多音字、异体/繁体、tone/number 等 style；官方 API 支持 `load_phrases_dict`、`load_single_dict` 自定义词/字。 | [`LICENSE`](https://raw.githubusercontent.com/mozillazg/python-pinyin/master/LICENSE) 为 MIT；其字/词数据还有独立上游说明。 | **只作未来离线二次校验/内容工具，不加入前端。** | 用第二引擎找出与 `pinyin-pro` 不一致的条目，再由人判断；不能把两个引擎“投票”当成语境真相。 |
| [`hotoo/pinyin`](https://github.com/hotoo/pinyin) | JavaScript 转拼音，生态成熟、MIT，但当前切片需要的语境 override/构建约束由 `pinyin-pro` 已覆盖。 | [`LICENSE`](https://raw.githubusercontent.com/hotoo/pinyin/master/LICENSE) 为 MIT。 | **只借鉴生态，不并行采用。** | 避免前端同时携带第二套汉字字典和 API；未来若换库，必须以 bundle、准确率、override 和许可证复评。 |
| [`cnchar`](https://github.com/theajack/cnchar) | MIT、插件多，支持 pinyin/多音、声调、扩展数据和语音相关插件；官方 README 的数据说明来自互联网并提示可能有错误/遗漏。 | [`LICENSE`](https://raw.githubusercontent.com/theajack/cnchar/master/LICENSE) 为 MIT；扩展数据/插件需单独审查。 | **当前拒绝直接采用；只借鉴自定义数据接口思路。** | 功能面和插件体量会放大 10 首完整诗境的运行时复杂度；不能把“插件支持语音”当作稳定中文 TTS。 |
| [`creeperyang/pinyin`](https://github.com/creeperyang/pinyin) / [TinyPinyin](https://github.com/promeG/tinypinyin) | 前者轻量但 README 明确“不支持多音字”；后者是 Java/Android 库，无声调符号、输出大写，非浏览器方案。 | 前者 MIT；后者 Apache-2.0。 | **拒绝。** | 轻量不能抵消多音字和声调缺失；不让体积指标牺牲低年级读音质量。 |

### 2.2 规范结论：为什么“在字上面”

权威依据：

- 教育部的[《汉语拼音方案》](https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html)和[《普通话异读词审音表》](https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/201001/t20100115_75598.html)是声调符号、普通话异读处理的规范来源。产品默认用 `ā á ǎ à` 等声调符号，不用数字声调；历史音、方音不在本阶段冒充普通话读音。
- W3C [Ruby 规范](https://www.w3.org/TR/ruby/)把 ruby 定义为与 base text 关联的短注音/注释，示例使用 `<ruby><rb>base</rb><rt>annotation</rt></ruby>`；规范也记录了“中国语境中拼音放在正文下方”的传统。因此“上方”是本产品针对本次反馈和低龄扫描路径的体验决定，不是宣称所有中文排版都必须上方。
- CSS Ruby 规范的 [`ruby-position`](https://www.w3.org/TR/css-ruby-1/) 允许 `over`/`under` 等位置；MDN 的[`ruby-position`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/ruby-position)说明 `over` 在横排正文上方、`under` 在下方，并提醒浏览器对部分 ruby 行为支持不完全。
- W3C 的 [HTML Ruby extensions](https://www.w3.org/TR/html-ruby-extensions/)给出 `rb`/`rt` 的语义和旧浏览器的 `rp` 回退；[MDN `<ruby>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ruby)说明它是 phrasing content、没有隐式 ARIA role。语义关联比两个独立文本行更容易保持字符—读音对应，也更利于搜索/辅助技术处理。

因此本切片的呈现规则是：

1. 每个可读单元以 `<ruby><rb>汉字</rb><rt>pīnyīn</rt></ruby>` 建立关联；标点不伪装成带拼音字符，换行跟随诗句节奏。
2. `ruby-position: over` 作为明确意图；不能依赖浏览器默认位置。不要用绝对定位的“第二行拼音”覆盖诗句。
3. 不是把整首诗变成密集教材：低龄模式默认显露；中高龄可以逐句/整首切换；切换时正文位置和朗读焦点不跳动。
4. `rt` 的字号、行高、字距与正文一起调校；CSS Ruby 规范提醒 ruby 可能超出 line box，需为上方注音预留 line-height/padding，并测试注音不会撞到上一行、AI 引导或容器边界。

### 2.3 多音字和特殊读音：自动生成必须可校正

采用三层流水线：

1. **候选层**：`pinyin-pro` 按词/句生成声调拼音；必要时用 `pypinyin` 作为离线差异检查。自动生成结果永远标为候选。
2. **语境层**：以诗句中的词组为最小 override 单位，优先于全局单字表；单字 override 只在确实独立读法时使用。保存 `pronunciationOverrides` 与依据/审阅人，避免未来重新生成时丢失。
3. **发布层**：人工逐字检查多音字、地名、人名、作者名、古今异读和轻声/儿化边界；必要时记录规范来源或版本。尚无可靠依据的历史读音不放进默认低龄模式。

该机制能让常规诗歌靠自动候选扩展，又让“长安”“还来就菊花”这类语境差异不被 naive character-to-pinyin 转换覆盖。它也把“拼音正确”从一次 UI 细节变成可审计的内容资产。

## 3. 中文 TTS 与 Web Speech 降级

主源：W3C [Web Speech API](https://webaudio.github.io/web-speech-api/)、MDN [`SpeechSynthesis`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)、Chrome [Speech Synthesis API 介绍](https://developer.chrome.com/blog/web-apps-that-talk-introduction-to-the-speech-synthesis-api) 和 Chrome [`tts`](https://developer.chrome.com/docs/extensions/reference/api/tts) 文档。

关键事实：

- `speechSynthesis.getVoices()` 取的是当前设备/浏览器可用的 voice，列表可能为空或稍后才加载；应监听 `voiceschanged`，不能在页面首次渲染时假定有 `zh-CN`。
- voice、普通话质量、离线能力、系统隐私策略和可用语言由操作系统/浏览器决定；“支持 Web Speech”不等于每台设备都有同一中文声音。
- 播放应从用户手势触发，并提供 `pause/resume/cancel`；切换诗句时取消旧 utterance，当前句高亮不能依赖 TTS 一定会回调。

产品降级梯子：

| 条件 | 体验 | 不允许的行为 |
| --- | --- | --- |
| 有 API 且找到合适中文 voice | 用户点击“朗读”后播放；同步突出当前句，保留暂停/停止。 | 不把 voice 名称或系统技术细节塞给儿童。 |
| API 存在但 voice 尚未加载 | 等待 `voiceschanged`，按钮有清晰的“正在准备声音”状态。 | 不把空 voice 列表当成永久失败。 |
| 没有中文 voice、API 不存在或播放报错 | 正文、上方拼音和逐句查看仍完整可用；提示“这台设备暂时不能朗读”，可继续阅读。 | 不隐藏诗、不阻塞下一步、不显示永不结束的 loading。 |
| 未来需要统一高质量声音 | 另行评估有授权的预录音/原生 TTS，并设计家长同意、缓存、隐私和成本。 | 本阶段不偷偷接入云端 TTS 或上传儿童输入。 |

对现有切片的影响：朗读是 enhancement，不是 primary content 的前置条件；AI/朗读故障都必须降级到仍能阅读整首诗的页面状态。

## 4. 7–12 岁学习分层与苏格拉底式引导

依据：美国 National Academies 的 [K–12 spatial thinking 报告](https://nap.nationalacademies.org/catalog/11019/learning-to-think-spatially-gis-as-a-support-system-in-the-k-12-curriculum)、National Geographic 的 [Spatial Thinking K–5 报告](https://media.nationalgeographic.org/assets/file/SpatialThinkingK-5FullReport.pdf)、Uttal & Sheehan 关于儿童地图/模型理解的[同行评审论文](https://doi.org/10.1891/1945-8959.13.2.188)、IES 的[学习与复习实践指南](https://ies.ed.gov/ncee/wwc/practiceguide/1)及其[深层提问证据](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/20072004.pdf)、IES [K–3 阅读理解提问模块](https://ies.ed.gov/ncee/rel/reading-comprehension-k-3/teacher-pd-module1)。这些资料支持“空间概念 + 表征 + 推理”和“有证据的追问”，但不支持把下面年龄档当作已验证的儿童诊断量表。

### 4.1 产品分层假设

| 支持档 | 适合的初始假设 | AI/地图交互 | 不做什么 |
| --- | --- | --- | --- |
| 低龄约 7–8 | 更需要具体可见的山、水、方向和短句；拼音/朗读默认显露。 | 一次只问一个观察问题；提供 2–3 个可点选线索；允许指向地图或诗句作答。 | 不放长解释、连续追问、密集元数据。 |
| 中段约 9–10 | 可以比较两处空间关系，并用一句话说明依据。 | “你看到了什么？”→“哪条线索让你这样想？”→“诗里哪一处呼应？”必要时给一个微提示。 | 不替孩子直接宣布正确答案；不要求开放式长作文。 |
| 高段约 11–12 | 可以处理假设、不同解释和来源差异；仍需可见证据支撑。 | 允许“我不确定”；展示两种解释或距离/方向证据，再请孩子选择/说明。 | 不把不确定性伪装成 AI 的绝对事实。 |

### 4.2 引导脚本的通用状态机

`感受（看山/听诗） → 观察（指出可见线索） → 猜测（选或说关系） → 追问（为什么/哪一句） → 微提示（只补一条线索） → 再猜 → 表达 → 最后解释`。

设计含义：

- AI 的第一职责是把孩子的注意力留在“诗 + 山水 + 当前证据”，不是模拟客服。每次提问都应能指回一段诗句、一条地图路径或一个可观察视觉对象。
- “不知道”是一个合法状态：先降低问题粒度、给可见选择或重播诗句，最后才展示解释。不要用答案长文本惩罚沉默。
- 页面层级上，诗句是 primary；AI prompt、输入框、提示、下一站都必须在独立区域或折叠/底部流程中出现。键盘弹出时只压缩 secondary 区域，不遮盖当前诗句。
- 年龄档是内容配置和观察假设，不是对儿童能力的标签；正式儿童测试前，应记录完成率、主动回看、误读、求助和认知负荷反馈再调节。

## 5. 故事地图与博物馆地图：借模式，不搬运行时

| 主源 | 值得借鉴的模式 | 许可/边界 | Phase 1 决定与影响 |
| --- | --- | --- | --- |
| [Knight Lab StoryMapJS](https://github.com/NUKnightLab/StoryMapJS) 与[官方高级配置](https://storymap.knightlabprojects.com/advanced/) | 以 scene/chapter 顺序讲故事；图像模式会避免鼠标悬停点遮挡画作，体现“主视觉优先、标记按需出现”的原则。 | 仓库 [`LICENSE`](https://raw.githubusercontent.com/NUKnightLab/StoryMapJS/master/LICENSE) 为 MPL-2.0；修改/分发代码有源文件与声明义务。 | **只借鉴章节/主视觉保护，不复制代码。** 现有产品保留诗句主阅读区；AI 控制器在 secondary 区或按阶段显露。 |
| [MapLibre GL Storymaps](https://github.com/opengeos/maplibre-gl-storymaps) | scroll-driven chapters，章节有 `id/title/description/location/mapAnimation`，可按镜头改变地图信息。 | GitHub 仓库声明 MIT；仍有 MapLibre/地图样式和外部图块的运行时与数据边界。 | **只借鉴 chapter 配置思想；当前拒绝引入。** 本切片是项目内 SVG、无 API key/在线图块，地图只需中国→长江中游→庐山的两级镜头。 |
| [Smithsonian Natural History Map](https://naturalhistory.si.edu/visit/map) / [Human Origins interactive floorplan](https://humanorigins.si.edu/exhibit/exhibit-floorplan/exhibit-floorplan-interactive) | 地图旁同时提供楼层/展项文字列表和可访问路径；地图有“截至某日”语境。 | 机构页面/图片/交互并非本项目可复制的开源资产。 | **借鉴 map + text fallback、来源/时间标记；不复制视觉资产或展馆 POI。** “用文字读地图”应是同等入口而非隐藏的无障碍补丁。 |
| [V&A tablet-optimised digital map](https://www.vam.ac.uk/blog/digital/tablet-optimised-digital-map) | 平板优先、移动响应、数据驱动；地图服务于内容而非装饰。 | 文章和站点资产许可需另查。 | **借鉴响应式与数据驱动原则；不复制代码/素材。** 390×844 和平板必须先确保诗句可读，再增加地图层。 |
| [The Met：Future of Mapping and Wayfinding](https://www.metmuseum.org/fr/perspectives/future-of-mapping-and-wayfinding) | 把地图当数据集（坐标、楼层、唯一 ID、类型/标题）；随缩放/上下文动态改变信息密度，多终端复用。 | 机构文章/数据不自动授予再分发权。 | **借鉴“地图是认知骨架/分层数据”**；当前只保留真实地理关系和少量状态，不引入博物馆式设施清单。 |

由此形成一条 UI 原则：**地图负责回答“诗从哪里望出去”，诗负责回答“孩子现在要读什么”，AI 负责下一条可观察问题。三者同屏时按此主次分配空间；secondary 层不能用浮层覆盖 primary。**

## 6. 可访问性、遮挡与视觉回归 evaluator

### 6.1 基线

以 W3C [WCAG 2.2](https://www.w3.org/TR/WCAG22/)为底线，并补充儿童认知/学习体验的人评。直接相关的理解文档：

- [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)：在 320 CSS px 宽（以及 256 CSS px 高）条件下不丢信息/功能，通常应能单列阅读；这不是替代 390×844 实机检查的借口。
- [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)：普通文字至少 4.5:1，大文字至少 3:1；诗文、拼音、焦点态都要测，不只测按钮。
- [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)：WCAG 2.2 AA 为 24×24 CSS px 及例外；本产品对“朗读、下一步、地图地点、关闭/展开”采用更舒适的 44×44 目标作为产品门槛，并提供文字/键盘替代。
- [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) 与 [Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)：键盘焦点必须看得见，且不能被 AI 控件、固定底栏或键盘状态遮住。
- [Pronunciation](https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html)：WCAG AAA 3.1.6 认可在发音影响意义时提供发音机制，并把 ruby（H62）列为技术之一；本项目的拼音开关应保持清楚关联，不让辅助技术重复读出两份正文。
- W3C [Cognitive and Learning Disabilities Accessibility](https://www.w3.org/TR/coga-usable/)是 WCAG 之外的补充指南：清晰结构、短块内容、视觉线索、避免依赖记忆、帮助用户避免错误。它不能被当作自动合规证明，却正好覆盖儿童认知负荷的人工批判入口。

### 6.2 每次视觉验收的检查清单

| 维度 | 自动/半自动信号 | 人工必须回答的问题 |
| --- | --- | --- |
| Primary Content Visibility | 诗标题、作者、当前整首/当前目标诗句的 DOM 可见；计算 bounding box 与 viewport/固定层的交集，任何 secondary overlap 失败。 | 孩子是否不用滚动/猜测就能完整看到当前要读的诗句？AI 出现、输入、键盘弹出、完成状态是否仍如此？ |
| Occlusion / layering | `elementFromPoint` 采样诗句字符和 `rt`；固定层、弹窗、输入法占位不得落在诗句阅读区域。 | 是否存在“视觉上看似整齐、实际上挡住下半句/拼音/标点”的遮挡？ |
| Reflow / viewport | 桌面、平板、390×844、较矮 viewport；至少补测 320 CSS px 等价 reflow、125% 大文字和键盘可见状态。 | 行长、ruby 上方留白、地图/诗/AI 的主次是否自然，是否出现双向滚动或关键操作被挤走？ |
| Legibility / reading comfort | computed font size/line-height、对比度、`ruby-position`、`rt` 与上一行的几何间距。 | 拼音是否清楚对应但不密成教材？标点、节奏、换行是否仍像诗？ |
| Touch / input interference | 目标尺寸、tab 顺序、焦点可见、输入框与 fixed layer 的交集。 | 手指点击诗句/地点/朗读时是否误触 AI？键盘出现后能否收起、继续阅读和提交？ |
| Child cognitive load | 不可完全自动化；记录同时出现的提示数量、长文本、等待态和可逆性。 | 一次是否只有一个问题/一个下一步？孩子能否知道“现在看哪里、为什么点、答错怎么办”？ |
| TTS / pinyin failure | voice 缺失、`voiceschanged` 延迟、speech error/cancel 时状态回收；pinyin override 完整性。 | 功能失败是否只是轻量提示，正文和拼音是否仍是稳定退路？ |

### 6.3 自动工具的定位

- [Playwright screenshot assertions](https://playwright.dev/docs/test-snapshots)支持 `expect(page).toHaveScreenshot()`、像素差阈值和隐藏动态区域；官方文档也说明快照受浏览器/平台影响，需要固定运行环境。**借鉴截图基线和 diff 思路，暂不在本轮安装 Playwright。**
- [`axe-core`](https://github.com/dequelabs/axe-core)是可嵌入的 WCAG 规则引擎，仓库说明平均只能自动发现约 57% 的问题，剩余问题需要人工判断；许可证为 MPL-2.0。**列为未来 CI 候选，不把它当“视觉/儿童体验已通过”。**
- 当前 evaluator 的最低实现应是 DOM/几何事实 + 截图/人工批判：自动检查用来快速抓“诗句被盖住、焦点被盖住、按钮太小、ruby 溢出”，人评用来判断“看得见但读不舒服、信息层级错、问题太难/太多”。

## 7. Applied decision ledger

| 决策 | 证据 | 本轮落地/范围状态 |
| --- | --- | --- |
| 诗正文永远是 primary | StoryMapJS 的主视觉避让、博物馆地图的文字回退、WCAG reflow/focus-not-obscured、真实反馈 | 保持庐山切片，不让 AI 浮层覆盖诗；后续视觉验收把 overlap 作为硬失败。 |
| 拼音放在字上方且可关闭 | W3C ruby 语义 + CSS `ruby-position: over`；W3C 同时说明中文下置传统，故这是产品选择 | 使用语义 ruby 和声调符号；低龄默认显示，中高龄可切换；为 line-height/overflow 做几何检查。 |
| 自动拼音必须可人工 override | 教育部规范；pinyin-pro/pypinyin 均支持词语/自定义能力，但字典来源和语境仍有限 | 内容层保存候选、词级/字级 override、来源/审阅状态；不再使用 naive 全局转换作为发布结果。 |
| 朗读是增强，不是内容前置条件 | Web Speech voice 列表异步且依赖设备 | voice 缺失/报错时保留正文、ruby、逐句读法；未来另评有授权稳定音频。 |
| AI 采用渐进披露和证据追问 | National Academies/IES/地图认知研究支持空间表征、深层问题和脚手架 | 先观察再解释；AI/input/下一站只能占 secondary 区域或在阶段后显露；不扩大为开放式聊天。 |
| 地图只显露当前认知所需信息 | StoryMap chapter、MapLibre location config、Met 的 zoom/context density | 中国→长江中游→庐山保留分层；不引入在线图块、海量 POI 或新地点。 |
| evaluator 是自动 + 人工 | WCAG 建议自动与人工结合；axe 官方明确自动覆盖不完整；Playwright 需固定环境 | 增加检查矩阵和回归思路；本轮没有安装新测试依赖。 |

## 8. 仍需在下一轮验证的风险

- `chinese-poetry` 和 `shiyun-corpus` 的具体诗文版本仍需要逐条与权威出版物/馆藏对校；本研究没有把任一整库导入产品。
- ruby 的实际排版会随浏览器、字体、缩放和行高变化；不能只凭 CSS 声明通过，必须在桌面、平板、390×844 和更矮视口测量 `rb/rt` 的真实 bounding box。
- Web Speech 的中文 voice、声调自然度、取消/切句回调需要在目标设备实测；没有中文 voice 时的静态 fallback 必须纳入回归。
- 7–12 分层是设计假设，不是儿童能力诊断；在 Experience Refinement 完成后，才适合用小规模儿童观察验证问题长度、拼音默认策略和提示频率。
- WCAG/axe/截图 diff 不能代表儿童认知负荷或文化/内容正确性；每次发布仍需要内容审阅和真实使用观察。

## 来源索引（主源与许可）

- 数据：[`chinese-poetry` README](https://github.com/chinese-poetry/chinese-poetry) / [`LICENSE`](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/LICENSE)（仓库 MIT；数据来源与采集过程由 README 自述，不能据此推断第三方文本权利）；[`shiyun-corpus` README](https://github.com/Cohenjikan/shiyun-corpus) / [`LICENSE`](https://github.com/Cohenjikan/shiyun-corpus/blob/main/LICENSE)（代码/文档 MIT，正文按来源混合许可）；[CTP FAQ](https://ctext.org/faq)（站点版权和下载限制）。
- 拼音/规范：[`pinyin-pro`](https://github.com/zh-lx/pinyin-pro) / [`LICENSE`](https://raw.githubusercontent.com/zh-lx/pinyin-pro/master/LICENSE)（MIT）；[`pinyin-pro-data`](https://github.com/chinese-data/pinyin-pro-data)（仓库声明 MIT，词典上游权利待核）；[`pypinyin`](https://github.com/mozillazg/python-pinyin) / [`LICENSE`](https://raw.githubusercontent.com/mozillazg/python-pinyin/master/LICENSE)（MIT）；[`hotoo/pinyin`](https://github.com/hotoo/pinyin)（MIT）；[`cnchar`](https://github.com/theajack/cnchar)（MIT）；[`creeperyang/pinyin`](https://github.com/creeperyang/pinyin)（MIT）；[TinyPinyin](https://github.com/promeG/tinypinyin)（Apache-2.0）；教育部[《汉语拼音方案》](https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html)、[《普通话异读词审音表》](https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/201001/t20100115_75598.html)；[W3C Ruby](https://www.w3.org/TR/ruby/)、[W3C CSS Ruby](https://www.w3.org/TR/css-ruby-1/)、[W3C HTML Ruby extensions](https://www.w3.org/TR/html-ruby-extensions/)、[MDN ruby-position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/ruby-position)、[MDN ruby](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ruby)。
- TTS：W3C [Web Speech API](https://webaudio.github.io/web-speech-api/)；[MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)；[Chrome Speech Synthesis](https://developer.chrome.com/blog/web-apps-that-talk-introduction-to-the-speech-synthesis-api)；[Chrome TTS](https://developer.chrome.com/docs/extensions/reference/api/tts)。这些是规范/文档，不是本产品要打包的音频资产。
- 教育/地图：National Academies [K–12 spatial thinking](https://nap.nationalacademies.org/catalog/11019/learning-to-think-spatially-gis-as-a-support-system-in-the-k-12-curriculum)；National Geographic [Spatial Thinking K–5](https://media.nationalgeographic.org/assets/file/SpatialThinkingK-5FullReport.pdf)；[Uttal & Sheehan 2014](https://doi.org/10.1891/1945-8959.13.2.188)；IES [Organizing Instruction and Study](https://ies.ed.gov/ncee/wwc/practiceguide/1)、[deep questions PDF](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/20072004.pdf)、[K–3 reading comprehension](https://ies.ed.gov/ncee/rel/reading-comprehension-k-3/teacher-pd-module1)；[StoryMapJS](https://github.com/NUKnightLab/StoryMapJS)（MPL-2.0）；[MapLibre Storymaps](https://github.com/opengeos/maplibre-gl-storymaps)（仓库 MIT）；[Smithsonian map](https://naturalhistory.si.edu/visit/map)；[Human Origins floorplan](https://humanorigins.si.edu/exhibit/exhibit-floorplan/exhibit-floorplan-interactive)；[V&A digital map](https://www.vam.ac.uk/blog/digital/tablet-optimised-digital-map)；[The Met mapping](https://www.metmuseum.org/fr/perspectives/future-of-mapping-and-wayfinding)。机构页面的图片/代码只作观察，不作复制来源。
- QA：W3C [WCAG 2.2](https://www.w3.org/TR/WCAG22/)及 [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)、[contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)、[target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)、[focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)、[pronunciation](https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html)、[Coga usable](https://www.w3.org/TR/coga-usable/)；[Playwright screenshots](https://playwright.dev/docs/test-snapshots)；[`axe-core`](https://github.com/dequelabs/axe-core)（MPL-2.0，官方说明自动覆盖不完整）。
