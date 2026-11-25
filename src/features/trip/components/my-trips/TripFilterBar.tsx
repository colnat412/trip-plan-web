'use client';

import React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import { useTranslations } from 'next-intl';

import {
  AppSegmentedControl,
  AppSelect,
  type AppSelectOption,
  AppTextField,
  AppFilterChipGroup,
  type TableSortState,
} from '@/base/components/ui';
import { getDestinationFilterOptions } from '../../utils/destination-filter-options';

export interface TripFilterValues {
  search: string;
  destination: string;
  status: string;
  currency: string;
}

export interface TripFilterBarProps {
  filters: TripFilterValues;
  destinations: string[];
  currencies: string[];
  visitedDestinations: string[];
  onFilterChange: (patch: Partial<TripFilterValues>) => void;
  sort: TableSortState | null;
  onSortChange: (sort: TableSortState | null) => void;
  totalTrips: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  rowsPerPage: number;
  onRowsPerPageChange: (size: number) => void;
}

const TripFilterBar = ({
  filters,
  destinations, currencies, visitedDestinations,
  onFilterChange,
  sort,
  onSortChange,
  totalTrips,
  viewMode,
  onViewModeChange,
  rowsPerPage,
  onRowsPerPageChange,
}: TripFilterBarProps) => {
  const t = useTranslations('myTrips');


  const { search, destination, currency } = filters;

  const destinationOptions: AppSelectOption[] = [
    { value: '', label: t('all') },
    ...destinations.map((d) => ({ value: d, label: d.split(',')[0].trim() || d, searchText: d })),
  ];

const currencyOptions: AppSelectOption[] = [
    { value: '', label: t('all') },
    ...currencies.map((code) => ({ value: code, label: code })),
  ];

  const sortOptions: AppSelectOption[] = [
    { value: 'newest', label: t('sortNewest') },
    { value: 'oldest', label: t('sortOldest') },
    { value: 'nameAsc', label: t('sortName') },
    { value: 'destinationAsc', label: t('sortDestination') },
  ];

  const quickTagOptions = getDestinationFilterOptions(visitedDestinations, destination);

  const getSortSelectValue = () => {
    if (!sort) return 'newest';
    if (sort.columnId === 'createdAt' && sort.direction === 'asc')
      return 'oldest';
    if (sort.columnId === 'name' && sort.direction === 'asc') return 'nameAsc';
    if (sort.columnId === 'destination' && sort.direction === 'asc')
      return 'destinationAsc';
    return 'newest';
  };

  const handleSortChange = (val: string) => {
    if (!val || val === 'newest') {
      onSortChange(null);
    } else if (val === 'oldest') {
      onSortChange({ columnId: 'createdAt', direction: 'asc' });
    } else if (val === 'nameAsc') {
      onSortChange({ columnId: 'name', direction: 'asc' });
    } else if (val === 'destinationAsc') {
      onSortChange({ columnId: 'destination', direction: 'asc' });
    }
  };

  const filterSelectSx = {
    flex: { xs: '1 1 calc(33.333% - 6px)', sm: '0 0 auto' },
    minWidth: { xs: 80, sm: 120 },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1,
          alignItems: { xs: 'stretch', md: 'center' },
        }}
      >
        <AppTextField
          value={search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder={t('filterNamePlaceholder')}
          size="small"
          variantType="search"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: 'text.secondary', fontSize: 18 }}
                  />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onFilterChange({ search: '' })}
                    edge="end"
                    aria-label="clear search"
                    sx={{ p: 0.5 }}
                  >
                    <ClearRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{ flex: 1 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <AppSelect
            variantType="filter"
            label={t('allDestinations')}
            searchable
            value={destination}
            options={destinationOptions}
            onChange={(e) =>
              onFilterChange({ destination: String(e.target.value ?? '') })
            }
            sx={filterSelectSx}
          />

<AppSelect
            variantType="filter"
            label={t('allCurrencies')}
            value={currency}
            options={currencyOptions}
            onChange={(e) =>
              onFilterChange({ currency: String(e.target.value ?? '') })
            }
            sx={filterSelectSx}
          />
        </Box>
      </Box>

      {quickTagOptions.length > 0 && <AppFilterChipGroup
        label={t('quickDestinations')}
        options={quickTagOptions}
        value={destination}
        onChange={(dest) => onFilterChange({ destination: dest })}
        allLabel={t('all') || 'Tất cả'}
        showAll
        sx={{
          minWidth: 0,
          '& .MuiChip-root': { maxWidth: 160 },
          '& .MuiChip-label': { minWidth: 0 },
        }}
      />}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1,
          pt: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          sx={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: 'text.secondary',
          }}
        >
          {totalTrips} {t('resultsLabel') || 'kết quả'}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <AppSelect
            variantType="compact"
            label={t('pageSizeLabel')}
            value={rowsPerPage}
            options={[3, 6, 12, 24].map((size) => ({ value: size, label: `${size} ${t('perPageLabel')}` }))}
            onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
            sx={{ minWidth: { xs: 96, sm: 105 }, flexShrink: 0 }}
          />
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '12px',
                display: { xs: 'none', sm: 'inline' },
              }}
            >
              {t('sortBy')}
            </Typography>
            <AppSelect
              variantType="compact"
              label={t('sortBy')}
              value={getSortSelectValue()}
              options={sortOptions}
              onChange={(e) => handleSortChange(String(e.target.value ?? ''))}
              sx={{ minWidth: { xs: 110, sm: 125 } }}
            />
          </Stack>

          <AppSegmentedControl<'grid' | 'table'>
            value={viewMode}
            onChange={onViewModeChange}
            label={t('viewMode')}
            options={[
              { value: 'grid', label: <GridViewRoundedIcon sx={{ fontSize: 18 }} />, ariaLabel: t('gridView') },
              { value: 'table', label: <TableRowsRoundedIcon sx={{ fontSize: 18 }} />, ariaLabel: t('tableView') },
            ]}
            sx={{ display: { xs: 'none', sm: 'grid' }, width: 104, flexShrink: 0 }}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default TripFilterBar;
