import { api } from '../axios';
import { 
  ServiceOrder, 
  CreateServiceOrderRequest, 
  UpdateServiceOrderRequest,
  MedicalService 
} from '@/types/service';

export const serviceOrderService = {
  // Get service orders for a visit
  async getServiceOrdersByVisit(visitId: string): Promise<ServiceOrder[]> {
    const response = await api.get(`/visits/${visitId}/service-orders`);
    return response.data;
  },

  // Create service order
  async createServiceOrder(visitId: string, data: CreateServiceOrderRequest): Promise<ServiceOrder> {
    const response = await api.post(`/visits/${visitId}/service-orders`, data);
    return response.data;
  },

  // Update service order
  async updateServiceOrder(visitId: string, orderId: string, data: UpdateServiceOrderRequest): Promise<ServiceOrder> {
    const response = await api.put(`/visits/${visitId}/service-orders/${orderId}`, data);
    return response.data;
  },

  // Delete service order
  async deleteServiceOrder(visitId: string, orderId: string): Promise<void> {
    await api.delete(`/visits/${visitId}/service-orders/${orderId}`);
  },

  // Get all medical services
  async getMedicalServices(): Promise<MedicalService[]> {
    const response = await api.get('/medical-services');
    return response.data;
  },

  // Get medical service by ID
  async getMedicalServiceById(id: string): Promise<MedicalService> {
    const response = await api.get(`/medical-services/${id}`);
    return response.data;
  },

  // Get service orders by status
  async getServiceOrdersByStatus(status: string): Promise<ServiceOrder[]> {
    const response = await api.get('/service-orders', { params: { status } });
    return response.data;
  },

  // Update service order status
  async updateServiceOrderStatus(visitId: string, orderId: string, status: string): Promise<ServiceOrder> {
    const response = await api.patch(`/visits/${visitId}/service-orders/${orderId}/status`, { status });
    return response.data;
  },
};
