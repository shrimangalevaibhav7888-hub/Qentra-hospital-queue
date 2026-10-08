import type {
  User,
  Role,
  Department,
  Doctor,
  Patient,
  QueueEntry,
  Queue,
  Appointment,
  NotificationItem,
  AuditLogItem,
  EmergencyImpactPreviewData,
  AdminAnalyticsData,
  PublicDisplayData
} from '../types';

// Storage Keys
const STORAGE_KEY = 'qentra_mock_state_v1';

interface MockState {
  users: User[];
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  queues: Queue[];
  appointments: Appointment[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
}

const initialDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Cardiology OPD',
    code: 'CARD',
    description: 'Heart and Cardiovascular Care',
    active: true
  },
  {
    id: 'dept-2',
    name: 'Orthopedics OPD',
    code: 'ORTH',
    description: 'Bone, Joint and Trauma Specialists',
    active: true
  },
  {
    id: 'dept-3',
    name: 'General Medicine',
    code: 'MED',
    description: 'Internal Medicine and Primary Care',
    active: true
  },
  {
    id: 'dept-4',
    name: 'Pediatrics Wing',
    code: 'PED',
    description: 'Child Healthcare and Neonatology',
    active: true
  }
];

const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'user-doc-1',
    departmentId: 'dept-1',
    roomNumber: '203',
    specialization: 'Senior Cardiologist & Interventionalist',
    averageConsultationTimeMinutes: 8,
    isAvailable: true,
    currentDelayMinutes: 0,
    user: {
      id: 'user-doc-1',
      name: 'Dr. Sharma',
      email: 'doctor.sharma@qentra.demo',
      phone: '+91 98200 11203'
    },
    department: initialDepartments[0]
  },
  {
    id: 'doc-2',
    userId: 'user-doc-2',
    departmentId: 'dept-2',
    roomNumber: '105',
    specialization: 'Orthopedic Surgeon & Joint Replacement',
    averageConsultationTimeMinutes: 10,
    isAvailable: true,
    currentDelayMinutes: 0,
    user: {
      id: 'user-doc-2',
      name: 'Dr. Ananya Iyer',
      email: 'doctor.iyer@qentra.demo',
      phone: '+91 98200 11105'
    },
    department: initialDepartments[1]
  },
  {
    id: 'doc-3',
    userId: 'user-doc-3',
    departmentId: 'dept-3',
    roomNumber: '108',
    specialization: 'Consultant Physician & Diabetologist',
    averageConsultationTimeMinutes: 7,
    isAvailable: true,
    currentDelayMinutes: 0,
    user: {
      id: 'user-doc-3',
      name: 'Dr. Rajesh Patel',
      email: 'doctor.patel@qentra.demo',
      phone: '+91 98200 11108'
    },
    department: initialDepartments[2]
  },
  {
    id: 'doc-4',
    userId: 'user-doc-4',
    departmentId: 'dept-4',
    roomNumber: '112',
    specialization: 'Senior Pediatrician',
    averageConsultationTimeMinutes: 6,
    isAvailable: true,
    currentDelayMinutes: 0,
    user: {
      id: 'user-doc-4',
      name: 'Dr. Sneha Reddy',
      email: 'doctor.reddy@qentra.demo',
      phone: '+91 98200 11112'
    },
    department: initialDepartments[3]
  }
];

const initialUsers: User[] = [
  {
    id: 'user-pat-1',
    name: 'Ramesh Kumar',
    email: 'patient.ramesh@qentra.demo',
    role: 'PATIENT',
    phone: '+91 98765 43210',
    patientId: 'pat-1',
    isSeniorCitizen: false
  },
  {
    id: 'user-doc-1',
    name: 'Dr. Sharma',
    email: 'doctor.sharma@qentra.demo',
    role: 'DOCTOR',
    phone: '+91 98200 11203',
    doctorId: 'doc-1',
    doctor: {
      id: 'doc-1',
      roomNumber: '203',
      specialization: 'Cardiology',
      departmentName: 'Cardiology OPD',
      departmentId: 'dept-1'
    }
  },
  {
    id: 'user-rec-1',
    name: 'Priya Receptionist',
    email: 'reception.frontdesk@qentra.demo',
    role: 'RECEPTIONIST',
    phone: '+91 98200 00100'
  },
  {
    id: 'user-adm-1',
    name: 'Hospital Admin (Dr. V. Rao)',
    email: 'admin.operations@qentra.demo',
    role: 'ADMIN',
    phone: '+91 98200 99999'
  }
];

const initialPatients: Patient[] = [
  {
    id: 'pat-1',
    userId: 'user-pat-1',
    name: 'Ramesh Kumar',
    age: 42,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'patient.ramesh@qentra.demo',
    isSeniorCitizen: false
  },
  {
    id: 'pat-2',
    name: 'Sunil Rao',
    age: 58,
    gender: 'Male',
    phone: '+91 98200 22331',
    isSeniorCitizen: false
  },
  {
    id: 'pat-3',
    name: 'Kavita Menon',
    age: 34,
    gender: 'Female',
    phone: '+91 98200 33442',
    isSeniorCitizen: false
  },
  {
    id: 'pat-4',
    name: 'Sita Devi',
    age: 68,
    gender: 'Female',
    phone: '+91 98200 44553',
    isSeniorCitizen: true
  },
  {
    id: 'pat-5',
    name: 'Neha Patil',
    age: 29,
    gender: 'Female',
    phone: '+91 98200 55664',
    isSeniorCitizen: false
  }
];

