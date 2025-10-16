import { axiosInstance } from '../axios';
import type {
  DiscountCode,
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
  PaginatedResponse,
  ApiResponse
} from '@/types';

export const discountService = {
  // Lấy danh sách mã giảm giá
  async getDiscountCodes(page = 0, size = 10, search?: string) {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (search) params.append('search', search);

    const response = await axiosInstance.get<PaginatedResponse<DiscountCode>>(
      `/discount-codes?${params.toString()}`
    );
    return response.data;
  },

  // Lấy chi tiết mã giảm giá
  async getDiscountCodeById(id: string) {
    const response = await axiosInstance.get<ApiResponse<DiscountCode>>(`/discount-codes/${id}`);
    return response.data;
  },

  // Tạo mã giảm giá mới
  async createDiscountCode(data: CreateDiscountCodeRequest) {
    const response = await axiosInstance.post<ApiResponse<DiscountCode>>('/discount-codes', data);
    return response.data;
  },

  // Cập nhật mã giảm giá
  async updateDiscountCode(id: string, data: UpdateDiscountCodeRequest) {
    const response = await axiosInstance.put<ApiResponse<DiscountCode>>(`/discount-codes/${id}`, data);
    return response.data;
  },

  // Xóa mã giảm giá
  async deleteDiscountCode(id: string) {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/discount-codes/${id}`);
    return response.data;
  },

  // Kích hoạt/vô hiệu hóa mã giảm giá
  async toggleDiscountCodeStatus(id: string, isActive: boolean) {
    const response = await axiosInstance.patch<ApiResponse<DiscountCode>>(
      `/discount-codes/${id}/status`,
      { isActive }
    );
    return response.data;
  },

  // Kiểm tra mã giảm giá
  async validateDiscountCode(code: string, orderAmount: number) {
    const response = await axiosInstance.post<ApiResponse<{
      isValid: boolean;
      discountAmount: number;
      message?: string;
    }>>('/discount-codes/validate', { code, orderAmount });
    return response.data;
  },

  // Lấy thống kê sử dụng mã giảm giá
  async getDiscountCodeStats(id: string) {
    const response = await axiosInstance.get<ApiResponse<{
      totalUsage: number;
      totalDiscount: number;
      usageByDate: Array<{ date: string; count: number; amount: number }>;
    }>>(`/discount-codes/${id}/stats`);
    return response.data;
  }
};
