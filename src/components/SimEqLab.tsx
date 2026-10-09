import { useEffect, useRef, useState } from 'react'
import type { SimEqLabProps } from '../data/types'
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

/* ---- pieces of m + 2n + 6 = 2m − n = 7 ---- */
const CHAIN_PARTS: Part[] = [
  { t: 'm', it: true },
  { t: ' + 2' },
  { t: 'n', it: true },
  { t: ' + 6 ' },
  { t: '=', fill: BLUE },
  { t: ' 2' },
  { t: 'm', it: true },
  { t: ' − ' },
  { t: 'n', it: true },
  { t: ' =', fill: BLUE },
  { t: ' 7' },
]

const EQ1_PARTS: Part[] = [{ t: 'm', it: true }, { t: ' + 2' }, { t: 'n', it: true }, { t: ' + 6 = 7' }]

const EQ1S_PARTS: Part[] = [
  { t: 'm', it: true },
  { t: ' + 2' },
  { t: 'n', it: true },
  { t: ' = ' },
  { t: '1', fill: GOLD },
]

const EQ2_PARTS: Part[] = [{ t: '2' }, { t: 'm', it: true }, { t: ' − ' }, { t: 'n', it: true }, { t: ' = 7' }]

const TIMES2_PARTS: Part[] = [
  { t: '2' },
  { t: 'm', it: true },
  { t: ' + 4' },
  { t: 'n', it: true },
  { t: ' = 2', fill: BLUE },
]

const FIVE_N: Part[] = [
  { t: '5', fill: GOLD },
  { t: 'n', it: true, fill: GOLD },
  { t: ' = −5', fill: GOLD },
]

const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; val: Part[] }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: [{ t: '−4' }] },
  { id: 'B', val: [{ t: '−1' }] },
  { id: 'C', val: [{ t: '3' }] },
  { id: 'D', val: [{ t: '11' }] },
]
const ANSWER = 'B'

type TrapDef = { id: string; val: Part[]; l1: Part[]; noteKey: 'd5TrapA' | 'd5TrapC' | 'd5TrapD' }

const TRAPS: Record<'trapA' | 'trapC' | 'trapD', TrapDef> = {
  trapA: {
    id: 'A',
    val: OPTIONS[0].val,
    l1: [{ t: 'n = m − 7 = ' }, { t: '−4', fill: RED }],
    noteKey: 'd5TrapA',
  },
  trapC: {
    id: 'C',
    val: OPTIONS[2].val,
    l1: [{ t: 'm = 3', fill: RED }, { t: ' ≠ n' }],
    noteKey: 'd5TrapC',
  },
  trapD: {
    id: 'D',
    val: OPTIONS[3].val,
    l1: [{ t: '7 + 6 − 2 = ' }, { t: '11', fill: RED }],
    noteKey: 'd5TrapD',
  },
}

type GuideStep = {
  n: string
  lawKey: 'd5GuideLaw0' | 'd5GuideLaw1' | 'd5GuideLaw2' | 'd5GuideLaw3' | 'd5GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'd5GuideLaw0',
    line: CHAIN_PARTS,
  },
  {
    n: '1',
    lawKey: 'd5GuideLaw1',
    line: [{ t: '① m+2n=1' }, { t: '   ·   ' }, { t: '② 2m−n=7', fill: BLUE }],
  },
  {
    n: '2',
    lawKey: 'd5GuideLaw2',
    line: [{ t: '2×① − ②:  ' }, { t: '5n = −5', fill: GOLD }],
  },
  {
    n: '3',
    lawKey: 'd5GuideLaw3',
    line: [{ t: 'n = ' }, { t: '−1', fill: GOLD }, { t: ',   m = 3' }],
  },
  {
    n: '4',
    lawKey: 'd5GuideLaw4',
    line: [{ t: '✓ + ✓ · (−1, 3)  →  ' }, { t: 'B ✓', fill: OK }],
  },
]

