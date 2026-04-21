# SHOCKWAVE Training Input / Output

## ใช้ไฟล์นี้ทำอะไร

ไฟล์นี้ใช้สำหรับอธิบายงานในมุม data science ว่า

- ตอน train โมเดล เราใส่อะไรเข้าไป
- โมเดลทำอะไรระหว่างทาง
- และสุดท้ายได้อะไรออกมา

เป้าหมายคือทำให้คุณพูดได้เหมือน data science workflow จริง ไม่ใช่แค่พูดว่า "เรา train model"

---

# 1. Training Input

## โมเดลกินข้อมูลอะไร

ไฟล์ input หลักของการ train คือ:

- `ml_engine/shockwave_training_data.csv`

คอลัมน์ที่ใช้จริง:

- `Date`
- `eia_brent_price`
- `eia_natural_gas_price`
- `doeb_import_volume`
- `doeb_diesel_sales`

## ความหมายของแต่ละคอลัมน์

`Date`

- time index รายเดือน

`eia_brent_price`

- upstream global oil signal

`eia_natural_gas_price`

- upstream energy co-signal

`doeb_import_volume`

- downstream Thai operational indicator

`doeb_diesel_sales`

- downstream Thai demand indicator

## ถ้าจะพูดแบบสั้น

"ตัว training input ของเราคือ time-series frame รายเดือน ที่รวม global upstream signals จาก EIA กับ downstream Thai indicators จาก DOEB ไว้ในตารางเดียว"

---

# 2. ขนาดของข้อมูล

จากไฟล์ที่มีอยู่ตอนนี้:

- ช่วงข้อมูลเริ่มต้น: `1997-01-01`
- ช่วงข้อมูลล่าสุด: `2026-03-01`
- จำนวนแถว: `351`

## ถ้าจะพูดบนเวที

"ชุดข้อมูลที่ใช้ train ครอบคลุมข้อมูลรายเดือนตั้งแต่มกราคม 1997 ถึงมีนาคม 2026 รวม 351 แถว"

---

# 3. แหล่งที่มาของ Input

training data ไม่ได้มาจากไฟล์เดียว

มันถูกประกอบขึ้นจาก:

- `EIA Open Data`
  - Brent price
  - Natural gas price
- `DOEB Open Data`
  - import volume
  - diesel sales

ผ่านสคริปต์:

- `ml_engine/01b_generate_mock_doeb_data.py`

## ถ้าจะพูดแบบ data pipeline

"ก่อน train เราจะประกอบ training frame จาก global energy signals และ local Thai indicators ให้อยู่ใน time index เดียวกันก่อน"

---

# 4. Training Process

หลังได้ `shockwave_training_data.csv` แล้ว  
สคริปต์ train คือ:

- `ml_engine/02_train_var_model.py`

สิ่งที่สคริปต์ทำ:

1. โหลด training data
2. ตรวจ stationarity ด้วย `ADF`
3. ทำ differencing ถ้าจำเป็น
4. ทดสอบ `Granger causality`
5. เลือก lag ของ `VAR`
6. fit โมเดล `VAR`
7. ทำ `time-based holdout backtest`
8. สร้าง model artifact และ validation outputs

## ถ้าจะพูดแบบสั้น

"training process ของเราไม่ได้มีแค่ fit model แต่มี preprocessing, causality analysis, lag selection และ holdout backtest ด้วย"

---

# 5. Training Output

## ไฟล์ output หลักจากการ train

หลัง train จะได้ไฟล์หลัก 3 ชุด:

- `ml_engine/shockwave_var_model.pkl`
- `ml_engine/shockwave_backtest_report.json`
- `ml_engine/shockwave_backtest_predictions.csv`

## แต่ละไฟล์คืออะไร

`shockwave_var_model.pkl`

- model artifact หลัก
- ใช้โดย backend runtime
- มี VAR results, lag metadata, stationarity summary, granger summary, backtest report

`shockwave_backtest_report.json`

- สรุปผล validation
- มี `MAE`, `RMSE`, `MAPE`
- ใช้ตอบเรื่องความน่าเชื่อถือของโมเดล

`shockwave_backtest_predictions.csv`

- เก็บ actual vs predicted รายเดือนในช่วง holdout
- ใช้ทำกราฟ validation ได้

---

# 6. Training Input -> Output แบบประโยคเดียว

ถ้าต้องพูดให้คนเข้าใจเร็ว:

"เราเริ่มจาก time-series table รายเดือนที่รวม Brent, natural gas, import volume และ diesel sales จากนั้น train VAR model และปล่อยออกมาเป็นทั้ง model artifact สำหรับ runtime และ backtest outputs สำหรับ validation"

---

# 7. เวอร์ชันสำหรับสไลด์

## หัวข้อ

### Training Input -> Model -> Output

## Input

- Monthly time-series frame
- Brent price
- Natural gas price
- DOEB import volume
- DOEB diesel sales

## Model Process

- ADF
- differencing
- Granger
- VAR
- IRF
- holdout backtest

## Output

- trained model artifact
- backtest report
- actual vs predicted table

---

# 8. เวอร์ชันที่พูดบนเวทีได้เลย

"ในมุม data science เราเริ่มจาก training data รายเดือนที่รวม upstream energy signals จาก EIA และ downstream Thai indicators จาก DOEB จากนั้นผ่าน workflow ที่มีทั้ง ADF, differencing, Granger causality และ VAR fitting สุดท้าย output ที่ได้ไม่ใช่แค่โมเดล แต่รวมถึง backtest report และ prediction trace สำหรับใช้ validate โมเดลด้วย"

---

# 9. ถ้ากรรมการถามว่า input กับ output ของ train คืออะไร

ตอบว่า:

"input ของ train คือ time-series frame รายเดือนที่รวม Brent, natural gas, import volume และ diesel sales ส่วน output คือ trained VAR artifact สำหรับ runtime และ backtest outputs สำหรับดูว่าโมเดล forecast บนช่วง holdout ได้ดีแค่ไหน"
