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

export type WavesProps = {
  mode?: 'sin' | 'cos' | 'both' | 'sinDeriv' | 'cosDeriv' | 'all'
}

export type Beat = {
  id: string
  /** Ultra-short on-screen chip (≤ ~6 words) */
  caption: string
  math?: string
  highlights?: Highlight[]
  viz?: {
    type: 'unitCircle' | 'pythagoras' | 'waves' | 'formula' | 'none'
    props?: UnitCircleProps | PythagorasProps | WavesProps
  }
}

export type Lesson = {
  id: string
  title: string
  subtitle: string
  beats: Beat[]
}

export type Topic = {
  id: string
  title: string
  blurb: string
  source: string
  lessons: Lesson[]
}
