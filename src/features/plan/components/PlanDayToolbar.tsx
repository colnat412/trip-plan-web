'use client';

import { Box } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { AppMetricValue, AppSectionHeader } from '@/base/components/ui';
import { formatCurrency, formatDate } from '@/base/utils';
import type { PlanDay } from '../types';

interface PlanDayToolbarProps {
  day: PlanDay;
  currency: string;
  onResetDay?: () => void;
  onOptimizeRoute?: () => void;
  isLoadingRoute?: boolean;
}

const PlanDayToolbar = ({ day, currency }: PlanDayToolbarProps) => {
  const t = useTranslations('plan');
  const locale = useLocale();
  return (
    <AppSectionHeader
      title={day.planDate ? formatDate(day.planDate) : '—'}
      subtitle={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            fontSize: 13,
          }}
        >
          <span>{t('activityCount', { count: day.totalActivities })}</span>
          {day.totalEstimatedCost > 0 && (
            <span>
              {t('dayTotalCostLabel')}:{' '}
              <AppMetricValue component="span">
                {formatCurrency(day.totalEstimatedCost, currency, locale)}
              </AppMetricValue>
            </span>
          )}
        </Box>
      }
    />
  );
};

export default PlanDayToolbar;
