import type { Lesson } from './types'

/** EDB SS Math Curriculum — Learning Unit 1 "Quadratic equations in one unknown" (Explanatory Notes, Dec 2021, pp. 1–3).
 *  One storyline runs the whole unit: x² − 4x − 4 = 0 — the very example the notes use. One slide, one message. */
export const unit1QuadraticLessons: Lesson[] = [
  {
    id: 'unit1-quadratic',
    title: 'Unit 1 · Quadratic equations in one unknown',
    subtitle: 'Three tools, one discriminant, two root relations — one parabola ties them together',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The unit — look at the figure first',
        viz: { type: 'quadraticUnitLab', props: { mode: 'figure' } },
      },
      {
        id: 'p1',
        caption: 'The unit, in our own words',
        viz: { type: 'quadraticUnitLab', props: { mode: 'question' } },
      },
      {
        id: 'p2',
        caption: 'Given 1 · the standard form, a ≠ 0',
        viz: { type: 'quadraticUnitLab', props: { mode: 'given1' } },
      },
      {
        id: 'p3',
        caption: 'Given 2 · three tools to solve it',
        viz: { type: 'quadraticUnitLab', props: { mode: 'given2' } },
      },
      {
        id: 'p4',
        caption: 'Given 3 · the discriminant under the root',
        viz: { type: 'quadraticUnitLab', props: { mode: 'given3' } },
      },
      {
        id: 'p5',
        caption: 'Given 4 · roots and coefficients, two relations',
        viz: { type: 'quadraticUnitLab', props: { mode: 'given4' } },
      },
      {
        id: 'p6',
        caption: 'What is asked — solve, pick the right tool',
        viz: { type: 'quadraticUnitLab', props: { mode: 'whatA' } },
      },
      {
        id: 'p7',
        caption: 'What is asked — judge · link · extend',
        viz: { type: 'quadraticUnitLab', props: { mode: 'whatB' } },
      },
      {
        id: 'p8',
        caption: 'Why the graph — solving means x-intercepts',
        viz: { type: 'quadraticUnitLab', props: { mode: 'why' } },
      },
      {
        id: 'p9',
        caption: 'Tool 1 fits — x²−3x+2 factors',
        viz: { type: 'quadraticUnitLab', props: { mode: 'factor' } },
      },
      {
        id: 'p10',
        caption: 'Zero product — read off the roots',
        viz: { type: 'quadraticUnitLab', props: { mode: 'zeros' } },
      },
      {
        id: 'p11',
        caption: 'Tool choice — x²−4x−4 has no integer pair',
        viz: { type: 'quadraticUnitLab', props: { mode: 'strategy' } },
      },
      {
        id: 'p12',
        caption: 'Tool 2 — the quadratic formula',
        viz: { type: 'quadraticUnitLab', props: { mode: 'formula' } },
      },
      {
        id: 'p13',
        caption: 'Substitute a=1 · b=−4 · c=−4',
        viz: { type: 'quadraticUnitLab', props: { mode: 'plug' } },
      },
      {
        id: 'p14',
        caption: 'Stop at the surd — x = (4 ± √32)/2',
        viz: { type: 'quadraticUnitLab', props: { mode: 'surd' } },
      },
      {
        id: 'p15',
        caption: 'Tool 3 — read the intercepts off the graph',
        viz: { type: 'quadraticUnitLab', props: { mode: 'graphTool' } },
      },
      {
        id: 'p16',
        caption: 'Δ = 32 > 0 — two distinct real roots',
        viz: { type: 'quadraticUnitLab', props: { mode: 'disc' } },
      },
      {
        id: 'p17',
        caption: 'One slide, three fates — the Δ cases',
        viz: { type: 'quadraticUnitLab', props: { mode: 'three' } },
      },
      {
        id: 'p18',
        caption: 'Δ < 0 — "no real roots" means two nonreal roots',
        viz: { type: 'quadraticUnitLab', props: { mode: 'complex' } },
      },
      {
        id: 'p19',
        caption: 'The roots land on −b/a and c/a',
        viz: { type: 'quadraticUnitLab', props: { mode: 'roots' } },
      },
      {
        id: 'p20',
        caption: 'Your turn — pin down k',
        gate: 'interact',
        viz: { type: 'quadraticUnitLab', props: { mode: 'gate' } },
      },
      {
        id: 'p21',
        caption: 'The slick way — build the equation from the roots',
        viz: { type: 'quadraticUnitLab', props: { mode: 'slick' } },
      },
      {
        id: 'p22',
        caption: 'The unit on one page',
        viz: { type: 'quadraticUnitLab', props: { mode: 'answer' } },
      },
      {
        id: 'p23',
        caption: 'Check — slide k through 3 · 4 · 5',
        viz: { type: 'quadraticUnitLab', props: { mode: 'verify' } },
      },
      {
        id: 'p24',
        caption: 'The method, five lines',
        viz: { type: 'quadraticUnitLab', props: { mode: 'guide' } },
      },
    ],
  },
]
