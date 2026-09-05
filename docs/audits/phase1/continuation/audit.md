# Phase 1 continuation audit

Date: 2026-09-01
Mode: combined UX and accessibility audit
Surface: local Phase 1 prototype
Flow: map → place → poem → age mode → answer → completion → next station → progress → challenge

## User goal and accessibility target

A child should be able to locate a place, read the complete poem, use optional pinyin and audio, answer without the Tutor hiding the poem, leave one unambiguous footprint, and continue to the next spatially related place. The flow should remain legible and operable at 1440×900, 390×844, and 320×700.

## Numbered flow evidence

1. **Map entry — healthy.** The five places remain visible as geographic choices and the first-place panel scrolls into view after selection. Evidence: `01-map-start.png`, `02-place-open.png`.
2. **Poem entry — healthy.** The poem is the visual center. The location context and Tutor use separate columns and do not overlap the poem. Pinyin is visibly above each character. Evidence: `03-poem-start.png`.
3. **Age-mode choice — healthy.** The dialog explains what changes without requesting a birthday; focus enters the modal and the selected mode is explicit. Evidence: `05-age-dialog.png`.
4. **Answer and completion — healthy after refinement.** A correct observation enables completion; the modal states that raw child text is not stored. A completed poem now shows a disabled “已留下足迹” control and cannot create another “new” footprint. Evidence: `04-complete-dialog.png`, browser DOM verification after the patch.
5. **Mobile deep reading — healthy.** At 390×844, all eight lines of 《黄鹤楼》 are visible before the secondary interaction; the Tutor follows below in normal flow. Evidence: `06-mobile-deep-read.png`, `07-mobile-tutor.png`, `08-mobile-response.png`.
6. **Progress and challenge — healthy.** Progress is grouped by place and today’s challenge gives a non-answer hint on the first wrong attempt. Evidence: `09-mobile-progress.png`, `10-mobile-challenge.png`.
7. **Mobile recovery controls — healthy after refinement.** The sound master control remains visible at 390px and 320px, keeps a 44px target, and produces no horizontal overflow. Evidence: `11-mobile-sound-fixed.png`, `12-mobile-320.png`.

## Strengths

- Primary learning content remains visible before and after AI interaction.
- Mobile reading order is poem → place context → Tutor, matching the information hierarchy.
- Pinyin, audio, age mode, challenge, progress, and next-place transitions are all operable rather than decorative.
- Completion feedback distinguishes structured progress from unsaved free-form input.
- No browser console warnings or errors appeared during the flow.

## UX risks found and resolved

- **Progress-unit mismatch:** the header showed `1/10` poems while the map sidebar showed `0/5` completed places. The sidebar now uses `completed poems / 10 poems`, so the child sees immediate confirmation after one poem.
- **Repeated completion:** revisiting an already completed poem could display another “new footprint” modal. Completion is now idempotent and the control reads `已留下足迹`.
- **Over-specific Tutor follow-up:** the fallback asked how every evidence word made the scene “move,” which was unsuitable for time and place words. It now asks whether distance, direction, time, or the scene changed.
- **Hidden mobile sound recovery:** the master sound toggle was hidden below 820px, so a persisted off-state could not be reversed on a phone. The 44px control now remains available down to 320px.

## Accessibility risks and evidence limits

- Screenshot and DOM evidence confirm responsive reflow, labels, focusable controls, 44px sound target, and lack of horizontal overflow; they do not prove full screen-reader behavior or WCAG compliance.
- The in-app browser cannot reproduce every native mobile virtual-keyboard behavior. The evaluator’s visual-viewport checks remain the automated guard for keyboard interference.
- Web Speech voice quality, pronunciation, and availability still depend on the device and require real-device listening.
- No real child participated in this audit; cognitive-load conclusions remain expert review until observed with children.

## Validation

- `npm run check`: passed — 5 places, 10 poems, 388 line tokens, 100 catalog candidates, 3 age modes.
- `git diff --check`: passed.
- Browser console: no warnings or errors during the audited journey.
- Responsive checks after refinement: 390×844 and 320×700, no horizontal overflow; sound control visible.
