import { apiClient } from './client';
import { Patient, CreatePatientRequest, PatientFilters, PaginatedResponse } from '@/types';

export const patientService = {
  // Get all patients with pagination and filters
  getPatients: async (page = 0, size = 10, filters?: PatientFilters): Promise<PaginatedResponse<Patient>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.gender && { gender: filters.gender }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
    });
    
    return await apiClient.getPaginated<Patient>(`/patients?${params}`);
  },

  // Get patient by ID
  getPatient: async (id: number): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  createPatient: async (patientData: CreatePatientRequest): Promise<Patient> => {
    const response = await apiClient.post<Patient>('/patients', patientData);
    return response.data;
  },

  // Update patient
  updatePatient: async (id: number, patientData: Partial<CreatePatientRequest>): Promise<Patient> => {
    const response = await apiClient.put<Patient>(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id: number): Promise<void> => {
    await apiClient.delete<void>(`/patients/${id}`);
  },

  // Search patients
  searchPatients: async (query: string): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get patient by code
  getPatientByCode: async (code: string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/patients/code/${code}`);
    return response.data;
  },

  // Export patients
  exportPatients: async (filters?: PatientFilters, format: 'excel' | 'pdf' = 'excel'): Promise<void> => {
    const params = new URLSearchParams({
      format,
      ...(filters?.search && { search: filters.search }),
      ...(filters?.gender && { gender: filters.gender }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
    });
    
    await apiClient.downloadFile(`/patients/export?${params}`, `patients.${format}`);
  },

  // Import patients
  importPatients: async (file: File, onProgress?: (progress: number) => void): Promise<{ success: number; errors: string[] }> => {
    const response = await apiClient.uploadFile<{ success: number; errors: string[] }>('/patients/import', file, onProgress);
    return response.data;
  },

  // Get patient statistics
  getPatientStats: async (): Promise<{
    total: number;
    newThisMonth: number;
    genderDistribution: Record<string, number>;
    ageGroups: Record<string, number>;
  }> => {
    const response = await apiClient.get<{
      total: number;
      newThisMonth: number;
      genderDistribution: Record<string, number>;
      ageGroups: Record<string, number>;
    }>('/patients/statistics');
    return response.data;
  },
};
