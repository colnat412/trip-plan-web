'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { axiosPut } from '@/base/api';
import { useNotifications } from '../context/NotificationContext';
import { getFirebaseMessaging } from '../lib/firebase.client';

/** Shared opt-in flow for Settings and the first-visit prompt. */
const useEnableNotifications = () => {
  const notifications = useNotifications();
  const locale = useLocale();
  const t = useTranslations('notification');
  const busy = useRef(false);
  const controller = useRef(new AbortController());
  const [isEnabling, setIsEnabling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const current = new AbortController();
    controller.current = current;
    return () => current.abort();
  }, []);

  const enable = async (): Promise<boolean> => {
    if (!notifications?.preferences || busy.current) return false;
    if (!window.isSecureContext || !('Notification' in window)) { setError(t('unsupported')); return false; }
    if (Notification.permission === 'denied') { setError(t('permissionDenied')); return false; }
    busy.current = true;
    setIsEnabling(true); setError(null);
    const signal = controller.current.signal;
    try {
      // Keep this call in the button's click handler, before any async SDK check.
      const permission = await Notification.requestPermission();
      if (signal.aborted) return false;
      if (permission !== 'granted') { setError(t('permissionDenied')); return false; }
      if (!(await getFirebaseMessaging())) { if (!signal.aborted) setError(t('unsupported')); return false; }
      if (signal.aborted) return false;
      await axiosPut('/notification-preferences', {
        ...notifications.preferences, pushEnabled: true, locale: locale === 'en' ? 'en' : 'vi',
      }, { signal });
      if (signal.aborted) return false;
      await notifications.refreshPreferences();
      if (signal.aborted) return false;
      notifications.reconnectPush();
      return true;
    } catch {
      if (!signal.aborted) setError(t('saveError'));
      return false;
    } finally {
      busy.current = false;
      if (!signal.aborted) setIsEnabling(false);
    }
  };
  return { enable, isEnabling, error, clearError: () => setError(null) };
};
export default useEnableNotifications;
