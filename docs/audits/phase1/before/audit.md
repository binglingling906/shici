# Phase 1 Complete Product Build · Before Audit

Captured: 2026-09-01
Surface: current local product at `http://127.0.0.1:4173/`
User goal: explore a living Chinese poetry geography system, not a single-place demo
Accessibility target: WCAG 2.2 AA with child-friendly reading and touch sizing

## Overall verdict

The current Lushan slice is visually strong and protects the poem, but the runtime is still structurally a one-place experiment. The largest immediate reading defect is confirmed: pinyin renders **below** each character, despite the data and DOM using `ruby`/`rt`.

## Captured steps

1. `01-world-1440x900.png` — the map establishes a calm national frame, but exposes only one complete destination and no working Tang/Song/landscape/city/poet exploration system.
2. `02-reading-pinyin-below-1440x900.png` — all four poem lines are visible, but the red pinyin annotations are visibly below the Han characters.

## Root cause of the pinyin defect

The DOM order is semantically correct: `<ruby><span class="poem-character">字</span><rt>pinyin</rt></ruby>`. The stylesheet then overrides native ruby layout with `display: inline-flex; flex-direction: column`. Flex lays out the character first and the `rt` second, so `ruby-position: over` no longer controls annotation placement. The fix must restore native ruby layout instead of compensating with negative offsets.

## Structural gaps against Phase 1

- `app.js` imports one poem and contains place-specific DOM/state names throughout.
- The map only exposes one complete destination; Yellow Crane Tower is still a teaser.
- No real Tang/Song/landscape/city/poet filtering exists.
- No age-mode state, reusable Tutor engine, Audio Provider abstraction, daily poem, challenge system or versioned progress store exists.
- Progress is a four-step Lushan journey object rather than a poem/place learning record.
- The pinyin checker validates one poem only.
- The evaluator is tightly coupled to Lushan and a four-line poem.
- The 100-poem catalog and reproducible content pipeline do not yet exist.

## Strengths to preserve

- Calm Song-painting / museum visual language.
- Real data-derived physical map and provenance-aware spatial relations.
- Primary-content protection and progressive disclosure.
- Curated per-character pronunciation tokens and work-level overrides.
- Normal-flow AI interaction rather than a floating chat window.
- Reduced-motion, responsive and text-alternative foundations.
