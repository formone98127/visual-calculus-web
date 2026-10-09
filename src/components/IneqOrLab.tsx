import { useEffect, useRef, useState } from 'react'
import type { IneqOrLabProps } from '../data/types'
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

/* ---- the question, in pieces ---- */
/** 15 + 4x < 3  or  9 − 2x > 1  — "or" is the gold connector */
const CHAIN: Part[] = [
  { t: '15 + 4' },
  { t: 'x', it: true },
  { t: ' < 3   ' },
  { t: 'or', fill: GOLD, it: true },
  { t: '   9 − 2' },
  { t: 'x', it: true },
  { t: ' > 1' },
]

/** the four options — non-breaking gaps (SVG collapses plain spaces) */
const OPTS_LINE =
  'A x < −3     B x > −3     C x < 4     D x > 4'

const X_UNKNOWN: Part[] = [
  { t: 'x', it: true, fill: GOLD },
  { t: ' = ?', fill: GOLD },
]

/* ---- branch colors: ① blue (intermediate), ② gold (the winner x < 4) ---- */
const R1: Part[] = [
  { t: 'x', it: true },
  { t: ' < ' },
  { t: '−3', fill: BLUE },
]
const EQ1: Part[] = [
  { t: '15 + 4' },
  { t: 'x', it: true },
  { t: ' < 3' },
]
const EQ2: Part[] = [
  { t: '9 − 2' },
  { t: 'x', it: true },
  { t: ' > 1' },
]
const R2: Part[] = [
  { t: '−2' },
  { t: 'x', it: true },
  { t: ' > ' },
  { t: '−8' },
]

const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; val: string }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: 'x < −3' },
  { id: 'B', val: 'x > −3' },
  { id: 'C', val: 'x < 4' },
  { id: 'D', val: 'x > 4' },
]
const ANSWER = 'C'

type GuideStep = {
  n: string
  lawKey: 'd7GuideLaw0' | 'd7GuideLaw1' | 'd7GuideLaw2' | 'd7GuideLaw3' | 'd7GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'd7GuideLaw0',
    line: CHAIN,
  },
  {
    n: '1',
    lawKey: 'd7GuideLaw1',
    line: [{ t: '15 + 4x < 3  →  ' }, { t: 'x < −3', fill: BLUE }],
  },
  {
    n: '2',
    lawKey: 'd7GuideLaw2',
    line: [{ t: '9 − 2x > 1  ÷ (−2)  →  ' }, { t: 'x < 4', fill: GOLD }],
  },
  {
    n: '3',
    lawKey: 'd7GuideLaw3',
    line: [{ t: 'x < −3 ∪ x < 4  →  ' }, { t: 'x < 4', fill: GOLD }],
  },
  {
    n: '4',
    lawKey: 'd7GuideLaw4',
    line: [{ t: '① ✗ · ② ✓  →  ' }, { t: 'C ✓', fill: OK }],
  },
]

