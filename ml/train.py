"""
Flight Price Prediction Model Training Pipeline
Uses scikit-learn RandomForestRegressor with proper MLflow tracking.
"""

import os
import json
import pickle
import warnings
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd
import mlflow
import mlflow.sklearn
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

warnings.filterwarnings("ignore")

# Configuration
DATA_PATH = Path("data/flight_prices.csv")
MODEL_DIR = Path("models")
MLFLOW_TRACKING_URI = "file:./mlruns"
EXPERIMENT_NAME = "flight_price_prediction"
MODEL_NAME = "flight_price_model"

# Feature definitions
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

def setup_mlflow():
    """Initialize MLflow tracking."""
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_experiment(EXPERIMENT_NAME)
    print(f"MLflow tracking URI: {MLFLOW_TRACKING_URI}")
    print(f"MLflow experiment: {EXPERIMENT_NAME}")

def load_and_validate_data() -> pd.DataFrame:
    """Load and validate the dataset."""
    print(f"Loading data from {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    
    # Validation
    required_columns = ALL_FEATURES + [TARGET]
    missing = set(required_columns) - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    
    # Check for invalid values
    if (df[NUMERICAL_FEATURES] < 0).any().any():
        raise ValueError("Negative values found in numerical features")
    
    if df[TARGET].min() <= 0:
        raise ValueError("Invalid target values (price <= 0)")
    
    # Validate categorical values
    valid_classes = ["Economy", "Premium Economy", "Business", "First"]
    invalid_classes = set(df["travel_class"].unique()) - set(valid_classes)
    if invalid_classes:
        raise ValueError(f"Invalid travel_class values: {invalid_classes}")
    
    valid_times = ["Early Morning", "Morning", "Afternoon", "Evening", "Night"]
    invalid_times = set(df["departure_time_category"].unique()) - set(valid_times)
    if invalid_times:
        raise ValueError(f"Invalid departure_time_category values: {invalid_times}")
    
    print(f"Data loaded: {len(df)} rows, {len(df.columns)} columns")
    print(f"Target stats: mean={df[TARGET].mean():.0f}, std={df[TARGET].std():.0f}")
    print(f"Sources: {df['source'].nunique()}, Destinations: {df['destination'].nunique()}")
    
    return df

def create_preprocessing_pipeline() -> ColumnTransformer:
    """Create preprocessing pipeline for features."""
    categorical_transformer = OneHotEncoder(
        handle_unknown="ignore", 
        sparse_output=False,
        drop="first"
    )
    
    numerical_transformer = StandardScaler()
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", categorical_transformer, CATEGORICAL_FEATURES),
            ("num", numerical_transformer, NUMERICAL_FEATURES),
        ],
        remainder="drop"
    )
    
    return preprocessor

def train_model(
    X_train: np.ndarray, 
    y_train: np.ndarray,
    n_estimators: int = 200,
    max_depth: int = 20,
    min_samples_split: int = 5,
    min_samples_leaf: int = 2,
    random_state: int = 42
) -> Pipeline:
    """Train the RandomForest model with preprocessing pipeline."""
    
    preprocessor = create_preprocessing_pipeline()
    
    model = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        random_state=random_state,
        n_jobs=-1,
        verbose=0
    )
    
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", model)
    ])
    
    print("Training model...")
    pipeline.fit(X_train, y_train)
    
    return pipeline

def evaluate_model(pipeline: Pipeline, X_test: np.ndarray, y_test: np.ndarray) -> dict:
    """Evaluate model and return metrics."""
    y_pred = pipeline.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    metrics = {
        "MAE": round(mae, 2),
        "RMSE": round(rmse, 2),
        "R2": round(r2, 4),
        "test_samples": len(y_test)
    }
    
    print(f"--- Model Evaluation Metrics ---")
    print(f"MAE:  INR {metrics['MAE']:.2f}")
    print(f"RMSE: INR {metrics['RMSE']:.2f}")
    print(f"R²:   {metrics['R2']:.4f}")
    print(f"Test samples: {metrics['test_samples']}")
    
    return metrics

