import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actions?: NotificationAction[];
  sound?: boolean;
  badge?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive';
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  playSound: (type?: 'default' | 'success' | 'warning' | 'error') => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // WebSocket connection for real-time notifications
  const { isConnected, sendMessage } = useWebSocket({
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws/notifications',
    onMessage: (message) => {
      if (message.type === 'notification') {
        addNotification({
          type: message.data.type || 'info',
          title: message.data.title,
          message: message.data.message,
          read: false,
          persistent: message.data.persistent || false,
          sound: message.data.sound !== false,
          badge: message.data.badge !== false
        });
      }
    }
  });

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      setAudioContext(new AudioContext());
    }
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50 notifications

    // Play sound if enabled
    if (notification.sound !== false) {
      playSound(notification.type);
    }

    // Auto-remove non-persistent notifications after 5 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const playSound = useCallback((type: 'default' | 'success' | 'warning' | 'error' = 'default') => {
    if (!audioContext) return;

    const frequencies = {
      default: [800, 600],
      success: [1000, 1200, 1400],
      warning: [400, 500, 400],
      error: [200, 150, 100]
    };

    const freq = frequencies[type];
    const duration = 0.2;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < sampleRate * duration; i++) {
      const t = i / sampleRate;
      let sample = 0;
      freq.forEach((f, index) => {
        sample += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 3) * (0.1 / freq.length);
      });
      data[i] = sample;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  }, [audioContext]);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    playSound
  };
};
