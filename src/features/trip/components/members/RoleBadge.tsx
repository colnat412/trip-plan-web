'use client';

import { Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { TripMemberRole } from '../../types/member.types';

interface RoleBadgeProps {
  role: TripMemberRole;
}

const ROLE_COLORS = { OWNER: 'warning', VICE: 'secondary', MEMBER: 'success' } as const;

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const t = useTranslations('members.roles');
  const color = ROLE_COLORS[role];

  return (
    <Chip
      size="small"
      label={t(role)}
      sx={(theme) => {
        const palette = theme.vars?.palette ?? theme.palette;
        return {
          height: 20,
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '11px',
          flexShrink: 0,
          color: palette[color].dark,
          bgcolor: `color-mix(in srgb, ${palette[color].main} 12%, transparent)`,
          ...theme.applyStyles('dark', { color: palette[color].light }),
          '& .MuiChip-label': { px: 0.75 },
        };
      }}
    />
  );
};

export default RoleBadge;
