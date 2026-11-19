'use client';

import { Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import AppButton from '@/base/components/ui/AppButton';
import { compactTouchTarget } from '@/base/theme/interactions';
import type { NotificationItem } from '../types';

interface NotificationInvitationActionsProps {
  item: NotificationItem;
  disabled: boolean;
  onRespond?: (id: string, accept: boolean) => void;
}

const NotificationInvitationActions = ({ item, disabled, onRespond }: NotificationInvitationActionsProps) => {
  const t = useTranslations('notification');
  if (item.invitationStatus !== 'PENDING' || !onRespond) return null;
  return <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', py: 1 }}>
    <AppButton intent="primary" size="small" disabled={disabled} sx={{ ...compactTouchTarget, minHeight: 28, height: 28, px: 1.25, fontSize: 11 }} onClick={() => onRespond(item.id, true)}>
      {t('invitation.accept')}
    </AppButton>
    <AppButton intent="text" size="small" disabled={disabled} sx={{ ...compactTouchTarget, minHeight: 28, height: 28, px: 1.25, fontSize: 11 }} onClick={() => onRespond(item.id, false)}>
      {t('invitation.decline')}
    </AppButton>
  </Stack>;
};
export default NotificationInvitationActions;
