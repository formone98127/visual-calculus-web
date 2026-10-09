import { useEffect, useRef, useState } from 'react'
import type { SumDiffLabProps } from '../data/types'
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

/* ---- pieces of (4x+y)² − (4x−y)² ---- */
const A_PARTS: Part[] = [
  { t: '(' },
  { t: '4' },
  { t: 'x', it: true },
  { t: ' + ' },
  { t: 'y', it: true },
  { t: ')' },
  { t: '2', sup: true },
]
const B_PARTS: Part[] = [
  { t: '(' },
  { t: '4' },
  { t: 'x', it: true },
  { t: ' − ' },
  { t: 'y', it: true },
  { t: ')' },
  { t: '2', sup: true },
]

/** The whole question; `tone` colours one bracket (or both). */
function questionParts(tone: 'a' | 'b' | 'both' | null): Part[] {
  const paint = (parts: Part[], color?: string) =>
    parts.map((p) => (color ? { ...p, fill: color } : { ...p }))
  const minus: Part[] = [{ t: ' − ' }]
  if (tone === 'a') return [...paint(A_PARTS, RED), ...minus, ...B_PARTS]
  if (tone === 'b') return [...A_PARTS, ...minus, ...paint(B_PARTS, BLUE)]
  if (tone === 'both') return [...paint(A_PARTS, RED), ...minus, ...paint(B_PARTS, BLUE)]
  return [...A_PARTS, ...minus, ...B_PARTS]
}

const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; val: Part[] }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: [{ t: '0' }] },
  { id: 'B', val: [{ t: '2' }, { t: 'y', it: true }, { t: '2', sup: true }] },
  { id: 'C', val: [{ t: '8' }, { t: 'x', it: true }, { t: 'y', it: true }] },
  { id: 'D', val: [{ t: '16' }, { t: 'x', it: true }, { t: 'y', it: true }] },
]

const TRAPS: { id: string; val: Part[]; l1: Part[]; l2key: 'd2TrapA' | 'd2TrapB' | 'd2TrapC' }[] = [
  {
    id: 'A',
    val: OPTIONS[0].val,
    l1: [{ t: 'a² − b² ' }, { t: '≠ 0', fill: RED }],
    l2key: 'd2TrapA',
  },
  {
    id: 'B',
    val: OPTIONS[1].val,
    l1: [{ t: '(2y)² = ' }, { t: '4y²', fill: RED }],
    l2key: 'd2TrapB',
  },
  {
    id: 'C',
    val: OPTIONS[2].val,
    l1: [{ t: 'a−b = ' }, { t: '2y', fill: RED }],
    l2key: 'd2TrapC',
  },
]

type GuideStep = {
  n: string
  lawKey: 'd2GuideLaw0' | 'd2GuideLaw1' | 'd2GuideLaw2' | 'd2GuideLaw3' | 'd2GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'd2GuideLaw0',
    line: questionParts(null),
  },
  {
    n: '1',
    lawKey: 'd2GuideLaw1',
    line: [
      { t: 'a', it: true, fill: RED },
      { t: '² − ' },
      { t: 'b', it: true, fill: BLUE },
      { t: '² = (' },
      { t: 'a', it: true, fill: RED },
      { t: '+' },
      { t: 'b', it: true, fill: BLUE },
      { t: ')(' },
      { t: 'a', it: true, fill: RED },
      { t: '−' },
      { t: 'b', it: true, fill: BLUE },
      { t: ')' },
    ],
  },
  {
    n: '2',
    lawKey: 'd2GuideLaw2',
    line: [
      { t: 'a', it: true, fill: RED },
      { t: ' + ' },
      { t: 'b', it: true, fill: BLUE },
      { t: ' = 4x+y+4x−y = ' },
      { t: '8x', fill: GOLD },
    ],
  },
  {
    n: '3',
    lawKey: 'd2GuideLaw3',
    line: [
      { t: 'a', it: true, fill: RED },
      { t: ' − ' },
      { t: 'b', it: true, fill: BLUE },
      { t: ' = 4x+y−4x+y = ' },
      { t: '2y', fill: GOLD },
    ],
  },
  {
    n: '4',
    lawKey: 'd2GuideLaw4',
    line: [
      { t: '(8x)(2y) = ' },
      { t: '16x', it: true, fill: OK },
      { t: 'y', it: true, fill: OK },
      { t: '  →  D  ✓', fill: OK },
    ],
  },
]

