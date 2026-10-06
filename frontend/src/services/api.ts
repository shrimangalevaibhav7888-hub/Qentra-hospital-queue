const API_BASE = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api';

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

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Server response error' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

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
