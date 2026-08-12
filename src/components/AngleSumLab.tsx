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

const R = 44

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

/** Vertices from exact interior angles (degrees at A, B, C). Fitted into viewBox. */
function triangleVerts(kind: TriKind) {
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
  // Interior at A above the base (math y-up, flip later)
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
  const pad = 36
  const boxW = 380 - pad * 2
  const boxH = 210
  const s = Math.min(boxW / w, boxH / h)
  const ox = pad + (boxW - w * s) / 2 - minX * s
  const oy = 28 + (boxH - h * s) / 2 + maxY * s // flip y into SVG

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

/** Ordered CCW wedge path (SVG y-down). */
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

/** Lay wedges at one apex on a baseline; outer rays form a straight 180° line. */
function fitPose(corners: Corner[], apex: Pt) {
  // Start pointing left (π); add positive radians → through −π/2 (up) toward 0 (right)
  let angleCursor = Math.PI
  const poses: { apex: Pt; d0: Pt; d1: Pt; label: Pt }[] = []
  for (const c of corners) {
    const rad = (c.deg * Math.PI) / 180
    const b0 = angleCursor
    const b1 = angleCursor + rad
    const d0 = { x: Math.cos(b0), y: Math.sin(b0) }
    const d1 = { x: Math.cos(b1), y: Math.sin(b1) }
    const md = midDir(d0, d1)
    const label = add(apex, scale(md, R * 0.55))
    poses.push({ apex, d0, d1, label })
    angleCursor = b1
  }
  return poses
}

function modeFlags(mode: AngleSumLabMode) {
  return {
    ask: mode === 'ask',
    showTri: mode !== 'ask',
    showWedges: [
      'acute',
      'right',
      'obtuse',
      'challenge',
      'fitted',
      'generalize',
    ].includes(mode),
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
    mode === 'challenge' || mode === 'fitted' || mode === 'generalize' || mode === 'ask'
      ? 'acute'
      : mode,
  )

  const { A, B, C, degs } = useMemo(() => triangleVerts(kind), [kind])

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

  const showFitted = fitted || flags.fitted
  const fitPoses = useMemo(
    () => fitPose(corners, { x: 190, y: 288 }),
    [corners],
  )

  const runAutoFit = () => {
    if (showFitted) return
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

  return (
    <div
      className={`angle-lab ${flags.challenge ? 'is-challenge' : ''} ${showFitted ? 'is-fitted' : ''}`}
    >
      {flags.ask && <p className="lab-hook">{t.angleHookAsk}</p>}

      <svg
        className="angle-svg"
        viewBox="0 0 380 340"
        role="img"
        aria-label="Triangle angle sum lab"
      >
        {(showFitted || flags.challenge) && (
          <line
            className={`angle-baseline ${showFitted ? 'hot' : ''}`}
            x1={40}
            y1={288}
            x2={340}
            y2={288}
          />
        )}

        {flags.showTri && !showFitted && (
          <>
            <polygon className="angle-tri" points={poly([A, B, C])} />
            <polygon
              className="tri-outline"
              points={poly([A, B, C])}
              fill="none"
            />
          </>
        )}

        {flags.showWedges &&
          corners.map((c, i) => {
            const pose = showFitted
              ? fitPoses[i]
              : {
                  apex: c.home,
                  d0: c.dir0,
                  d1: c.dir1,
                  label: add(c.home, scale(midDir(c.dir0, c.dir1), R * 0.55)),
                }
            const d = wedgePath(pose.apex, pose.d0, pose.d1, R)
            return (
              <g key={c.id} className={`angle-wedge kind-${c.id}`}>
                <path d={d} className="wedge-fill" style={{ fill: c.color }} />
                <text
                  x={pose.label.x}
                  y={pose.label.y + 4}
                  className="wedge-label"
                  textAnchor="middle"
                >
                  {flags.generalize ? c.id : `${c.deg}°`}
                </text>
              </g>
            )
          })}

        {flags.showTri && !showFitted && (
          <>
            <text x={A.x - 14} y={A.y + 20} className="vert-label">
              A
            </text>
            <text x={B.x + 6} y={B.y + 20} className="vert-label">
              B
            </text>
            <text x={C.x - 6} y={C.y - 10} className="vert-label">
              C
            </text>
          </>
        )}

        {showFitted && (
          <text x={190} y={322} className="line-caption" textAnchor="middle">
            {flags.generalize ? '180°' : `${sum}°`}
          </text>
        )}
      </svg>

      {flags.challenge && !showFitted && (
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

      {showFitted && (flags.challenge || flags.fitted) && (
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
