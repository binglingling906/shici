#!/usr/bin/env node

/** Build-time and CI checks for the Phase 1 content contract. */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pinyin } from "pinyin-pro";
import { phase1Places, phase1Poems } from "../content/phase1/index.js";
import { curatedSelection } from "../content/catalog/curated-selection.js";
import { curatedOverrides } from "../content/catalog/curated-overrides.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const RAW_PATH = resolve(ROOT, "content/catalog/raw-candidates.json");
const RUNTIME_PATH = resolve(ROOT, "content/catalog/phase1-runtime.json");
const PUNCTUATION = new Set(["，", "。", "！", "？", "；", "：", "、", "·", "“", "”", "‘", "’", "（", "）", "《", "》", "〈", "〉", "「", "」", "『", "』", ",", ".", "!", "?", ";", ":", "'", '"', "(", ")"]);
const TONE_MARKS = [
  /[āēīōūǖ]/u,
  /[áéíóúǘńḿ]/u,
  /[ǎěǐǒǔǚň]/u,
  /[àèìòùǜǹ]/u,
];
const KNOWN_INVALID_RUNTIME_FRAGMENTS = [
  { fragment: "但余钟磬音", reason: "《鹿柴》候选快照误录；运行时必须由有来源的人工 override 修正为‘但闻人语响’" },
];
const errors = [];

function fail(message) {
  errors.push(message);
}

function toneNumber(value) {
  const index = TONE_MARKS.findIndex((pattern) => pattern.test(value));
  return index >= 0 ? index + 1 : 5;
}

function assertToneMark(value, path) {
  if (!value) {
    fail(`${path} has missing pinyin`);
    return;
  }
  if (/[1-5]/u.test(value)) fail(`${path} uses numeric tone: ${value}`);
  if (!TONE_MARKS.some((pattern) => pattern.test(value))) fail(`${path} has no tone mark: ${value}`);
}

function candidatePinyin(text) {
  const result = pinyin(text, { toneType: "symbol", type: "array" });
  return Array.isArray(result) ? result : [result];
}

function checkPlace(place, poemIds) {
  const required = ["id", "name", "type", "modernCity", "region", "precision", "confidence", "validTime"];
  for (const field of required) if (!place[field]) fail(`place ${place.id || "(unknown)"} missing ${field}`);
  if (!Array.isArray(place.coordinates) || place.coordinates.length !== 2) fail(`place ${place.id} needs [longitude, latitude] coordinates`);
  if (!Array.isArray(place.poemIds) || place.poemIds.length !== 2) fail(`place ${place.id} must have exactly two poem IDs`);
  for (const poemId of place.poemIds) {
    if (!poemIds.has(poemId)) fail(`place ${place.id} references unknown poem ${poemId}`);
  }
  if (!place.provenance?.sources?.length) fail(`place ${place.id} missing provenance sources`);
  if (place.review?.status !== "curated") fail(`place ${place.id} is not marked curated`);
}