/** number line with a left-pointing ray from `s` (used on why / union) */
function Ray({
  s,
  end,
  y,
  color,
  dash,
  width = 2.2,
}: {
  s: number
  end: number
  y: number
  color: string
  dash?: string
  width?: number
}) {
  return (
    <g>
      <line x1={s} y1={y} x2={end + 8} y2={y} stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />
      <path d={`M ${end + 14} ${y - 5} L ${end + 4} ${y} L ${end + 14} ${y + 5}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
    </g>
  )
}

export function IneqOrLab({ mode, onInteractComplete }: IneqOrLabProps) {
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
    solve1: mode === 'solve1',
    solve2: mode === 'solve2',
    flip: mode === 'flip',
    union: mode === 'union',
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
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="or-inequality: solve both branches, then merge the rays — the wider one wins">
        {flags.ask && (
          <g>
            <FormulaBadge label="Q7" formula={t.d7AskBadge} u={u} />
            <Tex x={215} y={112} size={20} parts={CHAIN} opacity={clamp01((u - 0.15) / 0.3)} />
            <g className="idx-pulse" opacity={clamp01((u - 0.5) / 0.25)}>
              <Tex x={215} y={200} size={44} parts={X_UNKNOWN} />
            </g>
            <text x={215} y={296} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.7) / 0.25)}>
              {OPTS_LINE}
            </text>
          </g>
        )}

        {flags.why && (
          <g>
            <FormulaBadge label="WHY" formula={t.d7WhyBadge} u={u} color={BLUE} />
            {(() => {
              const l = clamp01((u - 0.15) / 0.4)
              const r = clamp01((u - 0.35) / 0.4)
              /* two leftward rays from s1 < s2: and keeps the short one, or keeps the long one */
              return (
                <g>
                  <g opacity={l}>
                    <Card x={10} y={84} w={195} h={158} />
                    <line x1={32} y1={180} x2={186} y2={180} stroke={LINE} strokeWidth={1.2} opacity={0.6} />
                    <Ray s={90} end={40} y={180} color={MUTED} dash="5 4" width={1.8} />
                    <Ray s={130} end={40} y={180} color={MUTED} dash="2 4" width={1.8} />
                    <circle cx={90} cy={180} r={4.5} fill="none" stroke={MUTED} strokeWidth={1.6} />
                    <circle cx={130} cy={180} r={4.5} fill="none" stroke={MUTED} strokeWidth={1.6} />
                    <text x={90} y={162} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">①</text>
                    <text x={130} y={162} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">②</text>
                    <Ray s={90} end={40} y={180} color={GOLD} width={2.6} />
                    <circle cx={90} cy={180} r={4.5} fill="none" stroke={GOLD} strokeWidth={1.8} />
                  </g>
                  <g opacity={r}>
                    <Card x={225} y={84} w={195} h={158} />
                    <line x1={247} y1={180} x2={401} y2={180} stroke={LINE} strokeWidth={1.2} opacity={0.6} />
                    <Ray s={305} end={255} y={180} color={MUTED} dash="5 4" width={1.8} />
                    <Ray s={345} end={255} y={180} color={MUTED} dash="2 4" width={1.8} />
                    <circle cx={305} cy={180} r={4.5} fill="none" stroke={MUTED} strokeWidth={1.6} />
                    <circle cx={345} cy={180} r={4.5} fill="none" stroke={MUTED} strokeWidth={1.6} />
                    <text x={305} y={162} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">①</text>
                    <text x={345} y={162} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">②</text>
                    <Ray s={345} end={255} y={180} color={GOLD} width={2.6} />
                    <circle cx={345} cy={180} r={4.5} fill="none" stroke={GOLD} strokeWidth={1.8} />
                  </g>
                </g>
              )
            })()}
            <text x={107} y={292} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.5) / 0.3)}>
              {t.d7WhyOne}
            </text>
            <text x={322} y={292} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.3)}>
              {t.d7WhyTwo}
            </text>
          </g>
        )}

        {flags.solve1 && (
          <g>
            <Tex x={215} y={95} size={16} parts={CHAIN} opacity={0.55 * clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.25) / 0.25)}>
              <line x1={215} y1={132} x2={215} y2={158} stroke={LINE} strokeWidth={1.4} />
              <path d="M 210 152 L 215 162 L 220 152" fill="none" stroke={LINE} strokeWidth={1.4} />
            </g>
            <g opacity={clamp01((u - 0.4) / 0.35)} transform={`translate(0, ${(1 - clamp01((u - 0.4) / 0.35)) * 14})`}>
              <Card x={55} y={168} w={320} h={84} />
              <circle cx={92} cy={210} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
              <text x={92} y={216} textAnchor="middle" fontSize={16} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                ①
              </text>
              <Tex x={245} y={202} size={14} parts={EQ1} opacity={0.6} />
              <Tex x={245} y={234} size={22} parts={R1} />
            </g>
          </g>
        )}

        {flags.solve2 && (
          <g>
            <Tex x={215} y={95} size={16} parts={CHAIN} opacity={0.55 * clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.25) / 0.25)}>
              <line x1={215} y1={132} x2={215} y2={158} stroke={LINE} strokeWidth={1.4} />
              <path d="M 210 152 L 215 162 L 220 152" fill="none" stroke={LINE} strokeWidth={1.4} />
            </g>
            <g opacity={clamp01((u - 0.4) / 0.35)} transform={`translate(0, ${(1 - clamp01((u - 0.4) / 0.35)) * 14})`}>
              <Card x={55} y={168} w={320} h={84} />
              <circle cx={92} cy={210} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
              <text x={92} y={216} textAnchor="middle" fontSize={16} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                ②
              </text>
              <Tex x={245} y={202} size={14} parts={EQ2} opacity={0.6} />
              <Tex x={245} y={234} size={22} parts={R2} />
            </g>
          </g>
        )}

        {flags.flip && (
          <g>
            <Tex x={215} y={110} size={28} parts={R2} opacity={clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.3) / 0.25)}>
              <line x1={215} y1={132} x2={215} y2={172} stroke={LINE} strokeWidth={1.4} />
              <path d="M 210 164 L 215 176 L 220 164" fill="none" stroke={LINE} strokeWidth={1.4} />
              <text x={250} y={160} fontSize={17} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                ÷ (−2)
              </text>
            </g>
            <g className="idx-pulse" opacity={clamp01((u - 0.55) / 0.25)}>
              <Tex x={215} y={248} size={44} parts={[{ t: 'x', it: true, fill: GOLD }, { t: ' < 4', fill: GOLD }]} />
            </g>
          </g>
        )}

        {flags.union && (
          <g>
            {(() => {
              const ax = clamp01(u / 0.3)
              const r1 = clamp01((u - 0.25) / 0.35)
              const r2 = clamp01((u - 0.45) / 0.35)
              const big = clamp01((u - 0.65) / 0.25)
              return (
                <g>
                  <g opacity={ax}>
                    <line x1={40} y1={195} x2={400} y2={195} stroke={LINE} strokeWidth={1.4} />
                    <path d="M 394 190 L 404 195 L 394 200" fill="none" stroke={LINE} strokeWidth={1.4} />
                    <text x={410} y={200} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                      x
                    </text>
                    <line x1={155} y1={190} x2={155} y2={200} stroke={LINE} strokeWidth={1.2} />
                    <line x1={295} y1={190} x2={295} y2={200} stroke={LINE} strokeWidth={1.2} />
                    <text x={155} y={218} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">−3</text>
                    <text x={295} y={218} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">4</text>
                  </g>
                  <g opacity={r2}>
                    <Ray s={295} end={60} y={195} color={GOLD} width={2.6} />
                    <circle cx={295} cy={195} r={4.5} fill="none" stroke={GOLD} strokeWidth={1.8} />
                    <text x={240} y={168} fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                      x &lt; 4
                    </text>
                  </g>
                  {/* blue dashed rides ON TOP of the gold ray — left of −3 shows both, −3…4 shows gold only */}
                  <g opacity={r1}>
                    <Ray s={155} end={60} y={195} color={BLUE} dash="5 4" />
                    <circle cx={155} cy={195} r={4.5} fill="none" stroke={BLUE} strokeWidth={1.8} />
                    <text x={100} y={168} fontSize={14} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                      x &lt; −3
                    </text>
                  </g>
                  <g className="idx-pulse" opacity={big}>
                    <Tex x={215} y={300} size={32} parts={[{ t: 'x', it: true, fill: GOLD }, { t: ' < 4', fill: GOLD }]} />
                  </g>
                </g>
              )
            })()}
          </g>
        )}

        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <g className="idx-pulse">
              <Tex x={215} y={150} size={42} parts={X_UNKNOWN} />
            </g>
            {chips(true)}
            {solved ? (
              <Tex
                x={215}
                y={314}
                size={16}
                parts={[{ t: 'x < −3 ∪ x < 4 = ' }, { t: 'x < 4', fill: OK }, { t: '  ✓', fill: OK }]}
              />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.d7WhyA : wrongId === 'B' ? t.d7WhyB : t.d7WhyD}
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
            <text x={215} y={152} textAnchor="middle" fontSize={32} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.1) / 0.35)}>
              x &lt; 4
            </text>
            <text x={215} y={232} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.45) / 0.3)}>
              x &lt; −3 ∪ x &lt; 4
            </text>
            <text x={215} y={282} textAnchor="middle" fontSize={26} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
              → C ✓
            </text>
          </g>
        )}

        {flags.verify && (
          <g>
            <text x={215} y={72} textAnchor="middle" fontSize={17} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01(u / 0.3)}>
              x = 0
            </text>
            {(() => {
              const cd = clamp01((u - 0.2) / 0.35)
              const fin = clamp01((u - 0.6) / 0.3)
              return (
                <g>
                  <g opacity={cd} transform={`translate(0, ${(1 - cd) * 14})`}>
                    <Card x={60} y={120} w={310} h={84} />
                    <circle cx={97} cy={162} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
                    <text x={97} y={168} textAnchor="middle" fontSize={16} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                      0
                    </text>
                    <Tex
                      x={237}
                      y={168}
                      size={15.5}
                      parts={[
                        { t: '① 15 < 3 ' },
                        { t: '✗', fill: RED },
                        { t: '   ·   ' },
                        { t: '② 9 > 1 ' },
                        { t: '✓', fill: OK },
                      ]}
                    />
                  </g>
                  <g className="idx-pulse" opacity={fin}>
                    <Tex x={215} y={248} size={22} parts={[{ t: 'or  →  ', fill: GOLD }, { t: '✓', fill: OK }]} />
                  </g>
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
