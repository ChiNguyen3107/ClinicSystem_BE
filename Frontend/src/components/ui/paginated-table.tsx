import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { TablePagination } from './table-pagination';
import { Skeleton } from './skeleton';
import { Alert, AlertDescription } from './alert';
import { AlertCircle } from 'lucide-react';

export interface PaginatedTableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (value: any, item: T, index: number) => React.ReactNode;
    className?: string;
  }[];
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
  stickyPagination?: boolean;
}

export function PaginatedTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  loading = false,
  error = null,
  emptyMessage = 'Không có dữ liệu',
  className,
  stickyPagination = false
}: PaginatedTableProps<T>) {
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

  return (
    <div className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <div className="text-muted-foreground">{emptyMessage}</div>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => {
                    const value = typeof column.key === 'string' 
                      ? column.key.split('.').reduce((obj, key) => obj?.[key], item)
                      : item[column.key];
                    
                    return (
                      <TableCell key={colIndex} className={column.className}>
                        {column.render ? column.render(value, item, index) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pagination.totalPages > 1 && (
        <TablePagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalElements={pagination.totalElements}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          sticky={stickyPagination}
          disabled={loading}
        />
      )}
    </div>
  );
}

export default PaginatedTable;
