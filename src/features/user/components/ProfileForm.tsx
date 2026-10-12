'use client';

import { type FormEvent, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppButton,
  AppImageUploader,
  AppTextField,
  AppToast,
} from '@/base/components/ui';
import { getUserInitials } from '@/base/utils';
import { ApiError } from '@/base/api';
import { useUserContext } from '../context/UserContext';
import useAvatarMutation from '../hooks/useAvatarMutation';
import type { SidebarUser } from '@/base/components/layout/sidebar/types';
import type { UserProfile } from '@/features/auth/types';

interface ProfileFormProps {
  onClose: () => void;
  onSaved: () => void;
  user?: Partial<SidebarUser> | UserProfile;
  onBusyChange: (busy: boolean) => void;
}
const ProfileForm = ({
  onClose,
  onSaved,
  user,
  onBusyChange,
}: ProfileFormProps) => {
  const t = useTranslations('profile');
  const { user: currentUser, updateUser, refetchUser } = useUserContext();
  const profile = currentUser ?? user;
  const mutation = useAvatarMutation();
  const [selection, setSelection] = useState<File | null | undefined>(
    undefined,
  );
  const [toast, setToast] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);
  const submitting = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selection === undefined || submitting.current) return;
    submitting.current = true;
    onBusyChange(true);
    let saved = false;
    try {
      const result = await mutation.mutateAsync(selection);
      updateUser(result.data);
      void refetchUser().catch(() => undefined);
      saved = true;
    } catch (error) {
      const status = error instanceof ApiError ? error.status : null;
      const key =
        status === 401
          ? 'avatarUnauthorized'
          : status === 409 || status === 404
            ? 'avatarUnavailable'
            : status === 413
              ? 'avatarTooLarge'
              : 'avatarFailed';
      setToast({ message: t(key), severity: 'error' });
    } finally {
      submitting.current = false;
      onBusyChange(false);
    }
    if (saved) onSaved();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      aria-busy={mutation.isPending}
    >
      <Stack spacing={2.5}>
        <AppImageUploader
          src={profile?.avatarUrl}
          alt={profile?.name || t('title')}
          fallback={getUserInitials(profile?.name || '')}
          disabled={mutation.isPending}
          onChange={setSelection}
        />
        <AppTextField
          label={t('fullName')}
          value={profile?.name || ''}
          disabled
        />
        <AppTextField
          label={t('email')}
          value={profile?.email || ''}
          disabled
        />
        <Typography variant="caption" color="text.secondary">
          {t('avatarOnlyNote')}
        </Typography>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: 'flex-end' }}
        >
          <AppButton
            type="button"
            intent="secondary"
            disabled={mutation.isPending}
            onClick={onClose}
          >
            {t('close')}
          </AppButton>
          <AppButton
            type="submit"
            loading={mutation.isPending}
            disabled={selection === undefined}
            aria-label={t('saveAvatar')}
          >
            {t('saveAvatar')}
          </AppButton>
        </Stack>
      </Stack>
      <AppToast
        open={toast !== null}
        message={toast?.message}
        severity={toast?.severity}
        onClose={() => setToast(null)}
      />
    </Box>
  );
};
export default ProfileForm;
