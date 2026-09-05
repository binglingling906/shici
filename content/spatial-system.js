/**
 * Spatial System — the small, provenance-first knowledge layer for 山河诗境.
 *
 * This is deliberately a data module, not a database abstraction.  It keeps
 * enough structure for the product to grow from “poem → place” into a network
 * of poems, people, cities, mountains and waterways while remaining easy to
 * inspect in a static prototype.
 *
 * Coordinates are GeoJSON order: [longitude, latitude].  A coordinate is never
 * enough on its own: every place also carries a position kind, precision,
 * confidence, validity, source and license metadata.
 */

import {
  EARTH_RADIUS_KM,
  computeSpatialRelation as computeCoordinates,
  isCoordinatePair,
} from "./spatial-math.js";

export const SPATIAL_RETRIEVED_AT = "2026-09-01";

export const SPATIAL_SOURCE_URLS = {
  unescoLushan: "https://whc.unesco.org/en/list/778/",
  unescoDossier: "https://whc.unesco.org/document/217255",
  lushanGovernment: "https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html",
  yangtzeNDRC: "https://cjjjd.ndrc.gov.cn/zoujinchangjiang/jingjishehuifazhan/201907/t20190713_941469.htm",
  yellowCraneTourism: "https://ylj.wuhan.gov.cn/zwgk/zwxxgkzl_12298/jggk_12304/xsdwszjzz_12308/202001/t20200110_726398.shtml",
  yellowCraneWuchang: "https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_3624646.html",
  naturalEarthTerms: "https://www.naturalearthdata.com/about/terms-of-use/",
  naturalEarthCountries: "https://naturalearth.s3.amazonaws.com/5.1.2/50m_cultural/ne_50m_admin_0_countries.zip",
  naturalEarthRivers: "https://naturalearth.s3.amazonaws.com/5.1.2/50m_physical/ne_50m_rivers_lake_centerlines.zip",
  naturalEarthLakes: "https://naturalearth.s3.amazonaws.com/5.1.2/50m_physical/ne_50m_lakes.zip",
  wikidataLicensing: "https://www.wikidata.org/wiki/Wikidata:Licensing",
  geonamesAbout: "https://www.geonames.org/about.html",
  chinesePoetry: "https://github.com/chinese-poetry/chinese-poetry",
};

export const SPATIAL_LICENSES = {
  naturalEarth: {
    id: "public-domain",
    label: "Natural Earth public domain",
    attribution: "Natural Earth",
  },
  wikidata: {
    id: "CC0-1.0",
    label: "Wikidata CC0",
    attribution: "Wikidata contributors",
  },
  geonames: {
    id: "CC-BY-4.0",
    label: "GeoNames CC BY 4.0",
    attribution: "GeoNames",
  },
  official: {
    id: "source-defined",
    label: "官方来源许可按原页面与项目审查记录",
    attribution: "见各实体的 source URL",
  },
  curated: {
    id: "project-curated",
    label: "项目人工核验层",
    attribution: "山河诗境 · 2026-09-01",
  },
};

const schema = {
  version: 1,
  entityTypes: [
    "country",
    "region",
    "river",
    "lake",
    "city",
    "mountain",
    "cultural_landmark",
    "poem",
    "person",
  ],
  positionKinds: ["exact_point", "approximate_point", "region", "unknown"],
  relationTypes: [
    "present_day_geography",
    "historical_fact",
    "cultural_link",
    "research_hypothesis",
    "system_recommendation",
  ],
  relationKinds: ["river", "nearby", "journey", "work", "person"],
  entityStatuses: ["available", "next", "reference", "coming_soon"],
  coordinateOrder: "[longitude, latitude]",
};

function source(url, title, supports, license = SPATIAL_LICENSES.official) {
  return {
    url,
    title,
    supports: Array.isArray(supports) ? supports : [supports],
    retrievedAt: SPATIAL_RETRIEVED_AT,
    license: license.id,
  };
}

