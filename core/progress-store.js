const STORAGE_KEY = "shanhe.phase1.progress";
const CURRENT_VERSION = 3;
const RECENT_LIMIT = 12;
const DAY_MS = 24 * 60 * 60 * 1000;
const REVIEW_INTERVAL_MS = DAY_MS;
const REVIEW_INTERVAL_DAYS = Object.freeze([1, 3, 7]);
const MASTERY_STATES = Object.freeze([
  "new",
  "understood_lines",
  "understood_whole",
  "understood_theme",
  "recited_once",
  "retained",
  "mastered",
]);
const MASTERY_STATE_RANK = Object.freeze(Object.fromEntries(MASTERY_STATES.map((value, index) => [value, index])));
const MASTERY_MARK_KEYS = Object.freeze(["understood", "theme", "recited", "retained"]);
const LEGACY_KEYS = {
  journey: ["shanhe-shijing-journey-v2", "shanhe.journey.v2", "shanhe-journey-v2"],
  pinyin: ["shanhe-shijing-pinyin", "shanhe.pinyin", "shanhe-pinyin"],
  origin: ["shanhe-shijing-origin-city", "shanhe.origin-city", "shanhe-origin-city"],
};

export { MASTERY_STATES, MASTERY_MARK_KEYS, REVIEW_INTERVAL_DAYS };

export const AGE_MODES = {
  "7-8": {
    id: "7-8",
    label: "初识 · 7–8岁",
    shortLabel: "7–8岁",
    pinyinDefault: true,
    explanationDepth: "image",
    questionStyle: "choice-first",
    hintCount: 3,
    completion: "read-and-observe",
  },
  "9-10": {
    id: "9-10",
    label: "进阶 · 9–10岁",
    shortLabel: "9–10岁",
    pinyinDefault: true,
    explanationDepth: "language-and-space",
    questionStyle: "observe-then-write",
    hintCount: 2,
    completion: "read-observe-express",
  },
  "11-12": {
    id: "11-12",
    label: "深读 · 11–12岁",
    shortLabel: "11–12岁",
    pinyinDefault: false,
    explanationDepth: "context-and-craft",
    questionStyle: "evidence-first",
    hintCount: 1,
    completion: "read-evidence-reflect",
  },
};

function defaultState() {
  return {
    version: CURRENT_VERSION,
    ageMode: "7-8",
    pinyinPreference: null,
    completedPoemIds: [],
    visitedPlaceIds: [],
    observationByPoem: {},
    favoritePoemIds: [],
    recentPoemIds: [],
    reviewByPoem: {},
    masteryByPoem: {},
    challenge: { date: "", poemId: "", completed: false },
    originCityId: "",
    soundEnabled: true,
    lastPoemId: "",
  };
}

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter((value) => typeof value === "string" && value))];
}

function timestamp(value) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return 0;
}

function normalizeReview(value) {
  const review = value && typeof value === "object" ? value : {};
  return {
    count: Math.max(0, Math.floor(Number(review.count) || 0)),
    lastPracticedAt: timestamp(review.lastPracticedAt),
    nextReviewAt: timestamp(review.nextReviewAt),
    intervalDays: REVIEW_INTERVAL_DAYS.includes(Number(review.intervalDays))
      ? Number(review.intervalDays)
      : 0,
  };
}

function normalizeMastery(value) {
  const mastery = value && typeof value === "object" ? value : {};
  const marks = mastery.marks && typeof mastery.marks === "object" ? mastery.marks : {};
  const markAt = Object.fromEntries(MASTERY_MARK_KEYS.map((key) => [key, timestamp(marks[key])]));
  const state = typeof mastery.state === "string" && MASTERY_STATE_RANK[mastery.state] !== undefined ? mastery.state : "new";
  return { state, marks: markAt, attempts: Math.max(0, Math.floor(Number(mastery.attempts) || 0)), lastAttemptAt: timestamp(mastery.lastAttemptAt), nextReviewAt: timestamp(mastery.nextReviewAt) };
}

function resolveNow(value) {
  const parsed = timestamp(value);
  return parsed || (value === 0 ? 0 : Date.now());
}

