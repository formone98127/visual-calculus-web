import type { Lesson, Topic } from './types'
import { pythagorasLessons } from './pythagoras'
import { lessons as trigLessons } from './trigDerivatives'

export const heroLessonId = 'p-squares'

export const topics: Topic[] = [
  {
    id: 'pythagorean',
    title: 'Try this',
    blurb: 'A hands-on discovery — rearrange tiles to see why a² + b² = c².',
    source: 'Inspired by Short Geometry Labs (Gardella & Delaware)',
    lessons: pythagorasLessons.filter((l) => l.id === heroLessonId),
  },
  {
    id: 'practice',
    title: 'Practice',
    blurb: 'More lessons to swipe through.',
    source: '',
    lessons: [
      ...pythagorasLessons.filter((l) => l.id !== heroLessonId),
      ...trigLessons,
    ],
  },
]

export const allLessons: Lesson[] = [
  ...pythagorasLessons,
  ...trigLessons,
]

export function getLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id)
}

export function nextLessonId(id: string): string | null {
  const order = [heroLessonId, ...allLessons.map((l) => l.id).filter((x) => x !== heroLessonId)]
  const i = order.indexOf(id)
  if (i < 0 || i >= order.length - 1) return null
  return order[i + 1]
}
