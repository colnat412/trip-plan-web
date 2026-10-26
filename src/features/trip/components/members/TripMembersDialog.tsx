'use client';

import { useState } from 'react';
import { Alert, Box, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';

import AppDialog from '@/base/components/ui/AppDialog';
import AppButton from '@/base/components/ui/AppButton';
import AppConfirmDialog from '@/base/components/ui/AppConfirmDialog';
import AppToast, { type AppToastSeverity } from '@/base/components/ui/AppToast';
import { axiosClient } from '@/base/api';
import { useUserContext } from '@/features/user/context/UserContext';
import useCurrentUser from '@/features/user/hooks/useCurrentUser';
import type { UserProfile } from '@/features/auth/types';
import {
  useTripMembers,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
  useLeaveTrip,
} from '../../hooks/useTripMembers';
import type {
  InviteMemberPayload,
  TripMember,
  TripMemberRole,
} from '../../types/member.types';
import TripMemberList from './TripMemberList';
import InviteMemberForm from './InviteMemberForm';
import EditMemberRoleDialog from './EditMemberRoleDialog';

interface TripMembersDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: number | string;
  tripName?: string;
  tripOwnerId?: number | string;
  initialShowInvite?: boolean;
}

const TripMembersDialog = ({
  open,
  onClose,
  tripId,
  tripName = '',
  initialShowInvite = false,
}: TripMembersDialogProps) => {
  const t = useTranslations('members');
  const { user: userFromContext } = useUserContext();
  const { user: userFromHook } = useCurrentUser();

  const rawUser: UserProfile | null =
    (userFromContext as { data?: UserProfile })?.data ??
    userFromContext ??
    (userFromHook as { data?: UserProfile })?.data ??
    userFromHook;

  const [showInviteForm, setShowInviteForm] = useState(initialShowInvite);
  const [editingMember, setEditingMember] = useState<TripMember | null>(null);
  const [removingMember, setRemovingMember] = useState<TripMember | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { members, isLoading, isStale, error, refetch } = useTripMembers({
    tripId,
    enabled: open,
  });

  const currentUserId =
    rawUser?.id !== undefined ? String(rawUser.id) : undefined;
  const currentUserEmail = rawUser?.email?.toLowerCase().trim();

  const currentMember =
    !isStale && !error
      ? members.find(
          (member) =>
            (currentUserId && String(member.userId) === currentUserId) ||
            (currentUserEmail &&
              member.email?.toLowerCase().trim() === currentUserEmail),
        )
      : undefined;

  const isCurrentUserOwner =
    currentMember?.status === 'ACTIVE' && currentMember.role === 'OWNER';
  const currentUserRole: TripMemberRole =
    currentMember?.status === 'ACTIVE' ? currentMember.role : 'MEMBER';
  const canManageMembers =
    currentMember?.status === 'ACTIVE' &&
    (currentUserRole === 'OWNER' || currentUserRole === 'VICE');
  const isInviteVisible = showInviteForm && canManageMembers;

  const { inviteMember, isPending: isInviting } = useInviteMember({
    tripId,
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.inviteSuccess'),
          severity: 'success',
        });
        setShowInviteForm(false);
        refetch();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.inviteError'),
          severity: 'error',
        });
      },
    },
  });

  const { updateRole, isPending: isUpdatingRole } = useUpdateMemberRole({
    tripId,
    memberId: editingMember?.id ?? '',
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.updateRoleSuccess'),
          severity: 'success',
        });
        setEditingMember(null);
        refetch();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.updateRoleError'),
          severity: 'error',
        });
      },
    },
  });

  const { removeMember, isPending: isRemoving } = useRemoveMember({
    tripId,
    memberId: removingMember?.id ?? '',
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.removeSuccess'),
          severity: 'success',
        });
        setRemovingMember(null);
        refetch();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.removeError'),
          severity: 'error',
        });
      },
    },
  });

  const { leaveTrip, isPending: isLeavingTrip } = useLeaveTrip({
    tripId,
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.leaveSuccess'),
          severity: 'success',
        });
        setIsLeaving(false);
        onClose();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.leaveError'),
          severity: 'error',
        });
      },
    },
  });

  const handleInviteSubmit = (payload: InviteMemberPayload) => {
    if (!canManageMembers) return;
    inviteMember(payload);
  };

  const handleAcceptMember = async (member: TripMember) => {
    try {
      await axiosClient.put(`/trip/${tripId}/members/${member.id}/accept`);
      setToast({
        open: true,
        message: t('toasts.acceptSuccess'),
        severity: 'success',
      });
      refetch();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setToast({
        open: true,
        message: apiErr.response?.data?.message || t('toasts.acceptError'),
        severity: 'error',
      });
    }
  };

  const handleUpdateRoleSubmit = (role: TripMemberRole) => {
    if (!isCurrentUserOwner) return;
    updateRole({ role });
  };

  const handleConfirmRemove = () => {
    if (removingMember) {
      removeMember({});
    }
  };

  const handleConfirmLeave = () => {
    leaveTrip({});
  };

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        title={t('dialogTitle')}
        icon={<GroupRoundedIcon />}
        maxWidth="sm"
        fullWidth
      >
        <Stack spacing={2.5}>
          <Typography
            sx={{ fontSize: '13px', color: 'text.secondary', lineHeight: 1.6 }}
          >
            {t('dialogSubtitle')}
          </Typography>
          {!isInviteVisible && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
                '& > .MuiButton-root': {
                  flex: { xs: '1 0 auto', sm: '0 0 auto' },
                },
              }}
            >
              {isLoading || (isStale && !error) ? (
                <Skeleton variant="text" width={90} />
              ) : !error ? (
                <Typography sx={{ color: 'text.secondary', fontSize: '13px' }}>
                  {t('memberCount', { count: members.length })}
                </Typography>
              ) : null}
              {canManageMembers && (
                <AppButton
                  intent="primary"
                  startIcon={<PersonAddRoundedIcon />}
                  onClick={() => setShowInviteForm(true)}
                  sx={{ fontSize: '13px', px: 2, borderRadius: '10px' }}
                >
                  {t('inviteBtn')}
                </AppButton>
              )}
            </Box>
          )}

          {isInviteVisible && (
            <InviteMemberForm
              onSubmit={handleInviteSubmit}
              onCancel={() => setShowInviteForm(false)}
              isSubmitting={isInviting}
              canAssignVice={isCurrentUserOwner}
            />
          )}

          {error ? (
            <Alert
              severity="error"
              action={
                <AppButton
                  intent="text"
                  size="small"
                  onClick={() => void refetch().catch(() => undefined)}
                >
                  {t('retry')}
                </AppButton>
              }
            >
              {t('loadError')}
            </Alert>
          ) : (
            <TripMemberList
              members={isStale ? [] : members}
              isLoading={isLoading || isStale}
              isCurrentUserOwner={isCurrentUserOwner}
              currentUserRole={currentUserRole}
              currentUserId={currentMember?.userId}
              onEditRole={(m) => setEditingMember(m)}
              onRemove={(m) => setRemovingMember(m)}
              onLeave={() => setIsLeaving(true)}
              onAccept={handleAcceptMember}
            />
          )}
        </Stack>
      </AppDialog>

      <EditMemberRoleDialog
        key={editingMember?.id}
        open={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        member={editingMember}
        currentUserRole={currentUserRole}
        onSubmit={handleUpdateRoleSubmit}
        isSubmitting={isUpdatingRole}
      />

      <AppConfirmDialog
        open={Boolean(removingMember)}
        title={t('actions.confirmRemoveTitle')}
        description={
          removingMember
            ? t('actions.confirmRemoveDesc', {
                name: removingMember.name,
                email: removingMember.email,
              })
            : ''
        }
        confirmText={t('actions.confirmRemoveBtn')}
        cancelText={t('cancel')}
        intent="danger"
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
        onClose={() => setRemovingMember(null)}
      />

      <AppConfirmDialog
        open={isLeaving}
        title={t('actions.confirmLeaveTitle')}
        description={t('actions.confirmLeaveDesc', { tripName })}
        confirmText={t('actions.confirmLeaveBtn')}
        cancelText={t('cancel')}
        intent="danger"
        loading={isLeavingTrip}
        onConfirm={handleConfirmLeave}
        onClose={() => setIsLeaving(false)}
      />

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default TripMembersDialog;
