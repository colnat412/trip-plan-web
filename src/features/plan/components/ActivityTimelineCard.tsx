'use client';

import { useRef } from 'react';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';
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
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  // Số thứ tự hiện ở trục bên trái; bỏ trống thì không vẽ trục.
  order?: number;
  // Ảnh của hoạt động; chưa có thì ô ảnh hiện khung trống.
  imageUrl?: string | null;
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
  compact = false,
  selected = false,
  onSelect,
  order,
  imageUrl,
}: ActivityTimelineCardProps<T>) => {
  const locale = useLocale();
  const t = useTranslations('plan');
  const tStatus = useTranslations('plan.statuses');
  const tDialog = useTranslations('plan.dialog');
  const tCategory = useTranslations('expense.categories');
  const tImage = useTranslations('imageUpload');
  const imageInput = useRef<HTMLInputElement>(null);
  const photo = useActivityImage({ id: activity.id, tripId: activity.tripId,
    imageUrl: imageUrl ?? activity.imageUrl }, readOnly, onImageSaved);
  const canChangeImage = !readOnly && Boolean(activity.id && activity.tripId);
  const hasActions = !readOnly && (canChangeImage || Boolean(onToggleStatus || onConvertToExpense || onEdit || onDelete));
  const isCompleted = activity.status === 'COMPLETED';
  const menuItems: AppActionMenuItem[] = readOnly
    ? []
    : [
        ...(canChangeImage ? [
          {
            id: 'change-image',
            label: tImage(photo.src ? 'change' : 'choose'),
            icon: <AddPhotoAlternateOutlinedIcon fontSize="small" />,
            disabled: photo.busy,
            onClick: () => { imageInput.current?.click(); },
          },
        ] : []),
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
  // Địa chỉ và ghi chú chỉ một dòng, đủ chữ xem nhanh; đầy đủ nằm trong hộp thoại sửa.
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
      hasNext={hasNext}
      selected={selected}
      onSelect={onSelect}
      mediaUrl={imageUrl ?? activity.imageUrl}
      media={canChangeImage ? (
        <>
          <AppImageUploader
            inputRef={imageInput}
            src={photo.src}
            file={photo.pendingFile}
            alt={activity.title}
            layout="tile"
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
                onClick={onOpen}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? dialogId : undefined}
                aria-label={`${tDialog('timeRangeLabel')}: ${value || '--:--'}`}
                sx={{
                  alignSelf: 'flex-start',
                  maxWidth: '100%',
                  minWidth: '116px',
                  justifyContent: 'space-between',
                  gap: 0.75,
                  pl: 1.25,
                  pr: 0.75,
                  py: 0.5,
                  alignItems: 'center',
                  // Viền vẽ bằng bóng trong để mọi cạnh luôn cùng một màu, không có vạch lệch.
                  border: 0,
                  boxShadow: (theme) =>
                    `inset 0 0 0 1px ${(theme.vars ?? theme).palette.divider}`,
                  borderRadius: '8px',
                  fontVariantNumeric: 'tabular-nums',
                  // Hover chỉ cho thiết bị có chuột để không bị "dính" sau khi chạm.
                  '@media (hover: hover)': {
                    '&:hover': { bgcolor: 'action.hover' },
                  },
                  // Viền nổi bật chỉ khi điều hướng bằng bàn phím, không giữ lại sau khi bấm.
                  '&.Mui-focusVisible': { outline: 'none' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                  },
                  '&:focus:not(:focus-visible)': { outline: 'none' },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {value || '--:--'}
                </Box>
                <KeyboardArrowDownRoundedIcon
                  sx={{ fontSize: '16px', flexShrink: 0 }}
                />
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
        hasActions ? (
          <AppActionMenu
            ariaLabel={t('activityActions', { title: activity.title })}
            trigger={
              <AppButton
                intent="text"
                size="small"
                aria-label={t('activityActions', { title: activity.title })}
                sx={{
                  minWidth: 36,
                  minHeight: 36,
                  px: 0,
                  color: 'text.secondary',
                }}
              >
                <MoreVertRoundedIcon sx={{ fontSize: '20px' }} />
              </AppButton>
            }
            items={menuItems}
          />
        ) : undefined
      }
    >
      <Stack
        direction="row"
        spacing={0.75}
        useFlexGap
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <AppCategoryIcon category={activity.category} size={20} />
          <Typography
            component="span"
            sx={{ color: 'text.secondary', fontSize: '12px' }}
          >
            {tCategory(activity.category)}
          </Typography>
        </Box>
        {activity.status !== 'PLANNED' && (
          <Typography
            component="span"
            sx={(theme) => {
              const palette = theme.vars?.palette ?? theme.palette;
              const tone = isCompleted
                ? palette.success
                : activity.status === 'IN_PROGRESS'
                  ? palette.primary
                  : undefined;
              return {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 0.75,
                py: 0.25,
                borderRadius: '6px',
                color: tone ? tone.dark : palette.text.secondary,
                bgcolor: tone
                  ? `color-mix(in srgb, ${tone.main} 10%, ${palette.background.paper})`
                  : palette.action.selected,
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: 1.5,
                letterSpacing: 'normal',
                ...theme.applyStyles('dark', {
                  color: tone ? tone.light : palette.text.secondary,
                }),
              };
            }}
          >
            {isCompleted && (
              <CheckCircleRoundedIcon sx={{ fontSize: '14px' }} />
            )}
            {tStatus(activity.status)}
          </Typography>
        )}
      </Stack>
      {activity.location && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
            minWidth: 0,
          }}
        >
          <PlaceRoundedIcon sx={{ fontSize: '14px', flexShrink: 0 }} />
          <Typography
            component="span"
            title={activity.location}
            sx={{ fontSize: '12px', lineHeight: 1.5, ...oneLineSx }}
          >
            {activity.location}
          </Typography>
        </Box>
      )}
      {!compact && activity.note && (
        <Typography
          component="span"
          title={activity.note}
          sx={{
            color: 'text.secondary',
            fontSize: '12px',
            lineHeight: 1.5,
            ...oneLineSx,
          }}
        >
          {activity.note}
        </Typography>
      )}
      {hasAmount && (
        <AppAmountRatio
          amount={Number(activity.actualSpent ?? 0)}
          total={activity.estimatedCost > 0 ? activity.estimatedCost : null}
          currency={currency}
          highlighted
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
    </AppTimelineRow>
  );
};

export default ActivityTimelineCard;
