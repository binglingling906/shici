#!/usr/bin/env node

/**
 * Deterministic checks for the curriculum, concept and geography data layer.
 *
 * This checker deliberately reads the existing 100-entry runtime and asks
 * the new layer to join it by id.  It therefore catches accidental catalog
 * drift and does not allow a second, silently copied poem corpus to become
 * the source of truth.
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CATALOG_IDS,
  CONCEPTS,
  CURRICULUM_CLAIMS,
  CURRICULUM_CONFIG,
  CURRICULUM_REVISION_ADDENDUM,
  CULTURAL_REGIONS,
  GEO_NODES,
  GOLD_IDS,
  GUIDED_IDS,
  IMMERSIVE_IDS,
  POEM_CONCEPTS,
  REVIEW_FLAG_DEFINITIONS,
  buildLearningCatalog,
  buildPoemConceptLinks,
  buildPoemGeoRelations,
  coverageSummary,
} from "../content/curriculum/index.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const RUNTIME_PATH = resolve(ROOT, "content/catalog/phase1-runtime.json");
const errors = [];

const REQUIRED_CLAIM_FIELDS = [
  "curriculumEdition",
  "publisher",
  "stage",
  "grade",
  "semester",
  "inClassOrExtra",
  "requiredOrRecommended",
  "source",
  "validFrom",
  "validTo",
  "verificationStatus",
];

const REQUIRED_CONCEPT_FIELDS = [
  "id",
  "term",
  "aliases",
  "category",
  "formalDefinition",
  "age7to8",
  "age9to10",
  "age11to12",
  "guidedDiscovery",
  "poemExamples",
  "nonExamples",
  "commonMisconceptions",
  "followUpQuestions",
  "sources",
  "reviewStatus",
];

const REGION_IDS = new Set(CULTURAL_REGIONS.map((region) => region.id));

function fail(message) {
  errors.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function nonEmpty(value) {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
}

function checkSource(owner, source) {
  assert(typeof source?.id === "string" && source.id.trim(), `${owner} source needs id`);
  assert(typeof source?.url === "string" && /^https:\/\//u.test(source.url), `${owner} source URL must be https`);
  assert(typeof source?.title === "string" && source.title.trim(), `${owner} source needs title`);
  assert(typeof source?.license === "string" && source.license.trim(), `${owner} source needs license`);
  assert(Array.isArray(source?.supports) && source.supports.length > 0, `${owner} source needs supports[]`);
  assert(source?.retrievedAt === "2026-09-01", `${owner} source retrievedAt must be 2026-09-01`);
}

function checkClaim(claim, runtimeIds) {
  assert(typeof claim?.poemId === "string" && runtimeIds.has(claim.poemId), `claim ${claim?.claimId || "(unknown)"} points to unknown poem`);
  for (const field of REQUIRED_CLAIM_FIELDS) assert(nonEmpty(claim?.[field]), `claim ${claim?.poemId || "(unknown)"} missing ${field}`);
  assert(CURRICULUM_CONFIG.claimEnums.stage.includes(claim.stage), `claim ${claim.poemId} stage is invalid`);
  assert(CURRICULUM_CONFIG.claimEnums.inClassOrExtra.includes(claim.inClassOrExtra), `claim ${claim.poemId} inClassOrExtra is invalid`);
  assert(CURRICULUM_CONFIG.claimEnums.requiredOrRecommended.includes(claim.requiredOrRecommended), `claim ${claim.poemId} requiredOrRecommended is invalid`);
  assert(CURRICULUM_CONFIG.claimEnums.verificationStatus.includes(claim.verificationStatus), `claim ${claim.poemId} verificationStatus is invalid`);
  assert(Array.isArray(claim.source) && claim.source.length > 0, `claim ${claim.poemId} needs source[]`);
  for (const source of claim.source || []) checkSource(`claim ${claim.poemId}`, source);
  if (claim.verificationStatus === "candidate") {
    assert(claim.inClassOrExtra === "extra", `candidate claim ${claim.poemId} cannot claim in-class`);
    assert(claim.requiredOrRecommended === "recommended_memorization", `candidate claim ${claim.poemId} must remain a recommendation candidate`);
    assert(claim.textbookStatus === "not-verified", `candidate claim ${claim.poemId} cannot look textbook-verified`);
  } else {
    assert(claim.textbookStatus === "verified-item-level", `source-verified claim ${claim.poemId} needs item-level verification`);
    assert(claim.source.some((source) => source.supports?.includes("item_level_textbook_directory")), `source-verified claim ${claim.poemId} needs an item-level official directory source`);
    assert(["textbook_inclusion", "textbook_extra_recitation"].includes(claim.requiredOrRecommended), `source-verified claim ${claim.poemId} needs precise textbook placement`);
  }
}

function checkConcept(concept) {
  for (const field of REQUIRED_CONCEPT_FIELDS) assert(nonEmpty(concept?.[field]), `concept ${concept?.id || "(unknown)"} missing ${field}`);
  for (const source of concept.sources || []) checkSource(`concept ${concept.id}`, source);
  assert(Array.isArray(concept.aliases), `concept ${concept.id} aliases must be an array`);
  assert(Array.isArray(concept.poemExamples), `concept ${concept.id} poemExamples must be an array`);
  assert(Array.isArray(concept.nonExamples), `concept ${concept.id} nonExamples must be an array`);
  assert(Array.isArray(concept.commonMisconceptions), `concept ${concept.id} commonMisconceptions must be an array`);
  assert(Array.isArray(concept.followUpQuestions), `concept ${concept.id} followUpQuestions must be an array`);
  for (const age of ["age7to8", "age9to10", "age11to12"]) {
    assert(typeof concept[age] === "string" && concept[age].trim(), `concept ${concept.id} ${age} must be non-empty`);
  }
}

function checkNode(node) {
  assert(typeof node?.id === "string" && node.id.trim(), "geo node id is missing");
  assert(typeof node?.name === "string" && node.name.trim(), `geo node ${node.id} name is missing`);
  assert(typeof node?.regionId === "string" && REGION_IDS.has(node.regionId), `geo node ${node.id} region is missing or invalid`);
  assert(node.positionKind === "approximate_point" || node.positionKind === "unknown", `geo node ${node.id} positionKind is invalid`);
  if (node.positionKind === "unknown") {
    assert(node.coordinates === null, `unknown geo node ${node.id} cannot carry coordinates`);
  } else {
    assert(Array.isArray(node.coordinates) && node.coordinates.length === 2, `mapped geo node ${node.id} needs coordinates`);
    assert(node.coordinates.every((value) => Number.isFinite(value)), `mapped geo node ${node.id} coordinates must be finite`);
    assert(node.coordinates[0] >= -180 && node.coordinates[0] <= 180, `geo node ${node.id} longitude is invalid`);
    assert(node.coordinates[1] >= -90 && node.coordinates[1] <= 90, `geo node ${node.id} latitude is invalid`);
  }
  assert(node.validTime?.asOf === "2026-09-01", `geo node ${node.id} validTime.asOf is missing`);
  assert(typeof node.precision === "string" && node.precision.trim(), `geo node ${node.id} precision is missing`);
  assert(typeof node.confidence === "string" && node.confidence.trim(), `geo node ${node.id} confidence is missing`);
  assert(Array.isArray(node.sources) && node.sources.length > 0, `geo node ${node.id} needs sources`);
  for (const source of node.sources || []) checkSource(`geo node ${node.id}`, source);
  assert(typeof node.license === "string" && node.license.trim(), `geo node ${node.id} license is missing`);
}

function checkRelation(relation, runtimeIds, nodeIds) {
  assert(typeof relation?.id === "string" && relation.id.trim(), "geo relation id is missing");
  assert(runtimeIds.has(relation.poemId), `geo relation ${relation.id} has unknown poem`);
  assert(nodeIds.has(relation.nodeId), `geo relation ${relation.id} has unknown node`);
  assert(CURRICULUM_CONFIG.allowedGeoRelationTypes.includes(relation.type), `geo relation ${relation.id} has forbidden type ${relation.type}`);
  assert(typeof relation.rationale === "string" && relation.rationale.trim(), `geo relation ${relation.id} needs rationale`);
  assert(Array.isArray(relation.lineRefs) && relation.lineRefs.length > 0, `geo relation ${relation.id} needs lineRefs`);
  assert(typeof relation.confidence === "string" && relation.confidence.trim(), `geo relation ${relation.id} needs confidence`);
  assert(Array.isArray(relation.source) && relation.source.length > 0, `geo relation ${relation.id} needs source[]`);
  for (const source of relation.source || []) checkSource(`geo relation ${relation.id}`, source);
  assert(typeof relation.reviewStatus === "string" && relation.reviewStatus.trim(), `geo relation ${relation.id} needs reviewStatus`);
}

function checkConceptRelation(relation, runtimeIds, conceptIds) {
  assert(typeof relation?.id === "string" && relation.id.trim(), "concept relation id is missing");
  assert(runtimeIds.has(relation.poemId), `concept relation ${relation.id} has unknown poem`);
  assert(conceptIds.has(relation.conceptId), `concept relation ${relation.id} has unknown concept`);
  assert(typeof relation.rationale === "string" && relation.rationale.trim(), `concept relation ${relation.id} needs rationale`);
  assert(Array.isArray(relation.lineRefs) && relation.lineRefs.length > 0, `concept relation ${relation.id} needs lineRefs`);
  assert(Array.isArray(relation.ageBands) && relation.ageBands.length === 3, `concept relation ${relation.id} needs all ageBands`);
  for (const age of ["7-8", "9-10", "11-12"]) assert(relation.ageBands.includes(age), `concept relation ${relation.id} missing age ${age}`);
  assert(typeof relation.role === "string" && relation.role.trim(), `concept relation ${relation.id} needs role`);
  assert(typeof relation.reviewStatus === "string" && relation.reviewStatus.trim(), `concept relation ${relation.id} needs reviewStatus`);
}

function checkQijueFlow(concept) {
  assert(concept?.term === "七言绝句", "七言绝句 concept is missing");
  const steps = concept?.guidedDiscovery?.offlineSteps;
  assert(Array.isArray(steps) && steps.length >= 3, "七言绝句 needs at least three offline steps");
  const first = steps?.find((step) => step.id === "count-first-line-1-to-7");
  assert(first?.offline === true, "七言绝句 first count step must be offline");
  assert(first?.expectedCount === 7, "七言绝句 first count step must expect 7");
  assert(JSON.stringify(first?.tokenIndexes) === JSON.stringify([1, 2, 3, 4, 5, 6, 7]), "七言绝句 first count step must expose token indexes 1–7");
  const discover = steps?.find((step) => step.id === "discover-four-lines");
  assert(discover?.expectedAnswer === "四句", "七言绝句 needs a four-line discovery step");
  assert(discover?.lineRefs?.length === 4, "七言绝句 four-line discovery must reference four lines");
  const follow = steps?.find((step) => step.id === "continue-ask-jueju-rhyme");
  assert(follow?.offline === true, "七言绝句 follow-up step must be offline");
  assert(follow?.nextConceptIds?.includes("qiyan-jueju"), "七言绝句 follow-up must continue with qijue");
  assert(follow?.nextConceptIds?.includes("yayin"), "七言绝句 follow-up must continue with rhyme");
}

async function main() {
  const runtime = JSON.parse(await readFile(RUNTIME_PATH, "utf8"));
  const catalog = runtime.catalog || [];
  const runtimeIds = new Set(catalog.map((item) => item.id));
  const nodeIds = new Set(GEO_NODES.map((node) => node.id));
  const conceptIds = new Set(CONCEPTS.map((concept) => concept.id));

  assert(catalog.length === 100, `runtime catalog has ${catalog.length}; expected 100`);
  assert(CATALOG_IDS.length === 100, `curriculum CATALOG_IDS has ${CATALOG_IDS.length}; expected 100`);
  assert(new Set(CATALOG_IDS).size === CATALOG_IDS.length, "curriculum CATALOG_IDS are not unique");
  assert(CATALOG_IDS.every((id) => runtimeIds.has(id)), "curriculum IDs must exactly reference runtime IDs");
  assert(runtimeIds.size === CATALOG_IDS.length, "runtime has ids absent from curriculum layer");

  assert(Array.isArray(CURRICULUM_CONFIG.maturityLayers), "maturity layers are missing");
  for (const layer of ["mother", "curriculum", "standard", "guided", "immersive"]) {
    assert(CURRICULUM_CONFIG.maturityLayers.includes(layer), `maturity layer ${layer} is missing`);
  }
  assert(CURRICULUM_CONFIG.sourcePolicy.noExternalTextDuplication === true, "source policy must prevent external text duplication");
  assert(CURRICULUM_CONFIG.sourcePolicy.candidateClaimsAreNotVerified === true, "candidate claim policy is missing");
  assert(CURRICULUM_CONFIG.defaultSnapshot.includes("2024修订统编小学/初中"), "default curriculum frame must use 2024 revised primary/middle PEP");
  assert(CURRICULUM_CONFIG.defaultSnapshot.includes("2023统编高中五册"), "default curriculum frame must use 2023 high five volumes");
  assert(CURRICULUM_CONFIG.revisionAddendumPolicy.mergedIntoDefault === false, "2024 transition note must remain independent per-poem");

  const claimIds = new Set();
  assert(CURRICULUM_CLAIMS.filter((claim) => claim.verificationStatus === "candidate").length === 100, "curriculum layer must retain 100 explicit candidates");
  assert(CURRICULUM_CLAIMS.filter((claim) => claim.verificationStatus === "source-verified").length >= 10, "curriculum layer needs item-level verified examples across school stages");
  for (const claim of CURRICULUM_CLAIMS) {
    assert(!claimIds.has(claim.claimId), `duplicate claim id ${claim.claimId}`);
    claimIds.add(claim.claimId);
    checkClaim(claim, runtimeIds);
  }
  assert(CURRICULUM_REVISION_ADDENDUM.length === 1, "2024 transition addendum must remain a separate record");
  assert(CURRICULUM_REVISION_ADDENDUM[0].notMergedIntoDefault === true, "transition addendum must not be merged into per-poem claims");
  const addendum = CURRICULUM_REVISION_ADDENDUM[0];
  for (const field of REQUIRED_CLAIM_FIELDS) assert(nonEmpty(addendum?.[field]), `2024 transition addendum missing ${field}`);
  assert(addendum.poemId === null && addendum.notMergedIntoDefault === true, "2024 transition addendum must not claim a poem");
  assert(addendum.requiredOrRecommended === "recommended_memorization", "transition addendum must use recommended_memorization");
  assert(addendum.verificationStatus === "candidate", "transition addendum must remain candidate");
  for (const source of addendum.source || []) checkSource("2024 transition addendum", source);

  assert(GOLD_IDS.length === 10, `gold set has ${GOLD_IDS.length}; expected 10`);
  assert(new Set(GOLD_IDS).size === GOLD_IDS.length, "gold ids are not unique");
  assert(GOLD_IDS.every((id) => runtimeIds.has(id)), "gold ids must exist in runtime");
  assert(IMMERSIVE_IDS.length === 30, `immersive set has ${IMMERSIVE_IDS.length}; expected 30`);
  assert(new Set(IMMERSIVE_IDS).size === IMMERSIVE_IDS.length, "immersive ids are not unique");
  assert(IMMERSIVE_IDS.every((id) => runtimeIds.has(id)), "immersive ids must exist in runtime");
  assert(GOLD_IDS.every((id) => IMMERSIVE_IDS.includes(id)), "all 10 gold units must be immersive");
  assert(IMMERSIVE_IDS.filter((id) => !GOLD_IDS.includes(id)).length === 20, "immersive must add exactly 20 non-gold poems");
  assert(GUIDED_IDS.length > 0, "guided set cannot be empty");
  assert(GUIDED_IDS.every((id) => runtimeIds.has(id)), "guided ids must exist in runtime");

  const immersiveRuntime = catalog.filter((item) => IMMERSIVE_IDS.includes(item.id));
  for (const item of immersiveRuntime.filter((item) => !GOLD_IDS.includes(item.id))) {
    const scores = item.scores || {};
    assert(scores.imageClarity >= 5 && scores.placeClarity >= 4 && scores.spatialLearningValue >= 4, `immersive ${item.id} does not meet image/place/spatial gate`);
  }

  const joined = buildLearningCatalog(catalog);
  assert(joined.length === 100, `joined learning catalog has ${joined.length}; expected 100`);
  for (const item of joined) {
    for (const field of ["id", "title", "author", "dynasty", "genre", "text", "themes", "placeCandidates", "maturity", "review", "curriculumClaims", "conceptRelations"]) {
      assert(item[field] !== undefined, `joined ${item.id} missing ${field}`);
    }
    assert(["standard", "guided", "immersive"].includes(item.maturity), `joined ${item.id} maturity is invalid`);
    assert(item.maturityPath.includes("mother") && item.maturityPath.includes("curriculum") && item.maturityPath.includes("standard"), `joined ${item.id} maturity path misses base layers`);
    for (const key of CURRICULUM_CONFIG.reviewFlagKeys) assert(typeof item.reviewFlags?.[key] === "boolean", `joined ${item.id} review flag ${key} must be boolean`);
    assert(item.curriculumClaims.length === 1, `joined ${item.id} needs one candidate claim`);
    assert(item.conceptRelations.length > 0, `joined ${item.id} needs at least one concept relation`);
  }

  assert(CULTURAL_REGIONS.length === 8, `cultural regions has ${CULTURAL_REGIONS.length}; expected 8`);
  const regionIds = new Set();
  for (const region of CULTURAL_REGIONS) {
    assert(!regionIds.has(region.id), `duplicate cultural region ${region.id}`);
    regionIds.add(region.id);
    assert(typeof region.name === "string" && region.name.trim(), `region ${region.id} needs name`);
    assert(typeof region.routeLabel === "string" && region.routeLabel.trim(), `region ${region.id} needs routeLabel`);
    assert(Array.isArray(region.anchorNodeIds) && region.anchorNodeIds.length > 0, `region ${region.id} needs anchor nodes`);
    assert(region.anchorNodeIds.every((id) => nodeIds.has(id)), `region ${region.id} references unknown node`);
    assert(typeof region.routeDisclaimer === "string" && region.routeDisclaimer.includes("不是"), `region ${region.id} needs route disclaimer`);
    for (const source of region.sources || []) checkSource(`region ${region.id}`, source);
  }

  assert(GEO_NODES.length >= 15, `geo nodes has ${GEO_NODES.length}; expected at least 15`);
  assert(new Set(GEO_NODES.map((node) => node.id)).size === GEO_NODES.length, "geo node ids are not unique");
  for (const node of GEO_NODES) checkNode(node);
  assert(GEO_NODES.filter((node) => node.positionKind !== "unknown").length >= 15, "at least 15 geo nodes must be mappable");

  const geoRelations = buildPoemGeoRelations(catalog);
  assert(geoRelations.length >= 100, `geo relations has ${geoRelations.length}; expected at least one per poem`);
  for (const relation of geoRelations) checkRelation(relation, runtimeIds, nodeIds);
  assert(new Set(geoRelations.map((relation) => relation.poemId)).size === 100, "every poem needs a geographic relationship record");
  assert(geoRelations.some((relation) => relation.type === "unknown"), "unknown geo relation must be represented explicitly");

  assert(CONCEPTS.length >= 15, `concepts has ${CONCEPTS.length}; expected at least 15`);
  assert(new Set(CONCEPTS.map((concept) => concept.id)).size === CONCEPTS.length, "concept ids are not unique");
  for (const concept of CONCEPTS) checkConcept(concept);
  for (const term of ["七言绝句", "五言绝句", "律诗", "词牌", "乐府", "押韵", "对仗", "夸张", "借景抒情", "送别诗", "边塞诗", "上游", "下游", "古代地名", "朝代"]) {
    assert(CONCEPTS.some((concept) => concept.term === term), `required concept ${term} is missing`);
  }
  checkQijueFlow(CONCEPTS.find((concept) => concept.term === "七言绝句"));

  const conceptRelations = buildPoemConceptLinks(catalog);
  assert(conceptRelations.length >= 100, `concept relations has ${conceptRelations.length}; expected at least one per poem`);
  for (const relation of conceptRelations) checkConceptRelation(relation, runtimeIds, conceptIds);
  assert(new Set(conceptRelations.map((relation) => relation.poemId)).size === 100, "every poem needs a concept relationship record");
  assert(conceptRelations.some((relation) => relation.poemId === "lushan-wang-lushan-pubu" && relation.conceptId === "qiyan-jueju"), "望庐山瀑布 must link to 七言绝句");
  assert(conceptRelations.some((relation) => relation.poemId === "lushan-wang-lushan-pubu" && relation.conceptId === "yayin"), "望庐山瀑布 must link to 押韵");
  assert(POEM_CONCEPTS.every((relation) => relation.rationale && relation.lineRefs?.length && relation.ageBands?.length && relation.role && relation.reviewStatus), "seed poem-concept relations must retain review fields");

  for (const key of CURRICULUM_CONFIG.reviewFlagKeys) assert(REVIEW_FLAG_DEFINITIONS[key], `review flag definition ${key} is missing`);
  assert(coverageSummary.totalCatalogIds === 100, "coverage summary total must be 100");
  assert(coverageSummary.gold === 10 && coverageSummary.immersive === 30 && coverageSummary.additionalImmersive === 20, "coverage summary maturity totals are wrong");
  assert(coverageSummary.culturalRegions === 8 && coverageSummary.geoNodes >= 15 && coverageSummary.concepts >= 15, "coverage summary spatial/concept totals are wrong");

  if (errors.length) {
    console.error("Curriculum system check failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const mappedNodes = GEO_NODES.filter((node) => node.positionKind !== "unknown").length;
  console.log(`Curriculum system check passed: ${catalog.length} standard poems, ${GOLD_IDS.length} gold, ${IMMERSIVE_IDS.length} immersive (${IMMERSIVE_IDS.length - GOLD_IDS.length} additional), ${GUIDED_IDS.length} guided.`);
  console.log(`Coverage: ${CULTURAL_REGIONS.length} cultural regions, ${GEO_NODES.length} geo nodes (${mappedNodes} mappable), ${CONCEPTS.length} concepts, ${conceptRelations.length} poem-concept links, ${geoRelations.length} poem-geo links.`);
  const candidateClaims = CURRICULUM_CLAIMS.filter((claim) => claim.verificationStatus === "candidate").length;
  const verifiedClaims = CURRICULUM_CLAIMS.filter((claim) => claim.verificationStatus === "source-verified").length;
  console.log(`Curriculum claims: ${candidateClaims} candidate + ${verifiedClaims} item-level source-verified; no candidate is labelled required textbook content.`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
