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

function CirclePreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <circle
        cx="52"
        cy="44"
        r="28"
        fill="none"
        stroke="rgba(255,107,122,0.9)"
        strokeWidth="6"
      />
      <circle
        cx="52"
        cy="44"
        r="18"
        fill="none"
        stroke="rgba(76,201,240,0.9)"
        strokeWidth="6"
      />
      <circle
        cx="52"
        cy="44"
        r="8"
        fill="rgba(184,242,124,0.9)"
        stroke="none"
      />
      <polygon
        points="108,78 192,78 150,22"
        fill="rgba(255,209,102,0.28)"
        stroke="#ffd166"
        strokeWidth="1.25"
      />
    </svg>
  )
}

function SquareTriPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <polygon
        points="40,78 100,78 40,18"
        fill="rgba(76,201,240,0.9)"
      />
      <polygon
        points="100,78 100,18 40,18"
        fill="rgba(255,107,122,0.9)"
      />
      <rect
        x="40"
        y="18"
        width="60"
        height="60"
        fill="none"
        stroke="#ffd166"
        strokeWidth="1.25"
      />
    </svg>
  )
}

function FibPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="78" y="52" width="12" height="12" fill="rgba(184,242,124,0.95)" />
      <rect x="90" y="52" width="12" height="12" fill="rgba(76,201,240,0.95)" />
      <rect x="78" y="28" width="24" height="24" fill="rgba(200,156,240,0.9)" />
      <rect x="54" y="28" width="24" height="36" fill="rgba(255,107,122,0.85)" />
      <path
        d="M84,64 A12,12 0 0 1 96,52 A12,12 0 0 1 90,40 A24,24 0 0 1 66,28"
        fill="none"
        stroke="#ffd166"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ZeroPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <circle cx="58" cy="44" r="18" fill="rgba(255,107,122,0.95)" />
      <text x="58" y="50" textAnchor="middle" fill="#0b1020" fontSize="18" fontWeight="700">
        +
      </text>
      <circle cx="100" cy="44" r="18" fill="rgba(76,201,240,0.95)" />
      <text x="100" y="51" textAnchor="middle" fill="#0b1020" fontSize="18" fontWeight="700">
        −
      </text>
      <text x="148" y="50" fill="#ffd166" fontSize="18" fontWeight="700">
        = 0
      </text>
    </svg>
  )
}

function DistPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="28" y="18" width="56" height="56" fill="rgba(255,107,122,0.9)" />
      <rect x="96" y="18" width="84" height="56" fill="rgba(76,201,240,0.9)" />
      <text x="56" y="52" textAnchor="middle" fill="#0b1020" fontSize="13" fontWeight="700">
        2×4
      </text>
      <text x="138" y="52" textAnchor="middle" fill="#0b1020" fontSize="13" fontWeight="700">
        3×4
      </text>
    </svg>
  )
}

function FracPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect
        x="24"
        y="28"
        width="152"
        height="32"
        fill="none"
        stroke="rgba(232,236,255,0.4)"
        strokeWidth="1.25"
      />
      <rect x="24" y="28" width="76" height="32" fill="rgba(255,107,122,0.9)" />
      <rect x="100" y="28" width="38" height="32" fill="rgba(76,201,240,0.9)" />
      <line x1="62" y1="28" x2="62" y2="60" stroke="rgba(11,16,32,0.35)" />
      <line x1="100" y1="28" x2="100" y2="60" stroke="rgba(11,16,32,0.35)" />
      <line x1="138" y1="28" x2="138" y2="60" stroke="rgba(11,16,32,0.35)" />
    </svg>
  )
}

function TenPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="148" y="16" width="14" height="56" fill="rgba(255,209,102,0.95)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={28 + i * 16}
          y="44"
          width="12"
          height="12"
          fill="rgba(255,107,122,0.95)"
        />
      ))}
    </svg>
  )
}

function ArrayPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={48 + c * 16}
            y={20 + r * 16}
            width="14"
            height="14"
            fill="rgba(76,201,240,0.92)"
          />
        )),
      )}
    </svg>
  )
}

function OddPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="70" y="28" width="16" height="16" fill="rgba(184,242,124,0.95)" />
      <rect x="86" y="28" width="16" height="16" fill="rgba(76,201,240,0.95)" />
      <rect x="86" y="44" width="16" height="16" fill="rgba(76,201,240,0.95)" />
      <rect x="70" y="44" width="16" height="16" fill="rgba(76,201,240,0.95)" />
      <rect x="102" y="28" width="16" height="48" fill="rgba(255,107,122,0.9)" />
      <rect x="70" y="60" width="32" height="16" fill="rgba(255,107,122,0.9)" />
    </svg>
  )
}

function HHPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="70" y="14" width="30" height="60" fill="rgba(255,107,122,0.85)" />
      <rect x="70" y="14" width="60" height="30" fill="rgba(76,201,240,0.55)" />
      <rect x="70" y="14" width="30" height="30" fill="rgba(255,209,102,0.95)" />
    </svg>
  )
}

function HowPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect
        x="36"
        y="28"
        width="80"
        height="32"
        fill="none"
        stroke="#ffd166"
        strokeWidth="1.25"
      />
      <rect x="36" y="28" width="40" height="32" fill="rgba(76,201,240,0.92)" />
      <rect x="76" y="28" width="40" height="32" fill="rgba(76,201,240,0.92)" />
    </svg>
  )
}

function BinomPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="60" y="14" width="48" height="48" fill="rgba(255,107,122,0.9)" />
      <rect x="108" y="14" width="16" height="48" fill="rgba(76,201,240,0.9)" />
      <rect x="60" y="62" width="48" height="14" fill="rgba(184,242,124,0.9)" />
      <rect x="108" y="62" width="16" height="14" fill="rgba(255,209,102,0.95)" />
    </svg>
  )
}

function CSPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="64" y="16" width="44" height="44" fill="rgba(255,107,122,0.9)" />
      <rect x="108" y="16" width="16" height="44" fill="rgba(76,201,240,0.9)" />
      <rect x="64" y="60" width="44" height="16" fill="rgba(76,201,240,0.9)" />
      <rect x="108" y="60" width="16" height="16" fill="rgba(255,209,102,0.95)" />
    </svg>
  )
}

function DiffPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="48" y="16" width="40" height="56" fill="rgba(255,107,122,0.9)" />
      <rect x="48" y="72" width="56" height="8" fill="rgba(76,201,240,0.95)" />
    </svg>
  )
}

function BarEqPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <rect x="20" y="32" width="48" height="24" fill="rgba(255,107,122,0.9)" />
      <rect x="72" y="32" width="48" height="24" fill="rgba(255,107,122,0.9)" />
      <rect x="124" y="32" width="48" height="24" fill="rgba(255,107,122,0.9)" />
      <text x="100" y="72" textAnchor="middle" fill="#ffd166" fontSize="12" fontWeight="700">
        x = 3
      </text>
    </svg>
  )
}

function CongPreview() {
  return (
    <svg viewBox="0 0 200 88" aria-hidden>
      <polygon
        points="34,74 148,82 170,26 84,16"
        fill="rgba(76,201,240,0.12)"
        stroke="rgba(232,236,255,0.5)"
        strokeWidth="1.4"
      />
      <g stroke="rgba(255,107,122,0.8)" strokeWidth="1.3">
        <line x1="96" y1="56" x2="34" y2="74" />
        <line x1="96" y1="56" x2="148" y2="82" />
        <line x1="96" y1="56" x2="170" y2="26" />
        <line x1="96" y1="56" x2="84" y2="16" />
      </g>
      <circle cx="96" cy="56" r="2.4" fill="#f2f5ff" />
      <text x="62" y="26" fill="#ffd166" fontSize="15" fontWeight="700">
        ?
      </text>
    </svg>
  )
}

function previewFor(id: string) {
  if (id === 'dse-q8') return <CongPreview />
  if (id === 'circle-area') return <CirclePreview />
  if (id === 'square-tri') return <SquareTriPreview />
  if (id === 'fibonacci') return <FibPreview />
  if (id === 'zero-pair') return <ZeroPreview />
  if (id === 'distribute') return <DistPreview />
  if (id === 'fraction-bar') return <FracPreview />
  if (id === 'ten-bundle') return <TenPreview />
  if (id === 'array-turn') return <ArrayPreview />
  if (id === 'odd-square') return <OddPreview />
  if (id === 'half-half') return <HHPreview />
  if (id === 'how-many') return <HowPreview />
  if (id === 'binom-area') return <BinomPreview />
  if (id === 'complete-sq') return <CSPreview />
  if (id === 'diff-squares') return <DiffPreview />
  if (id === 'bar-eq') return <BarEqPreview />
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
          <Link className="hero-cta secondary" to="/lesson/circle-area">
            {t.heroCtaCircle}
          </Link>
        </div>
      </header>

      {topics.map((topic) => {
        const title =
          topic.id === 'try-this' || topic.id === 'pythagorean'
            ? t.topicTry
            : topic.id === 'practice'
              ? t.topicPractice
              : topic.id === 'wonders'
                ? t.topicWonders
                : topic.id === 'visible'
                  ? t.topicVisible
                  : topic.id === 'algebra'
                    ? t.topicAlgebra
                    : topic.id === 'exam'
                      ? t.topicExam
                      : topic.title
        const blurb =
          topic.id === 'try-this' || topic.id === 'pythagorean'
            ? t.topicTryBlurb
            : topic.id === 'practice'
              ? t.topicPracticeBlurb
              : topic.id === 'wonders'
                ? t.topicWondersBlurb
                : topic.id === 'visible'
                  ? t.topicVisibleBlurb
                  : topic.id === 'algebra'
                    ? t.topicAlgebraBlurb
                    : topic.id === 'exam'
                      ? t.topicExamBlurb
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
