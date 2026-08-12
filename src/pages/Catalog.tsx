import { Link } from 'react-router-dom'
import { topics } from '../data/catalog'

export function Catalog() {
  return (
    <div className="catalog">
      <header className="catalog-hero">
        <p className="brand">Visual Math</p>
        <h1>See each step. Then swipe for the next.</h1>
        <p className="lede">
          Demo topics: trig derivatives and the Pythagorean theorem — taught as
          progressive visual beats.
        </p>
      </header>

      {topics.map((topic) => (
        <section key={topic.id} className="topic-block">
          <header className="topic-head">
            <h2>{topic.title}</h2>
            <p>{topic.blurb}</p>
            <span className="source">{topic.source}</span>
          </header>
          <ol className="lesson-list">
            {topic.lessons.map((lesson, idx) => (
              <li key={lesson.id}>
                <Link to={`/lesson/${lesson.id}`}>
                  <span className="idx">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="meta">
                    <strong>{lesson.title}</strong>
                    <em>{lesson.subtitle}</em>
                  </span>
                  <span className="chev">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
