import type { NotificationItem } from '../types';

export const NOTIFICATION_VISIT_PARAM = 'notificationVisit';

/** Called only after the detail endpoint has authorized access to this trip. */
export function getNotificationDestination(
  item: Pick<NotificationItem, 'type' | 'tripId' | 'dayId'>,
  visitId: string,
): string {
  if (!item.tripId) throw new Error('Notification has no accessible trip');
  const path = item.type.startsWith('EXPENSE_') ? '/expenses'
    : item.type.startsWith('SETTLEMENT_') ? '/settlement'
      : item.type.startsWith('MEMBER_') ? '/overview' : '/plan';
  const params = new URLSearchParams({ tripId: item.tripId, [NOTIFICATION_VISIT_PARAM]: visitId });
  if (item.dayId) params.set('dayId', item.dayId);
  return `${path}?${params}`;
}
