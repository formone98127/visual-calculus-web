import type { Lesson } from './types'

export const lessons: Lesson[] = [
  {
    id: 'a-formulas',
    title: 'Derivatives of Sine, Cosine, and Tangent',
    subtitle: 'Unit circle → the three formulas',
    beats: [
      {
        id: 'a0',
        caption: 'We’ll find the derivatives of sine, cosine, and tangent — starting from the unit circle.',
        viz: { type: 'unitCircle', props: { showAxes: true, showCircle: false, pointCount: 0 } },
      },
      {
        id: 'a1',
        caption: 'Draw the unit circle: every point satisfies x² + y² = 1.',
        viz: { type: 'unitCircle', props: { showAxes: true, showCircle: true, pointCount: 0 } },
      },
      {
        id: 'a2',
        caption: 'At angle 0, the point is (1, 0) — that is (cos 0, sin 0).',
        math: String.raw`(1,0)=(\cos 0,\sin 0)`,
        viz: {
          type: 'unitCircle',
          props: { showAxes: true, showCircle: true, pointCount: 1, showLabels: true },
        },
      },
      {
        id: 'a3',
        caption: 'Mark the familiar angles in the first quadrant.',
        math: String.raw`\tfrac{\pi}{6},\;\tfrac{\pi}{4},\;\tfrac{\pi}{3},\;\tfrac{\pi}{2}`,
        viz: {
          type: 'unitCircle',
          props: { showAxes: true, showCircle: true, pointCount: 5, showLabels: true },
        },
      },
      {
        id: 'a4',
        caption: 'On the unit circle: the x-coordinate is cosine, the y-coordinate is sine.',
        math: String.raw`x=\cos\theta,\quad y=\sin\theta`,
        highlights: ['cos', 'sin'],
        viz: {
          type: 'unitCircle',
          props: {
            showAxes: true,
            showCircle: true,
            pointCount: 5,
            showLabels: true,
            emphasize: 'both',
          },
        },
      },
      {
        id: 'a5',
        caption: 'Derivative of sine: the rate of change of sine is cosine.',
        math: String.raw`\dfrac{d}{dx}(\sin x)=\cos x`,
        highlights: ['sin', 'cos'],
        viz: { type: 'none' },
      },
      {
        id: 'a6',
        caption: 'Derivative of cosine: the rate of change of cosine is negative sine.',
        math: String.raw`\dfrac{d}{dx}(\cos x)=-\sin x`,
        highlights: ['cos', 'sin'],
        viz: { type: 'none' },
      },
      {
        id: 'a7',
        caption: 'Derivative of tangent: it grows like secant squared.',
        math: String.raw`\dfrac{d}{dx}(\tan x)=\sec^{2} x`,
        viz: { type: 'none' },
      },
      {
        id: 'a8',
        caption:
          'Intuition: sine’s slope is the cosine height; cosine’s slope is the negative sine height.',
        math: String.raw`\sin'=\cos,\quad \cos'=-\sin,\quad \tan'=\sec^{2}`,
        highlights: ['sin', 'cos'],
        viz: { type: 'none' },
      },
    ],
  },
  {
    id: 'b-sum',
    title: 'Derivative of a Sum',
    subtitle: 'f(x) = 3 sin x + 2 cos x',
    beats: [
      {
        id: 'b0',
        caption: 'Start with the original function.',
        math: String.raw`f(x)=3\sin x+2\cos x`,
        highlights: ['sin', 'cos'],
      },
      {
        id: 'b1',
        caption: 'Differentiate term by term using the constant-multiple and sum rules.',
        math: String.raw`f'(x)=3\dfrac{d}{dx}(\sin x)+2\dfrac{d}{dx}(\cos x)`,
        highlights: ['sin', 'cos', 'op'],
      },
      {
        id: 'b2',
        caption: 'Replace each derivative with its trig formula.',
        math: String.raw`f'(x)=3\cos x+2(-\sin x)`,
        highlights: ['sin', 'cos'],
      },
      {
        id: 'b3',
        caption: 'Simplify.',
        math: String.raw`f'(x)=3\cos x-2\sin x`,
        highlights: ['sin', 'cos'],
      },
    ],
  },
  {
    id: 'c-product',
    title: 'Derivative of a Product',
    subtitle: 'd/dx (cos x · sin x)',
    beats: [
      {
        id: 'c0',
        caption: 'Begin with the product of cosine and sine.',
        math: String.raw`\dfrac{d}{dx}(\cos x\cdot\sin x)`,
        highlights: ['sin', 'cos', 'op'],
      },
      {
        id: 'c1',
        caption: 'Apply the product rule: (uv)′ = u′v + uv′.',
        math: String.raw`=\Bigl[\dfrac{d}{dx}\cos x\Bigr]\sin x+\Bigl[\dfrac{d}{dx}\sin x\Bigr]\cos x`,
        highlights: ['sin', 'cos', 'op'],
      },
      {
        id: 'c2',
        caption: 'Insert cos′ = −sin and sin′ = cos.',
        math: String.raw`=(-\sin x)(\sin x)+(\cos x)(\cos x)`,
        highlights: ['sin', 'cos'],
      },
      {
        id: 'c3',
        caption: 'Simplify.',
        math: String.raw`=-\sin^{2}x+\cos^{2}x`,
        highlights: ['sin', 'cos'],
      },
    ],
  },
  {
    id: 'd-algebraic',
    title: 'Algebraic × Trigonometric',
    subtitle: 'f(x) = x² sin x',
    beats: [
      {
        id: 'd0',
        caption: 'Start with the original function.',
        math: String.raw`f(x)=x^{2}\sin x`,
        highlights: ['sin'],
      },
      {
        id: 'd1',
        caption: 'Product rule with u = x² and v = sin x.',
        math: String.raw`f'(x)=(2x)\sin x+(\cos x)\cdot x^{2}`,
        highlights: ['sin', 'cos'],
      },
      {
        id: 'd2',
        caption: 'Rewrite in standard order.',
        math: String.raw`f'(x)=2x\sin x+x^{2}\cos x`,
        highlights: ['sin', 'cos'],
      },
    ],
  },
  {
    id: 'e-quotient',
    title: 'Derivative of a Quotient',
    subtitle: 'f(x) = (1 + cos x) / sin x',
    beats: [
      {
        id: 'e0',
        caption: 'Original function — numerator 1 + cos x, denominator sin x.',
        math: String.raw`f(x)=\dfrac{1+\cos x}{\sin x}`,
        highlights: ['sin', 'cos'],
      },
      {
        id: 'e1',
        caption: 'Apply the quotient rule.',
        math: String.raw`f'(x)=\dfrac{(-\sin x)\sin x-(\cos x)(1+\cos x)}{(\sin x)^{2}}`,
        highlights: ['sin', 'cos'],
      },
      {
        id: 'e2',
        caption: 'Expand the numerator.',
        math: String.raw`=\dfrac{-\sin^{2}x-\cos x-\cos^{2}x}{\sin^{2}x}`,
        highlights: ['sin', 'cos'],
      },
      {
        id: 'e3',
        caption: 'Group −sin²x and −cos²x, then use sin²x + cos²x = 1.',
        math: String.raw`=\dfrac{-(\sin^{2}x+\cos^{2}x)-\cos x}{\sin^{2}x}`,
        highlights: ['sin', 'cos', 'op'],
      },
      {
        id: 'e4',
        caption: 'Replace the identity with 1.',
        math: String.raw`f'(x)=\dfrac{-1-\cos x}{\sin^{2}x}`,
        highlights: ['sin', 'cos'],
      },
    ],
  },
  {
    id: 'f-tangent',
    title: 'Tangent at a Point',
    subtitle: "f(x) = tan x — find f'(π/4)",
    beats: [
      {
        id: 'f0',
        caption: 'Recall the derivative of tangent.',
        math: String.raw`f(x)=\tan x,\quad f'(x)=\sec^{2}x`,
      },
      {
        id: 'f1',
        caption: 'Evaluate at x = π/4.',
        math: String.raw`f'\bigl(\tfrac{\pi}{4}\bigr)=\sec^{2}\bigl(\tfrac{\pi}{4}\bigr)`,
      },
      {
        id: 'f2',
        caption: 'sec(π/4) = 1 / cos(π/4) = √2.',
        math: String.raw`=\bigl(\sqrt{2}\bigr)^{2}=2`,
      },
      {
        id: 'f3',
        caption: 'Done — the slope of tan x at π/4 is 2.',
        math: String.raw`f'\bigl(\tfrac{\pi}{4}\bigr)=2`,
      },
    ],
  },
]
