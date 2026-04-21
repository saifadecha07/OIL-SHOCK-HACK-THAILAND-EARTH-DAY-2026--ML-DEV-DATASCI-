# Training Slide

## หัวข้อสไลด์

### Training Pipeline: Input -> Model -> Output

## ฝั่งซ้าย: Input

- `shockwave_training_data.csv`
- Monthly time-series
- `Date`
- `eia_brent_price`
- `eia_natural_gas_price`
- `doeb_import_volume`
- `doeb_diesel_sales`

## กลาง: Model Process

- ADF stationarity check
- differencing when needed
- Granger causality
- VAR lag selection
- VAR fitting
- IRF-based simulation logic
- holdout backtest

## ฝั่งขวา: Output

- `shockwave_var_model.pkl`
- `shockwave_backtest_report.json`
- `shockwave_backtest_predictions.csv`

## ข้อความสรุปด้านล่าง

เราไม่ได้ train เพื่อได้โมเดลอย่างเดียว  
แต่ train เพื่อได้ทั้ง runtime artifact และ validation evidence

## บทพูดสั้น

"สไลด์นี้สรุปมุม data science ของงานเรา โดย input คือ time-series frame รายเดือน กระบวนการคือ preprocessing และ VAR-based modeling และ output คือทั้ง model artifact กับ backtest outputs ที่ใช้ validate ความน่าเชื่อถือของโมเดล"
