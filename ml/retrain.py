"""
Model Retraining and Promotion Worklight
Implements quality gate for model promotion based on evaluation metrics.
"""

import os
import json
import pickle
import warnings
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional, Tuple

import pandas as pd
import numpy as np
import mlflow
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

warnings.filterwarnings("ignore")

# Configuration
DATA_PATH = Path("data/flight_prices.csv")
MODELS_DIR = Path("models")
METRICS_DIR = Path("metrics")
MLFLOW_TRACKING_URI = "file:./mlruns"
MODEL_NAME = "flight_price_model"

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

# Promotion thresholds
PROMOTION_CONFIG = {
    "mae_improvement_threshold": 0.0,      # New MAE must be <= current MAE
    "r2_min_threshold": 0.0,               # New R2 must be >= current R2
    "rmse_improvement_threshold": 0.0,     # New RMSE must be <= current RMSE
    "min_test_samples": 1000,              # Minimum test samples for evaluation
}

def load_current_production_model() -> Tuple[Any, Dict]:
    """Load current production model and its metrics."""
    # Find the latest promoted model
    promoted_file = MODELS_DIR / "promoted_model.json"
    if promoted_file.exists():
        with open(promoted_file, "r") as f:
            promoted = json.load(f)
        model_path = Path(promoted["model_path"])
        if model_path.exists():
            with open(model_path, "rb") as f:
                model = pickle.load(f)
            return model, promoted
    
    # Fallback: latest trained model
    model_files = sorted(MODELS_DIR.glob("flight_price_model_v*.pkl"))
    if not model_files:
        return None, {}
    
    latest = model_files[-1]
    with open(latest, "rb") as f:
        model = pickle.load(f)
    
    metadata_file = latest.parent / f"{latest.stem}_metadata.json"
    metadata = {}
    if metadata_file.exists():
        with open(metadata_file, "r") as f:
            metadata = json.load(f)
    
    return model, metadata

def load_candidate_model() -> Tuple[Any, Dict]:
    """Load the candidate model (latest trained)."""
    model_files = sorted(MODELS_DIR.glob("flight_price_model_v*.pkl"))
    if not model_files:
        return None, {}
    
    latest = model_files[-1]
    with open(latest, "rb") as f:
        model = pickle.load(f)
    
    metadata_file = latest.parent / f"{latest.stem}_metadata.json"
    metadata = {}
    if metadata_file.exists():
        with open(metadata_file, "r") as f:
            metadata = json.load(f)
    
    return model, metadata

def evaluate_model_on_test_set(model: Any, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, float]:
    """Evaluate model on test set."""
    y_pred = model.predict(X_test)
    
    return {
        "MAE": round(float(mean_absolute_error(y_test, y_pred)), 2),
        "RMSE": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2),
        "R2": round(float(r2_score(y_test, y_pred)), 4),
        "test_samples": len(y_test)
    }

def check_promotion_criteria(
    current_metrics: Dict[str, float],
    candidate_metrics: Dict[str, float]
) -> Tuple[bool, Dict[str, Any]]:
    """
    Check if candidate model meets promotion criteria.
    Returns (should_promote, details).
    """
    details = {
        "mae_check": None,
        "r2_check": None,
        "rmse_check": None,
        "overall": False
    }
    
    # MAE check (lower is better)
    current_mae = current_metrics.get("MAE", float("inf"))
    candidate_mae = candidate_metrics.get("MAE", float("inf"))
    mae_ok = candidate_mae <= current_mae + PROMOTION_CONFIG["mae_improvement_threshold"]
    details["mae_check"] = {
        "current": current_mae,
        "candidate": candidate_mae,
        "threshold": PROMOTION_CONFIG["mae_improvement_threshold"],
        "passed": mae_ok
    }
    
    # R² check (higher is better)
    current_r2 = current_metrics.get("R2", -float("inf"))
    candidate_r2 = candidate_metrics.get("R2", -float("inf"))
    r2_ok = candidate_r2 >= current_r2 + PROMOTION_CONFIG["r2_min_threshold"]
    details["r2_check"] = {
        "current": current_r2,
        "candidate": candidate_r2,
        "threshold": PROMOTION_CONFIG["r2_min_threshold"],
        "passed": r2_ok
    }
    
    # RMSE check (lower is better)
    current_rmse = current_metrics.get("RMSE", float("inf"))
    candidate_rmse = candidate_metrics.get("RMSE", float("inf"))
    rmse_ok = candidate_rmse <= current_rmse + PROMOTION_CONFIG["rmse_improvement_threshold"]
    details["rmse_check"] = {
        "current": current_rmse,
        "candidate": candidate_rmse,
        "threshold": PROMOTION_CONFIG["rmse_improvement_threshold"],
        "passed": rmse_ok
    }
    
    # Overall promotion decision
    should_promote = mae_ok and r2_ok and rmse_ok
    details["overall"] = should_promote
    
    return should_promote, details

def promote_model(candidate_metadata: Dict, promotion_details: Dict):
    """Promote candidate model to production."""
    promoted_info = {
        "model_version": candidate_metadata.get("model_version"),
        "model_path": str(MODELS_DIR / f"{candidate_metadata.get('model_version')}.pkl"),
        "metadata_path": str(MODELS_DIR / f"{candidate_metadata.get('model_version')}_metadata.json"),
        "promoted_at": datetime.utcnow().isoformat() + "Z",
        "promotion_criteria": PROMOTION_CONFIG,
        "promotion_evaluation": promotion_details,
        "previous_metrics": promotion_details.get("current_metrics", {}),
        "new_metrics": promotion_details.get("candidate_metrics", {})
    }
    
    promoted_file = MODELS_DIR / "promoted_model.json"
    with open(promoted_file, "w") as f:
        json.dump(promoted_info, f, indent=2)
    
    print(f"Model promoted: {promoted_info['model_version']}")
    print(f"Promotion record saved to {promoted_file}")
    
    return promoted_info

