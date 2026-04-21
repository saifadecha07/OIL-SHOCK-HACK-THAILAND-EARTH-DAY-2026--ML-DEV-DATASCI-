# SHOCKWAVE Developer Brief

## Executive Summary

SHOCKWAVE เป็น `production-minded prototype` สำหรับ `Track A: Planetary Signals Lab` ที่พยายามแปลง global oil-price shock ให้กลายเป็นสัญญาณเตือนภัยล่วงหน้าต่อระบบพลังงานไทยผ่าน time-series modeling, backend API, และ interactive web dashboard

ในมุม developer จุดสำคัญไม่ใช่แค่ว่าโมเดล forecast อะไรได้ แต่คือทั้ง repo ถูกออกแบบให้ `model -> service -> UI -> deployment` เชื่อมกันพอสำหรับ online demo จริงในวันแข่งขัน `22 เมษายน 2569`

## What In The Repo Maps To The Competition

### Track A Compliance

สิ่งที่สอดคล้องกับ Track A จาก implementation ปัจจุบัน:

- ใช้ `EIA` เป็น upstream global signal
- ใช้ `DOEB` เป็น local Thai indicators
- โครงงานเล่าเป็น `early warning system`
- แกนวิธีวิเคราะห์เป็น `time-series analysis`
- dashboard เน้นการอ่าน `signal propagation` ไม่ใช่แค่โชว์กราฟย้อนหลัง

สิ่งที่ยังเป็นช่องว่าง:

- `OWID` และ `EPPO` ยังไม่ได้เป็น feature หลักใน runtime path ปัจจุบัน
- anomaly detection และ probabilistic layer ยังไม่ใช่ component หลักของ implementation ปัจจุบัน

เวลาตอบกรรมการ ควรตอบตรงว่า:

"เฟสปัจจุบันเน้น time-series early warning core ก่อน โดยเปิดทางให้ขยาย OWID/EPPO และ probabilistic layers ต่อใน phase ถัดไป"

## Architecture Overview

### 1. ML/Data Layer

ไฟล์หลัก:

- `ml_engine/01b_generate_mock_doeb_data.py`
- `ml_engine/data_pipeline.py`
- `ml_engine/02_train_var_model.py`

flow:

1. ดึง upstream signal จาก EIA
2. พยายามโหลด local targets จาก DOEB/EPPO
3. ถ้า local files ไม่พร้อม ใช้ synthetic fallback
4. สร้าง `shockwave_training_data.csv`
5. train `shockwave_var_model.pkl`

### 2. Statistical Workflow

สิ่งที่มีจริงในโค้ด:

- `ADF` สำหรับ stationarity check
- `first differencing` เมื่อ series ไม่ stationary
- `Granger causality tests`
- `VAR lag selection` จาก information criteria
- `IRF-based shock simulation`
- `time-based holdout backtest`
- metric report แบบ `MAE`, `RMSE`, `MAPE`

นี่คือประเด็นหลักสำหรับตอบหัวข้อ `Statistical Validity 25%`

artifact ที่เพิ่มจาก training:

- `ml_engine/shockwave_backtest_report.json`
- `ml_engine/shockwave_backtest_predictions.csv`

### 3. Backend/API Layer

ไฟล์หลัก:

- `shockwave_backend/app/main.py`
- `shockwave_backend/app/api/endpoints/simulate.py`
- `shockwave_backend/app/services/ml_service.py`
- `shockwave_backend/app/schemas/simulation.py`

endpoint สำคัญ:

- `GET /health`
- `GET /ready`
- `GET /api/v1/simulate/health`
- `GET /api/v1/simulate/metadata`
- `POST /api/v1/simulate`

runtime behavior:

- ถ้ามี artifact จะรัน trained mode
- ถ้าไม่มี artifact และอนุญาต mock จะรัน mock mode
- frontend ใช้ endpoint เดียวกันสำหรับ scenario simulation

### 4. Frontend Layer

มีสอง implementation:

- static dashboard: `frontend/index.html`, `frontend/script.js`, `frontend/style.css`
- Streamlit dashboard: `frontend/app.py`

แต่ deployment path ใน compose ตอนนี้ชี้ไปที่ `static dashboard`

