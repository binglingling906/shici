#!/usr/bin/env node

/**
 * Deterministic checks for the Spatial System data layer and generated map.
 * These checks cover structure and relationship arithmetic; artistic hierarchy
 * and child comprehension still require the browser evaluator and screenshots.
 */

import { readFile } from "node:fs/promises";

import {
  SPATIAL_LICENSES,
  SPATIAL_RETRIEVED_AT,
  SPATIAL_SOURCE_URLS,
  spatialSystem,
  computeSpatialRelation,
  formatSpatialRelation,
} from "../content/spatial-system.js";
import {
  bearingToDirection,
  EARTH_RADIUS_KM,
  formatDistance,
  haversineDistance,
  initialBearing,
  isCoordinatePair,
} from "../content/spatial-math.js";

const failures = [];
const mapPath = new URL("../content/generated/china-physical-map.json", import.meta.url);

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function approxEqual(actual, expected, tolerance, label) {
  assert(Number.isFinite(actual), `${label} must be finite`);
  if (Number.isFinite(actual)) {
    assert(Math.abs(actual - expected) <= tolerance, `${label} ${actual} differs from ${expected}`);
  }
}

function sourceLicenseIds() {
  return new Set(Object.values(SPATIAL_LICENSES).map((license) => license.id));
}

