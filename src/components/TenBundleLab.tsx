import type { TenBundleLabMode, TenBundleLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { lerp, useAutoFly } from './labMotion'

const N = 10
const UNIT = 18
const OX = 28
const OY = 150
const ROD_X = 160
const ROD_Y = 28

function modeFlags(mode: TenBundleLabMode) {
  return {
    ask: mode === 'ask',
    showRow: mode !== 'ask',
    showRod: mode === 'ten' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function TenBundleLab({ mode, onInteractComplete }: TenBundleLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const { fly, flying, landed, allLanded, runAutoFit } = useAutoFly(
    mode,
    {
      parked: flags.ask || mode === 'ones' || mode === 'ten' || flags.challenge,
      autoFly: flags.autoFly,
      generalize: flags.generalize,
    },
    onInteractComplete,
  )

  return (
    <div
      className={`vm-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg className="vm-svg" viewBox="0 0 340 210" role="img" aria-label="Ten ones bundle into a ten">
        {flags.showRod && (
          <rect
            className={`ten-rod ${allLanded ? 'hot' : 'waiting'}`}
            x={ROD_X}
            y={ROD_Y}
            width={UNIT + 2}
            height={N * UNIT}
          />
        )}

        {Array.from({ length: flags.ask ? 6 : N }, (_, i) => {
          const u = flags.ask ? 0 : Math.min(1, Math.max(0, (fly - i * 0.05) / 0.55))
          const clamped = Math.min(1, u)
          const homeX = flags.showRow ? OX + i * (UNIT + 4) : 40 + (i % 5) * 28
          const homeY = flags.showRow ? OY : 70 + Math.floor(i / 5) * 28
          const tx = lerp(homeX, ROD_X + 1, clamped)
          const ty = lerp(homeY, ROD_Y + i * UNIT, clamped)
          const lift = Math.sin(clamped * Math.PI) * 12
          return (
            <rect
              key={i}
              className="ten-one"
              x={tx}
              y={ty - lift}
              width={UNIT}
              height={UNIT}
            />
          )
        })}

        {allLanded && (
          <rect
            className="ten-gold show"
            x={ROD_X}
            y={ROD_Y}
            width={UNIT + 2}
            height={N * UNIT}
          />
        )}

        {flags.challenge && fly < 0.02 && (
          <text x={170} y={200} className="line-hint" textAnchor="middle">
            {t.tenHint}
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
          {t.tenAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="vm-eq show">
          <span className="a">10 ones</span>
          <span className="op">=</span>
          <span className="sum">1 ten</span>
        </p>
      )}
    </div>
  )
}
