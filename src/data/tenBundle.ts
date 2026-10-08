import type { Lesson } from './types'

/** 10 ones bundle into 1 ten. */
export const tenBundleLessons: Lesson[] = [
  {
    id: 'ten-bundle',
    title: 'Can ten little ones become one ten?',
    subtitle: 'Bundle them — discover place value',
    lab: true,
    beats: [
      {
        id: 'n0',
        caption: 'Ten little cubes',
        prompt: 'Ten ones. Can they become a single ten?',
        viz: { type: 'tenBundleLab', props: { mode: 'ask' } },
      },
      {
        id: 'n1',
        caption: 'Line them up',
        prompt: 'Ten unit cubes in a row. Still ten ones.',
        viz: { type: 'tenBundleLab', props: { mode: 'ones' } },
      },
      {
        id: 'n2',
        caption: 'A ten-rod waiting',
        prompt: 'A long ten is the same length as those ten ones.',
        viz: { type: 'tenBundleLab', props: { mode: 'ten' } },
      },
      {
        id: 'n3',
        caption: 'Bundle them',
        prompt: 'Your turn — pack the ones into the ten.',
        gate: 'interact',
        viz: { type: 'tenBundleLab', props: { mode: 'challenge' } },
      },
      {
        id: 'n4',
        caption: 'One ten!',
        prompt: 'Ten ones stacked. That is exactly one ten.',
        viz: { type: 'tenBundleLab', props: { mode: 'fitted' } },
      },
      {
        id: 'n5',
        caption: 'Always 10 ones = 1 ten',
        prompt: 'Place value is just bundling: ten of these become one of those.',
        viz: { type: 'tenBundleLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
