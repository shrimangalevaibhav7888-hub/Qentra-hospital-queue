import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { adminApi } from '../../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  ShieldCheck,
  FileText,
  Building2,
  Stethoscope,
  RefreshCw,
  CheckCircle2,
  UserX,
  Zap,
  Activity
} from 'lucide-react';
import type { AdminAnalyticsData, AuditLogItem } from '../../types';

const defaultAnalytics: AdminAnalyticsData = {
  metrics: {
    totalPatientsToday: 154,
    totalWaitingNow: 12,
    totalInConsultation: 3,
    totalCompletedToday: 114,
    totalEmergencyToday: 6,
    totalNoShowToday: 5,
    averageWaitMinutes: 18,
    noShowRate: '3.9%',
    emergencyRate: '4.1%',
    activeDoctorsCount: 4,
    totalDoctorsCount: 4
  },
  charts: {
    departmentDistribution: [
      { name: 'Cardiology', code: 'CARD', patients: 53, completed: 36 },
      { name: 'Orthopedics', code: 'ORTH', patients: 39, completed: 28 },
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
      { hour: '05:00 PM', patients: 35, waitTime: 22 }
    ],
    delayCausesAnalytics: [
      { cause: 'Emergency OT Call', frequency: 12, avgAdditionalWaitMin: 22, totalDelayMinutes: 264 },
      { cause: 'Complex Consultation', frequency: 18, avgAdditionalWaitMin: 14, totalDelayMinutes: 252 },
      { cause: 'Patient No-Shows', frequency: 9, avgAdditionalWaitMin: 8, totalDelayMinutes: 72 },
      { cause: 'Inter-OPD Transfer', frequency: 6, avgAdditionalWaitMin: 12, totalDelayMinutes: 72 },
      { cause: 'Shift Handover', frequency: 4, avgAdditionalWaitMin: 10, totalDelayMinutes: 40 }
    ],
    doctorPerformance: [
      { id: 'doc-1', name: 'Dr. Sharma', department: 'Cardiology OPD', roomNumber: '203', avgConsultationTime: 8, currentDelay: 0, isAvailable: true, patientsCompleted: 28 },
      { id: 'doc-2', name: 'Dr. Ananya Iyer', department: 'Orthopedics OPD', roomNumber: '105', avgConsultationTime: 10, currentDelay: 0, isAvailable: true, patientsCompleted: 24 },
      { id: 'doc-3', name: 'Dr. Rajesh Patel', department: 'General Medicine', roomNumber: '108', avgConsultationTime: 7, currentDelay: 0, isAvailable: true, patientsCompleted: 32 },
      { id: 'doc-4', name: 'Dr. Sneha Reddy', department: 'Pediatrics Wing', roomNumber: '112', avgConsultationTime: 6, currentDelay: 0, isAvailable: true, patientsCompleted: 30 }
    ]
  }
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lastQueueUpdate } = useSocket();

  const [analytics, setAnalytics] = useState<AdminAnalyticsData>(defaultAnalytics);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'audit' | 'doctors'>('analytics');
  const [loading, setLoading] = useState(false);

  // Filters for audit log
  const [logFilterRole, setLogFilterRole] = useState<string>('');
  const [logFilterAction, setLogFilterAction] = useState<string>('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, logsRes] = await Promise.all([
        adminApi.getAnalytics().catch(() => null),
        adminApi.getAuditLogs(50, logFilterAction || undefined, logFilterRole || undefined).catch(() => null)
      ]);

      if (analyticsRes && analyticsRes.success && analyticsRes.metrics) {
        setAnalytics(analyticsRes);
      }
      if (logsRes && logsRes.success && logsRes.logs) {
        setAuditLogs(logsRes.logs);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [lastQueueUpdate, logFilterRole, logFilterAction]);

  const handleToggleDoctor = async (doctorId: string, currentStatus: boolean) => {
    try {
      await adminApi.updateDoctorStatus(doctorId, { isAvailable: !currentStatus });
      fetchAdminData();
    } catch (e: any) {
      alert(e.message || 'Failed to update doctor status');
    }
  };

  const metrics = analytics.metrics || defaultAnalytics.metrics;
  const charts = analytics.charts || defaultAnalytics.charts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
              Hospital Operations Administration
            </span>
            <span className="text-xs text-slate-400">• Executive Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">
            Hospital Analytics & Operational Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor real-time patient throughput, peak hour patterns, delay cause forensics, and audit compliance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analytics & Charts
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audit'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'doctors'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor Roster
            </button>
          </div>

          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Patients Today</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {metrics.totalPatientsToday}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">+12% vs yesterday</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Waiting Now</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {metrics.totalWaitingNow}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">In waiting lounge</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">In Consultation</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {metrics.totalInConsultation}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Across all OPDs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Average Wait</span>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">
            {metrics.averageWaitMinutes}m
          </div>
          <span className="text-[10px] text-indigo-600 font-bold">Dynamic engine</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Emergencies</span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">
            {metrics.totalEmergencyToday}
          </div>
          <span className="text-[10px] text-red-600 font-bold">Priority shifts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">No-show Rate</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {metrics.noShowRate}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Industry: ~8.5%</span>
        </div>

      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Row 1 Charts: Patients by Department & Peak Hours Influx */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Patients by Department */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Patients by Department</h3>
                  <p className="text-xs text-slate-400">Total registrations vs completed consultations</p>
                </div>
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.departmentDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="code" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="patients" name="Total Patients" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Peak Hours Distribution (8 AM to 8 PM) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hourly Peak Influx & Wait Times</h3>
                  <p className="text-xs text-slate-400">Patient arrival volume vs average wait duration</p>
                </div>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="patients" name="Patients Influx" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorPatients)" />
                    <Line type="monotone" dataKey="waitTime" name="Avg Wait (min)" stroke="#ea580c" strokeWidth={2} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 2: Delay Cause Analytics (Key Differentiator Chart!) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">Delay-Cause Forensics & Additional Wait Impact</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      DIFFERENTIATOR
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Granular frequency and average wait time added by cause</p>
                </div>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.delayCausesAnalytics} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis dataKey="cause" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={110} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="frequency" name="Occurrence Count" fill="#6366f1" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="avgAdditionalWaitMin" name="Avg Extra Wait (min)" fill="#f43f5e" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Delay Cause Summary Table */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Top Delay Contributors</h3>
              <div className="space-y-2.5">
                {charts.delayCausesAnalytics.map((cause, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{cause.cause}</div>
                      <div className="text-[10px] text-slate-400">{cause.frequency} incidents logged</div>
                    </div>
                    <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      +{cause.avgAdditionalWaitMin} min
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: AUDIT LOGS TABLE */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Operational Audit Logs</h3>
              <p className="text-xs text-slate-500">Timestamped record of all queue manipulations, registrations, and doctor calls</p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <select
                value={logFilterRole}
                onChange={(e) => setLogFilterRole(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 bg-white"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="RECEPTIONIST">RECEPTIONIST</option>
                <option value="PATIENT">PATIENT</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Affected Entity</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 italic">
                      No audit log records found matching filter.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleTimeString()} • {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{log.userName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {log.userRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700 text-[11px]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{log.affectedEntity}</td>
                      <td className="py-3 px-4 text-slate-800">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: DOCTOR PERFORMANCE & AVAILABILITY */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Doctor Roster & Performance Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {charts.doctorPerformance.map((doc) => (
              <div key={doc.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {doc.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                  <p className="text-xs text-slate-500">{doc.department} • Room {doc.roomNumber}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Avg Consult:</span>
                    <span className="font-bold">{doc.avgConsultationTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Delay:</span>
                    <span className={`font-bold ${doc.currentDelay > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                      +{doc.currentDelay} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Today:</span>
                    <span className="font-bold text-emerald-700">{doc.patientsCompleted} pts</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleDoctor(doc.id, doc.isAvailable)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                    doc.isAvailable
                      ? 'bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {doc.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
