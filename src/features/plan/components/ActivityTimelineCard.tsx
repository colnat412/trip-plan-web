'use client';

import { Box, Stack, Typography } from '@mui/material';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useTranslations } from 'next-intl';

import {
  AppActionMenu,
  AppButton,
  AppCategoryIcon,
  AppTimelineRow,
  type AppActionMenuItem,
} from '@/base/components/ui';
import { formatCurrency, formatTimeRange } from '@/base/utils';
import type { ActivityStatus, PlanActivity } from '../types';

export interface ActivityTimelineCardProps {
  activity: PlanActivity;
  currency: string;
  onEdit?: (activity: PlanActivity) => void;
  onDelete?: (activity: PlanActivity) => void;
  onToggleStatus?: (activity: PlanActivity, nextStatus: ActivityStatus) => void;
  onConvertToExpense?: (activity: PlanActivity) => void;
  readOnly?: boolean;
  hasNext?: boolean;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const ActivityTimelineCard = ({
  activity,
  currency,
  onEdit,
  onDelete,
  onToggleStatus,
  onConvertToExpense,
  readOnly = false,
  hasNext = false,
  compact = false,
  selected = false,
  onSelect,
}: ActivityTimelineCardProps) => {
  const t = useTranslations('plan');
  const tStatus = useTranslations('plan.statuses');
  const tDialog = useTranslations('plan.dialog');
  const tCategory = useTranslations('expense.categories');
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

  return (
    <AppTimelineRow
      title={activity.title}
      icon={<AppCategoryIcon category={activity.category} />}
      hasNext={hasNext}
      selected={selected}
      onSelect={onSelect}
      meta={
        activity.startTime || activity.endTime ? (
          <Typography
            component="span"
            sx={{
              color: 'text.primary',
              fontSize: '12px',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.8,
              whiteSpace: 'nowrap',
            }}
          >
            {!activity.startTime && activity.endTime && (
              <>{tDialog('endTimeLabel')}: </>
            )}
            {formatTimeRange(activity.startTime, activity.endTime)}
          </Typography>
        ) : undefined
      }
      actions={
        menuItems.length > 0 ? (
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
        <Typography
          component="span"
          sx={{
            color: 'text.secondary',
            fontSize: '12px',
            overflowWrap: 'anywhere',
          }}
        >
          {tCategory(activity.category)}
        </Typography>
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
            alignItems: 'flex-start',
            gap: 0.5,
            color: 'text.secondary',
            minWidth: 0,
          }}
        >
          <PlaceRoundedIcon sx={{ fontSize: '14px', flexShrink: 0 }} />
          <Typography
            component="span"
            sx={{
              fontSize: '12px',
              lineHeight: 1.5,
              overflowWrap: 'anywhere',
              minWidth: 0,
            }}
          >
            {activity.location}
          </Typography>
        </Box>
      )}
      {!compact && activity.note && (
        <Typography
          component="span"
          sx={{
            color: 'text.secondary',
            fontSize: '12px',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
            overflowWrap: 'anywhere',
          }}
        >
          {activity.note}
        </Typography>
      )}
      {!compact &&
        (activity.estimatedCost > 0 || Number(activity.actualSpent) > 0) && (
          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ flexWrap: 'wrap', minWidth: 0 }}
          >
            {activity.estimatedCost > 0 && (
              <Typography
                component="span"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  overflowWrap: 'anywhere',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {t('estimatedCost', {
                  cost: formatCurrency(activity.estimatedCost, currency),
                })}
              </Typography>
            )}
            {Number(activity.actualSpent) > 0 && (
              <Typography
                component="span"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  overflowWrap: 'anywhere',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {t('spentChip')}:{' '}
                <Box
                  component="span"
                  sx={{ color: 'text.primary', fontWeight: 700 }}
                >
                  {formatCurrency(activity.actualSpent ?? 0, currency)}
                </Box>
              </Typography>
            )}
          </Stack>
        )}
    </AppTimelineRow>
  );
};

export default ActivityTimelineCard;
