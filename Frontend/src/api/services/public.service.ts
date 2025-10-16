import { api } from '../axios';
import {
  PublicDoctor,
  PublicService,
  BookingRequest,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingFilters,
  BookingListResponse,
  Rating,
  CreateRatingRequest,
  UpdateRatingRequest,
  RatingStats,
  PaymentRequest,
  PaymentResponse,
  ClinicInfo
} from '@/types/public';

// Clinic Info
export const getClinicInfo = async (): Promise<ClinicInfo> => {
  const response = await api.get('/public/clinic-info');
  return response.data;
};

// Doctors
export const getPublicDoctors = async (params?: {
  specialty?: string;
  search?: string;
  available?: boolean;
  page?: number;
  size?: number;
}): Promise<{ content: PublicDoctor[]; totalElements: number; totalPages: number }> => {
  const response = await api.get('/public/doctors', { params });
  return response.data;
};

export const getPublicDoctor = async (id: string): Promise<PublicDoctor> => {
  const response = await api.get(`/public/doctors/${id}`);
  return response.data;
};

export const getDoctorSchedule = async (doctorId: string, date?: string): Promise<{
  availableSlots: string[];
  schedule: any[];
}> => {
  const response = await api.get(`/public/doctors/${doctorId}/schedule`, {
    params: { date }
  });
  return response.data;
};

// Services
export const getPublicServices = async (params?: {
  category?: string;
  search?: string;
  available?: boolean;
  page?: number;
  size?: number;
}): Promise<{ content: PublicService[]; totalElements: number; totalPages: number }> => {
  const response = await api.get('/public/services', { params });
  return response.data;
};

export const getPublicService = async (id: string): Promise<PublicService> => {
  const response = await api.get(`/public/services/${id}`);
  return response.data;
};

// Bookings
export const createBooking = async (data: CreateBookingRequest): Promise<BookingRequest> => {
  const response = await api.post('/public/bookings', data);
  return response.data;
};

export const getBooking = async (id: string): Promise<BookingRequest> => {
  const response = await api.get(`/public/bookings/${id}`);
  return response.data;
};

export const updateBooking = async (id: string, data: UpdateBookingRequest): Promise<BookingRequest> => {
  const response = await api.put(`/public/bookings/${id}`, data);
  return response.data;
};

export const cancelBooking = async (id: string, reason?: string): Promise<BookingRequest> => {
  const response = await api.post(`/public/bookings/${id}/cancel`, { reason });
  return response.data;
};

export const getBookings = async (params?: BookingFilters): Promise<BookingListResponse> => {
  const response = await api.get('/public/bookings', { params });
  return response.data;
};

export const getBookingByPhone = async (phone: string): Promise<BookingRequest[]> => {
  const response = await api.get(`/public/bookings/phone/${phone}`);
  return response.data;
};

// Ratings
export const createRating = async (data: CreateRatingRequest): Promise<Rating> => {
  const response = await api.post('/public/ratings', data);
  return response.data;
};

export const updateRating = async (id: string, data: UpdateRatingRequest): Promise<Rating> => {
  const response = await api.put(`/public/ratings/${id}`, data);
  return response.data;
};

export const deleteRating = async (id: string): Promise<void> => {
  await api.delete(`/public/ratings/${id}`);
};

export const getDoctorRatings = async (doctorId: string, params?: {
  page?: number;
  size?: number;
}): Promise<{ content: Rating[]; totalElements: number; totalPages: number }> => {
  const response = await api.get(`/public/doctors/${doctorId}/ratings`, { params });
  return response.data;
};

export const getDoctorRatingStats = async (doctorId: string): Promise<RatingStats> => {
  const response = await api.get(`/public/doctors/${doctorId}/rating-stats`);
  return response.data;
};

// Payment
export const createPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
  const response = await api.post('/public/payments', data);
  return response.data;
};

export const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  const response = await api.get(`/public/payments/${paymentId}/status`);
  return response.data;
};

// Notifications (stub)
export const sendBookingConfirmation = async (bookingId: string): Promise<void> => {
  await api.post(`/public/notifications/booking-confirmation`, { bookingId });
};

export const sendBookingReminder = async (bookingId: string): Promise<void> => {
  await api.post(`/public/notifications/booking-reminder`, { bookingId });
};

export const sendBookingCancellation = async (bookingId: string, reason?: string): Promise<void> => {
  await api.post(`/public/notifications/booking-cancellation`, { bookingId, reason });
};
