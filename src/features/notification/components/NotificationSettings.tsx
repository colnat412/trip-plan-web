'use client';

import { useState } from 'react';
import { Stack, Switch, Typography } from '@mui/material';
import Alert from '@/base/components/ui/AppAlert';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { useTranslations } from 'next-intl';
import useDisableNotifications from '../hooks/useDisableNotifications';
import { AppErrorState, AppLoadingIndicator } from '@/base/components/ui';
import AppPreferenceRow from '@/base/components/preferences/AppPreferenceRow';
import { useNotifications } from '../context/NotificationContext';
import useEnableNotifications from '../hooks/useEnableNotifications';

interface NotificationSettingsProps { compact?: boolean }

const NotificationSettings = ({ compact = false }: NotificationSettingsProps) => {
  const notifications = useNotifications();
  const t = useTranslations('notification');
  const p = useTranslations('preferences');
  const { enable, isEnabling, error: enableError, clearError: clearEnableError } = useEnableNotifications();
  const { mutateAsync: disableNotifications, isPending: saving } = useDisableNotifications();
  const [error, setError] = useState<string | null>(null);
  if (!notifications) return null;
  const current = notifications.preferences;
  const disable = async () => {
    if (!current || saving) return;
    setError(null); clearEnableError();
    try {
      await disableNotifications();
    } catch { setError(t('saveError')); }
  };
  return <Stack component="section" aria-labelledby="settings-notifications" spacing={compact ? 0.5 : 1} sx={{ pb: compact ? 1.5 : 2, borderBottom: 1, borderColor: 'divider' }}>
    <Typography id="settings-notifications" component="h2" sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}>{p('systemGroup')}</Typography>
    {!current && notifications.preferencesLoading ? <AppLoadingIndicator /> : !current ? <AppErrorState compact onRetry={() => notifications.refreshPreferences()} /> : <>
      <AppPreferenceRow compact={compact} icon={<NotificationsNoneRoundedIcon />} label={t('push')}>
        <Switch checked={current.pushEnabled} disabled={saving || isEnabling}
          onChange={(_, checked) => { setError(null); void (checked ? enable() : disable()); }}
          slotProps={{ input: { 'aria-label': t('push') } }} />
      </AppPreferenceRow>

    </>}
    {saving && <AppLoadingIndicator />}
    {(error || enableError || notifications.pushError) && <Alert severity="warning">{error ?? enableError ?? t('registrationError')}</Alert>}
  </Stack>;
};
export default NotificationSettings;
