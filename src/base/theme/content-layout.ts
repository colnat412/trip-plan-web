import type { CSSObject } from '@mui/material/styles';

/** Fill available body height while allowing long content to grow into the main scroll. */
export const contentColumn: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 auto',
  minWidth: 0,
  minHeight: 0,
};
