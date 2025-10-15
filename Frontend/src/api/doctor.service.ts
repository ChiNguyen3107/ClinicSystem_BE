import api from './axios';
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
    
    const response = await api.get(`/doctors?${params}`);
    return response.data;
  },

  // Get doctor by ID
  getDoctor: async (id: number): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Get doctor by user ID
  getDoctorByUserId: async (userId: number): Promise<Doctor> => {
    const response = await api.get(`/doctors/user/${userId}`);
    return response.data;
  },

  // Update doctor
  updateDoctor: async (id: number, doctorData: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  // Get doctor specialties
  getSpecialties: async (): Promise<string[]> => {
    const response = await api.get('/doctors/specialties');
    return response.data;
  },

  // Search doctors
  searchDoctors: async (query: string): Promise<Doctor[]> => {
    const response = await api.get(`/doctors/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
