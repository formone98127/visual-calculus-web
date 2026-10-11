import { useEffect, useState } from 'react'
import type { MouseEventHandler } from 'react'

/** true at phone width — labs swap in HTML question / MCQ blocks below the SVG. */
export function useNarrow(query = '(max-width: 520px)') {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return narrow
}

/** The question text as real, wrappable HTML — only rendered at phone width. */
export function QuestionCard({ a, b }: { a: string; b: string }) {
  // keep grouped digits (254 100 · 20 000 000) on one line
  const glue = (s: string) => s.replace(/(\d) (?=\d{3}\b)/g, '$1\u00A0')
  return (
    <div className="q-card">
      <p className="q-given">{glue(a)}</p>
      <p className="q-ask">{glue(b)}</p>
    </div>
  )
}

export type McqOption = { id: string; val: string }

type McqCardsProps = {
  options: McqOption[]
  answer: string
  solved: boolean
  wrongId: string | null
  onPick: (id: string) => void
  /** shown under the cards: solved line / wrong-why / hint */
  feedback: string
  tone: 'ok' | 'bad' | 'muted'
}

/** Full-width stacked A–D cards for phone width; answer logic stays in the lab. */
export function McqCards({ options, answer, solved, wrongId, onPick, feedback, tone }: McqCardsProps) {
  const pick: MouseEventHandler = (e) => {
    e.stopPropagation()
    const id = (e.currentTarget as HTMLElement).dataset.id
    if (id) onPick(id)
  }
  return (
    <div className="mcq-wrap">
      <div className="mcq-cards" role="group" aria-label="multiple choice">
        {options.map((o) => {
          const isAns = o.id === answer
          const cls = solved
            ? isAns
              ? 'mcq-card solved'
              : 'mcq-card dim'
            : wrongId === o.id
              ? 'mcq-card is-wrong'
              : 'mcq-card'
          return (
            <button key={o.id} type="button" className={cls} data-id={o.id} onClick={pick} disabled={solved}>
              <span className="key">{o.id}</span>
              <span className="val">{o.val}</span>
              {solved && isAns && <span className="tick">✓</span>}
            </button>
          )
        })}
      </div>
      <p className={`mcq-feedback ${tone}`}>{feedback}</p>
    </div>
  )
}
