FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-cache-recommends \
    gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML application code
COPY app.py .
COPY train.py .
COPY evaluate.py .
COPY monitor.py .
COPY retrain.py .
COPY generate_data.py .
COPY dvc.yaml .

# Create directories
RUN mkdir -p models logs data metrics

# Copy model artifacts (will be populated at build time or runtime)
COPY models/ models/

# Expose port 8000 for FastAPI
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Command to run the application using uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]