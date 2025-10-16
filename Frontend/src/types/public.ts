export interface PublicDoctor {
  id: string;
  fullName: string;
  specialty: string;
  bio?: string;
  avatar?: string;
  rating: number;
  totalReviews: number;
  experience: number; // years
  education?: string;
  certifications?: string[];
  languages?: string[];
  consultationFee: number;
  isAvailable: boolean;
  schedule: PublicDoctorSchedule[];
}

export interface PublicDoctorSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface PublicService {
  id: string;
  name: string;
  description: string;
  category: 'EXAMINATION' | 'DIAGNOSTIC' | 'TREATMENT' | 'CONSULTATION';
  price: number;
  duration: number; // in minutes
  isAvailable: boolean;
}

export interface BookingRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientDob?: string;
  doctorId: string;
  doctor?: PublicDoctor;
  serviceId?: string;
  service?: PublicService;
  appointmentDate: string; // ISO date
  appointmentTime: string; // HH:mm format
  symptoms?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  totalAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'CANCELLED' 
  | 'COMPLETED' 
  | 'NO_SHOW';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED';

export type PaymentMethod = 
  | 'CASH' 
  | 'VNPAY' 
  | 'MOMO' 
  | 'BANK_TRANSFER';

export interface CreateBookingRequest {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientDob?: string;
  doctorId: string;
  serviceId?: string;
  appointmentDate: string;
  appointmentTime: string;
  symptoms?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface UpdateBookingRequest {
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  patientDob?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  symptoms?: string;
  notes?: string;
}

export interface BookingFilters {
  status?: BookingStatus;
  doctorId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface BookingListResponse {
  content: BookingRequest[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Rating {
  id: string;
  bookingId: string;
  doctorId: string;
  doctor?: PublicDoctor;
  patientName: string;
  rating: number; // 1-5 stars
  comment?: string;
  serviceRating?: number;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingRequest {
  bookingId: string;
  doctorId: string;
  rating: number;
  comment?: string;
  serviceRating?: number;
  isAnonymous?: boolean;
}

export interface UpdateRatingRequest {
  rating?: number;
  comment?: string;
  serviceRating?: number;
  isAnonymous?: boolean;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  recentRatings: Rating[];
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
}

export interface PaymentResponse {
  paymentUrl?: string;
  paymentId?: string;
  status: PaymentStatus;
  message?: string;
}

export interface ClinicInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  services: string[];
  specialties: string[];
  workingHours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isOpen: boolean;
  }[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}
