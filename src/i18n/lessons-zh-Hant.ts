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
  'circle-area': {
    title: '塗滿一個圓，要多少漆？',
    subtitle: '把圓環攤開——發現 πr²',
    beats: {
      k0: {
        caption: '一個圓',
        prompt: '圓有半徑 r。裡面的面積是多少？',
      },
      k1: {
        caption: '洋蔥圈',
        prompt: '切成一圈圈薄環。每一圈都是一條等著攤開的帶子。',
      },
      k2: {
        caption: '最外圈',
        prompt: '最長的那圈就是圓周——長度 2πr。',
      },
      k3: {
        caption: '攤開它們',
        prompt: '換你——把圓環剝開疊起來。會出現什麼形狀？',
      },
      k4: {
        caption: '一個三角形！',
        prompt: '底 2πr，高 r。這個三角形，就是剛才塗滿圓的那塊漆。',
      },
      k5: {
        caption: '永遠是 πr²',
        prompt: '½ × 2πr × r 就是 πr²。三角形正好是那個矩形的一半。',
      },
    },
  },
  'square-tri': {
    title: '兩個三角形能變成正方形嗎？',
    subtitle: '翻過去——發現 a²',
    beats: {
      t0: {
        caption: '一個直角三角形',
        prompt: '兩股一樣長。兩個這樣的三角形，能填滿正方形嗎？',
      },
      t1: {
        caption: '邊 a 和 a',
        prompt: '兩條短邊一樣長。這很重要。',
      },
      t2: {
        caption: '雙胞胎',
        prompt: '再來一個一樣的。虛線正方形在等著。',
      },
      t3: {
        caption: '翻進去',
        prompt: '換你——把紅色三角形翻進空的那一半。',
      },
      t4: {
        caption: '一個正方形！',
        prompt: '兩塊剛好填滿，沒有縫，也沒有剩下。',
      },
      t5: {
        caption: '永遠是 a²',
        prompt: '每個三角形是正方形的一半。兩個加起來就是 a²。',
      },
    },
  },
  fibonacci: {
    title: '正方形能越加越大嗎？',
    subtitle: '看 1、1、2、3、5、8——發現螺旋',
    beats: {
      f0: {
        caption: '小小的正方形',
        prompt: '從 1 開始。旁邊能再放一個什麼正方形？',
      },
      f1: {
        caption: '1 加 1 變成 2',
        prompt: '兩個小 1 並排。邊長 2 的正方形剛好貼在長邊上。',
      },
      f2: {
        caption: '然後 3，然後 5',
        prompt: '每一個新正方形，都用上前面兩個的邊。',
      },
      f3: {
        caption: '長出 8',
        prompt: '換你——3 + 5 應該長出下一個正方形。',
      },
      f4: {
        caption: '一條螺旋！',
        prompt: '每個正方形裡的四分之一圓，接成一條越來越大的曲線。',
      },
      f5: {
        caption: '把前兩個加起來',
        prompt: '每一邊都是前面兩邊相加：1+1=2，2+3=5，3+5=8…',
      },
    },
  },
  'zero-pair': {
    title: '加和減會互相抵消嗎？',
    subtitle: '配成對——發現零',
    beats: {
      z0: {
        caption: '一個加，一個減',
        prompt: '一個 +1 和一個 −1。它們碰上後，還剩什麼？',
      },
      z1: {
        caption: '三個加',
        prompt: '三個 +1 籌碼。那就是 +3。',
      },
      z2: {
        caption: '再放兩個減',
        prompt: '放下兩個 −1 籌碼。有些會找到配對。',
      },
      z3: {
        caption: '配成零對',
        prompt: '換你——讓每個減都配上一個加。',
      },
      z4: {
        caption: '剩下一個加',
        prompt: '兩對消失了。+3 和 −2，剩下 +1。',
      },
      z5: {
        caption: '永遠是零',
        prompt: '每個 +1 配上 −1 都變成 0。剩下的，就是答案。',
      },
    },
  },
  distribute: {
    title: '切開長方形，面積還在嗎？',
    subtitle: '切開——發現 (a+b)×c',
    beats: {
      d0: {
        caption: '一個長方形',
        prompt: '一塊 5 乘 4 的格子。裡面有多少面積？',
      },
      d1: {
        caption: '橫 5，直 4',
        prompt: '數格子。五直欄，四橫列。',
      },
      d2: {
        caption: '一刀切開',
        prompt: '在第二欄後面切開。格子少了嗎？',
      },
      d3: {
        caption: '拉開兩塊',
        prompt: '換你——把兩塊拉開。格子還是那麼多。',
      },
      d4: {
        caption: '8 和 12',
        prompt: '2×4 和 3×4。合起來還是 5×4。',
      },
      d5: {
        caption: '永遠是 (a+b)×c',
        prompt: '把邊切開，面積就跟著分開——不多也不少。',
      },
    },
  },
  'fraction-bar': {
    title: '一半和四分之一能共用一條嗎？',
    subtitle: '滑上去——發現 3/4',
    beats: {
      b0: {
        caption: '一整條',
        prompt: '這條是 1。如果把小塊加進去，會塗滿多少？',
      },
      b1: {
        caption: '一半',
        prompt: '一半，就是兩等分裡的一份。',
      },
      b2: {
        caption: '四分之一在等',
        prompt: '四分之一是四等分裡的一份。它想坐上這條。',
      },
      b3: {
        caption: '滑上去',
        prompt: '換你——把四分之一停在一半旁邊。',
      },
      b4: {
        caption: '四分之三！',
        prompt: '一半加四分之一，正好填滿四格裡的三格。',
      },
      b5: {
        caption: '永遠是 3/4',
        prompt: '同一條：2/4 + 1/4 = 3/4。小塊直接加起來。',
      },
    },
  },
  'ten-bundle': {
    title: '十個小的，能變成一個十嗎？',
    subtitle: '捆起來——發現位值',
    beats: {
      n0: { caption: '十個小立方', prompt: '十個一。它們能變成一個十嗎？' },
      n1: { caption: '排成一列', prompt: '十個一排成一列。還是十個一。' },
      n2: { caption: '一根十在等', prompt: '一根十，跟這十個一一樣長。' },
      n3: { caption: '捆起來', prompt: '換你——把一捆進十。' },
      n4: { caption: '一個十！', prompt: '十個一疊好，正好是一個十。' },
      n5: { caption: '永遠是 10 個一 = 1 個十', prompt: '位值就是捆綁：十個這個，變成一個那個。' },
    },
  },
  'array-turn': {
    title: '把格子轉過來，數量會變嗎？',
    subtitle: '轉一下——發現 a×b = b×a',
    beats: {
      r0: { caption: '一塊 3 乘 4', prompt: '十二塊磁磚。整塊轉過來，會少嗎？' },
      r1: { caption: '直 3，橫 4', prompt: '數一數：三列，四欄。' },
      r2: { caption: '轉過來', prompt: '換你——把這塊立起來。' },
      r3: { caption: '還是 12', prompt: '現在直 4、橫 3。同樣的磁磚，只是轉了。' },
      r4: { caption: '永遠 a×b = b×a', prompt: '轉過來只是兩邊對調。數量不變。' },
    },
  },
  'odd-square': {
    title: '奇數能堆成正方形嗎？',
    subtitle: '包一層——發現 n²',
    beats: {
      o0: { caption: '一塊', prompt: '1 是小小的正方形。用奇數包一層會怎樣？' },
      o1: { caption: '1 + 3 = 4', prompt: '3 塊的 L 包住 1。變成 2 乘 2。' },
      o2: { caption: '再 +5', prompt: '下一個奇數再包一層。3 乘 3。7 塊的 L 在等。' },
      o3: { caption: '包上 7', prompt: '換你——把下一層奇數卡上去。' },
      o4: { caption: '4 乘 4 的正方形！', prompt: '1+3+5+7 填滿了。四個奇數，一個 4 的平方。' },
      o5: { caption: '永遠是 n²', prompt: '每一個新奇數，就是下一個正方形的邊框。' },
    },
  },
  'half-half': {
    title: '一半的一半是多少？',
    subtitle: '蓋上去——發現 1/4',
    beats: {
      h0: { caption: '一個正方形', prompt: '這個正方形是 1。先塗一半，再塗那一半的一半。重疊多少？' },
      h1: { caption: '直的一半', prompt: '正方形的一半，從左到右。' },
      h2: { caption: '橫的一半在等', prompt: '另一半，從上到下。它想蓋上去。' },
      h3: { caption: '蓋上去', prompt: '換你——用第二個一半蓋住。看好重疊。' },
      h4: { caption: '四分之一！', prompt: '四個角裡，只有一角在兩半裡。那就是 1/4。' },
      h5: { caption: '永遠 ½ × ½ = ¼', prompt: '分數相乘就是「的」：一半的一半，是四分之一。' },
    },
  },
  'how-many': {
    title: '一半裡能放幾個四分之一？',
    subtitle: '放進去——發現 2',
    beats: {
      m0: { caption: '一半', prompt: '這塊是 1/2。幾個 1/4 能填滿它？' },
      m1: { caption: '一半在等', prompt: '一半的長條，裡面有兩個四分之一的空位。' },
      m2: { caption: '兩個四分之一準備好', prompt: '每個都是 1/4。它們想坐進一半裡。' },
      m3: { caption: '放進去', prompt: '換你——幾個四分之一填滿一半？' },
      m4: { caption: '放得下兩個！', prompt: '兩個四分之一正好填滿一半。沒剩，也沒重疊。' },
      m5: { caption: '永遠 ½ ÷ ¼ = 2', prompt: '除法就是「這個能放進那個幾個」。' },
    },
  },
  'binom-area': {
    title: '(x+1) 和 (x+2) 能變成長方形嗎？',
    subtitle: '填進去——發現 x² + 3x + 2',
    beats: {
      i0: { caption: '一個外框', prompt: '寬 x+1，高 x+2。要填哪些磁磚？' },
      i1: { caption: '一塊 x²', prompt: '中間大正方形是 x 乘 x。' },
      i2: { caption: '長條', prompt: '兩邊是 x 長條，角落還有 1 乘 2 在等。' },
      i3: { caption: '填進去', prompt: '換你——把每塊滑進外框。' },
      i4: { caption: '填滿了！', prompt: 'x²，再 3 條 x，再 2 個小的。不多也不少。' },
      i5: { caption: '永遠是 (x+1)(x+2)', prompt: '這個長方形的面積就是 x² + 3x + 2。' },
    },
  },
  'complete-sq': {
    title: '缺一角，能補成正方形嗎？',
    subtitle: '放上 1——發現 (x+1)²',
    beats: {
      c0: { caption: '一塊 x²', prompt: '邊長是 x 的正方形。我們讓它變大。' },
      c1: { caption: '兩條 x', prompt: '右邊加一條 x，下面再加一條 x。' },
      c2: { caption: '一個洞', prompt: '幾乎是更大的正方形——缺一個小小的 1。' },
      c3: { caption: '放進去', prompt: '換你——把 1 停在角落。' },
      c4: { caption: '更大的正方形！', prompt: '邊長變成 x+1。面積是 (x+1)²。' },
      c5: { caption: '永遠 x² + 2x + 1', prompt: '缺的那個角，就是補正方形的「+1」。' },
    },
  },
  'diff-squares': {
    title: '缺了一口的正方形，能變成矩形嗎？',
    subtitle: '滑那一塊——發現 (a−b)(a+b)',
    beats: {
      s0: { caption: '一個 5 的正方形', prompt: '面積 25。我們咬掉一個 2 的正方形。' },
      s1: { caption: '咬掉 4', prompt: '切掉 2 乘 2。剩下 25 − 4。' },
      s2: { caption: '一塊可以動', prompt: '洞上面那兩欄可以移動。' },
      s3: { caption: '滑過去', prompt: '換你——把那一塊轉下去，變成矩形。' },
      s4: { caption: '3 乘 7', prompt: '剩下橫 3、直 7。還是 21 塊。' },
      s5: { caption: '永遠 a² − b²', prompt: '這個矩形是 (a−b) 乘 (a+b)。' },
    },
  },
  'bar-eq': {
    title: '三條一樣的加上 2，等於 11。一條多長？',
    subtitle: '拿掉 2——發現 x = 3',
    beats: {
      e0: { caption: '一條 11', prompt: '整條是 11。由三條一樣的，加上兩個 1 組成。' },
      e1: { caption: '3 個未知 + 2', prompt: '三條一樣長的 x，再兩個 1。' },
      e2: { caption: '拿掉 2', prompt: '換你——拿掉多的兩個。把剩下的分成三份。' },
      e3: { caption: '每條是 3', prompt: '11 − 2 = 9。三條一樣：每條是 3。' },
      e4: { caption: '永遠 x = 3', prompt: '3x + 2 = 11，所以每個 x 是 3。' },
    },
  },
  'a-angle-sum': {
    title: '三個角能排成直線嗎？',
    subtitle: '撕開三角角——發現 180°',
    beats: {
      s0: {
        caption: '三個角',
        prompt: '每個三角形都有三個內角。它們加起來是多少？',
      },
      s1: {
        caption: '銳角三角形',
        prompt: '把三角角撕到直線上——正好排成一個平角。',
      },
      s2: {
        caption: '有一個直角',
        prompt: '直角三角形也一樣——還是一條直線。',
      },
      s3: {
        caption: '有一個鈍角',
        prompt: '鈍角也一樣——三個角永遠填滿一條直線。',
      },
      s4: {
        caption: '撕開三角角',
        prompt: '換你——把三個彩色角排到直線上。',
      },
      s5: {
        caption: '一條直線！',
        prompt: '平平的外緣 = 180°。三個內角加起來就是這個。',
      },
      s6: {
        caption: '永遠是 180°',
        prompt: '任何三角形：∠A + ∠B + ∠C 永遠是一條直線。',
      },
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
  'dse-q8': {
    title: '2022 DSE 卷一 Q8：四邊形裡的全等三角形',
    subtitle: '平行線 → AAS 全等 → 求出 63°',
    beats: {
      g0: {
        caption: 'BCDE 裡的一點 A',
        prompt:
          'AC ∥ ED、AD ∥ BC。已知 ∠ABC = ∠AED、AB = AE。證明 △ABC ≅ △AED，再求 ∠ACD。',
      },
      g1: {
        caption: '兩組平行線，一對等邊',
        prompt: '平行線是造角工廠。AB = AE 是現成的對應邊。',
      },
      g2: {
        caption: '輪到你——點出兩個相等的角',
        prompt: '內錯角住在 Z 形裡。點出必然相等的一對。',
      },
      g3: {
        caption: 'Z 形一：∠ACB = ∠DAC = θ',
        prompt: '沿 B → C → A → D 走。Z 形的兩個喉角相等（內錯角，AD ∥ BC）。',
      },
      g4: {
        caption: 'Z 形二：∠ADE 也是 θ',
        prompt: '沿 E → D → A → C 走（內錯角，AC ∥ ED）。三個角都等於同一個中間角。',
      },
      g5: {
        caption: 'AAS——兩個三角形全等',
        prompt: '兩對角 + 一對對應邊：△ABC ≅ △AED（AAS）。',
      },
      g6: {
        caption: '代入數字',
        prompt:
          '∠ABC = 39°、∠DAE = 87°。全等把 87° 抄到 ∠BAC。內角和 → ∠ACB = 54°。',
      },
      g7: {
        caption: '隱藏的禮物：AC = AD',
        prompt: '全等三角形的對應邊。△ACD 是等腰三角形——兩底角相等。',
      },
      g8: {
        caption: '對半分：∠ACD = 63°',
        prompt:
          '∠DAC = ∠ACB = 54°（又是內錯角）。每個底角 = (180° − 54°) ÷ 2 = 63°。',
      },
      g9: {
        caption: '驗算：63° + 117° = 180°',
        prompt: 'AC ∥ ED、CD 是截線——同旁內角必須補成 180°。✓',
      },
    },
  },
  'dse-2012-q1': {
    title: '2012 DSE 卷二 Q1：拆解冪塔',
    subtitle: '先展開括號，再約分——兩條指數定律，一個答案',
    beats: {
      g0: {
        caption: '一條分數，一個冪',
        prompt: '(2x⁴)³ ÷ 2x⁵ = ？卷二第一題，已經藏着兩條指數定律。',
      },
      g1: {
        caption: '冪 = 重複相乘',
        prompt: '3 數的是括號，不是因數。(2x⁴)³ 即 (2x⁴)(2x⁴)(2x⁴)——整個括號蓋三次。',
      },
      g2: {
        caption: '2 自己立方：2·2·2 = 8',
        prompt: '立方會走進括號，連 2 都作用到。2³ = 8，不是 2×3 = 6。',
      },
      g3: {
        caption: 'x⁴·x⁴·x⁴ = x¹²',
        prompt: '同底相乘 → 指數相加：4+4+4 = 12。即 (x⁴)³ = x⁴ˣ³。分子完成：8x¹²。',
      },
      g4: {
        caption: '到你——完成除法',
        prompt: '分子 8x¹²，分母 2x⁵。點出跟足兩條定律的選項。',
      },
      g5: {
        caption: '先約數字：8 ÷ 2 = 4',
        prompt: '係數當普通數一樣相除。2 抵消 8 的一半。',
      },
      g6: {
        caption: '指數相減：12 − 5 = 7',
        prompt: 'x¹² ÷ x⁵——同底相除就是把因數成對抵消：十二個 x 中五個消失。',
      },
      g7: {
        caption: '4x⁷——選項 C',
        prompt: '由上至下兩條定律：展開冪（2³、4×3），再同底相除（8÷2、12−5）。',
      },
      g8: {
        caption: 'A、B、D 點解錯',
        prompt: 'B 把 2 乘 3（當成 6x¹²）。D 把指數立方（4³ = 64）。A 兩個錯混合。每一步：一次只用一條定律。',
      },
    },
  },
}
