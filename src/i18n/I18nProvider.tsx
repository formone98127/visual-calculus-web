import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lesson } from '../data/types'
import { lessonsZhHant } from './lessons-zh-Hant'
import { detectLocale, saveLocale, type Locale } from './locale'
import { ui } from './ui'

type I18nValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (typeof ui)['en']
  localizeLesson: (lesson: Lesson) => Lesson
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale())

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    saveLocale(next)
  }

  useEffect(() => {
    document.documentElement.lang = locale === 'zh-Hant' ? 'zh-Hant' : 'en'
  }, [locale])

  const value = useMemo<I18nValue>(() => {
    const localizeLesson = (lesson: Lesson): Lesson => {
      if (locale !== 'zh-Hant') return lesson
      const pack = lessonsZhHant[lesson.id]
      if (!pack) return lesson
      return {
        ...lesson,
        title: pack.title,
        subtitle: pack.subtitle,
        beats: lesson.beats.map((b) => {
          const tb = pack.beats[b.id]
          if (!tb) return b
          return {
            ...b,
            caption: tb.caption,
            prompt: tb.prompt ?? b.prompt,
          }
        }),
      }
    }

    return {
      locale,
      setLocale,
      t: ui[locale],
      localizeLesson,
    }
  }, [locale])

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
