'use client';

import { Box } from '@mui/material';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { useLocale, useTranslations } from 'next-intl';
import {
  AppButton,
  AppMetricValue,
  AppSectionHeader,
} from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { PlanDay } from '../types';

export default function PlanDayToolbar({
  day,
  currency,
  onResetDay,
}: {
  day: PlanDay;
  currency: string;
  onResetDay?: () => void;
}) {
  const t = useTranslations('plan');
  const locale = useLocale();
  return (
    <AppSectionHeader
      title={t('dayTab', { day: day.dayNumber })}
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
      actions={
        onResetDay && day.totalActivities > 0 ? (
          <AppButton
            intent="danger"
            size="medium"
            startIcon={<RestartAltRoundedIcon />}
            onClick={onResetDay}
            sx={{
              minHeight: 44,
              minWidth: { xs: 0, md: 64 },
              px: { xs: 1, md: 2 },
              fontSize: { xs: '12px', md: '14px' },
              '& .MuiButton-startIcon': { mr: { xs: 0.5, md: 1 }, ml: 0 },
              '& .MuiButton-startIcon > svg': { fontSize: { xs: 16, md: 20 } },
            }}
          >
            {t('resetDayBtn')}
          </AppButton>
        ) : undefined
      }
    />
  );
}
