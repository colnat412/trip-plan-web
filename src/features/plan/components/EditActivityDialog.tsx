'use client';

import React, { useId, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppDialog } from '@/base/components/ui';
import EditActivityForm from './EditActivityForm';
import type { PlanActivity, UpdateActivityPayload } from '../types';

export interface EditActivityDialogProps {
  open: boolean;
  onClose: () => void;
  activity: PlanActivity | null;
  onSubmit: (payload: UpdateActivityPayload) => void | Promise<unknown>;
  isLoading?: boolean;
  tripCurrency?: string;
  destination?: string;
}

const EditActivityDialog = ({
  open,
  onClose,
  activity,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
  destination,
}: EditActivityDialogProps) => {
  const t = useTranslations('plan.dialog');
  const formId = useId();
  const [saving, setSaving] = useState(false);

  if (!activity) return null;

  return (
    <AppDialog
      mobilePresentation="screen"
      protectChanges
      open={open}
      closeDisabled={isLoading || saving}
      onClose={onClose}
      title={t('editTitle')}
      icon={<EditRoundedIcon color="primary" />}
      maxWidth="sm"
      actions={
        <>
          <AppButton data-dialog-action="cancel" intent="secondary" onClick={onClose} disabled={isLoading || saving}>
            {t('cancelBtn')}
          </AppButton>
          <AppButton data-dialog-action="primary" type="submit" form={formId} intent="primary" loading={isLoading || saving}>
            {t('saveBtn')}
          </AppButton>
        </>
      }
    >
      <EditActivityForm
        key={activity.id}
        formId={formId}
        activity={activity}
        tripCurrency={tripCurrency}
        destination={destination}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onSavingChange={setSaving}
      />
    </AppDialog>
  );
};

export default EditActivityDialog;
