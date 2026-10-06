import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { queueApi, appointmentApi } from '../../services/api';
import {
  Activity,
  Calendar,
  Clock,
  User,
  Building2,
  Stethoscope,
  Plus,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Bell,
  Eye,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { BookAppointmentModal } from './BookAppointmentModal';
import { SeniorCitizenEasyView } from './SeniorCitizenEasyView';

export const PatientDashboard: React.FC = () => {
  const { user, isSeniorEasyView, toggleSeniorEasyView } = useAuth();
  const { lastQueueUpdate, lastNotification } = useSocket();

  const [queueInfo, setQueueInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchPatientData = async () => {
    try {
      const [queueRes, apptRes] = await Promise.all([
        queueApi.getMyQueue().catch(() => ({ success: false })),
        appointmentApi.getMyAppointments().catch(() => ({ success: false, appointments: [] }))
      ]);

      if (queueRes.success) {
        setQueueInfo(queueRes);
      }
      if (apptRes.success) {
        setAppointments(apptRes.appointments || []);
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [lastQueueUpdate, lastNotification]);

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentApi.cancel(id);
      setSuccessToast('Appointment cancelled successfully');
      fetchPatientData();
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to cancel appointment');
    }
  };

  if (isSeniorEasyView) {
    return <SeniorCitizenEasyView />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Patient Portal
            </span>
            <span className="text-xs text-slate-400">• OPD Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">
            Welcome, {user?.name || 'Patient'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your live token position, manage appointments, and receive doctor alerts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSeniorEasyView}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>Senior Easy View</span>
          </button>

          <button
            onClick={() => setBookModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Live Queue Card, Right Quick Stats & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Live Queue Status Card (Primary Focus) */}
        <div className="lg:col-span-7 space-y-6">
          {queueInfo?.hasActiveQueue ? (
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
              
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[90px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-between border-b border-indigo-800/60 pb-4 mb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                    TODAY'S APPOINTMENT
                  </span>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>{queueInfo.doctor?.department} OPD</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                      LIVE ●
                    </span>
                  </h3>
                </div>

                <button
                  onClick={fetchPatientData}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Refresh Queue"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Huge Token Badge & Standing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                
                {/* Token Box */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                    YOUR TOKEN
                  </span>
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white block mt-1">
                    {queueInfo.token}
                  </span>
                  <span className="text-[11px] text-indigo-200 font-medium">
                    {queueInfo.status === 'CALLED' ? 'Called by Doctor' : queueInfo.status}
                  </span>
                </div>

                {/* Queue Position */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                    QUEUE POSITION
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-indigo-300 block mt-1">
                    #{queueInfo.position}
                  </span>
                  <span className="text-[11px] text-indigo-200 font-medium">
                    {queueInfo.patientsAhead} patients ahead
                  </span>
                </div>

                {/* Estimated Wait */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
                  <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">
                    ESTIMATED WAIT
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-amber-300 block mt-1">
                    {queueInfo.estimatedWaitMinutes} min
                  </span>
                  <span className="text-[11px] text-indigo-200 font-medium">
                    Expected: {queueInfo.expectedConsultationTime || '04:15 PM'}
                  </span>
                </div>

              </div>

              {/* Doctor Details Bar */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm">
                    {queueInfo.doctor?.name?.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{queueInfo.doctor?.name}</div>
                    <div className="text-indigo-200">Room {queueInfo.doctor?.roomNumber} • Ground Floor</div>
                  </div>
                </div>

                {queueInfo.doctor?.currentDelayMinutes > 0 && (
                  <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Doctor Delay: +{queueInfo.doctor.currentDelayMinutes} min</span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Active Queue Token</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not currently have a waiting token in the hospital OPD queue. Book an appointment to get your live token.
              </p>
              <button
                onClick={() => setBookModalOpen(true)}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-indigo-700"
              >
                Book Appointment Now
              </button>
            </div>
          )}

          {/* Appointments History List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Your Appointments History</span>
              <span className="text-xs text-slate-400 font-normal">
                {appointments.length} record(s)
              </span>
            </h3>

            {appointments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">No appointment history found.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <div key={appt.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{appt.department?.name}</span>
                        {appt.tokenNumber && (
                          <span className="font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                            {appt.tokenNumber}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            appt.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : appt.status === 'CANCELLED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        {appt.doctor?.user?.name} • {appt.timeSlot} • {new Date(appt.appointmentDate).toLocaleDateString()}
                      </div>
                    </div>

                    {appt.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Quick Information & Patient Profile */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Patient Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Patient Details</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Full Name</span>
                <span className="font-bold text-slate-900">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="font-semibold text-slate-800">{user?.phone || '9876543210'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Senior Citizen Status</span>
                <span className={`font-bold ${user?.isSeniorCitizen ? 'text-amber-700' : 'text-slate-700'}`}>
                  {user?.isSeniorCitizen ? 'Yes (Priority Senior)' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* OPD Instructions */}
          <div className="bg-indigo-50/70 rounded-3xl p-6 border border-indigo-100 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>Hospital OPD Guidelines</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              • Please arrive near your designated consultation room when only <strong>2 patients</strong> are ahead of you.
            </p>
            <p className="text-slate-600 leading-relaxed">
              • Your token will be announced on the public waiting room display and sent via mobile alert.
            </p>
            <p className="text-slate-600 leading-relaxed">
              • In case of emergency patients, the queue automatically recalibrates transparently.
            </p>
          </div>

        </div>

      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSuccess={(tokenNum) => {
          setSuccessToast(`Appointment booked successfully! Token: ${tokenNum}`);
          fetchPatientData();
          setTimeout(() => setSuccessToast(null), 5000);
        }}
      />

    </div>
  );
};
