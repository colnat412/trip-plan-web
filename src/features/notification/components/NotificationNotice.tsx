'use client';

import { Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import AppEmptyState from '@/base/components/ui/AppEmptyState';
import AppMascot from '@/base/components/ui/AppMascot';
import { formatNotificationSubject } from '../lib/notification-subject';
import NotificationInvitationActions from './NotificationInvitationActions';
import type { NotificationItem } from '../types';

interface NotificationNoticeProps {
  item: NotificationItem;
  disabled?: boolean;
  onInvitationResponse?: (id: string, accept: boolean) => void;
}
const NotificationNotice = ({ item, disabled = false, onInvitationResponse }: NotificationNoticeProps) => {
  const t = useTranslations('notification');
  const locale = useLocale();
  if (item.invitationStatus) {
    return <AppEmptyState
      illustration={<AppMascot mood={item.invitationStatus === 'ACCEPTED' ? 'success' : 'thinking'} size={96} />}
      title={t(`invitation.${item.invitationStatus}.title`)}
      description={t(`invitation.${item.invitationStatus}.description`, { trip: item.tripName || t('tripFallback') })}
      action={item.invitationStatus === 'PENDING' ? <NotificationInvitationActions item={item} disabled={disabled} onRespond={onInvitationResponse} /> : undefined}
    />;
  }
  if (item.accessStatus && item.accessStatus !== 'AVAILABLE') {
    return <AppEmptyState
      illustration={<AppMascot mood="warning" size={96} />}
      title={t(`access.${item.accessStatus}.title`)}
      description={t(`access.${item.accessStatus}.description`, { name: item.tripName || t('tripFallback') })}
    />;
  }
  const subject = formatNotificationSubject(item, locale, role => t(`roles.${role}`));
  return <Stack spacing={1}>
    <Typography>{t(`types.${item.type}`)}</Typography>
    {item.tripName && <Typography color="text.secondary">{item.tripName}</Typography>}
    {subject && <Typography>{subject}</Typography>}
  </Stack>;
};
export default NotificationNotice;
