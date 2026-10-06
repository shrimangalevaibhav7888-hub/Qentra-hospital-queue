import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useSocket } from './context/SocketContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';

import { Hero } from './components/landing/Hero';
import { HeroSlider } from './components/landing/HeroSlider';
import { Features } from './components/landing/Features';
import { EmergencyImpactShowcase } from './components/landing/EmergencyImpactShowcase';
import { WhyQentra } from './components/landing/WhyQentra';
import { FAQ } from './components/landing/FAQ';
import { Contact } from './components/landing/Contact';

import { PatientDashboard } from './components/patient/PatientDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { ReceptionistDashboard } from './components/receptionist/ReceptionistDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PublicQueueDisplay } from './components/public/PublicQueueDisplay';
import { notificationApi } from './services/api';

export const App: React.FC = () => {
  const { user, isAuthenticated, activeView, setActiveView, isSeniorEasyView } = useAuth();
  const { lastNotification } = useSocket();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    if (isAuthenticated) {
      try {
        const res = await notificationApi.getMy();
        if (res.success) {
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (e) {
        // ignore
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [isAuthenticated, lastNotification]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // If in Public Kiosk Display Mode, render full-screen kiosk interface without standard landing wrapper
  if (activeView === 'public-display') {
    return <PublicQueueDisplay />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      
      {/* Universal Navbar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: LANDING PAGE */}
        {activeView === 'landing' && (
          <div>
            {/* 1. Main Hero with Realistic Dashboard Preview */}
            <Hero
              onGetStarted={() => handleOpenAuth('register')}
              onExploreDemo={() => {
                const sliderElem = document.getElementById('how-it-works');
                if (sliderElem) {
                  sliderElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* 2. Interactive Five-Step Hero Storytelling Slider (Core Hero Story) */}
            <HeroSlider />

            {/* 3. Core Features (24 capabilities) */}
            <Features />

            {/* 4. Crucial Differentiator: Emergency Impact Preview Interactive Showcase */}
            <EmergencyImpactShowcase />

            {/* 5. Why Qentra Stands Out (Differentiators) */}
            <WhyQentra />

            {/* 6. Frequently Asked Questions */}
            <FAQ />

            {/* 7. Contact / Hospital Inquiry */}
            <Contact />
          </div>
        )}

        {/* VIEW 2: PATIENT DASHBOARD */}
        {activeView === 'patient' && <PatientDashboard />}

        {/* VIEW 3: DOCTOR DASHBOARD */}
        {activeView === 'doctor' && <DoctorDashboard />}

        {/* VIEW 4: RECEPTIONIST DASHBOARD */}
        {activeView === 'receptionist' && <ReceptionistDashboard />}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {activeView === 'admin' && <AdminDashboard />}

      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal (Login / Register / 1-Click Demo) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onNotificationRead={() => {
          fetchUnreadCount();
        }}
      />

    </div>
  );
};

export default App;
