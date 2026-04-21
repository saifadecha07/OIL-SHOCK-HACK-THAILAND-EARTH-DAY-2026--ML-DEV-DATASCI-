# SHOCKWAVE
## Track A: Planetary Signals Lab

ระบบเตือนภัยล่วงหน้าที่จำลองการส่งผ่านของ oil shock จากตลาดโลกสู่ระบบพลังงานไทย

---

# 1. Problem

## ปัญหาไม่ได้อยู่แค่ "ราคาน้ำมันขึ้น"

ปัญหาจริงคือผลกระทบต่อระบบพลังงานไทยไม่ได้เกิดทันที  
ผู้วางแผนจึงมักเห็นความเสี่ยงช้าเกินไป

ตัวอย่างผลกระทบปลายน้ำที่ต้องจับตา:

- ปริมาณการนำเข้าน้ำมันดิบ
- ยอดการใช้น้ำมันดีเซล
- ช่วงเวลาที่ความเครียดของระบบเริ่มปรากฏชัด

---

# 2. New Assumption

## Hidden Lag คือสัญญาณเตือนภัย

สมมติฐานใหม่ของเรา:

`global oil shock ไม่ได้กระทบไทยทันที แต่ส่งผ่านด้วย hidden lag ที่ตรวจจับได้จากข้อมูล`

ดังนั้น ถ้าเราจับ lag นี้ได้  
เราจะเห็นหน้าต่างความเสี่ยงก่อนผลกระทบจริงเกิดขึ้น

นี่คือหัวใจของ SHOCKWAVE

---

# 3. Why Track A

## งานนี้สอดคล้องกับ Planetary Signals Lab โดยตรง

เราเชื่อม:

- `EIA Open Data` เป็น global upstream signal
- `DOEB Open Data` เป็น local Thai downstream indicator
- แนวคิดของงานเป็น `early warning dashboard`
- วิธีหลักเป็น `time-series analysis`

โจทย์ของเราคือ:

`planetary signal -> local Thai energy stress`

---

# 4. Data Sources

## ชุดข้อมูลที่ใช้ในงาน

- `EIA Open Data`
  - Brent price
  - Natural gas price
- `DOEB Open Data`
  - Import volume
  - Diesel sales

โครงงานถูกออกแบบให้ต่อยอดกับ:

- `OWID Energy Dataset`
- `EPPO Energy Statistics`

---

# 5. Methodology

## Time-Series Workflow

SHOCKWAVE ไม่ได้เป็นแค่ dashboard สวย  
แต่มี statistical workflow รองรับอยู่ด้านหลัง

ขั้นตอนหลัก:

1. ตรวจ stationarity ด้วย `ADF`
2. ทำ `differencing` เมื่อจำเป็น
3. ทดสอบความสัมพันธ์เชิงเวลาด้วย `Granger causality`
4. สร้าง `VAR model`
5. จำลอง shock transmission ด้วย `Impulse Response Function`
6. ทำ `time-based holdout backtest` และรายงาน `MAE / RMSE / MAPE`

---

# 6. System Architecture

## จากโมเดลสู่การใช้งานจริง

ระบบนี้ถูกยกระดับจาก notebook ไปเป็น product prototype

- `ML pipeline` สำหรับสร้าง training data และ train model
- `FastAPI backend` สำหรับ simulation API
- `Interactive web dashboard` สำหรับผู้ใช้
- `Dockerized deployment` สำหรับ online demo

แนวคิดสำคัญ:

`model -> API -> dashboard -> live interaction`

---

# 7. Interactive Dashboard

## ผู้ใช้ทดลอง scenario ได้จริง

ผู้ใช้สามารถ:

- ปรับ `% shock` ของ Brent
- ปรับ `forecast horizon`
- กด `Run Simulation`
- ดู baseline vs shocked forecast ได้ทันที

ผลลัพธ์ที่เห็น:

- กราฟเปรียบเทียบ
- ตาราง forecast
- critical month
- ขนาดผลกระทบของ import volume และ diesel sales

---

# 8. Example Insight

## สิ่งที่ dashboard ช่วยให้เห็น

สิ่งสำคัญไม่ใช่แค่เส้นกราฟลดลง

แต่คือ:

- baseline กับ shocked path เริ่มแยกจากกันเมื่อไร
- เดือนใดคือ `critical month`
- ช่วงเวลาใดคือหน้าต่างเตือนภัยที่ควรเฝ้าระวัง

ดังนั้น SHOCKWAVE ไม่ได้ตอบแค่ว่า "shock เกิดไหม"  
แต่ตอบว่า "shock จะเริ่มส่งผลเมื่อไร และหนักแค่ไหน"

---

# 9. Competition Fit

## เราตอบเกณฑ์กรรมการอย่างไร

### New Assumption 25%
เรามอง `hidden lag` เป็นสัญญาณใหม่ ไม่ใช่ดูแค่ระดับราคา

### Statistical Validity 25%
เราใช้ ADF, differencing, Granger, VAR, IRF และ holdout backtest

### Interactive Web Dashboard 20%
dashboard online ใช้งานจริงและโต้ตอบได้

### Presentation and Communication 15%
เล่า problem -> method -> demo -> impact อย่างตรงประเด็น

### Theme Alignment 15%
งานนี้เป็น early warning system สำหรับ Track A โดยตรง

---

# 10. Why It Matters

## จากข้อมูลโลก สู่การตัดสินใจในบริบทไทย

SHOCKWAVE ช่วยให้:

- เห็นความเสี่ยงก่อนผลกระทบจริง
- ใช้ scenario planning ได้
- สื่อสารผลกระทบให้ทีมวางแผนเข้าใจตรงกัน

คุณค่าของงานนี้คือการเปลี่ยน oil shock ระดับโลก  
ให้กลายเป็นสัญญาณเตือนภัยที่อ่านออกในระบบพลังงานไทย

---

# 11. Current Limitations

## สิ่งที่เราตอบตรง ๆ

- ปัจจุบันยังเป็น `prototype`
- feature จาก `OWID` และ `EPPO` ยังต่อยอดได้อีก
- probabilistic layer และ anomaly layer ยังเป็น roadmap ถัดไป
- ขณะนี้มี holdout backtest แล้ว แต่ยังไม่ใช่ production-grade validation ครบทุกมิติ
- หากไม่มี trained artifact ระบบสามารถ fallback เป็น mock mode เพื่อเดโมได้

---

# 12. Closing

## Final Message

SHOCKWAVE คือ interactive early-warning dashboard  
ที่ใช้ time-series modeling เพื่อจับ hidden lag  
ระหว่าง oil shock ระดับโลกกับผลกระทบต่อระบบพลังงานไทย

เป้าหมายของเราไม่ใช่แค่บอกว่า shock เกิดขึ้นหรือไม่  
แต่คือช่วยให้ตัดสินใจได้ก่อนที่ผลกระทบจะเกิดจริง
