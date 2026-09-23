"""
Model Evaluation Script
Evaluates trained model on test set and logs detailed metrics.
"""

import os
import json
import pickle
import warnings
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd
import mlflow
from sklearn.metrics import (
    mean_absolute_error, 
    mean_squared_error, 
    r2_score,
    mean_absolute_percentage_error
)
from sklearn.model_selection import train_test_split

warnings.filterwarnings("ignore")

# Configuration
DATA_PATH = Path("data/flight_prices.csv")
MODELS_DIR = Path("models")
METRICS_DIR = Path("metrics")
MLFLOW_TRACKING_URI = "file:./mlruns"

CATEGORICAL_FEATURES = [
    "source", "destination", "travel_class", 
    "departure_time_category"
]
NUMERICAL_FEATURES = [
    "distance_km", "days_to_departure", "day_of_week", 
    "month", "is_weekend", "demand_index", "stops", "duration_hours"
]
TARGET = "price_inr"
ALL_FEATURES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES

def load_latest_model():
    """Load the latest trained model."""
    model_files = sorted(MODELS_DIR.glob("flight_price_model_v*.pkl"))
    if not model_files:
        raise FileNotFoundError("No model files found in models/")
    
    latest_model = model_files[-1]
    print(f"Loading model: {latest_model}")
    
    with open(latest_model, "rb") as f:
        pipeline = pickle.load(f)
    
    # Load metadata
    metadata_file = latest_model.parent / f"{latest_model.stem}_metadata.json"
    with open(metadata_file, "r") as f:
        metadata = json.load(f)
    
    return pipeline, metadata

def evaluate_model(pipeline, X_test, y_test):
    """Comprehensive model evaluation."""
    y_pred = pipeline.predict(X_test)
    
    metrics = {
        "MAE": round(float(mean_absolute_error(y_test, y_pred)), 2),
        "RMSE": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2),
        "R2": round(float(r2_score(y_test, y_pred)), 4),
        "MAPE": round(float(mean_absolute_percentage_error(y_test, y_pred)) * 100, 2),
        "test_samples": len(y_test),
        "evaluation_timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    # Per-class metrics
    print("\n--- Per Travel Class Metrics ---")
    df_test = pd.concat([X_test.reset_index(drop=True), y_test.reset_index(drop=True)], axis=1)
    y_test_reset = y_test.reset_index(drop=True)
    for cls in df_test["travel_class"].unique():
        cls_mask = df_test["travel_class"] == cls
        if cls_mask.sum() > 10:
            cls_mae = mean_absolute_error(y_test_reset[cls_mask], np.array(y_pred)[cls_mask])
            cls_rmse = np.sqrt(mean_squared_error(y_test_reset[cls_mask], np.array(y_pred)[cls_mask]))
            print(f"  {cls}: MAE={cls_mae:.0f}, RMSE={cls_rmse:.0f}, n={cls_mask.sum()}")
    
    return metrics, y_pred

def save_evaluation_results(metrics, y_test, y_pred):
    """Save evaluation results to disk."""
    METRICS_DIR.mkdir(exist_ok=True)
    
    # Save metrics
    metrics_path = METRICS_DIR / "evaluation_metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Evaluation metrics saved to {metrics_path}")
    
    # Save predictions for monitoring
    preds_df = pd.DataFrame({
        "actual": y_test.values,
        "predicted": y_pred,
        "error": y_test.values - y_pred,
        "abs_error": np.abs(y_test.values - y_pred)
    })
    preds_path = METRICS_DIR / "test_predictions.csv"
    preds_df.to_csv(preds_path, index=False)
    print(f"Test predictions saved to {preds_path}")
    
    return metrics_path

def log_to_mlflow(metrics, model_metadata):
    """Log evaluation metrics to MLflow."""
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    
    # Filter metrics to only numeric values
    numeric_metrics = {k: v for k, v in metrics.items() if isinstance(v, (int, float))}
    
    with mlflow.start_run(run_name=f"evaluation_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}") as run:
        mlflow.log_params(model_metadata.get("features", {}))
        mlflow.log_metrics(numeric_metrics)
        mlflow.log_param("model_version", model_metadata.get("model_version", "unknown"))
        mlflow.log_param("training_timestamp", model_metadata.get("training_timestamp", "unknown"))
        
        # Log artifacts
        mlflow.log_artifact(str(METRICS_DIR / "evaluation_metrics.json"))
        mlflow.log_artifact(str(METRICS_DIR / "test_predictions.csv"))
        
        print(f"MLflow evaluation run ID: {run.info.run_id}")
        return run.info.run_id

def main():
    print("=" * 60)
    print("MODEL EVALUATION")
    print("=" * 60)
    
    # Load model
    pipeline, metadata = load_latest_model()
    
    # Load and split data
    df = pd.read_csv(DATA_PATH)
    X = df[ALL_FEATURES]
    y = df[TARGET]
    
    # Use same split as training (random_state=42)
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=df["travel_class"]
    )
    
    print(f"Test set: {len(X_test)} samples")
    
    # Evaluate
    metrics, y_pred = evaluate_model(pipeline, X_test, y_test)
    
    print(f"\n--- Overall Metrics ---")
    print(f"MAE:  INR {metrics['MAE']:.2f}")
    print(f"RMSE: INR {metrics['RMSE']:.2f}")
    print(f"R²:   {metrics['R2']:.4f}")
    print(f"MAPE: {metrics['MAPE']:.2f}%")
    
    # Save results
    save_evaluation_results(metrics, y_test, y_pred)
    
    # Log to MLflow
    log_to_mlflow(metrics, metadata)
    
    print("=" * 60)
    print("EVALUATION COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()