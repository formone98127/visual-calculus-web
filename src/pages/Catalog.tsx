import { Link } from 'react-router-dom'
import { lessons } from '../data/trigDerivatives'

export function Catalog() {
  return (
    <div className="catalog">
      <header className="catalog-hero">
        <p className="brand">Visual Calculus</p>
        <h1>See each step. Then swipe for the next.</h1>
        <p className="lede">
          Demo pack: derivatives of sine, cosine, and tangent — taught as
          progressive visual beats.
        </p>
      </header>

      <ol className="lesson-list">
        {lessons.map((lesson, idx) => (
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
    </div>
  )
}
