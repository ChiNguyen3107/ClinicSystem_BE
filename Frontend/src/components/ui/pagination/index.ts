// Core pagination components
export { AdvancedPagination } from '../advanced-pagination';
export { TablePagination } from '../table-pagination';
export { ListPagination } from '../list-pagination';
export { GridPagination } from '../grid-pagination';

// Paginated data components
export { PaginatedTable } from '../paginated-table';
export { PaginatedList } from '../paginated-list';
export { PaginatedGrid } from '../paginated-grid';

// Hooks
export { usePagination } from '../../../hooks/usePagination';
export { 
  usePaginatedPatients, 
  usePaginatedDoctors, 
  usePaginatedAppointments 
} from '../../../hooks/usePaginatedData';

// Types
export type { PaginationProps } from '../advanced-pagination';
export type { TablePaginationProps } from '../table-pagination';
export type { ListPaginationProps } from '../list-pagination';
export type { GridPaginationProps } from '../grid-pagination';
