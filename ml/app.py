"""
Voyage AI — FastAPI ML Service
================================
Serves the Kaggle 300K-dataset-trained flight fare prediction model.
All predictions are AI-estimated fares from historical data.
This is NOT a live airline pricing engine.
"""

import json
import logging
import pickle
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

# ── Config ────────────────────────────────────────────────────────────────────
MODELS_DIR  = Path("models")
LOGS_DIR    = Path("logs")
METRICS_DIR = Path("metrics")
LOGS_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Global model state ────────────────────────────────────────────────────────
model_pipeline: Any   = None
model_metadata: Dict  = {}
model_version:  str   = "unknown"
start_time = datetime.utcnow()

# ── Valid categorical values (from Kaggle dataset) ────────────────────────────
VALID_AIRLINES      = ["AirAsia", "Air_India", "GO_FIRST", "Indigo", "SpiceJet", "Vistara"]
VALID_CITIES        = ["Bangalore", "Chennai", "Delhi", "Hyderabad", "Kolkata", "Mumbai"]
VALID_DEP_TIMES     = ["Early_Morning", "Morning", "Afternoon", "Evening", "Night", "Late_Night"]
VALID_ARR_TIMES     = ["Early_Morning", "Morning", "Afternoon", "Evening", "Night", "Late_Night"]
VALID_STOPS         = ["zero", "one", "two_or_more"]
VALID_CLASSES       = ["Economy", "Business"]


# ── Pydantic schemas ──────────────────────────────────────────────────────────
class PredictionRequest(BaseModel):
    airline:          str   = Field(..., description="Airline name")
    source_city:      str   = Field(..., description="Departure city")
    destination_city: str   = Field(..., description="Arrival city")
    departure_time:   str   = Field(..., description="Departure time slot")
    arrival_time:     str   = Field(..., description="Arrival time slot")
    stops:            str   = Field(..., description="Number of stops: zero / one / two_or_more")
    travel_class:     str   = Field(..., description="Economy or Business")
    duration:         float = Field(..., gt=0, description="Flight duration in hours")
    days_left:        int   = Field(..., ge=0, le=365, description="Days until departure")

    @field_validator("airline")
    @classmethod
    def validate_airline(cls, v):
        # Normalize common aliases
        aliases = {"indigo": "Indigo", "air india": "Air_India", "airindia": "Air_India",
                   "goair": "GO_FIRST", "spicejet": "SpiceJet", "airasia": "AirAsia",
                   "vistara": "Vistara"}
        norm = aliases.get(v.lower().strip(), v)
        if norm not in VALID_AIRLINES:
            # Best-effort: return as-is, model handles unknown via OHE ignore
            return v
        return norm

    @field_validator("stops")
    @classmethod
    def validate_stops(cls, v):
        aliases = {"0": "zero", "1": "one", "non-stop": "zero", "non stop": "zero",
                   "2": "two_or_more", "2+": "two_or_more"}
        norm = aliases.get(v.lower().strip(), v.lower().strip())
        if norm not in VALID_STOPS:
            raise ValueError(f"stops must be one of {VALID_STOPS}")
        return norm

    @field_validator("travel_class")
    @classmethod
    def validate_class(cls, v):
        if v not in VALID_CLASSES:
            raise ValueError(f"travel_class must be one of {VALID_CLASSES}")
        return v

    @field_validator("departure_time", "arrival_time")
    @classmethod
    def validate_time_slot(cls, v):
        aliases = {"morning": "Morning", "afternoon": "Afternoon", "evening": "Evening",
                   "night": "Night", "early morning": "Early_Morning",
                   "early_morning": "Early_Morning", "late night": "Late_Night",
                   "late_night": "Late_Night"}
        norm = aliases.get(v.lower().strip(), v)
        if norm not in VALID_DEP_TIMES:
            raise ValueError(f"time must be one of {VALID_DEP_TIMES}")
        return norm


class PredictionResponse(BaseModel):
    predicted_price_inr:  float
    model_version:        str
    prediction_timestamp: str
    currency:             str = "INR"
    disclaimer:           str = "AI Estimated Fare based on historical data. Actual prices may vary."
    explainability:       Optional[List[str]] = None


class HealthResponse(BaseModel):
    status:        str
    model_loaded:  bool
    model_version: Optional[str] = None
    uptime_seconds: float


class ModelInfoResponse(BaseModel):
    model_version:  str
    model_type:     str
    dataset:        str
    training_rows:  int
    test_rows:      int
    features:       List[str]
    target:         str
    test_mae:       float
    test_rmse:      float
    test_r2:        float
    test_mape:      float
    trained_at:     str
    disclaimer:     str


# ── Model loading ─────────────────────────────────────────────────────────────
def load_model():
    global model_pipeline, model_metadata, model_version

    # Prefer the Kaggle 300K model, fall back to real-data model
    candidates = [
        MODELS_DIR / "flight_price_model_kaggle.pkl",
        MODELS_DIR / "flight_price_model_real.pkl",
    ]
    meta_candidates = [
        MODELS_DIR / "flight_price_model_kaggle_metadata.json",
        MODELS_DIR / "flight_price_model_real_metadata.json",
    ]

    for model_path, meta_path in zip(candidates, meta_candidates):
        if model_path.exists():
            with open(model_path, "rb") as f:
                model_pipeline = pickle.load(f)
            if meta_path.exists():
                with open(meta_path, "r") as f:
                    model_metadata = json.load(f)
            model_version = model_metadata.get("model_version", "unknown")
            logger.info(f"Model loaded: {model_path} (version {model_version})")
            return True

    logger.warning("No model found in models/")
    return False


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Voyage AI — Flight Fare Prediction Service",
    description=(
        "Provides AI-estimated flight fares from a model trained on historical Indian "
        "flight-price data. This is NOT a live airline booking or pricing engine."
    ),
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Prediction logging ────────────────────────────────────────────────────────
LOG_FILE = LOGS_DIR / "predictions.csv"

