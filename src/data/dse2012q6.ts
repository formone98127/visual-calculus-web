import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q6 — read the signs of a and b from the graph of y = a(x+b)². One slide, one message. */
export const dse2012Q6Lessons: Lesson[] = [
  {
    id: 'dse-2012-q6',
    title: '2012 DSE Q6: parabola y = a(x + b)²',
    subtitle: 'read a from the opening — read b from the vertex at x = −b',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The figure — y = a(x + b)²',
        viz: { type: 'parabolaSignLab', props: { mode: 'ask' } },
      },
      {
        id: 'p1',
        caption: 'Two constants, two picture clues',
        viz: { type: 'parabolaSignLab', props: { mode: 'why' } },
      },
      {
        id: 'p2',
        caption: 'Clue 1 — opens down, so a < 0',
        viz: { type: 'parabolaSignLab', props: { mode: 'readA' } },
      },
      {
        id: 'p3',
        caption: 'Clue 2 — the vertex sits at x = −b',
        viz: { type: 'parabolaSignLab', props: { mode: 'readB' } },
      },
      {
        id: 'p4',
        caption: 'Flip the sign — b < 0',
        viz: { type: 'parabolaSignLab', props: { mode: 'flip' } },
      },
      {
        id: 'p5',
        caption: 'Your turn — pick the pair',
        gate: 'interact',
        viz: { type: 'parabolaSignLab', props: { mode: 'gate' } },
      },
      {
        id: 'p6',
        caption: 'a < 0 and b < 0 → D',
        viz: { type: 'parabolaSignLab', props: { mode: 'answer' } },
      },
      {
        id: 'p7',
        caption: 'Check — try a = −1, b = −2',
        viz: { type: 'parabolaSignLab', props: { mode: 'verify' } },
      },
      {
        id: 'p8',
        caption: 'The whole method, one line per step',
        viz: { type: 'parabolaSignLab', props: { mode: 'guide' } },
      },
    ],
  },
]
