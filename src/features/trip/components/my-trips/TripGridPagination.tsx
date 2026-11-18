'use client';

import React from 'react';
import { AppPagination } from '@/base/components/ui';

export interface TripGridPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const TripGridPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: TripGridPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));

  return (
      <AppPagination
        count={totalPages}
        page={page + 1}
        onChange={(_, newPage) => onPageChange(newPage - 1)}
        color="primary"
        shape="rounded"
        size="small"
        sx={{ alignSelf: 'center' }}
      />
  );
};

export default TripGridPagination;
