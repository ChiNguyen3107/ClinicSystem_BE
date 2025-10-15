import api from './axios';
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
    
    const response = await api.get(`/patients?${params}`);
    return response.data;
  },

  // Get patient by ID
  getPatient: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  createPatient: async (patientData: CreatePatientRequest): Promise<Patient> => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  // Update patient
  updatePatient: async (id: number, patientData: Partial<CreatePatientRequest>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  // Search patients
  searchPatients: async (query: string): Promise<Patient[]> => {
    const response = await api.get(`/patients/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get patient by code
  getPatientByCode: async (code: string): Promise<Patient> => {
    const response = await api.get(`/patients/code/${code}`);
    return response.data;
  },
};
