import type { Lesson } from './types'

/** Flagship — circle area = πr² by unrolling concentric rings. */
export const circleAreaLessons: Lesson[] = [
  {
    id: 'circle-area',
    title: 'How much paint covers a circle?',
    subtitle: 'Unroll the rings — discover πr²',
    lab: true,
    beats: [
      {
        id: 'k0',
        caption: 'A circle',
        prompt: 'A circle has a radius r. How much area is inside?',
        viz: { type: 'circleAreaLab', props: { mode: 'ask' } },
      },
      {
        id: 'k1',
        caption: 'Onion rings',
        prompt: 'Slice it into thin rings. Each ring is a strip waiting to unroll.',
        viz: { type: 'circleAreaLab', props: { mode: 'rings' } },
      },
      {
        id: 'k2',
        caption: 'The outer ring',
        prompt: 'The longest ring is the rim — length 2πr, the circumference.',
        viz: { type: 'circleAreaLab', props: { mode: 'circumference' } },
      },
      {
        id: 'k3',
        caption: 'Unroll them',
        prompt: 'Your turn — peel the rings into a stack. What shape appears?',
        gate: 'interact',
        viz: { type: 'circleAreaLab', props: { mode: 'challenge' } },
      },
      {
        id: 'k4',
        caption: 'A triangle!',
        prompt: 'Base 2πr, height r. That triangle is the paint that covered the circle.',
        viz: { type: 'circleAreaLab', props: { mode: 'fitted' } },
      },
      {
        id: 'k5',
        caption: 'Always πr²',
        prompt: 'Half × 2πr × r is πr². The triangle is half that rectangle.',
        viz: { type: 'circleAreaLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
