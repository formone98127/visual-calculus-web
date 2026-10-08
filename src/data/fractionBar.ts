import type { Lesson } from './types'

/** Bar model: 1/2 + 1/4 = 3/4. */
export const fractionBarLessons: Lesson[] = [
  {
    id: 'fraction-bar',
    title: 'Can a half and a quarter share a bar?',
    subtitle: 'Slide them on — discover 3/4',
    lab: true,
    beats: [
      {
        id: 'b0',
        caption: 'A whole bar',
        prompt: 'This bar is 1. How much is shaded if we add pieces?',
        viz: { type: 'fractionBarLab', props: { mode: 'ask' } },
      },
      {
        id: 'b1',
        caption: 'A half',
        prompt: 'Half the bar is one of two equal pieces.',
        viz: { type: 'fractionBarLab', props: { mode: 'half' } },
      },
      {
        id: 'b2',
        caption: 'A quarter waiting',
        prompt: 'A quarter is one of four equal pieces. It wants to sit on the bar.',
        viz: { type: 'fractionBarLab', props: { mode: 'quarter' } },
      },
      {
        id: 'b3',
        caption: 'Slide it on',
        prompt: 'Your turn — park the quarter next to the half.',
        gate: 'interact',
        viz: { type: 'fractionBarLab', props: { mode: 'challenge' } },
      },
      {
        id: 'b4',
        caption: 'Three quarters!',
        prompt: 'Half plus a quarter fills three of the four slots.',
        viz: { type: 'fractionBarLab', props: { mode: 'fitted' } },
      },
      {
        id: 'b5',
        caption: 'Always 3/4',
        prompt: 'Same bar: 2/4 + 1/4 = 3/4. The pieces just add.',
        viz: { type: 'fractionBarLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
