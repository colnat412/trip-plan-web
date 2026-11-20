'use client';

import { type FormEvent, useRef, useState } from 'react';
import { Box, IconButton, InputAdornment, Stack } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/base/api';
import { AppButton, AppDialog, AppTextField, AppToast } from '@/base/components/ui';
import { useUserContext } from '../context/UserContext';
import usePasswordMutation from '../hooks/usePasswordMutation';

function PasswordField({ name, label, value, onChange, error, disabled, autoComplete }: {
  name: string; label: string; value: string; onChange: (value: string) => void;
  error?: string; disabled: boolean; autoComplete: 'current-password' | 'new-password';
}) {
  const t = useTranslations('login');
  const [visible, setVisible] = useState(false);
  return <AppTextField
    name={name} label={label} type={visible ? 'text' : 'password'} value={value}
    onChange={event => onChange(event.target.value)} required fullWidth
    disabled={disabled} autoComplete={autoComplete} error={Boolean(error)} helperText={error}
    slotProps={{ input: { endAdornment: <InputAdornment position="end">
      <IconButton type="button" edge="end" disabled={disabled}
        aria-label={`${t(visible ? 'hidePassword' : 'showPassword')}: ${label}`}
        aria-pressed={visible} onMouseDown={event => event.preventDefault()} onClick={() => setVisible(current => !current)}>
        {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
      </IconButton>
    </InputAdornment> } }}
  />;
}

function PasswordForm({ onClose, onSaved, onBusyChange }: {
  onClose: () => void; onSaved: () => void; onBusyChange: (busy: boolean) => void;
}) {
  const t = useTranslations('passwordSettings');
  const { user, updateUser } = useUserContext();
  // Older profile responses are treated as having a password; Core decides from the stored hash.
  const hasPassword = user?.hasPassword !== false;
  const mutation = usePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmation?: string }>({});
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || !user) return;
    const nextErrors: typeof errors = {};
    if (hasPassword && !currentPassword) nextErrors.currentPassword = t('currentRequired');
    if (!newPassword.trim() || newPassword.length < 8) nextErrors.newPassword = t('tooShort');
    else if (new TextEncoder().encode(newPassword).length > 72) nextErrors.newPassword = t('tooLong');
    else if (hasPassword && currentPassword === newPassword) nextErrors.newPassword = t('mustDiffer');
    if (!confirmation || confirmation !== newPassword) nextErrors.confirmation = t('mismatch');
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    submitting.current = true;
    setSaving(true);
    onBusyChange(true);
    setToast('');
    let saved = false;
    try {
      const result = await mutation.mutateAsync({
        ...(hasPassword ? { currentPassword } : {}), newPassword,
      });
      updateUser(result.data);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmation('');
      saved = true;
    } catch (error) {
      const status = error instanceof ApiError ? error.status : null;
      if (status === 422) setErrors({ currentPassword: t('currentIncorrect') });
      else if (status === 409) setErrors({ newPassword: t('mustDiffer') });
      else setToast(t('saveFailed'));
    } finally {
      submitting.current = false;
      setSaving(false);
      onBusyChange(false);
    }
    if (saved) onSaved();
  };

  return <Box component="form" noValidate onSubmit={submit} aria-busy={saving}>
    <Stack spacing={2}>
      <AppTextField label={t('email')} value={user?.email ?? ''} autoComplete="username" disabled />
      {hasPassword && <PasswordField name="currentPassword" label={t('currentPassword')} value={currentPassword}
        onChange={value => { setCurrentPassword(value); setErrors(current => ({ ...current, currentPassword: undefined })); }}
        error={errors.currentPassword} disabled={saving} autoComplete="current-password" />}
      <PasswordField name="newPassword" label={t('newPassword')} value={newPassword}
        onChange={value => { setNewPassword(value); setErrors(current => ({ ...current, newPassword: undefined })); }}
        error={errors.newPassword} disabled={saving} autoComplete="new-password" />
      <PasswordField name="confirmation" label={t('confirmation')} value={confirmation}
        onChange={value => { setConfirmation(value); setErrors(current => ({ ...current, confirmation: undefined })); }}
        error={errors.confirmation} disabled={saving} autoComplete="new-password" />
      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
        <AppButton data-dialog-action="cancel" type="button" intent="secondary" disabled={saving} onClick={onClose}>{t('cancel')}</AppButton>
        <AppButton data-dialog-action="primary" type="submit" loading={saving}>{t('save')}</AppButton>
      </Stack>
    </Stack>
    <AppToast open={Boolean(toast)} severity="error" message={toast} onClose={() => setToast('')} />
  </Box>;
}

export default function PasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('passwordSettings');
  const { user } = useUserContext();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasPassword = user?.hasPassword !== false;
  return <>
    <AppDialog open={open} onClose={onClose} closeDisabled={busy} maxWidth="xs"
      title={t(hasPassword ? 'changeTitle' : 'setTitle')} description={t(hasPassword ? 'changeDescription' : 'setDescription')}
      icon={<LockOutlinedIcon />} closeLabel={t('cancel')}>
      {open && user && <PasswordForm key={user.id} onClose={onClose} onBusyChange={setBusy}
        onSaved={() => { setSaved(true); onClose(); }} />}
    </AppDialog>
    <AppToast open={saved} severity="success" message={t('saveSuccess')} onClose={() => setSaved(false)} />
  </>;
}
