import { useState, useCallback, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalElements: (total: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  reset: () => void;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  maxPageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const {
    initialPage = 0,
    initialPageSize = 10,
    maxPageSize = 100,
    onPageChange,
    onPageSizeChange
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalElements, setTotalElements] = useState(0);

  const totalPages = useMemo(() => {
    return Math.ceil(totalElements / pageSize);
  }, [totalElements, pageSize]);

  const setPage = useCallback((page: number) => {
    const newPage = Math.max(0, Math.min(page, totalPages - 1));
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  const setPageSize = useCallback((size: number) => {
    const newSize = Math.min(Math.max(1, size), maxPageSize);
    if (newSize !== pageSize) {
      setPageSize(newSize);
      // Reset to first page when page size changes
      setCurrentPage(0);
      onPageSizeChange?.(newSize);
    }
  }, [pageSize, maxPageSize, onPageSizeChange]);

  const setTotalElements = useCallback((total: number) => {
    setTotalElements(total);
    // Adjust current page if it's beyond the new total
    const newTotalPages = Math.ceil(total / pageSize);
    if (currentPage >= newTotalPages) {
      setCurrentPage(Math.max(0, newTotalPages - 1));
    }
  }, [currentPage, pageSize]);

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const previousPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const firstPage = useCallback(() => {
    setPage(0);
  }, [setPage]);

  const lastPage = useCallback(() => {
    setPage(totalPages - 1);
  }, [totalPages, setPage]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setTotalElements(0);
  }, [initialPage, initialPageSize]);

  const paginationState: PaginationState = {
    currentPage,
    pageSize,
    totalElements,
    totalPages
  };

  const paginationActions: PaginationActions = {
    setPage,
    setPageSize,
    setTotalElements,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    reset
  };

  return {
    ...paginationState,
    ...paginationActions
  };
};

export default usePagination;
