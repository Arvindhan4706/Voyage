"""
Model Monitoring and Drift Detection
Uses prediction logs and statistical tests to detect data drift.
"""

import os
import json
import warnings
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

import numpy as np
import pandas as pd
from scipy import stats
from train_real import clean_and_feature_engineer

warnings.filterwarnings("ignore")

# Configuration
PREDICTION_LOG_FILE = Path("logs/predictions.csv")
TRAINING_DATA_FILE = Path("data/raw/real_flight_prices.csv")
DRIFT_REPORT_FILE = Path("logs/drift_report.json")
MLFLOW_TRACKING_URI = "file:./mlruns"

# Features to monitor for drift
MONITOR_FEATURES = [
    "days_to_departure", "day_of_week", "is_weekend", "stops", "duration_hours"
]
CATEGORICAL_MONITOR_FEATURES = [
    "Airline", "Source", "Destination", "Travel_Class", "departure_time_category"
]
TARGET = "Price"

# Drift thresholds
PSI_THRESHOLD = 0.2
KS_THRESHOLD = 0.05  # p-value threshold

def population_stability_index(
    expected: np.ndarray, 
    actual: np.ndarray, 
    buckets: int = 10
) -> float:
    """
    Calculate Population Stability Index (PSI) between two distributions.
    PSI < 0.1: No significant drift
    0.1 <= PSI < 0.2: Moderate drift
    PSI >= 0.2: Significant drift
    """
    # Create bins based on expected distribution
    try:
        _, bins = np.histogram(expected, bins=buckets)
        # Ensure bins cover actual range too
        bins = np.linspace(
            min(expected.min(), actual.min()),
            max(expected.max(), actual.max()),
            buckets + 1
        )
    except Exception:
        return 0.0
    
    expected_hist, _ = np.histogram(expected, bins=bins)
    actual_hist, _ = np.histogram(actual, bins=bins)
    
    # Convert to percentages, avoid division by zero
    expected_pct = expected_hist / max(expected_hist.sum(), 1)
    actual_pct = actual_hist / max(actual_hist.sum(), 1)
    
    # Replace zeros with small epsilon
    eps = 1e-6
    expected_pct = np.maximum(expected_pct, eps)
    actual_pct = np.maximum(actual_pct, eps)
    
    psi = np.sum((actual_pct - expected_pct) * np.log(actual_pct / expected_pct))
    return float(psi)

def ks_test_drift(expected: np.ndarray, actual: np.ndarray) -> Dict[str, float]:
    """
    Perform Kolmogorov-Smirnov test for distribution drift.
    Returns statistic and p-value.
    """
    try:
        statistic, p_value = stats.ks_2samp(expected, actual)
        return {"statistic": float(statistic), "p_value": float(p_value)}
    except Exception:
        return {"statistic": 0.0, "p_value": 1.0}

def chi_square_drift(expected: pd.Series, actual: pd.Series) -> Dict[str, float]:
    """
    Perform Chi-square test for categorical feature drift.
    """
    try:
        # Get all categories
        all_cats = set(expected.unique()) | set(actual.unique())
        
        # Create contingency table
        expected_counts = expected.value_counts().reindex(all_cats, fill_value=1)
        actual_counts = actual.value_counts().reindex(all_cats, fill_value=1)
        
        # Chi-square test
        chi2, p_value = stats.chisquare(actual_counts, expected_counts)
        return {"statistic": float(chi2), "p_value": float(p_value)}
    except Exception:
        return {"statistic": 0.0, "p_value": 1.0}

def load_reference_data() -> pd.DataFrame:
    """Load training data as reference distribution."""
    df = pd.read_csv(TRAINING_DATA_FILE)
    df = clean_and_feature_engineer(df)
    # Use a sample for efficiency
    if len(df) > 10000:
        df = df.sample(n=10000, random_state=42)
    return df

