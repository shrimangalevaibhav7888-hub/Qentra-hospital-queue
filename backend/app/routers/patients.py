from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Patient, Department, Doctor, Queue, QueueEntry
from app.schemas.schemas import WalkInRegisterRequest
from app.services.queue_service import (
    generate_token,
    recalculate_queue,
    add_audit_log,
    format_time_with_minutes
)
from app.services.socket_service import broadcast_queue_update

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.post("/walk-in")
async def register_walk_in(req: WalkInRegisterRequest, db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == req.departmentId).first() or db.query(Department).first()
    
    if req.doctorId:
        doc = db.query(Doctor).filter(Doctor.id == req.doctorId).first()
    else:
        doc = db.query(Doctor).filter(Doctor.department_id == dept.id).first() if dept else None
    
    if not doc:
        doc = db.query(Doctor).first()

    queue = db.query(Queue).filter(Queue.doctor_id == doc.id).first() or db.query(Queue).first()

    token = generate_token(db, dept.code if dept else "CARD")
    now = datetime.utcnow()
    patient_id = f"pat-walkin-{int(now.timestamp()*1000)}"

    is_senior = req.isSeniorCitizen or req.priority == "SENIOR" or req.age >= 60

    new_patient = Patient(
        id=patient_id,
        name=req.name,
        age=req.age,
        gender=req.gender,
        phone=req.phone,
        is_senior_citizen=is_senior,
        notes=req.notes
    )
    db.add(new_patient)

    current_count = db.query(QueueEntry).filter(
        QueueEntry.queue_id == queue.id,
        QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"])
    ).count() if queue else 0

    entry_id = f"entry-walkin-{int(now.timestamp()*1000)}"
    new_entry = QueueEntry(
        id=entry_id,
        queue_id=queue.id if queue else "q-1",
        patient_id=patient_id,
        doctor_id=doc.id,
        token_number=token,
        priority="SENIOR" if is_senior else (req.priority or "NORMAL"),
        status="WAITING",
        position=current_count + 1,
        estimated_wait_minutes=current_count * 8,
        expected_consultation_time=format_time_with_minutes(current_count * 8),
        notes=req.notes
    )
    db.add(new_entry)
    db.commit()

    if queue:
        recalculate_queue(db, queue.id)

    add_audit_log(
        db,
        "RECEPTIONIST",
        "Front Desk Reception",
        "WALKIN_REGISTERED",
        token,
        f"Generated token {token} for {req.name} in {dept.name if dept else 'OPD'}"
    )

    await broadcast_queue_update({"action": "WALKIN_REGISTERED", "tokenNumber": token})

    return {
        "success": True,
        "tokenNumber": token,
        "entry": new_entry.to_dict()
    }

@router.get("/search")
def search_patients(query: str = Query("", alias="query"), db: Session = Depends(get_db)):
    q = query.strip().lower()

    all_entries = db.query(QueueEntry).all()
    all_patients = db.query(Patient).all()

    if not q:
        return {
            "success": True,
            "results": {
                "queueEntries": [e.to_dict() for e in all_entries],
                "patients": [p.to_dict() for p in all_patients]
            }
        }

    matched_entries = [
        e.to_dict()
        for e in all_entries
        if q in e.token_number.lower()
        or (e.patient and q in e.patient.name.lower())
        or (e.patient and q in e.patient.phone.lower())
    ]

    matched_patients = [
        p.to_dict()
        for p in all_patients
        if q in p.name.lower() or q in p.phone.lower() or (p.email and q in p.email.lower())
    ]

    return {
        "success": True,
        "results": {
            "queueEntries": matched_entries,
            "patients": matched_patients
        }
    }
