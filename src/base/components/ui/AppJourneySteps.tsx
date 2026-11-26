'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

interface AppJourneyStepsProps { labels: string[]; active: number }

const AppJourneySteps = ({ labels, active }: AppJourneyStepsProps) => {
  const t = useTranslations('journey');
  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" color="text.secondary" aria-live="polite">
        {t('step', { current: active + 1, total: labels.length })}
      </Typography>
      <Stack component="ol" direction="row" spacing={1} sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {labels.map((label, index) => (
          <Box component="li" key={label} aria-current={index === active ? 'step' : undefined}
            sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ height: 4, borderRadius: 'var(--app-radius-pill)', bgcolor: index <= active ? 'primary.main' : 'action.selected' }} />
            <Typography variant="caption" sx={{ color: index === active ? 'text.primary' : 'text.secondary', fontWeight: index === active ? 700 : 400 }}>{label}</Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
export default AppJourneySteps;