function normalizeMasteryState(value) {
  return MASTERY_STATES.includes(value) ? value : "new";
}

function normalizeMarks(value) {
  const marks = value && typeof value === "object" ? value : {};
  const normalized = {
    understood: Boolean(marks.understood || marks.read),
    theme: Boolean(marks.theme || marks.interpreted || marks.meaning),
    recited: Boolean(marks.recited || marks.recitedOnce),
    retained: Boolean(marks.retained),
  };
  if (normalized.theme) normalized.understood = true;
  if (normalized.recited) {
    normalized.understood = true;
    normalized.theme = true;
  }
  if (normalized.retained) {
    normalized.understood = true;
    normalized.theme = true;
    normalized.recited = true;
  }
  return normalized;
}

function masteryFrom(value) {
  const source = value && typeof value === "object" ? value : {};
  const marks = normalizeMarks(source.marks);
  let status = normalizeMasteryState(source.status);
  const statusFromMarks = marks.retained
    ? "retained"
    : marks.recited
      ? "recited_once"
      : marks.theme
        ? "understood_theme"
        : marks.understood
          ? "understood_whole"
          : "new";
  if (MASTERY_STATE_RANK[statusFromMarks] > MASTERY_STATE_RANK[status]) status = statusFromMarks;
  if (status === "mastered" || MASTERY_MARK_KEYS.every((key) => marks[key])) {
    status = "mastered";
    MASTERY_MARK_KEYS.forEach((key) => { marks[key] = true; });
  }
  const milestones = source.milestones && typeof source.milestones === "object" ? source.milestones : {};
  return {
    status,
    statusUpdatedAt: timestamp(source.statusUpdatedAt),
    marks,
    milestones: {
      understoodLinesAt: timestamp(milestones.understoodLinesAt || source.understoodLinesAt),
      understoodWholeAt: timestamp(milestones.understoodWholeAt || source.understoodWholeAt),
      understoodThemeAt: timestamp(milestones.understoodThemeAt || source.understoodThemeAt),
      recitedOnceAt: timestamp(milestones.recitedOnceAt || source.recitedOnceAt),
      retainedAt: timestamp(milestones.retainedAt || source.retainedAt),
      masteredAt: timestamp(milestones.masteredAt || source.masteredAt),
    },
  };
}

function masteryForStatus(status, marks) {
  const next = { ...marks };
  if (MASTERY_STATE_RANK[status] >= MASTERY_STATE_RANK.understood_whole) next.understood = true;
  if (MASTERY_STATE_RANK[status] >= MASTERY_STATE_RANK.understood_theme) next.theme = true;
  if (MASTERY_STATE_RANK[status] >= MASTERY_STATE_RANK.recited_once) next.recited = true;
  if (MASTERY_STATE_RANK[status] >= MASTERY_STATE_RANK.retained) next.retained = true;
  return next;
}

function migrate(raw) {
  const next = { ...defaultState(), ...(raw && typeof raw === "object" ? raw : {}) };
  if (!AGE_MODES[next.ageMode]) next.ageMode = "7-8";
  next.completedPoemIds = uniqueStrings(next.completedPoemIds);
  next.visitedPlaceIds = uniqueStrings(next.visitedPlaceIds);
  next.favoritePoemIds = uniqueStrings(next.favoritePoemIds);
  next.recentPoemIds = uniqueStrings(next.recentPoemIds).slice(0, RECENT_LIMIT);
  next.observationByPoem = Object.fromEntries(Object.entries(next.observationByPoem || {})
    .filter(([poemId, value]) => poemId && value && typeof value === "object")
    .map(([poemId, value]) => [poemId, {
      attempts: Math.max(0, Number(value.attempts) || 0),
      usedHint: Boolean(value.usedHint),
      completed: Boolean(value.completed),
    }]));
  next.reviewByPoem = Object.fromEntries(Object.entries(next.reviewByPoem || {})
    .filter(([poemId, value]) => poemId && value && typeof value === "object")
    .map(([poemId, value]) => [poemId, normalizeReview(value)]));
  next.masteryByPoem = Object.fromEntries(Object.entries(next.masteryByPoem || {})
    .filter(([poemId, value]) => poemId && value && typeof value === "object")
    .map(([poemId, value]) => [poemId, normalizeMastery(value)]));
  next.masteryByPoem = Object.fromEntries(Object.entries(next.masteryByPoem || {})
    .filter(([poemId, value]) => poemId && value && typeof value === "object")
    .map(([poemId, value]) => [poemId, masteryFrom(value)]));
  // Free-form child text is deliberately never migrated or persisted.
  delete next.reflection;
  delete next.reflections;
  delete next.rawInput;
  next.version = CURRENT_VERSION;
  return next;
}

