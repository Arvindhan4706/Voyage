"""
Synthetic Flight Price Dataset Generator
Generates reproducible route-aware flight pricing data for MLOps demonstration.

IMPORTANT: This is a REPRODUCIBLE SYNTHETIC dataset. The model trained on this data
should NOT be interpreted as having real-time airline fare accuracy.
"""

import csv
import random
import os
from typing import List, Dict

# Fixed seed for reproducibility
RANDOM_SEED = 42

# Indian cities with approximate pairwise distances (km)
CITY_DATA: List[Dict] = [
    {"name": "Delhi", "code": "DEL", "lat": 28.6139, "lon": 77.2090},
    {"name": "Mumbai", "code": "BOM", "lat": 19.0760, "lon": 72.8777},
    {"name": "Bangalore", "code": "BLR", "lat": 12.9716, "lon": 77.5946},
    {"name": "Chennai", "code": "MAA", "lat": 13.0827, "lon": 80.2707},
    {"name": "Kolkata", "code": "CCU", "lat": 22.5726, "lon": 88.3639},
    {"name": "Hyderabad", "code": "HYD", "lat": 17.3850, "lon": 78.4867},
    {"name": "Goa", "code": "GOI", "lat": 15.2993, "lon": 74.1240},
    {"name": "Pune", "code": "PNQ", "lat": 18.5204, "lon": 73.8567},
    {"name": "Ahmedabad", "code": "AMD", "lat": 23.0225, "lon": 72.5714},
    {"name": "Jaipur", "code": "JAI", "lat": 26.9124, "lon": 75.7873},
    {"name": "Lucknow", "code": "LKO", "lat": 26.8467, "lon": 80.9462},
    {"name": "Kochi", "code": "COK", "lat": 9.9312, "lon": 76.2673},
    {"name": "Bhubaneswar", "code": "BBI", "lat": 20.2961, "lon": 85.8245},
    {"name": "Varanasi", "code": "VNS", "lat": 25.3176, "lon": 82.9739},
    {"name": "Coimbatore", "code": "CJB", "lat": 11.0168, "lon": 76.9558},
]

TRAVEL_CLASSES = ["Economy", "Premium Economy", "Business", "First"]
DEPARTURE_TIME_CATEGORIES = ["Early Morning", "Morning", "Afternoon", "Evening", "Night"]
STOPS_OPTIONS = [0, 1, 2]

# Base rate per km by travel class (INR)
CLASS_RATE_MULTIPLIER = {
    "Economy": 1.0,
    "Premium Economy": 1.5,
    "Business": 3.0,
    "First": 5.0,
}

# Base rate per km (INR)
BASE_RATE_PER_KM = 4.5

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two points in km."""
    from math import radians, sin, cos, sqrt, atan2
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

def get_distance_km(source: str, destination: str) -> float:
    """Get distance between two cities."""
    src = next(c for c in CITY_DATA if c["name"] == source)
    dst = next(c for c in CITY_DATA if c["name"] == destination)
    return round(haversine_distance(src["lat"], src["lon"], dst["lat"], dst["lon"]), 2)

def generate_flight_data(num_samples: int = 20000) -> None:
    """Generate synthetic flight pricing dataset with realistic features."""
    random.seed(RANDOM_SEED)
    os.makedirs("data", exist_ok=True)
    
    # CSV header with all required features
    fieldnames = [
        "source", "destination", "distance_km", "days_to_departure",
        "day_of_week", "month", "is_weekend", "demand_index",
        "travel_class", "stops", "departure_time_category",
        "duration_hours", "price_inr"
    ]
    
    with open("data/flight_prices.csv", "w", newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        city_names = [c["name"] for c in CITY_DATA]
        
        for _ in range(num_samples):
            # Source and destination (ensure different)
            source = random.choice(city_names)
            destination = random.choice([c for c in city_names if c != source])
            
            # Distance based on actual geography
            distance_km = get_distance_km(source, destination)
            
            # Days to departure (exponential distribution, capped at 180)
            days_to_departure = int(random.expovariate(1/30))
            days_to_departure = min(days_to_departure, 180)
            
            # Day of week (0=Monday, 6=Sunday)
            day_of_week = random.randint(0, 6)
            is_weekend = 1 if day_of_week in [5, 6] else 0
            
            # Month (1-12)
            month = random.randint(1, 12)
            
            # Demand index (0.5 to 2.0, with seasonal patterns)
            base_demand = random.gauss(1.0, 0.2)
            # Holiday seasons: Dec, Jan, Apr-May, Oct
            if month in [12, 1, 4, 5, 10]:
                base_demand *= random.uniform(1.1, 1.3)
            demand_index = round(min(max(base_demand, 0.5), 2.0), 2)
            
            # Travel class
            travel_class = random.choices(
                TRAVEL_CLASSES, 
                weights=[0.6, 0.2, 0.15, 0.05]
            )[0]
            
            # Stops (more likely for longer distances)
            if distance_km > 2000:
                stops = random.choices(STOPS_OPTIONS, weights=[0.3, 0.5, 0.2])[0]
            elif distance_km > 1000:
                stops = random.choices(STOPS_OPTIONS, weights=[0.6, 0.35, 0.05])[0]
            else:
                stops = random.choices(STOPS_OPTIONS, weights=[0.85, 0.14, 0.01])[0]
            
            # Departure time category
            departure_time_category = random.choice(DEPARTURE_TIME_CATEGORIES)
            
            # Duration hours (based on distance + stops)
            base_duration = distance_km / 750  # ~750 km/h average
            duration_hours = round(base_duration + stops * random.uniform(1.5, 3.0), 1)
            
            # Price calculation with realistic factors
            class_mult = CLASS_RATE_MULTIPLIER[travel_class]
            base_price = distance_km * BASE_RATE_PER_KM * class_mult
            
            # Day of week modifier
            dow_modifier = 1.0
            if day_of_week in [5, 6]:  # Weekend
                dow_modifier = 1.25
            elif day_of_week in [1, 2]:  # Tue, Wed
                dow_modifier = 0.90
            
            # Advance booking modifier
            advance_modifier = 1.0
            if days_to_departure < 3:
                advance_modifier = 2.0
            elif days_to_departure < 7:
                advance_modifier = 1.6
            elif days_to_departure < 14:
                advance_modifier = 1.3
            elif days_to_departure < 21:
                advance_modifier = 1.15
            elif days_to_departure > 90:
                advance_modifier = 0.85
            elif days_to_departure > 60:
                advance_modifier = 0.92
            
            # Time of day modifier
            time_modifier = 1.0
            if departure_time_category in ["Early Morning", "Night"]:
                time_modifier = 0.95
            elif departure_time_category == "Morning":
                time_modifier = 1.05
            
            # Stops modifier
            stops_modifier = 1.0 + (stops * 0.15)
            
            # Noise
            noise = random.gauss(0, base_price * 0.05)
            
            price_inr = base_price * dow_modifier * advance_modifier * demand_index * time_modifier * stops_modifier + noise
            price_inr = max(round(price_inr), 1500)
            
            writer.writerow({
                "source": source,
                "destination": destination,
                "distance_km": distance_km,
                "days_to_departure": days_to_departure,
                "day_of_week": day_of_week,
                "month": month,
                "is_weekend": is_weekend,
                "demand_index": demand_index,
                "travel_class": travel_class,
                "stops": stops,
                "departure_time_category": departure_time_category,
                "duration_hours": duration_hours,
                "price_inr": price_inr
            })
    
    print(f"Generated {num_samples} samples and saved to data/flight_prices.csv")

if __name__ == "__main__":
    generate_flight_data()