'use client';

import Link from 'next/link';
import { Box, ButtonBase, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslations } from 'next-intl';
import { AppCard, AppErrorState, AppLoadingState, AppPageContainer, AppPageHeader } from '@/base/components/ui';
import { useUserContext } from '../context/UserContext';
import ProfileForm from './ProfileForm';

const ProfileView = () => {
  const t = useTranslations('profile');
  const templates = useTranslations('planTemplate');
  const preferences = useTranslations('preferences');
  const { user, isLoading, error, refetchUser } = useUserContext();
  return <AppPageContainer>
    <Stack spacing={2.5} useFlexGap sx={{ width: '100%', maxWidth: 640, alignSelf: 'center', minWidth: 0 }}>
      <AppPageHeader title={t('pageTitle')} titleActions={
        <Tooltip title={preferences('settings')}>
          <IconButton component={Link} href="/settings" aria-label={preferences('settings')}
            sx={{ width: 44, height: 44, color: 'text.primary' }}><SettingsOutlinedIcon /></IconButton>
        </Tooltip>
      } />
      {isLoading ? <AppLoadingState local /> : error || !user ? <AppErrorState status={error?.status} onRetry={() => refetchUser()} /> : <>
        <AppCard component="section">
          <ProfileForm key={user.id} user={user} inline />
        </AppCard>
        <Stack component="nav" aria-label={t('collections')} spacing={1.5} useFlexGap>
          {[
            { href: '/saved-templates', label: templates('savedLibrary'), icon: <FavoriteBorderRoundedIcon /> },
            { href: '/my-templates', label: templates('mine'), icon: <CollectionsBookmarkOutlinedIcon /> },
          ].map(item => <ButtonBase key={item.href} component={Link} href={item.href} sx={{
            width: '100%', minHeight: 64, px: 2, py: 1.5, gap: 1.5,
            border: 1, borderColor: 'divider', borderRadius: 'var(--app-radius-card)', bgcolor: 'background.paper',
            color: 'text.primary', justifyContent: 'flex-start', textAlign: 'left',
            '&:hover': { bgcolor: 'action.hover' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          }}>
            <Box sx={{ display: 'flex', color: 'primary.main', flexShrink: 0 }}>{item.icon}</Box>
            <Typography sx={{ flex: 1, fontWeight: 600, overflowWrap: 'anywhere' }}>{item.label}</Typography>
            <ChevronRightRoundedIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
          </ButtonBase>)}
        </Stack>
      </>}
    </Stack>
  </AppPageContainer>;
};

export default ProfileView;
