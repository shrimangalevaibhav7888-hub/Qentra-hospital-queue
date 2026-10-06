import React from 'react';
import { Activity, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  Qentra
                </span>
                <span className="block text-[9px] font-bold tracking-widest text-indigo-400 uppercase">
                  PATIENT QUEUE MANAGEMENT
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Qentra doesn't just display the queue. It helps the hospital manage how the queue changes."
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>HIPAA Compliant Architecture</span>
            </div>
          </div>

          {/* Col 2: Product & Differentiators */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#emergency-preview" className="hover:text-white transition-colors">Emergency Impact Preview</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Dynamic Queue Recalculation</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Doctor Reassignment Engine</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Queue Transfer & Merge</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Delay-Cause Analytics</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Senior Citizen Easy View</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How Qentra Works</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Hospital Sales</a></li>
              <li><span className="text-slate-500 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>

          {/* Col 4: Hackathon / Hospital Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Healthcare SaaS Edition
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Built with zero smart-arrival or GPS assumptions. Designed for high-throughput OPD queues, clinics, and multi-specialty hospitals.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold">● System Active:</span> Real-time Socket.IO synchronization enabled across all OPD rooms.
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Qentra Patient Queue Management. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered for healthcare efficiency</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
