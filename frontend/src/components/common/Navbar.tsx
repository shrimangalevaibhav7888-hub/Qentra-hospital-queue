import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Activity,
  User as UserIcon,
  LogOut,
  Bell,
  Eye,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  Monitor,
  Menu,
  X
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
    await demoLogin(role);
  };

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Emergency Preview', href: '#emergency-preview' },
    { label: 'Public Display', onClick: () => setActiveView('public-display') },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Qentra Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveView('landing')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-200">
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

          {/* CENTER: Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              link.onClick ? (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <Monitor className="w-4 h-4 text-slate-400" />
                  {link.label}
                </button>
              ) : (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => {
                    if (activeView !== 'landing') setActiveView('landing');
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Senior Citizen Easy View Toggle */}
            <button
              onClick={toggleSeniorEasyView}
              title="Toggle Senior Citizen High-Contrast Accessible View"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSeniorEasyView
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Senior Easy View {isSeniorEasyView ? '● ON' : ''}</span>
            </button>

            {/* Quick Demo Switcher Dropdown (Crucial for Hackathon Demo) */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instant Demo Login
                  </div>
                  <button
                    onClick={() => handleDemoSelect('PATIENT')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span>🧑‍💼 Patient (Ramesh)</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">CARD-015</span>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('DOCTOR')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span>🩺 Doctor (Dr. Sharma)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Room 203</span>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('RECEPTIONIST')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span>📋 Receptionist</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Front Desk</span>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('ADMIN')}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                  >
                    <span>📊 Admin & Analytics</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Full Ops</span>
                  </button>
                </div>
              )}
            </div>

            {/* If Authenticated */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                
                {/* Active Dashboard Button */}
                <button
                  onClick={() => {
                    if (user.role === 'PATIENT') setActiveView('patient');
                    else if (user.role === 'DOCTOR') setActiveView('doctor');
                    else if (user.role === 'RECEPTIONIST') setActiveView('receptionist');
                    else if (user.role === 'ADMIN') setActiveView('admin');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    activeView === user.role.toLowerCase()
                      ? 'bg-indigo-600 text-white shadow-indigo-200'
                      : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  {user.role} Dashboard
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
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
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
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
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
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
              className="p-2 text-slate-600 hover:text-indigo-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => handleDemoSelect('PATIENT')}
              className="px-2 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded font-medium text-center"
            >
              Demo Patient
            </button>
            <button
              onClick={() => handleDemoSelect('DOCTOR')}
              className="px-2 py-1.5 text-xs bg-blue-50 text-blue-700 rounded font-medium text-center"
            >
              Demo Doctor
            </button>
            <button
              onClick={() => handleDemoSelect('RECEPTIONIST')}
              className="px-2 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded font-medium text-center"
            >
              Demo Receptionist
            </button>
            <button
              onClick={() => handleDemoSelect('ADMIN')}
              className="px-2 py-1.5 text-xs bg-purple-50 text-purple-700 rounded font-medium text-center"
            >
              Demo Admin
            </button>
          </div>

          {navLinks.map((link, idx) => (
            link.onClick ? (
              <button
                key={idx}
                onClick={() => { link.onClick(); setMobileMenuOpen(false); }}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={idx}
                href={link.href}
                onClick={() => { setActiveView('landing'); setMobileMenuOpen(false); }}
                className="block py-2 text-sm font-medium text-slate-700"
              >
                {link.label}
              </a>
            )
          ))}

          {!isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Log In
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-center text-sm font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full py-2 text-center text-sm font-semibold text-red-600 bg-red-50 rounded-lg"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
