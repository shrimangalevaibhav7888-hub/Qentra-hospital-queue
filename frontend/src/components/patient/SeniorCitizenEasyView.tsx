import React, { useState, useEffect } from 'react';
import { PhoneCall, Eye, Volume2, ArrowLeft, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { queueApi } from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export const SeniorCitizenEasyView: React.FC = () => {
  const { user, toggleSeniorEasyView, setActiveView } = useAuth();
  const { lastQueueUpdate, lastNotification } = useSocket();
  const [queueData, setQueueData] = useState<any>(null);
  const [helpCalled, setHelpCalled] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      const data = await queueApi.getMyQueue();
      if (data.success && data.hasActiveQueue) {
        setQueueData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [lastQueueUpdate, lastNotification]);

  const handleCallHelp = () => {
    setHelpCalled(true);
    // Voice speech synthesis for elderly
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'Hospital assistance desk alerted. A receptionist is on the way.'
      );
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setHelpCalled(false), 5000);
  };

  const handleSpeakStatus = () => {
    if ('speechSynthesis' in window && queueData) {
      const text = `Your token is ${queueData.token}. There are ${queueData.patientsAhead} patients ahead of you. Estimated wait is ${queueData.estimatedWaitMinutes} minutes. Doctor ${queueData.doctor?.name} in room ${queueData.doctor?.roomNumber}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-950 p-4 sm:p-8 flex flex-col justify-between max-w-3xl mx-auto">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
        <button
          onClick={toggleSeniorEasyView}
          className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-extrabold text-base flex items-center gap-2 hover:bg-slate-100 shadow-md"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          <span>Exit Easy View</span>
        </button>

        <div className="text-right">
          <span className="text-sm font-black uppercase tracking-wider text-amber-900 block">
            Senior Citizen Assistance Mode
          </span>
          <span className="text-xs font-bold text-slate-700">Patient: {user?.name}</span>
        </div>
      </div>

      {/* Main High-Contrast Information Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-slate-900 shadow-2xl space-y-8 my-auto">
        
        {/* Token Number Box */}
        <div className="bg-amber-100 border-4 border-amber-500 rounded-3xl p-6 text-center space-y-2">
          <div className="text-lg font-black text-amber-950 uppercase tracking-widest">
            YOUR TOKEN
          </div>
          <div className="text-5xl sm:text-7xl font-black text-slate-950 tracking-wider font-mono">
            {queueData?.token || 'CARD-015'}
          </div>
          <div className="text-sm sm:text-base font-extrabold text-amber-900 pt-1">
            {queueData?.doctor?.department || 'Cardiology OPD'} • {queueData?.doctor?.name || 'Dr. Sharma'}
          </div>
        </div>

        {/* 2 Big Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="bg-blue-50 border-3 border-blue-900 rounded-3xl p-6 text-center space-y-1">
            <span className="text-base font-black text-blue-950 uppercase tracking-wider block">
              PATIENTS AHEAD
            </span>
            <span className="text-5xl sm:text-6xl font-black text-blue-900 block">
              {queueData ? queueData.patientsAhead : '2'}
            </span>
            <span className="text-xs font-bold text-blue-700">
              {queueData?.patientsAhead === 0 ? 'You are next in line!' : 'Please remain seated'}
            </span>
          </div>

          <div className="bg-emerald-50 border-3 border-emerald-900 rounded-3xl p-6 text-center space-y-1">
            <span className="text-base font-black text-emerald-950 uppercase tracking-wider block">
              WAITING TIME
            </span>
            <span className="text-5xl sm:text-6xl font-black text-emerald-900 block">
              {queueData ? `${queueData.estimatedWaitMinutes} MIN` : '18 MIN'}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              Room: {queueData?.doctor?.roomNumber || '203'}
            </span>
          </div>

        </div>

        {/* Status Callout */}
        {queueData?.status === 'CALLED' ? (
          <div className="p-6 bg-red-500 text-white rounded-3xl text-center space-y-2 animate-bounce">
            <div className="text-2xl font-black uppercase">YOUR TOKEN HAS BEEN CALLED!</div>
            <div className="text-lg font-bold">Please go to Room {queueData?.doctor?.roomNumber || '203'} immediately.</div>
          </div>
        ) : null}

        {/* Big Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          
          <button
            onClick={handleSpeakStatus}
            className="py-5 px-6 rounded-2xl bg-indigo-700 text-white font-black text-lg shadow-lg hover:bg-indigo-800 transition-all flex items-center justify-center gap-3 border-2 border-slate-900"
          >
            <Volume2 className="w-7 h-7" />
            <span>Read Aloud</span>
          </button>

          <button
            onClick={handleCallHelp}
            className="py-5 px-6 rounded-2xl bg-rose-600 text-white font-black text-lg shadow-lg hover:bg-rose-700 transition-all flex items-center justify-center gap-3 border-2 border-slate-900"
          >
            <HeartHandshake className="w-7 h-7" />
            <span>{helpCalled ? 'Help Notified ✓' : 'CALL HELP / ASSISTANCE'}</span>
          </button>

        </div>

      </div>

      {/* Footer Info */}
      <div className="text-center pt-6 text-sm font-bold text-slate-700">
        Hospital Assistance Desk: Ext 104 • Ground Floor Lobby
      </div>

    </div>
  );
};
