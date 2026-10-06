import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap
} from 'lucide-react';

export const EmergencyImpactShowcase: React.FC = () => {
  const [simulated, setSimulated] = useState(true);

  const beforeQueue = [
    { token: 'CARD-013', name: 'Sunil Rao', status: 'CALLED', pos: 1, wait: 1 },
    { token: 'CARD-014', name: 'Kavita Menon', status: 'WAITING', pos: 2, wait: 16 },
    { token: 'CARD-016', name: 'Sita Devi', status: 'WAITING', pos: 3, wait: 24 },
    { token: 'CARD-015', name: 'Ramesh Kumar', status: 'WAITING', pos: 4, wait: 32 },
    { token: 'CARD-017', name: 'Neha Patil', status: 'WAITING', pos: 5, wait: 40 }
  ];

  const afterQueue = [
    { token: 'CARD-013', name: 'Sunil Rao', status: 'CALLED', pos: 1, wait: 1, delta: 0 },
    { token: 'EMG-001', name: 'Emergency Cardiac Case', status: 'WAITING', pos: 2, wait: 0, isEmergency: true, delta: 0 },
    { token: 'CARD-014', name: 'Kavita Menon', status: 'WAITING', pos: 3, wait: 24, delta: +8 },
    { token: 'CARD-016', name: 'Sita Devi', status: 'WAITING', pos: 4, wait: 32, delta: +8 },
    { token: 'CARD-015', name: 'Ramesh Kumar', status: 'WAITING', pos: 5, wait: 40, delta: +8 },
    { token: 'CARD-017', name: 'Neha Patil', status: 'WAITING', pos: 6, wait: 48, delta: +8 }
  ];

  return (
    <section id="emergency-preview" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-widest mb-3">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>CRUCIAL DIFFERENTIATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Emergency Impact Preview
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Never silently change hospital queues. See exactly how an incoming critical patient alters waiting times for all downstream patients <span className="font-bold text-slate-800">BEFORE</span> confirmation.
          </p>
        </div>

        {/* Interactive Simulation Dashboard */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 max-w-5xl mx-auto">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Cardiology OPD Emergency Simulation</h3>
                <p className="text-xs text-slate-500">Dr. Sharma • Room 203</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSimulated(!simulated)}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${simulated ? 'rotate-180' : ''} transition-transform`} />
                <span>{simulated ? 'Show Original Queue' : 'Simulate Emergency Impact'}</span>
              </button>
            </div>
          </div>

          {/* Impact Stats Banner */}
          {simulated && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Projected Impact:</span> 4 waiting patients will be shifted by 1 slot.
                </div>
              </div>
              <div className="flex items-center space-x-4 text-xs font-bold">
                <span className="px-3 py-1 rounded-lg bg-white border border-amber-200 text-amber-800">
                  Affected: 4 Patients
                </span>
                <span className="px-3 py-1 rounded-lg bg-red-100 text-red-800">
                  Average Wait Delta: +8 min
                </span>
              </div>
            </div>
          )}

          {/* Side-by-Side BEFORE vs AFTER Comparison Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* BEFORE QUEUE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                <span>BEFORE (Current Queue)</span>
                <span className="text-slate-400 font-normal">5 patients</span>
              </div>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Token</th>
                      <th className="p-2.5">Patient</th>
                      <th className="p-2.5">Pos</th>
                      <th className="p-2.5 text-right">Wait</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {beforeQueue.map((item, idx) => (
                      <tr key={idx} className={item.token === 'CARD-015' ? 'bg-indigo-50/40 font-bold' : ''}>
                        <td className="p-2.5 font-mono text-indigo-700">{item.token}</td>
                        <td className="p-2.5 text-slate-800">{item.name}</td>
                        <td className="p-2.5 text-slate-500">#{item.pos}</td>
                        <td className="p-2.5 text-right text-slate-700">{item.wait}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AFTER QUEUE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-700 uppercase tracking-wider px-1">
                <span>AFTER (Emergency Inserted)</span>
                <span className="text-red-600 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Projected
                </span>
              </div>
              <div className="rounded-2xl border-2 border-indigo-200 overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-indigo-50 text-indigo-900 font-semibold border-b border-indigo-100">
                    <tr>
                      <th className="p-2.5">Token</th>
                      <th className="p-2.5">Patient</th>
                      <th className="p-2.5">Pos</th>
                      <th className="p-2.5 text-right">New Wait</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {afterQueue.map((item, idx) => (
                      <tr
                        key={idx}
                        className={
                          item.isEmergency
                            ? 'bg-red-50/80 font-bold border-l-4 border-red-500'
                            : item.token === 'CARD-015'
                            ? 'bg-indigo-50/40 font-bold'
                            : ''
                        }
                      >
                        <td className="p-2.5 font-mono">
                          {item.isEmergency ? (
                            <span className="text-red-700 font-bold">{item.token}</span>
                          ) : (
                            <span className="text-indigo-700">{item.token}</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-800">
                          {item.name}
                          {item.isEmergency && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-red-600 text-white font-bold">
                              PRIORITY 1
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-500">#{item.pos}</td>
                        <td className="p-2.5 text-right font-bold text-slate-800">
                          {item.wait}m
                          {item.delta > 0 && (
                            <span className="ml-1.5 text-[10px] text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded">
                              +{item.delta}m
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Action Explainer */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Receptionists review this impact before finalizing emergency insertion into the hospital database.
            </span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                Transparent Patient Communication
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
