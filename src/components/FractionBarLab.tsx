import { useEffect, useRef, useState } from 'react'
import type { FractionBarLabMode, FractionBarLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

const BAR_X = 40
const BAR_Y = 72
const BAR_W = 280
const BAR_H = 56
const Q_HOME_Y = 200

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 630
    g.gain.value = 0.04
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
    o.stop(ctx.currentTime + 0.36)
    window.setTimeout(() => ctx.close(), 500)
  } catch {
    /* ignore */
  }
}

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t))
}
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function modeFlags(mode: FractionBarLabMode) {
  return {
    ask: mode === 'ask',
    showHalf: mode !== 'ask',
    showQuarter:
      mode === 'quarter' ||
      mode === 'challenge' ||
      mode === 'fitted' ||
      mode === 'generalize',
    showTicks: mode !== 'ask',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function FractionBarLab({ mode, onInteractComplete }: FractionBarLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const doneRef = useRef(false)
  const flyRaf = useRef(0)
  const [fly, setFly] = useState(0)
  const [flying, setFlying] = useState(false)
  const [landed, setLanded] = useState(false)

  const runFly = (opts?: { instant?: boolean; thenComplete?: boolean }) => {
    cancelAnimationFrame(flyRaf.current)
    if (opts?.instant) {
      setFly(1)
      setLanded(true)
      setFlying(false)
      return
    }
    setFlying(true)
    setLanded(false)
    setFly(0)
    const start = performance.now()
    const dur = 860
    const tick = (now: number) => {
      const u = easeOutCubic(clamp01((now - start) / dur))
      setFly(u)
      if (u < 1) {
        flyRaf.current = requestAnimationFrame(tick)
      } else {
        setFlying(false)
        setLanded(true)
        beep()
        if (opts?.thenComplete && !doneRef.current) {
          doneRef.current = true
          window.setTimeout(() => onInteractComplete?.(), 280)
        }
      }
    }
    flyRaf.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    cancelAnimationFrame(flyRaf.current)
    doneRef.current = false
    if (flags.challenge || flags.ask || mode === 'half' || mode === 'quarter') {
      setFly(0)
      setLanded(false)
      setFlying(false)
      return
    }
    if (flags.generalize) {
      runFly({ instant: true })
      return
    }
    if (flags.autoFly) {
      setFly(0.22)
      const id = window.setTimeout(() => runFly({ instant: false }), 40)
      return () => {
        clearTimeout(id)
        cancelAnimationFrame(flyRaf.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => () => cancelAnimationFrame(flyRaf.current), [])

  const runAutoFit = () => {
    if (flying || landed) return
    runFly({ thenComplete: true })
  }

  const allLanded = landed || fly > 0.995
  const halfW = BAR_W / 2
  const qW = BAR_W / 4
  const qHomeX = BAR_X + halfW
  const qX = lerp(qHomeX, BAR_X + halfW, fly)
  const qY = lerp(Q_HOME_Y, BAR_Y, fly)
  const lift = Math.sin(fly * Math.PI) * 16

  return (
    <div
      className={`frac-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg
        className="frac-svg"
        viewBox="0 0 360 260"
        role="img"
        aria-label="A half and a quarter fill three quarters of a bar"
      >
        <rect
          className={`frac-bar ${allLanded ? 'hot' : 'waiting'}`}
          x={BAR_X}
          y={BAR_Y}
          width={BAR_W}
          height={BAR_H}
        />

        {flags.showHalf && (
          <rect
            className="frac-half"
            x={BAR_X}
            y={BAR_Y}
            width={halfW}
            height={BAR_H}
          />
        )}

        {flags.showQuarter && fly > 0.04 && fly < 0.98 && (
          <rect
            className="frac-ghost"
            x={qHomeX}
            y={Q_HOME_Y}
            width={qW}
            height={BAR_H}
            style={{ opacity: 0.28 * (1 - fly) }}
          />
        )}

        {flags.showQuarter && (
          <rect
            className="frac-quarter"
            x={qX}
            y={qY - lift}
            width={qW}
            height={BAR_H}
          />
        )}

        {flags.showTicks &&
          [0, 1, 2, 3, 4].map((i) => (
            <line
              key={`top-${i}`}
              className="frac-tick"
              x1={BAR_X + (BAR_W * i) / 4}
              y1={BAR_Y}
              x2={BAR_X + (BAR_W * i) / 4}
              y2={BAR_Y + BAR_H}
            />
          ))}

        {flags.showHalf && (
          <text
            x={BAR_X + halfW / 2}
            y={BAR_Y + BAR_H / 2 + 6}
            className="frac-n"
            textAnchor="middle"
          >
            {flags.generalize ? '2/4' : '1/2'}
          </text>
        )}
        {flags.showQuarter && (
          <text
            x={qX + qW / 2}
            y={qY - lift + BAR_H / 2 + 6}
            className="frac-n"
            textAnchor="middle"
          >
            1/4
          </text>
        )}

        {allLanded && (
          <text
            x={BAR_X + BAR_W / 2}
            y={BAR_Y - 14}
            className="frac-sum"
            textAnchor="middle"
          >
            3/4
          </text>
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={180} y={248} className="line-hint" textAnchor="middle">
            {t.fracHint}
          </text>
        )}
      </svg>

      {flags.challenge && !landed && (
        <button
          type="button"
          className="auto-fit"
          disabled={flying}
          onClick={(e) => {
            e.stopPropagation()
            runAutoFit()
          }}
        >
          {t.fracAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="frac-eq show">
          {flags.generalize ? (
            <>
              <span className="a">2/4</span>
              <span className="op">+</span>
              <span className="b">1/4</span>
              <span className="op">=</span>
              <span className="sum">3/4</span>
            </>
          ) : (
            <>
              <span className="a">1/2</span>
              <span className="op">+</span>
              <span className="b">1/4</span>
              <span className="op">=</span>
              <span className="sum">3/4</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
