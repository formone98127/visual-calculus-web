import { Link } from 'react-router-dom'
import { LangSwitch } from '../components/LangSwitch'
import { heroLessonId, heroLessonIds, topics } from '../data/catalog'
import { useI18n } from '../i18n/I18nProvider'

function TrigPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <polyline
        className="p-sin"
        points="10,44 30,20 50,44 70,68 90,44 110,20 130,44 150,68 170,44 190,28"
      />
      <polyline
        className="p-cos"
        points="10,28 30,44 50,68 70,44 90,20 110,44 130,68 150,44 170,20 190,44"
      />
    </svg>
  )
}

function PythPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect className="p-sq" x="18" y="48" width="36" height="36" />
      <rect className="p-sq" x="54" y="12" width="48" height="48" />
      <polygon className="p-tri" points="54,60 90,60 54,12" />
      <rect
        className="p-sq"
        x="98"
        y="28"
        width="60"
        height="60"
        transform="rotate(-37 98 60)"
      />
    </svg>
  )
}

function AnglePreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <line
        className="p-base"
        x1="30"
        y1="72"
        x2="170"
        y2="72"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.45"
      />
      <path
        d="M100,72 L40,72 A60,60 0 0 1 70,20 Z"
        fill="rgba(255,107,122,0.85)"
      />
      <path
        d="M100,72 L70,20 A60,60 0 0 1 130,20 Z"
        fill="rgba(76,201,240,0.85)"
      />
      <path
        d="M100,72 L130,20 A60,60 0 0 1 160,72 Z"
        fill="rgba(184,242,124,0.85)"
      />
    </svg>
  )
}

function previewFor(id: string) {
  if (id.startsWith('p-')) return <PythPreview />
  if (id.startsWith('a-angle')) return <AnglePreview />
  return <TrigPreview />
}

export function Catalog() {
  const { t, localizeLesson } = useI18n()
  const heroes = new Set<string>(heroLessonIds)

  return (
    <div className="catalog">
      <div className="catalog-top">
        <LangSwitch />
      </div>
      <header className="catalog-hero">
        <p className="brand">{t.brand}</p>
        <h1>{t.headline}</h1>
        <p className="lede">{t.lede}</p>
        <div className="hero-cta-row">
          <Link className="hero-cta" to={`/lesson/${heroLessonId}`}>
            {t.heroCta}
          </Link>
          <Link className="hero-cta secondary" to="/lesson/a-angle-sum">
            {t.heroCtaAngle}
          </Link>
        </div>
      </header>

      {topics.map((topic) => {
        const title =
          topic.id === 'try-this' || topic.id === 'pythagorean'
            ? t.topicTry
            : topic.id === 'practice'
              ? t.topicPractice
              : topic.title
        const blurb =
          topic.id === 'try-this' || topic.id === 'pythagorean'
            ? t.topicTryBlurb
            : topic.id === 'practice'
              ? t.topicPracticeBlurb
              : topic.blurb

        return (
          <section key={topic.id} className="topic-block">
            <header className="topic-head">
              <h2>{title}</h2>
              <p>{blurb}</p>
            </header>
            <div className="topic-grid">
              {topic.lessons.map((lesson) => {
                const L = localizeLesson(lesson)
                return (
                  <Link
                    key={lesson.id}
                    className={`topic-card ${heroes.has(lesson.id) ? 'hero-card' : ''}`}
                    to={`/lesson/${lesson.id}`}
                  >
                    <div className="preview">{previewFor(lesson.id)}</div>
                    <strong>{L.title}</strong>
                    <em>{L.subtitle}</em>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
