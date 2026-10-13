# 🎯 LESSON STYLE — 一頁一個重點（One Slide, One Message）

> 本檔案記錄 **2012 DSE 卷二 Q5（聯立方程）** 的展示方式——目前最滿意的課堂設計標準。
> 參考實作：`src/components/SimEqLab.tsx` + `src/data/dse2012q5.ts`
> 之後所有新課堂照呢個 style 做。
>
> **⭐ 題目類課堂（DSE questions）一律跟下面新增嘅「展示模式 v2」章節**（2026-10-12 起），
> 範本：`PyramidLab.tsx` + `dse2012p1q18.ts`。Q5 章節仍然適用於非題目類實驗課。

---

## 核心原則

**一個 slide 只載一個訊息。** 學生一眼望去，應該即刻知道「呢一頁想我明啲乜」。

### 五條規則

| # | 規則 | 原因 |
|---|------|------|
| 1 | **每頁一個焦點元素**（一張卡／一個圖像／一條式） | 兩張卡已經係兩個訊息 |
| 2 | **不寫 beat prompt**（頂部說明文字框全部剷走） | 文字框重複畫面內容 = 第二個訊息 |
| 3 | **不用 vm-eq 底部重複公式行** | 同 caption 重複，純噪音 |
| 4 | **一個操作 = 一頁**（×2 一頁、相減另一頁） | 步驟拆細，節奏自然慢落嚟 |
| 5 | **Badge 只喺有加值時先出現**（≤1 個/頁），唔係每頁都有 | Badge 同卡片重複就唔好擺 |

---

## 結構設計：拆到有幾細就幾細

「一頁一訊息」令頁數變多——**呢個係 feature，唔係 bug**。Q5 由 11 頁變 15 頁：

```
題目圖 → 題目原文 → 逐句解釋（一句一拍）→ 問咩 → 點解用呢個方法 → 步驟A → 步驟B → 互動閘門
     → 答案 → 驗證 → 指南
```

- **先顯示問題（先圖後文字），一句一句解釋**（2026-10-09 用户回饋：「先顯示問題(先圖後文字)」＋「太快了, 先顯示問題, 然後一句一句的解釋」）——拍1 淨圖（同試卷一樣，乜都唔加）；拍2 原汁原味題目全文（題幹白色、問咩金色，逐行浮現）；之後**每句題目一拍**：喺圖上金色 highlight 該句講嘅元素（邊／角／點）＋底部一句講解；最後一拍「問咩」列 (a)(b) 同分值，**然後先到**解題。範本：`PyramidLab.tsx`（Q18，22 拍）嘅 figure/question/why/face/pq/pb/ask/what 開場

- **拆鏈**：兩條式分兩頁（split1 金色 ①、split2 藍色 ②）
- **消去**：×2 同相減分兩頁（每頁一個操作）
- **驗證**：每條式一頁（一張卡，置中）
- **❌ 唔好加「A/B/C 點解錯」陷阱頁**（2026-10-09 用户回饋：「a,b,c 點解錯是無需要的」）——答錯嘅解釋只喺閘門出現：撀錯 chip → 紅搖 + 底部一句原因，夠晒
- **指南**：淨低 5 行 row（Q→①→②→③→④），唔加標題、唔加底部總結——rows 就係全部
- **Plan B / 延伸資訊**：直接唔好——一條主線行到底

---

## 版面配方（430 × 330 SVG）

### 標準元素

| 元素 | 用法 |
|------|------|
| `FormulaBadge` | y=18，label + formula；**只在** badge 帶出新訊息先出現（如 ask、why、elim2、gate） |
| `Card` | 單一置中大卡：`x={60} y={125} w={310} h={80}`，圓號圈放左邊 `cx={97}` |
| 拆解卡 | muted 來源式喺上（y=95, opacity 0.5）→ 色箭嘴向下 → 一張卡（`x=55 y=148 w=320`） |
| 互動閘門 | badge（載住方程式）+ `n = ?` 脈衝 + 4 chips（`CHIP_Y=222`）+ 回饋行 y=314 |
| 答案 | 金環 `r=56` + 大字 `fontSize=36`，下面最多兩行細字 |
| 圖像 | 無 badge、無說明行——得軸 + 線 + 線標籤 + 脈衝交點，畫面自己講嘢 |

### Badge 使用一覽（Q5 為例）

