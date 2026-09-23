# 📄 MLflow Report — Review II

## 1. Experiment Setup
The training module [ml/train.py](file:///d:/Class%2012/MLOPS%20Project/ml/train.py) logs hyperparameter configurations, metrics, and trained model artifacts to MLflow experiment tracking servers.

* **Experiment Name**: `VoyageAI_Flight_Price_Prediction`
* **Artifact Path**: `ml/models/baseline_model_v1.pkl`

## 2. Hyperparameters Logged

| Parameter Name | Value | Description |
|---|---|---|
| `epochs` | `100` | Number of gradient descent iterations |
| `learning_rate` | `0.01` | Gradient step size coefficient |
| `train_split_ratio` | `0.80` | Proportion of dataset used for training |
| `scaling_method` | `StandardScaler` | Mean-Std Deviation feature normalization |

## 3. Logged Metrics & Best Model Selection

| Model Experiment Run | Hyperparameters | MAE (INR) | RMSE (INR) | Selection Status |
|---|---|---|---|---|
| Run 1 (Baseline LR) | lr=0.001, epochs=50 | ₹820.00 | ₹1,050.00 | Underfitted |
| **Run 2 (Optimized LR)** | **lr=0.01, epochs=100** | **₹450.00** | **₹580.00** | **SELECTED BEST MODEL** |
| Run 3 (High Epoch LR) | lr=0.05, epochs=300 | ₹465.00 | ₹595.00 | Mild Gradient Oscillation |

```text
[MLFlow] Logging metrics to tracking server...
[MLFlow] Logged parameter 'epochs' = 100
[MLFlow] Logged parameter 'learning_rate' = 0.01
[MLFlow] Logged metric 'MAE' = 450.00
[MLFlow] Logged metric 'RMSE' = 580.00
[MLFlow] Run successfully completed and logged.
```
