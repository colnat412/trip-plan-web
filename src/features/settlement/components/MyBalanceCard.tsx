'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppCard, AppMetricValue } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { BalanceStatus } from '../types';

export interface MyBalanceCardProps {
  myBalance: number;
  myStatus: BalanceStatus;
  currency: string;
  totalExpenses: number;
  totalSettled: number;
  onOpenRecordPayment: () => void;
}

const MyBalanceCard = ({
  myBalance,
  myStatus,
  currency,
  totalExpenses,
  totalSettled,
  onOpenRecordPayment,
}: MyBalanceCardProps) => {
  const t = useTranslations('settlement');

  const isOwed = myStatus === 'OWED';
  const isOwes = myStatus === 'OWES';

  const badgeBg = isOwed
    ? 'success.light'
    : isOwes
      ? 'error.light'
      : 'action.hover';

  const badgeColor = isOwed
    ? 'success.dark'
    : isOwes
      ? 'error.dark'
      : 'text.secondary';

  const statusIcon = isOwed ? (
    <ArrowDownwardRoundedIcon sx={{ fontSize: '18px', color: badgeColor }} />
  ) : isOwes ? (
    <ArrowUpwardRoundedIcon sx={{ fontSize: '18px', color: badgeColor }} />
  ) : (
    <CheckCircleOutlineRoundedIcon
      sx={{ fontSize: '18px', color: badgeColor }}
    />
  );

  const statusLabel = isOwed
    ? t('myStatusOwed')
    : isOwes
      ? t('myStatusOwes')
      : t('myStatusSettled');

  const statusDesc = isOwed
    ? t('myStatusOwedDesc')
    : isOwes
      ? t('myStatusOwesDesc')
      : t('myStatusSettledDesc');

  return (
    <AppCard
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '4px solid',
        borderLeftColor: isOwed
          ? 'success.main'
          : isOwes
            ? 'error.main'
            : 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Stack spacing={1} sx={{ minWidth: 0, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceWalletRoundedIcon
                sx={{ fontSize: '20px', color: 'primary.main' }}
              />
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'text.secondary',
                }}
              >
                {t('myBalanceTitle')}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
                minWidth: 0,
              }}
            >
              <AppMetricValue
                tone={isOwed ? 'success' : isOwes ? 'error' : 'primary'}
                sx={{ fontSize: { xs: '28px', sm: '36px' } }}
              >
                {formatCurrency(Math.abs(myBalance), currency)}
              </AppMetricValue>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '999px',
                  bgcolor: badgeBg,
                  color: badgeColor,
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {statusIcon}
                <span>{statusLabel}</span>
              </Box>
            </Box>

            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {statusDesc}
            </Typography>
          </Stack>

          {/* <AppButton
            intent="primary"
            startIcon={<AddRoundedIcon sx={{ fontSize: '18px' }} />}
            onClick={onOpenRecordPayment}
          >
            {t('recordPayment')}
          </AppButton> */}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ flex: '1 1 160px', minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {t('totalSpent')}
            </Typography>
            <AppMetricValue tone="primary" sx={{ fontSize: '16px' }}>
              {formatCurrency(totalExpenses, currency)}
            </AppMetricValue>
          </Box>

          <Box sx={{ flex: '1 1 160px', minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {t('totalSettled')}
            </Typography>
            <AppMetricValue tone="success" sx={{ fontSize: '16px' }}>
              {formatCurrency(totalSettled, currency)}
            </AppMetricValue>
          </Box>
        </Box>
      </Stack>
    </AppCard>
  );
};

export default MyBalanceCard;
