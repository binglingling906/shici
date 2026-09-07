/**
 * Curriculum and concept layer for 山河诗境.
 *
 * This module intentionally keeps the existing 100-poem runtime as the
 * source of poem text.  The records below carry only stable ids, curriculum
 * claims, learning maturity, relationships and provenance.  Consumers that
 * need a readable lesson should call `buildLearningCatalog(runtimeCatalog,
 * phase1Poems)` and let the current runtime provide the text.
 *
 * A claim being present in this file is not the same as a curriculum fact.
 * Claims default to `candidate` until an editor has checked the exact
 * publisher edition, grade and semester against an official directory.
 */

export const CURRICULUM_RETRIEVED_AT = "2026-09-01";

export const CURRICULUM_CONFIG = {
  id: "shanhe-curriculum-system",
  version: 1,
  defaultSnapshot: "6-3学制·2024修订统编小学/初中语文（人教社，逐年换用）+ 2023统编高中五册",
  legacySnapshot: "统编语文2016–2023目录快照（历史参考）",
  publisher: "人民教育出版社（PEP）",
  sourcePolicy: {
    runtimeCatalog: "content/catalog/phase1-runtime.json",
    reuse: "stable-id-reference",
    noExternalTextDuplication: true,
    candidateClaimsAreNotVerified: true,
    curriculumAnchor: "课标推荐背诵优先；未逐项核验时不宣称教材课文或必背。",
  },
  maturityLayers: ["mother", "curriculum", "standard", "guided", "immersive"],
  maturitySemantics: {
    mother: "源快照或候选母库；不直接作为孩子可打开的学习单元。",
    curriculum: "带课程目录声明的候选编目层；仍需逐项核验。",
    standard: "正文可打开、可浏览的标准阅读入口。",
    guided: "具备面向儿童的引导式发现路径，优先服务小学阅读。",
    immersive: "具备高画面或高地理明确度，适合进入山河沉浸路线。",
  },
  allowedGeoRelationTypes: [
    "written_at",
    "describes",
    "mentions",
    "poet_present",
    "imagined",
    "historical_allusion",
    "cultural_association",
    "journey_suggestion",
    "unknown",
  ],
  reviewFlagKeys: [
    "machineCandidate",
    "sourceVerified",
    "textReviewed",
    "pinyinReviewed",
    "conceptReviewed",
    "geoReviewed",
    "guidedReady",
    "immersiveReady",
  ],
  claimEnums: {
    stage: ["primary", "middle", "high"],
    inClassOrExtra: ["in-class", "extra", "unspecified"],
    requiredOrRecommended: ["recommended_memorization", "textbook_inclusion", "textbook_extra_recitation"],
    verificationStatus: ["candidate", "source-verified"],
  },
  curriculumSource: {
    id: "pep-2024-transition-2023-high-five-volumes",
    url: "https://m.pep.com.cn/gyrj/jc/202409/t20240902_1994544.shtml",
    title: "人民教育出版社 · 人教版十二套中小学教材纵览（2024修订逐年换用）",
    license: "source-defined",
    supports: ["publisher_directory", "edition_reference"],
    retrievedAt: CURRICULUM_RETRIEVED_AT,
  },
  curriculumSources: [
    {
      id: "moe-2024-national-textbook-directory",
      url: "https://www.moe.gov.cn/srcsite/A26/s8001/202408/W020250418502592948423.pdf",
      title: "教育部 · 2024年义务教育国家课程教学用书目录（官方 PDF）",
      license: "source-defined",
      supports: ["primary_middle_book_series", "edition_year", "6-3_structure"],
      retrievedAt: CURRICULUM_RETRIEVED_AT,
    },
    {
      id: "moe-2023-high-school-textbook-directory",
      url: "https://www.moe.gov.cn/srcsite/A26/s8001/202305/t20230506_1058493.html",
      title: "教育部 · 2023年普通高中国家课程教学用书目录",
      license: "source-defined",
      supports: ["high_school_five_volumes", "book_series"],
      retrievedAt: CURRICULUM_RETRIEVED_AT,
    },
    {
      id: "moe-2022-compulsory-curriculum-framework",
      url: "https://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html?fromColId=194",
      title: "教育部 · 义务教育课程方案和课程标准（2022年版）发布",
      license: "source-defined",
      supports: ["recommended_memorization_context", "compulsory_curriculum_framework"],
      retrievedAt: CURRICULUM_RETRIEVED_AT,
    },
    {
      id: "moe-2020-high-school-curriculum-standard",
      url: "https://hudong.moe.gov.cn/srcsite/A26/s8001/202006/t20200603_462199.html",
      title: "教育部 · 普通高中课程方案和语文等学科课程标准（2017年版2020年修订）",
      license: "source-defined",
      supports: ["high_school_curriculum_framework", "recommended_memorization_context"],
      retrievedAt: CURRICULUM_RETRIEVED_AT,
    },
  ],
  revisionAddendumPolicy: {
    edition: "2024 revision transition note",
    mergedIntoDefault: false,
    reason: "框架采用 2024 修订统编小学/初中与 2023 统编高中五册；过渡声明仍作为独立附录，不改写单首诗的候选归属。",
  },
};

const RUNTIME_SOURCE = {
  id: "phase1-runtime-reference",
  url: "https://github.com/chinese-poetry/chinese-poetry",
  title: "chinese-poetry · existing Phase 1 runtime source reference",
  license: "MIT repository code/data package; upstream text versions require per-item rights review",
  supports: ["runtime_text_reference", "author_candidate", "dynasty_candidate"],
  retrievedAt: CURRICULUM_RETRIEVED_AT,
};

const PEP_SOURCE = CURRICULUM_CONFIG.curriculumSource;

function cloneSource(source) {
  return { ...source, supports: [...(source.supports || [])] };
}

/**
 * Grade ranges in candidate curriculum claims are inclusive. Keeping this
 * matcher beside the data model makes the browser filter and deterministic
 * checks share one interpretation (for example, 4-6 includes grade 5).
 */
export function claimGradeIncludes(claimGrade, selectedGrade) {
  const selected = Number(selectedGrade);
  if (!Number.isFinite(selected) || selected <= 0) return false;
  const raw = String(claimGrade ?? "").trim();
  if (/^\d+$/u.test(raw)) return Number(raw) === selected;
  const range = raw.match(/^(\d+)\s*[-–—]\s*(\d+)$/u);
  if (!range) return false;
  const start = Number(range[1]);
  const end = Number(range[2]);
  return selected >= Math.min(start, end) && selected <= Math.max(start, end);
}

export function curriculumClaimMatches(claim, { stage, grade, semester = "all" }) {
  if (!claim || claim.stage !== stage) return false;
  if (claim.verificationStatus === "candidate") return true;
  return claimGradeIncludes(claim.grade, grade) && (semester === "all" || claim.semester === semester);
}

function sourcesForClaim() {
  return [
    cloneSource(PEP_SOURCE),
    ...(CURRICULUM_CONFIG.curriculumSources || []).map(cloneSource),
    cloneSource(RUNTIME_SOURCE),
  ];
}

/** Existing Phase 1 ids are referenced, never copied with their source text. */
export const CATALOG_IDS = [
  "lushan-wang-lushan-pubu",
  "lushan-ti-xi-lin-bi",
  "yellow-crane-huang-he-lou",
  "yellow-crane-song-meng-hao-ran",
  "west-lake-yin-hu-shang",
  "west-lake-xiao-chu-jing-ci-si",
  "chengdu-chun-ye-xi-yu",
  "chengdu-jueju-two-orioles",
  "chang-an-chun-wang",
  "chang-an-zi-ye-wu-ge-qiu-ge",
  "child-yong-e",
  "child-min-nong-one",
  "child-min-nong-two",
  "child-jing-ye-si",
  "child-deng-guan-que-lou",
  "child-chun-xiao",
  "child-cun-ju",
  "child-suo-jian",
  "child-xiao-chi",
  "child-chi-shang",
  "child-zeng-wang-lun",
  "child-zao-fa-bai-di-cheng",
  "child-ye-su-shan-si",
  "child-du-zuo-jing-ting-shan",
  "child-wang-tian-men-shan",
  "child-gu-lang-yue-xing",
  "child-jiang-nan",
  "child-chang-ge-xing",
  "child-qi-bu-shi",
  "child-chile-ge",
  "child-hui-xiang-ou-shu",
  "child-yong-liu",
  "child-liang-zhou-ci",
  "child-chu-sai",
  "child-furong-lou-song-xin-jian",
  "child-cong-jun-xing",
  "child-lu-chai",
  "child-zhu-li-guan",
  "child-song-yuan-er-an-xi",
  "child-jiu-yue-jiu-ri",
  "child-shan-ju-qiu-ming",
  "child-shi-zhi-sai-shang",
  "child-du-jing-men-song-bie",
  "child-wang-yue",
  "child-deng-gao",
  "child-jiang-pan-du-bu-xun-hua",
  "child-jueju-chi-ri",
  "child-wen-guan-jun-shou-he-nan-he-bei",
  "child-jiang-nan-feng-li-guinian",
  "child-feng-qiao-ye-bo",
  "child-chuzhou-xijian",
  "child-sai-xia-lulun",
  "child-you-zi-yin",
  "child-wu-yi-xiang",
  "child-wang-dong-ting",
  "child-lang-tao-sha",
  "child-fu-de-gu-yuan-cao",
  "child-da-lin-si-taohua",
  "child-yi-jiang-nan",
  "child-mu-jiang-yin",
  "child-qian-tang-hu-chun-xing",
  "child-guan-yi-mai",
  "child-shu-hu-yin-xian-sheng-bi",
  "child-bo-chuan-gua-zhou",
  "child-yuan-ri",
  "child-mei-hua",
  "child-deng-fei-lai-feng",
  "child-hui-chong-chun-jiang",
  "child-wang-hu-lou-zui-shu",
  "child-shui-diao-ge-tou",
  "child-huan-xi-sha-qishui",
  "child-bu-suan-zi-yong-mei",
  "child-shi-er",
  "child-you-shan-xi-cun",
  "child-dong-ye-du-shu",
  "child-xiang-cun-si-yue",
  "child-si-shi-tian-yuan",
  "child-xiao-er-chui-diao",
  "child-zao-chun-shui-bu",
  "child-wan-chun",
  "child-ma-shi",
  "child-zeng-liu-jing-wen",
  "child-ti-lin-an-di",
  "child-guan-shu-you-gan",
  "child-chun-ri-zhu-xi",
  "child-zhu-shi",
  "child-shi-hui-yin",
  "child-mo-mei",
  "child-tian-jing-sha-qiu-si",
  "child-shan-po-yang-tong-guan",
  "child-qing-ping-le-cun-ju",
  "child-xi-jiang-yue-huang-sha",
  "child-nan-xiang-zi-beigu",
  "child-yin-jiu-tao-yuanming",
  "child-guan-canghai",
  "child-ci-bei-gu-shan-xia",
  "child-guo-gu-ren-zhuang",
  "child-su-jiande-jiang",
  "child-ye-yu-ji-bei",
  "child-le-you-yuan",
];

export const GOLD_IDS = CATALOG_IDS.slice(0, 10);

