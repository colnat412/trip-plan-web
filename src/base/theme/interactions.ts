import type { CSSObject, Theme } from '@mui/material/styles';

/** Animate paint-only feedback without moving content or delaying reduced-motion users. */
export const interactionTransition = (theme: Theme, properties: string[]): CSSObject => ({
  transition: theme.transitions.create(properties, { duration: 180 }),
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
});

/** A compact 24px control with a transparent 44px vertical pointer target. */
export const compactTouchTarget = {
  position: 'relative',
  minHeight: 24,
  '&::before': {
    content: '""',
    position: 'absolute',
    insetInline: 0,
    top: -10,
    bottom: -10,
  },
} as const;
