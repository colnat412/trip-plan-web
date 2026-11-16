'use client';

import Link from 'next/link';
import { Box, type SxProps, type Theme } from '@mui/material';
import AppButton from './AppButton';
import { brandSurface } from '@/base/theme/surfaces';

interface RouteTab {
  id: string;
  href: string;
  label: string;
}

export interface AppRouteTabsProps {
  items: readonly RouteTab[];
  active: string;
  label: string;
  pill?: boolean;
  buttonSx?: SxProps<Theme>;
}

/** Route links keep native navigation; one decorative surface slides underneath. */
export default function AppRouteTabs({ items, active, label, pill = false, buttonSx }: AppRouteTabsProps) {
  const activeIndex = items.findIndex((item) => item.id === active);
  const padding = pill ? 6 : 4;
  const gap = pill ? 8 : 4;
  const radius = pill ? 'var(--app-radius-pill)' : 'var(--app-radius-small)';

  return (
    <Box component="nav" aria-label={label} sx={{
      position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
      width: '100%', minWidth: 0, gap: `${gap}px`, p: `${padding}px`,
      bgcolor: pill ? 'background.paper' : 'action.hover',
      borderRadius: pill ? 'var(--app-radius-pill)' : 'var(--app-radius-control)',
    }}>
      {activeIndex >= 0 && (
        <Box aria-hidden="true" sx={(theme) => ({
          ...brandSurface(theme),
          position: 'absolute', pointerEvents: 'none', top: padding, bottom: padding, left: padding,
          width: `calc((100% - ${padding * 2 + gap * (items.length - 1)}px) / ${items.length})`,
          borderRadius: radius,
          transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * gap}px))`,
          transition: 'transform 220ms cubic-bezier(0.2, 0, 0, 1)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          '@media (forced-colors: active)': { bgcolor: 'Highlight', border: '1px solid Highlight' },
        })} />
      )}
      {items.map((item) => {
        const selected = active === item.id;
        return (
          <AppButton key={item.id} component={Link} href={item.href} scroll={false}
            intent="text" aria-current={selected ? 'page' : undefined} wrapLabel
            sx={[
              (theme) => ({
                position: 'relative', minWidth: 0, minHeight: 44, borderRadius: radius,
                color: selected ? (theme.vars?.palette ?? theme.palette).primary.contrastText : 'text.secondary',
                bgcolor: 'transparent',
                '&:hover, &:active': { bgcolor: 'transparent', color: selected ? (theme.vars?.palette ?? theme.palette).primary.contrastText : 'text.primary' },
                '@media (forced-colors: active)': { color: selected ? 'HighlightText' : 'LinkText' },
              }),
              ...(Array.isArray(buttonSx) ? buttonSx : buttonSx ? [buttonSx] : []),
            ]}
          >{item.label}</AppButton>
        );
      })}
    </Box>
  );
}
