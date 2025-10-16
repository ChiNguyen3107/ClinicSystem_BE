import { axios } from '../axios';
import type { 
  Doctor, 
  CreateDoctorRequest, 
  UpdateDoctorRequest, 
  DoctorFilters, 
  DoctorListResponse,
  DoctorStats 
} from '../../types/doctor';

export const doctorService = {
  // Lấy danh sách bác sĩ với filter và pagination
  async getDoctors(filters: DoctorFilters = {}): Promise<DoctorListResponse> {
    const params = new URLSearchParams();
    
    if (filters.specialty) params.append('specialty', filters.specialty);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());

    const response = await axios.get(`/doctors?${params.toString()}`);
    return response.data;
  },

  // Lấy thông tin chi tiết bác sĩ
  async getDoctorById(id: string): Promise<Doctor> {
    const response = await axios.get(`/doctors/${id}`);
    return response.data;
  },

  // Tạo bác sĩ mới
  async createDoctor(data: CreateDoctorRequest): Promise<Doctor> {
    const response = await axios.post('/doctors', data);
    return response.data;
  },

  // Cập nhật thông tin bác sĩ
  async updateDoctor(id: string, data: UpdateDoctorRequest): Promise<Doctor> {
    const response = await axios.put(`/doctors/${id}`, data);
    return response.data;
  },

  // Xóa bác sĩ
  async deleteDoctor(id: string): Promise<void> {
    await axios.delete(`/doctors/${id}`);
  },

  // Reset password bác sĩ
  async resetPassword(id: string): Promise<void> {
    await axios.post(`/doctors/${id}/reset-password`);
  },

  // Lấy thống kê bác sĩ
  async getDoctorStats(id: string): Promise<DoctorStats> {
    const response = await axios.get(`/doctors/${id}/stats`);
    return response.data;
  },

  // Lấy danh sách chuyên khoa
  async getSpecialties(): Promise<string[]> {
    const response = await axios.get('/doctors/specialties');
    return response.data;
  }
};
