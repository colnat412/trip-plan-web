'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueryGet } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import AppToast from '@/base/components/ui/AppToast';
import { useTranslations } from 'next-intl';
import { connectPush } from '../lib/firebase.client';
import { createRefreshQueue } from '../lib/refresh-queue';
import useNotificationUnread from '../hooks/useNotificationUnread';
import type { NotificationPreferences } from '../types';
import { useTripContext } from '@/features/trip/context/TripContext';
import NotificationOptInPrompt from '../components/NotificationOptInPrompt';
import { NotificationContext } from './NotificationContext';

const NotificationSession = ({ accountKey, children }: { accountKey: string; children: ReactNode }) => {
  const t = useTranslations('notification');
  const { refetchTrips } = useTripContext();
  const tripRefreshRef = useRef(refetchTrips);
  useEffect(() => { tripRefreshRef.current = refetchTrips; }, [refetchTrips]);
  const { count, refetch } = useNotificationUnread(accountKey);
  const preferenceQuery = useQueryGet<ApiResponse<NotificationPreferences>>({
    queryKey: ['notifications', accountKey, 'preferences'], endPoint: '/notification-preferences',
  });
  const [inboxOpen, setInboxOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const [pushError, setPushError] = useState(false);
  const [connectionVersion, setConnectionVersion] = useState(0);
  const reconnectPush = useCallback(() => { setPushError(false); setConnectionVersion(v => v + 1); }, []);
  const [toast, setToast] = useState(false);
  const refreshRef = useRef(refetch);
  const openRef = useRef(inboxOpen);
  useEffect(() => { refreshRef.current = refetch; openRef.current = inboxOpen; });
  const queueRef = useRef<ReturnType<typeof createRefreshQueue> | null>(null);
  useEffect(() => {
    const queue = createRefreshQueue(async () => {
      if (openRef.current) setVersion(v => v + 1);
      await refreshRef.current();
    }, () => { /* The query retains its error; inbox retries independently. */ });
    queueRef.current = queue;
    let timer: number | undefined;
    const poll = () => {
      clearTimeout(timer);
      if (document.visibilityState !== 'visible') return;
      timer = window.setTimeout(() => {
        void queue.request();
        void tripRefreshRef.current().catch(() => undefined);
        poll();
      }, 180000 + Math.floor(Math.random() * 30000));
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
  }, []);
  const refresh = useCallback(() => queueRef.current?.request() ?? Promise.resolve(), []);
  const preference = preferenceQuery.isStale ? null : preferenceQuery.data?.data ?? null;
  useEffect(() => {
    if (!preference?.pushEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    const controller = new AbortController();
    const seen = new Set<string>();
    let cleanup: (() => void) | undefined;
    void connectPush({ accountKey, signal: controller.signal,
      onMessage: id => {
        void refresh();
        void tripRefreshRef.current().catch(() => undefined);
        if (!seen.has(id)) {
          if (seen.size >= 100) seen.clear();
          seen.add(id);
          setToast(true);
        }
      },
      onError: () => setPushError(true),
    }).then(dispose => {
      if (controller.signal.aborted) dispose(); else cleanup = dispose;
    }).catch(() => { if (!controller.signal.aborted) setPushError(true); });
    return () => { controller.abort(); cleanup?.(); };
  }, [accountKey, preference?.pushEnabled, refresh, connectionVersion]);
  const value = useMemo(() => ({ count, accountKey, inboxOpen, setInboxOpen, version, refresh,
    preferences: preference, preferencesLoading: preferenceQuery.isLoading || (preferenceQuery.isStale && !preferenceQuery.error), refreshPreferences: preferenceQuery.refetch, pushError, reconnectPush,
  }), [count, accountKey, inboxOpen, version, refresh, preference, preferenceQuery.refetch, preferenceQuery.isLoading, preferenceQuery.isStale, preferenceQuery.error, pushError, reconnectPush]);
  return <NotificationContext.Provider value={value}>
    {children}
    <NotificationOptInPrompt />
    <AppToast open={toast} message={t('newUpdate')} severity="info" onClose={() => setToast(false)} />
  </NotificationContext.Provider>;
};

export default NotificationSession;
