'use client';

import { useId, useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslations } from 'next-intl';
import {
  AppTextField,
  AppButton,
  AppDialog,
  AppFilterChipGroup,
  AppFilterChip,
} from '@/base/components/ui';
import { TEMPLATE_TAGS } from '../types';

interface TemplateFiltersProps {
  search: string;
  duration: string;
  tag: string;
  sort: string;
  onSearch: (value: string) => void;
  onDuration: (value: string) => void;
  onTag: (value: string) => void;
  onSort: (value: string) => void;
}

const TemplateFilters = ({
  search,
  duration,
  tag,
  sort,
  onSearch,
  onDuration,
  onTag,
  onSort,
}: TemplateFiltersProps) => {
  const t = useTranslations('planTemplate');
  const id = useId();
  const [open, setOpen] = useState(false);
  const extraFilters = Number(Boolean(duration)) + Number(Boolean(tag)) + Number(sort !== 'recent');
  const selectedTag = TEMPLATE_TAGS.find(value => value === tag);
  const selectedTagLabel = selectedTag ? t(`tags.${selectedTag}`) : tag;
  const clearFilters = () => {
    onDuration('');
    onTag('');
    onSort('recent');
  };
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <AppTextField
          id={`${id}-search`}
          variantType="search"
          placeholder={t('search')}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          slotProps={{
            htmlInput: { maxLength: 200, 'aria-label': t('search') },
          }}
          sx={{
            flex: 1,
            minWidth: 0,
            '& .MuiOutlinedInput-root': { height: 44, minHeight: 44 },
          }}
        />
        <AppButton
          intent="secondary"
          size="small"
          startIcon={<TuneRoundedIcon />}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          sx={{ minHeight: 44 }}
        >
          {extraFilters
            ? t('filtersCount', { count: extraFilters })
            : t('filters')}
        </AppButton>
      </Box>
      <AppFilterChipGroup
        label={t('days')}
        value={duration}
        onChange={onDuration}
        showAll
        allLabel={t('allDurations')}
        options={['1', '2', '3', '4+'].map((value) => ({
          value,
          label: value === '4+' ? t('fourDaysPlus') : t('durationLabel', { days: Number(value) }),
        }))}
      />
      {extraFilters > 0 && <Box aria-label={t('activeFilters')} sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, py: 0.5 }}>
        {tag && <AppFilterChip selected label={selectedTagLabel} deleteIcon={<CloseRoundedIcon />}
          onClick={() => onTag('')} onDelete={() => onTag('')}
          aria-label={t('removeFilter', { filter: selectedTagLabel })} />}
        {sort !== 'recent' && <AppFilterChip selected label={t('popular')} deleteIcon={<CloseRoundedIcon />}
          onClick={() => onSort('recent')} onDelete={() => onSort('recent')}
          aria-label={t('removeFilter', { filter: t('popular') })} />}
        <AppButton intent="text" size="small" onClick={clearFilters}>{t('clearFilters')}</AppButton>
      </Box>}
      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={t('filters')}
        maxWidth="xs"
        actions={
          <>
            <AppButton
              intent="text"
              onClick={clearFilters}
            >
              {t('clearFilters')}
            </AppButton>
            <AppButton
              intent="primary"
              data-dialog-action="primary"
              onClick={() => setOpen(false)}
            >
              {t('filtersDone')}
            </AppButton>
          </>
        }
      >
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <AppTextField
            select
            label={t('style')}
            value={tag}
            onChange={(event) => onTag(event.target.value)}
            slotProps={{
              select: { displayEmpty: true },
              inputLabel: { shrink: true },
            }}
          >
            <MenuItem value="">{t('allStyles')}</MenuItem>
            {TEMPLATE_TAGS.map((value) => (
              <MenuItem key={value} value={value}>
                {t(`tags.${value}`)}
              </MenuItem>
            ))}
          </AppTextField>
          <AppTextField
            select
            label={t('sort')}
            value={sort}
            onChange={(event) => onSort(event.target.value)}
          >
            <MenuItem value="recent">{t('recent')}</MenuItem>
            <MenuItem value="popular">{t('popular')}</MenuItem>
          </AppTextField>
        </Stack>
      </AppDialog>
    </Stack>
  );
};

export default TemplateFilters;
