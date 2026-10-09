import { useEffect, useRef, useState } from 'react'
import type { ParabolaSignLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { beep, clamp01, easeOutCubic, lerp } from './labMotion'

const GOLD = '#ffd166'
const BLUE = '#4cc9f0'
const RED = '#ff6b7a'
const OK = '#b8f27c'
const INK = '#f2f5ff'
const MUTED = 'rgba(242, 245, 255, 0.55)'
const LINE = 'rgba(242, 245, 255, 0.72)'

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

/** Floating formula badge — the formula always leads the scene. */
function FormulaBadge({
  label,
  formula,
  u,
  y = 18,
  color = GOLD,
}: {
  label: string
  formula: string
  u: number
  y?: number
  color?: string
}) {
  const op = clamp01(u / 0.35)
  return (
    <g opacity={op} transform={`translate(0, ${lerp(-8, 0, op)})`}>
      <rect x={48} y={y} width={334} height={36} rx={18} fill="rgba(255, 209, 102, 0.1)" stroke={color} strokeWidth={1.4} />
      <text x={70} y={y + 23} fontSize={12} fill={color} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
        {label}
      </text>
      <text x={215} y={y + 24} textAnchor="middle" fontSize={15} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
        {formula}
      </text>
    </g>
  )
}

/* ---- the question's figure, reused on ask / readA / readB ---- */
/** axes + y = a(x+b)² opening down, vertex on the positive x-axis */
function QuestionFigure({ u, start = 0, axisTop = 50 }: { u: number; start?: number; axisTop?: number }) {
  const ax = clamp01((u - start) / 0.3)
  const cu = clamp01((u - start - 0.15) / 0.35)
  // draw-on effect for the curve
  const pathLen = 700
  return (
    <g>
      <g opacity={ax}>
        <line x1={50} y1={170} x2={404} y2={170} stroke={LINE} strokeWidth={1.4} />
        <line x1={110} y1={290} x2={110} y2={axisTop} stroke={LINE} strokeWidth={1.4} />
        <path d="M 398 165 L 408 170 L 398 175" fill="none" stroke={LINE} strokeWidth={1.4} />
        <path d={`M 105 ${axisTop + 10} L 110 ${axisTop} L 115 ${axisTop + 10}`} fill="none" stroke={LINE} strokeWidth={1.4} />
        <text x={413} y={175} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
          x
        </text>
        <text x={122} y={axisTop + 10} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
          y
        </text>
        <text x={99} y={184} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
          O
        </text>
      </g>
      <path
        d="M 100 300 Q 230 40 360 300"
        fill="none"
        stroke={GOLD}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen * (1 - cu)}
        opacity={clamp01(cu * 3)}
      />
    </g>
  )
}

/* ---- pieces of y = a(x + b)² ---- */
const EQ_PARTS: Part[] = [
  { t: 'y', it: true },
  { t: ' = ' },
  { t: 'a', it: true },
  { t: '(' },
  { t: 'x', it: true },
  { t: ' + ' },
  { t: 'b', it: true },
  { t: ')²' },
]

const AB_EQ: Part[] = [
  { t: 'a = ' },
  { t: '−1', fill: GOLD },
  { t: ',   ' },
  { t: 'b = ' },
  { t: '−2', fill: GOLD },
]

const CHIP_W = 92
const CHIP_H = 64
const CHIP_Y = 205
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; a: string; b: string }
const OPTIONS: ChipDef[] = [
  { id: 'A', a: 'a > 0', b: 'b > 0' },
  { id: 'B', a: 'a > 0', b: 'b < 0' },
  { id: 'C', a: 'a < 0', b: 'b > 0' },
  { id: 'D', a: 'a < 0', b: 'b < 0' },
]
const ANSWER = 'D'

type GuideStep = {
  n: string
  lawKey: 'd6GuideLaw0' | 'd6GuideLaw1' | 'd6GuideLaw2' | 'd6GuideLaw3' | 'd6GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'd6GuideLaw0',
    line: EQ_PARTS,
  },
  {
    n: '1',
    lawKey: 'd6GuideLaw1',
    line: [{ t: '↓  →  ' }, { t: 'a < 0', fill: GOLD }],
  },
  {
    n: '2',
    lawKey: 'd6GuideLaw2',
    line: [{ t: 'x = −b > 0  →  ' }, { t: 'b < 0', fill: GOLD }],
  },
  {
    n: '3',
    lawKey: 'd6GuideLaw3',
    line: [{ t: 'a < 0 · b < 0  →  ' }, { t: 'D', fill: GOLD }],
  },
  {
    n: '4',
    lawKey: 'd6GuideLaw4',
    line: [{ t: 'a = −1, b = −2  →  ' }, { t: 'D ✓', fill: OK }],
  },
]

