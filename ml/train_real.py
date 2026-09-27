import pandas as pd
import numpy as np
import os
import json
import mlflow
import time
import pickle
from datetime import datetime
import warnings

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import yaml

warnings.filterwarnings('ignore')

def load_data(filepath):
    df = pd.read_csv(filepath)
    return df

def clean_and_feature_engineer(df):
    df = df.copy()
    # 1. Drop missing targets
    df = df.dropna(subset=['Price'])
    # 2. Impute missing categories
    df['Airline'] = df['Airline'].fillna('Unknown')
    # 3. Drop exact duplicates
    df = df.drop_duplicates()
    
    # Dates
    df['Date_of_Journey'] = pd.to_datetime(df['Date_of_Journey'])
    
    # Feature: days_to_departure (Assuming today is min date in dataset)
    reference_date = df['Date_of_Journey'].min()
    df['days_to_departure'] = (df['Date_of_Journey'] - reference_date).dt.days
    
    df['day_of_week'] = df['Date_of_Journey'].dt.dayofweek
    df['journey_month'] = df['Date_of_Journey'].dt.month
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Departure Time processing
    def categorize_time(t_str):
        try:
            h = int(t_str.split(':')[0])
            if 4 <= h < 12: return 'Morning'
            elif 12 <= h < 17: return 'Afternoon'
            elif 17 <= h < 21: return 'Evening'
            else: return 'Night'
        except:
            return 'Unknown'
            
    df['departure_time_category'] = df['Departure_Time'].apply(categorize_time)
    
    # Duration processing
    def parse_duration(d_str):
        try:
            parts = d_str.split(' ')
            hrs = 0
            mins = 0
            for p in parts:
                if 'h' in p: hrs = int(p.replace('h', ''))
                if 'm' in p: mins = int(p.replace('m', ''))
            return hrs + mins/60.0
        except:
            return np.nan
            
    df['duration_hours'] = df['Duration'].apply(parse_duration)
    # Fill missing duration with median
    df['duration_hours'] = df['duration_hours'].fillna(df['duration_hours'].median())
    
    # Stops processing
    def parse_stops(s_str):
        if pd.isna(s_str) or 'non-stop' in s_str: return 0
        try:
            return int(s_str.split(' ')[0])
        except:
            return 0
            
    df['stops'] = df['Total_Stops'].apply(parse_stops)
    
    # Sort chronologically for splitting
    df = df.sort_values('Date_of_Journey').reset_index(drop=True)
    return df

def build_preprocessing_pipeline():
    # Categorical features to OneHot encode
    cat_cols = ['Airline', 'Source', 'Destination', 'Travel_Class', 'departure_time_category']
    # Numeric features
    num_cols = ['days_to_departure', 'day_of_week', 'journey_month', 'is_weekend', 'duration_hours', 'stops']
    
    cat_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    num_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_transformer, num_cols),
            ('cat', cat_transformer, cat_cols)
        ])
    
    features = num_cols + cat_cols
    return preprocessor, features

def get_models(params):
    return {
        'Dummy': DummyRegressor(strategy='mean'),
        'Ridge': Ridge(alpha=1.0),
        'RandomForest': RandomForestRegressor(
            n_estimators=params.get('n_estimators', 50),
            max_depth=params.get('max_depth', 15),
            min_samples_split=params.get('min_samples_split', 5),
            min_samples_leaf=params.get('min_samples_leaf', 2),
            random_state=42,
            n_jobs=-1
        ),
        'HistGradientBoosting': HistGradientBoostingRegressor(
            max_iter=150,
            learning_rate=0.1,
            max_depth=15,
            random_state=42
        )
    }

def main():
    mlflow.set_tracking_uri("sqlite:///mlruns.db")
    mlflow.set_experiment("voyage_real_data_training")
    
    try:
        with open("params.yaml", "r") as f:
            params = yaml.safe_load(f)
            train_params = params.get('train', {})
    except FileNotFoundError:
        train_params = {'n_estimators': 50, 'max_depth': 15}
    
    filepath = 'data/raw/real_flight_prices.csv'
    print(f"Loading raw data from {filepath}...")
    raw_df = load_data(filepath)
    
    print("Cleaning and engineering features...")
    df = clean_and_feature_engineer(raw_df)
    
    # Temporal Split: 70% Train, 15% Validation, 15% Test
    n = len(df)
    train_idx = int(n * 0.7)
    val_idx = int(n * 0.85)
    
    train_df = df.iloc[:train_idx]
    val_df = df.iloc[train_idx:val_idx]
    test_df = df.iloc[val_idx:]
    
    # Save test set for evaluate.py
    os.makedirs('data/processed', exist_ok=True)
    test_df.to_csv('data/processed/real_test_set.csv', index=False)
    
    y_train = train_df['Price']
    y_val = val_df['Price']
    
    preprocessor, feature_names = build_preprocessing_pipeline()
    models = get_models(train_params)
    
    best_model_name = None
    best_r2 = -float('inf')
    best_pipeline = None
    best_metrics = {}
    
    print("\nComparing models...")
    results = []
    
    for name, model in models.items():
        with mlflow.start_run(run_name=f"real_{name}"):
            print(f"Training {name}...")
            pipeline = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('model', model)
            ])
            
            start_time = time.time()
            pipeline.fit(train_df, y_train)
            train_time = time.time() - start_time
            
            preds = pipeline.predict(val_df)
            
            mae = mean_absolute_error(y_val, preds)
            rmse = np.sqrt(mean_squared_error(y_val, preds))
            r2 = r2_score(y_val, preds)
            
            mlflow.log_param("model_type", name)
            mlflow.log_metric("val_mae", mae)
            mlflow.log_metric("val_rmse", rmse)
            mlflow.log_metric("val_r2", r2)
            mlflow.log_metric("train_time", train_time)
            
            results.append({
                'Model': name,
                'MAE': mae,
                'RMSE': rmse,
                'R2': r2,
                'Time': train_time
            })
            
            if r2 > best_r2:
                best_r2 = r2
                best_model_name = name
                best_pipeline = pipeline
                best_metrics = {'mae': mae, 'rmse': rmse, 'r2': r2}
    
    print("\nModel Comparison (Validation Set):")
    res_df = pd.DataFrame(results).sort_values('R2', ascending=False)
    print(res_df.to_string(index=False))
    
    print(f"\nSelected Best Model: {best_model_name}")
    
    # Finalize best model
    os.makedirs('models', exist_ok=True)
    model_path = 'models/flight_price_model_real.pkl'
    with open(model_path, 'wb') as f:
        pickle.dump(best_pipeline, f)
        
    metadata = {
        "model_name": "voyage-flight-fare-real",
        "model_version": "2.0",
        "model_type": best_model_name,
        "training_dataset": "data/raw/real_flight_prices.csv",
        "training_rows": len(train_df),
        "validation_rows": len(val_df),
        "features": feature_names,
        "target": "Price",
        "mae": best_metrics['mae'],
        "rmse": best_metrics['rmse'],
        "r2": best_metrics['r2'],
        "trained_at": datetime.now().isoformat(),
        "data_version": "v1"
    }
    
    with open('models/flight_price_model_real_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print(f"\nSaved best model to {model_path}")

if __name__ == '__main__':
    main()
