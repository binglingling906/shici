import { phase1Places, phase1Poems, phase1PlaceById, phase1PoemById } from "./content/phase1/index.js?v=interpretation-1";
import { AGE_MODES, createProgressStore } from "./core/progress-store.js";
import { createTutorEngine, createRemoteTutor } from "./core/tutor-engine.js";
import { createAudioEngine, createSilentAudioProvider } from "./core/audio-provider.js";
import { createConceptTutor } from "./core/concept-tutor.js";
import {
  CURRICULUM_CONFIG,
  CURRICULUM_CLAIMS,
  CONCEPTS,
  POEM_CONCEPTS,
  CULTURAL_REGIONS,
  GEO_NODES,
  IMMERSIVE_IDS,
  GUIDED_IDS,
  buildLearningCatalog,
} from "./content/curriculum/index.js?v=curriculum-concepts-1";

const MAP_DATA_URL = "./content/generated/china-physical-map.json";
const ART_BY_PLACE = {
  lushan: "assets/art/lushan-waterfall-reading.png",
  "yellow-crane": "assets/art/phase1/yellow-crane-river.jpg",
  "west-lake": "assets/art/phase1/west-lake-lotus.jpg",
  chengdu: "assets/art/phase1/chengdu-spring-rain.jpg",
  "chang-an": "assets/art/phase1/chang-an-autumn-moon.jpg",
};

const PLACE_ORDER = phase1Places.map((place) => place.id);
const ORIGIN_CITIES = [
  { id: "beijing", name: "北京" }, { id: "ningbo", name: "宁波" }, { id: "chengdu", name: "成都" }, { id: "guangzhou", name: "广州" }, { id: "shanghai", name: "上海" },
];
const PLACE_STAGE = Object.fromEntries(PLACE_ORDER.map((id, index) => [id, ["第一", "第二", "第三", "第四", "第五"][index]]));
const INTERACTIONS = {
  "lushan-wang-lushan-pubu": {
    keywords: ["遥看", "直下", "银河"],
    cue: "远近 · 高低 · 想象",
    options: [{ id: "far", label: "隔着一段距离", correct: true }, { id: "near", label: "就在诗人眼前" }, { id: "unsure", label: "我还不确定" }],
  },
  "lushan-ti-xi-lin-bi": {
    keywords: ["横看", "侧成峰", "山中"],
    cue: "换一个位置，再看一次",
    options: [{ id: "position", label: "观察位置变了", correct: true }, { id: "mountain", label: "山自己变形了" }, { id: "unsure", label: "我想再看一眼" }],
  },
  "yellow-crane-huang-he-lou": {
    keywords: ["晴川", "日暮", "乡关"],
    cue: "江城远望 · 从景到情",
    options: [{ id: "scene-home", label: "先看江景，再想起故乡", correct: true }, { id: "only-story", label: "一直只在讲黄鹤传说" }, { id: "unsure", label: "我还没连起来" }],
  },
  "yellow-crane-song-meng-hao-ran": {
    keywords: ["西辞", "远影", "天际"],
    cue: "起点 · 方向 · 越来越远",
    options: [{ id: "farther", label: "船越来越远、越来越小", correct: true }, { id: "closer", label: "船越来越近、越来越大" }, { id: "unsure", label: "我想看看地图" }],
  },
  "west-lake-yin-hu-shang": {
    keywords: ["水光", "空蒙", "总相宜"],
    cue: "同一片湖 · 两种天气",
    options: [{ id: "both", label: "晴雨各有不同的美", correct: true }, { id: "sun-only", label: "只有晴天才好看" }, { id: "unsure", label: "我还在比较" }],
  },
  "west-lake-xiao-chu-jing-ci-si": {
    keywords: ["接天", "无穷碧", "映日"],
    cue: "近处荷叶 · 远处天空",
    options: [{ id: "wide", label: "荷叶从近处一直铺到天边", correct: true }, { id: "small", label: "只有眼前一小片荷叶" }, { id: "unsure", label: "我还没看出远近" }],
  },
  "chengdu-chun-ye-xi-yu": {
    keywords: ["潜入夜", "细无声", "花重"],
    cue: "夜里听雨 · 天明看花",
    options: [{ id: "quiet-change", label: "雨很安静，却让花发生变化", correct: true }, { id: "storm", label: "雨声很响，把花吹走了" }, { id: "unsure", label: "我想先听一遍" }],
  },
  "chengdu-jueju-two-orioles": {
    keywords: ["窗含", "西岭", "门泊"],
    cue: "窗内 · 远山 · 门外的船",
    options: [{ id: "near-far", label: "窗把近景和远山装进一幅画", correct: true }, { id: "only-birds", label: "诗里只有两只鸟" }, { id: "unsure", label: "我想再找空间词" }],
  },
  "chang-an-chun-wang": {
    keywords: ["国破", "城春", "家书"],
    cue: "山河仍在 · 城与人的变化",
    options: [{ id: "contrast", label: "春景仍在，人的处境却很沉重", correct: true }, { id: "happy-spring", label: "诗人只是在快乐赏春" }, { id: "unsure", label: "我需要一点背景" }],
  },
  "chang-an-zi-ye-wu-ge-qiu-ge": {
    keywords: ["长安", "万户", "玉关"],
    cue: "眼前月色 · 远方边关",
    options: [{ id: "distance", label: "从长安的夜想到遥远玉关", correct: true }, { id: "same-place", label: "长安和玉关就在同一处" }, { id: "unsure", label: "我想在地图上找一找" }],
  },
};

const q = (selector, root = document) => root.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const dom = Object.fromEntries([
  "header-progress", "age-trigger", "sound-toggle", "map-filters", "filter-summary", "daily-card", "daily-title", "daily-meta",
  "place-progress-count", "footprint-copy", "origin-trigger", "origin-panel", "origin-options", "world-map-svg", "map-layer-root", "map-entity-layer", "map-empty", "map-list-toggle", "map-text-list",
  "place-dock", "place-art", "place-location", "place-name", "place-story", "place-relations", "place-poems", "place-close",
  "reader-art", "reader-back", "reader-place-index", "reader-spatial-path", "reader-place", "reader-place-note", "reader-source", "sibling-poems",
  "poem-taxonomy", "reader-title", "poem-author", "age-reading-note", "curriculum-origin", "poem-stage", "poem-image-cue", "poem-lines", "poem-source-line",
  "listen-poem", "stop-poem", "pinyin-toggle", "audio-status", "keyword-strip", "learning-step", "age-mode-label", "question-title", "question-copy",
  "answer-options", "hint-button", "hint-copy", "tutor-form", "tutor-input", "tutor-response", "complete-poem", "explanation-title", "explanation-copy",
  "meaning-card", "meaning-summary", "meaning-lines", "extension-title", "extension-copy", "extension-prompt",
  "concept-discovery", "concept-category", "concept-title", "concept-close", "concept-progress", "concept-prompt", "concept-evidence", "concept-choices", "concept-feedback", "concept-next", "concept-reset", "concept-followups", "concept-ask-form", "concept-ask-input", "concept-answer",
  "relation-lattice-links", "region-tabs", "region-summary", "region-reset",
  "corpus-tally", "corpus-search", "stage-tabs", "semester-tabs", "grade-list", "curriculum-edition-note", "coverage-open", "catalog-kicker", "catalog-heading", "catalog-count", "catalog-list", "coverage-grid", "coverage-gaps",
  "next-place-title", "next-place-reason", "next-place-button", "daily-feature", "challenge-panel", "progress-grid", "reset-progress",
  "age-dialog", "age-options", "completion-dialog", "completion-copy", "completion-next", "completion-map",
].map((id) => [id.replaceAll("-", "_"), document.getElementById(id)]));

const qaParams = new URLSearchParams(location.search);
const qaTextScale = Number(qaParams.get("qaTextScale"));
if ([125, 150].includes(qaTextScale)) {
  document.documentElement.dataset.qaTextScale = String(qaTextScale);
  document.documentElement.style.fontSize = `${qaTextScale}%`;
}
if (qaParams.get("qaReducedMotion") === "1") document.documentElement.dataset.qaReducedMotion = "true";
const store = createProgressStore();
const audio = qaParams.get("qaAudioUnavailable") === "1"
  ? createAudioEngine({ primary: createSilentAudioProvider() })
  : createAudioEngine();
const tutorEndpoint = document.documentElement.dataset.tutorEndpoint || (qaParams.get("qaTutorUnavailable") === "1" ? "/api/tutor-unavailable" : "");
const remoteTutor = tutorEndpoint
  ? createRemoteTutor({ endpoint: tutorEndpoint })
  : null;
const tutor = createTutorEngine({ primary: remoteTutor });
const conceptTutor = createConceptTutor({ concepts: CONCEPTS });
let learningCatalog = [];
let learningPoemById = { ...phase1PoemById };
const state = {
  route: "map",
  filter: "all",
  regionId: "",
  selectedPlaceId: "",
  currentPoemId: "",
  entryRoute: "map",
  curriculum: { stage: "小学", grade: "一年级", semester: "all", query: "" },
  concept: { id: "", step: 0 },
  mapData: null,
  reader: { answerAttempted: false, answerCorrect: false, selectedAnswer: "", hintCount: 0, tutorTurns: 0, listened: false },
  challengeAttempts: 0,
  resetArmed: false,
};

function placePoems(placeId) {
  return Object.values(learningPoemById).filter((poem) => poem.placeId === placeId);
}

function splitPoemText(value) {
  return String(value || "")
    .split(/\n+/u)
    .flatMap((line) => line.match(/[^，。！？；]+[，。！？；]?/gu) || [])
    .map((line) => line.trim())
    .filter(Boolean);
}

function standardLine(poemId, text, index) {
  const punctuation = /[，。！？；：、]/u;
  return {
    id: `${poemId}-line-${index + 1}`,
    text,
    tokens: Array.from(text, (char) => punctuation.test(char) ? { char, punctuation: true } : { char }),
  };
}

