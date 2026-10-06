import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Activity, Sparkles, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Role } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('PATIENT');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('Male');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({
          name,
          email,
          password,
          role,
          phone,
          age,
          gender
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoRole: Role) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await demoLogin(demoRole);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 flex items-center justify-center mx-auto shadow-md shadow-indigo-200 mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">
            {mode === 'login' ? 'Welcome Back to Qentra' : 'Create Your Qentra Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Log in to track your live queue and appointments'
              : 'Register to manage queue appointments digitally'}
          </p>
        </div>

        {/* Quick Demo Switcher (Instant 1-click test for Hackathon Judges) */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 mb-6">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              1-Click Demo Accounts
            </span>
            <span className="text-indigo-500 font-normal">Instant Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('PATIENT')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-2xs transition-colors text-left flex items-center justify-between"
            >
              <span>🧑‍💼 Patient</span>
              <span className="text-[10px] text-slate-400">Ramesh</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('DOCTOR')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-2xs transition-colors text-left flex items-center justify-between"
            >
              <span>🩺 Doctor</span>
              <span className="text-[10px] text-slate-400">Dr. Sharma</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('RECEPTIONIST')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-2xs transition-colors text-left flex items-center justify-between"
            >
              <span>📋 Reception</span>
              <span className="text-[10px] text-slate-400">Desk</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg shadow-2xs transition-colors text-left flex items-center justify-between"
            >
              <span>📊 Admin</span>
              <span className="text-[10px] text-slate-400">Analytics</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Kumar"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="32"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@qentra.demo"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'login'
              ? 'Log In to Account'
              : 'Complete Registration'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
