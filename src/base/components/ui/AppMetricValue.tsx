'use client';

import { Typography, type TypographyProps } from '@mui/material';

export interface AppMetricValueProps extends TypographyProps {
  tone?: 'primary' | 'success' | 'error';
}

const AppMetricValue = ({
  tone = 'primary',
  sx,
  ...props
}: AppMetricValueProps) => (
  <Typography
    component="span"
    {...props}
    sx={[
      (theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        return {
          display: 'inline-block',
          minWidth: 0,
          maxWidth: '100%',
          fontSize: 'inherit',
          fontWeight: 700,
          lineHeight: 1.4,
          fontVariantNumeric: 'tabular-nums',
          overflowWrap: 'anywhere',
          color: tone === 'primary' ? palette.primary.main : palette[tone].dark,
          ...theme.applyStyles('dark', {
            color:
              tone === 'primary' ? palette.primary.main : palette[tone].light,
          }),
        };
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  />
);

export default AppMetricValue;
