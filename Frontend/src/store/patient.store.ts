import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Patient, PatientListParams } from '@/types/patient';
import { PatientService } from '@/api/services/patient.service';

interface PatientState {
  // Data
  patients: Patient[];
  selectedPatient: Patient | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  
  // Filters and search
  keyword: string;
  sortField: string;
  sortDirection: 'ASC' | 'DESC';
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Form state
  isFormOpen: boolean;
  isDetailOpen: boolean;
  isDeleteConfirmOpen: boolean;
  patientToDelete: Patient | null;
  
  // Actions
  setPatients: (patients: Patient[]) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setPagination: (data: { totalElements: number; totalPages: number; currentPage: number; pageSize: number }) => void;
  setKeyword: (keyword: string) => void;
  setSort: (field: string, direction: 'ASC' | 'DESC') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API actions
  fetchPatients: (params?: PatientListParams) => Promise<void>;
  
  // Form actions
  openForm: (patient?: Patient) => void;
  closeForm: () => void;
  openDetail: (patient: Patient) => void;
  closeDetail: () => void;
  openDeleteConfirm: (patient: Patient) => void;
  closeDeleteConfirm: () => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  patients: [],
  selectedPatient: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  keyword: '',
  sortField: 'createdAt',
  sortDirection: 'DESC' as const,
  loading: false,
  error: null,
  isFormOpen: false,
  isDetailOpen: false,
  isDeleteConfirmOpen: false,
  patientToDelete: null,
};

export const usePatientStore = create<PatientState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setPatients: (patients) => set({ patients }),
      
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),
      
      setPagination: (data) => set({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        pageSize: data.pageSize,
      }),
      
      setKeyword: (keyword) => set({ keyword }),
      
      setSort: (field, direction) => set({ 
        sortField: field, 
        sortDirection: direction 
      }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      fetchPatients: async (params) => {
        set({ loading: true, error: null });
        try {
          const response = await PatientService.getPatients(params);
          set({
            patients: response.content,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            currentPage: response.number,
            pageSize: response.size,
            loading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Lỗi khi tải danh sách bệnh nhân',
            loading: false
          });
        }
      },
      
      openForm: (patient) => set({ 
        isFormOpen: true, 
        selectedPatient: patient || null 
      }),
      
      closeForm: () => set({ 
        isFormOpen: false, 
        selectedPatient: null 
      }),
      
      openDetail: (patient) => set({ 
        isDetailOpen: true, 
        selectedPatient: patient 
      }),
      
      closeDetail: () => set({ 
        isDetailOpen: false, 
        selectedPatient: null 
      }),
      
      openDeleteConfirm: (patient) => set({ 
        isDeleteConfirmOpen: true, 
        patientToDelete: patient 
      }),
      
      closeDeleteConfirm: () => set({ 
        isDeleteConfirmOpen: false, 
        patientToDelete: null 
      }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'patient-store',
    }
  )
);

// Selectors for better performance
export const usePatientList = () => usePatientStore((state) => ({
  patients: state.patients,
  loading: state.loading,
  error: state.error,
  totalElements: state.totalElements,
  totalPages: state.totalPages,
  currentPage: state.currentPage,
  pageSize: state.pageSize,
}));

export const usePatientFilters = () => usePatientStore((state) => ({
  keyword: state.keyword,
  sortField: state.sortField,
  sortDirection: state.sortDirection,
}));

export const usePatientUI = () => usePatientStore((state) => ({
  isFormOpen: state.isFormOpen,
  isDetailOpen: state.isDetailOpen,
  isDeleteConfirmOpen: state.isDeleteConfirmOpen,
  selectedPatient: state.selectedPatient,
  patientToDelete: state.patientToDelete,
}));
