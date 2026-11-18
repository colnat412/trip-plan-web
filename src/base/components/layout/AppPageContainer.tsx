'use client';

import React from 'react';
import { contentColumn } from '@/base/theme/content-layout';
import { Box, type SxProps, type Theme } from '@mui/material';

export interface AppPageContainerProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  spacing?: number;
  floatingAction?: React.ReactNode;
  embedded?: boolean;
}

const AppPageContainer = ({
  children,
  sx,
  spacing = 3,
  floatingAction,
  embedded = false,
}: AppPageContainerProps) => {
  return (
    <Box
      sx={{
        ...contentColumn,
        width: '100%',
        // The shell/section owns the canvas; nested containers stay transparent.
        bgcolor: 'transparent',
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
        ...(embedded && {
          p: 0,
          // 56px action + 16px bottom offset + 16px clearance, including safe area/navigation.
          pb: floatingAction ? 'calc(88px + var(--app-bottom-navigation-space, 0px))' : 0,
          minHeight: 0,
          flex: 1,
          bgcolor: 'transparent',
        }),
        ...sx,
      }}
    >
      {children}
      {floatingAction}
    </Box>
  );
};

export default AppPageContainer;