function genericAgeBands(item) {
  const themes = (item.themes || []).slice(0, 3).join("、") || "画面和声音";
  const firstLine = splitPoemText(item.text)[0] || item.title;
  return {
    "7-8": { label: "先看画面", explanation: `这首诗可以先从${themes}读起。`, openingQuestion: `读第一句“${firstLine}”，你先看见了什么？`, hint: "先找一个景物或动作词。", followUp: "再听听这一句里有没有声音或方向。", completionStandard: "读一遍并说出一个画面", context: "不用急着懂完，先把眼前的画面说出来。" },
    "9-10": { label: "连起线索", explanation: `把${themes}连起来，看诗的画面怎样一步步变化。`, openingQuestion: "哪两句之间的画面变化最明显？", hint: "找时间、方向、颜色或动作。", followUp: "用诗里的一个词支持你的判断。", completionStandard: "找到变化并引用一个词", context: "从原诗证据出发，不先背现成结论。" },
    "11-12": { label: "用证据深读", explanation: `比较诗中的${themes}，再判断它们怎样共同形成情绪或节奏。`, openingQuestion: "诗人怎样安排景物、声音或时间，让情绪发生变化？", hint: "先圈出一处结构或语言证据。", followUp: "再和同体裁作品比较。", completionStandard: "提出判断并给出诗句证据", context: "如果资料仍在审核，页面会明确保留不确定性。" },
  };
}

function standardPoemFromItem(item) {
  if (phase1PoemById[item.id]) return { ...phase1PoemById[item.id], maturity: "immersive", contentTier: "immersive", reviewFlags: item.reviewFlags || item.review || {}, curriculumClaims: item.curriculumClaims || [], conceptRelations: item.conceptRelations || [], geoRelations: item.geoRelations || [], regionIds: item.regionIds || [], themes: item.themes || [] };
  const lineTexts = splitPoemText(item.text);
  const lines = lineTexts.map((line, index) => standardLine(item.id, line, index));
  const themes = item.themes || ["画面", "语言"];
  const summary = item.briefExplanation || `这首作品可以先抓住“${themes.slice(0, 2).join("、")}”来读：看景物怎样出现，动作或声音怎样把句子连起来。`;
  return {
    ...item,
    contentTier: item.maturity || "standard",
    title: { text: typeof item.title === "string" ? item.title : item.title?.text || "未题", pinyin: "" },
    author: { name: typeof item.author === "string" ? item.author : item.author?.name || "佚名", pinyin: "" },
    lines,
    ageBands: item.ageBands || genericAgeBands(item),
    placeId: item.primaryPlaceId || item.placeCandidates?.find((id) => id !== "unassigned") || "unknown",
    background: item.background || "原文来自古典诗词候选快照；文本版本、教材与地理关系按各自审核状态展示。",
    spatialLearning: item.spatialLearning || { coreRelation: themes[0] || "观察", observation: `先从${themes.slice(0, 2).join("和")}找一条线索。`, evidenceLineIds: lines.slice(0, 2).map((line) => line.id) },
    interpretation: item.interpretation || {
      summary,
      lineMeanings: lines.map((line) => ({ lineId: line.id, meaning: `先保留原句“${line.text}”的完整节奏；这一句的逐句释义仍在人工审核，当前先从景物、动作和上下句关系理解。` })),
      extension: { title: "把诗放回它的关系网", text: `从${themes.join("、")}继续寻找同年级、同诗人或同一片山河中的作品。`, prompt: "你会先沿哪一条关系继续？" },
    },
    nextPlaceId: item.nextPlaceId || "",
    nextReason: item.nextReason || "这首诗没有可靠的下一地点声明，可以从同诗人、同体裁或同年级继续。",
    pronunciation: item.pronunciation || { presentation: "not-published-until-reviewed" },
    provenance: item.provenance || { sources: [item.sourceSnapshot || { title: "本地许可语料快照" }] },
  };
}

function geoNodeById(id) {
  return GEO_NODES.find((node) => node.id === id) || null;
}

function placeForPoem(poem) {
  return phase1PlaceById[poem?.placeId] || geoNodeById(poem?.placeId) || {
    id: "unknown",
    name: "地点待核验",
    modernCity: "不强行落图",
    province: "",
    region: "地点关系未知",
    precision: "unknown",
    spatialStory: "这首诗暂时没有足够可靠的地点关系，所以不会被钉在地图上。",
    provenance: { sources: [] },
  };
}

function defaultInteraction(poem) {
  const keywords = (poem.themes || []).slice(0, 3);
  const first = poem.lines?.[0]?.text || "第一句";
  return {
    keywords: keywords.length ? keywords : ["景物", "动作", "声音"],
    cue: keywords.length ? keywords.join(" · ") : "先看原诗，再说发现",
    options: [
      { id: "evidence", label: `先从“${first.slice(0, 8)}”找证据`, correct: true },
      { id: "guess", label: "先猜一个答案，不看诗句" },
      { id: "unsure", label: "我想先听一遍" },
    ],
  };
}

