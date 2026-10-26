'use client';

import {
  Avatar,
  AvatarGroup,
  ButtonBase,
  Skeleton,
  Stack,
  useMediaQuery,
} from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import { getUserInitials } from '@/base/utils/user';

export interface AppAvatarStackItem {
  id: string | number;
  name: string;
  avatarUrl?: string | null;
}

export interface AppAvatarStackProps {
  items: readonly AppAvatarStackItem[];
  label: string;
  onClick: () => void;
  loading?: boolean;
}

const AppAvatarStack = ({
  items,
  label,
  onClick,
  loading = false,
}: AppAvatarStackProps) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const visibleCount = isMobile ? 3 : 4;

  return (
    <ButtonBase
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-haspopup="dialog"
      aria-busy={loading || undefined}
      sx={{
        minHeight: 44,
        minWidth: 44,
        px: 0.5,
        borderRadius: '999px',
        flexShrink: 0,
        '&.Mui-focusVisible': {
          outline: '2px solid',
          outlineColor: 'primary.light',
          outlineOffset: 3,
        },
      }}
    >
      {loading ? (
        <Stack direction="row" spacing={0.5} aria-hidden="true">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} variant="circular" width={32} height={32} />
          ))}
        </Stack>
      ) : items.length ? (
        <AvatarGroup
          total={items.length}
          max={visibleCount + 1}
          spacing={8}
          aria-hidden="true"
          slotProps={{
            surplus: {
              sx: { bgcolor: 'background.paper', color: 'text.primary' },
            },
          }}
          sx={{
            '& .MuiAvatar-root': {
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              border: 2,
              borderColor: 'background.paper',
              fontSize: '12px',
              fontWeight: 700,
            },
          }}
        >
          {items.slice(0, visibleCount).map((item) => (
            <Avatar
              key={item.id}
              src={item.avatarUrl ?? undefined}
              alt={item.name}
              title={item.name}
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
            >
              {getUserInitials(item.name)}
            </Avatar>
          ))}
        </AvatarGroup>
      ) : (
        <Avatar
          aria-hidden="true"
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'background.paper',
            color: 'text.primary',
          }}
        >
          <GroupRoundedIcon sx={{ fontSize: '20px' }} />
        </Avatar>
      )}
    </ButtonBase>
  );
};

export default AppAvatarStack;
