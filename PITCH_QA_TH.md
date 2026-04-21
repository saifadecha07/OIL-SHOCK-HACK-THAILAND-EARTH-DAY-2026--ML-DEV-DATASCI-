# SHOCKWAVE Pitch Q&A

## Q: โปรเจกต์นี้อยู่ Track ไหน และทำไมถึงอยู่ Track นี้?

อยู่ `Track A: Planetary Signals Lab` เพราะงานนี้ใช้ time-series analysis เพื่ออนุมานสัญญาณเตือนภัยล่วงหน้าจากข้อมูลพลังงานระดับโลกและข้อมูลพลังงานไทย ไม่ได้เน้น policy optimization แบบ Track B และไม่ได้เน้น long-term post-oil futures แบบ Track C

## Q: ความใหม่ของสมมติฐานคืออะไร?

ความใหม่คือเราไม่ได้สมมติแค่ว่า "ราคาน้ำมันขึ้นแล้วไทยกระทบ" แต่สมมติว่า `hidden lag` ระหว่าง global shock กับ local impact เป็นสัญญาณที่ตรวจจับและใช้งานเป็น early warning ได้

## Q: ทำไม hidden lag ถึงสำคัญ?

เพราะถ้าผลกระทบไม่ได้เกิดทันที การดูข้อมูลปลายน้ำอย่างเดียวจะช้าเกินไป แต่ถ้ารู้ว่า shock จะถูกส่งผ่านเมื่อไร เราจะมองเห็นหน้าต่างความเสี่ยงล่วงหน้าได้

## Q: ใช้วิธีทางสถิติอะไรบ้าง?

ใน implementation ปัจจุบันมี `ADF test` สำหรับ stationarity, `differencing` เมื่อจำเป็น, `Granger causality` เพื่อดูความสัมพันธ์เชิงเวลา, `VAR` สำหรับ multivariate time-series, `IRF` เพื่อจำลองการส่งผ่านของ shock และ `time-based holdout backtest` เพื่อดู error บนช่วงท้ายของข้อมูล

## Q: ทำไมเลือก VAR?

เพราะโจทย์นี้ต้อง model หลายตัวแปรพร้อมกัน เช่น Brent, natural gas, import volume, และ diesel sales และต้องเห็นผลกระทบแบบ lagged transmission ไม่ใช่ดูตัวแปรเดียวแยกขาดจากกัน

## Q: dashboard นี้ interactive จริงอย่างไร?

ผู้ใช้ปรับ shock percentage และ forecast horizon ได้ จากนั้นระบบคำนวณผลใหม่ผ่าน backend จริง แล้วแสดงกราฟกับตารางใหม่ทันที ไม่ใช่ภาพนิ่งหรือ slide mockup

## Q: ถ้า trained model ยังไม่พร้อม ระบบจะเดโมได้ไหม?

ได้ เพราะ backend มี mock fallback mode เพื่อให้ web dashboard และ API ยังทำงานต่อได้ในเดโมหรือ integration testing

## Q: ผลงานนี้สอดคล้องกับธีมยังไง?

มันเชื่อม `planetary signal` จากตลาดพลังงานโลกเข้ากับ `local Thai energy stress` และแปลงเป็น early warning dashboard ซึ่งตรงกับธีมของ Track A โดยตรง

## Q: ข้อจำกัดตอนนี้คืออะไร?

ตอนนี้ยังเป็น prototype จึงยังต้องเพิ่ม feature จาก EPPO/OWID ให้ครบขึ้น, เพิ่ม historical validation และ backtesting, และเพิ่มการเก็บ simulation history หากจะขยายเป็น production tool

## Q: ถ้ากรรมการถามว่า statistical validity มีจริงไหม จะตอบอย่างไร?

"เราวางโมเดลบน time-series workflow ที่มีการตรวจ stationarity, เลือก lag อย่างมีเหตุผล, ตรวจความสัมพันธ์เชิงเวลา, ใช้ impulse response ในการจำลอง shock transmission และมี holdout backtest เพื่อดู forecast error บนช่วงท้ายของข้อมูล ดังนั้นตัว dashboard จึงผูกกับกระบวนการวิเคราะห์ ไม่ใช่เพียงการแสดงผลสวยงาม"

## Q: ตอนนี้มี train data และ test data ไหม?

มีในรูปแบบ `time-based holdout backtest` โดยกันช่วงท้ายของข้อมูลไว้เป็น test window แล้ว train บนข้อมูลก่อนหน้า จากนั้นค่อย forecast แบบ one-step-ahead และวัด error ด้วย `MAE`, `RMSE`, `MAPE`

## Q: ถ้ากรรมการถามว่า New Assumption ใหม่พอไหม จะตอบอย่างไร?

"จุดใหม่ไม่ใช่แค่ตัวแปรที่เลือก แต่คือการมองว่า lag ระหว่าง upstream shock กับ downstream Thai response มีคุณค่าในฐานะสัญญาณเตือนภัยล่วงหน้า และสามารถ operationalize ผ่าน web dashboard ได้"

## Q: ถ้าพูดสรุปใน 20 วินาที จะพูดยังไง?

"SHOCKWAVE คือระบบ early warning สำหรับ Track A ที่ใช้ time-series modeling เพื่อจับ hidden lag ระหว่าง oil shock ระดับโลกกับผลกระทบต่อระบบพลังงานไทย แล้วแปลงผลลัพธ์เป็น interactive dashboard ที่ช่วยให้เห็นความเสี่ยงก่อนปัญหาจะปรากฏชัด"
