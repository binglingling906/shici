# Spatial System Full Build · Design Decision Log

Date: 2026-09-01
Status: implemented and visually verified

## Product decision

The spatial system is not a permanent miniature map and not a collection of place cards. It is one geographic state machine with four roles that become dominant at different moments:

1. **World** — a north-up, data-derived China physical map establishes overall orientation.
2. **Lens** — the same map narrows to the middle Yangtze, Jiujiang, Poyang Lake and Lushan before the poem opens.
3. **Presence** — while reading, a quiet spatial breadcrumb and poem-space cue preserve location without competing with the poem.
4. **Journey / Memory** — after completion, the map re-expands, records the visit, and explains why Yellow Crane Tower is the next direction.

The visual north star is `concept-world-atlas.png`. `concept-continuous-lens.png` informs the regional transition, and `concept-memory-journey.png` informs the completion state. They are not merged into one crowded screen.

## Why the old structure is being replaced

The old home view used a handcrafted atmospheric mountain scene whose marker positions were manually placed. It communicated mood but not China’s shape, a river system, national orientation, or a stable geographic scale. The reading view reduced the map to a text breadcrumb. Completion put a low-contrast journey bridge beside the poem, and returning home added only a stamp and counter. Removing the map would therefore leave most of the learning experience intact.

The rebuilt system makes three relationships impossible to remove without losing meaning:

- Lushan’s national and regional location;
- Lushan’s relation to Jiujiang, Poyang Lake and the Yangtze;
- the present-day Lushan → Yellow Crane Tower direction, distance and river relation.

## Interaction hypotheses compared

### Civilization atlas

A geographic China map is primary, with a small number of cultural anchors and one clear destination. Strongest for national orientation and future extensibility. Selected as the home architecture.

### Continuous painted lens

A single scroll-like world moves from national to regional scale. Strongest for continuity and the transition into the poem, but too ambiguous as the only home state. Used for the map scope transition.

### Growing memory map

Visited places and the child’s own route become the primary surface. Strongest after completion, but weak for a first-time child with no history. Used as the completion and return-home state.

## Map technology decision

The current slice does not need a tile server, street map, WebGL camera, or a general GIS interaction model. MapLibre GL JS and story-map templates demonstrate useful camera and chapter patterns, but their tile/style/network complexity would dominate a two-destination learning flow.

The chosen approach is:

- public-domain Natural Earth physical/cultural source geometry;
- a reproducible build step that converts source shapefiles to projected SVG path data;
- a north-up projection fitted to the China feature;
- semantic HTML buttons positioned from generated projected coordinates;
- scope changes driven by data-defined view boxes;
- an accessible text/list alternative for every geographic relationship.

This keeps the current static architecture, removes manual marker positioning, works offline after generation, and leaves a migration path to MapLibre if later slices require continuous pan/zoom, many layers or vector tiles.

## Child spatial-learning decisions

- The interface always names the current scale; a child is not expected to infer zoom level.
- Direction is reinforced with words and a north indicator, never color alone.
- The regional prompt asks the child to look, compare and answer before explaining.
- The poem scene uses only three spatial ideas: distance (`遥看`), vertical motion (`直下`), and imaginative scale (`落九天` is poetic exaggeration, not a measured height).
- Reference anchors are limited and visually secondary.
- Touch targets target 48 px for the 8–12 age group.

## Personal origin decision

The capability is included as secondary, optional disclosure on the national map. It uses a manually selected city-level reference only, stores only a city id locally, never requests GPS, can be skipped, and can be cleared. Its purpose is to turn the national map from an abstract picture into a relation to the child’s own known place.

## Sound decision

No new ambient sound layer is added. The existing explicit sound control and poem reading already provide audio value. Adding automatic water or transition ambience would increase attention load and require more media/accessibility work without proving additional spatial learning value.

## Historical uncertainty decision

- Modern coordinates are labeled by valid time and precision.
- The Lushan coordinate is a representative mountain anchor, not Li Bai’s viewpoint.
- The current Yellow Crane Tower pin is not treated as the Tang-period tower location.
- The system does not assert a precise writing year, viewing platform, waterfall, or Lushan → Yellow Crane Tower itinerary.
- Cultural continuity and present-day geography are separate relation types.

## Accessibility contract

- Native buttons and form controls are used for interactions.
- Map relationships have a linearized text alternative.
- The map may retain a two-dimensional graphic, but adjacent learning content reflows to one column.
- No context change occurs on focus.
- Focus remains visible and unobscured.
- `prefers-reduced-motion` removes scope-transition animation.
- Large text may increase document height; it must not overlap, clip or require horizontal page scrolling.

## Evidence used

- Existing flow captures: `docs/audits/spatial-full-build/before/`
- Visual concepts: `docs/research/spatial-full-build/`
- Product constraints: `AGENTS.md`
- Earlier spatial decisions: `docs/SPATIAL-DISCOVERY-001.md`
- Sources and licenses: `docs/DATA-SOURCES.md`
