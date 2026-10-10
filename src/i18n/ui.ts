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
  gotItSubD2: string
  gotItSubD3: string
  gotItSubD4: string
  gotItSubD5: string
  gotItSubD6: string
  gotItSubD7: string
  gotItSubD18: string
  replay: string
  next: string
  catalog: string
  swipeHint: string
  challengeHint: string
  gateChip: string
  gateChipCong: string
  gateChipIndex: string
  gateChipD2: string
  gateChipD3: string
  gateChipD4: string
  gateChipD5: string
  gateChipD6: string
  gateChipD7: string
  gateChipD18: string
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
  indexLawTag1: string
  indexLawTag2: string
  indexLawTag3: string
  indexLawTagNum: string
  indexLawTagAll: string
  indexLawsReady: string
  indexGuideTitle: string
  indexGuideThink: string
  indexGuideLaw0: string
  indexGuideLaw1: string
  indexGuideLaw2: string
  indexGuideLaw3: string
  indexGuideLaw4: string
  d2Ready: string
  d2Flip: string
  d2OneLine: string
  d2CheckNote: string
  d2ExpandTag: string
  d2ExpandNote: string
  d2WhyA: string
  d2WhyB: string
  d2WhyC: string
  d2TrapA: string
  d2TrapB: string
  d2TrapC: string
  d2GuideThink: string
  d2GuideLaw0: string
  d2GuideLaw1: string
  d2GuideLaw2: string
  d2GuideLaw3: string
  d2GuideLaw4: string
  d3ForAllX: string
  d3Ready: string
  d3XNote: string
  d3ConstNote: string
  d3SubTag: string
  d3SubX: string
  d3ExpandTag: string
  d3BalNote: string
  d3WhyA: string
  d3WhyB: string
  d3WhyD: string
  d3TrapA: string
  d3TrapB: string
  d3TrapD: string
  d3GuideThink: string
  d3GuideLaw0: string
  d3GuideLaw1: string
  d3GuideLaw2: string
  d3GuideLaw3: string
  d3GuideLaw4: string
  d4FactorEq: string
  d4Law1: string
  d4Law2: string
  d4ToolsNote: string
  d4PowerNote: string
  d4SynTag: string
  d4SynNote: string
  d4RemNote: string
  d4WhyA: string
  d4WhyC: string
  d4WhyD: string
  d4TrapA: string
  d4TrapC: string
  d4TrapD: string
  d4GuideThink: string
  d4GuideLaw0: string
  d4GuideLaw1: string
  d4GuideLaw2: string
  d4GuideLaw3: string
  d4GuideLaw4: string
  d5ChainEq: string
  d5WhyBadge: string
  d5WhyOne: string
  d5WhyTwo: string
  d5WhyTag: string
  d5ElimTag: string
  d5SubTag: string
  d5SubNote: string
  d5VerNote: string
  d5GraphNote: string
  d5WhyA: string
  d5WhyC: string
  d5WhyD: string
  d5TrapA: string
  d5TrapC: string
  d5TrapD: string
  d5GuideThink: string
  d5GuideLaw0: string
  d5GuideLaw1: string
  d5GuideLaw2: string
  d5GuideLaw3: string
  d5GuideLaw4: string
  d6AskBadge: string
  d6WhyBadge: string
  d6WhyOne: string
  d6WhyTwo: string
  d6WhyA: string
  d6WhyB: string
  d6WhyC: string
  d6GuideLaw0: string
  d6GuideLaw1: string
  d6GuideLaw2: string
  d6GuideLaw3: string
  d6GuideLaw4: string
  d7AskBadge: string
  d7WhyBadge: string
  d7WhyOne: string
  d7WhyTwo: string
  d7WhyA: string
  d7WhyB: string
  d7WhyD: string
  d7GuideLaw0: string
  d7GuideLaw1: string
  d7GuideLaw2: string
  d7GuideLaw3: string
  d7GuideLaw4: string
  d18AskBadge: string
  d18AskPulse: string
  d18WhatSub: string
  d18WhyBadge: string
  d18QTextA: string
  d18QTextB: string
  d18FaceSub: string
  d18PqSub: string
  d18PbSub: string
  d18WhyText: string
  d18GatePulse: string
  d18WhyB: string
  d18WhyC: string
  d18WhyD: string
  d18GuideLaw0: string
  d18GuideLaw1: string
  d18GuideLaw2: string
  d18GuideLaw3: string
  d18GuideLaw4: string
  gotItSubD19: string
  gateChipD19: string
  d19QTextA: string
  d19QTextB: string
  d19AskText: string
  d19S1Badge: string
  d19S1Sub: string
  d19S2Sub: string
  d19S3Sub: string
  d19WhyBadge: string
  d19WhyText: string
  d19SumSub: string
  d19SumfSub: string
  d19PartbBadge: string
  d19CmpSub: string
  d19AgreeText: string
  d19BySub: string
  d19GatePulse: string
  d19WhyA: string
  d19WhyB: string
  d19WhyD: string
  d19CrossSub: string
  d19VerifyTop: string
  d19GuideLaw0: string
  d19GuideLaw1: string
  d19GuideLaw2: string
  d19GuideLaw3: string
  d19GuideLaw4: string
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
    gotItSubIndex: 'Name ① (ab)ⁿ, ② (aᵐ)ⁿ, ③ aᵐ÷aⁿ — then 4x⁷ is C.',
    gotItSubD2: 'Formula ① with a+b = 8x and a−b = 2y gives 16xy — option D.',
    gotItSubD3: 'Match x-terms (q = −2), match constants (p = 6) — option C. Or sub x = −2 in one line.',
    gotItSubD4: 'Factor theorem: f(−3) = 0 → −3 − 3k = 0 → k = −1. Option B.',
    gotItSubD5: 'Elimination: 2×① − ② → 5n = −5 → n = −1. Option B.',
    gotItSubD6: 'Two clues: opens down → a < 0; vertex at x = −b > 0 → b < 0. Option D.',
    gotItSubD7: 'Solve both: x < −3 and x < 4. or merges them — the wider x < 4 wins. Option C.',
    gotItSubD18: 'Sine rule finds AP ≈ 23.3; heights scale down VA to PH ≈ 20.96; two perpendiculars give α ≈ 58.6° — and BH > HH′ makes α > β.',
    replay: 'Replay',
    next: 'Next →',
    catalog: 'Catalog',
    swipeHint: 'swipe / ↓',
    challengeHint: 'complete the challenge',
    gateChip: 'Tap Auto-fit to continue',
    gateChipCong: 'Tap two equal angles to continue',
    gateChipIndex: 'Tap the answer that follows Formula ③',
    gateChipD2: 'Tap the answer Formula ① gives',
    gateChipD3: 'Tap the value of p',
    gateChipD4: 'Tap the value of k',
    gateChipD5: 'Tap the value of n',
    gateChipD6: 'Tap the true pair',
    gateChipD7: 'Tap the solution',
    gateChipD18: 'Tap the greater one',
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
    indexLawTag1: 'Formula ①',
    indexLawTag2: 'Formula ②',
    indexLawTag3: 'Formula ③',
    indexLawTagNum: 'Numbers',
    indexLawTagAll: 'All three',
    indexLawsReady: 'ready to use',
    indexGuideTitle: 'Step-by-step solution guide',
    indexGuideThink: 'spot → name → apply',
    indexGuideLaw0: 'Read the question — outer power first',
    indexGuideLaw1: 'Formula ①  (ab)ⁿ = aⁿ · bⁿ',
    indexGuideLaw2: 'Formula ②  (aᵐ)ⁿ = aᵐⁿ   +  2³ = 8',
    indexGuideLaw3: 'Formula ③  aᵐ ÷ aⁿ = aᵐ⁻ⁿ   +  8÷2',
    indexGuideLaw4: 'Answer',
    d2Ready: 'two formulas, ready to use',
    d2Flip: 'y − (−y) = y + y — the minus flips it',
    d2OneLine: 'one line',
    d2CheckNote: 'same answer — use it to check',
    d2ExpandTag: 'check by expanding',
    d2ExpandNote: 'only the cross terms survive',
    d2WhyA: 'the brackets differ (±y) — nothing cancels to 0',
    d2WhyB: 'Formula ① is a product, not a square — and (2y)² = 4y²',
    d2WhyC: 'a − b = 2y, not y — the y doubles',
    d2TrapA: 'nothing cancels',
    d2TrapB: '(2y)² mistyped as 2y²',
    d2TrapC: 'y − (−y) = 2y, not y',
    d2GuideThink: 'formula → name → substitute',
    d2GuideLaw0: 'Read the question — square minus square',
    d2GuideLaw1: 'Formula ①  a² − b² = (a+b)(a−b)',
    d2GuideLaw2: 'a + b = 8x   (+y, −y cancel)',
    d2GuideLaw3: 'a − b = 2y   (y − (−y) = 2y)',
    d2GuideLaw4: 'Answer',
    d3ForAllX: 'holds for every single x',
    d3Ready: 'expand, then match term by term',
    d3XNote: 'the x-terms must match too',
    d3ConstNote: 'constants must match — substitute q',
    d3SubTag: 'shortcut: substitute',
    d3SubX: 'pick x = −2 — it kills (x+2)',
    d3ExpandTag: 'verify by substituting',
    d3BalNote: 'both sides 10 — identity confirmed',
    d3WhyA: '−4 = 2q — the + 10 is missing',
    d3WhyB: '−2 is q — the question asks for p',
    d3WhyD: '10 is the given constant — p = 2q + 10',
    d3TrapA: '2q, no + 10',
    d3TrapB: "that's q, not p",
    d3TrapD: 'q never solved',
    d3GuideThink: 'expand → match x → match const',
    d3GuideLaw0: 'Read the question — identity, find p',
    d3GuideLaw1: 'Formula ①  (x+m)(x+n) = x²+(m+n)x+mn',
    d3GuideLaw2: 'x-terms: q + 2 = 0',
    d3GuideLaw3: 'constants: p = 2q + 10',
    d3GuideLaw4: 'shortcut  sub x = −2: 4+p = 10',
    d4FactorEq: 'divides it ⟺ f(−3) = 0',
    d4Law1: 'factor theorem: f(a) = 0 ⟺ (x−a) is a factor',
    d4Law2: 'x + 3 = x − (−3) → sub x = −3',
    d4ToolsNote: 'sub the root, set it to 0',
    d4PowerNote: 'powers first: (−3)³ = −27, (−3)² = +36',
    d4SynTag: 'shortcut: synthetic division',
    d4SynNote: 'bring down · multiply by −3 · add',
    d4RemNote: 'f(−3) = −3 + 3 = 0 — confirmed',
    d4WhyA: '(−3)² = +36 — the sign slipped',
    d4WhyC: '−3k = 3 → k = −1, not +1',
    d4WhyD: '(−3)³ = −27, not +27',
    d4TrapA: 'sign slip on (−3)²',
    d4TrapC: 'moved −3k wrong',
    d4TrapD: 'sign slip on (−3)³',
    d4GuideThink: 'sub −3 → merge → solve',
    d4GuideLaw0: 'read: (x+3) divides x³+4x²+kx−12, find k',
    d4GuideLaw1: 'Formula ①  f(−3) = 0 (factor theorem)',
    d4GuideLaw2: 'substitute: −27+36−3k−12 = 0',
    d4GuideLaw3: 'merge: −3 − 3k = 0 → k = −1',
    d4GuideLaw4: 'shortcut  synthetic division: remainder 0',
    d5ChainEq: 'a chain of = means two equations',
    d5WhyBadge: '1 equation = a line · 2 = a point',
    d5WhyOne: 'one equation → endless answers',
    d5WhyTwo: 'two equations → one point',
    d5WhyTag: 'simultaneous = find the crossing',
    d5ElimTag: 'elimination',
    d5SubTag: 'plan B: substitution',
    d5SubNote: 'different road, same destination: 5n = −5',
    d5VerNote: 'both check out — m = 3, n = −1',
    d5GraphNote: 'the crossing point IS the answer',
    d5WhyA: 'n = m − 7 — the ×2 slipped',
    d5WhyC: 'that is m — the question asks n',
    d5WhyD: '7 + 6 − 2 number soup — never checks out',
    d5TrapA: 'dropped the ×2',
    d5TrapC: 'answered m, not n',
    d5TrapD: 'number soup, no check',
    d5GuideThink: 'split → kill m → solve',
    d5GuideLaw0: 'read: m+2n+6 = 2m−n = 7, find n',
    d5GuideLaw1: 'Formula ① split: m+2n=1 · 2m−n=7',
    d5GuideLaw2: 'Formula ② eliminate: 2×① − ② → 5n = −5',
    d5GuideLaw3: 'solve: n = −1, then m = 3',
    d5GuideLaw4: 'check both ✓ · graph crossing (−1, 3)',
    d6AskBadge: 'two constants, two picture clues',
    d6WhyBadge: 'a = opening · b = slide',
    d6WhyOne: 'a: opens up or down',
    d6WhyTwo: 'b: vertex sits at x = −b',
    d6WhyA: 'a > 0? it opens down',
    d6WhyB: 'b < 0 ✓ — but a is flipped',
    d6WhyC: 'the vertex is x = −b, not b',
    d6GuideLaw0: 'read: y = a(x+b)² — signs of a, b?',
    d6GuideLaw1: 'clue 1 · opening: down → a < 0',
    d6GuideLaw2: 'clue 2 · vertex: x = −b > 0',
    d6GuideLaw3: 'combine: b < 0 → option D',
    d6GuideLaw4: 'check: a = −1, b = −2 matches ✓',
    d7AskBadge: 'two inequalities joined by or',
    d7WhyBadge: 'and = overlap · or = everything',
    d7WhyOne: 'and: both must hold',
    d7WhyTwo: 'or: either one counts',
    d7WhyA: 'that is only ① — or takes both',
    d7WhyB: '① gives x < −3, not x > −3',
    d7WhyD: '÷(−2) flips the sign — x < 4',
    d7GuideLaw0: 'read: two branches joined by or',
    d7GuideLaw1: '① subtract 15, ÷ 4',
    d7GuideLaw2: '② subtract 9, then ÷ (−2) — flip',
    d7GuideLaw3: 'or → union: the wider wins',
    d7GuideLaw4: 'check x = 0: ① ✗ · ② ✓',
    d18AskBadge: 'right pyramid · ∠VAB = 72° · base 20 cm',
    d18AskPulse: 'off comes the corner VPBCQ',
    d18WhatSub: '(a) find AP (2 marks) · (b) which is greater, α or β? (6 marks)',
    d18QTextA: 'The set-up: a right pyramid stands on a square\nbase ABCD of side 20 cm, face angle ∠VAB = 72°.\nP sits part-way up VA, Q the same height up VD —\nPQ ∥ BC, and ∠PBA = 60°.',
    d18QTextB: 'The corner VPBCQ is sliced off to make a model.\n(a) Find AP.\n(b) α is how far the cut face leans off the base;\nβ is how far PB leans off it — which leans more?',
    d18FaceSub: '∠VAB — the angle on face VAB',
    d18PqSub: 'P on VA · Q on VD · PQ ∥ BC',
    d18PbSub: '∠PBA = 60° — PB against BA',
    d18WhyBadge: 'V sits right above the centre O',
    d18WhyText: 'VO ⊥ base',
    d18GatePulse: 'α or β ?',
    d18WhyB: 'BH is the hypotenuse — bigger denominator, smaller tan',
    d18WhyC: 'BH ≠ HH′ — the two tan ratios differ',
    d18WhyD: 'strictly greater — BH > HH′ here',
    d18GuideLaw0: 'read: right pyramid · square base 20 cm',
    d18GuideLaw1: '(a) △ABP → sine rule',
    d18GuideLaw2: 'heights scale along the edge VA',
    d18GuideLaw3: '(b)(i) two perpendiculars give tan α',
    d18GuideLaw4: '(b)(ii) hypotenuse BH > HH′',
    gotItSubD19: 'Divide the two given years: b² = 1.21 → b = 1.1, a = 210 000; both totals are GP sums, the ratio 1.1ᵐ⁺⁸/2 stays above 1, and the 20 000 000 line is crossed in year 14.',
    gateChipD19: 'Tap the crossing year',
    d19QTextA: 'In a city, the air cargo terminal X of an airport handles\ngoods of weight A(n) tonnes in the nth year since the start\nof its operation, where n is a positive integer. It is given\nthat A(n) = ab²ⁿ, where a and b are positive constants. It is\nfound that the weights of the goods handled by X in the 1st\nyear and the 2nd year since the start of its operation are\n254 100 tonnes and 307 461 tonnes respectively.',
    d19QTextB: '(a) (i) Find a and b. Hence find the weight in the 4th year.\n(ii) Express the total weight of the first n years.\n(b) Y starts 4 years after X; B(m) = 2abᵐ. (i) The manager\nclaims Y < X in every year — agree? (ii) When the total\nexceeds 20 000 000 t, install new facilities — which year?',
    d19AskText: '(a) (i) find a and b — hence the 4th-year weight\n(ii) the total weight of the first n years — 6 marks\n(b) (i) after Y starts, is Y < X in every year?\n(ii) total > 20 000 000 — in which year? — 7 marks',
    d19S1Badge: 'A(n) = ab²ⁿ tonnes in year n',
    d19S1Sub: 'terminal X — one bar per year',
    d19S2Sub: 'the exponent 2n — each year the weight ×b²',
    d19S3Sub: 'the two given years — A(1) · A(2)',
    d19WhyBadge: 'A(n+1) / A(n) = b² — constant',
    d19WhyText: 'geometric progression — GP',
    d19SumSub: 'first term A(1) = 254 100 · ratio b² = 1.21 · n terms',
    d19SumfSub: 'the total collapses into one formula',
    d19PartbBadge: 'B(m) = 2abᵐ = 420 000 × 1.1ᵐ',
    d19CmpSub: 'same year, two terminals — one ratio',
    d19AgreeText: 'agree — Y < X in every year',
    d19BySub: 'Y’s own running total — same trick, ratio 1.1',
    d19GatePulse: 'which year ?',
    d19WhyA: 'too early — T(12) = 15 991 557, far below the line',
    d19WhyB: 'not yet — T(13) = 19 484 712 < 20 000 000',
    d19WhyD: 'too late — the line was crossed in year 14',
    d19CrossSub: 'the line sits between years 13 and 14',
    d19VerifyTop: 'the jump T(14) − T(13) = 4 117 780 t — ×1.21 growth',
    d19GuideLaw0: 'read: A(n) = ab²ⁿ · two given years',
    d19GuideLaw1: '(a)(i) divide: b² = 1.21 → b = 1.1',
    d19GuideLaw2: '(a) A(4) ≈ 450 153.65 · GP sum S(n)',
    d19GuideLaw3: '(b)(i) ratio 1.1ᵐ⁺⁸/2 ≥ 1.1⁹/2 > 1',
    d19GuideLaw4: '(b)(ii) T(14) > 20 000 000 → n = 14',
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
    gotItSubIndex: '先寫出① (ab)ⁿ、② (aᵐ)ⁿ、③ aᵐ÷aⁿ——答案就是 4x⁷ = C。',
    gotItSubD2: '公式 ① 代入 a+b = 8x、a−b = 2y——得出 16xy，選項 D。',
    gotItSubD3: '比 x 項（q = −2）、比常數（p = 6）——選項 C。或代 x = −2 一行搞定。',
    gotItSubD4: '因式定理：f(−3) = 0 → −3 − 3k = 0 → k = −1。選項 B。',
    gotItSubD5: '消去法：2×① − ② → 5n = −5 → n = −1。選項 B。',
    gotItSubD6: '兩條線索：開口向下 → a < 0；頂點 x = −b > 0 → b < 0。選項 D。',
    gotItSubD7: '兩條都解：x < −3 同 x < 4。or 合併——闊嘅勝出 → x < 4。選項 C。',
    gotItSubD18: '△ABP 用正弦定律搵 AP ≈ 23.3；高度沿 VA 線性縮到 PH ≈ 20.96；兩條垂直線起出 α ≈ 58.6°——BH > HH′，所以 α > β。',
    replay: '再玩一次',
    next: '下一課 →',
    catalog: '目錄',
    swipeHint: '上滑 / ↓',
    challengeHint: '完成挑戰後繼續',
    gateChip: '點「自動拼入」後繼續',
    gateChipCong: '點兩個相等的角以繼續',
    gateChipIndex: '點出跟足公式 ③ 的答案',
    gateChipD2: '點出公式 ① 算出的答案',
    gateChipD3: '點出 p 的值',
    gateChipD4: '點出 k 的值',
    gateChipD5: '點出 n 的值',
    gateChipD6: '揀出正確組合',
    gateChipD7: '點出正確解',
    gateChipD18: '邊個大？撳啱佢',
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
    indexLawTag1: '公式 ①',
    indexLawTag2: '公式 ②',
    indexLawTag3: '公式 ③',
    indexLawTagNum: '係數',
    indexLawTagAll: '三條齊',
    indexLawsReady: '寫好再用',
    indexGuideTitle: '一步一步解題指南',
    indexGuideThink: '看見 → 寫公式 → 代入',
    indexGuideLaw0: '讀題——先處理括號外的冪',
    indexGuideLaw1: '公式 ①  (ab)ⁿ = aⁿ · bⁿ',
    indexGuideLaw2: '公式 ②  (aᵐ)ⁿ = aᵐⁿ   +  2³ = 8',
    indexGuideLaw3: '公式 ③  aᵐ ÷ aⁿ = aᵐ⁻ⁿ   +  8÷2',
    indexGuideLaw4: '答案',
    d2Ready: '兩條公式，寫好再用',
    d2Flip: 'y − (−y) = y + y——減號把它翻正',
    d2OneLine: '一行搞定',
    d2CheckNote: '同一答案——用來驗算最快',
    d2ExpandTag: '展開驗證',
    d2ExpandNote: '只有交叉項留下來',
    d2WhyA: '兩式有 ±y 之別——不會抵銷成 0',
    d2WhyB: '公式 ① 是乘積不是平方——且 (2y)² = 4y²',
    d2WhyC: 'a − b = 2y，不是 y——y 要加倍',
    d2TrapA: '沒有東西可抵銷',
    d2TrapB: '(2y)² 被當成了 2y²',
    d2TrapC: 'y − (−y) = 2y，不是 y',
    d2GuideThink: '寫公式 → 命名 → 代入',
    d2GuideLaw0: '讀題——平方減平方，套公式',
    d2GuideLaw1: '公式 ①  a² − b² = (a+b)(a−b)',
    d2GuideLaw2: 'a + b = 8x   (+y、−y 抵銷)',
    d2GuideLaw3: 'a − b = 2y   (y − (−y) = 2y)',
    d2GuideLaw4: '答案',
    d3ForAllX: '對所有 x 都成立',
    d3Ready: '先展開，再逐項對比',
    d3XNote: 'x 項都要相等',
    d3ConstNote: '常數也要相等——代入 q',
    d3SubTag: '捷徑：代入',
    d3SubX: '揀 x = −2——整走 (x+2)',
    d3ExpandTag: '代入驗證',
    d3BalNote: '兩邊都是 10——恆等式成立',
    d3WhyA: '−4 = 2q——漏加了 + 10',
    d3WhyB: '−2 是 q——題目問的是 p',
    d3WhyD: '10 是題目給的常數——p = 2q + 10',
    d3TrapA: '2q，沒加 + 10',
    d3TrapB: '這是 q，不是 p',
    d3TrapD: '從沒解出 q',
    d3GuideThink: '展開 → 比 x → 比常數',
    d3GuideLaw0: '讀題——恆等式，求 p',
    d3GuideLaw1: '公式 ①  (x+m)(x+n) = x²+(m+n)x+mn',
    d3GuideLaw2: 'x 項：q + 2 = 0',
    d3GuideLaw3: '常數：p = 2q + 10',
    d3GuideLaw4: '捷徑  代 x = −2：4+p = 10',
    d4FactorEq: '整除 ⟺ f(−3) = 0',
    d4Law1: '因式定理：f(a) = 0 ⟺ (x−a) 係因式',
    d4Law2: 'x + 3 = x − (−3) → 代 x = −3',
    d4ToolsNote: '代個根落去，令佢等於 0',
    d4PowerNote: '次方先搞掂：(−3)³ = −27，(−3)² = +36',
    d4SynTag: '捷徑：綜合除法',
    d4SynNote: '搬低 · 乘 −3 · 加返',
    d4RemNote: 'f(−3) = −3 + 3 = 0——確認',
    d4WhyA: '(−3)² = +36——符號滑咗手',
    d4WhyC: '−3k = 3 → k = −1，唔係 +1',
    d4WhyD: '(−3)³ = −27，唔係 +27',
    d4TrapA: '(−3)² 符號錯',
    d4TrapC: '移項漏負號',
    d4TrapD: '(−3)³ 符號錯',
    d4GuideThink: '代 −3 → 合併 → 解 k',
    d4GuideLaw0: '讀題：(x+3) 整除 x³+4x²+kx−12，求 k',
    d4GuideLaw1: '公式 ① 因式定理：f(−3) = 0',
    d4GuideLaw2: '代入：−27+36−3k−12 = 0',
    d4GuideLaw3: '合併：−3 − 3k = 0 → k = −1',
    d4GuideLaw4: '捷徑  綜合除法：餘數 0',
    d5ChainEq: '連等式 = 兩條方程',
    d5WhyBadge: '一條式 = 一條線 · 兩條 = 一點',
    d5WhyOne: '一條式 → 無限個解',
    d5WhyTwo: '兩條式 → 一個交點',
    d5WhyTag: '聯立 = 搵交點',
    d5ElimTag: '消去法',
    d5SubTag: '計劃 B：代入',
    d5SubNote: '不同路，同一目的地：5n = −5',
    d5VerNote: '兩條都過——m = 3，n = −1',
    d5GraphNote: '交點就係答案',
    d5WhyA: 'n = m − 7——漏咗 ×2',
    d5WhyC: '呢個係 m——題目問 n',
    d5WhyD: '7 + 6 − 2 亂溝數——代唔返',
    d5TrapA: '漏咗 ×2',
    d5TrapC: '答咗 m 唔係 n',
    d5TrapD: '亂溝數，冇驗證',
    d5GuideThink: '拆 → 消 m → 解',
    d5GuideLaw0: '讀題：m+2n+6 = 2m−n = 7，求 n',
    d5GuideLaw1: '公式 ① 拆開：m+2n=1 · 2m−n=7',
    d5GuideLaw2: '公式 ② 消去：2×① − ② → 5n = −5',
    d5GuideLaw3: '求解：n = −1，m = 3',
    d5GuideLaw4: '兩條驗證 ✓ · 圖像交點 (−1, 3)',
    d6AskBadge: '兩個常數 · 兩條線索',
    d6WhyBadge: 'a 管開口 · b 管左右',
    d6WhyOne: 'a：開口向上或向下',
    d6WhyTwo: 'b：頂點喺 x = −b',
    d6WhyA: 'a > 0？開口係向下',
    d6WhyB: 'b 啱——但 a 掉轉咗',
    d6WhyC: '頂點係 x = −b，唔係 b',
    d6GuideLaw0: '讀題：y = a(x+b)²，問 a、b 正負',
    d6GuideLaw1: '線索 ①：開口向下 → a < 0',
    d6GuideLaw2: '線索 ②：頂點 x = −b > 0',
    d6GuideLaw3: '合併：b < 0 → 選項 D',
    d6GuideLaw4: '驗證：代 a = −1、b = −2 ✓',
    d7AskBadge: '兩條不等式 · or 連住',
    d7WhyBadge: 'and 計重疊 · or 全收',
    d7WhyOne: 'and：兩條都要啱',
    d7WhyTwo: 'or：一條啱就算',
    d7WhyA: '淨係解咗 ①——or 兩條都要',
    d7WhyB: '① 係 x < −3，唔係 x > −3',
    d7WhyD: '÷(−2) 要掉轉不等號——x < 4',
    d7GuideLaw0: '讀題：兩條式用 or 連住',
    d7GuideLaw1: '① 減 15，再 ÷ 4',
    d7GuideLaw2: '② 減 9，再 ÷ (−2)——掉轉',
    d7GuideLaw3: 'or → 合併：闊嗰條勝出',
    d7GuideLaw4: '驗證 x = 0：① ✗ · ② ✓',
    d18AskBadge: '直立角錐 · ∠VAB = 72° · 底邊 20 cm',
    d18AskPulse: '切走 VPBCQ 呢一角',
    d18WhatSub: '(a) 搵 AP（2 分）· (b) 比較 α 同 β，邊個大？（6 分）',
    d18QTextA: '設定：一件直立角錐企喺正方底 ABCD 上面，\n底邊 20 cm，面角 ∠VAB = 72°。\nP 喺 VA 上面、Q 喺 VD 上面，兩點同一高度——\nPQ ∥ BC，而且 ∠PBA = 60°。',
    d18QTextB: '個角 VPBCQ 被切走，整成一件模型。\n(a) 搵 AP。\n(b) α 量度切面斜離底面幾多；\nβ 量度 PB 斜離底面幾多——邊個斜得多？',
    d18FaceSub: '∠VAB——面 VAB 上面嘅角',
    d18PqSub: 'P 喺 VA 上 · Q 喺 VD 上 · PQ ∥ BC',
    d18PbSub: '∠PBA = 60°——PB 同 BA 嘅角',
    d18WhyBadge: '直立角錐 → V 啱啱喺正中心 O 上方',
    d18WhyText: 'VO ⊥ 底面',
    d18GatePulse: 'α 定 β 大？',
    d18WhyB: 'BH 係斜邊——分母大咗，tan 反而細',
    d18WhyC: 'BH ≠ HH′——兩個 tan 唔同',
    d18WhyD: '係嚴格大於——呢度 BH > HH′',
    d18GuideLaw0: '讀題：直立角錐 · 正方底 20 cm',
    d18GuideLaw1: '(a) △ABP → 正弦定律',
    d18GuideLaw2: '高度沿邊 VA 線性縮放',
    d18GuideLaw3: '(b)(i) 兩條垂直線起 tan α',
    d18GuideLaw4: '(b)(ii) 斜邊 BH > HH′',
    gotItSubD19: '兩年相除：b² = 1.21 → b = 1.1，a = 210 000；兩條總數都係 GP 和，比率 1.1ᵐ⁺⁸/2 永遠大過 1，20 000 000 呢條線喺第 14 年跨過。',
    gateChipD19: '㩒一㩒跨線嗰年',
    d19QTextA: '某城市一個機場嘅空運貨站 X，自開始營運起\n喺第 n 年處理嘅貨物重量係 A(n) 噸，當中 n 係正整數。\n已知 A(n) = ab²ⁿ，a 同 b 係正常數。\n據知 X 喺營運第 1 年同第 2 年處理嘅\n貨物重量分別係 254 100 噸同 307 461 噸。',
    d19QTextB: '(a) (i) 搵 a 同 b，再搵第 4 年嘅重量。\n(ii) 用 n 表示首 n 年嘅總重量。\n(b) Y 喺 X 營運 4 年後開站，B(m) = 2abᵐ：\n(i) 經理話 Y 開站後每年 Y < X——同意嗎？\n(ii) 總量超過 20 000 000 噸要裝新設施——第幾年？',
    d19AskText: '(a) (i) 搵 a 同 b——再搵第 4 年重量\n(ii) 首 n 年嘅總重量（6 分）\n(b) (i) Y 開站之後，每年 Y < X，同意嗎？\n(ii) 總量超過 20 000 000——第幾年？（7 分）',
    d19S1Badge: 'A(n) = ab²ⁿ 噸（第 n 年）',
    d19S1Sub: '貨站 X——一年一枝',
    d19S2Sub: '指數係 2n——每過一年重量 ×b²',
    d19S3Sub: '兩個已知年——A(1) · A(2)',
    d19WhyBadge: 'A(n+1) / A(n) = b²——常數',
    d19WhyText: '等比數列（GP）',
    d19SumSub: '首項 A(1) = 254 100 · 公比 b² = 1.21 · n 項',
    d19SumfSub: '成條數收縮做一條式',
    d19PartbBadge: 'B(m) = 2abᵐ = 420 000 × 1.1ᵐ',
    d19CmpSub: '同一年，兩個站——一個比率',
    d19AgreeText: '同意——每年 Y < X',
    d19BySub: 'Y 自己嘅累積總量——同一招，公比 1.1',
    d19GatePulse: '第幾年？',
    d19WhyA: '太早——T(12) = 15 991 557，離條線好遠',
    d19WhyB: '仲未夠——T(13) = 19 484 712 < 20 000 000',
    d19WhyD: '太遲——第 14 年已經過咗條線',
    d19CrossSub: '條線啱啱喺第 13 同第 14 年之間',
    d19VerifyTop: '跳升 T(14) − T(13) = 4 117 780 噸——×1.21 增長',
    d19GuideLaw0: '讀題：A(n) = ab²ⁿ · 兩個已知年',
    d19GuideLaw1: '(a)(i) 相除：b² = 1.21 → b = 1.1',
    d19GuideLaw2: '(a) A(4) ≈ 450 153.65 · GP 和 S(n)',
    d19GuideLaw3: '(b)(i) 比率 1.1ᵐ⁺⁸/2 ≥ 1.1⁹/2 > 1',
    d19GuideLaw4: '(b)(ii) T(14) > 20 000 000 → 第 14 年',
    missing: '找不到這一課。',
    backHome: '回到目錄',
    waveSinDeriv: '紅線斜率 ≈ 藍線',
    waveCosDeriv: '藍線斜率 ≈ 綠線',
  },
}
