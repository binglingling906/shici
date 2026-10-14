import { masteryContentByPoemId } from "./mastery-content.js";

/**
 * Ten complete Phase 1 learning units.
 *
 * `makeLine` is a tiny content-time renderer: reviewers provide the exact
 * syllable for every spoken character, while punctuation stays a token with
 * no pronunciation.  The UI can therefore place ruby above each character
 * without reparsing a line or losing its line breaks.
 */

export const PHASE1_POEM_RETRIEVED_AT = "2026-09-01";

const PUNCTUATION = new Set(["，", "。", "！", "？", "；", "：", "、", "·", "“", "”", "‘", "’", "（", "）", "《", "》", "〈", "〉", "「", "」", "『", "』", ",", ".", "!", "?", ";", ":", "'", '"', "(", ")"]);
const TONE_MARKS = [
  /[āēīōūǖ]/u,
  /[áéíóúǘńḿ]/u,
  /[ǎěǐǒǔǚň]/u,
  /[àèìòùǜǹ]/u,
];

function toneNumber(value) {
  const index = TONE_MARKS.findIndex((pattern) => pattern.test(value));
  return index >= 0 ? index + 1 : 5;
}

function makeLine(id, text, syllables) {
  const characters = Array.from(text);
  const spokenCharacters = characters.filter((char) => !PUNCTUATION.has(char));
  if (spokenCharacters.length !== syllables.length) {
    throw new Error(`${id} has ${spokenCharacters.length} spoken characters but ${syllables.length} syllables`);
  }
  let spokenIndex = 0;
  const tokens = characters.map((char) => {
    if (PUNCTUATION.has(char)) return { char, punctuation: true };
    const pinyin = syllables[spokenIndex];
    spokenIndex += 1;
    return { char, pinyin, tone: toneNumber(pinyin) };
  });
  return { id, text, tokens };
}

function ageBands({ young, middle, older }) {
  return {
    "7-8": {
      label: "听见画面",
      explanation: young.explanation,
      openingQuestion: young.openingQuestion,
      hint: young.hint,
      followUp: young.followUp,
      completionStandard: young.completionStandard,
      context: young.context,
    },
    "9-10": {
      label: "连起山河",
      explanation: middle.explanation,
      openingQuestion: middle.openingQuestion,
      hint: middle.hint,
      followUp: middle.followUp,
      completionStandard: middle.completionStandard,
      context: middle.context,
    },
    "11-12": {
      label: "比较诗境",
      explanation: older.explanation,
      openingQuestion: older.openingQuestion,
      hint: older.hint,
      followUp: older.followUp,
      completionStandard: older.completionStandard,
      context: older.context,
    },
  };
}

function source(key, title, url, supports, license = "source-defined") {
  return {
    key,
    title,
    url,
    supports: Array.isArray(supports) ? supports : [supports],
    license,
    retrievedAt: PHASE1_POEM_RETRIEVED_AT,
  };
}

function reviewed(notes) {
  return {
    status: "curated",
    reviewedAt: PHASE1_POEM_RETRIEVED_AT,
    reviewer: "shanhe-phase1-content-review",
    notes,
  };
}

function override(path, char, pinyin, reason) {
  return { path, char, pinyin, reason };
}

function titleOverride(text, pinyin, reason) {
  return { path: "title", text, pinyin, reason };
}

function validateInterpretation(interpretation, lines, poemId) {
  if (!interpretation?.summary) throw new Error(`${poemId} interpretation needs a summary`);
  if (!Array.isArray(interpretation.lineMeanings) || interpretation.lineMeanings.length !== lines.length) {
    throw new Error(`${poemId} interpretation needs one line meaning per poem line`);
  }
  const expectedLineIds = lines.map((line) => line.id);
  interpretation.lineMeanings.forEach((entry, index) => {
    if (entry?.lineId !== expectedLineIds[index]) {
      throw new Error(`${poemId} interpretation line ${index + 1} must use ${expectedLineIds[index]}`);
    }
    if (!entry.meaning) throw new Error(`${poemId} ${entry?.lineId || `line-${index + 1}`} interpretation needs a meaning`);
  });
  if (!interpretation.extension?.title || !interpretation.extension?.text || !interpretation.extension?.prompt) {
    throw new Error(`${poemId} interpretation needs extension title, text and prompt`);
  }
  return interpretation;
}

function poem({
  id,
  title,
  titlePinyin,
  author,
  authorPinyin,
  dynasty,
  genre,
  placeId,
  lines,
  placeRelations,
  spatialLearning,
  age,
  interpretation,
  background,
  relatedPoemIds,
  nextPlaceId,
  nextReason,
  overrides,
  sourceRecords,
  reviewNotes,
}) {
  const content = masteryContentByPoemId[id];
  if (!content) throw new Error(`${id} learning mastery content is missing`);
  const expectedLineIds = lines.map((line) => line.id);
  if (!Array.isArray(content.lineMeanings) || content.lineMeanings.length !== lines.length) {
    throw new Error(`${id} mastery content needs one line meaning per poem line`);
  }
  const lineMeanings = content.lineMeanings.map((entry, index) => {
    if (entry?.lineId !== expectedLineIds[index]) throw new Error(`${id} mastery line ${index + 1} is out of order`);
    if (!entry.meaning || !entry.keywords?.length || !entry.misunderstanding || !(entry.picture || entry.prompt)) {
      throw new Error(`${id} mastery line ${entry?.lineId || index + 1} needs meaning, keywords, misunderstanding and picture/prompt`);
    }
    return {
      ...interpretation.lineMeanings[index],
      ...entry,
      childMeaning: entry.meaning,
      keyWords: [...entry.keywords],
      commonMisunderstanding: entry.misunderstanding,
      imagePrompt: entry.picture || entry.prompt,
    };
  });
  for (const field of ["wholeMeaning", "mainContent", "emotion", "centralIdea"]) {
    if (!content[field]) throw new Error(`${id} mastery content is missing ${field}`);
  }
  if (!Array.isArray(content.commonMisunderstandings) || content.commonMisunderstandings.length < 2) {
    throw new Error(`${id} mastery content needs common misunderstandings`);
  }
  if (!Array.isArray(content.memoryKeywords) || content.memoryKeywords.length !== lines.length) {
    throw new Error(`${id} mastery content needs one memory cue per poem line`);
  }
  if (!Array.isArray(content.firstCharacterHints) || content.firstCharacterHints.length !== lines.length) {
    throw new Error(`${id} mastery content needs one first-character cue per poem line`);
  }
  const learningContract = {
    understanding: {
      lineMeanings,
      wholeMeaning: content.wholeMeaning,
      mainContent: content.mainContent,
      evidenceLines: lines.map((line) => line.id),
      completionEvidence: "孩子用自己的话、关键词或画面说明每句大意，并能把诗句和画面对应起来；点击展开不单独算完成。",
      requiresEvidence: true,
    },
    theme: {
      mainContent: content.mainContent,
      emotion: content.emotion,
      centralIdea: content.centralIdea,
      evidenceLines: lines.map((line) => line.id),
      acceptedExpressions: ["用自己的话说", "意思相近即可", "可以先说出画面"],
      allowReasonableExpression: true,
      matchMode: "semantic-paraphrase",
    },
    recitation: {
      stages: ["原文+拼音", "without pinyin / 去拼音", "隐藏关键词", "首字提示", "画面线索", "完全隐藏 / 无提示完整背诵"],
      memoryKeywords: content.memoryKeywords,
      firstCharacterHints: content.firstCharacterHints,
      verification: { requiresNoPrompt: true, unassistedEvidence: "隐藏正文和拼音后从头到尾背出，允许一次轻微自我纠正；AI语音仅作辅助证据。" },
    },
    statuses: [
      { id: "understood", label: "读懂印" },
      { id: "interpreted", label: "会意印" },
      { id: "recited", label: "熟背印" },
      { id: "retained", label: "记牢印" },
    ],
    retention: { intervalsDays: [1, 3, 7], rule: "次日、三日后、七日后再次无提示背诵，并回忆大意或核心画面。" },
  };
  return {
    id,
    title: { text: title, pinyin: titlePinyin },
    author: { name: author, pinyin: authorPinyin },
    dynasty,
    genre,
    placeId,
    text: lines.map((line) => line.text).join("\n"),
    lines,
    placeRelations,
    spatialLearning,
    ageBands: ageBands(age),
    interpretation: validateInterpretation(interpretation, lines, id),
    mastery: { ...content, lineMeanings },
    learningContract,
    masteryStatuses: learningContract.statuses,
    recitationStages: learningContract.recitation.stages,
    memoryKeywords: learningContract.recitation.memoryKeywords,
    firstCharacterHints: learningContract.recitation.firstCharacterHints,
    reviewIntervalsDays: learningContract.retention.intervalsDays,
    background,
    relatedPoemIds,
    nextPlaceId,
    nextReason,
    pronunciation: {
      variety: "cmn-Hans-CN",
      mode: "modern-standard-mandarin",
      presentation: "ruby-above-character",
      toneMarks: true,
      candidateGenerator: "pinyin-pro@3.29.3",
      delivery: "committed-curated-tokens",
      standards: ["GB/T 16159-2012", "汉语拼音方案", "普通话异读词审音表"],
    },
    pronunciationOverrides: Object.fromEntries(overrides.map((entry) => [entry.path, entry])),
    provenance: {
      sources: sourceRecords,
      textMethod: "public-domain poem text transcribed from a source snapshot, then manually compared against the curated version",
      placeMethod: "relationship type is explicit; a place mention is not silently upgraded to an exact writing location",
    },
    review: reviewed(reviewNotes),
  };
}

const sourcePoetry = source(
  "chinese-poetry",
  "chinese-poetry · 唐诗宋诗 source candidate corpus",
  "https://github.com/chinese-poetry/chinese-poetry",
  ["text_candidate", "author_candidate", "dynasty_candidate"],
  "MIT (repository; source texts public domain)",
);

