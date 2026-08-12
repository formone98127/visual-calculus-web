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
        prompt: 'Tear the corners onto the line — they make a straight angle.',
        viz: { type: 'angleSumLab', props: { mode: 'acute' } },
      },
      {
        id: 's2',
        caption: 'One right angle',
        prompt: 'Same move on a right triangle — still a straight line.',
        viz: { type: 'angleSumLab', props: { mode: 'right' } },
      },
      {
        id: 's3',
        caption: 'One obtuse',
        prompt: 'Obtuse too — three corners always fill a straight line.',
        viz: { type: 'angleSumLab', props: { mode: 'obtuse' } },
      },
      {
        id: 's4',
        caption: 'Tear the corners',
        prompt: 'Your turn — lay the three colored corners on the straight line.',
        gate: 'interact',
        viz: { type: 'angleSumLab', props: { mode: 'challenge' } },
      },
      {
        id: 's5',
        caption: 'A straight line!',
        prompt: 'Flat outer edge = 180°. That is what the three angles add up to.',
        viz: { type: 'angleSumLab', props: { mode: 'fitted' } },
      },
      {
        id: 's6',
        caption: 'Always 180°',
        prompt: 'Any triangle: ∠A + ∠B + ∠C is always a straight line.',
        viz: { type: 'angleSumLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
