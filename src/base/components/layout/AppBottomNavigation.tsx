'use client';

import Link from 'next/link';
import { Box, ButtonBase, Tooltip, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { isAppNavigationActive, MOBILE_PRIMARY_NAVIGATION_ITEMS, DESKTOP_NAV_BREAKPOINT } from './navigation/config';
import { SEGMENTED_RADIUS } from '@/base/theme/segmented-control';
import { glassSurface } from '@/base/theme/surfaces';
import AppCreateTripButton from './AppCreateTripButton';

const AppBottomNavigation = ({ guest = false }: { guest?: boolean }) => {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const items = MOBILE_PRIMARY_NAVIGATION_ITEMS.filter(item => !guest || item.id !== 'settings');
  const activeIndex = items.findIndex(item => isAppNavigationActive(pathname, item));
  return <Box component="nav" aria-label={t('main')} sx={(theme) => ({
    position: 'fixed', insetInline: 0, bottom: 0, zIndex: theme.zIndex.appBar,
    display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    pb: 'calc(12px + env(safe-area-inset-bottom, 0px))', px: 'max(12px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))',
    [theme.breakpoints.up(DESKTOP_NAV_BREAKPOINT)]: { display: 'none' },
  })}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', minWidth: 0, maxWidth: 440, pointerEvents: 'auto' }}>
      <Box sx={(theme) => ({ ...glassSurface(theme, 'navigation'), backgroundImage: 'none', boxShadow: 'none',
        position: 'relative', display: 'grid', gridTemplateColumns: items.map((_, index) => index === activeIndex ? 'minmax(0, 2.2fr)' : 'minmax(0, 1fr)').join(' '),
        transition: 'grid-template-columns 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        [theme.breakpoints.down(360)]: { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        flex: 1, minWidth: 0, height: 56, p: 0.5, borderRadius: SEGMENTED_RADIUS, cornerShape: 'round' })}>
        {activeIndex >= 0 && <Box aria-hidden="true" data-navigation-indicator sx={(theme) => ({
          position: 'absolute', pointerEvents: 'none', top: 4, bottom: 4, left: 4,
          width: `calc((100% - 10px) * 2.2 / ${items.length + 1.2})`,
          transform: `translateX(${activeIndex * 100 / 2.2}%)`,
          borderRadius: SEGMENTED_RADIUS, cornerShape: 'round',
          bgcolor: `color-mix(in srgb, ${(theme.vars?.palette ?? theme.palette).primary.main} 7%, transparent)`,
          transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), width 280ms cubic-bezier(0.22, 1, 0.36, 1)',
          [theme.breakpoints.down(360)]: { width: `calc((100% - 10px) / ${items.length})`, transform: `translateX(${activeIndex * 100}%)` },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          '@media (forced-colors: active)': { bgcolor: 'Highlight' },
        })} />}
        {items.map(item => {
          const active = isAppNavigationActive(pathname, item);
          return <Tooltip key={item.id} title={t(`mobile.${item.id}`)}><ButtonBase component={Link} href={item.href}
            aria-label={t(`mobile.${item.id}`)} aria-current={active ? 'page' : undefined}
            sx={{ position: 'relative', minWidth: 44, minHeight: 44, gap: active ? 0.5 : 0, px: 1, borderRadius: SEGMENTED_RADIUS, cornerShape: 'round',
              color: active ? 'primary.main' : 'text.secondary',
              bgcolor: 'transparent',
              transition: 'gap 280ms ease, color 180ms ease',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              '&:hover': { bgcolor: 'action.hover' }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
              '@media (forced-colors: active)': { bgcolor: active ? 'Highlight' : 'Canvas', color: active ? 'HighlightText' : 'CanvasText' },
            }}>{item.icon}<Typography component="span" sx={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', maxWidth: active ? 110 : 0, overflow: 'hidden', opacity: active ? 1 : 0, transition: 'max-width 280ms ease, opacity 180ms ease', '@media (prefers-reduced-motion: reduce)': { transition: 'none' }, '@media (max-width: 359.95px)': { display: 'none' } }}>{t(`mobile.${item.id}`)}</Typography></ButtonBase></Tooltip>;
        })}
      </Box>
      {!guest && <AppCreateTripButton />}
    </Box>
  </Box>;
};
export default AppBottomNavigation;
