'use client';

import { Stack, Typography, Skeleton, Alert } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  AppButton,
  AppCard,
  AppLinearProgress,
  AppMetricValue,
} from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import useTripBudgetSummary from '@/features/expense/hooks/useTripBudgetSummary';
import type { Trip } from '../../types';

const TripBudgetCard = ({ trip }: { trip: Trip }) => {
  const t = useTranslations('overview');
  const tNav = useTranslations('navigation');
  const { summary, isLoading, error, refetch } = useTripBudgetSummary({
    tripId: trip.id,
  });
  const isOver = Number(summary?.remainingBudget ?? 0) < 0;

  return (
    <AppCard
      component="section"
      sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '20px' }}
    >
      <Stack spacing={2.5}>
        <Typography component="h2" sx={{ fontSize: '18px', fontWeight: 700 }}>
          {t('tripBudget')}
        </Typography>
        {isLoading ? (
          <Skeleton variant="rounded" height={120} />
        ) : error ? (
          <Alert
            severity="error"
            action={
              <AppButton
                intent="text"
                onClick={() => void refetch().catch(() => undefined)}
              >
                {tNav('retry')}
              </AppButton>
            }
          >
            {t('budgetError')}
          </Alert>
        ) : summary ? (
          <>
            <Stack spacing={0.75}>
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {t('spent')}
              </Typography>
              <AppMetricValue
                tone={isOver ? 'error' : 'primary'}
                sx={{ fontSize: '28px' }}
              >
                {formatCurrency(summary.actualSpent, trip.baseCurrency)}
              </AppMetricValue>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  overflowWrap: 'anywhere',
                }}
              >
                {t('budgetTotal', {
                  amount: formatCurrency(
                    summary.totalBudget,
                    trip.baseCurrency,
                  ),
                })}
              </Typography>
            </Stack>
            <AppLinearProgress
              aria-label={t('spent')}
              value={summary.totalBudget > 0 ? summary.percentageUsed : 0}
              height={6}
              barColor={isOver ? 'error.main' : 'primary.main'}
            />
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}
            >
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                {isOver ? t('overBudget') : t('remaining')}
              </Typography>
              <AppMetricValue
                tone={isOver ? 'error' : 'success'}
                sx={{ fontSize: '14px' }}
              >
                {formatCurrency(
                  Math.abs(summary.remainingBudget),
                  trip.baseCurrency,
                )}
              </AppMetricValue>
            </Stack>
          </>
        ) : null}
        <AppButton component={Link} href="/expenses" intent="secondary" round>
          {t('manageBudget')}
        </AppButton>
      </Stack>
    </AppCard>
  );
};

export default TripBudgetCard;
