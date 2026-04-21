# SHOCKWAVE Backtest Readout

## ไฟล์นี้ใช้ทำอะไร

ไฟล์นี้ใช้เป็นสคริปต์สั้น ๆ สำหรับอธิบายกับกรรมการว่าโมเดลของ SHOCKWAVE ไม่ได้มีแค่การ train แต่มี `holdout backtest` สำหรับดู error บนช่วงท้ายของข้อมูลด้วย

ไฟล์ผลลัพธ์ที่เกี่ยวข้อง:

- `ml_engine/shockwave_backtest_report.json`
- `ml_engine/shockwave_backtest_predictions.csv`

## สิ่งที่เพิ่มเข้ามาใน pipeline

ตอนนี้ training pipeline ของเราทำมากกว่า fit โมเดลบนข้อมูลทั้งหมด

มันจะ:

1. กันช่วงท้ายของข้อมูลไว้เป็น holdout window
2. train บนข้อมูลก่อนหน้า
3. forecast ทีละ 1 ก้าวไปยังเดือนถัดไป
4. เทียบค่าทำนายกับค่าจริง
5. สรุป error metric สำหรับตัวแปรเป้าหมาย

## Metric ที่ใช้

เราใช้:

- `MAE`
- `RMSE`
- `MAPE`

กับตัวแปรหลัก:

- `doeb_import_volume`
- `doeb_diesel_sales`

## วิธีพูดบนเวที

ถ้าต้องอธิบายสั้น ๆ:

"นอกจากการ train โมเดลแล้ว เราเพิ่ม time-based holdout backtest เพื่อทดสอบบนช่วงท้ายของข้อมูล โดยวัด error ด้วย MAE, RMSE และ MAPE สำหรับ import volume และ diesel sales"

## วิธีพูดตอนโดนถามเรื่องความน่าเชื่อถือ

"เราพยายามไม่ให้โมเดลจบแค่การ fit ทั้ง dataset ดังนั้นจึงแยกช่วงท้ายของข้อมูลไว้เป็น holdout และประเมิน one-step-ahead forecast error เพื่อดูว่าโมเดลยังรักษาสัญญาณได้ในข้อมูลที่ไม่ได้ใช้ train หรือไม่"

## วิธีพูดแบบตรงไปตรงมา

"backtest ที่มีตอนนี้เป็น validation ชั้นแรกของ prototype ไม่ใช่ production-grade model governance เต็มรูปแบบ แต่ช่วยให้เรามีหลักฐานมากกว่าการ train ทั้งชุดอย่างเดียว"

## เวลาอ่านผล

แนวทางการอ่าน:

- `MAE` ดู error เฉลี่ยในหน่วยจริง
- `RMSE` ใช้ดูว่ามีความผิดพลาดแรง ๆ กระจุกอยู่หรือไม่
- `MAPE` ใช้สื่อสาร error ในเชิงสัดส่วนให้คนทั่วไปเข้าใจง่ายขึ้น

## ถ้าค่า metric ยังไม่สวยมาก ควรตอบยังไง

"เพราะนี่เป็น competition prototype จุดประสงค์หลักของเราในรอบนี้คือพิสูจน์ hidden lag hypothesis และยกระดับขึ้นเป็น interactive early-warning system ส่วนการ optimize predictive performance ให้ดีขึ้นอีกจะเป็นเฟสถัดไป"

## ข้อควรระวังเวลาพูด

- อย่าอ้างว่าโมเดลแม่นสูง ถ้ายังไม่ได้เปิดดูค่าจริงใน report
- อย่าอ้างว่าเป็น production-ready validation
- ให้พูดว่าเป็น `holdout backtest` และ `first validation layer`
- ถ้าระหว่าง data generation ใช้ synthetic fallback ต้องบอกตรง ๆ
