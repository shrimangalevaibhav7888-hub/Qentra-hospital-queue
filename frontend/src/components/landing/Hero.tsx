import React from 'react';
import { ArrowRight, Play, Users, Clock, CheckCircle2, UserCheck, Shield, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeroProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onExploreDemo }) => {
  const { demoLogin } = useAuth();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-white via-slate-50/50 to-indigo-50/20">
      {/* Decorative gradient blur backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-indigo-200/30 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/30 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN (Headline, Description, CTAs) */}
          <div className="lg:col-span-5 space-y-7 text-left">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Next-Gen Healthcare OPD Efficiency</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-display">
              Smart Queue <br />
              Management for <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                Hospitals & Clinics
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-normal">
              Manage patient flow, reduce waiting times and deliver a better healthcare experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onGetStarted}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-300/50 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreDemo}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>View Demo</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 border-t border-slate-200/70 flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Smart-Arrival / GPS Dependency</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dynamic Recalculation</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Realistic Device Mockup containing Qentra Dashboard */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto max-w-2xl lg:max-w-none">
              
              {/* Device Frame */}
              <div className="bg-slate-900 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl ring-1 ring-slate-800/60 transition-transform duration-500 hover:scale-[1.01]">
                
                {/* Laptop Camera / Bezel Bar */}
                <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 bg-slate-800/80 rounded-t-lg">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-indigo-400" />
                    <span>qentra.app/hospital/live-queue</span>
                  </div>
                  <div className="w-8" />
                </div>

                {/* Dashboard Screen Content */}
                <div className="bg-white rounded-lg p-4 sm:p-6 text-slate-800 space-y-4">
                  
                  {/* Top Bar inside Dashboard */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Today's Queue</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 animate-pulse">
                          LIVE ●
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">Multi-Specialty OPD • Real-time Sync Active</p>
                    </div>

                    <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                      Cardiology & Orthopedics Wing
                    </div>
                  </div>

                  {/* 4 Stat Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-blue-50/70 border border-blue-100 p-2.5 rounded-xl">
                      <div className="text-[11px] font-semibold text-blue-700">Waiting Now</div>
                      <div className="text-xl font-extrabold text-blue-900 mt-0.5">12</div>
                    </div>
                    <div className="bg-amber-50/70 border border-amber-100 p-2.5 rounded-xl">
                      <div className="text-[11px] font-semibold text-amber-700">In Consultation</div>
                      <div className="text-xl font-extrabold text-amber-900 mt-0.5">3</div>
                    </div>
                    <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl">
                      <div className="text-[11px] font-semibold text-emerald-700">Completed Today</div>
                      <div className="text-xl font-extrabold text-emerald-900 mt-0.5">28</div>
                    </div>
                    <div className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl">
                      <div className="text-[11px] font-semibold text-indigo-700">Average Wait</div>
                      <div className="text-xl font-extrabold text-indigo-900 mt-0.5">28 min</div>
                    </div>
                  </div>

                  {/* Queue Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Token</th>
                          <th className="py-2.5 px-3">Patient</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Waiting Time</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {/* Row 1: CARD-015 */}
                        <tr className="bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-indigo-700 font-mono">CARD-015</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">Ramesh Kumar</td>
                          <td className="py-2.5 px-3 text-slate-600">Cardiology</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">32 min</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Waiting
                            </span>
                          </td>
                        </tr>

                        {/* Row 2: CARD-016 */}
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-800 font-mono">CARD-016</td>
                          <td className="py-2.5 px-3">Sita Devi</td>
                          <td className="py-2.5 px-3 text-slate-600">Cardiology</td>
                          <td className="py-2.5 px-3">18 min</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Waiting
                            </span>
                          </td>
                        </tr>

                        {/* Row 3: ORT-008 */}
                        <tr className="hover:bg-slate-50 transition-colors bg-blue-50/20">
                          <td className="py-2.5 px-3 font-bold text-blue-700 font-mono">ORT-008</td>
                          <td className="py-2.5 px-3">Aman Singh</td>
                          <td className="py-2.5 px-3 text-slate-600">Orthopedics</td>
                          <td className="py-2.5 px-3">12 min</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 animate-pulse">
                              Called
                            </span>
                          </td>
                        </tr>

                        {/* Row 4: ENT-006 */}
                        <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/20">
                          <td className="py-2.5 px-3 font-bold text-emerald-700 font-mono">ENT-006</td>
                          <td className="py-2.5 px-3">Priya Mehta</td>
                          <td className="py-2.5 px-3 text-slate-600">ENT</td>
                          <td className="py-2.5 px-3 text-slate-400">-</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              In Consultation
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Bottom Action Hint */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Automatic queue recalibration on doctor delay or emergency arrival
                    </span>
                    <button
                      onClick={() => demoLogin('PATIENT')}
                      className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      Track Live <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
