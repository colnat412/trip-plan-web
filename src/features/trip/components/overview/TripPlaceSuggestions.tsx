'use client';

import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { DEFAULT_TRAVEL_IMAGE } from '@/base/constants/media';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTranslations } from 'next-intl';
import {
  AppButton,
  AppDialog,
  AppErrorState,
  AppLoadingState,
  AppSectionHeader,
  AppSectionLink,
  AppSelect,
  AppToast,
} from '@/base/components/ui';
import { formatDate } from '@/base/utils';
import useActivityDiscovery from '@/features/plan/hooks/useActivityDiscovery';
import useTripPlan from '@/features/plan/hooks/useTripPlan';
import { useCreateActivity } from '@/features/plan/hooks/usePlanMutation';
import AddActivityDialog from '@/features/plan/components/AddActivityDialog';
import { useTripPermissions } from '../../hooks/useTripPermissions';
import {
  getPlaceAddress,
  getPlaceSuggestions,
  isPlaceInPlan,
  type PlaceSuggestion,
} from '../../utils/place-suggestions';
import type { Trip } from '../../types';

const TripPlaceSuggestions = ({
  trip,
  onActivityAdded,
}: {
  trip: Trip;
  onActivityAdded: () => void;
}) => {
  const t = useTranslations('overview.places');
  const p = useTranslations('plan');
  // Match the itinerary's membership permissions; completed trips remain editable.
  const writable = trip.status !== 'DELETED';
  const { canWrite } = useTripPermissions(trip.id);
  const discovery = useActivityDiscovery(
    trip.destination,
    'VISIT',
    '',
    false,
  );
  const plan = useTripPlan({ tripId: trip.id });
  const suggestions = getPlaceSuggestions(trip.destination, discovery.options);
  const days = plan.isStale || plan.error ? [] : (plan.plan?.days ?? []);
  const activities = days.flatMap((day) => day.activities ?? []);
  const [selected, setSelected] = useState<PlaceSuggestion | null>(null);
  const [dayId, setDayId] = useState('');
  const [editing, setEditing] = useState(false);
  const [added, setAdded] = useState<PlaceSuggestion[]>([]);
  const [saved, setSaved] = useState(false);
  const chosenDay = days.find((day) => day.id === dayId);
  const close = () => {
    setSelected(null);
    setEditing(false);
  };
  const mutation = useCreateActivity({
    tripId: trip.id,
    dayId,
    options: {
      onSuccess: () => {
        if (selected) setAdded((current) => [...current, selected]);
        close();
        setSaved(true);
        void plan
          .refetch()
          .then(() => setAdded([]))
          .catch(() => undefined);
        onActivityAdded();
      },
    },
  });
  const planReady = !plan.isStale && !plan.isFetching && !plan.error;

  if (!suggestions.length && !discovery.loading && !discovery.error) return null;

  return (
    <>
      <Box component="section" sx={{ minWidth: 0 }}>
        <Stack spacing={2}>
          <AppSectionHeader
            title={t('title', { destination: trip.destination })}
          />
          {!suggestions.length ? (
            discovery.loading ? (
              <AppLoadingState local />
            ) : discovery.error ? (
              <AppErrorState
                compact
                status={discovery.error.status}
                onRetry={() => discovery.refetch()}
              />
            ) : null
          ) : (
            <Box
              role="region"
              aria-label={t('title', { destination: trip.destination })}
              tabIndex={0}
              sx={{
                display: 'flex',
                gap: { xs: 1.5, sm: 2 },
                overflowX: 'auto',
                scrollSnapType: 'x proximity',
                p: 0.5,
                scrollPaddingInline: '4px',
                overscrollBehaviorX: 'contain',
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: -2,
                },
              }}
            >
              {suggestions.map((place) => {
                const alreadyAdded =
                  isPlaceInPlan(place, activities) ||
                  added.some((item) => item.id === place.id);
                const address = getPlaceAddress(place, trip.destination);
                return (
                  <Stack
                    key={place.id}
                    component="article"
                    spacing={0.75}
                    sx={{
                      flex: { xs: '0 0 152px', sm: '0 0 192px' },
                      maxWidth: '75%',
                      minWidth: 0,
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        aspectRatio: '4 / 3',
                        p: 0.5,
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        borderRadius: 'var(--app-radius-card)',
                        bgcolor: 'action.hover',
                        backgroundImage: `url(${JSON.stringify(place.imageUrl || DEFAULT_TRAVEL_IMAGE)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {canWrite && writable && (
                        <AppButton
                          intent="text"
                          size="small"
                          round
                          disabled={
                            alreadyAdded ||
                            !planReady ||
                            !days.length ||
                            mutation.isPending
                          }
                          aria-label={t(
                            alreadyAdded ? 'addedLabel' : 'addLabel',
                            { place: place.title },
                          )}
                          title={t(alreadyAdded ? 'addedLabel' : 'addLabel', {
                            place: place.title,
                          })}
                          sx={{
                            width: 44,
                            height: 44,
                            minWidth: 44,
                            p: 0,
                            border: 0,
                            bgcolor: 'transparent',
                            color: alreadyAdded
                              ? 'success.main'
                              : 'text.primary',
                            '&:hover, &:active': { bgcolor: 'transparent' },
                            '&.Mui-disabled': {
                              bgcolor: 'transparent',
                              color: alreadyAdded
                                ? 'success.main'
                                : 'text.disabled',
                              border: 0,
                            },
                          }}
                          onClick={() => {
                            setSelected(place);
                            setDayId(days[0]?.id ?? '');
                            setEditing(false);
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: 'var(--app-radius-pill)',
                              bgcolor: 'background.paper',
                            }}
                          >
                            {alreadyAdded ? (
                              <CheckRoundedIcon sx={{ fontSize: 17 }} />
                            ) : (
                              <AddRoundedIcon sx={{ fontSize: 17 }} />
                            )}
                          </Box>
                        </AppButton>
                      )}
                    </Box>
                    <Typography
                      component="h3"
                      title={place.title}
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {place.title}
                    </Typography>
                    {address && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        title={address}
                        sx={{
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {address}
                      </Typography>
                    )}
                  </Stack>
                );
              })}
            </Box>
          )}
          {canWrite && writable && plan.error && (
            <AppErrorState
              compact
              status={plan.error.status}
              onRetry={() => plan.refetch()}
            />
          )}
          {canWrite && writable && planReady && !days.length && (
            <AppSectionLink
              href={`/plan?tripId=${encodeURIComponent(String(trip.id))}`}
            >
              {t('createDay')}
            </AppSectionLink>
          )}
        </Stack>
      </Box>
      <AppDialog
        open={
          Boolean(selected) &&
          !editing &&
          canWrite &&
          writable &&
          Boolean(chosenDay)
        }
        onClose={close}
        title={t('chooseDay')}
        maxWidth="sm"
        actions={
          <>
            <AppButton intent="secondary" onClick={close}>
              {t('cancel')}
            </AppButton>
            <AppButton
              disabled={!chosenDay || !planReady}
              onClick={() => setEditing(true)}
            >
              {t('continue')}
            </AppButton>
          </>
        }
      >
        <Stack spacing={2}>
          <Typography sx={{ fontWeight: 700 }}>{selected?.title}</Typography>
          <AppSelect
            label={t('day')}
            value={dayId}
            onChange={(event) => setDayId(String(event.target.value))}
            options={days.map((day) => ({
              value: day.id,
              label: t('dayOption', {
                number: day.dayNumber,
                date: day.planDate
                  ? formatDate(day.planDate)
                  : (day.title ?? ''),
              }),
            }))}
          />
        </Stack>
      </AppDialog>
      {selected && editing && canWrite && writable && chosenDay && (
        <AddActivityDialog
          open
          initialValues={{
            title: selected.title,
            location: selected.location,
            category: 'VISIT',
          }}
          destination={trip.destination}
          tripCurrency={trip.baseCurrency}
          planDate={chosenDay.planDate}
          onClose={close}
          isLoading={mutation.isPending}
          onSubmit={async (payload) => {
            if (!planReady || !canWrite || !writable || !chosenDay)
              throw new Error('Itinerary is not ready');
            await mutation.createActivityAsync(payload);
          }}
        />
      )}
      <AppToast
        open={saved}
        severity="success"
        message={p('toasts.createActivitySuccess')}
        onClose={() => setSaved(false)}
      />
    </>
  );
};

export default TripPlaceSuggestions;
