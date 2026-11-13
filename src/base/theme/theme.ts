'use client';

import { createTheme } from '@mui/material/styles';
import { glassSurface } from './surfaces';
import { interactionTransition } from './interactions';

const brandPalette = {
  primary: {
    main: '#1E3A8A',
    light: '#0EA5E9',
    dark: '#172554',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#F97316',
    contrastText: '#1F2937',
  },
  success: {
    main: '#16A34A',
    light: '#DCFCE7',
    dark: '#166534',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#DC2626',
    light: '#FEE2E2',
    dark: '#991B1B',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
    contrastText: '#1F2937',
  },
  info: {
    main: '#0284C7',
    light: '#E0F2FE',
    dark: '#0369A1',
    contrastText: '#FFFFFF',
  },
} as const;

const appTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'data' },
  colorSchemes: {
    light: {
      palette: {
        ...brandPalette,
        mode: 'light',
        background: { default: '#FFFFFF', paper: '#FFFFFF' },
        text: { primary: '#0F172A', secondary: '#475569' },
        divider: 'rgba(30, 58, 138, 0.12)',
      },
    },
    dark: {
      palette: {
        ...brandPalette,
        mode: 'dark',
        primary: {
          ...brandPalette.primary,
          main: '#60A5FA',
          light: '#38BDF8',
          dark: '#1E3A8A',
          contrastText: '#0F172A',
        },
        info: {
          main: '#38BDF8',
          light: '#7DD3FC',
          dark: '#0284C7',
          contrastText: '#0F172A',
        },
        warning: {
          main: '#FBBF24',
          light: '#FDE68A',
          dark: '#D97706',
          contrastText: '#1F2937',
        },
        background: { default: '#071225', paper: '#0F1D33' },
        text: { primary: '#F8FAFC', secondary: '#B6C2D2' },
        divider: 'rgba(148, 163, 184, 0.22)',
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.25px',
    },
    h4: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '0px',
    },
    h5: { fontFamily: 'var(--font-display)', fontWeight: 600 },
    h6: { fontFamily: 'var(--font-display)', fontWeight: 600 },
    button: { fontFamily: 'var(--font-body)', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { minHeight: '100%' },
        body: { minHeight: '100%', margin: 0, fontFamily: 'var(--font-body)' },
        '*': { boxSizing: 'border-box' },
        a: { color: 'inherit', textDecoration: 'none' },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: { fontFamily: 'var(--font-body)' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 16,
          borderRadius: 'var(--app-radius-control)',
          textTransform: 'none',
          fontWeight: 600,
        },
        sizeLarge: { minHeight: 46, fontSize: '15px' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          const palette = theme.vars?.palette ?? theme.palette;

          return {
            minHeight: 44,
            // Khuyết viền theo label vẫn cập nhật ngay, không animate kích thước.
            '& .MuiOutlinedInput-notchedOutline legend': { transition: 'none' },
            borderRadius: 'var(--app-radius-control)',
            backgroundColor: palette.background.paper,
            '& .MuiOutlinedInput-notchedOutline': {
              ...interactionTransition(theme, ['border-color']),
            },
            ...interactionTransition(theme, ['box-shadow', 'background-color']),
            '&.Mui-focused:not(.Mui-error):not(.Mui-disabled)': {
              boxShadow: `0 0 0 3px color-mix(in srgb, ${palette.primary.main} 12%, transparent)`,
            },
            '&.Mui-error.Mui-focused:not(.Mui-disabled)': {
              boxShadow: `0 0 0 3px color-mix(in srgb, ${palette.error.main} 12%, transparent)`,
            },
            '&:not(.Mui-error):not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1.5,
            },
          };
        },
        input: { padding: '11px 14px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => {
          const palette = theme.vars?.palette ?? theme.palette;

          return {
            color: palette.text.secondary,
            fontWeight: 500,
            '&.Mui-focused': { color: palette.primary.main },
            '&.Mui-error': { color: palette.error.main },
            '&.Mui-disabled': { color: palette.text.disabled },
          };
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 4,
          marginTop: 6,
          fontSize: '12px',
          lineHeight: 1.5,
          overflowWrap: 'anywhere',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            borderRadius: 'var(--app-radius-card)',
            border: `1px solid ${(theme.vars?.palette ?? theme.palette).divider}`,
            boxShadow: 'none',
          };
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 'var(--app-radius-card)' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          ...glassSurface(theme, 'overlay'),
          borderRadius: 'var(--app-radius-dialog)',
        }),
        paperFullScreen: ({ theme }) => ({
          borderRadius: 0,
          border: 0,
          '@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))': {
            backgroundColor: (theme.vars?.palette ?? theme.palette).background.paper,
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          },
        }),
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          ...glassSurface(theme, 'overlay'),
          borderRadius: 'var(--app-radius-card)',
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: ({ theme }) => ({
          ...glassSurface(theme, 'overlay'),
          borderRadius: 'var(--app-radius-card)',
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: '12px',
          fontWeight: 700,
          textTransform: 'none',
          letterSpacing: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 'var(--app-radius-badge)', fontWeight: 600 },
      },
    },
  },
});

export default appTheme;
