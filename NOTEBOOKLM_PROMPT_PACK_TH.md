# NotebookLM Prompt Pack

## วิธีใช้

เอา prompt ด้านล่างไปใช้กับ NotebookLM หรือเครื่องมือสร้างสไลด์จาก markdown/text

เอกสารต้นทางที่ควรใส่คู่กัน:

- `NOTEBOOKLM_SLIDES_8_TH.md`
- `PITCH_MASTER_SPINE_TH.md`
- `UI_EXPLANATION_TH.md`

ถ้าเลือกได้ ให้ใช้ `NOTEBOOKLM_SLIDES_8_TH.md` เป็นโครงหลัก  
และใช้ prompt นี้เป็นตัวกำหนด style กับ tone

---

# Prompt หลัก

สร้าง presentation ภาษาไทยสำหรับการแข่งขัน `OIL SHOCK Hack! | THAILAND EARTH DAY 2026`  
ของโปรเจกต์ชื่อ `SHOCKWAVE`

บริบทสำคัญ:

- งานนี้ต้องถูก framed เป็น `Track A: Planetary Signals Lab`
- โปรเจกต์เป็น `interactive early-warning dashboard`
- แกนเรื่องคือ `global oil shock -> hidden lag -> downstream Thai energy stress`
- จุดขายสำคัญคือ `Problem`, `Solution`, `UI`, `New Assumption`, `Track A fit`, `Statistical Validity`
- audience คือกรรมการ hackathon ที่ดูทั้งความคิด, ความถูกต้อง, และความสามารถในการสื่อสาร
- presentation ต้องเหมาะกับการพูด `5 นาที`

## สิ่งที่ต้องการจาก presentation

1. ทำสไลด์ให้ดูคม ทันสมัย และจริงจังแบบ competition pitch
2. ใช้ visual hierarchy ที่ชัด อ่านแล้วเข้าใจเร็ว
3. ไม่ทำให้ดูเหมือนงานวิชาการล้วน หรือเหมือน corporate template ทั่วไป
4. ต้องช่วยขาย 4 เรื่องนี้ให้เด่นที่สุด:
   - Problem
   - Solution
   - UI / Dashboard
   - Why this matters
5. ทุกสไลด์ต้องสื่อสาร message หลักเพียง 1 idea

## Visual Direction

ใช้ visual language ที่สอดคล้องกับหน้า UI ของ SHOCKWAVE:

- โทนสีหลัก:
  - warm cream / sand
  - deep charcoal
  - burnt orange
  - dark teal
  - muted gold
- ความรู้สึกโดยรวม:
  - energy intelligence
  - strategic dashboard
  - modern but not flashy
  - premium hackathon prototype

## Typography Direction

- หัวข้อใหญ่: bold, geometric, modern
- เนื้อหา: อ่านง่าย สะอาด
- อย่าใช้ฟอนต์ที่ดูการ์ตูนหรือ casual
- ถ้ามีให้เลือก ให้ใช้สไตล์ใกล้กับ `Space Grotesk` สำหรับ heading และ `IBM Plex Sans` สำหรับ body

## Layout Direction

- ใช้พื้นที่ขาวอย่างตั้งใจ
- แต่ละสไลด์ควรมีจุด focus ชัด
- อย่าใส่ bullet เยอะจนแน่น
- ใช้ card, highlight block, signal line, or flow diagram ได้
- หากมี diagram ให้ใช้แบบเรียบ คม เข้าใจเร็ว

## Imagery Direction

ถ้าจะใส่ภาพประกอบ ให้ใช้ภาพในอารมณ์นี้:

- global energy market signals
- oil / energy flow
- abstract signal propagation
- dashboard intelligence
- map / timeline / lag / system stress

หลีกเลี่ยง:

- stock photo คนจับมือ
- ภาพธุรกิจ generic
- ภาพโรงกลั่นที่ดู cliché เกินไป
- ไอคอนเยอะเกินความจำเป็น

## Tone Of Content

โทนคำต้อง:

- ชัด
- มั่นใจ
- analytical
- ไม่เว่อร์
- ไม่ขายฝันเกินของจริง

ต้องทำให้กรรมการรู้สึกว่า:

- ทีมนี้คิดโจทย์เป็น
- ทีมนี้เล่าเรื่องเป็น
- ทีมนี้ทำของจริงมาแล้ว

## Story Arc

presentation ต้องเล่าเป็นลำดับนี้:

