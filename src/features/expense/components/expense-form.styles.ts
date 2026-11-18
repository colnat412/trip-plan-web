import type { SxProps, Theme } from '@mui/material/styles';

/** Scoped to the add/edit expense forms; labels keep their native input associations. */
export const expenseFormSx: SxProps<Theme> = (theme) => {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0,
    '--app-radius-segmented': 'var(--app-radius-control)',
    '--expense-choice-background': `color-mix(in srgb, ${palette.primary.main} 8%, ${palette.background.paper})`,
    '& .MuiFormControl-root': { minWidth: 0, gap: 0.75 },
    '& .MuiInputLabel-root': {
      position: 'static', transform: 'none', maxWidth: '100%',
      fontSize: '14px', fontWeight: 600, lineHeight: 1.5,
      color: palette.text.primary, pointerEvents: 'auto',
    },
    '& .MuiInputLabel-root.Mui-disabled': { color: palette.text.disabled },
    '& .MuiInputLabel-root.Mui-error': { color: palette.error.main },
    '& .MuiInputLabel-root + .MuiInputBase-root': { mt: 0 },
    '& .MuiOutlinedInput-root': {
      minHeight: 48, backgroundColor: palette.background.paper,
      borderRadius: 'var(--app-radius-control)',
    },
    '& .MuiOutlinedInput-notchedOutline': { top: 0 },
    '& .MuiOutlinedInput-notchedOutline legend': { display: 'none' },
    '& .MuiFormHelperText-root': { mx: 0, overflowWrap: 'anywhere' },
    '& [data-image-upload-frame]': { backgroundColor: palette.background.paper, borderStyle: 'solid' },
    '& [data-image-upload-frame][data-image-present="false"]': { height: 96, minHeight: 96 },
    '& [data-segment-indicator]': {
      backgroundColor: 'var(--expense-choice-background)', border: `1px solid ${palette.primary.main}`,
    },
    '& [data-segment][aria-pressed="true"]': {
      color: palette.primary.main,
      '&:hover': { color: palette.primary.main },
      '&.Mui-focusVisible': { outlineColor: palette.primary.main },
      '&.Mui-disabled': { color: palette.text.disabled },
    },
    '@media (forced-colors: active)': {
      '--expense-choice-background': 'Highlight',
      '& [data-segment-indicator]': { backgroundColor: 'Highlight', borderColor: 'Highlight' },
      '& [data-segment][aria-pressed="true"]': { color: 'HighlightText', '&:hover': { color: 'HighlightText' } },
    },
  };
};

export const expenseFormPaperSx: SxProps<Theme> = (theme) => {
  const palette = theme.vars?.palette ?? theme.palette;
  const canvas = `color-mix(in srgb, ${palette.primary.main} 4%, ${palette.background.default})`;
  return {
    '--app-finance-background': canvas,
    backgroundColor: canvas, backgroundImage: 'none',
    '& .MuiDialogTitle-root': { minHeight: 64, py: 0, backgroundColor: canvas },
    '& .MuiDialogContent-root': { backgroundColor: canvas },
    '& .MuiDialogActions-root': { backgroundColor: palette.background.paper, borderTop: `1px solid ${palette.divider}` },
    '@media (forced-colors: active)': {
      '--app-finance-background': 'Canvas', backgroundColor: 'Canvas',
      '& .MuiDialogTitle-root, & .MuiDialogContent-root, & .MuiDialogActions-root': { backgroundColor: 'Canvas' },
    },
  };
};
