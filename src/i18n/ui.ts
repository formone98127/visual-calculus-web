import type { Locale } from './locale'

type UiDict = {
  brand: string
  headline: string
  lede: string
  heroCta: string
  heroCtaAngle: string
  heroCtaCircle: string
  topicTry: string
  topicTryBlurb: string
  topicPractice: string
  topicPracticeBlurb: string
  topicWonders: string
  topicWondersBlurb: string
  topicVisible: string
  topicVisibleBlurb: string
  topicAlgebra: string
  topicAlgebraBlurb: string
  topicExam: string
  topicExamBlurb: string
  gotIt: string
  gotItSub: string
  gotItSubAngle: string
  gotItSubCircle: string
  gotItSubSquareTri: string
  gotItSubFib: string
  gotItSubZero: string
  gotItSubDist: string
  gotItSubFrac: string
  gotItSubTen: string
  gotItSubArray: string
  gotItSubOdd: string
  gotItSubHH: string
  gotItSubHow: string
  gotItSubBinom: string
  gotItSubCS: string
  gotItSubDiff: string
  gotItSubBarEq: string
  gotItSubCong: string
  gotItSubIndex: string
  replay: string
  next: string
  catalog: string
  swipeHint: string
  challengeHint: string
  gateChip: string
  gateChipCong: string
  gateChipIndex: string
  autoFit: string
  labHookAsk: string
  angleAutoFit: string
  angleHookAsk: string
  angleStraightLabel: string
  angleLineHint: string
  circleAutoFit: string
  circleHookAsk: string
  circleBaseHint: string
  squareTriAutoFit: string
  squareTriHint: string
  fibAutoFit: string
  fibHint: string
  zeroAutoFit: string
  zeroHint: string
  zeroLeft: string
  distAutoFit: string
  distHint: string
  fracAutoFit: string
  fracHint: string
  tenAutoFit: string
  tenHint: string
  arrayAutoFit: string
  arrayHint: string
  oddAutoFit: string
  oddHint: string
  hhAutoFit: string
  hhHint: string
  howAutoFit: string
  howHint: string
  binomAutoFit: string
  binomHint: string
  csAutoFit: string
  csHint: string
  diffAutoFit: string
  diffHint: string
  barEqAutoFit: string
  barEqHint: string
  congHint: string
  indexHint: string
  indexWhyA: string
  indexWhyB: string
  indexWhyD: string
  indexGroups: string
  indexTrapB: string
  indexTrapD: string
  indexTrapA: string
  missing: string
  backHome: string
  waveSinDeriv: string
  waveCosDeriv: string
}

