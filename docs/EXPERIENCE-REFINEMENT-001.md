# Experience Refinement 001：诗先于互动

日期：2026-09-01

## 范围与结论

本轮冻结地点、诗词与功能扩张，只打磨“庐山—《望庐山瀑布》—朗读—山风引导—足迹—下一站”这一条垂直切片。儿童测试暂缓，直到本页的基础体验门槛通过。

核心原则：**任何 secondary interaction 都不能遮挡、裁切或削弱 primary learning content。** 在庐山场景中，古诗是 Primary Content；声音、拼音开关、引导、输入、足迹和下一站都是 Secondary Interaction。

## 遮挡根因

旧版把诗和互动卡片放在同一个全屏、绝对定位的舞台中：诗区高度随字体和 viewport 变化，互动卡片位置却由 viewport 公式决定，二者没有布局契约；卡片的 z-index 还高于诗区。移动端虽然把卡片改回普通流，但父场景仍是固定高度，外层又裁切溢出，导致 AI 区落在不可到达的页面之外。诗句原本还有低透明度和逐句隐藏动画，几何不重叠时也未必可读。

因此根因是错误的信息层级与空间模型，不是横向偏移量。

## 新的交互假设

采用“先诗后问，同屏不叠加”：

1. 阅读阶段只呈现完整诗句、逐字拼音、朗读和一个低干扰的“读完了，想一想”入口。
2. 引导不会先于阅读出现。点击入口后，才渐进披露“山风问一句”。
3. 宽屏中，诗与引导进入各自的普通流列；不存在悬浮覆盖或跨列 z-index。
4. 平板和手机中，诗在前、引导在后，页面自然增长；引导区始终提供“回看全诗”。
5. 输入提交后主动收起当前输入焦点，不自动聚焦下一输入；可视 viewport 变化时，只把孩子正在使用的输入框滚到键盘上方。
6. 朗读只强调当前行，其余三行始终完整、清晰，不再用逐句揭示隐藏正文。
7. 完成后仍留在相同文档流中；再次进入庐山先回到诗，不自动跳向“下一站”。

## 拼音方案调研与决策

调研了 `pinyin-pro`、`pypinyin`、`hotoo/pinyin`、`cnchar` 与 `tiny-pinyin`：

