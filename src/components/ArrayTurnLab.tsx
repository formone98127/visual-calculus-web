import type { ArrayTurnLabMode, ArrayTurnLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { useAutoFly } from './labMotion'

const COLS = 4
const ROWS = 3
const CELL = 32
const CX = 170
const CY = 118

function modeFlags(mode: ArrayTurnLabMode) {
  return {
    ask: mode === 'ask',
    showGrid: mode !== 'ask',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function ArrayTurnLab({ mode, onInteractComplete }: ArrayTurnLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'grid' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  const ang = fly * 90
  const w = COLS * CELL
  const h = ROWS * CELL
  const x0 = CX - w / 2
  const y0 = CY - h / 2

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 340 250" role="img" aria-label="A 3 by 4 grid turns into 4 by 3">
        <g transform={`rotate(${ang} ${CX} ${CY})`}>
          {flags.ask ? (
            <rect className="arr-whole" x={x0} y={y0} width={w} height={h} />
          ) : (
            Array.from({ length: ROWS * COLS }, (_, i) => {
              const c = i % COLS
              const r = Math.floor(i / COLS)
              return (
                <rect
                  key={i}
                  className="arr-cell"
                  x={x0 + c * CELL}
                  y={y0 + r * CELL}
                  width={CELL - 2}
                  height={CELL - 2}
                />
              )
            })
          )}
        </g>

        {flags.showGrid && fly < 0.15 && (
          <>
            <text x={CX} y={y0 + h + 22} className="dist-label a" textAnchor="middle">
              4
            </text>
            <text x={x0 - 16} y={CY + 4} className="dist-label c" textAnchor="middle">
              3
            </text>
          </>
        )}
        {allLanded && (
          <>
            <text x={CX} y={y0 + w + 8} className="dist-label b" textAnchor="middle">
              {flags.generalize ? 'a' : '3'}
            </text>
            <text x={CX - h / 2 - 18} y={CY + 4} className="dist-label a" textAnchor="middle">
              {flags.generalize ? 'b' : '4'}
            </text>
            <rect
              className="arr-gold show"
              x={CX - h / 2}
              y={CY - w / 2}
              width={h}
              height={w}
            />
          </>
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={170} y={238} className="line-hint" textAnchor="middle">
            {t.arrayHint}
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
          {t.arrayAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          {flags.generalize ? (
            <>
              <span className="a">a×b</span>
              <span className="op">=</span>
              <span className="b">b×a</span>
            </>
          ) : (
            <>
              <span className="a">3×4</span>
              <span className="op">=</span>
              <span className="b">4×3</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