const initialQueueEntries: QueueEntry[] = [
  {
    id: 'entry-1',
    queueId: 'q-1',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    tokenNumber: 'CARD-013',
    priority: 'NORMAL',
    status: 'IN_CONSULTATION',
    position: 1,
    estimatedWaitMinutes: 0,
    expectedConsultationTime: '04:00 PM',
    calledAt: new Date(Date.now() - 5 * 60000).toISOString(),
    consultationStartedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    delayMinutesAdded: 0,
    isEmergency: false,
    isTransferred: false,
    notes: 'Hypertension monitoring & ECG review',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    patient: initialPatients[1],
    doctor: initialDoctors[0]
  },
  {
    id: 'entry-2',
    queueId: 'q-1',
    patientId: 'pat-3',
    doctorId: 'doc-1',
    tokenNumber: 'CARD-014',
    priority: 'NORMAL',
    status: 'WAITING',
    position: 2,
    estimatedWaitMinutes: 8,
    expectedConsultationTime: '04:08 PM',
    delayMinutesAdded: 0,
    isEmergency: false,
    isTransferred: false,
    notes: 'Chest discomfort on exertion',
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    patient: initialPatients[2],
    doctor: initialDoctors[0]
  },
  {
    id: 'entry-3',
    queueId: 'q-1',
    patientId: 'pat-4',
    doctorId: 'doc-1',
    tokenNumber: 'CARD-015',
    priority: 'SENIOR',
    status: 'WAITING',
    position: 3,
    estimatedWaitMinutes: 16,
    expectedConsultationTime: '04:16 PM',
    delayMinutesAdded: 0,
    isEmergency: false,
    isTransferred: false,
    notes: 'Senior cardiac checkup',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    patient: initialPatients[3],
    doctor: initialDoctors[0]
  },
  {
    id: 'entry-4',
    queueId: 'q-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    tokenNumber: 'CARD-016',
    priority: 'NORMAL',
    status: 'WAITING',
    position: 4,
    estimatedWaitMinutes: 24,
    expectedConsultationTime: '04:24 PM',
    delayMinutesAdded: 0,
    isEmergency: false,
    isTransferred: false,
    notes: 'Follow-up consultation',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    patient: initialPatients[0],
    doctor: initialDoctors[0]
  },
  {
    id: 'entry-5',
    queueId: 'q-1',
    patientId: 'pat-5',
    doctorId: 'doc-1',
    tokenNumber: 'CARD-017',
    priority: 'NORMAL',
    status: 'WAITING',
    position: 5,
    estimatedWaitMinutes: 32,
    expectedConsultationTime: '04:32 PM',
    delayMinutesAdded: 0,
    isEmergency: false,
    isTransferred: false,
    notes: 'Pre-operative cardiac clearance',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    patient: initialPatients[4],
    doctor: initialDoctors[0]
  }
];

const initialQueues: Queue[] = [
  {
    id: 'q-1',
    departmentId: 'dept-1',
    department: initialDepartments[0],
    doctorId: 'doc-1',
    doctor: initialDoctors[0],
    name: 'Cardiology Main Queue (Dr. Sharma)',
    isActive: true,
    entries: initialQueueEntries
  },
  {
    id: 'q-2',
    departmentId: 'dept-2',
    department: initialDepartments[1],
    doctorId: 'doc-2',
    doctor: initialDoctors[1],
    name: 'Orthopedics Queue (Dr. Iyer)',
    isActive: true,
    entries: [
      {
        id: 'entry-orth-1',
        queueId: 'q-2',
        patientId: 'pat-5',
        doctorId: 'doc-2',
        tokenNumber: 'ORTH-008',
        priority: 'NORMAL',
        status: 'WAITING',
        position: 1,
        estimatedWaitMinutes: 10,
        expectedConsultationTime: '04:10 PM',
        delayMinutesAdded: 0,
        isEmergency: false,
        isTransferred: false,
        notes: 'Knee joint pain',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patient: initialPatients[4],
        doctor: initialDoctors[1]
      }
    ]
  },
  {
    id: 'q-3',
    departmentId: 'dept-3',
    department: initialDepartments[2],
    doctorId: 'doc-3',
    doctor: initialDoctors[2],
    name: 'Medicine Queue (Dr. Patel)',
    isActive: true,
    entries: []
  },
  {
    id: 'q-4',
    departmentId: 'dept-4',
    department: initialDepartments[3],
    doctorId: 'doc-4',
    doctor: initialDoctors[3],
    name: 'Pediatrics Queue (Dr. Reddy)',
    isActive: true,
    entries: []
  }
];

