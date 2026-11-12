'use client';

import { Box } from '@mui/material';
import { useLocale } from 'next-intl';
import { formatCurrency } from '@/base/utils';
import AppMetricValue, { type AppMetricValueProps } from './AppMetricValue';

export interface AppAmountRatioProps {
  amount: number;
  total?: number | null;
  currency: string;
  label: string;
  tone?: AppMetricValueProps['tone'];
  highlighted?: boolean;
}

const AppAmountRatio = ({
  amount,
  total,
  currency,
  label,
  tone = 'primary',
  highlighted = false,
}: AppAmountRatioProps) => {
  const locale = useLocale();
  return (
    <Box
      role="group"
      aria-label={label}
      sx={(theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        return {
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 0.75,
          minWidth: 0,
          maxWidth: '100%',
          // Nhấn bằng nền nhạt và vạch màu bên trái; số tiền giữ cỡ chữ thường.
          ...(highlighted && {
            alignSelf: 'flex-start',
            px: 1,
            py: 0.5,
            borderRadius: '8px',
            borderLeft: '3px solid',
            borderColor: palette[tone].main,
            bgcolor: `color-mix(in srgb, ${palette[tone].main} 8%, ${palette.background.paper})`,
          }),
        };
      }}
    >
      <AppMetricValue
        tone={tone}
        sx={{
          whiteSpace: 'nowrap',
          fontSize: highlighted ? '13px' : '20px',
          ...(highlighted && { color: 'text.primary' }),
        }}
      >
        {formatCurrency(amount, currency, locale)}
      </AppMetricValue>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          gap: 0.5,
          alignItems: 'baseline',
          color: 'text.secondary',
          whiteSpace: 'nowrap',
          fontSize: highlighted ? '13px' : '14px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>/</span>
        <span>
          {total == null ? '—' : formatCurrency(total, currency, locale)}
        </span>
      </Box>
    </Box>
  );
};

export default AppAmountRatio;