def log_promotion_to_mlflow(promoted_info: Dict, candidate_run_id: Optional[str] = None):
    """Log promotion event to MLflow."""
    try:
        mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
        
        with mlflow.start_run(run_name=f"promotion_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}") as run:
            mlflow.log_param("promoted_model_version", promoted_info["model_version"])
            mlflow.log_param("promotion_decision", "PROMOTED")
            
            # Log current vs candidate metrics
            for key, val in promoted_info.get("previous_metrics", {}).items():
                mlflow.log_metric(f"current_{key.lower()}", val)
            for key, val in promoted_info.get("new_metrics", {}).items():
                mlflow.log_metric(f"candidate_{key.lower()}", val)
            
            # Log promotion criteria
            for key, val in promoted_info.get("promotion_criteria", {}).items():
                mlflow.log_param(f"promo_{key}", val)
            
            mlflow.log_artifact(str(MODELS_DIR / "promoted_model.json"))
            
            print(f"MLflow promotion run ID: {run.info.run_id}")
    except Exception as e:
        print(f"MLflow promotion logging failed: {e}")

def retrain_and_evaluate() -> Dict[str, Any]:
    """
    Full retraining workflow: train new model, evaluate, compare with production.
    """
    print("=" * 60)
    print("RETRAINING WORKFLOW")
    print("=" * 60)
    
    # Load data
    df = pd.read_csv(DATA_PATH)
    X = df[ALL_FEATURES]
    y = df[TARGET]
    
    # Split (same seed for reproducibility)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=df["travel_class"]
    )
    
    # Load current production model
    print("\nLoading current production model...")
    current_model, current_metadata = load_current_production_model()
    
    # Evaluate current model on test set
    current_metrics = {}
    if current_model is not None:
        print("Evaluating current model...")
        current_metrics = evaluate_model_on_test_set(current_model, X_test, y_test)
        print(f"  Current MAE: {current_metrics['MAE']:.2f}, R²: {current_metrics['R2']:.4f}")
    else:
        print("  No current model found.")
        current_metrics = {"MAE": float("inf"), "RMSE": float("inf"), "R2": -float("inf")}
    
    # Load candidate model (latest trained)
    print("\nLoading candidate model...")
    candidate_model, candidate_metadata = load_candidate_model()
    
    if candidate_model is None:
        print("ERROR: No candidate model found!")
        return {"status": "ERROR", "message": "No candidate model"}
    
    # Evaluate candidate model
    print("Evaluating candidate model...")
    candidate_metrics = evaluate_model_on_test_set(candidate_model, X_test, y_test)
    print(f"  Candidate MAE: {candidate_metrics['MAE']:.2f}, R²: {candidate_metrics['R2']:.4f}")
    
    # Check promotion criteria
    print("\nChecking promotion criteria...")
    promotion_details = {
        "current_metrics": current_metrics,
        "candidate_metrics": candidate_metrics,
        "test_samples": len(y_test),
        "evaluation_timestamp": datetime.utcnow().isoformat() + "Z"
    }
    
    should_promote, check_details = check_promotion_criteria(current_metrics, candidate_metrics)
    promotion_details["checks"] = check_details
    
    print(f"  MAE Check: {'PASS' if check_details['mae_check']['passed'] else 'FAIL'} "
          f"(Current: {check_details['mae_check']['current']:.2f}, "
          f"Candidate: {check_details['mae_check']['candidate']:.2f})")
    print(f"  R² Check:  {'PASS' if check_details['r2_check']['passed'] else 'FAIL'} "
          f"(Current: {check_details['r2_check']['current']:.4f}, "
          f"Candidate: {check_details['r2_check']['candidate']:.4f})")
    print(f"  RMSE Check: {'PASS' if check_details['rmse_check']['passed'] else 'FAIL'} "
          f"(Current: {check_details['rmse_check']['current']:.2f}, "
          f"Candidate: {check_details['rmse_check']['candidate']:.2f})")
    
    # Promotion decision
    if should_promote:
        print("\n[OK] PROMOTION APPROVED")
        promoted_info = promote_model(candidate_metadata, promotion_details)
        log_promotion_to_mlflow(promoted_info)
        
        return {
            "status": "PROMOTED",
            "promoted_model": promoted_info["model_version"],
            "details": promotion_details
        }
    else:
        print("\n[REJECTED] PROMOTION REJECTED - Candidate does not meet quality gate")
        return {
            "status": "REJECTED",
            "candidate_model": candidate_metadata.get("model_version"),
            "details": promotion_details
        }

def main():
    result = retrain_and_evaluate()
    
    # Save result
    result_file = Path("logs/retrain_result.json")
    result_file.parent.mkdir(exist_ok=True)
    with open(result_file, "w") as f:
        json.dump(result, f, indent=2)
    
    print(f"\nResult saved to {result_file}")
    print("=" * 60)
    
    if result["status"] == "PROMOTED":
        exit(0)
    elif result["status"] == "REJECTED":
        exit(2)  # Special code for rejected but not error
    else:
        exit(1)

if __name__ == "__main__":
    main()