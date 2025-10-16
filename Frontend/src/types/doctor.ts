export interface Doctor {
  id: number;
  specialty: string;
  licenseNumber: string;
  examinationRoom?: string;
  biography?: string;
  account: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSchedule {
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

export interface DoctorStats {
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  averageRating: number;
  totalPatients: number;
}

export interface CreateDoctorRequest {
  // Step 1: User account
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  
  // Step 2: Doctor profile
  specialty: string;
  licenseNumber: string;
  examinationRoom?: string;
  biography?: string;
}

export interface UpdateDoctorRequest {
  fullName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  specialty?: string;
  examinationRoom?: string;
  biography?: string;
  status?: string;
}

export interface DoctorFilters {
  specialty?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  search?: string;
  page?: number;
  size?: number;
}

export interface DoctorListResponse {
  content: Doctor[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
