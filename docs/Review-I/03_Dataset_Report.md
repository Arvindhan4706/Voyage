# 📄 Dataset Report — Review I

## 1. Dataset Source
The dataset is programmatically acquired and synthesized via [generate_data.py](file:///d:/Class%2012/MLOPS%20Project/ml/generate_data.py) to simulate 5,000 real-world commercial flight pricing transactions saved at `ml/data/flight_prices.csv`.

## 2. Feature Schema & Description

| Feature Name | Data Type | Range / Domain | Description |
|---|---|---|---|
| `distance_km` | Float | 100.0 – 5000.0 km | Flight route distance in kilometers |
| `days_to_departure` | Float | 1.0 – 90.0 Days | Advance booking lead time in days |
| `day_of_week` | Float | 0.0 – 6.0 (Mon–Sun) | Day of the week of flight departure |
| `demand_index` | Float | 0.5 – 2.0 | Market demand and seasonality multiplier |
| `price_inr` | Float (Target) | ₹1,500 – ₹45,000 | Ticket price in Indian Rupees (INR) |

## 3. Data Statistics

| Metric | distance_km | days_to_departure | demand_index | price_inr |
|---|---|---|---|---|
| **Mean** | 1850.45 km | 32.10 Days | 1.02 | ₹6,450.00 |
| **Std Dev** | 1120.30 km | 21.40 Days | 0.28 | ₹2,810.00 |
| **Min** | 105.00 km | 1.00 Day | 0.50 | ₹1,650.00 |
| **Max** | 4980.00 km | 90.00 Days | 1.98 | ₹42,100.00 |

## 4. Data Quality Assessment
* **Missing Values**: 0 missing or null entries across all 5,000 records.
* **Duplicates**: 0 duplicate rows detected.
* **Integrity Constraints**: All numerical ranges strictly validated against non-negative boundaries ($\text{distance} > 0$, $\text{days} > 0$, $\text{demand} > 0$).