def save_model_artifacts(pipeline: Pipeline, metrics: dict, model_version: str):
    """Save model artifact and metadata."""
    MODEL_DIR.mkdir(exist_ok=True)
    
    # Save pipeline
    model_path = MODEL_DIR / f"{model_version}.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(pipeline, f)
    print(f"Model saved to {model_path}")
    
    # Save metadata
    metadata = {
        "model_version": model_version,
        "model_name": MODEL_NAME,
        "algorithm": "RandomForestRegressor",
        "training_timestamp": datetime.utcnow().isoformat() + "Z",
        "features": {
            "categorical": CATEGORICAL_FEATURES,
            "numerical": NUMERICAL_FEATURES,
            "target": TARGET
        },
        "metrics": metrics,
        "data_version": "v1.0",  # Could be DVC commit hash
    }
    
    metadata_path = MODEL_DIR / f"{model_version}_metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to {metadata_path}")
    
    return model_path, metadata_path

def log_to_mlflow(
    pipeline: Pipeline, 
    metrics: dict, 
    params: dict,
    model_version: str,
    X_train: pd.DataFrame
):
    """Log model, parameters, and metrics to MLflow."""
    with mlflow.start_run(run_name=model_version) as run:
        # Log parameters
        mlflow.log_params(params)
        
        # Log metrics
        mlflow.log_metrics(metrics)
        
        # Log dataset info
        mlflow.log_param("train_samples", len(X_train))
        mlflow.log_param("feature_count", len(ALL_FEATURES))
        mlflow.log_param("categorical_features", str(CATEGORICAL_FEATURES))
        mlflow.log_param("numerical_features", str(NUMERICAL_FEATURES))
        
        # Log model
        mlflow.sklearn.log_model(
            sk_model=pipeline,
            artifact_path="model",
            registered_model_name=MODEL_NAME
        )
        
        # Log metadata as artifact
        metadata_path = MODEL_DIR / f"{model_version}_metadata.json"
        mlflow.log_artifact(str(metadata_path))
        
        print(f"MLflow run ID: {run.info.run_id}")
        print("MLflow logging complete.")
        
        return run.info.run_id

def train_pipeline():
    """Main training pipeline."""
    print("=" * 60)
    print("FLIGHT PRICE PREDICTION - MODEL TRAINING PIPELINE")
    print("=" * 60)
    
    # Setup MLflow
    setup_mlflow()
    
    # Load and validate data
    df = load_and_validate_data()
    
    # Split features and target
    X = df[ALL_FEATURES]
    y = df[TARGET]
    
    # Train/test split (stratified by travel_class for balance)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=df["travel_class"]
    )
    
    print(f"Train: {len(X_train)} samples, Test: {len(X_test)} samples")
    
    # Model hyperparameters
    params = {
        "n_estimators": 200,
        "max_depth": 20,
        "min_samples_split": 5,
        "min_samples_leaf": 2,
        "random_state": 42
    }
    
    # Train model
    pipeline = train_model(X_train, y_train, **params)
    
    # Evaluate
    metrics = evaluate_model(pipeline, X_test, y_test)
    
    # Generate model version (deterministic for DVC)
    model_version = f"{MODEL_NAME}_latest"
    
    # Save artifacts
    model_path, metadata_path = save_model_artifacts(pipeline, metrics, model_version)
    
    # Log to MLflow
    run_id = log_to_mlflow(pipeline, metrics, params, model_version, X_train)
    
    print("=" * 60)
    print("TRAINING COMPLETE")
    print(f"Model Version: {model_version}")
    print(f"MLflow Run ID: {run_id}")
    print(f"Model Artifact: {model_path}")
    print("=" * 60)
    
    return model_version, metrics, run_id

if __name__ == "__main__":
    train_pipeline()