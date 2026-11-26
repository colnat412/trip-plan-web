'use client';

import AppErrorState from '@/base/components/ui/AppErrorState';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Box } from '@mui/material';

import {
  AppPageContainer,
  type ColumnFilterValue,
  type TableSortState,
} from '@/base/components/ui';
import { useDebouncedValue } from '@/base/hooks';
import useTripFilterOptions from '../hooks/useTripFilterOptions';
import useMyTrips from '../hooks/useMyTrips';
import { useTripContext } from '../context/TripContext';
import MyTripsHeader from './my-trips/MyTripsHeader';
import TripFilterBar, { type TripFilterValues } from './my-trips/TripFilterBar';
import TripCardGrid from './my-trips/TripCardGrid';
import TripTable from './my-trips/TripTable';
import TripGridPagination from './my-trips/TripGridPagination';
import EditTripDialog from './EditTripDialog';
import DeleteTripDialog from './DeleteTripDialog';
import type { Trip } from '../types';

const MyTrips = () => {
  const router = useRouter();
  const [destinationSearch, setDestinationSearch] = useState('');
  const { options: filterOptions, refetch: refetchFilterOptions, loading: destinationOptionsLoading, error: destinationOptionsError } = useTripFilterOptions({ destinationSearch });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [filters, setFilters] = useState<Record<string, ColumnFilterValue>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);
  const [hasSettledInitialRequest, setHasSettledInitialRequest] = useState(false);

  const [debounceSearch, setDebounceSearch] = useState(false);
  const search = typeof filters.name === 'string' ? filters.name.trim() : '';
  const debouncedSearch = useDebouncedValue(search);
  const querySearch = debounceSearch && search ? debouncedSearch : search;
  const isDebouncing = search !== querySearch;
  const destination =
    typeof filters.destination === 'string' ? filters.destination : undefined;
  const currency =
    typeof filters.baseCurrency === 'string'
      ? filters.baseCurrency
      : Array.isArray(filters.baseCurrency)
        ? filters.baseCurrency.join(',')
        : undefined;

  const { data, trips, pagination, isLoading, isFetching, isStale, error, refetch } =
    useMyTrips({
      page,
      size: rowsPerPage,
      search: querySearch,
      enabled: !isDebouncing,
      destination,
      currency,
      sortBy: sort?.columnId,
      sortDirection: sort?.direction,
    });
  // Empty results and errors also finish the first request; later changes stay local.
  const initialRequestSettled = Boolean(error) || (data !== null && !isStale);
  if (!hasSettledInitialRequest && initialRequestSettled) {
    setHasSettledInitialRequest(true);
  }
  const loadingScope = hasSettledInitialRequest || initialRequestSettled ? 'local' : 'page';
  const resultTrips = isStale || isDebouncing ? [] : trips;
  const {
    activeTrip,
    selectTrip,
    refetchTrips,
    subscribeTrips,
  } = useTripContext();

  useEffect(() => {
    return subscribeTrips((event) => {
      void refetchFilterOptions().catch(() => undefined);
      if (event === 'created') {
        const hasCustomState =
          page !== 0 || Object.keys(filters).length > 0 || sort !== null;

        setPage(0);
        setFilters({});
        setSort(null);

        if (!hasCustomState) {
          if (!isDebouncing) void refetch().catch(() => undefined);
        }
      } else {
        if (!isDebouncing) void refetch().catch(() => undefined);
      }
    });
  }, [subscribeTrips, page, filters, sort, refetch, isDebouncing, refetchFilterOptions]);

  const handleSelectTrip = useCallback(
    (trip: Trip) => {
      selectTrip(trip.id);
      router.push(`/plan?tripId=${encodeURIComponent(String(trip.id))}`);
    },
    [selectTrip, router],
  );

  const handleSortChange = useCallback((newSort: TableSortState | null) => {
    setDebounceSearch(false);
    setSort(newSort);
    setPage(0);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Record<string, ColumnFilterValue>) => {
      setDebounceSearch(false);
      setFilters(newFilters);
      setPage(0);
    },
    [],
  );

  const filterValues: TripFilterValues = useMemo(
    () => ({
      search: typeof filters.name === 'string' ? filters.name : '',
      destination:
        typeof filters.destination === 'string' ? filters.destination : '',
      status:
        typeof filters.status === 'string'
          ? filters.status
          : Array.isArray(filters.status)
            ? filters.status.join(',')
            : '',
      currency:
        typeof filters.baseCurrency === 'string'
          ? filters.baseCurrency
          : Array.isArray(filters.baseCurrency)
            ? filters.baseCurrency.join(',')
            : '',
    }),
    [filters],
  );

  const handleFilterUpdate = useCallback((patch: Partial<TripFilterValues>) => {
    setDebounceSearch('search' in patch);
    setFilters((prev) => {
      const next = { ...prev };
      if ('search' in patch) {
        if (!patch.search) delete next.name;
        else next.name = patch.search;
      }
      if ('destination' in patch) {
        if (!patch.destination) delete next.destination;
        else next.destination = patch.destination;
      }
      if ('status' in patch) {
        if (!patch.status) delete next.status;
        else next.status = patch.status;
      }
      if ('currency' in patch) {
        if (!patch.currency) delete next.baseCurrency;
        else next.baseCurrency = patch.currency;
      }
      return next;
    });
    setPage(0);
  }, []);

  const handleEditSuccess = useCallback(() => {
    void refetchTrips('updated');
  }, [refetchTrips]);

  const handleDeleteSuccess = useCallback(() => {
    void refetchTrips('deleted');
  }, [refetchTrips]);

  const totalCount = pagination?.totalElements ?? trips.length;

  return (
    <AppPageContainer>
      <MyTripsHeader totalTrips={totalCount} />

      <TripFilterBar
        filters={filterValues}
        onDestinationSearch={setDestinationSearch}
        destinationOptionsLoading={destinationOptionsLoading}
        destinationOptionsError={Boolean(destinationOptionsError)}
        destinations={filterOptions?.destinations ?? []}
        currencies={filterOptions?.currencies ?? []}
        visitedDestinations={filterOptions?.visitedDestinations ?? []}
        onFilterChange={handleFilterUpdate}
        sort={sort}
        onSortChange={handleSortChange}
        totalTrips={totalCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setPage(0);
        }}
      />

      {error && !isDebouncing ? (
        <AppErrorState status={error.status} onRetry={() => refetch()} />
      ) : viewMode === 'grid' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 2.5 }}>
          <TripCardGrid
            trips={resultTrips}
            isLoading={isLoading || isStale || isDebouncing}
            loadingScope={loadingScope}
            activeTripId={activeTrip?.id ?? null}
            onSelectTrip={handleSelectTrip}
            onEditTrip={setEditingTrip}
            onDeleteTrip={setDeletingTrip}
          />

          {totalCount > 0 && !isDebouncing && !isStale && (
            <TripGridPagination
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
            />
          )}
        </Box>
      ) : (
        <TripTable
          currencies={filterOptions?.currencies ?? []}
          trips={resultTrips}
          isLoading={isLoading || isStale || isDebouncing}
          loadingScope={loadingScope}
          isFetching={isFetching || isDebouncing}
          activeTripId={activeTrip?.id ?? null}
          onSelectTrip={handleSelectTrip}
          onEditTrip={setEditingTrip}
          onDeleteTrip={setDeletingTrip}
          sort={sort}
          onSortChange={handleSortChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          pagination={
            totalCount > 0 && !isDebouncing && !isStale
              ? {
                  page,
                  pageSize: rowsPerPage,
                  totalCount,
                  onPageChange: setPage,
                }
              : null
          }
        />
      )}

      <EditTripDialog
        open={Boolean(editingTrip)}
        trip={editingTrip}
        onClose={() => setEditingTrip(null)}
        onSuccess={handleEditSuccess}
      />

      <DeleteTripDialog
        open={Boolean(deletingTrip)}
        trip={deletingTrip}
        onClose={() => setDeletingTrip(null)}
        onSuccess={handleDeleteSuccess}
      />
    </AppPageContainer>
  );
};

export default MyTrips;
