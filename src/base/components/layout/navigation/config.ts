import type { ReactNode } from 'react';
import { DEFAULT_SIDEBAR_MENU } from '../sidebar/config';

export const DESKTOP_NAV_BREAKPOINT = 1440;

const NAVIGATION_IDS = [
  'overview',
  'trips',
  'plan',
  'expenses',
  'settlement',
  'ai',
] as const;
const PRIMARY_IDS = ['overview', 'trips', 'plan', 'expenses'] as const;
type NavigationId = (typeof NAVIGATION_IDS)[number];
type PrimaryNavigationId = (typeof PRIMARY_IDS)[number];

export interface AppNavigationItem {
  id: NavigationId;
  href: string;
  icon: ReactNode;
}

export const APP_NAVIGATION_ITEMS: AppNavigationItem[] =
  DEFAULT_SIDEBAR_MENU.flatMap((item) => {
    const id = NAVIGATION_IDS.find((id) => id === item.id);
    return id ? [{ id, href: item.href, icon: item.icon }] : [];
  });
export const PRIMARY_NAVIGATION_ITEMS = APP_NAVIGATION_ITEMS.filter(
  (item): item is AppNavigationItem & { id: PrimaryNavigationId } =>
    PRIMARY_IDS.some((id) => id === item.id),
);
export const MORE_NAVIGATION_ITEMS = APP_NAVIGATION_ITEMS.filter(
  (item) => !PRIMARY_IDS.some((id) => id === item.id),
);
