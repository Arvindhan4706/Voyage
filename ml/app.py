"""
FastAPI ML Service for Flight Price Prediction
Provides REST API for model inference with prediction logging and monitoring.
"""

import os
import json
import pickle
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any

import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator
from contextlib import asynccontextmanager

# Configuration
MODELS_DIR = Path("models")
LOGS_DIR = Path("logs")
MLFLOW_TRACKING_URI = "file:./mlruns"

LOGS_DIR.mkdir(exist_ok=True)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model state
model_pipeline = None
model_metadata = None
model_version = None

# Pydantic models for API
class PredictionRequest(BaseModel):
    source: str = Field(..., description="Source city (e.g., Delhi)")
    destination: str = Field(..., description="Destination city (e.g., Mumbai)")
    distance_km: float = Field(..., gt=0, description="Distance in kilometers")
    days_to_departure: int = Field(..., ge=0, le=365, description="Days until departure")
    day_of_week: int = Field(..., ge=0, le=6, description="Day of week (0=Monday, 6=Sunday)")
    month: int = Field(..., ge=1, le=12, description="Month (1-12)")
    is_weekend: int = Field(..., ge=0, le=1, description="Is weekend (0/1)")
    demand_index: float = Field(..., ge=0.3, le=2.5, description="Demand index")
    travel_class: str = Field(..., description="Travel class: Economy, Premium Economy, Business, First")
    stops: int = Field(..., ge=0, le=2, description="Number of stops")
    departure_time_category: str = Field(..., description="Early Morning, Morning, Afternoon, Evening, Night")
    duration_hours: float = Field(..., gt=0, description="Flight duration in hours")
    
    @field_validator("travel_class")
    @classmethod
    def validate_travel_class(cls, v):
        valid = ["Economy", "Premium Economy", "Business", "First"]
        if v not in valid:
            raise ValueError(f"travel_class must be one of {valid}")
        return v
    
    @field_validator("departure_time_category")
    @classmethod
    def validate_time_category(cls, v):
        valid = ["Early Morning", "Morning", "Afternoon", "Evening", "Night"]
        if v not in valid:
            raise ValueError(f"departure_time_category must be one of {valid}")
        return v

class PredictionResponse(BaseModel):
    predicted_price_inr: float
    model_version: str
    prediction_timestamp: str
    currency: str = "INR"
    confidence_level: Optional[str] = None

class ModelInfoResponse(BaseModel):
    model_version: str
    model_name: str
    algorithm: str
    training_timestamp: str
    features: Dict[str, Any]  # Can contain lists and strings
    metrics: Dict[str, float]
    data_version: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: Optional[str] = None
    uptime_seconds: float

class MetricsResponse(BaseModel):
    model_version: str
    evaluation_metrics: Dict[str, Any]  # Can contain strings like timestamps
    prediction_stats: Dict[str, Any]

# Prediction logging
PREDICTION_LOG_FILE = LOGS_DIR / "predictions.csv"

def log_prediction(request: PredictionRequest, prediction: float, latency_ms: float):
    """Log prediction to CSV for monitoring."""
    log_entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "model_version": model_version,
        "source": request.source,
        "destination": request.destination,
        "distance_km": request.distance_km,
        "days_to_departure": request.days_to_departure,
        "day_of_week": request.day_of_week,
        "month": request.month,
        "is_weekend": request.is_weekend,
        "demand_index": request.demand_index,
        "travel_class": request.travel_class,
        "stops": request.stops,
        "departure_time_category": request.departure_time_category,
        "duration_hours": request.duration_hours,
        "predicted_price_inr": prediction,
        "latency_ms": latency_ms
    }
    
    # Append to CSV
    df = pd.DataFrame([log_entry])
    if PREDICTION_LOG_FILE.exists():
        df.to_csv(PREDICTION_LOG_FILE, mode="a", header=False, index=False)
    else:
        df.to_csv(PREDICTION_LOG_FILE, mode="w", header=True, index=False)

def load_latest_model():
    """Load the latest trained model from disk."""
    global model_pipeline, model_metadata, model_version
    
    model_files = sorted(MODELS_DIR.glob("flight_price_model_v*.pkl"))
    if not model_files:
        logger.warning("No model files found in models/")
        return False
    
    latest_model = model_files[-1]
    logger.info(f"Loading model: {latest_model}")
    
    try:
        with open(latest_model, "rb") as f:
            model_pipeline = pickle.load(f)
        
        metadata_file = latest_model.parent / f"{latest_model.stem}_metadata.json"
        with open(metadata_file, "r") as f:
            model_metadata = json.load(f)
        
        model_version = model_metadata.get("model_version", "unknown")
        logger.info(f"Model loaded: {model_version}")
        return True
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting FastAPI ML Service...")
    load_latest_model()
    yield
    # Shutdown
    logger.info("Shutting down FastAPI ML Service...")