export const ui: Record<Locale, UiDict> = {
  en: {
    brand: 'Visual Math',
    headline: 'Math you can see.',
    lede: 'Discovery labs — tiles, corners, rings, numbers, and algebra you can see.',
    heroCta: 'Start Pythagorean lab →',
    heroCtaAngle: 'Angle sum lab →',
    heroCtaCircle: 'Circle area lab →',
    topicTry: 'Try this',
    topicTryBlurb:
      'Hands-on labs — rearrange tiles, tear corners, unroll rings.',
    topicPractice: 'Practice',
    topicPracticeBlurb: 'More lessons to swipe through.',
    topicWonders: 'Number wonders',
    topicWondersBlurb:
      'Shapes that fill a square. Squares that grow by adding. Look first — formula after.',
    topicVisible: 'See the numbers',
    topicVisibleBlurb:
      'Plus and minus cancel. Cut a rectangle. Slide fractions on a bar. Bundle tens. Turn arrays.',
    topicAlgebra: 'See the letters',
    topicAlgebraBlurb:
      'Tiles that multiply. A missing corner that completes a square. A bite that becomes a rectangle.',
    topicExam: 'Exam proof, beat by beat',
    topicExamBlurb:
      'A real DSE question — parallel lines, congruent triangles, one hidden angle.',
    gotIt: 'Got it',
    gotItSub: 'The two small squares make the big one.',
    gotItSubAngle: 'The three corners make a straight line — 180°.',
    gotItSubCircle: 'The unrolled rings make a triangle — that is πr².',
    gotItSubSquareTri: 'Two matching triangles fill a square.',
    gotItSubFib: 'Each new square is the two before it, added.',
    gotItSubZero: 'Each plus and minus pair makes zero. Leftovers are the answer.',
    gotItSubDist: 'Cut a rectangle and the area stays the same.',
    gotItSubFrac: 'A half plus a quarter fills three quarters of the bar.',
    gotItSubTen: 'Ten ones bundle into one ten.',
    gotItSubArray: 'Turning the grid does not change the count — a×b = b×a.',
    gotItSubOdd: 'Odd numbers wrap around and build a square.',
    gotItSubHH: 'Half of a half is a quarter of the square.',
    gotItSubHow: 'Two quarters fill a half — that is how many fit.',
    gotItSubBinom: 'The (x+1) by (x+2) rectangle is x² + 3x + 2.',
    gotItSubCS: 'The missing 1 completes the square — (x+1)².',
    gotItSubDiff: 'A square minus a square slides into (a−b) by (a+b).',
    gotItSubBarEq: 'Peel the 2, split 9 into three — each x is 3.',
    gotItSubCong:
      'Two Z-shapes prove the triangles congruent; AC = AD halves the vertex angle — 63°.',
    gotItSubIndex: 'Cube the bracket (2³, 4×3), then divide like bases (8÷2, 12−5) — 4x⁷.',
    replay: 'Replay',
    next: 'Next →',
    catalog: 'Catalog',
    swipeHint: 'swipe / ↓',
    challengeHint: 'complete the challenge',
    gateChip: 'Tap Auto-fit to continue',
    gateChipCong: 'Tap two equal angles to continue',
    gateChipIndex: 'Tap the answer that follows both laws',
    autoFit: 'Move tiles into the big square →',
    labHookAsk: 'Each square uses one side of the triangle as its side.',
    angleAutoFit: 'Lay corners on the line →',
    angleHookAsk: 'Three corners. One straight line?',
    angleStraightLabel: 'straight line',
    angleLineHint: 'straight line waiting…',
    circleAutoFit: 'Unroll the rings →',
    circleHookAsk: 'How much paint covers a circle?',
    circleBaseHint: 'rings waiting to unroll…',
    squareTriAutoFit: 'Flip the triangle in →',
    squareTriHint: 'empty half waiting…',
    fibAutoFit: 'Grow the next square →',
    fibHint: '3 + 5 waiting…',
    zeroAutoFit: 'Make the zero pairs →',
    zeroHint: 'pairs waiting to cancel…',
    zeroLeft: '+1 left',
    distAutoFit: 'Slide the pieces apart →',
    distHint: 'cut waiting to open…',
    fracAutoFit: 'Slide the quarter on →',
    fracHint: 'quarter waiting to park…',
    tenAutoFit: 'Bundle into a ten →',
    tenHint: 'ones waiting to stack…',
    arrayAutoFit: 'Turn the grid →',
    arrayHint: 'same tiles, new sides…',
    oddAutoFit: 'Wrap the next odd layer →',
    oddHint: '7 waiting to wrap…',
    hhAutoFit: 'Lay the second half on →',
    hhHint: 'watch the overlap…',
    howAutoFit: 'Fit the quarters in →',
    howHint: 'how many fill the half…',
    binomAutoFit: 'Fill the rectangle →',
    binomHint: 'tiles waiting to sit…',
    csAutoFit: 'Drop in the missing 1 →',
    csHint: 'corner waiting…',
    diffAutoFit: 'Slide the flap down →',
    diffHint: 'flap waiting to swing…',
    barEqAutoFit: 'Peel the 2 and split →',
    barEqHint: 'extras waiting to come off…',
    congHint: 'two equal angles waiting…',
    indexHint: 'tap an option…',
    indexWhyA: 'no single law gives 3x² — two slips mixed',
    indexWhyB: 'cube the 2: 2³ = 8, not 2×3 = 6',
    indexWhyD: 'multiply indices: 4×3 = 12, not 4³ = 64',
    indexGroups: 'four groups of 2',
    indexTrapB: '2³ became 2×3',
    indexTrapD: '4×3 became 4³',
    indexTrapA: 'no law gives it',
    missing: 'Lesson not found.',
    backHome: 'Back to catalog',
    waveSinDeriv: 'slope of red ≈ blue',
    waveCosDeriv: 'slope of blue ≈ green',
  },
  'zh-Hant': {
    brand: '看得見的數學',
    headline: '用眼睛學會數學。',
    lede: '發現實驗室——拼磁磚、撕角、攤圓環，看得見的數字，還有看得見的代數。',
    heroCta: '開始畢氏定理實驗室 →',
    heroCtaAngle: '內角和實驗室 →',
    heroCtaCircle: '圓面積實驗室 →',
    topicTry: '先試這個',
    topicTryBlurb: '動手實驗室——拼磁磚、撕三角角、把圓環攤開。',
    topicPractice: '練習',
    topicPracticeBlurb: '更多可滑動學習的課程。',
    topicWonders: '數字的驚奇',
    topicWondersBlurb:
      '三角形能填滿正方形。正方形會越加越大。先看圖，再看公式。',
    topicVisible: '看得見的數字',
    topicVisibleBlurb: '正負會對消。切開長方形。把分數滑上長條。十個一捆。把格子轉過來。',
    topicAlgebra: '看得見的字母',
    topicAlgebraBlurb: '磁磚會相乘。缺一角，補成正方形。咬一口，變成矩形。',
    topicExam: 'DSE 證明題',
    topicExamBlurb: '真．DSE 題目——平行線、全等三角形、一個藏在裡面的角。',
    gotIt: '懂了',
    gotItSub: '兩個小正方形合起來，正好是大正方形。',
    gotItSubAngle: '三個角拼起來，正好是一條直線——180°。',
    gotItSubCircle: '圓環攤開變成三角形——那就是 πr²。',
    gotItSubSquareTri: '兩個一樣的三角形，正好填滿一個正方形。',
    gotItSubFib: '每一個新正方形，都是前面兩個加起來。',
    gotItSubZero: '每一對正負都會變成 0。剩下的，就是答案。',
    gotItSubDist: '長方形切開，面積一點都沒少。',
    gotItSubFrac: '一半加四分之一，正好是長條的四分之三。',
    gotItSubTen: '十個一，捆成一個十。',
    gotItSubArray: '格子轉過來，數量不變——a×b = b×a。',
    gotItSubOdd: '奇數一層層包上去，會變成正方形。',
    gotItSubHH: '一半的一半，就是正方形的四分之一。',
    gotItSubHow: '兩個四分之一正好填滿一半——能放幾個就是答案。',
    gotItSubBinom: '(x+1) 乘 (x+2) 的長方形，就是 x² + 3x + 2。',
    gotItSubCS: '缺的那一個 1，正好補成正方形——(x+1)²。',
    gotItSubDiff: '大正方形減去小正方形，滑成 (a−b) 乘 (a+b)。',
    gotItSubBarEq: '拿掉 2，把 9 分成三份——每個 x 都是 3。',
    gotItSubCong: '兩個 Z 形證出全等；AC = AD 把頂角對半分——63°。',
    gotItSubIndex: '先展開冪（2³、4×3），再同底相除（8÷2、12−5）——4x⁷。',
    replay: '再玩一次',
    next: '下一課 →',
    catalog: '目錄',
    swipeHint: '上滑 / ↓',
    challengeHint: '完成挑戰後繼續',
    gateChip: '點「自動拼入」後繼續',
    gateChipCong: '點兩個相等的角以繼續',
    gateChipIndex: '點出跟足兩條指數定律的答案',
    autoFit: '把磁磚移入大正方形 →',
    labHookAsk: '每個正方形都以三角形的一邊作為它的邊。',
    angleAutoFit: '把三個角排到直線上 →',
    angleHookAsk: '三個角，能排成一條直線嗎？',
    angleStraightLabel: '一條直線',
    angleLineHint: '直線等你排上去…',
    circleAutoFit: '把圓環攤開 →',
    circleHookAsk: '塗滿一個圓，要多少漆？',
    circleBaseHint: '圓環等你攤開…',
    squareTriAutoFit: '把三角形翻進去 →',
    squareTriHint: '空的那一半等你…',
    fibAutoFit: '長出下一個正方形 →',
    fibHint: '3 + 5 等你…',
    zeroAutoFit: '配成零對 →',
    zeroHint: '正負等你配成對…',
    zeroLeft: '剩下 +1',
    distAutoFit: '把兩塊拉開 →',
    distHint: '切口等你拉開…',
    fracAutoFit: '把四分之一滑上去 →',
    fracHint: '四分之一等你放上去…',
    tenAutoFit: '捆成一個十 →',
    tenHint: '十個一等你疊上去…',
    arrayAutoFit: '把格子轉過來 →',
    arrayHint: '同樣的格子，換個方向…',
    oddAutoFit: '包上下一層奇數 →',
    oddHint: '7 等你包上去…',
    hhAutoFit: '把另一半蓋上去 →',
    hhHint: '看重疊的地方…',
    howAutoFit: '把四分之一放進去 →',
    howHint: '一半裡能放幾個…',
    binomAutoFit: '把磁磚填進去 →',
    binomHint: '磁磚等你放進去…',
    csAutoFit: '把缺的 1 放進去 →',
    csHint: '角落等你…',
    diffAutoFit: '把那一塊滑下去 →',
    diffHint: '那一塊等你轉下去…',
    barEqAutoFit: '拿掉 2，再切開 →',
    barEqHint: '多的 2 等你拿掉…',
    congHint: '兩個相等的角等你點…',
    indexHint: '點一個選項…',
    indexWhyA: '沒有一條定律能得出 3x²——兩個陷阱夾埋',
    indexWhyB: '2 要立方：2³ = 8，不是 2×3 = 6',
    indexWhyD: '指數相乘：4×3 = 12，不是 4³ = 64',
    indexGroups: '每組 2 個 · 共 4 組',
    indexTrapB: '2³ 當成了 2×3',
    indexTrapD: '4×3 當成了 4³',
    indexTrapA: '沒有定律可得出',
    missing: '找不到這一課。',
    backHome: '回到目錄',
    waveSinDeriv: '紅線斜率 ≈ 藍線',
    waveCosDeriv: '藍線斜率 ≈ 綠線',
  },
}
