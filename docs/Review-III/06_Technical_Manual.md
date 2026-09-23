# 📄 Technical Manual — Review III

## 1. Architecture Overview
Voyage AI uses a decoupled microservices pattern:
* **Frontend**: Next.js 16 (App Router), Framer Motion, Tailwind CSS v4.
* **Backend**: FastAPI (Python 3.10), Uvicorn ASGI Server.
* **ML Layer**: Custom gradient descent regressor, MLflow, DVC, Docker.

## 2. Source Code Structure

```
voyage-ai/
├── .github/workflows/mlops.yml   # GitHub Actions automation pipeline
├── docs/                         # Formal Review I, II, & III documentation folders
│   ├── Review-I/                 # Proposal, Literature Survey, Dataset, EDA, Baseline, Architecture
│   ├── Review-II/                # Technical Implementation, DVC, MLflow, Testing, Deployment, Monitoring
│   └── Review-III/               # Final Report, Deployment, CI/CD, Monitoring, User & Tech Manuals
├── ml/                           # Python Machine Learning codebase
│   ├── data/flight_prices.csv    # Raw dataset
│   ├── models/baseline_model_v1.pkl # Model weights & bias binary
│   ├── app.py                    # REST API server
│   ├── Dockerfile                # Docker container build script
│   ├── dvc.yaml                  # DVC pipeline declaration
│   ├── eda.ipynb                 # EDA analysis notebook
│   ├── generate_data.py          # Dataset synthesizer
│   ├── monitor.py                # Drift detection monitoring script
│   ├── requirements.txt          # Python dependencies
│   └── train.py                  # Model training engine
├── prisma/schema.prisma          # Database ORM model definitions
├── src/                          # Next.js frontend code
│   └── app/                      # Page components & API routes
├── deployment.md                 # Production deployment manual
└── README.md                     # Project homepage
```

## 3. Maintenance Guide
* **Model Retraining**: Triggered automatically when `monitor.py` detects feature drift $>0.15$. Manual execution via `python ml/train.py`.
* **Dependency Upgrades**: Python packages declared in `ml/requirements.txt`; Node.js dependencies declared in `package.json`.
