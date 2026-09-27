"""
Voyage AI — Production Training Pipeline (Kaggle 300K Dataset)
==============================================================
Dataset : ml/data/raw/flight_data_cleaned.csv
Target  : price  (actual historical INR fare)
Strategy: 80/10/10 reproducible stratified split (no usable date field)
"""

import json
import pickle
import warnings
import hashlib
import sys
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd
import mlflow
import mlflow.sklearn

from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

warnings.filterwarnings("ignore")

# ── Paths ─────────────────────────────────────────────────────────────────────
RAW_DATA   = Path("data/raw/flight_data_cleaned.csv")
PROC_DIR   = Path("data/processed")
MODELS_DIR = Path("models")
METRICS_DIR = Path("metrics")
LOGS_DIR   = Path("logs")

for d in [PROC_DIR, MODELS_DIR, METRICS_DIR, LOGS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

MLFLOW_URI = "file:./mlruns"
RANDOM_SEED = 42

# ── Features (leakage-checked) ─────────────────────────────────────────────
# 'flight' is an integer identifier — high cardinality, not a semantic feature; excluded.
# 'duration_category' duplicates 'duration' — excluded to avoid redundancy.
CATEGORICAL_FEATURES = [
    "airline",
    "source_city",
    "destination_city",
    "departure_time",
    "arrival_time",
    "stops",
    "class",
]
NUMERICAL_FEATURES = [
    "duration",
    "days_left",
]
ALL_FEATURES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES
TARGET = "price"


# ── Helpers ────────────────────────────────────────────────────────────────────
def sha256_of_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def compute_mape(y_true, y_pred):
    mask = y_true != 0
    return float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100)


def evaluate(model, X, y, label=""):
    y_pred = model.predict(X)
    mae  = float(mean_absolute_error(y, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y, y_pred)))
    r2   = float(r2_score(y, y_pred))
    mape = compute_mape(np.array(y), y_pred)
    med_ae = float(np.median(np.abs(np.array(y) - y_pred)))
    p90_ae = float(np.percentile(np.abs(np.array(y) - y_pred), 90))
    p95_ae = float(np.percentile(np.abs(np.array(y) - y_pred), 95))
    if label:
        print(f"  {label}: MAE={mae:.0f}  RMSE={rmse:.0f}  R²={r2:.4f}  MAPE={mape:.2f}%")
    return dict(MAE=mae, RMSE=rmse, R2=r2, MAPE=mape,
                MedianAE=med_ae, P90_AE=p90_ae, P95_AE=p95_ae)


# ── Load & Validate ────────────────────────────────────────────────────────────
def load_and_validate() -> pd.DataFrame:
    print("Loading dataset …")
    df = pd.read_csv(RAW_DATA)
    assert df.shape[0] > 100_000, f"Expected 300K rows, got {df.shape[0]}"
    assert TARGET in df.columns, f"Target column '{TARGET}' missing"
    for f in ALL_FEATURES:
        assert f in df.columns, f"Feature '{f}' missing from dataset"

    # Hard validation rules
    invalid_price = (df[TARGET] <= 0).sum()
    invalid_dur   = (df["duration"] <= 0).sum()
    invalid_days  = (df["days_left"] < 0).sum()
    if invalid_price or invalid_dur or invalid_days:
        print(f"  Removing {invalid_price} invalid-price, {invalid_dur} invalid-duration, {invalid_days} negative-days rows")
        df = df[df[TARGET] > 0]
        df = df[df["duration"] > 0]
        df = df[df["days_left"] >= 0]

    df = df.drop_duplicates().reset_index(drop=True)
    print(f"  Rows after cleaning: {len(df):,}")
    return df


