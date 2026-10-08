import type { Lesson, Topic } from './types'
import { angleSumLessons } from './angleSum'
import { arrayTurnLessons } from './arrayTurn'
import { barEqLessons } from './barEq'
import { binomLessons } from './binom'
import { circleAreaLessons } from './circleArea'
import { completeSqLessons } from './completeSq'
import { diffSquaresLessons } from './diffSquares'
import { distributeLessons } from './distribute'
import { dseQ8Lessons } from './dseQ8'
import { dse2012Q1Lessons } from './dse2012q1'
import { fibonacciLessons } from './fibonacci'
import { fractionBarLessons } from './fractionBar'
import { halfHalfLessons } from './halfHalf'
import { howManyLessons } from './howMany'
import { oddSquareLessons } from './oddSquare'
import { pythagorasLessons } from './pythagoras'
import { squareTriLessons } from './squareTri'
import { tenBundleLessons } from './tenBundle'
import { lessons as trigLessons } from './trigDerivatives'
import { zeroPairLessons } from './zeroPair'

export const heroLessonIds = [
  'p-squares',
  'a-angle-sum',
  'circle-area',
  'square-tri',
  'fibonacci',
  'zero-pair',
  'distribute',
  'fraction-bar',
  'ten-bundle',
  'array-turn',
  'odd-square',
  'half-half',
  'how-many',
  'binom-area',
  'complete-sq',
  'diff-squares',
  'bar-eq',
] as const
export const heroLessonId = heroLessonIds[0]

export const topics: Topic[] = [
  {
    id: 'try-this',
    title: 'Try this',
    blurb: 'Hands-on discovery labs.',
    source: 'Inspired by Short Geometry Labs (Gardella & Delaware)',
    lessons: [
      ...pythagorasLessons.filter((l) => l.id === 'p-squares'),
      ...angleSumLessons,
      ...circleAreaLessons,
    ],
  },
  {
    id: 'wonders',
    title: 'Number wonders',
    blurb: 'Patterns that grow, shapes that fill a square.',
    source: 'Inspired by visual number-pattern and shape-from-shape ahas',
    lessons: [...squareTriLessons, ...fibonacciLessons],
  },
  {
    id: 'visible',
    title: 'See the numbers',
    blurb: 'Plus and minus cancel. Cut a rectangle. Slide fractions on a bar.',
    source: 'Inspired by visual number representations',
    lessons: [
      ...zeroPairLessons,
      ...distributeLessons,
      ...fractionBarLessons,
      ...tenBundleLessons,
      ...arrayTurnLessons,
      ...oddSquareLessons,
      ...halfHalfLessons,
      ...howManyLessons,
    ],
  },
  {
    id: 'algebra',
    title: 'See the letters',
    blurb: 'Tiles that multiply. A missing corner that completes a square.',
    source: 'Inspired by visual algebra representations',
    lessons: [
      ...binomLessons,
      ...completeSqLessons,
      ...diffSquaresLessons,
      ...barEqLessons,
    ],
  },
  {
    id: 'exam',
    title: 'Exam proof, beat by beat',
    blurb: 'Real DSE questions — congruent triangles, index laws, one visible step at a time.',
    source: '2012-DSE-MATH-CP 2 · Q1 · 2022-DSE-MATH-CP · Paper 1 · Q8',
    lessons: [...dseQ8Lessons, ...dse2012Q1Lessons],
  },
  {
    id: 'practice',
    title: 'Practice',
    blurb: 'More lessons to swipe through.',
    source: '',
    lessons: [
      ...pythagorasLessons.filter((l) => l.id !== 'p-squares'),
      ...trigLessons,
    ],
  },
]

export const allLessons: Lesson[] = [
  ...pythagorasLessons,
  ...angleSumLessons,
  ...circleAreaLessons,
  ...squareTriLessons,
  ...fibonacciLessons,
  ...zeroPairLessons,
  ...distributeLessons,
  ...fractionBarLessons,
  ...tenBundleLessons,
  ...arrayTurnLessons,
  ...oddSquareLessons,
  ...halfHalfLessons,
  ...howManyLessons,
  ...binomLessons,
  ...completeSqLessons,
  ...diffSquaresLessons,
  ...barEqLessons,
  ...dseQ8Lessons,
  ...dse2012Q1Lessons,
  ...trigLessons,
]

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id)
}

export function nextLessonId(id: string): string | null {
  const rest = allLessons
    .map((l) => l.id)
    .filter((x) => !(heroLessonIds as readonly string[]).includes(x))
  const order = [...heroLessonIds, ...rest]
  const i = order.indexOf(id)
  if (i < 0 || i >= order.length - 1) return null
  return order[i + 1]
}