def load_prediction_logs(days: int = 30) -> pd.DataFrame:
    """Load recent prediction logs."""
    if not PREDICTION_LOG_FILE.exists():
        return pd.DataFrame()
    
    df = pd.read_csv(PREDICTION_LOG_FILE)
    if len(df) == 0:
        return df
    
    # Filter by date - parse timestamps as UTC
    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
    cutoff = pd.Timestamp.utcnow() - pd.Timedelta(days=days)
    df = df[df["timestamp"] >= cutoff]
    
    return df

def detect_drift() -> Dict[str, Any]:
    """
    Main drift detection function.
    Returns drift report with status and details.
    """
    print("=" * 60)
    print("MODEL MONITORING & DRIFT DETECTION")
    print("=" * 60)
    
    # Load reference (training) data
    print("Loading reference training data...")
    ref_df = load_reference_data()
    print(f"Reference samples: {len(ref_df)}")
    
    # Load recent predictions
    print("Loading recent prediction logs...")
    pred_df = load_prediction_logs(days=30)
    print(f"Recent predictions: {len(pred_df)}")
    
    if len(pred_df) < 50:
        return {
            "status": "INSUFFICIENT_DATA",
            "message": f"Only {len(pred_df)} predictions in last 30 days. Need at least 50 for drift detection.",
            "model_version": None,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "drift_detected": False,
            "features_checked": 0,
            "reference_samples": len(ref_df),
            "prediction_samples": len(pred_df),
            "drift_details": {}
        }
    
    # Get model version from latest prediction
    model_version = pred_df["model_version"].iloc[-1] if "model_version" in pred_df.columns else "unknown"
    
    drift_details = {}
    drift_detected = False
    
    # Check numerical features
    print("\n--- Numerical Feature Drift (PSI & KS) ---")
    for feature in MONITOR_FEATURES:
        if feature not in ref_df.columns or feature not in pred_df.columns:
            continue
        
        ref_vals = ref_df[feature].dropna().values
        pred_vals = pred_df[feature].dropna().values
        
        if len(ref_vals) < 10 or len(pred_vals) < 10:
            continue
        
        # PSI
        psi = population_stability_index(ref_vals, pred_vals)
        
        # KS Test
        ks_result = ks_test_drift(ref_vals, pred_vals)
        
        is_drift = psi >= PSI_THRESHOLD or ks_result["p_value"] < KS_THRESHOLD
        
        if is_drift:
            drift_detected = True
        
        drift_details[feature] = {
            "type": "numerical",
            "psi": round(psi, 4),
            "psi_threshold": PSI_THRESHOLD,
            "ks_statistic": round(ks_result["statistic"], 4),
            "ks_p_value": round(ks_result["p_value"], 4),
            "ks_threshold": KS_THRESHOLD,
            "drift_detected": is_drift,
            "ref_mean": round(float(ref_vals.mean()), 2),
            "ref_std": round(float(ref_vals.std()), 2),
            "pred_mean": round(float(pred_vals.mean()), 2),
            "pred_std": round(float(pred_vals.std()), 2)
        }
        
        status = "DRIFT" if is_drift else "OK"
        print(f"  {feature}: PSI={psi:.4f}, KS_p={ks_result['p_value']:.4f} [{status}]")
    
    # Check categorical features
    print("\n--- Categorical Feature Drift (Chi-square) ---")
    for feature in CATEGORICAL_MONITOR_FEATURES:
        if feature not in ref_df.columns or feature not in pred_df.columns:
            continue
        
        ref_vals = ref_df[feature].dropna()
        pred_vals = pred_df[feature].dropna()
        
        if len(ref_vals) < 10 or len(pred_vals) < 10:
            continue
        
        chi2_result = chi_square_drift(ref_vals, pred_vals)
        is_drift = chi2_result["p_value"] < 0.05
        
        if is_drift:
            drift_detected = True
        
        drift_details[feature] = {
            "type": "categorical",
            "chi2_statistic": round(chi2_result["statistic"], 4),
            "chi2_p_value": round(chi2_result["p_value"], 4),
            "drift_detected": is_drift,
            "ref_categories": ref_vals.value_counts().to_dict(),
            "pred_categories": pred_vals.value_counts().to_dict()
        }
        
        status = "DRIFT" if is_drift else "OK"
        print(f"  {feature}: Chi2_p={chi2_result['p_value']:.4f} [{status}]")
    
    # Check prediction distribution drift
    print("\n--- Prediction Distribution Drift ---")
    if "predicted_price_inr" in pred_df.columns:
        ref_prices = ref_df[TARGET].dropna().values
        pred_prices = pred_df["predicted_price_inr"].dropna().values
        
        if len(pred_prices) > 10:
            psi = population_stability_index(ref_prices, pred_prices)
            ks_result = ks_test_drift(ref_prices, pred_prices)
            is_drift = psi >= PSI_THRESHOLD or ks_result["p_value"] < KS_THRESHOLD
            
            if is_drift:
                drift_detected = True
            
            drift_details["predicted_price_inr"] = {
                "type": "prediction",
                "psi": round(psi, 4),
                "psi_threshold": PSI_THRESHOLD,
                "ks_statistic": round(ks_result["statistic"], 4),
                "ks_p_value": round(ks_result["p_value"], 4),
                "drift_detected": is_drift,
                "ref_mean": round(float(ref_prices.mean()), 2),
                "pred_mean": round(float(pred_prices.mean()), 2)
            }
            
            status = "DRIFT" if is_drift else "OK"
            print(f"  predicted_price_inr: PSI={psi:.4f}, KS_p={ks_result['p_value']:.4f} [{status}]")
    
    # Overall status
    overall_status = "DRIFT_DETECTED" if drift_detected else "STABLE"
    
    print(f"\n{'='*60}")
    print(f"OVERALL STATUS: {overall_status}")
    print(f"{'='*60}")
    
    report = {
        "status": overall_status,
        "model_version": model_version,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "drift_detected": drift_detected,
        "features_checked": len(drift_details),
        "reference_samples": len(ref_df),
        "prediction_samples": len(pred_df),
        "drift_details": drift_details
    }
    
    return report

