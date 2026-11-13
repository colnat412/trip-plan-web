import type { CSSObject, Theme } from '@mui/material/styles';

type SurfaceKind = 'card' | 'overlay' | 'navigation';

/** Content stays opaque; reserve glass for floating controls and navigation. */
export const glassSurface = (theme: Theme, kind: SurfaceKind = 'card'): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  const floating = kind !== 'card';
  const opacity = kind === 'navigation' ? 84 : 94;
  const highlight = `color-mix(in srgb, ${palette.common.white} 20%, transparent)`;

  return {
    backgroundColor: palette.background.paper,
    backgroundImage: 'none',
    border: `1px solid ${palette.divider}`,
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
