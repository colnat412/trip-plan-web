'use client';

import { Box, ButtonBase, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/base/utils';
import type { PlanDay } from '../types';

export interface PlanDayTabsProps {
  days: PlanDay[];
  selectedDayId: string;
  currency?: string;
  onSelectDay: (dayId: string) => void;
}

const PlanDayTabs = ({
  days,
  selectedDayId,
  onSelectDay,
}: PlanDayTabsProps) => {
  const t = useTranslations('plan');
  const fitDays = days.length <= 3;

  return (
    <Box
      role="group"
      aria-label={t('chooseDay')}
      sx={{
        width: '100%',
        minWidth: 0,
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        overscrollBehaviorX: 'contain',
        scrollSnapType: 'x proximity',
        py: 0.5,
        '&::-webkit-scrollbar': { height: 4 },
      }}
    >
      {days.map((day) => {
        const isSelected = String(day.id) === String(selectedDayId);
        return (
          <ButtonBase
            key={day.id}
            onClick={() => onSelectDay(String(day.id))}
            aria-pressed={isSelected}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              py: 1.25,
              px: 1,
              borderRadius: '16px',
              border: 1,
              borderColor: isSelected ? 'primary.main' : 'divider',
              bgcolor: isSelected ? 'action.selected' : 'background.paper',
              color: isSelected ? 'primary.main' : 'text.primary',
              minWidth: 0,
              maxWidth: 112,
              minHeight: 64,
              flexGrow: fitDays ? 1 : 0,
              flexShrink: fitDays ? 1 : 0,
              flexBasis: fitDays
                ? 0
                : 'clamp(72px, calc((100% - 16px) / 3), 112px)',
              scrollSnapAlign: 'start',
              '&:hover': {
                bgcolor: isSelected ? 'action.selected' : 'action.hover',
              },
              '&.Mui-focusVisible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: -3,
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'inherit',
                maxWidth: '100%',
                overflowWrap: 'anywhere',
              }}
            >
              {t('dayTab', { day: day.dayNumber })}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                maxWidth: '100%',
                overflowWrap: 'anywhere',
              }}
            >
              {day.planDate
                ? formatDate(day.planDate, 'DD/MM')
                : t('activityCount', { count: day.totalActivities })}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default PlanDayTabs;
