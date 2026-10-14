import fs from "node:fs";
import { pinyin } from "pinyin-pro";
import { curatedMasteryContentByPoemId } from "../content/phase1/mastery-content.js";
import { curatedOverrides } from "../content/catalog/curated-overrides.js";

const path = "content/catalog/phase1-runtime.json";
const runtime = JSON.parse(fs.readFileSync(path, "utf8"));
const punctuation = new Set(["，", "。", "！", "？", "；", "：", "、", "·", "“", "”", "‘", "’", "（", "）", ",", ".", "!", "?", ";", ":"]);
const split = (text, genre = "") => /词|曲/u.test(genre)
  ? String(text || "").split(/\r?\n/u).map((line) => line.trim()).filter(Boolean)
  : String(text || "").split(/\n+/u).flatMap((line) => line.match(/[^，。！？；]+[，。！？；]?/gu) || []).map((line) => line.trim()).filter(Boolean);

function lineTokens(text) {
  const sounds = pinyin(text, { toneType: "symbol", type: "array" });
  let index = 0;
  return Array.from(text, (char) => punctuation.has(char)
    ? { char, punctuation: true }
    : { char, pinyin: sounds[index++] || "", tone: 5 });
}

function toneNumber(value) {
  if (/[āēīōūǖ]/u.test(value)) return 1;
  if (/[áéíóúǘńḿ]/u.test(value)) return 2;
  if (/[ǎěǐǒǔǚň]/u.test(value)) return 3;
  if (/[àèìòùǜǹ]/u.test(value)) return 4;
  return 5;
}

function applyPronunciationOverrides(item, lines) {
  const overrides = Array.isArray(item.pronunciationOverrides) ? item.pronunciationOverrides : [];
  for (const override of overrides) {
    const match = /^line-(\d+)\.token-(\d+)$/u.exec(override.path || "");
    if (!match) continue;
    const line = lines[Number(match[1]) - 1];
    const token = line?.tokens?.[Number(match[2]) - 1];
    if (!token || token.char !== override.char) {
      throw new Error(`${item.id}: pronunciation override ${override.path} does not match runtime token`);
    }
    token.pinyin = override.pinyin;
    token.tone = toneNumber(override.pinyin);
    token.pronunciationReview = override.reason;
  }
}

function reviewedLearningContract(item, content, lines) {
  if (!content) return null;
  const lineIds = lines.map((line) => line.id);
  const lineMeanings = content.lineMeanings.map((entry, index) => ({
    ...entry,
    lineId: lineIds[index],
    childMeaning: entry.meaning,
    keyWords: [...entry.keywords],
    commonMisunderstanding: entry.misunderstanding,
    imagePrompt: entry.picture || entry.prompt,
  }));
  return {
    status: item.curation?.reviewStatus || "curated_content_v1",
    understanding: {
      lineMeanings,
      wholeMeaning: content.wholeMeaning,
      mainContent: content.mainContent,
      evidenceLines: lineIds,
      completionEvidence: "孩子用自己的话、关键词或画面说明每句大意，并能把诗句和画面对应起来；点击展开不单独算完成。",
      requiresEvidence: true,
    },
    theme: {
      mainContent: content.mainContent,
      emotion: content.emotion,
      centralIdea: content.centralIdea,
      evidenceLines: lineIds,
      acceptedExpressions: ["用自己的话说", "意思相近即可", "可以先说出画面"],
      allowReasonableExpression: true,
      matchMode: "semantic-paraphrase",
    },
    recitation: {
      stages: ["原文+拼音", "without pinyin / 去拼音", "隐藏关键词", "首字提示", "画面线索", "完全隐藏 / 无提示完整背诵"],
      memoryKeywords: content.memoryKeywords.map((entry, index) => ({ ...entry, lineId: lineIds[index] })),
      firstCharacterHints: content.firstCharacterHints.map((entry, index) => ({ ...entry, lineId: lineIds[index] })),
      verification: { requiresNoPrompt: true, unassistedEvidence: "隐藏正文和拼音后从头到尾背出，允许一次轻微自我纠正；AI语音仅作辅助证据。" },
    },
    statuses: [
      { id: "understood", label: "读懂印" },
      { id: "interpreted", label: "会意印" },
      { id: "recited", label: "熟背印" },
      { id: "retained", label: "记牢印" },
    ],
    retention: { intervalsDays: [1, 3, 7], rule: "次日、三日后、七日后再次无提示背诵，并回忆大意或核心画面。" },
  };
}