async function loadLearningCatalog() {
  try {
    const response = await fetch("./content/catalog/phase1-runtime.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`catalog ${response.status}`);
    const runtime = await response.json();
    const built = buildLearningCatalog(runtime.catalog || [], phase1Poems);
    learningCatalog = built.map(standardPoemFromItem);
    learningPoemById = Object.fromEntries(learningCatalog.map((poem) => [poem.id, poem]));
  } catch {
    learningCatalog = phase1Poems.map((poem) => standardPoemFromItem(poem));
    learningPoemById = Object.fromEntries(learningCatalog.map((poem) => [poem.id, poem]));
  }
  renderCurriculum();
  renderRegions();
  renderCoverage();
  renderMapMarkers();
  const requested = location.hash.slice(1);
  if (requested.startsWith("poem/") && learningPoemById[requested.slice(5)]) openPoem(requested.slice(5));
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function stringHash(value) {
  return [...value].reduce((hash, char) => ((hash * 31) + char.codePointAt(0)) >>> 0, 2166136261);
}

function dailyPoem() {
  return phase1Poems[stringHash(localDateKey()) % phase1Poems.length];
}

function currentProgress() {
  return store.get();
}

function updateHeader() {
  const progress = currentProgress();
  dom.header_progress.textContent = `${progress.completedPoemIds.length}/10`;
  dom.place_progress_count.textContent = String(progress.completedPoemIds.length);
  dom.footprint_copy.textContent = progress.completedPoemIds.length
    ? `已经读完 ${progress.completedPoemIds.length} 首诗。每一枚足迹都能带你回到那处山河。`
    : "你的诗词山河图还在等待第一枚足迹。";
  const mode = AGE_MODES[progress.ageMode];
  dom.age_trigger.textContent = mode.shortLabel;
  dom.sound_toggle.textContent = progress.soundEnabled ? "声音开" : "声音关";
  dom.sound_toggle.setAttribute("aria-pressed", String(progress.soundEnabled));
  const origin = ORIGIN_CITIES.find((city) => city.id === progress.originCityId);
  dom.origin_trigger.textContent = origin ? `从${origin.name}出发` : "我从哪里出发";
  const daily = dailyPoem();
  dom.daily_title.textContent = `《${daily.title.text}》`;
  dom.daily_meta.textContent = `${daily.dynasty} · ${daily.author.name} · ${phase1PlaceById[daily.placeId].name}`;
}

function renderOriginOptions() {
  const selected = currentProgress().originCityId;
  dom.origin_options.replaceChildren(...ORIGIN_CITIES.map((city) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.originId = city.id;
    button.setAttribute("aria-pressed", String(selected === city.id));
    button.textContent = city.name;
    return button;
  }));
}

function showScreen(route) {
  audio.stop();
  resetSpeaking();
  state.route = route;
  qa("[data-screen]").forEach((screen) => {
    const active = screen.dataset.screen === route;
    screen.hidden = !active;
    screen.classList.toggle("is-active", active);
  });
  qa(".primary-nav [data-route]").forEach((button) => {
    if (button.dataset.route === route) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  if (route === "daily") renderDaily();
  if (route === "challenge") renderChallenge();
  if (route === "progress") renderProgress();
  if (route === "curriculum") renderCurriculum?.();
  if (route === "coverage") renderCoverage?.();
  if (route === "map") renderMapMarkers();
  document.dispatchEvent(new CustomEvent("shanhe:viewchange", { detail: { route } }));
}

function routeTo(route) {
  if (route === "reader" && state.currentPoemId) openPoem(state.currentPoemId);
  else {
    location.hash = route;
    showScreen(route);
  }
}

async function loadMap() {
  try {
    const response = await fetch(MAP_DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`map ${response.status}`);
    state.mapData = await response.json();
    renderMapGeometry();
    renderMapMarkers();
  } catch {
    dom.map_empty.hidden = false;
    dom.map_empty.innerHTML = "<p>山河路径暂时没有展开，仍可以用文字列表进入五个地点。</p>";
    renderMapTextList(phase1Places);
  }
}

function svgPath(pathData, className) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("class", className);
  return path;
}

function renderMapGeometry() {
  const layers = state.mapData?.layers;
  dom.map_layer_root.replaceChildren();
  if (!layers) return;
  if (layers.landPath) dom.map_layer_root.append(svgPath(layers.landPath, "map-land"));
  for (const river of layers.rivers || []) dom.map_layer_root.append(svgPath(river.path, "map-river"));
  for (const lake of layers.lakes || []) dom.map_layer_root.append(svgPath(lake.path, "map-water"));
}

function matchesFilter(place) {
  const poems = poemsForNode(place);
  if (state.filter === "all" || state.filter === "poet") return true;
  if (state.filter === "tang") return poems.some((poem) => poem.dynasty === "唐");
  if (state.filter === "song") return poems.some((poem) => poem.dynasty === "宋");
  if (state.filter === "landscape") return placeCategory(place) === "landscape";
  if (state.filter === "city") return placeCategory(place) === "city";
  return true;
}

const LANDSCAPE_NODE_IDS = new Set(["lushan", "yellow-river", "yangtze", "west-lake", "dongting-lake", "hua-shan", "mount-tai", "yan-mountain", "jieshi-mountain", "beigu-mountain", "jingting-mountain", "tianmen-mountain", "yinshan", "bashan", "taohuatan"]);
const CITY_OR_LANDMARK_NODE_IDS = new Set(["yellow-crane", "yangzhou", "hangzhou", "chengdu", "chang-an", "baidi-city", "jiangling", "yueyang", "liangzhou", "yumen-pass", "furong-lou", "luoyang", "loulan", "weicheg", "yangguan", "jingmen", "jinling", "suzhou", "chuzhou", "huangzhou", "dunhuang", "tongguan"]);

function placeCategory(place) {
  if (["mountain", "lake", "river"].includes(place.type) || LANDSCAPE_NODE_IDS.has(place.id)) return "landscape";
  if (["city", "historical_city", "cultural_landmark"].includes(place.type) || CITY_OR_LANDMARK_NODE_IDS.has(place.id)) return "city";
  return "context";
}

function allGeoPlaces() {
  if (!GEO_NODES.length) return phase1Places;
  const byId = new Map(GEO_NODES.map((node) => [node.id, node]));
  for (const place of phase1Places) if (!byId.has(place.id)) byId.set(place.id, place);
  return [...byId.values()].filter((node) => node.status !== "candidate" && node.precision !== "unknown");
}

function nodeCoordinates(node) {
  return node.coordinates || node.geometry?.coordinates || null;
}

function approximateProjection(node) {
  const coordinates = nodeCoordinates(node);
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return null;
  const [longitude, latitude] = coordinates;
  const x = 38 + ((longitude - 73.5) / (134.8 - 73.5)) * 924;
  const mercatorY = (lat) => Math.log(Math.tan((Math.PI / 4) + ((lat * Math.PI / 180) / 2)));
  const north = mercatorY(53.6);
  const south = mercatorY(18);
  const y = 30 + ((north - mercatorY(latitude)) / (north - south)) * 660;
  return { x, y };
}

function poemsForNode(node) {
  const ids = new Set(node.poemIds || []);
  return learningCatalog.filter((poem) => poem.placeId === node.id || poem.placeCandidates?.includes(node.id) || ids.has(poem.id));
}

function markerPlan(places) {
  const mapBox = dom.map_entity_layer.getBoundingClientRect();
  const width = mapBox.width || 900;
  const height = mapBox.height || 560;
  const mobile = width < 600;
  const progress = currentProgress();
  const planned = places.map((place, order) => {
    const projected = state.mapData?.projectedEntities?.[place.id] || approximateProjection(place);
    const poems = poemsForNode(place);
    const immersiveCount = poems.filter((poem) => poem.maturity === "immersive" || IMMERSIVE_IDS.includes(poem.id)).length;
    const authors = [...new Set(poems.map((poem) => poem.author.name))].join("、");
    const label = state.filter === "poet" ? authors : place.name;
    const standard = immersiveCount === 0;
    const compact = !phase1PlaceById[place.id];
    const estimatedWidth = mobile && standard
      ? 48
      : mobile
        ? Math.min(150, Math.max(74, 46 + Array.from(label).length * 14))
        : compact
          ? Math.min(128, Math.max(68, 42 + Array.from(label).length * 14))
          : Math.min(190, Math.max(128, 48 + Array.from(label).length * 15));
    return {
      place, projected, poems, immersiveCount, authors, standard, order,
      x: projected ? (projected.x / 1200) * width : 0,
      y: projected ? (projected.y / 760) * height : 0,
      width: estimatedWidth, compact,
      height: 50,
      priority: (place.id === "lushan" ? 5000 : 0) + (state.selectedPlaceId === place.id ? 3000 : 0) + (phase1PlaceById[place.id] ? 1000 : 0) + immersiveCount * 50 + poems.length * 3 + (progress.visitedPlaceIds.includes(place.id) ? 8 : 0),
    };
  }).filter((item) => item.projected).sort((a, b) => b.priority - a.priority || a.order - b.order);
  const accepted = [];
  const limit = mobile ? 8 : 14;
  for (const item of planned) {
    const itemBox = { left: item.x - item.width / 2, right: item.x + item.width / 2, top: item.y - item.height / 2, bottom: item.y + item.height / 2 };
    const overlaps = accepted.some((other) => {
      const otherBox = { left: other.x - other.width / 2, right: other.x + other.width / 2, top: other.y - other.height / 2, bottom: other.y + other.height / 2 };
      return itemBox.left < otherBox.right + 6 && itemBox.right + 6 > otherBox.left && itemBox.top < otherBox.bottom + 6 && itemBox.bottom + 6 > otherBox.top;
    });
    if (!overlaps) accepted.push(item);
    if (accepted.length >= limit) break;
  }
  return accepted;
}

function renderMapMarkers() {
  const progress = currentProgress();
  const activeRegion = CULTURAL_REGIONS.find((region) => region.id === state.regionId);
  const activePlaceIds = activeRegion ? (activeRegion.placeIds || activeRegion.anchorNodeIds || []) : [];
  const matchingPlaces = allGeoPlaces().filter((place) => {
    const regionMatch = !activeRegion || activePlaceIds.includes(place.id);
    return regionMatch && matchesFilter(place) && poemsForNode(place).length;
  });
  const visibleMarkers = markerPlan(matchingPlaces);
  dom.map_entity_layer.replaceChildren();
  for (const planned of visibleMarkers) {
    const { place, projected, poems, immersiveCount, authors, standard, compact } = planned;
    const displayedPoems = state.filter === "tang" ? poems.filter((poem) => poem.dynasty === "唐")
      : state.filter === "song" ? poems.filter((poem) => poem.dynasty === "宋")
        : poems;
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "place-marker";
    marker.id = `world-marker-${place.id}`;
    marker.dataset.placeId = place.id;
    marker.style.left = `${(projected.x / 1200) * 100}%`;
    marker.style.top = `${(projected.y / 760) * 100}%`;
    const done = poems.length > 0 && poems.every((poem) => progress.completedPoemIds.includes(poem.id));
    marker.classList.toggle("is-complete", done);
    marker.classList.toggle("is-selected", state.selectedPlaceId === place.id);
    marker.classList.toggle("is-standard", standard);
    marker.classList.toggle("is-compact", compact);
    marker.setAttribute("aria-label", `${place.name}，${displayedPoems.length} 首诗${done ? "，已完成" : ""}`);
    marker.innerHTML = `<span><strong>${state.filter === "poet" ? authors : place.name}</strong><small>${state.filter === "poet" ? place.name : `${immersiveCount} 首诗境 · ${displayedPoems.length - immersiveCount} 首标准`}</small></span>`;
    dom.map_entity_layer.append(marker);
  }
  dom.map_empty.hidden = Boolean(matchingPlaces.length);
  const label = { all: "全部", tang: "唐", song: "宋诗", landscape: "山河", city: "城市", poet: "诗人" }[state.filter];
  const visiblePoemCount = matchingPlaces.reduce((sum, place) => {
    const poems = poemsForNode(place);
    if (state.filter === "tang") return sum + poems.filter((poem) => poem.dynasty === "唐").length;
    if (state.filter === "song") return sum + poems.filter((poem) => poem.dynasty === "宋").length;
    return sum + poems.length;
  }, 0);
  dom.filter_summary.textContent = `${activeRegion ? activeRegion.name : label} · ${matchingPlaces.length} 个地点 · 当前标出 ${visibleMarkers.length} 个 · ${visiblePoemCount} 首可学习诗`;
  renderMapTextList(matchingPlaces);
}

function renderMapTextList(places) {
  dom.map_text_list.replaceChildren();
  for (const place of places) {
    const poems = poemsForNode(place);
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" data-place-id="${place.id}"><strong>${place.name}</strong><br><small>${place.region || place.culturalRegion || "文化地点"} · ${poems.length} 首诗</small></button>`;
    dom.map_text_list.append(li);
  }
}

function placeArt(placeId) {
  return ART_BY_PLACE[placeId] || ART_BY_PLACE.lushan;
}

function selectPlace(placeId, { focus = true } = {}) {
  const place = phase1PlaceById[placeId] || geoNodeById(placeId);
  if (!place) return;
  state.selectedPlaceId = placeId;
  store.visitPlace(placeId);
  dom.place_art.src = placeArt(placeId);
  dom.place_art.alt = `${place.name}诗境画面`;
  dom.place_location.textContent = [place.province, place.modernCity, place.region || place.culturalRegion].filter(Boolean).join(" · ") || "文化地理节点";
  dom.place_name.textContent = place.name;
  dom.place_story.textContent = place.spatialStory || place.childSummary || place.description || "从这处地点进入相关诗词，地点关系与现代坐标分别记录。";
  const relations = place.surroundingRelations || place.relations || [];
  dom.place_relations.replaceChildren(...relations.slice(0, 3).map((relation) => {
    const span = document.createElement("span");
    span.textContent = relation.targetName || relation.label || relation.type;
    span.title = relation.learningCue || relation.note || "";
    return span;
  }));
  dom.place_poems.replaceChildren();
  const progress = currentProgress();
  for (const poem of poemsForNode(place).slice(0, 8)) {
    const done = progress.completedPoemIds.includes(poem.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "poem-choice";
    button.dataset.poemId = poem.id;
    button.innerHTML = `<strong>《${poem.title.text}》</strong><small>${poem.dynasty} · ${poem.author.name} · ${poem.genre}</small><span class="completion-state">${done ? "已读" : "进入"}</span>`;
    dom.place_poems.append(button);
  }
  dom.place_dock.hidden = false;
  renderMapMarkers();
  if (focus) dom.place_dock.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function resetReaderState() {
  state.reader = { answerAttempted: false, answerCorrect: false, selectedAnswer: "", hintCount: 0, tutorTurns: 0, listened: false };
}

function renderRubyLine(line, poem) {
  const row = document.createElement("p");
  row.className = "poem-line";
  row.dataset.lineId = line.id;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.speakLine = line.id;
  button.setAttribute("aria-label", `朗读：${line.text}`);
  let spokenIndex = 0;
  for (const token of line.tokens) {
    if (token.punctuation) {
      const punctuation = document.createElement("span");
      punctuation.className = "poem-punctuation";
      punctuation.textContent = token.char;
      button.append(punctuation);
      continue;
    }
    spokenIndex += 1;
    if (!token.pinyin) {
      const base = document.createElement("span");
      base.className = "poem-character poem-character-plain";
      base.dataset.count = String(spokenIndex);
      base.textContent = token.char;
      button.append(base);
      continue;
    }
    const ruby = document.createElement("ruby");
    const base = document.createElement("span");
    base.className = "poem-character";
    base.dataset.count = String(spokenIndex);
    base.textContent = token.char;
    const rt = document.createElement("rt");
    rt.textContent = token.pinyin;
    ruby.append(base, rt);
    button.append(ruby);
  }
  row.append(button);
  return row;
}

function ageCompletionCopy(modeId) {
  return {
    "7-8": "选一个画面、听一遍或用一次提示，就可以留下足迹。",
    "9-10": "找到合适的空间关系，并用自己的话回应一次，才算完成。",
    "11-12": "选择证据，并写下一个基于诗句的判断，才算完成。",
  }[modeId];
}

function sourceSummary(poem, place) {
  const sourceTitles = (poem.provenance?.sources || []).slice(0, 2).map((source) => source.title || source.collection || source.repository).filter(Boolean).join("；");
  return `${poem.background} 位置精度：${place.precision || "unknown"}。${sourceTitles ? `来源：${sourceTitles}。` : "来源关系仍在审核。"}`;
}

function renderInterpretation(poem, ageMode) {
  const interpretation = poem.interpretation;
  dom.meaning_summary.textContent = interpretation.summary;
  dom.meaning_lines.replaceChildren(...interpretation.lineMeanings.map((item) => {
    const sourceLine = poem.lines.find((line) => line.id === item.lineId);
    const li = document.createElement("li");
    li.innerHTML = `<span class="meaning-source">${sourceLine?.text || ""}</span><span class="meaning-paraphrase">${item.meaning}</span>`;
    return li;
  }));
  dom.extension_title.textContent = interpretation.extension.title;
  dom.extension_copy.textContent = interpretation.extension.text;
  dom.extension_prompt.textContent = interpretation.extension.prompt;
  dom.meaning_card.open = ageMode === "7-8";
  const stateLabel = q("summary i", dom.meaning_card);
  if (stateLabel) stateLabel.textContent = dom.meaning_card.open ? "收起" : "展开";
}

function conceptRelationsForPoem(poemId) {
  const runtimeRelations = learningPoemById[poemId]?.conceptRelations;
  if (runtimeRelations?.length) return runtimeRelations;
  if (Array.isArray(POEM_CONCEPTS)) return POEM_CONCEPTS.filter((relation) => relation.poemId === poemId);
  return POEM_CONCEPTS?.[poemId] || [];
}

function conceptByTerm(term) {
  return CONCEPTS.find((concept) => concept.term === term || concept.aliases?.includes(term));
}

function inferredConcepts(poem) {
  const terms = [poem.dynasty === "唐" || poem.dynasty === "宋" ? "朝代" : "朝代", poem.genre];
  return terms.map(conceptByTerm).filter(Boolean);
}

function renderPoemTaxonomy(poem) {
  const relationConcepts = conceptRelationsForPoem(poem.id)
    .map((relation) => conceptTutor.get(relation.conceptId))
    .filter(Boolean);
  const concepts = [...new Map([...relationConcepts, ...inferredConcepts(poem)].map((concept) => [concept.id, concept])).values()].slice(0, 3);
  dom.poem_taxonomy.replaceChildren();
  for (const concept of concepts) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.conceptId = concept.id;
    button.textContent = concept.term;
    button.setAttribute("aria-label", `${concept.term}，点击跟着当前诗发现它的意思`);
    dom.poem_taxonomy.append(button);
  }
  if (!concepts.length) {
    const span = document.createElement("span");
    span.textContent = `${poem.dynasty} · 正式概念审核中`;
    dom.poem_taxonomy.append(span);
  }
}

function renderCurriculumOrigin(poem) {
  const claims = poem.curriculumClaims || CURRICULUM_CLAIMS.filter((claim) => claim.poemId === poem.id);
  const verified = claims.find((claim) => /verified/u.test(claim.verificationStatus)) || claims[0];
  if (!verified) {
    dom.curriculum_origin.textContent = "教材关系：尚未逐项核验，不显示为正式教材篇目";
    return;
  }
  const status = /verified/u.test(verified.verificationStatus) ? "已核验" : "候选，待核验";
  dom.curriculum_origin.textContent = `${normalizedStage(verified.stage)} · ${displayGrade(verified.grade)}${semesterLabel(verified.semester)} · ${placementLabel(verified.inClassOrExtra)} · ${status}`;
}

function latticeButton(label, value, filterKind, filterValue) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.corpusFilterKind = filterKind;
  button.dataset.corpusFilterValue = filterValue;
  button.innerHTML = `<small>${label}</small>${value}`;
  return button;
}

function renderRelationLattice(poem) {
  const claims = poem.curriculumClaims || CURRICULUM_CLAIMS.filter((claim) => claim.poemId === poem.id);
  const claim = claims.find((item) => /verified/u.test(item.verificationStatus)) || claims[0];
  const place = placeForPoem(poem);
  const links = [
    claim && latticeButton("同年级", `${displayGrade(claim.grade)}${semesterLabel(claim.semester)}`, "grade", displayGrade(claim.grade)),
    place.id !== "unknown" && latticeButton("同地点", place.name, "place", place.id),
    latticeButton("同诗人", poem.author.name, "author", poem.author.name),
    latticeButton("同体裁", poem.genre, "genre", poem.genre),
  ].filter(Boolean);
  const riverRegion = CULTURAL_REGIONS.find((region) => region.poemIds?.includes(poem.id) || (region.placeIds || region.anchorNodeIds || []).includes(place.id) || poem.regionIds?.includes(region.id));
  if (riverRegion) links.push(latticeButton("同一条山河", riverRegion.name, "region", riverRegion.id));
  dom.relation_lattice_links.replaceChildren(...links);
}

function normalizeDiscoveryStep(step, index) {
  if (typeof step === "string") return { id: `step-${index + 1}`, prompt: step, choices: [] };
  let choices = step.choices || step.options || [];
  if (!choices.length && Number.isInteger(step.expectedCount)) {
    choices = [step.expectedCount - 1, step.expectedCount, step.expectedCount + 1].map((value) => ({ label: `${value} 个字`, value: String(value), correct: value === step.expectedCount }));
  } else if (!choices.length && step.expectedAnswer === "四句") {
    choices = ["三句", "四句", "五句"].map((value) => ({ label: value, value, correct: value === "四句" }));
  }
  return {
    id: step.id || `step-${index + 1}`,
    prompt: step.prompt || step.question || step.instruction || "回到当前诗句看一看。",
    choices,
    feedback: step.feedback || step.explanation || "",
    action: step.action || step.visualAction || step.childAction || "",
  };
}

function activeConceptLesson() {
  return state.concept.id ? conceptTutor.lesson(state.concept.id, currentProgress().ageMode) : null;
}

function renderConceptEvidence(step) {
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  dom.concept_evidence.replaceChildren();
  if (!poem?.lines?.length) return;
  const stepText = `${step.prompt || ""}${step.action || ""}${step.childAction || ""}`;
  const counting = /count|数|几个字/u.test(stepText);
  const rhyme = /rhyme|押韵|韵脚/u.test(stepText);
  const requestedRefs = new Set(step.lineRefs || []);
  const lines = requestedRefs.size
    ? poem.lines.filter((line, index) => requestedRefs.has(line.id) || requestedRefs.has(`line-${index + 1}`))
    : rhyme ? poem.lines.slice(0, 4) : poem.lines.slice(0, 1);
  for (const [lineIndex, line] of lines.entries()) {
    const row = document.createElement("p");
    row.setAttribute("aria-label", line.text);
    const readable = line.tokens.filter((token) => !token.punctuation);
    let readableIndex = 0;
    for (const token of line.tokens) {
      const span = document.createElement("span");
      span.textContent = token.char;
      if (token.punctuation) span.className = "is-punctuation";
      else {
        readableIndex += 1;
        if (counting && lineIndex === 0) {
          const count = document.createElement("small");
          count.textContent = String(readableIndex);
          span.append(count);
        }
        if (rhyme && readableIndex === readable.length && [0, 1, 3].includes(lineIndex)) span.classList.add("is-rhyme");
      }
      row.append(span);
    }
    dom.concept_evidence.append(row);
  }
}

function renderConceptStep() {
  const lesson = activeConceptLesson();
  if (!lesson) return;
  const rawSteps = lesson.steps.length ? lesson.steps : [{ prompt: lesson.explanation, feedback: lesson.explanation }];
  const steps = rawSteps.map(normalizeDiscoveryStep);
  const stepIndex = Math.min(state.concept.step, steps.length - 1);
  const step = steps[stepIndex];
  dom.concept_category.textContent = `${lesson.concept.category || "诗词知识"} · 离线已审核`;
  dom.concept_title.textContent = lesson.concept.term;
  dom.concept_progress.textContent = `第 ${stepIndex + 1} 步，共 ${steps.length} 步 · ${AGE_MODES[currentProgress().ageMode].shortLabel}`;
  dom.concept_prompt.textContent = step.prompt || lesson.explanation;
  renderConceptEvidence(step);
  dom.concept_feedback.textContent = stepIndex === steps.length - 1 ? (step.feedback || lesson.explanation) : "";
  dom.concept_choices.replaceChildren(...step.choices.map((choice, index) => {
    const normalized = typeof choice === "string" ? { label: choice, value: choice } : choice;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.conceptChoice = normalized.value || normalized.id || String(index);
    button.dataset.correct = String(Boolean(normalized.correct));
    button.dataset.feedback = normalized.feedback || step.feedback || "";
    button.textContent = normalized.label || normalized.text || normalized.value;
    button.setAttribute("aria-pressed", "false");
    return button;
  }));
  dom.concept_next.hidden = stepIndex >= steps.length - 1;
  dom.concept_next.textContent = stepIndex + 1 === steps.length - 1 ? "看看我们发现了什么" : "继续发现";
  dom.concept_reset.hidden = stepIndex === 0;
  dom.poem_stage.classList.toggle("is-counting", /count|数/u.test(step.action) || /数数|几个字/u.test(step.prompt));
  dom.poem_stage.classList.toggle("is-rhyme-finding", /rhyme|押韵/u.test(step.action) || /押韵/u.test(step.prompt));
  dom.concept_followups.replaceChildren(...lesson.followUps.slice(0, 5).map((question) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.conceptQuestion = typeof question === "string" ? question : question.question || question.label;
    button.textContent = typeof question === "string" ? question : question.label || question.question;
    return button;
  }));
}

function openConcept(conceptId) {
  const lesson = conceptTutor.lesson(conceptId, currentProgress().ageMode);
  if (!lesson) return;
  state.concept = { id: conceptId, step: 0 };
  dom.concept_discovery.dataset.activeConcept = conceptId;
  dom.concept_discovery.hidden = false;
  dom.concept_answer.textContent = "";
  dom.concept_ask_input.value = "";
  renderConceptStep();
  dom.concept_discovery.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function closeConcept() {
  state.concept = { id: "", step: 0 };
  delete dom.concept_discovery.dataset.activeConcept;
  dom.concept_discovery.hidden = true;
  dom.poem_stage.classList.remove("is-counting", "is-rhyme-finding");
}

function answerConceptQuestion(question) {
  const result = conceptTutor.answer({ question, conceptId: state.concept.id, ageMode: currentProgress().ageMode });
  dom.concept_answer.textContent = `${result.message}${result.kind === "reviewed" ? "（来自本地已审核概念，不依赖在线 AI。）" : ""}`;
}

function openPoem(poemId) {
  const poem = learningPoemById[poemId] || phase1PoemById[poemId];
  if (!poem) return;
  audio.stop();
  resetSpeaking();
  resetReaderState();
  state.currentPoemId = poemId;
  state.selectedPlaceId = poem.placeId;
  const place = placeForPoem(poem);
  const progress = currentProgress();
  const mode = AGE_MODES[progress.ageMode];
  const age = poem.ageBands[progress.ageMode];
  const interaction = INTERACTIONS[poem.id] || defaultInteraction(poem);
  dom.reader_back.dataset.route = state.entryRoute;
  dom.reader_back.textContent = state.entryRoute === "curriculum" ? "回到教材目录" : "回到山河";
  dom.reader_art.src = placeArt(place.id);
  dom.reader_place_index.textContent = PLACE_STAGE[place.id] ? `${PLACE_STAGE[place.id]}站 · ${place.name}` : `${poem.maturity === "immersive" ? "完整诗境" : "标准学习页"} · ${place.name}`;
  dom.reader_spatial_path.textContent = place.id === "unknown" ? "中国 → 地点关系待核验" : `中国 → ${place.region || "文化区域"} → ${place.name}`;
  dom.reader_place.textContent = place.name;
  dom.reader_place_note.textContent = place.spatialStory;
  dom.reader_source.textContent = sourceSummary(poem, place);
  renderPoemTaxonomy(poem);
  dom.reader_title.textContent = poem.title.text;
  dom.poem_author.textContent = `${poem.author.name}${poem.author.pinyin ? ` · ${poem.author.pinyin}` : ""}`;
  dom.age_reading_note.textContent = ageCompletionCopy(progress.ageMode);
  dom.poem_image_cue.textContent = interaction.cue;
  dom.poem_source_line.textContent = `${poem.author.name} · 《${poem.title.text}》`;
  dom.poem_lines.dataset.lineCount = String(poem.lines.length);
  dom.poem_lines.replaceChildren(...poem.lines.map((line) => renderRubyLine(line, poem)));
  const pinyinAvailable = poem.lines.some((line) => line.tokens.some((token) => token.pinyin));
  dom.poem_stage.classList.toggle("pinyin-off", !store.shouldShowPinyin() || !pinyinAvailable);
  dom.pinyin_toggle.disabled = !pinyinAvailable;
  dom.pinyin_toggle.setAttribute("aria-pressed", String(pinyinAvailable && store.shouldShowPinyin()));
  dom.pinyin_toggle.textContent = pinyinAvailable ? (store.shouldShowPinyin() ? "拼音开" : "拼音关") : "拼音待审";
  dom.audio_status.textContent = progress.soundEnabled ? "也可以逐句点读" : "声音已关闭，仍可完整阅读";
  dom.keyword_strip.replaceChildren(...interaction.keywords.map((keyword) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = keyword;
    button.dataset.keyword = keyword;
    return button;
  }));
  dom.learning_step.textContent = age.label;
  dom.age_mode_label.textContent = `${mode.shortLabel}阅读方式`;
  dom.question_title.textContent = "山风想问";
  dom.question_copy.textContent = age.openingQuestion;
  dom.answer_options.replaceChildren(...interaction.options.map((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.answerId = option.id;
    button.setAttribute("aria-pressed", "false");
    button.textContent = option.label;
    return button;
  }));
  dom.hint_copy.textContent = "";
  dom.tutor_input.value = "";
  dom.tutor_response.textContent = "";
  dom.explanation_title.textContent = age.label;
  dom.explanation_copy.textContent = `${age.explanation} ${age.context}`;
  renderInterpretation(poem, progress.ageMode);
  renderCurriculumOrigin(poem);
  renderRelationLattice(poem);
  closeConcept();
  const nextPlace = phase1PlaceById[poem.nextPlaceId] || geoNodeById(poem.nextPlaceId);
  dom.next_place_title.textContent = nextPlace?.name || "回到山河";
  dom.next_place_reason.textContent = poem.nextReason;
  dom.next_place_button.dataset.placeId = poem.nextPlaceId;
  renderSiblingPoems(poem);
  updateCompletionControl();
  showScreen("reader");
  location.hash = `poem/${poem.id}`;
  requestAnimationFrame(() => dom.poem_stage.focus({ preventScroll: true }));
}

function renderSiblingPoems(poem) {
  dom.sibling_poems.replaceChildren();
  if (poem.placeId === "unknown") return;
  for (const sibling of placePoems(poem.placeId).filter((candidate) => candidate.id !== poem.id).slice(0, 3)) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.poemId = sibling.id;
    button.innerHTML = `<small>同一地点，换一双眼睛</small><br>《${sibling.title.text}》 · ${sibling.author.name}`;
    dom.sibling_poems.append(button);
  }
}

