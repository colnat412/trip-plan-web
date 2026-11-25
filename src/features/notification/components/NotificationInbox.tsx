'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import { useTranslations } from 'next-intl';
import { flushSync } from 'react-dom';
import { waitForMobileOverlayHistory } from '@/base/hooks/use-mobile-overlay-back';
import { useRouter } from 'next/navigation';
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  type ApiResponse,
} from '@/base/api';
import {
  AppButton,
  AppDialog,
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
} from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useNotifications } from '../context/NotificationContext';
import useNotificationInbox from '../hooks/useNotificationInbox';
import type { NotificationItem } from '../types';
import NotificationNotice from './NotificationNotice';
import NotificationList from './NotificationList';
import AppSegmentedControl from '@/base/components/ui/AppSegmentedControl';
import { getNotificationDestination } from '../lib/notification-navigation';

const NotificationInbox = ({
  onClose,
  initialId,
}: {
  onClose: () => void;
  initialId: string | null;
}) => {
  const notifications = useNotifications()!;
  const t = useTranslations('notification');
  const router = useRouter();
  const { selectTrip, refetchTrips } = useTripContext();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [pending, setPending] = useState(false);
  const [readingAll, setReadingAll] = useState(false);
  const [actionError, setActionError] = useState<
    'openError' | 'deleteError' | 'invitationError' | null
  >(null);
  const [notice, setNotice] = useState<NotificationItem | null>(null);
  const busy = useRef(false);
  const actionController = useRef(new AbortController());
  useEffect(() => {
    const controller = new AbortController();
    actionController.current = controller;
    return () => controller.abort();
  }, []);
  const page = useNotificationInbox(
    notifications.accountKey,
    unreadOnly,
    notifications.version,
  );
  const open = useCallback(
    async (id: string) => {
      if (busy.current) return;
      busy.current = true;
      setPending(true);
      setActionError(null);
      const signal = actionController.current.signal;
      try {
        const { data: item } = await axiosGet<ApiResponse<NotificationItem>>(
          `/notifications/${encodeURIComponent(id)}`,
          { signal },
        );
        const unavailable =
          item.accessStatus && item.accessStatus !== 'AVAILABLE';
        if (unavailable || !item.tripId) {
          setNotice(item);
          await axiosPatch(
            `/notifications/${encodeURIComponent(id)}/read`,
            {},
            { signal },
          );
          await notifications.refresh();
          return;
        }
        const destination = getNotificationDestination(item, crypto.randomUUID());
        await axiosPatch(
          `/notifications/${encodeURIComponent(id)}/read`,
          {},
          { signal },
        );
        if (signal.aborted) return;
        selectTrip(item.tripId);
        // Finish closing the mobile sheet's Back entry before changing routes.
        flushSync(() => onClose());
        await waitForMobileOverlayHistory();
        router.push(destination);
        void refetchTrips().catch(() => undefined);
        void notifications.refresh().catch(() => undefined);
      } catch {
        if (!signal.aborted) setActionError('openError');
      } finally {
        busy.current = false;
        if (!signal.aborted) setPending(false);
      }
    },
    [notifications, onClose, refetchTrips, router, selectTrip],
  );
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  });
  useEffect(() => {
    if (!initialId) return;
    const timer = window.setTimeout(() => void openRef.current(initialId), 0);
    return () => clearTimeout(timer);
  }, [initialId]);
  const readAll = async () => {
    if (!page.through || notifications.count === 0 || busy.current) return;
    busy.current = true;
    setPending(true);
    setReadingAll(true);
    setActionError(null);
    const signal = actionController.current.signal;
    try {
      await axiosPost(
        '/notifications/read-all',
        { through: page.through },
        { signal },
      );
      await notifications.refresh();
    } catch {
      if (!signal.aborted) setActionError('openError');
    } finally {
      busy.current = false;
      if (!signal.aborted) {
        setPending(false);
        setReadingAll(false);
      }
    }
  };
  const deleteNotification = async (id: string) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setActionError(null);
    const signal = actionController.current.signal;
    try {
      await axiosDelete(`/notifications/${encodeURIComponent(id)}`, undefined, {
        signal,
      });
      // Refresh from the server so unread count and the current filter stay consistent.
      await notifications.refresh();
    } catch {
      if (!signal.aborted) setActionError('deleteError');
    } finally {
      busy.current = false;
      if (!signal.aborted) setPending(false);
    }
  };
  const respondToInvitation = async (id: string, accept: boolean) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setActionError(null);
    const signal = actionController.current.signal;
    try {
      const result = await axiosPost<ApiResponse<NotificationItem>>(
        `/notifications/${encodeURIComponent(id)}/invitation-response`,
        { accept },
        { signal },
      );
      if (signal.aborted) return;
      page.updateItem(result.data);
      setNotice((previous) => (previous?.id === id ? result.data : previous));
      await Promise.all([notifications.refresh(), refetchTrips()]);
    } catch {
      if (!signal.aborted) {
        setActionError('invitationError');
        void page.reload();
        try {
          const latest = await axiosGet<ApiResponse<NotificationItem>>(
            `/notifications/${encodeURIComponent(id)}`,
            { signal },
          );
          if (!signal.aborted) {
            page.updateItem(latest.data);
            setNotice((previous) =>
              previous?.id === id ? latest.data : previous,
            );
          }
        } catch {
          /* Keep the error and let the user retry if the connection failed. */
        }
      }
    } finally {
      busy.current = false;
      if (!signal.aborted) setPending(false);
    }
  };
  return (
    <>
      <AppDialog
        open
        onClose={onClose}
        title={t('title')}
        titleAlign="left"
        mobilePresentation="screen"
        contentScroll="children"
        paperSx={{
          // Child-owned scrolling needs a definite desktop height; mobile uses the full screen.
          height: { sm: 'min(640px, var(--app-dialog-max-height))' },
          '& .MuiDialogTitle-root h2': { fontSize: 15 },
        }}
        headerActions={
          <Tooltip title={t('readAll')}>
            <Box component="span" sx={{ display: 'inline-flex' }}>
              <IconButton
                color="primary"
                aria-label={t('readAll')}
                aria-busy={readingAll || undefined}
                disabled={
                  pending ||
                  notifications.count === 0 ||
                  !page.through ||
                  page.items.length === 0
                }
                onClick={() => void readAll()}
                sx={{ width: 44, height: 44 }}
              >
                <ChecklistRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Tooltip>
        }
      >
        <Stack
          spacing={1.5}
          aria-busy={pending || undefined}
          sx={{ flex: 1, minHeight: 0 }}
        >
          <AppSegmentedControl
            value={unreadOnly ? 'unread' : 'all'}
            label={t('title')}
            disabled={pending}
            options={[
              { value: 'all', label: t('all') },
              { value: 'unread', label: t('unread') },
            ]}
            onChange={(value) => setUnreadOnly(value === 'unread')}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              gap: 1.5,
            }}
          >
            {actionError && (
              <Typography role="alert" color="error">
                {t(actionError)}
              </Typography>
            )}
            {page.error ? (
              <AppErrorState compact onRetry={() => page.reload()} />
            ) : null}
            {page.loading && !page.items.length ? (
              <AppLoadingState local sx={{ minHeight: 200 }} />
            ) : null}
            {!page.loading && !page.error && !page.items.length && (
              <AppEmptyState title={t('empty')} />
            )}
            <NotificationList
              items={page.items}
              disabled={pending}
              onOpen={(id) => void open(id)}
              onDelete={(id) => void deleteNotification(id)}
              onInvitationResponse={(id, accept) =>
                void respondToInvitation(id, accept)
              }
            />
            {page.nextCursor && (
              <AppButton
                intent="text"
                fullWidth
                disabled={page.loading || pending}
                onClick={() => {
                  if (page.nextCursor) void page.reload(page.nextCursor);
                }}
              >
                {t(page.loading ? 'loadingPrevious' : 'loadPrevious')}
              </AppButton>
            )}
          </Box>
        </Stack>
      </AppDialog>
      <AppDialog
        open={Boolean(notice)}
        onClose={() => setNotice(null)}
        title={t('title')}
      >
        {actionError === 'invitationError' && (
          <Typography role="alert" color="error">
            {t(actionError)}
          </Typography>
        )}
        {notice && (
          <NotificationNotice
            item={notice}
            disabled={pending}
            onInvitationResponse={(id, accept) =>
              void respondToInvitation(id, accept)
            }
          />
        )}
      </AppDialog>
    </>
  );
};
export default NotificationInbox;
