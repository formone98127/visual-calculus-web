import { Link } from 'react-router-dom'
import { LangSwitch } from '../components/LangSwitch'
import { heroLessonId, topics } from '../data/catalog'
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

export function Catalog() {
  const { t, localizeLesson } = useI18n()

  return (
    <div className="catalog">
      <div className="catalog-top">
        <LangSwitch />
      </div>
      <header className="catalog-hero">
        <p className="brand">{t.brand}</p>
        <h1>{t.headline}</h1>
        <p className="lede">{t.lede}</p>
        <Link className="hero-cta" to={`/lesson/${heroLessonId}`}>
          {t.heroCta}
        </Link>
      </header>

      {topics.map((topic) => {
        const title =
          topic.id === 'pythagorean'
            ? t.topicTry
            : topic.id === 'practice'
              ? t.topicPractice
              : topic.title
        const blurb =
          topic.id === 'pythagorean'
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
                    className={`topic-card ${lesson.id === heroLessonId ? 'hero-card' : ''}`}
                    to={`/lesson/${lesson.id}`}
                  >
                    <div className="preview">
                      {lesson.id.startsWith('p-') ? (
                        <PythPreview />
                      ) : (
                        <TrigPreview />
                      )}
                    </div>
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
