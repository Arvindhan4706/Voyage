"""
Data Validation Tests
Tests for dataset schema, quality, and integrity.
"""

import pytest
import pandas as pd
from pathlib import Path

DATA_PATH = Path("data/flight_prices.csv")

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

VALID_TRAVEL_CLASSES = ["Economy", "Premium Economy", "Business", "First"]
VALID_TIME_CATEGORIES = ["Early Morning", "Morning", "Afternoon", "Evening", "Night"]

@pytest.fixture(scope="session")
def flight_data():
    """Load flight data once per session."""
    if not DATA_PATH.exists():
        pytest.skip(f"Data file not found at {DATA_PATH}")
    return pd.read_csv(DATA_PATH)

def test_data_file_exists():
    """Verify data file exists."""
    assert DATA_PATH.exists(), f"Data file not found at {DATA_PATH}"

def test_required_columns_exist(flight_data):
    """Verify all required columns are present."""
    required = ALL_FEATURES + [TARGET]
    missing = set(required) - set(flight_data.columns)
    assert not missing, f"Missing columns: {missing}"

def test_no_null_values(flight_data):
    """Verify no null values in critical columns."""
    for col in ALL_FEATURES + [TARGET]:
        null_count = flight_data[col].isnull().sum()
        assert null_count == 0, f"Column {col} has {null_count} null values"

def test_no_negative_numerical(flight_data):
    """Verify no negative values in numerical features."""
    for col in NUMERICAL_FEATURES:
        negative_count = (flight_data[col] < 0).sum()
        assert negative_count == 0, f"Column {col} has {negative_count} negative values"

def test_price_positive(flight_data):
    """Verify target prices are positive."""
    assert (flight_data[TARGET] > 0).all(), "Found non-positive prices"

def test_travel_class_values(flight_data):
    """Verify travel_class has valid values."""
    invalid = set(flight_data["travel_class"].unique()) - set(VALID_TRAVEL_CLASSES)
    assert not invalid, f"Invalid travel_class values: {invalid}"

def test_time_category_values(flight_data):
    """Verify departure_time_category has valid values."""
    invalid = set(flight_data["departure_time_category"].unique()) - set(VALID_TIME_CATEGORIES)
    assert not invalid, f"Invalid time_category values: {invalid}"

def test_day_of_week_range(flight_data):
    """Verify day_of_week is 0-6."""
    assert flight_data["day_of_week"].between(0, 6).all(), "day_of_week out of range"

def test_month_range(flight_data):
    """Verify month is 1-12."""
    assert flight_data["month"].between(1, 12).all(), "month out of range"

def test_is_weekend_binary(flight_data):
    """Verify is_weekend is 0 or 1."""
    assert set(flight_data["is_weekend"].unique()).issubset({0, 1}), "is_weekend not binary"

def test_stops_range(flight_data):
    """Verify stops is 0-2."""
    assert flight_data["stops"].between(0, 2).all(), "stops out of range"

def test_demand_index_range(flight_data):
    """Verify demand_index is in reasonable range."""
    assert flight_data["demand_index"].between(0.3, 2.5).all(), "demand_index out of range"

def test_distance_positive(flight_data):
    """Verify distance_km is positive."""
    assert (flight_data["distance_km"] > 0).all(), "distance_km not positive"

def test_source_destination_different(flight_data):
    """Verify source and destination are different."""
    same = (flight_data["source"] == flight_data["destination"]).sum()
    assert same == 0, f"Found {same} rows with same source and destination"

def test_minimum_rows(flight_data):
    """Verify dataset has minimum required rows."""
    assert len(flight_data) >= 1000, f"Dataset too small: {len(flight_data)} rows"

def test_categorical_coverage(flight_data):
    """Verify all travel classes are represented."""
    for cls in VALID_TRAVEL_CLASSES:
        count = (flight_data["travel_class"] == cls).sum()
        assert count > 0, f"Travel class '{cls}' not represented in data"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])