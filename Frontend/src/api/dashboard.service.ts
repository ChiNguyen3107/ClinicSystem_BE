import api from './axios';
import { DashboardStats, DashboardStatsResponse, DashboardPeriod } from '@/types';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (period: DashboardPeriod = 'month'): Promise<DashboardStats> => {
    const response = await api.get<DashboardStatsResponse>(`/api/dashboard/stats?period=${period}`);
    return response.data.data;
  },

  // Get real-time dashboard stats (for auto-refresh)
  getRealtimeStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStatsResponse>('/api/dashboard/stats/realtime');
    return response.data.data;
  },

  // Get today's appointments
  getTodayAppointments: async () => {
    const response = await api.get('/api/dashboard/appointments-today');
    return response.data;
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    const response = await api.get('/api/dashboard/upcoming-appointments');
    return response.data;
  },

  // Get pending tasks
  getPendingTasks: async () => {
    const response = await api.get('/api/dashboard/pending-tasks');
    return response.data;
  },

  // Get revenue chart data
  getRevenueChart: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/api/dashboard/revenue-chart?period=${period}`);
    return response.data;
  },

  // Get patient chart data
  getPatientChart: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/api/dashboard/patient-chart?period=${period}`);
    return response.data;
  },

  // Get doctor statistics
  getDoctorStats: async () => {
    const response = await api.get('/api/dashboard/doctor-stats');
    return response.data;
  },

  // Get service statistics
  getServiceStats: async () => {
    const response = await api.get('/api/dashboard/service-stats');
    return response.data;
  },

  // Get patient statistics
  getPatientStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/api/dashboard/patients?period=${period}`);
    return response.data;
  },

  // Get appointment statistics
  getAppointmentStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/api/dashboard/appointments?period=${period}`);
    return response.data;
  },

  // Get revenue statistics
  getRevenueStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/api/dashboard/revenue?period=${period}`);
    return response.data;
  },

  // Get room statistics
  getRoomStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/api/dashboard/rooms?period=${period}`);
    return response.data;
  },
};


