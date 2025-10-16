import { useEffect } from 'react';
import { usePatientStore } from '@/store/patient.store';
import { useDoctorStore } from '@/store/doctor.store';
import { useAppointmentStore } from '@/store/appointment.store';

export interface UsePaginatedDataOptions {
  autoFetch?: boolean;
  onPageChange?: () => void;
  onPageSizeChange?: () => void;
}

// Hook for patient data
export const usePaginatedPatients = (options: UsePaginatedDataOptions = {}) => {
  const {
    patients,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    fetchPatients
  } = usePatientStore();

  const { autoFetch = true, onPageChange, onPageSizeChange } = options;

  useEffect(() => {
    if (autoFetch) {
      fetchPatients();
    }
  }, [autoFetch, fetchPatients]);

  const handlePageChange = (page: number) => {
    setPage(page);
    fetchPatients();
    onPageChange?.();
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    fetchPatients();
    onPageSizeChange?.();
  };

  return {
    data: patients,
    pagination: {
      currentPage,
      totalPages,
      totalElements,
      pageSize,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange
    },
    loading,
    error,
    actions: {
      nextPage: () => {
        nextPage();
        fetchPatients();
        onPageChange?.();
      },
      previousPage: () => {
        previousPage();
        fetchPatients();
        onPageChange?.();
      },
      firstPage: () => {
        firstPage();
        fetchPatients();
        onPageChange?.();
      },
      lastPage: () => {
        lastPage();
        fetchPatients();
        onPageChange?.();
      },
      refresh: () => fetchPatients()
    }
  };
};

// Hook for doctor data
export const usePaginatedDoctors = (options: UsePaginatedDataOptions = {}) => {
  const {
    doctors,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    fetchDoctors
  } = useDoctorStore();

  const { autoFetch = true, onPageChange, onPageSizeChange } = options;

  useEffect(() => {
    if (autoFetch) {
      fetchDoctors();
    }
  }, [autoFetch, fetchDoctors]);

  const handlePageChange = (page: number) => {
    setPage(page);
    fetchDoctors();
    onPageChange?.();
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    fetchDoctors();
    onPageSizeChange?.();
  };

  return {
    data: doctors,
    pagination: {
      currentPage,
      totalPages,
      totalElements,
      pageSize,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange
    },
    loading,
    error,
    actions: {
      nextPage: () => {
        nextPage();
        fetchDoctors();
        onPageChange?.();
      },
      previousPage: () => {
        previousPage();
        fetchDoctors();
        onPageChange?.();
      },
      firstPage: () => {
        firstPage();
        fetchDoctors();
        onPageChange?.();
      },
      lastPage: () => {
        lastPage();
        fetchDoctors();
        onPageChange?.();
      },
      refresh: () => fetchDoctors()
    }
  };
};

// Hook for appointment data
export const usePaginatedAppointments = (options: UsePaginatedDataOptions = {}) => {
  const {
    appointments,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    isLoading: loading,
    error,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    fetchAppointments
  } = useAppointmentStore();

  const { autoFetch = true, onPageChange, onPageSizeChange } = options;

  useEffect(() => {
    if (autoFetch) {
      fetchAppointments();
    }
  }, [autoFetch, fetchAppointments]);

  const handlePageChange = (page: number) => {
    setPage(page);
    fetchAppointments();
    onPageChange?.();
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    fetchAppointments();
    onPageSizeChange?.();
  };

  return {
    data: appointments,
    pagination: {
      currentPage,
      totalPages,
      totalElements,
      pageSize,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange
    },
    loading,
    error,
    actions: {
      nextPage: () => {
        nextPage();
        fetchAppointments();
        onPageChange?.();
      },
      previousPage: () => {
        previousPage();
        fetchAppointments();
        onPageChange?.();
      },
      firstPage: () => {
        firstPage();
        fetchAppointments();
        onPageChange?.();
      },
      lastPage: () => {
        lastPage();
        fetchAppointments();
        onPageChange?.();
      },
      refresh: () => fetchAppointments()
    }
  };
};

export default {
  usePaginatedPatients,
  usePaginatedDoctors,
  usePaginatedAppointments
};
