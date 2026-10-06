import React, { useState, useEffect } from 'react';
import { X, UserPlus, Building2, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminApi, patientApi } from '../../services/api';
import type { Department, Doctor, Priority } from '../../types';

interface WalkInRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tokenNumber: string, patientName: string) => void;
}

export const WalkInRegisterModal: React.FC<WalkInRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('35');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [priority, setPriority] = useState<Priority>('NORMAL');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHospitalData();
    }
  }, [isOpen]);

  const loadHospitalData = async () => {
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !departmentId || !doctorId) {
      setError('Please fill in patient name, department, and doctor.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await patientApi.registerWalkIn({
        name,
        age: parseInt(age),
        gender,
        phone: phone || '9876543210',
        departmentId,
        doctorId,
        priority,
        notes: notes || 'Walk-in Registration'
      });

      if (res.success) {
        onSuccess(res.tokenNumber, name);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register walk-in patient');
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
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Walk-in Patient Registration</h3>
            <p className="text-xs text-slate-500">Generate on-spot digital OPD queue token</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="NORMAL">Normal</option>
                <option value="SENIOR">Senior Citizen</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
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
            <label className="text-xs font-semibold text-slate-700 block mb-1">Chief Complaint / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Chest discomfort, hypertension follow-up"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !doctorId}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <span>Generating Token...</span> : <span>Generate Walk-in Token</span>}
          </button>

        </form>

      </div>
    </div>
  );
};
