'use client';

import { Box, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useTranslations } from 'next-intl';
import AppSelect from '../ui/AppSelect';
import AppTextField from '../ui/AppTextField';
import type {
  AppTableColumn,
  ColumnFilterValue,
  TableSortState,
} from './types';

interface AppTableFilterBarProps<T> {
  columns: AppTableColumn<T>[];
  filters: Record<string, ColumnFilterValue>;
  sort: TableSortState | null;
  onFilterChange: (id: string, value: ColumnFilterValue) => void;
  onSortChange: (sort: TableSortState | null) => void;
}

const AppTableFilterBar = <T,>({
  columns,
  filters,
  sort,
  onFilterChange,
  onSortChange,
}: AppTableFilterBarProps<T>) => {
  const t = useTranslations('table');
  const filterColumns = columns.filter((column) => column.filterable);
  const searchColumn = filterColumns.find(
    (column) => !column.filterType || column.filterType === 'text',
  );
  const sortOptions = columns
    .filter((column) => column.sortable)
    .flatMap((column) =>
      (['asc', 'desc'] as const).map((direction) => ({
        value: `${column.id}:${direction}`,
        label: `${column.label} · ${t(direction === 'asc' ? 'ascending' : 'descending')}`,
        sort: { columnId: column.id, direction },
      })),
    );
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {searchColumn && (
        <AppTextField
          size="small"
          variantType="search"
          placeholder={searchColumn.filterPlaceholder ?? searchColumn.label}
          value={filters[searchColumn.id] ?? ''}
          onChange={(event) =>
            onFilterChange(searchColumn.id, event.target.value)
          }
          slotProps={{
            htmlInput: { 'aria-label': searchColumn.label },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ fontSize: 18, color: 'text.secondary' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          minWidth: 0,
          '& > *': { flex: '1 1 95px', minWidth: 0 },
        }}
      >
        {filterColumns
          .filter((column) => column !== searchColumn)
          .map((column) => {
            const value = filters[column.id];
            return column.filterType === 'select' ? (
              <AppSelect
                key={column.id}
                variantType="filter"
                multiple
                label={column.label}
                inputProps={{ 'aria-label': column.label }}
                options={column.filterOptions ?? []}
                value={
                  Array.isArray(value)
                    ? value
                    : value == null || value === ''
                      ? []
                      : [value]
                }
                onChange={(event) =>
                  onFilterChange(
                    column.id,
                    typeof event.target.value === 'string'
                      ? event.target.value.split(',')
                      : (event.target.value as (string | number)[]),
                  )
                }
              />
            ) : (
              <AppTextField
                key={column.id}
                size="small"
                variantType="search"
                placeholder={column.label}
                value={value ?? ''}
                slotProps={{ htmlInput: { 'aria-label': column.label } }}
                onChange={(event) =>
                  onFilterChange(column.id, event.target.value)
                }
              />
            );
          })}
        {sortOptions.length > 0 && (
          <AppSelect
            variantType="filter"
            label={t('sortLabel')}
            inputProps={{ 'aria-label': t('sortLabel') }}
            value={sort ? `${sort.columnId}:${sort.direction}` : ''}
            options={[{ value: '', label: t('unsorted') }, ...sortOptions]}
            onChange={(event) =>
              onSortChange(
                sortOptions.find(
                  (option) => option.value === event.target.value,
                )?.sort ?? null,
              )
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default AppTableFilterBar;
