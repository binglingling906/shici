import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = process.cwd();
const runtime = JSON.parse(await fs.readFile(path.join(ROOT, "content/catalog/phase1-runtime.json"), "utf8"));
const poems = runtime.catalog.filter((item) => /curated_content_v1|approved_full_experience/u.test(item.learningContract?.status || ""));
const outRoot = path.join(ROOT, "assets/audio/readings");
await fs.mkdir(outRoot, { recursive: true });

if (process.platform !== "darwin") {
  console.error("This generator requires macOS `say`; keep the Web Speech fallback on other platforms.");
  process.exit(1);
}

const manifest = { version: 1, voice: "Tingting", generatedBy: "macOS say", poems: {} };
for (const poem of poems) {
  const lines = [];
  const poemDir = path.join(outRoot, poem.id);
  await fs.mkdir(poemDir, { recursive: true });
  for (const [index, line] of poem.lineTokens.entries()) {
    const stem = `line-${index + 1}`;
    const aiff = path.join(poemDir, `${stem}.aiff`);
    const mp3 = path.join(poemDir, `${stem}.mp3`);
    const text = line.text.replace(/[，。！？；：、]/gu, "");
    await run("say", ["-v", "Tingting", "-r", "145", "-o", aiff, text]);
    await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", aiff, "-codec:a", "libmp3lame", "-b:a", "48k", mp3]);
    await fs.rm(aiff, { force: true });
    const { stdout } = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", mp3]);
    lines.push({ lineId: line.id, src: `./assets/audio/readings/${poem.id}/${stem}.mp3`, durationMs: Math.round(Number(stdout.trim()) * 1000) });
  }
  manifest.poems[poem.id] = { lines };
}
await fs.writeFile(path.join(ROOT, "assets/audio/reading-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${Object.keys(manifest.poems).length} poems and ${Object.values(manifest.poems).reduce((n, poem) => n + poem.lines.length, 0)} line tracks.`);
