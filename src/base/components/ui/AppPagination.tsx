'use client';

import { Pagination, useMediaQuery, type PaginationProps } from '@mui/material';

const AppPagination = ({
  sx,
  siblingCount,
  showFirstButton,
  showLastButton,
  ...props
}: PaginationProps) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <Pagination
      {...props}
      siblingCount={siblingCount ?? (isMobile ? 0 : 1)}
      showFirstButton={showFirstButton ?? !isMobile}
      showLastButton={showLastButton ?? !isMobile}
      sx={[
        {
          maxWidth: '100%',
          '& .MuiPagination-ul': { gap: 0.5, justifyContent: 'center' },
          '& .MuiPaginationItem-root': {
            minWidth: 32,
            height: { xs: 44, sm: 32 },
            margin: 0,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
};

export default AppPagination;
