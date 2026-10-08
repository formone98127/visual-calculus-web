import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q1 — index laws inside one fraction. */
export const dse2012Q1Lessons: Lesson[] = [
  {
    id: 'dse-2012-q1',
    title: '2012 DSE Q1: the power tower',
    subtitle: 'Cube the bracket, then divide — two index laws, one answer',
    lab: true,
    beats: [
      {
        id: 'g0',
        caption: 'One fraction, one power',
        prompt: '(2x⁴)³ ÷ 2x⁵ = ? Two index laws are hiding in the very first question of Paper 2.',
        viz: { type: 'indexLawLab', props: { mode: 'ask' } },
      },
      {
        id: 'g1',
        caption: 'A power is repeated copying',
        prompt:
          'The 3 counts brackets, not factors. (2x⁴)³ means (2x⁴)(2x⁴)(2x⁴) — the whole bracket, stamped out three times.',
        viz: { type: 'indexLawLab', props: { mode: 'copies' } },
      },
      {
        id: 'g2',
        caption: 'Cube the 2: 2·2·2 = 8',
        prompt:
          'The cube reaches inside the bracket and acts on the 2 as well. 2³ = 8 — not 2×3 = 6.',
        viz: { type: 'indexLawLab', props: { mode: 'coeffs' } },
      },
      {
        id: 'g3',
        caption: 'x⁴·x⁴·x⁴ = x¹²',
        prompt:
          'Same base multiplied → add the indices: 4+4+4 = 12. Same as (x⁴)³ = x⁴ˣ³. Numerator done: 8x¹².',
        viz: { type: 'indexLawLab', props: { mode: 'indices' } },
      },
      {
        id: 'g4',
        caption: 'Your turn — finish the division',
        prompt: 'Top: 8x¹². Bottom: 2x⁵. Tap the option that follows both laws.',
        gate: 'interact',
        viz: { type: 'indexLawLab', props: { mode: 'challenge' } },
      },
      {
        id: 'g5',
        caption: 'Numbers first: 8 ÷ 2 = 4',
        prompt: 'Coefficients divide like plain numbers. The 2 cancels half of the 8.',
        viz: { type: 'indexLawLab', props: { mode: 'divide' } },
      },
      {
        id: 'g6',
        caption: 'Indices subtract: 12 − 5 = 7',
        prompt:
          'x¹² ÷ x⁵ — dividing same bases cancels factors: five of the twelve x’s pair off and vanish.',
        viz: { type: 'indexLawLab', props: { mode: 'subtract' } },
      },
      {
        id: 'g7',
        caption: '4x⁷ — option C',
        prompt:
          'Two laws, top to bottom: cube the bracket (2³, 4×3), then divide like bases (8÷2, 12−5).',
        viz: { type: 'indexLawLab', props: { mode: 'final' } },
      },
      {
        id: 'g8',
        caption: 'Why A, B and D fall',
        prompt:
          'B multiplied the 2 by 3 (got 6x¹²). D cubed the index (4³ = 64). A mixed both traps. Every step: one law at a time.',
        viz: { type: 'indexLawLab', props: { mode: 'check' } },
      },
    ],
  },
]
