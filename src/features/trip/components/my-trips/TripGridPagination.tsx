'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('myTrips');

  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        p: 1.5,
        bgcolor: 'background.paper',
        borderRadius: 'var(--app-radius-card)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: '13px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {from} – {to}
        </Box>{' '}
        / {count} {t('tripsUnit')}
      </Typography>

      <AppPagination
        count={totalPages}
        page={page + 1}
        onChange={(_, newPage) => onPageChange(newPage - 1)}
        color="primary"
        shape="rounded"
        size="medium"
      />
    </Box>
  );
};

export default TripGridPagination;
