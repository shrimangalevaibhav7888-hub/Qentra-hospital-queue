from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Appointment, Department, Doctor, Patient, Queue, QueueEntry
from app.schemas.schemas import BookAppointmentRequest
from app.services.queue_service import (
    generate_token,
    recalculate_queue,
    add_audit_log,
    add_notification,
    format_time_with_minutes
)
from app.services.socket_service import broadcast_queue_update

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.post("/book")
async def book_appointment(req: BookAppointmentRequest, db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == req.departmentId).first() or db.query(Department).first()
    doc = db.query(Doctor).filter(Doctor.id == req.doctorId).first() or db.query(Doctor).first()
    pat = db.query(Patient).filter(Patient.id == "pat-1").first() or db.query(Patient).first()

    token = generate_token(db, dept.code if dept else "CARD")
    now = datetime.utcnow()
    appt_id = f"appt-{int(now.timestamp()*1000)}"

    new_appt = Appointment(
        id=appt_id,
        patient_id=pat.id if pat else "pat-1",
        doctor_id=doc.id,
        department_id=dept.id,
        appointment_date=req.appointmentDate or now.strftime("%Y-%m-%d"),
        time_slot=req.timeSlot or "04:15 PM",
        status="SCHEDULED",
        reason=req.reason or "Routine Consultation",
        token_number=token
    )
    db.add(new_appt)

    # Add entry to queue
    queue = db.query(Queue).filter(Queue.doctor_id == doc.id).first() or db.query(Queue).first()
    current_count = db.query(QueueEntry).filter(
        QueueEntry.queue_id == queue.id,
        QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"])
    ).count() if queue else 0

    entry_id = f"entry-{int(now.timestamp()*1000)}"
    new_entry = QueueEntry(
        id=entry_id,
        queue_id=queue.id if queue else "q-1",
        patient_id=pat.id if pat else "pat-1",
        doctor_id=doc.id,
        token_number=token,
        priority="SENIOR" if req.isSeniorCitizen else "NORMAL",
        status="WAITING",
        position=current_count + 1,
        estimated_wait_minutes=current_count * 8,
        expected_consultation_time=format_time_with_minutes(current_count * 8),
        notes=req.reason
    )
    db.add(new_entry)
    db.commit()

    if queue:
        recalculate_queue(db, queue.id)

    add_audit_log(
        db,
        "PATIENT",
        req.patientName or "Ramesh Kumar",
        "APPOINTMENT_BOOKED",
        token,
        f"Booked {dept.name if dept else 'OPD'} appointment with {doc.user.name if doc and doc.user else 'Doctor'}"
    )

    add_notification(
        db,
        pat.id if pat else "pat-1",
        pat.id if pat else "pat-1",
        "Appointment Confirmed",
        f"Your appointment for {dept.name if dept else 'OPD'} is confirmed. Digital Token: {token}",
        "APPOINTMENT_CONFIRMED"
    )

    await broadcast_queue_update({"action": "APPOINTMENT_BOOKED", "tokenNumber": token})

    return {
        "success": True,
        "tokenNumber": token,
        "appointment": new_appt.to_dict()
    }

@router.get("/my-appointments")
def get_my_appointments(db: Session = Depends(get_db)):
    appts = db.query(Appointment).order_by(Appointment.created_at.desc()).all()
    return {
        "success": True,
        "appointments": [a.to_dict() for a in appts]
    }

@router.patch("/cancel/{appointment_id}")
async def cancel_appointment(appointment_id: str, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = "CANCELLED"

    # Remove or cancel corresponding queue entry
    if appt.token_number:
        entry = db.query(QueueEntry).filter(QueueEntry.token_number == appt.token_number).first()
        if entry:
            queue_id = entry.queue_id
            db.delete(entry)
            db.commit()
            recalculate_queue(db, queue_id)

    db.commit()

    add_audit_log(
        db,
        "PATIENT",
        "Patient",
        "APPOINTMENT_CANCELLED",
        appt.token_number or appt.id,
        f"Cancelled appointment {appt.id}"
    )

    await broadcast_queue_update({"action": "APPOINTMENT_CANCELLED"})
    return {"success": True, "message": "Appointment cancelled"}
