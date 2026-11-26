'use client';

import React from 'react';
import { selectedSurface } from '@/base/theme/surfaces';
import {
  Chip,
  type ChipProps,
  Box,
  Typography,
  Stack,
  type SxProps,
  type Theme,
} from '@mui/material';

export interface AppFilterChipOption<T = string> {
  value: T;
  label: string;
  title?: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface AppFilterChipProps extends Omit<ChipProps, 'onClick'> {
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
  count?: number;
}

export const AppFilterChip = ({
  selected = false,
  compact = false,
  onClick,
  count,
  label,
  size = 'small',
  sx,
  ...chipProps
}: AppFilterChipProps) => {
  return (
    <Chip
      {...chipProps}
      size={size}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
          <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</Box>
          {typeof count === 'number' && (
            <Box
              component="span"
              sx={{
                px: 0.6,
                py: 0.1,
                fontSize: '10.5px',
                fontWeight: 700,
                borderRadius: 'var(--app-radius-pill)',
                bgcolor: 'action.selected',
                color: 'inherit',
                lineHeight: 1.2,
              }}
            >
              {count}
            </Box>
          )}
        </Box>
      }
      sx={[ (theme) => ({
        height: 'auto',
        minHeight: onClick ? compact ? 36 : 44 : size === 'small' ? 28 : 34,
        ...(compact && onClick && {
          position: 'relative',
          '&::after': { content: '""', position: 'absolute', insetInline: 0, top: -4, bottom: -4 },
        }),
        minWidth: onClick ? 44 : undefined,
        fontSize: size === 'small' ? '12px' : '13px',
        fontWeight: selected ? 700 : 500,
        borderRadius: 'var(--app-radius-small)',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary',
        '&:hover': {
          bgcolor: 'action.hover',
          borderColor: 'primary.main',
          color: 'text.primary',
        },
        ...(selected && selectedSurface(theme)),
      }), ...(Array.isArray(sx) ? sx : sx ? [sx] : []) ]}
    />
  );
};

export interface AppFilterChipGroupProps<T = string> {
  label?: string;
  options: AppFilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  showAll?: boolean;
  allLabel?: string;
  allValue?: T;
  scrollable?: boolean;
  compact?: boolean;
  sx?: SxProps<Theme>;
}

export const AppFilterChipGroup = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  showAll = true,
  allLabel = 'Tất cả',
  allValue = '' as unknown as T,
  scrollable = true,
  compact = false,
  sx,
}: AppFilterChipGroupProps<T>) => {
  const isAllSelected = value === allValue;

  return (
    <Stack
      role={label ? 'group' : undefined}
      aria-label={label}
      direction="row"
      spacing={0.75}
      sx={{
        alignItems: 'center',
        overflowX: scrollable ? 'auto' : 'visible',
        flexWrap: scrollable ? 'nowrap' : 'wrap',
        py: compact ? 0.5 : 0.25,
        WebkitOverflowScrolling: 'touch',
        '::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        ...sx,
      }}
    >
      {label && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            fontSize: '11.5px',
            flexShrink: 0,
          }}
        >
          {label}
        </Typography>
      )}

      {showAll && (
        <AppFilterChip
          compact={compact}
          label={allLabel}
          selected={isAllSelected}
          onClick={() => onChange(allValue)}
        />
      )}

      {options.map((opt) => {
        const isSelected =
          typeof value === 'string' && typeof opt.value === 'string'
            ? opt.value.trim().toLowerCase() === value.trim().toLowerCase() && Boolean(value.trim())
            : opt.value === value;
        return (
          <AppFilterChip
            key={String(opt.value)}
            compact={compact}
            label={opt.label}
            title={opt.title}
            aria-label={opt.title ?? opt.label}
            count={opt.count}
            icon={opt.icon as React.ReactElement | undefined}
            selected={isSelected}
            onClick={() => onChange(isSelected ? allValue : opt.value)}
          />
        );
      })}
    </Stack>
  );
};

export default AppFilterChip;
