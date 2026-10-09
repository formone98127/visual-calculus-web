import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q4 — factor theorem, cubic divisible by (x+3). */
export const dse2012Q4Lessons: Lesson[] = [
  {
    id: 'dse-2012-q4',
    title: '2012 DSE Q4: factor theorem',
    subtitle: '(x+3) divides it — sub x = −3, k falls out',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The question',
        prompt:
          'x³ + 4x² + kx − 12 is divisible by x + 3. Divisible = (x+3) is a factor → f(−3) = 0. Find k.',
        viz: { type: 'cubicFacLab', props: { mode: 'ask' } },
      },
      {
        id: 'p1',
        caption: 'Two tools, written first',
        prompt:
          '① Factor theorem: f(a) = 0 ⟺ (x−a) is a factor. ② x + 3 = x − (−3) → substitute x = −3. Formula before algebra.',
        viz: { type: 'cubicFacLab', props: { mode: 'laws' } },
      },
      {
        id: 'p2',
        caption: 'Write the condition out',
        prompt:
          'f(x) = x³+4x²+kx−12. (x+3) is a factor → f(−3) = 0 — the golden line.',
        viz: { type: 'cubicFacLab', props: { mode: 'name' } },
      },
      {
        id: 'p3',
        caption: 'Substitute x = −3',
        prompt:
          '(−3)³ + 4(−3)² + k(−3) − 12 = 0. Powers first: −27, +36, −3k, −12.',
        viz: { type: 'cubicFacLab', props: { mode: 'sub' } },
      },
      {
        id: 'p4',
        caption: 'Merge the numbers',
        prompt: '−27 + 36 = 9, then 9 − 12 = −3. What is left: −3 − 3k = 0.',
        viz: { type: 'cubicFacLab', props: { mode: 'calc' } },
      },
      {
        id: 'p5',
        caption: 'Your turn — finish it',
        prompt: '−3 − 3k = 0. Tap what k equals.',
        gate: 'interact',
        viz: { type: 'cubicFacLab', props: { mode: 'gate' } },
      },
      {
        id: 'p6',
        caption: 'k = −1',
        prompt: '−3k = 3, so k = 3 ÷ (−3) = −1. That is option B.',
        viz: { type: 'cubicFacLab', props: { mode: 'answer' } },
      },
      {
        id: 'p7',
        caption: 'Shortcut — synthetic division',
        prompt:
          'Bring down, multiply by −3, add: remainder = −3 − 3k = 0 → k = −1. Same answer, another angle.',
        viz: { type: 'cubicFacLab', props: { mode: 'synth' } },
      },
      {
        id: 'p8',
        caption: 'Check — sub back x = −3',
        prompt:
          'With k = −1: f(−3) = −27 + 36 + 3 − 12 = 0 ✓. Factor theorem confirmed.',
        viz: { type: 'cubicFacLab', props: { mode: 'verify' } },
      },
      {
        id: 'p9',
        caption: 'Why A, C, D fall',
        prompt:
          'A: (−3)² taken as −36. C: sign lost when moving −3k. D: (−3)³ taken as +27. Signs are everything.',
        viz: { type: 'cubicFacLab', props: { mode: 'check' } },
      },
      {
        id: 'p10',
        caption: 'Step-by-step solution guide',
        prompt:
          'Full thinking path: spot divisible → ① f(−3) = 0 → substitute −27+36−3k−12 = 0 → merge: k = −1 → B. Shortcut: synthetic division.',
        viz: { type: 'cubicFacLab', props: { mode: 'guide' } },
      },
    ],
  },
]
