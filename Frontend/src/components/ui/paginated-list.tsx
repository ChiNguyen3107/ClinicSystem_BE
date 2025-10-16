import React from 'react';
import { ListPagination } from './list-pagination';
import { Skeleton } from './skeleton';
import { Alert, AlertDescription } from './alert';
import { AlertCircle } from 'lucide-react';

export interface PaginatedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
  itemClassName?: string;
  paginationPosition?: 'top' | 'bottom' | 'both';
  showPaginationOnTop?: boolean;
}

export function PaginatedList<T>({
  data,
  renderItem,
  pagination,
  loading = false,
  error = null,
  emptyMessage = 'Không có dữ liệu',
  className,
  itemClassName,
  paginationPosition = 'bottom',
  showPaginationOnTop = false
}: PaginatedListProps<T>) {
  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const shouldShowPagination = pagination.totalPages > 1;
  const showTopPagination = shouldShowPagination && (paginationPosition === 'top' || paginationPosition === 'both' || showPaginationOnTop);
  const showBottomPagination = shouldShowPagination && (paginationPosition === 'bottom' || paginationPosition === 'both');

  return (
    <div className={className}>
      {/* Top pagination */}
      {showTopPagination && (
        <ListPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          position="top"
          disabled={loading}
        />
      )}

      {/* Content */}
      <div className="space-y-2">
        {loading ? (
          // Loading skeleton
          Array.from({ length: pagination.pageSize }).map((_, index) => (
            <div key={index} className={itemClassName}>
              <Skeleton className="h-16 w-full" />
            </div>
          ))
        ) : data.length === 0 ? (
          // Empty state
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          // Data items
          data.map((item, index) => (
            <div key={index} className={itemClassName}>
              {renderItem(item, index)}
            </div>
          ))
        )}
      </div>

      {/* Bottom pagination */}
      {showBottomPagination && (
        <ListPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          position="bottom"
          disabled={loading}
        />
      )}
    </div>
  );
}

export default PaginatedList;
