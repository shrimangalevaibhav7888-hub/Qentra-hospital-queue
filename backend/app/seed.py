from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.models import (
    User,
    Department,
    Doctor,
    Patient,
    Queue,
    QueueEntry,
    Appointment,
    Notification,
    AuditLog
)

def seed_initial_data(db: Session):
    # Check if data already exists
    if db.query(Department).first():
        return

    print("[Qentra DB] Seeding initial hospital database...")

    # 1. Departments
    dept_card = Department(
        id="dept-1",
        name="Cardiology OPD",
        code="CARD",
        description="Heart and Cardiovascular Care",
        active=True
    )
    dept_orth = Department(
        id="dept-2",
        name="Orthopedics OPD",
        code="ORTH",
        description="Bone, Joint and Trauma Specialists",
        active=True
    )
    dept_med = Department(
        id="dept-3",
        name="General Medicine",
        code="MED",
        description="Internal Medicine and Primary Care",
        active=True
    )
    dept_ped = Department(
        id="dept-4",
        name="Pediatrics Wing",
        code="PED",
        description="Child Healthcare and Neonatology",
        active=True
    )
    db.add_all([dept_card, dept_orth, dept_med, dept_ped])
    db.commit()

    # 2. Users
    user_pat1 = User(
        id="user-pat-1",
        name="Ramesh Kumar",
        email="patient.ramesh@qentra.demo",
        role="PATIENT",
        phone="+91 98765 43210",
        patient_id="pat-1",
        is_senior_citizen=False
    )
    user_doc1 = User(
        id="user-doc-1",
        name="Dr. Sharma",
        email="doctor.sharma@qentra.demo",
        role="DOCTOR",
        phone="+91 98200 11203",
        doctor_id="doc-1"
    )
    user_doc2 = User(
        id="user-doc-2",
        name="Dr. Ananya Iyer",
        email="doctor.iyer@qentra.demo",
        role="DOCTOR",
        phone="+91 98200 11105",
        doctor_id="doc-2"
    )
    user_doc3 = User(
        id="user-doc-3",
        name="Dr. Rajesh Patel",
        email="doctor.patel@qentra.demo",
        role="DOCTOR",
        phone="+91 98200 11108",
        doctor_id="doc-3"
    )
    user_doc4 = User(
        id="user-doc-4",
        name="Dr. Sneha Reddy",
        email="doctor.reddy@qentra.demo",
        role="DOCTOR",
        phone="+91 98200 11112",
        doctor_id="doc-4"
    )
    user_rec1 = User(
        id="user-rec-1",
        name="Priya Receptionist",
        email="reception.frontdesk@qentra.demo",
        role="RECEPTIONIST",
        phone="+91 98200 00100"
    )
    user_adm1 = User(
        id="user-adm-1",
        name="Hospital Admin (Dr. V. Rao)",
        email="admin.operations@qentra.demo",
        role="ADMIN",
        phone="+91 98200 99999"
    )
    db.add_all([user_pat1, user_doc1, user_doc2, user_doc3, user_doc4, user_rec1, user_adm1])
    db.commit()

    # 3. Doctors
    doc1 = Doctor(
        id="doc-1",
        user_id="user-doc-1",
        department_id="dept-1",
        room_number="203",
        specialization="Senior Cardiologist & Interventionalist",
        average_consultation_time_minutes=8,
        is_available=True,
        current_delay_minutes=0
    )
    doc2 = Doctor(
        id="doc-2",
        user_id="user-doc-2",
        department_id="dept-2",
        room_number="105",
        specialization="Orthopedic Surgeon & Joint Replacement",
        average_consultation_time_minutes=10,
        is_available=True,
        current_delay_minutes=0
    )
    doc3 = Doctor(
        id="doc-3",
        user_id="user-doc-3",
        department_id="dept-3",
        room_number="108",
        specialization="Consultant Physician & Diabetologist",
        average_consultation_time_minutes=7,
        is_available=True,
        current_delay_minutes=0
    )
    doc4 = Doctor(
        id="doc-4",
        user_id="user-doc-4",
        department_id="dept-4",
        room_number="112",
        specialization="Senior Pediatrician",
        average_consultation_time_minutes=6,
        is_available=True,
        current_delay_minutes=0
    )
    db.add_all([doc1, doc2, doc3, doc4])
    db.commit()

    # 4. Patients
    pat1 = Patient(
        id="pat-1",
        user_id="user-pat-1",
        name="Ramesh Kumar",
        age=42,
        gender="Male",
        phone="+91 98765 43210",
        email="patient.ramesh@qentra.demo",
        is_senior_citizen=False
    )
    pat2 = Patient(
        id="pat-2",
        name="Sunil Rao",
        age=58,
        gender="Male",
        phone="+91 98200 22331",
        is_senior_citizen=False
    )
    pat3 = Patient(
        id="pat-3",
        name="Kavita Menon",
        age=34,
        gender="Female",
        phone="+91 98200 33442",
        is_senior_citizen=False
    )
    pat4 = Patient(
        id="pat-4",
        name="Sita Devi",
        age=68,
        gender="Female",
        phone="+91 98200 44553",
        is_senior_citizen=True
    )
    pat5 = Patient(
        id="pat-5",
        name="Neha Patil",
        age=29,
        gender="Female",
        phone="+91 98200 55664",
        is_senior_citizen=False
    )
    db.add_all([pat1, pat2, pat3, pat4, pat5])
    db.commit()

    # 5. Queues
    q1 = Queue(
        id="q-1",
        department_id="dept-1",
        doctor_id="doc-1",
        name="Cardiology Main Queue (Dr. Sharma)",
        is_active=True
    )
    q2 = Queue(
        id="q-2",
        department_id="dept-2",
        doctor_id="doc-2",
        name="Orthopedics Queue (Dr. Iyer)",
        is_active=True
    )
    q3 = Queue(
        id="q-3",
        department_id="dept-3",
        doctor_id="doc-3",
        name="Medicine Queue (Dr. Patel)",
        is_active=True
    )
    q4 = Queue(
        id="q-4",
        department_id="dept-4",
        doctor_id="doc-4",
        name="Pediatrics Queue (Dr. Reddy)",
        is_active=True
    )
    db.add_all([q1, q2, q3, q4])
    db.commit()

    # 6. Queue Entries
    now = datetime.utcnow()
    e1 = QueueEntry(
        id="entry-1",
        queue_id="q-1",
        patient_id="pat-2",
        doctor_id="doc-1",
        token_number="CARD-013",
        priority="NORMAL",
        status="IN_CONSULTATION",
        position=1,
        estimated_wait_minutes=0,
        expected_consultation_time="04:00 PM",
        consultation_started_at=now - timedelta(minutes=4),
        notes="Hypertension review",
        created_at=now - timedelta(minutes=40)
    )
    e2 = QueueEntry(
        id="entry-2",
        queue_id="q-1",
        patient_id="pat-3",
        doctor_id="doc-1",
        token_number="CARD-014",
        priority="NORMAL",
        status="WAITING",
        position=2,
        estimated_wait_minutes=8,
        expected_consultation_time="04:08 PM",
        notes="Chest discomfort on exertion",
        created_at=now - timedelta(minutes=30)
    )
    e3 = QueueEntry(
        id="entry-3",
        queue_id="q-1",
        patient_id="pat-4",
        doctor_id="doc-1",
        token_number="CARD-015",
        priority="SENIOR",
        status="WAITING",
        position=3,
        estimated_wait_minutes=16,
        expected_consultation_time="04:16 PM",
        notes="Senior cardiac checkup",
        created_at=now - timedelta(minutes=25)
    )
    e4 = QueueEntry(
        id="entry-4",
        queue_id="q-1",
        patient_id="pat-1",
        doctor_id="doc-1",
        token_number="CARD-016",
        priority="NORMAL",
        status="WAITING",
        position=4,
        estimated_wait_minutes=24,
        expected_consultation_time="04:24 PM",
        notes="Follow-up consultation",
        created_at=now - timedelta(minutes=20)
    )
    e5 = QueueEntry(
        id="entry-5",
        queue_id="q-1",
        patient_id="pat-5",
        doctor_id="doc-1",
        token_number="CARD-017",
        priority="NORMAL",
        status="WAITING",
        position=5,
        estimated_wait_minutes=32,
        expected_consultation_time="04:32 PM",
        notes="Pre-operative clearance",
        created_at=now - timedelta(minutes=15)
    )
    e_orth1 = QueueEntry(
        id="entry-orth-1",
        queue_id="q-2",
        patient_id="pat-5",
        doctor_id="doc-2",
        token_number="ORTH-008",
        priority="NORMAL",
        status="WAITING",
        position=1,
        estimated_wait_minutes=10,
        expected_consultation_time="04:10 PM",
        notes="Knee joint pain",
        created_at=now - timedelta(minutes=10)
    )
    db.add_all([e1, e2, e3, e4, e5, e_orth1])
    db.commit()

    # 7. Appointments
    appt1 = Appointment(
        id="appt-1",
        patient_id="pat-1",
        doctor_id="doc-1",
        department_id="dept-1",
        appointment_date=now.strftime("%Y-%m-%d"),
        time_slot="04:15 PM",
        status="SCHEDULED",
        reason="Follow-up consultation",
        token_number="CARD-016"
    )
    appt2 = Appointment(
        id="appt-2",
        patient_id="pat-1",
        doctor_id="doc-3",
        department_id="dept-3",
        appointment_date=(now - timedelta(days=7)).strftime("%Y-%m-%d"),
        time_slot="11:00 AM",
        status="COMPLETED",
        reason="Annual Health Check",
        token_number="MED-042"
    )
    db.add_all([appt1, appt2])
    db.commit()

    # 8. Notifications
    notif1 = Notification(
        id="notif-1",
        user_id="user-pat-1",
        patient_id="pat-1",
        title="Your Turn Is Approaching",
        message="Token CARD-016 is #4 in queue for Dr. Sharma (Room 203).",
        type="TURN_NEAR",
        is_read=False,
        created_at=now - timedelta(minutes=5)
    )
    notif2 = Notification(
        id="notif-2",
        user_id="user-pat-1",
        patient_id="pat-1",
        title="Appointment Confirmed",
        message="Your Cardiology appointment has been booked. Digital Token: CARD-016.",
        type="APPOINTMENT_CONFIRMED",
        is_read=True,
        created_at=now - timedelta(minutes=45)
    )
    db.add_all([notif1, notif2])
    db.commit()

    # 9. Audit Logs
    audit1 = AuditLog(
        id="audit-1",
        user_role="DOCTOR",
        user_name="Dr. Sharma",
        action="CONSULTATION_STARTED",
        affected_entity="Token CARD-013",
        details="Dr. Sharma started consultation with Sunil Rao in Room 203.",
        created_at=now - timedelta(minutes=4)
    )
    db.add(audit1)
    db.commit()

    print("[Qentra DB] Initial seed data created successfully.")
