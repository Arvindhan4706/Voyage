# MLOps Lifecycle Documentation

This document explains the complete MLOps lifecycle implemented in the Voyage AI project, suitable for a B.Tech PBL viva.

---

## 1. Data Collection

**What:** Generate reproducible synthetic flight pricing dataset  
**Why:** No access to real airline data; need realistic route-aware features for demonstration  
**How:** `ml/generate_data.py` creates 20,000 samples with geographic distances, seasonal demand, travel classes  
**File:** `ml/generate_data.py`

Key features generated:
- Source/destination cities (15 Indian cities with real coordinates)
- Geographic distance (Haversine formula)
- Days to departure (exponential distribution)
- Day of week, month, weekend flag
- Demand index (seasonal + random)
- Travel class (Economy, Premium Economy, Business, First)
- Stops (0, 1, 2 based on distance)
- Departure time category
- Duration hours
- Price (realistic formula with modifiers + noise)

---

## 2. Data Validation

**What:** Validate dataset schema and quality before training  
**Why:** Prevent training on corrupt data; ensure reproducibility  
**How:** `ml/train.py::load_and_validate_data()` checks:
- All required columns present
- No null values
- No negative numerical values
- Positive prices
- Valid categorical values (travel_class, time_category)
- Source ≠ Destination  
**File:** `ml/train.py`

---

## 3. DVC Versioning

**What:** Version control for data and pipeline  
**Why:** Reproducibility; track data/model lineage  
**How:** `ml/dvc.yaml` defines 4 stages:
1. `generate_data` → outputs `data/flight_prices.csv`
2. `train` → outputs `models/flight_price_model_v*.pkl`
3. `evaluate` → outputs `metrics/evaluation_metrics.json`
4. `monitor` → outputs `logs/drift_report.json`

Commands:
```bash
dvc init
dvc add data/flight_prices.csv
dvc repro  # Run full pipeline
dvc push   # Push to remote storage (if configured)
```
**File:** `ml/dvc.yaml`

---

## 4. Preprocessing

**What:** Transform raw features for model consumption  
**Why:** Handle categorical encoding, scale numerical features  
**How:** `sklearn.compose.ColumnTransformer`:
- Categorical: OneHotEncoder (drop='first', handle_unknown='ignore')
- Numerical: StandardScaler
- Combined in sklearn Pipeline with RandomForestRegressor  
**File:** `ml/train.py::create_preprocessing_pipeline()`

---

## 5. Model Training

**What:** Train RandomForestRegressor on flight price data  
**Why:** Handles non-linear relationships, interactions, robust to outliers, explainable  
**How:** `ml/train.py::train_model()`:
- Train/test split (80/20, stratified by travel_class)
- RandomForest: n_estimators=200, max_depth=20, min_samples_split=5
- Logs parameters & metrics to MLflow  
**File:** `ml/train.py`

---

## 6. Model Evaluation

**What:** Comprehensive evaluation on held-out test set  
**Why:** Measure generalization; compare models for promotion  
**How:** `ml/evaluate.py` calculates:
- MAE, RMSE, R², MAPE (overall + per travel class)
- Saves metrics to `metrics/evaluation_metrics.json`
- Logs to MLflow as separate evaluation run  
**File:** `ml/evaluate.py`

---

## 7. MLflow Tracking

**What:** Experiment tracking for parameters, metrics, models  
**Why:** Reproducibility; model registry; comparison  
**How:** Local file-based tracking (`mlruns/`):
- Experiment: `flight_price_prediction`
- Each training run logs: parameters, metrics, model artifact
- Model registered as `flight_price_model` with versions
- Evaluation runs logged separately  
**File:** `ml/train.py::log_to_mlflow()`, `ml/evaluate.py::log_to_mlflow()`

---

## 8. Model Versioning

**What:** Every trained model gets unique version + metadata  
**Why:** Traceability; rollback capability; audit trail  
**How:** Version format: `flight_price_model_vYYYYMMDD_HHMMSS`
- Model artifact: `.pkl` (sklearn Pipeline)
- Metadata: `.json` (version, timestamp, features, metrics, data_version)  
**Files:** `ml/models/flight_price_model_v*.pkl`, `ml/models/*_metadata.json`

---

## 9. FastAPI Deployment

**What:** REST API for model inference  
**Why:** Decouple ML from frontend; scalable serving  
**How:** `ml/app.py` exposes:
- `GET /health` — service health + model loaded status
- `POST /predict` — single prediction with full feature set
- `GET /model-info` — model metadata
- `GET /metrics` — evaluation metrics + prediction stats
- `POST /reload-model` — hot reload latest model
- Background task logs predictions to CSV  
**File:** `ml/app.py`

---

## 10. Docker Containerization

**What:** Reproducible container for ML service  
**Why:** Consistent deployment across environments  
**How:** `ml/Dockerfile`:
- Base: python:3.10-slim
- Installs requirements
- Copies app + models
- Healthcheck endpoint
- Runs uvicorn on port 8000  
**File:** `ml/Dockerfile`

Build & Run:
```bash
docker build -t voyage-ai-mlops .
docker run -p 8000:8000 voyage-ai-mlops
```

---

## 11. CI/CD Pipeline

