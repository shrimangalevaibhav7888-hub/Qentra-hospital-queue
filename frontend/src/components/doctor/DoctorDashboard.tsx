import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { queueApi } from '../../services/api';
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  PhoneCall,
  Play,
  Check,
  AlertTriangle,
  UserX,
  RefreshCw,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { ReportDelayModal } from './ReportDelayModal';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lastQueueUpdate, lastNotification } = useSocket();

  const [doctorData, setDoctorData] = useState<any>(null);
  const [queueStats, setQueueStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [delayModalOpen, setDelayModalOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDoctorQueue = async () => {
    try {
      const res = await queueApi.getDoctorQueue(user?.doctorId);
      if (res.success) {
        setDoctorData(res.doctor);
        setQueueStats(res.queue);
      }
    } catch (err) {
      console.error('Error fetching doctor queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorQueue();
  }, [lastQueueUpdate, lastNotification]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Call Next
  const handleCallNext = async () => {
    if (!queueStats?.id) return;
    setActionLoading(true);
    try {
      const res = await queueApi.callNext({ queueId: queueStats.id });
      if (res.success) {
        showToast(`Called Token ${res.entry?.tokenNumber} (${res.entry?.patient?.name})`);
        fetchDoctorQueue();
      }
    } catch (e: any) {
      alert(e.message || 'Failed to call next patient');
    } finally {
      setActionLoading(false);
    }
  };

  // Start Consultation
  const handleStartConsultation = async (entryId: string) => {
    setActionLoading(true);
    try {
      const res = await queueApi.startConsultation(entryId);
      if (res.success) {
        showToast(`Consultation started with ${res.entry?.patient?.name}`);
        fetchDoctorQueue();
      }
    } catch (e: any) {
      alert(e.message || 'Failed to start consultation');
    } finally {
      setActionLoading(false);
    }
  };

  // Complete Consultation
  const handleCompleteConsultation = async (entryId: string) => {
    setActionLoading(true);
    try {
      const res = await queueApi.completeConsultation(entryId);
      if (res.success) {
        showToast(`Consultation completed for ${res.entry?.patient?.name}`);
        fetchDoctorQueue();
      }
    } catch (e: any) {
      alert(e.message || 'Failed to complete consultation');
    } finally {
      setActionLoading(false);
    }
  };

  // Mark No-Show
  const handleMarkNoShow = async (entryId: string) => {
    if (!window.confirm('Mark this patient as No-Show?')) return;
    setActionLoading(true);
    try {
      const res = await queueApi.markNoShow(entryId);
      if (res.success) {
        showToast(`Marked ${res.entry?.patient?.name} as No-Show`);
        fetchDoctorQueue();
      }
    } catch (e: any) {
      alert(e.message || 'Failed to mark no show');
    } finally {
      setActionLoading(false);
    }
  };

  const currentPatient = queueStats?.inConsultation || queueStats?.called;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-200">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 font-display">
                {doctorData?.name || user?.name || 'Dr. Sharma'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                OPD ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {doctorData?.departmentName || 'Cardiology'} • Room {doctorData?.roomNumber || '203'} • Avg Consultation: {doctorData?.averageConsultationTimeMinutes || 8} min
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDelayModalOpen(true)}
            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Report Delay</span>
          </button>

          <button
            onClick={fetchDoctorQueue}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Waiting Now</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {queueStats?.waitingCount || 12}
          </div>
          <span className="text-[11px] text-blue-600 font-medium">In waiting lounge</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Consultation</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">
            {queueStats?.inConsultation ? 1 : queueStats?.called ? 1 : 0}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Active in Room {doctorData?.roomNumber || '203'}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">
            {queueStats?.completedToday || 28}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Consultations finished</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Wait</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">
            {queueStats?.averageWaitMinutes || 18} min
          </div>
          <span className="text-[11px] text-indigo-700 font-medium">Dynamic queue pace</span>
        </div>

      </div>

      {/* Current Patient Consultation Action Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
              CURRENT CONSULTATION DESK
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {currentPatient ? `Active Patient: ${currentPatient.patient?.name}` : 'Consultation Desk Idle'}
            </h3>
          </div>

          {/* Quick Call Next Button */}
          <button
            onClick={handleCallNext}
            disabled={actionLoading || queueStats?.waitingCount === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>CALL NEXT PATIENT</span>
          </button>
        </div>

        {currentPatient ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black font-mono text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200">
                  {currentPatient.tokenNumber}
                </span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{currentPatient.patient?.name}</h4>
                  <p className="text-xs text-slate-500">
                    Age {currentPatient.patient?.age} • {currentPatient.patient?.gender} • Phone: {currentPatient.patient?.phone}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    currentPatient.status === 'IN_CONSULTATION'
                      ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {currentPatient.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">Reason / Notes: </span>
                {currentPatient.notes || currentPatient.appointment?.reason || 'Routine OPD Examination'}
              </div>
            </div>

            {/* Doctor Actions */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              {currentPatient.status === 'CALLED' && (
                <button
                  onClick={() => handleStartConsultation(currentPatient.id)}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>START CONSULTATION</span>
                </button>
              )}

              {currentPatient.status === 'IN_CONSULTATION' && (
                <button
                  onClick={() => handleCompleteConsultation(currentPatient.id)}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>COMPLETE CONSULTATION</span>
                </button>
              )}

              <button
                onClick={() => handleMarkNoShow(currentPatient.id)}
                disabled={actionLoading}
                className="w-full py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>MARK NO-SHOW</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            No patient is currently in your consultation room. Click <strong>CALL NEXT PATIENT</strong> to summon the next waiting patient.
          </div>
        )}
      </div>

      {/* Doctor Queue Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Consultation Waiting Queue
          </h3>
          <span className="text-xs text-slate-500">
            {queueStats?.activeList?.length || 0} active in queue
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Pos</th>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Est. Wait</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {queueStats?.activeList?.map((entry: any, idx: number) => (
                <tr
                  key={entry.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    entry.isEmergency ? 'bg-red-50/60 font-bold' : entry.status === 'CALLED' ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-slate-500">#{entry.position}</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {entry.tokenNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">
                    {entry.patient?.name}
                    {entry.isEmergency && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-bold">
                        EMERGENCY
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.priority === 'EMERGENCY'
                          ? 'bg-red-100 text-red-800'
                          : entry.priority === 'SENIOR'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {entry.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {entry.status === 'IN_CONSULTATION' || entry.status === 'CALLED'
                      ? 'NOW'
                      : `${entry.estimatedWaitMinutes} min`}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.status === 'IN_CONSULTATION'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.status === 'CALLED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {entry.status === 'WAITING' && (
                      <button
                        onClick={async () => {
                          const res = await queueApi.callNext({ queueId: entry.queueId, entryId: entry.id });
                          if (res.success) {
                            showToast(`Called Token ${entry.tokenNumber}`);
                            fetchDoctorQueue();
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px]"
                      >
                        Call
                      </button>
                    )}
                    {entry.status === 'CALLED' && (
                      <button
                        onClick={() => handleStartConsultation(entry.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                      >
                        Start
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Delay Modal */}
      <ReportDelayModal
        isOpen={delayModalOpen}
        doctorId={doctorData?.id || user?.doctorId}
        doctorName={doctorData?.name}
        onClose={() => setDelayModalOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          fetchDoctorQueue();
        }}
      />

    </div>
  );
};
