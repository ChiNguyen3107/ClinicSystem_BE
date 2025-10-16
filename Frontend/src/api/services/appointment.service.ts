import { axiosInstance } from '../axios';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  AppointmentFilters,
  AppointmentStats,
  AppointmentStatus 
} from '@/types/appointment';

export interface AppointmentListResponse {
  content: Appointment[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export class AppointmentService {
  // Lấy danh sách lịch hẹn với filters
  static async getAppointments(filters: AppointmentFilters = {}): Promise<AppointmentListResponse> {
    const params = new URLSearchParams();
    
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.patientName) params.append('patientName', filters.patientName);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());

    const response = await axiosInstance.get(`/appointments?${params.toString()}`);
    return response.data;
  }

  // Lấy chi tiết lịch hẹn
  static async getAppointmentById(id: string): Promise<Appointment> {
    const response = await axiosInstance.get(`/appointments/${id}`);
    return response.data;
  }

  // Tạo lịch hẹn mới
  static async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await axiosInstance.post('/appointments', data);
    return response.data;
  }

  // Cập nhật lịch hẹn
  static async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await axiosInstance.put(`/appointments/${id}`, data);
    return response.data;
  }

  // Xóa lịch hẹn
  static async deleteAppointment(id: string): Promise<void> {
    await axiosInstance.delete(`/appointments/${id}`);
  }

  // Lấy lịch hẹn theo bác sĩ
  static async getAppointmentsByDoctor(doctorId: string, filters: Omit<AppointmentFilters, 'doctorId'> = {}): Promise<AppointmentListResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.patientName) params.append('patientName', filters.patientName);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());

    const response = await axiosInstance.get(`/appointments/doctor/${doctorId}?${params.toString()}`);
    return response.data;
  }

  // Lấy lịch hẹn theo bệnh nhân
  static async getAppointmentsByPatient(patientId: string, filters: Omit<AppointmentFilters, 'patientName'> = {}): Promise<AppointmentListResponse> {
    const params = new URLSearchParams();
    
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());

    const response = await axiosInstance.get(`/appointments/patient/${patientId}?${params.toString()}`);
    return response.data;
  }

  // Lấy lịch hẹn theo trạng thái
  static async getAppointmentsByStatus(status: AppointmentStatus, filters: Omit<AppointmentFilters, 'status'> = {}): Promise<AppointmentListResponse> {
    const params = new URLSearchParams();
    
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.patientName) params.append('patientName', filters.patientName);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.size) params.append('size', filters.size.toString());

    const response = await axiosInstance.get(`/appointments/status/${status}?${params.toString()}`);
    return response.data;
  }

  // Cập nhật trạng thái lịch hẹn
  static async updateAppointmentStatus(
    id: string, 
    status: AppointmentStatus, 
    cancellationReason?: string
  ): Promise<Appointment> {
    const data: UpdateAppointmentRequest = { status };
    if (cancellationReason) {
      data.cancellationReason = cancellationReason;
    }
    return this.updateAppointment(id, data);
  }

  // Xác nhận lịch hẹn
  static async confirmAppointment(id: string): Promise<Appointment> {
    return this.updateAppointmentStatus(id, AppointmentStatus.CONFIRMED);
  }

  // Hủy lịch hẹn
  static async cancelAppointment(id: string, reason: string): Promise<Appointment> {
    return this.updateAppointmentStatus(id, AppointmentStatus.CANCELLED, reason);
  }

  // Hoàn thành lịch hẹn
  static async completeAppointment(id: string): Promise<Appointment> {
    return this.updateAppointmentStatus(id, AppointmentStatus.COMPLETED);
  }

  // Đánh dấu không đến
  static async markNoShow(id: string): Promise<Appointment> {
    return this.updateAppointmentStatus(id, AppointmentStatus.NO_SHOW);
  }

  // Lấy thống kê lịch hẹn
  static async getAppointmentStats(): Promise<AppointmentStats> {
    const response = await axiosInstance.get('/appointments/stats');
    return response.data;
  }

  // Kiểm tra trùng lịch
  static async checkConflicts(data: {
    doctorId: string;
    appointmentDate: string;
    startTime: string;
    duration: number;
    excludeId?: string;
  }): Promise<{ hasConflict: boolean; conflicts: Appointment[] }> {
    const response = await axiosInstance.post('/appointments/check-conflicts', data);
    return response.data;
  }

  // Lấy lịch hẹn theo khoảng thời gian (cho calendar)
  static async getAppointmentsByDateRange(
    startDate: string, 
    endDate: string, 
    doctorId?: string
  ): Promise<Appointment[]> {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    if (doctorId) params.append('doctorId', doctorId);

    const response = await axiosInstance.get(`/appointments/date-range?${params.toString()}`);
    return response.data;
  }
}
