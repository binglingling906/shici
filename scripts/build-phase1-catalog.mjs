#!/usr/bin/env node

/**
 * Build the small Phase 1 runtime dataset.
 *
 * raw-candidates.json is treated as an immutable source snapshot.  The
 * shortlist and complete-unit modules are the curation layer.  This command
 * only writes phase1-runtime.json, so a source refresh cannot erase an
 * override by accident.
 */

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pinyin } from "pinyin-pro";
import { phase1Places, phase1Poems } from "../content/phase1/index.js";
import { curatedSelection } from "../content/catalog/curated-selection.js";
import { curatedOverrides } from "../content/catalog/curated-overrides.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const RAW_PATH = resolve(ROOT, "content/catalog/raw-candidates.json");
const OUTPUT_PATH = resolve(ROOT, "content/catalog/phase1-runtime.json");
const RETRIEVED_AT = "2026-09-01";
const COMPLETE_STATUS = "approved_full_experience";
const TEXT_PUNCTUATION = /[，。！？；：、‘’“”《》〈〉「」『』,.!?;:'"()（）\s]/u;
const SCORE_KEYS = [
  "length",
  "languageClarity",
  "imageClarity",
  "placeClarity",
  "textbookFamiliarity",
  "spatialLearningValue",
  "culturalRepresentation",
];

function fail(message) {
  throw new Error(`[phase1-build] ${message}`);
}

function normalizeText(value) {
  return String(value || "").replace(/\r\n?/gu, "\n").normalize("NFC").trim();
}

function textLength(text) {
  return Array.from(normalizeText(text)).filter((char) => !TEXT_PUNCTUATION.test(char)).length;
}

function clampScore(value) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function scoreCandidate(raw, selection) {
  const text = normalizeText(raw.text);
  const length = textLength(text);
  const lineCount = text.split("\n").filter(Boolean).length;
  const themeCount = selection.themes.length;
  const placeCount = selection.placeCandidates.filter((id) => id !== "unassigned").length;
  const familiar = selection.textbookCommon === "high" ? 5 : selection.textbookCommon === "medium" ? 3 : 2;
  const lengthScore = length <= 24 ? 5 : length <= 48 ? 4 : length <= 80 ? 3 : length <= 140 ? 2 : 1;
  const languageScore = clampScore(5 - Math.max(0, lineCount - 4) * 0.4 - Math.max(0, length - 80) / 70);
  const imageScore = clampScore(2.5 + themeCount * 0.6 + (placeCount ? 0.7 : 0));
  const placeScore = clampScore(placeCount ? 3.5 + Math.min(placeCount, 2) * 0.5 : 2);
  const spatialScore = clampScore((placeCount ? 3 : 2) + (selection.placeRelationTypes.some((type) => /river|lake|mountain|water|frontier|city|landscape|journey|climb|weather|homecoming/iu.test(type)) ? 1.2 : 0));
  const cultureScore = clampScore(3 + (selection.textbookCommon === "high" ? 1 : 0) + (selection.priority === "p1" || selection.priority === "p0" ? 1 : 0));
  return {
    length: lengthScore,
    languageClarity: languageScore,
    imageClarity: imageScore,
    placeClarity: placeScore,
    textbookFamiliarity: familiar,
    spatialLearningValue: spatialScore,
    culturalRepresentation: cultureScore,
    computedBy: "phase1-heuristic-v1",
    note: "Automatic ranking aid only; it does not imply human approval.",
  };
}

function sourceSnapshot(raw, snapshot) {
  return {
    sourceId: raw.sourceId,
    collection: snapshot.collection,
    repository: snapshot.repository,
    license: snapshot.license,
    retrievedAt: snapshot.retrievedAt,
    title: raw.title,
    author: raw.author,
    dynasty: raw.dynasty,
    genre: raw.genre,
    text: normalizeText(raw.text),
  };
}

function buildPinyinAudit() {
  const lines = [];
  for (const poem of phase1Poems) {
    for (const line of poem.lines) {
      const candidate = pinyin(line.text, { toneType: "symbol", type: "array" });
      lines.push({
        poemId: poem.id,
        lineId: line.id,
        candidate,
        curated: line.tokens.filter((token) => !token.punctuation).map((token) => token.pinyin),
        overridePaths: Object.keys(poem.pronunciationOverrides).filter((path) => path.startsWith(`${line.id}.`)),
      });
    }
  }
  return {
    generator: "pinyin-pro@3.29.3",
    toneType: "symbol",
    presentation: "ruby-above-character",
    status: "candidate-generated-curated-committed",
    lines,
  };
}

function assertCompletePoems() {
  if (phase1Places.length !== 5) fail(`expected 5 complete places, got ${phase1Places.length}`);
  if (phase1Poems.length !== 10) fail(`expected 10 complete poems, got ${phase1Poems.length}`);
  const placeIds = new Set(phase1Places.map((place) => place.id));
  const poemIds = new Set();
  for (const place of phase1Places) {
    if (!place.id || !place.name || !place.type || !place.modernCity) fail(`place ${place.id || "(missing id)"} lacks identity fields`);
    if (!Array.isArray(place.poemIds) || place.poemIds.length !== 2) fail(`place ${place.id} must have exactly 2 poem IDs`);
    if (!place.provenance?.sources?.length || place.review?.status !== "curated") fail(`place ${place.id} lacks provenance/review`);
    for (const poemId of place.poemIds) {
      if (poemIds.has(poemId)) fail(`poem ${poemId} is assigned to more than one complete place`);
      poemIds.add(poemId);
    }
  }
  for (const poem of phase1Poems) {
    if (poemIds.size && !poemIds.has(poem.id)) fail(`poem ${poem.id} is not referenced by a complete place`);
    if (!poem.id || !poem.title?.text || !poem.author?.name || !poem.dynasty || !poem.genre) fail(`poem ${poem.id || "(missing id)"} lacks identity fields`);
    if (!placeIds.has(poem.placeId)) fail(`poem ${poem.id} points to unknown place ${poem.placeId}`);
    if (!Array.isArray(poem.lines) || poem.lines.length < 2) fail(`poem ${poem.id} lacks lines`);
    if (!poem.placeRelations?.length || !poem.spatialLearning?.coreRelation) fail(`poem ${poem.id} lacks spatial learning data`);
    if (!poem.provenance?.sources?.length || poem.review?.status !== "curated") fail(`poem ${poem.id} lacks provenance/review`);
    if (!poem.interpretation?.summary || poem.interpretation.lineMeanings?.length !== poem.lines.length) {
      fail(`poem ${poem.id} lacks complete line-by-line interpretation`);
    }
    if (!poem.interpretation?.extension?.title || !poem.interpretation?.extension?.text || !poem.interpretation?.extension?.prompt) {
      fail(`poem ${poem.id} lacks extended reading support`);
    }
    for (const [lineIndex, line] of poem.lines.entries()) {
      const meaning = poem.interpretation.lineMeanings[lineIndex];
      if (meaning.lineId !== line.id || !meaning.meaning) fail(`poem ${poem.id} interpretation does not align with ${line.id}`);
    }
    for (const age of ["7-8", "9-10", "11-12"]) {
      const band = poem.ageBands?.[age];
      if (!band?.explanation || !band?.openingQuestion || !band?.hint || !band?.followUp || !band?.completionStandard) {
        fail(`poem ${poem.id} lacks complete ${age} adaptation`);
      }
    }
  }
}

function buildCatalog(rawSnapshot) {
  const rawCandidates = rawSnapshot.candidates;
  if (!Array.isArray(rawCandidates) || rawCandidates.length !== 100) fail(`raw snapshot must contain exactly 100 candidates, got ${rawCandidates?.length}`);
  const rawById = new Map();
  for (const raw of rawCandidates) {
    if (!raw.sourceId || rawById.has(raw.sourceId)) fail(`raw source ID missing or duplicated: ${raw.sourceId}`);
    if (!raw.title || !raw.author || !raw.dynasty || !raw.genre || !raw.text) fail(`raw candidate ${raw.sourceId} lacks source fields`);
    rawById.set(raw.sourceId, raw);
  }
  if (curatedSelection.length !== 100) fail(`curated shortlist must contain 100 entries, got ${curatedSelection.length}`);
  const ids = new Set();
  const sourceIds = new Set();
  const records = curatedSelection.map((selection) => {
    if (!selection.id || ids.has(selection.id)) fail(`curated stable ID missing or duplicated: ${selection.id}`);
    ids.add(selection.id);
    if (sourceIds.has(selection.sourceId)) fail(`source ${selection.sourceId} maps to multiple curated IDs`);
    sourceIds.add(selection.sourceId);
    const raw = rawById.get(selection.sourceId);
    if (!raw) fail(`curated ${selection.id} points to unknown raw source ${selection.sourceId}`);
    const override = curatedOverrides[selection.id];
    const normalizedText = normalizeText(override?.text ?? raw.text);
    const normalizedTitle = override?.title ?? raw.title;
    const normalizedAuthor = override?.author ?? raw.author;
    const normalizedDynasty = override?.dynasty ?? raw.dynasty;
    const normalizedGenre = override?.genre ?? raw.genre;
    return {
      id: selection.id,
      title: normalizedTitle,
      author: normalizedAuthor,
      dynasty: normalizedDynasty,
      genre: normalizedGenre,
      text: normalizedText,
      lineCount: normalizedText.split("\n").filter(Boolean).length,
      characterCount: textLength(normalizedText),
      placeCandidates: [...selection.placeCandidates],
      placeRelationTypes: [...selection.placeRelationTypes],
      themes: [...selection.themes],
      ageRange: [...selection.ageRange],
      scores: scoreCandidate({ ...raw, text: normalizedText }, selection),
      textbookCommon: selection.textbookCommon,
      sourceSnapshot: sourceSnapshot(raw, rawSnapshot.snapshot),
      curation: {
        selectionStatus: selection.selectionStatus,
        reviewStatus: override?.reviewStatus ?? selection.reviewStatus,
        sourceId: selection.sourceId,
        overrideApplied: Boolean(override),
        overrideReason: override?.overrideReason || "",
        overrideSource: override?.overrideSource ? { ...override.overrideSource } : null,
      },
      priority: selection.priority,
      provenance: {
        source: rawSnapshot.snapshot.repository,
        sourceLicense: rawSnapshot.snapshot.license,
        normalizedBy: "phase1-normalize-v1",
        curatedLayer: "content/catalog/curated-selection.js + curated-overrides.js",
      },
    };
  });
  if (sourceIds.size !== rawById.size) fail(`not every raw source record is mapped: ${rawById.size - sourceIds.size} missing`);
  return records;
}

async function main() {
  const rawSnapshot = JSON.parse(await readFile(RAW_PATH, "utf8"));
  assertCompletePoems();
  const catalog = buildCatalog(rawSnapshot);
  const runtime = {
    schemaVersion: 2,
    generatedAt: RETRIEVED_AT,
    pipeline: {
      id: "phase1-content-pipeline",
      version: "1.0.0",
      generatedBy: "scripts/build-phase1-catalog.mjs",
      deterministic: true,
      rawSnapshot: "content/catalog/raw-candidates.json",
      curatedSelection: "content/catalog/curated-selection.js",
      curatedOverrides: "content/catalog/curated-overrides.js",
      output: "content/catalog/phase1-runtime.json",
      scoreDimensions: SCORE_KEYS,
      note: "Raw source records and curation records remain separate in every catalog entry.",
    },
    sourceManifest: {
      ...rawSnapshot.snapshot,
      completeContent: "content/phase1/index.js",
      places: "content/phase1/places.js",
      pinyinGenerator: "pinyin-pro@3.29.3",
    },
    places: phase1Places,
    poems: phase1Poems,
    catalog,
    pinyinAudit: buildPinyinAudit(),
  };
  await writeFile(OUTPUT_PATH, `${JSON.stringify(runtime, null, 2)}\n`, "utf8");
  console.log(`Phase 1 catalog built: ${phase1Places.length} places, ${phase1Poems.length} complete poems, ${catalog.length} candidates.`);
  console.log(`Runtime output: ${OUTPUT_PATH}`);
  console.log(`Pinyin audit: ${runtime.pinyinAudit.lines.length} lines via ${runtime.pinyinAudit.generator}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
