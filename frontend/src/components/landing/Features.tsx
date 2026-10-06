import React from 'react';
import {
  Calendar,
  UserPlus,
  Ticket,
  Activity,
  Clock,
  Timer,
  AlertTriangle,
  RefreshCw,
  Zap,
  Eye,
  UserCheck,
  ArrowRightLeft,
  GitMerge,
  Bell,
  Monitor,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  PieChart,
  UserX,
  FileText,
  Building2,
  Accessibility,
  Lock
} from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Calendar,
      title: 'Online Appointment Booking',
      desc: 'Patients select departments, verified doctors, and preferred slots from home in seconds.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: UserPlus,
      title: 'Walk-in Registration',
      desc: 'Reception staff seamlessly registers on-spot patients and generates digital queue tokens.',
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      icon: Ticket,
      title: 'Digital Token Generation',
      desc: 'Sequential department-coded tokens (e.g. CARD-015, ORT-008) eliminate physical paper slips.',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: Activity,
      title: 'Real-time Queue Position',
      desc: 'Live bi-directional tracking showing exact queue standing and number of patients ahead.',
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      icon: Clock,
      title: 'Estimated Waiting Time',
      desc: 'Dynamic formula based on real completed consultation metrics, not static guesswork.',
      color: 'text-amber-600 bg-amber-50'
    },
    {
      icon: Timer,
      title: 'Expected Consultation Time',
      desc: 'Precise clock time projection updated instantly whenever queue dynamics shift.',
      color: 'text-sky-600 bg-sky-50'
    },
    {
      icon: AlertTriangle,
      title: 'Doctor Delay Management',
      desc: 'Doctors log delays with one click, triggering automated notifications and schedule shifts.',
      color: 'text-rose-600 bg-rose-50'
    },
    {
      icon: RefreshCw,
      title: 'Automatic Queue Updates',
      desc: 'Instant socket synchronization across patient phones, doctor desks, and waiting area displays.',
      color: 'text-teal-600 bg-teal-50'
    },
    {
      icon: Zap,
      title: 'Emergency Patient Insertion',
      desc: 'Critical trauma and cardiac cases can be immediately prioritized with full audit compliance.',
      color: 'text-red-600 bg-red-50'
    },
    {
      icon: Eye,
      title: 'Emergency Impact Preview',
      desc: 'Preview exactly how many patients are delayed and by how many minutes BEFORE inserting an emergency.',
      color: 'text-indigo-600 bg-indigo-50',
      badge: 'Differentiator'
    },
    {
      icon: UserCheck,
      title: 'Doctor Reassignment',
      desc: 'Seamlessly transfer affected patient queues when a doctor is called away or unavailable.',
      color: 'text-blue-600 bg-blue-50',
      badge: 'Differentiator'
    },
    {
      icon: ArrowRightLeft,
      title: 'Queue Transfer',
      desc: 'Move individual patients across OPD departments and consultation rooms with zero loss of order.',
      color: 'text-violet-600 bg-violet-50'
    },
    {
      icon: GitMerge,
      title: 'Queue Merge',
      desc: 'Merge multi-room queues dynamically during shift handovers with strict duplicate prevention.',
      color: 'text-cyan-600 bg-cyan-50'
    },
    {
      icon: Bell,
      title: 'Patient Notifications',
      desc: 'Proactive alerts for turn approaching, doctor delays, reassignment, and consultation start.',
      color: 'text-amber-600 bg-amber-50'
    },
    {
      icon: Monitor,
      title: 'Public Queue Display',
      desc: 'High-contrast TV kiosk display showing current serving tokens and upcoming patients per room.',
      color: 'text-slate-700 bg-slate-100'
    },
    {
      icon: ShieldCheck,
      title: 'Role-based Access (RBAC)',
      desc: 'Tailored views and strict permission barriers for Patients, Doctors, Receptionists, and Admins.',
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      desc: 'Executive dashboard tracking wait times, patient throughput, and hospital department efficiency.',
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      icon: TrendingUp,
      title: 'Peak Hour Analysis',
      desc: 'Hourly patient volume breakdown helping hospitals optimize staff allocation across peak windows.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: PieChart,
      title: 'Delay Cause Analytics',
      desc: 'Categorized breakdown of wait times by Doctor Delays, Emergencies, No-shows, and Influx.',
      color: 'text-rose-600 bg-rose-50',
      badge: 'Differentiator'
    },
    {
      icon: UserX,
      title: 'No-show & Cancellation Analytics',
      desc: 'Track unfulfilled tokens and missed appointments to minimize dead doctor consultation time.',
      color: 'text-amber-600 bg-amber-50'
    },
    {
      icon: FileText,
      title: 'Audit Logs',
      desc: 'Comprehensive timestamped audit trails of every registration, call, transfer, and delay.',
      color: 'text-slate-600 bg-slate-100'
    },
    {
      icon: Building2,
      title: 'Multi-department Support',
      desc: 'Simultaneous queue orchestration across Cardiology, Orthopedics, Medicine, ENT, and more.',
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      icon: Accessibility,
      title: 'Senior Citizen Easy View',
      desc: 'High-contrast, extra-large typography mode with one-click emergency help assistance.',
      color: 'text-amber-600 bg-amber-50',
      badge: 'Accessible'
    },
    {
      icon: Lock,
      title: 'Data Security & Access Control',
      desc: 'Encrypted patient identifiers, JWT authorization, and strict compliance-ready safeguards.',
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-widest mb-3">
            <span>ENTERPRISE HOSPITAL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Built for Real-World Hospital Realities
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Every feature in Qentra is engineered to manage unpredictable OPD delays, emergency influxes, and dynamic patient traffic.
          </p>
        </div>

        {/* 24 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featureList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group p-5 rounded-2xl bg-[#FAFAFC] hover:bg-white border border-slate-200/70 hover:border-indigo-200 shadow-xs hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feat.color} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {feat.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700">
                        {feat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
