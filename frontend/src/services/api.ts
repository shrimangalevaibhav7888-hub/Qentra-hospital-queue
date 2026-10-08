import { mockStore } from './mockStore';

const API_BASE = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '') + '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('qentra_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('qentra_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('qentra_token');
};

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({ success: false, message: 'Server response error' }));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    // If backend is down or network unreachable, fallback automatically to mockStore
    console.debug(`[Qentra Engine] Using offline mock store for endpoint: ${endpoint}`);
    return executeMockFallback<T>(endpoint, options);
  }
};

// Mock Fallback Router
function executeMockFallback<T = any>(endpoint: string, options: RequestInit): T {
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // AUTH
  if (clean === '/auth/demo-login') {
    return mockStore.demoLogin(body.role) as any;
  }
  if (clean === '/auth/login') {
    return mockStore.login(body) as any;
  }
  if (clean === '/auth/register') {
    return mockStore.register(body) as any;
  }
  if (clean === '/auth/me') {
    return mockStore.getMe(getAuthToken()) as any;
  }
  if (clean === '/auth/logout') {
    return { success: true } as any;
  }

  // QUEUE
  if (clean.startsWith('/queue/departments')) {
    const urlParams = new URLSearchParams(clean.split('?')[1] || '');
    return mockStore.getDepartments(urlParams.get('departmentId') || undefined) as any;
  }
  if (clean === '/queue/my-queue') {
    return mockStore.getMyQueue() as any;
  }
  if (clean.startsWith('/queue/doctor')) {
    const parts = clean.split('/');
    const docId = parts.length > 3 ? parts[3] : undefined;
    return mockStore.getDoctorQueue(docId) as any;
  }
  if (clean === '/queue/call-next') {
    return mockStore.callNext(body) as any;
  }
  if (clean === '/queue/start-consultation') {
    return mockStore.startConsultation(body.entryId) as any;
  }
  if (clean === '/queue/complete-consultation') {
    return mockStore.completeConsultation(body.entryId) as any;
  }
  if (clean === '/queue/report-delay') {
    return mockStore.reportDelay(body) as any;
  }
  if (clean === '/queue/no-show') {
    return mockStore.markNoShow(body.entryId) as any;
  }
  if (clean.startsWith('/queue/emergency/preview')) {
    const urlParams = new URLSearchParams(clean.split('?')[1] || '');
    return mockStore.getEmergencyPreview(urlParams.get('departmentId') || 'dept-1', urlParams.get('doctorId') || undefined) as any;
  }
  if (clean === '/queue/emergency/insert') {
    return mockStore.insertEmergency(body) as any;
  }
  if (clean === '/queue/reassign-doctor') {
    return mockStore.reassignDoctor(body) as any;
  }
  if (clean === '/queue/transfer') {
    return mockStore.transferQueue(body) as any;
  }
  if (clean === '/queue/merge') {
    return mockStore.mergeQueues(body) as any;
  }
  if (clean === '/queue/public-display') {
    return mockStore.getPublicDisplay() as any;
  }

  // APPOINTMENTS
  if (clean === '/appointments/book') {
    return mockStore.bookAppointment(body) as any;
  }
  if (clean === '/appointments/my-appointments') {
    return mockStore.getMyAppointments() as any;
  }
  if (clean.startsWith('/appointments/cancel/')) {
    const id = clean.replace('/appointments/cancel/', '');
    return mockStore.cancelAppointment(id) as any;
  }

  // PATIENTS
  if (clean === '/patients/walk-in') {
    return mockStore.registerWalkIn(body) as any;
  }
  if (clean.startsWith('/patients/search')) {
    const urlParams = new URLSearchParams(clean.split('?')[1] || '');
    return mockStore.searchPatients(urlParams.get('query') || '') as any;
  }

  // ADMIN
  if (clean === '/admin/hospital-data') {
    return mockStore.getHospitalData() as any;
  }
  if (clean === '/admin/analytics') {
    return mockStore.getAnalytics() as any;
  }
  if (clean.startsWith('/admin/audit-logs')) {
    const urlParams = new URLSearchParams(clean.split('?')[1] || '');
    const limit = parseInt(urlParams.get('limit') || '50');
    const action = urlParams.get('action') || undefined;
    const role = urlParams.get('role') || undefined;
    return mockStore.getAuditLogs(limit, action, role) as any;
  }
  if (clean.startsWith('/admin/doctor/') && clean.endsWith('/status')) {
    const doctorId = clean.replace('/admin/doctor/', '').replace('/status', '');
    return mockStore.updateDoctorStatus(doctorId, body) as any;
  }

  // NOTIFICATIONS
  if (clean === '/notifications/my') {
    return mockStore.getNotifications() as any;
  }
  if (clean.startsWith('/notifications/') && clean.endsWith('/read')) {
    const id = clean.replace('/notifications/', '').replace('/read', '');
    return mockStore.markNotificationRead(id) as any;
  }
  if (clean === '/notifications/read-all') {
    return mockStore.markAllNotificationsRead() as any;
  }

  return { success: true } as any;
}

