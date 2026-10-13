import { useEffect, useRef, useState } from 'react'
import type { CircleLineLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { beep, clamp01, easeOutCubic } from './labMotion'
import { McqCards, QuestionCard, useNarrow } from './NarrowBlocks'

const GOLD = '#ffd166'
const BLUE = '#4cc9f0'
const RED = '#ff6b7a'
const OK = '#b8f27c'
const INK = '#f2f5ff'
const MUTED = 'rgba(242, 245, 255, 0.55)'
const LINE = 'rgba(242, 245, 255, 0.72)'

/** rAF progress 0→1 (eased), restarts whenever `key` changes. */
function useFly(key: string, dur = 1900) {
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

type Part = { t: string; sup?: boolean; sub?: boolean; fill?: string; it?: boolean }

/** One-line math-ish text built from tspans (sup/sub shift, then back). */
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
  let prev = 0
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
        const lv = p.sup ? 1 : p.sub ? -1 : 0
        const dy =
          lv === 1
            ? -size * 0.45
            : lv === -1
              ? size * 0.16
              : prev === 1
                ? size * 0.45
                : prev === -1
                  ? -size * 0.16
                  : 0
        prev = lv
        return (
          <tspan
            key={i}
            dy={dy}
            fontSize={lv === 0 ? size : size * 0.62}
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

function Card({ x, y, w = 96, h = 58, op = 1 }: { x: number; y: number; w?: number; h?: number; op?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={12}
      fill="rgba(255, 255, 255, 0.05)"
      stroke={LINE}
      strokeWidth={1.6}
      opacity={op}
    />
  )
}

/* ---- world → px (430 × 330 viewBox): x-axis at y=295, 13.5 px per unit ---- */
const OX = 80
const OY = 295
const S = 13.5
const px = (x: number) => OX + S * x
const py = (y: number) => OY - S * y
const CX = px(6)
const CY = py(10)
const R = 10 * S

/** axes + labels */
function Axes({ u }: { u: number }) {
  return (
    <g opacity={clamp01(u / 0.3)}>
      <line x1={25} y1={OY} x2={412} y2={OY} stroke={LINE} strokeWidth={1.5} />
      <line x1={OX} y1={18} x2={OX} y2={318} stroke={LINE} strokeWidth={1.5} />
      <text x={418} y={OY + 5} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
        x
      </text>
      <text x={OX + 8} y={26} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
        y
      </text>
      <text x={OX - 10} y={OY + 16} fontSize={12} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
        O
      </text>
    </g>
  )
}

/** the circle C(6, 10) r=10, with optional: tangent mark, radius, line L (k=12 sample), chord A/B, perpendicular, mid-point M */
function CircleFig({
  u,
  showT,
  showR,
  showLine,
  showChord,
  showPerp,
  showMid,
}: {
  u: number
  showT?: boolean
  showR?: boolean
  showLine?: boolean
  showChord?: boolean
  showPerp?: boolean
  showMid?: boolean
}) {
  const base = clamp01(u / 0.35)
  const tu = clamp01((u - 0.3) / 0.3)
  const ru = clamp01((u - 0.45) / 0.3)
  const lu = clamp01((u - 0.5) / 0.3)
  const cu = clamp01((u - 0.65) / 0.3)
  const mu = clamp01((u - 0.8) / 0.2)
  // sample k = 12: L from world (−2, 14) to (13, −1.5); chord A(−2.78, 14.78) B(10.78, 1.22); M(4, 8)
  return (
    <g>
      <g opacity={base}>
        <Axes u={u} />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={LINE} strokeWidth={1.7} />
        <circle cx={CX} cy={CY} r={3.5} fill={BLUE} />
        <text x={CX + 9} y={CY - 8} fontSize={12.5} fill={BLUE} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
          C (6, 10)
        </text>
      </g>
      {showT && (
        <g opacity={tu}>
          <circle cx={CX} cy={OY} r={3.5} fill={GOLD} />
          <path d={`M ${CX + 13} ${OY} L ${CX + 13} ${OY - 13} L ${CX} ${OY - 13}`} fill="none" stroke={GOLD} strokeWidth={1.2} />
        </g>
      )}
      {showR && (
        <g opacity={ru}>
          <line x1={CX} y1={CY} x2={CX} y2={OY} stroke={BLUE} strokeWidth={1.8} />
          <text x={CX + 9} y={CY + R / 2 + 5} fontSize={13} fill={BLUE} fontWeight={600} fontFamily="'Fraunces', Georgia, serif">
            r = 10
          </text>
        </g>
      )}
      {showLine && (
        <g opacity={lu}>
          <line x1={px(-2)} y1={py(14)} x2={px(13)} y2={py(-1.5)} stroke={GOLD} strokeWidth={1.8} />
          <text x={268} y={118} fontSize={12.5} fill={GOLD} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
            L : x + y = k
          </text>
        </g>
      )}
      {showChord && (
        <g opacity={cu}>
          <circle cx={px(-2.78)} cy={py(14.78)} r={4} fill={GOLD} />
          <circle cx={px(10.78)} cy={py(1.22)} r={4} fill={GOLD} />
          <text x={px(-2.78) - 10} y={py(14.78) - 6} fontSize={13} fill={INK} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
            A
          </text>
          <text x={px(10.78) + 9} y={py(1.22) + 7} fontSize={13} fill={INK} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
            B
          </text>
        </g>
      )}
      {showPerp && (
        <g opacity={cu}>
          <line x1={px(-2)} y1={py(2)} x2={px(13)} y2={py(17)} stroke={BLUE} strokeWidth={1.4} strokeDasharray="5 4" />
          <text x={248} y={72} fontSize={12.5} fill={BLUE} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
            y = x + 4
          </text>
        </g>
      )}
      {showMid && (
        <g opacity={mu}>
          <circle cx={px(4)} cy={py(8)} r={4.5} fill={OK} />
          <text x={px(4) - 10} y={py(8) - 8} fontSize={13.5} fill={OK} fontWeight={700} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
            M
          </text>
        </g>
      )}
    </g>
  )
}

/* ---- pulse lines ---- */
const WHAT_A: Part[] = [
  { t: '(a)   ', fill: MUTED },
  { t: 'C', it: true, fill: GOLD },
  { t: ' = ?', fill: GOLD },
]
const WHAT_B: Part[] = [
  { t: '(b)   ', fill: MUTED },
  { t: 'M', it: true, fill: GOLD },
  { t: ' = ?', fill: GOLD },
]

/* ---- step cards ---- */
const EQ_SRC: Part[] = [{ t: 'r = distance from (6, 10) to the x-axis' }]
const EQ_CARD: Part[] = [
  { t: '(x − 6)', },
  { t: '2', sup: true },
  { t: ' + (y − 10)' },
  { t: '2', sup: true },
  { t: ' = 100', fill: GOLD },
]
const SUB_SRC: Part[] = [{ t: 'L : y = −x + k  →  x = k − y' }]
const SUB_CARD: Part[] = [
  { t: '2y' },
  { t: '2', sup: true },
  { t: ' − (2k + 8)y + (k − 6)' },
  { t: '2', sup: true },
  { t: ' = 0', fill: GOLD },
]
const ROOTS_SRC: Part[] = [{ t: 'A, B sit on L → their y are the two roots' }]
const ROOTS_SRC2: Part[] = [{ t: 'y', it: true }, { t: '1', sub: true }, { t: ' + y', it: true }, { t: '2', sub: true }, { t: ' = k + 4' }]
const ROOTS_CARD: Part[] = [{ t: 'mid y = ', fill: INK }, { t: '(k + 4) / 2', fill: GOLD }]
const MIDX_SRC: Part[] = [{ t: 'x', it: true }, { t: '1', sub: true }, { t: ' + x', it: true }, { t: '2', sub: true }, { t: ' = 2k − (k + 4) = k − 4' }]
const MIDX_CARD: Part[] = [{ t: 'mid x = ', fill: INK }, { t: '(k − 4) / 2', fill: GOLD }]
const VERIFY_TOP: Part[] = [
  { t: 'k = 6 → L : x + y = 6 · M = (1, 5)', fill: INK },
]

/* ---- gate ---- */
const CHIP_W = 202
const CHIP_H = 56
const CHIP_X = [8, 220]
const CHIP_Y = [150, 216]

type ChipDef = { id: string; val: string }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: '( (k−4)/2 , (k+4)/2 )' },
  { id: 'B', val: '( (k+4)/2 , (k−4)/2 )' },
  { id: 'C', val: '( k−4 , k+4 )' },
  { id: 'D', val: '( (k−6)/2 , (k−10)/2 )' },
]
const ANSWER = 'A'

export function CircleLineLab({ mode, onInteractComplete }: CircleLineLabProps) {
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
    givenC: mode === 'givenC',
    givenTan: mode === 'givenTan',
    whatA: mode === 'whatA',
    whatB: mode === 'whatB',
    whyEq: mode === 'whyEq',
    sub: mode === 'sub',
    roots: mode === 'roots',
    midx: mode === 'midx',
    gate: mode === 'gate',
    slick: mode === 'slick',
    answer: mode === 'answer',
    verify: mode === 'verify',
    guide: mode === 'guide',
  }

  const chips = (live: boolean) =>
    OPTIONS.map((o, idx) => {
      const isAns = o.id === ANSWER
      const ci = CHIP_X[idx % 2]
      const cj = CHIP_Y[Math.floor(idx / 2)]
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
          <rect className="idx-chip-bg" x={ci} y={cj} width={CHIP_W} height={CHIP_H} rx={14} />
          <text x={ci + 12} y={cj + 16} fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
            {o.id}
          </text>
          <text x={ci + CHIP_W / 2} y={cj + 36} textAnchor="middle" fontSize={14} fill={isAns && solved ? GOLD : INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
            {o.val}
          </text>
          {solved && isAns && (
            <g>
              <circle cx={ci + CHIP_W - 14} cy={cj + 14} r={9} fill={OK} />
              <text x={ci + CHIP_W - 14} y={cj + 18.5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0b1020">
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
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="circle C centred at (6, 10) tangent to the x-axis; the line y = −x + k cuts it at A and B, and the mid-point of AB is the foot of the perpendicular from the centre">
        {/* ─── p0 · the figure ─── */}
        {flags.figure && <CircleFig u={clamp01(u / 0.9)} showT />}

        {/* ─── p1 · the question, in our own words (desktop SVG text) ─── */}
        {flags.question && (
          <g>
            {t.q17QTextA.split('\n').map((ln, i) => (
              <text key={`qa${i}`} x={40} y={72 + i * 30} fontSize={13.5} fill={INK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.05 * i) / 0.22)}>
                {ln}
              </text>
            ))}
            {t.q17QTextB.split('\n').map((ln, i) => (
              <text key={`qb${i}`} x={40} y={200 + i * 30} fontSize={13.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600} opacity={clamp01((u - 0.2 - 0.05 * i) / 0.22)}>
                {ln}
              </text>
            ))}
          </g>
        )}

        {/* ─── p2 · Given 1: the centre ─── */}
        {flags.givenC && (
          <g>
            <CircleFig u={clamp01((u - 0.05) / 0.8)} />
            <g className="idx-pulse" opacity={clamp01((u - 0.6) / 0.25)}>
              <text x={215} y={322} textAnchor="middle" fontSize={17} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                r = ?
              </text>
            </g>
          </g>
        )}

        {/* ─── p3 · Given 2: tangent → r = 10 ─── */}
        {flags.givenTan && (
          <g>
            <CircleFig u={clamp01((u - 0.05) / 0.9)} showT showR />
          </g>
        )}

        {/* ─── p4/p5 · what is asked ─── */}
        {(flags.whatA || flags.whatB) && (
          <g>
            <g className="idx-pulse" opacity={clamp01(u / 0.35)}>
              <Tex x={215} y={158} size={30} parts={flags.whatA ? WHAT_A : WHAT_B} />
            </g>
            <text x={215} y={212} textAnchor="middle" fontSize={13.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.35) / 0.3)}>
              {flags.whatA ? t.q17WhatSubA : t.q17WhatSubB}
            </text>
          </g>
        )}

        {/* ─── p6 · why r = 10 → equation ─── */}
        {flags.whyEq && (
          <g>
            <Tex x={215} y={80} size={15} parts={EQ_SRC} opacity={0.55 * clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.25) / 0.25)}>
              <line x1={215} y1={95} x2={215} y2={125} stroke={LINE} strokeWidth={1.4} />
              <path d="M 210 119 L 215 129 L 220 119" fill="none" stroke={LINE} strokeWidth={1.4} />
            </g>
            <g opacity={clamp01((u - 0.4) / 0.35)} transform={`translate(0, ${(1 - clamp01((u - 0.4) / 0.35)) * 14})`}>
              <Card x={40} y={140} w={350} h={84} />
              <circle cx={77} cy={182} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
              <text x={77} y={187} textAnchor="middle" fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                a
              </text>
              <Tex x={225} y={190} size={21} parts={EQ_CARD} />
            </g>
            <g className="idx-pulse" opacity={clamp01((u - 0.8) / 0.2)}>
              <text x={215} y={262} textAnchor="middle" fontSize={15} fill={OK} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                (a) ✓
              </text>
            </g>
          </g>
        )}

        {/* ─── p7 · substitute the line ─── */}
        {flags.sub && (
          <g>
            <Tex x={215} y={80} size={15} parts={SUB_SRC} opacity={0.55 * clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.25) / 0.25)}>
              <line x1={215} y1={95} x2={215} y2={125} stroke={LINE} strokeWidth={1.4} />
              <path d="M 210 119 L 215 129 L 220 119" fill="none" stroke={LINE} strokeWidth={1.4} />
            </g>
            <g opacity={clamp01((u - 0.4) / 0.35)} transform={`translate(0, ${(1 - clamp01((u - 0.4) / 0.35)) * 14})`}>
              <Card x={28} y={140} w={374} h={84} />
              <circle cx={65} cy={182} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
              <text x={65} y={187} textAnchor="middle" fontSize={14} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                b1
              </text>
              <Tex x={227} y={190} size={19} parts={SUB_CARD} />
            </g>
            <g className="idx-pulse" opacity={clamp01((u - 0.8) / 0.2)}>
              <text x={215} y={262} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                quadratic in y
              </text>
            </g>
          </g>
        )}

        {/* ─── p8 · sum of the roots ─── */}
        {flags.roots && (
          <g>
            <Tex x={215} y={80} size={15} parts={ROOTS_SRC} opacity={0.55 * clamp01(u / 0.3)} />
            <Tex x={215} y={125} size={18} parts={ROOTS_SRC2} opacity={clamp01((u - 0.25) / 0.3)} />
            <g opacity={clamp01((u - 0.45) / 0.35)} transform={`translate(0, ${(1 - clamp01((u - 0.45) / 0.35)) * 14})`}>
              <Card x={70} y={150} w={290} h={76} />
              <Tex x={215} y={196} size={21} parts={ROOTS_CARD} />
            </g>
          </g>
        )}

        {/* ─── p9 · back to x ─── */}
        {flags.midx && (
          <g>
            <Tex x={215} y={80} size={15} parts={MIDX_SRC} opacity={0.55 * clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.3) / 0.35)} transform={`translate(0, ${(1 - clamp01((u - 0.3) / 0.35)) * 14})`}>
              <Card x={70} y={120} w={290} h={76} />
              <Tex x={215} y={166} size={21} parts={MIDX_CARD} />
            </g>
            <Tex x={215} y={248} size={17} opacity={clamp01((u - 0.65) / 0.3)} parts={[{ t: 'M = ( ', fill: INK }, { t: '(k−4)/2', fill: GOLD }, { t: ' , ' }, { t: '(k+4)/2', fill: GOLD }, { t: ' )', fill: INK }]} />
          </g>
        )}

        {/* ─── p10 · gate (desktop SVG chips) ─── */}
        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <g className="idx-pulse">
              <text x={215} y={110} textAnchor="middle" fontSize={26} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                {t.q17GatePulse}
              </text>
            </g>
            {!narrow && chips(true)}
            {!narrow &&
              (solved ? (
                <Tex x={215} y={314} size={16} parts={[{ t: 'mid x = (k−4)/2 · mid y = (k+4)/2 ', fill: INK }, { t: ' ✓', fill: OK }]} />
              ) : wrongId ? (
                <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                  {wrongId === 'B' ? t.q17WhyB : wrongId === 'C' ? t.q17WhyC : t.q17WhyD}
                </text>
              ) : (
                <text x={215} y={314} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                  {t.indexHint}
                </text>
              ))}
          </g>
        )}

        {/* ─── p11 · the slick way ─── */}
        {flags.slick && (
          <g>
            <CircleFig u={clamp01((u - 0.05) / 0.95)} showLine showChord showPerp showMid />
          </g>
        )}

        {/* ─── p12 · answer ─── */}
        {flags.answer && (
          <g>
            <circle cx={215} cy={130} r={58} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.5 * clamp01((u - 0.1) / 0.35)} />
            <text x={215} y={138} textAnchor="middle" fontSize={22} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.1) / 0.35)}>
              M
            </text>
            <Tex x={215} y={230} size={21} opacity={clamp01((u - 0.45) / 0.3)} parts={[{ t: '( ', fill: INK }, { t: '(k−4)/2', fill: GOLD }, { t: ' , ' }, { t: '(k+4)/2', fill: GOLD }, { t: ' )', fill: INK }]} />
            <Tex x={215} y={272} size={15} opacity={clamp01((u - 0.7) / 0.25)} parts={[{ t: '(a) (x−6)', fill: MUTED }, { t: '2', sup: true, fill: MUTED }, { t: ' + (y−10)', fill: MUTED }, { t: '2', sup: true, fill: MUTED }, { t: ' = 100', fill: MUTED }]} />
            <text x={215} y={308} textAnchor="middle" fontSize={22} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.85) / 0.15)}>
              → 7 / 7 ✓
            </text>
          </g>
        )}

        {/* ─── p13 · verify with k = 6 ─── */}
        {flags.verify && (
          <g>
            <Tex x={215} y={90} size={17} parts={VERIFY_TOP} opacity={clamp01(u / 0.3)} />
            {(() => {
              const c1 = clamp01((u - 0.25) / 0.3)
              const c2 = clamp01((u - 0.55) / 0.3)
              return (
                <g>
                  <g opacity={c1} transform={`translate(0, ${(1 - c1) * 14})`}>
                    <Card x={40} y={120} w={350} h={64} />
                    <text x={215} y={159} textAnchor="middle" fontSize={15.5} fill={INK} fontFamily="'Fraunces', Georgia, serif">
                      1 + 5 = 6 ✓ <tspan fill={MUTED}>— M lies on L</tspan>
                    </text>
                  </g>
                  <g opacity={c2} transform={`translate(0, ${(1 - c2) * 14})`}>
                    <Card x={40} y={200} w={350} h={64} />
                    <text x={215} y={239} textAnchor="middle" fontSize={15.5} fill={INK} fontFamily="'Fraunces', Georgia, serif">
                      (10−5)/(6−1) = 1 ✓ <tspan fill={MUTED}>— ⊥ slope of L (−1)</tspan>
                    </text>
                  </g>
                  <g className="idx-pulse" opacity={clamp01((u - 0.85) / 0.15)}>
                    <text x={215} y={308} textAnchor="middle" fontSize={17} fill={OK} fontWeight={700} fontFamily="'Fraunces', Georgia, serif">
                      ✓✓
                    </text>
                  </g>
                </g>
              )
            })()}
          </g>
        )}

        {/* ─── p14 · guide ─── */}
        {flags.guide &&
          [
            { lawKey: 'q17GuideLaw0' as const, line: [{ t: 'centre (6, 10) · x-axis tangent · r = 10' }] },
            { lawKey: 'q17GuideLaw1' as const, line: [{ t: '(a) (x−6)', }, { t: '2', sup: true }, { t: ' + (y−10)' }, { t: '2', sup: true }, { t: ' = 100', fill: GOLD }] },
            { lawKey: 'q17GuideLaw2' as const, line: [{ t: '(b) 2y', }, { t: '2', sup: true }, { t: ' − (2k+8)y + (k−6)' }, { t: '2', sup: true }, { t: ' = 0', fill: GOLD }] },
            { lawKey: 'q17GuideLaw3' as const, line: [{ t: 'y₁+y₂ = k+4 · x₁+x₂ = k−4', fill: GOLD }] },
            { lawKey: 'q17GuideLaw4' as const, line: [{ t: 'M = ((k−4)/2 , (k+4)/2) ✓', fill: OK }] },
          ].map((step, i) => {
            const ui = clamp01((u - i * 0.14) / 0.4)
            const y = 42 + i * 52 + (1 - ui) * 16
            return (
              <g key={i} opacity={ui}>
                <rect x={18} y={y} width={394} height={46} rx={12} fill="rgba(255,255,255,0.04)" stroke="rgba(242,245,255,0.18)" strokeWidth={1.2} />
                <circle cx={42} cy={y + 23} r={12} fill={i === 4 ? OK : GOLD} fillOpacity={0.2} stroke={i === 4 ? OK : GOLD} strokeWidth={1.3} />
                <text x={42} y={y + 27} textAnchor="middle" fontSize={12} fill={i === 4 ? OK : GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                  {i === 0 ? 'Q' : i}
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
      {narrow && flags.gate && <p className="mcq-pulse">{t.q17GatePulse}</p>}
      {narrow && flags.question && <QuestionCard a={t.q17QTextA} b={t.q17QTextB} />}
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
              ? 'mid x = (k−4)/2 · mid y = (k+4)/2 ✓'
              : wrongId
                ? wrongId === 'B'
                  ? t.q17WhyB
                  : wrongId === 'C'
                    ? t.q17WhyC
                    : t.q17WhyD
                : t.indexHint
          }
        />
      )}
    </div>
  )
}
