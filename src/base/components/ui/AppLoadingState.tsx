'use client';

import { Box, type BoxProps } from '@mui/material';
import { useContext, useLayoutEffect } from 'react';
import { AppPageLoadingContext } from '@/base/providers/AppPageLoadingProvider';
import AppMascotLoading from './AppMascotLoading';

interface AppLoadingStateProps extends BoxProps {
  pageOnly?: boolean;
  local?: boolean;
}

const AppLoadingState = ({ sx, pageOnly = false, local = false, ...props }: AppLoadingStateProps) => {
  const context = useContext(AppPageLoadingContext);
  const registerLoading = context?.registerLoading;
  useLayoutEffect(() => local ? undefined : registerLoading?.(), [registerLoading, local]);

  if ((!local && context) || pageOnly) return null;
  return (
    <Box
      {...props}
      sx={[
        {
          width: '100%',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <AppMascotLoading />
    </Box>
  );
};

export default AppLoadingState;
