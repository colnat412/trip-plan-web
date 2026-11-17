'use client';

import type { SxProps, Theme } from '@mui/material';
import AppSegmentedControl from './AppSegmentedControl';

interface RouteTab {
  id: string;
  href: string;
  label: string;
}

export interface AppRouteTabsProps {
  items: readonly RouteTab[];
  active: string;
  label: string;
  /** Kept for compatibility; all route tabs now share the capsule shape. */
  pill?: boolean;
  buttonSx?: SxProps<Theme>;
}

export default function AppRouteTabs({ items, active, label, buttonSx }: AppRouteTabsProps) {
  return <AppSegmentedControl value={active} label={label} buttonSx={buttonSx}
    options={items.map(item => ({ value: item.id, href: item.href, label: item.label }))} />;
}
