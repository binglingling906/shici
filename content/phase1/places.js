/**
 * Phase 1 place layer.
 *
 * A place is intentionally richer than a coordinate.  The five records below
 * are the complete learning destinations in this phase; nearby rivers,
 * mountains and historical names are references used to ground a poem, not
 * additional promises of a complete lesson.
 */

export const PHASE1_RETRIEVED_AT = "2026-09-01";

export const PHASE1_PLACE_SOURCES = {
  naturalEarthTerms: {
    url: "https://www.naturalearthdata.com/about/terms-of-use/",
    title: "Natural Earth · Terms of Use",
    license: "public-domain",
  },
  chinesePoetry: {
    url: "https://github.com/chinese-poetry/chinese-poetry",
    title: "chinese-poetry · source candidate corpus",
    license: "MIT (repository); public-domain source texts remain separately curated",
  },
  unescoLushan: {
    url: "https://whc.unesco.org/en/list/778/",
    title: "UNESCO · Mount Lushan National Park",
    license: "source-defined",
  },
  lushanGovernment: {
    url: "https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html",
    title: "庐山市人民政府 · 庐山概况",
    license: "source-defined",
  },
  yellowCraneWuhan: {
    url: "https://ylj.wuhan.gov.cn/zwgk/zwxxgkzl_12298/jggk_12304/xsdwszjzz_12308/202001/t20200110_726398.shtml",
    title: "武汉市园林和林业局 · 黄鹤楼",
    license: "source-defined",
  },
  yellowCraneWuchang: {
    url: "https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_3624646.html",
    title: "武昌区人民政府 · 黄鹤楼",
    license: "source-defined",
  },
  westLakeHangzhou: {
    url: "https://www.hangzhou.gov.cn/col/col805132/index.html",
    title: "杭州市人民政府 · 西湖文化景观",
    license: "source-defined",
  },
  chengduGovernment: {
    url: "https://www.chengdu.gov.cn/chengdu/c125954/2022-07/07/content_3c7c7d3b9e4d4a0c9a9b0e0c4f0f2c30.shtml",
    title: "成都市人民政府 · 成都概况",
    license: "source-defined",
  },
  changAnXiAn: {
    url: "https://www.xa.gov.cn/",
    title: "西安市人民政府 · 城市参考",
    license: "source-defined",
  },
  yangtzeNDRC: {
    url: "https://cjjjd.ndrc.gov.cn/zoujinchangjiang/jingjishehuifazhan/201907/t20190713_941469.htm",
    title: "国家发展改革委 · 长江流域",
    license: "source-defined",
  },
  geonamesAbout: {
    url: "https://www.geonames.org/about.html",
    title: "GeoNames · geographic reference data",
    license: "CC BY 4.0",
  },
};

function source(key, supports, note = "") {
  const record = PHASE1_PLACE_SOURCES[key];
  return {
    ...record,
    key,
    supports: Array.isArray(supports) ? supports : [supports],
    retrievedAt: PHASE1_RETRIEVED_AT,
    ...(note ? { note } : {}),
  };
}

function review(notes) {
  return {
    status: "curated",
    reviewedAt: PHASE1_RETRIEVED_AT,
    reviewer: "shanhe-phase1-content-review",
    notes,
  };
}

const basePrivacy = {
  granularity: "city_or_place_id_only",
  gps: false,
  address: false,
  optionalUserOrigin: true,
};

