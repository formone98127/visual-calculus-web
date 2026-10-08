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
    l1: [{ t: '(2x⁴)³ → ' }, { t: '6', fill: RED }, { t: 'x', it: true }, { t: '12', sup: true }],
    l2key: 'indexTrapB',
  },
  {
    id: 'D',
    val: OPTIONS[3].val,
    l1: [{ t: '(x⁴)³ → ' }, { t: 'x', it: true }, { t: '64', sup: true, fill: RED }],
    l2key: 'indexTrapD',
  },
  {
    id: 'A',
    val: OPTIONS[0].val,
    l1: [{ t: '✗ + ✗' }],
    l2key: 'indexTrapA',
  },
]

export function IndexLawLab({ mode, onInteractComplete }: IndexLawLabProps) {
  const { t } = useI18n()
  const u = useFly(mode)
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
    copies: mode === 'copies',
    coeffs: mode === 'coeffs',
    indices: mode === 'indices',
    challenge: mode === 'challenge',
    divide: mode === 'divide',
    subtract: mode === 'subtract',
    final: mode === 'final',
    check: mode === 'check',
  }

  /* ---- shared scenes ---- */

  // three bracket cards; `stamp` animates copies flying out of card 0
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
        <text x={151.5} y={130} textAnchor="middle" fontSize={22} fill={MUTED} opacity={u1}>×</text>
        <text x={278.5} y={130} textAnchor="middle" fontSize={22} fill={MUTED} opacity={u2}>×</text>
      </g>
    )
  }

  // cards with the coefficient / index side of each factor emphasised
  const cardsFocus = (focus: 'coef' | 'index') => {
    const coefOp = focus === 'coef' ? 1 : 0.22
    const idxOp = focus === 'index' ? 1 : 0.22
    return (
      <g>
        {CARD_CX.map((cx, k) => (
          <g key={k}>
            <Card x={CARD_XS[k]} y={CARD_Y} />
            {focus === 'index' && <circle cx={cx + 18} cy={121} r={19} fill={BLUE} opacity={0.14} />}
            <text x={cx - 16} y={130} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={24} fontWeight={600} fill={focus === 'coef' ? GOLD : INK} opacity={coefOp}>
              2
            </text>
            <text x={cx + 18} y={130} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={24} fontWeight={600} fill={INK} opacity={idxOp}>
              x⁴
            </text>
          </g>
        ))}
      </g>
    )
  }

  // the four answer chips; interactive only while `live`
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

  return (
    <div className={`idx-lab ${solved ? 'is-solved' : ''}`}>
      <svg className="vm-svg" viewBox="0 0 430 330" role="img" aria-label="Index laws: cube the bracket, then divide">
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

        {flags.copies && (
          <g>
            <Tex x={215} y={52} size={26} parts={[...BRACKET3, { t: ' =' }]} />
            {stamp(true)}
          </g>
        )}

        {flags.coeffs && (
          <g>
            {cardsFocus('coef')}
            {[0, 1, 2].map((k) => {
              const ui = clamp01((u - 0.15 - k * 0.14) / 0.55)
              const x = lerp(CARD_CX[k] - 16, 215, ui)
              const y = lerp(121, 216, ui) - Math.sin(ui * Math.PI) * 12
              return <circle key={k} cx={x} cy={y} r={13} fill={GOLD} opacity={0.85 * (1 - ui * 0.95)} />
            })}
            <circle cx={215} cy={216} r={22} fill={GOLD} fillOpacity={0.12} stroke={GOLD} strokeWidth={2} opacity={clamp01((u - 0.5) / 0.3)} />
            <text x={215} y={225} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={27} fontWeight={700} fill={GOLD} opacity={clamp01((u - 0.75) / 0.25)}>
              8
            </text>
            <text x={318} y={224} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={20} fontWeight={600} fill={RED} opacity={0.75 * clamp01((u - 0.3) / 0.2) * (1 - clamp01((u - 0.6) / 0.25))}>
              6
            </text>
            <line x1={306} y1={217} x2={330} y2={217} stroke={RED} strokeWidth={2} opacity={0.75 * clamp01((u - 0.3) / 0.2) * (1 - clamp01((u - 0.6) / 0.25))} />
          </g>
        )}

        {flags.indices && (
          <g>
            <Tex x={215} y={52} size={22} parts={[{ t: 'x', it: true }, { t: '4', sup: true }, { t: ' · x', it: true }, { t: '4', sup: true }, { t: ' · x', it: true }, { t: '4', sup: true }]} />
            {cardsFocus('index')}
            {Array.from({ length: 12 }, (_, gi) => {
              const k = Math.floor(gi / 4)
              const j = gi % 4
              const ui = clamp01((u - 0.12 - gi * 0.04) / 0.5)
              const sx = CARD_CX[k] + (j - 1.5) * 16
              const sy = 172
              const tx = 215 + (gi - 5.5) * 22
              const ty = 228
              const x = lerp(sx, tx, ui)
              const y = lerp(sy, ty, ui) - Math.sin(ui * Math.PI) * 10
              return <circle key={gi} cx={x} cy={y} r={5.5} fill={BLUE} opacity={0.35 + 0.65 * ui} />
            })}
            <text x={215} y={284} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={21} fontWeight={600} fill={BLUE} opacity={clamp01((u - 0.8) / 0.2)}>
              4 + 4 + 4 = 12
            </text>
          </g>
        )}

        {flags.challenge && (
          <g opacity={clamp01(u / 0.35)}>
            <Tex x={215} y={96} size={36} parts={NUM_8X12} />
            <Frac x={215} y={120} w={124} u={clamp01((u - 0.1) / 0.5)} />
            <Tex x={215} y={164} size={36} parts={DEN_2X5} />
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
            <circle cx={188} cy={61} r={16} fill={GOLD} opacity={0.16} />
            <text x={188} y={70} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={32} fontWeight={600} fill={GOLD}>
              8
            </text>
            <Tex x={238} y={70} size={32} parts={[{ t: 'x', it: true }, { t: '12', sup: true, fill: BLUE }]} />
            <Frac x={215} y={94} w={120} u={1} />
            <circle cx={196} cy={127} r={15} fill={RED} opacity={0.15} />
            <text x={196} y={136} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={32} fontWeight={600} fill={INK}>
              2
            </text>
            <Tex x={242} y={136} size={32} parts={[{ t: 'x', it: true }, { t: '5', sup: true, fill: BLUE }]} />
            <path d="M 196 148 Q 202 178 210 188" fill="none" stroke={GOLD} strokeWidth={2} strokeDasharray="5 4" opacity={0.8 * clamp01(u / 0.3)} />
            <polygon points="210,188 203.5,183 202.5,190.5" fill={GOLD} opacity={0.8 * clamp01(u / 0.3)} />
            {Array.from({ length: 8 }, (_, i) => {
              const pair = Math.floor(i / 2)
              const mi = clamp01((u - 0.5 - pair * 0.08) / 0.25)
              const x0 = 215 + (i - 3.5) * 30
              const bx = 215 + (2 * pair - 3) * 30
              const x = lerp(x0, bx + (i % 2 === 0 ? -7 : 7), mi)
              const appear = clamp01((u - 0.12 - i * 0.045) / 0.2)
              return <circle key={i} cx={x} cy={204} r={9 * appear} fill={GOLD} opacity={appear} />
            })}
            {[0, 1, 2, 3].map((k) => (
              <rect
                key={k}
                x={215 + (2 * k - 3) * 30 - 22}
                y={185}
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
            <text x={215} y={254} textAnchor="middle" fontSize={17} fill={MUTED} fontFamily="'Fraunces', Georgia, serif" opacity={clamp01((u - 0.3) / 0.3)}>
              {t.indexGroups}
            </text>
          </g>
        )}

        {flags.subtract && (
          <g>
            <Tex x={215} y={70} size={32} parts={[{ t: 'x', it: true }, { t: '12', sup: true, fill: BLUE }]} />
            <Frac x={215} y={94} w={120} u={1} />
            <Tex x={215} y={136} size={32} parts={[{ t: 'x', it: true }, { t: '5', sup: true, fill: RED }]} />
            {Array.from({ length: 12 }, (_, i) => {
              const gone = i >= 7
              if (gone) {
                const bi = clamp01((u - 0.1 - (i - 7) * 0.09) / 0.5)
                const y = lerp(192, 238, bi)
                const xop = clamp01(bi / 0.35) * (1 - clamp01((bi - 0.55) / 0.4))
                return (
                  <g key={i}>
                    <circle cx={215 + (i - 5.5) * 24} cy={y} r={8} fill={BLUE} opacity={1 - bi} />
                    <text x={215 + (i - 5.5) * 24} y={244} textAnchor="middle" fontSize={16} fill={RED} opacity={xop}>
                      ✕
                    </text>
                  </g>
                )
              }
              const si = clamp01((u - 0.55) / 0.35)
              const x = lerp(215 + (i - 5.5) * 24, 215 + (i - 3) * 24, si)
              return <circle key={i} cx={x} cy={192} r={8} fill={BLUE} />
            })}
            <text x={215} y={290} textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize={21} fontWeight={600} fill={BLUE} opacity={clamp01((u - 0.8) / 0.2)}>
              12 − 5 = 7
            </text>
          </g>
        )}

        {flags.final && (
          <g>
            <circle cx={215} cy={132} r={50} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.35 * clamp01(u / 0.6)} />
            <text
              x={lerp(110, 180, clamp01(u / 0.6))}
              y={150}
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
              y={150}
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
              const y = 66 + (1 - ci) * 26
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
              y={268}
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
      </svg>

      {flags.copies && (
        <p className="vm-eq show">
          <span className="a">(2x⁴)³</span>
          <span className="op">=</span>
          <span className="b">(2x⁴)(2x⁴)(2x⁴)</span>
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
          <span className="a">x⁴·x⁴·x⁴</span>
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
    </div>
  )
}
