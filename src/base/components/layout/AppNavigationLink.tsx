'use client';

import Link from 'next/link';
import { ButtonBase, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { AppNavigationItem } from './navigation/config';
import { interactionTransition } from '@/base/theme/interactions';

interface AppNavigationLinkProps {
  item: AppNavigationItem;
  active: boolean;
  expanded?: boolean;
  onNavigate?: () => void;
}

const AppNavigationLink = ({
  item,
  active,
  expanded = false,
  onNavigate,
}: AppNavigationLinkProps) => {
  const t = useTranslations('navigation');
  return (
    <ButtonBase
      component={Link}
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      sx={(theme) => ({
        ...interactionTransition(theme, ['background-color', 'color']),
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: 1,
        minHeight: 44,
        px: 1.5,
        borderRadius: expanded ? 'var(--app-radius-control)' : 'var(--app-radius-pill)',
        width: expanded ? '100%' : 'auto',
        color: active ? 'primary.main' : 'text.secondary',
        bgcolor: active ? 'action.selected' : 'transparent',
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            bgcolor: active ? 'action.selected' : 'action.hover',
            color: active ? 'primary.main' : 'text.primary',
          },
        },
        '&:active': { bgcolor: 'action.selected' },
        '&.Mui-focusVisible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
        '& .MuiSvgIcon-root': { fontSize: '20px', flexShrink: 0 },
      })}
    >
      {expanded && item.icon}
      <Typography
        component="span"
        sx={{
          fontSize: '14px',
          fontWeight: active ? 700 : 500,
          whiteSpace: 'nowrap',
        }}
      >
        {t(`items.${item.id}`)}
      </Typography>
    </ButtonBase>
  );
};
export default AppNavigationLink;
