'use client';

import { Chip, type ChipProps } from '@mui/material';

export interface AppStatusChipProps extends Omit<ChipProps, 'color'> {
  tone?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

const AppStatusChip = ({
  tone = 'neutral',
  size = 'small',
  sx,
  ...props
}: AppStatusChipProps) => (
  <Chip
    {...props}
    size={size}
    sx={[
      (theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        const colors = tone === 'neutral' ? null : palette[tone];
        return {
          alignSelf: 'flex-start',
          maxWidth: '100%',
          height: 'auto',
          minHeight: 24,
          fontSize: '11px',
          fontWeight: 600,
          borderRadius: 'var(--app-radius-badge)',
          bgcolor: colors
            ? `color-mix(in srgb, ${colors.main} 10%, ${palette.background.paper})`
            : palette.action.hover,
          color: colors ? colors.dark : palette.text.secondary,
          '& .MuiChip-label': {
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
            py: 0.25,
          },
          '& .MuiChip-icon': { color: 'inherit', fontSize: '14px' },
          ...theme.applyStyles('dark', {
            color: colors ? colors.light : palette.text.secondary,
          }),
        };
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  />
);

export default AppStatusChip;
