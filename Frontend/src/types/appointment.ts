import { z } from 'zod';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export interface Appointment {
  id: string;
  code: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  roomId: string;
  roomName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  roomId: string;
  appointmentDate: string;
  startTime: string;
  duration: number;
  reason: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  doctorId?: string;
  roomId?: string;
  appointmentDate?: string;
  startTime?: string;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
  cancellationReason?: string;
}

export interface AppointmentFilters {
  doctorId?: string;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  patientName?: string;
  page?: number;
  size?: number;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  noShow: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

// Zod schemas for validation
export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, 'Vui lòng chọn bệnh nhân'),
  doctorId: z.string().min(1, 'Vui lòng chọn bác sĩ'),
  roomId: z.string().min(1, 'Vui lòng chọn phòng'),
  appointmentDate: z.string().min(1, 'Vui lòng chọn ngày hẹn'),
  startTime: z.string().min(1, 'Vui lòng chọn giờ bắt đầu'),
  duration: z.number().min(30, 'Thời gian tối thiểu là 30 phút').max(180, 'Thời gian tối đa là 180 phút'),
  reason: z.string().min(1, 'Vui lòng nhập lý do khám'),
  notes: z.string().optional()
});

export const updateAppointmentSchema = z.object({
  doctorId: z.string().optional(),
  roomId: z.string().optional(),
  appointmentDate: z.string().optional(),
  startTime: z.string().optional(),
  duration: z.number().min(30).max(180).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  cancellationReason: z.string().optional()
});

export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;
