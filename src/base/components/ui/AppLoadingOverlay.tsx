'use client';

import { Backdrop, Box } from '@mui/material';
import AppLoadingIndicator from './AppLoadingIndicator';

export interface AppLoadingOverlayProps {
  open: boolean;
  message?: string;
  scope?: 'screen' | 'content';
}

const AppLoadingOverlay = ({ open, message, scope = 'screen' }: AppLoadingOverlayProps) => scope === 'content' ? (
  open ? (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      flex: 1, minHeight: 160, minWidth: 0, py: 3,
      pb: 'calc(24px + var(--app-bottom-navigation-space, 0px))',
    }}>
      <AppLoadingIndicator {...(message ? { 'aria-label': message } : {})} />
    </Box>
  ) : null
) : (
  <Backdrop
    open={open}
    transitionDuration={250}
    sx={(theme) => ({
      zIndex: theme.zIndex.modal + 20,
      bgcolor: `color-mix(in srgb, ${(theme.vars?.palette ?? theme.palette).background.paper} 70%, transparent)`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    })}
  >
    <AppLoadingIndicator {...(message ? { 'aria-label': message } : {})} />
  </Backdrop>
);

export default AppLoadingOverlay;
