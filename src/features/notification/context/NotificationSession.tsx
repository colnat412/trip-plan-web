'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import useNotificationPreferences from '../hooks/useNotificationPreferences';
import AppToast from '@/base/components/ui/AppToast';
import { useTranslations } from 'next-intl';
import { connectPush } from '../lib/firebase.client';
import { createRefreshQueue } from '../lib/refresh-queue';
import useNotificationUnread from '../hooks/useNotificationUnread';
import useNotificationAlerts from '../hooks/useNotificationAlerts';
import { useTripContext } from '@/features/trip/context/TripContext';
import NotificationOptInPrompt from '../components/NotificationOptInPrompt';
import { NotificationContext } from './NotificationContext';

interface NotificationSessionProps { accountKey: string; children: ReactNode }

const NotificationSession = ({ accountKey, children }: NotificationSessionProps) => {
  const t = useTranslations('notification');
  const { refetchTrips } = useTripContext();
  const tripRefreshRef = useRef(refetchTrips);
  useEffect(() => { tripRefreshRef.current = refetchTrips; }, [refetchTrips]);
  const { count, refetch } = useNotificationUnread(accountKey);
  const alerts = useNotificationAlerts(accountKey);
  const { receivePush } = alerts;
  const preferenceQuery = useNotificationPreferences(accountKey);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const [pushError, setPushError] = useState(false);
  const [pushConnected, setPushConnected] = useState(false);
  const [connectionVersion, setConnectionVersion] = useState(0);
  const reconnectPush = useCallback(() => { setPushError(false); setPushConnected(false); setConnectionVersion(v => v + 1); }, []);
  const preference = preferenceQuery.isStale ? null : preferenceQuery.data?.data ?? null;
  const pollingDelay = preference?.pushEnabled && pushConnected && !pushError ? 180000 : 30000;
  const refreshRef = useRef(refetch);
  const alertsRefreshRef = useRef(alerts.refresh);
  const openRef = useRef(inboxOpen);
  useEffect(() => { refreshRef.current = refetch; alertsRefreshRef.current = alerts.refresh; openRef.current = inboxOpen; });
  const queueRef = useRef<ReturnType<typeof createRefreshQueue> | null>(null);
  useEffect(() => {
    const queue = createRefreshQueue(async () => {
      if (openRef.current) setVersion(v => v + 1);
      await Promise.allSettled([refreshRef.current(), alertsRefreshRef.current()]);
    }, () => { /* The query retains its error; inbox retries independently. */ });
    queueRef.current = queue;
    let timer: number | undefined;
    let lastTripRefresh = Date.now();
    const poll = () => {
      clearTimeout(timer);
      if (document.visibilityState !== 'visible') return;
      timer = window.setTimeout(() => {
        void queue.request();
        if (Date.now() - lastTripRefresh >= 180000) {
          lastTripRefresh = Date.now();
          void tripRefreshRef.current().catch(() => undefined);
        }
        poll();
      }, pollingDelay + Math.floor(Math.random() * (pollingDelay / 6)));
    };
    const visible = () => {
      if (document.visibilityState === 'visible') void queue.request();
      poll();
    };
    const focus = () => { if (document.visibilityState === 'visible') void queue.request(); };
    window.addEventListener('focus', focus);
    window.addEventListener('online', focus);
    document.addEventListener('visibilitychange', visible);
    poll();
    return () => {
      queue.dispose(); queueRef.current = null; clearTimeout(timer);
      window.removeEventListener('focus', focus); window.removeEventListener('online', focus);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [pollingDelay]);
  const refresh = useCallback(() => queueRef.current?.request() ?? Promise.resolve(), []);
  useEffect(() => {
    if (!preference?.pushEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    const controller = new AbortController();
    let cleanup: (() => void) | undefined;
    void connectPush({ accountKey, signal: controller.signal,
      onMessage: id => {
        void refresh();
        void tripRefreshRef.current().catch(() => undefined);
        receivePush(id);
      },
      onError: () => setPushError(true),
    }).then(dispose => {
      if (controller.signal.aborted) dispose(); else { cleanup = dispose; setPushConnected(true); }
    }).catch(() => { if (!controller.signal.aborted) setPushError(true); });
    return () => { controller.abort(); cleanup?.(); };
  }, [accountKey, preference?.pushEnabled, refresh, connectionVersion, receivePush]);
  const value = useMemo(() => ({ count, accountKey, inboxOpen, setInboxOpen, version, refresh,
    preferences: preference, preferencesLoading: preferenceQuery.isLoading || (preferenceQuery.isStale && !preferenceQuery.error), refreshPreferences: preferenceQuery.refetch, pushError, reconnectPush,
  }), [count, accountKey, inboxOpen, version, refresh, preference, preferenceQuery.refetch, preferenceQuery.isLoading, preferenceQuery.isStale, preferenceQuery.error, pushError, reconnectPush]);
  return <NotificationContext.Provider value={value}>
    {children}
    <NotificationOptInPrompt />
    <AppToast key={alerts.version} open={alerts.open} message={t('newUpdate')} severity="info" onClose={alerts.close} />
  </NotificationContext.Provider>;
};

export default NotificationSession;
