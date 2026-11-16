'use client';

import { Pagination, useMediaQuery, type PaginationProps } from '@mui/material';

const AppPagination = ({
  sx,
  siblingCount,
  boundaryCount,
  showFirstButton = false,
  showLastButton = false,
  ...props
}: PaginationProps) => {
  const isCompact = useMediaQuery((theme) => theme.breakpoints.down(420));
  const isNarrow = useMediaQuery((theme) => theme.breakpoints.down(360));
  return (
    <Pagination
      {...props}
      siblingCount={siblingCount ?? 0}
      boundaryCount={boundaryCount ?? (isNarrow ? 0 : isCompact ? 1 : 2)}
      showFirstButton={showFirstButton}
      showLastButton={showLastButton}
      sx={[
        (theme) => {
          const palette = theme.vars?.palette ?? theme.palette;
          return {
            maxWidth: '100%',
            '& .MuiPagination-ul': { gap: { xs: 0.5, sm: 0.75 }, justifyContent: 'center' },
            '& .MuiPaginationItem-root': {
              minWidth: 44,
              height: 44,
              margin: 0,
              p: 0,
              borderRadius: 'var(--app-radius-small)',
              border: `1px solid ${palette.divider}`,
              backgroundColor: palette.background.paper,
              color: palette.text.primary,
              fontSize: '14px',
              fontWeight: 700,
              '&:hover': { backgroundColor: palette.action.hover },
              '&:active': { backgroundColor: palette.action.selected },
              '&.Mui-focusVisible': {
                outline: `2px solid ${palette.primary.main}`,
                outlineOffset: 2,
              },
              '&.Mui-selected': {
                backgroundColor: palette.background.paper,
                color: palette.primary.main,
                border: `2px solid ${palette.primary.main}`,
                boxShadow: 'none',
                '&:hover': { backgroundColor: palette.action.hover },
                '&:active': { backgroundColor: palette.action.selected },
              },
              '&.Mui-disabled': {
                opacity: 1,
                backgroundColor: palette.action.disabledBackground,
                color: palette.action.disabled,
                borderColor: 'transparent',
              },
            },
            '& .MuiPaginationItem-icon': { fontSize: 20 },
            '& .MuiPaginationItem-ellipsis': {
              minWidth: 16,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0,
              border: 0,
              backgroundColor: 'transparent',
            },
          };
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
};

export default AppPagination;