function firstStored(storage, keys) {
  for (const key of keys) {
    try {
      const value = storage?.getItem(key);
      if (value !== null && value !== undefined) return value;
    } catch { /* ignore an unavailable legacy key */ }
  }
  return null;
}

function readLegacy(storage) {
  const seed = {};
  const journeyText = firstStored(storage, LEGACY_KEYS.journey);
  if (journeyText) {
    try {
      const journey = JSON.parse(journeyText);
      if (journey?.visited?.lushan || journey?.completed) {
        seed.visitedPlaceIds = ["lushan"];
        seed.completedPoemIds = journey.completed ? ["lushan-wang-lushan-pubu"] : [];
      }
    } catch { /* malformed legacy progress is ignored */ }
  }
  const pinyin = firstStored(storage, LEGACY_KEYS.pinyin);
  if (pinyin === "true" || pinyin === "false") seed.pinyinPreference = pinyin === "true";
  const origin = firstStored(storage, LEGACY_KEYS.origin);
  if (origin) seed.originCityId = origin;
  return Object.keys(seed).length ? seed : null;
}

function resolveDefaultStorage() {
  try {
    return typeof globalThis === "undefined" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}

export function createProgressStore(storage) {
  if (storage === undefined) storage = resolveDefaultStorage();
  let state = defaultState();
  let storageAvailable = Boolean(storage && typeof storage.getItem === "function" && typeof storage.setItem === "function");
  try {
    const current = storage?.getItem(STORAGE_KEY);
    state = migrate(current ? JSON.parse(current) : readLegacy(storage));
    if (storage) storageAvailable = true;
  } catch {
    state = defaultState();
    storageAvailable = false;
  }

  function persist() {
    if (!storage || typeof storage.setItem !== "function") {
      storageAvailable = false;
      return;
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      storageAvailable = true;
    } catch {
      storageAvailable = false;
    }
  }

  // Materialize migrated state once so subsequent sessions only read v2.
  persist();

  function update(recipe) {
    const draft = structuredClone(state);
    const candidate = recipe(draft) || draft;
    state = migrate(candidate);
    persist();
    return snapshot();
  }

  function snapshot() {
    return structuredClone(state);
  }

  return {
    key: STORAGE_KEY,
    version: CURRENT_VERSION,
    get storageAvailable() { return storageAvailable; },
    get: snapshot,
    setAgeMode(ageMode) {
      if (!AGE_MODES[ageMode]) return snapshot();
      return update((draft) => {
        draft.ageMode = ageMode;
        draft.pinyinPreference = null;
      });
    },
    setPinyinPreference(value) {
      return update((draft) => { draft.pinyinPreference = typeof value === "boolean" ? value : null; });
    },
    shouldShowPinyin() {
      return typeof state.pinyinPreference === "boolean"
        ? state.pinyinPreference
        : AGE_MODES[state.ageMode].pinyinDefault;
    },
    visitPlace(placeId) {
      return update((draft) => { draft.visitedPlaceIds.push(placeId); });
    },
    recordReading(poemId) {
      if (typeof poemId !== "string" || !poemId) return snapshot();
      return update((draft) => {
        draft.lastPoemId = poemId;
        draft.recentPoemIds = [poemId, ...draft.recentPoemIds.filter((id) => id !== poemId)].slice(0, RECENT_LIMIT);
      });
    },
    toggleFavorite(poemId) {
      if (typeof poemId !== "string" || !poemId) return snapshot();
      return update((draft) => {
        draft.favoritePoemIds = draft.favoritePoemIds.includes(poemId)
          ? draft.favoritePoemIds.filter((id) => id !== poemId)
          : [...draft.favoritePoemIds, poemId];
      });
    },
    recordReview(poemId, now = Date.now()) {
      if (typeof poemId !== "string" || !poemId) return snapshot();
      const normalizedNow = timestamp(now);
      const practicedAt = typeof now === "number" && Number.isFinite(now) && now >= 0
        ? now
        : normalizedNow || Date.now();
      return update((draft) => {
        const previous = normalizeReview(draft.reviewByPoem[poemId]);
        const intervalDays = REVIEW_INTERVAL_DAYS[Math.min(previous.count, REVIEW_INTERVAL_DAYS.length - 1)];
        draft.reviewByPoem[poemId] = {
          count: previous.count + 1,
          intervalDays,
          lastPracticedAt: practicedAt,
          nextReviewAt: practicedAt + intervalDays * DAY_MS,
        };
      });
    },
    setOrigin(originCityId) {
      return update((draft) => { draft.originCityId = originCityId || ""; });
    },
    setSoundEnabled(enabled) {
      return update((draft) => { draft.soundEnabled = Boolean(enabled); });
    },
    recordObservation(poemId, patch = {}) {
      return update((draft) => {
        const previous = draft.observationByPoem[poemId] || { attempts: 0, usedHint: false, completed: false };
        draft.observationByPoem[poemId] = {
          attempts: patch.attempted ? previous.attempts + 1 : previous.attempts,
          usedHint: previous.usedHint || Boolean(patch.usedHint),
          completed: previous.completed || Boolean(patch.completed),
        };
      });
    },
    getMastery(poemId) {
      return normalizeMastery(state.masteryByPoem[poemId]);
    },
    markMastery(poemId, mark, now = Date.now()) {
      if (!MASTERY_MARK_KEYS.includes(mark)) return snapshot();
      const at = timestamp(now) || Date.now();
      return update((draft) => {
        const previous = normalizeMastery(draft.masteryByPoem[poemId]);
        const marks = { ...previous.marks, [mark]: at };
        const understood = Boolean(marks.understood);
        const theme = Boolean(marks.theme);
        const recited = Boolean(marks.recited);
        const retained = Boolean(marks.retained);
        let nextState = previous.state;
        if (understood) nextState = "understood_lines";
        if (understood && theme) nextState = "understood_theme";
        if (understood && theme && recited) nextState = "recited_once";
        if (understood && theme && recited && retained) nextState = "mastered";
        draft.masteryByPoem[poemId] = { ...previous, state: nextState, marks, attempts: previous.attempts + 1, lastAttemptAt: at, nextReviewAt: retained ? at + REVIEW_INTERVAL_DAYS[2] * DAY_MS : at + REVIEW_INTERVAL_DAYS[0] * DAY_MS };
        if (recited && !draft.completedPoemIds.includes(poemId)) draft.completedPoemIds.push(poemId);
      });
    },
    completePoem(poemId, placeId) {
      return update((draft) => {
        draft.completedPoemIds.push(poemId);
        draft.visitedPlaceIds.push(placeId);
        draft.lastPoemId = poemId;
      });
    },
    setChallenge(challenge) {
      return update((draft) => { draft.challenge = { ...draft.challenge, ...challenge }; });
    },
    reset() {
      state = defaultState();
      try {
        if (storage?.removeItem) storage.removeItem(STORAGE_KEY);
        else if (storage?.setItem) storage.setItem(STORAGE_KEY, JSON.stringify(state));
        storageAvailable = Boolean(storage && typeof storage.setItem === "function");
      } catch {
        try {
          storage?.setItem?.(STORAGE_KEY, JSON.stringify(state));
          storageAvailable = Boolean(storage && typeof storage.setItem === "function");
        } catch {
          storageAvailable = false;
        }
      }
      return snapshot();
    },
  };
}

export default createProgressStore;
