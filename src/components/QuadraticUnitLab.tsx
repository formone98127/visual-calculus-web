import { useEffect, useRef, useState } from 'react'
import type { QuadraticUnitLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { beep, clamp01, easeOutCubic } from './labMotion'
import { McqCards, QuestionCard, useNarrow } from './NarrowBlocks'

const GOLD = '#ffd166'
const BLUE = '#4cc9f0'
const RED = '#ff6b7a'
const PINK = '#ff8fa0'
const OK = '#b8f27c'
const INK = '#f2f5ff'
const MUTED = 'rgba(242, 245, 255, 0.55)'
const LINE = 'rgba(242, 245, 255, 0.72)'
const AXIS = 'rgba(242, 245, 255, 0.45)'

/** rAF progress 0→1 (eased), restarts whenever `key` changes. */
function useFly(key: string, dur = 950) {
  const [u, setU] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    cancelAnimationFrame(raf.current)
    setU(0)
    const start = performance.now()
    const tick = (now: number) => {
      const p = clamp01((now - start) / dur)
      setU(easeOutCubic(p))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [key, dur])
  return u
}

type Part = { t: string; sup?: boolean; fill?: string; it?: boolean }

/** One-line math-ish text built from tspans (sup shifts up, then back down). */
function Tex({
  x,
  y,
  size = 26,
  parts,
  anchor = 'middle',
  opacity = 1,
}: {
  x: number
  y: number
  size?: number
  parts: Part[]
  anchor?: 'middle' | 'start' | 'end'
  opacity?: number
}) {
  let wasSup = false
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      opacity={opacity}
      fontFamily="'Fraunces', Georgia, serif"
      fontSize={size}
      fontWeight={600}
      fill={INK}
    >
      {parts.map((p, i) => {
        const dy = p.sup ? -size * 0.45 : wasSup ? size * 0.45 : 0
        wasSup = !!p.sup
        return (
          <tspan
            key={i}
            dy={dy}
            fontSize={p.sup ? size * 0.62 : size}
            fill={p.fill ?? INK}
            fontStyle={p.it ? 'italic' : 'normal'}
          >
            {p.t}
          </tspan>
        )
      })}
    </text>
  )
}

function Card({ x, y, w = 96, h = 58, op = 1, stroke = LINE }: { x: number; y: number; w?: number; h?: number; op?: number; stroke?: string }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={12}
      fill="rgba(255, 255, 255, 0.05)"
      stroke={stroke}
      strokeWidth={1.6}
      opacity={op}
    />
  )
}

/* ---- world → px (the master figure: y = x² − 4x − 4) ----
   x −1.5..5.5 → px 40..400 · y 5..−9 → px 50..280.
   Hand-checked anchors: x-axis y=132 · y-axis x=117 ·
   roots px 74.5 / 365.5 · vertex (2,−8) px (220, 264). */
const OX = (x: number) => 40 + (x + 1.5) * 51.43
const OY = (y: number) => 50 + (5 - y) * 16.43

function paraPts(c: number, x0: number, x1: number, n = 48): string {
  const pts: string[] = []
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n
    pts.push(`${OX(x).toFixed(1)},${OY(x * x - 4 * x + c).toFixed(1)}`)
  }
  return pts.join(' ')
}

/** the master figure: axes + y = x²−4x−4, optional layer of root dots */
function QuadFig({ u, roots, c = -4, x0 = -1.5, x1 = 5.5 }: { u: number; roots?: boolean; c?: number; x0?: number; x1?: number }) {
  return (
    <g>
      <line x1={30} y1={OY(0)} x2={408} y2={OY(0)} stroke={AXIS} strokeWidth={1.4} />
      <line x1={OX(0)} y1={44} x2={OX(0)} y2={292} stroke={AXIS} strokeWidth={1.4} />
      <text x={396} y={OY(0) - 8} textAnchor="end" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" fontStyle="italic">
        x
      </text>
      <text x={OX(0) + 8} y={52} fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" fontStyle="italic">
        y
      </text>
      <polyline points={paraPts(c, x0, x1)} fill="none" stroke={LINE} strokeWidth={2} opacity={clamp01(u / 0.4)} />
      {roots && (
        <g opacity={clamp01((u - 0.45) / 0.3)}>
          <circle cx={OX(2 - 2 * Math.SQRT2)} cy={OY(0)} r={4.5} fill={GOLD} />
          <circle cx={OX(2 + 2 * Math.SQRT2)} cy={OY(0)} r={4.5} fill={GOLD} />
        </g>
      )}
    </g>
  )
}

/* ---- three mini parabolas (the Δ cases): panels at px 16 / 156 / 296, 118 wide ----
   local world x −1..5 · y −9..11 → px y 100..250 (scale 7.5). Axis y=182.5. */
const PANEL_X = [16, 156, 296]
const OXM = (p: number, x: number) => p + (x + 1) * 19.67
const OYM = (y: number) => 100 + (11 - y) * 7.5

