'use client';

import { useId } from 'react';
import { Box, MenuItem, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppTextField } from '@/base/components/ui';
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
  const inputSx = { '& .MuiOutlinedInput-root': { height: 44, borderRadius: '12px' } };
  return (
    <Box sx={{
      display: 'grid', gap: 1.5, alignItems: 'start', minWidth: 0,
      gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'minmax(0, 2fr) repeat(3, minmax(0, 1fr))' },
    }}>
      <Stack spacing={0.75} sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, minWidth: 0 }}>
        <Typography component="label" htmlFor={`${id}-search`} sx={labelSx}>
          {t('search')}
        </Typography>
        <AppTextField
          id={`${id}-search`}
          sx={inputSx}
          placeholder={t('search')}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
      </Stack>
      <Stack spacing={0.75} sx={{ minWidth: 0 }}>
        <Typography component="label" htmlFor={`${id}-days`} sx={labelSx}>
          {t('days')}
        </Typography>
        <AppTextField
          id={`${id}-days`}
          sx={inputSx}
          type="number"
          placeholder={t('days')}
          value={duration}
          onChange={(e) => onDuration(e.target.value)}
          slotProps={{ htmlInput: { min: 1, max: 60 } }}
        />
      </Stack>
      <Stack spacing={0.75} sx={{ minWidth: 0 }}>
        <Typography component="label" id={`${id}-style-label`} htmlFor={`${id}-style`} sx={labelSx}>
          {t('style')}
        </Typography>
        <AppTextField
          select
          id={`${id}-style`}
          sx={inputSx}
          value={tag}
          onChange={(e) => onTag(e.target.value)}
          slotProps={{ select: {
            displayEmpty: true,
            inputProps: { 'aria-labelledby': `${id}-style-label` },
          } }}
        >
          <MenuItem value="">{t('allStyles')}</MenuItem>
          {TEMPLATE_TAGS.map((value) => (
            <MenuItem key={value} value={value}>{t(`tags.${value}`)}</MenuItem>
          ))}
        </AppTextField>
      </Stack>
      <Stack spacing={0.75} sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, minWidth: 0 }}>
        <Typography component="label" id={`${id}-sort-label`} htmlFor={`${id}-sort`} sx={labelSx}>
          {t('sort')}
        </Typography>
        <AppTextField
          select
          id={`${id}-sort`}
          sx={inputSx}
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          slotProps={{ select: {
            inputProps: { 'aria-labelledby': `${id}-sort-label` },
          } }}
        >
          <MenuItem value="recent">{t('recent')}</MenuItem>
          <MenuItem value="popular">{t('popular')}</MenuItem>
        </AppTextField>
      </Stack>
    </Box>
  );
};
export default TemplateFilters;