function resetSpeaking() {
  qa(".poem-line").forEach((line) => line.classList.remove("is-speaking", "is-muted"));
  dom.listen_poem.hidden = false;
  dom.stop_poem.hidden = true;
}

function setSpeakingLine(index) {
  qa(".poem-line").forEach((line, lineIndex) => {
    line.classList.toggle("is-speaking", lineIndex === index);
    line.classList.toggle("is-muted", lineIndex !== index);
  });
}

async function playWholePoem() {
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  if (!poem) return;
  if (!currentProgress().soundEnabled) {
    dom.audio_status.textContent = "声音已关闭。打开页首声音后可以朗读。";
    return;
  }
  state.reader.listened = true;
  updateCompletionControl();
  dom.listen_poem.hidden = true;
  dom.stop_poem.hidden = false;
  dom.audio_status.textContent = audio.isAvailable() ? "正在一行一行读" : "朗读暂不可用，先跟着上方拼音慢慢读";
  try {
    await audio.playLines(poem.lines, {
      onLineStart: setSpeakingLine,
      onLineEnd: () => {},
      onUnavailable: (message) => { dom.audio_status.textContent = message; },
    });
  } catch {
    dom.audio_status.textContent = "这次朗读没有成功。诗和拼音仍然完整可读。";
  } finally {
    resetSpeaking();
  }
}

