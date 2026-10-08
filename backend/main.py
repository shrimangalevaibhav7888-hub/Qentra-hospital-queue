import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_initial_data
from app.services.socket_service import sio
from app.routers import (
    auth_router,
    queue_router,
    appointments_router,
    patients_router,
    admin_router,
    notifications_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed initial demo data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()
    yield
    # Shutdown: Cleanup if needed

fastapi_app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-ready FastAPI backend for Qentra Hospital Patient Queue Management",
    lifespan=lifespan
)

# CORS Middleware Configuration (Supports Localhost & Vercel)
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production and staging support
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
fastapi_app.include_router(auth_router)
fastapi_app.include_router(queue_router)
fastapi_app.include_router(appointments_router)
fastapi_app.include_router(patients_router)
fastapi_app.include_router(admin_router)
fastapi_app.include_router(notifications_router)

@fastapi_app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "healthy",
        "docs": "/docs"
    }

@fastapi_app.get("/health")
def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

# Combine FastAPI with Socket.IO ASGI server
app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

if __name__ == "__main__":
    port = int(os.getenv("PORT", settings.PORT))
    host = os.getenv("HOST", settings.HOST)
    print(f"[Qentra Backend] Starting FastAPI Server on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
