import type { Lesson } from './types'

/** Fibonacci squares: each new side is the two before it. */
export const fibonacciLessons: Lesson[] = [
  {
    id: 'fibonacci',
    title: 'Can squares grow by adding?',
    subtitle: 'Watch 1, 1, 2, 3, 5, 8 — discover the spiral',
    lab: true,
    beats: [
      {
        id: 'f0',
        caption: 'A tiny square',
        prompt: 'Start with 1. What square could sit next to it?',
        viz: { type: 'fibonacciLab', props: { mode: 'ask' } },
      },
      {
        id: 'f1',
        caption: '1 and 1 make 2',
        prompt: 'Two little 1s side by side. A 2-square fits along the long edge.',
        viz: { type: 'fibonacciLab', props: { mode: 'grow2' } },
      },
      {
        id: 'f2',
        caption: 'Then 3, then 5',
        prompt: 'Each new square uses the two sides just before it.',
        viz: { type: 'fibonacciLab', props: { mode: 'grow5' } },
      },
      {
        id: 'f3',
        caption: 'Grow the 8',
        prompt: 'Your turn — 3 + 5 should make the next square.',
        gate: 'interact',
        viz: { type: 'fibonacciLab', props: { mode: 'challenge' } },
      },
      {
        id: 'f4',
        caption: 'A spiral!',
        prompt: 'Quarter-circles through each square join into one growing curve.',
        viz: { type: 'fibonacciLab', props: { mode: 'fitted' } },
      },
      {
        id: 'f5',
        caption: 'Add the last two',
        prompt: 'Every new side is the two before it: 1+1=2, 2+3=5, 3+5=8…',
        viz: { type: 'fibonacciLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
