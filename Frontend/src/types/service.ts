export interface MedicalService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  unit: string;
  duration: number; // in minutes
  preparation?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE';
  indicators?: ServiceIndicator[];
  priceHistory?: PriceHistory[];
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 'EXAMINATION' | 'DIAGNOSTIC' | 'TREATMENT' | 'CONSULTATION';

export interface ServiceIndicator {
  id: string;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'CHECKBOX';
  options?: string[];
  required: boolean;
  unit?: string;
  description?: string;
  normalRange?: {
    min: number;
    max: number;
    unit: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PriceHistory {
  id: string;
  serviceId: string;
  oldPrice: number;
  newPrice: number;
  effectiveDate: string;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  totalRevenue: number;
  topServices: {
    serviceId: string;
    serviceName: string;
    usageCount: number;
    revenue: number;
  }[];
  revenueByCategory: {
    category: ServiceCategory;
    revenue: number;
    percentage: number;
  }[];
}

export interface BulkPriceUpdate {
  serviceId: string;
  newPrice: number;
  effectiveDate: string;
  reason?: string;
}

export interface CreateMedicalServiceRequest {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  unit: string;
  duration: number;
  preparation?: string;
  notes?: string;
  indicators?: string[];
}

export interface UpdateMedicalServiceRequest {
  name?: string;
  description?: string;
  category?: ServiceCategory;
  price?: number;
  unit?: string;
  duration?: number;
  preparation?: string;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  indicators?: string[];
}

export interface ServiceFilters {
  search?: string;
  category?: ServiceCategory;
  status?: 'ACTIVE' | 'INACTIVE';
  priceFrom?: number;
  priceTo?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
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