```
ask    → Q5    / 連等式 = 兩條方程     ✓（帶出洞察）
why    → WHY   / 一條式=一線·兩條=一點  ✓（結論）
split1 → 無 badge                      （卡片就係訊息）
split2 → 無 badge
elim   → 無 badge
elim2  → 消去法 / 2×① − ②             ✓（命名緊做緊嘅操作）
gate   → 消去法 / 5n = −5              ✓（badge 載住方程式，畫面淨低 n=? + chips）
answer / verify / graph / guide → 無 badge
```

### 顏色

- 金 `#ffd166` = 答案/數值 · 藍 `#4cc9f0` = 公式/次要 · 紅 `#ff6b7a` = 錯誤 · 綠 `#b8f27c` = 確認
- muted 來源式 `opacity 0.5–0.6`（俾上下文，唔搶焦點）

### 動畫

- `useFly(mode)` rAF eased；元素 stagger 進場 `clamp01((u - 0.15 - i*0.15) / 0.35)`
- 卡片由下浮上 `translate(0, (1-c)*14)`；guide 用較長 duration（1400ms）
- 閘門答錯：chip 紅搖 `is-wrong` + 底部一行原因（1.6 秒後消失）

---

## ✅ Do / ❌ Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| 一頁一卡，置中，字大 | 一頁多卡平排 |
| 用頁數換清晰度（15 頁 OK） | 為慳頁數塞多個訊息 |
| muted 小字俾上下文 | 完整重複上一頁內容 |
| 純數學符號（✓ + ✓ · (−1, 3) → B ✓） | 畫面入面出現英文句子（zh mode 會漏出嚟） |
| 問未知數用正規寫法（n = ? · a = ?, b = ?） | 自創符號（~~a ? · b ?~~——唔係數學表達，會令人誤會） |
| 答案頁大金環 + → B ✓ | 答案頁仲擺推導步驟 |
| 圖像頁得圖 | 圖像頁加 badge/註解行 |

---

## 新課堂檢查表（照 Q5 抄）

1. `src/components/<X>Lab.tsx` — 抄 `SimEqLab.tsx` 結構：helpers（useFly/Tex/Card/FormulaBadge）→ 常數 Part 陣列 → mode flags → 一個 scene 一個 flag block → **無 vm-eq 區塊**
2. `src/data/<topic>.ts` — beats **只有** `{id, caption, viz}`，**不寫 prompt**；gate beat 加 `gate: 'interact'`
3. `src/data/types.ts` — Mode union + Props + viz type/props union
4. `src/components/LessonPlayer.tsx` — LAB_VIZ + import + props cast + render branch + gotItSub/gateChip maps
5. `src/data/catalog.ts` — topic + allLessons
6. `src/i18n/ui.ts` — 有先至加 key（能重用就重用）
7. `src/i18n/lessons-zh-Hant.ts` — zh pack beats **只有 caption**

驗證：`npm run build` → `vite preview --port 4311` → Selenium 逐頁截圖人眼審核（`C:\Users\Administrator\math\shoot_q7.py` 為模板）。

---

## 🧷 實作陷阱備忘（踩過先知）

- **SVG 會摺埋連續空格**——想喺畫面入面留空隙（例如 `A x < −3␣␣␣␣B x > −3`），要用不斷行空格 `\u00A0`，普通空格幾多個都會變返一個。
- **Headless 截圖前 park 滑鼠**——Selenium 撳完 `.stage` 後虛擬滑鼠停喺 stage 中心，可能掂住 chip 顯示 hover 樣（假象）。shoot 腳本每次 `shoot()` 前用 `ActionChains.move_to_element_with_offset(body, 5, 5)` park 去角落。
- **兩條 ray 疊同一條數線**：想兩段都見到——實線畫先、虛線畫後（虛線騎喺實線上面）。 Q7 union 頁：金實線（x < 4）畫先，藍虛線（x < −3）畫後，−3 以左見到藍虛線騎金、−3 至 4 淨金——聯集一目了然。

---

# ⭐ 展示模式 v2 — 題目類課堂標準（2026-10-12，所有題目跟隨）

> 由 Q18/Q19 收斂出嚟嘅完整標準。範本：`src/components/PyramidLab.tsx` + `src/data/dse2012p1q18.ts`（23 beats）。
> **每一課新題目由第一頁到最後一頁都照跟，唔使再問。**

## 1. 版權紅線

- **永遠唔可以逐字展示 HKEAA 試題原文。** 題目 slide 用自己嘅話描述同一個設定——事實、數字、角度全部不變，只換句子結構。
- 標題保留事實性出處（例如「2012 DSE Paper 1 Q18」）。
- i18n 字串放 `ui.ts` 嘅 `dXXQTextA/B`（en + zh-Hant 兩個 block 都要改）。
- zh 版本語氣用口語廣東話（「設定：一件直立角錐企喺正方底…」），en 用平實英文。

