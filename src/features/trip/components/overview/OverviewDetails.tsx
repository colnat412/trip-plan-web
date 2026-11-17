'use client';

import { Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Trip } from '../../types';
import TripWorkspaceLinks from './TripWorkspaceLinks';
import TripItineraryPreview from './TripItineraryPreview';
import TripBudgetCard from './TripBudgetCard';
import TemplateLibrary from '@/features/plan-template/components/TemplateLibrary';

const OverviewDetails = ({ trip, now }: { trip: Trip; now: Date | null }) => {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  return <Stack spacing={3} sx={{ width: '100%', minWidth: 0 }}>
    <TripWorkspaceLinks tripId={trip.id} />
    <TripItineraryPreview key={`itinerary-${trip.id}`} trip={trip} now={now} />
    <TripBudgetCard key={`budget-${trip.id}`} trip={trip} compact={!desktop} />
    <TemplateLibrary compact />
  </Stack>;
};
export default OverviewDetails;
