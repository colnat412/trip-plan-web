'use client';

import { Box, Tooltip } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AppButton from './AppButton';

interface AppExitButtonProps {
  label: string;
  onClick: () => void;
  iconOnly?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
}

/** Shared leave/sign-out action: quiet danger color, compact icon, 44px target. */
const AppExitButton = ({ label, onClick, iconOnly = false, fullWidth = false,
  disabled = false, loading = false, tooltip }: AppExitButtonProps) => {
  const button = <AppButton intent="text" aria-label={label} onClick={onClick}
    disabled={disabled} loading={loading} fullWidth={fullWidth}
    startIcon={iconOnly ? undefined : <LogoutRoundedIcon sx={{ fontSize: 18 }} />}
    sx={theme => {
      const palette = theme.vars?.palette ?? theme.palette;
      return {
        minWidth: 44, minHeight: 44, width: iconOnly ? 44 : undefined,
        px: iconOnly ? 0 : 1.5, flexShrink: 0,
        borderRadius: 'var(--app-radius-control)', fontSize: 13,
        color: 'error.main', border: '1px solid',
        borderColor: `color-mix(in srgb, ${palette.error.main} 22%, ${palette.divider})`,
        bgcolor: `color-mix(in srgb, ${palette.error.main} 7%, ${palette.background.paper})`,
        '&:hover': { bgcolor: `color-mix(in srgb, ${palette.error.main} 13%, ${palette.background.paper})` },
        '&.Mui-disabled': { color: 'text.disabled', borderColor: 'divider', bgcolor: 'action.disabledBackground' },
      };
    }}>
    {iconOnly ? <LogoutRoundedIcon sx={{ fontSize: 18 }} /> : label}
  </AppButton>;
  return iconOnly || tooltip ? <Tooltip title={tooltip || label}>
    <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0, width: fullWidth ? '100%' : undefined }}>{button}</Box>
  </Tooltip> : button;
};
export default AppExitButton;
