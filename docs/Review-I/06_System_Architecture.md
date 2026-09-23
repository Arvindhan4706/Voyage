# 📄 System Architecture — Review I

## 1. High-Level Architecture Diagram

```
+-------------------------------------------------------------+
|                     PRESENTATION LAYER                      |
|                Next.js 16 + Tailwind CSS v4                 |
|            (Live UI: voyage-liart-six.vercel.app)           |
+-------------------------------------------------------------+
                              |
                     REST API | JSON Payload
                              v
+-------------------------------------------------------------+
|                       APPLICATION LAYER                     |
|                FastAPI ASGI Server (Port 8000)              |
|                    (Python Uvicorn Service)                 |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      ML INFERENCE ENGINE                    |
|             Model Artifact: baseline_model_v1.pkl           |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                    MLOPS & DATA PIPELINE                    |
|       DVC (Data Version Control) + MLflow Experiment Logs   |
|         Drift Monitoring (monitor.py) + GitHub Actions      |
+-------------------------------------------------------------+
```

## 2. End-to-End MLOps Lifecycle Diagram

$$\text{Data Generation} \xrightarrow{\text{DVC}} \text{Preprocessing} \xrightarrow{\text{MLflow}} \text{Model Training} \xrightarrow{\text{Pickle}} \text{Dockerization} \xrightarrow{\text{FastAPI REST}} \text{Monitoring}$$

## 3. Team Role Allocation & Responsibilities

| Team Member | Role | Assigned Tasks & Deliverables |
|---|---|---|
| **Arvindhan** (Lead) | Lead MLOps Engineer & Full-Stack Developer | Project planning, ML algorithm design, FastAPI backend development, MLflow experiment logging, Docker containerization, Next.js UI integration, GitHub Actions CI/CD setup, documentation. |
