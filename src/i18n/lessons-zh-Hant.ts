/** Traditional Chinese overlays for lesson / beat text (math stays as TeX). */

export type LessonText = {
  title: string
  subtitle: string
  beats: Record<string, { caption: string; prompt?: string }>
}

export const lessonsZhHant: Record<string, LessonText> = {
  'p-squares': {
    title: '小正方形能填滿大正方形嗎？',
    subtitle: '移動磁磚——發現畢氏定理',
    beats: {
      p0: {
        caption: '一邊，一個正方形',
        prompt: '每個正方形都向外建在三角形的一邊上。',
      },
      p1: {
        caption: '直角三角形',
        prompt: '兩股垂直相交；最長的那一邊是斜邊。',
      },
      p2: {
        caption: '邊 a 上的正方形 → 9',
        prompt: '在邊 a 上蓋正方形。數一數磁磚。',
      },
      p3: {
        caption: '邊 b 上的正方形 → 16',
        prompt: '在邊 b 上蓋正方形。',
      },
      p4: {
        caption: '邊 c 上的正方形 → 25',
        prompt: '斜邊也蓋一個正方形。磁磚一樣大……',
      },
      p5: {
        caption: '拼進去',
        prompt: '紅、藍磁磚能填滿綠色大正方形嗎？',
      },
      p6: {
        caption: '剛好填滿！',
        prompt: '每塊磁磚都有位置，沒有剩下。',
      },
      p7: {
        caption: '永遠成立',
        prompt: '對任何直角三角形，道理都一樣。',
      },
    },
  },
  'p-check': {
    title: '再驗一組數',
    subtitle: '5–12–13 練習',
    beats: {
      c0: { caption: '5 · 12 · 13' },
      c1: { caption: '蓋上正方形' },
      c2: { caption: '仍然吻合' },
      c3: { caption: '同一個法則' },
    },
  },
  'a-formulas': {
    title: '正弦、餘弦、正切的導數',
    subtitle: '單位圓 → 三個公式',
    beats: {
      a0: { caption: '先畫座標軸' },
      a1: { caption: '單位圓' },
      a2: { caption: '角度 0 的點' },
      a3: { caption: '關鍵角度' },
      a4: { caption: 'x = cos · y = sin' },
      a5: { caption: '正弦的斜率' },
      a6: { caption: '餘弦的斜率' },
      a7: { caption: '正切的斜率' },
      a8: { caption: '三個公式' },
    },
  },
  'b-sum': {
    title: '和的導數',
    subtitle: 'f(x) = 3 sin x + 2 cos x',
    beats: {
      b0: { caption: '原式' },
      b1: { caption: '逐項微分' },
      b2: { caption: '代入公式' },
      b3: { caption: '完成' },
    },
  },
  'c-product': {
    title: '積的導數',
    subtitle: 'd/dx (cos x · sin x)',
    beats: {
      c0: { caption: '乘積' },
      c1: { caption: '乘法法則' },
      c2: { caption: '代入' },
      c3: { caption: '化簡' },
    },
  },
  'd-algebraic': {
    title: '代數 × 三角',
    subtitle: 'f(x) = x² sin x',
    beats: {
      d0: { caption: '原式' },
      d1: { caption: '乘法法則' },
      d2: { caption: '完成' },
    },
  },
  'e-quotient': {
    title: '商的導數',
    subtitle: 'f(x) = (1 + cos x) / sin x',
    beats: {
      e0: { caption: '原式' },
      e1: { caption: '除法法則' },
      e2: { caption: '展開' },
      e3: { caption: '恆等式' },
      e4: { caption: '完成' },
    },
  },
  'f-tangent': {
    title: '某點的正切導數',
    subtitle: "f(x) = tan x — 求 f'(π/4)",
    beats: {
      f0: { caption: '公式' },
      f1: { caption: '在 π/4' },
      f2: { caption: '求值' },
      f3: { caption: '斜率是 2' },
    },
  },
}
