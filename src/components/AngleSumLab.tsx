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

const R_TRI = 38
const R_LINE = 52

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

/** Vertices from exact interior angles (degrees at A, B, C). Fitted into a box. */
function triangleVerts(kind: TriKind, box: { x: number; y: number; w: number; h: number }) {
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

/** Ordered CCW-in-atan2 (clockwise-on-screen) wedge path. */
function wedgePath(apex: Pt, d0: Pt, d1: Pt, r: number) {
  let a0 = ang(d0)
  let a1 = ang(d1)
  let delta = a1 - a0
  while (delta <= -Math.PI) delta += Math.PI * 2
  while (delta > Math.PI) delta -= Math.PI * 2
  if (delta < 0) {
    const t = a0
    a0 = a1
    a1 = t
    delta = -delta
  }
  const p0 = {
    x: apex.x + Math.cos(a0) * r,
    y: apex.y + Math.sin(a0) * r,
  }
  const p1 = {
    x: apex.x + Math.cos(a1) * r,
    y: apex.y + Math.sin(a1) * r,
  }
  const large = delta > Math.PI ? 1 : 0
  return `M ${apex.x} ${apex.y} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`
}

function midDir(d0: Pt, d1: Pt): Pt {
  let a0 = ang(d0)
  let a1 = ang(d1)
  let delta = a1 - a0
  while (delta <= -Math.PI) delta += Math.PI * 2
  while (delta > Math.PI) delta -= Math.PI * 2
  if (delta < 0) {
    const t = a0
    a0 = a1
    a1 = t
    delta = -delta
  }
  const m = a0 + delta / 2
  return { x: Math.cos(m), y: Math.sin(m) }
}

/**
 * Stack wedges at one apex so outer rays are exactly left + right:
 * a straight line = 180°.
 */
function fitPose(corners: Corner[], apex: Pt, r: number) {
  let angleCursor = Math.PI // left
  const poses: { apex: Pt; d0: Pt; d1: Pt; label: Pt }[] = []
  for (const c of corners) {
    const rad = (c.deg * Math.PI) / 180
    const b0 = angleCursor
    const b1 = angleCursor + rad
    const d0 = { x: Math.cos(b0), y: Math.sin(b0) }
    const d1 = { x: Math.cos(b1), y: Math.sin(b1) }
    const md = midDir(d0, d1)
    poses.push({
      apex,
      d0,
      d1,
      label: add(apex, scale(md, r * 0.52)),
    })
    angleCursor = b1
  }
  return poses
}

function modeFlags(mode: AngleSumLabMode) {
  return {
    ask: mode === 'ask',
    showTri: mode !== 'ask',
    showWedgesOnTri: [
      'acute',
      'right',
      'obtuse',
      'challenge',
      'fitted',
      'generalize',
    ].includes(mode),
    /** Line assembly visible once we have a triangle. */
    showLineStage: mode !== 'ask',
    /** Wedges sit on the line (demo / result). */
    wedgesOnLine:
      mode === 'acute' ||
      mode === 'right' ||
      mode === 'obtuse' ||
      mode === 'fitted' ||
      mode === 'generalize',
    challenge: mode === 'challenge',
    fitted: mode === 'fitted' || mode === 'generalize',
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
  const [fitted, setFitted] = useState(false)
  const doneRef = useRef(false)

  const kind = kindForMode(
    mode === 'challenge' ||
      mode === 'fitted' ||
      mode === 'generalize' ||
      mode === 'ask'
      ? 'acute'
      : mode,
  )

  const { A, B, C, degs } = useMemo(
    () => triangleVerts(kind, { x: 0, y: 8, w: 380, h: 168 }),
    [kind],
  )

  const corners = useMemo(() => {
    const [dA, dB, dC] = degs
    return [
      cornerAt('A', A, B, C, dA, '#ff6b7a'),
      cornerAt('B', B, A, C, dB, '#4cc9f0'),
      cornerAt('C', C, A, B, dC, '#b8f27c'),
    ]
  }, [A, B, C, degs])

  useEffect(() => {
    if (mode === 'challenge') {
      setFitted(false)
      doneRef.current = false
    } else if (mode === 'fitted' || mode === 'generalize') {
      setFitted(true)
    } else {
      setFitted(false)
      doneRef.current = false
    }
  }, [mode])

  const lineApex = { x: 190, y: 268 }
  const showOnLine = fitted || flags.wedgesOnLine
  const hideTriWedges = showOnLine && (flags.challenge || flags.fitted)

  const fitPoses = useMemo(
    () => fitPose(corners, lineApex, R_LINE),
    [corners],
  )

  const runAutoFit = () => {
    if (fitted) return
    setFitted(true)
    window.setTimeout(() => {
      beep()
      if (!doneRef.current) {
        doneRef.current = true
        onInteractComplete?.()
      }
    }, 850)
  }

  const sum = degs[0] + degs[1] + degs[2]
  const lineActive = showOnLine

  return (
    <div
      className={`angle-lab ${flags.challenge ? 'is-challenge' : ''} ${lineActive ? 'is-fitted' : ''}`}
    >
      {flags.ask && <p className="lab-hook">{t.angleHookAsk}</p>}

      <svg
        className="angle-svg"
        viewBox="0 0 380 360"
        role="img"
        aria-label="Triangle angles form a straight line"
      >
        {/* —— Triangle —— */}
        {flags.showTri && (
          <g className={`angle-tri-group ${hideTriWedges ? 'dim' : ''}`}>
            <polygon className="angle-tri" points={poly([A, B, C])} />
            <polygon
              className="tri-outline"
              points={poly([A, B, C])}
              fill="none"
            />
            {!hideTriWedges &&
              flags.showWedgesOnTri &&
              corners.map((c) => {
                const label = add(
                  c.home,
                  scale(midDir(c.dir0, c.dir1), R_TRI * 0.55),
                )
                return (
                  <g key={`t-${c.id}`} className={`angle-wedge kind-${c.id}`}>
                    <path
                      d={wedgePath(c.home, c.dir0, c.dir1, R_TRI)}
                      className="wedge-fill"
                      style={{ fill: c.color }}
                    />
                    <text
                      x={label.x}
                      y={label.y + 4}
                      className="wedge-label"
                      textAnchor="middle"
                    >
                      {`${c.deg}°`}
                    </text>
                  </g>
                )
              })}
            <text x={A.x - 12} y={A.y + 18} className="vert-label">
              A
            </text>
            <text x={B.x + 6} y={B.y + 18} className="vert-label">
              B
            </text>
            <text x={C.x - 4} y={C.y - 8} className="vert-label">
              C
            </text>
          </g>
        )}

        {/* —— Straight line = 180° —— */}
        {flags.showLineStage && (
          <g className="angle-line-stage">
            <line
              className={`angle-baseline ${lineActive ? 'hot' : 'waiting'}`}
              x1={48}
              y1={lineApex.y}
              x2={332}
              y2={lineApex.y}
            />
            {/* End caps mark a straight angle */}
            <line
              className={`angle-cap ${lineActive ? 'hot' : ''}`}
              x1={48}
              y1={lineApex.y - 10}
              x2={48}
              y2={lineApex.y + 10}
            />
            <line
              className={`angle-cap ${lineActive ? 'hot' : ''}`}
              x1={332}
              y1={lineApex.y - 10}
              x2={332}
              y2={lineApex.y + 10}
            />

            {lineActive &&
              fitPoses.map((pose, i) => {
                const c = corners[i]
                return (
                  <g key={`l-${c.id}`} className={`angle-wedge on-line kind-${c.id}`}>
                    <path
                      d={wedgePath(pose.apex, pose.d0, pose.d1, R_LINE)}
                      className="wedge-fill"
                      style={{ fill: c.color }}
                    />
                    <text
                      x={pose.label.x}
                      y={pose.label.y + 4}
                      className="wedge-label"
                      textAnchor="middle"
                    >
                      {flags.generalize ? `∠${c.id}` : `${c.deg}°`}
                    </text>
                  </g>
                )
              })}

            {/* Outer rays of the half-plane — the straight line itself */}
            {lineActive && (
              <>
                <line
                  className="straight-ray"
                  x1={lineApex.x - R_LINE - 8}
                  y1={lineApex.y}
                  x2={lineApex.x + R_LINE + 8}
                  y2={lineApex.y}
                />
                <text
                  x={190}
                  y={lineApex.y + 36}
                  className="line-caption"
                  textAnchor="middle"
                >
                  {flags.generalize
                    ? t.angleStraightLabel
                    : `${sum}° = ${t.angleStraightLabel}`}
                </text>
              </>
            )}

            {flags.challenge && !lineActive && (
              <text
                x={190}
                y={lineApex.y + 28}
                className="line-hint"
                textAnchor="middle"
              >
                {t.angleLineHint}
              </text>
            )}
          </g>
        )}
      </svg>

      {flags.challenge && !fitted && (
        <button
          type="button"
          className="auto-fit"
          onClick={(e) => {
            e.stopPropagation()
            runAutoFit()
          }}
        >
          {t.angleAutoFit}
        </button>
      )}

      {lineActive && (flags.showLineStage || flags.challenge) && (
        <p className="angle-eq">
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
              <span className="a">{degs[0]}°</span>
              <span className="op">+</span>
              <span className="b">{degs[1]}°</span>
              <span className="op">+</span>
              <span className="c">{degs[2]}°</span>
              <span className="op">=</span>
              <span className="sum">180°</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
