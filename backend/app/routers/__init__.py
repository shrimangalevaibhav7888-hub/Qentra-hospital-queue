from app.routers.auth import router as auth_router
from app.routers.queue import router as queue_router
from app.routers.appointments import router as appointments_router
from app.routers.patients import router as patients_router
from app.routers.admin import router as admin_router
from app.routers.notifications import router as notifications_router

__all__ = [
    "auth_router",
    "queue_router",
    "appointments_router",
    "patients_router",
    "admin_router",
    "notifications_router"
]
