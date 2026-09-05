// Historical checker for Spatial Discovery 001. The active contract is check-spatial-system.mjs.
import {
  SPATIAL_SOURCE_URLS,
  spatialExperience,
  spatialJourney,
} from "../content/spatial-lushan-yellow-crane.js";

const failures = [];

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

function coordinates(entity) {
  const values = entity?.geometry?.coordinates;
  assert(entity?.geometry?.type === "Point", `${entity?.id || "entity"} must use a Point geometry`);
  assert(Array.isArray(values) && values.length === 2, `${entity?.id || "entity"} must have [longitude, latitude] coordinates`);
  const [longitude, latitude] = values || [];
  assert(Number.isFinite(longitude) && longitude >= -180 && longitude <= 180, `${entity?.id || "entity"} longitude is out of range`);
  assert(Number.isFinite(latitude) && latitude >= -90 && latitude <= 90, `${entity?.id || "entity"} latitude is out of range`);
  return [longitude, latitude];
}

function haversine([fromLongitude, fromLatitude], [toLongitude, toLatitude], radiusKm) {
  const radians = Math.PI / 180;
  const fromPhi = fromLatitude * radians;
  const toPhi = toLatitude * radians;
  const deltaPhi = (toLatitude - fromLatitude) * radians;
  const deltaLambda = (toLongitude - fromLongitude) * radians;
  const a = Math.sin(deltaPhi / 2) ** 2
    + Math.cos(fromPhi) * Math.cos(toPhi) * Math.sin(deltaLambda / 2) ** 2;
  return 2 * radiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function initialBearing([fromLongitude, fromLatitude], [toLongitude, toLatitude]) {
  const radians = Math.PI / 180;
  const fromPhi = fromLatitude * radians;
  const toPhi = toLatitude * radians;
  const deltaLambda = (toLongitude - fromLongitude) * radians;
  const y = Math.sin(deltaLambda) * Math.cos(toPhi);
  const x = Math.cos(fromPhi) * Math.sin(toPhi)
    - Math.sin(fromPhi) * Math.cos(toPhi) * Math.cos(deltaLambda);
  return (Math.atan2(y, x) / radians + 360) % 360;
}

function validateSourceList(owner, sources) {
  assert(Array.isArray(sources) && sources.length > 0, `${owner} must have at least one source`);
  for (const source of sources || []) {
    assert(typeof source?.url === "string" && /^https:\/\//u.test(source.url), `${owner} has an invalid source URL`);
    assert(typeof source?.title === "string" && source.title.trim(), `${owner} source is missing a title`);
    assert(Array.isArray(source?.supports) && source.supports.length > 0, `${owner} source must declare what it supports`);
    if (source?.url && !Object.values(SPATIAL_SOURCE_URLS).includes(source.url)) {
      fail(`${owner} source URL is not in the curated source registry: ${source.url}`);
    }
  }
}

assert(spatialExperience?.id === "spatial-lushan-yellow-crane-001", "spatial experience id is missing or changed");
assert(spatialExperience?.version === 1, "spatial experience version must be 1 for this slice");
assert(Array.isArray(spatialExperience?.relations) && spatialExperience.relations.length === 1, "this slice must contain exactly one journey relation");

const entities = spatialExperience?.entities || {};
const requiredEntityIds = ["lushan", "lushan-unesco-reference", "yellow-crane"];
for (const id of requiredEntityIds) {
  const entity = entities[id];
  assert(entity?.id === id, `missing entity ${id}`);
  assert(typeof entity?.name === "string" && entity.name.trim(), `${id} is missing a name`);
  assert(entity?.admin && typeof entity.admin.province === "string" && typeof entity.admin.city === "string", `${id} is missing administrative context`);
  assert(typeof entity?.routeAnchor === "string" && entity.routeAnchor.trim(), `${id} is missing routeAnchor`);
  assert(typeof entity?.precision === "string" && entity.precision.trim(), `${id} is missing precision`);
  assert(typeof entity?.confidence === "string" && entity.confidence.trim(), `${id} is missing confidence`);
  assert(entity?.validTime && typeof entity.validTime.kind === "string" && typeof entity.validTime.asOf === "string", `${id} is missing validTime`);
  coordinates(entity);
  validateSourceList(id, entity.sources);
}

const lushan = entities.lushan;
const lushanReference = entities["lushan-unesco-reference"];
const yellowCrane = entities["yellow-crane"];
assert(lushan.precision === "mountain_representative_point", "lushan precision must remain a mountain representative point");
assert(lushan.confidence === "medium", "lushan route point should remain medium confidence");
assert(lushanReference.precision === "UNESCO_property_reference", "UNESCO point precision is missing");
assert(lushanReference.confidence === "high", "UNESCO point confidence should remain high");
assert(yellowCrane.precision === "current_building_pin", "yellow crane must be a current building pin");
assert(yellowCrane.confidence === "medium_high", "yellow crane confidence should remain medium_high");
assert(yellowCrane.validTime.kind === "current_site", "yellow crane validTime must identify the current site");
assert(/1985/u.test(yellowCrane.validTime.label), "yellow crane current-site label must preserve the 1985 reconstruction note");
assert(/唐代/u.test(yellowCrane.validTime.historicalNote || ""), "yellow crane must distinguish its current point from the Tang-era site");

const relation = spatialJourney;
assert(relation?.id === "lushan-to-yellow-crane", "journey relation id is missing");
assert(relation?.from === lushan.id && relation?.to === yellowCrane.id, "journey relation endpoints are not the two core places");
assert(relation?.method === "haversine", "journey relation must declare haversine method");
assert(relation?.computed?.earthRadiusKm === 6371.0088, "journey relation must use the documented mean earth radius");
const fromCoordinates = coordinates(lushan);
const toCoordinates = coordinates(yellowCrane);
const calculatedDistance = haversine(fromCoordinates, toCoordinates, relation.computed.earthRadiusKm);
const calculatedBearing = initialBearing(fromCoordinates, toCoordinates);
approxEqual(relation.computed.distanceKm, calculatedDistance, 0.0001, "stored distanceKm");
approxEqual(relation.computed.bearingDegrees, calculatedBearing, 0.0001, "stored bearingDegrees");
assert(calculatedBearing >= 292.5 && calculatedBearing < 337.5, `calculated bearing ${calculatedBearing} is not northwest`);

const rounding = relation.display?.distanceRoundingKm;
assert(Number.isFinite(rounding) && rounding > 0, "journey relation needs a positive distance rounding rule");
const roundedDistance = Math.round(calculatedDistance / rounding) * rounding;
assert(roundedDistance === 195, `distance display should round to 195km, got ${roundedDistance}`);
assert(relation.display?.distanceText === "约195公里（直线距离）", "distance display copy must state approximate straight-line distance");
assert(/西北/u.test(relation.display?.direction || ""), "journey direction must say northwest");
assert(/沿江/u.test(relation.display?.movementText || "") && /上游/u.test(relation.display?.movementText || ""), "movement copy must describe upstream river orientation");
assert(relation.notAnHistoricalRoute === true, "journey must explicitly reject an inferred historical route");
assert(typeof relation.disclaimer === "string" && /李白/u.test(relation.disclaimer) && /真实行程/u.test(relation.disclaimer), "journey disclaimer must distinguish present-day geography from Li Bai's route");
validateSourceList("lushan-to-yellow-crane", relation.sources);

const lens = spatialExperience.display?.lens;
const readingAnchor = spatialExperience.display?.readingAnchor;
assert(Array.isArray(lens?.levels) && lens.levels.length === 3, "map spatial lens must contain exactly three levels");
assert(Array.isArray(readingAnchor?.levels) && readingAnchor.levels.length === 3, "reading spatial anchor must contain exactly three levels");
assert(lens?.disclaimer === "关系图 · 非导航地图", "map lens must be labelled as a non-navigation relationship diagram");

if (failures.length) {
  console.error("Spatial check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Spatial check passed: ${requiredEntityIds.length} entities, ${spatialExperience.relations.length} relation, ${Math.round(calculatedDistance)}km display distance.`);
}
