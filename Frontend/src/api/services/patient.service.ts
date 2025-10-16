import { axiosInstance } from '../axios';
import type {
  Patient,
  PatientCreateRequest,
  PatientUpdateRequest,
  PatientListParams,
  PatientListResponse,
  PatientDetail,
} from '@/types/patient';

export const patientService = {
  // Lấy danh sách bệnh nhân với phân trang và tìm kiếm
  async getPatients(params: PatientListParams = {}): Promise<PatientListResponse> {
    const defaultParams = {
      page: 0,
      size: 10,
      sortField: 'createdAt',
      sortDirection: 'DESC',
      ...params
    };
    
    const response = await axiosInstance.get('/patients', { params: defaultParams });
    return response.data;
  },

  // Lấy chi tiết bệnh nhân theo ID
  async getPatientById(id: number): Promise<PatientDetail> {
    const response = await axiosInstance.get(`/patients/${id}`);
    return response.data;
  },

  // Lấy bệnh nhân theo mã
  async getPatientByCode(code: string): Promise<Patient> {
    const response = await axiosInstance.get(`/patients/code/${code}`);
    return response.data;
  },

  // Tạo bệnh nhân mới
  async createPatient(data: PatientCreateRequest): Promise<Patient> {
    const response = await axiosInstance.post('/patients', data);
    return response.data;
  },

  // Cập nhật bệnh nhân
  async updatePatient(id: number, data: PatientUpdateRequest): Promise<Patient> {
    const response = await axiosInstance.put(`/patients/${id}`, data);
    return response.data;
  },

  // Xóa bệnh nhân
  async deletePatient(id: number): Promise<void> {
    await axiosInstance.delete(`/patients/${id}`);
  },

  // Kiểm tra bệnh nhân có thể xóa không (kiểm tra ràng buộc)
  async canDeletePatient(id: number): Promise<{ canDelete: boolean; reason?: string }> {
    try {
      const response = await axiosInstance.get(`/patients/${id}/can-delete`);
      return response.data;
    } catch (error: any) {
      return {
        canDelete: false,
        reason: error.response?.data?.message || 'Không thể xóa bệnh nhân này'
      };
    }
  }
};
