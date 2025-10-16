export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: MedicationCategory;
  unit: string;
  price: number;
  isActive: boolean;
  description?: string;
  contraindications?: string[];
  sideEffects?: string[];
}

export type MedicationCategory = 'ANTIBIOTIC' | 'ANALGESIC' | 'ANTI_INFLAMMATORY' | 'VITAMIN' | 'OTHER';

export interface Prescription {
  id: string;
  visitId: string;
  medications: PrescriptionItem[];
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicationId: string;
  medication: Medication;
  dosage: string;
  quantity: number;
  unit: string;
  usageNotes: string;
  price: number;
  totalPrice: number;
}

export interface CreatePrescriptionRequest {
  medications: CreatePrescriptionItemRequest[];
  notes?: string;
}

export interface CreatePrescriptionItemRequest {
  medicationId: string;
  dosage: string;
  quantity: number;
  unit: string;
  usageNotes: string;
}

export interface Billing {
  id: string;
  visitId: string;
  serviceOrders: ServiceOrder[];
  prescription?: Prescription;
  subtotal: number;
  discount: number;
  discountReason?: string;
  total: number;
  status: BillingStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type BillingStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface CreateBillingRequest {
  discount?: number;
  discountReason?: string;
}
