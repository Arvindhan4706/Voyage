# 📄 MLOps Review III (Final Review) Documentation — Voyage AI

**Project Title**: Voyage AI — Intelligent Travel & Production MLOps Pipeline  
**Repository**: [Arvindhan4706/voyage](https://github.com/Arvindhan4706/voyage)  
**Stage**: Review III (Final Production MLOps Pipeline)  
**Expected Completion**: 100%  
**Maximum Marks**: 20 Marks  

---

## 1. Executive Summary & Production Readiness

**Voyage AI** is a fully automated, production-ready MLOps platform combining an interactive Next.js web application with a containerized Python machine learning serving pipeline. The system enforces continuous integration, automated retraining triggers, model drift monitoring, and zero-downtime deployment.

---

## 2. Production Architecture & Cloud Topology

```
                  +-----------------------------------+
                  |        GitHub Repository          |
                  |     Arvindhan4706/voyage          |
                  +-----------------------------------+
                                    |
                         (Push to main / PR)
                                    v
                  +-----------------------------------+
                  |   GitHub Actions CI/CD Pipeline   |
                  |     .github/workflows/mlops.yml   |
                  +-----------------------------------+
                     /                             \
  (Deploy Frontend) /                               \ (Build & Test ML)
                   v                                 v
   +-------------------------------+   +-------------------------------+
   |        Vercel Cloud           |   |       Render / Docker         |
   |   Next.js 16 Production UI    |   |    FastAPI ML Service (8000)  |
   | https://voyage-liart-six.vercel.app | |   Model Artifacts (v1.0)     |
   +-------------------------------+   +-------------------------------+
```

---

## 3. Automated CI/CD Pipeline (`.github/workflows/mlops.yml`)

The repository uses GitHub Actions for end-to-end automation:

```yaml
name: MLOps CI/CD Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Python 3.10
      uses: actions/setup-python@v4
      with:
        python-version: "3.10"

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        if [ -f ml/requirements.txt ]; then pip install -r ml/requirements.txt; fi

    - name: Train Baseline Model & Log Metrics
      run: |
        cd ml
        python generate_data.py
        python train.py

    - name: Build Docker Image
      run: |
        cd ml
        docker build -t voyage-ai-mlops:latest .

    - name: Run Model Monitor & Drift Detection
      run: |
        cd ml
        python monitor.py
```

---

## 4. Monitoring & Automated Retraining Loop

1. **Inference Logging**: Prediction inputs are evaluated by [monitor.py](file:///d:/Class%2012/MLOPS%20Project/ml/monitor.py).
2. **Drift Detection**: Feature distributions are compared against baseline statistics ($\Delta_{\text{demand}} > 0.15$).
3. **Automated Trigger**: Upon detecting data drift, an automated alert is triggered to re-run [generate_data.py](file:///d:/Class%2012/MLOPS%20Project/ml/generate_data.py) and [train.py](file:///d:/Class%2012/MLOPS%20Project/ml/train.py), building a fresh model artifact (`baseline_model_v1.pkl`).

---

## 5. Deployment Guide & URLs

* **Live Frontend Web App**: [https://voyage-liart-six.vercel.app](https://voyage-liart-six.vercel.app)
* **GitHub Repository**: [https://github.com/Arvindhan4706/voyage](https://github.com/Arvindhan4706/voyage)
* **Local Quickstart**:
```bash
# 1. Clone & install frontend dependencies
git clone https://github.com/Arvindhan4706/voyage.git
cd voyage
npm install

# 2. Run Python ML Service
cd ml
python train.py
uvicorn app:app --port 8000

# 3. Launch Next.js dev server
npm run dev
```

---

## 6. End-to-End User Manual

1. **Trip Planning**: Navigate to the home dashboard to generate personalized itineraries.
2. **Flight Price Predictor**: Select departure date, travel distance, and view ML-predicted ticket prices.
3. **Sustainability Score**: Check carbon emissions scores calculated for selected travel packages.
4. **Hotel Ranking**: Explore NLP-ranked accommodation options based on review sentiment.
