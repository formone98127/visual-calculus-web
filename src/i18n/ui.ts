import type { Locale } from './locale'

type UiDict = {
  brand: string
  headline: string
  lede: string
  heroCta: string
  heroCtaAngle: string
  topicTry: string
  topicTryBlurb: string
  topicPractice: string
  topicPracticeBlurb: string
  gotIt: string
  gotItSub: string
  gotItSubAngle: string
  replay: string
  next: string
  catalog: string
  swipeHint: string
  challengeHint: string
  gateChip: string
  autoFit: string
  labHookAsk: string
  angleAutoFit: string
  angleHookAsk: string
  angleStraightLabel: string
  angleLineHint: string
  missing: string
  backHome: string
  waveSinDeriv: string
  waveCosDeriv: string
}

export const ui: Record<Locale, UiDict> = {
  en: {
    brand: 'Visual Math',
    headline: 'Math you can see.',
    lede: 'Two discovery labs — fit tiles for Pythagoras, tear corners for 180°.',
    heroCta: 'Start Pythagorean lab →',
    heroCtaAngle: 'Angle sum lab →',
    topicTry: 'Try this',
    topicTryBlurb:
      'Hands-on labs — rearrange tiles, tear corners, watch the punchline appear.',
    topicPractice: 'Practice',
    topicPracticeBlurb: 'More lessons to swipe through.',
    gotIt: 'Got it',
    gotItSub: 'The two small squares make the big one.',
    gotItSubAngle: 'The three corners make a straight line — 180°.',
    replay: 'Replay',
    next: 'Next →',
    catalog: 'Catalog',
    swipeHint: 'swipe / ↓',
    challengeHint: 'complete the challenge',
    gateChip: 'Tap Auto-fit to continue',
    autoFit: 'Move tiles into the big square →',
    labHookAsk: 'Each square uses one side of the triangle as its side.',
    angleAutoFit: 'Lay corners on the line →',
    angleHookAsk: 'Three corners. One straight line?',
    angleStraightLabel: 'straight line',
    angleLineHint: 'straight line waiting…',
    missing: 'Lesson not found.',
    backHome: 'Back to catalog',
    waveSinDeriv: 'slope of red ≈ blue',
    waveCosDeriv: 'slope of blue ≈ green',
  },
  'zh-Hant': {
    brand: '看得見的數學',
    headline: '用眼睛學會數學。',
    lede: '兩個發現實驗室——拼磁磚看畢氏定理，撕角看 180°。',
    heroCta: '開始畢氏定理實驗室 →',
    heroCtaAngle: '內角和實驗室 →',
    topicTry: '先試這個',
    topicTryBlurb: '動手實驗室——拼磁磚、撕三角角，看懂那句結論。',
    topicPractice: '練習',
    topicPracticeBlurb: '更多可滑動學習的課程。',
    gotIt: '懂了',
    gotItSub: '兩個小正方形合起來，正好是大正方形。',
    gotItSubAngle: '三個角拼起來，正好是一條直線——180°。',
    replay: '再玩一次',
    next: '下一課 →',
    catalog: '目錄',
    swipeHint: '上滑 / ↓',
    challengeHint: '完成挑戰後繼續',
    gateChip: '點「自動拼入」後繼續',
    autoFit: '把磁磚移入大正方形 →',
    labHookAsk: '每個正方形都以三角形的一邊作為它的邊。',
    angleAutoFit: '把三個角排到直線上 →',
    angleHookAsk: '三個角，能排成一條直線嗎？',
    angleStraightLabel: '一條直線',
    angleLineHint: '直線等你排上去…',
    missing: '找不到這一課。',
    backHome: '回到目錄',
    waveSinDeriv: '紅線斜率 ≈ 藍線',
    waveCosDeriv: '藍線斜率 ≈ 綠線',
  },
}
