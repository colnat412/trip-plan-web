import type { TripMemberRole } from '@/features/trip/types/member.types';

export const canManageTrip = (role?: TripMemberRole): boolean =>
  role === 'OWNER' || role === 'VICE';

export const canManageCreatedRecord = (
  role: TripMemberRole | undefined,
  actorId: string | undefined,
  createdBy: string | null | undefined,
): boolean =>
  canManageTrip(role) ||
  Boolean(role === 'MEMBER' && actorId && actorId === createdBy);
