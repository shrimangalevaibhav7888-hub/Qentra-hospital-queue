from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Department, Doctor, Queue, QueueEntry, Patient
from app.schemas.schemas import (
    CallNextRequest,
    ConsultationActionRequest,
    ReportDelayRequest,
    EmergencyInsertRequest,
    ReassignDoctorRequest,
    TransferQueueRequest,
    MergeQueuesRequest
)
from app.services.queue_service import (
    generate_token,
    recalculate_queue,
    add_audit_log,
    add_notification,
    format_time_with_minutes
)
from app.services.socket_service import broadcast_queue_update, broadcast_notification

router = APIRouter(prefix="/api/queue", tags=["Queue"])

@router.get("/departments")
def get_departments(departmentId: Optional[str] = Query(None), db: Session = Depends(get_db)):
    departments = db.query(Department).filter(Department.active == True).all()
    
    query = db.query(Queue).filter(Queue.is_active == True)
    if departmentId:
        query = query.filter(Queue.department_id == departmentId)
    queues = query.all()

    return {
        "success": True,
        "departments": [d.to_dict() for d in departments],
        "queues": [q.to_dict(include_entries=True) for q in queues]
    }

@router.get("/my-queue")
def get_my_queue(db: Session = Depends(get_db)):
    # Look for active entry for pat-1 or CARD-016
    entry = db.query(QueueEntry).filter(
        QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"]),
        QueueEntry.patient_id == "pat-1"
    ).first()

    if not entry:
        entry = db.query(QueueEntry).filter(
            QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"])
        ).order_by(QueueEntry.position).first()

    if not entry:
        return {"success": True, "hasActiveQueue": False, "message": "No active queue token"}

    queue = db.query(Queue).filter(Queue.id == entry.queue_id).first()
    doctor = db.query(Doctor).filter(Doctor.id == entry.doctor_id).first()
    department = db.query(Department).filter(Department.id == queue.department_id).first() if queue else None

    patients_ahead = db.query(QueueEntry).filter(
        QueueEntry.queue_id == entry.queue_id,
        QueueEntry.position < entry.position,
        QueueEntry.status.in_(["WAITING", "CALLED"])
    ).count()

    return {
        "success": True,
        "hasActiveQueue": True,
        "token": entry.token_number,
        "position": entry.position,
        "status": entry.status,
        "patientsAhead": max(0, patients_ahead),
        "estimatedWaitMinutes": entry.estimated_wait_minutes,
        "expectedConsultationTime": entry.expected_consultation_time or "04:24 PM",
        "doctor": {
            "name": doctor.user.name if doctor and doctor.user else "Dr. Sharma",
            "department": department.name if department else "Cardiology OPD",
            "roomNumber": doctor.room_number if doctor else "203",
            "currentDelayMinutes": doctor.current_delay_minutes if doctor else 0
        }
    }

@router.get("/doctor/{doctor_id}")
@router.get("/doctor")
def get_doctor_queue(doctor_id: Optional[str] = None, db: Session = Depends(get_db)):
    doc_id = doctor_id or "doc-1"
    doctor = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if not doctor:
        doctor = db.query(Doctor).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

    department = db.query(Department).filter(Department.id == doctor.department_id).first()
    queue = db.query(Queue).filter(Queue.doctor_id == doctor.id).first()
    
    active_entries = []
    if queue:
        active_entries = db.query(QueueEntry).filter(
            QueueEntry.queue_id == queue.id,
            QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"])
        ).order_by(QueueEntry.position).all()

    waiting_list = [e for e in active_entries if e.status == "WAITING"]
    in_consultation = next((e for e in active_entries if e.status == "IN_CONSULTATION"), None)
    called = next((e for e in active_entries if e.status == "CALLED"), None)

    return {
        "success": True,
        "doctor": {
            "id": doctor.id,
            "name": doctor.user.name if doctor.user else "Dr. Sharma",
            "departmentName": department.name if department else "Cardiology OPD",
            "roomNumber": doctor.room_number,
            "averageConsultationTimeMinutes": doctor.average_consultation_time_minutes,
            "currentDelayMinutes": doctor.current_delay_minutes
        },
        "queue": {
            "id": queue.id if queue else "q-1",
            "waitingCount": len(waiting_list),
            "inConsultation": in_consultation.to_dict() if in_consultation else None,
            "called": called.to_dict() if called else None,
            "completedToday": 28,
            "averageWaitMinutes": 18 + doctor.current_delay_minutes,
            "activeList": [e.to_dict() for e in active_entries]
        }
    }

