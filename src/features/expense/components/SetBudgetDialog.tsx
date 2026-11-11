'use client';

import React, { useId } from 'react';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { useTranslations } from 'next-intl';
import { AppButton, AppDialog } from '@/base/components/ui';
import SetBudgetForm from './SetBudgetForm';
import type { SetBudgetPayload, TripBudgetSummary } from '../types';

export interface SetBudgetDialogProps {
  open: boolean;
  summary: TripBudgetSummary | null;
  tripCurrency?: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: SetBudgetPayload) => void;
}

const SetBudgetDialog = ({
  open,
  summary,
  tripCurrency = 'VND',
  isLoading = false,
  onClose,
  onSubmit,
}: SetBudgetDialogProps) => {
  const t = useTranslations('expense');
  const formId = useId();

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      closeDisabled={isLoading}
      title={t('dialog.setBudgetTitle')}
      icon={<AccountBalanceWalletRoundedIcon />}
      maxWidth="sm"
      showSheetHandle
      actions={
        <>
          <AppButton data-dialog-action="cancel" intent="secondary" onClick={onClose} disabled={isLoading}>
            {t('form.cancel')}
          </AppButton>
          <AppButton data-dialog-action="primary" type="submit" form={formId} intent="primary" loading={isLoading} sx={{ minHeight: 44 }}>
            {t('dialog.saveBudget')}
          </AppButton>
        </>
      }
      mobileCloseLabel={t('form.cancel')}
    >
      <SetBudgetForm
        key={open ? 'open' : 'closed'}
        summary={summary}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        formId={formId}
      />
    </AppDialog>
  );
};

export default SetBudgetDialog;
