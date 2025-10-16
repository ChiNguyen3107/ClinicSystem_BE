import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Badge } from './badge';
import { LiveTable as LiveTableType, LiveTableRow } from '@/hooks/useLiveData';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/utils/cn';

interface LiveTableProps {
  table: LiveTableType;
  maxRows?: number;
  showStatus?: boolean;
  className?: string;
}

export const LiveTable: React.FC<LiveTableProps> = ({
  table,
  maxRows = 10,
  showStatus = true,
  className
}) => {
  const displayRows = useMemo(() => {
    return table.rows.slice(0, maxRows);
  }, [table.rows, maxRows]);

  const formatCellValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';

    switch (type) {
      case 'date':
        return format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: vi });
      case 'number':
        return new Intl.NumberFormat('vi-VN').format(value);
      case 'status':
        return (
          <Badge 
            variant={value === 'active' || value === 'success' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {value}
          </Badge>
        );
      default:
        return String(value);
    }
  };

  const getRowStatusColor = (status?: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-50 border-green-200';
      case 'updated':
        return 'bg-blue-50 border-blue-200';
      case 'removed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (table.rows.length === 0) {
    return (
      <div className={cn('bg-white rounded-lg border p-8 text-center', className)}>
        <div className="text-gray-500">
          <div className="text-sm">Đang chờ dữ liệu...</div>
          <div className="text-xs mt-1">Bảng sẽ hiển thị khi có dữ liệu</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg border', className)}>
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-900">
          {table.id}
        </h3>
        <p className="text-xs text-gray-500">
          {table.rows.length} bản ghi • Cập nhật real-time
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((column) => (
                <TableHead key={column.key} className="text-xs font-medium">
                  {column.label}
                </TableHead>
              ))}
              {showStatus && (
                <TableHead className="text-xs font-medium w-20">
                  Trạng thái
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((row, index) => (
              <TableRow
                key={row.id}
                className={cn(
                  'transition-all duration-200',
                  getRowStatusColor(row.status)
                )}
              >
                {table.columns.map((column) => (
                  <TableCell key={column.key} className="text-sm">
                    {formatCellValue(row.data[column.key], column.type)}
                  </TableCell>
                ))}
                {showStatus && (
                  <TableCell className="text-xs">
                    {row.status && (
                      <Badge 
                        variant={
                          row.status === 'new' ? 'default' :
                          row.status === 'updated' ? 'secondary' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {row.status === 'new' ? 'Mới' :
                         row.status === 'updated' ? 'Cập nhật' : 'Xóa'}
                      </Badge>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {table.rows.length > maxRows && (
        <div className="p-3 border-t bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            Hiển thị {maxRows} trong {table.rows.length} bản ghi
          </p>
        </div>
      )}
    </div>
  );
};
