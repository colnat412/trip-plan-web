'use client';

import { AppEmptyState, AppLoadingState } from '@/base/components/ui';

import { Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';

import type { TripMember, TripMemberRole } from '../../types/member.types';
import TripMemberRow from './TripMemberRow';

interface TripMemberListProps {
  members: TripMember[];
  isLoading: boolean;
  isCurrentUserOwner: boolean;
  currentUserRole?: TripMemberRole;
  currentUserId?: string | number;
  onEditRole: (member: TripMember) => void;
  onRemove: (member: TripMember) => void;
  onLeave: (member: TripMember) => void;
  onAccept?: (member: TripMember) => void;
}

const TripMemberList = ({
  members,
  isLoading,
  isCurrentUserOwner,
  currentUserRole,
  currentUserId,
  onEditRole,
  onRemove,
  onLeave,
  onAccept,
}: TripMemberListProps) => {
  const t = useTranslations('members');

  if (isLoading) {
    return <AppLoadingState />;
  }

  if (members.length === 0) {
    return <AppEmptyState title={t('empty.title')} icon={<PeopleOutlineRoundedIcon />} />;
  }

  return (
    <Stack component="ul" spacing={0} sx={{
      minWidth: 0, m: 0, p: 0, listStyle: 'none',
      '& > li + li': { borderTop: 1, borderColor: 'divider' },
      '& > li:first-of-type': { pt: 0 },
      '& > li:last-of-type': { pb: 0 },
    }}>
      {members.map((member) => (
        <TripMemberRow
          key={member.id}
          member={member}
          isCurrentUserOwner={isCurrentUserOwner}
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
          onEditRole={onEditRole}
          onRemove={onRemove}
          onLeave={onLeave}
          onAccept={onAccept}
        />
      ))}
    </Stack>
  );
};

export default TripMemberList;
