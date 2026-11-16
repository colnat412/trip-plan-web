import type { DialogProps } from '@mui/material/Dialog';
import type { CSSObject } from '@mui/material/styles';

const dialogWidths = {
  xs: 'var(--app-dialog-width-compact)',
  sm: 'var(--app-dialog-width)',
  md: 'var(--app-dialog-width-wide)',
  lg: 'var(--app-dialog-width-large)',
  xl: 'var(--app-dialog-width-extra-large)',
} as const;

/** One viewport-safe sizing policy for form, confirmation and custom dialogs. */
export function dialogPaperLayout({ fullScreen, fullWidth, maxWidth = 'sm' }: Pick<DialogProps, 'fullScreen' | 'fullWidth' | 'maxWidth'>): CSSObject {
  if (fullScreen) {
    return { margin: 0, width: '100%', maxWidth: '100%', height: '100dvh', maxHeight: '100dvh', minWidth: 0 };
  }
  return {
    margin: 'var(--app-dialog-inset)',
    ...(fullWidth && { width: 'calc(100% - 2 * var(--app-dialog-inset))' }),
    maxWidth: maxWidth === false ? 'calc(100% - 2 * var(--app-dialog-inset))' : dialogWidths[maxWidth],
    maxHeight: 'var(--app-dialog-max-height)',
    minWidth: 0,
  };
}
