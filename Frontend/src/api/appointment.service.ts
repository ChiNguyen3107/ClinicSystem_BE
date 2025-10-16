import { apiClient } from './client';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  CreateAppointmentRequestRequest,
  AppointmentRequest,
  AppointmentFilters, 
  PaginatedResponse 
} from '@/types';

export const appointmentService = {
  // Get all appointments with pagination and filters
  getAppointments: async (page = 0, size = 10, filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.doctorId && { doctorId: filters.doctorId.toString() }),
      ...(filters?.patientId && { patientId: filters.patientId.toString() }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
    });
    
    return await apiClient.getPaginated<Appointment>(`/appointments?${params}`);
  },

  // Get appointment by ID
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  createAppointment: async (appointmentData: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id: number, appointmentData: Partial<CreateAppointmentRequest>): Promise<Appointment> => {
    const response = await apiClient.put<Appointment>(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id: number): Promise<void> => {
    await apiClient.delete<void>(`/appointments/${id}`);
  },

  // Update appointment status
  updateAppointmentStatus: async (id: number, status: string): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // Get appointments by doctor
  getAppointmentsByDoctor: async (doctorId: number, date?: string): Promise<Appointment[]> => {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get<Appointment[]>(`/appointments/doctor/${doctorId}${params}`);
    return response.data;
  },

  // Get appointments by patient
  getAppointmentsByPatient: async (patientId: number): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>(`/appointments/patient/${patientId}`);
    return response.data;
  },

  // Appointment Requests
  getAppointmentRequests: async (page = 0, size = 10): Promise<PaginatedResponse<AppointmentRequest>> => {
    return await apiClient.getPaginated<AppointmentRequest>(`/appointment-requests?page=${page}&size=${size}`);
  },

  createAppointmentRequest: async (requestData: CreateAppointmentRequestRequest): Promise<AppointmentRequest> => {
    const response = await apiClient.post<AppointmentRequest>('/appointment-requests', requestData);
    return response.data;
  },

  updateAppointmentRequestStatus: async (id: number, status: string): Promise<AppointmentRequest> => {
    const response = await apiClient.patch<AppointmentRequest>(`/appointment-requests/${id}/status`, { status });
    return response.data;
  },

  convertRequestToAppointment: async (requestId: number, appointmentData: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>(`/appointment-requests/${requestId}/convert`, appointmentData);
    return response.data;
  },

  // Get today's appointments
  getTodayAppointments: async (doctorId?: number): Promise<Appointment[]> => {
    const params = doctorId ? `?doctorId=${doctorId}` : '';
    const response = await apiClient.get<Appointment[]>(`/appointments/today${params}`);
    return response.data;
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (days: number = 7): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>(`/appointments/upcoming?days=${days}`);
    return response.data;
  },

  // Check appointment availability
  checkAvailability: async (doctorId: number, date: string, time: string): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/appointments/check-availability?doctorId=${doctorId}&date=${date}&time=${time}`);
    return response.data;
  },

  // Get appointment statistics
  getAppointmentStats: async (period: 'today' | 'week' | 'month' = 'today'): Promise<{
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    noShow: number;
  }> => {
    const response = await apiClient.get<{
      total: number;
      completed: number;
      pending: number;
      cancelled: number;
      noShow: number;
    }>(`/appointments/statistics?period=${period}`);
    return response.data;
  },

  // Send appointment reminder
  sendReminder: async (appointmentId: number): Promise<void> => {
    await apiClient.post<void>(`/appointments/${appointmentId}/reminder`);
  },

  // Reschedule appointment
  rescheduleAppointment: async (appointmentId: number, newDate: string, newTime: string): Promise<Appointment> => {
    const response = await apiClient.patch<Appointment>(`/appointments/${appointmentId}/reschedule`, {
      scheduledAt: `${newDate}T${newTime}`,
    });
    return response.data;
  },
};
