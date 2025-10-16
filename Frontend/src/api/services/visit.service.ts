import { api } from '../axios';
import { Visit, VisitFilter, CreateVisitRequest, UpdateVisitRequest } from '@/types/visit';

export const visitService = {
  // Get all visits with filters
  async getVisits(params?: VisitFilter): Promise<{ data: Visit[]; total: number }> {
    const response = await api.get('/visits', { params });
    return response.data;
  },

  // Get visit by ID
  async getVisitById(id: string): Promise<Visit> {
    const response = await api.get(`/visits/${id}`);
    return response.data;
  },

  // Create new visit
  async createVisit(data: CreateVisitRequest): Promise<Visit> {
    const response = await api.post('/visits', data);
    return response.data;
  },

  // Update visit
  async updateVisit(id: string, data: UpdateVisitRequest): Promise<Visit> {
    const response = await api.put(`/visits/${id}`, data);
    return response.data;
  },

  // Delete visit
  async deleteVisit(id: string): Promise<void> {
    await api.delete(`/visits/${id}`);
  },

  // Get visits by patient
  async getVisitsByPatient(patientId: string): Promise<Visit[]> {
    const response = await api.get(`/visits/patient/${patientId}`);
    return response.data;
  },

  // Get visits by doctor
  async getVisitsByDoctor(doctorId: string): Promise<Visit[]> {
    const response = await api.get(`/visits/doctor/${doctorId}`);
    return response.data;
  },

  // Get confirmed appointments for visit creation
  async getConfirmedAppointments(): Promise<any[]> {
    const response = await api.get('/appointments/confirmed');
    return response.data;
  },

  // Generate visit code
  async generateVisitCode(): Promise<{ code: string }> {
    const response = await api.get('/visits/generate-code');
    return response.data;
  },
};