function validTime(kind, label, extra = {}) {
  return {
    kind,
    label,
    asOf: SPATIAL_RETRIEVED_AT,
    ...extra,
  };
}

function point(positionKind, coordinates) {
  return {
    positionKind,
    type: "Point",
    coordinates,
  };
}

function region(bbox, representativePoint) {
  return {
    positionKind: "region",
    type: "Bbox",
    bbox,
    coordinates: representativePoint,
  };
}

function unknownGeometry() {
  return {
    positionKind: "unknown",
    type: "Unknown",
    coordinates: null,
  };
}

function entity({
  id,
  type,
  modernName,
  historicalNames = [],
  geometry,
  valid,
  precision,
  confidence,
  sources,
  license = SPATIAL_LICENSES.curated,
  disputes = [],
  status = "reference",
  ...rest
}) {
  return {
    id,
    type,
    name: modernName,
    modernName,
    historicalNames,
    geometry,
    validTime: valid,
    precision,
    confidence,
    disputes,
    sources,
    license,
    status,
    ...rest,
  };
}

const officialLushanSources = [
  source(SPATIAL_SOURCE_URLS.unescoLushan, "UNESCO · 庐山国家公园", ["region_context", "yangtze_north", "poyang_south"]),
  source(SPATIAL_SOURCE_URLS.lushanGovernment, "庐山市人民政府 · 庐山概况", ["admin_context", "historical_names"]),
];

