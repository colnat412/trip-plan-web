'use client';

import { Box } from '@mui/material';

export interface AppNumberBadgeProps {
  value: number;
  size?: number;
  tone?: 'primary' | 'success';
}

// Vòng tròn số thứ tự, dùng làm điểm đánh dấu trên trục timeline.
const AppNumberBadge = ({
  value,
  size = 28,
  tone = 'primary',
}: AppNumberBadgeProps) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: '50%',
      bgcolor: `${tone}.main`,
      color: `${tone}.contrastText`,
      fontSize: '13px',
      fontWeight: 800,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {value}
  </Box>
);

export default AppNumberBadge;
