import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCheck, Clock, AlertCircle, CheckCircle2, Zap, Stethoscope } from 'lucide-react';
import { notificationApi } from '../../services/api';
import type { NotificationItem } from '../../types';
import { useSocket } from '../../context/SocketContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNotificationRead
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { lastNotification } = useSocket();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getMy();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, lastNotification]);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      fetchNotifications();
      onNotificationRead();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
      fetchNotifications();
      onNotificationRead();
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TOKEN_CALLED':
      case 'APPOINTMENT_CONFIRMED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'DOCTOR_DELAY':
      case 'TURN_NEAR':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'EMERGENCY_QUEUE_UPDATE':
        return <Zap className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-hidden text-left border-l border-slate-100">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500">Live queue alerts & doctor notices</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Read all</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No notifications yet. You'll receive live alerts here.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkSingleRead(n.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    n.isRead
                      ? 'bg-slate-50/60 border-slate-200/60 text-slate-600'
                      : 'bg-indigo-50/70 border-indigo-200 text-slate-900 shadow-2xs font-semibold'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getIcon(n.type)}
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Synced with Qentra Live Engine
        </div>

      </div>
    </div>
  );
};
