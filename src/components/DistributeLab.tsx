import { useEffect, useMemo, useRef, useState } from 'react'
import type { DistributeLabMode, DistributeLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

const COLS = 5
const ROWS = 4
const CUT = 2
const CELL = 36
const GAP = 36
const OX = 36
const OY = 36

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 650
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

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t))
}
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function modeFlags(mode: DistributeLabMode) {
  return {
    ask: mode === 'ask',
    showGrid: mode !== 'ask',
    showCut: mode === 'cut' || mode === 'challenge' || mode === 'fitted' || mode === 'generalize',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function DistributeLab({ mode, onInteractComplete }: DistributeLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const doneRef = useRef(false)
  const flyRaf = useRef(0)
  const [fly, setFly] = useState(0)
  const [flying, setFlying] = useState(false)
  const [landed, setLanded] = useState(false)

  const cells = useMemo(() => {
    const out: { c: number; r: number }[] = []
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        out.push({ c, r })
      }
    }
    return out
  }, [])

  const runFly = (opts?: { instant?: boolean; thenComplete?: boolean }) => {
    cancelAnimationFrame(flyRaf.current)
    if (opts?.instant) {
      setFly(1)
      setLanded(true)
      setFlying(false)
      return
    }
    setFlying(true)
    setLanded(false)
    setFly(0)
    const start = performance.now()
    const dur = 820
    const tick = (now: number) => {
      const u = easeOutCubic(clamp01((now - start) / dur))
      setFly(u)
      if (u < 1) {
        flyRaf.current = requestAnimationFrame(tick)
      } else {
        setFlying(false)
        setLanded(true)
        beep()
        if (opts?.thenComplete && !doneRef.current) {
          doneRef.current = true
          window.setTimeout(() => onInteractComplete?.(), 280)
        }
      }
    }
    flyRaf.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    cancelAnimationFrame(flyRaf.current)
    doneRef.current = false
    if (flags.challenge || flags.ask || mode === 'grid' || mode === 'cut') {
      setFly(0)
      setLanded(false)
      setFlying(false)
      return
    }
    if (flags.generalize) {
      runFly({ instant: true })
      return
    }
    if (flags.autoFly) {
      setFly(0.2)
      const id = window.setTimeout(() => runFly({ instant: false }), 40)
      return () => {
        clearTimeout(id)
        cancelAnimationFrame(flyRaf.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  useEffect(() => () => cancelAnimationFrame(flyRaf.current), [])

  const runAutoFit = () => {
    if (flying || landed) return
    runFly({ thenComplete: true })
  }

  const allLanded = landed || fly > 0.995
  const split = fly
  const leftW = CUT * CELL
  const rightW = (COLS - CUT) * CELL
  const h = ROWS * CELL
  const vbW = OX * 2 + COLS * CELL + GAP + 8
  const vbH = OY * 2 + h + 36

  return (
    <div
      className={`dist-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg
        className="dist-svg"
        viewBox={`0 0 ${vbW} ${vbH}`}
        role="img"
        aria-label="A rectangle splits without losing area"
      >
        {flags.ask && (
          <rect
            className="dist-whole"
            x={OX}
            y={OY}
            width={COLS * CELL}
            height={h}
          />
        )}

        {flags.showGrid &&
          cells.map(({ c, r }) => {
            const dx = c >= CUT ? split * GAP : 0
            const left = c < CUT
            const splitColor = flags.showCut && !left
            return (
              <rect
                key={`${c}-${r}`}
                className={`dist-cell ${splitColor ? 'right' : 'left'}`}
                x={OX + c * CELL + dx}
                y={OY + r * CELL}
                width={CELL - 2}
                height={CELL - 2}
              />
            )
          })}

        {flags.showCut && split < 0.08 && (
          <line
            className="dist-cut"
            x1={OX + CUT * CELL}
            y1={OY - 6}
            x2={OX + CUT * CELL}
            y2={OY + h + 6}
          />
        )}

        <rect
          className={`dist-gold ${allLanded ? 'show' : ''}`}
          x={OX}
          y={OY}
          width={leftW - 2}
          height={h - 2}
        />
        <rect
          className={`dist-gold ${allLanded ? 'show' : ''}`}
          x={OX + CUT * CELL + split * GAP}
          y={OY}
          width={rightW - 2}
          height={h - 2}
        />

        {flags.showGrid && !flags.showCut && (
          <text
            x={OX + (COLS * CELL) / 2}
            y={OY + h + 22}
            className="dist-label a"
            textAnchor="middle"
          >
            5
          </text>
        )}
        {flags.showCut && (
          <text
            x={OX + leftW / 2}
            y={OY + h + 22}
            className="dist-label a"
            textAnchor="middle"
          >
            {flags.generalize ? 'a' : '2'}
          </text>
        )}
        {flags.showCut && split > 0.4 && (
          <text
            x={OX + CUT * CELL + split * GAP + rightW / 2}
            y={OY + h + 22}
            className="dist-label b"
            textAnchor="middle"
          >
            {flags.generalize ? 'b' : '3'}
          </text>
        )}
        {flags.showGrid && (
          <text
            x={OX - 16}
            y={OY + h / 2 + 4}
            className="dist-label c"
            textAnchor="middle"
          >
            {flags.generalize ? 'c' : '4'}
          </text>
        )}

        {flags.challenge && split < 0.02 && (
          <text
            x={OX + (COLS * CELL) / 2}
            y={OY + h + 22}
            className="line-hint"
            textAnchor="middle"
          >
            {t.distHint}
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
          {t.distAutoFit}
        </button>
      )}

      {allLanded && (flags.autoFly || flags.challenge) && (
        <p className="dist-eq show">
          {flags.generalize ? (
            <>
              <span className="a">(a+b)</span>
              <span className="op">×</span>
              <span className="c">c</span>
              <span className="op">=</span>
              <span className="a">a×c</span>
              <span className="op">+</span>
              <span className="b">b×c</span>
            </>
          ) : (
            <>
              <span className="a">2×4</span>
              <span className="op">+</span>
              <span className="b">3×4</span>
              <span className="op">=</span>
              <span className="sum">5×4</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
