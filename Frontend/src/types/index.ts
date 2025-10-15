// Base types
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// User types
export interface User extends BaseEntity {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  roles: Role[];
  doctorProfile?: Doctor;
}

export interface Role extends BaseEntity {
  name: string;
  description?: string;
}

// Patient types
export interface Patient extends BaseEntity {
  code: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}

// Doctor types
export interface Doctor extends BaseEntity {
  specialty: string;
  licenseNumber: string;
  examinationRoom?: string;
  biography?: string;
  account: User;
}

// Appointment types
export interface Appointment extends BaseEntity {
  patient: Patient;
  doctor: Doctor;
  clinicRoom: ClinicRoom;
  scheduledAt: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  duration: number;
  createdBy: User;
  request?: AppointmentRequest;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

// Appointment Request types
export interface AppointmentRequest extends BaseEntity {
  patient: Patient;
  doctor?: Doctor;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  status: AppointmentRequestStatus;
  notes?: string;
  createdBy?: User;
}

export enum AppointmentRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONVERTED = 'CONVERTED'
}

// Clinic Room types
export interface ClinicRoom extends BaseEntity {
  name: string;
  description?: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

// Doctor Schedule types
export interface DoctorSchedule extends BaseEntity {
  doctor: Doctor;
  dayOfWeek: number; // 1-7 (Monday-Sunday)
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// Patient Visit types
export interface PatientVisit extends BaseEntity {
  patient: Patient;
  doctor: Doctor;
  appointment?: Appointment;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  status: VisitStatus;
}

export enum VisitStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Medical Service types
export interface MedicalService extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Service Order types
export interface ServiceOrder extends BaseEntity {
  patient: Patient;
  doctor: Doctor;
  visit?: PatientVisit;
  status: ServiceOrderStatus;
  totalAmount: number;
  notes?: string;
  services: ServiceOrderItem[];
}

export enum ServiceOrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ServiceOrderItem extends BaseEntity {
  service: MedicalService;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Prescription types
export interface Prescription extends BaseEntity {
  patient: Patient;
  doctor: Doctor;
  visit?: PatientVisit;
  diagnosis: string;
  notes?: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
}

export enum PrescriptionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface PrescriptionItem extends BaseEntity {
  medication: Medication;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

// Medication types
export interface Medication extends BaseEntity {
  name: string;
  description?: string;
  unit: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
  batches: MedicationBatch[];
}

export interface MedicationBatch extends BaseEntity {
  medication: Medication;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  remainingQuantity: number;
  status: 'ACTIVE' | 'EXPIRED' | 'OUT_OF_STOCK';
}

// Billing types
export interface Billing extends BaseEntity {
  patient: Patient;
  serviceOrder?: ServiceOrder;
  totalAmount: number;
  paidAmount: number;
  status: BillingStatus;
  paymentMethod?: string;
  paymentDate?: string;
  notes?: string;
  items: BillingItem[];
}

export enum BillingStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface BillingItem extends BaseEntity {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}

// Form types
export interface CreatePatientRequest {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  clinicRoomId: number;
  scheduledAt: string;
  reason?: string;
  notes?: string;
  duration: number;
}

export interface CreateAppointmentRequestRequest {
  patientId: number;
  doctorId?: number;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  notes?: string;
}

// UI State types
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
}

// Filter and Search types
export interface AppointmentFilters {
  status?: AppointmentStatus;
  doctorId?: number;
  patientId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PatientFilters {
  search?: string;
  gender?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface DoctorFilters {
  specialty?: string;
  search?: string;
  isActive?: boolean;
}
