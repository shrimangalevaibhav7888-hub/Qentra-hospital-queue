from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=True)
    role = Column(String(32), nullable=False, default="PATIENT")  # PATIENT, DOCTOR, RECEPTIONIST, ADMIN
    phone = Column(String(32), nullable=True)
    patient_id = Column(String(64), nullable=True)
    doctor_id = Column(String(64), nullable=True)
    is_senior_citizen = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    patient_profile = relationship("Patient", back_populates="user", uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "phone": self.phone,
            "patientId": self.patient_id,
            "doctorId": self.doctor_id,
            "isSeniorCitizen": self.is_senior_citizen
        }


class Department(Base):
    __tablename__ = "departments"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    code = Column(String(16), nullable=False, index=True)
    description = Column(String(256), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    doctors = relationship("Doctor", back_populates="department")
    queues = relationship("Queue", back_populates="department")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "description": self.description,
            "active": self.active
        }


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    department_id = Column(String(64), ForeignKey("departments.id"), nullable=False)
    room_number = Column(String(32), nullable=False)
    specialization = Column(String(256), nullable=True)
    average_consultation_time_minutes = Column(Integer, default=8)
    is_available = Column(Boolean, default=True)
    current_delay_minutes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="doctor_profile")
    department = relationship("Department", back_populates="doctors")
    queues = relationship("Queue", back_populates="doctor")

    def to_dict(self, include_nested=True):
        data = {
            "id": self.id,
            "userId": self.user_id,
            "departmentId": self.department_id,
            "roomNumber": self.room_number,
            "specialization": self.specialization,
            "averageConsultationTimeMinutes": self.average_consultation_time_minutes,
            "isAvailable": self.is_available,
            "currentDelayMinutes": self.current_delay_minutes
        }
        if include_nested:
            if self.user:
                data["user"] = self.user.to_dict()
            if self.department:
                data["department"] = self.department.to_dict()
        return data


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    name = Column(String(128), nullable=False)
    age = Column(Integer, default=30)
    gender = Column(String(16), default="Male")
    phone = Column(String(32), nullable=False)
    email = Column(String(128), nullable=True)
    is_senior_citizen = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="patient_profile")
    queue_entries = relationship("QueueEntry", back_populates="patient")

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "phone": self.phone,
            "email": self.email,
            "isSeniorCitizen": self.is_senior_citizen,
            "notes": self.notes
        }


class Queue(Base):
    __tablename__ = "queues"

    id = Column(String(64), primary_key=True, index=True)
    department_id = Column(String(64), ForeignKey("departments.id"), nullable=False)
    doctor_id = Column(String(64), ForeignKey("doctors.id"), nullable=False)
    name = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    department = relationship("Department", back_populates="queues")
    doctor = relationship("Doctor", back_populates="queues")
    entries = relationship("QueueEntry", back_populates="queue", cascade="all, delete-orphan", order_by="QueueEntry.position")

    def to_dict(self, include_entries=True):
        data = {
            "id": self.id,
            "departmentId": self.department_id,
            "doctorId": self.doctor_id,
            "name": self.name,
            "isActive": self.is_active,
            "department": self.department.to_dict() if self.department else None,
            "doctor": self.doctor.to_dict() if self.doctor else None
        }
        if include_entries:
            data["entries"] = [e.to_dict() for e in self.entries]
        return data


class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(String(64), primary_key=True, index=True)
    queue_id = Column(String(64), ForeignKey("queues.id"), nullable=False)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String(64), ForeignKey("doctors.id"), nullable=False)
    token_number = Column(String(32), nullable=False, index=True)
    priority = Column(String(16), default="NORMAL")  # NORMAL, SENIOR, EMERGENCY
    status = Column(String(32), default="WAITING")   # WAITING, CALLED, IN_CONSULTATION, COMPLETED, CANCELLED, NO_SHOW
    position = Column(Integer, default=1)
    estimated_wait_minutes = Column(Integer, default=0)
    expected_consultation_time = Column(String(32), nullable=True)
    called_at = Column(DateTime, nullable=True)
    consultation_started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    delay_minutes_added = Column(Integer, default=0)
    is_emergency = Column(Boolean, default=False)
    is_transferred = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    queue = relationship("Queue", back_populates="entries")
    patient = relationship("Patient", back_populates="queue_entries")
    doctor = relationship("Doctor")

    def to_dict(self):
        return {
            "id": self.id,
            "queueId": self.queue_id,
            "patientId": self.patient_id,
            "doctorId": self.doctor_id,
            "tokenNumber": self.token_number,
            "priority": self.priority,
            "status": self.status,
            "position": self.position,
            "estimatedWaitMinutes": self.estimated_wait_minutes,
            "expectedConsultationTime": self.expected_consultation_time,
            "calledAt": self.called_at.isoformat() if self.called_at else None,
            "consultationStartedAt": self.consultation_started_at.isoformat() if self.consultation_started_at else None,
            "completedAt": self.completed_at.isoformat() if self.completed_at else None,
            "delayMinutesAdded": self.delay_minutes_added,
            "isEmergency": self.is_emergency,
            "isTransferred": self.is_transferred,
            "notes": self.notes,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "patient": self.patient.to_dict() if self.patient else None,
            "doctor": self.doctor.to_dict() if self.doctor else None
        }


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(64), primary_key=True, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String(64), ForeignKey("doctors.id"), nullable=False)
    department_id = Column(String(64), ForeignKey("departments.id"), nullable=False)
    appointment_date = Column(String(32), nullable=False)
    time_slot = Column(String(32), nullable=False)
    status = Column(String(32), default="SCHEDULED")  # SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    reason = Column(Text, nullable=True)
    token_number = Column(String(32), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient")
    doctor = relationship("Doctor")
    department = relationship("Department")

    def to_dict(self):
        return {
            "id": self.id,
            "patientId": self.patient_id,
            "doctorId": self.doctor_id,
            "departmentId": self.department_id,
            "appointmentDate": self.appointment_date,
            "timeSlot": self.time_slot,
            "status": self.status,
            "reason": self.reason,
            "tokenNumber": self.token_number,
            "department": self.department.to_dict() if self.department else None,
            "doctor": self.doctor.to_dict() if self.doctor else None,
            "patient": self.patient.to_dict() if self.patient else None
        }


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), nullable=True)
    patient_id = Column(String(64), nullable=True)
    title = Column(String(128), nullable=False)
    message = Column(String(512), nullable=False)
    type = Column(String(64), default="GENERAL")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "patientId": self.patient_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "isRead": self.is_read,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    user_role = Column(String(32), nullable=False)
    user_name = Column(String(128), nullable=False)
    action = Column(String(64), nullable=False)
    affected_entity = Column(String(128), nullable=False)
    details = Column(Text, nullable=False)
    ip_address = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "userRole": self.user_role,
            "userName": self.user_name,
            "action": self.action,
            "affectedEntity": self.affected_entity,
            "details": self.details,
            "ipAddress": self.ip_address,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }
