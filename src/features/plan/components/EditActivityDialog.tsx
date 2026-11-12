'use client';

import React, { useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/base/components/ui';
import EditActivityForm from './EditActivityForm';
import type { PlanActivity, UpdateActivityPayload } from '../types';

export interface EditActivityDialogProps {
  open: boolean;
  onClose: () => void;
  activity: PlanActivity | null;
  onSubmit: (payload: UpdateActivityPayload) => void | Promise<unknown>;
  isLoading?: boolean;
  tripCurrency?: string;
}

const EditActivityDialog = ({
  open,
  onClose,
  activity,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
}: EditActivityDialogProps) => {
  const t = useTranslations('plan.dialog');
  const [saving, setSaving] = useState(false);

  if (!activity) return null;

  return (
    <AppDialog
      open={open}
      closeDisabled={isLoading || saving}
      onClose={onClose}
      title={t('editTitle')}
      icon={<EditRoundedIcon color="primary" />}
      maxWidth="sm"
    >
      <EditActivityForm
        key={activity.id}
        activity={activity}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onSavingChange={setSaving}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

export default EditActivityDialog;
