import { useEffect, useRef, useState } from 'react'
import type { CubicFacLabProps } from '../data/types'
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

/* ---- pieces of x³ + 4x² + kx − 12 ---- */
const F_PARTS: Part[] = [
  { t: 'x', it: true },
  { t: '3', sup: true },
  { t: ' + 4' },
  { t: 'x', it: true },
  { t: '2', sup: true },
  { t: ' + ' },
  { t: 'k', it: true, fill: GOLD },
  { t: 'x', it: true, fill: GOLD },
  { t: ' − 12' },
]

const FX_PARTS: Part[] = [{ t: 'f(', }, { t: 'x', it: true }, { t: ') = ' }, ...F_PARTS]

/** The substituted line; `hi` paints the powers or the result. */
function subParts(): Part[] {
  return [
    { t: 'f(−3) = ' },
    { t: '(−3)', fill: RED },
    { t: '3', sup: true, fill: RED },
    { t: ' + 4' },
    { t: '(−3)', fill: BLUE },
    { t: '2', sup: true, fill: BLUE },
    { t: ' + ' },
    { t: 'k', it: true, fill: GOLD },
    { t: '(−3) − 12' },
  ]
}

const MERGED_PARTS: Part[] = [
  { t: '−27 + 36 ' },
  { t: '− 3', fill: BLUE },
  { t: 'k', it: true, fill: GOLD },
  { t: ' − 12 = 0' },
]

const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; val: Part[] }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: [{ t: '−25' }] },
  { id: 'B', val: [{ t: '−1' }] },
  { id: 'C', val: [{ t: '1' }] },
  { id: 'D', val: [{ t: '17' }] },
]
const ANSWER = 'B'

const TRAPS: { id: string; val: Part[]; l1: Part[]; l2key: 'd4TrapA' | 'd4TrapC' | 'd4TrapD' }[] = [
  {
    id: 'A',
    val: OPTIONS[0].val,
    l1: [{ t: '(−3)² = ' }, { t: '−36', fill: RED }],
    l2key: 'd4TrapA',
  },
  {
    id: 'C',
    val: OPTIONS[2].val,
    l1: [{ t: '−3k = 3 → k = ' }, { t: '+1', fill: RED }],
    l2key: 'd4TrapC',
  },
  {
    id: 'D',
    val: OPTIONS[3].val,
    l1: [{ t: '(−3)³ = ' }, { t: '+27', fill: RED }],
    l2key: 'd4TrapD',
  },
]

type GuideStep = {
  n: string
  lawKey: 'd4GuideLaw0' | 'd4GuideLaw1' | 'd4GuideLaw2' | 'd4GuideLaw3' | 'd4GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'd4GuideLaw0',
    line: FX_PARTS,
  },
  {
    n: '1',
    lawKey: 'd4GuideLaw1',
    line: [{ t: '(x+3) ∣ f(x)  →  ' }, { t: 'f(−3) = 0', fill: GOLD }],
  },
  {
    n: '2',
    lawKey: 'd4GuideLaw2',
    line: [{ t: '(−3)³+4(−3)²' }, { t: '−3k', fill: GOLD }, { t: '−12 = 0' }],
  },
  {
    n: '3',
    lawKey: 'd4GuideLaw3',
    line: [{ t: '−3 − 3k = 0  →  ' }, { t: 'k = −1', fill: GOLD }],
  },
  {
    n: '4',
    lawKey: 'd4GuideLaw4',
    line: [{ t: '÷(x+3): r = −3−3k = 0 → ' }, { t: 'B ✓', fill: OK }],
  },
]

