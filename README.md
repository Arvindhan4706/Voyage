# 🌍 Voyage AI — Intelligent Travel Dashboard & Flight Price Prediction Platform

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-voyage--liart--six.vercel.app-blue?style=for-the-badge)](https://voyage-liart-six.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Arvindhan4706%2Fvoyage-black?style=for-the-badge&logo=github)](https://github.com/Arvindhan4706/voyage)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![MLOps](https://img.shields.io/badge/MLOps-Complete-orange?style=for-the-badge)](https://github.com/Arvindhan4706/voyage/tree/main/ml)

---

## 🌐 Live Website

**👉 [https://voyage-liart-six.vercel.app](https://voyage-liart-six.vercel.app)**

---

## ✨ Features

- 🤖 **AI Trip Planner** — Generate personalised itineraries using AI
- 🌡️ **Real-Time Weather** — Live temperature data via Open-Meteo API
- 🏨 **Hotel Sentiment Analysis** — NLP-based hotel ranking
- 🗺️ **Interactive Destination Map** — Explore trending travel spots
- ✈️ **Flights Module** — ML-powered flight price predictions
- 💬 **Community Section** — Share travel experiences
- 📊 **Insights Dashboard** — AI-powered travel analytics
- 🎬 **Netflix-style Trending** — Video card exploration of destinations
- 💰 **Smart Budget Optimizer** — Plan trips within your budget
- 🌿 **Sustainability Tracker** — Eco-friendly travel scoring

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | Full-stack React framework |
| **Prisma + SQLite** | Local database ORM |
| **Open-Meteo API** | Real-time weather data |
| **Framer Motion** | Animations & transitions |
| **NextAuth.js** | Authentication |
| **Tailwind CSS v4** | Styling |
| **Lucide React** | Icons |
| **Three.js / R3F** | 3D elements |
| **Vercel** | Frontend deployment |
| **Python/FastAPI** | ML Model Serving |
| **scikit-learn** | RandomForestRegressor |
| **MLflow** | Experiment Tracking |
| **DVC** | Data & Pipeline Versioning |
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD |

---

## 🏗️ MLOps Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VOYAGE AI MLOps PIPELINE                          │
└─────────────────────────────────────────────────────────────────────────────┘

DATA                          TRAINING                         SERVING
┌─────────┐                   ┌─────────────┐                   ┌──────────┐
│Synthetic│                   │Preprocessing│                   │ FastAPI  │
│Flight   │──DVC─────────────▶│Feature Eng. │──MLflow──────────▶│ /predict │
│Price    │  Versioning       │RandomForest │  Tracking        │ /health  │
│Dataset  │                   │Regressor    │                  │ /model-  │
│(20K rows)                  │(200 trees)  │                  │  info    │
└─────────┘                   └─────────────┘                  │ /metrics │
      ▲                            │                            └────┬─────┘
      │                            ▼                             │
      │                     ┌─────────────┐                      │
      │                     │ Evaluation  │                      │
      │                     │ MAE: 929    │                      │
      │                     │ RMSE: 1940  │                      │
      │                     │ R²: 0.97    │                      │
      │                     └─────────────┘                      │
      │                            │                             │
      │                     ┌─────────────┐                      │
      └────────DVC──────────│ Monitoring  │◀─────────────────────┘
                            │ Drift (PSI, │
                            │    KS, χ²)  │
                            └──────┬──────┘
                                   │
                            ┌──────▼──────┐
                            │ Retraining  │
                            │ Quality     │
                            │ Gate        │
                            └─────────────┘
```

### MLOps Components

| Component | Implementation | File |
|---|---|---|
| **Data Generation** | Reproducible synthetic dataset with geographic distances | `ml/generate_data.py` |
| **Data Versioning** | DVC pipeline with `dvc.yaml` | `ml/dvc.yaml` |
| **Preprocessing** | ColumnTransformer (OneHotEncoder + StandardScaler) | `ml/train.py` |
| **Model Training** | RandomForestRegressor (200 trees, max_depth=20) | `ml/train.py` |
| **Evaluation** | MAE, RMSE, R², MAPE + per-class metrics | `ml/evaluate.py` |
| **Experiment Tracking** | MLflow (local `mlruns/`) | `ml/train.py`, `ml/evaluate.py` |
| **Model Versioning** | Timestamped versions + metadata JSON | `ml/models/` |
| **Model Serving** | FastAPI with `/predict`, `/health`, `/model-info`, `/metrics` | `ml/app.py` |
| **Prediction Logging** | CSV logs for monitoring | `ml/app.py` |
| **Drift Detection** | PSI, KS-test, Chi-square | `ml/monitor.py` |
| **Retraining** | Quality gate (MAE≤current, R²≥current) | `ml/retrain.py` |
| **Containerization** | Multi-stage Dockerfile | `ml/Dockerfile` |
| **CI/CD** | GitHub Actions (train, test, build, drift) | `.github/workflows/mlops.yml` |

---

## 🚀 Getting Started

### Frontend (Next.js)

```bash
# Clone the repository
git clone https://github.com/Arvindhan4706/voyage-ai.git
cd voyage-ai

# Install dependencies
npm install

# Set up the database
npx prisma db push
npx tsx prisma/seed.ts

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### ML Backend (FastAPI)

```bash
cd ml

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Generate synthetic data
python generate_data.py

# Train model (logs to MLflow)
python train.py

# Evaluate model
python evaluate.py

# Run FastAPI server
uvicorn app:app --host 0.0.0.0 --port 8000
```

The ML service will be available at http://localhost:8000

### Connect Frontend to ML Backend

Set environment variable in Next.js:
```bash
# .env.local
ML_SERVICE_URL=http://localhost:8000
```

### Docker (ML Service)

```bash
cd ml
docker build -t voyage-ai-mlops .
docker run -p 8000:8000 voyage-ai-mlops
```

---

## 📁 Project Structure

```
voyage-ai/
├── ml/                          # ML/MLOps Subsystem
│   ├── app.py                   # FastAPI ML Service
│   ├── train.py                 # Training Pipeline
│   ├── evaluate.py              # Model Evaluation
│   ├── monitor.py               # Drift Detection
│   ├── retrain.py               # Retraining Workflow
│   ├── generate_data.py         # Synthetic Data Generator
│   ├── dvc.yaml                 # DVC Pipeline
│   ├── Dockerfile               # Container Definition
│   ├── requirements.txt         # Python Dependencies
│   ├── test_ml.py               # Test Runner
│   ├── models/                  # Model Artifacts
│   ├── data/                    # Datasets (DVC tracked)
│   ├── metrics/                 # Evaluation Results
│   ├── logs/                    # Prediction & Drift Logs
│   ├── mlruns/                  # MLflow Tracking
│   └── tests/                   # Test Suite
│       ├── test_data.py
│       ├── test_model.py
│       ├── test_api.py
│       └── test_pipeline.py
├── src/                         # Next.js Frontend
│   ├── app/
│   │   ├── api/price/route.ts   # Price API (calls FastAPI)
│   │   └── ...
│   ├── components/
│   │   ├── FlightInsights.tsx   # ML-powered insights
│   │   ├── FlightsModule.tsx    # Flight search UI
│   │   └── ...
│   └── ...
├── prisma/                      # Database Schema
├── .github/workflows/           # CI/CD
│   └── mlops.yml
├── package.json
└── README.md
```

---

## 🔬 ML Model Details

### Features Used

| Category | Features |
|---|---|
| **Categorical** | source, destination, travel_class, departure_time_category |
| **Numerical** | distance_km, days_to_departure, day_of_week, month, is_weekend, demand_index, stops, duration_hours |
| **Target** | price_inr (INR) |

### Model Performance (Latest Training)

| Metric | Value |
|---|---|
| **MAE** | ₹929.40 |
| **RMSE** | ₹1,939.80 |
| **R²** | 0.9697 |
| **MAPE** | 7.75% |
| **Test Samples** | 4,000 |

### Per-Class Performance

| Travel Class | MAE | RMSE | Samples |
|---|---|---|---|
| Economy | ₹461 | ₹709 | 2,383 |
| Premium Economy | ₹806 | ₹1,172 | 796 |
| Business | ₹1,841 | ₹2,819 | 616 |
| First | ₹4,113 | ₹6,195 | 205 |

> **⚠️ Academic Honesty Notice**: The current model is trained on a **reproducible synthetic dataset** and its accuracy should **NOT** be interpreted as real-time airline fare accuracy. This is a student PBL project demonstrating MLOps lifecycle, not a production flight pricing system.

---

## 🔄 MLOps Lifecycle Documentation

See [MLOPS_LIFECYCLE.md](ml/MLOPS_LIFECYCLE.md) for detailed explanation of each stage:
1. Data Collection
2. Data Validation
3. DVC Versioning
4. Preprocessing
5. Model Training
6. Model Evaluation
7. MLflow Tracking
8. Model Versioning
9. FastAPI Deployment
10. Docker Containerization
11. CI/CD Pipeline
12. Prediction Logging
13. Monitoring & Drift Detection
14. Retraining Workflow
15. Model Promotion

---

## 🧪 Testing

```bash
# ML Tests
cd ml
python -m pytest tests/ -v

# Frontend Tests
cd ..
npm run lint
npm run build
```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set environment variables:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_API_URL` (ML service URL)
   - `ML_SERVICE_URL` (for server-side calls)

### ML Backend (Render/Railway)
1. Push `ml/` directory to GitHub
2. Create Web Service on Render
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app:app --host 0.0.0.0 --port 10000`
5. Set `ML_SERVICE_URL` in Vercel to the Render URL

---

## 📝 License

This is a B.Tech Project-Based Learning (PBL) project for the MLOps subject.

---

## 👨‍💻 Author

**Arvindhan** - [@Arvindhan4706](https://github.com/Arvindhan4706)

Made with ❤️ for MLOps PBL