'use client';

import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { useTranslations } from 'next-intl';
import { AppCard, AppEmptyState } from '@/base/components/ui';
import { normalizeTripCategory } from '@/base/constants';
import PlanDayTabs from '@/features/plan/components/PlanDayTabs';
import ActivityTimelineCard from '@/features/plan/components/ActivityTimelineCard';
import type { TemplateSnapshot } from '../types';

const TemplateItinerary = ({
  snapshot,
  currency,
}: {
  snapshot: TemplateSnapshot;
  currency: string;
}) => {
  const t = useTranslations('planTemplate');
  const [selectedDayId, setSelectedDayId] = useState('');
  const days = snapshot.days.map((day) => ({
    ...day,
    id: String(day.dayNumber),
    totalActivities: day.activities.length,
  }));
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];

  return (
    <Stack spacing={2} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      {selectedDay && (
        <>
          <PlanDayTabs
            days={days}
            selectedDayId={selectedDay.id}
            onSelectDay={setSelectedDayId}
          />
          <AppCard component="section" sx={{ minWidth: 0, p: { xs: 2, md: 3 }, borderRadius: '20px' }}>
            <Stack spacing={2}>
              <Typography component="h2" sx={{ fontSize: '18px', fontWeight: 700 }}>
                {t('day', { number: selectedDay.dayNumber })}
                {selectedDay.title ? ` · ${selectedDay.title}` : ''}
              </Typography>
              {selectedDay.note && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                  {selectedDay.note}
                </Typography>
              )}
              {selectedDay.activities.length ? (
                <Stack spacing={0}>
                  {selectedDay.activities.map((activity, index) => (
                    <ActivityTimelineCard
                      key={`${selectedDay.id}:${index}`}
                      activity={{
                        ...activity,
                        category: normalizeTripCategory(activity.category),
                        status: 'PLANNED',
                      }}
                      currency={currency}
                      hasNext={index < selectedDay.activities.length - 1}
                      readOnly
                    />
                  ))}
                </Stack>
              ) : (
                <AppEmptyState title={t('restDay')} icon={<EventAvailableRoundedIcon />} />
              )}
            </Stack>
          </AppCard>
        </>
      )}
      {!!snapshot.checklists.length && (
        <AppCard>
          <Stack spacing={1}>
            <Typography component="h2" sx={{ fontWeight: 700 }}>
              {t('checklist')}
            </Typography>
            <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.5 }}>
              {snapshot.checklists.map((item, index) => (
                <Typography component="li" key={index} variant="body2">
                  {item.title}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </AppCard>
      )}
    </Stack>
  );
};

export default TemplateItinerary;
