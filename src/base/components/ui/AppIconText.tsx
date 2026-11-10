'use client';

import type { ReactNode } from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';

export interface AppIconTextProps {
  icon: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const AppIconText = ({ icon, children, sx }: AppIconTextProps) => (
  <Box
    component="span"
    sx={[
      {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        minWidth: 0,
        maxWidth: '100%',
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        '& .MuiSvgIcon-root': { display: 'block', fontSize: 16 },
      }}
    >
      {icon}
    </Box>
    <Typography
      component="span"
      sx={{
        fontSize: '13px',
        lineHeight: '20px',
        minWidth: 0,
        overflowWrap: 'anywhere',
        textAlign: 'left',
      }}
    >
      {children}
    </Typography>
  </Box>
);

export default AppIconText;
