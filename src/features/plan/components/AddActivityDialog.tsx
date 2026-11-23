'use client';

import React, { useId, useState } from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppDialog } from '@/base/components/ui';
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
  initialValues?: Pick<CreateActivityPayload, 'title' | 'location' | 'category'>;
}

const AddActivityDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
  planDate,
  destination,
  initialValues,
}: AddActivityDialogProps) => {
  const t = useTranslations('plan.dialog');
  const j = useTranslations('journey');
  const formId = useId();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState({ open, discovering: !initialValues });
  if (step.open !== open) {
    setStep({ open, discovering: !initialValues });
  }

  return (
    <AppDialog
      mobilePresentation="screen"
      protectChanges
      open={open}
      closeDisabled={isLoading || saving}
      onClose={onClose}
      onBack={step.discovering || initialValues ? undefined : () => setStep(current => ({ ...current, discovering: true }))}
      title={t('addTitle')}
      description={planDate ? formatDate(planDate) : undefined}
      icon={<AddCircleOutlineRoundedIcon />}
      maxWidth="sm"
      contentScroll={step.discovering ? 'children' : 'dialog'}
      paperSx={step.discovering ? { height: { sm: 'var(--app-dialog-max-height)' } } : undefined}
      actions={step.discovering ? (
        <AppButton intent="secondary" fullWidth disabled={isLoading || saving}
          onClick={() => setStep(current => ({ ...current, discovering: false }))}>
          {j('manual')}
        </AppButton>
      ) : (
        <>
          <AppButton data-dialog-action="cancel" intent="secondary" onClick={onClose} disabled={isLoading || saving}>
            {t('cancelBtn')}
          </AppButton>
          <AppButton data-dialog-action="primary" type="submit" form={formId} intent="primary" loading={isLoading || saving}>
            {t('saveBtn')}
          </AppButton>
        </>
      )}
    >
      <AddActivityForm
        formId={formId}
        initialValues={initialValues}
        discovering={step.discovering}
        onDiscoveringChange={(discovering) => setStep(current => ({ ...current, discovering }))}
        destination={destination}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onSavingChange={setSaving}
      />
    </AppDialog>
  );
};

export default AddActivityDialog;
