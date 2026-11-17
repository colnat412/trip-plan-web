'use client';

import type { ReactNode } from 'react';
import {
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import AppMascot from './AppMascot';

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
        {illustration ?? <AppMascot mood="empty_data" size={compact ? 64 : 104} />}
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
              fontSize: compact ? 14 : 15,
              fontWeight: 600,
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
