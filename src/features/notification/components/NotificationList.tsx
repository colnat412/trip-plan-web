'use client';

import { useId } from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import AppCard from '@/base/components/ui/AppCard';
import useCurrentTime from '@/base/hooks/use-current-time';
import { formatDate } from '@/base/utils/date';
import { groupNotificationsByDate, type NotificationDateGroup } from '../lib/notification-date-groups';
import type { NotificationItem } from '../types';
import NotificationListItem from './NotificationListItem';

interface NotificationListProps {
  items: NotificationItem[];
  disabled: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onInvitationResponse?: (id: string, accept: boolean) => void;
}

const NotificationList = ({ items, disabled, onOpen, onDelete, onInvitationResponse }: NotificationListProps) => {
  const t = useTranslations('notification');
  const now = useCurrentTime();
  const listId = useId();
  const groups = groupNotificationsByDate(items, now);
  const getGroupTitle = (group: NotificationDateGroup) => {
    if (group.daysAgo === 0) return t('dateGroups.today');
    if (group.daysAgo === 1) return t('dateGroups.yesterday');
    if (group.daysAgo === 2) return t('dateGroups.twoDaysAgo');
    if (group.dateKey === 'unknown') return t('dateGroups.unknown');
    return formatDate(group.dateKey, 'DD/MM/YYYY');
  };

  return <Stack spacing={1.5}>
    {groups.map(group => {
      const headingId = `${listId}-${group.dateKey}`;
      return <Stack component="section" aria-labelledby={headingId} key={group.dateKey} spacing={0.75}>
        <Typography id={headingId} component="h3" sx={{ px: 0.5, fontSize: 11, fontWeight: 600, color: 'text.secondary', letterSpacing: 0.6 }}>
          {getGroupTitle(group)}
        </Typography>
        <AppCard variant="outlined" contentSx={{ p: 0 }} sx={{ p: 0, boxShadow: 'none', border: 0 }}>
          <Stack divider={<Divider sx={{ mx: 1.25 }} />}>
            {group.items.map(item => <NotificationListItem key={item.id} item={item} now={now} disabled={disabled} onOpen={onOpen} onDelete={onDelete} onInvitationResponse={onInvitationResponse} />)}
          </Stack>
        </AppCard>
      </Stack>;
    })}
  </Stack>;
};
export default NotificationList;
