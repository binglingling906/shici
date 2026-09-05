import assert from "node:assert/strict";
import { phase1Places, phase1Poems } from "../content/phase1/index.js";
import { createProgressStore, AGE_MODES } from "../core/progress-store.js";
import { createTutorEngine } from "../core/tutor-engine.js";
import { createAudioEngine, createSilentAudioProvider } from "../core/audio-provider.js";

class MemoryStorage {
  constructor(seed = {}) { this.values = new Map(Object.entries(seed)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

assert.equal(phase1Places.length, 5, "Phase 1 must expose five complete places");
assert.equal(phase1Poems.length, 10, "Phase 1 must expose ten complete poems");
assert.equal(new Set(phase1Places.flatMap((place) => place.poemIds)).size, 10, "Every complete poem id must be unique");
assert.deepEqual(Object.keys(AGE_MODES), ["7-8", "9-10", "11-12"], "Three age modes must remain stable");

const storage = new MemoryStorage();
const progress = createProgressStore(storage);
assert.equal(progress.get().version, 2);
assert.equal(progress.shouldShowPinyin(), true, "Young mode defaults pinyin on");
progress.setAgeMode("11-12");
assert.equal(progress.shouldShowPinyin(), false, "Older mode defaults pinyin off");
progress.setPinyinPreference(true);
assert.equal(progress.shouldShowPinyin(), true, "Explicit reader preference overrides age default");
progress.completePoem(phase1Poems[0].id, phase1Places[0].id);
assert.equal(progress.get().completedPoemIds.length, 1);
assert.equal(JSON.stringify(progress.get()).includes("child answer"), false, "Raw child text is never persisted");

const malformedStorage = new MemoryStorage({
  "shanhe.phase1.progress": JSON.stringify({ version: 1, ageMode: "unknown", completedPoemIds: ["a", "a"], rawInput: "child answer" }),
});
const migrated = createProgressStore(malformedStorage).get();
assert.equal(migrated.version, 2);
assert.equal(migrated.ageMode, "7-8");
assert.deepEqual(migrated.completedPoemIds, ["a"]);
assert.equal("rawInput" in migrated, false);

const legacyStorage = new MemoryStorage({
  "shanhe-shijing-journey-v2": JSON.stringify({ completed: true, visited: { lushan: true }, discovery: "must not migrate" }),
  "shanhe-shijing-pinyin": "false",
  "shanhe-shijing-origin-city": "ningbo",
});
const legacy = createProgressStore(legacyStorage).get();
assert.deepEqual(legacy.completedPoemIds, ["lushan-wang-lushan-pubu"]);
assert.equal(legacy.pinyinPreference, false);
assert.equal(legacy.originCityId, "ningbo");
assert.equal(JSON.stringify(legacy).includes("must not migrate"), false);

const tutor = createTutorEngine();
const empty = await tutor.respond({ input: "", lesson: phase1Poems[0], ageMode: "7-8" });
assert.equal(empty.kind, "empty");
assert.equal(empty.revealAnswer, false);
const unsure = await tutor.respond({ input: "不知道", lesson: phase1Poems[0], ageMode: "7-8" });
assert.equal(unsure.revealAnswer, false);

const silent = createSilentAudioProvider();
const audio = createAudioEngine({ primary: silent, fallback: silent });
assert.equal(audio.isAvailable(), false);
assert.equal((await audio.playLines(phase1Poems[0].lines)).unavailable, true);
audio.stop();

console.log(`Phase 1 system check passed: ${phase1Places.length} places, ${phase1Poems.length} poems, ${Object.keys(AGE_MODES).length} age modes.`);
