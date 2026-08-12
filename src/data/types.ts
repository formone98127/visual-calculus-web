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
      | 'waves'
      | 'formula'
      | 'none'
    props?:
      | UnitCircleProps
      | PythagorasProps
      | PythagorasLabProps
      | AngleSumLabProps
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
