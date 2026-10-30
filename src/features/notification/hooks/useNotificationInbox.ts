'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { axiosGet, axiosPatch, type ApiResponse } from '@/base/api';
import { useMutationRequest, useQueryGet } from '@/base/hooks';
import { connectRealtime } from '@/base/realtime/connect-realtime';
import { useTranslations } from 'next-intl';
import { useAppToast } from '@/base/providers/AppToastProvider';
import type { NotificationSnapshot, NotificationTarget } from '../types';

export default function useNotificationInbox(userId: string | number) {
  const t = useTranslations('notifications');
  const notify = useAppToast();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const query = useQueryGet<ApiResponse<NotificationSnapshot>>({
    queryKey: ['notifications', userId, page],
    endPoint: '/notifications/snapshot',
    enabled: false,
    config: { params: { page, size: 20 } },
  });
  const { refetch } = query;
  const [revision, setRevision] = useState(0);
  const running = useRef(false);
  const dirty = useRef(false);
  const alive = useRef(false);
  const syncRef = useRef<() => void>(() => undefined);

  const requestSync = useCallback(() => {
    dirty.current = true;
    if (running.current || !alive.current) return;
    running.current = true;
    void (async () => {
      try {
        do {
          dirty.current = false;
          try { await refetch(); } catch { break; }
        } while (dirty.current && alive.current);
      } finally { running.current = false; }
    })();
  }, [refetch]);

  useEffect(() => { syncRef.current = requestSync; }, [requestSync]);
  useEffect(() => {
    alive.current = true;
    const timer = window.setTimeout(requestSync, 0);
    const focus = () => { if (document.visibilityState === 'visible') syncRef.current(); };
    window.addEventListener('focus', focus);
    window.addEventListener('online', focus);
    document.addEventListener('visibilitychange', focus);
    return () => {
      alive.current = false;
      window.clearTimeout(timer);
      window.removeEventListener('focus', focus);
      window.removeEventListener('online', focus);
      document.removeEventListener('visibilitychange', focus);
    };
  }, [requestSync]);

  useEffect(() => {
    const timer = window.setTimeout(requestSync, 0);
    return () => window.clearTimeout(timer);
  }, [page, revision, requestSync]);

  useEffect(() => connectRealtime({
    onSignal: event => {
      if (event.type === 'notification.created') {
        setPage(0);
        if (document.visibilityState === 'visible') notify(t('newNotification'), 'info');
      }
      setRevision(value => value + 1);
      syncRef.current();
    },
    onConnected: () => syncRef.current(),
    onStatus: setConnected,
  }), [userId, notify, t]);

  const mutation = useMutationRequest<ApiResponse<null>, string | null>({
    mutationKey: ['notifications', 'read', userId],
    mutationFn: id => axiosPatch(id ? `/notifications/${encodeURIComponent(id)}/read` : '/notifications/read-all', {}),
    options: { onSuccess: () => requestSync() },
  });
  const target = useMutationRequest<ApiResponse<NotificationTarget>, string>({
    mutationKey: ['notifications', 'target', userId],
    mutationFn: id => axiosGet(`/notifications/${encodeURIComponent(id)}/target`),
  });
  const show = () => { setOpen(true); setPage(0); requestSync(); };
  return {
    unreadCount: query.data?.data.unreadCount ?? 0,
    snapshot: query.isStale ? null : query.data?.data,
    error: query.error || mutation.error || target.error,
    loading: query.isFetching,
    pending: mutation.isPending || target.isPending,
    connected, open, page, setPage, show, close: () => setOpen(false),
    retry: () => { mutation.clearError(); target.clearError(); requestSync(); },
    read: mutation.mutateAsync, target: target.mutateAsync,
  };
}
