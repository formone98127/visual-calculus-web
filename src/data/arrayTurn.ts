import type { Lesson } from './types'

/** Rotate a 3×4 array: 3×4 = 4×3. */
export const arrayTurnLessons: Lesson[] = [
  {
    id: 'array-turn',
    title: 'Does turning a grid change how many tiles?',
    subtitle: 'Rotate it — discover a×b = b×a',
    lab: true,
    beats: [
      {
        id: 'r0',
        caption: 'A 3-by-4 block',
        prompt: 'Twelve tiles. If we turn the whole block, do any vanish?',
        viz: { type: 'arrayTurnLab', props: { mode: 'ask' } },
      },
      {
        id: 'r1',
        caption: '3 down, 4 across',
        prompt: 'Count them: three rows, four columns.',
        viz: { type: 'arrayTurnLab', props: { mode: 'grid' } },
      },
      {
        id: 'r2',
        caption: 'Turn it',
        prompt: 'Your turn — stand the block on its side.',
        gate: 'interact',
        viz: { type: 'arrayTurnLab', props: { mode: 'challenge' } },
      },
      {
        id: 'r3',
        caption: 'Still 12',
        prompt: 'Now 4 down and 3 across. Same tiles, just turned.',
        viz: { type: 'arrayTurnLab', props: { mode: 'fitted' } },
      },
      {
        id: 'r4',
        caption: 'Always a×b = b×a',
        prompt: 'Turning swaps the sides. The count stays put.',
        viz: { type: 'arrayTurnLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
