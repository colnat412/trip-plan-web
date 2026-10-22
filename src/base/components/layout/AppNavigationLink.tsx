'use client';

import Link from 'next/link';
import { ButtonBase, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { AppNavigationItem } from './navigation/config';

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
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: 1,
        minHeight: 44,
        px: 1.5,
        borderRadius: '12px',
        width: expanded ? '100%' : 'auto',
        color: active ? 'primary.main' : 'text.secondary',
        bgcolor: active ? 'action.selected' : 'transparent',
        '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
        '&.Mui-focusVisible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
        '& .MuiSvgIcon-root': { fontSize: '20px', flexShrink: 0 },
      }}
    >
      {expanded && item.icon}
      <Typography
        component="span"
        sx={{
          fontSize: '13px',
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
