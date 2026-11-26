'use client';

import type { ReactNode } from 'react';

import { Box, ButtonBase, Tooltip, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useLocale, useTranslations } from 'next-intl';

import {
  AppActionMenu,
  AppImageUploader,
  AppToast,
  AppAmountRatio,
  AppButton,
  AppCategoryIcon,
  AppNumberBadge,
  AppTimePicker,
  AppTimelineRow,
  type AppActionMenuItem,
} from '@/base/components/ui';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import { formatCurrency } from '@/base/utils';
import useActivityImage from '../hooks/useActivityImage';
import type { ActivityStatus, PlanActivity } from '../types';

export type ActivityTimelineData = Pick<
  PlanActivity,
  | 'title'
  | 'category'
  | 'status'
  | 'startTime'
  | 'endTime'
  | 'location'
  | 'note'
  | 'estimatedCost'
  | 'actualSpent'
> & { id?: string; tripId?: string; imageUrl?: string | null };

export interface ActivityTimelineCardProps<
  T extends ActivityTimelineData = PlanActivity,
> {
  activity: T;
  currency: string;
  onEdit?: (activity: T) => void;
  onImageSaved?: () => void;
  onDelete?: (activity: T) => void;
  onToggleStatus?: (activity: T, nextStatus: ActivityStatus) => void;
  onConvertToExpense?: (activity: T) => void;
  // Có thì nhãn giờ trên thẻ bấm được để đổi giờ ngay, không cần mở form sửa.
  onChangeTime?: (
    activity: T,
    time: { startTime: string; endTime: string },
  ) => void;
  readOnly?: boolean;
  hasNext?: boolean;
  spacingAfter?: number;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  // Số thứ tự hiện ở trục bên trái; bỏ trống thì không vẽ trục.
  order?: number;
  // Ảnh của hoạt động; chưa có thì ô ảnh hiện khung trống.
  imageUrl?: string | null;
  dragHandle?: ReactNode;
}

