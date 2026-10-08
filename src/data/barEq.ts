import type { Lesson } from './types'

/** Bar model: 3x + 2 = 11 → x = 3. */
export const barEqLessons: Lesson[] = [
  {
    id: 'bar-eq',
    title: 'Three matching bars plus 2 make 11. How long is one?',
    subtitle: 'Peel the 2 — discover x = 3',
    lab: true,
    beats: [
      {
        id: 'e0',
        caption: 'A bar of 11',
        prompt: 'The whole bar is 11. It is made of three matching pieces and two extras.',
        viz: { type: 'barEqLab', props: { mode: 'ask' } },
      },
      {
        id: 'e1',
        caption: '3 unknowns + 2',
        prompt: 'Three equal x-pieces, then two 1s.',
        viz: { type: 'barEqLab', props: { mode: 'parts' } },
      },
      {
        id: 'e2',
        caption: 'Peel the 2',
        prompt: 'Your turn — take the two extras off. Split what is left into three.',
        gate: 'interact',
        viz: { type: 'barEqLab', props: { mode: 'challenge' } },
      },
      {
        id: 'e3',
        caption: 'Each is 3',
        prompt: '11 − 2 = 9. Three matching pieces: each is 3.',
        viz: { type: 'barEqLab', props: { mode: 'fitted' } },
      },
      {
        id: 'e4',
        caption: 'Always x = 3',
        prompt: '3x + 2 = 11 means each x is 3.',
        viz: { type: 'barEqLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
