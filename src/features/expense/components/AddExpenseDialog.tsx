'use client';

import React, { useId, useState } from 'react';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog } from '@/base/components/ui';
import { useActiveTripMembers } from '@/features/trip/hooks/useTripMembers';
import AddExpenseForm from './AddExpenseForm';
import { expenseFormPaperSx } from './expense-form.styles';
import type { AddExpenseInitialData, CreateExpensePayload } from '../types';

export interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateExpensePayload) => void;
  isLoading?: boolean;
  tripCurrency?: string;
  tripId?: number | string | null;
  initialData?: AddExpenseInitialData;
}

const AddExpenseDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
  tripId,
  initialData,
}: AddExpenseDialogProps) => {
  const t = useTranslations('expense');
  const formId = useId();
  const [isFormValid, setFormValid] = useState(false);
  const { activeMembers } = useActiveTripMembers({ tripId, enabled: open });

  return (
    <AppDialog
      mobilePresentation="screen"
      protectChanges
      open={open}
      onClose={onClose}
      closeDisabled={isLoading}
      title={t('dialog.addTitle')}
      titleAlign="left"
      paperSx={expenseFormPaperSx}
      icon={<ReceiptLongRoundedIcon />}
      maxWidth="sm"
      actions={
        <>
          <AppButton data-dialog-action="cancel" intent="secondary"
            onClick={onClose} disabled={isLoading} sx={{ minHeight: 44 }}>
            {t('form.cancel')}
          </AppButton>
          <AppButton data-dialog-action="primary" intent="primary" type="submit"
            form={formId} loading={isLoading} disabled={!isFormValid} sx={{ minHeight: 48 }}>
            {t('form.submitAdd')}
          </AppButton>
        </>
      }
    >
      <AddExpenseForm
        key={`${open ? '1' : '0'}-${initialData?.title || ''}-${initialData?.amount || ''}`}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        members={activeMembers}
        onSubmit={onSubmit}
        formId={formId}
        onValidityChange={setFormValid}
        initialData={initialData}
      />
    </AppDialog>
  );
};

export default AddExpenseDialog;
