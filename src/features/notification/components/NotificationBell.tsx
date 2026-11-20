'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Badge, IconButton, Tooltip } from '@mui/material';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { useTranslations } from 'next-intl';
import { useNotifications } from '../context/NotificationContext';
import NotificationInbox from './NotificationInbox';

const NotificationBell = () => {
  const t = useTranslations('notification');
  const notifications = useNotifications();
  const pathname = usePathname();
  const [initialId, setInitialId] = useState<string | null>(null);
  const setInboxOpen = notifications?.setInboxOpen;
  useEffect(() => {
    if (!setInboxOpen) return;
    const checkLink = () => {
      const url = new URL(window.location.href);
      const id = url.searchParams.get('notificationId');
      if (id && /^[a-zA-Z0-9]{1,64}$/.test(id)) {
        setInitialId(id);
        setInboxOpen(true);
        url.searchParams.delete('notificationId');
        window.history.replaceState(
          window.history.state,
          '',
          url.pathname + url.search + url.hash,
        );
      }
    };
    checkLink();
    window.addEventListener('focus', checkLink);
    return () => window.removeEventListener('focus', checkLink);
  }, [pathname, setInboxOpen]);
  if (!notifications) return null;
  return (
    <>
      <Tooltip title={t('title')}>
        <IconButton
          color="primary"
          aria-label={t('bellLabel', { count: notifications.count })}
          onClick={() => {
            setInitialId(null);
            notifications.setInboxOpen(true);
            void notifications.refresh();
          }}
          sx={{ width: 44, height: 44, flexShrink: 0 }}
        >
          <Badge badgeContent={notifications.count} max={9} color="primary">
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      {notifications.inboxOpen && (
        <NotificationInbox
          initialId={initialId}
          onClose={() => {
            notifications.setInboxOpen(false);
            setInitialId(null);
          }}
        />
      )}
    </>
  );
};
export default NotificationBell;
