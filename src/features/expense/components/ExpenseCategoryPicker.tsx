'use client';

import { useId } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppCategoryIcon } from '@/base/components/ui';
import { TRIP_CATEGORIES } from '@/base/constants';
import type { ExpenseCategory } from '../types';

export default function ExpenseCategoryPicker({ value, onChange, disabled = false }: {
  value: ExpenseCategory;
  onChange: (value: ExpenseCategory) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const t = useTranslations('expense');
  return (
    <Stack spacing={0.75} role="group" aria-labelledby={id}>
      <Typography id={id} component="h3" sx={{ fontSize: '14px', fontWeight: 600 }}>
        {t('form.categoryLabel')}
      </Typography>
      <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'stretch' }}>
        {TRIP_CATEGORIES.map(category => (
          <AppButton key={category} type="button" intent="secondary" size="small"
            aria-pressed={value === category} disabled={disabled} onClick={() => onChange(category)}
            startIcon={<AppCategoryIcon category={category} size={22} bare />}
            sx={(theme) => {
              const palette = theme.vars?.palette ?? theme.palette;
              const selected = value === category;
              return {
                flex: { xs: '0 0 calc((100% - 8px) / 2)', sm: '0 0 calc((100% - 16px) / 3)' },
                minWidth: 0, minHeight: 44, px: 1.25, py: 0.75, gap: 0.75,
                justifyContent: 'flex-start', fontSize: '13px', lineHeight: 1.4,
                '& .MuiButton-startIcon': { m: 0, flexShrink: 0 },
                borderColor: selected ? palette.primary.main : palette.divider,
                backgroundColor: selected
                  ? `color-mix(in srgb, ${palette.primary.main} 8%, ${palette.background.paper})`
                  : palette.background.paper,
                '&:hover': {
                  borderColor: palette.primary.main,
                  backgroundColor: `color-mix(in srgb, ${palette.primary.main} ${selected ? 14 : 5}%, ${palette.background.paper})`,
                },
                '&.Mui-disabled .MuiSvgIcon-root': { color: palette.action.disabled },
                '@media (forced-colors: active)': {
                  backgroundColor: selected ? 'Highlight' : 'Canvas',
                  color: selected ? 'HighlightText' : 'CanvasText',
                },
              };
            }}>
            <Typography component="span" noWrap title={t(`categories.${category}`)}
              sx={{ minWidth: 0, fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' }}>
              {t(`categories.${category}`)}
            </Typography>
          </AppButton>
        ))}
      </Stack>
    </Stack>
  );
}
