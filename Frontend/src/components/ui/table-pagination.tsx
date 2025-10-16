import React from 'react';
import { AdvancedPagination, PaginationProps } from './advanced-pagination';

export interface TablePaginationProps extends Omit<PaginationProps, 'className'> {
  className?: string;
  sticky?: boolean;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  className,
  sticky = false,
  ...props
}) => {
  return (
    <div className={`${sticky ? 'sticky bottom-0 bg-background border-t' : ''} ${className || ''}`}>
      <AdvancedPagination
        {...props}
        className="border-0"
        showTotalInfo={true}
        showPageSizeSelector={true}
      />
    </div>
  );
};

export default TablePagination;
