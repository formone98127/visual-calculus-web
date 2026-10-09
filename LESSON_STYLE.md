# 🎯 LESSON STYLE — 一頁一個重點（One Slide, One Message）

> 本檔案記錄 **2012 DSE 卷二 Q5（聯立方程）** 的展示方式——目前最滿意的課堂設計標準。
> 參考實作：`src/components/SimEqLab.tsx` + `src/data/dse2012q5.ts`
> 之後所有新課堂照呢個 style 做。

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
