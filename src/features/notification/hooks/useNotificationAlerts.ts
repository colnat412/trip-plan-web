'use client';

import { useCallback, useRef, useState } from 'react';
import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import type { NotificationPage } from '../types';
import { createNotificationArrivalTracker } from '../lib/notification-arrivals';

const useNotificationAlerts = (accountKey: string) => {
  const tracker = useRef<ReturnType<typeof createNotificationArrivalTracker> | null>(null);
  if (tracker.current === null) tracker.current = createNotificationArrivalTracker();
  const [toast, setToast] = useState({ open: false, version: 0 });
  const show = useCallback(() => {
    setToast(previous => ({ open: true, version: previous.version + 1 }));
  }, []);
  const query = useQueryGet<ApiResponse<NotificationPage>>({
    queryKey: ['notifications', accountKey, 'arrivals'],
    endPoint: '/notifications',
    config: { params: { limit: 20, unreadOnly: false } },
    options: {
      onSuccess: response => {
        if (tracker.current!.observe(response.data.items)) show();
      },
    },
  });
  const receivePush = useCallback((id: string) => {
    if (tracker.current!.receivePush(id)) show();
  }, [show]);
  const close = useCallback(() => setToast(previous => ({ ...previous, open: false })), []);

  return { ...toast, close, receivePush, refresh: query.refetch };
};

export default useNotificationAlerts;
