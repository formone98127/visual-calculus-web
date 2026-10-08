import type { CompleteSqLabMode, CompleteSqLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const U = 32
const X = 3
const OX = 80
const OY = 40

function modeFlags(mode: CompleteSqLabMode) {
  return {
    ask: mode === 'ask',
    showArms: mode !== 'ask',
    showGap: mode === 'gap' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function CompleteSqLab({ mode, onInteractComplete }: CompleteSqLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'arms' || mode === 'gap' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  const oneX = lerp(260, OX + X * U, fly)
  const oneY = lerp(160, OY + X * U, fly)
  const lift = Math.sin(fly * Math.PI) * 14

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 360 260" role="img" aria-label="A missing 1 completes (x+1) squared">
        <rect className="cs-x2" x={OX} y={OY} width={X * U - 2} height={X * U - 2} />
        <text x={OX + (X * U) / 2} y={OY + (X * U) / 2 + 6} className="frac-n" textAnchor="middle">
          x²
        </text>

        {flags.showArms && (
          <>
            <rect
              className="cs-arm"
              x={OX + X * U}
              y={OY}
              width={U - 2}
              height={X * U - 2}
            />
            <rect
              className="cs-arm"
              x={OX}
              y={OY + X * U}
              width={X * U - 2}
              height={U - 2}
            />
            <text x={OX + X * U + U / 2} y={OY + (X * U) / 2 + 6} className="frac-n" textAnchor="middle">
              x
            </text>
            <text x={OX + (X * U) / 2} y={OY + X * U + U / 2 + 6} className="frac-n" textAnchor="middle">
              x
            </text>
          </>
        )}

        {flags.showArms && (
          <rect
            className={`cs-wait ${allLanded ? 'hot' : 'waiting'}`}
            x={OX + X * U}
            y={OY + X * U}
            width={U - 2}
            height={U - 2}
          />
        )}

        {flags.showGap && (
          <rect
            className="cs-one"
            x={oneX}
            y={oneY - lift}
            width={U - 2}
            height={U - 2}
          />
        )}
        {flags.showGap && fly > 0.7 && (
          <text
            x={oneX + U / 2}
            y={oneY - lift + U / 2 + 6}
            className="frac-n"
            textAnchor="middle"
          >
            1
          </text>
        )}

        {allLanded && (
          <rect
            className="cs-gold show"
            x={OX}
            y={OY}
            width={(X + 1) * U - 2}
            height={(X + 1) * U - 2}
          />
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={180} y={248} className="line-hint" textAnchor="middle">
            {t.csHint}
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
          {t.csAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          <span className="a">x²+2x+1</span>
          <span className="op">=</span>
          <span className="sum">(x+1)²</span>
        </p>
      )}
    </div>
  )
}