const coreEntities = {
  china: entity({
    id: "china",
    type: "country",
    modernName: "中国",
    geometry: region([73.5, 18, 134.8, 53.6], [104.1954, 35.8617]),
    valid: validTime("contemporary_country", "中华人民共和国现代地理范围"),
    precision: "country_region_50m",
    confidence: "high",
    sources: [
      source(SPATIAL_SOURCE_URLS.naturalEarthCountries, "Natural Earth · 50m admin-0 countries", ["country_outline"], SPATIAL_LICENSES.naturalEarth),
    ],
    license: SPATIAL_LICENSES.naturalEarth,
    status: "available",
    mapLayer: "land",
  }),

  yangtze: entity({
    id: "yangtze",
    type: "river",
    modernName: "长江",
    historicalNames: [
      { name: "大江", context: "古典文学常用称呼", confidence: "medium" },
      { name: "扬子江", context: "历史及外文地理语境中的名称", confidence: "medium" },
    ],
    geometry: region([90.5, 24.4, 121.9, 34.9], [110.5, 30.5]),
    valid: validTime("present_day_river", "今天的长江水系"),
    precision: "river_50m_centerline_region",
    confidence: "high",
    sources: [
      source(SPATIAL_SOURCE_URLS.naturalEarthRivers, "Natural Earth · 50m rivers lake centerlines", ["river_geometry"], SPATIAL_LICENSES.naturalEarth),
      source(SPATIAL_SOURCE_URLS.yangtzeNDRC, "国家发展改革委 · 长江流域", ["river_context", "flow_context"]),
    ],
    license: SPATIAL_LICENSES.naturalEarth,
    status: "available",
    mapLayer: "rivers",
    labelPlacement: "north",
  }),

  "poyang-lake": entity({
    id: "poyang-lake",
    type: "lake",
    modernName: "鄱阳湖",
    historicalNames: [],
    geometry: region([114.6, 28.1, 117.1, 29.9], [116.3, 29.0]),
    valid: validTime("present_day_lake", "今天的鄱阳湖水面参考区域"),
    precision: "lake_50m_reference_region",
    confidence: "medium_high",
    sources: [
      source(SPATIAL_SOURCE_URLS.naturalEarthLakes, "Natural Earth · 50m lakes", ["lake_geometry"], SPATIAL_LICENSES.naturalEarth),
      source(SPATIAL_SOURCE_URLS.unescoLushan, "UNESCO · 庐山国家公园", ["south_of_lushan_context"]),
    ],
    license: SPATIAL_LICENSES.naturalEarth,
    status: "available",
    mapLayer: "lakes",
    labelPlacement: "south-east",
    geometryNote: "Natural Earth 50m lake layer may omit or simplify 鄱阳湖；UI keeps this curated reference point without inventing a polygon.",
  }),

  jiujiang: entity({
    id: "jiujiang",
    type: "city",
    modernName: "九江",
    historicalNames: [
      { name: "浔阳", context: "古代文学语境中的历史称呼，不等同于现代九江市全域", confidence: "medium" },
    ],
    geometry: point("approximate_point", [116.0019, 29.705]),
    valid: validTime("present_day_city", "今天的九江市"),
    precision: "city_center_approximation",
    confidence: "medium_high",
    sources: [
      source(SPATIAL_SOURCE_URLS.lushanGovernment, "庐山市人民政府 · 庐山概况", ["administrative_context", "city_context"]),
    ],
    license: SPATIAL_LICENSES.official,
    status: "reference",
    labelPlacement: "north-west",
  }),

  lushan: entity({
    id: "lushan",
    type: "mountain",
    modernName: "庐山",
    historicalNames: [
      { name: "匡庐", context: "古典文学与历史地理中的别称", confidence: "medium" },
      { name: "匡山", context: "古称之一", confidence: "medium" },
    ],
    geometry: point("approximate_point", [115.973333, 29.5725]),
    valid: validTime("present_day_mountain", "今天的庐山山体代表点"),
    precision: "mountain_representative_point",
    confidence: "medium",
    sources: [
      ...officialLushanSources,
      source("https://www.wikidata.org/wiki/Q622616", "Wikidata · 庐山", ["coordinate_context"], SPATIAL_LICENSES.wikidata),
    ],
    license: SPATIAL_LICENSES.official,
    status: "available",
    displayContext: "江西九江 · 庐山",
    labelPlacement: "south-west",
    routeAnchor: "mountain_representative_point",
    disputes: [
      {
        type: "position",
        status: "open",
        note: "代表点用于全国/区域关系，不等同于诗人当时的确切观察点。",
      },
    ],
  }),

  wuhan: entity({
    id: "wuhan",
    type: "city",
    modernName: "武汉",
    historicalNames: [
      { name: "夏口", context: "历史地名，非现代武汉市全域", confidence: "medium" },
      { name: "武昌", context: "历史地名与现代城区名称有时间差异", confidence: "medium" },
    ],
    geometry: point("approximate_point", [114.3055, 30.5928]),
    valid: validTime("present_day_city", "今天的武汉市"),
    precision: "city_center_approximation",
    confidence: "high",
    sources: [
      source(SPATIAL_SOURCE_URLS.yellowCraneWuchang, "武昌区人民政府 · 黄鹤楼", ["city_context", "yangtze_context"]),
    ],
    license: SPATIAL_LICENSES.official,
    status: "reference",
  }),

  "yellow-crane": entity({
    id: "yellow-crane",
    type: "cultural_landmark",
    modernName: "黄鹤楼",
    historicalNames: [],
    geometry: point("exact_point", [114.296944, 30.546944]),
    valid: validTime("current_site", "当前建筑与现址", {
      rebuiltAt: "1985",
      historicalNote: "当前建筑点不等同于唐代楼址。",
    }),
    precision: "current_building_pin",
    confidence: "medium_high",
    sources: [
      source(SPATIAL_SOURCE_URLS.yellowCraneTourism, "武汉市园林和林业局 · 黄鹤楼", ["current_site", "reconstruction"]),
      source(SPATIAL_SOURCE_URLS.yellowCraneWuchang, "武昌区人民政府 · 黄鹤楼", ["administrative_context", "yangtze_context"]),
      source("https://www.wikidata.org/wiki/Q462372", "Wikidata · 黄鹤楼", ["coordinate_context"], SPATIAL_LICENSES.wikidata),
    ],
    license: SPATIAL_LICENSES.official,
    status: "next",
    displayContext: "湖北武汉 · 武昌蛇山 · 长江南岸",
    labelPlacement: "north",
    routeAnchor: "current_building_pin",
    disputes: [
      {
        type: "historical_position",
        status: "open",
        note: "历史楼址多次变迁；本系统只把当前建筑作为现代旅程端点。",
      },
    ],
  }),

  "li-bai": entity({
    id: "li-bai",
    type: "person",
    modernName: "李白",
    historicalNames: [],
    geometry: unknownGeometry(),
    valid: validTime("historical_person", "唐代人物（701—762）"),
    precision: "unknown_observation_point",
    confidence: "high",
    sources: [
      source("https://www.wikidata.org/wiki/Q497", "Wikidata · 李白", ["person_identity"], SPATIAL_LICENSES.wikidata),
    ],
    license: SPATIAL_LICENSES.wikidata,
    status: "reference",
    disputes: [
      {
        type: "route",
        status: "open",
        note: "本体验不将李白的具体行程、写作时间或观察位置画成确定路线。",
      },
    ],
  }),

  "wang-lushan-pubu": entity({
    id: "wang-lushan-pubu",
    type: "poem",
    modernName: "《望庐山瀑布》",
    historicalNames: [],
    geometry: unknownGeometry(),
    valid: validTime("historical_work", "唐代诗歌作品"),
    precision: "place_anchor_not_exact_viewpoint",
    confidence: "high",
    sources: [
      source(SPATIAL_SOURCE_URLS.chinesePoetry, "chinese-poetry · 作品索引候选源", ["work_index"], SPATIAL_LICENSES.curated),
    ],
    license: SPATIAL_LICENSES.curated,
    status: "available",
    disputes: [
      {
        type: "authorship_or_composition_context",
        status: "open",
        note: "作品与庐山形成明确的文化锚点；本系统不把题名等同于精确写作地点。",
      },
    ],
  }),

  "chang-an": entity({
    id: "chang-an",
    type: "cultural_landmark",
    modernName: "长安（今西安）",
    historicalNames: [{ name: "长安", context: "历史都城名，今西安一带", confidence: "medium" }],
    geometry: point("approximate_point", [108.94, 34.3416]),
    valid: validTime("present_day_reference", "今天西安的城市参考位置"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),

  luoyang: entity({
    id: "luoyang",
    type: "city",
    modernName: "洛阳",
    historicalNames: [{ name: "东都", context: "部分历史时期的都城称呼", confidence: "medium" }],
    geometry: point("approximate_point", [112.454, 34.6197]),
    valid: validTime("present_day_reference", "今天洛阳市的城市参考位置"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),

  chengdu: entity({
    id: "chengdu",
    type: "city",
    modernName: "成都",
    historicalNames: [],
    geometry: point("approximate_point", [104.0668, 30.5728]),
    valid: validTime("present_day_reference", "今天成都市的城市参考位置"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),

  dunhuang: entity({
    id: "dunhuang",
    type: "cultural_landmark",
    modernName: "敦煌",
    historicalNames: [{ name: "沙州", context: "历史地名，和今天敦煌的关系需按时代理解", confidence: "medium" }],
    geometry: point("approximate_point", [94.6618, 40.1421]),
    valid: validTime("present_day_reference", "今天敦煌市的城市参考位置"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),

  "mount-tai": entity({
    id: "mount-tai",
    type: "mountain",
    modernName: "泰山",
    historicalNames: [],
    geometry: point("approximate_point", [117.1, 36.25]),
    valid: validTime("present_day_reference", "今天泰山山体参考位置"),
    precision: "mountain_representative_point",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 地理参考说明", ["mountain_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),

  jinling: entity({
    id: "jinling",
    type: "cultural_landmark",
    modernName: "金陵（今南京）",
    historicalNames: [{ name: "金陵", context: "历史文化称呼，今南京一带", confidence: "medium" }],
    geometry: point("approximate_point", [118.7969, 32.0603]),
    valid: validTime("present_day_reference", "今天南京市的城市参考位置"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),

  "west-lake": entity({
    id: "west-lake",
    type: "lake",
    modernName: "西湖（杭州）",
    historicalNames: [],
    geometry: region([119.95, 30.18, 120.22, 30.35], [120.15, 30.25]),
    valid: validTime("present_day_reference", "今天西湖水面参考区域"),
    precision: "lake_reference_region",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 地理参考说明", ["lake_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),

  "dongting-lake": entity({
    id: "dongting-lake",
    type: "lake",
    modernName: "洞庭湖",
    historicalNames: [],
    geometry: region([111.8, 28.7, 113.8, 29.9], [112.94, 29.37]),
    valid: validTime("present_day_reference", "今天洞庭湖水面参考区域"),
    precision: "lake_reference_region",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.naturalEarthLakes, "Natural Earth · 50m lakes", ["lake_geometry"], SPATIAL_LICENSES.naturalEarth)],
    license: SPATIAL_LICENSES.naturalEarth,
    status: "coming_soon",
  }),

  "baidi-city": entity({
    id: "baidi-city",
    type: "cultural_landmark",
    modernName: "白帝城",
    historicalNames: [{ name: "白帝", context: "历史文化地名，今重庆奉节一带", confidence: "medium" }],
    geometry: point("approximate_point", [109.57, 31.05]),
    valid: validTime("present_day_reference", "今天白帝城景区参考位置"),
    precision: "cultural_site_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 地理参考说明", ["cultural_site_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "coming_soon",
  }),
};

export const originCities = {
  ningbo: entity({
    id: "ningbo",
    type: "city",
    modernName: "宁波",
    geometry: point("approximate_point", [121.54979, 29.87819]),
    valid: validTime("present_day_city", "今天宁波市的城市级参考"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市级参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "reference",
    privacy: { granularity: "city_id_only", gps: false, address: false, optional: true },
  }),
  beijing: entity({
    id: "beijing",
    type: "city",
    modernName: "北京",
    geometry: point("approximate_point", [116.39723, 39.9075]),
    valid: validTime("present_day_city", "今天北京市的城市级参考"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市级参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "reference",
    privacy: { granularity: "city_id_only", gps: false, address: false, optional: true },
  }),
  chengdu: { ...coreEntities.chengdu, privacy: { granularity: "city_id_only", gps: false, address: false, optional: true } },
  guangzhou: entity({
    id: "guangzhou",
    type: "city",
    modernName: "广州",
    geometry: point("approximate_point", [113.25, 23.11667]),
    valid: validTime("present_day_city", "今天广州市的城市级参考"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市级参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "reference",
    privacy: { granularity: "city_id_only", gps: false, address: false, optional: true },
  }),
  shanghai: entity({
    id: "shanghai",
    type: "city",
    modernName: "上海",
    geometry: point("approximate_point", [121.45806, 31.22222]),
    valid: validTime("present_day_city", "今天上海市的城市级参考"),
    precision: "city_center_approximation",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.geonamesAbout, "GeoNames · 城市级参考说明", ["city_reference"], SPATIAL_LICENSES.geonames)],
    license: SPATIAL_LICENSES.geonames,
    status: "reference",
    privacy: { granularity: "city_id_only", gps: false, address: false, optional: true },
  }),
};

// All geographic copy is generated from these endpoints.  The relation record
// stores why the relationship exists; it does not duplicate a distance or a
// compass phrase that could drift away from the coordinates.
const relationRecords = [
  {
    id: "yangtze-river-poyang-lake",
    from: "yangtze",
    to: "poyang-lake",
    type: "present_day_geography",
    relation: "river",
    assertion: "鄱阳湖水系与长江相连。",
    confidence: "medium_high",
    sources: [
      source(SPATIAL_SOURCE_URLS.naturalEarthRivers, "Natural Earth · 50m rivers lake centerlines", ["river_geometry"], SPATIAL_LICENSES.naturalEarth),
      source(SPATIAL_SOURCE_URLS.unescoLushan, "UNESCO · 庐山国家公园", ["poyang_context"]),
    ],
  },
  {
    id: "lushan-near-jiujiang",
    from: "lushan",
    to: "jiujiang",
    type: "present_day_geography",
    relation: "nearby",
    assertion: "庐山位于今天九江一带的山地环境中。",
    confidence: "medium_high",
    sources: [source(SPATIAL_SOURCE_URLS.lushanGovernment, "庐山市人民政府 · 庐山概况", ["administrative_context"])],
  },
  {
    id: "lushan-near-poyang-lake",
    from: "lushan",
    to: "poyang-lake",
    type: "present_day_geography",
    relation: "nearby",
    assertion: "鄱阳湖在庐山南侧，是区域水面参照。",
    confidence: "medium",
    sources: [source(SPATIAL_SOURCE_URLS.unescoLushan, "UNESCO · 庐山国家公园", ["poyang_south"])],
  },
  {
    id: "lushan-near-yangtze",
    from: "lushan",
    to: "yangtze",
    type: "present_day_geography",
    relation: "nearby",
    assertion: "庐山北邻长江水系。",
    confidence: "medium_high",
    sources: [
      source(SPATIAL_SOURCE_URLS.unescoLushan, "UNESCO · 庐山国家公园", ["yangtze_north"]),
      source(SPATIAL_SOURCE_URLS.yangtzeNDRC, "国家发展改革委 · 长江流域", ["river_context"]),
    ],
  },
  {
    id: "lushan-to-yellow-crane-geography",
    from: "lushan",
    to: "yellow-crane",
    type: "present_day_geography",
    relation: "journey",
    assertion: "庐山与黄鹤楼的现代地理关系。",
    confidence: "medium",
    calculation: {
      method: "haversine",
      earthRadiusKm: EARTH_RADIUS_KM,
      distanceIncrementKm: 5,
    },
    context: {
      riverId: "yangtze",
      flowRelation: "toward_upstream",
      relationPhrase: "同一长江山河线索",
    },
    notAnHistoricalRoute: true,
    disclaimer: "这是今天的地理关系，不代表李白真实行程。",
    sources: [
      source(SPATIAL_SOURCE_URLS.yangtzeNDRC, "国家发展改革委 · 长江流域", ["yangtze_context"]),
      source(SPATIAL_SOURCE_URLS.yellowCraneWuchang, "武昌区人民政府 · 黄鹤楼", ["yellow_crane_context"]),
      source(SPATIAL_SOURCE_URLS.unescoLushan, "UNESCO · 庐山国家公园", ["lushan_context"]),
    ],
  },
  {
    id: "lushan-next-yellow-crane",
    from: "lushan",
    to: "yellow-crane",
    type: "system_recommendation",
    relation: "journey",
    assertion: "下一站沿同一长江山河线索继续探索。",
    confidence: "curated",
    basedOn: ["lushan-to-yellow-crane-geography", "yangtze-river-poyang-lake"],
    recommendationReason: "same_yangtze_corridor",
    notAnHistoricalRoute: true,
    disclaimer: "推荐基于现代地理与文化线索，不代表李白真实行程。",
    sources: [source(SPATIAL_SOURCE_URLS.yangtzeNDRC, "国家发展改革委 · 长江流域", ["recommendation_context"])],
  },
  {
    id: "poem-anchors-lushan",
    from: "wang-lushan-pubu",
    to: "lushan",
    type: "cultural_link",
    relation: "work",
    assertion: "作品题名直接形成庐山瀑布的文化锚点。",
    confidence: "high",
    sources: [source(SPATIAL_SOURCE_URLS.chinesePoetry, "chinese-poetry · 作品索引候选源", ["work_index"], SPATIAL_LICENSES.curated)],
    caveat: "文化锚点不等于精确写作位置。",
  },
  {
    id: "li-bai-authored-wang-lushan-pubu",
    from: "li-bai",
    to: "wang-lushan-pubu",
    type: "historical_fact",
    relation: "person",
    assertion: "作品署名与李白相关。",
    confidence: "high",
    sources: [source("https://www.wikidata.org/wiki/Q497", "Wikidata · 李白", ["person_identity"], SPATIAL_LICENSES.wikidata)],
  },
  {
    id: "li-bai-possible-lushan-observation",
    from: "li-bai",
    to: "lushan",
    type: "research_hypothesis",
    relation: "person",
    assertion: "李白与庐山存在诗歌文化关联，但具体观察位置与路线不在本系统中确定。",
    confidence: "low",
    displayable: false,
    disputes: ["具体写作时间、观察点和行程需另行史料核验。"],
    sources: [source(SPATIAL_SOURCE_URLS.unescoLushan, "UNESCO · 庐山国家公园", ["place_context"])],
  },
  {
    id: "yellow-crane-rebuilt-current-site",
    from: "yellow-crane",
    to: "wuhan",
    type: "historical_fact",
    relation: "nearby",
    assertion: "当前黄鹤楼为1985年重建建筑，使用今天武汉武昌的现址参考。",
    confidence: "medium_high",
    validTime: validTime("reconstruction", "1985 年重建与当前建筑", { rebuiltAt: "1985" }),
    sources: [source(SPATIAL_SOURCE_URLS.yellowCraneTourism, "武汉市园林和林业局 · 黄鹤楼", ["reconstruction", "current_site"])],
  },
];

function getEntityCoordinates(entityRecord) {
  const coordinates = entityRecord?.geometry?.coordinates;
  return isCoordinatePair(coordinates) ? coordinates : null;
}

function formatMovementText(relation, direction) {
  const river = relation?.context?.riverId ? coreEntities[relation.context.riverId]?.modernName : null;
  if (river && relation.context.flowRelation === "toward_upstream") {
    return `沿${river}水系，往上游方向`;
  }
  if (river && relation.context.flowRelation === "toward_downstream") {
    return `沿${river}水系，往下游方向`;
  }
  return `向${direction.text}`;
}

function enrichRelation(relation) {
  const fromEntity = coreEntities[relation.from];
  const toEntity = coreEntities[relation.to];
  const from = getEntityCoordinates(fromEntity);
  const to = getEntityCoordinates(toEntity);
  if (!from || !to) return { ...relation };

  const options = relation.calculation || {};
  const computed = computeCoordinates(from, to, {
    radiusKm: options.earthRadiusKm || EARTH_RADIUS_KM,
    distanceIncrementKm: options.distanceIncrementKm || 5,
  });
  return {
    ...relation,
    computed: {
      method: options.method || "haversine",
      earthRadiusKm: computed.earthRadiusKm,
      distanceKm: computed.distanceKm,
      bearingDegrees: computed.bearingDegrees,
    },
    display: {
      direction: `向${computed.direction.text}`,
      directionShort: computed.direction.cardinal,
      directionQualifier: computed.direction.qualifier,
      distanceRoundingKm: computed.distanceIncrementKm,
      distanceText: computed.distanceText,
      movementText: formatMovementText(relation, computed.direction),
    },
  };
}

const enrichedRelations = relationRecords.map(enrichRelation);

export const mapScopes = {
  china: {
    id: "china",
    label: "中国",
    level: "macro",
    bbox: [73.5, 18, 134.8, 53.6],
    focusIds: ["lushan", "yellow-crane", "yangtze", "poyang-lake"],
    asset: "content/generated/china-physical-map.json",
  },
  middleYangtze: {
    id: "middleYangtze",
    label: "长江中游与鄱阳湖",
    level: "region",
    bbox: [110.8, 26.8, 120.3, 33.0],
    focusIds: ["yangtze", "poyang-lake", "jiujiang", "lushan"],
    asset: "content/generated/china-physical-map.json",
  },
  lushan: {
    id: "lushan",
    label: "庐山 · 诗人眼前",
    level: "place",
    bbox: [115.55, 29.25, 116.45, 30.05],
    focusIds: ["lushan", "jiujiang", "poyang-lake", "yangtze"],
    asset: "content/generated/china-physical-map.json",
  },
};

export const journeys = {
  "lushan-to-yellow-crane": {
    id: "lushan-to-yellow-crane",
    from: "lushan",
    to: "yellow-crane",
    status: "next",
    relationIds: ["lushan-to-yellow-crane-geography", "lushan-next-yellow-crane"],
    reason: "同一条长江山河线索，把山与楼连接起来。",
    disclaimer: "这是今天的地理关系，不代表李白真实行程。",
  },
};

export const spatialSystem = {
  id: "shanhe-spatial-system",
  version: 1,
  retrievedAt: SPATIAL_RETRIEVED_AT,
  schema,
  entities: coreEntities,
  relations: enrichedRelations,
  journeys,
  originCities,
  mapScopes,
  display: {
    lens: {
      levels: ["中国", "长江中游", "庐山"],
      note: "江西九江 · 北邻长江，南接鄱阳湖",
      disclaimer: "关系图 · 非导航地图",
    },
    readingAnchor: {
      levels: ["中国", "长江中游", "庐山"],
      note: "江西九江 · 北邻长江，南接鄱阳湖",
    },
    regionObservation: {
      targetEntityId: "poyang-lake",
      question: "庐山南边的大湖，叫什么名字？",
      answerRelationId: "lushan-near-poyang-lake",
    },
    journey: {
      relationId: "lushan-to-yellow-crane-geography",
      recommendationId: "lushan-next-yellow-crane",
    },
  },
  experience: {
    current: "lushan",
    next: "yellow-crane",
    availablePoems: ["wang-lushan-pubu"],
    privacy: {
      originCityStorage: "city_id_only",
      gps: false,
      preciseAddress: false,
      canSkip: true,
      canClear: true,
    },
  },
};

export function getEntity(id) {
  return spatialSystem.entities[id] || spatialSystem.originCities[id] || null;
}

export function getSpatialEntity(id) {
  return getEntity(id);
}

export function getRelation(id) {
  return spatialSystem.relations.find((relation) => relation.id === id) || null;
}

export function getJourney(id) {
  return spatialSystem.journeys[id] || null;
}

export function getMapScope(id) {
  return spatialSystem.mapScopes[id] || null;
}

export function computeSpatialRelation(fromId, toId, options = {}) {
  const fromEntity = getEntity(fromId);
  const toEntity = getEntity(toId);
  const from = getEntityCoordinates(fromEntity);
  const to = getEntityCoordinates(toEntity);
  if (!from || !to) return null;
  const computed = computeCoordinates(from, to, options);
  return {
    ...computed,
    fromId,
    toId,
    fromName: fromEntity.modernName,
    toName: toEntity.modernName,
  };
}

export function formatSpatialRelation(fromId, toId, options = {}) {
  const computed = computeSpatialRelation(fromId, toId, options);
  if (!computed) return null;
  const relation = spatialSystem.relations.find((candidate) => candidate.from === fromId && candidate.to === toId);
  const movementText = formatMovementText(relation, computed.direction);
  return {
    ...computed,
    directionText: `向${computed.direction.text}`,
    directionShort: computed.direction.cardinal,
    directionQualifier: computed.direction.qualifier,
    distanceText: computed.distanceText,
    movementText,
    sentence: `${computed.fromName}到${computed.toName}，${computed.distanceText}，${movementText}。`,
    disclaimer: relation?.disclaimer || null,
  };
}

export const spatialEntities = spatialSystem.entities;
export const spatialRelations = spatialSystem.relations;
export const spatialJourney = getRelation("lushan-to-yellow-crane-geography");

export default spatialSystem;
