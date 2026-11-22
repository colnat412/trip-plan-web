'use client';

import { useEffect, useEffectEvent, type ReactNode } from 'react';
import AppMascot from './AppMascot';
import { Alert, Portal, Snackbar } from '@mui/material';

export type AppToastSeverity = 'success' | 'info' | 'warning' | 'error';

export interface AppToastPosition {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface AppToastProps {
  open: boolean;
  message: ReactNode;
  onClose: () => void;
  severity?: AppToastSeverity;
  autoHideDuration?: number | null;
  position?: AppToastPosition;
}

const AppToast = ({
  open,
  message,
  onClose,
  severity = 'info',
  position = { vertical: 'top', horizontal: 'right' },
}: AppToastProps) => {
  const dismiss = useEffectEvent(onClose);
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => dismiss(), 5_000);
    return () => window.clearTimeout(timer);
  }, [open, message]);
  return (
    <Portal>
      <Snackbar
        open={open}
        autoHideDuration={5_000}
        resumeHideDuration={5_000}
        anchorOrigin={position}
        sx={{
          zIndex: (theme) => theme.zIndex.snackbar + 1000,
        }}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') {
            onClose();
          }
        }}
      >
        <Alert
          severity={severity}
          variant="standard"
          icon={<AppMascot size={44} mood={severity === 'info' ? 'welcome' : severity} />}
          onClose={onClose}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            alignItems: 'center',
            border: 1,
            borderColor: 'divider',
            '& .MuiAlert-icon': { opacity: 1, p: 0, alignItems: 'center' },
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
            borderRadius: 'var(--app-radius-control)',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Portal>
  );
};

export default AppToast;
