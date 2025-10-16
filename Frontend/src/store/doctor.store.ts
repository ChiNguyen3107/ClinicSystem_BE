import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Doctor, 
  DoctorFilters, 
  DoctorListResponse, 
  DoctorStats,
  CreateDoctorRequest,
  UpdateDoctorRequest 
} from '../types/doctor';
import type { Schedule, WeeklySchedule } from '../types/schedule';
import { doctorService } from '../api/services/doctor.service';
import { doctorScheduleService } from '../api/services/doctorSchedule.service';

interface DoctorState {
  // Doctor list state
  doctors: Doctor[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: DoctorFilters;
  
  // Current doctor detail
  currentDoctor: Doctor | null;
  doctorStats: DoctorStats | null;
  doctorSchedules: Schedule[];
  weeklySchedule: WeeklySchedule | null;
  
  // Actions
  setFilters: (filters: Partial<DoctorFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  fetchDoctors: () => Promise<void>;
  fetchDoctorById: (id: string) => Promise<void>;
  fetchDoctorStats: (id: string) => Promise<void>;
  fetchDoctorSchedules: (doctorId: string) => Promise<void>;
  fetchWeeklySchedule: (doctorId: string, weekStart: string) => Promise<void>;
  createDoctor: (data: CreateDoctorRequest) => Promise<Doctor>;
  updateDoctor: (id: string, data: UpdateDoctorRequest) => Promise<Doctor>;
  deleteDoctor: (id: string) => Promise<void>;
  resetPassword: (id: string) => Promise<void>;
  createSchedule: (data: any) => Promise<Schedule>;
  updateSchedule: (id: string, data: any) => Promise<Schedule>;
  deleteSchedule: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentDoctor: () => void;
}

export const useDoctorStore = create<DoctorState>()(
  devtools(
    (set, get) => ({
      // Initial state
      doctors: [],
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10,
      loading: false,
      error: null,
      filters: {},
      currentDoctor: null,
      doctorStats: null,
      doctorSchedules: [],
      weeklySchedule: null,

      // Actions
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      setPage: (page) => set({ currentPage: page }),
      
      setPageSize: (size) => set({ pageSize: size, currentPage: 0 }),
      
      nextPage: () => set((state) => ({ 
        currentPage: Math.min(state.currentPage + 1, state.totalPages - 1) 
      })),
      
      previousPage: () => set((state) => ({ 
        currentPage: Math.max(state.currentPage - 1, 0) 
      })),
      
      firstPage: () => set({ currentPage: 0 }),
      
      lastPage: () => set((state) => ({ 
        currentPage: Math.max(0, state.totalPages - 1) 
      })),

      fetchDoctors: async () => {
        set({ loading: true, error: null });
        try {
          const { filters, currentPage, pageSize } = get();
          const requestFilters = {
            ...filters,
            page: currentPage,
            size: pageSize
          };
          const response = await doctorService.getDoctors(requestFilters);
          set({
            doctors: response.content,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            currentPage: response.number,
            pageSize: response.size,
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi tải danh sách bác sĩ',
            loading: false
          });
        }
      },

      fetchDoctorById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const doctor = await doctorService.getDoctorById(id);
          set({ currentDoctor: doctor, loading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi tải thông tin bác sĩ',
            loading: false
          });
        }
      },

      fetchDoctorStats: async (id: string) => {
        try {
          const stats = await doctorService.getDoctorStats(id);
          set({ doctorStats: stats });
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi tải thống kê bác sĩ'
          });
        }
      },

      fetchDoctorSchedules: async (doctorId: string) => {
        try {
          const schedules = await doctorScheduleService.getDoctorSchedules({ doctorId });
          set({ doctorSchedules: schedules });
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi tải lịch làm việc'
          });
        }
      },

      fetchWeeklySchedule: async (doctorId: string, weekStart: string) => {
        try {
          const weeklySchedule = await doctorScheduleService.getWeeklySchedule(doctorId, weekStart);
          set({ weeklySchedule });
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi tải lịch tuần'
          });
        }
      },

      createDoctor: async (data: CreateDoctorRequest) => {
        set({ loading: true, error: null });
        try {
          const newDoctor = await doctorService.createDoctor(data);
          set((state) => ({
            doctors: [newDoctor, ...state.doctors],
            loading: false
          }));
          return newDoctor;
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi tạo bác sĩ mới',
            loading: false
          });
          throw error;
        }
      },

      updateDoctor: async (id: string, data: UpdateDoctorRequest) => {
        set({ loading: true, error: null });
        try {
          const updatedDoctor = await doctorService.updateDoctor(id, data);
          set((state) => ({
            doctors: state.doctors.map(doctor => 
              doctor.id === id ? updatedDoctor : doctor
            ),
            currentDoctor: state.currentDoctor?.id === id ? updatedDoctor : state.currentDoctor,
            loading: false
          }));
          return updatedDoctor;
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi cập nhật bác sĩ',
            loading: false
          });
          throw error;
        }
      },

      deleteDoctor: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await doctorService.deleteDoctor(id);
          set((state) => ({
            doctors: state.doctors.filter(doctor => doctor.id !== id),
            loading: false
          }));
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi xóa bác sĩ',
            loading: false
          });
          throw error;
        }
      },

      resetPassword: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await doctorService.resetPassword(id);
          set({ loading: false });
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi reset mật khẩu',
            loading: false
          });
          throw error;
        }
      },

      createSchedule: async (data: any) => {
        set({ loading: true, error: null });
        try {
          const newSchedule = await doctorScheduleService.createSchedule(data);
          set((state) => ({
            doctorSchedules: [...state.doctorSchedules, newSchedule],
            loading: false
          }));
          return newSchedule;
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi tạo lịch làm việc',
            loading: false
          });
          throw error;
        }
      },

      updateSchedule: async (id: string, data: any) => {
        set({ loading: true, error: null });
        try {
          const updatedSchedule = await doctorScheduleService.updateSchedule(id, data);
          set((state) => ({
            doctorSchedules: state.doctorSchedules.map(schedule => 
              schedule.id === id ? updatedSchedule : schedule
            ),
            loading: false
          }));
          return updatedSchedule;
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi cập nhật lịch làm việc',
            loading: false
          });
          throw error;
        }
      },

      deleteSchedule: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await doctorScheduleService.deleteSchedule(id);
          set((state) => ({
            doctorSchedules: state.doctorSchedules.filter(schedule => schedule.id !== id),
            loading: false
          }));
        } catch (error: any) {
          set({
            error: error.message || 'Có lỗi xảy ra khi xóa lịch làm việc',
            loading: false
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      clearCurrentDoctor: () => set({ 
        currentDoctor: null, 
        doctorStats: null, 
        doctorSchedules: [], 
        weeklySchedule: null 
      })
    }),
    { name: 'doctor-store' }
  )
);