## 2. 審題 = 已知條件制（唔係句子制）

- 讀題頁按**幾何元素**拆，唔按題目句子行：固體 → 面角 → 切面位置 → 切面深度 → 切走 → 問咩。
- 一個條件可以佔多過一頁：「已知條件 3——切面位置」同「已知條件 3——切面深度」兩頁共用同一個編號。
- zh 用「已知條件 N」、en 用「Given N」（**唔好用 元素/Element**，用戶 2026-10-12 改名）。
- (a)/(b) 問項必須**各自一頁**（2026-10-12 用戶回饋），唔好合併同一版。

## 3. 標準 beat 流水（Q18 = 23 beats）

```
p0  題目——先睇圖（淨圖，乜都唔加）
p1  題目——用自己嘅話講一次（手機: HTML QuestionCard / 桌面: SVG 文字）
p2-p6  已知條件 1-N（一條件一拍，唔跟句子）
p7a 問咩——(a)（大字 pulse + 分數）
p7b 問咩——(b)
p8+ 解題步驟（一步一頁：先搵乜 → 用乜定律 → 答案頁）
…   互動閘門（gate: 'interact'）→ 比較 → 答案 → 驗證 → 指南
```

## 4. 階段 Badge（LessonPlayer `splitBeatTag()` 自動解析）

- 每個 beat caption 用「階段詞——內容」格式；LessonPlayer 抽頭個詞做**頂部彩色 pill**（`.beat-stage` row 1），caption chip 淨低內容。
- 顏色表（`BEAT_TAGS` in `LessonPlayer.tsx`）：

| 階段詞 | 顏色 | class |
|---|---|---|
| 題目 / The question | 青 `--cos` | `tag-q` |
| 已知條件 N / Given N | 金 `--accent` | `tag-el` |
| 問咩 / What is asked / 到你 / Your turn | 粉 `#ff8fa0` | `tag-ask` |
| 點解(係 GP) / 驗證 / 秒殺法 / Why / Check / The slick way | 綠 `--op` | `tag-why` |

- 新階段詞：加入 `BEAT_TAGS` regex 就得，唔使加 i18n。
- 無階段詞嘅 beat（如 `b² = 1.21 → b = 1.1`）照舊成句喺底，唔好亂加 badge。

## 5. 版面規則（防疊位）

- **唔可以有任何兩塊嘢佔同一位置**（2026-10-12 用戶回饋，例 Given 1）。加新元素前先檢查 svg viewBox 內 y 18–55 嘅 badge 帶有冇嘢撞。
- `.beat-stage` 三行已釘死（`.prompt`/`.viz-plane`/`.caption-chip` 各歸 row 1/2/3）——新元素入 row 1 前要想清楚。
- svg 內 FormulaBadge（y=18）只准喺**圖表由 y≥88 先開始**嘅 beat 用；金字塔/高圖型唔准用（會撞頂點）。
- badge 文字同 caption chip 文字**不准重複**——揀一處講。

## 6. 手機（≤520px）— 一等公民

- 題目 slide：`QuestionCard` HTML（16px、pre-line、24rem 置中、數字組 NBSP 黏住）——`useNarrow()` hook 控制，桌面照用 SVG。
- MCQ 閘門：`McqCards` 全寬堆疊卡（≥48px 高、solved/wrong/dim 樣）+ `mcq-feedback` 行；空 SVG 唔好 render。
- 答案邏輯永遠留喺 lab 入面，`McqCards` 純展示。
- Header：title ellipsis、back 44×44、lang pills ≥44px、字 ≥14px；footer `env(safe-area-inset-bottom)`。
- 禁 `viewport-fit=cover`（in-app browser 會畫入 status bar）；`.player` 有 `overscroll-behavior: none`。
- 驗證 template：`C:\Users\Administrator\math\verify_mobile.py`（390×844 + 1280、gate 行為、零溢出）。

## 7. 動畫節奏（2026-10-12 減半）

- `useFly`: **1900ms**（guide **2800ms**）· `useAutoFly`: **1640ms** · beat 入場 `fade-up`: **0.76s**
- 回饋類唔減速：答錯 shake、solved pulse、gate chip 閃爍。

## 8. 新題目檢查表（喺 Q5 表之上加呢啲）

