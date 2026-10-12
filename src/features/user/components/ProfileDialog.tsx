'use client';

import { useState } from 'react';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useTranslations } from 'next-intl';
import { AppDialog, AppToast } from '@/base/components/ui';
import ProfileForm from './ProfileForm';
import type { SidebarUser } from '@/base/components/layout/sidebar/types';
import type { UserProfile } from '@/features/auth/types';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user?: Partial<SidebarUser> | UserProfile;
}
const ProfileDialog = ({ open, onClose, user }: ProfileDialogProps) => {
  const t = useTranslations('profile');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        closeDisabled={busy}
        closeLabel={t('close')}
        title={t('title')}
        description={t('description')}
        icon={<PersonOutlineRoundedIcon />}
      >
        {open && (
          <ProfileForm
            onClose={onClose}
            user={user}
            onBusyChange={setBusy}
            onSaved={() => {
              setSaved(true);
              onClose();
            }}
          />
        )}
      </AppDialog>
      <AppToast
        open={saved}
        severity="success"
        message={t('avatarSaved')}
        onClose={() => setSaved(false)}
      />
    </>
  );
};
export default ProfileDialog;
