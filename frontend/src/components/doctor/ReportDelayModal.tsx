import React, { useState } from 'react';
import { X, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { queueApi } from '../../services/api';

interface ReportDelayModalProps {
  isOpen: boolean;
  doctorId?: string;
  doctorName?: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ReportDelayModal: React.FC<ReportDelayModalProps> = ({
  isOpen,
  doctorId,
  doctorName,
  onClose,
  onSuccess
}) => {
  const [delayMinutes, setDelayMinutes] = useState<number>(15);
  const [reason, setReason] = useState<string>('Emergency Ward Rounds');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetReasons = [
    'Emergency Ward Rounds',
    'Complex Procedure Extension',
    'Emergency Trauma Arrival',
    'Inter-department Consultation',
    'Shift Handover Delay'
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await queueApi.reportDelay({
        doctorId,
        delayMinutes,
        reason
      });

      if (res.success) {
        onSuccess(`Reported ${delayMinutes} min delay. All waiting patients recalculated.`);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to report delay');
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
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Report Doctor Delay</h3>
            <p className="text-xs text-slate-500">Recalculate affected patients transparently</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Minutes Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Delay Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDelayMinutes(mins)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    delayMinutes === mins
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +{mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Delay Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white mb-2"
            >
              {presetReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Info Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              All downstream patients waiting in your OPD queue will be automatically shifted and notified via real-time alerts.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <span>Applying Recalculation...</span> : <span>Confirm & Broadcast Delay</span>}
          </button>

        </form>

      </div>
    </div>
  );
};
