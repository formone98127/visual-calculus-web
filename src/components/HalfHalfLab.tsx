import type { HalfHalfLabMode, HalfHalfLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const S = 140
const OX = 100
const OY = 40
const HOME_Y = 200

function modeFlags(mode: HalfHalfLabMode) {
  return {
    ask: mode === 'ask',
    showVert: mode !== 'ask',
    showHoriz:
      mode === 'horiz' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function HalfHalfLab({ mode, onInteractComplete }: HalfHalfLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'vert' || mode === 'horiz' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  const hy = lerp(HOME_Y, OY, fly)
  const lift = Math.sin(fly * Math.PI) * 14

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 340 270" role="img" aria-label="Half of a half is a quarter">
        <rect
          className={`hh-sq ${allLanded ? 'hot' : 'waiting'}`}
          x={OX}
          y={OY}
          width={S}
          height={S}
        />
        <line className="hh-tick" x1={OX + S / 2} y1={OY} x2={OX + S / 2} y2={OY + S} />
        <line className="hh-tick" x1={OX} y1={OY + S / 2} x2={OX + S} y2={OY + S / 2} />

        {flags.showVert && (
          <rect className="hh-vert" x={OX} y={OY} width={S / 2} height={S} />
        )}

        {flags.showHoriz && (
          <rect
            className="hh-horiz"
            x={OX}
            y={hy - lift}
            width={S}
            height={S / 2}
            opacity={0.55 + 0.25 * fly}
          />
        )}

        {allLanded && (
          <rect
            className="hh-overlap show"
            x={OX}
            y={OY}
            width={S / 2}
            height={S / 2}
          />
        )}

        {flags.showVert && (
          <text x={OX + S / 4} y={OY + S / 2 + 6} className="frac-n" textAnchor="middle">
            1/2
          </text>
        )}
        {allLanded && (
          <text x={OX + S / 4} y={OY + S / 4 + 6} className="frac-n" textAnchor="middle">
            1/4
          </text>
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={170} y={258} className="line-hint" textAnchor="middle">
            {t.hhHint}
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
          {t.hhAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          <span className="a">½</span>
          <span className="op">×</span>
          <span className="b">½</span>
          <span className="op">=</span>
          <span className="sum">¼</span>
        </p>
      )}
    </div>
  )
}