function MiniPara({ u, k, panel }: { u: number; k: number; panel: number }) {
  const pts: string[] = []
  for (let i = 0; i <= 32; i++) {
    const x = -1 + (6 * i) / 32
    pts.push(`${OXM(panel, x).toFixed(1)},${OYM(x * x - 4 * x + k).toFixed(1)}`)
  }
  return (
    <g opacity={clamp01(u / 0.5)}>
      <line x1={panel + 6} y1={OYM(0)} x2={panel + 112} y2={OYM(0)} stroke={AXIS} strokeWidth={1.2} />
      <polyline points={pts.join(' ')} fill="none" stroke={LINE} strokeWidth={1.8} />
      {k === -4 && (
        <g>
          <circle cx={OXM(panel, 2 - 2 * Math.SQRT2)} cy={OYM(0)} r={3.5} fill={GOLD} />
          <circle cx={OXM(panel, 2 + 2 * Math.SQRT2)} cy={OYM(0)} r={3.5} fill={GOLD} />
        </g>
      )}
      {k === 4 && <circle cx={OXM(panel, 2)} cy={OYM(0)} r={3.5} fill={GOLD} />}
    </g>
  )
}

function NumLine({ u, y, ticks }: { u: number; y: number; ticks: { x: number; label: string; dot?: boolean }[] }) {
  return (
    <g opacity={clamp01(u / 0.4)}>
      <line x1={40} y1={y} x2={400} y2={y} stroke={AXIS} strokeWidth={1.4} />
      <path d={`M 394 ${y - 4} L 402 ${y} L 394 ${y + 4}`} fill="none" stroke={AXIS} strokeWidth={1.2} />
      {ticks.map((tk) => (
        <g key={tk.x}>
          <line x1={tk.x} y1={y - 4} x2={tk.x} y2={y + 4} stroke={AXIS} strokeWidth={1.2} />
          {tk.dot && <circle cx={tk.x} cy={y} r={4.5} fill={GOLD} />}
          <text x={tk.x} y={y + 22} textAnchor="middle" fontSize={12} fill={tk.dot ? GOLD : MUTED} fontFamily="'Fraunces', Georgia, serif">
            {tk.label}
          </text>
        </g>
      ))}
    </g>
  )
}

function Circled({ x, y, n, fill }: { x: number; y: number; n: string; fill: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill={fill} fillOpacity={0.18} stroke={fill} strokeWidth={1.4} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fill={fill} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
        {n}
      </text>
    </g>
  )
}

/* ---- language-neutral figures' labels ---- */
const EQ_MAIN: Part[] = [
  { t: 'a', it: true, fill: BLUE },
  { t: 'x' },
  { t: '2', sup: true },
  { t: ' + ' },
  { t: 'b', it: true, fill: GOLD },
  { t: 'x' },
  { t: ' + ' },
  { t: 'c', it: true, fill: PINK },
  { t: ' = 0' },
]
const FORMULA: Part[] = [
  { t: 'x = ' },
  { t: '( −b ± ' },
  { t: '√(b² − 4ac)', fill: GOLD },
  { t: ' ) / 2a' },
]
const FORMULA_SHORT: Part[] = [{ t: 'x = (−b ± √Δ)/2a' }]

/* ---- guide ---- */
type GuideStep = {
  n: string
  lawKey: 'u1GuideLaw0' | 'u1GuideLaw1' | 'u1GuideLaw2' | 'u1GuideLaw3' | 'u1GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'u1GuideLaw0',
    line: [{ t: 'ax² + bx + c = 0' }],
  },
  {
    n: '1',
    lawKey: 'u1GuideLaw1',
    line: [{ t: 'x² − 3x + 2 = (x−1)(x−2) → ' }, { t: 'x = 1, 2', fill: GOLD }],
  },
  {
    n: '2',
    lawKey: 'u1GuideLaw2',
    line: [{ t: 'x = (4 ± √32)/2 ≈ ' }, { t: '−0.83, 4.83', fill: GOLD }],
  },
  {
    n: '3',
    lawKey: 'u1GuideLaw3',
    line: [{ t: 'Δ > 0 ×2 · Δ = 0 ×1 · Δ < 0 ' }, { t: '×0', fill: RED }],
  },
  {
    n: '4',
    lawKey: 'u1GuideLaw4',
    line: [{ t: 'α+β = −b/a · αβ = c/a → ' }, { t: 'x² − 4x − 4 = 0', fill: OK }],
  },
]

const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; val: string }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: 'k < 4' },
  { id: 'B', val: 'k = 4' },
  { id: 'C', val: 'k > 4' },
  { id: 'D', val: 'k ≤ 4' },
]
const ANSWER = 'A'

