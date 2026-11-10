'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import AppDialog from '../ui/AppDialog';
import AppButton from '../ui/AppButton';
import AppTableFilterBar from './AppTableFilterBar';
import type {
  AppTableColumn,
  ColumnFilterValue,
  TableSortState,
} from './types';

interface AppTableControlsDialogProps<T> {
  columns: AppTableColumn<T>[];
  filters: Record<string, ColumnFilterValue>;
  sort: TableSortState | null;
  onClose: () => void;
  onApply: (
    filters: Record<string, ColumnFilterValue>,
    sort: TableSortState | null,
  ) => void;
}

const AppTableControlsDialog = <T,>({
  columns,
  filters,
  sort,
  onClose,
  onApply,
}: AppTableControlsDialogProps<T>) => {
  const t = useTranslations('table');
  const [draftFilters, setDraftFilters] = useState(filters);
  const [draftSort, setDraftSort] = useState(sort);
  return (
    <AppDialog
      open
      onClose={onClose}
      title={t('mobileControls')}
      maxWidth="xs"
      showSheetHandle
      actions={
        <>
          <AppButton
            intent="text"
            onClick={() => {
              setDraftFilters({});
              setDraftSort(null);
            }}
          >
            {t('resetControls')}
          </AppButton>
          <AppButton
            intent="primary"
            data-dialog-action="primary"
            onClick={() => onApply(draftFilters, draftSort)}
          >
            {t('apply')}
          </AppButton>
        </>
      }
    >
      <AppTableFilterBar
        columns={columns}
        filters={draftFilters}
        sort={draftSort}
        onSortChange={setDraftSort}
        onFilterChange={(id, value) =>
          setDraftFilters((previous) => {
            const next = { ...previous };
            if (
              value == null ||
              (Array.isArray(value)
                ? value.length === 0
                : String(value).trim() === '')
            )
              delete next[id];
            else next[id] = value;
            return next;
          })
        }
      />
    </AppDialog>
  );
};

export default AppTableControlsDialog;
