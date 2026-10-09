import { useEffect, useRef, useState } from 'react'
import type { PolyIdLabProps } from '../data/types'
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

/* ---- pieces of x² + p ≡ (x+2)(x+q) + 10 ---- */
const Q_PARTS: Part[] = [
  { t: 'x', it: true },
  { t: '2', sup: true },
  { t: ' + ' },
  { t: 'p', it: true, fill: GOLD },
  { t: ' ≡ (' },
  { t: 'x', it: true },
  { t: ' + 2)(' },
  { t: 'x', it: true },
  { t: ' + ' },
  { t: 'q', it: true, fill: BLUE },
  { t: ') + 10' },
]

const LHS_PARTS: Part[] = [
  { t: 'x', it: true },
  { t: '2', sup: true },
  { t: ' + ' },
  { t: '0·x', fill: RED },
  { t: ' + ' },
  { t: 'p', it: true, fill: GOLD },
]

const RHS_PARTS: Part[] = [
  { t: 'x', it: true },
  { t: '2', sup: true },
  { t: ' + ' },
  { t: '(q+2)x', fill: BLUE },
  { t: ' + ' },
  { t: '2', fill: BLUE },
  { t: 'q', it: true, fill: BLUE },
  { t: ' + 10' },
]

/** Expanded identity; `hi` colours the x-terms or the constants. */
function expandedParts(hi: 'x' | 'const' | null): Part[] {
  const paint = (parts: Part[], color?: string) => parts.map((p) => (color ? { ...p, fill: color } : { ...p }))
  const lhs = paint(LHS_PARTS, hi === 'x' ? RED : hi === 'const' ? GOLD : undefined)
  const rhs = paint(RHS_PARTS, hi === 'x' ? BLUE : hi === 'const' ? BLUE : undefined)
  return [...lhs, { t: '  ≡  ' }, ...rhs]
}

const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; val: Part[] }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: [{ t: '−4' }] },
  { id: 'B', val: [{ t: '−2' }] },
  { id: 'C', val: [{ t: '6' }] },
  { id: 'D', val: [{ t: '10' }] },
]
const ANSWER = 'C'

const TRAPS: { id: string; val: Part[]; l1: Part[]; l2key: 'd3TrapA' | 'd3TrapB' | 'd3TrapD' }[] = [
  {
    id: 'A',
    val: OPTIONS[0].val,
    l1: [{ t: '2q = ' }, { t: '−4', fill: RED }],
    l2key: 'd3TrapA',
  },
  {
    id: 'B',
    val: OPTIONS[1].val,
    l1: [{ t: 'q = ' }, { t: '−2', fill: RED }],
    l2key: 'd3TrapB',
  },
  {
    id: 'D',
    val: OPTIONS[3].val,
    l1: [{ t: 'p ' }, { t: '≠ 10', fill: RED }],
    l2key: 'd3TrapD',
  },
]

type GuideStep = {
  n: string
  lawKey: 'd3GuideLaw0' | 'd3GuideLaw1' | 'd3GuideLaw2' | 'd3GuideLaw3' | 'd3GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'd3GuideLaw0',
    line: Q_PARTS,
  },
  {
    n: '1',
    lawKey: 'd3GuideLaw1',
    line: [
      { t: '(x+2)(x+q)+10 = ' },
      { t: 'x', it: true },
      { t: '2', sup: true },
      { t: '+' },
      { t: '(q+2)x', fill: BLUE },
      { t: '+' },
      { t: '2q+10', fill: BLUE },
    ],
  },
  {
    n: '2',
    lawKey: 'd3GuideLaw2',
    line: [
      { t: 'q', it: true, fill: BLUE },
      { t: ' + 2 = 0  →  ' },
      { t: 'q = −2', fill: GOLD },
    ],
  },
  {
    n: '3',
    lawKey: 'd3GuideLaw3',
    line: [
      { t: 'p', it: true, fill: GOLD },
      { t: ' = 2(−2) + 10 = ' },
      { t: '6', fill: GOLD },
    ],
  },
  {
    n: '4',
    lawKey: 'd3GuideLaw4',
    line: [
      { t: 'x=−2:  4+p = 10 → p = ' },
      { t: '6', fill: OK },
      { t: '  →  C  ✓', fill: OK },
    ],
  },
]

