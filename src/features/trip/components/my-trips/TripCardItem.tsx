'use client';

import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { useTranslations } from 'next-intl';

import { AppActionMenu, AppButton } from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import { useUserContext } from '@/features/user/context/UserContext';
import TripStatusChip from './TripStatusChip';
import type { Trip } from '../../types';
import { calculateTripDays } from '../../utils/helper';

export interface TripCardItemProps {
  trip: Trip;
  isActive?: boolean;
  onSelect: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
}

const TripCardItem = ({
  trip,
  isActive = false,
  onSelect,
  onEdit,
  onDelete,
}: TripCardItemProps) => {
  const t = useTranslations('myTrips');
  const { user } = useUserContext();

  const isOwner =
    user?.id !== undefined &&
    trip.ownerId !== undefined &&
    String(trip.ownerId) === String(user.id);

  const durationDays = calculateTripDays(trip.startDate, trip.endDate);

  return (
    <Box
      onClick={() => onSelect(trip)}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1.5px solid',
        borderColor: isActive ? 'primary.main' : 'divider',
        bgcolor: isActive ? 'action.selected' : 'background.paper',
        transition: 'background-color 0.15s, border-color 0.15s',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          pt: '56.25%',
          overflow: 'hidden',
          bgcolor: 'action.hover',
        }}
      >
        <Avatar
          src={trip.coverUrl ?? undefined}
          alt={trip.name}
          variant="square"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          <Stack spacing={0.75} sx={{ alignItems: 'center' }}>
            <PhotoCameraOutlinedIcon sx={{ fontSize: 28, opacity: 0.45 }} />
            <Typography variant="caption">{t('noPhoto')}</Typography>
          </Stack>
        </Avatar>

        <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
          <TripStatusChip status={trip.status} />
        </Box>

        <Box
          sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(trip);
          }}
        >
          <Tooltip title={isActive ? t('activeTripTip') : t('makeActiveTip')}>
            <IconButton
              size="small"
              sx={{
                bgcolor: 'background.paper',
                color: isActive ? 'primary.main' : 'text.secondary',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                p: 0.5,
                '&:hover': {
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                },
              }}
            >
              {isActive ? (
                <StarRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <StarBorderRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 0.4,
            px: 0.85,
            py: 0.25,
            borderRadius: '6px',
            bgcolor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '10.5px',
            fontWeight: 700,
          }}
        >
          <CalendarTodayOutlinedIcon sx={{ fontSize: 11 }} />
          <span>
            {durationDays} {t('daysLabel') || 'ngày'}
          </span>
        </Box>
      </Box>

      <Box
        sx={{ p: 1.75, display: 'flex', flexDirection: 'column', gap: 0.75 }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box
            sx={{
              px: 0.85,
              py: 0.2,
              borderRadius: '6px',
              bgcolor: 'action.selected',
              color: 'primary.main',
              fontWeight: 800,
              fontSize: '11.5px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.25px',
            }}
          >
            {trip.baseCurrency}
          </Box>

          <Typography
            variant="caption"
            noWrap
            sx={{
              color: 'text.secondary',
              fontSize: '11.5px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {formatDateRange(trip.startDate, trip.endDate)}
          </Typography>
        </Stack>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.3,
            }}
          >
            {trip.name}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: 'text.secondary',
              fontSize: '11.5px',
              display: 'block',
              mt: 0.2,
            }}
          >
            {durationDays} {t('daysLabel')} {Math.max(1, durationDays - 1)}{' '}
            {t('nightsLabel')}
            {trip.description ? ` • ${trip.description}` : ''}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: 'center', minWidth: 0, color: 'text.secondary' }}
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
          <Typography
            noWrap
            variant="caption"
            sx={{ fontSize: '12px', fontWeight: 500 }}
          >
            {trip.destination || t('noDestination')}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            pt: 1,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              px: 0.85,
              py: 0.2,
              borderRadius: '5px',
              fontSize: '10.5px',
              fontWeight: 700,
              bgcolor: 'action.hover',
              color: isActive ? 'primary.main' : 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {isActive
              ? t('selected')
              : isOwner
                ? t('roleOwner')
                : t('roleMember')}
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', flexShrink: 0 }}
          >
            <AppButton
              size="small"
              intent={isActive ? 'primary' : 'secondary'}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(trip);
              }}
              startIcon={<FlightTakeoffRoundedIcon sx={{ fontSize: '13px' }} />}
              sx={{
                minHeight: { xs: 40, sm: 28 },
                px: 1.25,
                fontSize: '11.5px',
              }}
            >
              {t('viewTrip')}
            </AppButton>

            {isOwner && (
              <Box onClick={(e) => e.stopPropagation()}>
                <AppActionMenu
                  items={[
                    ...(onEdit
                      ? [
                          {
                            id: 'edit',
                            label: t('edit'),
                            icon: <EditRoundedIcon fontSize="small" />,
                            onClick: () => onEdit(trip),
                          },
                        ]
                      : []),
                    ...(onDelete
                      ? [
                          {
                            id: 'delete',
                            label: t('delete'),
                            icon: <DeleteOutlineRoundedIcon fontSize="small" />,
                            onClick: () => onDelete(trip),
                            danger: true,
                          },
                        ]
                      : []),
                  ]}
                />
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default TripCardItem;