export function SimEqLab({ mode, onInteractComplete }: SimEqLabProps) {
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
    split1: mode === 'split1',
    split2: mode === 'split2',
    elim: mode === 'elim',
    elim2: mode === 'elim2',
    gate: mode === 'gate',
    answer: mode === 'answer',
    verify1: mode === 'verify1',
    verify2: mode === 'verify2',
    graph: mode === 'graph',
    trapA: mode === 'trapA',
    trapC: mode === 'trapC',
    trapD: mode === 'trapD',
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
          <text x={ci + 13} y={CHIP_Y + 20} fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
            {o.id}
          </text>
          <Tex x={ci + CHIP_W / 2 + 4} y={CHIP_Y + 40} size={22} parts={o.val} />
          {solved && isAns && (
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

  return (
    <div className={`idx-lab ${solved ? 'is-solved' : ''}`}>
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Chained equality: split into two equations, eliminate, solve">
        {flags.ask && (
          <g>
            <FormulaBadge label="Q5" formula={t.d5ChainEq} u={u} />
            <Tex x={215} y={150} size={22} parts={CHAIN_PARTS} opacity={clamp01(u / 0.3)} />
            <text x={215} y={238} textAnchor="middle" fontSize={46} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.3) / 0.3)}>
              n = ?
            </text>
            <text x={215} y={292} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.25)}>
              A −4      B −1      C 3      D 11
            </text>
          </g>
        )}

        {flags.why && (
          <g>
            <FormulaBadge label="WHY" formula={t.d5WhyBadge} u={u} color={BLUE} />
            {(() => {
              const l = clamp01((u - 0.15) / 0.4)
              const r = clamp01((u - 0.35) / 0.4)
              const dots = [0, 0.25, 0.5, 0.75, 1].map((s) => ({
                cx: 40 + s * 135,
                cy: 196 - s * 86,
              }))
              return (
                <g>
                  <g opacity={l}>
                    <Card x={10} y={84} w={195} h={158} />
                    <line x1={40} y1={206} x2={175} y2={120} stroke={LINE} strokeWidth={1.8} strokeDasharray="5 4" />
                    {dots.map((d, i) => (
                      <circle key={i} cx={d.cx} cy={d.cy + 10} r={3.5} fill={MUTED} />
                    ))}
                    <text x={107} y={232} textAnchor="middle" fontSize={19} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                      ∞
                    </text>
                  </g>
                  <g opacity={r}>
                    <Card x={225} y={84} w={195} h={158} />
                    <line x1={250} y1={206} x2={395} y2={116} stroke={GOLD} strokeWidth={2.2} />
                    <line x1={250} y1={122} x2={395} y2={202} stroke={BLUE} strokeWidth={2.2} />
                    <circle cx={322} cy={161} r={11} fill={GOLD} fillOpacity={0.15} stroke={GOLD} strokeWidth={1.5} className="idx-pulse" />
                    <circle cx={322} cy={161} r={4.5} fill={GOLD} />
                  </g>
                </g>
              )
            })()}
            <text x={107} y={272} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.5) / 0.3)}>
              {t.d5WhyOne}
            </text>
            <text x={322} y={272} textAnchor="middle" fontSize={12} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.6) / 0.3)}>
              {t.d5WhyTwo}
            </text>
          </g>
        )}

        {flags.split1 && (
          <g>
            <Tex x={215} y={95} size={15} parts={CHAIN_PARTS} opacity={0.5 * clamp01(u / 0.25)} />
            <line x1={215} y1={106} x2={215} y2={132} stroke={GOLD} strokeWidth={1.4} opacity={clamp01((u - 0.12) / 0.2)} />
            <path d="M 210 126 L 215 136 L 220 126" fill="none" stroke={GOLD} strokeWidth={1.4} opacity={clamp01((u - 0.12) / 0.2)} />
            {(() => {
              const c = clamp01((u - 0.25) / 0.35)
              return (
                <g opacity={c} transform={`translate(0, ${(1 - c) * 14})`}>
                  <Card x={55} y={148} w={320} h={92} />
                  <circle cx={92} cy={194} r={17} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
                  <text x={92} y={200} textAnchor="middle" fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    ①
                  </text>
                  <Tex x={240} y={182} size={15} parts={EQ1_PARTS} opacity={0.6} />
                  <Tex x={240} y={216} size={21} parts={EQ1S_PARTS} />
                </g>
              )
            })()}
          </g>
        )}

        {flags.split2 && (
          <g>
            <Tex x={215} y={95} size={15} parts={CHAIN_PARTS} opacity={0.5 * clamp01(u / 0.25)} />
            <line x1={215} y1={106} x2={215} y2={132} stroke={BLUE} strokeWidth={1.4} opacity={clamp01((u - 0.12) / 0.2)} />
            <path d="M 210 126 L 215 136 L 220 126" fill="none" stroke={BLUE} strokeWidth={1.4} opacity={clamp01((u - 0.12) / 0.2)} />
            {(() => {
              const c = clamp01((u - 0.25) / 0.35)
              return (
                <g opacity={c} transform={`translate(0, ${(1 - c) * 14})`}>
                  <Card x={55} y={152} w={320} h={72} />
                  <circle cx={92} cy={188} r={17} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
                  <text x={92} y={194} textAnchor="middle" fontSize={15} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    ②
                  </text>
                  <Tex x={240} y={196} size={22} parts={EQ2_PARTS} />
                </g>
              )
            })()}
          </g>
        )}

        {flags.elim && (
          <g>
            <Tex x={215} y={100} size={16} parts={[{ t: '① ' }, ...EQ1S_PARTS]} opacity={0.6 * clamp01(u / 0.25)} />
            <line x1={215} y1={112} x2={215} y2={140} stroke={BLUE} strokeWidth={1.4} opacity={clamp01((u - 0.15) / 0.2)} />
            <path d="M 210 134 L 215 144 L 220 134" fill="none" stroke={BLUE} strokeWidth={1.4} opacity={clamp01((u - 0.15) / 0.2)} />
            <text x={237} y={134} fontSize={15} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700} opacity={clamp01((u - 0.25) / 0.2)}>
              × 2
            </text>
            {(() => {
              const c = clamp01((u - 0.35) / 0.35)
              return (
                <g opacity={c} transform={`translate(0, ${(1 - c) * 14})`}>
                  <Card x={65} y={158} w={300} h={74} />
                  <Tex x={215} y={204} size={22} parts={TIMES2_PARTS} />
                </g>
              )
            })()}
          </g>
        )}

        {flags.elim2 && (
          <g>
            <FormulaBadge label={t.d5ElimTag} formula="2×① − ②" u={u} />
            <Tex x={215} y={150} size={18} parts={TIMES2_PARTS} opacity={clamp01((u - 0.15) / 0.25)} />
            <Tex x={215} y={182} size={18} parts={EQ2_PARTS} opacity={clamp01((u - 0.3) / 0.25)} />
            <text x={132} y={174} fontSize={17} fill={RED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.45) / 0.2)}>
              −
            </text>
            <line x1={150} y1={196} x2={320} y2={196} stroke={LINE} strokeWidth={1.4} opacity={clamp01((u - 0.45) / 0.2)} />
            <line x1={167} y1={144} x2={193} y2={144} stroke={RED} strokeWidth={2.2} opacity={clamp01((u - 0.55) / 0.2)} />
            <line x1={172} y1={176} x2={198} y2={176} stroke={RED} strokeWidth={2.2} opacity={clamp01((u - 0.62) / 0.2)} />
            {(() => {
              const k = clamp01((u - 0.7) / 0.25)
              return (
                <g opacity={k} transform={`translate(0, ${(1 - k) * 12})`}>
                  <rect x={140} y={216} width={150} height={46} rx={14} fill="rgba(255, 209, 102, 0.08)" stroke={GOLD} strokeWidth={1.5} />
                  <Tex x={215} y={246} size={20} parts={FIVE_N} />
                </g>
              )
            })()}
            <Tex
              x={215}
              y={296}
              size={13}
              parts={[{ t: '4' }, { t: 'n', it: true }, { t: ' + ' }, { t: 'n', it: true }, { t: ' = 5' }, { t: 'n', it: true }]}
              opacity={clamp01((u - 0.85) / 0.15)}
            />
          </g>
        )}

        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <FormulaBadge label={t.d5ElimTag} formula="5n = −5" u={1} y={10} />
            <text x={215} y={160} textAnchor="middle" fontSize={40} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif">
              n = ?
            </text>
            {chips(true)}
            {solved ? (
              <Tex
                x={215}
                y={314}
                size={16}
                parts={[{ t: 'n = −5 ÷ 5 = ' }, { t: '−1', fill: OK }, { t: '  ✓', fill: OK }]}
              />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.d5WhyA : wrongId === 'C' ? t.d5WhyC : t.d5WhyD}
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
            <circle cx={215} cy={150} r={56} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.5 * clamp01((u - 0.1) / 0.35)} />
            <text x={215} y={163} textAnchor="middle" fontSize={36} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.1) / 0.35)}>
              n = −1
            </text>
            <Tex
              x={215}
              y={238}
              size={14}
              parts={[{ t: 'm', it: true }, { t: ' = 1 − 2(−1) = ' }, { t: '3', fill: BLUE }]}
              opacity={clamp01((u - 0.55) / 0.25)}
            />
            <text x={215} y={288} textAnchor="middle" fontSize={26} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
              → B ✓
            </text>
          </g>
        )}

        {flags.verify1 && (
          <g>
            {(() => {
              const c = clamp01((u - 0.15) / 0.35)
              return (
                <g opacity={c} transform={`translate(0, ${(1 - c) * 14})`}>
                  <Card x={60} y={125} w={310} h={80} />
                  <circle cx={97} cy={165} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.4} />
                  <text x={97} y={170} textAnchor="middle" fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    ①
                  </text>
                  <Tex x={235} y={173} size={18} parts={[{ t: '3 + 2(−1) + 6 = ' }, { t: '7 ✓', fill: OK }]} />
                </g>
              )
            })()}
          </g>
        )}

        {flags.verify2 && (
          <g>
            {(() => {
              const c = clamp01((u - 0.15) / 0.35)
              return (
                <g opacity={c} transform={`translate(0, ${(1 - c) * 14})`}>
                  <Card x={60} y={125} w={310} h={80} />
                  <circle cx={97} cy={165} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.4} />
                  <text x={97} y={170} textAnchor="middle" fontSize={13} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    ②
                  </text>
                  <Tex x={235} y={173} size={18} parts={[{ t: '2(3) − (−1) = ' }, { t: '7 ✓', fill: OK }]} />
                </g>
              )
            })()}
          </g>
        )}

        {flags.graph && (
          <g>
            {(() => {
              const ax = clamp01(u / 0.25)
              const l1 = clamp01((u - 0.2) / 0.3)
              const l2 = clamp01((u - 0.4) / 0.3)
              const pt = clamp01((u - 0.6) / 0.3)
              return (
                <g>
                  <g opacity={ax}>
                    <line x1={60} y1={170} x2={404} y2={170} stroke={LINE} strokeWidth={1.4} />
                    <line x1={225} y1={296} x2={225} y2={70} stroke={LINE} strokeWidth={1.4} />
                    <path d="M 398 165 L 408 170 L 398 175" fill="none" stroke={LINE} strokeWidth={1.4} />
                    <path d="M 220 76 L 225 66 L 230 76" fill="none" stroke={LINE} strokeWidth={1.4} />
                    <text x={413} y={175} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                      n
                    </text>
                    <text x={237} y={80} fontSize={13} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                      m
                    </text>
                    <text x={215} y={184} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                      O
                    </text>
                  </g>
                  <g opacity={l1}>
                    <line x1={150} y1={62} x2={330} y2={278} stroke={GOLD} strokeWidth={2.2} />
                    <text x={334} y={298} fontSize={11.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                      ① m + 2n = 1
                    </text>
                  </g>
                  <g opacity={l2}>
                    <line x1={75} y1={278} x2={375} y2={62} stroke={BLUE} strokeWidth={2.2} />
                    <text x={60} y={300} fontSize={11.5} fill={BLUE} fontFamily="'Fraunces', Georgia, serif">
                      ② 2m − n = 7
                    </text>
                  </g>
                  <g opacity={pt}>
                    <circle cx={195} cy={116} r={11} fill={GOLD} fillOpacity={0.15} stroke={GOLD} strokeWidth={1.6} className="idx-pulse" />
                    <circle cx={195} cy={116} r={4.5} fill={GOLD} />
                    <text x={209} y={106} fontSize={14} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                      (−1, 3)
                    </text>
                  </g>
                </g>
              )
            })()}
          </g>
        )}

        {(flags.trapA || flags.trapC || flags.trapD) &&
          (() => {
            const trap = TRAPS[mode as 'trapA' | 'trapC' | 'trapD']
            const c = clamp01((u - 0.15) / 0.35)
            return (
              <g opacity={c} transform={`translate(0, ${(1 - c) * 14})`}>
                <Card x={70} y={90} w={290} h={170} />
                <Tex x={215} y={136} size={24} parts={[{ t: trap.id, fill: RED }, { t: ' · ' }, ...trap.val]} />
                <line x1={100} y1={154} x2={330} y2={154} stroke="rgba(242,245,255,0.25)" strokeWidth={1} />
                <Tex x={215} y={192} size={17} parts={trap.l1} />
                <text x={215} y={224} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                  {t[trap.noteKey]}
                </text>
                <text x={215} y={252} textAnchor="middle" fontSize={22} fill={RED} opacity={0.9}>
                  ✗
                </text>
              </g>
            )
          })()}

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
