# SHOCKWAVE Live Pitch Script 5 Minutes

## 0:00 - 0:30 Opening

สวัสดีครับ วันนี้ทีมของเราขอนำเสนอ `SHOCKWAVE` สำหรับ `Track A: Planetary Signals Lab`

โจทย์ที่เราต้องการแก้คือ เมื่อเกิด oil shock ระดับโลก ผลกระทบต่อระบบพลังงานไทยไม่ได้เกิดทันที แต่ค่อย ๆ ส่งผ่านมาด้วยระยะหน่วงเวลา ทำให้ผู้วางแผนมักเห็นความเสี่ยงช้าเกินไป

## 0:30 - 1:00 New Assumption

สมมติฐานใหม่ของเราคือ `hidden lag` นี้เองสามารถใช้เป็นสัญญาณเตือนภัยล่วงหน้าได้

ดังนั้น แทนที่จะถามแค่ว่าราคาน้ำมันขึ้นหรือไม่ เราถามว่า หาก shock เกิดขึ้นวันนี้ ผลกระทบในไทยจะเริ่มชัดเมื่อไร และช่วงไหนคือหน้าต่างเวลาที่ควรเฝ้าระวังมากที่สุด

## 1:00 - 2:00 Data And Method

งานนี้ใช้ข้อมูลที่สอดคล้องกับ Track A โดยยึดแกนจาก `EIA Open Data` และ `DOEB Open Data` และออกแบบให้ต่อยอดกับ `OWID` และ `EPPO` ได้

ในเชิงสถิติ เราใช้ time-series workflow ที่ประกอบด้วย:

- การตรวจ stationarity ด้วย ADF
- การทำ differencing เมื่อจำเป็น
- การทดสอบ Granger causality
- การสร้าง multivariate VAR model
- การใช้ impulse response เพื่อจำลอง shock transmission

สิ่งสำคัญคือเราไม่ได้แค่พล็อตข้อมูลย้อนหลัง แต่ยกโมเดลขึ้นมาเป็นระบบจำลองสถานการณ์ที่ใช้งานได้จริง

## 2:00 - 3:30 Demo

นี่คือหน้า dashboard ของ SHOCKWAVE

ผู้ใช้สามารถกำหนด:

- ขนาด shock ของ Brent
- จำนวนเดือนที่ต้องการ forecast

เมื่อกด run ระบบจะเรียก backend เพื่อคำนวณผลใหม่ แล้วแสดง:

- baseline forecast
- shocked forecast
- critical month
- ขนาดผลกระทบของ import volume และ diesel sales

สิ่งที่อยากให้ดูคือช่วงที่เส้น baseline กับ shocked forecast เริ่มแยกออกจากกัน เพราะนั่นคือจุดที่ shock เริ่มส่งผ่านสู่ระบบพลังงานไทยอย่างมีนัยสำคัญ

## 3:30 - 4:30 Why It Matters

คุณค่าของ SHOCKWAVE คือการเปลี่ยน planetary signal ให้กลายเป็น local early warning

แทนที่ผู้ใช้จะรอให้ตัวเลขปลายน้ำเสียก่อน เราสามารถเห็นหน้าต่างความเสี่ยงล่วงหน้า และใช้ dashboard นี้เพื่อสื่อสารผลกระทบให้ทีมวางแผน, operations, หรือ policy เข้าใจตรงกันได้ทันที

## 4:30 - 5:00 Close

สรุปคือ SHOCKWAVE เป็น interactive early-warning dashboard สำหรับ Track A ที่ใช้ time-series modeling เพื่อจับ hidden lag ระหว่าง oil shock ระดับโลกกับผลกระทบต่อระบบพลังงานไทย

เป้าหมายของเราไม่ใช่แค่บอกว่า shock เกิดขึ้นหรือไม่ แต่คือช่วยให้ตัดสินใจได้ก่อนที่ผลกระทบจะเกิดจริง

ขอบคุณครับ
