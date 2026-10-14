import fs from "node:fs";
import { pinyin } from "pinyin-pro";

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
  item.learningContract = {
    status: "machine-assisted-candidate",
    understanding: { lineMeanings, wholeMeaning: `这首诗围绕${themes.slice(0, 3).join("、")}展开，先看每句画面，再把它们连成整首诗的意思。`, mainContent: `作品通过${themes.slice(0, 3).join("、")}写出一个可观察、可复述的诗境。`, evidenceLines: lineMeanings.map((line) => line.lineId), requiresEvidence: true },
    theme: { mainContent: `作品通过${themes.slice(0, 3).join("、")}表达一种值得回到原句寻找证据的感受。`, emotion: "情感与中心意思待编辑复核；先用自己的话说感受。", centralIdea: "先说清诗中发生了什么，再说明它带来的感受。", evidenceLines: lineMeanings.map((line) => line.lineId), allowReasonableExpression: true, matchMode: "semantic-paraphrase" },
    recitation: { stages: ["原文+拼音", "去拼音", "隐藏关键词", "首字提示", "画面线索", "完全隐藏"], memoryKeywords: lineMeanings.map((line) => line.keywords.slice(0, 2)), firstCharacterHints: lines.map((line) => Array.from(line).find((char) => !punctuation.has(char)) || ""), verification: { requiresNoPrompt: true } },
    retention: { intervalsDays: [1, 3, 7] },
  };
  item.review = { ...(item.review || {}), pinyinReviewed: false, textReviewed: false, guidedReady: true, immersiveReady: Boolean(item.placeCandidates?.some((id) => id !== "unassigned")) };
  return item;
});
runtime.learningLayer = { total: runtime.catalog.length, generatedAt: new Date().toISOString().slice(0, 10), status: "100-poem-learning-catalog", note: "机器辅助候选内容必须经编辑复核后才可标记为 source-verified。" };
fs.writeFileSync(path, `${JSON.stringify(runtime, null, 2)}\n`);
console.log(`Generated learning layer for ${runtime.catalog.length} poems`);
