export type Highlight = 'sin' | 'cos' | 'op'

export type UnitCircleProps = {
  showCircle?: boolean
  showAxes?: boolean
  pointCount?: number // 0..5 for 0, π/6, π/4, π/3, π/2
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
  highlightEquation?: boolean
  /** side lengths; default 3-4-5 scaled */
  a?: number
  b?: number
  c?: number
}

export type Beat = {
  id: string
  caption: string
  math?: string
  highlights?: Highlight[]
  viz?: {
    type: 'unitCircle' | 'pythagoras' | 'none'
    props?: UnitCircleProps | PythagorasProps
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
