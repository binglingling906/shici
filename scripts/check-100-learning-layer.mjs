import fs from "node:fs";

const runtime = JSON.parse(fs.readFileSync("content/catalog/phase1-runtime.json", "utf8"));
const catalog = runtime.catalog || [];
const requiredStages = ["原文+拼音", "去拼音", "隐藏关键词", "首字提示", "画面线索", "完全隐藏"];
const failures = [];
if (catalog.length !== 100) failures.push(`catalog expected 100, got ${catalog.length}`);
for (const item of catalog) {
  const contract = item.learningContract;
  const lines = item.lineTokens || [];
  const reviewed = Boolean(item.review?.meaningReviewed || (item.review?.pinyinReviewed && item.review?.geoReviewed))
    && (contract?.status === "curated_content_v1" || contract?.status === "approved_full_experience");
  if (!contract || (!reviewed && contract.status !== "machine-assisted-candidate")) failures.push(`${item.id}: missing candidate or reviewed learning contract`);
  if (!lines.length || lines.some((line) => !line.tokens?.length || line.tokens.some((token) => !token.punctuation && !token.pinyin))) failures.push(`${item.id}: incomplete ruby-above pinyin tokens`);
  if (contract && contract.understanding?.lineMeanings?.length !== lines.length) failures.push(`${item.id}: line meaning count mismatch`);
  const stages = contract?.recitation?.stages || [];
  if (contract && (reviewed ? !stages.some((stage) => /原文.*拼音/u.test(stage)) || !stages.some((stage) => /去拼音/u.test(stage)) || !stages.some((stage) => /关键词/u.test(stage)) || !stages.some((stage) => /首字/u.test(stage)) || !stages.some((stage) => /画面/u.test(stage)) || !stages.some((stage) => /完全隐藏|无提示/u.test(stage)) : JSON.stringify(stages) !== JSON.stringify(requiredStages))) failures.push(`${item.id}: recitation stages incomplete`);
  if (contract && JSON.stringify(contract.retention?.intervalsDays) !== JSON.stringify([1, 3, 7])) failures.push(`${item.id}: review intervals incomplete`);
  if (!item.placeCandidates?.length || !item.themes?.length) failures.push(`${item.id}: relationship metadata incomplete`);
  if (reviewed && (!item.review?.textReviewed || !item.review?.pinyinReviewed || !item.review?.meaningReviewed || !item.review?.geoReviewed)) failures.push(`${item.id}: reviewed item missing review flags`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`100-poem learning layer passed: ${catalog.length} poems, pinyin, learning contracts and relationship metadata present.`);
