import { useEffect, useMemo, useRef, useState } from 'react'
import type { PythagorasLabMode, PythagorasLabProps } from '../data/types'

const A = 3
const B = 4
const C = 5
const U = 28

type Pose = { x: number; y: number; rot: number }

type Tile = {
  id: string
  kind: 'a' | 'b'
  home: Pose
  fit: Pose
}

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

function squareFrame(
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
  const ux = dx / len
  const uy = dy / len
  return { x1, y1, ux, uy, nx, ny, len }
}

function tilePose(
  frame: ReturnType<typeof squareFrame>,
  i: number,
  j: number,
  n: number,
): Pose {
  const step = frame.len / n
  const x =
    frame.x1 + frame.ux * (i + 0.5) * step + frame.nx * (j + 0.5) * step
  const y =
    frame.y1 + frame.uy * (i + 0.5) * step + frame.ny * (j + 0.5) * step
  const rot = (Math.atan2(frame.uy, frame.ux) * 180) / Math.PI
  return { x, y, rot }
}

function polyFromFrame(frame: ReturnType<typeof squareFrame>) {
  const { x1, y1, ux, uy, nx, ny, len } = frame
  const p0 = `${x1},${y1}`
  const p1 = `${x1 + ux * len},${y1 + uy * len}`
  const p2 = `${x1 + ux * len + nx * len},${y1 + uy * len + ny * len}`
  const p3 = `${x1 + nx * len},${y1 + ny * len}`
  return `${p0} ${p1} ${p2} ${p3}`
}

function buildTiles(): Tile[] {
  const Ax = 0
  const Ay = 0
  const Bx = A * U
  const By = 0
  const Cx = 0
  const Cy = -B * U

  const frameA = squareFrame(Ax, Ay, Bx, By, Cx, Cy)
  const frameB = squareFrame(Ax, Ay, Cx, Cy, Bx, By)
  const frameC = squareFrame(Bx, By, Cx, Cy, Ax, Ay)

  const tiles: Tile[] = []
  let fitIndex = 0

  for (let i = 0; i < A; i++) {
    for (let j = 0; j < A; j++) {
      const fi = fitIndex % C
      const fj = Math.floor(fitIndex / C)
      tiles.push({
        id: `a-${i}-${j}`,
        kind: 'a',
        home: tilePose(frameA, i, j, A),
        fit: tilePose(frameC, fi, fj, C),
      })
      fitIndex++
    }
  }

  for (let i = 0; i < B; i++) {
    for (let j = 0; j < B; j++) {
      const fi = fitIndex % C
      const fj = Math.floor(fitIndex / C)
      tiles.push({
        id: `b-${i}-${j}`,
        kind: 'b',
        home: tilePose(frameB, i, j, B),
        fit: tilePose(frameC, fi, fj, C),
      })
      fitIndex++
    }
  }

  return tiles
}

const GEOM = (() => {
  const Ax = 0
  const Ay = 0
  const Bx = A * U
  const By = 0
  const Cx = 0
  const Cy = -B * U
  return {
    Ax,
    Ay,
    Bx,
    By,
    Cx,
    Cy,
    frameA: squareFrame(Ax, Ay, Bx, By, Cx, Cy),
    frameB: squareFrame(Ax, Ay, Cx, Cy, Bx, By),
    frameC: squareFrame(Bx, By, Cx, Cy, Ax, Ay),
  }
})()

