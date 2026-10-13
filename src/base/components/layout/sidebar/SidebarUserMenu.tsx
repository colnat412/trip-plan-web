'use client';

import { Box, Divider, Stack, Typography } from '@mui/material';
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
}: SidebarUserMenuProps) => {
  const t = useTranslations('userMenu');
  const tNavigation = useTranslations('navigation');
  return (
    // Popover allows natural Tab navigation through profile, language and theme controls.
    <AppPopover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      label={tNavigation('account')}
      width={272}
      anchorOrigin={{
        vertical: headerMenu ? 'bottom' : 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: headerMenu ? 'top' : 'bottom',
        horizontal: 'right',
      }}
    >
      <Stack spacing={1}>
        {headerMenu && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              px: 1,
              py: 1,
              minWidth: 0,
            }}
          >
            <Typography noWrap sx={{ fontWeight: 800, fontSize: '14px' }}>
              {userName}
            </Typography>
            {userEmail && (
              <Typography
                noWrap
                sx={{ color: 'text.secondary', fontSize: '12px' }}
              >
                {userEmail}
              </Typography>
            )}
          </Box>
        )}
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
        {headerMenu && (
          <Box sx={{ px: 1, py: 1 }}>
            <AppPreferences />
          </Box>
        )}
        <Divider />
        <AppButton
          type="button"
          intent="text"
          size="small"
          loading={isLoggingOut}
          disabled={isLoggingOut}
          startIcon={<LogoutRoundedIcon />}
          onClick={onLogout}
          sx={{
            width: '100%',
            minHeight: 48,
            justifyContent: 'flex-start',
            color: 'error.main',
            '&:hover': {
              bgcolor: (theme) =>
                `color-mix(in srgb, ${(theme.vars?.palette ?? theme.palette).error.main} 8%, transparent)`,
            },
          }}
        >
          {isLoggingOut ? t('loggingOut') : t('logout')}
        </AppButton>
      </Stack>
    </AppPopover>
  );
};
export default SidebarUserMenu;