export const phase1Places = [
  {
    id: "lushan",
    name: "庐山",
    modernName: "庐山",
    historicalNames: [
      { name: "匡庐", context: "古典文学中的常见别称", confidence: "medium" },
      { name: "匡山", context: "古称之一", confidence: "medium" },
    ],
    type: "mountain",
    modernCity: "九江",
    province: "江西",
    region: "长江中游",
    coordinates: [115.973333, 29.5725],
    coordinateOrder: "[longitude, latitude]",
    precision: "mountain_representative_point",
    validTime: { kind: "present_day_reference", label: "今天的庐山山体参考点", asOf: PHASE1_RETRIEVED_AT },
    confidence: "medium",
    poemIds: ["lushan-wang-lushan-pubu", "lushan-ti-xi-lin-bi"],
    surroundingRelations: [
      {
        targetId: "yangtze",
        targetName: "长江",
        type: "nearby_river",
        assertion: "庐山北邻长江水系。",
        learningCue: "先看山，再沿北向找江。",
        confidence: "medium_high",
        sourceKeys: ["unescoLushan", "yangtzeNDRC"],
      },
      {
        targetId: "poyang-lake",
        targetName: "鄱阳湖",
        type: "nearby_lake",
        assertion: "鄱阳湖在庐山南侧，是区域水面参照。",
        learningCue: "从山向南看，湖面让距离有了方向。",
        confidence: "medium",
        sourceKeys: ["unescoLushan"],
      },
      {
        targetId: "jiujiang",
        targetName: "九江",
        type: "nearby_city",
        assertion: "庐山位于今天九江一带的山地环境中。",
        learningCue: "城市是认识山的位置参照。",
        confidence: "medium_high",
        sourceKeys: ["lushanGovernment"],
      },
    ],
    spatialStory: "一座山在江湖之间，诗人从山中向远处看瀑布。",
    nextPlaceId: "yellow-crane",
    nextReason: "从庐山的高处与瀑布，继续沿长江方向去看一座楼。",
    privacy: basePrivacy,
    provenance: {
      sources: [
        source("unescoLushan", ["region_context", "yangtze_north", "poyang_south"]),
        source("lushanGovernment", ["modern_city_context", "historical_names"]),
      ],
      method: "modern representative point for regional orientation; not a claim about Li Bai's exact viewpoint",
    },
    disputes: [
      {
        type: "observation_point",
        status: "open",
        note: "代表点用于儿童理解相对位置，不等同于诗人当时的确切观察点。",
      },
    ],
    review: review("首个完整地点；山、水、远近和高低关系均经过内容审核。"),
  },
  {
    id: "yellow-crane",
    name: "黄鹤楼",
    modernName: "黄鹤楼",
    historicalNames: [
      { name: "黄鹤楼（古今多次重修）", context: "文化地标名称延续，建筑位置与形制历经变化", confidence: "high" },
    ],
    type: "cultural_landmark",
    modernCity: "武汉",
    province: "湖北",
    region: "长江中游",
    coordinates: [114.296944, 30.546944],
    coordinateOrder: "[longitude, latitude]",
    precision: "current_building_pin",
    validTime: { kind: "current_site", label: "今天黄鹤楼现址与建筑参考点", asOf: PHASE1_RETRIEVED_AT, rebuiltAt: "1985" },
    confidence: "medium_high",
    poemIds: ["yellow-crane-huang-he-lou", "yellow-crane-song-meng-hao-ran"],
    surroundingRelations: [
      {
        targetId: "yangtze",
        targetName: "长江",
        type: "riverfront",
        assertion: "黄鹤楼在武汉蛇山一带，位于长江南岸。",
        learningCue: "楼在江边，送别的视线会顺着江水远去。",
        confidence: "medium_high",
        sourceKeys: ["yellowCraneWuchang", "yellowCraneWuhan"],
      },
      {
        targetId: "yangzhou",
        targetName: "扬州",
        type: "poem_direction_reference",
        assertion: "送孟浩然的诗句把视线从黄鹤楼引向扬州。",
        learningCue: "孤帆变小，江面把目光带到远方。",
        confidence: "medium",
        sourceKeys: ["chinesePoetry"],
      },
    ],
    spatialStory: "一座临江的楼，是看远方、送朋友、听江声的地方。",
    nextPlaceId: "west-lake",
    nextReason: "从长江边的楼，继续去看杭州西湖的晴雨颜色。",
    privacy: basePrivacy,
    provenance: {
      sources: [
        source("yellowCraneWuhan", ["current_site", "reconstruction"]),
        source("yellowCraneWuchang", ["modern_city_context", "yangtze_south_bank"]),
      ],
      method: "current site is a contemporary journey anchor, not a precise Tang-dynasty building location",
    },
    disputes: [
      {
        type: "historical_position",
        status: "open",
        note: "历代楼址和形制有变；儿童端只说今天的黄鹤楼在这里，不把现址冒充唐代原址。",
      },
    ],
    review: review("楼、江、送别和远方视线关系经过儿童学习语境审核。"),
  },
  {
    id: "west-lake",
    name: "西湖",
    modernName: "西湖（杭州）",
    historicalNames: [
      { name: "钱塘湖", context: "白居易诗中使用的历史称呼之一", confidence: "high" },
      { name: "明圣湖", context: "历史名称，具体语境需按时代理解", confidence: "medium" },
    ],
    type: "lake",
    modernCity: "杭州",
    province: "浙江",
    region: "东南水乡",
    coordinates: [120.148, 30.242],
    coordinateOrder: "[longitude, latitude]",
    precision: "lake_representative_point",
    validTime: { kind: "present_day_reference", label: "今天西湖水面参考点", asOf: PHASE1_RETRIEVED_AT },
    confidence: "high",
    poemIds: ["west-lake-yin-hu-shang", "west-lake-xiao-chu-jing-ci-si"],
    surroundingRelations: [
      {
        targetId: "hangzhou",
        targetName: "杭州",
        type: "city_contains_lake",
        assertion: "西湖是杭州城市中的核心水面参照。",
        learningCue: "城市和湖面一起看，才能知道诗人在什么地方。",
        confidence: "high",
        sourceKeys: ["westLakeHangzhou"],
      },
      {
        targetId: "jingci-temple",
        targetName: "净慈寺",
        type: "poem_viewpoint_reference",
        assertion: "《晓出净慈寺送林子方》从净慈寺附近写西湖六月景色。",
        learningCue: "从寺门出来，先看湖，再看接天莲叶。",
        confidence: "medium_high",
        sourceKeys: ["chinesePoetry"],
      },
    ],
    spatialStory: "湖面把天气、颜色、荷叶和城市的早晨放在同一幅画里。",
    nextPlaceId: "chengdu",
    nextReason: "从西湖的晴雨与荷花，继续去成都听一场夜里的春雨。",
    privacy: basePrivacy,
    provenance: {
      sources: [source("westLakeHangzhou", ["lake_context", "hangzhou_context"])],
      method: "lake representative point; no fabricated shoreline precision in the learning layer",
    },
    disputes: [],
    review: review("晴雨、湖面、季节与视线关系经过内容审核；历史别名保留语境说明。"),
  },
  {
    id: "chengdu",
    name: "成都",
    modernName: "成都",
    historicalNames: [
      { name: "锦官城", context: "杜甫诗中对成都的文学称呼", confidence: "high" },
    ],
    type: "city",
    modernCity: "成都",
    province: "四川",
    region: "巴蜀",
    coordinates: [104.0668, 30.5728],
    coordinateOrder: "[longitude, latitude]",
    precision: "city_center_approximation",
    validTime: { kind: "present_day_reference", label: "今天成都市的城市参考点", asOf: PHASE1_RETRIEVED_AT },
    confidence: "high",
    poemIds: ["chengdu-chun-ye-xi-yu", "chengdu-jueju-two-orioles"],
    surroundingRelations: [
      {
        targetId: "min-river",
        targetName: "岷江水系",
        type: "regional_river",
        assertion: "成都位于四川盆地西部的水网与平原环境中。",
        learningCue: "雨、江船和田野要放回巴蜀的水网里看。",
        confidence: "medium",
        sourceKeys: ["geonamesAbout"],
      },
      {
        targetId: "xiling-mountain",
        targetName: "西岭",
        type: "poem_landscape_reference",
        assertion: "‘窗含西岭千秋雪’把远山带进成都窗内的视野。",
        learningCue: "近处的窗和远处的雪山同时出现。",
        confidence: "medium_high",
        sourceKeys: ["chinesePoetry"],
      },
    ],
    spatialStory: "成都的春夜有悄悄落下的雨，白天的窗里又能望见远山和江船。",
    nextPlaceId: "chang-an",
    nextReason: "从成都的春雨与远山，继续回到长安看诗人的时代风景。",
    privacy: basePrivacy,
    provenance: {
      sources: [source("chengduGovernment", ["modern_city_context"]), source("chinesePoetry", ["poem_place_context"])],
      method: "city-scale anchor; poem-specific viewpoints stay approximate",
    },
    disputes: [
      {
        type: "composition_place",
        status: "open",
        note: "两首诗和成都有强文化关联；本数据不把具体草堂院落或窗户位置当作精确事实。",
      },
    ],
    review: review("城市、雨、窗、远山与船的空间叙事经过内容审核。"),
  },
  {
    id: "chang-an",
    name: "长安（今西安）",
    modernName: "长安（今西安）",
    historicalNames: [
      { name: "长安", context: "唐代都城名，今西安一带", confidence: "high" },
      { name: "京兆", context: "历史行政区称谓，不等同于现代西安市全域", confidence: "medium" },
    ],
    type: "historical_city",
    modernCity: "西安",
    province: "陕西",
    region: "关中",
    coordinates: [108.94, 34.3416],
    coordinateOrder: "[longitude, latitude]",
    precision: "historical_city_region",
    validTime: { kind: "historical_to_present_reference", label: "唐长安与今西安的大致空间对应", asOf: PHASE1_RETRIEVED_AT },
    confidence: "medium_high",
    poemIds: ["chang-an-chun-wang", "chang-an-zi-ye-wu-ge-qiu-ge"],
    surroundingRelations: [
      {
        targetId: "wei-river",
        targetName: "渭水",
        type: "regional_river",
        assertion: "长安位于关中平原与渭水区域的历史城市空间中。",
        learningCue: "城市不是孤零零的点，要放回平原和河流。",
        confidence: "medium_high",
        sourceKeys: ["changAnXiAn"],
      },
      {
        targetId: "yumen-pass",
        targetName: "玉门关",
        type: "poem_imagined_direction",
        assertion: "《子夜吴歌·秋歌》从长安的秋夜想到远方的玉关。",
        learningCue: "月光在眼前，思念却沿着地图去了很远的边关。",
        confidence: "medium",
        sourceKeys: ["chinesePoetry"],
      },
    ],
    spatialStory: "古代都城的夜色既有家国忧思，也能把目光送向遥远的边关。",
    nextPlaceId: "lushan",
    nextReason: "从长安的时代与远方，回到山水之间重新看一首诗。",
    privacy: basePrivacy,
    provenance: {
      sources: [source("changAnXiAn", ["modern_city_reference"]), source("chinesePoetry", ["historical_poem_context"])],
      method: "historical city region mapped to a present-day Xi'an reference point; no exact Tang street claim",
    },
    disputes: [
      {
        type: "historical_boundary",
        status: "open",
        note: "长安是历史都城空间，今西安只是便于儿童定位的现代参考，不等同于唐代城界。",
      },
    ],
    review: review("古今名称、城市尺度、远方边关与时代差异经过内容审核。"),
  },
];

export const phase1PlaceById = Object.fromEntries(phase1Places.map((place) => [place.id, place]));

export default phase1Places;
