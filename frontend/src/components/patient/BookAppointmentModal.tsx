import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Stethoscope, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminApi, appointmentApi } from '../../services/api';
import type { Department, Doctor } from '../../types';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tokenNumber: string) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<string>('04:15 PM');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:15 PM', '04:45 PM', '05:15 PM'
  ];

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const data = await adminApi.getHospitalData();
      if (data.success) {
        setDepartments(data.departments);
        setDoctors(data.doctors);
        if (data.departments.length > 0) {
          setSelectedDeptId(data.departments[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load hospital data');
    }
  };

  const filteredDoctors = doctors.filter(
    (d) => !selectedDeptId || d.departmentId === selectedDeptId
  );

  useEffect(() => {
    if (filteredDoctors.length > 0) {
      setSelectedDoctorId(filteredDoctors[0].id);
    } else {
      setSelectedDoctorId('');
    }
  }, [selectedDeptId, doctors]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeptId || !selectedDoctorId) {
      setError('Please select both department and doctor.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await appointmentApi.book({
        departmentId: selectedDeptId,
        doctorId: selectedDoctorId,
        appointmentDate,
        timeSlot,
        reason: reason || 'Routine OPD Consultation'
      });

      if (res.success) {
        onSuccess(res.tokenNumber);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto text-left">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Book an Appointment</h3>
            <p className="text-xs text-slate-500">Get your digital queue token instantly</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Department Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Department
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all flex flex-col justify-between ${
                    selectedDeptId === dept.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{dept.code}</span>
                  <span className="truncate">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Doctor
            </label>
            {filteredDoctors.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No available doctors in this department.</p>
            ) : (
              <div className="space-y-2">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedDoctorId === doc.id
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {doc.user.name.replace('Dr. ', '').charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{doc.user.name}</div>
                        <div className="text-[11px] text-slate-500">{doc.specialization}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        Room {doc.roomNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                required
                value={appointmentDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Reason / Symptoms (Optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Routine blood pressure review, chest discomfort"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !selectedDoctorId}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Confirming Booking...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Appointment & Generate Token</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
