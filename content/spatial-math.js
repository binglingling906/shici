/**
 * Small, dependency-free geospatial helpers used by the experience data layer.
 *
 * Coordinates are always GeoJSON order: [longitude, latitude].  The helpers
 * intentionally return plain objects so the browser experience and the Node
 * consistency checks share the same calculations.
 */

export const EARTH_RADIUS_KM = 6371.0088;

const DEGREES_PER_RADIAN = 180 / Math.PI;
const RADIANS_PER_DEGREE = Math.PI / 180;

export function toRadians(degrees) {
  return degrees * RADIANS_PER_DEGREE;
}

export function toDegrees(radians) {
  return radians * DEGREES_PER_RADIAN;
}

export function normalizeBearing(degrees) {
  return ((degrees % 360) + 360) % 360;
}

export function isCoordinatePair(value) {
  return Array.isArray(value)
    && value.length === 2
    && Number.isFinite(value[0])
    && Number.isFinite(value[1])
    && value[0] >= -180
    && value[0] <= 180
    && value[1] >= -90
    && value[1] <= 90;
}

export function haversineDistance(from, to, radiusKm = EARTH_RADIUS_KM) {
  if (!isCoordinatePair(from) || !isCoordinatePair(to)) return Number.NaN;

  const [fromLongitude, fromLatitude] = from;
  const [toLongitude, toLatitude] = to;
  const fromPhi = toRadians(fromLatitude);
  const toPhi = toRadians(toLatitude);
  const deltaPhi = toRadians(toLatitude - fromLatitude);
  const deltaLambda = toRadians(toLongitude - fromLongitude);
  const a = Math.sin(deltaPhi / 2) ** 2
    + Math.cos(fromPhi) * Math.cos(toPhi) * Math.sin(deltaLambda / 2) ** 2;

  // Floating point round-off can push a to one or just over one for the
  // antipodal case.  Clamping keeps the public helper deterministic.
  const safeA = Math.min(1, Math.max(0, a));
  return 2 * radiusKm * Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA));
}

export function initialBearing(from, to) {
  if (!isCoordinatePair(from) || !isCoordinatePair(to)) return Number.NaN;

  const [, fromLatitude] = from;
  const [toLongitude, toLatitude] = to;
  const deltaLambda = toRadians(toLongitude - from[0]);
  const fromPhi = toRadians(fromLatitude);
  const toPhi = toRadians(toLatitude);
  const y = Math.sin(deltaLambda) * Math.cos(toPhi);
  const x = Math.cos(fromPhi) * Math.sin(toPhi)
    - Math.sin(fromPhi) * Math.cos(toPhi) * Math.cos(deltaLambda);
  return normalizeBearing(toDegrees(Math.atan2(y, x)));
}

/**
 * Convert a bearing to a child-friendly cardinal phrase.
 *
 * The 16-wind buckets retain the useful nuance in the core journey: 304° is
 * “西北，略偏西”, not a falsely precise compass instruction.
 */
export function bearingToDirection(bearingDegrees) {
  if (!Number.isFinite(bearingDegrees)) {
    return {
      cardinal: "未知方向",
      qualifier: "",
      text: "方向暂不可知",
    };
  }

  const bearing = normalizeBearing(bearingDegrees);
  const directions = [
    { min: 348.75, max: 360, cardinal: "北", qualifier: "" },
    { min: 0, max: 11.25, cardinal: "北", qualifier: "" },
    { min: 11.25, max: 33.75, cardinal: "东北", qualifier: "略偏北" },
    { min: 33.75, max: 56.25, cardinal: "东北", qualifier: "" },
    { min: 56.25, max: 78.75, cardinal: "东", qualifier: "略偏北" },
    { min: 78.75, max: 101.25, cardinal: "东", qualifier: "" },
    { min: 101.25, max: 123.75, cardinal: "东南", qualifier: "略偏南" },
    { min: 123.75, max: 146.25, cardinal: "东南", qualifier: "" },
    { min: 146.25, max: 168.75, cardinal: "南", qualifier: "略偏东" },
    { min: 168.75, max: 191.25, cardinal: "南", qualifier: "" },
    { min: 191.25, max: 213.75, cardinal: "西南", qualifier: "略偏南" },
    { min: 213.75, max: 236.25, cardinal: "西南", qualifier: "" },
    { min: 236.25, max: 258.75, cardinal: "西", qualifier: "略偏南" },
    { min: 258.75, max: 281.25, cardinal: "西", qualifier: "" },
    { min: 281.25, max: 303.75, cardinal: "西北", qualifier: "略偏北" },
    { min: 303.75, max: 326.25, cardinal: "西北", qualifier: "略偏西" },
    { min: 326.25, max: 348.75, cardinal: "北", qualifier: "略偏西" },
  ];
  const match = directions.find(({ min, max }) => bearing >= min && bearing < max)
    || directions[0];
  const text = match.qualifier
    ? `${match.cardinal}，${match.qualifier}`
    : match.cardinal;
  return {
    bearingDegrees: bearing,
    cardinal: match.cardinal,
    qualifier: match.qualifier,
    text,
  };
}

export function roundDistance(distanceKm, incrementKm = 5) {
  if (!Number.isFinite(distanceKm) || !Number.isFinite(incrementKm) || incrementKm <= 0) {
    return Number.NaN;
  }
  return Math.round(distanceKm / incrementKm) * incrementKm;
}

export function formatDistance(distanceKm, {
  incrementKm = 5,
  prefix = "约",
  suffix = "公里（直线距离）",
} = {}) {
  const rounded = roundDistance(distanceKm, incrementKm);
  if (!Number.isFinite(rounded)) return "距离暂不可知";
  return `${prefix}${rounded}${suffix}`;
}

export function computeSpatialRelation(from, to, options = {}) {
  const radiusKm = options.radiusKm || EARTH_RADIUS_KM;
  const distanceKm = haversineDistance(from, to, radiusKm);
  const bearingDegrees = initialBearing(from, to);
  const direction = bearingToDirection(bearingDegrees);
  const distanceIncrementKm = options.distanceIncrementKm || 5;
  return {
    from: [...from],
    to: [...to],
    earthRadiusKm: radiusKm,
    distanceKm,
    bearingDegrees,
    direction,
    distanceIncrementKm,
    distanceRoundedKm: roundDistance(distanceKm, distanceIncrementKm),
    distanceText: formatDistance(distanceKm, { incrementKm: distanceIncrementKm }),
  };
}

export default {
  EARTH_RADIUS_KM,
  toRadians,
  toDegrees,
  normalizeBearing,
  isCoordinatePair,
  haversineDistance,
  initialBearing,
  bearingToDirection,
  roundDistance,
  formatDistance,
  computeSpatialRelation,
};