const ActivityTimelineCard = <T extends ActivityTimelineData>({
  activity,
  currency,
  onEdit,
  onImageSaved,
  onDelete,
  onToggleStatus,
  onConvertToExpense,
  onChangeTime,
  readOnly = false,
  hasNext = false,
  spacingAfter,
  compact = false,
  selected = false,
  onSelect,
  order,
  imageUrl,
  dragHandle,
}: ActivityTimelineCardProps<T>) => {
  const locale = useLocale();
  const t = useTranslations('plan');
  const tStatus = useTranslations('plan.statuses');
  const tDialog = useTranslations('plan.dialog');
  const tCategory = useTranslations('plan.categories');
  const photo = useActivityImage({ id: activity.id, tripId: activity.tripId,
    imageUrl: imageUrl ?? activity.imageUrl }, readOnly, onImageSaved);
  const canChangeImage = !readOnly && Boolean(activity.id && activity.tripId);
  const hasActions = !readOnly && Boolean(onToggleStatus || onConvertToExpense || onEdit || onDelete);
  const isCompleted = activity.status === 'COMPLETED';
  const menuItems: AppActionMenuItem[] = readOnly
    ? []
    : [
        ...(onToggleStatus
          ? [
              {
                id: 'toggle',
                label: isCompleted
                  ? tDialog('markPlanned')
                  : tDialog('markCompleted'),
                icon: isCompleted ? (
                  <RadioButtonUncheckedRoundedIcon fontSize="small" />
                ) : (
                  <CheckCircleRoundedIcon fontSize="small" />
                ),
                onClick: () =>
                  onToggleStatus(
                    activity,
                    isCompleted ? 'PLANNED' : 'COMPLETED',
                  ),
              },
            ]
          : []),
        ...(onConvertToExpense
          ? [
              {
                id: 'convert',
                label: tDialog('convertToExpense'),
                icon: <ReceiptLongRoundedIcon fontSize="small" />,
                onClick: () => onConvertToExpense(activity),
              },
            ]
          : []),
        ...(onEdit
          ? [
              {
                id: 'edit',
                label: tDialog('editTitle'),
                icon: <EditRoundedIcon fontSize="small" />,
                onClick: () => onEdit(activity),
              },
            ]
          : []),
        ...(onDelete
          ? [
              {
                id: 'delete',
                label: tDialog('confirmDelete'),
                icon: <DeleteOutlineRoundedIcon fontSize="small" />,
                danger: true,
                onClick: () => onDelete(activity),
              },
            ]
          : []),
      ];

  const hasAmount =
    !compact &&
    (activity.estimatedCost > 0 || Number(activity.actualSpent) > 0);
  // Thẻ hiển thị tóm tắt; hộp chi tiết hiển thị đầy đủ địa chỉ và ghi chú.
  const details = [tCategory(activity.category), activity.location, !compact ? activity.note : null].filter(Boolean).join(' · ');
  const oneLineSx = {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as const;

  return (
    <AppTimelineRow
      title={activity.title}
      icon={
        order === undefined ? undefined : (
          <AppNumberBadge
            value={order}
            tone={isCompleted ? 'success' : 'primary'}
          />
        )
      }
      railDetails={<AppCategoryIcon category={activity.category} size={20} bare />}
      status={activity.status !== 'PLANNED' && <Tooltip title={tStatus(activity.status)}><Box component="span" role="img" aria-label={tStatus(activity.status)} sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, color: isCompleted ? 'success.main' : activity.status === 'IN_PROGRESS' ? 'primary.main' : 'text.secondary', '& .MuiSvgIcon-root': { fontSize: 18 } }}>
          {isCompleted ? <CheckCircleRoundedIcon /> : activity.status === 'IN_PROGRESS' ? <AccessTimeRoundedIcon /> : <SkipNextRoundedIcon />}
        </Box></Tooltip>}
      hasNext={hasNext}
      spacingAfter={spacingAfter}
      selected={selected}
      onSelect={onSelect}
      mediaUrl={imageUrl ?? activity.imageUrl}
      media={canChangeImage ? (
        <>
          <AppImageUploader
            src={photo.src}
            file={photo.pendingFile}
            alt={activity.title}
            layout="tile"
            compact
            previewSelection={false}
            disabled={photo.busy}
            loading={photo.busy}
            showHint={false}
            onChange={(file) => void photo.changeImage(file)}
          />
          <AppToast open={photo.failed} message={t('toasts.error')}
            severity="error" onClose={photo.clearError} />
        </>
      ) : undefined}
      showMedia={!compact || Boolean(imageUrl ?? activity.imageUrl) || (!readOnly && Boolean(activity.id && activity.tripId))}
      leading={
        onChangeTime && !readOnly ? (
          <AppTimePicker
            mode="range"
            label={tDialog('timeRangeLabel')}
            value={[
              activity.startTime ? activity.startTime.slice(0, 5) : '',
              activity.endTime ? activity.endTime.slice(0, 5) : '',
            ]}
            onChange={([startTime, endTime]) =>
              onChangeTime(activity, { startTime, endTime })
            }
            renderTrigger={({ value, onOpen, open, dialogId }) => (
              <ButtonBase
                disableRipple
                onClick={onOpen}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? dialogId : undefined}
                aria-label={`${tDialog('timeRangeLabel')}: ${value || '--:--'}`}
                sx={{
                  // Keep a real 44px touch target and place the visible time at its bottom.
                  minHeight: 44, alignItems: 'flex-end',
                  alignSelf: 'flex-start', maxWidth: '100%', minWidth: 0,
                  p: 0, justifyContent: 'flex-start', borderRadius: 'var(--app-radius-small)',
                  '@media (hover: hover) and (pointer: fine)': { '&:hover [data-activity-time]': { bgcolor: 'action.hover' } },
                  '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
                }}
              >
                <Box component="span" data-activity-time sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.5, height: 24, maxWidth: '100%', minWidth: 0,
                  px: 0.75, borderRadius: 'var(--app-radius-small)',
                  boxShadow: theme => `inset 0 0 0 1px ${(theme.vars ?? theme).palette.divider}`,
                }}>
                  <Box component="span" sx={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, fontVariantNumeric: 'tabular-nums' }}>{value || '--:--'}</Box>
                  <KeyboardArrowDownRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                </Box>
              </ButtonBase>
            )}
          />
        ) : activity.startTime || activity.endTime ? (
          <Typography
            component="span"
            aria-label={
              activity.endTime
                ? `${tDialog('endTimeLabel')}: ${activity.endTime.slice(0, 5)}`
                : undefined
            }
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {[activity.startTime, activity.endTime]
              .filter(Boolean)
              .map((time) => String(time).slice(0, 5))
              .join(' – ')}
          </Typography>
        ) : undefined
      }
      actions={
        hasActions || dragHandle ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {dragHandle}
          {hasActions && (
          <AppActionMenu
            ariaLabel={t('activityActions', { title: activity.title })}
            trigger={
              <AppButton
                intent="text"
                size="small"
                aria-label={t('activityActions', { title: activity.title })}
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  py: 0,
                  px: 0,
                  color: 'text.secondary',
                }}
              >
                <MoreVertRoundedIcon sx={{ fontSize: '20px' }} />
              </AppButton>
            }
            items={menuItems}
          />
          )}
          </Box>
        ) : undefined
      }
    >
      {(details || hasAmount) && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
        {details && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0, color: 'text.secondary' }}>
          {activity.location && <PlaceRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />}
          <Typography component="span" title={details} sx={{ fontSize: 12, lineHeight: 1.5, ...oneLineSx }}>{details}</Typography>
        </Box>}
      {hasAmount && (
        <AppAmountRatio
          amount={Number(activity.actualSpent ?? 0)}
          total={activity.estimatedCost > 0 ? activity.estimatedCost : null}
          currency={currency}
          compact
          notation="standard"
          numberLocale="en-US"
          tone={
            activity.estimatedCost > 0 &&
            Number(activity.actualSpent) > activity.estimatedCost
              ? 'error'
              : activity.estimatedCost > 0 &&
                  Number(activity.actualSpent) === activity.estimatedCost
                ? 'success'
                : 'primary'
          }
          label={t('spendingRatio', {
            spent: formatCurrency(activity.actualSpent ?? 0, currency, locale),
            estimated:
              activity.estimatedCost > 0
                ? formatCurrency(activity.estimatedCost, currency, locale)
                : '—',
          })}
        />
      )}
      </Box>}
    </AppTimelineRow>
  );
};

export default ActivityTimelineCard;
