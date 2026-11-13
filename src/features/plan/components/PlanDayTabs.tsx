'use client';

import { Box, ButtonBase, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { formatDate, parseDate } from '@/base/utils';
import type { PlanDay } from '../types';

export interface PlanDayTabsProps {
  days: Pick<PlanDay, 'id' | 'dayNumber' | 'planDate' | 'totalActivities'>[];
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
        const date = parseDate(day.planDate);
        const label = date
          ? `${t(`shortWeekdays.${date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6}`)}, ${formatDate(date, 'DD/MM')}`
          : t('dayTab', { day: day.dayNumber });
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
              borderRadius: 'var(--app-radius-control)',
              border: 1,
              borderColor: isSelected ? 'primary.main' : 'divider',
              bgcolor: isSelected ? 'primary.main' : 'background.paper',
              color: isSelected ? 'primary.contrastText' : 'text.primary',
              minWidth: 112,
              flex: '1 0 112px',
              minHeight: 48,
              scrollSnapAlign: 'start',
              '&:hover': {
                bgcolor: isSelected ? 'primary.dark' : 'action.hover',
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
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default PlanDayTabs;
