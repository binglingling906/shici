import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("assets/audio/reading-manifest.json", "utf8"));
const runtime = JSON.parse(fs.readFileSync("content/catalog/phase1-runtime.json", "utf8"));
const reviewed = runtime.catalog.filter((item) => /curated_content_v1|approved_full_experience/u.test(item.learningContract?.status || ""));
const failures = [];
if (manifest.version !== 1) failures.push("unsupported reading manifest version");
if (Object.keys(manifest.poems || {}).length !== reviewed.length) failures.push(`reviewed poem audio count mismatch: expected ${reviewed.length}`);
for (const poem of reviewed) {
  const lines = manifest.poems?.[poem.id]?.lines || [];
  if (lines.length !== poem.lineTokens.length) failures.push(`${poem.id}: line timeline count mismatch`);
  for (const line of lines) {
    if (!line.durationMs || line.durationMs < 100) failures.push(`${poem.id}/${line.lineId}: invalid duration`);
    const local = line.src.replace(/^\.\//u, "");
    if (!fs.existsSync(local)) failures.push(`${poem.id}/${line.lineId}: missing ${local}`);
  }
}
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Reading audio check passed: ${reviewed.length} poems, ${Object.values(manifest.poems).reduce((n, p) => n + p.lines.length, 0)} timed line tracks.`);
