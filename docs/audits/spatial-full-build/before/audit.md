# Spatial Full Build · Before Audit

Captured: 2026-09-01
Flow: national cover → Lushan reading → AI reflection → completion journey → return map
Accessibility target: WCAG 2.2 AA, with 48 px preferred child touch targets

## Overall verdict

The existing slice protects the poem and preserves a pleasant museum-like visual atmosphere, but the map is not yet the product’s cognitive backbone. The system passes geometric no-overlap checks while failing the stronger counterfactual: most of the poem and reflection experience still makes sense when the map is removed.

## Captured steps

1. `01-world-desktop.png` — **structurally weak**. The first view is a beautiful abstract mountain cover, not a recognizable China map. The giant title is the primary visual object. Marker positions, mountains and river are manually composed and cannot teach a reliable national mental map.
2. `02-lushan-reading-desktop.png` — **reading health is good; spatial continuity is weak**. All four lines and pinyin are visible, and no secondary UI occludes the poem. Location is preserved only as a text breadcrumb, so Jiujiang, Poyang Lake and the Yangtze are not observable relationships.
3. `03-ai-reflection-desktop.png` — **interaction health is good; geographic meaning is missing**. The prompt invites imagination without acting like a floating chat window, but it does not ask the child to read a map or identify the poem’s spatial language.
4. `04-complete-journey-desktop.png` — **semantics improved; visual legibility is weak**. Direction, distance and the historical-route disclaimer exist, but low contrast and placement beside the poem make the journey feel like an attached recommendation module.
5. `05-world-memory-desktop.png` — **memory is too thin**. Returning home adds a seal and counter but not a visible route, poem memory, river connection or changed world state.
6. `06-world-mobile-390x844.png` — **responsive layout works; spatial priority is reversed**. The giant title consumes roughly the upper half while the map remains an abstract cropped mountain field. The phone cannot establish China-wide orientation.

## Highest-impact problems

- **P0 — false map affordance:** the screen calls itself a map but is an atmospheric illustration with manually positioned markers.
- **P1 — missing national-to-regional step:** clicking Lushan jumps directly from the cover to the poem.
- **P1 — map-dependent learning is absent:** the child cannot visually find Jiujiang, Poyang Lake or the Yangtze.
- **P1 — memory has no geography:** “I visited” changes a badge, not the spatial world.
- **P1 — next station is visually secondary:** the completed route is crowded and low contrast.
- **P2 — AI does not teach spatial observation:** the prompt is imaginative but not map-aware.
- **P2 — automated evaluator overstates success:** it verifies the presence of labels and the correctness of stored coordinates but not whether the screen actually represents a geographic map.

## Confirmed strengths to preserve

- Complete poem and curated ruby pinyin.
- Calm visual tone and restrained mineral palette.
- AI reflection in normal flow rather than a floating chat window.
- 44 px or larger core controls.
- Modern-geography disclaimer for Lushan → Yellow Crane Tower.
- Reduced-motion and responsive foundations.

## Evidence limits

Screenshots cannot confirm screen-reader announcements, actual child comprehension, real-device soft-keyboard behavior, or whether the selected spatial vocabulary is developmentally appropriate. Those require programmatic checks, keyboard/VoiceOver testing, device testing and later supervised child research.