const sourcePeking = source(
  "pku-poetry-text-study",
  "北京大学 · 古诗文文本异文研究索引",
  "https://ir.pku.edu.cn/handle/20.500.11897/581009",
  ["text_version_review"],
  "source-defined",
);

const sourceLushan = source(
  "unesco-lushan",
  "UNESCO · Mount Lushan National Park",
  "https://whc.unesco.org/en/list/778/",
  ["lushan_region", "yangtze_north", "poyang_south"],
  "source-defined",
);

const sourceLushanGovernment = source(
  "lushan-government",
  "庐山市人民政府 · 庐山概况",
  "https://www.lushan.gov.cn/yxls/lssjj/t_5217791.html",
  ["lushan_city_context", "historical_names"],
  "source-defined",
);

const sourceYellowCrane = source(
  "yellow-crane-wuhan",
  "武汉市园林和林业局 · 黄鹤楼",
  "https://ylj.wuhan.gov.cn/zwgk/zwxxgkzl_12298/jggk_12304/xsdwszjzz_12308/202001/t20200110_726398.shtml",
  ["current_site", "reconstruction"],
  "source-defined",
);

const sourceYellowCraneWuchang = source(
  "yellow-crane-wuchang",
  "武昌区人民政府 · 黄鹤楼",
  "https://www.wuchang.gov.cn/zjwc/wcly/you/zmjd/202005/t20200507_3624646.html",
  ["wuhan_context", "yangtze_south_bank"],
  "source-defined",
);

const sourceWestLake = source(
  "west-lake-hangzhou",
  "杭州市人民政府 · 西湖文化景观",
  "https://www.hangzhou.gov.cn/col/col805132/index.html",
  ["west_lake_context", "hangzhou_context"],
  "source-defined",
);

const sourceChengdu = source(
  "chengdu-government",
  "成都市人民政府 · 成都城市参考",
  "https://www.chengdu.gov.cn/",
  ["chengdu_context"],
  "source-defined",
);

const sourceChangAn = source(
  "xian-government",
  "西安市人民政府 · 城市参考",
  "https://www.xa.gov.cn/",
  ["xian_context"],
  "source-defined",
);

