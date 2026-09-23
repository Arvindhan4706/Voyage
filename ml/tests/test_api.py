"""
API Tests for FastAPI ML Service
Tests for /health, /predict, /model-info, /metrics endpoints.
"""

import pytest
import json
from pathlib import Path
from fastapi.testclient import TestClient

# Import the app
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
from app import app

client = TestClient(app)

# Ensure model is loaded for tests
@pytest.fixture(autouse=True, scope="session")
def load_model_for_tests():
    """Load model before running tests."""
    response = client.post("/reload-model")
    assert response.status_code == 200
    yield

VALID_PREDICTION_REQUEST = {
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
}

def test_health_endpoint():
    """Test /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "model_loaded" in data
    assert "uptime_seconds" in data

def test_health_model_loaded():
    """Test that model is loaded."""
    response = client.get("/health")
    data = response.json()
    # In CI, model should be loaded
    assert data["model_loaded"] is True, "Model not loaded"

def test_predict_endpoint_valid_input():
    """Test /predict with valid input."""
    response = client.post("/predict", json=VALID_PREDICTION_REQUEST)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price_inr" in data
    assert isinstance(data["predicted_price_inr"], (int, float))
    assert data["predicted_price_inr"] > 0
    assert "model_version" in data
    assert "prediction_timestamp" in data
    assert data["currency"] == "INR"

def test_predict_endpoint_invalid_travel_class():
    """Test /predict with invalid travel_class."""
    payload = VALID_PREDICTION_REQUEST.copy()
    payload["travel_class"] = "InvalidClass"
    response = client.post("/predict", json=payload)
    assert response.status_code == 422  # Validation error

def test_predict_endpoint_invalid_time_category():
    """Test /predict with invalid departure_time_category."""
    payload = VALID_PREDICTION_REQUEST.copy()
    payload["departure_time_category"] = "InvalidTime"
    response = client.post("/predict", json=payload)
    assert response.status_code == 422

def test_predict_endpoint_missing_fields():
    """Test /predict with missing required fields."""
    payload = {"source": "Delhi"}  # Missing many fields
    response = client.post("/predict", json=payload)
    assert response.status_code == 422

def test_predict_endpoint_negative_distance():
    """Test /predict with negative distance."""
    payload = VALID_PREDICTION_REQUEST.copy()
    payload["distance_km"] = -100
    response = client.post("/predict", json=payload)
    assert response.status_code == 422

def test_predict_endpoint_out_of_range_day():
    """Test /predict with invalid day_of_week."""
    payload = VALID_PREDICTION_REQUEST.copy()
    payload["day_of_week"] = 10
    response = client.post("/predict", json=payload)
    assert response.status_code == 422

def test_model_info_endpoint():
    """Test /model-info endpoint."""
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "model_version" in data
    assert "model_name" in data
    assert "algorithm" in data
    assert "training_timestamp" in data
    assert "features" in data
    assert "metrics" in data
    assert "data_version" in data

def test_metrics_endpoint():
    """Test /metrics endpoint."""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "model_version" in data
    assert "evaluation_metrics" in data
    assert "prediction_stats" in data

def test_prediction_consistency():
    """Test that same input gives same prediction."""
    response1 = client.post("/predict", json=VALID_PREDICTION_REQUEST)
    response2 = client.post("/predict", json=VALID_PREDICTION_REQUEST)
    
    assert response1.status_code == 200
    assert response2.status_code == 200
    
    pred1 = response1.json()["predicted_price_inr"]
    pred2 = response2.json()["predicted_price_inr"]
    
    assert pred1 == pred2, "Predictions not consistent for same input"

def test_different_classes_different_prices():
    """Test that different travel classes give different prices."""
    prices = {}
    for cls in ["Economy", "Premium Economy", "Business", "First"]:
        payload = VALID_PREDICTION_REQUEST.copy()
        payload["travel_class"] = cls
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        prices[cls] = response.json()["predicted_price_inr"]
    
    # Business/First should be more expensive than Economy
    assert prices["Business"] > prices["Economy"]
    assert prices["First"] > prices["Economy"]
    assert prices["Premium Economy"] > prices["Economy"]

def test_reload_model_endpoint():
    """Test /reload-model endpoint."""
    response = client.post("/reload-model")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "model_version" in data

if __name__ == "__main__":
    pytest.main([__file__, "-v"])