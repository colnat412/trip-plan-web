'use client';

import { useTripContext } from '@/features/trip/context/TripContext';
import AppLoadingState from '../ui/AppLoadingState';

const GlobalLoadingHost = () => {
  const { isLoading } = useTripContext();

  return isLoading ? <AppLoadingState /> : null;
};

export default GlobalLoadingHost;
