import { axios } from '../axios';
import { 
  MedicalService, 
  CreateMedicalServiceRequest, 
  UpdateMedicalServiceRequest,
  ServiceFilters,
  ServiceStats,
  BulkPriceUpdate,
  PriceHistory,
  PaginatedResponse
} from '../../types/service';

export const medicalServiceService = {
  // Get all services with filters and pagination
  getServices: async (filters?: ServiceFilters & { page?: number; size?: number }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priceFrom) params.append('priceFrom', filters.priceFrom.toString());
    if (filters?.priceTo) params.append('priceTo', filters.priceTo.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.size) params.append('size', filters.size.toString());

    const response = await axios.get<PaginatedResponse<MedicalService>>(
      `/medical-services?${params.toString()}`
    );
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id: string) => {
    const response = await axios.get<MedicalService>(`/medical-services/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (data: CreateMedicalServiceRequest) => {
    const response = await axios.post<MedicalService>('/medical-services', data);
    return response.data;
  },

  // Update service
  updateService: async (id: string, data: UpdateMedicalServiceRequest) => {
    const response = await axios.put<MedicalService>(`/medical-services/${id}`, data);
    return response.data;
  },

  // Delete service
  deleteService: async (id: string) => {
    await axios.delete(`/medical-services/${id}`);
  },

  // Get service statistics
  getServiceStats: async () => {
    const response = await axios.get<ServiceStats>('/medical-services/stats');
    return response.data;
  },

  // Get price history for a service
  getPriceHistory: async (serviceId: string) => {
    const response = await axios.get<PriceHistory[]>(`/medical-services/${serviceId}/price-history`);
    return response.data;
  },

  // Update service price
  updateServicePrice: async (serviceId: string, newPrice: number, effectiveDate: string, reason?: string) => {
    const response = await axios.post<PriceHistory>(`/medical-services/${serviceId}/price`, {
      newPrice,
      effectiveDate,
      reason
    });
    return response.data;
  },

  // Bulk update prices
  bulkUpdatePrices: async (updates: BulkPriceUpdate[]) => {
    const response = await axios.post<{ success: number; failed: number }>('/medical-services/bulk-price-update', {
      updates
    });
    return response.data;
  },

  // Get service indicators
  getServiceIndicators: async (serviceId: string) => {
    const response = await axios.get(`/medical-services/${serviceId}/indicators`);
    return response.data;
  },

  // Add indicator to service
  addServiceIndicator: async (serviceId: string, indicatorId: string, isRequired: boolean = false, order?: number) => {
    const response = await axios.post(`/medical-services/${serviceId}/indicators`, {
      indicatorId,
      isRequired,
      order
    });
    return response.data;
  },

  // Remove indicator from service
  removeServiceIndicator: async (serviceId: string, indicatorId: string) => {
    await axios.delete(`/medical-services/${serviceId}/indicators/${indicatorId}`);
  },

  // Update service indicator
  updateServiceIndicator: async (serviceId: string, indicatorId: string, isRequired: boolean, order?: number) => {
    const response = await axios.put(`/medical-services/${serviceId}/indicators/${indicatorId}`, {
      isRequired,
      order
    });
    return response.data;
  }
};
