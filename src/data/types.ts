export type Highlight = 'sin' | 'cos' | 'op'

export type UnitCircleProps = {
  showCircle?: boolean
  showAxes?: boolean
  pointCount?: number
  showLabels?: boolean
  emphasize?: 'sin' | 'cos' | 'both' | null
}

export type PythagorasProps = {
  showTriangle?: boolean
  showSquareA?: boolean
  showSquareB?: boolean
  showSquareC?: boolean
  showLabels?: boolean
  showAreas?: boolean
  showTiles?: boolean
  highlightEquation?: boolean
  a?: number
  b?: number
  c?: number
}

export type PythagorasLabMode =
  | 'ask'
  | 'triangle'
  | 'squareA'
  | 'squareB'
  | 'squareC'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type PythagorasLabProps = {
  mode: PythagorasLabMode
  onInteractComplete?: () => void
}

export type AngleSumLabMode =
  | 'ask'
  | 'acute'
  | 'right'
  | 'obtuse'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type AngleSumLabProps = {
  mode: AngleSumLabMode
  onInteractComplete?: () => void
}

export type CircleAreaLabMode =
  | 'ask'
  | 'rings'
  | 'circumference'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type CircleAreaLabProps = {
  mode: CircleAreaLabMode
  onInteractComplete?: () => void
}

export type SquareTriLabMode =
  | 'ask'
  | 'one'
  | 'two'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type SquareTriLabProps = {
  mode: SquareTriLabMode
  onInteractComplete?: () => void
}

export type FibonacciLabMode =
  | 'ask'
  | 'grow2'
  | 'grow5'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type FibonacciLabProps = {
  mode: FibonacciLabMode
  onInteractComplete?: () => void
}

export type ZeroPairLabMode =
  | 'ask'
  | 'positives'
  | 'mixed'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type ZeroPairLabProps = {
  mode: ZeroPairLabMode
  onInteractComplete?: () => void
}

export type DistributeLabMode =
  | 'ask'
  | 'grid'
  | 'cut'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type DistributeLabProps = {
  mode: DistributeLabMode
  onInteractComplete?: () => void
}

export type FractionBarLabMode =
  | 'ask'
  | 'half'
  | 'quarter'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type FractionBarLabProps = {
  mode: FractionBarLabMode
  onInteractComplete?: () => void
}

export type TenBundleLabMode =
  | 'ask'
  | 'ones'
  | 'ten'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type TenBundleLabProps = {
  mode: TenBundleLabMode
  onInteractComplete?: () => void
}

export type ArrayTurnLabMode =
  | 'ask'
  | 'grid'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type ArrayTurnLabProps = {
  mode: ArrayTurnLabMode
  onInteractComplete?: () => void
}

export type OddSquareLabMode =
  | 'ask'
  | 'small'
  | 'next'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type OddSquareLabProps = {
  mode: OddSquareLabMode
  onInteractComplete?: () => void
}

export type HalfHalfLabMode =
  | 'ask'
  | 'vert'
  | 'horiz'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type HalfHalfLabProps = {
  mode: HalfHalfLabMode
  onInteractComplete?: () => void
}

export type HowManyLabMode =
  | 'ask'
  | 'half'
  | 'pieces'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type HowManyLabProps = {
  mode: HowManyLabMode
  onInteractComplete?: () => void
}

export type BinomLabMode =
  | 'ask'
  | 'x2'
  | 'strips'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type BinomLabProps = {
  mode: BinomLabMode
  onInteractComplete?: () => void
}

export type CompleteSqLabMode =
  | 'ask'
  | 'arms'
  | 'gap'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type CompleteSqLabProps = {
  mode: CompleteSqLabMode
  onInteractComplete?: () => void
}

export type DiffSquaresLabMode =
  | 'ask'
  | 'hole'
  | 'cut'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type DiffSquaresLabProps = {
  mode: DiffSquaresLabMode
  onInteractComplete?: () => void
}

export type BarEqLabMode =
  | 'ask'
  | 'parts'
  | 'challenge'
  | 'fitted'
  | 'generalize'

export type BarEqLabProps = {
  mode: BarEqLabMode
  onInteractComplete?: () => void
}

export type CongruenceLabMode =
  | 'ask'
  | 'parallels'
  | 'challenge'
  | 'z1'
  | 'z2'
  | 'proof'
  | 'numbers'
  | 'iso'
  | 'final'
  | 'check'

export type CongruenceLabProps = {
  mode: CongruenceLabMode
  onInteractComplete?: () => void
}

export type IndexLawLabMode =
  | 'ask'
  | 'laws'
  | 'copies'
  | 'coeffs'
  | 'indices'
  | 'challenge'
  | 'divide'
  | 'subtract'
  | 'final'
  | 'check'
  | 'guide'

export type IndexLawLabProps = {
  mode: IndexLawLabMode
  onInteractComplete?: () => void
}

export type SumDiffLabMode =
  | 'ask'
  | 'laws'
  | 'name'
  | 'sum'
  | 'diff'
  | 'gate'
  | 'multiply'
  | 'shortcut'
  | 'expand'
  | 'check'
  | 'guide'

