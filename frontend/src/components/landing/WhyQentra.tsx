import React from 'react';
import {
  ShieldAlert,
  Calculator,
  UserCheck,
  GitMerge,
  PieChart,
  Accessibility,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WhyQentra: React.FC = () => {
  const { toggleSeniorEasyView } = useAuth();

  const differentiators = [
    {
      icon: ShieldAlert,
      title: 'Emergency Impact Preview',
      desc: 'See how an emergency patient affects the existing queue BEFORE confirmation. Prevents hospital operational chaos.',
      color: 'from-red-500 to-rose-600',
      badge: 'Zero Silent Shifts'
    },
    {
      icon: Calculator,
      title: 'Dynamic Queue Recalculation',
      desc: 'Automatically recalculate waiting times when queue conditions change based on actual doctor consultation duration.',
      color: 'from-blue-500 to-indigo-600',
      badge: 'Real-Time Precision'
    },
    {
      icon: UserCheck,
      title: 'Doctor Reassignment',
      desc: 'Move affected patients to an available doctor when a physician is called to the OT or delayed with zero friction.',
      color: 'from-indigo-500 to-purple-600',
      badge: 'Staff Load Balancing'
    },
    {
      icon: GitMerge,
      title: 'Queue Transfer & Merge',
      desc: 'Manage changing hospital queues without manually rebuilding them. Transfer single patients or merge entire rooms.',
      color: 'from-violet-500 to-indigo-700',
      badge: 'OPD Flexibility'
    },
    {
      icon: PieChart,
      title: 'Delay-Cause Analytics',
      desc: 'Understand exactly why patients are waiting with granular breakdowns of doctor delays, emergency influx, and no-shows.',
      color: 'from-amber-500 to-orange-600',
      badge: 'Operational Insight'
    },
    {
      icon: Accessibility,
      title: 'Senior Citizen Easy View',
      desc: 'A dedicated simplified high-contrast interface designed for elderly patients with large fonts and 1-tap help.',
      color: 'from-emerald-500 to-teal-600',
      badge: 'High Accessibility',
      action: toggleSeniorEasyView,
      actionText: 'Try Senior View'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>CORE DIFFERENTIATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Why Qentra Stands Out
          </h2>
          <p className="mt-4 text-base text-slate-600">
            "Qentra doesn't just display the queue. It helps the hospital manage how the queue changes."
          </p>
        </div>

        {/* 6 Differentiators Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {differentiators.map((diff, idx) => {
            const Icon = diff.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl p-7 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${diff.color} flex items-center justify-center text-white shadow-md shadow-slate-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {diff.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {diff.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {diff.desc}
                  </p>
                </div>

                {diff.action && (
                  <div className="pt-5 mt-4 border-t border-slate-200/60">
                    <button
                      onClick={diff.action}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>{diff.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
