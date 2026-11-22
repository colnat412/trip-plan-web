export type NotificationType = 'MEMBER_INVITED' | 'MEMBER_INVITATION_ACCEPTED' | 'MEMBER_INVITATION_DECLINED' | 'MEMBER_INVITATION_CANCELLED' | 'MEMBER_ADDED' | 'MEMBER_APPROVAL_REQUIRED' | 'MEMBER_PENDING' | 'MEMBER_APPROVED' | 'MEMBER_ROLE_CHANGED' | 'MEMBER_REMOVED' | 'MEMBER_LEFT' | 'ACTIVITY_REMINDER' | 'TRIP_REMINDER' | 'TRIP_CANCELLED' | 'EXPENSE_CREATED' | 'EXPENSE_UPDATED' | 'EXPENSE_DELETED' | 'SETTLEMENT_RECORDED' | 'SETTLEMENT_DELETED' | 'SETTLEMENT_CONFIRMATION_REQUIRED' | 'SETTLEMENT_UPDATED';

export type NotificationAccessStatus = 'AVAILABLE' | 'LEFT' | 'REMOVED' | 'TRIP_DELETED' | 'PENDING' | 'UNAVAILABLE';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  tripId: string | null;
  tripName: string;
  subject: string;
  targetId: string | null;
  dayId: string | null;
  accessStatus?: NotificationAccessStatus;
  invitationStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | null;
  createdAt: string;
  readAt: string | null;
}
export interface NotificationPage {
  items: NotificationItem[];
  nextCursor: string | null;
  through: string;
}
export interface NotificationPreferences {
  pushEnabled: boolean;
  locale: 'vi' | 'en';
}
