import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  lastQueueUpdate: any;
  lastNotification: any;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastQueueUpdate, setLastQueueUpdate] = useState<any>(null);
  const [lastNotification, setLastNotification] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const SOCKET_URL = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('⚡ Connected to Qentra Realtime Engine');
      setIsConnected(true);

      // Join rooms
      if (user?.patientId) {
        newSocket.emit('join_room', `patient_${user.patientId}`);
      }
      if (user?.doctorId) {
        newSocket.emit('join_room', `doctor_${user.doctorId}`);
      }
      newSocket.emit('join_room', 'public_display');
    });

    newSocket.on('disconnect', () => {
      console.log('⚡ Disconnected from Qentra Realtime Engine');
      setIsConnected(false);
    });

    newSocket.on('queue_updated', (data) => {
      console.log('⚡ Queue Updated Event:', data);
      setLastQueueUpdate({ timestamp: Date.now(), ...data });
    });

    newSocket.on('notification_received', (data) => {
      console.log('🔔 Notification Received:', data);
      setLastNotification(data);
      playNotificationSound();
    });

    newSocket.on('notification_broadcast', (data) => {
      if (user?.patientId && data.patientId === user.patientId) {
        setLastNotification(data.notification);
        playNotificationSound();
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.patientId, user?.doctorId]);

  const playNotificationSound = () => {
    try {
      // Audio chime synthesis via Web Audio API so no missing external audio file issue occurs!
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Ignore audio context errors if blocked by browser policy
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        lastQueueUpdate,
        lastNotification,
        isConnected
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
