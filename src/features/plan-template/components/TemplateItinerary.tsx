'use client';
import { Stack, Typography, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { AppCard } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { TemplateSnapshot } from '../types';
const TemplateItinerary = ({
  snapshot,
  currency,
}: {
  snapshot: TemplateSnapshot;
  currency: string;
}) => {
  const locale = useLocale();
  const t = useTranslations('planTemplate');
  return (
    <Stack spacing={2} sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      {snapshot.days.map((day) => (
        <AppCard key={day.dayNumber} component="section">
          <Stack spacing={1.5}>
            <Typography component="h2" sx={{ fontWeight: 700 }}>
              {t('day', { number: day.dayNumber })}
              {day.title ? ` · ${day.title}` : ''}
            </Typography>
            {day.note && (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {day.note}
              </Typography>
            )}
            {!day.activities.length && (
              <Typography variant="body2" color="text.secondary">
                {t('restDay')}
              </Typography>
            )}
            {day.activities.map((a, index) => (
              <Stack key={index} spacing={0.5}>
                <Divider />
                <Typography sx={{ fontWeight: 600 }}>{a.title}</Typography>
                <Typography variant="body2">
                  {[a.startTime?.slice(0, 5), a.endTime?.slice(0, 5)]
                    .filter(Boolean)
                    .join(' – ')}
                  {a.location ? ` · ${a.location}` : ''}
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(a.estimatedCost, currency, locale)}
                </Typography>
                {a.note && (
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {a.note}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        </AppCard>
      ))}
      {!!snapshot.checklists.length && (
        <AppCard>
          <Stack spacing={1}>
            <Typography component="h2" sx={{ fontWeight: 700 }}>
              {t('checklist')}
            </Typography>
            {snapshot.checklists.map((c, i) => (
              <Typography key={i} variant="body2">
                • {c.title}
              </Typography>
            ))}
          </Stack>
        </AppCard>
      )}
    </Stack>
  );
};
export default TemplateItinerary;
