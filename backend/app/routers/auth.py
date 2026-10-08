import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Patient
from app.schemas.schemas import LoginRequest, DemoLoginRequest, RegisterRequest
from app.services.queue_service import add_audit_log

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/demo-login")
def demo_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.role == req.role.upper()).first()
    if not user:
        user = db.query(User).first()
    
    token = f"jwt_token_{user.id}_{int(time.time()*1000)}"
    return {
        "success": True,
        "token": token,
        "user": user.to_dict()
    }

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if not user:
        # If user not found, create or return default demo user
        user = db.query(User).first()
    
    token = f"jwt_token_{user.id}_{int(time.time()*1000)}"
    return {
        "success": True,
        "token": token,
        "user": user.to_dict()
    }

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if existing:
        token = f"jwt_token_{existing.id}_{int(time.time()*1000)}"
        return {"success": True, "token": token, "user": existing.to_dict()}
    
    is_senior = (req.age or 30) >= 60
    user_id = f"user-{int(time.time()*1000)}"
    patient_id = f"pat-{int(time.time()*1000)}"

    new_user = User(
        id=user_id,
        name=req.name,
        email=req.email.strip().lower(),
        role=req.role.upper() if req.role else "PATIENT",
        phone=req.phone or "9876543210",
        patient_id=patient_id,
        is_senior_citizen=is_senior
    )
    new_patient = Patient(
        id=patient_id,
        user_id=user_id,
        name=req.name,
        age=req.age or 30,
        gender=req.gender or "Male",
        phone=req.phone or "9876543210",
        email=req.email.strip().lower(),
        is_senior_citizen=is_senior
    )
    db.add(new_user)
    db.add(new_patient)
    db.commit()

    add_audit_log(db, "SYSTEM", req.name, "PATIENT_REGISTERED", user_id, f"Patient registered: {req.name}")
    token = f"jwt_token_{user_id}_{int(time.time()*1000)}"

    return {
        "success": True,
        "token": token,
        "user": new_user.to_dict()
    }

@router.get("/me")
def get_me(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "success": True,
        "user": user.to_dict()
    }

@router.post("/logout")
def logout():
    return {"success": True, "message": "Logged out successfully"}
