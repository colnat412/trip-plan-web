'use client';

import React, { useId } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog } from '@/base/components/ui';
import { useTripMembers } from '@/features/trip/hooks/useTripMembers';
import EditExpenseForm from './EditExpenseForm';
import type { Expense, UpdateExpensePayload } from '../types';

export interface EditExpenseDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSubmit: (payload: UpdateExpensePayload) => void;
  isLoading?: boolean;
}

const EditExpenseDialog = ({
  open,
  expense,
  onClose,
  onSubmit,
  isLoading = false,
}: EditExpenseDialogProps) => {
  const t = useTranslations('expense');
  const formId = useId();
  const { activeMembers } = useTripMembers({
    tripId: expense?.tripId,
    enabled: open && Boolean(expense?.tripId),
  });

  if (!expense) return null;

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      closeDisabled={isLoading}
      title={t('dialog.editTitle')}
      icon={<EditRoundedIcon color="primary" />}
      maxWidth="sm"
      showSheetHandle
      actions={
        <>
          <AppButton data-dialog-action="cancel" intent="secondary"
            onClick={onClose} disabled={isLoading} sx={{ minHeight: 44 }}>
            {t('form.cancel')}
          </AppButton>
          <AppButton data-dialog-action="primary" intent="primary" type="submit"
            form={formId} loading={isLoading} sx={{ minHeight: 48 }}>
            {t('form.submitEdit')}
          </AppButton>
        </>
      }
      mobileCloseLabel={t('form.cancel')}
    >
      <EditExpenseForm
        key={expense.id}
        expense={expense}
        members={activeMembers}
        isLoading={isLoading}
        onSubmit={onSubmit}
        formId={formId}
      />
    </AppDialog>
  );
};

export default EditExpenseDialog;
