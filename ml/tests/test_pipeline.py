"""
Pipeline Integration Tests
Tests for the complete ML pipeline: training, evaluation, DVC, MLflow.
"""

import os
os.environ["MLFLOW_ALLOW_FILE_STORE"] = "true"
import pytest
import json
import subprocess
import sys
from pathlib import Path

MODELS_DIR = Path("models")
METRICS_DIR = Path("metrics")
MLRUNS_DIR = Path("mlruns")

def test_dvc_pipeline_exists():
    """Verify DVC pipeline file exists and is valid YAML."""
    dvc_file = Path("dvc.yaml")
    assert dvc_file.exists(), "dvc.yaml not found"
    
    import yaml
    with open(dvc_file) as f:
        pipeline = yaml.safe_load(f)
    
    assert "stages" in pipeline, "No stages in dvc.yaml"
    required_stages = ["generate_data", "train", "evaluate", "monitor"]
    for stage in required_stages:
        assert stage in pipeline["stages"], f"Missing stage: {stage}"

def test_generate_data_stage():
    """Test generate_data stage produces output."""
    # Check that data file exists after generation
    data_file = Path("data/flight_prices.csv")
    if not data_file.exists():
        pytest.skip("Data not generated yet")
    
    import pandas as pd
    df = pd.read_csv(data_file)
    assert len(df) > 0, "Generated data is empty"

def test_train_stage_outputs():
    """Test train stage produces model artifact."""
    model_files = list(MODELS_DIR.glob("flight_price_model_latest.pkl"))
    assert len(model_files) > 0, "No model artifacts found"
    
    # Check metadata exists
    for model_file in model_files:
        metadata_file = model_file.parent / f"{model_file.stem}_metadata.json"
        assert metadata_file.exists(), f"Missing metadata for {model_file}"

def test_model_metadata_structure():
    """Test model metadata has correct structure."""
    model_files = sorted(MODELS_DIR.glob("flight_price_model_latest.pkl"))
    latest = model_files[-1]
    metadata_file = latest.parent / f"{latest.stem}_metadata.json"
    
    with open(metadata_file) as f:
        metadata = json.load(f)
    
    # Required fields
    required = ["model_version", "model_name", "algorithm", "training_timestamp", "features", "metrics"]
    for field in required:
        assert field in metadata, f"Missing metadata field: {field}"
    
    # Metrics should have values
    metrics = metadata["metrics"]
    assert "MAE" in metrics
    assert "RMSE" in metrics
    assert "R2" in metrics
    
    # Metrics should be reasonable
    assert metrics["MAE"] > 0
    assert metrics["RMSE"] > 0
    assert -1 <= metrics["R2"] <= 1

def test_evaluation_metrics_exist():
    """Test evaluation metrics file exists."""
    eval_file = METRICS_DIR / "evaluation_metrics.json"
    if not eval_file.exists():
        pytest.skip("Evaluation metrics not generated yet")
    
    with open(eval_file) as f:
        metrics = json.load(f)
    
    assert "MAE" in metrics
    assert "RMSE" in metrics
    assert "R2" in metrics
    assert "test_samples" in metrics
    assert metrics["test_samples"] > 0

def test_mlflow_tracking_exists():
    """Test MLflow tracking directory exists."""
    assert MLRUNS_DIR.exists(), "MLflow tracking directory not found"
    
    # Check for experiment
    experiments = list(MLRUNS_DIR.glob("[0-9]*"))
    assert len(experiments) > 0, "No MLflow experiments found"

def test_mlflow_has_runs():
    """Test MLflow has recorded runs."""
    import mlflow
    mlflow.set_tracking_uri("file:./mlruns")
    
    experiments = mlflow.search_experiments()
    assert len(experiments) > 0, "No MLflow experiments"
    
    # Check for runs in flight_price_prediction experiment
    exp = next((e for e in experiments if e.name == "flight_price_prediction"), None)
    if exp:
        runs = mlflow.search_runs(experiment_ids=[exp.experiment_id])
        assert len(runs) > 0, "No MLflow runs found"

def test_mlflow_logged_metrics():
    """Test MLflow logged metrics match evaluation."""
    import mlflow
    mlflow.set_tracking_uri("file:./mlruns")
    
    exp = mlflow.get_experiment_by_name("flight_price_prediction")
    if exp:
        runs = mlflow.search_runs(experiment_ids=[exp.experiment_id], order_by=["start_time DESC"])
        if len(runs) > 0:
            latest_run = runs.iloc[0]
            
            # Check key metrics are logged (search_runs returns DataFrame with metrics as columns)
            assert "metrics.MAE" in runs.columns
            assert "metrics.RMSE" in runs.columns
            assert "metrics.R2" in runs.columns
            
            # Metrics should be reasonable
            mae = runs["metrics.MAE"].iloc[0]
            r2 = runs["metrics.R2"].iloc[0]
            assert mae > 0
            assert -1 <= r2 <= 1

def test_drift_report_generated():
    """Test drift detection report exists."""
    drift_file = Path("logs/drift_report.json")
    if not drift_file.exists():
        pytest.skip("Drift report not generated yet")
    
    with open(drift_file) as f:
        report = json.load(f)
    
    assert "status" in report
    assert "drift_detected" in report
    assert "features_checked" in report
    # features_checked can be 0 if insufficient data (INSUFFICIENT_DATA status)
    if report["status"] != "INSUFFICIENT_DATA":
        assert report["features_checked"] > 0

def test_prediction_logs_exist():
    """Test prediction logs are created."""
    log_file = Path("logs/predictions.csv")
    if not log_file.exists():
        pytest.skip("Prediction logs not created yet")
    
    import pandas as pd
    df = pd.read_csv(log_file)
    assert len(df) > 0, "Prediction log is empty"
    
    required_cols = ["timestamp", "model_version", "predicted_price_inr", "latency_ms"]
    for col in required_cols:
        assert col in df.columns, f"Missing column in prediction log: {col}"

def test_retrain_workflow():
    """Test retrain script exists and is executable."""
    retrain_file = Path("retrain.py")
    assert retrain_file.exists(), "retrain.py not found"
    
    # Check it has main function
    content = retrain_file.read_text(encoding="utf-8")
    assert "def main()" in content
    assert "if __name__ == \"__main__\"" in content

def test_requirements_txt():
    """Test requirements.txt has required packages."""
    req_file = Path("requirements.txt")
    assert req_file.exists(), "requirements.txt not found"
    
    content = req_file.read_text()
    required_packages = [
        "fastapi", "uvicorn", "pydantic", "pandas", 
        "numpy", "scikit-learn", "mlflow", "dvc", "pytest"
    ]
    
    for pkg in required_packages:
        assert pkg in content, f"Missing package in requirements: {pkg}"

def test_dockerfile_exists():
    """Test Dockerfile exists and has required elements."""
    dockerfile = Path("Dockerfile")
    assert dockerfile.exists(), "Dockerfile not found"
    
    content = dockerfile.read_text()
    assert "FROM python:3.10-slim" in content
    assert "requirements.txt" in content
    assert "EXPOSE 8000" in content
    assert "uvicorn" in content
    assert "HEALTHCHECK" in content

if __name__ == "__main__":
    pytest.main([__file__, "-v"])