const initialAppointments: Appointment[] = [
  {
    id: 'appt-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    departmentId: 'dept-1',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '04:15 PM',
    status: 'SCHEDULED',
    reason: 'Follow-up consultation',
    tokenNumber: 'CARD-016',
    department: initialDepartments[0],
    doctor: initialDoctors[0],
    patient: initialPatients[0]
  },
  {
    id: 'appt-2',
    patientId: 'pat-1',
    doctorId: 'doc-3',
    departmentId: 'dept-3',
    appointmentDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    status: 'COMPLETED',
    reason: 'Annual Health Check',
    tokenNumber: 'MED-042',
    department: initialDepartments[2],
    doctor: initialDoctors[2],
    patient: initialPatients[0]
  }
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-pat-1',
    patientId: 'pat-1',
    title: 'Your Turn Is Approaching',
    message: 'Token CARD-016 is now #2 in queue for Dr. Sharma (Room 203). Estimated wait: ~16 min.',
    type: 'TURN_NEAR',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'user-pat-1',
    patientId: 'pat-1',
    title: 'Appointment Confirmed',
    message: 'Your Cardiology appointment has been booked. Digital Token: CARD-016.',
    type: 'APPOINTMENT_CONFIRMED',
    isRead: true,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'audit-1',
    userRole: 'DOCTOR',
    userName: 'Dr. Sharma',
    action: 'CONSULTATION_STARTED',
    affectedEntity: 'Token CARD-013',
    details: 'Dr. Sharma started consultation with Sunil Rao in Room 203.',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString()
  },
  {
    id: 'audit-2',
    userRole: 'RECEPTIONIST',
    userName: 'Priya Receptionist',
    action: 'WALKIN_REGISTERED',
    affectedEntity: 'Token CARD-017',
    details: 'Walk-in registration generated for Neha Patil in Cardiology OPD.',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: 'audit-3',
    userRole: 'DOCTOR',
    userName: 'Dr. Sharma',
    action: 'DELAY_REPORTED',
    affectedEntity: 'Cardiology Queue',
    details: 'Dr. Sharma logged a 15 min delay for Emergency Ward Rounds.',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString()
  },
  {
    id: 'audit-4',
    userRole: 'ADMIN',
    userName: 'Hospital Admin',
    action: 'DOCTOR_AVAILABILITY_CHANGED',
    affectedEntity: 'Dr. Rajesh Patel',
    details: 'Dr. Rajesh Patel marked available in Room 108.',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString()
  }
];

