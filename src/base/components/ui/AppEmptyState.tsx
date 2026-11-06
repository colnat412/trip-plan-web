'use client';

import type { ReactNode } from 'react';
import {
  Box,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

export interface AppEmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  illustration?: ReactNode;
  role?: 'status' | 'alert';
  sx?: SxProps<Theme>;
}

const AppEmptyState = ({
  title,
  description,
  icon = <InboxRoundedIcon sx={{ fontSize: 40 }} />,
  action,
  illustration,
  role = 'status',
  sx,
}: AppEmptyStateProps) => {
  return (
    <Stack
      role={role}
      spacing={1.5}
      sx={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minWidth: 0,
          width: '100%',
          py: 4,
          px: 2,
          overflowWrap: 'anywhere',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {illustration ?? (
        <Box
          aria-hidden="true"
          sx={{
            p: 2,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'text.secondary',
            display: 'inline-flex',
            '& .MuiSvgIcon-root': { fontSize: 40 },
          }}
        >
          {icon}
        </Box>
      )}
      <Stack
        spacing={0.5}
        sx={{ alignItems: 'center', minWidth: 0, maxWidth: 380 }}
      >
        <Typography
          component="p"
          sx={{ fontSize: 16, fontWeight: 700, color: 'text.primary' }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
      {action}
    </Stack>
  );
};

export default AppEmptyState;
