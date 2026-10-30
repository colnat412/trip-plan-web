import type { PageResponse } from '@/base/api';

export type NotificationType = 'TRIP_MEMBER_ADDED' | 'TRIP_INVITATION_PENDING'
  | 'TRIP_MEMBER_APPROVAL_REQUIRED' | 'TRIP_MEMBERSHIP_APPROVED'
  | 'TRIP_ACTIVITY_CREATED' | 'TRIP_ACTIVITIES_GENERATED';
export interface NotificationItem {
  id: string;
  type: NotificationType;
  tripId: string;
  tripName: string | null;
  actorName: string | null;
  createdAt: string;
  readAt: string | null;
}
export interface NotificationSnapshot {
  listing: PageResponse<NotificationItem>;
  unreadCount: number;
}
export interface NotificationTarget {
  available: boolean;
  path: string | null;
  status: string;
}
