import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 2 Q5 — chained equality → simultaneous linear equations. One slide, one message. */
export const dse2012Q5Lessons: Lesson[] = [
  {
    id: 'dse-2012-q5',
    title: '2012 DSE Q5: simultaneous equations',
    subtitle: 'split the chain — kill m with ×2 — n falls out',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The question',
        viz: { type: 'simEqLab', props: { mode: 'ask' } },
      },
      {
        id: 'p1',
        caption: 'Why simultaneous equations',
        viz: { type: 'simEqLab', props: { mode: 'why' } },
      },
      {
        id: 'p2',
        caption: 'Split ① — m + 2n = 1',
        viz: { type: 'simEqLab', props: { mode: 'split1' } },
      },
      {
        id: 'p3',
        caption: 'Split ② — 2m − n = 7',
        viz: { type: 'simEqLab', props: { mode: 'split2' } },
      },
      {
        id: 'p4',
        caption: 'Scale ① by 2',
        viz: { type: 'simEqLab', props: { mode: 'elim' } },
      },
      {
        id: 'p5',
        caption: 'Subtract — m cancels',
        viz: { type: 'simEqLab', props: { mode: 'elim2' } },
      },
      {
        id: 'p6',
        caption: 'Your turn — finish it',
        gate: 'interact',
        viz: { type: 'simEqLab', props: { mode: 'gate' } },
      },
      {
        id: 'p7',
        caption: 'n = −1',
        viz: { type: 'simEqLab', props: { mode: 'answer' } },
      },
      {
        id: 'p8',
        caption: 'Check in ①',
        viz: { type: 'simEqLab', props: { mode: 'verify1' } },
      },
      {
        id: 'p9',
        caption: 'Check in ②',
        viz: { type: 'simEqLab', props: { mode: 'verify2' } },
      },
      {
        id: 'p10',
        caption: 'The crossing is the answer',
        viz: { type: 'simEqLab', props: { mode: 'graph' } },
      },
      {
        id: 'p11',
        caption: 'Why A (−4) is wrong',
        viz: { type: 'simEqLab', props: { mode: 'trapA' } },
      },
      {
        id: 'p12',
        caption: 'Why C (3) is wrong',
        viz: { type: 'simEqLab', props: { mode: 'trapC' } },
      },
      {
        id: 'p13',
        caption: 'Why D (11) is wrong',
        viz: { type: 'simEqLab', props: { mode: 'trapD' } },
      },
      {
        id: 'p14',
        caption: 'The whole method, one line per step',
        viz: { type: 'simEqLab', props: { mode: 'guide' } },
      },
    ],
  },
]