@router.post("/call-next")
async def call_next(req: CallNextRequest, db: Session = Depends(get_db)):
    target_entry = None
    if req.entryId:
        target_entry = db.query(QueueEntry).filter(QueueEntry.id == req.entryId).first()
    elif req.queueId:
        target_entry = db.query(QueueEntry).filter(
            QueueEntry.queue_id == req.queueId,
            QueueEntry.status == "WAITING"
        ).order_by(QueueEntry.position).first()
    else:
        target_entry = db.query(QueueEntry).filter(
            QueueEntry.status == "WAITING"
        ).order_by(QueueEntry.position).first()

    if not target_entry:
        raise HTTPException(status_code=400, detail="No waiting patient found to call")

    target_entry.status = "CALLED"
    target_entry.called_at = datetime.utcnow()
    db.commit()

    doctor = db.query(Doctor).filter(Doctor.id == target_entry.doctor_id).first()
    department = db.query(Department).filter(Department.id == doctor.department_id).first() if doctor else None

    add_audit_log(
        db,
        "DOCTOR",
        doctor.user.name if doctor and doctor.user else "Dr. Sharma",
        "PATIENT_CALLED",
        target_entry.token_number,
        f"Called token {target_entry.token_number} to Room {doctor.room_number if doctor else '203'}"
    )

    notif = add_notification(
        db,
        target_entry.patient_id,
        target_entry.patient_id,
        "Token Called!",
        f"Token {target_entry.token_number}: Please proceed to Room {doctor.room_number if doctor else '203'} for {doctor.user.name if doctor and doctor.user else 'Consultation'}.",
        "TOKEN_CALLED"
    )

    await broadcast_queue_update({
        "action": "CALL_PATIENT",
        "tokenNumber": target_entry.token_number,
        "roomNumber": doctor.room_number if doctor else "203",
        "department": department.name if department else "Cardiology"
    })
    await broadcast_notification(target_entry.patient_id, notif.to_dict())

    return {"success": True, "message": f"Called Token {target_entry.token_number}", "entry": target_entry.to_dict()}

@router.post("/start-consultation")
async def start_consultation(req: ConsultationActionRequest, db: Session = Depends(get_db)):
    entry = db.query(QueueEntry).filter(QueueEntry.id == req.entryId).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    entry.status = "IN_CONSULTATION"
    entry.consultation_started_at = datetime.utcnow()
    db.commit()

    doctor = db.query(Doctor).filter(Doctor.id == entry.doctor_id).first()
    patient = db.query(Patient).filter(Patient.id == entry.patient_id).first()

    add_audit_log(
        db,
        "DOCTOR",
        doctor.user.name if doctor and doctor.user else "Dr. Sharma",
        "CONSULTATION_STARTED",
        entry.token_number,
        f"Consultation started with {patient.name if patient else 'Patient'}"
    )

    await broadcast_queue_update({"action": "CONSULTATION_STARTED", "tokenNumber": entry.token_number})
    return {"success": True, "entry": entry.to_dict()}

@router.post("/complete-consultation")
async def complete_consultation(req: ConsultationActionRequest, db: Session = Depends(get_db)):
    entry = db.query(QueueEntry).filter(QueueEntry.id == req.entryId).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    entry.status = "COMPLETED"
    entry.completed_at = datetime.utcnow()
    queue_id = entry.queue_id
    db.commit()

    recalculate_queue(db, queue_id)

    doctor = db.query(Doctor).filter(Doctor.id == entry.doctor_id).first()
    patient = db.query(Patient).filter(Patient.id == entry.patient_id).first()

    add_audit_log(
        db,
        "DOCTOR",
        doctor.user.name if doctor and doctor.user else "Dr. Sharma",
        "CONSULTATION_COMPLETED",
        entry.token_number,
        f"Consultation completed for {patient.name if patient else 'Patient'}"
    )

    await broadcast_queue_update({"action": "CONSULTATION_COMPLETED", "tokenNumber": entry.token_number})
    return {"success": True, "entry": entry.to_dict()}

