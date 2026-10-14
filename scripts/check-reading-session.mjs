import assert from "node:assert/strict";
import { createProgressStore } from "../core/progress-store.js";
import { createAudioEngine, createSilentAudioProvider, createSpeechSynthesisProvider } from "../core/audio-provider.js";
import { phase1Poems } from "../content/phase1/index.js";

const MASTERY_STAMPS = ["understood", "interpreted", "recited", "retained"];
const RECITATION_STAGE_PATTERNS = {
  withPinyin: /pinyin|拼音/u,
  withoutPinyin: /without.?pinyin|no.?pinyin|无拼音|去拼音/u,
  keywords: /keyword|关键词|遮.{0,2}字|隐藏.{0,2}字/u,
  initials: /initial|first.?character|首字|首字提示/u,
  images: /image|picture|画面|线索|场景/u,
  hidden: /hidden|no.?prompt|full.?recit|complete|无提示|完全隐藏|完整背/u,
};

function firstArray(...values) {
  return values.find((value) => Array.isArray(value)) || [];
}

function firstObject(...values) {
  return values.find((value) => value && typeof value === "object" && !Array.isArray(value)) || {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

function field(record, ...keys) {
  for (const key of keys) {
    if (record && Object.prototype.hasOwnProperty.call(record, key) && record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
}

function contractFor(poem) {
  return firstObject(poem.learningContract, poem.masteryContract, poem.learningMastery, poem.learning, poem.mastery);
}

function serialized(value) {
  try { return JSON.stringify(value || ""); } catch { return String(value || ""); }
}

function checkLearningMasteryContracts(poems) {
  const errors = [];
  for (const poem of poems) {
    const contract = contractFor(poem);
    const understanding = firstObject(contract.understanding, contract.interpretation, poem.understanding, poem.interpretation);
    const lineMeanings = firstArray(understanding.lineMeanings, understanding.lines, contract.lineMeanings, poem.interpretation?.lineMeanings);
    const lineIssues = [];
    if (lineMeanings.length !== poem.lines.length) lineIssues.push(`lineMeanings ${lineMeanings.length}/${poem.lines.length}`);
    for (const [index, line] of lineMeanings.entries()) {
      const keywords = firstArray(line?.keyWords, line?.keywords, line?.keyTerms, line?.terms);
      const hasMeaning = Boolean(text(field(line, "childMeaning", "childExplanation", "meaning", "explanation", "summary")));
      const hasMisunderstanding = Boolean(text(field(line, "commonMisunderstanding", "misunderstanding", "misconception")))
        || firstArray(line?.commonMisunderstandings, line?.misunderstandings).length > 0;
      const hasPrompt = Boolean(text(field(line, "imagePrompt", "scene", "picture", "question", "guidingQuestion", "observationPrompt")));
      if (!hasMeaning || !keywords.length || !hasMisunderstanding || !hasPrompt) {
        lineIssues.push(`line-${index + 1}:${[!hasMeaning && "childMeaning", !keywords.length && "keyWords", !hasMisunderstanding && "commonMisunderstanding", !hasPrompt && "imagePromptOrQuestion"].filter(Boolean).join(",")}`);
      }
    }
    const wholeMeaning = text(field(understanding, "wholeMeaning", "summary", "overview"));
    const mainContent = text(field(understanding, "mainContent", "mainIdea", "content", "whatItWrites") || field(contract, "mainContent", "wholeMeaning"));
    const evidence = firstArray(understanding.evidenceLines, understanding.evidence, contract.evidenceLines);
    const evidenceRule = Boolean(field(understanding, "completionEvidence", "completionRule", "validation", "evidenceModel"))
      || understanding.requiresEvidence === true || understanding.notClickOnly === true;
    if (lineIssues.length || !wholeMeaning || !mainContent || !evidence.length || !evidenceRule) {
      errors.push(`${poem.id} understanding missing ${[lineIssues.length && `line contract (${lineIssues.join("; ")})`, !wholeMeaning && "wholeMeaning", !mainContent && "mainContent", !evidence.length && "evidenceLines", !evidenceRule && "nonClickEvidenceRule"].filter(Boolean).join(", ")}`);
    }

    const theme = firstObject(contract.theme, contract.interpretation?.theme, poem.theme, poem.interpretation?.theme, contract);
    const accepted = firstArray(theme.acceptedExpressions, theme.acceptableAnswers, theme.childExpressions, theme.semanticVariants, theme.examples, theme.acceptedChildResponses);
    const flexible = accepted.length >= 2 || theme.allowParaphrase === true || theme.allowReasonableExpression === true || theme.openEnded === true || /semantic|meaning|paraphrase|自由表达|合理表达/u.test(text(field(theme, "matchMode", "answerMode", "evaluation")));
    if (!text(field(theme, "mainContent", "content", "whatItWrites", "summary")) || !text(field(theme, "emotion", "feeling", "mood")) || !text(field(theme, "centralIdea", "coreIdea", "message", "theme", "whatToFeel")) || !firstArray(theme.evidenceLines, theme.evidence, poem.interpretation?.evidenceLines).length || !flexible || /exact|literal|strict|逐字|完全一致/u.test(text(field(theme, "matchMode", "answerMode", "evaluation")))) {
      errors.push(`${poem.id} theme contract must include mainContent/emotion/centralIdea/evidence and flexible child expressions`);
    }

    const recitation = firstObject(contract.recitation, contract.recite, poem.recitation, poem.recitationStages);
    const stages = firstArray(recitation.stages, recitation.modes, recitation.steps, recitation.recitationStages, contract.recitationStages, poem.recitationStages);
    const stageText = stages.map((stage) => typeof stage === "string" ? stage : serialized(stage)).join(" ");
    const missingStages = Object.entries(RECITATION_STAGE_PATTERNS).filter(([, pattern]) => !pattern.test(stageText)).map(([name]) => name);
    const verification = firstObject(recitation.verification, recitation.completion, recitation.masteryCheck, contract.verification, poem.recitationVerification);
    const noPrompt = verification.requiresNoPrompt === true || verification.noText === true || verification.hiddenText === true || verification.fullHidden === true || Boolean(field(verification, "noPromptEvidence", "unassistedEvidence", "passCondition"));
    if (missingStages.length || !firstArray(recitation.memoryKeywords, recitation.keywords, contract.memoryKeywords, poem.memoryKeywords).length || !firstArray(recitation.firstCharacterHints, recitation.initialHints, recitation.firstHints, contract.firstCharacterHints, poem.firstCharacterHints).length || !noPrompt || (/self.?report|click|button|我会背|自报/u.test(serialized(verification)) && !noPrompt)) {
      errors.push(`${poem.id} recitation missing ${[missingStages.length && `stages:${missingStages.join("/")}`, !firstArray(recitation.memoryKeywords, recitation.keywords, contract.memoryKeywords, poem.memoryKeywords).length && "memoryKeywords", !firstArray(recitation.firstCharacterHints, recitation.initialHints, recitation.firstHints, contract.firstCharacterHints, poem.firstCharacterHints).length && "firstCharacterHints", !noPrompt && "unassistedVerification"].filter(Boolean).join(", ")}`);
    }

    const statusKeys = firstArray(contract.statuses, contract.masteryStatuses, poem.masteryStatuses);
    const stampKeys = new Set(statusKeys.map((status) => text(typeof status === "object" ? status.id || status.key || status.name : status).toLowerCase()));
    const missingStamps = MASTERY_STAMPS.filter((stamp) => ![...stampKeys].some((value) => value.includes(stamp)));
    if (missingStamps.length) errors.push(`${poem.id} mastery statuses missing ${missingStamps.join(", ")} (completed must not stand in for mastered)`);

    const retention = firstObject(contract.retention, contract.spacedReview, poem.retention, poem.spacedReview);
    const intervals = firstArray(retention.intervalsDays, retention.intervals, retention.schedule, contract.reviewIntervalsDays, poem.reviewIntervalsDays).map((item) => Number(typeof item === "object" ? item.days || item.intervalDays || item.afterDays : item)).filter(Number.isFinite);
    const missingIntervals = [1, 3, 7].filter((day) => !intervals.includes(day));
    if (missingIntervals.length) errors.push(`${poem.id} spaced review missing ${missingIntervals.join("/ ")} day interval(s)`);
  }
  return errors;
}

const learningMasteryErrors = checkLearningMasteryContracts(phase1Poems);
assert.deepEqual(learningMasteryErrors, [], `learning mastery contract errors:\n${learningMasteryErrors.join("\n")}`);

class MemoryStorage {
  constructor(seed = {}) { this.values = new Map(Object.entries(seed)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const storage = new MemoryStorage({
  "shanhe.phase1.progress": JSON.stringify({
    version: 2,
    completedPoemIds: ["finished", "finished"],
    favoritePoemIds: ["favorite", "favorite", ""],
    recentPoemIds: ["old-a", "old-a", "old-b"],
    reviewByPoem: { finished: { count: "2", lastPracticedAt: 100, nextReviewAt: 200 }, malformed: "ignore" },
    rawInput: "child answer must never persist",
  }),
});
const store = createProgressStore(storage);
assert.equal(store.storageAvailable, true);
assert.deepEqual(store.get().completedPoemIds, ["finished"]);
assert.deepEqual(store.get().favoritePoemIds, ["favorite"]);
assert.deepEqual(store.get().recentPoemIds, ["old-a", "old-b"]);
assert.deepEqual(store.get().reviewByPoem.finished, { count: 2, intervalDays: 0, lastPracticedAt: 100, nextReviewAt: 200 });
assert.equal("rawInput" in store.get(), false);

for (let index = 0; index < 14; index += 1) store.recordReading(`poem-${index}`);
assert.equal(store.get().lastPoemId, "poem-13");
assert.equal(store.get().recentPoemIds.length, 12);
assert.equal(store.get().recentPoemIds[0], "poem-13");
store.recordReading("poem-8");
assert.equal(store.get().recentPoemIds[0], "poem-8");
assert.equal(store.get().recentPoemIds.filter((id) => id === "poem-8").length, 1);

store.toggleFavorite("poem-8");
assert.equal(store.get().favoritePoemIds.includes("poem-8"), true);
store.toggleFavorite("poem-8");
assert.equal(store.get().favoritePoemIds.includes("poem-8"), false);

const review = store.recordReview("poem-8", 1_700_000_000_000);
assert.deepEqual(review.reviewByPoem["poem-8"], {
  count: 1,
  intervalDays: 1,
  lastPracticedAt: 1_700_000_000_000,
  nextReviewAt: 1_700_086_400_000,
});
assert.equal(review.completedPoemIds.includes("poem-8"), false, "reviewing does not complete a poem");
assert.equal(JSON.stringify(storage.values.get("shanhe.phase1.progress")).includes("child answer must never persist"), false);

const previousStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
try {
  Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("storage blocked"); } });
  const blockedStorage = createProgressStore();
  assert.equal(blockedStorage.storageAvailable, false, "blocked localStorage should degrade to memory mode");
  blockedStorage.recordReading("memory-only");
  assert.equal(blockedStorage.get().lastPoemId, "memory-only");
} finally {
  if (previousStorageDescriptor) Object.defineProperty(globalThis, "localStorage", previousStorageDescriptor);
  else delete globalThis.localStorage;
}

const writeOnlyStorage = {
  value: JSON.stringify({ version: 2, lastPoemId: "old" }),
  getItem() { return this.value; },
  setItem(_key, value) { this.value = String(value); },
};
const writeOnlyStore = createProgressStore(writeOnlyStorage);
assert.equal(writeOnlyStore.get().lastPoemId, "old");
writeOnlyStore.reset();
assert.equal(createProgressStore(writeOnlyStorage).get().lastPoemId, "", "reset should not resurrect old data without removeItem");

const unavailable = createAudioEngine({ primary: createSilentAudioProvider(), fallback: createSilentAudioProvider() });
assert.equal(unavailable.canPause(), false);
let unavailableMessage = "";
assert.equal((await unavailable.playLines([{ text: "无声" }], { onUnavailable: (message) => { unavailableMessage = message; } })).unavailable, true);
assert.match(unavailableMessage, /和家人一起逐句读/u);
assert.doesNotMatch(unavailableMessage, /点读/u);

class MockUtterance {
  constructor(text) { this.text = text; }
}
const spoken = [];
const synth = {
  cancelled: 0,
  paused: 0,
  resumed: 0,
  current: null,
  speak(utterance) { this.current = utterance; spoken.push(utterance); },
  cancel() { this.cancelled += 1; },
  pause() { this.paused += 1; },
  resume() { this.resumed += 1; },
};
const provider = createSpeechSynthesisProvider({ synth, Utterance: MockUtterance });
const started = [];
const ended = [];
const playback = provider.playLines([{ text: "第一句" }], { onLineStart: (index) => started.push(index), onLineEnd: (index) => ended.push(index) });
await Promise.resolve();
assert.deepEqual(started, [], "line start waits for the browser utterance onstart event");
assert.equal(provider.canPause(), true);
assert.equal(provider.pause(), true);
assert.equal(provider.isPaused(), true);
assert.equal(provider.resume(), true);
assert.equal(provider.isPaused(), false);
spoken[0].onstart();
assert.deepEqual(started, [0]);
spoken[0].onend();
assert.deepEqual(await playback, { completed: true });
assert.deepEqual(ended, [0]);
assert.equal(synth.paused, 1);
assert.equal(synth.resumed, 1);

const cancelledPlayback = provider.playLines([{ text: "会被取消" }]);
await Promise.resolve();
provider.stop();
assert.deepEqual(await cancelledPlayback, { cancelled: true });
assert.equal(synth.cancelled >= 2, true);

let failingUtterance = null;
const failingSynth = {
  speak(utterance) { failingUtterance = utterance; },
  cancel() {},
};
const failingProvider = createSpeechSynthesisProvider({ synth: failingSynth, Utterance: MockUtterance });
const failedPlayback = failingProvider.playLine({ text: "设备失败" });
await Promise.resolve();
failingUtterance.onerror?.(new Error("device failure"));
await assert.rejects(failedPlayback, /speech-failed/);

const throwingProvider = createSpeechSynthesisProvider({
  synth: { speak() { throw new Error("speak failure"); }, cancel() {} },
  Utterance: MockUtterance,
});
await assert.rejects(throwingProvider.playLine({ text: "同步失败" }), /speak failure/);

console.log("Reading session check passed: additive progress fields, review scheduling, pause/resume, start/end/cancel speech lifecycle.");