/*
 * Twenty additional entries meet the current design gate:
 * runtime imageClarity >= 5, placeClarity >= 4 and spatialLearningValue >= 4.
 * The checker cross-checks these against the runtime scores instead of
 * treating this editorial list as evidence by itself.
 */
export const IMMERSIVE_IDS = [
  "lushan-wang-lushan-pubu",
  "lushan-ti-xi-lin-bi",
  "yellow-crane-huang-he-lou",
  "yellow-crane-song-meng-hao-ran",
  "west-lake-yin-hu-shang",
  "west-lake-xiao-chu-jing-ci-si",
  "chengdu-chun-ye-xi-yu",
  "chengdu-jueju-two-orioles",
  "chang-an-chun-wang",
  "chang-an-zi-ye-wu-ge-qiu-ge",
  "child-deng-guan-que-lou",
  "child-xiao-chi",
  "child-zeng-wang-lun",
  "child-zao-fa-bai-di-cheng",
  "child-du-zuo-jing-ting-shan",
  "child-wang-tian-men-shan",
  "child-chang-ge-xing",
  "child-chile-ge",
  "child-hui-xiang-ou-shu",
  "child-liang-zhou-ci",
  "child-chu-sai",
  "child-cong-jun-xing",
  "child-song-yuan-er-an-xi",
  "child-jiu-yue-jiu-ri",
  "child-shi-zhi-sai-shang",
  "child-du-jing-men-song-bie",
  "child-wang-yue",
  "child-deng-gao",
  "child-wen-guan-jun-shou-he-nan-he-bei",
  "child-feng-qiao-ye-bo",
];

/* High textbook familiarity + clear language: the primary-school-first path. */
export const GUIDED_IDS = [
  "lushan-wang-lushan-pubu",
  "lushan-ti-xi-lin-bi",
  "yellow-crane-huang-he-lou",
  "yellow-crane-song-meng-hao-ran",
  "west-lake-yin-hu-shang",
  "west-lake-xiao-chu-jing-ci-si",
  "chengdu-chun-ye-xi-yu",
  "chengdu-jueju-two-orioles",
  "chang-an-chun-wang",
  "chang-an-zi-ye-wu-ge-qiu-ge",
  "child-min-nong-one",
  "child-min-nong-two",
  "child-jing-ye-si",
  "child-deng-guan-que-lou",
  "child-chun-xiao",
  "child-cun-ju",
  "child-suo-jian",
  "child-xiao-chi",
  "child-chi-shang",
  "child-zeng-wang-lun",
  "child-zao-fa-bai-di-cheng",
  "child-ye-su-shan-si",
  "child-du-zuo-jing-ting-shan",
  "child-wang-tian-men-shan",
  "child-gu-lang-yue-xing",
  "child-jiang-nan",
  "child-chang-ge-xing",
  "child-chile-ge",
  "child-hui-xiang-ou-shu",
  "child-yong-liu",
  "child-liang-zhou-ci",
  "child-chu-sai",
  "child-furong-lou-song-xin-jian",
  "child-cong-jun-xing",
  "child-lu-chai",
  "child-zhu-li-guan",
  "child-song-yuan-er-an-xi",
  "child-jiu-yue-jiu-ri",
  "child-shi-zhi-sai-shang",
  "child-du-jing-men-song-bie",
  "child-wang-yue",
  "child-deng-gao",
  "child-jueju-chi-ri",
  "child-wen-guan-jun-shou-he-nan-he-bei",
  "child-feng-qiao-ye-bo",
  "child-you-zi-yin",
  "child-wu-yi-xiang",
  "child-wang-dong-ting",
  "child-fu-de-gu-yuan-cao",
  "child-yi-jiang-nan",
  "child-qian-tang-hu-chun-xing",
  "child-shu-hu-yin-xian-sheng-bi",
  "child-bo-chuan-gua-zhou",
  "child-yuan-ri",
  "child-mei-hua",
  "child-deng-fei-lai-feng",
  "child-hui-chong-chun-jiang",
  "child-wang-hu-lou-zui-shu",
  "child-shi-er",
  "child-you-shan-xi-cun",
  "child-xiang-cun-si-yue",
  "child-xiao-er-chui-diao",
  "child-zeng-liu-jing-wen",
  "child-guan-shu-you-gan",
  "child-chun-ri-zhu-xi",
  "child-zhu-shi",
  "child-shi-hui-yin",
  "child-tian-jing-sha-qiu-si",
  "child-qing-ping-le-cun-ju",
  "child-xi-jiang-yue-huang-sha",
  "child-yin-jiu-tao-yuanming",
  "child-ci-bei-gu-shan-xia",
  "child-guo-gu-ren-zhuang",
  "child-ye-yu-ji-bei",
  "child-le-you-yuan",
];

const GOLD_SET = new Set(GOLD_IDS);
const IMMERSIVE_SET = new Set(IMMERSIVE_IDS);
const GUIDED_SET = new Set(GUIDED_IDS);
const CATALOG_SET = new Set(CATALOG_IDS);

function maturityFor(id) {
  if (IMMERSIVE_SET.has(id)) return "immersive";
  if (GUIDED_SET.has(id)) return "guided";
  return "standard";
}

function maturityPathFor(id) {
  const path = ["mother", "curriculum", "standard"];
  if (GUIDED_SET.has(id)) path.push("guided");
  if (IMMERSIVE_SET.has(id)) path.push("immersive");
  return path;
}

const HIGH_STAGE_IDS = new Set([
  "chengdu-chun-ye-xi-yu",
  "child-deng-gao",
  "child-guan-yi-mai",
  "child-shui-diao-ge-tou",
  "child-ti-lin-an-di",
  "child-shan-po-yang-tong-guan",
  "child-nan-xiang-zi-beigu",
]);

const MIDDLE_STAGE_IDS = new Set([
  "yellow-crane-huang-he-lou",
  "yellow-crane-song-meng-hao-ran",
  "west-lake-xiao-chu-jing-ci-si",
  "chengdu-jueju-two-orioles",
  "chang-an-zi-ye-wu-ge-qiu-ge",
  "chang-an-chun-wang",
  "child-shi-zhi-sai-shang",
  "child-du-jing-men-song-bie",
  "child-wen-guan-jun-shou-he-nan-he-bei",
  "child-jiang-nan-feng-li-guinian",
  "child-sai-xia-lulun",
  "child-qian-tang-hu-chun-xing",
  "child-huan-xi-sha-qishui",
  "child-bu-suan-zi-yong-mei",
  "child-shi-er",
  "child-you-shan-xi-cun",
  "child-dong-ye-du-shu",
  "child-ma-shi",
  "child-zhu-li-guan",
  "child-wan-chun",
  "child-wang-yue",
  "child-deng-fei-lai-feng",
  "child-tian-jing-sha-qiu-si",
  "child-yin-jiu-tao-yuanming",
  "child-guan-canghai",
  "child-ci-bei-gu-shan-xia",
  "child-su-jiande-jiang",
  "child-ye-yu-ji-bei",
]);

function stageFor(id) {
  if (HIGH_STAGE_IDS.has(id)) return "high";
  if (MIDDLE_STAGE_IDS.has(id)) return "middle";
  return "primary";
}

function claimFor(id) {
  const stage = stageFor(id);
  return {
    claimId: `${id}--curriculum-recommended-candidate`,
    poemId: id,
    curriculumEdition: CURRICULUM_CONFIG.defaultSnapshot,
    publisher: CURRICULUM_CONFIG.publisher,
    stage,
    grade: stage === "primary" ? "1-6" : stage === "middle" ? "7-9" : "10-12",
    semester: "all",
    inClassOrExtra: "extra",
    requiredOrRecommended: "recommended_memorization",
    source: sourcesForClaim(),
    validFrom: CURRICULUM_RETRIEVED_AT,
    validTo: CURRICULUM_RETRIEVED_AT,
    validityKind: "research-snapshot",
    verificationStatus: "candidate",
    claimBasis: "editorial-stage-reading-candidate",
    scopeBasis: "candidate-editorial-stage",
    textbookStatus: "not-verified",
    claimNote: "只表示学段级阅读候选，不表示具体年级、上下册、教材课文或必背；需逐项对照 PEP 对应册次目录后才能升级为 source-verified。",
  };
}

const ITEM_LEVEL_PEP_SOURCES = {
  primary1Autumn: {
    id: "pep-primary-1-autumn-2016-directory",
    url: "https://www.pep.com.cn/products/jc/jks/201608/t20160823_1369629.shtml",
    title: "人民教育出版社 · 语文一年级上册目录（2016统编版）",
    license: "source-defined",
    supports: ["item_level_textbook_directory", "grade", "semester", "in_class_status"],
    retrievedAt: CURRICULUM_RETRIEVED_AT,
  },
  primary2Autumn: {
    id: "pep-primary-2-autumn-2017-directory",
    url: "https://www.pep.com.cn/products/jc/jks/201802/t20180205_1922570.shtml",
    title: "人民教育出版社 · 语文二年级上册目录（2017统编版）",
    license: "source-defined",
    supports: ["item_level_textbook_directory", "grade", "semester", "in_class_status"],
    retrievedAt: CURRICULUM_RETRIEVED_AT,
  },
  middle7Autumn: {
    id: "pep-middle-7-autumn-2016-directory",
    url: "https://www.pep.com.cn/products/jc/czjks/201802/t20180209_1922672.shtml",
    title: "人民教育出版社 · 语文七年级上册目录（2016统编版）",
    license: "source-defined",
    supports: ["item_level_textbook_directory", "grade", "semester", "in_class_or_extra_status"],
    retrievedAt: CURRICULUM_RETRIEVED_AT,
  },
  middle7Spring: {
    id: "pep-middle-7-spring-2016-directory",
    url: "https://www.pep.com.cn/products/jc/czjks/201802/t20180209_1922680.shtml",
    title: "人民教育出版社 · 语文七年级下册目录（2016统编版）",
    license: "source-defined",
    supports: ["item_level_textbook_directory", "grade", "semester", "in_class_or_extra_status"],
    retrievedAt: "2026-09-07",
  },
  middle8Autumn: {
    id: "pep-middle-8-autumn-2017-directory",
    url: "https://www.pep.com.cn/products/jc/czjks/201802/t20180209_1922717.shtml",
    title: "人民教育出版社 · 语文八年级上册目录（2017统编版）",
    license: "source-defined",
    supports: ["item_level_textbook_directory", "grade", "semester", "in_class_or_extra_status"],
    retrievedAt: "2026-09-07",
  },
  highRequired1: {
    id: "pep-high-required-autumn-2019-directory",
    url: "https://www.pep.com.cn/xw/zt/hd/zjywjytbskjc/201909/t20190906_1945033.html",
    title: "人民教育出版社 · 普通高中语文统编教材必修上册目录",
    license: "source-defined",
    supports: ["item_level_textbook_directory", "required_volume", "in_class_status"],
    retrievedAt: CURRICULUM_RETRIEVED_AT,
  },
  primaryTraditionalCulture2019: {
    id: "pep-2019-primary-traditional-culture-selection",
    url: "https://www.pep.com.cn/xw/zt/hd/zjywjytbskjc/201908/t20190830_1944754.html",
    title: "人民教育出版社 · 统编小学语文教科书：传统文化内容中的自然美与社会美",
    license: "source-defined",
    supports: ["item_level_textbook_evidence", "grade", "semester", "lesson_number_where_stated"],
    retrievedAt: "2026-09-07",
  },
};

