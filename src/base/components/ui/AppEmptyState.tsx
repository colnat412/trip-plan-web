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
  compact?: boolean;
  role?: 'status' | 'alert';
  sx?: SxProps<Theme>;
}

const AppEmptyState = ({
  title,
  description,
  icon = <InboxRoundedIcon sx={{ fontSize: 40 }} />,
  action,
  illustration,
  compact = false,
  role = 'status',
  sx,
}: AppEmptyStateProps) => {
  return (
    <Stack
      role={role}
      spacing={1.5}
      sx={[
        {
          alignItems: compact ? 'stretch' : 'center',
          justifyContent: 'center',
          textAlign: compact ? 'left' : 'center',
          minWidth: 0,
          width: '100%',
          py: compact ? 0 : 4,
          px: compact ? 0 : 2,
          overflowWrap: 'anywhere',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Stack
        direction={compact ? 'row' : 'column'}
        spacing={1.5}
        sx={{ alignItems: 'center', minWidth: 0 }}
      >
        {illustration ?? (
          <Box
            aria-hidden="true"
            sx={{
              p: compact ? 1.25 : 2,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              color: 'text.secondary',
              display: 'inline-flex',
              flexShrink: 0,
              '& .MuiSvgIcon-root': { fontSize: compact ? 24 : 40 },
            }}
          >
            {icon}
          </Box>
        )}
        <Stack
          spacing={0.5}
          sx={{
            alignItems: compact ? 'flex-start' : 'center',
            minWidth: 0,
            maxWidth: compact ? '100%' : 380,
          }}
        >
          <Typography
            component="p"
            sx={{
              fontSize: compact ? 14 : 16,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Stack>
      </Stack>
      {action}
    </Stack>
  );
};

export default AppEmptyState;