async function playSingleLine(lineId) {
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  const index = poem?.lines.findIndex((line) => line.id === lineId) ?? -1;
  if (index < 0) return;
  if (!currentProgress().soundEnabled) {
    dom.audio_status.textContent = "声音已关闭，仍可以用眼睛跟着拼音读。";
    return;
  }
  state.reader.listened = true;
  updateCompletionControl();
  audio.stop();
  setSpeakingLine(index);
  dom.audio_status.textContent = `正在读第 ${index + 1} 句`;
  try {
    await audio.playLine(poem.lines[index], { onUnavailable: (message) => { dom.audio_status.textContent = message; } });
  } catch {
    dom.audio_status.textContent = "这一句暂时没能读出声。";
  } finally {
    resetSpeaking();
  }
}

function completionSatisfied() {
  const mode = currentProgress().ageMode;
  if (mode === "7-8") return state.reader.answerAttempted || state.reader.listened || state.reader.hintCount > 0;
  if (mode === "9-10") return state.reader.answerCorrect && state.reader.tutorTurns > 0;
  return state.reader.answerCorrect && state.reader.tutorTurns > 0;
}

function updateCompletionControl() {
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  if (poem && currentProgress().completedPoemIds.includes(poem.id)) {
    dom.complete_poem.disabled = true;
    dom.complete_poem.textContent = "已留下足迹";
    return;
  }
  const satisfied = completionSatisfied();
  dom.complete_poem.disabled = !satisfied;
  if (satisfied) dom.complete_poem.textContent = "完成这首诗";
  else if (currentProgress().ageMode === "7-8") dom.complete_poem.textContent = "先听、选或看一次提示";
  else dom.complete_poem.textContent = "先选择证据并回应一次";
}

function handleAnswer(answerId) {
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  const interaction = INTERACTIONS[state.currentPoemId] || defaultInteraction(poem);
  const option = interaction.options.find((item) => item.id === answerId);
  if (!option) return;
  state.reader.answerAttempted = true;
  state.reader.selectedAnswer = answerId;
  state.reader.answerCorrect = Boolean(option.correct);
  qa("[data-answer-id]", dom.answer_options).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.answerId === answerId)));
  store.recordObservation(state.currentPoemId, { attempted: true });
  if (option.correct) {
    dom.hint_copy.textContent = "你已经抓住了这首诗的空间线索。接着用自己的话说说，诗里的哪个词支持你。";
  } else if (answerId === "unsure") {
    dom.hint_copy.textContent = "不知道也可以。先点一个红色提示词，再回到整首诗里看。";
  } else {
    dom.hint_copy.textContent = "先不公布答案。回到诗里找表示方向、远近、天气或时间的词，再选一次。";
  }
  updateCompletionControl();
}

function showHint() {
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  const mode = AGE_MODES[currentProgress().ageMode];
  const age = poem.ageBands[currentProgress().ageMode];
  if (state.reader.hintCount >= mode.hintCount) {
    dom.hint_copy.textContent = "这一轮微提示已经用完。可以点诗句逐句听，或先说‘我不知道’。";
    return;
  }
  state.reader.hintCount += 1;
  store.recordObservation(poem.id, { usedHint: true });
  dom.hint_copy.textContent = state.reader.hintCount === 1 ? age.hint : age.followUp;
  dom.hint_button.textContent = `再给一点提示（${Math.max(0, mode.hintCount - state.reader.hintCount)}）`;
  updateCompletionControl();
}

async function submitTutor(event) {
  event.preventDefault();
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  const input = dom.tutor_input.value;
  state.reader.tutorTurns += 1;
  dom.tutor_response.textContent = "山风正在回到诗句里……";
  const interaction = INTERACTIONS[poem.id] || defaultInteraction(poem);
  const result = await tutor.respond({
    input,
    lesson: { ...poem, cue: interaction.cue, keywords: interaction.keywords, tutor: { hints: [poem.ageBands[currentProgress().ageMode].hint, poem.ageBands[currentProgress().ageMode].followUp], evidenceWords: interaction.keywords } },
    ageMode: currentProgress().ageMode,
    turn: state.reader.tutorTurns,
  });
  dom.tutor_response.textContent = `${result.message}${result.microHint ? ` ${result.microHint}` : ""}${result.degraded ? "（AI 暂不可用，这是本地诗句引导。）" : ""}`;
  updateCompletionControl();
}

