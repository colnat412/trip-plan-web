'use client';

import { useState } from 'react';
import { Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Trip } from '../../types';
import TripWorkspaceLinks from './TripWorkspaceLinks';
import TripItineraryPreview from './TripItineraryPreview';
import TripBudgetCard from './TripBudgetCard';
import TemplateLibrary from '@/features/plan-template/components/TemplateLibrary';
import TripPlaceSuggestions from './TripPlaceSuggestions';

interface OverviewDetailsProps { trip: Trip; now: Date | null }

const OverviewDetails = ({ trip, now }: OverviewDetailsProps) => {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  const [planRevision, setPlanRevision] = useState(0);
  return <Stack useFlexGap sx={{ width: '100%', minWidth: 0, gap: 'inherit' }}>
    <TripWorkspaceLinks tripId={trip.id} />
    <TripItineraryPreview key={`itinerary-${trip.id}-${planRevision}`} trip={trip} now={now} />
    <TripBudgetCard key={`budget-${trip.id}`} trip={trip} compact={!desktop} />
    <TripPlaceSuggestions trip={trip} onActivityAdded={() => setPlanRevision(value => value + 1)} />
    <TemplateLibrary compact />
  </Stack>;
};
export default OverviewDetails;
