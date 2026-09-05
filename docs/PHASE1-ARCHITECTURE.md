# 山河诗境 Phase 1 架构

## 体验模型

```text
World 山河地图
  → Lens 地点选择与周边关系
    → Presence 场景图 + 空间路径 + 完整诗文
      → Learning 朗读 / 拼音 / 观察 / Tutor
        → Memory 足迹与完成状态
          → Journey 有依据的下一站理由
```

五种角色不是五套页面复制：它们消费同一个内容注册表和进度模型。地图不承担答题面板，Tutor 不拥有悬浮层，朗读不改变正文结构。

## 运行时边界

- `content/phase1/index.js`：10 首 Gold Standard 与 5 个完整地点入口。
- `content/phase1/places.js`：5 个地点、现代参考坐标、有效时间、精度、周边关系、来源和争议。
- `content/phase1/poems.js`：10 首完整学习单元、逐字拼音、年龄层、Tutor 问题、空间关系、来源和 override。
- `content/catalog/*`：100 首目录的 raw snapshot、curated selection、override 和生成 runtime。
- `content/curriculum/index.js`：100 首标准目录的课程 claims、成熟度、8 条文化区域、42 个地理节点、17 个概念及关系生成器。
- `core/concept-tutor.js`：本地 source-bound Concept Tutor 与三年龄层发现步骤。
- `core/progress-store.js`：v2 本地状态、旧状态迁移、隐私清理。
- `core/tutor-engine.js`：远端 Provider 协议和 grounded local fallback；前端无密钥。
- `core/audio-provider.js`：Web Speech 与 silent fallback、播放 session 隔离。
- `app.js`：通用地图、教材纵轴、概念发现、标准阅读、今日、挑战、足迹和 UI 协调。
- `evaluation/experience-evaluator.js`：几何、可读性、触控、认知负荷、Jargon Guard、课程/语料/地理/成熟度与 console 检查。

## 数据与隐私

- 稳定 ID 同时连接地点、诗、进度和下一站。
- 坐标为现代参考，不冒充诗人确切站位或历史路线。
- 儿童自由输入只在当前页面内存中用于回应；本地只保存完成状态、提示使用、年龄/拼音/声音偏好和城市级出发地。
- 诗文与自动候选分离；100 首都可打开标准页，75 首具备引导能力，30 首进入沉浸层；只有 10 首拥有完整人工逐字拼音和 Gold Standard 内容。

## QA 入口

```bash
npm run build:catalog
npm run check
```

浏览器：`window.__SHANHE_EVALUATOR__.run()`。测试参数：`qaTextScale=125|150`、`qaReducedMotion=1`、`qaTutorUnavailable=1`、`qaAudioUnavailable=1`。
