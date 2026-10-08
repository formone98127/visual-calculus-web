import { useEffect, useRef, useState } from 'react'
import type { ZeroPairLabMode, ZeroPairLabProps } from '../data/types'
import { useI18n } from '../i18n/I18nProvider'

const N_POS = 3
const N_NEG = 2
const R = 24
const POS_Y = 88
const NEG_Y = 200
const MEET_Y = 144
const XS = [90, 170, 250]

function beep() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 640
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
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function modeFlags(mode: ZeroPairLabMode) {
  return {
    ask: mode === 'ask',
    nPos: mode === 'ask' ? 1 : N_POS,
    nNeg: mode === 'ask' || mode === 'positives' ? (mode === 'ask' ? 1 : 0) : N_NEG,
    showNeg: mode !== 'positives',
    challenge: mode === 'challenge',
    autoFly: mode === 'fitted' || mode === 'generalize',
    generalize: mode === 'generalize',
  }
}

export function ZeroPairLab({ mode, onInteractComplete }: ZeroPairLabProps) {
  const { t } = useI18n()
  const flags = modeFlags(mode)
  const doneRef = useRef(false)
  const flyRaf = useRef(0)
  const [fly, setFly] = useState([0, 0])
  const [flying, setFlying] = useState(false)
  const [landed, setLanded] = useState(false)

  const runFly = (opts?: { instant?: boolean; thenComplete?: boolean }) => {
    cancelAnimationFrame(flyRaf.current)
    if (opts?.instant) {
      setFly([1, 1])
      setLanded(true)
      setFlying(false)
      return
    }
    setFlying(true)
    setLanded(false)
    setFly([0, 0])
    const start = performance.now()
    const dur = 780
    const stagger = 170
    const tick = (now: number) => {
      const next = [0, 0]
      let allDone = true
      for (let i = 0; i < 2; i++) {
        const u = easeOutCubic(clamp01((now - start - i * stagger) / dur))
        next[i] = u
        if (u < 1) allDone = false
      }
      setFly(next)
      if (!allDone) {
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
    if (flags.challenge || flags.ask || mode === 'positives' || mode === 'mixed') {
      setFly([0, 0])
      setLanded(false)
      setFlying(false)
      return
    }
    if (flags.generalize) {
      runFly({ instant: true })
      return
    }
    if (flags.autoFly) {
      setFly([0.25, 0.25])
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

  const allLanded = landed || fly.every((v) => v > 0.995)
  const leftover = flags.nPos - (mode === 'ask' ? 0 : N_NEG)
  const showEq = allLanded && (flags.autoFly || flags.challenge)

  return (
    <div
      className={`zero-lab ${flags.challenge ? 'is-challenge' : ''} ${allLanded ? 'is-fitted' : ''} ${flying ? 'is-flying' : ''}`}
    >
      <svg
        className="zero-svg"
        viewBox="0 0 340 280"
        role="img"
        aria-label="Plus and minus chips cancel in zero pairs"
      >
        <line className="zero-line" x1={40} y1={MEET_Y} x2={300} y2={MEET_Y} />
        <text x={318} y={MEET_Y + 4} className="zero-line-label">
          0
        </text>

        {Array.from({ length: flags.nPos }, (_, i) => {
          const pair = i < flags.nNeg ? fly[i] ?? 0 : 0
          const gone = pair > 0.92
          const y = lerp(POS_Y, MEET_Y, pair)
          const lift = Math.sin(pair * Math.PI) * 10
          const x = flags.nPos === 1 ? 170 : XS[i]
          if (gone && i < flags.nNeg) return null
          return (
            <g key={`p-${i}`} opacity={1 - Math.max(0, pair - 0.55) / 0.45}>
              <circle
                className="chip plus"
                cx={x}
                cy={y - lift}
                r={R}
              />
              <text
                x={x}
                y={y - lift + 6}
                className="chip-mark"
                textAnchor="middle"
              >
                +
              </text>
            </g>
          )
        })}

        {flags.showNeg &&
          Array.from({ length: flags.nNeg }, (_, i) => {
            const pair = fly[i] ?? 0
            const gone = pair > 0.92
            if (gone) return null
            const y = lerp(NEG_Y, MEET_Y, pair)
            const lift = Math.sin(pair * Math.PI) * 10
            const x = flags.nNeg === 1 && flags.nPos === 1 ? 170 : XS[i]
            return (
              <g key={`n-${i}`} opacity={1 - Math.max(0, pair - 0.55) / 0.45}>
                <circle
                  className="chip minus"
                  cx={x}
                  cy={y + lift}
                  r={R}
                />
                <text
                  x={x}
                  y={y + lift + 7}
                  className="chip-mark"
                  textAnchor="middle"
                >
                  −
                </text>
              </g>
            )
          })}

        {allLanded && leftover > 0 && !flags.generalize && (
          <text x={170} y={258} className="zero-left" textAnchor="middle">
            {t.zeroLeft}
          </text>
        )}

        {flags.challenge && fly[0] < 0.02 && (
          <text x={170} y={258} className="line-hint" textAnchor="middle">
            {t.zeroHint}
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
          {t.zeroAutoFit}
        </button>
      )}

      {showEq && (
        <p className="zero-eq show">
          {flags.generalize ? (
            <>
              <span className="a">+1</span>
              <span className="op">+</span>
              <span className="b">−1</span>
              <span className="op">=</span>
              <span className="sum">0</span>
            </>
          ) : (
            <>
              <span className="a">+3</span>
              <span className="op">+</span>
              <span className="b">−2</span>
              <span className="op">=</span>
              <span className="sum">+1</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