def save_drift_report(report: Dict[str, Any]):
    """Save drift report to JSON file."""
    DRIFT_REPORT_FILE.parent.mkdir(exist_ok=True)
    with open(DRIFT_REPORT_FILE, "w") as f:
        json.dump(report, f, indent=2)
    print(f"Drift report saved to {DRIFT_REPORT_FILE}")

def log_to_mlflow(report: Dict[str, Any]):
    """Log drift metrics to MLflow."""
    try:
        import mlflow
        mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
        
        with mlflow.start_run(run_name=f"drift_check_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}") as run:
            mlflow.log_param("model_version", report.get("model_version", "unknown"))
            mlflow.log_param("drift_status", report["status"])
            mlflow.log_metric("features_checked", report["features_checked"])
            mlflow.log_metric("reference_samples", report["reference_samples"])
            mlflow.log_metric("prediction_samples", report["prediction_samples"])
            mlflow.log_metric("drift_detected", 1 if report["drift_detected"] else 0)
            
            # Log individual feature drift metrics
            for feature, details in report.get("drift_details", {}).items():
                if details["type"] == "numerical":
                    mlflow.log_metric(f"psi_{feature}", details["psi"])
                    mlflow.log_metric(f"ks_p_{feature}", details["ks_p_value"])
                elif details["type"] == "categorical":
                    mlflow.log_metric(f"chi2_p_{feature}", details["chi2_p_value"])
            
            mlflow.log_artifact(str(DRIFT_REPORT_FILE))
            print(f"MLflow drift run ID: {run.info.run_id}")
    except Exception as e:
        print(f"MLflow logging failed: {e}")

def main():
    report = detect_drift()
    save_drift_report(report)
    log_to_mlflow(report)
    
    # Print summary for CI/CD
    if report["drift_detected"]:
        print("\n[WARNING] DRIFT DETECTED - Consider retraining!")
        exit(1)
    else:
        print("\n[OK] No significant drift detected.")
        exit(0)

if __name__ == "__main__":
    main()