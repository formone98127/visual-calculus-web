import type { Locale } from './locale'

type UiDict = {
  brand: string
  headline: string
  lede: string
  heroCta: string
  topicTry: string
  topicTryBlurb: string
  topicPractice: string
  topicPracticeBlurb: string
  gotIt: string
  gotItSub: string
  replay: string
  next: string
  catalog: string
  swipeHint: string
  challengeHint: string
  gateChip: string
  autoFit: string
  labHookAsk: string
  missing: string
  backHome: string
  waveSinDeriv: string
  waveCosDeriv: string
}

export const ui: Record<Locale, UiDict> = {
  en: {
    brand: 'Visual Math',
    headline: 'Math you can see.',
    lede: 'Start with the tile lab — fit the squares, then swipe the rest.',
    heroCta: 'Start Pythagorean lab →',
    topicTry: 'Try this',
    topicTryBlurb:
      'A hands-on discovery — rearrange tiles to see why a² + b² = c².',
    topicPractice: 'Practice',
    topicPracticeBlurb: 'More lessons to swipe through.',
    gotIt: 'Got it',
    gotItSub: 'The two small squares make the big one.',
    replay: 'Replay',
    next: 'Next →',
    catalog: 'Catalog',
    swipeHint: 'swipe / ↓',
    challengeHint: 'complete the challenge',
    gateChip: 'Tap Auto-fit to continue',
    autoFit: 'Move tiles into the big square →',
    labHookAsk: 'Each square uses one side of the triangle as its side.',
    missing: 'Lesson not found.',
    backHome: 'Back to catalog',
    waveSinDeriv: 'slope of red ≈ blue',
    waveCosDeriv: 'slope of blue ≈ green',
  },
  'zh-Hant': {
    brand: '看得見的數學',
    headline: '用眼睛學會數學。',
    lede: '先從磁磚實驗室開始——把小正方形拼進大正方形，再滑動探索其他概念。',
    heroCta: '開始畢氏定理實驗室 →',
    topicTry: '先試這個',
    topicTryBlurb: '動手發現：把磁磚重新排列，看出為什麼 a² + b² = c²。',
    topicPractice: '練習',
    topicPracticeBlurb: '更多可滑動學習的課程。',
    gotIt: '懂了',
    gotItSub: '兩個小正方形合起來，正好是大正方形。',
    replay: '再玩一次',
    next: '下一課 →',
    catalog: '目錄',
    swipeHint: '上滑 / ↓',
    challengeHint: '完成挑戰後繼續',
    gateChip: '點「自動拼入」後繼續',
    autoFit: '把磁磚移入大正方形 →',
    labHookAsk: '每個正方形都以三角形的一邊作為它的邊。',
    missing: '找不到這一課。',
    backHome: '回到目錄',
    waveSinDeriv: '紅線斜率 ≈ 藍線',
    waveCosDeriv: '藍線斜率 ≈ 綠線',
  },
}
