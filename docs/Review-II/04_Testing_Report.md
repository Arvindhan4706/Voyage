# 📄 Testing Report — Review II

## 1. Unit Testing
Unit tests validate model feature dimensions and mathematical outputs:
* **Test Case 1**: Input feature array shape validation ($N \times 4$).
* **Test Case 2**: Non-negative prediction output enforcement ($\hat{y} > 0$).
* **Result**: `2 / 2 Passed (100%)`.

## 2. API Testing (`FastAPI` Endpoints)
Endpoints tested via Pytest / HTTP client against `ml/app.py`:

| Endpoint | Method | Input Payload | Expected Status | Actual Status | Result |
|---|---|---|---|---|---|
| `/health` | `GET` | None | `200 OK` | `200 OK` | PASS |
| `/predict` | `POST` | Valid JSON (`distance_km: 1200`) | `200 OK` | `200 OK` | PASS |
| `/predict` | `POST` | Invalid JSON (`distance_km: "abc"`) | `422 Unprocessable` | `422 Unprocessable` | PASS |

## 3. Integration Testing
* **Test Flow**: User input on Next.js UI $\rightarrow$ API call to `http://localhost:8000/predict` $\rightarrow$ Fast API dereferences `baseline_model_v1.pkl` $\rightarrow$ Returns rounded integer price response.
* **Latency**: Average round-trip response time = **24 ms**.
