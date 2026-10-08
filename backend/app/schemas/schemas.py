from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr

# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None

class DemoLoginRequest(BaseModel):
    role: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: Optional[str] = None
    role: Optional[str] = "PATIENT"
    phone: Optional[str] = None
    age: Optional[int] = 30
    gender: Optional[str] = "Male"

# Queue Action Schemas
class CallNextRequest(BaseModel):
    queueId: Optional[str] = None
    entryId: Optional[str] = None

class ConsultationActionRequest(BaseModel):
    entryId: str

class ReportDelayRequest(BaseModel):
    doctorId: Optional[str] = None
    delayMinutes: int = 10
    reason: Optional[str] = "Clinical Procedure"

class EmergencyInsertRequest(BaseModel):
    patientName: str = "Emergency Patient"
    departmentId: str = "dept-1"
    doctorId: Optional[str] = None
    age: Optional[int] = 45
    gender: Optional[str] = "Male"
    phone: Optional[str] = "9876500999"
    reason: Optional[str] = "Acute Cardiac Chest Pain / Severe Trauma"

class ReassignDoctorRequest(BaseModel):
    sourceDoctorId: str
    targetDoctorId: str
    reason: Optional[str] = "Doctor Called to Emergency Surgery"

class TransferQueueRequest(BaseModel):
    entryId: str
    targetDoctorId: Optional[str] = None
    targetDepartmentId: Optional[str] = None

class MergeQueuesRequest(BaseModel):
    sourceQueueIdA: str
    sourceQueueIdB: str
    targetDoctorId: Optional[str] = None

# Appointment Schemas
class BookAppointmentRequest(BaseModel):
    departmentId: str
    doctorId: str
    appointmentDate: Optional[str] = None
    timeSlot: Optional[str] = "04:15 PM"
    reason: Optional[str] = "Consultation"
    patientName: Optional[str] = "Ramesh Kumar"
    phone: Optional[str] = "9876543210"
    isSeniorCitizen: Optional[bool] = False

# Patient Schemas
class WalkInRegisterRequest(BaseModel):
    name: str
    age: int = 35
    gender: str = "Male"
    phone: str = "9820011999"
    departmentId: str = "dept-1"
    doctorId: Optional[str] = None
    isSeniorCitizen: Optional[bool] = False
    notes: Optional[str] = "Walk-in registration"
    priority: Optional[str] = "NORMAL"

# Admin Schemas
class UpdateDoctorStatusRequest(BaseModel):
    isAvailable: Optional[bool] = None
    currentDelayMinutes: Optional[int] = None
