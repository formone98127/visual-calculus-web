import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 1 Q17 — circle tangent to the x-axis: equation from the tangent, then the mid-point of a chord cut by y = −x + k, in terms of k. One slide, one message. */
export const dse2012P1Q17Lessons: Lesson[] = [
  {
    id: 'dse-2012-p1-q17',
    title: '2012 DSE Paper 1 Q17: circle & tangent line',
    subtitle: 'tangent → r = 10 → equation; substitute the line → quadratic → mid-point in k',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The question — the circle and the tangent',
        viz: { type: 'circleLineLab', props: { mode: 'figure' } },
      },
      {
        id: 'p1',
        caption: 'The question, in our own words',
        viz: { type: 'circleLineLab', props: { mode: 'question' } },
      },
      {
        id: 'p2',
        caption: 'Given 1 · the centre — C is at (6, 10)',
        viz: { type: 'circleLineLab', props: { mode: 'givenC' } },
      },
      {
        id: 'p3',
        caption: 'Given 2 · the tangent — x-axis touches C, so r = 10',
        viz: { type: 'circleLineLab', props: { mode: 'givenTan' } },
      },
      {
        id: 'p3a',
        caption: 'Given 3 · the line — slope −1, y-intercept k',
        viz: { type: 'circleLineLab', props: { mode: 'givenL' } },
      },
      {
        id: 'p3b',
        caption: 'Given 4 · the cut — L meets C at A and B',
        viz: { type: 'circleLineLab', props: { mode: 'givenAB' } },
      },
      {
        id: 'p4',
        caption: 'What is asked — (a) the equation of C',
        viz: { type: 'circleLineLab', props: { mode: 'whatA' } },
      },
      {
        id: 'p5',
        caption: 'What is asked — (b) mid-point of AB in terms of k',
        viz: { type: 'circleLineLab', props: { mode: 'whatB' } },
      },
      {
        id: 'p6',
        caption: 'Why r = 10 — tangent distance',
        viz: { type: 'circleLineLab', props: { mode: 'whyEq' } },
      },
      {
        id: 'p7',
        caption: '(b) step 1 — L: y = −x + k, substitute',
        viz: { type: 'circleLineLab', props: { mode: 'sub' } },
      },
      {
        id: 'p8',
        caption: '(b) step 2 — sum of the roots',
        viz: { type: 'circleLineLab', props: { mode: 'roots' } },
      },
      {
        id: 'p9',
        caption: '(b) step 3 — back to x',
        viz: { type: 'circleLineLab', props: { mode: 'midx' } },
      },
      {
        id: 'p10',
        caption: 'Your turn — which is the mid-point?',
        gate: 'interact',
        viz: { type: 'circleLineLab', props: { mode: 'gate' } },
      },
      {
        id: 'p11',
        caption: 'The slick way — centre ⊥ chord bisects',
        viz: { type: 'circleLineLab', props: { mode: 'slick' } },
      },
      {
        id: 'p12',
        caption: '(a)(b) together — equation · mid-point',
        viz: { type: 'circleLineLab', props: { mode: 'answer' } },
      },
      {
        id: 'p13',
        caption: 'Check with k = 6',
        viz: { type: 'circleLineLab', props: { mode: 'verify' } },
      },
      {
        id: 'p14',
        caption: 'The method, five lines',
        viz: { type: 'circleLineLab', props: { mode: 'guide' } },
      },
    ],
  },
]
