import assert from "node:assert/strict";
import { BACKUP_FORMAT, BACKUP_VERSION, createProgressStore, validateProgressBackup } from "../core/progress-store.js";

function memoryStorage(seed = null) {
  const values = new Map(seed ? [["shanhe.phase1.progress", JSON.stringify(seed)]] : []);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const source = createProgressStore(memoryStorage());
source.recordReading("backup-poem");
source.toggleFavorite("backup-poem");
source.recordReview("backup-poem", 1700000000000);
const backup = source.exportData();
assert.equal(backup.format, BACKUP_FORMAT);
assert.equal(backup.formatVersion, BACKUP_VERSION);
assert.equal(validateProgressBackup(JSON.stringify(backup)).ok, true);
assert.equal(JSON.stringify(backup).includes("rawInput"), false);

const target = createProgressStore(memoryStorage());
target.recordReading("local-poem");
const beforeInvalidImport = target.get();
const invalid = target.importData(JSON.stringify({ ...backup, format: "other-app" }));
assert.equal(invalid.ok, false);
assert.deepEqual(target.get(), beforeInvalidImport, "invalid backup must not mutate local progress");

const imported = target.importData(JSON.stringify(backup));
assert.equal(imported.ok, true);
assert.deepEqual(target.get().recentPoemIds, ["local-poem", "backup-poem"]);
assert.deepEqual(target.get().favoritePoemIds, ["backup-poem"]);
assert.equal(target.get().reviewByPoem["backup-poem"].count, 1);

const future = { ...backup, progressVersion: 999 };
assert.equal(validateProgressBackup(future).ok, false);
console.log("Progress backup check passed: version validation, safe merge and invalid-import preservation.");
