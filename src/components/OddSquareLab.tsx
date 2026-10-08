import type { OddSquareLabMode, OddSquareLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const CELL = 28
const OX = 90
const OY = 36
const LAYERS = [
  { n: 1, color: 'l0', cells: [[0, 0]] as [number, number][] },
  { n: 3, color: 'l1', cells: [[1, 0], [1, 1], [0, 1]] },
  { n: 5, color: 'l2', cells: [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]] },
  {
    n: 7,
    color: 'l3',
    cells: [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [2, 3],
      [1, 3],
      [0, 3],
    ],
  },
]

function modeFlags(mode: OddSquareLabMode) {
  const show = mode === 'ask' ? 1 : mode === 'small' ? 2 : 3
  return {
    show,
    showNext: mode === 'next' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function OddSquareLab({ mode, onInteractComplete }: OddSquareLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: mode === 'ask' || mode === 'small' || mode === 'next' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 340 250" role="img" aria-label="Odd layers wrap into a square">
        {LAYERS.slice(0, flags.show).map((layer) =>
          layer.cells.map(([c, r], i) => (
            <rect
              key={`${layer.n}-${i}`}
              className={`odd-cell ${layer.color}`}
              x={OX + c * CELL}
              y={OY + r * CELL}
              width={CELL - 2}
              height={CELL - 2}
            />
          )),
        )}

        {flags.showNext &&
          LAYERS[3].cells.map(([c, r], i) => {
            const u = Math.min(1, Math.max(0, (fly - i * 0.08) / 0.45))
            const homeX = 250
            const homeY = 40 + i * 22
            const x = lerp(homeX, OX + c * CELL, u)
            const y = lerp(homeY, OY + r * CELL, u)
            const lift = Math.sin(u * Math.PI) * 10
            return (
              <rect
                key={`n-${i}`}
                className="odd-cell l3"
                x={x}
                y={y - lift}
                width={CELL - 2}
                height={CELL - 2}
                opacity={0.35 + 0.65 * Math.max(u, flags.challenge || mode === 'next' ? 0.5 : 1)}
              />
            )
          })}

        {allLanded && (
          <rect
            className="odd-gold show"
            x={OX}
            y={OY}
            width={4 * CELL - 2}
            height={4 * CELL - 2}
          />
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={170} y={238} className="line-hint" textAnchor="middle">
            {t.oddHint}
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
          {t.oddAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          {flags.generalize ? (
            <>
              <span className="a">1+3+5+7</span>
              <span className="op">=</span>
              <span className="sum">4²</span>
            </>
          ) : (
            <>
              <span className="a">1+3+5+7</span>
              <span className="op">=</span>
              <span className="sum">16</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