export function ParabolaSignLab({ mode, onInteractComplete }: ParabolaSignLabProps) {
  const { t } = useI18n()
  const u = useFly(mode, mode === 'guide' ? 1400 : 950)
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

  /* one scene = one message */
  const flags = {
    ask: mode === 'ask',
    why: mode === 'why',
    readA: mode === 'readA',
    readB: mode === 'readB',
    flip: mode === 'flip',
    gate: mode === 'gate',
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
          <text x={ci + 13} y={CHIP_Y + 18} fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
            {o.id}
          </text>
          <text x={ci + CHIP_W / 2} y={CHIP_Y + 38} textAnchor="middle" fontSize={14} fill={isAns && solved ? GOLD : INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
            {o.a}
          </text>
          <text x={ci + CHIP_W / 2} y={CHIP_Y + 56} textAnchor="middle" fontSize={14} fill={isAns && solved ? GOLD : INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
            {o.b}
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
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Parabola y = a(x+b)²: read the sign of a from the opening, the sign of b from the vertex at x = −b">
        {flags.ask && (
          <g>
            <FormulaBadge label="Q6" formula={t.d6AskBadge} u={u} />
            <Tex x={215} y={82} size={19} parts={EQ_PARTS} opacity={clamp01(u / 0.3)} />
            <QuestionFigure u={u} start={0.15} axisTop={98} />
            <g className="idx-pulse" opacity={clamp01((u - 0.55) / 0.25)}>
              <Tex
                x={318}
                y={140}
                size={22}
                parts={[
                  { t: 'a', it: true, fill: GOLD },
                  { t: ' = ? ,  ', fill: GOLD },
                  { t: 'b', it: true, fill: GOLD },
                  { t: ' = ?', fill: GOLD },
                ]}
              />
            </g>
          </g>
        )}

        {flags.why && (
          <g>
            <FormulaBadge label="WHY" formula={t.d6WhyBadge} u={u} color={BLUE} />
            {(() => {
              const l = clamp01((u - 0.15) / 0.4)
              const r = clamp01((u - 0.35) / 0.4)
              return (
                <g>
                  <g opacity={l}>
                    <Card x={10} y={84} w={195} h={158} />
                    {/* a: opens up (muted) vs opens down (gold) */}
                    <path d="M 40 150 Q 75 190 110 150" fill="none" stroke={MUTED} strokeWidth={1.8} strokeDasharray="5 4" />
                    <path d="M 40 235 Q 75 195 110 235" fill="none" stroke={GOLD} strokeWidth={2.2} />
                    <text x={107} y={262} textAnchor="middle" fontSize={16} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                      a
                    </text>
                  </g>
                  <g opacity={r}>
                    <Card x={225} y={84} w={195} h={158} />
                    {/* b: same curve, slid along x */}
                    <line x1={238} y1={200} x2={405} y2={200} stroke={LINE} strokeWidth={1.2} opacity={0.6} />
                    <path d="M 240 200 Q 270 160 300 200" fill="none" stroke={MUTED} strokeWidth={1.8} strokeDasharray="5 4" />
                    <path d="M 310 200 Q 340 160 370 200" fill="none" stroke={GOLD} strokeWidth={2.2} />
                    <circle cx={340} cy={180} r={3.5} fill={GOLD} />
                    <text x={322} y={262} textAnchor="middle" fontSize={16} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                      b
                    </text>
                  </g>
                </g>
              )
            })()}
            <text x={107} y={292} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.5) / 0.3)}>
              {t.d6WhyOne}
            </text>
            <text x={322} y={292} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.3)}>
              {t.d6WhyTwo}
            </text>
          </g>
        )}

        {flags.readA && (
          <g>
            <QuestionFigure u={u} />
            <text x={152} y={258} textAnchor="middle" fontSize={30} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.4) / 0.25)}>
              ↓
            </text>
            <text x={308} y={258} textAnchor="middle" fontSize={30} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.45) / 0.25)}>
              ↓
            </text>
            <text x={215} y={318} textAnchor="middle" fontSize={34} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.25)}>
              a &lt; 0
            </text>
          </g>
        )}

        {flags.readB && (
          <g>
            <QuestionFigure u={u} />
            <g opacity={clamp01((u - 0.4) / 0.3)}>
              <circle cx={230} cy={170} r={11} fill={GOLD} fillOpacity={0.15} stroke={GOLD} strokeWidth={1.6} className="idx-pulse" />
              <circle cx={230} cy={170} r={4.5} fill={GOLD} />
              <text x={250} y={148} fontSize={15} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                (−b, 0)
              </text>
            </g>
            <text x={215} y={318} textAnchor="middle" fontSize={30} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.25)}>
              x = −b &gt; 0
            </text>
          </g>
        )}

        {flags.flip && (
          <g>
            <Tex x={215} y={110} size={28} parts={[{ t: '−b', it: true }, { t: ' > 0' }]} opacity={clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.3) / 0.25)}>
              <line x1={215} y1={132} x2={215} y2={172} stroke={LINE} strokeWidth={1.4} />
              <path d="M 210 164 L 215 176 L 220 164" fill="none" stroke={LINE} strokeWidth={1.4} />
              <text x={238} y={158} fontSize={16} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                × (−1)
              </text>
            </g>
            <text x={215} y={242} textAnchor="middle" fontSize={42} fontWeight={700} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.55) / 0.25)}>
              b &lt; 0
            </text>
          </g>
        )}

        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <g className="idx-pulse">
              <Tex
                x={215}
                y={150}
                size={30}
                parts={[
                  { t: 'a', it: true, fill: GOLD },
                  { t: ' = ? ,  ', fill: GOLD },
                  { t: 'b', it: true, fill: GOLD },
                  { t: ' = ?', fill: GOLD },
                ]}
              />
            </g>
            {chips(true)}
            {solved ? (
              <Tex
                x={215}
                y={314}
                size={16}
                parts={[{ t: '↓ → a < 0 · x = −b > 0 → ' }, { t: 'b < 0', fill: OK }, { t: '  ✓', fill: OK }]}
              />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.d6WhyA : wrongId === 'B' ? t.d6WhyB : t.d6WhyC}
              </text>
            ) : (
              <text x={215} y={314} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                {t.indexHint}
              </text>
            )}
          </g>
        )}

        {flags.answer && (
          <g>
            <circle cx={215} cy={140} r={58} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.5 * clamp01((u - 0.1) / 0.35)} />
            <text x={215} y={134} textAnchor="middle" fontSize={25} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.1) / 0.35)}>
              a &lt; 0
            </text>
            <text x={215} y={166} textAnchor="middle" fontSize={25} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.25) / 0.35)}>
              b &lt; 0
            </text>
            <Tex x={215} y={232} size={14} parts={EQ_PARTS} opacity={0.5 * clamp01((u - 0.55) / 0.25)} />
            <text x={215} y={282} textAnchor="middle" fontSize={26} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
              → D ✓
            </text>
          </g>
        )}

        {flags.verify && (
          <g>
            <Tex x={215} y={70} size={17} parts={AB_EQ} opacity={clamp01(u / 0.3)} />
            {(() => {
              const ax = clamp01((u - 0.15) / 0.3)
              const cu = clamp01((u - 0.3) / 0.35)
              const pt = clamp01((u - 0.6) / 0.3)
              return (
                <g>
                  <g opacity={ax}>
                    <line x1={40} y1={190} x2={400} y2={190} stroke={LINE} strokeWidth={1.4} />
                    <line x1={100} y1={300} x2={100} y2={86} stroke={LINE} strokeWidth={1.4} />
                    <path d="M 394 185 L 404 190 L 394 195" fill="none" stroke={LINE} strokeWidth={1.4} />
                    <path d="M 95 92 L 100 82 L 105 92" fill="none" stroke={LINE} strokeWidth={1.4} />
                    <text x={409} y={195} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                      x
                    </text>
                    <text x={112} y={96} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                      y
                    </text>
                    <text x={89} y={204} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                      O
                    </text>
                  </g>
                  <path
                    d="M 47.5 239.5 Q 170 140.5 292.5 239.5"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeDasharray={560}
                    strokeDashoffset={560 * (1 - cu)}
                    opacity={clamp01(cu * 3)}
                  />
                  <text x={262} y={262} fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                    y = −(x − 2)²
                  </text>
                  <g opacity={pt}>
                    <circle cx={170} cy={190} r={10} fill={GOLD} fillOpacity={0.15} stroke={GOLD} strokeWidth={1.6} className="idx-pulse" />
                    <circle cx={170} cy={190} r={4} fill={GOLD} />
                    <text x={184} y={174} fontSize={13} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                      (2, 0)
                    </text>
                  </g>
                  <text x={352} y={112} textAnchor="middle" fontSize={34} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
                    ✓
                  </text>
                </g>
              )
            })()}
          </g>
        )}

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
    </div>
  )
}
