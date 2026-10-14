# 山河诗境 · Shanhe Shijing

面向 7–12 岁儿童的中国古诗词 × 中国地理学习世界。

**English:** *Shanhe Shijing is a geography-grounded poetry learning world for children aged 7–12. It connects poems with landscapes, places, historical context and child-led expression through a calm, local-first learning flow.*

## 为什么做

很多古诗学习产品把目标缩成“看答案、背下来”。山河诗境把地图作为第一扇门：孩子先进入一处山河，再读诗、听朗读、观察空间关系、用自己的话表达，最后通过无提示背诵和间隔复习留下学习印记。

## 当前真实能力

- 100 首标准学习页，可按年级、主题、诗人和地点检索；
- 10 首 Gold Standard 完整诗境，包含人工审核的正文、拼音、逐句释义、空间关系和年龄层引导；
- 75 首引导式学习内容、30 首沉浸式诗境候选；
- 中国物理山河地图、5 个重点地点、42 个地理节点和 8 条文化区域路径；
- 7–8、9–10、11–12 岁三种阅读方式；
- 拼音在汉字上方、逐句点读、浏览器中文朗读和轻环境音；
- 10 首已完成内容复核的诗词提供项目内逐句朗读 MP3 与时间轴，其他诗词自动降级为设备中文朗读；
- 本地诗句 Tutor：围绕当前诗句追问，不直接公布答案；
- 本地概念 Tutor：只回答已有来源和当前诗证据支持的概念；
- 读懂 → 会意 → 熟背 → 记牢的学习闭环；
- 1 / 3 / 7 天复习记录、收藏、阅读足迹和诗词本；
- 本地体验评估器与内容/空间/课程数据检查。

## AI 边界

默认版本不连接在线大模型，不需要登录或 API Key。Tutor 使用可解释的本地规则和已审核内容，确保 Demo 在断网时仍可运行。代码中预留了 `remote-grounded-tutor` Provider 接口，但当前没有配置远端服务，也不会把儿童自由表达自动发送到外部模型。

如果未来由家长明确开启远端 Tutor，页面只能通过 `data-tutor-endpoint` 指向一个由服务端保护密钥的 HTTPS 代理。代理接收 `poemId`、年龄模式、回合和最多 160 字的回答，必须返回有限字段（`kind`、`message`、可选 `microHint`）；前端会再次限长、去 HTML、禁止 `revealAnswer`，失败时回退到本地 Tutor。GitHub Pages 公开 Demo 不启用该入口。

## 内容成熟度

100 首不是同等审核等级：10 首是人工完整审核的 Gold Standard，其余 90 首标记为 `machine-assisted-candidate`，已具备正文、拼音、学习契约和关系元数据，但仍需逐首编辑复核。教材关系候选也不会被展示为已确认教材事实。

## 技术栈

- 原生 HTML / CSS / JavaScript ES modules
- SVG 与项目内生成的中国自然地理路径
- `pinyin-pro`：内容构建阶段的中文拼音候选生成
- Web Speech API：设备端中文朗读
- `localStorage`：本地学习进度
- Node.js 检查脚本与 Python 静态服务器

## 本地运行

```bash
npm install
npm run dev
```

然后打开 <http://127.0.0.1:4173/>。

运行完整检查：

```bash
npm run check
node scripts/check-100-learning-layer.mjs
```

## Hackathon Demo 路径

地图 → 庐山 → 《望庐山瀑布》 → 拼音/朗读 → 逐句理解 → 主动表达 → 无提示背诵 → 学习印记。

当前本地预览：<http://127.0.0.1:4174/#poem/lushan-wang-lushan-pubu>

在线 Demo：<https://binglingling906.github.io/shici/>

## 截图与审计资料

此前的桌面、平板、手机和键盘输入截图保存在 `docs/audits/`。公开发布前会重新捕获一组只包含公开资源的 Demo 截图。

## Roadmap

1. 逐首复核剩余 90 首候选诗的正文、拼音、释义和教材关系；
2. 为重点地点补充更一致的诗境视觉资源；
3. 在明确隐私与监护人同意方案后，再评估远端模型 Tutor；
4. 持续进行公开 Demo 的真实手机验收与体验修正；
5. 根据亲子共读观察调整问题难度和复习节奏。

## 已知限制

- 10 首复核诗使用项目内 Tingting 系统生成的逐句音频，其他候选诗仍会因设备 TTS 能力而异；
- 学习记录仅保存在当前浏览器，不跨设备同步；
- 100 首中只有 10 首达到完整人工审核标准；
- 未配置在线 AI 服务、账号系统或服务端数据库；
- 地理关系表示现代参考位置，不自动等同于诗人的历史行程。

## 项目开发状态

AI Builder 黑客松 Demo / Experience Discovery 阶段。项目优先验证“地图能否帮助孩子理解诗”，而不是追求功能数量或虚构用户规模。