runtime.catalog = runtime.catalog.map((item) => {
  const lines = split(item.text, item.genre);
  const themes = item.themes?.length ? item.themes : ["画面", "语言"];
  item.titlePinyin = pinyin(item.title || "", { toneType: "symbol" });
  item.authorPinyin = pinyin(item.author || "", { toneType: "symbol" });
  const lineMeanings = lines.map((text, index) => ({
    lineId: `${item.id}-line-${index + 1}`,
    meaning: `先从原句找出${themes.slice(0, 2).join("和")}：这句写了“${text}”，再用自己的话说说画面怎样变化。`,
    keywords: themes.slice(0, 3),
    misunderstanding: "不要只把这句翻成单个词；要把它和前后句的画面连起来。",
    picture: `把“${text}”画成一个清楚的画面，并标出一个动作、景物或声音。`,
  }));
  item.lineTokens = lines.map((text, index) => ({ id: `${item.id}-line-${index + 1}`, text, tokens: lineTokens(text) }));
  applyPronunciationOverrides(item, item.lineTokens);
  const curatedContent = curatedMasteryContentByPoemId[item.id];
  item.learningContract = reviewedLearningContract(item, curatedContent, item.lineTokens) || {
    status: "machine-assisted-candidate",
    understanding: { lineMeanings, wholeMeaning: `这首诗围绕${themes.slice(0, 3).join("、")}展开，先看每句画面，再把它们连成整首诗的意思。`, mainContent: `作品通过${themes.slice(0, 3).join("、")}写出一个可观察、可复述的诗境。`, evidenceLines: lineMeanings.map((line) => line.lineId), requiresEvidence: true },
    theme: { mainContent: `作品通过${themes.slice(0, 3).join("、")}表达一种值得回到原句寻找证据的感受。`, emotion: "情感与中心意思待编辑复核；先用自己的话说感受。", centralIdea: "先说清诗中发生了什么，再说明它带来的感受。", evidenceLines: lineMeanings.map((line) => line.lineId), allowReasonableExpression: true, matchMode: "semantic-paraphrase" },
    recitation: { stages: ["原文+拼音", "去拼音", "隐藏关键词", "首字提示", "画面线索", "完全隐藏"], memoryKeywords: lineMeanings.map((line) => line.keywords.slice(0, 2)), firstCharacterHints: lines.map((line) => Array.from(line).find((char) => !punctuation.has(char)) || ""), verification: { requiresNoPrompt: true } },
    retention: { intervalsDays: [1, 3, 7] },
  };
  if (curatedContent?.extension) {
    item.interpretation = {
      summary: curatedContent.wholeMeaning,
      lineMeanings: curatedContent.lineMeanings.map((entry, index) => ({
        lineId: item.lineTokens[index].id,
        meaning: entry.meaning,
      })),
      extension: curatedContent.extension,
    };
  }
  if (item.spatialLearning) item.spatialLearning = { ...item.spatialLearning };
  if (item.placeRelations) item.placeRelations = item.placeRelations.map((relation) => ({ ...relation }));
  item.review = {
    ...(item.review || {}),
    ...(item.reviewFlags || {}),
    pinyinReviewed: Boolean(item.reviewFlags?.pinyinReviewed),
    textReviewed: Boolean(item.reviewFlags?.textReviewed),
    meaningReviewed: Boolean(item.reviewFlags?.meaningReviewed),
    geoReviewed: Boolean(item.reviewFlags?.geoReviewed),
    guidedReady: true,
    immersiveReady: Boolean(item.placeCandidates?.some((id) => id !== "unassigned")),
  };
  return item;
});
runtime.learningLayer = { total: runtime.catalog.length, generatedAt: new Date().toISOString().slice(0, 10), status: "100-poem-learning-catalog", note: "机器辅助候选内容必须经编辑复核后才可标记为 source-verified。" };
fs.writeFileSync(path, `${JSON.stringify(runtime, null, 2)}\n`);
console.log(`Generated learning layer for ${runtime.catalog.length} poems`);
