# Backtest Slide

## หัวข้อสไลด์

### Model Validation: Time-Based Holdout Backtest

## ข้อความหลักบนสไลด์

เราไม่ได้ train โมเดลบนข้อมูลทั้งหมดอย่างเดียว  
แต่กันช่วงท้ายของข้อมูลไว้เป็น holdout window แล้วทดสอบ one-step-ahead forecast เพื่อดูว่าโมเดลยังรักษาสัญญาณได้หรือไม่ในข้อมูลที่ไม่ได้ใช้ train

## ช่วงทดสอบ

- Test window: `มกราคม 2026 - มีนาคม 2026`
- Backtest steps: `3 เดือน`
- วิธี: `time-based holdout backtest`

## Metric หลัก

### DOEB Import Volume

- `MAE = 2.7801`
- `RMSE = 3.0557`
- `MAPE = 2.954%`

### DOEB Diesel Sales

- `MAE = 1.1174`
- `RMSE = 1.4241`
- `MAPE = 1.2043%`

## ข้อความอธิบายใต้กราฟ / ใต้ metric

ผล backtest แสดงให้เห็นว่าโมเดลไม่ได้แค่ fit ข้อมูลในอดีต  
แต่ยังสามารถ forecast ช่วงท้ายของข้อมูลด้วย error ในระดับต่ำสำหรับตัวแปรเป้าหมายหลัก โดยเฉพาะ diesel sales ที่มี MAPE ประมาณ `1.20%`

## ประโยคพูดบนเวที

"เพื่อให้โมเดลน่าเชื่อถือมากกว่าการ train ทั้งชุด เราแยกช่วงท้ายของข้อมูลไว้เป็น holdout window แล้วทำ one-step-ahead backtest ผลคือ import volume มี MAPE ประมาณ 2.95% และ diesel sales มี MAPE ประมาณ 1.20%"

## ถ้าจะวางเป็น layout ในสไลด์

ฝั่งซ้าย:

- อธิบายวิธี backtest สั้น ๆ
- ช่วงเวลา test window

ฝั่งขวา:

- metric card 2 ชุด
- Import Volume
- Diesel Sales

ด้านล่าง:

- ข้อความสรุป 1 บรรทัดว่าโมเดลมี holdout validation แล้ว

## ข้อควรระวังเวลา present

- อย่าพูดว่า "แม่นยำมาก" โดยไม่มีบริบท
- ให้พูดว่าเป็น `first validation layer`
- ถ้ากรรมการถามต่อ ให้บอกว่า backtest ตอนนี้เป็น prototype validation และสามารถขยายเป็น longer rolling backtest ได้ใน phase ถัดไป
