const STORAGE_KEY = "shanhe.phase1.progress";
const CURRENT_VERSION = 2;
const LEGACY_KEYS = {
  journey: ["shanhe-shijing-journey-v2", "shanhe.journey.v2", "shanhe-journey-v2"],
  pinyin: ["shanhe-shijing-pinyin", "shanhe.pinyin", "shanhe-pinyin"],
  origin: ["shanhe-shijing-origin-city", "shanhe.origin-city", "shanhe-origin-city"],
};

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
    challenge: { date: "", poemId: "", completed: false },
    originCityId: "",
    soundEnabled: true,
    lastPoemId: "",
  };
}

function uniqueStrings(values) {
  return [...new Set((Array.isArray(values) ? values : []).filter((value) => typeof value === "string" && value))];
}

function migrate(raw) {
  const next = { ...defaultState(), ...(raw && typeof raw === "object" ? raw : {}) };
  if (!AGE_MODES[next.ageMode]) next.ageMode = "7-8";
  next.completedPoemIds = uniqueStrings(next.completedPoemIds);
  next.visitedPlaceIds = uniqueStrings(next.visitedPlaceIds);
  next.observationByPoem = Object.fromEntries(Object.entries(next.observationByPoem || {})
    .filter(([poemId, value]) => poemId && value && typeof value === "object")
    .map(([poemId, value]) => [poemId, {
      attempts: Math.max(0, Number(value.attempts) || 0),
      usedHint: Boolean(value.usedHint),
      completed: Boolean(value.completed),
    }]));
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

export function createProgressStore(storage = globalThis?.localStorage) {
  let state = defaultState();
  try {
    const current = storage?.getItem(STORAGE_KEY);
    state = migrate(current ? JSON.parse(current) : readLegacy(storage));
  } catch {
    state = defaultState();
  }

  function persist() {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* local persistence is optional */ }
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
      try { storage?.removeItem(STORAGE_KEY); } catch { /* optional */ }
      return snapshot();
    },
  };
}

export default createProgressStore;