export function QuadraticUnitLab({ mode, onInteractComplete }: QuadraticUnitLabProps) {
  const { t } = useI18n()
  const narrow = useNarrow()
  const u = useFly(mode, mode === 'guide' ? 2800 : 1900)
  const [wrongId, setWrongId] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (mode !== 'gate') {
      setWrongId(null)
      setSolved(false)
    }
  }, [mode])

  const pick = (id: string) => {
    if (solved) return
    if (id === ANSWER) {
      setWrongId(null)
      setSolved(true)
      beep()
      window.setTimeout(() => onInteractComplete?.(), 800)
    } else {
      setWrongId(id)
      window.setTimeout(() => setWrongId((cur) => (cur === id ? null : cur)), 1600)
    }
  }

  const flags: Record<string, boolean> = {
    figure: mode === 'figure',
    question: mode === 'question',
    given1: mode === 'given1',
    given2: mode === 'given2',
    given3: mode === 'given3',
    given4: mode === 'given4',
    whatA: mode === 'whatA',
    whatB: mode === 'whatB',
    why: mode === 'why',
    factor: mode === 'factor',
    zeros: mode === 'zeros',
    strategy: mode === 'strategy',
    formula: mode === 'formula',
    plug: mode === 'plug',
    surd: mode === 'surd',
    graphTool: mode === 'graphTool',
    disc: mode === 'disc',
    three: mode === 'three',
    complex: mode === 'complex',
    roots: mode === 'roots',
    gate: mode === 'gate',
    slick: mode === 'slick',
    answer: mode === 'answer',
    verify: mode === 'verify',
    guide: mode === 'guide',
  }

  const chips = (live: boolean) =>
    OPTIONS.map((o) => {
      const isAns = o.id === ANSWER
      const ci = CHIP_X[OPTIONS.findIndex((q) => q.id === o.id)]
      const cls =
        live && wrongId === o.id
          ? 'idx-chip is-wrong'
          : solved
            ? isAns
              ? 'idx-chip solved'
              : 'idx-chip dim'
            : live
              ? 'idx-chip'
              : 'idx-chip static'
      return (
        <g
          key={o.id}
          className={cls}
          onClick={
            live
              ? (e) => {
                  e.stopPropagation()
                  pick(o.id)
                }
              : undefined
          }
        >
          <rect className="idx-chip-bg" x={ci} y={CHIP_Y} width={CHIP_W} height={CHIP_H} rx={14} />
          <text x={ci + 13} y={CHIP_Y + 17} fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
            {o.id}
          </text>
          <text x={ci + CHIP_W / 2} y={CHIP_Y + 36} textAnchor="middle" fontSize={17} fill={isAns && solved ? GOLD : INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
            {o.val}
          </text>
          {solved && isAns && (
            <g>
              <circle cx={ci + CHIP_W - 14} cy={CHIP_Y + 14} r={9} fill={OK} />
              <text x={ci + CHIP_W - 14} y={CHIP_Y + 18.5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0b1020">
                ✓
              </text>
            </g>
          )}
        </g>
      )
    })

  return (
    <div className={`idx-lab ${solved ? 'is-solved' : ''}`}>
      {!(narrow && (flags.gate || flags.question)) && (
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="one parabola ties the unit together: three solving tools, the discriminant judging the roots, and the root-coefficient relations">
        {/* ─── p0 · the figure first ─── */}
        {flags.figure && (
          <g>
            <QuadFig u={clamp01(u / 0.9)} />
            <g opacity={clamp01((u - 0.5) / 0.3)}>
              <text x={300} y={90} textAnchor="middle" fontSize={13} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" fontStyle="italic">
                y = x² − 4x − 4
              </text>
            </g>
          </g>
        )}

        {/* ─── p1 · the unit, in our own words (HTML block at phone width) ─── */}
        {flags.question && !narrow && (
          <g>
            {t.u1QTextA.split('\n').map((ln, i) => (
              <text key={`qa${i}`} x={54} y={66 + i * 30} fontSize={13.5} fill={INK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.05 * i) / 0.22)}>
                {ln}
              </text>
            ))}
            {t.u1QTextB.split('\n').map((ln, i) => (
              <text key={`qb${i}`} x={54} y={192 + i * 30} fontSize={13.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600} opacity={clamp01((u - 0.2 - 0.05 * i) / 0.22)}>
                {ln}
              </text>
            ))}
          </g>
        )}

        {/* ─── p2 · Given 1 — the standard form ─── */}
        {flags.given1 && (
          <g>
            <g className="idx-pulse" opacity={clamp01(u / 0.35)}>
              <Tex x={215} y={150} size={34} parts={EQ_MAIN} />
            </g>
            <g opacity={clamp01((u - 0.4) / 0.3)}>
              <text x={215} y={208} textAnchor="middle" fontSize={17} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                a ≠ 0
              </text>
              <line x1={165} y1={226} x2={265} y2={226} stroke={LINE} strokeWidth={1} opacity={0.4} />
              <text x={215} y={252} textAnchor="middle" fontSize={17} fill={PINK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                a, b, c ∈ ℝ
              </text>
            </g>
            <text x={215} y={312} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.7) / 0.25)}>
              {t.u1Given1Sub}
            </text>
          </g>
        )}

        {/* ─── p3 · Given 2 — three tools ─── */}
        {flags.given2 &&
          (() => {
            const c1 = clamp01((u - 0.05) / 0.3)
            const c2 = clamp01((u - 0.25) / 0.3)
            const c3 = clamp01((u - 0.45) / 0.3)
            return (
              <g>
                <g opacity={c1} transform={`translate(0, ${(1 - c1) * 14})`}>
                  <Card x={16} y={110} w={126} h={110} />
                  <Circled x={79} y={134} n="1" fill={GOLD} />
                  <text x={79} y={172} textAnchor="middle" fontSize={13.5} fill={INK} fontFamily="'Fraunces', Georgia, serif">
                    (x−1)(x−2) = 0
                  </text>
                  <text x={79} y={198} textAnchor="middle" fontSize={13.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    x = 1, 2
                  </text>
                </g>
                <g opacity={c2} transform={`translate(0, ${(1 - c2) * 14})`}>
                  <Card x={152} y={110} w={126} h={110} />
                  <Circled x={215} y={134} n="2" fill={BLUE} />
                  <Tex x={215} y={176} size={13} parts={FORMULA_SHORT} />
                </g>
                <g opacity={c3} transform={`translate(0, ${(1 - c3) * 14})`}>
                  <Card x={288} y={110} w={126} h={110} />
                  <Circled x={351} y={134} n="3" fill={PINK} />
                  <line x1={302} y1={192} x2={400} y2={192} stroke={AXIS} strokeWidth={1.2} />
                  <polyline points="306,168 330,208 351,214 372,208 396,168" fill="none" stroke={LINE} strokeWidth={1.8} />
                  <circle cx={318} cy={192} r={3} fill={GOLD} />
                  <circle cx={384} cy={192} r={3} fill={GOLD} />
                </g>
              </g>
            )
          })()}

        {/* ─── p4 · Given 3 — the discriminant ─── */}
        {flags.given3 && (
          <g>
            <Tex x={215} y={110} size={19} parts={FORMULA} opacity={clamp01(u / 0.35)} />
            <g opacity={clamp01((u - 0.35) / 0.25)}>
              <line x1={215} y1={128} x2={215} y2={158} stroke={LINE} strokeWidth={1.4} />
              <path d="M 210 152 L 215 162 L 220 152" fill="none" stroke={LINE} strokeWidth={1.4} />
            </g>
            <g opacity={clamp01((u - 0.55) / 0.3)} transform={`translate(0, ${(1 - clamp01((u - 0.55) / 0.3)) * 14})`}>
              <Card x={115} y={180} w={200} h={64} stroke={GOLD} />
              <Tex x={215} y={220} size={22} parts={[{ t: 'Δ = ' }, { t: 'b² − 4ac', fill: GOLD }]} />
            </g>
          </g>
        )}

        {/* ─── p5 · Given 4 — roots ↔ coefficients ─── */}
        {flags.given4 &&
          (() => {
            const l = clamp01((u - 0.05) / 0.3)
            const r = clamp01((u - 0.3) / 0.3)
            return (
              <g>
                <text x={215} y={95} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={0.7 * clamp01(u / 0.3)}>
                  x² − 4x − 4 = 0
                </text>
                <g opacity={l} transform={`translate(0, ${(1 - l) * 14})`}>
                  <Card x={30} y={125} w={172} h={92} />
                  <Tex x={116} y={160} size={20} parts={[{ t: 'α' , it: true }, { t: ' + ' }, { t: 'β', it: true }, { t: ' = ' }, { t: '−b/a', fill: GOLD }]} />
                  <text x={116} y={196} textAnchor="middle" fontSize={13} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                    4 = −(−4)/1
                  </text>
                </g>
                <g opacity={r} transform={`translate(0, ${(1 - r) * 14})`}>
                  <Card x={228} y={125} w={172} h={92} />
                  <Tex x={314} y={160} size={20} parts={[{ t: 'αβ', it: true }, { t: ' = ' }, { t: 'c/a', fill: GOLD }]} />
                  <text x={314} y={196} textAnchor="middle" fontSize={13} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                    −4 = −4/1
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── p6 · what is asked — solve ─── */}
        {flags.whatA && (
          <g>
            <g className="idx-pulse" opacity={clamp01(u / 0.35)}>
              <Tex x={215} y={158} size={30} parts={[{ t: 'ax² + bx + c = 0 → ' }, { t: 'x = ?', fill: GOLD }]} />
            </g>
            <text x={215} y={212} textAnchor="middle" fontSize={13.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.35) / 0.3)}>
              {t.u1WhatSubA}
            </text>
          </g>
        )}

        {/* ─── p7 · what is asked — judge · link · extend ─── */}
        {flags.whatB && (
          <g>
            <g className="idx-pulse" opacity={clamp01(u / 0.35)}>
              <Tex x={215} y={158} size={27} parts={[{ t: 'Δ ?' }, { t: '  ·  ' }, { t: 'α + β ?' }, { t: '  ·  ' }, { t: 'a ± bi ?', fill: PINK }]} />
            </g>
            <text x={215} y={212} textAnchor="middle" fontSize={13.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.35) / 0.3)}>
              {t.u1WhatSubB}
            </text>
          </g>
        )}

        {/* ─── p8 · why the graph — solving = x-intercepts ─── */}
        {flags.why && (
          <g>
            <QuadFig u={clamp01((u - 0.05) / 0.7)} roots />
            <text x={34} y={122} fontSize={12.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600} opacity={clamp01((u - 0.6) / 0.3)}>
              y = 0
            </text>
            <g className="idx-pulse" opacity={clamp01((u - 0.7) / 0.25)}>
              <text x={215} y={312} textAnchor="middle" fontSize={15.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                {t.u1WhyText}
              </text>
            </g>
          </g>
        )}

        {/* ─── p9 · tool 1 — factor method ─── */}
        {flags.factor &&
          (() => {
            const src = clamp01(u / 0.3)
            const fac = clamp01((u - 0.35) / 0.35)
            return (
              <g>
                <Tex x={215} y={110} size={20} parts={[{ t: 'x² − 3x + 2 = 0' }]} opacity={0.55 * src} />
                <g opacity={fac} transform={`translate(0, ${(1 - fac) * 14})`}>
                  <Card x={55} y={145} w={320} h={84} />
                  <circle cx={92} cy={187} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
                  <text x={92} y={192} textAnchor="middle" fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    1
                  </text>
                  <Tex x={245} y={198} size={21} parts={[{ t: '(x − 1)(x − 2) = 0', fill: GOLD }]} />
                </g>
              </g>
            )
          })()}

        {/* ─── p10 · zero product → the number line ─── */}
        {flags.zeros && (
          <g>
            <Tex x={215} y={95} size={16} parts={[{ t: '(x − 1)(x − 2) = 0' }]} opacity={0.55 * clamp01(u / 0.3)} />
            <NumLine
              u={clamp01((u - 0.3) / 0.35)}
              y={175}
              ticks={[
                { x: 65, label: '0' },
                { x: 155, label: '1', dot: true },
                { x: 245, label: '2', dot: true },
                { x: 335, label: '3' },
              ]}
            />
            <g className="idx-pulse" opacity={clamp01((u - 0.65) / 0.25)}>
              <Tex x={215} y={262} size={22} parts={[{ t: 'x = 1', fill: GOLD }, { t: '  ·  ' }, { t: 'x = 2', fill: GOLD }]} />
            </g>
          </g>
        )}

        {/* ─── p11 · tool choice — no integer pair ─── */}
        {flags.strategy &&
          (() => {
            const eq = clamp01(u / 0.3)
            const rows = clamp01((u - 0.3) / 0.4)
            const arrow = clamp01((u - 0.7) / 0.25)
            return (
              <g>
                <Tex x={215} y={100} size={22} parts={[{ t: 'x² − 4x − 4 = 0' }]} opacity={eq} />
                <g opacity={rows}>
                  <text x={155} y={152} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((rows - 0) / 0.4)}>
                    (−4) + 1 = −3
                    <tspan fill={RED}>{'  ✗'}</tspan>
                  </text>
                  <text x={155} y={184} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((rows - 0.3) / 0.4)}>
                    4 + (−1) = 3
                    <tspan fill={RED}>{'  ✗'}</tspan>
                  </text>
                  <text x={155} y={216} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((rows - 0.6) / 0.4)}>
                    (−2) + 2 = 0
                    <tspan fill={RED}>{'  ✗'}</tspan>
                  </text>
                </g>
                <g opacity={arrow}>
                  <line x1={215} y1={236} x2={215} y2={266} stroke={GOLD} strokeWidth={1.6} />
                  <path d="M 209 260 L 215 270 L 221 260" fill="none" stroke={GOLD} strokeWidth={1.6} />
                </g>
                <text x={215} y={312} textAnchor="middle" fontSize={14.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600} opacity={clamp01((u - 0.75) / 0.25)}>
                  {t.u1StrategySub}
                </text>
              </g>
            )
          })()}

        {/* ─── p12 · tool 2 — the quadratic formula ─── */}
        {flags.formula && (
          <g>
            <Tex x={215} y={100} size={17} parts={[{ t: 'ax² + bx + c = 0' }]} opacity={0.55 * clamp01(u / 0.3)} />
            <g className="idx-pulse" opacity={clamp01((u - 0.3) / 0.4)}>
              <Tex x={215} y={172} size={24} parts={FORMULA} />
            </g>
            <g opacity={clamp01((u - 0.7) / 0.3)}>
              <line x1={112} y1={200} x2={128} y2={200} stroke={BLUE} strokeWidth={2.2} />
              <text x={138} y={205} fontSize={13} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontStyle="italic">
                a
              </text>
              <line x1={192} y1={200} x2={208} y2={200} stroke={GOLD} strokeWidth={2.2} />
              <text x={218} y={205} fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontStyle="italic">
                b
              </text>
              <line x1={262} y1={200} x2={278} y2={200} stroke={PINK} strokeWidth={2.2} />
              <text x={288} y={205} fontSize={13} fill={PINK} fontFamily="'Fraunces', Georgia, serif" fontStyle="italic">
                c
              </text>
            </g>
          </g>
        )}

        {/* ─── p13 · substitute ─── */}
        {flags.plug &&
          (() => {
            const sub = clamp01(u / 0.3)
            const card = clamp01((u - 0.3) / 0.35)
            const res = clamp01((u - 0.65) / 0.3)
            return (
              <g>
                <Tex x={215} y={95} size={16} parts={[{ t: 'a = 1', fill: BLUE }, { t: '  ·  ' }, { t: 'b = −4', fill: GOLD }, { t: '  ·  ' }, { t: 'c = −4', fill: PINK }]} opacity={0.7 * sub} />
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={30} y={135} w={370} h={70} />
                  <Tex x={215} y={177} size={14.5} parts={[{ t: 'x = ( −(−4) ± √((−4)² − 4(1)(−4)) ) / 2(1)' }]} />
                </g>
                <g className="idx-pulse" opacity={res}>
                  <Tex x={215} y={262} size={22} parts={[{ t: 'x = ' }, { t: '(4 ± √32)/2', fill: GOLD }]} />
                </g>
              </g>
            )
          })()}

        {/* ─── p14 · stop at the surd ─── */}
        {flags.surd &&
          (() => {
            const eq = clamp01(u / 0.3)
            const nl = clamp01((u - 0.3) / 0.35)
            return (
              <g>
                <g className="idx-pulse" opacity={eq}>
                  <Tex x={215} y={140} size={26} parts={[{ t: 'x = ' }, { t: '(4 ± √32)/2', fill: GOLD }]} />
                </g>
                <NumLine
                  u={nl}
                  y={230}
                  ticks={[
                    { x: OX(2 - 2 * Math.SQRT2), label: '−0.83', dot: true },
                    { x: OX(0), label: '0' },
                    { x: OX(2), label: '2' },
                    { x: OX(2 + 2 * Math.SQRT2), label: '4.83', dot: true },
                  ]}
                />
                <text x={215} y={312} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.7) / 0.25)}>
                  {t.u1SurdSub}
                </text>
              </g>
            )
          })()}

        {/* ─── p15 · tool 3 — read the graph ─── */}
        {flags.graphTool && (
          <g>
            <QuadFig u={clamp01((u - 0.05) / 0.6)} roots />
            <g opacity={clamp01((u - 0.6) / 0.3)}>
              <text x={50} y={162} textAnchor="middle" fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                −0.83
              </text>
              <text x={391} y={162} textAnchor="middle" fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                4.83
              </text>
            </g>
            <g className="idx-pulse" opacity={clamp01((u - 0.75) / 0.25)}>
              <text x={215} y={312} textAnchor="middle" fontSize={15.5} fill={OK} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                ✓ {t.u1GraphSub}
              </text>
            </g>
          </g>
        )}

        {/* ─── p16 · Δ = 32 > 0 ─── */}
        {flags.disc &&
          (() => {
            const card = clamp01((u - 0.05) / 0.35)
            const res = clamp01((u - 0.5) / 0.3)
            return (
              <g>
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={40} y={115} w={350} h={90} />
                  <circle cx={77} cy={160} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
                  <text x={77} y={166} textAnchor="middle" fontSize={16} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    Δ
                  </text>
                  <Tex x={238} y={152} size={16} parts={[{ t: 'Δ = (−4)² − 4(1)(−4)' }]} />
                  <Tex x={238} y={184} size={17} parts={[{ t: '= 16 + 16 = ' }, { t: '32', fill: GOLD }]} />
                </g>
                <g className="idx-pulse" opacity={res}>
                  <Tex x={215} y={262} size={24} parts={[{ t: '32 > 0 → ' }, { t: '×2 real roots', fill: GOLD }]} />
                </g>
                <text x={215} y={312} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.8) / 0.2)}>
                  {t.u1DiscSub}
                </text>
              </g>
            )
          })()}

        {/* ─── p17 · the three Δ cases ─── */}
        {flags.three &&
          (() => {
            return (
              <g>
                {PANEL_X.map((px, i) => (
                  <g key={px}>
                    <rect x={px} y={100} width={118} height={150} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(242,245,255,0.18)" strokeWidth={1.2} opacity={clamp01((u - i * 0.12) / 0.3)} />
                    <MiniPara u={clamp01((u - 0.1 - i * 0.12) / 0.35)} k={[-4, 4, 5][i]} panel={px} />
                    <text x={px + 59} y={88} textAnchor="middle" fontSize={13} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - i * 0.12) / 0.3)}>
                      c = {[-4, 4, 5][i]}
                    </text>
                    <text x={px + 59} y={272} textAnchor="middle" fontSize={13.5} fill={[GOLD, INK, RED][i]} fontFamily="'Fraunces', Georgia, serif" fontWeight={600} opacity={clamp01((u - 0.4 - i * 0.12) / 0.3)}>
                      {['Δ = 32 > 0', 'Δ = 0', 'Δ = −4 < 0'][i]}
                    </text>
                  </g>
                ))}
              </g>
            )
          })()}

        {/* ─── p18 · Δ < 0 — two nonreal roots ─── */}
        {flags.complex &&
          (() => {
            const fig = clamp01((u - 0.05) / 0.5)
            const gap = clamp01((u - 0.5) / 0.25)
            const res = clamp01((u - 0.7) / 0.25)
            return (
              <g>
                <QuadFig u={fig} c={5} x0={-0.5} x1={4.5} />
                <g opacity={gap}>
                  <line x1={OX(2)} y1={OY(1)} x2={OX(2)} y2={OY(0)} stroke={PINK} strokeWidth={2} />
                  <text x={OX(2) + 10} y={(OY(1) + OY(0)) / 2 + 4} fontSize={12.5} fill={PINK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    √(−4)
                  </text>
                </g>
                <Tex x={215} y={290} size={15} parts={[{ t: 'x = (4 ± √(−4))/2' }]} opacity={0.55 * gap} />
                <g className="idx-pulse" opacity={res}>
                  <Tex x={215} y={318} size={21} parts={[{ t: 'x = 2 ± i', fill: PINK }]} />
                </g>
              </g>
            )
          })()}

        {/* ─── p19 · the roots land on −b/a and c/a ─── */}
        {flags.roots &&
          (() => {
            const src = clamp01(u / 0.3)
            const l = clamp01((u - 0.25) / 0.3)
            const r = clamp01((u - 0.5) / 0.3)
            return (
              <g>
                <text x={215} y={95} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={0.7 * src}>
                  α = (4+√32)/2 · β = (4−√32)/2
                </text>
                <g opacity={l} transform={`translate(0, ${(1 - l) * 14})`}>
                  <Card x={30} y={125} w={172} h={104} />
                  <text x={116} y={152} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                    α + β
                  </text>
                  <text x={116} y={184} textAnchor="middle" fontSize={24} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    = 4
                  </text>
                  <Tex x={116} y={212} size={13.5} parts={[{ t: '= −b/a ', fill: INK }, { t: '✓', fill: OK }]} />
                </g>
                <g opacity={r} transform={`translate(0, ${(1 - r) * 14})`}>
                  <Card x={228} y={125} w={172} h={104} />
                  <text x={314} y={152} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                    αβ
                  </text>
                  <text x={314} y={184} textAnchor="middle" fontSize={24} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    = −4
                  </text>
                  <Tex x={314} y={212} size={13.5} parts={[{ t: '= c/a ', fill: INK }, { t: '✓', fill: OK }]} />
                </g>
                <text x={215} y={312} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.8) / 0.2)}>
                  {t.u1RootsSub}
                </text>
              </g>
            )
          })()}

        {/* ─── p20 · interactive gate: pin down k ─── */}
        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <Tex x={215} y={70} size={18} parts={[{ t: 'x² − 4x + k = 0' }]} opacity={0.75} />
            <g className="idx-pulse">
              <text x={215} y={150} textAnchor="middle" fontSize={30} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                {t.u1GatePulse}
              </text>
            </g>
            {!narrow && chips(true)}
            {!narrow &&
              (solved ? (
                <Tex x={215} y={314} size={16} parts={[{ t: 'Δ = 16 − 4k > 0 → ' }, { t: 'k < 4', fill: OK }, { t: '  ✓', fill: OK }]} />
              ) : wrongId ? (
                <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                  {wrongId === 'B' ? t.u1WhyB : wrongId === 'C' ? t.u1WhyC : t.u1WhyD}
                </text>
              ) : (
                <text x={215} y={314} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                  {t.indexHint}
                </text>
              ))}
          </g>
        )}

        {/* ─── p21 · the slick way — build the equation from the roots ─── */}
        {flags.slick &&
          (() => {
            const src = clamp01(u / 0.3)
            const law = clamp01((u - 0.3) / 0.35)
            const res = clamp01((u - 0.6) / 0.3)
            return (
              <g>
                <text x={215} y={95} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={0.7 * src}>
                  α = (4+√32)/2 · β = (4−√32)/2
                </text>
                <g opacity={law} transform={`translate(0, ${(1 - law) * 14})`}>
                  <Card x={70} y={125} w={290} h={64} />
                  <Tex x={215} y={164} size={19} parts={[{ t: 'x² − (' }, { t: 'α', it: true }, { t: ' + ' }, { t: 'β', it: true }, { t: ')x + ' }, { t: 'αβ', it: true }, { t: ' = 0' }]} />
                </g>
                <g opacity={clamp01((u - 0.55) / 0.2)}>
                  <line x1={215} y1={196} x2={215} y2={222} stroke={LINE} strokeWidth={1.4} />
                  <path d="M 210 216 L 215 226 L 220 216" fill="none" stroke={LINE} strokeWidth={1.4} />
                </g>
                <g opacity={res} transform={`translate(0, ${(1 - res) * 14})`}>
                  <Card x={70} y={240} w={290} h={58} stroke={OK} />
                  <Tex x={215} y={277} size={21} parts={[{ t: 'x² − 4x − 4 = 0', fill: OK }]} />
                </g>
              </g>
            )
          })()}

        {/* ─── p22 · the unit on one page ─── */}
        {flags.answer && (
          <g>
            <g className="idx-pulse" opacity={clamp01((u - 0.1) / 0.35)}>
              <Tex x={215} y={130} size={30} parts={[{ t: 'x = ' }, { t: '(4 ± √32)/2', fill: GOLD }]} />
            </g>
            <text x={215} y={172} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.45) / 0.3)}>
              ≈ −0.83 · 4.83
            </text>
            <text x={215} y={240} textAnchor="middle" fontSize={19} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
              3 tools · 1 Δ · 2 relations ✓
            </text>
          </g>
        )}

        {/* ─── p23 · check — slide k ─── */}
        {flags.verify &&
          (() => {
            const rows = [clamp01((u - 0.05) / 0.3), clamp01((u - 0.3) / 0.3), clamp01((u - 0.55) / 0.3)]
            const fin = clamp01((u - 0.8) / 0.2)
            const lines = [
              { k: 'k = 3', d: 'Δ = 16 − 12 = 4 > 0', mark: '✓', fill: OK },
              { k: 'k = 4', d: 'Δ = 16 − 16 = 0', mark: '·', fill: INK },
              { k: 'k = 5', d: 'Δ = 16 − 20 = −4 < 0', mark: '✗', fill: RED },
            ]
            return (
              <g>
                {lines.map((ln, i) => (
                  <g key={ln.k} opacity={rows[i]} transform={`translate(0, ${(1 - rows[i]) * 14})`}>
                    <rect x={40} y={104 + i * 54} width={350} height={44} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(242,245,255,0.18)" strokeWidth={1.2} />
                    <text x={62} y={132 + i * 54} fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                      {ln.k}
                    </text>
                    <text x={150} y={132 + i * 54} fontSize={15} fill={INK} fontFamily="'Fraunces', Georgia, serif">
                      {ln.d}
                    </text>
                    <text x={368} y={132 + i * 54} textAnchor="end" fontSize={15} fill={ln.fill} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                      {ln.mark}
                    </text>
                  </g>
                ))}
                <text x={215} y={312} textAnchor="middle" fontSize={14.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={fin}>
                  {t.u1VerifySub}
                </text>
              </g>
            )
          })()}

        {/* ─── p24 · guide ─── */}
        {flags.guide &&
          GUIDE_STEPS.map((step, i) => {
            const ui = clamp01((u - i * 0.14) / 0.4)
            const y = 42 + i * 52 + (1 - ui) * 16
            return (
              <g key={step.n} opacity={ui}>
                <rect x={18} y={y} width={394} height={46} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(242,245,255,0.18)" strokeWidth={1.2} />
                <circle cx={42} cy={y + 23} r={12} fill={i === 4 ? OK : GOLD} fillOpacity={0.2} stroke={i === 4 ? OK : GOLD} strokeWidth={1.3} />
                <text x={42} y={y + 27} textAnchor="middle" fontSize={12} fill={i === 4 ? OK : GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                  {step.n === '0' ? 'Q' : step.n}
                </text>
                <text x={64} y={y + 18} fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                  {t[step.lawKey]}
                </text>
                <Tex x={64} y={y + 38} size={15} parts={step.line} anchor="start" />
              </g>
            )
          })}
      </svg>
      )}
      {narrow && flags.gate && <p className="mcq-pulse">{t.u1GatePulse}</p>}
      {narrow && flags.question && <QuestionCard a={t.u1QTextA} b={t.u1QTextB} />}
      {narrow && flags.gate && (
        <McqCards
          options={OPTIONS}
          answer={ANSWER}
          solved={solved}
          wrongId={wrongId}
          onPick={pick}
          tone={solved ? 'ok' : wrongId ? 'bad' : 'muted'}
          feedback={
            solved
              ? 'Δ = 16 − 4k > 0 → k < 4 ✓'
              : wrongId
                ? wrongId === 'B'
                  ? t.u1WhyB
                  : wrongId === 'C'
                    ? t.u1WhyC
                    : t.u1WhyD
                : t.indexHint
          }
        />
      )}
    </div>
  )
}
