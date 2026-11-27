'use client';

import { Box } from '@mui/material';
import type { AppMetricValueProps } from './AppMetricValue';
import AppMoneyText from './AppMoneyText';

export interface AppAmountRatioProps {
  amount: number;
  total?: number | null;
  currency: string;
  label: string;
  tone?: AppMetricValueProps['tone'];
  highlighted?: boolean;
  compact?: boolean;
  notation?: 'standard' | 'compact';
}

const AppAmountRatio = ({
  amount,
  total,
  currency,
  label,
  tone = 'primary',
  highlighted = false,
  compact = false,
  notation = compact ? 'compact' : 'standard',
}: AppAmountRatioProps) => {
  return (
    <Box
      role="group"
      title={compact ? label : undefined}
      aria-label={label}
      sx={(theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        return {
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: compact ? 'nowrap' : 'wrap',
          gap: 0.75,
          minWidth: 0,
          maxWidth: '100%',
          // Nhấn bằng nền nhạt và vạch màu bên trái; số tiền giữ cỡ chữ thường.
          ...(highlighted && !compact && {
            alignSelf: 'flex-start',
            px: 1,
            py: 0.5,
            borderRadius: 'var(--app-radius-small)',
            borderLeft: '3px solid',
            borderColor: palette[tone].main,
            bgcolor: `color-mix(in srgb, ${palette[tone].main} 8%, ${palette.background.paper})`,
          }),
        };
      }}
    >
      <AppMoneyText
        amount={amount}
        currency={currency}
        compact={notation === 'compact'}
        tone={tone}
        sx={{
          whiteSpace: 'nowrap',
          fontSize: compact ? '12px' : highlighted ? '13px' : '20px',
          ...(highlighted && !compact && { color: 'text.primary' }),
        }}
      />
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          gap: 0.5,
          alignItems: 'baseline',
          color: 'text.secondary',
          whiteSpace: 'nowrap',
          fontSize: compact ? '12px' : highlighted ? '13px' : '14px',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <span>/</span>
        <span>
          {total == null ? '—' : <AppMoneyText amount={total} currency={currency} compact={notation === 'compact'} sx={{ color: 'inherit', fontWeight: 'inherit' }} />}
        </span>
      </Box>
    </Box>
  );
};

export default AppAmountRatio;