@router.post("/report-delay")
async def report_delay(req: ReportDelayRequest, db: Session = Depends(get_db)):
    doc_id = req.doctorId or "doc-1"
    doctor = db.query(Doctor).filter(Doctor.id == doc_id).first()
    if not doctor:
        doctor = db.query(Doctor).first()
    
    doctor.current_delay_minutes = max(0, doctor.current_delay_minutes + req.delayMinutes)
    db.commit()

    queue = db.query(Queue).filter(Queue.doctor_id == doctor.id).first()
    if queue:
        recalculate_queue(db, queue.id)
        waiting_entries = db.query(QueueEntry).filter(
            QueueEntry.queue_id == queue.id,
            QueueEntry.status == "WAITING"
        ).all()
        for e in waiting_entries:
            notif = add_notification(
                db,
                e.patient_id,
                e.patient_id,
                "Doctor Delay Update",
                f"Dr. {doctor.user.name if doctor.user else ''} has reported a {req.delayMinutes}m delay ({req.reason}). Your expected consultation time has been adjusted.",
                "DOCTOR_DELAY"
            )
            await broadcast_notification(e.patient_id, notif.to_dict())

    add_audit_log(
        db,
        "DOCTOR",
        doctor.user.name if doctor and doctor.user else "Doctor",
        "DELAY_REPORTED",
        doctor.user.name if doctor and doctor.user else "Doctor",
        f"Reported +{req.delayMinutes}m delay due to {req.reason}"
    )

    await broadcast_queue_update({"action": "DELAY_REPORTED", "doctorId": doctor.id, "delayMinutes": req.delayMinutes})
    return {
        "success": True,
        "message": f"Reported {req.delayMinutes}m delay",
        "currentDelayMinutes": doctor.current_delay_minutes,
        "doctorId": doctor.id
    }

@router.post("/no-show")
async def mark_no_show(req: ConsultationActionRequest, db: Session = Depends(get_db)):
    entry = db.query(QueueEntry).filter(QueueEntry.id == req.entryId).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    entry.status = "NO_SHOW"
    queue_id = entry.queue_id
    db.commit()

    recalculate_queue(db, queue_id)

    add_audit_log(
        db,
        "DOCTOR",
        "Clinical Staff",
        "NO_SHOW_MARKED",
        entry.token_number,
        f"Marked token {entry.token_number} as No-Show"
    )

    await broadcast_queue_update({"action": "NO_SHOW_MARKED", "tokenNumber": entry.token_number})
    return {"success": True, "entry": entry.to_dict()}

@router.get("/emergency/preview")
def get_emergency_preview(
    departmentId: str = Query("dept-1"),
    doctorId: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Queue).filter(Queue.department_id == departmentId)
    if doctorId:
        query = query.filter(Queue.doctor_id == doctorId)
    queue = query.first() or db.query(Queue).first()

    active_entries = db.query(QueueEntry).filter(
        QueueEntry.queue_id == queue.id,
        QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"])
    ).order_by(QueueEntry.position).all() if queue else []

    before = [
        {
            "tokenNumber": e.token_number,
            "patientName": e.patient.name if e.patient else "Patient",
            "position": e.position,
            "waitMin": e.estimated_wait_minutes,
            "status": e.status
        }
        for e in active_entries[:6]
    ]

    in_consult = next((b for b in before if b["status"] in ["IN_CONSULTATION", "CALLED"]), None)
    waiting_patients = [b for b in before if b["status"] == "WAITING"]

    insert_pos = 2 if in_consult else 1
    after = [
        *( [in_consult] if in_consult else [] ),
        {
            "tokenNumber": "EMG-001",
            "patientName": "Emergency Priority Case",
            "position": insert_pos,
            "waitMin": 0,
            "status": "WAITING",
            "isEmergency": True,
            "delta": 0
        },
        *[
            {
                **b,
                "position": insert_pos + 1 + idx,
                "waitMin": b["waitMin"] + 8,
                "delta": 8
            }
            for idx, b in enumerate(waiting_patients)
        ]
    ]

    affected = [
        {
            "tokenNumber": b["tokenNumber"],
            "patientName": b["patientName"],
            "currentPosition": b["position"],
            "newPosition": insert_pos + 1 + idx,
            "currentWaitMin": b["waitMin"],
            "newWaitMin": b["waitMin"] + 8,
            "waitDeltaMin": 8
        }
        for idx, b in enumerate(waiting_patients)
    ]

    return {
        "success": True,
        "preview": {
            "totalAffectedCount": len(affected),
            "averageWaitIncreaseMin": 8,
            "affectedPatients": affected,
            "beforeQueue": before,
            "afterQueue": after
        }
    }

