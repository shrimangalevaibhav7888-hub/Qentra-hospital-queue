import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Qentra?',
      a: 'Qentra is a realistic hospital and clinic patient queue management system designed to eliminate waiting room congestion. It enables online and walk-in registration, generates digital tokens, synchronizes real-time queue positions, and provides administrative tools for doctor delays and emergencies.'
    },
    {
      q: 'How does the digital token work?',
      a: 'When an appointment is booked or a walk-in is registered, a unique sequential token (such as CARD-015 for Cardiology) is issued. The patient can monitor their position (#4) and estimated wait time (32 min) on their device in real time.'
    },
    {
      q: 'Can walk-in patients use Qentra?',
      a: 'Yes! Reception staff register walk-in patients directly into the system, generating an instant digital token. Walk-ins are seamlessly interleaved with pre-booked appointments according to hospital priority rules.'
    },
    {
      q: 'Can patients track their queue?',
      a: 'Patients can open their digital live queue view from home or the waiting lobby. The display updates automatically via Socket.IO whenever previous patients complete consultations, without needing manual page refreshes.'
    },
    {
      q: 'What happens if a doctor is delayed?',
      a: 'A doctor or administrator can log a delay (e.g. 15 minutes) with one click. Qentra instantly recalculates all downstream wait times and broadcasts notification alerts to affected patients.'
    },
    {
      q: 'How are emergency patients handled?',
      a: 'Emergency patients can be inserted at the top of the consultation queue. Before confirmation, staff are shown the "Emergency Impact Preview" detailing exactly how many patients are shifted and the average wait time delta.'
    },
    {
      q: 'Can doctors be reassigned?',
      a: 'Yes. If a doctor is called into surgery or becomes unavailable, staff can reassign their active queue to another available doctor in the same department. Transferred patients are automatically notified of their new room number.'
    },
    {
      q: 'Can queues be merged?',
      a: 'Yes. Administrators can merge two active queues (for example, combining two OPD rooms during an evening shift) with automatic duplicate token prevention and sequential recalculation.'
    },
    {
      q: 'Does Qentra support senior citizens?',
      a: 'Yes! Qentra includes a dedicated "Senior Citizen Easy View" featuring extra-large typography, high contrast, minimal buttons, and one-tap help assistance designed specifically for elderly users.'
    },
    {
      q: 'Is patient data protected?',
      a: 'Absolutely. Qentra uses role-based access control (RBAC), JWT authentication, encrypted identifiers, and does not track unnecessary personal data or GPS locations.'
    }
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>COMMON QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Everything you need to know about how Qentra manages hospital OPD queues.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