export function PolyIdLab({ mode, onInteractComplete }: PolyIdLabProps) {
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

  const flags = {
    ask: mode === 'ask',
    laws: mode === 'laws',
    name: mode === 'name',
    xcoef: mode === 'xcoef',
    const: mode === 'const',
    gate: mode === 'gate',
    answer: mode === 'answer',
    shortcut: mode === 'shortcut',
    verify: mode === 'verify',
    check: mode === 'check',
    guide: mode === 'guide',
  }

  /* ---- shared scenes ---- */

  const chips = (live: boolean, forceSolved = false) =>
    OPTIONS.map((o) => {
      const isAns = o.id === ANSWER
      const won = solved || forceSolved
      const ci = CHIP_X[OPTIONS.findIndex((q) => q.id === o.id)]
      const cls =
        live && wrongId === o.id
          ? 'idx-chip is-wrong'
          : won
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
          <text x={ci + 13} y={CHIP_Y + 20} fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
            {o.id}
          </text>
          <Tex x={ci + CHIP_W / 2 + 4} y={CHIP_Y + 40} size={22} parts={o.val} />
          {won && isAns && (
            <g>
              <circle cx={ci + CHIP_W - 14} cy={CHIP_Y + 12} r={9} fill={OK} />
              <text x={ci + CHIP_W - 14} y={CHIP_Y + 16.5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0b1020">
                ✓
              </text>
            </g>
          )}
        </g>
      )
    })

  /** Side card naming one side of the identity (LHS / RHS). */
  const defCard = (y: number, color: string, letter: string, body: Part[], size: number, u0: number, fromX: number) => {
    const ui = clamp01((u - u0) / 0.45)
    const dx = lerp(fromX, 0, ui)
    return (
      <g opacity={ui} transform={`translate(${dx}, 0)`}>
        <Card x={60} y={y} w={310} h={52} />
        <circle cx={92} cy={y + 26} r={16} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} />
        <text x={92} y={y + 31} textAnchor="middle" fontSize={14} fill={color} fontFamily="'Fraunces', Georgia, serif" fontWeight={700} fontStyle="italic">
          {letter}
        </text>
        <Tex x={228} y={y + 33} size={size} parts={body} />
      </g>
    )
  }

  return (
    <div className={`idx-lab ${solved ? 'is-solved' : ''}`}>
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Polynomial identity: expand, match terms, answer">
        {flags.ask && (
          <g>
            <FormulaBadge label="≡" formula={t.d3ForAllX} u={u} />
            <Tex x={215} y={118} size={21} parts={Q_PARTS} opacity={clamp01(u / 0.3)} />
            <text x={215} y={192} textAnchor="middle" fontSize={44} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.2) / 0.3)}>
              ?
            </text>
            <rect
              x={65}
              y={242}
              width={300}
              height={52}
              rx={16}
              fill="rgba(255, 209, 102, 0.08)"
              stroke={GOLD}
              strokeWidth={1.6}
              opacity={clamp01((u - 0.5) / 0.3)}
            />
            <Tex
              x={215}
              y={275}
              size={16}
              parts={[
                { t: '(x+m)(x+n) = ' },
                { t: 'x', it: true },
                { t: '2', sup: true },
                { t: ' + (' },
                { t: 'm+n', it: true },
                { t: ')' },
                { t: 'x', it: true },
                { t: ' + ' },
                { t: 'mn', it: true },
              ]}
              opacity={clamp01((u - 0.6) / 0.25)}
            />
          </g>
        )}

        {flags.laws && (
          <g>
            {[
              { id: '①', formula: '(x+m)(x+n) = x² + (m+n)x + mn', color: GOLD, size: 17 },
              { id: '②', formula: '0·x + p = (q+2)x + 2q + 10', color: BLUE, size: 19 },
            ].map((law, i) => {
              const ui = clamp01((u - i * 0.18) / 0.45)
              const y = 78 + i * 100 + (1 - ui) * 20
              return (
                <g key={law.id} opacity={ui}>
                  <rect x={36} y={y} width={358} height={64} rx={16} fill="rgba(255,255,255,0.05)" stroke={law.color} strokeWidth={1.6} />
                  <circle cx={72} cy={y + 32} r={18} fill={law.color} fillOpacity={0.18} stroke={law.color} strokeWidth={1.5} />
                  <text x={72} y={y + 38} textAnchor="middle" fontSize={16} fill={law.color} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    {law.id}
                  </text>
                  <text x={225} y={y + 39} textAnchor="middle" fontSize={law.size} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    {law.formula}
                  </text>
                </g>
              )
            })}
          </g>
        )}

        {flags.name && (
          <g>
            <Tex x={215} y={56} size={16} parts={Q_PARTS} />
            {defCard(96, GOLD, 'L', LHS_PARTS, 20, 0.15, -40)}
            {defCard(168, BLUE, 'R', RHS_PARTS, 17, 0.32, 40)}
            <FormulaBadge label={t.indexLawTag1} formula="(x+m)(x+n) = x²+(m+n)x+mn" u={u} y={252} />
          </g>
        )}

        {flags.xcoef && (
          <g>
            <FormulaBadge label={t.indexLawTag1} formula="(x+m)(x+n) = x²+(m+n)x+mn" u={u} />
            <Tex x={215} y={70} size={15} parts={expandedParts('x')} opacity={clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.1) / 0.25)}>
              <Card x={45} y={94} w={150} h={48} />
              <Tex x={120} y={126} size={21} parts={[{ t: '0·', fill: RED }, { t: 'x', it: true, fill: RED }]} />
              <text x={215} y={127} textAnchor="middle" fontSize={22} fill={MUTED}>
                =
              </text>
              <Card x={235} y={94} w={150} h={48} />
              <Tex x={310} y={126} size={21} parts={[{ t: '(q+2)', fill: BLUE }, { t: 'x', it: true, fill: BLUE }]} />
            </g>
            {(() => {
              const eq = clamp01((u - 0.35) / 0.2)
              const f = clamp01((u - 0.55) / 0.3)
              const show = clamp01((u - 0.8) / 0.2)
              return (
                <g>
                  <Tex x={215} y={185 - Math.sin(eq * Math.PI) * 6} size={19} parts={[{ t: 'q', it: true, fill: BLUE }, { t: ' + 2 = 0' }]} opacity={eq * (1 - clamp01((f - 0.6) / 0.4))} />
                  <circle cx={215} cy={179} r={24} fill={GOLD} fillOpacity={0.12} stroke={GOLD} strokeWidth={2} opacity={show} />
                  <text x={215} y={188} textAnchor="middle" fontSize={24} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    −2
                  </text>
                </g>
              )
            })()}
            <text x={215} y={232} textAnchor="middle" fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.2)}>
              {t.d3XNote}
            </text>
            <rect x={130} y={248} width={170} height={44} rx={14} fill="rgba(255, 209, 102, 0.08)" stroke={GOLD} strokeWidth={1.5} opacity={clamp01((u - 0.85) / 0.15)} />
            <Tex
              x={215}
              y={277}
              size={20}
              parts={[
                { t: 'q', it: true, fill: BLUE },
                { t: ' = ' },
                { t: '−2', fill: GOLD },
              ]}
              opacity={clamp01((u - 0.9) / 0.1)}
            />
          </g>
        )}

        {flags.const && (
          <g>
            <FormulaBadge label={t.indexLawTag2} formula="p = 2q + 10" u={u} />
            <Tex x={215} y={70} size={15} parts={expandedParts('const')} opacity={clamp01(u / 0.3)} />
            <g opacity={clamp01((u - 0.1) / 0.25)}>
              <Card x={45} y={94} w={150} h={48} />
              <Tex x={120} y={126} size={22} parts={[{ t: 'p', it: true, fill: GOLD }]} />
              <text x={215} y={127} textAnchor="middle" fontSize={22} fill={MUTED}>
                =
              </text>
              <Card x={235} y={94} w={150} h={48} />
              <Tex x={310} y={126} size={21} parts={[{ t: '2', fill: BLUE }, { t: 'q', it: true, fill: BLUE }, { t: ' + 10', fill: BLUE }]} />
            </g>
            {(() => {
              const sub = clamp01((u - 0.45) / 0.2)
              const f = clamp01((u - 0.62) / 0.2)
              const lineGone = clamp01((u - 0.72) / 0.15)
              const show = clamp01((u - 0.8) / 0.2)
              return (
                <g>
                  <Tex x={215} y={185} size={19} parts={[{ t: 'p = 2(' }, { t: '−2', fill: GOLD }, { t: ') + 10' }]} opacity={sub * (1 - lineGone)} />
                  <Tex x={lerp(218, 213, f)} y={185 - Math.sin(f * Math.PI) * 6} size={19} parts={[{ t: '−4', fill: RED }]} opacity={clamp01(f * 2) * (1 - lineGone)} />
                  <Tex x={lerp(262, 222, f)} y={185 - Math.sin(f * Math.PI) * 6} size={19} parts={[{ t: '+10', fill: BLUE }]} opacity={clamp01(f * 2) * (1 - lineGone)} />
                  <circle cx={215} cy={179} r={22} fill={GOLD} fillOpacity={0.12} stroke={GOLD} strokeWidth={2} opacity={show} />
                  <text x={215} y={188} textAnchor="middle" fontSize={24} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    6
                  </text>
                </g>
              )
            })()}
            <text x={215} y={232} textAnchor="middle" fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.2)}>
              {t.d3ConstNote}
            </text>
            <rect x={130} y={248} width={170} height={44} rx={14} fill="rgba(255, 209, 102, 0.08)" stroke={GOLD} strokeWidth={1.5} opacity={clamp01((u - 0.85) / 0.15)} />
            <Tex
              x={215}
              y={277}
              size={20}
              parts={[
                { t: 'p', it: true, fill: GOLD },
                { t: ' = ' },
                { t: '6', fill: GOLD },
              ]}
              opacity={clamp01((u - 0.9) / 0.1)}
            />
          </g>
        )}

        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <FormulaBadge label={t.indexLawTag2} formula="p = 2q + 10" u={1} y={10} />
            <Tex
              x={215}
              y={92}
              size={27}
              parts={[
                { t: 'p', it: true, fill: GOLD },
                { t: ' = 2(' },
                { t: '−2', fill: GOLD },
                { t: ') + 10' },
              ]}
            />
            <text x={215} y={140} textAnchor="middle" fontSize={30} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif">
              = ?
            </text>
            <Tex
              x={215}
              y={178}
              size={15}
              parts={[
                { t: 'q', it: true, fill: BLUE },
                { t: ' = −2   ·   ' },
                { t: 'p', it: true, fill: GOLD },
                { t: ' = 2q + 10' },
              ]}
              opacity={0.8}
            />
            {chips(true)}
            {solved ? (
              <Tex
                x={215}
                y={314}
                size={16}
                parts={[
                  { t: 'p = 2(−2) + 10 = ' },
                  { t: '6', fill: OK },
                  { t: '  ✓', fill: OK },
                ]}
              />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.d3WhyA : wrongId === 'B' ? t.d3WhyB : t.d3WhyD}
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
            <FormulaBadge label={t.indexLawTag2} formula="p = 2q + 10" u={u} />
            {(() => {
              const f = clamp01((u - 0.1) / 0.45)
              const show = clamp01((u - 0.55) / 0.3)
              return (
                <g>
                  <g opacity={1 - clamp01((f - 0.85) / 0.15)}>
                    <rect x={lerp(60, 158, f)} y={56} width={110} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={GOLD} strokeWidth={1.6} />
                    <Tex x={lerp(115, 213, f)} y={89} size={22} parts={[{ t: 'q = −2', fill: GOLD }]} />
                    <rect x={lerp(260, 162, f)} y={56} width={110} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={GOLD} strokeWidth={1.6} />
                    <Tex x={lerp(315, 217, f)} y={89} size={22} parts={[{ t: '2q + 10', fill: GOLD }]} />
                  </g>
                  <circle cx={215} cy={150} r={46} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.5 * show} />
                  <text x={215} y={166} textAnchor="middle" fontSize={42} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    p = 6
                  </text>
                  <Tex
                    x={215}
                    y={222}
                    size={16}
                    parts={[{ t: '2(−2) + 10 = −4 + 10 = ', fill: GOLD }, { t: '6', fill: GOLD }]}
                    opacity={clamp01((u - 0.7) / 0.25)}
                  />
                  <text x={215} y={262} textAnchor="middle" fontSize={24} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.85) / 0.15)}>
                    → C ✓
                  </text>
                </g>
              )
            })()}
          </g>
        )}

        {flags.shortcut && (
          <g>
            <FormulaBadge label={t.d3SubTag} formula="x = −2 → (x+2) = 0" u={u} color={BLUE} />
            <text x={215} y={86} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.1) / 0.25)}>
              {t.d3SubX}
            </text>
            <Tex
              x={215}
              y={132}
              size={18}
              parts={[
                { t: '(−2)² + p = ' },
                { t: '(−2+2)', fill: RED },
                { t: '(−2+q) + 10' },
              ]}
              opacity={clamp01((u - 0.2) / 0.25)}
            />
            {(() => {
              const ring = clamp01((u - 0.45) / 0.15)
              return (
                <g>
                  <ellipse cx={215} cy={127} rx={33} ry={15} fill="none" stroke={RED} strokeWidth={2} opacity={0.9 * ring} />
                  <text x={215} y={161} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED} fontFamily="'Fraunces', Georgia, serif" opacity={ring}>
                    → 0
                  </text>
                </g>
              )
            })()}
            <rect x={130} y={168} width={170} height={44} rx={14} fill="rgba(76, 201, 240, 0.1)" stroke={BLUE} strokeWidth={1.5} opacity={clamp01((u - 0.6) / 0.2)} />
            <Tex
              x={215}
              y={197}
              size={21}
              parts={[{ t: '4 + ' }, { t: 'p', it: true, fill: GOLD }, { t: ' = 10' }]}
              opacity={clamp01((u - 0.65) / 0.2)}
            />
            <text x={215} y={248} textAnchor="middle" fontSize={30} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.8) / 0.2)}>
              p = 6 → C
            </text>
            <text x={215} y={288} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.9) / 0.1)}>
              {t.d2CheckNote}
            </text>
          </g>
        )}

        {flags.verify && (
          <g>
            <FormulaBadge label={t.d3ExpandTag} formula="x = −2" u={u} color={BLUE} />
            <g opacity={clamp01((u - 0.1) / 0.25)}>
              <Card x={45} y={94} w={150} h={78} />
              <text x={120} y={116} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                LHS
              </text>
              <Tex x={120} y={142} size={18} parts={[{ t: '4 + ' }, { t: '6', fill: GOLD }]} />
              <Tex x={120} y={164} size={16} parts={[{ t: '= ', }, { t: '10', fill: OK }]} />
              <text x={215} y={136} textAnchor="middle" fontSize={20} fill={MUTED}>
                |
              </text>
              <Card x={235} y={94} w={150} h={78} />
              <text x={310} y={116} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                RHS
              </text>
              <Tex x={310} y={142} size={18} parts={[{ t: '0 + 10' }]} />
              <Tex x={310} y={164} size={16} parts={[{ t: '= ' }, { t: '10', fill: OK }]} />
            </g>
            {(() => {
              const show = clamp01((u - 0.5) / 0.25)
              return (
                <g>
                  <circle cx={215} cy={216} r={30} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={2} opacity={show} className="idx-pulse" />
                  <text x={215} y={224} textAnchor="middle" fontSize={22} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    10 = 10
                  </text>
                </g>
              )
            })()}
            <text x={215} y={278} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.8) / 0.2)}>
              {t.d3BalNote}
            </text>
          </g>
        )}

        {flags.check && (
          <g>
            {TRAPS.map((trap, i) => {
              const ci = clamp01((u - i * 0.14) / 0.5)
              const x = [10, 152, 294][i]
              const y = 50 + (1 - ci) * 26
              return (
                <g key={trap.id} opacity={ci}>
                  <Card x={x} y={y} w={126} h={150} />
                  <Tex x={x + 63} y={y + 30} size={17} parts={[{ t: trap.id, fill: RED }, { t: ' · ' }, ...trap.val]} />
                  <line x1={x + 18} y1={y + 44} x2={x + 108} y2={y + 44} stroke="rgba(242,245,255,0.25)" strokeWidth={1} />
                  <Tex x={x + 63} y={y + 72} size={13.5} parts={trap.l1} />
                  <text x={x + 63} y={y + 98} textAnchor="middle" fontSize={12.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                    {t[trap.l2key]}
                  </text>
                  <text x={x + 63} y={y + 136} textAnchor="middle" fontSize={22} fill={RED} opacity={0.9}>
                    ✗
                  </text>
                </g>
              )
            })}
            <Tex
              x={215}
              y={250}
              size={19}
              parts={[
                { t: '4 + p = 10 → p = ' },
                { t: '6', fill: OK },
                { t: '  ✓ C', fill: OK },
              ]}
              opacity={clamp01((u - 0.75) / 0.25)}
            />
          </g>
        )}

        {flags.guide && (
          <g>
            <text x={215} y={28} textAnchor="middle" fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700} opacity={clamp01(u / 0.2)}>
              {t.indexGuideTitle}
            </text>
            {GUIDE_STEPS.map((step, i) => {
              const ui = clamp01((u - i * 0.14) / 0.4)
              const y = 48 + i * 52 + (1 - ui) * 16
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
          </g>
        )}
      </svg>

      {flags.laws && (
        <p className="vm-eq show">
          <span className="a">① ②</span>
          <span className="op">·</span>
          <span className="sum">{t.d3Ready}</span>
        </p>
      )}
      {flags.name && (
        <p className="vm-eq show">
          <span className="a">LHS x²+0x+p</span>
          <span className="op">≡</span>
          <span className="b">RHS x²+(q+2)x+2q+10</span>
        </p>
      )}
      {flags.xcoef && (
        <p className="vm-eq show">
          <span className="a">q + 2 = 0</span>
          <span className="op">→</span>
          <span className="sum">q = −2</span>
        </p>
      )}
      {flags.const && (
        <p className="vm-eq show">
          <span className="a">p = 2q + 10</span>
          <span className="op">=</span>
          <span className="sum">6</span>
        </p>
      )}
      {flags.gate && (
        <p className="vm-eq show">
          <span className="a">p</span>
          <span className="op">=</span>
          <span className="sum">?</span>
        </p>
      )}
      {flags.answer && (
        <p className="vm-eq show">
          <span className="a">p = 6</span>
          <span className="op">→</span>
          <span className="sum">C ✓</span>
        </p>
      )}
      {flags.shortcut && (
        <p className="vm-eq show">
          <span className="a">4 + p = 10</span>
          <span className="op">→</span>
          <span className="sum">p = 6</span>
        </p>
      )}
      {flags.verify && (
        <p className="vm-eq show">
          <span className="a">LHS 10</span>
          <span className="op">·</span>
          <span className="sum">RHS 10 ✓</span>
        </p>
      )}
      {flags.check && (
        <p className="vm-eq show">
          <span className="a">A·B·D ✗</span>
          <span className="op">·</span>
          <span className="sum">C ✓</span>
        </p>
      )}
      {flags.guide && (
        <p className="vm-eq show">
          <span className="a">{t.d3GuideThink}</span>
          <span className="op">→</span>
          <span className="sum">p = 6 = C</span>
        </p>
      )}
    </div>
  )
}
