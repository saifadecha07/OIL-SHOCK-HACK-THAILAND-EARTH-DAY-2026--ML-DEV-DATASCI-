# SHOCKWAVE
## Track A: Planetary Signals Lab

Interactive early-warning dashboard สำหรับจำลองการส่งผ่านของ oil shock จากตลาดโลกสู่ระบบพลังงานไทย

---

# 1. Problem

## ปัญหาไม่ใช่แค่น้ำมันแพง

ปัญหาจริงคือผลกระทบต่อระบบพลังงานไทยไม่ได้เกิดขึ้นทันที

สิ่งที่ผู้วางแผนพลาดบ่อยคือ:

- shock เกิดที่ต้นน้ำก่อน
- แต่ผลกระทบปลายน้ำในไทยค่อย ๆ ปรากฏทีหลัง
- พอเห็นชัด ก็มักช้าเกินไป

---

# 2. New Assumption

## Hidden Lag คือสัญญาณเตือนภัย

สมมติฐานใหม่ของเรา:

`global oil shock -> hidden lag -> downstream Thai energy stress`

ถ้าเราจับ lag นี้ได้  
เราจะเห็นหน้าต่างความเสี่ยงก่อนผลกระทบจริงเกิดขึ้น

---

# 3. Solution

## SHOCKWAVE เปลี่ยน shock ให้เป็น early warning

ผู้ใช้สามารถ:

- ตั้ง `% Brent shock`
- ตั้ง `forecast horizon`
- กด run simulation

ระบบจะแสดง:

- baseline vs shocked forecast
- critical month
- ขนาดผลกระทบของ import volume และ diesel sales

---

# 4. Why Track A

## งานนี้ตรงกับ Planetary Signals Lab

เพราะเราเชื่อม:

- `EIA Open Data` เป็น global signal
- `DOEB Open Data` เป็น Thai downstream indicator
- `time-series analysis` เป็นวิธีหลัก
- `interactive dashboard` เป็น output สำหรับ early warning

---

# 5. Method And Validation

## ไม่ได้มีแค่กราฟ แต่มี statistical workflow

เราใช้:

- `ADF`
- `differencing`
- `Granger causality`
- `VAR`
- `IRF`
- `time-based holdout backtest`

และวัดผลด้วย:

- `MAE`
- `RMSE`
- `MAPE`

---

# 6. UI And Demo Flow

## Flow ของหน้าจอถูกออกแบบให้เข้าใจเร็ว

หน้า UI แบ่งเป็น 3 ส่วน:

- ซ้าย: ตั้ง scenario
- กลาง: ดู summary และกราฟ
- ล่าง: ดู forecast table รายเดือน

Flow การใช้งาน:

`set scenario -> run -> read critical month -> inspect charts -> confirm in table`

---

# 7. Why It Matters

## จาก planetary signal สู่การตัดสินใจในไทย

SHOCKWAVE ช่วยให้:

- เห็นความเสี่ยงก่อนผลกระทบจริง
- ใช้ scenario planning ได้
- อ่านช่วงเวลาเสี่ยงผ่าน critical month
- สื่อสารผลกระทบให้ทีมตัดสินใจเข้าใจตรงกัน

---

# 8. Closing

## Final Message

SHOCKWAVE ไม่ได้พยายามตอบแค่ว่าน้ำมันจะขึ้นหรือไม่

แต่มันพยายามตอบว่า:

- ผลกระทบจะมาถึงไทยเมื่อไร
- ช่วงไหนคือหน้าต่างเสี่ยง
- และเราจะตัดสินใจก่อนผลกระทบจริงได้อย่างไร

---

# 9. Validation

## Time-Based Holdout Backtest

เราไม่ได้ train โมเดลบนข้อมูลทั้งหมดอย่างเดียว

แต่กันช่วงท้ายของข้อมูลไว้เป็น holdout window แล้วทดสอบ one-step-ahead forecast

Test window:

- `มกราคม 2026 - มีนาคม 2026`
- `3 backtest steps`

ผลสรุป:

### DOEB Import Volume

- `MAE = 2.7801`
- `RMSE = 3.0557`
- `MAPE = 2.954%`

### DOEB Diesel Sales

- `MAE = 1.1174`
- `RMSE = 1.4241`
- `MAPE = 1.2043%`

ดังนั้นตัว dashboard นี้จึงไม่ได้มีแค่โมเดลที่ train แล้วจบ  
แต่มี holdout validation รองรับในระดับ prototype แล้ว
