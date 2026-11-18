'use client';

import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { tonalSurface } from '@/base/theme/surfaces';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useTranslations } from 'next-intl';

import { AppAvatarStack } from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import { useTripContext } from '../../context/TripContext';
import { useTripMembers } from '../../hooks/useTripMembers';
import type { Trip } from '../../types';
import TripStatusBadge from '../TripStatusBadge';
import TripWeatherText from './TripWeatherText';

// Only the decorative seam is masked; text and member controls remain untouched.
const TICKET_EDGE_MASK = 'radial-gradient(circle 10px at left center, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 10px at right center, transparent 98%, #000) right / 51% 100% no-repeat';

interface ActiveTripBannerProps {
  trip: Trip;
  compact?: boolean;
  notice?: ReactNode;
}

const ActiveTripBanner = ({
  trip,
  compact = false,
  notice,
}: ActiveTripBannerProps) => {
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
        borderRadius: 'var(--app-radius-panel)',
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
          ...tonalSurface(theme, 22),
          color: trip.coverUrl ? theme.palette.common.white : tonalSurface(theme).color,
          backgroundColor: trip.coverUrl
            ? alpha(theme.palette.common.black, 0.64)
            : tonalSurface(theme, 22).backgroundColor,
          backgroundImage: trip.coverUrl ? `url(${JSON.stringify(trip.coverUrl)})` : 'none',
          backgroundBlendMode: 'multiply',
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
          {notice}
          <Typography
            component="h1"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: compact
                ? { xs: '22px', sm: '24px', lg: '26px' }
                : { xs: '26px', sm: '32px', lg: '36px' },
              fontWeight: 700,
              lineHeight: 1.12,
              color: 'inherit',
              overflowWrap: 'anywhere',
              maxWidth: 960,
            }}
          >
            {trip.name}
          </Typography>
        </Stack>
      </Box>
      <Box aria-hidden="true" sx={{
        height: 24, display: 'flex', alignItems: 'center', px: compact ? 2 : 3,
        bgcolor: 'background.paper', mask: TICKET_EDGE_MASK, WebkitMask: TICKET_EDGE_MASK,
        '&::before': { content: '""', width: '100%', borderTop: '1px dashed', borderColor: 'divider' },
        '@media (forced-colors: active)': { mask: 'none', WebkitMask: 'none' },
      }} />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        useFlexGap
        sx={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          px: compact ? { xs: 2, sm: 2.5 } : { xs: 2.5, sm: 3 },
          pb: compact ? { xs: 2, sm: 2.5 } : { xs: 2.5, sm: 3 },
          pt: 0.5,
          bgcolor: 'background.paper', color: 'text.primary',
          rowGap: '8px',
          columnGap: '16px',
          minWidth: 0,
        }}
      >
        {trip.destination && (
          <Stack
            direction="row"
            useFlexGap
            sx={{ alignItems: 'flex-start', gap: '6px', minWidth: 0 }}
          >
            <LocationOnRoundedIcon
              sx={{ fontSize: '16px', flexShrink: 0, mt: '2.5px' }}
            />
            <Typography
              sx={{
                fontSize: '14px',
                overflowWrap: 'anywhere',
                color: 'inherit',
                lineHeight: 1.5,
              }}
            >
              {trip.destination}
            </Typography>
          </Stack>
        )}
        <Stack
          direction="row"
          useFlexGap
          sx={{
            alignItems: 'center',
            gap: '12px',
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          <Stack
            direction="row"
            useFlexGap
            sx={{ alignItems: 'center', gap: '6px', minWidth: 0 }}
          >
            <CalendarTodayRoundedIcon
              sx={{ fontSize: '16px', flexShrink: 0 }}
            />
            <Typography
              sx={{ fontSize: '14px', color: 'inherit', lineHeight: 1.5 }}
            >
              {formatDateRange(trip.startDate, trip.endDate, 'DD/MM/YYYY')}
            </Typography>
          </Stack>
          <TripWeatherText
            key={`${trip.id}:${trip.startDate}:${trip.endDate}:${trip.destination}`}
            trip={trip}
          />
        </Stack>
      </Stack>
      {!compact && Boolean(trip.description?.trim()) && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            p: { xs: 2.5, sm: 3 },
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
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
            {trip.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ActiveTripBanner;
