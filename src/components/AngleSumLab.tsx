import { useEffect, useMemo, useRef, useState } from 'react'
import type { AngleSumLabMode, AngleSumLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

type Pt = { x: number; y: number }

type TriKind = 'acute' | 'right' | 'obtuse'

type Corner = {
  id: 'A' | 'B' | 'C'
  color: string
  deg: number
  home: Pt
  dir0: Pt
  dir1: Pt
}

type WedgePose = {
  apex: Pt
  a0: number
  a1: number
  r: number
}

const R_TRI = 38
const R_LINE = 54
const LINE_APEX: Pt = { x: 190, y: 268 }

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

function sub(a: Pt, b: Pt): Pt {
  return { x: a.x - b.x, y: a.y - b.y }
}
function add(a: Pt, b: Pt): Pt {
  return { x: a.x + b.x, y: a.y + b.y }
}
function scale(a: Pt, s: number): Pt {
  return { x: a.x * s, y: a.y * s }
}
function len(a: Pt) {
  return Math.hypot(a.x, a.y) || 1
}
function norm(a: Pt): Pt {
  const L = len(a)
  return { x: a.x / L, y: a.y / L }
}
function ang(a: Pt) {
  return Math.atan2(a.y, a.x)
}
function poly(pts: Pt[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(' ')
}
function clamp01(t: number) {
  return Math.max(0, Math.min(1, t))
}
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }
}
function lerpAngle(a: number, b: number, t: number) {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * t
}

function orderedSpan(d0: Pt, d1: Pt) {
  let a0 = ang(d0)
  let a1 = ang(d1)
  let delta = a1 - a0
  while (delta <= -Math.PI) delta += Math.PI * 2
  while (delta > Math.PI) delta -= Math.PI * 2
  if (delta < 0) {
    const tmp = a0
    a0 = a1
    a1 = tmp
    delta = -delta
  }
  return { a0, a1, delta }
}

function wedgePathFromAngles(apex: Pt, a0: number, a1: number, r: number) {
  let delta = a1 - a0
  while (delta <= -Math.PI) delta += Math.PI * 2
  while (delta > Math.PI) delta -= Math.PI * 2
  let start = a0
  let end = a1
  if (delta < 0) {
    start = a1
    end = a0
    delta = -delta
  }
  const p0 = {
    x: apex.x + Math.cos(start) * r,
    y: apex.y + Math.sin(start) * r,
  }
  const p1 = {
    x: apex.x + Math.cos(end) * r,
    y: apex.y + Math.sin(end) * r,
  }
  const large = delta > Math.PI ? 1 : 0
  return `M ${apex.x} ${apex.y} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`
}

function midFromAngles(a0: number, a1: number) {
  let delta = a1 - a0
  while (delta <= -Math.PI) delta += Math.PI * 2
  while (delta > Math.PI) delta -= Math.PI * 2
  if (delta < 0) {
    const tmp = a0
    a0 = a1
    a1 = tmp
    delta = -delta
  }
  const m = a0 + delta / 2
  return { x: Math.cos(m), y: Math.sin(m) }
}

function triangleVerts(
  kind: TriKind,
  box: { x: number; y: number; w: number; h: number },
) {
  const degs: [number, number, number] =
    kind === 'acute'
      ? [50, 60, 70]
      : kind === 'right'
        ? [90, 40, 50]
        : [120, 30, 30]

  const [degA, degB, degC] = degs
  const c = 1
  const A0: Pt = { x: 0, y: 0 }
  const B0: Pt = { x: c, y: 0 }
  const radA = (degA * Math.PI) / 180
  const radB = (degB * Math.PI) / 180
  const radC = (degC * Math.PI) / 180
  const bLen = (c * Math.sin(radB)) / Math.sin(radC)
  const C0: Pt = {
    x: A0.x + bLen * Math.cos(radA),
    y: A0.y + bLen * Math.sin(radA),
  }

  const raw = [A0, B0, C0]
  const xs = raw.map((p) => p.x)
  const ys = raw.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const w = maxX - minX || 1
  const h = maxY - minY || 1
  const pad = 28
  const boxW = box.w - pad * 2
  const boxH = box.h - pad * 2
  const s = Math.min(boxW / w, boxH / h)
  const ox = box.x + pad + (boxW - w * s) / 2 - minX * s
  const oy = box.y + pad + (boxH - h * s) / 2 + maxY * s

  const map = (p: Pt): Pt => ({ x: ox + p.x * s, y: oy - p.y * s })
  return { A: map(A0), B: map(B0), C: map(C0), degs }
}

function cornerAt(
  id: 'A' | 'B' | 'C',
  apex: Pt,
  p0: Pt,
  p1: Pt,
  deg: number,
  color: string,
): Corner {
  return {
    id,
    color,
    deg,
    home: apex,
    dir0: norm(sub(p0, apex)),
    dir1: norm(sub(p1, apex)),
  }
}

function homePose(c: Corner): WedgePose {
  const { a0, a1 } = orderedSpan(c.dir0, c.dir1)
  return { apex: c.home, a0, a1, r: R_TRI }
}

