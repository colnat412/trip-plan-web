'use client';

import type { ReactNode } from 'react';
import { Box, Tooltip } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AppButton from './AppButton';

export interface AppFloatingActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

const AppFloatingActionButton = ({
  label,
  onClick,
  icon = <AddRoundedIcon />,
}: AppFloatingActionButtonProps) => (
  <Box
    sx={(theme) => ({
      position: 'fixed',
      right: 'max(16px, env(safe-area-inset-right, 0px))',
      bottom:
        'calc(var(--app-bottom-navigation-space, env(safe-area-inset-bottom, 0px)) + 16px)',
      zIndex: theme.zIndex.appBar + 1,
    })}
  >
    <Tooltip title={label}>
      <AppButton
        intent="primary"
        round
        onClick={onClick}
        aria-label={label}
        sx={{
          minWidth: 56,
          minHeight: 56,
          px: { xs: 0, sm: 2 },
          gap: 1,
          boxShadow: 3,
          '& .MuiSvgIcon-root': { fontSize: 26, flexShrink: 0 },
        }}
      >
        {icon}
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {label}
        </Box>
      </AppButton>
    </Tooltip>
  </Box>
);

export default AppFloatingActionButton;
