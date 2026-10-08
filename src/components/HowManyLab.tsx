import type { HowManyLabMode, HowManyLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const BAR_X = 40
const BAR_Y = 70
const BAR_W = 280
const BAR_H = 52
const QW = BAR_W / 4
const HOME_Y = 200

function modeFlags(mode: HowManyLabMode) {
  return {
    ask: mode === 'ask',
    showHalf: true,
    showPieces:
      mode === 'pieces' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function HowManyLab({ mode, onInteractComplete }: HowManyLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'half' || mode === 'pieces' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  const targets = [BAR_X, BAR_X + QW]
  const homes = [BAR_X + 20, BAR_X + QW + 50]

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 360 260" role="img" aria-label="Two quarters fill a half">
        <rect
          className={`frac-bar ${allLanded ? 'hot' : 'waiting'}`}
          x={BAR_X}
          y={BAR_Y}
          width={BAR_W / 2}
          height={BAR_H}
        />
        <line
          className="frac-tick"
          x1={BAR_X + QW}
          y1={BAR_Y}
          x2={BAR_X + QW}
          y2={BAR_Y + BAR_H}
        />
        {flags.ask || mode === 'half' ? (
          <text x={BAR_X + BAR_W / 4} y={BAR_Y + BAR_H / 2 + 6} className="frac-n" textAnchor="middle">
            1/2
          </text>
        ) : null}

        {flags.showPieces &&
          [0, 1].map((i) => {
            const u = Math.min(1, Math.max(0, (fly - i * 0.18) / 0.7))
            const x = lerp(homes[i], targets[i], u)
            const y = lerp(HOME_Y, BAR_Y, u)
            const lift = Math.sin(u * Math.PI) * 14
            return (
              <g key={i}>
                <rect
                  className="frac-quarter"
                  x={x}
                  y={y - lift}
                  width={QW}
                  height={BAR_H}
                />
                <text
                  x={x + QW / 2}
                  y={y - lift + BAR_H / 2 + 6}
                  className="frac-n"
                  textAnchor="middle"
                >
                  1/4
                </text>
              </g>
            )
          })}

        {allLanded && (
          <text x={BAR_X + BAR_W / 4} y={BAR_Y - 14} className="frac-sum" textAnchor="middle">
            2
          </text>
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={180} y={248} className="line-hint" textAnchor="middle">
            {t.howHint}
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
          {t.howAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          <span className="a">½</span>
          <span className="op">÷</span>
          <span className="b">¼</span>
          <span className="op">=</span>
          <span className="sum">2</span>
        </p>
      )}
    </div>
  )
}
