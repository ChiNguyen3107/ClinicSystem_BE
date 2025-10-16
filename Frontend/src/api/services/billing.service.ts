import { axiosInstance } from '../axios';
import type {
  Billing,
  BillingStatistics,
  BillingFilters,
  CreateBillingRequest,
  UpdateBillingRequest,
  ProcessPaymentRequest,
  BillingExportOptions,
  PaginatedResponse,
  ApiResponse
} from '@/types';

export const billingService = {
  // Lấy danh sách hóa đơn
  async getBillings(filters?: BillingFilters, page = 0, size = 10) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.search) params.append('search', filters.search);
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await axiosInstance.get<PaginatedResponse<Billing>>(
      `/billings?${params.toString()}`
    );
    return response.data;
  },

  // Lấy chi tiết hóa đơn
  async getBillingById(id: string) {
    const response = await axiosInstance.get<ApiResponse<Billing>>(`/billings/${id}`);
    return response.data;
  },

  // Tạo hóa đơn mới
  async createBilling(data: CreateBillingRequest) {
    const response = await axiosInstance.post<ApiResponse<Billing>>('/billings', data);
    return response.data;
  },

  // Cập nhật hóa đơn
  async updateBilling(id: string, data: UpdateBillingRequest) {
    const response = await axiosInstance.put<ApiResponse<Billing>>(`/billings/${id}`, data);
    return response.data;
  },

  // Xóa hóa đơn
  async deleteBilling(id: string) {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/billings/${id}`);
    return response.data;
  },

  // Xử lý thanh toán
  async processPayment(data: ProcessPaymentRequest) {
    const response = await axiosInstance.post<ApiResponse<Billing>>(
      `/billings/${data.billingId}/payment`,
      data
    );
    return response.data;
  },

  // Lấy thống kê hóa đơn
  async getBillingStatistics(period?: 'daily' | 'weekly' | 'monthly') {
    const params = period ? `?period=${period}` : '';
    const response = await axiosInstance.get<ApiResponse<BillingStatistics>>(
      `/billings/statistics${params}`
    );
    return response.data;
  },

  // Xuất báo cáo
  async exportBillings(options: BillingExportOptions) {
    const params = new URLSearchParams();
    params.append('format', options.format);
    if (options.dateFrom) params.append('dateFrom', options.dateFrom);
    if (options.dateTo) params.append('dateTo', options.dateTo);
    if (options.status?.length) {
      options.status.forEach(status => params.append('status', status));
    }
    if (options.paymentMethod?.length) {
      options.paymentMethod.forEach(method => params.append('paymentMethod', method));
    }

    const response = await axiosInstance.get(`/billings/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Gửi hóa đơn qua email
  async sendInvoiceByEmail(billingId: string, email: string) {
    const response = await axiosInstance.post<ApiResponse<void>>(
      `/billings/${billingId}/send-email`,
      { email }
    );
    return response.data;
  },

  // In hóa đơn
  async printInvoice(billingId: string) {
    const response = await axiosInstance.get(`/billings/${billingId}/print`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
