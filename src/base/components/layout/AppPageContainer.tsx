'use client';

import React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

export interface AppPageContainerProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  spacing?: number;
  floatingAction?: React.ReactNode;
}

const AppPageContainer = ({
  children,
  sx,
  spacing = 3,
  floatingAction,
}: AppPageContainerProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        minHeight: '100%',
        bgcolor: (theme) =>
          `var(--app-page-surface, ${(theme.vars?.palette ?? theme.palette).action.hover})`,
        p: { xs: 2, md: 3, xl: 4 },
        pb: (theme) => ({
          xs: `calc(${theme.spacing(2)} + var(--app-bottom-navigation-space, 0px)${floatingAction ? ' + 72px' : ''})`,
          md: `calc(${theme.spacing(3)} + var(--app-bottom-navigation-space, 0px)${floatingAction ? ' + 72px' : ''})`,
          xl: `calc(${theme.spacing(4)} + var(--app-bottom-navigation-space, 0px)${floatingAction ? ' + 72px' : ''})`,
        }),
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2.5, sm: spacing },
        '&:has(> [data-page-error]:only-child)': {
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        },
        ...sx,
      }}
    >
      {children}
      {floatingAction}
    </Box>
  );
};

export default AppPageContainer;
