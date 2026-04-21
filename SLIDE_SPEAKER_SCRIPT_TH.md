# SHOCKWAVE Slide Speaker Script

## Slide 1 - SHOCKWAVE

สวัสดีครับ วันนี้ทีมของเราขอนำเสนอ SHOCKWAVE สำหรับ Track A: Planetary Signals Lab  
โปรเจกต์นี้เป็นระบบเตือนภัยล่วงหน้าที่จำลองการส่งผ่านของ oil shock จากตลาดโลกสู่ระบบพลังงานไทย ผ่าน interactive web dashboard ที่ใช้งานได้จริง

---

## Slide 2 - Problem

ปัญหาที่เราอยากแก้ ไม่ใช่แค่เรื่องราคาน้ำมันขึ้นหรือลง  
แต่คือผลกระทบต่อระบบพลังงานไทยไม่ได้เกิดขึ้นทันที ทำให้ผู้วางแผนมักเห็นความเสี่ยงช้าเกินไป  
ตัวอย่างเช่น ปริมาณการนำเข้าน้ำมันดิบ หรือยอดการใช้น้ำมันดีเซล อาจเริ่มได้รับผลกระทบหลังจากเกิด shock ไปแล้วหลายเดือน

---

## Slide 3 - New Assumption

สมมติฐานใหม่ของเราคือ hidden lag นี้เองสามารถใช้เป็นสัญญาณเตือนภัยได้  
กล่าวคือ global oil shock ไม่ได้กระทบไทยทันที แต่ส่งผ่านด้วยระยะหน่วงเวลาที่ตรวจจับได้จากข้อมูล  
ดังนั้นถ้าเราจับ lag นี้ได้ เราจะเห็นหน้าต่างความเสี่ยงก่อนที่ผลกระทบจริงจะปรากฏชัด

---

## Slide 4 - Why Track A

งานนี้อยู่ใน Track A อย่างชัดเจน เพราะเราใช้แนวคิด planetary signal มองจากข้อมูลพลังงานระดับโลก แล้วเชื่อมมาสู่ local Thai energy stress  
แกนของงานคือ early warning dashboard และวิธีหลักคือ time-series analysis  
ดังนั้นงานนี้จึงเป็นการอนุมานสัญญาณจากข้อมูล ไม่ใช่ policy optimization หรือ long-term future scenario

---

## Slide 5 - Data Sources

ในรอบนี้เราใช้ EIA Open Data เป็น upstream signal เช่น Brent price และ natural gas price  
และใช้ DOEB Open Data เป็น downstream indicator ของไทย เช่น import volume และ diesel sales  
โครงของงานถูกออกแบบให้ต่อยอดกับ OWID และ EPPO ได้ในเฟสถัดไป เพื่อเพิ่มมิติของการอธิบายระบบให้ครบขึ้น

---

## Slide 6 - Methodology

ด้านสถิติ เราไม่ได้ทำเพียงการ plot ข้อมูลย้อนหลัง  
workflow ของเรามีการตรวจ stationarity ด้วย ADF, ทำ differencing เมื่อจำเป็น, ใช้ Granger causality เพื่อดูความสัมพันธ์เชิงเวลา, สร้าง VAR model และใช้ impulse response function เพื่อจำลองการส่งผ่านของ shock  
ดังนั้นตัว dashboard จึงผูกอยู่กับโมเดลวิเคราะห์จริง ไม่ใช่แค่ visualization

---

## Slide 7 - System Architecture

เราออกแบบงานนี้ให้ไปไกลกว่า notebook  
มีทั้ง ML pipeline สำหรับเตรียมข้อมูลและ train model, FastAPI backend สำหรับ expose simulation API, web dashboard สำหรับ interaction และ deployment path สำหรับ online demo  
แนวคิดสำคัญคือ model ไม่ได้จบอยู่ในเครื่องนักพัฒนา แต่ถูกยกขึ้นมาเป็นระบบที่ทดลองใช้งานได้จริง

---

## Slide 8 - Interactive Dashboard

ในส่วนของ dashboard ผู้ใช้สามารถปรับขนาด shock ของ Brent และกำหนด forecast horizon ได้  
เมื่อกด run ระบบจะเรียก backend เพื่อคำนวณผลใหม่ทันที  
จากนั้นผู้ใช้จะเห็น baseline forecast, shocked forecast, critical month และผลกระทบของ import volume กับ diesel sales ในรูปแบบกราฟและตาราง

---

## Slide 9 - Example Insight

สิ่งที่สำคัญไม่ใช่แค่ดูว่าเส้นกราฟลดลงเท่าไร  
แต่คือดูว่า baseline กับ shocked path เริ่มแยกจากกันเมื่อไร เพราะนั่นคือช่วงที่ shock เริ่มส่งผ่านสู่ระบบพลังงานไทยอย่างมีนัยสำคัญ  
critical month จึงตีความได้ว่าเป็นหน้าต่างเตือนภัยที่ควรเฝ้าระวังเป็นพิเศษ

---

## Slide 10 - Competition Fit

ถ้ามองตามเกณฑ์กรรมการ งานนี้ตอบทั้ง 5 ส่วน  
ความใหม่อยู่ที่การมอง hidden lag เป็นสัญญาณ  
ความถูกต้องทางสถิติอยู่ที่กระบวนการ ADF, differencing, Granger, VAR และ IRF  
dashboard เป็น interactive web dashboard จริง  
การสื่อสารถูกออกแบบให้เล่า problem ไปจนถึง impact ได้ชัด  
และในแง่ theme alignment งานนี้ตรงกับ Track A โดยตรง

---

## Slide 11 - Current Limitations

เราตอบตรง ๆ ว่างานนี้ยังเป็น prototype  
ตอนนี้แกนหลักสำเร็จในส่วนของ lag-aware time-series early warning แล้ว  
แต่ probabilistic layer, anomaly detection layer และ feature จาก OWID หรือ EPPO ยังเป็นพื้นที่ต่อยอดในเฟสถัดไป  
อย่างไรก็ตาม ระบบปัจจุบันใช้งาน demo online ได้จริง และมี fallback mode สำหรับความเสถียร

---

## Slide 12 - Closing

สรุปคือ SHOCKWAVE เป็น interactive early-warning dashboard ที่ใช้ time-series modeling เพื่อจับ hidden lag ระหว่าง oil shock ระดับโลกกับผลกระทบต่อระบบพลังงานไทย  
เป้าหมายของเราไม่ใช่แค่บอกว่า shock เกิดขึ้นหรือไม่  
แต่คือช่วยให้ผู้วางแผนเห็นความเสี่ยงก่อนที่ผลกระทบจะเกิดจริง  
ขอบคุณครับ

---

## Timing Guide

- Slide 1: 15 วินาที
- Slide 2: 25 วินาที
- Slide 3: 25 วินาที
- Slide 4: 20 วินาที
- Slide 5: 20 วินาที
- Slide 6: 35 วินาที
- Slide 7: 20 วินาที
- Slide 8: 35 วินาที
- Slide 9: 25 วินาที
- Slide 10: 30 วินาที
- Slide 11: 20 วินาที
- Slide 12: 20 วินาที

รวมประมาณ 4 นาที 10 วินาที ถึง 4 นาที 30 วินาที  
เหลือเวลาเผื่อสำหรับหยุดหายใจ เปลี่ยนสไลด์ และชี้ dashboard จริง
