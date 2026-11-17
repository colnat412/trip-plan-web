'use client';

import type { ReactNode, KeyboardEvent } from 'react';
import Link from 'next/link';
import { Box, ButtonBase, Tooltip, Typography, type SxProps, type Theme } from '@mui/material';
import { segmentedFrame, segmentedIndicator, SEGMENTED_GAP, SEGMENTED_PADDING, SEGMENTED_RADIUS } from '@/base/theme/segmented-control';

export interface AppSegmentOption<T extends string | number> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
  href?: string;
  disabled?: boolean;
}

export interface AppSegmentedControlProps<T extends string | number> {
  options: readonly AppSegmentOption<T>[];
  value: T;
  label: string;
  onChange?: (value: T) => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  buttonSx?: SxProps<Theme>;
}

/** One capsule geometry for route tabs and exclusive mode selectors. */
export default function AppSegmentedControl<T extends string | number>({
  options, value, label, onChange, disabled = false, sx, buttonSx,
}: AppSegmentedControlProps<T>) {
  const activeIndex = options.findIndex(option => option.value === value);
  const navigation = options.some(option => option.href);
  const moveFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-segment]:not([disabled]):not([aria-disabled="true"])'));
    const current = buttons.indexOf(document.activeElement as HTMLElement);
    if (!buttons.length || current < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
      : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  };
  return <Box component={navigation ? 'nav' : 'div'} role={navigation ? undefined : 'group'} aria-label={label} onKeyDown={moveFocus}
    sx={[theme => ({ ...segmentedFrame(theme), gridTemplateColumns: `repeat(${Math.max(1, options.length)}, minmax(0, 1fr))` }), ...(Array.isArray(sx) ? sx : sx ? [sx] : []), { borderRadius: SEGMENTED_RADIUS, cornerShape: 'round' }]}>
    {activeIndex >= 0 && <Box aria-hidden="true" data-segment-indicator sx={theme => ({
      ...segmentedIndicator(theme),
      width: `calc((100% - ${SEGMENTED_PADDING * 2 + SEGMENTED_GAP * (options.length - 1)}px) / ${options.length})`,
      transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * SEGMENTED_GAP}px))`,
      opacity: disabled ? 0.45 : 1,
    })} />}
    {options.map(option => {
      const selected = option.value === value;
      const unavailable = disabled || option.disabled;
      const content = typeof option.label === 'string' || typeof option.label === 'number'
        ? <Typography component="span" noWrap title={String(option.label)} sx={{ fontSize: 14, lineHeight: 1.5, fontWeight: selected ? 600 : 500, minWidth: 0 }}>{option.label}</Typography>
        : option.label;
      const props = {
        'data-segment': true,
        'aria-label': option.ariaLabel,
        disabled: unavailable,
        disableRipple: true,
        sx: [
          (theme: Theme) => ({
            position: 'relative', minWidth: 44, minHeight: 40, px: 1, py: 0.5, gap: 0.5,
            color: selected ? (theme.vars?.palette ?? theme.palette).primary.contrastText : 'text.secondary',
            backgroundColor: 'transparent',
            '&::before': { content: '""', position: 'absolute', insetInline: 0, top: -2, bottom: -2 },
            '&:hover': { backgroundColor: 'transparent', color: selected ? (theme.vars?.palette ?? theme.palette).primary.contrastText : 'text.primary' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: selected ? 'currentColor' : 'primary.main', outlineOffset: -2 },
            '&.Mui-disabled': { color: 'text.disabled' },
            '@media (forced-colors: active)': { color: selected ? 'HighlightText' : 'ButtonText' },
          }),
          ...(Array.isArray(buttonSx) ? buttonSx : buttonSx ? [buttonSx] : []),
          { borderRadius: SEGMENTED_RADIUS, cornerShape: 'round' },
        ] as SxProps<Theme>,
        children: content,
      };
      const button = option.href
        ? <ButtonBase {...props} component={Link} href={option.href} scroll={false} aria-current={selected ? 'page' : undefined} />
        : <ButtonBase {...props} type="button" aria-pressed={selected} onClick={() => { if (!unavailable && !selected) onChange?.(option.value); }} />;
      return <Tooltip key={option.value} title={option.ariaLabel ?? ''} disableHoverListener={unavailable}>{button}</Tooltip>;
    })}
  </Box>;
}
