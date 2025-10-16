export interface MedicalService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  unit: string;
  isActive: boolean;
  indicators?: ServiceIndicator[];
}

export type ServiceCategory = 'EXAMINATION' | 'DIAGNOSTIC' | 'TREATMENT' | 'CONSULTATION';

export interface ServiceIndicator {
  id: string;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'CHECKBOX';
  options?: string[];
  required: boolean;
  unit?: string;
}

export interface ServiceOrder {
  id: string;
  visitId: string;
  serviceId: string;
  service: MedicalService;
  performerId?: string;
  performer?: {
    id: string;
    fullName: string;
    specialization: string;
  };
  status: ServiceOrderStatus;
  result?: string;
  indicators?: ServiceIndicatorResult[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ServiceIndicatorResult {
  indicatorId: string;
  indicator: ServiceIndicator;
  value: string | number | boolean;
}

export interface CreateServiceOrderRequest {
  serviceId: string;
  performerId?: string;
  notes?: string;
}

export interface UpdateServiceOrderRequest {
  performerId?: string;
  status?: ServiceOrderStatus;
  result?: string;
  indicators?: ServiceIndicatorResult[];
  notes?: string;
}
