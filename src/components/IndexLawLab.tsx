import { useEffect, useRef, useState } from 'react'
import type { IndexLawLabProps } from '../data/types'
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

function Frac({ x, y, w, u = 1 }: { x: number; y: number; w: number; u?: number }) {
  return (
    <line
      x1={x - w / 2}
      y1={y}
      x2={x - w / 2 + w * u}
      y2={y}
      stroke={LINE}
      strokeWidth={3}
      strokeLinecap="round"
    />
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

/** Floating formula badge — shown whenever a law is in play. */
function FormulaBadge({
  label,
  formula,
  u,
  y = 18,
}: {
  label: string
  formula: string
  u: number
  y?: number
}) {
  const op = clamp01(u / 0.35)
  return (
    <g opacity={op} transform={`translate(0, ${lerp(-8, 0, op)})`}>
      <rect x={48} y={y} width={334} height={36} rx={18} fill="rgba(255, 209, 102, 0.1)" stroke={GOLD} strokeWidth={1.4} />
      <text x={70} y={y + 23} fontSize={12} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
        {label}
      </text>
      <text x={215} y={y + 24} textAnchor="middle" fontSize={15} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
        {formula}
      </text>
    </g>
  )
}

const CARD_Y = 92
const CARD_XS = [40, 167, 294]
const CARD_CX = CARD_XS.map((x) => x + 48)

const BRACKET3: Part[] = [
  { t: '(' },
  { t: '2' },
  { t: 'x', it: true },
  { t: '4', sup: true },
  { t: ')' },
  { t: '3', sup: true, fill: GOLD },
]
const NUM_8X12: Part[] = [
  { t: '8', fill: GOLD },
  { t: 'x', it: true },
  { t: '12', sup: true, fill: BLUE },
]
const DEN_2X5: Part[] = [{ t: '2' }, { t: 'x', it: true }, { t: '5', sup: true, fill: BLUE }]

type ChipDef = { id: string; val: Part[] }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: [{ t: '3' }, { t: 'x', it: true }, { t: '2', sup: true }] },
  { id: 'B', val: [{ t: '3' }, { t: 'x', it: true }, { t: '7', sup: true }] },
  { id: 'C', val: [{ t: '4' }, { t: 'x', it: true }, { t: '7', sup: true }] },
  { id: 'D', val: [{ t: '4' }, { t: 'x', it: true }, { t: '59', sup: true }] },
]
const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

const TRAPS: { id: string; val: Part[]; l1: Part[]; l2key: 'indexTrapB' | 'indexTrapD' | 'indexTrapA' }[] = [
  {
    id: 'B',
    val: OPTIONS[1].val,
    l1: [{ t: '(2x' }, { t: '4', sup: true }, { t: ')³ → ' }, { t: '6', fill: RED }, { t: 'x', it: true }, { t: '12', sup: true }],
    l2key: 'indexTrapB',
  },
  {
    id: 'D',
    val: OPTIONS[3].val,
    l1: [{ t: '(x' }, { t: '4', sup: true }, { t: ')³ → ' }, { t: 'x', it: true }, { t: '64', sup: true, fill: RED }],
    l2key: 'indexTrapD',
  },
  {
    id: 'A',
    val: OPTIONS[0].val,
    l1: [{ t: '✗ + ✗' }],
    l2key: 'indexTrapA',
  },
]

type GuideStep = {
  n: string
  lawKey: 'indexGuideLaw1' | 'indexGuideLaw2' | 'indexGuideLaw3' | 'indexGuideLaw0' | 'indexGuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'indexGuideLaw0',
    line: [
      { t: '(' },
      { t: '2x', it: true },
      { t: '4', sup: true },
      { t: ')' },
      { t: '3', sup: true, fill: GOLD },
      { t: ' ÷ 2x' },
      { t: '5', sup: true },
    ],
  },
  {
    n: '1',
    lawKey: 'indexGuideLaw1',
    line: [
      { t: '(2x' },
      { t: '4', sup: true },
      { t: ')' },
      { t: '3', sup: true },
      { t: ' = 2' },
      { t: '3', sup: true, fill: GOLD },
      { t: '(x' },
      { t: '4', sup: true },
      { t: ')' },
      { t: '3', sup: true },
    ],
  },
  {
    n: '2',
    lawKey: 'indexGuideLaw2',
    line: [
      { t: '2' },
      { t: '3', sup: true },
      { t: '(x' },
      { t: '4', sup: true },
      { t: ')' },
      { t: '3', sup: true },
      { t: ' = 8x' },
      { t: '12', sup: true, fill: BLUE },
    ],
  },
  {
    n: '3',
    lawKey: 'indexGuideLaw3',
    line: [
      { t: '8x' },
      { t: '12', sup: true },
      { t: ' ÷ 2x' },
      { t: '5', sup: true },
      { t: ' = 4x' },
      { t: '7', sup: true, fill: OK },
    ],
  },
  {
    n: '4',
    lawKey: 'indexGuideLaw4',
    line: [
      { t: '4x' },
      { t: '7', sup: true, fill: OK },
      { t: '  →  C  ✓', fill: OK },
    ],
  },
]

