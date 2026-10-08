from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import Queue, QueueEntry, Doctor, Department, AuditLog, Notification
import random

def format_time_with_minutes(minutes_from_now: int = 0) -> str:
    dt = datetime.now() + timedelta(minutes=minutes_from_now)
    return dt.strftime("%I:%M %p")

def generate_token(db: Session, dept_code: str = "CARD") -> str:
    code = dept_code.upper()
    # Find count of entries matching this code
    count = db.query(QueueEntry).filter(QueueEntry.token_number.like(f"{code}-%")).count()
    token_num = count + 1
    return f"{code}-{token_num:03d}" if token_num < 1000 else f"{code}-{token_num}"

def recalculate_queue(db: Session, queue_id: str):
    queue = db.query(Queue).filter(Queue.id == queue_id).first()
    if not queue:
        return
    
    doctor = db.query(Doctor).filter(Doctor.id == queue.doctor_id).first()
    avg_minutes = doctor.average_consultation_time_minutes if doctor else 8
    delay_minutes = doctor.current_delay_minutes if doctor else 0

    # Get active entries ordered by position
    entries = db.query(QueueEntry).filter(
        QueueEntry.queue_id == queue_id,
        QueueEntry.status.in_(["WAITING", "CALLED", "IN_CONSULTATION"])
    ).order_by(QueueEntry.position).all()

    waiting_idx = 0
    for idx, entry in enumerate(entries):
        entry.position = idx + 1
        if entry.status in ["IN_CONSULTATION", "CALLED"]:
            entry.estimated_wait_minutes = 0
            entry.expected_consultation_time = "NOW"
        else:
            entry.estimated_wait_minutes = (waiting_idx * avg_minutes) + delay_minutes
            entry.expected_consultation_time = format_time_with_minutes(entry.estimated_wait_minutes)
            waiting_idx += 1
    
    db.commit()

def add_audit_log(
    db: Session,
    user_role: str,
    user_name: str,
    action: str,
    affected_entity: str,
    details: str,
    ip_address: str = None
) -> AuditLog:
    log = AuditLog(
        id=f"audit-{int(datetime.utcnow().timestamp()*1000)}-{random.randint(100, 999)}",
        user_role=user_role,
        user_name=user_name,
        action=action,
        affected_entity=affected_entity,
        details=details,
        ip_address=ip_address,
        created_at=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    return log

def add_notification(
    db: Session,
    user_id: str,
    patient_id: str,
    title: str,
    message: str,
    notif_type: str = "GENERAL"
) -> Notification:
    notif = Notification(
        id=f"notif-{int(datetime.utcnow().timestamp()*1000)}-{random.randint(100, 999)}",
        user_id=user_id,
        patient_id=patient_id,
        title=title,
        message=message,
        type=notif_type,
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(notif)
    db.commit()
    return notif
