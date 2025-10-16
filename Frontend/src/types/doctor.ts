export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  specialty: string;
  licenseNo: string;
  room?: string;
  bio?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  avatar?: string;
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
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  
  // Step 2: Doctor profile
  specialty: string;
  licenseNo: string;
  room?: string;
  bio?: string;
}

export interface UpdateDoctorRequest {
  fullName?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  specialty?: string;
  room?: string;
  bio?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
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
