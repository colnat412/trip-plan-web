'use client';

import { useId } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppTextField, AppSelect } from '@/base/components/ui';
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
  const labelSx = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'text.secondary',
    overflowWrap: 'anywhere',
  } as const;
  return (
    <Stack
      direction="row"
      useFlexGap
      spacing={1.5}
      sx={{ flexWrap: 'wrap', alignItems: 'flex-start', minWidth: 0 }}
    >
      <Stack spacing={0.75} sx={{ flex: '2 1 240px', minWidth: 0 }}>
        <Typography component="label" htmlFor={`${id}-search`} sx={labelSx}>
          {t('search')}
        </Typography>
        <AppTextField
          id={`${id}-search`}
          placeholder={t('search')}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
      </Stack>
      <Stack spacing={0.75} sx={{ flex: '1 1 120px', minWidth: 0 }}>
        <Typography component="label" htmlFor={`${id}-days`} sx={labelSx}>
          {t('days')}
        </Typography>
        <AppTextField
          id={`${id}-days`}
          type="number"
          placeholder={t('days')}
          value={duration}
          onChange={(e) => onDuration(e.target.value)}
          slotProps={{ htmlInput: { min: 1, max: 60 } }}
        />
      </Stack>
      <Stack spacing={0.75} sx={{ flex: '1 1 160px', minWidth: 0 }}>
        <Typography component="label" htmlFor={`${id}-style`} sx={labelSx}>
          {t('style')}
        </Typography>
        <AppSelect
          id={`${id}-style`}
          fullWidth
          variantType="filter"
          label={t('style')}
          value={tag}
          onChange={(e) => onTag(String(e.target.value))}
          inputProps={{ 'aria-label': t('style') }}
          options={[
            { value: '', label: t('all') },
            ...TEMPLATE_TAGS.map((value) => ({
              value,
              label: t(`tags.${value}`),
            })),
          ]}
        />
      </Stack>
      <Stack spacing={0.75} sx={{ flex: '1 1 160px', minWidth: 0 }}>
        <Typography component="label" htmlFor={`${id}-sort`} sx={labelSx}>
          {t('sort')}
        </Typography>
        <AppSelect
          id={`${id}-sort`}
          fullWidth
          variantType="filter"
          label={t('sort')}
          value={sort}
          onChange={(e) => onSort(String(e.target.value))}
          inputProps={{ 'aria-label': t('sort') }}
          options={[
            { value: 'recent', label: t('recent') },
            { value: 'popular', label: t('popular') },
          ]}
        />
      </Stack>
    </Stack>
  );
};
export default TemplateFilters;
