import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q3 — polynomial identity, compare like terms. */
export const dse2012Q3Lessons: Lesson[] = [
  {
    id: 'dse-2012-q3',
    title: '2012 DSE Q3: identity, compare terms',
    subtitle: 'Expand the right side, match terms — p falls out',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The question',
        prompt:
          'x² + p ≡ (x+2)(x+q) + 10. The ≡ holds for every x — both sides must be the same polynomial. Find p.',
        viz: { type: 'polyIdLab', props: { mode: 'ask' } },
      },
      {
        id: 'p1',
        caption: 'Two tools, written first',
        prompt:
          '① (x+m)(x+n) = x²+(m+n)x+mn expands the right side. ② Matching sides: 0·x+p = (q+2)x+2q+10. Formula before algebra.',
        viz: { type: 'polyIdLab', props: { mode: 'laws' } },
      },
      {
        id: 'p2',
        caption: 'Write both sides out',
        prompt:
          'LHS: x² + 0·x + p (the x-term hides a zero). RHS: expand with ① — x² + (q+2)x + 2q + 10.',
        viz: { type: 'polyIdLab', props: { mode: 'name' } },
      },
      {
        id: 'p3',
        caption: 'Match the x-terms',
        prompt:
          'x never lies: 0·x = (q+2)x, so q + 2 = 0 and q = −2. The x-terms must match too.',
        viz: { type: 'polyIdLab', props: { mode: 'xcoef' } },
      },
      {
        id: 'p4',
        caption: 'Match the constants',
        prompt:
          'Constants match as well: p = 2q + 10 = 2(−2) + 10 = 6. Substitute q and it collapses to 6.',
        viz: { type: 'polyIdLab', props: { mode: 'const' } },
      },
      {
        id: 'p5',
        caption: 'Your turn — finish it',
        prompt: 'q = −2 and p = 2q + 10. Tap what p equals.',
        gate: 'interact',
        viz: { type: 'polyIdLab', props: { mode: 'gate' } },
      },
      {
        id: 'p6',
        caption: 'p = 6',
        prompt:
          '2(−2) + 10 = −4 + 10 = 6. That is option C — no expanding of the whole polynomial needed.',
        viz: { type: 'polyIdLab', props: { mode: 'answer' } },
      },
      {
        id: 'p7',
        caption: 'Shortcut — one line',
        prompt:
          '≡ holds for every x, so pick the sneakiest x: −2. Then (x+2) = 0 and 4 + p = 10 → p = 6. One line.',
        viz: { type: 'polyIdLab', props: { mode: 'shortcut' } },
      },
      {
        id: 'p8',
        caption: 'Why it works — check x = −2',
        prompt:
          'LHS: (−2)² + 6 = 10. RHS: 0·(x+q) + 10 = 10. Both sides 10 — the identity is confirmed.',
        viz: { type: 'polyIdLab', props: { mode: 'verify' } },
      },
      {
        id: 'p9',
        caption: 'Why A, B, D fall',
        prompt:
          'A: −4 is just 2q — the +10 is missing. B: −2 is q, not p. D: 10 is the given constant. Match terms, then answer.',
        viz: { type: 'polyIdLab', props: { mode: 'check' } },
      },
      {
        id: 'p10',
        caption: 'Step-by-step solution guide',
        prompt:
          'Full thinking path: spot the identity → expand RHS with ① → match x: q = −2 → match constants: p = 6 → C. Shortcut: sub x = −2.',
        viz: { type: 'polyIdLab', props: { mode: 'guide' } },
      },
    ],
  },
]
