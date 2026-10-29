'use client';

import React from 'react';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppCard, AppEmptyState } from '@/base/components/ui';

export interface PlanEmptyStateProps {
  onAddActivity?: () => void;
  readOnly?: boolean;
}

const PlanEmptyState = ({
  onAddActivity,
  readOnly = false,
}: PlanEmptyStateProps) => {
  const t = useTranslations('plan');

  return (
    <AppCard component="section" sx={{ p: { xs: 2, md: 3 }, borderRadius: '20px' }}>
      <AppEmptyState
        icon={<EventAvailableRoundedIcon />}
        title={t('emptyActivities')}
        description={t('emptyActivitiesDesc')}
        action={!readOnly && onAddActivity ? (
        <AppButton
          intent="primary"
          size="medium"
          startIcon={<AddRoundedIcon />}
          onClick={onAddActivity}
        >
          {t('addFirstActivity')}
        </AppButton>
        ) : undefined}
      />
    </AppCard>
  );
};

export default PlanEmptyState;
