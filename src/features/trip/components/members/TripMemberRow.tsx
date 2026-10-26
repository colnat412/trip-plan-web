'use client';

import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { AppButton } from '@/base/components/ui';
import AppActionMenu, {
  type AppActionMenuItem,
} from '@/base/components/ui/AppActionMenu';
import { getUserInitials } from '@/base/utils/user';
import type { TripMember, TripMemberRole } from '../../types/member.types';
import RoleBadge from './RoleBadge';

interface TripMemberRowProps {
  member: TripMember;
  isCurrentUserOwner: boolean;
  currentUserRole?: TripMemberRole;
  currentUserId?: string | number;
  onEditRole: (member: TripMember) => void;
  onRemove: (member: TripMember) => void;
  onLeave: (member: TripMember) => void;
  onAccept?: (member: TripMember) => void;
}

const TripMemberRow = ({
  member,
  isCurrentUserOwner,
  currentUserRole,
  currentUserId,
  onEditRole,
  onRemove,
  onLeave,
  onAccept,
}: TripMemberRowProps) => {
  const t = useTranslations('members');

  const isSelf =
    currentUserId !== undefined &&
    String(member.userId) === String(currentUserId);
  const isTargetOwner = member.role === 'OWNER';
  const isTargetVice = member.role === 'VICE';
  const canAccept =
    member.status === 'INVITED' &&
    (isCurrentUserOwner ||
      (currentUserRole === 'VICE' && member.role === 'MEMBER'));
  const canEditRole = !isSelf && !isTargetOwner && isCurrentUserOwner;
  const canRemove =
    !isSelf &&
    !isTargetOwner &&
    (isCurrentUserOwner || (currentUserRole === 'VICE' && !isTargetVice));

  const menuItems: AppActionMenuItem[] = [];

  if (canEditRole) {
    menuItems.push({
      id: 'edit-role',
      label: t('actions.changeRole'),
      icon: <EditRoundedIcon fontSize="small" />,
      onClick: () => onEditRole(member),
    });
  }

  if (canRemove && !(canAccept && onAccept)) {
    menuItems.push({
      id: 'remove-member',
      label:
        member.status === 'INVITED'
          ? t('actions.rejectMember')
          : t('actions.removeMember'),
      icon: <DeleteOutlineRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => onRemove(member),
    });
  }

  if (isSelf && !isCurrentUserOwner) {
    menuItems.push({
      id: 'leave-trip',
      label: t('actions.leaveTrip'),
      icon: <LogoutRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => onLeave(member),
    });
  }

  return (
    <Stack
      spacing={1.5}
      sx={{
        p: { xs: 1.5, sm: 2 },
        minWidth: 0,
        borderRadius: '16px',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        useFlexGap
        spacing={1.25}
        sx={{ alignItems: 'flex-start', minWidth: 0 }}
      >
        <Avatar
          src={member.avatarUrl || undefined}
          alt={member.name}
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 700,
            fontSize: '14px',
            flexShrink: 0,
          }}
        >
          {getUserInitials(member.name || member.email)}
        </Avatar>
        <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              color: 'text.primary',
              overflowWrap: 'anywhere',
            }}
          >
            {member.name || member.email}
          </Typography>
          <Typography
            title={member.email}
            noWrap
            sx={{ fontSize: '12px', color: 'text.secondary', minWidth: 0 }}
          >
            {member.email}
          </Typography>
          <Stack
            direction="row"
            useFlexGap
            spacing={0.75}
            sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}
          >
            <RoleBadge role={member.role} />
            {member.status !== 'ACTIVE' && (
              <Chip
                size="small"
                label={t(`statuses.${member.status}`)}
                color={member.status === 'INVITED' ? 'warning' : 'default'}
                sx={{
                  height: 24,
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              />
            )}
          </Stack>
        </Stack>
        {menuItems.length > 0 && (
          <AppActionMenu
            items={menuItems}
            ariaLabel={t('memberActions', {
              name: member.name || member.email,
            })}
            size="medium"
          />
        )}
      </Stack>
      {canAccept && onAccept && (
        <Stack
          direction="row"
          useFlexGap
          spacing={1}
          sx={{
            flexWrap: 'wrap',
            '& > .MuiButton-root': { flex: '1 0 auto', minHeight: 44 },
          }}
        >
          <AppButton
            intent="primary"
            size="small"
            onClick={() => onAccept(member)}
          >
            {t('actions.acceptBtn')}
          </AppButton>
          <AppButton
            intent="danger"
            size="small"
            onClick={() => onRemove(member)}
          >
            {t('actions.rejectMember')}
          </AppButton>
        </Stack>
      )}
    </Stack>
  );
};

export default TripMemberRow;
