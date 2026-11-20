'use client';

import type { ReactNode } from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import AppDialog from './AppDialog';
import AppMascot from './AppMascot';

import AppButton from './AppButton';

export interface AppConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
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
  onCancel,
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
      direction="row"
      spacing={1.5}
      useFlexGap
      sx={{
        width: '100%',
        '& > .MuiButton-root': {
          flex: '1 1 0',
          minWidth: 0,
        },
      }}
    >
      <AppButton
        data-dialog-action={onCancel ? 'secondary' : 'cancel'}
        intent="secondary"
        fullWidth
        size="medium"
        disabled={loading}
        onClick={onCancel ?? onClose}
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
      hideHeader
      description={typeof description === 'string' ? description : undefined}
      maxWidth="xs"
      actions={actions}
    >
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', pt: 1 }}>
        {icon ?? <AppMascot size={112} mood={intent === 'danger' ? 'warning' : intent === 'success' ? 'success' : 'thinking'} />}
        <Typography component="p" sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 600, overflowWrap: 'anywhere' }}>{title}</Typography>
      </Stack>
      <Box sx={{ textAlign: 'center' }}>{descriptionContent}</Box>
    </AppDialog>
  );
};

export default AppConfirmDialog;
