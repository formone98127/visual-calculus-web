import type { PythagorasProps } from '../data/types'

const UNIT = 22

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

function tileGrid(
  sq: { x: number; y: number }[],
  n: number,
  className: string,
) {
  // sq[0]=p1, sq[1]=p2 along side, sq[3] outward from p1
  const tiles = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const u0 = i / n
      const u1 = (i + 1) / n
      const v0 = j / n
      const v1 = (j + 1) / n
      const corner = (u: number, v: number) => ({
        x:
          sq[0].x +
          (sq[1].x - sq[0].x) * u +
          (sq[3].x - sq[0].x) * v,
        y:
          sq[0].y +
          (sq[1].y - sq[0].y) * u +
          (sq[3].y - sq[0].y) * v,
      })
      const c00 = corner(u0, v0)
      const c10 = corner(u1, v0)
      const c11 = corner(u1, v1)
      const c01 = corner(u0, v1)
      tiles.push(
        <polygon
          key={`${className}-${i}-${j}`}
          className={`tile ${className}`}
          points={polyPoints([c00, c10, c11, c01])}
          style={{ animationDelay: `${(i * n + j) * 18}ms` }}
        />,
      )
    }
  }
  return tiles
}

export function PythagorasFigure({
  showTriangle = true,
  showSquareA = false,
  showSquareB = false,
  showSquareC = false,
  showLabels = false,
  showAreas = false,
  showTiles = false,
  highlightEquation = false,
  a = 3,
  b = 4,
  c = 5,
}: PythagorasProps) {
  const scale = a + b > 14 ? 12 : UNIT
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

  const pad = 36
  const minX = Math.min(...candidates.map((p) => p.x)) - pad
  const maxX = Math.max(...candidates.map((p) => p.x)) + pad
  const minY = Math.min(...candidates.map((p) => p.y)) - pad
  const maxY = Math.max(...candidates.map((p) => p.y)) + pad
  const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`

  const areaA = a * a
  const areaB = b * b
  const areaC = c * c
  const useTiles = showTiles && a <= 5 && b <= 5

  return (
    <div className={`pythagoras-wrap ${highlightEquation ? 'eq-hot' : ''}`}>
      <svg
        className="pythagoras"
        viewBox={vb}
        role="img"
        aria-label="Right triangle with squares on sides"
      >
        {showSquareA && (
          <g className="sq-group pop-sq">
            <polygon className="sq sq-a" points={polyPoints(sqLegA)} />
            {useTiles && tileGrid(sqLegA, a, 'tile-a')}
          </g>
        )}
        {showSquareB && (
          <g className="sq-group pop-sq">
            <polygon className="sq sq-b" points={polyPoints(sqLegB)} />
            {useTiles && tileGrid(sqLegB, b, 'tile-b')}
          </g>
        )}
        {showSquareC && (
          <g className="sq-group pop-sq">
            <polygon className="sq sq-c" points={polyPoints(sqHyp)} />
            {useTiles && c <= 6 && tileGrid(sqHyp, c, 'tile-c')}
          </g>
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
            d={`M ${Ax + 12} ${Ay} L ${Ax + 12} ${Ay - 12} L ${Ax} ${Ay - 12}`}
            fill="none"
          />
        )}

        {showLabels && (
          <>
            <text
              x={(Ax + Bx) / 2}
              y={Ay + 20}
              className="side-label"
              textAnchor="middle"
            >
              a={a}
            </text>
            <text
              x={Ax - 18}
              y={(Ay + Cy) / 2}
              className="side-label"
              textAnchor="middle"
            >
              b={b}
            </text>
            <text
              x={(Bx + Cx) / 2 + 14}
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
            y={centroid(sqLegA).y + 6}
            className="area-label a"
            textAnchor="middle"
          >
            {areaA}
          </text>
        )}
        {showAreas && showSquareB && (
          <text
            x={centroid(sqLegB).x}
            y={centroid(sqLegB).y + 6}
            className="area-label b"
            textAnchor="middle"
          >
            {areaB}
          </text>
        )}
        {showAreas && showSquareC && (
          <text
            x={centroid(sqHyp).x}
            y={centroid(sqHyp).y + 6}
            className="area-label c"
            textAnchor="middle"
          >
            {areaC}
          </text>
        )}
      </svg>
      {highlightEquation && (
        <p className="pythag-eq pop-in">
          <span className="a">{areaA}</span>
          <span className="op">+</span>
          <span className="b">{areaB}</span>
          <span className="op">=</span>
          <span className="c">{areaC}</span>
        </p>
      )}
    </div>
  )
}
