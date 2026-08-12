import type { PythagorasProps } from '../data/types'

const UNIT = 18

function outwardNormal(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  px: number,
  py: number,
) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  let nx = -dy / len
  let ny = dx / len
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  if (
    (mx + nx - px) ** 2 + (my + ny - py) ** 2 <
    (mx - nx - px) ** 2 + (my - ny - py) ** 2
  ) {
    nx = -nx
    ny = -ny
  }
  return { nx, ny, len }
}

function squareOnSide(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  px: number,
  py: number,
) {
  const { nx, ny, len } = outwardNormal(x1, y1, x2, y2, px, py)
  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x2 + nx * len, y: y2 + ny * len },
    { x: x1 + nx * len, y: y1 + ny * len },
  ]
}

function polyPoints(pts: { x: number; y: number }[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(' ')
}

function centroid(pts: { x: number; y: number }[]) {
  const x = pts.reduce((s, p) => s + p.x, 0) / pts.length
  const y = pts.reduce((s, p) => s + p.y, 0) / pts.length
  return { x, y }
}

export function PythagorasFigure({
  showTriangle = true,
  showSquareA = false,
  showSquareB = false,
  showSquareC = false,
  showLabels = false,
  showAreas = false,
  highlightEquation = false,
  a = 3,
  b = 4,
  c = 5,
}: PythagorasProps) {
  const scale = UNIT
  const Ax = 0
  const Ay = 0
  const Bx = a * scale
  const By = 0
  const Cx = 0
  const Cy = -b * scale

  const sqLegA = squareOnSide(Ax, Ay, Bx, By, Cx, Cy)
  const sqLegB = squareOnSide(Ax, Ay, Cx, Cy, Bx, By)
  const sqHyp = squareOnSide(Bx, By, Cx, Cy, Ax, Ay)

  const candidates: { x: number; y: number }[] = [
    { x: Ax, y: Ay },
    { x: Bx, y: By },
    { x: Cx, y: Cy },
  ]
  if (showSquareA) candidates.push(...sqLegA)
  if (showSquareB) candidates.push(...sqLegB)
  if (showSquareC) candidates.push(...sqHyp)

  const minX = Math.min(...candidates.map((p) => p.x)) - 24
  const maxX = Math.max(...candidates.map((p) => p.x)) + 24
  const minY = Math.min(...candidates.map((p) => p.y)) - 24
  const maxY = Math.max(...candidates.map((p) => p.y)) + 24
  const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`

  const areaA = a * a
  const areaB = b * b
  const areaC = c * c

  return (
    <div className={`pythagoras-wrap ${highlightEquation ? 'eq-hot' : ''}`}>
      <svg
        className="pythagoras"
        viewBox={vb}
        role="img"
        aria-label="Right triangle with squares on sides"
      >
        {showSquareA && (
          <polygon className="sq sq-a" points={polyPoints(sqLegA)} />
        )}
        {showSquareB && (
          <polygon className="sq sq-b" points={polyPoints(sqLegB)} />
        )}
        {showSquareC && (
          <polygon className="sq sq-c" points={polyPoints(sqHyp)} />
        )}

        {showTriangle && (
          <polygon
            className="tri"
            points={polyPoints([
              { x: Ax, y: Ay },
              { x: Bx, y: By },
              { x: Cx, y: Cy },
            ])}
          />
        )}

        {showTriangle && (
          <path
            className="right-angle"
            d={`M ${Ax + 10} ${Ay} L ${Ax + 10} ${Ay - 10} L ${Ax} ${Ay - 10}`}
            fill="none"
          />
        )}

        {showLabels && (
          <>
            <text
              x={(Ax + Bx) / 2}
              y={Ay + 16}
              className="side-label"
              textAnchor="middle"
            >
              a={a}
            </text>
            <text
              x={Ax - 14}
              y={(Ay + Cy) / 2}
              className="side-label"
              textAnchor="middle"
            >
              b={b}
            </text>
            <text
              x={(Bx + Cx) / 2 + 10}
              y={(By + Cy) / 2}
              className="side-label"
              textAnchor="middle"
            >
              c={c}
            </text>
          </>
        )}

        {showAreas && showSquareA && (
          <text
            x={centroid(sqLegA).x}
            y={centroid(sqLegA).y + 4}
            className="area-label a"
            textAnchor="middle"
          >
            {areaA}
          </text>
        )}
        {showAreas && showSquareB && (
          <text
            x={centroid(sqLegB).x}
            y={centroid(sqLegB).y + 4}
            className="area-label b"
            textAnchor="middle"
          >
            {areaB}
          </text>
        )}
        {showAreas && showSquareC && (
          <text
            x={centroid(sqHyp).x}
            y={centroid(sqHyp).y + 4}
            className="area-label c"
            textAnchor="middle"
          >
            {areaC}
          </text>
        )}
      </svg>
      {highlightEquation && (
        <p className="pythag-eq">
          {areaA} + {areaB} = {areaC}
        </p>
      )}
    </div>
  )
}
