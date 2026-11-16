import type { CSSObject, Theme } from '@mui/material/styles';

type SurfaceKind = 'card' | 'overlay' | 'navigation';

/** Content stays opaque; reserve glass for floating controls and navigation. */
export const glassSurface = (theme: Theme, kind: SurfaceKind = 'card'): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  const floating = kind !== 'card';
  const opacity = kind === 'navigation' ? 84 : 90;
  const highlight = `color-mix(in srgb, ${palette.common.white} 20%, transparent)`;

  return {
    backgroundColor: palette.background.paper,
    backgroundImage: 'none',
    border: `1px solid ${floating ? `color-mix(in srgb, ${palette.common.white} 18%, ${palette.divider})` : palette.divider}`,
    boxShadow: `inset 0 1px 0 ${highlight}, 0 ${floating ? 12 : 2}px ${floating ? 36 : 12}px color-mix(in srgb, ${palette.common.black} ${floating ? 12 : 3}%, transparent)`,
    ...(floating && {
      '@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))': {
        backgroundColor: `color-mix(in srgb, ${palette.background.paper} ${opacity}%, transparent)`,
        backdropFilter: 'blur(20px) saturate(125%)',
        WebkitBackdropFilter: 'blur(20px) saturate(125%)',
      },
    }),
    '@media (prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)': {
      backgroundColor: palette.background.paper,
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      boxShadow: 'none',
      borderColor: palette.text.secondary,
    },
  };
};

/** Muted color fill and readable ink, both following the active color scheme. */
export const tonalSurface = (theme: Theme, strength = 26): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    backgroundColor: `color-mix(in srgb, ${palette.primary.main} ${strength}%, ${palette.background.paper})`,
    color: `color-mix(in srgb, ${palette.primary.main} 75%, ${palette.text.primary})`,
    borderColor: `color-mix(in srgb, ${palette.primary.main} 48%, ${palette.divider})`,
  };
};

/** Blend the two brand blues into one color without diluting them with paper. */
export const brandSurface = (theme: Theme, lightShare = 28): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    backgroundColor: `color-mix(in srgb, ${palette.primary.main} ${100 - lightShare}%, ${palette.primary.light})`,
    color: palette.primary.contrastText,
    borderColor: 'transparent',
  };
};

/** Shared selected treatment for navigation, choices and filters in both color schemes. */
export const selectedSurface = (theme: Theme): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    ...brandSurface(theme),
    backgroundImage: 'none',
    boxShadow: 'none',
    '& .MuiSvgIcon-root, & .MuiListItemIcon-root': { color: 'inherit' },
    '&:hover': brandSurface(theme, 20),
    '&:active': brandSurface(theme, 12),
    '@media (prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)': {
      ...brandSurface(theme),
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      boxShadow: 'none',
    },
    '@media (forced-colors: active)': {
      backgroundColor: 'Highlight',
      color: 'HighlightText',
      borderColor: 'Highlight',
      '&:hover, &:active': { backgroundColor: 'Highlight', color: 'HighlightText' },
    },
    '&.Mui-disabled': {
      backgroundColor: palette.action.disabledBackground,
      color: palette.action.disabled,
      borderColor: 'transparent',
    },
  };
};
