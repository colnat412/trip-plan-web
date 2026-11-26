'use client';

import React, { useId, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog } from '@/base/components/ui';
import { useActiveTripMembers } from '@/features/trip/hooks/useTripMembers';
import EditExpenseForm from './EditExpenseForm';
import { expenseFormPaperSx } from './expense-form.styles';
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
  const [isFormValid, setFormValid] = useState(false);
  const { activeMembers } = useActiveTripMembers({
    tripId: expense?.tripId,
    enabled: open && Boolean(expense?.tripId),
  });

  if (!expense) return null;

  return (
    <AppDialog
      mobilePresentation="screen"
      protectChanges
      open={open}
      onClose={onClose}
      closeDisabled={isLoading}
      title={t('dialog.editTitle')}
      titleAlign="left"
      paperSx={expenseFormPaperSx}
      icon={<EditRoundedIcon color="primary" />}
      maxWidth="sm"
      actions={
        <>
          <AppButton data-dialog-action="cancel" intent="secondary"
            onClick={onClose} disabled={isLoading} sx={{ minHeight: 44 }}>
            {t('form.cancel')}
          </AppButton>
          <AppButton data-dialog-action="primary" intent="primary" type="submit"
            form={formId} loading={isLoading} disabled={!isFormValid} sx={{ minHeight: 48 }}>
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
        onValidityChange={setFormValid}
      />
    </AppDialog>
  );
};

export default EditExpenseDialog;
