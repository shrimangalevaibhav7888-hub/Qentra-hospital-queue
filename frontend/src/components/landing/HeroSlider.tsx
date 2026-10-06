import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Ticket,
  Activity,
  Bell,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Building2,
  Stethoscope,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { demoLogin } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: '01',
      title: 'Book Appointment from Home',
      shortTitle: 'Book Appointment from Home',
      description: 'Choose your department, doctor and preferred time in just a few clicks.',
      badge: 'Zero Waiting at Desk',
      component: 'BookVisual'
    },
    {
      id: '02',
      title: 'Get Your Digital Token',
      shortTitle: 'Get Your Digital Token',
      description: 'Receive your queue token instantly after booking or walk-in registration.',
      badge: 'Instant Digital Pass',
      component: 'TokenVisual'
    },
    {
      id: '03',
      title: 'Track Your Live Queue',
      shortTitle: 'Track Your Live Queue',
      description: 'See your queue position, patients ahead and estimated waiting time in real time.',
      badge: 'Live Dynamic Engine',
      component: 'TrackVisual'
    },
    {
      id: '04',
      title: 'Receive Queue Updates',
      shortTitle: 'Receive Queue Updates',
      description: 'Receive updates when the queue changes, your doctor is delayed or your turn is near.',
      badge: 'Proactive Alerts',
      component: 'NotificationVisual'
    },
    {
      id: '05',
      title: 'Get Called for Consultation',
      shortTitle: 'Get Called for Consultation',
      description: 'Know exactly when your token is called and where to go for your consultation.',
      badge: 'Direct Room Navigation',
      component: 'ConsultationVisual'
    }
  ];

  // Auto-play interval (5.5s)
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setIsPaused(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setIsPaused(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleSelect = (index: number) => {
    setIsPaused(true);
    setCurrentSlide(index);
  };

  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-28 bg-gradient-to-b from-indigo-50/20 via-white to-slate-50 relative overflow-hidden border-y border-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background soft ambient orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-100/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>SEAMLESS EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Five steps.{' '}
            <span className="font-normal italic text-indigo-600 font-serif">
              Zero confusion.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-600">
            A frictionless digital queue experience from the comfort of home straight into the doctor's consultation room.
          </p>
        </div>

        {/* 2-COLUMN HERO SLIDER LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/60 border border-slate-100">
          
          {/* LEFT COLUMN: Large Changing Digital Product Visual (~55%) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[460px] relative">
            
            {/* Visual Container with Smooth Fade & Motion Transition */}
            <div className="w-full flex justify-center items-center">
              
              {/* SLIDE 01: Book Appointment from Home */}
              {currentSlide === 0 && (
                <div className="w-full max-w-lg transition-all duration-500 transform animate-in fade-in slide-in-from-left-4">
                  {/* Laptop / Tablet Frame */}
                  <div className="bg-slate-900 rounded-2xl p-3 shadow-2xl border border-slate-800">
                    <div className="bg-slate-800 rounded-t-lg px-3 py-1.5 flex items-center justify-between">
                      <div className="flex space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">qentra.app/book-appointment</span>
                      <div className="w-6" />
                    </div>

                    <div className="bg-white rounded-b-lg p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Book an Appointment</h4>
                            <p className="text-[11px] text-slate-500">Book online without standing in queue</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Online OPD
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Department</span>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Cardiology</span>
                          </div>
                        </div>

                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Doctor</span>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                            <span>Dr. Sharma</span>
                          </div>
                        </div>

                        <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Date</span>
                          <div className="font-bold text-slate-900">Today, 12 Dec</div>
                        </div>

                        <div className="space-y-1 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-200">
                          <span className="text-[10px] text-indigo-700 font-semibold uppercase">Preferred Time</span>
                          <div className="font-bold text-indigo-950 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            <span>4:15 PM</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => demoLogin('PATIENT')}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <span>Confirm Appointment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 02: Get Your Digital Token */}
              {currentSlide === 1 && (
                <div className="w-full max-w-sm transition-all duration-500 transform animate-in fade-in slide-in-from-left-4">
                  {/* Smartphone Frame */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-3.5 shadow-2xl border-4 border-slate-800">
                    <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                    
                    <div className="bg-gradient-to-b from-slate-50 to-white rounded-[2rem] p-5 space-y-4 border border-slate-100">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Appointment Confirmed ✓</h4>
                        <p className="text-[11px] text-slate-500">Your digital token is generated</p>
                      </div>

                      {/* Token Card */}
                      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white text-center shadow-lg shadow-indigo-200 space-y-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-200">
                          YOUR TOKEN
                        </span>
                        <div className="text-3xl font-extrabold tracking-wider font-mono py-1">
                          CARD-015
                        </div>
                        <div className="pt-2 border-t border-indigo-400/40 text-xs flex justify-between items-center text-indigo-100">
                          <span>Cardiology</span>
                          <span className="font-semibold">Dr. Sharma</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 text-xs flex justify-between items-center text-slate-700">
                        <span className="text-slate-500">Appointment Slot</span>
                        <span className="font-bold text-slate-900">4:15 PM</span>
                      </div>

                      <button
                        onClick={() => demoLogin('PATIENT')}
                        className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        View Live Queue →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 03: Track Your Live Queue (MOST IMPORTANT HERO SLIDE) */}
              {currentSlide === 2 && (
                <div className="w-full max-w-sm transition-all duration-500 transform animate-in fade-in slide-in-from-left-4">
                  {/* Smartphone Frame */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-3.5 shadow-2xl border-4 border-slate-800 ring-4 ring-indigo-500/20">
                    <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                    
                    <div className="bg-white rounded-[2rem] p-5 space-y-3.5 border border-slate-100">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center space-x-1.5">
                          <Activity className="w-4 h-4 text-indigo-600 animate-spin" />
                          <span className="text-xs font-bold text-slate-900">MY QUEUE</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold animate-pulse">
                          LIVE ●
                        </span>
                      </div>

                      {/* Prominent Live Token Display */}
                      <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-4 text-center space-y-1">
                        <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">YOUR TOKEN</div>
                        <div className="text-3xl font-extrabold text-indigo-950 font-mono tracking-tight">CARD-015</div>
                      </div>

                      {/* Position and Patients Ahead */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">POSITION</span>
                          <div className="text-2xl font-black text-indigo-700 mt-0.5">4</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-center">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">AHEAD</span>
                          <div className="text-xs font-bold text-slate-800 mt-1.5">3 PATIENTS AHEAD</div>
                        </div>
                      </div>

                      {/* Wait time and Doctor Room */}
                      <div className="space-y-1.5 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-indigo-100">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Estimated Wait</span>
                          <span className="font-extrabold text-indigo-900">32 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Expected Consultation</span>
                          <span className="font-semibold text-slate-900">4:15 PM</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-indigo-200/60">
                          <span className="text-slate-600">Doctor & Room</span>
                          <span className="font-bold text-indigo-800">Dr. Sharma • Room 203</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 04: Receive Queue Updates */}
              {currentSlide === 3 && (
                <div className="w-full max-w-sm transition-all duration-500 transform animate-in fade-in slide-in-from-left-4">
                  {/* Smartphone Frame */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-3.5 shadow-2xl border-4 border-slate-800">
                    <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                    
                    <div className="bg-slate-50 rounded-[2rem] p-4 space-y-3 border border-slate-200/70">
                      
                      <div className="flex items-center justify-between pb-1 px-1">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-indigo-600" />
                          Notifications
                        </span>
                        <span className="text-[10px] text-slate-400">Live feed</span>
                      </div>

                      {/* Notification 1: Queue Updated */}
                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-700">Queue Updated</span>
                          <span className="text-[9px] text-slate-400">Just now</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800">Your position changed: 4 → 2</p>
                      </div>

                      {/* Notification 2: Doctor Delay */}
                      <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-700">Doctor Delay</span>
                          <span className="text-[9px] text-slate-400">2m ago</span>
                        </div>
                        <p className="text-xs text-slate-700">Dr. Sharma reported a 15-minute delay</p>
                      </div>

                      {/* Notification 3: Your Turn Is Near */}
                      <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700">Your Turn Is Near</span>
                          <span className="text-[9px] text-slate-400">5m ago</span>
                        </div>
                        <p className="text-xs text-slate-700">2 patients are ahead of you</p>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 05: Get Called for Consultation */}
              {currentSlide === 4 && (
                <div className="w-full max-w-sm transition-all duration-500 transform animate-in fade-in slide-in-from-left-4">
                  {/* Smartphone Frame */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-3.5 shadow-2xl border-4 border-slate-800">
                    <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                    
                    <div className="bg-gradient-to-b from-blue-600 via-indigo-700 to-indigo-900 text-white rounded-[2rem] p-6 text-center space-y-4 shadow-xl">
                      
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase">
                        NOW SERVING
                      </div>

                      <div className="text-4xl font-black tracking-wider font-mono py-1">
                        CARD-015
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-1.5 border border-white/10">
                        <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">PLEASE PROCEED TO</div>
                        <div className="text-2xl font-extrabold text-white">ROOM 203</div>
                        <div className="text-xs text-indigo-100 font-medium pt-1">
                          Dr. Sharma • Cardiology Wing
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/40 py-2 rounded-xl border border-emerald-500/30">
                        <CheckCircle className="w-4 h-4" />
                        <span>✓ Consultation Started</span>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT COLUMN: Numbered Feature List (~45%) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-2">
              {slides.map((slide, index) => {
                const isActive = currentSlide === index;
                return (
                  <div
                    key={slide.id}
                    onClick={() => handleSelect(index)}
                    className={`cursor-pointer rounded-2xl transition-all duration-300 p-4 border ${
                      isActive
                        ? 'bg-indigo-50/80 border-indigo-200 shadow-sm translate-x-1'
                        : 'bg-transparent border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Number */}
                      <span
                        className={`text-lg font-black font-mono transition-colors ${
                          isActive ? 'text-indigo-600' : 'text-slate-300'
                        }`}
                      >
                        {slide.id}
                      </span>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-base font-bold transition-colors ${
                              isActive ? 'text-slate-900 font-display' : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {slide.title}
                          </h3>
                        </div>

                        {/* Description only shown for ACTIVE slide */}
                        {isActive && (
                          <p className="text-xs text-slate-600 leading-relaxed pt-1 animate-in fade-in duration-300">
                            {slide.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls & Progress */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              
              {/* Progress Indicator: 01 ● ━ ━ ━ ━ */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold font-mono text-indigo-700">
                  {slides[currentSlide].id}
                </span>
                <div className="flex items-center space-x-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors shadow-xs"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white transition-colors shadow-xs shadow-indigo-200"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
