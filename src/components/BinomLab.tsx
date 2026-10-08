import type { BinomLabMode, BinomLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const U = 28
const X = 3
const OX = 70
const OY = 36

function modeFlags(mode: BinomLabMode) {
  return {
    ask: mode === 'ask',
    showX2: mode === 'x2' || mode === 'strips' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    showStrips: mode === 'strips' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function BinomLab({ mode, onInteractComplete }: BinomLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'x2' || mode === 'strips' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  const w = (X + 1) * U
  const h = (X + 2) * U
  const pieces = [
    { cls: 'bi-x2', x: OX, y: OY, w: X * U, h: X * U, hx: 240, hy: 30, label: flags.generalize ? 'x²' : '' },
    { cls: 'bi-x', x: OX + X * U, y: OY, w: U, h: X * U, hx: 240, hy: 90, label: 'x' },
    { cls: 'bi-x', x: OX, y: OY + X * U, w: X * U, h: U, hx: 240, hy: 140, label: 'x' },
    { cls: 'bi-x', x: OX, y: OY + (X + 1) * U, w: X * U, h: U, hx: 240, hy: 170, label: 'x' },
    { cls: 'bi-1', x: OX + X * U, y: OY + X * U, w: U, h: 2 * U, hx: 240, hy: 200, label: '2' },
  ]

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 360 280" role="img" aria-label="Algebra tiles fill (x+1) by (x+2)">
        <rect
          className={`bi-outline ${allLanded ? 'hot' : 'waiting'}`}
          x={OX}
          y={OY}
          width={w}
          height={h}
        />
        <text x={OX + w / 2} y={OY - 8} className="dist-label a" textAnchor="middle">
          {flags.generalize ? 'x+1' : 'x+1'}
        </text>
        <text x={OX - 22} y={OY + h / 2 + 4} className="dist-label b" textAnchor="middle">
          {flags.generalize ? 'x+2' : 'x+2'}
        </text>

        {pieces.map((p, i) => {
          const show =
            i === 0
              ? flags.showX2
              : flags.showStrips
          if (!show) return null
          const u = flags.ask ? 0 : i === 0 && mode === 'x2' ? 1 : Math.min(1, Math.max(0, (fly - i * 0.1) / 0.55))
          const parked = mode === 'x2' || mode === 'strips' || flags.challenge
          const uu = i === 0 ? 1 : parked ? 0 : u
          const x = lerp(p.hx, p.x, mode === 'x2' && i === 0 ? 1 : uu)
          const y = lerp(p.hy, p.y, mode === 'x2' && i === 0 ? 1 : uu)
          return (
            <g key={i}>
              <rect className={p.cls} x={x} y={y} width={p.w - 2} height={p.h - 2} />
              {p.label && uu > 0.7 && (
                <text
                  x={x + p.w / 2}
                  y={y + p.h / 2 + 5}
                  className="frac-n"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              )}
            </g>
          )
        })}

        {flags.challenge && fly < 0.02 && (
          <text x={180} y={268} className="line-hint" textAnchor="middle">
            {t.binomHint}
          </text>
        )}
      </svg>

      {flags.challenge && !landed && (
        <button
          type="button"
          className="auto-fit"
          disabled={flying}
          onClick={(e) => {
            e.stopPropagation()
            runAutoFit()
          }}
        >
          {t.binomAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          <span className="a">(x+1)(x+2)</span>
          <span className="op">=</span>
          <span className="sum">x²+3x+2</span>
        </p>
      )}
    </div>
  )
}
