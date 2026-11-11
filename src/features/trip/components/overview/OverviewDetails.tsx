'use client';

import { Box, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import {
  AppCard,
  AppSectionHeader,
  AppSectionLink,
} from '@/base/components/ui';
import type { Trip } from '../../types';
import TripItineraryPreview from './TripItineraryPreview';
import TripBudgetCard from './TripBudgetCard';
import RecentExpenseList from './RecentExpenseList';
import TemplateLibrary from '@/features/plan-template/components/TemplateLibrary';

const OverviewDetails = ({ trip, now }: { trip: Trip; now: Date | null }) => {
  const t = useTranslations('overview');
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  return (
    <Stack spacing={3} sx={{ width: '100%', minWidth: 0 }}>
      <TripItineraryPreview key={trip.id} trip={trip} now={now} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          gap: 3,
          minWidth: 0,
        }}
      >
        <Box sx={{ flex: { xs: '0 0 auto', md: '1 1 0%' }, minWidth: 0 }}>
          <TripBudgetCard key={trip.id} trip={trip} compact={!desktop} />
        </Box>
        <AppCard
          component="section"
          sx={{
            flex: { xs: '0 0 auto', md: '1 1 0%' },
            minWidth: 0,
            p: { xs: 2, md: 3 },
            borderRadius: '20px',
          }}
        >
          <Stack spacing={1} sx={{ minWidth: 0 }}>
            <AppSectionHeader
              title={t('recentTitle')}
              actions={
                <AppSectionLink href="/expenses">{t('viewAll')}</AppSectionLink>
              }
            />
            <RecentExpenseList
              key={trip.id}
              tripId={trip.id}
              currency={trip.baseCurrency}
            />
          </Stack>
        </AppCard>
      </Box>
      <TemplateLibrary compact />
    </Stack>
  );
};

export default OverviewDetails;
