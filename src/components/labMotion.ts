import { useEffect, useRef, useState } from 'react'

export function beep() {
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

export function clamp01(t: number) {
  return Math.max(0, Math.min(1, t))
}
export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function useAutoFly(
  mode: string,
  flags: { parked: boolean; autoFly: boolean; generalize: boolean },
  onInteractComplete?: () => void,
) {
  const doneRef = useRef(false)
  const flyRaf = useRef(0)
  const [fly, setFly] = useState(0)
  const [flying, setFlying] = useState(false)
  const [landed, setLanded] = useState(false)

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
    if (flags.parked) {
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

  return {
    fly,
    flying,
    landed,
    allLanded: landed || fly > 0.995,
    runAutoFit,
  }
}
