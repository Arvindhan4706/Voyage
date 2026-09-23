# 📄 User Manual — Review III

## 1. Installation Guide
```bash
# Clone the official repository
git clone https://github.com/Arvindhan4706/voyage.git
cd voyage

# Install Next.js frontend dependencies
npm install

# Setup database schema
npx prisma db push
```

## 2. Usage Instructions
1. **Launch Next.js App**: Run `npm run dev` and open `http://localhost:3000`.
2. **Launch Python ML Service**: Run `python ml/app.py` to start the backend on port 8000.
3. **Flight Price Predictor**: Enter flight distance, days to departure, and demand index in the UI flight search widget to receive instant ML price predictions.
4. **Eco-Sustainability Score**: View calculated carbon emission ratings for selected destinations.

## 3. Troubleshooting Guide

| Issue | Cause | Solution |
|---|---|---|
| Model predictions fail | `baseline_model_v1.pkl` missing | Run `python ml/train.py` to train and save the model file. |
| API returns Connection Refused | FastAPI backend not running | Ensure `python ml/app.py` is active on `http://localhost:8000`. |
| Database errors on startup | SQLite dev.db uninitialized | Execute `npx prisma db push` to generate the local schema. |
