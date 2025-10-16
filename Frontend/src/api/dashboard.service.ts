import api from './axios';
import { DashboardStats, DashboardStatsResponse, DashboardPeriod } from '@/types';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (period: DashboardPeriod = 'month'): Promise<DashboardStats> => {
    const response = await api.get<DashboardStatsResponse>(`/dashboard/stats?period=${period}`);
    return response.data.data;
  },

  // Get real-time dashboard stats (for auto-refresh)
  getRealtimeStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStatsResponse>('/dashboard/stats/realtime');
    return response.data.data;
  },

  // Get patient statistics
  getPatientStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/dashboard/patients?period=${period}`);
    return response.data;
  },

  // Get appointment statistics
  getAppointmentStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/dashboard/appointments?period=${period}`);
    return response.data;
  },

  // Get revenue statistics
  getRevenueStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/dashboard/revenue?period=${period}`);
    return response.data;
  },

  // Get doctor statistics
  getDoctorStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/dashboard/doctors?period=${period}`);
    return response.data;
  },

  // Get room statistics
  getRoomStats: async (period: DashboardPeriod = 'month') => {
    const response = await api.get(`/dashboard/rooms?period=${period}`);
    return response.data;
  },
};


