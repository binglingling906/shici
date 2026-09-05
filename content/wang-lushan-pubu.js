/**
 * Curated reading data for 李白《望庐山瀑布》.
 *
 * Every spoken character is kept as a token so that the UI can render a
 * one-to-one ruby pair.  Punctuation is deliberately represented as a token
 * too, but carries no pinyin and never receives an <rt> element.
 */
export const poem = {
  id: "wang-lushan-pubu",
  title: {
    text: "望庐山瀑布",
    pinyin: "wàng lú shān pù bù",
  },
  author: {
    text: "李白",
    pinyin: "Lǐ Bái",
  },
  dynasty: "唐",
  lines: [
    {
      id: "line-1",
      text: "日照香炉生紫烟，",
      tokens: [
        { char: "日", pinyin: "rì", tone: 4 },
        { char: "照", pinyin: "zhào", tone: 4 },
        { char: "香", pinyin: "xiāng", tone: 1 },
        { char: "炉", pinyin: "lú", tone: 2 },
        { char: "生", pinyin: "shēng", tone: 1 },
        { char: "紫", pinyin: "zǐ", tone: 3 },
        { char: "烟", pinyin: "yān", tone: 1 },
        { char: "，", punctuation: true },
      ],
    },
    {
      id: "line-2",
      text: "遥看瀑布挂前川。",
      tokens: [
        { char: "遥", pinyin: "yáo", tone: 2 },
        { char: "看", pinyin: "kàn", tone: 4 },
        { char: "瀑", pinyin: "pù", tone: 4 },
        { char: "布", pinyin: "bù", tone: 4 },
        { char: "挂", pinyin: "guà", tone: 4 },
        { char: "前", pinyin: "qián", tone: 2 },
        { char: "川", pinyin: "chuān", tone: 1 },
        { char: "。", punctuation: true },
      ],
    },
    {
      id: "line-3",
      text: "飞流直下三千尺，",
      tokens: [
        { char: "飞", pinyin: "fēi", tone: 1 },
        { char: "流", pinyin: "liú", tone: 2 },
        { char: "直", pinyin: "zhí", tone: 2 },
        { char: "下", pinyin: "xià", tone: 4 },
        { char: "三", pinyin: "sān", tone: 1 },
        { char: "千", pinyin: "qiān", tone: 1 },
        { char: "尺", pinyin: "chǐ", tone: 3 },
        { char: "，", punctuation: true },
      ],
    },
    {
      id: "line-4",
      text: "疑是银河落九天。",
      tokens: [
        { char: "疑", pinyin: "yí", tone: 2 },
        { char: "是", pinyin: "shì", tone: 4 },
        { char: "银", pinyin: "yín", tone: 2 },
        { char: "河", pinyin: "hé", tone: 2 },
        { char: "落", pinyin: "luò", tone: 4 },
        { char: "九", pinyin: "jiǔ", tone: 3 },
        { char: "天", pinyin: "tiān", tone: 1 },
        { char: "。", punctuation: true },
      ],
    },
  ],
  source: {
    text: "《全唐诗》卷一百八十",
    referenceUrl: "https://www.pep.com.cn/xw/zt/hd/ywsd/sfsd/2s/201901/t20190103_1934779.shtml",
    license: "Public domain text; pronunciation layer is project-curated.",
  },
  pronunciation: {
    variety: "cmn-Hans-CN",
    mode: "modern-standard-mandarin",
    toneMarks: true,
    candidateGenerator: "pinyin-pro@3.29.3",
    delivery: "committed-curated-tokens",
    standards: [
      "GB/T 16159-2012",
      "汉语拼音方案",
      "普通话异读词审音表",
    ],
  },
  review: {
    status: "curated",
    reviewedAt: "2026-09-01",
    reviewer: "shanhe-content-review",
    notes: "Modern Mandarin reading selected for primary-school learners; literary variants are kept out of this first slice.",
  },
  // Keys are local paths, never global character replacements.  They protect
  // context-sensitive readings when future generators produce candidates.
  pronunciationOverrides: {
    title: {
      path: "title",
      text: "望庐山瀑布",
      pinyin: "wàng lú shān pù bù",
      reason: "Poem title is read as a place/name phrase.",
    },
    "line-2.token-2": {
      path: "line-2.token-2",
      char: "看",
      pinyin: "kàn",
      reason: "Verb: to look from afar (遥看).",
    },
    "line-2.token-3": {
      path: "line-2.token-3",
      char: "瀑",
      pinyin: "pù",
      reason: "The first character of 瀑布.",
    },
    "line-4.token-1": {
      path: "line-4.token-1",
      char: "疑",
      pinyin: "yí",
      reason: "Verb: to seem / to suspect (疑是).",
    },
    "line-4.token-5": {
      path: "line-4.token-5",
      char: "落",
      pinyin: "luò",
      reason: "Verb: to fall into the sky (落九天).",
    },
  },
};

export default poem;