function completeCurrentPoem() {
  const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
  if (!poem) return;
  const place = placeForPoem(poem);
  if (currentProgress().completedPoemIds.includes(poem.id)) {
    updateCompletionControl();
    return;
  }
  store.completePoem(poem.id, place.id);
  store.recordObservation(poem.id, { completed: true });
  updateHeader();
  dom.completion_copy.textContent = `你完成了${place.name}的《${poem.title.text}》。足迹保存的是完成状态，不是你刚才写下的原话。`;
  dom.completion_next.dataset.placeId = poem.nextPlaceId;
  if (typeof dom.completion_dialog.showModal === "function") dom.completion_dialog.showModal();
}

function allClaims() {
  const fromPoems = learningCatalog.flatMap((poem) => poem.curriculumClaims || []);
  const source = CURRICULUM_CLAIMS.length ? CURRICULUM_CLAIMS : fromPoems;
  return source.map((claim) => ({ ...claim, poemId: claim.poemId || claim.contentId }));
}

function normalizedStage(value) {
  if (/小学|primary/u.test(value || "")) return "小学";
  if (/初中|middle|七年级|八年级|九年级/u.test(value || "")) return "初中";
  if (/高中|high|必修|选择性/u.test(value || "")) return "高中";
  return value || "小学";
}

function gradeNumber(grade) {
  return { 一年级: 1, 二年级: 2, 三年级: 3, 四年级: 4, 五年级: 5, 六年级: 6, 七年级: 7, 八年级: 8, 九年级: 9, 高一: 10, 高二: 11, 高三: 12 }[grade] || Number.parseInt(grade, 10) || 0;
}

function semesterLabel(value) {
  return value === "autumn" ? "上册" : value === "spring" ? "下册" : value || "";
}

function displayGrade(value) {
  const numeric = String(value || "");
  const labels = { 1: "一年级", 2: "二年级", 3: "三年级", 4: "四年级", 5: "五年级", 6: "六年级", 7: "七年级", 8: "八年级", 9: "九年级", 10: "高一", 11: "高二", 12: "高三" };
  if (labels[numeric]) return labels[numeric];
  if (/^\d+-\d+$/u.test(numeric)) {
    const [start, end] = numeric.split("-");
    return `${labels[start] || start}—${labels[end] || end}`;
  }
  return numeric || "年级待核验";
}

function placementLabel(value) {
  return value === "in-class" ? "课内" : value === "extra" ? "课外诵读" : "目录";
}

function requirementLabel(value) {
  if (value === "textbook_inclusion") return "教材课文";
  if (value === "textbook_extra_recitation") return "课外古诗词诵读";
  if (value === "recommended_memorization") return "课标推荐候选";
  return value || "目录关系";
}

function gradeOptions(stage) {
  if (stage === "小学") return ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];
  if (stage === "初中") return ["七年级", "八年级", "九年级"];
  return ["高一", "高二", "高三"];
}

function catalogClaim(poem) {
  const claims = poem.curriculumClaims || allClaims().filter((claim) => claim.poemId === poem.id);
  return claims.find((claim) => /verified/u.test(claim.verificationStatus)) || claims[0] || null;
}

function maturityLabel(poem) {
  if (poem.maturity === "immersive" || IMMERSIVE_IDS.includes(poem.id)) return "沉浸式诗境";
  if (poem.maturity === "guided" || GUIDED_IDS.includes(poem.id)) return "引导式学习";
  return "标准学习页";
}

function stageCounts() {
  const counts = { 小学: new Set(), 初中: new Set(), 高中: new Set() };
  for (const poem of learningCatalog) {
    const claim = catalogClaim(poem);
    if (!claim) continue;
    const stage = normalizedStage(claim.stage);
    if (counts[stage]) counts[stage].add(poem.id);
  }
  return Object.fromEntries(Object.entries(counts).map(([stage, values]) => [stage, values.size]));
}

function renderCurriculumTally() {
  const counts = stageCounts();
  const verified = allClaims().filter((claim) => /verified/u.test(claim.verificationStatus)).length;
  const standard = learningCatalog.filter((poem) => ["standard", "guided", "immersive"].includes(poem.maturity) || poem.lines?.length).length;
  dom.corpus_tally.innerHTML = [
    [counts.小学 || 0, "小学诗词目录关系"],
    [counts.初中 || 0, "初中诗词目录关系"],
    [counts.高中 || 0, "高中诗词目录关系"],
    [standard, `可打开标准页 · ${verified} 项关系已核验`],
  ].map(([count, label]) => `<div><strong>${count}</strong><small>${label}</small></div>`).join("");
}

function renderStageTabs() {
  dom.stage_tabs.replaceChildren(...["小学", "初中", "高中"].map((stage) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.curriculumStage = stage;
    button.setAttribute("aria-pressed", String(state.curriculum.stage === stage));
    button.textContent = stage;
    return button;
  }));
}

function renderGradeList() {
  dom.grade_list.replaceChildren(...gradeOptions(state.curriculum.stage).map((grade) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.curriculumGrade = grade;
    button.setAttribute("aria-pressed", String(state.curriculum.grade === grade));
    button.textContent = grade;
    return button;
  }));
}

function claimMatchesSelection(claim) {
  if (!claim) return false;
  const selectedGrade = gradeNumber(state.curriculum.grade);
  const claimGrades = String(claim.grade || "").split("-").map(Number).filter(Number.isFinite);
  const gradeMatch = claim.grade === state.curriculum.grade
    || claimGrades.includes(selectedGrade)
    || (normalizedStage(claim.stage) === "高中" && selectedGrade >= 10);
  const semesterMatch = state.curriculum.semester === "all" || semesterLabel(claim.semester) === state.curriculum.semester;
  return normalizedStage(claim.stage) === state.curriculum.stage && gradeMatch && semesterMatch;
}

function renderCatalogResults() {
  const query = state.curriculum.query.trim().toLocaleLowerCase("zh-CN");
  const selected = learningCatalog.filter((poem) => {
    const claim = catalogClaim(poem);
    const relationMatch = claimMatchesSelection(claim);
    if (!query) return relationMatch;
    const haystack = [poem.title.text, poem.author.name, poem.genre, ...(poem.themes || []), ...poem.placeCandidates || []].join(" ").toLocaleLowerCase("zh-CN");
    return haystack.includes(query) && (relationMatch || normalizedStage(claim?.stage) === state.curriculum.stage);
  }).sort((a, b) => {
    const aVerified = /verified/u.test(catalogClaim(a)?.verificationStatus || "") ? 1 : 0;
    const bVerified = /verified/u.test(catalogClaim(b)?.verificationStatus || "") ? 1 : 0;
    if (aVerified !== bVerified) return bVerified - aVerified;
    return a.title.text.localeCompare(b.title.text, "zh-CN");
  });
  dom.catalog_kicker.textContent = `${state.curriculum.stage} · ${state.curriculum.grade}${state.curriculum.semester === "all" ? "" : ` · ${state.curriculum.semester}`}`;
  dom.catalog_heading.textContent = query ? `“${state.curriculum.query}”的目录结果` : "诗词学习目录";
  const verifiedCount = selected.filter((poem) => /verified/u.test(catalogClaim(poem)?.verificationStatus || "")).length;
  dom.catalog_count.textContent = `${selected.length} 首 · ${verifiedCount} 首教材关系已核验`;
  if (!selected.length) {
    dom.catalog_list.innerHTML = `<div class="catalog-empty"><strong>这一格没有被硬填满。</strong><br>可能是当前筛选没有结果，也可能是教材关系仍待核验。可以换年级、清除搜索，或去山河地图探索。</div>`;
    return;
  }
  dom.catalog_list.replaceChildren(...selected.map((poem) => {
    const claim = catalogClaim(poem);
    const card = document.createElement("article");
    card.className = `catalog-card${/verified/u.test(claim?.verificationStatus || "") ? "" : " is-candidate"}`;
    const claimCopy = /verified/u.test(claim?.verificationStatus || "")
      ? `${placementLabel(claim.inClassOrExtra)} · ${requirementLabel(claim.requiredOrRecommended)}`
      : "目录候选 · 不作为正式教材事实";
    card.innerHTML = `<span class="tier-mark">${maturityLabel(poem)}</span><h3>《${poem.title.text}》</h3><p>${poem.dynasty} · ${poem.author.name} · ${poem.genre}</p><p class="claim-mark">${claimCopy}</p><button type="button" data-poem-id="${poem.id}" data-entry-route="curriculum">读原诗</button>`;
    return card;
  }));
}

function renderCurriculum() {
  if (!dom.corpus_tally) return;
  if (!gradeOptions(state.curriculum.stage).includes(state.curriculum.grade)) state.curriculum.grade = gradeOptions(state.curriculum.stage)[0];
  renderCurriculumTally();
  renderStageTabs();
  renderGradeList();
  qa("[data-semester]", dom.semester_tabs).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.semester === state.curriculum.semester)));
  const framework = CURRICULUM_CONFIG.defaultEdition || CURRICULUM_CONFIG.defaultSnapshot || CURRICULUM_CONFIG.name || "6-3学制统编语文";
  dom.curriculum_edition_note.textContent = `${framework}。课程标准推荐、教材课文、课外诵读分别记录；2024修订教材按起始年级逐年换用，具体学校仍可能不同。`;
  renderCatalogResults();
}

