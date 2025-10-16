// Export all API services
export { authService } from './auth.service';
export { patientService } from './patient.service';
export { doctorService } from './doctor.service';
export { appointmentService } from './appointment.service';
export { dashboardService } from './dashboard.service';

// Export API client and axios instance
export { apiClient, enhancedApi } from './client';
export { axiosInstance, default as api } from './axios';

// Export types
export type { ApiResponse, PaginatedResponse, ErrorResponse, ApiError, ValidationError } from '@/types';
