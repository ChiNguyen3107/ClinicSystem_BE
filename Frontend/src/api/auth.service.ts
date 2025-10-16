import { apiClient } from './client';
import { LoginRequest, LoginResponse, RegisterRequest, User, ApiResponse } from '@/types';

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post<void>('/auth/logout');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post<void>('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post<void>('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post<void>('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post<void>('/auth/resend-verification', { email });
  },

  // Update profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', userData);
    return response.data;
  },

  // Change email
  changeEmail: async (newEmail: string, password: string): Promise<void> => {
    await apiClient.post<void>('/auth/change-email', {
      newEmail,
      password,
    });
  },

  // Get user sessions
  getSessions: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/auth/sessions');
    return response.data;
  },

  // Revoke session
  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete<void>(`/auth/sessions/${sessionId}`);
  },

  // Revoke all sessions
  revokeAllSessions: async (): Promise<void> => {
    await apiClient.delete<void>('/auth/sessions');
  },
};
