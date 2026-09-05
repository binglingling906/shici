/**
 * Data-side companion to evaluation/experience-evaluator.js.
 *
 * It deliberately has no dependency on the browser.  When the curriculum
 * module is present it validates the contracts that are otherwise only
 * observable through window.__SHANHE_PHASE1__.  During the earlier Phase 1
 * snapshot (before the expansion module exists) it exits cleanly with SKIP so
 * it can be wired into CI before the data migration lands.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const failures = [];
const checks = [];

function list(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.records)) return value.records;
  if (Array.isArray(value?.entries)) return value.entries;
  return [];
}

function first(...values) {
  for (const value of values) {
    const items = list(value);
    if (items.length) return items;
  }
  return [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : String(value || "").trim();
}

function has(value) {
  return value !== undefined && value !== null && value !== "";
}

function hasAny(record, keys) {
  return keys.some((key) => Object.prototype.hasOwnProperty.call(record || {}, key) && has(record[key]));
}

function sourcePresent(value) {
  if (Array.isArray(value)) return value.some(sourcePresent);
  if (value && typeof value === "object") return Boolean(value.url || value.uri || value.key || value.id || value.title);
  return Boolean(text(value));
}

function normalizedTitle(value) {
  return text(typeof value === "object" ? value.text || value.name : value)
    .replace(/[《》〈〉「」『』\s·・,，。！？!?；;：:、\-—]/gu, "").toLocaleLowerCase("zh-CN");
}

function idOf(record) {
  return text(record?.poemId || record?.workId || record?.canonicalPoemId || record?.id || record?.slug);
}

function titleOf(record) {
  return record?.canonicalTitle || record?.title || record?.name || "";
}

function statusOf(record) {
  const review = record?.review;
  const maturity = record?.maturity;
  return text(record?.verificationStatus || record?.reviewStatus || (typeof review === "object" ? review.status : review)
    || record?.curation?.status || (typeof maturity === "object" ? maturity.status : maturity) || record?.status).toLowerCase();
}

function isCandidate(status) {
  return /candidate|unverified|pending|draft|machine|needs.?review|auto/u.test(String(status || "").toLowerCase());
}

function tierOf(record) {
  const value = record?.contentTier ?? record?.tier ?? record?.level ?? record?.contentLevel ?? record?.experienceLevel ?? record?.maturity;
  const normalized = text(value && typeof value === "object" ? value.id || value.name || value.status : value).toLowerCase();
  const numeric = normalized.match(/[0-4]/);
  if (numeric) return Number(numeric[0]);
  if (/mother|raw|candidate|machine/u.test(normalized)) return 0;
  if (/curriculum|textbook|catalog|directory/u.test(normalized)) return 1;
  if (/standard/u.test(normalized)) return 2;
  if (/guided/u.test(normalized)) return 3;
  if (/immersive|gold|沉浸/u.test(normalized)) return 4;
  return null;
}

async function loadModule(relativePath) {
  const filename = path.join(root, relativePath);
  if (!fs.existsSync(filename)) return null;
  return import(pathToFileURL(filename).href);
}

function exported(module, keys) {
  for (const key of keys) if (module?.[key] !== undefined) return module[key];
  if (module?.default && typeof module.default === "object") {
    for (const key of keys) if (module.default[key] !== undefined) return module.default[key];
  }
  return undefined;
}

function check(name, pass, details = "") {
  checks.push({ name, pass: Boolean(pass), details });
  if (!pass) failures.push({ name, details });
}

const phase1 = await loadModule("content/phase1/index.js");
const curriculumModule = await loadModule("content/curriculum/index.js")
  || await loadModule("content/curriculum/runtime.js");
if (!phase1 && !curriculumModule) {
  console.log("SKIP experience contract: content/curriculum module is not present yet");
  process.exit(0);
}

const phase1Poems = list(exported(phase1, ["phase1Poems", "poems"]));
const phase1Places = list(exported(phase1, ["phase1Places", "places"]));
const curriculum = exported(curriculumModule, ["curriculum", "CURRICULUM_CONFIG", "CURRICULUM"]) || {};
const coverage = exported(curriculumModule, ["coverage", "COVERAGE", "CONTENT_COVERAGE"]) || {};
const curriculumConfig = exported(curriculumModule, ["CURRICULUM_CONFIG", "config"]) || curriculum.config || {};
const concepts = first(
  exported(curriculumModule, ["concepts", "CONCEPTS", "conceptRegistry"]),
  curriculum.concepts,
  coverage.concepts,
);
const claims = first(
  exported(curriculumModule, ["claims", "CURRICULUM_CLAIMS", "curriculumClaims"]),
  curriculum.claims,
  curriculum.entries,
  curriculum.catalog,
  coverage.curriculum?.claims,
  coverage.claims,
);
const expansionPoems = first(
  exported(curriculumModule, ["poems", "CURRICULUM_POEMS", "corpus"]),
  curriculum.poems,
  curriculum.corpus,
  coverage.corpus,
);
let builtCatalog = [];
const runtimeFilename = path.join(root, "content/catalog/phase1-runtime.json");
if (fs.existsSync(runtimeFilename) && typeof curriculumModule?.buildLearningCatalog === "function") {
  const runtime = JSON.parse(fs.readFileSync(runtimeFilename, "utf8"));
  builtCatalog = curriculumModule.buildLearningCatalog(runtime.catalog || [], phase1Poems);
}
const poemMap = new Map(phase1Poems.map((poem, index) => [idOf(poem) || `anonymous-${index}`, poem]));
for (const poem of [...expansionPoems, ...builtCatalog]) {
  const current = poemMap.get(idOf(poem));
  poemMap.set(idOf(poem), current ? {
    ...poem,
    ...current,
    reviewFlags: current.reviewFlags || poem.reviewFlags || poem.review,
    maturity: current.maturity || poem.maturity,
    contentTier: current.contentTier || poem.contentTier,
  } : poem);
}
const poems = [...poemMap.values()];
const places = [...new Map([...phase1Places, ...first(exported(curriculumModule, ["places", "GEO_NODES", "geography"]), coverage.geography?.places)].map((place, index) => [idOf(place) || `anonymous-place-${index}`, place])).values()];

const conceptRequired = [
  ["id"], ["term"], ["aliases"], ["category"], ["formalDefinition"],
  ["age7to8", "age7-8"], ["age9to10", "age9-10"], ["age11to12", "age11-12"],
  ["guidedDiscovery", "discovery"], ["poemExamples", "examples"], ["nonExamples"],
  ["commonMisconceptions"], ["followUpQuestions", "followUps"], ["sources", "source"], ["reviewStatus"],
];
check("concept-registry-present", concepts.length > 0, `concepts=${concepts.length}`);
for (const [index, concept] of concepts.entries()) {
  const missing = conceptRequired.filter((keys) => !hasAny(concept, keys)).map((keys) => keys[0]);
  check(`concept-${index + 1}-fields`, missing.length === 0, { id: idOf(concept) || concept.id, missing });
  check(`concept-${index + 1}-sources`, sourcePresent(concept.sources || concept.source), { id: concept.id });
  check(`concept-${index + 1}-review-status-present`, Boolean(text(concept.reviewStatus)), { id: concept.id, reviewStatus: concept.reviewStatus, candidateMustStayClearlyLabeled: isCandidate(concept.reviewStatus) });
}

const claimRequired = {
  curriculumEdition: ["curriculumEdition", "edition", "editionId"],
  publisher: ["publisher", "publisherId"],
  stage: ["stage", "schoolStage"],
  grade: ["grade", "gradeLevel"],
  semester: ["semester", "term"],
  inClassOrExtra: ["inClassOrExtra", "classMode", "inClass", "scope"],
  requiredOrRecommended: ["requiredOrRecommended", "requirement", "required", "recommended"],
  source: ["source", "sources", "provenance"],
  validFrom: ["validFrom", "valid_from"],
  validTo: ["validTo", "valid_to"],
  verificationStatus: ["verificationStatus", "reviewStatus", "review"],
};
const claimContexts = new Map();
const aliasOwners = new Map();
const aliasCollisions = [];
for (const [index, claim] of claims.entries()) {
  const missing = Object.entries(claimRequired).filter(([field, keys]) => {
    const value = keys.map((key) => claim?.[key]).find((item) => item !== undefined);
    return field === "source" ? !sourcePresent(value) : !has(value);
  }).map(([field]) => field);
  check(`curriculum-claim-${index + 1}-fields`, missing.length === 0, { id: idOf(claim), missing });
  const status = statusOf(claim);
  check(`curriculum-claim-${index + 1}-verification`, Boolean(status), { id: idOf(claim), status });
  const context = [claim.curriculumEdition || claim.edition || claim.editionId, claim.publisher || claim.publisherId, claim.stage || claim.schoolStage, claim.grade || claim.gradeLevel, claim.semester || claim.term, claim.inClassOrExtra || claim.classMode || claim.inClass || claim.scope, claim.requiredOrRecommended || claim.requirement || claim.required || claim.recommended, idOf(claim) || normalizedTitle(titleOf(claim))].map(text).join("|").toLowerCase();
  if (claimContexts.has(context)) failures.push({ name: "curriculum-duplicate-claims", details: { first: claimContexts.get(context), duplicate: { index, id: idOf(claim) } } });
  else claimContexts.set(context, { index, id: idOf(claim) });
  for (const aliasValue of first(claim.aliases, claim.titleAliases, claim.title?.aliases)) {
    const alias = normalizedTitle(aliasValue);
    if (!alias) continue;
    const owner = idOf(claim) || `claim-${index}`;
    if (aliasOwners.has(alias) && aliasOwners.get(alias).owner !== owner) aliasCollisions.push({ alias, first: aliasOwners.get(alias), duplicate: { owner, index } });
    else aliasOwners.set(alias, { owner, index });
  }
}
check("curriculum-claims-present", claims.length > 0, `claims=${claims.length}`);
check("curriculum-alias-collisions", aliasCollisions.length === 0, aliasCollisions.slice(0, 20));

const flagAliases = {
  originalText: ["original", "text", "text_version", "textversion", "textreviewed"],
  author: ["author", "poet", "sourceverified"], dynasty: ["dynasty", "period", "era", "sourceverified"], genre: ["genre", "form", "style", "sourceverified"],
  punctuation: ["punctuation", "line_break", "format", "textreviewed"], variants: ["variant", "edition", "异文", "异文", "textreviewed"],
  pinyin: ["pinyin", "pronunciation", "拼音", "pinyinreviewed"], polyphonic: ["polyphonic", "polyphone", "pronunciation_override", "多音", "pinyinreviewed"],
  titleAliases: ["alias", "title_alias", "别名", "异名", "textreviewed"], geography: ["geo", "geography", "place", "location", "地理", "georeviewed"],
};
function flagPresent(record, key) {
  const flags = record?.reviewFlags || record?.qualityReviewFlags || record?.review?.flags || record?.quality?.flags;
  if (Array.isArray(flags)) {
    const values = flags.map((flag) => text(typeof flag === "object" ? flag.id || flag.name || flag.key : flag).toLowerCase());
    return flagAliases[key].some((alias) => values.some((value) => value.includes(alias.toLowerCase())));
  }
  if (flags && typeof flags === "object") return flagAliases[key].some((alias) => Object.keys(flags).some((name) => name.toLowerCase().includes(alias.toLowerCase())));
  return false;
}
const corpusFlagIssues = [];
for (const [index, poem] of poems.entries()) {
  const tier = tierOf(poem);
  const status = statusOf(poem);
  const full = tier === null || tier >= 2 || /reviewed|curated|approved|verified/u.test(status);
  if (!full) continue;
  const missingFlags = Object.keys(flagAliases).filter((key) => !flagPresent(poem, key));
  if (missingFlags.length) corpusFlagIssues.push({ id: idOf(poem), index, missingFlags });
}
check("corpus-quality-review-flags", corpusFlagIssues.length === 0, corpusFlagIssues.slice(0, 40));
check("corpus-quality-identifiers", poems.length > 0 && poems.every((poem) => idOf(poem) && normalizedTitle(titleOf(poem))), `poems=${poems.length}`);

const geography = exported(curriculumModule, ["geography", "GEOGRAPHY", "GEO_GRAPH"])
  || coverage.geography || {};
const relationWhitelist = new Set(first(geography.relationTypeWhitelist, geography.allowedRelationTypes, curriculumConfig.allowedGeoRelationTypes, exported(curriculumModule, ["RELATION_TYPES"])));
const allowedRelationTypes = relationWhitelist.size ? relationWhitelist : new Set([
  "written_at", "describes", "mentions", "poet_present", "imagined", "historical_allusion", "cultural_association", "journey_suggestion", "unknown", "depicts_place", "mentions_place", "destination_mentioned", "departure_place", "written_at_context", "historical_association", "regional_context", "imagined_frontier", "landscape_mentioned", "viewpoint_reference", "river_imagery", "waterway_imagery", "nearby_river", "nearby_lake", "nearby_city", "city_context", "city_contains_lake", "regional_river", "riverfront", "poem_direction_reference", "poem_imagined_direction", "poem_landscape_reference", "poem_viewpoint_reference", "historical_context", "historical_city", "historical_route", "homecoming", "frontier", "landmark_reference", "lake", "mountain", "mountain_association", "mountain_pass", "sea", "waterway", "river_journey", "regional_association", "climb", "spring", "weather", "rain", "moon_imagery", "garden", "cultural_landmark", "landscape_reference", "city_reference",
]);
for (const type of ["depicts_place", "mentions_place", "destination_mentioned", "departure_place", "written_at_context", "historical_association", "regional_context", "imagined_frontier", "landscape_mentioned", "viewpoint_reference", "river_imagery", "waterway_imagery", "nearby_river", "nearby_lake", "nearby_city", "city_context", "city_contains_lake", "regional_river", "riverfront", "poem_direction_reference", "poem_imagined_direction", "poem_landscape_reference", "poem_viewpoint_reference"]) allowedRelationTypes.add(type);
const relations = [
  ...places.flatMap((place) => first(place.surroundingRelations, place.relations)),
  ...poems.flatMap((poem) => first(poem.placeRelations, poem.relations)),
  ...first(geography.relations),
];
const badRelationTypes = relations.map((relation) => text(relation.type || relation.relationType)).filter((type) => !type || !allowedRelationTypes.has(type));
check("geographic-relation-type-whitelist", badRelationTypes.length === 0, [...new Set(badRelationTypes)]);
const badCoordinates = [];
const unknownPins = [];
for (const place of places) {
  const raw = place.coordinates || place.coordinate || place.coords || place.location;
  const point = Array.isArray(raw) ? { longitude: Number(raw[0]), latitude: Number(raw[1]) } : { longitude: Number(raw?.longitude ?? raw?.lon ?? raw?.lng), latitude: Number(raw?.latitude ?? raw?.lat) };
  const precision = text(place.precision || place.coordinatePrecision || place.locationPrecision).toLowerCase();
  const unknown = !Number.isFinite(point.longitude) || !Number.isFinite(point.latitude) || /unknown|unresolved|no_pin|none|未定/u.test(precision);
  const pin = place.pin === true || place.showOnMap === true || place.map?.pin === true;
  if (unknown && pin) unknownPins.push(idOf(place));
  if (!unknown && (point.longitude < -180 || point.longitude > 180 || point.latitude < -90 || point.latitude > 90 || !precision || !(place.coordinateOrder || place.coordinateSystem || place.validTime))) badCoordinates.push({ id: idOf(place), point, precision });
}
check("geographic-coordinate-precision", badCoordinates.length === 0, badCoordinates.slice(0, 40));
check("geographic-unknown-no-pin", unknownPins.length === 0, unknownPins);

const tierIssues = poems.filter((poem) => {
  const tier = tierOf(poem);
  return tier === null || (tier >= 2 && isCandidate(statusOf(poem)));
});
check("content-tier-honesty", tierIssues.length === 0, tierIssues.map((poem) => ({ id: idOf(poem), tier: tierOf(poem), status: statusOf(poem) })).slice(0, 40));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} ${item.name}${item.details ? ` — ${JSON.stringify(item.details)}` : ""}`);
if (failures.some((failure) => failure.name === "curriculum-duplicate-claims")) {
  console.error("FAIL curriculum-duplicate-claims — duplicate contexts detected");
}
if (failures.length) {
  console.error(`Experience contract failed: ${failures.length} issue(s)`);
  process.exitCode = 1;
} else {
  console.log("Experience contract passed");
}
