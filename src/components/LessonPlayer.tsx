import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Lesson } from '../data/types'
import { nextLessonId } from '../data/catalog'
import type { PythagorasProps, UnitCircleProps } from '../data/types'
import { MathBlock } from './MathBlock'
import { PythagorasFigure } from './PythagorasFigure'
import { UnitCircle } from './UnitCircle'

type Props = {
  lesson: Lesson
}

export function LessonPlayer({ lesson }: Props) {
  const [i, setI] = useState(0)
  const touchY = useRef<number | null>(null)
  const wheelLock = useRef(false)
  const done = i >= lesson.beats.length
  const beat = done ? null : lesson.beats[i]
  const nextId = nextLessonId(lesson.id)

  const go = useCallback(
    (delta: number) => {
      setI((cur) => {
        const next = cur + delta
        if (next < 0) return 0
        if (next > lesson.beats.length) return lesson.beats.length
        return next
      })
    },
    [lesson.beats.length],
  )

  useEffect(() => {
    setI(0)
  }, [lesson.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const onWheel = (e: React.WheelEvent) => {
    if (wheelLock.current) return
    if (Math.abs(e.deltaY) < 8) return
    wheelLock.current = true
    go(e.deltaY > 0 ? 1 : -1)
    window.setTimeout(() => {
      wheelLock.current = false
    }, 420)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current == null) return
    const dy = touchY.current - e.changedTouches[0].clientY
    touchY.current = null
    if (Math.abs(dy) < 40) return
    go(dy > 0 ? 1 : -1)
  }

  return (
    <div
      className="player"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <header className="player-header">
        <Link to="/" className="back">
          ← All lessons
        </Link>
        <div className="player-titles">
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </div>
        <div className="step-count">
          {done ? 'Done' : `${i + 1} / ${lesson.beats.length}`}
        </div>
      </header>

      <div className="progress">
        {lesson.beats.map((b, idx) => (
          <button
            key={b.id}
            type="button"
            className={`dot ${idx === i ? 'active' : ''} ${idx < i || done ? 'passed' : ''}`}
            aria-label={`Step ${idx + 1}`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>

      <main className="stage" onClick={() => !done && go(1)}>
        {done ? (
          <div className="complete">
            <h2>Got it</h2>
            <p>You’ve walked every step of this concept.</p>
            <div className="complete-actions">
              <button type="button" onClick={() => setI(0)}>
                Replay
              </button>
              {nextId ? (
                <Link className="primary" to={`/lesson/${nextId}`}>
                  Next lesson →
                </Link>
              ) : (
                <Link className="primary" to="/">
                  Back to catalog
                </Link>
              )}
            </div>
          </div>
        ) : (
          beat && (
            <div className="beat" key={beat.id}>
              <p className="caption">{beat.caption}</p>
              {beat.math && (
                <MathBlock tex={beat.math} highlights={beat.highlights} />
              )}
              {beat.viz?.type === 'unitCircle' && (
                <UnitCircle {...((beat.viz.props ?? {}) as UnitCircleProps)} />
              )}
              {beat.viz?.type === 'pythagoras' && (
                <PythagorasFigure
                  {...((beat.viz.props ?? {}) as PythagorasProps)}
                />
              )}
            </div>
          )
        )}
      </main>

      <footer className="hint">
        {done
          ? 'Lesson complete'
          : 'Swipe up · scroll · ↓ / Space — next step'}
      </footer>
    </div>
  )
}