**What:** Automated testing, training, validation on push  
**Why:** Catch regressions; ensure quality; automate workflow  
**How:** `.github/workflows/mlops.yml`:
1. Checkout code
2. Setup Python 3.10
3. Install dependencies (cached)
4. Generate data → Train → Evaluate
5. Run pytest (data, model, API, pipeline tests)
6. Build Docker image
7. Test Docker container (health + predict)
8. Upload artifacts (model, metrics, MLflow)
9. Optional: Retraining evaluation on manual trigger  
**File:** `.github/workflows/mlops.yml`

---

## 12. Prediction Logging

**What:** Log every inference request for monitoring  
**Why:** Enable drift detection; audit trail; performance tracking  
**How:** `ml/app.py::log_prediction()` writes to `logs/predictions.csv`:
- Timestamp, model_version
- All input features
- Predicted price
- Latency (ms)  
**File:** `ml/app.py`, `logs/predictions.csv`

---

## 13. Monitoring & Drift Detection

**What:** Statistical detection of data/concept drift  
**Why:** Models degrade over time; need alerting  
**How:** `ml/monitor.py` compares recent predictions (30 days) vs training reference:
- **Numerical features:** Population Stability Index (PSI) + Kolmogorov-Smirnov test
- **Categorical features:** Chi-square test
- **Predictions:** PSI + KS on price distribution
- Thresholds: PSI ≥ 0.2, KS p-value < 0.05
- Logs to MLflow; exits with code 1 if drift detected  
**File:** `ml/monitor.py`

---

## 14. Retraining Workflow

**What:** Automated retraining with quality gate  
**Why:** Prevent deploying worse models; ensure improvement  
**How:** `ml/retrain.py`:
1. Load current production model (from `promoted_model.json`)
2. Load candidate model (latest trained)
3. Evaluate both on same test set
4. Quality gate:
   - New MAE ≤ Current MAE
   - New R² ≥ Current R²
   - New RMSE ≤ Current RMSE
5. If passed → promote to production (`promoted_model.json`)
6. Log promotion decision to MLflow  
**File:** `ml/retrain.py`, `ml/models/promoted_model.json`

---

## 15. Model Promotion

**What:** Formal promotion of candidate to production  
**Why:** Controlled deployment; audit trail; rollback capability  
**How:** On retrain quality gate pass:
- Write `ml/models/promoted_model.json` with:
  - Model version, paths, promotion timestamp
  - Evaluation comparison (current vs candidate)
  - Promotion criteria used
- Log to MLflow as promotion run
- FastAPI `/reload-model` picks up new model  
**Files:** `ml/retrain.py`, `ml/models/promoted_model.json`

---

## Viva-Ready Summary

> **"How does your project use MLOps?"**

> Our Voyage AI project implements a complete MLOps lifecycle for flight price prediction:
>
> 1. **Data**: Reproducible synthetic dataset (20K samples) with geographic distances and realistic features, versioned with **DVC**
> 2. **Training**: **RandomForestRegressor** in sklearn Pipeline with preprocessing, trained with stratified split
> 3. **Tracking**: **MLflow** logs parameters, metrics (MAE=929, R²=0.97), and model artifacts to local `mlruns/`
> 4. **Versioning**: Timestamped model versions with JSON metadata
> 5. **Serving**: **FastAPI** exposes `/predict`, `/health`, `/model-info`, `/metrics` with prediction logging
> 6. **Monitoring**: **PSI/KS/Chi-square** drift detection on numerical/categorical features and predictions
> 7. **Retraining**: Quality gate (MAE≤current, R²≥current) before promotion to production
> 8. **CI/CD**: **GitHub Actions** runs full pipeline, tests, Docker build on every push
> 9. **Containerization**: Multi-stage **Dockerfile** for reproducible deployment
>
> The Next.js frontend calls the FastAPI `/predict` endpoint (not Gemini) for authoritative ML predictions, displayed as "AI Model Estimate" with model version.

---

## Limitations (Honest Assessment)

| Limitation | Mitigation |
|---|---|
| Synthetic dataset (not real airline data) | Clearly labelled; academic honesty notice in UI/docs |
| Local MLflow (not centralized) | Suitable for PBL; documented |
| No real-time airline API | Shows "Estimated fare" label; links to Google Flights |
| Single-node Docker (no orchestration) | Documented; runs on student laptop |
| No production traffic | Load testing not in scope for PBL |

---

## Files Reference

| Stage | Files |
|---|---|
| Data Generation | `ml/generate_data.py` |
| Data Validation | `ml/train.py` (load_and_validate_data) |
| DVC Pipeline | `ml/dvc.yaml` |
| Preprocessing | `ml/train.py` (create_preprocessing_pipeline) |
| Training | `ml/train.py` (train_model) |
| Evaluation | `ml/evaluate.py` |
| MLflow | `ml/train.py`, `ml/evaluate.py`, `ml/monitor.py`, `ml/retrain.py` |
| Versioning | `ml/models/*.pkl`, `ml/models/*_metadata.json` |
| FastAPI | `ml/app.py` |
| Docker | `ml/Dockerfile` |
| CI/CD | `.github/workflows/mlops.yml` |
| Prediction Logs | `ml/app.py` (log_prediction), `logs/predictions.csv` |
| Monitoring | `ml/monitor.py` |
| Retraining | `ml/retrain.py` |
| Promotion | `ml/models/promoted_model.json` |
| Tests | `ml/tests/*.py` |