import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { nextLessonId } from '../data/catalog'
import type {
  AngleSumLabProps,
  ArrayTurnLabProps,
  BarEqLabProps,
  BinomLabProps,
  CargoLabProps,
  CongruenceLabProps,
  CircleAreaLabProps,
  CompleteSqLabProps,
  CubicFacLabProps,
  DiffSquaresLabProps,
  DistributeLabProps,
  FibonacciLabProps,
  FractionBarLabProps,
  HalfHalfLabProps,
  HowManyLabProps,
  IndexLawLabProps,
  IneqOrLabProps,
  Lesson,
  PyramidLabProps,
  OddSquareLabProps,
  PolyIdLabProps,
  SimEqLabProps,
  ParabolaSignLabProps,
  SumDiffLabProps,
  PythagorasLabProps,
  PythagorasProps,
  SquareTriLabProps,
  TenBundleLabProps,
  UnitCircleProps,
  WavesProps,
  ZeroPairLabProps,
} from '../data/types'
import { useI18n } from '../i18n/I18nProvider'
import { AngleSumLab } from './AngleSumLab'
import { ArrayTurnLab } from './ArrayTurnLab'
import { BarEqLab } from './BarEqLab'
import { BinomLab } from './BinomLab'
import { CircleAreaLab } from './CircleAreaLab'
import { CompleteSqLab } from './CompleteSqLab'
import { CongruenceLab } from './CongruenceLab'
import { CubicFacLab } from './CubicFacLab'
import { SimEqLab } from './SimEqLab'
import { ParabolaSignLab } from './ParabolaSignLab'
import { IneqOrLab } from './IneqOrLab'
import { PyramidLab } from './PyramidLab'
import { CargoLab } from './CargoLab'
import { DiffSquaresLab } from './DiffSquaresLab'
import { DistributeLab } from './DistributeLab'
import { FibonacciLab } from './FibonacciLab'
import { FractionBarLab } from './FractionBarLab'
import { HalfHalfLab } from './HalfHalfLab'
import { HowManyLab } from './HowManyLab'
import { IndexLawLab } from './IndexLawLab'
import { LangSwitch } from './LangSwitch'
import { MathBlock } from './MathBlock'
import { OddSquareLab } from './OddSquareLab'
import { PolyIdLab } from './PolyIdLab'
import { PythagorasFigure } from './PythagorasFigure'
import { PythagorasLab } from './PythagorasLab'
import { SquareTriLab } from './SquareTriLab'
import { SumDiffLab } from './SumDiffLab'
import { TenBundleLab } from './TenBundleLab'
import { UnitCircle } from './UnitCircle'
import { WaveGraph } from './WaveGraph'
import { ZeroPairLab } from './ZeroPairLab'

const LAB_VIZ = new Set([
  'pythagorasLab',
  'angleSumLab',
  'circleAreaLab',
  'squareTriLab',
  'fibonacciLab',
  'zeroPairLab',
  'distributeLab',
  'fractionBarLab',
  'tenBundleLab',
  'arrayTurnLab',
  'oddSquareLab',
  'halfHalfLab',
  'howManyLab',
  'binomLab',
  'completeSqLab',
  'diffSquaresLab',
  'barEqLab',
  'congruenceLab',
  'indexLawLab',
  'sumDiffLab',
  'polyIdLab',
  'cubicFacLab',
  'simEqLab',
  'parabolaSignLab',
  'ineqOrLab',
  'pyramidLab',
  'cargoLab',
])

type Props = {
  lesson: Lesson
}

