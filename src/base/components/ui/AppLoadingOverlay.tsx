'use client';

import { Backdrop } from '@mui/material';
import AppLoadingIndicator from './AppLoadingIndicator';

export interface AppLoadingOverlayProps {
  open: boolean;
  message?: string;
}

const AppLoadingOverlay = ({ open, message }: AppLoadingOverlayProps) => (
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
    <AppLoadingIndicator size={88} {...(message ? { 'aria-label': message } : {})} />
  </Backdrop>
);

export default AppLoadingOverlay;
