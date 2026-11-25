'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Avatar, ButtonBase, Stack, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AppPreferenceRow from '@/base/components/preferences/AppPreferenceRow';
import AppExitButton from '@/base/components/ui/AppExitButton';
import { AppPageContainer, AppPageHeader } from '@/base/components/ui';
import AppPreferences from '@/base/components/preferences/AppPreferences';
import { useUserContext } from '../context/UserContext';
import { getUserInitials } from '@/base/utils';
import useLogout from '@/features/auth/hooks/useLogout';
import useLogoutPasswordWarning from '@/features/auth/hooks/useLogoutPasswordWarning';
import ProfileDialog from './ProfileDialog';
import PasswordDialog from './PasswordDialog';
import DeleteAccountDialog from './DeleteAccountDialog';
import NotificationSettings from '@/features/notification/components/NotificationSettings';

export default function SettingsView() {
  const t = useTranslations('preferences');
  const u = useTranslations('userMenu');
  const p = useTranslations('passwordSettings');
  const { user } = useUserContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { logoutMutation } = useLogout();
  const router = useRouter();
  const { requestLogout, logoutWarning } = useLogoutPasswordWarning(() => {
    logoutMutation.mutate({}, { onSuccess: () => { router.push('/login'); router.refresh(); } });
  }, { busy: logoutMutation.isPending });
  return <AppPageContainer>
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 640, alignSelf: 'center' }}>
      <AppPageHeader title={t('settings')} />
      <Stack component="section" aria-labelledby="settings-account" spacing={0.5} sx={{ pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography id="settings-account" component="h2" sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}>{t('accountGroup')}</Typography>
        <ButtonBase
          aria-label={u('profile')}
          onClick={() => setProfileOpen(true)}
          sx={{
            width: '100%', minHeight: 56, py: 0.5, gap: 1.25, textAlign: 'left', justifyContent: 'flex-start',
            borderRadius: 'var(--app-radius-small)',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          }}
        >
          <Avatar src={user?.avatarUrl ?? undefined} sx={{ width: 40, height: 40, bgcolor: 'action.selected', color: 'primary.main' }}>{getUserInitials(user?.name)}</Avatar>
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap sx={{ fontSize: 15, fontWeight: 600 }}>{user?.name ?? u('profile')}</Typography>
            <Typography noWrap sx={{ fontSize: 13 }} color="text.secondary">{user?.email}</Typography>
          </Stack>
          <ChevronRightRoundedIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
        </ButtonBase>
      </Stack>
      <Stack component="section" aria-labelledby="settings-application" spacing={0.5} sx={{ pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography id="settings-application" component="h2" sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}>{t('applicationGroup')}</Typography>
        <AppPreferences menuLayout compact />
      </Stack>
      <NotificationSettings compact />
      <Stack component="section" aria-labelledby="settings-security" spacing={0.5} sx={{ pb: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography id="settings-security" component="h2" sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}>{t('securityGroup')}</Typography>
        <ButtonBase disabled={!user} onClick={() => setPasswordOpen(true)}
          sx={{ width: '100%', textAlign: 'left', borderRadius: 'var(--app-radius-small)',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
          <AppPreferenceRow compact icon={<LockOutlinedIcon />} label={p(user?.hasPassword === false ? 'setTitle' : 'changeTitle')}>
            <ChevronRightRoundedIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
          </AppPreferenceRow>
        </ButtonBase>
        <ButtonBase disabled={!user} onClick={() => setDeleteOpen(true)}
          sx={{ width: '100%', textAlign: 'left', borderRadius: 'var(--app-radius-small)',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
          <AppPreferenceRow compact icon={<DeleteOutlineRoundedIcon />} label={t('deleteAccount')} color="error.main">
            <ChevronRightRoundedIcon sx={{ flexShrink: 0 }} />
          </AppPreferenceRow>
        </ButtonBase>
      </Stack>
      <AppExitButton fullWidth label={u('logout')} loading={logoutMutation.isPending}
        onClick={requestLogout} />
    </Stack>
    <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} user={user ?? undefined} />
    <PasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    <DeleteAccountDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    {logoutWarning}
  </AppPageContainer>;
}
