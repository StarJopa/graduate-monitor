from fastapi import FastAPI
from app.core.config import settings

app = FastAPI (title="Monitoring API", version = "1.0.0")

@app.get("/health")
def health_check():
    return{"status": "ok", "db": "connected"}
