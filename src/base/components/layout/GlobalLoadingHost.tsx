'use client';

import { useTripContext } from '@/features/trip/context/TripContext';
import AppLoadingState from '../ui/AppLoadingState';

const GlobalLoadingHost = () => {
  const { isLoading } = useTripContext();

  return isLoading ? <AppLoadingState pageOnly /> : null;
};

export default GlobalLoadingHost;
