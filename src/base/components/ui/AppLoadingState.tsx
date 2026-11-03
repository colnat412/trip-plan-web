'use client';

import { Box, type BoxProps } from '@mui/material';
import { useContext, useLayoutEffect } from 'react';
import { AppPageLoadingContext } from '@/base/providers/AppPageLoadingProvider';
import AppLoadingIndicator from './AppLoadingIndicator';

const AppLoadingState = ({ sx, ...props }: BoxProps) => {
  const context = useContext(AppPageLoadingContext);
  const registerLoading = context?.registerLoading;
  useLayoutEffect(() => registerLoading?.(), [registerLoading]);

  if (context) return null;
  return (
    <Box
      {...props}
      sx={[
        {
          width: '100%',
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <AppLoadingIndicator />
    </Box>
  );
};

export default AppLoadingState;
