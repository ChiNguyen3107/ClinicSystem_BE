import { z } from 'zod';

export enum AppointmentStatus {
  REQUESTED = 'REQUESTED',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Appointment {
  id: number;
  patient: {
    id: number;
    code: string;
    fullName: string;
    phone: string;
  };
  doctor: {
    id: number;
    specialty: string;
    licenseNumber: string;
    account: {
      id: number;
      fullName: string;
      email: string;
    };
  };
  clinicRoom: {
    id: number;
    name: string;
    description?: string;
  };
  scheduledAt: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  duration: number;
  createdBy: {
    id: number;
    fullName: string;
    email: string;
  };
  request?: {
    id: number;
    preferredDate: string;
    preferredTime: string;
    reason: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  clinicRoomId: number;
  scheduledAt: string;
  duration: number;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  doctorId?: number;
  clinicRoomId?: number;
  scheduledAt?: string;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
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
