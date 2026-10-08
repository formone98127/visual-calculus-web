import type { Lesson } from './types'

/** Split a rectangle: (2+3)×4 = 2×4 + 3×4. */
export const distributeLessons: Lesson[] = [
  {
    id: 'distribute',
    title: 'Can you cut a rectangle and keep its area?',
    subtitle: 'Split it — discover (a+b)×c',
    lab: true,
    beats: [
      {
        id: 'd0',
        caption: 'One rectangle',
        prompt: 'A 5-by-4 block. How much area is inside?',
        viz: { type: 'distributeLab', props: { mode: 'ask' } },
      },
      {
        id: 'd1',
        caption: '5 across, 4 down',
        prompt: 'Count the tiles. Five columns, four rows.',
        viz: { type: 'distributeLab', props: { mode: 'grid' } },
      },
      {
        id: 'd2',
        caption: 'A cut',
        prompt: 'Slice after two columns. Did we lose any tiles?',
        viz: { type: 'distributeLab', props: { mode: 'cut' } },
      },
      {
        id: 'd3',
        caption: 'Slide them apart',
        prompt: 'Your turn — pull the pieces apart. The tiles stay the same.',
        gate: 'interact',
        viz: { type: 'distributeLab', props: { mode: 'challenge' } },
      },
      {
        id: 'd4',
        caption: '8 and 12',
        prompt: '2×4 and 3×4. Together they are still 5×4.',
        viz: { type: 'distributeLab', props: { mode: 'fitted' } },
      },
      {
        id: 'd5',
        caption: 'Always (a+b)×c',
        prompt: 'Splitting the side splits the area — nothing extra, nothing lost.',
        viz: { type: 'distributeLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
