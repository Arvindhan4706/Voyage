# 📄 Deployment Documentation — Review III

## 1. Docker Local & Container Deployment
Detailed in [deployment.md](file:///d:/Class%2012/MLOPS%20Project/deployment.md):

```bash
# 1. Navigate to ML directory
cd ml

# 2. Build Docker container
docker build -t voyage-ai-mlops:v1.0 .

# 3. Launch Docker container
docker run -d -p 8000:8000 --name voyage-ml-service voyage-ai-mlops:v1.0
```

## 2. Cloud Deployment Topology
* **Frontend Hosting (Vercel)**:
  * **Platform**: Vercel Cloud Serverless Edge
  * **Live URL**: [https://voyage-liart-six.vercel.app](https://voyage-liart-six.vercel.app)
  * **Environment Variables**: `NEXT_PUBLIC_API_URL` pointing to backend REST API.
* **Backend Hosting (Render / Railway)**:
  * **Platform**: Render Cloud Container Web Service
  * **Build Command**: `pip install -r ml/requirements.txt`
  * **Start Command**: `uvicorn ml.app:app --host 0.0.0.0 --port 10000`
