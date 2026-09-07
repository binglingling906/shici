/* Local, read-only experience evaluator. It never reads textarea values. */
(function phase1ExperienceEvaluator() {
  "use strict";

  const OUTPUT_ID = "experience-evaluator-output";
  let timer = 0;
  let refreshAttempts = 0;
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const runtimeDiagnostics = { errors: [], warnings: [] };
  const diagnosticText = (values) => values.map((value) => {
    if (value instanceof Error) return value.stack || value.message;
    if (typeof value === "string") return value;
    try { return JSON.stringify(value); } catch { return String(value); }
  }).join(" ").slice(0, 1200);
  const originalConsoleError = console.error.bind(console);
  const originalConsoleWarn = console.warn.bind(console);
  console.error = (...values) => { runtimeDiagnostics.errors.push(diagnosticText(values)); originalConsoleError(...values); };
  console.warn = (...values) => { runtimeDiagnostics.warnings.push(diagnosticText(values)); originalConsoleWarn(...values); };
  addEventListener("error", (event) => runtimeDiagnostics.errors.push(`${event.message || "script error"} @ ${event.filename || "inline"}:${event.lineno || 0}`));
  addEventListener("unhandledrejection", (event) => runtimeDiagnostics.errors.push(`Unhandled promise: ${diagnosticText([event.reason])}`));

  function outputNode() {
    let node = document.getElementById(OUTPUT_ID);
    if (!node) {
      node = document.createElement("output");
      node.id = OUTPUT_ID;
      node.hidden = true;
      node.setAttribute("aria-hidden", "true");
      document.body.append(node);
    }
    return node;
  }

  function visible(element) {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0;
  }

  function rect(element) {
    return element?.getBoundingClientRect?.() || { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
  }

  function overlapArea(a, b) {
    return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
      * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  }

  function check(name, condition, details = {}) {
    return { name, status: condition ? "pass" : "fail", pass: Boolean(condition), details };
  }

  function review(name, details = {}) {
    return { name, status: "review", pass: null, details };
  }

  function na(name, details = {}) {
    return { name, status: "not_applicable", pass: null, details };
  }

  const AGE_MODES = ["7-8", "9-10", "11-12"];
  const REVIEWED_STATUSES = new Set([
    "reviewed", "curated", "approved", "verified", "approved_full_experience",
    "standard_reviewed", "guided_reviewed", "immersive_reviewed",
  ]);
  const CANDIDATE_STATUSES = new Set([
    "candidate", "catalog_candidate", "machine_candidate", "unverified", "needs_review",
    "pending", "draft", "auto",
  ]);
  const RELATION_TYPES = new Set([
    // Phase 1 vocabulary.
    "city_contains_lake", "city_context", "cultural_association", "departure_place",
    "depicts_place", "destination_mentioned", "historical_association", "imagined_frontier",
    "landscape_mentioned", "mentions_place", "nearby_city", "nearby_lake", "nearby_river",
    "poem_direction_reference", "poem_imagined_direction", "poem_landscape_reference",
    "poem_viewpoint_reference", "regional_context", "regional_river", "river_imagery",
    "riverfront", "viewpoint_reference", "waterway_imagery", "written_at_context",
    // Explicit names accepted by the expanded geography layer.
    "historical_context", "historical_city", "historical_route", "homecoming", "frontier",
    "landmark_reference", "lake", "mountain", "mountain_association", "mountain_pass", "sea",
    "waterway", "river_journey", "regional_association", "climb", "spring", "weather", "rain",
    "moon_imagery", "garden", "cultural_landmark", "landscape_reference", "city_reference",
    // Normalized vocabulary emitted by the curriculum geography builder.
    "written_at", "describes", "mentions", "poet_present", "imagined", "historical_allusion",
    "journey_suggestion", "unknown",
  ]);

  function text(value) {
    return typeof value === "string" ? value.trim() : String(value || "").trim();
  }

  function array(value) {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.items)) return value.items;
    if (Array.isArray(value?.records)) return value.records;
    if (Array.isArray(value?.entries)) return value.entries;
    return [];
  }

  function firstArray(...values) {
    for (const value of values) {
      const items = array(value);
      if (items.length) return items;
    }
    return [];
  }

  function mergedArrays(...values) {
    const seen = new Set();
    const result = [];
    for (const value of values) {
      for (const item of array(value)) {
        if (!item || typeof item !== "object") continue;
        const key = item.id || item.poemId || item.nodeId || JSON.stringify(item);
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(item);
      }
    }
    return result;
  }

  function runtimeApi() {
    return window.__SHANHE_PHASE1__ || {};
  }

  function runtimeConcepts(api = runtimeApi()) {
    const values = [
      api.concepts,
      api.conceptTutor?.concepts,
      api.curriculum?.concepts,
      api.curriculum?.conceptRegistry,
      api.coverage?.concepts,
      api.coverage?.conceptRegistry,
    ];
    const seen = new Set();
    return values.flatMap(array).filter((item) => {
      if (!item || typeof item !== "object") return false;
      const key = item.id || item.term || JSON.stringify(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function runtimeCurriculum(api = runtimeApi()) {
    const curriculum = api.curriculum;
    if (Array.isArray(curriculum)) return curriculum;
    return firstArray(
      curriculum?.claims,
      curriculum?.entries,
      curriculum?.records,
      curriculum?.poems,
      curriculum?.catalog,
      api.curriculumClaims,
      api.coverage?.curriculum?.claims,
      api.coverage?.curriculum?.entries,
      api.coverage?.curriculum?.records,
      api.coverage?.claims,
    );
  }

  function runtimeCorpus(api = runtimeApi()) {
    const curriculum = api.curriculum;
    const primary = firstArray(
      api.corpus,
      api.corpus?.records,
      api.learningCatalog,
      api.catalog,
      curriculum?.corpus,
      curriculum?.poems,
      curriculum?.catalog,
      api.phase1Poems,
      api.coverage?.corpus,
      api.coverage?.corpus?.records,
    );
    const metadata = firstArray(api.learningCatalog, api.catalog, curriculum?.learningCatalog, curriculum?.catalog, api.coverage?.catalog);
    const byId = new Map(metadata.map((record) => [recordId(record), record]));
    return primary.map((record) => {
      const enrichment = byId.get(recordId(record));
      if (!enrichment) return record;
      return {
        ...enrichment,
        ...record,
        reviewFlags: record.reviewFlags || enrichment.reviewFlags || enrichment.review,
        maturity: record.maturity || enrichment.maturity,
        contentTier: record.contentTier || enrichment.contentTier,
      };
    });
  }

  function runtimeGeography(api = runtimeApi()) {
    const geography = api.geography || api.coverage?.geography;
    return {
      places: mergedArrays(api.phase1Places, api.places, geography?.places, geography?.nodes, api.curriculum?.geoNodes, api.coverage?.places, api.coverage?.geoNodes),
      poems: mergedArrays(api.phase1Poems, api.poems, geography?.poems, api.curriculum?.poems, api.curriculum?.catalog, api.coverage?.poems),
      relations: mergedArrays(geography?.relations, api.relations, api.curriculum?.poemGeoRelations, api.learningCatalog?.flatMap?.((poem) => poem.geoRelations || []), api.curriculum?.catalog?.flatMap?.((poem) => poem.geoRelations || []), api.coverage?.relations, api.coverage?.geography?.relations),
      relationTypeWhitelist: new Set(firstArray(geography?.relationTypeWhitelist, api.relationTypeWhitelist, api.curriculum?.config?.allowedGeoRelationTypes)),
      regions: mergedArrays(geography?.regions, api.curriculum?.regions, api.coverage?.regions),
    };
  }

  function reviewStatus(record) {
    const review = record?.review;
    const maturity = record?.maturity;
    return text(record?.verificationStatus || record?.reviewStatus || (typeof review === "object" ? review.status : review)
      || record?.curation?.status || (typeof maturity === "object" ? maturity.status : maturity) || record?.status).toLowerCase();
  }

  function isReviewed(status) {
    return REVIEWED_STATUSES.has(String(status || "").toLowerCase())
      || String(status || "").toLowerCase().includes("reviewed")
      || String(status || "").toLowerCase().includes("approved");
  }

  function isCandidate(status) {
    return CANDIDATE_STATUSES.has(String(status || "").toLowerCase())
      || String(status || "").toLowerCase().includes("candidate")
      || String(status || "").toLowerCase().includes("unverified");
  }

  function property(record, ...keys) {
    for (const key of keys) {
      if (record && Object.prototype.hasOwnProperty.call(record, key)) return record[key];
    }
    return undefined;
  }

  function normalizedTitle(value) {
    return text(value).replace(/[《》〈〉「」『』\s·・,，。！？!?；;：:、\-—]/gu, "").toLocaleLowerCase("zh-CN");
  }

  function recordTitle(record) {
    const title = property(record, "canonicalTitle", "title", "name");
    return typeof title === "object" ? title.text || title.name || title.value || "" : title;
  }

  function recordId(record) {
    return text(property(record, "poemId", "workId", "canonicalPoemId", "id", "slug"));
  }

  function sourcePresent(value) {
    if (Array.isArray(value)) return value.some(sourcePresent);
    if (value && typeof value === "object") return Boolean(value.url || value.uri || value.key || value.id || value.title);
    return Boolean(text(value));
  }

  function visibleInteractive(root = document) {
    return [...root.querySelectorAll("button, a[href], input, textarea, select, [role='button'], [role='link']")]
      .filter((element) => visible(element) && !element.disabled && element.getAttribute("aria-disabled") !== "true");
  }

  function isTextLinkException(element) {
    return element.matches("a[href], [role='link'], .text-button, [data-text-link='true']")
      && !element.matches(".primary-control, .ink-button, .complete-button, [data-child-action='true']");
  }

  function touchTargetIssue(element, minimum = 48) {
    if (isTextLinkException(element)) return null;
    const box = rect(element);
    if (box.width >= minimum && box.height >= minimum) return null;
    return {
      label: element.getAttribute("aria-label") || element.textContent.trim().slice(0, 40),
      tag: element.tagName.toLowerCase(),
      width: Math.round(box.width),
      height: Math.round(box.height),
      minimum,
    };
  }

  function keyboardIssue(element) {
    const tabIndex = element.getAttribute("tabindex");
    if (tabIndex === "-1") return { label: element.textContent.trim().slice(0, 40), reason: "tabindex=-1" };
    if (element.matches("button, input, textarea, select")) return null;
    if (element.matches("a[href], [role='button'], [role='link']")) return null;
    return { label: element.textContent.trim().slice(0, 40), reason: "not keyboard interactive" };
  }

  function checkMap(mapVisible) {
    if (!mapVisible) return [na("map-system", { reason: "当前不在山河页" })];
    const paths = [...document.querySelectorAll("#map-layer-root path")];
    const markers = [...document.querySelectorAll(".place-marker")].filter(visible);
    const filters = [...document.querySelectorAll("#map-filters [data-filter]")];
    const markerOverlaps = [];
    for (let first = 0; first < markers.length; first += 1) {
      for (let second = first + 1; second < markers.length; second += 1) {
        const area = overlapArea(rect(markers[first]), rect(markers[second]));
        if (area > 4) markerOverlaps.push({ first: markers[first].dataset.placeId, second: markers[second].dataset.placeId, area: Math.round(area) });
      }
    }
    return [
      check("map-geometry-present", paths.length >= 20, { pathCount: paths.length, source: "content/generated/china-physical-map.json" }),
      check("phase1-places-visible", markers.length >= 1 && markers.length <= Math.max(5, runtimeGeography().places.length), { visiblePlaceIds: markers.map((marker) => marker.dataset.placeId), maxVisible: Math.max(5, runtimeGeography().places.length) }),
      check("map-marker-no-overlap", markerOverlaps.length === 0, { markerOverlaps }),
      check("map-filter-system", filters.length === 6 && filters.some((button) => button.dataset.filter === "song") && !document.body.textContent.includes("宋词"), { filters: filters.map((button) => button.textContent.trim()) }),
      check("map-text-alternative", Boolean(document.querySelector("#map-list-toggle[aria-controls='map-text-list']")), {}),
      review("map-information-hierarchy", { principle: "地点是入口，河流与地形是认知骨架，筛选是二级控制" }),
      review("map-counterfactual-necessity", { question: "若移除路径、地点相对位置和筛选，孩子是否仍能理解诗从哪里望出去？" }),
    ];
  }

  function checkReading(readerVisible, viewport) {
    if (!readerVisible) return [na("reading-system", { reason: "当前不在阅读页" })];
    const primary = document.querySelector("#poem-stage");
    const lines = [...document.querySelectorAll(".poem-line")];
    const secondary = [...document.querySelectorAll("#reader-screen [data-secondary-content]")].filter(visible);
    const intersections = secondary
      .map((element) => ({ element: element.className || element.id, area: Math.round(overlapArea(rect(primary), rect(element))) }))
      .filter((entry) => entry.area > 1);

    const rubyErrors = [];
    const pinyinPositionErrors = [];
    for (const [lineIndex, line] of lines.entries()) {
      for (const [tokenIndex, ruby] of [...line.querySelectorAll("ruby")].entries()) {
        const base = ruby.querySelector(".poem-character");
        const rt = ruby.querySelector("rt");
        if (!base || !rt || [...(base?.textContent || "")].length !== 1 || !rt.textContent.trim()) {
          rubyErrors.push({ line: lineIndex + 1, token: tokenIndex + 1 });
          continue;
        }
        const baseBox = rect(base);
        const rtBox = rect(rt);
        if (rtBox.bottom > baseBox.top + 2 || rtBox.top >= baseBox.top) {
          pinyinPositionErrors.push({ line: lineIndex + 1, token: tokenIndex + 1, rtBottom: Math.round(rtBox.bottom), baseTop: Math.round(baseBox.top) });
        }
      }
    }

    const lineMetrics = lines.map((line, index) => {
      const box = rect(line);
      const style = getComputedStyle(line);
      return {
        line: index + 1,
        width: Math.round(box.width),
        height: Math.round(box.height),
        fontSize: Number.parseFloat(style.fontSize),
        inDocumentFlow: box.width > 0 && box.height > 0,
        inViewport: box.top >= 0 && box.bottom <= viewport.height,
      };
    });
    const pinyinVisible = document.querySelector("#pinyin-toggle")?.getAttribute("aria-pressed") === "true";
    const rtFontSizes = [...document.querySelectorAll(".poem-line rt")].map((rt) => Number.parseFloat(getComputedStyle(rt).fontSize));
    const input = document.activeElement?.matches?.("textarea, input") ? document.activeElement : null;
    const visualViewport = window.visualViewport || { offsetTop: 0, height: viewport.height };
    const inputBox = rect(input);
    const touchTargets = [...document.querySelectorAll("#reader-screen button, #reader-screen [role='button']")]
      .filter((button) => visible(button) && !button.disabled)
      .map((button) => touchTargetIssue(button))
      .filter(Boolean);
    const visibleActions = [...document.querySelectorAll("#reader-screen button")].filter((button) => {
      const box = rect(button);
      return visible(button) && box.bottom > 0 && box.top < viewport.height;
    }).length;
    const interpretation = document.querySelector("#meaning-card");
    const meaningItems = [...document.querySelectorAll("#meaning-lines li")];
    const extensionCopy = document.querySelector("#extension-copy")?.textContent.trim() || "";

    return [
      check("primary-content-visible", visible(primary) && lines.length >= 1 && lines.length <= 32 && lineMetrics.every((line) => line.inDocumentFlow), { lineCount: lines.length, lineMetrics }),
      check("primary-content-no-secondary-occlusion", intersections.length === 0, { intersections }),
      check("ruby-character-pairing", rubyErrors.length === 0, { rubyErrors }),
      check("pinyin-above-character", !pinyinVisible || pinyinPositionErrors.length === 0, { pinyinVisible, pinyinPositionErrors }),
      check("pinyin-legibility", !pinyinVisible || rtFontSizes.every((size) => size >= 9.5), { minPinyinPx: rtFontSizes.length ? Math.min(...rtFontSizes) : null }),
      check("poem-text-legibility", lineMetrics.every((line) => line.fontSize >= 22), { minPoemPx: lineMetrics.length ? Math.min(...lineMetrics.map((line) => line.fontSize)) : null }),
      check("reading-comfort", lines.length <= 32 && primary.scrollWidth <= primary.clientWidth + 1, { lines: lines.length, primaryWidth: primary.clientWidth, primaryScrollWidth: primary.scrollWidth }),
      check("touch-targets", touchTargets.length === 0, { undersized: touchTargets, minimum: 48, textLinksMayBeSmaller: true }),
      check("input-clear-of-keyboard-viewport", !input || (inputBox.top >= visualViewport.offsetTop && inputBox.bottom <= visualViewport.offsetTop + visualViewport.height), { activeInput: input?.id || null, visualViewport: { offsetTop: visualViewport.offsetTop, height: visualViewport.height } }),
      check("no-horizontal-overflow", document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1, { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }),
      check("child-cognitive-load", visibleActions <= 14, { visibleActionCount: visibleActions, threshold: 14 }),
      check("poem-meaning-support", Boolean(interpretation) && meaningItems.length === lines.length && extensionCopy.length >= 20, { meaningLineCount: meaningItems.length, poemLineCount: lines.length, hasExtension: extensionCopy.length >= 20 }),
      review("reading-information-hierarchy", { principle: "诗为 Primary Content；地点、朗读、拼音、山风引导均在独立流式区域" }),
    ];
  }

  function ageExplanation(concept, mode) {
    const compact = mode.replace("-", "to");
    const underscored = mode.replace("-", "_");
    return property(concept, mode, `age${compact}`, `age${underscored}`)
      || concept?.ageExplanations?.[mode]
      || concept?.explanations?.[mode]
      || concept?.copy?.[mode]
      || "";
  }

  function guidedSteps(concept) {
    const guided = concept?.guidedDiscovery || concept?.discovery || concept?.steps;
    if (Array.isArray(guided)) return guided;
    if (Array.isArray(guided?.offlineSteps)) return guided.offlineSteps;
    if (Array.isArray(guided?.steps)) return guided.steps;
    if (guided && typeof guided === "object" && text(guided.prompt)) return [guided];
    return AGE_MODES.flatMap((mode) => Array.isArray(guided?.[mode]) ? guided[mode] : []);
  }

  function conceptExamples(concept) {
    return firstArray(concept?.poemExamples, concept?.examples, concept?.poemExample, concept?.evidence);
  }

  function conceptById(concepts) {
    return new Map(concepts.map((concept) => [text(concept.id || concept.term), concept]));
  }

  function checkJargonGuard(readerVisible, concepts) {
    if (!readerVisible && !concepts.length) return [na("jargon-guard", { reason: "当前不在诗词页，且运行时未注册概念" })];
    const explicit = qa("[data-jargon], [data-professional-term], [data-concept-term], [data-term], [data-concept-label]");
    const taxonomyChildren = qa("#poem-taxonomy > *, #poem-taxonomy [data-concept-id], #poem-taxonomy button, #poem-taxonomy a, #poem-taxonomy [role='button']");
    const termElements = [...new Set([...explicit, ...taxonomyChildren].flatMap((element) => {
      const descendants = element.matches("[data-concept-id], button, a, [role='button']")
        ? [element]
        : qa("[data-concept-id], button, a, [role='button']", element);
      return descendants.length ? descendants : [element];
    }))].filter(visible);
    const byId = conceptById(concepts);
    const orphanTerms = termElements
      .filter((element) => !text(element.dataset.conceptId))
      .map((element) => ({ label: element.textContent.trim().slice(0, 48), tag: element.tagName.toLowerCase() }));
    const unknownConceptIds = termElements
      .map((element) => text(element.dataset.conceptId))
      .filter((id) => id && !byId.has(id));
    const conceptIssues = [];
    const unreviewedVisibleConcepts = [];
    for (const element of termElements.filter((item) => item.dataset.conceptId)) {
      const concept = byId.get(text(element.dataset.conceptId));
      if (!concept) continue;
      const missingAges = AGE_MODES.filter((mode) => !text(ageExplanation(concept, mode)));
      if (missingAges.length || !conceptExamples(concept).length || !sourcePresent(concept.sources || concept.source)) {
        conceptIssues.push({ id: element.dataset.conceptId, missingAges, hasExample: conceptExamples(concept).length > 0, hasSource: sourcePresent(concept.sources || concept.source) });
      }
      if (!isReviewed(reviewStatus(concept))) unreviewedVisibleConcepts.push({ id: concept.id, reviewStatus: reviewStatus(concept) });
    }
    return [
      check("jargon-guard-no-orphan-terms", orphanTerms.length === 0 && unknownConceptIds.length === 0, { termCount: termElements.length, orphanTerms, unknownConceptIds }),
      check("jargon-guard-concept-contract", conceptIssues.length === 0, { conceptIssues, registeredConceptCount: concepts.length }),
      check("jargon-guard-reviewed-visible-terms", unreviewedVisibleConcepts.length === 0, { unreviewedVisibleConcepts }),
    ];
  }

  function checkConceptTutor(readerVisible, concepts) {
    const api = runtimeApi();
    const section = document.querySelector("#concept-discovery");
    const conceptSurfaceExpected = Boolean(section || concepts.length || api.conceptTutor || api.curriculum?.concepts);
    if (!readerVisible && !conceptSurfaceExpected) return [na("concept-tutor", { reason: "当前不在诗词页，且未注册概念导师" })];

    const byId = conceptById(concepts);
    const activeId = text(section?.dataset.conceptId || section?.getAttribute("data-active-concept")
      || document.querySelector("[data-concept-id][aria-current='true']")?.dataset.conceptId);
    const activeTerm = text(document.querySelector("#concept-title")?.textContent);
    const activeConcept = byId.get(activeId) || concepts.find((concept) => text(concept.term) === activeTerm) || concepts[0] || null;
    const active = visible(section);
    const conceptText = section?.textContent || "";
    const offline = Boolean(api.conceptTutor?.offline || api.conceptTutor?.isOffline || api.conceptTutor?.mode === "offline" || api.conceptTutor?.providerId === "grounded-local-concepts" || activeConcept?.guidedDiscovery?.offline)
      || Boolean(guidedSteps(activeConcept || {}).some((step) => step?.offline === true))
      || /离线|本地|无需网络|没有模型也能/u.test(conceptText);
    const flowStyle = section ? getComputedStyle(section) : null;
    const poem = document.querySelector("#poem-stage");
    const sectionBox = rect(section);
    const poemBox = rect(poem);
    const countText = text(document.querySelector("#concept-progress")?.textContent);
    const countMatch = countText.match(/第\s*(\d+)\s*步[，,\s]*(?:共\s*)?(\d+)\s*步/u)
      || countText.match(/(\d+)\s*(?:\/|／|of)\s*(\d+)/iu);
    const currentStep = countMatch ? Number(countMatch[1]) : 0;
    const totalSteps = countMatch ? Number(countMatch[2]) : 0;
    const activeControls = section ? visibleInteractive(section) : [];
    const touchIssues = activeControls.map((element) => touchTargetIssue(element)).filter(Boolean);
    const keyboardIssues = activeControls.map(keyboardIssue).filter(Boolean);
    const closeButton = section?.querySelector("#concept-close, [data-concept-close], [aria-label*='收起'], [aria-label*='关闭']")
      || document.querySelector("#concept-close, [data-concept-close]");
    const closePath = Boolean(closeButton && closeButton.matches("button, a[href], [role='button']") && !closeButton.disabled
      && (closeButton.closest("#concept-discovery") || closeButton.hasAttribute("data-concept-close")));
    const unknownPathInDom = /不懂|没听懂|还是不明白|再说一遍|需要帮助/u.test(conceptText)
      || Boolean(section?.querySelector("[data-concept-unknown], [data-unknown], [data-action='unknown']"));
    const unknownPathInData = Boolean(activeConcept && firstArray(activeConcept.followUpQuestions, activeConcept.followUps, activeConcept.unknownResponses, activeConcept.notUnderstood).some((item) => /不懂|没听懂|帮助|再说/u.test(JSON.stringify(item))));
    const steps = activeConcept ? guidedSteps(activeConcept) : [];
    const firstStepText = steps.length ? JSON.stringify(steps[0]) : "";
    const formal = text(activeConcept?.formalDefinition);
    const firstPrompt = text(document.querySelector("#concept-prompt")?.textContent);
    const definitionDump = Boolean(formal && firstPrompt && (firstPrompt === formal || firstPrompt.includes(formal)));
    const sourceBound = api.conceptTutor?.sourceBound !== false
      && (api.conceptTutor?.sourceBound === true || concepts.every((concept) => sourcePresent(concept.sources || concept.source)));

    return [
      check("concept-tutor-age-layers", concepts.length > 0 && concepts.every((concept) => AGE_MODES.every((mode) => text(ageExplanation(concept, mode)))), { conceptCount: concepts.length, missing: concepts.flatMap((concept) => AGE_MODES.filter((mode) => !text(ageExplanation(concept, mode))).map((mode) => ({ id: concept.id, mode }))) }),
      check("concept-tutor-offline-fallback", offline, { offlineLabelInSurface: /离线|本地|无需网络|没有模型也能/u.test(conceptText), apiOffline: Boolean(api.conceptTutor?.offline || api.conceptTutor?.isOffline) }),
      check("concept-tutor-guided-discovery", steps.length > 0 && /数|几个字|观察|找|看|听/u.test(firstStepText), { activeConcept: activeConcept?.id || null, stepCount: steps.length, firstStep: firstStepText.slice(0, 180) }),
      check("concept-tutor-no-definition-dump", !definitionDump, { activeConcept: activeConcept?.id || null, formalDefinitionPresent: Boolean(formal), firstPromptLength: firstPrompt.length }),
      check("concept-tutor-in-document-flow", !active || (flowStyle?.position !== "fixed" && flowStyle?.position !== "absolute" && sectionBox.width > 0 && sectionBox.height > 0), { active, position: flowStyle?.position || null, rect: { width: Math.round(sectionBox.width), height: Math.round(sectionBox.height) } }),
      check("concept-tutor-no-poem-occlusion", !active || overlapArea(poemBox, sectionBox) <= 1, { active, overlapArea: Math.round(overlapArea(poemBox, sectionBox)) }),
      check("concept-tutor-count-state", !active || Boolean(countMatch && currentStep >= 1 && totalSteps >= currentStep), { active, countText, currentStep, totalSteps }),
      check("concept-tutor-keyboard", !active || keyboardIssues.length === 0, { keyboardIssues }),
      check("concept-tutor-touch-targets", !active || touchIssues.length === 0, { undersized: touchIssues, minimum: 48, textLinksMayBeSmaller: true }),
      check("concept-tutor-close-path", closePath, { active, closeControl: closeButton?.id || closeButton?.dataset.conceptClose || null }),
      check("concept-tutor-unknown-question", unknownPathInDom || unknownPathInData, { active, unknownPathInDom, unknownPathInData }),
      check("concept-tutor-source-bound", sourceBound, { sourceBound, provider: Boolean(api.conceptTutor) }),
    ];
  }

  function claimField(claim, keys) {
    return keys.some((key) => Object.prototype.hasOwnProperty.call(claim || {}, key)
      && (claim[key] !== undefined && claim[key] !== ""));
  }

  function claimContext(claim) {
    const edition = text(property(claim, "curriculumEdition", "edition", "editionId"));
    const publisher = text(property(claim, "publisher", "publisherId"));
    const grade = text(property(claim, "grade", "gradeLevel"));
    const semester = text(property(claim, "semester", "term"));
    const classMode = text(property(claim, "inClassOrExtra", "classMode", "inClass", "scope"));
    const requirement = text(property(claim, "requiredOrRecommended", "requirement", "required", "recommended"));
    const work = recordId(claim) || normalizedTitle(recordTitle(claim));
    return [edition, publisher, text(property(claim, "stage", "schoolStage")), grade, semester, classMode, requirement, work].join("|").toLowerCase();
  }

  function checkCurriculumCoverage() {
    const api = runtimeApi();
    const hasSurface = Boolean(api.curriculum || api.curriculumClaims || api.coverage?.curriculum || api.coverage?.claims);
    const claims = runtimeCurriculum(api);
    const volumes = firstArray(api.curriculum?.volumes, api.curriculumVolumes, api.coverage?.curriculumVolumes, api.coverage?.volumes);
    if (!hasSurface && !claims.length) return [na("curriculum-coverage", { reason: "运行时尚未注册教材覆盖数据" })];
    const required = {
      curriculumEdition: ["curriculumEdition", "edition", "editionId"],
      publisher: ["publisher", "publisherId"],
      stage: ["stage", "schoolStage"],
      grade: ["grade", "gradeLevel"],
      semester: ["semester", "term"],
      inClassOrExtra: ["inClassOrExtra", "classMode", "inClass", "scope"],
      requiredOrRecommended: ["requiredOrRecommended", "requirement", "required", "recommended"],
      source: ["source", "sources", "provenance"],
      validFrom: ["validFrom", "valid_from"],
      validTo: ["validTo", "valid_to"],
      verificationStatus: ["verificationStatus", "reviewStatus", "review"],
    };
    const missingFields = [];
    for (const [index, claim] of claims.entries()) {
      for (const [field, keys] of Object.entries(required)) {
        const present = field === "source"
          ? sourcePresent(property(claim, ...keys))
          : claimField(claim, keys);
        if (!present) missingFields.push({ index, id: recordId(claim), field });
      }
    }
    const contexts = new Map();
    const duplicateClaims = [];
    claims.forEach((claim, index) => {
      const context = claimContext(claim);
      if (!context.replaceAll("|", "")) return;
      if (contexts.has(context)) duplicateClaims.push({ first: contexts.get(context), duplicate: { index, id: recordId(claim) }, context });
      else contexts.set(context, { index, id: recordId(claim) });
    });
    const aliasOwners = new Map();
    const aliasCollisions = [];
    claims.forEach((claim, index) => {
      const aliases = firstArray(claim.aliases, claim.titleAliases, claim.title?.aliases);
      for (const aliasValue of aliases) {
        const alias = normalizedTitle(typeof aliasValue === "object" ? aliasValue.name || aliasValue.text : aliasValue);
        if (!alias) continue;
        const owner = recordId(claim) || `claim-${index}`;
        if (aliasOwners.has(alias) && aliasOwners.get(alias).owner !== owner) aliasCollisions.push({ alias, first: aliasOwners.get(alias), duplicate: { owner, index } });
        else aliasOwners.set(alias, { owner, index });
      }
    });
    const validStatuses = new Set([...REVIEWED_STATUSES, ...CANDIDATE_STATUSES, "unconfirmed", "disputed", "rejected", "not_applicable", "review", "verified_source", "source-verified", "source_reviewed"]);
    const badStatuses = claims
      .map((claim, index) => ({ index, id: recordId(claim), status: reviewStatus(claim) }))
      .filter((item) => !item.status || !(validStatuses.has(item.status) || isReviewed(item.status) || isCandidate(item.status)));
    const candidateAsFormal = claims
      .map((claim, index) => ({ index, id: recordId(claim), status: reviewStatus(claim), formal: claim.isOfficial === true || claim.isFormal === true || claim.displayStatus === "official" || claim.official === true }))
      .filter((item) => isCandidate(item.status) && item.formal);
    const candidateScopeLeaks = claims
      .map((claim, index) => ({
        index,
        id: recordId(claim),
        status: reviewStatus(claim),
        scopeBasis: text(property(claim, "scopeBasis")),
        grade: text(property(claim, "grade", "gradeLevel")),
        semester: text(property(claim, "semester", "term")),
        stage: text(property(claim, "stage", "schoolStage")).toLowerCase(),
      }))
      .filter((item) => isCandidate(item.status))
      .filter((item) => item.scopeBasis !== "candidate-editorial-stage"
        || item.semester !== "all"
        || (/primary/u.test(item.stage) && item.grade !== "1-6")
        || (/middle/u.test(item.stage) && item.grade !== "7-9")
        || (/high/u.test(item.stage) && item.grade !== "10-12"));
    const volumeIds = new Set(volumes.map((volume) => recordId(volume)));
    const volumeStageCounts = volumes.reduce((counts, volume) => {
      const stage = text(property(volume, "stage", "schoolStage")).toLowerCase();
      const key = /primary|小学/u.test(stage) ? "primary" : /middle|初中/u.test(stage) ? "middle" : /high|高中/u.test(stage) ? "high" : "unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    const volumeFieldIssues = volumes.flatMap((volume, index) => {
      const issues = [];
      for (const field of ["id", "stage", "part", "title", "publisher", "curriculumFramework", "seriesVerificationStatus", "itemEvidenceStatus", "source", "evidenceNote"]) {
        const value = field === "source" ? property(volume, "source", "sources", "provenance") : property(volume, field);
        if (field === "source" ? !sourcePresent(value) : !text(value)) issues.push({ index, id: recordId(volume), field });
      }
      return issues;
    });
    const dishonestVolumeEvidence = volumes.filter((volume) => {
      const seriesStatus = text(property(volume, "seriesVerificationStatus")).toLowerCase();
      const itemStatus = text(property(volume, "itemEvidenceStatus")).toLowerCase();
      const itemSources = firstArray(volume.itemEvidenceSourceIds, volume.itemEvidenceSources);
      const verifiedPoems = firstArray(volume.verifiedPoemIds, volume.itemVerifiedPoemIds);
      return seriesStatus !== "source-verified"
        || !["historical-partial", "not-item-verified"].includes(itemStatus)
        || (itemStatus === "historical-partial" && (itemSources.length === 0 || verifiedPoems.length === 0))
        || (itemStatus === "not-item-verified" && (itemSources.length > 0 || verifiedPoems.length > 0));
    }).map((volume) => recordId(volume));
    const historicalPartialVolumes = volumes.filter((volume) => text(property(volume, "itemEvidenceStatus")).toLowerCase() === "historical-partial");
    const verifiedClaimVolumeIssues = claims.filter((claim) => /source-verified|verified_source/u.test(reviewStatus(claim))).flatMap((claim) => {
      const volumeId = text(property(claim, "volumeId"));
      const volume = volumes.find((item) => recordId(item) === volumeId);
      if (!volumeId || !volume) return [{ poemId: recordId(claim), volumeId, reason: "missing-known-volume" }];
      return firstArray(volume.verifiedPoemIds, volume.itemVerifiedPoemIds).includes(recordId(claim))
        ? []
        : [{ poemId: recordId(claim), volumeId, reason: "volume-missing-poem-index" }];
    });
    return [
      check("curriculum-claims-present", claims.length > 0, { claimCount: claims.length }),
      check("curriculum-claim-fields", missingFields.length === 0, { missingFields: missingFields.slice(0, 80), totalMissing: missingFields.length }),
      check("curriculum-duplicate-claims", duplicateClaims.length === 0, { duplicates: duplicateClaims.slice(0, 40) }),
      check("curriculum-alias-collisions", aliasCollisions.length === 0, { aliasCollisions: aliasCollisions.slice(0, 40) }),
      check("curriculum-verification-status", badStatuses.length === 0, { badStatuses: badStatuses.slice(0, 80) }),
      check("curriculum-candidate-honesty", candidateAsFormal.length === 0, { candidateAsFormal }),
      check("curriculum-candidate-scope-honesty", candidateScopeLeaks.length === 0, { candidateScopeLeaks: candidateScopeLeaks.slice(0, 80) }),
      check("curriculum-volume-registry", volumes.length === 23 && volumeIds.size === 23, { volumeCount: volumes.length, uniqueIds: volumeIds.size }),
      check("curriculum-volume-stage-spine", volumeStageCounts.primary === 12 && volumeStageCounts.middle === 6 && volumeStageCounts.high === 5, { volumeStageCounts }),
      check("curriculum-volume-fields", volumeFieldIssues.length === 0, { issues: volumeFieldIssues.slice(0, 80), totalIssues: volumeFieldIssues.length }),
      check("curriculum-series-item-evidence-separation", dishonestVolumeEvidence.length === 0 && historicalPartialVolumes.length === 13, { dishonestVolumeEvidence, historicalPartialVolumes: historicalPartialVolumes.map((volume) => recordId(volume)) }),
      check("curriculum-verified-claim-volume-links", verifiedClaimVolumeIssues.length === 0, { verifiedClaimVolumeIssues }),
    ];
  }

  const REVIEW_FLAG_ALIASES = {
    originalText: ["original", "text", "text_version", "text-version", "textversion", "textreviewed"],
    author: ["author", "poet", "sourceverified"],
    dynasty: ["dynasty", "period", "era", "sourceverified"],
    genre: ["genre", "form", "style", "sourceverified"],
    punctuation: ["punctuation", "line_break", "line-break", "format", "textreviewed"],
    variants: ["variant", "edition", "異文", "异文", "textreviewed"],
    pinyin: ["pinyin", "pronunciation", "拼音", "pinyinreviewed"],
    polyphonic: ["polyphonic", "polyphone", "pronunciation_override", "多音", "pinyinreviewed"],
    titleAliases: ["alias", "title_alias", "title-alias", "别名", "异名", "textreviewed"],
    geography: ["geo", "geography", "place", "location", "地理", "georeviewed"],
  };

  function reviewFlagPresent(record, key) {
    const flags = property(record, "reviewFlags", "qualityReviewFlags")
      || record?.review?.flags || record?.review?.flag || record?.quality?.flags;
    if (Array.isArray(flags)) {
      const normalized = flags.map((flag) => text(typeof flag === "object" ? flag.id || flag.name || flag.key : flag).toLowerCase());
      return (REVIEW_FLAG_ALIASES[key] || [key]).some((alias) => normalized.some((flag) => flag.includes(alias.toLowerCase())));
    }
    if (flags && typeof flags === "object") {
      return (REVIEW_FLAG_ALIASES[key] || [key]).some((alias) => Object.prototype.hasOwnProperty.call(flags, alias)
        || Object.keys(flags).some((flag) => flag.toLowerCase().includes(alias.toLowerCase())));
    }
    return false;
  }

  function reviewFlagApproved(record, key) {
    const flags = property(record, "reviewFlags", "qualityReviewFlags")
      || record?.review?.flags || record?.review?.flag || record?.quality?.flags;
    const aliases = REVIEW_FLAG_ALIASES[key] || [key];
    const approved = (value) => value === true || /^(true|yes|pass|passed|reviewed|verified|curated|approved|gold)/iu.test(text(value));
    if (Array.isArray(flags)) {
      return flags.some((flag) => {
        const name = text(typeof flag === "object" ? flag.id || flag.name || flag.key : flag).toLowerCase();
        const state = typeof flag === "object" ? flag.status ?? flag.value ?? flag.reviewed : true;
        return aliases.some((alias) => name.includes(alias.toLowerCase())) && approved(state);
      });
    }
    if (flags && typeof flags === "object") {
      return Object.entries(flags).some(([name, value]) => aliases.some((alias) => name.toLowerCase().includes(alias.toLowerCase())) && approved(value));
    }
    return false;
  }

  function tierNumber(record) {
    const value = property(record, "contentTier", "tier", "level", "maturity", "contentLevel", "experienceLevel");
    if (value && typeof value === "object") return tierNumber(value);
    const normalized = text(value).toLowerCase();
    const match = normalized.match(/[0-4]/);
    if (match) return Number(match[0]);
    if (/mother|raw|candidate|machine/u.test(normalized)) return 0;
    if (/curriculum|textbook|directory|catalog/u.test(normalized)) return 1;
    if (/standard/u.test(normalized)) return 2;
    if (/guided/u.test(normalized)) return 3;
    if (/immersive|gold|沉浸/u.test(normalized)) return 4;
    return null;
  }

  function checkCorpusQuality() {
    const api = runtimeApi();
    const records = runtimeCorpus(api);
    if (!records.length) return [na("corpus-quality", { reason: "运行时尚未注册语料记录" })];
    const baseIssues = [];
    const richIssues = [];
    const reviewFlagIssues = [];
    for (const [index, record] of records.entries()) {
      const textValue = property(record, "text", "originalText", "content");
      const title = recordTitle(record);
      const author = property(record, "author", "poet", "authorName");
      const dynasty = property(record, "dynasty", "period", "era");
      const genre = property(record, "genre", "form", "type");
      const lines = firstArray(record.lines, record.verses, record.lineBreaks);
      const status = reviewStatus(record);
      const tier = tierNumber(record);
      if (!recordId(record) || !text(title) || !text(textValue) || !text(author?.name || author) || !text(dynasty) || !text(genre)) {
        baseIssues.push({ index, id: recordId(record), missing: [
          !recordId(record) && "id", !text(title) && "title", !text(textValue) && "originalText", !text(author?.name || author) && "author", !text(dynasty) && "dynasty", !text(genre) && "genre",
        ].filter(Boolean) });
      }
      const fullReview = tier === null || tier >= 2 || isReviewed(status);
      if (fullReview) {
        const pinyinTokens = lines.flatMap((line) => firstArray(line?.tokens, line?.characters, line?.pinyinTokens));
        const pinyinRequired = record.pinyinRequired === true || reviewFlagApproved(record, "pinyin");
        const missing = [
          !lines.length && "lineBreaks",
          pinyinRequired && lines.length && pinyinTokens.length && pinyinTokens.some((token) => !token?.punctuation && !text(token?.pinyin || token?.pronunciation)) && "pinyin",
          pinyinRequired && lines.length && !pinyinTokens.length && !property(record, "pinyin", "pronunciation") && "pinyin",
          !Object.prototype.hasOwnProperty.call(record, "aliases") && !Object.prototype.hasOwnProperty.call(record.title || {}, "aliases") && !Object.prototype.hasOwnProperty.call(record, "titleAliases") && !reviewFlagPresent(record, "titleAliases") && "titleAliases",
          !property(record, "textVersion", "script", "textVariants", "variant") && !reviewFlagPresent(record, "variants") && "textVersion",
        ].filter(Boolean);
        if (missing.length) richIssues.push({ index, id: recordId(record), missing });
        const overrideList = firstArray(record.pronunciationOverrides, record.pinyinOverrides, record.overrides);
        const badOverrides = overrideList.filter((override) => !text(override?.pinyin || override?.pronunciation) || !text(override?.char || override?.character || override?.token));
        if (badOverrides.length) richIssues.push({ index, id: recordId(record), missing: [{ field: "pronunciationOverrides", count: badOverrides.length }] });
        const missingFlags = Object.keys(REVIEW_FLAG_ALIASES).filter((key) => !reviewFlagPresent(record, key));
        if (missingFlags.length) reviewFlagIssues.push({ index, id: recordId(record), missingFlags });
      }
      if (!status || tier === null) baseIssues.push({ index, id: recordId(record), missing: [!status && "reviewStatus", tier === null && "contentTier"].filter(Boolean) });
    }
    return [
      check("corpus-quality-base-fields", baseIssues.length === 0, { issueCount: baseIssues.length, issues: baseIssues.slice(0, 80) }),
      check("corpus-quality-rich-fields", richIssues.length === 0, { issueCount: richIssues.length, issues: richIssues.slice(0, 80) }),
      check("corpus-quality-review-flags", reviewFlagIssues.length === 0, { issueCount: reviewFlagIssues.length, issues: reviewFlagIssues.slice(0, 80), requiredFlags: Object.keys(REVIEW_FLAG_ALIASES) }),
    ];
  }

  function coordinatesFor(place) {
    const raw = property(place, "coordinates", "coordinate", "coords", "location");
    if (Array.isArray(raw)) return { longitude: Number(raw[0]), latitude: Number(raw[1]) };
    if (raw && typeof raw === "object") return { longitude: Number(raw.longitude ?? raw.lon ?? raw.lng), latitude: Number(raw.latitude ?? raw.lat) };
    return { longitude: Number.NaN, latitude: Number.NaN };
  }

  function checkGeographicCoverage() {
    const api = runtimeApi();
    const geo = runtimeGeography(api);
    if (!geo.places.length && !geo.relations.length && !geo.poems.length) return [na("geographic-coverage", { reason: "运行时尚未注册地理关系数据" })];
    // Keep the Phase 1 raw vocabulary accepted while the expanded catalog is
    // migrating to the normalized curriculum vocabulary. Both lists are
    // explicit; an unlisted relation still fails loudly.
    const whitelist = new Set([...RELATION_TYPES, ...geo.relationTypeWhitelist]);
    const relations = [
      ...geo.relations,
      ...geo.places.flatMap((place) => firstArray(place.surroundingRelations, place.relations)
        .map((relation) => ({ ...relation, __parentProvenance: relation.provenance || relation.sources || relation.source || place.provenance || place.sources || relation.sourceKeys }))),
      ...geo.poems.flatMap((poem) => firstArray(poem.placeRelations, poem.relations)
        .map((relation) => ({ ...relation, __parentProvenance: relation.provenance || relation.sources || relation.source || poem.provenance || poem.sources }))),
    ];
    const unknownRelationTypes = relations
      .map((relation) => text(relation?.type || relation?.relationType))
      .filter((type) => !type || !whitelist.has(type));
    const coordinateIssues = [];
    const unknownPlaces = [];
    for (const place of geo.places) {
      const point = coordinatesFor(place);
      const precision = text(property(place, "precision", "coordinatePrecision", "locationPrecision")).toLowerCase();
      const unknown = !Number.isFinite(point.longitude) || !Number.isFinite(point.latitude) || /unknown|unresolved|no_pin|none|未定/u.test(precision);
      if (unknown) unknownPlaces.push({ id: recordId(place), precision: precision || null });
      else if (point.longitude < -180 || point.longitude > 180 || point.latitude < -90 || point.latitude > 90 || !precision || !property(place, "coordinateOrder", "coordinateSystem", "validTime")) {
        coordinateIssues.push({ id: recordId(place), point, precision: precision || null, coordinateOrder: property(place, "coordinateOrder", "coordinateSystem"), hasValidTime: Boolean(place.validTime || place.timeScope) });
      }
    }
    const markers = qa(".place-marker").filter(visible);
    const markerIds = markers.map((marker) => text(marker.dataset.placeId || marker.dataset.nodeId));
    const unknownPins = markerIds.filter((id) => unknownPlaces.some((place) => place.id && place.id === id));
    const temporalIssues = relations
      .filter((relation) => /historical|written_at|departure|destination|journey|homecoming|frontier|imagined/u.test(text(relation?.type || relation?.relationType)))
      .filter((relation) => !property(relation, "validTime", "timeScope", "historicalContext", "provenance", "sources", "source", "__parentProvenance"))
      .map((relation) => ({ type: relation.type || relation.relationType, targetId: relation.targetId || relation.to }));
    const regionIds = new Set([
      ...geo.places.map((place) => text(place.region || place.regionId)).filter(Boolean),
      ...geo.regions.map((region) => text(region.id || region.regionId || region.name)).filter(Boolean),
    ]);
    return [
      check("geographic-relation-type-whitelist", unknownRelationTypes.length === 0, { unknownRelationTypes: [...new Set(unknownRelationTypes)], relationCount: relations.length, whitelist: [...whitelist] }),
      check("geographic-coordinate-precision", coordinateIssues.length === 0, { coordinateIssues: coordinateIssues.slice(0, 80), unknownPlaces: unknownPlaces.slice(0, 80) }),
      check("geographic-unknown-no-pin", unknownPins.length === 0, { unknownPlaces, markerIds, unknownPins }),
      check("geographic-historical-provenance", temporalIssues.length === 0, { temporalIssues: temporalIssues.slice(0, 80) }),
      check("geographic-region-coverage", regionIds.size > 0, { regionCount: regionIds.size, regions: [...regionIds] }),
    ];
  }

  function checkContentTierHonesty() {
    const api = runtimeApi();
    const records = runtimeCorpus(api);
    const coverage = api.coverage || {};
    if (!records.length && !api.coverage) return [na("content-tier-honesty", { reason: "运行时尚未注册内容成熟度数据" })];
    const tierIssues = records
      .map((record, index) => ({ index, id: recordId(record), tier: tierNumber(record), status: reviewStatus(record), record }))
      .filter((item) => item.tier === null || (item.tier >= 2 && isCandidate(item.status)));
    const cards = qa("#catalog-list [data-content-tier], #catalog-list [data-tier], #catalog-list [data-review-status], #catalog-list [data-verification-status], #catalog-list [data-content-status]");
    const domIssues = cards.map((card) => {
      const status = text(card.dataset.reviewStatus || card.dataset.verificationStatus || card.dataset.contentStatus).toLowerCase();
      const hasLink = Boolean(card.querySelector("a[href], button"));
      const label = card.textContent.trim();
      return { card, status, hasLink, label };
    }).filter((item) => isCandidate(item.status) && (/正式|已核验|完整诗境|沉浸式/u.test(item.label) || (item.hasLink && item.card.dataset.empty === "true")))
      .map((item) => ({ status: item.status, label: item.label.slice(0, 100) }));
    const stats = firstArray(coverage.stats, coverage.summary, coverage.counts, coverage.totals);
    const statsObjects = stats.length ? stats : [coverage.stats, coverage.summary, coverage.counts, coverage.totals].filter((item) => item && typeof item === "object");
    const actual = records.reduce((counts, record) => {
      const tier = tierNumber(record);
      const key = tier === null ? "unknown" : `L${tier}`;
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    const statMismatches = [];
    for (const summary of statsObjects) {
      const byTier = summary?.byTier || summary?.tiers;
      if (byTier && typeof byTier === "object") {
        for (const [key, value] of Object.entries(byTier)) {
          if (Number.isFinite(Number(value)) && actual[key] !== undefined && Number(value) !== actual[key]) statMismatches.push({ key, reported: Number(value), actual: actual[key] });
        }
      }
      if (Number.isFinite(Number(summary?.total)) && Number(summary.total) !== records.length) statMismatches.push({ key: "total", reported: Number(summary.total), actual: records.length });
    }
    return [
      check("content-tier-declared", tierIssues.filter((item) => item.tier === null).length === 0, { missingTier: tierIssues.filter((item) => item.tier === null).map(({ index, id }) => ({ index, id })) }),
      check("content-tier-candidate-honesty", tierIssues.filter((item) => item.tier !== null && isCandidate(item.status)).length === 0, { candidateAsMature: tierIssues.filter((item) => item.tier !== null && isCandidate(item.status)).map(({ index, id, tier, status }) => ({ index, id, tier, status })) }),
      check("content-tier-dom-honesty", domIssues.length === 0, { domIssues }),
      check("content-tier-statistics", statMismatches.length === 0, { statMismatches, actual }),
    ];
  }

  function checkScreenContract() {
    const screens = qa("[data-screen]");
    const expectedRoutes = ["map", "reader", "curriculum", "coverage", "daily", "challenge", "progress"];
    const presentRoutes = screens.map((screen) => screen.dataset.screen).filter(Boolean);
    const missingRoutes = expectedRoutes.filter((route) => !presentRoutes.includes(route));
    const activeRoutes = screens.filter(visible).map((screen) => screen.dataset.screen);
    return [
      check("screen-route-contract", missingRoutes.length === 0, { expectedRoutes, presentRoutes, missingRoutes }),
      check("single-active-screen", activeRoutes.length === 1, { activeRoutes, activeCount: activeRoutes.length }),
    ];
  }

  function checkSystem() {
    const api = window.__SHANHE_PHASE1__;
    const progress = api?.store?.get?.();
    const modes = AGE_MODES;
    const poemIds = api?.phase1Poems?.map((poem) => poem.id) || [];
    const placeIds = api?.phase1Places?.map((place) => place.id) || [];
    const interpretationRecords = api?.phase1Poems?.filter((poem) => poem.interpretation) || [];
    const interpretationCount = interpretationRecords.filter((poem) => poem.interpretation?.summary
      && poem.interpretation?.lineMeanings?.length === poem.lines.length
      && poem.interpretation?.extension?.text)?.length || 0;
    const conceptProviderExpected = Boolean(api?.conceptTutor || api?.concepts || api?.curriculum?.concepts);
    const conceptProviderChecks = conceptProviderExpected
      ? [check("concept-tutor-provider", typeof api?.conceptTutor?.lesson === "function" && typeof api?.conceptTutor?.answer === "function", { provider: Boolean(api?.conceptTutor), hasLesson: typeof api?.conceptTutor?.lesson === "function", hasAnswer: typeof api?.conceptTutor?.answer === "function" })]
      : [na("concept-tutor-provider", { reason: "运行时未注册概念导师" })];
    return [
      check("phase1-content-registry", poemIds.length >= 10 && new Set(poemIds).size === poemIds.length && placeIds.length >= 5 && new Set(placeIds).size === placeIds.length, { poemCount: poemIds.length, placeCount: placeIds.length, minimumPoems: 10, minimumPlaces: 5 }),
      check("phase1-interpretation-registry", interpretationRecords.length >= 10 && interpretationCount === interpretationRecords.length, { interpretationCount, interpretationRecords: interpretationRecords.length, minimum: 10 }),
      check("versioned-progress", progress?.version >= 2 && modes.includes(progress?.ageMode) && !Object.keys(progress || {}).some((key) => /reflection|rawInput/u.test(key)), { version: progress?.version, ageMode: progress?.ageMode, persistedKeys: Object.keys(progress || {}) }),
      check("audio-provider", Boolean(api?.audio?.providerId) && typeof api?.audio?.stop === "function" && typeof api?.audio?.playLine === "function", { providerId: api?.audio?.providerId }),
      check("tutor-provider", typeof api?.tutor?.respond === "function", { fallback: "grounded-local-tutor" }),
      check("age-modes", modes.every((mode) => document.querySelector(`[data-age-mode='${mode}']`)), { modes }),
      check("optional-origin-privacy", /不读取定位/u.test(document.querySelector("#origin-panel")?.textContent || "") && /不保存精确地址/u.test(document.querySelector("#origin-panel")?.textContent || ""), { persistence: "city-id-only" }),
      ...conceptProviderChecks,
    ];
  }

  function run() {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const mapVisible = visible(document.querySelector("#map-screen"));
    const readerVisible = visible(document.querySelector("#reader-screen"));
    const dailyVisible = visible(document.querySelector("#daily-screen"));
    const challengeVisible = visible(document.querySelector("#challenge-screen"));
    const progressVisible = visible(document.querySelector("#progress-screen"));
    const curriculumVisible = visible(document.querySelector("#curriculum-screen"));
    const coverageVisible = visible(document.querySelector("#coverage-screen"));
    const checks = [
      check("console-errors", runtimeDiagnostics.errors.length === 0, { messages: runtimeDiagnostics.errors.slice(0, 20) }),
      check("console-warnings", runtimeDiagnostics.warnings.length === 0, { messages: runtimeDiagnostics.warnings.slice(0, 20) }),
      ...checkScreenContract(),
      ...checkMap(mapVisible),
      ...checkReading(readerVisible, viewport),
      ...checkSystem(),
      ...checkJargonGuard(readerVisible, runtimeConcepts()),
      ...checkConceptTutor(readerVisible, runtimeConcepts()),
      ...checkCurriculumCoverage(),
      ...checkCorpusQuality(),
      ...checkGeographicCoverage(),
      ...checkContentTierHonesty(),
    ];
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.qaReducedMotion === "true";
    checks.push(reducedMotion
      ? check("reduced-motion-contract", Number.parseFloat(getComputedStyle(document.querySelector(".screen")).animationDuration || "0") <= 0.01, {})
      : na("reduced-motion-contract", { reason: "当前环境未请求减少动态" }));
    const result = {
      at: new Date().toISOString(),
      view: mapVisible ? "map" : readerVisible ? "reader" : curriculumVisible ? "curriculum" : coverageVisible ? "coverage" : dailyVisible ? "daily" : challengeVisible ? "challenge" : "progress",
      viewport,
      checks,
      pass: checks.every((item) => item.pass !== false),
      needsHumanReview: checks.some((item) => item.status === "review"),
    };
    const serialized = JSON.stringify(result);
    outputNode().value = serialized;
    outputNode().textContent = serialized;
    return result;
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      run();
      // The expanded catalog is fetched after the first paint. Re-run a small
      // bounded number of times so the hidden QA output does not freeze at the
      // ten-poem fallback snapshot before learningCatalog is ready.
      const catalog = runtimeApi().curriculum?.catalog;
      if (runtimeApi().curriculum && Array.isArray(catalog) && catalog.length === 0 && refreshAttempts < 8) {
        refreshAttempts += 1;
        schedule();
      } else {
        refreshAttempts = 0;
      }
    }, 120);
  }

  window.__SHANHE_EVALUATOR__ = { run, schedule };
  addEventListener("resize", schedule, { passive: true });
  document.addEventListener("shanhe:viewchange", schedule);
  document.addEventListener("focusin", schedule);
  document.addEventListener("DOMContentLoaded", schedule, { once: true });
  if (document.readyState !== "loading") schedule();
}());