export function SumDiffLab({ mode, onInteractComplete }: SumDiffLabProps) {
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
    if (id === 'D') {
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
    sum: mode === 'sum',
    diff: mode === 'diff',
    gate: mode === 'gate',
    multiply: mode === 'multiply',
    shortcut: mode === 'shortcut',
    expand: mode === 'expand',
    check: mode === 'check',
    guide: mode === 'guide',
  }

  /* ---- shared scenes ---- */

  const chips = (live: boolean, forceSolved = false) =>
    OPTIONS.map((o) => {
      const isAns = o.id === 'D'
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

  /** Two terms fly together, flash, and vanish — a zero pair. */
  const zeroPair = (
    ax: number,
    bx: number,
    y: number,
    u0: number,
    left: Part[],
    right: Part[],
  ) => {
    const f = clamp01((u - u0) / 0.45)
    const ringF = clamp01((u - u0 - 0.22) / 0.14)
    const fade = clamp01((u - u0 - 0.3) / 0.15)
    const cx = (ax + bx) / 2
    return (
      <g>
        <Tex x={lerp(ax, cx, f)} y={y - Math.sin(f * Math.PI) * 10} size={19} parts={left} opacity={1 - fade} />
        <Tex x={lerp(bx, cx, f)} y={y - Math.sin(f * Math.PI) * 10} size={19} parts={right} opacity={1 - fade} />
        <circle cx={cx} cy={y - 6} r={16} fill="none" stroke={MUTED} strokeWidth={2} opacity={0.9 * ringF * (1 - fade)} />
        <text x={cx} y={y - 1} textAnchor="middle" fontSize={14} fill={MUTED} opacity={ringF * (1 - fade)}>
          0
        </text>
      </g>
    )
  }

  const defCard = (y: number, color: string, letter: string, body: Part[], u0: number, fromX: number) => {
    const ui = clamp01((u - u0) / 0.45)
    const dx = lerp(fromX, 0, ui)
    return (
      <g opacity={ui} transform={`translate(${dx}, 0)`}>
        <Card x={60} y={y} w={310} h={52} />
        <circle cx={92} cy={y + 26} r={16} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1.5} />
        <text x={92} y={y + 32} textAnchor="middle" fontSize={17} fill={color} fontFamily="'Fraunces', Georgia, serif" fontWeight={700} fontStyle="italic">
          {letter}
        </text>
        <Tex x={225} y={y + 34} size={23} parts={body} />
      </g>
    )
  }

  return (
    <div className={`idx-lab ${solved ? 'is-solved' : ''}`}>
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Difference of squares: formula first, then the answer">
        {flags.ask && (
          <g>
            <Tex x={215} y={112} size={27} parts={questionParts('both')} opacity={clamp01(u / 0.3)} />
            <text x={215} y={185} textAnchor="middle" fontSize={44} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif">
              ?
            </text>
            <rect
              x={75}
              y={228}
              width={280}
              height={56}
              rx={16}
              fill="rgba(255, 209, 102, 0.08)"
              stroke={GOLD}
              strokeWidth={1.6}
              opacity={clamp01((u - 0.35) / 0.3)}
            />
            <Tex
              x={215}
              y={264}
              size={22}
              parts={[
                { t: 'a', it: true, fill: RED },
                { t: '² − ' },
                { t: 'b', it: true, fill: BLUE },
                { t: '² = (' },
                { t: 'a', it: true, fill: RED },
                { t: '+' },
                { t: 'b', it: true, fill: BLUE },
                { t: ')(' },
                { t: 'a', it: true, fill: RED },
                { t: '−' },
                { t: 'b', it: true, fill: BLUE },
                { t: ')' },
              ]}
              opacity={clamp01((u - 0.5) / 0.3)}
            />
          </g>
        )}

        {flags.laws && (
          <g>
            {[
              { id: '①', formula: 'a² − b² = (a+b)(a−b)', color: GOLD },
              { id: '②', formula: '(a+b)² − (a−b)² = 4ab', color: BLUE },
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
                  <text x={215} y={y + 40} textAnchor="middle" fontSize={21} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    {law.formula}
                  </text>
                </g>
              )
            })}
          </g>
        )}

        {flags.name && (
          <g>
            <Tex x={215} y={56} size={21} parts={questionParts('both')} />
            {defCard(96, RED, 'a', [{ t: 'a', it: true, fill: RED }, { t: ' = 4x + y' }], 0.15, -40)}
            {defCard(168, BLUE, 'b', [{ t: 'b', it: true, fill: BLUE }, { t: ' = 4x − y' }], 0.32, 40)}
            <FormulaBadge label={t.indexLawTag1} formula="a² − b² = (a+b)(a−b)" u={u} y={252} />
          </g>
        )}

        {flags.sum && (
          <g>
            <FormulaBadge label={t.indexLawTag1} formula="a² − b² = (a+b)(a−b)" u={u} />
            <Tex
              x={215}
              y={70}
              size={20}
              parts={[
                { t: 'a', it: true, fill: RED },
                { t: ' + ' },
                { t: 'b', it: true, fill: BLUE },
                { t: ' = (4x + y) + (4x − y)' },
              ]}
              opacity={clamp01(u / 0.3)}
            />
            <g opacity={clamp01((u - 0.1) / 0.25)}>
              <Card x={45} y={94} w={150} h={48} />
              <Tex x={120} y={126} size={21} parts={[{ t: '4x + ', fill: RED }, { t: 'y', it: true, fill: RED }]} />
              <text x={215} y={127} textAnchor="middle" fontSize={22} fill={MUTED}>
                +
              </text>
              <Card x={235} y={94} w={150} h={48} />
              <Tex x={310} y={126} size={21} parts={[{ t: '4x − ', fill: BLUE }, { t: 'y', it: true, fill: BLUE }]} />
            </g>
            {zeroPair(150, 285, 185, 0.3, [{ t: 'y', it: true, fill: RED }], [{ t: '−y', it: true, fill: BLUE }])}
            {(() => {
              const f = clamp01((u - 0.35) / 0.4)
              const show = clamp01((u - 0.75) / 0.25)
              return (
                <g>
                  <Tex x={lerp(90, 268, f)} y={185 - Math.sin(f * Math.PI) * 8} size={19} parts={[{ t: '4x', fill: RED }]} opacity={1 - clamp01((f - 0.8) / 0.2)} />
                  <Tex x={lerp(340, 262, f)} y={185 - Math.sin(f * Math.PI) * 8} size={19} parts={[{ t: '4x', fill: BLUE }]} opacity={1 - clamp01((f - 0.8) / 0.2)} />
                  <circle cx={265} cy={179} r={22} fill={GOLD} fillOpacity={0.12} stroke={GOLD} strokeWidth={2} opacity={show} />
                  <text x={265} y={188} textAnchor="middle" fontSize={24} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    8x
                  </text>
                </g>
              )
            })()}
            <rect x={130} y={248} width={170} height={44} rx={14} fill="rgba(255, 209, 102, 0.08)" stroke={GOLD} strokeWidth={1.5} opacity={clamp01((u - 0.8) / 0.2)} />
            <Tex
              x={215}
              y={277}
              size={20}
              parts={[
                { t: 'a', it: true, fill: RED },
                { t: ' + ' },
                { t: 'b', it: true, fill: BLUE },
                { t: ' = ' },
                { t: '8x', fill: GOLD },
              ]}
              opacity={clamp01((u - 0.85) / 0.15)}
            />
          </g>
        )}

        {flags.diff && (
          <g>
            <FormulaBadge label={t.indexLawTag1} formula="a² − b² = (a+b)(a−b)" u={u} />
            <Tex
              x={215}
              y={70}
              size={20}
              parts={[
                { t: 'a', it: true, fill: RED },
                { t: ' − ' },
                { t: 'b', it: true, fill: BLUE },
                { t: ' = (4x + y) − (4x − y)' },
              ]}
              opacity={clamp01(u / 0.3)}
            />
            <g opacity={clamp01((u - 0.1) / 0.25)}>
              <Card x={45} y={94} w={140} h={48} />
              <Tex x={115} y={126} size={21} parts={[{ t: '4x + ', fill: RED }, { t: 'y', it: true, fill: RED }]} />
              <text x={205} y={127} textAnchor="middle" fontSize={24} fill={INK}>
                −
              </text>
              <Card x={240} y={94} w={150} h={48} />
              <Tex x={300} y={126} size={21} parts={[{ t: '4x ', fill: BLUE }]} />
              {(() => {
                const f = clamp01((u - 0.35) / 0.2)
                const oldOp = 1 - f
                return (
                  <g>
                    <Tex x={352} y={126} size={21} parts={[{ t: '− ', fill: BLUE }, { t: 'y', it: true, fill: BLUE }]} opacity={oldOp} />
                    <Tex x={352} y={126} size={21} parts={[{ t: '+ ', fill: BLUE }, { t: 'y', it: true, fill: BLUE }]} opacity={f} />
                  </g>
                )
              })()}
            </g>
            <path
              d="M 212 100 Q 250 78 356 96"
              fill="none"
              stroke={GOLD}
              strokeWidth={2}
              strokeDasharray="5 4"
              opacity={0.8 * clamp01((u - 0.25) / 0.2) * (1 - clamp01((u - 0.6) / 0.2))}
            />
            {zeroPair(90, 290, 185, 0.45, [{ t: '4x', fill: RED }], [{ t: '4x', fill: BLUE }])}
            {(() => {
              const f = clamp01((u - 0.5) / 0.35)
              const show = clamp01((u - 0.85) / 0.15)
              return (
                <g>
                  <Tex x={lerp(160, 268, f)} y={185 - Math.sin(f * Math.PI) * 8} size={19} parts={[{ t: 'y', it: true, fill: RED }]} opacity={1 - clamp01((f - 0.8) / 0.2)} />
                  <Tex x={lerp(352, 262, f)} y={185 - Math.sin(f * Math.PI) * 8} size={19} parts={[{ t: '+y', it: true, fill: BLUE }]} opacity={1 - clamp01((f - 0.8) / 0.2)} />
                  <circle cx={265} cy={179} r={22} fill={GOLD} fillOpacity={0.12} stroke={GOLD} strokeWidth={2} opacity={show} />
                  <text x={265} y={188} textAnchor="middle" fontSize={24} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    2y
                  </text>
                </g>
              )
            })()}
            <text x={215} y={232} textAnchor="middle" fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.2)}>
              {t.d2Flip}
            </text>
            <rect x={130} y={248} width={170} height={44} rx={14} fill="rgba(255, 209, 102, 0.08)" stroke={GOLD} strokeWidth={1.5} opacity={clamp01((u - 0.85) / 0.15)} />
            <Tex
              x={215}
              y={277}
              size={20}
              parts={[
                { t: 'a', it: true, fill: RED },
                { t: ' − ' },
                { t: 'b', it: true, fill: BLUE },
                { t: ' = ' },
                { t: '2y', fill: GOLD },
              ]}
              opacity={clamp01((u - 0.9) / 0.1)}
            />
          </g>
        )}

        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <FormulaBadge label={t.indexLawTag1} formula="a² − b² = (a+b)(a−b)" u={1} y={10} />
            <Tex
              x={215}
              y={92}
              size={27}
              parts={[
                { t: '(' },
                { t: 'a', it: true, fill: RED },
                { t: '+' },
                { t: 'b', it: true, fill: BLUE },
                { t: ')(' },
                { t: 'a', it: true, fill: RED },
                { t: '−' },
                { t: 'b', it: true, fill: BLUE },
                { t: ') = (' },
                { t: '8x', fill: GOLD },
                { t: ')(' },
                { t: '2y', fill: GOLD },
                { t: ')' },
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
                { t: 'a', it: true, fill: RED },
                { t: '+' },
                { t: 'b', it: true, fill: BLUE },
                { t: ' = 8x   ·   ' },
                { t: 'a', it: true, fill: RED },
                { t: '−' },
                { t: 'b', it: true, fill: BLUE },
                { t: ' = 2y' },
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
                  { t: '(8x)(2y) = ' },
                  { t: '16', fill: OK },
                  { t: 'x', it: true, fill: OK },
                  { t: 'y', it: true, fill: OK },
                  { t: '  ✓', fill: OK },
                ]}
              />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.d2WhyA : wrongId === 'B' ? t.d2WhyB : t.d2WhyC}
              </text>
            ) : (
              <text x={215} y={314} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                {t.indexHint}
              </text>
            )}
          </g>
        )}

        {flags.multiply && (
          <g>
            <FormulaBadge label={t.indexLawTag1} formula="(8x)(2y)" u={u} />
            {(() => {
              const f = clamp01((u - 0.1) / 0.45)
              const show = clamp01((u - 0.55) / 0.3)
              return (
                <g>
                  <g opacity={1 - clamp01((f - 0.85) / 0.15)}>
                    <rect x={lerp(60, 158, f)} y={56} width={110} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={GOLD} strokeWidth={1.6} />
                    <Tex x={lerp(115, 213, f)} y={89} size={24} parts={[{ t: '8x', fill: GOLD }]} />
                    <rect x={lerp(260, 162, f)} y={56} width={110} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={GOLD} strokeWidth={1.6} />
                    <Tex x={lerp(315, 217, f)} y={89} size={24} parts={[{ t: '2y', fill: GOLD }]} />
                  </g>
                  <circle cx={215} cy={150} r={46} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.5 * show} />
                  <text x={215} y={166} textAnchor="middle" fontSize={44} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    16xy
                  </text>
                  <Tex
                    x={215}
                    y={222}
                    size={16}
                    parts={[{ t: '8 × 2 = 16', fill: GOLD }, { t: '   ·   ' }, { t: 'x', it: true }, { t: ' · ' }, { t: 'y', it: true }, { t: ' = ' }, { t: 'x', it: true }, { t: 'y', it: true }]}
                    opacity={clamp01((u - 0.7) / 0.25)}
                  />
                  <text x={215} y={262} textAnchor="middle" fontSize={24} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.85) / 0.15)}>
                    → D ✓
                  </text>
                </g>
              )
            })()}
          </g>
        )}

        {flags.shortcut && (
          <g>
            <g opacity={clamp01(u / 0.35)}>
              <circle cx={44} cy={60} r={13} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.4} />
              <text x={44} y={65} textAnchor="middle" fontSize={14} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                ②
              </text>
              <text x={66} y={65} fontSize={13} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                {t.indexLawTag2}
              </text>
            </g>
            <g opacity={clamp01((u - 0.2) / 0.3)}>
              <rect x={36} y={82} width={358} height={56} rx={16} fill="rgba(76, 201, 240, 0.08)" stroke={BLUE} strokeWidth={1.6} />
              <text x={215} y={118} textAnchor="middle" fontSize={20} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                (a+b)² − (a−b)² = 4ab
              </text>
            </g>
            <g opacity={clamp01((u - 0.45) / 0.25)}>
              <rect x={316} y={44} width={78} height={26} rx={13} fill="rgba(255, 209, 102, 0.15)" stroke={GOLD} strokeWidth={1.2} />
              <text x={355} y={61} textAnchor="middle" fontSize={12} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700} className="idx-pulse">
                {t.d2OneLine}
              </text>
            </g>
            <Tex
              x={215}
              y={188}
              size={22}
              parts={[
                { t: '= 4 · ' },
                { t: '(4x', it: true, fill: RED },
                { t: ')(' },
                { t: 'y', it: true, fill: BLUE },
                { t: ')' },
              ]}
              opacity={clamp01((u - 0.55) / 0.25)}
            />
            <text x={215} y={238} textAnchor="middle" fontSize={30} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
              = 16xy
            </text>
            <text x={215} y={282} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.85) / 0.15)}>
              {t.d2CheckNote}
            </text>
          </g>
        )}

        {flags.expand && (
          <g>
            <FormulaBadge label={t.d2ExpandTag} formula="(4x+y)² − (4x−y)²" u={u} color={BLUE} />
            <Tex x={20} y={92} size={13} parts={[{ t: '(4x+y)²' }]} anchor="start" opacity={0.7} />
            <Tex x={122} y={92} size={17} parts={[{ t: '= ' }, { t: '16x²', fill: GOLD }, { t: ' + 8xy + ' }, { t: 'y²', fill: GOLD }]} anchor="start" opacity={clamp01((u - 0.1) / 0.25)} />
            <Tex x={20} y={128} size={13} parts={[{ t: '(4x−y)²' }]} anchor="start" opacity={0.7} />
            <Tex x={122} y={128} size={17} parts={[{ t: '= ' }, { t: '16x²', fill: GOLD }, { t: ' − 8xy + ' }, { t: 'y²', fill: GOLD }]} anchor="start" opacity={clamp01((u - 0.2) / 0.25)} />
            {([92, 128] as const).map((cy) =>
              ([151, 236] as const).map((cx) => {
                const f = clamp01((u - 0.4) / 0.25)
                return (
                  <g key={`${cy}-${cx}`}>
                    <circle cx={cx} cy={cy - 6} r={16} fill="none" stroke={RED} strokeWidth={1.6} opacity={0.85 * f} />
                    <text x={cx + 17} y={cy - 18} textAnchor="middle" fontSize={12} fill={RED} opacity={f}>
                      ✕
                    </text>
                  </g>
                )
              }),
            )}
            <Tex
              x={215}
              y={186}
              size={19}
              parts={[{ t: '8xy − (−8xy)' }, { t: ' = 8xy + 8xy' }]}
              opacity={clamp01((u - 0.55) / 0.25)}
            />
            <text x={215} y={232} textAnchor="middle" fontSize={28} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
              = 16xy
            </text>
            <text x={215} y={272} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.85) / 0.15)}>
              {t.d2ExpandNote}
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
                { t: '(8x)(2y) = ' },
                { t: '16', fill: OK },
                { t: 'x', it: true, fill: OK },
                { t: 'y', it: true, fill: OK },
                { t: '  ✓ D', fill: OK },
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
          <span className="sum">{t.d2Ready}</span>
        </p>
      )}
      {flags.name && (
        <p className="vm-eq show">
          <span className="a">a = 4x+y</span>
          <span className="op">·</span>
          <span className="b">b = 4x−y</span>
        </p>
      )}
      {flags.sum && (
        <p className="vm-eq show">
          <span className="a">a + b</span>
          <span className="op">=</span>
          <span className="sum">8x</span>
        </p>
      )}
      {flags.diff && (
        <p className="vm-eq show">
          <span className="a">a − b</span>
          <span className="op">=</span>
          <span className="sum">2y</span>
        </p>
      )}
      {flags.gate && (
        <p className="vm-eq show">
          <span className="a">(8x)(2y)</span>
          <span className="op">=</span>
          <span className="sum">?</span>
        </p>
      )}
      {flags.multiply && (
        <p className="vm-eq show">
          <span className="a">(8x)(2y)</span>
          <span className="op">=</span>
          <span className="sum">16xy</span>
          <span className="op">→</span>
          <span className="a">D ✓</span>
        </p>
      )}
      {flags.shortcut && (
        <p className="vm-eq show">
          <span className="a">4ab</span>
          <span className="op">=</span>
          <span className="sum">16xy</span>
        </p>
      )}
      {flags.check && (
        <p className="vm-eq show">
          <span className="a">A·B·C ✗</span>
          <span className="op">·</span>
          <span className="sum">D ✓</span>
        </p>
      )}
      {flags.guide && (
        <p className="vm-eq show">
          <span className="a">{t.d2GuideThink}</span>
          <span className="op">→</span>
          <span className="sum">16xy = D</span>
        </p>
      )}
    </div>
  )
}
