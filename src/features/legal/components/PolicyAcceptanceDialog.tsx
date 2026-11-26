'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Box, Stack, Typography } from '@mui/material';
import Alert from '@/base/components/ui/AppAlert';
import AppExitButton from '@/base/components/ui/AppExitButton';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import { AppButton, AppCheckbox, AppDialog } from '@/base/components/ui';
import useAcceptPolicies from '../hooks/useAcceptPolicies';
import { useUserContext } from '@/features/user/context/UserContext';
import useLogout from '@/features/auth/hooks/useLogout';
import useLogoutPasswordWarning from '@/features/auth/hooks/useLogoutPasswordWarning';
import PolicyDocument from './PolicyDocument';
import { POLICY_IDS, POLICY_VERSION } from '../constants';

// Locale changes remount the reader so a translated document must be read again.
export default function PolicyAcceptanceDialog() {
  const locale = useLocale();
  return <PolicyReader key={locale} />;
}

function PolicyReader() {
  const t = useTranslations('legal');
  const locale = useLocale();
  const { user, updateUser } = useUserContext();
  const [checked, setChecked] = useState(false);
  const [readToEnd, setReadToEnd] = useState(false);
  const [error, setError] = useState(false);
  const [reader, setReader] = useState<HTMLDivElement | null>(null);
  const acceptance = useAcceptPolicies();
  const logout = useLogout();
  const busy = acceptance.isPending || logout.isPending;
  const versionMatches = user?.requiredPolicyVersion === POLICY_VERSION;

  useEffect(() => {
    const element = reader;
    if (!element) return;
    const check = () => {
      if (element.clientHeight > 0 && element.scrollHeight - element.clientHeight - element.scrollTop <= 4) setReadToEnd(true);
    };
    element.addEventListener('scroll', check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    check();
    return () => { element.removeEventListener('scroll', check); observer.disconnect(); };
  }, [reader]);

  const accept = async () => {
    if (!checked || !readToEnd || busy || !versionMatches) return;
    setError(false);
    try {
      const response = await acceptance.mutateAsync({
        termsAccepted: true, contentAccepted: true, privacyAccepted: true,
        version: POLICY_VERSION, locale: locale === 'en' ? 'en' : 'vi',
      });
      if (!response.data?.policiesAcceptedAt || !response.data.policiesVersion) throw new Error('Invalid acceptance response');
      updateUser(response.data);
    } catch { setError(true); }
  };
  const signOut = async () => {
    setError(false);
    try {
      await logout.mutateAsync({});
      window.location.assign(new URL('/login', window.location.origin).href);
    } catch { setError(true); }
  };
  const { requestLogout, logoutWarning } = useLogoutPasswordWarning(signOut, { busy, canSetPassword: false });

  return <>
    <AppDialog open hideCloseButton closeDisabled onClose={() => undefined}
      title={t('title')} icon={<FactCheckRoundedIcon />} maxWidth="sm"
      contentRef={setReader}
      actions={<Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
        <AppCheckbox checked={checked} disabled={!readToEnd || busy} onChange={setChecked} label={t('acceptAll')} />
        {!readToEnd && <Typography role="status" sx={{ fontSize: 12, color: 'text.secondary' }}>{t('scrollToAccept')}</Typography>}
        {!versionMatches && <Alert severity="warning">{t('versionMismatch')}</Alert>}
        {error && <Alert severity="error" onClose={() => setError(false)}>{t('saveError')}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, width: '100%' }}>
          <AppButton loading={acceptance.isPending} disabled={!checked || !readToEnd || busy || !versionMatches}
            onClick={() => void accept()} sx={{ flex: 1, minHeight: 44 }}>{t('continue')}</AppButton>
          <AppExitButton label={t('decline')} loading={logout.isPending} disabled={busy} onClick={requestLogout} />
        </Box>
      </Stack>}>
      <Stack spacing={3} tabIndex={0} role="region" aria-label={t('title')} sx={{ flexShrink: 0 }}>
        {POLICY_IDS.map(id => <Stack key={id} spacing={1.5}>
          <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>{t(`documents.${id}.title`)}</Typography>
          <PolicyDocument policy={id} />
        </Stack>)}
      </Stack>
    </AppDialog>
    {logoutWarning}
  </>;
}
