'use client';

import { Box, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useTranslations } from 'next-intl';
import {
  AppActionMenu,
  AppButton,
  AppMetricValue,
  AppPageHeader,
} from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';

export interface PlanHeaderProps {
  totalDays: number;
  totalActivities: number;
  completedActivities: number;
  totalEstimatedCost: number;
  currency: string;
  onAddActivity?: () => void;
  onOpenChecklist: () => void;
  onOpenAiPlanner?: () => void;
  onOpenShare?: () => void;
  onOpenActivityLogs?: () => void;
  readOnly?: boolean;
  onOpenPrint?: () => void;
}

const PlanHeader = ({
  totalDays,
  totalActivities,
  completedActivities,
  totalEstimatedCost,
  currency,
  onAddActivity,
  onOpenChecklist,
  onOpenAiPlanner,
  onOpenShare,
  onOpenActivityLogs,
  readOnly = false,
  onOpenPrint,
}: PlanHeaderProps) => {
  const t = useTranslations('plan');
  const tNavigation = useTranslations('navigation');

  return (
    <AppPageHeader
      title={
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '24px', sm: '28px' },
            fontWeight: 800,
          }}
        >
          {t('pageTitle')}
        </Typography>
      }
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
                {formatCurrency(totalEstimatedCost, currency)}
              </AppMetricValue>
            </Box>
          )}
        </Box>
      }
      actions={
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 1.5 },
            flexWrap: { xs: 'nowrap', sm: 'wrap' },
            '& > *': { flex: { xs: '1 1 0', sm: '0 0 auto' }, minWidth: 0 },
          }}
        >
          {!readOnly && onAddActivity && (
            <AppButton
              intent="primary"
              mobileIconLabel
              round
              startIcon={<AddRoundedIcon />}
              onClick={onAddActivity}
            >
              {t('addActivity')}
            </AppButton>
          )}
          <AppButton
            intent="secondary"
            mobileIconLabel
            round
            startIcon={<ChecklistRoundedIcon />}
            onClick={onOpenChecklist}
          >
            {t('checklistBtn')}
          </AppButton>
          {!readOnly && onOpenAiPlanner && (
            <AppButton
              intent="secondary"
              mobileIconLabel
              round
              startIcon={<AutoAwesomeRoundedIcon />}
              onClick={onOpenAiPlanner}
            >
              {t('aiPlannerBtn')}
            </AppButton>
          )}
          {(onOpenPrint ||
            onOpenActivityLogs ||
            (!readOnly && onOpenShare)) && (
            <AppActionMenu
              ariaLabel={tNavigation('more')}
              trigger={
                <AppButton
                  intent="secondary"
                  mobileIconLabel
                  round
                  aria-label={tNavigation('more')}
                  startIcon={<MoreHorizRoundedIcon />}
                  sx={{
                    minWidth: { sm: 44 },
                    px: { sm: 1.25 },
                    '& .MuiButton-startIcon': { margin: 0 },
                  }}
                >
                  <Box
                    component="span"
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                  >
                    {tNavigation('more')}
                  </Box>
                </AppButton>
              }
              items={[
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
                ...(onOpenPrint
                  ? [
                      {
                        id: 'print',
                        label: t('print.button'),
                        icon: <PictureAsPdfRoundedIcon fontSize="small" />,
                        onClick: onOpenPrint,
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </Box>
      }
    />
  );
};

export default PlanHeader;