นี่เป็นจุดที่ต้องพูดให้ชัดเวลาโดนถามว่า "อันไหนคือของจริง"

คำตอบที่แนะนำ:

"สำหรับ online competition demo path หลักคือ static web dashboard เพราะเบาและเสถียรกว่า ส่วน Streamlit เป็น alternate interface ที่เก็บไว้ใน repo"

### 5. Deployment Layer

ตัว orchestrator หลักคือ `docker-compose.yml`

service ที่มี:

- `postgres`
- `ml-trainer`
- `backend`
- `frontend`

จุดแข็ง:

- backend/frontend bind ที่ localhost
- รัน container แบบ non-root
- มี health/readiness story
- online demo stack แยก service ชัด

## Technical Strengths You Can Defend

- ระบบไม่ได้จบที่ notebook แต่ยก model ขึ้นเป็น API service
- dashboard คุยกับ backend จริง
- มี deterministic mock fallback สำหรับ demo resilience
- โครงสร้าง code แยก schema, config, service, API ชัดพอสมควร
- มี deployment story ที่เอาไปเดโมออนไลน์ได้

## Technical Gaps You Should Acknowledge

### 1. Partial Track-A dataset coverage

แม้ narrative จะอิง EIA + DOEB + OWID + EPPO ตามโจทย์ Track A แต่ implementation หลักตอนนี้ยังหนักไปที่ EIA + DOEB เป็นหลัก ดังนั้นอย่าเผลออ้างเกินของจริง

### 2. Probabilistic / anomaly layer is not first-class yet

brief ของ Track A พูดถึง probabilistic modeling และ anomaly detection แต่ระบบปัจจุบันเด่นที่ VAR-based time-series simulation มากกว่า

วิธีตอบ:

"แกนหลักที่เราทำสำเร็จในรอบนี้คือ lag-aware time-series early warning ส่วน probabilistic scoring และ anomaly layer เป็น roadmap ถัดไป"

### 3. Database usage is thin

Postgres ปัจจุบันยังไม่ได้ถือ domain data หลักหรือ simulation history อย่างจริงจัง

### 4. Repo hygiene

ปัจจุบัน repo ยังมี:

- dirty worktree
- model artifacts
- `.env`
- `__pycache__`

จึงต้องระวังมากก่อนเผยแพร่หรือส่งงาน

### 5. Secret hygiene risk

`.env.example` ยังมีค่า `EIA_API_KEY` หน้าตาเหมือน key จริง จุดนี้ต้องแก้ก่อนส่งหรือ present repo

## Best Technical Answers

### ถ้าถามว่า "What makes this more than a notebook?"

"เพราะโมเดลถูกยกขึ้นเป็น FastAPI service, มี web dashboard ที่โต้ตอบได้, มี deployment path ผ่าน Docker Compose, และมี fallback mode ทำให้ online demo และ integration flow ใช้งานได้จริง"

### ถ้าถามว่า "Why is this statistically valid?"

"เพราะ pipeline มี stationarity check, differencing เมื่อจำเป็น, lag-aware causal testing, multivariate VAR fitting และ impulse-response simulation แทนที่จะใส่ shock แบบ arbitrary"

ถ้าต้องการตอบให้แน่นขึ้นอีกประโยค:

"นอกจากนี้เรายังเพิ่ม time-based holdout backtest เพื่อดู error บนช่วงท้ายของข้อมูลจริง แทนการ fit ทั้งชุดอย่างเดียว"

### ถ้าถามว่า "Why Track A?"

"เพราะโจทย์หลักของเราคือการอนุมานสัญญาณเตือนภัยล่วงหน้าจากข้อมูลพลังงานระดับโลกสู่ผลกระทบในบริบทไทย ผ่าน time-series analysis และ interactive dashboard"

## Recommended Cleanup Before Live Pitch

- เปลี่ยน `EIA_API_KEY` ใน `.env.example` ให้เป็น placeholder
- ลบ `ml_engine/__pycache__/`
- ตกลงให้ชัดว่า demo path หลักคือ static dashboard
- ตรวจว่า online URL ใช้งานได้จริงก่อนถึงคิว
- ซ้อมตอบให้แยกได้ชัดระหว่าง `ของที่มีจริงแล้ว` กับ `สิ่งที่จะต่อยอด`
