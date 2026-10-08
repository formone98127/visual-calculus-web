import type { BarEqLabMode, BarEqLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const UNIT = 22
const OX = 28
const OY = 80
const H = 48

function modeFlags(mode: BarEqLabMode) {
  return {
    ask: mode === 'ask',
    showParts: mode !== 'ask',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function BarEqLab({ mode, onInteractComplete }: BarEqLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'parts' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  const gap = fly * 16
  const peel = fly
  const xW = 3 * UNIT

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 360 220" role="img" aria-label="Three matching bars plus two make eleven">
        {flags.ask && (
          <rect className="be-whole" x={OX} y={OY} width={11 * UNIT} height={H} />
        )}

        {flags.showParts &&
          [0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                className="be-x"
                x={OX + i * (xW + gap)}
                y={OY}
                width={xW - 2}
                height={H}
              />
              <text
                x={OX + i * (xW + gap) + xW / 2}
                y={OY + H / 2 + 6}
                className="frac-n"
                textAnchor="middle"
              >
                {flags.generalize ? 'x' : allLanded ? '3' : 'x'}
              </text>
            </g>
          ))}

        {flags.showParts &&
          [0, 1].map((i) => {
            const x = lerp(OX + 3 * xW + i * UNIT, OX + 3 * xW + 40 + i * 28, peel)
            const y = lerp(OY, OY + 70, peel)
            const gone = peel > 0.92
            if (gone) return null
            return (
              <rect
                key={`u-${i}`}
                className="be-one"
                x={x}
                y={y}
                width={UNIT - 2}
                height={H}
                opacity={1 - peel * 0.3}
              />
            )
          })}

        {allLanded && (
          <text x={180} y={50} className="frac-sum" textAnchor="middle">
            11 − 2 = 9
          </text>
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={180} y={200} className="line-hint" textAnchor="middle">
            {t.barEqHint}
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
          {t.barEqAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          <span className="a">3x+2</span>
          <span className="op">=</span>
          <span className="b">11</span>
          <span className="op">→</span>
          <span className="sum">x=3</span>
        </p>
      )}
    </div>
  )
}