function checkPoem(poem, poemIds) {
  const required = ["id", "dynasty", "genre", "placeId", "text", "background", "nextPlaceId", "nextReason", "interpretation"];
  for (const field of required) if (!poem[field]) fail(`poem ${poem.id || "(unknown)"} missing ${field}`);
  if (poemIds.has(poem.id)) fail(`duplicate complete poem ID ${poem.id}`);
  poemIds.add(poem.id);
  if (!poem.title?.text || !poem.title?.pinyin) fail(`poem ${poem.id} missing title text/pinyin`);
  if (!poem.author?.name || !poem.author?.pinyin) fail(`poem ${poem.id} missing author text/pinyin`);
  const titleChars = [...poem.title.text].filter((char) => !PUNCTUATION.has(char)).length;
  const titlePinyinCount = poem.title.pinyin.trim().split(/\s+/u).filter(Boolean).length;
  if (titleChars !== titlePinyinCount) fail(`poem ${poem.id} title has ${titleChars} spoken chars but ${titlePinyinCount} pinyin tokens`);
  for (const token of poem.author.pinyin.trim().split(/\s+/u)) assertToneMark(token, `${poem.id}.author`);
  if (poem.text !== poem.lines.map((line) => line.text).join("\n")) fail(`poem ${poem.id} text does not preserve line breaks`);
  if (!Array.isArray(poem.lines) || poem.lines.length < 2) fail(`poem ${poem.id} needs at least two lines`);
  if (!poem.interpretation?.summary) fail(`poem ${poem.id} interpretation is missing summary`);
  if (!Array.isArray(poem.interpretation?.lineMeanings) || poem.interpretation.lineMeanings.length !== poem.lines.length) {
    fail(`poem ${poem.id} interpretation needs one line meaning per poem line`);
  } else {
    const expectedLineIds = poem.lines.map((line) => line.id);
    const actualLineIds = poem.interpretation.lineMeanings.map((entry) => entry?.lineId);
    if (actualLineIds.some((lineId, index) => lineId !== expectedLineIds[index])) {
      fail(`poem ${poem.id} interpretation lineIds do not align with poem lines`);
    }
    for (const [index, entry] of poem.interpretation.lineMeanings.entries()) {
      if (!entry?.meaning) fail(`poem ${poem.id} ${expectedLineIds[index]} interpretation is missing meaning`);
    }
  }
  for (const field of ["title", "text", "prompt"]) {
    if (!poem.interpretation?.extension?.[field]) fail(`poem ${poem.id} interpretation extension is missing ${field}`);
  }
  const overrides = new Map(Object.entries(poem.pronunciationOverrides || {}));
  if (!overrides.has("title")) fail(`poem ${poem.id} needs a title override record`);
  const titleOverride = overrides.get("title");
  if (titleOverride?.text !== poem.title.text || titleOverride?.pinyin !== poem.title.pinyin || titleOverride?.path !== "title") {
    fail(`poem ${poem.id} title override is inconsistent`);
  }
  for (const [lineIndex, line] of poem.lines.entries()) {
    const linePath = `line-${lineIndex + 1}`;
    if (!Array.isArray(line.tokens) || !line.tokens.length) {
      fail(`${poem.id}.${linePath} has no tokens`);
      continue;
    }
    if (line.tokens.map((token) => token.char).join("") !== line.text) fail(`${poem.id}.${linePath} token chars break text`);
    const candidates = candidatePinyin(line.text);
    if (candidates.length !== line.tokens.length) fail(`${poem.id}.${linePath} candidate/token length mismatch (${candidates.length}/${line.tokens.length})`);
    for (const [tokenIndex, token] of line.tokens.entries()) {
      const path = `${linePath}.token-${tokenIndex + 1}`;
      const isPunctuation = Boolean(token.punctuation) || PUNCTUATION.has(token.char);
      const override = overrides.get(path);
      if (isPunctuation) {
        if (!token.punctuation || token.pinyin || token.tone !== undefined) fail(`${poem.id}.${path} punctuation must not carry pinyin`);
        if (override) fail(`${poem.id}.${path} cannot override punctuation`);
        continue;
      }
      if ([...token.char].length !== 1) fail(`${poem.id}.${path} must contain exactly one Chinese character`);
      assertToneMark(token.pinyin, `${poem.id}.${path}`);
      if (token.tone !== toneNumber(token.pinyin)) fail(`${poem.id}.${path} tone metadata does not match ${token.pinyin}`);
      if (override && (override.path !== path || override.char !== token.char || override.pinyin !== token.pinyin)) fail(`${poem.id}.${path} override is inconsistent`);
      const candidate = candidates[tokenIndex];
      if (candidate && candidate !== token.pinyin && !override) fail(`${poem.id}.${path} differs from pinyin-pro candidate; add a path-specific override`);
    }
  }
  for (const [path, override] of overrides) {
    if (path === "title") continue;
    const match = /^(line-(\d+)\.token-(\d+))$/u.exec(path);
    if (!match) fail(`${poem.id} override path ${path} is not line-N.token-N`);
    const token = poem.lines[Number(match?.[2]) - 1]?.tokens?.[Number(match?.[3]) - 1];
    if (!token) fail(`${poem.id} override ${path} points to no token`);
  }
  for (const age of ["7-8", "9-10", "11-12"]) {
    const band = poem.ageBands?.[age];
    for (const field of ["explanation", "openingQuestion", "hint", "followUp", "completionStandard"]) {
      if (!band?.[field]) fail(`${poem.id} ${age} missing ${field}`);
    }
  }
  if (!poem.placeRelations?.length) fail(`poem ${poem.id} missing place relation type`);
  if (!poem.provenance?.sources?.length) fail(`poem ${poem.id} missing provenance sources`);
  if (poem.review?.status !== "curated") fail(`poem ${poem.id} is not marked curated`);
}

