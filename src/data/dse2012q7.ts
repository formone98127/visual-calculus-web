import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q7 — solve both branches of an "or" inequality, then merge the rays. One slide, one message. */
export const dse2012Q7Lessons: Lesson[] = [
  {
    id: 'dse-2012-q7',
    title: '2012 DSE Q7: or-inequalities',
    subtitle: 'solve both branches — or merges them: x < 4 wins',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The question — two branches joined by or',
        viz: { type: 'ineqOrLab', props: { mode: 'ask' } },
      },
      {
        id: 'p1',
        caption: 'and vs or — what or means',
        viz: { type: 'ineqOrLab', props: { mode: 'why' } },
      },
      {
        id: 'p2',
        caption: 'Branch ① — 15 + 4x < 3',
        viz: { type: 'ineqOrLab', props: { mode: 'solve1' } },
      },
      {
        id: 'p3',
        caption: 'Branch ② — subtract 9 first',
        viz: { type: 'ineqOrLab', props: { mode: 'solve2' } },
      },
      {
        id: 'p4',
        caption: '÷ (−2) — the sign flips',
        viz: { type: 'ineqOrLab', props: { mode: 'flip' } },
      },
      {
        id: 'p5',
        caption: 'or merges the two rays',
        viz: { type: 'ineqOrLab', props: { mode: 'union' } },
      },
      {
        id: 'p6',
        caption: 'Your turn — pick the solution',
        gate: 'interact',
        viz: { type: 'ineqOrLab', props: { mode: 'gate' } },
      },
      {
        id: 'p7',
        caption: 'x < 4 → C',
        viz: { type: 'ineqOrLab', props: { mode: 'answer' } },
      },
      {
        id: 'p8',
        caption: 'Check x = 0',
        viz: { type: 'ineqOrLab', props: { mode: 'verify' } },
      },
      {
        id: 'p9',
        caption: 'The whole method, one line per step',
        viz: { type: 'ineqOrLab', props: { mode: 'guide' } },
      },
    ],
  },
]