1. 題目文字：own words 寫 `dXXQTextA/B`（en+zh），數字照抄原卷
2. 審題 beats 用「已知條件 N——…」/「Given N · …」caption
3. (a)/(b) 問項分頁（`pXa`/`pXb` id，zh pack 同步加 key）
4. 行完第 6 節手機檢查（QuestionCard / McqCards / 無疊位）
5. 動畫用第 7 節時長
6. `npm run build` + `verify_mobile.py` 全綠先算完成——完整量產流程見第 9、10 節（資訊審計 + PDF→live SOP）

## 9. 交貨前資訊審計（必做——2026-10-12「20 cm 漏咗」教訓）

建完課未算完成，**要交審計表先算交貨**：

1. 由原卷逐句列出所有資訊：每個長度／角度／座標／條件（平行、垂直、相切、比例）／每個問項連分值。
2. 逐項核對三個位：① own-words 題目文字有冇 ② 圖上有冇可見標記（尺寸、角度弧、直角、tick）③ 有冇專屬審題 beat。
4. 三樣齊先打勾；漏咗即補（實例：Q18 圖上補 20 cm、Q17 補已知條件 3/4——直線 L 同 A、B 交點）。
5. 交貨訊息附審計表：`| 原卷資訊 | 課堂文字 | 課堂圖 |`。

特別規則：
- 原卷冇圖 → 自己畫 setup 圖（座標題用 world→px 比例畫，唔好手繪）。
- 圖上尺寸標註可以超越原卷（Q18 原卷圖冇 20 cm，我哋都標——用戶明確要求）。
- 審題 beats 用「已知條件 N——內容」；一個元素兩面（例：切面位置／切面深度）共用同一個 N。
- **唔識嘅題目唔準作**——來源頁唔喺度就開口要，憑記憶作題 = 一定漏資訊。

## 10. 新題目量產 SOP（PDF → live，大量處理用）

用戶俾 PDF 路徑 + 頁碼（例：`C:\Users\Administrator\Documents\DSE_Maths\2012p1.pdf` page 18）之後，照住行：

1. **抽頁**：
   `python -c "import fitz; doc=fitz.open(r'<pdf>'); doc[17].get_pixmap(dpi=200).save(r'..\math\p1_pg18.png')"`
   （fitz 係 0-index：PDF 第 N 頁 = `doc[N-1]`；200dpi；存入 `math\`）
2. **讀原卷** → 寫低全題資訊清單（第 9 節用）。
3. **自己先解晒，未 build 唔准開工**：兩 part 都要解；用**第二個方法或代數值**驗證（例 Q17：代 k=6 驗中點；兩法答案一致先算過）。冇 100% 把握唔准入課堂。
4. **照第 3 節 beat 流水起課**：figure → own words → 已知條件 1-N → 問咩(a) → 問咩(b) → 解題（一個操作一頁）→ 閘門 → 秒殺法 → 答案 → 驗證 → 指南。
5. **元件**：抄 `src/components/CircleLineLab.tsx`（最新模板：sup/sub Tex、world→px helpers、2×2 chips、narrow HTML blocks 齊備）。
   - 檔名：`src/components/<Topic>Lab.tsx` + `src/data/dse<year>p1q<num>.ts`
   - 座標幾何：設 `OX/OY/S` world→px helpers，**先筆算晒所有關鍵點喺 viewBox 0-430/0-330 內**先寫 JSX。
   - SVG 內數學式用 Part 常數（語言中立）；文字先入 i18n，`qXX*` keys：`QTextA/B · WhatSubA/B · GatePulse · WhyB/C/D · GuideLaw0-4 · gateChip · gotItSub`——en + zh 兩個 block 都要加。
   - 動畫時長跟第 7 節；MCQ 選項長（座標對）用 2×2 chips（CHIP_W=202），手機照 `McqCards`。
6. **接線 6 處**（漏一處都 build 唔起）：
   `types.ts`（Mode + Props + viz type/props union）→ `LessonPlayer.tsx`（LAB_VIZ + import + props cast + render branch + gotItSub map + gateChip map）→ `catalog.ts`（import + topic lessons + `source:` 字串 + allLessons）→ `ui.ts`（interface + en + zh）→ `lessons-zh-Hant.ts`（zh pack beats 只有 caption）。
7. **驗證**：`npm run build` → selenium 390×844 每個新 beat 截圖（gate 行為必測：擋前進、答錯留低、答啱 auto-advance）→ 桌面無 HTML 卡 → Q18 `verify_mobile.py` regression 綠 → 自我執法 v2 規則 5（無重複 pulse／無疊位）。
8. **第 9 節審計表** → `git push`（push = deploy）→ 回報連審計表 + 截圖要點。