1. Problem: ผลกระทบของ oil shock ไม่ได้มาถึงไทยทันที
2. New Assumption: hidden lag คือสัญญาณเตือนภัย
3. Solution: SHOCKWAVE เปลี่ยน shock ให้เป็น interactive early warning
4. Track A Fit: งานนี้เชื่อม planetary signal สู่ Thai local stress
5. Method: มี time-series workflow จริง ไม่ใช่แค่ dashboard
6. UI: ผู้ใช้ตั้ง scenario และอ่าน critical month ได้ทันที
7. Value: ทำให้ตัดสินใจก่อนผลกระทบจริง
8. Close: SHOCKWAVE คือ decision-support prototype ที่พร้อมเดโมออนไลน์

## UI Slide Guidance

สไลด์ที่พูดเรื่อง UI ต้องทำให้เห็นชัดว่า:

- ซ้ายคือ control panel
- กลางคือ summary + charts
- ล่างคือ monthly forecast table
- flow ของ user คือ:
  `set scenario -> run -> read critical month -> inspect charts -> confirm in table`

ถ้ามี callout บนภาพ UI ให้เน้น:

- Shock Slider
- Horizon Slider
- Run Simulation Button
- Summary Cards
- Import/Diesel Charts
- Forecast Table

## Statistical Validity Slide Guidance

สไลด์ด้าน method ต้องทำให้ผู้ชมเข้าใจเร็วว่า:

- มี `ADF`
- มี `differencing`
- มี `Granger causality`
- มี `VAR`
- มี `IRF`
- มี `time-based holdout backtest`
- มี `MAE / RMSE / MAPE`

อย่าอธิบายยาวแบบวิชาการ  
ให้จัดวางเป็น clean visual process หรือ compact framework

## Closing Slide Guidance

สไลด์ปิดต้องทำให้จำประโยคนี้ได้:

`SHOCKWAVE helps decision-makers act before downstream disruption becomes obvious`

ในภาษาไทยให้คงความหมายว่า:

SHOCKWAVE ช่วยให้ตัดสินใจก่อนผลกระทบจริงจะปรากฏชัด

## Output Requirements

- ทำ presentation 8 slides
- ใช้ภาษาไทย
- แต่อนุญาตคำเทคนิคภาษาอังกฤษได้ เช่น `early warning`, `critical month`, `holdout backtest`
- ทำให้สไลด์พร้อมใช้จริงบนเวที
- อย่าทำให้แต่ละสไลด์ยาวเกินไป

---

# Prompt สั้นแบบบังคับโทน

ถ้าต้องการ prompt สั้นกว่า ให้ใช้ตัวนี้:

สร้างสไลด์ภาษาไทย 8 หน้า สำหรับ pitching โปรเจกต์ `SHOCKWAVE` ในการแข่งขัน `OIL SHOCK Hack! | THAILAND EARTH DAY 2026` โดย framing งานให้อยู่ใน `Track A: Planetary Signals Lab`

โทน presentation ต้องเป็น:

- modern
- premium hackathon pitch
- energy intelligence dashboard
- warm cream + burnt orange + dark teal + charcoal

จุดที่ต้องขายให้เด่น:

- problem: oil shock กระทบไทยแบบ delayed impact
- new assumption: hidden lag คือสัญญาณเตือนภัย
- solution: interactive early-warning dashboard
- UI: set scenario -> run -> read critical month
- statistical validity: ADF, differencing, Granger, VAR, IRF, holdout backtest
- why this matters: ช่วยให้ตัดสินใจก่อนผลกระทบจริง

หลีกเลี่ยง visual ที่ generic หรือ corporate เกินไป  
ทำให้สไลด์ดูคม อ่านเร็ว และเหมาะกับการ present 5 นาที

---

# Prompt สำหรับหน้า UI โดยเฉพาะ

ถ้าจะให้ระบบช่วยออกแบบสไลด์หน้า UI แยก ให้ใช้ prompt นี้:

สร้างสไลด์อธิบาย UI ของโปรเจกต์ `SHOCKWAVE` ให้ดูเข้าใจง่ายและดูเป็น product demo จริง

ต้องเน้นให้เห็นว่า UI มี 3 ส่วน:

- control panel ด้านซ้าย
- summary + charts ตรงกลาง
- forecast table ด้านล่าง

ต้องสื่อ flow ผู้ใช้แบบนี้:

`set scenario -> run -> read summary -> inspect charts -> confirm with monthly table`

สไลด์นี้ต้องดูเหมือน product showcase ไม่ใช่ technical architecture diagram

ใช้ callout ที่ชัด สะอาด และมีคำอธิบายสั้น

---

# Prompt สำหรับหน้าปิด

สร้าง closing slide ภาษาไทยสำหรับโปรเจกต์ `SHOCKWAVE`

เป้าหมายของสไลด์นี้คือให้กรรมการจำ message นี้ได้:

- global oil shock can become a Thai early-warning signal
- hidden lag is the key insight
- SHOCKWAVE helps people act before the disruption becomes obvious

โทนต้องดูมั่นใจ เรียบ คม และไม่เว่อร์
