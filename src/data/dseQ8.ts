import type { Lesson } from './types'

/** 2022 DSE MATH CP Paper 1 Q8 — congruent triangles inside quadrilateral BCDE. */
export const dseQ8Lessons: Lesson[] = [
  {
    id: 'dse-q8',
    title: '2022 DSE Q8: hidden congruent triangles',
    subtitle: 'Parallel lines → AAS → a 63° angle',
    lab: true,
    beats: [
      {
        id: 'g0',
        caption: 'A point inside BCDE',
        prompt:
          'AC ∥ ED and AD ∥ BC. Given ∠ABC = ∠AED and AB = AE. Prove △ABC ≅ △AED, then find ∠ACD.',
        viz: { type: 'congruenceLab', props: { mode: 'ask' } },
      },
      {
        id: 'g1',
        caption: 'Two parallel pairs, one equal side',
        prompt:
          'Parallel lines are an angle factory. AB = AE is a ready-made matching side.',
        viz: { type: 'congruenceLab', props: { mode: 'parallels' } },
      },
      {
        id: 'g2',
        caption: 'Your turn — tap two equal angles',
        prompt: 'Alt. ∠s live in Z-shapes. Tap the pair that must be equal.',
        gate: 'interact',
        viz: { type: 'congruenceLab', props: { mode: 'challenge' } },
      },
      {
        id: 'g3',
        caption: 'Z #1: ∠ACB = ∠DAC = θ',
        prompt: 'Trace B → C → A → D. The two throat angles of the Z are equal.',
        viz: { type: 'congruenceLab', props: { mode: 'z1' } },
      },
      {
        id: 'g4',
        caption: 'Z #2: ∠ADE is θ too',
        prompt:
          'Trace E → D → A → C. All three angles equal the same middle angle.',
        viz: { type: 'congruenceLab', props: { mode: 'z2' } },
      },
      {
        id: 'g5',
        caption: 'AAS — the triangles are congruent',
        prompt:
          'Two pairs of angles + one pair of matching sides: △ABC ≅ △AED.',
        viz: { type: 'congruenceLab', props: { mode: 'proof' } },
      },
      {
        id: 'g6',
        caption: 'Now the numbers go in',
        prompt:
          '∠ABC = 39° and ∠DAE = 87°. Congruence copies 87° onto ∠BAC. Angle sum → ∠ACB = 54°.',
        viz: { type: 'congruenceLab', props: { mode: 'numbers' } },
      },
      {
        id: 'g7',
        caption: 'The hidden gift: AC = AD',
        prompt:
          'Matching sides of congruent triangles. △ACD is isosceles — base angles are equal.',
        viz: { type: 'congruenceLab', props: { mode: 'iso' } },
      },
      {
        id: 'g8',
        caption: 'Halve it: ∠ACD = 63°',
        prompt:
          '∠DAC = ∠ACB = 54° (alt. ∠s again). Each base angle: (180° − 54°) ÷ 2.',
        viz: { type: 'congruenceLab', props: { mode: 'final' } },
      },
      {
        id: 'g9',
        caption: 'Check: 63° + 117° = 180°',
        prompt:
          'AC ∥ ED with transversal CD — co-interior angles must fill a straight line. ✓',
        viz: { type: 'congruenceLab', props: { mode: 'check' } },
      },
    ],
  },
]
