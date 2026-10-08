import { useEffect, useState } from 'react'
import type { CongruenceLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { beep } from './labMotion'

/** Exact-scale figure: AB = AE = 1, ∠BAC = ∠DAE = 87°, ∠DAC = 54°, ∠ABC = 39°. */
const V = {
  A: [210, 190],
  B: [310.4, 220.7],
  C: [237.9, 113.2],
  D: [164.3, 122.3],
  E: [120.0, 244.1],
} as const
type P = keyof typeof V

const COL = {
  given: '#ff6b7a',
  derived: '#4cc9f0',
  gold: '#ffd166',
  ok: '#b8f27c',
  seg: 'rgba(242, 245, 255, 0.72)',
}

const SEGS: [P, P][] = [
  ['E', 'B'],
  ['B', 'C'],
  ['C', 'D'],
  ['D', 'E'],
  ['A', 'E'],
  ['A', 'B'],
  ['A', 'C'],
  ['A', 'D'],
]

const VLBL: Record<P, [number, number]> = {
  A: [0, 24],
  B: [13, 7],
  C: [7, -10],
  D: [-12, -9],
  E: [-13, 10],
}

function angTo(v: P, p: P) {
  return Math.atan2(V[p][1] - V[v][1], V[p][0] - V[v][0])
}

function sweep(v: P, p1: P, p2: P) {
  let d = angTo(v, p2) - angTo(v, p1)
  while (d > Math.PI) d -= 2 * Math.PI
  while (d <= -Math.PI) d += 2 * Math.PI
  return d
}

function sectorPath(v: P, p1: P, p2: P, r: number) {
  const a1 = angTo(v, p1)
  const d = sweep(v, p1, p2)
  const [x, y] = V[v]
  const x1 = x + r * Math.cos(a1)
  const y1 = y + r * Math.sin(a1)
  const x2 = x + r * Math.cos(a1 + d)
  const y2 = y + r * Math.sin(a1 + d)
  return `M ${x} ${y} L ${x1} ${y1} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${x2} ${y2} Z`
}

function labelPos(v: P, p1: P, p2: P, dist: number): [number, number] {
  const mid = angTo(v, p1) + sweep(v, p1, p2) / 2
  return [V[v][0] + dist * Math.cos(mid), V[v][1] + dist * Math.sin(mid)]
}

type ArcSpec = {
  v: P
  p1: P
  p2: P
  r: number
  ld?: number
  color: string
  label?: string
  dash?: boolean
}

function Arc({ s }: { s: ArcSpec }) {
  const a1 = angTo(s.v, s.p1)
  const d = sweep(s.v, s.p1, s.p2)
  const [x, y] = V[s.v]
  const x1 = x + s.r * Math.cos(a1)
  const y1 = y + s.r * Math.sin(a1)
  const x2 = x + s.r * Math.cos(a1 + d)
  const y2 = y + s.r * Math.sin(a1 + d)
  const [lx, ly] = labelPos(s.v, s.p1, s.p2, s.ld ?? s.r + 17)
  return (
    <g>
      <path
        d={`M ${x} ${y} L ${x1} ${y1} A ${s.r} ${s.r} 0 0 ${d > 0 ? 1 : 0} ${x2} ${y2} Z`}
        fill={s.color}
        fillOpacity={0.16}
        stroke="none"
      />
      <path
        d={`M ${x1} ${y1} A ${s.r} ${s.r} 0 0 ${d > 0 ? 1 : 0} ${x2} ${y2}`}
        fill="none"
        stroke={s.color}
        strokeWidth={2.2}
        strokeDasharray={s.dash ? '5 4' : undefined}
      />
      {s.label && (
        <text x={lx} y={ly + 5} textAnchor="middle" className="cong-al" fill={s.color}>
          {s.label}
        </text>
      )}
    </g>
  )
}

function chevron(p: P, q: P, t: number, n: number, color: string) {
  const [x1, y1] = V[p]
  const [x2, y2] = V[q]
  const dx = x2 - x1
  const dy = y2 - y1
  const L = Math.hypot(dx, dy)
  const ux = dx / L
  const uy = dy / L
  const px = -uy
  const py = ux
  const marks: React.ReactNode[] = []
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * 7
    const cx = x1 + t * dx + off * px
    const cy = y1 + t * dy + off * py
    const bx = cx - 5 * ux
    const by = cy - 5 * uy
    marks.push(
      <path
        key={i}
        d={`M ${bx + 6 * px} ${by + 6 * py} L ${cx + 4 * ux} ${cy + 4 * uy} L ${bx - 6 * px} ${by - 6 * py}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />,
    )
  }
  return <g>{marks}</g>
}

function tick(p: P, q: P, color: string) {
  const [x1, y1] = V[p]
  const [x2, y2] = V[q]
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const L = Math.hypot(dx, dy)
  const px = -dy / L
  const py = dx / L
  return (
    <line
      x1={mx - 5.5 * px}
      y1={my - 5.5 * py}
      x2={mx + 5.5 * px}
      y2={my + 5.5 * py}
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
    />
  )
}

function zpath(pts: P[], color: string) {
  const d = 'M ' + pts.map((p) => V[p].join(' ')).join(' L ')
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={24}
      strokeOpacity={0.13}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  )
}

function tri(pts: P[], color: string, op: number) {
  return (
    <polygon
      points={pts.map((p) => V[p].join(',')).join(' ')}
      fill={color}
      fillOpacity={op}
    />
  )
}

const HITS: { id: string; v: P; p1: P; p2: P; r: number }[] = [
  { id: 'acb', v: 'C', p1: 'A', p2: 'B', r: 32 },
  { id: 'dac', v: 'A', p1: 'D', p2: 'C', r: 34 },
  { id: 'ade', v: 'D', p1: 'A', p2: 'E', r: 32 },
  { id: 'bac', v: 'A', p1: 'B', p2: 'C', r: 50 },
]

const TRUE_PAIRS = new Set(['acb', 'dac', 'ade'])

export function CongruenceLab({ mode, onInteractComplete }: CongruenceLabProps) {
  const { t } = useI18n()
  const [picked, setPicked] = useState<string[]>([])
  const [wrong, setWrong] = useState<string[]>([])
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (mode !== 'challenge') {
      setPicked([])
      setWrong([])
      setSolved(false)
    }
  }, [mode])

  const pick = (id: string) => {
    if (solved) return
    setWrong([])
    if (picked.includes(id)) {
      setPicked(picked.filter((x) => x !== id))
      return
    }
    const next = [...picked, id]
    if (next.length === 1) {
      setPicked(next)
      return
    }
    if (next.every((x) => TRUE_PAIRS.has(x))) {
      setPicked(next)
      setSolved(true)
      beep()
      window.setTimeout(() => onInteractComplete?.(), 800)
    } else {
      setWrong(next)
      window.setTimeout(() => {
        setWrong([])
        setPicked([])
      }, 650)
    }
  }

  const flags = {
    ask: mode === 'ask',
    parallels: mode === 'parallels',
    challenge: mode === 'challenge',
    z1: mode === 'z1',
    z2: mode === 'z2',
    proof: mode === 'proof',
    numbers: mode === 'numbers',
    iso: mode === 'iso',
    final: mode === 'final',
    check: mode === 'check',
  }

  const arcs: ArcSpec[] = []
  if (flags.ask) {
    arcs.push({ v: 'C', p1: 'A', p2: 'D', r: 30, ld: 48, color: COL.gold, label: '?', dash: true })
  }
  if (flags.parallels) {
    arcs.push({ v: 'B', p1: 'A', p2: 'C', r: 20, ld: 36, color: COL.given, label: 'x' })
    arcs.push({ v: 'E', p1: 'A', p2: 'D', r: 20, ld: 36, color: COL.given, label: 'x' })
  }
  if (flags.z1) {
    arcs.push({ v: 'C', p1: 'B', p2: 'A', r: 24, ld: 42, color: COL.gold, label: 'θ' })
    arcs.push({ v: 'A', p1: 'D', p2: 'C', r: 26, ld: 46, color: COL.gold, label: 'θ' })
  }
  if (flags.z2) {
    arcs.push({ v: 'C', p1: 'B', p2: 'A', r: 18, ld: 32, color: COL.gold, label: 'θ' })
    arcs.push({ v: 'A', p1: 'D', p2: 'C', r: 26, ld: 46, color: COL.gold, label: 'θ' })
    arcs.push({ v: 'D', p1: 'E', p2: 'A', r: 24, ld: 40, color: COL.derived, label: 'θ' })
  }
  if (flags.proof) {
    arcs.push({ v: 'B', p1: 'A', p2: 'C', r: 20, ld: 36, color: COL.given })
    arcs.push({ v: 'E', p1: 'A', p2: 'D', r: 20, ld: 36, color: COL.given })
    arcs.push({ v: 'C', p1: 'B', p2: 'A', r: 27, ld: 0, color: COL.derived })
    arcs.push({ v: 'D', p1: 'E', p2: 'A', r: 27, ld: 0, color: COL.derived })
  }
  if (flags.numbers) {
    arcs.push({ v: 'B', p1: 'A', p2: 'C', r: 22, ld: 40, color: COL.given, label: '39°' })
    arcs.push({ v: 'A', p1: 'D', p2: 'E', r: 24, ld: 46, color: COL.given, label: '87°' })
    arcs.push({ v: 'A', p1: 'B', p2: 'C', r: 34, ld: 56, color: COL.derived, label: '87°' })
    arcs.push({ v: 'C', p1: 'A', p2: 'B', r: 22, ld: 38, color: COL.derived, label: '54°' })
  }
  if (flags.iso) {
    arcs.push({ v: 'C', p1: 'A', p2: 'D', r: 28, ld: 26, color: COL.gold, label: '?' })
    arcs.push({ v: 'D', p1: 'C', p2: 'A', r: 26, ld: 24, color: COL.gold, label: '?' })
  }
  if (flags.final) {
    arcs.push({ v: 'A', p1: 'D', p2: 'C', r: 18, ld: 26, color: COL.derived, label: '54°' })
    arcs.push({ v: 'C', p1: 'A', p2: 'D', r: 28, ld: 26, color: COL.gold, label: '63°' })
    arcs.push({ v: 'D', p1: 'C', p2: 'A', r: 22, ld: 24, color: COL.gold, label: '63°' })
  }
  if (flags.check) {
    arcs.push({ v: 'C', p1: 'A', p2: 'D', r: 26, ld: 26, color: COL.gold, label: '63°' })
    arcs.push({ v: 'D', p1: 'C', p2: 'A', r: 20, ld: 24, color: COL.gold, label: '63°' })
    arcs.push({ v: 'D', p1: 'C', p2: 'E', r: 34, ld: 56, color: COL.ok, label: '117°' })
    arcs.push({ v: 'C', p1: 'A', p2: 'B', r: 16, ld: 32, color: COL.derived, label: '54°' })
  }

  return (
    <div className={`cong-lab ${solved ? 'is-solved' : ''}`}>
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Quadrilateral BCDE with interior point A">
        {flags.numbers && tri(['A', 'B', 'C'], COL.derived, 0.07)}
        {(flags.iso || flags.final) && tri(['A', 'C', 'D'], COL.gold, 0.1)}
        {flags.z1 && zpath(['B', 'C', 'A', 'D'], COL.gold)}
        {flags.z2 && zpath(['E', 'D', 'A', 'C'], COL.derived)}
        {flags.challenge && solved && zpath(['B', 'C', 'A', 'D'], COL.gold)}

        {SEGS.map(([p, q]) => (
          <line
            key={`${p}${q}`}
            x1={V[p][0]}
            y1={V[p][1]}
            x2={V[q][0]}
            y2={V[q][1]}
            className="cong-seg"
          />
        ))}

        {flags.parallels && (
          <g>
            {chevron('A', 'C', 0.55, 1, COL.derived)}
            {chevron('E', 'D', 0.55, 1, COL.derived)}
            {chevron('A', 'D', 0.55, 2, COL.given)}
            {chevron('B', 'C', 0.55, 2, COL.given)}
            {tick('A', 'B', COL.given)}
            {tick('A', 'E', COL.given)}
          </g>
        )}
        {flags.proof && (
          <g>
            {tick('A', 'B', COL.given)}
            {tick('A', 'E', COL.given)}
          </g>
        )}
        {(flags.iso || flags.final) && (
          <g>
            {tick('A', 'C', COL.gold)}
            {tick('A', 'D', COL.gold)}
          </g>
        )}

        {arcs.map((s, i) => (
          <Arc key={i} s={s} />
        ))}

        {flags.challenge &&
          HITS.map((h) => {
            const cls = wrong.includes(h.id)
              ? 'is-wrong'
              : solved || picked.includes(h.id)
                ? solved
                  ? 'solved'
                  : 'picked'
                : ''
            return (
              <path
                key={h.id}
                d={sectorPath(h.v, h.p1, h.p2, h.r)}
                className={`cong-hit ${cls}`}
                onClick={(e) => {
                  e.stopPropagation()
                  pick(h.id)
                }}
              />
            )
          })}

        {flags.challenge && solved && (
          <>
            <text {...lbl('C', 'B', 'A', 44)} className="cong-al" fill={COL.gold}>θ</text>
            <text {...lbl('A', 'D', 'C', 52)} className="cong-al" fill={COL.gold}>θ</text>
            <text {...lbl('D', 'E', 'A', 46)} className="cong-al" fill={COL.gold}>θ</text>
          </>
        )}

        {(Object.keys(V) as P[]).map((k) => (
          <g key={k}>
            <circle cx={V[k][0]} cy={V[k][1]} r={3} fill="#f2f5ff" />
            <text
              x={V[k][0] + VLBL[k][0]}
              y={V[k][1] + VLBL[k][1]}
              textAnchor="middle"
              className="cong-v"
            >
              {k}
            </text>
          </g>
        ))}

        {flags.challenge && !solved && (
          <text x={215} y={315} textAnchor="middle" className="line-hint">
            {t.congHint}
          </text>
        )}
      </svg>

      {(solved || flags.proof) && (
        <p className="vm-eq show">
          <span className="a">△ABC</span>
          <span className="op">≅</span>
          <span className="b">△AED</span>
          <span className="op">(AAS)</span>
        </p>
      )}
      {flags.final && (
        <p className="vm-eq show">
          <span className="a">∠ACD</span>
          <span className="op">=</span>
          <span className="sum">63°</span>
        </p>
      )}
      {flags.check && (
        <p className="vm-eq show">
          <span className="a">63°</span>
          <span className="op">+</span>
          <span className="b">117°</span>
          <span className="op">=</span>
          <span className="sum">180°</span>
        </p>
      )}
    </div>
  )
}

function lbl(v: P, p1: P, p2: P, dist: number) {
  const [x, y] = labelPos(v, p1, p2, dist)
  return { x, y }
}
