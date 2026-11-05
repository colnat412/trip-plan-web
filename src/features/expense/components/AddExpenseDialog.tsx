'use client';

import React, { useId } from 'react';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog } from '@/base/components/ui';
import { useTripMembers } from '@/features/trip/hooks/useTripMembers';
import AddExpenseForm from './AddExpenseForm';
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
  const { activeMembers } = useTripMembers({ tripId, enabled: open });

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      closeDisabled={isLoading}
      title={t('dialog.addTitle')}
      icon={<ReceiptLongRoundedIcon />}
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
        initialData={initialData}
      />
    </AppDialog>
  );
};

export default AddExpenseDialog;