function fitPoses(corners: Corner[]): WedgePose[] {
  let cursor = Math.PI
  return corners.map((c) => {
    const rad = (c.deg * Math.PI) / 180
    const a0 = cursor
    const a1 = cursor + rad
    cursor = a1
    return { apex: LINE_APEX, a0, a1, r: R_LINE }
  })
}

function mixPose(a: WedgePose, b: WedgePose, t: number): WedgePose {
  return {
    apex: lerpPt(a.apex, b.apex, t),
    a0: lerpAngle(a.a0, b.a0, t),
    a1: lerpAngle(a.a1, b.a1, t),
    r: lerp(a.r, b.r, t),
  }
}

function modeFlags(mode: AngleSumLabMode) {
  return {
    ask: mode === 'ask',
    showTri: mode !== 'ask',
    showLineStage: mode !== 'ask',
    autoFly:
      mode === 'acute' ||
      mode === 'right' ||
      mode === 'obtuse' ||
      mode === 'fitted' ||
      mode === 'generalize',
    challenge: mode === 'challenge',
    fittedBeat: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

function kindForMode(mode: AngleSumLabMode): TriKind {
  if (mode === 'right') return 'right'
  if (mode === 'obtuse') return 'obtuse'
  return 'acute'
}

export function AngleSumLab({ mode, onInteractComplete }: AngleSumLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const doneRef = useRef(false)
  const flyRaf = useRef(0)
  const triRaf = useRef(0)

  const kind = kindForMode(
    mode === 'challenge' ||
      mode === 'fitted' ||
      mode === 'generalize' ||
      mode === 'ask'
      ? 'acute'
      : mode,
  )

  const target = useMemo(
    () => triangleVerts(kind, { x: 0, y: 8, w: 380, h: 168 }),
    [kind],
  )

  const [disp, setDisp] = useState(target)
  const [fly, setFly] = useState<[number, number, number]>([0, 0, 0])
  const [flying, setFlying] = useState(false)
  const [landed, setLanded] = useState(false)

  // Morph triangle when kind changes
  useEffect(() => {
    cancelAnimationFrame(triRaf.current)
    const from = disp
    const to = target
    const start = performance.now()
    const dur = 520
    const tick = (now: number) => {
      const u = easeInOut(clamp01((now - start) / dur))
      setDisp({
        A: lerpPt(from.A, to.A, u),
        B: lerpPt(from.B, to.B, u),
        C: lerpPt(from.C, to.C, u),
        degs: to.degs,
      })
      if (u < 1) triRaf.current = requestAnimationFrame(tick)
    }
    triRaf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(triRaf.current)
    // only re-morph on kind/target change — intentionally omit disp
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, target])

  const corners = useMemo(() => {
    const { A, B, C, degs } = disp
    const [dA, dB, dC] = degs
    return [
      cornerAt('A', A, B, C, dA, '#ff6b7a'),
      cornerAt('B', B, A, C, dB, '#4cc9f0'),
      cornerAt('C', C, A, B, dC, '#b8f27c'),
    ]
  }, [disp])

  const homes = useMemo(() => corners.map(homePose), [corners])
  const fits = useMemo(() => fitPoses(corners), [corners])

  const runFly = (opts?: { instant?: boolean; thenComplete?: boolean }) => {
    cancelAnimationFrame(flyRaf.current)
    if (opts?.instant) {
      setFly([1, 1, 1])
      setLanded(true)
      setFlying(false)
      return
    }
    setFlying(true)
    setLanded(false)
    setFly([0, 0, 0])
    const start = performance.now()
    const dur = 880
    const stagger = 160
    const tick = (now: number) => {
      const next: [number, number, number] = [0, 0, 0]
      let allDone = true
      for (let i = 0; i < 3; i++) {
        const u = easeOutCubic(clamp01((now - start - i * stagger) / dur))
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

  // Mode choreography
  useEffect(() => {
    cancelAnimationFrame(flyRaf.current)
    doneRef.current = false

    if (flags.ask) {
      setFly([0, 0, 0])
      setLanded(false)
      setFlying(false)
      return
    }

    if (flags.challenge) {
      setFly([0, 0, 0])
      setLanded(false)
      setFlying(false)
      return
    }

    if (flags.fittedBeat) {
      // Arrive already mid-flight feel: short settle from partial
      setFly([0.35, 0.35, 0.35])
      const id = window.setTimeout(() => runFly({ instant: false }), 40)
      return () => {
        clearTimeout(id)
        cancelAnimationFrame(flyRaf.current)
      }
    }

    if (flags.autoFly) {
      setFly([0, 0, 0])
      setLanded(false)
      // Hold on corners, then tear to the line
      const id = window.setTimeout(() => runFly(), 420)
      return () => {
        clearTimeout(id)
        cancelAnimationFrame(flyRaf.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, kind])

  useEffect(() => () => cancelAnimationFrame(flyRaf.current), [])

  const runAutoFit = () => {
    if (flying || landed) return
    runFly({ thenComplete: true })
  }

  const sum = disp.degs[0] + disp.degs[1] + disp.degs[2]
  const anyOnLine = fly.some((v) => v > 0.02)
  const allLanded = landed || fly.every((v) => v > 0.995)
  const showEq = allLanded && !flags.ask

  return (
    <div
      className={`angle-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      {flags.ask && <p className="lab-hook">{t.angleHookAsk}</p>}

      <svg
        className="angle-svg"
        viewBox="0 0 380 360"
        role="img"
        aria-label="Triangle angles form a straight line"
      >
        {flags.showTri && (
          <g className={`angle-tri-group ${anyOnLine ? 'dim' : ''}`}>
            <polygon
              className="angle-tri"
              points={poly([disp.A, disp.B, disp.C])}
            />
            <polygon
              className="tri-outline"
              points={poly([disp.A, disp.B, disp.C])}
              fill="none"
            />
            {/* Ghost corners left behind while wedges fly */}
            {corners.map((c, i) => {
              const g = fly[i]
              if (g < 0.04 || g > 0.98) return null
              const { a0, a1 } = orderedSpan(c.dir0, c.dir1)
              return (
                <path
                  key={`ghost-${c.id}`}
                  className="wedge-ghost"
                  d={wedgePathFromAngles(c.home, a0, a1, R_TRI)}
                  style={{ fill: c.color, opacity: 0.28 * (1 - g) }}
                />
              )
            })}
            <text x={disp.A.x - 12} y={disp.A.y + 18} className="vert-label">
              A
            </text>
            <text x={disp.B.x + 6} y={disp.B.y + 18} className="vert-label">
              B
            </text>
            <text x={disp.C.x - 4} y={disp.C.y - 8} className="vert-label">
              C
            </text>
          </g>
        )}

        {flags.showLineStage && (
          <g className="angle-line-stage">
            <line
              className={`angle-baseline ${anyOnLine ? 'hot' : 'waiting'}`}
              x1={48}
              y1={LINE_APEX.y}
              x2={332}
              y2={LINE_APEX.y}
            />
            <line
              className={`angle-cap ${anyOnLine ? 'hot' : ''}`}
              x1={48}
              y1={LINE_APEX.y - 10}
              x2={48}
              y2={LINE_APEX.y + 10}
            />
            <line
              className={`angle-cap ${anyOnLine ? 'hot' : ''}`}
              x1={332}
              y1={LINE_APEX.y - 10}
              x2={332}
              y2={LINE_APEX.y + 10}
            />

            {/* Flying wedges */}
            {corners.map((c, i) => {
              const pose = mixPose(homes[i], fits[i], fly[i])
              const md = midFromAngles(pose.a0, pose.a1)
              const label = add(pose.apex, scale(md, pose.r * 0.52))
              const lift = Math.sin(fly[i] * Math.PI) * 18 // arc lift mid-flight
              return (
                <g
                  key={`fly-${c.id}`}
                  className={`angle-wedge flying kind-${c.id}`}
                  style={{
                    opacity: flags.showTri || fly[i] > 0 ? 1 : 0,
                  }}
                >
                  <path
                    d={wedgePathFromAngles(
                      { x: pose.apex.x, y: pose.apex.y - lift },
                      pose.a0,
                      pose.a1,
                      pose.r,
                    )}
                    className="wedge-fill"
                    style={{ fill: c.color }}
                  />
                  <text
                    x={label.x}
                    y={label.y - lift + 4}
                    className="wedge-label"
                    textAnchor="middle"
                  >
                    {flags.generalize && fly[i] > 0.85
                      ? `∠${c.id}`
                      : `${c.deg}°`}
                  </text>
                </g>
              )
            })}

            <line
              className={`straight-ray ${allLanded ? 'show' : ''}`}
              x1={LINE_APEX.x - R_LINE - 8}
              y1={LINE_APEX.y}
              x2={LINE_APEX.x + R_LINE + 8}
              y2={LINE_APEX.y}
            />

            <text
              x={190}
              y={LINE_APEX.y + 36}
              className={`line-caption ${allLanded ? 'show' : ''}`}
              textAnchor="middle"
            >
              {flags.generalize
                ? t.angleStraightLabel
                : `${sum}° = ${t.angleStraightLabel}`}
            </text>

            {flags.challenge && !anyOnLine && (
              <text
                x={190}
                y={LINE_APEX.y + 28}
                className="line-hint"
                textAnchor="middle"
              >
                {t.angleLineHint}
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
          {t.angleAutoFit}
        </button>
      )}

      <p className={`angle-eq ${showEq ? 'show' : ''}`}>
        {flags.generalize ? (
          <>
            <span className="a">∠A</span>
            <span className="op">+</span>
            <span className="b">∠B</span>
            <span className="op">+</span>
            <span className="c">∠C</span>
            <span className="op">=</span>
            <span className="sum">180°</span>
          </>
        ) : (
          <>
            <span className="a">{disp.degs[0]}°</span>
            <span className="op">+</span>
            <span className="b">{disp.degs[1]}°</span>
            <span className="op">+</span>
            <span className="c">{disp.degs[2]}°</span>
            <span className="op">=</span>
            <span className="sum">180°</span>
          </>
        )}
      </p>
    </div>
  )
}
