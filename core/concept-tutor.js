const AGE_FIELD = {
  "7-8": "age7to8",
  "9-10": "age9to10",
  "11-12": "age11to12",
};

function text(value) {
  return String(value || "").trim();
}

function normalizeQuestion(value) {
  return text(value).toLocaleLowerCase("zh-CN").replace(/[，。！？；：、,.!?;:\s]/gu, "");
}

function ageCopy(concept, ageMode) {
  const value = concept?.[AGE_FIELD[ageMode]];
  if (typeof value === "string") return value;
  return value?.explanation || value?.summary || concept?.formalDefinition || "";
}

function guidedSteps(concept, ageMode) {
  const guided = concept?.guidedDiscovery;
  if (Array.isArray(guided)) return guided;
  if (Array.isArray(guided?.ageSteps?.[ageMode])) return guided.ageSteps[ageMode];
  if (Array.isArray(guided?.[ageMode])) return guided[ageMode];
  if (Array.isArray(guided?.steps)) return guided.steps;
  if (Array.isArray(guided?.offlineSteps)) return guided.offlineSteps;
  if (guided?.prompt) return [{ prompt: guided.prompt, action: guided.action || "observe" }];
  return [];
}

function answerFromReviewedConcepts(question, current, concepts, ageMode) {
  const normalized = normalizeQuestion(question);
  if (!normalized) return { kind: "empty", message: "可以点一个继续问的问题，也可以写下你没听懂的那个词。" };
  if (current && /没听懂|不明白|再说一遍|还是不懂/u.test(normalized)) {
    return {
      kind: "reviewed",
      conceptId: current.id,
      message: `没关系，先不用背名字。回到当前诗只做一个发现：${ageCopy(current, ageMode)}`,
    };
  }
  if (current && /举.*例子|别的例子|还有哪首/u.test(normalized)) {
    const labels = current.poemExampleLabels || [];
    if (labels.length > 1) {
      return {
        kind: "reviewed",
        conceptId: current.id,
        message: `可以再看${labels[1]}。先用同一个办法数句数和每句字数，再和当前诗比较。`,
      };
    }
  }
  if (current?.id === "qiyan-jueju" && /为什么.*数.*7|为什么.*七/u.test(normalized)) {
    return {
      kind: "reviewed",
      conceptId: current.id,
      message: "因为‘七言’先看每一句的字数。标点不算字；数到七，是在用当前诗句找证据。",
    };
  }
  const candidates = [current, ...(concepts || []).filter((item) => item?.id !== current?.id)].filter(Boolean);
  const matched = candidates.find((concept) => [concept.term, ...(concept.aliases || [])]
    .map(normalizeQuestion)
    .filter(Boolean)
    .some((term) => normalized.includes(term) || term.includes(normalized)
      || (concept.id === current?.id && [...term].length >= 4 && [term.slice(0, 2), term.slice(-2)].some((part) => normalized.includes(part)))));
  if (!matched || !/reviewed|curated|approved/u.test(matched.reviewStatus || "")) {
    return { kind: "needs-research", message: "这个问题需要再查一查。我们先不猜答案，可以回到诗里继续看已经核验的发现。" };
  }
  return {
    kind: "reviewed",
    conceptId: matched.id,
    message: ageCopy(matched, ageMode),
  };
}

export function createConceptTutor({ concepts = [] } = {}) {
  const byId = Object.fromEntries(concepts.map((concept) => [concept.id, concept]));
  return {
    offline: true,
    providerId: "grounded-local-concepts",
    sourceBound: true,
    get(conceptId) {
      return byId[conceptId] || null;
    },
    lesson(conceptId, ageMode = "7-8") {
      const concept = byId[conceptId];
      if (!concept) return null;
      return {
        concept,
        ageMode,
        explanation: ageCopy(concept, ageMode),
        steps: guidedSteps(concept, ageMode),
        followUps: concept.followUpQuestionsByAge?.[ageMode] || concept.followUpQuestions || [],
        offline: true,
        sourceBound: true,
      };
    },
    answer({ question, conceptId, ageMode = "7-8" }) {
      return answerFromReviewedConcepts(question, byId[conceptId], concepts, ageMode);
    },
  };
}

export default createConceptTutor;
