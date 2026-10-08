import type { Lesson } from './types'

/** Odd numbers wrap a square: 1+3+5+7 = 4². */
export const oddSquareLessons: Lesson[] = [
  {
    id: 'odd-square',
    title: 'Can odd numbers build a square?',
    subtitle: 'Wrap a layer — discover n²',
    lab: true,
    beats: [
      {
        id: 'o0',
        caption: 'One tile',
        prompt: 'One is a tiny square. What if we wrap an odd layer around it?',
        viz: { type: 'oddSquareLab', props: { mode: 'ask' } },
      },
      {
        id: 'o1',
        caption: '1 + 3 = 4',
        prompt: 'A 3-tile L wraps the 1. Now it is 2-by-2.',
        viz: { type: 'oddSquareLab', props: { mode: 'small' } },
      },
      {
        id: 'o2',
        caption: 'Then +5',
        prompt: 'The next odd number wraps again. 3-by-3. A 7-tile L is waiting.',
        viz: { type: 'oddSquareLab', props: { mode: 'next' } },
      },
      {
        id: 'o3',
        caption: 'Wrap 7',
        prompt: 'Your turn — snap the next odd layer on.',
        gate: 'interact',
        viz: { type: 'oddSquareLab', props: { mode: 'challenge' } },
      },
      {
        id: 'o4',
        caption: 'A 4-by-4 square!',
        prompt: '1 + 3 + 5 + 7 filled it. Four odds, a 4-square.',
        viz: { type: 'oddSquareLab', props: { mode: 'fitted' } },
      },
      {
        id: 'o5',
        caption: 'Always n²',
        prompt: 'Each new odd number is the next square’s border.',
        viz: { type: 'oddSquareLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
