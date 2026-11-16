'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { AppConfirmDialog } from '@/base/components/ui';

export interface DeleteActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activityTitle?: string;
  loading?: boolean;
}

const DeleteActivityDialog = ({
  open,
  onClose,
  onConfirm,
  activityTitle,
  loading = false,
}: DeleteActivityDialogProps) => {
  const t = useTranslations('plan.dialog');

  return (
    <AppConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('deleteTitle')}
      intent="danger"
      loading={loading}
      confirmText={t('confirmDelete')}
      cancelText={t('cancelBtn')}
      description={activityTitle?.trim()
        ? t.rich('deleteNamedDesc', {
            title: activityTitle,
            subject: (chunks) => <strong>{chunks}</strong>,
          })
        : t('deleteDesc')}
    />
  );
};

export default DeleteActivityDialog;
