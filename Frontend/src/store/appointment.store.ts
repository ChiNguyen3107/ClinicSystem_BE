import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Appointment, 
  AppointmentFilters, 
  AppointmentStats,
  AppointmentStatus,
  CreateAppointmentRequest,
  UpdateAppointmentRequest 
} from '@/types/appointment';
import { AppointmentService, AppointmentListResponse } from '@/api/services/appointment.service';

interface AppointmentState {
  // Data
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  stats: AppointmentStats | null;
  
  // Pagination
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  
  // Filters
  filters: AppointmentFilters;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  resetFilters: () => void;
  
  // CRUD operations
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>;
  fetchAppointmentById: (id: string) => Promise<void>;
  createAppointment: (data: CreateAppointmentRequest) => Promise<Appointment>;
  updateAppointment: (id: string, data: UpdateAppointmentRequest) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  
  // Status updates
  updateAppointmentStatus: (id: string, status: AppointmentStatus, reason?: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  cancelAppointment: (id: string, reason: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;
  markNoShow: (id: string) => Promise<void>;
  
  // Stats
  fetchStats: () => Promise<void>;
  
  // Calendar
  fetchAppointmentsByDateRange: (startDate: string, endDate: string, doctorId?: string) => Promise<Appointment[]>;
  
  // Utility
  clearError: () => void;
  reset: () => void;
}

const initialFilters: AppointmentFilters = {
  page: 0,
  size: 10
};

const initialState = {
  appointments: [],
  currentAppointment: null,
  stats: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  filters: initialFilters,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null
};

export const useAppointmentStore = create<AppointmentState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters, page: 0 }
        }));
      },

      resetFilters: () => {
        set({ filters: initialFilters });
      },

      fetchAppointments: async (filters) => {
        set({ isLoading: true, error: null });
        try {
          const currentFilters = filters || get().filters;
          const response = await AppointmentService.getAppointments(currentFilters);
          
          set({
            appointments: response.content,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            currentPage: response.number,
            pageSize: response.size,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi tải danh sách lịch hẹn',
            isLoading: false 
          });
        }
      },

      fetchAppointmentById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const appointment = await AppointmentService.getAppointmentById(id);
          set({ currentAppointment: appointment, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi tải chi tiết lịch hẹn',
            isLoading: false 
          });
        }
      },

      createAppointment: async (data) => {
        set({ isCreating: true, error: null });
        try {
          const newAppointment = await AppointmentService.createAppointment(data);
          
          set((state) => ({
            appointments: [newAppointment, ...state.appointments],
            isCreating: false
          }));
          
          return newAppointment;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi tạo lịch hẹn',
            isCreating: false 
          });
          throw error;
        }
      },

      updateAppointment: async (id, data) => {
        set({ isUpdating: true, error: null });
        try {
          const updatedAppointment = await AppointmentService.updateAppointment(id, data);
          
          set((state) => ({
            appointments: state.appointments.map(apt => 
              apt.id === id ? updatedAppointment : apt
            ),
            currentAppointment: state.currentAppointment?.id === id 
              ? updatedAppointment 
              : state.currentAppointment,
            isUpdating: false
          }));
          
          return updatedAppointment;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi cập nhật lịch hẹn',
            isUpdating: false 
          });
          throw error;
        }
      },

      deleteAppointment: async (id) => {
        set({ isDeleting: true, error: null });
        try {
          await AppointmentService.deleteAppointment(id);
          
          set((state) => ({
            appointments: state.appointments.filter(apt => apt.id !== id),
            currentAppointment: state.currentAppointment?.id === id 
              ? null 
              : state.currentAppointment,
            isDeleting: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi xóa lịch hẹn',
            isDeleting: false 
          });
          throw error;
        }
      },

      updateAppointmentStatus: async (id, status, reason) => {
        set({ isUpdating: true, error: null });
        try {
          const updatedAppointment = await AppointmentService.updateAppointmentStatus(id, status, reason);
          
          set((state) => ({
            appointments: state.appointments.map(apt => 
              apt.id === id ? updatedAppointment : apt
            ),
            currentAppointment: state.currentAppointment?.id === id 
              ? updatedAppointment 
              : state.currentAppointment,
            isUpdating: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi cập nhật trạng thái',
            isUpdating: false 
          });
          throw error;
        }
      },

      confirmAppointment: async (id) => {
        await get().updateAppointmentStatus(id, AppointmentStatus.CONFIRMED);
      },

      cancelAppointment: async (id, reason) => {
        await get().updateAppointmentStatus(id, AppointmentStatus.CANCELLED, reason);
      },

      completeAppointment: async (id) => {
        await get().updateAppointmentStatus(id, AppointmentStatus.COMPLETED);
      },

      markNoShow: async (id) => {
        await get().updateAppointmentStatus(id, AppointmentStatus.NO_SHOW);
      },

      fetchStats: async () => {
        try {
          const stats = await AppointmentService.getAppointmentStats();
          set({ stats });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi tải thống kê'
          });
        }
      },

      fetchAppointmentsByDateRange: async (startDate, endDate, doctorId) => {
        try {
          const appointments = await AppointmentService.getAppointmentsByDateRange(
            startDate, 
            endDate, 
            doctorId
          );
          return appointments;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Lỗi khi tải lịch hẹn theo khoảng thời gian'
          });
          return [];
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'appointment-store'
    }
  )
);
