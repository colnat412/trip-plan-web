'use client';
import { useId, useState } from 'react';
import Link from 'next/link';
import { Box, Stack, Typography, Collapse, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { AppButton, AppCard } from '@/base/components/ui';
import type { Trip } from '../../types';
import TripItineraryPreview from './TripItineraryPreview';
import TripBudgetCard from './TripBudgetCard';
import RecentExpenseList from './RecentExpenseList';
const OverviewDetails = ({ trip }: { trip: Trip }) => {
  const t = useTranslations('overview');
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const details = (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: 'flex-start',
        gap: 3,
      }}
    >
      <Box
        sx={{ flex: '7 1 0', width: { xs: '100%', lg: 'auto' }, minWidth: 0 }}
      >
        <TripItineraryPreview key={trip.id} trip={trip} />
      </Box>
      <Stack
        spacing={3}
        sx={{ flex: '4 1 0', width: { xs: '100%', lg: 'auto' }, minWidth: 0 }}
      >
        {desktop && <TripBudgetCard key={trip.id} trip={trip} />}
        <AppCard
          component="section"
          sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '20px' }}
        >
          <Stack spacing={2}>
            <Typography
              component="h2"
              sx={{ fontSize: '18px', fontWeight: 700 }}
            >
              {t('recentTitle')}
            </Typography>
            <RecentExpenseList
              key={trip.id}
              tripId={trip.id}
              currency={trip.baseCurrency}
            />
          </Stack>
        </AppCard>
      </Stack>
    </Box>
  );
  if (desktop) return details;
  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      <TripBudgetCard trip={trip} compact />
      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
        <AppButton
          wrapLabel
          component={Link}
          href="/plan"
          intent="primary"
          sx={{ flex: '1 1 130px' }}
        >
          {t('openItinerary')}
        </AppButton>
        <AppButton
          wrapLabel
          component={Link}
          href="/expenses"
          intent="secondary"
          sx={{ flex: '1 1 130px' }}
        >
          {t('manageBudget')}
        </AppButton>
      </Stack>
      <AppButton
        intent="text"
        wrapLabel
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((value) => !value)}
      >
        {t(expanded ? 'hideDetails' : 'showDetails')}
      </AppButton>
      <Collapse id={contentId} in={expanded} mountOnEnter unmountOnExit>
        {details}
      </Collapse>
    </Stack>
  );
};
export default OverviewDetails;
