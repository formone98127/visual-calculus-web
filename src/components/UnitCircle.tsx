import type { UnitCircleProps } from '../data/types'

const POINTS = [
  { deg: 0, rad: '0', label: '(1, 0)' },
  { deg: 30, rad: 'π/6', label: '(√3/2, 1/2)' },
  { deg: 45, rad: 'π/4', label: '(√2/2, √2/2)' },
  { deg: 60, rad: 'π/3', label: '(1/2, √3/2)' },
  { deg: 90, rad: 'π/2', label: '(0, 1)' },
]

const CX = 160
const CY = 160
const R = 110

function polar(deg: number) {
  const rad = (deg * Math.PI) / 180
  return {
    x: CX + R * Math.cos(rad),
    y: CY - R * Math.sin(rad),
  }
}

export function UnitCircle({
  showCircle = true,
  showAxes = true,
  pointCount = 0,
  showLabels = false,
  emphasize = null,
}: UnitCircleProps) {
  const visible = POINTS.slice(0, Math.max(0, pointCount))

  return (
    <svg className="unit-circle" viewBox="0 0 320 320" role="img" aria-label="Unit circle">
      {showAxes && (
        <g className="axes">
          <line x1="20" y1={CY} x2="300" y2={CY} />
          <line x1={CX} y1="20" x2={CX} y2="300" />
          <text x="292" y={CY - 8} className="axis-label">
            x
          </text>
          <text x={CX + 8} y="28" className="axis-label">
            y
          </text>
        </g>
      )}

      {showCircle && (
        <circle className="circle" cx={CX} cy={CY} r={R} fill="none" />
      )}

      {visible.map((p) => {
        const { x, y } = polar(p.deg)
        return (
          <g key={p.deg} className="point">
            <line className="ray" x1={CX} y1={CY} x2={x} y2={y} />
            <circle cx={x} cy={y} r={5} />
            {showLabels && (
              <>
                <text
                  x={x + (p.deg === 90 ? 10 : p.deg > 45 ? -8 : 10)}
                  y={y + (p.deg === 90 ? -10 : p.deg < 20 ? 16 : -10)}
                  className="pt-label"
                >
                  {p.label}
                </text>
                <text
                  x={CX + (R + 18) * Math.cos((p.deg * Math.PI) / 180)}
                  y={CY - (R + 18) * Math.sin((p.deg * Math.PI) / 180) + 4}
                  className="rad-label"
                  textAnchor="middle"
                >
                  {p.rad}
                </text>
              </>
            )}
          </g>
        )
      })}

      {emphasize && pointCount > 0 && (
        <g className="emphasize">
          {(() => {
            const last = POINTS[Math.min(pointCount, POINTS.length) - 1]
            const { x, y } = polar(last.deg)
            return (
              <>
                {(emphasize === 'cos' || emphasize === 'both') && (
                  <line className="cos-seg" x1={CX} y1={CY} x2={x} y2={CY} />
                )}
                {(emphasize === 'sin' || emphasize === 'both') && (
                  <line className="sin-seg" x1={x} y1={CY} x2={x} y2={y} />
                )}
              </>
            )
          })()}
        </g>
      )}
    </svg>
  )
}
