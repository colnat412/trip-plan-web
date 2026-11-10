'use client';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useLocale, useTranslations } from 'next-intl';
import {
  AppActionMenu,
  AppButton,
  AppMetricValue,
  AppPageHeader,
} from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import { useRouter } from 'next/navigation';

export interface PlanHeaderProps {
  totalDays: number;
  totalActivities: number;
  completedActivities: number;
  totalEstimatedCost: number;
  currency: string;
  onOpenChecklist: () => void;
  onOpenAiPlanner?: () => void;
  onPublishTemplate?: () => void;
  onOpenShare?: () => void;
  onOpenActivityLogs?: () => void;
  readOnly?: boolean;
  onOpenExport?: () => void;
}

const PlanHeader = ({
  totalDays,
  totalActivities,
  completedActivities,
  totalEstimatedCost,
  currency,
  onOpenChecklist,
  onOpenAiPlanner,
  onOpenShare,
  onPublishTemplate,
  onOpenActivityLogs,
  readOnly = false,
  onOpenExport,
}: PlanHeaderProps) => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('plan');
  const tTemplate = useTranslations('planTemplate');
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down(360));

  return (
    <AppPageHeader
      sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
      title={t('pageTitle')}
      subtitle={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            {t('itinerarySummary', {
              days: totalDays,
              activities: totalActivities,
              completed: completedActivities,
            })}
          </Typography>
          {totalEstimatedCost > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0.75,
                minWidth: 0,
              }}
            >
              <Typography
                component="span"
                sx={{ fontSize: '13px', color: 'text.secondary' }}
              >
                {t('totalEstimatedCost')}:
              </Typography>
              <AppMetricValue sx={{ fontSize: '13px' }}>
                {formatCurrency(totalEstimatedCost, currency, locale)}
              </AppMetricValue>
            </Box>
          )}
        </Box>
      }
      titleActions={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'nowrap',
            minWidth: 0,
          }}
        >
          {!isNarrow && !readOnly && onOpenAiPlanner && (
            <AppButton
              intent="secondary"
              size="small"
              wrapLabel
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={onOpenAiPlanner}
              sx={{ minHeight: 44 }}
            >
              {t('aiPlannerBtn')}
            </AppButton>
          )}
          <AppActionMenu
            ariaLabel={t('actionsLabel')}
            triggerIcon={<MoreHorizRoundedIcon />}
            minTouchTarget
            items={[
              ...(isNarrow && !readOnly && onOpenAiPlanner
                ? [
                    {
                      id: 'ai',
                      label: t('aiPlannerBtn'),
                      icon: <AutoAwesomeRoundedIcon fontSize="small" />,
                      onClick: onOpenAiPlanner,
                    },
                  ]
                : []),
              {
                id: 'templates',
                label: tTemplate('chooseTemplate'),
                icon: <CollectionsBookmarkOutlinedIcon fontSize="small" />,
                onClick: () => router.push('/templates'),
              },
              {
                id: 'checklist',
                label: t('checklistBtn'),
                icon: <ChecklistRoundedIcon fontSize="small" />,
                onClick: onOpenChecklist,
              },
              ...(onOpenActivityLogs
                ? [
                    {
                      id: 'activity-log',
                      label: t('activityLogBtn'),
                      icon: <HistoryRoundedIcon fontSize="small" />,
                      onClick: onOpenActivityLogs,
                    },
                  ]
                : []),
              ...(onOpenExport
                ? [
                    {
                      id: 'export',
                      label: t('imageExport.title'),
                      icon: <ImageRoundedIcon fontSize="small" />,
                      onClick: onOpenExport,
                    },
                  ]
                : []),
              ...(!readOnly && onOpenShare
                ? [
                    {
                      id: 'share',
                      label: t('shareBtn'),
                      icon: <ShareRoundedIcon fontSize="small" />,
                      onClick: onOpenShare,
                    },
                  ]
                : []),
              ...(!readOnly && onPublishTemplate
                ? [
                    {
                      id: 'publish',
                      label: tTemplate('publish'),
                      icon: <PublishRoundedIcon fontSize="small" />,
                      onClick: onPublishTemplate,
                    },
                  ]
                : []),
            ]}
          />
        </Box>
      }
    />
  );
};

export default PlanHeader;
