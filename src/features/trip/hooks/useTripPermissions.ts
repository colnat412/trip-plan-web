'use client';

import { useUserContext } from '@/features/user/context/UserContext';
import {
  canManageTrip,
  canManageCreatedRecord,
} from '@/base/utils/trip-permissions';
import { useTripMembers } from './useTripMembers';

export const useTripPermissions = (
  tripId?: string | number | null,
  enabled = true,
) => {
  const { user } = useUserContext();
  const query = useTripMembers({ tripId, enabled });
  const member =
    enabled && !query.isStale && !query.error
      ? query.activeMembers.find(
          (item) =>
            String(item.userId) === String(user?.id) ||
            Boolean(
              user?.email &&
                item.email?.toLowerCase().trim() === user.email.toLowerCase().trim(),
            ),
        )
      : undefined;
  const role = member?.role;
  // Member IDs use Core's encoded format, which is also used by createdBy.
  const actorId = member ? String(member.userId) : undefined;

  return {
    members: query.members,
    role,
    actorId,
    canWrite: role === 'OWNER' || role === 'VICE' || role === 'MEMBER',
    canManage: canManageTrip(role),
    canManageRecord: (createdBy?: string | null) =>
      canManageCreatedRecord(role, actorId, createdBy),
  };
};
