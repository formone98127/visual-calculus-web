import type { Lesson } from './types'

/** Two identical right triangles fill a square. */
export const squareTriLessons: Lesson[] = [
  {
    id: 'square-tri',
    title: 'Can two triangles make a square?',
    subtitle: 'Flip one — discover a²',
    lab: true,
    beats: [
      {
        id: 't0',
        caption: 'One right triangle',
        prompt: 'Two equal legs. Could two of these fill a square?',
        viz: { type: 'squareTriLab', props: { mode: 'ask' } },
      },
      {
        id: 't1',
        caption: 'Legs a and a',
        prompt: 'The two short sides are the same length. That will matter.',
        viz: { type: 'squareTriLab', props: { mode: 'one' } },
      },
      {
        id: 't2',
        caption: 'A twin',
        prompt: 'Here is a second copy. The dashed square is waiting.',
        viz: { type: 'squareTriLab', props: { mode: 'two' } },
      },
      {
        id: 't3',
        caption: 'Flip it in',
        prompt: 'Your turn — turn the red triangle into the empty half.',
        gate: 'interact',
        viz: { type: 'squareTriLab', props: { mode: 'challenge' } },
      },
      {
        id: 't4',
        caption: 'A square!',
        prompt: 'Two copies, no gaps, no leftovers. That is a square.',
        viz: { type: 'squareTriLab', props: { mode: 'fitted' } },
      },
      {
        id: 't5',
        caption: 'Always a²',
        prompt: 'Each triangle is half the square. Together they are a².',
        viz: { type: 'squareTriLab', props: { mode: 'generalize' } },
      },
    ],
  },
]