app = FastAPI(
    title="VoyageAI Flight Price Predictor",
    description="MLOps-enabled flight price prediction service",
    version="1.0.0",
    lifespan=lifespan
)

# Track startup time
start_time = datetime.utcnow()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    uptime = (datetime.utcnow() - start_time).total_seconds()
    return HealthResponse(
        status="healthy" if model_pipeline is not None else "degraded",
        model_loaded=model_pipeline is not None,
        model_version=model_version,
        uptime_seconds=uptime
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest, background_tasks: BackgroundTasks):
    """Predict flight price."""
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    start = datetime.utcnow()
    
    # Prepare features for prediction
    features_df = pd.DataFrame([{
        "source": request.source,
        "destination": request.destination,
        "distance_km": request.distance_km,
        "days_to_departure": request.days_to_departure,
        "day_of_week": request.day_of_week,
        "month": request.month,
        "is_weekend": request.is_weekend,
        "demand_index": request.demand_index,
        "travel_class": request.travel_class,
        "stops": request.stops,
        "departure_time_category": request.departure_time_category,
        "duration_hours": request.duration_hours
    }])
    
    # Predict
    try:
        prediction = float(model_pipeline.predict(features_df)[0])
        prediction = max(prediction, 1000)  # Floor at 1000 INR
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    
    latency_ms = (datetime.utcnow() - start).total_seconds() * 1000
    
    # Log prediction in background
    background_tasks.add_task(log_prediction, request, prediction, latency_ms)
    
    return PredictionResponse(
        predicted_price_inr=round(prediction, 2),
        model_version=model_version or "unknown",
        prediction_timestamp=datetime.utcnow().isoformat() + "Z",
        currency="INR"
    )

@app.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    """Get model information and metadata."""
    if model_metadata is None:
        raise HTTPException(status_code=503, detail="Model metadata not available")
    
    return ModelInfoResponse(
        model_version=model_metadata.get("model_version", "unknown"),
        model_name=model_metadata.get("model_name", "unknown"),
        algorithm=model_metadata.get("algorithm", "unknown"),
        training_timestamp=model_metadata.get("training_timestamp", "unknown"),
        features=model_metadata.get("features", {}),
        metrics=model_metadata.get("metrics", {}),
        data_version=model_metadata.get("data_version", "unknown")
    )

@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics():
    """Get model evaluation metrics and prediction statistics."""
    if model_metadata is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Load evaluation metrics if available
    eval_metrics_path = Path("metrics/evaluation_metrics.json")
    eval_metrics = {}
    if eval_metrics_path.exists():
        with open(eval_metrics_path, "r") as f:
            eval_metrics = json.load(f)
    
    # Calculate prediction statistics from log
    prediction_stats = {
        "total_predictions": 0,
        "avg_latency_ms": 0,
        "price_range": {"min": 0, "max": 0, "avg": 0}
    }
    
    if PREDICTION_LOG_FILE.exists():
        try:
            log_df = pd.read_csv(PREDICTION_LOG_FILE)
            prediction_stats = {
                "total_predictions": len(log_df),
                "avg_latency_ms": round(log_df["latency_ms"].mean(), 2) if len(log_df) > 0 else 0,
                "price_range": {
                    "min": round(log_df["predicted_price_inr"].min(), 2),
                    "max": round(log_df["predicted_price_inr"].max(), 2),
                    "avg": round(log_df["predicted_price_inr"].mean(), 2)
                } if len(log_df) > 0 else {"min": 0, "max": 0, "avg": 0}
            }
        except Exception as e:
            logger.warning(f"Could not compute prediction stats: {e}")
    
    return MetricsResponse(
        model_version=model_version or "unknown",
        evaluation_metrics=eval_metrics,
        prediction_stats=prediction_stats
    )

@app.post("/reload-model")
async def reload_model():
    """Reload the latest model from disk."""
    success = load_latest_model()
    if success:
        return {"status": "success", "model_version": model_version}
    else:
        raise HTTPException(status_code=500, detail="Failed to reload model")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)