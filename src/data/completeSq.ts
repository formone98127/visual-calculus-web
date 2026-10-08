import type { Lesson } from './types'

/** Complete the square: x² + 2x + 1 = (x+1)². */
export const completeSqLessons: Lesson[] = [
  {
    id: 'complete-sq',
    title: 'Can a missing corner finish a square?',
    subtitle: 'Add the 1 — discover (x+1)²',
    lab: true,
    beats: [
      {
        id: 'c0',
        caption: 'An x²',
        prompt: 'A square of side x. We will grow it.',
        viz: { type: 'completeSqLab', props: { mode: 'ask' } },
      },
      {
        id: 'c1',
        caption: 'Two x-strips',
        prompt: 'Add an x along the right and an x along the bottom.',
        viz: { type: 'completeSqLab', props: { mode: 'arms' } },
      },
      {
        id: 'c2',
        caption: 'A hole',
        prompt: 'Almost a bigger square — one little 1 is missing.',
        viz: { type: 'completeSqLab', props: { mode: 'gap' } },
      },
      {
        id: 'c3',
        caption: 'Drop it in',
        prompt: 'Your turn — park the 1 in the corner.',
        gate: 'interact',
        viz: { type: 'completeSqLab', props: { mode: 'challenge' } },
      },
      {
        id: 'c4',
        caption: 'A bigger square!',
        prompt: 'Side is now x+1. Area is (x+1)².',
        viz: { type: 'completeSqLab', props: { mode: 'fitted' } },
      },
      {
        id: 'c5',
        caption: 'Always x² + 2x + 1',
        prompt: 'The missing corner is the “+1” that completes the square.',
        viz: { type: 'completeSqLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