function modeFlags(mode: PythagorasLabMode) {
  return {
    showTri: mode !== 'ask',
    showA: ['squareA', 'squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    showB: ['squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    showC: ['squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    showTilesA: ['squareA', 'squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    showTilesB: ['squareB', 'squareC', 'challenge', 'fitted', 'generalize'].includes(mode),
    challenge: mode === 'challenge',
    fitted: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
    ask: mode === 'ask',
  }
}

function areaLabel(
  frame: ReturnType<typeof squareFrame>,
  text: string,
  cls: string,
) {
  const cx = frame.x1 + (frame.ux + frame.nx) * frame.len * 0.5
  const cy = frame.y1 + (frame.uy + frame.ny) * frame.len * 0.5
  return (
    <text x={cx} y={cy + 6} className={`lab-area ${cls}`} textAnchor="middle">
      {text}
    </text>
  )
}

export function PythagorasLab({ mode, onInteractComplete }: PythagorasLabProps) {
  const tiles = useMemo(() => buildTiles(), [])
  const flags = modeFlags(mode)
  const [fitted, setFitted] = useState(false)
  const completedRef = useRef(false)

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

  const runAutoFit = () => {
    if (showFitted) return
    setFitted(true)
    window.setTimeout(() => {
      beep()
      if (!completedRef.current) {
        completedRef.current = true
        onInteractComplete?.()
      }
    }, 850)
  }

  const { Ax, Ay, Bx, By, Cx, Cy, frameA, frameB, frameC } = GEOM

  const pad = 48
  const corners = [
    { x: Ax, y: Ay },
    { x: Bx, y: By },
    { x: Cx, y: Cy },
    ...[frameA, frameB, frameC].flatMap((f) => [
      { x: f.x1, y: f.y1 },
      { x: f.x1 + f.ux * f.len, y: f.y1 + f.uy * f.len },
      {
        x: f.x1 + f.ux * f.len + f.nx * f.len,
        y: f.y1 + f.uy * f.len + f.ny * f.len,
      },
      { x: f.x1 + f.nx * f.len, y: f.y1 + f.ny * f.len },
    ]),
  ]
  const minX = Math.min(...corners.map((p) => p.x)) - pad
  const maxX = Math.max(...corners.map((p) => p.x)) + pad
  const minY = Math.min(...corners.map((p) => p.y)) - pad
  const maxY = Math.max(...corners.map((p) => p.y)) + pad
  const vb = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`

  return (
    <div
      className={`pythag-lab ${flags.challenge ? 'is-challenge' : ''} ${showFitted ? 'is-fitted' : ''}`}
    >
      {flags.ask && (
        <p className="lab-hook">
          Three squares. One triangle. What’s the secret?
        </p>
      )}

      <svg
        className="pythagoras lab-svg"
        viewBox={vb}
        role="img"
        aria-label="Pythagorean tile lab"
      >
        {flags.showA && (
          <polygon className="sq sq-a" points={polyFromFrame(frameA)} />
        )}
        {flags.showB && (
          <polygon className="sq sq-b" points={polyFromFrame(frameB)} />
        )}
        {flags.showC && (
          <polygon
            className={`sq sq-c ${flags.challenge && !showFitted ? 'sq-c-waiting' : ''}`}
            points={polyFromFrame(frameC)}
          />
        )}

        {tiles.map((t) => {
          const visible =
            (t.kind === 'a' && flags.showTilesA) ||
            (t.kind === 'b' && flags.showTilesB)
          if (!visible) return null
          const pose = showFitted ? t.fit : t.home
          return (
            <g
              key={t.id}
              className={`lab-tile kind-${t.kind}`}
              style={{
                transform: `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rot}deg)`,
              }}
            >
              <rect x={-U / 2} y={-U / 2} width={U} height={U} rx={2.5} />
            </g>
          )
        })}

        {flags.showTri && (
          <polygon
            className="tri"
            points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
          />
        )}
        {flags.showTri && (
          <path
            className="right-angle"
            d={`M ${Ax + 12} ${Ay} L ${Ax + 12} ${Ay - 12} L ${Ax} ${Ay - 12}`}
            fill="none"
          />
        )}

        {flags.showTri && (
          <>
            <text
              x={(Ax + Bx) / 2}
              y={Ay + 22}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'a' : `a=${A}`}
            </text>
            <text
              x={Ax - 20}
              y={(Ay + Cy) / 2}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'b' : `b=${B}`}
            </text>
            <text
              x={(Bx + Cx) / 2 + 16}
              y={(By + Cy) / 2}
              className="side-label"
              textAnchor="middle"
            >
              {flags.generalize ? 'c' : `c=${C}`}
            </text>
          </>
        )}

        {flags.showA &&
          !showFitted &&
          areaLabel(frameA, flags.generalize ? 'a²' : '9', 'a')}
        {flags.showB &&
          !showFitted &&
          areaLabel(frameB, flags.generalize ? 'b²' : '16', 'b')}
        {flags.showC &&
          areaLabel(frameC, flags.generalize ? 'c²' : '25', 'c')}
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
          Auto-fit tiles →
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
