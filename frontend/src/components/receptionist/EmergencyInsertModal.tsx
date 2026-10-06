import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Zap, AlertTriangle, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { adminApi, queueApi } from '../../services/api';
import type { Department, Doctor, EmergencyImpactPreviewData } from '../../types';

interface EmergencyInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tokenNumber: string, patientName: string) => void;
}

export const EmergencyInsertModal: React.FC<EmergencyInsertModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('48');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('9876500999');
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [reason, setReason] = useState('Acute Cardiac Chest Pain / Severe Trauma');

  const [preview, setPreview] = useState<EmergencyImpactPreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [insertLoading, setInsertLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  const loadDepartments = async () => {
    try {
      const res = await adminApi.getHospitalData();
      if (res.success) {
        setDepartments(res.departments);
        setDoctors(res.doctors);
        if (res.departments.length > 0) {
          setDepartmentId(res.departments[0].id);
        }
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) => !departmentId || d.departmentId === departmentId
  );

  useEffect(() => {
    if (filteredDoctors.length > 0) {
      setDoctorId(filteredDoctors[0].id);
    } else {
      setDoctorId('');
    }
  }, [departmentId, doctors]);

  // Fetch Emergency Impact Preview whenever department / doctor changes
  useEffect(() => {
    if (departmentId) {
      fetchPreview();
    }
  }, [departmentId, doctorId]);

  const fetchPreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await queueApi.getEmergencyPreview(departmentId, doctorId || undefined);
      if (res.success) {
        setPreview(res.preview);
      }
    } catch (e: any) {
      console.warn('Error fetching preview:', e);
    } finally {
      setPreviewLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleConfirmEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !departmentId) {
      setError('Please provide patient name and department.');
      return;
    }

    setError(null);
    setInsertLoading(true);

    try {
      const res = await queueApi.insertEmergency({
        patientName,
        age: parseInt(age),
        gender,
        phone,
        departmentId,
        doctorId,
        reason
      });

      if (res.success) {
        onSuccess(res.tokenNumber, patientName);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to insert emergency patient');
    } finally {
      setInsertLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-red-200 relative max-h-[92vh] overflow-y-auto text-left">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-900 font-display">Emergency Patient Insertion</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white">
                IMPACT PREVIEW REQUIRED
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Qentra transparently calculates queue impact before committing emergency arrival.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleConfirmEmergency} className="space-y-5">
          
          {/* Patient Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Patient Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Critical Trauma Patient"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Doctor</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 bg-white"
              >
                {filteredDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user.name} (Room {doc.roomNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Clinical Emergency Reason</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Severe cardiac arrest, respiratory distress"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Differentiator: REAL EMERGENCY IMPACT PREVIEW */}
          <div className="bg-red-50/50 border-2 border-red-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-red-950 uppercase tracking-wider">
                  Emergency Impact Preview (Live Calculation)
                </span>
              </div>
              <div className="text-xs font-bold text-red-700">
                {preview ? `${preview.totalAffectedCount} patients affected • +${preview.averageWaitIncreaseMin} min wait` : 'Calculating...'}
              </div>
            </div>

            {/* Before vs After Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* BEFORE */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">BEFORE INSERTION</span>
                <div className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-1 max-h-40 overflow-y-auto text-xs">
                  {preview?.beforeQueue?.length === 0 ? (
                    <p className="text-slate-400 italic">Queue is currently empty</p>
                  ) : (
                    preview?.beforeQueue.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                        <span className="font-mono font-bold text-indigo-700">{item.tokenNumber}</span>
                        <span className="text-slate-700">{item.patientName}</span>
                        <span className="text-slate-500">{item.waitMin}m</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* AFTER */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-red-700 uppercase">AFTER INSERTION</span>
                <div className="bg-white rounded-xl border-2 border-red-300 p-2.5 space-y-1 max-h-40 overflow-y-auto text-xs">
                  {preview?.afterQueue.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between py-1 border-b border-slate-100 last:border-0 ${
                        item.isEmergency ? 'bg-red-100 px-1.5 rounded font-bold text-red-900' : ''
                      }`}
                    >
                      <span className="font-mono">{item.tokenNumber}</span>
                      <span className="truncate max-w-[100px]">{item.patientName}</span>
                      <span className="font-bold">{item.waitMin}m</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={insertLoading}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-200 transition-all flex items-center gap-2"
            >
              {insertLoading ? <span>Processing Emergency...</span> : <span>Confirm Emergency Insertion</span>}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
