'use client';

import React, { useState } from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/base/components/ui';
import { formatDate } from '@/base/utils';
import AddActivityForm from './AddActivityForm';
import type { CreateActivityPayload } from '../types';

export interface AddActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateActivityPayload) => void | Promise<unknown>;
  isLoading?: boolean;
  tripCurrency?: string;
  planDate?: string | null;
  destination?: string;
}

const AddActivityDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
  planDate,
  destination,
}: AddActivityDialogProps) => {
  const t = useTranslations('plan.dialog');
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState({ open, discovering: true });
  if (step.open !== open) {
    setStep({ open, discovering: true });
  }

  return (
    <AppDialog
      mobilePresentation="screen"
      protectChanges
      open={open}
      closeDisabled={isLoading || saving}
      onClose={onClose}
      onBack={step.discovering ? undefined : () => setStep(current => ({ ...current, discovering: true }))}
      title={t('addTitle')}
      description={planDate ? formatDate(planDate) : undefined}
      icon={<AddCircleOutlineRoundedIcon />}
      maxWidth="sm"
    >
      <AddActivityForm
        discovering={step.discovering}
        onDiscoveringChange={(discovering) => setStep(current => ({ ...current, discovering }))}
        destination={destination}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onSavingChange={setSaving}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

export default AddActivityDialog;
