import React, { useState, useEffect } from 'react';
import { X, GitMerge, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { queueApi } from '../../services/api';
import type { Queue } from '../../types';

interface QueueMergeModalProps {
  isOpen: boolean;
  queues: Queue[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const QueueMergeModal: React.FC<QueueMergeModalProps> = ({
  isOpen,
  queues,
  onClose,
  onSuccess
}) => {
  const [sourceQueueIdA, setSourceQueueIdA] = useState('');
  const [sourceQueueIdB, setSourceQueueIdB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && queues.length >= 2) {
      setSourceQueueIdA(queues[0].id);
      setSourceQueueIdB(queues[1].id);
    }
  }, [isOpen, queues]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceQueueIdA || !sourceQueueIdB) {
      setError('Please select two distinct queues to merge.');
      return;
    }
    if (sourceQueueIdA === sourceQueueIdB) {
      setError('Cannot merge a queue with itself.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await queueApi.mergeQueues({
        sourceQueueIdA,
        sourceQueueIdB
      });

      if (res.success) {
        onSuccess(res.message);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to merge queues');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Merge OPD Queues</h3>
            <p className="text-xs text-slate-500">Combine two doctor queues safely during shifts</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                Primary Queue (Target)
              </label>
              <select
                value={sourceQueueIdA}
                onChange={(e) => setSourceQueueIdA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                {queues.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.entries?.length || 0} pts)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                Queue to Merge (Source)
              </label>
              <select
                value={sourceQueueIdB}
                onChange={(e) => setSourceQueueIdB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
              >
                {queues
                  .filter((q) => q.id !== sourceQueueIdA)
                  .map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.name} ({q.entries?.length || 0} pts)
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Patients from both queues will be unified chronologically. Sequential positions and dynamic wait times will be recalculated automatically with zero duplicate tokens.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !sourceQueueIdA || !sourceQueueIdB}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-200 transition-all"
          >
            {loading ? <span>Merging Queues...</span> : <span>Confirm & Merge Queues</span>}
          </button>

        </form>

      </div>
    </div>
  );
};
