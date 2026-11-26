'use client';

import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppConfirmDialog } from '@/base/components/ui';
import { useUserContext } from '@/features/user/context/UserContext';
import PasswordDialog from '@/features/user/components/PasswordDialog';

/** Confirm logout everywhere and retain the setup option for Google-only accounts. */
interface UseLogoutPasswordWarningParams { busy?: boolean; canSetPassword?: boolean }

export default function useLogoutPasswordWarning(onLogout: () => void | Promise<void>, {
  busy = false, canSetPassword = true,
}: UseLogoutPasswordWarningParams = {}) {
  const t = useTranslations('passwordSettings');
  const c = useTranslations('logoutConfirmation');
  const { user } = useUserContext();
  const [warningOpen, setWarningOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const passwordless = user?.hasPassword === false;
  const requestLogout = () => {
    if (busy) return;
    setWarningOpen(true);
  };
  const logoutWarning = <>
    <AppConfirmDialog open={warningOpen} onClose={() => { if (!busy) setWarningOpen(false); }}
      title={passwordless ? t('logoutTitle') : c('title')}
      description={passwordless ? <Stack spacing={1}>
        <Typography component="p" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', lineHeight: 1.6 }}>{t('logoutBody')}</Typography>
        <Typography component="p" sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.6 }}>{t('logoutDescription')}</Typography>
      </Stack> : c('description')}
      intent="danger" loading={busy} confirmText={passwordless ? t('logoutAnyway') : c('confirm')}
      cancelText={passwordless ? t(canSetPassword ? 'setTitle' : 'goBack') : c('cancel')}
      onCancel={() => {
        if (busy) return;
        setWarningOpen(false);
        if (passwordless && canSetPassword) setPasswordOpen(true);
      }}
      onConfirm={() => { if (!busy) void onLogout(); }}
    />
    {canSetPassword && <PasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />}
  </>;
  return { requestLogout, logoutWarning };
}