function coverageStats() {
  const claims = allClaims();
  const verifiedClaims = claims.filter((claim) => /verified/u.test(claim.verificationStatus));
  const standard = learningCatalog.length;
  const guided = learningCatalog.filter((poem) => poem.maturity === "guided" || poem.maturity === "immersive" || GUIDED_IDS.includes(poem.id) || IMMERSIVE_IDS.includes(poem.id)).length;
  const immersive = learningCatalog.filter((poem) => poem.maturity === "immersive" || IMMERSIVE_IDS.includes(poem.id)).length;
  const pinyinReviewed = learningCatalog.filter((poem) => poem.review?.pinyinReviewed || poem.reviewFlags?.pinyinReviewed || phase1PoemById[poem.id]).length;
  const geoReviewed = learningCatalog.filter((poem) => poem.review?.geoReviewed || poem.reviewFlags?.geoReviewed || phase1PoemById[poem.id]).length;
  const conceptReviewed = learningCatalog.filter((poem) => poem.review?.conceptReviewed || poem.reviewFlags?.conceptReviewed || conceptRelationsForPoem(poem.id).some((relation) => /reviewed|curated/u.test(relation.reviewStatus || ""))).length;
  const gradeVerification = Object.fromEntries([...gradeOptions("小学"), ...gradeOptions("初中"), ...gradeOptions("高中")].map((grade) => [grade, 0]));
  for (const claim of verifiedClaims) {
    const label = displayGrade(claim.grade);
    if (label in gradeVerification) gradeVerification[label] += 1;
  }
  const verifiedGrades = Object.values(gradeVerification).filter((count) => count > 0).length;
  const verifiedSemesters = new Set(verifiedClaims.map((claim) => claim.semester).filter((semester) => ["autumn", "spring"].includes(semester))).size;
  const genres = new Set(learningCatalog.map((poem) => poem.genre).filter(Boolean)).size;
  const dynasties = new Set(learningCatalog.map((poem) => poem.dynasty).filter(Boolean)).size;
  const poets = new Set(learningCatalog.map((poem) => poem.author?.name).filter(Boolean)).size;
  const licenseDeclared = learningCatalog.filter((poem) => {
    const sources = poem.provenance?.sources || poem.sources || (poem.sourceSnapshot ? [poem.sourceSnapshot] : []);
    return sources.some((source) => source?.license || source?.rights);
  }).length;
  const mappedPoems = learningCatalog.filter((poem) => placeForPoem(poem).id !== "unknown").length;
  return { claims: claims.length, verifiedClaims: verifiedClaims.length, standard, guided, immersive, pinyinReviewed, geoReviewed, conceptReviewed, regions: CULTURAL_REGIONS.length, places: GEO_NODES.filter((node) => node.positionKind !== "unknown").length, verifiedGrades, verifiedSemesters, gradeVerification, genres, dynasties, poets, licenseDeclared, mappedPoems };
}

function renderCoverage() {
  if (!dom.coverage_grid) return;
  const stats = coverageStats();
  const cards = [
    [stats.standard, stats.standard, "标准学习页", "每一首都有可打开的规范原文页"],
    [stats.guided, stats.standard, "引导式学习", "年龄分层问题与观察任务"],
    [stats.immersive, stats.standard, "沉浸式诗境", "地点、概念、朗读与关系完整"],
    [stats.verifiedClaims, stats.claims || 1, "教材关系已核验", "未核验项不会冒充正式目录"],
    [stats.pinyinReviewed, stats.standard, "拼音已审核", "机器候选与人工复核分开"],
    [stats.conceptReviewed, stats.standard, "概念已审核", "正式术语有年龄分层入口"],
    [stats.geoReviewed, stats.standard, "地理关系已审核", "unknown 不落图"],
    [stats.places, stats.places, `${stats.regions} 条文化区域/诗路`, "40个可落图参照点，超过15个最低目标"],
    [stats.verifiedGrades, 12, "逐年级目录已核验", "其余年级仍可浏览候选，但不冒充正式教材事实"],
    [stats.verifiedSemesters, 2, "上下册逐项核验", "当前逐项证据集中在上册，缺口明确保留"],
    [stats.genres, stats.genres, "体裁索引", `${stats.dynasties} 个时代标签 · ${stats.poets} 位作者`],
    [stats.mappedPoems, stats.standard, "有地点关系记录", "未核验的点仍保持候选或 unknown"],
    [stats.licenseDeclared, stats.standard, "来源/许可字段完整", "生产语料与仅供参考仓库分开"],
  ];
  dom.coverage_grid.replaceChildren(...cards.map(([value, max, label, copy]) => {
    const card = document.createElement("article");
    card.className = "coverage-card";
    card.innerHTML = `<p class="section-kicker">${label}</p><strong>${value}</strong><progress max="${Math.max(max, 1)}" value="${Math.min(value, Math.max(max, 1))}">${value}/${max}</progress><p>${copy}</p>`;
    return card;
  }));
  const noPlace = learningCatalog.filter((poem) => placeForPoem(poem).id === "unknown").length;
  const candidateClaims = Math.max(0, stats.claims - stats.verifiedClaims);
  const sparseRegions = CULTURAL_REGIONS.filter((region) => {
    const placeIds = region.placeIds || region.anchorNodeIds || [];
    return learningCatalog.filter((poem) => poem.regionIds?.includes(region.id) || placeIds.some((id) => poem.placeCandidates?.includes(id))).length < 3;
  }).map((region) => region.name);
  dom.coverage_gaps.innerHTML = [
    `${candidateClaims} 项教材关系仍是候选，必须继续逐册核验。`,
    `逐项已核年级：${Object.entries(stats.gradeVerification).filter(([, count]) => count > 0).map(([grade, count]) => `${grade}${count}首`).join("、") || "暂无"}；其它年级保持候选状态。`,
    `${noPlace} 首没有可靠地点，保持“不落图”而不是制造坐标。`,
    `${Math.max(0, stats.standard - stats.pinyinReviewed)} 首拼音仍只在审核管线中，儿童页不展示机器候选。`,
    sparseRegions.length ? `内容较稀的区域：${sparseRegions.join("、")}。` : "8 条文化区域/诗路均已有可进入内容。",
  ].map((copy) => `<p>${copy}</p>`).join("");
}

function renderRegions() {
  if (!dom.region_tabs) return;
  dom.region_tabs.replaceChildren(...CULTURAL_REGIONS.map((region) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.regionId = region.id;
    button.setAttribute("aria-pressed", String(state.regionId === region.id));
    button.textContent = region.name;
    return button;
  }));
  const active = CULTURAL_REGIONS.find((region) => region.id === state.regionId);
  const activePlaces = active ? (active.placeIds || active.anchorNodeIds || []) : [];
  const activePoems = active ? learningCatalog.filter((poem) => poem.regionIds?.includes(active.id) || activePlaces.some((id) => poem.placeCandidates?.includes(id))).length : 0;
  dom.region_reset.hidden = !active;
  dom.region_summary.innerHTML = active
    ? `<strong>${active.name}</strong><span>${active.childSummary || active.description || "这是一条产品探索关系，不冒充诗人的真实旅行路线。"} · ${activePlaces.length} 个地点 · ${activePoems} 首相关诗。</span>`
    : "";
}

function renderDaily() {
  const poem = dailyPoem();
  const place = phase1PlaceById[poem.placeId];
  dom.daily_feature.innerHTML = `<div class="daily-feature-grid"><div class="daily-feature-art"><img src="${placeArt(place.id)}" alt="${place.name}诗境画面"></div><div><p class="section-kicker">${localDateKey()} · ${place.name}</p><h2>《${poem.title.text}》</h2><p>${poem.dynasty} · ${poem.author.name} · ${poem.genre}</p><p>${poem.ageBands[currentProgress().ageMode].explanation}</p><button type="button" data-poem-id="${poem.id}">进入今天的诗境</button></div></div>`;
}

function deterministicChoices(correctPlaceId) {
  const correctIndex = PLACE_ORDER.indexOf(correctPlaceId);
  return [correctPlaceId, PLACE_ORDER[(correctIndex + 2) % PLACE_ORDER.length], PLACE_ORDER[(correctIndex + 4) % PLACE_ORDER.length]];
}

function renderChallenge() {
  const poem = dailyPoem();
  const evidence = poem.lines[poem.spatialLearning.evidenceLineIds.length > 2 ? 1 : 0] || poem.lines[0];
  const progress = currentProgress();
  const challengeDone = progress.challenge.date === localDateKey() && progress.challenge.poemId === poem.id && progress.challenge.completed;
  state.challengeAttempts = 0;
  dom.challenge_panel.innerHTML = `<p class="section-kicker">今日线索 · ${poem.dynasty}诗</p><blockquote class="challenge-quote">“${evidence.text}”</blockquote><p>这句诗应该回到哪一处完整诗境？先看景物和方向，不比速度。</p><div class="challenge-options">${deterministicChoices(poem.placeId).map((id) => `<button type="button" data-challenge-place="${id}">${phase1PlaceById[id].name}</button>`).join("")}</div><p class="challenge-feedback" role="status">${challengeDone ? "今天的山河关系已经连好了。" : ""}</p>`;
}

function handleChallenge(placeId) {
  const poem = dailyPoem();
  const feedback = q(".challenge-feedback", dom.challenge_panel);
  state.challengeAttempts += 1;
  if (placeId === poem.placeId) {
    feedback.textContent = `找到了。这句诗属于${phase1PlaceById[placeId].name}。你把诗句和地点重新连了起来。`;
    store.setChallenge({ date: localDateKey(), poemId: poem.id, completed: true });
    qa("[data-challenge-place]", dom.challenge_panel).forEach((button) => { button.disabled = true; });
  } else {
    feedback.textContent = state.challengeAttempts === 1
      ? "先不公布答案。看看诗句里的景物，是山、楼、湖、雨夜，还是古城。"
      : `再用一个微提示：${poem.spatialLearning.observation}`;
  }
}

function renderProgress() {
  const progress = currentProgress();
  dom.progress_grid.replaceChildren();
  for (const place of phase1Places) {
    const completed = place.poemIds.filter((id) => progress.completedPoemIds.includes(id)).length;
    const card = document.createElement("article");
    card.className = "progress-place";
    card.innerHTML = `<span>${completed === 2 ? "地点完成" : `${completed} / 2 首`}</span><h2>${place.name}</h2><p>${place.region} · ${place.spatialStory}</p><div class="progress-poems">${placePoems(place.id).map((poem) => `<button type="button" class="${progress.completedPoemIds.includes(poem.id) ? "is-complete" : ""}" data-poem-id="${poem.id}">${progress.completedPoemIds.includes(poem.id) ? "已读" : "未读"} · ${poem.title.text}</button>`).join("")}</div>`;
    dom.progress_grid.append(card);
  }
}

function renderAgeOptions() {
  const progress = currentProgress();
  dom.age_options.replaceChildren();
  for (const mode of Object.values(AGE_MODES)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "age-option";
    button.dataset.ageMode = mode.id;
    button.setAttribute("aria-pressed", String(progress.ageMode === mode.id));
    const detail = mode.id === "7-8" ? "默认显示拼音 · 选择与动作提示" : mode.id === "9-10" ? "默认显示拼音 · 空间关系与表达" : "默认隐藏拼音 · 证据、结构与比较";
    button.innerHTML = `<strong>${mode.label}</strong><small>${detail}</small><span>${progress.ageMode === mode.id ? "正在使用" : "选择"}</span>`;
    dom.age_options.append(button);
  }
}

function setAgeMode(modeId) {
  store.setAgeMode(modeId);
  renderAgeOptions();
  updateHeader();
  dom.age_dialog.close();
  if (state.route === "reader" && state.currentPoemId) openPoem(state.currentPoemId);
  if (state.route === "daily") renderDaily();
}

