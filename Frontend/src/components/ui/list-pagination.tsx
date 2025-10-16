import React from 'react';
import { AdvancedPagination, PaginationProps } from './advanced-pagination';

export interface ListPaginationProps extends Omit<PaginationProps, 'className'> {
  className?: string;
  position?: 'top' | 'bottom' | 'both';
}

export const ListPagination: React.FC<ListPaginationProps> = ({
  className,
  position = 'bottom',
  ...props
}) => {
  const paginationComponent = (
    <AdvancedPagination
      {...props}
      className="bg-card border rounded-lg shadow-sm"
      showTotalInfo={true}
      showPageSizeSelector={true}
    />
  );

  if (position === 'top') {
    return <div className={className}>{paginationComponent}</div>;
  }

  if (position === 'bottom') {
    return <div className={className}>{paginationComponent}</div>;
  }

  return (
    <div className={className}>
      <div className="mb-4">{paginationComponent}</div>
      <div className="mt-4">{paginationComponent}</div>
    </div>
  );
};

export default ListPagination;
