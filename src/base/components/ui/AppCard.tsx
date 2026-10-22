'use client';

import { Box, Card, CardProps } from '@mui/material';

import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import type { ReactNode } from 'react';

export type AppCardVariant =
  | 'elevated'
  | 'primary'
  | 'transparent'
  | 'outlined'
  | 'flat'
  | 'danger';

export interface AppCardProps extends Omit<CardProps, 'variant'> {
  variant?: AppCardVariant;
  interactive?: boolean;
  icon?: ReactNode;
  iconSize?: number | string;
  contentSx?: SxProps<Theme>;
  layout?: 'default' | 'row';
}

function getCardStyles(
  variant: AppCardVariant,
  interactive: boolean,
  hasIcon: boolean,
  layout: 'default' | 'row' = 'default',
): SxProps<Theme> {
  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    const variantStyles = {
      elevated: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        border: `1px solid ${palette.divider}`,
        boxShadow: 'none',
      },

      primary: {
        color: palette.text.primary,
        backgroundColor: `color-mix(in srgb, ${palette.primary.main} 7%, ${palette.background.paper})`,
        border: `1px solid color-mix(in srgb, ${palette.primary.main} 20%, ${palette.divider})`,
        boxShadow: 'none',
      },

      danger: {
        color: palette.error.dark,
        backgroundColor: `color-mix(in srgb, ${palette.error.main} 8%, ${palette.background.paper})`,
        border: `1px solid color-mix(in srgb, ${palette.error.main} 22%, ${palette.divider})`,
        boxShadow: 'none',
      },

      transparent: {
        color: 'inherit',
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      },

      outlined: {
        backgroundColor: palette.background.paper,
        border: `1px solid ${palette.divider}`,
        boxShadow: 'none',
      },

      flat: {
        backgroundColor: `color-mix(in srgb, ${palette.primary.light} 8%, transparent)`,
        border: 'none',
        boxShadow: 'none',
      },
    };

    return {
      ...(layout === 'row'
        ? {
            display: 'grid',
            gridTemplateColumns: hasIcon
              ? 'auto minmax(0, 1fr)'
              : 'minmax(0, 1fr)',
            alignItems: 'center',
            columnGap: 2,
          }
        : hasIcon
          ? {
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }
          : {
              display: 'block',
            }),
      padding: {
        xs: '12px 16px',
        sm: '14px 20px',
      },
      borderRadius: '14px',
      overflow: 'hidden',
      cursor: 'default',
      transition: 'background-color 0.15s, border-color 0.15s',

      ...variantStyles[variant],

      ...(interactive && {
        cursor: 'pointer',
        transition: theme.transitions.create(['background-color', 'border-color'], {
          duration: 150,
        }),

        '&:hover': {
          borderColor: palette.primary.main,
          backgroundColor: `color-mix(in srgb, ${palette.primary.main} 3%, ${palette.background.paper})`,
        },

        '&:focus-visible': {
          outline: `3px solid color-mix(in srgb, ${palette.primary.light} 35%, transparent)`,
          outlineOffset: 2,
        },
      }),
    };
  };
}

const AppCard = ({
  children,
  variant = 'elevated',
  interactive = false,
  icon,
  iconSize = 16,
  contentSx,
  layout = 'default',
  sx,
  ...cardProps
}: AppCardProps) => {
  const resolvedIconSize =
    typeof iconSize === 'number' ? `${iconSize}px` : iconSize;

  return (
    <Card
      {...cardProps}
      sx={[
        getCardStyles(variant, interactive, Boolean(icon), layout),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {icon && (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: resolvedIconSize,
            height: resolvedIconSize,
            fontSize: resolvedIconSize,
            color: 'inherit',
            '& svg': {
              width: resolvedIconSize,
              height: resolvedIconSize,
              fontSize: 'inherit',
            },
          }}
        >
          {icon}
        </Box>
      )}

      <Box
        sx={[
          layout === 'row'
            ? {
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  md: 'minmax(0, 2fr) repeat(3, minmax(0, 1fr)) 120px',
                },
                alignItems: 'center',
                columnGap: 2,
                rowGap: 1.5,
                minWidth: 0,
              }
            : {
                display: 'block',
                width: '100%',
                minWidth: 0,
              },
          ...(Array.isArray(contentSx)
            ? contentSx
            : contentSx
              ? [contentSx]
              : []),
        ]}
      >
        {children}
      </Box>
    </Card>
  );
};

export default AppCard;
