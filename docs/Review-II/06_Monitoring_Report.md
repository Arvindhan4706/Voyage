# 📄 Monitoring Report — Review II

## 1. Tracked Metrics
The monitoring module [ml/monitor.py](file:///d:/Class%2012/MLOPS%20Project/ml/monitor.py) evaluates feature distribution statistics on the most recent 1,000 production queries.

* **Primary Drift Metric**: Mean `demand_index` shift ($\Delta_{\text{demand}} = |\bar{x}_{\text{prod}} - \mu_{\text{baseline}}|$).
* **Baseline Demand Index Mean**: `1.00`
* **Alert Threshold**: $\Delta_{\text{demand}} > 0.15$

## 2. Drift Detection Execution Logs
```text
Initializing Model Monitoring & Drift Detection...
Loading recent API inference logs...
Analyzing feature distributions for data drift...
Historical Baseline Average Demand: 1.00
Recent Production Average Demand: 1.18

[ALERT] Data drift detected in 'demand_index' feature!
[ACTION] Threshold exceeded. Automated retraining pipeline triggered.
```

## 3. Retraining Action Triggered
When drift is detected, the monitoring process emits an action signal to invoke data generation (`python generate_data.py`) and model retraining (`python train.py`), producing an updated `baseline_model_v1.pkl` binary.
