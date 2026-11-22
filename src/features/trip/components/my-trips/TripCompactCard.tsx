'use client';

import { selectedSurface } from '@/base/theme/surfaces';

import { Box, ButtonBase, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useTranslations } from 'next-intl';
import { AppActionMenu, AppCard } from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import { calculateTripDays } from '../../utils/helper';
import { getTripCoverUrl } from '../../utils/trip-cover';
import type { TripCardItemProps } from './TripCardItem';

interface TripCompactCardProps extends TripCardItemProps {
  isOwner: boolean;
}

const TripCompactCard = ({ trip, isActive = false, isOwner, onSelect, onEdit, onDelete }: TripCompactCardProps) => {
  const t = useTranslations('myTrips');
  const durationDays = calculateTripDays(trip.startDate, trip.endDate);
  const coverUrl = getTripCoverUrl(trip);

  return (
    <AppCard
      onClick={() => onSelect(trip)}
      sx={(theme) => ({
        display: { xs: 'block', sm: 'none' },
        p: 0,
        minWidth: 0,
        cursor: 'pointer',
        borderColor: 'divider',
        color: theme.palette.common.white,
        backgroundColor: alpha(theme.palette.common.black, 0.64),
        backgroundImage: `url(${JSON.stringify(coverUrl)})`,
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '@media (prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)': {
          backgroundColor: theme.palette.common.black,
        },
      })}
      contentSx={{ display: 'flex', alignItems: 'stretch', minWidth: 0 }}
    >
      <ButtonBase
        onClick={(event) => {
          event.stopPropagation();
          onSelect(trip);
        }}
        aria-label={`${t('viewTrip')}: ${trip.name}`}
        aria-pressed={isActive}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'stretch',
          justifyContent: 'center', gap: 0.5, flex: 1, minWidth: 0,
          minHeight: 120, p: 1.5, textAlign: 'left', color: 'inherit',
          '&.Mui-focusVisible': {
            outline: '2px solid', outlineColor: 'currentColor', outlineOffset: -3,
            borderRadius: 'var(--app-radius-card)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          {isActive && <Box component="span" sx={(theme) => ({ ...selectedSurface(theme), display: 'inline-flex', p: 0.25, borderRadius: 'var(--app-radius-badge)' })}><StarRoundedIcon sx={{ fontSize: 16, flexShrink: 0 }} /></Box>}
          <Typography noWrap title={trip.name} sx={{ fontSize: '14px', fontWeight: 700, minWidth: 0, flex: 1 }}>
            {trip.name}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </Typography>
        <Typography noWrap title={trip.destination} sx={{ fontSize: '12px' }}>
          {trip.destination || t('noDestination')}
        </Typography>
        {trip.description && (
          <Typography noWrap title={trip.description} sx={{ fontSize: '11px' }}>
            {trip.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}>

          <Typography component="span" sx={{ fontSize: '11px' }}>
            {durationDays} {t('daysLabel')}{' '}
            {Math.max(1, durationDays - 1)} {t('nightsLabel')} · {trip.baseCurrency}
          </Typography>
        </Box>
      </ButtonBase>
      {isOwner && (onEdit || onDelete) && (
        <Box
          sx={(theme) => ({
            display: 'flex', alignItems: 'flex-start', flexShrink: 0, p: 0.75,
            '& .MuiIconButton-root': {
              width: 44, height: 44,
              borderRadius: 'var(--app-radius-control)',
              bgcolor: 'transparent',
              color: theme.palette.common.white,
              '&:hover': {
                bgcolor: 'transparent',
                color: theme.palette.common.white,
                '& .trip-menu-glyph': { bgcolor: alpha(theme.palette.common.black, 0.55) },
              },
              '&.Mui-focusVisible': {
                outline: '2px solid currentColor', outlineOffset: -2,
              },
            },
          })}
        >
          <AppActionMenu
            sheetTitle={trip.name}
            minTouchTarget
            triggerIcon={
              <Box
                component="span"
                className="trip-menu-glyph"
                sx={(theme) => ({
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 'var(--app-radius-small)',
                  bgcolor: alpha(theme.palette.common.black, 0.35),
                })}
              >
                <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
            }
            ariaLabel={`${t('colActions')}: ${trip.name}`}
            items={[
              ...(onEdit ? [{ id: 'edit', label: t('edit'), icon: <EditRoundedIcon fontSize="small" />, onClick: () => onEdit(trip) }] : []),
              ...(onDelete ? [{ id: 'delete', label: t('delete'), icon: <DeleteOutlineRoundedIcon fontSize="small" />, danger: true, onClick: () => onDelete(trip) }] : []),
            ]}
          />
        </Box>
      )}
    </AppCard>
  );
};

export default TripCompactCard;
