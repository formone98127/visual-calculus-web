import { useEffect, useMemo, useRef, useState } from 'react'
import type { FibonacciLabMode, FibonacciLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

type Sq = { n: number; x: number; y: number; dir: number }

const U = 18
const PAD = 28

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 620
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

/** y-up squares. dir: 0 east, 1 south, 2 west, 3 north. */
function placeFib(): Sq[] {
  return [
    { n: 1, x: 0, y: 0, dir: -1 },
    { n: 1, x: 1, y: 0, dir: 0 },
    { n: 2, x: 0, y: -2, dir: 1 },
    { n: 3, x: -3, y: -2, dir: 2 },
    { n: 5, x: -3, y: 1, dir: 3 },
    { n: 8, x: 2, y: -2, dir: 0 },
  ]
}

function modeFlags(mode: FibonacciLabMode) {
  const count =
    mode === 'ask'
      ? 1
      : mode === 'grow2'
        ? 3
        : mode === 'grow5'
          ? 5
          : 6
  return {
    ask: mode === 'ask',
    count,
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
    showSpiral: mode === 'fitted' || mode === 'generalize',
  }
}

export function FibonacciLab({ mode, onInteractComplete }: FibonacciLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const squares = useMemo(() => placeFib(), [])
  const doneRef = useRef(false)
  const flyRaf = useRef(0)
  const [fly, setFly] = useState(0)
  const [flying, setFlying] = useState(false)
  const [landed, setLanded] = useState(false)

  const minX = Math.min(...squares.map((s) => s.x))
  const maxY = Math.max(...squares.map((s) => s.y + s.n))
  const toSvg = (s: Sq) => ({
    x: PAD + (s.x - minX) * U,
    y: PAD + (maxY - (s.y + s.n)) * U,
    n: s.n * U,
    dir: s.dir,
    label: s.n,
  })
  const svgSq = squares.map(toSvg)
  const last = svgSq[5]
  const shownForBox = [
    ...svgSq.slice(0, Math.min(flags.count, 5)),
    ...(flags.count >= 6 ? [last] : []),
  ]
  const boxPad = 26
  const boxMinX = Math.min(...shownForBox.map((s) => s.x)) - boxPad
  const boxMinY = Math.min(...shownForBox.map((s) => s.y)) - boxPad
  const boxMaxX = Math.max(...shownForBox.map((s) => s.x + s.n)) + boxPad
  const boxMaxY =
    Math.max(...shownForBox.map((s) => s.y + s.n)) +
    (flags.challenge ? 36 : boxPad)
  const vb = `${boxMinX} ${boxMinY} ${boxMaxX - boxMinX} ${boxMaxY - boxMinY}`

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
    const dur = 880
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
    if (flags.challenge) {
      setFly(0)
      setLanded(false)
      setFlying(false)
      return
    }
    if (mode === 'ask' || mode === 'grow2' || mode === 'grow5') {
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
      setFly(0.2)
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
  const showEight = flags.count >= 6 && (flags.challenge || fly > 0.01 || allLanded)
  const eightReady = allLanded || fly > 0.99

  function arcFor(s: ReturnType<typeof toSvg>, i: number) {
    const r = s.n
    // Center is the inward corner so quarter-circles chain into one spiral.
    let cx = s.x
    let cy = s.y
    let a0 = 0
    if (i === 0) {
      cx = s.x
      cy = s.y + s.n
      a0 = -Math.PI / 2
    } else if (s.dir === 0) {
      cx = s.x
      cy = s.y + s.n
      a0 = -Math.PI / 2
    } else if (s.dir === 1) {
      cx = s.x
      cy = s.y
      a0 = 0
    } else if (s.dir === 2) {
      cx = s.x + s.n
      cy = s.y
      a0 = Math.PI / 2
    } else {
      cx = s.x + s.n
      cy = s.y + s.n
      a0 = Math.PI
    }
    const a1 = a0 + Math.PI / 2
    const p0 = { x: cx + r * Math.cos(a0), y: cy + r * Math.sin(a0) }
    const p1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) }
    return `M ${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`
  }

  const visible = svgSq.slice(0, Math.min(flags.count, 5))
  const colors = ['#b8f27c', '#7ee0c2', '#4cc9f0', '#c89cf0', '#ff6b7a', '#ffd166']

  return (
    <div
      className={`fib-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''}`}
    >
      <svg
        className="fib-svg"
        viewBox={vb}
        role="img"
        aria-label="Fibonacci squares grow into a spiral"
      >
        {visible.map((s, i) => (
          <g key={`sq-${i}`}>
            <rect
              className="fib-sq"
              x={s.x}
              y={s.y}
              width={s.n}
              height={s.n}
              style={{ fill: colors[i], fillOpacity: 0.88 }}
            />
            <text
              x={s.x + s.n / 2}
              y={s.y + s.n / 2 + 5}
              className="fib-n"
              textAnchor="middle"
            >
              {flags.generalize && i >= 3 ? '' : s.label}
            </text>
          </g>
        ))}

        {flags.count >= 6 && (
          <rect
            className={`fib-wait ${eightReady ? 'hot' : 'waiting'}`}
            x={last.x}
            y={last.y}
            width={last.n}
            height={last.n}
          />
        )}

        {showEight && (
          <g
            style={{
              transformOrigin: `${last.x}px ${last.y + last.n / 2}px`,
              transform: `scale(${flags.challenge && !eightReady ? Math.max(fly, 0.02) : 1})`,
            }}
          >
            <rect
              className="fib-sq fib-eight"
              x={last.x}
              y={last.y}
              width={last.n}
              height={last.n}
              style={{
                fill: colors[5],
                fillOpacity: flags.challenge && !eightReady ? 0.35 + 0.53 * fly : 0.88,
              }}
            />
            <text
              x={last.x + last.n / 2}
              y={last.y + last.n / 2 + 6}
              className="fib-n"
              textAnchor="middle"
            >
              8
            </text>
          </g>
        )}

        {flags.showSpiral && eightReady &&
          svgSq.map((s, i) => (
            <path key={`arc-${i}`} className="fib-spiral" d={arcFor(s, i)} />
          ))}

        {flags.challenge && !eightReady && (
          <text
            x={last.x + last.n / 2}
            y={last.y + last.n + 22}
            className="line-hint"
            textAnchor="middle"
          >
            {t.fibHint}
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
          {t.fibAutoFit}
        </button>
      )}

      {(allLanded || flags.generalize) && (
        <p className="fib-eq show">
          {flags.generalize ? (
            <>
              <span className="a">3</span>
              <span className="op">+</span>
              <span className="b">5</span>
              <span className="op">=</span>
              <span className="sum">8</span>
            </>
          ) : (
            <>
              <span className="a">3</span>
              <span className="op">+</span>
              <span className="b">5</span>
              <span className="op">=</span>
              <span className="sum">8</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
