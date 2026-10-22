'use client';

import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppLinearProgress } from '@/base/components/ui';
import { formatCurrency, formatDateRange } from '@/base/utils';
import useTripBudgetSummary from '@/features/expense/hooks/useTripBudgetSummary';
import { useTripContext } from '../../context/TripContext';
import { useTripMembers } from '../../hooks/useTripMembers';
import type { Trip } from '../../types';
import TripStatusBadge from '../TripStatusBadge';
import TripSummaryMetric from './TripSummaryMetric';

interface ActiveTripBannerProps {
  trip: Trip;
}

const ActiveTripBanner = ({ trip }: ActiveTripBannerProps) => {
  const t = useTranslations('overview');
  const tMembers = useTranslations('members');
  const { openMembers } = useTripContext();
  const { summary } = useTripBudgetSummary({ tripId: trip.id });
  const { activeMembers } = useTripMembers({ tripId: trip.id });

  const totalSpent = summary?.actualSpent ?? 0;
  const totalBudget = summary?.totalBudget ?? 0;
  const remaining = summary?.remainingBudget ?? 0;
  const percentageUsed = summary?.percentageUsed ?? 0;
  const isOver = totalBudget > 0 && totalSpent > totalBudget;

  let days = 1;
  if (trip.startDate && trip.endDate) {
    const diff =
      new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime();
    days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  const progressColor = isOver ? 'error.light' : 'primary.light';

  return (
    <Box
      component="section"
      sx={(theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        const overlay = `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.96)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 42%, ${alpha(theme.palette.primary.light, 0.2)} 72%, ${alpha(theme.palette.primary.dark, 0.12)} 100%)`;
        const fallback = `linear-gradient(120deg, ${palette.primary.dark}, ${palette.primary.main} 48%, ${palette.primary.light})`;

        return {
          width: '100%',
          minHeight: { xs: 440, sm: 420, md: 0 },
          flex: { md: '0.9 1 0' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: { xs: 4, md: 3 },
          overflow: 'hidden',
          borderRadius: '16px',
          border: 1,
          borderColor: alpha(theme.palette.common.white, 0.14),
          p: { xs: 2, sm: 3, md: 4 },
          color: theme.palette.common.white,
          backgroundColor: palette.primary.dark,
          backgroundImage: trip.coverUrl
            ? `${overlay}, url(${JSON.stringify(trip.coverUrl)})`
            : fallback,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '@media (max-height: 820px)': {
            flex: { md: '0.96 1 0' },
            gap: 2,
            p: 2,
          },
        };
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Stack spacing={1.5} sx={{ minWidth: 0, maxWidth: 820 }}>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Typography
              sx={(theme) => ({
                color: theme.palette.common.white,
                bgcolor: alpha(theme.palette.primary.light, 0.28),
                border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
                borderRadius: '999px',
                px: 1.25,
                py: 0.5,
                fontSize: '12px',
                fontWeight: 600,
              })}
            >
              {t('activeTrip')}
            </Typography>
            <TripStatusBadge status={trip.status} />
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '34px', sm: '44px', lg: '52px' },
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'inherit',
              overflowWrap: 'anywhere',
              '@media (max-height: 820px)': {
                fontSize: { md: '38px' },
                lineHeight: 1.1,
              },
            }}
          >
            {trip.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <LocationOnRoundedIcon sx={{ flexShrink: 0, fontSize: '18px' }} />
              <Typography
                sx={(theme) => ({
                  color: alpha(theme.palette.common.white, 0.86),
                  fontSize: { xs: '13px', sm: '15px' },
                  overflowWrap: 'anywhere',
                })}
              >
                {[
                  trip.destination,
                  formatDateRange(trip.startDate, trip.endDate),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Typography>
            </Stack>

            <AppButton
              intent="secondary"
              size="small"
              onClick={() => openMembers(false)}
              startIcon={<GroupRoundedIcon sx={{ fontSize: '18px' }} />}
              sx={(theme) => ({
                flexShrink: 0,
                color: theme.palette.common.white,
                bgcolor: alpha(theme.palette.common.white, 0.12),
                borderColor: alpha(theme.palette.common.white, 0.28),
                '&:hover': {
                  color: theme.palette.common.white,
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  borderColor: alpha(theme.palette.common.white, 0.28),
                },
              })}
            >
              {tMembers('dialogTitle')}
            </AppButton>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          gap: { xs: 2.5, md: 0 },
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: '14px',
          bgcolor: alpha(theme.palette.primary.dark, 0.52),
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          backdropFilter: 'blur(16px)',
          '@media (max-height: 820px)': {
            p: 1.5,
          },
        })}
      >
        <Stack
          spacing={1.25}
          sx={{
            flex: { md: '1.35 1 0' },
            minWidth: 0,
            pr: { md: 3 },
          }}
        >
          <Typography
            sx={(theme) => ({
              color: alpha(theme.palette.common.white, 0.78),
              fontSize: { xs: '12px', sm: '14px' },
            })}
          >
            {t('spent')}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}
          >
            <Typography
              sx={{
                color: isOver ? 'error.light' : 'inherit',
                fontFamily: 'var(--font-mono)',
                fontSize: { xs: '24px', sm: '30px' },
                fontWeight: 700,
                lineHeight: 1.15,
                '@media (max-height: 820px)': {
                  fontSize: { md: '22px' },
                },
              }}
            >
              {formatCurrency(totalSpent, trip.baseCurrency)}
            </Typography>
            <Typography
              sx={(theme) => ({
                color: alpha(theme.palette.common.white, 0.82),
                fontFamily: 'var(--font-mono)',
                fontSize: { xs: '13px', sm: '16px' },
                fontWeight: 500,
              })}
            >
              / {formatCurrency(totalBudget, trip.baseCurrency)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <AppLinearProgress
              value={totalBudget > 0 ? percentageUsed : 0}
              height={8}
              barColor={progressColor}
              sx={(theme) => ({
                flexGrow: 1,
                bgcolor: alpha(theme.palette.common.white, 0.22),
              })}
            />
            <Typography
              sx={(theme) => ({
                flexShrink: 0,
                color: alpha(theme.palette.common.white, 0.82),
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
              })}
            >
              {Math.round(percentageUsed)}%
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flex: { md: '2 1 0' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            minWidth: 0,
          }}
        >
          <TripSummaryMetric
            inverted
            label={t('remaining')}
            value={formatCurrency(remaining, trip.baseCurrency)}
            danger={isOver}
            icon={<AccountBalanceWalletRoundedIcon />}
          />
          <TripSummaryMetric
            inverted
            label={t('averagePerDay')}
            value={formatCurrency(totalSpent / days, trip.baseCurrency)}
            icon={<BarChartRoundedIcon />}
            divider
          />
          <TripSummaryMetric
            inverted
            label={t('memberCount')}
            value={String(activeMembers.length)}
            icon={<GroupRoundedIcon />}
            divider
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ActiveTripBanner;
