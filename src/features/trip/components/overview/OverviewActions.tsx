'use client';

import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useTranslations } from 'next-intl';
import AppMascot from '@/base/components/ui/AppMascot';
import JourneyTrail from './JourneyTrail';

const OverviewActions = ({ onCreateTrip }: { onCreateTrip: () => void }) => {
  const t = useTranslations('journey');
  return (
    <Box component="section" sx={{ minWidth: 0 }}>
      <ButtonBase onClick={onCreateTrip} aria-label={t('start')}
        sx={{ width: '100%', py: { xs: 2, sm: 2.5 }, px: 0.5, gap: 2, textAlign: 'left', justifyContent: 'flex-start',
          borderRadius: 'var(--app-radius-card)', color: 'text.primary',
          '@media (hover: hover) and (pointer: fine)': { '&:hover': { bgcolor: 'action.hover' } },
          '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -3 } }}>
        <Stack sx={{ alignItems: 'center', flexShrink: 0 }}><AppMascot size={72} /><JourneyTrail /></Stack>
        <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h2" sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 600, overflowWrap: 'anywhere' }}>{t('start')}</Typography>
          <Typography variant="body2" color="text.secondary">{t('startHint')}</Typography>
        </Stack>
        <Box sx={{ display: 'flex', color: 'primary.main', flexShrink: 0 }}><ChevronRightRoundedIcon /></Box>
      </ButtonBase>
    </Box>
  );
};
export default OverviewActions;
