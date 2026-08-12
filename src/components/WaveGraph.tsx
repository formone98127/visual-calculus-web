import type { WavesProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

function samples(fn: (x: number) => number, n = 120) {
  const pts: string[] = []
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2
    const x = 40 + (t / (Math.PI * 2)) * 520
    const y = 110 - fn(t) * 70
    pts.push(`${x},${y}`)
  }
  return pts.join(' ')
}

export function WaveGraph({ mode = 'sinDeriv' }: WavesProps) {
  const { t } = useI18n()
  const sin = samples(Math.sin)
  const cos = samples(Math.cos)
  const nsin = samples((x) => -Math.sin(x))

  return (
    <svg
      className="wave-graph"
      viewBox="0 0 600 280"
      role="img"
      aria-label="Wave graph"
    >
      <line className="wg-axis" x1="40" y1="110" x2="560" y2="110" />
      <line className="wg-axis" x1="40" y1="20" x2="40" y2="200" />

      {(mode === 'sin' ||
        mode === 'both' ||
        mode === 'sinDeriv' ||
        mode === 'all') && (
        <polyline className="wg-sin draw-stroke" points={sin} fill="none" />
      )}
      {(mode === 'cos' ||
        mode === 'both' ||
        mode === 'sinDeriv' ||
        mode === 'all') && (
        <polyline className="wg-cos draw-stroke" points={cos} fill="none" />
      )}
      {(mode === 'cosDeriv' || mode === 'all') && (
        <polyline className="wg-nsin draw-stroke" points={nsin} fill="none" />
      )}

      <g className="wg-legend">
        {(mode === 'sin' ||
          mode === 'sinDeriv' ||
          mode === 'both' ||
          mode === 'all') && (
          <text x="48" y="230" className="lg sin">
            sin x
          </text>
        )}
        {(mode === 'cos' ||
          mode === 'sinDeriv' ||
          mode === 'both' ||
          mode === 'all') && (
          <text x="130" y="230" className="lg cos">
            cos x
          </text>
        )}
        {(mode === 'cosDeriv' || mode === 'all') && (
          <text x="220" y="230" className="lg nsin">
            −sin x
          </text>
        )}
        {mode === 'sinDeriv' && (
          <text x="320" y="230" className="lg hint">
            {t.waveSinDeriv}
          </text>
        )}
        {mode === 'cosDeriv' && (
          <text x="320" y="230" className="lg hint">
            {t.waveCosDeriv}
          </text>
        )}
      </g>
    </svg>
  )
}
