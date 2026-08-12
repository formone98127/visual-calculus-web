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

/** Modes for the interactive Pythagorean lab (Flagship B). */
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

export type WavesProps = {
  mode?: 'sin' | 'cos' | 'both' | 'sinDeriv' | 'cosDeriv' | 'all'
}

export type Beat = {
  id: string
  caption: string
  /** Longer question / instruction above the chip */
  prompt?: string
  math?: string
  highlights?: Highlight[]
  /** Block forward navigation until lab reports interact complete */
  gate?: 'interact'
  viz?: {
    type: 'unitCircle' | 'pythagoras' | 'pythagorasLab' | 'waves' | 'formula' | 'none'
    props?:
      | UnitCircleProps
      | PythagorasProps
      | PythagorasLabProps
      | WavesProps
  }
}

export type Lesson = {
  id: string
  title: string
  subtitle: string
  /** Continuous scene — don't remount viz each beat */
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
