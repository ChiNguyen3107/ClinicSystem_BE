export interface Schedule {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  room?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface UpdateScheduleRequest {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  room?: string;
  isActive?: boolean;
}

export interface ScheduleFilters {
  doctorId?: string;
  from?: string; // ISO date
  to?: string; // ISO date
  dayOfWeek?: number;
}

export interface WeeklySchedule {
  [dayOfWeek: number]: Schedule[]; // 0-6
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  room?: string;
}
