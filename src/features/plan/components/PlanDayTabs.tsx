'use client';

import { selectedSurface } from '@/base/theme/surfaces';

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
        gap: 0.75,
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
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              py: 1,
              px: 1,
              borderRadius: 'var(--app-radius-control)',
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              color: 'text.primary',
              minWidth: 104,
              flex: '1 0 104px',
              minHeight: 44,
              scrollSnapAlign: 'start',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              ...(isSelected && selectedSurface(theme)),
              '&.Mui-focusVisible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: -3,
              },
            })}
          >
            <Typography
              component="span"
              sx={{
                fontSize: '13px',
                fontWeight: 600,
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
