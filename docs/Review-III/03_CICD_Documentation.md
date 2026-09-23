# 📄 CI/CD Documentation — Review III

## 1. GitHub Actions Workflow Configuration (`.github/workflows/mlops.yml`)

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

    - name: Run Model Monitor
      run: |
        cd ml
        python monitor.py
```

## 2. Pipeline Execution Stages
1. **Automated Testing Workflow**: Checks Python syntax, generates synthetic dataset, trains model, and logs MLflow parameters.
2. **Automated Containerization**: Builds the Docker image `voyage-ai-mlops:latest`.
3. **Automated Deployment & Drift Monitoring**: Runs `monitor.py` to ensure dataset distributions are stable before production approval.
