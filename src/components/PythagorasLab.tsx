import { useEffect, useMemo, useRef, useState } from 'react'
import type { PythagorasLabMode, PythagorasLabProps } from '../data/types'

/** 3-4-5 right triangle in integer grid units */
const A = 3
const B = 4
const C = 5
const U = 36

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

function sub(u: Pt, v: Pt): Pt {
  return { x: u.x - v.x, y: u.y - v.y }
}
function add(u: Pt, v: Pt): Pt {
  return { x: u.x + v.x, y: u.y + v.y }
}
function scale(u: Pt, s: number): Pt {
  return { x: u.x * s, y: u.y * s }
}
function len(u: Pt) {
  return Math.hypot(u.x, u.y)
}
function poly(pts: Pt[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(' ')
}

/**
 * Square sitting on segment P→Q, outward from the triangle interior point R.
 * Side length is EXACTLY |PQ| — the square and the triangle share P–Q as one side.
 */
function squareOnSegment(P: Pt, Q: Pt, R: Pt) {
  const PQ = sub(Q, P)
  const side = len(PQ) // ← only length source
  const T = scale(PQ, 1 / side)
  // Rotate T by +90° and −90°; pick the one pointing away from R
  const n1 = { x: -T.y, y: T.x }
  const n2 = { x: T.y, y: -T.x }
  const mid = scale(add(P, Q), 0.5)
  const d1 = len(sub(add(mid, n1), R))
  const d2 = len(sub(add(mid, n2), R))
  const N = d1 >= d2 ? n1 : n2

  // Outward corners: start at P,Q then go out by exactly `side` along N
  const P2 = add(P, scale(N, side))
  const Q2 = add(Q, scale(N, side))
  // corners in order around the boundary: P → Q → Q2 → P2
  const corners = [P, Q, Q2, P2]

  return { P, Q, N, T, side, corners, P2, Q2 }
}

type Sq = ReturnType<typeof squareOnSegment>

/** Point inside square from grid (i,j) in an n×n tiling — bilinear on corners */
function cellCenter(sq: Sq, i: number, j: number, n: number): Pt {
  const u = (i + 0.5) / n
  const v = (j + 0.5) / n
  // P --T--> Q
  // |         |
  // P2 <-    Q2
  const along = add(sq.P, scale(sub(sq.Q, sq.P), u))
  const out = scale(sq.N, v * sq.side)
  return add(along, out)
}

function cellAngle(sq: Sq) {
  return (Math.atan2(sq.T.y, sq.T.x) * 180) / Math.PI
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
  i: number
  j: number
  nHome: number
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

function mid(P: Pt, Q: Pt): Pt {
  return scale(add(P, Q), 0.5)
}

/** Label offset slightly outside the square */
function labelPos(sq: Sq): Pt {
  return add(mid(sq.P, sq.Q), scale(sq.N, sq.side * 0.5))
}

export function PythagorasLab({ mode, onInteractComplete }: PythagorasLabProps) {
  const flags = modeFlags(mode)
  const [fitted, setFitted] = useState(false)
  const completedRef = useRef(false)
  const tileSpecs = useMemo(() => buildTileSpecs(), [])

  const geom = useMemo(() => {
    // Right angle at A; legs exactly A·U and B·U → hypotenuse exactly C·U
    const P_A: Pt = { x: 0, y: 0 }
    const P_B: Pt = { x: A * U, y: 0 }
    const P_C: Pt = { x: 0, y: -B * U }

    const sqA = squareOnSegment(P_A, P_B, P_C) // side = |AB| = A·U
    const sqB = squareOnSegment(P_A, P_C, P_B) // side = |AC| = B·U
    const sqC = squareOnSegment(P_B, P_C, P_A) // side = |BC| = C·U

    // Sanity: sides must match triangle edges (exact for 3-4-5)
    if (import.meta.env.DEV) {
      const ab = len(sub(P_B, P_A))
      const ac = len(sub(P_C, P_A))
      const bc = len(sub(P_C, P_B))
      console.assert(Math.abs(sqA.side - ab) < 1e-9, 'sqA ≠ AB', sqA.side, ab)
      console.assert(Math.abs(sqB.side - ac) < 1e-9, 'sqB ≠ AC', sqB.side, ac)
      console.assert(Math.abs(sqC.side - bc) < 1e-9, 'sqC ≠ BC', sqC.side, bc)
      console.assert(Math.abs(bc - C * U) < 1e-9, 'BC ≠ 5U', bc, C * U)
    }

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

  const allPts = [
    P_A,
    P_B,
    P_C,
    ...sqA.corners,
    ...sqB.corners,
    ...sqC.corners,
  ]
  const pad = 44
  const minX = Math.min(...allPts.map((p) => p.x)) - pad
  const maxX = Math.max(...allPts.map((p) => p.x)) + pad
  const minY = Math.min(...allPts.map((p) => p.y)) - pad
  const maxY = Math.max(...allPts.map((p) => p.y)) + pad
  const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`

  /** Draw square fill + only the 3 outer edges (shared edge owned by triangle) */
  function SquareShape({
    sq,
    className,
    waiting,
  }: {
    sq: Sq
    className: string
    waiting?: boolean
  }) {
    const { P, Q, Q2, P2 } = sq
    return (
      <g className={`sq-shape ${className}`}>
        <polygon className="sq-fill" points={poly([P, Q, Q2, P2])} />
        <path
          className={`sq-outer ${waiting ? 'sq-c-waiting' : ''}`}
          d={`M ${Q.x} ${Q.y} L ${Q2.x} ${Q2.y} L ${P2.x} ${P2.y} L ${P.x} ${P.y}`}
          fill="none"
        />
      </g>
    )
  }

  return (
    <div
      className={`pythag-lab ${flags.challenge ? 'is-challenge' : ''} ${showFitted ? 'is-fitted' : ''}`}
    >
      {flags.ask && (
        <p className="lab-hook">
          Each square uses one side of the triangle as its side.
        </p>
      )}

      <svg
        className="pythagoras lab-svg"
        viewBox={vb}
        role="img"
        aria-label="Right triangle with squares on each side — sides match exactly"
      >
        {flags.showA && <SquareShape sq={sqA} className="sq-a" />}
        {flags.showB && <SquareShape sq={sqB} className="sq-b" />}
        {flags.showC && (
          <SquareShape
            sq={sqC}
            className="sq-c"
            waiting={flags.challenge && !showFitted}
          />
        )}

        {tileSpecs.map((t) => {
          const homeSq = t.kind === 'a' ? sqA : sqB
          const visible =
            (t.kind === 'a' && flags.tilesA) || (t.kind === 'b' && flags.tilesB)
          if (!visible) return null

          const home = cellCenter(homeSq, t.i, t.j, t.nHome)
          const dest = cellCenter(sqC, t.fi, t.fj, C)
          const pos = showFitted ? dest : home
          const ang = showFitted ? cellAngle(sqC) : cellAngle(homeSq)
          const step = (showFitted ? sqC.side : homeSq.side) / (showFitted ? C : t.nHome)
          const gap = 1.5

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

        {/* Triangle last: its three edges ARE the shared sides */}
        {flags.showTri && (
          <>
            <polygon className="tri" points={poly([P_A, P_B, P_C])} />
            <path
              className="right-angle"
              d={`M ${P_A.x + 16} ${P_A.y} L ${P_A.x + 16} ${P_A.y - 16} L ${P_A.x} ${P_A.y - 16}`}
              fill="none"
            />
            {/* Colored shared sides — same endpoints as the squares */}
            {flags.showA && (
              <line
                className="shared-edge a"
                x1={P_A.x}
                y1={P_A.y}
                x2={P_B.x}
                y2={P_B.y}
              />
            )}
            {flags.showB && (
              <line
                className="shared-edge b"
                x1={P_A.x}
                y1={P_A.y}
                x2={P_C.x}
                y2={P_C.y}
              />
            )}
            {flags.showC && (
              <line
                className="shared-edge c"
                x1={P_B.x}
                y1={P_B.y}
                x2={P_C.x}
                y2={P_C.y}
              />
            )}
            {/* Thin yellow outline on top so the triangle reads clearly */}
            <polygon
              className="tri-outline"
              points={poly([P_A, P_B, P_C])}
              fill="none"
            />
            <text
              x={mid(P_A, P_B).x}
              y={mid(P_A, P_B).y + 22}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'a' : `a = ${A}`}
            </text>
            <text
              x={mid(P_A, P_C).x - 20}
              y={mid(P_A, P_C).y}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'b' : `b = ${B}`}
            </text>
            <text
              x={mid(P_B, P_C).x + 16}
              y={mid(P_B, P_C).y}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'c' : `c = ${C}`}
            </text>
          </>
        )}

        {flags.showA && !showFitted && (
          <text
            x={labelPos(sqA).x}
            y={labelPos(sqA).y + 6}
            className="lab-area a"
            textAnchor="middle"
          >
            {flags.generalize ? 'a²' : `${A}²`}
          </text>
        )}
        {flags.showB && !showFitted && (
          <text
            x={labelPos(sqB).x}
            y={labelPos(sqB).y + 6}
            className="lab-area b"
            textAnchor="middle"
          >
            {flags.generalize ? 'b²' : `${B}²`}
          </text>
        )}
        {flags.showC && !showFitted && (
          <text
            x={labelPos(sqC).x}
            y={labelPos(sqC).y + 6}
            className="lab-area c"
            textAnchor="middle"
          >
            {flags.generalize ? 'c²' : `${C}²`}
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
