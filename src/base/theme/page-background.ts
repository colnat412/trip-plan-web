import type { CSSObject, Theme } from '@mui/material/styles';

/** A flat light canvas with ambient gradients retained for dark mode. */
export const pageBackground = (theme: Theme, mood: 'ambient' | 'quiet' = 'ambient'): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  const quiet = mood === 'quiet';
  return {
    backgroundColor: palette.background.default,
    backgroundImage: 'none',
    ...theme.applyStyles('dark', {
      backgroundColor: `color-mix(in srgb, ${palette.primary.light} ${quiet ? 1 : 3}%, ${palette.background.default})`,
      backgroundImage: [
        `radial-gradient(ellipse 75% 48% at 0% 0%, color-mix(in srgb, ${palette.primary.light} ${quiet ? 4 : 14}%, transparent), transparent 78%)`,
        `radial-gradient(ellipse 55% 55% at 100% 100%, color-mix(in srgb, ${palette.primary.main} ${quiet ? 2 : 7}%, transparent), transparent 76%)`,
      ].join(', '),
      '@media (prefers-contrast: more), (prefers-reduced-transparency: reduce), (forced-colors: active)': {
        backgroundImage: 'none',
        backgroundColor: palette.background.default,
      },
    }),
    backgroundRepeat: 'no-repeat',
    '@media (prefers-contrast: more), (prefers-reduced-transparency: reduce), (forced-colors: active)': {
      backgroundImage: 'none',
      backgroundColor: palette.background.default,
    },
  };
};
