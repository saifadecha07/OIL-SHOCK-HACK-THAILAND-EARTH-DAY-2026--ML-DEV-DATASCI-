# SHOCKWAVE Pitching Brief

## Event Context

- งาน: `OIL SHOCK Hack! | THAILAND EARTH DAY 2026`
- วันแข่ง: `22 เมษายน 2569`
- เวลาเข้า ZOOM: `07:30 น. (ICT / UTC+7)`
- รูปแบบแข่ง: `Present 5 นาที + Q&A 7 นาที`
- ข้อกำหนดสำคัญ: ต้องเปิด `Interactive Web Dashboard` แบบออนไลน์ได้จริง และต้องส่งลิงก์เว็บลงแชต ZOOM ตอนถึงคิว

## Track Positioning

โปรเจกต์นี้ควรวางตัวชัด ๆ ว่าอยู่ใน `Track A: Planetary Signals Lab`

เหตุผล:

- ใช้แกนข้อมูลจาก `EIA Open Data` และ `DOEB Open Data` อยู่แล้ว
- narrative ของงานคือ `early warning system`
- วิธีหลักเป็น `time-series analysis`
- use case คือการอนุมานสัญญาณผลกระทบสิ่งแวดล้อมและพลังงานจาก shock ระดับโลกสู่บริบทไทย

เวลาพูด อย่าเผลอเล่าเหมือน Track B หรือ Track C

- อย่าเน้น policy optimization
- อย่าเน้น subsidies หรือ household resilience
- อย่าเน้น post-oil future scenarios ระยะยาว

ให้เน้นคำนี้แทน:

`ระบบเตือนภัยล่วงหน้าสำหรับการส่งผ่านความเสี่ยงด้านพลังงานจากตลาดโลกสู่ระบบพลังงานไทย`

## One-liner

SHOCKWAVE คือ interactive early-warning dashboard ที่ใช้ time-series modeling เพื่อจำลองว่าเมื่อราคาพลังงานโลกเกิด shock แล้ว ผลกระทบจะส่งผ่านมายังตัวชี้วัดพลังงานของไทยเมื่อไร หนักแค่ไหน และควรจับตาช่วงเวลาใดเป็นพิเศษ

## Core Hypothesis

สมมติฐานหลักที่ควรย้ำบนเวที:

`ราคาน้ำมันโลกไม่ได้สร้างผลกระทบต่อระบบพลังงานไทยแบบทันที แต่ส่งผ่านด้วย hidden lag ที่ตรวจจับได้จากข้อมูล และ lag นี้สามารถใช้เป็นสัญญาณเตือนภัยล่วงหน้าได้`

จุดนี้สำคัญมาก เพราะมันคือหัวใจของ `New Assumption 25%`

## Problem

ปัญหาที่เราแก้ไม่ใช่แค่ "ราคาน้ำมันขึ้น"

ปัญหาคือผู้มีส่วนตัดสินใจมักเห็นผลกระทบช้าเกินไป เพราะผลกระทบในประเทศไม่ได้เกิดพร้อมกับเหตุการณ์ระดับโลก

ดังนั้นช่องว่างที่ SHOCKWAVE เข้ามาเติมคือ:

- ตรวจจับ `delayed transmission`
- แปลง shock ระดับโลกให้เป็นสัญญาณเสี่ยงในบริบทไทย
- ทำให้ทีมวางแผนเห็นหน้าต่างเวลาเสี่ยงก่อนผลกระทบจริงเกิดขึ้น

## What The System Does

ผู้ใช้กำหนด:

- เปอร์เซ็นต์ shock ของ Brent
- ระยะเวลา forecast

ระบบตอบกลับ:

- baseline forecast
- shocked forecast
- เดือนที่ผลกระทบหนักสุด
- ขนาดการลดลงของ import volume และ diesel sales
- ภาพกราฟและตารางที่อธิบายผลกระทบได้ทันที

## Why This Fits Track A

งานนี้สอดคล้องกับ Track A ตรง ๆ เพราะ:

- โฟกัสการอนุมานสัญญาณจากข้อมูลพลังงาน
- ใช้ time-series analysis เป็นวิธีหลัก
- วางผลลัพธ์เป็น early warning dashboard
- เชื่อม global energy signal กับ local Thai energy indicators

ภาษาที่ควรใช้:

- `planetary signal to local stress`
- `lag-aware early warning`
- `environmental-energy signal propagation`

## Judge-Aligned Framing

### 1. New Assumption 25%

สิ่งที่ต้องขายคือ:

