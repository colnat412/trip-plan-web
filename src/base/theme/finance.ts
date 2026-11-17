import type { Theme } from '@mui/material/styles';
import { pageBackground } from './page-background';

/** Receipt-inspired surfaces, scoped to Finance and its portal dialogs. */
export const financeStyles = (theme: Theme, surface = true) => {
  const palette = theme.vars?.palette ?? theme.palette;
  const backdrop = pageBackground(theme, 'quiet');
  return {
    ...(surface ? backdrop : {}),
    '--app-radius-card': '24px',
    '--app-radius-control': '14px',
    '--app-finance-background': backdrop.backgroundColor,
    ...(surface ? { '--app-page-surface': 'var(--app-finance-background)', backgroundColor: 'var(--app-finance-background)' } : {}),
    color: palette.text.primary,
    '& .MuiCard-root': {
      backgroundColor: palette.background.paper,
      backgroundImage: 'none',
      border: 0,
      borderRadius: 'var(--app-radius-card)',
      cornerShape: 'round',
      boxShadow: 'none',
    },
    '& [data-tab-navigation]': { backgroundColor: 'transparent' },
    '& .MuiAvatar-root': {
      backgroundColor: `color-mix(in srgb, ${palette.primary.main} 12%, ${palette.background.paper})`,
      color: palette.primary.main,
    },
    '& [data-finance-row]': { borderColor: `color-mix(in srgb, ${palette.divider} 60%, transparent)` },
    '& [data-finance-row]:not([data-density="dense"]) > :first-child': { py: 2, px: 0.5 },
    '& .MuiButton-root[data-dialog-action="primary"]': { minHeight: 52, borderRadius: 'var(--app-radius-control)' },
    '@media (forced-colors: active)': {
      '& .MuiCard-root': { border: '1px solid CanvasText' },
    },
  };
};
