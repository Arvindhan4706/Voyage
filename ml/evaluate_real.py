import pandas as pd
import numpy as np
import pickle
import json
import mlflow
import os
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def main():
    mlflow.set_tracking_uri("sqlite:///mlruns.db")
    mlflow.set_experiment("voyage_real_data_training")
    
    test_filepath = 'data/processed/real_test_set.csv'
    model_path = 'models/flight_price_model_real.pkl'
    
    print(f"Loading test set from {test_filepath}...")
    test_df = pd.read_csv(test_filepath)
    y_test = test_df['Price']
    
    print(f"Loading model from {model_path}...")
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        
    print("Evaluating on untouched test set...")
    preds = model.predict(test_df)
    
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    
    print("\nTest Set Metrics:")
    print(f"MAE:  {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")
    print(f"R2:   {r2:.4f}")
    
    # Optional MAPE
    mask = y_test != 0
    mape = (np.abs(y_test[mask] - preds[mask]) / y_test[mask]).mean() * 100
    print(f"MAPE: {mape:.2f}%")
    
    # Log test metrics to the last run (or a new evaluation run)
    with mlflow.start_run(run_name="real_test_evaluation"):
        mlflow.log_metric("test_mae", mae)
        mlflow.log_metric("test_rmse", rmse)
        mlflow.log_metric("test_r2", r2)
        mlflow.log_metric("test_mape", mape)
        mlflow.log_param("test_rows", len(test_df))
        
    metrics = {
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
        "mape": mape
    }
    
    os.makedirs('metrics', exist_ok=True)
    with open('metrics/real_evaluation_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)

if __name__ == '__main__':
    main()