const PRIMARY_MIDDLE_SERIES_SOURCE = CURRICULUM_CONFIG.curriculumSources.find((source) => source.id === "moe-2024-national-textbook-directory");
const HIGH_SERIES_SOURCE = CURRICULUM_CONFIG.curriculumSources.find((source) => source.id === "moe-2023-high-school-textbook-directory");
const HISTORICAL_ITEM_EVIDENCE = {
  "primary-1-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primary1Autumn.id], poemIds: ["child-jiang-nan"] },
  "primary-2-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primary2Autumn.id, ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-deng-guan-que-lou", "lushan-wang-lushan-pubu", "child-ye-su-shan-si", "child-chile-ge", "child-xiao-er-chui-diao"] },
  "primary-2-spring": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-cun-ju"] },
  "primary-3-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-zeng-liu-jing-wen", "west-lake-yin-hu-shang", "child-suo-jian"] },
  "primary-3-spring": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-jueju-chi-ri", "child-hui-chong-chun-jiang", "child-yi-jiang-nan"] },
  "primary-4-spring": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-qing-ping-le-cun-ju"] },
  "primary-5-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-feng-qiao-ye-bo"] },
  "primary-5-spring": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-xiang-cun-si-yue"] },
  "primary-6-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019.id], poemIds: ["child-wang-hu-lou-zui-shu", "child-guo-gu-ren-zhuang"] },
  "middle-7-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.middle7Autumn.id], poemIds: ["child-guan-canghai", "child-ci-bei-gu-shan-xia", "child-tian-jing-sha-qiu-si", "child-jiang-nan-feng-li-guinian"] },
  "middle-7-spring": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.middle7Spring.id], poemIds: ["child-zhu-li-guan", "child-wan-chun", "child-wang-yue", "child-deng-fei-lai-feng", "child-you-shan-xi-cun"] },
  "middle-8-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.middle8Autumn.id], poemIds: ["yellow-crane-huang-he-lou", "child-shi-zhi-sai-shang", "child-du-jing-men-song-bie", "child-qian-tang-hu-chun-xing", "child-yin-jiu-tao-yuanming", "chang-an-chun-wang"] },
  "high-required-autumn": { sourceIds: [ITEM_LEVEL_PEP_SOURCES.highRequired1.id], poemIds: ["child-deng-gao"] },
};

function curriculumVolume({ id, stage, grade = null, semester = null, part = semester, title, source, volumeType = "graded-volume" }) {
  const itemEvidence = HISTORICAL_ITEM_EVIDENCE[id] || { sourceIds: [], poemIds: [] };
  return {
    id,
    stage,
    grade,
    semester,
    part,
    title,
    volumeType,
    schoolSystem: stage === "high" ? "普通高中" : "6-3学制",
    publisher: CURRICULUM_CONFIG.publisher,
    curriculumFramework: stage === "high" ? "普通高中语文课程标准（2017年版2020年修订）" : "义务教育语文课程标准（2022年版）",
    seriesVerificationStatus: "source-verified",
    itemEvidenceStatus: itemEvidence.sourceIds.length ? "historical-partial" : "not-item-verified",
    itemEvidenceSourceIds: [...itemEvidence.sourceIds],
    verifiedPoemIds: [...itemEvidence.poemIds],
    source: [cloneSource(source)],
    evidenceNote: itemEvidence.sourceIds.length
      ? "册名属于当前官方书系；逐首证据来自2024修订前的历史目录，只能证明对应历史快照中的部分篇目。"
      : "已核验册名与书系，尚未获得可支持单首篇目归属的官方逐项目录证据。",
  };
}

/**
 * The complete default book-series spine: 12 primary + 6 middle + 5 high.
 * Series-level verification never upgrades a poem to item-level verification.
 */
export const CURRICULUM_VOLUMES = [
  ...Array.from({ length: 6 }, (_, index) => index + 1).flatMap((grade) => [
    curriculumVolume({ id: `primary-${grade}-autumn`, stage: "primary", grade: String(grade), semester: "autumn", title: `统编语文${["一", "二", "三", "四", "五", "六"][grade - 1]}年级上册`, source: PRIMARY_MIDDLE_SERIES_SOURCE }),
    curriculumVolume({ id: `primary-${grade}-spring`, stage: "primary", grade: String(grade), semester: "spring", title: `统编语文${["一", "二", "三", "四", "五", "六"][grade - 1]}年级下册`, source: PRIMARY_MIDDLE_SERIES_SOURCE }),
  ]),
  ...Array.from({ length: 3 }, (_, index) => index + 7).flatMap((grade) => [
    curriculumVolume({ id: `middle-${grade}-autumn`, stage: "middle", grade: String(grade), semester: "autumn", title: `统编语文${["七", "八", "九"][grade - 7]}年级上册`, source: PRIMARY_MIDDLE_SERIES_SOURCE }),
    curriculumVolume({ id: `middle-${grade}-spring`, stage: "middle", grade: String(grade), semester: "spring", title: `统编语文${["七", "八", "九"][grade - 7]}年级下册`, source: PRIMARY_MIDDLE_SERIES_SOURCE }),
  ]),
  curriculumVolume({ id: "high-required-autumn", stage: "high", part: "upper", title: "统编高中语文必修上册", volumeType: "required", source: HIGH_SERIES_SOURCE }),
  curriculumVolume({ id: "high-required-spring", stage: "high", part: "lower", title: "统编高中语文必修下册", volumeType: "required", source: HIGH_SERIES_SOURCE }),
  curriculumVolume({ id: "high-selective-required-autumn", stage: "high", part: "upper", title: "统编高中语文选择性必修上册", volumeType: "selective-required", source: HIGH_SERIES_SOURCE }),
  curriculumVolume({ id: "high-selective-required-middle", stage: "high", part: "middle", title: "统编高中语文选择性必修中册", volumeType: "selective-required", source: HIGH_SERIES_SOURCE }),
  curriculumVolume({ id: "high-selective-required-spring", stage: "high", part: "lower", title: "统编高中语文选择性必修下册", volumeType: "selective-required", source: HIGH_SERIES_SOURCE }),
];

function verifiedClaim({ poemId, stage, grade, semester = "autumn", placement = "in-class", edition, source, volumeId }) {
  return {
    claimId: `${poemId}--${edition.replace(/\s+/gu, "-")}--source-verified`,
    poemId,
    volumeId,
    curriculumEdition: edition,
    publisher: CURRICULUM_CONFIG.publisher,
    stage,
    grade,
    semester,
    inClassOrExtra: placement,
    requiredOrRecommended: placement === "extra" ? "textbook_extra_recitation" : "textbook_inclusion",
    source: [cloneSource(source)],
    validFrom: edition.includes("2016") ? "2016-07-01" : edition.includes("2017") ? "2017-07-01" : "2019-09-01",
    validTo: "2024-08-31",
    verificationStatus: "source-verified",
    claimBasis: "item-level-official-textbook-directory",
    textbookStatus: "verified-item-level",
    claimNote: "该声明只适用于所列历史教材快照；不自动继承到2024修订教材。",
  };
}

/**
 * Item-level official directory evidence is deliberately separate from the
 * 2024-transition candidates above. This prevents an older verified snapshot
 * from silently becoming a claim about a newer book.
 */