export type SumDiffLabProps = {
  mode: SumDiffLabMode
  onInteractComplete?: () => void
}

export type PolyIdLabMode =
  | 'ask'
  | 'laws'
  | 'name'
  | 'xcoef'
  | 'const'
  | 'gate'
  | 'answer'
  | 'shortcut'
  | 'verify'
  | 'check'
  | 'guide'

export type PolyIdLabProps = {
  mode: PolyIdLabMode
  onInteractComplete?: () => void
}

export type CubicFacLabMode =
  | 'ask'
  | 'laws'
  | 'name'
  | 'sub'
  | 'calc'
  | 'gate'
  | 'answer'
  | 'synth'
  | 'verify'
  | 'check'
  | 'guide'

export type CubicFacLabProps = {
  mode: CubicFacLabMode
  onInteractComplete?: () => void
}

export type SimEqLabMode =
  | 'ask'
  | 'why'
  | 'split1'
  | 'split2'
  | 'elim'
  | 'elim2'
  | 'gate'
  | 'answer'
  | 'verify1'
  | 'verify2'
  | 'graph'
  | 'trapA'
  | 'trapC'
  | 'trapD'
  | 'guide'

export type SimEqLabProps = {
  mode: SimEqLabMode
  onInteractComplete?: () => void
}

export type ParabolaSignLabMode =
  | 'ask'
  | 'why'
  | 'readA'
  | 'readB'
  | 'flip'
  | 'gate'
  | 'answer'
  | 'verify'
  | 'guide'

export type ParabolaSignLabProps = {
  mode: ParabolaSignLabMode
  onInteractComplete?: () => void
}

export type IneqOrLabMode =
  | 'ask'
  | 'why'
  | 'solve1'
  | 'solve2'
  | 'flip'
  | 'union'
  | 'gate'
  | 'answer'
  | 'verify'
  | 'guide'

export type IneqOrLabProps = {
  mode: IneqOrLabMode
  onInteractComplete?: () => void
}

export type PyramidLabMode =
  | 'figure'
  | 'question'
  | 'face'
  | 'pq'
  | 'pb'
  | 'ask'
  | 'what'
  | 'why'
  | 'va'
  | 'tri'
  | 'ap'
  | 'build'
  | 'vo'
  | 'ph'
  | 'hh'
  | 'alpha'
  | 'beta'
  | 'gate'
  | 'compare'
  | 'answer'
  | 'verify'
  | 'guide'

export type PyramidLabProps = {
  mode: PyramidLabMode
  onInteractComplete?: () => void
}

export type WavesProps = {
  mode?: 'sin' | 'cos' | 'both' | 'sinDeriv' | 'cosDeriv' | 'all'
}

export type Beat = {
  id: string
  caption: string
  prompt?: string
  math?: string
  highlights?: Highlight[]
  gate?: 'interact'
  viz?: {
    type:
      | 'unitCircle'
      | 'pythagoras'
      | 'pythagorasLab'
      | 'angleSumLab'
      | 'circleAreaLab'
      | 'squareTriLab'
      | 'fibonacciLab'
      | 'zeroPairLab'
      | 'distributeLab'
      | 'fractionBarLab'
      | 'tenBundleLab'
      | 'arrayTurnLab'
      | 'oddSquareLab'
      | 'halfHalfLab'
      | 'howManyLab'
      | 'binomLab'
      | 'completeSqLab'
      | 'diffSquaresLab'
      | 'barEqLab'
      | 'congruenceLab'
      | 'indexLawLab'
      | 'sumDiffLab'
      | 'polyIdLab'
      | 'cubicFacLab'
      | 'simEqLab'
      | 'parabolaSignLab'
      | 'ineqOrLab'
      | 'pyramidLab'
      | 'waves'
      | 'formula'
      | 'none'
    props?:
      | UnitCircleProps
      | PythagorasProps
      | PythagorasLabProps
      | AngleSumLabProps
      | CircleAreaLabProps
      | SquareTriLabProps
      | FibonacciLabProps
      | ZeroPairLabProps
      | DistributeLabProps
      | FractionBarLabProps
      | TenBundleLabProps
      | ArrayTurnLabProps
      | OddSquareLabProps
      | HalfHalfLabProps
      | HowManyLabProps
      | BinomLabProps
      | CompleteSqLabProps
      | DiffSquaresLabProps
      | BarEqLabProps
      | CongruenceLabProps
      | IndexLawLabProps
      | SumDiffLabProps
      | PolyIdLabProps
      | CubicFacLabProps
      | SimEqLabProps
      | ParabolaSignLabProps
      | IneqOrLabProps
      | PyramidLabProps
      | WavesProps
  }
}

export type Lesson = {
  id: string
  title: string
  subtitle: string
  lab?: boolean
  beats: Beat[]
}

export type Topic = {
  id: string
  title: string
  blurb: string
  source: string
  lessons: Lesson[]
}
