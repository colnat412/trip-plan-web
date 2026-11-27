'use client';

import { Avatar } from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useOptionalUserContext } from '@/features/user/context/UserContext';
import { getUserInitials } from '@/base/utils';

interface AppProfileNavigationAvatarProps { active?: boolean }

export default function AppProfileNavigationAvatar({ active = false }: AppProfileNavigationAvatarProps) {
  const user = useOptionalUserContext()?.user;
  return <Avatar src={user?.avatarUrl || undefined} alt="" aria-hidden="true" sx={{
    width: 26, height: 26, flexShrink: 0, fontSize: 11, fontWeight: 700,
    bgcolor: 'action.selected', color: 'text.secondary',
    border: '2px solid', borderColor: active ? 'primary.main' : 'divider',
    '& img': { objectFit: 'cover' },
  }}>{user ? getUserInitials(user.name || user.email) : <PersonOutlineRoundedIcon fontSize="small" />}</Avatar>;
}
