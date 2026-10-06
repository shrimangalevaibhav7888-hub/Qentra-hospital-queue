import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { queueApi } from '../../services/api';
import { Activity, ArrowLeft, Volume2, Clock, Users, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { PublicDisplayData } from '../../types';

export const PublicQueueDisplay: React.FC = () => {
  const { setActiveView } = useAuth();
  const { lastQueueUpdate, socket } = useSocket();
  const [displayData, setDisplayData] = useState<PublicDisplayData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [lastAnnouncedToken, setLastAnnouncedToken] = useState<string | null>(null);

  const fetchDisplayData = async () => {
    try {
      const res = await queueApi.getPublicDisplay();
      if (res.success) {
        setDisplayData(res.displayData || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDisplayData();
  }, [lastQueueUpdate]);

  // Live clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Listen for real-time announcements
  useEffect(() => {
    if (!socket) return;
    socket.on('public_display_sync', (data) => {
      if (data.action === 'CALL_PATIENT' && data.tokenNumber) {
        setLastAnnouncedToken(data.tokenNumber);
        // Announce via Web Speech API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            `Token number ${data.tokenNumber.replace('-', ' ')}, please proceed to Room ${data.roomNumber}, ${data.department}`
          );
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      }
      fetchDisplayData();
    });
  }, [socket]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex flex-col justify-between select-none">
      
      {/* Top Header for Hospital Waiting Room Display */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-800 pb-5 mb-8 gap-4">
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('landing')}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Public Kiosk Screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white flex items-center gap-2">
                <span>QENTRA</span>
                <span className="text-indigo-400 font-light">•</span>
                <span className="text-indigo-400 text-lg sm:text-2xl font-bold">LIVE QUEUE</span>
              </h1>
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase block">
                MAIN OPD WAITING LOUNGE DISPLAY
              </span>
            </div>
          </div>
        </div>

        {/* Live Clock and Status Indicator */}
        <div className="flex items-center space-x-6 text-right">
          <div className="hidden sm:block">
            <div className="flex items-center justify-end gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE BROADCAST</span>
            </div>
            <div className="text-2xl font-black font-mono text-white mt-0.5">
              {currentTime}
            </div>
          </div>
        </div>

      </div>

      {/* Grid of Department Doctor Consultation Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-auto">
        {displayData.map((dept) =>
          dept.doctors.map((doc) => (
            <div
              key={doc.doctorId}
              className={`rounded-3xl p-6 sm:p-8 border-2 transition-all flex flex-col justify-between ${
                doc.nowServing !== '---'
                  ? 'bg-slate-900/90 border-indigo-500/60 shadow-2xl shadow-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
              }`}
            >
              
              {/* Department & Room Tag */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block">
                    {dept.departmentName}
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {doc.doctorName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-extrabold text-xs">
                    ROOM {doc.roomNumber}
                  </span>
                </div>
              </div>

              {/* Huge Now Serving Box */}
              <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 text-center space-y-1 my-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                  NOW SERVING
                </span>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-emerald-400 py-1">
                  {doc.nowServing}
                </div>
                <div className="text-xs font-semibold text-slate-300 truncate">
                  {doc.nowServingPatient !== '---' ? doc.nowServingPatient : 'Ready for next patient'}
                </div>
              </div>

              {/* Next In Line Tokens */}
              <div className="pt-4 border-t border-slate-800 mt-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>NEXT IN LINE</span>
                  <span>{doc.waitingCount} Waiting</span>
                </div>

                <div className="flex items-center space-x-2">
                  {doc.nextInLine.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No upcoming patients</span>
                  ) : (
                    doc.nextInLine.slice(0, 3).map((nxt, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-slate-800/80 rounded-xl p-2 text-center border border-slate-700/60 font-mono"
                      >
                        <span className="text-xs font-bold text-indigo-200 block">
                          {nxt.tokenNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {nxt.estimatedWait}m
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Footer Ticker */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Automated bilingual room announcements enabled for summoned tokens.</span>
        </span>
        <span className="text-slate-400 font-mono">
          Powered by Qentra Healthcare Dynamic Engine
        </span>
      </div>

    </div>
  );
};
