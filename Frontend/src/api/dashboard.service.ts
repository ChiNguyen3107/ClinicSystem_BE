import { apiClient } from './client';
import { DashboardStats, DashboardStatsResponse, DashboardPeriod } from '@/types';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (period: DashboardPeriod = 'month'): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStatsResponse>(`/dashboard/stats?period=${period}`);
    return response.data.data;
  },

  // Get real-time dashboard stats (for auto-refresh)
  getRealtimeStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats/realtime');
    return response.data.data;
  },

  // Get today's appointments
  getTodayAppointments: async () => {
    const response = await apiClient.get('/dashboard/appointments-today');
    return response.data;
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    const response = await apiClient.get('/dashboard/upcoming-appointments');
    return response.data;
  },

  // Get pending tasks
  getPendingTasks: async () => {
    const response = await apiClient.get('/dashboard/pending-tasks');
    return response.data;
  },

  // Get revenue chart data
  getRevenueChart: async (period: DashboardPeriod = 'month') => {
    const response = await apiClient.get(`/dashboard/revenue-chart?period=${period}`);
    return response.data;
  },

  // Get patient chart data
  getPatientChart: async (period: DashboardPeriod = 'month') => {
    const response = await apiClient.get(`/dashboard/patient-chart?period=${period}`);
    return response.data;
  },

  // Get doctor statistics
  getDoctorStats: async () => {
    const response = await apiClient.get('/dashboard/doctor-stats');
    return response.data;
  },

  // Get service statistics
  getServiceStats: async () => {
    const response = await apiClient.get('/dashboard/service-stats');
    return response.data;
  },

  // Get patient statistics
  getPatientStats: async (period: DashboardPeriod = 'month') => {
    const response = await apiClient.get(`/dashboard/patients?period=${period}`);
    return response.data;
  },

  // Get appointment statistics
  getAppointmentStats: async (period: DashboardPeriod = 'month') => {
    const response = await apiClient.get(`/dashboard/appointments?period=${period}`);
    return response.data;
  },

  // Get revenue statistics
  getRevenueStats: async (period: DashboardPeriod = 'month') => {
    const response = await apiClient.get(`/dashboard/revenue?period=${period}`);
    return response.data;
  },

  // Get room statistics
  getRoomStats: async (period: DashboardPeriod = 'month') => {
    const response = await apiClient.get(`/dashboard/rooms?period=${period}`);
    return response.data;
  },

  // Get system health status
  getSystemHealth: async () => {
    const response = await apiClient.get('/dashboard/system-health');
    return response.data;
  },

  // Get notification center data
  getNotifications: async () => {
    const response = await apiClient.get('/dashboard/notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: string) => {
    await apiClient.patch(`/dashboard/notifications/${notificationId}/read`);
  },

  // Get activity feed
  getActivityFeed: async (limit: number = 20) => {
    const response = await apiClient.get(`/dashboard/activity-feed?limit=${limit}`);
    return response.data;
  },

  // Get performance metrics
  getPerformanceMetrics: async (period: DashboardPeriod = 'month') => {
    const response = await apiClient.get(`/dashboard/performance-metrics?period=${period}`);
    return response.data;
  },
};


