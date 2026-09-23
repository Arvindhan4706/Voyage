# 📄 Exploratory Data Analysis (EDA) Report — Review I

## 1. Feature Distributions & Visualizations
Analysis performed in [eda.ipynb](file:///d:/Class%2012/MLOPS%20Project/ml/eda.ipynb):
* **Price Distribution**: Right-skewed distribution with a primary peak between ₹4,000 and ₹8,000, and long-tail premium fare outliers for long-haul routes (>4,000 km).
* **Distance Distribution**: Bimodal distribution representing short-haul regional flights (<1,000 km) and long-haul domestic/international flights (>2,500 km).

## 2. Missing Values Analysis
* **Result**: Zero missing fields. Total valid records = 5,000 / 5,000 (100% complete dataset).

## 3. Outlier Analysis
* **Method**: Interquartile Range (IQR) analysis on target variable `price_inr`.
* **Findings**: Fares above ₹35,000 occur during emergency last-minute bookings (`days_to_departure < 3`) on high-demand holiday weekends (`demand_index > 1.8`). Outliers are retained as valid extreme domain events.

## 4. Feature Correlations

$$\begin{pmatrix}
 & \text{distance} & \text{days\_to\_dep} & \text{demand} & \text{price} \\
\text{distance} & 1.00 & 0.02 & 0.01 & \mathbf{+0.78} \\
\text{days\_to\_dep} & 0.02 & 1.00 & -0.03 & \mathbf{-0.45} \\
\text{demand} & 0.01 & -0.03 & 1.00 & \mathbf{+0.62} \\
\text{price} & \mathbf{+0.78} & \mathbf{-0.45} & \mathbf{+0.62} & 1.00
\end{pmatrix}$$

* **Distance**: Strongest positive predictor ($r = +0.78$).
* **Demand Index**: Strong positive multiplier ($r = +0.62$).
* **Days to Departure**: Moderate inverse relationship ($r = -0.45$).
