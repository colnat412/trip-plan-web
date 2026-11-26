'use client';

import { axiosDelete, axiosGet, axiosPatch, axiosPost, type ApiResponse } from '@/base/api';
import { useMutationRequest } from '@/base/hooks';
import type { NotificationItem } from '../types';

interface NotificationRequest { id: string; signal: AbortSignal }
interface ReadAllRequest { through: string; signal: AbortSignal }
interface InvitationRequest extends NotificationRequest { accept: boolean }

export default function useNotificationActions() {
  const getItem = useMutationRequest<ApiResponse<NotificationItem>, NotificationRequest>({
    mutationKey: ['notifications', 'detail'], mutationFn: ({ id, signal }) => axiosGet(`/notifications/${encodeURIComponent(id)}`, { signal }),
  });
  const markRead = useMutationRequest<unknown, NotificationRequest>({
    mutationKey: ['notifications', 'read'], mutationFn: ({ id, signal }) => axiosPatch(`/notifications/${encodeURIComponent(id)}/read`, {}, { signal }),
  });
  const readAll = useMutationRequest<unknown, ReadAllRequest>({
    mutationKey: ['notifications', 'read-all'], mutationFn: ({ through, signal }) => axiosPost('/notifications/read-all', { through }, { signal }),
  });
  const remove = useMutationRequest<unknown, NotificationRequest>({
    mutationKey: ['notifications', 'delete'], mutationFn: ({ id, signal }) => axiosDelete(`/notifications/${encodeURIComponent(id)}`, undefined, { signal }),
  });
  const respond = useMutationRequest<ApiResponse<NotificationItem>, InvitationRequest>({
    mutationKey: ['notifications', 'invitation-response'], mutationFn: ({ id, accept, signal }) => axiosPost(`/notifications/${encodeURIComponent(id)}/invitation-response`, { accept }, { signal }),
  });
  return { getItem: getItem.mutateAsync, markRead: markRead.mutateAsync, readAll: readAll.mutateAsync, remove: remove.mutateAsync, respond: respond.mutateAsync };
}