def log_prediction(request: PredictionRequest, prediction: float, latency_ms: float):
    entry = {
        "timestamp":         datetime.utcnow().isoformat() + "Z",
        "model_version":     model_version,
        "airline":           request.airline,
        "source_city":       request.source_city,
        "destination_city":  request.destination_city,
        "departure_time":    request.departure_time,
        "arrival_time":      request.arrival_time,
        "stops":             request.stops,
        "travel_class":      request.travel_class,
        "duration":          request.duration,
        "days_left":         request.days_left,
        "predicted_price_inr": prediction,
        "latency_ms":        latency_ms,
    }
    df = pd.DataFrame([entry])
    if LOG_FILE.exists():
        df.to_csv(LOG_FILE, mode="a", header=False, index=False)
    else:
        df.to_csv(LOG_FILE, mode="w", header=True, index=False)


# ── Explainability ────────────────────────────────────────────────────────────
def build_explainability(request: PredictionRequest, prediction: float) -> List[str]:
    insights = []

    if request.travel_class == "Business":
        insights.append("Business class carries a significant fare premium (~6x Economy median)")
    else:
        insights.append("Economy class selected")

    if request.days_left <= 3:
        insights.append(f"Late booking ({request.days_left}d left) — last-minute fares are typically highest")
    elif request.days_left <= 14:
        insights.append(f"Booking {request.days_left} days ahead — moderate advance-booking discount")
    elif request.days_left >= 30:
        insights.append(f"Early booking ({request.days_left}d ahead) — best-value window")

    if request.stops == "zero":
        insights.append("Non-stop flight — direct routes command a premium over connecting flights")
    elif request.stops == "one":
        insights.append("One stop — typically lower than non-stop but cheaper than multi-stop")
    else:
        insights.append("Two or more stops — usually the lowest-cost option")

    if request.duration > 8:
        insights.append(f"Long duration ({request.duration:.1f}h) — longer routes generally cost more")
    elif request.duration < 2:
        insights.append(f"Short hop ({request.duration:.1f}h) — brief routes are usually economical")

    return insights if insights else ["Fare estimated from historical pricing patterns"]


# ── Endpoints ─────────────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse)
async def health():
    uptime = (datetime.utcnow() - start_time).total_seconds()
    return HealthResponse(
        status="healthy" if model_pipeline is not None else "degraded",
        model_loaded=model_pipeline is not None,
        model_version=model_version,
        uptime_seconds=round(uptime, 1),
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest, background_tasks: BackgroundTasks):
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Check service logs.")

    t0 = datetime.utcnow()

    # Build feature DataFrame exactly as the training pipeline expects
    features_df = pd.DataFrame([{
        "airline":          request.airline,
        "source_city":      request.source_city,
        "destination_city": request.destination_city,
        "departure_time":   request.departure_time,
        "arrival_time":     request.arrival_time,
        "stops":            request.stops,
        "class":            request.travel_class,
        "duration":         request.duration,
        "days_left":        request.days_left,
    }])

    try:
        prediction = float(model_pipeline.predict(features_df)[0])
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    latency_ms = (datetime.utcnow() - t0).total_seconds() * 1000
    background_tasks.add_task(log_prediction, request, prediction, latency_ms)

    return PredictionResponse(
        predicted_price_inr=round(prediction, 2),
        model_version=model_version,
        prediction_timestamp=datetime.utcnow().isoformat() + "Z",
        explainability=build_explainability(request, prediction),
    )


@app.get("/model-info", response_model=ModelInfoResponse)
async def model_info():
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    test_m = model_metadata.get("test_metrics", {})
    return ModelInfoResponse(
        model_version=model_version,
        model_type=model_metadata.get("model_type", "unknown"),
        dataset=model_metadata.get("dataset", "unknown"),
        training_rows=model_metadata.get("training_rows", 0),
        test_rows=model_metadata.get("test_rows", 0),
        features=model_metadata.get("features", []),
        target=model_metadata.get("target", "price"),
        test_mae=test_m.get("MAE", 0),
        test_rmse=test_m.get("RMSE", 0),
        test_r2=test_m.get("R2", 0),
        test_mape=test_m.get("MAPE", 0),
        trained_at=model_metadata.get("trained_at", "unknown"),
        disclaimer=(
            "AI Estimated Fare trained on historical Indian flight-price data. "
            "Not a live airline pricing engine. Actual fares depend on real-time "
            "availability, demand, and airline pricing algorithms."
        ),
    )


@app.get("/metrics")
async def metrics():
    """Prediction statistics from logs."""
    stats = {"total_predictions": 0, "avg_latency_ms": 0, "price_stats": {}}
    if LOG_FILE.exists():
        try:
            df = pd.read_csv(LOG_FILE)
            stats = {
                "total_predictions": len(df),
                "avg_latency_ms":    round(float(df["latency_ms"].mean()), 2),
                "price_stats": {
                    "min":    round(float(df["predicted_price_inr"].min()), 2),
                    "max":    round(float(df["predicted_price_inr"].max()), 2),
                    "mean":   round(float(df["predicted_price_inr"].mean()), 2),
                    "median": round(float(df["predicted_price_inr"].median()), 2),
                } if len(df) > 0 else {},
            }
        except Exception as e:
            logger.warning(f"Could not compute metrics: {e}")
    return JSONResponse(stats)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)