// API Services
export const authApi = {
  login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  demoLogin: (role: string) => apiRequest('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => apiRequest('/auth/me')
};

export const queueApi = {
  getDepartments: (departmentId?: string) =>
    apiRequest(`/queue/departments${departmentId ? `?departmentId=${departmentId}` : ''}`),
  getMyQueue: () => apiRequest('/queue/my-queue'),
  getDoctorQueue: (doctorId?: string) =>
    apiRequest(`/queue/doctor${doctorId ? `/${doctorId}` : ''}`),
  callNext: (data: { queueId?: string; entryId?: string }) =>
    apiRequest('/queue/call-next', { method: 'POST', body: JSON.stringify(data) }),
  startConsultation: (entryId: string) =>
    apiRequest('/queue/start-consultation', { method: 'POST', body: JSON.stringify({ entryId }) }),
  completeConsultation: (entryId: string) =>
    apiRequest('/queue/complete-consultation', { method: 'POST', body: JSON.stringify({ entryId }) }),
  reportDelay: (data: { doctorId?: string; delayMinutes: number; reason?: string }) =>
    apiRequest('/queue/report-delay', { method: 'POST', body: JSON.stringify(data) }),
  markNoShow: (entryId: string) =>
    apiRequest('/queue/no-show', { method: 'POST', body: JSON.stringify({ entryId }) }),
  getEmergencyPreview: (departmentId: string, doctorId?: string) =>
    apiRequest(`/queue/emergency/preview?departmentId=${departmentId}${doctorId ? `&doctorId=${doctorId}` : ''}`),
  insertEmergency: (data: any) =>
    apiRequest('/queue/emergency/insert', { method: 'POST', body: JSON.stringify(data) }),
  reassignDoctor: (data: { sourceDoctorId: string; targetDoctorId: string; reason?: string }) =>
    apiRequest('/queue/reassign-doctor', { method: 'POST', body: JSON.stringify(data) }),
  transferQueue: (data: { entryId: string; targetDoctorId?: string; targetDepartmentId?: string }) =>
    apiRequest('/queue/transfer', { method: 'POST', body: JSON.stringify(data) }),
  mergeQueues: (data: { sourceQueueIdA: string; sourceQueueIdB: string; targetDoctorId?: string }) =>
    apiRequest('/queue/merge', { method: 'POST', body: JSON.stringify(data) }),
  getPublicDisplay: () => apiRequest('/queue/public-display')
};

export const appointmentApi = {
  book: (data: any) => apiRequest('/appointments/book', { method: 'POST', body: JSON.stringify(data) }),
  getMyAppointments: () => apiRequest('/appointments/my-appointments'),
  cancel: (id: string) => apiRequest(`/appointments/cancel/${id}`, { method: 'PATCH' })
};

export const patientApi = {
  registerWalkIn: (data: any) => apiRequest('/patients/walk-in', { method: 'POST', body: JSON.stringify(data) }),
  search: (query: string) => apiRequest(`/patients/search?query=${encodeURIComponent(query)}`)
};

export const adminApi = {
  getHospitalData: () => apiRequest('/admin/hospital-data'),
  getAnalytics: () => apiRequest('/admin/analytics'),
  getAuditLogs: (limit = 50, action?: string, role?: string) =>
    apiRequest(`/admin/audit-logs?limit=${limit}${action ? `&action=${action}` : ''}${role ? `&role=${role}` : ''}`),
  updateDoctorStatus: (doctorId: string, data: { isAvailable?: boolean; currentDelayMinutes?: number }) =>
    apiRequest(`/admin/doctor/${doctorId}/status`, { method: 'PATCH', body: JSON.stringify(data) })
};

export const notificationApi = {
  getMy: () => apiRequest('/notifications/my'),
  markRead: (id: string) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => apiRequest('/notifications/read-all', { method: 'PATCH' })
};
