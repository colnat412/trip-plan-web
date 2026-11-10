'use client';

import { Box, ButtonBase, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/base/utils';
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
              borderRadius: '12px',
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
                overflowWrap: 'anywhere',
              }}
            >
              {day.planDate ? formatDate(day.planDate) : t('dayTab', { day: day.dayNumber })}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default PlanDayTabs;
