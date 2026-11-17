import type { CSSObject, Theme } from '@mui/material/styles';
import { glassSurface } from './surfaces';

export const SEGMENTED_PADDING = 4;
export const SEGMENTED_GAP = 4;
export const SEGMENTED_RADIUS = 'var(--app-radius-segmented, var(--app-radius-pill))';

export const segmentedFrame = (theme: Theme): CSSObject => ({
  ...glassSurface(theme, 'navigation'),
  position: 'relative', display: 'grid', width: '100%', minWidth: 0,
  gap: `${SEGMENTED_GAP}px`, padding: `${SEGMENTED_PADDING}px`,
  borderRadius: SEGMENTED_RADIUS, cornerShape: 'round',
  backgroundImage: 'none', boxShadow: 'none',
});

export const segmentedIndicator = (theme: Theme): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    position: 'absolute', pointerEvents: 'none',
    top: SEGMENTED_PADDING, bottom: SEGMENTED_PADDING, left: SEGMENTED_PADDING,
    borderRadius: SEGMENTED_RADIUS, cornerShape: 'round',
    backgroundColor: palette.primary.main, boxShadow: 'none',
    transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    '@media (forced-colors: active)': { backgroundColor: 'Highlight' },
  };
};
