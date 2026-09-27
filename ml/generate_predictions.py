import requests
import random
import time

API_URL = "http://localhost:8000/predict"

cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Goa", "Pune"]
classes = ["Economy", "Premium Economy", "Business", "First"]
times = ["Early Morning", "Morning", "Afternoon", "Evening", "Night"]

print(f"Generating 60 predictions to populate logs/predictions.csv...")

for i in range(60):
    source = random.choice(cities)
    destination = random.choice([c for c in cities if c != source])
    
    # Introduce some artificial drift by preferring weekends or higher demand occasionally
    is_weekend = random.choice([0, 1, 1]) # Slightly more weekends
    demand_index = round(random.uniform(1.0, 2.5), 2)
    
    payload = {
        "source": source,
        "destination": destination,
        "distance_km": random.uniform(500, 2000),
        "days_to_departure": random.randint(1, 90),
        "day_of_week": random.randint(0, 6),
        "month": random.randint(1, 12),
        "is_weekend": is_weekend,
        "demand_index": demand_index,
        "travel_class": random.choice(classes),
        "stops": random.choice([0, 1]),
        "departure_time_category": random.choice(times),
        "duration_hours": random.uniform(1.0, 4.0)
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print(f"[{i+1}/60] Success: {source} -> {destination} ({payload['travel_class']}) = Rs{response.json()['predicted_price_inr']}")
        else:
            print(f"[{i+1}/60] Failed: {response.text}")
    except Exception as e:
        print(f"[{i+1}/60] Connection Error: Is FastAPI running on port 8000?")
        break
        
    time.sleep(0.1) # small delay

print("Done generating predictions!")
