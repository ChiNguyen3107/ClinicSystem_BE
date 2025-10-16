import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';

// Retry configuration
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

// Circuit breaker configuration
interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

// Circuit breaker state
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

// Create circuit breaker instance
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  monitoringPeriod: 60000, // 1 minute
});

// Retry configuration
const retryConfig: RetryConfig = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx status codes
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }
};

// Exponential backoff delay calculation
const getRetryDelay = (attempt: number, baseDelay: number): number => {
  return Math.min(baseDelay * Math.pow(2, attempt), 10000); // Max 10 seconds
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const authStore = useAuthStore.getState();
    const token = authStore.accessToken;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry mechanism and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };
    
    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const authStore = useAuthStore.getState();
        const refreshToken = authStore.refreshToken;
        
        if (refreshToken) {
          const response = await axios.post('/api/v1/auth/refresh', {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          authStore.setTokens(accessToken, newRefreshToken);
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Retry mechanism for eligible errors
    if (originalRequest._retryCount === undefined) {
      originalRequest._retryCount = 0;
    }
    
    if (
      originalRequest._retryCount < retryConfig.retries &&
      retryConfig.retryCondition?.(error)
    ) {
      originalRequest._retryCount++;
      
      const delay = getRetryDelay(originalRequest._retryCount, retryConfig.retryDelay);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Wrapper function with circuit breaker
const apiWithCircuitBreaker = async <T>(request: () => Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> => {
  return circuitBreaker.execute(request);
};

// Enhanced API methods with circuit breaker
export const enhancedApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiWithCircuitBreaker<T>(() => api.get<T>(url, config)),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiWithCircuitBreaker<T>(() => api.post<T>(url, data, config)),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiWithCircuitBreaker<T>(() => api.put<T>(url, data, config)),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiWithCircuitBreaker<T>(() => api.patch<T>(url, data, config)),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiWithCircuitBreaker<T>(() => api.delete<T>(url, config)),
};

export const axiosInstance = api;
export default api;
