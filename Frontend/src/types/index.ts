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
  code: string;
  patient: Patient;
  doctor: Doctor;
  visit?: PatientVisit;
  diagnosis: string;
  notes?: string;
  status: PrescriptionStatus;
  totalAmount: number;
  items: PrescriptionItem[];
  qrCode?: string;
  printedAt?: string;
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
  unitPrice: number;
  totalPrice: number;
  batch?: MedicationBatch;
}

// Medication types
export interface Medication extends BaseEntity {
  name: string;
  genericName?: string;
  description?: string;
  category: MedicationCategory;
  unit: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
  contraindications?: string[];
  sideEffects?: string[];
  interactions?: MedicationInteraction[];
  batches: MedicationBatch[];
}

export type MedicationCategory = 
  | 'ANTIBIOTIC' 
  | 'ANALGESIC' 
  | 'ANTI_INFLAMMATORY' 
  | 'VITAMIN' 
  | 'CARDIOVASCULAR'
  | 'RESPIRATORY'
  | 'GASTROINTESTINAL'
  | 'NEUROLOGICAL'
  | 'OTHER';

export interface MedicationInteraction {
  id: number;
  medication1: Medication;
  medication2: Medication;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  description: string;
  recommendation: string;
}

export interface MedicationBatch extends BaseEntity {
  medication: Medication;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  remainingQuantity: number;
  status: 'ACTIVE' | 'EXPIRED' | 'OUT_OF_STOCK' | 'NEAR_EXPIRY';
  supplier?: string;
  costPrice?: number;
}

// Prescription Filter types
export interface PrescriptionFilters {
  status?: PrescriptionStatus;
  doctorId?: number;
  patientId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Prescription Create/Update types
export interface CreatePrescriptionRequest {
  patientId: number;
  doctorId: number;
  visitId?: number;
  diagnosis: string;
  notes?: string;
  items: CreatePrescriptionItemRequest[];
}

export interface CreatePrescriptionItemRequest {
  medicationId: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  batchId?: number;
}

export interface UpdatePrescriptionRequest {
  diagnosis?: string;
  notes?: string;
  status?: PrescriptionStatus;
  items?: CreatePrescriptionItemRequest[];
}

// Medication Create/Update types
export interface CreateMedicationRequest {
  name: string;
  genericName?: string;
  description?: string;
  category: MedicationCategory;
  unit: string;
  price: number;
  contraindications?: string[];
  sideEffects?: string[];
}

export interface UpdateMedicationRequest {
  name?: string;
  genericName?: string;
  description?: string;
  category?: MedicationCategory;
  unit?: string;
  price?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  contraindications?: string[];
  sideEffects?: string[];
}

// Batch Create/Update types
export interface CreateBatchRequest {
  medicationId: number;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  supplier?: string;
  costPrice?: number;
}

export interface UpdateBatchRequest {
  batchNumber?: string;
  expiryDate?: string;
  quantity?: number;
  supplier?: string;
  costPrice?: number;
}

// Billing types
export interface Billing extends BaseEntity {
  code: string;
  patientId: string;
  patientName: string;
  visitId: string;
  total: number;
  subtotal: number;
  discountAmount: number;
  discountPercentage?: number;
  discountCode?: string;
  vatAmount: number;
  vatRate: number;
  status: BillingStatus;
  paymentMethod: PaymentMethod;
  paidAt?: string;
  notes?: string;
  services: BillingService[];
  medications: BillingMedication[];
}

export interface BillingService {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BillingMedication {
  id: string;
  medicationId: string;
  medicationName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  billingId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  paidAt: string;
  notes?: string;
}

export interface BillingStatistics {
  totalRevenue: number;
  totalBills: number;
  averageBillValue: number;
  revenueByMethod: Record<PaymentMethod, number>;
  revenueByPeriod: {
    daily: Array<{ date: string; revenue: number }>;
    weekly: Array<{ week: string; revenue: number }>;
    monthly: Array<{ month: string; revenue: number }>;
  };
  topServices: Array<{ serviceName: string; revenue: number; count: number }>;
  topMedications: Array<{ medicationName: string; revenue: number; count: number }>;
}

export interface CreateBillingRequest {
  visitId: string;
  services: Array<{
    serviceId: string;
    quantity: number;
  }>;
  medications: Array<{
    medicationId: string;
    quantity: number;
  }>;
  discountCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
  notes?: string;
}

export interface UpdateBillingRequest {
  services?: Array<{
    serviceId: string;
    quantity: number;
  }>;
  medications?: Array<{
    medicationId: string;
    quantity: number;
  }>;
  discountCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
  notes?: string;
}

export interface ProcessPaymentRequest {
  billingId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface BillingFilters {
  status?: BillingStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CreateDiscountCodeRequest {
  code: string;
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
}

export interface UpdateDiscountCodeRequest {
  name?: string;
  description?: string;
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom?: string;
  validTo?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export enum BillingStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CARD = 'CARD',
  E_WALLET = 'E_WALLET'
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export interface BillingExportOptions {
  format: 'excel' | 'pdf';
  dateFrom?: string;
  dateTo?: string;
  status?: BillingStatus[];
  paymentMethod?: PaymentMethod[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  sort?: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  pageable?: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: string[];
  timestamp: string;
  path: string;
  status: number;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path: string;
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

// Dashboard types
export interface DashboardStats {
  totalPatients: number;
  totalPatientsChange: number;
  newPatients: number;
  newPatientsChange: number;
  todayAppointments: number;
  pendingAppointments: number;
  activeDoctors: number;
  doctorsWithSchedule: number;
  monthlyRevenue: number;
  todayRevenue: number;
  revenueGrowth: number;
  successRate: number;
  activeRooms: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message: string;
}

export type DashboardPeriod = 'today' | 'week' | 'month' | 'year';

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  change?: number;
  color?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  description?: string;
  data: ChartData[];
  period: DashboardPeriod;
}

// Activity types
export interface Activity {
  id: string;
  type: 'appointment' | 'patient' | 'notification' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'cancelled' | 'in_progress';
  priority?: 'low' | 'medium' | 'high';
  user?: string;
  unread?: boolean;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Real-time data types
export interface RealTimeData {
  stats: DashboardStats | null;
  notifications: Notification[];
  activities: Activity[];
  lastUpdate: Date | null;
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// Export report types
export * from './report';