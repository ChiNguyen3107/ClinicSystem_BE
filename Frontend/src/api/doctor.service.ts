import { apiClient } from './client';
import { Doctor, DoctorFilters, PaginatedResponse } from '@/types';

export const doctorService = {
  // Get all doctors with pagination and filters
  getDoctors: async (page = 0, size = 10, filters?: DoctorFilters): Promise<PaginatedResponse<Doctor>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(filters?.specialty && { specialty: filters.specialty }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive.toString() }),
    });
    
    return await apiClient.getPaginated<Doctor>(`/doctors?${params}`);
  },

  // Get doctor by ID
  getDoctor: async (id: number): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },

  // Get doctor by user ID
  getDoctorByUserId: async (userId: number): Promise<Doctor> => {
    const response = await apiClient.get<Doctor>(`/doctors/user/${userId}`);
    return response.data;
  },

  // Update doctor
  updateDoctor: async (id: number, doctorData: Partial<Doctor>): Promise<Doctor> => {
    const response = await apiClient.put<Doctor>(`/doctors/${id}`, doctorData);
    return response.data;
  },

  // Get doctor specialties
  getSpecialties: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/doctors/specialties');
    return response.data;
  },

  // Search doctors
  searchDoctors: async (query: string): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>(`/doctors/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get doctor schedule
  getDoctorSchedule: async (doctorId: number, startDate?: string, endDate?: string): Promise<any[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get<any[]>(`/doctors/${doctorId}/schedule?${params}`);
    return response.data;
  },

  // Update doctor schedule
  updateDoctorSchedule: async (doctorId: number, scheduleData: any): Promise<any> => {
    const response = await apiClient.put<any>(`/doctors/${doctorId}/schedule`, scheduleData);
    return response.data;
  },

  // Get doctor statistics
  getDoctorStats: async (doctorId?: number): Promise<{
    totalAppointments: number;
    completedAppointments: number;
    pendingAppointments: number;
    averageRating: number;
    totalPatients: number;
  }> => {
    const url = doctorId ? `/doctors/${doctorId}/statistics` : '/doctors/statistics';
    const response = await apiClient.get<{
      totalAppointments: number;
      completedAppointments: number;
      pendingAppointments: number;
      averageRating: number;
      totalPatients: number;
    }>(url);
    return response.data;
  },

  // Get available doctors for appointment
  getAvailableDoctors: async (date: string, time: string, specialty?: string): Promise<Doctor[]> => {
    const params = new URLSearchParams({
      date,
      time,
      ...(specialty && { specialty }),
    });
    
    const response = await apiClient.get<Doctor[]>(`/doctors/available?${params}`);
    return response.data;
  },
};
