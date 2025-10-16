import { axios } from '../axios';
import type {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  PrescriptionFilters,
  PaginatedResponse,
  ApiResponse
} from '@/types';

export const prescriptionService = {
  // Lấy danh sách đơn thuốc
  async getPrescriptions(params?: PrescriptionFilters & {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<Prescription>> {
    const response = await axios.get('/prescriptions', { params });
    return response.data;
  },

  // Lấy đơn thuốc theo ID
  async getPrescriptionById(id: number): Promise<Prescription> {
    const response = await axios.get(`/prescriptions/${id}`);
    return response.data;
  },

  // Tạo đơn thuốc mới
  async createPrescription(data: CreatePrescriptionRequest): Promise<Prescription> {
    const response = await axios.post('/prescriptions', data);
    return response.data;
  },

  // Cập nhật đơn thuốc
  async updatePrescription(id: number, data: UpdatePrescriptionRequest): Promise<Prescription> {
    const response = await axios.put(`/prescriptions/${id}`, data);
    return response.data;
  },

  // Xóa đơn thuốc
  async deletePrescription(id: number): Promise<void> {
    await axios.delete(`/prescriptions/${id}`);
  },

  // Cập nhật trạng thái đơn thuốc
  async updatePrescriptionStatus(id: number, status: string): Promise<Prescription> {
    const response = await axios.patch(`/prescriptions/${id}/status`, { status });
    return response.data;
  },

  // Lấy lịch sử đơn thuốc của bệnh nhân
  async getPatientPrescriptions(patientId: number, params?: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<Prescription>> {
    const response = await axios.get(`/patients/${patientId}/prescriptions`, { params });
    return response.data;
  },

  // Lấy đơn thuốc theo bác sĩ
  async getDoctorPrescriptions(doctorId: number, params?: {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'ASC' | 'DESC';
  }): Promise<PaginatedResponse<Prescription>> {
    const response = await axios.get(`/doctors/${doctorId}/prescriptions`, { params });
    return response.data;
  },

  // Tạo đơn thuốc từ phiên khám
  async createFromVisit(visitId: number, data: Omit<CreatePrescriptionRequest, 'patientId' | 'doctorId'>): Promise<Prescription> {
    const response = await axios.post(`/visits/${visitId}/prescriptions`, data);
    return response.data;
  },

  // In đơn thuốc (tạo QR code và cập nhật trạng thái)
  async printPrescription(id: number): Promise<{ qrCode: string; printedAt: string }> {
    const response = await axios.post(`/prescriptions/${id}/print`);
    return response.data;
  },

  // Xuất PDF đơn thuốc
  async exportPrescriptionPDF(id: number): Promise<Blob> {
    const response = await axios.get(`/prescriptions/${id}/export/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Xác thực đơn thuốc qua QR code
  async verifyPrescription(qrCode: string): Promise<Prescription> {
    const response = await axios.get(`/prescriptions/verify/${qrCode}`);
    return response.data;
  }
};
