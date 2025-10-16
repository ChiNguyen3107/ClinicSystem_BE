import { axios } from '../axios';
import type { 
  Schedule, 
  CreateScheduleRequest, 
  UpdateScheduleRequest, 
  ScheduleFilters,
  WeeklySchedule 
} from '../../types/schedule';

export const doctorScheduleService = {
  // Lấy lịch làm việc của bác sĩ
  async getDoctorSchedules(filters: ScheduleFilters = {}): Promise<Schedule[]> {
    const params = new URLSearchParams();
    
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.dayOfWeek !== undefined) params.append('dayOfWeek', filters.dayOfWeek.toString());

    const response = await axios.get(`/doctor-schedules?${params.toString()}`);
    return response.data;
  },

  // Lấy lịch làm việc theo tuần
  async getWeeklySchedule(doctorId: string, weekStart: string): Promise<WeeklySchedule> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const schedules = await this.getDoctorSchedules({
      doctorId,
      from: weekStart,
      to: weekEnd.toISOString().split('T')[0]
    });

    // Group schedules by day of week
    const weeklySchedule: WeeklySchedule = {};
    for (let i = 0; i < 7; i++) {
      weeklySchedule[i] = [];
    }

    schedules.forEach(schedule => {
      weeklySchedule[schedule.dayOfWeek].push(schedule);
    });

    return weeklySchedule;
  },

  // Tạo lịch làm việc mới
  async createSchedule(data: CreateScheduleRequest): Promise<Schedule> {
    const response = await axios.post('/doctor-schedules', data);
    return response.data;
  },

  // Cập nhật lịch làm việc
  async updateSchedule(id: string, data: UpdateScheduleRequest): Promise<Schedule> {
    const response = await axios.put(`/doctor-schedules/${id}`, data);
    return response.data;
  },

  // Xóa lịch làm việc
  async deleteSchedule(id: string): Promise<void> {
    await axios.delete(`/doctor-schedules/${id}`);
  },

  // Toggle trạng thái active của lịch
  async toggleScheduleStatus(id: string): Promise<Schedule> {
    const response = await axios.patch(`/doctor-schedules/${id}/toggle`);
    return response.data;
  }
};
