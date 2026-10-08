import { useEffect, useRef, useState } from 'react'
import type { SquareTriLabMode, SquareTriLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

type Pt = { x: number; y: number }

const A = 140
const S0: Pt = { x: 70, y: 220 }
const S1: Pt = { x: S0.x + A, y: S0.y }
const S2: Pt = { x: S0.x + A, y: S0.y - A }
const S3: Pt = { x: S0.x, y: S0.y - A }
const DX = 168
const H0: Pt = { x: S0.x + DX, y: S0.y }
const H1: Pt = { x: S1.x + DX, y: S1.y }
const H3: Pt = { x: S3.x + DX, y: S3.y }
const C: Pt = {
  x: (H0.x + S2.x) / 2,
  y: (H0.y + S2.y) / 2,
}

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 640
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
function poly(pts: Pt[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(' ')
}
function rot180(p: Pt, c: Pt, t: number, lift: number): Pt {
  const ang = Math.PI * t
  const dx = p.x - c.x
  const dy = p.y - c.y
  return {
    x: c.x + dx * Math.cos(ang) - dy * Math.sin(ang),
    y: c.y + dx * Math.sin(ang) + dy * Math.cos(ang) - lift,
  }
}

function modeFlags(mode: SquareTriLabMode) {
  return {
    ask: mode === 'ask',
    showOne: true,
    showTwin: mode === 'two' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    showSquare: mode !== 'ask',
    autoFly: mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    generalize: mode === 'generalize',
  }
}

export function SquareTriLab({ mode, onInteractComplete }: SquareTriLabProps) {
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
    const dur = 920
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
    if (flags.challenge || flags.ask || mode === 'one' || mode === 'two') {
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

  const lift = Math.sin(fly * Math.PI) * 18
  const moving = [
    rot180(H0, C, fly, lift),
    rot180(H1, C, fly, lift),
    rot180(H3, C, fly, lift),
  ]
  const allLanded = landed || fly > 0.995
  const showEq = allLanded && (flags.autoFly || flags.challenge)

  return (
    <div
      className={`square-tri-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg
        className="square-tri-svg"
        viewBox="0 0 420 280"
        role="img"
        aria-label="Two right triangles fill a square"
      >
        {flags.showSquare && (
          <rect
            className={`square-wait ${allLanded ? 'hot' : 'waiting'}`}
            x={S0.x}
            y={S3.y}
            width={A}
            height={A}
          />
        )}

        {flags.showOne && (
          <polygon
            className={`tri-home ${fly > 0.04 ? 'dim' : ''}`}
            points={poly([S0, S1, S3])}
          />
        )}

        {flags.showTwin && fly > 0.04 && fly < 0.98 && (
          <polygon
            className="tri-ghost"
            points={poly([H0, H1, H3])}
            style={{ opacity: 0.28 * (1 - fly) }}
          />
        )}

        {flags.showTwin && (
          <polygon className="tri-fly" points={poly(moving)} />
        )}

        <polygon
          className={`square-gold ${allLanded ? 'show' : ''}`}
          points={poly([S0, S1, S2, S3])}
        />

        {flags.showOne && fly < 0.2 && (
          <>
            <text
              x={(S0.x + S1.x) / 2}
              y={S0.y + 22}
              className="st-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'a' : 'a'}
            </text>
            <text
              x={S0.x - 16}
              y={(S0.y + S3.y) / 2 + 4}
              className="st-label"
              textAnchor="middle"
            >
              a
            </text>
          </>
        )}

        {allLanded && (
          <text
            x={(S0.x + S1.x) / 2}
            y={S0.y + 24}
            className="st-base-label"
            textAnchor="middle"
          >
            a
          </text>
        )}

        {flags.challenge && fly < 0.02 && (
          <text
            x={C.x}
            y={S0.y + 36}
            className="line-hint"
            textAnchor="middle"
          >
            {t.squareTriHint}
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
          {t.squareTriAutoFit}
        </button>
      )}

      {showEq && (
        <p className="square-tri-eq show">
          {flags.generalize ? (
            <>
              <span className="a">2</span>
              <span className="op">×</span>
              <span className="b">½ a²</span>
              <span className="op">=</span>
              <span className="sum">a²</span>
            </>
          ) : (
            <>
              <span className="a">two triangles</span>
              <span className="op">=</span>
              <span className="sum">one square</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
