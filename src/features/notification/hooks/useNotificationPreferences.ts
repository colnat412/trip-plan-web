'use client';

import { useQueryGet } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type { NotificationPreferences } from '../types';

export default function useNotificationPreferences(accountKey: string) {
  return useQueryGet<ApiResponse<NotificationPreferences>>({
    queryKey: ['notifications', accountKey, 'preferences'], endPoint: '/notification-preferences',
  });
}
