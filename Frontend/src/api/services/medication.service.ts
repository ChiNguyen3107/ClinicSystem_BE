import { api } from '../axios';
import { 
  Medication, 
  Prescription, 
  CreatePrescriptionRequest,
  Billing,
  CreateBillingRequest 
} from '@/types/medication';

export const medicationService = {
  // Get all medications
  async getMedications(): Promise<Medication[]> {
    const response = await api.get('/medications');
    return response.data;
  },

  // Get medication by ID
  async getMedicationById(id: string): Promise<Medication> {
    const response = await api.get(`/medications/${id}`);
    return response.data;
  },

  // Search medications
  async searchMedications(query: string): Promise<Medication[]> {
    const response = await api.get('/medications/search', { params: { q: query } });
    return response.data;
  },

  // Get medications by category
  async getMedicationsByCategory(category: string): Promise<Medication[]> {
    const response = await api.get('/medications', { params: { category } });
    return response.data;
  },

  // Prescription operations
  async getPrescriptionByVisit(visitId: string): Promise<Prescription | null> {
    const response = await api.get(`/visits/${visitId}/prescription`);
    return response.data;
  },

  async createPrescription(visitId: string, data: CreatePrescriptionRequest): Promise<Prescription> {
    const response = await api.post(`/visits/${visitId}/prescription`, data);
    return response.data;
  },

  async updatePrescription(visitId: string, data: CreatePrescriptionRequest): Promise<Prescription> {
    const response = await api.put(`/visits/${visitId}/prescription`, data);
    return response.data;
  },

  async deletePrescription(visitId: string): Promise<void> {
    await api.delete(`/visits/${visitId}/prescription`);
  },

  // Billing operations
  async getBillingByVisit(visitId: string): Promise<Billing | null> {
    const response = await api.get(`/visits/${visitId}/billing`);
    return response.data;
  },

  async createBilling(visitId: string, data: CreateBillingRequest): Promise<Billing> {
    const response = await api.post(`/visits/${visitId}/billing`, data);
    return response.data;
  },

  async updateBilling(visitId: string, data: CreateBillingRequest): Promise<Billing> {
    const response = await api.put(`/visits/${visitId}/billing`, data);
    return response.data;
  },

  async markBillingAsPaid(visitId: string): Promise<Billing> {
    const response = await api.patch(`/visits/${visitId}/billing/paid`);
    return response.data;
  },

  async generateBillingPDF(visitId: string): Promise<Blob> {
    const response = await api.get(`/visits/${visitId}/billing/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },
};
