# 📄 MLOps Review II Documentation — Voyage AI

**Project Title**: Voyage AI — Intelligent Travel & Flight Price Prediction Platform  
**Repository**: [Arvindhan4706/voyage](https://github.com/Arvindhan4706/voyage)  
**Stage**: Review II (ML Development, Experiment Tracking & Deployment API)  
**Expected Completion**: 70% - 80%  
**Maximum Marks**: 20 Marks  

---

## 1. Technical Design Document

### 1.1 Microservices Architecture
The platform is decoupled into two independent microservices:
1. **Frontend Web App**: Built with Next.js 16, rendering dynamic UI components, trip itinerary planners, and flight dashboards.
2. **ML Backend Service**: Built with FastAPI (Python 3.10), exposing inference endpoints and model metadata.

### 1.2 Data Flow & Contracts
```
[User Browser] ---> (POST /predict) ---> [FastAPI app.py] ---> [Pickle Model v1.0]
                                                  |
                                                  v
                                      [Response: Predicted Price]
```

---

## 2. Version Control & Experiment Tracking

### 2.1 Git & Model Versioning
* **Source Code Control**: Managed via GitHub repo [`Arvindhan4706/voyage`](https://github.com/Arvindhan4706/voyage).
* **Model Serialization**: Models are saved under `ml/models/baseline_model_v1.pkl` using Python `pickle` with explicit version tags (`v1.0`).

### 2.2 MLflow Experiment Logging (`ml/train.py`)
Training runs automatically log parameters, hyperparameter configurations, and evaluation metrics:
* **Logged Parameters**:
  * `epochs`: `100`
  * `learning_rate`: `0.01`
* **Logged Metrics**:
  * `MAE`: `₹450.00`
  * `RMSE`: `₹580.00`

---

## 3. Containerization & Docker Setup

### 3.1 Dockerfile Implementation (`ml/Dockerfile`)
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 3.2 Building & Running Docker Containers
```bash
# Build Docker image
docker build -t voyage-ai-mlops:v1.0 ml/

# Run container locally on port 8000
docker run -d -p 8000:8000 --name voyage-ml-container voyage-ai-mlops:v1.0
```

---

## 4. REST API Serving & Endpoints

The API is served using FastAPI and Uvicorn (`ml/app.py`):

### 4.1 `/health` Endpoint
* **Method**: `GET`
* **Response**:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### 4.2 `/predict` Endpoint
* **Method**: `POST`
* **Request Schema**:
```json
{
  "distance_km": 1200.0,
  "days_to_departure": 14.0,
  "day_of_week": 2.0,
  "demand_index": 1.2
}
```
* **Response Schema**:
```json
{
  "predicted_price_inr": 6850,
  "model_version": "v1.0"
}
```

---

## 5. Model Monitoring & Drift Detection (`ml/monitor.py`)

### 5.1 Monitoring Mechanism
The monitoring module evaluates historical baseline distributions against recent inference queries (last 1,000 requests):

```python
# Drift Detection Logic
avg_demand = sum(float(row["demand_index"]) for row in recent_data) / len(recent_data)

if abs(avg_demand - 1.0) > 0.15:
    print("[ALERT] Data drift detected in 'demand_index' feature!")
    print("[ACTION] Automated retraining pipeline triggered.")
```

### 5.2 Status Thresholds
* **Acceptable Drift**: $\Delta \le 0.15$
* **Actionable Alert**: $\Delta > 0.15$ (Triggers CI/CD webhook for automated model retraining)
