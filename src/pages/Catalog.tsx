import { Link } from 'react-router-dom'
import { topics } from '../data/catalog'

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
  return (
    <div className="catalog">
      <header className="catalog-hero">
        <p className="brand">Visual Math</p>
        <h1>Math you can see.</h1>
        <p className="lede">Swipe through diagrams. Text stays out of the way.</p>
      </header>

      {topics.map((topic) => (
        <section key={topic.id} className="topic-block">
          <header className="topic-head">
            <h2>{topic.title}</h2>
            <p>{topic.blurb}</p>
          </header>
          <div className="topic-grid">
            {topic.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                className="topic-card"
                to={`/lesson/${lesson.id}`}
              >
                <div className="preview">
                  {topic.id === 'pythagorean' ? <PythPreview /> : <TrigPreview />}
                </div>
                <strong>{lesson.title}</strong>
                <em>{lesson.subtitle}</em>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
