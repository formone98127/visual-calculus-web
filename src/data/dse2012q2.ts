import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q2 — difference of squares, formula first. */
export const dse2012Q2Lessons: Lesson[] = [
  {
    id: 'dse-2012-q2',
    title: '2012 DSE Q2: difference of squares, fast',
    subtitle: 'Write the formula, substitute, done — no expanding',
    lab: true,
    beats: [
      {
        id: 'g0',
        caption: 'The question',
        prompt:
          '(4x+y)² − (4x−y)² = ? Two squares, one subtraction — that is a formula question, not an expansion question.',
        viz: { type: 'sumDiffLab', props: { mode: 'ask' } },
      },
      {
        id: 'g1',
        caption: 'Two formulas, written first',
        prompt:
          '① a²−b² = (a+b)(a−b) does the work. ② (a+b)²−(a−b)² = 4ab is the one-line shortcut. Formula before algebra.',
        viz: { type: 'sumDiffLab', props: { mode: 'laws' } },
      },
      {
        id: 'g2',
        caption: 'Name a and b',
        prompt:
          'a = 4x+y, b = 4x−y. The formula only needs names — no expanding yet.',
        viz: { type: 'sumDiffLab', props: { mode: 'name' } },
      },
      {
        id: 'g3',
        caption: 'Formula ① needs a+b',
        prompt:
          '(4x+y) + (4x−y): +y and −y make a zero pair. What survives: 4x+4x. a+b = 8x.',
        viz: { type: 'sumDiffLab', props: { mode: 'sum' } },
      },
      {
        id: 'g4',
        caption: 'Formula ① needs a−b',
        prompt:
          '(4x+y) − (4x−y): the minus flips the −y into +y. y−(−y) = 2y — the y doubles. a−b = 2y.',
        viz: { type: 'sumDiffLab', props: { mode: 'diff' } },
      },
      {
        id: 'g5',
        caption: 'Your turn — finish Formula ①',
        prompt: 'a+b = 8x and a−b = 2y. Tap what (8x)(2y) equals.',
        gate: 'interact',
        viz: { type: 'sumDiffLab', props: { mode: 'gate' } },
      },
      {
        id: 'g6',
        caption: '(8x)(2y) = 16xy',
        prompt:
          'Numbers multiply: 8×2 = 16. Letters multiply: x·y = xy. That is option D.',
        viz: { type: 'sumDiffLab', props: { mode: 'multiply' } },
      },
      {
        id: 'g7',
        caption: 'Formula ② — one line',
        prompt:
          '(a+b)²−(a−b)² = 4ab = 4(4x)(y) = 16xy. Same answer in one line — perfect for checking.',
        viz: { type: 'sumDiffLab', props: { mode: 'shortcut' } },
      },
      {
        id: 'g8',
        caption: 'Why it works — expand',
        prompt:
          '16x² cancels 16x², y² cancels y². The cross terms: 8xy−(−8xy) = 16xy. The formula never lies.',
        viz: { type: 'sumDiffLab', props: { mode: 'expand' } },
      },
      {
        id: 'g9',
        caption: 'Why A, B, C fall',
        prompt:
          'A: the brackets differ, nothing cancels. B: (2y)² ≠ 2y². C: a−b = 2y, not y. Formula first — every time.',
        viz: { type: 'sumDiffLab', props: { mode: 'check' } },
      },
      {
        id: 'g10',
        caption: 'Step-by-step solution guide',
        prompt:
          'Full thinking path: spot square−square → write Formula ① → name a, b → add (8x), subtract (2y) → 16xy = D.',
        viz: { type: 'sumDiffLab', props: { mode: 'guide' } },
      },
    ],
  },
]
