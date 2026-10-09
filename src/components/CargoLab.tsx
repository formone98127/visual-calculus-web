import { useEffect, useRef, useState } from 'react'
import type { CargoLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { beep, clamp01, easeOutCubic, lerp } from './labMotion'

const GOLD = '#ffd166'
const BLUE = '#4cc9f0'
const RED = '#ff6b7a'
const OK = '#b8f27c'
const INK = '#f2f5ff'
const MUTED = 'rgba(242, 245, 255, 0.55)'
const LINE = 'rgba(242, 245, 255, 0.72)'
const BAR_X = 'rgba(76, 201, 240, 0.30)'
const BAR_Y = 'rgba(255, 209, 102, 0.32)'

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

type Part = { t: string; sup?: boolean; sub?: boolean; fill?: string; it?: boolean }

/** tspan chain with super/subscript shifts — never rely on Unicode ⁴/⁶ (font fallback breaks them). */
function partsToTspans(parts: Part[], size: number) {
  let prev = 0
  return parts.map((p, i) => {
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
  })
}

/** One-line math-ish text built from tspans. */
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
      {partsToTspans(parts, size)}
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
  fparts,
  u,
  y = 18,
  color = GOLD,
  fx = 215,
  size = 15,
}: {
  label: string
  formula?: string
  fparts?: Part[]
  u: number
  y?: number
  color?: string
  fx?: number
  size?: number
}) {
  const op = clamp01(u / 0.35)
  return (
    <g opacity={op} transform={`translate(0, ${lerp(-8, 0, op)})`}>
      <rect x={48} y={y} width={334} height={36} rx={18} fill="rgba(255, 209, 102, 0.1)" stroke={color} strokeWidth={1.4} />
      <text x={70} y={y + 23} fontSize={12} fill={color} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
        {label}
      </text>
      <text x={fx} y={y + 24} textAnchor="middle" fontSize={size} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
        {fparts ? partsToTspans(fparts, size) : formula}
      </text>
    </g>
  )
}


/* ---- the shared figure: terminal X's yearly weight, year by year ----
   X1 = 254 100 · X2 = 307 461 · then ×b² growth (drawn to scale). */
const X_VALS = [254100, 307461, 372028, 450154, 544686, 659070]
const FIG_XS = [60, 122, 184, 246, 308, 370]
const FIG_W = 38
const FIG_BASE = 278
const figH = (v: number) => (v * 190) / 659070

