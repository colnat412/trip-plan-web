'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Avatar, ButtonBase, Stack, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { AppLoadingIndicator, AppPageContainer, AppPageHeader } from '@/base/components/ui';
import AppPreferenceRow from '@/base/components/preferences/AppPreferenceRow';
import AppPreferences from '@/base/components/preferences/AppPreferences';
import { useUserContext } from '../context/UserContext';
import { getUserInitials } from '@/base/utils';
import useLogout from '@/features/auth/hooks/useLogout';
import ProfileDialog from './ProfileDialog';

export default function SettingsView() {
  const t = useTranslations('preferences');
  const u = useTranslations('userMenu');
  const { user } = useUserContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const { logoutMutation } = useLogout();
  const router = useRouter();
  return <AppPageContainer>
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 640, alignSelf: 'center' }}>
      <AppPageHeader title={t('settings')} />
      <Stack component="section" aria-labelledby="settings-account" spacing={1} sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography id="settings-account" component="h2" sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}>{t('accountGroup')}</Typography>
        <ButtonBase
          aria-label={u('profile')}
          onClick={() => setProfileOpen(true)}
          sx={{
            width: '100%', minHeight: 64, py: 1, gap: 1.5, textAlign: 'left', justifyContent: 'flex-start',
            borderRadius: 'var(--app-radius-small)',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          }}
        >
          <Avatar src={user?.avatarUrl ?? undefined} sx={{ width: 48, height: 48, bgcolor: 'action.selected', color: 'primary.main' }}>{getUserInitials(user?.name)}</Avatar>
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap sx={{ fontSize: 15, fontWeight: 600 }}>{user?.name ?? u('profile')}</Typography>
            <Typography noWrap sx={{ fontSize: 13 }} color="text.secondary">{user?.email}</Typography>
          </Stack>
          <ChevronRightRoundedIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
        </ButtonBase>
      </Stack>
      <Stack component="section" aria-labelledby="settings-application" spacing={1} sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography id="settings-application" component="h2" sx={{ fontSize: 12, fontWeight: 500, color: 'text.secondary' }}>{t('applicationGroup')}</Typography>
        <AppPreferences menuLayout dividers />
      </Stack>
      <ButtonBase disableRipple disabled={logoutMutation.isPending} aria-busy={logoutMutation.isPending || undefined}
        onClick={() => logoutMutation.mutate({}, { onSuccess: () => { router.push('/login'); router.refresh(); } })}
        sx={{ width: '100%', justifyContent: 'flex-start', borderRadius: 'var(--app-radius-small)', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 }, '&.Mui-disabled': { opacity: 0.5 } }}>
        <AppPreferenceRow icon={<LogoutRoundedIcon />} label={u('logout')} color="error.main">
          {logoutMutation.isPending && <AppLoadingIndicator />}
        </AppPreferenceRow>
      </ButtonBase>
    </Stack>
    <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} user={user ?? undefined} />
  </AppPageContainer>;
}
