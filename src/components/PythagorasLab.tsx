import { useEffect, useMemo, useRef, useState } from 'react'
import type { PythagorasLabMode, PythagorasLabProps } from '../data/types'

const A = 3
const B = 4
const C = 5
const U = 32

type Pt = { x: number; y: number }

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 660
    g.gain.value = 0.04
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
    o.stop(ctx.currentTime + 0.36)
    window.setTimeout(() => ctx.close(), 500)
  } catch {
    /* ignore */
  }
}

/** Outward unit normal from segment P→Q, away from point R. */
function outwardNormal(P: Pt, Q: Pt, R: Pt): Pt {
  const dx = Q.x - P.x
  const dy = Q.y - P.y
  const len = Math.hypot(dx, dy) || 1
  let nx = -dy / len
  let ny = dx / len
  const mx = (P.x + Q.x) / 2
  const my = (P.y + Q.y) / 2
  // If midpoint+normal is closer to R, flip (we want away from R)
  const dPlus = (mx + nx - R.x) ** 2 + (my + ny - R.y) ** 2
  const dMinus = (mx - nx - R.x) ** 2 + (my - ny - R.y) ** 2
  if (dPlus < dMinus) {
    nx = -nx
    ny = -ny
  }
  return { x: nx, y: ny }
}

type SquareGeom = {
  /** Corner on triangle, start of shared side */
  P: Pt
  /** Corner on triangle, end of shared side */
  Q: Pt
  /** Outward normal */
  N: Pt
  /** Side length in px */
  side: number
  /** Shared-side unit direction P→Q */
  T: Pt
  /** Four corners: P, Q, Q+N*side, P+N*side */
  corners: Pt[]
  /** SVG transform placing local (0,0)-(side,side) so +x = T, +y = N */
  transform: string
}

function squareOnSide(P: Pt, Q: Pt, inside: Pt, side: number): SquareGeom {
  const dx = Q.x - P.x
  const dy = Q.y - P.y
  const len = Math.hypot(dx, dy) || 1
  const T = { x: dx / len, y: dy / len }
  const N = outwardNormal(P, Q, inside)
  const corners: Pt[] = [
    P,
    Q,
    { x: Q.x + N.x * side, y: Q.y + N.y * side },
    { x: P.x + N.x * side, y: P.y + N.y * side },
  ]
  // Local: x along T, y along N. Map local (0,0) → P
  // SVG matrix: [T.x N.x P.x; T.y N.y P.y; 0 0 1]
  const transform = `matrix(${T.x} ${T.y} ${N.x} ${N.y} ${P.x} ${P.y})`
  return { P, Q, N, T, side, corners, transform }
}

