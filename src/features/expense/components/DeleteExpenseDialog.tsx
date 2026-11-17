'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AppConfirmDialog } from '@/base/components/ui';
import type { Expense } from '../types';

export interface DeleteExpenseDialogProps {
  open: boolean;
  expense: Expense | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteExpenseDialog = ({
  open,
  expense,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteExpenseDialogProps) => {
  const t = useTranslations('expense');

  if (!expense) return null;

  return (
    <AppConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('dialog.deleteTitle')}
      description={t.rich('dialog.deleteConfirm', {
        title: expense.title,
        subject: (chunks) => <strong>{chunks}</strong>,
      })}
      confirmText={t('dialog.confirmDelete')}
      cancelText={t('form.cancel')}
      intent="danger"
      loading={isLoading}
    />
  );
};

export default DeleteExpenseDialog;
