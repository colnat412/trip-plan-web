'use client';

import { type ReactNode, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTripContext } from '@/features/trip/context/TripContext';
import { AppLoadingState, AppErrorState } from '@/base/components/ui';
import AppRouteTabs from '../ui/AppRouteTabs';
import AppTabSection from './AppTabSection';

const AppTripWorkspace = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations('tripWorkspace');
  const { activeTrip, selectTrip, error, refetchTrips } = useTripContext();
  const requestedTrip = params.get('tripId');
  useEffect(() => { if (requestedTrip) selectTrip(requestedTrip); }, [requestedTrip, selectTrip]);
  const tripId = requestedTrip ?? (activeTrip ? String(activeTrip.id) : null);
  const waiting = requestedTrip && String(activeTrip?.id) !== requestedTrip;
  return <AppTabSection navigation={<AppRouteTabs pill active={pathname} label={t('navigation')}
    items={([['/plan', 'plan'], ['/expenses', 'expenses'], ['/settlement', 'settlement']] as const).map(([href, label]) => ({ id: href, href: tripId ? `${href}?tripId=${encodeURIComponent(tripId)}` : href, label: t(label) }))} />}>
    {waiting ? error ? <AppErrorState status={error.status} onRetry={() => refetchTrips()} /> : <AppLoadingState /> : children}
  </AppTabSection>;
};
export default AppTripWorkspace;