@router.post("/emergency/insert")
async def insert_emergency(req: EmergencyInsertRequest, db: Session = Depends(get_db)):
    query = db.query(Queue).filter(Queue.department_id == req.departmentId)
    if req.doctorId:
        query = query.filter(Queue.doctor_id == req.doctorId)
    queue = query.first() or db.query(Queue).first()

    token = generate_token(db, "EMG")
    patient_id = f"pat-emg-{int(datetime.utcnow().timestamp()*1000)}"

    new_patient = Patient(
        id=patient_id,
        name=req.patientName,
        age=req.age or 45,
        gender=req.gender or "Male",
        phone=req.phone or "9876500999",
        is_senior_citizen=(req.age or 45) >= 60,
        notes=req.reason
    )
    db.add(new_patient)

    entry_id = f"entry-emg-{int(datetime.utcnow().timestamp()*1000)}"
    new_entry = QueueEntry(
        id=entry_id,
        queue_id=queue.id,
        patient_id=patient_id,
        doctor_id=queue.doctor_id,
        token_number=token,
        priority="EMERGENCY",
        status="WAITING",
        position=1,
        estimated_wait_minutes=0,
        expected_consultation_time="NOW",
        is_emergency=True,
        notes=req.reason
    )
    db.add(new_entry)
    db.commit()

    recalculate_queue(db, queue.id)

    add_audit_log(
        db,
        "RECEPTIONIST",
        "Triage Receptionist",
        "EMERGENCY_INSERTED",
        token,
        f"Emergency case inserted for {req.patientName} in {queue.name}"
    )

    await broadcast_queue_update({
        "action": "EMERGENCY_ALERT",
        "tokenNumber": token,
        "patientName": req.patientName
    })

    return {
        "success": True,
        "tokenNumber": token,
        "entry": new_entry.to_dict()
    }

@router.post("/reassign-doctor")
async def reassign_doctor(req: ReassignDoctorRequest, db: Session = Depends(get_db)):
    source_doc = db.query(Doctor).filter(Doctor.id == req.sourceDoctorId).first()
    target_doc = db.query(Doctor).filter(Doctor.id == req.targetDoctorId).first()
    source_q = db.query(Queue).filter(Queue.doctor_id == req.sourceDoctorId).first()
    target_q = db.query(Queue).filter(Queue.doctor_id == req.targetDoctorId).first()

    if not source_q or not target_q or not source_doc or not target_doc:
        raise HTTPException(status_code=400, detail="Invalid source or target doctor ID")

    waiting_entries = db.query(QueueEntry).filter(
        QueueEntry.queue_id == source_q.id,
        QueueEntry.status == "WAITING"
    ).all()

    for e in waiting_entries:
        e.queue_id = target_q.id
        e.doctor_id = target_doc.id
        e.is_transferred = True
        notif = add_notification(
            db,
            e.patient_id,
            e.patient_id,
            "Doctor Reassigned",
            f"Your consultation has been transferred to {target_doc.user.name if target_doc.user else 'Doctor'} in Room {target_doc.room_number} ({req.reason}).",
            "DOCTOR_REASSIGNED"
        )
        await broadcast_notification(e.patient_id, notif.to_dict())

    db.commit()

    recalculate_queue(db, source_q.id)
    recalculate_queue(db, target_q.id)

    add_audit_log(
        db,
        "RECEPTIONIST",
        "Queue Supervisor",
        "DOCTOR_REASSIGNED",
        f"{source_doc.user.name if source_doc.user else ''} -> {target_doc.user.name if target_doc.user else ''}",
        f"Reassigned {len(waiting_entries)} patient(s) due to {req.reason}"
    )

    await broadcast_queue_update({"action": "DOCTOR_REASSIGNED"})

    return {
        "success": True,
        "message": f"Successfully reassigned {len(waiting_entries)} patients to {target_doc.user.name if target_doc.user else 'target doctor'}"
    }

