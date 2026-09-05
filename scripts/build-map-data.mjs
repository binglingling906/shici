#!/usr/bin/env node

/**
 * Build the lightweight map artifact consumed by the prototype.
 *
 * Source archives are downloaded to a disposable temporary directory and
 * removed in finally.  No Natural Earth ZIP, SHP or DBF is checked into the
 * repository.  The output is a small, inspectable JSON artifact containing
 * projected SVG path strings and entity positions; it is not a new GIS
 * service or a replacement for the source data.
 */

import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import path from "node:path";

import { geoBounds, geoMercator, geoPath } from "d3-geo";
import shapefile from "shapefile";

import {
  SPATIAL_LICENSES,
  SPATIAL_RETRIEVED_AT,
  SPATIAL_SOURCE_URLS,
  spatialSystem,
} from "../content/spatial-system.js";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(new URL(".", import.meta.url).pathname, "..");
const outputPath = path.join(repoRoot, "content", "generated", "china-physical-map.json");

const DATASETS = [
  {
    id: "countries",
    url: SPATIAL_SOURCE_URLS.naturalEarthCountries,
    base: "ne_50m_admin_0_countries",
  },
  {
    id: "rivers",
    url: SPATIAL_SOURCE_URLS.naturalEarthRivers,
    base: "ne_50m_rivers_lake_centerlines",
  },
  {
    id: "lakes",
    url: SPATIAL_SOURCE_URLS.naturalEarthLakes,
    base: "ne_50m_lakes",
  },
];

const CHINA_BBOX = spatialSystem.mapScopes.china.bbox;
const MIDDLE_YANGTZE_BBOX = spatialSystem.mapScopes.middleYangtze.bbox;
const LUSHAN_BBOX = spatialSystem.mapScopes.lushan.bbox;
const VIEW_BOX = { x: 0, y: 0, width: 1000, height: 720 };
const DRAWING_EXTENT = [[38, 30], [962, 690]];

function log(message) {
  console.log(`[build-map-data] ${message}`);
}

function intersectsBbox(feature, bbox) {
  if (!feature?.geometry) return false;
  const bounds = geoBounds(feature);
  if (!Array.isArray(bounds) || bounds.length !== 2) return false;
  const [[west, south], [east, north]] = bounds;
  const [bboxWest, bboxSouth, bboxEast, bboxNorth] = bbox;
  return east >= bboxWest && west <= bboxEast && north >= bboxSouth && south <= bboxNorth;
}

