# VoyageAI Deployment Architecture Guide

Deploying this enterprise-grade travel platform requires splitting the application into two distinct services: the **Next.js Frontend** and the **Python FastAPI Backend**.

---

## 1. Deploying the Frontend (Vercel)

Vercel is the creator of Next.js and provides the absolute best hosting experience for the frontend.

### Steps:
1. **Push to GitHub**: Push your `voyage-ai` Next.js directory to a GitHub repository.
2. **Import to Vercel**: Log into [Vercel](https://vercel.com/) and click "Add New Project". Import your GitHub repository.
3. **Environment Variables**: In the Vercel project settings, you must define the following variables:
   - `NEXTAUTH_URL` = `https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET` = (Generate a random 32-character string)
   - `NEXT_PUBLIC_API_URL` = The URL of your deployed Python backend (e.g., `https://voyage-api.onrender.com`)
4. **Deploy**: Click Deploy. Vercel will automatically detect Next.js and build the application.

> [!WARNING]
> You are currently using **SQLite** (`dev.db`). Vercel has a read-only filesystem, so SQLite will not persist data across deployments. You must switch to a cloud database like **Vercel Postgres**, **Supabase**, or **Neon**.
> To do this, change the `provider` in `prisma/schema.prisma` from `"sqlite"` to `"postgresql"` and update the `DATABASE_URL` in Vercel to point to your new cloud database.

---

## 2. Deploying the ML Backend (Render or Railway)

Since your backend uses Python, FastAPI, and heavy Machine Learning models (`.joblib` files), you need a persistent containerized environment. [Render](https://render.com/) or [Railway](https://railway.app/) are the best choices.

### Steps (Render):
1. **Push to GitHub**: Push your root directory (containing `src/api.py`, `requirements.txt`, and `outputs/models/`) to GitHub.
2. **Create Web Service**: Log into Render, click "New Web Service", and connect your repository.
3. **Configuration**:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.api:app --host 0.0.0.0 --port 10000`
4. **Deploy**: Click "Create Web Service". Render will boot up your ML models and provide you with a live URL.

### Connecting the Two:
Once your Python backend is live, copy its URL and paste it into Vercel as `NEXT_PUBLIC_API_URL`. Ensure your frontend Next.js API routes (e.g., `api/trip/route.ts`) use this environment variable instead of hardcoded `127.0.0.1:8000`.

---

## Final Checklist
- [ ] Database migrated to PostgreSQL.
- [ ] Next.js deployed on Vercel ([https://voyage-liart-six.vercel.app](https://voyage-liart-six.vercel.app)).
- [ ] FastAPI deployed on Render.
- [ ] API routes updated to point to the live backend URL.
