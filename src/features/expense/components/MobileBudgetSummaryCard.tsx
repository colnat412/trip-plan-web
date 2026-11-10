'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import {
  AppLoadingState,
  AppButton,
  AppCard,
  AppLinearProgress,
  AppMetricValue,
  AppAmountRatio,
} from '@/base/components/ui';

import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useLocale, useTranslations } from 'next-intl';

import { formatCurrency, getBudgetBalanceTone } from '@/base/utils';
import type { TripBudgetSummary } from '../types';

export interface MobileBudgetSummaryCardProps {
  summary: TripBudgetSummary | null;
  currency?: string;
  onOpenSetBudget?: () => void;
  isLoading?: boolean;
  hasError?: boolean;
  errorStatus?: number | null;
  onRetry?: () => unknown | Promise<unknown>;
}

const MobileBudgetSummaryCard = ({
  summary,
  currency = 'VND',
  onOpenSetBudget,
  isLoading = false,
  hasError = false,
  errorStatus,
  onRetry,
}: MobileBudgetSummaryCardProps) => {
  const t = useTranslations('expense.metrics');
  const locale = useLocale();
  const total = summary?.totalBudget ?? 0;
  const spent = summary?.actualSpent ?? 0;
  const remaining = summary?.remainingBudget ?? 0;
  const hasBudget = total > 0;
  const over = hasBudget && remaining < 0;
  const percentage = summary?.percentageUsed ?? 0;
  const color = over
    ? 'error.main'
    : percentage >= 85
      ? 'warning.main'
      : 'primary.main';
  const curr = summary?.currency || currency;
  const ratio = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(percentage / 100);
  const statusTextSx = (theme: Theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    return {
      color: over ? palette.error.main : palette.text.secondary,
      ...theme.applyStyles('dark', {
        color: over ? palette.error.light : palette.text.secondary,
      }),
    };
  };
  const unavailable = hasError || (!isLoading && !summary);

  return (
    <AppCard
      component="section"
      aria-label={t('mobileTitle')}
      sx={{
        display: { xs: 'block', sm: 'none' },
        minWidth: 0,
        borderRadius: '16px',
        p: 2,
        overflowWrap: 'anywhere',
      }}
    >
      {isLoading ? (
        <AppLoadingState />
      ) : unavailable ? (
        <AppErrorState status={errorStatus} onRetry={onRetry} compact />
      ) : (
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            useFlexGap
            spacing={1}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: '15px',
                fontWeight: 700,
                flex: '1 1 160px',
                minWidth: 0,
              }}
            >
              {t('mobileTitle')}
            </Typography>
            {onOpenSetBudget &&
              (hasBudget ? (
                <Tooltip title={t('editBudgetLabel')}>
                  <IconButton
                    aria-label={t('editBudgetLabel')}
                    onClick={onOpenSetBudget}
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      color: 'primary.main',
                    }}
                  >
                    <SettingsRoundedIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <AppButton
                  intent="text"
                  size="small"
                  wrapLabel
                  onClick={onOpenSetBudget}
                  sx={{ minHeight: 44, fontSize: '12px' }}
                >
                  {t('setupBudget')}
                </AppButton>
              ))}
          </Stack>
          <Stack spacing={0.5}>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {t('compactSpent')}
            </Typography>
            <AppAmountRatio
              amount={spent}
              total={total > 0 ? total : null}
              currency={curr}
              tone={over ? 'error' : 'primary'}
              label={t('spendingRatioLabel')}
            />
          </Stack>
          {hasBudget ? (
            <>
              <AppLinearProgress
                value={percentage}
                height={8}
                barColor={color}
                aria-label={t('mobileTitle')}
                aria-valuetext={t('usedRatio', { percent: ratio })}
              />
              <Stack
                direction="row"
                useFlexGap
                spacing={0.75}
                sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: 'text.secondary',
                    minWidth: 0,
                  }}
                >
                  {/* {t('totalBudget')}: {formatCurrency(total, curr, locale)} */}
                </Typography>
                <Typography
                  sx={[
                    statusTextSx,
                    { fontSize: '12px', fontWeight: over ? 700 : 500 },
                  ]}
                >
                  {t('usedRatio', { percent: ratio })}
                </Typography>
              </Stack>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: 0.75,
                  borderTop: 1,
                  borderColor: 'divider',
                  pt: 1.5,
                }}
              >
                <Typography sx={[statusTextSx, { fontSize: '13px' }]}>
                  {t(over ? 'overBudget' : 'compactRemaining')}
                </Typography>
                <AppMetricValue
                  tone={getBudgetBalanceTone(total, remaining)}
                  sx={{
                    fontSize: '17px',
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {formatCurrency(Math.abs(remaining), curr, locale)}
                </AppMetricValue>
              </Box>
            </>
          ) : (
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {t('noBudgetHint')}
            </Typography>
          )}
        </Stack>
      )}
    </AppCard>
  );
};
export default MobileBudgetSummaryCard;
