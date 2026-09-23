# 📄 DVC Documentation — Review II

## 1. Dataset Versions & Versioning Strategy
Data Version Control (DVC) is configured to track raw datasets (`ml/data/flight_prices.csv`) and model binaries (`ml/models/baseline_model_v1.pkl`) without bloating Git source history.

* **Version 1.0 (Initial Baseline)**: 5,000 flight records generated on initial baseline fit.
* **DVC Tracking Hash**: `a8f92e104b7c8912`
* **Remote Storage**: Configured local `.dvc/cache` and S3/DAGsHub remote bucket compatibility.

## 2. DVC Pipeline Stages (`ml/dvc.yaml`)

```yaml
stages:
  generate_data:
    cmd: python generate_data.py
    deps:
    - generate_data.py
    outs:
    - data/flight_prices.csv

  train:
    cmd: python train.py
    deps:
    - train.py
    - data/flight_prices.csv
    outs:
    - models/baseline_model_v1.pkl

  evaluate_and_monitor:
    cmd: python monitor.py
    deps:
    - monitor.py
    - data/flight_prices.csv
    - models/baseline_model_v1.pkl
```

## 3. Executing the DVC Pipeline
```bash
# Reproduce full pipeline execution
dvc repro

# Check pipeline status and dependencies
dvc status
```