function checkCatalog(rawSnapshot, runtime) {
  if (rawSnapshot.candidates?.length !== 100) fail(`raw snapshot has ${rawSnapshot.candidates?.length} candidates; expected 100`);
  if (curatedSelection.length !== 100) fail(`curated selection has ${curatedSelection.length} entries; expected 100`);
  if (runtime.catalog?.length !== 100) fail(`runtime catalog has ${runtime.catalog?.length}; expected 100`);
  const rawIds = new Set(rawSnapshot.candidates.map((candidate) => candidate.sourceId));
  if (rawIds.size !== rawSnapshot.candidates.length) fail("raw source IDs are not unique");
  const selectionIds = new Set();
  const selectionSourceIds = new Set();
  for (const selection of curatedSelection) {
    if (selectionIds.has(selection.id)) fail(`duplicate curated stable ID ${selection.id}`);
    selectionIds.add(selection.id);
    if (selectionSourceIds.has(selection.sourceId)) fail(`source mapped twice: ${selection.sourceId}`);
    selectionSourceIds.add(selection.sourceId);
    if (!rawIds.has(selection.sourceId)) fail(`curation points to absent raw source ${selection.sourceId}`);
    if (!Array.isArray(selection.placeCandidates) || !selection.placeCandidates.length) fail(`curation ${selection.id} missing place candidates`);
    if (!Array.isArray(selection.themes) || !selection.themes.length) fail(`curation ${selection.id} missing themes`);
    if (!Array.isArray(selection.ageRange) || selection.ageRange.length !== 2) fail(`curation ${selection.id} missing age range`);
  }
  if (selectionSourceIds.size !== rawIds.size) fail("not every raw candidate is represented by curation");
  const runtimeIds = new Set();
  for (const item of runtime.catalog) {
    if (runtimeIds.has(item.id)) fail(`duplicate runtime catalog ID ${item.id}`);
    runtimeIds.add(item.id);
    for (const field of ["id", "title", "author", "dynasty", "genre", "text", "placeCandidates", "placeRelationTypes", "themes", "ageRange", "scores", "textbookCommon", "sourceSnapshot", "curation", "priority"]) {
      if (item[field] === undefined || item[field] === null) fail(`runtime ${item.id} missing ${field}`);
    }
    for (const key of ["length", "languageClarity", "imageClarity", "placeClarity", "textbookFamiliarity", "spatialLearningValue", "culturalRepresentation"]) {
      if (!Number.isInteger(item.scores[key]) || item.scores[key] < 1 || item.scores[key] > 5) fail(`runtime ${item.id} has invalid score ${key}`);
    }
    if (!item.sourceSnapshot.sourceId || !item.provenance?.curatedLayer) fail(`runtime ${item.id} missing source/curated provenance`);
    for (const risk of KNOWN_INVALID_RUNTIME_FRAGMENTS) {
      if (item.text.includes(risk.fragment)) fail(`runtime ${item.id} contains known invalid text ‘${risk.fragment}’: ${risk.reason}`);
    }
    if (item.id === "child-qi-bu-shi" && item.genre !== "五言古诗") {
      fail(`runtime ${item.id} must preserve the source-checked five-character genre override`);
    }
  }
  for (const [id, override] of Object.entries(curatedOverrides)) {
    // Archived intermediate review records are intentionally kept for audit history
    // but are not part of the runtime catalog and therefore are not expected to apply.
    if (id.endsWith("-legacy")) continue;
    const item = runtime.catalog.find((candidate) => candidate.id === id);
    if (!item) fail(`curated override ${id} absent from runtime`);
    if (!item.curation.overrideApplied) fail(`curated override ${id} was not applied`);
    if ((override.title !== undefined && item.title !== override.title)
      || (override.text !== undefined && item.text !== override.text)
      || (override.author !== undefined && item.author !== override.author)
      || (override.dynasty !== undefined && item.dynasty !== override.dynasty)
      || (override.genre !== undefined && item.genre !== override.genre)) {
      fail(`curated override ${id} changed during build`);
    }
    if (override.overrideSource && item.curation.overrideSource?.url !== override.overrideSource.url) {
      fail(`curated override ${id} lost its source evidence`);
    }
  }
}

async function main() {
  const rawSnapshot = JSON.parse(await readFile(RAW_PATH, "utf8"));
  let runtime;
  try {
    runtime = JSON.parse(await readFile(RUNTIME_PATH, "utf8"));
  } catch {
    fail("runtime output is missing; run npm run build:phase1 first");
    runtime = { catalog: [] };
  }
  if (phase1Places.length !== 5) fail(`complete places count ${phase1Places.length}; expected 5`);
  if (phase1Poems.length !== 10) fail(`complete poems count ${phase1Poems.length}; expected 10`);
  const poemIds = new Set();
  const placeIds = new Set();
  for (const place of phase1Places) {
    if (placeIds.has(place.id)) fail(`duplicate place ID ${place.id}`);
    placeIds.add(place.id);
    checkPlace(place, new Set(phase1Poems.map((poem) => poem.id)));
  }
  for (const poem of phase1Poems) checkPoem(poem, poemIds);
  for (const poem of phase1Poems) if (!placeIds.has(poem.placeId)) fail(`poem ${poem.id} points to unknown place ${poem.placeId}`);
  checkCatalog(rawSnapshot, runtime);
  if (runtime.schemaVersion !== 2 || runtime.pipeline?.deterministic !== true) fail("runtime pipeline metadata is incomplete");
  if (errors.length) {
    console.error("Phase 1 content check failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  const tokenCount = phase1Poems.reduce((sum, poem) => sum + poem.lines.reduce((lineSum, line) => lineSum + line.tokens.length, 0), 0);
  console.log(`Phase 1 content check passed: ${phase1Places.length} places, ${phase1Poems.length} complete poems, ${tokenCount} line tokens, ${runtime.catalog.length} catalog candidates.`);
  console.log(`All 10 poems carry curated ruby-above pinyin, age bands, spatial relations, provenance and overrides.`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
