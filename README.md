# 山河诗境

面向 7–12 岁儿童的中国古诗词 × 中国地理 AI Native 学习世界。

当前运行时包含 100 首标准学习页、75 首引导式学习、30 首沉浸式诗境、8 条文化地理路线、42 个地理节点、17 个可问概念和 3 种年龄阅读方式。10 首原始诗境仍是 Gold Standard；教材候选与逐项已核声明分开显示。

## 本地运行

```bash
cd /Users/chenghaihui/Desktop/shici/shici
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173/`。

## 构建与检查

```bash
npm install
npm run build:catalog
npm run check
```

`build:catalog` 由 raw snapshot + curated selection + override 确定性生成 100 首 runtime；`check` 验证完整内容、逐字上方拼音、年龄层、Provider/进度契约、课程声明、Concept Tutor、空间数据和内容成熟度诚实性。

## 关键文档

- `docs/PHASE1-ARCHITECTURE.md`
- `docs/CURRICULUM-CONCEPT-SYSTEM.md`
- `docs/research/corpus-source-report.md`
- `docs/research/phase1-content-sources.md`
- `docs/research/phase1-external-intelligence.md`
- `docs/audits/curriculum-concept/after/audit.md`
- `docs/audits/phase1/after/audit.md`
- `design-qa.md`
