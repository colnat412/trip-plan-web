'use client';

import { type FormEvent, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
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
import useProfileMutation from '../hooks/useProfileMutation';
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
  const profileMutation = useProfileMutation();
  const [name, setName] = useState(profile?.name || '');
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const nameChanged = name.trim() !== (profile?.name || '');
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
    if (submitting.current || (!nameChanged && selection === undefined)) return;
    const trimmedName = name.trim();
    if (!trimmedName || Array.from(trimmedName).length > 100) {
      setNameError(t(!trimmedName ? 'fullNameRequired' : 'fullNameTooLong'));
      return;
    }
    submitting.current = true;
    setIsSaving(true);
    onBusyChange(true);
    let saved = false;
    let savingAvatar = false;
    try {
      if (nameChanged) {
        const result = await profileMutation.mutateAsync({ name: trimmedName });
        updateUser(result.data);
        setName(result.data.name);
      }
      if (selection !== undefined) {
        savingAvatar = true;
        const result = await mutation.mutateAsync(selection);
        updateUser(result.data);
        setSelection(undefined);
      }
      void refetchUser().catch(() => undefined);
      saved = true;
    } catch (error) {
      const status = error instanceof ApiError ? error.status : null;
      const key =
        status === 401
          ? 'avatarUnauthorized'
          : !savingAvatar
            ? 'saveFailed'
            : status === 409 || status === 404
              ? 'avatarUnavailable'
              : status === 413
                ? 'avatarTooLarge'
                : 'avatarFailed';
      setToast({ message: t(key), severity: 'error' });
    } finally {
      submitting.current = false;
      setIsSaving(false);
      onBusyChange(false);
    }
    if (saved) onSaved();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} aria-busy={isSaving}>
      <Stack spacing={2.5}>
        <AppImageUploader
          src={profile?.avatarUrl}
          alt={profile?.name || t('title')}
          fallback={getUserInitials(profile?.name || '')}
          disabled={isSaving}
          showHint={false}
          onChange={setSelection}
        />
        <AppTextField
          label={t('fullName')}
          value={name}
          placeholder={t('fullNamePlaceholder')}
          required
          disabled={isSaving}
          error={Boolean(nameError)}
          helperText={nameError}
          onChange={(event) => {
            setName(event.target.value);
            setNameError('');
          }}
        />
        <AppTextField
          label={t('email')}
          value={profile?.email || ''}
          disabled
        />
        <Stack
          direction="row"
          spacing={1.5}
          useFlexGap
          sx={{ justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1.5 }}
        >
          <AppButton
            data-dialog-action="cancel"
            type="button"
            intent="secondary"
            disabled={isSaving}
            onClick={onClose}
          >
            {t('close')}
          </AppButton>
          <AppButton
            data-dialog-action="primary"
            type="submit"
            loading={isSaving}
            disabled={!nameChanged && selection === undefined}
            aria-label={t('saveChanges')}
          >
            {t('saveChanges')}
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
