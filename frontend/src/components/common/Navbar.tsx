import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  User as UserIcon,
  LogOut,
  Bell,
  Eye,
  Sparkles,
  ChevronDown,
  Monitor,
  Menu,
  X,
  Stethoscope,
  ClipboardList,
  BarChart3,
  Home,
  Users
} from 'lucide-react';
import type { Role } from '../../types';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenNotifications,
  unreadNotificationsCount = 0
}) => {
  const { user, isAuthenticated, logout, demoLogin, isSeniorEasyView, toggleSeniorEasyView, activeView, setActiveView } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDemoSelect = async (role: Role) => {
    setShowDemoMenu(false);
    setMobileMenuOpen(false);
    await demoLogin(role);
  };

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    if (target === 'public-display') {
      setActiveView('public-display');
      return;
    }

    if (['landing', 'patient', 'doctor', 'receptionist', 'admin'].includes(target)) {
      setActiveView(target);
      return;
    }

    const sectionId = target.replace('#', '');
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Main portal views / primary tabs
  const portalTabs = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'patient', label: 'Patient Portal', icon: Users },
    { id: 'doctor', label: 'Doctor OPD', icon: Stethoscope },
    { id: 'receptionist', label: 'Reception Desk', icon: ClipboardList },
    { id: 'admin', label: 'Hospital Admin', icon: BarChart3 },
    { id: 'public-display', label: 'Public Display', icon: Monitor, isKiosk: true },
  ];

  // Landing page section links
  const landingSectionLinks = [
    { label: 'Features', target: 'features' },
    { label: 'How It Works', target: 'how-it-works' },
    { label: 'Emergency Preview', target: 'emergency-preview' },
    { label: 'FAQ', target: 'faq' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Qentra Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none group"
            onClick={() => setActiveView('landing')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-1.5">
                Qentra
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-indigo-700 uppercase -mt-1">
                PATIENT QUEUE MANAGEMENT
              </span>
            </div>
          </div>

          {/* CENTER: Main Portal Tabs */}
          <div className="hidden xl:flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70">
            {portalTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* If on medium screens (lg without xl), show compact links */}
          <div className="hidden lg:flex xl:hidden items-center space-x-4">
            {portalTabs.slice(0, 4).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`text-xs font-bold transition-colors flex items-center gap-1 py-1.5 px-2.5 rounded-lg ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Senior Citizen Easy View Toggle */}
            <button
              onClick={() => {
                toggleSeniorEasyView();
                if (activeView === 'landing' || !isAuthenticated) {
                  demoLogin('PATIENT');
                }
              }}
              title="Toggle Senior Citizen High-Contrast Accessible View"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isSeniorEasyView
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Senior View {isSeniorEasyView ? '● ON' : ''}</span>
            </button>

            {/* Quick Demo Switcher Dropdown (1-Click Role Switcher) */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant Demo Login
                  </div>
                  <button
                    onClick={() => handleDemoSelect('PATIENT')}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span className="font-semibold">🧑‍💼 Patient (Ramesh)</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold">CARD-016</span>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('DOCTOR')}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span className="font-semibold">🩺 Doctor (Dr. Sharma)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">Room 203</span>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('RECEPTIONIST')}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span className="font-semibold">📋 Receptionist Desk</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">Front Desk</span>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('ADMIN')}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span className="font-semibold">📊 Hospital Admin</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono font-bold">Analytics</span>
                  </button>
                </div>
              )}
            </div>

            {/* If Authenticated */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                
                {/* Notifications Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* User Info & Logout */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div
                    className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                    title={user.name}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Hospital Portals
          </div>
          <div className="grid grid-cols-2 gap-2">
            {portalTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`p-2.5 text-xs rounded-xl font-bold text-left flex items-center gap-2 ${
                    isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">
            1-Click Demo Logins
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoSelect('PATIENT')}
              className="px-2.5 py-2 text-xs bg-indigo-50 text-indigo-700 rounded-xl font-bold text-left flex justify-between items-center"
            >
              <span>🧑‍💼 Patient</span>
              <span className="text-[9px] bg-indigo-200/60 px-1 py-0.5 rounded">Ramesh</span>
            </button>
            <button
              onClick={() => handleDemoSelect('DOCTOR')}
              className="px-2.5 py-2 text-xs bg-blue-50 text-blue-700 rounded-xl font-bold text-left flex justify-between items-center"
            >
              <span>🩺 Doctor</span>
              <span className="text-[9px] bg-blue-200/60 px-1 py-0.5 rounded">Sharma</span>
            </button>
            <button
              onClick={() => handleDemoSelect('RECEPTIONIST')}
              className="px-2.5 py-2 text-xs bg-emerald-50 text-emerald-700 rounded-xl font-bold text-left flex justify-between items-center"
            >
              <span>📋 Reception</span>
              <span className="text-[9px] bg-emerald-200/60 px-1 py-0.5 rounded">Desk</span>
            </button>
            <button
              onClick={() => handleDemoSelect('ADMIN')}
              className="px-2.5 py-2 text-xs bg-purple-50 text-purple-700 rounded-xl font-bold text-left flex justify-between items-center"
            >
              <span>📊 Admin</span>
              <span className="text-[9px] bg-purple-200/60 px-1 py-0.5 rounded">Analytics</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Landing Page Sections
            </div>
            {landingSectionLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link.target)}
                className="block w-full text-left py-1.5 px-2 text-xs font-semibold text-slate-600 hover:text-indigo-600"
              >
                {link.label}
              </button>
            ))}
          </div>

          {!isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Log In
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-indigo-600 rounded-xl"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-xs font-semibold text-red-600 bg-red-50 rounded-xl"
              >
                Log Out ({user?.name})
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
