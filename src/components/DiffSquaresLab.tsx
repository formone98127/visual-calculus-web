import type { DiffSquaresLabMode, DiffSquaresLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const CELL = 26
const A = 5
const B = 2
const OX = 50
const OY = 28

function modeFlags(mode: DiffSquaresLabMode) {
  return {
    ask: mode === 'ask',
    showHole: mode !== 'ask',
    showCut: mode === 'cut' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function DiffSquaresLab({ mode, onInteractComplete }: DiffSquaresLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'hole' || mode === 'cut' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  const keepW = (A - B) * CELL
  const keepH = A * CELL
  const flapW = B * CELL
  const flapH = (A - B) * CELL
  const flapHomeX = OX + keepW
  const flapHomeY = OY
  const hcx = flapHomeX + flapW / 2
  const hcy = flapHomeY + flapH / 2
  const tcx = OX + keepW / 2
  const tcy = OY + keepH + flapW / 2
  const dx = lerp(0, tcx - hcx, fly)
  const dy = lerp(0, tcy - hcy, fly)
  const ang = fly * 90

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 360 280" role="img" aria-label="A bitten square becomes a rectangle">
        {flags.ask && (
          <rect
            className="ds-big"
            x={OX}
            y={OY}
            width={A * CELL - 2}
            height={A * CELL - 2}
          />
        )}

        {flags.showHole && !flags.showCut && (
          <>
            <rect
              className="ds-big"
              x={OX}
              y={OY}
              width={A * CELL - 2}
              height={A * CELL - 2}
            />
            <rect
              className="ds-hole"
              x={OX + keepW}
              y={OY + flapH}
              width={flapW - 2}
              height={B * CELL - 2}
            />
          </>
        )}

        {flags.showCut && (
          <>
            <rect
              className="ds-keep"
              x={OX}
              y={OY}
              width={keepW - 2}
              height={keepH - 2}
            />
            {fly < 0.92 && (
              <rect
                className="ds-hole"
                x={OX + keepW}
                y={OY + flapH}
                width={flapW - 2}
                height={B * CELL - 2}
              />
            )}
            <g transform={`translate(${dx} ${dy}) rotate(${ang} ${hcx} ${hcy})`}>
              <rect
                className="ds-flap"
                x={flapHomeX}
                y={flapHomeY}
                width={flapW - 2}
                height={flapH - 2}
              />
            </g>
            {fly < 0.08 && (
              <line
                className="dist-cut"
                x1={OX + keepW}
                y1={OY - 4}
                x2={OX + keepW}
                y2={OY + flapH + 4}
              />
            )}
          </>
        )}

        {allLanded && (
          <rect
            className="ds-gold show"
            x={OX}
            y={OY}
            width={keepW - 2}
            height={(A + B) * CELL - 2}
          />
        )}

        {flags.showHole && fly < 0.2 && (
          <>
            <text x={OX + (A * CELL) / 2} y={OY + A * CELL + 18} className="dist-label a" textAnchor="middle">
              {flags.generalize ? 'a' : '5'}
            </text>
          </>
        )}
        {allLanded && (
          <>
            <text x={OX + keepW / 2} y={OY + (A + B) * CELL + 16} className="dist-label a" textAnchor="middle">
              {flags.generalize ? 'a−b' : '3'}
            </text>
            <text x={OX - 18} y={OY + ((A + B) * CELL) / 2} className="dist-label b" textAnchor="middle">
              {flags.generalize ? 'a+b' : '7'}
            </text>
          </>
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={180} y={268} className="line-hint" textAnchor="middle">
            {t.diffHint}
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
          {t.diffAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          {flags.generalize ? (
            <>
              <span className="a">a²−b²</span>
              <span className="op">=</span>
              <span className="sum">(a−b)(a+b)</span>
            </>
          ) : (
            <>
              <span className="a">5²−2²</span>
              <span className="op">=</span>
              <span className="sum">3×7</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
