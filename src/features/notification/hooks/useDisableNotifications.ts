'use client';

import { axiosDelete, axiosPut } from '@/base/api';
import { useMutationRequest } from '@/base/hooks';
import { useNotifications } from '../context/NotificationContext';
import { getRegisteredDeviceId, revokeLocalPush } from '../lib/firebase.client';

export default function useDisableNotifications() {
  const notifications = useNotifications();
  return useMutationRequest<void, void>({
    mutationKey: ['notifications', 'disable'],
    mutationFn: async () => {
      if (!notifications?.preferences) throw new Error('Notification preferences unavailable');
      await axiosPut('/notification-preferences', { ...notifications.preferences, pushEnabled: false });
      await notifications.refreshPreferences();
      const id = getRegisteredDeviceId(notifications.accountKey);
      if (id) await axiosDelete(`/push-devices/${encodeURIComponent(id)}`, undefined);
      await revokeLocalPush();
    },
  });
}
