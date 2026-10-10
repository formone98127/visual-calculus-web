import type { Lesson } from './types'

/** 2012 DSE MATH CP Paper 1 Q18 — right pyramid cut into a model. One slide, one message. */
export const dse2012P1Q18Lessons: Lesson[] = [
  {
    id: 'dse-2012-p1-q18',
    title: '2012 DSE Paper 1 Q18: right pyramid',
    subtitle: '3-D pulled back to 2-D — sine rule, scaled heights, then the plane angle α vs β',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'The question — look at the figure first',
        viz: { type: 'pyramidLab', props: { mode: 'figure' } },
      },
      {
        id: 'p1',
        caption: 'The question, in our own words',
        viz: { type: 'pyramidLab', props: { mode: 'question' } },
      },
      {
        id: 'p2',
        caption: 'Element 1 · the solid — "right pyramid": V right above O',
        viz: { type: 'pyramidLab', props: { mode: 'why' } },
      },
      {
        id: 'p3',
        caption: 'Element 2 · the face angle — ∠VAB = 72° on face VAB',
        viz: { type: 'pyramidLab', props: { mode: 'face' } },
      },
      {
        id: 'p4',
        caption: 'Element 3 · the cut, where — P on VA, Q on VD, PQ ∥ BC',
        viz: { type: 'pyramidLab', props: { mode: 'pq' } },
      },
      {
        id: 'p5',
        caption: 'Element 3 · the cut, how deep — ∠PBA = 60° pins P',
        viz: { type: 'pyramidLab', props: { mode: 'pb' } },
      },
      {
        id: 'p6',
        caption: 'Element 4 · the slice — corner VPBCQ comes off',
        viz: { type: 'pyramidLab', props: { mode: 'ask' } },
      },
      {
        id: 'p7',
        caption: 'What is asked — (a) AP · (b) α vs β',
        viz: { type: 'pyramidLab', props: { mode: 'what' } },
      },
      {
        id: 'p8',
        caption: 'Face triangle VAB — find VA first',
        viz: { type: 'pyramidLab', props: { mode: 'va' } },
      },
      {
        id: 'p9',
        caption: 'Triangle ABP — collect the three angles',
        viz: { type: 'pyramidLab', props: { mode: 'tri' } },
      },
      {
        id: 'p10',
        caption: '(a) sine rule gives AP',
        viz: { type: 'pyramidLab', props: { mode: 'ap' } },
      },
      {
        id: 'p11',
        caption: 'Build α — drop PH ⊥ base, then HH′ ⊥ BC',
        viz: { type: 'pyramidLab', props: { mode: 'build' } },
      },
      {
        id: 'p12',
        caption: 'Right triangle VOF — find the height VO',
        viz: { type: 'pyramidLab', props: { mode: 'vo' } },
      },
      {
        id: 'p13',
        caption: 'Height scales along the edge — PH',
        viz: { type: 'pyramidLab', props: { mode: 'ph' } },
      },
      {
        id: 'p14',
        caption: 'Top view — find HH′',
        viz: { type: 'pyramidLab', props: { mode: 'hh' } },
      },
      {
        id: 'p15',
        caption: '(b)(i) tan α = PH / HH′',
        viz: { type: 'pyramidLab', props: { mode: 'alpha' } },
      },
      {
        id: 'p16',
        caption: 'β — the angle of PB with the base',
        viz: { type: 'pyramidLab', props: { mode: 'beta' } },
      },
      {
        id: 'p17',
        caption: 'Your turn — which one is greater?',
        gate: 'interact',
        viz: { type: 'pyramidLab', props: { mode: 'gate' } },
      },
      {
        id: 'p18',
        caption: 'Why α wins — same top, smaller base',
        viz: { type: 'pyramidLab', props: { mode: 'compare' } },
      },
      {
        id: 'p19',
        caption: '(a)(b) together — AP · α · β',
        viz: { type: 'pyramidLab', props: { mode: 'answer' } },
      },
      {
        id: 'p20',
        caption: 'Check — AP + VP = VA',
        viz: { type: 'pyramidLab', props: { mode: 'verify' } },
      },
      {
        id: 'p21',
        caption: 'The method, five lines',
        viz: { type: 'pyramidLab', props: { mode: 'guide' } },
      },
    ],
  },
]