function property(feature, ...keys) {
  const properties = feature?.properties || {};
  for (const key of keys) {
    const value = properties[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function featureName(feature, fallback) {
  // Natural Earth's DBF reader may expose the optional Chinese field as
  // legacy-byte text on some Node versions.  Prefer the canonical English
  // name for generated asset metadata; the product's curated Chinese labels
  // live in spatial-system.js and remain the user-facing vocabulary.
  return property(feature, "NAME_EN", "name_en", "NAME", "name", "NAME_ZH", "name_zh") || fallback;
}

async function download(url, destination) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      log(`download ${attempt}/3: ${url}`);
      const response = await fetch(url, { signal: AbortSignal.timeout(180_000) });
      if (!response.ok) throw new Error(`download failed (${response.status}) ${url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 1024) throw new Error(`download is unexpectedly small (${bytes.length} bytes) ${url}`);
      await writeFile(destination, bytes);
      return bytes.byteLength;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
  throw lastError;
}

async function unzip(archive, destination) {
  await mkdir(destination, { recursive: true });
  await execFileAsync("unzip", ["-q", "-o", archive, "-d", destination]);
}

async function readFeatures(datasetDirectory, base) {
  const shpPath = path.join(datasetDirectory, `${base}.shp`);
  const dbfPath = path.join(datasetDirectory, `${base}.dbf`);
  const source = await shapefile.open(shpPath, dbfPath);
  const features = [];
  while (true) {
    const row = await source.read();
    if (row.done) break;
    if (row.value) features.push(row.value);
  }
  return features;
}

function selectChinaFeature(features) {
  const match = features.find((feature) => {
    const code = property(feature, "ADM0_A3", "ISO_A3", "SOV_A3");
    const name = featureName(feature, "").toLowerCase();
    return code === "CHN" || name === "china" || name.includes("中国");
  });
  if (!match) throw new Error("Natural Earth countries did not contain a China feature");
  return match;
}

function waterFeatureRecord(feature, index, pathGenerator, type) {
  const geometryPath = pathGenerator(feature);
  if (!geometryPath) return null;
  const name = featureName(feature, `${type === "river" ? "河流" : "湖泊"}参考 ${index + 1}`);
  const bounds = geoBounds(feature);
  return {
    id: `${type}-${String(index + 1).padStart(3, "0")}`,
    name,
    sourceName: name,
    type,
    geometryType: feature.geometry.type,
    path: geometryPath,
    geographicBounds: bounds,
    source: {
      dataset: type === "river" ? "ne_50m_rivers_lake_centerlines" : "ne_50m_lakes",
      url: type === "river" ? SPATIAL_SOURCE_URLS.naturalEarthRivers : SPATIAL_SOURCE_URLS.naturalEarthLakes,
      license: SPATIAL_LICENSES.naturalEarth.id,
    },
  };
}

function scoreWaterFeature(feature, type) {
  const name = featureName(feature, "").toLowerCase();
  const featureClass = property(feature, "featurecla", "FEATURECLA").toLowerCase();
  const priorityNames = type === "river"
    ? ["yangtze", "chang jiang", "长江", "huang he", "yellow river", "黄河", "pearl", "珠江", "xijiang", "嘉陵江", "min jiang", "岷江"]
    : ["poyang", "鄱阳", "dongting", "洞庭", "taihu", "太湖", "qinghai", "青海"];
  const priority = priorityNames.some((candidate) => name.includes(candidate)) ? 100 : 0;
  const classScore = featureClass.includes(type) ? 10 : 0;
  const bounds = geoBounds(feature);
  const [[west, south], [east, north]] = bounds;
  const extent = Math.max(0, east - west) * Math.max(0, north - south);
  return priority + classScore + Math.min(30, extent);
}

function selectWaterFeatures(features, type) {
  const candidates = features
    .filter((feature) => intersectsBbox(feature, CHINA_BBOX))
    .filter((feature) => featureName(feature, "").trim())
    .sort((a, b) => scoreWaterFeature(b, type) - scoreWaterFeature(a, type));

  // Keep the generated asset deliberately calm.  The page can reveal more
  // data later without forcing children to parse every named water feature.
  return candidates.slice(0, type === "river" ? 36 : 28);
}

function projectEntities(projection) {
  const result = {};
  for (const [id, entity] of Object.entries(spatialSystem.entities)) {
    const coordinates = entity?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length !== 2) continue;
    const projected = projection(coordinates);
    if (!projected || !projected.every(Number.isFinite)) continue;
    result[id] = {
      x: Number(projected[0].toFixed(3)),
      y: Number(projected[1].toFixed(3)),
      positionKind: entity.geometry.positionKind,
      type: entity.type,
    };
  }
  for (const [id, entity] of Object.entries(spatialSystem.originCities)) {
    const coordinates = entity?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length !== 2) continue;
    const projected = projection(coordinates);
    if (!projected || !projected.every(Number.isFinite)) continue;
    result[id] = {
      x: Number(projected[0].toFixed(3)),
      y: Number(projected[1].toFixed(3)),
      positionKind: entity.geometry.positionKind,
      type: entity.type,
      optionalOrigin: true,
    };
  }
  return result;
}

function scopeRecord(scope, projection) {
  const [west, south, east, north] = scope.bbox;
  const projectedCorners = [
    projection([west, north]),
    projection([east, south]),
  ];
  return {
    id: scope.id,
    label: scope.label,
    level: scope.level,
    geographicBounds: scope.bbox,
    projectedBounds: [
      Number(Math.min(projectedCorners[0][0], projectedCorners[1][0]).toFixed(3)),
      Number(Math.min(projectedCorners[0][1], projectedCorners[1][1]).toFixed(3)),
      Number(Math.max(projectedCorners[0][0], projectedCorners[1][0]).toFixed(3)),
      Number(Math.max(projectedCorners[0][1], projectedCorners[1][1]).toFixed(3)),
    ],
    focusIds: scope.focusIds,
  };
}

async function build() {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "shanhe-map-data-"));
  try {
    const datasets = {};
    for (const dataset of DATASETS) {
      const archivePath = path.join(tempRoot, `${dataset.id}.zip`);
      const extractPath = path.join(tempRoot, dataset.id);
      const byteLength = await download(dataset.url, archivePath);
      await unzip(archivePath, extractPath);
      datasets[dataset.id] = await readFeatures(extractPath, dataset.base);
      log(`${dataset.id}: downloaded ${byteLength} bytes, read ${datasets[dataset.id].length} features`);
    }

    const chinaFeature = selectChinaFeature(datasets.countries);
    const projection = geoMercator().fitExtent(DRAWING_EXTENT, chinaFeature);
    const pathGenerator = geoPath(projection);
    const chinaPath = pathGenerator(chinaFeature);
    if (!chinaPath) throw new Error("failed to project China geometry");

    const riverFeatures = selectWaterFeatures(datasets.rivers, "river");
    const lakeFeatures = selectWaterFeatures(datasets.lakes, "lake");
    const rivers = riverFeatures
      .map((feature, index) => waterFeatureRecord(feature, index, pathGenerator, "river"))
      .filter(Boolean);
    const lakes = lakeFeatures
      .map((feature, index) => waterFeatureRecord(feature, index, pathGenerator, "lake"))
      .filter(Boolean);

    const output = {
      schemaVersion: 1,
      generatedAt: SPATIAL_RETRIEVED_AT,
      coordinateOrder: "[longitude, latitude]",
      projection: {
        name: "geoMercator",
        northUp: true,
        fit: "Natural Earth 50m China country feature",
      },
      viewBox: `0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`,
      extent: [VIEW_BOX.x, VIEW_BOX.y, VIEW_BOX.width, VIEW_BOX.height],
      sources: [
        {
          dataset: "admin_0_countries",
          url: SPATIAL_SOURCE_URLS.naturalEarthCountries,
          license: SPATIAL_LICENSES.naturalEarth.id,
        },
        {
          dataset: "rivers_lake_centerlines",
          url: SPATIAL_SOURCE_URLS.naturalEarthRivers,
          license: SPATIAL_LICENSES.naturalEarth.id,
        },
        {
          dataset: "lakes",
          url: SPATIAL_SOURCE_URLS.naturalEarthLakes,
          license: SPATIAL_LICENSES.naturalEarth.id,
          note: "If Natural Earth omits or simplifies 鄱阳湖, the product keeps the curated point and does not invent a lake polygon.",
        },
      ],
      license: SPATIAL_LICENSES.naturalEarth,
      layers: {
        landPath: chinaPath,
        rivers,
        lakes,
      },
      scopes: {
        china: scopeRecord(spatialSystem.mapScopes.china, projection),
        middleYangtze: scopeRecord(spatialSystem.mapScopes.middleYangtze, projection),
        lushan: scopeRecord(spatialSystem.mapScopes.lushan, projection),
      },
      projectedEntities: projectEntities(projection),
      notes: {
        mapRole: "cultural relationship map, not navigation",
        chinaOutline: "Natural Earth 50m country outline; modern administrative boundary is deliberately not a visual hero.",
        waterSelection: "Named features intersecting the curated China bbox, capped for a calm prototype layer.",
      },
    };

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
    log(`wrote ${outputPath} (${(Buffer.byteLength(JSON.stringify(output)) / 1024).toFixed(1)} KiB)`);
    log(`selected ${rivers.length} rivers and ${lakes.length} lakes`);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

build().catch((error) => {
  console.error(`[build-map-data] ${error.stack || error.message}`);
  process.exitCode = 1;
});
