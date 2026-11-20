'use client';

import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { useLocale, useTranslations } from 'next-intl';
import { formatNotificationSubject } from '../lib/notification-subject';
import { getNotificationRelativeTime } from '../lib/notification-date-groups';
import type { NotificationItem, NotificationType } from '../types';
import useNotificationSwipe, { NOTIFICATION_SWIPE_WIDTH } from '../hooks/useNotificationSwipe';
import NotificationInvitationActions from './NotificationInvitationActions';
import { interactionTransition } from '@/base/theme/interactions';

// Static references reuse icons already used by the matching feature screens.
const NOTIFICATION_ICONS: Record<NotificationType, typeof GroupRoundedIcon> = {
  MEMBER_INVITED: GroupRoundedIcon,
  MEMBER_INVITATION_ACCEPTED: GroupRoundedIcon,
  MEMBER_INVITATION_DECLINED: GroupRoundedIcon,
  MEMBER_INVITATION_CANCELLED: GroupRoundedIcon,
  MEMBER_ADDED: GroupRoundedIcon,
  MEMBER_APPROVAL_REQUIRED: GroupRoundedIcon,
  MEMBER_PENDING: GroupRoundedIcon,
  MEMBER_APPROVED: GroupRoundedIcon,
  MEMBER_ROLE_CHANGED: GroupRoundedIcon,
  MEMBER_REMOVED: GroupRoundedIcon,
  MEMBER_LEFT: GroupRoundedIcon,
  EXPENSE_CREATED: ReceiptLongRoundedIcon,
  EXPENSE_UPDATED: ReceiptLongRoundedIcon,
  EXPENSE_DELETED: ReceiptLongRoundedIcon,
  SETTLEMENT_RECORDED: HandshakeRoundedIcon,
  SETTLEMENT_DELETED: HandshakeRoundedIcon,
  ACTIVITY_REMINDER: AccessTimeRoundedIcon,
  TRIP_REMINDER: EventAvailableRoundedIcon,
  TRIP_CANCELLED: EventAvailableRoundedIcon,
};

interface NotificationListItemProps {
  item: NotificationItem;
  disabled: boolean;
  now?: Date | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onInvitationResponse?: (id: string, accept: boolean) => void;
}

const NotificationListItem = ({ item, disabled, now = null, onOpen, onDelete, onInvitationResponse }: NotificationListItemProps) => {
  const swipe = useNotificationSwipe(disabled);
  const t = useTranslations('notification');
  const locale = useLocale();
  const title = t(`types.${item.type}`);
  const subject = formatNotificationSubject(item, locale, role => t(`roles.${role}`));
  const detail = !subject ? '' : item.type === 'MEMBER_ROLE_CHANGED'
    ? t('roleChangeDetail', { role: subject })
    : item.type.startsWith('SETTLEMENT_') ? ` ${subject}` : ` “${subject}”`;
  const summary = t(`sentences.${item.type}`, { trip: item.tripName || t('tripFallback'), detail });
  const time = getNotificationRelativeTime(item.createdAt, now, locale, t('justNow'));
  const Icon = NOTIFICATION_ICONS[item.type];
  const unread = !item.readAt;

  const deleteItem = () => {
    swipe.close();
    onDelete(item.id);
  };

  return <Box sx={{ display: 'grid', minWidth: 0, overflow: 'hidden' }}>
    <Stack sx={theme => ({
      gridArea: '1 / 1', zIndex: 1, minWidth: 0,
      bgcolor: 'background.paper', transform: `translateX(${swipe.offset}px)`,
      ...interactionTransition(theme, ['transform']),
      ...(swipe.isDragging && { transition: 'none' }),
    })}>
      <ButtonBase {...swipe.handlers} disabled={disabled} onClick={() => onOpen(item.id)} sx={{
        flex: 1, minWidth: 0, minHeight: 56, px: 1.25, py: 1, gap: 1,
        touchAction: 'pan-y pinch-zoom', userSelect: 'none',
        textAlign: 'left', justifyContent: 'flex-start', alignItems: 'center',
        '&:hover': { bgcolor: 'action.hover' },
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
      }}>
        <Box aria-hidden="true" sx={theme => {
          const palette = theme.vars?.palette ?? theme.palette;
          return {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, flexShrink: 0, borderRadius: '50%',
            color: 'primary.main', bgcolor: 'action.hover',
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} ${unread ? 12 : 6}%, transparent)`,
          };
        }}><Icon sx={{ fontSize: 18 }} /></Box>
        <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
            <Typography title={summary} sx={{
              flex: 1, minWidth: 0, fontSize: 13, lineHeight: 1.45,
              fontWeight: unread ? 600 : 400,
              whiteSpace: 'normal', overflowWrap: 'anywhere',
            }}>{summary}</Typography>
            {unread && <Box aria-hidden="true" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />}
          </Stack>
          {time && <Typography component="time" dateTime={item.createdAt}
            sx={{ fontSize: 11, color: 'text.secondary' }}>{time}</Typography>}
        </Stack>
      </ButtonBase>
      {item.invitationStatus === 'PENDING' && <Box sx={{ px: 1.25 }}>
        <NotificationInvitationActions item={item} disabled={disabled} onRespond={onInvitationResponse} />
      </Box>}
    </Stack>
    <ButtonBase disabled={disabled || !swipe.isRevealed} tabIndex={swipe.isRevealed ? 0 : -1}
      aria-hidden={!swipe.isRevealed} aria-label={t('deleteLabel', { title })} onClick={deleteItem}
      sx={theme => ({ gridArea: '1 / 1', zIndex: 0, justifySelf: 'end', width: NOTIFICATION_SWIPE_WIDTH,
        minHeight: 44, bgcolor: 'error.main', color: 'error.contrastText',
        visibility: swipe.offset < 0 ? 'visible' : 'hidden',
        // Paint red only in the exposed area, including during snap animations.
        clipPath: `inset(0 0 0 ${Math.max(0, NOTIFICATION_SWIPE_WIDTH + swipe.offset)}px)`,
        ...interactionTransition(theme, ['clip-path']),
        ...(swipe.isDragging && { transition: 'none' }),
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -3 },
      })}>
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{t('deleteAction')}</Typography>
    </ButtonBase>
  </Box>;
};
export default NotificationListItem;
