'use client';

import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppPopover } from '@/base/components/ui';
import AppPreferences from '../../preferences/AppPreferences';

interface SidebarUserMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  headerMenu?: boolean;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string;
  userInitials?: string;
}

const SidebarUserMenu = ({
  anchorEl,
  open,
  onClose,
  onOpenProfile,
  onLogout,
  isLoggingOut,
  headerMenu = false,
  userName,
  userEmail,
  userAvatarUrl,
  userInitials,
}: SidebarUserMenuProps) => {
  const t = useTranslations('userMenu');
  const tNavigation = useTranslations('navigation');
  return (
    <AppPopover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      label={tNavigation('account')}
      width={320}
      anchorOrigin={{
        vertical: headerMenu ? 'bottom' : 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: headerMenu ? 'top' : 'bottom',
        horizontal: 'right',
      }}
    >
      <Stack spacing={0}>
        {headerMenu && (
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: 'center', minWidth: 0, px: 1, py: 1 }}
          >
            <Avatar
              src={userAvatarUrl}
              alt=""
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                bgcolor: 'action.selected',
                color: 'primary.main',
                fontSize: '14px',
                fontWeight: 800,
              }}
            >
              {userInitials}
            </Avatar>
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  color: 'text.primary',
                  fontSize: '15px',
                  fontWeight: 800,
                }}
              >
                {userName || t('profile')}
              </Typography>
              {userEmail && (
                <Typography
                  noWrap
                  sx={{ color: 'text.secondary', fontSize: '12px' }}
                >
                  {userEmail}
                </Typography>
              )}
            </Stack>
          </Stack>
        )}

        {headerMenu && <Divider />}

        {headerMenu ? (
          <AppButton
            autoFocus
            type="button"
            intent="text"
            size="small"
            startIcon={<PersonOutlineRoundedIcon />}
            endIcon={<ChevronRightRoundedIcon />}
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            sx={{
              width: '100%',
              minHeight: 44,
              justifyContent: 'flex-start',
              px: 1,
              color: 'text.primary',
              bgcolor: 'transparent',
              '& .MuiButton-startIcon': {
                flexShrink: 0,
              },
              '& .MuiButton-endIcon': {
                flexShrink: 0,
                color: 'text.secondary',
              },
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'action.selected',
              },
            }}
          >
            <Box component="span" sx={{ flex: 1, textAlign: 'left' }}>
              {t('profile')}
            </Box>
          </AppButton>
        ) : (
          <AppButton
            autoFocus
            type="button"
            intent="text"
            size="small"
            startIcon={<PersonOutlineRoundedIcon />}
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            sx={{
              width: '100%',
              minHeight: 48,
              justifyContent: 'flex-start',
              color: 'text.primary',
            }}
          >
            {t('profile')}
          </AppButton>
        )}
        {headerMenu && (
          <>
            <Divider />
            <AppPreferences menuLayout />
          </>
        )}
        <Divider />
        <Box sx={{ px: 0.5, pt: 1.5, pb: 0.5 }}>
          <AppButton
            type="button"
            intent="danger"
            size="small"
            loading={isLoggingOut}
            disabled={isLoggingOut}
            startIcon={<LogoutRoundedIcon />}
            onClick={onLogout}
            sx={{
              width: '100%',
              minHeight: 48,
              justifyContent: 'flex-start',
            }}
          >
            {isLoggingOut ? t('loggingOut') : t('logout')}
          </AppButton>
        </Box>
      </Stack>
    </AppPopover>
  );
};
export default SidebarUserMenu;
