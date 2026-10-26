'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface AppPageHeaderProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const AppPageHeader = ({
  title,
  icon,
  badge,
  subtitle,
  actions,
  sx,
}: AppPageHeaderProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        flexWrap: 'wrap',
        minWidth: 0,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          minWidth: 0,
          maxWidth: '100%',
          flex: { xs: '0 1 auto', md: '1 1 240px' },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          {icon && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'primary.main',
                fontSize: '24px',
              }}
            >
              {icon}
            </Box>
          )}

          {typeof title === 'string' ? (
            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.5px',
                minWidth: 0,
                overflowWrap: 'anywhere',
              }}
            >
              {title}
            </Typography>
          ) : (
            title
          )}

          {badge !== undefined &&
            badge !== null &&
            badge !== '' &&
            (typeof badge === 'string' || typeof badge === 'number' ? (
              <Box
                sx={{
                  px: 1,
                  py: 0.2,
                  borderRadius: '999px',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  border: 0,
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  lineHeight: 1.4,
                  minWidth: 0,
                  maxWidth: '100%',
                  overflowWrap: 'anywhere',
                }}
              >
                {badge}
              </Box>
            ) : (
              badge
            ))}
        </Stack>

        {subtitle &&
          (typeof subtitle === 'string' ? (
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '14px',
                overflowWrap: 'anywhere',
              }}
            >
              {subtitle}
            </Typography>
          ) : (
            <Box sx={{ minWidth: 0 }}>{subtitle}</Box>
          ))}
      </Box>

      {actions && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            alignItems: 'center',
            flexShrink: 0,
            flexWrap: 'wrap',
            '& > .MuiButton-root': { flex: { xs: '1 0 auto', sm: '0 0 auto' } },
            minWidth: 0,
            maxWidth: '100%',
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
          {actions}
        </Stack>
      )}
    </Box>
  );
};

export default AppPageHeader;