export function LessonPlayer({ lesson }: Props) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const [gateOk, setGateOk] = useState(false)
  const touchY = useRef<number | null>(null)
  const wheelLock = useRef(false)
  const done = i >= lesson.beats.length
  const beat = done ? null : lesson.beats[i]
  const nextId = nextLessonId(lesson.id)
  const progress = done ? 1 : (i + 1) / lesson.beats.length
  const gated = beat?.gate === 'interact' && !gateOk

  const go = useCallback(
    (delta: number) => {
      setI((cur) => {
        const b = lesson.beats[cur]
        if (delta > 0 && b?.gate === 'interact' && !gateOk) return cur
        const next = cur + delta
        if (next < 0) return 0
        if (next > lesson.beats.length) return lesson.beats.length
        return next
      })
    },
    [lesson.beats, gateOk],
  )

  useEffect(() => {
    setI(0)
    setGateOk(false)
  }, [lesson.id])

  useEffect(() => {
    setGateOk(false)
  }, [i])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const onWheel = (e: React.WheelEvent) => {
    if (wheelLock.current) return
    if (Math.abs(e.deltaY) < 8) return
    wheelLock.current = true
    go(e.deltaY > 0 ? 1 : -1)
    window.setTimeout(() => {
      wheelLock.current = false
    }, 380)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current == null) return
    const dy = touchY.current - e.changedTouches[0].clientY
    touchY.current = null
    if (Math.abs(dy) < 36) return
    go(dy > 0 ? 1 : -1)
  }

  const vizType = beat?.viz?.type ?? 'formula'
  const showFloatMath =
    !!beat?.math &&
    vizType !== 'formula' &&
    vizType !== 'none' &&
    vizType !== 'pythagoras' &&
    !LAB_VIZ.has(vizType)
  const isLabScene = !!lesson.lab && LAB_VIZ.has(vizType)
  const pythProps = (beat?.viz?.props ?? { mode: 'ask' }) as PythagorasLabProps
  const angleProps = (beat?.viz?.props ?? { mode: 'ask' }) as AngleSumLabProps
  const circleProps = (beat?.viz?.props ?? { mode: 'ask' }) as CircleAreaLabProps
  const squareTriProps = (beat?.viz?.props ?? { mode: 'ask' }) as SquareTriLabProps
  const fibProps = (beat?.viz?.props ?? { mode: 'ask' }) as FibonacciLabProps
  const zeroProps = (beat?.viz?.props ?? { mode: 'ask' }) as ZeroPairLabProps
  const distProps = (beat?.viz?.props ?? { mode: 'ask' }) as DistributeLabProps
  const fracProps = (beat?.viz?.props ?? { mode: 'ask' }) as FractionBarLabProps
  const tenProps = (beat?.viz?.props ?? { mode: 'ask' }) as TenBundleLabProps
  const arrayProps = (beat?.viz?.props ?? { mode: 'ask' }) as ArrayTurnLabProps
  const oddProps = (beat?.viz?.props ?? { mode: 'ask' }) as OddSquareLabProps
  const hhProps = (beat?.viz?.props ?? { mode: 'ask' }) as HalfHalfLabProps
  const howProps = (beat?.viz?.props ?? { mode: 'ask' }) as HowManyLabProps
  const binomProps = (beat?.viz?.props ?? { mode: 'ask' }) as BinomLabProps
  const csProps = (beat?.viz?.props ?? { mode: 'ask' }) as CompleteSqLabProps
  const diffProps = (beat?.viz?.props ?? { mode: 'ask' }) as DiffSquaresLabProps
  const barEqProps = (beat?.viz?.props ?? { mode: 'ask' }) as BarEqLabProps
  const congProps = (beat?.viz?.props ?? { mode: 'ask' }) as CongruenceLabProps
  const idxProps = (beat?.viz?.props ?? { mode: 'ask' }) as IndexLawLabProps
  const sdProps = (beat?.viz?.props ?? { mode: 'ask' }) as SumDiffLabProps
  const piProps = (beat?.viz?.props ?? { mode: 'ask' }) as PolyIdLabProps
  const cfProps = (beat?.viz?.props ?? { mode: 'ask' }) as CubicFacLabProps
  const seProps = (beat?.viz?.props ?? { mode: 'ask' }) as SimEqLabProps
  const psProps = (beat?.viz?.props ?? { mode: 'ask' }) as ParabolaSignLabProps
  const ioProps = (beat?.viz?.props ?? { mode: 'ask' }) as IneqOrLabProps
  const pdProps = (beat?.viz?.props ?? { mode: 'ask' }) as PyramidLabProps
  const cgProps = (beat?.viz?.props ?? { mode: 'ask' }) as CargoLabProps

  const onLabInteract = () => {
    setGateOk(true)
    window.setTimeout(() => {
      setI((cur) => Math.min(cur + 1, lesson.beats.length))
    }, 700)
  }

  const gotItSub =
    {
      'a-angle-sum': t.gotItSubAngle,
      'circle-area': t.gotItSubCircle,
      'square-tri': t.gotItSubSquareTri,
      fibonacci: t.gotItSubFib,
      'zero-pair': t.gotItSubZero,
      distribute: t.gotItSubDist,
      'fraction-bar': t.gotItSubFrac,
      'ten-bundle': t.gotItSubTen,
      'array-turn': t.gotItSubArray,
      'odd-square': t.gotItSubOdd,
      'half-half': t.gotItSubHH,
      'how-many': t.gotItSubHow,
      'binom-area': t.gotItSubBinom,
      'complete-sq': t.gotItSubCS,
      'diff-squares': t.gotItSubDiff,
      'bar-eq': t.gotItSubBarEq,
      'dse-q8': t.gotItSubCong,
      'dse-2012-q1': t.gotItSubIndex,
      'dse-2012-q2': t.gotItSubD2,
      'dse-2012-q3': t.gotItSubD3,
      'dse-2012-q4': t.gotItSubD4,
      'dse-2012-q5': t.gotItSubD5,
      'dse-2012-q6': t.gotItSubD6,
      'dse-2012-q7': t.gotItSubD7,
      'dse-2012-p1-q18': t.gotItSubD18,
      'dse-2012-p1-q19': t.gotItSubD19,
    }[lesson.id] ?? t.gotItSub

  const gateChip =
    ({ 'dse-q8': t.gateChipCong, 'dse-2012-q1': t.gateChipIndex, 'dse-2012-q2': t.gateChipD2, 'dse-2012-q3': t.gateChipD3, 'dse-2012-q4': t.gateChipD4, 'dse-2012-q5': t.gateChipD5, 'dse-2012-q6': t.gateChipD6, 'dse-2012-q7': t.gateChipD7, 'dse-2012-p1-q18': t.gateChipD18, 'dse-2012-p1-q19': t.gateChipD19 }[lesson.id] as
      | string
      | undefined) ?? t.gateChip

  return (
    <div
      className="player"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="chrome-top">
        <Link to="/" className="back">
          ←
        </Link>
        <div className="chrome-title">{lesson.title}</div>
        <div className="chrome-right">
          <LangSwitch />
          <div className="step-count">
            {done ? '✓' : `${i + 1}/${lesson.beats.length}`}
          </div>
        </div>
      </div>

      <div className="rail">
        <div className="rail-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <main
        className={`stage ${gated ? 'gated' : ''}`}
        onClick={() => {
          if (done || gated) return
          go(1)
        }}
      >
        {done ? (
          <div className="complete">
            <div className="complete-glyph">◎</div>
            <h2>{t.gotIt}</h2>
            <p className="complete-sub">{gotItSub}</p>
            <div className="complete-actions">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setI(0)
                  setGateOk(false)
                }}
              >
                {t.replay}
              </button>
              {nextId ? (
                <Link
                  className="primary"
                  to={`/lesson/${nextId}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.next}
                </Link>
              ) : (
                <Link
                  className="primary"
                  to="/"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t.catalog}
                </Link>
              )}
            </div>
          </div>
        ) : (
          beat && (
            <div className="beat-stage">
              {beat.prompt && <p className="prompt">{beat.prompt}</p>}

              <div
                className="viz-plane"
                key={isLabScene ? lesson.id : beat.id}
              >
                {vizType === 'unitCircle' && (
                  <UnitCircle
                    {...((beat.viz?.props ?? {}) as UnitCircleProps)}
                  />
                )}
                {vizType === 'pythagoras' && (
                  <PythagorasFigure
                    {...((beat.viz?.props ?? {}) as PythagorasProps)}
                  />
                )}
                {vizType === 'pythagorasLab' && (
                  <PythagorasLab
                    mode={pythProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'angleSumLab' && (
                  <AngleSumLab
                    mode={angleProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'circleAreaLab' && (
                  <CircleAreaLab
                    mode={circleProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'squareTriLab' && (
                  <SquareTriLab
                    mode={squareTriProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'fibonacciLab' && (
                  <FibonacciLab
                    mode={fibProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'zeroPairLab' && (
                  <ZeroPairLab
                    mode={zeroProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'distributeLab' && (
                  <DistributeLab
                    mode={distProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'fractionBarLab' && (
                  <FractionBarLab
                    mode={fracProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'tenBundleLab' && (
                  <TenBundleLab
                    mode={tenProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'arrayTurnLab' && (
                  <ArrayTurnLab
                    mode={arrayProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'oddSquareLab' && (
                  <OddSquareLab
                    mode={oddProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'halfHalfLab' && (
                  <HalfHalfLab
                    mode={hhProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'howManyLab' && (
                  <HowManyLab
                    mode={howProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'binomLab' && (
                  <BinomLab
                    mode={binomProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'completeSqLab' && (
                  <CompleteSqLab
                    mode={csProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'diffSquaresLab' && (
                  <DiffSquaresLab
                    mode={diffProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'barEqLab' && (
                  <BarEqLab
                    mode={barEqProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'congruenceLab' && (
                  <CongruenceLab
                    mode={congProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'indexLawLab' && (
                  <IndexLawLab
                    mode={idxProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'sumDiffLab' && (
                  <SumDiffLab
                    mode={sdProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'polyIdLab' && (
                  <PolyIdLab
                    mode={piProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'cubicFacLab' && (
                  <CubicFacLab
                    mode={cfProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'simEqLab' && (
                  <SimEqLab
                    mode={seProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'parabolaSignLab' && (
                  <ParabolaSignLab
                    mode={psProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'ineqOrLab' && (
                  <IneqOrLab
                    mode={ioProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'pyramidLab' && (
                  <PyramidLab
                    mode={pdProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'cargoLab' && (
                  <CargoLab
                    mode={cgProps.mode}
                    onInteractComplete={onLabInteract}
                  />
                )}
                {vizType === 'waves' && (
                  <WaveGraph {...((beat.viz?.props ?? {}) as WavesProps)} />
                )}
                {(vizType === 'formula' || vizType === 'none') && beat.math && (
                  <MathBlock
                    tex={beat.math}
                    highlights={beat.highlights}
                    huge
                  />
                )}
                {showFloatMath && beat.math && (
                  <div className="math-float">
                    <MathBlock tex={beat.math} highlights={beat.highlights} />
                  </div>
                )}
              </div>

              <div className={`caption-chip ${gated ? 'pulse' : ''}`}>
                {gated ? gateChip : beat.caption}
              </div>
            </div>
          )
        )}
      </main>

      <footer className="hint">
        {gated ? t.challengeHint : t.swipeHint}
      </footer>
    </div>
  )
}
