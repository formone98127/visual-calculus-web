import type { Lesson } from './types'

/** (x+1)(x+2) as a rectangle of tiles. */
export const binomLessons: Lesson[] = [
  {
    id: 'binom-area',
    title: 'Can (x+1) and (x+2) make a rectangle?',
    subtitle: 'Fill it — discover x² + 3x + 2',
    lab: true,
    beats: [
      {
        id: 'i0',
        caption: 'An outline',
        prompt: 'Width x+1, height x+2. What tiles fill it?',
        viz: { type: 'binomLab', props: { mode: 'ask' } },
      },
      {
        id: 'i1',
        caption: 'An x²',
        prompt: 'The big square is x by x.',
        viz: { type: 'binomLab', props: { mode: 'x2' } },
      },
      {
        id: 'i2',
        caption: 'The strips',
        prompt: 'x-strips along two sides, and a 1-by-2 corner waiting.',
        viz: { type: 'binomLab', props: { mode: 'strips' } },
      },
      {
        id: 'i3',
        caption: 'Fill it',
        prompt: 'Your turn — slide every tile into the outline.',
        gate: 'interact',
        viz: { type: 'binomLab', props: { mode: 'challenge' } },
      },
      {
        id: 'i4',
        caption: 'It fills!',
        prompt: 'x², then 3 strips of x, then 2 little ones. Nothing extra.',
        viz: { type: 'binomLab', props: { mode: 'fitted' } },
      },
      {
        id: 'i5',
        caption: 'Always (x+1)(x+2)',
        prompt: 'The rectangle’s area is x² + 3x + 2.',
        viz: { type: 'binomLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
