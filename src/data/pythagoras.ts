import type { Lesson } from './types'

/** Flagship B — interactive tile lab (Short Geometry Labs pedagogy). */
export const pythagorasLessons: Lesson[] = [
  {
    id: 'p-squares',
    title: 'Do the small squares fill the big one?',
    subtitle: 'Rearrange the tiles — discover Pythagoras',
    lab: true,
    beats: [
      {
        id: 'p0',
        caption: 'Watch the squares',
        prompt: 'How do these three squares relate?',
        viz: { type: 'pythagorasLab', props: { mode: 'ask' } },
      },
      {
        id: 'p1',
        caption: 'Right triangle',
        prompt: 'Two legs meet at a right angle. The long side is the hypotenuse.',
        viz: { type: 'pythagorasLab', props: { mode: 'triangle' } },
      },
      {
        id: 'p2',
        caption: 'Square on a → 9',
        prompt: 'Build a square on leg a. Count the tiles.',
        viz: { type: 'pythagorasLab', props: { mode: 'squareA' } },
      },
      {
        id: 'p3',
        caption: 'Square on b → 16',
        prompt: 'Build a square on leg b.',
        viz: { type: 'pythagorasLab', props: { mode: 'squareB' } },
      },
      {
        id: 'p4',
        caption: 'Square on c → 25',
        prompt: 'Now the hypotenuse gets a square too. Same size tiles…',
        viz: { type: 'pythagorasLab', props: { mode: 'squareC' } },
      },
      {
        id: 'p5',
        caption: 'Fit them in',
        prompt: 'Can the red and blue tiles fill the green square?',
        gate: 'interact',
        viz: { type: 'pythagorasLab', props: { mode: 'challenge' } },
      },
      {
        id: 'p6',
        caption: 'They match!',
        prompt: 'Every tile found a home. Nothing left over.',
        math: String.raw`9+16=25`,
        viz: { type: 'pythagorasLab', props: { mode: 'fitted' } },
      },
      {
        id: 'p7',
        caption: 'Always true',
        prompt: 'For any right triangle, the same idea holds.',
        math: String.raw`a^{2}+b^{2}=c^{2}`,
        viz: { type: 'pythagorasLab', props: { mode: 'generalize' } },
      },
    ],
  },
  {
    id: 'p-check',
    title: 'Check Another Triple',
    subtitle: '5–12–13 practice',
    beats: [
      {
        id: 'c0',
        caption: '5 · 12 · 13',
        viz: {
          type: 'pythagoras',
          props: { showTriangle: true, showLabels: true, a: 5, b: 12, c: 13 },
        },
      },
      {
        id: 'c1',
        caption: 'Build squares',
        viz: {
          type: 'pythagoras',
          props: {
            showTriangle: true,
            showSquareA: true,
            showSquareB: true,
            showSquareC: true,
            showLabels: true,
            showAreas: true,
            a: 5,
            b: 12,
            c: 13,
          },
        },
      },
      {
        id: 'c2',
        caption: 'Still matches',
        math: String.raw`25+144=169`,
        viz: {
          type: 'pythagoras',
          props: {
            showTriangle: true,
            showSquareA: true,
            showSquareB: true,
            showSquareC: true,
            showLabels: true,
            showAreas: true,
            highlightEquation: true,
            a: 5,
            b: 12,
            c: 13,
          },
        },
      },
      {
        id: 'c3',
        caption: 'Same rule',
        math: String.raw`a^{2}+b^{2}=c^{2}`,
        viz: {
          type: 'pythagoras',
          props: {
            showTriangle: true,
            showSquareA: true,
            showSquareB: true,
            showSquareC: true,
            showLabels: true,
            highlightEquation: true,
            a: 5,
            b: 12,
            c: 13,
          },
        },
      },
    ],
  },
]
