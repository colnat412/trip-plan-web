'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import {
  AppLoadingState,
  AppCard,
  AppLinearProgress,
  AppMetricValue,
  AppSectionHeader,
  AppSectionLink,
} from '@/base/components/ui';

import { Box, Stack, Typography, Tooltip } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { useLocale, useTranslations } from 'next-intl';

import {
  formatCompactCurrency,
  formatCurrency,
  getBudgetBalanceTone,
} from '@/base/utils';
import useTripBudgetSummary from '@/features/expense/hooks/useTripBudgetSummary';
import type { Trip } from '../../types';

const TripBudgetCard = ({
  trip,
  compact = false,
}: {
  trip: Trip;
  compact?: boolean;
}) => {
  const locale = useLocale();
  const t = useTranslations('overview');
  const tMetrics = useTranslations('expense.metrics');
  const { summary, isLoading, isStale, error, refetch } = useTripBudgetSummary({
    tripId: trip.id,
  });
  const hasBudget = Number(summary?.totalBudget ?? 0) > 0;
  const isOver = hasBudget && Number(summary?.remainingBudget ?? 0) < 0;
  const remainingTone = getBudgetBalanceTone(
    Number(summary?.totalBudget ?? 0),
    Number(summary?.remainingBudget ?? 0),
  );
  const currency = summary?.currency || trip.baseCurrency;
  const header = (
    <AppSectionHeader
      title={t('tripBudget')}
      actions={
        <AppSectionLink href="/expenses">{t('manageBudget')}</AppSectionLink>
      }
    />
  );

  if (compact) {
    const overBudget = hasBudget && isOver;
    const metrics = [
      {
        id: 'budget',
        label: t('budget'),
        amount: hasBudget ? summary?.totalBudget : null,
        tone: 'primary' as const,
        icon: <AccountBalanceWalletOutlinedIcon fontSize="small" />,
      },
      {
        id: 'spent',
        label: tMetrics('compactSpent'),
        amount: summary?.actualSpent,
        tone: overBudget ? ('error' as const) : ('primary' as const),
        icon: <PaymentsOutlinedIcon fontSize="small" />,
      },
      {
        id: 'remaining',
        label: t(overBudget ? 'overBudget' : 'remaining'),
        amount: hasBudget ? Math.abs(summary?.remainingBudget ?? 0) : null,
        tone: remainingTone,
        icon: <SavingsOutlinedIcon fontSize="small" />,
      },
    ];
    return (
      <Stack
        component="section"
        aria-label={t('tripBudget')}
        spacing={1.5}
        sx={{ width: '100%', minWidth: 0 }}
      >
        {header}
        {isLoading || (isStale && !error) ? (
          <AppLoadingState />
        ) : error || !summary ? (
          <AppErrorState
            status={error?.status}
            onRetry={() => refetch()}
            compact
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 1,
            }}
          >
            {metrics.map(({ id, label, amount, tone, icon }) => {
              const fullValue =
                amount == null
                  ? tMetrics('noLimit')
                  : formatCurrency(amount, currency, locale);
              return (
                <AppCard
                  key={id}
                  variant={id === 'spent' ? 'primary' : 'outlined'}
                  sx={{ minWidth: 0, p: { xs: 1, sm: 1.5 }, height: '100%' }}
                  contentSx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 0.5,
                      color: `${tone}.main`,
                    }}
                  >
                    {icon}
                    <Typography
                      component="span"
                      sx={{ fontSize: '12px', color: 'text.secondary' }}
                    >
                      {currency}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: 'text.secondary',
                      overflowWrap: 'anywhere',
                      flex: 1,
                    }}
                  >
                    {label}
                  </Typography>
                  <Tooltip title={fullValue} describeChild>
                    <Box
                      component="span"
                      aria-label={`${label}: ${fullValue}`}
                      sx={{ minWidth: 0 }}
                    >
                      <AppMetricValue
                        tone={tone}
                        sx={{
                          fontSize: { xs: '15px', sm: '20px' },
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {amount == null
                          ? '—'
                          : formatCompactCurrency(amount, currency, locale)}
                      </AppMetricValue>
                    </Box>
                  </Tooltip>
                </AppCard>
              );
            })}
          </Box>
        )}
      </Stack>
    );
  }

  return (
    <AppCard
      component="section"
      sx={{ p: { xs: 2, md: 3 }, borderRadius: '20px' }}
    >
      <Stack spacing={2.5}>
        {header}
        {isLoading ? (
          <AppLoadingState />
        ) : error ? (
          <AppErrorState
            status={error?.status}
            onRetry={() => refetch()}
            compact
          />
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
                {formatCurrency(summary.actualSpent, trip.baseCurrency, locale)}
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
                    locale,
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
              <AppMetricValue tone={remainingTone} sx={{ fontSize: '14px' }}>
                {hasBudget
                  ? formatCurrency(
                      Math.abs(summary.remainingBudget),
                      trip.baseCurrency,
                      locale,
                    )
                  : '—'}
              </AppMetricValue>
            </Stack>
          </>
        ) : null}
      </Stack>
    </AppCard>
  );
};

export default TripBudgetCard;
