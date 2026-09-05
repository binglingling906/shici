/**
 * Curated spatial provenance for the first journey in 山河诗境.
 *
 * Coordinates use GeoJSON order: [longitude, latitude].  The two points are
 * intentionally representatives, not a claim that the poem or Li Bai's life
 * can be reduced to a single pin.  Keeping the facts here gives the UI a
 * stable source for its copy and gives the local evaluator something
 * deterministic to check.
 */

export const SPATIAL_SOURCE_URLS = {
  unescoLushan: "https://whc.unesco.org/en/list/778/",
  unescoDossier: "https://whc.unesco.org/document/217255",
  lushanGovernment: "https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html",
  yellowCraneTourism: "https://ylj.wuhan.gov.cn/zwgk/zwxxgkzl_12298/jggk_12304/xsdwszjzz_12308/202001/t20200110_726398.shtml",
  yellowCraneWuchang: "https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_3624646.html",
  wikidataYellowCrane: "https://www.wikidata.org/wiki/Q462372",
  wikidataLushan: "https://www.wikidata.org/wiki/Q622616",
  yangtzeNDRC: "https://cjjjd.ndrc.gov.cn/zoujinchangjiang/jingjishehuifazhan/201907/t20190713_941469.htm",
};

const contemporaryReference = {
  kind: "contemporary_reference",
  label: "现代地理参考",
  asOf: "2026-09-01",
};

// Historical Spatial Discovery 001 snapshot. Runtime code now uses spatial-system.js.
// Kept only so the earlier discovery record and its legacy checker remain reproducible.
export const spatialExperience = {
  id: "spatial-lushan-yellow-crane-001",
  version: 1,
  display: {
    lens: {
      label: "空间镜头",
      levels: ["中国", "长江与鄱阳湖之间", "庐山 · 诗人眼前"],
      note: "江西九江 · 北邻长江，南接鄱阳湖",
      disclaimer: "关系图 · 非导航地图",
    },
    readingAnchor: {
      kicker: "空间镜头 · 你在这里",
      levels: ["中国", "长江与鄱阳湖之间", "庐山"],
      note: "江西九江 · 北邻长江，南接鄱阳湖",
      sourceLabel: "地理依据",
    },
  },
  entities: {
    "lushan": {
      id: "lushan",
      name: "庐山",
      admin: { province: "江西", city: "九江", detail: "庐山" },
      geometry: { type: "Point", coordinates: [115.973333, 29.5725] },
      routeAnchor: "mountain_representative_point",
      validTime: { ...contemporaryReference },
      precision: "mountain_representative_point",
      confidence: "medium",
      sources: [
        { url: SPATIAL_SOURCE_URLS.unescoLushan, title: "UNESCO · 庐山国家公园", supports: ["region_context", "yangtze_north", "poyang_south"] },
        { url: SPATIAL_SOURCE_URLS.lushanGovernment, title: "庐山市人民政府 · 庐山概况", supports: ["admin_context"] },
        { url: SPATIAL_SOURCE_URLS.wikidataLushan, title: "Wikidata · 庐山", supports: ["coordinate_context"] },
      ],
    },
    "lushan-unesco-reference": {
      id: "lushan-unesco-reference",
      name: "庐山 UNESCO 区域参考",
      admin: { province: "江西", city: "九江", detail: "世界遗产区域参考点" },
      geometry: { type: "Point", coordinates: [115.867, 29.433333] },
      routeAnchor: "UNESCO_property_reference",
      validTime: { kind: "heritage_reference", label: "UNESCO 世界遗产区域参考", asOf: "2026-09-01" },
      precision: "UNESCO_property_reference",
      confidence: "high",
      sources: [
        { url: SPATIAL_SOURCE_URLS.unescoLushan, title: "UNESCO · 庐山国家公园", supports: ["coordinate", "region_context"] },
        { url: SPATIAL_SOURCE_URLS.unescoDossier, title: "UNESCO · 庐山提名档案", supports: ["property_context"] },
      ],
    },
    "yellow-crane": {
      id: "yellow-crane",
      name: "黄鹤楼",
      admin: { province: "湖北", city: "武汉", district: "武昌", detail: "蛇山 · 长江南岸" },
      geometry: { type: "Point", coordinates: [114.296944, 30.546944] },
      routeAnchor: "current_building_pin",
      validTime: {
        kind: "current_site",
        label: "当前建筑（1985 年重建）",
        asOf: "2026-09-01",
        historicalNote: "当前建筑点不等同于唐代楼址。",
      },
      precision: "current_building_pin",
      confidence: "medium_high",
      sources: [
        { url: SPATIAL_SOURCE_URLS.yellowCraneTourism, title: "武汉市园林和林业局 · 黄鹤楼", supports: ["current_site", "reconstruction"] },
        { url: SPATIAL_SOURCE_URLS.yellowCraneWuchang, title: "武昌区人民政府 · 黄鹤楼", supports: ["admin_context", "yangtze_context"] },
        { url: SPATIAL_SOURCE_URLS.wikidataYellowCrane, title: "Wikidata · 黄鹤楼", supports: ["coordinate_context"] },
      ],
    },
  },
  relations: [
    {
      id: "lushan-to-yellow-crane",
      from: "lushan",
      to: "yellow-crane",
      type: "present_day_spatial_relation",
      method: "haversine",
      computed: {
        earthRadiusKm: 6371.0088,
        distanceKm: 194.33939880503263,
        bearingDegrees: 304.303137940724,
      },
      display: {
        direction: "向西北，略偏西",
        directionShort: "西北方向",
        distanceRoundingKm: 5,
        distanceText: "约195公里（直线距离）",
        movementText: "沿江往上游方向",
      },
      notAnHistoricalRoute: true,
      disclaimer: "这是今天的地理关系，不代表李白真实行程。",
      sources: [
        { url: SPATIAL_SOURCE_URLS.yangtzeNDRC, title: "国家发展改革委 · 长江流域", supports: ["yangtze_context"] },
        { url: SPATIAL_SOURCE_URLS.yellowCraneWuchang, title: "武昌区人民政府 · 黄鹤楼", supports: ["yellow_crane_context"] },
        { url: SPATIAL_SOURCE_URLS.unescoLushan, title: "UNESCO · 庐山国家公园", supports: ["lushan_context"] },
      ],
    },
  ],
};

export const spatialEntities = spatialExperience.entities;
export const spatialJourney = spatialExperience.relations[0];

export function getSpatialEntity(id) {
  return spatialExperience.entities[id] || null;
}

export default spatialExperience;
