'use client';

import type { ReactNode } from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import AppDialog from './AppDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import AppButton from './AppButton';

export interface AppConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  intent?: 'danger' | 'primary' | 'success';
  loading?: boolean;
  icon?: ReactNode;
}

const AppConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  intent = 'danger',
  loading = false,
  icon,
}: AppConfirmDialogProps) => {
  const t = useTranslations('dialog');
  const confirmLabel = confirmText ?? t('confirm');
  const cancelLabel = cancelText ?? t('cancel');
  const getDefaultIcon = () => {
    switch (intent) {
      case 'danger':
        return <WarningRoundedIcon sx={{ fontSize: 32 }} />;
      case 'success':
        return <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />;
      default:
        return <HelpOutlineRoundedIcon sx={{ fontSize: 32 }} />;
    }
  };

  const getIconContainerStyles = () => {
    return (theme: {
      palette: {
        error: { main: string };
        success: { main: string };
        primary: { main: string };
      };
      vars?: {
        palette: {
          error: { main: string };
          success: { main: string };
          primary: { main: string };
        };
      };
    }) => {
      const palette = theme.vars?.palette ?? theme.palette;
      switch (intent) {
        case 'danger':
          return {
            color: palette.error.main,
            bgcolor: 'rgba(239, 68, 68, 0.12)',
          };
        case 'success':
          return {
            color: palette.success.main,
            bgcolor: 'rgba(34, 197, 94, 0.12)',
          };
        default:
          return {
            color: palette.primary.main,
            bgcolor: 'rgba(59, 130, 246, 0.12)',
          };
      }
    };
  };

  const descriptionContent = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        fontSize: '14px',
        lineHeight: 1.6,
        textAlign: 'center',
        overflowWrap: 'anywhere',
        '& strong': { fontWeight: 700, color: 'text.primary' },
      }}
    >
      {description}
    </Typography>
  );

  const actions = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      useFlexGap
      sx={{
        width: '100%',
        '& > .MuiButton-root': {
          flex: { sm: '1 1 0' },
          width: { sm: 'auto' },
        },
      }}
    >
      <AppButton
        data-dialog-action="cancel"
        intent="secondary"
        fullWidth
        size="medium"
        disabled={loading}
        onClick={onClose}
      >
        {cancelLabel}
      </AppButton>
      <AppButton
        data-dialog-action="primary"
        intent={intent}
        fullWidth
        size="medium"
        loading={loading}
        onClick={onConfirm}
      >
        {confirmLabel}
      </AppButton>
    </Stack>
  );

  return (
    <AppDialog
      mobilePresentation="dialog"
      open={open}
      onClose={onClose}
      closeDisabled={loading}
      title={title}
      maxWidth="xs"
      actions={actions}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={[{
          width: 48, height: 48, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }, getIconContainerStyles()]}>
          {icon ?? getDefaultIcon()}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>{descriptionContent}</Box>
    </AppDialog>
  );
};

export default AppConfirmDialog;
