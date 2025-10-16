import { axios } from '../axios';
import { 
  Indicator, 
  CreateIndicatorRequest, 
  UpdateIndicatorRequest,
  IndicatorFilters,
  ServiceIndicatorMapping,
  CreateServiceIndicatorMappingRequest,
  UpdateServiceIndicatorMappingRequest,
  PaginatedResponse
} from '../../types/indicator';

export const indicatorService = {
  // Get all indicators with filters and pagination
  getIndicators: async (filters?: IndicatorFilters & { page?: number; size?: number }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.size) params.append('size', filters.size.toString());

    const response = await axios.get<PaginatedResponse<Indicator>>(
      `/service-indicators?${params.toString()}`
    );
    return response.data;
  },

  // Get indicator by ID
  getIndicatorById: async (id: string) => {
    const response = await axios.get<Indicator>(`/service-indicators/${id}`);
    return response.data;
  },

  // Create new indicator
  createIndicator: async (data: CreateIndicatorRequest) => {
    const response = await axios.post<Indicator>('/service-indicators', data);
    return response.data;
  },

  // Update indicator
  updateIndicator: async (id: string, data: UpdateIndicatorRequest) => {
    const response = await axios.put<Indicator>(`/service-indicators/${id}`, data);
    return response.data;
  },

  // Delete indicator
  deleteIndicator: async (id: string) => {
    await axios.delete(`/service-indicators/${id}`);
  },

  // Get service-indicator mappings
  getServiceIndicatorMappings: async (serviceId?: string) => {
    const params = serviceId ? `?serviceId=${serviceId}` : '';
    const response = await axios.get<ServiceIndicatorMapping[]>(`/service-indicators/mappings${params}`);
    return response.data;
  },

  // Create service-indicator mapping
  createServiceIndicatorMapping: async (data: CreateServiceIndicatorMappingRequest) => {
    const response = await axios.post<ServiceIndicatorMapping>('/service-indicators/mappings', data);
    return response.data;
  },

  // Update service-indicator mapping
  updateServiceIndicatorMapping: async (id: string, data: UpdateServiceIndicatorMappingRequest) => {
    const response = await axios.put<ServiceIndicatorMapping>(`/service-indicators/mappings/${id}`, data);
    return response.data;
  },

  // Delete service-indicator mapping
  deleteServiceIndicatorMapping: async (id: string) => {
    await axios.delete(`/service-indicators/mappings/${id}`);
  }
};
