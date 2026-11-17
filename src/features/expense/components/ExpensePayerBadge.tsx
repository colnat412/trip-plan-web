'use client';

import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function ExpensePayerBadge() {
  const t = useTranslations('expense.form');
  return (
    <Typography component="span" sx={(theme) => {
      const palette = theme.vars?.palette ?? theme.palette;
      return {
        display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center',
        px: 0.75, py: 0.125, borderRadius: 'var(--app-radius-badge)',
        fontSize: '11px', fontWeight: 600, lineHeight: 1.5,
        color: palette.primary.main,
        backgroundColor: `color-mix(in srgb, ${palette.primary.main} 8%, ${palette.background.paper})`,
        '@media (forced-colors: active)': { color: 'HighlightText', backgroundColor: 'Highlight' },
      };
    }}>
      {t('payerTag')}
    </Typography>
  );
}
