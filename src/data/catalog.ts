import type { Lesson, Topic } from './types'
import { angleSumLessons } from './angleSum'
import { pythagorasLessons } from './pythagoras'
import { lessons as trigLessons } from './trigDerivatives'

export const heroLessonIds = ['p-squares', 'a-angle-sum'] as const
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
    ],
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
