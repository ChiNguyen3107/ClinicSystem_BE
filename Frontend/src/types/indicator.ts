export interface Indicator {
  id: string;
  name: string;
  description?: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'CHECKBOX';
  unit?: string;
  normalRange?: {
    min: number;
    max: number;
    unit: string;
  };
  options?: string[];
  required: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIndicatorRequest {
  name: string;
  description?: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'CHECKBOX';
  unit?: string;
  normalRange?: {
    min: number;
    max: number;
    unit: string;
  };
  options?: string[];
  required: boolean;
}

export interface UpdateIndicatorRequest {
  name?: string;
  description?: string;
  type?: 'TEXT' | 'NUMBER' | 'SELECT' | 'CHECKBOX';
  unit?: string;
  normalRange?: {
    min: number;
    max: number;
    unit: string;
  };
  options?: string[];
  required?: boolean;
  isActive?: boolean;
}

export interface IndicatorFilters {
  search?: string;
  type?: 'TEXT' | 'NUMBER' | 'SELECT' | 'CHECKBOX';
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ServiceIndicatorMapping {
  id: string;
  serviceId: string;
  indicatorId: string;
  service: {
    id: string;
    name: string;
  };
  indicator: Indicator;
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceIndicatorMappingRequest {
  serviceId: string;
  indicatorId: string;
  isRequired: boolean;
  order?: number;
}

export interface UpdateServiceIndicatorMappingRequest {
  isRequired?: boolean;
  order?: number;
}
