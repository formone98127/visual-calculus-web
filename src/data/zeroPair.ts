import type { Lesson } from './types'

/** +1 and −1 cancel as a zero pair. */
export const zeroPairLessons: Lesson[] = [
  {
    id: 'zero-pair',
    title: 'Do plus and minus wipe out?',
    subtitle: 'Pair them — discover zero',
    lab: true,
    beats: [
      {
        id: 'z0',
        caption: 'One plus, one minus',
        prompt: 'A +1 and a −1. What is left if they meet?',
        viz: { type: 'zeroPairLab', props: { mode: 'ask' } },
      },
      {
        id: 'z1',
        caption: 'Three pluses',
        prompt: 'Three +1 chips. That is +3.',
        viz: { type: 'zeroPairLab', props: { mode: 'positives' } },
      },
      {
        id: 'z2',
        caption: 'Now two minuses',
        prompt: 'Drop in two −1 chips. Some will find a partner.',
        viz: { type: 'zeroPairLab', props: { mode: 'mixed' } },
      },
      {
        id: 'z3',
        caption: 'Make zero pairs',
        prompt: 'Your turn — pair each minus with a plus.',
        gate: 'interact',
        viz: { type: 'zeroPairLab', props: { mode: 'challenge' } },
      },
      {
        id: 'z4',
        caption: 'One plus left',
        prompt: 'Two pairs vanished. +3 and −2 leave +1.',
        viz: { type: 'zeroPairLab', props: { mode: 'fitted' } },
      },
      {
        id: 'z5',
        caption: 'Always zero',
        prompt: 'Every +1 with a −1 makes 0. The leftovers are the answer.',
        viz: { type: 'zeroPairLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
