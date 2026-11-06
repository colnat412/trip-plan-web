'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Stack } from '@mui/material';
import { AppButton, AppLoadingState } from '@/base/components/ui';
import { useUserContext } from '@/features/user/context/UserContext';
import useLogout from '@/features/auth/hooks/useLogout';
import PolicyAcceptanceDialog from './PolicyAcceptanceDialog';

const PolicyAcceptanceGate = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('legal');
  const { user, error, refetchUser } = useUserContext();
  const logout = useLogout();
  if (error) {
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
          <AppErrorState status={error.status} onRetry={() => refetchUser()} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <AppButton
              intent="text"
              loading={logout.isPending}
              onClick={() =>
                void logout
                  .mutateAsync({})
                  .then(() =>
                    window.location.assign(
                      new URL('/login', window.location.origin).href,
                    ),
                  )
                  .catch(() => undefined)
              }
            >
              {t('decline')}
            </AppButton>
          </Box>
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
