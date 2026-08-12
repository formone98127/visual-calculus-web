export type Highlight = 'sin' | 'cos' | 'op'

export type UnitCircleProps = {
  showCircle?: boolean
  showAxes?: boolean
  pointCount?: number // 0..5 for 0, π/6, π/4, π/3, π/2
  showLabels?: boolean
  emphasize?: 'sin' | 'cos' | 'both' | null
}

export type Beat = {
  id: string
  caption: string
  math?: string
  highlights?: Highlight[]
  viz?: { type: 'unitCircle' | 'none'; props?: UnitCircleProps }
}

export type Lesson = {
  id: string
  title: string
  subtitle: string
  beats: Beat[]
}
