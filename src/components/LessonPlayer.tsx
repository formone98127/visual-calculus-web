import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { nextLessonId } from '../data/catalog'
import type {
  AngleSumLabProps,
  Lesson,
  PythagorasLabProps,
  PythagorasProps,
  UnitCircleProps,
  WavesProps,
} from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { AngleSumLab } from './AngleSumLab'
import { LangSwitch } from './LangSwitch'
import { MathBlock } from './MathBlock'
import { PythagorasFigure } from './PythagorasFigure'
import { PythagorasLab } from './PythagorasLab'
import { UnitCircle } from './UnitCircle'
import { WaveGraph } from './WaveGraph'

type Props = {
  lesson: Lesson
}

export function LessonPlayer({ lesson }: Props) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const [gateOk, setGateOk] = useState(false)
  const touchY = useRef<number | null>(null)
  const wheelLock = useRef(false)
  const done = i >= lesson.beats.length
  const beat = done ? null : lesson.beats[i]
  const nextId = nextLessonId(lesson.id)
  const progress = done ? 1 : (i + 1) / lesson.beats.length
  const gated = beat?.gate === 'interact' && !gateOk

  const go = useCallback(
    (delta: number) => {
      setI((cur) => {
        const b = lesson.beats[cur]
        if (delta > 0 && b?.gate === 'interact' && !gateOk) return cur
        const next = cur + delta
        if (next < 0) return 0
        if (next > lesson.beats.length) return lesson.beats.length
        return next
      })
    },
    [lesson.beats, gateOk],
  )

  useEffect(() => {
    setI(0)
    setGateOk(false)
  }, [lesson.id])

  useEffect(() => {
    setGateOk(false)
  }, [i])

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
    }, 380)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current == null) return
    const dy = touchY.current - e.changedTouches[0].clientY
    touchY.current = null
    if (Math.abs(dy) < 36) return
    go(dy > 0 ? 1 : -1)
  }

  const vizType = beat?.viz?.type ?? 'formula'
  const showFloatMath =
    !!beat?.math &&
    vizType !== 'formula' &&
    vizType !== 'none' &&
    vizType !== 'pythagorasLab' &&
    vizType !== 'pythagoras' &&
    vizType !== 'angleSumLab'
  const isLabScene =
    !!lesson.lab &&
    (vizType === 'pythagorasLab' || vizType === 'angleSumLab')
  const pythProps = (beat?.viz?.props ?? { mode: 'ask' }) as PythagorasLabProps
  const angleProps = (beat?.viz?.props ?? { mode: 'ask' }) as AngleSumLabProps

  const onLabInteract = () => {
    setGateOk(true)
    window.setTimeout(() => {
      setI((cur) => Math.min(cur + 1, lesson.beats.length))
    }, 700)
  }

  const gotItSub =
    lesson.id === 'a-angle-sum' ? t.gotItSubAngle : t.gotItSub

  return (
    <div
      className="player"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="chrome-top">
        <Link to="/" className="back">
          ←
        </Link>
        <div className="chrome-title">{lesson.title}</div>
        <div className="chrome-right">
          <LangSwitch />
          <div className="step-count">
            {done ? '✓' : `${i + 1}/${lesson.beats.length}`}
          </div>
        </div>
      </div>

      <div className="rail">
        <div className="rail-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <main
        className={`stage ${gated ? 'gated' : ''}`}
        onClick={() => {
          if (done || gated) return
          go(1)
        }}
      >
        {done ? (
          <div className="complete">
            <div className="complete-glyph">◎</div>
            <h2>{t.gotIt}</h2>
            <p className="complete-sub">{gotItSub}</p>
            <div className="complete-actions">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setI(0)
                  setGateOk(false)
                }}
              >
                {t.replay}
              </button>
              {nextId ? (
                <Link
                  className="primary"
                  to={`/lesson/${nextId}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.next}
                </Link>
              ) : (
                <Link
                  className="primary"
                  to="/"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.catalog}
                </Link>
              )}
            </div>
          </div>
        ) : (
          beat && (
            <div className="beat-stage">
              {beat.prompt && <p className="prompt">{beat.prompt}</p>}

              <div
                className="viz-plane"
                key={isLabScene ? lesson.id : beat.id}
              >
                {vizType === 'unitCircle' && (
                  <UnitCircle
                    {...((beat.viz?.props ?? {}) as UnitCircleProps)}
                  />
                )}
                {vizType === 'pythagoras' && (
                  <PythagorasFigure
                    {...((beat.viz?.props ?? {}) as PythagorasProps)}
                  />
                )}
                {vizType === 'pythagorasLab' && (
                  <PythagorasLab
                    mode={pythProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'angleSumLab' && (
                  <AngleSumLab
                    mode={angleProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'waves' && (
                  <WaveGraph {...((beat.viz?.props ?? {}) as WavesProps)} />
                )}
                {(vizType === 'formula' || vizType === 'none') && beat.math && (
                  <MathBlock
                    tex={beat.math}
                    highlights={beat.highlights}
                    huge
                  />
                )}
                {showFloatMath && beat.math && (
                  <div className="math-float">
                    <MathBlock tex={beat.math} highlights={beat.highlights} />
                  </div>
                )}
              </div>

              <div className={`caption-chip ${gated ? 'pulse' : ''}`}>
                {gated ? t.gateChip : beat.caption}
              </div>
            </div>
          )
        )}
      </main>

      <footer className="hint">
        {gated ? t.challengeHint : t.swipeHint}
      </footer>
    </div>
  )
}
