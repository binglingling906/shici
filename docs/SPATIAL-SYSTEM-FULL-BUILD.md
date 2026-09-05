# 山河诗境 · Spatial System Full Build

Date: 2026-09-01
Scope: China → middle Yangtze → Lushan → `望庐山瀑布` → memory journey → Yellow Crane Tower

## Outcome

This build reconstructs the prototype around a single data-driven spatial mental model. The national map, regional lens, poem scene and completed journey are different states of the same geographic system rather than unrelated pages.

## System roles

| Learning moment | Dominant map role | What the child should understand |
| --- | --- | --- |
| First entry | World | Lushan is in the southeastern half of China and connected to the middle Yangtze region. |
| Place discovery | Lens | Lushan is near Jiujiang, between the Yangtze and Poyang Lake. |
| Poem reading | Presence | The poem is being read at Lushan; `遥看`, `直下`, and `落九天` describe distance, direction and imagination. |
| Completion | Memory | The visit leaves a visible place and poem trace. |
| Next station | Journey | Yellow Crane Tower is northwest of Lushan, roughly 195 km straight-line, connected by present-day geography and a cultural thread rather than a claimed historical itinerary. |

## Architecture

- `content/spatial-system.js` — entities, relations, uncertainty, provenance, map scopes and optional origin cities.
- `content/spatial-math.js` — distance, bearing, direction and display formatting.
- `content/generated/china-physical-map.json` — Natural Earth-derived projected path data and entity positions.
- `scripts/build-map-data.mjs` — reproducible physical map generator.
- `scripts/check-spatial-system.mjs` — schema, provenance, geometry and relation consistency checks.
- `evaluation/experience-evaluator.js` — browser experience and spatial-system evaluator.

## Visual direction

The build keeps the original mineral-green, rice-paper, Song-painting museum tone while replacing manually drawn pseudo-map geometry with real public-domain geographic source data. The poem scene uses a generated raster landscape asset so the primary artwork is no longer constructed from approximate inline SVG shapes.

Visual exploration:

- `docs/research/spatial-full-build/concept-world-atlas.png`
- `docs/research/spatial-full-build/concept-continuous-lens.png`
- `docs/research/spatial-full-build/concept-memory-journey.png`

## Historical safety

- Lushan is represented by an approximate mountain anchor, not Li Bai’s exact position.
- The current Yellow Crane Tower position is not treated as the Tang-period tower site.
- The Lushan → Yellow Crane Tower path is a present-day spatial and cultural relation, not a documented Li Bai journey.
- The poem’s exact writing year, waterfall and viewing position are not presented as settled facts.
- `落九天` is presented as poetic imagination, not a measured physical height.

## Privacy

The optional “where I start” feature is city-level only. It is manually selected, requests no GPS or precise address, stores only a city id in local browser storage, can be skipped, and can be cleared.

## Research and source record

- `docs/research/spatial-full-build/intelligence-and-facts.md`
- `docs/research/spatial-full-build/design-decision.md`
- `docs/DATA-SOURCES.md`

## Audit evidence

- Before audit: `docs/audits/spatial-full-build/before/`
- After audit: `docs/audits/spatial-full-build/after/`
- Comparison page: `docs/audits/spatial-full-build/comparison.html`
- Design QA: `design-qa.md`

## Verification matrix

| State / viewport | Result | Evidence |
| --- | --- | --- |
| 1440×900 full flow | pass | `after/01`–`07` |
| 1440×720 reading | pass | `after/17-reading-1440x720.png` |
| 1024×768 world + reading | pass | `after/15`, `after/16` |
| 390×844 full flow | pass | `after/08`–`12b` |
| 390×600 poem protection | pass | `after/14`, evaluator JSON |
| 390×500 input / keyboard proxy | pass | `after/13-input-keyboard-390x500.png` |
| 125% large text | pass | `after/18-large-text-390x844.png` |
| Native semantics + visible focus | pass | native roles, focus CSS, `after/12b`; physical Tab traversal remains a device risk |
| Reduced motion | pass | `after/19-reduced-motion-1440x900.png` |
| Browser console | pass | 0 application warnings / errors in final run |

## Residual risks

The remaining risks are limited to evidence that cannot be established in the current environment: real-device browser chrome/keyboard behavior, VoiceOver/TalkBack phrasing, physical Tab traversal in the harness, public-map compliance for future expanded data, and whether real children retain the intended spatial relationships after a delay.