export function IndexLawLab({ mode, onInteractComplete }: IndexLawLabProps) {
  const { t } = useI18n()
  const u = useFly(mode, mode === 'guide' ? 1400 : 950)
  const [wrongId, setWrongId] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    if (mode !== 'challenge') {
      setWrongId(null)
      setSolved(false)
    }
  }, [mode])

  const pick = (id: string) => {
    if (solved) return
    if (id === 'C') {
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
    copies: mode === 'copies',
    coeffs: mode === 'coeffs',
    indices: mode === 'indices',
    challenge: mode === 'challenge',
    divide: mode === 'divide',
    subtract: mode === 'subtract',
    final: mode === 'final',
    check: mode === 'check',
    guide: mode === 'guide',
  }

  /* ---- shared scenes ---- */

  const stamp = (active: boolean) => {
    const u1 = active ? clamp01((u - 0.12) / 0.55) : 1
    const u2 = active ? clamp01((u - 0.38) / 0.55) : 1
    return (
      <g>
        <Card x={CARD_XS[0]} y={CARD_Y} />
        {[1, 2].map((k) => {
          const ui = k === 1 ? u1 : u2
          const x = lerp(CARD_XS[0], CARD_XS[k], ui)
          const lift = Math.sin(ui * Math.PI) * 14
          return (
            <g key={k} opacity={0.25 + 0.75 * ui}>
              <Card x={x} y={CARD_Y - lift} />
              <Tex x={x + 48} y={CARD_Y - lift + 38} size={24} parts={[{ t: '2' }, { t: 'x', it: true }, { t: '4', sup: true }]} />
            </g>
          )
        })}
        <Tex x={CARD_XS[0] + 48} y={CARD_Y + 38} size={24} parts={[{ t: '2' }, { t: 'x', it: true }, { t: '4', sup: true }]} />
        <text x={151.5} y={130} textAnchor="middle" fontSize={22} fill={MUTED} opacity={u1}>
          ×
        </text>
        <text x={278.5} y={130} textAnchor="middle" fontSize={22} fill={MUTED} opacity={u2}>
          ×
        </text>
      </g>
    )
  }

  const cardsFocus = (focus: 'coef' | 'index') => {
    const coefOp = focus === 'coef' ? 1 : 0.22
    const idxOp = focus === 'index' ? 1 : 0.22
    return (
      <g>
        {CARD_CX.map((cx, k) => (
          <g key={k}>
            <Card x={CARD_XS[k]} y={CARD_Y} />
            {focus === 'index' && <circle cx={cx + 18} cy={121} r={19} fill={BLUE} opacity={0.14} />}
            <text
              x={cx - 16}
              y={130}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={24}
              fontWeight={600}
              fill={focus === 'coef' ? GOLD : INK}
              opacity={coefOp}
            >
              2
            </text>
            <text
              x={cx + 18}
              y={130}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={24}
              fontWeight={600}
              fill={INK}
              opacity={idxOp}
            >
              x<tspan dy={-10.8} fontSize={14.9}>4</tspan>
            </text>
          </g>
        ))}
      </g>
    )
  }

  const chips = (live: boolean, forceSolved = false) =>
    OPTIONS.map((o) => {
      const isC = o.id === 'C'
      const won = solved || forceSolved
      const ci = CHIP_X[OPTIONS.findIndex((q) => q.id === o.id)]
      const cls =
        live && wrongId === o.id
          ? 'idx-chip is-wrong'
          : won
            ? isC
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
          {won && isC && (
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

  const lawCards = [
    { id: '①', formula: '(ab)ⁿ = aⁿ · bⁿ', color: GOLD },
    { id: '②', formula: '(aᵐ)ⁿ = aᵐⁿ', color: BLUE },
    { id: '③', formula: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ', color: OK },
  ]

  return (
    <div className={`idx-lab ${solved ? 'is-solved' : ''}`}>
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Index laws: formula first, then the answer">
        {flags.ask && (
          <g>
            <Tex x={215} y={120} size={40} parts={BRACKET3} opacity={clamp01(u / 0.3)} />
            <Frac x={215} y={150} w={130} u={clamp01((u - 0.15) / 0.5)} />
            <Tex x={215} y={196} size={40} parts={DEN_2X5} opacity={clamp01((u - 0.3) / 0.4)} />
            <text x={215} y={268} textAnchor="middle" fontSize={44} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif">
              ?
            </text>
          </g>
        )}

        {flags.laws && (
          <g>
            {lawCards.map((law, i) => {
              const ui = clamp01((u - i * 0.18) / 0.45)
              const y = 58 + i * 78 + (1 - ui) * 20
              return (
                <g key={law.id} opacity={ui}>
                  <rect x={36} y={y} width={358} height={64} rx={16} fill="rgba(255,255,255,0.05)" stroke={law.color} strokeWidth={1.6} />
                  <circle cx={72} cy={y + 32} r={18} fill={law.color} fillOpacity={0.18} stroke={law.color} strokeWidth={1.5} />
                  <text x={72} y={y + 38} textAnchor="middle" fontSize={16} fill={law.color} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    {law.id}
                  </text>
                  <text x={215} y={y + 40} textAnchor="middle" fontSize={22} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    {law.formula}
                  </text>
                </g>
              )
            })}
          </g>
        )}

        {flags.copies && (
          <g>
            <FormulaBadge label={t.indexLawTag1} formula="(ab)ⁿ = aⁿ · bⁿ" u={u} />
            <Tex x={215} y={72} size={24} parts={[...BRACKET3, { t: ' =' }]} />
            <g transform="translate(0, 16)">{stamp(true)}</g>
          </g>
        )}

        {flags.coeffs && (
          <g>
            <FormulaBadge label={t.indexLawTag1} formula="(ab)ⁿ → 2³ = 8" u={u} />
            <g transform="translate(0, 16)">{cardsFocus('coef')}</g>
            {[0, 1, 2].map((k) => {
              const ui = clamp01((u - 0.15 - k * 0.14) / 0.55)
              const x = lerp(CARD_CX[k] - 16, 215, ui)
              const y = lerp(137, 232, ui) - Math.sin(ui * Math.PI) * 12
              return <circle key={k} cx={x} cy={y} r={13} fill={GOLD} opacity={0.85 * (1 - ui * 0.95)} />
            })}
            <circle cx={215} cy={232} r={22} fill={GOLD} fillOpacity={0.12} stroke={GOLD} strokeWidth={2} opacity={clamp01((u - 0.5) / 0.3)} />
            <text
              x={215}
              y={241}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={27}
              fontWeight={700}
              fill={GOLD}
              opacity={clamp01((u - 0.75) / 0.25)}
            >
              8
            </text>
            <text
              x={318}
              y={240}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={20}
              fontWeight={600}
              fill={RED}
              opacity={0.75 * clamp01((u - 0.3) / 0.2) * (1 - clamp01((u - 0.6) / 0.25))}
            >
              6
            </text>
            <line
              x1={306}
              y1={233}
              x2={330}
              y2={233}
              stroke={RED}
              strokeWidth={2}
              opacity={0.75 * clamp01((u - 0.3) / 0.2) * (1 - clamp01((u - 0.6) / 0.25))}
            />
          </g>
        )}

        {flags.indices && (
          <g>
            <FormulaBadge label={t.indexLawTag2} formula="(aᵐ)ⁿ = aᵐⁿ" u={u} />
            <Tex
              x={215}
              y={72}
              size={20}
              parts={[
                { t: 'x', it: true },
                { t: '4', sup: true },
                { t: ' · x', it: true },
                { t: '4', sup: true },
                { t: ' · x', it: true },
                { t: '4', sup: true },
              ]}
            />
            <g transform="translate(0, 16)">{cardsFocus('index')}</g>
            {Array.from({ length: 12 }, (_, gi) => {
              const k = Math.floor(gi / 4)
              const j = gi % 4
              const ui = clamp01((u - 0.12 - gi * 0.04) / 0.5)
              const sx = CARD_CX[k] + (j - 1.5) * 16
              const sy = 188
              const tx = 215 + (gi - 5.5) * 22
              const ty = 244
              const x = lerp(sx, tx, ui)
              const y = lerp(sy, ty, ui) - Math.sin(ui * Math.PI) * 10
              return <circle key={gi} cx={x} cy={y} r={5.5} fill={BLUE} opacity={0.35 + 0.65 * ui} />
            })}
            <text
              x={215}
              y={300}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={21}
              fontWeight={600}
              fill={BLUE}
              opacity={clamp01((u - 0.8) / 0.2)}
            >
              4 × 3 = 12
            </text>
          </g>
        )}

        {flags.challenge && (
          <g opacity={clamp01(u / 0.35)}>
            <FormulaBadge label={t.indexLawTag3} formula="aᵐ ÷ aⁿ = aᵐ⁻ⁿ" u={1} y={10} />
            <Tex x={215} y={88} size={32} parts={NUM_8X12} />
            <Frac x={215} y={110} w={124} u={clamp01((u - 0.1) / 0.5)} />
            <Tex x={215} y={150} size={32} parts={DEN_2X5} />
            {chips(true)}
            {solved ? (
              <Tex
                x={215}
                y={314}
                size={16}
                parts={[
                  { t: '8', fill: GOLD },
                  { t: 'x', it: true },
                  { t: '12', sup: true },
                  { t: ' ÷ 2x' },
                  { t: '5', sup: true },
                  { t: ' = ' },
                  { t: '4', fill: OK },
                  { t: 'x', it: true, fill: OK },
                  { t: '7', sup: true, fill: OK },
                  { t: '  ✓', fill: OK },
                ]}
              />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={15} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.indexWhyA : wrongId === 'B' ? t.indexWhyB : t.indexWhyD}
              </text>
            ) : (
              <text x={215} y={314} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                {t.indexHint}
              </text>
            )}
          </g>
        )}

        {flags.divide && (
          <g>
            <FormulaBadge label={t.indexLawTagNum} formula="8 ÷ 2 = 4" u={u} />
            <circle cx={188} cy={78} r={16} fill={GOLD} opacity={0.16} />
            <text x={188} y={87} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={32} fontWeight={600} fill={GOLD}>
              8
            </text>
            <Tex x={238} y={87} size={32} parts={[{ t: 'x', it: true }, { t: '12', sup: true, fill: BLUE }]} />
            <Frac x={215} y={111} w={120} u={1} />
            <circle cx={196} cy={144} r={15} fill={RED} opacity={0.15} />
            <text x={196} y={153} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={32} fontWeight={600} fill={INK}>
              2
            </text>
            <Tex x={242} y={153} size={32} parts={[{ t: 'x', it: true }, { t: '5', sup: true, fill: BLUE }]} />
            <path
              d="M 196 165 Q 202 195 210 205"
              fill="none"
              stroke={GOLD}
              strokeWidth={2}
              strokeDasharray="5 4"
              opacity={0.8 * clamp01(u / 0.3)}
            />
            <polygon points="210,205 203.5,200 202.5,207.5" fill={GOLD} opacity={0.8 * clamp01(u / 0.3)} />
            {Array.from({ length: 8 }, (_, i) => {
              const pair = Math.floor(i / 2)
              const mi = clamp01((u - 0.5 - pair * 0.08) / 0.25)
              const x0 = 215 + (i - 3.5) * 30
              const bx = 215 + (2 * pair - 3) * 30
              const x = lerp(x0, bx + (i % 2 === 0 ? -7 : 7), mi)
              const appear = clamp01((u - 0.12 - i * 0.045) / 0.2)
              return <circle key={i} cx={x} cy={220} r={9 * appear} fill={GOLD} opacity={appear} />
            })}
            {[0, 1, 2, 3].map((k) => (
              <rect
                key={k}
                x={215 + (2 * k - 3) * 30 - 22}
                y={201}
                width={44}
                height={38}
                rx={10}
                fill={GOLD}
                fillOpacity={0.07}
                stroke={GOLD}
                strokeWidth={1.8}
                opacity={clamp01((u - 0.5 - k * 0.08) / 0.2)}
              />
            ))}
            <text
              x={215}
              y={270}
              textAnchor="middle"
              fontSize={17}
              fill={MUTED}
              fontFamily="'Fraunces', Georgia, serif"
              opacity={clamp01((u - 0.3) / 0.3)}
            >
              {t.indexGroups}
            </text>
          </g>
        )}

        {flags.subtract && (
          <g>
            <FormulaBadge label={t.indexLawTag3} formula="aᵐ ÷ aⁿ = aᵐ⁻ⁿ" u={u} />
            <Tex x={215} y={86} size={32} parts={[{ t: 'x', it: true }, { t: '12', sup: true, fill: BLUE }]} />
            <Frac x={215} y={110} w={120} u={1} />
            <Tex x={215} y={152} size={32} parts={[{ t: 'x', it: true }, { t: '5', sup: true, fill: RED }]} />
            {Array.from({ length: 12 }, (_, i) => {
              const gone = i >= 7
              if (gone) {
                const bi = clamp01((u - 0.1 - (i - 7) * 0.09) / 0.5)
                const y = lerp(208, 254, bi)
                const xop = clamp01(bi / 0.35) * (1 - clamp01((bi - 0.55) / 0.4))
                return (
                  <g key={i}>
                    <circle cx={215 + (i - 5.5) * 24} cy={y} r={8} fill={BLUE} opacity={1 - bi} />
                    <text x={215 + (i - 5.5) * 24} y={260} textAnchor="middle" fontSize={16} fill={RED} opacity={xop}>
                      ✕
                    </text>
                  </g>
                )
              }
              const si = clamp01((u - 0.55) / 0.35)
              const x = lerp(215 + (i - 5.5) * 24, 215 + (i - 3) * 24, si)
              return <circle key={i} cx={x} cy={208} r={8} fill={BLUE} />
            })}
            <text
              x={215}
              y={300}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={21}
              fontWeight={600}
              fill={BLUE}
              opacity={clamp01((u - 0.8) / 0.2)}
            >
              12 − 5 = 7
            </text>
          </g>
        )}

        {flags.final && (
          <g>
            <FormulaBadge label={t.indexLawTagAll} formula="① → ② → ③" u={u} />
            <circle cx={215} cy={148} r={50} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.35 * clamp01(u / 0.6)} />
            <text
              x={lerp(110, 180, clamp01(u / 0.6))}
              y={166}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={60}
              fontWeight={700}
              fill={GOLD}
            >
              4
            </text>
            <text
              x={lerp(320, 252, clamp01(u / 0.6))}
              y={166}
              textAnchor="middle"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={60}
              fontWeight={700}
              fill={INK}
            >
              x⁷
            </text>
            {chips(false, true)}
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
                  <text x={x + 63} y={y + 96} textAnchor="middle" fontSize={13} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
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
                { t: '8', fill: GOLD },
                { t: 'x', it: true },
                { t: '12', sup: true },
                { t: ' ÷ 2x' },
                { t: '5', sup: true },
                { t: ' = ' },
                { t: '4', fill: OK },
                { t: 'x', it: true, fill: OK },
                { t: '7', sup: true, fill: OK },
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
          <span className="a">① ② ③</span>
          <span className="op">·</span>
          <span className="sum">{t.indexLawsReady}</span>
        </p>
      )}
      {flags.copies && (
        <p className="vm-eq show">
          <span className="a">(2x<sup>4</sup>)³</span>
          <span className="op">=</span>
          <span className="b">(2x<sup>4</sup>)(2x<sup>4</sup>)(2x<sup>4</sup>)</span>
        </p>
      )}
      {flags.coeffs && (
        <p className="vm-eq show">
          <span className="a">2·2·2</span>
          <span className="op">=</span>
          <span className="sum">2³ = 8</span>
        </p>
      )}
      {flags.indices && (
        <p className="vm-eq show">
          <span className="a">(x<sup>4</sup>)³</span>
          <span className="op">=</span>
          <span className="sum">x¹²</span>
        </p>
      )}
      {flags.divide && (
        <p className="vm-eq show">
          <span className="a">8 ÷ 2</span>
          <span className="op">=</span>
          <span className="sum">4</span>
        </p>
      )}
      {flags.subtract && (
        <p className="vm-eq show">
          <span className="a">x¹² ÷ x⁵</span>
          <span className="op">=</span>
          <span className="sum">x⁷</span>
        </p>
      )}
      {flags.final && (
        <p className="vm-eq show">
          <span className="sum">4x⁷</span>
          <span className="op">→</span>
          <span className="a">C</span>
          <span className="op">✓</span>
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
          <span className="a">{t.indexGuideThink}</span>
          <span className="op">→</span>
          <span className="sum">4x⁷ = C</span>
        </p>
      )}
    </div>
  )
}