function XFig({ u, markGiven }: { u: number; markGiven?: boolean }) {
  const axis = clamp01(u / 0.3)
  const bars = clamp01((u - 0.15) / 0.55)
  return (
    <g>
      <g opacity={axis}>
        <line x1={34} y1={FIG_BASE} x2={416} y2={FIG_BASE} stroke={LINE} strokeWidth={1.5} />
        <text x={424} y={FIG_BASE + 5} textAnchor="end" fontSize={11.5} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
          n
        </text>
        {FIG_XS.map((x, i) => (
          <text key={i} x={x + FIG_W / 2} y={FIG_BASE + 18} textAnchor="middle" fontSize={11.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
            {i + 1}
          </text>
        ))}
      </g>
      <g opacity={bars}>
        {X_VALS.map((v, i) => (
          <rect
            key={i}
            x={FIG_XS[i]}
            y={FIG_BASE - figH(v)}
            width={FIG_W}
            height={figH(v)}
            rx={4}
            fill={BAR_X}
            stroke={markGiven && i < 2 ? GOLD : 'rgba(76, 201, 240, 0.65)'}
            strokeWidth={markGiven && i < 2 ? 1.8 : 1.2}
          />
        ))}
      </g>
    </g>
  )
}

/* ---- (b) figure: paired bars — X blue, Y gold joins at year 5 ---- */
const PAIR_XS = [22, 90, 158, 226, 294, 362]
const BAR_W = 22
const PAIR_BASE = 280
const pairH = (v: number) => (v * 190) / 700000
const Y1_V = 462000
const Y2_V = 508200

function PairFig({ u }: { u: number }) {
  const axis = clamp01(u / 0.25)
  const xb = clamp01((u - 0.1) / 0.4)
  const yb = clamp01((u - 0.4) / 0.35)
  return (
    <g>
      <g opacity={axis}>
        <line x1={14} y1={PAIR_BASE} x2={420} y2={PAIR_BASE} stroke={LINE} strokeWidth={1.5} />
        {PAIR_XS.map((x, i) => (
          <text key={i} x={x + BAR_W + 2} y={PAIR_BASE + 18} textAnchor="middle" fontSize={11.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
            {i + 1}
          </text>
        ))}
      </g>
      <g opacity={xb}>
        {X_VALS.map((v, i) => (
          <rect key={i} x={PAIR_XS[i]} y={PAIR_BASE - pairH(v)} width={BAR_W} height={pairH(v)} rx={3} fill={BAR_X} stroke="rgba(76, 201, 240, 0.65)" strokeWidth={1.1} />
        ))}
        <text x={16} y={54} fontSize={13} fill={BLUE} fontStyle="italic" fontWeight={700} fontFamily="'Fraunces', Georgia, serif">
          X
        </text>
      </g>
      <g opacity={yb}>
        <rect x={PAIR_XS[4] + BAR_W + 4} y={PAIR_BASE - pairH(Y1_V)} width={BAR_W} height={pairH(Y1_V)} rx={3} fill={BAR_Y} stroke={GOLD} strokeWidth={1.2} />
        <rect x={PAIR_XS[5] + BAR_W + 4} y={PAIR_BASE - pairH(Y2_V)} width={BAR_W} height={pairH(Y2_V)} rx={3} fill={BAR_Y} stroke={GOLD} strokeWidth={1.2} />
        <text x={414} y={54} fontSize={13} fill={GOLD} fontStyle="italic" fontWeight={700} fontFamily="'Fraunces', Georgia, serif" textAnchor="end">
          Y
        </text>
        <text x={PAIR_XS[4] + BAR_W + 2} y={PAIR_BASE + 30} textAnchor="middle" fontSize={10.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
          m = 1
        </text>
      </g>
    </g>
  )
}

/* ---- the question ---- */

/* ---- (a)(i): divide the two given years ---- */
const DIV_SRC: Part[] = [{ t: 'A(2) ÷ A(1) = 307 461 / 254 100' }]
const DIV_RESULT: Part[] = [{ t: 'b² = ' }, { t: '1.21', fill: GOLD }]

/* ---- b ---- */
const B_RESULT: Part[] = [{ t: 'b = √1.21 = ' }, { t: '1.1', fill: GOLD }]
const B_COND: Part[] = [{ t: 'a, b > 0', fill: MUTED }]

/* ---- a ---- */
const A_SRC: Part[] = [{ t: 'a · b² = 254 100' }]
const A_RESULT: Part[] = [{ t: 'a = ' }, { t: '210 000', fill: GOLD }]

/* ---- 4th year ---- */
const YR4_RESULT: Part[] = [
  { t: 'A(4) = 210 000 × 1.1⁸ = ' },
  { t: '450 153.65 t', fill: GOLD },
]

/* ---- (a)(ii): GP sum ---- */
const SUM_SERIES: Part[] = [
  { t: 'S(n) = a·b' },
  { t: '2', sup: true },
  { t: ' + a·b' },
  { t: '4', sup: true },
  { t: ' + a·b' },
  { t: '6', sup: true },
  { t: ' + ⋯ + a·b' },
  { t: '2n', sup: true },
]
const SUM_NUM: Part[] = [{ t: '254 100 + 307 461 + 372 028 + ⋯', fill: MUTED }]
const sumfSrc = (zh: boolean): Part[] => [{ t: zh ? '首項 254 100 · 公比 1.21' : 'first term 254 100 · ratio 1.21' }]
const SUMF_SMALL: Part[] = [{ t: 'S(n) = 254 100 × (1.21ⁿ − 1) / 0.21' }]
const SUMF_RESULT: Part[] = [{ t: 'S(n) = ' }, { t: '1 210 000(1.21ⁿ − 1)', fill: GOLD }]

/* ---- (b)(i): the ratio ---- */
const cmpSrc = (zh: boolean): Part[] => [{ t: zh ? 'Y 第 m 年 = X 第 m + 4 年' : 'Y year m = X year m + 4' }]
const CMP_SMALL: Part[] = [{ t: 'A(m+4) / B(m) = ab²ᵐ⁺⁸ / 2abᵐ' }]
const CMP_RESULT: Part[] = [{ t: '= b' }, { t: 'm+8', sup: true }, { t: ' / 2 = ' }, { t: '1.1ᵐ⁺⁸ / 2', fill: GOLD }]

/* ---- the smallest case ---- */
const CMPMIN_SMALL: Part[] = [{ t: 'm ≥ 1 → 1.1ᵐ⁺⁸ ≥ 1.1⁹ = 2.3579 > 2' }]
const CMPMIN_RESULT: Part[] = [{ t: 'A > B ', fill: OK }, { t: ' ✓', fill: OK }]

/* ---- (b)(ii): Y's own GP sum ---- */
const bySrc = (zh: boolean): Part[] => [{ t: zh ? '首項 462 000 · 公比 1.1' : 'first term 462 000 · ratio 1.1' }]
const SY = (rest: string, fill?: string): Part[] => [{ t: 'S' }, { t: 'Y', sub: true }, { t: rest, fill }]
const TOTAL_BADGE: Part[] = [{ t: 'T(n) = S(n) + S' }, { t: 'Y', sub: true }, { t: '(n − 4)' }]
const BY_SMALL: Part[] = SY('(k) = 462 000(1.1ᵏ − 1) / 0.1')
const BY_RESULT: Part[] = [...SY('(k) = '), { t: '4 620 000(1.1ᵏ − 1)', fill: GOLD }]


/* ---- cross ---- */
const CROSS_13: Part[] = [{ t: 'T(13) = ' }, { t: '19 484 712', fill: INK }, { t: ' < 20 000 000' }]
const CROSS_14: Part[] = [{ t: 'T(14) = ' }, { t: '23 602 492', fill: GOLD }, { t: ' > 20 000 000' }]

/* ---- guide ---- */
type GuideStep = {
  n: string
  lawKey: 'd19GuideLaw0' | 'd19GuideLaw1' | 'd19GuideLaw2' | 'd19GuideLaw3' | 'd19GuideLaw4'
  line: Part[]
}

const GUIDE_STEPS: GuideStep[] = [
  {
    n: '0',
    lawKey: 'd19GuideLaw0',
    line: [{ t: 'A(1) = 254 100 · A(2) = 307 461' }],
  },
  {
    n: '1',
    lawKey: 'd19GuideLaw1',
    line: [{ t: 'b² = 1.21 → b = 1.1 · a = ' }, { t: '210 000', fill: GOLD }],
  },
  {
    n: '2',
    lawKey: 'd19GuideLaw2',
    line: [{ t: 'A(4) ≈ 450 153.65 · S(n) = ' }, { t: '1 210 000(1.21ⁿ − 1)', fill: GOLD }],
  },
  {
    n: '3',
    lawKey: 'd19GuideLaw3',
    line: [{ t: '1.1ᵐ⁺⁸ / 2 > 1 → ', fill: INK }, { t: 'agree ✓', fill: OK }],
  },
  {
    n: '4',
    lawKey: 'd19GuideLaw4',
    line: [{ t: 'T(13) < 20 000 000 < T(14) → ' }, { t: 'n = 14', fill: GOLD }, { t: ' ✓', fill: OK }],
  },
]

const agreeLine = (zh: boolean): Part[] => [
  { t: '1.1ᵐ⁺⁸ / 2 > 1 → ', fill: INK },
  { t: zh ? '同意 ✓' : 'agree ✓', fill: OK },
]

const CHIP_W = 92
const CHIP_H = 54
const CHIP_Y = 222
const CHIP_X = [10, 116, 222, 328]

type ChipDef = { id: string; val: string }
const OPTIONS: ChipDef[] = [
  { id: 'A', val: '12' },
  { id: 'B', val: '13' },
  { id: 'C', val: '14' },
  { id: 'D', val: '15' },
]
const ANSWER = 'C'

export function CargoLab({ mode, onInteractComplete }: CargoLabProps) {
  const { t, locale } = useI18n()
  const zh = locale === 'zh-Hant'
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

  const flags: Record<string, boolean> = {
    figure: mode === 'figure',
    question: mode === 'question',
    s1: mode === 's1',
    s2: mode === 's2',
    s3: mode === 's3',
    ask: mode === 'ask',
    why: mode === 'why',
    div: mode === 'div',
    bval: mode === 'bval',
    aval: mode === 'aval',
    yr4: mode === 'yr4',
    sum: mode === 'sum',
    sumf: mode === 'sumf',
    partb: mode === 'partb',
    claim: mode === 'claim',
    cmp: mode === 'cmp',
    cmpmin: mode === 'cmpmin',
    by: mode === 'by',
    total: mode === 'total',
    gate: mode === 'gate',
    cross: mode === 'cross',
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
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="air cargo terminals X and Y: exponential model A(n) = ab²ⁿ, divide the two given years to get b = 1.1 and a = 210 000, GP sum S(n), then the combined total crosses 20 000 000 tonnes in year 14">
        {/* ─── p0 · the figure first ─── */}
        {flags.figure && <XFig u={clamp01(u / 0.9)} />}

        {/* ─── p1 · the question, word for word ─── */}
        {flags.question && (
          <g>
            {t.d19QTextA.split('\n').map((ln, i) => (
              <text key={`qa${i}`} x={30} y={64 + i * 30} fontSize={13.5} fill={INK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.05 * i) / 0.22)}>
                {ln}
              </text>
            ))}
            {t.d19QTextB.split('\n').map((ln, i) => (
              <text key={`qb${i}`} x={30} y={64 + (t.d19QTextA.split('\n').length + i) * 30} fontSize={13.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600} opacity={clamp01((u - 0.2 - 0.05 * i) / 0.22)}>
                {ln}
              </text>
            ))}
          </g>
        )}

        {/* ─── sentence 1 · terminal X, year n ─── */}
        {flags.s1 && (
          <g>
            <FormulaBadge label="X" formula={t.d19S1Badge} u={u} color={BLUE} />
            <XFig u={clamp01((u - 0.1) / 0.7)} />
            <g className="idx-pulse" opacity={clamp01((u - 0.6) / 0.25)}>
              <text x={215} y={318} textAnchor="middle" fontSize={15.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                {t.d19S1Sub}
              </text>
            </g>
          </g>
        )}

        {/* ─── sentence 2 · each year ×b² ─── */}
        {flags.s2 &&
          (() => {
            const hops = clamp01((u - 0.25) / 0.45)
            return (
              <g>
                <XFig u={clamp01((u - 0.05) / 0.5)} />
                <g opacity={hops}>
                  {[0, 1, 2].map((i) => {
                    const x1 = FIG_XS[i] + FIG_W / 2
                    const x2 = FIG_XS[i + 1] + FIG_W / 2
                    const y1 = FIG_BASE - figH(X_VALS[i]) - 8
                    const y2 = FIG_BASE - figH(X_VALS[i + 1]) - 8
                    return (
                      <g key={i}>
                        <path d={`M ${x1 + 6} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 22} ${x2 - 6} ${y2}`} fill="none" stroke={GOLD} strokeWidth={1.4} />
                        <path d={`M ${x2 - 6} ${y2} l -7 -1 m 7 1 l -4 6`} fill="none" stroke={GOLD} strokeWidth={1.4} />
                        <text x={(x1 + x2) / 2} y={Math.min(y1, y2) - 12} textAnchor="middle" fontSize={11.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                          ×b²
                        </text>
                      </g>
                    )
                  })}
                </g>
                <g className="idx-pulse" opacity={clamp01((u - 0.65) / 0.25)}>
                  <text x={215} y={318} textAnchor="middle" fontSize={15.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    {t.d19S2Sub}
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── sentence 3 · the two given weights ─── */}
        {flags.s3 &&
          (() => {
            const vals = clamp01((u - 0.25) / 0.45)
            return (
              <g>
                <XFig u={clamp01((u - 0.05) / 0.5)} markGiven />
                <g opacity={vals}>
                  <text x={FIG_XS[0] + FIG_W / 2} y={FIG_BASE - figH(X_VALS[0]) - 10} textAnchor="middle" fontSize={12.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    254 100
                  </text>
                  <text x={FIG_XS[1] + FIG_W / 2} y={FIG_BASE - figH(X_VALS[1]) - 10} textAnchor="middle" fontSize={12.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    307 461
                  </text>
                </g>
                <g className="idx-pulse" opacity={clamp01((u - 0.65) / 0.25)}>
                  <text x={215} y={318} textAnchor="middle" fontSize={15.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    {t.d19S3Sub}
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── p2 · what is asked ─── */}
        {flags.ask && (
          <g>
            {t.d19AskText.split('\n').map((ln, i) => (
              <text key={`ak${i}`} x={215} y={112 + i * 32} textAnchor="middle" fontSize={13.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600} opacity={clamp01((u - 0.08 * i) / 0.25)}>
                {ln}
              </text>
            ))}
            <text x={215} y={266} textAnchor="middle" fontSize={13} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.45) / 0.3)}>
              {zh ? '13 分' : '13 marks'}
            </text>
          </g>
        )}

        {/* ─── p3 · why GP ─── */}
        {flags.why && (
          <g>
            <FormulaBadge label="WHY" formula={t.d19WhyBadge} u={u} color={BLUE} fx={240} size={14} />
            <XFig u={clamp01((u - 0.1) / 0.7)} />
            <g opacity={clamp01((u - 0.5) / 0.3)}>
              {[0, 1, 2].map((i) => {
                const x1 = FIG_XS[i] + FIG_W / 2
                const x2 = FIG_XS[i + 1] + FIG_W / 2
                const y1 = FIG_BASE - figH(X_VALS[i]) - 8
                const y2 = FIG_BASE - figH(X_VALS[i + 1]) - 8
                return (
                  <text key={i} x={(x1 + x2) / 2} y={Math.min(y1, y2) - 12} textAnchor="middle" fontSize={11.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    ×b²
                  </text>
                )
              })}
            </g>
            <text x={215} y={318} textAnchor="middle" fontSize={16} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700} opacity={clamp01((u - 0.65) / 0.25)}>
              {t.d19WhyText}
            </text>
          </g>
        )}

        {/* ─── p4 · divide — b² pops out ─── */}
        {flags.div &&
          (() => {
            const src = clamp01(u / 0.3)
            const card = clamp01((u - 0.35) / 0.35)
            return (
              <g>
                <Tex x={215} y={98} size={16} parts={DIV_SRC} opacity={0.55 * src} />
                <g opacity={clamp01((u - 0.2) / 0.25)}>
                  <line x1={215} y1={118} x2={215} y2={148} stroke={LINE} strokeWidth={1.4} />
                  <path d="M 210 142 L 215 152 L 220 142" fill="none" stroke={LINE} strokeWidth={1.4} />
                </g>
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={55} y={168} w={320} h={84} />
                  <circle cx={92} cy={210} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
                  <text x={92} y={216} textAnchor="middle" fontSize={15} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    ÷
                  </text>
                  <Tex x={245} y={217} size={22} parts={DIV_RESULT} />
                </g>
              </g>
            )
          })()}

        {/* ─── p5 · b = 1.1 ─── */}
        {flags.bval &&
          (() => {
            const card = clamp01((u - 0.15) / 0.35)
            return (
              <g>
                <Tex x={215} y={110} size={15} parts={[{ t: 'b² = 1.21' }]} opacity={0.55 * clamp01(u / 0.3)} />
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={60} y={168} w={310} h={90} />
                  <circle cx={97} cy={213} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
                  <text x={97} y={219} textAnchor="middle" fontSize={14} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    √
                  </text>
                  <Tex x={237} y={206} size={20} parts={B_RESULT} />
                  <Tex x={237} y={236} size={13} parts={B_COND} />
                </g>
              </g>
            )
          })()}

        {/* ─── p6 · a = 210 000 ─── */}
        {flags.aval &&
          (() => {
            const src = clamp01(u / 0.3)
            const card = clamp01((u - 0.3) / 0.35)
            const res = clamp01((u - 0.6) / 0.3)
            return (
              <g>
                <Tex x={215} y={98} size={16} parts={A_SRC} opacity={0.55 * src} />
                <g opacity={clamp01((u - 0.18) / 0.25)}>
                  <line x1={215} y1={116} x2={215} y2={146} stroke={LINE} strokeWidth={1.4} />
                  <path d="M 210 140 L 215 150 L 220 140" fill="none" stroke={LINE} strokeWidth={1.4} />
                </g>
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={55} y={164} w={320} h={84} />
                  <circle cx={92} cy={206} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
                  <text x={92} y={212} textAnchor="middle" fontSize={14} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    a
                  </text>
                  <Tex x={245} y={196} size={14.5} parts={[{ t: 'a = 254 100 / 1.21' }]} opacity={0.7} />
                  <Tex x={245} y={228} size={21} parts={A_RESULT} />
                </g>
                <g className="idx-pulse" opacity={res}>
                  <Tex x={215} y={300} size={20} parts={[{ t: 'a = ' }, { t: '210 000', fill: GOLD }, { t: '  ·  b = ' }, { t: '1.1', fill: GOLD }]} />
                </g>
              </g>
            )
          })()}

        {/* ─── p7 · hence the 4th year ─── */}
        {flags.yr4 &&
          (() => {
            const bars = clamp01((u - 0.1) / 0.45)
            const gold = clamp01((u - 0.45) / 0.3)
            const res = clamp01((u - 0.62) / 0.3)
            const four = X_VALS.slice(0, 4)
            return (
              <g>
                <g opacity={bars}>
                  {four.map((v, i) => (
                    <g key={i}>
                      <rect x={FIG_XS[i] + 20} y={FIG_BASE - figH(v)} width={FIG_W} height={figH(v)} rx={4} fill={BAR_X} stroke="rgba(76, 201, 240, 0.65)" strokeWidth={1.2} />
                      {i < 3 && (
                        <text x={FIG_XS[i] + 20 + FIG_W + 16} y={FIG_BASE - figH(v) - 12} textAnchor="middle" fontSize={11} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                          ×1.21
                        </text>
                      )}
                    </g>
                  ))}
                </g>
                <g opacity={gold}>
                  <rect x={FIG_XS[3] + 20} y={FIG_BASE - figH(X_VALS[3])} width={FIG_W} height={figH(X_VALS[3])} rx={4} fill={BAR_Y} stroke={GOLD} strokeWidth={1.8} />
                  <text x={FIG_XS[3] + 20 + FIG_W / 2} y={FIG_BASE - figH(X_VALS[3]) - 12} textAnchor="middle" fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    450 153.65
                  </text>
                  <text x={FIG_XS[3] + 20 + FIG_W / 2} y={FIG_BASE + 18} textAnchor="middle" fontSize={11.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                    4
                  </text>
                </g>
                <Tex x={215} y={318} size={17} parts={YR4_RESULT} opacity={res} />
              </g>
            )
          })()}

        {/* ─── p8 · the total is a GP series ─── */}
        {flags.sum && (
          <g>
            <g className="idx-pulse" opacity={clamp01(u / 0.35)}>
              <Tex x={215} y={150} size={21} parts={SUM_SERIES} />
            </g>
            <Tex x={215} y={204} size={14.5} parts={SUM_NUM} opacity={clamp01((u - 0.35) / 0.3)} />
            <text x={215} y={252} textAnchor="middle" fontSize={13.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.55) / 0.3)}>
              {t.d19SumSub}
            </text>
          </g>
        )}

        {/* ─── p9 · GP sum formula ─── */}
        {flags.sumf &&
          (() => {
            const src = clamp01(u / 0.3)
            const card = clamp01((u - 0.3) / 0.35)
            const res = clamp01((u - 0.6) / 0.3)
            return (
              <g>
                <Tex x={215} y={92} size={14.5} parts={sumfSrc(zh)} opacity={0.55 * src} />
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={40} y={140} w={350} h={104} />
                  <circle cx={78} cy={192} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
                  <text x={78} y={198} textAnchor="middle" fontSize={14} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    Σ
                  </text>
                  <Tex x={236} y={176} size={13.5} parts={SUMF_SMALL} opacity={0.7} />
                  <Tex x={236} y={214} size={18.5} parts={SUMF_RESULT} />
                </g>
                <g className="idx-pulse" opacity={res}>
                  <text x={215} y={296} textAnchor="middle" fontSize={14} fill={OK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    {t.d19SumfSub}
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── p10 · (b) Y starts 4 years late ─── */}
        {flags.partb && (
          <g>
            <FormulaBadge label="Y" formula={t.d19PartbBadge} u={u} color={GOLD} fx={238} size={14.5} />
            <PairFig u={clamp01((u - 0.1) / 0.85)} />
          </g>
        )}

        {/* ─── p11 · the manager's claim ─── */}
        {flags.claim &&
          (() => {
            const bars = clamp01((u - 0.1) / 0.45)
            const vals = clamp01((u - 0.45) / 0.3)
            const pulse = clamp01((u - 0.65) / 0.25)
            const scale = 190 / 544686
            return (
              <g>
                <g opacity={bars}>
                  <rect x={130} y={270 - 544686 * scale} width={70} height={544686 * scale} rx={5} fill={BAR_X} stroke="rgba(76, 201, 240, 0.65)" strokeWidth={1.4} />
                  <rect x={232} y={270 - Y1_V * scale} width={70} height={Y1_V * scale} rx={5} fill={BAR_Y} stroke={GOLD} strokeWidth={1.4} />
                  <line x1={110} y1={270} x2={330} y2={270} stroke={LINE} strokeWidth={1.5} />
                  <text x={165} y={290} textAnchor="middle" fontSize={12.5} fill={BLUE} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                    X · n = 5
                  </text>
                  <text x={267} y={290} textAnchor="middle" fontSize={12.5} fill={GOLD} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                    Y · m = 1
                  </text>
                </g>
                <g opacity={vals}>
                  <text x={165} y={270 - 544686 * scale - 10} textAnchor="middle" fontSize={13} fill={INK} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    544 686
                  </text>
                  <text x={267} y={270 - Y1_V * scale - 10} textAnchor="middle" fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={600}>
                    462 000
                  </text>
                </g>
                <g className="idx-pulse" opacity={pulse}>
                  <text x={215} y={320} textAnchor="middle" fontSize={17} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    Y &lt; X ?
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── p12 · the ratio ─── */}
        {flags.cmp &&
          (() => {
            const src = clamp01(u / 0.3)
            const card = clamp01((u - 0.3) / 0.35)
            const res = clamp01((u - 0.6) / 0.3)
            return (
              <g>
                <Tex x={215} y={92} size={14.5} parts={cmpSrc(zh)} opacity={0.55 * src} />
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={40} y={140} w={350} h={104} />
                  <circle cx={78} cy={192} r={16} fill={BLUE} fillOpacity={0.18} stroke={BLUE} strokeWidth={1.5} />
                  <text x={78} y={198} textAnchor="middle" fontSize={14} fill={BLUE} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    /
                  </text>
                  <Tex x={236} y={176} size={13.5} parts={CMP_SMALL} opacity={0.7} />
                  <Tex x={236} y={214} size={18} parts={CMP_RESULT} />
                </g>
                <text x={215} y={296} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={res}>
                  {t.d19CmpSub}
                </text>
              </g>
            )
          })()}

        {/* ─── p13 · the smallest case already wins ─── */}
        {flags.cmpmin &&
          (() => {
            const card = clamp01((u - 0.15) / 0.35)
            const agree = clamp01((u - 0.65) / 0.25)
            return (
              <g>
                <Tex x={215} y={104} size={15} parts={CMPMIN_SMALL} opacity={0.6 * clamp01(u / 0.3)} />
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={80} y={146} w={270} h={78} />
                  <Tex x={215} y={196} size={24} parts={CMPMIN_RESULT} />
                </g>
                <g className="idx-pulse" opacity={agree}>
                  <text x={215} y={288} textAnchor="middle" fontSize={15.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    {t.d19AgreeText}
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── p14 · Y's own GP sum ─── */}
        {flags.by &&
          (() => {
            const src = clamp01(u / 0.3)
            const card = clamp01((u - 0.3) / 0.35)
            const res = clamp01((u - 0.6) / 0.3)
            return (
              <g>
                <Tex x={215} y={92} size={14.5} parts={bySrc(zh)} opacity={0.55 * src} />
                <g opacity={card} transform={`translate(0, ${(1 - card) * 14})`}>
                  <Card x={40} y={140} w={350} h={104} />
                  <circle cx={78} cy={192} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
                  <text x={78} y={198} textAnchor="middle" fontSize={13} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    Y
                  </text>
                  <Tex x={236} y={176} size={13.5} parts={BY_SMALL} opacity={0.7} />
                  <Tex x={236} y={214} size={18} parts={BY_RESULT} />
                </g>
                <text x={215} y={296} textAnchor="middle" fontSize={14} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={res}>
                  {t.d19BySub}
                </text>
              </g>
            )
          })()}

        {/* ─── p15 · combined total against the 20 000 000 line ─── */}
        {flags.total &&
          (() => {
            const axis = clamp01(u / 0.25)
            const bars = clamp01((u - 0.15) / 0.5)
            const thr = clamp01((u - 0.55) / 0.3)
            const base = 272
            const scale = 190 / 28465176
            const rows = [
              { n: 12, sx: 10708176, sy: 5283380 },
              { n: 13, sx: 13210994, sy: 6273718 },
              { n: 14, sx: 16239402, sy: 7363090 },
              { n: 15, sx: 19903777, sy: 8561399 },
            ]
            const xs = [76, 164, 252, 340]
            const w = 56
            const thrY = base - 20000000 * scale
            return (
              <g>
                <g opacity={axis}>
                  <line x1={56} y1={base} x2={414} y2={base} stroke={LINE} strokeWidth={1.5} />
                  <text x={424} y={base + 5} textAnchor="end" fontSize={11.5} fill={MUTED} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                    n
                  </text>
                  {rows.map((r, i) => (
                    <text key={r.n} x={xs[i] + w / 2} y={base + 18} textAnchor="middle" fontSize={11.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                      {r.n}
                    </text>
                  ))}
                  <rect x={62} y={40} width={12} height={12} rx={2} fill={BAR_X} stroke="rgba(76, 201, 240, 0.65)" strokeWidth={1} />
                  <text x={80} y={50} fontSize={11.5} fill={BLUE} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                    X
                  </text>
                  <rect x={104} y={40} width={12} height={12} rx={2} fill={BAR_Y} stroke={GOLD} strokeWidth={1} />
                  <text x={122} y={50} fontSize={11.5} fill={GOLD} fontStyle="italic" fontFamily="'Fraunces', Georgia, serif">
                    Y
                  </text>
                </g>
                <g opacity={bars}>
                  {rows.map((r, i) => {
                    const hx = r.sx * scale
                    const hy = r.sy * scale
                    return (
                      <g key={r.n}>
                        <rect x={xs[i]} y={base - hx} width={w} height={hx} rx={3} fill={BAR_X} stroke="rgba(76, 201, 240, 0.65)" strokeWidth={1.1} />
                        <rect x={xs[i]} y={base - hx - hy} width={w} height={hy} rx={3} fill={BAR_Y} stroke={GOLD} strokeWidth={1.1} />
                      </g>
                    )
                  })}
                </g>
                <g opacity={thr}>
                  <line x1={56} y1={thrY} x2={414} y2={thrY} stroke={GOLD} strokeWidth={1.6} strokeDasharray="6 5" />
                  <text x={62} y={thrY - 8} fontSize={11.5} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    20 000 000
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── p16 · interactive gate: which year? ─── */}
        {flags.gate && (
          <g opacity={clamp01(u / 0.35)}>
            <FormulaBadge label="T(n)" fparts={TOTAL_BADGE} u={u} color={BLUE} fx={240} size={13.5} />
            <g className="idx-pulse">
              <text x={215} y={158} textAnchor="middle" fontSize={30} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif">
                {t.d19GatePulse}
              </text>
            </g>
            {chips(true)}
            {solved ? (
              <Tex x={215} y={314} size={16} parts={[{ t: 'T(14) > 20 000 000 → ', fill: INK }, { t: 'n = 14', fill: OK }, { t: '  ✓', fill: OK }]} />
            ) : wrongId ? (
              <text x={215} y={314} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif">
                {wrongId === 'A' ? t.d19WhyA : wrongId === 'B' ? t.d19WhyB : t.d19WhyD}
              </text>
            ) : (
              <text x={215} y={314} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif">
                {t.indexHint}
              </text>
            )}
          </g>
        )}

        {/* ─── p17 · both sides of the line ─── */}
        {flags.cross &&
          (() => {
            const c1 = clamp01((u - 0.1) / 0.35)
            const c2 = clamp01((u - 0.4) / 0.35)
            return (
              <g>
                <g opacity={c1} transform={`translate(0, ${(1 - c1) * 14})`}>
                  <Card x={40} y={92} w={350} h={70} />
                  <circle cx={78} cy={127} r={16} fill={RED} fillOpacity={0.16} stroke={RED} strokeWidth={1.5} />
                  <text x={78} y={133} textAnchor="middle" fontSize={14} fill={RED} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    13
                  </text>
                  <Tex x={238} y={135} size={16} parts={CROSS_13} />
                </g>
                <g opacity={c2} transform={`translate(0, ${(1 - c2) * 14})`}>
                  <Card x={40} y={192} w={350} h={70} />
                  <circle cx={78} cy={227} r={16} fill={OK} fillOpacity={0.16} stroke={OK} strokeWidth={1.5} />
                  <text x={78} y={233} textAnchor="middle" fontSize={14} fill={OK} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    14
                  </text>
                  <Tex x={238} y={235} size={16} parts={CROSS_14} />
                </g>
                <g className="idx-pulse" opacity={clamp01((u - 0.7) / 0.25)}>
                  <text x={215} y={308} textAnchor="middle" fontSize={15} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                    {t.d19CrossSub}
                  </text>
                </g>
              </g>
            )
          })()}

        {/* ─── p18 · answer ─── */}
        {flags.answer && (
          <g>
            <circle cx={215} cy={132} r={58} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.5 * clamp01((u - 0.1) / 0.35)} />
            <text x={215} y={143} textAnchor="middle" fontSize={32} fontWeight={700} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.1) / 0.35)}>
              n = 14
            </text>
            <text x={215} y={228} textAnchor="middle" fontSize={13.5} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.45) / 0.3)}>
              a = 210 000&#160;&#160;·&#160;&#160;b = 1.1&#160;&#160;·&#160;&#160;A(4) = 450 153.65 t
            </text>
            <text x={215} y={278} textAnchor="middle" fontSize={22} fontWeight={700} fill={OK} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.75) / 0.25)}>
              → 13 / 13 ✓
            </text>
          </g>
        )}

        {/* ─── p19 · verify ─── */}
        {flags.verify && (
          <g>
            <text x={215} y={72} textAnchor="middle" fontSize={15} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01(u / 0.3)}>
              {t.d19VerifyTop}
            </text>
            {(() => {
              const cd = clamp01((u - 0.2) / 0.35)
              const fin = clamp01((u - 0.6) / 0.3)
              return (
                <g>
                  <g opacity={cd} transform={`translate(0, ${(1 - cd) * 14})`}>
                    <Card x={40} y={112} w={350} h={96} />
                    <circle cx={78} cy={160} r={16} fill={GOLD} fillOpacity={0.18} stroke={GOLD} strokeWidth={1.5} />
                    <text x={78} y={166} textAnchor="middle" fontSize={14} fill={GOLD} fontFamily="'Fraunces', Georgia, serif" fontWeight={700}>
                      ✓
                    </text>
                    <Tex x={240} y={148} size={14.5} parts={[{ t: 'T(13) = 19 484 712 < 20 000 000', fill: MUTED }]} />
                    <Tex x={240} y={184} size={15.5} parts={[{ t: 'T(14) = 23 602 492 > 20 000 000', fill: GOLD }, { t: ' ✓', fill: OK }]} />
                  </g>
                  <g className="idx-pulse" opacity={fin}>
                    <Tex x={215} y={258} size={19} parts={[{ t: '19 484 712 < 20 000 000 < 23 602 492 ', fill: OK }, { t: '✓', fill: OK }]} />
                  </g>
                </g>
              )
            })()}
          </g>
        )}

        {/* ─── p20 · guide ─── */}
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
                <Tex x={64} y={y + 38} size={15} parts={step.n === '3' ? agreeLine(zh) : step.line} anchor="start" />
              </g>
            )
          })}
      </svg>
    </div>
  )
}
