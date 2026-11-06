'use client';

import { useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Box, Stack, type SxProps, type Theme } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useTranslations } from 'next-intl';

import AppButton from './AppButton';
import AppEmptyState from './AppEmptyState';
import AppErrorIllustration from './AppErrorIllustration';

export interface AppErrorStateProps {
  variant?: 'load' | 'unexpected' | 'notFound' | 'forbidden';
  status?: number | null;
  compact?: boolean;
  onRetry?: () => unknown | Promise<unknown>;
  retryLabel?: string;
  retrying?: boolean;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

const AppErrorState = ({
  variant,
  status,
  compact = false,
  onRetry,
  retryLabel,
  retrying = false,
  action,
  sx,
}: AppErrorStateProps) => {
  const t = useTranslations('errors');
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const kind =
    variant ??
    (status === 403 ? 'forbidden' : status === 404 ? 'notFound' : 'load');
  const canRetry =
    Boolean(onRetry) && kind !== 'notFound' && kind !== 'forbidden';
  const retry = async () => {
    if (!onRetry || inFlight.current || retrying) return;
    inFlight.current = true;
    setPending(true);
    try {
      await onRetry();
    } catch {
      // The owning query retains its error; let the user retry without an unhandled rejection.
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return (
    <Box
      data-page-error={compact ? undefined : true}
      sx={[
        {
          width: '100%',
          minWidth: 0,
          ...(!compact && { maxWidth: 560, margin: 'auto', flexShrink: 0 }),
          ...(!compact && {
            display: 'flex',
            alignItems: 'center',
            minHeight: { xs: 320, sm: 360 },
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: '24px',
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <AppEmptyState
        role="alert"
        illustration={<AppErrorIllustration compact={compact} />}
        title={
          <Box
            component="span"
            sx={{
              fontSize: compact ? 14 : { xs: 18, sm: 20 },
              lineHeight: 1.5,
            }}
          >
            {t('title')}
          </Box>
        }
        action={
          <Stack
            direction="row"
            useFlexGap
            spacing={1}
            sx={{
              justifyContent: 'center',
              flexWrap: 'wrap',
              maxWidth: '100%',
            }}
          >
            {canRetry && (
              <AppButton
                size={compact ? 'small' : 'medium'}
                startIcon={<RefreshRoundedIcon />}
                loading={pending || retrying}
                onClick={() => void retry()}
                wrapLabel
                sx={{ minHeight: 44, minWidth: compact ? 112 : 140 }}
              >
                {retryLabel ?? t('retry')}
              </AppButton>
            )}
            {action}
            {!canRetry && !action && (
              <AppButton
                component={Link}
                href="/overview"
                size="medium"
                wrapLabel
              >
                {t('home')}
              </AppButton>
            )}
          </Stack>
        }
        sx={{
          py: compact ? 2 : 4,
          px: compact ? 1 : 2,
          gap: compact ? 0.75 : 1.5,
        }}
      />
    </Box>
  );
};

export default AppErrorState;
