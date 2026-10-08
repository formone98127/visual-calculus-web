import type { Lesson } from './types'

/** a² − b² slides into (a−b)(a+b). */
export const diffSquaresLessons: Lesson[] = [
  {
    id: 'diff-squares',
    title: 'Can a square with a bite become a rectangle?',
    subtitle: 'Slide the flap — discover (a−b)(a+b)',
    lab: true,
    beats: [
      {
        id: 's0',
        caption: 'A 5-square',
        prompt: 'Area 25. We will take a 2-square bite.',
        viz: { type: 'diffSquaresLab', props: { mode: 'ask' } },
      },
      {
        id: 's1',
        caption: 'A bite of 4',
        prompt: 'Cut out 2-by-2. 25 − 4 is left.',
        viz: { type: 'diffSquaresLab', props: { mode: 'hole' } },
      },
      {
        id: 's2',
        caption: 'A flap',
        prompt: 'The two columns above the hole can move.',
        viz: { type: 'diffSquaresLab', props: { mode: 'cut' } },
      },
      {
        id: 's3',
        caption: 'Slide it',
        prompt: 'Your turn — swing the flap down to make a rectangle.',
        gate: 'interact',
        viz: { type: 'diffSquaresLab', props: { mode: 'challenge' } },
      },
      {
        id: 's4',
        caption: '3 by 7',
        prompt: 'The leftover is 3 across and 7 down. Same 21 tiles.',
        viz: { type: 'diffSquaresLab', props: { mode: 'fitted' } },
      },
      {
        id: 's5',
        caption: 'Always a² − b²',
        prompt: 'The rectangle is (a−b) by (a+b).',
        viz: { type: 'diffSquaresLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
