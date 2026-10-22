'use client';

import { Box, Skeleton, Stack, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppPageContainer } from '@/base/components/ui';
import { useTripContext } from '../context/TripContext';
import ActiveTripBanner from './overview/ActiveTripBanner';
import CategoryList from './overview/CategoryList';
import EmptyTripState from './overview/EmptyTripState';
import RecentExpenseList from './overview/RecentExpenseList';

const Overview = () => {
  const t = useTranslations('overview');
  const { trips, activeTrip, isLoading, openCreateTrip } = useTripContext();

  if (isLoading) {
    return (
      <AppPageContainer
        sx={{
          height: { md: '100%' },
          minHeight: { md: 0 },
          overflow: { md: 'hidden' },
        }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          sx={{
            flex: { md: '0.9 1 0' },
            minHeight: { xs: 365, md: 0 },
            borderRadius: '16px',
          }}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ flex: { md: '1.1 1 0' }, minHeight: { md: 0 } }}
        >
          <Skeleton
            variant="rounded"
            width="100%"
            height={300}
            sx={{ borderRadius: '16px' }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={300}
            sx={{ borderRadius: '16px' }}
          />
        </Stack>
      </AppPageContainer>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <AppPageContainer>
        <EmptyTripState onCreateTrip={openCreateTrip} />
      </AppPageContainer>
    );
  }

  const currentTrip = activeTrip || trips[0];

  return (
    <AppPageContainer
      sx={{
        height: { md: '100%' },
        minHeight: { md: 0 },
        overflow: { md: 'hidden' },
        '@media (max-height: 820px)': {
          p: 2,
          gap: 2,
        },
      }}
    >
      <ActiveTripBanner trip={currentTrip} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          gap: 3,
          alignItems: 'stretch',
          flex: { md: '1.1 1 0' },
          minHeight: { md: 0 },
          '@media (max-height: 820px)': {
            flex: { md: '1.04 1 0' },
            gap: 2,
          },
        }}
      >
        <Stack
          component="section"
          spacing={0}
          sx={{
            flex: { xs: '1 1 auto', md: '1 1 0', xl: '7 1 0' },
            minWidth: 0,
            p: { xs: 2, md: 2.5, xl: 3 },
            border: 1,
            borderColor: 'divider',
            borderRadius: '16px',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            height: { md: '100%' },
            gap: 2.5,
            '@media (max-height: 820px)': {
              gap: 1,
              p: 2,
            },
          }}
        >
          <Typography
            component="h2"
            sx={{ color: 'text.primary', fontSize: '18px', fontWeight: 700 }}
          >
            {t('spendingByCategory')}
          </Typography>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: { xs: 'visible', md: 'auto' },
              pr: { md: 0.5 },
              scrollbarGutter: 'stable',
            }}
          >
            <CategoryList
              tripId={currentTrip.id}
              currency={currentTrip.baseCurrency}
            />
          </Box>
        </Stack>

        <Stack
          component="section"
          spacing={0}
          sx={{
            flex: { xs: '1 1 auto', md: '1 1 0', xl: '5 1 0' },
            minWidth: 0,
            p: { xs: 2, md: 2.5, xl: 3 },
            border: 1,
            borderColor: 'divider',
            borderRadius: '16px',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            height: { md: '100%' },
            gap: 1,
            '@media (max-height: 820px)': {
              p: 2,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography
              component="h2"
              sx={{ color: 'text.primary', fontSize: '18px', fontWeight: 700 }}
            >
              {t('recentTitle')}
            </Typography>
            <Typography
              component={Link}
              href="/expenses"
              sx={{
                color: 'primary.main',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('viewAll')}
              <ChevronRightRoundedIcon sx={{ fontSize: '18px' }} />
            </Typography>
          </Stack>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: { xs: 'visible', md: 'auto' },
              pr: { md: 0.5 },
              scrollbarGutter: 'stable',
            }}
          >
            <RecentExpenseList
              tripId={currentTrip.id}
              currency={currentTrip.baseCurrency}
            />
          </Box>
        </Stack>
      </Box>
    </AppPageContainer>
  );
};

export default Overview;