| 候选 | 适合点 | 本轮判断 |
| --- | --- | --- |
| [pinyin-pro](https://github.com/zh-lx/pinyin-pro) | JS/Node、声调符号、短语与自定义覆盖、仍在维护 | 采用为构建期候选生成器，锁定 `3.29.3` |
| [pypinyin](https://github.com/mozillazg/python-pinyin) | 成熟 Python 生态、短语词典与自定义读音 | 未来批量内容的离线第二校验器，不进入浏览器 |
| [hotoo/pinyin](https://github.com/hotoo/pinyin) | JS、多种输出格式 | 可用，但当前包版本线与覆盖工作流不如首选清晰 |
| [cnchar](https://github.com/theajack/cnchar) | 多端、汉字工具能力广 | 对当前一首诗过重 |
| [tiny-pinyin](https://www.npmjs.com/package/tiny-pinyin) | 轻量 | 不支持多音字且维护停滞，不采用 |

UI 使用 W3C 的语义化 `<ruby>/<rt>` 逐字对应；拼音在汉字上方，使用声调符号。低年级阅读模式默认显示，孩子可随时隐藏；隐藏时保留排版空间，避免诗句跳动。朗读时当前诗句的汉字与拼音同步强调，其余诗句保持可读。

浏览器不运行完整拼音词典。`pinyin-pro` 只在构建检查中产生候选，儿童端读取已提交、已审核的逐 token 数据，避免设备、库版本或分词结果改变孩子看到的读音。

当前采用现代标准普通话儿童朗读，不混入唐代中古音重构。重点锁定：`遥看 kàn`、`瀑布 pù bù`、`疑是 yí shì`、`落九天 luò jiǔ tiān`。标题与特殊读音可以使用绑定到具体诗句路径的 override，禁止把某个多音字做成全局替换。

规范与呈现依据：

- [W3C HTML Ruby Markup Extensions](https://www.w3.org/TR/html-ruby-extensions/)
- [国家标准 GB/T 16159-2012](https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=5645BD8DB9D8D73053AD3A2397E15E74)
- [教育部《汉语拼音方案》](https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html)
- [教育部《普通话异读词审音表》](https://hudong.moe.gov.cn/jyb_sjzl/ziliao/A19/201001/t20100115_75598.html)
- [人民教育出版社《望庐山瀑布》原文](https://www.pep.com.cn/xw/zt/hd/ywsd/sfsd/2s/201901/t20190103_1934779.shtml)

## 内容与构建门槛

拼音真值位于 `content/wang-lushan-pubu.js`。每个汉字是独立 token，标点也是 token 但没有拼音。`scripts/check-pinyin.mjs` 检查：

- 原文、token、标点和换行完全对应；
- 每个汉字有带声调符号的拼音，不接受数字声调；
- `tone` 元数据与声调符号一致；
- 自动候选与 curated 读音不一致时，必须存在路径级 override；
- 审核、来源与生成器版本元数据存在。

运行：

```bash
npm install
npm run check
```

## Experience Evaluator

页面加载 `evaluation/experience-evaluator.js`，结果写入 `#experience-evaluator-output`，同时提供 `window.__SHANHE_EVALUATOR__.run()`。它不读取、记录或上传孩子输入的文字。

当前自动/半自动检查：

- Primary Content 与 secondary interaction 的矩形相交；
- 每句中心和四角的命中层，发现透明或悬浮层遮挡；
- 四句的尺寸、透明度、viewport 可见性与页面滚动可达性；
- 拼音/汉字一对一、拼音在字上方、标点未换行；
- 文本尺寸、淡化透明度、横向溢出；
- 儿童按钮至少 44×44px；
- 阅读阶段 secondary control 数量；
- 小屏反思态是否有“回看全诗”；
- 输入聚焦后是否仍在 visual viewport 内。

复杂山水背景上的真实阅读舒适度仍需截图与人工 critique；本轮自动检查就曾通过几何验收，但人工截图发现移动端第三句对比度不足，随后提高了移动端阅读区域的柔和亮度层。

## 实际验收记录

真实本地页面状态矩阵已检查：

| Viewport | 阅读态 | AI 提问 / 输入 / 完成态 |
| --- | --- | --- |
| 1440×720 | 四句完整可见；拼音与标点对齐；无覆盖 | 两列普通流，诗与提问空间完全分离，evaluator 通过 |
| 1440×900 | 四句、来源、控制区清晰；evaluator 通过 | 同上 |
| 1024×768 | 四句完整可见且可继续滚动 | 纵向普通流；“回看全诗”可见；evaluator 通过 |
| 390×844 | 四句完整可见；移动端背景亮度修正后可读 | 提问在诗后；回看入口可见；跟进与完成态 evaluator 通过 |
| 488×642 | 四句完整可见，控制与入口可滚动触达 | 无固定高度裁切或横向溢出 |
| 390×600 | 四句完整可见，入口在下方可滚动触达 | 无裁切；完成态可返回全诗 |
| 390×500（输入聚焦模拟） | — | 输入框与提交按钮保持在压缩后的可视区域内；evaluator 通过 |

## 本轮新发现

- 首次重构截图中，桌面端句尾标点因诗区宽度不足换到了下一行；新增视觉对齐检查后已修复。
- 移动端第三句虽然几何可见，但落在深色山体上、阅读舒适度不合格；自动几何检查未发现，人工 critique 后已修复。
- 浏览器 `speechSynthesis` 中文音色和可用性仍随设备变化，当前只能验证控制流程与逐句强调，不能作为最终儿童朗读品质。
- 本轮是浏览器 viewport 与键盘压缩模拟，不等于真机软键盘、字体缩放和辅助功能完整验收；进入儿童测试前仍应补一轮至少一台 iOS 与一台 Android 真机检查。
