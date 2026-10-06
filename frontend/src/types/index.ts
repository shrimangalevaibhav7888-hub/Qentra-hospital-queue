export const APP_NAME = 'Qentra';
export const APP_TAGLINE = 'PATIENT QUEUE MANAGEMENT';

export type Role = 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN';

export type QueueStatus = 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';

export type Priority = 'NORMAL' | 'SENIOR' | 'EMERGENCY' | 'VIP';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  patientId?: string;
  doctorId?: string;
  isSeniorCitizen?: boolean;
  doctor?: {
    id: string;
    roomNumber: string;
    specialization: string;
    departmentName: string;
    departmentId: string;
  } | null;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  active: boolean;
  doctors?: Doctor[];
}

export interface Doctor {
  id: string;
  userId: string;
  departmentId: string;
  roomNumber: string;
  specialization: string;
  averageConsultationTimeMinutes: number;
  isAvailable: boolean;
  currentDelayMinutes: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  department: Department;
}

export interface Patient {
  id: string;
  userId?: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  isSeniorCitizen: boolean;
  notes?: string;
}

export interface QueueEntry {
  id: string;
  queueId: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  tokenNumber: string;
  priority: Priority;
  status: QueueStatus;
  position: number;
  estimatedWaitMinutes: number;
  expectedConsultationTime?: string;
  calledAt?: string;
  consultationStartedAt?: string;
  completedAt?: string;
  delayMinutesAdded: number;
  isEmergency: boolean;
  isTransferred: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient: Patient;
  doctor: Doctor;
}

export interface Queue {
  id: string;
  departmentId: string;
  department: Department;
  doctorId?: string;
  doctor?: Doctor;
  name: string;
  isActive: boolean;
  entries: QueueEntry[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason?: string;
  tokenNumber?: string;
  department: Department;
  doctor: Doctor;
  patient: Patient;
  queueEntries?: QueueEntry[];
}

export interface NotificationItem {
  id: string;
  userId?: string;
  patientId?: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId?: string;
  userRole: string;
  userName: string;
  action: string;
  affectedEntity: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface EmergencyImpactPreviewData {
  totalAffectedCount: number;
  averageWaitIncreaseMin: number;
  affectedPatients: Array<{
    tokenNumber: string;
    patientName: string;
    currentPosition: number;
    newPosition: number;
    currentWaitMin: number;
    newWaitMin: number;
    waitDeltaMin: number;
  }>;
  beforeQueue: Array<{
    tokenNumber: string;
    patientName: string;
    position: number;
    waitMin: number;
    status: string;
  }>;
  afterQueue: Array<{
    tokenNumber: string;
    patientName: string;
    position: number;
    waitMin: number;
    status: string;
    isEmergency?: boolean;
  }>;
}

export interface AdminAnalyticsData {
  metrics: {
    totalPatientsToday: number;
    totalWaitingNow: number;
    totalInConsultation: number;
    totalCompletedToday: number;
    totalEmergencyToday: number;
    totalNoShowToday: number;
    averageWaitMinutes: number;
    noShowRate: string;
    emergencyRate: string;
    activeDoctorsCount: number;
    totalDoctorsCount: number;
  };
  charts: {
    departmentDistribution: Array<{
      name: string;
      code: string;
      patients: number;
      completed: number;
    }>;
    peakHoursData: Array<{
      hour: string;
      patients: number;
      waitTime: number;
    }>;
    delayCausesAnalytics: Array<{
      cause: string;
      frequency: number;
      avgAdditionalWaitMin: number;
      totalDelayMinutes: number;
    }>;
    doctorPerformance: Array<{
      id: string;
      name: string;
      department: string;
      roomNumber: string;
      avgConsultationTime: number;
      currentDelay: number;
      isAvailable: boolean;
      patientsCompleted: number;
    }>;
  };
}

export interface PublicDisplayData {
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  doctors: Array<{
    doctorId: string;
    doctorName: string;
    roomNumber: string;
    nowServing: string;
    nowServingPatient: string;
    status: string;
    nextInLine: Array<{
      tokenNumber: string;
      patientName: string;
      estimatedWait: number;
    }>;
    waitingCount: number;
  }>;
}
