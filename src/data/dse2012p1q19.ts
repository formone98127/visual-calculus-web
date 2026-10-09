import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 1 Q19 — air cargo terminals: exponential model, GP sum, then the 20 000 000-tonne year. One slide, one message. */
export const dse2012P1Q19Lessons: Lesson[] = [
  {
    id: 'dse-2012-p1-q19',
    title: '2012 DSE Paper 1 Q19: cargo terminals',
    subtitle: 'ab²ⁿ model → divide two years → GP sums → the year 20 000 000 t is crossed',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The question — X’s cargo, year by year',
        viz: { type: 'cargoLab', props: { mode: 'figure' } },
      },
      {
        id: 'p1',
        caption: 'The question, word for word',
        viz: { type: 'cargoLab', props: { mode: 'question' } },
      },
      {
        id: 'p2',
        caption: 'Sentence 1 · terminal X handles A(n) tonnes in year n',
        viz: { type: 'cargoLab', props: { mode: 's1' } },
      },
      {
        id: 'p3',
        caption: 'Sentence 2 · the model ab²ⁿ — each year ×b²',
        viz: { type: 'cargoLab', props: { mode: 's2' } },
      },
      {
        id: 'p4',
        caption: 'Sentence 3 · year 1: 254 100 t · year 2: 307 461 t',
        viz: { type: 'cargoLab', props: { mode: 's3' } },
      },
      {
        id: 'p5',
        caption: 'What is asked — (a) a, b, year 4, total · (b) claim, which year',
        viz: { type: 'cargoLab', props: { mode: 'ask' } },
      },
      {
        id: 'p6',
        caption: 'Why GP — A(n+1) / A(n) = b² is constant',
        viz: { type: 'cargoLab', props: { mode: 'why' } },
      },
      {
        id: 'p7',
        caption: '(a)(i) divide — b² pops out',
        viz: { type: 'cargoLab', props: { mode: 'div' } },
      },
      {
        id: 'p8',
        caption: 'b² = 1.21 → b = 1.1',
        viz: { type: 'cargoLab', props: { mode: 'bval' } },
      },
      {
        id: 'p9',
        caption: 'Back-substitute — a = 210 000',
        viz: { type: 'cargoLab', props: { mode: 'aval' } },
      },
      {
        id: 'p10',
        caption: 'Hence — the 4th year',
        viz: { type: 'cargoLab', props: { mode: 'yr4' } },
      },
      {
        id: 'p11',
        caption: '(a)(ii) the total is a GP series',
        viz: { type: 'cargoLab', props: { mode: 'sum' } },
      },
      {
        id: 'p12',
        caption: 'GP sum formula → S(n)',
        viz: { type: 'cargoLab', props: { mode: 'sumf' } },
      },
      {
        id: 'p13',
        caption: '(b) Y starts 4 years late',
        viz: { type: 'cargoLab', props: { mode: 'partb' } },
      },
      {
        id: 'p14',
        caption: '(b)(i) the manager — Y < X in every year?',
        viz: { type: 'cargoLab', props: { mode: 'claim' } },
      },
      {
        id: 'p15',
        caption: 'Compare year by year — the ratio',
        viz: { type: 'cargoLab', props: { mode: 'cmp' } },
      },
      {
        id: 'p16',
        caption: 'The smallest case already wins',
        viz: { type: 'cargoLab', props: { mode: 'cmpmin' } },
      },
      {
        id: 'p17',
        caption: '(b)(ii) Y’s own total — another GP',
        viz: { type: 'cargoLab', props: { mode: 'by' } },
      },
      {
        id: 'p18',
        caption: 'Combined total against the 20 000 000 line',
        viz: { type: 'cargoLab', props: { mode: 'total' } },
      },
      {
        id: 'p19',
        caption: 'Your turn — which year?',
        gate: 'interact',
        viz: { type: 'cargoLab', props: { mode: 'gate' } },
      },
      {
        id: 'p20',
        caption: 'Both sides of the line',
        viz: { type: 'cargoLab', props: { mode: 'cross' } },
      },
      {
        id: 'p21',
        caption: '(a)(b) together — a · b · S(n) · agree · n = 14',
        viz: { type: 'cargoLab', props: { mode: 'answer' } },
      },
      {
        id: 'p22',
        caption: 'Check — the line sits between T(13) and T(14)',
        viz: { type: 'cargoLab', props: { mode: 'verify' } },
      },
      {
        id: 'p23',
        caption: 'The method, five lines',
        viz: { type: 'cargoLab', props: { mode: 'guide' } },
      },
    ],
  },
]
