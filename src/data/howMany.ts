import type { Lesson } from './types'

/** How many quarters fit in a half? 1/2 ÷ 1/4 = 2. */
export const howManyLessons: Lesson[] = [
  {
    id: 'how-many',
    title: 'How many quarters fit in a half?',
    subtitle: 'Park them in — discover 2',
    lab: true,
    beats: [
      {
        id: 'm0',
        caption: 'A half',
        prompt: 'This piece is 1/2. How many 1/4 pieces fill it?',
        viz: { type: 'howManyLab', props: { mode: 'ask' } },
      },
      {
        id: 'm1',
        caption: 'The half waiting',
        prompt: 'A half-bar with two empty quarter slots.',
        viz: { type: 'howManyLab', props: { mode: 'half' } },
      },
      {
        id: 'm2',
        caption: 'Two quarters ready',
        prompt: 'Each is 1/4. They want to sit inside the half.',
        viz: { type: 'howManyLab', props: { mode: 'pieces' } },
      },
      {
        id: 'm3',
        caption: 'Fit them in',
        prompt: 'Your turn — how many quarters fill the half?',
        gate: 'interact',
        viz: { type: 'howManyLab', props: { mode: 'challenge' } },
      },
      {
        id: 'm4',
        caption: 'Two fit!',
        prompt: 'Two quarters fill the half exactly. No leftover, no overlap.',
        viz: { type: 'howManyLab', props: { mode: 'fitted' } },
      },
      {
        id: 'm5',
        caption: 'Always ½ ÷ ¼ = 2',
        prompt: 'Divide means “how many of these fit into that.”',
        viz: { type: 'howManyLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