class MockStore {
  private state: MockState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): MockState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse mock state from localStorage', e);
    }
    const defaultState: MockState = {
      users: initialUsers,
      departments: initialDepartments,
      doctors: initialDoctors,
      patients: initialPatients,
      queues: initialQueues,
      appointments: initialAppointments,
      notifications: initialNotifications,
      auditLogs: initialAuditLogs
    };
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: MockState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save mock state to localStorage', e);
    }
  }

  private emitUpdate(type: 'queue' | 'notif', payload?: any) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(type === 'queue' ? 'qentra:queue_updated' : 'qentra:notification_received', {
          detail: payload || { timestamp: Date.now() }
        })
      );
    }
  }

  private addAudit(userRole: string, userName: string, action: string, affectedEntity: string, details: string) {
    const newAudit: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userRole,
      userName,
      action,
      affectedEntity,
      details,
      createdAt: new Date().toISOString()
    };
    this.state.auditLogs = [newAudit, ...this.state.auditLogs];
    this.saveState(this.state);
  }

  private addNotification(patientId: string, title: string, message: string, type: string) {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      patientId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.state.notifications = [newNotif, ...this.state.notifications];
    this.saveState(this.state);
    this.emitUpdate('notif', newNotif);
  }

  // AUTH
  public demoLogin(role: Role) {
    const user = this.state.users.find((u) => u.role === role) || this.state.users[0];
    const token = `mock_token_${user.id}_${Date.now()}`;
    return {
      success: true,
      token,
      user
    };
  }

  public login(credentials: { email: string; password: string }) {
    const user = this.state.users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase()) || {
      id: `user-${Date.now()}`,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: 'PATIENT' as Role,
      phone: '9876543210',
      isSeniorCitizen: false
    };
    const token = `mock_token_${user.id}_${Date.now()}`;
    return {
      success: true,
      token,
      user
    };
  }

  public register(userData: any) {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New Patient',
      email: userData.email,
      role: (userData.role || 'PATIENT') as Role,
      phone: userData.phone || '9876543210',
      patientId: `pat-${Date.now()}`,
      isSeniorCitizen: parseInt(userData.age || '30') >= 60
    };
    const newPatient: Patient = {
      id: newUser.patientId!,
      userId: newUser.id,
      name: newUser.name,
      age: parseInt(userData.age || '30'),
      gender: userData.gender || 'Male',
      phone: newUser.phone!,
      email: newUser.email,
      isSeniorCitizen: !!newUser.isSeniorCitizen
    };
    this.state.users.push(newUser);
    this.state.patients.push(newPatient);
    this.saveState(this.state);
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    return {
      success: true,
      token,
      user: newUser
    };
  }

  public getMe(token: string | null) {
    if (!token) return { success: false, message: 'No token' };
    const user = this.state.users[0];
    return { success: true, user };
  }

  // QUEUE
  public getDepartments(departmentId?: string) {
    let queues = this.state.queues;
    if (departmentId) {
      queues = queues.filter((q) => q.departmentId === departmentId);
    }
    return {
      success: true,
      departments: this.state.departments,
      queues
    };
  }

  public getMyQueue() {
    const pat1 = this.state.patients[0];
    for (const q of this.state.queues) {
      const entry = q.entries.find((e) => e.patientId === pat1.id || e.patient?.name === pat1.name);
      if (entry) {
        const patientsAhead = q.entries.filter(
          (e) => e.position < entry.position && (e.status === 'WAITING' || e.status === 'CALLED')
        ).length;
        return {
          success: true,
          hasActiveQueue: true,
          token: entry.tokenNumber,
          position: entry.position,
          status: entry.status,
          patientsAhead,
          estimatedWaitMinutes: entry.estimatedWaitMinutes,
          expectedConsultationTime: entry.expectedConsultationTime || '04:15 PM',
          doctor: {
            name: q.doctor?.user.name || 'Dr. Sharma',
            department: q.department.name,
            roomNumber: q.doctor?.roomNumber || '203',
            currentDelayMinutes: q.doctor?.currentDelayMinutes || 0
          }
        };
      }
    }
    return {
      success: true,
      hasActiveQueue: false,
      message: 'No active queue token'
    };
  }

  public getDoctorQueue(doctorId?: string) {
    const docId = doctorId || 'doc-1';
    const doctor = this.state.doctors.find((d) => d.id === docId) || this.state.doctors[0];
    const queue = this.state.queues.find((q) => q.doctorId === docId) || this.state.queues[0];
    const activeList = queue.entries.filter((e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED');
    const waitingList = activeList.filter((e) => e.status === 'WAITING');
    const inConsultation = activeList.find((e) => e.status === 'IN_CONSULTATION');
    const called = activeList.find((e) => e.status === 'CALLED');

    return {
      success: true,
      doctor: {
        id: doctor.id,
        name: doctor.user.name,
        departmentName: doctor.department.name,
        roomNumber: doctor.roomNumber,
        averageConsultationTimeMinutes: doctor.averageConsultationTimeMinutes,
        currentDelayMinutes: doctor.currentDelayMinutes
      },
      queue: {
        id: queue.id,
        waitingCount: waitingList.length,
        inConsultation: inConsultation || null,
        called: called || null,
        completedToday: 28,
        averageWaitMinutes: 18 + doctor.currentDelayMinutes,
        activeList
      }
    };
  }

  public callNext(data: { queueId?: string; entryId?: string }) {
    const queue = this.state.queues[0];
    let targetEntry: QueueEntry | undefined;

    if (data.entryId) {
      targetEntry = queue.entries.find((e) => e.id === data.entryId);
    } else {
      targetEntry = queue.entries.find((e) => e.status === 'WAITING');
    }

    if (!targetEntry) {
      return { success: false, message: 'No waiting patient to call' };
    }

    targetEntry.status = 'CALLED';
    targetEntry.calledAt = new Date().toISOString();
    this.saveState(this.state);

    this.addAudit('DOCTOR', 'Dr. Sharma', 'PATIENT_CALLED', targetEntry.tokenNumber, `Called token ${targetEntry.tokenNumber} to Room 203`);
    this.addNotification(targetEntry.patientId, 'Token Called!', `Token ${targetEntry.tokenNumber}: Please proceed to Room 203 for Dr. Sharma.`, 'TOKEN_CALLED');
    this.emitUpdate('queue');

    return {
      success: true,
      message: `Called Token ${targetEntry.tokenNumber}`,
      entry: targetEntry
    };
  }

  public startConsultation(entryId: string) {
    for (const q of this.state.queues) {
      const entry = q.entries.find((e) => e.id === entryId);
      if (entry) {
        entry.status = 'IN_CONSULTATION';
        entry.consultationStartedAt = new Date().toISOString();
        this.saveState(this.state);
        this.addAudit('DOCTOR', 'Dr. Sharma', 'CONSULTATION_STARTED', entry.tokenNumber, `Consultation started with ${entry.patient?.name}`);
        this.emitUpdate('queue');
        return { success: true, entry };
      }
    }
    return { success: false, message: 'Entry not found' };
  }

  public completeConsultation(entryId: string) {
    for (const q of this.state.queues) {
      const index = q.entries.findIndex((e) => e.id === entryId);
      if (index !== -1) {
        const [completedEntry] = q.entries.splice(index, 1);
        completedEntry.status = 'COMPLETED';
        completedEntry.completedAt = new Date().toISOString();
        // Recalculate positions
        q.entries.forEach((e, idx) => {
          e.position = idx + 1;
          e.estimatedWaitMinutes = Math.max(0, idx * 8);
        });
        this.saveState(this.state);
        this.addAudit('DOCTOR', 'Dr. Sharma', 'CONSULTATION_COMPLETED', completedEntry.tokenNumber, `Completed consultation for ${completedEntry.patient?.name}`);
        this.emitUpdate('queue');
        return { success: true, entry: completedEntry };
      }
    }
    return { success: false, message: 'Entry not found' };
  }

  public reportDelay(data: { doctorId?: string; delayMinutes: number; reason?: string }) {
    const doc = this.state.doctors.find((d) => d.id === (data.doctorId || 'doc-1')) || this.state.doctors[0];
    doc.currentDelayMinutes += data.delayMinutes;

    for (const q of this.state.queues) {
      if (q.doctorId === doc.id) {
        q.entries.forEach((e) => {
          if (e.status === 'WAITING') {
            e.estimatedWaitMinutes += data.delayMinutes;
          }
        });
      }
    }
    this.saveState(this.state);
    this.addAudit('DOCTOR', doc.user.name, 'DELAY_REPORTED', `${data.delayMinutes} min`, `Reported delay due to: ${data.reason || 'Ward Rounds'}`);
    this.emitUpdate('queue');

    return {
      success: true,
      message: `Reported ${data.delayMinutes} min delay successfully`
    };
  }

  public markNoShow(entryId: string) {
    for (const q of this.state.queues) {
      const index = q.entries.findIndex((e) => e.id === entryId);
      if (index !== -1) {
        const [noShowEntry] = q.entries.splice(index, 1);
        noShowEntry.status = 'NO_SHOW';
        q.entries.forEach((e, idx) => {
          e.position = idx + 1;
          e.estimatedWaitMinutes = Math.max(0, idx * 8);
        });
        this.saveState(this.state);
        this.addAudit('DOCTOR', 'Dr. Sharma', 'PATIENT_NO_SHOW', noShowEntry.tokenNumber, `Marked ${noShowEntry.patient?.name} as no-show`);
        this.emitUpdate('queue');
        return { success: true, entry: noShowEntry };
      }
    }
    return { success: false, message: 'Entry not found' };
  }

  public getEmergencyPreview(departmentId: string, doctorId?: string): { success: boolean; preview: EmergencyImpactPreviewData } {
    const queue = this.state.queues.find((q) => q.departmentId === departmentId || q.doctorId === doctorId) || this.state.queues[0];
    const beforeQueue = queue.entries.slice(0, 5).map((e) => ({
      tokenNumber: e.tokenNumber,
      patientName: e.patient?.name || 'Patient',
      position: e.position,
      waitMin: e.estimatedWaitMinutes,
      status: e.status
    }));

    const afterQueue = [
      ...(beforeQueue[0] ? [beforeQueue[0]] : []),
      {
        tokenNumber: `EMG-${Math.floor(Math.random() * 900 + 100)}`,
        patientName: 'Emergency Trauma / Cardiac Case',
        position: 2,
        waitMin: 0,
        status: 'WAITING',
        isEmergency: true
      },
      ...beforeQueue.slice(1).map((e) => ({
        tokenNumber: e.tokenNumber,
        patientName: e.patientName,
        position: e.position + 1,
        waitMin: e.waitMin + 8,
        status: e.status
      }))
    ];

    return {
      success: true,
      preview: {
        totalAffectedCount: Math.max(1, beforeQueue.length - 1),
        averageWaitIncreaseMin: 8,
        affectedPatients: beforeQueue.slice(1).map((b, idx) => ({
          tokenNumber: b.tokenNumber,
          patientName: b.patientName,
          currentPosition: b.position,
          newPosition: b.position + 1,
          currentWaitMin: b.waitMin,
          newWaitMin: b.waitMin + 8,
          waitDeltaMin: 8
        })),
        beforeQueue,
        afterQueue
      }
    };
  }

  public insertEmergency(data: any) {
    const queue = this.state.queues.find((q) => q.departmentId === data.departmentId || q.doctorId === data.doctorId) || this.state.queues[0];
    const tokenNum = `EMG-${Math.floor(Math.random() * 900 + 100)}`;

    const newPatient: Patient = {
      id: `pat-emg-${Date.now()}`,
      name: data.patientName || 'Emergency Patient',
      age: data.age || 45,
      gender: data.gender || 'Male',
      phone: data.phone || '9876500999',
      isSeniorCitizen: false
    };

    const newEntry: QueueEntry = {
      id: `entry-emg-${Date.now()}`,
      queueId: queue.id,
      patientId: newPatient.id,
      doctorId: queue.doctorId || 'doc-1',
      tokenNumber: tokenNum,
      priority: 'EMERGENCY',
      status: 'WAITING',
      position: 1,
      estimatedWaitMinutes: 0,
      delayMinutesAdded: 0,
      isEmergency: true,
      isTransferred: false,
      notes: data.reason || 'Critical Emergency Insertion',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patient: newPatient,
      doctor: queue.doctor || this.state.doctors[0]
    };

    // Insert at front
    queue.entries.unshift(newEntry);
    queue.entries.forEach((e, idx) => {
      e.position = idx + 1;
      e.estimatedWaitMinutes = idx * 8;
    });

    this.saveState(this.state);
    this.addAudit('RECEPTIONIST', 'Priya Front Desk', 'EMERGENCY_INSERTED', tokenNum, `Emergency patient ${data.patientName} prioritized into ${queue.name}`);
    this.emitUpdate('queue');

    return {
      success: true,
      tokenNumber: tokenNum,
      entry: newEntry
    };
  }

  public reassignDoctor(data: { sourceDoctorId: string; targetDoctorId: string; reason?: string }) {
    const sourceQueue = this.state.queues.find((q) => q.doctorId === data.sourceDoctorId);
    const targetQueue = this.state.queues.find((q) => q.doctorId === data.targetDoctorId);
    const targetDoc = this.state.doctors.find((d) => d.id === data.targetDoctorId) || this.state.doctors[1];

    if (sourceQueue && targetQueue) {
      const waitingEntries = sourceQueue.entries.filter((e) => e.status === 'WAITING');
      sourceQueue.entries = sourceQueue.entries.filter((e) => e.status !== 'WAITING');

      waitingEntries.forEach((e) => {
        e.doctorId = targetDoc.id;
        e.doctor = targetDoc;
        e.queueId = targetQueue.id;
        e.isTransferred = true;
      });

      targetQueue.entries.push(...waitingEntries);
      targetQueue.entries.forEach((e, idx) => {
        e.position = idx + 1;
        e.estimatedWaitMinutes = idx * 8;
      });

      this.saveState(this.state);
      this.addAudit('RECEPTIONIST', 'Front Desk', 'DOCTOR_REASSIGNED', `${waitingEntries.length} Patients`, `Transferred queue to ${targetDoc.user.name} (Room ${targetDoc.roomNumber})`);
      this.emitUpdate('queue');
    }

    return {
      success: true,
      message: `Reassigned queue successfully to ${targetDoc.user.name} (Room ${targetDoc.roomNumber})`
    };
  }

  public transferQueue(data: { entryId: string; targetDoctorId?: string }) {
    const targetDoc = this.state.doctors.find((d) => d.id === data.targetDoctorId) || this.state.doctors[0];
    for (const q of this.state.queues) {
      const index = q.entries.findIndex((e) => e.id === data.entryId);
      if (index !== -1) {
        const [entry] = q.entries.splice(index, 1);
        entry.doctorId = targetDoc.id;
        entry.doctor = targetDoc;
        entry.isTransferred = true;
        const targetQ = this.state.queues.find((tq) => tq.doctorId === targetDoc.id) || this.state.queues[0];
        targetQ.entries.push(entry);
        this.saveState(this.state);
        this.addAudit('RECEPTIONIST', 'Front Desk', 'QUEUE_TRANSFERRED', entry.tokenNumber, `Transferred token to ${targetDoc.user.name}`);
        this.emitUpdate('queue');
        return { success: true, message: `Transferred token ${entry.tokenNumber} to ${targetDoc.user.name}` };
      }
    }
    return { success: false, message: 'Queue entry not found' };
  }

  public mergeQueues(data: { sourceQueueIdA: string; sourceQueueIdB: string }) {
    const qA = this.state.queues.find((q) => q.id === data.sourceQueueIdA) || this.state.queues[0];
    const qB = this.state.queues.find((q) => q.id === data.sourceQueueIdB) || this.state.queues[1];

    const entriesB = [...qB.entries];
    qB.entries = [];

    entriesB.forEach((e) => {
      e.queueId = qA.id;
      e.doctorId = qA.doctorId || e.doctorId;
      e.doctor = qA.doctor || e.doctor;
      qA.entries.push(e);
    });

    qA.entries.forEach((e, idx) => {
      e.position = idx + 1;
      e.estimatedWaitMinutes = idx * 8;
    });

    this.saveState(this.state);
    this.addAudit('ADMIN', 'Hospital Admin', 'QUEUES_MERGED', `${qA.name} & ${qB.name}`, `Merged ${entriesB.length} patients from ${qB.name} into ${qA.name}`);
    this.emitUpdate('queue');

    return {
      success: true,
      message: `Successfully merged queues into ${qA.name}`
    };
  }

  public getPublicDisplay(): { success: boolean; displayData: PublicDisplayData[] } {
    const displayData: PublicDisplayData[] = this.state.departments.map((dept) => {
      const deptDoctors = this.state.doctors.filter((d) => d.departmentId === dept.id);
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        departmentCode: dept.code,
        doctors: deptDoctors.map((doc) => {
          const q = this.state.queues.find((que) => que.doctorId === doc.id) || { entries: [] };
          const inConsult = q.entries.find((e) => e.status === 'IN_CONSULTATION');
          const called = q.entries.find((e) => e.status === 'CALLED');
          const waiting = q.entries.filter((e) => e.status === 'WAITING');
          const activeServing = inConsult || called;

          return {
            doctorId: doc.id,
            doctorName: doc.user.name,
            roomNumber: doc.roomNumber,
            nowServing: activeServing ? activeServing.tokenNumber : '---',
            nowServingPatient: activeServing ? activeServing.patient?.name : 'Ready for next patient',
            status: activeServing ? activeServing.status : 'WAITING',
            waitingCount: waiting.length,
            nextInLine: waiting.slice(0, 3).map((w) => ({
              tokenNumber: w.tokenNumber,
              patientName: w.patient?.name || 'Patient',
              estimatedWait: w.estimatedWaitMinutes
            }))
          };
        })
      };
    });

    return {
      success: true,
      displayData
    };
  }

  // APPOINTMENTS
  public bookAppointment(data: any) {
    const dept = this.state.departments.find((d) => d.id === data.departmentId) || this.state.departments[0];
    const doc = this.state.doctors.find((d) => d.id === data.doctorId) || this.state.doctors[0];
    const pat = this.state.patients[0];
    const tokenNumber = `${dept.code}-${Math.floor(Math.random() * 900 + 100)}`;

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: pat.id,
      doctorId: doc.id,
      departmentId: dept.id,
      appointmentDate: data.appointmentDate || new Date().toISOString().split('T')[0],
      timeSlot: data.timeSlot || '04:15 PM',
      status: 'SCHEDULED',
      reason: data.reason || 'Routine OPD Consultation',
      tokenNumber,
      department: dept,
      doctor: doc,
      patient: pat
    };

    const targetQueue = this.state.queues.find((q) => q.doctorId === doc.id) || this.state.queues[0];
    const newEntry: QueueEntry = {
      id: `entry-${Date.now()}`,
      queueId: targetQueue.id,
      patientId: pat.id,
      doctorId: doc.id,
      tokenNumber,
      priority: 'NORMAL',
      status: 'WAITING',
      position: targetQueue.entries.length + 1,
      estimatedWaitMinutes: targetQueue.entries.length * 8,
      expectedConsultationTime: data.timeSlot || '04:15 PM',
      delayMinutesAdded: 0,
      isEmergency: false,
      isTransferred: false,
      notes: data.reason || 'Online OPD Booking',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patient: pat,
      doctor: doc
    };

    this.state.appointments.unshift(newAppt);
    targetQueue.entries.push(newEntry);
    this.saveState(this.state);

    this.addAudit('PATIENT', pat.name, 'APPOINTMENT_BOOKED', tokenNumber, `Booked ${dept.name} with ${doc.user.name}`);
    this.addNotification(pat.id, 'Appointment Confirmed', `Appointment booked for ${dept.name}. Token: ${tokenNumber}`, 'APPOINTMENT_CONFIRMED');
    this.emitUpdate('queue');

    return {
      success: true,
      tokenNumber,
      appointment: newAppt
    };
  }

  public getMyAppointments() {
    return {
      success: true,
      appointments: this.state.appointments
    };
  }

  public cancelAppointment(id: string) {
    this.state.appointments = this.state.appointments.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a));
    this.saveState(this.state);
    return { success: true };
  }

  // PATIENTS
  public registerWalkIn(data: any) {
    const dept = this.state.departments.find((d) => d.id === data.departmentId) || this.state.departments[0];
    const doc = this.state.doctors.find((d) => d.id === data.doctorId) || this.state.doctors[0];
    const tokenNumber = `${dept.code}-${Math.floor(Math.random() * 900 + 100)}`;

    const newPatient: Patient = {
      id: `pat-walkin-${Date.now()}`,
      name: data.name,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      isSeniorCitizen: data.priority === 'SENIOR' || data.age >= 60
    };

    const targetQueue = this.state.queues.find((q) => q.doctorId === doc.id) || this.state.queues[0];
    const newEntry: QueueEntry = {
      id: `entry-walkin-${Date.now()}`,
      queueId: targetQueue.id,
      patientId: newPatient.id,
      doctorId: doc.id,
      tokenNumber,
      priority: data.priority || 'NORMAL',
      status: 'WAITING',
      position: targetQueue.entries.length + 1,
      estimatedWaitMinutes: targetQueue.entries.length * 8,
      delayMinutesAdded: 0,
      isEmergency: false,
      isTransferred: false,
      notes: data.notes || 'Walk-in Registration',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patient: newPatient,
      doctor: doc
    };

    this.state.patients.push(newPatient);
    targetQueue.entries.push(newEntry);
    this.saveState(this.state);

    this.addAudit('RECEPTIONIST', 'Front Desk', 'WALKIN_REGISTERED', tokenNumber, `Generated token for ${data.name} in ${dept.name}`);
    this.emitUpdate('queue');

    return {
      success: true,
      tokenNumber,
      entry: newEntry
    };
  }

  public searchPatients(query: string) {
    const q = query.toLowerCase();
    const matchedEntries = this.state.queues.flatMap((queue) =>
      queue.entries.filter(
        (e) =>
          e.tokenNumber.toLowerCase().includes(q) ||
          e.patient?.name.toLowerCase().includes(q) ||
          e.doctor?.user.name.toLowerCase().includes(q)
      )
    );
    return {
      success: true,
      results: {
        queueEntries: matchedEntries
      }
    };
  }

  // ADMIN
  public getHospitalData() {
    return {
      success: true,
      departments: this.state.departments,
      doctors: this.state.doctors
    };
  }

  public getAnalytics(): { success: boolean } & AdminAnalyticsData {
    const totalPatients = this.state.queues.reduce((acc, q) => acc + q.entries.length, 0) + 148;
    const totalWaiting = this.state.queues.reduce(
      (acc, q) => acc + q.entries.filter((e) => e.status === 'WAITING').length,
      0
    );
    const inConsult = this.state.queues.reduce(
      (acc, q) => acc + q.entries.filter((e) => e.status === 'IN_CONSULTATION').length,
      0
    );

    return {
      success: true,
      metrics: {
        totalPatientsToday: totalPatients,
        totalWaitingNow: totalWaiting,
        totalInConsultation: inConsult,
        totalCompletedToday: 114,
        totalEmergencyToday: 6,
        totalNoShowToday: 5,
        averageWaitMinutes: 18,
        noShowRate: '4.2%',
        emergencyRate: '3.8%',
        activeDoctorsCount: this.state.doctors.filter((d) => d.isAvailable).length,
        totalDoctorsCount: this.state.doctors.length
      },
      charts: {
        departmentDistribution: [
          { name: 'Cardiology', code: 'CARD', patients: 48, completed: 36 },
          { name: 'Orthopedics', code: 'ORTH', patients: 38, completed: 28 },
          { name: 'Gen Medicine', code: 'MED', patients: 62, completed: 50 },
          { name: 'Pediatrics', code: 'PED', patients: 32, completed: 26 }
        ],
        peakHoursData: [
          { hour: '08:00 AM', patients: 12, waitTime: 8 },
          { hour: '09:00 AM', patients: 28, waitTime: 16 },
          { hour: '10:00 AM', patients: 45, waitTime: 28 },
          { hour: '11:00 AM', patients: 52, waitTime: 34 },
          { hour: '12:00 PM', patients: 38, waitTime: 24 },
          { hour: '01:00 PM', patients: 15, waitTime: 10 },
          { hour: '02:00 PM', patients: 22, waitTime: 14 },
          { hour: '03:00 PM', patients: 40, waitTime: 26 },
          { hour: '04:00 PM', patients: 48, waitTime: 30 },
          { hour: '05:00 PM', patients: 35, waitTime: 22 },
          { hour: '06:00 PM', patients: 20, waitTime: 12 }
        ],
        delayCausesAnalytics: [
          { cause: 'Emergency OT Call', frequency: 12, avgAdditionalWaitMin: 22, totalDelayMinutes: 264 },
          { cause: 'Complex Consultation', frequency: 18, avgAdditionalWaitMin: 14, totalDelayMinutes: 252 },
          { cause: 'Patient No-Shows', frequency: 9, avgAdditionalWaitMin: 8, totalDelayMinutes: 72 },
          { cause: 'Inter-OPD Transfer', frequency: 6, avgAdditionalWaitMin: 12, totalDelayMinutes: 72 },
          { cause: 'Shift Handover', frequency: 4, avgAdditionalWaitMin: 10, totalDelayMinutes: 40 }
        ],
        doctorPerformance: this.state.doctors.map((doc, idx) => ({
          id: doc.id,
          name: doc.user.name,
          department: doc.department?.name || 'OPD',
          roomNumber: doc.roomNumber,
          avgConsultationTime: doc.averageConsultationTimeMinutes,
          currentDelay: doc.currentDelayMinutes,
          isAvailable: doc.isAvailable,
          patientsCompleted: 24 + idx * 4
        }))
      }
    };
  }

  public getAuditLogs(limit = 50, action?: string, role?: string) {
    let logs = this.state.auditLogs;
    if (role) {
      logs = logs.filter((l) => l.userRole.toLowerCase() === role.toLowerCase());
    }
    if (action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
    }
    return {
      success: true,
      logs: logs.slice(0, limit)
    };
  }

  public updateDoctorStatus(doctorId: string, data: { isAvailable?: boolean; currentDelayMinutes?: number }) {
    const doc = this.state.doctors.find((d) => d.id === doctorId);
    if (doc) {
      if (data.isAvailable !== undefined) doc.isAvailable = data.isAvailable;
      if (data.currentDelayMinutes !== undefined) doc.currentDelayMinutes = data.currentDelayMinutes;
      this.saveState(this.state);
      this.addAudit('ADMIN', 'Hospital Admin', 'DOCTOR_STATUS_UPDATED', doc.user.name, `Updated status to ${doc.isAvailable ? 'Available' : 'Unavailable'}`);
      this.emitUpdate('queue');
    }
    return { success: true };
  }

  // NOTIFICATIONS
  public getNotifications() {
    return {
      success: true,
      notifications: this.state.notifications,
      unreadCount: this.state.notifications.filter((n) => !n.isRead).length
    };
  }

  public markNotificationRead(id: string) {
    this.state.notifications = this.state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveState(this.state);
    return { success: true };
  }

  public markAllNotificationsRead() {
    this.state.notifications = this.state.notifications.map((n) => ({ ...n, isRead: true }));
    this.saveState(this.state);
    return { success: true };
  }
}

export const mockStore = new MockStore();
