import { axios } from '../axios';
import type {
  Medication,
  CreateMedicationRequest,
  UpdateMedicationRequest,
  MedicationInteraction,
  PaginatedResponse,
  ApiResponse
} from '@/types';

export const medicationService = {
  // Lấy danh sách thuốc
  async getMedications(params?: {
    search?: string;
    category?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<Medication>> {
    const response = await axios.get('/medications', { params });
    return response.data;
  },

  // Lấy thuốc theo ID
  async getMedicationById(id: number): Promise<Medication> {
    const response = await axios.get(`/medications/${id}`);
    return response.data;
  },

  // Tạo thuốc mới
  async createMedication(data: CreateMedicationRequest): Promise<Medication> {
    const response = await axios.post('/medications', data);
    return response.data;
  },

  // Cập nhật thuốc
  async updateMedication(id: number, data: UpdateMedicationRequest): Promise<Medication> {
    const response = await axios.put(`/medications/${id}`, data);
    return response.data;
  },

  // Xóa thuốc
  async deleteMedication(id: number): Promise<void> {
    await axios.delete(`/medications/${id}`);
  },

  // Tìm kiếm thuốc (autocomplete)
  async searchMedications(query: string, limit: number = 10): Promise<Medication[]> {
    const response = await axios.get('/medications/search', {
      params: { q: query, limit }
    });
    return response.data;
  },

  // Lấy tương tác thuốc
  async getMedicationInteractions(medicationIds: number[]): Promise<MedicationInteraction[]> {
    const response = await axios.post('/medications/interactions', { medicationIds });
    return response.data;
  },

  // Kiểm tra tương tác thuốc
  async checkInteractions(medicationId1: number, medicationId2: number): Promise<MedicationInteraction | null> {
    const response = await axios.get(`/medications/${medicationId1}/interactions/${medicationId2}`);
    return response.data;
  },

  // Lấy thuốc sắp hết hạn
  async getExpiringMedications(days: number = 30): Promise<Medication[]> {
    const response = await axios.get('/medications/expiring', {
      params: { days }
    });
    return response.data;
  },

  // Lấy thuốc hết hàng
  async getOutOfStockMedications(): Promise<Medication[]> {
    const response = await axios.get('/medications/out-of-stock');
    return response.data;
  },

  // Cập nhật giá thuốc hàng loạt
  async updateBulkPrices(updates: Array<{ id: number; price: number }>): Promise<void> {
    await axios.patch('/medications/bulk-prices', { updates });
  },

  // Lấy lịch sử giá thuốc
  async getPriceHistory(medicationId: number, params?: {
    page?: number;
    size?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PaginatedResponse<{
    id: number;
    medicationId: number;
    oldPrice: number;
    newPrice: number;
    changedAt: string;
    changedBy: string;
    reason?: string;
  }>> {
    const response = await axios.get(`/medications/${medicationId}/price-history`, { params });
    return response.data;
  }
};