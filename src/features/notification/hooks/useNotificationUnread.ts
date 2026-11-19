import { useQueryGet } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';

const useNotificationUnread = (accountKey: string) => {
  const query = useQueryGet<ApiResponse<{ count: number }>>({
    queryKey: ['notifications', accountKey, 'unread-count'],
    endPoint: '/notifications/unread-count',
  });
  return { ...query, count: query.isStale ? 0 : (query.data?.data.count ?? 0) };
};
export default useNotificationUnread;