export const phase1Poems = [
  poem({
    id: "lushan-wang-lushan-pubu",
    title: "望庐山瀑布",
    titlePinyin: "wàng lú shān pù bù",
    author: "李白",
    authorPinyin: "Lǐ Bái",
    dynasty: "唐",
    genre: "七言绝句",
    placeId: "lushan",
    lines: [
      makeLine("line-1", "日照香炉生紫烟，", ["rì", "zhào", "xiāng", "lú", "shēng", "zǐ", "yān"]),
      makeLine("line-2", "遥看瀑布挂前川。", ["yáo", "kàn", "pù", "bù", "guà", "qián", "chuān"]),
      makeLine("line-3", "飞流直下三千尺，", ["fēi", "liú", "zhí", "xià", "sān", "qiān", "chǐ"]),
      makeLine("line-4", "疑是银河落九天。", ["yí", "shì", "yín", "hé", "luò", "jiǔ", "tiān"]),
    ],
    placeRelations: [
      {
        targetId: "lushan",
        type: "cultural_association",
        confidence: "high",
        assertion: "诗题与诗句直接把画面锚定在庐山瀑布。",
        childMeaning: "诗人站在远处看山中的瀑布。",
      },
      {
        targetId: "yangtze",
        type: "regional_context",
        confidence: "medium",
        assertion: "庐山位于长江中游山水关系中；长江不是诗中直接写出的瀑布地点。",
        childMeaning: "把一座山放回更大的江山里。",
      },
    ],
    spatialLearning: {
      coreRelation: "distance-height-scale",
      observation: "从远处望去，瀑布像挂在山前；‘直下’让视线从高处落向低处。",
      mapAction: "先在区域地图找到庐山，再用远看、向下和很高三个词描述画面。",
      evidenceLineIds: ["line-2", "line-3", "line-4"],
      childTakeaway: "站得远，瀑布会像一条挂在山前的银河。",
    },
    age: {
      young: {
        explanation: "阳光照在香炉峰上，水汽像紫色的烟；远远看去，瀑布从高处一直落下来。",
        openingQuestion: "你觉得瀑布是在眼前，还是在远处？",
        hint: "找一找诗句里的‘遥看’。",
        followUp: "如果把手臂举高再放下，你能用动作说说‘直下’吗？",
        completionStandard: "说出远处和从高处落下中的至少一个画面。",
        context: "先听声音和动作，再认识庐山这座山。",
      },
      middle: {
        explanation: "‘遥看’改变了瀑布的大小感；诗人把真实的水流夸张成从九天落下的银河。",
        openingQuestion: "地图上的山和诗句里的‘遥看’，怎样一起说明诗人的位置？",
        hint: "比较‘挂前川’和‘直下’：一个像远处横着看，一个像从高处往下看。",
        followUp: "哪一句让你感觉瀑布最高？请用诗句证据说明。",
        completionStandard: "用距离与高低两个词解释诗句中的空间变化。",
        context: "把山、瀑布和长江中游区域关系连起来。",
      },
      older: {
        explanation: "诗先铺开香炉峰的光与雾，再以远视建立尺度，最后用‘银河落九天’完成由实景到想象的跃迁。",
        openingQuestion: "‘遥看’为什么是全诗的空间转轴？它怎样准备了最后的夸张？",
        hint: "观察动词顺序：看、挂、下、落。",
        followUp: "如果没有‘遥看’，最后的‘银河’还会有同样的尺度感吗？",
        completionStandard: "结合动词顺序和视角变化，解释夸张如何服务于山水尺度。",
        context: "保留诗与庐山的文化锚点，不把代表点当成诗人的精确站位。",
      },
    },
    interpretation: {
      summary: "阳光照在香炉峰上，山间水汽像紫色的烟；远远望去，瀑布从山前高处飞流直下。诗人把它想象成从九天落下的银河，用夸张表达眼前山水的壮观和惊叹。",
      lineMeanings: [
        { lineId: "line-1", meaning: "阳光照着香炉峰，水汽在山间升起，在诗人的眼中像一缕紫色烟雾。" },
        { lineId: "line-2", meaning: "从远处看，瀑布像一条长长的白色绸带挂在山前。" },
        { lineId: "line-3", meaning: "瀑布从高处笔直冲下来；‘三千尺’是夸张的说法，用来表现它看起来特别高、特别有力量。" },
        { lineId: "line-4", meaning: "诗人觉得这瀑布简直像银河从天空落下来；这是想象和比喻，不是真的银河掉到了山上。" },
      ],
      extension: {
        title: "把惊叹说得更大",
        text: "这首诗先写光和水汽，再写远看、落下，最后把瀑布想象成银河。它不在测量瀑布有多高，而是在记录一个人被壮丽景色震撼时，心里的尺度怎样突然变大。",
        prompt: "当你看到特别壮观的景物时，你会选择哪一个真实细节，再加上什么想象来表达自己的惊叹？",
      },
    },
    background: "作品与庐山形成明确的文化锚点；本单元只使用山体代表位置，不推断李白的确切观瀑点或写作路线。",
    relatedPoemIds: ["lushan-ti-xi-lin-bi", "yellow-crane-song-meng-hao-ran"],
    nextPlaceId: "yellow-crane",
    nextReason: "从庐山的高处与瀑布，沿长江中游去看临江的黄鹤楼。",
    overrides: [
      titleOverride("望庐山瀑布", "wàng lú shān pù bù", "题名作为地点与景物短语整体人工确认。"),
      override("line-2.token-2", "看", "kàn", "‘遥看’中为观看动词，不取其他读法。"),
      override("line-2.token-3", "瀑", "pù", "‘瀑布’词语中的规范读音。"),
      override("line-4.token-1", "疑", "yí", "‘疑是’中为仿佛、似乎的动词语境。"),
      override("line-4.token-5", "落", "luò", "‘落九天’中为向下落的动词。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceLushan, sourceLushanGovernment],
    reviewNotes: "沿用既有庐山垂直切片的人工拼音与空间关系审核；文字、拼音、标点、换行和儿童引导均复核。",
  }),

  poem({
    id: "lushan-ti-xi-lin-bi",
    title: "题西林壁",
    titlePinyin: "tí xī lín bì",
    author: "苏轼",
    authorPinyin: "Sū Shì",
    dynasty: "宋",
    genre: "七言绝句",
    placeId: "lushan",
    lines: [
      makeLine("line-1", "横看成岭侧成峰，", ["héng", "kàn", "chéng", "lǐng", "cè", "chéng", "fēng"]),
      makeLine("line-2", "远近高低各不同。", ["yuǎn", "jìn", "gāo", "dī", "gè", "bù", "tóng"]),
      makeLine("line-3", "不识庐山真面目，", ["bù", "shí", "lú", "shān", "zhēn", "miàn", "mù"]),
      makeLine("line-4", "只缘身在此山中。", ["zhǐ", "yuán", "shēn", "zài", "cǐ", "shān", "zhōng"]),
    ],
    placeRelations: [
      {
        targetId: "lushan",
        type: "depicts_place",
        confidence: "high",
        assertion: "诗句直接写庐山，并把不同观看位置写成认识山的方法。",
        childMeaning: "换一个位置，山的样子也会换。",
      },
    ],
    spatialLearning: {
      coreRelation: "viewpoint-change",
      observation: "横、侧、远、近、高、低是六种观察位置；人在山中时反而难看见全貌。",
      mapAction: "在地图与诗境中切换观察点，比较同一座山的不同视角。",
      evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
      childTakeaway: "看山要换位置，也要记得自己站在哪里。",
    },
    age: {
      young: {
        explanation: "从旁边看像山峰，从远处看又不一样；因为我们正在山里面，所以看不全它。",
        openingQuestion: "你觉得从山的哪一边看，样子会改变？",
        hint: "诗里有‘横看’和‘侧成峰’。",
        followUp: "请用‘从……看，像……’说一句自己的观察。",
        completionStandard: "说出换位置会看到不同样子。",
        context: "把一次看山的小发现说清楚，不要求背诵术语。",
      },
      middle: {
        explanation: "诗人把方向、距离和高度写成连续的观察实验：位置改变，看到的山形就改变。",
        openingQuestion: "‘远近高低各不同’是在说山变了，还是观察位置变了？",
        hint: "先圈出表示位置的词，再看‘各不同’指向什么。",
        followUp: "地图上的视角和诗人的观察有什么相似之处？",
        completionStandard: "用观察位置解释‘不识真面目’，并举一个诗句证据。",
        context: "开始理解诗句中的视角与认识之间的关系。",
      },
      older: {
        explanation: "前两句铺陈视点差异，后两句将地理位置转为认识论隐喻：局部经验不自动等于整体真相。",
        openingQuestion: "这首诗怎样从‘看山’推进到‘认识事物’？结构上哪一句完成转折？",
        hint: "注意‘不识’与‘只缘’的因果关系。",
        followUp: "把这首诗和《望庐山瀑布》的观看距离比较，二者如何共同塑造庐山？",
        completionStandard: "结合空间词和因果结构，说明视角限制如何成为哲理。",
        context: "允许儿童在诗境、地图和自己的生活观察之间建立比较。",
      },
    },
    interpretation: {
      summary: "诗人从横着、侧着、远处、近处、高处、低处看庐山，看到的山形都不一样。因为自己正在山中，只能看到局部，很难一次看清整座山的全貌。最后两句把看山的经验延伸到认识事情：站的位置会影响我们看到的样子，但这不是唯一一种固定的寓意。",
      lineMeanings: [
        { lineId: "line-1", meaning: "横向看庐山，山岭连绵；从侧面看，又像一座座高峰。" },
        { lineId: "line-2", meaning: "站得远或近、在高处或低处，眼前的庐山都会呈现出不同的样子。" },
        { lineId: "line-3", meaning: "正因为人在山里，只看到了其中一部分，所以没有认清庐山完整的面貌。" },
        { lineId: "line-4", meaning: "看不全的原因，是自己正身处这座山中；位置限制了眼前的视野。" },
      ],
      extension: {
        title: "换个位置，再看一遍",
        text: "诗的前两句是对庐山的实际观察，后两句才把这个观察变成一种思考：局部看到的并不自动等于全部。它可以提醒我们换角度、补信息，也可以只是一次关于看山的诚实记录，不必压成唯一的道德答案。",
        prompt: "同一件事如果从两个不同位置观察，你可能分别看到什么？哪一个部分还需要继续了解？",
      },
    },
    background: "题壁诗以庐山为观察对象；地点关系明确，但不能由诗句推回具体题壁位置。",
    relatedPoemIds: ["lushan-wang-lushan-pubu", "west-lake-yin-hu-shang"],
    nextPlaceId: "yellow-crane",
    nextReason: "看完一座山的不同侧面，去江边的楼观察远处的帆和方向。",
    overrides: [
      titleOverride("题西林壁", "tí xī lín bì", "题壁表示写在墙壁上，题为动词；整题名按地点短语人工确认。"),
      override("line-1.token-1", "横", "héng", "‘横看’表示从横向、侧向观看。"),
      override("line-1.token-2", "看", "kàn", "此处为观看动词。"),
      override("line-1.token-5", "侧", "cè", "‘侧’表示侧面视角。"),
      override("line-3.token-2", "识", "shí", "‘不识’为认识、看清之意。"),
      override("line-4.token-1", "只", "zhǐ", "‘只缘’为只是因为。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceLushan, sourceLushanGovernment],
    reviewNotes: "宋诗与庐山关系、观看视角教学目标和‘识/只’语境读音已人工复核。",
  }),

  poem({
    id: "yellow-crane-huang-he-lou",
    title: "黄鹤楼",
    titlePinyin: "huáng hè lóu",
    author: "崔颢",
    authorPinyin: "Cuī Hào",
    dynasty: "唐",
    genre: "七言律诗",
    placeId: "yellow-crane",
    lines: [
      makeLine("line-1", "昔人已乘黄鹤去，", ["xī", "rén", "yǐ", "chéng", "huáng", "hè", "qù"]),
      makeLine("line-2", "此地空余黄鹤楼。", ["cǐ", "dì", "kōng", "yú", "huáng", "hè", "lóu"]),
      makeLine("line-3", "黄鹤一去不复返，", ["huáng", "hè", "yí", "qù", "bú", "fù", "fǎn"]),
      makeLine("line-4", "白云千载空悠悠。", ["bái", "yún", "qiān", "zǎi", "kōng", "yōu", "yōu"]),
      makeLine("line-5", "晴川历历汉阳树，", ["qíng", "chuān", "lì", "lì", "hàn", "yáng", "shù"]),
      makeLine("line-6", "芳草萋萋鹦鹉洲。", ["fāng", "cǎo", "qī", "qī", "yīng", "wǔ", "zhōu"]),
      makeLine("line-7", "日暮乡关何处是？", ["rì", "mù", "xiāng", "guān", "hé", "chù", "shì"]),
      makeLine("line-8", "烟波江上使人愁。", ["yān", "bō", "jiāng", "shàng", "shǐ", "rén", "chóu"]),
    ],
    placeRelations: [
      {
        targetId: "yellow-crane",
        type: "depicts_place",
        confidence: "high",
        assertion: "诗中直接写黄鹤楼、汉阳树和鹦鹉洲的江城景色。",
        childMeaning: "楼、江、树和洲在同一处远望风景里。",
      },
      {
        targetId: "yangtze",
        type: "regional_context",
        confidence: "medium_high",
        assertion: "黄鹤楼位于今天武汉长江南岸的现代参考位置；诗中江景是文化空间线索。",
        childMeaning: "站在江边的高处，能把视线送得很远。",
      },
    ],
    spatialLearning: {
      coreRelation: "riverfront-view-and-time",
      observation: "诗从传说中的高楼和黄鹤转到晴川、树、洲，最后落到日暮与乡愁。",
      mapAction: "从黄鹤楼向江对岸看汉阳，再找江上与洲的位置关系。",
      evidenceLineIds: ["line-2", "line-5", "line-6", "line-7", "line-8"],
      childTakeaway: "看见得越远，心里的故乡也可能被带出来。",
    },
    age: {
      young: {
        explanation: "高楼边有江、有树、有小洲。太阳快落山时，诗人看着远处，开始想家。",
        openingQuestion: "诗人最后是在看什么，还是在想什么？",
        hint: "找一找‘日暮’和‘乡关’。",
        followUp: "如果你站在高楼上，先看到江边的什么？",
        completionStandard: "说出至少一个江边景物和最后的想家感觉。",
        context: "先认识楼、江、树、洲，再接住乡愁。",
      },
      middle: {
        explanation: "中间四句把视线铺到汉阳树与鹦鹉洲，空间越开阔，结尾的故乡之愁越深。",
        openingQuestion: "为什么诗人先写晴川和芳草，最后才问‘乡关何处是’？",
        hint: "按地图顺序看楼、江对岸、洲和远方。",
        followUp: "日暮的光线变化怎样改变你对这幅江城图的感受？",
        completionStandard: "用景物展开与情绪转折解释诗的后半段。",
        context: "把临江地理、视线远近和乡愁放在同一条观察线上。",
      },
      older: {
        explanation: "前四句写传说与楼的空余，颈联转为清晰的现实江城，尾联从地理远望折入身份与乡关的追问。",
        openingQuestion: "‘白云千载空悠悠’与‘日暮乡关何处是’之间，时间和空间如何共同制造空茫？",
        hint: "看‘千载’的时间尺度和‘何处’的空间疑问。",
        followUp: "历史上的黄鹤楼位置有变化时，为什么诗仍能成为今天的江城文化记忆？",
        completionStandard: "从时间尺度、空间视线和情绪收束三方面完成短评。",
        context: "明确今天建筑点是现代锚点，不等于唐代楼址的精确复原。",
      },
    },
    interpretation: {
      summary: "诗人站在黄鹤楼一带，想到传说中乘黄鹤离去的人，又看见眼前的江、树和小洲。白云流过很久，太阳将落时，远望的江城景色让他想起故乡，生出空茫和愁绪。",
      lineMeanings: [
        { lineId: "line-1", meaning: "传说中那位过去的人已经乘着黄鹤离开了，留下一个遥远的故事。" },
        { lineId: "line-2", meaning: "这个地方如今只剩下黄鹤楼，‘空余’也带出传说离去后的空落感觉。" },
        { lineId: "line-3", meaning: "黄鹤一旦飞走就不再回来；这是诗中关于传说的感叹，不是对真实鸟类行踪的记录。" },
        { lineId: "line-4", meaning: "白云在天空中飘过许多年，显得悠长而空旷，也让人感到时间流逝。" },
        { lineId: "line-5", meaning: "天气晴朗时，江面开阔，汉阳一带的树木看得清清楚楚。" },
        { lineId: "line-6", meaning: "鹦鹉洲上芳草茂盛，江洲的春意铺在远望的景色里。" },
        { lineId: "line-7", meaning: "太阳快落山了，诗人望着远方，忍不住问自己的故乡到底在什么地方。" },
        { lineId: "line-8", meaning: "江面烟雾水波相连，暮色中的景象使诗人感到忧愁；愁绪来自人的心，不是江水真的会让人发愁。" },
      ],
      extension: {
        title: "一座楼的旧传说与眼前江城",
        text: "诗把传说中的黄鹤、留下的楼和眼前的江城放在一起：过去不断远去，景物却仍在眼前。结尾的乡愁并不是景物唯一的解释，而是诗人在日暮远望时产生的一种真实感受。",
        prompt: "当一个地方同时有旧故事和眼前的风景时，哪一个细节会让你想到过去或远方？为什么？",
      },
    },
    background: "作品与黄鹤楼、武汉江城形成经典文化关联；现代单元使用今天黄鹤楼现址，不将现楼等同唐代建筑。",
    relatedPoemIds: ["yellow-crane-song-meng-hao-ran", "chang-an-chun-wang"],
    nextPlaceId: "west-lake",
    nextReason: "从江城暮色的远望，去西湖观察天气如何改变同一片水面。",
    overrides: [
      titleOverride("黄鹤楼", "huáng hè lóu", "地名与楼名中的规范读音。"),
      override("line-1.token-4", "乘", "chéng", "‘乘黄鹤’为乘坐动词。"),
      override("line-2.token-3", "空", "kōng", "‘空余’表示只剩下、空空留下。"),
      override("line-3.token-3", "一", "yí", "‘一去’在去声前读阳平变调 yí。"),
      override("line-3.token-5", "不", "bú", "‘不复’中受后字去声影响，按普通话变调读 bú。"),
      override("line-4.token-4", "载", "zǎi", "‘千载’表示很多年，读 zǎi。"),
      override("line-7.token-5", "何", "hé", "‘何处’为疑问代词。"),
      override("line-8.token-5", "使", "shǐ", "‘使人愁’为使动用法。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceYellowCrane, sourceYellowCraneWuchang],
    reviewNotes: "八句原文、律诗换行、‘载/空/一’语境读音及古今黄鹤楼说明已人工复核。",
  }),

  poem({
    id: "yellow-crane-song-meng-hao-ran",
    title: "黄鹤楼送孟浩然之广陵",
    titlePinyin: "huáng hè lóu sòng Mèng Hào rán zhī Guǎng líng",
    author: "李白",
    authorPinyin: "Lǐ Bái",
    dynasty: "唐",
    genre: "七言绝句",
    placeId: "yellow-crane",
    lines: [
      makeLine("line-1", "故人西辞黄鹤楼，", ["gù", "rén", "xī", "cí", "huáng", "hè", "lóu"]),
      makeLine("line-2", "烟花三月下扬州。", ["yān", "huā", "sān", "yuè", "xià", "yáng", "zhōu"]),
      makeLine("line-3", "孤帆远影碧空尽，", ["gū", "fān", "yuǎn", "yǐng", "bì", "kōng", "jìn"]),
      makeLine("line-4", "唯见长江天际流。", ["wéi", "jiàn", "cháng", "jiāng", "tiān", "jì", "liú"]),
    ],
    placeRelations: [
      {
        targetId: "yellow-crane",
        type: "departure_place",
        confidence: "high",
        assertion: "诗题和首句明确把送别起点放在黄鹤楼。",
        childMeaning: "朋友从江边的楼出发。",
      },
      {
        targetId: "yangzhou",
        type: "destination_mentioned",
        confidence: "high",
        assertion: "诗句直接写扬州为朋友的目的地；本期扬州是地图外部参照，不伪装成完整地点。",
        childMeaning: "帆船沿江驶向更远的地方。",
      },
      {
        targetId: "yangtze",
        type: "river_imagery",
        confidence: "medium_high",
        assertion: "长江是诗中送别视线与远行想象的山河骨架。",
        childMeaning: "江水把朋友的船带到天边。",
      },
    ],
    spatialLearning: {
      coreRelation: "departure-direction-distance",
      observation: "楼是起点，扬州是远方，孤帆越远越小，最后只剩天际的江流。",
      mapAction: "在黄鹤楼与扬州之间画一条视线，标记起点、方向和变小的帆。",
      evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
      childTakeaway: "送别不是停在楼边，而是目光跟着船走远。",
    },
    age: {
      young: {
        explanation: "朋友从黄鹤楼出发去扬州。船越来越远，最后只看见长江向天边流。",
        openingQuestion: "小船是越来越近，还是越来越远？",
        hint: "找‘孤帆远影’。",
        followUp: "你会站在哪里送朋友？请指一指地图上的起点。",
        completionStandard: "说出黄鹤楼是起点、船向远方走中的一个关系。",
        context: "用船变小和江水流远感受送别。",
      },
      middle: {
        explanation: "诗把送别写成一条不断拉远的视线：黄鹤楼—扬州—孤帆—天际长江。",
        openingQuestion: "诗中哪些词让你看见距离在不断变远？",
        hint: "留意‘西辞、下、远影、天际’。",
        followUp: "‘唯见长江天际流’为什么比直接说‘我很难过’更有力量？",
        completionStandard: "借助地图方向和至少两个距离词复述视线变化。",
        context: "开始把江河当成连接人物和目的地的空间线。",
      },
      older: {
        explanation: "诗不直接写离愁，而让视线从楼到目的地、从可见孤帆到不可见人物，最后由长江承担持续流动的情感。",
        openingQuestion: "‘孤帆’和‘唯见’如何把送别情绪转化为视觉叙事？",
        hint: "比较‘远影碧空尽’和‘天际流’的主语变化。",
        followUp: "现代地图上可以连线，但为什么这条线不能称作李白真实走过的路线？",
        completionStandard: "区分诗内视线、现代地理关系和历史行程三种层次。",
        context: "保留扬州与长江的关系，但不把文化旅程线包装成历史导航。",
      },
    },
    interpretation: {
      summary: "李白在黄鹤楼为老朋友孟浩然送行。朋友在春天乘船顺江前往扬州，船影越走越远，最后消失在天边，只剩下长江还在流。诗没有直接说‘我很难过’，而是让目光跟着船走远，写出安静而深长的离情。",
      lineMeanings: [
        { lineId: "line-1", meaning: "老朋友在黄鹤楼同诗人告别，乘船离开了送别的地方。" },
        { lineId: "line-2", meaning: "春天三月，朋友顺江前往扬州；‘烟花’指春日烟霭和繁花般的景色，不是燃放的烟火。" },
        { lineId: "line-3", meaning: "江面上只剩一叶孤帆的远影，渐渐融进碧蓝的天空，直到看不见。" },
        { lineId: "line-4", meaning: "船影消失后，诗人还能看见的只有长江一直流向天边。" },
      ],
      extension: {
        title: "让目光替心情说话",
        text: "诗把送别写成一条不断拉远的视线：楼是起点，扬州是远方，孤帆变小，最后只剩江流。地图上的黄鹤楼—扬州连线帮助理解方向和距离，但不等于李白真实走过的精确路线。",
        prompt: "如果你要送一个朋友远行，你会用哪个正在变远的景物来表达自己的心情？",
      },
    },
    background: "作品写送别场景，起点为黄鹤楼，目的地为扬州；现代地图线只用于理解方向和距离，不是李白真实路线证据。",
    relatedPoemIds: ["yellow-crane-huang-he-lou", "lushan-wang-lushan-pubu"],
    nextPlaceId: "west-lake",
    nextReason: "看过江上的远行视线，去西湖看水面和天气的变化。",
    overrides: [
      titleOverride("黄鹤楼送孟浩然之广陵", "huáng hè lóu sòng Mèng Hào rán zhī Guǎng líng", "题名中的‘之广陵’与广陵地名读音整体人工确认。"),
      override("line-1.token-3", "西", "xī", "‘西辞’表示向西边告别楼。"),
      override("line-2.token-5", "下", "xià", "‘下扬州’在江路语境中表示顺流而下。"),
      override("line-3.token-6", "空", "kōng", "‘碧空’指澄碧天空。"),
      override("line-4.token-1", "唯", "wéi", "通行教材版本使用‘唯见’，读 wéi。"),
      override("line-4.token-3", "长", "cháng", "‘长江’地名水系名称，读 cháng。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceYellowCrane, sourceYellowCraneWuchang],
    reviewNotes: "‘唯/惟’版本采用教材常见‘唯见’；黄鹤楼—扬州—长江关系标为诗内目的地与现代参照，未宣称历史路线。",
  }),

  poem({
    id: "west-lake-yin-hu-shang",
    title: "饮湖上初晴后雨·其二",
    titlePinyin: "yǐn hú shàng chū qíng hòu yǔ qí èr",
    author: "苏轼",
    authorPinyin: "Sū Shì",
    dynasty: "宋",
    genre: "七言绝句",
    placeId: "west-lake",
    lines: [
      makeLine("line-1", "水光潋滟晴方好，", ["shuǐ", "guāng", "liàn", "yàn", "qíng", "fāng", "hǎo"]),
      makeLine("line-2", "山色空蒙雨亦奇。", ["shān", "sè", "kōng", "méng", "yǔ", "yì", "qí"]),
      makeLine("line-3", "欲把西湖比西子，", ["yù", "bǎ", "xī", "hú", "bǐ", "xī", "zǐ"]),
      makeLine("line-4", "淡妆浓抹总相宜。", ["dàn", "zhuāng", "nóng", "mǒ", "zǒng", "xiāng", "yí"]),
    ],
    placeRelations: [
      {
        targetId: "west-lake",
        type: "depicts_place",
        confidence: "high",
        assertion: "诗句直接写西湖在晴天和雨天中的不同面貌。",
        childMeaning: "同一个湖，天气一换，颜色和感觉也会换。",
      },
      {
        targetId: "hangzhou",
        type: "city_context",
        confidence: "high",
        assertion: "西湖是杭州的城市水面参照；诗不要求定位到某一处岸线。",
        childMeaning: "湖和城市一起成为杭州的诗境。",
      },
    ],
    spatialLearning: {
      coreRelation: "weather-transforms-landscape",
      observation: "晴天水光明亮，雨天山色朦胧；诗人以西施妆容比喻两种天气都合宜。",
      mapAction: "在西湖地图上切换晴与雨的观察卡，分别说出水面和山色变化。",
      evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
      childTakeaway: "美不只有一种样子，晴雨都能让西湖成立。",
    },
    age: {
      young: {
        explanation: "晴天的湖水亮闪闪，雨天的山像披上薄雾。晴天雨天，西湖都好看。",
        openingQuestion: "晴天和雨天，你分别看见了什么？",
        hint: "第一句看水光，第二句看山色。",
        followUp: "如果给晴天和雨天各选一种颜色，你会选什么？",
        completionStandard: "说出晴天水面或雨天山色的一种变化。",
        context: "用颜色和天气建立西湖的第一印象。",
      },
      middle: {
        explanation: "前两句并列晴雨，后两句用西施的淡妆浓抹作比，说明不同天气都合适。",
        openingQuestion: "诗人为什么不选晴天或雨天中的一个，而说‘总相宜’？",
        hint: "看‘亦’和‘总’怎样把两种天气连起来。",
        followUp: "地图能告诉你天气变化吗？诗句又补上了哪种地图看不见的感觉？",
        completionStandard: "解释晴雨对景物的不同作用，并说出比喻对象。",
        context: "把自然变化、城市湖面与审美感受连起来。",
      },
      older: {
        explanation: "诗先写感官层面的水光与山色，再以西施的淡妆浓抹转入审美判断；‘总相宜’不是抹平差异，而是承认差异各有成立之处。",
        openingQuestion: "西施比喻如何同时保留晴雨差异，又完成整体评价？",
        hint: "先找并列，再看‘比’与‘相宜’的逻辑。",
        followUp: "与《晓出净慈寺送林子方》比较，两首诗怎样选择西湖的不同观察时刻？",
        completionStandard: "用并列、比喻和评价三个层次完成比较说明。",
        context: "将西湖作为随天气变化的观察实验，不把审美评价变成唯一答案。",
      },
    },
    interpretation: {
      summary: "苏轼在西湖边饮酒，先看见晴天里闪耀的水光，又看见雨天里朦胧的山色。他把西湖比作美人西施：淡妆或浓妆都好看，就像晴天和雨天各有各的美。这里的‘相宜’是诗人的审美感受，不是唯一的评价标准。",
      lineMeanings: [
        { lineId: "line-1", meaning: "晴天时，西湖水面波光闪动，显得明亮美好。" },
        { lineId: "line-2", meaning: "下雨时，山色被雨雾笼住，显得朦胧，却也别有一番奇妙。" },
        { lineId: "line-3", meaning: "诗人想把西湖比作古代美人西施，用人的美来形容湖的美。" },
        { lineId: "line-4", meaning: "西施化淡妆或浓妆都合适；诗人借这个比喻说，西湖晴天和雨天都好看。" },
      ],
      extension: {
        title: "同一片湖的两种面貌",
        text: "诗先写晴与雨的具体景色，再用西施的妆容作比喻。它没有把美固定成一种样子，而是保留水光明亮和山色朦胧的差别，邀请读者感受各自的好。",
        prompt: "你喜欢晴天的西湖，还是雨天的西湖？请找诗中的一个细节，说明你的选择，也可以提出第三种答案。",
      },
    },
    background: "诗题说明饮酒于湖上，写初晴后雨的西湖；作品地点关系为描写西湖，不推断具体酒楼或岸边位置。",
    relatedPoemIds: ["west-lake-xiao-chu-jing-ci-si", "lushan-ti-xi-lin-bi"],
    nextPlaceId: "chengdu",
    nextReason: "从西湖的晴雨颜色，去成都听一场夜里悄悄落下的春雨。",
    overrides: [
      titleOverride("饮湖上初晴后雨·其二", "yǐn hú shàng chū qíng hòu yǔ qí èr", "题名中‘饮’为饮酒之意，整题名人工确认。"),
      override("line-1.token-3", "潋", "liàn", "‘潋滟’为水面波光闪动的词语。"),
      override("line-1.token-4", "滟", "yàn", "‘潋滟’第二字的规范读音。"),
      override("line-1.token-7", "好", "hǎo", "‘方好’表示正好、美好。"),
      override("line-2.token-3", "空", "kōng", "‘空蒙’表示迷茫、朦胧的样子。"),
      override("line-3.token-2", "把", "bǎ", "‘把西湖比西子’为介词结构。"),
      override("line-4.token-4", "抹", "mǒ", "‘淡妆浓抹’中为涂抹、施妆的动词。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceWestLake],
    reviewNotes: "题名异文统一为‘饮湖上初晴后雨·其二’；潋滟、空蒙、抹等词语读音与晴雨空间引导已人工复核。",
  }),

  poem({
    id: "west-lake-xiao-chu-jing-ci-si",
    title: "晓出净慈寺送林子方",
    titlePinyin: "xiǎo chū Jìng cí sì sòng Lín Zǐ fāng",
    author: "杨万里",
    authorPinyin: "Yáng Wàn lǐ",
    dynasty: "宋",
    genre: "七言绝句",
    placeId: "west-lake",
    lines: [
      makeLine("line-1", "毕竟西湖六月中，", ["bì", "jìng", "xī", "hú", "liù", "yuè", "zhōng"]),
      makeLine("line-2", "风光不与四时同。", ["fēng", "guāng", "bù", "yǔ", "sì", "shí", "tóng"]),
      makeLine("line-3", "接天莲叶无穷碧，", ["jiē", "tiān", "lián", "yè", "wú", "qióng", "bì"]),
      makeLine("line-4", "映日荷花别样红。", ["yìng", "rì", "hé", "huā", "bié", "yàng", "hóng"]),
    ],
    placeRelations: [
      {
        targetId: "west-lake",
        type: "depicts_place",
        confidence: "high",
        assertion: "诗句直接描写六月西湖的莲叶与荷花。",
        childMeaning: "湖面很宽，莲叶像连到天边。",
      },
      {
        targetId: "jingci-temple",
        type: "viewpoint_reference",
        confidence: "medium_high",
        assertion: "题名把出发视点放在净慈寺，地点作为诗境入口而非精确坐标。",
        childMeaning: "从寺门出来，眼前突然打开一片湖。",
      },
    ],
    spatialLearning: {
      coreRelation: "near-to-far-seasonal-scale",
      observation: "题名先给出清晨出寺的近处视点，诗句迅速推向接天莲叶的远处尺度，再落到映日荷花的颜色。",
      mapAction: "从净慈寺参考点向湖面拉远，观察‘接天’如何把视野变大。",
      evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
      childTakeaway: "从门口走出来，湖和荷叶一下子铺到天边。",
    },
    age: {
      young: {
        explanation: "六月的西湖有一大片碧绿莲叶，还有映着太阳的红荷花。",
        openingQuestion: "哪一种颜色先来到你眼前：绿莲叶还是红荷花？",
        hint: "找‘碧’和‘红’。",
        followUp: "请用手臂画出‘接天’的范围。",
        completionStandard: "说出莲叶或荷花的颜色和一个画面动作。",
        context: "从颜色和范围感进入夏天的西湖。",
      },
      middle: {
        explanation: "诗从六月和四时的季节判断开始，随后把空间拉到接天莲叶，再用映日荷花收束颜色。",
        openingQuestion: "‘接天’让西湖看起来有多大？它和‘映日’分别写了什么？",
        hint: "一个写范围，一个写光线与颜色。",
        followUp: "为什么先写莲叶的绿，再写荷花的红？",
        completionStandard: "用季节、空间范围、颜色三个线索复述全诗。",
        context: "练习把题名的视点和诗句的远近层次连起来。",
      },
      older: {
        explanation: "前两句以‘毕竟’与‘不与’提出六月的独特性，三四句用接天的横向延展和映日的垂直光线完成视觉放大。",
        openingQuestion: "这首诗如何用空间尺度与色彩对照证明‘六月中’的不同？",
        hint: "比较莲叶的无穷碧与荷花的别样红。",
        followUp: "与苏轼的晴雨西湖比较，杨万里选择了怎样的观察时刻和视觉语法？",
        completionStandard: "从季节、视点、尺度、色彩和结构中选择三项进行比较。",
        context: "保留净慈寺为诗题视点，但不把它简化为精确的景区路线。",
      },
    },
    interpretation: {
      summary: "杨万里清晨从净慈寺出来送林子方，眼前正是六月的西湖。六月的景色和其他季节不同：碧绿莲叶铺向天边，阳光照着荷花，红得格外鲜明。‘接天’是把视野写得很开阔的夸张，不是莲叶真的碰到了天空。",
      lineMeanings: [
        { lineId: "line-1", meaning: "说到底，这里是六月里的西湖，诗人先点明了观察的季节和地方。" },
        { lineId: "line-2", meaning: "六月西湖的风光，和一年中其他时节看到的样子不相同。" },
        { lineId: "line-3", meaning: "莲叶一片连着一片，碧绿得没有尽头，好像一直铺到了天边；这是视觉上的夸张。" },
        { lineId: "line-4", meaning: "太阳映照下的荷花呈现出特别鲜明的红色，和满湖的绿叶相映成景。" },
      ],
      extension: {
        title: "季节会改变同一个地方",
        text: "诗从‘六月’出发，把清晨出寺的近处视点迅速推向接天的远景，再用绿叶和红花收住画面。它可以让我们思考：同一个地方在不同季节、光线和心情里，会不会变成不同的地方。",
        prompt: "如果你在同一个地方观察春天、夏天和冬天，你会分别记录什么颜色或声音？",
      },
    },
    background: "题名交代清晨从净慈寺出来送林子方；作品描写六月西湖，净慈寺作为视点参考，不推断精确步行路线。",
    relatedPoemIds: ["west-lake-yin-hu-shang", "chengdu-jueju-two-orioles"],
    nextPlaceId: "chengdu",
    nextReason: "从六月西湖的明亮色彩，去成都听春夜的细雨和看远山。",
    overrides: [
      titleOverride("晓出净慈寺送林子方", "xiǎo chū Jìng cí sì sòng Lín Zǐ fāng", "净慈寺与林子方专名读音按题名整体人工确认。"),
      override("line-1.token-5", "六", "liù", "六月的月份读音。"),
      override("line-2.token-4", "与", "yǔ", "‘不与四时同’中为和、跟。"),
      override("line-2.token-6", "时", "shí", "‘四时’表示四季。"),
      override("line-3.token-4", "叶", "yè", "莲叶的词语读音。"),
      override("line-4.token-3", "荷", "hé", "荷花的名物读音。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceWestLake],
    reviewNotes: "七言绝句文本、‘净慈寺’专名拼音和六月西湖空间观察结构已人工复核。",
  }),

  poem({
    id: "chengdu-chun-ye-xi-yu",
    title: "春夜喜雨",
    titlePinyin: "chūn yè xǐ yǔ",
    author: "杜甫",
    authorPinyin: "Dù Fǔ",
    dynasty: "唐",
    genre: "五言律诗",
    placeId: "chengdu",
    lines: [
      makeLine("line-1", "好雨知时节，", ["hǎo", "yǔ", "zhī", "shí", "jié"]),
      makeLine("line-2", "当春乃发生。", ["dāng", "chūn", "nǎi", "fā", "shēng"]),
      makeLine("line-3", "随风潜入夜，", ["suí", "fēng", "qián", "rù", "yè"]),
      makeLine("line-4", "润物细无声。", ["rùn", "wù", "xì", "wú", "shēng"]),
      makeLine("line-5", "野径云俱黑，", ["yě", "jìng", "yún", "jù", "hēi"]),
      makeLine("line-6", "江船火独明。", ["jiāng", "chuán", "huǒ", "dú", "míng"]),
      makeLine("line-7", "晓看红湿处，", ["xiǎo", "kàn", "hóng", "shī", "chù"]),
      makeLine("line-8", "花重锦官城。", ["huā", "zhòng", "jǐn", "guān", "chéng"]),
    ],
    placeRelations: [
      {
        targetId: "chengdu",
        type: "written_at_context",
        confidence: "medium",
        assertion: "作品与杜甫成都草堂时期形成强文化关联，具体写作位置与日期不在本层断言。",
        childMeaning: "夜雨落在成都的春天里。",
      },
      {
        targetId: "jinjiang-or-min-river",
        type: "regional_context",
        confidence: "medium",
        assertion: "野径、江船与锦官城共同构成成都平原的夜雨空间；不把单句江船定位为确切河段。",
        childMeaning: "田野和江边的灯，陪着春雨一起亮起来。",
      },
    ],
    spatialLearning: {
      coreRelation: "weather-sound-night-to-dawn",
      observation: "雨从夜里悄悄进入，先无声润物，再从云黑、船火写出夜景，最后在清晨看到湿花。",
      mapAction: "沿成都—田野—江船—锦官城四个空间词走一遍，把夜到晓的时间线连起来。",
      evidenceLineIds: ["line-3", "line-4", "line-5", "line-6", "line-7", "line-8"],
      childTakeaway: "小雨不喧哗，却能让一座城在清晨变得湿润。",
    },
    age: {
      young: {
        explanation: "春雨趁夜里轻轻来到，不吵不闹地把花草浇湿。天亮时，锦官城的花更鲜了。",
        openingQuestion: "这场雨是大声下，还是轻轻下？",
        hint: "找‘潜入夜’和‘细无声’。",
        followUp: "你能用很轻的动作演一演这场雨吗？",
        completionStandard: "说出雨的声音特点和天亮后的一个变化。",
        context: "先用听觉和动作感受春雨，再认识成都。",
      },
      middle: {
        explanation: "诗把成都春雨写成一条时间线：夜里潜入、润物无声，江船火独明，清晨花湿而重。",
        openingQuestion: "你能按‘夜里—江边—天亮’排列诗里的画面吗？",
        hint: "看‘夜、黑、明、晓’。",
        followUp: "为什么‘江船火独明’能让你更感觉夜很深？",
        completionStandard: "用时间和空间两个维度讲清雨怎样改变成都。",
        context: "把声音、光线、田野和城市放入同一幅夜雨地图。",
      },
      older: {
        explanation: "诗以人格化的‘好雨知时节’起兴，随后从无声的润物推进到黑与明的夜景对照，末联以‘红湿’把效果延迟到晓时显现。",
        openingQuestion: "为什么诗直到最后才展示雨的结果？这种延迟怎样制造喜悦？",
        hint: "看‘潜入—无声—独明—晓看’的动静与时间推进。",
        followUp: "‘花重’读 zhòng 而非 chóng 时，如何改变画面？",
        completionStandard: "结合时间结构、感官对照与语境读音完成分析。",
        context: "将成都定位为城市级文化关联，不把草堂窗外或江船位置说成精确事实。",
      },
    },
    interpretation: {
      summary: "春天的好雨在合适的时节来到，跟着风悄悄进入夜里，安静地滋润万物。诗人又写夜里的田野、江船灯火和清晨被雨打湿的花，把一场不喧闹却有作用的春雨写成成都的喜悦。‘好雨知时节’是欢迎雨水的拟人说法，不是雨真的会思考。",
      lineMeanings: [
        { lineId: "line-1", meaning: "这场雨来得正好，正是春天需要雨水的时候；‘知时节’是诗人喜爱它的拟人说法。" },
        { lineId: "line-2", meaning: "雨在春天开始落下，给正在生长的草木带来滋润。" },
        { lineId: "line-3", meaning: "雨跟着风，悄悄地在夜里来到，不惊动人。" },
        { lineId: "line-4", meaning: "细雨无声地滋润万物，‘细无声’写它轻柔安静的特点。" },
        { lineId: "line-5", meaning: "田野小路上乌云聚拢，四周都显得黑沉沉的。" },
        { lineId: "line-6", meaning: "江面上的船被夜色包围，只有船上的灯独自明亮。" },
        { lineId: "line-7", meaning: "天亮后回头看，红色的花朵都被春雨打湿了。" },
        { lineId: "line-8", meaning: "花上带着雨水，花枝仿佛变得沉重；成都在雨后的清晨呈现出湿润的春色。" },
      ],
      extension: {
        title: "安静发生的改变",
        text: "诗没有一开始就展示花朵的结果，而是让雨从夜里潜入，经过无声、黑暗和一点船火，到清晨才看见花的变化。它可以让人想到许多不喧哗的照料如何慢慢产生效果，但不必把它解释成唯一的做人道理。",
        prompt: "你见过哪些‘声音很小、变化却很明显’的事情？可以是雨，也可以是生活里的其他事情。",
      },
    },
    background: "通常认为诗作于杜甫成都草堂时期；单元保留‘写于成都语境’的中等置信度，不推断具体夜雨观察点。",
    relatedPoemIds: ["chengdu-jueju-two-orioles", "west-lake-xiao-chu-jing-ci-si"],
    nextPlaceId: "chang-an",
    nextReason: "从成都的春雨和城市光线，回到长安理解杜甫诗中的时代与城市。",
    overrides: [
      titleOverride("春夜喜雨", "chūn yè xǐ yǔ", "题名中的季节、时间与情绪整体人工确认。"),
      override("line-1.token-4", "时", "shí", "‘时节’表示季节与时令。"),
      override("line-2.token-3", "乃", "nǎi", "‘乃发生’表示于是、才开始发生。"),
      override("line-3.token-3", "潜", "qián", "‘潜入夜’表示悄悄进入夜里。"),
      override("line-4.token-2", "物", "wù", "‘润物’指滋润万物。"),
      override("line-5.token-4", "俱", "jù", "‘云俱黑’表示都变黑。"),
      override("line-7.token-2", "看", "kàn", "‘晓看’为清晨观看。"),
      override("line-8.token-2", "重", "zhòng", "‘花重’指花朵沾雨后沉重，不读 chóng。"),
      override("line-8.token-5", "城", "chéng", "‘锦官城’为成都文学称呼。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceChengdu],
    reviewNotes: "‘花重’语境读 zhòng、成都文化关联置信度和夜雨时间线已人工复核。",
  }),

  poem({
    id: "chengdu-jueju-two-orioles",
    title: "绝句（两个黄鹂鸣翠柳）",
    titlePinyin: "jué jù liǎng gè huáng lí míng cuì liǔ",
    author: "杜甫",
    authorPinyin: "Dù Fǔ",
    dynasty: "唐",
    genre: "七言绝句",
    placeId: "chengdu",
    lines: [
      makeLine("line-1", "两个黄鹂鸣翠柳，", ["liǎng", "gè", "huáng", "lí", "míng", "cuì", "liǔ"]),
      makeLine("line-2", "一行白鹭上青天。", ["yì", "háng", "bái", "lù", "shàng", "qīng", "tiān"]),
      makeLine("line-3", "窗含西岭千秋雪，", ["chuāng", "hán", "xī", "lǐng", "qiān", "qiū", "xuě"]),
      makeLine("line-4", "门泊东吴万里船。", ["mén", "bó", "dōng", "wú", "wàn", "lǐ", "chuán"]),
    ],
    placeRelations: [
      {
        targetId: "chengdu",
        type: "written_at_context",
        confidence: "medium",
        assertion: "作品与成都草堂时期形成常见文化关联，具体窗口位置不作精确断言。",
        childMeaning: "近处柳树和窗门里，能看见很远的山与船。",
      },
      {
        targetId: "xiling-mountain",
        type: "landscape_mentioned",
        confidence: "medium_high",
        assertion: "‘西岭’是诗中远山景物；它不是成都城内的精确点位。",
        childMeaning: "窗子像一幅画框，把远山装进来。",
      },
      {
        targetId: "yangtze-waterway",
        type: "waterway_imagery",
        confidence: "medium",
        assertion: "‘东吴万里船’写出远行水路想象，不等同诗人实际路线。",
        childMeaning: "门边的船把视线带去万里之外。",
      },
    ],
    spatialLearning: {
      coreRelation: "window-frame-near-far",
      observation: "黄鹂、翠柳、白鹭在近处和高处，西岭雪与东吴船在远处；窗、门成为两种取景框。",
      mapAction: "把近景柳树、中景窗门、远景西岭和水路分成四层。",
      evidenceLineIds: ["line-1", "line-2", "line-3", "line-4"],
      childTakeaway: "一扇窗、一扇门，都能把很远的山河带到眼前。",
    },
    age: {
      young: {
        explanation: "柳树上有黄鹂，天上有白鹭；窗里能看到雪山，门边停着远行的船。",
        openingQuestion: "哪些景物离窗门近，哪些在很远的地方？",
        hint: "先找柳树和白鹭，再看西岭和船。",
        followUp: "用手指框出你心里的‘窗含’画面。",
        completionStandard: "分清一个近处景物和一个远处景物。",
        context: "用取景框游戏建立近远层次。",
      },
      middle: {
        explanation: "诗用黄鹂、白鹭的动静打开视线，再用窗与门把西岭雪和东吴船放进同一座草堂的生活空间。",
        openingQuestion: "‘窗含’和‘门泊’怎样把远山与远行放进近处生活？",
        hint: "比较窗和门两个位置词。",
        followUp: "这首诗的远景为什么不会把近处的小鸟和柳树挤掉？",
        completionStandard: "按近景—高处—远山—水路讲出四层空间。",
        context: "练习用生活空间理解成都草堂的开放视野。",
      },
      older: {
        explanation: "全诗以成对意象展开：黄鹂/白鹭、翠柳/青天、窗/门、西岭/东吴；空间由院内推向高空、远山和万里水路。",
        openingQuestion: "这些对偶如何同时制造秩序感和空间扩张？",
        hint: "标出颜色、方向、数量和位置词。",
        followUp: "‘东吴万里’是地理事实、诗歌想象，还是两者叠加？请说明证据边界。",
        completionStandard: "从对偶、方向与近远层次完成一次有证据的空间阅读。",
        context: "强调西岭与东吴是诗中景物和远行想象，不擅自还原具体观察点。",
      },
    },
    interpretation: {
      summary: "诗人先看到近处翠柳上的黄鹂和高空飞翔的白鹭，再从窗里望见西岭的千秋积雪，从门边望见来自东吴的万里船。小鸟、天空、远山和远行被放进一间屋子的视野里，‘千秋’和‘万里’都在扩大画面的时间与距离感。",
      lineMeanings: [
        { lineId: "line-1", meaning: "两只黄鹂停在翠绿的柳树间鸣叫，近处先传来清脆的声音。" },
        { lineId: "line-2", meaning: "一行白鹭排成队飞向青蓝的天空，视线从柳树抬到了高处。" },
        { lineId: "line-3", meaning: "从窗里看去，远处西岭的积雪像保存了很久很久；‘千秋’强调久远的感觉，不是精确计年。" },
        { lineId: "line-4", meaning: "门外停着从东吴方向来的远行船，‘万里’写出路途遥远和视野开阔的想象。" },
      ],
      extension: {
        title: "一间屋子的四个取景框",
        text: "诗从柳树和鸟的近景写起，向上写天空，向远处写雪山和水路。窗和门像两个取景框，把日常生活与很远的山河放在同一幅画里；远景是诗歌的空间想象，不等同一条已经核实的个人旅行路线。",
        prompt: "从你的窗边或门口看出去，你能找到一个近景、一个高处景物和一个远处景物吗？它们怎样组成一幅图？",
      },
    },
    background: "作品常与杜甫成都草堂时期相联系；诗内远山、水路和方向是空间学习线索，不是可验证的个人行程。",
    relatedPoemIds: ["chengdu-chun-ye-xi-yu", "lushan-wang-lushan-pubu"],
    nextPlaceId: "chang-an",
    nextReason: "从成都窗门里的开阔视野，去长安看城市与时代怎样进入诗里。",
    overrides: [
      titleOverride("绝句（两个黄鹂鸣翠柳）", "jué jù liǎng gè huáng lí míng cuì liǔ", "题名为体裁加首句辨识语，整体人工确认。"),
      override("line-1.token-1", "两", "liǎng", "数量词‘两个’中的规范读音。"),
      override("line-2.token-1", "一", "yì", "‘一行’在阳平前读去声变调 yì。"),
      override("line-2.token-2", "行", "háng", "‘一行白鹭’中指一列，读 háng。"),
      override("line-3.token-5", "千", "qiān", "‘千秋雪’表示长久的积雪。"),
      override("line-4.token-2", "泊", "bó", "‘门泊’为停泊动词，读 bó。"),
      override("line-4.token-5", "万", "wàn", "‘万里’为距离夸张。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceChengdu],
    reviewNotes: "题名、‘一行’读 háng、‘泊’读 bó、东吴远行想象与成都文化关联已人工复核。",
  }),

  poem({
    id: "chang-an-chun-wang",
    title: "春望",
    titlePinyin: "chūn wàng",
    author: "杜甫",
    authorPinyin: "Dù Fǔ",
    dynasty: "唐",
    genre: "五言律诗",
    placeId: "chang-an",
    lines: [
      makeLine("line-1", "国破山河在，", ["guó", "pò", "shān", "hé", "zài"]),
      makeLine("line-2", "城春草木深。", ["chéng", "chūn", "cǎo", "mù", "shēn"]),
      makeLine("line-3", "感时花溅泪，", ["gǎn", "shí", "huā", "jiàn", "lèi"]),
      makeLine("line-4", "恨别鸟惊心。", ["hèn", "bié", "niǎo", "jīng", "xīn"]),
      makeLine("line-5", "烽火连三月，", ["fēng", "huǒ", "lián", "sān", "yuè"]),
      makeLine("line-6", "家书抵万金。", ["jiā", "shū", "dǐ", "wàn", "jīn"]),
      makeLine("line-7", "白头搔更短，", ["bái", "tóu", "sāo", "gèng", "duǎn"]),
      makeLine("line-8", "浑欲不胜簪。", ["hún", "yù", "bù", "shēng", "zān"]),
    ],
    placeRelations: [
      {
        targetId: "chang-an",
        type: "historical_association",
        confidence: "medium_high",
        assertion: "作品通常置于安史之乱中长安陷落的历史语境，具体写作位置不作精确断言。",
        childMeaning: "城市、山河和诗人的牵挂同时出现。",
      },
      {
        targetId: "wei-river",
        type: "regional_context",
        confidence: "medium",
        assertion: "长安位于关中平原与渭水区域；诗句没有直接写渭水，因此只作区域参照。",
        childMeaning: "历史城市也有山河和生活的底色。",
      },
    ],
    spatialLearning: {
      coreRelation: "city-landscape-war-time",
      observation: "诗把山河仍在与城中草木深并置，再从花鸟、烽火、家书推进到个人白发。",
      mapAction: "在长安城市参考点旁标出城、山河、家书去向和三月时间，注意地图不显示战事细节。",
      evidenceLineIds: ["line-1", "line-2", "line-5", "line-6", "line-7", "line-8"],
      childTakeaway: "城市会受时代改变，但山河和人的牵挂仍在。",
    },
    age: {
      young: {
        explanation: "城里经历了不安，可山河还在、草木也在。诗人想念家人，头发也因为忧愁变短了。",
        openingQuestion: "诗里哪些东西还在，哪些事情让人难过？",
        hint: "看看‘山河在’和‘家书’。",
        followUp: "你会把哪一句画成一座城市？",
        completionStandard: "说出山河仍在和思念家人中的一个对比。",
        context: "不展开复杂战争细节，先理解城市与人的情绪。",
      },
      middle: {
        explanation: "‘国破’与‘山河在’形成强烈对照，城中春色不再只是美景，而被烽火、家书和离别重新染上忧愁。",
        openingQuestion: "同样是春天，为什么这首诗里的花鸟会让人落泪？",
        hint: "比较‘感时’和‘恨别’。",
        followUp: "地图上的长安只是一个点，诗怎样让它变成有家人、有消息等待的城市？",
        completionStandard: "用两个对比说明自然景物如何承载时代情绪。",
        context: "开始连接历史城市、时间和普通人的等待。",
      },
      older: {
        explanation: "诗以国与城、山河与草木、花鸟与泪、烽火与家书层层推进，从公共秩序的破坏收束到身体细节的白发。",
        openingQuestion: "尾联为什么把宏大的战乱落到‘白头’和‘簪’？",
        hint: "观察空间尺度如何从国城收缩到人的头发。",
        followUp: "如何在不把历史日期和写作地点说死的前提下，解释长安作为时代空间的作用？",
        completionStandard: "完成一次从空间尺度、意象对照和历史不确定性出发的短分析。",
        context: "长安对应今西安一带，是历史城市区域而非唐代城界精确复原。",
      },
    },
    interpretation: {
      summary: "战乱破坏了长安的城市生活，但山河还在，城里的草木也在春天长得很深。杜甫看到花鸟，想到动荡的时局和与家人分离；连绵的战火让一封家书格外珍贵，忧愁也写到了自己的白发。诗写的是战争中的普通牵挂，不是把战乱当成热闹的故事。",
      lineMeanings: [
        { lineId: "line-1", meaning: "战乱使国家和城市遭到破坏，但山河大地依然存在。" },
        { lineId: "line-2", meaning: "春天来到城里，草木长得又深又密，也让人感觉城市少了人声和照料。" },
        { lineId: "line-3", meaning: "想到动荡的时局，眼前的花也让诗人伤心得流泪；‘花溅泪’是人的感情投向景物，不是花真的会流泪。" },
        { lineId: "line-4", meaning: "想到亲人离散，鸟的鸣叫反而让诗人的心受到惊动；这里写的是忧伤中的听觉感受。" },
        { lineId: "line-5", meaning: "战争的烽火和消息连续了好几个月，局势一直没有平静下来。" },
        { lineId: "line-6", meaning: "在长期分离中，一封家人的来信珍贵得像价值万金；‘万金’是夸张，表达牵挂，不是在标价。" },
        { lineId: "line-7", meaning: "诗人忧愁得不停抓挠白发，头发看起来越来越稀短。" },
        { lineId: "line-8", meaning: "白发太少、太短，几乎连簪子都插不住；‘胜’是承受得住，写出忧愁和衰老带来的身体感觉。" },
      ],
      extension: {
        title: "把时代写进一封家书",
        text: "全诗的尺度从国家、城市和山河，慢慢缩到花鸟、家书，最后落到一个人的白发。它让我们看见战争不只发生在地图和史书上，也会进入普通人的等待、思念和日常身体感受；这种理解不需要把苦难解释成单一的励志答案。",
        prompt: "如果一座城市正在经历很大的变化，你会用哪一个普通人的物件或动作来写出他们的牵挂？",
      },
    },
    background: "作品常置于安史之乱时期的长安历史语境；本单元展示时代背景与城市区域，不断言具体写作点或路线。",
    relatedPoemIds: ["chang-an-zi-ye-wu-ge-qiu-ge", "chengdu-chun-ye-xi-yu"],
    nextPlaceId: "lushan",
    nextReason: "从长安的时代与城市，再回到庐山，用山水诗重新找回观看。",
    overrides: [
      titleOverride("春望", "chūn wàng", "题名中的春日远望语境整体人工确认。"),
      override("line-1.token-2", "破", "pò", "‘国破’表示国家遭受破坏。"),
      override("line-2.token-5", "深", "shēn", "‘草木深’表示草木茂盛、荒深。"),
      override("line-3.token-2", "时", "shí", "‘感时’指感伤时局。"),
      override("line-5.token-4", "三", "sān", "‘三月’表示连续多月。"),
      override("line-6.token-3", "抵", "dǐ", "‘家书抵万金’为抵得上。"),
      override("line-7.token-3", "搔", "sāo", "‘搔’为抓挠头发的动作。"),
      override("line-7.token-4", "更", "gèng", "‘更短’表示更加短。"),
      override("line-8.token-3", "不", "bù", "‘不胜’中‘胜’取 shēng（承受）义，前字不发生四声前变调。"),
      override("line-8.token-4", "胜", "shēng", "‘不胜簪’表示承受不住簪子，读 shēng。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceChangAn],
    reviewNotes: "安史之乱长安语境、‘胜’读 shēng、宏观城市到个人身体的空间层级已人工复核。",
  }),

  poem({
    id: "chang-an-zi-ye-wu-ge-qiu-ge",
    title: "子夜吴歌·秋歌",
    titlePinyin: "zǐ yè Wú gē qiū gē",
    author: "李白",
    authorPinyin: "Lǐ Bái",
    dynasty: "唐",
    genre: "乐府诗",
    placeId: "chang-an",
    lines: [
      makeLine("line-1", "长安一片月，", ["cháng", "ān", "yí", "piàn", "yuè"]),
      makeLine("line-2", "万户捣衣声。", ["wàn", "hù", "dǎo", "yī", "shēng"]),
      makeLine("line-3", "秋风吹不尽，", ["qiū", "fēng", "chuī", "bú", "jìn"]),
      makeLine("line-4", "总是玉关情。", ["zǒng", "shì", "yù", "guān", "qíng"]),
      makeLine("line-5", "何日平胡虏，", ["hé", "rì", "píng", "hú", "lǔ"]),
      makeLine("line-6", "良人罢远征。", ["liáng", "rén", "bà", "yuǎn", "zhēng"]),
    ],
    placeRelations: [
      {
        targetId: "chang-an",
        type: "mentions_place",
        confidence: "high",
        assertion: "诗首句直接写长安月色与万户捣衣声。",
        childMeaning: "一座城在同一轮月下有许多人的声音。",
      },
      {
        targetId: "yumen-pass",
        type: "imagined_frontier",
        confidence: "medium_high",
        assertion: "玉关是诗中思念远征亲人的边关意象；不是本单元可验证的个人行程。",
        childMeaning: "思念从城里的月光伸向很远的边关。",
      },
    ],
    spatialLearning: {
      coreRelation: "city-to-frontier-emotional-distance",
      observation: "月光和捣衣声留在长安，秋风不断把玉关与远征的情绪带进城中。",
      mapAction: "从长安向西北方向看玉关参考方向，标出‘眼前的声音’与‘想象的远方’。",
      evidenceLineIds: ["line-1", "line-2", "line-3", "line-4", "line-6"],
      childTakeaway: "地图上的远方，也可以被月光和声音连接起来。",
    },
    age: {
      young: {
        explanation: "长安城里月光照着家家户户，大家敲打衣服的声音传开了。有人想念远方出征的亲人。",
        openingQuestion: "你听见的是一个人的声音，还是很多户人家的声音？",
        hint: "找‘万户’。",
        followUp: "月光能不能把长安和远方连起来？说说你的想象。",
        completionStandard: "说出城里很多人的声音和远方思念。",
        context: "从声音数量与月光画面进入古代城市生活。",
      },
      middle: {
        explanation: "长安的月色、万户捣衣声和玉关远征构成一条情绪距离：眼前越具体，远方越牵挂。",
        openingQuestion: "为什么诗写的是长安的声音，却想到玉关？",
        hint: "找‘秋风吹不尽’和‘玉关情’。",
        followUp: "地图上没有声音，诗怎样让你‘听见’一座城？",
        completionStandard: "用长安、声音、玉关三个线索解释思念如何移动。",
        context: "学习把感官线索和地理方向连接起来。",
      },
      older: {
        explanation: "乐府旧题的秋夜场景将公共城市声音转化为边关思念；‘秋风吹不尽’既是季节动作，也是情感无法终止的隐喻。",
        openingQuestion: "诗如何从万户共同的劳作声推进到‘良人’的个体关系？",
        hint: "留意‘万户’的集体尺度与‘良人’的单人尺度。",
        followUp: "‘玉关’是诗中想象的方向，不等于李白本人正在那里；为什么这个区分重要？",
        completionStandard: "区分诗内地理意象、历史城市和诗人行程三种证据。",
        context: "长安与玉关用于建立文明地图的远近感，不制造李白边关路线。",
      },
    },
    interpretation: {
      summary: "秋夜的月光照着长安，许多家户传来捣衣声——人们在准备衣物，也牵挂着远方征人的冷暖。秋风吹不散这种思念，诗人于是问：什么时候战争才能平息，远征的人才能回来？诗把一座城的共同声音写成许多家庭的真实处境，既有边关距离，也有普通人的等待。",
      lineMeanings: [
        { lineId: "line-1", meaning: "一轮秋月的光铺在长安城上，整座城都被同一片月色照着。" },
        { lineId: "line-2", meaning: "许多家户传来捶打、整理衣物的声音，常被理解为为远方亲人准备寒衣；‘捣衣’不是轻松的游戏。" },
        { lineId: "line-3", meaning: "秋风一阵阵吹来，却怎么也吹不尽人们心里的牵挂。" },
        { lineId: "line-4", meaning: "这些不断的思念，最后都汇成了对玉门关一带边地和远征亲人的感情；‘玉关’是诗中的边关意象。" },
        { lineId: "line-5", meaning: "诗人问什么时候才能平定边患、结束这场长期的征战；问句里也含着对安宁的盼望。" },
        { lineId: "line-6", meaning: "什么时候远征在外的人才能停止长途征战，回到家人身边；这里的‘良人’主要指远征在外的丈夫。" },
      ],
      extension: {
        title: "从一座城听见许多家庭",
        text: "月光是共同的，捣衣声却来自一户又一户人家。诗先写集体的城市声音，再落到‘良人’这个具体的人，说明宏大的边关和战争，最终会变成家人等待消息、准备衣物、盼望平安的生活。",
        prompt: "同一轮月光下，不同的人可能各自想着什么？你能从一个声音或物件，讲出其中一户人家的故事吗？",
      },
    },
    background: "《子夜吴歌·秋歌》写长安秋夜与边关思念；玉关是诗内边关意象，不把它升级为李白的具体行程。",
    relatedPoemIds: ["chang-an-chun-wang", "yellow-crane-huang-he-lou"],
    nextPlaceId: "lushan",
    nextReason: "从长安的月光和远方思念，回到庐山，把视线放回眼前的山水。",
    overrides: [
      titleOverride("子夜吴歌·秋歌", "zǐ yè Wú gē qiū gē", "吴歌为乐府题名中的地域名称，题名整体使用专名拼音。"),
      override("line-1.token-3", "一", "yí", "‘一片’在去声前读阳平变调 yí。"),
      override("line-2.token-3", "捣", "dǎo", "‘捣衣’为捶打衣物的动词。"),
      override("line-3.token-4", "不", "bú", "‘不尽’中受后字去声影响，按普通话变调读 bú。"),
      override("line-3.token-5", "尽", "jìn", "‘吹不尽’表示不能吹尽。"),
      override("line-4.token-3", "玉", "yù", "‘玉关’为边关意象。"),
      override("line-5.token-1", "何", "hé", "‘何日’为疑问时间。"),
      override("line-5.token-5", "虏", "lǔ", "‘胡虏’中的规范读音。"),
      override("line-6.token-3", "罢", "bà", "‘罢远征’表示停止远征。"),
    ],
    sourceRecords: [sourcePoetry, sourcePeking, sourceChangAn],
    reviewNotes: "乐府题名、‘捣衣/玉关/罢远征’语境读音、长安到玉关的想象关系已人工复核。",
  }),
];

export const phase1PoemById = Object.fromEntries(phase1Poems.map((entry) => [entry.id, entry]));

export default phase1Poems;
