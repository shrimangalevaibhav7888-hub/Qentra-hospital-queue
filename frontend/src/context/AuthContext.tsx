import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { authApi, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  demoLogin: (role: Role) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isSeniorEasyView: boolean;
  toggleSeniorEasyView: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSeniorEasyView, setIsSeniorEasyView] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('landing'); // landing, patient, doctor, receptionist, admin, public-display

  const fetchUserProfile = async () => {
    try {
      if (!getAuthToken()) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const data = await authApi.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        if (data.user.isSeniorCitizen) {
          setIsSeniorEasyView(true);
        }
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      removeAuthToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      if (data.success && data.token) {
        setAuthToken(data.token);
        setToken(data.token);
        setUser(data.user);
        // Redirect according to role
        if (data.user.role === 'PATIENT') setActiveView('patient');
        else if (data.user.role === 'DOCTOR') setActiveView('doctor');
        else if (data.user.role === 'RECEPTIONIST') setActiveView('receptionist');
        else if (data.user.role === 'ADMIN') setActiveView('admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const data = await authApi.register({
        ...userData,
        role: userData.role || 'PATIENT' // Default public signup role = PATIENT
      });
      if (data.success && data.token) {
        setAuthToken(data.token);
        setToken(data.token);
        setUser(data.user);
        // Redirect according to role
        if (data.user.role === 'PATIENT') setActiveView('patient');
        else if (data.user.role === 'DOCTOR') setActiveView('doctor');
        else if (data.user.role === 'RECEPTIONIST') setActiveView('receptionist');
        else if (data.user.role === 'ADMIN') setActiveView('admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: Role) => {
    setIsLoading(true);
    try {
      const data = await authApi.demoLogin(role);
      if (data.success && data.token) {
        setAuthToken(data.token);
        setToken(data.token);
        setUser(data.user);
        if (role === 'PATIENT') setActiveView('patient');
        else if (role === 'DOCTOR') setActiveView('doctor');
        else if (role === 'RECEPTIONIST') setActiveView('receptionist');
        else if (role === 'ADMIN') setActiveView('admin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout().catch(() => {});
    } finally {
      removeAuthToken();
      setToken(null);
      setUser(null);
      setActiveView('landing');
    }
  };

  const toggleSeniorEasyView = () => {
    setIsSeniorEasyView(prev => !prev);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        refreshProfile: fetchUserProfile,
        isSeniorEasyView,
        toggleSeniorEasyView,
        activeView,
        setActiveView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
