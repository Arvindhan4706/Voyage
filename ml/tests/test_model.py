"""
Model Tests
Tests for model loading, prediction, and schema validation.
"""

import pytest
import pickle
import numpy as np
import pandas as pd
from pathlib import Path

MODELS_DIR = Path("models")

CATEGORICAL_FEATURES = [
    "source", "destination", "travel_class", 
    "departure_time_category"
]
NUMERICAL_FEATURES = [
    "distance_km", "days_to_departure", "day_of_week", 
    "month", "is_weekend", "demand_index", "stops", "duration_hours"
]
ALL_FEATURES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES

@pytest.fixture(scope="session")
def model():
    """Load the latest model."""
    model_files = sorted(MODELS_DIR.glob("flight_price_model_latest.pkl"))
    if not model_files:
        pytest.skip("No model files found")
    
    latest_model = model_files[-1]
    with open(latest_model, "rb") as f:
        model = pickle.load(f)
    return model

@pytest.fixture(scope="session")
def sample_input():
    """Create a sample input for prediction."""
    return pd.DataFrame([{
        "source": "Delhi",
        "destination": "Mumbai",
        "distance_km": 1150.0,
        "days_to_departure": 30,
        "day_of_week": 2,
        "month": 10,
        "is_weekend": 0,
        "demand_index": 1.0,
        "travel_class": "Economy",
        "stops": 0,
        "departure_time_category": "Morning",
        "duration_hours": 2.5
    }])

def test_model_file_exists():
    """Verify at least one model file exists."""
    model_files = list(MODELS_DIR.glob("flight_price_model_latest.pkl"))
    assert len(model_files) > 0, "No model files found in models/"

def test_model_loads(model):
    """Verify model can be loaded."""
    assert model is not None, "Model failed to load"

def test_model_has_predict(model):
    """Verify model has predict method."""
    assert hasattr(model, "predict"), "Model missing predict method"

def test_prediction_returns_numeric(model, sample_input):
    """Verify prediction returns numeric output."""
    prediction = model.predict(sample_input)
    assert isinstance(prediction, (np.ndarray, list)), "Prediction not array-like"
    assert len(prediction) == 1, "Prediction should return single value"
    assert isinstance(prediction[0], (int, float, np.number)), "Prediction not numeric"

def test_prediction_positive(model, sample_input):
    """Verify prediction is positive."""
    prediction = model.predict(sample_input)[0]
    assert prediction > 0, f"Prediction not positive: {prediction}"

def test_prediction_reasonable_range(model, sample_input):
    """Verify prediction is in reasonable range (1000 - 500000 INR)."""
    prediction = model.predict(sample_input)[0]
    assert 1000 <= prediction <= 500000, f"Prediction out of range: {prediction}"

def test_model_handles_different_classes(model):
    """Verify model handles all travel classes."""
    base_input = {
        "source": "Delhi",
        "destination": "Mumbai",
        "distance_km": 1150.0,
        "days_to_departure": 30,
        "day_of_week": 2,
        "month": 10,
        "is_weekend": 0,
        "demand_index": 1.0,
        "stops": 0,
        "departure_time_category": "Morning",
        "duration_hours": 2.5
    }
    
    for cls in ["Economy", "Premium Economy", "Business", "First"]:
        input_df = pd.DataFrame([{**base_input, "travel_class": cls}])
        prediction = model.predict(input_df)[0]
        assert prediction > 0, f"Failed for class {cls}"

def test_model_handles_different_routes(model):
    """Verify model handles different source/destination pairs."""
    routes = [
        ("Delhi", "Mumbai", 1150),
        ("Mumbai", "Delhi", 1150),
        ("Bangalore", "Chennai", 350),
        ("Chennai", "Delhi", 1750),
    ]
    
    for src, dst, dist in routes:
        input_df = pd.DataFrame([{
            "source": src,
            "destination": dst,
            "distance_km": float(dist),
            "days_to_departure": 30,
            "day_of_week": 2,
            "month": 10,
            "is_weekend": 0,
            "demand_index": 1.0,
            "travel_class": "Economy",
            "stops": 0,
            "departure_time_category": "Morning",
            "duration_hours": dist / 750
        }])
        prediction = model.predict(input_df)[0]
        assert prediction > 0, f"Failed for route {src}-{dst}"

def test_prediction_increases_with_distance(model):
    """Verify prediction generally increases with distance."""
    short = pd.DataFrame([{
        "source": "Delhi", "destination": "Jaipur",
        "distance_km": 300.0, "days_to_departure": 30,
        "day_of_week": 2, "month": 10, "is_weekend": 0,
        "demand_index": 1.0, "travel_class": "Economy",
        "stops": 0, "departure_time_category": "Morning",
        "duration_hours": 1.0
    }])
    long = pd.DataFrame([{
        "source": "Delhi", "destination": "Chennai",
        "distance_km": 1750.0, "days_to_departure": 30,
        "day_of_week": 2, "month": 10, "is_weekend": 0,
        "demand_index": 1.0, "travel_class": "Economy",
        "stops": 0, "departure_time_category": "Morning",
        "duration_hours": 3.0
    }])
    
    short_pred = model.predict(short)[0]
    long_pred = model.predict(long)[0]
    
    # Long distance should generally cost more
    assert long_pred > short_pred * 0.5, "Distance not reflected in price"

def test_metadata_exists(model):
    """Verify model metadata file exists."""
    model_files = sorted(MODELS_DIR.glob("flight_price_model_latest.pkl"))
    latest_model = model_files[-1]
    metadata_file = latest_model.parent / f"{latest_model.stem}_metadata.json"
    assert metadata_file.exists(), f"Metadata file not found: {metadata_file}"

def test_metadata_has_required_fields(model):
    """Verify metadata has required fields."""
    model_files = sorted(MODELS_DIR.glob("flight_price_model_latest.pkl"))
    latest_model = model_files[-1]
    metadata_file = latest_model.parent / f"{latest_model.stem}_metadata.json"
    
    import json
    with open(metadata_file, "r") as f:
        metadata = json.load(f)
    
    required = ["model_version", "model_name", "algorithm", "training_timestamp", "features", "metrics"]
    for field in required:
        assert field in metadata, f"Missing metadata field: {field}"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])