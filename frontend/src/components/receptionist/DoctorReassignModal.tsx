import React, { useState, useEffect } from 'react';
import { X, UserCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { adminApi, queueApi } from '../../services/api';
import type { Doctor } from '../../types';

interface DoctorReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const DoctorReassignModal: React.FC<DoctorReassignModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [sourceDoctorId, setSourceDoctorId] = useState('');
  const [targetDoctorId, setTargetDoctorId] = useState('');
  const [reason, setReason] = useState('Doctor Called to Surgery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDoctors();
    }
  }, [isOpen]);

  const loadDoctors = async () => {
    try {
      const res = await adminApi.getHospitalData();
      if (res.success) {
        setDoctors(res.doctors);
        if (res.doctors.length >= 2) {
          setSourceDoctorId(res.doctors[0].id);
          setTargetDoctorId(res.doctors[1].id);
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceDoctorId || !targetDoctorId) {
      setError('Please select both source and target doctors.');
      return;
    }
    if (sourceDoctorId === targetDoctorId) {
      setError('Source and target doctor cannot be identical.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await queueApi.reassignDoctor({
        sourceDoctorId,
        targetDoctorId,
        reason
      });

      if (res.success) {
        onSuccess(res.message);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reassign doctor queue');
    } finally {
      setLoading(false);
    }
  };

  const sourceDoctor = doctors.find((d) => d.id === sourceDoctorId);
  const targetDoctor = doctors.find((d) => d.id === targetDoctorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-left">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Doctor Reassignment</h3>
            <p className="text-xs text-slate-500">Move waiting patients when a physician is unavailable</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Visual Reassignment Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <label className="text-[10px] font-bold text-red-600 uppercase block mb-1">
                Unavailable Doctor
              </label>
              <select
                value={sourceDoctorId}
                onChange={(e) => setSourceDoctorId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user.name} ({doc.department?.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">
                Reassign To Replacement
              </label>
              <select
                value={targetDoctorId}
                onChange={(e) => setTargetDoctorId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                {doctors
                  .filter((d) => d.id !== sourceDoctorId)
                  .map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.user.name} (Room {doc.roomNumber})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Reason for Reassignment</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Doctor called to emergency cardiac OT"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
            <span>
              All waiting patients will have their tokens automatically moved to {targetDoctor?.user.name}'s queue in Room {targetDoctor?.roomNumber} and will receive a mobile alert.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !sourceDoctorId || !targetDoctorId}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all"
          >
            {loading ? <span>Reassigning Patients...</span> : <span>Confirm Reassignment</span>}
          </button>

        </form>

      </div>
    </div>
  );
};
