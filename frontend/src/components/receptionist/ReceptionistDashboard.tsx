import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { adminApi, queueApi, patientApi } from '../../services/api';
import {
  Users,
  UserPlus,
  Zap,
  UserCheck,
  ArrowRightLeft,
  GitMerge,
  Search,
  Building2,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Stethoscope,
  Filter
} from 'lucide-react';
import { WalkInRegisterModal } from './WalkInRegisterModal';
import { EmergencyInsertModal } from './EmergencyInsertModal';
import { DoctorReassignModal } from './DoctorReassignModal';
import { QueueTransferModal } from './QueueTransferModal';
import { QueueMergeModal } from './QueueMergeModal';

export const ReceptionistDashboard: React.FC = () => {
  const { user } = useAuth();
  const { lastQueueUpdate, lastNotification } = useSocket();

  const [departments, setDepartments] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'WAITING' | 'IN_CONSULTATION' | 'EMERGENCY'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);

  const fetchReceptionData = async () => {
    try {
      const [deptRes, queueRes] = await Promise.all([
        adminApi.getHospitalData(),
        queueApi.getDepartments()
      ]);

      if (deptRes.success) setDepartments(deptRes.departments || []);
      if (queueRes.success) setQueues(queueRes.queues || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceptionData();
  }, [lastQueueUpdate, lastNotification]);

  // Search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await patientApi.search(searchQuery);
        if (res.success) {
          setSearchResults(res.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Flatten all active queue entries across all queues
  const allEntries = queues.flatMap((q) =>
    (q.entries || []).map((e: any) => ({
      ...e,
      departmentName: q.department?.name,
      departmentCode: q.department?.code,
      doctorName: q.doctor?.user?.name,
      roomNumber: q.doctor?.roomNumber
    }))
  );

  const filteredEntries = allEntries.filter((e) => {
    if (selectedDeptFilter !== 'ALL' && e.departmentCode !== selectedDeptFilter) {
      return false;
    }
    if (selectedStatusFilter === 'WAITING' && e.status !== 'WAITING') {
      return false;
    }
    if (selectedStatusFilter === 'IN_CONSULTATION' && e.status !== 'IN_CONSULTATION' && e.status !== 'CALLED') {
      return false;
    }
    if (selectedStatusFilter === 'EMERGENCY' && !e.isEmergency && e.priority !== 'EMERGENCY') {
      return false;
    }
    return true;
  });

  const waitingCount = allEntries.filter((e) => e.status === 'WAITING').length;
  const inConsultCount = allEntries.filter((e) => e.status === 'IN_CONSULTATION' || e.status === 'CALLED').length;
  const emergencyCount = allEntries.filter((e) => e.isEmergency || e.priority === 'EMERGENCY').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              Front Desk Reception
            </span>
            <span className="text-xs text-slate-400">• OPD Multi-Specialty</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">
            Reception & Queue Orchestration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Register walk-ins, insert emergencies with impact preview, reassign doctors, and transfer queues.
          </p>
        </div>

        <button
          onClick={fetchReceptionData}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          title="Refresh All Queues"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons Toolbar (5 Main Hospital Queue Operations) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <button
          onClick={() => setWalkInOpen(true)}
          className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Walk-in Token</span>
        </button>

        <button
          onClick={() => setEmergencyOpen(true)}
          className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          <span>+ Emergency Patient</span>
        </button>

        <button
          onClick={() => setReassignOpen(true)}
          className="p-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>Reassign Doctor</span>
        </button>

        <button
          onClick={() => setTransferOpen(true)}
          className="p-3.5 rounded-2xl bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <ArrowRightLeft className="w-4 h-4 text-violet-600" />
          <span>Transfer Queue</span>
        </button>

        <button
          onClick={() => setMergeOpen(true)}
          className="p-3.5 rounded-2xl bg-white hover:bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 col-span-2 sm:col-span-1"
        >
          <GitMerge className="w-4 h-4 text-cyan-600" />
          <span>Merge Queues</span>
        </button>

      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Waiting in Lounge</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{waitingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">In Doctor Rooms</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{inConsultCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Emergency Active</span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{emergencyCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500">Active OPD Wings</span>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">{departments.length}</div>
        </div>
      </div>

      {/* Search & Tabs Filtering Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        
        {/* Top Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Live Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient name, token number, doctor..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatusFilter === 'ALL' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Status ({allEntries.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('WAITING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatusFilter === 'WAITING' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waiting ({waitingCount})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('IN_CONSULTATION')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatusFilter === 'IN_CONSULTATION' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Rooms ({inConsultCount})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('EMERGENCY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatusFilter === 'EMERGENCY' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emergency ({emergencyCount})
            </button>
          </div>

        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">OPD Wing:</span>
          <button
            onClick={() => setSelectedDeptFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              selectedDeptFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Wings
          </button>
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDeptFilter(d.code)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                selectedDeptFilter === d.code
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.name} ({d.code})
            </button>
          ))}
        </div>

        {/* Live Search Results Dropdown */}
        {searchResults && (
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2 text-xs animate-in fade-in">
            <div className="font-bold text-indigo-950">Search Results for "{searchQuery}":</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {searchResults.queueEntries.map((e: any) => (
                <div key={e.id} className="p-2.5 bg-white rounded-xl border border-indigo-200 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-indigo-700">{e.tokenNumber}</span> - <span className="font-semibold">{e.patient?.name}</span>
                    <div className="text-[11px] text-slate-500">{e.doctorName || e.doctor?.user?.name} • Room {e.roomNumber || e.doctor?.roomNumber}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Queue Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Doctor & Room</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Est. Wait</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No active patients matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      entry.isEmergency
                        ? 'bg-red-50/70 font-bold'
                        : entry.status === 'CALLED'
                        ? 'bg-blue-50/40'
                        : entry.status === 'IN_CONSULTATION'
                        ? 'bg-emerald-50/30'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {entry.tokenNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {entry.patient?.name}
                      {entry.isEmergency && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-bold">
                          EMERGENCY
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {entry.departmentName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {entry.doctorName} (Room {entry.roomNumber})
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
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modals */}
      <WalkInRegisterModal
        isOpen={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        onSuccess={(tok, name) => {
          showToast(`Walk-in registered: Token ${tok} for ${name}`);
          fetchReceptionData();
        }}
      />

      <EmergencyInsertModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        onSuccess={(tok, name) => {
          showToast(`Emergency patient ${name} inserted successfully as Token ${tok}`);
          fetchReceptionData();
        }}
      />

      <DoctorReassignModal
        isOpen={reassignOpen}
        onClose={() => setReassignOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          fetchReceptionData();
        }}
      />

      <QueueTransferModal
        isOpen={transferOpen}
        activeEntries={allEntries.filter((e) => e.status === 'WAITING')}
        onClose={() => setTransferOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          fetchReceptionData();
        }}
      />

      <QueueMergeModal
        isOpen={mergeOpen}
        queues={queues}
        onClose={() => setMergeOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          fetchReceptionData();
        }}
      />

    </div>
  );
};