export function CubicFacLab({ mode, onInteractComplete }: CubicFacLabProps) {
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
    sub: mode === 'sub',
    calc: mode === 'calc',
    gate: mode === 'gate',
    answer: mode === 'answer',
    synth: mode === 'synth',
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

  return (
    <div className={`idx-lab ${solved ? 'is-solved' : ''}`}>
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Cubic divisibility: factor theorem, substitute, solve">
        {flags.ask && (
          <g>
            <FormulaBadge label="x+3" formula={t.d4FactorEq} u={u} />
            <Tex x={215} y={118} size={21} parts={FX_PARTS} opacity={clamp01(u / 0.3)} />
            <Tex
              x={215}
              y={158}
              size={17}
              parts={[{ t: '÷ (' }, { t: 'x', it: true }, { t: ' + 3)', fill: BLUE }]}
              opacity={clamp01((u - 0.15) / 0.3)}
            />
            <text x={215} y={218} textAnchor="middle" fontSize={44} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.25) / 0.3)}>
              k = ?
            </text>
            <rect
              x={55}
              y={248}
              width={320}
              height={52}
              rx={16}
              fill="rgba(255, 209, 102, 0.08)"
              stroke={GOLD}
              strokeWidth={1.6}
              opacity={clamp01((u - 0.55) / 0.3)}
            />
            <Tex
              x={215}
              y={281}
              size={17}
              parts={[{ t: '(x+3) ∣ f(x)  ⟺  ' }, { t: 'f(−3) = 0', fill: GOLD }]}
              opacity={clamp01((u - 0.65) / 0.25)}
            />
          </g>
        )}

        {flags.laws && (
          <g>
            {[
              { id: '①', body: t.d4Law1, color: GOLD, size: 13.5 },
              { id: '②', body: t.d4Law2, color: BLUE, size: 15.5 },
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
                  <text x={225} y={y + 38} textAnchor="middle" fontSize={law.size} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    {law.body}
                  </text>
                </g>
              )
            })}
          </g>
        )}

        {flags.name && (
          <g>
            <Tex x={215} y={56} size={16} parts={FX_PARTS} />
            {(() => {
              const l = clamp01((u - 0.15) / 0.45)
              const r = clamp01((u - 0.32) / 0.45)
              return (
                <g>
                  <g opacity={l} transform={`translate(${lerp(-40, 0, l)}, 0)`}>
                    <Card x={60} y={96} w={310} h={52} />
                    <circle cx={92} cy={122} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
                    <text x={92} y={127} textAnchor="middle" fontSize={14} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700} fontStyle="italic">
                      f
                    </text>
                    <Tex x={228} y={130} size={17} parts={F_PARTS} />
                  </g>
                  <g opacity={r} transform={`translate(${lerp(40, 0, r)}, 0)`}>
                    <Card x={60} y={168} w={310} h={52} />
                    <circle cx={92} cy={194} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
                    <text x={92} y={199} textAnchor="middle" fontSize={13} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                      ∣
                    </text>
                    <Tex x={228} y={202} size={17} parts={[{ t: '(x+3) ∣ f(x)  →  ' }, { t: 'f(−3) = 0', fill: GOLD }]} />
                  </g>
                </g>
              )
            })()}
            <FormulaBadge label={t.indexLawTag1} formula="f(−3) = 0" u={u} y={252} />
          </g>
        )}

        {flags.sub && (
          <g>
            <FormulaBadge label={t.indexLawTag1} formula="f(−3) = 0" u={u} />
            <Tex x={215} y={95} size={17} parts={subParts()} opacity={clamp01(u / 0.3)} />
            {[
              { term: '(−3)³', val: '−27', fill: RED },
              { term: '4(−3)²', val: '+36', fill: BLUE },
              { term: 'k(−3)', val: '−3k', fill: GOLD },
              { term: '−12', val: '−12', fill: INK },
            ].map((c, i) => {
              const ui = clamp01((u - 0.15 - i * 0.08) / 0.3)
              const x = CHIP_X[i]
              return (
                <g key={c.term} opacity={ui} transform={`translate(0, ${(1 - ui) * 14})`}>
                  <Card x={x} y={140} w={CHIP_W} h={64} />
                  <text x={x + CHIP_W / 2} y={162} textAnchor="middle" fontSize={13} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                    {c.term}
                  </text>
                  <text x={x + CHIP_W / 2} y={190} textAnchor="middle" fontSize={19} fontWeight={700} fill={c.fill} fontFamily="'Fraunces', Georgia, serif">
                    {c.val}
                  </text>
                </g>
              )
            })}
            <text x={215} y={242} textAnchor="middle" fontSize={14} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.55) / 0.2)}>
              {t.d4PowerNote}
            </text>
            <rect x={115} y={258} width={200} height={44} rx={14} fill="rgba(255, 209, 102, 0.08)" stroke={GOLD} strokeWidth={1.5} opacity={clamp01((u - 0.75) / 0.25)} />
            <Tex x={215} y={287} size={19} parts={MERGED_PARTS} opacity={clamp01((u - 0.8) / 0.2)} />
          </g>
        )}

        {flags.calc && (
          <g>
            <FormulaBadge label={t.indexLawTag2} formula="−3 − 3k = 0" u={u} />
            <Tex x={215} y={92} size={18} parts={MERGED_PARTS} opacity={clamp01(u / 0.3)} />
            {(() => {
              const g1 = clamp01((u - 0.25) / 0.25)
              const g2 = clamp01((u - 0.45) / 0.25)
              return (
                <g>
                  <g opacity={g1} transform={`translate(0, ${(1 - g1) * 14})`}>
                    <Card x={115} y={116} w={200} h={42} />
                    <Tex x={215} y={144} size={18} parts={[{ t: '−27 + 36 = ' }, { t: '9', fill: BLUE }]} />
                  </g>
                  <g opacity={g2} transform={`translate(0, ${(1 - g2) * 14})`}>
                    <Card x={115} y={170} w={200} h={42} />
                    <Tex x={215} y={198} size={18} parts={[{ t: '9 − 12 = ' }, { t: '−3', fill: BLUE }]} />
                  </g>
                </g>
              )
            })()}
            <rect x={130} y={248} width={170} height={44} rx={14} fill="rgba(255, 209, 102, 0.08)" stroke={GOLD} strokeWidth={1.5} opacity={clamp01((u - 0.75) / 0.25)} />
            <Tex
              x={215}
              y={277}
              size={20}
              parts={[{ t: '−3 − 3' }, { t: 'k', it: true, fill: GOLD }, { t: ' = 0' }]}
              opacity={clamp01((u - 0.8) / 0.2)}
            />
          </g>
        )}

        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <FormulaBadge label={t.indexLawTag2} formula="−3 − 3k = 0" u={1} y={10} />
            <Tex
              x={215}
              y={100}
              size={27}
              parts={[{ t: '−3 − 3' }, { t: 'k', it: true, fill: GOLD }, { t: ' = 0' }]}
            />
            <text x={215} y={148} textAnchor="middle" fontSize={30} fill={GOLD} className="idx-pulse" fontFamily="'Fraunces', Georgia, serif">
              k = ?
            </text>
            <Tex
              x={215}
              y={186}
              size={15}
              parts={[{ t: 'x = −3   ·   ' }, { t: 'f(−3) = 0', fill: GOLD }]}
              opacity={0.8}
            />
            {chips(true)}
            {solved ? (
              <Tex
                x={215}
                y={314}
                size={16}
                parts={[{ t: '−3k = 3 → k = ' }, { t: '−1', fill: OK }, { t: '  ✓', fill: OK }]}
              />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.d4WhyA : wrongId === 'C' ? t.d4WhyC : t.d4WhyD}
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
            <FormulaBadge label={t.indexLawTag2} formula="−3 − 3k = 0" u={u} />
            {(() => {
              const f = clamp01((u - 0.1) / 0.45)
              const show = clamp01((u - 0.55) / 0.3)
              return (
                <g>
                  <g opacity={1 - clamp01((f - 0.85) / 0.15)}>
                    <rect x={lerp(60, 130, f)} y={56} width={150} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={GOLD} strokeWidth={1.6} />
                    <Tex x={lerp(135, 205, f)} y={89} size={21} parts={[{ t: '−3 − 3k = 0' }]} />
                    <rect x={lerp(260, 175, f)} y={56} width={110} height={50} rx={14} fill="rgba(255,255,255,0.05)" stroke={GOLD} strokeWidth={1.6} />
                    <Tex x={lerp(315, 230, f)} y={89} size={21} parts={[{ t: '−3k = 3', fill: GOLD }]} />
                  </g>
                  <circle cx={215} cy={150} r={56} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.5 * show} />
                  <text x={215} y={163} textAnchor="middle" fontSize={36} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    k = −1
                  </text>
                  <Tex
                    x={215}
                    y={228}
                    size={16}
                    parts={[{ t: '3 ÷ (−3) = ', fill: GOLD }, { t: '−1', fill: GOLD }]}
                    opacity={clamp01((u - 0.7) / 0.25)}
                  />
                  <text x={215} y={272} textAnchor="middle" fontSize={24} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.85) / 0.15)}>
                    → B ✓
                  </text>
                </g>
              )
            })()}
          </g>
        )}

        {flags.synth && (
          <g>
            <FormulaBadge label={t.d4SynTag} formula="−3 │ 1  4  k  −12" u={u} color={BLUE} />
            {(() => {
              const root = clamp01(u / 0.3)
              const heads = clamp01((u - 0.1) / 0.3)
              const COL = [110, 186, 262, 338]
              const prods = [
                { x: COL[1], s: '−3' },
                { x: COL[2], s: '−3' },
                { x: COL[3], s: '−3(k−3)' },
              ]
              return (
                <g>
                  <g opacity={root}>
                    <circle cx={44} cy={118} r={17} fill={GOLD} fillOpacity={0.14} stroke={GOLD} strokeWidth={1.8} />
                    <text x={44} y={124} textAnchor="middle" fontSize={17} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                      −3
                    </text>
                  </g>
                  {['1', '4', 'k', '−12'].map((s, i) => (
                    <g key={s} opacity={heads}>
                      <Card x={COL[i] - 34} y={98} w={68} h={40} />
                      <text
                        x={COL[i]}
                        y={124}
                        textAnchor="middle"
                        fontSize={18}
                        fontWeight={600}
                        fill={i === 2 ? GOLD : INK}
                        fontStyle={i === 2 ? 'italic' : 'normal'}
                        fontFamily="'Fraunces', Georgia, serif"
                      >
                        {s}
                      </text>
                    </g>
                  ))}
                  {prods.map((p, i) => {
                    const ui = clamp01((u - 0.35 - i * 0.08) / 0.25)
                    return (
                      <text
                        key={i}
                        x={p.x}
                        y={165}
                        textAnchor="middle"
                        fontSize={12.5}
                        fill={RED}
                        fontFamily="'Fraunces', Georgia, serif"
                        opacity={ui}
                      >
                        {p.s}
                      </text>
                    )
                  })}
                  <line x1={72} y1={178} x2={382} y2={178} stroke={LINE} strokeWidth={1.4} opacity={clamp01((u - 0.55) / 0.2)} />
                  {[
                    { s: '1', x: COL[0], fill: GOLD, it: false },
                    { s: '1', x: COL[1], fill: INK, it: false },
                    { s: 'k−3', x: COL[2], fill: INK, it: true },
                    { s: '−3−3k', x: COL[3], fill: RED, it: false },
                  ].map((b, i) => {
                    const ui = clamp01((u - 0.5 - i * 0.06) / 0.25)
                    return (
                      <text
                        key={i}
                        x={b.x}
                        y={206}
                        textAnchor="middle"
                        fontSize={18}
                        fontWeight={700}
                        fill={b.fill}
                        fontStyle={b.it ? 'italic' : 'normal'}
                        fontFamily="'Fraunces', Georgia, serif"
                        opacity={ui}
                      >
                        {b.s}
                      </text>
                    )
                  })}
                  <text x={215} y={252} textAnchor="middle" fontSize={21} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.2)}>
                    −3 − 3k = 0 → k = −1
                  </text>
                  <text x={215} y={290} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.88) / 0.12)}>
                    {t.d4SynNote}
                  </text>
                </g>
              )
            })()}
          </g>
        )}

        {flags.verify && (
          <g>
            <FormulaBadge label={t.d3ExpandTag} formula="x = −3, k = −1" u={u} color={BLUE} />
            <Tex
              x={215}
              y={100}
              size={17}
              parts={[{ t: '(−3)³ + 4(−3)² + ' }, { t: '(−1)(−3)', fill: GOLD }, { t: ' − 12' }]}
              opacity={clamp01((u - 0.1) / 0.25)}
            />
            <Tex x={215} y={142} size={18} parts={[{ t: '= −27 + 36 + ' }, { t: '3', fill: GOLD }, { t: ' − 12' }]} opacity={clamp01((u - 0.3) / 0.25)} />
            <Tex x={215} y={184} size={22} parts={[{ t: '= ' }, { t: '0', fill: OK }]} opacity={clamp01((u - 0.5) / 0.25)} />
            {(() => {
              const show = clamp01((u - 0.6) / 0.25)
              return (
                <g>
                  <circle cx={215} cy={238} r={30} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={2} opacity={show} className="idx-pulse" />
                  <text x={215} y={247} textAnchor="middle" fontSize={26} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={show}>
                    ✓
                  </text>
                </g>
              )
            })()}
            <text x={215} y={300} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.8) / 0.2)}>
              {t.d4RemNote}
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
              parts={[{ t: 'f(−3) = 0 → k = ' }, { t: '−1', fill: OK }, { t: '  ✓ B', fill: OK }]}
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
          <span className="sum">{t.d4ToolsNote}</span>
        </p>
      )}
      {flags.name && (
        <p className="vm-eq show">
          <span className="a">x = −3</span>
          <span className="op">→</span>
          <span className="sum">f(−3) = 0</span>
        </p>
      )}
      {flags.sub && (
        <p className="vm-eq show">
          <span className="a">f(−3)</span>
          <span className="op">=</span>
          <span className="sum">−27+36−3k−12</span>
        </p>
      )}
      {flags.calc && (
        <p className="vm-eq show">
          <span className="a">−27+36−12</span>
          <span className="op">=</span>
          <span className="sum">−3 − 3k = 0</span>
        </p>
      )}
      {flags.gate && (
        <p className="vm-eq show">
          <span className="a">k</span>
          <span className="op">=</span>
          <span className="sum">?</span>
        </p>
      )}
      {flags.answer && (
        <p className="vm-eq show">
          <span className="a">k = −1</span>
          <span className="op">→</span>
          <span className="sum">B ✓</span>
        </p>
      )}
      {flags.synth && (
        <p className="vm-eq show">
          <span className="a">−3−3k = 0</span>
          <span className="op">→</span>
          <span className="sum">k = −1</span>
        </p>
      )}
      {flags.verify && (
        <p className="vm-eq show">
          <span className="a">f(−3) = 0</span>
          <span className="op">·</span>
          <span className="sum">✓</span>
        </p>
      )}
      {flags.check && (
        <p className="vm-eq show">
          <span className="a">A·C·D ✗</span>
          <span className="op">·</span>
          <span className="sum">B ✓</span>
        </p>
      )}
      {flags.guide && (
        <p className="vm-eq show">
          <span className="a">{t.d4GuideThink}</span>
          <span className="op">→</span>
          <span className="sum">k = −1 = B</span>
        </p>
      )}
    </div>
  )
}
