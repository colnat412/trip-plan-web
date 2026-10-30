'use client';

import { Alert, Badge, Box, ButtonBase, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { useFormatter, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AppButton, AppDialog, AppEmptyState } from '@/base/components/ui';
import { useAppToast } from '@/base/providers/AppToastProvider';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useNotifications } from '../context/NotificationContext';
import type { NotificationItem } from '../types';

function NotificationBellContent({ inbox }: { inbox: NonNullable<ReturnType<typeof useNotifications>> }) {
  const t = useTranslations('notifications');
  const format = useFormatter();
  const router = useRouter();
  const notify = useAppToast();
  const { selectTrip, openMembers, refetchTrips } = useTripContext();
  const snapshot = inbox.snapshot;
  const openTarget = async (item: NotificationItem) => {
    try {
      const response = await inbox.target(item.id);
      await inbox.read(item.id);
      if (!response.data.available || !response.data.path) {
        notify(t(response.data.status === 'INVITED' ? 'waitingApproval' : 'unavailable'), 'info');
        return;
      }
      selectTrip(item.tripId);
      void refetchTrips().catch(() => undefined);
      inbox.close();
      if (item.type === 'TRIP_MEMBER_APPROVAL_REQUIRED') openMembers();
      else router.push(response.data.path);
    } catch { /* Hook error is displayed in the inbox. */ }
  };
  return <>
    <IconButton onClick={inbox.show} aria-label={t('open', { count: inbox.unreadCount })}
      sx={{ minWidth: 44, minHeight: 44, flexShrink: 0 }}>
      <Badge badgeContent={inbox.unreadCount} color="primary" max={99}>
        <NotificationsNoneRoundedIcon />
      </Badge>
    </IconButton>
    <AppDialog open={inbox.open} onClose={inbox.close} title={t('title')} maxWidth="sm">
      <Stack spacing={2}>
        {inbox.error && <Alert severity="error" action={<AppButton intent="text" onClick={inbox.retry}>{t('retry')}</AppButton>}>
          {t('loadError')}
        </Alert>}
        {(!!snapshot?.listing.items.length || inbox.unreadCount > 0) && <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">{t('unread', { count: inbox.unreadCount })}</Typography>
          <AppButton intent="text" size="small" disabled={inbox.pending || !inbox.unreadCount}
            onClick={() => void inbox.read(null).catch(() => undefined)}>{t('readAll')}</AppButton>
        </Stack>}
        {inbox.loading && <Box role="status" sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} aria-label={t('loading')} />
        </Box>}
        {!inbox.loading && !inbox.error && snapshot && !snapshot.listing.items.length && (
          <AppEmptyState title={t('empty')} icon={<NotificationsNoneRoundedIcon />} />
        )}
        <Stack spacing={1}>
          {snapshot?.listing.items.map(item => <Stack key={item.id} spacing={0.5}
            sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: item.readAt ? 'transparent' : 'action.hover' }}>
            <ButtonBase onClick={() => void openTarget(item)} disabled={inbox.pending}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0.75,
                textAlign: 'start', borderRadius: 1, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
              <Typography variant="body2" sx={{ fontWeight: item.readAt ? 400 : 600, overflowWrap: 'anywhere' }}>
                {t(`types.${item.type}`, { actor: item.actorName || t('someone'), trip: item.tripName || t('trip') })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format.dateTime(new Date(item.createdAt), { dateStyle: 'medium', timeStyle: 'short' })}
              </Typography>
            </ButtonBase>
            {!item.readAt && <AppButton intent="text" size="small" sx={{ alignSelf: 'flex-start', minHeight: 44 }}
              disabled={inbox.pending} onClick={() => void inbox.read(item.id).catch(() => undefined)}>{t('markRead')}</AppButton>}
          </Stack>)}
        </Stack>
        {!!snapshot?.listing.pagination.totalPages && <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <AppButton intent="text" disabled={!inbox.page || inbox.loading} onClick={() => inbox.setPage(inbox.page - 1)}>{t('previous')}</AppButton>
          <Typography variant="body2">{inbox.page + 1} / {snapshot.listing.pagination.totalPages}</Typography>
          <AppButton intent="text" disabled={!snapshot.listing.pagination.hasNext || inbox.loading} onClick={() => inbox.setPage(inbox.page + 1)}>{t('next')}</AppButton>
        </Stack>}
      </Stack>
    </AppDialog>
  </>;
}
export default function NotificationBell() {
  const inbox = useNotifications();
  return inbox ? <NotificationBellContent inbox={inbox} /> : null;
}
