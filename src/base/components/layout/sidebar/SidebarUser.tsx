'use client';

import { useState, type MouseEvent } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import useLogout from '@/features/auth/hooks/useLogout';
import { useUserContext } from '@/features/user/context/UserContext';
import { getUserInitials } from '@/base/utils';
import ProfileDialog from '@/features/user/components/ProfileDialog';
import SidebarUserMenu from './SidebarUserMenu';
import type { SidebarUser as SidebarUserData } from './types';
import type { UserProfile } from '@/features/auth/types';

export interface SidebarUserProps {
  user?: Partial<SidebarUserData> | UserProfile;
  compact?: boolean;
}

const SidebarUser = ({
  user: defaultUser,
  compact = false,
}: SidebarUserProps) => {
  const router = useRouter();
  const t = useTranslations('navigation');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user: currentUser, isLoading } = useUserContext();
  const { logoutMutation } = useLogout();

  const rawUser =
    currentUser ?? (defaultUser as { data?: UserProfile })?.data ?? defaultUser;

  const displayName = rawUser?.name || t('account');
  const displayEmailOrRole = rawUser?.role || rawUser?.email || t('account');
  const displayInitials = getUserInitials(rawUser?.name);
  const avatarSrc = rawUser?.avatarUrl || undefined;

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logoutMutation.mutate(
      {},
      {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    );
  };

  if (isLoading && !currentUser) {
    if (compact) return <Skeleton variant="circular" width={44} height={44} />;
    return (
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          height: '100%',
          alignItems: 'center',
          px: 1,
          py: 0.75,
        }}
      >
        <Skeleton variant="circular" width={36} height={36} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="80%" height={12} />
        </Box>
      </Stack>
    );
  }

  return (
    <>
      {compact ? (
        <IconButton
          onClick={handleOpenMenu}
          disabled={logoutMutation.isPending}
          aria-label={t('accountMenu')}
          aria-haspopup="dialog"
          aria-expanded={Boolean(anchorEl)}
          sx={{ width: 44, height: 44, flexShrink: 0, color: 'text.primary' }}
        >
          <Avatar
            src={avatarSrc}
            alt={displayName}
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'action.selected',
              color: 'primary.main',
              fontSize: '13px',
              fontWeight: 800,
            }}
          >
            {displayInitials}
          </Avatar>
        </IconButton>
      ) : (
        <Stack
          direction="row"
          spacing={1.25}
          onClick={handleOpenMenu}
          sx={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            py: 0.75,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', minWidth: 0 }}
          >
            <Avatar
              src={avatarSrc}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.light',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {displayInitials}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  fontSize: '13px',
                }}
              >
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontSize: '11px',
                }}
              >
                {displayEmailOrRole}
              </Typography>
            </Box>
          </Stack>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenMenu(e);
            }}
            sx={{ color: 'text.secondary', p: 0.5 }}
          >
            <UnfoldMoreRoundedIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Stack>
      )}

      <SidebarUserMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onOpenProfile={() => setProfileOpen(true)}
        onLogout={handleLogout}
        isLoggingOut={logoutMutation.isPending}
        headerMenu={compact}
        userName={displayName}
        userEmail={rawUser?.email}
      />

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={rawUser ?? undefined}
      />
    </>
  );
};

export default SidebarUser;
