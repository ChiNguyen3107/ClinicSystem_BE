export interface Patient {
  id: number;
  code: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface PatientCreateRequest {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface PatientUpdateRequest {
  name?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface PatientListParams {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PatientListResponse {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface PatientChangeLog {
  id: number;
  field: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
  changedBy: string;
}

export interface PatientDetail extends Patient {
  changeLogs: PatientChangeLog[];
  visits: PatientVisit[];
  prescriptions: PatientPrescription[];
  billings: PatientBilling[];
}

export interface PatientVisit {
  id: number;
  visitDate: string;
  doctorName: string;
  diagnosis: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface PatientPrescription {
  id: number;
  prescriptionDate: string;
  doctorName: string;
  medications: string[];
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface PatientBilling {
  id: number;
  billingDate: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  services: string[];
}
