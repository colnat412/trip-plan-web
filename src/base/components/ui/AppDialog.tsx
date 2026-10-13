'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  closeDisabled?: boolean;
  closeLabel?: string;
  mobileFullScreen?: boolean;
}

const AppDialog = ({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  closeDisabled = false,
  closeLabel,
  mobileFullScreen = false,
}: AppDialogProps) => {
  const t = useTranslations('dialog');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullScreen = mobileFullScreen && isMobile;
  return (
    <Dialog
      open={open}
      onClose={closeDisabled ? undefined : onClose}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : '20px',
            p: fullScreen ? 0 : { xs: 1, sm: 2 },
            ...(fullScreen && {
              pt: 'env(safe-area-inset-top, 0px)',
              pb: 'env(safe-area-inset-bottom, 0px)',
              pl: 'env(safe-area-inset-left, 0px)',
              pr: 'env(safe-area-inset-right, 0px)',
            }),
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { xs: 2, sm: 2.5 },
          pb: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
        >
          {icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '18px', sm: '20px' },
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block' }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Stack>

        <IconButton
          onClick={onClose}
          disabled={closeDisabled}
          size="small"
          aria-label={closeLabel ?? t('close')}
          sx={{ width: 44, height: 44, flexShrink: 0 }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          pt: '20px !important',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: 2, gap: 1.5 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
};

export default AppDialog;
