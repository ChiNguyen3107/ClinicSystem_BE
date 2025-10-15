import api from './axios';
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
    
    const response = await api.get(`/appointments?${params}`);
    return response.data;
  },

  // Get appointment by ID
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  createAppointment: async (appointmentData: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id: number, appointmentData: Partial<CreateAppointmentRequest>): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  // Update appointment status
  updateAppointmentStatus: async (id: number, status: string): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // Get appointments by doctor
  getAppointmentsByDoctor: async (doctorId: number, date?: string): Promise<Appointment[]> => {
    const params = date ? `?date=${date}` : '';
    const response = await api.get(`/appointments/doctor/${doctorId}${params}`);
    return response.data;
  },

  // Get appointments by patient
  getAppointmentsByPatient: async (patientId: number): Promise<Appointment[]> => {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  },

  // Appointment Requests
  getAppointmentRequests: async (page = 0, size = 10): Promise<PaginatedResponse<AppointmentRequest>> => {
    const response = await api.get(`/appointment-requests?page=${page}&size=${size}`);
    return response.data;
  },

  createAppointmentRequest: async (requestData: CreateAppointmentRequestRequest): Promise<AppointmentRequest> => {
    const response = await api.post('/appointment-requests', requestData);
    return response.data;
  },

  updateAppointmentRequestStatus: async (id: number, status: string): Promise<AppointmentRequest> => {
    const response = await api.patch(`/appointment-requests/${id}/status`, { status });
    return response.data;
  },

  convertRequestToAppointment: async (requestId: number, appointmentData: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post(`/appointment-requests/${requestId}/convert`, appointmentData);
    return response.data;
  },
};
