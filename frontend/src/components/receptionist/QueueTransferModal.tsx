import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Building2, Stethoscope, CheckCircle2 } from 'lucide-react';
import { adminApi, queueApi } from '../../services/api';
import type { Doctor, QueueEntry } from '../../types';

interface QueueTransferModalProps {
  isOpen: boolean;
  activeEntries: QueueEntry[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const QueueTransferModal: React.FC<QueueTransferModalProps> = ({
  isOpen,
  activeEntries,
  onClose,
  onSuccess
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState('');
  const [targetDoctorId, setTargetDoctorId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDoctors();
      if (activeEntries.length > 0) {
        setSelectedEntryId(activeEntries[0].id);
      }
    }
  }, [isOpen, activeEntries]);

  const loadDoctors = async () => {
    try {
      const res = await adminApi.getHospitalData();
      if (res.success) {
        setDoctors(res.doctors);
        if (res.doctors.length > 0) {
          setTargetDoctorId(res.doctors[0].id);
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntryId || !targetDoctorId) {
      setError('Please select both patient token and target doctor.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await queueApi.transferQueue({
        entryId: selectedEntryId,
        targetDoctorId
      });

      if (res.success) {
        onSuccess(res.message);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to transfer queue entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-left">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Queue Transfer</h3>
            <p className="text-xs text-slate-500">Transfer a patient token to another doctor</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Select Patient Token</label>
            <select
              value={selectedEntryId}
              onChange={(e) => setSelectedEntryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
            >
              {activeEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.tokenNumber} - {entry.patient?.name} ({entry.doctor?.user?.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Doctor / Room</label>
            <select
              value={targetDoctorId}
              onChange={(e) => setTargetDoctorId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.user.name} ({doc.department?.name} • Room {doc.roomNumber})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedEntryId || !targetDoctorId}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-200 transition-all"
          >
            {loading ? <span>Transferring...</span> : <span>Confirm Queue Transfer</span>}
          </button>

        </form>

      </div>
    </div>
  );
};
