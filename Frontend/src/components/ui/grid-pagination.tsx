import React from 'react';
import { AdvancedPagination, PaginationProps } from './advanced-pagination';

export interface GridPaginationProps extends Omit<PaginationProps, 'className'> {
  className?: string;
  variant?: 'compact' | 'full';
}

export const GridPagination: React.FC<GridPaginationProps> = ({
  className,
  variant = 'full',
  ...props
}) => {
  if (variant === 'compact') {
    return (
      <div className={className}>
        <AdvancedPagination
          {...props}
          className="bg-muted/50 rounded-md p-2"
          showTotalInfo={false}
          showPageSizeSelector={false}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <AdvancedPagination
        {...props}
        className="bg-card border rounded-lg shadow-sm p-4"
        showTotalInfo={true}
        showPageSizeSelector={true}
      />
    </div>
  );
};

export default GridPagination;
