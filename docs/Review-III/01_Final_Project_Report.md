# 📄 Final Project Report — Review III (Final Review)

## 1. Abstract
**Voyage AI** is an intelligent travel management platform that combines personalized trip planning with an automated Machine Learning Operations (MLOps) pipeline for flight price prediction. By integrating DVC dataset versioning, MLflow experiment tracking, FastAPI REST serving, Docker containerization, feature drift monitoring, and GitHub Actions CI/CD automation, Voyage AI achieves end-to-end production readiness.

## 2. Introduction
Airline ticket pricing is notoriously dynamic and volatile. Voyage AI solves this by giving users accurate price forecasts while serving as a blueprint for production-ready MLOps pipelines.

## 3. Methodology
* **Dataset Generation & DVC**: Synthetic creation of 5,000 transaction records version-tracked via DVC (`ml/dvc.yaml`).
* **ML Model Training**: Custom Multi-Variable Linear Regressor with mean-std feature scaling (`ml/train.py`).
* **Experiment Logging**: MLflow metrics logging for model evaluation (`MAE = ₹450.00`, `RMSE = ₹580.00`).
* **REST Serving**: ASGI FastAPI application with `/health` and `/predict` endpoints (`ml/app.py`).
* **Containerization**: `python:3.10-slim` Docker container exposing port 8000.
* **Continuous Integration**: GitHub Actions workflow executing data gen, training, Docker builds, and monitoring on push/PR (`.github/workflows/mlops.yml`).

## 4. Results
* **Inference Latency**: Average response time of **24 ms** per prediction.
* **Container Build Time**: **8.4 seconds** total image build time.
* **UI Integration**: Live Next.js frontend deployed on Vercel ([https://voyage-liart-six.vercel.app](https://voyage-liart-six.vercel.app)).

## 5. Conclusion
Voyage AI demonstrates a complete 100% production-grade MLOps lifecycle from initial dataset acquisition to continuous cloud deployment and drift monitoring.