- shock จากตลาดโลกไม่ได้กระทบไทยทันที
- lag เองคือสัญญาณที่มีความหมาย
- ถ้าเราวัด lag ได้ เราจะสร้างระบบเตือนภัยล่วงหน้าได้

ประโยคที่ใช้ได้:

"ความใหม่ของเราคือเราไม่ได้มองแค่ระดับราคาหรือแนวโน้ม แต่เรามอง hidden lag เป็นตัวแปรสัญญาณ ซึ่งทำให้ระบบเห็นความเสี่ยงก่อนที่ตัวเลขปลายน้ำจะเสียรูปชัดเจน"

### 2. Statistical Validity 25%

สิ่งที่พูดได้จาก implementation จริง:

- ใช้ `ADF test` ตรวจ stationarity
- ทำ differencing เมื่อจำเป็น
- ใช้ `Granger causality` เพื่อตรวจความสัมพันธ์เชิงเวลา
- ใช้ `VAR` เพื่อ model ความสัมพันธ์หลายตัวแปรพร้อมกัน
- ใช้ `IRF` เพื่อจำลองการส่งผ่านของ shock ตามเวลา
- มี `time-based holdout backtest` บนช่วงท้ายของข้อมูล
- สรุป error metric ด้วย `MAE`, `RMSE`, `MAPE` สำหรับตัวแปรเป้าหมาย

ประโยคที่ใช้ได้:

"เราไม่ได้ใส่ shock แบบกราฟสวยอย่างเดียว แต่ผ่านกระบวนการตรวจ stationarity, lag selection, causality testing, holdout backtesting และจำลองผลกระทบด้วย impulse response บนโมเดล VAR"

### 3. Interactive Web Dashboard 20%

สิ่งที่ต้องโชว์:

- ปรับ shock ได้
- ปรับ forecast horizon ได้
- กด run แล้วผลเปลี่ยนจริง
- มีทั้งกราฟและตาราง
- layout อ่านง่ายและตีความผลได้เร็ว

### 4. Presentation and Communication 15%

กลยุทธ์คือ:

- เปิดด้วย problem ที่เข้าใจง่าย
- ดันสมมติฐานใหม่ให้ชัดใน 30-45 วินาทีแรก
- โชว์ dashboard เร็ว
- ไม่อธิบายคณิตศาสตร์ยาวเกิน 1 นาที
- เก็บเวลาไว้สำหรับผลลัพธ์และ impact

### 5. Theme Alignment 15%

ให้พูดคำว่า `Track A`, `early warning`, `time-series`, `signal`, `Thailand energy system` ซ้ำแบบมีเจตนา

กรรมการต้องไม่มีช่องให้สงสัยว่าเราไปผิด track

## Demo Flow For 5 Minutes

1. เปิดด้วยโจทย์ 30 วินาที
2. พูดสมมติฐานใหม่ 30 วินาที
3. อธิบาย data + method 60 วินาที
4. เดโม dashboard 90 วินาที
5. สรุปผลลัพธ์และคุณค่า 60 วินาที
6. ปิดด้วย why this matters 30 วินาที

## What To Say During Demo

ตอนเลื่อน slider:

"ตอนนี้เรากำลังจำลอง upstream Brent shock และดูว่าความเครียดจะค่อย ๆ ถูกส่งผ่านไปยังระบบพลังงานไทยในอีกหลายเดือนถัดมาอย่างไร"

ตอนกราฟขึ้น:

"สิ่งที่อยากให้ดูไม่ใช่แค่เส้นตกลง แต่คือช่วงเวลาที่ baseline กับ shocked path เริ่มแยกจากกัน เพราะนั่นคือหน้าต่างเตือนภัย"

ตอนชี้ KPI:

"critical month คือเดือนที่ผลกระทบเด่นที่สุด ซึ่งในมุมใช้งานจริง นี่คือช่วงเวลาที่ควรถูกยกระดับการเฝ้าระวัง"

## Honest But Strong

ถ้ากรรมการถามว่าพร้อม production ไหม ให้ตอบแบบนี้:

"ตอนนี้เป็น production-minded prototype คือระบบใช้งานออนไลน์ได้จริง มี API มี dashboard มี deployment path และมีโมเดลจำลองครบ แต่ในเฟสถัดไปจะเพิ่ม historical validation, richer features จาก EPPO/OWID และ persistence ของ simulation history"

## Closing Line

"SHOCKWAVE เปลี่ยน oil shock ระดับโลกให้กลายเป็นสัญญาณเตือนภัยที่อ่านออกในบริบทไทย เพื่อให้การตัดสินใจเกิดก่อนผลกระทบ ไม่ใช่หลังผลกระทบ"
