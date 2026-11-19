'use client';

import { useEffect, useState } from 'react';
import { Alert, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import AppConfirmDialog from '@/base/components/ui/AppConfirmDialog';
import { useNotifications } from '../context/NotificationContext';
import useEnableNotifications from '../hooks/useEnableNotifications';
import { getFirebaseMessaging } from '../lib/firebase.client';
import { hasSeenNotificationPrompt, rememberNotificationPrompt } from '../lib/notification-prompt';

const NotificationOptInPrompt = () => {
  const notifications = useNotifications();
  const t = useTranslations('notification');
  const { enable, isEnabling, error } = useEnableNotifications();
  const [open, setOpen] = useState(false);
  const accountKey = notifications?.accountKey;
  const pushEnabled = notifications?.preferences?.pushEnabled;
  const preferencesReady = Boolean(notifications?.preferences) && !notifications?.preferencesLoading;

  useEffect(() => {
    if (!accountKey || !preferencesReady || pushEnabled || hasSeenNotificationPrompt(accountKey)) return;
    if (!window.isSecureContext || !('Notification' in window) || Notification.permission === 'denied') return;
    let disposed = false;
    const timer = setTimeout(() => {
      void getFirebaseMessaging().then(connection => {
        if (disposed || !connection || hasSeenNotificationPrompt(accountKey)) return;
        // Showing once is enough: closing, skipping or declining never causes another automatic prompt.
        rememberNotificationPrompt(accountKey);
        setOpen(true);
      }).catch(() => { /* Unsupported/unconfigured push stays available through Settings once configured. */ });
    }, 500);
    return () => { disposed = true; clearTimeout(timer); };
  }, [accountKey, preferencesReady, pushEnabled]);

  const confirm = async () => {
    const enabled = await enable();
    // A dismissed/denied native permission is the user's choice; do not keep asking.
    if (enabled || Notification.permission !== 'granted') setOpen(false);
  };
  return <AppConfirmDialog open={open} intent="primary" title={t('optIn.title')}
    description={<Stack spacing={1}>
      <Typography component="span">{t('optIn.description')}</Typography>
      {error && <Alert severity="warning">{error}</Alert>}
    </Stack>}
    confirmText={t('optIn.enable')} cancelText={t('optIn.skip')} loading={isEnabling}
    onConfirm={() => void confirm()} onClose={() => { if (!isEnabling) setOpen(false); }} />;
};
export default NotificationOptInPrompt;
