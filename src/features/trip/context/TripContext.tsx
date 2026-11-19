'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { flushSync } from 'react-dom';
import { waitForMobileOverlayHistory } from '@/base/hooks/use-mobile-overlay-back';
import type { ApiError } from '@/base/api';
import { useUserContext } from '@/features/user/context/UserContext';
import useSelectedTrip from '../hooks/useSelectedTrip';
import useMyTrips from '../hooks/useMyTrips';
import useTripDetail from '../hooks/useTripDetail';
import type { Trip } from '../types';

export type TripMutationEvent = 'created' | 'updated' | 'deleted' | 'general';

interface TripContextValue {
  trips: Trip[];
  activeTrip: Trip | null;
  selectedTripId: string | number | null;
  selectTrip: (tripId: string | number | null) => void;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  selectedTripError: ApiError | null;
  refetchTrips: (event?: TripMutationEvent) => Promise<unknown>;
  subscribeTrips: (listener: (event?: TripMutationEvent) => void) => () => void;
  tripsVersion: number;
  isCreateTripOpen: boolean;
  openCreateTrip: () => void;
  closeCreateTrip: () => void;
  isMembersOpen: boolean;
  isInviteInitial: boolean;
  openMembers: (initialInvite?: boolean) => void;
  closeMembers: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

const TripProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { trips, isLoading, isFetching, error, refetch } = useMyTrips({
    size: 100,
  });
  const [tripsVersion, setTripsVersion] = useState(0);
  const listenersRef = useRef<Set<(event?: TripMutationEvent) => void>>(
    new Set(),
  );

  const { user, isLoading: isUserLoading } = useUserContext();
  const { selectedTripId, selectTrip } = useSelectedTrip(user?.id);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isInviteInitial, setIsInviteInitial] = useState(false);

  const subscribeTrips = useCallback(
    (listener: (event?: TripMutationEvent) => void) => {
      listenersRef.current.add(listener);
      return () => {
        listenersRef.current.delete(listener);
      };
    },
    [],
  );

  const refetchTrips = useCallback(
    async (event: TripMutationEvent = 'general') => {
      setTripsVersion((v) => v + 1);
      listenersRef.current.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error('Trip listener error:', err);
        }
      });
      return refetch();
    },
    [refetch],
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refreshOnReturn = () => {
      if (document.visibilityState !== 'visible') return;
      clearTimeout(timer);
      timer = setTimeout(() => { void refetchTrips().catch(() => undefined); }, 0);
    };
    window.addEventListener('focus', refreshOnReturn);
    window.addEventListener('online', refreshOnReturn);
    document.addEventListener('visibilitychange', refreshOnReturn);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', refreshOnReturn);
      window.removeEventListener('online', refreshOnReturn);
      document.removeEventListener('visibilitychange', refreshOnReturn);
    };
  }, [refetchTrips]);

  const needsSelectedDetail =
    selectedTripId !== null &&
    !trips.some((trip) => String(trip.id) === String(selectedTripId));
  const selectedDetail = useTripDetail({
    tripId: selectedTripId,
    enabled: needsSelectedDetail,
    refreshKey: tripsVersion,
  });
  const selectedTrip =
    !selectedDetail.error &&
    selectedDetail.trip &&
    String(selectedDetail.trip.id) === String(selectedTripId)
      ? selectedDetail.trip
      : null;
  const contextLoading =
    isUserLoading || isLoading ||
    (needsSelectedDetail && !selectedTrip && !selectedDetail.error);
  const contextFetching =
    isFetching || (needsSelectedDetail && selectedDetail.isFetching);
  const selectedTripError = needsSelectedDetail ? selectedDetail.error : null;
  // An old session selection can outlive membership or a deleted trip. It must
  // not turn a successful trip list (including an empty one) into a page error.
  // Explicit workspace links still use selectedTripError to report denied access.
  const unavailableSelection = selectedTripError?.status === 403 || selectedTripError?.status === 404;
  const contextError = error ?? (unavailableSelection ? null : selectedTripError);

  const activeTrip = useMemo(() => {
    if (!user) return null;
    if (needsSelectedDetail && !unavailableSelection) return selectedTrip;
    if (!trips || trips.length === 0) return null;

    if (selectedTripId !== null) {
      const found = trips.find((t) => String(t.id) === String(selectedTripId));
      if (found) return found;
    }

    const inProgressTrip = trips.find((t) => t.status === 'IN_PROGRESS');
    if (inProgressTrip) return inProgressTrip;

    return trips[0];
  }, [trips, selectedTripId, needsSelectedDetail, selectedTrip, unavailableSelection, user]);

  useEffect(() => {
    if (!unavailableSelection || !user || isLoading || isFetching || error || selectedTripId === null) return;
    const timer = setTimeout(() => {
      flushSync(() => {
        setIsMembersOpen(false);
        setIsInviteInitial(false);
        selectTrip(activeTrip?.id ?? null);
      });
      void waitForMobileOverlayHistory().then(() => {
        router.replace(activeTrip ? `/plan?tripId=${encodeURIComponent(String(activeTrip.id))}` : '/overview');
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [unavailableSelection, user, isLoading, isFetching, error, selectedTripId, activeTrip, selectTrip, router]);

  const openCreateTrip = useCallback(() => {
    setIsCreateTripOpen(true);
  }, []);

  const closeCreateTrip = useCallback(() => {
    setIsCreateTripOpen(false);
  }, []);

  const openMembers = useCallback(
    (initialInvite: boolean | unknown = false) => {
      setIsInviteInitial(initialInvite === true);
      setIsMembersOpen(true);
    },
    [],
  );

  const closeMembers = useCallback(() => {
    setIsMembersOpen(false);
    setIsInviteInitial(false);
  }, []);

  const value = useMemo<TripContextValue>(
    () => ({
      trips,
      activeTrip,
      selectedTripId,
      selectTrip,
      isLoading: contextLoading,
      isFetching: contextFetching,
      error: contextError,
      selectedTripError,
      refetchTrips,
      subscribeTrips,
      tripsVersion,
      isCreateTripOpen,
      openCreateTrip,
      closeCreateTrip,
      isMembersOpen,
      isInviteInitial,
      openMembers,
      closeMembers,
    }),
    [
      trips,
      activeTrip,
      selectedTripId,
      selectTrip,
      contextLoading,
      contextFetching,
      contextError,
      selectedTripError,
      refetchTrips,
      subscribeTrips,
      tripsVersion,
      isCreateTripOpen,
      openCreateTrip,
      closeCreateTrip,
      isMembersOpen,
      isInviteInitial,
      openMembers,
      closeMembers,
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

const useTripContext = (): TripContextValue => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export { TripProvider, useTripContext };
export default TripProvider;
