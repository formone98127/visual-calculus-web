import type { UnitCircleProps } from '../data/types'

const POINTS = [
  { deg: 0, rad: '0', label: '(1,0)' },
  { deg: 30, rad: 'π/6', label: '' },
  { deg: 45, rad: 'π/4', label: '' },
  { deg: 60, rad: 'π/3', label: '' },
  { deg: 90, rad: 'π/2', label: '(0,1)' },
]

const CX = 200
const CY = 200
const R = 140

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
  const focus = visible[visible.length - 1]
  const focusPt = focus ? polar(focus.deg) : null

  return (
    <svg
      className="unit-circle"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Unit circle"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {showAxes && (
        <g className="axes">
          <line x1="36" y1={CY} x2="364" y2={CY} />
          <line x1={CX} y1="36" x2={CX} y2="364" />
          <text x="350" y={CY - 10} className="axis-label">
            x
          </text>
          <text x={CX + 10} y="48" className="axis-label">
            y
          </text>
        </g>
      )}

      {showCircle && (
        <circle className="circle draw-in" cx={CX} cy={CY} r={R} fill="none" />
      )}

      {visible.map((p) => {
        const { x, y } = polar(p.deg)
        return (
          <g key={p.deg} className="point pop-in">
            <line className="ray" x1={CX} y1={CY} x2={x} y2={y} />
            <circle cx={x} cy={y} r={7} filter="url(#glow)" />
            {showLabels && (
              <text
                x={CX + (R + 28) * Math.cos((p.deg * Math.PI) / 180)}
                y={CY - (R + 28) * Math.sin((p.deg * Math.PI) / 180) + 4}
                className="rad-label"
                textAnchor="middle"
              >
                {p.rad}
              </text>
            )}
          </g>
        )
      })}

      {emphasize && focusPt && (
        <g className="emphasize">
          {(emphasize === 'cos' || emphasize === 'both') && (
            <>
              <line
                className="cos-seg"
                x1={CX}
                y1={CY}
                x2={focusPt.x}
                y2={CY}
              />
              <text
                x={(CX + focusPt.x) / 2}
                y={CY + 22}
                className="seg-tag cos"
                textAnchor="middle"
              >
                cos
              </text>
            </>
          )}
          {(emphasize === 'sin' || emphasize === 'both') && (
            <>
              <line
                className="sin-seg"
                x1={focusPt.x}
                y1={CY}
                x2={focusPt.x}
                y2={focusPt.y}
              />
              <text
                x={focusPt.x + 18}
                y={(CY + focusPt.y) / 2}
                className="seg-tag sin"
              >
                sin
              </text>
            </>
          )}
        </g>
      )}
    </svg>
  )
}
