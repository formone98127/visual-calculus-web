import type { Lesson } from './types'

/** Flagship — triangle angle sum = 180° (Short Geometry Labs Angle 7). */
export const angleSumLessons: Lesson[] = [
  {
    id: 'a-angle-sum',
    title: 'Do the three angles make a straight line?',
    subtitle: 'Tear the corners — discover 180°',
    lab: true,
    beats: [
      {
        id: 's0',
        caption: 'Three corners',
        prompt: 'Every triangle has three angles. What do they add up to?',
        viz: { type: 'angleSumLab', props: { mode: 'ask' } },
      },
      {
        id: 's1',
        caption: 'All acute',
        prompt: 'An acute triangle — every angle less than 90°.',
        viz: { type: 'angleSumLab', props: { mode: 'acute' } },
      },
      {
        id: 's2',
        caption: 'One right angle',
        prompt: 'A right triangle — one corner is exactly 90°.',
        viz: { type: 'angleSumLab', props: { mode: 'right' } },
      },
      {
        id: 's3',
        caption: 'One obtuse',
        prompt: 'An obtuse triangle — one corner bigger than 90°.',
        viz: { type: 'angleSumLab', props: { mode: 'obtuse' } },
      },
      {
        id: 's4',
        caption: 'Tear the corners',
        prompt: 'Can you lay the three colored corners on a straight line?',
        gate: 'interact',
        viz: { type: 'angleSumLab', props: { mode: 'challenge' } },
      },
      {
        id: 's5',
        caption: 'A straight line!',
        prompt: 'The outer edges form a flat line — that is 180°.',
        math: String.raw`50^\circ+60^\circ+70^\circ=180^\circ`,
        viz: { type: 'angleSumLab', props: { mode: 'fitted' } },
      },
      {
        id: 's6',
        caption: 'Always 180°',
        prompt: 'Acute, right, or obtuse — the three angles always sum to a straight angle.',
        math: String.raw`\angle A+\angle B+\angle C=180^\circ`,
        viz: { type: 'angleSumLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
