'use client';

import React from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

export interface AppPageContainerProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  spacing?: number;
}

const AppPageContainer = ({
  children,
  sx,
  spacing = 3,
}: AppPageContainerProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        minHeight: '100%',
        bgcolor: 'action.hover',
        p: { xs: 2, md: 3, xl: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2.5, sm: spacing },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default AppPageContainer;
