'use client';

import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useTranslations } from 'next-intl';

import { AppAvatarStack } from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import { useTripContext } from '../../context/TripContext';
import { useTripMembers } from '../../hooks/useTripMembers';
import type { Trip } from '../../types';
import TripStatusBadge from '../TripStatusBadge';

interface ActiveTripBannerProps {
  trip: Trip;
  compact?: boolean;
}

const ActiveTripBanner = ({ trip, compact = false }: ActiveTripBannerProps) => {
  const t = useTranslations('overview');
  const tMembers = useTranslations('members');
  const { openMembers, isMembersOpen } = useTripContext();
  const { activeMembers, isLoading, isStale, error } = useTripMembers({
    tripId: trip.id,
    enabled: !isMembersOpen,
  });

  return (
    <Box
      component="section"
      aria-label={trip.name}
      sx={{
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: compact ? { xs: 160, md: 190 } : { xs: 300, md: 340 },
          gap: compact ? 2 : 5,
          p: compact ? { xs: 2, sm: 2.5 } : { xs: 2.5, sm: 4, md: 5 },
          color: theme.palette.common.white,
          bgcolor: 'primary.dark',
          backgroundImage: trip.coverUrl
            ? `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.18)}, ${alpha(theme.palette.common.black, 0.76)}), url(${JSON.stringify(trip.coverUrl)})`
            : `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        })}
      >
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
          <TripStatusBadge status={trip.status} />
          <AppAvatarStack
            items={!isStale && !error ? activeMembers : []}
            loading={isLoading || (isStale && !error)}
            label={
              error || isStale
                ? tMembers('dialogTitle')
                : tMembers('viewMembers', { count: activeMembers.length })
            }
            onClick={() => openMembers(false)}
          />
        </Stack>
        <Stack spacing={compact ? 1 : 2}>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: compact
                ? { xs: '24px', sm: '28px', lg: '32px' }
                : { xs: '30px', sm: '40px', lg: '48px' },
              fontWeight: 800,
              lineHeight: 1.12,
              color: 'inherit',
              overflowWrap: 'anywhere',
              maxWidth: 960,
            }}
          >
            {trip.name}
          </Typography>
          <Stack
            direction="row"
            useFlexGap
            spacing={2}
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            {trip.destination && (
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: 'center', minWidth: 0 }}
              >
                <LocationOnRoundedIcon
                  sx={{ fontSize: '18px', flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontSize: '14px',
                    overflowWrap: 'anywhere',
                    color: 'inherit',
                  }}
                >
                  {trip.destination}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <CalendarTodayRoundedIcon
                sx={{ fontSize: '16px', flexShrink: 0 }}
              />
              <Typography sx={{ fontSize: '14px', color: 'inherit' }}>
                {formatDateRange(trip.startDate, trip.endDate, 'DD/MM/YYYY')}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {!compact && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            p: { xs: 2.5, sm: 3 },
            bgcolor: 'background.paper',
            border: 1,
            borderTop: 0,
            borderColor: 'divider',
            borderRadius: '0 0 24px 24px',
          }}
        >
          <Typography
            sx={{
              flex: 1,
              minWidth: 0,
              fontSize: '14px',
              color: 'text.secondary',
              lineHeight: 1.7,
              overflowWrap: 'anywhere',
              whiteSpace: 'pre-line',
            }}
          >
            {trip.description || t('journeyIntro')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ActiveTripBanner;