# ── Build Preprocessing Pipeline ──────────────────────────────────────────────
def build_preprocessor():
    cat_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="constant", fill_value="Unknown")),
        ("onehot",  OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    num_transformer = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler",  StandardScaler()),
    ])
    return ColumnTransformer([
        ("num", num_transformer, NUMERICAL_FEATURES),
        ("cat", cat_transformer, CATEGORICAL_FEATURES),
    ])


# ── Model Candidates ───────────────────────────────────────────────────────────
def get_candidates(preprocessor):
    return {
        "Dummy": Pipeline([
            ("preprocessor", preprocessor),
            ("model", DummyRegressor(strategy="mean")),
        ]),
        "Ridge": Pipeline([
            ("preprocessor", preprocessor),
            ("model", Ridge(alpha=10.0)),
        ]),
        "RandomForest": Pipeline([
            ("preprocessor", preprocessor),
            ("model", RandomForestRegressor(
                n_estimators=100,
                max_depth=15,
                min_samples_leaf=4,
                max_samples=0.5,   # use 50% of rows to avoid RAM exhaustion
                random_state=RANDOM_SEED,
                n_jobs=-1,
            )),
        ]),
        "HistGradientBoosting": Pipeline([
            ("preprocessor", preprocessor),
            ("model", HistGradientBoostingRegressor(
                max_iter=300,
                learning_rate=0.08,
                max_depth=12,
                l2_regularization=0.1,
                random_state=RANDOM_SEED,
            )),
        ]),
    }


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    dataset_hash = sha256_of_file(RAW_DATA)
    df = load_and_validate()

    X = df[ALL_FEATURES]
    y = df[TARGET]

    # Stratified split on 'class' (Economy vs Business — huge price gap)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_SEED, stratify=df["class"]
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=RANDOM_SEED,
        stratify=X_temp["class"]
    )

    print(f"\nSplit: train={len(X_train):,}  val={len(X_val):,}  test={len(X_test):,}")
    print(f"Note: No usable flight-date column -> reproducible held-out split (not temporal)")

    preprocessor = build_preprocessor()
    candidates   = get_candidates(preprocessor)

    mlflow.set_tracking_uri(MLFLOW_URI)
    mlflow.set_experiment("voyage-ai-kaggle-300k")

    print("\nTraining & comparing models …")
    results = {}
    runs    = {}

    for name, pipeline in candidates.items():
        print(f"\n  [{name}]")
        t0 = datetime.now()
        pipeline.fit(X_train, y_train)
        elapsed = (datetime.now() - t0).total_seconds()

        val_metrics  = evaluate(pipeline, X_val,  y_val,  label="val")
        train_metrics= evaluate(pipeline, X_train, y_train, label="train")

        results[name] = {"val": val_metrics, "train": train_metrics, "time_s": elapsed}

        with mlflow.start_run(run_name=name) as run:
            mlflow.log_param("model_type",    name)
            mlflow.log_param("dataset",       "flight_data_cleaned.csv")
            mlflow.log_param("dataset_hash",  dataset_hash)
            mlflow.log_param("train_rows",    len(X_train))
            mlflow.log_param("val_rows",      len(X_val))
            mlflow.log_param("test_rows",     len(X_test))
            mlflow.log_param("features",      len(ALL_FEATURES))
            mlflow.log_param("random_seed",   RANDOM_SEED)
            mlflow.log_param("split_strategy","stratified_by_class_80_10_10")
            for k, v in val_metrics.items():
                mlflow.log_metric(f"val_{k.lower()}", v)
            mlflow.sklearn.log_model(pipeline, artifact_path="model")
            runs[name] = run.info.run_id
            print(f"    MLflow run: {run.info.run_id}")

    # ── Select Champion ────────────────────────────────────────────────────────
    champion_name = min(
        {k: v for k, v in results.items() if k != "Dummy"},
        key=lambda k: results[k]["val"]["MAE"]
    )
    champion_pipeline = candidates[champion_name]

    print(f"\n{'='*60}")
    print(f"CHAMPION: {champion_name}")
    print(f"{'='*60}")

    # Evaluate on unseen test set
    test_metrics = evaluate(champion_pipeline, X_test, y_test, label="test")
    print(f"\nTest-set metrics:")
    for k, v in test_metrics.items():
        print(f"  {k}: {v:.2f}")

    # ── Save Artifacts ─────────────────────────────────────────────────────────
    model_path = MODELS_DIR / "flight_price_model_kaggle.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(champion_pipeline, f)
    print(f"\nModel saved -> {model_path}")

    # Save test split for monitoring reference
    X_test_save = X_test.copy()
    X_test_save[TARGET] = y_test.values
    X_test_save.to_csv(PROC_DIR / "kaggle_test_set.csv", index=False)

    # Save feature list
    feature_meta = {
        "categorical_features": CATEGORICAL_FEATURES,
        "numerical_features":   NUMERICAL_FEATURES,
        "all_features":         ALL_FEATURES,
        "target":               TARGET,
    }

    # Metadata
    metadata = {
        "model_name":         "voyage-flight-fare-kaggle",
        "model_version":      "3.0",
        "model_type":         champion_name,
        "dataset":            "flight_data_cleaned.csv",
        "dataset_sha256":     dataset_hash,
        "dataset_rows":       len(df),
        "training_rows":      len(X_train),
        "validation_rows":    len(X_val),
        "test_rows":          len(X_test),
        "split_strategy":     "stratified_by_class_80_10_10_reproducible",
        "split_limitation":   "No usable date column — not a temporal split",
        "features":           ALL_FEATURES,
        "target":             TARGET,
        "feature_meta":       feature_meta,
        "validation_metrics": results[champion_name]["val"],
        "test_metrics":       test_metrics,
        "all_model_results":  {k: v["val"] for k, v in results.items()},
        "champion_mlflow_run_id": runs[champion_name],
        "trained_at":         datetime.utcnow().isoformat() + "Z",
        "random_seed":        RANDOM_SEED,
        "disclaimer":         "Historical fare data. Not live airline pricing. Actual prices may vary.",
    }
    meta_path = MODELS_DIR / "flight_price_model_kaggle_metadata.json"
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved -> {meta_path}")

    # Evaluation metrics for DVC
    eval_metrics = {
        "champion_model":  champion_name,
        "test_MAE":        test_metrics["MAE"],
        "test_RMSE":       test_metrics["RMSE"],
        "test_R2":         test_metrics["R2"],
        "test_MAPE":       test_metrics["MAPE"],
        "test_MedianAE":   test_metrics["MedianAE"],
        "test_P90_AE":     test_metrics["P90_AE"],
        "test_P95_AE":     test_metrics["P95_AE"],
    }
    (METRICS_DIR / "kaggle_evaluation_metrics.json").write_text(
        json.dumps(eval_metrics, indent=2)
    )

    # Log champion test metrics back to MLflow
    with mlflow.start_run(run_id=runs[champion_name]):
        for k, v in test_metrics.items():
            mlflow.log_metric(f"test_{k.lower()}", v)
        mlflow.log_artifact(str(meta_path))
        mlflow.log_artifact(str(model_path))

    # Model comparison table
    print("\n── Model Comparison (Validation) ──")
    print(f"{'Model':<25} {'MAE':>8} {'RMSE':>8} {'R²':>8} {'MAPE':>8}")
    print("─" * 62)
    for name, res in sorted(results.items(), key=lambda x: x[1]["val"]["MAE"]):
        m = res["val"]
        flag = " ← CHAMPION" if name == champion_name else ""
        print(f"{name:<25} {m['MAE']:>8.0f} {m['RMSE']:>8.0f} {m['R2']:>8.4f} {m['MAPE']:>7.2f}%{flag}")

    print(f"\n{'='*60}")
    print("Training complete.")
    print(f"{'='*60}")
    return metadata


if __name__ == "__main__":
    main()