export const VERIFIED_CURRICULUM_CLAIMS = [
  verifiedClaim({ poemId: "child-jiang-nan", stage: "primary", grade: "1", edition: "2016统编语文一年级上册", source: ITEM_LEVEL_PEP_SOURCES.primary1Autumn, volumeId: "primary-1-autumn" }),
  verifiedClaim({ poemId: "child-deng-guan-que-lou", stage: "primary", grade: "2", edition: "2017统编语文二年级上册", source: ITEM_LEVEL_PEP_SOURCES.primary2Autumn, volumeId: "primary-2-autumn" }),
  verifiedClaim({ poemId: "lushan-wang-lushan-pubu", stage: "primary", grade: "2", edition: "2017统编语文二年级上册", source: ITEM_LEVEL_PEP_SOURCES.primary2Autumn, volumeId: "primary-2-autumn" }),
  verifiedClaim({ poemId: "child-ye-su-shan-si", stage: "primary", grade: "2", edition: "2017统编语文二年级上册", source: ITEM_LEVEL_PEP_SOURCES.primary2Autumn, volumeId: "primary-2-autumn" }),
  verifiedClaim({ poemId: "child-chile-ge", stage: "primary", grade: "2", edition: "2017统编语文二年级上册", source: ITEM_LEVEL_PEP_SOURCES.primary2Autumn, volumeId: "primary-2-autumn" }),
  verifiedClaim({ poemId: "child-guan-canghai", stage: "middle", grade: "7", edition: "2016统编语文七年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle7Autumn, volumeId: "middle-7-autumn" }),
  verifiedClaim({ poemId: "child-ci-bei-gu-shan-xia", stage: "middle", grade: "7", edition: "2016统编语文七年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle7Autumn, volumeId: "middle-7-autumn" }),
  verifiedClaim({ poemId: "child-tian-jing-sha-qiu-si", stage: "middle", grade: "7", edition: "2016统编语文七年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle7Autumn, volumeId: "middle-7-autumn" }),
  verifiedClaim({ poemId: "child-jiang-nan-feng-li-guinian", stage: "middle", grade: "7", placement: "extra", edition: "2016统编语文七年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle7Autumn, volumeId: "middle-7-autumn" }),
  verifiedClaim({ poemId: "child-deng-gao", stage: "high", grade: "10", edition: "2019统编高中语文必修上册", source: ITEM_LEVEL_PEP_SOURCES.highRequired1, volumeId: "high-required-autumn" }),
  verifiedClaim({ poemId: "child-xiao-er-chui-diao", stage: "primary", grade: "2", placement: "unspecified", edition: "2019统编语文二年级上册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-2-autumn" }),
  verifiedClaim({ poemId: "child-cun-ju", stage: "primary", grade: "2", semester: "spring", placement: "unspecified", edition: "2019统编语文二年级下册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-2-spring" }),
  verifiedClaim({ poemId: "child-zeng-liu-jing-wen", stage: "primary", grade: "3", placement: "in-class", edition: "2019统编语文三年级上册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-3-autumn" }),
  verifiedClaim({ poemId: "west-lake-yin-hu-shang", stage: "primary", grade: "3", placement: "unspecified", edition: "2019统编语文三年级上册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-3-autumn" }),
  verifiedClaim({ poemId: "child-suo-jian", stage: "primary", grade: "3", placement: "unspecified", edition: "2019统编语文三年级上册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-3-autumn" }),
  verifiedClaim({ poemId: "child-jueju-chi-ri", stage: "primary", grade: "3", semester: "spring", placement: "in-class", edition: "2019统编语文三年级下册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-3-spring" }),
  verifiedClaim({ poemId: "child-hui-chong-chun-jiang", stage: "primary", grade: "3", semester: "spring", placement: "in-class", edition: "2019统编语文三年级下册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-3-spring" }),
  verifiedClaim({ poemId: "child-yi-jiang-nan", stage: "primary", grade: "3", semester: "spring", placement: "unspecified", edition: "2019统编语文三年级下册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-3-spring" }),
  verifiedClaim({ poemId: "child-qing-ping-le-cun-ju", stage: "primary", grade: "4", semester: "spring", placement: "in-class", edition: "2019统编语文四年级下册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-4-spring" }),
  verifiedClaim({ poemId: "child-feng-qiao-ye-bo", stage: "primary", grade: "5", placement: "unspecified", edition: "2019统编语文五年级上册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-5-autumn" }),
  verifiedClaim({ poemId: "child-xiang-cun-si-yue", stage: "primary", grade: "5", semester: "spring", placement: "unspecified", edition: "2019统编语文五年级下册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-5-spring" }),
  verifiedClaim({ poemId: "child-wang-hu-lou-zui-shu", stage: "primary", grade: "6", placement: "unspecified", edition: "2019统编语文六年级上册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-6-autumn" }),
  verifiedClaim({ poemId: "child-guo-gu-ren-zhuang", stage: "primary", grade: "6", placement: "unspecified", edition: "2019统编语文六年级上册", source: ITEM_LEVEL_PEP_SOURCES.primaryTraditionalCulture2019, volumeId: "primary-6-autumn" }),
  verifiedClaim({ poemId: "yellow-crane-huang-he-lou", stage: "middle", grade: "8", placement: "in-class", edition: "2017统编语文八年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle8Autumn, volumeId: "middle-8-autumn" }),
  verifiedClaim({ poemId: "child-shi-zhi-sai-shang", stage: "middle", grade: "8", placement: "in-class", edition: "2017统编语文八年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle8Autumn, volumeId: "middle-8-autumn" }),
  verifiedClaim({ poemId: "child-du-jing-men-song-bie", stage: "middle", grade: "8", placement: "in-class", edition: "2017统编语文八年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle8Autumn, volumeId: "middle-8-autumn" }),
  verifiedClaim({ poemId: "child-qian-tang-hu-chun-xing", stage: "middle", grade: "8", placement: "in-class", edition: "2017统编语文八年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle8Autumn, volumeId: "middle-8-autumn" }),
  verifiedClaim({ poemId: "child-yin-jiu-tao-yuanming", stage: "middle", grade: "8", placement: "in-class", edition: "2017统编语文八年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle8Autumn, volumeId: "middle-8-autumn" }),
  verifiedClaim({ poemId: "chang-an-chun-wang", stage: "middle", grade: "8", placement: "in-class", edition: "2017统编语文八年级上册", source: ITEM_LEVEL_PEP_SOURCES.middle8Autumn, volumeId: "middle-8-autumn" }),
  verifiedClaim({ poemId: "child-zhu-li-guan", stage: "middle", grade: "7", semester: "spring", placement: "extra", edition: "2016统编语文七年级下册", source: ITEM_LEVEL_PEP_SOURCES.middle7Spring, volumeId: "middle-7-spring" }),
  verifiedClaim({ poemId: "child-wan-chun", stage: "middle", grade: "7", semester: "spring", placement: "extra", edition: "2016统编语文七年级下册", source: ITEM_LEVEL_PEP_SOURCES.middle7Spring, volumeId: "middle-7-spring" }),
  verifiedClaim({ poemId: "child-wang-yue", stage: "middle", grade: "7", semester: "spring", placement: "in-class", edition: "2016统编语文七年级下册", source: ITEM_LEVEL_PEP_SOURCES.middle7Spring, volumeId: "middle-7-spring" }),
  verifiedClaim({ poemId: "child-deng-fei-lai-feng", stage: "middle", grade: "7", semester: "spring", placement: "in-class", edition: "2016统编语文七年级下册", source: ITEM_LEVEL_PEP_SOURCES.middle7Spring, volumeId: "middle-7-spring" }),
  verifiedClaim({ poemId: "child-you-shan-xi-cun", stage: "middle", grade: "7", semester: "spring", placement: "in-class", edition: "2016统编语文七年级下册", source: ITEM_LEVEL_PEP_SOURCES.middle7Spring, volumeId: "middle-7-spring" }),
];

export const CURRICULUM_CLAIMS = [
  ...CATALOG_IDS.map((id) => claimFor(id)),
  ...VERIFIED_CURRICULUM_CLAIMS,
];
const CLAIMS_BY_ID = new Map();
for (const claim of CURRICULUM_CLAIMS) {
  if (!CLAIMS_BY_ID.has(claim.poemId)) CLAIMS_BY_ID.set(claim.poemId, []);
  CLAIMS_BY_ID.get(claim.poemId).push(claim);
}

/** Kept separate so the 2024 transition note cannot silently rewrite per-poem claims. */
export const CURRICULUM_REVISION_ADDENDUM = [
  {
    claimId: "curriculum-2024-revision-addendum",
    poemId: null,
    curriculumEdition: "2024修订过渡附加声明（独立，不并入单首诗归属）",
    publisher: CURRICULUM_CONFIG.publisher,
    stage: "all",
    grade: "未逐项核验",
    semester: "未逐项核验",
    inClassOrExtra: "extra",
    requiredOrRecommended: "recommended_memorization",
    source: [
      {
        id: "curriculum-2024-addendum-source",
        url: "https://www.moe.gov.cn/srcsite/A26/s8001/202408/W020250418502592948423.pdf",
        title: "教育部 · 2024年义务教育国家课程教学用书目录（独立待核附录）",
        license: "source-defined",
        supports: ["2024_revision_addendum", "6-3_structure"],
        retrievedAt: CURRICULUM_RETRIEVED_AT,
      },
      {
        id: "pep-2024-revised-textbook-overview",
        url: "https://m.pep.com.cn/gyrj/jc/202409/t20240902_1994544.shtml",
        title: "人民教育出版社 · 2024修订教材逐年换用说明",
        license: "source-defined",
        supports: ["2024_revision_addendum", "year_by_year_rollout"],
        retrievedAt: CURRICULUM_RETRIEVED_AT,
      },
    ],
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    verificationStatus: "candidate",
    notMergedIntoDefault: true,
    claimNote: "此记录不是对任何单首诗的课程归属断言；只有逐项官方证据完成后才能拆分为独立 poem claim。",
  },
];

export const REVIEW_FLAG_DEFINITIONS = {
  machineCandidate: "由程序或规则选出的候选，不代表人工核验。",
  sourceVerified: "对应来源、版本和 provenance 已逐项核对。",
  textReviewed: "诗文版本、标点和换行已由内容编辑核对。",
  pinyinReviewed: "拼音和异读字已由内容编辑核对。",
  conceptReviewed: "诗与概念的关系和教学理由已核对。",
  geoReviewed: "地点、关系类型、定位精度和来源已核对。",
  guidedReady: "已经具备可离线执行的引导步骤。",
  immersiveReady: "满足沉浸路线的设计门槛；不等同于课程事实已验证。",
};

function reviewFlagsFor(id) {
  const gold = GOLD_SET.has(id);
  const immersive = IMMERSIVE_SET.has(id);
  return {
    machineCandidate: true,
    sourceVerified: gold,
    textReviewed: gold,
    pinyinReviewed: gold,
    conceptReviewed: gold,
    geoReviewed: gold,
    guidedReady: gold || GUIDED_SET.has(id),
    immersiveReady: immersive,
  };
}

const REGION_SOURCE = {
  id: "curated-region-route-reference",
  url: "https://www.gov.cn/",
  title: "中国地理与历史空间的项目路线参考（待逐段来源核验）",
  license: "source-defined",
  supports: ["cultural_route_context"],
  retrievedAt: CURRICULUM_RETRIEVED_AT,
};

function regionSource() {
  return cloneSource(REGION_SOURCE);
}

/** Eight cultural regions/routes; routes are product learning scaffolds, not historical travel claims. */
export const CULTURAL_REGIONS = [
  {
    id: "middle-yangtze-route",
    name: "长江中游·山楼江天",
    routeLabel: "从庐山到江楼",
    description: "以山、楼、江面和远帆建立‘向哪里看’的空间骨架。",
    anchorNodeIds: ["lushan", "yangtze", "yellow-crane", "yangzhou"],
    routeOrder: 1,
    routeDisclaimer: "路线是今天的空间学习建议，不是诗人真实行程复原。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
  {
    id: "jiangnan-waterways-route",
    name: "江南·湖上晴雨",
    routeLabel: "西湖与江南水网",
    description: "把晴雨、荷花、桥影和水路放在同一张江南观察图上。",
    anchorNodeIds: ["west-lake", "hangzhou", "suzhou", "chuzhou", "dongting-lake"],
    routeOrder: 2,
    routeDisclaimer: "这条文化线不是每首诗的共同写作地点；同一区域不代表作者都到过这里。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
  {
    id: "bashu-three-gorges-route",
    name: "巴蜀·峡江入画",
    routeLabel: "成都到峡江",
    description: "沿雨、花、船和峡江速度观察巴蜀的高低与远近。",
    anchorNodeIds: ["chengdu", "baidi-city", "jiangling", "bashan"],
    routeOrder: 3,
    routeDisclaimer: "这条路线不是作者按此线旅行的证明，只用于理解空间关系。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
  {
    id: "guanzhong-changan-route",
    name: "关中·古都与故园",
    routeLabel: "长安—华山—渭水",
    description: "在古代城市、故乡和时代背景之间建立时间感。",
    anchorNodeIds: ["chang-an", "weicheg", "hua-shan", "zhongyuan"],
    routeOrder: 4,
    routeDisclaimer: "这条路线不是唐代街巷精确图；古代城市只用今天的参考点表达。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
  {
    id: "hexi-frontier-route",
    name: "河西与边塞·风雪关山",
    routeLabel: "凉州—玉门关—阳关",
    description: "用关隘、风雪、月色和大漠理解‘边塞’不是一个抽象标签。",
    anchorNodeIds: ["liangzhou", "yumen-pass", "yangguan", "loulan", "dunhuang"],
    routeOrder: 5,
    routeDisclaimer: "边塞连线是文化理解路线，不是历史军旅行军路线。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
  {
    id: "yellow-river-pass-route",
    name: "黄河与关隘·大河向东",
    routeLabel: "黄河—潼关—洛阳",
    description: "把大河、关隘和古代交通想象成一条可追问的文明线索。",
    anchorNodeIds: ["yellow-river", "tongguan", "luoyang", "mount-tai"],
    routeOrder: 6,
    routeDisclaimer: "这条路线不是作者行程；河流关系来自现代地理参照，诗中写到的河不等于作者到过该点。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
  {
    id: "eastern-mountains-sea-route",
    name: "东部山海·登高望远",
    routeLabel: "泰山—北固—碣石",
    description: "以登高、海潮和山石练习从近处物象推到辽阔视野。",
    anchorNodeIds: ["mount-tai", "beigu-mountain", "jieshi-mountain", "yan-mountain"],
    routeOrder: 7,
    routeDisclaimer: "登高路线是学习建议，不是诗人写作或游历路线。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
  {
    id: "central-south-memory-route",
    name: "荆楚与江南·故人相逢",
    routeLabel: "荆门—桃花潭—蕲水",
    description: "从送别、重逢、江水和旧地名进入人与地方的文化记忆。",
    anchorNodeIds: ["jingmen", "taohuatan", "qishui", "jinling", "sishui"],
    routeOrder: 8,
    routeDisclaimer: "这条路线不是历史行程；文化关联和路线建议需要与具体诗句证据分开阅读。",
    sources: [regionSource()],
    reviewStatus: "curated-scaffold",
  },
];

const REGION_IDS = new Set(CULTURAL_REGIONS.map((region) => region.id));
const NODE_REGION = {
  lushan: "middle-yangtze-route",
  yangtze: "middle-yangtze-route",
  "yellow-crane": "middle-yangtze-route",
  yangzhou: "middle-yangtze-route",
  "west-lake": "jiangnan-waterways-route",
  hangzhou: "jiangnan-waterways-route",
  suzhou: "jiangnan-waterways-route",
  chuzhou: "jiangnan-waterways-route",
  "dongting-lake": "jiangnan-waterways-route",
  chengdu: "bashu-three-gorges-route",
  "baidi-city": "bashu-three-gorges-route",
  jiangling: "bashu-three-gorges-route",
  bashan: "bashu-three-gorges-route",
  "chang-an": "guanzhong-changan-route",
  weicheg: "guanzhong-changan-route",
  "hua-shan": "guanzhong-changan-route",
  zhongyuan: "guanzhong-changan-route",
  liangzhou: "hexi-frontier-route",
  "yumen-pass": "hexi-frontier-route",
  yangguan: "hexi-frontier-route",
  loulan: "hexi-frontier-route",
  dunhuang: "hexi-frontier-route",
  yinshan: "hexi-frontier-route",
  frontier: "hexi-frontier-route",
  "yellow-river": "yellow-river-pass-route",
  tongguan: "yellow-river-pass-route",
  luoyang: "yellow-river-pass-route",
  "mount-tai": "yellow-river-pass-route",
  "beigu-mountain": "eastern-mountains-sea-route",
  "jieshi-mountain": "eastern-mountains-sea-route",
  "yan-mountain": "eastern-mountains-sea-route",
  "jingting-mountain": "eastern-mountains-sea-route",
  "tianmen-mountain": "eastern-mountains-sea-route",
  jinling: "central-south-memory-route",
  taohuatan: "central-south-memory-route",
  jingmen: "central-south-memory-route",
  qishui: "central-south-memory-route",
  sishui: "central-south-memory-route",
  "furong-lou": "central-south-memory-route",
  huangzhou: "central-south-memory-route",
  yueyang: "central-south-memory-route",
  unassigned: "central-south-memory-route",
};

function regionForNode(nodeId) {
  return NODE_REGION[nodeId] || "central-south-memory-route";
}

const NODE_COORDINATES = {
  lushan: [115.973333, 29.5725],
  "yellow-crane": [114.296944, 30.546944],
  yangzhou: [119.431, 32.394],
  "west-lake": [120.148, 30.241],
  hangzhou: [120.155, 30.274],
  chengdu: [104.066, 30.657],
  "chang-an": [108.94, 34.34],
  "yellow-river": [110.1, 37.5],
  taohuatan: [118.15, 30.62],
  "baidi-city": [109.58, 31.05],
  jiangling: [112.19, 30.35],
  "jingting-mountain": [118.72, 30.67],
  "tianmen-mountain": [118.58, 31.58],
  yinshan: [109.0, 41.2],
  yueyang: [113.13, 29.37],
  liangzhou: [102.64, 37.93],
  "yumen-pass": [94.0, 40.36],
  "furong-lou": [111.0, 27.0],
  luoyang: [112.45, 34.62],
  loulan: [89.75, 40.52],
  weicheg: [108.72, 34.33],
  yangguan: [94.1, 39.93],
  "hua-shan": [110.09, 34.49],
  jingmen: [112.2, 31.0],
  yangtze: [112.0, 30.6],
  "mount-tai": [117.1, 36.25],
  jinling: [118.8, 32.06],
  suzhou: [120.62, 31.3],
  chuzhou: [118.32, 32.3],
  "dongting-lake": [112.95, 29.37],
  huangzhou: [114.87, 30.45],
  qishui: [115.27, 30.45],
  zhongyuan: [113.8, 34.0],
  "yan-mountain": [116.4, 40.5],
  dunhuang: [94.66, 40.14],
  sishui: [117.9, 35.5],
  tongguan: [110.45, 34.55],
  "jieshi-mountain": [119.5, 39.8],
  "beigu-mountain": [119.55, 32.2],
  bashan: [108.4, 31.5],
};

const NODE_NAMES = {
  lushan: "庐山",
  "yellow-crane": "黄鹤楼",
  yangzhou: "扬州",
  "west-lake": "西湖",
  hangzhou: "杭州",
  chengdu: "成都",
  "chang-an": "长安",
  unassigned: "未可靠落图的语境",
  "yellow-river": "黄河",
  taohuatan: "桃花潭",
  "baidi-city": "白帝城",
  jiangling: "江陵",
  "jingting-mountain": "敬亭山",
  "tianmen-mountain": "天门山",
  yinshan: "阴山",
  yueyang: "岳阳",
  liangzhou: "凉州",
  "yumen-pass": "玉门关",
  "furong-lou": "芙蓉楼",
  luoyang: "洛阳",
  loulan: "楼兰",
  weicheg: "渭城",
  yangguan: "阳关",
  "hua-shan": "华山",
  jingmen: "荆门",
  yangtze: "长江",
  "mount-tai": "泰山",
  jinling: "金陵",
  suzhou: "苏州",
  chuzhou: "滁州",
  frontier: "边塞语境",
  "dongting-lake": "洞庭湖",
  huangzhou: "黄州",
  qishui: "蕲水",
  zhongyuan: "中原",
  "yan-mountain": "燕山",
  dunhuang: "敦煌",
  sishui: "泗水",
  tongguan: "潼关",
  "jieshi-mountain": "碣石山",
  "beigu-mountain": "北固山",
  bashan: "巴山",
};

const CATALOG_NODE_IDS = [
  "lushan", "yellow-crane", "yangzhou", "west-lake", "chengdu", "chang-an", "unassigned",
  "yellow-river", "taohuatan", "baidi-city", "jiangling", "jingting-mountain", "tianmen-mountain",
  "yinshan", "yueyang", "liangzhou", "yumen-pass", "furong-lou", "luoyang", "loulan", "weicheg",
  "yangguan", "hua-shan", "jingmen", "yangtze", "mount-tai", "jinling", "suzhou", "chuzhou", "frontier",
  "dongting-lake", "hangzhou", "huangzhou", "qishui", "zhongyuan", "yan-mountain", "dunhuang", "sishui",
  "tongguan", "jieshi-mountain", "beigu-mountain", "bashan",
];

function geoSource(id) {
  const unknown = !NODE_COORDINATES[id];
  return {
    id: `geo-${id}-reference`,
    url: unknown ? RUNTIME_SOURCE.url : "https://www.geonames.org/",
    title: unknown ? "runtime candidate relation; no reliable map point" : "GeoNames · geographic reference (approximate point)",
    license: unknown ? RUNTIME_SOURCE.license : "CC-BY-4.0",
    supports: [unknown ? "candidate_relation_only" : "present_day_reference"],
    retrievedAt: CURRICULUM_RETRIEVED_AT,
  };
}

export const GEO_NODES = CATALOG_NODE_IDS.map((id) => {
  const coordinates = NODE_COORDINATES[id] || null;
  return {
    id,
    name: NODE_NAMES[id] || id,
    kind: id === "unassigned" || id === "frontier" ? "context" : "place",
    regionId: regionForNode(id),
    positionKind: coordinates ? "approximate_point" : "unknown",
    coordinates,
    coordinateOrder: "[longitude, latitude]",
    precision: coordinates ? "regional_reference_point" : "not-reliably-mappable",
    validTime: {
      kind: coordinates ? "present_day_reference" : "unknown",
      label: coordinates ? "今天的区域参照点，不等于古代诗人精确位置" : "无法可靠落图的诗句或候选语境",
      asOf: CURRICULUM_RETRIEVED_AT,
    },
    confidence: coordinates ? "candidate-medium" : "unknown",
    sources: [geoSource(id)],
    license: coordinates ? "CC-BY-4.0" : RUNTIME_SOURCE.license,
    disputes: coordinates ? ["代表点只用于相对位置学习，需逐项与官方地理来源核验。"] : ["不将未知位置伪装为坐标。"],
    status: coordinates ? "available" : "candidate",
    reviewStatus: "candidate",
  };
});

const GEO_NODE_SET = new Set(GEO_NODES.map((node) => node.id));

const GEO_TYPE_MAP = {
  written_at_context: "written_at",
  written_at: "written_at",
  depicts_place: "describes",
  landscape_mentioned: "mentions",
  destination_mentioned: "mentions",
  mentions_place: "mentions",
  landmark_reference: "mentions",
  departure_place: "describes",
  river_imagery: "describes",
  water_imagery: "describes",
  mountain_river: "describes",
  mountain: "describes",
  sea: "describes",
  lake: "describes",
  weather: "describes",
  garden: "describes",
  waterway: "describes",
  rain: "describes",
  city_context: "cultural_association",
  regional_context: "cultural_association",
  regional_association: "cultural_association",
  cultural_association: "cultural_association",
  mountain_association: "cultural_association",
  historical_association: "historical_allusion",
  historical_context: "historical_allusion",
  historical_city: "historical_allusion",
  frontier: "mentions",
  imagined_frontier: "imagined",
  mythic_association: "imagined",
  moon_imagery: "imagined",
  time_metaphor: "imagined",
  homecoming: "journey_suggestion",
  river_journey: "journey_suggestion",
  historical_route: "journey_suggestion",
  climb: "journey_suggestion",
  spring: "describes",
  candidate_reference: "unknown",
};

function geoRelationType(rawType) {
  return CURRICULUM_CONFIG.allowedGeoRelationTypes.includes(rawType) ? rawType : GEO_TYPE_MAP[rawType] || "unknown";
}

function placeCandidatesFrom(item) {
  return Array.isArray(item?.placeCandidates) && item.placeCandidates.length ? item.placeCandidates : ["unassigned"];
}

function relationFor(item, nodeId, rawType, index) {
  const normalizedNodeId = GEO_NODE_SET.has(nodeId) ? nodeId : "unassigned";
  const type = geoRelationType(rawType);
  const node = GEO_NODES.find((candidate) => candidate.id === normalizedNodeId);
  const unknown = type === "unknown" || node?.positionKind === "unknown";
  return {
    id: `${item.id}--${normalizedNodeId}--${index + 1}`,
    poemId: item.id,
    nodeId: normalizedNodeId,
    type: unknown ? "unknown" : type,
    rationale: unknown
      ? "现有候选无法可靠落图，保留 unknown 以避免把推测写成地理事实。"
      : `runtime 的 ${rawType || "candidate"} 关系映射为 ${type}，仍需逐项来源复核。`,
    lineRefs: ["text"],
    confidence: unknown ? "unknown" : "candidate",
    source: [cloneSource(RUNTIME_SOURCE)],
    reviewStatus: GOLD_SET.has(item.id) ? "gold-reviewed" : "candidate",
  };
}

export function buildPoemGeoRelations(runtimeCatalog) {
  const catalog = Array.isArray(runtimeCatalog) ? runtimeCatalog : runtimeCatalog?.catalog || [];
  return catalog.flatMap((item) => {
    const nodes = placeCandidatesFrom(item);
    const relationTypes = Array.isArray(item.placeRelationTypes) ? item.placeRelationTypes : [];
    return nodes.map((nodeId, index) => relationFor(item, nodeId, relationTypes[index] || relationTypes[0] || "unknown", index));
  });
}

export const POEM_GEO_RELATIONS = Object.freeze([]);

function conceptSource() {
  return [
    {
      id: "curriculum-standard-concept-reference",
      url: "https://www.moe.gov.cn/srcsite/A26/s8001/202204/t20220420_619921.html?fromColId=194",
      title: "教育部 · 义务教育课程方案和课程标准（2022年版）发布",
      license: "source-defined",
      supports: ["language_learning_framework", "age_band_context"],
      retrievedAt: CURRICULUM_RETRIEVED_AT,
    },
    {
      id: "project-concept-editorial-layer",
      url: "https://m.pep.com.cn/gyrj/jc/202409/t20240902_1994544.shtml",
      title: "人民教育出版社 · 统编教材修订与编排参考入口",
      license: "project-curated",
      supports: ["child_explanation", "guided_discovery"],
      retrievedAt: CURRICULUM_RETRIEVED_AT,
    },
  ];
}

function concept({
  id,
  term,
  aliases = [],
  category,
  formalDefinition,
  age7to8,
  age9to10,
  age11to12,
  guidedDiscovery,
  poemExamples = [],
  poemExampleLabels = [],
  nonExamples = [],
  commonMisconceptions = [],
  followUpQuestions = [],
  followUpQuestionsByAge = {},
}) {
  return {
    id,
    term,
    aliases,
    category,
    formalDefinition,
    age7to8,
    age9to10,
    age11to12,
    guidedDiscovery,
    poemExamples,
    poemExampleLabels,
    nonExamples,
    commonMisconceptions,
    followUpQuestions,
    followUpQuestionsByAge,
    sources: conceptSource(),
    reviewStatus: "reviewed-project-editorial",
  };
}

const QIJUE_STEPS = [
  {
    id: "count-first-line-1-to-7",
    order: 1,
    title: "数第一句",
    prompt: "读一读‘日照香炉生紫烟’，请把第一句的字从 1 数到 7。",
    lineRefs: ["line-1"],
    tokenIndexes: [1, 2, 3, 4, 5, 6, 7],
    expectedCount: 7,
    childAction: "逐字点数",
    offline: true,
  },
  {
    id: "discover-four-lines",
    order: 2,
    title: "发现四句",
    prompt: "再看看整首诗：它由几句组成？把四句的画面按顺序说出来。",
    lineRefs: ["line-1", "line-2", "line-3", "line-4"],
    expectedAnswer: "四句",
    childAction: "看句号和换行，复述画面顺序",
    offline: true,
  },
  {
    id: "retell-seven-characters",
    order: 3,
    title: "用自己的话说七言",
    prompt: "如果你来解释‘七言’，哪句话最清楚？",
    choices: [
      { label: "每一句通常有七个字", value: "seven-per-line", correct: true },
      { label: "整首诗一共有七个字", value: "seven-total", correct: false },
      { label: "这首诗要读七遍", value: "read-seven-times", correct: false },
    ],
    feedback: "七言说的是每一句的字数，不是全诗总字数。",
    childAction: "用自己的话复述",
    offline: true,
  },
  {
    id: "continue-ask-jueju-rhyme",
    order: 4,
    title: "把发现连成名字",
    prompt: "每句七个字，一共有四句，所以它叫‘七言绝句’。还想知道‘绝句’或‘押韵’是什么意思吗？",
    feedback: "七言＝每句通常七个字；绝句＝通常四句。先记住这两个发现就够了。",
    nextConceptIds: ["qiyan-jueju", "yayin"],
    childAction: "先说出自己的发现，再选择继续追问",
    offline: true,
  },
];

const QIJUE_AGE_STEPS = {
  "7-8": QIJUE_STEPS,
  "9-10": [
    QIJUE_STEPS[0],
    QIJUE_STEPS[1],
    {
      id: "compare-five-seven",
      prompt: "‘七言’和‘五言’差在哪里？把每句七个字和每句五个字放在一起比较。",
      choices: [
        { label: "每句的字数不同", value: "line-length", correct: true },
        { label: "作者的朝代不同", value: "dynasty", correct: false },
      ],
      feedback: "七言和五言先看每句字数；绝句通常都有四句。",
      childAction: "比较句内字数",
      offline: true,
    },
    {
      id: "find-qijue-rhyme",
      prompt: "听一听‘烟、川、天’：它们都在句尾，哪一部分声音相近？",
      feedback: "这三个字的尾音彼此呼应，帮助四句读起来连在一起。",
      childAction: "rhyme-finding",
      offline: true,
    },
  ],
  "11-12": [
    {
      ...QIJUE_STEPS[0],
      prompt: "先从文本证据开始：不数标点，第一句有几个字？",
    },
    {
      ...QIJUE_STEPS[1],
      prompt: "再核对篇式：全诗有几句？只凭‘四句’能不能确认所有格律规则？",
    },
    {
      id: "identify-rhyme-positions",
      prompt: "观察第一、二、四句末的‘烟、川、天’，再和第三句末的‘尺’比较。",
      feedback: "这首诗第一、二、四句入韵；绝句的第二、第四句通常押韵，第一句可以入韵，也可以不入韵。",
      childAction: "rhyme-finding",
      offline: true,
    },
    {
      id: "connect-regulated-verse",
      prompt: "现在把证据连起来：四句、每句七字、句末有组织地押韵。为什么还不急着展开完整平仄表？",
      feedback: "七言绝句是近体诗的重要形式。第一次辨认先抓句数、字数和韵脚，完整格律可以以后继续学。",
      childAction: "总结证据并保留格律边界",
      offline: true,
    },
  ],
};

export const CONCEPTS = [
  concept({
    id: "qiyan-jueju",
    term: "七言绝句",
    aliases: ["七绝", "七言四句"],
    category: "格律与篇式",
    formalDefinition: "每首四句、通常每句七个字的近体诗篇式；平仄与押韵还需结合具体版本讨论。",
    age7to8: "一首四句的小诗，每句大多有七个字。",
    age9to10: "四句、每句七字，读起来有整齐的节奏。",
    age11to12: "从句数、字数和押韵位置辨认七绝，不把‘四句’单独当成充分条件。",
    guidedDiscovery: { offline: true, offlineSteps: QIJUE_STEPS, ageSteps: QIJUE_AGE_STEPS, firstLineRange: [1, 7], discoverLineCount: 4 },
    poemExamples: ["lushan-wang-lushan-pubu", "lushan-ti-xi-lin-bi", "child-wang-tian-men-shan"],
    poemExampleLabels: ["《望庐山瀑布》", "《题西林壁》", "《望天门山》"],
    nonExamples: ["黄鹤楼（八句七律）", "春夜喜雨（八句五律）"],
    commonMisconceptions: ["不是所有四句诗都自动能证明格律完全相同。", "‘七言’说的是每句字数，不是七个汉字总量。"],
    followUpQuestions: ["绝句是什么意思？", "为什么第一句要数到 7？", "什么是押韵？", "我还是没听懂", "举一首别的例子"],
    followUpQuestionsByAge: {
      "7-8": ["绝句是什么意思？", "为什么第一句要数到 7？", "什么是押韵？", "我还是没听懂", "举一首别的例子"],
      "9-10": ["五言绝句和七言绝句差在哪？", "烟、川、天为什么算押韵？", "再比较一首绝句", "我还没听懂押韵", "绝句一定只有四句吗？"],
      "11-12": ["第一句为什么可以入韵？", "第二、第四句为什么常押韵？", "近体诗是什么意思？", "古今读音会改变押韵判断吗？", "什么时候需要看平仄？"],
    },
  }),
  concept({
    id: "wuyan-jueju",
    term: "五言绝句",
    aliases: ["五绝", "五言四句"],
    category: "格律与篇式",
    formalDefinition: "每首四句、通常每句五个字的绝句篇式。",
    age7to8: "四句、每句短短五个字的小诗。",
    age9to10: "五个字的句子让节奏更紧，画面常常留白更多。",
    age11to12: "与七绝比较句内字数、节奏和意象密度。",
    guidedDiscovery: { prompt: "挑一行，数一数是不是五个字，再看四句结构。", offline: true },
    poemExamples: ["child-jing-ye-si", "child-deng-guan-que-lou", "child-chun-xiao"],
    nonExamples: ["望庐山瀑布（七言绝句）"],
    commonMisconceptions: ["五言不是五行。"],
    followUpQuestions: ["少两个字，画面会更紧还是更空？"],
  }),
  concept({
    id: "lushi",
    term: "律诗",
    aliases: ["近体律诗"],
    category: "格律与篇式",
    formalDefinition: "近体诗的一类，通常八句，讲究字数、平仄、押韵和对仗等规范。",
    age7to8: "八句的整齐长诗，可以听出一段一段的节奏。",
    age9to10: "律诗常有八句，中间两联经常成对出现。",
    age11to12: "从篇幅、对仗和押韵位置综合辨认律诗，避免只凭‘很整齐’判断。",
    guidedDiscovery: { prompt: "先把诗分成四联，再找中间两联的对应关系。", offline: true },
    poemExamples: ["yellow-crane-huang-he-lou", "chengdu-chun-ye-xi-yu", "child-qian-tang-hu-chun-xing"],
    nonExamples: ["望庐山瀑布（四句绝句）"],
    commonMisconceptions: ["八句不一定都能在脱离版本的情况下完成格律判断。"],
    followUpQuestions: ["哪两联最像一副对联？", "律诗的尾音怎样组织？"],
  }),
  concept({
    id: "wuyan-lushi",
    term: "五言律诗",
    aliases: ["五律"],
    category: "格律与篇式",
    formalDefinition: "每句五字、通常八句的律诗。",
    age7to8: "八句、每句五个字的整齐长诗。",
    age9to10: "五个字让每句更短，中间常有成对的句子。",
    age11to12: "在五律中同时观察字数、八句结构、对仗与押韵。",
    guidedDiscovery: { prompt: "数每句字数，再圈出第三、四句和第五、六句的对应词。", offline: true },
    poemExamples: ["chengdu-chun-ye-xi-yu", "chang-an-chun-wang", "child-shan-ju-qiu-ming"],
    nonExamples: ["春晓（五言绝句，四句）"],
    commonMisconceptions: ["五言律诗不是五句的诗。"],
    followUpQuestions: ["八句为什么能容纳更多时间变化？"],
  }),
  concept({
    id: "qiyan-lushi",
    term: "七言律诗",
    aliases: ["七律"],
    category: "格律与篇式",
    formalDefinition: "每句七字、通常八句的律诗。",
    age7to8: "每句七个字、通常有八句的长诗。",
    age9to10: "比七绝多四句，能展开更多观察和转折。",
    age11to12: "结合八句、每句七字、颔联颈联对仗与押韵位置辨认。",
    guidedDiscovery: { prompt: "把八句按首联、颔联、颈联、尾联分组。", offline: true },
    poemExamples: ["child-deng-gao", "child-qian-tang-hu-chun-xing"],
    nonExamples: ["黄鹤楼送孟浩然之广陵（七言绝句）"],
    commonMisconceptions: ["七律不是‘七句的律诗’。"],
    followUpQuestions: ["哪两联最工整？哪一联开始转情？"],
  }),
  concept({
    id: "cipai",
    term: "词牌",
    aliases: ["词调", "词的曲调名称"],
    category: "词与歌辞",
    formalDefinition: "词所依的曲调名称，规定句式、字数和押韵等格式；词牌名不等于作品主题。",
    age7to8: "词牌像一首词的节拍模板，题目不一定就是故事内容。",
    age9to10: "同一词牌可以写不同主题，先分清词牌和题目。",
    age11to12: "词牌约束格律格式，不直接决定作者要写的对象或情感。",
    guidedDiscovery: { prompt: "找出‘水调歌头’或‘浣溪沙’，比较每句长短是否整齐。", offline: true },
    poemExamples: ["child-shui-diao-ge-tou", "child-huan-xi-sha-qishui", "child-qing-ping-le-cun-ju"],
    nonExamples: ["望岳（诗题，不是词牌）"],
    commonMisconceptions: ["词牌名不一定等于词的内容。"],
    followUpQuestions: ["为什么词句长短不一？", "词牌和诗体有什么不同？"],
  }),
  concept({
    id: "yuefu",
    term: "乐府",
    aliases: ["乐府诗", "古乐府"],
    category: "词与歌辞",
    formalDefinition: "源自古代乐府机构或沿用其歌辞传统的诗歌类别，题目、歌唱性和叙事传统各有差异。",
    age7to8: "有些古诗原来可以配乐歌唱，‘乐府’就是这类传统的名字。",
    age9to10: "乐府题目常保留古代歌辞的痕迹，也可以写新的故事和感受。",
    age11to12: "区分乐府传统、具体题目与后世仿作，不把‘有节奏’作为唯一证据。",
    guidedDiscovery: { prompt: "比较题目里‘歌、行、曲’等字和诗歌的叙事声音。", offline: true },
    poemExamples: ["chang-an-zi-ye-wu-ge-qiu-ge", "child-chang-ge-xing", "child-gu-lang-yue-xing"],
    nonExamples: ["饮湖上初晴后雨（宋诗）"],
    commonMisconceptions: ["乐府不是一种固定的五言或七言字数。"],
    followUpQuestions: ["如果配乐，哪一处适合重复？", "题目中的‘行’带来什么感觉？"],
  }),
  concept({
    id: "yayin",
    term: "押韵",
    aliases: ["韵脚", "押韵字"],
    category: "声音与节奏",
    formalDefinition: "在规定位置使用韵母相近或相通的字，使诗歌形成回环的声音联系；古今读音可能不同。",
    age7to8: "几句的最后一个字听起来像在互相招呼。",
    age9to10: "关注句末的声音，不只看字长得像不像。",
    age11to12: "押韵要结合韵部、诗体和历史读音，不能只用现代普通话机械判断。",
    guidedDiscovery: { prompt: "听‘烟、川、天’的结尾，找出声音相近的韵脚。", offline: true },
    poemExamples: ["lushan-wang-lushan-pubu", "child-deng-guan-que-lou", "yellow-crane-huang-he-lou"],
    nonExamples: ["散文段落（没有固定诗体韵脚要求）"],
    commonMisconceptions: ["押韵不是每个字都要同音。", "现代普通话听不出来，不等于古代没有押韵。"],
    followUpQuestions: ["为什么第一句有时也押韵？", "换成普通话读，感觉一样吗？"],
  }),
  concept({
    id: "duizhang",
    term: "对仗",
    aliases: ["对偶", "对句"],
    category: "表达与结构",
    formalDefinition: "上下句在词性、结构、意义或声调等方面相互对应，形成整齐又有变化的表达。",
    age7to8: "两句话像两排相互照应的队伍。",
    age9to10: "名词对名词、动作对动作，看看两句哪里一一对应。",
    age11to12: "同时观察词性、结构、意象和意义方向，不把任何重复都叫对仗。",
    guidedDiscovery: { prompt: "把两句并排写，给对应的山、水、动作画线。", offline: true },
    poemExamples: ["yellow-crane-huang-he-lou", "chengdu-chun-ye-xi-yu", "child-qian-tang-hu-chun-xing"],
    nonExamples: ["单句里的同义重复"],
    commonMisconceptions: ["对仗不只是字数相同。"],
    followUpQuestions: ["对应词换掉一个，画面会变吗？"],
  }),
  concept({
    id: "kuazhang",
    term: "夸张",
    aliases: ["夸饰"],
    category: "表达与结构",
    formalDefinition: "有意放大或缩小事物的尺度、速度、距离或力量，以强化感受和想象。",
    age7to8: "诗人把画面说得特别大、特别高或特别快，让你一下看见感觉。",
    age9to10: "先找不可能按字面发生的地方，再说它想强调什么。",
    age11to12: "夸张不是事实错误，而是服务于情感和审美的表达策略。",
    guidedDiscovery: { prompt: "找‘三千尺、九天’，问问诗人为什么要把数字说得这么大。", offline: true },
    poemExamples: ["lushan-wang-lushan-pubu", "child-zao-fa-bai-di-cheng", "child-ye-su-shan-si"],
    nonExamples: ["地图上测量出的实际距离"],
    commonMisconceptions: ["夸张不等于撒谎，也不能把每个大数字都自动算夸张。"],
    followUpQuestions: ["如果改成‘很高’，瀑布还会有同样的力量吗？"],
  }),
  concept({
    id: "jiejing-shuqing",
    term: "借景抒情",
    aliases: ["寓情于景", "情景交融"],
    category: "情感与观看",
    formalDefinition: "先写眼前或想象中的景物，再借景物的色彩、声音、动静和远近传达情感。",
    age7to8: "景物不只是背景，它会帮诗人说心里的话。",
    age9to10: "找出景物，再问这些景物让人感到开心、孤单、思念还是开阔。",
    age11to12: "说明景与情的触发关系，避免把景物清单直接当作情感结论。",
    guidedDiscovery: { prompt: "先圈景物，再用一个感受词说说景物带来的心情。", offline: true },
    poemExamples: ["west-lake-yin-hu-shang", "chengdu-chun-ye-xi-yu", "child-feng-qiao-ye-bo"],
    nonExamples: ["纯地理说明文字"],
    commonMisconceptions: ["看到雨不一定就是悲伤，要结合全诗语气。"],
    followUpQuestions: ["换一个天气，情绪还会一样吗？", "哪些景物是动的，哪些是静的？"],
  }),
  concept({
    id: "songbie-shi",
    term: "送别诗",
    aliases: ["离别诗", "赠别诗"],
    category: "主题与文化",
    formalDefinition: "围绕送别、远行、友情、祝愿或离愁展开的诗歌类型；景物和路线常承载关系变化。",
    age7to8: "朋友要走了，诗人用江水、帆和风景送他一程。",
    age9to10: "从谁送谁、去哪儿和留下的人看情感方向。",
    age11to12: "区分现场送别、忆别和借送别写时代或人生感受。",
    guidedDiscovery: { prompt: "画出出发点和远方，再找一句最像挥手告别的话。", offline: true },
    poemExamples: ["yellow-crane-song-meng-hao-ran", "child-zeng-wang-lun", "child-furong-lou-song-xin-jian"],
    nonExamples: ["静夜思（思乡诗，不是现场送别）"],
    commonMisconceptions: ["出现‘远’不一定就是送别诗。"],
    followUpQuestions: ["为什么不直说舍不得？", "江水在送别中起了什么作用？"],
  }),
  concept({
    id: "biansai-shi",
    term: "边塞诗",
    aliases: ["边塞题材", "边地诗"],
    category: "主题与文化",
    formalDefinition: "以边地、关隘、军旅、戍守、战争或边地风物为主要语境的诗歌题材。",
    age7to8: "诗里出现关、雪、月和远方守边的人，画面会更辽阔也更冷。",
    age9to10: "从地点、天气、人物任务和家国情感一起判断，不只看‘关’一个字。",
    age11to12: "区分边塞景观、军旅叙事和后世想象，关注诗中的立场与情绪。",
    guidedDiscovery: { prompt: "先在地图上找关隘，再问风雪和距离怎样改变人物的感受。", offline: true },
    poemExamples: ["chang-an-zi-ye-wu-ge-qiu-ge", "child-liang-zhou-ci", "child-chu-sai"],
    nonExamples: ["西湖晴雨诗（江南湖景语境）"],
    commonMisconceptions: ["写月亮不一定就是边塞诗。"],
    followUpQuestions: ["边地和家乡之间隔着什么？", "诗人是在赞美、担忧还是想象？"],
  }),
  concept({
    id: "shangyou",
    term: "上游",
    aliases: ["河流上游", "水源方向"],
    category: "山河空间",
    formalDefinition: "河流靠近源头的一段；地图方向要结合具体河流流向和地形判断。",
    age7to8: "水从哪里来，靠近水源的方向叫上游。",
    age9to10: "沿着水流反方向找源头，就是在找上游。",
    age11to12: "上游是相对关系，不是地图上固定的‘上方’；需要依据河流流向。",
    guidedDiscovery: { prompt: "先看河水往哪边走，再反过来指出上游。", offline: true },
    poemExamples: ["lushan-wang-lushan-pubu", "yellow-crane-song-meng-hao-ran", "child-zao-fa-bai-di-cheng"],
    nonExamples: ["把地图北方直接当作所有河流上游"],
    commonMisconceptions: ["上游不是屏幕上方，也不等于地势最高处。"],
    followUpQuestions: ["从庐山到黄鹤楼，长江关系如何表达？"],
  }),
  concept({
    id: "xiayou",
    term: "下游",
    aliases: ["河流下游", "入海方向"],
    category: "山河空间",
    formalDefinition: "河流由源头向河口或汇入口流去的一段；需结合具体河流方向判断。",
    age7to8: "水要流向更远的地方，靠近河口的方向叫下游。",
    age9to10: "顺着水流方向走，可以从上游来到下游。",
    age11to12: "下游是河流系统中的相对位置，不由地图上下直接决定。",
    guidedDiscovery: { prompt: "用手指顺着江水走，看看它把视线带向哪里。", offline: true },
    poemExamples: ["yellow-crane-song-meng-hao-ran", "child-zao-fa-bai-di-cheng", "child-deng-gao"],
    nonExamples: ["没有河流流向证据的两地直线连线"],
    commonMisconceptions: ["下游不一定在南方或东方。"],
    followUpQuestions: ["为什么送别诗常借下游写远行？"],
  }),
  concept({
    id: "gudai-diming",
    term: "古代地名",
    aliases: ["历史地名", "古今地名"],
    category: "时间与地理",
    formalDefinition: "在特定历史时期使用的地点名称，可能与今天同名、异名或指向范围不同。",
    age7to8: "古人给地方取的名字，今天可能还在用，也可能换了名字。",
    age9to10: "看到地名先问它在当时指什么，不急着和今天的点完全重合。",
    age11to12: "历史地名需要同时核对时代、范围、沿革与现代参照点。",
    guidedDiscovery: { prompt: "找出诗里的地名，给它标‘古代语境’或‘今天参照’。", offline: true },
    poemExamples: ["yellow-crane-huang-he-lou", "chang-an-chun-wang", "child-liang-zhou-ci"],
    nonExamples: ["未经来源支持的现代地址猜测"],
    commonMisconceptions: ["古地名不一定就是今天同名城市的精确位置。"],
    followUpQuestions: ["黄鹤楼今天重建过，诗里的楼和今天怎样连接？"],
  }),
  concept({
    id: "chaodai",
    term: "朝代",
    aliases: ["历史时期", "时代背景"],
    category: "时间与地理",
    formalDefinition: "中国历史上具有相对连续政治统治和时代特征的时期名称，是理解作品语境的时间坐标。",
    age7to8: "朝代像历史时间轴上的一段名字，告诉我们诗人生活的大时代。",
    age9to10: "先把诗人放到时间线上，再看当时的城市、交通和生活。",
    age11to12: "朝代标签不是作品意义的全部，还要结合作者经历和文本证据。",
    guidedDiscovery: { prompt: "把唐、宋等时代卡片放在时间线上，再回诗里找时代痕迹。", offline: true },
    poemExamples: ["lushan-wang-lushan-pubu", "west-lake-yin-hu-shang", "child-guan-canghai"],
    nonExamples: ["把今天的地点名称当成古代朝代"],
    commonMisconceptions: ["知道朝代不等于知道诗的写作年份和地点。"],
    followUpQuestions: ["同一地点换了朝代，诗的视线会不会变化？"],
  }),
];

const CONCEPT_BY_ID = new Map(CONCEPTS.map((item) => [item.id, item]));

const GENRE_CONCEPTS = {
  "七言绝句": ["qiyan-jueju"],
  "五言绝句": ["wuyan-jueju"],
  "五言律诗": ["wuyan-lushi", "lushi"],
  "七言律诗": ["qiyan-lushi", "lushi"],
  词: ["cipai"],
  乐府诗: ["yuefu"],
};

const THEME_CONCEPTS = [
  ["送别", "songbie-shi"],
  ["边塞", "biansai-shi"],
  ["边关", "biansai-shi"],
  ["长江", "xiayou"],
  ["黄河", "shangyou"],
  ["押韵", "yayin"],
  ["高低", "jiejing-shuqing"],
  ["视角", "jiejing-shuqing"],
  ["比喻", "kuazhang"],
  ["江山", "jiejing-shuqing"],
  ["乡愁", "songbie-shi"],
  ["远行", "xiayou"],
  ["历史", "chaodai"],
  ["城市", "gudai-diming"],
  ["古今", "gudai-diming"],
];

function lineRefsFor(item, conceptId) {
  if (item.id === "lushan-wang-lushan-pubu" && conceptId === "qiyan-jueju") return ["line-1", "line-2", "line-3", "line-4"];
  if (Array.isArray(item.lines) && item.lines.length) return [item.lines[0].id || "line-1"];
  return ["text"];
}

function linkFor(item, conceptId, role = "supporting") {
  const record = CONCEPT_BY_ID.get(conceptId);
  return {
    id: `${item.id}--${conceptId}`,
    poemId: item.id,
    conceptId,
    rationale: item.id === "lushan-wang-lushan-pubu" && conceptId === "qiyan-jueju"
      ? "四句、第一句七字和整首的节奏共同构成离线发现路径；先数再命名。"
      : `从诗体、主题或 runtime 标签进入“${record?.term || conceptId}”的第一层追问。`,
    lineRefs: lineRefsFor(item, conceptId),
    ageBands: ["7-8", "9-10", "11-12"],
    role,
    reviewStatus: GOLD_SET.has(item.id) ? "gold-reviewed" : "candidate",
  };
}

function conceptIdsForItem(item) {
  const ids = new Set(GENRE_CONCEPTS[item.genre] || []);
  for (const theme of item.themes || []) {
    const match = THEME_CONCEPTS.find(([keyword]) => String(theme).includes(keyword));
    if (match) ids.add(match[1]);
  }
  if (!ids.size) ids.add("jiejing-shuqing");
  if (item.id === "lushan-wang-lushan-pubu") ids.add("yayin");
  return [...ids].filter((id) => CONCEPT_BY_ID.has(id));
}

export function buildPoemConceptLinks(runtimeCatalog) {
  const catalog = Array.isArray(runtimeCatalog) ? runtimeCatalog : runtimeCatalog?.catalog || [];
  return catalog.flatMap((item) => conceptIdsForItem(item).map((id, index) => linkFor(item, id, index === 0 ? "primary" : "supporting")));
}

/*
 * Synchronous browser consumers (including the shell UI) need at least one
 * honest, low-risk concept relation for every stable poem id.  Dynasty is
 * present in every runtime record, so it is the neutral fallback here.  The
 * richer genre/theme links are added by `buildPoemConceptLinks(runtime)` once
 * the runtime has been loaded; the Gold unit gets its two high-signal links
 * synchronously as well.
 */
export const POEM_CONCEPTS = Object.freeze([
  ...CATALOG_IDS.map((id) => linkFor({ id }, "chaodai", "supporting")),
  linkFor({ id: "lushan-wang-lushan-pubu", lines: [{ id: "line-1" }] }, "qiyan-jueju", "primary"),
  linkFor({ id: "lushan-wang-lushan-pubu", lines: [{ id: "line-1" }] }, "yayin", "supporting"),
]);

function runtimeItems(runtimeCatalog) {
  return Array.isArray(runtimeCatalog) ? runtimeCatalog : runtimeCatalog?.catalog || [];
}

function runtimeTitle(item, phase1PoemsById) {
  const complete = phase1PoemsById.get(item.id);
  return complete?.title?.text || item.title || item.id;
}

function runtimeAuthor(item, phase1PoemsById) {
  const complete = phase1PoemsById.get(item.id);
  return complete?.author?.name || item.author || "";
}

/**
 * Joins the metadata layer to the existing runtime without copying poem text
 * into this module.  The second argument is optional and only enriches the
 * ten complete Phase 1 units with line-aware data.
 */
export function buildLearningCatalog(runtimeCatalog, phase1Poems = []) {
  const items = runtimeItems(runtimeCatalog);
  const phase1PoemsById = new Map((Array.isArray(phase1Poems) ? phase1Poems : []).map((item) => [item.id, item]));
  const geoRelations = buildPoemGeoRelations(items);
  const conceptRelations = buildPoemConceptLinks(items);
  return items.map((item) => {
    const poemGeo = geoRelations.filter((relation) => relation.poemId === item.id);
    const poemConcepts = conceptRelations.filter((relation) => relation.poemId === item.id);
    const regionIds = [...new Set(poemGeo.map((relation) => regionForNode(relation.nodeId)))];
    return {
      id: item.id,
      title: runtimeTitle(item, phase1PoemsById),
      author: runtimeAuthor(item, phase1PoemsById),
      dynasty: item.dynasty || phase1PoemsById.get(item.id)?.dynasty || "",
      genre: item.genre || phase1PoemsById.get(item.id)?.genre || "",
      text: item.text || phase1PoemsById.get(item.id)?.text || "",
      themes: [...(item.themes || [])],
      placeCandidates: [...placeCandidatesFrom(item)],
      maturity: maturityFor(item.id),
      maturityPath: maturityPathFor(item.id),
      review: reviewFlagsFor(item.id),
      reviewFlags: reviewFlagsFor(item.id),
      curriculumClaims: CLAIMS_BY_ID.has(item.id) ? [...CLAIMS_BY_ID.get(item.id)] : [],
      conceptRelations: poemConcepts,
      geoRelations: poemGeo,
      regionIds,
      completeUnit: phase1PoemsById.get(item.id) || null,
    };
  });
}

const EXCLUSIVE_MATURITY_COUNTS = {
  standard: CATALOG_IDS.filter((id) => maturityFor(id) === "standard").length,
  guided: CATALOG_IDS.filter((id) => maturityFor(id) === "guided").length,
  immersive: CATALOG_IDS.filter((id) => maturityFor(id) === "immersive").length,
};

export const coverageSummary = {
  totalCatalogIds: CATALOG_IDS.length,
  gold: GOLD_IDS.length,
  immersive: IMMERSIVE_IDS.length,
  additionalImmersive: IMMERSIVE_IDS.filter((id) => !GOLD_SET.has(id)).length,
  guided: GUIDED_IDS.length,
  standardAvailable: CATALOG_IDS.length,
  exclusiveMaturityCounts: EXCLUSIVE_MATURITY_COUNTS,
  availableByLayer: {
    mother: 0,
    curriculum: CATALOG_IDS.length,
    standard: CATALOG_IDS.length,
    guided: GUIDED_IDS.length,
    immersive: IMMERSIVE_IDS.length,
  },
  culturalRegions: CULTURAL_REGIONS.length,
  geoNodes: GEO_NODES.length,
  mappedGeoNodes: GEO_NODES.filter((node) => node.positionKind !== "unknown").length,
  concepts: CONCEPTS.length,
  curriculumVolumes: CURRICULUM_VOLUMES.length,
  seriesVerifiedVolumes: CURRICULUM_VOLUMES.filter((volume) => volume.seriesVerificationStatus === "source-verified").length,
  itemEvidenceVolumes: CURRICULUM_VOLUMES.filter((volume) => volume.itemEvidenceStatus === "historical-partial").length,
  curriculumClaimStatus: {
    candidate: CURRICULUM_CLAIMS.filter((claim) => claim.verificationStatus === "candidate").length,
    sourceVerified: CURRICULUM_CLAIMS.filter((claim) => claim.verificationStatus === "source-verified").length,
  },
};

export const CURRICULUM_SYSTEM = {
  config: CURRICULUM_CONFIG,
  catalogIds: CATALOG_IDS,
  goldIds: GOLD_IDS,
  immersiveIds: IMMERSIVE_IDS,
  guidedIds: GUIDED_IDS,
  volumes: CURRICULUM_VOLUMES,
  claims: CURRICULUM_CLAIMS,
  revisionAddendum: CURRICULUM_REVISION_ADDENDUM,
  reviewFlagDefinitions: REVIEW_FLAG_DEFINITIONS,
  regions: CULTURAL_REGIONS,
  geoNodes: GEO_NODES,
  poemGeoRelations: POEM_GEO_RELATIONS,
  concepts: CONCEPTS,
  poemConcepts: POEM_CONCEPTS,
  coverageSummary,
};

export default CURRICULUM_SYSTEM;
