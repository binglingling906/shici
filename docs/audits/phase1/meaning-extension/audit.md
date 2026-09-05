# Poem meaning and extension audit

Date: 2026-09-01

## Scope

Ten complete Phase 1 poems now include a concrete summary, one modern-Chinese meaning for every poem line, and a clearly labelled extended reading with a reflection prompt.

## Interaction decision

- The original poem remains primary content.
- In the 7–8 mode, “逐句读懂” is open by default as a reading scaffold.
- In the 9–10 and 11–12 modes, the same support remains visible as a compact disclosure and opens on demand.
- “诗外的一步” states that it is one possible extended reading, not a unique standard answer.

## Content guardrails

- Hyperbole, metaphor, personification, and legend are identified as poetic expression instead of literal fact.
- 《题西林壁》 is not reduced to one compulsory moral.
- 《春望》 and 《子夜吴歌·秋歌》 preserve the cost of war and the experience of ordinary families.
- Geographic relationships remain learning references rather than invented precise historical routes.

## Verification

- Content build and checks pass: 5 places, 10 poems, 54 aligned line meanings, 388 pinyin tokens, 100 catalog candidates.
- Runtime content schema is version 2.
- 1440×900 and 390×844 screenshots show no horizontal overflow.
- The experience evaluator passes `poem-meaning-support` for both four-line and eight-line poems.

## Evidence

- `02-desktop-1440-meaning.png`
- `03-mobile-390-meaning.png`
- `04-mobile-390-meaning-top.png`