@router.post("/transfer")
async def transfer_queue(req: TransferQueueRequest, db: Session = Depends(get_db)):
    entry = db.query(QueueEntry).filter(QueueEntry.id == req.entryId).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    old_queue_id = entry.queue_id
    target_doc = db.query(Doctor).filter(Doctor.id == req.targetDoctorId).first() if req.targetDoctorId else db.query(Doctor).first()
    target_q = db.query(Queue).filter(Queue.doctor_id == target_doc.id).first() if target_doc else db.query(Queue).first()

    entry.queue_id = target_q.id
    entry.doctor_id = target_doc.id
    entry.is_transferred = True
    db.commit()

    recalculate_queue(db, old_queue_id)
    recalculate_queue(db, target_q.id)

    notif = add_notification(
        db,
        entry.patient_id,
        entry.patient_id,
        "Queue Transfer Confirmed",
        f"Your token {entry.token_number} is now assigned to {target_doc.user.name if target_doc.user else 'Doctor'} in Room {target_doc.room_number}.",
        "QUEUE_TRANSFERRED"
    )
    await broadcast_notification(entry.patient_id, notif.to_dict())

    add_audit_log(
        db,
        "RECEPTIONIST",
        "Front Desk",
        "QUEUE_TRANSFERRED",
        entry.token_number,
        f"Transferred token {entry.token_number} to Room {target_doc.room_number}"
    )

    await broadcast_queue_update({"action": "QUEUE_TRANSFERRED", "tokenNumber": entry.token_number})

    return {
        "success": True,
        "message": f"Transferred token {entry.token_number} to {target_doc.user.name if target_doc.user else 'Doctor'} (Room {target_doc.room_number})"
    }

@router.post("/merge")
async def merge_queues(req: MergeQueuesRequest, db: Session = Depends(get_db)):
    q_a = db.query(Queue).filter(Queue.id == req.sourceQueueIdA).first()
    q_b = db.query(Queue).filter(Queue.id == req.sourceQueueIdB).first()

    if not q_a or not q_b:
        raise HTTPException(status_code=400, detail="Invalid queue selection for merge")

    target_doc = db.query(Doctor).filter(Doctor.id == req.targetDoctorId).first() if req.targetDoctorId else db.query(Doctor).filter(Doctor.id == q_a.doctor_id).first()

    waiting_b = db.query(QueueEntry).filter(
        QueueEntry.queue_id == q_b.id,
        QueueEntry.status == "WAITING"
    ).all()

    for e in waiting_b:
        e.queue_id = q_a.id
        e.doctor_id = target_doc.id
        notif = add_notification(
            db,
            e.patient_id,
            e.patient_id,
            "Queues Merged",
            f"Your OPD queue has been merged into Room {target_doc.room_number} with {target_doc.user.name if target_doc.user else 'Doctor'}.",
            "QUEUE_MERGED"
        )
        await broadcast_notification(e.patient_id, notif.to_dict())

    db.commit()

    recalculate_queue(db, q_a.id)
    recalculate_queue(db, q_b.id)

    add_audit_log(
        db,
        "ADMIN",
        "OPD Supervisor",
        "QUEUES_MERGED",
        f"{q_a.name} & {q_b.name}",
        f"Merged {len(waiting_b)} waiting tokens into {q_a.name}"
    )

    await broadcast_queue_update({"action": "QUEUES_MERGED"})

    return {
        "success": True,
        "message": f"Merged {len(waiting_b)} patients from {q_b.name} into {q_a.name}"
    }

@router.get("/public-display")
def get_public_display(db: Session = Depends(get_db)):
    departments = db.query(Department).filter(Department.active == True).all()
    display_data = []

    for dept in departments:
        doc = db.query(Doctor).filter(Doctor.department_id == dept.id).first() or db.query(Doctor).first()
        q = db.query(Queue).filter(Queue.department_id == dept.id).first()

        active_entries = []
        if q:
            active_entries = db.query(QueueEntry).filter(
                QueueEntry.queue_id == q.id,
                QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"])
            ).order_by(QueueEntry.position).all()

        serving = next((e for e in active_entries if e.status in ["IN_CONSULTATION", "CALLED"]), None)
        waiting = [e for e in active_entries if e.status == "WAITING"]

        display_data.append({
            "departmentId": dept.id,
            "departmentName": dept.name,
            "departmentCode": dept.code,
            "doctors": [
                {
                    "doctorId": doc.id if doc else "doc-1",
                    "doctorName": doc.user.name if doc and doc.user else "Doctor",
                    "roomNumber": doc.room_number if doc else "203",
                    "nowServing": serving.token_number if serving else "---",
                    "nowServingPatient": serving.patient.name if serving and serving.patient else "Ready for next patient",
                    "status": serving.status if serving else "WAITING",
                    "waitingCount": len(waiting),
                    "nextInLine": [
                        {
                            "tokenNumber": w.token_number,
                            "patientName": w.patient.name if w.patient else "Patient",
                            "estimatedWait": w.estimated_wait_minutes
                        }
                        for w in waiting[:3]
                    ]
                }
            ]
        })

    return {"success": True, "displayData": display_data}
