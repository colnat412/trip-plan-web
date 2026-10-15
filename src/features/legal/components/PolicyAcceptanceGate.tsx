'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, Stack, Typography } from '@mui/material';
import { AppButton } from '@/base/components/ui';
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
          p: '24px',
          minHeight: '100dvh',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Alert severity="error">{t('loadError')}</Alert>
        <AppButton onClick={() => void refetchUser().catch(() => undefined)}>
          {t('retry')}
        </AppButton>
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
      </Stack>
    );
  }
  if (!user) {
    return (
      <Typography
        role="status"
        sx={{
          p: '24px',
          minHeight: '100dvh',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        {t('loading')}
      </Typography>
    );
  }
  if (!user.policiesAcceptedAt || !user.policiesVersion)
    return <PolicyAcceptanceDialog key={user.id} />;
  return <>{children}</>;
};

export default PolicyAcceptanceGate;
