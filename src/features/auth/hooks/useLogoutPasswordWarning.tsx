'use client';

import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppConfirmDialog } from '@/base/components/ui';
import { useUserContext } from '@/features/user/context/UserContext';
import PasswordDialog from '@/features/user/components/PasswordDialog';

/** Warn before logging out an account which still depends on Google sign-in. */
export default function useLogoutPasswordWarning(onLogout: () => void | Promise<void>, {
  busy = false, canSetPassword = true,
}: { busy?: boolean; canSetPassword?: boolean } = {}) {
  const t = useTranslations('passwordSettings');
  const { user } = useUserContext();
  const [warningOpen, setWarningOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const requestLogout = () => {
    if (busy) return;
    if (user?.hasPassword === false) setWarningOpen(true);
    else void onLogout();
  };
  const logoutWarning = <>
    <AppConfirmDialog open={warningOpen} onClose={() => { if (!busy) setWarningOpen(false); }}
      title={t('logoutTitle')}
      description={<Stack spacing={1}>
        <Typography component="p" sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', lineHeight: 1.6 }}>{t('logoutBody')}</Typography>
        <Typography component="p" sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.6 }}>{t('logoutDescription')}</Typography>
      </Stack>}
      intent="danger" loading={busy} confirmText={t('logoutAnyway')}
      cancelText={t(canSetPassword ? 'setTitle' : 'goBack')}
      onCancel={() => {
        if (busy) return;
        setWarningOpen(false);
        if (canSetPassword) setPasswordOpen(true);
      }}
      onConfirm={() => { if (!busy) void onLogout(); }}
    />
    {canSetPassword && <PasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />}
  </>;
  return { requestLogout, logoutWarning };
}
