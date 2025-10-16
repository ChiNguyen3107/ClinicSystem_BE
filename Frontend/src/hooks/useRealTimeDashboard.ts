import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { dashboardService } from '@/api/dashboard.service';
import { DashboardStats } from '@/types';

interface RealTimeData {
  stats: DashboardStats | null;
  notifications: any[];
  activities: any[];
  lastUpdate: Date | null;
}

interface UseRealTimeDashboardReturn {
  data: RealTimeData;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  refresh: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

export const useRealTimeDashboard = (): UseRealTimeDashboardReturn => {
  const [data, setData] = useState<RealTimeData>({
    stats: null,
    notifications: [],
    activities: [],
    lastUpdate: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection
  const {
    isConnected,
    isConnecting,
    sendMessage,
    lastMessage,
    error: wsError,
    reconnect
  } = useWebSocket({
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws/dashboard',
    onMessage: (message) => {
      handleWebSocketMessage(message);
    },
    onConnect: () => {
      console.log('WebSocket connected');
      // Subscribe to dashboard updates
      sendMessage({ type: 'subscribe', channel: 'dashboard' });
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'stats_update':
        setData(prev => ({
          ...prev,
          stats: message.data,
          lastUpdate: new Date()
        }));
        break;
      case 'notification':
        setData(prev => ({
          ...prev,
          notifications: [message.data, ...prev.notifications].slice(0, 50),
          lastUpdate: new Date()
        }));
        break;
      case 'activity':
        setData(prev => ({
          ...prev,
          activities: [message.data, ...prev.activities].slice(0, 100),
          lastUpdate: new Date()
        }));
        break;
      case 'system_alert':
        // Handle system alerts
        console.log('System alert:', message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, notifications, activities] = await Promise.all([
        dashboardService.getDashboardStats('month'),
        dashboardService.getNotifications(),
        dashboardService.getActivityFeed(20)
      ]);

      setData({
        stats,
        notifications: notifications.data || [],
        activities: activities.data || [],
        lastUpdate: new Date()
      });
    } catch (err) {
      console.error('Error fetching initial dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchInitialData();
  }, [fetchInitialData]);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      await dashboardService.markNotificationAsRead(id);
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      }));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Auto-refresh when WebSocket reconnects
  useEffect(() => {
    if (isConnected) {
      refresh();
    }
  }, [isConnected, refresh]);

  // Periodic refresh fallback (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) {
        refresh();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isConnected, refresh]);

  return {
    data,
    loading,
    error: error || wsError,
    isConnected,
    isConnecting,
    refresh,
    markNotificationAsRead
  };
};
