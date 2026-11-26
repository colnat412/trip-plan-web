'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { useState, type ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { AppLoadingState } from '@/base/components/ui';
import { useUserContext } from '@/features/user/context/UserContext';
import PolicyAcceptanceDialog from './PolicyAcceptanceDialog';

interface PolicyAcceptanceGateProps { children: ReactNode; bypass?: boolean }

const PolicyAcceptanceGate = ({ children, bypass = false }: PolicyAcceptanceGateProps) => {
  const { user, error, isFetching, refetchUser } = useUserContext();
  // Keep the error view mounted while refetch clears the query's error.
  // Success clears the remembered error; retries keep their countdown/button state.
  const [previousError, setPreviousError] = useState(error);
  if (error && error !== previousError) setPreviousError(error);
  else if (!error && !isFetching && previousError) setPreviousError(null);
  const visibleError = error ?? (isFetching ? previousError : null);
  if (bypass) return <>{children}</>;
  // The auth interceptor is navigating to login. Never render an error screen
  // for an expired session while that navigation completes.
  if (visibleError?.status === 401) {
    return <AppLoadingState sx={{ minHeight: '100dvh', bgcolor: 'background.paper' }} />;
  }
  if (visibleError) {
    return (
      <Stack
        spacing={2}
        sx={{
          p: { xs: 2, sm: 3 },
          minHeight: '100dvh',
          width: '100%',
          boxSizing: 'border-box',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 560 }}>
          <AppErrorState
            status={visibleError.status}
            onRetry={refetchUser}
            retrying={isFetching}
            autoRetryInterval={10_000}
          />
        </Box>
      </Stack>
    );
  }
  if (!user) {
    return (
      <AppLoadingState
        sx={{ minHeight: '100dvh', bgcolor: 'background.paper' }}
      />
    );
  }
  if (!user.policiesAcceptedAt || !user.policiesVersion)
    return <PolicyAcceptanceDialog key={user.id} />;
  return <>{children}</>;
};

export default PolicyAcceptanceGate;
