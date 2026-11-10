'use client';

import React from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/base/components/ui';
import { formatDate } from '@/base/utils';
import AddActivityForm from './AddActivityForm';
import type { CreateActivityPayload } from '../types';

export interface AddActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateActivityPayload) => void;
  isLoading?: boolean;
  tripCurrency?: string;
  planDate?: string | null;
}

const AddActivityDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
  planDate,
}: AddActivityDialogProps) => {
  const t = useTranslations('plan.dialog');

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('addTitle')}
      description={planDate ? formatDate(planDate) : undefined}
      icon={<AddCircleOutlineRoundedIcon />}
      maxWidth="sm"
    >
      <AddActivityForm
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

export default AddActivityDialog;
