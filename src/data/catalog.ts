import type { Lesson, Topic } from './types'
import { pythagorasLessons } from './pythagoras'
import { lessons as trigLessons } from './trigDerivatives'

export const topics: Topic[] = [
  {
    id: 'trig-derivatives',
    title: 'Derivatives of Sine, Cosine, and Tangent',
    blurb: 'Unit circle → formulas → worked examples, swipe by swipe.',
    source: 'Inspired by Teach Yourself VISUALLY Calculus',
    lessons: trigLessons,
  },
  {
    id: 'pythagorean',
    title: 'Pythagorean Theorem',
    blurb: 'Squares on the sides of a right triangle — see why a² + b² = c².',
    source: 'Inspired by Short Geometry Labs (Gardella & Delaware)',
    lessons: pythagorasLessons,
  },
]

export const allLessons: Lesson[] = topics.flatMap((t) => t.lessons)

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id)
}

export function nextLessonId(id: string): string | null {
  const i = allLessons.findIndex((l) => l.id === id)
  if (i < 0 || i >= allLessons.length - 1) return null
  return allLessons[i + 1].id
}
