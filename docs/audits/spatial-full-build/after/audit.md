# Spatial Full Build · After Audit

Captured: 2026-09-01
Flow: World → Lens → Lushan reading → spatial AI → memory → Yellow Crane Tower → return map
Accessibility target: WCAG 2.2 AA, with 48 px preferred child touch targets

## Final verdict

**Passed for the current local vertical slice.** The P0 false-map problem and all observed P1 continuity, primary-content, mobile-density and completion-memory problems are resolved. No secondary interaction overlaps the poem in any captured state. The remaining risks require a physical device, assistive technology or supervised child study and are listed below.

## Evidence matrix

| State | Viewport | Result | Evidence |
| --- | --- | --- | --- |
| World / first entry | 1440×900 | Pass | `01-world-1440x900.png` |
| Regional lens / map observation | 1440×900 | Pass | `02-region-1440x900.png` |
| Reading / all four lines + pinyin | 1440×900 | Pass | `03-reading-1440x900.png` |
| AI spatial reflection | 1440×900 | Pass | `04-ai-space-1440x900.png` |
| Memory journey | 1440×900 | Pass | `05-journey-1440x900.png` |
| Yellow Crane Tower handoff | 1440×900 | Pass | `06-yellow-crane-1440x900.png` |
| Return map / visible memory | 1440×900 | Pass | `07-return-memory-1440x900.png` |
| Full mobile flow | 390×844 | Pass | `08-world-390x844.png` through `12b-journey-map-390x844.png` |
| Focused input / keyboard proxy | 390×500 | Pass | `13-input-keyboard-390x500.png` |
| Short-screen poem protection | 390×600 | Pass | `14-poem-protection-390x600.png`, `evaluator-390x600-reading.json` |
| Tablet world + reading | 1024×768 | Pass | `15-world-1024x768.png`, `16-reading-1024x768.png` |
| Short desktop reading | 1440×720 | Pass | `17-reading-1440x720.png` |
| 125% text scale | 390×844 | Pass | `18-large-text-390x844.png` |
| Reduced motion contract | 1440×900 | Pass | `19-reduced-motion-1440x900.png` |
| Optional city origin | 1440×900 | Pass | `20-origin-city-1440x900.png` |
| Combined source/implementation comparison | 1440×900 | Pass | `21a-comparison-world.png` through `21d-comparison-reading.png` |

## Programmatic results

- Spatial data check: 18 entities, 10 relations and 5 optional origin cities; every display relation has precision, confidence, valid time and source provenance.
- Physical map check: 65 projected Natural Earth paths loaded from `content/generated/china-physical-map.json`; labels and marker positions derive from the same spatial system.
- 390×600 reading: all four lines are in the viewport, every line is 337×45 px, poem text is 28.8 px / 36.864 px line height, no line intersections, no secondary-content intersections and no horizontal overflow.
- Pinyin: 4 lines / 32 paired ruby tokens; curated readings remain data-owned rather than generated at render time.
- Touch targets: evaluator found no undersized active controls in the tested reading and input states.
- Large text: `qaTextScale=125` produced 36 px poem text on 390×844 with no horizontal page overflow.
- Reduced motion: the deterministic `qaReducedMotion=1` contract reduced animation duration to a near-zero value and kept all state changes operable.
- Console: final run contained no `error` or `warn` entries from the application.

## Visual critique and corrections made during QA

1. The first mobile build exposed both Lushan and Yellow Crane Tower before completion; the close marker targets could compete. The first-visit map now exposes only Lushan, and Yellow Crane Tower appears after the visit establishes a reason for it.
2. The regional prototype showed Yellow Crane Tower and a decorative curve before the child had discovered the second place. Both were removed from the regional scope.
3. The first regional question asked for a visually unsupported water-area comparison. It now asks for the named lake south of Lushan, which the data and labels actually support.
4. The first journey connector looked route-like. It is now a thin straight, dashed relation with explicit `present_day_straight_line_not_route` semantics and visible “非路线” language.
5. Several regional labels crowded Lushan. Placement is now scope-specific and data-owned.
6. The 390×600 poem originally fell to 26.4 px. It is now 28.8 px while preserving all four lines in view.
7. The “不知道” secondary action was below the child target size. Its minimum target is now 48 px.

## Primary-content protection result

The poem remains the dominant content in reading, AI question, input and completion states. The AI is a staged continuation in normal document flow, never a fixed or absolute-positioned chat surface. In the short keyboard proxy, the focused input and actions remain visible while the poem stays reachable above; no control is layered over the text.

## Evidence limits / residual risks

- Physical iOS and Android browser chrome and soft-keyboard resize behavior were not available in the desktop browser harness.
- VoiceOver and TalkBack phrasing, rotor order and live-region timing still need real assistive-technology checks.
- The browser harness exposed native roles and focus styling, but did not reliably emulate a complete physical Tab traversal; that traversal remains a device-level verification item.
- Only a supervised child session can establish whether children can later recall the Lushan–Poyang–Yangtze and Lushan–Yellow Crane relationships without prompting.
- Expanded public deployment of China boundary or tiled map data would require a separate compliance review; this local slice deliberately uses a boundary-free public-domain physical layer.