function armReset() {
  if (!state.resetArmed) {
    state.resetArmed = true;
    dom.reset_progress.textContent = "再点一次，清除本机足迹";
    setTimeout(() => {
      state.resetArmed = false;
      dom.reset_progress.textContent = "重置本机足迹";
    }, 5000);
    return;
  }
  store.reset();
  state.resetArmed = false;
  dom.reset_progress.textContent = "已清除本机足迹";
  updateHeader();
  renderProgress();
}

document.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]")?.dataset.route;
  if (route) { event.preventDefault(); routeTo(route); return; }
  const placeId = event.target.closest("[data-place-id]")?.dataset.placeId;
  if (placeId) { selectPlace(placeId); return; }
  const poemTarget = event.target.closest("[data-poem-id]");
  const poemId = poemTarget?.dataset.poemId;
  if (poemId) {
    state.entryRoute = poemTarget.dataset.entryRoute || (state.route === "curriculum" ? "curriculum" : "map");
    openPoem(poemId);
    return;
  }
  const conceptId = event.target.closest("[data-concept-id]")?.dataset.conceptId;
  if (conceptId) { openConcept(conceptId); return; }
  const conceptChoice = event.target.closest("[data-concept-choice]");
  if (conceptChoice) {
    qa("[data-concept-choice]", dom.concept_choices).forEach((button) => button.setAttribute("aria-pressed", String(button === conceptChoice)));
    const lesson = activeConceptLesson();
    const currentStep = lesson?.steps?.[Math.min(state.concept.step, Math.max(lesson.steps.length - 1, 0))];
    const isCounting = /数|几个字|count/u.test(`${currentStep?.prompt || ""}${currentStep?.childAction || currentStep?.action || ""}`);
    dom.concept_feedback.textContent = conceptChoice.dataset.correct === "true"
      ? (conceptChoice.dataset.feedback || "找到了。先别急着背名称，继续看看其它诗句是不是也符合。")
      : (isCounting ? "回到被标出的诗句再数一次，标点不算字。" : "再回到当前问题比较一次；答案要能被诗句里的证据支持。");
    return;
  }
  const conceptQuestion = event.target.closest("[data-concept-question]")?.dataset.conceptQuestion;
  if (conceptQuestion) { dom.concept_ask_input.value = conceptQuestion; answerConceptQuestion(conceptQuestion); return; }
  const regionId = event.target.closest("[data-region-id]")?.dataset.regionId;
  if (regionId) { state.regionId = regionId; renderRegions(); renderMapMarkers(); return; }
  const curriculumStage = event.target.closest("[data-curriculum-stage]")?.dataset.curriculumStage;
  if (curriculumStage) { state.curriculum.stage = curriculumStage; state.curriculum.grade = gradeOptions(curriculumStage)[0]; renderCurriculum(); return; }
  const curriculumGrade = event.target.closest("[data-curriculum-grade]")?.dataset.curriculumGrade;
  if (curriculumGrade) { state.curriculum.grade = curriculumGrade; renderCurriculum(); return; }
  const semester = event.target.closest("[data-semester]")?.dataset.semester;
  if (semester) { state.curriculum.semester = semester; renderCurriculum(); return; }
  const corpusFilter = event.target.closest("[data-corpus-filter-kind]");
  if (corpusFilter) {
    const kind = corpusFilter.dataset.corpusFilterKind;
    const value = corpusFilter.dataset.corpusFilterValue;
    if (kind === "grade") state.curriculum.grade = value;
    else if (kind === "region") { state.regionId = value; routeTo("map"); renderRegions(); renderMapMarkers(); return; }
    else state.curriculum.query = value;
    dom.corpus_search.value = state.curriculum.query;
    routeTo("curriculum");
    return;
  }
  const filter = event.target.closest("[data-filter]")?.dataset.filter;
  if (filter) {
    state.filter = filter;
    qa("[data-filter]", dom.map_filters).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
    renderMapMarkers();
    return;
  }
  if (event.target.closest("[data-clear-filter]")) {
    state.filter = "all";
    qa("[data-filter]", dom.map_filters).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === "all")));
    renderMapMarkers();
    return;
  }
  const lineId = event.target.closest("[data-speak-line]")?.dataset.speakLine;
  if (lineId) { playSingleLine(lineId); return; }
  const answerId = event.target.closest("[data-answer-id]")?.dataset.answerId;
  if (answerId) { handleAnswer(answerId); return; }
  const keyword = event.target.closest("[data-keyword]")?.dataset.keyword;
  if (keyword) {
    const poem = learningPoemById[state.currentPoemId] || phase1PoemById[state.currentPoemId];
    const line = poem.lines.find((candidate) => candidate.text.includes(keyword));
    dom.hint_copy.textContent = line ? `回到“${line.text}”看一眼：这个词让画面怎样变化？` : `抓住“${keyword}”，再看它前后的动词。`;
    return;
  }
  const challengePlace = event.target.closest("[data-challenge-place]")?.dataset.challengePlace;
  if (challengePlace) { handleChallenge(challengePlace); return; }
  const ageMode = event.target.closest("[data-age-mode]")?.dataset.ageMode;
  if (ageMode) { setAgeMode(ageMode); }
  const originId = event.target.closest("[data-origin-id]")?.dataset.originId;
  if (originId) {
    store.setOrigin(originId);
    renderOriginOptions();
    updateHeader();
    dom.origin_panel.hidden = true;
    dom.origin_trigger.setAttribute("aria-expanded", "false");
  }
});

dom.map_list_toggle.addEventListener("click", () => {
  const expanded = dom.map_list_toggle.getAttribute("aria-expanded") === "true";
  dom.map_list_toggle.setAttribute("aria-expanded", String(!expanded));
  dom.map_text_list.hidden = expanded;
});
dom.place_close.addEventListener("click", () => { state.selectedPlaceId = ""; dom.place_dock.hidden = true; renderMapMarkers(); });
dom.region_reset.addEventListener("click", () => { state.regionId = ""; renderRegions(); renderMapMarkers(); });
dom.daily_card.addEventListener("click", () => routeTo("daily"));
dom.origin_trigger.addEventListener("click", () => {
  const expanded = dom.origin_trigger.getAttribute("aria-expanded") === "true";
  dom.origin_trigger.setAttribute("aria-expanded", String(!expanded));
  dom.origin_panel.hidden = expanded;
});
dom.listen_poem.addEventListener("click", playWholePoem);
dom.stop_poem.addEventListener("click", () => { audio.stop(); resetSpeaking(); dom.audio_status.textContent = "朗读已停止"; });
dom.pinyin_toggle.addEventListener("click", () => {
  if (dom.pinyin_toggle.disabled) return;
  const visible = dom.pinyin_toggle.getAttribute("aria-pressed") === "true";
  store.setPinyinPreference(!visible);
  dom.pinyin_toggle.setAttribute("aria-pressed", String(!visible));
  dom.pinyin_toggle.textContent = !visible ? "拼音开" : "拼音关";
  dom.poem_stage.classList.toggle("pinyin-off", visible);
});
dom.concept_close.addEventListener("click", closeConcept);
dom.concept_next.addEventListener("click", () => { state.concept.step += 1; renderConceptStep(); });
dom.concept_reset.addEventListener("click", () => { state.concept.step = 0; dom.concept_feedback.textContent = ""; renderConceptStep(); });
dom.concept_ask_form.addEventListener("submit", (event) => { event.preventDefault(); answerConceptQuestion(dom.concept_ask_input.value); });
dom.corpus_search.addEventListener("input", () => { state.curriculum.query = dom.corpus_search.value; renderCatalogResults(); });
dom.coverage_open.addEventListener("click", () => routeTo("coverage"));
dom.meaning_card.addEventListener("toggle", () => {
  const stateLabel = q("summary i", dom.meaning_card);
  if (stateLabel) stateLabel.textContent = dom.meaning_card.open ? "收起" : "展开";
});
dom.hint_button.addEventListener("click", showHint);
dom.tutor_form.addEventListener("submit", submitTutor);
dom.complete_poem.addEventListener("click", completeCurrentPoem);
dom.next_place_button.addEventListener("click", () => { routeTo("map"); selectPlace(dom.next_place_button.dataset.placeId); });
dom.age_trigger.addEventListener("click", () => { renderAgeOptions(); dom.age_dialog.showModal(); });
dom.sound_toggle.addEventListener("click", () => {
  const enabled = !currentProgress().soundEnabled;
  store.setSoundEnabled(enabled);
  if (!enabled) audio.stop();
  updateHeader();
});
dom.completion_next.addEventListener("click", () => { const id = dom.completion_next.dataset.placeId; dom.completion_dialog.close(); routeTo("map"); selectPlace(id); });
dom.completion_map.addEventListener("click", () => { dom.completion_dialog.close(); routeTo("map"); });
dom.reset_progress.addEventListener("click", armReset);

window.addEventListener("hashchange", () => {
  const hash = location.hash.slice(1);
  if (hash.startsWith("poem/")) {
    const id = hash.slice(5);
    if (id !== state.currentPoemId || state.route !== "reader") openPoem(id);
  } else if (["map", "curriculum", "coverage", "daily", "challenge", "progress"].includes(hash)) showScreen(hash);
});

document.addEventListener("visibilitychange", () => { if (document.hidden) audio.stop(); });
window.addEventListener("beforeunload", () => audio.stop());

window.__SHANHE_PHASE1__ = {
  phase1Places,
  get phase1Poems() { return learningCatalog.length ? learningCatalog : phase1Poems.map((poem) => ({ ...poem, maturity: "immersive", contentTier: "immersive" })); },
  store,
  getState: () => structuredClone(state),
  openPoem,
  selectPlace,
  dailyPoem,
  audio,
  tutor,
  conceptTutor,
  get curriculum() { return { config: CURRICULUM_CONFIG, claims: CURRICULUM_CLAIMS, concepts: CONCEPTS, poemConcepts: POEM_CONCEPTS, regions: CULTURAL_REGIONS, geoNodes: GEO_NODES, catalog: learningCatalog }; },
  get coverage() { return coverageStats(); },
};

updateHeader();
renderOriginOptions();
renderAgeOptions();
renderDaily();
renderChallenge();
renderProgress();
renderCurriculum();
renderRegions();
renderCoverage();
loadMap();
loadLearningCatalog();
const initialHash = location.hash.slice(1);
if (initialHash.startsWith("poem/")) openPoem(initialHash.slice(5));
else showScreen(["map", "curriculum", "coverage", "daily", "challenge", "progress"].includes(initialHash) ? initialHash : "map");
