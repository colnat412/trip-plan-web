import type { CSSObject, Theme } from '@mui/material/styles';

/** Animate paint-only feedback without moving content or delaying reduced-motion users. */
export const interactionTransition = (theme: Theme, properties: string[]): CSSObject => ({
  transition: theme.transitions.create(properties, { duration: 180 }),
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
});
