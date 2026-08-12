import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { Highlight } from '../data/types'

type Props = {
  tex: string
  highlights?: Highlight[]
  huge?: boolean
}

export function MathBlock({ tex, highlights = [], huge = false }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: true,
      })
    } catch {
      return tex
    }
  }, [tex])

  const classes = ['math-block', huge ? 'huge' : '']
  if (highlights.includes('sin')) classes.push('hl-sin')
  if (highlights.includes('cos')) classes.push('hl-cos')
  if (highlights.includes('op')) classes.push('hl-op')

  return (
    <div
      className={classes.filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
