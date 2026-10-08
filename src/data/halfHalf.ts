import type { Lesson } from './types'

/** Half of a half is a quarter of the square. */
export const halfHalfLessons: Lesson[] = [
  {
    id: 'half-half',
    title: 'What is half of a half?',
    subtitle: 'Lay them on — discover 1/4',
    lab: true,
    beats: [
      {
        id: 'h0',
        caption: 'A whole square',
        prompt: 'This square is 1. Shade half, then half of that. How much is left shaded twice?',
        viz: { type: 'halfHalfLab', props: { mode: 'ask' } },
      },
      {
        id: 'h1',
        caption: 'A vertical half',
        prompt: 'Half the square, left to right.',
        viz: { type: 'halfHalfLab', props: { mode: 'vert' } },
      },
      {
        id: 'h2',
        caption: 'A horizontal half waiting',
        prompt: 'Another half, top to bottom. It wants to lie on the square.',
        viz: { type: 'halfHalfLab', props: { mode: 'horiz' } },
      },
      {
        id: 'h3',
        caption: 'Lay it on',
        prompt: 'Your turn — cover with the second half. Watch the overlap.',
        gate: 'interact',
        viz: { type: 'halfHalfLab', props: { mode: 'challenge' } },
      },
      {
        id: 'h4',
        caption: 'A quarter!',
        prompt: 'Only one of four corners is in both halves. That is 1/4.',
        viz: { type: 'halfHalfLab', props: { mode: 'fitted' } },
      },
      {
        id: 'h5',
        caption: 'Always ½ × ½ = ¼',
        prompt: 'Times for fractions is “of”: half of a half is a quarter.',
        viz: { type: 'halfHalfLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
