import { axios } from '../axios';
import type {
  MedicationBatch,
  CreateBatchRequest,
  UpdateBatchRequest,
  PaginatedResponse
} from '@/types';

export const batchService = {
  // Lấy danh sách lô thuốc
  async getBatches(params?: {
    medicationId?: number;
    status?: 'ACTIVE' | 'EXPIRED' | 'OUT_OF_STOCK' | 'NEAR_EXPIRY';
    expiryFrom?: string;
    expiryTo?: string;
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<MedicationBatch>> {
    const response = await axios.get('/medication-batches', { params });
    return response.data;
  },

  // Lấy lô thuốc theo ID
  async getBatchById(id: number): Promise<MedicationBatch> {
    const response = await axios.get(`/medication-batches/${id}`);
    return response.data;
  },

  // Tạo lô thuốc mới
  async createBatch(data: CreateBatchRequest): Promise<MedicationBatch> {
    const response = await axios.post('/medication-batches', data);
    return response.data;
  },

  // Cập nhật lô thuốc
  async updateBatch(id: number, data: UpdateBatchRequest): Promise<MedicationBatch> {
    const response = await axios.put(`/medication-batches/${id}`, data);
    return response.data;
  },

  // Xóa lô thuốc
  async deleteBatch(id: number): Promise<void> {
    await axios.delete(`/medication-batches/${id}`);
  },

  // Lấy lô thuốc của một thuốc
  async getMedicationBatches(medicationId: number, params?: {
    status?: 'ACTIVE' | 'EXPIRED' | 'OUT_OF_STOCK' | 'NEAR_EXPIRY';
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<MedicationBatch>> {
    const response = await axios.get(`/medications/${medicationId}/batches`, { params });
    return response.data;
  },

  // Cập nhật số lượng lô thuốc (xuất kho)
  async updateBatchQuantity(id: number, quantity: number, reason?: string): Promise<MedicationBatch> {
    const response = await axios.patch(`/medication-batches/${id}/quantity`, {
      quantity,
      reason
    });
    return response.data;
  },

  // Lấy lô thuốc sắp hết hạn
  async getExpiringBatches(days: number = 30): Promise<MedicationBatch[]> {
    const response = await axios.get('/medication-batches/expiring', {
      params: { days }
    });
    return response.data;
  },

  // Lấy lô thuốc hết hàng
  async getOutOfStockBatches(): Promise<MedicationBatch[]> {
    const response = await axios.get('/medication-batches/out-of-stock');
    return response.data;
  },

  // Xuất kho tự động (khi tạo đơn thuốc)
  async autoExport(medicationId: number, quantity: number): Promise<{
    batch: MedicationBatch;
    exportedQuantity: number;
  }> {
    const response = await axios.post(`/medications/${medicationId}/auto-export`, {
      quantity
    });
    return response.data;
  },

  // Lấy lịch sử xuất kho
  async getExportHistory(batchId: number, params?: {
    page?: number;
    size?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PaginatedResponse<{
    id: number;
    batchId: number;
    quantity: number;
    exportedAt: string;
    exportedBy: string;
    reason?: string;
    prescriptionId?: number;
  }>> {
    const response = await axios.get(`/medication-batches/${batchId}/export-history`, { params });
    return response.data;
  },

  // Cập nhật trạng thái lô thuốc
  async updateBatchStatus(id: number, status: 'ACTIVE' | 'EXPIRED' | 'OUT_OF_STOCK' | 'NEAR_EXPIRY'): Promise<MedicationBatch> {
    const response = await axios.patch(`/medication-batches/${id}/status`, { status });
    return response.data;
  }
};
