import { useEffect, useMemo, useRef, useState } from 'react'
import type { CircleAreaLabMode, CircleAreaLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

type Pt = { x: number; y: number }

const N = 8
const K = 36
const R = 58
const CX = 200
const CY = 86
const BASE_Y = 220
const VB_DISK = '50 8 300 190'
const VB_FULL = '0 8 400 270'

const RING_COLORS = [
  '#b8f27c',
  '#7ee0c2',
  '#4cc9f0',
  '#6aa8f5',
  '#c89cf0',
  '#ff8aa0',
  '#ff6b7a',
  '#ffd166',
]

{
  const base = 2 * Math.PI * R
  const areaTri = 0.5 * base * R
  const areaDisk = Math.PI * R * R
  if (Math.abs(areaTri - areaDisk) >= 1e-6) {
    throw new Error('unrolled triangle ≠ πr²')
  }
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
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function poly(pts: Pt[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(' ')
}

function phis() {
  return Array.from({ length: K + 1 }, (_, k) => -Math.PI + (2 * Math.PI * k) / K)
}

/** Cut at the top; bottom of the circle maps to the middle of the unrolled strip. */
function homeRing(r0: number, r1: number): Pt[] {
  const ps = phis()
  const outer = ps.map((phi) => {
    const th = phi + Math.PI / 2
    return { x: CX + r1 * Math.cos(th), y: CY + r1 * Math.sin(th) }
  })
  const inner = [...ps].reverse().map((phi) => {
    const th = phi + Math.PI / 2
    return { x: CX + r0 * Math.cos(th), y: CY + r0 * Math.sin(th) }
  })
  return [...outer, ...inner]
}

function fitRing(r0: number, r1: number): Pt[] {
  const ps = phis()
  const y1 = BASE_Y - R + r1
  const y0 = BASE_Y - R + r0
  const outer = ps.map((phi) => ({ x: CX + r1 * phi, y: y1 }))
  const inner = [...ps].reverse().map((phi) => ({ x: CX + r0 * phi, y: y0 }))
  return [...outer, ...inner]
}

function mixPoly(a: Pt[], b: Pt[], t: number, lift: number): Pt[] {
  return a.map((p, i) => ({
    x: lerp(p.x, b[i].x, t),
    y: lerp(p.y, b[i].y, t) - lift,
  }))
}

function modeFlags(mode: CircleAreaLabMode) {
  return {
    ask: mode === 'ask',
    showRings: mode !== 'ask',
    showCirc: mode === 'circumference',
    showUnroll:
      mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    autoFly: mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    fittedBeat: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function CircleAreaLab({ mode, onInteractComplete }: CircleAreaLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const doneRef = useRef(false)
  const flyRaf = useRef(0)

  const rings = useMemo(() => {
    return Array.from({ length: N }, (_, i) => {
      const r0 = (i * R) / N
      const r1 = ((i + 1) * R) / N
      return {
        i,
        r0,
        r1,
        color: RING_COLORS[i],
        home: homeRing(r0, r1),
        fit: fitRing(r0, r1),
      }
    })
  }, [])

  const [fly, setFly] = useState<number[]>(() => Array(N).fill(0))
  const [flying, setFlying] = useState(false)
  const [landed, setLanded] = useState(false)

  const runFly = (opts?: { instant?: boolean; thenComplete?: boolean }) => {
    cancelAnimationFrame(flyRaf.current)
    if (opts?.instant) {
      setFly(Array(N).fill(1))
      setLanded(true)
      setFlying(false)
      return
    }
    setFlying(true)
    setLanded(false)
    setFly(Array(N).fill(0))
    const start = performance.now()
    const dur = 820
    const stagger = 140
    const tick = (now: number) => {
      const next = Array(N).fill(0)
      let allDone = true
      for (let i = 0; i < N; i++) {
        const peel = N - 1 - i
        const u = easeOutCubic(clamp01((now - start - peel * stagger) / dur))
        next[i] = u
        if (u < 1) allDone = false
      }
      setFly(next)
      if (!allDone) {
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

    if (flags.ask || flags.showCirc || (!flags.showUnroll && flags.showRings)) {
      setFly(Array(N).fill(0))
      setLanded(false)
      setFlying(false)
      return
    }

    if (flags.challenge) {
      setFly(Array(N).fill(0))
      setLanded(false)
      setFlying(false)
      return
    }

    if (flags.generalize) {
      runFly({ instant: true })
      return
    }

    if (flags.fittedBeat) {
      setFly(Array(N).fill(0.28))
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

  const anyFlying = fly.some((v) => v > 0.02)
  const allLanded = landed || fly.every((v) => v > 0.995)
  const showEq = allLanded && flags.showUnroll
  const peak: Pt = { x: CX, y: BASE_Y - R }
  const left: Pt = { x: CX - Math.PI * R, y: BASE_Y }
  const right: Pt = { x: CX + Math.PI * R, y: BASE_Y }

  return (
    <div
      className={`circle-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg
        className="circle-svg"
        viewBox={flags.showUnroll ? VB_FULL : VB_DISK}
        role="img"
        aria-label="Concentric rings unroll into a triangle of area πr²"
      >
        {flags.ask && (
          <g className="circle-ask">
            <circle className="circle-disk" cx={CX} cy={CY} r={R} />
            <line
              className="circle-radius"
              x1={CX}
              y1={CY}
              x2={CX + R}
              y2={CY}
            />
            <circle className="circle-dot" cx={CX} cy={CY} r={3} />
            <text
              x={CX + R / 2}
              y={CY - 10}
              className="circle-r-label"
              textAnchor="middle"
            >
              r
            </text>
          </g>
        )}

        {flags.showRings && (
          <g className={`circle-onion ${anyFlying ? 'dim' : ''}`}>
            {rings.map((ring) => (
              <polygon
                key={`home-${ring.i}`}
                className="ring-home"
                points={poly(ring.home)}
                style={{ fill: ring.color }}
              />
            ))}
            {flags.showCirc && (
              <>
                <circle
                  className="circle-rim"
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                />
                <text
                  x={CX}
                  y={CY + R + 22}
                  className="circle-circ-label"
                  textAnchor="middle"
                >
                  2πr
                </text>
              </>
            )}
            {!flags.showCirc && !anyFlying && !flags.showUnroll && (
              <>
                <line
                  className="circle-radius faint"
                  x1={CX}
                  y1={CY}
                  x2={CX + R}
                  y2={CY}
                />
                <text
                  x={CX + R / 2}
                  y={CY - 10}
                  className="circle-r-label"
                  textAnchor="middle"
                >
                  r
                </text>
              </>
            )}
          </g>
        )}

        {flags.showUnroll && (
          <g className="circle-unroll">
            {flags.generalize && allLanded && (
              <rect
                className="circle-rect-ghost"
                x={left.x}
                y={peak.y}
                width={2 * Math.PI * R}
                height={R}
              />
            )}

            {!allLanded && (
              <polygon
                className={`circle-tri-wait ${anyFlying ? 'hot' : 'waiting'}`}
                points={poly([peak, left, right])}
              />
            )}

            {rings.map((ring, i) => {
              const g = fly[i]
              if (g < 0.04 || g > 0.98) return null
              return (
                <polygon
                  key={`ghost-${ring.i}`}
                  className="ring-ghost"
                  points={poly(ring.home)}
                  style={{ fill: ring.color, opacity: 0.28 * (1 - g) }}
                />
              )
            })}

            {rings.map((ring, i) => {
              const g = fly[i]
              if (g < 0.01) return null
              const lift = Math.sin(g * Math.PI) * 16
              const pts = mixPoly(ring.home, ring.fit, g, lift)
              return (
                <polygon
                  key={`fly-${ring.i}`}
                  className="ring-fly"
                  points={poly(pts)}
                  style={{ fill: ring.color }}
                />
              )
            })}

            <polygon
              className={`circle-tri-gold ${allLanded ? 'show' : ''}`}
              points={poly([peak, left, right])}
            />

            <line
              className={`circle-base ${anyFlying ? 'hot' : 'waiting'}`}
              x1={left.x}
              y1={BASE_Y}
              x2={right.x}
              y2={BASE_Y}
            />
            <line
              className={`circle-cap ${anyFlying ? 'hot' : ''}`}
              x1={left.x}
              y1={BASE_Y - 8}
              x2={left.x}
              y2={BASE_Y + 8}
            />
            <line
              className={`circle-cap ${anyFlying ? 'hot' : ''}`}
              x1={right.x}
              y1={BASE_Y - 8}
              x2={right.x}
              y2={BASE_Y + 8}
            />

            {allLanded && (
              <>
                <line
                  className="circle-height"
                  x1={CX}
                  y1={peak.y}
                  x2={CX}
                  y2={BASE_Y}
                />
                <text
                  x={CX + 14}
                  y={(peak.y + BASE_Y) / 2 + 4}
                  className="circle-h-label"
                >
                  r
                </text>
                <text
                  x={CX}
                  y={BASE_Y + 22}
                  className="circle-base-label"
                  textAnchor="middle"
                >
                  2πr
                </text>
              </>
            )}

            {flags.challenge && !anyFlying && (
              <text
                x={CX}
                y={BASE_Y + 24}
                className="line-hint"
                textAnchor="middle"
              >
                {t.circleBaseHint}
              </text>
            )}
          </g>
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
          {t.circleAutoFit}
        </button>
      )}

      {showEq && (
        <p className="circle-eq show">
          {flags.generalize ? (
            <>
              <span className="a">A</span>
              <span className="op">=</span>
              <span className="b">π</span>
              <span className="c">r²</span>
            </>
          ) : (
            <>
              <span className="op">½</span>
              <span className="op">×</span>
              <span className="a">2πr</span>
              <span className="op">×</span>
              <span className="b">r</span>
              <span className="op">=</span>
              <span className="sum">πr²</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