function poly(pts: Pt[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(' ')
}

function modeFlags(mode: PythagorasLabMode) {
  return {
    showTri: mode !== 'ask',
    showA: ['squareA', 'squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    showB: ['squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    showC: ['squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    tilesA: ['squareA', 'squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    tilesB: ['squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    challenge: mode === 'challenge',
    fitted: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
    ask: mode === 'ask',
  }
}

type TileSpec = {
  id: string
  kind: 'a' | 'b'
  /** local grid index in home square */
  i: number
  j: number
  nHome: number
  /** destination cell in C (5×5) */
  fi: number
  fj: number
}

function buildTileSpecs(): TileSpec[] {
  const tiles: TileSpec[] = []
  let k = 0
  for (let i = 0; i < A; i++) {
    for (let j = 0; j < A; j++) {
      tiles.push({
        id: `a-${i}-${j}`,
        kind: 'a',
        i,
        j,
        nHome: A,
        fi: k % C,
        fj: Math.floor(k / C),
      })
      k++
    }
  }
  for (let i = 0; i < B; i++) {
    for (let j = 0; j < B; j++) {
      tiles.push({
        id: `b-${i}-${j}`,
        kind: 'b',
        i,
        j,
        nHome: B,
        fi: k % C,
        fj: Math.floor(k / C),
      })
      k++
    }
  }
  return tiles
}

/** Map local square coords → world via square transform basis */
function localToWorld(sq: SquareGeom, lx: number, ly: number): Pt {
  return {
    x: sq.P.x + sq.T.x * lx + sq.N.x * ly,
    y: sq.P.y + sq.T.y * lx + sq.N.y * ly,
  }
}

function cellCenter(sq: SquareGeom, i: number, j: number, n: number): Pt {
  const step = sq.side / n
  return localToWorld(sq, (i + 0.5) * step, (j + 0.5) * step)
}

function cellAngle(sq: SquareGeom) {
  return (Math.atan2(sq.T.y, sq.T.x) * 180) / Math.PI
}

export function PythagorasLab({ mode, onInteractComplete }: PythagorasLabProps) {
  const flags = modeFlags(mode)
  const [fitted, setFitted] = useState(false)
  const completedRef = useRef(false)
  const tileSpecs = useMemo(() => buildTileSpecs(), [])

  // Right triangle: right angle at A, legs along +x and -y
  const geom = useMemo(() => {
    const P_A: Pt = { x: 0, y: 0 }
    const P_B: Pt = { x: A * U, y: 0 }
    const P_C: Pt = { x: 0, y: -B * U }
    // Square on AB (leg a) — side length a
    const sqA = squareOnSide(P_A, P_B, P_C, A * U)
    // Square on AC (leg b) — side length b
    const sqB = squareOnSide(P_A, P_C, P_B, B * U)
    // Square on BC (hypotenuse) — side length c = |BC|
    const sqC = squareOnSide(P_B, P_C, P_A, C * U)
    return { P_A, P_B, P_C, sqA, sqB, sqC }
  }, [])

  useEffect(() => {
    if (mode === 'challenge') {
      setFitted(false)
      completedRef.current = false
    } else if (mode === 'fitted' || mode === 'generalize') {
      setFitted(true)
    } else {
      setFitted(false)
      completedRef.current = false
    }
  }, [mode])

  const showFitted = fitted || flags.fitted
  const { P_A, P_B, P_C, sqA, sqB, sqC } = geom

  const runAutoFit = () => {
    if (showFitted) return
    setFitted(true)
    window.setTimeout(() => {
      beep()
      if (!completedRef.current) {
        completedRef.current = true
        onInteractComplete?.()
      }
    }, 900)
  }

  // ViewBox from all square corners + triangle
  const allPts = [
    P_A,
    P_B,
    P_C,
    ...sqA.corners,
    ...sqB.corners,
    ...sqC.corners,
  ]
  const pad = 40
  const minX = Math.min(...allPts.map((p) => p.x)) - pad
  const maxX = Math.max(...allPts.map((p) => p.x)) + pad
  const minY = Math.min(...allPts.map((p) => p.y)) - pad
  const maxY = Math.max(...allPts.map((p) => p.y)) + pad
  const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`

  const mid = (P: Pt, Q: Pt) => ({ x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 })

  return (
    <div
      className={`pythag-lab ${flags.challenge ? 'is-challenge' : ''} ${showFitted ? 'is-fitted' : ''}`}
    >
      {flags.ask && (
        <p className="lab-hook">
          Each square sits on one side of the triangle.
        </p>
      )}

      <svg
        className="pythagoras lab-svg"
        viewBox={vb}
        role="img"
        aria-label="Pythagorean theorem: squares on each side of a right triangle"
      >
        {/* Squares as groups in local side-aligned coords — edges share the triangle */}
        {flags.showA && (
          <g className="sq-group" transform={sqA.transform}>
            <rect
              className="sq-fill sq-a"
              x={0}
              y={0}
              width={sqA.side}
              height={sqA.side}
            />
          </g>
        )}
        {flags.showB && (
          <g className="sq-group" transform={sqB.transform}>
            <rect
              className="sq-fill sq-b"
              x={0}
              y={0}
              width={sqB.side}
              height={sqB.side}
            />
          </g>
        )}
        {flags.showC && (
          <g className="sq-group" transform={sqC.transform}>
            <rect
              className={`sq-fill sq-c ${flags.challenge && !showFitted ? 'sq-c-waiting' : ''}`}
              x={0}
              y={0}
              width={sqC.side}
              height={sqC.side}
            />
          </g>
        )}

        {/* Unit tiles — always axis-aligned in their square's local frame via world pose */}
        {tileSpecs.map((t) => {
          const homeSq = t.kind === 'a' ? sqA : sqB
          const visible =
            (t.kind === 'a' && flags.tilesA) || (t.kind === 'b' && flags.tilesB)
          if (!visible) return null

          const home = cellCenter(homeSq, t.i, t.j, t.nHome)
          const dest = cellCenter(sqC, t.fi, t.fj, C)
          const pos = showFitted ? dest : home
          const ang = showFitted ? cellAngle(sqC) : cellAngle(homeSq)
          const step = showFitted ? sqC.side / C : homeSq.side / t.nHome
          const gap = 1.2

          return (
            <g
              key={t.id}
              className={`lab-tile kind-${t.kind}`}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${ang}deg)`,
              }}
            >
              <rect
                x={-step / 2 + gap / 2}
                y={-step / 2 + gap / 2}
                width={step - gap}
                height={step - gap}
                rx={2}
              />
            </g>
          )
        })}

        {/* Triangle on top so shared sides read clearly */}
        {flags.showTri && (
          <polygon
            className="tri"
            points={poly([P_A, P_B, P_C])}
          />
        )}
        {flags.showTri && (
          <path
            className="right-angle"
            d={`M ${P_A.x + 14} ${P_A.y} L ${P_A.x + 14} ${P_A.y - 14} L ${P_A.x} ${P_A.y - 14}`}
            fill="none"
          />
        )}

        {/* Shared-edge emphasis */}
        {flags.showTri && flags.showA && (
          <line
            className="shared-edge a"
            x1={P_A.x}
            y1={P_A.y}
            x2={P_B.x}
            y2={P_B.y}
          />
        )}
        {flags.showTri && flags.showB && (
          <line
            className="shared-edge b"
            x1={P_A.x}
            y1={P_A.y}
            x2={P_C.x}
            y2={P_C.y}
          />
        )}
        {flags.showTri && flags.showC && (
          <line
            className="shared-edge c"
            x1={P_B.x}
            y1={P_B.y}
            x2={P_C.x}
            y2={P_C.y}
          />
        )}

        {flags.showTri && (
          <>
            <text
              x={mid(P_A, P_B).x}
              y={mid(P_A, P_B).y + 20}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'a' : `a = ${A}`}
            </text>
            <text
              x={mid(P_A, P_C).x - 18}
              y={mid(P_A, P_C).y}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'b' : `b = ${B}`}
            </text>
            <text
              x={mid(P_B, P_C).x + 14}
              y={mid(P_B, P_C).y}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'c' : `c = ${C}`}
            </text>
          </>
        )}

        {/* Area labels at square centers */}
        {flags.showA && !showFitted && (
          <text
            x={localToWorld(sqA, sqA.side / 2, sqA.side / 2).x}
            y={localToWorld(sqA, sqA.side / 2, sqA.side / 2).y + 6}
            className="lab-area a"
            textAnchor="middle"
          >
            {flags.generalize ? 'a²' : `${A}² = ${A * A}`}
          </text>
        )}
        {flags.showB && !showFitted && (
          <text
            x={localToWorld(sqB, sqB.side / 2, sqB.side / 2).x}
            y={localToWorld(sqB, sqB.side / 2, sqB.side / 2).y + 6}
            className="lab-area b"
            textAnchor="middle"
          >
            {flags.generalize ? 'b²' : `${B}² = ${B * B}`}
          </text>
        )}
        {flags.showC && (
          <text
            x={localToWorld(sqC, sqC.side / 2, sqC.side / 2).x}
            y={localToWorld(sqC, sqC.side / 2, sqC.side / 2).y + 6}
            className="lab-area c"
            textAnchor="middle"
          >
            {flags.generalize ? 'c²' : `${C}² = ${C * C}`}
          </text>
        )}
      </svg>

      {flags.challenge && !showFitted && (
        <button
          type="button"
          className="auto-fit"
          onClick={(e) => {
            e.stopPropagation()
            runAutoFit()
          }}
        >
          Move tiles into the big square →
        </button>
      )}

      {showFitted && (flags.challenge || flags.fitted) && (
        <p className={`pythag-eq ${flags.generalize ? 'gen' : ''}`}>
          {flags.generalize ? (
            <>
              <span className="a">a²</span>
              <span className="op">+</span>
              <span className="b">b²</span>
              <span className="op">=</span>
              <span className="c">c²</span>
            </>
          ) : (
            <>
              <span className="a">9</span>
              <span className="op">+</span>
              <span className="b">16</span>
              <span className="op">=</span>
              <span className="c">25</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