function checkSources(owner, sources) {
  assert(Array.isArray(sources) && sources.length > 0, `${owner} needs at least one source`);
  for (const record of sources || []) {
    assert(typeof record?.url === "string" && /^https:\/\//u.test(record.url), `${owner} source URL must be https`);
    assert(typeof record?.title === "string" && record.title.trim(), `${owner} source needs a title`);
    assert(Array.isArray(record?.supports) && record.supports.length > 0, `${owner} source needs supports[]`);
    assert(record?.retrievedAt === SPATIAL_RETRIEVED_AT, `${owner} source retrievedAt must be ${SPATIAL_RETRIEVED_AT}`);
    assert(typeof record?.license === "string" && record.license.trim(), `${owner} source needs a license id`);
  }
}

function checkGeometry(id, geometry) {
  const kinds = spatialSystem.schema.positionKinds;
  assert(kinds.includes(geometry?.positionKind), `${id} geometry positionKind is invalid`);
  if (geometry?.positionKind === "unknown") {
    assert(geometry.coordinates === null || geometry.coordinates === undefined, `${id} unknown geometry cannot carry coordinates`);
    return;
  }
  if (geometry?.positionKind === "region") {
    const bbox = geometry.bbox;
    assert(Array.isArray(bbox) && bbox.length === 4, `${id} region must carry [west,south,east,north] bbox`);
    if (Array.isArray(bbox) && bbox.length === 4) {
      const [west, south, east, north] = bbox;
      assert(west < east && south < north, `${id} region bbox must be ordered`);
      assert(west >= -180 && east <= 180 && south >= -90 && north <= 90, `${id} region bbox is out of range`);
    }
  }
  assert(isCoordinatePair(geometry?.coordinates), `${id} geometry needs a valid representative coordinate`);
}

function checkEntity(id, entity) {
  assert(entity?.id === id, `${id} entity id is missing or mismatched`);
  assert(spatialSystem.schema.entityTypes.includes(entity?.type), `${id} entity type is not in schema`);
  assert(typeof entity?.modernName === "string" && entity.modernName.trim(), `${id} modernName is missing`);
  assert(Array.isArray(entity?.historicalNames), `${id} historicalNames must be an array`);
  assert(entity?.validTime && typeof entity.validTime.kind === "string", `${id} validTime.kind is missing`);
  assert(entity?.validTime?.asOf === SPATIAL_RETRIEVED_AT, `${id} validTime.asOf must be ${SPATIAL_RETRIEVED_AT}`);
  assert(typeof entity?.precision === "string" && entity.precision.trim(), `${id} precision is missing`);
  assert(typeof entity?.confidence === "string" && entity.confidence.trim(), `${id} confidence is missing`);
  assert(Array.isArray(entity?.disputes), `${id} disputes must be an array`);
  checkGeometry(id, entity.geometry);
  checkSources(id, entity.sources);
  assert(entity?.license && typeof entity.license.id === "string", `${id} license metadata is missing`);
}

function checkRelation(relation) {
  const owner = relation?.id || "relation";
  assert(typeof relation?.id === "string" && relation.id.trim(), "relation id is missing");
  assert(spatialSystem.entities[relation?.from], `${owner} from endpoint does not exist`);
  assert(spatialSystem.entities[relation?.to], `${owner} to endpoint does not exist`);
  assert(spatialSystem.schema.relationTypes.includes(relation?.type), `${owner} type is not in schema`);
  assert(spatialSystem.schema.relationKinds.includes(relation?.relation), `${owner} relation kind is not in schema`);
  checkSources(owner, relation.sources);
  if (relation.type === "system_recommendation" || relation.relation === "journey") {
    assert(relation.notAnHistoricalRoute === true || typeof relation.disclaimer === "string", `${owner} needs a historical-route disclaimer`);
  }
  if (relation.validTime) {
    assert(relation.validTime.asOf === SPATIAL_RETRIEVED_AT, `${owner} validTime.asOf must be ${SPATIAL_RETRIEVED_AT}`);
  }
}

function checkMapAsset(map) {
  assert(typeof map?.viewBox === "string" && /^0 0 \d+ \d+$/u.test(map.viewBox), "map viewBox is missing or invalid");
  assert(typeof map?.layers?.landPath === "string" && map.layers.landPath.startsWith("M"), "map landPath must be a generated SVG path");
  assert(Array.isArray(map?.layers?.rivers) && map.layers.rivers.length > 0, "map must include generated river paths");
  assert(Array.isArray(map?.layers?.lakes) && map.layers.lakes.length > 0, "map must include generated lake paths");
  for (const layer of [...(map.layers.rivers || []), ...(map.layers.lakes || [])]) {
    assert(typeof layer.path === "string" && layer.path.length > 10, `generated ${layer.type} path is missing`);
    assert(layer.source?.license === SPATIAL_LICENSES.naturalEarth.id, `generated ${layer.type} must retain Natural Earth license`);
    assert(/^https:\/\//u.test(layer.source?.url || ""), `generated ${layer.type} source URL is invalid`);
  }
  for (const scopeId of ["china", "middleYangtze", "lushan"]) {
    const scope = map.scopes?.[scopeId];
    assert(scope?.id === scopeId, `generated map scope ${scopeId} is missing`);
    assert(Array.isArray(scope?.geographicBounds) && scope.geographicBounds.length === 4, `generated map scope ${scopeId} needs bounds`);
    assert(Array.isArray(scope?.focusIds) && scope.focusIds.length > 0, `generated map scope ${scopeId} needs focusIds`);
  }
  const projected = map.projectedEntities || {};
  for (const id of ["china", "yangtze", "poyang-lake", "jiujiang", "lushan", "wuhan", "yellow-crane"]) {
    assert(Number.isFinite(projected[id]?.x) && Number.isFinite(projected[id]?.y), `generated projected entity ${id} is missing`);
  }
  const lushan = projected.lushan;
  const yellowCrane = projected["yellow-crane"];
  // Screen coordinates are north-up: west is smaller x and north is smaller y.
  assert(yellowCrane.x < lushan.x, "generated map must place Yellow Crane west of Lushan");
  assert(yellowCrane.y < lushan.y, "generated map must place Yellow Crane north of Lushan");
}

const requiredEntityIds = [
  "china",
  "yangtze",
  "poyang-lake",
  "jiujiang",
  "lushan",
  "wuhan",
  "yellow-crane",
  "li-bai",
  "wang-lushan-pubu",
];

assert(spatialSystem?.id === "shanhe-spatial-system", "spatialSystem id is missing");
assert(spatialSystem?.version === 1, "spatialSystem version must be 1");
for (const type of ["country", "region", "river", "lake", "city", "mountain", "cultural_landmark", "poem", "person"]) {
  assert(spatialSystem.schema.entityTypes.includes(type), `schema must support entity type ${type}`);
}
for (const kind of ["exact_point", "approximate_point", "region", "unknown"]) {
  assert(spatialSystem.schema.positionKinds.includes(kind), `schema must support geometry ${kind}`);
}
for (const type of ["present_day_geography", "historical_fact", "cultural_link", "research_hypothesis", "system_recommendation"]) {
  assert(spatialSystem.schema.relationTypes.includes(type), `schema must support relation type ${type}`);
}
for (const kind of ["river", "nearby", "journey", "work", "person"]) {
  assert(spatialSystem.schema.relationKinds.includes(kind), `schema must support relation kind ${kind}`);
}

for (const id of requiredEntityIds) {
  const record = spatialSystem.entities[id];
  assert(record, `required entity ${id} is missing`);
  if (record) checkEntity(id, record);
}
for (const [id, record] of Object.entries(spatialSystem.entities)) checkEntity(id, record);
for (const [id, record] of Object.entries(spatialSystem.originCities || {})) {
  checkEntity(id, record);
  assert(record.geometry.positionKind === "approximate_point", `origin city ${id} must be approximate_point`);
  assert(record.privacy?.granularity === "city_id_only", `origin city ${id} must be city_id_only`);
  assert(record.privacy?.gps === false && record.privacy?.address === false, `origin city ${id} must not use GPS/address`);
}
assert(Object.keys(spatialSystem.originCities || {}).length >= 5, "at least five optional origin cities are required");

for (const relation of spatialSystem.relations) checkRelation(relation);
assert(spatialSystem.relations.some((relation) => relation.type === "present_day_geography" && relation.relation === "river"), "river relation is missing");
assert(spatialSystem.relations.some((relation) => relation.type === "historical_fact"), "historical_fact relation is missing");
assert(spatialSystem.relations.some((relation) => relation.type === "cultural_link"), "cultural_link relation is missing");
assert(spatialSystem.relations.some((relation) => relation.type === "research_hypothesis"), "research_hypothesis relation is missing");
assert(spatialSystem.relations.some((relation) => relation.type === "system_recommendation"), "system_recommendation relation is missing");

const core = computeSpatialRelation("lushan", "yellow-crane");
assert(core, "core Lushan → Yellow Crane relation cannot be computed");
if (core) {
  const from = spatialSystem.entities.lushan.geometry.coordinates;
  const to = spatialSystem.entities["yellow-crane"].geometry.coordinates;
  approxEqual(core.distanceKm, haversineDistance(from, to, EARTH_RADIUS_KM), 0.000001, "core distance");
  approxEqual(core.bearingDegrees, initialBearing(from, to), 0.000001, "core bearing");
  approxEqual(core.distanceKm, 194.33939880503263, 0.01, "core expected distance");
  approxEqual(core.bearingDegrees, 304.303137940724, 0.01, "core expected bearing");
  assert(core.distanceText === formatDistance(core.distanceKm, { incrementKm: 5 }), "core distance text must be generated");
  assert(core.direction.text === bearingToDirection(core.bearingDegrees).text, "core direction must be generated");
  const formatted = formatSpatialRelation("lushan", "yellow-crane");
  assert(formatted?.distanceText === "约195公里（直线距离）", "core display distance must be 约195公里");
  assert(/西北/u.test(formatted?.directionText || ""), "core display direction must be northwest");
  assert(/上游/u.test(formatted?.movementText || ""), "core display movement must say upstream");
  assert(/李白/u.test(formatted?.disclaimer || "") && /真实行程/u.test(formatted?.disclaimer || ""), "core display must preserve route disclaimer");
  const stored = spatialSystem.relations.find((relation) => relation.id === "lushan-to-yellow-crane-geography");
  assert(stored?.computed?.method === "haversine", "stored core relation must use haversine");
  approxEqual(stored?.computed?.distanceKm, core.distanceKm, 0.000001, "stored core distance");
  approxEqual(stored?.computed?.bearingDegrees, core.bearingDegrees, 0.000001, "stored core bearing");
  assert(stored?.display?.distanceText === formatted.distanceText, "stored display distance must match generator");
  assert(stored?.display?.direction === formatted.directionText, "stored display direction must match generator");
}

const map = JSON.parse(await readFile(mapPath, "utf8"));
checkMapAsset(map);

if (failures.length) {
  console.error("Spatial system check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const cityCount = Object.keys(spatialSystem.originCities).length;
  console.log(`Spatial system check passed: ${Object.keys(spatialSystem.entities).length} entities, ${spatialSystem.relations.length} relations, ${cityCount} origin cities, generated map verified.`);
}
