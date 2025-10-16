import React from 'react';
import { GridPagination } from './grid-pagination';
import { Skeleton } from './skeleton';
import { Alert, AlertDescription } from './alert';
import { AlertCircle } from 'lucide-react';

export interface PaginatedGridProps<T> {
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
  gridClassName?: string;
  itemClassName?: string;
  columns?: number;
  gap?: string;
  paginationVariant?: 'compact' | 'full';
}

export function PaginatedGrid<T>({
  data,
  renderItem,
  pagination,
  loading = false,
  error = null,
  emptyMessage = 'Không có dữ liệu',
  className,
  gridClassName,
  itemClassName,
  columns = 3,
  gap = '4',
  paginationVariant = 'full'
}: PaginatedGridProps<T>) {
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

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }[columns] || 'grid-cols-3';

  const gridGap = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }[gap] || 'gap-4';

  return (
    <div className={className}>
      {/* Grid content */}
      <div className={`grid ${gridCols} ${gridGap} ${gridClassName || ''}`}>
        {loading ? (
          // Loading skeleton
          Array.from({ length: pagination.pageSize }).map((_, index) => (
            <div key={index} className={itemClassName}>
              <Skeleton className="h-32 w-full" />
            </div>
          ))
        ) : data.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center py-8 text-muted-foreground">
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <GridPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          variant={paginationVariant}
          disabled={loading}
        />
      )}
    </div>
  );
}

export default PaginatedGrid;
