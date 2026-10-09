import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q1 — index laws inside one fraction. */
export const dse2012Q1Lessons: Lesson[] = [
  {
    id: 'dse-2012-q1',
    title: '2012 DSE Q1: the power tower',
    subtitle: 'Name each index law, then the answer follows',
    lab: true,
    beats: [
      {
        id: 'g0',
        caption: 'The question',
        prompt:
          '(2x⁴)³ ÷ 2x⁵ = ? Paper 2 Q1 hides three index laws in one fraction.',
        viz: { type: 'indexLawLab', props: { mode: 'ask' } },
      },
      {
        id: 'g1',
        caption: 'Three formulas we will use',
        prompt:
          'Write them first: (ab)ⁿ = aⁿbⁿ · (aᵐ)ⁿ = aᵐⁿ · aᵐ÷aⁿ = aᵐ⁻ⁿ. Every step names one.',
        viz: { type: 'indexLawLab', props: { mode: 'laws' } },
      },
      {
        id: 'g2',
        caption: 'Formula ① — (ab)ⁿ = aⁿbⁿ',
        prompt:
          '(2x⁴)³ means the whole bracket, three times: (2x⁴)(2x⁴)(2x⁴). The outer 3 stamps the product.',
        viz: { type: 'indexLawLab', props: { mode: 'copies' } },
      },
      {
        id: 'g3',
        caption: 'Formula ① on the 2 → 2³ = 8',
        prompt:
          'Same law: (2 · x⁴)³ = 2³ · (x⁴)³. So 2·2·2 = 8 — never 2×3 = 6.',
        viz: { type: 'indexLawLab', props: { mode: 'coeffs' } },
      },
      {
        id: 'g4',
        caption: 'Formula ② — (aᵐ)ⁿ = aᵐⁿ',
        prompt:
          '(x⁴)³ = x^(4×3) = x¹². Same base multiplied → add: 4+4+4 = 12. Numerator done: 8x¹².',
        viz: { type: 'indexLawLab', props: { mode: 'indices' } },
      },
      {
        id: 'g5',
        caption: 'Your turn — finish with Formula ③',
        prompt: 'Top 8x¹², bottom 2x⁵. Tap the option that uses aᵐ÷aⁿ = aᵐ⁻ⁿ correctly.',
        gate: 'interact',
        viz: { type: 'indexLawLab', props: { mode: 'challenge' } },
      },
      {
        id: 'g6',
        caption: 'Coefficients: 8 ÷ 2 = 4',
        prompt: 'Numbers divide like ordinary arithmetic. Formula ③ waits for the x-powers.',
        viz: { type: 'indexLawLab', props: { mode: 'divide' } },
      },
      {
        id: 'g7',
        caption: 'Formula ③ — aᵐ÷aⁿ = aᵐ⁻ⁿ',
        prompt: 'x¹² ÷ x⁵ = x¹²⁻⁵ = x⁷. Five of the twelve x-factors cancel.',
        viz: { type: 'indexLawLab', props: { mode: 'subtract' } },
      },
      {
        id: 'g8',
        caption: '4x⁷ — option C',
        prompt:
          'Chain: ① (ab)ⁿ → ② (aᵐ)ⁿ → ③ aᵐ÷aⁿ. Result 4x⁷. That is C.',
        viz: { type: 'indexLawLab', props: { mode: 'final' } },
      },
      {
        id: 'g9',
        caption: 'Why A, B, D fall',
        prompt:
          'B used 2×3 instead of 2³. D used 4³ instead of 4×3. A mixed both traps. One law per step.',
        viz: { type: 'indexLawLab', props: { mode: 'check' } },
      },
      {
        id: 'g10',
        caption: 'Step-by-step solution guide',
        prompt:
          'Full thinking path: spot the outer power → name each formula → land on C.',
        viz: { type: 'indexLawLab', props: { mode: 'guide' } },
      },
    ],
  },
]
