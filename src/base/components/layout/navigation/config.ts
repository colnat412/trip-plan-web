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
type NavigationId = (typeof NAVIGATION_IDS)[number];

const MAX_MOBILE_NAVIGATION_ACTIONS = 5;

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

const directNavigationCount =
  APP_NAVIGATION_ITEMS.length <= MAX_MOBILE_NAVIGATION_ACTIONS
    ? APP_NAVIGATION_ITEMS.length
    : MAX_MOBILE_NAVIGATION_ACTIONS - 1;

export const PRIMARY_NAVIGATION_ITEMS = APP_NAVIGATION_ITEMS.slice(
  0,
  directNavigationCount,
);
export const MORE_NAVIGATION_ITEMS = APP_NAVIGATION_ITEMS.slice(
  directNavigationCount,
);
