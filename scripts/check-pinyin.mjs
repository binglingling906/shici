import { pinyin } from "pinyin-pro";
import { poem } from "../content/wang-lushan-pubu.js";

const toneMarks = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńňḿǹ]/u;
const toneDigits = /[1-5]/u;
const punctuationPattern = /^[，。！？；：、“”‘’（）《》〈〉「」『』,.!?;:'"()<>\s]$/u;
const errors = [];
const toneGroups = [
  null,
  /[āēīōūǖ]/u,
  /[áéíóúǘńḿ]/u,
  /[ǎěǐǒǔǚň]/u,
  /[àèìòùǜǹ]/u,
];

function fail(message) {
  errors.push(message);
}

function candidatePinyin(text) {
  const result = pinyin(text, { toneType: "symbol", type: "array" });
  return Array.isArray(result) ? result : [result];
}

function isPunctuation(token) {
  return Boolean(token.punctuation) || punctuationPattern.test(token.char);
}

function assertToneMark(value, path) {
  if (!value) {
    fail(`${path} is missing pinyin`);
    return;
  }
  if (toneDigits.test(value)) fail(`${path} uses a numeric tone: ${value}`);
  if (!toneMarks.test(value)) fail(`${path} has no tone mark: ${value}`);
}

function inferTone(value) {
  return toneGroups.findIndex((pattern, tone) => tone > 0 && pattern.test(value));
}

if (!poem || !Array.isArray(poem.lines) || poem.lines.length !== 4) {
  fail("poem must contain exactly four lines");
}

const overrideEntries = Object.entries(poem.pronunciationOverrides || {});
const overrides = new Map(overrideEntries.map(([path, value]) => [path, value]));

for (const [lineIndex, line] of (poem.lines || []).entries()) {
  const linePath = `line-${lineIndex + 1}`;
  if (!Array.isArray(line.tokens) || !line.tokens.length) {
    fail(`${linePath} has no tokens`);
    continue;
  }
  const tokenText = line.tokens.map((token) => token.char).join("");
  if (tokenText !== line.text) fail(`${linePath} text does not match token characters`);

  const candidates = candidatePinyin(line.text);
  if (candidates.length !== line.tokens.length) {
    fail(`${linePath} candidate count ${candidates.length} does not match token count ${line.tokens.length}`);
  }

  for (const [tokenIndex, token] of line.tokens.entries()) {
    const path = `${linePath}.token-${tokenIndex + 1}`;
    const punctuation = isPunctuation(token);
    const override = overrides.get(path);
    if (punctuation) {
      if (token.pinyin || token.tone !== undefined) fail(`${path} punctuation must not carry pinyin or tone`);
      if (override) fail(`${path} cannot override punctuation`);
      continue;
    }
    if (token.char.length !== 1) fail(`${path} must contain one character`);
    assertToneMark(token.pinyin, path);
    const inferredTone = inferTone(token.pinyin);
    if (!Number.isInteger(token.tone) || token.tone !== inferredTone) {
      fail(`${path} tone metadata ${token.tone} does not match ${token.pinyin} (tone ${inferredTone})`);
    }
    const candidate = candidates[tokenIndex];
    if (override) {
      if (override.path !== path || override.char !== token.char || override.pinyin !== token.pinyin) {
        fail(`${path} override is inconsistent with curated token`);
      }
    } else if (candidate && candidate !== token.pinyin) {
      fail(`${path} candidate ${candidate} differs from curated ${token.pinyin}; add a path-specific override`);
    }
  }
}

for (const [path, override] of overrideEntries) {
  if (path === "title") {
    if (override.path !== "title" || override.text !== poem.title.text || override.pinyin !== poem.title.pinyin) {
      fail("title pronunciation override is inconsistent");
    }
    assertToneMark(override.pinyin.split(/\s+/u)[0], "title override");
    continue;
  }
  const match = /^(line-(\d+)\.token-(\d+))$/u.exec(path);
  if (!match) {
    fail(`override path ${path} is not a line-N.token-N path`);
    continue;
  }
  const line = poem.lines[Number(match[2]) - 1];
  const token = line?.tokens?.[Number(match[3]) - 1];
  if (!token) fail(`override path ${path} points to no token`);
}

if (poem.title?.pinyin) {
  if (toneDigits.test(poem.title.pinyin)) fail("title uses numeric tones");
  if (poem.title.pinyin.split(/\s+/u).length !== poem.title.text.length) {
    fail("title pinyin count does not match title characters");
  }
}

if (poem.author?.pinyin && toneDigits.test(poem.author.pinyin)) fail("author uses numeric tones");
if (poem.review?.status !== "curated" || !poem.review?.reviewedAt) fail("poem must carry curated review metadata");
if (!poem.source?.text) fail("poem must carry a source record");

if (errors.length) {
  console.error("Pinyin check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Pinyin check passed: ${poem.lines.length} lines, ${poem.lines.reduce((sum, line) => sum + line.tokens.length, 0)} tokens.`);
}
